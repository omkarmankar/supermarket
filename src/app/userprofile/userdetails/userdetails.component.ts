import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CartService } from '../../services/cart.service'
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import {UserprofileService} from '../userprofile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {GlobalConstants} from '../../common/global-constants'


@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  // orders related variables
  orderHeader: string = "";
  cart = [];
  myOrders = [];
  productDetails = [];
  orderdetails = [];
  itemsInCart = [];
  productImages = [];
  cartProductImages = [];
  grandTotal: number = 0;


  //user related
  userId: number = 0;
  userName: string = "";
  profilePic:string = "";
  profileImageUrl:any;

  //form related variables
  editForm: FormGroup;
  submitted = false;
  edit_err: any = "";


  //manage addressses 
  addressHeader: string = "+ Add Address";
  addressId: number;
  addressArray = [];
  address_err: any;
  deliveryAddressForm1: FormGroup;
  deliveryAddressForm2: FormGroup;
  addressSubmitted: boolean = false;
  showAddressForm: boolean = false;
  showEditAddressFormFlag:boolean = false;
  Address = {
    'street': '',
    'house': '',
    'city': '',
    'zipcode': '',
    'state': '',
    'type': '',
    'user_id': 0,
  };
  profileDetails = {
    'name':'',
    "email":'',
    'phone':''
  };

  //flags
  showOrdersFlag: boolean = false;
  showEditDetailsFormFlag: boolean = true;
  showManageAddressesFlag: boolean = false;
  showAddressCard: boolean = true;
  showCancelOrderBtn: boolean = false;
  loggedIn:boolean=false;


  visibleIndex = -1;
  constructor(private formBuilder: FormBuilder, private cartService: CartService, private orderService: OrderService, private addressService: AddressService, private sharedService: SharedService,private userProfileService:UserprofileService) { }

  ngOnInit() {
    this.sharedService.loginFlag$.subscribe(loginFlag => {
      if (loginFlag){
        this.loggedIn=true;
        this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
        this.userName = JSON.parse(localStorage.getItem('currentUser')).name;
        if(JSON.parse(localStorage.getItem('currentUser')).photoUrl == null)
          this.profilePic = "../../assets/images/vimbar.jpg";
        else
        this.profilePic = JSON.parse(localStorage.getItem('currentUser')).photoUrl;

        this.getCartDetails();
      }else{
        this.userId=0;
      }
    });
    this.getAddress();
    this.getCartDetails();
    this.setUserProfileToForm();
    

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.deliveryAddressForm1 = this.formBuilder.group({
      house: ['', Validators.required],
      street: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['home', Validators.required]
    });
    this.deliveryAddressForm2 = this.formBuilder.group({
      house: ['', Validators.required],
      street: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['home', Validators.required]
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

  get f() {
    return this.editForm.controls;
  }
  get addAddressForm() {
    return this.deliveryAddressForm1.controls;
  }
  get editAddressForm() {
    return this.deliveryAddressForm2.controls;
  }


  setUserProfileToForm() {
    this.userProfileService.getProfile(this.userId).subscribe(response =>{
      this.profileDetails = response.data;
      this.profilePic=GlobalConstants.profileImageURL+this.profileDetails[0].photo;// profile Image
      this.editForm.setValue({
        name: ""+this.profileDetails[0].name,
        mobile:""+this.profileDetails[0].phone,
        email: ""+this.profileDetails[0].email
      });
    }); 
  }
  //function which uploads profile picture 
  uploadImage(event) {
    let file:any;
    file=event.target.files[0]; //image file
    let formData = new FormData();  //sending data as formdata
    formData.append('profile_image', file);
    formData.append('id',""+this.userId);
    this.userProfileService.updateImage(formData).subscribe(response =>{
      this.setUserProfileToForm();
    });  
  }

  //function which updates the profile information
    updateProfile(){
    this.submitted=true;
    if (this.editForm.invalid) {
      console.log(this.editForm)
      return;
    }else{
      this.userProfileService.updateProfile(
        this.userId,
        this.editForm.get('name').value,
        this.editForm.get('email').value,
        this.editForm.get('mobile').value,
      ).subscribe(response => {
        this.editForm.reset();
      },
        error => {
          console.log(error.message);
        });
    }
  }

  //function which gives addresses of particular user
  getAddress() {
    this.addressService.getAddress(this.userId).subscribe(response => {
      this.addressArray = response.Address;
    });
  }
  //function which shows addresses
  showAddAddress(){
    this.showAddressForm = true;
    this.showEditAddressFormFlag=false;
    this.showAddressCard = true;
  }
   //function which show Edit Address Form
  showEditAddressForm(addressId) {
    this.addressId = addressId;
    this.addressHeader = "Edit Address";
    this.showAddressForm=false;
    this.showEditAddressFormFlag=true;

   // this.showAddressCard = false;
    this.addressService.getAddressById(addressId).subscribe(response => {
      if (Array.isArray(response.Address)) {
        this.Address = response.Address;
        this.setAddressToForm();
      }
    },
      error => {
        console.log(error);
      });
  }
  //function which set address to form fields while edit
  setAddressToForm() {
    this.deliveryAddressForm2.setValue({
      house: "" + this.Address[0].house,
      street: "" + this.Address[0].street,
      city: "" + this.Address[0].city,
      pincode: "" + this.Address[0].zipcode,
      state: "" + this.Address[0].state,
      type: ""+this.Address[0].type
    });
  }

//function which saves user address to database
  addAddress() {
    this.addressSubmitted=true;
      if (this.deliveryAddressForm1.invalid) {
        console.log(this.deliveryAddressForm1)
        return;
      }
      else {
        this.Address.user_id = this.userId,
          this.Address.house = this.deliveryAddressForm1.get('house').value,
          this.Address.street = this.deliveryAddressForm1.get('street').value,
          this.Address.zipcode = this.deliveryAddressForm1.get('pincode').value,
          this.Address.city = this.deliveryAddressForm1.get('city').value,
          this.Address.state = this.deliveryAddressForm1.get('state').value,
          this.Address.type = this.deliveryAddressForm1.get('type').value,

          this.addressService.saveAddress(this.Address).subscribe(data => {
            this.addressHeader = "+ Add Address"
            this.showAddressCard = true;
            this.addressSubmitted=false;
            this.showAddressForm=false;
          },
            error => {
              this.address_err = error.message;
            }
          );
      }
  }

 //function which updates user address to database
  updateAddress(){
    this.addressSubmitted=true;
      if (this.deliveryAddressForm2.invalid) {
        console.log(this.deliveryAddressForm2)
        return;
      }else{
        this.addressService.updateAddress(
          this.deliveryAddressForm2.get('street').value,
          this.deliveryAddressForm2.get('house').value,
          this.deliveryAddressForm2.get('city').value,
          this.deliveryAddressForm2.get('pincode').value,
          this.deliveryAddressForm2.get('state').value,
          this.deliveryAddressForm2.get('type').value,
          this.addressId
        ).subscribe(response => {
          if (response['status_code'] == "201") {
            this.addressHeader = "+ Add Address"
            this.showEditAddressFormFlag=false;
            this.showAddressCard = true;
            this.addressSubmitted=false;
          }
        },
          error => {
            this.address_err = error.message;
          });
      }
  }

  //function which delete's user particular address 
  deleteAddress(addressId){
    this.addressService.deleteAddress(addressId).subscribe(response =>{
      if(response.status_code == "200"){
        this.getAddress();
      }
    });
  }
  
  //function which gets user cart details
  getCartDetails() {
    this.cartService.getCartDetailsOfUser(this.userId).subscribe(response => {
      this.cart = [...response.data];
      //    this.productDetails = JSON.parse(response['productdetail']);
      this.productImages = JSON.parse(response.product);
      this.itemsInCart = response.totalquantity;
      this.grandTotal = response.grandtotal;
      this.getRandomImage(this.productImages);
      console.log(this.cart);
    },
      error => {
        console.log(error);
      });
  }

  //function for taking random images
  getRandomImage(imageNames) {
    imageNames.forEach(element => {
      let productImagesArray = element[0].product_images.split('/');
      let randomImage = Math.floor(Math.random() * productImagesArray.length);
      while (productImagesArray[randomImage] == "") {
        randomImage = Math.floor(Math.random() * productImagesArray.length);
      }
      this.cartProductImages.push(productImagesArray[randomImage]);
    });
    console.log(this.cartProductImages);
  }

  //function which shows user orders
  showMyOrders() {
    this.visibleIndex = -1;
    this.orderHeader = "My Orders";
    this.showOrders();
    this.myOrders = [];
    this.showCancelOrderBtn = true;
    this.orderService.myOrders(this.userId).subscribe(response => {
      (Array.isArray(response.data)) ? this.myOrders = [...response.data] : this.myOrders = [];
    });
  }

  //function which shows user order history
  showOrderHistory() {
    this.visibleIndex = -1;
    this.orderHeader = "Order History";
    this.showOrders();
    this.myOrders = [];
    this.showCancelOrderBtn = false;
    this.orderService.getOrderHistory(this.userId).subscribe(response => {
      (Array.isArray(response.data)) ? this.myOrders = [...response.data] : this.myOrders = [];
    },
      error => {
        console.log(error);
      });
  }

  showOrders() {
    this.showOrdersFlag = true;
    this.showEditDetailsFormFlag = this.showManageAddressesFlag = false;
    return;
  }

  cancelOrder(orderId) {
    this.orderService.cancelOrder(orderId).subscribe(response => {
      if (response['status_code'] == "200")
        this.showMyOrders();
    },
      error => {
        console.log(error);
      });
  }

  //function which shows personal info of user
  showPersonalInfo() {
    this.showEditDetailsFormFlag = true;
    this.showOrdersFlag = this.showManageAddressesFlag = false;
  }

  //function which shows manage addresses part
  manageAddresses() {
    this.showManageAddressesFlag = true;
    this.showOrdersFlag = this.showEditDetailsFormFlag = false;
  }

  //function which shows order details
  viewOrderDetails(index, orderId) {
    if (this.visibleIndex === index) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = index;
      this.orderService.getOrderDetails(orderId).subscribe(response => {
        this.orderdetails = [...response.orderdetail]
      },
        error => {
          console.log(error);
        });
    }
  }

  //function executes on back btn click
  goBack(index) {
    if (this.visibleIndex === index) {
      this.visibleIndex = -1;
    }
  }
}


  
