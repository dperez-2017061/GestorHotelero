import { Component, OnInit } from '@angular/core';
import { HotelModel } from 'src/app/models/hotel.model';
import { HotelRestService } from 'src/app/services/hotelRest/hotel-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-hotel',
  templateUrl: './create-hotel.component.html',
  styleUrls: ['./create-hotel.component.css']
})
export class CreateHotelComponent implements OnInit {
  hotel: HotelModel
  ;
  
  constructor(
    private hotelRest: HotelRestService
  ) {
    this.hotel = new HotelModel('','','','','');
  }

  ngOnInit(): void {
  }

  createHotel(createHotelForm:any){
    this.hotelRest.createHotel(this.hotel).subscribe({
      next:(res:any)=>{
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          });
        createHotelForm.reset();
      },
      error: (err)=>{
        Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        allowOutsideClick: true,
        timer: 3000,
        timerProgressBar:true
        });
      }
    });
    
  }
}
