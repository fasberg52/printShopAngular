import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { z } from 'zod';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import {
  Breakpoint,
  MatchCondition,
  PriceRule,
} from '../../../../../../core/models/price-rule.model';
import { PriceRuleService } from '../../../../../../core/services/price-rule.service';

// Helper functions for Persian to English mapping
interface AttributeOption {
  label: string; // Persian label
  value: string; // English key
}

interface ValueOption {
  label: string; // Persian label
  value: string; // English value
}

const ATTRIBUTE_OPTIONS: Record<string, AttributeOption[]> = {
  print: [
    { label: 'اندازه کاغذ', value: 'size' },
    { label: 'رنگ چاپ', value: 'color' },
    { label: 'نوع رو', value: 'side' },
  ],
  binding: [
    { label: 'نوع صحافی', value: 'bindingType' },
    { label: 'اندازه کاغذ', value: 'size' },
  ],
};

const VALUE_OPTIONS: Record<string, ValueOption[]> = {
  size: [
    { label: 'A3', value: 'a3' },
    { label: 'A4', value: 'a4' },
    { label: 'A5', value: 'a5' },
  ],
  color: [
    { label: 'سیاه و سفید', value: 'blackAndWhite' },
    { label: 'رنگی معمولی', value: 'normalColor' },
    { label: 'تمام رنگ', value: 'fullColor' },
  ],
  side: [
    { label: 'تک رو', value: 'single_sided' },
    { label: 'دو رو', value: 'double_sided' },
  ],
  bindingType: [
    { label: 'فنری معمولی', value: 'springNormal' },
    { label: 'فنری پاپکو', value: 'springPapco' },
    { label: 'منگنه', value: 'stapler' },
  ],
};

// Convert Persian value to English key (for form submission)
function persianToEnglish(value: string, attributeKey: string): string {
  const options = VALUE_OPTIONS[attributeKey];
  if (!options) return value;

  const found = options.find(
    (opt) => opt.label === value || opt.value === value
  );
  return found ? found.value : value;
}

// Convert English key to Persian label (for form display)
function englishToPersian(value: string, attributeKey: string): string {
  const options = VALUE_OPTIONS[attributeKey];
  if (!options) return value;

  const found = options.find((opt) => opt.value === value);
  return found ? found.label : value;
}

// Zod Schema for Price Rule validation
const priceRuleSchema = z.object({
  name: z.string().min(1, 'نام قانون الزامی است'),
  productType: z.enum(['print', 'binding'], {
    errorMap: () => ({ message: 'نوع محصول باید چاپ یا صحافی باشد' }),
  }),
  price: z
    .number({ required_error: 'قیمت الزامی است' })
    .min(0, 'قیمت باید عددی مثبت یا صفر باشد'),
  isActive: z.boolean().default(true),
  match: z
    .array(
      z.object({
        attributeKey: z.string().min(1, 'کلید شرط نمی‌تواند خالی باشد'),
        value: z.string().min(1, 'مقدار شرط نمی‌تواند خالی باشد'),
      })
    )
    .default([]),
  breakpoints: z
    .array(
      z.object({
        at: z
          .number({
            required_error: 'تعداد الزامی است',
            invalid_type_error: 'تعداد باید عدد باشد',
          })
          .min(1, 'تعداد باید حداقل ۱ باشد'),
        price: z
          .number({
            required_error: 'قیمت الزامی است',
            invalid_type_error: 'قیمت باید عدد باشد',
          })
          .min(0, 'قیمت باید عددی مثبت یا صفر باشد'),
      })
    )
    .default([]),
});

@Component({
  selector: 'app-price-rule-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './price-rule-form.component.html',
})
export class PriceRuleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private priceRuleService = inject(PriceRuleService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  validationErrors = signal<Record<string, string>>({});
  submitting = signal<boolean>(false);
  loading = signal<boolean>(true);
  isEditMode = signal<boolean>(false);
  priceRuleId = signal<string | null>(null);

  productTypes = [
    { label: 'چاپ', value: 'print' },
    { label: 'صحافی', value: 'binding' },
  ];

  // Computed attribute options based on product type
  attributeOptions = computed(() => {
    const productType = this.form?.get('productType')?.value;
    return productType ? ATTRIBUTE_OPTIONS[productType] || [] : [];
  });

  // Expose helper functions to template
  readonly ATTRIBUTE_OPTIONS = ATTRIBUTE_OPTIONS;
  readonly VALUE_OPTIONS = VALUE_OPTIONS;

  // Get value options for a given attribute key
  getValueOptions(attributeKey: string): ValueOption[] {
    return VALUE_OPTIONS[attributeKey] || [];
  }

  ngOnInit(): void {
    this.initForm();

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.priceRuleId.set(id);
      this.loadPriceRule(id);
    } else {
      this.loading.set(false);
    }

    // Clear match conditions when product type changes
    this.form.get('productType')?.valueChanges.subscribe(() => {
      const matchArray = this.form.get('match') as FormArray;
      matchArray.clear();
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [''],
      productType: [null],
      price: [null],
      isActive: [true],
      match: this.fb.array([]),
      breakpoints: this.fb.array([]),
    });
  }

  loadPriceRule(id: string): void {
    this.loading.set(true);
    this.priceRuleService.getPriceRuleById(id).subscribe({
      next: (priceRule: PriceRule) => {
        this.populateForm(priceRule);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.showToast('error', 'خطا', 'خطا در بارگذاری قانون قیمت');
        console.error('Error loading price rule:', error);
        this.router.navigate(['/admin/price-rules']);
      },
    });
  }

  populateForm(priceRule: PriceRule): void {
    this.form.patchValue({
      name: priceRule.name,
      productType: priceRule.productType,
      price: priceRule.price,
      isActive: priceRule.isActive,
    });

    // Populate match conditions (convert English values to Persian labels for display)
    const matchArray = this.form.get('match') as FormArray;
    matchArray.clear();
    priceRule.match.forEach((match) => {
      const persianValue = englishToPersian(match.value, match.attributeKey);
      matchArray.push(
        this.createMatchFormGroup({
          attributeKey: match.attributeKey,
          value: persianValue, // Store Persian label for dropdown display
        })
      );
    });

    // Populate breakpoints
    const breakpointsArray = this.form.get('breakpoints') as FormArray;
    breakpointsArray.clear();
    priceRule.breakpoints.forEach((bp) => {
      breakpointsArray.push(this.createBreakpointFormGroup(bp));
    });
  }

  // Match conditions FormArray methods
  get matchArray(): FormArray {
    return this.form.get('match') as FormArray;
  }

  createMatchFormGroup(match?: MatchCondition): FormGroup {
    const group = this.fb.group({
      attributeKey: [match?.attributeKey || ''],
      value: [match?.value || ''],
    });

    // Reset value when attributeKey changes
    group.get('attributeKey')?.valueChanges.subscribe(() => {
      group.get('value')?.setValue('', { emitEvent: false });
    });

    return group;
  }

  addMatchCondition(): void {
    const productType = this.form.get('productType')?.value;
    if (!productType) {
      this.showToast('warn', 'توجه', 'ابتدا نوع محصول را انتخاب کنید');
      return;
    }
    this.matchArray.push(this.createMatchFormGroup());
  }

  removeMatchCondition(index: number): void {
    this.matchArray.removeAt(index);
  }

  // Breakpoints FormArray methods
  get breakpointsArray(): FormArray {
    return this.form.get('breakpoints') as FormArray;
  }

  createBreakpointFormGroup(bp?: Breakpoint): FormGroup {
    return this.fb.group({
      at: [bp?.at || null],
      price: [bp?.price || null],
    });
  }

  addBreakpoint(): void {
    this.breakpointsArray.push(this.createBreakpointFormGroup());
  }

  removeBreakpoint(index: number): void {
    this.breakpointsArray.removeAt(index);
  }

  onSubmit(): void {
    // Clear previous errors
    this.validationErrors.set({});

    // Convert Persian values to English before validation
    const convertedMatch = (this.form.value.match || []).map(
      (match: MatchCondition) => ({
        attributeKey: match.attributeKey,
        value: persianToEnglish(match.value, match.attributeKey),
      })
    );

    // Prepare form value with proper defaults
    const formValue = {
      ...this.form.value,
      match: convertedMatch,
      breakpoints: this.form.value.breakpoints || [],
    };

    // Validate with Zod
    const result = priceRuleSchema.safeParse(formValue);

    if (!result.success) {
      // Flatten errors and format them
      const flattened = result.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};

      // Map Zod field errors to our error format
      (Object.keys(flattened) as Array<keyof typeof flattened>).forEach(
        (key) => {
          const error = flattened[key];
          if (error && error.length > 0) {
            errorMap[key as string] = error[0];
          }
        }
      );

      // Handle nested array errors (match and breakpoints)
      result.error.errors.forEach((err) => {
        const pathArray = err.path;
        if (pathArray.length === 3 && pathArray[0] === 'match') {
          // Format: ['match', index, 'attributeKey' | 'value']
          const index = pathArray[1];
          const field = pathArray[2];
          if (typeof index === 'number' && typeof field === 'string') {
            errorMap[`match.${index}.${field}`] = err.message;
          }
        } else if (pathArray.length === 3 && pathArray[0] === 'breakpoints') {
          // Format: ['breakpoints', index, 'at' | 'price']
          const index = pathArray[1];
          const field = pathArray[2];
          if (typeof index === 'number' && typeof field === 'string') {
            errorMap[`breakpoints.${index}.${field}`] = err.message;
          }
        }
      });

      this.validationErrors.set(errorMap);
      return;
    }

    // Validation passed, proceed with API call
    const validatedData = result.data;
    this.submitting.set(true);

    if (this.isEditMode() && this.priceRuleId()) {
      // Update
      this.priceRuleService
        .updatePriceRule(this.priceRuleId()!, validatedData)
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.showToast(
              'success',
              'موفق',
              'قانون قیمت با موفقیت به‌روزرسانی شد'
            );
            this.router.navigate(['/admin/price-rules']);
          },
          error: (error) => {
            this.submitting.set(false);
            const errorMessage =
              error?.error?.message ||
              error?.message ||
              'خطا در به‌روزرسانی قانون قیمت';
            this.showToast('error', 'خطا', errorMessage);
            console.error('Error updating price rule:', error);
          },
        });
    } else {
      // Create
      this.priceRuleService.createPriceRule(validatedData).subscribe({
        next: () => {
          this.submitting.set(false);
          this.showToast('success', 'موفق', 'قانون قیمت با موفقیت ایجاد شد');
          this.router.navigate(['/admin/price-rules']);
        },
        error: (error) => {
          this.submitting.set(false);
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            'خطا در ایجاد قانون قیمت';
          this.showToast('error', 'خطا', errorMessage);
          console.error('Error creating price rule:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/price-rules']);
  }

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({
      severity: severity as any,
      summary,
      detail,
      life: 5000,
    });
  }
}
