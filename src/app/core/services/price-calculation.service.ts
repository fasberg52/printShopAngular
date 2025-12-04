import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PriceRule } from '../models/price-rule.model';
import { PriceRuleService } from './price-rule.service';

export interface ProductSpecs {
  productType: 'print' | 'binding';
  attributes: Record<string, string>;
  quantity: number;
}

export interface PriceCalculationResult {
  priceRule: PriceRule;
  unitPrice: number;
  totalPrice: number;
  applicableBreakpoint?: {
    at: number;
    price: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PriceCalculationService {
  private priceRuleService = inject(PriceRuleService);
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Calculate price for a product based on specifications
   */
  /**
   * Calculate price for a product based on specifications
   */
  calculatePrice(
    specs: ProductSpecs
  ): Observable<PriceCalculationResult | null> {
    return this.priceRuleService.getAllPriceRules().pipe(
      map((priceRules) => this.calculatePriceWithRules(specs, priceRules)),
      catchError((err) => {
        console.error('Price calculation error', err);
        return of(null);
      })
    );
  }

  /**
   * Calculate price using provided rules
   */
  calculatePriceWithRules(
    specs: ProductSpecs,
    priceRules: PriceRule[]
  ): PriceCalculationResult | null {
    const applicableRule = this.findApplicableRule(priceRules, specs);

    if (!applicableRule) {
      return null;
    }

    const calculation = this.calculatePriceFromRule(
      applicableRule,
      specs.quantity
    );

    return {
      priceRule: applicableRule,
      unitPrice: calculation.unitPrice,
      totalPrice: calculation.totalPrice,
      applicableBreakpoint: calculation.breakpoint,
    };
  }

  /**
   * Find the most specific applicable price rule
   */
  private findApplicableRule(
    priceRules: PriceRule[],
    specs: ProductSpecs
  ): PriceRule | null {
    // Filter active rules for the product type
    const activeRules = priceRules.filter(
      (rule) => rule.isActive && rule.productType === specs.productType
    );

    // Find rules that match all specified conditions
    const matchingRules = activeRules.filter((rule) =>
      this.ruleMatchesConditions(rule, specs.attributes)
    );

    if (matchingRules.length === 0) {
      return null;
    }

    // Return the rule with most specific conditions (most attribute matches)
    return matchingRules.reduce((best, current) => {
      return current.match.length > best.match.length ? current : best;
    });
  }

  /**
   * Check if a rule matches the product specifications
   */
  private ruleMatchesConditions(
    rule: PriceRule,
    attributes: Record<string, string>
  ): boolean {
    return rule.match.every((condition) => {
      const attributeValue = attributes[condition.attributeKey];
      return attributeValue !== undefined && attributeValue === condition.value;
    });
  }

  /**
   * Calculate price using breakpoints
   */
  private calculatePriceFromRule(
    rule: PriceRule,
    quantity: number
  ): {
    unitPrice: number;
    totalPrice: number;
    breakpoint?: { at: number; price: number };
  } {
    // Sort breakpoints by quantity ascending
    const sortedBreakpoints = [...rule.breakpoints].sort((a, b) => a.at - b.at);

    // Find applicable breakpoint
    let applicableBreakpoint = rule.price; // base price
    let breakpointInfo: { at: number; price: number } | undefined;

    for (const bp of sortedBreakpoints) {
      if (quantity >= bp.at) {
        applicableBreakpoint = bp.price;
        breakpointInfo = bp;
      } else {
        break; // breakpoints are sorted, no need to check further
      }
    }

    return {
      unitPrice: applicableBreakpoint,
      totalPrice: applicableBreakpoint * quantity,
      breakpoint: breakpointInfo,
    };
  }

  /**
   * Get all possible price combinations for a product type
   */
  getPriceMatrix(
    productType: 'print' | 'binding'
  ): Observable<PriceCalculationResult[]> {
    return this.priceRuleService.getAllPriceRules().pipe(
      map((priceRules) => {
        const activeRules = priceRules.filter(
          (rule) => rule.isActive && rule.productType === productType
        );

        // For demonstration, create sample quantities
        const sampleQuantities = [1, 10, 50, 100, 500, 1000];

        const results: PriceCalculationResult[] = [];

        for (const rule of activeRules) {
          for (const quantity of sampleQuantities) {
            const calculation = this.calculatePriceFromRule(rule, quantity);
            results.push({
              priceRule: rule,
              unitPrice: calculation.unitPrice,
              totalPrice: calculation.totalPrice,
              applicableBreakpoint: calculation.breakpoint,
            });
          }
        }

        return results;
      })
    );
  }

  /**
   * Validate if product specifications can be priced
   */
  validatePricing(specs: ProductSpecs): Observable<{
    isValid: boolean;
    message: string;
    suggestion?: string;
  }> {
    return this.calculatePrice(specs).pipe(
      map((result) => {
        if (result) {
          return {
            isValid: true,
            message: 'قیمت‌گذاری با موفقیت انجام شد',
          };
        } else {
          return {
            isValid: false,
            message: 'هیچ قانون قیمت‌گذاری برای این مشخصات یافت نشد',
            suggestion:
              'لطفا قوانین قیمت‌گذاری را برای این نوع محصول بررسی کنید',
          };
        }
      })
    );
  }

  /**
   * Get price rule suggestions for missing specifications
   */
  getRuleSuggestions(specs: ProductSpecs): Observable<string[]> {
    return this.priceRuleService.getAllPriceRules().pipe(
      map((priceRules) => {
        const activeRules = priceRules.filter(
          (rule) => rule.isActive && rule.productType === specs.productType
        );

        const suggestions: string[] = [];

        // Check what attributes are missing
        for (const rule of activeRules) {
          const missingAttributes = rule.match.filter(
            (condition) => !specs.attributes[condition.attributeKey]
          );

          if (missingAttributes.length > 0) {
            const missingNames = missingAttributes.map((attr) =>
              this.getAttributeDisplayName(attr.attributeKey)
            );
            suggestions.push(
              `قانون "${rule.name}" نیاز به مشخصات ${missingNames.join(
                ' و '
              )} دارد`
            );
          }
        }

        return [...new Set(suggestions)]; // Remove duplicates
      })
    );
  }

  /**
   * Get human-readable attribute names
   */
  private getAttributeDisplayName(attributeKey: string): string {
    const attributeNames: Record<string, string> = {
      size: 'اندازه کاغذ',
      color: 'رنگ چاپ',
      side: 'نوع رو',
      bindingType: 'نوع صحافی',
    };

    return attributeNames[attributeKey] || attributeKey;
  }
}
