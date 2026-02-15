import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // ✅ token & role localStorage madhun ghe
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // ❌ login nahi
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ route la required role
    const expectedRole = route.data['role'];

    // ❌ role mismatch
    if (expectedRole && role !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
