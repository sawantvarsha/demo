import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Chart } from 'chart.js';
import { AssetExposureService } from '../asset-exposure.service';
import { AssetExposureComponent, pbi_data } from '../asset-exposure.component';
import { DatePipe } from '@angular/common';
import { BIReportsComponent } from '../../bireports.component';
@Component({
  selector: 'app-asset-exposure-chart',
  templateUrl: './asset-exposure-chart.component.html',
  styleUrls: ['./asset-exposure-chart.component.css']
})
export class AssetExposureChartComponent implements OnInit,AfterViewInit {

  chart:any;
  clicked=false;
  previousIndex : any;
  public data1:any=[]
  public apiData:any=[]
  categories:any=[]
  label:any=[]
  color:any=[]
  prevLabel:string=''
  @Output() shareSelectedObject=new EventEmitter<pbi_data>()
  col:any="rgba(76,117,147,0.9)"
  
  ascending:any=true
  descending:any=false
  productId:any=true
  ki:any=false
  selectedOption:string='Ascending'
  selectedOption1:string='Underlying'
  showDiv:any='false'
  indices:any=[]
 tempData:any=[]
  data:any= {

    labels:[],
    datasets: [{
      label: 'Asset Exposure',
      data:[],
      backgroundColor: [], 
      pointHoverBorderColor: 'white',
      hoverRadius:10, 
    }]
  };
  originalData: any[]=[];
  select: boolean=false;
  


  constructor(private service: AssetExposureService,private datepipe:DatePipe,private assetExposureComponent:AssetExposureComponent,private biReportsComponent:BIReportsComponent){

  }
  
setProperties(){
  let data1=this.service.filterData().filter(data=>data['probability']!==0)
 // let data1=this.service.filterData()
  this.originalData=data1
  
  this.label=[]
  if(this.service.selectedOption==='Ascending'){
     
    if(this.service.selectedOption1==='Underlying' ){
    data1.sort((a:any,b:any)=>{
      var m:string=a["underlying"]
      var n:string=b["underlying"]
      return (m.localeCompare(n)) 
    })}
    else{
      data1.sort((a:any,b:any)=>{
        return a["probability"]-b["probability"]
      })
    }
}
  else{
    
    if(this.service.selectedOption1==='Underlying'){
      data1.sort((a:any,b:any)=>{
        var m:string=a["underlying"]
        var n:string=b["underlying"]
        return (n.localeCompare(m)) 
      })}
      else{
        data1.sort((a:any,b:any)=>{
          return b["probability"]-a["probability"]
        })
      }
  }
  this.data1=data1.map(data=>{
    console.log(Math.log(data['next_red_exp']))
    this.color.push(this.col)
    this.label.push(data['underlying']);
    return {
      x:data['underlying'],
      y:data['probability'],
      r:Math.min(data['next_red_exp']/30000,30)
    } 
  })

 
   
   this.data.datasets[0].data=[...this.data1]
    this.data.labels=this.label
    this.data.datasets[0].backgroundColor=[...this.color]
    console.log(this.label)
}

filterData(value:any){
  this.service.selectedOption=value
  this.selectedOption=this.service.selectedOption
  this.setProperties()
  this.chart.update()
}

filterData1(value:any){
  this.service.selectedOption1=value
  this.selectedOption1=this.service.selectedOption1
  this.setProperties()
  this.chart.update()
  
}

setColor(){

}

display(){
  if(this.showDiv=='false'){
   this.showDiv='true'
  }else{
   this.showDiv='false'
  }
 }
pinChart(event:any){
      this.assetExposureComponent.pinned()
      
      var type = this.chart.config._config.type;  
      var data = this.chart.config._config.data
      const labels = this.chart.config._config.data.labels;
      const backgroundColor = this.chart.config._config.data.datasets[0].backgroundColor;
      const borderWidth = 1;
      const borderColor= 'black';
      // const min = this.minAvgProbab;
      // const max = this.maxAvgProbab;
      // const Redemption = this.redemptionDates
      // const tooltipList = this.dataList
      // const displayExposureList = this.displayExposureList
    const id =3
    const title="Next Redemption Wt. Average Probability & Exposure (USD) by UnderLying"
    const valueMonth = this.service.valueMonth
    const highValueMonth = this.service.highValueMonth
    const valueQuarter = this.service.valueQuarter
    const highValueQuarter = this.service.highValueQuarter
    const valueYear = this.service.valueYear
    const highValueYear =this.service.highValueYear
    const dateTypeForSlider= this.service.dateTypeForSlider

   const client = this.service.selectedClient;
   const exchange = this.service.selectedExchange;
   const sector = this.service.selectedSector;

   const selectedUnderlying = this.service.selectedUnderlying
   const selectedRedemptionDate = this.service.selectedRedemptionDate
   const selectedProbability = this.service.selectedProbability
   const selectedProductExposure = this.service.selectedProductExposure
   const selectedRedemptionExposure = this.service.selectedRedemptionExposure

   const selectedOption=this.service.selectedOption
   const selectedOption1=this.service.selectedOption1

   const chart = {
    data, backgroundColor, borderColor, borderWidth,id,title,valueMonth,highValueMonth,
    valueQuarter,highValueQuarter,valueYear,highValueYear,dateTypeForSlider,client,exchange,sector,
    selectedUnderlying,selectedRedemptionDate,selectedProductExposure,selectedRedemptionExposure,selectedOption,
    selectedOption1

      }
  
      this.biReportsComponent.setChart({type, chart});
    
    }
    ngAfterViewInit(): void {
      this.selectedOption=this.service.selectedOption
      this.selectedOption1=this.service.selectedOption1
    }
  ngOnInit(): void {
    this.selectedOption=this.service.selectedOption
    this.selectedOption1=this.service.selectedOption1

    this.setProperties()
    this.select=this.service.displayValue
    this.prevLabel=this.service.prevlabel
    this.chart= new Chart("assetExposureChart",{
      type: 'bubble',
      data: this.data,
      
      options: {
      maintainAspectRatio:false,
       responsive:true,
       onClick:(event, elements, chart)=> {
         if(elements.length!==0){
          let selectedIndex=elements[0].index
          let label=this.label[selectedIndex]
          let tempObject=this.originalData[selectedIndex]
          // this.service.selectedObject=tempObject
          if (this.prevLabel !== label && this.select === true) {
            this.select = false
          }

          if (this.select === false && this.prevLabel !== label) {
            this.prevLabel = label
            this.service.prevlabel=this.prevLabel
            // this.selected = this.labels.indexOf(label)
            // this.highlightElement(this.selected)
            this.service.displayValue=true
            this.shareSelectedObject.emit(tempObject)
            this.select = true
          } else {
            this.select = false
            this.prevLabel = ''
            this.service.prevlabel=this.prevLabel
            this.service.displayValue=false
            this.shareSelectedObject.emit(this.service.selectedObject)
            
            // this.service.destroySelected()
            // this.service.selectedChart = 0
            // this.service.currentSelectedPayOff = "All"
            // this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx);
          }

         }
         else{
            this.prevLabel=''
            this.select=false
            this.service.prevlabel=this.prevLabel
            this.service.displayValue=false
            this.shareSelectedObject.emit(this.service.selectedObject)
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
          tooltip: {
            bodyFont: { size: 15 },
            displayColors: false,
            callbacks: {
              title(tooltipItems) {
                return '';
              },
              label() {
                return '';
              },
              afterLabel: (tooltipItem) => {
                let id = tooltipItem.label;
                console.log(tooltipItem)
                this.data1[tooltipItem.dataIndex]['y'].toFixed(4);
                let index=this.label.indexOf(id)
                let temp:pbi_data=this.originalData[index]
                return ` Underlying: ${id}\n Probability: ${temp['probability']} \n Exposure: ${temp['next_red_exp']} \n Earliest Redemption Date: ${this.datepipe.transform(temp['redemptionDate'],'EEE dd MMM yyyy')}`;
              },
            },
          },
          datalabels: {
            
            color: '#fff',
            clamp: true,
            anchor: 'end',
            align: 'end',
            display: false
            
          },
        },
      scales: {
        x: {
          offset:true,
          max:70,
          min:0,
          border:{
            display:false,
            color:"rgba(172,172,172,255)"
          },
         
        // offset:true,
        type:'category',
        ticks: {
          color: 'rgba(172,172,172,255)' // set color of x-axis ticks to red
        },
          title: {
            color: 'rgba(109,151,191,255)',
            display: true,
            text: 'Underlying',
            font: {
              size: 15
            }
          },
          
        },
        y: {
          min:0,
          position:'top',
          beginAtZero:true,
          border:{
            display:false,
            color:"rgba(172,172,172,255)",
            dash:[1,5]
          },
          grid:{
            color:"rgba(172,172,172,255)",
            tickLength:5,
            
          },
          
          ticks: {
            color: 'rgba(172,172,172,255)' ,
            count: 6 ,
            
          },
          
          title: {
            color: 'rgba(109,151,191,255)',
            display: true,
            text: 'Next Redemption Wt.Avg Probability',
            font: {
              size: 15
            }
          },
            },
           }
       },
       
    })

    this.service.dataReceived.subscribe(()=>{
      this.setProperties()
      this.chart.update()
    })

    this.service.dataFilterEvent.subscribe(()=>{
      this.setProperties()
      this.chart.update()
    })

    this.service.dateSliderEvent.subscribe(()=>{
      this.setProperties()
      this.chart.update()
    })

    this.service.sendStateDataEvent.subscribe(()=>{
      this.selectedOption=this.service.selectedOption
      this.selectedOption1=this.service.selectedOption1
      this.setProperties()
      this.chart.update()
    })
  }
}
