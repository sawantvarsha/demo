import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ExcelService } from '../euroconnect/services/excel.service';
import { environment } from '../../../environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SpInteractiveDataService } from '../../services/sp-interactive-data.service';
import { ApifunctionService } from 'src/app/services/ucp/apifunction.service';
import { DatePipe } from '@angular/common';
import { MatCalendar } from '@angular/material/datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { AppConfig } from 'src/app/services/config.service';
import { event, isEmptyObject } from 'jquery';
import { ChartService } from 'src/app/themeService/chart.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
// import zoomPlugin from 'chartjs-plugin-zoom';
// import 'chartjs-adapter-date-fns';
// import 'chartjs-adapter-date-fns';
// import { de } from 'date-fns/locale';
// import { L } from '@angular/cdk/keycodes';
// Chart.register(zoomPlugin);

import { EcCommonService } from '../../components/euroconnect/services/ec-common.service';
import moment from 'moment';
import { isNumber } from 'chart.js/helpers';
import { SpPortfolioSnapshotService } from 'src/app/services/sp-portfolio-snapshot.service';
import { Subscription } from 'rxjs';
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-interactive-dashboard',
  templateUrl: './interactive-dashboard.component.html',
  styleUrls: ['./interactive-dashboard.component.scss'],
})

export class InteractiveDashboardComponent implements OnInit,OnDestroy  {

  asseturl = environment.asseturl;
  item: any = 'currency'
  subpages: any = [
    { ActiveYN: true, Name: "Concentration", displayYN: true },
    { ActiveYN: false, Name: "Aggregated Notional", displayYN: true }
  ];
  notificationCount: any = '165'
  colorArr = [
    'rgba(254,147,39,1)',
    'rgba(67,94,190,1)',
    'rgba(6,146,143,1)',
    'rgba(90,200,250,1)',
    'rgba(255,202,51,1)'
  ]
  external: any = []
  externalAggregated: any = [];
  notificatonArr: any = [];
  today: string;
  eventType: string = "";
  dayOne = '';
  dayLast = '';
  template = 'All';
  currentDate: Date;
  firstDay: Date;
  lastDay: Date;
  dataForFilter: any;
  aggregatedFilter: any = [];
  refreshed = false;
  PaginationFlag = 0;
  nanTTMflag = 0;
  // LEVELS OF BAR GRAPH
  // LEVEL 0 - DAY
  // LEVEL 1 - WEEK
  // LEVEL 2 - MONTH (DEFAULT)
  // LEVEL 3 - YEAR
  startDate: string;
  level = 2;
  thresh = 0;
  curbar = null;
  resultYear = [];
  resultMonth = [];
  resultWeek = [];
  resultDays = [];
  minVal = 0;
  maxVal = 11;
  Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  showYearDropdown: boolean = false;
  currentDateYear: number;

  labels = ['Days', 'Weeks', 'Months', 'Years'];

  currentDate1: any;
  selectedMonth: any = 0;
  selectedYear: any;
  selectedDate: any;
  Dates: any;
  currentYear: any;
  currentMonth: any;
  activeMonth: any;
  activeYear: any;
  saveoptionflag:boolean=false;
  showDropdown: boolean = false;
  underlyings: any;
  totalNotional: any;
  chart: any;

  summaryDataRes: any;
  notionalCount: any;
  tradeCount: any;
  totalMU: any;
  totalMtm: any;
  timeToMaturityCnt: any;
  selectedCard: string = '';
  eventCountArr: any;
  counts= [];
  eventDataRes: any;
  sectorSummaryTradeRes: any;
  summarySector: any;
  summaryMeasure: any;
  underlyingSummaryTradeRes: any;
  summaryUnderlying: any;
  summaryUnderlyingMeasure: any;
  sector: any = "Others";
  measure: any = "Trade";
  notificationsPopUp: boolean = false;

  maturityDatesArr: any;
  totalNotionalWrtDateArr: any
  eventTypeArr: any;
  eventTypeNotification: any;
  //Changes done by Jyoti S || 30-Aug-2023 || START
  noOfRecords: number = 0;
  pageSize: number = 8;
  pageNo: number = 0;
  pageFirstRecord: number = (this.pageNo * this.pageSize);
  pageLastRecord : number = 0;  //Updated By AnmolB
  colors: any = '';
  notificatonPopUpArr: any = []
  eventDataPopUpRes: any = []
  //Changes done by Jyoti S || 30-Aug-2023 || END

  lenGroups: number = 0;
  flag = 0;
  loadflag = 1;
  notionalDataRes: any = [];
  notionalDataByWeek: any = [];
  notionalDataDays: any = [];
  notionalDataByYear: any = [];
  notionalDataByMonths: any = [];
  dataForColourMapping: any;
  thresholdMax = 40;
  threshold = 20;
  extractDataToggle = 0;
  lockView = false;
  selectedIndex = 0;

  colorPalletLabelArr = [
  {"Title":"Maturity","color":"#FF9800"},
  {"Title":"Autocall","color":"#63BA68"},
  {"Title":"Protection","color":"#43c0c7"},
  {"Title":"Coupon","color":"#3366FF"},
  {"Title":"Issuer Callable","color":"#ea6363"}
  ];
    colorArray: any
  DateString: any;
  selectedConcentration: any;

  //Filter
  ldMap = new Map<string, string>();
  notificationDataForFilter = [];
  showFilterDropdown: boolean = false;
  toggleDisabledFlag = false;
  toggleCheck = false;
  inBasketDisabledFlag = false;
  inBasketCheck = true;
  LiveCheck = true;
  DeadCheck = false;
  ErrorMsg = '';
  successMsg = '';
  unFilteredBlotterData: any = [];
  blotterData: any = [];
  filteredData: any = [];
  selectedSorting: any = "Issue Date";
  selectedGroup: any;
  selectedClient: any;
  selectedIntRef: any;
  selectedType: any;
  selectedTutela: any;
  selectedSubtutela: any;
  selectedBranch: any;
  selectedTerritory: any;
  selectedZone: any;
  selectedFormat: any;
  groupArr: any = [];
  clientArr: any = [];
  intRefArr: any = [];
  typeArr: any = [];
  tutelaArr: any = [];
  subtutelaArr: any = [];
  branchArr: any = [];
  territoryArr: any = [];
  zoneArr: any = [];
  clearClientFilter: boolean = false;
  selectedCurrency: any;
  selectedPType: any;
  selectedCapAtRisk: boolean = false;
  selectedBarDist: boolean = false;
  selectedIndVal: boolean = false;
  selectedCancelProb: boolean = false;
  selectedULType: any;
  selectedExternal: any;
  selectedUnderlying: any;
  selectedMaturityIn: any;
  selectedObservationIn: any;
  selectedACIn: any;
  selectedCancelDateIn: any;
  StartDate: any;
  StartDateDisplay: any;
  EndDateDisplay: any;
  EndDate: any;
  display = 1;
  formatData: any;
  currencyData: any;
  productTypeData: any;
  ulTypeData: any;
  loader: boolean = true;
  calenderLoader: boolean = false;
  exportToExcelData: any;
  initialDataArr: any = [];
  initialDataRes: any;
  options1: Options = {};
  options2: Options = {};
  options3: Options = {};
  options4: Options = {};
  // Added by MuditB || 30-Aug-23 || End || SlidersFilter
  result: any = [];
  // uniqueDate: any[];
  EventCountData = new Map<string, Map<string, number>>();
  showSuccessMessage: boolean;
  showMessageXML: string;
  notificationDataTempArr: any;
  tempArrData: any;
  colorPalletLabelSet = new Map<string, string>();
  countsTemp: any;
  eventMonthCountArr: any;
  eventCountTempArr: any;
  filteredBackData: any = [];
  clearProductFilter:boolean = false;
  initialDataTemp: any;
  viewName: string;
  portolioDetails: any;
  ViewFlag: boolean;
  viewXML: any;
  direction: any;
  sampleXML:any=
    [
      "PV_ID",
      "ISIN_String",
      "Client",
      "J_Internal",
      "Tutela",
      "Subtutela",
      "Group",
      "Type",
      "Branch",
      "Territory",
      "Zone",
      "Format",
      "Currency",
      "Payoff",
      "ULString",
      "BasketYN",
      "ULType",
      "LiveYN",
      "DeadYN",
      "Issue_From",
      "Issue_To",
      "Maturity_IN",
      "Observ_IN",
      "Cancel_IN",
      "CapAtRisk_min",
      "CapAtRisk_max",
      "CancelProb_min",
      "CancelProb_max",
      "KIDist_min",
      "KIDist_max",
      "MTM_min",
      "MTM_max",
      "Record_per_page",
      "Sort",
      "Sort_direction"
]
  showViewStatusPopUp: boolean;
  ViewStatusMsg: any;
  viewList: any[];
  backUpList: any[];
  activeShareIndex: any;
  todayMonth: number;
  todayDate: number;
  notificationTemp: any[];
  MUFlag;
  currencySubscription:Subscription;
    //filter end
  constructor(
    private api: ApifunctionService,
    private cdr: ChangeDetectorRef,
    private intDashboard: SpInteractiveDataService,public portfolioService: SpPortfolioSnapshotService, private readonly chartService: ChartService, public datepipe: DatePipe, public excelService: ExcelService,
    private common: EcCommonService,
    private el: ElementRef,
    private renderer: Renderer2,) {
    this.currentDate = new Date();
    this.todayDate = new Date().getDate();
    this.todayMonth = new Date().getMonth();
    this.currentDate1 = this.datepipe.transform(Date.now(), "dMMMM");
    this.currentDateYear = this.currentDate.getFullYear();
    this.selectedGroup = '';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType = '';
    this.selectedTutela = '';
    this.selectedSubtutela = '';
    this.selectedBranch = '';
    this.selectedTerritory = '';
    this.selectedZone = '';
    this.selectedFormat = '';
    this.selectedCurrency = '';
    this.selectedPType = '';
    this.selectedExternal = '';
    this.selectedULType = '';
    this.selectedUnderlying = '';
    this.selectedExternal = '';
    this.StartDate = "";
    this.StartDateDisplay = "";
    this.EndDateDisplay = "";
    this.EndDate = "";
    this.selectedMaturityIn = "";
    this.selectedObservationIn = "";
    this.selectedACIn = "";
    this.selectedCancelDateIn = "";
    this.eventTypeNotification = '';
    // this.generateCalendar();
  }
  startCapAtRiskValue: number = 0//this.portfolioService.min_KI;
  endCapAtRiskValue: number = 100 //this.portfolioService.max_KI;
  current_CapAtRisk_StartValue: number = this.startCapAtRiskValue
  current_CapAtRisk_LastValue: number = 100 //this.endCancelProbValue

  startCancelProbValue: number = 0//this.portfolioService.min_KI;
  endCancelProbValue: number = 100 //this.portfolioService.max_KI;
  current_CancelProb_StartValue: number = this.startCancelProbValue
  current_CancelProb_LastValue: number = 100 //this.endCancelProbValue

  startBarrierDValue: number = 0//this.portfolioService.min_KI;
  endBarrierDValue: number = 100 //this.portfolioService.max_KI;
  current_BarrierD_StartValue: number = this.startBarrierDValue
  current_BarrierD_LastValue: number = this.endBarrierDValue //this.endCancelProbValue

  startIndValValue: number = 0//this.portfolioService.min_KI;
  endIndValValue: number = 100 //this.portfolioService.max_KI;
  current_IndVal_StartValue: number = this.startIndValValue
  current_IndVal_LastValue: number = 100 //this.endCancelProbValue


  async ngOnInit() {
    this.notificationsPopUp = false;
    setTimeout(async () => {
      this.loader = true;
      this.counts = [];
      this.external = []
      this.chartService.paletteEmitObs.subscribe((paletteres) => {
        if (!!paletteres) {
          let pallete = this.chartService.getPallete(paletteres);
          this.colors = pallete.colors;
          //Handled Agg Notional Graph Color Change - Added By AnmolB
          if (this.chart) {
            this.chart.data.datasets[0].backgroundColor = this.getColors();
            this.chart.update();
          }
          this.TileSelected(this.selectedCard || 'tile-1');
        }
      });
      // this.colorPalletLabelArr.forEach((color)=>{
      //   this.colorPalletLabelSet.set(color.Title,color.color)
      // })
      const date = new Date();
      this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      this.lastDay = new Date(date.getFullYear(), date.getMonth(), 1);

      const moment = require('moment');
      this.dayOne =
        new Date(moment(this.firstDay)).getDate() +
        '-' +
        this.months[new Date(moment(this.firstDay)).getMonth()] +
        '-' +
        new Date(moment(this.firstDay)).getFullYear();

      this.dayLast =
        new Date(moment(this.lastDay)).getDate() +
        '-' +
        this.months[new Date(moment(this.lastDay)).getMonth()] +
        '-' +
        new Date(moment(this.lastDay)).getFullYear();

    const d = new Date();
    this.selectedYear = d.getFullYear();
    this.selectedMonth = d.getMonth();
    this.GetCustomerNames();
    this.GetEventTypes();
    this.getMonthwiseNotifications();
    //this.generateDates();
    await this.getInteractiveChartData();
    // this.getEventCount();
    this.GetPortfolioViews();
    this.getAggregatedNotionalChartData();
    if (this.subpages[1].ActiveYN==true){
      this.createAggregatedNotionalGraph();
    }

    //Added by Kaustubh S, Varsha G || User currency preference || FSLINT-64 || 30-May-2024
    this.currencySubscription = this.intDashboard.currPreferenceObserver.subscribe(async(currency:string) => {
      if(currency) {
        await this.getInteractiveChartData();
        await this.getAggregatedNotionalChartData();
      }
    })

  });
  }


  checkInBasketToggle(event: MatSlideToggleChange) {
    //console.log(event);
    this.inBasketCheck = event.checked;
  }

  checkLiveToggle(event: MatSlideToggleChange) {
    //console.log(event);
    this.LiveCheck = event.checked;
  }

  checkDeadToggle(event: MatSlideToggleChange) {
    //console.log(event);
    this.DeadCheck = event.checked;
  }


  togglelockViewFlag() {
    let lockViewText;
    this.lockView = !this.lockView; // Toggle the lockView flag
    if (this.lockView) {
      lockViewText = "Unlock";
    }
    else {
      lockViewText = "Lock Mode";
    }
    document.getElementById('pinViewText').innerText = lockViewText;
  }

  chartOnWheels(event) {
    if(this.initialDataRes.length == 0)
      return;
    // OffsetX and OffsetY are the (x,y) of top left corner of the whole chart
    let offsetX = document.getElementById('chart').getBoundingClientRect().x;
    let offsetY = document.getElementById('chart').getBoundingClientRect().y;

    // Following 2 lines have been added so as to ensure only the scroll on the chartArea is handled and not on the part of chart other than the chartArea.
    // event.clientX and event.clientY are the (x,y) of the point from where you trigger the wheel event.
    if (event.clientX < this.chart.chartArea.left + offsetX || event.clientX > this.chart.chartArea.right + offsetX || event.clientY < this.chart.chartArea.top + offsetY || event.clientY > this.chart.chartArea.bottom + offsetY)
      return;

    //SplitFlag is used so as to know when to change the time formats.
    let splitFlag = false;

    //By Default, the curbar( curbar = the bar which will be magnified ) is set to the last bar.
    // However, the following lines of code (i.e the succeeding for loop ) should work in such a way that it gets the curbar depending upon where you trigggered the wheel event.
    this.curbar = this.chart.scales.x.max + 1;
    for (let i = this.chart.scales.x.min; i <= this.chart.scales.x.max; i++) {
      if (Number(this.chart.getDatasetMeta(0).data[i].x) + Number(this.chart.getDatasetMeta(0).data[i].width) + offsetX > Number(event.clientX)) {
        this.curbar = i + 1;
        break;
      }
    }

    // LOG Statements to know the current min and max indexes of the bar chart array 
    // flag has been used so as to only handle the wheel event when it is triggered over the graph.

    if (this.flag == 1) {
      // Preventing Default Scroll Bar Action while the graph is being hovered upon.
      event.preventDefault();

      // HORIZONTAL SCROLLING
      if (event.ctrlKey) {

        this.thresh = 0;
        // Setting curbar to null because curbar needs to be betweeen min and max value.
        // Upon scrolling, the min and max value changes. So, curbar has to be selected again.
        // Also, there is no point of curbar while horizonal scrolling.
        this.curbar = null;

        if (event.deltaY < 0) {
          if (this.chart.options.scales.x.min >= 1) {
            this.chart.options.scales.x.min -= 1;
            this.chart.options.scales.x.max -= 1;
          }

        }
        else {
          if (this.chart.options.scales.x.max < this.lenGroups - 1) {
            this.chart.options.scales.x.max += 1;
            this.chart.options.scales.x.min += 1;
          }
        }
      }

      // MAGNIFY SCROLLING
      else {
        if (!this.lockView) {

          // if(!this.curbar)
          //   this.curbar = this.chart.options.scales.x.min + Math.floor((this.chart.options.scales.x.max - this.chart.options.scales.x.min) / 2);

          if (event.deltaY < 0) {
            if (this.chart.options.scales.x.max >= 1 && this.chart.options.scales.x.max > this.chart.options.scales.x.min) {
              this.chart.options.scales.x.max = (this.chart.options.scales.x.max - Math.ceil((this.chart.options.scales.x.max - (this.curbar - 1)) / 2));
              console.log("Updated Max" + this.chart.options.scales.x.max)
            }
            if (this.chart.options.scales.x.max > this.chart.options.scales.x.min) {
              if (this.curbar == this.chart.options.scales.x.max + 1 && this.chart.options.scales.x.max - this.chart.options.scales.x.min == 1)
                this.chart.options.scales.x.min += 1;
              else
                this.chart.options.scales.x.min = (this.chart.options.scales.x.min + Math.floor(Math.abs(this.chart.options.scales.x.min - this.curbar) / 2));
            }
          }
          else {
            // LEVEL = 2 signifies Month
            if (this.level == 2) {
              if ((this.chart.options.scales.x.max - this.chart.options.scales.x.min >= 17)) {
                splitFlag = true;
                this.level = 3;
                let res = this.extractDataByYear(this.notionalDataRes);
                this.lenGroups = Object.keys(res).length;
                let minIndex = this.resultMonth[this.chart.options.scales.x.min][0].split('-')[0];
                let maxIndex = this.resultMonth[this.chart.options.scales.x.max][0].split('-')[0];
                let index1 = 0;
                let index2 = this.resultYear.length - 1;
                for (let i = 0; i < this.resultYear.length; i++) {
                  if (this.resultYear[i][0] == minIndex) {
                    index1 = i;
                  }
                  else if (this.resultYear[i][0] == maxIndex) {
                    index2 = i;
                    break;
                  }
                }
                this.chart.data.xLabels = Object.keys(res);
                this.chart.data.datasets[0].data = this.notionalDataByYear;
                this.chart.options.plugins.title.text = "By " + this.labels[this.level];
                // this.chart.options.plugins.title.text = "By "+ this.labels[this.level];
                this.minVal = index1;
                this.maxVal = index2;
                this.chart.options.scales.x.min = this.minVal
                this.chart.options.scales.x.max = this.maxVal;

              this.thresh = 0; 
              this.curbar = null;
            }
            if(this.level == 2 ){
              if( this.chart.options.scales.x.max - this.chart.options.scales.x.min < 16 && this.chart.options.scales.x.max < this.lenGroups -  1){
                this.chart.options.scales.x.max +=1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 17 &&  this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -=1;
              if(this.chart.options.scales.x.max - this.chart.options.scales.x.min == 16 &&  this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups -  1)
                this.chart.options.scales.x.max +=1;
            }
          }
          // LEVEL = 1 signifies Week
          else if (this.level == 1){
            if((this.chart.options.scales.x.max - this.chart.options.scales.x.min >= 11) ){
              this.thresh = 0; 
              this.curbar = null;
              splitFlag = true;
              this.level = 2;

              let res = this.extractDataByMonths(this.notionalDataRes);
              this.lenGroups = Object.keys(res).length;
              let minIndex = this.resultWeek[this.chart.options.scales.x.min][0].split('-')[0] + '-' + this.resultWeek[this.chart.options.scales.x.min][0].split('-')[1];
              let maxIndex = this.resultWeek[this.chart.options.scales.x.max][0].split('-')[0] + '-' + this.resultWeek[this.chart.options.scales.x.max][0].split('-')[1];
              let index1 = 0;
              let index2 = this.resultMonth.length - 1;
              for (let i = 0; i < this.resultMonth.length; i++){
                if(this.resultMonth[i][0] == minIndex){
                  index1 = i;
                }
                else if(this.resultMonth[i][0] == maxIndex){
                  index2 = i;
                  break;
                }
              }

              this.chart.data.xLabels = Object.keys(res);
              this.chart.data.datasets[0].data = this.notionalDataByMonths;
              this.chart.options.plugins.title.text = "By "+ this.labels[this.level];
              this.minVal = index1;
              this.maxVal = index2;
              this.chart.options.scales.x.min = this.minVal 
              this.chart.options.scales.x.max =  this.maxVal;

            }
            if(this.level == 1){
              if( this.chart.options.scales.x.max - this.chart.options.scales.x.min < 10 && this.chart.options.scales.x.max < this.lenGroups -  1){
                this.chart.options.scales.x.max +=1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 11 &&  this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -=1;
              if(this.chart.options.scales.x.max - this.chart.options.scales.x.min == 10 &&  this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups -  1)
                this.chart.options.scales.x.max +=1;
            }
          }
          // LEVEL = 0 signifies Days
          else if (this.level == 0){

            if((this.chart.options.scales.x.max - this.chart.options.scales.x.min >= 29 )){
              
            
              splitFlag = true;
              this.level = 1;

              let res = this.extractDataByWeeks(this.notionalDataRes, "Mon");
              this.lenGroups = Object.keys(res).length;
              let minIndex = this.resultDays[this.chart.options.scales.x.min][0];
              let maxIndex = this.resultDays[this.chart.options.scales.x.max][0];

                this.thresh = 0;
                this.curbar = null;

              const dateParts1 =  this.resultDays[this.chart.options.scales.x.min][0].split('-');
              const yearMin = dateParts1[0];
              const monthMin = dateParts1[1];
              const dayMin = dateParts1[2];
              let minDate = new Date(yearMin, monthMin - 1, dayMin, 14, 39, 7);
              minDate.setDate(minDate.getDate() - (minDate.getDay() + 6) % 7);
              const dateParts2 =  this.resultDays[this.chart.options.scales.x.max][0].split('-');
              const yearMax = dateParts2[0];
              const monthMax = dateParts2[1];
              const dayMax = dateParts2[2];
              let maxDate = new Date(yearMax, monthMax - 1, dayMax,  14, 39, 7);
              maxDate.setDate(maxDate.getDate() - (maxDate.getDay() + 6) % 7);

                let maxDateString = maxDate.toISOString().split('T')[0];
                let minDateString = minDate.toISOString().split('T')[0];

              let index1 = 0;
              let index2 = this.resultWeek.length - 1;
              for (let i = 0; i < this.resultWeek.length; i++){
                if(this.resultWeek[i][0] == minDateString){
                  index1 = i;
                }
                else if(this.resultWeek[i][0] == maxDateString){
                  index2 = i;
                  break;
                }
              }


              this.chart.data.xLabels = Object.keys(res);
              this.chart.data.datasets[0].data = this.notionalDataByWeek;
              this.chart.options.plugins.title.text = "By "+ this.labels[this.level];
              // this.chart.options.plugins.title.text = "By "+ this.labels[this.level];

              this.minVal = index1;
              this.maxVal = index2;
              this.chart.options.scales.x.min = this.minVal 
              this.chart.options.scales.x.max =  this.maxVal;
            }
            if(this.level == 0){
              if( this.chart.options.scales.x.max - this.chart.options.scales.x.min < 28 && this.chart.options.scales.x.max < this.lenGroups -  1){
                this.chart.options.scales.x.max +=1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 29 &&  this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -=1;
              if(this.chart.options.scales.x.max - this.chart.options.scales.x.min == 28 &&  this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups -  1)
                this.chart.options.scales.x.max +=1;
            }

            }
            // LEVEL = 3 signifies Year
            else if (this.level == 3) {

            if( this.chart.options.scales.x.max - this.chart.options.scales.x.min < 8 && this.chart.options.scales.x.max < this.lenGroups -  1){
              this.chart.options.scales.x.max +=1;
            }
            if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 9 &&  this.chart.options.scales.x.min >= 1)
              this.chart.options.scales.x.min -=1;
            if(this.chart.options.scales.x.max - this.chart.options.scales.x.min == 8 &&  this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups -  1)
              this.chart.options.scales.x.max +=1;
          }
        }

          // Following code handles split and merge

          if (this.chart.options.scales.x.max == this.chart.options.scales.x.min) {

            this.thresh += 1;
            this.curbar = null;

          if( this.thresh >=3 && this.level == 3){
            splitFlag = true;
            this.level = 2;
            let res = this.extractDataByMonths(this.notionalDataRes);
            this.lenGroups = Object.keys(res).length;
                      // this.maturityDatesArr = Object.keys(res);
            // this.totalNotionalWrtDateArr = Object.keys(res);
            this.chart.data.xLabels = Object.keys(res);
            this.chart.data.datasets[0].data = this.notionalDataByMonths;
            this.chart.options.plugins.title.text = "By "+ this.labels[this.level];
            const indexes = this.resultMonth.map((element, index) => element[0].split('-')[0] === this.resultYear[this.chart.options.scales.x.max][0] ? index : -1).filter(element => element !== -1 );
            // (element[0].split('-')[0] === this.resultWeek[this.chart.options.scales.x.max][0] ? index : -1)).filter(element => element !== -1
            this.minVal = indexes[0];
            this.maxVal = indexes[indexes.length - 1];
            this.chart.options.scales.x.min = this.minVal 
            this.chart.options.scales.x.max =  this.maxVal;
            // if(this.level > 0)
            //   this.level -= 1;
            this.thresh = 0; 
            this.curbar = null;
          }
          //
          else if( this.thresh >=3 && this.level == 2){
            this.thresh = 0; 
            this.curbar = null;
            splitFlag = true;
            this.level = 1;
            let res = this.extractDataByWeeks(this.notionalDataRes, 'Mon');
            this.lenGroups = Object.keys(res).length;
            // this.maturityDatesArr = Object.keys(res);
            // this.totalNotionalWrtDateArr = Object.keys(res);
            this.chart.data.xLabels = Object.keys(res);
            this.chart.data.datasets[0].data = this.notionalDataByWeek;
            this.chart.options.plugins.title.text = "By "+this.labels[this.level];
            const indexes = this.resultWeek.map((element, index) => element[0].split('-')[0] + '-' + element[0].split('-')[1] === this.resultMonth[this.chart.options.scales.x.max][0] ? index : -1).filter(element => element !== -1 );
            // (element[0].split('-')[0] === this.resultWeek[this.chart.options.scales.x.max][0] ? index : -1)).filter(element => element !== -1
            this.minVal = indexes[0];
            this.maxVal = indexes[indexes.length - 1];
            this.chart.options.scales.x.min = this.minVal 
            this.chart.options.scales.x.max =  this.maxVal;
            // if(this.level > 0)
            //   this.level -= 1;

          }
          //
          else if(this.thresh >=3 && this.level == 1){
            splitFlag = true;
            this.level = 0;
            let res = this.extractDataByDates(this.notionalDataRes);
            this.lenGroups = Object.keys(res).length;
            // this.maturityDatesArr = Object.keys(res);
            // this.totalNotionalWrtDateArr = Object.values(res);
            this.chart.data.xLabels = Object.keys(res);
            this.chart.data.datasets[0].data = this.notionalDataDays;
            this.chart.options.plugins.title.text = "By " + this.labels[this.level];
            let index1 = this.resultDays.map((element, index) => element[0] === this.resultWeek[this.chart.options.scales.x.max][0] ? index : -1).filter(element => element !== -1 );
            this.minVal = index1[0];
            let index2;
            if(this.chart.options.scales.x.max + 1 < this.resultWeek.length){
              index2 = this.resultDays.map((element, index) => element[0] === this.resultWeek[this.chart.options.scales.x.max + 1][0] ? index : -1).filter(element => element !== -1 );
              this.maxVal = index2[0]- 1;
            }    
            else{
              index2 = [this.resultDays.length];
              this.maxVal = index2[0] - 1;
            }
        
            // (element[0].split('-')[0] === this.resultWeek[this.chart.options.scales.x.max][0] ? index : -1)).filter(element => element !== -1
            this.minVal = index1[0];
        
            this.chart.options.scales.x.min = this.minVal 
            this.chart.options.scales.x.max =  this.maxVal;
            // if(this.level > 0)
            //   this.level -= 1;
            this.thresh = 0; 
            this.curbar = null;
          }
        }      

        }
        else {
          // if(!this.curbar)
          //   this.curbar = this.chart.options.scales.x.min + Math.floor((this.chart.options.scales.x.max - this.chart.options.scales.x.min) / 2);
          if(event.deltaY < 0){
            if(this.chart.options.scales.x.max >= 1 && this.chart.options.scales.x.max > this.chart.options.scales.x.min) {
              this.chart.options.scales.x.max = (this.chart.options.scales.x.max - Math.ceil((this.chart.options.scales.x.max - this.curbar + 1) / 2 ));
            }
            if (this.chart.options.scales.x.max > this.chart.options.scales.x.min) {
              if (this.curbar == this.chart.options.scales.x.max + 1 && this.chart.options.scales.x.max - this.chart.options.scales.x.min == 1)
                this.chart.options.scales.x.min += 1;
              else
                this.chart.options.scales.x.min = (this.chart.options.scales.x.min + Math.floor(Math.abs(this.chart.options.scales.x.min - this.curbar) / 2));
            }
          }
          else {
            if (this.level == 0) {
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 88 && this.chart.options.scales.x.max < this.lenGroups - 1) {
                this.chart.options.scales.x.max += 1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 89 && this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -= 1;
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min == 88 && this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups - 1)
                this.chart.options.scales.x.max += 1;
            }
            else if (this.level == 1) {
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 22 && this.chart.options.scales.x.max < this.lenGroups - 1) {
                this.chart.options.scales.x.max += 1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 23 && this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -= 1;
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min == 22 && this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups - 1)
                this.chart.options.scales.x.max += 1;
            }
            else if (this.level == 2) {
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 58 && this.chart.options.scales.x.max < this.lenGroups - 1) {
                this.chart.options.scales.x.max += 1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 59 && this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -= 1;
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min == 58 && this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups - 1)
                this.chart.options.scales.x.max += 1;
            }
            else if (this.level == 3) {
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 8 && this.chart.options.scales.x.max < this.lenGroups - 1) {
                this.chart.options.scales.x.max += 1;
              }
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min < 9 && this.chart.options.scales.x.min >= 1)
                this.chart.options.scales.x.min -= 1;
              if (this.chart.options.scales.x.max - this.chart.options.scales.x.min == 8 && this.chart.options.scales.x.min == 0 && this.chart.options.scales.x.max < this.lenGroups - 1)
                this.chart.options.scales.x.max += 1;
            }
          }
        }
      }



      this.chart.data.datasets[0].backgroundColor = this.getColors();
      if (splitFlag) {
        splitFlag = false;
        this.chart.update('none');
        this.chart.update({
          duration: 10000,
          easing: 'easeInOutQuad'
        });
      }
      else {
        this.chart.update();
      }
    }
  }

  setFlag1() {
    this.flag = 1;
  }

  setFlag0() {
    this.flag = 0;
  }
  extractDataByMonths(notionalDataArg) {
    let groups = {};
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    notionalDataArg.forEach(function (val) {
      let date = val.MaturityDate.split('T')[0];
      date = date.split('-');
      date.splice(2, 1);
      // date[1] = months[parseInt(date[1], 10) - 1];
      date = date.join('-')
      groups[date] ? (groups[date] += val.Nominal) : (groups[date] = val.Nominal);
  });
  this.notionalDataByMonths = groups;
  return groups;
}

  extractDataByDates(notionalDataArg) {
    let groups = {};

    notionalDataArg.forEach(function (val) {
      let date = val.MaturityDate.split('T')[0];
      groups[date] ? (groups[date] += val.Nominal) : (groups[date] = val.Nominal);
    });
    this.notionalDataDays = groups;
    this.resultDays = [];

    for (var i in this.notionalDataDays)
      this.resultDays.push([i, this.notionalDataDays[i]]);
    return groups;
  }
  extractDataByYear(notionalDataArg) {
    let groups = {};

    notionalDataArg.forEach(function (val) {
      let date = val.MaturityDate.split('T')[0];
      date = date.split('-')[0]
      groups[date] ? (groups[date] += val.Nominal) : (groups[date] = val.Nominal);
    });
    this.notionalDataByYear = groups;
    this.resultYear = [];
    for (var i in this.notionalDataByYear)
      this.resultYear.push([i, this.notionalDataByYear[i]]);
    return groups;
  }
  extractDataByWeeks(notionalDataArg, startingDayOfWeek) {
    const groups = {};
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Ensure startingDayOfWeek is valid (e.g., 'Mon', 'Tue', etc.)
    startingDayOfWeek = startingDayOfWeek.trim().substring(0, 3);
    if (!weekdays.includes(startingDayOfWeek)) {
      console.error('Invalid starting day of the week.');
      this.notionalDataByWeek = [];
      return null;
    }
    let BoundaryCheckFlag = true;
    let boundaryDate: Date;
    notionalDataArg.forEach(function (val) {
      const dateParts = val.MaturityDate.split('T')[0].split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];

      const currentDate = new Date(year, month - 1, day);
      const currentDayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

      // Calculate the start date of the week
      let startDate = new Date(currentDate);
      if (BoundaryCheckFlag) {
        boundaryDate = new Date(startDate)
      }

      startDate.setDate(Math.min(startDate.getDate() - currentDayOfWeek + weekdays.indexOf(startingDayOfWeek), startDate.getDate()));
      if (currentDayOfWeek == 0) {
        startDate.setDate(startDate.getDate() + 1);
      }
      if (BoundaryCheckFlag || startDate < boundaryDate) {
        startDate.setDate(boundaryDate.getDate());
        startDate.setMonth(boundaryDate.getMonth());
        startDate.setFullYear(boundaryDate.getFullYear());
        BoundaryCheckFlag = false;
      }


      // Format the start and end dates
      const yearStart = startDate.getFullYear();
      const monthStart = String(startDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const dayStart = String(startDate.getDate()).padStart(2, '0');
      const startDateStr = `${yearStart}-${monthStart}-${dayStart}`;

      // Create a unique key for the week (e.g., '2023-Jan-01_to_2023-Jan-07')
      const weekKey = `${startDateStr}`;
      // const weekKey = `${startDateStr}_to_${endDateStr}`;
      // Initialize the group if it doesn't exist
      if (!groups[weekKey]) {
        groups[weekKey] = 0;
      }
      // Add the Nominal value to the corresponding week's total
      groups[weekKey] += val.Nominal;
    });


    this.notionalDataByWeek = groups;
    this.resultWeek = [];
    for (var i in this.notionalDataByWeek)
      this.resultWeek.push([i, this.notionalDataByWeek[i]]);

    return groups;
  }


  emitMonth() {
    // this.month;
    // this.counts = [];
  }

  emitYear() {
    // this.year;
    // this.counts = [];
  }

   async prevMonth() {
    this.calenderLoader = true;
    if (this.selectedMonth === 0) {
      this.selectedMonth = 12;
      this.selectedYear =
        this.selectedYear <= 1950 ? 1950 : this.selectedYear - 1;
    }
    this.selectedMonth = this.selectedMonth <= 0 ? 11 : this.selectedMonth - 1;
    // this.emitMonth();
    this.generateDates();
    await this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
     await this.changeNotificationsCount(this.selectedMonth, this.selectedYear);
     await this.getPageInfo({ 'pageNo': 0, 'pageSize': this.pageSize, 'reload': false, 'length': this.noOfRecords });
    // this.generateDates();
    // this.getNotifications();
    // this.getMonthwiseNotifications(this.selectedMonth,this.selectedYear);//Added by Jyoti S || 21-Sep-2023
    await setTimeout(() => this.calenderLoader = false
    , 0)
  }
   async nextMonth() {
    this.calenderLoader = true;
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear =
        this.selectedYear >= 2099 ? 2099 : this.selectedYear + 1;
    } else {
      this.selectedMonth = this.selectedMonth < 0 ? 11 : this.selectedMonth + 1;
    }
    // this.emitMonth();
    this.generateDates();
    await this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
     await this.changeNotificationsCount(this.selectedMonth, this.selectedYear);
     await this.getPageInfo({ 'pageNo': 0, 'pageSize': this.pageSize, 'reload': false, 'length': this.noOfRecords });
    // this.generateDates();
    // this.getNotifications();
    // this.getMonthwiseNotifications(this.selectedMonth,this.selectedYear);//Added by Jyoti S || 21-Sep-2023
    await setTimeout(() => this.calenderLoader = false
    , 0)
  }

  setMonth(month: number) {
    this.selectedMonth = month;
  }

  setYear(year: number) {
    this.selectedYear = year;
  }

  selectDateCal(date: any, month, year) {
    this.template = 'All';
    //this.currentDate = '';
    if (date === 0) {
      return;
    }
  }
  getFirstDayOfMonth(month, year) {

    return new Date(year, month, 1).getDay();
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  generateDates(month: any = this.currentDate.getMonth(), year: any = this.currentDate.getFullYear()) {
    this.Dates = new Array();
    var firstIndex = this.getFirstDayOfMonth(this.selectedMonth, this.selectedYear);
    if (firstIndex == 0) {
      firstIndex = 7;
    }
    for (let i = 1; i < firstIndex; i++) {
      this.Dates.push(0);
    }
    for (let day = 0; day < this.getDaysInMonth(parseInt(this.selectedMonth + '', 10) + 1, this.selectedYear); day++) {
      this.Dates.push(day + 1);
    }
    const maxIndex = this.Dates.length % 7 > 0 ? this.Dates.length + 7 - (this.Dates.length % 7) : 0;
    let diff = maxIndex - this.Dates.length;
    for (let k = 1; k <= diff; k++) {
      this.Dates.push(k);
    }
  }

  epoch(date: any) {
    return Date.parse(date);
  }

  setEventCount(month, year) {
    // this.counts = [];
    //this.currentDate = '';
    this.firstDay = new Date(year, Number(month), 1);
    this.lastDay = new Date(year, Number(month) + 1, 0);
    // const months = [
    //   'Jan',
    //   'Feb',
    //   'Mar',
    //   'Apr',
    //   'May',
    //   'Jun',
    //   'Jul',
    //   'Aug',
    //   'Sep',
    //   'Oct',
    //   'Nov',
    //   'Dec',
    // ];
    const moment = require('moment');
    this.dayOne =
      new Date(moment(this.firstDay)).getDate() +
      '-' +
      this.months[new Date(moment(this.firstDay)).getMonth()] +
      '-' +
      new Date(moment(this.firstDay)).getFullYear();
    this.dayLast =
      new Date(moment(this.lastDay)).getDate() +
      '-' +
      this.months[new Date(moment(this.lastDay)).getMonth()] +
      '-' +
      new Date(moment(this.lastDay)).getFullYear();
    this.dayOne =
      '/Date(' + this.epoch(new Date(moment(this.firstDay))) + '+0530)/';
    this.dayLast =
      '/Date(' + this.epoch(new Date(moment(this.lastDay))) + '+0530)/';
    // this.dayLast = '\/Date(' + this.epoch(new Date(moment(this.firstDay))) + '+0530)\/';
  }

  eqchangeProduct(choice, from) {
    if (from === 'click') {
      if (choice !== '') {
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    } else {
      if (choice !== '') {
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    }


    this.thresh = 0;
    this.level = 2;
    this.lockView = false;

    setTimeout(async () => {
      this.createCharts(choice);
    });
  }
  public hideYearDropdown(): void {
    this.showYearDropdown = !this.showYearDropdown
  }

  get yearRange(): number[] {
    //const currentYear = new Date().getFullYear();
    const currentYear = this.currentDateYear;
    const startYear = currentYear - 1;//Changed by Jyoti S || 30-Aug-2023
    const endYear = currentYear + 1;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }

  public changeYear(year: number): void {
    this.updateDate(new Date(year, this.currentDate.getMonth()));
    this.showYearDropdown = false;
  }

  updateDate(date: Date): void {
    this.currentDate = new Date(date);
    this.selectedYear = this.currentDate.getFullYear();
    this.currentDateYear = this.selectedYear//Added by Jyoti S || 30-Aug-2023
    //this.generateDates();
    this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear)
  }

  goToPreviousYear() {
    this.updateDate(new Date(this.currentDate.getFullYear() - 1, this.currentDate.getMonth()));
  }

  goToNextYear() {
    this.updateDate(new Date(this.currentDate.getFullYear() + 1, this.currentDate.getMonth()));
  }



  async TileSelected(id: string) {
    try {
      //Changed by Jyoti S || 21-Sep-2023 || START
      this.selectedCard = id.trim() || 'tile-2'; //Changed by Jyoti S || 17-Aug-2023 || to set trade as default tile
      switch (id) {
        case "tile-1":
          this.measure = "Total Notional"
          await this.calculateInitialData();
          break;
        case "tile-2":
          this.measure = "Trade Count"
          await this.calculateInitialData();
          break;
        case "tile-3":
          this.measure = "Time to Maturity(Avg)"
          await this.calculateInitialData();
          break;

        case "tile-4":
          this.measure = "Total MtM"
          await this.calculateInitialData();
          break;

        case "tile-5":
          this.measure = "Total MU"
          await this.calculateInitialData();
          break;
      }
      //Changed by Jyoti S || 21-Sep-2023 || END
    } catch (error) {
      console.log(error);
    }
  }

  async GetCustomerNames() {
    /// Added by OnkarE on 05-Jan-2021
    try {
      await this.api.GetCustomerNames(String(AppConfig.settings.oRes.homeEntityID), "", AppConfig.settings.oRes.userID).then(
        (response: any) => {
          if (response.status === 1) {
            const res = response.response;
            //this.customersList = res;
            // if(this.loader == true){
            // 	;
            // 	//this.loader = false;
            // }
          }
        }
      );
    } catch (error) {
      console.error(error);
      //this.api.WriteErrorLogs("Error occured in GetCustomerNames :"+error);
    } finally { }
  }

  //START || Added by Varsha G || sorting concentration chart data || 21-sep-23
  sortDoughData(doughnutData) {
    try {
      return Object.keys(doughnutData).sort((a, b) => doughnutData[b] - doughnutData[a]).reduce((acc, cur) => {
        acc[cur] = doughnutData[cur]
        return acc
      }, {})
    } catch (error) {
    }
  }
  //END || Added by Varsha G || sorting concentration chart data || 21-sep-23
   async getSectorDataChart() {
    try {
      this.sectorSummaryTradeRes = [];
      this.summarySector = [];
      this.summaryMeasure = [];
      if (this.totalNotional) {
        this.totalNotional.destroy();
      }
      if (this.underlyings) {
        this.underlyings.destroy();
      }
      //START || Added by Varsha G || sorting concentration chart data || 21-sep-23
      // const concentrationData = Object.fromEntries(this.SectorChartData);
      // this.result = this.sortDoughData(concentrationData);
      // this.selectedConcentration = Object.keys(this.result)[0];
      //END || Added by Varsha G || sorting concentration chart data || 21-sep-23
      this.createConcentrationGraph();
    } catch (error) {

    }
  }
  async getEventCount() {
    try {
      this.loader = true
      this.eventMonthCountArr = await this.intDashboard.GetInteractivedata({
        TemplateCode: "USP_INT_Dashboard_EventData_Temp",
        // CustomerID: "",
        // EventType: this.eventType,
        // FromDate: "01-Jan-17",
        // ToDate: "31-Dec-30",
        // Measure: "",
        // Sector: "",
        // RowsPerPage: "",
        // PageNo: "",
        // WhereClause: ""
      });
      if (this.eventMonthCountArr) {
              setTimeout(() => {
          this.getCurrentMonthCnt();
          this.loader = false
        },);
      }
    } catch (error) {

    }
  }

  // async getCurrentMonthCnt(month: any = this.currentDate.getMonth(), year: any = this.currentDate.getFullYear()) {
  //   try {
  //     this.counts = [];
  //     this.EventCountData.clear();
  //     this.uniqueEvent = [];
  //     this.eventCountArr = this.eventMonthCountArr.filter((date) => {
  //       var eDate = new Date(Date.parse(date.EventDate.split("T")[0]))
  //       if (this.Dates.includes(eDate.getDate()) && (this.Months[eDate.getMonth()] === this.Months[month] || this.Months[eDate.getMonth()] === this.Months[month + 1]) && (eDate.getFullYear() == year || (this.Months[month + 1] == this.Months[0] && this.Months[eDate.getMonth()] === this.Months[month + 1] && eDate.getFullYear() == year + 1))) {
  //         if (this.LiveCheck && date.AliveYN == "Alive") {
  //           return date;
  //         }
  //         if (this.DeadCheck && date.AliveYN == "Dead") {
  //           return date;
  //         }
  //       }
  //     })
  //       this.uniqueEvent = [...new Set(this.eventCountArr.map(item => item.EventDate.split("T")[0]))];
  //       this.uniqueEvent.forEach((date) => {
  //       let EventArray = new Map<string, number>()
  //       this.eventCountArr.forEach(event => {
  //         if (event.EventDate.split("T")[0] == date && this.external.includes(event.ExternalID)) {
  //           if (EventArray.get(event.EventName) == undefined) {
  //             let u1 = EventArray.set(event.EventName, 1)
  //             this.EventCountData.set(date, u1)
  //           } else {
  //             let u1 = EventArray.set(event.EventName, (EventArray.get(event.EventName) + 1))
  //             this.EventCountData.set(date, u1)
  //           }
  //         }
  //       });
  //     })
      
  //     let EventCountDataArr = Array.from(this.EventCountData, ([name, value]) => ({ name, value }));
  //     EventCountDataArr.forEach((data) => {
  //     let array = Array.from(data.value, ([name, value]) => ({ name, value }));
  //     array.forEach((event) => {
  //       var eDate = new Date(Date.parse(data.name))
  //       if(this.Dates.includes(eDate.getDate()) && (this.Months[ eDate.getMonth()] === this.Months[month] || this.Months[ eDate.getMonth()] === this.Months[month+1]) && (eDate.getFullYear() == year || ( this.Months[month+1] == this.Months[0] && this.Months[ eDate.getMonth()] === this.Months[month+1] && eDate.getFullYear() == year+1))){
  //       this.counts.push({
  //               DateNumber :  eDate.getDate(),
  //               month : this.Months[ eDate.getMonth()],
  //               year : eDate.getFullYear(),
  //               Count : event.value,
  //               EventName : event.name,
  //               Color : this.colorPalletLabelSet.get(event.name)
  //             })
  //           }
  //     })
  //   })
  //       this.countsTemp = this.counts
  //       this.eventCountFilter()
  //       this.setEventCount(this.selectedMonth, this.selectedYear);
  //       this.loader = false;
  //   } catch (error) {

  //   }
  // }
  //Changes done by Jyoti S || to reduce slow rendering issue in SP Event Calendar || 06-Nov-2023 || START
  async getCurrentMonthCnt(month: any = this.currentDate.getMonth(), year: any = this.currentDate.getFullYear()) {
    try {
this.counts = [];
    this.countsTemp = [];
this.notificatonPopUpArr = [];
        var firstIndex = this.getFirstDayOfMonth(this.selectedMonth, this.selectedYear);
      if (firstIndex == 0) {
        firstIndex = 7;
      }
      for (let i = 1; i < firstIndex; i++) {
        this.counts.push({
          DateNumber: 0,
        });
      }
      for (let day = 0; day < this.getDaysInMonth(parseInt(this.selectedMonth + '', 10) + 1, this.selectedYear); day++) {
        // this.counts.push(day + 1);
        this.counts.push(
          {
            DateNumber: day + 1,
            month: this.selectedMonth,
            year: this.selectedYear,
            fullDate: (this.selectedYear) + '-' + ((this.selectedMonth + 1) < 10 ? '0' + (this.selectedMonth + 1) : (this.selectedMonth + 1)) + '-' + ((day + 1) < 10 ? '0' + (day + 1) : (day + 1)),
            events: [
              {
                Count: 0,
                EventName: 'Maturity',
                Color: '#FF9800'
              },
              {
                Count: 0,
                EventName: "Autocall",
                Color: "#63BA68"
              },
              {
                Count: 0,
                EventName: "Protection",
                Color: "#43c0c7" 
              },
              {
                Count: 0,
                EventName: "Coupon",
                Color: "#3366FF"
              },
              {
                Count: 0,
                EventName: "Issuer Callable",
                Color: "#ea6363"
              },
            ]
          }
        );
      }
      const maxIndex = this.counts.length % 7 > 0 ? this.counts.length + 7 - (this.counts.length % 7) : 0;
      let diff = maxIndex - this.counts.length;
      for (let k = 1; k <= diff; k++) {
        this.counts.push(
          {
            DateNumber: k,
            month: this.selectedMonth + 1 % 12,
            year: this.selectedMonth === 11 ? this.selectedYear + 1 : this.selectedYear,
            fullDate: (this.selectedYear) + '-' + ((this.selectedMonth + 2) < 10 ? '0' + (this.selectedMonth + 2) : (this.selectedMonth + 2)) + '-' + ((k < 10 ? '0' + k : k)),
            events: [
              {
                Count: 0,
                EventName: 'Maturity',
                Color: '#FF9800'
              },
              {
                Count: 0,
                EventName: "Autocall",
                Color: "#63BA68"
              },
              {
                Count: 0,
                EventName: "Protection",
                Color: "#43c0c7" 
              },
              {
                Count: 0,
                EventName: "Coupon",
                Color: "#3366FF"
              },
              {
                Count: 0,
                EventName: "Issuer Callable",
                Color: "#ea6363"
              },
            ]
          }
        );
      }
      this.eventMonthCountArr.forEach(element => {
        const index = this.counts.findIndex(el => el.fullDate == element.EventDate.split("T")[0]);
        if(index >= 0 && this.counts[index].DateNumber != 0 && ((this.LiveCheck  == (element.AliveYN == 'Alive')) || (this.DeadCheck  == (element.AliveYN == 'Dead'))) && this.external.includes(element.ExternalID)){
          this.notificatonPopUpArr.push({
            EventDate : element.EventDate.split("T")[0],
            ISIN : element.ISIN == 'NA' ? "" : element.ISIN,
            ExternalID : element.ExternalID,
            ProductName : element.ProductName,
            EventName : element.EventName,
            SettleCcy : element.SettleCcy,
            Notional : element.Notional,
            AliveYN : element.AliveYN,
          })
          let eventsArr = this.counts[index].events;
          const evtIdx = eventsArr.findIndex(el => el.EventName == element.EventName);
          if(evtIdx >= 0){
            this.counts[index].events[evtIdx].Count++;
          }
        }
      });
            this.countsTemp = JSON.parse(JSON.stringify(this.counts));
      this.notificationTemp = [...this.notificatonPopUpArr];
      this.eventCountFilter();
      this.loader= false;
        } catch (error) {

    }
  }

  eventCountFilter() {
    try {
      this.counts = JSON.parse(JSON.stringify(this.countsTemp));
      if(this.eventType && this.eventType.split(',').length > 0){
        for(let i = 0; i < this.counts.length; i++){
          if(this.counts[i].DateNumber != 0)
          {
            for(let j = 0; j < this.counts[i].events.length; j++){
            if(this.eventType.split(',').includes(this.counts[i].events[j].EventName)){
              }
              else{
              this.counts[i].events[j].Count = 0;
              }
          }
        }
        }
      } 

    } catch (error) {

    }
  }
  //Changes done by Jyoti S || to reduce slow rendering issue in SP Event Calendar || 06-Nov-2023 ||END

  async getMonthwiseNotifications(month: any = this.currentDate.getMonth(), year: any = this.currentDate.getFullYear()) {
    this.changeNotificationsCount(month, year);
    try {
      this.notificatonArr = []
      this.eventDataRes = await this.intDashboard.GetInteractivedata({
        TemplateCode: "USP_INT_Dashboard_EventData_Monthly ",
        // CustomerID: "",
        // EventType: "",
        // FromDate: "",
        // ToDate: "",
        // Measure: "",
        // Sector: "",
        // RowsPerPage: "",
        // PageNo: "",
        // WhereClause: ""
      });
      if (this.eventDataRes) {
        this.notificatonArr = []
        this.eventDataRes.forEach((data) => {
          this.notificatonArr.push({
            date: data.EventDate.split("T")[0],
            event: data.EventName,
            product: isEmptyObject(data.ProductName) ? '' : data.ProductName,
            ExternalID: data.ExternalID,
            ccy: data.SettleCcy,
            notional: data.Notional,
            aliveYN: data.AliveYN
          })
        });
        this.notificationDataTempArr = this.notificatonArr;
        this.notificationDataForFilter = this.notificatonArr;
        this.notificationFilter()
      } else {
        this.noOfRecords = 0;
        this.pageFirstRecord = 0;
        this.pageLastRecord = 0;
      }
    } catch (error) {

    }
  }
  //Changed by Jyoti S || 21-Sep-2023 || END

  //Changes done by Jyoti S || 06-Nov-2023 || START
  async getNotificationsPopUp(info) {
    try {
      let index = isNumber(info.Month) ? info.Month : this.Months.indexOf(info.Month)
      index++
      let month = Number(index) < 10 ? "0" + index : index
      let date = Number(info.Date) < 10 ? "0" + info.Date : info.Date
      let Today = info.Year + "-" + month + "-" + date;
      this.DateString = {}
      this.DateString = info
      this.notificatonPopUpArr = [...this.notificationTemp];
      this.notificatonPopUpArr = this.notificatonPopUpArr.filter((data)=>{
        if ((info.EventType == data.EventName || info.EventType.toLowerCase() == 'all' || info.EventType == '') && data.EventDate == Today) {
          return data;
      }})

      //Changes done by Jyoti S || 06-Nov-2023 || END
    } catch (error) {

    }
  } // Added by Jyoti S || 04-Sept-2023


  async getUnderlyingDataChart(sector: any = Array.from(this.SectorChartData.keys())[0]) {

    this.colorArray = [];
    try {
      let i = 1;
      this.underlyingSummaryTradeRes = [];
      this.summaryUnderlyingMeasure = [];
      this.summaryUnderlying = [];
      if (this.underlyings) {
        this.underlyings.destroy();
      }

      //START || Added by Varsha G || sorting concentration chart data || 21-sep-23
      // const filtered = new Map(Array.from(this.UnderlyingChartData).filter(([_key, value]) => {
      //   if (_key == sector)
      //     return value;
      // }),
      // );
      // let unfilteredObject = Array.from(filtered.values())[0]
      // const filteredObj = {}
      // unfilteredObject.forEach((value, key) => {
      //   filteredObj[key] = value;
      // })
      // const sortedSummary = this.sortDoughData(filteredObj);
      const newMap : any = (Array.from(this.UnderlyingChartData.get(sector)).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1])).reverse());//Sorting on abs values and display actual values || Changed by Jyoti S as suggested by Suraj T. || 02-Nov-2023
      this.UnderlyingChartData.set(sector,new Map(newMap));
      //END || Added by Varsha G || sorting concentration chart data || 21-sep-23
      this.createUnderlyingChart(this.UnderlyingChartData.get(sector));
    } catch (error) {

    }
  }

  async getAggregatedNotionalChartData() {
    try {
      let notionalData = [];
      notionalData = await this.intDashboard.GetInteractivedata({
        TemplateCode: "USP_Notional_Agg_Maturity_Chart",
        // CustomerID: "",
        // EventType: "",
        // FromDate: "01-Jan-17",
        // ToDate: "31-Oct-25",
        // Measure: "",
        Sector: this.intDashboard.currencyPreference,//Varsha G || User currency preference || FSLINT-64 || 30-May-2024
        // RowsPerPage: "",
        // PageNo: "",
        // WhereClause: ""
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let dict = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Qug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12',
      }
      var FromDate = notionalData[0].MaturityDate;
      var ToDate = notionalData[notionalData.length - 1].MaturityDate;
      var from = new Date(FromDate);
      var to = new Date(ToDate);


      // /* For Simulated Data */
      //   var FromDate = "24-May-24";
      //   var ToDate = "31-Oct-25";
      //   var from = new Date(formatDate(FromDate));
      //   var to = new Date(formatDate(ToDate));
      //   function formatDate(inputDate) {
      //     const parts = inputDate.split('-');
      //     const day = parseInt(parts[0]);
      //     const month = months.indexOf(parts[1]);
      //     const year = parseInt(parts[2]) + 2000; // Assuming 2-digit years represent 20xx
      //     const formattedDate = new Date(year, month, day);
      //     const yyyy = formattedDate.getFullYear();
      //     const mm = String(formattedDate.getMonth() + 1).padStart(2, '0');
      //     const dd = String(formattedDate.getDate()).padStart(2, '0');
      //     return `${yyyy}-${mm}-${dd}`;
      //   }

      //   /* START : Following Code is used for simulating Data response */
      //   let notionalData = [];
      //   let ctr = 0;
      //   // loop for every day
      //   for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
      //     // your day is here
      //     notionalData[ctr++]= {Product_name: '60M EUR Snowball Coupon Autocall on SAN SQ, REP SQ', Currency: 'EUR', Nominal: Math.random(), MaturityDate: day.toISOString().split('T')[0], EURNominal: 106600}
      //   }
      // /* END : Following Code is used for simulating Data response */
      // /*Simulated Data */


      var temp = from.toDateString();
      //this.startDate = temp.split(' ')[3] + '-' + dict[temp.split(' ')[1]];
      let tdate = new Date();
      this.startDate = tdate.getFullYear().toString() + '-' + dict[months[tdate.getMonth()]];


      var currentDate = new Date(from);
      notionalData.forEach(val => {
        if (currentDate <= to) {
          let data = val.MaturityDate.split('T')[0];
          data = new Date(data);
          if (currentDate != data) {
            var date = String(currentDate.getDate()).padStart(2, '0');
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var year = currentDate.getFullYear();
            const key = year + '-' + month + '-' + date + 'T00:00:00';
            notionalData.push({ Product_name: '', ExternalRef: 'zero', Currency: '', Nominal: 0, MaturityDate: key.toString(), EURNominal: 0 })
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      function compareMaturityDates(a, b) {
        const dateA = new Date(a.MaturityDate);
        const dateB = new Date(b.MaturityDate);

        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      }
      // Sort the array based on MaturityDate
      notionalData.sort(compareMaturityDates);
      // this.externalAggregated = notionalData.map(item=>item["ExternalRef"]).sort((a,b) => a > b ? 1 : -1);
      // this.externalAggregated = [...new Set(this.externalAggregated)];

      // FILTER CODE FOR AGGREGATED NOTIONAL GRAPH
      // for ( let val of notionalData){
      //   this.aggregatedFilter.push(val);
      // }
      this.aggregatedFilter = [];
      for (let i of notionalData) {
        this.aggregatedFilter.push(Object.assign({}, i));
      }
      // this.aggregatedFilter = notionalData.slice();

      notionalData.forEach((val) => {
        if (val.ExternalRef != 'zero' && this.ldMap.get(val.ExternalRef) == "Dead") {
          val.Nominal = 0;
          val.EURNominal = 0;
        }
      })
      function extract() {
        let groups = {};

        notionalData.forEach(function (val) {
          let date = val.MaturityDate.split('T')[0];
          date = date.split('-');
          date.splice(2, 1);
          // date[1] = months[parseInt(date[1], 10) - 1];
          date = date.join('-');
          groups[date] ? (groups[date] += val.Nominal) : (groups[date] = val.Nominal);
        });
        return groups;
      }


      let res = extract();
      this.notionalDataByMonths = res;
      this.resultMonth = [];
      for (var i in res)
        this.resultMonth.push([i, res[i]]);

      this.lenGroups = Object.keys(res).length;
      this.maturityDatesArr = Object.keys(res)
      this.totalNotionalWrtDateArr = Object.values(res)
      this.notionalDataRes = notionalData;
            //this.loader = false;

    } catch (error) {
      console.log(error);
    }
  }

  async getPageInfo(pageInfo) {
    try {
      this.pageNo = Number(pageInfo.pageNo);
      this.pageSize = Number(pageInfo.pageSize);
      let x = Number(pageInfo.pageNo * pageInfo.pageSize);
      if (x >= this.noOfRecords || pageInfo.reload) {
        this.pageNo = 0;
      }
      else if (x < 0) {
        this.pageNo = Math.floor(this.noOfRecords / this.pageSize);
      }
      this.pageFirstRecord = (this.pageNo * this.pageSize) + 1
      this.pageLastRecord = (this.pageNo * this.pageSize) + this.pageSize > this.noOfRecords ? this.noOfRecords : (this.pageNo * this.pageSize) + this.pageSize
    
    } catch (error) {

    }
  }

  //Added by Jyoti S || 01-Sep-2023 || START
  shadeColor(color: string, decimal: number): string {
    const base = color.startsWith('#') ? 1 : 0;

    let r = parseInt(color.substring(base, 3), 16);
    let g = parseInt(color.substring(base + 2, 5), 16);
    let b = parseInt(color.substring(base + 4, 7), 16);

    r = Math.round(r / decimal);
    g = Math.round(g / decimal);
    b = Math.round(b / decimal);

    r = (r < 255) ? r : 255;
    g = (g < 255) ? g : 255;
    b = (b < 255) ? b : 255;

    const rr = ((r.toString(16).length === 1) ? `0${r.toString(16)}` : r.toString(16));
    const gg = ((g.toString(16).length === 1) ? `0${g.toString(16)}` : g.toString(16));
    const bb = ((b.toString(16).length === 1) ? `0${b.toString(16)}` : b.toString(16));

    return `#${rr}${gg}${bb}`;
  }//Added by Jyoti S || 01-Sep-2023 || END

  createCharts(choice) {

    if(this.initialDataRes.length == 0)
      return;

    this.totalNotionalWrtDateArr = Object.values(this.extractDataByMonths(this.notionalDataRes));
    // this.chart.update();
    let temp = [];
    for (let i = 0; i < this.maturityDatesArr.length; i++)
      temp.push(this.maturityDatesArr[i]);
    if (this.level == 2)
      this.lenGroups = this.maturityDatesArr.length;
    const index1 = temp.indexOf(this.startDate);
    const index2 = Math.min(temp.length - 1, index1 + 11);

    this.minVal = index1
    this.maxVal = index2
    this.curbar = null;
    if (choice == 'Concentration') {
      if (this.totalNotional) {
        this.totalNotional.destroy();
      }
      if (this.underlyings) {
        this.underlyings.destroy();
      }
      const concentrationData = Object.fromEntries(this.SectorChartData);
      this.result = this.sortDoughData(concentrationData);
      this.selectedConcentration = Object.keys(this.result)[0];
      this.createConcentrationGraph();
      let sector = Object.keys(this.result)[0]
      const newMap : any = (Array.from(this.UnderlyingChartData.get(sector)).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1])).reverse());//Sorting on abs values and display actual values || Changed by Jyoti S as suggested by Suraj T. || 02-Nov-2023
      this.UnderlyingChartData.set(sector,new Map(newMap));
//END || Added by Varsha G || sorting concentration chart data || 21-sep-23
      this.createUnderlyingChart(this.UnderlyingChartData.get(sector));
    } else {
      if (this.chart) {
        this.chart.destroy();
      }
    this.createAggregatedNotionalGraph();

  }
}

  async GetEventTypes() {
    try {
      this.eventTypeArr = await this.intDashboard.GetCommonData('InteractiveDashboardEvents');
      this.eventTypeArr = this.eventTypeArr.map(item => item["value"]).sort((a, b) => a > b ? 1 : -1)
      this.eventTypeArr = [...new Set(this.eventTypeArr)];
    } catch (error) {

    }
  }
  refresh() {
    this.loader = true;
    this.refreshed = true;
    this.showDropdown = false;
    this.selectedGroup = '';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType = '';
    this.selectedTutela = '';
    this.selectedSubtutela = '';
    this.selectedBranch = '';
    this.selectedTerritory = '';
    this.selectedZone = '';
    this.selectedFormat = '';
    this.selectedCurrency = '';
    this.selectedPType = '';
    this.selectedULType = '';
    this.selectedExternal = '';
    this.selectedUnderlying = '';
    this.StartDate = "";
    this.StartDateDisplay = "";
    this.EndDateDisplay = "";
    this.EndDate = "";
    this.selectedMaturityIn = "";
    this.selectedObservationIn = "";
    this.selectedACIn = "";
    this.selectedCancelDateIn = "";
    //Resetting Flags
    this.selectedCapAtRisk = false;
    this.selectedCancelProb = false;
    this.selectedBarDist = false;
    this.selectedIndVal = false;
    this.inBasketCheck = true;
    this.LiveCheck = true;
    this.DeadCheck = false;
    this.eventTypeNotification = '';
    this.clearClientFilter = true;
    this.clearProductFilter = true;
    //< START : NOTIFICATIONS COUNT SET TO 0 ON RERESH - ADDED BY ANMOL B>
    this.pageFirstRecord = 0;
    this.pageLastRecord = 0;
    this.noOfRecords = 0;
    // <END>
    // <AGGREGATED GRAPH>;
    this.thresh = 0;
    this.lockView = false;
    if(document.getElementById('pinViewText'))
      document.getElementById('pinViewText').innerText = "Lock View";
    this.level = 2
    this.totalNotionalWrtDateArr = Object.values(this.extractDataByMonths(this.notionalDataRes));
    // this.chart.update();
    let temp = [];
    for (let i = 0; i < this.maturityDatesArr.length; i++)
      temp.push(this.maturityDatesArr[i]);
    if (this.level == 2)
      this.lenGroups = this.maturityDatesArr.length;
    const index1 = temp.indexOf(this.startDate);
    const index2 = Math.min(temp.length - 1, index1 + 11);

    this.minVal = index1
    this.maxVal = index2
    this.curbar = null;
    // </AGGREGATED GRAPH>
    this.viewName="";
    // this.getEventCount();
    // this.getMonthwiseNotifications();
    // this.getInteractiveChartData();
    if (this.totalNotional) {
      this.totalNotional.destroy();
    }
    if (this.underlyings) {
      this.underlyings.destroy();
    }
    if (this.chart) {
      this.chart.destroy();
    }
    this.ngOnInit();

  }

  generateColor(hexColor: string, value: number, minValue: number, maxValue: number): string {
    const valueRatio = (value - minValue) / (maxValue - minValue);

    // Convert the hex color to RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    // Convert RGB to HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // grayscale
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      const hslColor = {
        h: h * 360, // Keep the original hue
        s: s * 100, // Use the original saturation
        l: l * 100, // Use the original lightness
      };

      // Adjust lightness to create a gradient
      const minLightness = 60; // Minimum lightness
      const maxLightness = 90; // Maximum lightness
      const adjustedLightness = minLightness + valueRatio * (maxLightness - minLightness); // Adjust the range as needed

      // Ensure the saturation remains the same
      hslColor.s = 100;
      hslColor.l = adjustedLightness;

      return hslColor;
    };

    const color = hexToRgb(hexColor);
    const hslColor = rgbToHsl(color.r, color.g, color.b);

    // Convert the adjusted HSL values back to hex
    const adjustedHex = this.hslToHex(hslColor);

    return adjustedHex;
  }

  // Function to convert HSL to hex
  hslToHex(hsl: { h: number; s: number; l: number }): string {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = hueToRgb(p, q, h + 1 / 3) * 255;
    const g = hueToRgb(p, q, h) * 255;
    const b = hueToRgb(p, q, h - 1 / 3) * 255;

    return `#${Math.round(r).toString(16)}${Math.round(g).toString(16)}${Math.round(b).toString(16)}`;
  }


  getColors() {

    if (this.level == 0) {
      this.dataForColourMapping = Object.values(this.notionalDataDays);
    }
    else if (this.level == 1) {
      this.dataForColourMapping = Object.values(this.notionalDataByWeek);
    }
    if (this.level == 2) {
      this.dataForColourMapping = Object.values(this.notionalDataByMonths);
    }
    if (this.level == 3) {
      this.dataForColourMapping = Object.values(this.notionalDataByYear);
    }

    const maxValue = Math.max(...this.dataForColourMapping); // Find the maximum value in your data
    const minValue = Math.min(...this.dataForColourMapping); // Find the minimum value in your data
    let dynamicColors = this.dataForColourMapping.map((value) => this.generateColor(this.colors[0], value, maxValue, minValue));
    return dynamicColors;
  }
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  //Added by Jyoti S || 08-Sept-2023 || START
  async exportToExcel() {
    try {
      this.exportToExcelData = this.notificatonArr
      this.excelService.exportAsExcelFile(this.getExcelData(this.exportToExcelData), 'SPEventCalendar');
    } catch (error) {

    }
  }

  // Changes done by Jyoti S || 03-Oct-2023 || START
  getExcelData(ExcelData) {
    try {
      const exlDataCopy = [];
      let obj;
      ExcelData.forEach(item => {
        obj = {};
        obj["Event Date"] = item["date"];
        obj["Event Name"] = item["event"];
        obj["Currency"] = item["ccy"];
        obj["ExternalID"] = item["ExternalID"];
        obj["Notional"] = item["notional"];
        obj["Product Name"] = item["product"]
        exlDataCopy.push(obj);
      });
      return exlDataCopy;
    } catch (error) {

    }
  }// Changes done by Jyoti S || 03-Oct-2023 || END

  //Added by Jyoti S || 08-Sept-2023 || END
  //Added by Jyoti S || 13-Sept-2023 || START
  async getInteractiveChartData() {
    try {
      this.initialDataRes = []
      this.initialDataRes = await this.intDashboard.GetInteractivedata({
        TemplateCode: "USP_Get_SP_Event_Calendar",
        // CustomerID: "",
        // //EventType: "",
        // FromDate: "01-Jan-17",
        // ToDate: "31-Dec-30",
        // //Measure: "",
        Sector: this.intDashboard.currencyPreference,//Varsha G || User currency preference || FSLINT-64 || 30-May-2024
        // RowsPerPage: "",
        // PageNo: "",
        // WhereClause: ""
      });
      if (this.initialDataRes) {
        this.MUFlag = !!this.initialDataRes.find(e => e.BaseCcyMU == "*")
        for (let i = 0; i < this.initialDataRes.length; i++) {
          this.ldMap.set(this.initialDataRes[i].External, this.initialDataRes[i].AliveYN);
        }
        this.tempArrData = this.initialDataRes;
        this.dataForFilter = this.initialDataRes;
        //ONLOAD LIVE FILTER - Added By AnmolB 
        this.initialDataRes = this.initialDataRes.filter((s: any) => s.AliveYN == "Alive");
        let blotterData = [];
        blotterData = await this.initialDataRes;
        if(this.LiveCheck)
      {
        this.blotterData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
        this.filteredBackData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
              }
      else{
        this.blotterData = blotterData;
        this.filteredBackData=blotterData;
              }

        this.formatData = [];
        this.currencyData = [];
        this.productTypeData = [];
        this.ulTypeData = [];
        let kI_Distance: any[];
        let mtm: any[];
        let capAtRisk: any[];
        let cancelProb: any[];

        this.groupArr = [];
        this.clientArr = [];
        this.intRefArr = [];
        this.typeArr = [];
        this.tutelaArr = [];
        this.subtutelaArr = [];
        this.branchArr = [];
        this.territoryArr = [];
        this.zoneArr = [];


        this.formatData = blotterData.map(item => item["Format"]).sort((a, b) => a > b ? 1 : -1);
        this.formatData = [...new Set(this.formatData)];

        this.currencyData = blotterData.map(item => item["SettleCcy"]).sort((a, b) => a > b ? 1 : -1);
        this.currencyData = [...new Set(this.currencyData)];

        this.productTypeData = blotterData.map(item => item["PayOff"]).sort((a, b) => a > b ? 1 : -1);
        this.productTypeData = [...new Set(this.productTypeData)];

        this.ulTypeData = blotterData.map(item => item["UL_Type"]).sort((a, b) => a > b ? 1 : -1);
        this.ulTypeData = [...new Set(this.ulTypeData)];

        this.external = blotterData.map(item => item["External"]).sort((a, b) => a > b ? 1 : -1);
        this.external = [...new Set(this.external)];

        this.current_CapAtRisk_StartValue = this.startCapAtRiskValue
        this.current_CapAtRisk_LastValue = this.endCapAtRiskValue;


        [...new Set(blotterData.map(item => item["Group"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.groupArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Client"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.clientArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Internal_J"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.intRefArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Type"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.typeArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Tutela"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.tutelaArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Subtutela"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.subtutelaArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Branch"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.branchArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Territory"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.territoryArr.push(newObj);
        });
        [...new Set(blotterData.map(item => item["Zone"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.zoneArr.push(newObj);
        });
        capAtRisk = [...new Set(blotterData.map(item => Number(item["CapAtRisk"])))];
        let maxCapAtRisk = capAtRisk.reduce((a, b) => Math.max(a, b));
        let minCapAtRisk = capAtRisk.reduce((a, b) => Math.min(a, b));
        this.startCapAtRiskValue = minCapAtRisk;
        this.endCapAtRiskValue = maxCapAtRisk;
        this.current_CapAtRisk_StartValue = this.startCapAtRiskValue
        this.current_CapAtRisk_LastValue = this.endCapAtRiskValue;
        let opts1: Options = {
          floor: minCapAtRisk,
          ceil: maxCapAtRisk,
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
        this.options1 = opts1;
        
        //Cancel PRob
        cancelProb = [...new Set(blotterData.map(item => item["CancelProb"]))];
        let maxCancelProb = cancelProb.reduce((a, b) => Math.max(a, b));
        let minCancelProb = cancelProb.reduce((a, b) => Math.min(a, b));
        this.startCancelProbValue = minCancelProb;
        this.endCancelProbValue = maxCancelProb;
        this.current_CancelProb_StartValue = this.startCancelProbValue
        this.current_CancelProb_LastValue = this.endCancelProbValue;
        
        let opts2: Options = {
          floor: minCancelProb,
          ceil: maxCancelProb,
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
        this.options2 = opts2;

        //BArrier Distance
        kI_Distance = blotterData.filter((item) => {
          if (item["KIApplicable"] == "Y") {
            return item["KI_Distance"]
          }
         });
         let maxKI;
         let minKI;
        if(kI_Distance.length > 0){
          kI_Distance = [...new Set(kI_Distance.map(item => item["KI_Distance"]))];
          maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
          minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
          this.startBarrierDValue = minKI;
          this.endBarrierDValue = maxKI;
          this.current_BarrierD_StartValue = this.startBarrierDValue
          this.current_BarrierD_LastValue = this.endBarrierDValue;
        }else{
          maxKI = 0;
          minKI = 0;
          this.startBarrierDValue = 0;
          this.endBarrierDValue = 0;
          this.current_BarrierD_StartValue = this.startBarrierDValue
          this.current_BarrierD_LastValue = this.endBarrierDValue;
        }
        let opts3: Options = {
          floor: minKI,
          ceil: maxKI,
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
        this.options3 = opts3;
        
        //indicative value
        mtm = [...new Set(blotterData.map(item => item["MTMPerc"]))];
       // mtm = [...new Set(mtm)];
        let maxMTM = mtm.reduce((a, b) => Math.max(a, b));
        let minMTM = mtm.reduce((a, b) => Math.min(a, b));
        this.startIndValValue = minMTM;
        this.endIndValValue = maxMTM;
        this.current_IndVal_StartValue = this.startIndValValue
        this.current_IndVal_LastValue = this.endIndValValue;
        let opts4: Options = {
          floor: minMTM,
          ceil: maxMTM,
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
        this.options4 = opts4
      this.unFilteredBlotterData = this.blotterData;
      this.getEventCount();
      this.calculateInitialData();
        //this.loader = false;
      }
    }
    catch (error) {

    }
  }

  equivalentNotional(num: any) {
    try {
      const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
      ];
      const MatchedNum = map.find((x) => Math.abs(num) >= x.threshold);
      if (MatchedNum) {
        const formatted = (num / MatchedNum.threshold).toFixed(2) + MatchedNum.suffix;
        return formatted;
      }
      return num;
    } catch (error) {
      console.log(error);
    }
  }

  FormatNotional(Notional: number) {
    try {
      const formattedNotinal = Notional.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedNotinal;
    } catch (error) {

    }
  }
  uniqueSector: any = new Set();
  SectorChartData: any = new Map();
  UnderlyingChartData = new Map<string, Map<string, number>>();

  async calculateInitialData() {
    try {
      this.notionalCount = "";
        this.totalMtm = "";
        this.totalMU = "";
        this.tradeCount = ""
        this.timeToMaturityCnt = "";
      if(this.initialDataRes.length > 0){
      let Summary = {};
      //Changes done to remove duplicate records from calculations || START
      // let uniqueArr = [...new Set(this.initialDataRes.map((e)=>e.External))]
      let arrayUniqueByKey  =  [...new Map(this.initialDataRes.map(item =>[item['External'], item])).values()]
      Summary['TotalNotional'] = arrayUniqueByKey.reduce(function (a, b) { return a + b['BaseCcyNominal']; }, 0)
      Summary['TotalMtM'] = arrayUniqueByKey.reduce(function (a, b) { return a + b['BaseCcyMTM']; }, 0)
      Summary['TotalMU'] = arrayUniqueByKey.reduce(function (a, b) { return parseFloat(a.toString()) + parseFloat(b['BaseCcyMU']); }, 0)
      Summary['TradeCount'] = arrayUniqueByKey.length;
      Summary['Time2Maturity'] = arrayUniqueByKey.reduce(function (a, b) { return a + b['M2Maturity']; }, 0)
      //Changes done to remove duplicate records from calculations || END
      Summary['TotalNotional'] = this.equivalentNotional(Summary['TotalNotional']);
      Summary['TotalMtM'] = this.equivalentNotional(Summary['TotalMtM']);
      Summary['TotalMU'] = this.equivalentNotional(Summary['TotalMU']);

      this.initialDataArr["Summary"] = Summary

      if (this.initialDataArr["Summary"]) {
        this.notionalCount = this.initialDataArr.Summary['TotalNotional'] ?? "";
        this.totalMtm = this.initialDataArr.Summary['TotalMtM'] ?? "";
        this.totalMU = this.initialDataArr.Summary['TotalMU'] ?? "";
        this.tradeCount = this.initialDataArr.Summary['TradeCount']
        this.timeToMaturityCnt = (this.initialDataArr.Summary['Time2Maturity'] / this.tradeCount).toFixed(0);
        this.nanTTMflag = 0;
        if (isNaN(this.timeToMaturityCnt))
          this.nanTTMflag = 1;
      }


      this.initialDataRes.map((item) => {
       if (!isEmptyObject(item.Sector1) && item.Sector1 != "") {
          this.uniqueSector.add(item.Sector1)
        }
        if (!isEmptyObject(item.Sector2) && item.Sector2 != "") {
          this.uniqueSector.add(item.Sector2)
        }
        if (!isEmptyObject(item.Sector3) && item.Sector3 != "") {
          this.uniqueSector.add(item.Sector3)
        }
        if (!isEmptyObject(item.Sector4) && item.Sector4 != "") {
          this.uniqueSector.add(item.Sector4)
        }
      })
      //Changed by Jyoti S || 15-Sep-2023 || START
      let Measuretype = this.measure
      let type;
      switch (Measuretype) {

        case 'Total Notional':
          type = "Notional"
          break;

        case 'Trade Count':
          type = "TradeCount"
          break;

        case 'Time to Maturity(Avg)':
          type = "M2Maturity"
          break;

        case 'Total MtM':
          type = "MTMVal"
          break;

        case 'Total MU':
          type = "MU"
          break;

        default:
          type = "Notional"
          break;
      }

      this.uniqueSector.forEach((sector) => {
        let SectorNotional: any = 0;
        let count = 0;
        this.initialDataRes.forEach((item) => {

          if (item.Sector1 == sector) {
            SectorNotional += item[type];
            count++
          }
          if (item.Sector2 == sector) {
            SectorNotional += item[type];
            count++
          }
          if (item.Sector3 == sector) {
            SectorNotional += item[type];
            count++
          }
          if (item.Sector4 == sector) {
            SectorNotional += item[type];
            count++
          }
        })
        SectorNotional = parseInt(SectorNotional);
        SectorNotional = Measuretype == 'Time to Maturity(Avg)' ? SectorNotional / count : SectorNotional;
        Measuretype == "Trade Count" ? this.SectorChartData.set(sector, count) : this.SectorChartData.set(sector, SectorNotional);
      })
      let tradeCountMap = new Map<string, number>();
      this.uniqueSector.forEach((sector: any) => {
        if (!this.UnderlyingChartData.get(sector)) {
          this.UnderlyingChartData.set(sector, new Map<string, number>())
        }
      })

      this.uniqueSector.forEach((sector) => {
        let uniqueUnderlying = new Map<string, number>();
        uniqueUnderlying.clear();
        this.initialDataRes.forEach(element => {
          if (element.Sector1 == sector && !isEmptyObject(element.UL1)) {
            if (uniqueUnderlying.get(element.UL1)) {
              tradeCountMap.set(element.UL1, tradeCountMap.get(element.UL1) + 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL1, uniqueUnderlying.get(element.UL1) + 1) : uniqueUnderlying.set(element.UL1, (Measuretype == 'Time to Maturity(Avg)' ? (uniqueUnderlying.get(element.UL1) + element[type]) : uniqueUnderlying.get(element.UL1) + element[type]));
              this.UnderlyingChartData.set(sector, u1);
            }
            else {

              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL1, 1) : uniqueUnderlying.set(element.UL1, element[type]);
              tradeCountMap.set(element.UL1, 1);
              this.UnderlyingChartData.set(sector, u1);
            }
          }
          if (element.Sector2 == sector && !isEmptyObject(element.UL2)) {
            if (uniqueUnderlying.get(element.UL2)) {
              tradeCountMap.set(element.UL2, tradeCountMap.get(element.UL2) + 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL2, uniqueUnderlying.get(element.UL2) + 1) : uniqueUnderlying.set(element.UL2, (Measuretype == 'Time to Maturity' ? (uniqueUnderlying.get(element.UL2) + element[type]) : uniqueUnderlying.get(element.UL2) + element[type]));
              this.UnderlyingChartData.set(sector, u1);
            }
            else {
              tradeCountMap.set(element.UL2, 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL2, 1) : uniqueUnderlying.set(element.UL2, element[type]);
              this.UnderlyingChartData.set(sector, u1);
            }
          }

          if (element.Sector3 == sector && !isEmptyObject(element.UL3)) {
            if (uniqueUnderlying.get(element.UL3)) {
              tradeCountMap.set(element.UL3, tradeCountMap.get(element.UL3) + 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL3, uniqueUnderlying.get(element.UL3) + 1) : uniqueUnderlying.set(element.UL3, (Measuretype == 'Time to Maturity' ? (uniqueUnderlying.get(element.UL3) + element[type]) : uniqueUnderlying.get(element.UL3) + element[type]));
              this.UnderlyingChartData.set(sector, u1)
            }
            else {
              tradeCountMap.set(element.UL3, 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL3, 1) : uniqueUnderlying.set(element.UL3, element[type]);
              this.UnderlyingChartData.set(sector, u1);
            }
          }

          if (element.Sector4 == sector && !isEmptyObject(element.UL4)) {
            if (uniqueUnderlying.get(element.UL4)) {
              tradeCountMap.set(element.UL4, tradeCountMap.get(element.UL4) + 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL4, uniqueUnderlying.get(element.UL4) + 1) : uniqueUnderlying.set(element.UL4, (Measuretype == 'Time to Maturity' ? (uniqueUnderlying.get(element.UL4) + element[type]) : uniqueUnderlying.get(element.UL4) + element[type]));
              this.UnderlyingChartData.set(sector, u1);
            }
            else {
              tradeCountMap.set(element.UL4, 1);
              let u1 = Measuretype == "Trade Count" ? uniqueUnderlying.set(element.UL4, 1) : uniqueUnderlying.set(element.UL4, element[type]);
              this.UnderlyingChartData.set(sector, u1);
            }

          }
          //Changed by Jyoti S || 15-Sep-2023 || END
        });

      })
      if (Measuretype == 'Time to Maturity(Avg)') {
        this.uniqueSector.forEach((sector) => {
          let tempMap = new Map<string, number>();
          for (let [k, v] of this.UnderlyingChartData.get(sector)) {
            v = v / tradeCountMap.get(k);
            tempMap.set(k, v);
          }
          this.UnderlyingChartData.set(sector, tempMap);
        })

      }
      //this.loader = false;
      const newMap : any = (Array.from(this.SectorChartData).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1])).reverse());//Sorting on abs values and display actual values || Changed by Jyoti S as suggested by Suraj T. || 02-Nov-2023
      this.SectorChartData = new Map(newMap);
      this.selectedConcentration = Array.from(this.SectorChartData.keys())[0];
      await this.getSectorDataChart();
      this.getUnderlyingDataChart(this.selectedConcentration);
      }else{
        //this.loader = false;
        if(this.totalNotional){
          this.totalNotional.destroy()
        }
        if(this.underlyings){
          this.underlyings.destroy()
        }
        if(this.chart){
          this.chart.destroy()
        }
      }
    } catch (error) { }
  }

  notificationFilter() {
    try {
      let backupNotificationData = this.notificationDataForFilter;
      if (this.LiveCheck && !this.DeadCheck) {
        backupNotificationData = backupNotificationData.filter((s: any) => s.aliveYN == "Alive");
      }
      if (this.DeadCheck && !this.LiveCheck) {
        backupNotificationData = backupNotificationData.filter((s: any) => s.aliveYN == "Dead");
      }
      if (!this.LiveCheck && !this.DeadCheck) {
        backupNotificationData = backupNotificationData.filter((s: any) => (s.aliveYN == "Alive" && s.aliveYN == "Dead"));
      }

      this.notificationDataTempArr = backupNotificationData;
      this.getFilterwiseNotifications()
    } catch (error) {

    }
  }

  //Added by Jyoti S || 13-Sept-2023 || END

   FilterForAll(event?: KeyboardEvent) {
    // this.loader = true;
    // setTimeout(() => {
    let date;
    let backupData = this.dataForFilter;
    let backupAggregatedNotional = [];
    for (let i of this.aggregatedFilter) {
      backupAggregatedNotional.push(Object.assign({}, i));
    }
    if (this.LiveCheck && !this.DeadCheck) {
      backupData = backupData.filter((s: any) => s.AliveYN == "Alive");
    }

    if (this.DeadCheck && !this.LiveCheck) {
      backupData = backupData.filter((s: any) => s.AliveYN != "Alive");
    }

    if (!this.LiveCheck && !this.DeadCheck) {
      backupData = backupData.filter((s: any) => (s.AliveYN == "Alive" && s.AliveYN != "Alive"));
    }

    if (this.selectedExternal != "") {
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase());
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))
    }

    if (this.selectedFormat != "" ) { 
    const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());
      if(formatArr.length==this.formatData.length ){
        this.selectedFormat = "";
      }
      else {
        backupData = backupData.filter((s: any) => formatArr.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
      }
    }
    if (this.selectedCurrency != "" ) {
      const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
      if(currencyArr.length==this.currencyData.length ){
        this.selectedCurrency = "";
      }
      else {
        backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.SettleCcy.toString().toLowerCase().includes(currency) || s.SettleCcy.toLowerCase().includes(currency.toLowerCase()))))
      }
    }
    // For filter - PRODUCT TYPE
    if (this.selectedPType != "") {
      const productArr = this.selectedPType.split(',');
      if(productArr.length==this.productTypeData.length ){
        this.selectedPType = "";
      }
      else {
        backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase() === product.toString().toLowerCase())));
      }
    }
    // For filter - U/L TYPE
    if (this.selectedULType != "") {
      const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
      if (ULArr.length == this.ulTypeData.length) {
        this.selectedULType = "";
      }
      else {
        backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
      }
    }
    if (this.selectedUnderlying!= "") {
      if(this.inBasketCheck)
      {
        const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase()); 
        backupData = backupData.filter((s: any) => (underlyingToSearch.every(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase()))) )//&& s.ULCount!="1"
      }
      else{
        backupData=backupData.filter((s:any)=>(s.Product_Name.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount==1 )
      }
    }
    
    if (this.selectedGroup != "") {
      if(this.selectedGroup === 'NONE'){
        this.selectedGroup = 'Group';
        backupData = [];
      }
      else{
        const groupSelArr = this.selectedGroup.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
      }
    }

    if (this.selectedClient != "") {
      if(this.selectedClient === 'NONE'){
        this.selectedClient = 'Client';
        backupData = [];
      }
      else{
        const clientSelArr = this.selectedClient.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
      }
    }

    if (this.selectedIntRef != "") {
      if(this.selectedIntRef === 'NONE'){
        this.selectedIntRef = 'Internal Ref./J';
        backupData = [];
      }
      else{
        const intRefSelArr = this.selectedIntRef.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
      }
    }

    if (this.selectedType !== '') {
      if(this.selectedType === 'NONE'){
        this.selectedType = 'Type';
        backupData = [];
      }
      else{
        const typeSelArr = this.selectedType.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(typeSelArr, s.Type));
      }
    }

        if (this.selectedTutela !== '' ) {
      if(this.selectedTutela === 'NONE'){
        this.selectedTutela = 'Tutela';
        backupData = [];
      }
      else{
                const tutelaSelArr = this.selectedTutela.split(',');
        // 
        backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
      }
    }

    if (this.selectedSubtutela !== '') {
      if(this.selectedSubtutela === 'NONE'){
        this.selectedSubtutela = 'Subtutela';
        backupData = [];
      }
      else{
        const subtutelaSelArr = this.selectedSubtutela.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(subtutelaSelArr, s.Subtutela));
      }
    }

    if (this.selectedBranch !== '') {
      if(this.selectedBranch === 'NONE'){
        this.selectedBranch = 'Branch';
        backupData = [];
      }
      else{
        const branchSelArr = this.selectedBranch.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(branchSelArr, s.Branch));
      }
    }

    if (this.selectedTerritory !== '') {
      if(this.selectedTerritory === 'NONE'){
        this.selectedTerritory = 'Territory';
        backupData = [];
      }
      else{
        const territorySelArr = this.selectedTerritory.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(territorySelArr, s.Territory));
      }
    }

    if (this.selectedZone !== '') {
      if(this.selectedZone === 'NONE'){
        this.selectedZone = 'Zone';
        backupData = [];
      }
      else{
        const zoneSelArr = this.selectedZone.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(zoneSelArr, s.Zone));
      }
    }

    if (this.selectedCapAtRisk) {
      backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue && s.CapAtRisk <= this.current_CapAtRisk_LastValue)
    }
    if (this.selectedCancelProb) {
      backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue && s.CancelProb <= this.current_CancelProb_LastValue)
    }
    if (this.selectedBarDist) {
      backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue && s.KI_Distance <= this.current_BarrierD_LastValue)
    }
    if (this.selectedIndVal) {
      backupData = backupData.filter((s: any) => s.MTMPerc >= this.current_IndVal_StartValue && s.MTMPerc <= this.current_IndVal_LastValue)
    }

    if (this.selectedMaturityIn != "") {

      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedMaturityIn));
      backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
    }
    if (this.selectedObservationIn != "") {
      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedObservationIn));;
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }
    if (this.selectedCancelDateIn != "") {
      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedCancelDateIn));
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) >= (new Date(this.StartDateDisplay)))
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) <= (new Date(this.EndDateDisplay)))
    }
    this.filteredBackData=backupData;
        //backupData=this.filteredBackData;
    this.external = [...new Set(backupData.map(x => x.External))];
    backupAggregatedNotional.forEach((val) => {
      if (this.external.length > 0 && !this.external.includes(val.ExternalRef)) {
        val.Nominal = 0;
        val.EURNominal = 0;
      }
    })
        this.initialDataRes = backupData;
    this.notionalDataRes = backupAggregatedNotional;
    if (this.chart) {
      if (this.level == 3) {
        this.extractDataByYear(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByYear;
      }
      else if (this.level == 2) {
        this.extractDataByMonths(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByMonths;
      }
      else if (this.level == 1) {
        this.extractDataByWeeks(this.notionalDataRes, 'Mon');
        this.chart.data.datasets[0].data = this.notionalDataByWeek;
      }
      else if (this.level == 0) {
        this.extractDataByDates(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataDays;
      }

      let chartData = this.chart.data.datasets[0].data;
      let labels = this.chart.data.xLabels;
      this.minVal = this.chart.scales.x.min;
      this.maxVal = this.chart.scales.x.max;
      if(this.chart){
        this.chart.destroy();
      }
      if (this.subpages[1].ActiveYN==true){
        this.createAggregatedNotionalGraph();
        this.chart.data.datasets[0].data = chartData;
        this.chart.data.xLabels = labels;
        this.chart.update();
      }


    }
    //this.generateDates();
    this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
    this.setSlidersValue();
    //this.loader = false;
    this.calculateInitialData();
        // }, );

  }

async clearProductSpecs() {
  this.loader = true
  this.StartDate = "";
  this.StartDateDisplay = "";
  this.EndDateDisplay="";
  this.EndDate = "";
  this.selectedMaturityIn="";
  this.selectedObservationIn="";
  this.selectedACIn="";
  this.selectedCancelDateIn="";
  //Resetting Flags
  this.selectedCapAtRisk = false;
  this.selectedCancelProb = false;
  this.selectedBarDist = false;
  this.selectedIndVal = false;

  setTimeout(() => {
  let date;
  let backupData = this.dataForFilter;
  let backupAggregatedNotional = [];
  for (let i of this.aggregatedFilter) {
    backupAggregatedNotional.push(Object.assign({}, i));
  }

  if (this.LiveCheck && !this.DeadCheck) {
    backupData = backupData.filter((s: any) => s.AliveYN == "Alive");
    // backupNotificationData = backupNotificationData.filter((s:any)=>this.ldMap.get(s.ExternalID)=="Alive");
  }
  if (this.DeadCheck && !this.LiveCheck) {
    backupData = backupData.filter((s: any) => s.AliveYN != "Alive");
    // backupNotificationData = backupNotificationData.filter((s:any)=>this.ldMap.get(s.ExternalID)=="Dead");
  }
  if (!this.LiveCheck && !this.DeadCheck) {
    backupData = backupData.filter((s: any) => (s.AliveYN == "Alive" && s.AliveYN != "Alive"));
    // backupNotificationData = backupNotificationData.filter((s:any)=>(this.ldMap.get(s.ExternalID)=="Alive" && this.ldMap.get(s.ExternalID)=="Dead"));
  }

  if (this.selectedExternal != "") {
    const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase());
    backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))

  }
  if (this.selectedFormat != "" && this.selectedFormat != 'Format') {

    const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());

    if (formatArr.length == this.formatData.length) {
      this.selectedFormat = "";
    }
    else {
      // backupData = backupData.filter((s: any) => s.format.toString().toLowerCase().includes(this.selectedFormat.toString().toLowerCase()));
      backupData = backupData.filter((s: any) => formatArr.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
    }
  }
  // For filter - CURRENCY
  // For filter - CURRENCY
  if (this.selectedCurrency != "" && this.selectedCurrency != 'Currency') {

    const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
    if (currencyArr.length == this.currencyData.length) {
      this.selectedCurrency = "";
    }
    else {
      // backupData = backupData.filter((s: any) => s.currency.toString().toLowerCase().includes(this.selectedCurrency.toString().toLowerCase()));
      backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.SettleCcy.toString().toLowerCase().includes(currency) || s.SettleCcy.toLowerCase().includes(currency.toLowerCase()))))
    }
  }
  // For filter - PRODUCT TYPE
  if (this.selectedPType != "" && this.selectedPType != 'Product Type') {

    const productArr = this.selectedPType.split(',').map(arg => arg.trim().toLowerCase());
    if (productArr.length == this.productTypeData.length) {
      this.selectedPType = "";
    }
    else {
      // backupData = backupData.filter((s: any) => s.payoff.toString().toLowerCase()==this.selectedPType.toString().toLowerCase());
      backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase().includes(product) || s.PayOff.toLowerCase().includes(product.toLowerCase()))))
    }
  }
  // For filter - U/L TYPE
  if (this.selectedULType != "" && this.selectedULType != 'U/L Type') {

    const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
    if (ULArr.length == this.ulTypeData.length) {
      this.selectedULType = "";
    }
    else {
      // backupData = backupData.filter((s: any) => s.uL_Type.toString().toLowerCase().includes(this.selectedULType.toString().toLowerCase()));

      backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
    }
  }
  if (this.selectedUnderlying != "") {

    if (this.inBasketCheck) {
      const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase());
      backupData = backupData.filter((s: any) => underlyingToSearch.some(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase())))

    }
    else {
      backupData = backupData.filter((s: any) => (s.UL1.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount == "1")
    }
  }

  if (this.selectedGroup != "") {
    if(this.selectedGroup === 'NONE'){
      backupData = [];
    }
    else{
      const groupSelArr = this.selectedGroup.split(',');
      if(groupSelArr.length === this.groupArr.length ){
        this.selectedGroup = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
      }
    }
  }

  if (this.selectedClient != "") {
    if(this.selectedClient === 'NONE'){
      backupData = [];
    }
    else{
      const clientSelArr = this.selectedClient.split(',');
      if(clientSelArr.length === this.clientArr.length ){
        this.selectedClient = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
      }
    }
  }

  if (this.selectedIntRef != "") {
    if(this.selectedIntRef === 'NONE'){
      backupData = [];
    }
    else{
      const intRefSelArr = this.selectedIntRef.split(',');
      if(intRefSelArr.length === this.intRefArr.length ){
        this.selectedIntRef = "";
      }
      else {
        // backupData = backupData.filter((s: any) => intRefSelArr.some(intRef => (s.Internal_J.toString().toLowerCase() === intRef.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
      }
    }
  }

  if (this.selectedType !== '') {
    if(this.selectedType === 'NONE'){
      backupData = [];
    }
    else{
      const typeSelArr = this.selectedType.split(',');
      if(typeSelArr.length === this.typeArr.length ){
        this.selectedType = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(typeSelArr, s.Type));
      }
    }
  }

  if (this.selectedTutela !== '' ) {
    if(this.selectedTutela === 'NONE'){
      backupData = [];
    }
    else{
      const tutelaSelArr = this.selectedTutela.split(',');
      if(tutelaSelArr.length === this.tutelaArr.length ){
        this.selectedTutela = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
      }
    }
  }


  if (this.selectedSubtutela !== '') {
    if(this.selectedSubtutela === 'NONE'){
      backupData = [];
    }
    else{
      const subtutelaSelArr = this.selectedSubtutela.split(',');
      if(subtutelaSelArr.length === this.subtutelaArr.length ){
        this.selectedSubtutela = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(subtutelaSelArr, s.Subtutela));
      }
    }
  }

  if (this.selectedBranch !== '') {
    if(this.selectedBranch === 'NONE'){
      backupData = [];
    }
    else{
      const branchSelArr = this.selectedBranch.split(',');
      if(branchSelArr.length === this.branchArr.length ){
        this.selectedBranch = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(branchSelArr, s.Branch));
      }
    }
  }


  if (this.selectedTerritory !== '') {
    if(this.selectedTerritory === 'NONE'){
      backupData = [];
    }
    else{
      const territorySelArr = this.selectedTerritory.split(',');
      if(territorySelArr.length === this.territoryArr.length ){
        this.selectedTerritory = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(territorySelArr, s.Territory));
      }
    }
  }

  if (this.selectedZone !== '') {
    if(this.selectedZone === 'NONE'){
      backupData = [];
    }
    else{
      const zoneSelArr = this.selectedZone.split(',');
      if(zoneSelArr.length === this.zoneArr.length ){
        this.selectedZone = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(zoneSelArr, s.Zone));
      }
    }
  }

  this.current_CapAtRisk_StartValue = this.startCapAtRiskValue
  this.current_CapAtRisk_LastValue = 100 //this.endCancelProbValue

  this.current_CancelProb_StartValue = this.startCancelProbValue
  this.current_CancelProb_LastValue = 100 //this.endCancelProbValue

  this.current_BarrierD_StartValue = this.startBarrierDValue
  this.current_BarrierD_LastValue = this.endBarrierDValue //this.endCancelProbValue

  this.current_IndVal_StartValue = this.startIndValValue
  this.current_IndVal_LastValue = this.endIndValValue //this.endCancelProbValue

  this.external = [...new Set(backupData.map(x => x.External))];
  backupAggregatedNotional.forEach((val) => {
    if (this.external.length > 0 && !this.external.includes(val.ExternalRef)) {
      val.Nominal = 0;
      val.EURNominal = 0;
    }
  })
  this.filteredBackData=backupData;
    this.initialDataRes = backupData;
  this.notionalDataRes = backupAggregatedNotional;
  if (this.chart) {
    if (this.level == 3) {
      this.extractDataByYear(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataByYear;
    }
    else if (this.level == 2) {
      this.extractDataByMonths(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataByMonths;
    }
    else if (this.level == 1) {
      this.extractDataByWeeks(this.notionalDataRes, 'Mon');
      this.chart.data.datasets[0].data = this.notionalDataByWeek;
    }
    else if (this.level == 0) {
      this.extractDataByDates(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataDays;
    }
    let chartData = this.chart.data.datasets[0].data;
    let labels = this.chart.data.xLabels;
    this.minVal = this.chart.scales.x.min;
    this.maxVal = this.chart.scales.x.max;
    if(this.chart){
      this.chart.destroy();
    }
    if (this.subpages[1].ActiveYN==true){
      this.createAggregatedNotionalGraph();
      this.chart.data.datasets[0].data = chartData;
      this.chart.data.xLabels = labels;
      this.chart.update();
    }

  }
  //this.generateDates();
  this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
  this.calculateInitialData();
  this.setSlidersValue();
  this.loader = false;
  // this.getMonthwiseNotifications(this.selectedMonth,this.selectedYear);
  }, );
    this.clearClientFilter = true;
}

async clearProduct() {
  this.loader = true
  this.refreshed = true;
  this.selectedFormat='';
  this.selectedCurrency='';
  this.selectedPType='';
  this.selectedULType='';
  this.selectedUnderlying='';
  this.inBasketCheck=true;
  this.LiveCheck=true;
  this.DeadCheck=false;
  setTimeout(() => {
  let date;

  let backupData = this.dataForFilter;

  this.formatData=backupData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
  this.formatData=[...new Set(this.formatData)];

  this.currencyData=backupData.map(item=>item["SettleCcy"]).sort((a,b) => a > b ? 1 : -1);
  this.currencyData=[...new Set(this.currencyData)];

  this.productTypeData=backupData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
  this.productTypeData=[...new Set(this.productTypeData)];

  this.ulTypeData=backupData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
  this.ulTypeData=[...new Set(this.ulTypeData)];
  // let backupNotificationData = this.notificationDataForFilter;
  let backupAggregatedNotional = [];
  for (let i of this.aggregatedFilter) {
    backupAggregatedNotional.push(Object.assign({}, i));
  }

  if (this.LiveCheck && !this.DeadCheck) {
    backupData = backupData.filter((s: any) => s.AliveYN == "Alive");
    // backupNotificationData = backupNotificationData.filter((s:any)=>this.ldMap.get(s.ExternalID)=="Alive");
  }
  if (this.DeadCheck && !this.LiveCheck) {
    backupData = backupData.filter((s: any) => s.AliveYN != "Alive");
    // backupNotificationData = backupNotificationData.filter((s:any)=>this.ldMap.get(s.ExternalID)=="Dead");
  }
  if (!this.LiveCheck && !this.DeadCheck) {
    backupData = backupData.filter((s: any) => (s.AliveYN == "Alive" && s.AliveYN != "Alive"));
    // backupNotificationData = backupNotificationData.filter((s:any)=>(this.ldMap.get(s.ExternalID)=="Alive" && this.ldMap.get(s.ExternalID)=="Dead"));
  }

  if (this.selectedExternal != "") {
    const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase());
    backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))
  }

 

  if (this.selectedGroup != "") {
    if(this.selectedGroup === 'NONE'){
      backupData = [];
    }
    else{
      const groupSelArr = this.selectedGroup.split(',');
      if(groupSelArr.length === this.groupArr.length ){
        this.selectedGroup = "";
      }
      else {
        // backupData = backupData.filter((s: any) => groupSelArr.some(group => (s.Group.toString().toLowerCase() === group.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
      }
    }
  }
  if (this.selectedClient != "") {
    if(this.selectedClient === 'NONE'){
      backupData = [];
    }
    else{
      const clientSelArr = this.selectedClient.split(',');
      if(clientSelArr.length === this.clientArr.length ){
        this.selectedClient = "";
      }
      else {
        // backupData = backupData.filter((s: any) => clientSelArr.some(client => (s.Client.toString().toLowerCase() === client.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
      }
    }
  }

  if (this.selectedIntRef != "") {
    if(this.selectedIntRef === 'NONE'){
      backupData = [];
    }
    else{
      const intRefSelArr = this.selectedIntRef.split(',');
      if(intRefSelArr.length === this.intRefArr.length ){
        this.selectedIntRef = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
      }
    }
  }

  if (this.selectedType !== '') {
    if(this.selectedType === 'NONE'){
      backupData = [];
    }
    else{
      const typeSelArr = this.selectedType.split(',');
      if(typeSelArr.length === this.typeArr.length ){
        this.selectedType = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(typeSelArr, s.Type));
      }
    }
  }

  if (this.selectedTutela !== '' ) {
    if(this.selectedTutela === 'NONE'){
      backupData = [];
    }
    else{
      const tutelaSelArr = this.selectedTutela.split(',');
      if(tutelaSelArr.length === this.tutelaArr.length ){
        this.selectedTutela = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
      }
    }
  }

  if (this.selectedSubtutela !== '') {
    if(this.selectedSubtutela === 'NONE'){
      backupData = [];
    }
    else{
      const subtutelaSelArr = this.selectedSubtutela.split(',');
      if(subtutelaSelArr.length === this.subtutelaArr.length ){
        this.selectedSubtutela = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(subtutelaSelArr, s.Subtutela));
      }
    }
  }

  if (this.selectedBranch !== '') {
    if(this.selectedBranch === 'NONE'){
      backupData = [];
    }
    else{
      const branchSelArr = this.selectedBranch.split(',');
      if(branchSelArr.length === this.branchArr.length ){
        this.selectedBranch = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(branchSelArr, s.Branch));
      }
    }
  }

  if (this.selectedTerritory !== '') {
    if(this.selectedTerritory === 'NONE'){
      backupData = [];
    }
    else{
      const territorySelArr = this.selectedTerritory.split(',');
      if(territorySelArr.length === this.territoryArr.length ){
        this.selectedTerritory = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(territorySelArr, s.Territory));
      }
    }
  }


  if (this.selectedZone !== '') {
    if(this.selectedZone === 'NONE'){
      backupData = [];
    }
    else{
      const zoneSelArr = this.selectedZone.split(',');
      if(zoneSelArr.length === this.zoneArr.length ){
        this.selectedZone = "";
      }
      else {
        backupData = backupData.filter((s: any) => this.binarySearch(zoneSelArr, s.Zone));
      }
    }
  }

  // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
  if (this.selectedCapAtRisk) {
    backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue && s.CapAtRisk <= this.current_CapAtRisk_LastValue)
  }
  if (this.selectedCancelProb) {
    backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue && s.CancelProb <= this.current_CancelProb_LastValue)
  }
  if (this.selectedBarDist) {
    backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue && s.KI_Distance <= this.current_BarrierD_LastValue)
  }
  if (this.selectedIndVal) {
    backupData = backupData.filter((s: any) => s.MTMPerc >= this.current_IndVal_StartValue && s.MTMPerc <= this.current_IndVal_LastValue)
  }
  // Added by MuditB || 30-Aug-23 || End || SlidersFilter
  if (this.selectedMaturityIn != "") {

    date = new Date();
    date.setDate(date.getDate() + parseInt(this.selectedMaturityIn));
    backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
  }
  if (this.selectedObservationIn != "") {
    date = new Date();
    date.setDate(date.getDate() + parseInt(this.selectedObservationIn));;
    backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
  }
  if (this.selectedCancelDateIn != "") {
    date = new Date();
    date.setDate(date.getDate() + parseInt(this.selectedCancelDateIn));
    backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
  }

  if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
    backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) >= (new Date(this.StartDateDisplay)))
  }
  if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
    backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) <= (new Date(this.EndDateDisplay)))
  }

  this.external = [...new Set(backupData.map(x => x.External))];
  backupAggregatedNotional.forEach((val) => {
    if (this.external.length > 0 && !this.external.includes(val.ExternalRef)) {
      val.Nominal = 0;
      val.EURNominal = 0;
    }
  })
  this.filteredBackData=backupData;
    this.initialDataRes = backupData;
  this.notionalDataRes = backupAggregatedNotional;
  if (this.chart) {
    if (this.level == 3) {
      this.extractDataByYear(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataByYear;
    }
    else if (this.level == 2) {
      this.extractDataByMonths(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataByMonths;
    }
    else if (this.level == 1) {
      this.extractDataByWeeks(this.notionalDataRes, 'Mon');
      this.chart.data.datasets[0].data = this.notionalDataByWeek;
    }
    else if (this.level == 0) {
      this.extractDataByDates(this.notionalDataRes);
      this.chart.data.datasets[0].data = this.notionalDataDays;
    }
    let chartData = this.chart.data.datasets[0].data;
    let labels = this.chart.data.xLabels;
    this.minVal = this.chart.scales.x.min;
    this.maxVal = this.chart.scales.x.max;
    if(this.chart){
      this.chart.destroy();
    }

    if (this.subpages[1].ActiveYN==true){
      this.createAggregatedNotionalGraph();
      this.chart.data.datasets[0].data = chartData;
      this.chart.data.xLabels = labels;
      this.chart.update();
    }
  }
  //this.generateDates();
  this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
  this.calculateInitialData();
  this.setSlidersValue();
  this.loader = false;
  // this.getMonthwiseNotifications(this.selectedMonth,this.selectedYear);
  }, );

}

async clearClient() {
  this.loader = true;
  
  this.selectedGroup='';
  this.selectedClient = '';
  this.selectedIntRef = '';
  this.selectedType= '';
  this.selectedTutela= '';
  this.selectedSubtutela= '';
  this.selectedBranch= '';
  this.selectedTerritory= '';
  this.selectedZone= '';
  setTimeout(() => {
    let date;
    let backupData = this.dataForFilter;
    // let backupNotificationData = this.notificationDataForFilter;
    let backupAggregatedNotional = [];
    for (let i of this.aggregatedFilter) {
      backupAggregatedNotional.push(Object.assign({}, i));
    }

    if (this.LiveCheck && !this.DeadCheck) {
      backupData = backupData.filter((s: any) => s.AliveYN == "Alive");
    }
    if (this.DeadCheck && !this.LiveCheck) {
      backupData = backupData.filter((s: any) => s.AliveYN != "Alive");
    }
    if (!this.LiveCheck && !this.DeadCheck) {
      backupData = backupData.filter((s: any) => (s.AliveYN == "Alive" && s.AliveYN != "Alive"));
    }

    if (this.selectedExternal != "") {
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase());
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))

    }
    if (this.selectedFormat != "" && this.selectedFormat != 'Format') {
      const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());
      if (formatArr.length == this.formatData.length) {
        this.selectedFormat = "";
      }
      else {
        backupData = backupData.filter((s: any) => formatArr.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
      }
    }

    if (this.selectedCurrency != "" && this.selectedCurrency != 'Currency') {
      const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
      if (currencyArr.length == this.currencyData.length) {
        this.selectedCurrency = "";
      }
      else {
        backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.SettleCcy?.toString().toLowerCase().includes(currency) || s.SettleCcy.toLowerCase().includes(currency.toLowerCase()))))
      }
    }
    // For filter - PRODUCT TYPE
    if (this.selectedPType != "" && this.selectedPType != 'Product Type') {
      const productArr = this.selectedPType.split(',').map(arg => arg.trim().toLowerCase());
      if (productArr.length == this.productTypeData.length) {
        this.selectedPType = "";
      }
      else {
        backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase().includes(product) || s.PayOff.toLowerCase().includes(product.toLowerCase()))))
      }
    }
    // For filter - U/L TYPE
    if (this.selectedULType != "" && this.selectedULType != 'U/L Type') {

      const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
      if (ULArr.length == this.ulTypeData.length) {
        this.selectedULType = "";
      }
      else {
        backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
      }
    }
    if (this.selectedUnderlying != "") {

      if (this.inBasketCheck) {
        const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase());
        backupData = backupData.filter((s: any) => underlyingToSearch.some(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase())))

      }
      else {
        backupData = backupData.filter((s: any) => (s.UL1.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount == "1")
      }
    }

    if (this.selectedCapAtRisk) {
      backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue && s.CapAtRisk <= this.current_CapAtRisk_LastValue)
    }
    if (this.selectedCancelProb) {
      backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue && s.CancelProb <= this.current_CancelProb_LastValue)
    }
    if (this.selectedBarDist) {
      backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue && s.KI_Distance <= this.current_BarrierD_LastValue)
    }
    if (this.selectedIndVal) {
      backupData = backupData.filter((s: any) => s.MTMPerc >= this.current_IndVal_StartValue && s.MTMPerc <= this.current_IndVal_LastValue)
    }

    if (this.selectedMaturityIn != "") {

      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedMaturityIn));
      backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
    }
    if (this.selectedObservationIn != "") {
      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedObservationIn));;
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }
    if (this.selectedCancelDateIn != "") {
      date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedCancelDateIn));
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) >= (new Date(this.StartDateDisplay)))
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Issue_Date)) <= (new Date(this.EndDateDisplay)))
    }

    this.external = [...new Set(backupData.map(x => x.External))];
    backupAggregatedNotional.forEach((val) => {
      if (this.external.length > 0 && !this.external.includes(val.ExternalRef)) {
        val.Nominal = 0;
        val.EURNominal = 0;
      }
    })

    if(this.groupArr)
      this.groupArr.forEach((el)=>el.checked = true);
    if(this.clientArr)
      this.clientArr.forEach((el)=>el.checked = true);
    if(this.intRefArr)
      this.intRefArr.forEach((el)=>el.checked = true);
    if(this.typeArr)
      this.typeArr.forEach((el)=>el.checked = true);
    if(this.tutelaArr)
      this.tutelaArr.forEach((el)=>el.checked = true);
    if(this.subtutelaArr)
      this.subtutelaArr.forEach((el)=>el.checked = true);
    if(this.branchArr)
      this.branchArr.forEach((el)=>el.checked = true);
    if(this.territoryArr)
      this.territoryArr.forEach((el)=>el.checked = true);
    if(this.zoneArr)
      this.zoneArr.forEach((el)=>el.checked = true);
    this.clearClientFilter = true;
    this.filteredBackData=backupData;
        this.initialDataRes = backupData;
    this.notionalDataRes = backupAggregatedNotional;
    if (this.chart) {
      if (this.level == 3) {
        this.extractDataByYear(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByYear;
      }
      else if (this.level == 2) {
        this.extractDataByMonths(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByMonths;
      }
      else if (this.level == 1) {
        this.extractDataByWeeks(this.notionalDataRes, 'Mon');
        this.chart.data.datasets[0].data = this.notionalDataByWeek;
      }
      else if (this.level == 0) {
        this.extractDataByDates(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataDays;
      }
      let chartData = this.chart.data.datasets[0].data;
      let labels = this.chart.data.xLabels;
      this.minVal = this.chart.scales.x.min;
      this.maxVal = this.chart.scales.x.max;
      if(this.chart){
        this.chart.destroy();
      }
      if (this.subpages[1].ActiveYN==true){
        this.createAggregatedNotionalGraph();
        this.chart.data.datasets[0].data = chartData;
        this.chart.data.xLabels = labels;
        this.chart.update();
      }

    }
    //this.generateDates();
    this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
    this.calculateInitialData();
    this.setSlidersValue();
    this.loader = false;
    }, );
   
}

  selectDate(date) {
    try {
      if (date !== '') {
        this.StartDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.StartDateDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.StartDate = undefined;
        this.StartDateDisplay = undefined;
      }
    } catch (error) { }
  }

  selectEndDate(date) {
    try {
      if (date !== '') {
        this.EndDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.EndDateDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.EndDate = undefined;
        this.EndDateDisplay = undefined;
      }
    } catch (error) { }
  }

  inputchange(event, num, startValue, endValue) {
    if (event.target.value.length === 0) {
      if (num === 1)
        event.target.value = startValue
      else if (num === 2)
        event.target.value = endValue
    }
    if (parseFloat(event.target.value) < startValue)
      event.target.value = startValue
    else if (parseFloat(event.target.value) > endValue)
      event.target.value = endValue
  }

  binder(event) {
    switch (event.target.name) {
      case "CapAtRisk-input1":
        this.current_CapAtRisk_StartValue = parseFloat(event.target.value);
        this.inputchange(event, 1, this.startCapAtRiskValue, this.endCapAtRiskValue);
        break;
      case "CapAtRisk-input2":
        this.current_CapAtRisk_LastValue = parseFloat(event.target.value);
        this.inputchange(event, 2, this.startCapAtRiskValue, this.endCapAtRiskValue);
        break;
      case "CancelProb-input1":
        this.current_CancelProb_StartValue = parseFloat(event.target.value);
        this.inputchange(event, 1, this.startCancelProbValue, this.endCancelProbValue);
        break;
      case "CancelProb-input2":
        this.current_CancelProb_LastValue = parseFloat(event.target.value);
        this.inputchange(event, 2, this.startCancelProbValue, this.endCancelProbValue);
        break;
      case "BarrierD-input1":
        this.current_BarrierD_StartValue = parseFloat(event.target.value);
        this.inputchange(event, 1, this.startBarrierDValue, this.endBarrierDValue);
        break;
      case "BarrierD-input2":
        this.current_BarrierD_LastValue = parseFloat(event.target.value)
        this.inputchange(event, 2, this.startBarrierDValue, this.endBarrierDValue);
        break;
      case "IndVal-input1":
        this.current_IndVal_StartValue = parseFloat(event.target.value);
        this.inputchange(event, 1, this.startIndValValue, this.endIndValValue);
        break;
      case "IndVal-input2":
        this.current_IndVal_LastValue = parseFloat(event.target.value);
        this.inputchange(event, 2, this.startIndValValue, this.endIndValValue);
        break;
    }
  }
  //Added by Jyoti S || 21-Sep-2023 || START
  copyNotificationExternal() {
    try {
      let external: any = this.notificatonPopUpArr.map(element => element["ExternalID"])
      external = [...new Set(external)];
      this.copyText(external);
      //Added by Apurva || success message || 27-Sep-2023
      this.showSuccessMessage = true;
      this.showMessageXML = "Externals Copied Successfully!";
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } catch (error) {

    }
  }
  //Added by Jyoti S || 21-Sep-2023 || END

  //Added by Jyoti S || 21-Nov-2023 || START
  copyNotificationISIN() {
    try {
      let ISIN: any = this.notificatonPopUpArr.filter(element => element["ISIN"]).map(e=>e["ISIN"])
      ISIN = [...new Set(ISIN)];
      this.copyText(ISIN);
      this.showSuccessMessage = true;
      this.showMessageXML = "ISINs Copied Successfully!";
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } catch (error) {
    }
  }
  //Added by Jyoti S || 21-Nov-2023 || END

  getFilterwiseNotifications() {
    let arr = this.notificationDataTempArr;
    if (this.eventTypeNotification != "" && this.eventTypeNotification != 'Select Event Type') {
      const selectedEventArr = this.eventTypeNotification.split(',').map(arg => arg.trim().toLowerCase());
      if (selectedEventArr.length == this.eventTypeArr.length) {
        this.eventTypeNotification = "";
        this.getFilterwiseNotifications();
      }
      else {
        arr = arr.filter((s: any) => selectedEventArr.some(event => (s.event.toString().toLowerCase().includes(event) || s.event.toLowerCase().includes(event.toLowerCase()))));
      }
    }
    this.notificatonArr = arr;
    this.noOfRecords = arr.length;
    if (this.noOfRecords == 0)
      this.pageFirstRecord = 0;
    else
      this.pageFirstRecord = 1;
    this.pageNo = 0;

    this.pageLastRecord = Math.min(this.pageSize, this.noOfRecords);
  }

  changeNotificationsCount(month: any = this.currentDate.getMonth(), year: any = this.currentDate.getFullYear()) {
    const date = new Date(year, month, 1); // Create a Date object for the first day of the month
    const startingDayOfWeek = (date.getDay() + 6) % 7;
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const weeks = Math.ceil((totalDaysInMonth + startingDayOfWeek) / 7);
    let el = document.querySelector('table');
    let el2: HTMLElement = document.querySelector('.custom-pagination');
    if (weeks == 6) {
      this.pageSize = 6;
      el.style.fontSize = '13px';
      el2.style.fontSize = '13px';
    }
    else if (weeks == 5) {
      el.style.fontSize = '14px';
      el2.style.fontSize = '14px';
      this.pageSize = 8;
    }
    else if (weeks == 4) {
      this.pageSize = 10;
    }
  }

  createUnderlyingChart(sortedSummary: any) {

    //END || Added by Varsha G || sorting concentration chart data || 21-sep-23
    this.underlyings = new Chart("underlyings", {
      type: 'doughnut',
      data: {
        labels: Array.from(sortedSummary.keys()),
        datasets: [{
          label: '',
          data: Array.from(sortedSummary.values()),
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 0,
          hoverOffset: 10,
        }]
      },
      options: {
        //animation:false,
        cutout: "60%",
        //radius: 140,//Changed by Apurva K from 120 to 160
        radius: "90%", //Changed by Jyoti S || 07-Sept-2023
        plugins: {
          legend: {
            title: {
              //text: "Currency",
              display: true,
              color: 'rgb(148, 148, 148)',
              position: 'start',
              font: {
                size: 16
              }
            },
            position: 'bottom',
            labels: {
              font: {
                size: 13
              },
              color: 'rgb(148, 148, 148)',
              usePointStyle: true,
              filter: function (legendItem, data) {
                var index = legendItem.index;
                if (index < 5) {
                  return true;
              }

            },//Added by Jyoti S || To display only top 5 legends || 14-Sep-2023
            }
          },
          datalabels: {
            display: false
          },
        },
        layout: {
          padding: 10
        }
      }
    });
  }

  createConcentrationGraph() {
    this.totalNotional = new Chart("totalNotional", {
      type: 'doughnut',
      data: {
        labels: Array.from(this.SectorChartData.keys()),
        datasets: [{
          label: this.measure,
          data: Array.from(this.SectorChartData.values()),
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 0,
          hoverOffset: 10,
        }]
      },
      options: {
        // animation:false,
        onClick: (evt, item) => {
          //console.log ('legend onClick', evt);
          this.selectedIndex = item[0].index;
          this.selectedConcentration = Array.from(this.SectorChartData.keys())[this.selectedIndex];
          this.getUnderlyingDataChart(this.selectedConcentration);
          this.totalNotional.update();
        },
        cutout: "60%",
        //radius: 140,//Changed by Apurva K from 140 to 160
        radius: "90%", //Changed by Jyoti S || 07-Sept-2023
        plugins: {
          // tooltip: {
          //   mode: 'point',
          //   enabled: false,
          //   position: 'nearest',
          //   external: this.externalTooltipHandler
          // },
          legend: {
            title: {
              //text: "Currency",
              display: true,
              color: 'rgb(148, 148, 148)',
              position: 'start',
              font: {
                size: 16
              }
            },
            position: 'bottom',

            labels: {
              font: {
                size: 13 
              },
              color: 'rgb(148, 148, 148)',
              usePointStyle: true,
              filter: function (legendItem, data) {
                
                  if(legendItem.index < 4 && (data['labels'].slice(0,legendItem.index+1).join('').length <= 60 )){
                  return true
                }

              },//Added by Jyoti S || To display only top 5 legends || 14-Sep-2023
            },

          },
          datalabels: {
            display: false
          },

      },
      layout: {
        padding: 10
      }
    }
  });
}

createAggregatedNotionalGraph(){
  this.chart = new Chart("chart", {
    type: 'bar',
    data: {
      xLabels: this.maturityDatesArr,
      datasets: [{
        label: 'Notional',
        data: this.totalNotionalWrtDateArr,
        //backgroundColor: 'rgba(6, 146, 143,1)',
        // backgroundColor: this.colors,
        backgroundColor: this.getColors(),
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)'
          // ],
        borderColor : this.colors,
      }
      ],
    },
    options: {
      //animation:false,
      onHover: (evt, item, context) => {
        //console.log ('legend onClick', evt);
        // if(item[0])
        //   this.curbar = item[0].index + 1;
        // else 
        //   this.curbar = null;
      },
      layout: {
        padding: {
          top:-10,
          bottom:20,
          left:20,
          right:20
        }
        
      },

      responsive: true,
      maintainAspectRatio: false,
      datasets: {
        bar: {
          barPercentage: 1,
          categoryPercentage: 0.6,
          barThickness: 'flex',
          maxBarThickness: 200
        }
      },
      scales: {
        y: {
          ticks: {
            padding: 20,
            crossAlign: 'near',
            // color: '#9BC3D3',
            color: '#87AEBE',
            
            font: {
              size: 13
            }
          },
          border: {
            color: 'white',
            dash: [1, 5],
            display: false
          },
          grid: {
            color: '#808080',
            drawTicks: false,
          },
          title: {
            color: 'rgb(148, 148, 148)',
            display: true,
            text: 'Notional Aggregated by Maturity',
            font: {
              size: 15
            }
          },
          beginAtZero: true,
          min: 0,
          //max: Math.round(this.maxElement+10)
        },
        x: {
          ticks: {
            //color: '#774b8c',
            //color : '#EC0000',
            // color: '#9BC3D3',
            color: '#87AEBE',
            font: {
              size: 13
            },
            stepSize: 1,
          },
          min: this.minVal,
          max: this.maxVal,
          //max:120,
          title: {
            color: 'rgb(148, 148, 148)',
            display: true,
            text: 'Maturity Date',
            font: {
              size: 15
            },

          },
          border: {
            display: false,
            color: 'white',
          }
        },

      },

      plugins: {
        // zoom :{
        //   pan:{
        //     enabled: true,
        //     mode : 'x',
        //   },
        //   zoom: {
        //     wheel: {
        //       enabled: true
        //    },
        //    mode: 'x'
        //   },
        // },
        title: {
          color : 'rgb(148, 148, 148)',
         // color : this.textColor,
          display: true,
          text: "By " + this.labels[this.level],
          position: 'top',
          // padding:10,
          font: {
           size: 17,
            },
          },
        datalabels: {
          clip: true,
          clamp: true,
          anchor: 'end',
          align: 'top',
          color: 'white',
          font: {
            size: 12
          },
          formatter : function(value){
            return "";
            // return new Intl.NumberFormat().format(value)"";
          },
        },

        legend: {
          title: {
            display: true,
            color: 'rgb(148, 148, 148)',
            position: 'start',
            font: {
              size: 16
            }
          },
          position: 'right',
          align:'start',
          labels: {
            color: 'rgb(148, 148, 148)',
            usePointStyle: true,
            font: {
              size: 15
            },
            filter: function(legendItem, data) {
              var index = legendItem.index;
              if (index < 5)
              {
                return true;
            }

          },//Added by Jyoti S || To display only top 5 legends || 14-Sep-2023
          }
        }
      }

    },
  });
  this.loader = false;
}

  binarySearch(arr: any, x: any) {
    let l = 0,
      r = arr.length - 1;
    while (l <= r) {
      let m = l + Math.floor((r - l) / 2);
      let res = x.localeCompare(arr[m]);
      if (res == 0)
        return true;
      if (res > 0)
        l = m + 1;
      else
        r = m - 1;
    }
    return false;
  }

  clientFilterData(event){
    try{
      this.loader = true;
       setTimeout(()=>{ 
        switch(event[0].split(':')[0]){
        case 'Group':
          this.selectedGroup = event[0].split(':')[1];
          this.selectedType = '';
          this.selectedTutela = '';
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Client':
          this.selectedClient = event[0].split(':')[1];
          break;
        case 'Internal Ref./J':
          this.selectedIntRef = event[0].split(':')[1];
          break;
        case 'Type':
          this.selectedType = event[0].split(':')[1];
          this.selectedTutela = '';
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Tutela':
          this.selectedTutela = event[0].split(':')[1];
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Subtutela':
          this.selectedSubtutela = event[0].split(':')[1];
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Branch':
          this.selectedBranch = event[0].split(':')[1];
          break;
        case 'Territory':
          this.selectedTerritory = event[0].split(':')[1];
          this.selectedZone = '';
          this.selectedBranch = '';
          break;
        case 'Zone':
          this.selectedZone = event[0].split(':')[1];
          this.selectedBranch = '';
          break;
        default:
          break;
      }
      this.FilterForAll();
      this.setClientFilters(event[0].split(':')[0]);
      this.clearClientFilter = false;
      this.loader = false;
    },);
  }
    catch(er){

    }
  }

  AllFilter(event){
    this.loader= true;
    setTimeout(() => {
      this.FilterForAll(event)
      this.loader = false;
    }, );
  }

  setClientFilters(filter: string){
    try{
            // if(filter !== "Group") {
      //   this.groupArr = [];
      //   [...new Set(this.filteredBackData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
      //     let newObj = {
      //       value : el,
      //       checked : true
      //     };
      //     this.groupArr.push(newObj);
      //   });
      // }
            if(filter === "Group" || filter === "Type"  || filter === "Tutela" || filter === "Subtutela") {
        this.clientArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.clientArr.push(newObj);
        });
      }
      if(filter === "Group" || filter === "Type"  || filter === "Tutela" || filter === "Subtutela") {
        this.intRefArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.intRefArr.push(newObj);
        });
      }
      if(filter === "Group") {
        this.typeArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.typeArr.push(newObj);
        });
      }
      if(filter === "Group" || filter === "Type" ) {
        this.tutelaArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.tutelaArr.push(newObj);
        });
        // this.tutelaArr.length == 1 ? this.selectedTutela = this.tutelaArr[0]: '';
              }
      if(filter === "Group" || filter === "Type"  || filter === "Tutela") {
        this.subtutelaArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.subtutelaArr.push(newObj);
        });
      }
      if(filter === "Territory" || filter === "Zone") {
        this.branchArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.branchArr.push(newObj);
        });
      }
      if(filter === "Territory") {
        this.zoneArr = [];
        [...new Set(this.filteredBackData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.zoneArr.push(newObj);
        });
      }
    }
    catch(error){

    }
  }

  clearAllFilters(){
    this.loader = true;
    this.refreshed = true;
    this.showDropdown = false;
    this.viewName = '';
    this.selectedGroup = '';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType = '';
    this.selectedTutela = '';
    this.selectedSubtutela = '';
    this.selectedBranch = '';
    this.selectedTerritory = '';
    this.selectedZone = '';
    this.selectedFormat = '';
    this.selectedCurrency = '';
    this.selectedPType = '';
    this.selectedULType = '';
    this.selectedExternal = '';
    this.selectedUnderlying = '';
    this.StartDate = "";
    this.StartDateDisplay = "";
    this.EndDateDisplay = "";
    this.EndDate = "";
    this.selectedMaturityIn = "";
    this.selectedObservationIn = "";
    this.selectedACIn = "";
    this.selectedCancelDateIn = "";
    //Resetting Flags
    this.selectedCapAtRisk = false;
    this.selectedCancelProb = false;
    this.selectedBarDist = false;
    this.selectedIndVal = false;
    this.inBasketCheck = true;
    this.LiveCheck = true;
    this.DeadCheck = false;
    this.eventTypeNotification = '';

    this.current_CapAtRisk_StartValue = this.startCapAtRiskValue
    this.current_CapAtRisk_LastValue = 100 //this.endCancelProbValue

    this.current_CancelProb_StartValue = this.startCancelProbValue
    this.current_CancelProb_LastValue = 100 //this.endCancelProbValue

    this.current_BarrierD_StartValue = this.startBarrierDValue
    this.current_BarrierD_LastValue = this.endBarrierDValue //this.endCancelProbValue
  
    this.current_IndVal_StartValue = this.startIndValValue
    this.current_IndVal_LastValue = this.endIndValValue //this.endCancelProbValue

    setTimeout(() => {

    let backupData = this.dataForFilter;

    this.formatData=backupData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
    this.formatData=[...new Set(this.formatData)];

    this.currencyData=backupData.map(item=>item["SettleCcy"]).sort((a,b) => a > b ? 1 : -1);
    this.currencyData=[...new Set(this.currencyData)];

    this.productTypeData=backupData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
    this.productTypeData=[...new Set(this.productTypeData)];

    this.ulTypeData=backupData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
    this.ulTypeData=[...new Set(this.ulTypeData)];
    this.groupArr = [];
    this.clientArr = [];
    this.intRefArr = [];
    this.typeArr = [];
    this.tutelaArr = [];
    this.subtutelaArr = [];
    this.branchArr = [];
    this.territoryArr = [];
    this.zoneArr = [];

    [...new Set(this.initialDataRes.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.groupArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.clientArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.intRefArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.typeArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.tutelaArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.subtutelaArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.branchArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.territoryArr.push(newObj);
    });
    [...new Set(this.initialDataRes.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
      let newObj = {
        value : el,
        checked : true
      };
      this.zoneArr.push(newObj);
    });

    // let backupNotificationData = this.notificationDataForFilter;
    let backupAggregatedNotional = [];
    for (let i of this.aggregatedFilter) {
      backupAggregatedNotional.push(Object.assign({}, i));
    }
    backupData = backupData.filter((s: any) => s.AliveYN == "Alive");

    this.external = [...new Set(backupData.map(x => x.External))];
    backupAggregatedNotional.forEach((val) => {
      if (this.external.length > 0 && !this.external.includes(val.ExternalRef)) {
        val.Nominal = 0;
        val.EURNominal = 0;
      }
    })

    if(this.groupArr)
    this.groupArr.forEach((el)=>el.checked = true);
    if(this.clientArr)
      this.clientArr.forEach((el)=>el.checked = true);
    if(this.intRefArr)
      this.intRefArr.forEach((el)=>el.checked = true);
    if(this.typeArr)
      this.typeArr.forEach((el)=>el.checked = true);
    if(this.tutelaArr)
      this.tutelaArr.forEach((el)=>el.checked = true);
    if(this.subtutelaArr)
      this.subtutelaArr.forEach((el)=>el.checked = true);
    if(this.branchArr)
      this.branchArr.forEach((el)=>el.checked = true);
    if(this.territoryArr)
      this.territoryArr.forEach((el)=>el.checked = true);
    if(this.zoneArr)
      this.zoneArr.forEach((el)=>el.checked = true);
    this.clearClientFilter = true;
    this.filteredBackData=backupData;
        this.initialDataRes = backupData;
    this.notionalDataRes = backupAggregatedNotional;
    if (this.chart) {
      if (this.level == 3) {
        this.extractDataByYear(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByYear;
      }
      else if (this.level == 2) {
        this.extractDataByMonths(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataByMonths;
      }
      else if (this.level == 1) {
        this.extractDataByWeeks(this.notionalDataRes, 'Mon');
        this.chart.data.datasets[0].data = this.notionalDataByWeek;
      }
      else if (this.level == 0) {
        this.extractDataByDates(this.notionalDataRes);
        this.chart.data.datasets[0].data = this.notionalDataDays;
      }
      let chartData = this.chart.data.datasets[0].data;
      let labels = this.chart.data.xLabels;
      this.minVal = this.chart.scales.x.min;
      this.maxVal = this.chart.scales.x.max;
      if(this.chart){
        this.chart.destroy();
      }
      if (this.subpages[1].ActiveYN==true){
        this.createAggregatedNotionalGraph();
        this.chart.data.datasets[0].data = chartData;
        this.chart.data.xLabels = labels;
        this.chart.update();
      }
    }
    //this.generateDates();
    this.getCurrentMonthCnt(this.selectedMonth, this.selectedYear);
    this.calculateInitialData();
    this.setSlidersValue();
    this.loader=false;

  })

  }

  setSlidersValue(){ 
    try {
      let maxCapAtRisk;
      let minCapAtRisk;
      let maxCancelProb;
      let minCancelProb;
      let maxKI;
      let minKI;
      let maxMTM;
      let minMTM;
if(this.filteredBackData.length > 0){
      let mtm:any[];
      let kI_Distance:any[];
      let capAtRisk:any[];
      let cancelProb:any[];
            // Capital risk
        if(!this.selectedCapAtRisk){
          capAtRisk=this.filteredBackData.map(item=>item["CapAtRisk"]);
          capAtRisk=[...new Set(capAtRisk)];
                  maxCapAtRisk = capAtRisk.reduce((a, b) => Math.max(a, b));
        minCapAtRisk = capAtRisk.reduce((a, b) => Math.min(a, b));
}
        
        //Cancel PRob
        if(!this.selectedCancelProb){
          cancelProb=this.filteredBackData.map(item=>item["CancelProb"]);
          cancelProb=[...new Set(cancelProb)];
          maxCancelProb = cancelProb.reduce((a, b) => Math.max(a, b));
          minCancelProb = cancelProb.reduce((a, b) => Math.min(a, b));
        }
        
        //BArrier Distance
        if(!this.selectedBarDist){
          kI_Distance = this.filteredBackData.filter((item) => {
            if (item["KIApplicable"] == "Y") {
              return item["KI_Distance"]
            }
           });
           if(kI_Distance.length > 0){
            kI_Distance = [...new Set(kI_Distance.map(item => item["KI_Distance"]))];
            maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
            minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
          }else{
            maxKI = 0;
            minKI = 0;
          }
        }
        
        //indicative value
        if(!this.selectedIndVal){
          mtm=this.filteredBackData.map(item=>item["MTMPerc"]);
          mtm=[...new Set(mtm)];
          maxMTM = mtm.reduce((a, b) => Math.max(a, b));
          minMTM = mtm.reduce((a, b) => Math.min(a, b));
        }
      }
      else{
        maxCapAtRisk = 0;
        minCapAtRisk = 0;
        maxCancelProb = 0;
        minCancelProb = 0;
        maxKI = 0;
        minKI = 0;
        maxMTM = 0;
        minMTM = 0;
      }

      // Capital risk
      if(!this.selectedCapAtRisk){
        this.startCapAtRiskValue = minCapAtRisk;
        this.endCapAtRiskValue = maxCapAtRisk;
        this.current_CapAtRisk_StartValue = this.startCapAtRiskValue;
        this.current_CapAtRisk_LastValue = this.endCapAtRiskValue;
        let opts1: Options = {
          floor: minCapAtRisk,
          ceil: maxCapAtRisk,
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
        this.options1=opts1;
        }

        
        //Cancel PRob
        if(!this.selectedCancelProb){
                  this.startCancelProbValue = minCancelProb;
        this.endCancelProbValue = maxCancelProb;
        this.current_CancelProb_StartValue = this.startCancelProbValue;
        this.current_CancelProb_LastValue = this.endCancelProbValue;
                let opts2: Options = {
          floor: minCancelProb,
          ceil: maxCancelProb,
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
        this.options2=opts2;
        }

        
        //BArrier Distance
        if(!this.selectedBarDist){
                        this.startBarrierDValue = minKI;
              this.endBarrierDValue = maxKI;
              this.current_BarrierD_StartValue = this.startBarrierDValue;
              this.current_BarrierD_LastValue = this.endBarrierDValue;
                        let opts3: Options = {
              floor: minKI,
              ceil: maxKI,
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
            this.options3=opts3;
                  }
        
        //indicative value
                if(!this.selectedIndVal){
                  this.startIndValValue = minMTM;
        this.endIndValValue = maxMTM;
        this.current_IndVal_StartValue = this.startIndValValue;
        this.current_IndVal_LastValue = this.endIndValValue;
        let opts4: Options = {
          floor: minMTM,
          ceil: maxMTM,
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
        this.options4=opts4;
      }

          } catch (error) { }
  }

  async GetPortfolio_View_Details(forDelete?:boolean, delViewName?:string)
  {
    this.loader=true;
    let ViewName
    delViewName? ViewName=delViewName:ViewName=this.viewName
    let PortfolioViews= await this.portfolioService.GetPortFolioViewDetails(AppConfig.settings.oRes?.userID,ViewName,"SEC");
    this.portolioDetails=PortfolioViews[0];
    if(!forDelete){
      this.setFilter();
    }
  }

  async SavePortfolio_View_Details()
  {
    
    let message:string=""
      this.loader=true;
      if(this.viewName=="" || this.viewName==undefined || this.viewName ==null){
        this.ViewFlag=true;
        message = "Please enter View name"
        this.showViewStatusPopupFunc(message);
        this.loader=false;
        return;
      }
      this.generateXML();
      let PortfolioViews= await this.portfolioService.SavePortFolioViewDetails(AppConfig.settings.oRes?.userID,this.viewName,this.viewXML,"SEC","","","");
      if(PortfolioViews['errorMessage'].includes("exists"))
        this.ViewFlag=true;
      else
        this.ViewFlag=false;
      this.showViewStatusPopupFunc(PortfolioViews['errorMessage']);
      this.loader=false;

      this.GetPortfolioViews();
  }

  async UpdatePortfolio_View_Details(){
  
    await this.GetPortfolioViews();
    this.loader=true;
    let message:string=""
    // Validation for View name
    if(this.viewName=="" || this.viewName==undefined || this.viewName ==null ){
      this.ViewFlag=true;
      message = "Please Enter View Name"
      this.showViewStatusPopupFunc(message);
      this.loader=false; 
      return;
    }
      await this.GetPortfolio_View_Details(true,this.viewName);
    this.generateXML();
    // Passing View ID performs  the update operation instead of save  
    let PortfolioViews= await this.portfolioService.SavePortFolioViewDetails(AppConfig.settings.oRes?.userID,this.viewName,this.viewXML,"SEC",this.portolioDetails['PV_ID'],"","");
    this.ViewFlag=false;
    this.showViewStatusPopupFunc(PortfolioViews['errorMessage']);
    this.loader=false;
    // this.viewName="";
    this.GetPortfolioViews();
  }

  async DeletePortfolio_View_Details(ViewName){
    this.loader=true;
    this.ViewFlag=true;
    await this.GetPortfolio_View_Details(true,ViewName);
    let message= await this.portfolioService.DeletePortFolioViews(AppConfig.settings.oRes?.userID,ViewName,this.portolioDetails['PV_ID'],"");
    this.showViewStatusPopupFunc(message['ErrorMsg']);
    this.loader=false;
    this.viewName="";
    this.GetPortfolioViews();
  }

  generateXML()
  {
    let filterXML=
      {
        "PV_ID": "",
        "ISIN_String": "",
        "Client": this.selectedClient,
        "J_Internal": this.selectedIntRef,
        "Tutela": this.selectedTutela,
        "Subtutela": this.selectedSubtutela,
        "Group": this.selectedGroup,
        "Type": this.selectedType,
        "Branch": this.selectedBranch,
        "Territory": this.selectedTerritory,
        "Zone": this.selectedZone,
        "Format": this.selectedFormat,
        "Currency": this.selectedCurrency,
        "Payoff": this.selectedPType,
        "ULString": this.selectedUnderlying,
        "BasketYN": this.inBasketCheck? 'Y':'N',
        "ULType": this.selectedULType,
        "LiveYN": this.LiveCheck? 'Y':'N',
        "DeadYN": this.DeadCheck? 'Y':'N',
        "Issue_From": this.StartDate,
        "Issue_To": this.EndDate,
        "Maturity_IN": this.selectedMaturityIn,
        "Observ_IN": this.selectedObservationIn,
        "Cancel_IN": this.selectedCancelDateIn,
        "CapAtRisk_min": this.current_CapAtRisk_StartValue,
        "CapAtRisk_max": this.current_CapAtRisk_LastValue,
        "CancelProb_min": this.current_CancelProb_StartValue,
        "CancelProb_max": this.current_CancelProb_LastValue,
        "KIDist_min": this.current_BarrierD_StartValue,
        "KIDist_max": this.current_BarrierD_LastValue,
        "MTM_min":this.current_IndVal_StartValue,
        "MTM_max": this.current_IndVal_LastValue,
        "Record_per_page":this.pageSize,
        "Sort": this.selectedSorting,
        "Sort_direction": this.direction
      }
    this.viewXML='<Details><Record>';
    for (let index = 0; index < this.sampleXML.length; index++) {
      const element = this.sampleXML[index];
      this.viewXML=this.viewXML+'<'+element+'>'+filterXML[element]+'</'+element+'>';
    }
    this.viewXML=this.viewXML+'</Record></Details>';
  }

  onBackspaceKeyUp(){
    if (this.viewName === '') {
      // this.refresh();
      this.clearAllFilters()
    }
  }

  setFilter()
  {
        this.selectedExternal=this.portolioDetails["ISIN_String"];
        this.selectedClient= this.portolioDetails["Client"];
        this.selectedIntRef= this.portolioDetails["J_Internal"];
        this.selectedTutela= this.portolioDetails["Class1"];
        this.selectedSubtutela= this.portolioDetails["Class2"];
        this.selectedGroup= this.portolioDetails["Class3"];
        this.selectedType= this.portolioDetails["Class4"];
        this.selectedBranch= this.portolioDetails["Loc1"];
        this.selectedTerritory= this.portolioDetails["Loc2"];
        this.selectedZone= this.portolioDetails["Loc3"];
        this.selectedFormat= this.portolioDetails["Format"];
        this.selectedCurrency= this.portolioDetails["Currency"];
        this.selectedPType= this.portolioDetails["Payoff"];
        this.selectedUnderlying= this.portolioDetails["ULString"];
        this.inBasketCheck = this.portolioDetails["BasketYN"]=="Y"? true:false;
        this.selectedULType= this.portolioDetails["ULType"];
        this.LiveCheck = this.portolioDetails["LiveYN"]=="Y"? true:false;
        this.DeadCheck= this.portolioDetails["DeadYN"]=="Y"? true:false;
        this.StartDate= this.datepipe.transform(this.portolioDetails["Issue_From"], 'yyyy-MM-dd')? this.datepipe.transform(this.portolioDetails["Issue_From"], 'yyyy-MM-dd') :"";
        this.StartDateDisplay = this.datepipe.transform(this.StartDate, 'dd-MMM-yyyy')? this.datepipe.transform(this.StartDate, 'dd-MMM-yyyy'):"" ;
        this.EndDate= this.datepipe.transform(this.portolioDetails["Issue_To"], 'yyyy-MM-dd')?  this.datepipe.transform(this.portolioDetails["Issue_To"], 'yyyy-MM-dd'):"";
        this.EndDateDisplay = this.datepipe.transform(this.EndDate, 'dd-MMM-yyyy')?this.datepipe.transform(this.EndDate, 'dd-MMM-yyyy'):"";
        this.selectedMaturityIn= this.portolioDetails["Maturity_IN"];
        this.selectedObservationIn= this.portolioDetails["Observ_IN"];
        this.selectedCancelDateIn= this.portolioDetails["Cancel_IN"];
        this.startCapAtRiskValue= this.portolioDetails["CapAtRisk_min"];
        this.endCapAtRiskValue= this.portolioDetails["CapAtRisk_max"];
        this.startCancelProbValue= this.portolioDetails["CancelProb_min"];
        this.endCancelProbValue= this.portolioDetails["CancelProb_max"];
        this.startBarrierDValue= this.portolioDetails["KIDist_min"];
        this.endBarrierDValue= this.portolioDetails["KIDist_max"];
        this.startIndValValue= this.portolioDetails["MTM_min"];
        this.endIndValValue= this.portolioDetails["MTM_max"];

        this.current_CapAtRisk_StartValue= this.portolioDetails["CapAtRisk_min"];
        this.current_CapAtRisk_LastValue= this.portolioDetails["CapAtRisk_max"];
        this.current_CancelProb_StartValue= this.portolioDetails["CancelProb_min"];
        this.current_CancelProb_LastValue= this.portolioDetails["CancelProb_max"];
        this.current_BarrierD_StartValue= this.portolioDetails["KIDist_min"];
        this.current_BarrierD_LastValue= this.portolioDetails["KIDist_max"];
        this.current_IndVal_StartValue= this.portolioDetails["MTM_min"];
        this.current_IndVal_LastValue= this.portolioDetails["MTM_max"];
        this.pageSize= 100;
        this.selectedSorting= this.portolioDetails["Sort"];
        this.direction= this.portolioDetails["Sort_direction"];
        this.selectedCapAtRisk =true;
        this.selectedBarDist = true;
        this.selectedIndVal = true;
        this.selectedCancelProb = true;

        this.FilterForAll();
        this.clientFiltersAfterView();
  }

  showViewStatusPopupFunc(message){
    this.showViewStatusPopUp=true;
      this.ViewStatusMsg = message;
      setTimeout(() => {
        this.showViewStatusPopUp=false;
      }, 2500);
  }

  async GetPortfolioViews()
  {
    this.viewList=[];
    let PortfolioViews: any= await this.portfolioService.GetPortFolioViews(AppConfig.settings.oRes?.userID,"SEC");
    PortfolioViews?.forEach(element => {
      this.viewList?.push(element.PV_Name);
    });
    this.viewList.sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }));

  }

  clientFiltersAfterView()
{
  this.groupArr = [];
  this.clientArr = [];
  this.intRefArr = [];
  this.typeArr = [];
  this.tutelaArr = [];
  this.subtutelaArr = [];
  this.branchArr = [];
  this.territoryArr = [];
  this.zoneArr = [];
  [...new Set(this.unFilteredBlotterData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedGroup.split(',').includes(el)
    };
    this.groupArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedClient.split(',').includes(el)
    };
    this.clientArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedIntRef.split(',').includes(el)
    };
    this.intRefArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedType.split(',').includes(el)
    };
    this.typeArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedTutela.split(',').includes(el)
    };
    this.tutelaArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedSubtutela.split(',').includes(el)
    };
    this.subtutelaArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedBranch.split(',').includes(el)
    };
    this.branchArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedTerritory.split(',').includes(el)
    };
    this.territoryArr.push(newObj);
  });
  [...new Set(this.unFilteredBlotterData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
    let newObj = {
      value : el,
      checked : this.selectedZone.split(',').includes(el)
    };
    this.zoneArr.push(newObj);
  });
}

selectView() {
  const inputField = this.el.nativeElement.querySelector('input[type="text"]');
  this.renderer.selectRootElement(inputField).select();
}''
filterViews(){
  this.backUpList=[];
  this.backUpList= this.viewList.slice();
  this.backUpList = this.backUpList?.filter(el => el.toString().toLowerCase().includes(this.viewName.toString().toLowerCase()));
}
changeSearchIndex(dir) {
  switch (dir) {
    case 'DOWN':
      this.activeShareIndex =
        this.viewList.length - 1 === this.activeShareIndex
          ? 0
          : this.activeShareIndex + 1;

      break;
    case 'UP':
      this.activeShareIndex =
        this.activeShareIndex > 0
          ? this.activeShareIndex - 1
          : this.viewList.length - 1;

      break;

    default:
      break;
  }
  //this.selectShare();
  this.common.ScrollTo('.shares-list', '.active-share', 'down');


}

//Varsha G || User currency preference || FSLINT-64 || 30-May-2024
ngOnDestroy(): void {
  try {
    if(this.currencySubscription){
      this.currencySubscription.unsubscribe();
    }
  } catch (error) {
    
  }
}

}
