import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class BillingService {
  private API = 'http://localhost:3000/billing';

  constructor(private http: HttpClient) {}

  createBill(payload: {
  items: any[],
  discount_percent: number
}) {
  return this.http.post(`${this.API}/create`, payload);
}


  generateQR(billId: number, amount: number) {
    return this.http.post(`${this.API}/generate-qr`, { billId, amount });
  }

  confirmUPI(paymentId: number, upi_txn_id: string) {
    return this.http.post(`${this.API}/confirm-upi`, { paymentId, upi_txn_id });
  }

  cashPayment(billId: number) {
    return this.http.post(`${this.API}/cash-payment`, { billId });
  }
  getBillById(id: number) {
  return this.http.get(`${this.API}/${id}`);
}
getBillingHistory(filters?: {
    from?: string;
    to?: string;
    mode?: string;
  }) {
    let params = new HttpParams();

    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.mode) params = params.set('mode', filters.mode);

    return this.http.get<any[]>(
      `${this.API}/history`,
      { params }
    );
  }

exportPdf(filters: any) {
  const params: any = {};

  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.mode) params.mode = filters.mode;

  return this.http.get(
    'http://localhost:3000/billing/export-pdf',
    {
      params,
      responseType: 'blob'
    }
  );
}
}
