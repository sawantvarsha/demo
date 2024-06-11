import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BarrierProbabilityService } from '../barrier-probability.service';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { DashboardServiceService } from '../../galaxy-dashboard/dashboard-service.service';
import { BIReportsComponent } from '../../bireports.component';
import { BarrierProbabilityComponent } from '../barrier-probability.component';

@Component({
  selector: 'app-barrier-probability-chart1',
  templateUrl: './barrier-probability-chart1.component.html',
  styleUrls: ['./barrier-probability-chart1.component.css']
})
export class BarrierProbabilityChart1Component implements OnInit,AfterViewInit {
  
  private dataSubscription: Subscription = new Subscription;
  chart:any;
  clicked=false;
  previousIndex : any;
  public data1:any=[]
  public apiData:any=[]
  categories:any=[]
  label:any=[]
  color:any=[]
  col:any="rgba(76,117,147,0.9)"
  col1:any="rgba(76,117,147,0.4)"

  coll:any='rgba(150, 36, 36,0.7)'
  coll1:any='rgba(194, 2, 2,0.2)'


  ascending:any=true
  descending:any=false
  productId:any=true
  ki:any=false
  selectedOption:string='Ascending'
  selectedOption1:string='ProductID'
  showDiv:any='false'
  indices:any=[]
 tempData:any=[]
  data:any= {

    labels:[],
    datasets: [{
      label: 'KI Probabilities & Distance',
      
      data:[
      ],
      backgroundColor: [],
     // borderColor:'#fff',
      
      pointHoverBorderColor: 'white',
      
      hoverRadius:10,
      
    }]
  };
 
  filterData(value:any){
    this.reportService.selectedOptionKI=value
    this.selectedOption=this.reportService.selectedOptionKI
    this.reportService.modifyKiDataOnFilters(this.reportService.selectedOptionKI)
    
  }
  
  filterData1(value:any){
    this.reportService.selectedOption1KI=value
    this.selectedOption1=this.reportService.selectedOption1KI
    this.reportService.modifyKiDataOnFields(this.reportService.selectedOption1KI)
    
  }

  display(){
   if(this.showDiv=='false'){
    this.showDiv='true'
   }else{
    this.showDiv='false'
   }
  }

  scroll(scroll:any, chart: any) {
   
  console.log(scroll)
  console.log(chart)
  if (scroll.deltaY > 0) {
    if(chart.config._config.options.scales.x.max >= this.apiData.length-1){
      chart.config._config.options.scales.x.min = this.apiData.length-51;
    chart.config._config.options.scales.x.max = this.apiData.length-1;
    }
    else{
      chart.config._config.options.scales.x.min += 10 ;
      chart.config._config.options.scales.x.max += 10;
    }
    
  }
  else if (scroll.deltaY < 0) {
    if (chart.config._config.options.scales.x.min <= 0) {
      chart.config._config.options.scales.x.min = 0;
      chart.config._config.options.scales.x.max = 50;
    }
    else {
      chart.config._config.options.scales.x.min -= 10;
      chart.config._config.options.scales.x.max -= 10;
    }

  }
  else {

  }
  chart.update()
  }

  constructor(private httpClient:HttpClient,private reportService:BarrierProbabilityService, private dashboardService:DashboardServiceService ,private bIReportsComponent:BIReportsComponent,private barrierProbabilityComponent:BarrierProbabilityComponent){

  }
  ngAfterViewInit(): void {
    this.selectedOption=this.reportService.selectedOptionKI
    this.selectedOption1=this.reportService.selectedOption1KI
  }

  
  pinChart(e: any) {
    this.barrierProbabilityComponent.pinned()
    e.preventDefault();
    // console.log(e);
    // console.log(chart);
     console.log(this.chart);
    // const temp = chart;
    // console.log(temp);
    //console.log(this.chartElementRef);
    const currentminimunKI=this.reportService.currentminimunKI
    const currentmaximumKI=this.reportService.currentmaximumKI
    const currentminimumKO=this.reportService.currentminimumKO
    const currentmaximumKO=this.reportService.currentmaximumKO

    const selectedOption=this.reportService.selectedOptionKI
    const selectedOption1=this.reportService.selectedOption1KI

    const data = this.chart.config._config.data.datasets[0].data;
    const type = this.chart.config._config.type;
    const labels = this.chart.config._config.data.labels;
    const options = this.chart.config._config.options;
    const backgroundColor = this.chart.config._config.data.datasets[0].backgroundColor;
    const id=11
    const title="KI Probabilities & Distance"
    const borderWidth = 1;
    const borderColor= 'black';

    const chart = {
      data, labels, backgroundColor, borderColor, borderWidth,id,title,currentminimunKI,currentmaximumKI,currentminimumKO,currentmaximumKO,selectedOption,selectedOption1
    }
    //debugger
    //console.log(this.chartGraph);
    //this.applicationService.setChart(data,type,options);
    this.bIReportsComponent.setChart({type, chart});
  }

  //=====================================================================================



setProperties(){
  console.log(this.reportService.apiData)
  this.apiData= this.reportService.apiData

 for(var i=0;i<this.apiData.length/2-1;i++){
   var temp=this.apiData[i]
   this.apiData[i]=this.apiData[this.apiData.length-1-i]
   this.apiData[this.apiData.length-1-i]=temp
 }
  console.log(this.apiData)
   this.apiData.map((ele:any,index:any)=>{
   if(ele.KIDistance>=0){
   this.data1.push(
       {
         x:ele.ProductID.toString(),
         y:ele.KIProbability*100,
         r:Math.min(50,ele.KIDistance/5+5)
       }
     )
     this.color.push(this.col)
   }
     else{
       this.data1.push(
         {
           x:ele.ProductID.toString(),
           y:ele.KIProbability*100,
           r:Math.min(50,ele.KIDistance*(-1)/5+5)
         }
       )
       this.color.push(this.coll)
     }
     this.label.push(ele.ProductID.toString());
   })
   
   this.data.datasets[0].data=[...this.data1]
    this.data.labels=this.label
    this.data.datasets[0].backgroundColor=[...this.color]
    console.log(this.label)
}

  ngOnInit() {

    //this.setProperties()
    this.selectedOption=this.reportService.selectedOptionKI
    this.selectedOption1=this.reportService.selectedOption1KI
    this.reportService.modifyKIData(this.reportService.currentminimunKI,this.reportService.currentmaximumKI,this.reportService.currentminimumKO,this.reportService.currentmaximumKO)
    this.chart= new Chart("bubbleChart",{
      type: 'bubble',
      data: this.data,
      
      options: {
      maintainAspectRatio:false,
       responsive:true,
        onClick: (event, activeElem) => {
          console.log(activeElem)
          console.log(event)
          if(activeElem.length!==0){

           if ( !(this.indices.includes(activeElem[0].index))) {
            this.tempData=[]
            this.indices.push(activeElem[0].index)
         var background1 = this.chart.data.datasets[0].backgroundColor;
            for (let i = 0; i < background1.length; i++) {
              if (!(this.indices.includes(i))) {
                background1[i] = this.col1;
              } if (this.indices.includes(i)) {
                background1[i] = this.color[i];
              }
            }
             this.chart.data.datasets[0].backgroundColor = background1;
             this.clicked = true;
          //   this.previousIndex = activeElem[0].datasetIndex;
          this.indices.forEach((element:any) => {
            this.tempData.push(this.data.datasets[0].data[element])
          });
      console.log(this.tempData)
         this.reportService.modifyKODataOnClick(this.tempData)
             this.chart.update();
           }
          else{
            this.indices=[]
            this.tempData=[]
            this.chart.data.datasets[0].backgroundColor = Array(this.apiData.length).fill(this.col);
            this.clicked = false;
            this.reportService.modifyDataRemovedClick()
            this.chart.update();
          }
        }
        else{
          this.indices=[]
          this.tempData=[]
          this.chart.data.datasets[0].backgroundColor = Array(this.apiData.length).fill(this.col);
          this.clicked = false;
          this.reportService.modifyDataRemovedClick()
          this.chart.update();
        }
        },
        
        plugins: {
          legend: {
            display:false,
            labels: {
              color: 'white',
              usePointStyle: true,
              font: {
                size: 16
              }
            }
          },
          datalabels: {
            
            color: '#fff',
            clamp: true,
            anchor: 'end',
            align: 'end',
            display: false
            
          },
          tooltip: {
            displayColors: false,
            backgroundColor:"rgba(70,70,70)",
            callbacks: {
              title(tooltipItems) {
                return ""
              },
              label(){
                return 'KI Probabilities & Distance'
              },
              afterLabel:(tooltipItem)=>{
               // console.log(tooltipItem)
                var id=tooltipItem.label
                var kiProbability=(this.apiData[tooltipItem.dataIndex].KIProbability*100).toFixed(2)
                var kiDistance= this.apiData[tooltipItem.dataIndex].KIDistance.toFixed(2)
                var productName=this.apiData[tooltipItem.dataIndex].ProductName
                return `Product ID:        ${tooltipItem.label}\nKI Distance:      ${kiDistance}\nKI Probabilty:    ${kiProbability}\nProduct Name:  ${productName.substring(0,productName.indexOf("Strike@"))}\n                         ${productName.substring(productName.indexOf("Strike@"),productName.indexOf("Coupon@"))}\n                         ${productName.substring(productName.indexOf("Coupon@"))}`

                
                
              },
            }
          },
          
        },
      scales: {
        x: {
          max:70,
          min:0,
          border:{
            display:false,
            color:"rgba(172,172,172,255)"
          },
         
        offset:true,
        type:'category',
        ticks: {
          color: 'rgba(172,172,172,255)' // set color of x-axis ticks to red
        },
          title: {
            color: 'rgba(109,151,191,255)',
            display: true,
            text: 'ProductID',
            font: {
              size: 15
            }
          },
          // labels:[...this.label], 
          // ticks: {
          //   autoSkip: false,
          //   maxRotation: 90,
          //   //count:102,
          //   //stepSize:1,
          //   callback: (value, index, values) => value, 
            
          // }
        },
        y: {
          position:'top',
          beginAtZero:true,
          border:{
            display:false,
            color:"rgba(172,172,172,255)",
            dash:[1,5]
          },
          grid:{
            color:"rgba(172,172,172,255)",
            tickLength:2,
            
          },
          
          ticks: {
            color: 'rgba(172,172,172,255)' ,
            count: 3 ,// set color of x-axis ticks to red
            
          },
          
          title: {
            color: 'rgba(109,151,191,255)',
            display: true,
            text: 'KI Probabilty',
            font: {
              size: 15
            }
          },
        min: 0,
        max: 100,
            },
           }
       },
       
    })
    this.chart.canvas.addEventListener('wheel', (e: string) => {
      this.scroll(e, this.chart)
    })

    
    this.reportService.dataReceived.subscribe(() => {
     this.setProperties()
    this.chart.update();
    this.chart.canvas.addEventListener('wheel', (e: string) => {
      this.scroll(e, this.chart)
    })
  })
 

  //===============================================================================


   this.reportService.data1$.subscribe(value => {
    //if(value.length>0){
    console.log(this.reportService.filterDataKI)
    this.apiData=[...this.reportService.filterDataKI]
    this.data1=[]
    this.label=[]
    this.color=[]
  // for(var i=0;i<this.apiData.length/2-1;i++){
  //   var temp=this.apiData[i]
  //   this.apiData[i]=this.apiData[this.apiData.length-1-i]
  //   this.apiData[this.apiData.length-1-i]=temp
  // }
   console.log(this.apiData)
    this.apiData.map((ele:any,index:any)=>{
      if(ele.KIDistance>=0){
        this.data1.push(
            {
              x:ele.ProductID.toString(),
              y:ele.KIProbability*100,
              r:Math.min(50,ele.KIDistance/5+5)
            }
          )
        this.color.push(this.col)}
          else{
            this.data1.push(
              {
                x:ele.ProductID.toString(),
                y:ele.KIProbability*100,
                r:Math.min(50,ele.KIDistance*(-1)/5+5)
              }
            )
            this.color.push(this.coll)
          }
      this.label.push(ele.ProductID.toString());
      
    })
    
    this.data.datasets[0].data=[...this.data1]
     this.data.labels=this.label
     this.data.datasets[0].backgroundColor=[...this.color]
    this.chart.update();
 // }
  })

    
   
  //  ===============================================================================

    this.reportService.dataKI$.subscribe(value => {
    //  if(value.length>0){
      console.log(value)
      this.apiData=[...this.reportService.filterDataKI]
      this.data1=[]
      this.label=[]
      this.color=[]
    // for(var i=0;i<this.apiData.length/2-1;i++){
    //   var temp=this.apiData[i]
    //   this.apiData[i]=this.apiData[this.apiData.length-1-i]
    //   this.apiData[this.apiData.length-1-i]=temp
    // }
     console.log(this.apiData)
      this.apiData.map((ele:any,index:any)=>{
        if(ele.KIDistance>=0){
          this.data1.push(
              {
                x:ele.ProductID.toString(),
                y:ele.KIProbability*100,
                r:Math.min(50,ele.KIDistance/5+5)
              }
            )
          this.color.push(this.col)}
            else{
              this.data1.push(
                {
                  x:ele.ProductID.toString(),
                  y:ele.KIProbability*100,
                  r:Math.min(50,ele.KIDistance*(-1)/5+5)
                }
              )
              this.color.push(this.coll)
            }
        this.label.push(ele.ProductID.toString());
        
      })
      
      this.data.datasets[0].data=[...this.data1]
       this.data.labels=this.label
       this.data.datasets[0].backgroundColor=[...this.color]
      this.chart.update();
    //}
    })
    

    

   
   
  
    
   
  }
 
 

}
