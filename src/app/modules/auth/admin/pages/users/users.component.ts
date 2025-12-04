import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PaginationInfo, User } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  pagination = signal<PaginationInfo>({
    total: 0,
    skip: 0,
    limit: 10,
  });
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(skip: number = 0) {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers(skip, this.pagination().limit).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    this.loadUsers(event.first);
  }

  nextPage() {
    const newSkip = this.pagination().skip + this.pagination().limit;
    if (newSkip < this.pagination().total) {
      this.loadUsers(newSkip);
    }
  }

  previousPage() {
    const newSkip = this.pagination().skip - this.pagination().limit;
    if (newSkip >= 0) {
      this.loadUsers(newSkip);
    }
  }

  goToPage(page: number) {
    const newSkip = page * this.pagination().limit;
    this.loadUsers(newSkip);
  }

  get totalPages(): number {
    return Math.ceil(this.pagination().total / this.pagination().limit);
  }

  get currentPage(): number {
    return Math.floor(this.pagination().skip / this.pagination().limit);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
