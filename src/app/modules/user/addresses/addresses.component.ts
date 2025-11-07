import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-addresses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">آدرس‌های من</h1>
      <p class="text-gray-600">این صفحه در مراحل بعدی پیاده‌سازی خواهد شد</p>
    </div>
  `,
  styles: [`
    :host {
      direction: rtl;
      font-family: 'Vazir Matn', sans-serif;
    }
  `]
})
export class UserAddressesComponent {
}