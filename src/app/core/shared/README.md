# RTL Foundation & Typography System

This document describes the RTL (Right-to-Left) foundation and typography system implemented for the Persian user panel.

## Overview

The RTL foundation provides comprehensive support for Persian/Farsi language interfaces including:

- **Vazir Matn Font Integration**: Professional Persian typography
- **Persian Number Formatting**: Automatic conversion between Latin and Persian numerals
- **RTL CSS Utilities**: Complete RTL layout support
- **PrimeNG RTL Configuration**: RTL-optimized component styling
- **Persian Validation**: Form validation with Persian error messages

## Components

### 1. Typography System

#### Font Configuration

- **Primary Font**: Vazir Matn (Google Fonts)
- **Weights Available**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Fallbacks**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif

#### CSS Classes

```css
.persian-light     /* font-weight: 300 */
/* font-weight: 300 */
.persian-regular   /* font-weight: 400 */
.persian-medium    /* font-weight: 500 */
.persian-semibold  /* font-weight: 600 */
.persian-bold; /* font-weight: 700 */
```

### 2. Persian Number Formatting

#### Pipes Available

##### PersianNumberPipe

```typescript
{
  {
    123456 | persianNumber;
  }
} // Output: ۱۲۳۴۵۶
{
  {
    "123.45" | persianNumber;
  }
} // Output: ۱۲۳.۴۵
```

##### PersianCurrencyPipe

```typescript
{{ 1234567 | persianCurrency }}           // Output: ۱,۲۳۴,۵۶۷ تومان
{{ 1234567 | persianCurrency:'ریال' }}    // Output: ۱,۲۳۴,۵۶۷ ریال
```

##### PersianDatePipe

```typescript
{{ date | persianDate }}        // Output: ۱۴۰۳/۰۸/۱۵
{{ date | persianDate:'long' }}  // Output: ۱۵ آبان ۱۴۰۳
```

#### Utility Functions

```typescript
import { toPersianNumerals, toLatinNumerals } from "./utils/number.utils";

// Convert to Persian numerals for display
const persianNumber = toPersianNumerals("123456"); // ۱۲۳۴۵۶

// Convert to Latin numerals for server communication
const latinNumber = toLatinNumerals("۱۲۳۴۵۶"); // 123456
```

### 3. RTL CSS Utilities

#### Layout Classes

```css
.rtl-container      /* RTL container with proper direction */
/* RTL container with proper direction */
.rtl-flex           /* Flex with row-reverse direction */
.rtl-flex-col       /* Flex column (no reverse needed) */
.rtl-grid; /* Grid with RTL direction */
```

#### Spacing Classes

```css
.mr-auto-rtl        /* margin-left: auto in RTL */
/* margin-left: auto in RTL */
.ml-auto-rtl        /* margin-right: auto in RTL */
.rtl-icon-left      /* Icon positioning for RTL */
.rtl-icon-right; /* Icon positioning for RTL */
```

#### Text Alignment

```css
.text-right-rtl     /* Right alignment for RTL */
/* Right alignment for RTL */
.text-left-rtl      /* Left alignment for RTL */
.rtl-text; /* Combined RTL text styling */
```

### 4. RTL Service

#### Usage

```typescript
import { RtlService } from '@core/services';

constructor(private rtlService: RtlService) {}

// Get RTL state
const isRtl = this.rtlService.isRtl;

// Get RTL-aware classes
const marginClass = this.rtlService.getMarginClass('left', '4');
const textAlign = this.rtlService.getTextAlignClass('right');
```

#### Available Methods

- `isRtl`: Current RTL state
- `setRtl(boolean)`: Set RTL state
- `getRtlClass(baseClass)`: Get RTL-aware class
- `getMarginClass(side, size)`: Get RTL-aware margin
- `getPaddingClass(side, size)`: Get RTL-aware padding
- `getTextAlignClass(align)`: Get RTL-aware text alignment
- `getFlexDirectionClass(reverse)`: Get RTL-aware flex direction

### 5. Persian Validation

#### Available Validators

```typescript
import { PersianValidationService } from "@core/services";

// In reactive forms
this.form = this.fb.group({
  phone: ["", [PersianValidationService.persianPhone()]],
  nationalId: ["", [PersianValidationService.persianNationalId()]],
  name: ["", [PersianValidationService.persianName()]],
  postalCode: ["", [PersianValidationService.persianPostalCode()]],
  email: ["", [PersianValidationService.persianEmail()]],
});
```

#### Error Messages

```typescript
// Get Persian error message
const errorMessage = PersianValidationService.getPersianErrorMessage(control.errors);
```

## PrimeNG RTL Configuration

### Automatic RTL Support

All PrimeNG components are automatically configured for RTL:

- **Forms**: Input fields, selects, textareas
- **Navigation**: Menus, sidebars, breadcrumbs
- **Data Display**: Tables, cards, panels
- **Overlays**: Dialogs, toasts, dropdowns
- **Layout**: Toolbars, splitters, accordions

### Component-Specific Classes

```html
<!-- Form with RTL support -->
<form class="rtl-form">
  <div class="p-field">
    <label for="name">نام</label>
    <input pInputText id="name" class="rtl-text" />
  </div>
</form>

<!-- Button with RTL icon positioning -->
<p-button class="rtl-button" label="ذخیره" icon="pi pi-save"></p-button>

<!-- Table with RTL alignment -->
<p-table class="rtl-table" [value]="data">
  <!-- columns -->
</p-table>
```

## Usage Examples

### Basic RTL Layout

```html
<div class="rtl-container">
  <h1 class="persian-bold">عنوان صفحه</h1>
  <p class="persian-text">متن فارسی با فونت مناسب</p>

  <div class="rtl-flex gap-4">
    <button class="rtl-button">دکمه اول</button>
    <button class="rtl-button">دکمه دوم</button>
  </div>
</div>
```

### Form with Persian Validation

```typescript
// Component
export class UserFormComponent {
  form = this.fb.group({
    name: ["", [Validators.required, PersianValidationService.persianName()]],
    phone: ["", [Validators.required, PersianValidationService.persianPhone()]],
  });

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.errors) {
      return PersianValidationService.getPersianErrorMessage(control.errors);
    }
    return "";
  }
}
```

```html
<!-- Template -->
<form [formGroup]="form" class="rtl-form">
  <div class="p-field">
    <p-floatlabel>
      <input pInputText formControlName="name" class="rtl-text" />
      <label>نام</label>
    </p-floatlabel>
    <small class="p-error" *ngIf="form.get('name')?.errors"> {{ getErrorMessage('name') }} </small>
  </div>
</form>
```

### Data Display with Persian Numbers

```html
<p-table [value]="orders" class="rtl-table">
  <ng-template pTemplate="header">
    <tr>
      <th>شماره سفارش</th>
      <th>مبلغ</th>
      <th>تاریخ</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-order>
    <tr>
      <td>{{ order.number | persianNumber }}</td>
      <td>{{ order.amount | persianCurrency }}</td>
      <td>{{ order.date | persianDate }}</td>
    </tr>
  </ng-template>
</p-table>
```

## Browser Support

- **Modern Browsers**: Full support for RTL and Persian fonts
- **Mobile Browsers**: Responsive RTL layout
- **Print**: RTL-aware print styles included

## Performance Considerations

- **Font Loading**: Optimized with `display=swap`
- **CSS Bundle**: Efficient RTL utilities
- **Tree Shaking**: Unused utilities are removed
- **Caching**: Font and CSS caching enabled

## Accessibility

- **Screen Readers**: Proper RTL support
- **Keyboard Navigation**: RTL-aware tab order
- **ARIA Labels**: Persian language support
- **Color Contrast**: WCAG 2.1 AA compliant

## Testing

Use the `RtlTestComponent` to verify RTL functionality:

```typescript
import { RtlTestComponent } from "@core/shared/components";

// Add to your module or component for testing
```

This component displays examples of:

- Persian number formatting
- Currency formatting
- Date formatting
- RTL layout behavior
