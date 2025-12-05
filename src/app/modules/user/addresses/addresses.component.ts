import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { Address } from '../../../core/models/address.model';
import { AddressService } from '../../../core/services/address.service';
import { PersianValidationService } from '../../../core/services/persian-validation.service';

@Component({
  selector: 'app-user-addresses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TagModule,
    TextareaModule,
    ToastModule,
    ToggleButtonModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './addresses.component.html',
})
export class UserAddressesComponent implements OnInit {
  private addressService = inject(AddressService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  // State
  addresses = signal<Address[]>([]);
  loading = signal(false);
  selectedAddress = signal<Address | null>(null);

  // Modals
  showCreateModal = signal(false);
  showEditModal = signal(false);

  // Forms
  createForm: FormGroup;
  editForm: FormGroup;

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

  constructor() {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      recipientName: ['', [Validators.required, Validators.maxLength(100)]],
      recipientPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^09\d{9}$/),
          PersianValidationService.persianPhone(),
        ],
      ],
      province: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(500)]],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/),
          PersianValidationService.persianPostalCode(),
        ],
      ],
      isDefault: [false],
    });

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      recipientName: ['', [Validators.required, Validators.maxLength(100)]],
      recipientPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^09\d{9}$/),
          PersianValidationService.persianPhone(),
        ],
      ],
      province: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(500)]],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/),
          PersianValidationService.persianPostalCode(),
        ],
      ],
      isDefault: [false],
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  /**
   * Load all addresses
   */
  loadAddresses(): void {
    this.loading.set(true);
    this.addressService.getAllAddresses().subscribe({
      next: (data: Address[]) => {
        this.addresses.set(data);
        this.loading.set(false);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.showToast(
          'error',
          'خطا',
          error.message || 'خطا در بارگذاری آدرس‌ها'
        );
      },
    });
  }

  /**
   * Open create modal
   */
  openCreateModal(): void {
    this.createForm.reset({
      title: '',
      recipientName: '',
      recipientPhone: '',
      province: '',
      city: '',
      fullAddress: '',
      postalCode: '',
      isDefault: false,
    });
    this.showCreateModal.set(true);
  }

  /**
   * Open edit modal
   */
  openEditModal(address: Address): void {
    this.selectedAddress.set({ ...address });
    this.editForm.patchValue({
      title: address.title,
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      province: address.province,
      city: address.city,
      fullAddress: address.fullAddress,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    this.showEditModal.set(true);
  }

  /**
   * Create new address
   */
  createAddress(): void {
    if (this.createForm.invalid) {
      this.markFormGroupTouched(this.createForm);
      this.showToast('warn', 'هشدار', 'لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }

    const formValue = this.createForm.value;
    this.loading.set(true);

    this.addressService
      .createAddress({
        title: formValue.title,
        recipientName: formValue.recipientName,
        recipientPhone: formValue.recipientPhone,
        province: formValue.province,
        city: formValue.city,
        fullAddress: formValue.fullAddress,
        postalCode: formValue.postalCode,
        isDefault: formValue.isDefault || false,
      })
      .subscribe({
        next: () => {
          this.showToast('success', 'موفق', 'آدرس با موفقیت ثبت شد');
          this.showCreateModal.set(false);
          this.loadAddresses();
        },
        error: (error: any) => {
          this.loading.set(false);
          this.showToast('error', 'خطا', error.message || 'خطا در ثبت آدرس');
        },
      });
  }

  /**
   * Update address
   */
  updateAddress(): void {
    const selected = this.selectedAddress();
    if (!selected || !selected._id) return;

    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      this.showToast('warn', 'هشدار', 'لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }

    const formValue = this.editForm.value;
    this.loading.set(true);

    this.addressService
      .updateAddress(selected._id, {
        title: formValue.title,
        recipientName: formValue.recipientName,
        recipientPhone: formValue.recipientPhone,
        province: formValue.province,
        city: formValue.city,
        fullAddress: formValue.fullAddress,
        postalCode: formValue.postalCode,
        isDefault: formValue.isDefault || false,
      })
      .subscribe({
        next: () => {
          this.showToast('success', 'موفق', 'آدرس با موفقیت به‌روزرسانی شد');
          this.showEditModal.set(false);
          this.loadAddresses();
        },
        error: (error: any) => {
          this.loading.set(false);
          this.showToast(
            'error',
            'خطا',
            error.message || 'خطا در به‌روزرسانی آدرس'
          );
        },
      });
  }

  /**
   * Delete address
   */
  deleteAddress(address: Address): void {
    if (!address._id) return;

    this.confirmationService.confirm({
      message: `آیا مطمئن هستید که می‌خواهید آدرس "${address.title}" را حذف کنید؟`,
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله، حذف کن',
      rejectLabel: 'انصراف',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.loading.set(true);
        this.addressService.deleteAddress(address._id!).subscribe({
          next: () => {
            this.showToast('success', 'موفق', 'آدرس با موفقیت حذف شد');
            this.loadAddresses();
          },
          error: (error: any) => {
            this.loading.set(false);
            this.showToast('error', 'خطا', error.message || 'خطا در حذف آدرس');
          },
        });
      },
    });
  }

  /**
   * Set default address
   */
  setDefaultAddress(address: Address): void {
    if (!address._id || address.isDefault) return;

    this.loading.set(true);
    this.addressService
      .updateAddress(address._id, { isDefault: true })
      .subscribe({
        next: () => {
          this.showToast('success', 'موفق', 'آدرس پیش‌فرض تغییر کرد');
          this.loadAddresses();
        },
        error: (error: any) => {
          this.loading.set(false);
          this.showToast(
            'error',
            'خطا',
            error.message || 'خطا در تغییر آدرس پیش‌فرض'
          );
        },
      });
  }

  /**
   * Mark all form fields as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if field has error
   */
  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error message
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'این فیلد الزامی است';
    }
    if (field.errors['pattern']) {
      if (fieldName === 'recipientPhone') {
        return 'شماره تماس باید 11 رقم و با 09 شروع شود';
      }
      if (fieldName === 'postalCode') {
        return 'کد پستی باید 10 رقم باشد';
      }
    }
    if (field.errors['maxlength']) {
      return `حداکثر ${field.errors['maxlength'].requiredLength} کاراکتر`;
    }

    return 'مقدار وارد شده معتبر نیست';
  }

  /**
   * Format phone number
   */
  formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
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
}
