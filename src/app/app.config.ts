import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/interseotors/auth.interseptor';
import { redirectExpiredTokenToLoginInterceptor } from './core/auth/interseotors/redirect-to-login.interseptor';
import { timeoutInterceptor } from './core/auth/interseotors/timeout.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        timeoutInterceptor,
        authInterceptor,
        redirectExpiredTokenToLoginInterceptor,
      ])
    ),
    MessageService,
    providePrimeNG({
      theme: {
        preset: 'aura',
      },
    }),
  ],
};
