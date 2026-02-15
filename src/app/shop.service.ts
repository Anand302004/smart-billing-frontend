import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private api = 'http://localhost:3000/shop';

  constructor(private http: HttpClient) {}

  getShop(): Observable<any> {
    return this.http.get(this.api);
  }

  createShop(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateShop(data: any): Observable<any> {
    return this.http.put(this.api, data);
  }
}
