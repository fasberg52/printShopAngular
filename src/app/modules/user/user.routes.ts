import { Routes } from '@angular/router';
import { userGuard } from '../../core/auth/guards/user.guard';
import { userPublicGuard } from '../../core/auth/guards/user-public.guard';
import { PricingResolver } from './services/pricing.resolver';

export const USER_ROUTES: Routes = [
  {
    path: 'auth',
    canActivate: [userPublicGuard], // کاربران لاگین کرده این صفحه را نبینند
    loadChildren: () =>
      import('./auth/user-auth.routes').then((m) => m.USER_AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [userGuard], // فقط کاربران عادی این روت‌ها را ببینند
    loadComponent: () =>
      import('./layout/user-layout.component').then(
        (m) => m.UserLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.UserDashboardComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then(
            (m) => m.UserOrdersComponent
          ),
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./addresses/addresses.component').then(
            (m) => m.UserAddressesComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./transactions/transactions.component').then(
            (m) => m.UserTransactionsComponent
          ),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./components/pricing-display/pricing-display.component').then(
            (m) => m.PricingDisplayComponent
          ),
        resolve: {
          pricingData: PricingResolver,
        },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
