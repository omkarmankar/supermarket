import { Component, OnInit, Input} from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { CartService} from '../services/cart.service';
import { UserprofileService} from '../services/userprofile.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AuthService } from 'angularx-social-login';
import { SupercategorymenuService } from '../services/supercategorymenu.service';
import { from } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userId = 0;
  itemsInCart = 0;
  grandTotal = 0;

  cart = [];
  productDetails = [];
  productImages = [];
  subCategories=[];
  superCategoryArray=[];

  error:string="";
  selectedValue: string;
  userName:string;
  currentUrl: string = "";
  loggedIn:boolean=false;
  superCategoryOpenFlag:boolean=false;
  showSuperCategoriesList:boolean=false;
  unitQuantityFlag: boolean = false;
  cartFlag:boolean=false;
  showCategoryFlag:boolean=false;
  selectedOption: any;
  products=JSON.parse(localStorage.getItem('cartProductDetails'));

  states: any[] = [
    { id: 1, name: 'Alabama', region: 'South' },
    { id: 2, name: 'Alaska', region: 'West' },
    { id: 3, name: 'Arizona', region: 'West' },
    { id: 4, name: 'Arkansas', region: 'South' },
  ];
  cartProductImages=[];

  constructor(private cartService:CartService,private sharedService: SharedService,private router: Router,private authService:AuthService,private superCategoryService:SupercategorymenuService) {
    // listen to events from Router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // event is an instance of NavigationEnd, get url!  
        this.currentUrl = event.urlAfterRedirects;
        console.log(this.currentUrl);
      }
    });
  } 

  ngOnInit() {
    const component = this;
    jQuery(document).ready(function($){
      $(document).on('click', '.pull-bs-canvas-right, .pull-bs-canvas-left', function(){
        $('body').prepend('<div class="bs-canvas-overlay bg-dark position-fixed w-100 h-100"></div>');
        if($(this).hasClass('pull-bs-canvas-right'))
          $('.bs-canvas-right').addClass('mr-0');
        else
          $('.bs-canvas-left').addClass('ml-0');
        return false;
      });
      
      $(document).on('click', '.bs-canvas-close, .bs-canvas-overlay', function(){
        var elm = $(this).hasClass('bs-canvas-close') ? $(this).closest('.bs-canvas') : $('.bs-canvas');
        elm.removeClass('mr-0 ml-0');
        $('.bs-canvas-overlay').remove();
        return false;
      });

      $(document).on('click','.cart-checkout-btn', function(){
        var elm =  $(this).closest('.bs-canvas');
        elm.removeClass('mr-0 ml-0');
        $('.bs-canvas-overlay').remove();
        component.hideCart();
        return false;
      });

    });

    this.getSuperCategories();

    this.sharedService.addToCartEventTrack.subscribe(event => {
      if(event){
        setTimeout(() =>{
          this.getCartDetails();
        },2000);
      }   
    });
    this.sharedService.checkOutEventTrack.subscribe(event => {
      if(event){
        setTimeout(() =>{
          this.getCartDetails();
        },2000);
      }   
    }); 
    this.sharedService.categoryIconEventTrack.subscribe(event => {
      if(event){
        this.showSuperCategoriesList=true;
        this.openNav();
        this.showSuperCategories();
        document.getElementById("SuperCategorySideNav").style.width = "100%";
      }   
    });  
    this.sharedService.cartIconEventTrack.subscribe(event => {
      if(event){
        this.closeNav();
        this.router.navigateByUrl('/review', {skipLocationChange: false}).then(() =>
        this.router.navigate(['/review']));
      }   
    });  
    this.sharedService.searchIconEventTrack.subscribe(event => {
      if(event){
        this.closeNav();
        $('#searchBar').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }   
    }); 
    this.sharedService.homeIconEventTrack.subscribe(event => {
      if(event){
        this.closeNav();
        this.router.navigateByUrl('/', {skipLocationChange: false}).then(() =>
        this.router.navigate(['/']));
      }   
    });   
   setTimeout(() =>{
      this.sharedService.loginFlag$.subscribe(loginFlag => {
          this.loggedIn=true;
          this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
          this.userName = JSON.parse(localStorage.getItem('currentUser')).name;
          this.getCartDetails();
      });
    },2000); 
  }

  getSuperCategories(){
    this.superCategoryService.getSuperCategories().subscribe(response => {
      this.superCategoryArray=[...response.data];
  },
    error => {
    this.error=error;
  });
  }
  
  getProductBySuperCategoryId(superCategoryId){
    $('body').removeClass('modal-open');
    $('#category_model').hide();
    $('.modal-backdrop').hide();
    this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
    this.router.navigate(['/products', superCategoryId]));
    //this.sharedService.superCategoryEventTrack.next(event); // event using service 
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
  }

  signup() {
    this.router.navigate(['/signup']);
  }
  login() {
    this.router.navigate(['/login']);
  }
  logout(){
    this.sharedService.logoutUser();
    this.loggedIn=false;
    this.userId=0;
    this.getCartDetails();
    this.router.navigateByUrl('/login', {skipLocationChange: false}).then(() =>
    this.router.navigate(['/login']));
    this.sharedService.logoutEventTrack.next(event); // event using service 
  }
  
  showUserDetails(){
    this.router.navigate(['/userdetails']);
  }
  getCartDetails() {
    this.cartService.getCartDetailsOfUser(this.userId).subscribe(response => {
      this.cart = [...response.data];
      this.productImages = JSON.parse(response.product);
      this.getRandomImage(this.productImages);
      this.itemsInCart = response.total_quantity;
      this.grandTotal = response.grandtotal;
      console.log(this.itemsInCart);
      console.log(this.cart);
      console.log(this.productDetails);
      console.log(this.productImages);
    },
      error => {
        console.log(error);
      });
  }
  getRandomImage(imageNames){
    this.cartProductImages=[];
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
  
  hideCart(){
    this.cartFlag=false;
    this.router.navigateByUrl('/checkout', { skipLocationChange: false }).then(() =>
    this.router.navigate(['/checkout']));
   /*  $('.bs-canvas,.bs-canvas-overlay').hide();
    $(".modal").css('display','none'); */
  }

  showCart() {
    this.cartFlag=true;
    if(this.cartFlag){
      $('.bs-canvas,.bs-canvas-overlay').show();
      $(".modal").css('display','block');
    }else{
      this.hideCart()
    }  
  }

 /*  viewCart() {
    $(".modal").css('display', 'none');
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() =>
    this.router.navigate(['/review']));
  } */
  showCategoryModel(){
    this.showCategoryFlag=true;
    if(this.showCategoryFlag){
      $('#category_model').show();
      $('#category_model').addClass('show');
    }else{
      this.showCategoryFlag=false;
     // $('#category_model').hide();
      $('#category_model').removeClass('show');
    }
  }
  closeModal() {
     $('.overlay').hide();
     $(".modal").css('display', 'none');
  }
  checkout(){
    this.closeModal();
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() =>
    this.router.navigate(['/checkout']));
  }

  deleteItemFromCart(itemId) {
    this.cartService.deleteItemFromCart(itemId).subscribe(response => {
      setTimeout(() =>{
        this.getCartDetails();
      },2000)
      if (response.statuscode == 200){
        this.sharedService.showToast("Item Deleted Successfully","success"); //show toast
        console.log(response.message);  
      }  
    },
    error => {
      console.log(error);
    });
  }

  showSuperCategories(){
    $('#mySidenav').hide();
    $('#SuperCategorySideNav').show();
    $('.overlay').show(); 
    this.superCategoryOpenFlag=true;
    document.getElementById("SuperCategorySideNav").style.width = "250px";
    this.getSuperCategories();
  }

 
  getSubCategories(superCategoryId){
    this.sharedService.getSubCategoriesBySuperCategoryId(superCategoryId).subscribe(response => {
      this.subCategories = [...response.data];
    },
      error => {
        console.log(error);
      });
  }
  getProductsBySubCategory(subCategoryId){
    this.closeNav();
    this.sharedService.subCategoryEventTrack.next(subCategoryId);
  }
  
  backToMainMenu(){
    $('#SuperCategorySideNav').hide();
    $('#mySidenav').show();
  }
  openNav() {
    $('.overlay').show();
    $('#mySidenav').show();
    document.getElementById("mySidenav").style.width = "250px";
  }
  closeNav() {
    this.closeModal();
    $('.overlay').hide();
    this.showSuperCategoriesList=false;
    $('#mySidenav,#SuperCategorySideNav').hide();
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("SuperCategorySideNav").style.width = "0";
  }
  showLoginPage(Type){
    this.closeNav();
    this.router.navigate(['/login']);
    if(Type == "Login"){
      this.sharedService.loginEventTrack.next(event); // event using service 
    }else{
      this.sharedService.signUpEventTrack.next(event); // event using service 
    } 
  }
  showMyProfile(){
    if(this.loggedIn)
      this.router.navigate(['/userdetails'])
    else
      this.router.navigate(['/login']);
    this.closeNav(); 
  }

  changeFlag(index,flag){
    this.unitQuantityFlag = true;
    let newItem={
      'flag':flag,
      'user_id': this.userId,
      'product_id':this.cart[index].product_id,
      'productdetails_id':this.cart[index].productdetails_id
    }
    this.cartService.addToCart(newItem).subscribe(data => {
      // console.log(data.message);
       //  setTimeout(() =>{
         this.getCartDetails();
       //   },1000);
      },
      error => {
        console.log(error);
      }); 
    //  this.sharedService.addToCartEventTrack.next(event);
  }

}
