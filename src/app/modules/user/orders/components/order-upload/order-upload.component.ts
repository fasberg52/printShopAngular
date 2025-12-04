import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { UserOrderService } from '../../services/user-order.service';
import { UserPriceCalculatorComponent } from '../user-price-calculator/user-price-calculator.component';

@Component({
  selector: 'app-order-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    TooltipModule,
    UserPriceCalculatorComponent,
  ],
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.css'],
})
export class OrderUploadComponent {
  orderService = inject(UserOrderService);

  @Output() next = new EventEmitter<void>();
  @ViewChild(UserPriceCalculatorComponent)
  calculator!: UserPriceCalculatorComponent;

  // UI State
  uploadSource: any = 'site';
  isDragOver = false;

  // Options
  colorModes = [
    { label: 'سیاه و سفید', value: 'bw' },
    { label: 'رنگی', value: 'color' },
  ];

  paperSizes = [
    { label: 'A4', value: 'a4' },
    { label: 'A3', value: 'a3' },
    { label: 'A5', value: 'a5' },
  ];

  printSides = [
    { label: 'یک رو', value: 'single' },
    { label: 'دو رو', value: 'double' },
  ];

  // Methods
  openCalculator() {
    this.calculator.show();
  }

  updateFile(id: string, config: any) {
    this.orderService.updateFileConfig(id, config);
  }

  removeFile(id: string) {
    this.orderService.removeFile(id);
  }

  // Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      // Validate file type/size if needed
      this.orderService.addFile(file);
    });
  }

  onNext() {
    this.next.emit();
  }
}
