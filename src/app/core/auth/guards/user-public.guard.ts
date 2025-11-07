import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userPublicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isUser()) {
    // اگر لاگین بود و کاربر عادی بود، به پنل کاربری هدایت شود
    router.navigate(['/user/dashboard']);
    return false;
  }

  // اگر لاگین نبود، اجازه دسترسی به صفحه لاگین را بده
  return true;
};