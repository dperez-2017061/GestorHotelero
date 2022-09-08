import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class HotelRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient,private userRest: UserRestService) {}

  createHotel(params:{}){
      return this.http.post(environment.baseUri + 'hotel/createHotel', params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  mostPopular(){
      return this.http.get(environment.baseUri + 'hotel/mostPopular', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getHotels(){
    return this.http.get(environment.baseUri + 'hotel/getHotels');
  }

  getHotel(id:string){
    return this.http.get(environment.baseUri + 'hotel/getHotel/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  deleteHotel(id:string){
    return this.http.delete(environment.baseUri + 'hotel/deleteHotel/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  updateHotel(id:string,params:{}){
    return this.http.put(environment.baseUri + 'hotel/updateHotel/' + id, params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }
}