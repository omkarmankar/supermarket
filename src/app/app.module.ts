import { BrowserModule, HAMMER_GESTURE_CONFIG ,HammerGestureConfig} from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserprofileModule} from './userprofile/userprofile.module';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { AlertModule,TypeaheadModule } from 'ngx-bootstrap';
import { NgxCarouselModule } from 'ngx-carousel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './Product/product/product.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CategorymenuComponent } from './categorymenu/categorymenu.component';
import {HttpClientModule} from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ReviewcartComponent } from './reviewcart/reviewcart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OfferscarouselComponent } from './offerscarousel/offerscarousel.component'; 
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import 'hammerjs';
import { CheckoutComponent } from './checkout/checkout.component';
import { RouterModule } from '@angular/router';
import { GeneratebillComponent } from './generatebill/generatebill.component';
import { PaymentComponent } from './payment/payment.component';
import { ToastNotificationsModule } from "ngx-toast-notifications";
import { IndexComponent } from './index/index.component';
import { OwlModule } from 'ngx-owl-carousel';  
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyordersComponent } from './myorders/myorders.component';
import { MyaddressesComponent } from './myaddresses/myaddresses.component';
import { OrderplacedComponent } from './orderplaced/orderplaced.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
    overrides = {
        pan: {
            direction: 6 // this code enables only horizontal direction
        },
        pinch: {
            enable: false
        },
        rotate: {
            enable: false
        }
    };
}


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    NavbarComponent,
    CategorymenuComponent,
    ReviewcartComponent,
    ProductDetailsComponent,
    OfferscarouselComponent,
    FooterComponent,
    CheckoutComponent,
    GeneratebillComponent,
    PaymentComponent,
    IndexComponent,
    SigninComponent,
    SignupComponent,
    DashboardComponent,
    MyordersComponent,
    MyaddressesComponent,
    OrderplacedComponent
  ],
  imports: [
    BrowserModule,
    AuthenticationModule,
    UserprofileModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    TypeaheadModule.forRoot(),
    BrowserAnimationsModule,
    NgxCarouselModule,
    NgxSpinnerModule,
    ToastNotificationsModule.forRoot({duration: 1000, type: 'primary'}),  
    OwlModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
    provide:HAMMER_GESTURE_CONFIG,
    useClass: CustomHammerConfig,
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
