import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
  Address,
  CreateAddressDto,
  UpdateAddressDto,
} from '../models/address.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token';

  /**
   * Get all addresses for current user
   */
  getAllAddresses(): Observable<Address[]> {
    return this.http
      .get<Address[]>(`${this.apiUrl}/addresses`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get address by ID
   */
  getAddressById(id: string): Observable<Address> {
    return this.http
      .get<Address>(`${this.apiUrl}/addresses/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new address
   */
  createAddress(address: CreateAddressDto): Observable<Address> {
    return this.http
      .post<Address>(`${this.apiUrl}/addresses`, address, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update address
   */
  updateAddress(id: string, address: UpdateAddressDto): Observable<Address> {
    return this.http
      .put<Address>(`${this.apiUrl}/addresses/${id}`, address, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete address
   */
  deleteAddress(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/addresses/${id}`, {
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
        errorMessage = 'آدرس یافت نشد.';
      } else if (error.status === 500) {
        errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
