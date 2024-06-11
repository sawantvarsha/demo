import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetExposureService } from './asset-exposure.service';
import { DatePipe } from '@angular/common';
import { NgxCaptureService } from 'ngx-capture';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

type Data = {
  GetInteractivedataResult: string;
}

export interface pbi_data {
  underlying: string;
  probability: number;
  next_red_exp: number;
  total_prd_exp: number;
  redemptionDate: Date;
}

@Component({
  selector: 'app-asset-exposure',
  templateUrl: './asset-exposure.component.html',
  styleUrls: ['./asset-exposure.component.css']
})
export class AssetExposureComponent implements OnInit {



  constructor(private http: HttpClient, private service: AssetExposureService, private datepipe: DatePipe, private captureService: NgxCaptureService, private snackBar: MatSnackBar) {

  }

  selectedUnderlying: string = this.service.selectedUnderlying
  selectedRedemptionExposure: string = this.service.selectedRedemptionExposure
  selectedRedemptionDate: any = this.service.selectedRedemptionDate
  selectedProductExposure: string = this.service.selectedProductExposure
  selectedProbability: string = this.service.selectedProbability

  

  showScreenshotPopup: Boolean = false
  sliderHeight: any = 0;
  showDiv = false;
  scroll: string = "Scroll on"
  screenshotData: any = [];
  toggle = document.getElementsByClassName('info');
  popup: any
  img = '';
  @ViewChild('screen', { static: true }) screen: any;

  clientSS = '';
  exchangeSS = '';
  sectorSS = '';
  valueMonthSS = 0
  highValueMonthSS = 12
  valueQuarterSS = 0
  highValueQuarterSS = 4
  valueYearSS = 0
  highValueYearSS = 2
  dateTypeForSliderSS: number = 0
  selectedUnderlyingSS = ''
  selectedRedemptionDateSS = ''
  selectedProbabilitySS = ''
  selectedProductExposureSS = ''
  selectedRedemptionExposureSS = ''
  selectedOptionSS=''
  selectedOption1SS=''

  toggleScroll() {
    if (this.scroll === 'Scroll on') {
      this.scroll = 'Scroll off';
    }
    else {
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

    this.service.selectedClient=e.client
    this.service.selectedExchange=e.exchange
    this.service.selectedSector=e.sector

    this.service.valueMonth=e.valueMonth
    this.service.highValueMonth=e.highValueMonth
    this.service.valueQuarter=e.valueQuarter
    this.service.highValueQuarter=e.highValueQuarter
    this.service.valueYear=e.valueYear
    this.service.highValueYear=e.highValueYear
    this.service.dateTypeForSlider=e.dateTypeForSlider

    this.service.selectedUnderlying=e.underlying
    this.service.selectedRedemptionDate=e.earliestRedemptionDate
    this.service.selectedProductExposure=e.totalProductExposure
    this.service.selectedRedemptionExposure=e.nextRedemptionExposure

    this.service.selectedOption=e.selectedOption
    this.service.selectedOption1=e.selectedOption1
    
     this.service.sendStateDataEvent.emit()
    this.toggleDiv();
  }

  goToOriginalState(){
    this.service.selectedOption= this.service.initialState["selectedOption"]
    this.service.selectedOption1= this.service.initialState["selectedOption1"]
    this.service.selectedClient = this.service.initialState["selectedClient"]
    this.service.selectedSector = this.service.initialState["selectedSector"]

    this.service.valueMonth= this.service.initialState["valueMonth"]
    this.service.highValueMonth= this.service.initialState["highValueMonth"]
    this.service.valueQuarter= this.service.initialState["valueQuarter"]
    this.service.highValueQuarter= this.service.initialState["highValueQuarter"]
    this.service.valueYear= this.service.initialState["valueYear"]
    this.service.highValueYear= this.service.initialState["highValueYear"]
    this.service.dateTypeForSlider= this.service.initialState["dateTypeForSlider"]

    this.service.selectedUnderlying = this.service.initialState["selectedUnderlying"]
    this.service.selectedRedemptionDate = this.service.initialState["selectedRedemptionDate"]
    this.service.selectedProductExposure = this.service.initialState["selectedProductExposure"]
    this.service.selectedRedemptionExposure = this.service.initialState["selectedRedemptionExposure"]

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
      Client: ${imageObj.client}<br>
      Exchannge: ${imageObj.exchange}<br>
      Sector: ${imageObj.sector}<br>`;

    this.tooltipContent = tooltipText;
    this.tooltipStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
  }

  hideTooltip() {
    this.tooltipContent = '';
  }

  showPopup(val: string) {
    this.popup = val
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
          this.img=img
          this.service.setScreenshotData({
            image: this.img,
            client: this.clientSS,
            exchange: this.exchangeSS,
            sector: this.sectorSS,
            underlying: this.selectedUnderlyingSS,
            earliestRedemptionDate: this.selectedRedemptionDateSS,
            nextRedemptionExposure: this.selectedRedemptionExposureSS,
            totalProductExposure: this.selectedProductExposureSS,
            valueMonth: this.valueMonthSS,
            highValueMonth: this.highValueMonthSS,
            valueQuarter: this.valueQuarterSS,
            highValueQuarter: this.highValueQuarterSS,
            valueYear: this.valueYearSS,
            highValueYear: this.highValueYearSS,
            dateTypeForSlider: this.dateTypeForSliderSS,
            selectedOption:this.selectedOptionSS,
            selectedOption1:this.selectedOption1SS,
            timestamp: new Date(),
          });
        })
      )
      .subscribe();
  }
  pinned() {
    this.showPopup("Pinned")
  }
  makeCapture() {
    this.showPopup("Screenshot Captured")
    this.theReal();
    this.clientSS = this.service.selectedClient;
    this.exchangeSS = this.service.selectedExchange;
    this.sectorSS = this.service.selectedSector;

    this.valueMonthSS = this.service.valueMonth
    this.highValueMonthSS = this.service.highValueMonth
    this.valueQuarterSS = this.service.valueQuarter
    this.highValueQuarterSS = this.service.highValueQuarter
    this.valueYearSS = this.service.valueYear
    this.highValueYearSS = this.service.highValueYear
    this.dateTypeForSliderSS = this.service.dateTypeForSlider

    this.selectedUnderlyingSS = this.service.selectedUnderlying
    this.selectedRedemptionDateSS = this.service.selectedRedemptionDate
    this.selectedProbabilitySS = this.service.selectedProbability
    this.selectedProductExposureSS = this.service.selectedProductExposure
    this.selectedRedemptionExposureSS = this.service.selectedRedemptionExposure

    this.selectedOptionSS=this.service.selectedOption
    this.selectedOption1SS=this.service.selectedOption1


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
    // console.log(this.minKISS);
    // console.log(this.maxKISS);
    // //this.koRange = this.screenshotKoRange;
    // this.service.current_max_KI = this.minKISS;
    // this.service.current_min_KI = this.maxKISS;
    // this.service.current_min_MTM = this.minMTMSS;
    // this.service.current_max_MTM = this.maxMTMSS;
    // this.service.selectedUnderlying = this.worstOfUnderlyingSS;
    // this.service.selectedCurrency = this.currencySS;
    // this.service.selectedPayOff = this.payOffSS;
    // this.selectedCustomer=this.clientSS
    // this.sendSelectedCustomer(this.selectedCustomer)
    // console.log(this.selectedCustomer)
    this.service.close();
  }



  ngOnInit(): void {

    this.selectedClient = this.service.selectedClient
    this.selectedExchange = this.service.selectedExchange
    this.selectedSector = this.service.selectedSector

    this.service.sendSelectedObject.subscribe((data) => {
      if (this.service.displayValue === true) {
        this.displaySelectedChartObject(this.service.selectedAssetObject)
      }
      else {
        this.displaySelectedObject(this.service.selectedObject)
      }
    })


    this.service.sendDropdown.subscribe(() => {
      this.clientList = this.service.clientList.filter(client => client !== "").sort((a, b) => a.localeCompare(b))
      this.exchangeList = this.service.exchangeList.filter(exchange => exchange !== "").sort((a, b) => a.localeCompare(b))
      this.sectorList = this.service.sectorList.filter(sector => sector !== "").sort((a, b) => a.localeCompare(b))
    })

    this.service.screenshotData$.subscribe((value) => {
      this.screenshotData = value;

      this.sliderHeight = this.screenshotData.length * 200;
    });

    this.service.sendStateDataEvent.subscribe(()=>{
      this.selectedClient = this.service.selectedClient
      this.selectedExchange = this.service.selectedExchange
      this.selectedSector = this.service.selectedSector
    })
  }

  exchangeList: string[] = []
  selectedExchange: string = "All"

  sectorList: string[] = []
  selectedSector: string = "All"

  clientList: string[] = []
  selectedClient: string = "All"

  sendSelectedExchange(value: any) {
    this.selectedExchange = value
    this.service.selectedExchange = this.selectedExchange
    this.service.dataFilterEvent.emit()
  }

  sendSelectedSector(value: any) {
    this.selectedSector = value
    this.service.selectedSector = this.selectedSector
    this.service.dataFilterEvent.emit()
  }

  sendSelectedClient(value: any) {
    this.selectedClient = value
    this.service.selectedClient = this.selectedClient
    this.service.dataFilterEvent.emit()
  }

  displaySelectedChartObject(value: pbi_data) {
    if (this.service.displayValue === true) {
      this.service.selectedAssetObject = value
      this.selectedUnderlying = value['underlying']
      this.selectedRedemptionDate = this.datepipe.transform(value['redemptionDate'], 'EEE dd MMM yyyy')

      this.selectedRedemptionExposure = this.convertValueToString(value['next_red_exp'])

      this.selectedProductExposure = this.convertValueToString(value['total_prd_exp'])
    }
    else {
      this.selectedUnderlying = '(blank)'
      this.selectedProbability = '(blank)'
      this.selectedProductExposure = this.convertValueToString(this.service.selectedObject.total_prd_exp)
      this.selectedRedemptionDate = this.datepipe.transform(this.service.selectedObject['redemptionDate'], 'EEE dd MMM yyyy')
      this.selectedRedemptionExposure = this.convertValueToString(this.service.selectedObject.next_red_exp)
    }
  }

  displaySelectedObject(value: pbi_data) {
    this.selectedUnderlying = '(blank)'
    this.selectedProbability = '(blank)'
    this.selectedProductExposure = this.convertValueToString(this.service.selectedObject.total_prd_exp)
    this.selectedRedemptionDate = this.datepipe.transform(this.service.selectedObject['redemptionDate'], 'EEE dd MMM yyyy')
    this.selectedRedemptionExposure = this.convertValueToString(this.service.selectedObject.next_red_exp)
  }


  convertValueToString(value: number) {
    let displayValue: string = ''
    if (value > 1000000) {
      displayValue = (value / 1000000).toString()
      displayValue = displayValue.substring(0, displayValue.indexOf(".") + 3) + "M"
    }
    else {
      if (value !== 0) {
        displayValue = (value / 1000).toString()
        displayValue = displayValue.substring(0, displayValue.indexOf(".") + 3) + "K"
      }
    }
    return displayValue
  }


}
