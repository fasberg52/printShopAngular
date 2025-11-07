import { Routes } from '@angular/router';
import { UserLoginComponent } from './pages/login/login.component';
import { UserRegisterComponent } from './pages/register/register.component';
import { UserForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const USER_AUTH_ROUTES: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'forgot-password', component: UserForgotPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];