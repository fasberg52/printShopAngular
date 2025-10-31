import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
  CreatePriceRuleDto,
  PriceRule,
  UpdatePriceRuleDto,
} from '../models/price-rule.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PriceRuleService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token';

  /**
   * Get all price rules
   */
  getAllPriceRules(): Observable<PriceRule[]> {
    return this.http
      .get<PriceRule[]>(`${this.apiUrl}/admin/price-rules`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get price rule by ID
   */
  getPriceRuleById(id: string): Observable<PriceRule> {
    return this.http
      .get<PriceRule>(`${this.apiUrl}/admin/price-rules/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new price rule
   */
  createPriceRule(priceRule: CreatePriceRuleDto): Observable<PriceRule> {
    return this.http
      .post<PriceRule>(`${this.apiUrl}/admin/price-rules`, priceRule, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update price rule
   */
  updatePriceRule(
    id: string,
    priceRule: UpdatePriceRuleDto
  ): Observable<PriceRule> {
    return this.http
      .put<PriceRule>(`${this.apiUrl}/admin/price-rules/${id}`, priceRule, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete price rule
   */
  deletePriceRule(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/admin/price-rules/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Toggle active status
   */
  toggleActive(id: string, isActive: boolean): Observable<PriceRule> {
    return this.http
      .put<PriceRule>(
        `${this.apiUrl}/admin/price-rules/${id}`,
        { isActive },
        {
          headers: this.getAuthHeaders(),
        }
      )
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
      // Client-side error
      errorMessage = `خطا: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'دسترسی غیرمجاز. لطفا دوباره وارد شوید.';
      } else if (error.status === 403) {
        errorMessage = 'شما دسترسی لازم را ندارید.';
      } else if (error.status === 404) {
        errorMessage = 'قانون قیمت یافت نشد.';
      } else if (error.status === 500) {
        errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
