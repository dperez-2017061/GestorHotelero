import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class RoomRestService {

  
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private userRest: UserRestService
    ) { }

  getRoomsC(id:string){
    return this.http.get(environment.baseUri + 'room/getRoomsC/'+ id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getRooms(){
    return this.http.get(environment.baseUri + 'room/getRooms', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  getRoom(id:string){
    return this.http.get(environment.baseUri + 'room/getRoom/'+ id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  addRoom(params:{}){
    return this.http.post(environment.baseUri + 'room/addRoom', params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }

  deleteRoom(id:string){
    return this.http.delete(environment.baseUri + 'room/deleteRoom/' + id, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  updateRoom(id:string,params:{}){
    return this.http.put(environment.baseUri + 'room/updateRoom/' + id, params, {headers: this.httpOptions.set('Authorization', this.userRest.getToken())})
  }

  availableRooms(){
    return this.http.get(environment.baseUri + 'room/availableRooms', {headers: this.httpOptions.set('Authorization', this.userRest.getToken())});
  }
}
