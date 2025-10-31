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
