import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {

  private adminUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  /* ================= AUTH ================= */
refreshToken() {
  return this.http.post<any>(
    'http://localhost:3000/api/auth/refresh',
    {},
    { withCredentials: true }
  );
}



logout() {
  return this.http.post(
    'http://localhost:3000/api/auth/logout',
    {},
    { withCredentials: true }
  );
}



  private getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}


  sendOTP(info: any) {
    return this.http.post(
      'http://localhost:3000/verification/send-email',
      info
    );
  }

  signup(info: any) {
    return this.http.post(
      'http://localhost:3000/api/auth/signup',
      info
    );
  }

  login(login_data: any) {
    return this.http.post(
      'http://localhost:3000/api/auth/login',
      login_data,
    { withCredentials: true }
    );
  }
  
  updateAccount(data:any) {
  return this.http.put(
    'http://localhost:3000/api/auth/update',
    data
  );
}


  getAllUsers() {
  return this.http.get<any>(
    `http://localhost:3000/api/auth/users`,
    this.getAuthHeaders()
  );
}

disableUser(id: number) {
  return this.http.put(
    `http://localhost:3000/api/auth/disable/${id}`,
    {},
    this.getAuthHeaders()
  );
}

enableUser(id: number) {
  return this.http.put(
    `http://localhost:3000/api/auth/enable/${id}`,
    {},
    this.getAuthHeaders()
  );
}


  checkEmail(info: any) {
    return this.http.post(
      'http://localhost:3000/verification/forget-password',
      info
    );
  }

  resetPassword(info: any) {
    return this.http.put(
      'http://localhost:3000/verification/reset-password',
      info
    );
  }

  /* ================= SUBSCRIPTIONS ================= */

   private paymentsUrl = 'http://localhost:3000/payments';

  

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

  /* ✅ USER CONFIRM (NOT ADMIN) */
  userConfirmPayment(paymentId: number, token: string): Observable<any> {
    return this.http.post(
      `${this.paymentsUrl}/confirm-payment`,
      { paymentId },
      { headers: this.auth(token) }
    );
  }

  /* ================= ADMIN METHODS ================= */

  // 1️⃣ Fetch all pending payments (USER_CONFIRMED)
  getPendingPayments(): Observable<any[]> {
    const token = localStorage.getItem('token'); // admin token
    return this.http.get<any[]>(`${this.adminUrl}/pending-payments`, { headers: this.auth(token!) });
  }

  // 2️⃣ Approve a payment (mark SUCCESS + activate subscription)
  approvePayment(paymentId: number): Observable<any> {
    const token = localStorage.getItem('token'); // admin token
    return this.http.post(`${this.adminUrl}/confirm-subscription-payment`,
      { paymentId },
      { headers: this.auth(token!) }
    );
  }

  // 3 Reject a payment
  rejectPayment(paymentId: number): Observable<any> {
  const token = localStorage.getItem('token'); // 👈 admin token

  return this.http.delete(
    `${this.adminUrl}/rejected-request/${paymentId}`,
    {
      headers: this.auth(token!)
    }
  );
}


/* ================= ADMIN DASHBOARD APIS ================= */
 private dashboardapi = 'http://localhost:3000/adminDashboard';
getStats() {
    return this.http.get<any>(`${this.dashboardapi}/stats`);
  }

  /* ================= PRIVATE HELPERS ================= */
  private auth(token: string) {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  
}
