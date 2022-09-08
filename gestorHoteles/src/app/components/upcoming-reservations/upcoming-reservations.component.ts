import { Component, OnInit } from '@angular/core';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upcoming-reservations',
  templateUrl: './upcoming-reservations.component.html',
  styleUrls: ['./upcoming-reservations.component.css']
})
export class UpcomingReservationsComponent implements OnInit {
  reservations:any;

  constructor(private reservationRest: ReservationRestService) { }

  ngOnInit(): void {
    this.getReservationsApproved();
  }

  getReservationsApproved(){
    this.reservationRest.getReservationsApproved().subscribe({
      next: (res:any)=> this.reservations = res.reservations,
      error: (err)=>{
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
