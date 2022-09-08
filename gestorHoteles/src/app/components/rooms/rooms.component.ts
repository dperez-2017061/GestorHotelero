import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationModel } from 'src/app/models/reservation.model';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import { RoomRestService } from 'src/app/services/roomRest/room-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms:any;
  room:any;
  reservation: ReservationModel;
  idHotel:any;
  constructor(
    private roomRest: RoomRestService,
    private reservationRest: ReservationRestService,
    private activatedRoute:ActivatedRoute
  ) {
    this.reservation = new ReservationModel('','','','','','','',0);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( idRuta=>{
      this.idHotel = idRuta.get('idH');
      this.getReservations();
      this.getRooms();
    });
  }

  getReservations(){
    this.reservationRest.getReservationsC(this.idHotel).subscribe({
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
    this.roomRest.getRoomsC(this.idHotel).subscribe({
      next: (res:any)=> this.rooms = res.rooms,
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

    getRoom(id:string){
      this.roomRest.getRoom(id).subscribe({
        next: (res:any)=>this.room = res.room,
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
  
    makeReservation(reservationForm:any){
      this.reservation.room = this.room._id;
      console.log(this.reservation);
      
      this.reservationRest.makeReservation(this.reservation).subscribe({
        next: (res:any)=>
          {Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          });
          reservationForm.reset();
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

