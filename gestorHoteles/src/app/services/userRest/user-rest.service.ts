import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  getToken(){
    let globalToken = localStorage.getItem('token');
    let token;
    if(globalToken != undefined){
      token = globalToken;
    }else{
      token = '';
    }
    return token;
  }

  getIdentity(){
    let globalIdentity = localStorage.getItem('identity');
    let identity;
    if(globalIdentity != undefined){
      identity = JSON.parse(globalIdentity);
    }else{
      identity = '';
    }
    return identity;
  }

  constructor(private http: HttpClient) { }

  register(params:{}){
    return this.http.post(environment.baseUri + 'user/register', params, {headers: this.httpOptions});
  }

  login(params:{}){
    return this.http.post(environment.baseUri +  'user/login', params, {headers: this.httpOptions});
  }

  getUsers(){
    return this.http.get(environment.baseUri + 'user/getUsers', {headers: this.httpOptions.set('Authorization', this.getToken())});
  }

  getGuests(){
    return this.http.get(environment.baseUri + 'user/getGuests', {headers: this.httpOptions.set('Authorization', this.getToken())});
  }
  
  toInovice(id:string){
    return this.http.get(environment.baseUri + 'user/toInvoice/' + id, {headers: this.httpOptions.set('Authorization', this.getToken())});
  }

  getUser(id:string){
    return this.http.get(environment.baseUri + 'user/getUser/' + id, {headers: this.httpOptions.set('Authorization', this.getToken())});
  }

  updateUser(id:string, params:{}){
    return this.http.put(environment.baseUri + 'user/update/' + id, params, {headers: this.httpOptions.set('Authorization', this.getToken())})
  }

  deleteUser(id:string){
    return this.http.delete(environment.baseUri + 'user/delete/' + id, {headers: this.httpOptions.set('Authorization', this.getToken())})
  }
}
