import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EventRestService } from 'src/app/services/eventRest/event-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'finalized-events',
  templateUrl: './finalized-events.component.html',
  styleUrls: ['./finalized-events.component.css']
})
export class FinalizedEventsComponent implements OnInit {
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
    this.eventRest.getEventsFinished().subscribe({
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
}
