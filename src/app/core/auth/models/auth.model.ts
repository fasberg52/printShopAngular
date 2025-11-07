// بر اساس login.dto.ts
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface CheckPhoneResponse {
  userExists: boolean;
}

// بر اساس token-response.dto.ts
export interface AuthResponse {
  accessToken: string;
}

// برای داده‌های دیکد شده از توکن
export interface DecodedToken {
  sub: string;
  phone: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Registration interfaces
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  requiresOtp: boolean;
  userId?: string;
}

export interface OtpVerificationPayload {
  phone: string;
  code: string;
  action: 'registration' | 'login' | 'password-reset';
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  accessToken?: string;
}

export interface OtpRequestPayload {
  phone: string;
  action: 'registration' | 'login' | 'password-reset';
}
