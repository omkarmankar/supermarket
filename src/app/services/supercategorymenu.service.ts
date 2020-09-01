import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants'

@Injectable({
  providedIn: 'root'
})
export class SupercategorymenuService {
  constructor(private http:HttpClient) { }
  getSuperCategories(){
    return this.http.get<any>(GlobalConstants.apiURL+"getsupCategory");
  }
  getProductBySuperCategoryId(superCategoryId){
    return this.http.get<any>(GlobalConstants.apiURL+"getProductBySupercategory/"+superCategoryId);
  }
}
