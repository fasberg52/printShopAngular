import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageService } from 'primeng/api';

// Services
import { PersianValidationService } from '../../../../../core/services/persian-validation.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { LoadingButtonComponent } from '../../../../../core/shared/components/loading-button/loading-button.component';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CardModule,
    DividerModule,
    ToastModule,
    DialogModule,
    InputOtpModule,
    LoadingButtonComponent
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 rtl-container">
      <p-toast position="top-right"></p-toast>
      
      <div class="w-full max-w-md">
        <p-card class="rtl-layout">
          <ng-template pTemplate="header">
            <div class="text-center py-4">
              <h1 class="text-2xl font-bold text-gray-900 persian-text">ثبت نام</h1>
              <p class="text-gray-600 mt-2 persian-text">حساب کاربری جدید ایجاد کنید</p>
            </div>
          </ng-template>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="rtl-form space-y-6">
            <!-- نام و نام خانوادگی -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-field">
                <p-floatlabel>
                  <input 
                    pInputText 
                    id="firstName" 
                    formControlName="firstName"
                    class="w-full"
                    [class.p-invalid]="isFieldInvalid('firstName')"
                  />
                  <label for="firstName" class="persian-text">نام</label>
                </p-floatlabel>
                <small 
                  class="p-error block mt-1 persian-text" 
                  *ngIf="isFieldInvalid('firstName')"
                >
                  {{ getFieldError('firstName') }}
                </small>
              </div>

              <div class="p-field">
                <p-floatlabel>
                  <input 
                    pInputText 
                    id="lastName" 
                    formControlName="lastName"
                    class="w-full"
                    [class.p-invalid]="isFieldInvalid('lastName')"
                  />
                  <label for="lastName" class="persian-text">نام خانوادگی</label>
                </p-floatlabel>
                <small 
                  class="p-error block mt-1 persian-text" 
                  *ngIf="isFieldInvalid('lastName')"
                >
                  {{ getFieldError('lastName') }}
                </small>
              </div>
            </div>

            <!-- شماره تلفن همراه -->
            <div class="p-field">
              <p-floatlabel>
                <input 
                  pInputText 
                  id="phone" 
                  formControlName="phone"
                  class="w-full"
                  placeholder="09123456789"
                  [class.p-invalid]="isFieldInvalid('phone')"
                />
                <label for="phone" class="persian-text">شماره تلفن همراه</label>
              </p-floatlabel>
              <small 
                class="p-error block mt-1 persian-text" 
                *ngIf="isFieldInvalid('phone')"
              >
                {{ getFieldError('phone') }}
              </small>
            </div>

            <!-- آدرس ایمیل (اختیاری) -->
            <div class="p-field">
              <p-floatlabel>
                <input 
                  pInputText 
                  id="email" 
                  formControlName="email"
                  type="email"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('email')"
                />
                <label for="email" class="persian-text">آدرس ایمیل (اختیاری)</label>
              </p-floatlabel>
              <small 
                class="p-error block mt-1 persian-text" 
                *ngIf="isFieldInvalid('email')"
              >
                {{ getFieldError('email') }}
              </small>
            </div>

            <!-- رمز عبور -->
            <div class="p-field">
              <p-floatlabel>
                <input 
                  pInputText 
                  id="password" 
                  formControlName="password"
                  type="password"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('password')"
                />
                <label for="password" class="persian-text">رمز عبور</label>
              </p-floatlabel>
              <small 
                class="p-error block mt-1 persian-text" 
                *ngIf="isFieldInvalid('password')"
              >
                {{ getFieldError('password') }}
              </small>
              
              <!-- نشانگر قدرت رمز عبور -->
              <div class="mt-2" *ngIf="registerForm.get('password')?.value">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      [class]="getPasswordStrengthClass()"
                      [style.width.%]="getPasswordStrengthPercentage()"
                    ></div>
                  </div>
                  <span class="text-sm persian-text" [class]="getPasswordStrengthTextClass()">
                    {{ getPasswordStrengthText() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- تایید رمز عبور -->
            <div class="p-field">
              <p-floatlabel>
                <input 
                  pInputText 
                  id="confirmPassword" 
                  formControlName="confirmPassword"
                  type="password"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('confirmPassword')"
                />
                <label for="confirmPassword" class="persian-text">تایید رمز عبور</label>
              </p-floatlabel>
              <small 
                class="p-error block mt-1 persian-text" 
                *ngIf="isFieldInvalid('confirmPassword')"
              >
                {{ getFieldError('confirmPassword') }}
              </small>
            </div>

            <!-- دکمه ثبت نام -->
            <app-loading-button
              [loading]="isLoading"
              [disabled]="registerForm.invalid"
              type="submit"
              class="w-full"
              severity="primary"
              size="large"
            >
              <span class="persian-text">ثبت نام</span>
            </app-loading-button>
          </form>

          <ng-template pTemplate="footer">
            <p-divider></p-divider>
            <div class="text-center">
              <p class="text-gray-600 persian-text">
                قبلاً حساب کاربری دارید؟
                <a 
                  routerLink="../login" 
                  class="text-blue-600 hover:text-blue-800 font-medium persian-text"
                >
                  وارد شوید
                </a>
              </p>
            </div>
          </ng-template>
        </p-card>
      </div>

      <!-- OTP Verification Dialog -->
      <p-dialog 
        [(visible)]="showOtpDialog" 
        [modal]="true" 
        [closable]="false"
        [draggable]="false"
        [resizable]="false"
        styleClass="rtl-dialog"
        header="تایید شماره تلفن"
        [style]="{ width: '400px' }"
      >
        <div class="text-center space-y-4">
          <p class="text-gray-700 persian-text mb-4">
            کد تایید به شماره {{ registerForm.get('phone')?.value }} ارسال شد
          </p>
          
          <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" class="space-y-4">
            <div class="p-field">
              <label class="block text-sm font-medium text-gray-700 persian-text mb-2">
                کد تایید ۶ رقمی
              </label>
              <p-inputOtp 
                formControlName="otpCode"
                [length]="6"
                [integerOnly]="true"
                class="flex justify-center"
                [class.p-invalid]="isOtpFieldInvalid('otpCode')"
              ></p-inputOtp>
              <small 
                class="p-error block mt-1 persian-text text-center" 
                *ngIf="isOtpFieldInvalid('otpCode')"
              >
                {{ getOtpFieldError('otpCode') }}
              </small>
            </div>

            <div class="flex gap-3 justify-center">
              <app-loading-button
                [loading]="isVerifyingOtp"
                [disabled]="otpForm.invalid"
                type="submit"
                severity="primary"
                class="flex-1"
              >
                <span class="persian-text">تایید</span>
              </app-loading-button>
              
              <p-button
                type="button"
                severity="secondary"
                [outlined]="true"
                [disabled]="isVerifyingOtp"
                (onClick)="cancelOtpVerification()"
                class="flex-1"
              >
                <span class="persian-text">انصراف</span>
              </p-button>
            </div>

            <div class="text-center">
              <button
                type="button"
                class="text-blue-600 hover:text-blue-800 text-sm persian-text"
                [disabled]="resendCooldown > 0 || isResendingOtp"
                (click)="resendOtp()"
              >
                <span *ngIf="resendCooldown === 0 && !isResendingOtp">ارسال مجدد کد</span>
                <span *ngIf="resendCooldown > 0">ارسال مجدد در {{ resendCooldown }} ثانیه</span>
                <span *ngIf="isResendingOtp">در حال ارسال...</span>
              </button>
            </div>
          </form>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      direction: rtl;
      font-family: 'Vazirmatn', sans-serif;
    }

    .p-card {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      border: none;
    }

    .p-field {
      margin-bottom: 1.5rem;
    }

    .p-floatlabel > label {
      right: 0.75rem !important;
      left: auto !important;
      transform-origin: top right !important;
    }

    .p-inputtext {
      text-align: right !important;
      direction: rtl !important;
    }

    .persian-text {
      font-family: 'Vazirmatn', sans-serif;
      direction: rtl;
      text-align: right;
    }

    /* Password strength indicator colors */
    .strength-weak {
      background-color: #ef4444;
    }

    .strength-medium {
      background-color: #f59e0b;
    }

    .strength-strong {
      background-color: #10b981;
    }

    .text-weak {
      color: #ef4444;
    }

    .text-medium {
      color: #f59e0b;
    }

    .text-strong {
      color: #10b981;
    }
  `]
})
export class UserRegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  registerForm!: FormGroup;
  otpForm!: FormGroup;
  isLoading = false;
  showOtpDialog = false;
  isVerifyingOtp = false;
  isResendingOtp = false;
  resendCooldown = 0;
  private resendTimer?: any;

  ngOnInit(): void {
    this.initializeForm();
    this.initializeOtpForm();
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        PersianValidationService.persianName()
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        PersianValidationService.persianName()
      ]],
      phone: ['', [
        Validators.required,
        PersianValidationService.persianPhone()
      ]],
      email: ['', [
        PersianValidationService.persianEmail()
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private initializeOtpForm(): void {
    this.otpForm = this.fb.group({
      otpCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d{6}$/)
      ]]
    });
  }

  private passwordStrengthValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasPersian = /[\u0600-\u06FF]/.test(password);

    const validConditions = [hasNumber, hasLower, hasUpper, hasSpecial, hasPersian].filter(Boolean).length;

    if (password.length < 8) {
      return { passwordWeak: { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' } };
    }

    if (validConditions < 2) {
      return { passwordWeak: { message: 'رمز عبور باید شامل حروف، اعداد یا علائم باشد' } };
    }

    return null;
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: { message: 'رمز عبور و تایید آن یکسان نیستند' } });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors) {
      return PersianValidationService.getPersianErrorMessage(field.errors);
    }
    return '';
  }

  getPasswordStrengthPercentage(): number {
    const password = this.registerForm.get('password')?.value || '';
    if (!password) return 0;

    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasPersian = /[\u0600-\u06FF]/.test(password);

    const validConditions = [hasNumber, hasLower, hasUpper, hasSpecial, hasPersian].filter(Boolean).length;
    const lengthScore = Math.min(password.length / 12, 1);

    if (password.length < 8) return 25;
    if (validConditions < 2) return 40;
    if (validConditions < 3) return 60;
    if (validConditions < 4) return 80;
    return 100;
  }

  getPasswordStrengthClass(): string {
    const percentage = this.getPasswordStrengthPercentage();
    if (percentage < 50) return 'strength-weak';
    if (percentage < 80) return 'strength-medium';
    return 'strength-strong';
  }

  getPasswordStrengthText(): string {
    const percentage = this.getPasswordStrengthPercentage();
    if (percentage < 50) return 'ضعیف';
    if (percentage < 80) return 'متوسط';
    return 'قوی';
  }

  getPasswordStrengthTextClass(): string {
    const percentage = this.getPasswordStrengthPercentage();
    if (percentage < 50) return 'text-weak';
    if (percentage < 80) return 'text-medium';
    return 'text-strong';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const registerData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        phone: this.registerForm.value.phone,
        email: this.registerForm.value.email || undefined,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.requiresOtp) {
            // Show OTP verification dialog
            this.showOtpDialog = true;
            this.startResendCooldown();
            this.messageService.add({
              severity: 'info',
              summary: 'تایید شماره تلفن',
              detail: 'کد تایید به شماره تلفن شما ارسال شد',
              life: 5000
            });
          } else {
            // Registration completed without OTP
            this.messageService.add({
              severity: 'success',
              summary: 'موفقیت',
              detail: 'ثبت نام با موفقیت انجام شد',
              life: 5000
            });
            this.router.navigate(['/user/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          let errorMessage = 'خطا در ثبت نام. لطفاً دوباره تلاش کنید';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 409) {
            errorMessage = 'این شماره تلفن قبلاً ثبت شده است';
          } else if (error.status === 400) {
            errorMessage = 'اطلاعات وارد شده معتبر نیست';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'خطا',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'لطفاً تمام فیلدهای الزامی را به درستی پر کنید',
        life: 5000
      });
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      this.isVerifyingOtp = true;
      const phone = this.registerForm.value.phone;
      const otpCode = this.otpForm.value.otpCode;

      this.authService.verifyRegistrationOtp(phone, otpCode).subscribe({
        next: (response) => {
          this.isVerifyingOtp = false;
          
          if (response.success) {
            this.showOtpDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'موفقیت',
              detail: 'ثبت نام با موفقیت تکمیل شد',
              life: 5000
            });
            
            // Navigate to user dashboard
            this.router.navigate(['/user/dashboard']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'خطا',
              detail: response.message || 'کد تایید نامعتبر است',
              life: 5000
            });
          }
        },
        error: (error) => {
          this.isVerifyingOtp = false;
          console.error('OTP verification error:', error);
          
          let errorMessage = 'خطا در تایید کد. لطفاً دوباره تلاش کنید';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'کد تایید نامعتبر است';
          } else if (error.status === 410) {
            errorMessage = 'کد تایید منقضی شده است';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'خطا',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.otpForm.get('otpCode')?.markAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'لطفاً کد تایید ۶ رقمی را وارد کنید',
        life: 3000
      });
    }
  }

  resendOtp(): void {
    if (this.resendCooldown > 0 || this.isResendingOtp) {
      return;
    }

    this.isResendingOtp = true;
    const phone = this.registerForm.value.phone;

    this.authService.requestRegistrationOtp(phone).subscribe({
      next: () => {
        this.isResendingOtp = false;
        this.startResendCooldown();
        this.messageService.add({
          severity: 'success',
          summary: 'ارسال مجدد',
          detail: 'کد تایید مجدداً ارسال شد',
          life: 3000
        });
      },
      error: (error) => {
        this.isResendingOtp = false;
        console.error('Resend OTP error:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'خطا در ارسال مجدد کد. لطفاً دوباره تلاش کنید',
          life: 5000
        });
      }
    });
  }

  cancelOtpVerification(): void {
    this.showOtpDialog = false;
    this.otpForm.reset();
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
    this.resendCooldown = 0;
  }

  private startResendCooldown(): void {
    this.resendCooldown = 60; // 60 seconds cooldown
    
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
    
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  // OTP form validation methods
  isOtpFieldInvalid(fieldName: string): boolean {
    const field = this.otpForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getOtpFieldError(fieldName: string): string {
    const field = this.otpForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'کد تایید الزامی است';
      }
      if (field.errors['minlength'] || field.errors['maxlength']) {
        return 'کد تایید باید ۶ رقم باشد';
      }
      if (field.errors['pattern']) {
        return 'کد تایید باید فقط شامل اعداد باشد';
      }
    }
    return '';
  }
}