import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarrierWatchService {

  dataReceived = new EventEmitter<void>();

  constructor() { }

  data:any=[]
  apiData: any = [];
  filterData: any = this.apiData;
  asset: string = 'ALL';
  filterKODataOnClick: any =[];

  minki:any
  maxki:any
  minko:any
  maxko:any
  currentminki:any=0
  currentmaxki:any=0
  currentminko:any=0
  currentmaxko:any=0


  initialState:any={
    "minki" : 0,
    "maxki" : 0,
    "minko" : 0,
    "maxko" : 0,
    "selectedAsset" : 'ALL'
  }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  setApiData(value: any,value1:any){
    this.apiData = value;
    this.filterData=value
    this.data=value1
   console.log(this.apiData);
   this.setData(this.apiData);
   this.setTotalProducts(this.apiData.length)
   console.log(this.data.length)
   this.setProperties()
  }
  setProperties() {
    this.getMinKI()
    this.getMaxKI()
    this.getMinKO()
    this.getMaxKO()
  }

  getDataForKI(){
    return this.filterData;
  }

  setFilterData(value: any){
    this.filterData = value;
    console.log(this.filterData);
  }
  updateFilterData() {
    if (this.asset === 'ALL') {
      this.filterData = this.apiData;
    } else {
      this.filterData = this.apiData.filter((item: any) => item['Asset'] === this.asset);
    }
    this.setData(this.filterData);
    this.setTotalProducts(this.filterData.length);
  }

  private dataSubject = new BehaviorSubject<Array<any>>([]);
  data$ = this.dataSubject.asObservable();
  setData(data: Array<any>) {
    this.dataSubject.next(data);
  }

  private totalProductsSubject = new BehaviorSubject<any>([]);
  totalProducts$ = this.totalProductsSubject.asObservable();
  setTotalProducts(data: any) {
    this.totalProductsSubject.next(data);
    console.log(this.totalProducts$)
  }

gettotalProducts(): Observable<any> {
  return this.totalProducts$;
}

  getMinKI(){
    const minKI = 
      Math.min(...this.apiData.map( (element:any) => {
        return element.KIProbability;
      })
      );
      this.minki=minKI
      this.initialState["minki"]=this.minki
      this.currentminki=this.minki
      return minKI;
    }

    getMaxKI(){
      const maxKI = 
        Math.max(...this.apiData.map( (element:any) => {
          return element.KIProbability;
        })
        );
        this.maxki=maxKI
        this.initialState["maxki"]=this.maxki
        this.currentmaxki=this.maxki
      
     // console.log(minDate);
      return maxKI;
    }
    getMinKIDis(){
      const minKIDis = 
      Math.min(...this.apiData.map( (element:any) => {
        return element.KIDistance;
      })
      );
      
      console.log(minKIDis)
    return minKIDis;

    }
    getMinKODis(){
      const minKODis = 
      Math.min(...this.apiData.map( (element:any) => {
        return element.KODistance;
      })
      );
      console.log(minKODis)
    return minKODis;

    }
    getMaxKIDis(){
      const maxKIDis = 
      Math.max(...this.apiData.map( (element:any) => {
        return element.KIDistance;
      })
      );
      console.log(maxKIDis)
    return maxKIDis;

    }
    getMaxKODis(){
      const maxKODis = 
      Math.max(...this.apiData.map( (element:any) => {
        return element.KODistance;
      })
      );
      console.log(maxKODis)
    return maxKODis;

    }

    getMinKO(){
      const minKO = 
        Math.min(...this.apiData.map( (element:any) => {
          return element.KOProbability;
        })
        );
        this.minko=minKO
        this.initialState["minko"]=this.minko
        this.currentminko=this.minko
      return minKO;
    }
  
    getMaxKO(){
      const maxKO = 
        Math.max(...this.apiData.map( (element:any) => {
          return element.KOProbability;
        })
        );
        this.maxko=maxKO
        this.initialState["maxko"]=this.maxko
        this.currentmaxko=this.maxko
      return maxKO;
      }

  private assetSubject = new BehaviorSubject<Array<any>>([]);

  asset$ = this.assetSubject.asObservable();
  setAsset(data: Array<any>) {
    this.assetSubject.next(data);
   // console.log(this.asset)
  }

  private selectedAssetSubject = new BehaviorSubject<any>([]);
  selectedAsset$ = this.selectedAssetSubject.asObservable();
  setSelectedAsset(data: any) {
    this.selectedAssetSubject.next(data);
    this.asset = data;
    //console.log(this.selectedAsset$)
  }

  getAsset(){
    //console.log([...new Set(this.data.map((item:any) => item['Asset']))]);
    return [...new Set(this.data.map((item:any) => item['Asset']))]
  }

  modifySelectedAsset(value: any){
    console.log(value);
    this.asset = value;
    this.setSelectedAsset(value);
    this.modifyKIData(this.currentminki,this.currentmaxki,this.currentminko,this.currentmaxko)
    
  }
  // modifyXaxisData(start:any,end:any){

  // }

modifyKIData(start: any, end: any,start1: any, end1:any) {

this.currentminki=start
this.currentmaxki=end
this.currentminko=start1
this.currentmaxko=end1

     if(this.asset==='ALL'){
   
      var array= this.data.filter((ele:any)=>{
        return ele.KIProbability>=parseFloat(start) && ele.KIProbability<=parseFloat(end) && ele.KOProbability>=parseFloat(start1) && ele.KOProbability<=parseFloat(end1)
    })
      
      console.log(array)
      var map=new Map()
      array.map((ele:any)=>{
        map.set(ele.ProductID,ele)
      })
     // console.log(...map.values())
     this.filterData=[]
     this.filterData=[...map.values()]
      this.setData([...map.values()])
        this.setTotalProducts([...map.values()].length)
        this.setAsset([...new Set(array.map((item:any) => item['Asset']))])
      

     }else{
   
    console.log(this.data)
    var array2= this.data.filter((ele:any)=>{
      return ele.KIProbability>=parseFloat(start) && ele.KIProbability<=parseFloat(end) && ele.KOProbability>=parseFloat(start1) && ele.KOProbability<=parseFloat(end1)
  })
      var array = array2.filter((item:any) => item['Asset'] === this.asset);
   // console.log(array)
    var map=new Map()
    array.map((ele:any)=>{
      map.set(ele.ProductID,ele)
    })
    console.log(...map.values())
    this.filterData=[]
    this.filterData=[...map.values()]
    this.setData([...map.values()])
      this.setTotalProducts([...map.values()].length)
      this.setAsset([...new Set(array2.map((item:any) => item['Asset']))])
    }

   
   }
   modifyKODataOnClick(data: any) {
    console.log(data)
    this.filterKODataOnClick=[]
     this.apiData.map((ele:any)=>{
      if(data.p=== ele.ProductID){
        console.log(ele)
      this.filterKODataOnClick.push(ele)
      }
    })
    //  console.log(this.filterKODataOnClick)

    //  this.setTotalProducts(this.filterKODataOnClick.length)
   }
   modifyDataRemovedClick() {
  
    this.modifyKIData(this.currentminki,this.currentmaxki,this.currentminko,this.currentmaxko)
  
    }
    
}
