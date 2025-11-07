import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { PriceCalculationService, ProductSpecs, PriceCalculationResult } from '../../../../../core/services/price-calculation.service';

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      header="ماشین حساب قیمت‌گذاری"
      [modal]="true"
      [style]="{ width: '700px' }"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [closable]="true"
    >
      <p-toast></p-toast>

      <div class="calculator-content">
        <!-- Product Specification Form -->
        <form [formGroup]="specForm" (ngSubmit)="calculatePrice()" class="spec-form">
          <div class="form-row">
            <div class="form-field">
              <label>نوع محصول</label>
              <p-select
                formControlName="productType"
                [options]="productTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
                (onChange)="onProductTypeChange()"
              ></p-select>
            </div>

            <div class="form-field">
              <label>تعداد</label>
              <p-inputNumber
                formControlName="quantity"
                [min]="1"
                [max]="10000"
                placeholder="مثال: 100"
              ></p-inputNumber>
            </div>
          </div>

          <!-- Dynamic attributes based on product type -->
          @if (specForm.get('productType')?.value === 'print') {
          <div class="form-row">
            <div class="form-field">
              <label>اندازه کاغذ</label>
              <p-select
                formControlName="size"
                [options]="sizeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
              ></p-select>
            </div>

            <div class="form-field">
              <label>رنگ چاپ</label>
              <p-select
                formControlName="color"
                [options]="colorOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
              ></p-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label>نوع رو</label>
              <p-select
                formControlName="side"
                [options]="sideOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
              ></p-select>
            </div>
          </div>
          }

          @if (specForm.get('productType')?.value === 'binding') {
          <div class="form-row">
            <div class="form-field">
              <label>نوع صحافی</label>
              <p-select
                formControlName="bindingType"
                [options]="bindingTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
              ></p-select>
            </div>

            <div class="form-field">
              <label>اندازه کاغذ</label>
              <p-select
                formControlName="size"
                [options]="sizeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="انتخاب کنید"
              ></p-select>
            </div>
          </div>
          }

          <div class="form-actions">
            <p-button
              type="submit"
              label="محاسبه قیمت"
              icon="pi pi-calculator"
              [loading]="calculating()"
              styleClass="p-button-primary"
            ></p-button>
          </div>
        </form>

        <!-- Price Result -->
        @if (priceResult()) {
        <div class="price-result">
          <p-card class="result-card">
            <ng-template pTemplate="header">
              <div class="result-header">
                <h4>نتیجه محاسبه قیمت</h4>
                <span class="rule-name">{{ priceResult()!.priceRule.name }}</span>
              </div>
            </ng-template>

            <div class="result-details">
              <div class="price-breakdown">
                <div class="price-item">
                  <span class="label">قیمت واحد:</span>
                  <span class="value">{{ formatPrice(priceResult()!.unitPrice) }} تومان</span>
                </div>

                <div class="price-item">
                  <span class="label">تعداد:</span>
                  <span class="value">{{ specForm.get('quantity')?.value }}</span>
                </div>

                <div class="price-item total">
                  <span class="label">قیمت کل:</span>
                  <span class="value">{{ formatPrice(priceResult()!.totalPrice) }} تومان</span>
                </div>
              </div>

              @if (priceResult()!.applicableBreakpoint) {
              <div class="breakpoint-info">
                <strong>نقطه‌شکن اعمال شده:</strong>
                از {{ priceResult()!.applicableBreakpoint!.at }} عدد به بالا:
                {{ formatPrice(priceResult()!.applicableBreakpoint!.price) }} تومان
              </div>
              } @else {
              <div class="breakpoint-info">
                <strong>قیمت پایه اعمال شد</strong>
              </div>
              }
            </div>
          </p-card>
        </div>
        }

        <!-- Quick Test Cases -->
        <div class="quick-tests">
          <h4>تست‌های سریع</h4>
          <div class="test-buttons">
            <p-button
              label="A4 تک‌رو سیاه و سفید (50 برگه)"
              size="small"
              (click)="quickTest('a4', 'blackAndWhite', 'single_sided', 50)"
              styleClass="p-button-outlined p-button-sm"
            ></p-button>

            <p-button
              label="A4 دو‌رو سیاه و سفید (100 برگه)"
              size="small"
              (click)="quickTest('a4', 'blackAndWhite', 'double_sided', 100)"
              styleClass="p-button-outlined p-button-sm"
            ></p-button>

            <p-button
              label="A4 تک‌رو رنگی (20 برگه)"
              size="small"
              (click)="quickTest('a4', 'normalColor', 'single_sided', 20)"
              styleClass="p-button-outlined p-button-sm"
            ></p-button>

            <p-button
              label="صحافی فنری (50 صفحه)"
              size="small"
              (click)="quickBindingTest('springNormal', 'a4', 50)"
              styleClass="p-button-outlined p-button-info p-button-sm"
            ></p-button>
          </div>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .calculator-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .spec-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 600;
      color: var(--color-text, #333333);
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      padding-top: 1rem;
    }

    .price-result {
      margin-top: 1rem;
    }

    .result-card {
      border: 2px solid var(--color-primary, #2196f3);
      border-radius: 12px;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, var(--color-primary, #2196f3), var(--color-hover, #1976d2));
      color: white;
    }

    .result-header h4 {
      margin: 0;
    }

    .rule-name {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .result-details {
      padding: 1.5rem;
    }

    .price-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .price-item.total {
      background-color: var(--color-secondary, #4caf50);
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .price-item .label {
      font-weight: 500;
    }

    .breakpoint-info {
      padding: 1rem;
      background-color: #e3f2fd;
      border-radius: 8px;
      border-right: 4px solid var(--color-primary, #2196f3);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .quick-tests {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .quick-tests h4 {
      margin: 0 0 1rem 0;
      color: var(--color-text, #333333);
    }

    .test-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .test-buttons {
        grid-template-columns: 1fr;
      }

      .result-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
    }
  `]
})
export class PriceCalculatorComponent {
  private fb = inject(FormBuilder);
  private priceCalculationService = inject(PriceCalculationService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  calculating = signal(false);
  priceResult = signal<PriceCalculationResult | null>(null);

  specForm!: FormGroup;

  productTypes = [
    { label: 'چاپ', value: 'print' },
    { label: 'صحافی', value: 'binding' }
  ];

  sizeOptions = [
    { label: 'A3', value: 'a3' },
    { label: 'A4', value: 'a4' },
    { label: 'A5', value: 'a5' }
  ];

  colorOptions = [
    { label: 'سیاه و سفید', value: 'blackAndWhite' },
    { label: 'رنگی معمولی', value: 'normalColor' },
    { label: 'تمام رنگ', value: 'fullColor' }
  ];

  sideOptions = [
    { label: 'تک‌رو', value: 'single_sided' },
    { label: 'دو‌رو', value: 'double_sided' }
  ];

  bindingTypeOptions = [
    { label: 'فنری معمولی', value: 'springNormal' },
    { label: 'فنری پاپکو', value: 'springPapco' },
    { label: 'منگنه', value: 'stapler' }
  ];

  constructor() {
    this.initForm();
  }

  initForm() {
    this.specForm = this.fb.group({
      productType: ['print', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      size: ['a4'],
      color: ['blackAndWhite'],
      side: ['single_sided'],
      bindingType: ['springNormal']
    });
  }

  onProductTypeChange() {
    // Reset form when product type changes
    this.specForm.patchValue({
      size: 'a4',
      color: 'blackAndWhite',
      side: 'single_sided',
      bindingType: 'springNormal'
    });
    this.priceResult.set(null);
  }

  calculatePrice() {
    if (this.specForm.invalid) {
      this.showToast('error', 'خطا', 'لطفا همه فیلدها را پر کنید');
      return;
    }

    this.calculating.set(true);

    const formValue = this.specForm.value;
    const specs: ProductSpecs = {
      productType: formValue.productType,
      quantity: formValue.quantity,
      attributes: {}
    };

    // Build attributes based on product type
    if (formValue.productType === 'print') {
      specs.attributes = {
        size: formValue.size,
        color: formValue.color,
        side: formValue.side
      };
    } else {
      specs.attributes = {
        bindingType: formValue.bindingType,
        size: formValue.size
      };
    }

    this.priceCalculationService.calculatePrice(specs).subscribe({
      next: (result) => {
        this.calculating.set(false);
        if (result) {
          this.priceResult.set(result);
        } else {
          this.priceResult.set(null);
          this.showToast('warn', 'هشدار', 'هیچ قانون قیمت‌گذاری برای این مشخصات یافت نشد');
        }
      },
      error: (error) => {
        this.calculating.set(false);
        this.showToast('error', 'خطا', 'خطا در محاسبه قیمت');
        console.error('Price calculation error:', error);
      }
    });
  }

  quickTest(size: string, color: string, side: string, quantity: number) {
    this.specForm.patchValue({
      productType: 'print',
      size,
      color,
      side,
      quantity
    });
    this.calculatePrice();
  }

  quickBindingTest(bindingType: string, size: string, quantity: number) {
    this.specForm.patchValue({
      productType: 'binding',
      bindingType,
      size,
      quantity
    });
    this.calculatePrice();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR');
  }

  private showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity as any,
      summary,
      detail,
      life: 5000
    });
  }
}
