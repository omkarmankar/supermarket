import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';


@Component({
  selector: 'app-offerscarousel',
  templateUrl: './offerscarousel.component.html',
  styleUrls: ['./offerscarousel.component.css']
})
export class OfferscarouselComponent implements OnInit {  
  public carouselOne:NgxCarousel;
  constructor() { }

  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      interval:15000,
      slide: 1,
      speed: 2000,
      animation:'lazy',
      load: 5,
      point:{
        visible:true
      },
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }
   
  public myfunc(event: Event) {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
 }
 setImagesToSlider(){
   
 }

}
