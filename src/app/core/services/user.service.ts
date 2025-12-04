import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { User, UsersResponse } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token';

  /**
   * Get all users with pagination
   */
  getUsers(skip: number = 0, limit: number = 10): Observable<UsersResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http
      .get<UsersResponse>(`${this.apiUrl}/users`, {
        headers: this.getAuthHeaders(),
        params,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): { [key: string]: string } {
    const token = this.storage.getItem(this.tokenKey);
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'خطا در ارتباط با سرور';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطا: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'دسترسی غیرمجاز. لطفا دوباره وارد شوید.';
      } else if (error.status === 403) {
        errorMessage = 'شما دسترسی لازم را ندارید.';
      } else if (error.status === 404) {
        errorMessage = 'کاربر یافت نشد.';
      } else if (error.status === 500) {
        errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
