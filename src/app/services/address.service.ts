import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants'

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http:HttpClient) { }

  saveAddress(addressObject){
    return this.http.post<any>(GlobalConstants.apiURL+"createaddress",addressObject);
  }

  getAddress(userId){
    return this.http.get<any>(GlobalConstants.apiURL+"getaddress/"+userId);
  }
  updateAddress(street,house,city,zipcode,state,type,addressId){
    return this.http.put(GlobalConstants.apiURL+"updateaddress",
    { street:street,
      house:house,
      city:city,
      zipcode:zipcode,
      state:state,
      type:type,
      id: addressId
     }); 
  }

  getAddressById(addressId){
    return this.http.get<any>(GlobalConstants.apiURL+"getaddressbyid/"+addressId);
  }
  deleteAddress(addressId){
    return this.http.get<any>(GlobalConstants.apiURL+"deleteaddress/"+addressId);
  }
}
