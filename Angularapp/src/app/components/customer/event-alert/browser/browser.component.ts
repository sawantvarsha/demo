import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { ServiceService } from '../../../../services/service.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
// import * as $ from 'jquery';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { dark, light, stanhope } from 'src/app/themeService/theme.module';
import { HomeApiService } from 'src/app/services/home-api.service';
@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
})
export class BrowserComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

  @Input() headertitle: string;

  constructor(
    public getAPIDataService: ServiceService,
    public themeService: ThemeserviceService,
    public cas: CustomerApiService,
    private homeapi: HomeApiService
  ) {}

  apiData = [];

  // ----------- Arrays to store counts of records for particular tab --------------------
  yearlyCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthlyCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  weeklyCounts = [0, 0, 0, 0];
  dailyCounts = [0, 0, 0, 0, 0, 0, 0, 0];
  // -------------------------------------------------------------------------------------

  base: any;
  loadingComplete = false;
  responseFlag = true; // flag to make requests sequential
  errorFlag = false;
  errorFlagCount = false;
  today: any;
  parent: any;
  flag = 'Jan';
  Bondorder: any;
  weekNo: any;
  selectedYear: any;
  selectedMonth: any;
  selectedWeek: any;
  selectedDay: any;
  prevNo: any;
  prevYear = 1900;
  tabNum = 1;
  selectedTabNo = 0;
  tempTabNum: any;
  isMobile = false;

  recordsCount = 0;

  // --------for graphs--------
  eventNames = new Set();
  assets = new Set();
  eventNamesCounts = [];
  assetsCounts = [];
  events = [];
  assetsData = [];
  recordDate = [];
  // ----------------------------
  // Flags to show or hide dropdowns
  yearFlag = false;
  monthFlag = false;

  setFormatFlag = true; // to set date format

  r1 = []; // for row 1 of year in calendar
  r2 = [];
  r3 = [];
  r4 = [];

  p = 1;
  searchText: any;

  // themes
  currentTheme = 'light';

  // parameter
  eventtype: string;

  // Google Chart Fields
  title: any;
  type: any;
  data: any;
  columnNames: any;
  options: any;
  width: any;
  height: any;

  showGraph = false;
  // ------------------

  fromYear = false;
  yearTopText: any;

  showDiv = false;
  clickedonce = false;
  showTheme = false;

  // default selected tab index variable
  currentTabIndex = 0;
  yearIndex: any;
  monthIndex: any;
  weekIndex: any;
  dayIndex: any;
  showSchedule = false;
  // eslint-disable-next-line max-len
  headerFields = [
    'Note_Master_Id',
    'Product_Name',
    'Template_Name',
    'Asset',
    'Client_response_applicable',
    'Announcement_Date',
    'Record_Date',
    'Response_Date',
  ];
  ten = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  weeks = [1, 2, 3, 4]; // for getting week index
  weekDays = [1, 2, 3, 4, 5, 6, 7, 8];
  lastWeekDays = [];
  period = 'Yearly';
  periods: any[] = [
    { value: 'Yearly', viewValue: 'Yearly' },
    { value: 'Monthly', viewValue: 'Monthly' },
    { value: 'Weekly', viewValue: 'Weekly' },
    { value: 'Daily', viewValue: 'Daily' },
  ];

  // months: any[] = [
  //   { value: 'Jan', lastDay: 31 },
  //   { value: 'Feb', lastDay: 28 },
  //   { value: 'Mar', lastDay: 31 },
  //   { value: 'Apr', lastDay: 30 },
  //   { value: 'May', lastDay: 31 },
  //   { value: 'Jun', lastDay: 30 },
  //   { value: 'Jul', lastDay: 31 },
  //   { value: 'Aug', lastDay: 31 },
  //   { value: 'Sep', lastDay: 30 },
  //   { value: 'Oct', lastDay: 31 },
  //   { value: 'Nov', lastDay: 30 },
  //   { value: 'Dec', lastDay: 31 }
  // ];

  months: any[] = [
    'Jan',
    'Feb,"Mar',
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
  month: string;
  currentMonthLastDay = 0; // Last day of current month

  recordsPerPage = 10; // records per page of the table
  CustomerID = '';
  eventData = [];
  records: any;
  event1 = '';
  // eslint-disable-next-line max-len
  tabHeader = [
    'Product ID',
    'Product Name',
    'Event Name',
    'Asset',
    'Client Response Reqd?',
    'Annnouncement Date',
    'Record Date',
    'Response Due Date',
  ];

  ngOnInit() {
    let d = new Date();
    this.month = this.months[d.getMonth()].value;
    this.events = [];
    this.assetsData = [];
    this.recordDate = [];

    this.CustomerID = this.homeapi.CustomerId;
    this.eventtype =
      this.headertitle === 'Corporate Action Browser'
        ? 'Corporate_Action_EvtCal'
        : this.headertitle === 'Maturity Browser'
        ? 'Maturity_EvtCal'
        : 'Coupon_EvtCal';

    // this.headerFields = this.eventtype === 'CA'
    //   ? ['Note_Master_Id', 'Template_Name', 'Asset', 'Client_response_applicable', 'Announcement_Date', 'Record_Date', 'Response_Date']
    //   : this.eventtype === 'UM'
    //   ? ['Product_Type', 'Maturity_Date', 'Note_Ccy', 'Investment_Amount', 'Trade_Date']
    //   : ['NOTE_MASTER_ID', 'Nominal_Amt', 'Note_Ccy', 'RS_Schedule_Date', 'Scheme_Code'];

    // (document.getElementById('calendarPopUp') as HTMLDivElement).hidden = true;    // hide popup initially
    // (document.getElementById('themeSelector') as HTMLDivElement).hidden = true;
    this.today = new Date(); // Tue Oct 29 2019 16:30:47 GMT+0530 (India Standard Time)
    const temp = '' + this.today;
    this.selectedDay = temp.split(' ')[2]; // 29
    this.selectedMonth = temp.split(' ')[1]; // Oct
    this.selectedYear = temp.split(' ')[3]; // 2019
    const lastDig = parseInt(this.selectedYear, 10) % 10; // 2019 ==> 9
    this.base = parseInt(this.selectedYear, 10) - lastDig; // 2019 - 9 ==> 2010
    this.parent = '' + this.base + ' - ' + (this.base + 9); // Parent==> 2010-2019

    this.yearIndex = this.selectedYear % 10; // 2019 -> 9
    this.monthIndex = this.today.getMonth(); // Nov -> 10
    this.weekIndex = this.checkWeekIndex(); // 13 -> 1  i.e. Week 2

    if (this.today.getDate() % 8 === 0) {
      this.dayIndex = 7;
    } else {
      this.dayIndex = (this.today.getDate() % 8) - 1; // 13 -> 4
    }
    // this.checkLeapYear();
    // this.fillData('Yearly', this.yearIndex);
    // this.fillYearlyCounts();

    // this.leftClickChangePeriod();
    // this.rightClickChangePeriod();

    // this.cas.GetEventCalendarDetails('Coupon','01-Jan-2021','15-July-2021').subscribe(res=>{
    //   if(res.length !== 0){
    //     if(res.FinIQResponseHeader.Status === "Succeed"){
    //       this.eventData = [];
    //       console.log(res.EventCalendarResponseBody.EventCalendarResponse);
    //       this.eventData = res.EventCalendarResponseBody.EventCalendarResponse;
    //       this.loadingComplete = true;
    //     }
    //   }
    // });
    this.period = 'Yearly';

    this.cas.getPledgedAgainstData(this.eventtype).subscribe((res) => {
      if (res.length !== 0) {
        this.event1 = res.Get_Configurable_Common_DataResult[0].DATA_VALUE;
        this.fillDataOnPeriodChange(
          res.Get_Configurable_Common_DataResult[0].DATA_VALUE
        );
      }
    });
  } // end onInit

  leftClickChangePeriod() {
    // on left button click of the slider change period eg. Dec 2019 ==> Jan 2020
    // $(document).ready(() => {
    //   $('.mat-tab-header-pagination-before').on('click', (event) => {
    //     if (this.period === 'Yearly' && this.yearIndex === 0) {
    //       this.down('Yearly');
    //     } else if (this.period === 'Monthly' && this.monthIndex === 0) {
    //       this.down('Monthly');
    //     } else if (this.period === 'Weekly' && this.weekIndex === 0) {
    //       this.down('Weekly');
    //     } else if (this.period === 'Daily' && this.dayIndex === 0) {
    //       this.down('Daily');
    //     }
    //   });
    // });
  }

  rightClickChangePeriod() {
    // on right button click of the slider change period eg. Jan 2019 ==> Dec 2018
    // $(document).ready(() => {
    //   $('.mat-tab-header-pagination-after').on('click', (event) => {
    //     if (this.period === 'Yearly' && this.yearIndex === 9) {
    //       this.up('Yearly');
    //     } else if (this.period === 'Monthly' && this.monthIndex === 11) {
    //       this.up('Monthly');
    //     } else if (this.period === 'Weekly' && this.weekIndex === 3) {
    //       this.up('Weekly');
    //     } else if (this.period === 'Daily') {
    //       const index = (parseInt(this.parent.split('to')[1].split('-')[0], 10) % 8) - 1;
    //       // console.log('DayIndex, Index :', this.dayIndex, index);
    //       if (this.parent.includes('25-') && this.dayIndex === index) {
    //         this.up('Daily');
    //       } else if (this.dayIndex === 7) {
    //         this.up('Daily');
    //       }
    //     }
    //   });
    // });
  }

  showThemes() {
    // this.showTheme = true;
    (document.getElementById('themeSelector') as HTMLDivElement).hidden = false;
  }

  hideThemes(event: any) {
    // console.log('ID:', event);
    if (event.srcElement.id !== 'themesImage') {
      (document.getElementById('themeSelector') as HTMLDivElement).hidden =
        true;
    }
  }

  changeTheme(event) {
    // console.log('Inside change theme');
    if (event.srcElement.innerText === 'RAIN Light') {
      // console.log('Theme selected: ', event.srcElement.innerText);
      if (
        this.themeService.getActiveTheme() === dark ||
        this.themeService.getActiveTheme() === stanhope
      ) {
        this.themeService.setlightTheme();
        this.currentTheme = 'light';
      }
    }
    if (event.srcElement.innerText === 'RAIN Dark') {
      // console.log('Theme selected: ', this.themeService.active.name, 'dark');
      if (
        this.themeService.getActiveTheme() === stanhope ||
        this.themeService.getActiveTheme() === light
      ) {
        this.themeService.setdarkTheme();
        this.currentTheme = 'dark';
      }
    }
    if (event.srcElement.innerText === 'Blue') {
      // console.log('Theme selected: ', event.srcElement.innerText);
      if (
        this.themeService.getActiveTheme() === dark ||
        this.themeService.getActiveTheme() === light
      ) {
        this.themeService.setmidnightTheme();
        this.currentTheme = 'blue';
      }
    }
    this.setChartOptions();
  }

  setChartOptions() {
    // Set pie chart color
    if (this.themeService.getActiveTheme() === light) {
      // eslint-disable-next-line max-len
      this.options = {
        responsive: true,
        pieHole: 0.4,
        tooltip: { isHtml: true },
        hAxis: {
          title: '',
        },
        vAxis: {
          minValue: 0,
        },
        legend: {
          textStyle: { color: 'rgb(78, 77, 77)' },
          pagingTextStyle: {
            color: 'rgb(138, 137, 137)',
          },
          scrollArrows: {
            activeColor: 'rgb(138, 137, 137)',
            inactiveColor: '#e0e0e0',
          },
          // position: 'labeled'
        },
        titleTextStyle: {
          color: 'rgb(78, 77, 77)',
        },
        gridlines: {
          color: 'none',
        },
        colors: [
          '#D4AB8B',
          '#C4A994',
          '#CCB6A6',
          '#AB9F93',
          '#887F76',
          'rgb(241, 196, 160)',
          'rgb(189, 148, 114)',
          'rgb(124, 98, 77)',
        ],
        backgroundColor: 'none',
        // sliceVisibilityThreshold: 0.00000001,
        sliceVisibilityThreshold: 0.04,
      };
    } else if (this.themeService.getActiveTheme() === dark) {
      // eslint-disable-next-line max-len
      this.options = {
        responsive: true,
        pieHole: 0.4,
        tooltip: { isHtml: true }, // trigger: 'selection'
        hAxis: {
          title: '',
        },
        vAxis: {
          minValue: 0,
        },
        gridlines: {
          color: 'none',
        },
        colors: ['#584829', '#534220', '#574219', '#553d0e', '#53452b'],
        backgroundColor: 'none',
        pieSliceBorderColor: '#b38d68',
        pieSliceTextStyle: {
          color: '#dbd6d1',
        },
        titleTextStyle: {
          color: '#b38d68',
        },
        legend: {
          textStyle: { color: '#b38d68' },
          pagingTextStyle: {
            color: '#aa6e34',
          },
          scrollArrows: {
            activeColor: '#aa6e34',
            inactiveColor: '#584829',
          },
        },
        // tooltip: {textStyle: {color: '#FF0000'}, showColorCode: true}
      };
      // console.log('colors changed');
      // this.options.colors = ['rgb(182, 111, 54)', 'rgb(201, 117, 48)', 'rgb(233, 137, 58)', 'rgb(163, 101, 50)'];
    } else if (this.themeService.getActiveTheme() === stanhope) {
      this.options = {
        responsive: true,
        pieHole: 0.4,
        tooltip: { isHtml: true },
        hAxis: {
          title: '',
        },
        vAxis: {
          minValue: 0,
        },
        gridlines: {
          color: 'none',
        },
        legend: {
          textStyle: { color: 'rgb(78, 77, 77)' },
          pagingTextStyle: {
            color: 'rgb(67, 82, 223)',
          },
          scrollArrows: {
            activeColor: 'rgb(67, 82, 223)',
            inactiveColor: 'rgb(152, 158, 219)',
          },
        },
        titleTextStyle: {
          color: 'rgb(78, 77, 77)',
        },
        // eslint-disable-next-line max-len
        colors: [
          'rgb(139, 191, 236)',
          'rgb(110, 160, 204)',
          'rgb(36, 108, 172)',
          'rgb(192, 222, 248)',
          'rgb(72, 137, 194)',
          'rgb(125, 165, 201)',
          'rgb(15, 126, 223)',
        ],
        backgroundColor: 'none',
      };
      // this.options.colors = ['rgb(139, 191, 236)','rgb(110, 160, 204)', 'rgb(36, 108, 172)','rgb(192, 222, 248)', 'rgb(72, 137, 194)'];
    }
  } // end setChartOptions

  setGraphVisibility() {
    // hide/unhide the graphs
    this.showGraph = !this.showGraph;
  }

  drawPieChart() {
    this.type = 'PieChart';

    this.assetsData = [];
    this.events = [];
    this.recordDate = [];
    // for events
    const iterator1 = this.eventNames.values();
    if (this.eventNamesCounts.length === 0) {
      // if records doesn't exist then fill 0 for all
      for (let i = 0; i < this.eventNames.size; i++) {
        this.events.push([iterator1.next().value, 0]);
      }
    } else {
      for (let i = 0; i < this.eventNames.size; i++) {
        // if records exists then fill its count
        this.events.push([iterator1.next().value, this.eventNamesCounts[i]]);
      }
    }

    // for assets
    const iterator2 = this.assets.values();
    if (this.assetsCounts.length === 0) {
      // if records doesn't exist then fill 0 for all
      for (let i = 0; i < this.assets.size; i++) {
        this.assetsData.push([iterator2.next().value, 0]);
      }
    } else {
      // if records exists then fill its count
      for (let i = 0; i < this.assets.size; i++) {
        this.assetsData.push([iterator2.next().value, this.assetsCounts[i]]);
      }
    }

    console.log('Lengths: ', this.events.length, this.assetsData.length);
    // for record date
    // for(let i= 0; i<10;i++)
    // {
    //   console.log(this.base+i);
    // }

    if (this.period === 'Yearly') {
      this.recordDate = [];
      for (let i = 0; i < 10; i++) {
        this.recordDate.push([
          '' + (this.base + i),
          Number(this.yearlyCounts[i]),
        ]);
      }
      // console.log('Record Date', this.recordDate);
    }
    if (this.period === 'Monthly') {
      this.recordDate = [];
      for (let i = 0; i < 12; i++) {
        this.recordDate.push([
          this.months[i].value,
          Number(this.monthlyCounts[i]),
        ]);
      }
      // console.log('Record Date', this.recordDate);
    }
    if (this.period === 'Weekly') {
      this.recordDate = [];
      this.recordDate.push(['Week 1', Number(this.weeklyCounts[0])]);
      this.recordDate.push(['Week 2', Number(this.weeklyCounts[1])]);
      this.recordDate.push(['Week 3', Number(this.weeklyCounts[2])]);
      this.recordDate.push(['Week 4', Number(this.weeklyCounts[3])]);
      // console.log('Record Date', this.recordDate);
    }
    // *************************
    if (this.period === 'Daily') {
      this.recordDate = [];

      if (this.weekNo <= 3) {
        // for first three weeks
        for (let i = 0; i < 8; i++) {
          this.recordDate.push([
            '' + (i + 8 * (this.weekNo - 1) + 1),
            Number(this.dailyCounts[i]),
          ]);
        }
        // console.log(this.recordDate);
      }

      // console.log('Record Date', this.recordDate);
    }

    // this.setChartOptions();
    // if ($(window).width() > $(window).height()) {
    //   this.width = $(window).width() * 0.35;
    //   this.height = $(window).height() * 0.3;
    // }
    // else {
    //   this.width = $(window).width() * 0.99;
    //   this.height = $(window).height() * 0.35;
    // }
  } // end drawPieChart

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

  checkWeekIndex() {
    const dd = this.today.getDate();
    if (dd >= 1 && dd <= 8) {
      return 0;
    } else if (dd >= 9 && dd <= 16) {
      return 1;
    } else if (dd >= 17 && dd <= 24) {
      return 2;
    } else if (dd >= 25 && dd <= 31) {
      return 3;
    }
  }

  checkLeapYear() {
    if (this.selectedYear % 4 === 0) {
      this.months[1].lastDay = 29;
    } else {
      // else 28 days
      this.months[1].lastDay = 28;
    }
  }

  setFromYear() {
    this.fromYear = true;
  }

  on() {
    if (this.period !== 'Yearly') {
      // console.log('On');
      (document.getElementById('calendarPopUp') as HTMLDivElement).hidden =
        false;
    }
  }

  off() {
    // console.log('Inside off');
    (document.getElementById('calendarPopUp') as HTMLDivElement).hidden = true;
  }

  hideDiv(event: any) {
    if (event.srcElement.id !== 'tabbtn') {
      if (
        !(document.getElementById('calendarPopUp') as HTMLDivElement).hidden &&
        this.showDiv
      ) {
        this.showDiv = false;
        (document.getElementById('calendarPopUp') as HTMLDivElement).hidden =
          true;
      }
    }
  }

  onClickShowDiv(_event) {
    this.showDiv = true;
    if (this.period !== 'Yearly') {
      (document.getElementById('calendarPopUp') as HTMLDivElement).hidden =
        false;
    }
  }

  // Set rows of the modal for calendar
  setCalendarRows() {
    // -----------------Parent Calendar-------------------
    if (this.period === 'Monthly') {
      this.r1 = [];
      this.r2 = [];
      this.r3 = [];
      this.r4 = [];
      const temp = this.parent - 8; // for 2019-> temp=2011
      this.yearTopText =
        this.parent - 8 + '-' + (parseInt(this.parent, 10) + 7);
      for (let i = 0; i < 4; i++) {
        this.r1.push(temp + i); // 2011 2012 2013 2014
        this.r2.push(temp + 4 + i); // 2015 2016 2017 2018
        this.r3.push(temp + 8 + i); // 2019 2020 2021 2022
        this.r4.push(temp + 12 + i); // 2023 2024 2025 2026
      }
    } else if (this.fromYear) {
      this.r1 = [];
      this.r2 = [];
      this.r3 = [];
      this.r4 = [];
      const temp = this.selectedYear - 8; // for 2019-> temp=2011

      for (let i = 0; i < 4; i++) {
        this.r1.push(temp + i); // 2011 2012 2013 2014
        this.r2.push(temp + 4 + i); // 2015 2016 2017 2018
        this.r3.push(temp + 8 + i); // 2019 2020 2021 2022
        this.r4.push(temp + 12 + i); // 2023 2024 2025 2026
      }
    }
  }

  changeParent(val) {
    // console.log('*****************************************************************************************************************');
    if (this.period === 'Monthly') {
      this.parent = val;
      this.selectedYear = val;
      this.fillMonthlyCounts();
    } else if (this.fromYear) {
      if (this.period === 'Weekly') {
        this.parent = this.parent.split(',')[0] + ', ' + val;
        this.fillWeeklyCounts();
      }
      this.selectedYear = parseInt(val, 10);
      if (this.period === 'Daily') {
        this.selectedYear = val;
        // console.log('1Selected month:', this.selectedMonth);
        // set last day of current month
        this.setCurrentMonthLastDay();
        if (this.weekNo === 4) {
          // eslint-disable-next-line max-len
          this.parent =
            '' +
            this.parent.split('to')[0].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear +
            ' to ' +
            this.currentMonthLastDay +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear;
          // console.log('Parent: ', this.parent);
        } else {
          // eslint-disable-next-line max-len
          this.parent =
            '' +
            this.parent.split('to')[0].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear +
            ' to ' +
            this.parent.split('to')[1].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear;
        }
        this.fillDailyCounts();
      }
      this.fromYear = false;
    } else {
      if (this.period === 'Weekly') {
        this.parent = val + ', ' + this.selectedYear;
        this.selectedMonth = val;
        this.fillWeeklyCounts();
      } else if (this.period === 'Daily') {
        this.selectedMonth = val;
        // console.log('2Selected month:', this.selectedMonth);
        // set last day of current month
        this.setCurrentMonthLastDay();
        if (this.weekNo === 4) {
          // eslint-disable-next-line max-len
          this.parent =
            '' +
            this.parent.split('to')[0].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear +
            ' to ' +
            this.currentMonthLastDay +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear;
          // console.log('Parent: ', this.parent);
        } else {
          // eslint-disable-next-line max-len
          this.parent =
            '' +
            this.parent.split('to')[0].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear +
            ' to ' +
            this.parent.split('to')[1].split('-')[0] +
            '-' +
            this.selectedMonth +
            '-' +
            this.selectedYear;
        }
        this.fillDailyCounts();
      }
    }
    this.fillData(this.period, this.selectedTabNo); // fill data after any year or month change
  }

  // Function to set current year/month/week period of the button
  setParent(filterType) {
    this.leftClickChangePeriod();
    this.rightClickChangePeriod();
    // -----------------------------------------------------------------
    (document.getElementById('calendarPopUp') as HTMLDivElement).hidden = true; // if period changes then hide calendar

    if (filterType === 'Yearly') {
      this.parent = '' + this.base + ' - ' + (this.base + 9);
    } else if (filterType === 'Monthly') {
      this.parent = this.selectedYear;
    } else if (filterType === 'Weekly') {
      this.parent = this.selectedMonth + ', ' + this.selectedYear;
    } else if (filterType === 'Daily') {
      if (this.selectedDay >= 1 && this.selectedDay <= 8) {
        this.weekNo = 1;
        // eslint-disable-next-line max-len
        this.selectedWeek =
          '01-' +
          this.selectedMonth +
          '-' +
          this.selectedYear +
          ' to ' +
          '08-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
      } else if (this.selectedDay >= 9 && this.selectedDay <= 16) {
        this.weekNo = 2;
        // eslint-disable-next-line max-len
        this.selectedWeek =
          '09-' +
          this.selectedMonth +
          '-' +
          this.selectedYear +
          ' to ' +
          '16-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
      } else if (this.selectedDay >= 17 && this.selectedDay <= 24) {
        this.weekNo = 3;
        // eslint-disable-next-line max-len
        this.selectedWeek =
          '17-' +
          this.selectedMonth +
          '-' +
          this.selectedYear +
          ' to ' +
          '24-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
      } else if (this.selectedDay >= 25 && this.selectedDay <= 31) {
        this.weekNo = 4;
        // eslint-disable-next-line max-len
        this.selectedWeek =
          '25-' +
          this.selectedMonth +
          '-' +
          this.selectedYear +
          ' to ' +
          '31-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
      }
      this.parent = this.selectedWeek;
    }

    this.setCalendarRows();
  }

  setCurrentMonthLastDay() {
    // console.log('setting last day for:', this.selectedMonth);
    // set last day of current month
    for (const month of this.months) {
      // console.log('====>', month.value, this.selectedMonth);
      if (month.value === this.selectedMonth) {
        this.currentMonthLastDay = month.lastDay;
        // console.log('Last Day current:', this.currentMonthLastDay);
      }
    }
    // console.log('Selected day is: ', this.currentMonthLastDay);
    // console.log('Parent: ', this.parent);
    this.setParent(this.selectedMonth);
  }

  fillCounts() {
    if (this.period === 'Yearly') {
      this.fillYearlyCounts();
    } else if (this.period === 'Monthly') {
      this.fillMonthlyCounts();
    } else if (this.period === 'Weekly') {
      this.fillWeeklyCounts();
    } else if (this.period === 'Daily') {
      this.fillDailyCounts();
    }
  }

  fillDataOnPeriodChange(_eventtype) {
    let d = new Date();
    let from;
    let to;
    console.log(from, to);
    if (this.period === 'Yearly') {
      from = '1-Jan-' + d.getFullYear();
      to = '31-Dec-' + d.getFullYear();
    } else if (this.period === 'Monthly') {
      from = '1-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      to = '31-' + this.months[d.getMonth()] + '-' + d.getFullYear();
    } else if (this.period === 'Weekly') {
      var diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
      from = new Date(d.setDate(diff));
      var lastday = d.getDate() - (d.getDay() - 1) + 6;
      to = new Date(d.setDate(lastday));
    } else if (this.period === 'Daily') {
      from =
        d.getDate() + '-' + this.months[d.getMonth()] + '-' + d.getFullYear();
      to =
        d.getDate() + '-' + this.months[d.getMonth()] + '-' + d.getFullYear();
    }
    // this.cas.GetEventCalendarDetails(eventtype, from, to, home).subscribe(res => {
    //   if (res.length !== 0) {
    //     if (res.FinIQResponseHeader.Status === "Succeed") {
    //       this.eventData = [];
    //       console.log(res.EventCalendarResponseBody.EventCalendarResponse);
    //       this.eventData = res.EventCalendarResponseBody.EventCalendarResponse;
    //       this.loadingComplete = true;
    //     } else {
    //       this.loadingComplete = true;
    //       this.errorFlag = true;

    //     }
    //   } else {
    //     this.loadingComplete = true;
    //     this.errorFlag = true;

    //   }
    // });
  }

  getMonthIndex(month) {
    // Jan ==> 0
    for (let i = 0; i <= 11; i++) {
      if (month === this.months[i].value) {
        return i;
      }
    }
  }

  formatMonth(mm) {
    // console.log('Format Month: ', mm);
    return this.months[mm - 1].value;
  }

  formatDate(date) {
    // console.log('Format Date:', date);

    date = date.split(' ')[0];
    date =
      '' +
      date.split('/')[1] +
      '-' +
      this.formatMonth(date.split('/')[0]) +
      '-' +
      date.split('/')[2];
    return date;
  }

  // Left Arrow Click -> Change current year/month/week to previous one
  down(filterType) {
    if (this.loadingComplete) {
      if (filterType === 'Yearly') {
        this.base = this.base - 10; // for down select previous 10 years period
        // console.log('Base:', this.base);
        this.parent = '' + this.base + ' - ' + (this.base + 9);
        this.yearIndex = 9;
        this.fillData('Yearly', this.yearIndex);
        this.fillYearlyCounts();
      } else if (filterType === 'Monthly') {
        this.selectedYear = parseInt(this.selectedYear, 10) - 1;
        this.parent = this.parent - 1;
        this.fillData('Monthly', this.monthIndex);
        this.fillMonthlyCounts();
      } else if (filterType === 'Weekly') {
        let index = this.getMonthIndex(this.selectedMonth);
        // console.log('Weekly Index: ', index);
        if (index === 0) {
          this.selectedMonth = 'Dec';
          index = this.getMonthIndex(this.selectedMonth);
          this.selectedYear = this.selectedYear - 1; // for Jan go to previous year
        } else {
          this.selectedMonth = this.months[index - 1].value;
          // console.log('Testing selected month down: ', this.selectedMonth);
        }
        this.parent = this.selectedMonth + ', ' + this.selectedYear;
        this.weekIndex = 3;
        this.fillData('Weekly', this.weekIndex);
        this.fillWeeklyCounts();
      } else if (filterType === 'Daily') {
        if (this.selectedDay < 9) {
          this.setCurrentMonthLastDay();
          this.selectedDay = this.currentMonthLastDay; // go to previous month's last week
          this.down('Weekly'); // change month by one
        } else {
          this.selectedDay = this.selectedDay - 8;
        }
        this.setParent('Daily');
        this.dayIndex = (this.selectedDay % 8) - 1;

        if (this.weekNo <= 3) {
          // for first three weeks down will open last tab by default
          this.fillData('Daily', 7);
        } else {
          // for last week, open tab according to that month's last day
          this.fillData('Daily', (this.currentMonthLastDay % 8) - 1);
        }

        this.fillDailyCounts();
        this.changeParent(this.selectedMonth);
      }

      this.setCalendarRows();
      this.setCurrentMonthLastDay();
      // console.log('Current Month down:', this.selectedMonth);

      this.yearIndex = 9;
      this.monthIndex = 11;
      this.weekIndex = 3;
      this.dayIndex = 7;
      // If period changes, generate graph for updated data
      if (this.showGraph) {
        this.drawPieChart();
      }
    }
  } // END DOWN

  // Right Arrow Click -> Change current year/month/week to next one
  up(filterType) {
    if (this.loadingComplete) {
      this.yearIndex = 0;
      this.monthIndex = 0;
      this.weekIndex = 0;
      this.dayIndex = 0;
      if (filterType === 'Yearly') {
        this.base = this.base + 10; // for up select next 10 years period
        this.parent = '' + this.base + ' - ' + (this.base + 9);
        this.fillData('Yearly', 0);
        this.fillYearlyCounts();
      } else if (filterType === 'Monthly') {
        this.selectedYear = parseInt(this.selectedYear, 10) + 1;
        this.parent = parseInt(this.parent, 10) + 1;
        // console.log('month index:', this.monthIndex);
        this.fillData('Monthly', this.monthIndex);
        this.fillMonthlyCounts();
      } else if (filterType === 'Weekly') {
        let index = this.getMonthIndex(this.selectedMonth);
        if (index === 11) {
          this.selectedMonth = 'Jan';
          index = this.getMonthIndex(this.selectedMonth);
          this.selectedYear = parseInt(this.selectedYear, 10) + 1; // for Dec go to Next year
        } else {
          this.selectedMonth = this.months[index + 1].value;
          // console.log('Testing selected month up: ', this.selectedMonth);
        }
        this.parent = this.selectedMonth + ', ' + this.selectedYear;
        this.fillData('Weekly', this.weekIndex);
        this.fillWeeklyCounts();
      } else if (filterType === 'Daily') {
        // console.log('*******===>', this.selectedDay);
        if (this.selectedDay >= 25) {
          this.selectedDay = 1; // go to next month's first week
          this.up('Weekly'); // change month by one
        } else {
          this.selectedDay = parseInt(this.selectedDay, 10) + 8;
        }
        this.setParent('Daily');
        this.dayIndex = 0;
        this.tempTabNum = (this.weekNo - 1) * 8 + 1;
        // console.log('tempTab:', this.tempTabNum);
        // this.fillData('Daily', this.tempTabNum);
        this.fillData('Daily', this.dayIndex);
        this.fillDailyCounts();
        this.changeParent(this.selectedMonth);
      }

      this.setCalendarRows();
      this.setCurrentMonthLastDay();
      if (this.showGraph) {
        this.drawPieChart();
      }
      // console.log('Current Month:', this.selectedMonth);
    }
  } // END UP

  getAndFillData(from, to) {
    this.loadingComplete = false;
    console.log(this.eventtype);
    this.getAPIDataService
      .getDataFromAPI(from, to, this.eventtype, this.CustomerID)
      .subscribe(
        (res) => {
          this.loadingComplete = true;
          this.eventNames.clear();
          this.assets.clear();
          this.assetsCounts = [];
          this.eventNamesCounts = [];
          // console.log('API Response (Data):');
          if (res === null) {
            this.errorFlag = true;
            return 0;
          }
          if (this.eventtype === 'CA') {
            this.apiData = res.ReadAllProductAllEvent_CAResult;
            // console.log(this.apiData);
            for (const data of this.apiData) {
              if (data.Announcement_Date !== '') {
                data.Announcement_Date = this.formatDate(
                  data.Announcement_Date
                );
              }
              if (data.Record_Date !== '') {
                data.Record_Date = this.formatDate(data.Record_Date);
              }
              if (data.Response_Date !== '') {
                data.Response_Date = this.formatDate(data.Response_Date);
              }

              // fill data into a set to get unique names (for graph generation)
              this.eventNames.add(data.Template_Name);
              this.assets.add(data.Asset);
            }
            this.apiData.sort((a, b) =>
              a.Note_Master_Id < b.Note_Master_Id ? 1 : -1
            ); // sort bonds according to product id
            for (const eventName of this.eventNames) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (eventName === data.Template_Name) {
                  cnt++;
                }
              }
              this.eventNamesCounts.push(cnt);
            }
            for (const asset of this.assets) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (asset === data.Asset) {
                  cnt++;
                }
              }
              this.assetsCounts.push(cnt);
            }
          } else if (this.eventtype === 'UM') {
            this.apiData = res;
            for (const data of this.apiData) {
              if (data.Maturity_Date !== '') {
                data.Maturity_Date = moment(
                  this.formatDate(data.Maturity_Date),
                  'DD-MMM-YYYY'
                ).format('DD-MM-YYYY');
              }
              if (data.Trade_Date !== '') {
                data.Trade_Date = moment(
                  this.formatDate(data.Trade_Date),
                  'DD-MMM-YYYY'
                ).format('DD-MM-YYYY');
              }

              // fill data into a set to get unique names (for graph generation)
              this.eventNames.add(data.Product_Type);
              this.assets.add(data.Investment_Amount);
            }
            this.apiData.sort((a, b) =>
              Date.parse(a.Maturity_Date) > Date.parse(b.Maturity_Date) ? 1 : -1
            );
            for (const eventName of this.eventNames) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (eventName === data.Product_Type) {
                  cnt++;
                }
              }
              this.eventNamesCounts.push(cnt);
            }

            for (const asset of this.assets) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (asset === data.Investment_Amount) {
                  cnt++;
                }
              }
              this.assetsCounts.push(cnt);
            }
          } else if (this.eventtype === 'UC') {
            this.apiData = res;
            for (const data of this.apiData) {
              if (data.RS_Schedule_Date !== '') {
                data.RS_Schedule_Date = moment(
                  this.formatDate(data.Maturity_Date),
                  'DD-MMM-YYYY'
                ).format('DD-MM-YYYY');
              }
              // fill data into a set to get unique names (for graph generation)
              this.eventNames.add(data.Scheme_Code);
              this.assets.add(data.Note_Ccy);
            }
            this.apiData.sort((a, b) =>
              Date.parse(a.RS_Schedule_Date) > Date.parse(b.RS_Schedule_Date)
                ? 1
                : -1
            );
            for (const eventName of this.eventNames) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (eventName === data.Scheme_Code) {
                  cnt++;
                }
              }
              this.eventNamesCounts.push(cnt);
            }
            for (const asset of this.assets) {
              let cnt = 0;
              for (const data of this.apiData) {
                if (asset === data.Note_Ccy) {
                  cnt++;
                }
              }
              this.assetsCounts.push(cnt);
            }
          }
          // console.log('Event Names:', this.eventNames);
          // -------------------SORT BY RECORD DATE AND FOR SECOND LEVEL BY PRODUCT ID----------------------------
          // eslint-disable-next-line max-len
          // sort bonds according to record date
          // console.log(this.apiData);

          // getting counts of unique events names and assets to generate graph

          // console.log('Counts->', this.eventNamesCounts, this.assetsCounts);
          this.loadingComplete = true;
          this.errorFlag = false;
          this.drawPieChart();
        },
        (_err) => {
          // console.log('Error while fetching data from API!');
          this.errorFlag = true;
        }
      );
  }

  getDataCount(filterType, from, to, i) {
    console.log(to, from, i, filterType);
    this.getAPIDataService
      .getCountFromAPI(from, to, this.eventtype, this.CustomerID)
      .subscribe(
        (res) => {
          // console.log('API Response (Count):', res);
          //  this.recordsCount = res.CountProductAllEvent_CAResult;
          //  return this.recordsCount;
          // return res.CountProductAllEvent_CAResult;
          if (res === null) {
            this.errorFlagCount = true;
            return 0;
          } else {
            if (filterType === 'Yearly') {
              this.yearlyCounts[i] =
                this.eventtype === 'CA'
                  ? res.CountProductAllEvent_CAResult
                  : res;
            } else if (filterType === 'Monthly') {
              this.monthlyCounts[i] =
                this.eventtype === 'CA'
                  ? res.CountProductAllEvent_CAResult
                  : res;
            } else if (filterType === 'Weekly') {
              this.weeklyCounts[i] =
                this.eventtype === 'CA'
                  ? res.CountProductAllEvent_CAResult
                  : res;
            } else if (filterType === 'Daily') {
              const pos = (parseInt(from.split('-')[0], 10) % 8) - 1;
              // console.log('from daily->', from, pos, res.CountProductAllEvent_CAResult);
              this.dailyCounts[pos] =
                this.eventtype === 'CA'
                  ? res.CountProductAllEvent_CAResult
                  : res;
            }
            this.errorFlagCount = false;
          }
        },
        (_err) => {
          // console.log('Error while fetching count from API!');
          this.errorFlagCount = true;
          return 0;
        }
      );
  }

  fillYearlyCounts() {
    for (let i = 0; i < 10; i++) {
      // console.log('check:', this.base+i , this.base+ i);
      const from = '1-Jan-' + parseInt(this.base + i);
      const to = '31-Dec-' + parseInt(this.base + i);
      // console.log('check:', from, to);
      // this.yearlyCounts[i] = this.getDataCount(from, to );
      this.getDataCount('Yearly', from, to, i);
      // console.log('yearlyCounts: ', this.yearlyCounts[i]);
    }
  }

  fillMonthlyCounts() {
    for (let i = 0; i < 12; i++) {
      // console.log('check:', this.base+i , this.base+ i);
      const from = '1-' + this.months[i].value + '-' + this.selectedYear;
      const to =
        this.months[i].lastDay +
        '-' +
        this.months[i].value +
        '-' +
        this.selectedYear;
      // console.log('check:', from, to);
      // this.yearlyCounts[i] = this.getDataCount(from, to );
      this.getDataCount('Monthly', from, to, i);
      // console.log('monthlyCounts: ', this.monthlyCounts[i]);
    }
  }

  fillWeeklyCounts() {
    for (let i = 0; i < 3; i++) {
      // console.log('check:', this.base+i , this.base+ i);
      const from =
        1 + i * 8 + '-' + this.selectedMonth + '-' + this.selectedYear;
      const to = 8 + i * 8 + '-' + this.selectedMonth + '-' + this.selectedYear;
      // console.log('check:', from, to);
      // this.yearlyCounts[i] = this.getDataCount(from, to );
      this.getDataCount('Weekly', from, to, i);
      // console.log('weeklyCounts: ', this.weeklyCounts[i]);
    }

    // Getting counts for last week, as last week may contain different no. of days
    const from = '25-' + this.selectedMonth + '-' + this.selectedYear;
    let to: any;
    for (let i = 0; i < 12; i++) {
      if (this.months[i].value === this.selectedMonth) {
        to =
          this.months[i].lastDay +
          '-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
      }
    }
    // console.log('check:', from, to);
    this.getDataCount('Weekly', from, to, 3);
    // console.log('weeklyCounts: ', this.weeklyCounts[3]);
  }

  fillDailyCounts() {
    // this.dailyCounts=[];
    for (let i = 1; i <= 8 && this.weekNo <= 3; i++) {
      // console.log('Selected Week: ', this.weekNo, i);
      const from =
        i +
        (this.weekNo - 1) * 8 +
        '-' +
        this.selectedMonth +
        '-' +
        this.selectedYear;
      const to =
        i +
        (this.weekNo - 1) * 8 +
        '-' +
        this.selectedMonth +
        '-' +
        this.selectedYear;
      // console.log('check:', from, to);
      this.getDataCount('Daily', from, to, i);
      // console.log('dailyCounts: ', this.dailyCounts);
    }

    // For last week, the days can be different
    if (this.weekNo === 4) {
      let lastDay: any;
      for (let i = 0; i < 12; i++) {
        if (this.months[i].value === this.selectedMonth) {
          lastDay = this.months[i].lastDay;
        }
      }
      // console.log('**********************************');
      this.lastWeekDays = [];
      for (let i = 25; i <= lastDay; i++) {
        this.lastWeekDays.push(i);
        // console.log('Selected Week: ', this.weekNo, i);
        const from = i + '-' + this.selectedMonth + '-' + this.selectedYear;
        const to = i + '-' + this.selectedMonth + '-' + this.selectedYear;
        // console.log('check:', from, to);
        this.getDataCount('Daily', from, to, i % 8);
        // console.log('dailyCounts: ', this.dailyCounts);
      }
      // console.log('last week days array->', this.lastWeekDays);
    }
  }

  fillData(filterType, tabNo) {
    console.log('Fill data', filterType, tabNo);
    this.currentTabIndex = tabNo;
    let from: any;
    let to: any;
    let d: any;
    if (filterType === 'Yearly') {
      this.yearIndex = tabNo;
      // console.log('Year Index: ', tabNo);
      // console.log('Fill data yearly', tabNo, this.base);
      from = '1-Jan-' + (parseInt(this.base, 10) + tabNo);
      to = '31-Dec-' + (parseInt(this.base, 10) + tabNo);
      // console.log('From-To:', from, to);
      this.getAndFillData(from, to);
      // this.yearIndex = tabNo;
      this.selectedTabNo = tabNo; // updating selected tab
    } else if (filterType === 'Monthly') {
      this.monthIndex = tabNo;

      this.checkLeapYear();

      // console.log('Fill data monthly');
      this.selectedMonth = this.months[tabNo].value;
      from = '1-' + this.selectedMonth + '-' + this.selectedYear;
      to =
        this.months[tabNo].lastDay +
        '-' +
        this.selectedMonth +
        '-' +
        this.selectedYear;
      // console.log('From-To:', from, to);
      this.getAndFillData(from, to);
      this.monthIndex = tabNo;
      this.selectedTabNo = tabNo; // updating selected tab
    } else if (filterType === 'Weekly') {
      this.weekIndex = tabNo;
      // console.log('Fill data weekly', tabNo);
      if (tabNo === 0) {
        from = '1-' + this.selectedMonth + '-' + this.selectedYear;
        to = '8-' + this.selectedMonth + '-' + this.selectedYear;
      } else if (tabNo === 1) {
        from = '9-' + this.selectedMonth + '-' + this.selectedYear;
        to = '16-' + this.selectedMonth + '-' + this.selectedYear;
      } else if (tabNo === 2) {
        from = '17-' + this.selectedMonth + '-' + this.selectedYear;
        to = '24-' + this.selectedMonth + '-' + this.selectedYear;
      } else if (tabNo === 3) {
        from = '25-' + this.selectedMonth + '-' + this.selectedYear;
        const ind = this.getMonthIndex(this.selectedMonth);
        to =
          this.months[ind].lastDay +
          '-' +
          this.selectedMonth +
          '-' +
          this.selectedYear;
        // to = '31-'+this.selectedMonth+'-'+this.selectedYear;
      }
      // console.log(from, to);
      this.getAndFillData(from, to);
      this.weekIndex = tabNo;
      this.selectedTabNo = tabNo; // updating selected tab
    } else if (filterType === 'Daily') {
      this.dayIndex = tabNo;
      // console.log('Fill data daily');
      const first = this.selectedWeek.split(' to ')[0]; // 01-Dec-2019 to 08-Dec-2019 ==> ["01-Dec-2019", "08-Dec-2019"]
      // console.log('First: ', first);
      if (first.split('-')[0].includes('01')) {
        // 1 to 8
        d = 1 + parseInt(tabNo, 10);
        from = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        to = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        // console.log(from, to);
      } else if (first.split('-')[0].includes('09')) {
        // 9 to 16
        d = 9 + parseInt(tabNo, 10);
        from = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        to = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        // console.log(from, to);
      } else if (first.split('-')[0].includes('25')) {
        // 25 to last
        // console.log('tabNo: ', tabNo);
        d = 25 + parseInt(tabNo, 10);
        from = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        to = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        // console.log(from, to);
      } else {
        d = 17 + parseInt(tabNo, 10); // else 17 to 24
        from = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        to = d + '-' + this.selectedMonth + '-' + this.selectedYear;
        // console.log(from, to);
      }
      this.getAndFillData(from, to);
      this.dayIndex = tabNo;
      this.selectedTabNo = tabNo; // updating selected tab
    }
  }

  // Function to convert table data into excel file
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
}
