import { Component, OnInit } from '@angular/core';
import {SharedService} from '../services/shared.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private sharedService:SharedService,private router:Router) { }

  ngOnInit() {
  }

  goToHomePage(){
    this.sharedService.homeIconEventTrack.next(event); // event using service 
  }
  showSuperCategoryList(){
    this.sharedService.categoryIconEventTrack.next(event); // event using service 
  }
  showCart(){
    this.sharedService.cartIconEventTrack.next(event); // event using service 
  }
  focusSearchBar(){
    this.sharedService.searchIconEventTrack.next(event); // event using service 
  }

}
