import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { StorageService } from '../../../core/services/storage.service';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'admin_token'; // This should be 'user_token' in production

  // User profile state
  private userProfile$ = new BehaviorSubject<UserProfile | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  /**
   * Get user profile observable
   */
  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfile$.asObservable();
  }

  /**
   * Get loading state observable
   */
  getLoadingState(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Get current user profile value
   */
  getCurrentProfile(): UserProfile | null {
    return this.userProfile$.value;
  }

  /**
   * Load user profile from server
   */
  loadUserProfile(): Observable<UserProfile> {
    this.isLoading$.next(true);

    return this.http
      .get<UserProfile>(`${this.apiUrl}/users/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((profile) => {
          this.userProfile$.next(profile);
          this.isLoading$.next(false);
        }),
        catchError((error) => {
          this.isLoading$.next(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Update user profile
   */
  updateProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    this.isLoading$.next(true);

    return this.http
      .patch<UserProfile>(`${this.apiUrl}/users/me`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((profile) => {
          this.userProfile$.next(profile);
          this.isLoading$.next(false);
        }),
        catchError((error) => {
          this.isLoading$.next(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http
      .post<{ avatarUrl: string }>(`${this.apiUrl}/user/avatar`, formData, {
        headers: this.getAuthHeaders(false), // Don't set Content-Type for FormData
      })
      .pipe(
        tap((response) => {
          const currentProfile = this.userProfile$.value;
          if (currentProfile) {
            this.userProfile$.next({
              ...currentProfile,
              avatar: response.avatarUrl,
            });
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(profile?: UserProfile | null): string {
    const user = profile || this.userProfile$.value;
    if (!user) return 'ک';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);

    return firstInitial + lastInitial || 'ک';
  }

  /**
   * Get user full name
   */
  getUserFullName(profile?: UserProfile | null): string {
    const user = profile || this.userProfile$.value;
    if (!user) return 'کاربر نمونه';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    return `${firstName} ${lastName}`.trim() || 'کاربر نمونه';
  }

  /**
   * Get user display phone
   */
  getUserPhone(profile?: UserProfile | null): string {
    const user = profile || this.userProfile$.value;
    return user?.phone || '09123456789';
  }

  /**
   * Check if user has avatar
   */
  hasAvatar(profile?: UserProfile | null): boolean {
    const user = profile || this.userProfile$.value;
    return !!user?.avatar;
  }

  /**
   * Get avatar URL or null
   */
  getAvatarUrl(profile?: UserProfile | null): string | null {
    const user = profile || this.userProfile$.value;
    return user?.avatar || null;
  }

  /**
   * Clear user profile (on logout)
   */
  clearProfile(): void {
    this.userProfile$.next(null);
  }

  /**
   * Set mock profile for development
   */
  setMockProfile(): void {
    const mockProfile: UserProfile = {
      id: 'mock-user-id',
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '09123456789',
      email: 'ali.ahmadi@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.userProfile$.next(mockProfile);
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(includeContentType: boolean = true): {
    [key: string]: string;
  } {
    const token = this.storage.getItem(this.tokenKey);
    const headers: { [key: string]: string } = {};

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle HTTP errors with Persian messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'خطا در ارتباط با سرور';

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
        case 401:
          errorMessage = 'دسترسی غیرمجاز. لطفا دوباره وارد شوید.';
          break;
        case 403:
          errorMessage = 'شما دسترسی لازم را ندارید.';
          break;
        case 404:
          errorMessage = 'اطلاعات کاربری یافت نشد.';
          break;
        case 422:
          errorMessage = 'اطلاعات وارد شده نامعتبر است.';
          break;
        case 500:
          errorMessage = 'خطای سرور. لطفا بعدا تلاش کنید.';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
      }
    }

    console.error('User profile service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
