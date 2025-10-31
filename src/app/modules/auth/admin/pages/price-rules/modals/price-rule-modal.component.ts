import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { z } from 'zod';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';


import {
  Breakpoint,
  MatchCondition,
  PriceRule,
} from '../../../../../../core/models/price-rule.model';
import { PriceRuleService } from '../../../../../../core/services/price-rule.service';

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
  selector: 'app-price-rule-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    SelectModule,
  ],
  providers: [MessageService],
  templateUrl: './price-rule-modal.component.html',
  styleUrls: ['./price-rule-modal.component.css'],
})
export class PriceRuleModalComponent implements OnInit {
  priceRule = input<PriceRule | null>(null);
  isEditMode = input<boolean>(false);

  close = output<void>();

  // Dialog visibility - starts true, becomes false when closing
  visible = signal<boolean>(true);

  private fb = inject(FormBuilder);
  private priceRuleService = inject(PriceRuleService);
  private messageService = inject(MessageService);

  form!: FormGroup;
  validationErrors = signal<Record<string, string>>({});
  submitting = signal<boolean>(false);
  productTypes = [
    { label: 'چاپ', value: 'print' },
    { label: 'صحافی', value: 'binding' },
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.isEditMode() && this.priceRule()) {
      this.populateForm(this.priceRule()!);
    }
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

  populateForm(priceRule: PriceRule): void {
    this.form.patchValue({
      name: priceRule.name,
      productType: priceRule.productType,
      price: priceRule.price,
      isActive: priceRule.isActive,
    });

    // Populate match conditions
    const matchArray = this.form.get('match') as FormArray;
    matchArray.clear();
    priceRule.match.forEach((match) => {
      matchArray.push(this.createMatchFormGroup(match));
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
    return this.fb.group({
      attributeKey: [match?.attributeKey || ''],
      value: [match?.value || ''],
    });
  }

  addMatchCondition(): void {
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

    // Prepare form value with proper defaults
    const formValue = {
      ...this.form.value,
      match: this.form.value.match || [],
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

    if (this.isEditMode() && this.priceRule()?._id) {
      // Update
      this.priceRuleService
        .updatePriceRule(this.priceRule()!._id!, validatedData)
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.showToast(
              'success',
              'موفق',
              'قانون قیمت با موفقیت به‌روزرسانی شد'
            );
            this.onClose();
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
          this.onClose();
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

  onVisibleChange(value: boolean): void {
    this.visible.set(value);
    if (!value) {
      // Dialog is being closed (X button clicked or ESC pressed)
      this.close.emit();
    }
  }

  onClose(): void {
    this.visible.set(false);
    this.close.emit();
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
