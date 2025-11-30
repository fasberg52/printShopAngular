import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import {
  DeliveryMethod,
  DeliveryMethodModel,
} from '../../../../../core/models/delivery-method.model';
import { DeliveryMethodService } from '../../../../../core/services/delivery-method.service';

@Component({
  selector: 'app-delivery-methods',
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
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ToggleButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './delivery-methods.component.html',
  styleUrls: ['./delivery-methods.component.css'],
})
export class DeliveryMethodsComponent implements OnInit {
  private deliveryMethodService = inject(DeliveryMethodService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // State
  deliveryMethods = signal<DeliveryMethodModel[]>([]);
  loading = signal(false);
  selectedDeliveryMethod = signal<DeliveryMethodModel | null>(null);

  // Modals
  showCreateModal = signal(false);
  showEditModal = signal(false);

  // Computed properties for two-way binding
  get createModalVisible(): boolean {
    return this.showCreateModal();
  }
  set createModalVisible(value: boolean) {
    this.showCreateModal.set(value);
  }

  get editModalVisible(): boolean {
    return this.showEditModal();
  }
  set editModalVisible(value: boolean) {
    this.showEditModal.set(value);
  }

  // Form data
  formData = signal<Partial<DeliveryMethodModel>>({
    method: DeliveryMethod.POST,
    name: '',
    basePrice: 0,
    description: '',
    isActive: true,
    requiresAddress: false,
  });

  // Pagination
  first = 0;
  rows = 20;
  totalRecords = 0;

  ngOnInit(): void {
    this.loadDeliveryMethods();
  }

  /**
   * Load all delivery methods
   */
  loadDeliveryMethods(): void {
    this.loading.set(true);
    this.deliveryMethodService.getAllDeliveryMethods().subscribe({
      next: (data: DeliveryMethodModel[]) => {
        this.deliveryMethods.set(data);
        this.totalRecords = data.length;
        this.loading.set(false);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.showToast(
          'error',
          'خطا',
          error.message || 'خطا در بارگذاری روش‌های ارسال'
        );
      },
    });
  }

  /**
   * Open create modal
   */
  openCreateModal(): void {
    this.formData.set({
      method: DeliveryMethod.POST,
      name: '',
      basePrice: 0,
      description: '',
      isActive: true,
      requiresAddress: false,
    });
    this.showCreateModal.set(true);
  }

  /**
   * Open edit modal
   */
  openEditModal(deliveryMethod: DeliveryMethodModel): void {
    this.selectedDeliveryMethod.set({ ...deliveryMethod });
    this.formData.set({
      method: deliveryMethod.method,
      name: deliveryMethod.name,
      basePrice: deliveryMethod.basePrice,
      description: deliveryMethod.description || '',
      isActive: deliveryMethod.isActive,
      requiresAddress: deliveryMethod.requiresAddress,
    });
    this.showEditModal.set(true);
  }

  /**
   * Create delivery method
   */
  createDeliveryMethod(): void {
    const data = this.formData();
    if (!data.method || !data.name || data.basePrice === undefined) {
      this.showToast('warn', 'هشدار', 'لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }

    this.loading.set(true);
    this.deliveryMethodService
      .createDeliveryMethod({
        method: data.method as DeliveryMethod,
        name: data.name,
        basePrice: data.basePrice,
        description: data.description,
        isActive: data.isActive ?? true,
        requiresAddress: data.requiresAddress ?? false,
      })
      .subscribe({
        next: () => {
          this.showToast('success', 'موفق', 'روش ارسال با موفقیت ایجاد شد');
          this.showCreateModal.set(false);
          this.loadDeliveryMethods();
        },
        error: (error: any) => {
          this.loading.set(false);
          this.showToast(
            'error',
            'خطا',
            error.message || 'خطا در ایجاد روش ارسال'
          );
        },
      });
  }

  /**
   * Update delivery method
   */
  updateDeliveryMethod(): void {
    const selected = this.selectedDeliveryMethod();
    if (!selected) return;

    const data = this.formData();
    this.loading.set(true);
    this.deliveryMethodService
      .updateDeliveryMethod(selected.method, {
        name: data.name,
        basePrice: data.basePrice,
        description: data.description,
        isActive: data.isActive,
        requiresAddress: data.requiresAddress,
      })
      .subscribe({
        next: () => {
          this.showToast(
            'success',
            'موفق',
            'روش ارسال با موفقیت به‌روزرسانی شد'
          );
          this.showEditModal.set(false);
          this.loadDeliveryMethods();
        },
        error: (error: any) => {
          this.loading.set(false);
          this.showToast(
            'error',
            'خطا',
            error.message || 'خطا در به‌روزرسانی روش ارسال'
          );
        },
      });
  }

  /**
   * Toggle active status
   */
  toggleActive(deliveryMethod: DeliveryMethodModel): void {
    this.deliveryMethodService
      .updateDeliveryMethod(deliveryMethod.method, {
        isActive: !deliveryMethod.isActive,
      })
      .subscribe({
        next: () => {
          this.showToast(
            'success',
            'موفق',
            `روش ارسال ${!deliveryMethod.isActive ? 'فعال' : 'غیرفعال'} شد`
          );
          this.loadDeliveryMethods();
        },
        error: (error: any) => {
          this.showToast('error', 'خطا', 'خطا در تغییر وضعیت');
        },
      });
  }

  /**
   * Get method label
   */
  getMethodLabel(method: DeliveryMethod): string {
    const labels: Record<DeliveryMethod, string> = {
      [DeliveryMethod.POST]: 'پست',
      [DeliveryMethod.PICKUP]: 'دریافت حضوری',
      [DeliveryMethod.EXPRESS]: 'اکسپرس',
    };
    return labels[method] || method;
  }

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR');
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
   * Get menu items for a delivery method
   */
  getMenuItems(deliveryMethod: DeliveryMethodModel): any[] {
    return [
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil',
        command: () => {
          this.openEditModal(deliveryMethod);
        },
      },
      {
        separator: true,
      },
      {
        label: deliveryMethod.isActive ? 'غیرفعال کردن' : 'فعال کردن',
        icon: deliveryMethod.isActive ? 'pi pi-ban' : 'pi pi-check',
        command: () => {
          this.toggleActive(deliveryMethod);
        },
      },
    ];
  }
}
