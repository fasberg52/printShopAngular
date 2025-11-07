import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
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
      withFetch(),
      withInterceptors([
        timeoutInterceptor,
        authInterceptor,
        redirectExpiredTokenToLoginInterceptor,
      ])
    ),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
  ],
};
