import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { UserOrderService } from '../../services/user-order.service';

@Component({
  selector: 'app-order-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    TextareaModule,
    InputNumberModule,
    TooltipModule,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          خدمات و صحافی
        </h2>
        <button
          pButton
          icon="pi pi-arrow-left"
          label="بازگشت"
          class="p-button-text dark:text-white"
          (click)="onBack()"
        ></button>
      </div>

      <!-- Binding Configuration -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-4">
            <p-checkbox
              [binary]="true"
              label="صحافی نیاز دارم"
              [(ngModel)]="needsBinding"
              (onChange)="updateBinding()"
              styleClass="dark:text-white"
            ></p-checkbox>
            <span class="dark:text-white">صحافی نیاز دارم</span>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
            *ngIf="needsBinding"
          >
            <div class="flex flex-col gap-3">
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >نوع صحافی:</span
              >
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                  <p-radioButton
                    name="bindingType"
                    value="coil_papco"
                    label="فنر با طلق پاپکو"
                    [(ngModel)]="bindingType"
                    (ngModelChange)="updateBinding()"
                  ></p-radioButton>
                  <span class="dark:text-gray-300">فنر با طلق پاپکو</span>
                </div>
                <div class="flex items-center gap-2">
                  <p-radioButton
                    name="bindingType"
                    value="coil_clear"
                    label="فنر با طلق معمولی"
                    [(ngModel)]="bindingType"
                    (ngModelChange)="updateBinding()"
                  ></p-radioButton>
                  <span class="dark:text-gray-300">فنر با طلق معمولی</span>
                </div>
                <div class="flex items-center gap-2">
                  <p-radioButton
                    name="bindingType"
                    value="staple"
                    label="منگنه"
                    [(ngModel)]="bindingType"
                    (ngModelChange)="updateBinding()"
                  ></p-radioButton>
                  <span class="dark:text-gray-300">منگنه</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >طریقه صحافی:</span
              >
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                  <p-radioButton
                    name="bindingMethod"
                    value="all"
                    label="همه فایل ها با هم"
                    [(ngModel)]="bindingMethod"
                    (ngModelChange)="updateBinding()"
                  ></p-radioButton>
                  <span class="dark:text-gray-300">همه فایل ها با هم</span>
                  <i
                    class="pi pi-info-circle text-blue-500"
                    pTooltip="همه فایل‌های آپلود شده در یک مجلد صحافی می‌شوند"
                  ></i>
                </div>
                <div class="flex items-center gap-2">
                  <p-radioButton
                    name="bindingMethod"
                    value="separate"
                    label="تعدادی از فایل ها"
                    [(ngModel)]="bindingMethod"
                    (ngModelChange)="updateBinding()"
                  ></p-radioButton>
                  <span class="dark:text-gray-300">تعدادی از فایل ها</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
          <div class="flex items-center gap-2 mb-3">
            <p-checkbox
              [binary]="true"
              label="سفارش من نیاز به توضیح خاصی دارد"
              [(ngModel)]="hasDescription"
              (onChange)="updateConfig()"
            ></p-checkbox>
            <span class="dark:text-white"
              >سفارش من نیاز به توضیح خاصی دارد</span
            >
          </div>
          <textarea
            *ngIf="hasDescription"
            pInputTextarea
            rows="3"
            class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="توضیحات خود را بنویسید..."
            [(ngModel)]="description"
            (ngModelChange)="updateConfig()"
          ></textarea>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
          <div class="flex items-center gap-2 mb-3">
            <p-checkbox
              [binary]="true"
              label="در چند سری (نسخه) چاپ شود"
              [(ngModel)]="multipleCopies"
              (onChange)="updateConfig()"
            ></p-checkbox>
            <span class="dark:text-white">در چند سری (نسخه) چاپ شود</span>
          </div>
          <div *ngIf="multipleCopies" class="w-32">
            <p-inputNumber
              [(ngModel)]="copies"
              [min]="1"
              [showButtons]="true"
              (ngModelChange)="updateConfig()"
              inputStyleClass="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            ></p-inputNumber>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          pButton
          label="مرحله قبل"
          class="p-button-text text-gray-600 dark:text-gray-400"
          (click)="onBack()"
        ></button>
        <button
          pButton
          label="بعدی"
          class="p-button-rounded bg-blue-500 border-none px-8"
          (click)="onNext()"
        ></button>
      </div>
    </div>
  `,
})
export class OrderServicesComponent {
  orderService = inject(UserOrderService);

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  needsBinding = false;
  bindingType: any = 'coil_papco';
  bindingMethod: any = 'all';
  hasDescription = false;
  description = '';
  multipleCopies = false;
  copies = 1;

  updateBinding() {
    this.orderService.updateConfig({
      bindingType: this.needsBinding ? this.bindingType : 'none',
      bindingMethod: this.bindingMethod,
    });
  }

  updateConfig() {
    this.orderService.updateConfig({
      description: this.hasDescription ? this.description : '',
      hasDescription: this.hasDescription,
      copies: this.multipleCopies ? this.copies : 1,
    });
  }

  onNext() {
    this.next.emit();
  }

  onBack() {
    this.back.emit();
  }
}
