import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilterService } from './filter.service';
import { HttpClient } from '@angular/common/http';
import { NgxCaptureService } from 'ngx-capture';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';

interface Data {
  GetInteractivedataResult: string;
}

@Component({
  selector: 'app-sales-and-revenue-performance',
  templateUrl: './sales-and-revenue-performance.component.html',
  styleUrls: ['./sales-and-revenue-performance.component.css']
})
export class SalesAndRevenuePerformanceComponent implements OnInit, OnDestroy {

  selectedCustomer: string = "All"
  customerList: any;
  // display = false
  constructor(private service: FilterService, private http: HttpClient, private captureService: NgxCaptureService, private snackBar: MatSnackBar) {

  }
  // ngAfterViewInit(): void {
  //   this.display = true
  // }

  //=============================================================================

  popup:any
  selectedClients: string[] = []
  displayString: string = "All"
  displayDropdown= false
  currentStartDateSS = new Date();
  currentEndDateSS = new Date();
  selectedCurrencySS = ""
  selectedCustomerSS = ""
  totalTradeVolumeSS = ''
  totalTradeRevenueSS = ''
  selectedChartSS = 0
  selectedChartCurrency=''
  selectedChartPayOff=''
  selectedOptionCurrency: string = 'Ascending'
  selectedOption1Currency: string = 'Currency'
  
  selectedOptionPayoff: string = 'Ascending'
  selectedOption1Payoff: string = 'PayOff'
  
  screenshotData: any = [];
  img = "";
  @ViewChild("screen", { static: true }) screen: any;
  sliderHeight: any = 0;
  showDiv = false;
  //toggle = document.getElementsByClassName('arrow');
  // isHidden = false;

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

  // display$: Observable<'open' | 'close'> = new Observable<'close'>;

  goToState(e: any) {
    console.log(e);
    this.service.currentMinDate = e.startDate;
    this.service.currentMaxDate = e.endDate;
    this.service.selectedLabel = e.selectedCurrency;
    this.service.selectedCustomer = e.selectedCustomer;
    this.service.selectedOptionCurrency = e.selectedOptionCurrency
    this.service.selectedOption1Currency = e.selectedOption1Currency
    this.service.selectedOptionPayoff = e.selectedOptionPayoff
    this.service.selectedOption1Payoff = e.selectedOption1Payoff
    this.service.selectedChart = e.selectedChart
    this.service.currentSelectedCurrency = e.selectedChartCurrency
    this.service.currentSelectedPayOff = e.selectedChartPayoff
    this.service.sendStateDataEvent.emit()
    this.toggleDiv();
  }
 
  goToOriginalState(){
    this.service.currentMinDate = this.service.initialState["minDate"];
    this.service.currentMaxDate = this.service.initialState["maxDate"];
    this.service.selectedLabel = this.service.initialState["selectedLabel"];
    this.service.selectedCustomer =this.service.initialState["selectedCustomer"];
    this.service.selectedOptionCurrency = this.service.initialState["selectedOptionCurrency"];
    this.service.selectedOption1Currency = this.service.initialState["selectedOption1Currency"];
    this.service.selectedOptionPayoff = this.service.initialState["selectedOptionPayoff"];
    this.service.selectedOption1Payoff = this.service.initialState["selectedOption1Payoff"];
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
  
  getDate(date: any) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
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
    if (date.getMinutes() <= 9) {
      minutes = '0' + date.getMinutes();
    }
    if (date.getSeconds() <= 9) {
      seconds = '0' + date.getSeconds();
    }
  
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
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
          this.service.setScreenshotData({
            "image": this.img, "startDate": this.currentStartDateSS, "endDate": this.currentEndDateSS, "selectedCurrency": this.selectedCurrencySS, "selectedCustomer": this.selectedCustomerSS
            , "tradeRevenue": this.totalTradeRevenueSS, "tradeVolume": this.totalTradeVolumeSS, "selectedOptionCurrency": this.selectedOptionCurrency, "selectedOption1Currency": this.selectedOption1Currency, "selectedOptionPayoff": this.selectedOptionPayoff, 
            "selectedOption1Payoff": this.selectedOption1Payoff, "selectedChart":this.selectedChartSS,'selectedChartCurrency':this.selectedChartCurrency,'selectedChartPayoff':this.selectedChartPayOff, "timestamp": new Date(), "isHidden": false
          });
          //console.log(img);
          //console.log(this.screen);
        })
      )
      .subscribe();
  }
  pinned(){
    this.showPopup("Pinned")
    }
  makeCapture() {
    this.showPopup("Screenshot Captured")
    this.theReal();
    this.currentStartDateSS = this.service.currentMinDate;
    this.currentEndDateSS = this.service.currentMaxDate;
    this.selectedCurrencySS = this.service.selectedLabel;
    this.selectedCustomerSS = this.service.selectedCustomer;
    this.selectedChartSS = this.service.selectedChart
    this.selectedOption1Currency = this.service.selectedOption1Currency
    this.selectedOptionCurrency = this.service.selectedOptionCurrency
    this.selectedOption1Payoff = this.service.selectedOption1Payoff
    this.selectedOptionPayoff = this.service.selectedOptionPayoff
    this.selectedChartCurrency = this.service.currentSelectedCurrency
    this.selectedChartPayOff = this.service.currentSelectedPayOff

    let tradeRevenue :number | string= this.service.totalRevenue
    let displayRevenue: string = ''
    if (tradeRevenue > 1000000) {
      displayRevenue = (tradeRevenue / 1000000).toString()
      tradeRevenue = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "M"
    }
    else {
      if (tradeRevenue !== 0) {
        displayRevenue = (tradeRevenue / 1000).toString()
        tradeRevenue = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "K"
      }
    }

    
    let tradeVolume:number | string = this.service.totalVolume
    let displayVolume: string = ''
    if (tradeVolume > 1000000) {
      displayVolume = (tradeVolume / 1000000).toString()
      tradeVolume = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "M"
    }
    else {
      if (tradeVolume !== 0) {
        displayVolume = (tradeVolume / 1000).toString()
        tradeVolume = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "K"
      }
    }

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

tooltipContent: string = '';
tooltipStyle: any = {};

  showTooltip(event: any, imageObj: any) {
    const tooltip = document.querySelector('.custom-tooltip');
    const tooltipText = `Timestamp: ${this.getTimestamp(imageObj.timestamp)}<br>
      Client: ${imageObj.selectedCustomer}<br>
      Date: ${this.getDate(imageObj.startDate)} - ${this.getDate(imageObj.endDate)}<br>
      Currency: ${imageObj.selectedCurrency}<br>
      tradeRevenue: ${imageObj.tradeRevenue}<br>
      tradeVolume: ${imageObj.tradeVolume}`;
  
    this.tooltipContent = tooltipText;
    this.tooltipStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`
    };
  }

  hideTooltip() {
    this.tooltipContent = '';
  }



  ngOnDestroy(): void {
    this.service.destroySelected();
  }
  ngOnInit(): void {
    // this.http.post<Data>('http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata',{
    //   "strData": "USP_SalesRevenuePerformance_PBIReport",
    //   "I_Entity_ID": "149",
    //   "I_User_Id": "Bhavik",
    //   "CustomerID": "",
    //   "EventType": "",
    //   "I_FromDate": "",
    //   "I_ToDate": "",
    //   "Measure": "",
    //   "Sector": "",
    //   "RowsPerPage": "",
    //   "PageNo": "",
    //   "WhereClause": ""
    // },{
    //   responseType:"json"
    // }).subscribe((value)=>{
    //   console.log(JSON.parse(value.GetInteractivedataResult))
    //   this.service.setApiData(JSON.parse(value.GetInteractivedataResult))
    //   this.service.dataReceived.emit();
    // })
    this.customerList = this.service.clientList
    this.selectedCustomer = this.service.selectedCustomer

    this.service.filterListEvent.subscribe(() => {
      this.customerList = this.service.clientList
    })

    this.service.sendStateDataEvent.subscribe(() => {
      this.selectedCustomer = this.service.selectedCustomer
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
    // this.service.currentSelectedCurrency="All"
    // this.service.currentSelectedPayOff="All"
    this.selectedCustomer = value
    this.service.selectedCustomer = this.selectedCustomer
    this.service.dateCurrencyAndPayOffFilter()
    this.service.filterSelectedEvent.emit()
  }




}
