import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';
// var Plotly = require('plotly.js-dist-min');
import { DatePipe, Location } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
} from 'ng-apexcharts';

import { ApifunctionService } from '../fx-order/apifunction.service';
import { LCMApiService } from 'src/app/services/lcmapi.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { ChartInput } from 'src/app/extras/underlying-linechart/underlying-linechart.component';
import { ChartService } from './../../themeService/chart.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  markers: ApexMarkers;
  colors: string[];
  plotOptions: ApexPlotOptions;
};

export type ChartUsdInterest = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss'],
})
export class MarketDataComponent implements OnInit {
  @ViewChild('rangePointer') rangePointer;

  @ViewChild('chart') chart: ChartComponent;

  public chartOptions1: Partial<ChartOptions>;
  public ChartUsdInterest: Partial<ChartOptions>;
  public chartCorrelations: Partial<ChartOptions>;
  PriceResp: any = [];
  DateResp: any = [];
  DateRespTable: any = [];
  pricedatatopass = []
  Pricedata: ChartInput = {
    title: '',
    series: [
      {
        name: 'Closing Price',
        data: [],
      },
    ],
    // width:  "100%" ,
    height: 250,
    chartType: 'area',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 5,
    showLabel: false,
  };
  columnNames3: any = [];
  TodayDate: any;
  Count: any;
  shareList: any = [];

  optionRateFlag: boolean = false;
  pricingChartFlag: boolean = false;
  showShareListPopup: boolean = false;
  showShareListMultiselectPopup: boolean = false;

  shareListFilter: any = [];

  //volatility parameters

  volcnt: number;
  sharename: string; //AAPL.OQ
  title4: string;
  tenor = [];
  TradingDays = [];
  Pillar_1M = [];
  Pillars = [];
  Pillar_3M = [];
  Pillar_1Y = [];
  width4: number;
  height4: number;
  title5: string;
  colorscale: any;
  graph: any;
  graph2: any;
  j: number;
  data4 = [];
  Volatilitygraph: string;
  datajson: any;
  formattedForChart: any = [];
  //end

  pricingChartXaxis: any = [];

  interestRate: ChartInput = {
    title: '',
    series: [
      {
        name: 'Interest Rate',
        data: [],
      },
    ],
    width: 200,
    height: 250,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#C8AFCC', //'#00BEFE',
    markerSize: 5,
    showLabel: true,
  };
  unique_pricingXaxis: any = [];
  colors: any;

  volatilityFlag: boolean = false;
  volatilityError: any = '';

  interestRateError: any = '';

  constructor(
    public APIFunction: ApifunctionService,
    public datePipe: DatePipe,
    public lcmApi: LCMApiService,
    public ngxXml2jsonService: NgxXml2jsonService,
    public location: Location,
    public chartService: ChartService
  ) {
    this.graph = {
      backgroundColor: 'none',
      config: {
        displayModeBar: false,
      },
      data: [
        {
          x: [
            'P1',
            'P2',
            'P3',
            'P4',
            'P5',
            'P6',
            'P7',
            'P8',
            'P9',
            'P10',
            'P11',
            'P12',
          ],
          y: ['1M', '3M', '1Y'],

          z: [0, 0, 0],
          type: 'surface',
          colorscale: [],
          showscale: false,
          displaymodebar: false,
        },
      ],
      layout: {
        showlegend: false,
        autosize: false,
        showscale: false,
        width: 400,
        height: 260,
        margin: {
          l: 10,
          r: 0,
          b: 0,
          t: 10,
          pad: 2,
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        legend: {
          bgcolor: '#E2E2E2',
        },
        scene: {
          xaxis: { title: 'Vol', color: '#808080' },
          yaxis: { title: 'Tenor', color: '#808080' },
          zaxis: { title: 'Strike', color: '#808080' },
        },
      },
      // config: {
      //   responsive: true
      // }
    };
    this.chartOptions1 = {
      series: [
        {
          name: '',
          data: [],
        },
      ],
      chart: {
        height: 300,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#00D8A8',
          top: 3,
          left: 0,
          blur: 10,
          opacity: 0.5,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'straight',
        show: true,
        lineCap: 'butt',
        colors: undefined,
        width: 2.4,
        dashArray: 0,
      },

      yaxis: {
        labels: {
          style: {
            colors: ['#808080'],
          },
        },
      },

      title: {
        text: '',
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
            ],
          },
        },
      },
      colors: ['#00D8A8'],
    };

    this.ChartUsdInterest = {
      series: [
        {
          name: '',
          data: [],
        },
      ],
      chart: {
        height: 250,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#00D8A8',
          top: 3,
          left: 0,
          blur: 10,
          opacity: 0.5,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'straight',
        show: true,
        lineCap: 'butt',
        colors: undefined,
        width: 2.4,
        dashArray: 0,
      },

      yaxis: {
        labels: {
          style: {
            colors: ['#808080'],
          },
        },
      },

      title: {
        text: '',
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
              '#808080',
            ],
          },
        },
      },
      colors: ['#00D8A8'],
    };

    this.chartCorrelations = {
      series: [
        {
          name: '',
          data: [0.63, 0.58, 0.42, 0.54],
        },
      ],
      chart: {
        height: 250,
        type: 'bar',
        dropShadow: {
          enabled: true,
          color: '#3E55A7',
          top: 3,
          left: 0,
          blur: 2,
          opacity: 0.5,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'straight',
        show: true,
        lineCap: 'butt',
        colors: undefined,
        width: 0.1,
        dashArray: 0,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 3,
          columnWidth: '30%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: '',
      },
      xaxis: {
        categories: ['AMZN.OQ', 'FB.OQ', 'GOOG.OQ', 'NFLX.OQ'],
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,
          style: {
            colors: ['#808080', '#808080', '#808080', '#808080'],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#808080'],
          },
        },
      },
      colors: ['#3E55A7'],
    };
  }
  tablearray: any = [];
  VolatilityData: any = [];
  share: any = 'AAPL.OQ';
  YTDChng: any;
  MTDChng: any;
  YearChng: any;
  D20: any;
  D60: any;
  D250: any;

  _priceCurrent: number = 50;
  _priceHigh: number = 500;
  _priceLow: number = 2;
  label: any = 'high';
  priceLow: any;
  priceHigh: any;

  shareCode = 'AAPL UW';
  shareName = 'AAPL.OQ';
  interestRateChart = '';
  chartOptionData: any = [];
  // tenor : any = [];
  shareInfo: any = [];
  shareLongName: any = 'Apple Inc';

  priceHistory: any = [];
  correlationChart: any = [];
  unique_correlationShare: any = [];

  prevClose: any = '';

  correlation_shares: any = ['AMZN.OQ', 'GOOG.OQ', 'NFLX.OQ'];
  multishare = this.correlation_shares.toString();
  correlation_chart_data: any = [];
  filteredCorrelationArray: any = [];
  flag_correlation: boolean = false;
  selectedIndex: number = 0;
  selectedCurrency: any = '';

  errorMsg: any = '';

  ngAfterViewInit(): void {
    if (this.showControl()) {
      if (this._priceHigh < this._priceCurrent) {
        this.priceHigh = this._priceCurrent;
        this._priceHigh = this._priceCurrent;
      }
      if (this._priceLow > this._priceCurrent) {
        this.priceLow = this._priceCurrent;
        this._priceLow = this._priceCurrent;
      }
      const position =
        ((this._priceCurrent - this._priceLow) /
          (this._priceHigh - this._priceLow)) *
        100;
      this.rangePointer.nativeElement.style.left = position + '%';
    }
  }
  showControl(): boolean {
    if (
      this.label &&
      this._priceCurrent >= 0 &&
      this._priceHigh >= 0 &&
      this._priceLow >= 0
    ) {
      return true;
    }
    return false;
  }

  multishareBKP: any = [];

  ngOnInit(): void {
    this.VolatilityData = [];

    this.getPrevClose();
    this.GetOverViewData();
    this.GetSharePriceHistory();
    this.getOptionRate();
    this.getCorrelation();
    this.getVolality();
    this.getOverView();
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors;
        console.log('colors', this.colors);
        if (this.VolatilityData.length !== 0) {
          this.drawVolalityChart(this.VolatilityData);
        }
      }
    });
  }

  GetOverViewData() {
    let a = [];
    this.APIFunction.GetHighLowOverview(this.shareName);
    this.APIFunction.GethighLowSubObserver.subscribe((data) => {
      console.log('high low', typeof data);
      // if(data['GetHighLowRatesResult'] !== undefined)
      // {
      //   a = JSON.parse(JSON.stringify(data['GetHighLowRatesResult']))
      //   for(let i=0 ; i<a.length;i++)
      //   {
      //     if(this.share == a[i].Code)
      //     {
      //       this.YTDChng = a[i].CYCP
      //       this.MTDChng = a[i].CMCP
      //       this.YearChng = a[i].L365
      //       this.D20 = a[i].D20
      //       this.D60 = a[i].D60
      //       this.D250 = a[i].D250
      //       this._priceHigh = a[i].L1HighV,
      //       this._priceLow = a[i].L1LowV
      //     }
      //   }
      // }

      // let res = await this.lcmApi.GetHighLow(this.shareName).subscribe((data: any) => {
      //   if(data){

      //   }
      // });
    });
  }

  async getOverView() {
    let res = await this.lcmApi
      .GetHighLow(this.shareName)
      .subscribe((data: any) => {
        if (data) {
          // console.log("overview", data);
          if (data['GetHighLowRatesResult'] !== undefined) {
            let a = JSON.parse(JSON.stringify(data['GetHighLowRatesResult']));
            // console.log("reuters data is  a," , a , typeof(a) ,a[0])
            for (let i = 0; i < a.length; i++) {
              if (this.shareName == a[i].Code) {
                this.YTDChng = a[i].CYCP;
                this.MTDChng = a[i].CMCP;
                this.YearChng = a[i].L365;
                this.D20 = a[i].D20;
                this.D60 = a[i].D60;
                this.D250 = a[i].D250;
                (this._priceHigh = a[i].L1HighV),
                  (this._priceLow = a[i].L1LowV);
                // this._priceCurrent = a[i].MarketValue;
                // console.log("a[i]", this._priceCurrent)
              }
            }
          }
        }
      });
  }

  async GetSharePriceHistory() {
    let a = [];
    this.pricingChartFlag = false;
    this.chartOptions1.series[0].data = [];
    this.chartOptions1.xaxis.categories = [];
    this.PriceResp = [];
    this.DateResp = [];
    this.unique_pricingXaxis = [];

    // this.APIFunction.GetSharePriceHistory()
    // this.APIFunction.GetShareHistorySubObserver.subscribe(data=>{
    //   console.log("share price hisotyr data" , data['GetShareHistoryResult'])
    let res = this.lcmApi
      .GetShareHistory(this.shareName)
      .subscribe((data: any) => {
        console.log("...", data);
        this.formattedForChart = [];
        if (data['GetShareHistoryResult'] !== undefined) {
          this.TodayDate = Date.now;
          a = JSON.parse(JSON.stringify(data['GetShareHistoryResult']));
          // console.log("reuters data is  a," , a , typeof(a) ,a[0].Response , typeof(a[0].Response))
          let Data: any = data['GetShareHistoryResult'];
          let share = this.shareName.split('.', 1);
          Data = Data.filter((data: any) => {
            console.log("share code", data.Code)
            return data.Shares.toLowerCase().includes(share[0].toLowerCase());
          });
          console.log("...", Data)

          for (let i = 0; i < Data.length; i++) {
            if (Data[i].Shares) {
              // console.log("inside")
              Data = JSON.parse(Data[i].Response);
              Data = Data.Contents;
              this.Count = this.Count + 1;
            }
          }

          console.log("data", Data);
          for (let i = 0; i < Data.length; i++) {
            // console.log("data[i]", Data[i])
            if (this.TodayDate > Data[i]['Trade Date']) {
              // console.log("Data[i]['Close Price']", Data[i]['Close Price'])
              this.PriceResp[i] = parseFloat(Data[i]['Close Price']).toFixed(2);
              this.DateResp[i] = this.datePipe.transform(
                Data[i]['Trade Date'],
                'MMM-yyyy'
              );
              this.DateRespTable[i] = this.datePipe.transform(
                Data[i]['Trade Date'],
                'MMM-yyyy'
              );

              this.formattedForChart.push({
                x: this.datePipe.transform(Data[i]['Trade Date'], 'MMM-yyyy'),
                y: Number(Data[i]['Close Price']).toFixed(2),
              });

              // this.Pricedata[i] = [this.DateResp[i] + '', Number(this.PriceResp[i])];
              // this.columnNames3 = [this.DateResp[i], this.Pricedata[i]];
            }
          }
          
          // this.formattedForChart = b.sort(
          //   (objA, objB) =>  new Date(objB).getDate() - new Date(objA).getDate(),
          // );
          console.log(".....", this.formattedForChart)
          // this.formattedForChart = this.formattedForChart.reverse();
          if (this.formattedForChart.length > 0) {
            this.chartOptions1.series[0].data = this.PriceResp;
            this.chartOptions1.xaxis.categories = this.DateResp;

            this.Pricedata.series[0].data = this.PriceResp;
            this.Pricedata.Xlabels = this.DateResp;
            console.log("formatted data", this.formattedForChart , this.DateResp)

            this.unique_pricingXaxis = [
              ...new Map(
                this.DateResp.map((item: any) => [
                  new Date(item).getMonth(),
                  item,
                ])
              ).values(),
            ];

            // this.unique_pricingXaxis = ['Oct-2016','Dec-2016','Jan-2017','Mar-2017','May-2017','Jul-2017','Sep-2017','Nov-2017']
            let a = this.unique_pricingXaxis.splice(0,1);
            this.unique_pricingXaxis.push(a)

            console.log("dates  .....", this.unique_pricingXaxis);

            // this.PriceResp.forEach((element: any) => {
            //   name: element.,
            //   data: scenario1,
            //   scenario: 1
            // });
            this.pricingChartFlag = true;
            this.errorMsg = '';
          } else {
            this.pricingChartFlag = false;
          }
          
          if(this.PriceResp[0] > this.PriceResp[this.PriceResp.length-1])
          {
            this.Pricedata.lineColor = '#FF0000'
          }
          else
          {
            this.Pricedata.lineColor = '#34A853'
          }

          // this.pricedatatopass = 

          if (this.formattedForChart.length == 0) {
            this.errorMsg = 'No Data found';
          }
          // console.log("Price ", this.chartOptions1.series,  this.chartOptions1.xaxis.categories );
        }
      });
  }

  async getShareList(shareName) {
    let res = await this.lcmApi
      .Get_SP_Value('0', '0', 'GetDummySharesData', shareName)
      .subscribe((res: any) => {
        if (res) {
          let sharelist: any = [];
          this.shareList = [];
          sharelist = res.Get_SP_ValueResult;
          if (sharelist.length != 0 && sharelist != 'Failed!') {
            var json = JSON.stringify(sharelist);
            var temp = JSON.parse(json);
            // console.log("share",temp);
            var parser = new DOMParser();
            var xml = parser.parseFromString(temp, 'text/xml');
            var obj = this.ngxXml2jsonService.xmlToJson(xml);

            this.shareList = obj['DocumentElement'].DUMMY;
            this.shareListFilter = this.shareList;
          }

          // console.log("sharelist", this.shareList, obj);
        }
      });
  }

  async getOptionRate() {
    let res = await this.lcmApi
      .GetOptionRates(this.shareName)
      .subscribe((res: any) => {
        if (res) {
          // console.log("get option rate", res);
          this.optionRateFlag = false;
          let optionRate = res.GetOptionRatesResult;
          this.chartOptionData = [];

          this.ChartUsdInterest.series[0].data = [];
          this.ChartUsdInterest.xaxis.categories = [];

          this.interestRate.series[0].data = [];
          this.interestRate.Xlabels = [];

          for (let i = 0; i < optionRate.length; i++) {
            if (optionRate[i].Ccy == 'USD') {
              this.chartOptionData.push({
                IR: Number(optionRate[i].IR),
                tenor: optionRate[i].Tenor,
              });
              // this.tenor[i] = optionRate[i].Tenor;
              this.interestRateChart =
                optionRate[i].Ccy + ' ' + 'Interest Rates';
            }
          }
          // console.log("tenor % data", this.chartOptionData, this.tenor);

          if (this.chartOptionData.length > 0) {
            this.chartOptionData.forEach((element: any) => {
              this.ChartUsdInterest.series[0].data.push(element.IR);
              this.ChartUsdInterest.xaxis.categories.push(element.tenor);

              this.interestRate.series[0].data.push(element.IR.toFixed(2));
              this.interestRate.Xlabels.push(element.tenor);
            });
            this.optionRateFlag = true;
            this.interestRateError = '';
          } else {
            this.optionRateFlag = false;
            this.interestRateError = 'No Data Found';
          }

          // console.log("option rate chart data", this.ChartUsdInterest.series[0].data, this.ChartUsdInterest.xaxis.categories);
        }
      });
  }

  async getCorrelation() {
    let res = await this.lcmApi
      .GetCorrelationMatrix(this.shareName)
      .subscribe((res: any) => {
        if (res) {
          console.log("get correlation", this.shareName , res);

          let correlationData: any = [];
          this.unique_correlationShare = [];
          correlationData = res.GetCorrelationMatrixResult;
          for (let i = 0; i < correlationData.length; i++) {
            if (correlationData[i].Underlying1 == this.shareName) {
              this.correlationChart.push(correlationData[i]);
            }
          }

          this.unique_correlationShare = [
            ...new Map(
              this.correlationChart.map((item: any) => [
                item['Underlying2'],
                item,
              ])
            ).values(),
          ];

          if (this.correlationChart.length != 0) {
            this.PlotCorrelation();
          }

          console.log("data", this.correlationChart, this.unique_correlationShare);
        }
      });
  }

  async getVolality() {
    let res = await this.lcmApi
      .GetEquityVolatility(this.shareName)
      .subscribe((res: any) => {
        if (res) {
          // console.log("get volatility", res);
          this.volatilityFlag = false;
          this.VolatilityData = [];
          this.VolatilityData = res.GetEquityVolatilityResult;

          this.drawVolalityChart(this.VolatilityData);
          this.volatilityFlag = true;
        }
      });
  }

  drawVolalityChart(Data) {
    // console.log(Data.length)

    if (Data.length != 0) {
      this.volcnt = 0;
      for (let i = 0; i < Data.length; i++) {
        // console.log(Data[i]);
        // console.log('In for', this.shareName, Data[i].Underlying);

        if (this.shareName === Data[i].Underlying) {
          // console.log()
          if (Data[i].Tenor === '1M') {
            this.tenor[this.volcnt] = Data[i].Tenor;
            this.TradingDays[this.volcnt] = Data[i].TradingDays;
            this.Pillar_1M[0] = Data[i].Pillar_1;
            this.Pillar_1M[1] = Data[i].Pillar_2;
            this.Pillar_1M[2] = Data[i].Pillar_3;
            this.Pillar_1M[3] = Data[i].Pillar_4;
            this.Pillar_1M[4] = Data[i].Pillar_5;
            this.Pillar_1M[5] = Data[i].Pillar_6;
            this.Pillar_1M[6] = Data[i].Pillar_7;
            this.Pillar_1M[7] = Data[i].Pillar_8;
            this.Pillar_1M[8] = Data[i].Pillar_9;
            this.Pillar_1M[9] = Data[i].Pillar_10;
            this.Pillar_1M[10] = Data[i].Pillar_11;
            this.Pillar_1M[11] = Data[i].Pillar_12;
            // this.Pillar_1M[0] = this.Pillars

            this.volcnt = this.volcnt + 1;
          }
          if (Data[i].Tenor === '3M') {
            this.tenor[this.volcnt] = Data[i].Tenor;
            this.TradingDays[this.volcnt] = Data[i].TradingDays;
            this.Pillar_3M[0] = Data[i].Pillar_1;
            this.Pillar_3M[1] = Data[i].Pillar_2;
            this.Pillar_3M[2] = Data[i].Pillar_3;
            this.Pillar_3M[3] = Data[i].Pillar_4;
            this.Pillar_3M[4] = Data[i].Pillar_5;
            this.Pillar_3M[5] = Data[i].Pillar_6;
            this.Pillar_3M[6] = Data[i].Pillar_7;
            this.Pillar_3M[7] = Data[i].Pillar_8;
            this.Pillar_3M[8] = Data[i].Pillar_9;
            this.Pillar_3M[9] = Data[i].Pillar_10;
            this.Pillar_3M[10] = Data[i].Pillar_11;
            this.Pillar_3M[11] = Data[i].Pillar_12;
            // this.Pillar_3M[0] = this.Pillars

            this.volcnt = this.volcnt + 1;
          }
          if (Data[i].Tenor === '1Y') {
            this.tenor[this.volcnt] = Data[i].Tenor;
            this.TradingDays[this.volcnt] = Data[i].TradingDays;
            this.Pillar_1Y[0] = Data[i].Pillar_1;
            this.Pillar_1Y[1] = Data[i].Pillar_2;
            this.Pillar_1Y[2] = Data[i].Pillar_3;
            this.Pillar_1Y[3] = Data[i].Pillar_4;
            this.Pillar_1Y[4] = Data[i].Pillar_5;
            this.Pillar_1Y[5] = Data[i].Pillar_6;
            this.Pillar_1Y[6] = Data[i].Pillar_7;
            this.Pillar_1Y[7] = Data[i].Pillar_8;
            this.Pillar_1Y[8] = Data[i].Pillar_9;
            this.Pillar_1Y[9] = Data[i].Pillar_10;
            this.Pillar_1Y[10] = Data[i].Pillar_11;
            this.Pillar_1Y[11] = Data[i].Pillar_12;

            // this.Pillar_1Y[0] = this.Pillars

            this.volcnt = this.volcnt + 1;
          }
        }
      }

      this.colorscale = [
        [0.0, this.colors[0]],
        [0.08333333333333333, this.colors[0]],
        [0.16666666666666666, this.colors[0]],
        [0.25, this.colors[0] + 'cc'],
        [0.3333333333333333, this.colors[0] + 'cc'],
        [0.41666666666666663, this.colors[0] + '99'],
        [0.5, this.colors[0] + '99'],
        [0.5833333333333333, this.colors[0] + '99'],
        [0.6666666666666666, this.colors[0] + '69'],
        [0.75, this.colors[0] + '69'],
        [0.8333333333333333, this.colors[0] + '69'],
        [0.9166666666666666, this.colors[0] + '33'],
        [1.0, this.colors[0] + '33'],
      ];
      this.graph = {
        backgroundColor: 'none',
        data: [
          {
            x: [
              'P1',
              'P2',
              'P3',
              'P4',
              'P5',
              'P6',
              'P7',
              'P8',
              'P9',
              'P10',
              'P11',
              'P12',
            ],
            y: ['1M', '3M', '1Y'],

            z: [this.Pillar_1M, this.Pillar_3M, this.Pillar_1Y],
            type: 'surface',
            colorscale: this.colorscale,
            showscale: false,
            displaymodebar: false,
          },
        ],
        layout: {
          showlegend: false,
          autosize: false,
          showscale: false,
          width: 400,
          height: 260,
          margin: {
            l: 10,
            r: 0,
            b: 0,
            t: 10,
            pad: 2,
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          legend: {
            bgcolor: '#E2E2E2',
          },
          scene: {
            xaxis: { title: 'Vol', color: '#808080' },
            yaxis: { title: 'Tenor', color: '#808080' },
            zaxis: { title: 'Strike', color: '#808080' },
          },
        },
        // config: {
        //   responsive: true
        // }
      };

      this.volatilityFlag = true;
      this.volatilityError = '';

      // Plotly.newPlot('myDiv', this.graph.data, this.graph.layout, {
      //   displayModeBar: false,
      // });
    } else {
      this.graph = {
        backgroundColor: 'none',
        data: [
          {
            x: [
              'P1',
              'P2',
              'P3',
              'P4',
              'P5',
              'P6',
              'P7',
              'P8',
              'P9',
              'P10',
              'P11',
              'P12',
            ],
            y: ['1M', '3M', '1Y'],

            z: [],
            type: 'surface',
            colorscale: this.colorscale,
            showscale: false,
            displaymodebar: false,
          },
        ],
        layout: {
          showlegend: false,
          autosize: false,
          showscale: false,
          width: 400,
          height: 260,
          margin: {
            l: 10,
            r: 0,
            b: 0,
            t: 10,
            pad: 2,
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          legend: {
            bgcolor: '#E2E2E2',
          },
          scene: {
            xaxis: { title: 'Vol', color: '#808080' },
            yaxis: { title: 'Tenor', color: '#808080' },
            zaxis: { title: 'Strike', color: '#808080' },
          },
        },
      };
      // Plotly.newPlot('myDiv', this.graph.data, this.graph.layout, {
      //   displayModeBar: false,
      // });
      this.volatilityFlag = false;
      this.volatilityError = 'No Data Found';
    }
  }

  back() {
    this.location.back();
  }

  selectShare(shareInfo) {
    this.correlation_shares = ['AMZN.OQ', 'GOOG.OQ', 'NFLX.OQ', 'AAPL.OQ'];
    // console.log("share info", shareInfo);
    this.showShareListPopup = false;
    this.shareName = shareInfo.Code;
    this.shareLongName = shareInfo.LongName;
    this.shareInfo = shareInfo;
    this.pricingChartFlag = false;
    this.optionRateFlag = false;
    this.volatilityFlag = false;

    this.YTDChng = '';
    this.MTDChng = '';
    this.YearChng = '';
    this.D20 = '';
    this.D60 = '';
    this.D250 = '';
    this._priceHigh = 0;
    this._priceLow = 0;
    this.errorMsg = '';
    this.VolatilityData = [];
    this.interestRateError = '';
    this.volatilityError = '';

    this.getPrevClose();
    this.getOverView();
    this.GetSharePriceHistory();
    this.getOptionRate();
    this.getCorrelation();
    this.getVolality();
  }

  searchShare(event: any) {
    this.getShareList(event.target.value);

    // this.shareList = this.shareListFilter;

    // let value = event.target.value;
    // console.log("search",  value);
    // this.shareList = this.shareList.filter((data: any) => {
    //   // console.log("share code", data.Code)
    //   return (
    //     // (data.Code).toString().toLowerCase().includes(value.toLowerCase()) ||
    //     (data.LongName).toLowerCase().includes(value.toLowerCase())
    //   );
    // });

    // console.log("resea", this.shareList)
  }

  async getPrevClose() {
    let res = await this.lcmApi
      .GetPrevClose(this.shareName)
      .subscribe((res: any) => {
        if (res) {
          console.log("get prevClose", res);
          if (res.GetPrevCloseResult.length != 0) {
            const Data = res.GetPrevCloseResult.filter((data: any) => {
              return data.PairCode.toLowerCase().includes(
                this.shareName.toLowerCase()
              );
            });

            console.log("prevclose", Data);
            if (Data.length != 0) {
              let splittedPairCode = Data[0].PairCode.split('-');
              console.log("splitted", splittedPairCode);
              this.selectedCurrency =
                splittedPairCode[0].length == 3
                  ? splittedPairCode[0]
                  : splittedPairCode[1];
              this.prevClose = Data[0].PreviousClose
                ? Data[0].PreviousClose
                : '-';
            }
          }

          console.log("prevclose", this.prevClose);

          // this.prevClose = res.

          // for(let i = 0; i < res.)
        }
      });
  }

  checkarray: any = [];

  getIndex(i: any, shares: any) {
    console.log(i);
    if (i.target.checked === true) {
      this.checkarray.push(shares);
      // this.multishare = this.checkarray.toString();
      let share = shares;
      if (!this.correlation_shares.includes(share)) {
        this.correlation_shares.push(share);
        this.multishare = this.correlation_shares.toString();
      }
    } else {
      for (let i = 0; i < this.checkarray.length; i++) {
        console.log(' in for', i, this.checkarray[i]);
        if (this.checkarray[i] === shares) {
          console.log('in if', this.checkarray[i], shares);
          var a = this.checkarray.splice(i, 1);
          console.log('after removbed', a, this.checkarray);
          this.multishare = this.checkarray.toString();
        }
      }

      for (let i = 0; i < this.correlation_shares.length; i++) {
        if (this.correlation_shares[i] === shares) {
          console.log('in if', this.checkarray[i], shares);
          var a = this.correlation_shares.splice(i, 1);
          console.log('after removbed', a, this.correlation_shares);
          this.multishare = this.correlation_shares.toString();
        }
      }
    }

    this.flag_correlation = false;
    // console.log("share correlation", event.target.value);

    console.log(
      'correlation_shares after adding',
      this.checkarray,
      this.correlation_shares
    );
  }

  onClickedOutsideCor(event , cor : any) {
    console.log('event click cor', event);
    if(cor === 'Cor')
    {
      this.showShareListMultiselectPopup = false;
    }
    
  }

  addSharesCorrelation(event) {
    this.flag_correlation = false;
    // console.log("share correlation", event.target.value);
    let share = event.target.value;
    if (!this.correlation_shares.includes(share)) {
      this.correlation_shares.push(share);
    }
    // console.log("correlation ",this.correlation_shares);
  }

  clearCorrelationShare() {
    this.multishare = '';
    this.correlation_shares = [];
    this.correlation_chart_data = [];
    this.flag_correlation = false;
  }

  PlotCorrelation() {
    this.multishare = this.correlation_shares.toString();
    for (let i = 0; i < this.correlation_shares.length; i++) {
      if (this.correlation_shares[i] == this.shareName) {
        this.correlation_shares.splice(i, 1);
      }
    }
    // console.log("correlation shares", this.correlation_shares);

    this.correlation_chart_data = [];
    let correlationCal: any = [];

    let newArray = [];

    // console.log("correlation chart", this.correlationChart);
    if (this.correlationChart) {
      for (let i = 0; i < this.correlationChart.length; i++) {
        if (
          this.correlation_shares.includes(this.correlationChart[i].Underlying2)
        ) {
          newArray.push(this.correlationChart[i]);
        }
      }
      this.filteredCorrelationArray = newArray;
      // console.log("corre", newArray);
    }

    for (let i = 0; i < this.correlation_shares.length; i++) {
      correlationCal.push({
        sum: 0,
        count: 0,
        avg: 0,
        share: this.correlation_shares[i],
      });
    }

    for (let i = 0; i < this.correlation_shares.length; i++) {
      for (let j = 0; j < this.filteredCorrelationArray.length; j++) {
        if (
          this.correlation_shares[i] ==
          this.filteredCorrelationArray[j].Underlying2
        ) {
          // console.log("this.correlation_shares[i]", this.correlation_shares[i], this.filteredCorrelationArray[j].Underlying2);
          correlationCal[i].sum =
            correlationCal[i].sum +
            Number(this.filteredCorrelationArray[j].Correlation);
          correlationCal[i].count = correlationCal[i].count + 1;
        }
      }
    }
    console.log('newwww', correlationCal);

    if (correlationCal.length != 0) {
      for (let i = 0; i < correlationCal.length; i++) {
        console.log('ninside');
        correlationCal[i].avg =
          Number(correlationCal[i].sum) / correlationCal[i].count;
        this.correlation_chart_data.push([
          correlationCal[i].share,
          correlationCal[i].avg,
        ]);
      }

      this.flag_correlation = true;
    }

    this.flag_correlation = true;
  }

  changeIndex(event: any) {
    if (this.shareList.length != 0) {
      // console.log("event", event, this.selectedIndex)

      if (
        this.selectedIndex == -1 ||
        this.selectedIndex > this.shareList.length ||
        this.selectedIndex == undefined
      ) {
        this.selectedIndex = 0;
      }
      if (event.key == 'ArrowDown') {
        if (
          this.selectedIndex >= 0 &&
          this.selectedIndex < this.shareList.length
        ) {
          this.selectedIndex++;
          // this.selected_item = this.shareList[this.selectedIndex];
        }

        if (
          this.selectedIndex < this.shareList.length &&
          this.selectedIndex % 8 == 0
        ) {
          document.getElementById('panel-dropdown')?.scrollBy(0, 162);
        }
      } else if (event.key == 'ArrowUp') {
        if (this.selectedIndex < this.shareList.length) {
          this.selectedIndex--;
          // this.selected_item = this.shareList[this.selectedIndex];

          if (this.selectedIndex % 8 == 0) {
            document.getElementById('panel-dropdown')?.scrollBy(0, -135);
          }
        }
      }

      if (event.key == 'Enter') {
        this.correlation_shares = ['AMZN.OQ', 'GOOG.OQ', 'NFLX.OQ', 'AAPL.OQ'];
        this.selectShare(this.shareList[this.selectedIndex]);
        this.showShareListPopup = false;
      }
    }
  }

  onClickedOutside(event: any , cor : any) {
    console.log(event);
    if(cor === 'Cor')
    {
      this.showShareListMultiselectPopup = false;
    }
    else
    {
      this.showShareListPopup = false;
    }
    
  }
  getMultiselectData(event: any) {
    this.multishare = [];
    console.log('event', event, this.multishareBKP, this.multishareBKP);
    if (this.multishareBKP !== undefined) {
      this.multishare.push(this.multishareBKP);
      this.multishare.push(event);
    } else {
      this.multishare.push({ event });
    }

    this.showShareListMultiselectPopup = false;
  }

  SaveData() {
    if (this.multishare !== undefined) {
      for (let i = 0; i < this.multishare.length; i++) {
        this.multishareBKP.push(this.multishare);
      }
      this.multishare = '';
    }
  }
  clear() {
    this.shareName = '';
    this.showShareListPopup = true;
  }

  // console.log("avg", correlationCal, this.correlation_chart_data)
}
