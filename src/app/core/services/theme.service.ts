import { Injectable, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'user-theme';

  // سیگنال برای وضعیت دارک مود
  private _isDarkMode = signal<boolean>(false);

  // سیگنال محاسبه‌شده برای کلاس CSS
  readonly themeClass = computed(() => this._isDarkMode() ? 'my-app-dark' : 'light');

  constructor() {
    // بارگذاری وضعیت دارک مود از localStorage
    this.loadThemeFromStorage();

    // تنظیم کلاس روی body هنگام تغییر وضعیت
    effect(() => {
      const themeClass = this.themeClass();
      this.applyTheme(themeClass);
      this.saveThemeToStorage(this._isDarkMode());
    });
  }

  /**
   * وضعیت فعلی دارک مود را برمی‌گرداند
   */
  get isDarkMode(): boolean {
    return this._isDarkMode();
  }

  /**
   * وضعیت دارک مود را تغییر می‌دهد
   */
  toggleTheme(): void {
    this._isDarkMode.update(current => !current);
  }

  /**
   * دارک مود را فعال می‌کند
   */
  enableDarkMode(): void {
    this._isDarkMode.set(true);
  }

  /**
   * دارک مود را غیرفعال می‌کند
   */
  disableDarkMode(): void {
    this._isDarkMode.set(false);
  }

  /**
   * تم را تنظیم می‌کند
   */
  setTheme(isDark: boolean): void {
    this._isDarkMode.set(isDark);
  }

  /**
   * بارگذاری وضعیت تم از localStorage
   */
  private loadThemeFromStorage(): void {
    try {
      const storedTheme = localStorage.getItem(this.STORAGE_KEY);
      if (storedTheme) {
        const isDark = JSON.parse(storedTheme);
        this._isDarkMode.set(isDark);
      } else {
        // بررسی تنظیمات سیستم عامل
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this._isDarkMode.set(prefersDark);
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    }
  }

  /**
   * ذخیره وضعیت تم در localStorage
   */
  private saveThemeToStorage(isDark: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(isDark));
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  }

  /**
   * اعمال تم روی DOM
   */
  private applyTheme(themeClass: string): void {
    const body = this.document.body;

    // حذف کلاس‌های تم قبلی
    body.classList.remove('light', 'my-app-dark');

    // اضافه کردن کلاس تم جدید
    if (themeClass === 'my-app-dark') {
      body.classList.add('my-app-dark');
    }

    // تنظیم data-theme برای کامپوننت‌های دیگر
    this.document.documentElement.setAttribute('data-theme', themeClass);
  }
}
