import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { CommonApiService } from './../../services/common-api.service';
import { ChartService } from './../../themeService/chart.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexNoData,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  theme: ApexTheme;
  legend: ApexLegend;
  stroke: ApexStroke;
  fill: ApexFill;
  markers: ApexMarkers;
  responsive : ApexResponsive;
};



@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  @Input() graphdata: any;
  @Input() graphdataprice : any
  @Input() height: any;
  @Input() title: any;
  @Input() name: any;
  colors: any;
  currentdata: any;

  constructor(
    public commonApi: CommonApiService,
    public chartService: ChartService,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.drawchart();
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors;
        console.log('colors', this.colors);
        this.drawchart();
      }
    });



   

    

    console.log("in candle stick chart------------------- = ",this.chartOptions )    


  }

  drawchart() {
    this.currentdata = this.graphdata;
    

    if(this.graphdataprice.series[0].name === 'Closing Price')
    {
      this.currentdata = this.graphdataprice;
      // this.graphdata = this.graphdataprice.series[0].data
      this.chartOptions = {
        series: this.currentdata.series
         
        ,
        // series: [
        //   {
        //     name: this.currentdata.series[0].name,
        //     data: [0],
        //   },
        // ],
        chart: {
          type: 'area',
          height: 350,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          
          fill: {
            colors: ['#FF0000']
          },
          
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
          width: 2,
          // colors: [this.currentdata.lineColor],
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
        title: {
          text: this.title,
          align: 'center',
          style: {
            fontSize: '14px',
            fontWeight: 'normal',
            color: 'var(--heading-label)',
          },
          // margin: 10,
          offsetX: 0,
          offsetY: 0,
        },
        colors: [this.currentdata.lineColor],
        labels: [],
      
        xaxis: {
          categories: this.currentdata.Xlabels,
          // type: 'datetime',
          tooltip: {
            enabled: false
          },
          labels: {
            // show: this.currentdata.showLabel,
            style: {
              colors: '#808080',
              fontSize: '12px',
            },
          },
          tickAmount: 10,
          axisBorder: {
            show : true,
          },
          axisTicks: {
            show: true,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#808080',
              fontSize: '12px',
            },
            formatter: function (val) {
              return val.toLocaleString('en-US');
            },
          },
        },
        legend: {
          horizontalAlign: 'left',
        },
      };
    }
    else
    {
      this.chartOptions = {
        series: [
          {
            name: this.name,
            data: [0],
          },
        ],
        chart: {
          type: 'area',
          height: 350,
          zoom: {
            enabled: false,
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
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
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
        title: {
          text: this.title,
          align: 'center',
          style: {
            fontSize: '14px',
            fontWeight: 'normal',
            color: 'var(--heading-label)',
          },
          // margin: 10,
          offsetX: 0,
          offsetY: 0,
        },
        colors: this.colors,
        labels: [],
        xaxis: {
          type: 'datetime',
          labels: {
            style: {
              colors: '#808080',
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#808080',
              fontSize: '12px',
            },
            formatter: function (val) {
              return val.toLocaleString('en-US');
            },
          },
        },
        legend: {
          horizontalAlign: 'left',
        },
      };
  
    }
    this.setChartOptions();
  }

  setChartOptions() {
    console.log(this.graphdataprice);
    if(this.graphdataprice.series[0].name === 'Closing Price')
    {
     

    }
    else
    {
      if (this.graphdata.length !== 0) {
        this.chartOptions.series[0].data = this.graphdata.map((d: any) => d[1]);
        this.chartOptions.labels = this.graphdata.map((d: any) => d[0]);
  
        // this.chartOptions.xaxis.categories = this.graphdata.map(
        //   (d: any) => d[0]
        // );
        console.log('ChartOptions', this.chartOptions);
    } 
    
    }
  }

  ngOnChanges() {
    // console.log(this.graphdata)
    if (JSON.stringify(this.graphdata) !== JSON.stringify(this.currentdata)) {
      this.drawchart();
    }
  }
}
