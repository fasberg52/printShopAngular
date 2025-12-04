import { computed, Injectable, signal } from '@angular/core';
import { Address } from '../../../../core/models/address.model';

export interface OrderFile {
  file: File;
  id: string;
  config: {
    colorMode: 'bw' | 'color';
    paperSize: 'a4' | 'a3' | 'a5';
    printSide: 'single' | 'double';
    copies: number;
  };
}

export interface OrderConfig {
  bindingType: 'coil_clear' | 'coil_papco' | 'staple' | 'none';
  bindingMethod: 'all' | 'separate';
  description: string;
  hasDescription: boolean;
  copies: number;
}

export interface OrderState {
  files: OrderFile[];
  config: OrderConfig;
  selectedAddress: Address | null;
  paymentMethod: 'zarinpal' | 'wallet';
  discountCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
  // State
  private state = signal<OrderState>({
    files: [],
    config: {
      bindingType: 'none',
      bindingMethod: 'all',
      description: '',
      hasDescription: false,
      copies: 1,
    },
    selectedAddress: null,
    paymentMethod: 'zarinpal',
    discountCode: '',
  });

  // Selectors
  files = computed(() => this.state().files);
  config = computed(() => this.state().config);
  selectedAddress = computed(() => this.state().selectedAddress);
  paymentMethod = computed(() => this.state().paymentMethod);

  // Actions
  updateConfig(config: Partial<OrderConfig>) {
    this.state.update((s) => ({
      ...s,
      config: { ...s.config, ...config },
    }));
  }

  addFile(file: File) {
    const newFile: OrderFile = {
      file,
      id: Math.random().toString(36).substring(7),
      config: {
        colorMode: 'bw',
        paperSize: 'a4',
        printSide: 'single',
        copies: 1,
      },
    };
    this.state.update((s) => ({
      ...s,
      files: [...s.files, newFile],
    }));
  }

  removeFile(id: string) {
    this.state.update((s) => ({
      ...s,
      files: s.files.filter((f) => f.id !== id),
    }));
  }

  updateFileConfig(id: string, config: Partial<OrderFile['config']>) {
    this.state.update((s) => ({
      ...s,
      files: s.files.map((f) =>
        f.id === id ? { ...f, config: { ...f.config, ...config } } : f
      ),
    }));
  }

  setAddress(address: Address) {
    this.state.update((s) => ({ ...s, selectedAddress: address }));
  }

  setPaymentMethod(method: 'zarinpal' | 'wallet') {
    this.state.update((s) => ({ ...s, paymentMethod: method }));
  }

  // Mock Price Calculation
  totalPrice = computed(() => {
    const filePrice = this.files().reduce((acc, file) => {
      let price = 1250; // Base price
      if (file.config.colorMode === 'color') price *= 2;
      if (file.config.printSide === 'double') price *= 1.5;
      return acc + price * file.config.copies;
    }, 0);

    const bindingPrice = this.config().bindingType !== 'none' ? 15000 : 0;

    return (filePrice + bindingPrice) * this.config().copies;
  });
}
