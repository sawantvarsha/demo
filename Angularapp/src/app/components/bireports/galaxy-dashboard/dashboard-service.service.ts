import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Console } from 'console';
// import { BIReportsComponent } from '../bireports.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService implements OnInit {

  constructor(private http: HttpClient) { }

  dataReceived = new EventEmitter<void>();
  chartEvent=new EventEmitter<void>();
  chartEvent1=new EventEmitter<void>();
  chart : any = [];
  userName: any;
  index = 0;
  // performanceTimelineData : any = [];
  
  setUserName(userName:any){
    this.userName=userName
  }

  setChartData(data:any,userName:any){
    this.chart=data
   // this.userName=userName
  }

  getChart(){
    this.http.post<any>('https://1europe.test-equity-connect.com/FinIQService/InteractiveDashboardSecured.svc/GetChartData', {
   }, {
       responseType: "json"
     }).subscribe((value) => {
      // this.userName=this.bIReportsComponent.userName
     this.chart= JSON.parse(value.GetChartDataResult)
     for(let i=0;i<this.chart.length;i++){
       this.chart[i].chartData=JSON.parse((this.chart[i]).chartData)
     }
   })
   this.chart=this.chart.filter((c:any)=>{
    if(c.userId!==null){
      return c.userId===(this.userName)
     }
   })
   return this.chart
 }

  ngOnInit(): void {
   
    
  }



}
