import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { MessageService } from 'primeng/api';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth.service';
import {
  extractDigits,
  toLatinNumerals,
  toPersianNumerals,
} from '../../../../core/shared/utils';

// --- ایمپورت‌های کامپوننت‌های زیبای PrimeNG ---
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel'; // برای لیبل شناور
import { InputOtpModule } from 'primeng/inputotp'; // برای فیلد کد OTP
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { LoadingButtonComponent } from '../../../../core/shared/components/loading-button/loading-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink, // اضافه شد
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    FloatLabelModule, // اضافه شد
    InputOtpModule, // اضافه شد.
    TabsModule,
    LoadingButtonComponent, // Loading button component
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnDestroy {
  // --- سرویس‌ها ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // --- مدیریت حالت (State) ---

  loginStage = signal<'check-phone' | 'password' | 'otp'>('check-phone');
  passwordLoading = signal(false);
  phoneLoading = signal(false);
  otpLoading = signal(false);
  otpStage = signal<'request' | 'verify'>('request'); // مرحله درخواست یا تایید
  countdown = signal(0);
  showPassword = signal(false);
  private timerSubscription: Subscription | undefined;
  private codeSubscription: Subscription | undefined;

  // --- فرم ورود با رمز عبور ---
  passwordForm = this.fb.group({
    phone: ['', [Validators.required, this.phoneValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // --- فرم ورود با کد یکبار مصرف ---
  otpForm = this.fb.group({
    phone: ['', [Validators.required, this.phoneValidator()]],
    code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
  });

  loginForm = this.fb.group({
    phone: ['', [Validators.required, this.phoneValidator()]],
    // ولیدیتورهای رمز و کد در مراحل بعدی اضافه می‌شوند
    password: ['', [Validators.minLength(6)]],
    code: [''],
  });

  private phoneAutoSubmitExecuted = false;
  private lastSubmittedPhone = '';

  constructor() {
    // Format phone input to only allow numbers and auto-format
    this.loginForm.get('phone')?.valueChanges.subscribe((value) => {
      if (value) {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');
        // Limit to 11 digits and format if needed
        const formatted = cleaned.slice(0, 11);
        if (value !== formatted) {
          this.loginForm
            .get('phone')
            ?.setValue(formatted, { emitEvent: false });
          return; // Don't auto-submit on formatting
        }

        // Reset flag if phone is incomplete or changed
        if (formatted.length < 11) {
          this.phoneAutoSubmitExecuted = false;
          this.lastSubmittedPhone = '';
          return;
        }

        // Auto-submit ONLY when phone is valid according to validator
        const phoneControl = this.loginForm.get('phone');
        
        // Check if phone is valid (must pass all validators)
        phoneControl?.updateValueAndValidity({ emitEvent: false });
        
        // Only auto-submit if:
        // 1. Phone is exactly 11 digits
        // 2. Phone starts with 09
        // 3. Phone passes validator (valid === true)
        // 4. Not already submitted this phone number
        // 5. Not currently loading
        // 6. We're on the check-phone stage
        if (
          formatted.length === 11 &&
          formatted.startsWith('09') &&
          phoneControl?.valid === true &&
          formatted !== this.lastSubmittedPhone &&
          !this.phoneAutoSubmitExecuted &&
          !this.phoneLoading() &&
          this.loginStage() === 'check-phone'
        ) {
          // Small delay to ensure validation is complete and stable
          setTimeout(() => {
            const phoneControlAfterDelay = this.loginForm.get('phone');
            const currentValue = phoneControlAfterDelay?.value?.replace(/\D/g, '') || '';
            
            // Double check all conditions before submitting
            if (
              currentValue.length === 11 &&
              currentValue.startsWith('09') &&
              phoneControlAfterDelay?.valid === true &&
              currentValue !== this.lastSubmittedPhone &&
              !this.phoneLoading() &&
              this.loginStage() === 'check-phone' &&
              !this.phoneAutoSubmitExecuted
            ) {
              this.phoneAutoSubmitExecuted = true;
              this.lastSubmittedPhone = currentValue;
              this.onCheckPhone();
            }
          }, 200);
        } else if (formatted.length === 11 && !formatted.startsWith('09')) {
          // Phone is 11 digits but doesn't start with 09 - invalid, don't submit
          this.phoneAutoSubmitExecuted = false;
          this.lastSubmittedPhone = '';
        } else if (phoneControl?.invalid) {
          // Phone is invalid according to validator - don't submit
          this.phoneAutoSubmitExecuted = false;
          this.lastSubmittedPhone = '';
        }
      } else {
        // Reset flags when phone is cleared
        this.phoneAutoSubmitExecuted = false;
        this.lastSubmittedPhone = '';
      }
    });
  }

  onCheckPhone(): void {
    const phoneControl = this.loginForm.get('phone');
    if (!phoneControl?.value || phoneControl.invalid) {
      this.phoneAutoSubmitExecuted = false;
      this.lastSubmittedPhone = '';
      return this.showToast(
        'warn',
        'خطا',
        'لطفا شماره تلفن معتبر (11 رقم) وارد کنید.'
      );
    }

    const cleanedPhone = phoneControl.value.replace(/\D/g, '');
    
    // Prevent duplicate submissions for the same phone
    if (cleanedPhone === this.lastSubmittedPhone && this.phoneLoading()) {
      return;
    }

    this.phoneLoading.set(true);
    const phone = phoneControl.value;

    console.log('🔍 Checking phone:', phone);

    this.authService.checkPhone(phone).subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);
        console.log('✅ userExists value:', res.userExists);
        this.phoneLoading.set(false);
        this.phoneAutoSubmitExecuted = false; // Reset flag after API call
        phoneControl?.disable(); // شماره تلفن را قفل کن

        if (res.userExists) {
          console.log('✅ User exists, switching to password stage');
          // اگر کاربر وجود داشت، برو به مرحله رمز عبور
          this.loginStage.set('password');
          console.log('✅ Current loginStage:', this.loginStage());

          // ولیدیتور 'required' را به رمز عبور اضافه کن
          this.loginForm
            .get('password')
            ?.setValidators([Validators.required, Validators.minLength(6)]);
          this.loginForm.get('password')?.updateValueAndValidity();

          // Focus on password input after navigation
          setTimeout(() => {
            const passwordInput = document.getElementById('password');
            passwordInput?.focus();
          }, 100);
        } else {
          console.log('❌ User does not exist - showing toast now');
          // اگر کاربر وجود نداشت، خطا بده
          phoneControl?.enable(); // شماره را آزاد کن
          this.phoneAutoSubmitExecuted = false; // Reset flag on error
          this.lastSubmittedPhone = ''; // Reset to allow resubmission after error
          console.log('❌ About to call showToast');
          this.showToast(
            'error',
            'خطا',
            'این شماره وجود ندارد لطفا ثبت نام کنید'
          );
          console.log('❌ showToast called');
        }
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.phoneLoading.set(false);
        this.phoneAutoSubmitExecuted = false; // Reset flag on error
        this.lastSubmittedPhone = ''; // Reset last submitted phone on error
        phoneControl?.enable(); // Enable phone in case of error
        this.showToast('error', 'خطا', this.getBackendErrorMessage(err));
      },
    });
  }

  onPasswordSubmit(): void {
    // فقط ولید بودن بخش رمز عبور را چک می‌کنیم (تلفن قفل است)
    const passControl = this.loginForm.get('password');
    if (passControl?.invalid) {
      return this.showToast(
        'warn',
        'خطا',
        'رمز عبور باید حداقل ۶ کاراکتر باشد.'
      );
    }

    this.passwordLoading.set(true);
    const payload = {
      phone: this.loginForm.get('phone')!.value!,
      password: this.loginForm.get('password')!.value!,
    };

    this.authService.login(payload).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        this.passwordLoading.set(false);
        this.showToast(
          'error',
          'خطا در ورود',
          this.getBackendErrorMessage(err)
        );
      },
    });
  }

  switchToOtp(): void {
    this.loginStage.set('otp');
    // ولیدیتور رمز عبور را حذف کن
    this.loginForm.get('password')?.clearValidators();
    this.loginForm.get('password')?.reset();

    // ولیدیتور کد را به‌روز کن تا فقط 5 رقم فارسی را بپذیرد
    this.loginForm.get('code')?.setValidators([
      Validators.required,
      Validators.pattern(/^[۰-۹]{5}$/), // <-- تغییر به الگوی فارسی
    ]);
    this.loginForm.get('code')?.updateValueAndValidity();

    const codeControl = this.loginForm.get('code');
    this.codeSubscription?.unsubscribe();

    // به تغییرات فیلد کد گوش بده
    this.codeSubscription = codeControl?.valueChanges.subscribe((val) => {
      const value = (val ?? '').toString();

      // ۱. هر عددی (انگلیسی) را به فارسی تبدیل کن
      let persianValue = toPersianNumerals(value);
      // ۲. هر چیزی جز اعداد فارسی را حذف کن
      persianValue = extractDigits(persianValue);
      // ۳. به ۵ رقم محدود کن
      persianValue = persianValue.slice(0, 5);

      // ۴. اگر تغییری رخ داده، فرم را (بدون emit کردن) آپدیت کن
      if (val !== persianValue) {
        codeControl?.setValue(persianValue, { emitEvent: false });
      }

      // ۵. برای ارسال خودکار، چک کن که طول به ۵ رسیده
      if (persianValue.length === 5 && !this.otpLoading()) {
        this.verifyOtp();
      }
    });

    this.otpStage.set('request');
    this.requestOtp();
  }

  // (اصلاح شده) درخواست کد
  requestOtp(): void {
    this.otpLoading.set(true);
    const phone = this.loginForm.get('phone')!.value!;

    this.authService.requestLoginOtp(phone).subscribe({
      next: () => {
        this.otpLoading.set(false);
        this.otpStage.set('verify'); // برو به مرحله تایید
        this.startTimer();
        // Clear the OTP code field when resending
        this.loginForm.get('code')?.reset();
        this.showToast('success', 'موفق', 'کد تایید با موفقیت ارسال شد.');

        // Focus on OTP input after OTP is sent
        setTimeout(() => {
          const otpInput = document.querySelector(
            '[name="code_0"]'
          ) as HTMLInputElement;
          otpInput?.focus();
        }, 100);
      },
      error: (err) => {
        this.otpLoading.set(false);
        this.showToast('error', 'خطا', this.getBackendErrorMessage(err));
      },
    });
  }

  // (اصلاح شده) تایید کد
  verifyOtp(): void {
    const codeControl = this.loginForm.get('code');
    if (codeControl?.invalid) {
      return this.showToast('warn', 'خطا', 'کد تایید نامعتبر است.');
    }
    this.otpLoading.set(true);
    const phone = this.loginForm.get('phone')!.value!;
    // Convert Persian OTP code to Latin for server
    const persianCode = codeControl!.value!;
    const latinCode = toLatinNumerals(persianCode);

    this.authService.verifyLoginOtp(phone, latinCode).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        this.otpLoading.set(false);
        this.showToast(
          'error',
          'خطا در تایید',
          this.getBackendErrorMessage(err)
        );
      },
    });
  }

  // --- (۴) ابزارهای کمکی ---

  // (جدید) بازگشت به مرحله اول
  goBackToCheckPhone(): void {
    this.loginStage.set('check-phone');
    this.phoneAutoSubmitExecuted = false; // Reset flag when going back
    this.lastSubmittedPhone = ''; // Reset last submitted phone
    this.loginForm.get('phone')?.enable();
    this.loginForm.get('phone')?.reset();
    this.loginForm.get('password')?.clearValidators();
    this.loginForm.get('password')?.reset(''); // ریست به مقدار پیش‌فرض
    this.loginForm.get('code')?.clearValidators();
    this.loginForm.get('code')?.reset();
    this.timerSubscription?.unsubscribe();
    this.countdown.set(0);
    this.codeSubscription?.unsubscribe();
  }

  // (موجود) تایمر
  startTimer(): void {
    this.countdown.set(60);
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = timer(1000, 1000).subscribe(() => {
      if (this.countdown() > 0) {
        this.countdown.set(this.countdown() - 1);
      } else {
        this.timerSubscription?.unsubscribe();
        // Don't change otpStage to 'request' - keep it in 'verify' so the resend button stays visible
      }
    });
  }

  // (موجود) اعتبارسنج تلفن
  private phoneValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return { required: true };
      }
      const cleaned = control.value.replace(/\D/g, '');
      const valid = cleaned.length === 11 && /^09[0-9]{9}$/.test(cleaned);
      return valid ? null : { invalidPhone: true };
    };
  }

  // (موجود) نمایش Toast
  private showToast(severity: string, summary: string, detail: string): void {
    console.log('🔔 Showing toast:', { severity, summary, detail });
    this.messageService.add({
      severity: severity as any,
      summary,
      detail,
      life: 5000,
    });
    console.log('🔔 Toast added to MessageService');
  }

  // (موجود) ترجمه خطاهای بک‌اند
  private getBackendErrorMessage(err: any): string {
    if (err.status === 429) {
      return 'تعداد درخواست‌ها بیش از حد مجاز است. لطفا بعدا تلاش کنید.';
    }
    if (err.status === 401) {
      return 'کد/رمز عبور نامعتبر است یا منقضی شده.';
    }
    if (err.status === 404) {
      return 'کاربری با این شماره تلفن یافت نشد.';
    }
    if (err.status === 0 || err.status === 500) {
      return 'خطا در ارتباط با سرور. لطفا اتصال اینترنت را بررسی کنید.';
    }
    return err.error?.message || 'خطا در ارتباط با سرور.';
  }

  // (موجود) پاکسازی تایمر
  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.codeSubscription?.unsubscribe();
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
