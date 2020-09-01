import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavigationEnd} from '@angular/router';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AuthService,GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public loginData;
  public signUpData;
  submitted:boolean=false;
  showLogin:boolean=true;
  login_errs:string="";
  signup_err:string = "";
  loginForm:FormGroup;
  signUpForm: FormGroup;
  currentUrl: string;
  
  //google login
  user: SocialUser;
  loggedIn: boolean; 

  
  constructor(private formbuilder: FormBuilder ,private router:Router,private loginService:LoginService,private signupService:SignupService,private sharedService:SharedService,private authService: AuthService) {
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

    this.signUpForm = this.formbuilder.group({
      name: ['', Validators.required],
      signupmobile: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      email: ['', [Validators.required,Validators.email]],
      signuppassword: ['', [Validators.required,Validators.maxLength(20), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required,Validators.maxLength(20), Validators.minLength(8)]],
      termsconditions:[false, Validators.requiredTrue]
    },{
      validator: this.passwordMatchValidator
  });

   this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);
      if(this.user){
        this.router.navigate(['/']);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.sharedService.setLoginFlag(true);
      } 
    }); 
    this.sharedService.logoutEventTrack.subscribe(event => {
      if(event){
          this.signOut();
      }   
    });
    this.sharedService.loginEventTrack.subscribe(event => {
      if(event)
        this.showLoginForm();     
    }); 
    this.sharedService.signUpEventTrack.subscribe(event => {
      if(event)
        this.showSignUpForm();
    });
  }
  showLoginForm(){
    this.showLogin=true;
  }
  showSignUpForm(){
    this.showLogin=false;
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

  get signUpControl() { 
    return this.signUpForm.controls; 
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
      this.loginService.login(obj).subscribe(data => {
        this.loginData= data.response;
        this.loginForm.reset();
        localStorage.setItem('currentUser', JSON.stringify(this.loginData));
        this.sharedService.setLoginFlag(true);
        this.router.navigate(['']);
        console.log(data.response);
        console.log(data.message);
    },
      error => {
      this.login_errs="Invalid Usedid or Password";
    } 
    );  
  }
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
      password:this.signUpForm.get('signuppassword').value,
      address:"pune"
    }
    this.signupService.register(obj).subscribe(data => {
        this.signUpData= data.response;
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

//function executes on google signIn button click
signInWithGoogle(): void {
  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);   
}
//function which logouts the google's login
signOut(): void {
  this.authService.signOut();
}

}

  