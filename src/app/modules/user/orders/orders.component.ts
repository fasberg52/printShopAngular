import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { OrderAddressComponent } from './components/order-address/order-address.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';
import { OrderServicesComponent } from './components/order-services/order-services.component';
import { OrderUploadComponent } from './components/order-upload/order-upload.component';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    ButtonModule,
    OrderUploadComponent,
    OrderServicesComponent,
    OrderAddressComponent,
    OrderPaymentComponent,
  ],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <!-- Dashboard / List View -->
      <div *ngIf="viewMode() === 'list'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            سفارش‌های من
          </h1>
          <button
            pButton
            label="ثبت سفارش جدید"
            icon="pi pi-plus"
            (click)="startNewOrder()"
          ></button>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700"
        >
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            <i class="pi pi-folder-open text-6xl opacity-20"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            هنوز سفارشی ثبت نکرده‌اید
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            برای شروع، اولین پوشه سفارش خود را ایجاد کنید
          </p>
          <button
            pButton
            label="ایجاد اولین پوشه"
            class="p-button-outlined"
            (click)="startNewOrder()"
          ></button>
        </div>
      </div>

      <!-- Order Flow View -->
      <div *ngIf="viewMode() === 'create'" class="space-y-6">
        <div class="mb-8">
          <p-steps
            [model]="items"
            [(activeIndex)]="activeIndex"
            [readonly]="false"
          ></p-steps>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 min-h-[600px]">
          <ng-container [ngSwitch]="activeIndex">
            <app-order-upload
              *ngSwitchCase="0"
              (next)="nextStep()"
            ></app-order-upload>
            <app-order-services
              *ngSwitchCase="1"
              (next)="nextStep()"
              (back)="prevStep()"
            ></app-order-services>
            <app-order-address
              *ngSwitchCase="2"
              (next)="nextStep()"
              (back)="prevStep()"
            ></app-order-address>
            <app-order-payment
              *ngSwitchCase="3"
              (back)="prevStep()"
              (pay)="submitOrder()"
            ></app-order-payment>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        direction: rtl;
        font-family: 'Vazir Matn', sans-serif;
      }

      ::ng-deep .p-steps .p-steps-item .p-menuitem-link .p-steps-number {
        font-family: 'Vazir Matn', sans-serif;
      }

      ::ng-deep .p-steps .p-steps-item .p-menuitem-link .p-steps-title {
        font-family: 'Vazir Matn', sans-serif;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class UserOrdersComponent implements OnInit {
  viewMode = signal<'list' | 'create'>('list');
  items: MenuItem[] = [];
  activeIndex = 0;

  ngOnInit() {
    this.items = [
      { label: 'پوشه ۱' },
      { label: 'خدمات' },
      { label: 'آدرس پستی' },
      { label: 'پرداخت' },
    ];
  }

  startNewOrder() {
    this.viewMode.set('create');
    this.activeIndex = 0;
  }

  nextStep() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    }
  }

  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      // If back from first step, go to list
      this.viewMode.set('list');
    }
  }

  submitOrder() {
    console.log('Order submitted');
    this.viewMode.set('list');
    // Handle order submission via service
  }
}
