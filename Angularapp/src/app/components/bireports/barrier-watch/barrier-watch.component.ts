import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable, Subscription, tap } from 'rxjs';
import { BarrierWatchService } from './barrier-watch.service';
import { NgxCaptureService } from 'ngx-capture';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-barrier-watch',
  templateUrl: './barrier-watch.component.html',
  styleUrls: ['./barrier-watch.component.css']
})
export class BarrierWatchComponent {
  selectedAsset = 'ALL';
  asset=new UntypedFormControl('');
  assetList:any=[];
  totalProduct=0;
  popup:any
  body={
    "strData": "USP_LifecycleSnapshot_PBIReport_Santander",
    "EntityID": "149",
    "UserId": "Bhavik",
    "CustomerID": "",
    "EventType": "",
    "FromDate": "",
    "ToDate": "",
    "Measure": "",
    "Sector": "",
    "RowsPerPage": "",
    "PageNo": "",
    "WhereClause": ""
  }

  url=`${AppConfig.settings.apiBaseUrl}cspdata/CSPData/GetInteractivedata`;

  constructor(private httpClient:HttpClient , private service:BarrierWatchService,private captureService: NgxCaptureService,private snackBar : MatSnackBar){

  }
  
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 assetSS: any;
 minKISS = 0;
 maxKISS = 0;
 minKOSS = 0;
 maxKOSS = 0;
 stateKISS:any;
 fieldkISS:any;
 stateKOSS:any;
 fieldkOSS:any;

 options1: Options = {
  // floor: this.startDate.getTime(),
  // ceil:this.endDate.getTime(),
  step: 0.01,
  translate: (value: number, label: LabelType): string => {
    switch (label) {
      case LabelType.Low:
        return "";
      case LabelType.High:
        return "";
      default:
        return "";
    }
  }
};

options2: Options = {
  // floor: this.startDate.getTime(),
  // ceil:this.endDate.getTime(),
  step: 0.01,
  translate: (value: number, label: LabelType): string => {
    switch (label) {
      case LabelType.Low:
        return "";
      case LabelType.High:
        return "";
      default:
        return "";
    }
  }
};

 screenshotData : any = [];
 img = "";
 @ViewChild("screen", { static: true }) screen: any;
 sliderHeight: any = 0;
 showDiv = false;
 //toggle = document.getElementsByClassName('arrow');

 private screenshotDataSubscription: Subscription = new Subscription;

 toggle = document.getElementsByClassName('info');
  scroll:string="Scroll on"
  toggleScroll(){
    if(this.scroll === 'Scroll on'){
      this.scroll = 'Scroll off';
    }
    else{
      this.scroll = 'Scroll on'
    }
  }

 toggleDiv() {
   
   const slideTrack = document.querySelector('.slide-track');
   console.log(slideTrack?.setAttribute('style', `height:${this.sliderHeight}px`));
  
   if (this.toggle[0].classList.contains('active')) {
     
     this.toggle[0].classList.remove('active');
     } else {
      
       this.toggle[0].classList.add('active');
     }
   this.showDiv = !this.showDiv;
 }

 //display$: Observable<'open' | 'close'> = new Observable<'close'>;

 goToState(e : any){
   console.log(e);
   this.KIRange[0] = e.kiRangeMin;
   this.KIRange[1] = e.kiRangeMax;
   this.KORange[0] = e.koRangeMin;
   this.KORange[1] = e.koRangeMax;
   this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
   this.service.modifySelectedAsset(e.asset);
   this.toggleDiv();
 }

 goToOriginalState(){
  this.KIRange[0] =this.service.initialState["minki"]
  this.KIRange[1] = this.service.initialState["maxki"]
  this.KORange[0] = this.service.initialState["minko"]
  this.KORange[1] =this.service.initialState["maxko"]
  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
  this.service.modifySelectedAsset(this.service.initialState["selectedAsset"]);
}



 getTimestamp(timestamp: any) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var diffDays = new Date().getDate() - timestamp.getDate();
  var diffMonth = new Date().getMonth() - timestamp.getMonth();
  var diffYears = new Date().getFullYear() - timestamp.getFullYear();

  if (diffYears === 0 && diffDays === 0 && diffMonth === 0) {
    var hours = timestamp.getHours();
    var minutes = timestamp.getMinutes();
    var seconds = timestamp.getSeconds();
    var period = 'AM'; // Default period is AM

    if (hours >= 12) {
      period = 'PM'; // Set period to PM if hours are 12 or greater
    }

    if (hours > 12) {
      hours = hours % 12; // Convert hours greater than 12 to 12-hour format
    }

    if (hours === 0) {
      hours = 12; // Special case for midnight (0 AM)
    }

    // Add leading zeros to minutes and seconds if necessary
    if (timestamp.getMinutes() <= 9) {
      minutes = '0' + timestamp.getMinutes();
    }
    if (timestamp.getSeconds() <= 9) {
      seconds = '0' + timestamp.getSeconds();
    }

    // return `${hours}:${minutes} ${period} (Today)`;
       return `${hours}:${minutes} ${period}`;
  } else {
    return `${timestamp.getDate()}-${months[timestamp.getMonth()]}`;
  }
}

tooltipContent: string = '';
tooltipStyle: any = {};

  showTooltip(event: any, imageObj: any) {
    const tooltip = document.querySelector('.custom-tooltip');
    const tooltipText = `Timestamp: ${this.getTimestamp(imageObj.timestamp)}<br>
      Asset: ${imageObj.asset}<br>
      KI Probability: ${(imageObj.kiRangeMin)}-${(imageObj.kiRangeMax)}<br>
      KO Probability: ${(imageObj.koRangeMin)}-${(imageObj.koRangeMax)}
      `;
  
    this.tooltipContent = tooltipText;
    this.tooltipStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`
    };
  }

  hideTooltip() {
    this.tooltipContent = '';
  }

 showScreenshotPopup = false;

showPopup(val:string) {
  this.popup=val
  this.showScreenshotPopup = true;
  setTimeout(() => {
    this.showScreenshotPopup = false;
  }, 1500); // Close the popup after 2 seconds (adjust the duration as needed)
}

 theReal() {
   console.log(this.captureService)
   this.captureService
  
     .getImage(this.screen.nativeElement, true)
     .pipe(
       tap((img) => {
         console.log(this.screen);
         this.img = img;
         this.service.setScreenshotData({"image": this.img, "kiRangeMin": this.minKISS, "kiRangeMax": this.maxKISS, "koRangeMin": this.minKOSS, "koRangeMax": this.maxKOSS,"asset":this.assetSS, "timestamp": new Date()});
         //console.log(img);
         //console.log(this.screen);
       })
     )
     .subscribe();
 }
 makeCapture(){
  this.showPopup("Screenshot Captured")
   this.theReal();
   this.minKISS = this.KIRange[0];
   this.maxKISS = this.KIRange[1];
   this.minKOSS = this.KORange[0];
   this.maxKOSS = this.KORange[1];
   this.assetSS = this.service.asset;
   this.snackBar.open("Screenshot Captured", undefined, {
      duration: 1000,
     horizontalPosition: 'center',
     verticalPosition: 'top'
   });
   //console.log(this.minSS);
   //console.log(this.maxSS);
   //this.service.setScreenshotData({"image": this.img, "koRangeMin": this.minSS, "koRangeMax": this.maxSS, "selectedWorstOfUnderlying": this.worstOfUnderlyingSS, "timestamp": new Date()});
   //alert('Screenshot Captured');

 }
 pinned(){
  this.showPopup("Pinned")
  }
 openCapture() {
   this.service.open();
 }

 close() {
   this.service.close();
 }
 goToScreenshotState() {
   this.KIRange[0] = this.minKISS;
   this.KIRange[1] = this.maxKISS;
   this.KORange[0] = this.minKOSS;
   this.KORange[1] = this.maxKOSS;
   this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
   this.service.modifySelectedAsset(this.assetSS);
   this.service.close();
 }



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


val: any
 val1: any
 minKI:any
 maxKI:any
 KIRange: any = [];
 minKIDis:any
 minKODis:any
 maxKIDis:any
 maxKODis:any
 vall: any
 vall1: any
 xAxis:any
 xAxis1:any
 minKO:any
 maxKO:any
 minX:any
 maxX:any
 KORange: any = [];
 productCount:any

 updateKIRange(e: any) {
  // if(e.target.name === 'inputMaxKISlider'){
  //   this.KIRange[1] = e.target.value;
  // }
  // else if(e.target.name === 'inputMinKISlider'){
  //   this.KIRange[0] = e.target.value;
  // }
  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
}

updateData(e: any){
  //console.log(this.selectedWorstOfUnderlying);
  this.service.modifySelectedAsset(this.selectedAsset);
 }

// updateSlider(event:any){    
//   if(event.target.value.length===0){
//   event.target.value=0
// }
// if(parseFloat(event.target.value) < this.minKI){
//   event.target.value=this.minKI
// }else if(parseFloat(event.target.value) > this.endKIValue){
//   event.target.value=this.endKIValue
//   event.target.value=this.endKIValue
// }
//   if(event.target.name === 'inputMaxKI'){
//     this.val1 = event.target.value;
//   }
//   else if(event.target.name === 'inputMinKI'){
//     this.val = event.target.value;
//   }
//   this.service.currentminki=this.KIRange[0]
//   this.service.currentmaxki=this.KIRange[1]
//   this.service.currentminko=this.KORange[0]
//   this.service.currentmaxko=this.KORange[1]
//   this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
// }
kiinputchange(event,num){
  if(event.target.value.length===0){
    if(num===1)
    event.target.value=this.minKI
    else if(num===2)
    event.target.value=this.maxKI
  }
  if(parseFloat(event.target.value) < this.minKI){
    event.target.value=this.minKI
  }else if(parseFloat(event.target.value) > this.maxKI){
    event.target.value=this.maxKI
  }

  if(event.target.name==="ki-input1"){
    this.KIRange[0]=parseFloat(event.target.value)
  }else{
    this.KIRange[1]=parseFloat(event.target.value)
  }
  this.service.currentminki = this.KIRange[0]
  this.service.currentmaxki = this.KIRange[1]
}

koinputchange(event,num){
  if(event.target.value.length===0){
    if(num===1)
    event.target.value=this.minKO
    else(num===2)
    event.target.value=this.maxKO
  }
  if(parseFloat(event.target.value) < this.minKO){
    event.target.value=this.minKO
  }else if(parseFloat(event.target.value) > this.maxKO){
    event.target.value=this.maxKO
  }

  if(event.target.name==="ko-input1"){
    this.KORange[0]=parseFloat(event.target.value)
  }else{
    this.KORange[1]=parseFloat(event.target.value)
  }
  this.service.currentminko = this.KORange[0]
  this.service.currentmaxko = this.KORange[1]
}

binder(event) {
  switch(event.target.name){
    case "ki-input1": this.kiinputchange(event,1);
                      break;
    case "ki-input2": this.kiinputchange(event,2);
                      break;
    case "ko-input1": this.koinputchange(event,1);
                      break;
    case "ko-input2":this.koinputchange(event,2);
                      break;
  }

  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])

}

sliderToInputBinder() {
  this.service.currentminki = this.KIRange[0]
  this.service.currentmaxki = this.KIRange[1]
  this.service.currentminko = this.KORange[0]
  this.service.currentmaxko = this.KORange[1]
  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])

}


updateKORange(e: any) {
  // if(e.target.name === 'inputMaxKOSlider'){
  //   this.KORange[1] = e.target.value;
  // }
  // else if(e.target.name === 'inputMinKOSlider'){
  //   this.KORange[0] = e.target.value;
  // }
  this.service.currentminki=this.KIRange[0]
  this.service.currentmaxki=this.KIRange[1]
  this.service.currentminko=this.KORange[0]
  this.service.currentmaxko=this.KORange[1]
  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
}

updateXAxis(e:any){
  if(e.target.name==='inputMaxXSlider'){
    this.maxKIDis=e.target.value;
    console.log(e.target.value)
  }
  else if(e.target.name==='inputMinXSlider'){
    this.minKIDis=e.target.value;
    console.log(e.target.value)
  }
    // this.service.modifyXaxisData(this.minKIDis,this.maxKIDis)
}


updateSlider1(e:any){
  if(e.target.name === 'inputMaxKO'){
    this.vall1 = e.target.value;
  }
  else if(e.target.name === 'inputMinKO'){
    this.vall = e.target.value;
  }
  this.service.currentminki=this.KIRange[0]
  this.service.currentmaxki=this.KIRange[1]
  this.service.currentminko=this.KORange[0]
  this.service.currentmaxko=this.KORange[1]
  this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
}

  private assetSubscription: Subscription = new Subscription;
  
  private selectedAssetSubscription: Subscription = new Subscription;

  ngOnInit(){
    
    
    this.maxKIDis=this.service.getMaxKIDis();
      this.minKIDis=this.service.getMinKIDis();
      this.minKI = this.service.minki;
      this.maxKI= this.service.maxki;
      this.val=this.minKI
      this.val1=this.maxKI
      this.KIRange = [this.service.currentminki, this.service.currentmaxki];


      this.options1.floor=this.minKI
      this.options1.ceil=this.maxKI
  
      
      
      //this.maxX=this.service.getMaxKIDis();
      //this.minX=this.service.getMinKIDis();
      // this.xAxis=this.minX
      // this.xAxis=this.maxX
      this.xAxis=this.minKIDis
      this.xAxis1=this.maxKIDis




      //=======================
      this.minKODis=this.service.getMinKODis();
      this.maxKODis=this.service.getMaxKODis();
      this.minKO = this.service.minko;
      this.maxKO= this.service.maxko;
      this.options2.floor=this.minKO
      this.options2.ceil=this.maxKO
      this.vall=this.minKO
      this.vall1=this.maxKO
      this.KORange = [this.service.currentminko, this.service.currentmaxko];
      this.selectedAsset = 'ALL';

      this.service.modifyKIData(this.KIRange[0],this.KIRange[1],this.KORange[0],this.KORange[1])
      this.service.modifySelectedAsset(this.service.asset)
    
     this.service.dataReceived.subscribe(() => {
      this.maxKIDis=this.service.getMaxKIDis();
      this.minKIDis=this.service.getMinKIDis();
      this.minKI = this.service.minki;
      this.maxKI= this.service.maxki;
      this.val=this.minKI
      this.val1=this.maxKI
      this.KIRange = [this.minKI, this.maxKI];
      
      //this.maxX=this.service.getMaxKIDis();
      //this.minX=this.service.getMinKIDis();
      // this.xAxis=this.minX
      // this.xAxis=this.maxX
      this.xAxis=this.minKIDis
      this.xAxis1=this.maxKIDis

      //=======================
      this.minKODis=this.service.getMinKODis();
      this.maxKODis=this.service.getMaxKODis();
      this.minKO = this.service.minko;
      this.maxKO= this.service.maxko;
      this.vall=this.minKO
      this.vall1=this.maxKO
      this.KORange = [this.minKO, this.maxKO];
      this.selectedAsset = 'ALL';
    });

    this.assetSubscription = this.service.asset$.subscribe((value) => {
      const arr = value;
      this.assetList = [];
    
      arr.forEach(item => this.assetList.push(item));
      this.assetList.sort((a:any,b:any)=>{return a.localeCompare(b)})
      this.assetList.unshift('ALL');
      
    }); 

    this.selectedAssetSubscription = this.service.selectedAsset$.subscribe(value => {
      if(value.length>0)
      this.selectedAsset = value;
    }); 

    this.service.totalProducts$.subscribe((value)=>{
      this.productCount=value
    })
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     this.screenshotDataSubscription = this.service.screenshotData$.subscribe((value) => {
      this.screenshotData = value;
      
      this.sliderHeight = this.screenshotData.length * 200;
      //console.log(this.screenshotData)
    })

    //this.display$ = this.service.watch();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  
  ngOnDestroy(){
    this.assetSubscription.unsubscribe();
    this.selectedAssetSubscription.unsubscribe();
  }
}
