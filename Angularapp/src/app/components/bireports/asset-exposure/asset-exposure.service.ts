import { EventEmitter, Injectable } from '@angular/core';
import { pbi_data } from './asset-exposure.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetExposureService {

  data: any[] = []
  exchange: string = 'Exchange'
  selectedExchange = 'All'
  sector = 'Sector'
  selectedSector = "All"
  client = 'CustomerName'
  selectedClient = "All"
  underlying = 'Underlying'
  selectedUnderlying = ''
  selectedRedemptionDate = ''
  selectedProbability = ''
  selectedProductExposure = ''
  selectedRedemptionExposure = ''
  filteredData: any[] = [];
  exchangeList: string[] = []
  sectorList: string[] = []
  clientList: string[] = []
  underlyingList: string[] = []
  formattedData: pbi_data[] = []
  selectedObject!: pbi_data
  selectedAssetObject!:pbi_data
  apiDataReceived = false
  sendDropdown = new Subject<void>()
  dataReceived = new EventEmitter<void>()
  dataFilterEvent = new EventEmitter<void>()
  selectedObjectEvent = new EventEmitter<void>()
  dateSliderEvent=new EventEmitter<void>()
  sendSelectedObject = new Subject<pbi_data>()
  totalProductExposure = 0
  nextRedemptionExposure = 0
  ear_red_date: any
  displayValue:boolean=false
  prevlabel:string=''
  selectedStartDate:Date=new Date()
  selectedEndDate:Date=new Date(new Date().setFullYear((new Date().getFullYear()+1)))
  isDateFirst:boolean=true
  dateTypeForSlider:number=0
  valueMonth = 0
  highValueMonth = 12

  valueQuarter = 0
  highValueQuarter = 4

  
  valueYear = 0
  highValueYear = 2

  selectedOption:string='Ascending'
  selectedOption1:string='Underlying'

  initialState:any={
    "selectedExchange" : 'All',
    "selectedSector" : "All",
    "selectedClient" : "All",
    "selectedUnderlying" : '',
    "selectedRedemptionDate" : '',
    "selectedProbability" : '',
    "selectedProductExposure" : '',
    "selectedRedemptionExposure" : '',
    "dateTypeForSlider":0,
    "valueMonth" : 0,
    "highValueMonth" : 12,
    "valueQuarter" : 0,
    "highValueQuarter" : 4,
    "valueYear" : 0,
    "highValueYear" : 2,
    "selectedOption":"Ascending",
    "selectedOption1":"Underlying",
    
  }
  constructor(private datepipe: DatePipe) { }



  //=========================================================================================





  sendStateDataEvent = new EventEmitter<void>()
  sliderEvent = new EventEmitter<void>()
  screenshotData: any = [];


  setScreenshotData(value: any) {
    if (this.screenshotData.length < 15) {
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
    } else {
      this.screenshotData.shift();
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
    }
  }

  getScreenshotData() {
    return this.screenshotData;
  }

  private screenshotDataSubject = new BehaviorSubject<Array<any>>([]);
  screenshotData$ = this.screenshotDataSubject.asObservable();
  setScreenshotArray(data: Array<any>) {
    this.screenshotDataSubject.next(data);
  }
  private display: BehaviorSubject<'open' | 'close'> =
    new BehaviorSubject<any>('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open() {
    this.display.next('open');
  }

  close() {
    this.display.next('close');
  }


  //==========================================================================================




  setApiData(data: any) {
    this.data = data.filter((data: any) => data['Next KO Exposure'] !== null)
    // this.data=this.data.filter(data=>data['Next KO Exposure']!==null)
    this.apiDataReceived = true
    this.filterData()
    this.selectedObject
  }



  filterData(): pbi_data[] {
    //this.filteredData = this.data
    this.dateFilter()
    this.getLists(this.filteredData)
   

    this.filteredData = this.filteredData.filter(data => {
      if (this.selectedExchange !== "All" && data[this.exchange] !== this.selectedExchange)
        return false
      if (this.selectedSector !== "All" && data[this.sector] !== this.selectedSector)
        return false
      if (this.selectedClient !== "All" && data[this.client] !== this.selectedClient)
        return false
      else
        return true
    })

    let tempUnderLying = this.filteredData.map((val: any) => {
      return val[this.underlying]
    })
    this.underlyingList = tempUnderLying.filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    console.log(this.underlyingList)
    let tempArray: pbi_data[] = []
    this.underlyingList.forEach(underlying => {
      let temp = this.filteredData.filter(data => data[this.underlying] === underlying)
      let tempObject: pbi_data = {
        underlying: '',
        probability: 0,
        redemptionDate: new Date(),
        next_red_exp: 0,
        total_prd_exp: 0
      }
      tempObject['underlying'] = underlying
      let totalNextAvgExp = 0
      let totalProductExposure = 0
      let avgFactor = 0
      let min = Number.MAX_VALUE
      temp.forEach(data => {
        if (data['Next KO Avg Exposure'] === null) {
          data['Next KO Avg Exposure'] = 0
        }
        totalNextAvgExp = data['Next KO Avg Exposure'] + totalNextAvgExp
        if (data['Total Product Exposure'] === null) {
          data['Total Product Exposure'] = 0
        }
        totalProductExposure = data['Total Product Exposure'] + totalProductExposure
        if (data['Next KO Avg Probability'] === null) {
          data['Next KO Avg Probability'] = 0
        }
        avgFactor = avgFactor + data['Next KO Avg Exposure'] * data['Next KO Avg Probability']
        if (new Date(data['Next KO Exposure']).getTime() < min && new Date(data['Next KO Exposure']).getTime() > new Date().getTime()) {
          min = new Date(data['Next KO Exposure']).getTime()
        }
      })
      if (totalNextAvgExp !== 0)
        tempObject['probability'] = avgFactor / totalNextAvgExp
      else {
        tempObject['probability'] = 0
      }
      tempObject['next_red_exp'] = totalNextAvgExp
      tempObject['total_prd_exp'] = totalProductExposure
      tempObject['redemptionDate'] = new Date(min)

      tempArray.push(tempObject)
    })

    this.formattedData = [...tempArray]

    let totalExposure = 0
    let redemptionExposure = 0
    tempArray.forEach(data => {
      totalExposure = data['total_prd_exp'] + totalExposure
      redemptionExposure = data['next_red_exp'] + redemptionExposure
    })

    tempArray = this.formattedData.filter(data => data['probability'] !== 0)
    let min = Number.MAX_VALUE
    this.formattedData.forEach(data => {
      if (new Date(data['redemptionDate']).getTime() < min) {
        min = new Date(data['redemptionDate']).getTime()
      }
    })

    this.nextRedemptionExposure = redemptionExposure
    this.totalProductExposure = totalExposure
    this.ear_red_date = new Date(min)

    if(this.apiDataReceived===true ){
      this.selectedObject = {
        next_red_exp: redemptionExposure,
        probability: 0,
        total_prd_exp: totalExposure,
        underlying: '(blank)',
        redemptionDate: new Date(min)
      }
  
      this.sendSelectedObject.next(this.selectedObject)
    }
   
    // this.formattedData
    return this.formattedData
  }

  dateFilter(){
    if(this.selectedStartDate||this.selectedEndDate){
    this.filteredData=this.data.filter((data)=>{return (new Date(data['Next KO Exposure']).getTime()>= new Date(this.selectedStartDate).getTime() && 
                            new Date(data['Next KO Exposure']).getTime()<= new Date(this.selectedEndDate).getTime())})
    }
  }

  getLists(data: any[]) {
    let tempdata: any[] = data
    tempdata = tempdata.filter(data => {
      if (this.selectedClient !== 'All' && data[this.client] !== this.selectedClient)
        return false
      if (this.selectedExchange !== 'All' && data[this.exchange] !== this.selectedExchange)
        return false
      return true
    })
    this.sectorList = [...new Set(tempdata.map(data => data[this.sector]))]

    tempdata = data
    tempdata = tempdata.filter(data => {
      if (this.selectedClient !== 'All' && data[this.client] !== this.selectedClient)
        return false
      if (this.selectedSector !== 'All' && data[this.sector] !== this.selectedSector)
        return false
      return true
    })

    this.exchangeList = [...new Set(tempdata.map(data => data[this.exchange]))]

    tempdata = data
    tempdata = tempdata.filter(data => {
      if (this.selectedSector !== 'All' && data[this.sector] !== this.selectedSector)
        return false
      if (this.selectedExchange !== 'All' && data[this.exchange] !== this.selectedExchange)
        return false
      return true
    })

    this.clientList = [...new Set(tempdata.map(data => data[this.client]))]


    this.sendDropdown.next()
  }

  // dateFilter(){
  //   this.data.filter(data=>data['Next KO Exposure'].getTime()> new Date().getTime())
  // }
}
