import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import * as XLSX from 'xlsx';
import { HomeApiService } from 'src/app/services/home-api.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import moment from 'moment';


@Component({
  selector: 'app-event-alert',
  templateUrl: './event-alert.component.html',
  styleUrls: ['./event-alert.component.scss']
})
export class EventAlertComponent implements OnInit, OnDestroy {
  isProd = environment.production;
  headertitle = 'CorporateActionBrowser';
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  wrapper = true;
  browser = true;
  tobedisplayed = 'Coupon Browser';
  selectedTab = 1;
  showSchedule = true;
  eventtype = '';
  event1 = '';
  period = 'Yearly';
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
  Months_All = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  months: any[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  yearList: any[];
  eventData = [];
  loadingComplete = true;
  errorFlag = false;
  searchText: any;
  recordsPerPage = 10;
  corporateactions = [];
  currentmonth: any;
  currentyear: any;
  periods: any[] = [
    { value: 'All', viewValue: 'All' },
    { value: 'Yearly', viewValue: 'Yearly' },
    { value: 'Monthly', viewValue: 'Monthly' },
    { value: 'Weekly', viewValue: 'Weekly' },
    { value: 'Daily', viewValue: 'Daily' }
  ];
  p = 1;
  isChecked: boolean;
  styleFlag = false;
  IsBackButtonEnabled: boolean;
  maxDate: any;
  minDate: any;
  maxYear: any;
  minYear: any;
  yearRange: any = [];
  filteredData: any[];
  no_of_days: number[];
  events_in_month: any[];
  Monthindex: number;
  errorMsg: string;
  constructor(
    public cus: CustomerApiService,
    public homeApi: HomeApiService,
    public authApi: AuthService,
    public router: Router
  ) {
    this.isChecked = true;
  }
  ngOnDestroy(): void {
    this.homeApi.RediretToHomeBuySellPledge = '';

  }

  ngOnInit(): void {
    this.loadingComplete = false;
    this.eventtype = this.headertitle = 'Coupon_EvtCal';
    this.IsBackButtonEnabled =
      this.homeApi.RediretToHomeBuySellPledge === '' ? false : true;
    this.period = 'All';
    this.fillDataOnPeriodChange(this.eventtype);
    this.currentmonth = null;
    this.currentyear = null;
    // this.calendarSchedule()
  }

  toggle() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked);
    if (!this.isChecked) {
      this.calendarSchedule();
      this.getFirstNotNullMonth();

    } else {
      this.showSchedule = false;
      this.filteredData = this.eventData;
    }
  }
  Display(type) {
    this.headertitle = type;
    // this.browser = true;
    // this.wrapper = true;
    // console.log(type);
  }

  //Changes done by Alolika G on 9th Feb 2022 --START
  fillDataOnPeriodChange(eventtype) {
    this.clearFilter();
    this.eventtype = eventtype;
    const d = new Date();
    var date = d,
      mnth = ('0' + date.getMonth()).slice(-2),
      day = ('0' + date.getDate()).slice(-2);

    let from;
    let to;
    let viewBy;
    if (this.period === 'Yearly') {
      from = '01-Jan-' + d.getFullYear();
      to = '31-Dec-' + d.getFullYear();
      viewBy = 'Fixing';

    } else if (this.period === 'Monthly') {
      day = '01';
      var lastdate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const daysInMonth = ('0' + lastdate.getDate()).slice(-2);
      from = [day, this.months[Number(mnth)], date.getFullYear()].join('-');
      to = [daysInMonth, this.months[Number(mnth)], date.getFullYear()].join(
        '-'
      );
      // from = '1-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      // to = '31-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      viewBy = 'Fixing';

    } else if (this.period === 'Weekly') {
      let diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
      from = new Date(d.setDate(diff));
      from = moment(from).format('DD-MMM-yyyy');
      let lastday = d.getDate() - (d.getDay() - 1) + 6;
      to = new Date(d.setDate(lastday));
      to = moment(to).format('DD-MMM-yyyy');
      viewBy = 'Fixing';

    } else if (this.period === 'Daily') {
      from =
        d.getDate() + '-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      to =
        d.getDate() + '-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      viewBy = 'Fixing';

    } else if (this.period === 'All') {
      from = '';
      to = '';
      viewBy = '';
    }
    //Changes done by Alolika G on 9th Feb 2022 --END

    if (eventtype === 'Corporate_Action_EvtCal') {
      from === '' ? (from = '01-Jan-2010') : from;
      to === '' ? (to = '01-Dec-2030') : to;

      this.cus
        .ReadAllProductAllEvent_CA(
          '',
          '',
          // this.homeApi.CustomerId, 
          '', //cust id set to null as asked by Hrishikesh M | 02-08-2022
          'Record Date',
          from,
          to,
          'All'
        )
        .subscribe((res) => {
        if (res.ReadAllProductAllEvent_CAResult.length !== 0) {
          // console.log(res);
          this.corporateactions = [];
          this.corporateactions = res.ReadAllProductAllEvent_CAResult;
            this.eventData = this.corporateactions;
          // this.calendarSchedule()
          this.loadingComplete = true;
          this.errorFlag = false;
        } else {
          this.loadingComplete = true;
          this.errorFlag = true;
        }
          this.calendarSchedule();
          this.getFirstNotNullMonth();
      });
    } else {
      this.cus.getPledgedAgainstData(eventtype).subscribe((res) => {
        if (res.length !== 0) {
          let tempArr: any[] = [];
          console.log(tempArr);
          this.event1 = res.Get_Configurable_Common_DataResult[0].DATA_VALUE;
          this.cus
            .GetEventCalendarDetails(
              this.event1,
              from,
              to,
              // this.homeApi.CustomerId,
              '', //cust id set to null as asked by Hrishikesh M | 02-08-2022
              this.authApi.UserName,
              viewBy,
              this.homeApi.Portfolio || ''
            )
            .subscribe((res) => {
            if (res.length !== 0) {
              if (res.FinIQResponseHeader.Status === 'Succeed') {
                this.eventData = [];
                  console.log(
                    res.EventCalendarResponseBody.EventCalendarResponse
                  );
                if (this.selectedTab === 1) {
                    this.eventData =
                      res.EventCalendarResponseBody.EventCalendarResponse;
                } else {
                  this.eventData = [];
                    this.eventData =
                      res.EventCalendarResponseBody.EventCalendarResponse.sort(
                        (a, b) => {
                    const dateA: any = new Date(a.RS_Schedule_Date);
                    const dateB: any = new Date(b.RS_Schedule_Date);
                    return dateB - dateA;
                        }
                      );
                    this.eventData = this.eventData
                      .filter(
                        (thing, i, arr) =>
                          arr.findIndex(
                            (t) => t.Product_Name === thing.Product_Name
                          ) === i
                      )
                      .sort((a, b) => {
                    const dateA: any = new Date(a.RS_Schedule_Date);
                    const dateB: any = new Date(b.RS_Schedule_Date);
                    return dateA - dateB;
                  });
                }
                this.filteredData = this.eventData;


                tempArr = res.EventCalendarResponseBody.EventCalendarResponse;
                // this.eventData = this.eventData.sort(
                //   (thing, i, arr) => arr.findIndex(t => t.RS_Schedule_Date === thing.RS_Schedule_Date) === i
                // );

                // console.log("distinctThings", distinctThings);  
                this.loadingComplete = true;
                this.errorFlag = false;
                this.yearRange.forEach((f) => {
                  f.value = this.eventData.filter(
                      (t) =>
                        new Date(t.RS_Schedule_Date).getFullYear() === f.title
                  ).length;
                });
                  this.calendarSchedule();
                  this.getFirstNotNullMonth();
              } else {
                this.loadingComplete = true;
                this.errorFlag = true;

              }
            } else {
              this.loadingComplete = true;
              this.errorFlag = true;

            }
          });
        }
      });
    }
    this.filterData();
  }

  validateNull() {
    // console.log('Validate Null');
    if (this.recordsPerPage == null) {
      (document.getElementById('records') as HTMLInputElement).value = '' + 10;
    }
    this.recordsPerPage = 10;
  }

  validatePageCount() {
    // console.log('Test', this.recordsPerPage);
    if (this.recordsPerPage > 50) {
      // console.log('Test', this.recordsPerPage);
      // this.recordsPerPage = 50;
      (document.getElementById('records') as HTMLInputElement).value = '' + 50;
    }
    if (this.recordsPerPage === 0) {
      (document.getElementById('records') as HTMLInputElement).value = '' + 10;
      this.recordsPerPage = 10;
    }
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement,
      { raw: true }
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const date = new Date();
    XLSX.writeFile(
      wb,
      'Coporate Action Diary (' +
      date.getDate() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getFullYear() +
      ').xlsx'
    );
  }

  fnRedirectToHomePage() {

    if (this.homeApi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeApi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }

  }

  calendarSchedule() {
    this.period === 'All';
    // this.fillDataOnPeriodChange(this.eventtype);
    if (this.eventtype !== 'Corporate_Action_EvtCal') {
      this.yearRange = [];
      this.showSchedule = true;
      console.log(this.eventData);
      this.maxYear = Math.max.apply(
        Math,
        this.eventData.map(function (o) {
          var year = new Date(o.RS_Schedule_Date);
        return year.getFullYear();
        })
      );
      console.log(this.maxYear);
      // this.minYear = Math.min.apply(Math, this.eventData.map(function (o) {
      //   var year = new Date(o.RS_Schedule_Date)
      //   return year.getFullYear();
      // }))
      this.minYear = new Date().getFullYear();
      console.log(this.minYear);
      for (let i = this.minYear; i <= this.maxYear; i++) {
        console.log(i);
        this.yearRange.push({ title: i, value: 0 });
      }
      console.log(this.yearRange);
      if (this.currentyear === null) {
        this.currentyear = this.minYear;
      }
    } else {
      this.yearRange = [];
      this.showSchedule = true;
      console.log(this.eventData);
      this.maxYear = Math.max.apply(
        Math,
        this.eventData.map(function (o) {
          var year = new Date(o.Record_Date);
        return year.getFullYear();
        })
      );
      console.log(this.maxYear);
      this.minYear = Math.min.apply(
        Math,
        this.eventData.map(function (o) {
          var year = new Date(o.Record_Date);
        return year.getFullYear();
        })
      );
      // this.minYear = new Date().getFullYear()
      console.log(this.minYear);
      for (let i = this.minYear; i <= this.maxYear; i++) {
        this.yearRange.push({ title: i, value: 0 });
      }
      console.log(this.yearRange);
      if (this.currentyear === null) {
        this.currentyear = this.minYear;
      }
    }
    this.filterData();
  }
  getYear(year) {
    this.currentyear = year;
    this.getMonth('Jan', 0);
    this.getFirstNotNullMonth();
    // this.filterData()
  }
  getMonth(month, i) {
    if (this.currentyear === null) {
      this.errorMsg = 'Please select Year.'
    } else {
      // if (this.currentmonth === month) {
      // this.currentmonth = null;
      // this.filterData();
      // } else {
      this.errorMsg = '';
      this.currentmonth = month;
      console.log(this.currentmonth, i, this.currentyear);
      let first_day = new Date(this.currentyear, i, 1);
      this.no_of_days = Array.from(
        Array(
          moment(
            this.currentyear.toString() + '-' + this.currentmonth.toString()
          ).daysInMonth()
        ),
        (_, i) => i + 1
      );
      console.log(this.no_of_days);
      console.log(first_day);
      let start_date = moment(first_day).day();
      console.log(start_date);
      for (let i = 0; i < start_date; i++) {
        this.no_of_days = this.prepend(0, this.no_of_days);
      }
      console.log(this.no_of_days);
      this.filterData();
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

    this.filteredData = this.eventData;
    let blotter = this.filteredData;

    if (
      this.currentyear !== null &&
      this.eventtype !== 'Corporate_Action_EvtCal'
    ) {
    this.yearRange.forEach((f) => {
      f.value = this.filteredData.filter(
        (t) => new Date(t.RS_Schedule_Date).getFullYear() === f.title
      ).length;
    });

      this.filteredData = blotter.filter((item) => {
        return (
          new Date(item.RS_Schedule_Date).getFullYear() === this.currentyear
        );
      });

      console.log(this.yearRange);
      this.MonthsCount.forEach((f) => {
        f.value = this.filteredData.filter(
          (t) =>
            this.Months_All[new Date(t.RS_Schedule_Date).getMonth()] === f.title
        ).length;
      });
      console.log(this.currentmonth);
      if (this.currentmonth !== null) {
        let blotter2 = this.filteredData;
        this.filteredData = blotter2.filter((item) => {
          // console.log(new Date(item.RS_Schedule_Date).getMonth())
          return (
            this.Months_All[new Date(item.RS_Schedule_Date).getMonth()] ===
            this.currentmonth
          );
        });

      }
      this.events_in_month = [];
      this.filteredData.forEach((item) => {
        this.events_in_month.push(new Date(item.RS_Schedule_Date).getDate());
      });
    }
    if (
      this.currentyear !== null &&
      this.eventtype === 'Corporate_Action_EvtCal'
    ) {
      this.yearRange.forEach((f) => {
        f.value = this.filteredData.filter(
          (t) => new Date(t.Record_Date).getFullYear() === f.title
        ).length;
      });
      this.filteredData = blotter.filter((item) => {
        return new Date(item.Record_Date).getFullYear() === this.currentyear;
      });
      this.MonthsCount.forEach((f) => {
        f.value = this.filteredData.filter(
          (t) => this.Months_All[new Date(t.Record_Date).getMonth()] === f.title
        ).length;
      });
      console.log(this.currentmonth);
      if (this.currentmonth !== null) {
        let blotter2 = this.filteredData;
        this.filteredData = blotter2.filter((item) => {
          // console.log(new Date(item.RS_Schedule_Date).getMonth())
          return (
            this.Months_All[new Date(item.Record_Date).getMonth()] ===
            this.currentmonth
          );
        });

      }
      this.events_in_month = [];
      this.filteredData.forEach((item) => {
        this.events_in_month.push(new Date(item.Record_Date).getDate());
      });
    }
    console.log(this.filteredData);

    console.log(this.MonthsCount);
    console.log(this.events_in_month);
  }
  clearFilter() {
    this.currentmonth = null;
    this.currentyear = null;
  }

  slideLeft() {
    document.getElementById('container').scrollLeft += 35;
  }
  slideRight() {
    document.getElementById('container').scrollLeft -= 35;
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

