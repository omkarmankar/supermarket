import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
//user related
   userId: number = 0;
   userName: string = "";
   userMobileNo: string = "";
   profilePic:string = "";
   profileImageUrl:any;

   //flags 
   loggedIn:boolean=false;
  constructor(private router:Router,private sharedService: SharedService) { }

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
