import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarrierProbabilityService {

  
  dataReceived = new EventEmitter<void>();
  constructor() { }
  ngOnInit(): void {
    
  }

  apiData: any = [];
  filterDataKI: any = this.apiData;
  filterDataKO: any = this.apiData;
  filterKODataOnClick: any =[];
  filterKIDataOnClick: any =[];
  //productCount:any
  minimunKI:any=0
  maximumKI:any=0
  minimumKO:any=0
  maximumKO:any=0
  currentminimunKI:any=0
  currentmaximumKI:any=0
  currentminimumKO:any=0
  currentmaximumKO:any=0
  selectedOptionKI:string='Ascending'
  selectedOption1KI:string='ProductID'
  selectedOptionKO:string='Ascending'
  selectedOption1KO:string='ProductID'
  sort:any=false
  dataReceivedFlag=false


  sliderStateKi:any=true

  initialState:any={
    "minimunKI" : 0,
    "maximumKI" : 0,
    "minimumKO" : 0,
    "maximumKO" : 0,
    "selectedOptionKI" : 'Ascending',
    "selectedOption1KI" : 'ProductID',
    "selectedOptionKO" : 'Ascending',
    "selectedOption1KO" : 'ProductID',
    
  }

//////////////////////////////////////////////////////IN THE SERVICE/////////////////////////////////////////////////////////////////////////////////////////

screenshotData: any = [];


  setScreenshotData(value: any){
    if(this.screenshotData.length < 15){
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
    }else{
      this.screenshotData.shift();
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setApiData(value: any){
    this.apiData = value;
    this.filterDataKI=value
    this.filterDataKO=value
    console.log(this.apiData);
    this.setDataCount(this.apiData.length)

    this.getMinKI()
    this.getMinKO()
    this.getMaxKI()
    this.getMaxKO()
    this.dataReceivedFlag=true
  }

  // getDataForKI(){
  //   return this.filterData;
  // }

  private dataSubject = new BehaviorSubject<Array<any>>([]);
  data1$ = this.dataSubject.asObservable();
  setDataForKi(data: Array<any>) {
    this.dataSubject.next(data);
  }

  private dataSubjectt = new BehaviorSubject<Array<any>>([]);
  data2$ = this.dataSubjectt.asObservable();
  setDataForKo(data: Array<any>) {
    this.dataSubjectt.next(data);
  }


  private dataSubject1 = new BehaviorSubject<Array<any>>([]);
  dataCount$ = this.dataSubject1.asObservable();
  setDataCount(data: Array<any>) {
    this.dataSubject1.next(data);
  }

  private dataSubjectKO = new BehaviorSubject<Array<any>>([]);
  dataKO$ = this.dataSubjectKO.asObservable();
  setDataKO(data: Array<any>) {
    this.dataSubjectKO.next(data);
  }

  private dataSubjectKI = new BehaviorSubject<Array<any>>([]);
  dataKI$ = this.dataSubjectKI.asObservable();
  setDataKI(data: Array<any>) {
    this.dataSubjectKI.next(data);
  }

  getMinKI(){
    const minKI = 
      Math.min(...this.apiData.map( (element:any) => {
        return element.KIProbability;
      })
      );
    
   // console.log(minDate);
   this.minimunKI=minKI
   this.initialState["minimunKI"]=this.minimunKI
   this.currentminimunKI=this.minimunKI
    return minKI;
  }

  getMaxKI(){
    const maxKI = 
      Math.max(...this.apiData.map( (element:any) => {
        return element.KIProbability;
      })
      );
    
   // console.log(minDate);
   this.maximumKI=maxKI
   this.initialState["maximumKI"]=this.maximumKI
   this.currentmaximumKI=this.maximumKI
    return maxKI;
  }

  getMinKO(){
    const minKO = 
      Math.min(...this.apiData.map( (element:any) => {
        return element.KOProbability;
      })
      );
    
   // console.log(minDate);
   this.minimumKO=minKO
   this.initialState["minimumKO"]=this.minimumKO
   this.currentminimumKO=this.minimumKO
    return minKO;
  }

  getMaxKO(){
    const maxKO = 
      Math.max(...this.apiData.map( (element:any) => {
        return element.KOProbability;
      })
      );
    
   // console.log(minDate);
   this.maximumKO=maxKO
   this.initialState["maximumKO"]=this.maximumKO
   this.currentmaximumKO=this.maximumKO
    return maxKO;
  }
  

//=======================================================================================================================================

  modifyKIData(start: any, end: any,start1: any, end1:any) {
    this.currentminimunKI=start
    this.currentmaximumKI=end

    this.currentminimumKO=start1
    this.currentmaximumKO=end1

    this.filterDataKI= this.apiData.filter((ele:any)=>{
      return ele.KIProbability>=parseFloat(start) && ele.KIProbability<=parseFloat(end) && ele.KOProbability>=parseFloat(start1) && ele.KOProbability<=parseFloat(end1)
  })
  var val=this.selectedOption1KI
  console.log(val)
  if(this.selectedOptionKI==='Ascending'){
 
    this.filterDataKI.sort((a:any,b:any)=>{
      return(a[val]-b[val])
    })
  }
  else{
    this.filterDataKI.sort((a:any,b:any)=>{
      return(b[val]-a[val])
    })
  }
    let productCount=this.filterDataKI.length
    console.log(this.filterDataKI)
    this.setDataCount(productCount)
    this.setDataForKi(this.filterDataKI)
  }

  
modifyKiDataOnFilters(value:any){
  console.log(value)
  switch(value){
    case 'Ascending':
      this.selectedOptionKI='Ascending'
   this.modifyKIData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
      break

    case 'Descending':
      this.selectedOptionKI='Descending'
      this.modifyKIData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
      break
    default:
  }
}

modifyKiDataOnFields(value:any){
  console.log(value)
this.selectedOption1KI=value
this.modifyKIData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
}



//========================================================================================================

modifyKOData(start: any, end: any,start1: any, end1:any) {
  this.currentminimunKI=start
  this.currentmaximumKI=end

  this.currentminimumKO=start1
  this.currentmaximumKO=end1

  this.filterDataKO= this.apiData.filter((ele:any)=>{
    return ele.KIProbability>=parseFloat(start) && ele.KIProbability<=parseFloat(end) && ele.KOProbability>=parseFloat(start1) && ele.KOProbability<=parseFloat(end1)
})
var val=this.selectedOption1KO
console.log(val)
if(this.selectedOptionKO==='Ascending'){
 
  this.filterDataKO.sort((a:any,b:any)=>{
    return(a[val]-b[val])
  })
}
else{
  this.filterDataKO.sort((a:any,b:any)=>{
    return(b[val]-a[val])
  })
}
  let productCount=this.filterDataKO.length
  console.log(this.filterDataKO)
  this.setDataCount(productCount)
  this.setDataForKo(this.filterDataKO)
}


modifyKoDataOnFilters(value:any){
switch(value){
  case 'Ascending':
    this.selectedOptionKO='Ascending'
 this.modifyKOData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
    break

  case 'Descending':
    this.selectedOptionKO='Descending'
    this.modifyKOData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
    break
  default:
}
}

modifyKoDataOnFields(value:any){
this.selectedOption1KO=value
this.modifyKOData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
}


//========================================================================================================================


  modifyDataRemovedClick() {
   let start=this.currentminimunKI
   let end=this.currentmaximumKI
   let start1=this.currentminimumKO
   let end1=this.currentmaximumKO
    
   this.modifyKOData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
   this.modifyKIData(this.currentminimunKI,this.currentmaximumKI,this.currentminimumKO,this.currentmaximumKO)
   }
   

  modifyKODataOnClick(data:any) {
 
     console.log(data)
    this.filterDataKO=[]
    this.apiData.map((ele:any)=>{
      data.map((ele1:any)=>{
        if(ele1.x=== ele.ProductID.toString())
        this.filterDataKO.push(ele)
      })
     
    })
     this.setDataKO(this.filterDataKO)
     this.setDataCount(this.filterDataKO.length)
   }
  
   modifyKIDataOnClick(data:any) {
 
    console.log(data)
   this.filterDataKI=[]
   this.apiData.map((ele:any)=>{
    data.map((ele1:any)=>{
      if(ele1.x=== ele.ProductID.toString())
      this.filterDataKI.push(ele)
    })
  })
    this.setDataKI(this.filterDataKI)
    this.setDataCount(this.filterDataKI.length)
  }

  // modifyKOData(start: any, end: any) {
  //   this.filterData= this.apiData.filter((ele:any)=>{
  //        return ele.KIProbability>=start && ele.KIProbability<=end
  //    })
  //    console.log(this.filterData)
  //    this.setData(this.filterData)
  //  }
}