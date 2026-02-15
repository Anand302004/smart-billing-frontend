import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpServicesService } from '../../http-services.service';

@Component({
  selector: 'app-subscription-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-users.component.html',
  styleUrls: ['./subscription-users.component.scss']
})
export class SubscriptionUsersComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  loading = false;

  searchText = '';
  planFilter = 'all';   // ✅ PLAN FILTER

  constructor(private service: HttpServicesService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.service.getSubscriptionUsers().subscribe({
      next: (res:any) => {
        this.users = res.users || [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /* ✅ SEARCH + PLAN FILTER */
  applyFilters() {

    let data = [...this.users];

    // SEARCH
    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase();

      data = data.filter(u =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }

    // PLAN FILTER
    if (this.planFilter !== 'all') {
      data = data.filter(
        u => u.plan_name?.toLowerCase() === this.planFilter
      );
    }

    this.filteredUsers = data;
  }

  getRemainingDays(endDate:string){
    const today = new Date().getTime();
    const end = new Date(endDate).getTime();
    return Math.max(Math.ceil((end-today)/(1000*60*60*24)),0);
  }

  trackById(index:number,user:any){
    return user.id;
  }
}
