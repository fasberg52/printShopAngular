import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
  CreateDeliveryMethodDto,
  DeliveryMethod,
  DeliveryMethodModel,
  UpdateDeliveryMethodDto,
} from '../models/delivery-method.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class DeliveryMethodService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token';

  /**
   * Get all active delivery methods
   */
  getAllDeliveryMethods(): Observable<DeliveryMethodModel[]> {
    return this.http
      .get<DeliveryMethodModel[]>(`${this.apiUrl}/delivery-methods`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get delivery method by type
   */
  getDeliveryMethodByType(
    method: DeliveryMethod
  ): Observable<DeliveryMethodModel> {
    return this.http
      .get<DeliveryMethodModel>(`${this.apiUrl}/delivery-methods/${method}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new delivery method (Admin only)
   */
  createDeliveryMethod(
    deliveryMethod: CreateDeliveryMethodDto
  ): Observable<DeliveryMethodModel> {
    return this.http
      .post<DeliveryMethodModel>(
        `${this.apiUrl}/delivery-methods`,
        deliveryMethod,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Update delivery method (Admin only)
   */
  updateDeliveryMethod(
    method: DeliveryMethod,
    deliveryMethod: UpdateDeliveryMethodDto
  ): Observable<DeliveryMethodModel> {
    return this.http
      .put<DeliveryMethodModel>(
        `${this.apiUrl}/delivery-methods/${method}`,
        deliveryMethod,
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
      errorMessage = `خطا: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'دسترسی غیرمجاز. لطفا دوباره وارد شوید.';
      } else if (error.status === 403) {
        errorMessage = 'شما دسترسی لازم را ندارید.';
      } else if (error.status === 404) {
        errorMessage = 'روش ارسال یافت نشد.';
      } else if (error.status === 500) {
        errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
