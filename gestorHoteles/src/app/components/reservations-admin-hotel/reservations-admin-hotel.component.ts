import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'hotel-reservations',
  templateUrl: './reservations-admin-hotel.component.html',
  styleUrls: ['./reservations-admin-hotel.component.css']
})
export class ReservationsAdminHotelComponent implements OnInit {
  reservations:any;
  reservation:any;

  constructor(private reservationRest: ReservationRestService) { }

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(){
    this.reservationRest.getReservations().subscribe({
      next: (res:any)=> this.reservations = res.reservations,
      error: (err)=>{
        Swal.fire({
          title: err.error.message || err.error,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
      }
    }) 
  }

  getReservation(id:string){
    this.reservationRest.getReservation(id).subscribe({
      next:(res:any)=> {
        this.reservation = res.reservation;
        this.reservation.startDate = this.reservation.startDate.replace('Z', '');
        this.reservation.finishDate = this.reservation.finishDate.replace('Z', '');
      },
      error: (err)=>{ 
        Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000
        })
      }
    });
  }

  deleteReservation(id:string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationRest.deleteReservation(id).subscribe({
          next:(res:any)=>{
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getReservations();
          },
          error:(err)=>{
            Swal.fire({
            title: err.error.message || err.error,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
          }
        });
      }
    })
  }

  updateReservation(){
    this.reservation.status = undefined, this.reservation.room = undefined,this.reservation.user = undefined,
    this.reservation.hotel = undefined,this.reservation.status = undefined, this.reservation.total = undefined
    
    this.reservationRest.updateReservation(this.reservation._id, this.reservation).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.getReservations();
      },
      error:(err)=>{
        Swal.fire({
          title: err.error.message || err.error,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
      }
    });
  }
}
