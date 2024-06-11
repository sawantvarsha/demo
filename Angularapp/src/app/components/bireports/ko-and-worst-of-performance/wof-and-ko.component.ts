import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KoAndWorstOfPerformanceService  } from './wof-and-ko-filter.service';
import { NgxCaptureService } from "ngx-capture";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { ViewChild } from '@angular/core';

interface Data {
  GetInteractivedataResult:string;
}


@Component({
  selector: 'app-wof-and-ko',
  templateUrl: './wof-and-ko.component.html',
  styleUrls: ['./wof-and-ko.component.css']
})
export class KoAndWorstOfPerformanceComponent {
  constructor(private service: KoAndWorstOfPerformanceService, private http: HttpClient,private captureService: NgxCaptureService,private snackBar : MatSnackBar) {

  }
popup:any
  products!:number
  selectedCustomer: string = "All"
  customerList: string[] = this.service.customerList

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  minKOSS = 0;
  maxKOSS = 0;
  selectedOption:string='Ascending'
selectedOption1:string='Trace_KI_Distance'
  clientSS='ALL';
  worstOfUnderlyingSS = 'ALL';
  
  
  screenshotData : any = [];
  img = "";
  @ViewChild("screen", { static: true }) screen: any;
  sliderHeight: any = 0;
  showDiv = false;
  

  bg1 : any = []
  bg2 : any = []

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
  
  ///Zeeshan Updated Code from here
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
    this.service.current_min_KO = e.koRangeMin;
    this.service.current_max_KO = e.koRangeMax;
    this.service.selectedUnderlying = e.selectedWorstOfUnderlying;
    this.selectedCustomer = e.selectedCustomer
    this.sendSelectedCustomer(this.selectedCustomer)

    this.service.setBg1(e.bg1)
    this.service.setBg2(e.bg2)
    
    this.service.sendStateDataEvent.emit()
    this.toggleDiv();
  }

  goToOriginalState(){
    this.service.selectedOption= this.service.initialState["selectedOption"]
    this.service.selectedOption1= this.service.initialState["selectedOption1"]
    this.service.current_min_KO = this.service.initialState["min_KO"]
    this.service.current_max_KO = this.service.initialState["max_KO"]
    this.service.selectedUnderlying = this.service.initialState["selectedUnderlying"]
    this.selectedCustomer = this.service.initialState["selectedCustomer"]
  
    this.sendSelectedCustomer(this.selectedCustomer)
  
    this.service.setBg1([this.service.initialState["hex1"]])
    this.service.setBg2([this.service.initialState["hex2"]])
    this.service.sendStateDataEvent.emit()
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
        Client: ${imageObj.selectedCustomer}<br>
        KO Distance (%): ${imageObj.koRangeMin} - ${imageObj.koRangeMax}<br>
        Worst Of Underlying : ${imageObj.selectedWorstOfUnderlying}
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
          this.service.setScreenshotData({"image": this.img, "koRangeMin": this.minKOSS, "koRangeMax": this.maxKOSS
          ,"selectedCustomer": this.clientSS ,"selectedWorstOfUnderlying": this.worstOfUnderlyingSS ,"selectedOption":this.selectedOption,"selectedOption1":this.selectedOption1, "timestamp": new Date(), "bg1": this.bg1, "bg2": this.bg2});
          //console.log(img);
          //console.log(this.screen);
        })
      )
      .subscribe();
  }
  pinned(){
    this.showPopup("Pinned")
    }
  makeCapture(){
    this.showPopup("Screenshot Captured")
  
    this.theReal();
  this.minKOSS = this.service.current_min_KO;
  this.maxKOSS = this.service.current_max_KO;
  
  this.worstOfUnderlyingSS = this.service.selectedUnderlying;
 
  this.clientSS=this.service.selectedCustomer;
  console.log(this.clientSS)
  this.selectedOption=this.service.selectedOption
  this.selectedOption1=this.service.selectedOption1

  this.service.bg1$.subscribe(value => {
    console.log(value);
    this.bg1 = value
  })

  this.service.bg2$.subscribe(value => {
    console.log(value);
    this.bg2 = value
  })
  
    this.snackBar.open("Screenshot Captured", undefined, {
       duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  openCapture() {
    this.service.open();
  }
  
  close() {
    this.service.close();
  }
  goToScreenshotState() {
    console.log(this.minKOSS);
    console.log(this.maxKOSS);
    //this.koRange = this.screenshotKoRange;
    this.service.current_max_KO = this.minKOSS;
    this.service.current_min_KO = this.maxKOSS;
  
    this.service.selectedUnderlying = this.worstOfUnderlyingSS;

    this.selectedCustomer=this.clientSS
    this.sendSelectedCustomer(this.selectedCustomer)
    console.log(this.selectedCustomer)
    this.service.close();
  }
  
  //============================================================================

  ngOnInit(): void {
    // this.http.post<Data>('http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata', {
    //   "strData": "USP_PerformanceTimelineV2_PBIReport",
    //   "I_Entity_ID": "149",
    //   "I_User_Id": "Bhavik",
    //   "CustomerID": "",
    //   "EventType": "",
    //   "I_FromDate": "01-Jan-22",
    //   "I_ToDate": "31-Oct-23",
    //   "Measure": "",
    //   "Sector": "",
    //   "RowsPerPage": "",
    //   "PageNo": "",
    //   "WhereClause": ""
    // }, {
    //   responseType: "json"
    // }).subscribe((value) => {

    //   console.log(value.GetInteractivedataResult)
    //   this.service.setData(JSON.parse(value.GetInteractivedataResult))
    //   this.service.dataReceived.emit();
    // })
    this.selectedCustomer=this.service.selectedCustomer

    this.service.SenddataToDropDown.subscribe(() => {
      this.customerList = this.service.customerList
    })

    this.service.sendProductTotalEvent.subscribe(()=>{
      this.products = this.service.totalproducts
    })

    //===============
    this.service.screenshotData$.subscribe((value) => {
      this.screenshotData = value;
      
      this.sliderHeight = this.screenshotData.length * 200;
     
    })
    // this.display$ = this.service.watch();
    //==============
  }

  sendSelectedCustomer(value: string) {
    this.selectedCustomer = value
    this.service.selectedCustomer = this.selectedCustomer
    this.service.filterSelectedEvent.emit()
  }
}
