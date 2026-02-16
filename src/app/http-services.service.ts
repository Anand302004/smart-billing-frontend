import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {

  private API = environment.apiUrl;

  private adminUrl = `${this.API}/admin`;
  private paymentsUrl = `${this.API}/payments`;
  private dashboardapi = `${this.API}/adminDashboard`;

  constructor(private http: HttpClient) {}

  /* ================= AUTH ================= */

  refreshToken() {
    return this.http.post<any>(
      `${this.API}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post(
      `${this.API}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  sendOTP(info: any) {
    return this.http.post(
      `${this.API}/verification/send-email`,
      info
    );
  }

  signup(info: any) {
    return this.http.post(
      `${this.API}/api/auth/signup`,
      info
    );
  }

  login(login_data: any) {
    return this.http.post(
      `${this.API}/api/auth/login`,
      login_data,
      { withCredentials: true }
    );
  }

  updateAccount(data: any) {
    return this.http.put(
      `${this.API}/api/auth/update`,
      data
    );
  }

  getAllUsers() {
    return this.http.get<any>(
      `${this.API}/api/auth/users`,
      this.getAuthHeaders()
    );
  }

  disableUser(id: number) {
    return this.http.put(
      `${this.API}/api/auth/disable/${id}`,
      {},
      this.getAuthHeaders()
    );
  }

  enableUser(id: number) {
    return this.http.put(
      `${this.API}/api/auth/enable/${id}`,
      {},
      this.getAuthHeaders()
    );
  }

  checkEmail(info: any) {
    return this.http.post(
      `${this.API}/verification/forget-password`,
      info
    );
  }

  resetPassword(info: any) {
    return this.http.put(
      `${this.API}/verification/reset-password`,
      info
    );
  }

  /* ================= SUBSCRIPTIONS ================= */

  getSubscriptionUsers() {
    return this.http.get<any>(
      `${this.paymentsUrl}/subscription-users`
    );
  }

  getAllSubscriptions(): Observable<any> {
    return this.http.get(`${this.paymentsUrl}/subscriptions`);
  }

  getMySubscription(token: string): Observable<any> {
    return this.http.get(
      `${this.paymentsUrl}/subscriptions/me`,
      { headers: this.auth(token) }
    );
  }

  generateQR(subscription_id: number, token: string): Observable<any> {
    return this.http.post(
      `${this.paymentsUrl}/subscription/qr`,
      { subscription_id },
      { headers: this.auth(token) }
    );
  }

  userConfirmPayment(paymentId: number, token: string): Observable<any> {
    return this.http.post(
      `${this.paymentsUrl}/confirm-payment`,
      { paymentId },
      { headers: this.auth(token) }
    );
  }

  /* ================= ADMIN ================= */

  getPendingPayments(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${this.adminUrl}/pending-payments`,
      { headers: this.auth(token!) }
    );
  }

  approvePayment(paymentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.adminUrl}/confirm-subscription-payment`,
      { paymentId },
      { headers: this.auth(token!) }
    );
  }

  rejectPayment(paymentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `${this.adminUrl}/rejected-request/${paymentId}`,
      { headers: this.auth(token!) }
    );
  }

  /* ================= ADMIN DASHBOARD ================= */

  getStats() {
    return this.http.get<any>(`${this.dashboardapi}/stats`);
  }

  /* ================= HELPERS ================= */

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private auth(token: string) {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
