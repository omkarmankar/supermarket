import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavigationEnd} from '@angular/router';
import {Router} from '@angular/router';
import { SharedService } from '../services/shared.service';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signUpData;
  submitted:boolean=false;
  signup_err:string = "";
 
  signUpForm: FormGroup;
  currentUrl: string;

  constructor(private formbuilder: FormBuilder ,private router:Router,private signupService:SignupService,private sharedService:SharedService) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        // event is an instance of NavigationEnd, get url!  
         this.currentUrl = event.urlAfterRedirects;
        console.log(this.currentUrl);
      }
    });
   }
 
   ngOnInit() {
    this.signUpForm = this.formbuilder.group({
      name: ['', Validators.required],
      signupmobile: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      email: ['', [Validators.required,Validators.email]],
      signuppassword: ['', [Validators.required,Validators.maxLength(20), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required,Validators.maxLength(20), Validators.minLength(8)]],
  },{
      validator: this.passwordMatchValidator
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


  get signUpControl() { 
    return this.signUpForm.controls; 
  }

 //function executes on signup button click
signUp(){
  this.submitted = true;
  // stop here if form is invalid
  if (this.signUpForm.invalid) 
    return;
  else{
    let obj={
      name:this.signUpForm.get('name').value,
      email:this.signUpForm.get('email').value,
      mobile:this.signUpForm.get('signupmobile').value,
      password:this.signUpForm.get('signuppassword').value
    }
    this.signupService.register(obj).subscribe(data => {
        this.signUpData= data.response;
        this.signUpForm.reset();
        this.router.navigate(['']);
        console.log(data.response); 
        console.log(data.message);
    },
      error => {
        this.signup_err=error.message;
    } 
    );  
  }
}


}
