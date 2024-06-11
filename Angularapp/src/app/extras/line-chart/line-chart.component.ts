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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  graphdata: any;
  @Input() get _graphdata(): any[] {
    return this.graphdata;
  }
  
  set _graphdata(data) {
    this.chartData = [];
    console.log("CHART",data);
    this.graphdata = data;
  }
  // set _colors(data) {
  //   this.colors = [];
  //   console.log("COLORS",data);
  //   this.colors = data;
  // }
  @Input() height: any;
  @Input() title: any;
  @Input() name: any;
  @Input() width: any;
  @Input() legend: any;
  @Input() legendFlag: any;
  @Input() xAxis: any;

  currentdata: any;
  data: any;
  xaxisLabels: any;
  tempxaxisLabels: any;
  chartData: ApexAxisChartSeries = [];
  chartSeries: any;
  chartDATA1: { name: string; data: number[] }[];
  tempData: any = [];
  rgb: any = ['#00ff00', '#0000ff', '#ff0000']

  constructor() {
    this.xaxisLabels = []
  }
  @Input() _colors: any;

  ngOnInit(): void {
    console.log("COLORS",this._colors)
    this.initiateChart();
  }

  initiateChart() {
    this.tempData = this.graphdata
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
    this.chartSeries = {
      name: Graph.name,
      data: Graph.data,
      scenario: Graph.scenario,
      // y:yValue
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
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
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
          text: 'Trading Days',
        },
        tickPlacement: 'on',
        // range: 12,
        type: 'category',
        overwriteCategories: this.xaxisLabels,
        // tickPlacement: 'between',
        labels: {
          rotate: 0,
          style: {
            colors: '#808080',
            fontSize: '10px',
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
          text: '',
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
      colors: this._colors.concat(this.rgb),
      // colors: ['#F44336', '#E91E63', '#7046E5', '#BE60ED', '#0E88FA', '#69D4CF', '#39D062', '#FFD438', '#FE9D2C', '#FD433F'],
      // colors: ['#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#fffac8', '#aaffc3','#808000', '#ffd8b1','#a9a9a9' ],
      legend: {
        labels: {
          colors: ['#808080'],
          useSeriesColors: false
        }
      }
    };
    console.log(this.chartOptions);


  }
  setChartOptions(Graph) {
    console.log(Graph);
    if (Graph.length !== 0) {
      this.tempxaxisLabels = Graph.map((d: any) => d.data);
      console.log(this.tempxaxisLabels[0].length);
      // let min = 0
      // let max = this.tempxaxisLabels[0].length
      // let space = Math.floor(max/25)
      // console.log(space)
      // let tempArray = this.tempxaxisLabels[0];
      // var j = 1;
      // let temp = Math.round(this.tempxaxisLabels[0].length / 20);
      // console.log(temp)
      // for (let i = 1; i <= 19; i++) {
        // tempArray.splice(i, temp);
        // console.log('Done');
      // }
      // tempArray.map(String);
      // tempArray.forEach((t) => {
        // this.xaxisLabels.push(t.x.toString());
      // });
      let xaxisLabels1 = []
      xaxisLabels1.push("0")
      let xaxisLabels2 = this.generatePoints(25, this.tempxaxisLabels[0].length)
      let xaxisLabels3 = this.tempxaxisLabels[0].length
      this.xaxisLabels = xaxisLabels1.concat(xaxisLabels2).concat(xaxisLabels3)
      console.log(this.xaxisLabels);
    } else {
      this.xaxisLabels = []
      this.chartData = []
      this.chartOptions.series = []
    }
  }

  generatePoints(count, length) {
    const points = []
    for (let i = 0; i < count; i++) {
      const a = (i + 1) / (count + 1);
      const x = a * length;
      points.push(Math.round(x).toString());
    }
    return points;
  }

  // lineCount() {
  //   console.log(this.graphdata[0]);
  //   //this.setChartOptions(this.graphdata[0]);
  //   this.graphdata.forEach(element => {
  //     this.setChartOptions(element)
  //   });
  // }

  // ngOnChanges() {
  //   // console.log(this.graphdata)
  //   if (JSON.stringify(this.graphdata) !== JSON.stringify(this.currentdata)) {
  //     this.drawchart()
  //   }

  // }
}
