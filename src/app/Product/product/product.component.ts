import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SupercategorymenuService } from '../../services/supercategorymenu.service';
import { SharedService } from "../../services/shared.service";
import { CartService } from '../../services/cart.service';
import {GlobalConstants} from '../../common/global-constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productName: string = "";
  selectedUnit: string ="";
  public price: string = "";
  currentSuperCategory:string = "";
  imageUrl:string=GlobalConstants.thumbnailImageURL;

  userId: number = 0;
  productPrice: number = 0;
  productIndex: number = 0;
  selectedQuantity: number = 1;

  loggedIn: boolean = false
  unitChangeFlag: boolean = false;
  unitQuantityFlag: boolean = false;
  addToCartFlag: boolean = false;
  addSubAction: boolean;


  public cart = [];
  categoryProducts = [];
  superCategoryProductDetails;
  productsArray = [];


  public subCategories = [];
  public Categories = [];
  public products = [];


  constructor(private cartService: CartService, private sharedService: SharedService, private router: Router,private route: ActivatedRoute, private superCategoryService: SupercategorymenuService, private spinnerService: Ng4LoadingSpinnerService) {

  }
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    let superCategoryId = (Number(this.route.snapshot.paramMap.get('id')));
    this.getCartDetails();
    this.showProductsBySuperCategory(superCategoryId); 

    this.sharedService.superCategoryEventTrack.subscribe(event => {
      if (event) {
        this.router.navigateByUrl('/products', { skipLocationChange: false }).then(() =>
        this.router.navigate(['/products']));
        setTimeout(() => {
            this.showProductsBySuperCategory(event);
        }, 2000);
      }
    });

    this.sharedService.subCategoryEventTrack.subscribe(event => {
      if (event) {
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
            this.router.navigate(['/']));
           this.showProductsBySubCategory(event);
        }, 2000);
      }
    });

   /*  this.sharedService.loginFlag$.subscribe(loginFlag => {
      if (loginFlag) {
        this.loggedIn = true;
        this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
      } else {
        this.userId = 0;
      }
    }); */
  }
/* 
  expand(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    $("#"+idAttr).addClass('active');
    let content= event.currentTarget.nextElementSibling;
     if ($(content).css('display') == "block") {
      alert($(content).css('display'));
      $(content).hide();
    } else {
      alert($(content).css('display'));
      $(content).show();
    } 
  } */

  //function which get categoris of sub category
  getCategories(id) {
    this.sharedService.getCategoriesBySubCategoryId(id).subscribe(response => {
      this.Categories = [...response.data];
      this.showProductsBySubCategory(id);
      console.log(this.Categories);
    },
      error => {
        console.log(error);
      });
  }
  
  // function for showing products on category click of list
  showCategoryProducts(categoryId) {
    this.showProductsByCategory(categoryId);
  }

  //function which gets cart details
  getCartDetails() {
    this.cartService.getCartDetailsOfUser(this.userId).subscribe(response => {
      this.cart = [...response.data];
      console.log(this.cart)
    },
      error => {
        console.log(error);
      });
  }
  // function for showing products of supercategory
  showProductsBySuperCategory(superCategoryId) {
    this.categoryProducts = [];
    this.productsArray = [];
    this.spinnerService.show();
    this.superCategoryService.getProductBySuperCategoryId(superCategoryId).subscribe(response => {
      this.currentSuperCategory=response.supercategoryname.sup_cat_name;
      this.showSubCategoriesInFilter(superCategoryId);
      this.getProductDetailsFromResponse(response);
      this.spinnerService.hide();
    },
    error => {
      console.log(error);
    });  
  }
  
  showSubCategoriesInFilter(superCategoryId) {
      this.sharedService.getSubCategoriesBySuperCategoryId(superCategoryId).subscribe(response => {
        this.subCategories = [...response.data];
        console.log(this.subCategories);
      },
        error => {
          console.log(error);
        });
    }

  // function for showing products of subcategory
  showProductsBySubCategory(subCategoryId) {
    this.categoryProducts = [];
    this.productsArray = [];
    this.sharedService.getProductsBySubCategoryId(subCategoryId).subscribe(response => {
      this.getProductDetailsFromResponse(response);
    },
      error => {
        console.log(error);
      });
  }

  // function for showing products of category
  showProductsByCategory(categoryId) {
    this.categoryProducts = [];
    this.productsArray = [];
    this.sharedService.getProductsByCategoryId(categoryId).subscribe(response => {
      this.getProductDetailsFromResponse(response);
    },
      error => {
        console.log(error);
      });
  }

  //getting data from api response of products
  getProductDetailsFromResponse(response){
    this.categoryProducts = [...response.data];
    if(this.categoryProducts.length > 0){
      this.currentSuperCategory=response.supercategoryname.sup_cat_name;
      this.superCategoryProductDetails = response.images;
      this.superCategoryProductDetails = JSON.parse(this.superCategoryProductDetails);
      this.structureApiResponse();
      console.log(this.productsArray);
     // this.sharedService.changeProductList(this.productsArray);
    }
  }

  // structure api response for product view card
  structureApiResponse() {
    let index = 0;
    this.categoryProducts.forEach(product => {
      let randomImage = this.getRandomImage(product.product_images);
      let node = {
        productId: product.id,
        productName: product.product_name,
        productDescription: product.description,
        productImages: product.product_images,
        productImage: randomImage,
        productSpecs: this.superCategoryProductDetails[index]
      };
      this.productsArray.push(node);
      index++;
    });
    console.log(this.productsArray);
  }
  //getting product images of product
  getRandomImage(imagesNames) {
    let imagesArray = imagesNames.split('/');
    let randomImage = Math.floor(Math.random() * imagesArray.length);
    while (imagesArray[randomImage] == "") {
      randomImage = Math.floor(Math.random() * imagesArray.length);
    }
    return imagesArray[randomImage];
  }
  //function excutes on addtocart click
  addToCart(index, id, event) {
    this.addToCartFlag = true;
    this.selectedQuantity = Number($("#number" + index).prop('value')) == 0 ? 1 : $("#number" + index).prop('value');
    this.productPrice = Number($("#price" + index).text());
    if (!this.unitChangeFlag)
      this.selectedUnit = $("#sel" + index)[0]['options'][0].text;

    this.productName = this.productsArray[index].productName;
    (this.unitChangeFlag) ? this.productIndex : 0;

    let newItem = {
      'user_id': this.userId,
      'product_id': id,
      'productdetails_id': this.productsArray[index].productSpecs[this.productIndex].id,
      'price': this.productPrice,
      'quantity': this.selectedQuantity
    };

    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }

    this.cart.push(newItem);
    localStorage.setItem('cartProductDetails',JSON.stringify(this.productsArray[index]));
    localStorage.setItem('cart', JSON.stringify(this.cart));

    console.log(this.cart);
    if(this.userId !== 0){
      this.cartService.addToCart(newItem).subscribe(response => {
        if (response['status_code'] == "200"){
          this.sharedService.showToast(this.productName+" Added To Cart","success"); //show toast
          this.sharedService.addToCartEventTrack.next(event); // event using service 
        }else{
         console.log('Something Went Wrong While Adding Item to Cart !!');
        }
      
      },
        error => {
          console.log(error);9  
        });
    }
  }

  //function executes on product's unit dropdown change
  onUnitChange($event,index) {
    this.unitChangeFlag = true;
    this.selectedUnit = $event.target.options[$event.target.options.selectedIndex].text;
    let valueArr = $event.target.value.split('-');
    this.productIndex =valueArr[1];
    $("#price" + index).text(valueArr[0]);
  };


  changeFlag(){
    this.unitQuantityFlag = true;
  }

//function which navigates to product detail view 
  showProductDetailView(productId) {
    console.log(productId);
    this.router.navigate(['/productDetail', productId]);
  }
}   
