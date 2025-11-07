import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

// Services
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  NavigationService,
  NavigationItem,
} from '../services/navigation.service';
import {
  UserProfileService,
  UserProfile,
} from '../services/user-profile.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);
  public userProfileService = inject(UserProfileService); // Public for template access
  private destroy$ = new Subject<void>();

  // Component State
  sidebarVisible = false;
  pendingOrdersCount = 0;
  userProfile: UserProfile | null = null;
  navigationItems: NavigationItem[] = [];
  isProfileLoading = false;

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadPendingOrdersCount();
    this.loadNavigationItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle mobile sidebar
   */
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  /**
   * Close mobile sidebar
   */
  closeSidebar(): void {
    this.sidebarVisible = false;
  }

  /**
   * Show user menu (for future implementation)
   */
  showUserMenu(event: Event): void {
    // TODO: Implement user menu with profile options
    console.log('User menu clicked', event);
  }

  /**
   * Confirm logout with user
   */
  confirmLogout(): void {
    this.confirmationService.confirm({
      message: 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟',
      header: 'تایید خروج',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله، خروج',
      rejectLabel: 'انصراف',
      accept: () => {
        this.logout();
      },
    });
  }

  /**
   * Logout user
   */
  private logout(): void {
    try {
      this.authService.logout();
      this.messageService.add({
        severity: 'success',
        summary: 'خروج موفق',
        detail: 'با موفقیت از حساب کاربری خارج شدید',
      });
      this.router.navigate(['/user/auth/login']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'خطا در خروج از حساب کاربری',
      });
    }
  }

  /**
   * Load user profile
   */
  private loadUserProfile(): void {
    // Subscribe to profile changes
    this.userProfileService
      .getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.userProfile = profile;
      });

    // Subscribe to loading state
    this.userProfileService
      .getLoadingState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isProfileLoading = loading;
      });

    // Try to load profile from server, fallback to mock data
    this.userProfileService.loadUserProfile().subscribe({
      next: (profile) => {
        console.log('User profile loaded:', profile);
      },
      error: (error) => {
        console.warn('Failed to load user profile, using mock data:', error);
        // Set mock profile for development
        this.userProfileService.setMockProfile();
      },
    });
  }

  /**
   * Load pending orders count
   */
  private loadPendingOrdersCount(): void {
    // TODO: Implement pending orders count loading
    // For now, using mock data
    this.pendingOrdersCount = 3;
    // Update navigation badge
    this.navigationService.updateBadge('orders', this.pendingOrdersCount);
  }

  /**
   * Load navigation items
   */
  private loadNavigationItems(): void {
    this.navigationService
      .getNavigationItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.navigationItems = items;
      });
  }

  /**
   * Track by function for navigation items
   */
  trackByNavItem(index: number, item: NavigationItem): string {
    return item.id;
  }

  /**
   * Show notification settings
   */
  showNotificationSettings(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'تنظیمات اعلان‌ها',
      detail: 'این بخش به زودی اضافه خواهد شد',
    });
  }

  /**
   * Show help
   */
  showHelp(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'راهنما',
      detail: 'برای دریافت راهنما با پشتیبانی تماس بگیرید',
    });
  }

  /**
   * Edit profile
   */
  editProfile(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'ویرایش پروفایل',
      detail: 'صفحه ویرایش پروفایل به زودی اضافه خواهد شد',
    });
  }
}
