import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Subject} from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants';
import {Toaster} from "ngx-toast-notifications";


@Injectable({
  providedIn: 'root'
})

export class SharedService {  
  // Subscribe data
  private superCategoryId = new BehaviorSubject(1);
  public superCategoryId$ = this.superCategoryId.asObservable();

  private subCategoryId = new BehaviorSubject(1);
  public subCategoryId$ = this.subCategoryId.asObservable();

  private categoryId = new BehaviorSubject(1);
  public categoryId$ = this.categoryId.asObservable();

  private loginFlag = new BehaviorSubject(false);
  public loginFlag$ = this.loginFlag.asObservable();

  public addToCartEventTrack = new Subject(); //Add To Cart Event 
  public checkOutEventTrack = new Subject(); // Checkout Event
  public superCategoryEventTrack = new Subject(); // Supercategory Event
  public logoutEventTrack = new Subject(); // Logout Event
  public homeIconEventTrack = new Subject(); //  Event On Home Icon Click Of Mobile Device
  public categoryIconEventTrack = new Subject(); // Event On Category Icon Click Of Mobile Device
  public cartIconEventTrack = new Subject(); // Event On Cart Icon Click Of Mobile Device
  public searchIconEventTrack = new Subject(); // Event On Search Icon Click Of Mobile Device
  public subCategoryEventTrack = new Subject(); // Event On SubCategory Click Of Super Category List on Mobile Device
  public loginEventTrack = new Subject(); // Event On Login Tab Click Of Mobile Device
  public signUpEventTrack = new Subject(); // Event On signUp Tab Click Of Mobile Device


  constructor(private http:HttpClient,private toaster: Toaster) { 
  }
  
  // here we change the login flag
  setLoginFlag(loginFlag) {
    this.loginFlag.next(loginFlag);
  }

  // here we set/change value of the observable
  setSuperCategoryId(superCategoryId) {
    this.superCategoryId.next(superCategoryId);
  }

  setSubCategoryId(subCategoryId) {
    this.superCategoryId.next(subCategoryId);
  }
  setCategoryId(subCategoryId) {
    this.superCategoryId.next(subCategoryId);
  }
/*   
  changeProductList(productsArray) {
    this.Products.next(productsArray);
  } 
 */
  logoutUser(){
    localStorage.removeItem('cart');
    localStorage.removeItem('currentUser');
  }

  getSubCategoriesBySuperCategoryId(superCategoryId){
    return this.http.get<any>(GlobalConstants.apiURL+"getCategoryId/"+superCategoryId);
  }

  getCategoriesBySubCategoryId(subCategoryId){
    return this.http.get<any>(GlobalConstants.apiURL+"getBrandId/"+subCategoryId);
  }

  getProductsBySubCategoryId(subCategoryId){
    return this.http.get<any>(GlobalConstants.apiURL+"getProductByCategory/"+subCategoryId);
  }

  getProductsByCategoryId(categoryId){
    return this.http.get<any>(GlobalConstants.apiURL+"getProductByBrand/"+categoryId);
  }

  getProductDetails(productId){
    return this.http.get<any>(GlobalConstants.apiURL+"getoneproduct/"+productId);
  } 
  getSliderImages(){
    return this.http.get<any>(GlobalConstants.apiURL+"getslider");
  }

  showToast(message,type) {
    this.toaster.open({
      text: message,
      caption:type+' notification',
      type: type
    });
  }
} 