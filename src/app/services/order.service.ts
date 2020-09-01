import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  currentOrderId=0;
  constructor(private http:HttpClient) { }
  newOrder(orderDetails){
    return this.http.post<any>(GlobalConstants.apiURL+"neworder",orderDetails);
  }
  myOrders(userId){
    return this.http.get<any>(GlobalConstants.apiURL+"myorder/"+userId);
  }
  getOrderDetails(orderId){
    return this.http.get<any>(GlobalConstants.apiURL+"oneorderdetail/"+orderId); 
  }
  getOrderHistory(userId){
    return this.http.get<any>(GlobalConstants.apiURL+"orderhistory/"+userId);
  }
  cancelOrder(orderId){
    return this.http.put(GlobalConstants.apiURL+"cancelorder",{ id: orderId }); 
  }
}
