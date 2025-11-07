import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PriceRule } from '../../../core/models/price-rule.model';
import { UserPricingService } from './user-pricing.service';

@Injectable({
  providedIn: 'root',
})
export class PricingResolver implements Resolve<PriceRule[]> {
  private userPricingService = inject(UserPricingService);

  /**
   * Resolve pricing data for the pricing route
   */
  resolve(): Observable<PriceRule[]> {
    console.log('🔄 PricingResolver: Loading pricing data for route activation');
    return this.userPricingService.getPricingRules().pipe(
      catchError((error) => {
        console.error('❌ PricingResolver: Failed to load pricing data', error);
        // Return empty array on error to prevent navigation blocking
        return of([]);
      })
    );
  }
}
