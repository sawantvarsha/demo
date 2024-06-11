import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { Subscription } from 'rxjs';
import * as _moment from 'moment';
import {UntypedFormControl} from '@angular/forms';
// eslint-disable-next-line no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {MatDatepicker} from '@angular/material/datepicker';
import { HomeApiService } from 'src/app/services/home-api.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-premium-calendar',
  templateUrl: './premium-calendar.component.html',
  styleUrls: ['./premium-calendar.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PremiumCalendarComponent implements OnInit, OnDestroy {

  date = new UntypedFormControl(moment());
  openDiv = false;
  Months_All = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  Months1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  Months2 = ['Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  MonthsCount = [
    // {
    //   title: 'All',
    //   value: 0,
    // },
    {
      title: 'Jan',
      value: 0,
    },
    {
      title: 'Feb',
      value: 0,
    },
    {
      title: 'Mar',
      value: 0,
    },
    {
      title: 'Apr',
      value: 0,
    },
    {
      title: 'May',
      value: 0,
    },
    {
      title: 'Jun',
      value: 0,
    },
    {
      title: 'Jul',
      value: 0,
    },
    {
      title: 'Aug',
      value: 0,
    },
    {
      title: 'Sept',
      value: 0,
    },
    {
      title: 'Oct',
      value: 0,
    },
    {
      title: 'Nov',
      value: 0,
    },
    {
      title: 'Dec',
      value: 0,
    },
  ];
  months: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  Monthshow1 = [false, false, false, false, false, false];
  Monthshow2 = [false, false, false, false, false, false];
  login: string;
  custId: string;
  paymentHistory = [];
  premiumCalendar = [];

  currentMonth: any;
  today: any;
  currentyear: any;
  insPrem: Subscription;
  baseCCY: string;
  isActive: any = 1;
  yearRange: any[];
  maxYear: any;
  minYear: number;
  no_of_days: number[];
  filteredData: any[];
  events_in_month: any[];
  Monthindex: number;
  errorMsg: string = '';
  constructor(public cfs: CommonApiService, public custapi: CustomerApiService, public homeapi: HomeApiService) { }

  ngOnDestroy() {
    // this.insPrem.unsubscribe();
    this.premiumCalendar = [];
  }

  ngOnInit(): void {
    this.login = sessionStorage.getItem('Username');
    this.custId = sessionStorage.getItem('CustomerID');
    
    this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    let d = new Date();
    this.today =d.getDate();
    this.currentMonth = null;
    this.currentyear = null;
    // this.currentMonth = this.Months_All[(d.getMonth())];
    this.isActive = (d.getMonth());
    // this.currentyear = d.getFullYear();
    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{  
      this.baseCCY = ccy;    
      this.homeapi.GetInsurancePremiumDetails(this.login, this.custId, this.baseCCY, this.homeapi.Portfolio || '').subscribe(res => {
        if (res.length !== 0) {
          this.paymentHistory = res.GetInsurancePremiumDetails_LCYEResult;
         this.setData(this.paymentHistory);
         
        }
      });
    })
  
    // this.premiumCalendar = [];

  
  }

  setData(res){
    this.premiumCalendar = [];
    // res.forEach((element, i) => {
    //   const data = element.InsuranceDetail;
    //   data.forEach(element => {
    //     if (element.Key === 'Premium Year' && element.Value === this.currentyear.toString()) {
    //       if (this.Months_All[res[i].InsuranceDetail[13].Value - 1] === this.currentMonth) {
    //         this.premiumCalendar.push(data);
    //       }
    //     }
    //   });
    //   this.calendarSchedule();
    // });
    res.forEach((element, _i) => {
      const data = element.InsuranceDetail;    

      data.forEach(element => {
        if (element.Key === 'Premium Year') {
          // if (this.Months_All[res[i].InsuranceDetail[13].Value - 1] === this.currentMonth) {
                 this.premiumCalendar.push(data);
       
          // }
            }
      });
     

    }); 
    this.calendarSchedule();
    this.getFirstNotNullMonth();
      // this.premiumCalendar = res;
      // this.calendarSchedule();
    // console.log(this.premiumCalendar);
  }
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    // console.log(ctrlValue.year())
    this.currentyear = ctrlValue.year()
    datepicker.close();
    
    this.setData(this.paymentHistory);
  }

  openPremiumCalculator(selectedMonth) {
    alert(selectedMonth);
    this.openDiv = true;
  }


  setMonth(monthNumber, month){
    this.isActive = monthNumber;
    // console.log(month)
    this.currentMonth = month;
    this.setData(this.paymentHistory);
  }

  clearFilter() {
    this.currentMonth = null;
    this.currentyear = null
    this.filteredData = this.premiumCalendar.slice();
    let tempArr = [];
    tempArr = this.filteredData.sort((a, b) => {
      const dateA: any = new Date(a[6].Value);
      const dateB: any = new Date(b[6].Value);
      return dateA - dateB;
    })
    this.filteredData = tempArr;
  }
  slideLeft() {
    document.getElementById('container').scrollLeft += 35;
  }
  slideRight() {
    document.getElementById('container').scrollLeft -= 35;
  }
  calendarSchedule() {
    // this.fillDataOnPeriodChange(this.eventtype);
    this.yearRange = [];
    // console.log(this.premiumCalendar)
    this.maxYear = Math.max.apply(Math, this.premiumCalendar.map(function (o) {
      var year = new Date(o[6].Value)
      return year.getFullYear();
    }))
    // console.log(this.maxYear)
    // this.minYear = Math.min.apply(Math, this.eventData.map(function (o) {
    //   var year = new Date(o.RS_Schedule_Date)
    //   return year.getFullYear();
    // }))
    this.minYear = new Date().getFullYear()
    // console.log(this.minYear)
    for (let i = this.minYear; i <= this.maxYear; i++) {
      // console.log(i)
      this.yearRange.push({ title: i, value: 0 });
    }
    // console.log(this.yearRange)
    if (this.currentyear === null) {
      this.currentyear = this.minYear
    }
    this.filterData()
  }
  getYear(year) {
    this.currentyear = year;
    this.getMonth('Jan', 0)
    this.getFirstNotNullMonth();
    // this.filterData()
  }
  getMonth(month, i) {
    if(this.currentyear === null) {
      this.errorMsg = 'Please select Year.'
    } else {
      this.errorMsg = '';
      // if (this.currentMonth === month) {
      //   this.currentMonth = null
      //   this.filterData()
      // } else {
        this.currentMonth = month;
        // console.log(this.currentMonth, i, this.currentyear)
        let first_day = new Date(this.currentyear, i, 1)
        this.no_of_days = Array.from(Array(moment(this.currentyear.toString() + '-' + this.currentMonth.toString()).daysInMonth()), (_, i) => i + 1)
        // console.log(this.no_of_days)
        // console.log(first_day)
        let start_date = moment(first_day).day()
        // console.log(start_date)
        for (let i = 0; i < start_date; i++) {
          this.no_of_days = this.prepend(0, this.no_of_days)
        }
        // console.log(this.no_of_days)
        this.filterData()
      // }
    }
  }
  prepend(value, array) {
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
  }
  filterData() {
    // console.log(year) 
    // this.MonthsCount.forEach((f) => {
    //   f.value = this.eventData.filter(
    //     (t) => this.Months_All[new Date(t.RS_Schedule_Date).getMonth()] === f.title
    //   ).length;
    // });
    this.filteredData = this.premiumCalendar.slice();
    let blotter = this.filteredData
    this.yearRange.forEach((f) => {
      f.value = this.filteredData.filter(
        (t) => new Date(t[6].Value).getFullYear() === f.title
      ).length;
    });
    if (this.currentyear !== null) {
      this.filteredData = blotter.filter((item) => {
        return new Date(item[6].Value).getFullYear() === this.currentyear
      });
      // console.log(this.yearRange)
      this.MonthsCount.forEach((f) => {
        f.value = this.filteredData.filter(
          (t) => this.Months_All[new Date(t[6].Value).getMonth()] === f.title
        ).length;
      });
      // console.log("MonthsCount",this.MonthsCount)
      // console.log(this.currentMonth)
      if (this.currentMonth !== null) {
        let blotter2 = this.filteredData
        this.filteredData = blotter2.filter((item) => {
          // console.log(new Date(item.RS_Schedule_Date).getMonth())
          return this.Months_All[new Date(item[6].Value).getMonth()] === this.currentMonth
        });
      }
      this.events_in_month = []
      this.filteredData.forEach((item) => {
        this.events_in_month.push(new Date(item[6].Value).getDate())
      });
      let tempArr = [];
      tempArr = this.filteredData.sort((a, b) => {
        const dateA: any = new Date(a[6].Value);
        const dateB: any = new Date(b[6].Value);
        return dateA - dateB;
      })
      this.filteredData = tempArr;
    }
    // console.log(this.filteredData)
    // console.log(this.MonthsCount)
    // console.log(this.events_in_month)
  }
  getFirstNotNullMonth() {
    let tempArr;
    tempArr = this.MonthsCount.find((el, i) => {
      this.Monthindex = i;
       return el.value !== 0
    })
    // console.log('tempArr', tempArr, this.Monthindex);
    this.getMonth(tempArr.title, this.Monthindex);
  }
}

