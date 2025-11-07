import { Pipe, PipeTransform } from '@angular/core';
import { toPersianNumerals } from '../utils/number.utils';

/**
 * Persian Currency Pipe
 * 
 * Formats numbers as Persian currency with proper separators and Persian numerals
 * 
 * Usage:
 * {{ 1234567 | persianCurrency }}  // Output: ۱,۲۳۴,۵۶۷ تومان
 * {{ 1234567 | persianCurrency:'ریال' }} // Output: ۱,۲۳۴,۵۶۷ ریال
 * {{ 1234567 | persianCurrency:'' }} // Output: ۱,۲۳۴,۵۶۷ (no currency)
 */
@Pipe({
  name: 'persianCurrency',
  standalone: true
})
export class PersianCurrencyPipe implements PipeTransform {
  
  transform(value: any, currency: string = 'تومان', showCurrency: boolean = true): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    
    // Convert to number and format with commas
    const numValue = Number(value);
    
    // Handle zero values
    if (numValue === 0) {
      const zeroText = toPersianNumerals('0');
      return showCurrency && currency ? `${zeroText} ${currency}` : zeroText;
    }
    
    // Format with thousand separators
    const formattedNumber = numValue.toLocaleString('en-US');
    
    // Convert to Persian numerals
    const persianNumber = toPersianNumerals(formattedNumber);
    
    // Add currency suffix if requested
    if (showCurrency && currency) {
      return `${persianNumber} ${currency}`;
    }
    
    return persianNumber;
  }
}