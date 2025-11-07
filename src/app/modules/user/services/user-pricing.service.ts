import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { PriceRule } from '../../../core/models/price-rule.model';

@Injectable({ providedIn: 'root' })
export class UserPricingService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Cache management
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private pricingRulesCache$ = new BehaviorSubject<PriceRule[] | null>(null);
  private lastCacheTime = 0;

  /**
   * Get pricing rules from API
   */
  getPricingRules(): Observable<PriceRule[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (
      this.pricingRulesCache$.value &&
      now - this.lastCacheTime < this.CACHE_DURATION
    ) {
      return this.pricingRulesCache$.asObservable().pipe(map((data) => data!));
    }

    // Fetch fresh data
    return this.fetchPricingRules().pipe(
      tap((rules) => {
        this.pricingRulesCache$.next(rules);
        this.lastCacheTime = now;
      }),
      shareReplay(1)
    );
  }

  /**
   * Force refresh pricing rules
   */
  refreshPricingRules(): Observable<PriceRule[]> {
    this.clearCache();
    return this.getPricingRules();
  }

  /**
   * Clear pricing cache
   */
  clearCache(): void {
    this.pricingRulesCache$.next(null);
    this.lastCacheTime = 0;
  }

  /**
   * Fetch pricing rules from backend (public endpoint for users)
   */
  private fetchPricingRules(): Observable<PriceRule[]> {
    return this.http
      .get<PriceRule[]>(`${this.apiUrl}/user/price-rule`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors with Persian messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'خطا در دریافت اطلاعات قیمت‌گذاری';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `خطا در اتصال: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage =
            'خطا در اتصال به سرور. لطفا اتصال اینترنت خود را بررسی کنید.';
          break;
        case 404:
          errorMessage = 'اطلاعات قیمت‌گذاری یافت نشد.';
          break;
        case 500:
          errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
          break;
        case 503:
          errorMessage = 'سرویس موقتا در دسترس نیست. لطفا بعدا تلاش کنید.';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
      }
    }

    console.error('Pricing service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
