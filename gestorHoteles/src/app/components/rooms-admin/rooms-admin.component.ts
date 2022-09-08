import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationModel } from 'src/app/models/reservation.model';
import { RoomModel } from 'src/app/models/room.model';
import { ReservationRestService } from 'src/app/services/reservationRest/reservation-rest.service';
import { RoomRestService } from 'src/app/services/roomRest/room-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms-admin',
  templateUrl: './rooms-admin.component.html',
  styleUrls: ['./rooms-admin.component.css']
})
export class RoomsAdminComponent implements OnInit {
  rooms:any;
  roomUpdate:any;
  reservation: ReservationModel;
  room: RoomModel;
  idHotel:any;

  constructor(
    private roomRest: RoomRestService,
    private reservationRest: ReservationRestService,
  ) {
    this.reservation = new ReservationModel('','','','','','','',0);
    this.room = new RoomModel('','','','','',false,0,'');
  }

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

  addRoom(){
    this.roomRest.addRoom(this.room).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.getRooms();
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
    })
  }
  getRooms(){
    this.roomRest.getRooms().subscribe({
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
        next: (res:any)=>{
          this.roomUpdate = res.room;
          this.roomUpdate.services = this.roomUpdate.services.map((services:any) => (
            services.service
          ));
          this.roomUpdate.services = this.roomUpdate.services.toString();
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

    deleteRoom(id:string){
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
          this.roomRest.deleteRoom(id).subscribe({
            next:(res:any)=>{
                Swal.fire({
                  title:'Deleted!',
                  text:res.message,
                  icon:'success',
                  timer: 3000,
                  showConfirmButton: false,
                  timerProgressBar: true
                });
                this.getRooms();
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

    updateRoom(){
      this.roomUpdate.hotel = undefined, this.roomUpdate.status = undefined,
      this.roomUpdate.noRoom = undefined, this.roomUpdate.type = undefined,
      this.roomUpdate.available = undefined;
      
      this.roomRest.updateRoom(this.roomUpdate._id, this.roomUpdate).subscribe({
        next:(res:any)=>{
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          });
          this.getRooms();
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
