import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private baseUrl = 'http://localhost:3000/dashboard'; // Use proxy for dev

  constructor(private http: HttpClient) {}

  getTodaySummary() {
    return this.http.get(`${this.baseUrl}/today`);
  }

  getSalesGraph(range: string) {
    return this.http.get<any[]>(`${this.baseUrl}/sales-graph?range=${range}`);
  }

  getAlerts() {
    return this.http.get<any>(`${this.baseUrl}/alerts`);
  }
}
