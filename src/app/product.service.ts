import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private API = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.API);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
