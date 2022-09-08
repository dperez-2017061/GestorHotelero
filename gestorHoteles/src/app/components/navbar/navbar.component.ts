import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token:any;
  role:any;

  constructor(
    public userRest: UserRestService
  ) { }

  ngOnInit(): void {
    this.token = this.userRest.getToken();
    setInterval(()=>{
      this.token = this.userRest.getToken();
      this.role = this.userRest.getIdentity().role;
    },1000);
    this.role = this.userRest.getIdentity().role;
  }

  logOut(){
    Swal.fire({
      title: 'Log out successfully',
      icon: 'success',
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar:true
    });
    localStorage.clear();
    this.token = this.userRest.getToken();
  }

}
