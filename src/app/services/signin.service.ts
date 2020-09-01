import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable,throwError, from} from 'rxjs';
import { tap, catchError} from 'rxjs/operators';
import {Login} from '../dataformat/login';
import { GlobalConstants } from '../common/global-constants';
@Injectable({
  providedIn: 'root'
})
export class SigninService {
  constructor(private http:HttpClient) {
  }  

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  private handleError(error:any){
    console.log(error);
    return throwError(error);
  } 
  login(login){ 
    return this.http.post<any>(GlobalConstants.apiURL+"login",login);
  };
 
/*   login(login: Login): Observable<Login> { 
  // console.log("In Login Api Call");
   return this.http.post<Login>(this.apiURL, login, this.httpOptions).pipe(
   tap(data => console.log(data)),
   catchError(this.handleError)
 );
} */
}
