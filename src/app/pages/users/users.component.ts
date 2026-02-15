import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpServicesService } from '../../http-services.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  loading = false;

  searchText = '';
  statusFilter = 'all';

  constructor(private authService: HttpServicesService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.authService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters() {

    let data = [...this.users];

    // SEARCH
    if (this.searchText) {
      const term = this.searchText.toLowerCase();

      data = data.filter(u =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }

    // STATUS FILTER
    if (this.statusFilter === 'active') {
      data = data.filter(u => u.is_active);
    }

    if (this.statusFilter === 'blocked') {
      data = data.filter(u => !u.is_active);
    }

    this.filteredUsers = data;
  }

  toggleStatus(user: any) {

    if (user.role?.toLowerCase() === 'admin') return;

    const request = user.is_active
      ? this.authService.disableUser(user.id)
      : this.authService.enableUser(user.id);

    request.subscribe(() => {
      user.is_active = !user.is_active;
      this.applyFilters();
    });
  }

  trackByUserId(index: number, user: any) {
    return user.id;
  }
}
