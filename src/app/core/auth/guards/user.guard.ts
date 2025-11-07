import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isUser()) {
    return true;
  }

  // اگر لاگین نبود یا کاربر عادی نبود
  authService.logout(); // توکن نامعتبر را پاک کن
  router.navigate(['/user/auth/login']);
  return false;
};