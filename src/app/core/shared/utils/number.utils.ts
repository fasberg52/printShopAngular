/**
 * Number Utilities for Persian/Latin Number Conversion
 *
 * This utility handles conversion between Persian (Farsi) and Latin numerals
 * for display in UI vs server communication.
 */

/**
 * Converts a string containing Persian digits to Latin digits
 * Useful when sending data to server
 *
 * @param value - String containing Persian digits
 * @returns String with Latin digits
 *
 * @example
 * toLatinNumerals('۰۹۱۲۳۴۵۶۷۸۹') // returns '09123456789'
 */
export function toLatinNumerals(value: string): string {
  if (!value) return '';

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const latinDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = value;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), latinDigits[i]);
  }
  return result;
}

/**
 * Converts a string containing Latin digits to Persian digits
 * Useful for display in UI
 *
 * @param value - String containing Latin digits
 * @returns String with Persian digits
 *
 * @example
 * toPersianNumerals('09123456789') // returns '۰۹۱۲۳۴۵۶۷۸۹'
 */
export function toPersianNumerals(value: string): string {
  if (!value) return '';

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const latinDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = value;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(latinDigits[i], 'g'), persianDigits[i]);
  }
  return result;
}

/**
 * Removes all non-numeric characters (Persian or Latin) from a string
 *
 * @param value - String to clean
 * @returns String containing only Persian/Latin digits
 */
export function extractDigits(value: string): string {
  if (!value) return '';
  // Remove everything except Persian (۰-۹) and Latin (0-9) digits
  return value.replace(/[^۰-۹0-9]/g, '');
}

/**
 * Converts any string to Latin digits for server communication
 *
 * @param value - String with possible Persian digits
 * @returns String with Latin digits only
 */
export function normalizeToLatin(value: string): string {
  return toLatinNumerals(extractDigits(value));
}

/**
 * Converts any string to Persian digits for UI display
 *
 * @param value - String with possible Latin digits
 * @returns String with Persian digits only
 */
export function normalizeToPersian(value: string): string {
  return toPersianNumerals(extractDigits(value));
}

/**
 * Formats a phone number with Persian digits for display
 *
 * @param phone - Phone number string
 * @returns Formatted Persian phone number
 */
export function formatPersianPhone(phone: string): string {
  const cleaned = normalizeToLatin(phone).replace(/\D/g, '').slice(0, 11);
  return toPersianNumerals(cleaned);
}

/**
 * Validates if a string contains only digits (Persian or Latin)
 *
 * @param value - String to validate
 * @returns True if contains only digits
 */
export function isNumeric(value: string): boolean {
  if (!value) return false;
  // Check if string contains only Persian or Latin digits
  return /^[۰-۹0-9]+$/.test(value);
}

/**
 * Gets the numeric value as a string (converted to Latin)
 * Useful for length checking, comparisons, etc.
 *
 * @param value - String with Persian or Latin digits
 * @returns String with Latin digits
 */
export function getNumericValue(value: string): string {
  return normalizeToLatin(value);
}
