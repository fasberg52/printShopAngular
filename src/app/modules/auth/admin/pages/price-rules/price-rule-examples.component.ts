import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-price-rule-examples',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule,
    TagModule,
  ],
  template: `
    <p-dialog
      [header]="'راهنمای تعریف قوانین قیمت‌گذاری'"
      [modal]="true"
      [style]="{ width: '800px', maxHeight: '80vh' }"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [closable]="true"
    >
      <div class="examples-content">

        <!-- مقدمه -->
        <div class="intro-section">
          <h3>🎯 راهنمای کامل تعریف قوانین قیمت‌گذاری</h3>
          <p class="intro-text">
            با استفاده از قوانین قیمت‌گذاری، می‌توانید قیمت‌های مختلف را بر اساس ویژگی‌های محصول تعریف کنید.
            هر قانون شامل شرایط تطابق و نقطه‌شکن‌های قیمت‌گذاری است.
          </p>
        </div>

        <!-- مثال‌های عملی -->
        <div class="examples-grid">

          <!-- مثال ۱: A4 تک‌رو سیاه و سفید -->
          <p-card class="example-card">
            <ng-template pTemplate="header">
              <div class="card-header">
                <h4>A4 تک‌رو - سیاه و سفید</h4>
                <p-tag value="چاپ" severity="success"></p-tag>
              </div>
            </ng-template>

            <div class="example-details">
              <div class="rule-info">
                <strong>نام قانون:</strong> A4 تک‌رو سیاه و سفید<br>
                <strong>نوع محصول:</strong> چاپ<br>
                <strong>قیمت پایه:</strong> ۴۲۰ تومان<br>
              </div>

              <div class="conditions">
                <strong>شرایط تطابق:</strong>
                <ul>
                  <li>اندازه کاغذ: A4</li>
                  <li>رنگ چاپ: سیاه و سفید</li>
                  <li>نوع رو: تک‌رو</li>
                </ul>
              </div>

              <div class="breakpoints">
                <strong>نقطه‌شکن‌ها:</strong>
                <ul>
                  <li>از ۱ تا ۹۹ برگه: ۴۲۰ تومان</li>
                  <li>از ۱۰۰ تا ۴۹۹ برگه: ۳۸۰ تومان</li>
                  <li>از ۵۰۰ برگه به بالا: ۳۲۰ تومان</li>
                </ul>
              </div>
            </div>
          </p-card>

          <!-- مثال ۲: A4 دو‌رو سیاه و سفید -->
          <p-card class="example-card">
            <ng-template pTemplate="header">
              <div class="card-header">
                <h4>A4 دو‌رو - سیاه و سفید</h4>
                <p-tag value="چاپ" severity="success"></p-tag>
              </div>
            </ng-template>

            <div class="example-details">
              <div class="rule-info">
                <strong>نام قانون:</strong> A4 دو‌رو سیاه و سفید<br>
                <strong>نوع محصول:</strong> چاپ<br>
                <strong>قیمت پایه:</strong> ۶۵۰ تومان<br>
              </div>

              <div class="conditions">
                <strong>شرایط تطابق:</strong>
                <ul>
                  <li>اندازه کاغذ: A4</li>
                  <li>رنگ چاپ: سیاه و سفید</li>
                  <li>نوع رو: دو‌رو</li>
                </ul>
              </div>

              <div class="breakpoints">
                <strong>نقطه‌شکن‌ها:</strong>
                <ul>
                  <li>از ۱ تا ۴۹ برگه: ۶۵۰ تومان</li>
                  <li>از ۵۰ تا ۱۹۹ برگه: ۵۸۰ تومان</li>
                  <li>از ۲۰۰ برگه به بالا: ۵۲۰ تومان</li>
                </ul>
              </div>
            </div>
          </p-card>

          <!-- مثال ۳: A4 تک‌رو رنگی -->
          <p-card class="example-card">
            <ng-template pTemplate="header">
              <div class="card-header">
                <h4>A4 تک‌رو - رنگی معمولی</h4>
                <p-tag value="چاپ" severity="success"></p-tag>
              </div>
            </ng-template>

            <div class="example-details">
              <div class="rule-info">
                <strong>نام قانون:</strong> A4 تک‌رو رنگی معمولی<br>
                <strong>نوع محصول:</strong> چاپ<br>
                <strong>قیمت پایه:</strong> ۱۲۰۰ تومان<br>
              </div>

              <div class="conditions">
                <strong>شرایط تطابق:</strong>
                <ul>
                  <li>اندازه کاغذ: A4</li>
                  <li>رنگ چاپ: رنگی معمولی</li>
                  <li>نوع رو: تک‌رو</li>
                </ul>
              </div>

              <div class="breakpoints">
                <strong>نقطه‌شکن‌ها:</strong>
                <ul>
                  <li>از ۱ تا ۱۹ برگه: ۱۲۰۰ تومان</li>
                  <li>از ۲۰ تا ۹۹ برگه: ۱۰۸۰ تومان</li>
                  <li>از ۱۰۰ برگه به بالا: ۹۶۰ تومان</li>
                </ul>
              </div>
            </div>
          </p-card>

          <!-- مثال ۴: صحافی فنری -->
          <p-card class="example-card">
            <ng-template pTemplate="header">
              <div class="card-header">
                <h4>صحافی فنری معمولی - A4</h4>
                <p-tag value="صحافی" severity="info"></p-tag>
              </div>
            </ng-template>

            <div class="example-details">
              <div class="rule-info">
                <strong>نام قانون:</strong> صحافی فنری معمولی A4<br>
                <strong>نوع محصول:</strong> صحافی<br>
                <strong>قیمت پایه:</strong> ۵۰۰۰ تومان<br>
              </div>

              <div class="conditions">
                <strong>شرایط تطابق:</strong>
                <ul>
                  <li>نوع صحافی: فنری معمولی</li>
                  <li>اندازه کاغذ: A4</li>
                </ul>
              </div>

              <div class="breakpoints">
                <strong>نقطه‌شکن‌ها:</strong>
                <ul>
                  <li>تا ۵۰ صفحه: ۵۰۰۰ تومان</li>
                  <li>۵۱ تا ۱۰۰ صفحه: ۶۰۰۰ تومان</li>
                  <li>۱۰۱ صفحه به بالا: ۷۰۰۰ تومان</li>
                </ul>
              </div>
            </div>
          </p-card>

        </div>

        <!-- راهنمای گام به گام -->
        <div class="guide-section">
          <h4>📋 گام‌های تعریف قانون قیمت‌گذاری</h4>
          <div class="steps">
            <div class="step">
              <div class="step-number">۱</div>
              <div class="step-content">
                <strong>انتخاب نوع محصول:</strong> چاپ یا صحافی
              </div>
            </div>

            <div class="step">
              <div class="step-number">۲</div>
              <div class="step-content">
                <strong>افزودن شرایط تطابق:</strong> ویژگی‌هایی که محصول باید داشته باشد (اندازه، رنگ، نوع رو و...)
              </div>
            </div>

            <div class="step">
              <div class="step-number">۳</div>
              <div class="step-content">
                <strong>تعیین قیمت پایه:</strong> قیمت برای تعداد کم (۱-۱۰ برگه/صفحه)
              </div>
            </div>

            <div class="step">
              <div class="step-number">۴</div>
              <div class="step-content">
                <strong>افزودن نقطه‌شکن‌ها:</strong> تخفیف برای تعداد بیشتر
              </div>
            </div>

            <div class="step">
              <div class="step-number">۵</div>
              <div class="step-content">
                <strong>فعال‌سازی قانون:</strong> تا زمانی که فعال باشد، اعمال می‌شود
              </div>
            </div>
          </div>
        </div>

        <!-- نکات مهم -->
        <div class="tips-section">
          <h4>⚠️ نکات مهم</h4>
          <ul class="tips-list">
            <li>هر محصول باید حداقل یک قانون قیمت‌گذاری فعال داشته باشد</li>
            <li>اگر چندین قانون با شرایط یک محصول تطابق داشته باشند، اولین قانون اعمال می‌شود</li>
            <li>نقطه‌شکن‌ها باید به ترتیب تعداد مرتب شوند</li>
            <li>نام قوانین باید واضح و توصیفی باشد</li>
            <li>قبل از غیرفعال کردن یک قانون، از وجود جایگزین مطمئن شوید</li>
          </ul>
        </div>

      </div>
    </p-dialog>
  `,
  styles: [`
    .examples-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .intro-section {
      text-align: center;
      padding: 1rem;
      background: linear-gradient(135deg, var(--color-primary, #2196f3), var(--color-hover, #1976d2));
      color: white;
      border-radius: 12px;
    }

    .intro-text {
      font-size: 1.1rem;
      margin: 0.5rem 0 0 0;
      line-height: 1.6;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .example-card {
      height: fit-content;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .card-header h4 {
      margin: 0;
      color: var(--color-text, #333333);
    }

    .example-details {
      padding: 1rem;
    }

    .rule-info {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: var(--color-card-bg, #f5f5f5);
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .conditions, .breakpoints {
      margin-bottom: 1rem;
    }

    .conditions ul, .breakpoints ul {
      margin: 0.5rem 0 0 0;
      padding-right: 1.5rem;
    }

    .conditions li, .breakpoints li {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    .guide-section {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      border-right: 4px solid var(--color-primary, #2196f3);
    }

    .guide-section h4 {
      color: var(--color-primary, #2196f3);
      margin-bottom: 1rem;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .step-number {
      background: var(--color-primary, #2196f3);
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
      line-height: 1.6;
    }

    .tips-section {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 1.5rem;
      border-radius: 12px;
    }

    .tips-section h4 {
      color: #856404;
      margin-bottom: 1rem;
    }

    .tips-list {
      margin: 0;
      padding-right: 1.5rem;
    }

    .tips-list li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .examples-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .step {
        flex-direction: column;
        gap: 0.5rem;
      }

      .step-number {
        align-self: flex-start;
      }
    }
  `]
})
export class PriceRuleExamplesComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
}
