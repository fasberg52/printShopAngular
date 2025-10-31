import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { PriceRule } from '../../../../../../core/models/price-rule.model';

@Component({
  selector: 'app-price-rule-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TagModule,
    DividerModule,
    CardModule,
  ],
  templateUrl: './price-rule-detail-modal.component.html',
  styleUrls: ['./price-rule-detail-modal.component.css'],
})
export class PriceRuleDetailModalComponent {
  priceRule = input.required<PriceRule>();

  // Dialog visibility - starts true, becomes false when closing
  visible = signal<boolean>(true);

  close = output<void>();
  edit = output<void>();
  delete = output<void>();

  onVisibleChange(value: boolean): void {
    this.visible.set(value);
    if (!value) {
      // Dialog is being closed (X button clicked or ESC pressed)
      this.close.emit();
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fa-IR');
  }

  getProductTypeLabel(type: string): string {
    return type === 'print' ? 'چاپ' : 'صحافی';
  }
}
