import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type dataType = {
  [key: string]: number | string
}

@Injectable({
  providedIn: 'root'
})
export class KoAndWorstOfPerformanceService {

  filteredData: any[]=[];
  totalproducts!: number
  selectedCustomer: string="All";
  customerList!: any[];
  selectedOption:string='Ascending'
  selectedOption1:string='Trace_KO_Distance'
  hex1: any = '#255272'
  hex2: any = '#6d97bf'
  inputColor: any = '#6d97bf';
  constructor() { }

  dataReceived = new EventEmitter<void>()
  dataFiltered = new EventEmitter<void>()
  SenddataToDropDown = new EventEmitter<void>();
  filterSelectedEvent = new EventEmitter<void>()
  sendProductTotalEvent = new EventEmitter<void>()
  filterEvent=new EventEmitter<object>()

  worstOfUnderlying="WorstOfUnderlying"
  currency="Currency"
  payoff="Payoff"
  customername="CustomerName"
  traceKODistance="Trace_KO_Distance"
  ISIN="ISIN"
  worstOfPerformance="WorstOfPerformance"

  min_KO: number=0
  max_KO: number=0
  current_min_KO: number=this.min_KO
  current_max_KO: number=this.max_KO
  filterDisplay=false


  worstOfUnderLyingList: any[] = []
  selectedUnderlying: string = "All"
  data: any[] = []
  dataFormat: any[] = []

  initialState:any={
    "selectedUnderlying":"All",
    "selectedCustomer":"All",
    "selectedOption":"Ascending",
    "selectedOption1":"Trace_KO_Distance",
    "hex1": '#255272',
    "hex2": '#6d97bf',
    "min_KO":0,
    "max_KO":0,

  }
   //=========================================================================================
   sendStateDataEvent = new EventEmitter<void>()
 screenshotData: any = [];


 setScreenshotData(value: any){
  if(this.screenshotData.length < 15){
  this.screenshotData.push(value);
  this.setScreenshotArray(this.screenshotData);
 }else{
  this.screenshotData.shift();
 this.screenshotData.push(value);
  this.setScreenshotArray(this.screenshotData);
  } }

  private bg1Subject = new BehaviorSubject<Array<any>>([]);
  bg1$ = this.bg1Subject.asObservable();
  setBg1(data: Array<any>) {
    this.bg1Subject.next(data);
    if(data.length !== 0){
    this.hex1 = data[0]
    }
  }

  private bg2Subject = new BehaviorSubject<Array<any>>([]);
  bg2$ = this.bg2Subject.asObservable();
  setBg2(data: Array<any>) {
    this.bg2Subject.next(data);
    if(data.length !== 0){
    this.hex2 = data[0]
    }
  }
 
  getScreenshotData(){
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
 

  setData(apiData: any[]) {
    //this.data =apiData
    this.data = apiData.filter((data)=>data["WorstOfPerformance"]!==null && data["Trace_KO_Distance"]!==null);  
    this.setProperties()

  }

  filter() {
    
    if (this.selectedUnderlying === "All") {
      this.filteredData = this.filteredData
    }
    else {
      this.filteredData = this.filteredData.filter((data) => data[this.worstOfUnderlying] === this.selectedUnderlying)
    }

    if (this.selectedCustomer === "All") {
      this.filteredData = this.filteredData
    }
    else {
      this.filteredData = this.filteredData.filter((data) => data[this.customername] === this.selectedCustomer)
    }
  }



  getLists() {
    let tempData = []
    tempData = this.filteredData
    if(this.selectedCustomer!=="All"){
      tempData = tempData.filter((data) => data[this.customername]===this.selectedCustomer)
    }
    this.worstOfUnderLyingList = [...new Set(tempData.map((data) => data[this.worstOfUnderlying]))]
    this.worstOfUnderLyingList=this.worstOfUnderLyingList.sort((a,b)=>{return a.localeCompare(b)})

    tempData = []
    tempData = this.filteredData
    if(this.selectedCustomer!=="All"){
      tempData = tempData.filter((data) => data[this.customername]===this.selectedCustomer)
    }
    if (this.selectedUnderlying !== "All")
      tempData = tempData.filter((data) => data[this.worstOfUnderlying]===this.selectedUnderlying)

    tempData = []
    tempData = this.filteredData
    if(this.selectedCustomer!=="All"){
      tempData = tempData.filter((data) => data[this.customername]===this.selectedCustomer)
    }
    if (this.selectedUnderlying !== "All")
      tempData = tempData.filter((data) => data[this.worstOfUnderlying]===this.selectedUnderlying)

    tempData = []
    tempData = this.filteredData
    
    if (this.selectedUnderlying !== "All")
      tempData = tempData.filter((data) => data[this.worstOfUnderlying]===this.selectedUnderlying)
    this.customerList = [...new Set(tempData.map((data) => data[this.customername]))]
    this.SenddataToDropDown.emit()


  }

  getData(): dataType[] {
    let tempData: dataType = {}
    let dataFormat: dataType[] = []
    this.filterData()
    this.filteredData.forEach((data) => {
      tempData[this.traceKODistance] = data[this.traceKODistance]
      tempData[this.worstOfPerformance] = data[this.worstOfPerformance]
      tempData[this.ISIN] = data[this.ISIN]
      tempData["Product_Name"] = data["Product_Name"]
      tempData[this.worstOfUnderlying] = data[this.worstOfUnderlying]
      tempData["C_Note_Barrier_PC"]=data["C_Note_Barrier_PC"]
      tempData["NM_Airbag_PC"]=data["NM_Airbag_PC"]
      tempData["Note_Master_ID"]=data["Note_Master_ID"]
      dataFormat = [...dataFormat, { ...tempData }]
    })
    this.dataFormat = [...dataFormat]
    this.dataFormat.sort((a: any, b: any) => b[this.traceKODistance] - a[this.traceKODistance])
    this.getDistinct()
    this.totalproducts = this.dataFormat.length
    this.sendProductTotalEvent.emit()
    return this.dataFormat
  }

  setProperties() {
    this.filterDisplay=true
    let KO_list: number[] = this.data.map((data) => data[this.traceKODistance]).sort((a, b) => a - b)
    this.min_KO = KO_list[0]
    this.max_KO = KO_list[KO_list.length - 1]
    this.current_min_KO = this.min_KO
    this.current_max_KO = this.max_KO
    let wof_list: number[] = this.data.map((data) => data[this.worstOfPerformance]).sort((a, b) => a - b)

    this.initialState["min_KO"]=this.min_KO
    this.initialState["max_KO"]=this.max_KO

   
  }


  filterData() {
    this.filteredData = this.data.filter((data) => (data[this.traceKODistance] >= this.current_min_KO && data[this.traceKODistance] <= this.current_max_KO) 
    )

    this.getLists()
    this.filter()
  }


  getDistinct(){
    let distinct = new Map<string,dataType>()
    this.dataFormat.forEach((data)=>{
      distinct.set(data[this.ISIN],data)
    })
    this.dataFormat=[...distinct.values()]
  }
}
