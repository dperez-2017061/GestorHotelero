import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {
  users:any;

  constructor(
    private userRest: UserRestService,
  ) {
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.userRest.getGuests().subscribe({
      next: (res:any)=> {this.users = res.users;
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
