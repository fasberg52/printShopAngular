import { Pipe, PipeTransform } from '@angular/core';
import { toPersianNumerals } from '../utils/number.utils';

/**
 * Persian Number Pipe
 * 
 * Transforms numbers and numeric strings to Persian (Farsi) numerals for display
 * 
 * Usage:
 * {{ 123456 | persianNumber }}  // Output: ۱۲۳۴۵۶
 * {{ '123.45' | persianNumber }} // Output: ۱۲۳.۴۵
 * {{ phoneNumber | persianNumber }} // Output: Persian digits
 */
@Pipe({
  name: 'persianNumber',
  standalone: true
})
export class PersianNumberPipe implements PipeTransform {
  
  transform(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    // Convert to string if it's a number
    const stringValue = String(value);
    
    // Use the existing utility function to convert to Persian numerals
    return toPersianNumerals(stringValue);
  }
}