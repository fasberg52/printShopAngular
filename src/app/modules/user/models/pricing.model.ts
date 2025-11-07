/**
 * User Panel Pricing Models
 * These models are specifically designed for displaying pricing information to users
 */

export interface PricingDisplay {
  category: PaperType;
  subcategories: PricingSubcategory[];
}

export interface PricingSubcategory {
  name: string;
  type: PrintType;
  pricing: PricingTier[];
}

export interface PricingTier {
  quantity: number;
  singleSidePrice: number;
  doubleSidePrice: number;
}

export type PaperType = 'A4' | 'A5' | 'A3' | 'binding';
export type PrintType = 'blackwhite' | 'color' | 'normal' | 'fullcolor';

/**
 * Persian labels for UI display
 */
export const PAPER_TYPE_LABELS: Record<PaperType, string> = {
  'A4': 'کاغذ A4',
  'A5': 'کاغذ A5', 
  'A3': 'کاغذ A3',
  'binding': 'صحافی'
};

export const PRINT_TYPE_LABELS: Record<PrintType, string> = {
  'blackwhite': 'سیاه و سفید',
  'color': 'رنگی',
  'normal': 'معمولی',
  'fullcolor': 'تمام رنگی'
};

/**
 * Column headers for pricing tables
 */
export const PRICING_TABLE_HEADERS = {
  quantity: 'تعداد برگ',
  singleSide: 'قیمت یک‌رو',
  doubleSide: 'قیمت دورو'
};