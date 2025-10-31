/**
 * Price Rule Models and Interfaces
 */

export interface PriceRule {
  _id?: string;
  name: string;
  productType: 'print' | 'binding';
  match: MatchCondition[];
  price: number;
  breakpoints: Breakpoint[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatchCondition {
  attributeKey: string;
  value: string;
}

export interface Breakpoint {
  at: number;
  price: number;
}

export interface CreatePriceRuleDto {
  name: string;
  productType: 'print' | 'binding';
  match: MatchCondition[];
  price: number;
  breakpoints: Breakpoint[];
  isActive: boolean;
}

export interface UpdatePriceRuleDto {
  name?: string;
  productType?: 'print' | 'binding';
  match?: MatchCondition[];
  price?: number;
  breakpoints?: Breakpoint[];
  isActive?: boolean;
}
