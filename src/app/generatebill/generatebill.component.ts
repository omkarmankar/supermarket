import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf'
import {OrderService} from '../services/order.service';

@Component({
  selector: 'app-generatebill',
  templateUrl: './generatebill.component.html',
  styleUrls: ['./generatebill.component.css']
})
export class GeneratebillComponent implements OnInit {

  billingDetails:any;
  orderDetails:any;
  productsList=[];
  totalAmount:string;

  constructor(private orderService:OrderService) { 
  } 
 @ViewChild('canvas', {static: false}) public canvas: ElementRef;
 @ViewChild('logoImage', {static: false}) imageObj: ElementRef;
 @ViewChild('bill', {static: false}) bill: ElementRef;
 ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.getBillingDetails(5);
  }
  // function which get Context of canvas after view is loaded  ie function ngAfterViewInit
  ngAfterViewInit(): void {
      this.ctx  = this.canvas.nativeElement.getContext('2d');       
      this.paint(this.ctx);
  }
  // function which draw's image on text
  paint(ctx) {       
      setTimeout(() => 
      {
        ctx.drawImage(this.imageObj.nativeElement, 0, 0);
      },
      300);
      return true;
  }
  public downloadAsPDF() {
    const doc = new jsPDF('portrait');

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const billFormat = this.bill.nativeElement;

    doc.fromHTML(billFormat.innerHTML, 15, 15, {
      width: 350,
      'elementHandlers': specialElementHandlers
    },
    function (bla) { doc.save('saveInCallback.pdf'); },);

    //doc.save('tableToPdf.pdf');
    $("#print").hide();
    setTimeout(() =>{
      $("#print").show();
    },2000);
    window.print();

  }

  getBillingDetails(orderId){
    this.orderService.getOrderDetails(orderId).subscribe( response =>{
      this.billingDetails=response.shipping_address[0];
      this.orderDetails=response.order[0];
      this.totalAmount=response.order[0].bill_amount;
      this.productsList=[...response.orderdetail];
    });
  }

}
