import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserOrderService } from '../../services/user-order.service';

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    InputTextModule,
  ],
  templateUrl: './order-payment.component.html',
})
export class OrderPaymentComponent {
  orderService = inject(UserOrderService);

  @Output() back = new EventEmitter<void>();
  @Output() pay = new EventEmitter<void>();

  paymentMethod = this.orderService.paymentMethod;

  // Local model for radio button binding
  get paymentMethodVal() {
    return this.paymentMethod();
  }
  set paymentMethodVal(val: 'zarinpal' | 'wallet') {
    this.orderService.setPaymentMethod(val);
  }

  selectPayment(method: 'zarinpal' | 'wallet') {
    this.orderService.setPaymentMethod(method);
  }

  onBack() {
    this.back.emit();
  }

  onPay() {
    this.pay.emit();
  }
}
