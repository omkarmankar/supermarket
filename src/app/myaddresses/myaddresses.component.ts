import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SharedService } from '../services/shared.service';
import { AddressService } from '../services/address.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-myaddresses',
  templateUrl: './myaddresses.component.html',
  styleUrls: ['./myaddresses.component.css']
})
export class MyaddressesComponent implements OnInit {
    //user related
    userId: number = 0;
    userName: string = "";
    userMobileNo: string = "";
    profilePic:string = "";
    profileImageUrl:any;

    //flags 
    loggedIn:boolean=false;
    submitted:boolean=false;

    //address
    addressId: number;
    addressArray = [];
    address_err: any;
    addFrom: FormGroup;
    updateForm:FormGroup;
    addressSubmitted: boolean = false;

    Address = {
      'street': '',
      'house': '',
      'city': '',
      'zipcode': '',
      'state': '',
      'type': '',
      'user_id': 0,
    };
  constructor(private formBuilder: FormBuilder,private router:Router,private addressService: AddressService, private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.loginFlag$.subscribe(loginFlag => {
        this.loggedIn=true;
        this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
        this.userName = JSON.parse(localStorage.getItem('currentUser')).name;
        this.userMobileNo = JSON.parse(localStorage.getItem('currentUser')).phone;
        if(JSON.parse(localStorage.getItem('currentUser')).photoUrl == null)
          this.profilePic = "../../assets/images/vimbar.jpg";
        else
        this.profilePic = JSON.parse(localStorage.getItem('currentUser')).photoUrl;
        //this.getCartDetails();
    });
    this.getAddress();

    this.addFrom = this.formBuilder.group({
      house: ['', Validators.required],
      street: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['home', Validators.required]
    });
    this.updateForm = this.formBuilder.group({
      house: ['', Validators.required],
      street: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['home', Validators.required]
    });
  }

  get addAddressForm() {
    return this.addFrom.controls;
  }

  get updateAddressForm() {
    return this.updateForm.controls;
  }

  
//function which saves user address to database
addAddress() {
  this.addressSubmitted=true;
    if (this.addFrom.invalid) {
      console.log(this.addFrom)
      return;
    }
    else {
      this.Address.user_id = this.userId,
        this.Address.house = this.addFrom.get('house').value,
        this.Address.street = this.addFrom.get('street').value,
        this.Address.zipcode = this.addFrom.get('pincode').value,
        this.Address.city = this.addFrom.get('city').value,
        this.Address.state = this.addFrom.get('state').value,
        this.Address.type = this.addFrom.get('type').value,

        this.addressService.saveAddress(this.Address).subscribe(data => {
          this.addFrom.reset();
          this.sharedService.showToast("Address Added Successfully","success"); //show toast
          this.addressSubmitted=false;
          this.submitted=true;
        },
          error => {
            this.address_err = error.message;
          }
        );
    }
}

   //function which show Edit Address Form
   showEditAddressForm(addressId) {
    $('#edit_address_model').show();
     $('#edit_address_model').addClass('show');
    this.addressId = addressId;
    this.addressService.getAddressById(addressId).subscribe(response => {
    //  if (Array.isArray(response.Address)) {
        this.Address = response.Address;
        console.log(this.Address);
        this.setAddressToForm();
    //  }
    },
      error => {
        console.log(error);
      });
  }

    //function which set address to form fields while edit
    setAddressToForm() {
      this.updateForm.setValue({
        house: "" + this.Address.house,
        street: "" + this.Address.street,
        city: "" + this.Address.city,
        pincode: "" + this.Address.zipcode,
        state: "" + this.Address.state,
        type: ""+this.Address.type
      });
    }

//function which updates user address to database
updateAddress(){
  this.addressSubmitted=true;
    if (this.updateForm.invalid) {
      console.log(this.updateForm)
      return;
    }else{
      this.addressService.updateAddress(
        this.updateForm.get('street').value,
        this.updateForm.get('house').value,
        this.updateForm.get('city').value,
        this.updateForm.get('pincode').value,
        this.updateForm.get('state').value,
        this.updateForm.get('type').value,
        this.addressId
      ).subscribe(response => {
        if (response['status_code'] == "201") {
          this.sharedService.showToast("Address Updated Successfully","success"); //show toast
          this.closeModal();
          this.submitted=true;
          this.addressSubmitted=false;
        }
      },
        error => {
          this.address_err = error.message;
        });
    }
}


  //function which gives addresses of particular user
  getAddress() {
    this.addressService.getAddress(this.userId).subscribe(response => {
      this.addressArray = response.Address;
    });
  }
  

  //function which delete's user particular address 
  deleteAddress(addressId){
    this.addressService.deleteAddress(addressId).subscribe(response =>{
      if(response.status_code == "200"){
        this.sharedService.showToast("Address Deleted","success"); //show toast
        this.getAddress();
      }
    });
  }


  closeModal() {
    $('.overlay').hide();
    $(".modal").css('display', 'none');
  }

  logout(){
    this.sharedService.logoutUser();
    this.loggedIn=false;
    this.userId=0;
   // this.getCartDetails();
    this.router.navigateByUrl('/login', {skipLocationChange: false}).then(() =>
    this.router.navigate(['/login']));
    this.sharedService.logoutEventTrack.next(event); // event using service 
  }

}
