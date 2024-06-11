import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexNoData,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
  noData: ApexNoData;
  title: ApexTitleSubtitle;
  colors: string[];
  legend: ApexLegend;
};
import { CommonApiService } from './../../services/common-api.service';
import { ChartService } from './../../themeService/chart.service';
@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class ColumnChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public ChartOptions: Partial<ChartOptions>;
  graphdata: any;
  @Input() get _graphdata(): any[] {
    return this.graphdata;
  }
  set _graphdata(data) {
    this.graphdata = data;
    console.log("graphdata" , this.graphdata)
    this.drawchart();
  }
  @Input() height: any;
  @Input() title: any = '';
  @Input() name: any = '';
  @Input() xTitle: any = '';
  @Input() yTitle: any = '';
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
        this.drawchart();
      }
    });
  }
  drawchart() {
    this.currentdata = this.graphdata;
    this.ChartOptions = {
      series: [
        {
          name: this.name,
          data: [0],
        },
      ],
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
      chart: {
        offsetX: 0,
        // width: '100%',
        height: this.height,
        type: 'bar',
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
      plotOptions: {
        bar: {
          columnWidth: '30%',
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: 'middle',
        distributed: false,
        offsetX: 0,
        offsetY: 0,
      },
      stroke: {
        width: 2,
      },
      grid: {
        show: false,
      },
      xaxis: {
        title: {
          text: this.xTitle,
          style: {
            color: 'var(--heading-label)',
            fontSize: '14px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },

        labels: {
          maxHeight: 100,
          rotate: -45,
          trim: true,
          style: {
            colors: '#808080',
            fontSize: '12px',
          },
        },
        categories: [''],
        tickPlacement: 'between',
      },
      yaxis: {
        title: {
          text: this.yTitle,
          style: {
            color: 'var(--heading-label)',
            fontSize: '14px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        decimalsInFloat: 2,
        labels: {
          align: 'right',
          formatter: function (val) {
            return val.toLocaleString('en-US');
          },
          style: {
            colors: '#808080',
            fontSize: '12px',
          },
        },
      },
      colors: this.colors,
      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'bottom',
        horizontalAlign: 'center',
      },
    };

    this.setChartOptions();
  }

  setChartOptions() {
    // console.log(this.graphdata)
    if (this.graphdata.length !== 0) {
      this.ChartOptions.series[0].data = this.graphdata.map((d: any) => d[1]);
      this.ChartOptions.xaxis.categories = this.graphdata.map((d: any) => d[0]);
      console.log(this.ChartOptions);
    }
  }
  ngOnChanges() {
    // console.log(this.graphdata)
    if (JSON.stringify(this.graphdata) !== JSON.stringify(this.currentdata)) {
      this.drawchart();
    }
  }
}
