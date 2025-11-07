import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { LoadingButtonComponent } from '../../../../../core/shared/components/loading-button/loading-button.component';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CardModule,
    DividerModule,
    ToastModule,
    LoadingButtonComponent
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <p-card class="w-full max-w-md">
        <ng-template pTemplate="header">
          <div class="text-center p-4">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">ورود کاربران</h1>
            <p class="text-gray-600">به پنل کاربری خود وارد شوید</p>
          </div>
        </ng-template>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <p-floatlabel>
              <input 
                pInputText 
                id="phone" 
                formControlName="phone"
                class="w-full"
                [class.ng-invalid]="loginForm.get('phone')?.invalid && loginForm.get('phone')?.touched"
              />
              <label for="phone">شماره تلفن</label>
            </p-floatlabel>
            <small 
              class="text-red-500 block mt-1" 
              *ngIf="loginForm.get('phone')?.invalid && loginForm.get('phone')?.touched"
            >
              شماره تلفن معتبر وارد کنید
            </small>
          </div>

          <div>
            <p-floatlabel>
              <input 
                pInputText 
                id="password" 
                type="password"
                formControlName="password"
                class="w-full"
                [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <label for="password">رمز عبور</label>
            </p-floatlabel>
            <small 
              class="text-red-500 block mt-1" 
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              رمز عبور الزامی است
            </small>
          </div>

          <app-loading-button
            [loading]="isLoading"
            [disabled]="loginForm.invalid"
            type="submit"
            label="ورود"
            loadingLabel="در حال ورود..."
            styleClass="w-full"
            severity="primary"
          ></app-loading-button>
        </form>

        <p-divider></p-divider>

        <div class="text-center space-y-3">
          <button 
            type="button" 
            class="text-blue-600 hover:text-blue-800 text-sm"
            (click)="goToRegister()"
          >
            حساب کاربری ندارید؟ ثبت نام کنید
          </button>
          <br>
          <button 
            type="button" 
            class="text-gray-600 hover:text-gray-800 text-sm"
            (click)="goToForgotPassword()"
          >
            رمز عبور خود را فراموش کرده‌اید؟
          </button>
        </div>
      </p-card>

      <p-toast position="top-center"></p-toast>
    </div>
  `,
  styles: [`
    :host {
      direction: rtl;
      font-family: 'Vazir Matn', sans-serif;
    }
  `]
})
export class UserLoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { phone, password } = this.loginForm.value;

      this.authService.login({ phone, password }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'موفق',
            detail: 'با موفقیت وارد شدید'
          });
          this.router.navigate(['/user/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'خطا',
            detail: 'نام کاربری یا رمز عبور اشتباه است'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/user/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/user/auth/forgot-password']);
  }
}