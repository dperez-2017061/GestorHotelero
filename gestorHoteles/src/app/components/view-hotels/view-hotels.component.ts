import { Component, OnInit } from '@angular/core';
import { HotelRestService } from 'src/app/services/hotelRest/hotel-rest.service';
import { HotelModel } from 'src/app/models/hotel.model';

@Component({
  selector: 'viewHotels',
  templateUrl: './view-hotels.component.html',
  styleUrls: ['./view-hotels.component.css']
})
export class ViewHotelsComponent implements OnInit {
  viewHotels:any;
  hotel:  HotelModel;
  hotelUpdate:any;
  search:any;
  
  constructor(
    private hotelRest: HotelRestService
  ) { 
    this.hotel = new HotelModel('','','','','');
  }

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels(){
    this.hotelRest.getHotels().subscribe({
      next: (res:any)=> this.viewHotels = res.hotels,
      error: (err)=> alert(err.error.message)
    })
  }  
}
