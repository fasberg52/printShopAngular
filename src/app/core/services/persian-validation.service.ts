import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNumeric, normalizeToLatin } from '../shared/utils/number.utils';

/**
 * Persian Validation Service
 * 
 * Provides validation functions for Persian/Farsi input fields
 */
@Injectable({
  providedIn: 'root'
})
export class PersianValidationService {
  
  /**
   * Persian phone number validator
   * Accepts both Persian and Latin numerals
   */
  static persianPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const phoneNumber = normalizeToLatin(control.value);
      
      // Iranian mobile number pattern (09xxxxxxxxx)
      const mobilePattern = /^09[0-9]{9}$/;
      
      if (!mobilePattern.test(phoneNumber)) {
        return { 
          persianPhone: { 
            message: 'شماره تلفن همراه معتبر نیست',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian national ID validator
   * Validates Iranian national ID (کد ملی)
   */
  static persianNationalId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const nationalId = normalizeToLatin(control.value);
      
      // Must be exactly 10 digits
      if (!/^[0-9]{10}$/.test(nationalId)) {
        return { 
          persianNationalId: { 
            message: 'کد ملی باید ۱۰ رقم باشد',
            actualValue: control.value 
          } 
        };
      }
      
      // Check for invalid patterns (all same digits)
      if (/^(\d)\1{9}$/.test(nationalId)) {
        return { 
          persianNationalId: { 
            message: 'کد ملی معتبر نیست',
            actualValue: control.value 
          } 
        };
      }
      
      // Validate checksum
      const digits = nationalId.split('').map(Number);
      const checksum = digits.slice(0, 9).reduce((sum, digit, index) => {
        return sum + (digit * (10 - index));
      }, 0) % 11;
      
      const lastDigit = digits[9];
      const isValid = checksum < 2 ? checksum === lastDigit : (11 - checksum) === lastDigit;
      
      if (!isValid) {
        return { 
          persianNationalId: { 
            message: 'کد ملی معتبر نیست',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian postal code validator
   */
  static persianPostalCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const postalCode = normalizeToLatin(control.value);
      
      // Iranian postal code pattern (10 digits)
      if (!/^[0-9]{10}$/.test(postalCode)) {
        return { 
          persianPostalCode: { 
            message: 'کد پستی باید ۱۰ رقم باشد',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian text validator (only Persian characters, spaces, and common punctuation)
   */
  static persianText(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      // Persian characters, Arabic numerals, spaces, and common punctuation
      const persianPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u200C\u200D\s\u06F0-\u06F9۰-۹\.\,\!\?\:\;\-\(\)]+$/;
      
      if (!persianPattern.test(control.value)) {
        return { 
          persianText: { 
            message: 'لطفا فقط از حروف فارسی استفاده کنید',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian name validator (Persian characters and spaces only)
   */
  static persianName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      // Persian characters and spaces only
      const namePattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u200C\u200D\s]+$/;
      
      if (!namePattern.test(control.value.trim())) {
        return { 
          persianName: { 
            message: 'نام باید فقط شامل حروف فارسی باشد',
            actualValue: control.value 
          } 
        };
      }
      
      // Check minimum length
      if (control.value.trim().length < 2) {
        return { 
          persianName: { 
            message: 'نام باید حداقل ۲ حرف باشد',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian numeric validator (accepts both Persian and Latin numerals)
   */
  static persianNumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      if (!isNumeric(control.value)) {
        return { 
          persianNumeric: { 
            message: 'لطفا فقط عدد وارد کنید',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Persian email validator (supports Persian domains)
   */
  static persianEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      // Basic email pattern that supports Persian domains
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailPattern.test(control.value)) {
        return { 
          persianEmail: { 
            message: 'آدرس ایمیل معتبر نیست',
            actualValue: control.value 
          } 
        };
      }
      
      return null;
    };
  }
  
  /**
   * Get Persian error message for a validation error
   */
  static getPersianErrorMessage(errors: ValidationErrors): string {
    const errorKeys = Object.keys(errors);
    
    if (errorKeys.length === 0) {
      return '';
    }
    
    const firstError = errors[errorKeys[0]];
    
    // If the error has a custom Persian message, use it
    if (firstError && firstError.message) {
      return firstError.message;
    }
    
    // Default Persian messages for common validators
    const defaultMessages: { [key: string]: string } = {
      required: 'این فیلد الزامی است',
      email: 'آدرس ایمیل معتبر نیست',
      minlength: `حداقل ${firstError?.requiredLength || ''} کاراکتر وارد کنید`,
      maxlength: `حداکثر ${firstError?.requiredLength || ''} کاراکتر مجاز است`,
      min: `مقدار باید بیشتر از ${firstError?.min || ''} باشد`,
      max: `مقدار باید کمتر از ${firstError?.max || ''} باشد`,
      pattern: 'فرمت وارد شده صحیح نیست'
    };
    
    return defaultMessages[errorKeys[0]] || 'مقدار وارد شده معتبر نیست';
  }
}