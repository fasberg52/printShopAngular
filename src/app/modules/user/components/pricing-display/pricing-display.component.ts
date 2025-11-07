import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

// PrimeNG Components
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

// Angular Forms
import { FormsModule } from '@angular/forms';

// Services and Models
import { PriceCalculationService } from '../../../../core/services/price-calculation.service';

// Pipes
import { PersianCurrencyPipe } from '../../../../core/shared/pipes/persian-currency.pipe';

// Price Rule Model
import { PriceRule } from '../../../../core/models/price-rule.model';

interface ProductVariant {
  id: string;
  name: string;
  productType: 'print' | 'binding';
  attributes: Record<string, string>;
  rule?: PriceRule;
  prices?: {
    range: string;
    quantity: number;
    price: number;
  }[];
}

@Component({
  selector: 'app-pricing-display',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonModule, MessageModule, CardModule, TagModule, SelectModule, ButtonModule, PersianCurrencyPipe],
  templateUrl: './pricing-display.component.html',
  styleUrls: ['./pricing-display.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('400ms ease-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' }))
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.55, 0, 0.68, 0.53)',
          style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' })
        )
      ])
    ])
  ]
})
export class PricingDisplayComponent implements OnInit {
  private priceCalculationService = inject(PriceCalculationService);
  private activatedRoute = inject(ActivatedRoute);

  // State
  isLoading = signal(true);
  errorMessage = signal('');
  allRules = signal<PriceRule[]>([]);

  // Filter states
  selectedSize = signal<string>('all');
  selectedColor = signal<string>('all');
  selectedProductType = signal<'all' | 'print' | 'binding'>('all');

  // Product variants - all possible combinations
  productVariants = computed<ProductVariant[]>(() => {
    const rules = this.allRules();
    const variants: ProductVariant[] = [];

    // Print products
    const printRules = rules.filter(r => r.productType === 'print');

    // A4 variants
    this.addPrintVariant(variants, printRules, 'A4 تک‌رو سیاه و سفید', 'a4', 'blackAndWhite', 'single_sided');
    this.addPrintVariant(variants, printRules, 'A4 دو‌رو سیاه و سفید', 'a4', 'blackAndWhite', 'double_sided');
    this.addPrintVariant(variants, printRules, 'A4 تک‌رو رنگی معمولی', 'a4', 'normalColor', 'single_sided');
    this.addPrintVariant(variants, printRules, 'A4 دو‌رو رنگی معمولی', 'a4', 'normalColor', 'double_sided');
    this.addPrintVariant(variants, printRules, 'A4 تک‌رو تمام رنگی', 'a4', 'fullColor', 'single_sided');
    this.addPrintVariant(variants, printRules, 'A4 دو‌رو تمام رنگی', 'a4', 'fullColor', 'double_sided');

    // A3 variants
    this.addPrintVariant(variants, printRules, 'A3 تک‌رو سیاه و سفید', 'a3', 'blackAndWhite', 'single_sided');
    this.addPrintVariant(variants, printRules, 'A3 دو‌رو سیاه و سفید', 'a3', 'blackAndWhite', 'double_sided');
    this.addPrintVariant(variants, printRules, 'A3 تک‌رو رنگی معمولی', 'a3', 'normalColor', 'single_sided');

    // A5 variants
    this.addPrintVariant(variants, printRules, 'A5 تک‌رو سیاه و سفید', 'a5', 'blackAndWhite', 'single_sided');
    this.addPrintVariant(variants, printRules, 'A5 دو‌رو سیاه و سفید', 'a5', 'blackAndWhite', 'double_sided');

    // Binding products
    const bindingRules = rules.filter(r => r.productType === 'binding');
    this.addBindingVariant(variants, bindingRules, 'صحافی فنری معمولی A4', 'springNormal', 'a4');
    this.addBindingVariant(variants, bindingRules, 'صحافی فنری معمولی A3', 'springNormal', 'a3');
    this.addBindingVariant(variants, bindingRules, 'صحافی فنری پاپکو A4', 'springPapco', 'a4');
    this.addBindingVariant(variants, bindingRules, 'صحافی منگنه A4', 'stapler', 'a4');

    return variants;
  });

  // Separate computed signals for template with filtering
  printVariants = computed<ProductVariant[]>(() => {
    let variants = this.productVariants().filter(v => v.productType === 'print');

    // Apply size filter
    if (this.selectedSize() !== 'all') {
      variants = variants.filter(v => v.attributes['size'] === this.selectedSize());
    }

    // Apply color filter
    if (this.selectedColor() !== 'all') {
      variants = variants.filter(v => v.attributes['color'] === this.selectedColor());
    }

    return variants;
  });

  bindingVariants = computed<ProductVariant[]>(() => {
    let variants = this.productVariants().filter(v => v.productType === 'binding');

    // Apply size filter for binding
    if (this.selectedSize() !== 'all') {
      variants = variants.filter(v => v.attributes['size'] === this.selectedSize());
    }

    return variants;
  });

  filteredVariants = computed<ProductVariant[]>(() => {
    let variants = this.productVariants();

    // Apply product type filter
    if (this.selectedProductType() !== 'all') {
      variants = variants.filter(v => v.productType === this.selectedProductType());
    }

    // Apply size filter
    if (this.selectedSize() !== 'all') {
      variants = variants.filter(v => v.attributes['size'] === this.selectedSize());
    }

    // Apply color filter (only for print products)
    if (this.selectedColor() !== 'all' && this.selectedProductType() !== 'binding') {
      variants = variants.filter(v => v.attributes['color'] === this.selectedColor());
    }

    return variants;
  });

  hasPrintVariants = computed<boolean>(() => this.printVariants().length > 0);
  hasBindingVariants = computed<boolean>(() => this.bindingVariants().length > 0);
  hasFilteredVariants = computed<boolean>(() => this.filteredVariants().length > 0);

  // Animation states for sections
  printSectionState = computed<string>(() => this.hasPrintVariants() ? 'visible' : 'hidden');
  bindingSectionState = computed<string>(() => this.hasBindingVariants() ? 'visible' : 'hidden');

  // Computed signals for template filtering
  hasPrintInFiltered = computed<boolean>(() => this.filteredVariants().filter(v => v.productType === 'print').length > 0);
  hasBindingInFiltered = computed<boolean>(() => this.filteredVariants().filter(v => v.productType === 'binding').length > 0);

  // Filter options
  sizeFilters = [
    { value: 'all', label: 'همه سایزها' },
    { value: 'a3', label: 'سایز A3' },
    { value: 'a4', label: 'سایز A4' },
    { value: 'a5', label: 'سایز A5' },
  ];

  colorFilters = [
    { value: 'all', label: 'همه رنگ‌ها' },
    { value: 'blackAndWhite', label: 'سیاه و سفید' },
    { value: 'normalColor', label: 'رنگی معمولی' },
    { value: 'fullColor', label: 'تمام رنگی' },
  ];

  productTypeFilters = [
    { value: 'all', label: 'همه خدمات' },
    { value: 'print', label: 'چاپ' },
    { value: 'binding', label: 'صحافی' },
  ];

  ngOnInit(): void {
    this.loadPricingData();
  }

  // Filter methods
  onProductTypeChange(): void {
    // Reset color filter when switching to binding
    if (this.selectedProductType() === 'binding') {
      this.selectedColor.set('all');
    }
  }

  clearFilters(): void {
    this.selectedSize.set('all');
    this.selectedColor.set('all');
    this.selectedProductType.set('all');
  }

  shouldShowVariant(variant: ProductVariant): boolean {
    // Check product type filter
    if (this.selectedProductType() !== 'all' && variant.productType !== this.selectedProductType()) {
      return false;
    }

    // Check size filter
    if (this.selectedSize() !== 'all' && variant.attributes['size'] !== this.selectedSize()) {
      return false;
    }

    // Check color filter (only for print products)
    if (this.selectedColor() !== 'all' && variant.productType === 'print' && variant.attributes['color'] !== this.selectedColor()) {
      return false;
    }

    return true;
  }

  private loadPricingData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Get resolved data from route
    const resolvedData = this.activatedRoute.snapshot.data['pricingData'] as PriceRule[];

    if (resolvedData && resolvedData.length > 0) {
      const activeRules = resolvedData.filter((rule) => rule.isActive);
      this.allRules.set(activeRules);
      this.isLoading.set(false);
    } else {
      this.errorMessage.set('اطلاعات قیمت‌گذاری یافت نشد');
      this.isLoading.set(false);
    }
  }

  private addPrintVariant(
    variants: ProductVariant[],
    rules: PriceRule[],
    name: string,
    size: string,
    color: string,
    side: string
  ): void {
    const rule = rules.find(r =>
      r.match.some(m => m.attributeKey === 'size' && m.value === size) &&
      r.match.some(m => m.attributeKey === 'color' && m.value === color) &&
      r.match.some(m => m.attributeKey === 'side' && m.value === side)
    );

    const variant: ProductVariant = {
      id: `${size}-${color}-${side}`,
      name,
      productType: 'print',
      attributes: { size, color, side },
      rule
    };

    if (rule) {
      variant.prices = this.calculatePrices(rule);
    }

    variants.push(variant);
  }

  private addBindingVariant(
    variants: ProductVariant[],
    rules: PriceRule[],
    name: string,
    bindingType: string,
    size: string
  ): void {
    const rule = rules.find(r =>
      r.match.some(m => m.attributeKey === 'bindingType' && m.value === bindingType) &&
      r.match.some(m => m.attributeKey === 'size' && m.value === size)
    );

    const variant: ProductVariant = {
      id: `${bindingType}-${size}`,
      name,
      productType: 'binding',
      attributes: { bindingType, size },
      rule
    };

    if (rule) {
      variant.prices = this.calculatePrices(rule);
    }

    variants.push(variant);
  }

  private calculatePrices(rule: PriceRule): { range: string; quantity: number; price: number }[] {
    const prices: { range: string; quantity: number; price: number }[] = [];

    // Base price (1 to first breakpoint or unlimited)
    const firstBreakpoint = rule.breakpoints.length > 0 ? rule.breakpoints[0].at : null;
    prices.push({
      range: firstBreakpoint ? `۱-${firstBreakpoint - 1} برگه` : '۱ برگه به بالا',
      quantity: 1,
      price: rule.price
    });

    // Add breakpoint prices
    rule.breakpoints.forEach((bp, index) => {
      const nextBp = rule.breakpoints[index + 1];
      const range = nextBp
        ? `${bp.at}-${nextBp.at - 1} برگه`
        : `${bp.at} برگه به بالا`;

      prices.push({
        range,
        quantity: bp.at,
        price: bp.price
      });
    });

    return prices;
  }

  getProductTypeLabel(type: 'print' | 'binding'): string {
    return type === 'print' ? 'چاپ' : 'صحافی';
  }
}
