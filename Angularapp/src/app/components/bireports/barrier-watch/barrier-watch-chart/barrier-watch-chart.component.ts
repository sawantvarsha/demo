import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { BarrierWatchService } from '../barrier-watch.service';
import { DashboardServiceService } from '../../galaxy-dashboard/dashboard-service.service';
import { BIReportsComponent } from '../../bireports.component';
import { BarrierWatchComponent } from '../barrier-watch.component';

@Component({
  selector: 'app-barrier-watch-chart',
  templateUrl: './barrier-watch-chart.component.html',
  styleUrls: ['./barrier-watch-chart.component.css']
})
export class BarrierWatchChartComponent {
  private dataSubscription: Subscription = new Subscription;
  maxKID: any;
  minKID: any;
  maxKOD: any;
  minKOD: any;
  minXaxis: any;
  maxXaxis: any;
  maxRadiuss:number=0;
  chart: any;
  clicked = false;
  previousIndex: any;
  data1: any[]=[];
  apiData: any = []
  color: any = []
  col: any = "rgba(19,56,86,1)"
  col1: any = "rgba(19,56,86,0.5)"
  categories: any = []
  label: any = []
  indices:any=[]

  interpolateColors(color1, color2, ratio) {
     //console.log(this.maxRadiuss)
     const normalizedRatio = ratio / this.maxRadiuss;
    const r = Math.round((color2[0] - color1[0]) * normalizedRatio + color1[0]);
    
    //console.log(r)
    const g = Math.round((color2[1] - color1[1]) * normalizedRatio + color1[1]);
    //console.log(g)
    const b = Math.round((color2[2] - color1[2]) * normalizedRatio + color1[2]);
    //console.log(b)
    return [r, g, b];
  
   
  }  
  data: any = {
    //xLabels:[],
    datasets: [{
      label: 'KI & KO Distance',
      data: [],
      backgroundColor: [],

      pointHoverBorderColor: 'white',
      hoverRadius: 10,
      // hitRadius:5

    }]
  };


  constructor(private httpClient: HttpClient, private service: BarrierWatchService, private dashboardService :DashboardServiceService,private bIReportsComponent:BIReportsComponent,private barrierWatchComponent:BarrierWatchComponent) {

  }

  setProperties() {
    //console.log(this.service.apiData)

    this.color = []
    this.minKID = this.service.getMinKIDis();
    //console.log(this.minKID)
    this.minKOD = this.service.getMinKODis();
    this.maxKID = this.service.getMaxKIDis();
    this.maxKOD = this.service.getMaxKODis();
    this.minXaxis = this.service

    // var data1: any = []
    // this.apiData.map((ele: any, index: any) => {
    //   if (ele.eqvNotional >= 5000000) {
        // this.data1.push(
        //   {
        //     p: ele.ProductID,
        //     x: ele.KIDistance,
        //     y: ele.KODistance,
        //     r: Math.max(ele.eqvNotional / 500000, 10)
        //   }
        // )
        // '#133856'
      //   this.color.push('rgba(14,56,86,0.8)')
      // }
      // else if (ele.eqvNotional >= 1000000 && ele.eqvNotional < 5000000) {
        // this.data1.push(
        //   {
        //     p: ele.ProductID,
        //     x: ele.KIDistance,
        //     y: ele.KODistance,
        //     r: Math.max(ele.eqvNotional / 500000, 10)
        //   }
        // )
        // 'rgba(78, 141, 217,1)'
        // '#244867'
      //   this.color.push('rgba(36,72,103,0.8)')
      // }
      // else {
        // this.data1.push(
        //   {
        //     p: ele.ProductID,
        //     x: ele.KIDistance,
        //     y: ele.KODistance,
        //     r: Math.max(ele.eqvNotional / 500000, 10)
        //   }
        // )
        //#9ab9d3
  //       this.color.push('rgba(154,185,211,0.8)')
  //     }
  //     this.data1.push(
  //       {
  //         p: ele.ProductID,
  //         x: ele.KIDistance,
  //         y: ele.KODistance,
  //         r: Math.max(ele.eqvNotional / 520000, 11)
  //       }
  //     )
  //     this.label.push(ele.ProductID.toString());

  //   })

  //   this.data.datasets[0].data = [...this.data1]
  //   this.data.labels = this.label
  //   this.data.datasets[0].backgroundColor = [...this.color]
  // }

  }
  createChart(){
    this.chart = new Chart("kikoChart", {
      type: 'bubble',
      data: this.data,
      options: {

       responsive: false,
        // maintainAspectRatio:false,
        

        onClick: (event, activeElem) => {
          //console.log(activeElem)
          //console.log(event)

          if(activeElem.length!==0){
          if ((!(this.indices.includes(activeElem[0].index)))) {
             this.indices.push(activeElem[0].index)
            var background1 = this.chart.data.datasets[0].backgroundColor;
            for (let i = 0; i < background1.length; i++) {
              if (!(this.indices.includes(i))) {
                background1[i] = this.col1;
              } if (this.indices.includes(i)) {
                background1[i] = this.col;
              }
            }
            this.chart.data.datasets[0].backgroundColor = background1;
            // this.clicked = true;
            this.previousIndex = activeElem[0].datasetIndex;

            this.service.modifyKODataOnClick(this.data.datasets[0].data[activeElem[0].index])
            this.service.setTotalProducts(this.indices.length)
            this.chart.update();


          }
          else {
            this.indices=[]
            this.chart.data.datasets[0].backgroundColor = Array(this.apiData.length).fill(this.col);
            this.clicked = false;
            this.service.modifyDataRemovedClick()
            this.chart.update();
          }
        }
          else{
            this.indices=[]
            this.chart.data.datasets[0].backgroundColor = Array(this.apiData.length).fill(this.col);
            this.clicked = false;
            this.service.modifyDataRemovedClick()
            this.chart.update();
          }
        },


        scales: {
          x: {
            offset:false,
            title: {
              color: 'rgba(109,151,191,255)',
              display: true,
              text: 'KI Distance(%)',
              font: {
                size: 20
              }
            },
            min: this.minKID,
            max: this.maxKID,
            grid: {
              //color:'#5a5a5a',
              color: (context) => {
                //console.log(context.tick.value)
                if (context.tick.value === 0)
                  return '#5a5a5a'
                else
                  return '#000000'

              }
            },
            border: {
              
              dash: [2, 8],
            },
            ticks: {
              color: 'rgb(180,180,180)'
              
            },

          },
          y: {
            offset:false,
            title: {
              color: 'rgba(109,151,191,255)',
              display: true,
              text: 'KO Distance(%)',
              font: {
                size: 20
              }
            },
            grid: {
              color: (context) => {
                //console.log(context.tick.value)
                if (context.tick.value === 0)
                  return '#5a5a5a'
                else
                  return '#000000'

              }
            },
            ticks: {
              color: 'rgb(180,180,180)'
              
            },
            border: {
              dash: [2, 8],
            },
            min: this.minKOD-45,
            max: this.maxKOD,
          }
        },
        plugins: {
          legend: {
            display:false,
            align: 'end',
            labels: {
              color: 'rgb(180,180,180)',
              usePointStyle: true,
              font: {
                size: 15
              }
            }
          },
          datalabels: {
            display: false
          },
          tooltip: {
            displayColors: false,
            backgroundColor: 'rgba(70,70,70,0.8)',
            callbacks: {
              title(tooltipItems) {
                return ""
              },
              label() {
                return ``
              },
              afterLabel: (tooltipItem) => {
                ////console.log(this.apidata);
                // //console.log(this.apiData[tooltipItem.dataIndex].Notional);
                //console.log(this.apiData)
                var pname = this.apiData[tooltipItem.dataIndex].ProductName;

                var ko = this.apiData[tooltipItem.dataIndex].KODistance
                var ki = this.apiData[tooltipItem.dataIndex].KIDistance
                var pi = this.apiData[tooltipItem.dataIndex].ProductID
                var no = this.apiData[tooltipItem.dataIndex].eqvNotional
                var asst = this.apiData[tooltipItem.dataIndex]['Asset'];
                var str = `Product ID: ${pi}\nKO Distance(%): ${ko}\nKI Distance(%): ${ki}\n$ Eqv. Notional: ${no}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike@"))}\n${pname.substring(pname.indexOf("Strike@"), pname.indexOf("Coupon@"))}\n${pname.substring(pname.indexOf("Coupon@"))}`;
                //var str = `Product Name: ${this.apidata[tooltipItem.dataIndex].Product_Name}`;
                return str;
              },
            }
          }
        },

      },

    })
  }
  pinChart(e: any) {
    this.barrierWatchComponent.pinned()
    e.preventDefault();
  
    const currentminimunKI=this.service.currentminki
    const currentmaximumKI=this.service.currentmaxki
    const currentminimumKO=this.service.currentminko
    const currentmaximumKO=this.service.currentmaxko
    const asset=this.service.asset

    const data = this.chart.config._config.data.datasets[0].data;
    const type = this.chart.config._config.type;
    const labels = this.chart.config._config.data.labels;
     const options = this.chart.config._config.options;
     const backgroundColor = this.chart.data.datasets[0].backgroundColor;
     const id=2
    
    const borderWidth = 1;
    const borderColor= 'black';
    const title="KI & KO Distance by Products"

    const chart = {
      data, labels, options, backgroundColor, borderColor, borderWidth,id,title,currentminimunKI,currentmaximumKI,currentminimumKO,currentmaximumKO,asset
    }

    //debugger
    ////console.log(this.chartGraph);
    //this.applicationService.setChart(data,type,options);
    this.bIReportsComponent.setChart({type, chart});
  }
 

  ngOnInit() {
    this.createChart()
    this.setProperties()
    this.chart.update();
    this.service.dataReceived.subscribe(() => {
      this.setProperties()
      this.chart.update();
    })


    this.service.data$.subscribe(value => {
   
        //console.log(value)
      this.apiData = [...this.service.filterData]
      this.data1 = []
      this.label = []
      this.color = []
      const lightColor = [154, 185, 211]; // Light blue  
      const darkColor = [14, 56, 86]; // Dark blue color21,76,121
    

    
      // //console.log(this.apiData)
      // this.apiData.sort((a,b)=>a.eqvNotional-b.eqvNotional);
      // let colorArr = [];
      // for (let i = 0; i < this.apiData.length; i++) {
      //   colorArr.push([this.apiData[i], i]);
      // }
      // var red = 132;
      // var green = 163;
      // var blue = 194;
      // var opacity = 0.8;
      // var color = `rgb(${red}, ${green}, ${blue}, ${opacity})`;
      // this.color.push(color);
      // for (let i = 1; i < this.apiData.length; i++) {
      //   if (this.apiData[i].eqvNotional === this.apiData[i - 1].eqvNotional) {
      //     this.color.push(color);
      //   }
      //   else {
      //     red -= 3;
      //     blue -= 3;
      //     green -= 3;
      //     opacity += 0;
        
      //     var color = `rgb(${red}, ${green}, ${blue}, ${opacity})`;
      //     this.color.push(color);
      //   }
      // }
      // colorArr = colorArr.sort();
      // //console.log('HI', colorArr);
      // this.apiData.map((ele: any, index: any) => {
        // if (ele.eqvNotional >= 5000000) {
          // this.data1.push(
          //   {
          //     p: ele.ProductID,
          //     x: ele.KIDistance,
          //     y: ele.KODistance,
          //     r: Math.max(ele.eqvNotional / 500000, 10)
          //   }
          // )
          // '#133856'
          // this.color.push('rgba(14,56,86,0.8)')
        // }
        // else if (ele.eqvNotional >= 1000000 && ele.eqvNotional < 5000000) {
          // this.data1.push(
          //   {
          //     p: ele.ProductID,
          //     x: ele.KIDistance,
          //     y: ele.KODistance,
          //     r: Math.max(ele.eqvNotional / 500000, 10)
          //   }
          // )
          // 'rgba(78, 141, 217,1)'
          // '#244867'
        //   this.color.push('rgba(36,72,103,0.8)')
        // }
        // else {
          // this.data1.push(
          //   {
          //     p: ele.ProductID,
          //     x: ele.KIDistance,
          //     y: ele.KODistance,
          //     r: Math.max(ele.eqvNotional / 500000, 10)
          //   }
          // )
          //#9ab9d3
        //   this.color.push('rgba(154,185,211,0.8)')
        // }

    //     this.data1.push(
    //       {
    //         p: ele.ProductID,
    //         x: ele.KIDistance,
    //         y: ele.KODistance,
    //         r: Math.max(ele.eqvNotional / 520000, 11)
    //       }
    //     )
    //     this.label.push(ele.ProductID.toString());

    //   })

    //   this.data.datasets[0].data = [...this.data1]
    //   this.data.labels = this.label
    //   this.data.datasets[0].backgroundColor = [...this.color]
    //   this.chart.update();

      
    
    // }
    var maxRadius=0;
    this.apiData.forEach((ele) => {
      const radius = ele.eqvNotional / 520000;
       maxRadius = Math.max(maxRadius, radius);
    });
    this.maxRadiuss=maxRadius;
    //console.log(this.maxRadiuss)
    this.apiData.map((ele: any, index: any) => {
      const radius = ele.eqvNotional / 500000;
      // this.maxRadius = Math.max(this.maxRadius, radius);
    
    const interpolatedColor = this.interpolateColors(lightColor, darkColor, radius);
    const rgbaColor = `rgba(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]}, 0.8)`;
    this.color.push(rgbaColor);

    this.data1.push({
      p: ele.ProductID,
      x: ele.KIDistance,
      y: ele.KODistance,
      r: Math.max(radius, 10),
    });

    this.label.push(ele.ProductID.toString());
  });

  this.data.datasets[0].data = [...this.data1];
  this.data.labels = this.label;
  this.data.datasets[0].backgroundColor = [...this.color];
  this.chart.update();

}
)}
  }
