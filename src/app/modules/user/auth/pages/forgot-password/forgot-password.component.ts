import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { StepsModule } from 'primeng/steps';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

// Services and Components
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { PersianValidationService } from '../../../../../core/services/persian-validation.service';
import { LoadingButtonComponent } from '../../../../../core/shared/components/loading-button/loading-button.component';

interface MenuItem {
  label: string;
}

@Component({
  selector: 'app-user-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    StepsModule,
    MessageModule,
    ToastModule,
    InputOtpModule,
    PasswordModule,
    LoadingButtonComponent
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 rtl-container">
      <p-toast position="top-center"></p-toast>
      
      <div class="w-full max-w-md">
        <p-card>
          <ng-template pTemplate="header">
            <div class="text-center p-4">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">بازیابی رمز عبور</h1>
              <p class="text-gray-600 text-sm">برای بازیابی رمز عبور خود مراحل زیر را دنبال کنید</p>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <!-- Steps Indicator -->
            <div class="mb-6">
              <p-steps 
                [model]="steps" 
                [activeIndex]="activeStep" 
                [readonly]="true"
                styleClass="steps-custom">
              </p-steps>
            </div>

            <!-- Step 1: Phone Number Input -->
            <div *ngIf="activeStep === 0" class="step-content">
              <form [formGroup]="phoneForm" (ngSubmit)="onPhoneSubmit()">
                <div class="mb-4">
                  <p-floatlabel>
                    <input 
                      pInputText 
                      id="phone"
                      formControlName="phone"
                      class="w-full"
                      [class.ng-invalid]="phoneForm.get('phone')?.invalid && phoneForm.get('phone')?.touched"
                      placeholder="شماره موبایل خود را وارد کنید"
                      maxlength="11"
                      dir="ltr">
                    <label for="phone">شماره موبایل</label>
                  </p-floatlabel>
                  
                  <div *ngIf="phoneForm.get('phone')?.invalid && phoneForm.get('phone')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    {{ getFieldError('phone') }}
                  </div>
                </div>

                <p-message 
                  *ngIf="errorMessage" 
                  severity="error" 
                  [text]="errorMessage"
                  class="mb-4">
                </p-message>

                <app-loading-button
                  type="submit"
                  [loading]="isLoading"
                  [disabled]="phoneForm.invalid"
                  label="ارسال کد تایید"
                  loadingLabel="در حال ارسال..."
                  styleClass="w-full">
                </app-loading-button>
              </form>
            </div>

            <!-- Step 2: OTP Verification -->
            <div *ngIf="activeStep === 1" class="step-content">
              <div class="text-center mb-4">
                <p class="text-gray-600 mb-2">کد تایید به شماره زیر ارسال شد:</p>
                <p class="font-semibold text-lg">{{ phoneNumber }}</p>
              </div>

              <form [formGroup]="otpForm" (ngSubmit)="onOtpSubmit()">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">کد تایید</label>
                  <p-inputOtp 
                    formControlName="otpCode"
                    [length]="6"
                    styleClass="otp-input-custom">
                  </p-inputOtp>
                  
                  <div *ngIf="otpForm.get('otpCode')?.invalid && otpForm.get('otpCode')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    کد تایید را وارد کنید
                  </div>
                </div>

                <p-message 
                  *ngIf="errorMessage" 
                  severity="error" 
                  [text]="errorMessage"
                  class="mb-4">
                </p-message>

                <div class="space-y-3">
                  <app-loading-button
                    type="submit"
                    [loading]="isVerifyingOtp"
                    [disabled]="otpForm.invalid"
                    label="تایید کد"
                    loadingLabel="در حال تایید..."
                    styleClass="w-full">
                  </app-loading-button>

                  <div class="text-center">
                    <button 
                      type="button"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                      [disabled]="resendCooldown > 0 || isResendingOtp"
                      (click)="resendOtp()">
                      <span *ngIf="resendCooldown > 0">
                        ارسال مجدد کد ({{ resendCooldown }} ثانیه)
                      </span>
                      <span *ngIf="resendCooldown === 0 && !isResendingOtp">
                        ارسال مجدد کد
                      </span>
                      <span *ngIf="isResendingOtp">
                        در حال ارسال...
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- Step 3: New Password -->
            <div *ngIf="activeStep === 2" class="step-content">
              <div class="text-center mb-4">
                <p class="text-green-600 mb-2">✓ کد تایید با موفقیت تایید شد</p>
                <p class="text-gray-600">رمز عبور جدید خود را وارد کنید</p>
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
                <div class="mb-4">
                  <p-floatlabel>
                    <p-password 
                      formControlName="newPassword"
                      inputId="newPassword"
                      [toggleMask]="true"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [class.ng-invalid]="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched"
                      placeholder="رمز عبور جدید">
                    </p-password>
                    <label for="newPassword">رمز عبور جدید</label>
                  </p-floatlabel>
                  
                  <div *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    {{ getFieldError('newPassword') }}
                  </div>
                </div>

                <div class="mb-4">
                  <p-floatlabel>
                    <p-password 
                      formControlName="confirmPassword"
                      inputId="confirmPassword"
                      [toggleMask]="true"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [class.ng-invalid]="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched"
                      placeholder="تکرار رمز عبور جدید">
                    </p-password>
                    <label for="confirmPassword">تکرار رمز عبور جدید</label>
                  </p-floatlabel>
                  
                  <div *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    {{ getFieldError('confirmPassword') }}
                  </div>
                </div>

                <p-message 
                  *ngIf="errorMessage" 
                  severity="error" 
                  [text]="errorMessage"
                  class="mb-4">
                </p-message>

                <app-loading-button
                  type="submit"
                  [loading]="isResettingPassword"
                  [disabled]="passwordForm.invalid"
                  label="تغییر رمز عبور"
                  loadingLabel="در حال تغییر..."
                  styleClass="w-full">
                </app-loading-button>
              </form>
            </div>

            <!-- Step 4: Success -->
            <div *ngIf="activeStep === 3" class="step-content text-center">
              <div class="mb-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-check text-green-600 text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">رمز عبور با موفقیت تغییر کرد</h3>
                <p class="text-gray-600">اکنون می‌توانید با رمز عبور جدید وارد شوید</p>
              </div>

              <button 
                type="button"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                (click)="goToLogin()">
                ورود به حساب کاربری
              </button>
            </div>
          </ng-template>

          <ng-template pTemplate="footer">
            <div class="text-center">
              <a 
                routerLink="/user/auth/login" 
                class="text-blue-600 hover:text-blue-800 text-sm">
                بازگشت به صفحه ورود
              </a>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .rtl-container {
      direction: rtl;
      font-family: 'Vazir Matn', sans-serif;
    }

    .step-content {
      min-height: 200px;
    }

    .steps-custom :deep(.p-steps-item) {
      flex: 1;
    }

    .steps-custom :deep(.p-steps-title) {
      font-family: 'Vazir Matn', sans-serif;
      font-size: 0.875rem;
    }

    .otp-input-custom :deep(.p-inputotp) {
      justify-content: center;
      gap: 0.5rem;
    }

    .otp-input-custom :deep(.p-inputotp-input) {
      width: 2.5rem;
      height: 2.5rem;
      text-align: center;
      font-size: 1.125rem;
      font-weight: 600;
    }

    /* RTL adjustments */
    :deep(.p-float-label) {
      direction: rtl;
    }

    :deep(.p-inputtext) {
      text-align: right;
    }

    :deep(.p-password) {
      direction: rtl;
    }

    :deep(.p-password-input) {
      text-align: right;
    }

    /* Steps RTL */
    .steps-custom :deep(.p-steps) {
      direction: rtl;
    }

    .steps-custom :deep(.p-steps-item) {
      text-align: center;
    }
  `]
})
export class UserForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  // Forms
  phoneForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;

  // State
  activeStep = 0;
  phoneNumber = '';
  otpCode = '';
  isLoading = false;
  isVerifyingOtp = false;
  isResendingOtp = false;
  isResettingPassword = false;
  errorMessage = '';
  resendCooldown = 0;
  private resendTimer?: number;

  // Steps configuration
  steps: MenuItem[] = [
    { label: 'شماره موبایل' },
    { label: 'کد تایید' },
    { label: 'رمز عبور جدید' },
    { label: 'تکمیل' }
  ];

  ngOnInit(): void {
    this.initializeForms();
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }

  private initializeForms(): void {
    // Phone form
    this.phoneForm = this.fb.group({
      phone: ['', [
        Validators.required,
        PersianValidationService.persianPhone()
      ]]
    });

    // OTP form
    this.otpForm = this.fb.group({
      otpCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });

    // Password form
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, { validators: this.passwordMatchValidator });
  }

  onPhoneSubmit(): void {
    if (this.phoneForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.phoneNumber = this.phoneForm.value.phone;

      this.authService.requestPasswordResetOtp(this.phoneNumber).subscribe({
        next: () => {
          this.isLoading = false;
          this.activeStep = 1;
          this.startResendCooldown();
          this.messageService.add({
            severity: 'success',
            summary: 'ارسال کد',
            detail: 'کد تایید به شماره موبایل شما ارسال شد'
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'خطا در ارسال کد تایید';
          console.error('Request OTP error:', error);
        }
      });
    } else {
      this.phoneForm.markAllAsTouched();
    }
  }

  onOtpSubmit(): void {
    if (this.otpForm.valid) {
      this.isVerifyingOtp = true;
      this.errorMessage = '';
      this.otpCode = this.otpForm.value.otpCode;

      this.authService.verifyPasswordResetOtp(this.phoneNumber, this.otpCode).subscribe({
        next: (response) => {
          this.isVerifyingOtp = false;
          if (response.success) {
            this.activeStep = 2;
            this.messageService.add({
              severity: 'success',
              summary: 'تایید موفق',
              detail: 'کد تایید با موفقیت تایید شد'
            });
          } else {
            this.errorMessage = response.message || 'کد تایید نامعتبر است';
          }
        },
        error: (error) => {
          this.isVerifyingOtp = false;
          this.errorMessage = error.message || 'خطا در تایید کد';
          console.error('Verify OTP error:', error);
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.isResettingPassword = true;
      this.errorMessage = '';
      const newPassword = this.passwordForm.value.newPassword;

      this.authService.resetPassword(this.phoneNumber, newPassword, this.otpCode).subscribe({
        next: () => {
          this.isResettingPassword = false;
          this.activeStep = 3;
          this.messageService.add({
            severity: 'success',
            summary: 'موفقیت',
            detail: 'رمز عبور با موفقیت تغییر کرد'
          });
        },
        error: (error) => {
          this.isResettingPassword = false;
          this.errorMessage = error.message || 'خطا در تغییر رمز عبور';
          console.error('Reset password error:', error);
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  resendOtp(): void {
    if (this.resendCooldown > 0) return;

    this.isResendingOtp = true;
    this.errorMessage = '';

    this.authService.requestPasswordResetOtp(this.phoneNumber).subscribe({
      next: () => {
        this.isResendingOtp = false;
        this.startResendCooldown();
        this.messageService.add({
          severity: 'success',
          summary: 'ارسال مجدد',
          detail: 'کد تایید مجدداً ارسال شد'
        });
      },
      error: (error) => {
        this.isResendingOtp = false;
        this.errorMessage = error.message || 'خطا در ارسال مجدد کد';
        console.error('Resend OTP error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/user/auth/login']);
  }

  private startResendCooldown(): void {
    this.resendCooldown = 60;
    this.resendTimer = window.setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  private passwordStrengthValidator() {
    return (control: any) => {
      if (!control.value) return null;

      const password = control.value;
      const hasNumber = /[0-9]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasPersian = /[\u0600-\u06FF]/.test(password);

      const validConditions = [hasNumber, hasLower, hasUpper, hasSpecial, hasPersian].filter(Boolean).length;

      if (password.length < 8) {
        return { passwordStrength: { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' } };
      }

      if (validConditions < 3) {
        return { 
          passwordStrength: { 
            message: 'رمز عبور باید شامل حداقل ۳ مورد از: حروف کوچک، بزرگ، عدد، کاراکتر خاص یا حروف فارسی باشد' 
          } 
        };
      }

      return null;
    };
  }

  private passwordMatchValidator = (group: FormGroup) => {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    
    return null;
  };

  getFieldError(fieldName: string): string {
    const field = this.getFormField(fieldName);
    if (field && field.errors) {
      if (fieldName === 'phone') {
        return PersianValidationService.getPersianErrorMessage(field.errors);
      } else if (fieldName === 'newPassword') {
        if (field.errors['required']) return 'رمز عبور الزامی است';
        if (field.errors['minlength']) return 'رمز عبور باید حداقل ۸ کاراکتر باشد';
        if (field.errors['passwordStrength']) return field.errors['passwordStrength'].message;
      } else if (fieldName === 'confirmPassword') {
        if (field.errors['required']) return 'تکرار رمز عبور الزامی است';
        if (field.errors['passwordMismatch']) return 'رمز عبور و تکرار آن یکسان نیستند';
      }
    }
    return '';
  }

  private getFormField(fieldName: string) {
    if (this.activeStep === 0) return this.phoneForm.get(fieldName);
    if (this.activeStep === 1) return this.otpForm.get(fieldName);
    if (this.activeStep === 2) return this.passwordForm.get(fieldName);
    return null;
  }
}