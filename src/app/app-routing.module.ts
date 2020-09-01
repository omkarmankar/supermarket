import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './Product/product/product.component';
import { ReviewcartComponent } from './reviewcart/reviewcart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent} from './payment/payment.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyaddressesComponent } from './myaddresses/myaddresses.component';
import { MyordersComponent } from './myorders/myorders.component';
import { OrderplacedComponent } from './orderplaced/orderplaced.component';

const routes: Routes = [ 
  { path:'index',component:IndexComponent},
  { path:'products/:id',component:ProductComponent},
  { path:'login',component:SigninComponent},
  { path:'register',component:SignupComponent},
  { path:'review',component:ReviewcartComponent},
  { path:'productDetail/:id',component:ProductDetailsComponent},
  { path:'checkout',component:CheckoutComponent},
  { path:'userdetails', loadChildren: () => import('./userprofile/userprofile.module').then(m => m.UserprofileModule) },
  { path:'payment',component:PaymentComponent},
  { path:'dashboard',component:DashboardComponent},
  { path:'myorders',component:MyordersComponent},
  { path:'myaddresses',component:MyaddressesComponent},
  { path:'orderplaced',component:OrderplacedComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { 

}
