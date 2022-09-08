import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoice:any;

  constructor(private userRest: UserRestService) { }

  ngOnInit(): void {
    this.toInvoice();
  }
  
  toInvoice(){
    this.userRest.toInovice('62cdf910f2c889f0fcf80718').subscribe({
      next:(res:any)=>{
        console.log(res.invoice);
        
        this.invoice = res.invoice;
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
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
}
