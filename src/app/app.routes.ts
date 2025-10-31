import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards/admin.guard';
import { publicGuard } from './core/auth/guards/public.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard], // کاربران لاگین کرده این صفحه را نبینند
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [adminGuard], // فقط ادمین‌ها این روت را ببینند
    loadChildren: () =>
      import('./modules/auth/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // روت‌های پیش‌فرض
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin' },
];
