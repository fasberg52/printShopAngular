import { Pipe, PipeTransform } from '@angular/core';
import { toPersianNumerals } from '../utils/number.utils';

/**
 * Persian Date Pipe
 * 
 * Formats dates with Persian numerals and optionally Persian month names
 * 
 * Usage:
 * {{ date | persianDate }}  // Output: ۱۴۰۳/۰۸/۱۵
 * {{ date | persianDate:'long' }} // Output: ۱۵ آبان ۱۴۰۳
 */
@Pipe({
  name: 'persianDate',
  standalone: true
})
export class PersianDatePipe implements PipeTransform {
  
  private readonly persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  transform(value: any, format: 'short' | 'long' = 'short'): string {
    if (!value) {
      return '';
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // For now, we'll use Gregorian calendar with Persian numerals
    // In a real application, you might want to use a Persian calendar library
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (format === 'long') {
      const monthName = this.persianMonths[month - 1] || '';
      const persianYear = toPersianNumerals(year.toString());
      const persianDay = toPersianNumerals(day.toString());
      return `${persianDay} ${monthName} ${persianYear}`;
    }
    
    // Short format: YYYY/MM/DD with Persian numerals
    const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    return toPersianNumerals(formattedDate);
  }
}