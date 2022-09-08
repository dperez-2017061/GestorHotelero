import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private userRest: UserRestService
    ) { }

  getReservation(id:string){
    return this.http.get(environment.baseUri + 'reservation/getReservation/'+ id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  makeReservation(params:{}){
    return this.http.post(environment.baseUri + 'reservation/makeReservation', params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getReservationsApproved(){
    return this.http.get(environment.baseUri + 'reservation/getReservationsApproved', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getReservationsFinished(){
    return this.http.get(environment.baseUri + 'reservation/getReservationsFinished', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getReservations(){
    return this.http.get(environment.baseUri + 'reservation/getReservations', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  deleteReservation(id:string){
    return this.http.delete(environment.baseUri + 'reservation/deleteReservation/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  updateReservation(id:string,params:{}){
    return this,this.http.put(environment.baseUri + 'reservation/updateReservation/' + id, params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  reservationsByHotel(){
    return this.http.get(environment.baseUri + 'reservation/reservationsByHotel', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getReservationsC(id:string){
    return this.http.get(environment.baseUri + 'reservation/getReservationsC/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }
}
