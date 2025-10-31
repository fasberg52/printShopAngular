import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    // اگر لاگین بود و ادمین بود، به پنل هدایت شود
    router.navigate(['/admin']);
    return false;
  }

  // اگر لاگین نبود، اجازه دسترسی به صفحه لاگین را بده
  return true;
};
