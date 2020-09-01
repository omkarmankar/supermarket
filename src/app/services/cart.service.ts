import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { 
  }
  addToCart(item){ 
    return this.http.post<any>(GlobalConstants.apiURL+"addtocart",item);
  };

  deleteItemFromCart(itemId){
    return this.http.get<any>(GlobalConstants.apiURL+"deletecartitem/"+itemId);
  }

  getCartDetailsOfUser(userId){
    return this.http.get<any>(GlobalConstants.apiURL+"getcart/"+userId);
  }
}
