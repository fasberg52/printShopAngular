import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule],
  template: `
    <p-card header="داشبورد"> محتوای داشبورد در اینجا قرار می‌گیرد. </p-card>
  `,
})
export class DashboardComponent {}
