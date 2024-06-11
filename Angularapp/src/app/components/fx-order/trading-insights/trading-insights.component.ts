import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { ApifunctionService } from '../apifunction.service';
import { Subscription } from 'rxjs';
import { CommonfunctionService } from '../commonfunction.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trading-insights',
  templateUrl: './trading-insights.component.html',
  styleUrls: ['./trading-insights.component.css'],
})
export class TradingInsightsComponent implements OnInit {
  @HostListener('window:resize')
  onWindowResize() {
    this.width = window.innerWidth - 0.23 * window.innerWidth;
    // this.height = window.innerHeight - (0.7 * window.innerHeight);
    this.chart_piechartNotional.width =
      window.innerWidth - 0.63 * window.innerWidth;
    this.chart_piechartRevenue.width = this.chart_piechartNotional.width;
    this.chart_piechartNotional.height =
      window.innerHeight - 0.5 * window.innerHeight;
    this.chart_piechartRevenue.height = this.chart_piechartNotional.height;
    // console.log("Width1: " + window.innerWidth,',',this.chart_piechartNotional.width );
    // console.log("Height1: " + window.innerHeight,',',this.chart_piechartRevenue.height);
  }
  product: string;
  apifunction: ApifunctionService;
  ccyList = [];
  period: string;
  selectedCcy: string;
  domainURL = environment.domainURL;
  chart_rfqNotional_RfqCount_timeOfDay = {
    type: 'ColumnChart',
    columnNames: ['TimeSpan', 'Notional', 'Count'],
    data: [],
    options: {
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      vAxes: {
        // Adds titles to each axis.
        0: { title: 'Avg RFQ Notional' },
        1: { title: 'RFQ Count' },
      },
      legend: { position: 'none' },
      hAxis: {
        textStyle: {
          fontSize: 11,
        },
      },
      vAxis: {
        titleTextStyle: {
          fontName: 'Verdana',
          italic: false,
          fontStyle: 'normal', //or bold, normal, etc.
          fontSize: 15,
        },

        gridlines: {
          color: 'transparent',
        },
      },
    },
  };
  chart_orderNotional_orderCount_timeOfDay = {
    type: 'ColumnChart',
    columnNames: ['TimeSpan', 'Notional', 'Count'],
    data: [],
    options: {
      legend: { position: 'none' },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      vAxes: {
        // Adds titles to each axis.
        0: { title: 'Avg Order Notional' },
        1: { title: 'Order Count' },
      },
      hAxis: {
        textStyle: {
          fontSize: 11,
        },
      },
      vAxis: {
        titleTextStyle: {
          fontName: 'Verdana',
          italic: false,
          fontStyle: 'normal', //or bold, normal, etc.
          fontSize: 15,
        },

        gridlines: {
          color: 'transparent',
        },
      },
    },
  };
  chart_avgSpread_avdNotional_timeline = {
    type: 'ColumnChart',
    columnNames: ['TimeSpan', 'Spread', 'notional'],
    data: [],
    options: {
      legend: { position: 'none' },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      vAxes: {
        // Adds titles to each axis.
        0: { title: 'Avg Spread (BP%)' },
        1: { title: 'Avg Notional' },
      },
      hAxis: {
        textStyle: {
          fontSize: 11,
        },
      },
      vAxis: {
        titleTextStyle: {
          fontName: 'Verdana',
          italic: false,
          fontStyle: 'normal', //or bold, normal, etc.
          fontSize: 15,
        },

        gridlines: {
          color: 'transparent',
        },
      },
    },
  };
  chart_avgSpread_USDRevenue_timeline = {
    type: 'ColumnChart',
    columnNames: ['TimeSpan', 'Spread', 'USDRevenue'],
    data: [],
    options: {
      legend: { position: 'none' },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      vAxes: {
        // Adds titles to each axis.
        0: { title: 'Avg Spread (BP%)' },
        1: { title: 'Avg USD Revenue' },
      },
      hAxis: {
        textStyle: {
          fontSize: 11,
        },
      },
      vAxis: {
        titleTextStyle: {
          fontName: 'Verdana',
          italic: false,
          fontStyle: 'normal', //or bold, normal, etc.
          fontSize: 15,
        },
        gridlines: {
          color: 'transparent',
        },
      },
    },
  };
  chart_piechartNotional = {
    type: 'PieChart',
    data: [],
    columnNames: ['Products', 'Notional'],
    options: {
      colors: ['#85a3e0', '#3366cc', '#dc3912', '#f48b71'],
      sliceVisibilityThreshold: 0,
    },
    width: 630,
    height: 400,
    pieSliceTextStyle: {
      color: 'black',
    },
  };
  chart_piechartRevenue = {
    type: 'PieChart',
    data: [],
    columnNames: ['Products', 'Revenue'],
    options: {
      colors: ['#85a3e0', '#3366cc', '#dc3912', '#f48b71'],
      sliceVisibilityThreshold: 0,
    },
    width: 630,
    height: 400,
    // chartArea: {'width': '100%', 'height': '80%'},
    titleTextStyle: {
      color: 'blue',
    },
    pieSliceTextStyle: {
      color: 'black',
    },
  };
  spreadMultiplier: string;
  width = 1180;
  height = 350;
  ccySubscription: Subscription;
  insightsSubscription: Subscription;
  piechartSubscription: Subscription;
  dataAll = [];
  graph: string;
  TimeSpan: string;
  showSpreadPopup = true;
  Spread: string;
  // rfqNotional_RfqCount_timeOfDay = [];
  // orderNotional_orderCount_timeOfDay = [];
  // avgSpread_avdNotional_timeline = [];
  // avgSpread_USDRevenue_timeline = [];
  constructor(
    private afs: ApifunctionService,
    private ref: ChangeDetectorRef,
    private commonfunction: CommonfunctionService
  ) {
    this.apifunction = afs;
  }
  ngOnDestry() {
    this.ccySubscription.unsubscribe();
    this.insightsSubscription.unsubscribe();
    this.piechartSubscription.unsubscribe();
  }
  ngOnInit() {
    this.product = 'Spot';
    this.period = 'This Month';
    this.selectedCcy = 'All';
    this.TimeSpan = 'TOD';
    this.graph = 'ONC';
    this.Spread = '0.00';
    // this.spreadMultiplier = this.commonfunction.spreadMultiplierVar;
    this.width = window.innerWidth - 0.23 * window.innerWidth;
    this.chart_piechartNotional.width =
      window.innerWidth - 0.63 * window.innerWidth;
    this.chart_piechartRevenue.width = this.chart_piechartNotional.width;
    this.chart_piechartNotional.height =
      window.innerHeight - 0.53 * window.innerHeight;
    this.chart_piechartRevenue.height = this.chart_piechartNotional.height;
    // this.apifunction.RevenueInsights(this.selectedCcy, this.period, this.product, (this.period === 'Today' ? 'TOD' : (this.period.includes('Month') ? 'DOM' : (this.period.includes('Week') ? 'DOW' : 'WOM'))), 'timeline');
    // this.apifunction.RevenueInsights(this.selectedCcy, this.period, this.product, 'TOD', 'timeofday');
    this.afs.getConfigValue('TradingSwitch_FXTrading');
    this.afs.getConfigValue('SpreadMultiplier_FXTrading');
    this.commonfunction.showpopupspreadObserver.subscribe((_value) => {
      this.showSpreadPopup = true;
    });
    this.commonfunction.spreadMultiplierObserver.subscribe((value) => {
      this.spreadMultiplier = value;
      this.showSpreadPopup = true;
    });
    this.commonfunction.spreadvalueObserver.subscribe((value) => {
      this.Spread = value;
    });
    this.apifunction.RevenueInsights(
      this.selectedCcy,
      this.period,
      this.product,
      this.TimeSpan
    );
    this.apifunction.getFXCashPiechrat(this.selectedCcy, this.period);
    this.piechartSubscription = this.apifunction.piechartObserver.subscribe(
      (res) => {
        if (res.length > 0) {
          let data = res[0]['body']['getFXCashPieChartResult'];
          let piechartNotional = [];
          let piechartUSDRevenue = [];
          if (data !== undefined) {
            data.map((d) => {
              piechartNotional.push([
                d['Product'],
                parseFloat(d['TotalOrderNotional']),
              ]);
              piechartUSDRevenue.push([
                d['Product'],
                parseFloat(d['TotalUSDRevenue']),
              ]);
            });
            this.chart_piechartRevenue.data = piechartUSDRevenue;
            this.chart_piechartNotional.data = piechartNotional;
            // console.log('piechartNotional :', piechartNotional);
            // console.log('piechartUSDRevenue :', piechartUSDRevenue);
          }
        }
      }
    );
    this.ccySubscription = this.apifunction.GetCurrencyPairObserver.subscribe(
      (res) => {
        // console.log(res);
        if (res.length) {
          this.ccyList = res.filter((d) => {
            return d['GoodOrder'] === 'Y';
          });
          // console.log(this.ccyList);
        }
      }
    );
    this.insightsSubscription = this.apifunction.insightsObserver.subscribe(
      (res) => {
        if (res.length > 0) {
          // console.log(res);
          this.dataAll = res[0]['body']['revenueInsightsResult'];

          // if (res[0]['timetype'] === 'timeofday') {
          let rfqNotional_RfqCount_timeOfDay = [];
          let orderNotional_orderCount_timeOfDay = [];
          let avgSpread_avdNotional_timeline = [];
          let avgSpread_USDRevenue_timeline = [];
          if (this.dataAll !== undefined) {
            this.dataAll.map((d) => {
              orderNotional_orderCount_timeOfDay.push([
                d['TimeOfTheDay'],
                {
                  v: parseFloat(d['AvgOrderNotional']),
                  f:
                    'USD Notional: ' +
                    d['AvgOrderNotional'].replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                },
                {
                  v: parseFloat(d['OrderCount']),
                  f: 'Count: ' + d['OrderCount'],
                },
              ]);
              rfqNotional_RfqCount_timeOfDay.push([
                d['TimeOfTheDay'],
                {
                  v: parseFloat(d['AvgRFQNotional']),
                  f:
                    'USD Notional: ' +
                    d['AvgRFQNotional'].replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                },
                { v: parseFloat(d['RFQCount']), f: 'Count: ' + d['RFQCount'] },
              ]);
              avgSpread_avdNotional_timeline.push([
                d['TimeOfTheDay'],
                {
                  v: parseFloat(d['AvgPercentBP']),
                  f: 'Avg Spread (BP%) : ' + d['AvgPercentBP'],
                },
                {
                  v: parseFloat(d['AvgOrderNotional']),
                  f:
                    'Avg Notional (USD) : ' +
                    d['AvgOrderNotional'].replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                },
              ]);
              avgSpread_USDRevenue_timeline.push([
                d['TimeOfTheDay'],
                {
                  v: parseFloat(d['AvgPercentBP']),
                  f: 'Avg Spread (BP%) : ' + d['AvgPercentBP'],
                },
                {
                  v: parseFloat(d['AvgUSDRevenue']),
                  f:
                    'USD Revenue: ' +
                    d['AvgUSDRevenue'].replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                },
              ]);
            });
            this.chart_rfqNotional_RfqCount_timeOfDay.data =
              rfqNotional_RfqCount_timeOfDay;
            this.chart_orderNotional_orderCount_timeOfDay.data =
              orderNotional_orderCount_timeOfDay;
            // } else {
            this.chart_avgSpread_avdNotional_timeline.data =
              avgSpread_avdNotional_timeline;
            this.chart_avgSpread_USDRevenue_timeline.data =
              avgSpread_USDRevenue_timeline;
            // }
            this.ref.detectChanges();
          }

          // setTimeout(() => {
          //   // this.avgSpread_avdNotional_timeline = [];
          //   // this.avgSpread_USDRevenue_timeline = [];
          //   // this.dataAll.map(d => {
          //   // this.orderNotional_orderCount_timeOfDay.push([d['TimeOfTheDay'], parseFloat(d['AvgOrderNotional']), parseFloat(d['OrderCount'])]);
          //   // this.rfqNotional_RfqCount_timeOfDay.push([d['TimeOfTheDay'], parseFloat(d['AvgRFQNotional']), parseFloat(d['RFQCount'])]);

          //   // this.avgSpread_avdNotional_timeline.push([d['TimeOfTheDay'], parseFloat(d['AvgPercentBP']), parseFloat(d['AvgOrderNotional'])]);
          //   // this.avgSpread_USDRevenue_timeline.push([d['TimeOfTheDay'], parseFloat(d['AvgPercentBP']), parseFloat(d['AvgUSDRevenue'])]);
          // // });
          // this.chart_orderNotional_orderCount_timeOfDay.data=orderNotional_orderCount_timeOfDay;
          // this.chart_avgSpread_avdNotional_timeline.data=avgSpread_avdNotional_timeline;
          // this.chart_avgSpread_USDRevenue_timeline=this.chart_avgSpread_USDRevenue_timeline;
          // }, 1000);

          // console.log('chart_rfqNotional_RfqCount_timeOfDay : ', rfqNotional_RfqCount_timeOfDay);
          // console.log('orderNotional_orderCount_timeOfDay', orderNotional_orderCount_timeOfDay);
          // console.log('avgSpread_avdNotional_timeline : ', avgSpread_avdNotional_timeline);
          // console.log('avgSpread_USDRevenue_timeline : ', avgSpread_USDRevenue_timeline);
          // this.chart_rfqNotional_RfqCount_timeOfDay.data = rfqNotional_RfqCount_timeline;
        }
      }
    );
  }

  updateGraphData() {
    this.apifunction.RevenueInsights(
      this.selectedCcy,
      this.period,
      this.product,
      this.TimeSpan
    );
    this.apifunction.getFXCashPiechrat(this.selectedCcy, this.period);
  }
  changeperiod() {
    if (this.period.includes('Week')) {
      this.TimeSpan = 'TOD';
    } else if (this.period.includes('Today')) {
      this.TimeSpan = 'TOD';
    }
  }
}
