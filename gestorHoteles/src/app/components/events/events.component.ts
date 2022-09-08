import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { eventModel } from 'src/app/models/event.model';
import { EventRestService } from 'src/app/services/eventRest/event-rest.service';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any;
  event: eventModel;
  eventUpdated: any;
  idHotel : any;
  search: any;

  constructor(
    public activateRoute : ActivatedRoute,
    private eventRest: EventRestService
  ) {
    this.event = new eventModel('','','','','','','',0,'');
   }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((idHo:any)=>{
      this.idHotel =idHo.get('idH');
      this.getEvents()
    });
  }

  getEvents(){
    this.eventRest.getEvents(this.idHotel).subscribe({
      next:(res:any)=> this.events= res.events,
      error:(err)=>{
        console.log(err.error.message || err.error)
      }
    })
  };

  createEvent(addEventForm:any){
    this.eventRest.createEvent(this.event).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          position:'center'
        })
        this.getEvents()
        addEventForm.reset()
      },
      error:(err)=>Swal.fire({
        title: err.error.message,
        icon: 'error',
        timer: 4000,
        position:'center'
      })
    })
  };

  getEvent(id:string){
    this.eventRest.getEvent(id).subscribe({
      next: (res:any)=> {this.eventUpdated = res.event;
        this.eventUpdated.extras = this.eventUpdated.extras.map((extras:any) => (
          extras.service
        ));
        this.eventUpdated.services = this.eventUpdated.extras.toString();
        this.eventUpdated.startDate = moment(this.eventUpdated.startDate).format('YYYY-MM-DDTHH:mm:ss');
        this.eventUpdated.finishDate = moment(this.eventUpdated.finishDate).format('YYYY-MM-DDTHH:mm:ss');
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

  deleteEvent(id:string){
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
        this.eventRest.deleteEvent(id).subscribe({
          next:(res:any)=>{
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getEvents();
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

  updateEvent(){
    this.eventUpdated.user = undefined,this.eventUpdated.type = undefined,
    this.eventUpdated.status = undefined, this.eventUpdated.hotel = undefined;
    this.eventRest.updateEvent(this.eventUpdated._id, this.eventUpdated).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.getEvents();
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
