import { ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { Subscription } from 'rxjs';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from '../../../services/common-api.service';
declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-ca-evenet-diary',
  templateUrl: './ca-evenet-diary.component.html',
  styleUrls: ['./ca-evenet-diary.component.scss'],
})
export class CAEvenetDiaryComponent implements OnInit, OnDestroy {
  fromDate = '';
  toDate = '';
  isProd = environment.production;
  Years: any;
  collateralChartTitle = '';
  collateralChartType = 'PieChart';
  collateralChartData = [] as any;
  selectedCustomerDetails: any = [];
  template = 'All';
  type = '';
  collateralChartColumnNames = ['Event', 'Event count'];
  collateralChartOptions = {
    is3D: true,
    legendTextStyle: { fontSize: 12 },
    width: 600,
    height: 400,
    pieSliceText: 'value',
    pieSliceBorderColor: 'transparent',
    backgroundColor: { fill: 'transparent' },
    colors: [
      '#9BD4F5',
      '#3895D3',
      '#6CC4EE',
      '#0C426E',
      '#1261A0',
      '#24a8f0',
      '#9BD4F6',
      '#3895D4',
      '#6CC4E1',
      '#0C4261',
      '#1261A1',
    ],
    chartArea: {
      left: '20%',
      top: '30%',
      height: '100%',
      width: '100%',
    },
    tooltip: {
      textStyle: {
        color: '#887f76',
        bold: false,
      },
      // ignoreBounds: true
    },
    pieHole: 0.5,
    legend: 'top',
  };
  noteMasterID: any;
  customerID: any;
  customerSelected: any;
  p: any;
  shareList: any;
  details: any;
  showShareDetails: boolean;
  search: string;
  security: any = '';
  com: any;
  selectedBIndex: number;
  showSuggestions: boolean;
  NoteMasterId: any;
  Event: any;
  viewBy: string;
  eventTypeSelected: string = "User Facing";
  // public chartClicked(e: any): void {
  //   // console.log(e);?
  // }

  // public chartHovered(e: any): void {
  //   // console.log(e);
  // }

  // month: any;
  // year: any;
  eventNames = [] as any;
  clientResponsePending = [] as any;
  getCountPerDay: any;
  AllProductEventCA = [] as any;
  counts = [];
  count: any;
  currentDate: any;
  allEvents = [] as any;
  today: string;

  currentDate1: Date;
  selectedMonth: any = 0;
  selectedYear: any;
  selectedDate: any;
  Dates: any;
  currentYear: any;
  currentMonth: any;
  activeMonth: any;
  activeYear: any;

  showDetails = [false, false, false, false, false];

  Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  noDataFlag = false;
  EventCounts = new Array();
  month: any;
  year: any;
  events = [] as any;
  firstDay: Date;
  lastDay: Date;
  chartlables = [];
  allData = [] as any;
  // selectedMonth = new Date().getMonth();
  // selectedYear = new Date().getFullYear();
  IsLoading = true;
  allCAData: Subscription;
  dayOne = '';
  dayLast = '';
  eventArray: any[] = [];
  eventType: any[] = ["User Facing", "Daily"];
  ProductName;
  SchemeCode: any;
  EventName: any;
  EntityID: any;
  FromDate: any;
  ToDate: any;
  ProductID: any;
  strSelectedEventName: any;
  Frequency: any;
  CboDailyValue: any;
  CboDealValue: any;
  Processed: any;
  strEventgrouping: any;
  chkLauchedProdState: any;
  EventNameActual: any;
  cboShowEvents: any;
  cboIssuer: any;
  sendEmail: any;
  cboTemplate: any;
  Str_Event_Group_Name: any = 'Y';
  cboRM: any;
  cboCustid: any;
  ViewBy: any;
  FacDesc: any;
  oEventList: any;
  oGroupEvent: any;
  countArray: any;
  checked: boolean = false;
  customerIDText: string;
  showfilter: boolean = false;
  constructor(
    public api: WorkflowApiService,
    public elem: ElementRef,
    private cfs: CustomerApiService,
    public homeApi: HomeApiService,
    public datepipe: DatePipe,
    public location: Location,
    private Auth: AuthService,
    public comm: CommonApiService,
    public ref: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    // this.allCAData.unsubscribe();
    this.chartlables = [];
    this.allData = [];
    this.counts = [];
  }
  ngOnInit() {
    try {
      const date = new Date();
      this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      this.lastDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // console.log('setEventCount', this.firstDay, this.lastDay);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const moment = require('moment');
      this.dayOne =
        new Date(moment(this.firstDay)).getDate() +
        '-' +
        months[new Date(moment(this.firstDay)).getMonth()] +
        '-' +
        new Date(moment(this.firstDay)).getFullYear();
      this.dayLast =
        new Date(moment(this.lastDay)).getDate() +
        '-' +
        months[new Date(moment(this.lastDay)).getMonth()] +
        '-' +
        new Date(moment(this.lastDay)).getFullYear();
      // console.log('days one and last day for per day', dayOne, dayLast);
      const d = new Date();
      this.selectedYear = d.getFullYear();
      this.selectedMonth = d.getMonth();
      this.counts = [];
      // this.customerID = this.homeApi.CustomerId;
      this.customerID = 'All';
      // this.customerID = this.homeApi.CustomerId;
      // console.log('cid', this.customerID);
      this.viewBy = 'Schedule';
      this.api.GetShareList('');
      this.ProductName = 'All';
      this.SchemeCode = 'All';
      this.ProductID = '';
      this.strSelectedEventName = '';
      this.Frequency = 'All';
      this.CboDailyValue = 'Include';
      this.CboDealValue = 'Include';
      this.Processed = 'All';
      this.strEventgrouping = 'N';
      this.chkLauchedProdState = false;
      this.EventNameActual = '';
      this.cboShowEvents = 'All';
      this.cboIssuer = 'All';
      this.sendEmail = 'notEmaiSend';
      this.cboTemplate = 'All';
      this.Str_Event_Group_Name = 'Y';
      this.eventTypeSelected === 'User Facing'
      this.cboRM = 'All';
      this.FacDesc = '';
      this.oEventList = '';
      this.oGroupEvent = '';
      // this.cfs.GetEventName_CA();
      this.getEventCode();
      this.generateDates();
      this.emitMonth();
      this.cfs.GetEventNameCAObs.subscribe((res) => {
        if (res.length !== 0) {
          this.chartlables = [];
          res.forEach((element) => {
            if (element.Misc1 !== '') {
              this.events.push(element.Misc1);
              this.IsLoading = false;
              this.chartlables.push({ event: element.Misc1, eventCount: 0 });
            }
          });
          this.IsLoading = false;
        } else {
          this.IsLoading = true;
        }
      });
      // this.generateDates();
      // this.GetAllProductAllEvent_CA();
      const that = this;
      this.api.sharelistObserver.subscribe((res: any) => {
        if (res?.length !== 0) {
          this.shareList = res;
        }
      });
      this.api.shareDetailsObserver.subscribe((res: any) => {
        if (res?.length !== 0) {
          that.details = res.ProductDetails;
          if (this.shareList.length) {
            that.showShareDetails = true;
            that.search = '';
            that.shareList = [];
            that.shareList.length = 0;
            this.search = that.details.Product_Name;
            this.security = that.details.Feedcode;
          }
        }
      });
    } catch (error) {}

    // this.cfs.CountProductAllEvent_CAObs.subscribe(res => {
    //   if (res) {
    //     this.counts.push({'date':Number(res.date.split('-')[0]),'count':Number(res.count)});
    //     // console.log(this.counts);
    //     res= '';
    //   }
    //   else this.IsLoading = true;
    // });

    // this.cfs.CountPerDay_Obs.subscribe((res) => {
    //   if (res.length !== 0) {
    //     this.counts = res;
    //   }
    //   this.counts.forEach((ele) => {
    //     ele.DateNumber = Number(ele.Date.split('/')[1]);
    //     ele.month = new Date(ele.Date).getMonth();
    //     ele.year = new Date(ele.Date).getFullYear();
    //     ele.Date = ele.Date;
    //   });
    //   let temp = [];
    //   this.counts.forEach(element => {
    //     if (this.selectedYear === element.year && this.selectedMonth === element.month) {
    //       temp.push({
    //         element
    //       })
    //     }
    //   });
    //   console.log('latest counts', this.counts)
    //   console.log('temp counts', temp);
    // });

    this.cfs.GetClientResponsePendingObs.subscribe((res) => {
      if (res.length !== 0) {
        this.clientResponsePending = res;
        this.IsLoading = false;
      } else {
        this.IsLoading = true;
      }
    });

    this.allCAData = this.cfs.ReadAllProductAllEvent_CAObs.subscribe((res) => {
      if (res.length !== 0) {
        this.noDataFlag = false;
        this.IsLoading = true;
        this.AllProductEventCA = res.ReadAllProductAllEvent_CAResult;
        console.log('data in one length', this.AllProductEventCA);
        if (this.AllProductEventCA.length !== 0) {
          this.noDataFlag = false;
          this.allData = this.AllProductEventCA;
          for (let i = 0; i < this.allData.length; i++) {
            this.chartlables.forEach((ele) => {
              if (ele.event === this.allData[i].Template_Name) {
                ele.eventCount++;
              }
            });
          }
          this.collateralChartData = this.chartlables.map((d: any) => {
            return [d.event, d.eventCount];
          });
          console.log('chart lables', this.chartlables);
          this.chartlables.forEach((ele) => {
            ele.eventCount = 0;
          });
          this.IsLoading = false;
        } else {
          this.noDataFlag = true;
        }
      } else {
        this.IsLoading = true;
        this.noDataFlag = true;
      }
    });
  }

  generateDates() {
    this.Dates = new Array();
    const firstIndex = this.getFirstDayOfMonth(
      this.selectedMonth,
      this.selectedYear
    );
    // console.log('generateDates', this.selectedMonth, this.selectedYear);
    for (let i = 0; i < firstIndex; i++) {
      this.Dates.push(0);
    }
    for (
      let day = 0;
      day <
      this.getDaysInMonth(
        parseInt(this.selectedMonth + '', 10) + 1,
        this.selectedYear
      );
      day++
    ) {
      this.Dates.push(day + 1);
    }
    const maxIndex =
      this.Dates.length % 7 > 0
        ? this.Dates.length + 7 - (this.Dates.length % 7)
        : 0;
    for (let i = this.Dates.length; i < maxIndex; i++) {
      this.Dates.push(0);
    }
    this.setEventCount(this.selectedMonth, this.selectedYear);
    // this.changeView(this.viewBy)
    // this.GetAllProductAllEvent_CA();
  }

  // getReadAllProductAllEvent_CA(value, security, customerID, viewBy, dayOne, dayLast, template) {
  //   try {
  //     this.noDataFlag = true;
  //     this.cfs.ReadAllProductAllEvent_CA(
  //       value,
  //       security,
  //       customerID,
  //       viewBy,
  //       dayOne,
  //       dayLast,
  //       template
  //     ).subscribe(res => {

  //       if (res.length !== 0) {
  //         this.noDataFlag = false;
  //         this.AllProductEventCA = [];
  //         this.allData = [];
  //         this.AllProductEventCA = res.ReadAllProductAllEvent_CAResult;
  //         // console.log('data in one length', this.AllProductEventCA);
  //         if (this.AllProductEventCA.length !== 0) {
  //           this.noDataFlag = false;
  //           this.allData = this.AllProductEventCA;
  //           for (let i = 0; i < this.allData.length; i++) {
  //             this.chartlables.forEach((ele) => {
  //               if (ele.event === this.allData[i].Template_Name) {
  //                 ele.eventCount++;
  //               }
  //             });
  //           }
  //           // this.collateralChartData = this.chartlables.map((d: any) => {
  //           //   return [d.event, d.eventCount];
  //           // });
  //           this.collateralChartData = [];
  //           this.chartlables.forEach((element) => {
  //             this.collateralChartData.push({
  //               title: element.event,
  //               value: parseInt(element.eventCount || 0, 10),
  //             });
  //           })
  //           console.log('chart lables', this.collateralChartData);
  //           this.chartlables.forEach((ele) => {
  //             ele.eventCount = 0;
  //           });
  //           this.IsLoading = false;
  //         } else {
  //           // this.noDataFlag = true;
  //         }
  //       } else {
  //         this.IsLoading = true;
  //         this.noDataFlag = true;
  //       }
  //     })
  //   } catch (error) {

  //   }
  // }

  getReadAllProductAllEvent_activeDate(
    _value,
    _security,
    customerID,
    viewBy,
    dayOne,
    dayLast,
    template
  ) {
    try {
      this.p = 1;
      this.noDataFlag = true;
      this.cfs
        .ReadAllProductAllEvent(
          this.ProductName,
          this.SchemeCode,
          template,
          this.Auth.EntityID,
          dayOne,
          dayLast,
          this.ProductID,
          this.strSelectedEventName,
          this.Frequency,
          this.CboDailyValue,
          this.CboDealValue,
          this.Processed,
          this.strEventgrouping,
          this.chkLauchedProdState,
          this.EventNameActual,
          this.cboShowEvents,
          this.cboIssuer,
          this.sendEmail,
          this.cboTemplate,
          this.Str_Event_Group_Name,
          this.cboRM,
          customerID,
          viewBy,
          this.FacDesc,
          this.oEventList,
          this.oGroupEvent
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            this.noDataFlag = false;
            this.AllProductEventCA = [];
            this.allData = [];
            this.chartlables = [];
            this.AllProductEventCA = res.ReadAllProductAllEventResult;
            // this.counts = [];
            console.log('data in one length', this.AllProductEventCA);
            if (this.AllProductEventCA.length !== 0) {
              this.noDataFlag = false;
              this.allData = this.AllProductEventCA;
              for (let i = 0; i < this.AllProductEventCA.length; i++) {
                this.AllProductEventCA[i].sdate =
                  this.comm.getLocalDateFromEpochDate(
                    this.AllProductEventCA[i].RS_Schedule_Date
                  );
                this.AllProductEventCA[i].pdate =
                  this.comm.getLocalDateFromEpochDate(
                    this.AllProductEventCA[i].RS_Schedule_PreDate
                  );
                this.chartlables.push({ event: this.AllProductEventCA[i].Event_Name, eventCount: 0 });
                if (this.AllProductEventCA[i].RS_Status === '') {
                  this.AllProductEventCA[i].status = 'Pending';
                } else {
                  this.AllProductEventCA[i].status = 'Processed';
                }
              }

              this.collateralChartData = [];
              this.chartlables = []

              // const eventType = [
              //   ...new Set(this.AllProductEventCA.map((e) => e.Event_Name)),
              // ];

              const templateType = [
                ...new Set(this.AllProductEventCA.map((e) => e.Event_Name)),
              ];

              templateType.forEach((element) => {
                this.chartlables.push({ event: element, eventCount: 0 });
              });

              for (let i = 0; i < this.allData.length; i++) {
                this.chartlables.forEach((ele) => {
                  if (ele.event === this.allData[i].Event_Name) {
                    ele.eventCount++;
                  }
                });
              }
              this.chartlables.forEach((element) => {
                this.collateralChartData.push({
                  title: element.event,
                  value: parseInt(element.eventCount || 0),
                });
              });
              console.log('chart lables', this.chartlables);
              // console.log('chart lables', this.collateralChartData);
              this.chartlables.forEach((ele) => {
                ele.eventCount = 0;
              });
              // console.log('AllProductEventCA', this.AllProductEventCA);
              this.sortData();

              this.IsLoading = false;
              // this.getEventCount();
            } else {
              // this.noDataFlag = true;
            }
          } else {
            this.IsLoading = true;
            this.noDataFlag = true;
          }
        });
    } catch (error) {}
  }

  getReadAllProductAllEvent_CA(
    _value,
    _security,
    customerID,
    viewBy,
    dayOne,
    dayLast,
    template,
    strEvent
  ) {
    try {
      this.p = 1;
      this.noDataFlag = true;
      this.cfs
        .ReadAllProductAllEvent(
          this.ProductName,
          this.SchemeCode,
          template,
          this.Auth.EntityID,
          dayOne,
          dayLast,
          this.ProductID,
          this.strSelectedEventName,
          this.Frequency,
          this.CboDailyValue,
          this.CboDealValue,
          this.Processed,
          this.strEventgrouping,
          this.chkLauchedProdState,
          this.EventNameActual,
          this.cboShowEvents,
          this.cboIssuer,
          this.sendEmail,
          this.cboTemplate,
          strEvent,
          this.cboRM,
          customerID,
          viewBy,
          this.FacDesc,
          this.oEventList,
          this.oGroupEvent
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            this.noDataFlag = false;
            this.AllProductEventCA = [];
            this.allData = [];
            this.chartlables = [];
            this.AllProductEventCA = res.ReadAllProductAllEventResult;
            // this.counts = [];
            // console.log('data in one length', this.AllProductEventCA);
            if (this.AllProductEventCA.length !== 0) {
              this.noDataFlag = false;
              this.allData = this.AllProductEventCA;
              for (let i = 0; i < this.AllProductEventCA.length; i++) {
                this.AllProductEventCA[i].sdate =
                  this.comm.getLocalDateFromEpochDate(
                    this.AllProductEventCA[i].RS_Schedule_Date
                  );
                this.AllProductEventCA[i].pdate =
                  this.comm.getLocalDateFromEpochDate(
                    this.AllProductEventCA[i].RS_Schedule_PreDate
                  );
                if (this.AllProductEventCA[i].RS_Status === '') {
                  this.AllProductEventCA[i].status = 'Pending';
                } else {
                  this.AllProductEventCA[i].status = 'Processed';
                }
                // this.chartlables.push({ event: this.AllProductEventCA[i].Event_Name, eventCount: 0 });
              }
              this.collateralChartData = [];
              
              const eventType = [
                ...new Set(this.AllProductEventCA.map((e) => e.status)),
              ];

              // eventType.forEach((element) => {
              //   this.chartlables.push({ event: element, eventCount: 0 });
              // });

              const templateType = [
                ...new Set(this.AllProductEventCA.map((e) => e.Event_Name)),
              ];

              templateType.forEach((element) => {
                this.chartlables.push({ event: element, eventCount: 0 });
              });

              for (let i = 0; i < this.allData.length; i++) {
                this.chartlables.forEach((ele) => {
                  if (ele.event === this.allData[i].Event_Name) {
                    ele.eventCount++;
                  }
                });
              }
              this.chartlables.forEach((element) => {
                this.collateralChartData.push({
                  title: element.event,
                  value: parseInt(element.eventCount || 0),
                });
              });
              console.log('chart lables', this.chartlables);
              // console.log('chart lables', this.collateralChartData);
              this.chartlables.forEach((ele) => {
                ele.eventCount = 0;
              });
              this.IsLoading = false;
              this.getEventCount();
              this.sortData();
            } else {
              // this.noDataFlag = true;
            }
          } else {
            this.IsLoading = true;
            this.noDataFlag = true;
          }
        });
    } catch (error) {}
  }

  getEventCount() {
    try {
      let tempData = this.AllProductEventCA;
      let allocTypes: any[] = [];
      // this.counts = this.AllProductEventCA;
      this.counts = [];
      if (this.viewBy === 'Schedule') {
        allocTypes = [
          ...new Set(
            tempData.map((e) =>
              this.datepipe.transform(new Date(e.sdate), 'dd-MMM-yyyy')
            )
          ),
        ];
      } else if (this.viewBy === 'Payment') {
        allocTypes = [
          ...new Set(
            tempData.map((e) =>
              this.datepipe.transform(new Date(e.pdate), 'dd-MMM-yyyy')
            )
          ),
        ];
      }

      // console.log("allocTypes", allocTypes);
      allocTypes.forEach((element) => {
        this.counts.push({
          Date: element,
          Count: 0,
          DateNumber: new Date(element).getDate(),
          month: new Date(element).getMonth(),
          year: new Date(element).getFullYear(),
        });
      });

      if (this.viewBy === 'Schedule') {
        this.counts.forEach((element) => {
          element.Count = tempData.filter((x) => {
            return (
              this.datepipe.transform(new Date(x.sdate), 'dd-MMM-yyyy') ==
              element.Date
            );
          });
        });
      } else if (this.viewBy === 'Payment') {
        this.counts.forEach((element) => {
          element.Count = tempData.filter((x) => {
            return (
              this.datepipe.transform(new Date(x.pdate), 'dd-MMM-yyyy') ==
              element.Date
            );
          });
        });
      }

      this.ref.detectChanges();

      // console.log("this.counts cc", this.counts);
      // console.log("this.counts cc", this.selectedDate, this.selectedMonth, this.selectedYear);
    } catch (error) {}
  }

  setEventCount(month, year) {
    // this.counts = [];
    this.currentDate = '';
    this.firstDay = new Date(year, Number(month), 1);
    this.lastDay = new Date(year, Number(month) + 1, 0);
    console.log('setEventCount', year, month, this.firstDay, this.lastDay);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const moment = require('moment');
    this.dayOne =
      new Date(moment(this.firstDay)).getDate() +
      '-' +
      months[new Date(moment(this.firstDay)).getMonth()] +
      '-' +
      new Date(moment(this.firstDay)).getFullYear();
    this.dayLast =
      new Date(moment(this.lastDay)).getDate() +
      '-' +
      months[new Date(moment(this.lastDay)).getMonth()] +
      '-' +
      new Date(moment(this.lastDay)).getFullYear();
    this.dayOne =
      '/Date(' + this.epoch(new Date(moment(this.firstDay))) + '+0530)/';
    this.dayLast =
      '/Date(' + this.epoch(new Date(moment(this.lastDay))) + '+0530)/';
    // this.dayLast = '\/Date(' + this.epoch(new Date(moment(this.firstDay))) + '+0530)\/';

    // this.cfs.CountPerDayEventDiary_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   this.template
    // );

    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      this.dayOne,
      this.dayLast,
      this.template,
      this.Str_Event_Group_Name
    );

    // this.cfs.ReadAllProductAllEvent_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   this.template
    // );
    // this.counts = [];
    // month = '';
    // year = '';
  }

  changeView(viewBy) {
    this.IsLoading = true;
    // this.cfs.ReadAllProductAllEvent_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   this.template
    // );

    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      viewBy,
      this.dayOne,
      this.dayLast,
      this.template,
      this.Str_Event_Group_Name
    );
    // this.cfs.CountPerDayEventDiary_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   this.template
    // );
  }

  changeEvent(event) {
    this.IsLoading = true;
    // console.log("event", event);
    let template = event.target.value;
    this.template = template;
    // console.log("template", event);

    // this.cfs.ReadAllProductAllEvent_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   template
    // );

    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      this.dayOne,
      this.dayLast,
      template,
      this.Str_Event_Group_Name
    );
    // this.cfs.CountPerDayEventDiary_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   this.dayOne,
    //   this.dayLast,
    //   this.template
    // );
  }

  changeEventType(event) {

    let eventTypeSelected = event.target.value;
    this.eventTypeSelected = eventTypeSelected;

    this.IsLoading = true;
    let str;
    if (this.eventTypeSelected === 'User Facing') this.Str_Event_Group_Name = 'Y';
    else this.Str_Event_Group_Name = 'N';
    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      this.dayOne,
      this.dayLast,
      this.template,
      this.Str_Event_Group_Name
    );

  }
  getSelectedMonth(month) {
    this.selectedMonth = parseInt(month);
    this.generateDates();
    // this.emitMonth();
  }
  getSelectedYear(year) {
    try {
      this.selectedYear = parseInt(year);
      this.generateDates();
      // this.emitMonth();
    } catch (error) {}
  }
  yearList() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 20; i <= currentYear + 20; i++) {
      this.Years.push(i);
    }
  }
  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }

  firstMonth() {
    this.selectedMonth = 0;
    this.generateDates();
  }

  lastMonth() {
    this.selectedMonth = 11;
    this.generateDates();
  }

  prevMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 12;
      this.selectedYear =
        this.selectedYear <= 1950 ? 1950 : this.selectedYear - 1;
    }
    this.selectedMonth = this.selectedMonth <= 0 ? 11 : this.selectedMonth - 1;
    this.generateDates();
    this.emitMonth();
  }

  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear =
        this.selectedYear >= 2099 ? 2099 : this.selectedYear + 1;
    } else {
      this.selectedMonth = this.selectedMonth < 0 ? 11 : this.selectedMonth + 1;
    }

    this.generateDates();
    this.emitMonth();
  }

  setMonth(month: number) {
    this.selectedMonth = month;
  }

  setYear(year: number) {
    this.selectedYear = year;
  }

  selectDate(date: any, month, year) {
    this.template = 'All';
    this.currentDate = '';
    if (date === 0) {
      return;
    }

    this.selectedDate = date;
    // console.log(this.selectedDate)
    let activeDate = date + '-' + month.substring(0, 3) + '-' + year;
    // console.log('active date', activeDate);
    // this.cfs.ReadAllProductAllEvent_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   activeDate,
    //   activeDate,
    //   this.template
    // );
    activeDate = '/Date(' + this.epoch(new Date(activeDate)) + '+0530)/';

    // this.getReadAllProductAllEvent_CA('',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   activeDate,
    //   activeDate,
    //   this.template
    // );

    this.getReadAllProductAllEvent_activeDate(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      activeDate,
      activeDate,
      this.template
    );

    // this.cfs.CountProductAllEvent_CA(
    //   '',
    //   '' ? this.security : this.security,
    //   this.customerID,
    //   this.viewBy,
    //   activeDate,
    //   activeDate,
    //   this.template
    // );
  }

  emitMonth() {
    // this.month;
    // this.counts = [];
  }

  emitYear() {
    // this.year;
    // this.counts = [];
  }

  GetClientResponsePending() {
    try {
      this.cfs.GetClientResponsePending(
        '',
        '',
        '32485',
        this.viewBy,
        '01-Nov-2020',
        '30-Nov-2020',
        'All'
      );
    } catch (error) {}
  }

  selectShareOnEnter(_e) {
    try {
      const ShareInfo = $('.HoverSuggestion').data('sharedata');
      this.selectShareOnClick(ShareInfo);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShareOnClick(NoteMasterId) {
    try {
      this.noteMasterID = NoteMasterId;
      // console.log('note master id on chnage ', NoteMasterId);
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.api.GetIndividualShareDetails(NoteMasterId);
      const selectedShare = this.shareList.filter(
        (b) => b.Note_Master_Id === NoteMasterId
      )[0];
      // this.noteMasterID= selectedShare.Note_Master_id;
      this.security = selectedShare.Feedcode;
      if (this.search.length === 0 || this.search === '') {
        this.noteMasterID = '';
        this.security = '';
      }
      // this.cfs.ReadAllProductAllEvent_CA(
      //   '',
      //   this.security,
      //   this.customerID,
      //   this.viewBy,
      //   this.dayOne,
      //   this.dayLast,
      //   this.template
      // );

      this.getReadAllProductAllEvent_CA(
        '',
        this.security,
        this.customerID,
        this.viewBy,
        this.dayOne,
        this.dayLast,
        this.template,
        this.Str_Event_Group_Name
      );
      // this.cfs.CountPerDayEventDiary_CA(
      //   '',
      //   this.security,
      //   this.customerID,
      //   this.viewBy,
      //   this.dayOne,
      //   this.dayLast,
      //   this.template
      // );
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  timeout() {
    throw new Error('Method not implemented.');
  }

  searchShare() {
    try {
      // console.log(this.search);
      const that = this;

      if (this.search.trim().length >= 2) {
        // this.rainApi.GetShareList(this.search);
        this.api.sharelistObserver.subscribe((b) => {
          // console.log(b);
          that.shareList = b
            .filter(
              (item) =>
                item.Product_Name.toLowerCase().startsWith(
                  this.search.toLowerCase()
                ) ||
                item.Feedcode.toLowerCase().startsWith(
                  this.search.toLowerCase()
                )
            )
            .map(
              (item) =>
                (item = {
                  Currency: item.Currency,
                  Exchange: item.Exchange,
                  Feedcode: item.Feedcode,
                  Note_Master_Id: item.Note_Master_Id,
                  ProductName1: (item.Product_Name + '').trim().toLowerCase(),
                  Product_Name: (item.Product_Name + '').trim(),
                })
            );
        });
      } else {
        this.shareList = [];
        this.shareList.length = 0;
        this.noteMasterID = '';
        this.security = '';
        // this.cfs.ReadAllProductAllEvent_CA(
        //   '',
        //   this.security,
        //   this.customerID,
        //   this.viewBy,
        //   this.dayOne,
        //   this.dayLast,
        //   this.template
        // );

        this.getReadAllProductAllEvent_CA(
          '',
          this.security,
          this.customerID,
          this.viewBy,
          this.dayOne,
          this.dayLast,
          this.template,
          this.Str_Event_Group_Name
        );

        // this.cfs.CountPerDayEventDiary_CA(
        //   '',
        //   this.security,
        //   this.customerID,
        //   this.viewBy,
        //   this.dayOne,
        //   this.dayLast,
        //   this.template
        // );
      }
    } catch (error) {}
  }
  ChangeIndex() {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {}
  }
  onClickedOutside() {
    try {
      this.showSuggestions = false;
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  back() {
    this.location.back();
  }

  refreshPage() {
    try {
      const date = new Date();
      this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      this.lastDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // console.log('setEventCount', this.firstDay, this.lastDay);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const moment = require('moment');
      this.dayOne =
        new Date(moment(this.firstDay)).getDate() +
        '-' +
        months[new Date(moment(this.firstDay)).getMonth()] +
        '-' +
        new Date(moment(this.firstDay)).getFullYear();
      this.dayLast =
        new Date(moment(this.lastDay)).getDate() +
        '-' +
        months[new Date(moment(this.lastDay)).getMonth()] +
        '-' +
        new Date(moment(this.lastDay)).getFullYear();
      // console.log('days one and last day for per day', dayOne, dayLast);
      const d = new Date();
      this.selectedYear = d.getFullYear();
      this.selectedMonth = d.getMonth();
      this.counts = [];
      // this.customerID = this.homeApi.CustomerId;
      this.customerID = 1;

      this.viewBy = 'Schedule';
      this.api.GetShareList('');
      // this.cfs.GetEventName_CA();
      this.getEventCode();
      this.generateDates();
      this.emitMonth();
    } catch (error) {}
  }

  getEventCode() {
    try {
      this.cfs.GetEventCode('All', this.Auth.EntityID, 'N').subscribe((res) => {
        if (res) {
          this.eventArray = [];
          this.template = 'All';
          this.eventArray = res.GetEventCodeResult;
          console.log("EVNETS DAIRY", this.eventArray);
          // var index = this.eventArray.indexOf("All");
          let tempStore = []
          let foundIdx = this.eventArray.findIndex(el => el.Event_Name == "All")
          tempStore = this.eventArray[foundIdx]
          this.eventArray.splice(foundIdx, 1)
          this.eventArray.unshift(tempStore)
          // this.eventArray.forEach(function(item,i){
          //   if(item.Event_Name === "All"){
          //     this.eventArray.splice(i, 1);
          //     this.eventArray.unshift(item);
          //   }
          // });
          this.chartlables = [];
          res.GetEventCodeResult.forEach((element) => {
            if (element.Event_Name !== '') {
              this.IsLoading = false;
              // this.chartlables.push({ event: element.Event_Name, eventCount: 0 });
            }
          });
          // console.log("this.eventArray", this.eventArray);
        }
      });
    } catch (error) {}
  }

  getEventName() {
    try {
    } catch (error) {}
  }

  epoch(date: any) {
    return Date.parse(date);
  }

  sortData() {
    try {
      if (this.viewBy === 'Schedule') {
        this.AllProductEventCA.sort((a, b) => {
          const dateA: any = new Date(a.pdate);
          const dateB: any = new Date(b.pdate);
          return dateA - dateB;
        });
      } else if (this.viewBy === 'Payment') {
        this.AllProductEventCA.sort((a, b) => {
          const dateA: any = new Date(a.sdate);
          const dateB: any = new Date(b.sdate);
          return dateA - dateB;
        });
      }
    } catch (error) {}
  }

  getCustomerDetails(res) {
    if (res.length > 0) {
      // this.portfolioList = [];
      this.selectedCustomerDetails = [];
      this.selectedCustomerDetails = res;
      this.customerID = res.CustomerID;
      // for (const item of res) {
      //   if (!map.has(item.PortfolioName)) {
      //     map.set(item.PortfolioName, true); // set any value to Map
      //     this.portfolioList.push(item.PortfolioName);
      //   }
      // }
      // this.updateCustomerPortfolioDetails();
    }
  }

  selectedCustomerValue1(e) {
    //this.loadflag = true;


    this.customerID = e;
    console.log(this.customerID);
    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      this.dayOne,
      this.dayLast,
      this.template,
      this.Str_Event_Group_Name
    )
  }
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.checked = true
      this.customerID = '';
    } else {
      this.checked = false
      this.customerID = 'All';
      this.customerIDText = '';
      this.selectedCustomerValue1('All');
      // this.customerSelected?'52':this.customerSelected;
    }

    this.getReadAllProductAllEvent_CA(
      '',
      '' ? this.security : this.security,
      this.customerID,
      this.viewBy,
      this.dayOne,
      this.dayLast,
      this.template,
      this.Str_Event_Group_Name
    )
  }


toggleFilter(){
    this.showfilter = !this.showfilter
  }
}