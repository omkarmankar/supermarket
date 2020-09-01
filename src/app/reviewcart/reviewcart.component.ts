import { Component, OnInit } from '@angular/core';
import {SharedService} from '../services/shared.service';
import {CartService} from '../services/cart.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-reviewcart',
  templateUrl: './reviewcart.component.html',
  styleUrls: ['./reviewcart.component.css']
})
export class ReviewcartComponent implements OnInit {
  userId:number=0;
  grandTotal:number=0;
  cart=[];
  productDetails=[];
  productImages=[];
  cartProductImages=[];
  
  constructor(private cartService:CartService,private sharedService:SharedService,private router:Router) {
    this.getCartDetails();
  }

  ngOnInit() {   
  }

  getCartDetails(){
    this.userId=JSON.parse(localStorage.getItem('currentUser')).id;
    this.cartService.getCartDetailsOfUser(this.userId).subscribe(response => {
    this.cart=[...response.data];
    if(this.cart.length > 0){
      this.productImages=JSON.parse(response.product);
     this.grandTotal = response.grandtotal;
     console.log(this.grandTotal);
      this.getRandomImage(this.productImages);
      console.log(this.cart);
      console.log(this.productDetails);
     console.log(this.productImages);
    }  
  },
    error => {
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
}

increaseValue(index,id) {
  let inputElement: HTMLInputElement = document.getElementById("number"+id) as HTMLInputElement
  let inputValue =  parseInt(inputElement.value,10);
  inputValue = isNaN(inputValue) ? 0 : inputValue;
  inputValue < 1 ? inputValue = 1 : '';
  inputValue++;
  inputElement.value = inputValue.toString();
  document.getElementById("number"+id).innerHTML=inputElement.value;

  let newItem={
    'flag':1,
    'user_id': this.userId,
    'product_id':this.cart[index].product_id,
    'productdetails_id':this.cart[index].productdetails_id,
  }
  this.cartService.addToCart(newItem).subscribe(data => {
    console.log(data.message);
      setTimeout(() =>{
        this.getCartDetails();
      },1000);
    },
    error => {
      console.log(error);
    }); 
    this.sharedService.addToCartEventTrack.next(event);
};
decreaseValue(index,id) {
  //let zeroFlag=false;
  let inputElement: HTMLInputElement = document.getElementById("number"+id) as HTMLInputElement
  let inputValue =  parseInt(inputElement.value,10);
  inputValue = isNaN(inputValue) ? 0 : inputValue;
  inputValue--;
  inputValue < 1 ? inputValue = 1 : '';
  inputElement.value = inputValue.toString();
  document.getElementById("number"+id).innerHTML=inputElement.value;
    let newItem={
      'flag':2,
      'user_id': this.userId,
      'product_id':this.cart[index].product_id,
      'productdetails_id':this.cart[index].productdetails_id,
    }
    this.cartService.addToCart(newItem).subscribe(data => {
      console.log(data.message);
      setTimeout(() =>{
        this.getCartDetails();
      },1000);
      },
      error => {
        console.log(error);
      });
      this.sharedService.addToCartEventTrack.next(event);
}  

deleteItemFromCart(itemId){
  this.cartService.deleteItemFromCart(itemId).subscribe(response => {
    if(response.statuscode==200)
      console.log(response.message);
     setTimeout(() =>{
        this.ngOnInit();
     }); 
  },
  error => {
  console.log(error);
});
}

checkout(){
  this.router.navigateByUrl('/', {skipLocationChange: false}).then(() =>
  this.router.navigate(['/checkout']));
}

}
