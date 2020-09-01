import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants'

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {
  constructor(private http:HttpClient) { }
  
  getProfile(userId){
    return this.http.get<any>(GlobalConstants.apiURL+"user/show/"+userId);
  }
  
  updateProfile(id,name,email,phone){
    return this.http.put(GlobalConstants.apiURL+"profile/update",
    { id:id,
      name:name,
      email:email,
      phone:phone
     }); 
  }

  updateImage(userObj){
    return this.http.post<any>(GlobalConstants.apiURL+"updatephoto",userObj);
  }
}
