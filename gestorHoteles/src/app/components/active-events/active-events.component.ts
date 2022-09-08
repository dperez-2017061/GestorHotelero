import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EventRestService } from 'src/app/services/eventRest/event-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'active-events',
  templateUrl: './active-events.component.html',
  styleUrls: ['./active-events.component.css']
})
export class ActiveEventsComponent implements OnInit {
  events:any;
  event:any;
  eventUpdated: any;
  id : any;
  search: any;

  constructor(private eventRest: EventRestService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.eventRest.getEventsApproved().subscribe({
      next:(res:any)=> this.events= res.events,
      error:(err)=>{
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

}
