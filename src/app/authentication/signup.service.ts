import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(private http:HttpClient) {
   }
  register(userDetails){ 
    console.log(userDetails);
    return this.http.post<any>("https://cors-anywhere.herokuapp.com/"+GlobalConstants.apiURL+"register",userDetails);
  };

}
