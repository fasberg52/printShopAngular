// src/app/app.routes.server.ts (کد صحیح و نهایی)

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ۱. به این مسیرها بگو که فقط در مرورگر رندر شوند
  {
    path: 'admin/**', // هر مسیری که با /admin شروع می‌شود
    renderMode: RenderMode.Client, // <-- فقط در مرورگر (Client-Side)
  },
  {
    path: 'auth/**', // هر مسیری که با /auth شروع می‌شود
    renderMode: RenderMode.Client, // <-- فقط در مرورگر (Client-Side)
  },

  // ۲. سایر مسیرها (مثل صفحه اصلی آینده شما) روی سرور رندر شوند
  {
    path: '**', // بقیه مسیرها
    renderMode: RenderMode.Prerender, // (یا RenderMode.SSR)
  },
];
