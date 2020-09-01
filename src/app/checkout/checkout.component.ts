import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import {CartService} from '../services/cart.service';
import {OrderService} from '../services/order.service';
import {AddressService} from '../services/address.service';
import {CustomService} from '../services/custom.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ExternalLibraryService } from '../../utils';
declare let Razorpay: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userData={
    'user_id':0,
    'name':"",
    'house':'',
    'street':'',
    'zipcode':'',
    'city':'',
    'state':'',
    'type':''
  };
  cart=[];
  productDetails=[];
  productImages=[];
  cartProductImages=[];
  addressArray=[];

  userId:number=2;
  itemsInCart:number=0;
  grandTotal:number=0;

  showAddressCards:boolean=false;
  showAddressForm:boolean=false;
  showDeliveryFrom:boolean=false;

  checkoutDisabled:boolean=true;
  submitted:boolean=false;
  loggedIn:boolean=false;
  
  address_err:any;
  deliveryAddressForm:FormGroup;

  paymentType:string="Cash";


  /* Razorpay */
  transactionId:string="";
  response;
  razorpayResponse;
  showModal = false;
  RAZORPAY_OPTIONS = {
    "key": "rzp_test_nvyxvbxQg5ZIGZ",
    "amount": "",
    "name": 'Omkar Mankar',
    "order_id": "",
    "description": "Load Wallet",
    "prefill": {
      "name": "",
      "email": "test@test.com",
      "contact": "",
      "method": ""
    },
    "modal": {},
    "theme": {
      "color": "#0096C5"
    }
  };

  constructor(private formbuilder: FormBuilder ,private router:Router,private cartService:CartService,private orderService:OrderService,private sharedService:SharedService,private addressService:AddressService,private customService:CustomService, private spinnerService: Ng4LoadingSpinnerService,private razorpayService: ExternalLibraryService, private cd:  ChangeDetectorRef) { }

  ngOnInit() {
    this.customService.load();
    this.userId=4;
    $("#headingFour").css('pointer-events','none');
  
 /*     this.sharedService.loginFlag$.subscribe(loginFlag => {
      if (loginFlag){
        this.loggedIn=true;
        this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
      }else{
        this.userId=0;
        this.router.navigateByUrl('/login', {skipLocationChange: false}).then(() =>
        this.router.navigate(['/login']));
      }
    });  */
    
    this.getAddress();
    this.getCartDetails();
    this.deliveryAddressForm = this.formbuilder.group({
      name: ['', Validators.required],
      house: ['', Validators.required],
      street: ['', Validators.required],
      pincode: ['',  [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      mobile2: ['', [Validators.maxLength(15), Validators.minLength(8)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type:['home', Validators.required]
    });

    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();
  }

  getAddress(){
    this.addressService.getAddress(this.userId).subscribe(response =>{
      if(response.status_code != 200){
        this.showAddressForm=true;
      }else{
        this.showAddressCards=true;
        this.addressArray=response.Address;
      }
        
    });
  }
  orderHere(index){
    this.addressService.getAddress(this.userId).subscribe(response =>{
      this.addressArray=response.Address;
      this.userData=this.addressArray[index];
    }); 
  }

  testnumber(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  get f() { return this.deliveryAddressForm.controls; }

  
 continue(){
    $("#headingFour").css('pointer-events','auto');
    this.submitted = true;
    // stop here if form is invalid
    if (this.deliveryAddressForm.invalid) {
      console.log(this.deliveryAddressForm)
      return;
    } 
    else{    
      this.userData.user_id=this.userId,
      this.userData.name=this.deliveryAddressForm.get('name').value,
      this.userData.house=this.deliveryAddressForm.get('house').value,
      this.userData.street=this.deliveryAddressForm.get('street').value,
      this.userData.zipcode=this.deliveryAddressForm.get('pincode').value,
      this.userData.city=this.deliveryAddressForm.get('city').value,
      this.userData.state=this.deliveryAddressForm.get('state').value,
      this.userData.type=this.deliveryAddressForm.get('type').value,
     this.addressService.saveAddress(this.userData).subscribe(data => {
        console.log(data);
        this.showAddressForm=false;
        this.showDeliveryFrom=true;   
      },
        error => {
          this.address_err=error.message;
      } 
      ); 
    }
  }

  getCartDetails() {
    this.spinnerService.show();
    this.cartService.getCartDetailsOfUser(this.userId).subscribe(response => {
      this.cart = [...response.data];
      this.spinnerService.hide();
      if(this.cart.length > 0){
        this.productImages = JSON.parse(response.product);
        this.itemsInCart = response.total_quantity;
        this.grandTotal = response.grandtotal;
        this.RAZORPAY_OPTIONS.amount = this.grandTotal + '00';
        this.getRandomImage(this.productImages);
        console.log(JSON.stringify(this.cart));
      } 
    },
      error => {
        console.log(error);
      });
  }

  deleteItemFromCart(itemId) {
    this.cartService.deleteItemFromCart(itemId).subscribe(response => {
      setTimeout(() =>{
        this.getCartDetails();
      },2000)
      if (response.statuscode == 200){
        console.log(response.message);  
      }  
    },
    error => {
      console.log(error);
    });
  }

  checkout(){
    let order={
      'trans_id':this.transactionId,
      'userid':this.userId,
      'mobile2':this.deliveryAddressForm.get('mobile2').value,
      'cart':this.cart,
      'userdetails':this.userData,
      'total_products':this.cart.length,  
      'total_quantity':this.itemsInCart,
      'grandtotal':this.grandTotal,
      'payment_mode':this.paymentType
    }
    console.log(order);
    this.orderService.newOrder(JSON.stringify(order)).subscribe(response => {
     // alert(JSON.stringify(response));
      this.orderService.currentOrderId=response.data;
      console.log(this.orderService.currentOrderId);
      this.sharedService.checkOutEventTrack.next(event);
      this.getCartDetails();
      this.router.navigateByUrl('/orderplaced', { skipLocationChange: false }).then(() =>
      this.router.navigate(['/orderplaced']));
    },
    error =>{
      console.log(error);
    }); 
  }

  getRandomImage(imageNames){
    imageNames.forEach(element => {
      let productImagesArray=element[0].product_images.split('/');
      let randomImage=Math.floor(Math.random()*productImagesArray.length);
      while(productImagesArray[randomImage]==""){
        randomImage=Math.floor(Math.random()*productImagesArray.length);
      }
      this.cartProductImages.push(productImagesArray[randomImage]);
    });
    console.log(this.cartProductImages);  
  } 

  
  public proceed() {
    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

  // this.showPopup();

    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
    razorpay.open();
  }

  public razorPaySuccessHandler(response) {
    this.paymentType="Online"
    this.transactionId=response.razorpay_payment_id;
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges()
    this.checkout();
    //document.getElementById('razorpay-response').style.display = 'block';
  }
  
}

