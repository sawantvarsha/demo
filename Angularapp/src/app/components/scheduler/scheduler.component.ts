import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  months: any[] = [
    { value: 'Jan', lastDay: 31 },
    { value: 'Feb', lastDay: 28 },
    { value: 'Mar', lastDay: 31 },
    { value: 'Apr', lastDay: 30 },
    { value: 'May', lastDay: 31 },
    { value: 'Jun', lastDay: 30 },
    { value: 'Jul', lastDay: 31 },
    { value: 'Aug', lastDay: 31 },
    { value: 'Sep', lastDay: 30 },
    { value: 'Oct', lastDay: 31 },
    { value: 'Nov', lastDay: 30 },
    { value: 'Dec', lastDay: 31 }
  ];

  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  month: string;
  day: any;
  daycount: number;
  today: number;
  days = [];
  date: string;
  dates = [];
  year: number;
  event1 = '';
  eventData = [];
  eventtype = '';
  from: any;
  to: any;
  constructor(public cus: CustomerApiService, public homeApi: HomeApiService) {
    let d = new Date();
    this.month = this.months[d.getMonth()].value;
    this.daycount = this.months[d.getMonth()].lastDay;

    this.today = d.getDate();
    console.log(this.today);
    this.year = d.getFullYear();
    this.eventtype = 'Coupon_EvtCal';

    // this.from = '01-' + this.month + '-' + this.year;

    // this.to = this.daycount + '-' + this.month + '-' + this.year;
    this.from = '01-Jan-2021';
    this.to = '31-Dec-2021';
  }

  ngOnInit(): void {


   this.geteventdata();
  
  }


  geteventdata(){
    this.cus.GetEventCalendarDetails('ALL', this.from, this.to, this.homeApi.CustomerId, sessionStorage.getItem('Username'), 'Fixing',this.homeApi.Portfolio || '').subscribe(res => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.eventData = [];
          this.dates = [];
          
          res.EventCalendarResponseBody.EventCalendarResponse.forEach(element => {
            let date = formatDate(element.RS_Schedule_Date.trim(), 'MM-dd-yyyy', 'en-US', '+0530');
            // if(date){
           
              let day = new Date(date);
            
              element.RS_Schedule_Date = this.months[parseInt(date.split('-')[0]) - 1].value + ' , ' + this.weekdays[day.getDay()] ;
            // }
        
          });
          this.eventData = res.EventCalendarResponseBody.EventCalendarResponse;
          console.log(this.eventData);
          // for (let i = 1; i <= this.daycount; i++) {
          //   let date = new Date(i + '-' + this.month + '-' + this.year);
          //   const Events = this.eventData.filter(e =>  parseInt(e.Day, 10) === i ).map(e=>e.Event_Name);
          //   const Products = this.eventData.filter(e =>  parseInt(e.Day, 10) === i ).map(e=>e.Product_Name);
          //   this.dates.push([i, this.month, this.weekdays[date.getDay()], Events, Products]);
          //   console.log(Events);
          // }

        //  console.log(this.dates);

          // this.loadingComplete = true;
          // this.errorFlag = false;
        } 
        // else {
        //   this.dates =[];
        //   for (let i = 1; i <= this.daycount; i++) {
        //     let date = new Date(i + '-' + this.month + '-' + this.year);
           
        //     this.dates.push([i, this.month, this.weekdays[date.getDay()], [], []]);
     
        //   }


        // }
      } else {
        this.dates =[];
        for (let i = 1; i <= this.daycount; i++) {
          let date = new Date(i + '-' + this.month + '-' + this.year);
         
          this.dates.push([i, this.month, this.weekdays[date.getDay()], [], []]);
   
        }
      }
    });

  }

  monthchanges(event) {
    let val = event.target["selectedIndex"];
    this.month = this.months[val].value;
    this.daycount = this.months[val].lastDay;
    this.from = '01-' + this.month + '-' + this.year;

    this.to = this.daycount + '-' + this.month + '-' + this.year;
    this.geteventdata();
  }

}
