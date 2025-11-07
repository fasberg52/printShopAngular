import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { PriceRuleService } from '../../../../../core/services/price-rule.service';
import { CreatePriceRuleDto } from '../../../../../core/models/price-rule.model';

@Component({
  selector: 'app-seed-price-rules',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      header="ایجاد قوانین قیمت‌گذاری نمونه"
      [modal]="true"
      [style]="{ width: '600px' }"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [closable]="true"
    >
      <p-toast></p-toast>

      <div class="seed-content">
        <p class="info-text">
          این عملیات قوانین قیمت‌گذاری نمونه را برای محصولات مختلف ایجاد می‌کند.
          این قوانین شامل حالت‌های مختلف چاپ و صحافی هستند.
        </p>

        <div class="rules-preview">
          <h4>قوانین که ایجاد خواهند شد:</h4>
          <div class="rules-list">
            <div class="rule-item" *ngFor="let rule of sampleRules">
              <strong>{{ rule.name }}</strong>
              <div class="rule-details">
                <span class="product-type">{{ rule.productType === 'print' ? 'چاپ' : 'صحافی' }}</span>
                <span class="price">قیمت پایه: {{ formatPrice(rule.price) }} تومان</span>
              </div>
            </div>
          </div>
        </div>

        <div class="warning-box">
          <strong>⚠️ توجه:</strong> این عملیات قوانین موجود را پاک نخواهد کرد و قوانین جدید را اضافه می‌کند.
        </div>

        <div class="actions">
          <p-button
            label="انصراف"
            icon="pi pi-times"
            severity="secondary"
            (click)="visibleChange.emit(false)"
          ></p-button>

          <p-button
            label="ایجاد قوانین نمونه"
            icon="pi pi-plus"
            severity="success"
            (click)="createSampleRules()"
            [loading]="creating()"
          ></p-button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .seed-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-text {
      background-color: #e3f2fd;
      padding: 1rem;
      border-radius: 8px;
      border-right: 4px solid var(--color-primary, #2196f3);
      line-height: 1.6;
      margin: 0;
    }

    .rules-preview h4 {
      color: var(--color-text, #333333);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 300px;
      overflow-y: auto;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .rule-item {
      padding: 0.75rem;
      background-color: white;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .rule-item strong {
      display: block;
      color: var(--color-primary, #2196f3);
      margin-bottom: 0.5rem;
    }

    .rule-details {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
      color: #666;
    }

    .product-type {
      background-color: #e8f5e8;
      color: #2e7d2e;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .warning-box {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 1rem;
      border-radius: 8px;
      color: #856404;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class SeedPriceRulesComponent {
  private priceRuleService = inject(PriceRuleService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  creating = signal(false);

  // Sample price rules data
  sampleRules: CreatePriceRuleDto[] = [
    {
      name: 'A4 تک‌رو سیاه و سفید',
      productType: 'print',
      price: 420,
      isActive: true,
      match: [
        { attributeKey: 'size', value: 'a4' },
        { attributeKey: 'color', value: 'blackAndWhite' },
        { attributeKey: 'side', value: 'single_sided' }
      ],
      breakpoints: [
        { at: 100, price: 380 },
        { at: 500, price: 320 }
      ]
    },
    {
      name: 'A4 دو‌رو سیاه و سفید',
      productType: 'print',
      price: 650,
      isActive: true,
      match: [
        { attributeKey: 'size', value: 'a4' },
        { attributeKey: 'color', value: 'blackAndWhite' },
        { attributeKey: 'side', value: 'double_sided' }
      ],
      breakpoints: [
        { at: 50, price: 580 },
        { at: 200, price: 520 }
      ]
    },
    {
      name: 'A4 تک‌رو رنگی معمولی',
      productType: 'print',
      price: 1200,
      isActive: true,
      match: [
        { attributeKey: 'size', value: 'a4' },
        { attributeKey: 'color', value: 'normalColor' },
        { attributeKey: 'side', value: 'single_sided' }
      ],
      breakpoints: [
        { at: 20, price: 1080 },
        { at: 100, price: 960 }
      ]
    },
    {
      name: 'صحافی فنری معمولی A4',
      productType: 'binding',
      price: 5000,
      isActive: true,
      match: [
        { attributeKey: 'bindingType', value: 'springNormal' },
        { attributeKey: 'size', value: 'a4' }
      ],
      breakpoints: [
        { at: 51, price: 6000 },
        { at: 101, price: 7000 }
      ]
    }
  ];

  createSampleRules() {
    this.creating.set(true);

    // Create rules one by one
    let completed = 0;
    const total = this.sampleRules.length;

    this.sampleRules.forEach(rule => {
      this.priceRuleService.createPriceRule(rule).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.creating.set(false);
            this.showToast('success', 'موفق', `${total} قانون قیمت‌گذاری نمونه با موفقیت ایجاد شد`);
            this.visibleChange.emit(false);
          }
        },
        error: (error) => {
          this.creating.set(false);
          this.showToast('error', 'خطا', `خطا در ایجاد قانون ${rule.name}`);
          console.error('Error creating rule:', rule.name, error);
        }
      });
    });
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
