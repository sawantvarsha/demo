import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartInput = {
  chartType: string;
  series: any;
  width?: number | string;
  height?: number;
  title: string;
  theme: string;
  Xlabels?: string[];
  tooltipLabels?: any;
  lineColor?: any;
  markerSize?: any;
  showLabel?: any;
};

@Component({
  selector: 'app-underlying-linechart',
  templateUrl: './underlying-linechart.component.html',
  styleUrls: ['./underlying-linechart.component.scss']
})
export class UnderlyingLinechartComponent implements OnInit {

  @Input() chartInput!: ChartInput;
  @Input('lastCommonDate') lastCommonDate: any;
  @Input('ObservationDates') ObservationDates: any = [];
  @Input('underlyingsCount') underlyingsCount: number;

  yAxisLabels: any = [];

  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> | any;

  constructor() { }

  ngOnInit(): void {
    for (let i = this.underlyingsCount; i < this.chartInput.series.length; i++) {
      const labelValue = this.chartInput.series[i].data?.find((el) => el !== null);
      if(labelValue !== undefined){
        if(!this.yAxisLabels.includes(Number(labelValue))){
          this.yAxisLabels.push(Number(labelValue));
        }
      }
    }
    if(!this.yAxisLabels.includes(Number(100))){
      this.yAxisLabels.push(Number(100));
    }
    let markerColor = [];
    if( this.chartInput.series.length == 1){
      markerColor = ['#435EBE'];
    }
    else if(this.chartInput.series.length == 2){
      markerColor = ['#435EBE','#06928F'];

    }
    else if(this.chartInput.series.length == 3){
      markerColor = ['#435EBE','#06928F','#FE9327'];

    }
    else if(this.chartInput.series.length == 4){
      markerColor = ['#435EBE','#06928F','#FE9327','#ff4560'];

    }
    else if(this.chartInput.series.length == 5){
      markerColor = ['#435EBE','#06928F','#FE9327','#ff4560','#50327C'];
    }
    else{
      markerColor = ['#435EBE','#06928F','#FE9327','#ff4560','#50327C',"#0000ff"];
    }

    this.chartOptions = {
      series: this.chartInput.series,
      chart: {
        height: this.chartInput.height,
        width: this.chartInput.width,
        type: this.chartInput.chartType,
        zoom: {
          enabled: false
        },
        animations: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#e6194B","#3cb44b","#4363d8","#f58231", '#911eb4', '#42d4f4', '#f032e6', '#bfef45'],
	    tooltip: {
        custom: this.customTooltip.bind(this)
      },
      annotations: {
        xaxis: [
          {
            x: new Date(this.lastCommonDate).getTime(),
            borderColor: '#800000',
            strokeDashArray: 0,
            label: {
              borderColor: '#800000',
              orientation: 'horizontal',
            }
          },
          // Strike Date to be shown in timeline chart | 11-Oct-2023
          {
            x: new Date(this.chartInput.Xlabels[0].trim().replaceAll(' ', '-')).getTime(),
            borderColor: 'transparent',
            strokeDashArray: 3,
            label: {
              borderColor: 'transparent',
              orientation: 'vertical',
              text: (this.chartInput.Xlabels[0].trim().replaceAll(' ', '-')),
              offsetY: 71,
              offsetX: -25,
              textAnchor: 'start',
              position: 'bottom',
              style: { 
                color: '#808080', 
                background: 'transparent',
                fontWeight: 500,
              },
            }
          },
          // Maturity Date to be shown in timeline chart | 18-Oct-2023
          {
            x: new Date(this.chartInput.Xlabels[this.chartInput.Xlabels.length - 1].trim().replaceAll(' ', '-')).getTime(),
            borderColor: '#5A5A5A',
            strokeDashArray: 3,
            label: {
              borderColor: 'transparent',
              orientation: 'vertical',
              text: (this.chartInput.Xlabels[this.chartInput.Xlabels.length - 1].trim().replaceAll(' ', '-')),
              offsetY: 71,
              offsetX: -25,
              textAnchor: 'start',
              position: 'bottom',
              style: { 
                color: '#808080', 
                background: 'transparent',
                fontWeight: 500,
              },
            }
          }
        ],
        yaxis: []
      },
      dataLabels: {
        enabled: false
      },
      // title: {
      //   text: 'Chart Title',
      //   align: 'left',
      //   margin: 1,
      //   offsetY: 0,
      //   style: {
      //     fontSize: '16px',
      //     fontWeight: 400,
      //     fontFamily: 'Italic'
      //   },
      // },
      xaxis: {
        type: "datetime",
        categories: this.chartInput.Xlabels,
        tooltip: {
          enabled: false
        },
        labels: {
          show: this.chartInput.showLabel,
          rotate: -45,
          style: {
            colors: 'transparent',
            fontSize: '11px',
            fontFamily: 'Helvetica, Arial, sans-serif',
          },
          minHeight: 79
        },
        // colors: ["#FF1654", "#247BA0"],
        tickAmount: 20,
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
          stroke: {
            color: '#232323',
            width: 0,
            dashArray: 0,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: 'transparent'
          },
        },
        axisBorder: {
          show: true,
        },
      },
      theme: {
        mode: 'light',
        palette: 'palette1',
      },
      stroke: {
        show: true,
        width: 2,
      },
      grid: {
        borderColor: 'transparent'
      },
      plotOptions: {
        line: {
          horizontal: false,
          dataLabels: {
            enabled: false,
          },
        }
      },
      legend : {
        show: true,
        showForSingleSeries: true,
        position: 'left',
        horizontalAlign: 'left', 
        offsetX: -15,
        offsetY: -4,
        width: 200,
        fontSize: '15px',
        labels : {
          colors :'#f7f7f7'
        },
        // markers: {
        //   fillColors: markerColor    
        // },
      }
    };

    this.ObservationDates.forEach(element => {
      this.chartOptions.annotations.xaxis.push(
        {
          x: new Date(element.Date).getTime(),
          borderColor: '#5A5A5A',
          strokeDashArray: 3,
          label: {
            borderColor: 'transparent',
            orientation: 'horizontal',
            text: this.getIcon(element.icon),
            offsetY: -12,
            offsetX: -4,
            textAnchor: 'start',
            position: 'top',
            style: { 
              y:-20,
              color: this.getIconColor(element.icon), 
              cssClass: this.getIconClass(element.icon),
              background: this.getIconBgColor(element.icon), 
              stroke:'transparent', 
              fontFamily: 'Segoe UI Symbol',
              fontWeight: 600,
              fontSize: '14px',
            },
          }
        },
        {
          x: new Date(element.Date).getTime(),
          borderColor: '#5A5A5A',
          strokeDashArray: 3,
          label: {
            borderColor: 'transparent',
            orientation: 'vertical',
            text: element.Date,
            offsetY: 71,
            offsetX: -25,
            textAnchor: 'start',
            position: 'bottom',
            style: { 
              color: '#808080', 
              background: 'transparent',
              fontWeight: 500,
            },
          }
        }
      )
    });

    this.yAxisLabels.forEach(element => {
      this.chartOptions.annotations.yaxis.push(
        {
          y: element,
          borderColor: 'transparent',
          strokeDashArray: 0,
          label: {
            text: element.toFixed(2),
            textAnchor: 'end',
            position: 'left',
            borderColor: 'transparent',
            offsetX: -8,
            offsetY: 7,
            style: {
              background: 'transparent',
              color: '#808080',
              fontSize: '11px',
              fontWeight: 400,
            },
          }
        }
      )
    });

    console.log("Chart Options - ",this.chartOptions )  


  }

  // Binding function for custom tooltip on apexchart
  customTooltip({ series, seriesIndex, dataPointIndex, w }: any) {

    let result = "";
    // SVG icon for events which are occured (tick-mark)
    let successfulSVGIcon = `<div style="width:13px;height:13px;">
    <svg viewBox="0 0 44.325 44.445" [ngStyle]="{ width: width + 'px', height: height + 'px', fill: color }">
      <use href="#tick-mark" />
    </svg>
    <svg  width="44.325" height="44.445" viewBox="0 0 44.325 44.445"
      style="display: none;">
      <g id="tick-mark" transform="translate(0 0)">
        <g id="Group_52" data-name="Group 52">
          <path id="Path_207" data-name="Path 207"
            d="M0,22.163A21.993,21.993,0,0,1,19.606.129,21.624,21.624,0,0,1,37.248,5.946a21.587,21.587,0,0,1,6.965,14.035,21.529,21.529,0,0,1-5.829,17.386,21.613,21.613,0,0,1-15.1,7.046A22.19,22.19,0,0,1,0,22.163M14.1,20.489a1.656,1.656,0,0,0-1.775,1.234,1.854,1.854,0,0,0,.6,2.059c1.769,1.783,3.573,3.532,5.319,5.336,1.372,1.418,2.41,1.231,3.618.01C25.557,25.392,29.286,21.69,33,17.974a4.826,4.826,0,0,0,.533-.567,1.765,1.765,0,0,0-.256-2.594,1.914,1.914,0,0,0-2.488.126,23.161,23.161,0,0,0-1.9,1.753c-2.76,2.784-5.6,5.487-8.234,8.4-.412.455-.661.439-1.077,0-1.071-1.132-2.146-2.27-3.315-3.3-.631-.553-1.151-1.417-2.168-1.305"
            fill="#9ae6ac" />
        </g>
      </g>
    </svg>
  </div>`;
    // SVG icon for events which are NOT occured (cross-mark)
    let unsuccessfulSVGIcon = `<div style="width:15px;height:15px;">
    <svg viewBox="0 0 60.092 60.123" [ngStyle]="{ width: width + 'px', height: height + 'px', fill: color }">
      <use href="#unsuccessful-icon" />
    </svg>
    <svg  width="60.092" height="60.123" viewBox="0 0 60.092 60.123"
      style="display: none;">
      <g id="unsuccessful-icon" transform="translate(0 0)">
        <g id="Group_49" data-name="Group 49">
          <path id="Path_204" data-name="Path 204"
            d="M19.326,58.158a29.91,29.91,0,0,1-8.495-5.085A29.014,29.014,0,0,1,.524,35.388a29.105,29.105,0,0,1,6.839-25A28.392,28.392,0,0,1,24.412.512,30.247,30.247,0,0,1,39.986,1.691a29.46,29.46,0,0,1,17.548,16.1A29.005,29.005,0,0,1,60,27.834,29.81,29.81,0,0,1,43.432,56.9a29.98,29.98,0,0,1-23.659,1.506c-.056-.249-.1-.527-.447-.249m15-27.408a1.968,1.968,0,0,0-.237-1.226q3.5-3.545,7.006-7.092a2.209,2.209,0,0,0,.568-2.63,2.531,2.531,0,0,0-4.3-.667c-2.156,2.1-4.312,4.214-6.377,6.407-.781.829-1.264.716-1.971-.008-2.161-2.21-4.359-4.384-6.552-6.563a2.341,2.341,0,0,0-3.5.044c-1,1.055-.876,2.6.345,3.839q3.261,3.3,6.563,6.553c.464.454.522.735.019,1.206-1.086,1.015-2.119,2.085-3.163,3.145-1.315,1.336-2.694,2.62-3.9,4.048A2.451,2.451,0,0,0,22.6,40.939c2.18-2.183,4.384-4.344,6.53-6.56.629-.649,1.064-.769,1.694-.031s1.37,1.4,2.062,2.087c1.522,1.522,3.02,3.069,4.573,4.558a2.627,2.627,0,0,0,3.761.042,2.469,2.469,0,0,0-.3-3.611q-3.3-3.33-6.593-6.674"
            fill="#fc3535" />
          <path id="Path_205" data-name="Path 205" d="M19.326,58.158c.35-.277.391,0,.447.249a.361.361,0,0,1-.447-.249"
            fill="#fc3535" />
          <path id="Path_206" data-name="Path 206"
            d="M34.33,30.75c-.378-.351-1.168-.622-.237-1.226a1.968,1.968,0,0,1,.237,1.226" fill="#fc3535" />
        </g>
      </g>
    </svg>
  </div>`

    // Marker colors for showing prices on tooltip
    let markerColor = ["#e6194B","#3cb44b","#4363d8","#f58231", '#911eb4', '#42d4f4', '#f032e6', '#bfef45'];

    // for Observation Date
    let ObservationDatesArray = [];
    let obsEventData = "";
    let dt1, dt2;
    dt2 = new Date(this.lastCommonDate.trim());

    this.ObservationDates.forEach(element => {
      ObservationDatesArray.push(element.Date.trim());
    });
    if (ObservationDatesArray.indexOf(this.chartInput.Xlabels[dataPointIndex].trim()) !== -1) {

      dt1 = new Date(this.chartInput.Xlabels[dataPointIndex].trim());

      // Add event on tooltip if date is Observation/Event date
      this.ObservationDates.forEach(element => {
        if (element.Date == this.chartInput.Xlabels[dataPointIndex].trim()) {
          if (dt1 <= dt2) {
            obsEventData += '<div style="text-align:left; padding:2px; font-size:12px; color: #9ae6ac; display:flex; flex-direction:row; justify-content:flex-start; align-items:center;">' + '<div>' + successfulSVGIcon + '</div>' + '<div style="margin-left: 5px;">' + element.Event + '</div>' + '</div>';
          }
          else {
            obsEventData += '<div style="text-align:left; padding:2px; font-size:12px; color: #9ae6ac; display:flex; flex-direction:row; justify-content:flex-start; align-items:center;">' + '<div>' + unsuccessfulSVGIcon + '</div>' + '<div style="margin-left: 5px;">' + element.Event + '</div>' + '</div>';
          }
        }
      });
    }

    // Creating HTML script for custom tooltip
    result += '<div class="arrow_box">';

    let obsDateData = '<p class="date" style="background-color: var(--active); color: var(--white); text-align:center; padding:2px 5px; font-size:11px;">' + this.chartInput.Xlabels[dataPointIndex].trim().replaceAll(' ', '-') + '</p>';
    result += obsDateData;
    result += obsEventData;

    // For single underlying charts at bottom
    if (this.chartInput.series.length === 1) {
      dt1 = new Date(this.chartInput.Xlabels[dataPointIndex].trim());
      if (dt1 <= dt2) {
        result += '<p style="text-align:left; padding:2px 5px; font-size:11px;">' + '<span style="  height: 10px; width: 10px; background-color: ' + markerColor[0] + '; border-radius: 50%;display: inline-block; margin: 0px 3px;"></span>' + this.chartInput.series[0].name + ':  ' + this.chartInput.series[0].data[dataPointIndex] + '</p>';
      }
      // else {
      //   result = obsDateData;
      // }
    }
    // For Overall underlying chart at top
    else {
      for (let i = 0; i < this.chartInput.series.length; i++) {
        dt1 = new Date(this.chartInput.Xlabels[dataPointIndex].trim());
        if (dt1 <= dt2) {
          // Portfolio Snapshot : Stepwise Autocall and Coupon Barrier in Timeline chart | 12-Sep-2023
          result += '<p style="text-align:left; padding:2px 5px; font-size:11px;">' + '<span style="  height: 10px; width: 10px; background-color: ' + markerColor[i] + '; border-radius: 50%;display: inline-block; margin: 0px 3px;"></span>' + this.chartInput.series[i].name + ':  ' + (this.chartInput.series[i].data[dataPointIndex] !== null ? this.chartInput.series[i].data[dataPointIndex] + '%' : '-') + '</p>'
        }
        else {
          // Showing KI,STRIKE,KO data on tooltip
          if (i >= this.underlyingsCount) {
            // Portfolio Snapshot : Stepwise Autocall and Coupon Barrier in Timeline chart | 12-Sep-2023
            result += '<p style="text-align:left; padding:2px 5px; font-size:11px;">' + '<span style="  height: 10px; width: 10px; background-color: ' + markerColor[i] + '; border-radius: 50%;display: inline-block; margin: 0px 3px;"></span>' + this.chartInput.series[i].name + ':  ' + (this.chartInput.series[i].data[dataPointIndex] !== null ? this.chartInput.series[i].data[dataPointIndex] + '%' : '-') + '</p>';
          }
          // else {
          //   result = obsDateData;
          // }
        }
      }
    }

    result += '</div>';

    return result;
  }

  getIcon(icon) {
    switch (icon) {
      case 'yellow-hyphen':
        return '—';
      case 'dark-green tick':
        return '✓';
      case 'question':
        return '?';
      case 'red-cross':
        return '✕';
      case 'light-green tick':
        return '✓';
    }
  }

  getIconColor(icon) {
    switch (icon) {
      case 'yellow-hyphen':
        return '#ffc000';
      case 'dark-green tick':
        return '#ffffff';
      case 'question':
        return 'transparent';
      case 'red-cross':
        return '#FF0000';
      case 'light-green tick':
        return '#ffffff';
    }
  }

  getIconBgColor(icon) {
    switch (icon) {
      case 'yellow-hyphen':
        return 'transparent';
      case 'dark-green tick':
        return '#006946';
      case 'question':
        return 'transparent';
      case 'red-cross':
        return 'transparent';
      case 'light-green tick':
        return '#38bd91';
    }
  }

  getIconClass(icon) {
    switch (icon) {
      case 'question':
        return 'markerLineIconColor';

      default:
        return 'markerLineIcon';
    }
  }

}
