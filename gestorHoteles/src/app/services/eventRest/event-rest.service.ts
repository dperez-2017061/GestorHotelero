import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRestService } from '../userRest/user-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');
  
  constructor(
    private http: HttpClient,
    private userRest: UserRestService
  ) { }

  getEvents(id: string){
    return this.http.get(environment.baseUri + 'event/getEvents/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
 }
 createEvent(params:{}){
  return this.http.post(environment.baseUri + 'event/createEvent', params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  };

  updateEvent(id:string, params:{}){
    return this.http.put(environment.baseUri + 'event/updateEvent/' + id, params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getEvent(id:string){
    return this.http.get(environment.baseUri + 'event/getEvent/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  deleteEvent(id:string){
    return this.http.get(environment.baseUri + 'event/deleteEvent/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  getEventsFinished(){
    return this.http.get(environment.baseUri + 'event/getEventsFinished', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getEventsApproved(){
    return this.http.get(environment.baseUri + 'event/getEventsApproved', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }
}
