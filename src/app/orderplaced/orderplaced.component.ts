import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-orderplaced',
  templateUrl: './orderplaced.component.html',
  styleUrls: ['./orderplaced.component.css']
})
export class OrderplacedComponent implements OnInit {
  public orderDetails;
  userEmail:string="";
  constructor(private orderService:OrderService,private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.userEmail = JSON.parse(localStorage.getItem('currentUser')).email;
    this.orderService.getOrderDetails(this.orderService.currentOrderId).subscribe(data => {
    //  alert(JSON.stringify(data));
      this.spinnerService.hide();
      this.orderDetails=data;
    },
    error =>{
      console.log(error);
    });
  }
}
