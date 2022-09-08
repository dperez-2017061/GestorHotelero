import { Component, OnInit } from '@angular/core';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finalized-reservations',
  templateUrl: './finalized-reservations.component.html',
  styleUrls: ['./finalized-reservations.component.css']
})
export class FinalizedReservationsComponent implements OnInit {
  reservations:any;

  constructor(private reservationRest: ReservationRestService) { }

  ngOnInit(): void {
    this.getReservationsFinished();
  }

  getReservationsFinished(){
    this.reservationRest.getReservationsFinished().subscribe({
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
