import { Component, OnInit, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import Swal from 'sweetalert2';
import { HotelRestService } from 'src/app/services/hotelRest/hotel-rest.service';

@Component({
  selector: 'app-graph-most-popular',
  templateUrl: './graph-most-popular.component.html',
  styleUrls: ['./graph-most-popular.component.css']
})
export class GraphMostPopularComponent implements OnInit {
  hotels:any;

  constructor(
    private hotelRest: HotelRestService
  ) {
  }

  ngOnInit(): void {
    this.updateGraph();
  }

  updateGraph(){
    this.hotelRest.mostPopular().subscribe({
      next: (res:any)=> {
        this.hotels = res.hotels;
        let a = this.hotels.map((hotels:any)=>(
          hotels.hotel.name
        ))
        this.pieChartData.labels = a
        let b = this.hotels.map((hotels:any)=>(
          hotels.reservations
        ))
        this.pieChartData.datasets[0].data = b
        this.chart?.update();
      },

      error: (err)=> Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
      
    });
  }
  
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels:[
    ] ,
    datasets: [ {
      data: [],
    } ]
  };
 
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels:{boxHeight:15,boxWidth:52,font: {size:16}},
        
      
      },
      
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  
  public pieChartType: ChartType = 'pie';
}
