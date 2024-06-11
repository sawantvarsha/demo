import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { BarrierProbabilityService } from './barrier-probability.service';
import { NgxCaptureService } from 'ngx-capture';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, tap } from 'rxjs';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-barrier-probability',
  templateUrl: './barrier-probability.component.html',
  styleUrls: ['./barrier-probability.component.css']
})
export class BarrierProbabilityComponent {
  url = "http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata";

  body = {
    "strData": "USP_LifecycleSnapshot_PBIReport",
    "I_Entity_ID": "149",
    "I_User_Id": "Bhavik",
    "CustomerID": "",
    "EventType": "",
    "I_FromDate": "01-Oct-2022",
    "I_ToDate": "31-Oct-2022",
    "Measure": "",
    "Sector": "",
    "RowsPerPage": "",
    "PageNo": "",
    "WhereClause": ""
  }

  constructor(private httpClient: HttpClient, private reportService: BarrierProbabilityService,private captureService: NgxCaptureService,private snackBar : MatSnackBar) {

  }

  val: any
  val1: any
  minimumki!: number
  maximumki!: number
  currentminimumki:number=0
  currentmaximumki:number=0
  minimumko!: number
  maximumko!: number
  currentminimumko:number=0
  currentmaximumko:number=0
  vall: any
  vall1: any
  popup:any=""

  state: any = true
  // MAXki: any
  // MINki: any

  productCount: any

 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

minKISS = 0;
maxKISS = 0;
minKOSS = 0;
maxKOSS = 0;
stateKISS:any;
fieldkISS:any;
stateKOSS:any;
fieldkOSS:any;

screenshotData : any = [];
img = "";
@ViewChild("screen", { static: true }) screen: any;
sliderHeight: any = 0;
showDiv = false;
//toggle = document.getElementsByClassName('arrow');

options1: Options = {
  // floor: this.startDate.getTime(),
  // ceil:this.endDate.getTime(),
  step: 0.001,
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
  step: 0.001,
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

// display$: Observable<'open' | 'close'> = new Observable<'close'>;
showScreenshotPopup = false;

showPopup(val:string) {
  this.popup=val
  this.showScreenshotPopup = true;
  setTimeout(() => {
    this.showScreenshotPopup = false;
  }, 1500); // Close the popup after 2 seconds (adjust the duration as needed)
}
pinned(){
this.showPopup("Pinned")
}
goToState(e : any){
  console.log(e);
  this.reportService.selectedOptionKI=e.selectedOptionKI
  this.reportService.selectedOption1KI=e.selectedOption1KI
  this.reportService.selectedOptionKO=e.selectedOptionKO
  this.reportService.selectedOption1KO=e.selectedOption1KO
  this.currentminimumki = e.kiRangeMin;
  this.currentmaximumki = e.kiRangeMax;
  this.currentminimumko = e.koRangeMin;
  this.currentmaximumko = e.koRangeMax;
  
  this.reportService.modifyKIData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
  this.reportService.modifyKOData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
  // this.reportService.modifyKiDataOnFilters(this.stateKISS);
  // this.reportService.modifyKiDataOnFields(this.fieldkISS);
  // this.reportService.modifyKoDataOnFilters(this.stateKOSS);
  // this.reportService.modifyKoDataOnFields(this.fieldkOSS);
  this.toggleDiv();
}

goToOriginalState(){
  this.reportService.selectedOptionKI=this.reportService.initialState["selectedOptionKI"]
  this.reportService.selectedOption1KI=this.reportService.initialState["selectedOption1KI"]
  this.reportService.selectedOptionKO=this.reportService.initialState["selectedOptionKO"]
  this.reportService.selectedOption1KO=this.reportService.initialState["selectedOption1KO"]
  this.currentminimumki = this.reportService.initialState["minimunKI"]
  this.currentmaximumki = this.reportService.initialState["maximumKI"]
  this.currentminimumko = this.reportService.initialState["minimumKO"]
  this.currentmaximumko = this.reportService.initialState["maximumKO"]
  
  this.reportService.modifyKIData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
  this.reportService.modifyKOData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
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
  

theReal() {
  console.log(this.captureService)
  this.captureService
 
    .getImage(this.screen.nativeElement, true)
    .pipe(
      tap((img) => {
        console.log(this.screen);
        this.img = img;
        this.reportService.setScreenshotData({"image": this.img, "kiRangeMin": this.minKISS, "kiRangeMax": this.maxKISS, "koRangeMin": this.minKOSS, "koRangeMax": this.maxKOSS,"selectedOptionKI":this.stateKISS,"selectedOption1KI":this.fieldkISS,"selectedOptionKO":this.stateKOSS,"selectedOption1KO": this.fieldkOSS, "timestamp": new Date()});
        //console.log(img);
        //console.log(this.screen);
      })
    )
    .subscribe();
}
makeCapture(){
  this.showPopup("Screenshot Captured")
  this.theReal();
  this.minKISS = this.currentminimumki;
  this.maxKISS = this.currentmaximumki;
  this.minKOSS = this.currentminimumko;
  this.maxKOSS = this.currentmaximumko;
  this.stateKISS=this.reportService.selectedOptionKI;
  console.log(this.stateKISS)
  this.fieldkISS=this.reportService.selectedOption1KI;
  console.log(this.fieldkISS)
  this.stateKOSS=this.reportService.selectedOptionKO;
  console.log(this.stateKOSS)
  this.fieldkOSS=this.reportService.selectedOption1KO;
  console.log(this.fieldkOSS)
  this.snackBar.open("Screenshot Captured", undefined, {
     duration: 1000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  });
  console.log(this.stateKISS+" "+this.fieldkISS)
  //console.log(this.minSS);
  //console.log(this.maxSS);
  //this.reportService.setScreenshotData({"image": this.img, "koRangeMin": this.minSS, "koRangeMax": this.maxSS, "selectedWorstOfUnderlying": this.worstOfUnderlyingSS, "timestamp": new Date()});
  //alert('Screenshot Captured');

}
openCapture() {
  this.reportService.open();
}

close() {
  this.reportService.close();
}
goToScreenshotState() {
  this.currentminimumki = this.minKISS;
  this.currentmaximumki = this.maxKISS;
  this.currentminimumko  = this.minKOSS;
  this.currentmaximumko = this.maxKOSS;
  this.reportService.modifyKIData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
  this.reportService.modifyKOData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
//   this.reportService.modifyKiDataOnFilters(this.stateKISS);
//  this.reportService.modifyKiDataOnFields(this.fieldkISS);
//   this.reportService.modifyKoDataOnFilters(this.stateKOSS);
//   this.reportService.modifyKoDataOnFields(this.fieldkOSS);
  this.reportService.close();
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setProperties() {
    this.minimumki=this.reportService.minimunKI
    this.maximumki=this.reportService.maximumKI
    this.currentminimumki=this.reportService.currentminimunKI
    this.currentmaximumki=this.reportService.currentmaximumKI
    this.minimumko=this.reportService.minimumKO
    this.maximumko=this.reportService.maximumKO
    this.currentminimumko=this.reportService.currentminimumKO
    this.currentmaximumko=this.reportService.currentmaximumKO

    this.options1.floor=this.minimumki
    this.options1.ceil=this.maximumki

    this.options2.floor=this.minimumko
    this.options2.ceil=this.maximumko
  }


  ngOnInit(): void {
    if(this.reportService.dataReceivedFlag===true)
    this.setProperties()

    this.reportService.dataReceived.subscribe(() => {
      this.setProperties()

    });

    this.reportService.dataCount$.subscribe((value) => {
      this.productCount = value
    })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.screenshotDataSubscription = this.reportService.screenshotData$.subscribe((value) => {
          this.screenshotData = value;
          
          this.sliderHeight = this.screenshotData.length * 200;
          //console.log(this.screenshotData)
        })
    
        // this.display$ = this.reportService.watch();
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }


  //updateKIRange(e: any) {
   // if (e.target.name === 'inputMaxKISlider') {
      //this.currentmaximumki = e.target.value;
    //}
   // else if (e.target.name === 'inputMinKISlider') {
     // this.currentminimumki = e.target.value;
    //}
    // this.reportService.modifyKIData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
    // this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  //}


  // updateSlider(e: any) {
  //   if (e.target.name === 'inputMaxKI') {
  //     this.val1 = e.target.value;
  //   }
  //   else if (e.target.name === 'inputMinKI') {
  //     this.val = e.target.value;
  //   }
  //   this.reportService.modifyKIData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  //   this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  // }


  
  // updateKORange(e: any) {
  //   // if (e.target.name === 'inputMaxKOSlider') {
  //   //   this.currentmaximumko = e.target.value;
  //   // }
  //   // else if (e.target.name === 'inputMinKOSlider') {
  //   //   this.currentminimumko = e.target.value;
  //   // }
  //   this.reportService.modifyKIData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  //   this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  // }


  // updateSlider1(e: any) {
  //   if (e.target.name === 'inputMaxKO') {
  //     this.vall1 = e.target.value;
  //   }
  //   else if (e.target.name === 'inputMinKO') {
  //     this.vall = e.target.value;
  //   }
  //   this.reportService.modifyKIData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  //   this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  // }

  kiinputchange(event,num){
    if(event.target.value.length===0){
      if(num===1)
      event.target.value=this.minimumki
      else if(num===2)
      event.target.value=this.maximumki
    }

    if(parseFloat(event.target.value) < this.minimumki){
      event.target.value=this.minimumki
    }else if(parseFloat(event.target.value) > this.maximumki){
      event.target.value=this.maximumki
    }
  
    if(event.target.name==="ki-input1"){
      this.currentminimumki=parseFloat(event.target.value)
    }else{
      this.currentmaximumki=parseFloat(event.target.value)
    }
    this.reportService.currentminimunKI = this.currentminimumki
    this.reportService.currentmaximumKI = this.currentmaximumki
  }
  
  koinputchange(event,num){
    if(event.target.value.length===0){
      if(num===1)
      event.target.value=this.minimumko
      else(num===2)
      event.target.value=this.maximumko
    }
    if(parseFloat(event.target.value) < this.minimumko){
      event.target.value=this.minimumko
    }else if(parseFloat(event.target.value) > this.maximumko){
      event.target.value=this.maximumko
    }
  
    if(event.target.name==="ko-input1"){
      this.currentminimumko=parseFloat(event.target.value)
    }else{
      this.currentmaximumko=parseFloat(event.target.value)
    }
    this.reportService.currentminimumKO = this.currentminimumko
    this.reportService.currentmaximumKO = this.currentmaximumko
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
  
    this.reportService.modifyKIData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
    this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  
  }
  
  sliderToInputBinder() {
    this.reportService.currentminimunKI = this.currentminimumki
    this.reportService.currentmaximumKI = this.currentmaximumki
    this.reportService.currentminimumKO = this.currentminimumko
    this.reportService.currentmaximumKO = this.currentmaximumko
    this.reportService.modifyKIData(this.currentminimumki,this.currentmaximumki,this.currentminimumko,this.currentmaximumko)
    this.reportService.modifyKOData(this.currentminimumki, this.currentmaximumki, this.currentminimumko, this.currentmaximumko)
  
  }
  



}
