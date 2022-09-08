import { Component, OnInit } from '@angular/core';
import { HotelRestService } from 'src/app/services/hotelRest/hotel-rest.service';
import { HotelModel } from 'src/app/models/hotel.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels:any;
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
      next: (res:any)=> this.hotels = res.hotels,
      error: (err)=> alert(err.error.message)
    })
  }  

  getHotel(id:string){
    this.hotelRest.getHotel(id).subscribe({
      next: (res:any)=> this.hotelUpdate = res.hotel,
      error: (err)=> alert(err.error.message)
    })
  }

  updateHotel(){
    this.hotelUpdate.address = undefined, this.hotelUpdate.administrator = undefined;

    this.hotelRest.updateHotel(this.hotelUpdate._id, this.hotelUpdate).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.getHotels();
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

  deleteHotel(id:string){
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
        this.hotelRest.deleteHotel(id).subscribe({
          next:(res:any)=>{
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getHotels();
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

  

}
