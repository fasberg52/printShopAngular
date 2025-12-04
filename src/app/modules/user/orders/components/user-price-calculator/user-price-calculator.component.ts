import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import {
  PriceCalculationService,
  ProductSpecs,
} from '../../../../../core/services/price-calculation.service';

@Component({
  selector: 'app-user-price-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
  ],
  template: `
    <p-dialog
      header="محاسبه‌گر قیمت"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '400px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <form
        [formGroup]="calcForm"
        (ngSubmit)="calculate()"
        class="flex flex-col gap-4"
      >
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >نوع محصول</label
          >
          <p-select
            formControlName="productType"
            [options]="productTypes"
            optionLabel="label"
            optionValue="value"
            styleClass="w-full dark:bg-gray-700 dark:border-gray-600"
          >
          </p-select>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >تعداد</label
          >
          <p-inputNumber
            formControlName="quantity"
            [min]="1"
            styleClass="w-full"
            inputStyleClass="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
          </p-inputNumber>
        </div>

        <ng-container *ngIf="calcForm.get('productType')?.value === 'print'">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >سایز کاغذ</label
            >
            <p-select
              formControlName="size"
              [options]="paperSizes"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full dark:bg-gray-700 dark:border-gray-600"
            ></p-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >رنگ</label
            >
            <p-select
              formControlName="color"
              [options]="colorModes"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full dark:bg-gray-700 dark:border-gray-600"
            ></p-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >نوع چاپ</label
            >
            <p-select
              formControlName="side"
              [options]="printSides"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full dark:bg-gray-700 dark:border-gray-600"
            ></p-select>
          </div>
        </ng-container>

        <div
          *ngIf="calculatedPrice() !== null"
          class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-300">قیمت تخمینی:</span>
            <span class="text-xl font-bold text-blue-600 dark:text-blue-400"
              >{{ calculatedPrice() | number }} تومان</span
            >
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            pButton
            type="button"
            label="بستن"
            class="p-button-text"
            (click)="visible = false"
          ></button>
          <button
            pButton
            type="submit"
            label="محاسبه"
            [loading]="loading()"
            class="bg-blue-600"
          ></button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class UserPriceCalculatorComponent {
  private fb = inject(FormBuilder);
  private priceService = inject(PriceCalculationService);

  visible = false;
  loading = signal(false);
  calculatedPrice = signal<number | null>(null);

  productTypes = [
    { label: 'چاپ', value: 'print' },
    // { label: 'صحافی', value: 'binding' } // Simplified for now based on user request context
  ];

  paperSizes = [
    { label: 'A4', value: 'a4' },
    { label: 'A3', value: 'a3' },
    { label: 'A5', value: 'a5' },
  ];

  colorModes = [
    { label: 'سیاه و سفید', value: 'blackAndWhite' }, // Matching backend values from PriceCalculatorComponent
    { label: 'رنگی', value: 'normalColor' },
  ];

  printSides = [
    { label: 'یک رو', value: 'single_sided' },
    { label: 'دو رو', value: 'double_sided' },
  ];

  calcForm = this.fb.group({
    productType: ['print', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    size: ['a4'],
    color: ['blackAndWhite'],
    side: ['single_sided'],
  });

  show() {
    this.visible = true;
    this.calculatedPrice.set(null);
  }

  calculate() {
    if (this.calcForm.invalid) return;

    this.loading.set(true);
    const val = this.calcForm.value;

    const specs: ProductSpecs = {
      productType: val.productType as any,
      quantity: val.quantity || 1,
      attributes: {
        size: val.size || 'a4',
        color: val.color || 'blackAndWhite',
        side: val.side || 'single_sided',
      },
    };

    this.priceService.calculatePrice(specs).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res) {
          this.calculatedPrice.set(res.totalPrice);
        } else {
          this.calculatedPrice.set(null);
        }
      },
      error: () => {
        this.loading.set(false);
        this.calculatedPrice.set(null);
      },
    });
  }
}
