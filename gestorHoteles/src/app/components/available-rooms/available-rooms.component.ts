import { Component, OnInit } from '@angular/core';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import { RoomRestService } from 'src/app/services/roomRest/room-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-available-rooms',
  templateUrl: './available-rooms.component.html',
  styleUrls: ['./available-rooms.component.css']
})
export class AvailableRoomsComponent implements OnInit {
  rooms:any;

  room:any;
  idHotel:any;

  constructor(
    private roomRest: RoomRestService,
    private reservationRest: ReservationRestService
  ) {}

  ngOnInit(): void {
    this.getReservations();
    this.getRooms();
  }

  getReservations(){
    this.reservationRest.getReservations().subscribe({
      next: (res:any)=> {},
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
  getRooms(){
    this.roomRest.availableRooms().subscribe({
      next: (res:any)=> this.rooms = res.availableRooms,
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
