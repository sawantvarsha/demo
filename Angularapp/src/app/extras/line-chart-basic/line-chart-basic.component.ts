import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { CommonApiService } from './../../services/common-api.service';
import { ChartService } from './../../themeService/chart.service';
import { CommonfunctionService } from 'src/app/components/fx-order/commonfunction.service';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexLegend,

} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  colors: any[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-line-chart-basic',
  templateUrl: './line-chart-basic.component.html',
  styleUrls: ['./line-chart-basic.component.scss']
})
export class LineChartBasicComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  graphdata: any;
  @Input() get _graphdata(): any[] {
    return this.graphdata;
  }

  set _graphdata(data) {
    this.chartData = [];
    console.log("CHART", data);
    this.graphdata = data;
  }
  @Input() height: any;
  @Input() title: any;
  @Input() name: any;
  @Input() width: any;
  @Input() legend: any;
  @Input() legendFlag: any;
  @Input() xAxis: any;
  @Input() xTitle: any = '';
  @Input() yTitle: any = '';

  colors: any;
  currentdata: any;
  data: any;
  xaxisLabels: any;
  tempxaxisLabels: any;
  chartData: ApexAxisChartSeries = [];
  chartSeries: any;
  chartDATA1: { name: string; data: number[] }[];

  constructor(public chartService: ChartService,) {
    this.xaxisLabels = []
  }

  ngOnInit(): void {
    console.log("GRAPE", this.graphdata)
    this.initiateChart();
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors;
        this.initiateChart();
      }
    });
  }

  initiateChart() {
    this.setChartOptions(this.graphdata)
    console.log(this.graphdata);
    if (this.graphdata.length) {
      this.graphdata.forEach((it) => {
        this.drawchart(it);
      });
    }
  }
  drawchart(Graph) {
    console.log(Graph);
    //this.chartSeries = this.graphdata
    //[
    //   { x: 0, y: 10 },
    //   { x: 2, y: 11 },
    //   { x: 3, y: 12 },
    //   { x: 4, y: 13 },
    //   { x: 5, y: 14 },
    //   { x: 6, y: 14 }
    //];
    // console.log(Graph);
    //this.chartData.push(this.chartSeries);
    // this.graphdata.forEach(g => {
    // var xValue = [];
    // var yValue = [];
    //console.log(g)
    //xValue = g
    // g.forEach(element => {
    //   yValue.push(element.data.y);
    //   // yValue.push(element.y);
    // });
    //console.log(xValue, yValue)
    this.chartData = []
    this.chartSeries = {
      name: Graph.name,
      data: Graph.data,
      scenario: Graph.scenario,
    };
    this.chartData.push(this.chartSeries);
    this.chartData = this.chartData.filter(function (element) {
      return element !== undefined;
    });
    // console.log(this.chartDATA1)
    console.log(this.chartData);
    //});

    this.chartOptions = {
      series: this.chartData,
      // [
      //   {
      //     // data: this.data,
      //     name: "Spots",
      //     data: this.chartData
      //   }
      // ],

      chart: {
        height: this.height,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'linear',
          speed: 5000,
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
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      title: {
        // text: "Product Trends by Month",
        align: 'left',
      },
      grid: {
        show: false,
        row: {
          //colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      
      xaxis: {
        //decimalsInFloat: 0,
        title: {
          text: this.xTitle,
          style: {
            color: 'var(--heading-label)',
            fontSize: '14px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        tickPlacement: 'on',
        // range: 12,
        type: 'category',
        // overwriteCategories: this.xaxisLabels,
        // tickPlacement: 'between',
        labels: {
          rotate: -45,
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-label',
          },
          hideOverlappingLabels: true,
          showDuplicates: false,
          // trim: true,
        },
      },
      yaxis: {
        //decimalsInFloat: 0,
        title: {
          text: this.yTitle,
          style: {
            color: 'var(--heading-label)',
            fontSize: '14px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        labels: {
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-label',
          },
          formatter: function (val) {
            return val.toLocaleString('en-US');
          },
        },
      },
      colors: this.colors,
      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center',
      },
    };
    console.log(this.chartOptions);


  }
  setChartOptions(Graph) {
    console.log(Graph);
    if (Graph.length !== 0) {
      this.tempxaxisLabels = Graph.map((d: any) => d.data);
      console.log(this.tempxaxisLabels, this.tempxaxisLabels.length);

      let tempArray = this.tempxaxisLabels[0];
      // var j = 1;
      // let temp = Math.round(this.tempxaxisLabels[0].length / 20);
      // console.log(temp)
      // for (let i = 1; i <= 19; i++) {
      //   tempArray.splice(i, temp);
      //   console.log('Done');
      // }
      tempArray.map(String);
      tempArray.forEach((t) => {
        this.xaxisLabels.push(t.x.toString());
      });
      console.log(this.xaxisLabels);

      // this.drawchart(Graph);
    }
  }

}
