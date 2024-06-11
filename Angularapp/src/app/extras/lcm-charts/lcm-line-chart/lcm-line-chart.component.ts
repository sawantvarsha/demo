import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { ChartService } from '../../../themeService/chart.service';
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
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend
};
@Component({
  selector: 'app-lcm-line-chart',
  templateUrl: './lcm-line-chart.component.html',
  styleUrls: ['./lcm-line-chart.component.scss']
})
export class LcmLineChartComponent implements OnInit, OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() graphdata: any[];
  @Input() chartDataX: any[];
  @Input() height: any;
  @Input() title: any;
  @Input() name: any;
  @Input() width: any = 700;
  @Input() legend: any;
  @Input() legendFlag: any;
  @Input() xAxis: any;

  colors: any;
  currentdata: any;
  data: any;
  xaxisLabels: any;
  tempxaxisLabels: any;
  chartData: ApexAxisChartSeries = [];
  chartSeries: any
  chartDATA1: { name: string; data: number[]; }[];
  constructor() { }

  ngOnInit(): void {
    console.log('graphdata',this.graphdata);
    // this.graphdata.forEach((it) => {
    //   this.drawchart(it)
    // })
    //this.setChartOptions(this.graphdata);
  }

  drawchart(Graph) {
    console.log('graphdata' , Graph, this.graphdata);
     //this.chartSeries = this.graphdata
     //[
    //   { x: 0, y: 10 },
    //   { x: 2, y: 11 },
    //   { x: 3, y: 12 },
    //   { x: 4, y: 13 },
    //   { x: 5, y: 14 },
    //   { x: 6, y: 14 }
     //];
    console.log(Graph)
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
          // y:yValue
      }
      this.chartData.push(this.chartSeries)
      this.chartData = this.chartData.filter(function( element ) {
        return element !== undefined;
     });
      // console.log(this.chartDATA1)
      // console.log(this.chartData)
    //});

    console.log("chartdata ", this.chartData, this.chartDataX)

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
        width: this.width,
        type: "line",
        stacked: false,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width:1.5,
        
        
      },
      title: {
        // text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        // row: {
        //   colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        //   opacity: 0.5
        // }
      },
      xaxis: {
        type:'numeric',
        decimalsInFloat: 0,
        title: {
          text: "Trading Days",
          style: {
            color: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',
           }
        },
        // range: 12,
        // overwriteCategories: this.xaxisLabels,
        categories: this.chartDataX,
        // tickPlacement: 'between',
        labels: {
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-label',

          },
          hideOverlappingLabels: true,
          // trim: true,
          rotate: 0,

        }
      },
      yaxis: {
        decimalsInFloat:2,
        title: {
          text: "",
          style: {
           color: '#808080',
           fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',
          }
        },
        labels: {
          style: {
            colors: '#808080',
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-label',
          },
          
        }
      },
    };
    //this.setChartOptions()
  }
  setChartOptions(Graph) {
    console.log(Graph)
    this.chartData = [];
    if (Graph.length !== 0) {
      this.tempxaxisLabels = Graph.map(
        (d: any) => d.data
      );
      console.log(this.tempxaxisLabels, this.tempxaxisLabels.length)

      let tempArray = this.tempxaxisLabels;
      var j = 1;
      let temp = Math.round(this.tempxaxisLabels.length / 20);
      for (let i = 1; i <= 21; i++) {
        tempArray.splice(i, temp - 2);
        console.log("Done")
      }
      // console.log(tempArray);
      tempArray.map(String)
      this.xaxisLabels = tempArray
      console.log('x axis labels', this.xaxisLabels)

      this.drawchart(Graph);

    }
  }

  // lineCount() {
  //   console.log(this.graphdata[0]);
  //   //this.setChartOptions(this.graphdata[0]);
  //   this.graphdata.forEach(element => {
  //     this.setChartOptions(element)
  //   });
  // }


  ngOnChanges() {
    console.log('on change graph data', this.graphdata)
    // this.setChartOptions(this.graphdata);
  //   if (JSON.stringify(this.graphdata) !== JSON.stringify(this.currentdata)) {
    //   this.drawchart()
  //   }
    this.chartData = []
    this.graphdata.forEach((it) => {
      this.drawchart(it)
    })

  }
}
