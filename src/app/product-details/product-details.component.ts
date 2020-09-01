import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from "../services/shared.service";
import {CartService} from '../services/cart.service';
import {CustomService} from '../services/custom.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  userId:number = 0;
  productId: number;
  selectedQuantity: number = 1;
  productPrice: number;

  products: Array<any> = [];
  productImages = [];

  productDetails: object;

  selectedUnit: string;
  productImage:string

  unitChangeFlag:boolean= false;
  QuantityFlag:boolean = false;
  showflag: boolean=false;
  loggedIn:boolean=false;
  
  cart = [];
  cartProductImages = [];
  product;
  
  

  constructor(private cartService:CartService,private sharedService: SharedService, private route: ActivatedRoute,private customService:CustomService) {
   
  }
  ngOnInit() { 
  
    this.sharedService.loginFlag$.subscribe(loginFlag => {
      if (loginFlag){
        this.loggedIn=true;
        this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
      }else{
        this.userId=0;
      }
    });
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.productId);
    this.getProductDetails(); 
    this.customService.load();
  }

  getProductDetails() {
    this.sharedService.getProductDetails(this.productId).subscribe(response => {
      this.showflag=true;
      this.productDetails = [...response.data];
      this.product=this.productDetails[0];
      this.productImages = this.productDetails[0]['product_images'];
      console.log(this.productImages);
      this.getRandomImage(this.productImages);
    });
  }

  getRandomImage(productImages) {
    let productImagesArray = productImages.split('/');
    productImagesArray.forEach(element => {
      if (element != "")
        this.cartProductImages.push(element);
    });
    this.productImage=this.cartProductImages[0];
    console.log(this.cartProductImages);
  }

  onUnitChange($event) {
    this.unitChangeFlag = true;
    this.selectedUnit = $event.target.options[$event.target.options.selectedIndex].text;
    let price = $event.target.value;
    console.log(price);
    $("#priceText").text(price);
  };

  changeFlag(){
    this.QuantityFlag = true;
  }

  increaseValue() {
    this.QuantityFlag = true;
    let inputElement: HTMLInputElement = document.getElementById("number") as HTMLInputElement
    let inputValue = parseInt(inputElement.value, 10);
    inputValue = isNaN(inputValue) ? 0 : inputValue;
    inputValue < 1 ? inputValue = 1 : '';
    inputValue++;
    inputElement.value = inputValue.toString();
    document.getElementById("number").innerHTML = inputElement.value;
  };

  decreaseValue() {
    this.QuantityFlag = true;
    let inputElement: HTMLInputElement = document.getElementById("number") as HTMLInputElement
    let inputValue = parseInt(inputElement.value, 10);
    inputValue = isNaN(inputValue) ? 0 : inputValue;
    inputValue--;
    inputValue < 1 ? inputValue = 1 : '';
    inputElement.value = inputValue.toString();
    document.getElementById("number").innerHTML = inputElement.value;
  };

  addToCart() { 
    this.selectedQuantity = Number($("#number").prop('value')) == 0 ? 1 : $("#number").prop('value');
    this.productPrice = Number($("#priceText").text());

    if (!this.unitChangeFlag)
      this.selectedUnit = $("#selectQuantity")[0]['options'][0].text;
 
    let productdetail_id = parseInt($("#selectQuantity")[0]['options'][0].id);

    let newItem = {
      'user_id': this.userId,
      'product_id': this.productId,
      'productdetails_id': productdetail_id,
      'price': this.productPrice,
      'quantity': this.selectedQuantity
    };

    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }

    this.cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(this.cart));

    console.log(this.cart);
    // this.getTotalItemsInCart();
    console.log(newItem);
    if(this.userId !== 0){
      this.cartService.addToCart(newItem).subscribe(data => {
        console.log(data.message);
      },
        error => {
          console.log(error);
        });
    }
    this.sharedService.showToast(this.product.product_name+" Added To Cart","success"); //show toast
    this.sharedService.addToCartEventTrack.next(event); // event using service 
  }

  showBigImage(src){
    this.productImage=src;
  }

}
