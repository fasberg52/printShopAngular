import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

/**
 * Loading Button Component
 *
 * A reusable button component that displays a loading state.
 * Follows SOLID principles with single responsibility.
 */
@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.css',
})
export class LoadingButtonComponent {
  // Input signals - following Angular best practices
  label = input.required<string>();
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<string>('button');
  severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'
  >('primary');

  // Output event
  buttonClick = output<void>();

  // Computed signal for button style class
  buttonClass = computed(() => `button-submit`);

  // Computed signal for button state
  isDisabled = computed(() => this.loading() || this.disabled());

  // Handle button click
  onClick(): void {
    if (!this.isDisabled()) {
      this.buttonClick.emit();
    }
  }
}
