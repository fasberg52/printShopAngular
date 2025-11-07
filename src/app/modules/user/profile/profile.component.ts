import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">پروفایل کاربری</h1>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-center py-12">
            <i class="pi pi-user text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              صفحه پروفایل
            </h2>
            <p class="text-gray-600">
              این صفحه در مراحل بعدی پیاده‌سازی خواهد شد
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        direction: rtl;
        font-family: 'Vazir Matn', sans-serif;
        padding: 2rem;
      }

      .profile-container * {
        font-family: 'Vazir Matn', sans-serif;
      }
    `,
  ],
})
export class UserProfileComponent {}
