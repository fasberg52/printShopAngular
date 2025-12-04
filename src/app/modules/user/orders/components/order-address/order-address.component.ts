import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Address } from '../../../../../core/models/address.model';
import { AddressService } from '../../../../../core/services/address.service';
import { UserOrderService } from '../../services/user-order.service';

@Component({
  selector: 'app-order-address',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './order-address.component.html',
})
export class OrderAddressComponent implements OnInit {
  orderService = inject(UserOrderService);
  addressService = inject(AddressService);

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  addresses = signal<Address[]>([]);
  selectedAddress = this.orderService.selectedAddress;
  showCreateModal = false;

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getAllAddresses().subscribe((data) => {
      this.addresses.set(data);
      // Auto select default if none selected
      if (!this.selectedAddress()) {
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          this.selectAddress(defaultAddr);
        }
      }
    });
  }

  selectAddress(address: Address) {
    this.orderService.setAddress(address);
  }

  onNext() {
    if (this.selectedAddress()) {
      this.next.emit();
    }
  }

  onBack() {
    this.back.emit();
  }
}
