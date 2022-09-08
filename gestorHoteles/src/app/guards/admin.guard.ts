import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserRestService } from '../services/userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private userRest: UserRestService,
  private router:Router
  ){}
  
  canActivate(){
    if(this.userRest.getIdentity().role === 'ADMIN'){
      return true
    }else{
      this.router.navigateByUrl('');
      return false
    }
  }
}
