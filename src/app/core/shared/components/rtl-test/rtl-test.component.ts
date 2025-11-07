import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersianNumberPipe, PersianCurrencyPipe, PersianDatePipe } from '../../pipes';

/**
 * RTL Test Component
 * 
 * A simple component to test RTL functionality and Persian formatting
 */
@Component({
  selector: 'app-rtl-test',
  standalone: true,
  imports: [CommonModule, PersianNumberPipe, PersianCurrencyPipe, PersianDatePipe],
  template: `
    <div class="rtl-container p-4 persian-text">
      <h2 class="text-xl persian-bold mb-4">تست سیستم RTL و فونت فارسی</h2>
      
      <div class="mb-4">
        <h3 class="persian-medium mb-2">تست اعداد فارسی:</h3>
        <p>عدد لاتین: 123456</p>
        <p>عدد فارسی: {{ 123456 | persianNumber }}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="persian-medium mb-2">تست قیمت فارسی:</h3>
        <p>قیمت: {{ 1234567 | persianCurrency }}</p>
        <p>قیمت با ریال: {{ 1234567 | persianCurrency:'ریال' }}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="persian-medium mb-2">تست تاریخ فارسی:</h3>
        <p>تاریخ کوتاه: {{ currentDate | persianDate }}</p>
        <p>تاریخ بلند: {{ currentDate | persianDate:'long' }}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="persian-medium mb-2">تست RTL Layout:</h3>
        <div class="rtl-flex gap-4 items-center">
          <span class="bg-blue-100 px-3 py-1 rounded">آیتم اول</span>
          <span class="bg-green-100 px-3 py-1 rounded">آیتم دوم</span>
          <span class="bg-yellow-100 px-3 py-1 rounded">آیتم سوم</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      direction: rtl;
      text-align: right;
    }
  `]
})
export class RtlTestComponent {
  currentDate = new Date();
}