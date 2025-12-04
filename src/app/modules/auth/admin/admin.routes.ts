import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DeliveryMethodsComponent } from './pages/delivery-methods/delivery-methods.component';
import { PriceRuleFormComponent } from './pages/price-rules/price-rule-form/price-rule-form.component';
import { PriceRulesComponent } from './pages/price-rules/price-rules.component';
import { UsersComponent } from './pages/users/users.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'price-rules', component: PriceRulesComponent },
      { path: 'price-rules/new', component: PriceRuleFormComponent },
      { path: 'price-rules/edit/:id', component: PriceRuleFormComponent },
      { path: 'delivery-methods', component: DeliveryMethodsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
