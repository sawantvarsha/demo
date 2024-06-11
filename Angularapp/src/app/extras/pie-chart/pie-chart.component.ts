import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexStates,
  ApexResponsive,
  ApexNoData,
  ApexTooltip,
  // ApexAxisChartSeries,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';

import { ChartService } from './../../themeService/chart.service';
// import {
//   pastel,
//   vibrant,
// } from './../../themeService/chart.module';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  states: ApexStates;
  responsive: ApexResponsive[];
  noData: ApexNoData;
  tooltip: ApexTooltip;
};
import { CommonApiService } from './../../services/common-api.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  public ChartOptions: Partial<ChartOptions>;
  @Input() graphdata: any;
  @Input() width: any;
  @Input() legendHeight: any;
  @Input() legendWidth: any;
  @Input() legendVisible: any;
  @Input() labelsVisible: any;
  @Input() title: any;
  
  colors: any;
  chartdata: any;
  @Output() productNameEmitter:EventEmitter<any> = new EventEmitter(); //Changes by Apurva K|| 19-May-2023||FIN1EURINT-355
  // @Input() labels: any;
  constructor(public commonApi: CommonApiService, public chartService: ChartService,) { }
  
  //Added Changes by Arsh P. on 16-June-2022. || Start
  ngOnChanges(){
    // console.log(this.graphdata)
    if (JSON.stringify(this.graphdata) !== JSON.stringify(this.chartdata) ){
      this.drawchart()
    } 
  }
//Added Changes by Arsh P. on 16-June-2022. || End

  ngOnInit(): void {
    // console.log(this.graphdata);
    this.drawchart();
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors
        this.drawchart()
      }
    });
  }
  drawchart() {
    const that = this;
    this.ChartOptions = {
      series: [0],
      colors: this.colors,
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
      chart: {
        width: this.width,
        height: 'auto',
        type: 'donut',
        offsetX: 0,
        //Changes by Apurva K|| 19-May-2023||FIN1EURINT-355
        events: {
          click: function(event:any){
            
            if(event.srcElement.innerText && event.srcElement.className === 'apexcharts-legend-text'){
              that.productNameEmitter.emit(event.srcElement.innerText)
            }
          }
        }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'square',
        colors: ['var(--containers)'],
        width: 1,
        dashArray: 0,
      },
      plotOptions: {
        pie: {
          offsetX: 10,
          offsetY: 30,
          expandOnClick: true,
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: false,
              total: {
                showAlways: false,
                show: false,
              },
            },
          },
        },
      },
      labels: [''],
      dataLabels: {
        enabled: this.labelsVisible,
        formatter: function (val) {
          return val.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"
        },
      },
      fill: {
        type: 'color',
        opacity: 1,
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      legend: {
        show: true,
        height: this.legendHeight,
        width: this.legendWidth,
        horizontalAlign: 'center',
        position: 'right',
        fontSize: '13px',
        labels: {
          colors: '#808080',
          useSeriesColors: false,
        },
        // formatter: function (val) {
        //   return val.toLocaleString('en-US');
        // },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
      },
    };
    this.setChartOptions()
  }

  setChartOptions() {
    console.log(this.graphdata)
    console.log(this.title)
    if (this.graphdata.length !== 0) {
      this.ChartOptions.labels = this.graphdata.map(
        (d: any) => d.title
      );

      this.ChartOptions.series = this.graphdata.map((d: any) =>
        parseFloat(d.value || 0)
      );
      if (this.title === "eventsChart"){
        this.ChartOptions.tooltip = {
          enabled: true,
          y: {
            title: {
              formatter: function (_seriesName) {
                return _seriesName;
              },
            },
          },
        };
      } else {
        this.ChartOptions.tooltip = {
          enabled: true,
          y: {
            formatter: (val) => {
              return this.commonApi.formatNumber(val);
            },
            title: {
              formatter: function (_seriesName) {
                return _seriesName;
              },
            },
          },
        };
      }
     
    }

    this.chartdata = this.graphdata;    //Added Changes by Arsh P. on 16-June-2022.
    
  }

}
