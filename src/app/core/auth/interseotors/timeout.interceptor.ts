import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError, timeout } from 'rxjs';

/**
 * Timeout Interceptor
 *
 * Applies a timeout to all HTTP requests and handles timeout errors.
 * Follows SOLID principles - single responsibility for timeout handling.
 */
export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  // Set timeout to 30 seconds for all requests
  const TIMEOUT_DURATION = 30000;

  return next(req).pipe(
    timeout(TIMEOUT_DURATION),
    catchError((error: HttpErrorResponse | Error) => {
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'TimeoutError') {
        messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail:
            'درخواست شما بیش از حد معمول طول کشید. لطفا دوباره تلاش کنید.',
          life: 5000,
        });
      }

      return throwError(() => error);
    })
  );
};

