import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: {
    value: number;
    severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
  };
  isActive?: boolean;
  children?: NavigationItem[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationItems$ = new BehaviorSubject<NavigationItem[]>([
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: 'pi pi-home',
      route: '/user/dashboard',
    },
    {
      id: 'orders',
      label: 'سفارشات من',
      icon: 'pi pi-shopping-cart',
      route: '/user/orders',
      badge: {
        value: 0,
        severity: 'info',
      },
    },
    {
      id: 'pricing',
      label: 'لیست قیمت‌ها',
      icon: 'pi pi-list',
      route: '/user/pricing',
    },
    {
      id: 'transactions',
      label: 'تراکنش‌های مالی',
      icon: 'pi pi-credit-card',
      route: '/user/transactions',
    },
    {
      id: 'addresses',
      label: 'آدرس‌های من',
      icon: 'pi pi-map-marker',
      route: '/user/addresses',
    },
    {
      id: 'profile',
      label: 'پروفایل کاربری',
      icon: 'pi pi-user',
      route: '/user/profile',
    },
  ]);

  /**
   * Get navigation items
   */
  getNavigationItems(): Observable<NavigationItem[]> {
    return this.navigationItems$.asObservable();
  }

  /**
   * Update badge count for a specific navigation item
   */
  updateBadge(itemId: string, count: number): void {
    const items = this.navigationItems$.value;
    const item = items.find((i) => i.id === itemId);
    if (item && item.badge) {
      item.badge.value = count;
      this.navigationItems$.next([...items]);
    }
  }

  /**
   * Get current navigation items value
   */
  getCurrentItems(): NavigationItem[] {
    return this.navigationItems$.value;
  }

  /**
   * Set active navigation item
   */
  setActiveItem(route: string): void {
    const items = this.navigationItems$.value.map((item) => ({
      ...item,
      isActive: item.route === route,
    }));
    this.navigationItems$.next(items);
  }
}
