import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// import * as $ from 'jquery';
import * as ntw from 'number-to-words';
import { HomeApiService } from 'src/app/services/home-api.service';
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-bond-details',
  templateUrl: './bond-details.component.html',
  styleUrls: ['./bond-details.component.scss'],
})
export class BondDetailsComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  converter = ntw;
  activeTab: boolean[];
  MFList = [];
  data: any = [];
  productCatalogue: any = [];
  AllMFData: any = [];
  FundCode = '';
  MFChartLabels: any;
  factsheetdata = [];
  FactSheetNoteMasterID: any;
  test = 'today';
  rating = '';
  selectedTab = 'Fund Categorization';
  corporateactions = [];
  chartColors = [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ];
  leftWidth: any;
  rightWidth: any;
  chartdata = [];
  chartOptions = {
    width: '700',
    height: '250',
    legend: 'none',
    colors: this.chartColors,
    backgroundColor: { fill: 'transparent' },
    hAxis: { textPosition: 'none' },
    vAxis: { textPosition: 'none' },
    titleTextStyle: {
      color: '#808080',
    },
  };
  // columnNames = ['Year', 'Asia', {role: 'style', type: 'string'}];
  ratingChartOptions = {
    width: 400,
    height: 350,
    legend: {
      position: 'none',
      maxLines: 3,
      textStyle: { color: '#fff', fontSize: 14 },
    },
    bar: { groupWidth: '40%' },
    isStacked: true,
    backgroundColor: { fill: 'transparent' },
    colors: [
      '#dfc2e4',
      '#fbe19f',
      '#9ad3f0',
      '#bce4b1',
      '#ed7d31',
      '#a5a5a5',
      '#619010',
      '#388a90',
      '#6143b7',
      '#a3085f',
      '#85593d',
      '#878787',
      '#b19c0c',
    ],
    hAxis: {
      title: 'Guarantor - N.A.',
      textPosition: 'none',
      baselineColor: '#ffffff',
      gridlines: { color: 'transparent', minSpacing: 20 },
      titleTextStyle: {
        color: '#FFFFFF',
        fontSize: 13,
      },
    },
    vAxis: {
      title: 'Rank - Secured',
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
      },
      titleTextStyle: {
        color: '#FFFFFF',
        fontSize: 13,
      },
      baselineColor: '#ffffff',
      gridlines: { color: 'transparent', minSpacing: 20 },
    },
    chartArea: { width: '90%', height: '60%', left: 150 },
  };
  period = 'Year';
  productRatingData = [];
  issuerRatingData = [];
  couponDates = [];
  // chartData = [{ data: [330, 600, 260, 700], label: 'Account A' }];
  // chartLabels = ['A', 'B', 'C', 'D'];
  // Title = 'NAV History';
  MFDetailsSubscription: Subscription;
  eventSubscription: Subscription;
  username = '';
  Note_Master_Id = '';
  showSchedule: boolean = false;
  Rule_Schedule_Details = [];
  type = 'LineChart';
  // columnNames: ["Month", "1", "2", "3", "4"];
  askPrice = true;
  askYield = true;
  bidPrice = true;
  bidYield = true;
  // color = ['#ff5a60', '#087e8a', '#3c3c3c', '#82c1a6'];
  columnNames: ['Year', 'Ask Price', 'Ask Yield', 'Bid Price', 'Bid Yield'];
  options = {
    legend: { position: 'bottom' },
    chartArea: { top: 10 },
    // legend: {
    //   position: 'top',
    //   textStyle: {
    //     color: '#fff',
    //     fontSize: 14
    //   },
    //   alignment: 'center'
    // },
    chart: {
      title: '',
    },
    width: 600,
    height: 300,
    backgroundColor: { fill: 'transparent' },
    series: {
      0: {
        targetAxisIndex: 0,
        color: this.chartColors[0],
        type: 'line',
      },
      1: {
        targetAxisIndex: 1,
        color: this.chartColors[1],
        type: 'line',
      },
      2: {
        targetAxisIndex: 0,
        color: this.chartColors[2],
        type: 'line',
      },
      3: {
        targetAxisIndex: 1,
        color: this.chartColors[3],
        type: 'line',
      },
    },

    vAxes: {
      0: {
        title: 'Price',
        // ticks:[103.52,103.87,104.21,104.56,104.9,105.25]
      },
      1: {
        title: 'Yield',
      },
    },

    hAxis: {
      gridlines: {
        color: '#fff',
      },
      titleTextStyle: {
        color: '#FF0000',
      },
    },
  };

  // options = {
  //   legend: { position: 'none' },
  //   chart: {
  //     title: ''
  //   },
  //   backgroundColor: { fill: 'transparent' },
  //   width: 500,
  //   height: 300,
  //   // legend: {
  //   //   position: 'right',
  //   //   textStyle: {
  //   //     color: '#fff',
  //   //     fontSize: 14
  //   //   }
  //   // },

  //   series: {
  //     0: {
  //       targetAxisIndex: 0,
  //       color: this.chartColors[0],
  //       type: 'line'
  //     },
  //     1: {
  //       targetAxisIndex: 1,
  //       color: this.chartColors[1],
  //       type: 'line'
  //     },
  //     2: {
  //       targetAxisIndex: 0,
  //       color: this.chartColors[2],
  //       type: 'line'
  //     },
  //     3: {
  //       targetAxisIndex: 1,
  //       color: this.chartColors[3],
  //       type: 'line'
  //     }
  //   },

  //   vAxes: {

  //     0: {
  //       title: 'Price',
  //       // ticks:[103.52,103.87,104.21,104.56,104.9,105.25]

  //     },
  //     1: {
  //       title: 'Yield',

  //     }
  //   },

  //   hAxis: {
  //     gridlines: {
  //       color: '#fff'
  //     },
  //     titleTextStyle: {
  //       color: '#FF0000'
  //     }
  //   }
  // };
  priceData: any;
  templateID: string;
  templateData: any;
  today: any;
  leftLine: string;
  rightLine: string;
  prev_coupon_date: any;
  next_coupon_date: any;
  today_date: number;
  errorMsg: any;
  RMWStateArr: any[];
  stateFlag: boolean;
  showOrderEntry: boolean;
  constructor(
    public router: Router,
    private datepipe: DatePipe,
    private afs: WorkflowApiService,
    private elem: ElementRef,
    private cfs: CommonApiService,
    private authapi: AuthService,
    private homeapi: HomeApiService
  ) {}

  ngOnDestroy(): void {
    if (this.MFDetailsSubscription) {
      this.MFDetailsSubscription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    sessionStorage.setItem('BondPorfolioDetails', 'FromBondDetails'); //Changes by Ashwini H. on 15 Feb 2022 for bond order entry

    this.username = sessionStorage.getItem('Username');
    this.templateID = sessionStorage.getItem('templateID');
    // const day = new Date();
    const day = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
    this.today = day;
    this.cfs.selectedStateObserver.subscribe((res) => {
      if (res) {
        this.RMWStateArr = [];
        this.stateFlag = true;
        this.RMWStateArr = res;
      }
    });
    this.cfs.selectedAssetObserver.subscribe((notemaster) => {
      if (notemaster.length !== 0) {
        // console.log('mF data from the product catalog', notemaster);

        this.Note_Master_Id = notemaster;

        this.afs.getbonddetails(
          this.Note_Master_Id,
          this.authapi.EntityCode,
          this.username
        );
        this.viewFactSheet(this.Note_Master_Id);

        this.afs
          .Get_Rule_Schedule_Details(this.Note_Master_Id)
          .subscribe((res) => {
            if (res) {
              // console.log(res);
              this.Rule_Schedule_Details =
                res.DB_Get_Rule_Schedule_DetailsResult;
              // this.Rule_Schedule_Details.remove(this.Rule_Schedule_Details[this.Rule_Schedule_Details.length - 1]);
            }
          });

        this.afs
          .GetPriceHistoryData(this.username, notemaster, this.period)
          .subscribe((res) => {
            if (res) {
              this.priceData = res;
              for (
                let i = 0;
                i <
                res.listBondPriceHistoryDetailsAPIResponse.Details_Prices
                  .length;
                i++
              ) {
                this.chartdata[i] = [
                  res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                    .NMPH_Price_Date,
                  parseFloat(
                    res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                      .NMPH_Ask_Price
                  ),
                  parseFloat(
                    res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                      .NMPH_Ask_Yield
                  ),
                  parseFloat(
                    res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                      .NMPH_Bid_Price
                  ),
                  parseFloat(
                    res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                      .NMPH_Bid_Yield
                  ),
                ];
              }
              this.columnNames = [
                'Year',
                'Ask Price',
                'Ask Yield',
                'Bid Price',
                'Bid Yield',
              ];
              // console.log(this.chartdata,this.columnNames);
            }
          });
      }
    });

    this.afs
      .Get_Bond_Browser_Data(this.authapi.EntityID, this.Note_Master_Id)
      .subscribe((res) => {
        if (res) {
          this.couponDates = res.Get_Bond_Browser_DataResult;
          // console.log("this.couponDates",this.couponDates);
          this.prev_coupon_date =
            res.Get_Bond_Browser_DataResult[0].Last_Coupon_Date.split('(')[1]
              .split('+')[0]
              .substring(0, 10);
          this.next_coupon_date =
            res.Get_Bond_Browser_DataResult[0].Next_Coupon_Date.split('(')[1]
              .split('+')[0]
              .substring(0, 10);
          this.today_date = Date.now() / 1000;
          let percentage =
            ((this.today_date - this.prev_coupon_date) * 100) /
            (this.next_coupon_date - this.prev_coupon_date);
          if (percentage > 90) {
            percentage = 90;
          } else if (percentage < 5) {
            percentage = 5;
          }
          // console.log(percentage, this.prev_coupon_date, this.next_coupon_date);
          let totalWidth = 500;
          this.leftLine = ((totalWidth * percentage) / 100).toString();
          this.rightLine = ((totalWidth * (100 - percentage)) / 100).toString();
          $('#leftLine').width(this.leftLine);
          $('#rightLine').width(this.rightLine);
          // console.log("calculated",totalWidth)

          // console.log(this.leftLine, this.rightLine)
          // this.next_coupon_date = this.epochtoFormatted(this.next_coupon_date)
          // console.log(this.prev_coupon_date, this.next_coupon_date, this.today_date)
          this.afs
            .Get_Template_Data(
              this.templateID,
              'Bonds',
              this.couponDates[0].Template_Sr_No
            )
            .subscribe((res) => {
              this.templateData = res.Get_Template_DataResult;
              // console.log(this.templateData);
              // console.log(this.templateData.Last_Coupon_Date)
            });
        }
      });

    this.afs.bondDetailsObserver.subscribe((res: any) => {
      if (res) {
        // console.log(res);
        this.data = res;
      }
    });

    this.afs.getFactsheetDataObserver.subscribe((res) => {
      if (res) {
        this.factsheetdata = res;
        // console.log(this.factsheetdata);
        //this.showFile(this.factsheetdata[0].DGT_ID, this.FactSheetNoteMasterID);
      } else {
        this.factsheetdata = [];
      }
    });
  }

  ngAfterViewChecked() {
    // console.log("out")
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#cccccc') {
          rect.setAttribute('fill', 'rgba(112, 112, 112, 0.2)');
        }
        if (rect.getAttribute('fill') === '#ebebeb') {
          rect.setAttribute('fill', 'rgba(112, 112, 112, 0.2)');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('text'),
      (text: HTMLElement) => {
        if (text.getAttribute('fill') === '#444444') {
          text.setAttribute('fill', '#808080');
        }
        if (text.getAttribute('fill') === '#222222') {
          text.setAttribute('fill', '#808080');
        }
      }
    );
  }

  changePeriod() {
    this.chartdata = [];
    this.afs
      .GetPriceHistoryData(this.username, this.Note_Master_Id, this.period)
      .subscribe((res) => {
        if (res) {
          this.priceData = res;
          if (
            res.listBondPriceHistoryDetailsAPIResponse.ResponseDetails
              .Remark === ' Data not Available'
          ) {
            this.errorMsg = true;
          } else {
            this.errorMsg = false;
          }
          for (
            let i = 0;
            i <
            res.listBondPriceHistoryDetailsAPIResponse.Details_Prices.length;
            i++
          ) {
            this.chartdata[i] = [
              res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                .NMPH_Price_Date,
              parseFloat(
                res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                  .NMPH_Ask_Price
              ),
              parseFloat(
                res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                  .NMPH_Ask_Yield
              ),
              parseFloat(
                res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                  .NMPH_Bid_Price
              ),
              parseFloat(
                res.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
                  .NMPH_Bid_Yield
              ),
            ];
          }
          // console.log(this.chartdata);
        }
      });
  }

  drawRatingChart() {
    this.productRatingData = [
      ["Moody's: Aa2", 8175000, '#dfc2e4'],
      ['S&P: AA', 7792000, '#fbe19f'],
      ['Fitch: AA', 5695000, '#9ad3f0'],
    ];
  }
  toggleSchedule() {
    this.showSchedule = !this.showSchedule;
    let precentage = 25;
    let totalheight = document.getElementById('calculatedVert').offsetHeight;
    // console.log(totalheight)
    let topLine = (document.getElementById('topLine').style.height = (
      (totalheight * precentage) /
      100
    ).toString());
    let bottomLine = (document.getElementById('bottomLine').style.height = (
      (totalheight * (100 - precentage)) /
      100
    ).toString());
    $('#topLine').height(topLine);
    $('#bottomLine').height(bottomLine);
  }

  changeTab(index) {
    for (let i = 0; i < 5; i++) {
      this.activeTab[i] = false;
    }
    this.activeTab[index] = true;
  }
  viewFactSheet(Note_Master_ID) {
    this.FactSheetNoteMasterID = Note_Master_ID;
    if (this.FactSheetNoteMasterID) {
      this.afs.ProductAttachmentList(this.FactSheetNoteMasterID);
    }
  }
  showFile(DGTID, NoteMasterID) {
    let Link =
      'http://' +
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      NoteMasterID +
      '/' +
      DGTID;
    window.open(Link);
  }

  epochtoFormatted(utc) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utc);
    const dt = d.toString().split(' ');
    const mt = dt[2] + '-' + dt[1] + '-' + dt[3];
    // //console.log(mt);
    return mt;
  }

  chkChange(index: any) {
    this.chartdata = [];
    for (
      let i = 0;
      i <
      this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices
        .length;
      i++
    ) {
      this.chartdata[i] = [
        this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices[i]
          .NMPH_Price_Date,
        parseFloat(
          this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices[
            i
          ].NMPH_Ask_Price
        ),
        parseFloat(
          this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices[
            i
          ].NMPH_Ask_Yield
        ),
        parseFloat(
          this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices[
            i
          ].NMPH_Bid_Price
        ),
        parseFloat(
          this.priceData.listBondPriceHistoryDetailsAPIResponse.Details_Prices[
            i
          ].NMPH_Bid_Yield
        ),
      ];
    }
    if (this.options.series[index].color === '') {
      this.options.series[index].color = this.chartColors[index];
    } else {
      this.options.series[index].color = '';
    }
  }

  clickBack() {
    this.router.navigate(['/rmw']);
    this.cfs.setRMWstate(this.RMWStateArr);
  }

  callOrderEntry(item) {
    this.homeapi.RMWlink = 'Bond Order'; //Added to clear filters on page navigation
    this.showOrderEntry = true;
    this.cfs.setAsset(this.data); //Changes done by Alolika G on 10-02-2022 for issue in Bond details
    this.cfs.setDirection(item);
  }
}
