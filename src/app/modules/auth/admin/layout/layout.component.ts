import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button'; // Import
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ButtonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
