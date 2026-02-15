import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { HttpServicesService } from '../../http-services.service';

@Component({
  selector: 'app-user-panel',
  imports: [RouterModule, CommonModule],
  templateUrl: './userpanel.component.html',
  styleUrl: './userpanel.component.scss'
})
export class UserPanelComponent {
  constructor(
     private router: Router,
     private http: HttpServicesService
  ){}
  sidebarOpen = false;
  isDarkMode = false;
  settingsOpen = false;
  privacyOpen= false;
   
togglePrivacy() {
  this.privacyOpen = !this.privacyOpen;
}

toggleSettings(): void {
  this.settingsOpen = !this.settingsOpen;
}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

logout() {
  this.http.logout().subscribe({
    next: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    },
    error: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  });
}



  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.isDarkMode = theme === 'dark';

    if (this.isDarkMode) {
      document.body.classList.add('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
