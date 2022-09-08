import { Component, OnInit } from '@angular/core';
import { ReservationModel } from 'src/app/models/reservation.model';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users:any;

  constructor(
    private userRest: UserRestService,
  ) {
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.userRest.getUsers().subscribe({
      next: (res:any)=> {this.users = res;
      },
      error:(err)=>{
        Swal.fire({
          title: err.error.message || err.error,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })}
      })
    }
}
