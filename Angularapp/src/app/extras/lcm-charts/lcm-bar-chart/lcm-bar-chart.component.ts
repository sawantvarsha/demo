import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { ChartService } from '../../../themeService/chart.service';
import { CommonfunctionService } from 'src/app/components/fx-order/commonfunction.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexYAxis,
  ApexNoData
} from "ng-apexcharts";
import { NgIf } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  colors: any[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  noData: ApexNoData;
};

@Component({
  selector: 'app-lcm-bar-chart',
  templateUrl: './lcm-bar-chart.component.html',
  styleUrls: ['./lcm-bar-chart.component.scss']
})
export class LcmBarChartComponent implements OnInit, OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() graphdatax: any;
  @Input() graphdatay: any;
  @Input() height: any;
  @Input() title: any;
  @Input() name: any;
  @Input() width: any;
  @Input() legend: any;
  @Input() legendFlag: any;
  @Input() xlabel: any;
  @Input() noOfCol: any;

  colors: any;
  currentdata: any;

  constructor(public commonApi: CommonApiService, public chartService: ChartService, public ref: ChangeDetectorRef, public com: CommonfunctionService) { }

  ngOnInit(): void {
    // this.drawchart();
    // this.chartOptions.xaxis.categories.foreEach(res => this.chartOptions.xaxis.categories.push(parseFloat(res)) );
    // console.log('xaxis', this.chartOptions.xaxis);

    // this.chartService.paletteEmitObs.subscribe((paletteres) => {
    //   if (!!paletteres) {
    //     let pallete = this.chartService.getPallete(paletteres);
    //     // console.log(paletteres, pallete.colors);
    //     this.colors = pallete.colors
    //       console.log("colors", this.colors);
    //     this.drawchart()
    //   }
    // });

  }

  drawchart() {
    console.log(this.graphdatay, this.graphdatax);

    this.chartOptions = {
      // series: [
      //   {
      //     name: 'Current Allocation',
      //     data: this.graphdatay
      //   },

      // ],
      series: this.graphdatay,
      chart: {
        type: "bar",
        // offsetX: 0,
        width: "100%",
        height: 500,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: (this.noOfCol <= 3) ? '20%' : '20px',
          dataLabels: {
            position: "top"
          },
        }
      },
      dataLabels: {
        enabled: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "12px",
          colors: ["#808080"]
        }
      },
      stroke: {
        show: false,
        width: 0,
        colors: []
      },
      xaxis: {
        title: {
          text: this.xlabel,
          style: {
            color: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',
          }
        },
        labels: {
          maxHeight: 100,
          rotate: -45,
          trim: true,
          // formatter: function (val: any) {
          //   // return (Number(val)/1000000) + "k";
          //   if (Number(val) > 999 && Number(val) < 1000000) {
          //     val = (Number(val) / 1000) + 'k';
          //   } else if (Number(val) >= 1000000 && Number(val) < 100000000) {
          //     val = (Number(val) / 1000000) + 'm';
          //   } else if (Number(val) >= 100000000) {
          //     val = (Number(val) / 100000000) + 'b';
          //   } else if (Number(val) < 900 && Number(val) > -999) {
          //     val = (val);
          //   } else if (parseFloat(val) <= -1000 && parseFloat(val) > -1000000) {
          //     val = (parseFloat(val) / 1000) + 'k';
          //   } else if (parseFloat(val) <= -1000000 && parseFloat(val) > -100000000) {
          //     val = (parseFloat(val) / 1000000) + 'm';
          //   } else if (parseFloat(val) <= -100000000) {
          //     val = (parseFloat(val) / 100000000) + 'b';
          //   } else if (parseFloat(val) > -900) {
          //     val = (val);
          //   }
          //   return val.toLocaleString("en-US");
          // },
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-label',
          }
        },
        categories: this.graphdatax,
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: "No. od Testcases",
          style: {
            color: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',
          }
        },
        decimalsInFloat: 2,
        labels: {
          align: 'right',
          // formatter: function (val) {
          //   return val.toLocaleString("en-US");
          // },
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',

          },
        }
      },
      colors: this.colors,
      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'right',
        horizontalAlign: 'right',
        fontSize: '13px',
        labels: {
          colors: '#808080',
        },
        offsetX: 0,
        offsetY: -200,
        //   itemMargin: {
        //     horizontal: 5,
        //     vertical: 0
        // },
      },

      fill: {
        colors: ['#808080'],
      },
      grid: {
        show: false
      },
      noData: {
        text: 'No Data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '14px',
        },
      },

    };
    this.setChartOptions()
  }

  setChartOptions() {
    // console.log(this.graphdata)
    // if (this.graphdata.length !== 0) {
    //   this.chartOptions.series[0].data = this.graphdata.map(
    //     (d: any) => d[1]
    //   );
    //   if (this.chartOptions.series[1]?.data) {
    //   this.chartOptions.series[1].data = this.graphdata.map(
    //     (d: any) => d[2]
    //   );
    //   }
    //   this.chartOptions.xaxis.categories = this.graphdata.map(
    //     (d: any) => d[0]
    //   );
    //   // console.log("ChartOptions", this.chartOptions)
    // }

  }

  ngOnChanges() {
    // console.log(this.graphdata)
    this.drawchart();

    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors
        console.log("colors", this.colors);
        this.drawchart()
      }
    });

  }

}
