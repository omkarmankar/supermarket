import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavigationEnd} from '@angular/router';
import {SigninService} from '../services/signin.service';
import {Router} from '@angular/router';
import { SharedService } from '../services/shared.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public loginData;
  submitted:boolean=false;
  login_errs:string="";
  loginForm:FormGroup;
  currentUrl: string;
  loggedIn: boolean; 

   
  constructor(private formbuilder: FormBuilder ,private router:Router,private signInService:SigninService,private sharedService:SharedService, private spinnerService: Ng4LoadingSpinnerService) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        // event is an instance of NavigationEnd, get url!  
         this.currentUrl = event.urlAfterRedirects;
        console.log(this.currentUrl);
      }
    });
   }

  ngOnInit() {
    this.loginForm = this.formbuilder.group({
      mobile: ['9028998580', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      password: ['9028998580', Validators.required]
    });
    this.sharedService.logoutEventTrack.subscribe(event => {
      /* if(event){
          this.signOut();
      } */   
    });
  }

  //function which checks weather password and confirm password matches or not
  passwordMatchValidator(frm: FormGroup) {
    return frm.get('signuppassword').value === frm.get('confirmpassword').value ? null : {'mismatch': true};
  }

  //function triggers on key event of mobile field or other restricts user enters characters instead of number
  testnumber(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  //function gets the event occurs on form field like errors 
  get loginControl(){
    return this.loginForm.controls;
  }

  //function executes on login button click
  login(){
    this.submitted=true;
    if(this.loginForm.invalid)
      return;
    else{
      let obj={
        mobile:this.loginForm.get('mobile').value,
        password:this.loginForm.get('password').value
      } 
      this.spinnerService.show();
      this.signInService.login(obj).subscribe(data => {
        this.spinnerService.hide()
        this.loginData= data.response;
        this.loginForm.reset();
        localStorage.setItem('currentUser', JSON.stringify(this.loginData));
        this.sharedService.setLoginFlag(true);
        this.router.navigate(['']);
        console.log(data.response);
        console.log(data.cart_total);
        console.log(data.message);
    },
      error => {
      this.login_errs="Invalid Usedid or Password";
    } 
    );  
  }
}


//function which logouts the google's login
/* signOut(): void {
  this.authService.signOut();
} */

}
