import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SharedService } from '../services/shared.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {
   //user related
   userId: number = 0;
   userName: string = "";
   userMobileNo: string = "";
   profilePic:string = "";
   profileImageUrl:any;
   public  trackingTypes= ["processing","delivered"];
   //public orderStatus = "processing"

   //flags 
   loggedIn:boolean=false;
  myOrders=[];
  constructor(private router:Router,private orderService: OrderService,private sharedService: SharedService) { }

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
    this.showMyOrders();
  }
  //function which shows user orders
  showMyOrders() {
    this.myOrders = [];
    $("#loader").css('visibility', 'visible');
    $("body").css('visibility', 'hidden');
    this.orderService.myOrders(this.userId).subscribe(response => {
      $("body").css('visibility', 'visible');
      $("#loader").css('visibility', 'hidden');
      (Array.isArray(response.data)) ? this.myOrders = [...response.data] : this.myOrders = [];
    });
    console.log(this.myOrders);
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
