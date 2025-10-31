import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const redirectExpiredTokenToLoginInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'توکن شما منقضی شده است. لطفا دوباره وارد شوید.',
          life: 5000,
        });
        router.navigate(['/auth/login']);
        localStorage.removeItem('admin_token');
      }
      return throwError(() => error);
    })
  );
};
