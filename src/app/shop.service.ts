import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShopService {

  private api = `${environment.apiUrl}/shop`;

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
