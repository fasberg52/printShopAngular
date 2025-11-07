import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  AuthResponse,
  CheckPhoneResponse,
  DecodedToken,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  OtpVerificationPayload,
  OtpVerificationResponse,
  OtpRequestPayload,
} from '../../../core/auth/models/auth.model';
import { StorageService } from '../../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token';

  checkPhone(phone: string): Observable<CheckPhoneResponse> {
    return this.http.post<CheckPhoneResponse>(
      `${this.apiUrl}/auth/check-phone`,
      { phone }
    );
  }

  // --- ورود با رمز عبور (موجود) ---
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/password`, payload)
      .pipe(tap((response) => this.saveToken(response.accessToken)));
  }

  // === متدهای جدید برای ورود با OTP ===

  /**
   * درخواست کد OTP برای ورود (بر اساس auth.controller.ts)
   */
  requestLoginOtp(phone: string): Observable<any> {
    // بک‌اند شما برای این اکشن به 'login' نیاز دارد
    const payload = { phone, action: 'login' };
    return this.http.post(`${this.apiUrl}/auth/request-otp`, payload);
  }

  /**
   * تایید کد OTP و ورود نهایی (بر اساس auth.controller.ts)
   */
  verifyLoginOtp(phone: string, code: string): Observable<AuthResponse> {
    const payload = { phone, code };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login/verify-otp`, payload)
      .pipe(tap((response) => this.saveToken(response.accessToken)));
  }

  // === متدهای ثبت نام کاربران ===

  /**
   * ثبت نام کاربر جدید
   */
  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  /**
   * درخواست کد OTP برای ثبت نام
   */
  requestRegistrationOtp(phone: string): Observable<any> {
    const payload: OtpRequestPayload = { phone, action: 'registration' };
    return this.http.post(`${this.apiUrl}/auth/request-otp`, payload);
  }

  /**
   * تایید کد OTP برای ثبت نام
   */
  verifyRegistrationOtp(phone: string, code: string): Observable<OtpVerificationResponse> {
    const payload: OtpVerificationPayload = { phone, code, action: 'registration' };
    return this.http.post<OtpVerificationResponse>(`${this.apiUrl}/auth/verify-otp`, payload)
      .pipe(tap((response) => {
        if (response.accessToken) {
          this.saveToken(response.accessToken);
        }
      }));
  }

  // === متدهای بازیابی رمز عبور ===

  /**
   * درخواست کد OTP برای بازیابی رمز عبور
   */
  requestPasswordResetOtp(phone: string): Observable<any> {
    const payload: OtpRequestPayload = { phone, action: 'password-reset' };
    return this.http.post(`${this.apiUrl}/auth/request-otp`, payload);
  }

  /**
   * تایید کد OTP برای بازیابی رمز عبور
   */
  verifyPasswordResetOtp(phone: string, code: string): Observable<OtpVerificationResponse> {
    const payload: OtpVerificationPayload = { phone, code, action: 'password-reset' };
    return this.http.post<OtpVerificationResponse>(`${this.apiUrl}/auth/verify-otp`, payload);
  }

  /**
   * تنظیم رمز عبور جدید پس از تایید OTP
   */
  resetPassword(phone: string, newPassword: string, otpCode: string): Observable<any> {
    const payload = { phone, newPassword, otpCode };
    return this.http.post(`${this.apiUrl}/auth/reset-password`, payload);
  }

  // --- متدهای کمکی (موجود) ---
  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const isExpired = decoded.exp < Date.now() / 1000;
      return !isExpired;
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (!this.isLoggedIn()) {
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.roles && decoded.roles.includes('admin');
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  }

  isUser(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (!this.isLoggedIn()) {
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.roles && decoded.roles.includes('user');
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  }
}
