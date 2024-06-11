import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { ChartService } from './../../themeService/chart.service';
import { CommonApiService } from './../../services/common-api.service';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-radial-chart',
  templateUrl: './radial-chart.component.html',
  styleUrls: ['./radial-chart.component.scss']
})
export class RadialChartComponent implements OnInit {
  // @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() chartdata: any;

  colors: any;
  currentTheme: string;
  background: string;
  constructor(public commonApi: CommonApiService, public chartService: ChartService, public themeService: ThemeserviceService) { }

  ngOnInit(): void {
    console.log("chartdata", this.chartdata);
    this.drawChart();

    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        console.log(paletteres, pallete.colors);
        this.colors = pallete.colors
        this.drawChart()
      }
    });

    // this.themeService.themeEmitObs.subscribe((themeres) => {
    //   this.currentTheme = themeres;
    //   if (this.currentTheme !== 'dark') {
    //     this.background = '';
    //   } else {        
    //   this.background = '#696969';           
    //   }
    // });
  }

  drawChart() {
    try {
      
      this.chartOptions = {
        series: this.chartdata,
        chart: {
          height: 350,
          type: "radialBar",
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: "70%",
              background: "var(--light-dark-gray)",
              image: undefined,
              position: "front",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: "#fff",
              strokeWidth: "67%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },
  
            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "17px"
              },
              value: {
                formatter: function(val) {
                  return Number(val) + '%';
                },
                color: "#111",
                fontSize: "36px",
                show: true
              }
            }
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 5000]
          }
        },
        stroke: {
          lineCap: "round"
          // dashArray: 2
        },
        labels: ["Percent"]
      };
    
    } catch (error) {
      
    }
  }
}
