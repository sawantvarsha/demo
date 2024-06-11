import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GreekLcmFilterService } from './greek-lcm-filter.service';
import { NgxCaptureService } from "ngx-capture";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-greek-lcm',
  templateUrl: './greek-lcm.component.html',
  styleUrls: ['./greek-lcm.component.scss']
})
export class GreekLCMComponent implements OnInit {

  constructor(private service: GreekLcmFilterService, private http: HttpClient, private captureService: NgxCaptureService, private snackBar: MatSnackBar) {
  }


  popup: any
  displayString: string='All';
  displayDropdown: boolean;
  selectedClients:string[]=[];

  products!: number
  selectedCustomer: string = "All"
  customerList: string[] = this.service.customerList

  minDeltaSS = 0;
  maxDeltaSS = 0;
  selectedOption: string = 'Ascending'
  selectedOption1: string = 'Delta'
  clientSS = 'ALL';
  underlyingSS = 'ALL';

  screenshotData: any = [];
  img = "";
  @ViewChild("screen", { static: true }) screen: any;
  sliderHeight: any = 0;
  showDiv = false;

  bg1: any = []
  bg2: any = []

  toggle = document.getElementsByClassName('info');
  scroll: string = "Scroll on"

  //Added by AdilP
  selectedChart: string;
  toggleScroll() {
    if (this.scroll === 'Scroll on') {
      this.scroll = 'Scroll off';
    }
    else {
      this.scroll = 'Scroll on'
    }
  }

  toggleDiv() {

    const slideTrack = document.querySelector('.slide-track');
    //console.log(slideTrack?.setAttribute('style', `height:${this.sliderHeight}px`));

    if (this.toggle[0].classList.contains('active')) {

      this.toggle[0].classList.remove('active');
    } else {

      this.toggle[0].classList.add('active');
    }

    this.showDiv = !this.showDiv;
  }

  goToState(e : any){
  // console.log(e);
  this.service.selectedOption=e.selectedOption
  this.service.selectedOption1=e.selectedOption1
  this.service.current_min_Delta = e.deltaRangeMin;
  this.service.current_max_Delta = e.deltaRangeMax;
  this.service.selectedUnderlying = e.selectedUnderlying;
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
  this.service.current_min_Delta = this.service.initialState["min_Delta"]
  this.service.current_max_Delta = this.service.initialState["max_Delta"]
  this.service.selectedCurrency = this.service.initialState["selectedCurrency"];
  this.service.payoff = this.service.initialState["selectedPayoff"];
  this.service.selectedUnderlying = this.service.initialState["selectedUnderlying"]
  this.selectedCustomer = this.service.initialState["selectedCustomer"]
  this.service.current_min_Gamma = this.service.initialState["min_Gamma"]
  this.service.current_max_Gamma = this.service.initialState["max_Gamma"]
  this.service.current_min_Vega = this.service.initialState["min_Vega"]
  this.service.current_max_Vega = this.service.initialState["max_Vega"]
  this.service.min_Notional = this.service.initialState["min_Notional"]
  this.service.max_Notional = this.service.initialState["max_Notional"]
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
      KI Distance (%): ${imageObj.deltaRangeMin} - ${imageObj.deltaRangeMax}<br>
      Worst Of Underlying : ${imageObj.selectedUnderlying}
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

  showPopup(val: string) {
    this.popup = val
    this.showScreenshotPopup = true;
    setTimeout(() => {
      this.showScreenshotPopup = false;
    }, 1500); // Close the popup after 2 seconds (adjust the duration as needed)
  }

  theReal() {
  // console.log(this.captureService)
  this.captureService
 
    .getImage(this.screen.nativeElement, true)
    .pipe(
      tap((img) => {
        // console.log(this.screen);
        this.img = img;
        this.service.setScreenshotData({"image": this.img, "deltaRangeMin": this.minDeltaSS, "deltaRangeMax": this.maxDeltaSS
        ,"selectedCustomer": this.clientSS ,"selectedUnderlying": this.underlyingSS ,"selectedOption":this.selectedOption,"selectedOption1":this.selectedOption1, "timestamp": new Date(), "bg1": this.bg1, "bg2": this.bg2});
        //console.log(img);
        //console.log(this.screen);
      })
    )
    .subscribe();
}
  pinned() {
    this.showPopup("Pinned")
  }

  makeCapture(){
    this.showPopup("Screenshot Captured")
    this.theReal();
    this.minDeltaSS = this.service.current_min_Delta;
    this.maxDeltaSS = this.service.current_max_Delta;
  
    this.underlyingSS = this.service.selectedUnderlying;
   
    this.clientSS=this.service.selectedCustomer;
    //console.log(this.clientSS)
  
    this.service.bg1$.subscribe(value => {
      //console.log(value);
      this.bg1 = value
    })
  
    this.service.bg2$.subscribe(value => {
      this.bg2 = value
    })
  
    this.snackBar.open("Screenshot Captured", undefined, {
       duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    this.selectedOption=this.service.selectedOption
    this.selectedOption1=this.service.selectedOption1
  }
  
  openCapture() {
    this.service.open();
  }

  close() {
    this.service.close();
  }
  goToScreenshotState() {
    // console.log(this.minDeltaSS);
    // console.log(this.maxDeltaSS);
    //this.koRange = this.screenshotKoRange;
    this.service.current_max_Delta = this.minDeltaSS;
    this.service.current_min_Delta = this.maxDeltaSS;
    this.service.selectedUnderlying = this.underlyingSS;
    this.selectedCustomer=this.clientSS
    this.sendSelectedCustomer(this.selectedCustomer)
    // console.log(this.selectedCustomer)
    this.service.close();
  }

  sendSelectedCustomer(value: string) {
    this.selectedCustomer = value
    this.service.selectedCustomer = this.selectedCustomer
    this.service.filterSelectedEvent.emit()
  }

  ngOnInit(): void {
    this.selectedCustomer = this.service.selectedCustomer
    // this.service.SenddataToDropDown.subscribe(() => {
    //   this.customerList = this.service.customerList
    // })

    this.service.sendProductTotalEvent.subscribe(() => {
      this.products = this.service.totalproducts
    })
    this.service.screenshotData$.subscribe((value) => {
      this.screenshotData = value;

      this.sliderHeight = this.screenshotData.length * 200;

    })

  }

  changeChart(chart){
    try {
      this.selectedChart= chart;
    } catch (error) {
      
    }
  }


}
