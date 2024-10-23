import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import { ORDER_CREATE_URL } from '../shared/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  
  constructor(
    private _http: HttpClient,
  ) { }
  
  create(order: Order) {
    return this._http.post<Order>(ORDER_CREATE_URL, order);
  }
}