import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/**
 * Loading Button Component
 *
 * A reusable button component that displays a loading state using PrimeNG.
 * Follows SOLID principles with single responsibility.
 */
@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      [type]="type()"
      [disabled]="isDisabled()"
      [loading]="loading()"
      [severity]="severity()"
      [size]="size()"
      [label]="label() || undefined"
      [attr.aria-label]="label() || null"
      [class]="'w-full ' + (class() || '')"
      (onClick)="onClick()"
    >
      <ng-content></ng-content>
    </p-button>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingButtonComponent {
  // Input signals - following Angular best practices
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<string>('button');
  severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'danger' | 'help' | 'contrast'
  >('primary');
  size = input<'small' | 'large' | undefined>(undefined);
  class = input<string>('');
  label = input<string>('');

  // Output event
  buttonClick = output<void>();

  // Computed signal for button state
  isDisabled = computed(() => this.loading() || this.disabled());

  // Handle button click
  onClick(): void {
    if (!this.isDisabled()) {
      this.buttonClick.emit();
    }
  }
}
