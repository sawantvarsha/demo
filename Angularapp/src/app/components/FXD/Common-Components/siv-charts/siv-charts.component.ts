import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';

@Component({
  selector: 'app-siv-charts',
  templateUrl: './siv-charts.component.html',
  styleUrls: ['./siv-charts.component.scss'],
})
export class SIVChartsComponent implements OnInit, OnChanges {
  @Input() ccyPair: string;
  LoadingFlagSpotRates: boolean;
  LoadingFlagInterestRates: boolean;
  LoadingFlagVolatility: boolean;

  RateFeedData = [];
  historyData = [];
  interestRateChartData = [];
  interestRateChartDataForUSD = [];
  IRChartColNames = [];
  volSurfDetails = [];
  rateDecimal: any;
  width: number;
  height: number;
  chartColors = ['#f2a832'];

  historychart = {
    type: 'AreaChart',
    title: 'Spot Rate',
    data: [],
    options: {
      chartArea: { left: '40', right: '20' },
      titleTextStyle: { color: '#808080' },
      backgroundColor: { fill: 'transparent' },
      colors: this.chartColors,
      hAxis: {
        title: '',
        textPosition: 'none',
        titleTextStyle: {
          color: '#808080',
        },
        gridlineColor: '#424242',
        gridlines: {
          color: '#424242',
        },
      },
      vAxis: {
        title: '',
        textStyle: {
          color: '#808080',
        },
        gridlineColor: '#424242',
        gridlines: {
          color: '#424242',
        },
      },
      legend: {
        position: 'none',
      },
    },
  };

  interestRateChart = {
    type: 'LineChart',
    title: 'Interest Rate',
    chartArea: { width: '100%', height: '100%' },
    data: [],
    options: {
      chartArea: { left: '40', right: '20' },
      titleTextStyle: { color: '#808080' },
      backgroundColor: { fill: 'transparent' },
      colors: ['green', 'red'],
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: {
          fontSize: 11,
          color: '#ffffff',
        },
      },
      hAxis: {
        textStyle: {
          fontSize: 8,
          color: '#808080',
        },
        gridlineColor: '#424242',

        gridlines: {
          color: '#424242',
        },
      },
      vAxis: {
        textStyle: {
          color: '#808080',
        },
        textPosition: 'out',
        baselineColor: 'black',
        gridlineColor: '#424242',
        gridlines: {
          color: '#424242',
        },
      },
    },
    columnNames: ['Currency', '', ''],
  };
  graph: any;
  volcnt: number;
  Pillar1D: any[];
  Pillar1W: any[];
  Pillar2W: any[];
  Pillar1M: any[];
  Pillar2M: any[];
  Pillar3M: any[];
  Pillar6M: any[];
  Pillar1Y: any[];
  Pillar2Y: any[];
  tenor: any;
  TradingDays: any;
  width4: number;
  height4: number;
  title5: string;
  colorscale: any;
  toggleVolChart: boolean = true;
  constructor(public FXD_afs: FxdApifunctionService) {
    this.LoadingFlagVolatility = true;
  }

  ngOnInit(): void {
    this.fnSetDefaultValues();
    this.fnCallDefaultServices();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.historychart.data = [];
    this.interestRateChart.data = [];
    this.volSurfDetails = [];
    this.LoadingFlagSpotRates = true;
    this.LoadingFlagInterestRates = true;
    this.LoadingFlagVolatility = true;

    console.log('value changed', this.ccyPair);
    this.fnCallDefaultServices();
  }

  fnCallDefaultServices() {
    this.FXD_afs.fnCcyRatesHistoryData(this.ccyPair, '').subscribe(
      (res: any) => {
        if (res) {
          try {
            if (res.GetRateFeedDataResult) {
              this.RateFeedData = res.GetRateFeedDataResult;
              if (this.RateFeedData.length > 0) {
                this.historyData = [];
                this.RateFeedData.map((d) => {
                  d.AvgRate = parseFloat(d.AvgRate.toFixed(this.rateDecimal));

                  this.historyData.push([
                    d.RateDate,
                    {
                      v: d.AvgRate,
                      f: 'Spot Rate : ' + d.AvgRate.toFixed(this.rateDecimal),
                    },
                  ]);
                });
                this.historychart.data = this.historyData;
                const mid = parseInt(this.RateFeedData.length / 2 + '', 10);
                this.historychart.options.hAxis.title =
                  this.RateFeedData[0].RateDate +
                  '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +
                  this.RateFeedData[mid].RateDate +
                  '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +
                  this.RateFeedData[29].RateDate;
              }
            }
          } catch (ex) {
            console.log('Error occured while getting historical rates: ', ex);
          }
          this.LoadingFlagSpotRates = false;
        }
      }
    );

    this.FXD_afs.fnGetInteresetRates(this.ccyPair).subscribe((res: any) => {
      if (res) {
        try {
          res = res.Get_TenorDetailsResult;
          this.interestRateChartData = [];

          this.interestRateChart.columnNames = [
            'Currency',
            this.ccyPair.split('-')[0],
            this.ccyPair.split('-')[1],
          ];
          if (res.length > 0) {
            res.forEach((element) => {
              if(!Number.isNaN(element.CCY1AskIR) && !Number.isNaN(element.CCY1BidIR)){
                this.interestRateChartData.push([
                  element.TenorDays_MM + 'D',
                  (parseFloat(element.CCY1AskIR) +
                    parseFloat(element.CCY1BidIR)) /
                    2,
                  (parseFloat(element.CCY2AskIR) +
                    parseFloat(element.CCY2BidIR)) /
                    2,
                ]);
              }
              
            });
            this.interestRateChart.data = this.interestRateChartData;
            this.IRChartColNames = ['TenorDays_MM'];
          }
        } catch (EX) {}
        this.LoadingFlagInterestRates = false;
      }
    });

    this.FXD_afs.fnGetCcyVolatalitychart(this.ccyPair).subscribe((res: any) => {
      if (res) {
        try {
          this.volSurfDetails = res.Get_VolDataResult;
          this.volSurfDetails.findIndex(
            (item) => item.SoftMaturity === '1D'
          ) !== -1
            ? this.volSurfDetails.splice(
                this.volSurfDetails.findIndex(
                  (item) => item.SoftMaturity === '1D'
                ),
                1
              )
            : true;
          this.volSurfDetails.findIndex(
            (item) => item.SoftMaturity === '3W'
          ) !== -1
            ? this.volSurfDetails.splice(
                this.volSurfDetails.findIndex(
                  (item) => item.SoftMaturity === '3W'
                ),
                1
              )
            : true;
          this.volSurfDetails.findIndex(
            (item) => item.SoftMaturity === '9M'
          ) !== -1
            ? this.volSurfDetails.splice(
                this.volSurfDetails.findIndex(
                  (item) => item.SoftMaturity === '9M'
                ),
                1
              )
            : true;
          this.volSurfDetails.findIndex(
            (item) => item.SoftMaturity === '2Y'
          ) !== -1
            ? this.volSurfDetails.splice(
                this.volSurfDetails.findIndex(
                  (item) => item.SoftMaturity === '2Y'
                )
              )
            : true;

          if (this.volSurfDetails.length > 0) {
            //Added for Vol. surface graph
            this.VolatilityGraph();
          }
        } catch (Ex) {}
        this.LoadingFlagVolatility = false;

        // console.log("vol", this.volSurfDetails);
      }
    });
  }

  fnSetDefaultValues() {
    this.rateDecimal = 4;
    this.height = 140;
    this.width = 400;
  }

  VolatilityGraph() {
    //Added for Vol. surface graph
    try {
      this.graph = {};
      let Data = this.volSurfDetails;

      this.volcnt = 0;

      const YaxisData = [];
      this.Pillar1D = [];
      this.Pillar1W = [];
      this.Pillar2W = [];
      this.Pillar1M = [];
      this.Pillar2M = [];
      this.Pillar3M = [];
      this.Pillar6M = [];
      this.Pillar1Y = [];
      this.Pillar2Y = [];
      let ATMVal;
      for (let i = 0; i < Data.length; i++) {
        ATMVal = parseFloat(Data[i].ATM);
        YaxisData[0] = Data[i].SoftMaturity;
        if (Data[i].SoftMaturity === '1D') {
          this.Pillar1D[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar1D[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar1D[2] = ATMVal;
          this.Pillar1D[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar1D[4] = parseFloat(Data[i].s10DC) + ATMVal;

          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '1W') {
          this.Pillar1W[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar1W[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar1W[2] = ATMVal;
          this.Pillar1W[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar1W[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '2W') {
          this.Pillar2W[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar2W[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar2W[2] = ATMVal;
          this.Pillar2W[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar2W[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }

        if (Data[i].SoftMaturity === '1M') {
          this.Pillar1M[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar1M[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar1M[2] = ATMVal;
          this.Pillar1M[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar1M[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '2M') {
          this.Pillar2M[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar2M[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar2M[2] = ATMVal;
          this.Pillar2M[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar2M[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '3M') {
          this.Pillar3M[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar3M[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar3M[2] = ATMVal;
          this.Pillar3M[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar3M[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '6M') {
          this.Pillar6M[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar6M[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar6M[2] = ATMVal;
          this.Pillar6M[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar6M[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '1Y') {
          this.Pillar1Y[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar1Y[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar1Y[2] = ATMVal;
          this.Pillar1Y[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar1Y[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
        if (Data[i].SoftMaturity === '2Y') {
          this.Pillar2Y[0] = parseFloat(Data[i].s10DP) + ATMVal;
          this.Pillar2Y[1] = parseFloat(Data[i].s25DP) + ATMVal;
          this.Pillar2Y[2] = ATMVal;
          this.Pillar2Y[3] = parseFloat(Data[i].s25DC) + ATMVal;
          this.Pillar2Y[4] = parseFloat(Data[i].s10DC) + ATMVal;
          this.volcnt = this.volcnt + 1;
        }
      }
      this.title5 = 'Plotly Charts';

      this.colorscale = [
        [0.0, '#F3B54D'],
        [0.08333333333333333, '#F3B54D'],
        [0.16666666666666666, '#F3B54D'],
        [0.25, '#EEBC69'],
        [0.3333333333333333, '#EEBC69'],
        [0.41666666666666663, '#EEBC69'],
        [0.5, '#EBC079'],
        [0.5833333333333333, '#EBC079'],
        [0.6666666666666666, '#E4BF83'],
        [0.75, '#E4BF83'],
        [0.8333333333333333, '#FBD8A0'],
        [0.9166666666666666, '#FBD8A0'],
        [1.0, '#FBD8A0'],
      ];
      this.graph = {
        backgroundColor: '#808080',
        data: [
          {
            x: ['10d Put', '25d Put', 'ATM', '25d Call', '10d Call'],
            y: ['1W', '2W', '1M', '2M', '3M', '6M', '1Y'],
            // y: [this.tenor],
            z: [
              // this.Pillar1D,
              this.Pillar1W,
              this.Pillar2W,
              this.Pillar1M,
              this.Pillar2M,
              this.Pillar3M,
              this.Pillar6M,
              this.Pillar1Y,
              // this.Pillar2Y
            ],
            type: 'surface',
            colorscale: this.colorscale,
            showscale: false,
            displaymodebar: false,
            // cmin: 0,
            // cmax: 12
            hovertemplate:
              'Delta: %{x}' +
              '<br>Tenor: %{y}<br>' +
              'Vol: %{z}<extra></extra>',
          },
        ],

        layout: {
          displaymodebar: false,
          autosize: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            'zoom3d',
            'sendDataToCloud',
            'autoScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'lasso2d',
            'select2d',
          ],
          showTips: true,
          width: 380,
          height: 230,
          modebar: false,
          paper_bgcolor: '#FFF0',
          showlegend: false,
          displayModeBar: false,
          showscale: false,
          spaceframe: {
            fill: 0,
          },
          margin: {
            l: 10,
            r: 10,
            b: 20,
            t: 0,
          },
          scene: {
            xaxis: { title: 'Delta', color: '#808080' },
            yaxis: { title: 'Tenor', color: '#808080' },
            zaxis: { title: 'Vol', color: '#808080' },
          },
        },
        config: {
          displayModeBar: false,
          responsive: true,
        },
      };
      // return;
      // console.log("graph data", this.graph);
    } catch (error) {
      console.log(error);
    }
  }
}
