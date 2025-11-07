import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { PriceRule } from '../../../../../core/models/price-rule.model';
import { PriceRuleService } from '../../../../../core/services/price-rule.service';
import { PriceRuleDetailModalComponent } from './modals/price-rule-detail-modal.component';
import { PriceRuleExamplesComponent } from './price-rule-examples.component';
import { PriceCalculatorComponent } from './price-calculator.component';
import { SeedPriceRulesComponent } from './seed-price-rules.component';

@Component({
  selector: 'app-price-rules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    MenuModule,
    DialogModule,
    PriceRuleDetailModalComponent,
    PriceRuleExamplesComponent,
    PriceCalculatorComponent,
    SeedPriceRulesComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './price-rules.component.html',
  styleUrls: ['./price-rules.component.css'],
})
export class PriceRulesComponent implements OnInit {
  private priceRuleService = inject(PriceRuleService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  // State
  priceRules = signal<PriceRule[]>([]);
  loading = signal(false);
  selectedPriceRule = signal<PriceRule | null>(null);

  // Modals
  showDetailModal = signal(false);
  showExamplesModal = false;
  showCalculatorModal = false;
  showSeedModal = false;

  // Pagination
  first = 0;
  rows = 20;
  totalRecords = 0;

  ngOnInit(): void {
    this.loadPriceRules();
  }

  /**
   * Load all price rules
   */
  loadPriceRules(): void {
    this.loading.set(true);
    this.priceRuleService.getAllPriceRules().subscribe({
      next: (data: PriceRule[]) => {
        console.log('✅ Price rules loaded successfully:', data);
        console.log('First rule:', data[0]);
        this.priceRules.set(data);
        this.totalRecords = data.length;
        this.loading.set(false);
      },
      error: (error: any) => {
        this.loading.set(false);
        console.error('❌ Error loading price rules:', error);
        this.showToast(
          'error',
          'خطا',
          error.message || 'خطا در بارگذاری قوانین قیمت'
        );
      },
    });
  }

  /**
   * Navigate to create form
   */
  openCreateModal(): void {
    this.router.navigate(['/admin/price-rules/new']);
  }

  /**
   * Navigate to edit form
   */
  openEditModal(priceRule: PriceRule): void {
    this.router.navigate(['/admin/price-rules/edit', priceRule._id]);
  }

  /**
   * Open detail modal
   */
  openDetailModal(priceRule: PriceRule): void {
    this.selectedPriceRule.set({ ...priceRule });
    this.showDetailModal.set(true);
  }

  /**
   * Open examples modal
   */
  openExamplesModal(): void {
    this.showExamplesModal = true;
  }

  /**
   * Open calculator modal
   */
  openCalculatorModal(): void {
    this.showCalculatorModal = true;
  }

  /**
   * Open seed modal
   */
  openSeedModal(): void {
    this.showSeedModal = true;
  }

  /**
   * Delete price rule
   */
  deletePriceRule(priceRule: PriceRule): void {
    this.confirmationService.confirm({
      message: `آیا مطمئن هستید که می‌خواهید "${priceRule.name}" را حذف کنید؟`,
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      accept: () => {
        if (priceRule._id) {
          this.priceRuleService.deletePriceRule(priceRule._id).subscribe({
            next: () => {
              this.showToast('success', 'موفق', 'قانون قیمت با موفقیت حذف شد');
              this.loadPriceRules();
            },
            error: (error: any) => {
              this.showToast('error', 'خطا', 'خطا در حذف قانون قیمت');
              console.error('Error deleting price rule:', error);
            },
          });
        }
      },
    });
  }

  /**
   * Toggle active status
   */
  toggleActive(priceRule: PriceRule): void {
    if (priceRule._id) {
      const newStatus = !priceRule.isActive;
      this.priceRuleService.toggleActive(priceRule._id, newStatus).subscribe({
        next: () => {
          this.showToast(
            'success',
            'موفق',
            `قانون قیمت ${newStatus ? 'فعال' : 'غیرفعال'} شد`
          );
          this.loadPriceRules();
        },
        error: (error: any) => {
          this.showToast('error', 'خطا', 'خطا در تغییر وضعیت');
          console.error('Error toggling active status:', error);
        },
      });
    }
  }

  /**
   * Handle modal close
   */
  onModalClose(): void {
    this.showDetailModal.set(false);
    this.showExamplesModal = false;
    this.showCalculatorModal = false;
    this.showSeedModal = false;
    this.selectedPriceRule.set(null);
    this.loadPriceRules();
  }

  /**
   * Show toast message
   */
  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({
      severity: severity as any,
      summary,
      detail,
      life: 5000,
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  }

  /**
   * Format price for display (with Persian numbers)
   */
  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR');
  }

  /**
   * Get product type label
   */
  getProductTypeLabel(type: string): string {
    return type === 'print' ? 'چاپ' : 'صحافی';
  }

  /**
   * Get menu items for a price rule
   */
  getMenuItems(priceRule: PriceRule): any[] {
    return [
      {
        label: 'مشاهده جزئیات',
        icon: 'pi pi-eye',
        command: () => {
          console.log('Opening detail for:', priceRule);
          this.openDetailModal(priceRule);
        },
      },
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil',

        command: () => {
          console.log('Opening edit for:', priceRule);
          this.openEditModal(priceRule);
        },
      },
      {
        separator: true,
      },
      {
        label: priceRule.isActive ? 'غیرفعال کردن' : 'فعال کردن',
        icon: priceRule.isActive ? 'pi pi-ban' : 'pi pi-check',

        command: () => {
          console.log('Toggling active for:', priceRule);
          this.toggleActive(priceRule);
        },
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500 m-2 hover:text-red-700 active:text-red-700',
        command: () => {
          console.log('Deleting:', priceRule);
          this.deletePriceRule(priceRule);
        },
      },
    ];
  }
}
