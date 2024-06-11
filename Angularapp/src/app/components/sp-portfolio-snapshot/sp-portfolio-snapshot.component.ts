import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../euroconnect/services/ec-common.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EcHomeService } from '../euroconnect/services/ec-home.service';
import { CustomerService } from '../euroconnect/services/customer.service';
import { DatePipe } from '@angular/common';
import { SpPortfolioSnapshotService } from 'src/app/services/sp-portfolio-snapshot.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { parse } from 'js2xmlparser';
import moment from 'moment';
import { S, T } from '@angular/cdk/keycodes';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { ExcelService, PDFElementStyles } from 'src/app/services/excel.service';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { SpInteractiveDataService } from 'src/app/services/sp-interactive-data.service';
import { AppConfig } from 'src/app/services/config.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-sp-portfolio-snapshot',
  templateUrl: './sp-portfolio-snapshot.component.html',
  styleUrls: ['./sp-portfolio-snapshot.component.scss']
})
export class SpPortfolioSnapshotComponent implements OnInit {

//   @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
//   ngAfterViewChecked() {
//     // you could also do this after a service call of some sort
//     this.finishedLoading.emit(true);
//  }
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  asseturl = environment.asseturl;
  showFilterDropdown: boolean = false;
  
  initialData = [];
  topWhatIf=["-49","-45","-40","-35","-30","-25","-22","-20","-17","-15","-12","-10","-9","-8","-7","-6","-5","-4","-3","-2","-1","0","1","2","3","4","5","6","7","8","9","10","12","15","17","20","22","25","30","35"];
  bottomWhatIf=["-25","-20","-15","-10","-7","-5","-4","-3","-2","-1","0","1","2","3","4","5","7","10","15","20","25"];
  loader: boolean = false;
  showViewStatusPopUp:boolean = false;
  ViewStatusMsg:string;
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
  filteredBackData:any=[];
  selectedSorting:any="Issue Date";
  selectedView:any;
  selectedGroup:any;
  selectedClient:any;
  selectedIntRef:any;
  selectedType:any;
  selectedTutela:any;
  selectedSubtutela:any;
  selectedBranch:any;
  selectedTerritory:any;
  selectedZone:any;
  selectedFormat:any;
  groupArr: any = [];
  clientArr: any = [];
  intRefArr: any = [];
  typeArr: any = [];
  tutelaArr: any = [];
  subtutelaArr: any = [];
  branchArr: any = [];
  territoryArr: any = [];
  zoneArr: any = [];
  clearClientFilter:boolean = false;
  clearProductFilter:boolean = false;
  showFormatLabel:any="Format";
  selectedCurrency:any;
  selectedPType:any;
  selectedCapAtRisk:boolean =false;
  selectedBarDist:boolean = false;
  selectedIndVal:boolean = false;
  selectedCancelProb:boolean = false;
  selectedULType:any;
  selectedExternal:any;
  selectedUnderlying:any;
  selectedMaturityIn:any;
  selectedObservationIn:any;
  selectedACIn:any;
  selectedCancelDateIn:any;
  selectedSpotVar:any="Spot % Variation";
  selectedMarketSpotVar:any="Market Spot % Variation";
  StartDate:any;
  StartDateDisplay:any;
  EndDateDisplay:any;
  EndDate:any;
  display = 1;
  formatData:any;
  currencyData:any;
  productTypeData:any;
  ulTypeData: any;
  showPopup: boolean = false;
  popupTitle: string = '';
  selectedItem: object = {};
  obsTableData: object[] = [];
  obsTableDataDT: object[] = []; // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
  cancellationData: object[] = [];
  isVisible = new BehaviorSubject(true);
  showHistCashflowsFilter: boolean = false;
  ToAutoCallAscend: boolean = false;
  ToProtectionAscend: boolean = false;
  HistCashflowsAscend: boolean = false;
  NextObsDateAscend: boolean = false;
  IndicValuationAscend: boolean = false;
  MaturityDateAscend: boolean = false;
  DecisiveULAscend: boolean = false;
  storedAutoCall:boolean;
  storedProtection:boolean;
  storedHistCashflows:boolean;
  storedNextObsDate:boolean;
  storedIndicValuation:boolean;
  storedMaturityDate:boolean;
  storedDecisiveUL:boolean;
  storedDirection:boolean;
  showWhatIFFlags: any = [];
  whatIfData: any = [];
  scenariouUnderlying:any=[];
  fileName:any = '';
  oneByOne:string='one';
  totalCount:any=0;
  selectedScenarioUnderlying:any="Underlying";
  checkWhatIfData:boolean=false;
  afterFilter:boolean=false;
  whatIfDataIconFlag:boolean=false;
  filterPagination:boolean=false;
  selectedSpot:boolean=false;
  selectedMSpot:boolean=false;
  checkULType:boolean=false;
  excelDataFlag:boolean=false;
  exportData:any;
  exportDataForFilter:any;
  noOfRecords = 0;
  pageSize:number = 100;
  pageNo:number = 1;
  pageFirstRecord :number = (this.pageNo - 1) * this.pageSize + 1;
  pageLastRecord :number= this.pageSize;
  pageStart:number=0;
  pageEnd:number=0;
  pageIndex: number = 0;
  direction:any="Descending";
  disableDirection:boolean=false;
  viewName:any;
  viewList:any=[];
  ViewFlag:boolean;
  saveoptionflag:boolean=false;
  backUpList:any=[];
  viewXML:any=[];
  portolioDetails:any;
  activeShareIndex: any;
  previousFilterfield:any;
  previousSortByfield:boolean;
  refreshed:boolean = false;
  noPagefirst:boolean=false;
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
  
  showDropdown: boolean = false;
  _num = Number;
  _str = String;
  histTableData: object[] = [];
  popupLoader: boolean = false;
  isPDF:boolean=false;
  dataTableElement:any;
  paymentsTblData: TableData = {Headers: [], RowData: []}; ////DataSource property of payments table || FSLINT-51 || Kaustubh S || 06-Feb-2024
  constructor(
    public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService,
    public customer:CustomerService,
    public datepipe: DatePipe,
    public portfolioService: SpPortfolioSnapshotService,
    private excelService: ExcelService,
    private interactiveData:SpInteractiveDataService,
    public commonApi: CommonApiService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { 
      this.selectedGroup='';
      this.selectedClient = '';
      this.selectedIntRef = '';
      this.selectedType= '';
      this.selectedTutela= '';
      this.selectedSubtutela= '';
      this.selectedBranch= '';
      this.selectedTerritory= '';
      this.selectedZone= '';
      this.selectedFormat='';
      this.showFormatLabel='Format';
      this.selectedCurrency='';
      this.selectedPType='';
      this.selectedULType='';
      this.selectedUnderlying='';
      this.selectedExternal='';
      this.StartDate = "";
      this.StartDateDisplay = "";
      this.EndDateDisplay="";
      this.EndDate = "";
      this.selectedMaturityIn="";
      this.selectedObservationIn="";
      this.selectedACIn="";
      this.selectedCancelDateIn="";

    }
  // Added by MuditB || 30-Aug-23 || Start || SlidersFilter

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

  options1: Options = {};
  options2: Options = {};
  options3: Options = {};
  options4: Options = {};
  // Added by MuditB || 30-Aug-23 || End || SlidersFilter

  async ngOnInit(): Promise<void> {
    this.loader=true;
    // console.log("PARSEEE",JSON.parse(this.sampleData))
    // this.getPortfolioData();
    //this.Get_Portfolio_Scenarios();
    // let param:any={
    //   strData:"USP_Get_Portfolio_Details_Sntdr_test",
    //   EntityID:"27",
    //   UserId: AppConfig.settings.oRes?.userID,
    //   CustomerID:"",
    //   EventType:"",
    //   FromDate:"2010-01-01",
    //   ToDate:"2030-12-31",
    //   Measure:"",
    //   Sector:"",
    //   RowsPerPage:"",
    //   PageNo:"",
    //   WhereClause:""
    //   }
    // var response= await this.portfolioService.GetInteractivedata(param);
    // console.log("PARSEEEE",response);
    this.GetPortfolioViews();
    this.getDataForExport();
    this.newGetPortfolioData();
    //this.getPortfolioData();
    this.getScenarioUnderlying();
    this.toggleCheck = this.commonfunctions.getLayout();
 
  }

  // async ngAfterViewChecked() {
  //   //this.dataTableElement = await document.getElementById('DataTablePDF');
  //   console.log("AFTER VIEW INIT",this.el.nativeElement.querySelector('#DataTablePDF'))
  //   // if (dataTableElement) {
  //   //   // Your code to work with the element
  //   // }
  //   this.dataTableElement = this.el.nativeElement.querySelector('#DataTablePDF');
  //   // if(this.isPDF && dataTableElement)
  //   // {
  //   //   console.log("CONDITION")
  //   //   await this.SaveMainPDF(dataTableElement);
  //   // }
  //   // if (targetElement) {
  //   //   // The element was found
  //   //   // You can perform some actions with the element here

  //   //   // Example: Change the element's background color
  //   //   this.renderer.setStyle(targetElement, 'background-color', 'lightblue');
  //   // } else {
  //   //   // The element was not found
  //   //   console.log('Element not found');
  //   // }
  // }
  async newGetPortfolioData()
  {
    let param:any={
      TemplateCode:"USP_Get_SP_Portfolio_Snapshot",
      EntityID:"27",
      UserId: AppConfig.settings.oRes?.userID,
      CustomerID:"",
      EventType:"",
      FromDate:"",
      ToDate:"",
      Measure:"",
      Sector:"",
      RowsPerPage:"",
      PageNo:"",
      WhereClause:""
      }
    let mainData1 = await this.portfolioService.GetInteractivedata(param);
    console.log("MAINNN DATA",mainData1);
    if(mainData1){
      this.loader=false;
      let blotterData = [];
      blotterData = mainData1;
      this.initialData = blotterData;
      this.selectedSorting='Issue Date';
      this.formatData=[];
      this.currencyData=[];
      this.productTypeData=[];
      this.ulTypeData=[];
      let kI_Distance:any[];
      let mtm:any[];
      let capAtRisk:any[];
      let cancelProb:any[];

      this.groupArr = [];
      this.clientArr = [];
      this.intRefArr = [];
      this.typeArr = [];
      this.tutelaArr = [];
      this.subtutelaArr = [];
      this.branchArr = [];
      this.territoryArr = [];
      this.zoneArr = [];

      this.formatData=blotterData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
      this.formatData=[...new Set(this.formatData)];
      console.log("FORMAT ",this.formatData)

      let temp =blotterData.map(item=>item["EdgeColor"]).sort((a,b) => a > b ? 1 : -1)
      temp=[...new Set(temp)];
      console.log("Edege Colour ",temp)

      this.currencyData=blotterData.map(item=>item["Currency"]).sort((a,b) => a > b ? 1 : -1);
      this.currencyData=[...new Set(this.currencyData)];

      this.productTypeData=blotterData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
      this.productTypeData=[...new Set(this.productTypeData)];

      this.ulTypeData=blotterData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
      this.ulTypeData=[...new Set(this.ulTypeData)];
      
      [...new Set(blotterData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.groupArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.clientArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.intRefArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.typeArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.tutelaArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.subtutelaArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.branchArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.territoryArr.push(newObj);
      });
      [...new Set(blotterData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.zoneArr.push(newObj);
      });

      // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
      // Capital risk
      capAtRisk=blotterData.map(item=>item["CapAtRisk"]);
      capAtRisk=[...new Set(capAtRisk)];
      console.log("capAtRisk data", capAtRisk);
      let maxCapAtRisk = capAtRisk.reduce((a, b) => Math.max(a, b));
      let minCapAtRisk = capAtRisk.reduce((a, b) => Math.min(a, b));
      console.log("MIN minCapAtRisk ", minCapAtRisk, typeof minCapAtRisk);
      console.log("MAX maxCapAtRisk ", maxCapAtRisk, typeof maxCapAtRisk);
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

      //Cancel PRob
      cancelProb=blotterData.map(item=>item["CancelProb"]);
      cancelProb=[...new Set(cancelProb)];
      console.log("cancelProb data", cancelProb);
      let maxCancelProb = cancelProb.reduce((a, b) => Math.max(a, b));
      let minCancelProb = cancelProb.reduce((a, b) => Math.min(a, b));
      console.log("MIN minCancelProb ", minCancelProb, typeof minCancelProb);
      console.log("MAX maxCancelProb ", maxCancelProb, typeof maxCancelProb);
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
      this.options2=opts2;

      //BArrier Distance
      kI_Distance=blotterData.map(item=>item["KI_Distance"]);
      kI_Distance=[...new Set(kI_Distance)];
      console.log("kI_Distance data", kI_Distance);
      let maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
      let minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
      console.log("MIN KI ", minKI, typeof minKI);
      console.log("MAX KI ", maxKI, typeof maxKI);
      this.startBarrierDValue = minKI;
      this.endBarrierDValue = maxKI;
      this.current_BarrierD_StartValue = this.startBarrierDValue
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

      //indicative value
      mtm=blotterData.map(item=>item["MTM"]);
      mtm=[...new Set(mtm)];
      console.log("mtm data", mtm);
      let maxMTM = mtm.reduce((a, b) => Math.max(a, b));
      let minMTM = mtm.reduce((a, b) => Math.min(a, b));
      console.log("MIN MTM ", minMTM, typeof minMTM);
      console.log("MAX MTM ", maxMTM, typeof maxMTM);
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
        // Added by MuditB || 30-Aug-23 || End || SlidersFilter

     // this.onKeydownRowsPerPage(10);
      blotterData = this.sortTable(blotterData, "Start_Date");
      // this.portfolioSort("Start_Date");//for retaining sort
      if(this.LiveCheck)
      {
        this.blotterData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
        this.filteredBackData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
      }
      else{
        this.blotterData = blotterData;
        this.filteredBackData=blotterData;
      }
      //this.portfolioSort("Start_Date");
      // if(this.afterFilter)
      // {
      //   this.FilterForAll();
      // }
      // this.blotterData = this.blotterData.filter((item, index, self) => {
      //   return self.findIndex((i) => i.External === item.External) === index;
      // });
      // Changes to not show duplicate records in the count 
      // this.totalCount=this.blotterData.length; //FSLINT-37||14-12-23 Change to fix slowness in filtering due to duplicate record count change.
      // this.totalCount=this.blotterData
      // .filter((item, index, self) => {
      //     return self.findIndex((i) => i.External === item.External) === index;
      //   })
      //   .length;
      // Changes to not show duplicate records in the count - Efficient way
      const uniqueExternals = new Set();
      const uniqueRecords = this.blotterData.reduce((accumulator, currentItem) => {
        if (!uniqueExternals.has(currentItem.External)) {
          uniqueExternals.add(currentItem.External);
          accumulator.push(currentItem);
        }
        return accumulator;
      }, []);
      
      this.totalCount = uniqueRecords.length;
      let mainData = blotterData;
      this.unFilteredBlotterData = mainData;
      this.filteredData = this.unFilteredBlotterData;
      //this.onKeydownRowsPerPage(10);
      if(this.afterFilter)
      {
        this.FilterForAll();
      }
      if(!this.filterPagination)
      {
        this.onKeydownRowsPerPage(this.pageSize);
      }
      // this.onKeydownRowsPerPage(this.pageSize);
      // BY DEFAULT Sorting by Issue Date        
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
      console.log(this.blotterData)
      this.loader = false;
    }
    else{
      this.loader=false;
    }
  }
  checkInBasketToggle(event: MatSlideToggleChange) {
    console.log(event);
    this.inBasketCheck = event.checked;
  }

  checkLiveToggle(event: MatSlideToggleChange) {
    console.log(event);
    this.LiveCheck = event.checked;
  }

  checkDeadToggle(event: MatSlideToggleChange) {
    console.log(event);
    this.DeadCheck = event.checked;
  }



  getPortfolioData(){
    this.portfolioService.GetProductDetailsTimeline().subscribe(async (data)=>{
      console.log("Data",data)
      
      if(data){
        //this.loader=false;
        let blotterData = [];
        blotterData = await data;
        this.selectedSorting='Issue Date';
        this.formatData=[];
        this.currencyData=[];
        this.productTypeData=[];
        this.ulTypeData=[];
        let kI_Distance:any[];
        let mtm:any[];
        let capAtRisk:any[];
        let cancelProb:any[];

        this.formatData=blotterData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
        this.formatData=[...new Set(this.formatData)];

        this.currencyData=blotterData.map(item=>item["Currency"]).sort((a,b) => a > b ? 1 : -1);
        this.currencyData=[...new Set(this.currencyData)];

        this.productTypeData=blotterData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
        this.productTypeData=[...new Set(this.productTypeData)];

        this.ulTypeData=blotterData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
        this.ulTypeData=[...new Set(this.ulTypeData)];

        // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
        // Capital risk
        capAtRisk=blotterData.map(item=>item["CapAtRisk"]);
        capAtRisk=[...new Set(capAtRisk)];
        console.log("capAtRisk data", capAtRisk);
        let maxCapAtRisk = capAtRisk.reduce((a, b) => Math.max(a, b));
        let minCapAtRisk = capAtRisk.reduce((a, b) => Math.min(a, b));
        console.log("MIN minCapAtRisk ", minCapAtRisk, typeof minCapAtRisk);
        console.log("MAX maxCapAtRisk ", maxCapAtRisk, typeof maxCapAtRisk);
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
        this.options1=opts1

        //Cancel PRob
        cancelProb=blotterData.map(item=>item["CancelProb"]);
        cancelProb=[...new Set(cancelProb)];
        console.log("cancelProb data", cancelProb);
        let maxCancelProb = cancelProb.reduce((a, b) => Math.max(a, b));
        let minCancelProb = cancelProb.reduce((a, b) => Math.min(a, b));
        console.log("MIN minCancelProb ", minCancelProb, typeof minCancelProb);
        console.log("MAX maxCancelProb ", maxCancelProb, typeof maxCancelProb);
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
        this.options2=opts2

        //BArrier Distance
        kI_Distance=blotterData.map(item=>item["KI_Distance"]);
        kI_Distance=[...new Set(kI_Distance)];
        console.log("kI_Distance data", kI_Distance);
        let maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
        let minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
        console.log("MIN KI ", minKI, typeof minKI);
        console.log("MAX KI ", maxKI, typeof maxKI);
        this.startBarrierDValue = minKI;
        this.endBarrierDValue = maxKI;
        this.current_BarrierD_StartValue = this.startBarrierDValue
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
        this.options3=opts3

        //indicative value
        mtm=blotterData.map(item=>item["MTM"]);
        mtm=[...new Set(mtm)];
        console.log("mtm data", mtm);
        let maxMTM = mtm.reduce((a, b) => Math.max(a, b));
        let minMTM = mtm.reduce((a, b) => Math.min(a, b));
        console.log("MIN MTM ", minMTM, typeof minMTM);
        console.log("MAX MTM ", maxMTM, typeof maxMTM);
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
          this.options4=opts4
          // Added by MuditB || 30-Aug-23 || End || SlidersFilter

        //this.onKeydownRowsPerPage(10);
        if(this.LiveCheck)
        {
          this.blotterData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
        }
        else{
          this.blotterData = blotterData;
        }
        // if(this.afterFilter)
        // {
        //   this.FilterForAll();
        // }
        this.totalCount=this.blotterData.length;
        let mainData = blotterData;
        this.unFilteredBlotterData = mainData;
        this.filteredData = this.unFilteredBlotterData;
        //this.onKeydownRowsPerPage(10);
        if(this.afterFilter)
        {
          this.FilterForAll();
        }
        this.onKeydownRowsPerPage(10);
        // BY DEFAULT Sorting by Issue Date        
        this.blotterData = this.sortTable(this.blotterData, "Start_Date");
        console.log(this.blotterData)
        this.loader = false;
      }
      else{
        this.loader=false;
      }
      

    });

  }

  FilterForAll(event?: KeyboardEvent)
  {
    console.log("STARTT DATE",event);
    console.log("LIVE CHECK:", this.LiveCheck,"  DEAD CHECK:", this.DeadCheck)
    let date;
    this.filterPagination=false;
    // this.pageNo=1;
    let pageNumber:number;
    // if(!this.noPagefirst) //by default page first
    // {
      pageNumber=1;
    // }
    let backupData = this.excelDataFlag ? this.exportDataForFilter : this.unFilteredBlotterData;
    console.log("in filter",backupData)
    // if(this.excelDataFlag){
    //   backupData = data;
    // }
    // else{
    //   backupData = this.unFilteredBlotterData;
    // }


    if(this.LiveCheck && !this.DeadCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN=="Alive");
    }
    if(this.DeadCheck && !this.LiveCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN!="Alive");
    }
    if( !this.LiveCheck &&!this.DeadCheck)
    {
      // this.loader=true;
      // this.LiveCheck=true;
      // this.DeadCheck=false;
      // //this.checkLiveToggle(event: MatSlideToggleChange)
      // this.FilterForAll();
      backupData=backupData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
    }

    if (this.selectedExternal!= "") { 
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase()); 
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.Product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()) || s.ISIN.toLowerCase().includes(exteranl_ref.toLowerCase()))))
    
    }
    // Added by MuditB || 27-Sep-23 || Start || MultiSelect Dropdown Filter

    if (this.selectedFormat != "" ) {

      /* **** When Select All is deselected the output in tis.selectedFormat emitted is the name of the field i.e here Format ******  */

      // removing filter if "All" option is selected
      // if(this.selectedFormat.toString().toLowerCase() === "all") {
      //   this.selectedFormat = "";
      //   this.FilterForAll(event);
      // }
      
      const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());

      if(formatArr.length==this.formatData.length ){
        this.selectedFormat = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.format.toString().toLowerCase().includes(this.selectedFormat.toString().toLowerCase()));
        backupData = backupData.filter((s: any) => formatArr.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
      }
    }
    // For filter - CURRENCY
    if (this.selectedCurrency != "" ) {

      /* **** When Select All is deselected the output in tis.selectedFormat emitted is the name of the field i.e here Currency ******  */

      // removing filter if "All" option is selected
      // if(this.selectedCurrency.toString().toLowerCase() === "all") {
      //   this.selectedCurrency = "";
      //   this.FilterForAll(event);
      // }
      const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
      if(currencyArr.length==this.currencyData.length ){
        this.selectedCurrency = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.currency.toString().toLowerCase().includes(this.selectedCurrency.toString().toLowerCase()));
        backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.Currency.toString().toLowerCase().includes(currency) || s.Currency.toLowerCase().includes(currency.toLowerCase()))))
      }
    }
    // For filter - PRODUCT TYPE
    if (this.selectedPType != "") {

      /* **** When Select All is deselected the output in tis.selectedFormat emitted is the name of the field i.e here Product Type ******  */

      console.log("this.selectedPType",this.selectedPType)
      // removing filter if "All" option is selected
      // if(this.selectedPType.toString().toLowerCase() === "all") {
      //   this.selectedPType = "";
      //   this.FilterForAll(event);
      // }
      const productArr = this.selectedPType.split(','); // Filter only exact match for product type | 06-Oct-2023
      if(productArr.length==this.productTypeData.length ){
        this.selectedPType = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.payoff.toString().toLowerCase()==this.selectedPType.toString().toLowerCase());
        backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase() === product.toString().toLowerCase())));
        // Filter only exact match for product type | 06-Oct-2023
      }
    }
    // For filter - U/L TYPE
    if (this.selectedULType != "") {
            
      /* **** When Select All is deselected the output in tis.selectedFormat emitted is the name of the field i.e here U/L Type ******  */

      // removing filter if "All" option is selected
      // if(this.selectedULType.toString().toLowerCase() === "all") {
      //   this.selectedULType = "";
      //   this.FilterForAll(event);
      // }
      const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
      if(ULArr.length==this.ulTypeData.length ){
        this.selectedULType = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.uL_Type.toString().toLowerCase().includes(this.selectedULType.toString().toLowerCase()));
        
        backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
      }
    }
    // Added by MuditB || 27-Sep-23 || End || MultiSelect Dropdown Filter
    if (this.selectedUnderlying!= "") { 
      // if(this.inBasketCheck)
      // {
      //   console.log(this.inBasketCheck);
      //   backupData=backupData.filter((s:any)=>s.Worst.toLowerCase().includes(this.selectedUnderlying.toLowerCase()))
      // }
      // else{
      //   console.log(this.inBasketCheck)
      //   const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase()); 
      //   backupData = backupData.filter((s: any) => underlyingToSearch.some(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase())))
      // }

      if(this.inBasketCheck)
      {
        console.log(this.inBasketCheck);
        const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase()); 
        backupData = backupData.filter((s: any) => (underlyingToSearch.every(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase()))) )//&& s.ULCount!="1"
        
      }
      else{
        console.log(this.inBasketCheck)
        backupData=backupData.filter((s:any)=>(s.Product_Name.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount==1 )
      }

      console.log("SPECIFIC UNDERLYING",backupData)
    }

    // if (this.selectedGroup!='') {
    //   backupData = backupData.filter((s: any) => s.Group.toLowerCase().includes(this.selectedGroup.toLowerCase()) )
    // }
    if (this.selectedGroup != "") {
      if(this.selectedGroup === 'NONE'){
        this.selectedGroup = 'Group';
        backupData = [];
      }
      else{
        const groupSelArr = this.selectedGroup.split(',');
        // backupData = backupData.filter((s: any) => groupSelArr.some(group => (s.Group.toString().toLowerCase() === group.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
      }
    }

    // if (this.selectedClient!='') {
    //   backupData = backupData.filter((s: any) => s.Client.toLowerCase().includes(this.selectedClient.toLowerCase()) )
    // }
    if (this.selectedClient != "") {
      if(this.selectedClient === 'NONE'){
        this.selectedClient = 'Client';
        backupData = [];
      }
      else{
        const clientSelArr = this.selectedClient.split(',');
        // backupData = backupData.filter((s: any) => clientSelArr.some(client => (s.Client.toString().toLowerCase() === client.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
      }
    }

    // if (this.selectedIntRef!='') {
    //   backupData = backupData.filter((s: any) => s.Internal_J.toLowerCase().includes(this.selectedIntRef.toLowerCase()) )
    // }
    if (this.selectedIntRef != "") {
      if(this.selectedIntRef === 'NONE'){
        this.selectedIntRef = 'Internal Ref./J';
        backupData = [];
      }
      else{
        const intRefSelArr = this.selectedIntRef.split(',');
        // backupData = backupData.filter((s: any) => intRefSelArr.some(intRef => (s.Internal_J.toString().toLowerCase() === intRef.toString().toLowerCase())));
        backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
      }
    }

    // if (this.selectedType!='') {
    //   backupData = backupData.filter((s: any) => s.Type.toLowerCase().includes(this.selectedType.toLowerCase()) )
    // }
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

    // if (this.selectedTutela!='') {
    //   backupData = backupData.filter((s: any) => s.Tutela.toLowerCase().includes(this.selectedTutela.toLowerCase()) )
    // }
    if (this.selectedTutela !== '' ) {
      if(this.selectedTutela === 'NONE'){
        this.selectedTutela = 'Tutela';
        backupData = [];
      }
      else{
        const tutelaSelArr = this.selectedTutela.split(',');
        backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
      }
    }

    // if (this.selectedSubtutela!='') {
    //   backupData = backupData.filter((s: any) => s.Subtutela.toLowerCase().includes(this.selectedSubtutela.toLowerCase()) )
    // }
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

    // if (this.selectedBranch!='') {
    //   backupData = backupData.filter((s: any) => s.Branch.toLowerCase().includes(this.selectedBranch.toLowerCase()) )
    // }
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

    // if (this.selectedTerritory!='') {
    //   backupData = backupData.filter((s: any) => s.Territory.toLowerCase().includes(this.selectedTerritory.toLowerCase()) )
    // }
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

    // if (this.selectedZone!='') {
    //   backupData = backupData.filter((s: any) => s.Zone.toLowerCase().includes(this.selectedZone.toLowerCase()) )
    // }
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

    // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
    if (this.selectedCapAtRisk) {
      backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue  && s.CapAtRisk <= this.current_CapAtRisk_LastValue )
    }
    if (this.selectedCancelProb ) {
      backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue  && s.CancelProb <= this.current_CancelProb_LastValue )
    }
    if (this.selectedBarDist) {
      backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue  && s.KI_Distance <= this.current_BarrierD_LastValue )
    }
    if (this.selectedIndVal) {
      backupData = backupData.filter((s: any) => s.MTM >= this.current_IndVal_StartValue  && s.MTM<= this.current_IndVal_LastValue )
    }
    // Added by MuditB || 30-Aug-23 || End || SlidersFilter
    if (this.selectedMaturityIn != "") {

      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedMaturityIn));
      backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
      console.log(backupData);
    }
    if (this.selectedObservationIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedObservationIn));;
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }
    if (this.selectedCancelDateIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedCancelDateIn));
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date && ['autocall', 'issuer callable'].includes(s.PayOff.toString().toLowerCase()));
    }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) =>(new Date(s.Start_Date)) >= (new Date(this.StartDateDisplay)))
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Start_Date)) <= (new Date(this.EndDateDisplay)))
    }
    // if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
    //   backupData = backupData.filter((s: any) => s.Maturity_date == this.EndDateDisplay)
    // }
    // if(this.previousSortByfield!=undefined && this.previousSortByfield!="")
    // {
    //   this.portfolioSort(this.previousSortByfield)
    // }
    // else{
    //   this.portfolioSort("Start_Date");
    //   //backupData=this.sortTable(backupData, "Start_Date");
    // }
    // backupData=this.sortTable(backupData, "Start_Date");
    console.log("BACKUP", backupData)
    this.filteredBackData=backupData;
    this.portfolioSort(true);
    backupData=this.filteredBackData;
    if(this.excelDataFlag){
      this.exportData = backupData;
    }else{
      this.blotterData = backupData;
      
      // Sliders range values to be updated after filter | 10-Oct-2023
      // if(!this.selectedCapAtRisk && !this.selectedBarDist && !this.selectedIndVal && !this.selectedCancelProb){
      //   this.setSlidersValue();
      // }
      this.setSlidersValue();
      // this.onKeydownRowsPerPage(this.pageSize,this.blotterData);
      // BY DEFAULT Sorting by Issue Date        
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
      // backupData = backupData.filter((item, index, self) => {
      //   return self.findIndex((i) => i.External === item.External) === index;
      // });
      // Changes to not show duplicate records in the count 
      // this.totalCount= backupData.length; //FSLINT-37||14-12-23 Change to fix slowness in filtering due to duplicate record count change.
      // this.totalCount= backupData
      // .filter((item, index, self) => {                                                   
      //     return self.findIndex((i) => i.External === item.External) === index;
      //   })
      //   .length;
      // Changes to not show duplicate records in the count - Efficient way
      const uniqueExternals = new Set();
      const uniqueRecords = backupData.reduce((accumulator, currentItem) => {
        if (!uniqueExternals.has(currentItem.External)) {
          uniqueExternals.add(currentItem.External);
          accumulator.push(currentItem);
        }
        return accumulator;
      }, []);
      
      this.totalCount = uniqueRecords.length;
      // this.onKeydownRowsPerPage(this.pageSize);
      if(this.previousFilterfield!=undefined && this.previousFilterfield!="")
      {
        this.sort(this.previousFilterfield,false)
      }
      else{
        this.onKeydownRowsPerPage(this.pageSize,this.blotterData,pageNumber);
      }

      // this.onKeydownRowsPerPage(this.pageSize,this.blotterData);
      this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
      //this.portfolioSort();
      this.afterFilter=false;
      // Reset the viewport's scrollTop to 0 to display the top of the next page
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
      // Sliders range values to be updated after filter | 10-Oct-2023
      // this.selectedCapAtRisk =false;
      // this.selectedBarDist = false;
      // this.selectedIndVal = false;
      // this.selectedCancelProb = false;
    }
    this.loader=false;
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
      // if(filter !== "Territory") {
      //   this.territoryArr = [];
      //   [...new Set(this.filteredBackData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
      //     let newObj = {
      //       value : el,
      //       checked : true
      //     };
      //     this.territoryArr.push(newObj);
      //   });
      // }
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

  // Sliders range values to be updated after filter | 09-Oct-2023
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
          kI_Distance=this.filteredBackData.map(item=>item["KI_Distance"]);
          kI_Distance=[...new Set(kI_Distance)];
          maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
          minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
        }
        
        //indicative value
        if(!this.selectedIndVal){
          mtm=this.filteredBackData.map(item=>item["MTM"]);
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

  selectDate(date) {
    try {
      console.log(date)
      if (date !== '') {
        this.StartDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.StartDateDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.StartDate = "";
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
        this.EndDate = "";
        this.EndDateDisplay = undefined;
      }
    } catch (error) { }
  }
  showAllFilters() {
    this.showHistCashflowsFilter = true;
  }
  refresh() {
    this.loader = true;
    this.refreshed=true;
    this.viewName="";
    this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
    this.direction="Descending";
    this.disableDirection=false;
    console.log("FERSH", this.unFilteredBlotterData)
    this.selectedSorting='Issue Date';
    this.selectedGroup='';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType= '';
    this.selectedTutela= '';
    this.selectedSubtutela= '';
    this.selectedBranch= '';
    this.selectedTerritory= '';
    this.selectedZone= '';

    this.selectedFormat='';
    this.selectedCurrency='';
    this.selectedPType='';
    this.selectedULType='';
    this.selectedExternal='';
    this.selectedUnderlying='';
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
    this.inBasketCheck=true;
    this.LiveCheck=true;
    this.DeadCheck=false;

    this.oneByOne="one";
    this.selectedScenarioUnderlying="Underlying";
    this.selectedSpotVar="Spot % Variation";
    this.selectedMarketSpotVar="Market Spot % Variation";
    this.whatIfDataIconFlag=false;
    this.checkWhatIfData=false;
    this.filterPagination=false;
    this.pageSize = 100;
    this.pageNo = 1;
    this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
    this.pageLastRecord = this.pageSize;
    this.selectedSpot=false;
    this.selectedMSpot=false;
    //this.getPortfolioData();
    this.newGetPortfolioData();
    this.clearClientFilter = true;
    this.clearProductFilter = true;
    this.ToAutoCallAscend=false;
    this.ToProtectionAscend=false;
    this.HistCashflowsAscend=false;
    this.NextObsDateAscend=false;
    this.IndicValuationAscend=false;
    this.MaturityDateAscend=false;
    this.DecisiveULAscend=false;
    this.previousFilterfield="";
    this.noPagefirst=false;
    this.restoreSortIconCSS();
  }
  clearClient() {
    this.loader = true;
    this.afterFilter=true;
    this.viewName="";
    this.selectedGroup='';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType= '';
    this.selectedTutela= '';
    this.selectedSubtutela= '';
    this.selectedBranch= '';
    this.selectedTerritory= '';
    this.selectedZone= '';
    console.log("FERSH", this.unFilteredBlotterData)
    
    // this.newGetPortfolioData();
    let date;
    let pageNumber:number=1;
    let backupData = this.excelDataFlag ? this.exportData : this.unFilteredBlotterData;
   
      let temp =backupData.map(item=>item["EdgeColor"]).sort((a,b) => a > b ? 1 : -1)
      temp=[...new Set(temp)];
      console.log("Edege Colour ",temp)

      if(this.LiveCheck && !this.DeadCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN=="Alive");
    }
    if(this.DeadCheck && !this.LiveCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN!="Alive");
    }
    if( !this.LiveCheck &&!this.DeadCheck)
    {
      backupData=backupData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
    }

    if (this.selectedExternal!= "") { 
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase()); 
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.Product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))
    
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
        backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.Currency.toString().toLowerCase().includes(currency) || s.Currency.toLowerCase().includes(currency.toLowerCase()))))
      }
    }
    if (this.selectedPType != "") {
      console.log("this.selectedPType",this.selectedPType)
      const productArr = this.selectedPType.split(','); // Filter only exact match for product type | 06-Oct-2023
      if(productArr.length==this.productTypeData.length ){
        this.selectedPType = "";

      }
      else {
        backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase() === product.toString().toLowerCase())));
      }
    }

    if (this.selectedULType != "") {

      const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
      if(ULArr.length==this.ulTypeData.length ){
        this.selectedULType = "";
      }
      else {
        backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
      }
    }

    if (this.selectedUnderlying!= "") { 

      if(this.inBasketCheck)
      {
        console.log(this.inBasketCheck);
        const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase()); 
        backupData = backupData.filter((s: any) => (underlyingToSearch.every(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase()))) )//&& s.ULCount!="1"
        
      }
      else{
        console.log(this.inBasketCheck)
        backupData=backupData.filter((s:any)=>(s.Product_Name.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount==1 )
      }
    }

    if (this.selectedCapAtRisk) {
      backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue  && s.CapAtRisk <= this.current_CapAtRisk_LastValue )
    }
    if (this.selectedCancelProb ) {
      backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue  && s.CancelProb <= this.current_CancelProb_LastValue )
    }
    if (this.selectedBarDist) {
      backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue  && s.KI_Distance <= this.current_BarrierD_LastValue )
    }
    if (this.selectedIndVal) {
      backupData = backupData.filter((s: any) => s.MTM >= this.current_IndVal_StartValue  && s.MTM<= this.current_IndVal_LastValue )
    }

    if (this.selectedMaturityIn != "") {

      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedMaturityIn));
      backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
      console.log(backupData);
    }
    if (this.selectedObservationIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedObservationIn));;
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }
    if (this.selectedCancelDateIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedCancelDateIn));
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date && ['autocall', 'issuer callable'].includes(s.PayOff.toString().toLowerCase()));
    }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) =>(new Date(s.Start_Date)) >= (new Date(this.StartDateDisplay)))
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Start_Date)) <= (new Date(this.EndDateDisplay)))
    }
      this.groupArr = [];
      this.clientArr = [];
      this.intRefArr = [];
      this.typeArr = [];
      this.tutelaArr = [];
      this.subtutelaArr = [];
      this.branchArr = [];
      this.territoryArr = [];
      this.zoneArr = [];

      [...new Set(this.initialData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.groupArr.push(newObj);
      });
      console.log("Group Arr" + this.groupArr);
      [...new Set(this.initialData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.clientArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.intRefArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.typeArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.tutelaArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.subtutelaArr.push(newObj);
      });
      console.log(this.subtutelaArr);
      [...new Set(this.initialData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.branchArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.territoryArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.zoneArr.push(newObj);
      });

    backupData=this.sortTable(backupData, "Start_Date");
    this.filteredBackData=backupData;
    this.portfolioSort(true);
    if(this.excelDataFlag){
      this.exportData = backupData;
    }else{
      this.blotterData = backupData;
      
      this.setSlidersValue();
      this.totalCount= backupData.length;
      if(this.previousFilterfield!=undefined && this.previousFilterfield!="")
      {
        this.sort(this.previousFilterfield,false)
      }
      else{
        this.onKeydownRowsPerPage(this.pageSize,this.blotterData,pageNumber);
      }
      this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
      this.afterFilter=false;
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
    }
    this.loader = false;
    this.clearClientFilter = true;
  }

  clearProduct() {
    this.loader = true;
    this.afterFilter=true;
    console.log("FERSH", this.unFilteredBlotterData)
    this.viewName="";
    this.selectedFormat='';
    this.selectedCurrency='';
    this.selectedPType='';
    this.selectedULType='';
    this.selectedUnderlying='';
    this.inBasketCheck=true;
    this.LiveCheck=true;
    this.DeadCheck=false;
    
    // this.newGetPortfolioData();
    let date;
    let pageNumber:number=1;
    let backupData = this.excelDataFlag ? this.exportData : this.unFilteredBlotterData;



    if(this.LiveCheck && !this.DeadCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN=="Alive");
    }
    if(this.DeadCheck && !this.LiveCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN!="Alive");
    }
    if( !this.LiveCheck &&!this.DeadCheck)
    {
      backupData=backupData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
    }

    if (this.selectedExternal!= "") { 
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase()); 
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.Product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))
    
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
      backupData = backupData.filter((s: any) => s.CapAtRisk >= this.current_CapAtRisk_StartValue  && s.CapAtRisk <= this.current_CapAtRisk_LastValue )
    }
    if (this.selectedCancelProb ) {
      backupData = backupData.filter((s: any) => s.CancelProb >= this.current_CancelProb_StartValue  && s.CancelProb <= this.current_CancelProb_LastValue )
    }
    if (this.selectedBarDist) {
      backupData = backupData.filter((s: any) => s.KI_Distance >= this.current_BarrierD_StartValue  && s.KI_Distance <= this.current_BarrierD_LastValue )
    }
    if (this.selectedIndVal) {
      backupData = backupData.filter((s: any) => s.MTM >= this.current_IndVal_StartValue  && s.MTM<= this.current_IndVal_LastValue )
    }

    if (this.selectedMaturityIn != "") {

      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedMaturityIn));
      backupData = backupData.filter((s: any) => new Date(s.Maturity_date) <= date)
      console.log(backupData);
    }
    if (this.selectedObservationIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedObservationIn));;
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date)
    }
    if (this.selectedCancelDateIn != "") {
      date = new Date();
      date.setDate( date.getDate() + parseInt(this.selectedCancelDateIn));
      backupData = backupData.filter((s: any) => new Date(s.NextObsDate) <= date && ['autocall', 'issuer callable'].includes(s.PayOff.toString().toLowerCase()));
    }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) =>(new Date(s.Start_Date)) >= (new Date(this.StartDateDisplay)))
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => (new Date(s.Start_Date)) <= (new Date(this.EndDateDisplay)))
    }


    this.formatData=backupData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
    this.formatData=[...new Set(this.formatData)];

    let temp =backupData.map(item=>item["EdgeColor"]).sort((a,b) => a > b ? 1 : -1)
    temp=[...new Set(temp)];

    this.currencyData=backupData.map(item=>item["Currency"]).sort((a,b) => a > b ? 1 : -1);
    this.currencyData=[...new Set(this.currencyData)];

    this.productTypeData=backupData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
    this.productTypeData=[...new Set(this.productTypeData)];

    this.ulTypeData=backupData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
    this.ulTypeData=[...new Set(this.ulTypeData)];

    backupData=this.sortTable(backupData, "Start_Date");
    this.filteredBackData=backupData;
    this.portfolioSort(true);
    if(this.excelDataFlag){
      this.exportData = backupData;
    }else{
      this.blotterData = backupData;
      
      this.setSlidersValue();
      this.totalCount= backupData.length;
      if(this.previousFilterfield!=undefined && this.previousFilterfield!="")
      {
        this.sort(this.previousFilterfield,false)
      }
      else{
        this.onKeydownRowsPerPage(this.pageSize,this.blotterData,pageNumber);
      }
      this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
      this.afterFilter=false;
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
    }
    this.loader = false;
    this.clearProductFilter = true;
  }

  clearProductSpecs() {
    this.loader = true;
    this.afterFilter=true;
    console.log("FERSH", this.unFilteredBlotterData)
    this.viewName="";
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
    // this.newGetPortfolioData();
    let pageNumber:number=1;
    let backupData = this.excelDataFlag ? this.exportData : this.unFilteredBlotterData;
    

    let temp =backupData.map(item=>item["EdgeColor"]).sort((a,b) => a > b ? 1 : -1)
    temp=[...new Set(temp)];
    console.log("Edege Colour ",temp)

    if(this.LiveCheck && !this.DeadCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN=="Alive");
    }
    if(this.DeadCheck && !this.LiveCheck)
    {
      this.loader=true;
      backupData=backupData.filter((s:any)=>s.AliveYN!="Alive");
    }
    if( !this.LiveCheck &&!this.DeadCheck)
    {
      backupData=backupData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
    }

    if (this.selectedExternal!= "") { 
      const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase()); 
      backupData = backupData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.Product_Ref.includes(exteranl_ref) || s.External.toLowerCase().includes(exteranl_ref.toLowerCase()))))
    
    }
    // Added by MuditB || 27-Sep-23 || Start || MultiSelect Dropdown Filter

    if (this.selectedFormat != "" ) {

      const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());

      if(formatArr.length==this.formatData.length ){
        this.selectedFormat = "";
      }
      else {
        // backupData = backupData.filter((s: any) => s.format.toString().toLowerCase().includes(this.selectedFormat.toString().toLowerCase()));
        backupData = backupData.filter((s: any) => formatArr.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
      }
    }

    if (this.selectedCurrency != "" ) {
      const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
      if(currencyArr.length==this.currencyData.length ){
        this.selectedCurrency = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.currency.toString().toLowerCase().includes(this.selectedCurrency.toString().toLowerCase()));
        backupData = backupData.filter((s: any) => currencyArr.some(currency => (s.Currency.toString().toLowerCase().includes(currency) || s.Currency.toLowerCase().includes(currency.toLowerCase()))))
      }
    }
    // For filter - PRODUCT TYPE
    if (this.selectedPType != "") {
      const productArr = this.selectedPType.split(','); // Filter only exact match for product type | 06-Oct-2023
      if(productArr.length==this.productTypeData.length ){
        this.selectedPType = "";

      }
      else {
        // backupData = backupData.filter((s: any) => s.payoff.toString().toLowerCase()==this.selectedPType.toString().toLowerCase());
        backupData = backupData.filter((s: any) => productArr.some(product => (s.PayOff.toString().toLowerCase() === product.toString().toLowerCase())));
        // Filter only exact match for product type | 06-Oct-2023
      }
    }
    if (this.selectedULType != "") {

      const ULArr = this.selectedULType.split(',').map(arg => arg.trim().toLowerCase());
      if(ULArr.length==this.ulTypeData.length ){
        this.selectedULType = "";
        //this.FilterForAll(event);
      }
      else {
        // backupData = backupData.filter((s: any) => s.uL_Type.toString().toLowerCase().includes(this.selectedULType.toString().toLowerCase()));
        
        backupData = backupData.filter((s: any) => ULArr.some(UL => (s.UL_Type.toString().toLowerCase().includes(UL) || s.UL_Type.toLowerCase().includes(UL.toLowerCase()))))
      }
    }
    // Added by MuditB || 27-Sep-23 || End || MultiSelect Dropdown Filter
    if (this.selectedUnderlying!= "") { 

      if(this.inBasketCheck)
      {
        console.log(this.inBasketCheck);
        const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase()); 
        backupData = backupData.filter((s: any) => (underlyingToSearch.every(underlying => s.Product_Name.toLowerCase().includes(underlying.toLowerCase()))) )//&& s.ULCount!="1"
        
      }
      else{
        console.log(this.inBasketCheck)
        backupData=backupData.filter((s:any)=>(s.Product_Name.toLowerCase().includes(this.selectedUnderlying.toLowerCase())) && s.ULCount==1 )
      }

      console.log("SPECIFIC UNDERLYING",backupData)
    }

    if (this.selectedGroup != "") {
      if(this.selectedGroup === 'NONE'){
        this.selectedGroup = 'Group';
        backupData = [];
      }
      else{
        const groupSelArr = this.selectedGroup.split(',');
        // backupData = backupData.filter((s: any) => groupSelArr.some(group => (s.Group.toString().toLowerCase() === group.toString().toLowerCase())));
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
        // backupData = backupData.filter((s: any) => clientSelArr.some(client => (s.Client.toString().toLowerCase() === client.toString().toLowerCase())));
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
        // backupData = backupData.filter((s: any) => intRefSelArr.some(intRef => (s.Internal_J.toString().toLowerCase() === intRef.toString().toLowerCase())));
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

    backupData=this.sortTable(backupData, "Start_Date");
    this.filteredBackData=backupData;
    this.portfolioSort(true);
    if(this.excelDataFlag){
      this.exportData = backupData;
    }else{
      this.blotterData = backupData;
      
      this.setSlidersValue();
      this.totalCount= backupData.length;
      if(this.previousFilterfield!=undefined && this.previousFilterfield!="")
      {
        this.sort(this.previousFilterfield,false)
      }
      else{
        this.onKeydownRowsPerPage(this.pageSize,this.blotterData,pageNumber);
      }
      this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
      this.afterFilter=false;
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
    }
    this.loader = false;
  }

  clearAllFilters(){
    this.loader = true;
    this.refreshed=true;
    this.viewName="";
    this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
    this.direction="Descending";
    this.disableDirection=false;
    console.log("FERSH", this.unFilteredBlotterData)
    this.selectedSorting='Issue Date';
    this.selectedGroup='';
    this.selectedClient = '';
    this.selectedIntRef = '';
    this.selectedType= '';
    this.selectedTutela= '';
    this.selectedSubtutela= '';
    this.selectedBranch= '';
    this.selectedTerritory= '';
    this.selectedZone= '';

    this.selectedFormat='';
    this.selectedCurrency='';
    this.selectedPType='';
    this.selectedULType='';
    this.selectedExternal='';
    this.selectedUnderlying='';
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
    this.inBasketCheck=true;
    this.LiveCheck=true;
    this.DeadCheck=false;

    this.oneByOne="one";
    this.selectedScenarioUnderlying="Underlying";
    this.selectedSpotVar="Spot % Variation";
    this.selectedMarketSpotVar="Market Spot % Variation";
    this.whatIfDataIconFlag=false;
    this.checkWhatIfData=false;
    this.filterPagination=false;
    this.pageSize = 100;
    this.pageNo = 1;
    this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
    this.pageLastRecord = this.pageSize;
    this.selectedSpot=false;
    this.selectedMSpot=false;
    ///
    this.filterPagination=false;
    // this.pageNo=1;
    let pageNumber:number=1;
    let backupData = this.excelDataFlag ? this.exportData : this.unFilteredBlotterData;
    this.formatData=backupData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
      this.formatData=[...new Set(this.formatData)];
      console.log("FORMAT ",this.formatData)

      let temp =backupData.map(item=>item["EdgeColor"]).sort((a,b) => a > b ? 1 : -1)
      temp=[...new Set(temp)];
      console.log("Edege Colour ",temp)

      this.currencyData=backupData.map(item=>item["Currency"]).sort((a,b) => a > b ? 1 : -1);
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

      [...new Set(this.initialData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.groupArr.push(newObj);
      });
      console.log("Group Arr" + this.groupArr);
      [...new Set(this.initialData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.clientArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.intRefArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.typeArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.tutelaArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.subtutelaArr.push(newObj);
      });
      console.log(this.subtutelaArr);
      [...new Set(this.initialData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.branchArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.territoryArr.push(newObj);
      });
      [...new Set(this.initialData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.zoneArr.push(newObj);
      });

    backupData=backupData.filter((s:any)=>s.AliveYN=="Alive");
    backupData=this.sortTable(backupData, "Start_Date");
    this.filteredBackData=backupData;
    if(this.excelDataFlag){
      this.exportData = backupData;
    }else{
      this.blotterData = backupData;
      
      this.setSlidersValue();
      this.totalCount= backupData.length;
      if(this.previousFilterfield!=undefined && this.previousFilterfield!="")
      {
        this.sort(this.previousFilterfield,false)
      }
      else{
        this.onKeydownRowsPerPage(this.pageSize,this.blotterData,pageNumber);
      }
      this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
      this.afterFilter=false;
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
    }
    this.loader = false;
    this.clearClientFilter = true;
    this.ToAutoCallAscend=false;
    this.ToProtectionAscend=false;
    this.HistCashflowsAscend=false;
    this.NextObsDateAscend=false;
    this.IndicValuationAscend=false;
    this.MaturityDateAscend=false;
    this.DecisiveULAscend=false;
    this.previousFilterfield="";

  }

  clearWhatIf(){
    this.loader = true;
    this.afterFilter=true;
    this.viewName="";
    this.oneByOne="one";
    this.selectedScenarioUnderlying="Underlying";
    this.selectedSpotVar="Spot % Variation";
    this.selectedMarketSpotVar="Market Spot % Variation";
    this.selectedSorting='Issue Date';
    this.whatIfDataIconFlag=false;
    this.checkWhatIfData=false;
    this.filterPagination=false;
    // this.pageSize = 100; // No change in Records per page on clearing row specific filters | 06-10-2023
    // this.pageNo = 1; // No change in page number on clearing row specific filters | 06-10-2023
    this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
    this.pageLastRecord = this.pageSize;
    this.selectedSpot=false;
    this.selectedMSpot=false;
    //this.getPortfolioData();
    this.newGetPortfolioData();

  }
  // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
  binder(event) {
    switch (event.target.name) {
      case "CapAtRisk-input1":
        this.current_CapAtRisk_StartValue = parseFloat(event.target.value);  
        this.inputchange(event, 1,this.startCapAtRiskValue,this.endCapAtRiskValue);
        break;
      case "CapAtRisk-input2":
        this.current_CapAtRisk_LastValue = parseFloat(event.target.value);  
        this.inputchange(event, 2,this.startCapAtRiskValue,this.endCapAtRiskValue);
        break;
      case "CancelProb-input1":
        this.current_CancelProb_StartValue = parseFloat(event.target.value);  
        this.inputchange(event, 1,this.startCancelProbValue,this.endCancelProbValue);
        break;
      case "CancelProb-input2":
        this.current_CancelProb_LastValue = parseFloat(event.target.value);  
        this.inputchange(event, 2,this.startCancelProbValue,this.endCancelProbValue);
        break;
      case "BarrierD-input1":
        this.current_BarrierD_StartValue = parseFloat(event.target.value); 
        this.inputchange(event, 1,this.startBarrierDValue,this.endBarrierDValue);
        break;
      case "BarrierD-input2": 
        this.current_BarrierD_LastValue = parseFloat(event.target.value)
        this.inputchange(event, 2,this.startBarrierDValue,this.endBarrierDValue);
        break;
      case "IndVal-input1": 
      this.current_IndVal_StartValue = parseFloat(event.target.value); 
        this.inputchange(event, 1,this.startIndValValue,this.endIndValValue);
        break;
      case "IndVal-input2": 
      this.current_IndVal_LastValue = parseFloat(event.target.value);
      this.inputchange(event, 2,this.startIndValValue,this.endIndValValue);
        break;
    }
  }

  // Generalised Input Function
  inputchange(event,num,startValue,endValue) {
    if(event.target.value.length===0){
      if(num===1)
        event.target.value=startValue
      else if(num===2)
        event.target.value=endValue
    }
    if (parseFloat(event.target.value) < startValue) 
      event.target.value = startValue
    else if (parseFloat(event.target.value) > endValue) 
      event.target.value = endValue
  }

  async TimelinePopup(item) {
    try {
      this.popupTitle = `${item.Product_Name} - ${item.External} ${item.ISIN  !== 'NA' ? ('- '.concat(item.ISIN )) : ''}`;
      await this.portfolioService.GetObservationTableData(item.Product_Ref).then((resp) => {
        this.obsTableData = <object[]>resp;
      });
      // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
      if(item.PayOff.toString() === "DT Autocall"){
        await this.portfolioService.GetObservationTableDTData(item.Product_Ref).then((resp) => {
          this.obsTableDataDT = <object[]>resp;
        });
      }
      await this.portfolioService.GetHistoricalTableData(item.Product_Ref).then((resp) => {
        this.histTableData = <object[]>resp;
      });
      await this.portfolioService.GetCancellationData(item.Product_Ref).then((resp) => {
        this.cancellationData = <object[]>resp;
      });
      //// Fetch the dataSource for payments table on opening the timeline popup || FSLINT-51 || Kaustubh S || 06-Feb-2024 || START
      await this.portfolioService.GetInteractivedata({TemplateCode: "USP_Get_Timeline_Payments", CustomerID: item.Client, Measure: item.External})
      .then((resp) => {
        if(resp.length){ ////Assign the table headers and row data properties on payments table dataSource
          this.paymentsTblData.Headers = Object.keys(resp[0]);
          this.paymentsTblData.RowData = resp;
        }
      });
      //// FSLINT-51 || Kaustubh S || 06-Feb-2024 || END
      this.selectedItem = item;
      this.showPopup = true;
    } catch (error) {
      console.log(error);
    }
  }


  async sort(filterfield,flip?:boolean) {
    this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
    let blotterData=[];
    this.previousFilterfield=filterfield;
    var id:any;
    // Case for handling filters
    switch (filterfield) {
      // To autocall case
      case 'KO_Distance':
        id=document.getElementById('KO_Distance')
        if (flip)
        {
          this.storedDirection=this.ToAutoCallAscend;
        }
        else{
          this.ToAutoCallAscend=this.storedDirection
        }
        this.SetSortCss(id,this.ToAutoCallAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.ToAutoCallAscend
        );
        
        if(flip)
        {
          this.ToAutoCallAscend = !this.ToAutoCallAscend;
        }
        // else{
        //   this.ToAutoCallAscend=this.storedDirection
        // }  
        //this.ToAutoCallAscend = flip;
        //this.ToAutoCallAscend = !this.ToAutoCallAscend;
        break;

      // To protection case
      case 'KI_Distance':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('KI_Distance')
        if (flip)
        {
          this.storedDirection=this.ToProtectionAscend;
        }
        else{
          this.ToProtectionAscend=this.storedDirection
        }
        this.SetSortCss(id,this.ToProtectionAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.ToProtectionAscend
        ); 
        if(flip){
        this.ToProtectionAscend = !this.ToProtectionAscend;
        }
        break;

      case 'NextObsDate':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('NextObsDate')
        if (flip)
        {
          this.storedDirection=this.NextObsDateAscend;
        }
        else{
          this.NextObsDateAscend=this.storedDirection
        }
        this.SetSortCss(id,this.NextObsDateAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.NextObsDateAscend
        );
        if(flip)
        {
          this.NextObsDateAscend = !this.NextObsDateAscend;
        }
        break;
      
      case 'Maturity_date':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('Maturity_date')
        if (flip)
        {
          this.storedDirection=this.MaturityDateAscend;
        }
        else{
          this.MaturityDateAscend=this.storedDirection
        }
        this.SetSortCss(id,this.MaturityDateAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.MaturityDateAscend
        );
        if(flip)
        {
          this.MaturityDateAscend = !this.MaturityDateAscend;
        }
        break;

      case 'MTM':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('MTM')
        if (flip)
        {
          this.storedDirection=this.IndicValuationAscend;
        }
        else{
          this.IndicValuationAscend=this.storedDirection
        }
        this.SetSortCss(id,this.IndicValuationAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.IndicValuationAscend
        );
        if(flip)
        {
          this.IndicValuationAscend = !this.IndicValuationAscend;
        }
        break;

      case 'HistCFL':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('HistCFL')
        if (flip)
        {
          this.storedDirection=this.HistCashflowsAscend;
        }
        else{
          this.HistCashflowsAscend=this.storedDirection
        }
        this.SetSortCss(id,this.HistCashflowsAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.HistCashflowsAscend
        );
        if(flip)
        {
          this.HistCashflowsAscend = !this.HistCashflowsAscend;
        }
        break;

      // Decisive Underlying case
      case 'WOPerf':
        console.log("CASE PYSMBOL", filterfield)
        id=document.getElementById('WOPerf')
        if (flip)
        {
          this.storedDirection=this.DecisiveULAscend;
        }
        else{
          this.DecisiveULAscend=this.storedDirection
        }
        this.SetSortCss(id,this.DecisiveULAscend)
        blotterData = this.sortTable(
          this.filteredBackData,
          filterfield,
          this.DecisiveULAscend
        );
        if(flip)
        {
          this.DecisiveULAscend = !this.DecisiveULAscend;
        }
        break;

      default:
        break;
    }
     this.filteredBackData=blotterData;
    // this.onKeydownRowsPerPage(this.pageSize,this.blotterData);
    // if(this.filterPagination)
    // {
    //   this.onKeydownRowsPerPage(this.pageSize,this.filteredBackData);
    // }else{
      this.filterPagination=false;
      this.onKeydownRowsPerPage(this.pageSize,undefined,1);
   // }
      
      
  }

  //Portfolio sort: changes by Prateek & Akash on 29 Aug 2023

  sortTable<T>(data: T[], key, reverse: boolean = false){
    let blankFieldsData = data?.filter((x)=>x[key]==="-" || x[key]==="Expired");
    let notBlankFieldsData = data?.filter((x)=>x[key]!=="-" && x[key]!=="Expired");
    // let blankFieldsData = [];
    // let notBlankFieldsData = [];
    //   if(key === 'KO_Distance') {
    //     blankFieldsData = data.filter((x)=>x[key]==="-" || x[key]==="Expired" || x["koApplicable"]=='N' || x["aliveYN"]!='Alive');
    //     notBlankFieldsData = data.filter((x)=>x[key]!=="-" && x[key]!=="Expired" && x["koApplicable"]=='Y' && x["aliveYN"]=='Alive');
    //   }
    //   else if(key === 'KI_Distance') {
    //     blankFieldsData = data.filter((x)=>x[key]==="-" || x[key]==="Expired" || (x["kiApplicable"]=='N' && x["strikeYN"]=='N') || x["aliveYN"]!='Alive');
    //     notBlankFieldsData = data.filter((x)=>x[key]!=="-" && x[key]!=="Expired" && (x["kiApplicable"]=='Y' || x["strikeYN"]=='Y' ) && x["aliveYN"]=='Alive');
    //   }
    //   else {
    //     blankFieldsData = data.filter((x)=>x[key]==="-" || x[key]==="Expired");
    //     notBlankFieldsData = data.filter((x)=>x[key]!=="-" && x[key]!=="Expired");
    //   }
    
    let sortedData = notBlankFieldsData
    .sort((a: any, b: any) => {
      if(key.toLowerCase().includes("date"))
      {
        //console.log(key)
        //console.log(new Date(b.Start_Date).getTime() - new Date(a.Start_Date).getTime())
        const dateA: any = new Date(a[key]);
        //  console.log(dateA)
        const dateB: any = new Date(b[key]);
        //  console.log(dateB)
        //  console.log(dateB - dateA);
         
          // return dateA - dateB;
          if(reverse)
         {
          return dateA - dateB;
         }
         else{
          return dateB - dateA;
          
         }
        //  return dateB - dateA;
      }
      else {
        //console.log("a[key]",a[key],"b[key]",b[key],"  ",parseFloat(a[key]),"  ", parseFloat(b[key]))
        if ((parseFloat(a[key]) ? parseFloat(a[key]) : 0) < (parseFloat(b[key]) ? parseFloat(b[key]) : 0)) {
          return reverse ? -1 : 1;
        } else if ((parseFloat(a[key]) ? parseFloat(a[key]) : 0) > (parseFloat(b[key]) ? parseFloat(b[key]) : 0)) {
          return reverse ? 1 : -1;
        }
      }  
    });
     console.log(sortedData)
     sortedData = sortedData.concat(blankFieldsData);
    return sortedData;
  }

  // Product Situation and Format Filter Sorting changes | 09-Oct-2023
  groupTable<T>(data: T[], key, sortDir){
    // Modified by Akash and Prateek on 01-09-2023
    var sortedData;
    var subfieldPriority: Record<string, number> = {};

    if(key == "Format"){
      subfieldPriority['Deposit'] = 0;
      subfieldPriority['Note'] = 1;
      subfieldPriority['OTC'] = 2;
      subfieldPriority['Swap'] = 3;   
    }

    else if(key == "EdgeColor"){
      subfieldPriority['Red'] = 0;
      subfieldPriority['Orange'] = 1;
      subfieldPriority['Yellow'] = 2;
      subfieldPriority['White'] = 3;
      subfieldPriority['Green'] = 4;  
      subfieldPriority['Black'] = 5;    
    }

    sortedData = data.sort((a: any, b: any) => {
        
      //console.log("a[key]",a[key],"b[key]",b[key],"  ",subfieldPriority[a[key]],"  ", subfieldPriority[b[key]])
      if ((subfieldPriority[a[key]] ? subfieldPriority[a[key]] : 0) < (subfieldPriority[b[key]] ? subfieldPriority[b[key]] : 0)) {
        return !sortDir ? -1 : 1;
      } else if ((subfieldPriority[a[key]] ? subfieldPriority[a[key]] : 0) > (subfieldPriority[b[key]] ? subfieldPriority[b[key]] : 0)) {
        return !sortDir ? 1 : -1;
      } 
  });

    console.log(sortedData)
    return sortedData;
  }
  portfolioSort(afterfilter?:boolean){
    let checkDirection:boolean;
    let blotterData=[];
    //let filterfield
    this.showWhatIFFlags = new Array(this.showWhatIFFlags.length).fill(false);
    console.log("Portfolio sort field ", this.selectedSorting);
    // if(previousSortByfield)
    // {
    //   filterfield=previousSortByfield;
    // }
    // else{
    //   filterfield = this.selectedSorting;
    // }
    let filterfield = this.selectedSorting;//event?.target.value;
    console.log("diection",this.direction, this.selectedSorting);
    this.filterPagination=false; //after dead check-to enable sort
    if(this.direction=="Ascending")
    {
      checkDirection=true;
    }
    else{
      checkDirection=false;
    }
    switch (filterfield) {
      case 'Issue Date':
        this.disableDirection=false;
        console.log("CASE Port_sort_PYSMBOL", filterfield)
        blotterData = this.sortTable(
          this.filteredBackData,
          "Start_Date",
          checkDirection
        );
        //this.direction = !this.direction;
        break;

      case 'Notional':
        this.disableDirection=false;
        console.log("CASE Port_sort_PYSMBOL", filterfield)
        blotterData = this.sortTable(
          this.filteredBackData,
          "Notional_Amt",
          checkDirection
        );
        //this.direction = !this.direction;
        break;

        case 'Format':
          this.disableDirection=false;
        console.log("CASE Port_sort_PYSMBOL", filterfield)
        blotterData = this.groupTable(
          this.filteredBackData,
          "Format",
          checkDirection
          // this.upfrontAscend
        );
        break;

        //Added by Akash and Prateek on 01-09-2023
        case 'Product Situation':
          this.disableDirection=false;
        console.log("CASE Port_sort_PYSMBOL", filterfield)
        blotterData = this.groupTable(
          this.filteredBackData,
          "EdgeColor",
          checkDirection
          // this.upfrontAscend
        );
        break;
    }
    this.filteredBackData=blotterData;
    if(afterfilter==false || afterfilter==undefined)
    {
    this.onKeydownRowsPerPage(this.pageSize,undefined,1);
    }
    // this.onKeydownRowsPerPage(this.pageSize,undefined,1);
  }
  //END
  //Used to set the CSS class for the span tag in the last column of observation table
  SetStatusCss(sts: string, payout: string, ...args: string[]): string{
    try {
      //check if status is 'PENDING', if true then return question mark css or else proceed ahead assuming that the second value for status will always be 'YES'.
      if(sts.toUpperCase() === 'PENDING') return 'question';
      
      //Today's date is after observation date, now can apply tick/hyphen/cross mark
      if(+payout < 0) return 'red-cross';
      if(+payout === 0) return 'yellow-hyphen';
      const sum = args.reduce((sum: number, curr) => sum + (+curr || 0) , 0);
      if(sum <= +payout) return 'dark-green tick';
      if(sum > +payout) return 'light-green tick';
      return '';
    } catch (error) {
      console.log(error);
    }
  }

  // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
  setStatusCssDt(issueDate: string, payout: string,): string{
    try {
      const currentDate: string = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
      const targetDate: string = this.datepipe.transform(issueDate, 'dd-MMM-yyyy');
      if(targetDate > currentDate) return 'question';
      if(Number(payout) > 0){
        return 'dark-green tick';
      }
      return 'question';
    } catch (error) {
      console.log(error);
    }
  }

  SetPayoutOpacity(sts: string): string{
    try {
      if(sts.toUpperCase() === 'PENDING') return 'opacity-50';
      return '';
    } catch (error) {
      console.log(error);
    }
  }

  ReloadTimeline(){
    try {
      //Reload the child component app-underlying-prices || START
      this.isVisible.next(false);
      setTimeout(() => {
        this.isVisible.next(true);
      }, 1);
      //Reload the child component app-underlying-prices || END

      //Reload the observation table || START
      this.TimelinePopup(this.selectedItem);
      //Reload the observation table || END
    } catch (error) {
      console.log(error);
    }
  }

  async getWhatIfDataEntry(item, entry) {
    try {
      this.showWhatIFFlags[entry] = !this.showWhatIFFlags[entry];
      this.whatIfData[entry] = await this.portfolioService.GetWhatIfDataRes(item.External);
      console.log(this.whatIfData);
      console.log(this.showWhatIFFlags[entry]);
    } catch (error) {
      console.log(error);
    }
  }

  goToUCP(searchISIN, i, TokenId, Queue_Id) {
    console.log('Hello', i, window.location.origin + '/ClientSelfServicePortal/workflow/blotter' + "?Master_Popup=POPUP&ViewWorkflow", searchISIN);
    //window.open(window.location.origin + '/ClientSelfServicePortal/' + "dealentry?WorkflowMode=UCPWFL&DealNum=&NoteMasterid=N:" + searchISIN + "&TokenID=T:" + TokenId + "&QueueId=Q:" + Queue_Id + "&ButtonID=&Master_Popup=POPUP&ProductView&UserGroup=SantanderDealer&LoginID=SantanderDealer1");
    window.open(window.location.href.replace("Portfolio", "") + "ucpdealentry?WorkflowMode=UCPWFL&DealNum=&NoteMasterid=N:" + searchISIN + "&TokenID=T:" + TokenId + "&QueueId=Q:" + Queue_Id + "&ButtonID=&Master_Popup=POPUP&ProductView&UserGroup=SantanderDealer&LoginID="+AppConfig.settings.oRes?.userID);
  }


  exportAsXLSX() {
    try {

      var exlBlotterDataRows = []; 
      var assetsExcelData =[];

      this.filteredBackData.forEach((item) => {
 
          assetsExcelData.push({
            'Product Reference/Notional Size': item.Product_Name,
            'External Ref': item.External,
            'Decisive Underlying':item.Worst +" ("+item.WOPerf+"%)", 
            'To Autocall':item.KO_Distance,
            'To Protection':item.KI_Distance ,
            'Next Obs.':item.NextObsDate,
            'Maturity':item.Maturity_date ,
            'Indic. Valuation':item.MTM,
            'Hist. Cashflows':item.HistCFL,
          });
        // }
        
      });
      this.excelService.exportAsExcelFile(assetsExcelData, 'SP_Portfolio_Snapshot'+this.datepipe.transform(new Date(), 'dd-MMM-yyyy'));
    } catch (error) {
      console.log(error);
    }
  }

  async getScenarioUnderlying()
  {
    let res= await this.portfolioService.GetScenarioUnderlying();
    console.log("UNDERLYING", res);
    this.scenariouUnderlying=res;
  }

  async Get_Portfolio_Scenarios(oneByOne, underlying,spot)
  {
    this.loader=true;
    console.log(this.oneByOne)
    //let res= await this.portfolioService.Get_Portfolio_Scenarios(oneByOne,underlying,spot);

    let param:any={
      TemplateCode:"USP_Get_SP_Portfolio_Scenario",
      EntityID:"27",
      UserId: AppConfig.settings.oRes?.userID,//"SantanderDealer1",
      CustomerID:"",
      EventType:oneByOne,
      FromDate:"",
      ToDate:"",
      Measure:underlying,
      Sector:spot,
      RowsPerPage:"",
      PageNo:"",
      WhereClause:""
      }
    let mainData1 = await this.portfolioService.GetInteractivedata(param);
      console.log("SCENARIO MAIN DATA",mainData1)
    if(mainData1)
    {
        this.loader=false;
        let blotterData:any = [];
        blotterData = await mainData1;
        //this.selectedSorting='Issue Date';
        this.formatData=[];
        this.currencyData=[];
        this.productTypeData=[];
        this.ulTypeData=[];
        let kI_Distance:any[];
        let mtm:any[];
        let capAtRisk:any[];
        let cancelProb:any[];

        this.groupArr = [];
        this.clientArr = [];
        this.intRefArr = [];
        this.typeArr = [];
        this.tutelaArr = [];
        this.subtutelaArr = [];
        this.branchArr = [];
        this.territoryArr = [];
        this.zoneArr = [];

        this.formatData=blotterData.map(item=>item["Format"]).sort((a,b) => a > b ? 1 : -1)
        this.formatData=[...new Set(this.formatData)];

        this.currencyData=blotterData.map(item=>item["Currency"]).sort((a,b) => a > b ? 1 : -1);
        this.currencyData=[...new Set(this.currencyData)];

        this.productTypeData=blotterData.map(item=>item["PayOff"]).sort((a,b) => a > b ? 1 : -1);
        this.productTypeData=[...new Set(this.productTypeData)];

        this.ulTypeData=blotterData.map(item=>item["UL_Type"]).sort((a,b) => a > b ? 1 : -1);
        this.ulTypeData=[...new Set(this.ulTypeData)];

        [...new Set(blotterData.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.groupArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.clientArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.intRefArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.typeArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.tutelaArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.subtutelaArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.branchArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.territoryArr.push(newObj);
        });
        [...new Set(blotterData.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.zoneArr.push(newObj);
        });

        // Added by MuditB || 30-Aug-23 || Start || SlidersFilter
        // Capital risk
        capAtRisk=blotterData.map(item=>item["CapAtRisk"]);
        capAtRisk=[...new Set(capAtRisk)];
        console.log("capAtRisk data", capAtRisk);
        let maxCapAtRisk = capAtRisk.reduce((a, b) => Math.max(a, b));
        let minCapAtRisk = capAtRisk.reduce((a, b) => Math.min(a, b));
        console.log("MIN minCapAtRisk ", minCapAtRisk, typeof minCapAtRisk);
        console.log("MAX maxCapAtRisk ", maxCapAtRisk, typeof maxCapAtRisk);
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
        this.options1=opts1;

        //Cancel PRob
        cancelProb=blotterData.map(item=>item["CancelProb"]);
        cancelProb=[...new Set(cancelProb)];
        console.log("cancelProb data", cancelProb);
        let maxCancelProb = cancelProb.reduce((a, b) => Math.max(a, b));
        let minCancelProb = cancelProb.reduce((a, b) => Math.min(a, b));
        console.log("MIN minCancelProb ", minCancelProb, typeof minCancelProb);
        console.log("MAX maxCancelProb ", maxCancelProb, typeof maxCancelProb);
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
        this.options2=opts2;

        //BArrier Distance
        kI_Distance=blotterData.map(item=>item["KI_Distance"]);
        kI_Distance=[...new Set(kI_Distance)];
        console.log("kI_Distance data", kI_Distance);
        let maxKI = kI_Distance.reduce((a, b) => Math.max(a, b));
        let minKI = kI_Distance.reduce((a, b) => Math.min(a, b));
        console.log("MIN KI ", minKI, typeof minKI);
        console.log("MAX KI ", maxKI, typeof maxKI);
        this.startBarrierDValue = minKI;
        this.endBarrierDValue = maxKI;
        this.current_BarrierD_StartValue = this.startBarrierDValue
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

        //indicative value
        mtm=blotterData.map(item=>item["MTM"]);
        mtm=[...new Set(mtm)];
        console.log("mtm data", mtm);
        let maxMTM = mtm.reduce((a, b) => Math.max(a, b));
        let minMTM = mtm.reduce((a, b) => Math.min(a, b));
        console.log("MIN MTM ", minMTM, typeof minMTM);
        console.log("MAX MTM ", maxMTM, typeof maxMTM);
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
          this.options4=opts4;
          // Added by MuditB || 30-Aug-23 || End || SlidersFilter

        // if(this.LiveCheck)
        // {
        //   this.blotterData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
        // }
        // else{
        //   this.blotterData = blotterData;
        // }
        // this.totalCount=this.blotterData.length;
        // let mainData = blotterData;
        // this.unFilteredBlotterData = mainData;
        // this.filteredData = this.unFilteredBlotterData
        // console.log(this.blotterData)
        // this.FilterForAll();
        // // BY DEFAULT Sorting by Issue Date        
        // //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
        // this.loader = false;



        //blotterData = this.sortTable(blotterData, "Start_Date");
      if(this.LiveCheck)
      {
        this.blotterData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
        this.filteredBackData=blotterData.filter((s:any)=>s.AliveYN=="Alive");
      }
      else{
        this.blotterData = blotterData;
        this.filteredBackData=blotterData;
      }
      // if(this.afterFilter)
      // {
      //   this.FilterForAll();
      // }
      this.setSlidersValue();
      this.totalCount=this.blotterData.length;
      let mainData = blotterData;
      this.unFilteredBlotterData = mainData;
      this.filteredData = this.unFilteredBlotterData;
      //this.onKeydownRowsPerPage(10);
      // if(this.afterFilter)
      // {
        this.FilterForAll();
      //}
      // if(!this.filterPagination)
      // {
      // this.onKeydownRowsPerPage(this.pageSize);
      // }
      // this.onKeydownRowsPerPage(this.pageSize);
      // BY DEFAULT Sorting by Issue Date        
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
      console.log(this.blotterData)
      this.loader = false;
      
    }
    else{
      this.loader=false;
    }
    console.log("Get_Portfolio_Scenarios", mainData1);
    //this.scenariouUnderlying=res;
  }
  
  getScenarioAnalysis()
  {
    let spot=(this.selectedSpotVar/100).toFixed(2);
    let marketSpot=(this.selectedMarketSpotVar/100).toFixed(2);
    console.log(this.oneByOne,this.selectedScenarioUnderlying,spot.toString());
    if(this.oneByOne=="one")
    {
      console.log(this.oneByOne,this.selectedScenarioUnderlying,this.selectedSpotVar);
      this.Get_Portfolio_Scenarios(this.oneByOne,this.selectedScenarioUnderlying,spot.toString())
    }
    else if(this.oneByOne=="market")
    {
      console.log(this.oneByOne,"",this.selectedMarketSpotVar);
      this.Get_Portfolio_Scenarios(this.oneByOne,"",marketSpot.toString())
    }
  }
 
  prevBtnClicked(data?:any) {
    try {
      let begin:number;
      let end:number;
      if (this.pageNo > 1) {
        this.pageNo = (parseInt(this.pageNo.toString())) - 1;
        //this.setMPGData(true);
        begin = (((parseInt(this.pageNo.toString())) - 1) * (parseInt(this.pageSize.toString())));
        end = begin + parseInt(this.pageSize.toString());
        this.pageStart=begin+1;
        this.pageEnd=end;
        let tempArray:any;
        // if(this.filterPagination)
        // {
        //   // this.blotterData = data?.slice(begin, end);
        //   this.noPagefirst=true; //by default page first
        //   this.FilterForAll();
        // }
        // else{
          // this.noPagefirst=false; //by default page first
          // if(this.LiveCheck)
          // {
          //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
          // }
          // if(this.LiveCheck && !this.DeadCheck)
          // {
          //   this.loader=true;
          //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
          // }
          // else if(this.DeadCheck && !this.LiveCheck)
          // {
          //   this.loader=true;
          //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN!="Alive");
          // }
          // else if( !this.LiveCheck &&!this.DeadCheck)
          // {
          //   tempArray=this.filteredBackData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
          // }

          
          if(this.LiveCheck && !this.DeadCheck)
          {
           
            tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
          }
          else if(this.DeadCheck && !this.LiveCheck)
          {
            
            tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN!="Alive");
          }
          else if( !this.LiveCheck &&!this.DeadCheck)
          {
            tempArray=this.filteredBackData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
          }
          else{
            tempArray = this.filteredBackData;
          }
          this.blotterData = tempArray?.slice(begin, end);
        // }

        if(this.blotterData.length<(end-this.pageStart))
        {
          this.pageEnd=this.pageStart+this.blotterData.length-1;
        }
        else{
          this.pageEnd=end;
        }
     
        // this.blotterData = this.unFilteredBlotterData?.slice(begin, end);
        //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
        console.log("SLICED ARRAY",this.blotterData);

        // Reset the viewport's scrollTop to 0 to display the top of the next page
        const viewportElement = this.viewport.elementRef.nativeElement;
        viewportElement.scrollTop = 0;

      }
    } catch (error) {
      console.log(error);
    }
  }

  nextBtnClicked(data?:any) {
    try {

      let begin:number;
      let end:number;
      
      //this.setMPGData(true);
      let y=(parseInt(this.pageNo.toString()))*this.pageSize
      if(y<=this.totalCount)
      {
        this.pageNo = (parseInt(this.pageNo.toString())) + 1;
        begin= (((parseInt(this.pageNo.toString())) - 1) * (parseInt(this.pageSize.toString())));
      end= begin + parseInt(this.pageSize.toString()) ;
      this.pageStart=begin+1;
      this.pageEnd=end;
      let tempArray:any;
      // if(this.filterPagination)
      // {
      //   this.noPagefirst=true; //by default page first
      //   this.FilterForAll();
      // }
      // else{
        // this.noPagefirst=false; //by default page first

        // if(this.LiveCheck)
        // {
        //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
        // }
        // else{
        //   tempArray = this.filteredBackData;
        // }
        
        if(this.LiveCheck && !this.DeadCheck)
        {
          
          tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
        }
        else if(this.DeadCheck && !this.LiveCheck)
        {
         
          tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN!="Alive");
        }
        else if( !this.LiveCheck &&!this.DeadCheck)
        {
          tempArray=this.filteredBackData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
        }
        else{
          tempArray = this.filteredBackData;
        }
        this.blotterData = tempArray?.slice(begin, end);
      //}
      
      if(this.blotterData.length<(end-this.pageStart))
      {
        this.pageEnd=this.pageStart+this.blotterData.length-1;
      }
      else{
        this.pageEnd=end;
      }

      // this.blotterData = this.unFilteredBlotterData?.slice(begin, end);
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");

      // Reset the viewport's scrollTop to 0 to display the top of the next page
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
      console.log("SLICED ARRAY",this.blotterData)
      }

    } catch (error) {
      console.log(error);
    }
  }

  onKeydownRowsPerPage(value: any, data?:any,pageNumber?:number) {
    try {
      console.log('Rows per page value : ' + value);
      let begin:number;
      let end:number;
      this.pageSize = value;
      if(pageNumber)
      {
        this.pageNo=pageNumber;
      }
      //pageNumber? this.pageNo=pageNumber:this.pageNo=this.pageNo
      //this.pageNo = 1;
      begin= (((parseInt(this.pageNo.toString())) - 1) * (parseInt(this.pageSize.toString())));
      end= begin + parseInt(this.pageSize.toString());
      this.pageStart=begin+1;
      this.pageEnd=end;
      let tempArray:any;
      // if (data)
      // {
      //   this.blotterData = data?.slice(begin, end);
      //   this.filterPagination=true;
        
      // }
      // else{
        if(this.filterPagination)
        {
          this.blotterData = data?.slice(begin, end);
        }
        else{
          
          // if(this.LiveCheck)
          // {
          //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
          // }
          // else{
          //   tempArray = this.filteredBackData;
          // }

          if(this.LiveCheck && !this.DeadCheck)
          {
            
            tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
          }
          else if(this.DeadCheck && !this.LiveCheck)
          {
            
            tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN!="Alive");
          }
          else if( !this.LiveCheck &&!this.DeadCheck)
          {
            tempArray=this.filteredBackData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
          }
          else{
            tempArray = this.filteredBackData;
          }

          this.blotterData = tempArray?.slice(begin, end);
        }
        // this.blotterData = this.unFilteredBlotterData?.slice(begin, end);
        this.filterPagination=false;
        
      // }
      // if(this.blotterData?.length==0 || this.blotterData==undefined)
      // {
      //   this.pageNo=1;
      //   this.filterPagination=false;
      //   this.onKeydownRowsPerPage(this.pageSize);
        
      // }

      if(this.blotterData?.length<(end-this.pageStart))
      {
        this.pageEnd=this.pageStart+this.blotterData.length-1;
      }
      else{
        this.pageEnd=end;
      }
      // this.blotterData = this.unFilteredBlotterData?.slice(begin, end);
      console.log("SLICED ARRAY",this.blotterData);
      // Reset the viewport's scrollTop to 0 to display the top of the next page
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
      //this.setMPGData();
    } catch (error) {
      console.log(error);
    }
  }

  onKeydownPageNo(value: any,data?:any) {
    try {
      let begin:number;
      let end:number;
      console.log('Page no value : ' + value);
      this.pageNo = value;
      //this.setMPGData(true);
      let y=((parseInt(this.pageNo.toString()))-1)*this.pageSize
      if(y<=this.totalCount)
      {
        begin = (((parseInt(this.pageNo.toString())) - 1) * parseInt(this.pageSize.toString()));
      end = begin + parseInt(this.pageSize.toString());
      this.pageStart=begin+1;
      this.pageEnd=end;
      let tempArray:any;
      if(this.filterPagination)
      {
        // this.blotterData = this.blotterData?.slice(begin, end);
        this.FilterForAll();
      }
      else{
        
        // if(this.LiveCheck)
        // {
        //   tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
        // }
        // else{
        //   tempArray = this.filteredBackData;
        // }
        
        if(this.LiveCheck && !this.DeadCheck)
        {
          
          tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN=="Alive");
        }
        else if(this.DeadCheck && !this.LiveCheck)
        {
          
          tempArray=this.filteredBackData.filter((s:any)=>s.AliveYN!="Alive");
        }
        else if( !this.LiveCheck &&!this.DeadCheck)
        {
          tempArray=this.filteredBackData.filter((s:any)=>(s.AliveYN=="Alive" && s.AliveYN!="Alive"));
        }
        else{
          tempArray = this.filteredBackData;
        }
        this.blotterData = tempArray?.slice(begin, end);
      }

      if(this.blotterData.length<(end-this.pageStart))
      {
        this.pageEnd=this.pageStart+this.blotterData.length-1;
      }
      else{
        this.pageEnd=end;
      }
      // this.blotterData = this.unFilteredBlotterData?.slice(begin, end);
      //this.blotterData = this.sortTable(this.blotterData, "Start_Date");
      console.log("SLICED ARRAY",this.blotterData);
      // Reset the viewport's scrollTop to 0 to display the top of the next page
      const viewportElement = this.viewport.elementRef.nativeElement;
      viewportElement.scrollTop = 0;
      }

    } catch (error) {
      console.log(error);
    }
  }

  async handlePage(event) {
    try {
      //Changed by Amogh K | 8-mar-2022
      this.noOfRecords = event.length;
      this.pageNo = event.pageNo;
      this.pageSize = parseInt(event.pageSize);
      this.pageIndex = event.pageNo;

      let y = this.pageIndex * this.pageSize;
      if(y >= this.noOfRecords || event.reload){
        this.pageStart = 0;
        this.pageNo=0;
        this.pageIndex = 0;
      }
      else if(y < 0){
        // this.pageStart = Math.floor(this.noOfRecords / this.pageSize) * this.pageSize;
        this.pageNo= Math.floor(this.noOfRecords / this.pageSize);
        this.pageStart = this.pageNo * this.pageSize + 1 > this.noOfRecords ? ((this.pageNo -1 ) * this.pageSize) : ((this.pageNo) * this.pageSize) // Changes done for corner case by Jyoti S || 03-May-2023 
        this.pageIndex = Math.floor(this.noOfRecords / this.pageSize);
        // Changes done for corner case by Jyoti S || 24-Apr-2023
      }
      else{
        this.pageStart = y;
      }

      console.log("pageStart",this.pageStart,"noOfRecords",this.noOfRecords,"pageNo",this.pageNo,"pageSize",this.pageSize,"pageIndex",this.pageIndex,)
      //await this.getRFQs();
      //<DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
      // this.selectedRFQ = -1;
      // this.selectedQuote = -1;
      // this.selectedRFQIndex = -1;
      // this.quotes = [];
      // this.solveForHeaderTxt = "Solve For Price";
      // this.showSub = false;
      // this.subscription = false;
      // this.timelineArray = [];
      //</DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
      // this.currentItemsToShow = this.rfqs.slice(
      //   this.pageIndex * this.pageSize,
      //   this.pageIndex * this.pageSize + this.pageSize
      // );
    } catch (error) {
      //console.log(error);
    }
  }
  checkNaN(val: any): boolean {
    try {
      return isNaN(val);
    } catch (error) {
      console.log(error);
    }
  }
  ExportTables() {
    try {
      this.popupLoader = true;
      // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
      const selectors = ['.obs-table', '.hist-table table', '.payments-table table']; ////Added '.payments-table table' || FSLINT-51 || Kaustubh S || 06-Feb-2024
      const sheetNames = ['Observation Table', 'Historical Performance', 'Payments Table']; ////Added 'Payments Table' || FSLINT-51 || Kaustubh S || 06-Feb-2024
      const file = `ObservationTable_${this.selectedItem['External']}`;
      // remove 
      const removedElements: HTMLElement[] = [];
      // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
      removedElements.push(document.querySelector('.obs-table .title'));
      removedElements.push(document.querySelector('.obs-table > div:last-child table tbody tr:last-child td:first-child div>div'));
      removedElements.push(document.querySelector('.obs-table > div:last-child table tbody tr:last-child td:nth-child(2) div>div'));
      if(this.histTableData.length > 2){
        removedElements.push(document.querySelector('.hist-table table tbody tr:first-child td:first-child div>div'));
      }
      removedElements.push(document.querySelector('.hist-table table tbody tr:nth-last-child(2) td:first-child div>div'));
      // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
      document.querySelector('.obs-table .title').remove();
      document.querySelectorAll('.obs-table table .infoImgDiv').forEach(ele => ele.remove());
      document.querySelectorAll('.hist-table table .infoImgDiv').forEach(ele => ele.remove());

      this.excelService.ExportDOMTablesAsExcel(selectors, sheetNames, file);

      // FSLINT-56 | Double Tranche : Show Additional Observation table on Performance Timeline | 20-Mar-2024
      document.querySelector('.obs-table').insertBefore(removedElements.shift(), document.querySelector('.obs-table').firstChild);
      document.querySelector('.obs-table > div:last-child table tbody tr:last-child td:first-child div').appendChild(removedElements.shift());
      document.querySelector('.obs-table > div:last-child table tbody tr:last-child td:nth-child(2) div').appendChild(removedElements.shift());
      if(this.histTableData.length > 2) {
        document.querySelector('.hist-table table tbody tr:first-child td:first-child div').appendChild(removedElements.shift());
      }
      document.querySelector('.hist-table table tbody tr:nth-last-child(2) td:first-child div').appendChild(removedElements.shift());
      this.popupLoader = false; 
    } catch (error) {
      console.log(error);
    }
  }

  async SaveMainPDF(elementID?: string) {
    try {
      this.popupLoader = true;
      const opaqueElements: PDFElementStyles[] = [
        {
          domQuerySelector: '.header-row',
          cssStyles: {
            'height' : '80px',
            'padding-top':'30px'
          }
        },
        {
          domQuerySelector: '.header-row .logo',
          cssStyles: {
            'opacity' : '1'
          }
        },
        {
          domQuerySelector: '#PortfolioData .Client.pdfOpaque',
          cssStyles: {
            'opacity' : '1',
            'display' : 'flex',
            'justify-content': 'space-between',
            'padding':'30px 10px 0px 10px'
          }
        },
        {
          domQuerySelector: '#PortfolioData .Status.pdfOpaque',
          cssStyles: {
            'opacity' : '1',
            'display' : 'flex',
            'justify-content': 'flex-end',
            'padding':'5px 10px 0px 10px'
          }
        },
        {
          domQuerySelector: '#PortfolioData .graph-div .graph-layouts .ylabel',
          cssStyles: {
            'top' : '300px',
          }
        },
        {
          domQuerySelector: '.header-row .icons .pdfOpaque',
          cssStyles: {
            'opacity' : '1',
            'display' : 'block',
            'position' : 'fixed',
            'right' : '0px',
            'top':'0px',
            'min-width' : '170px',
          }
        },
        {
          domQuerySelector: '.header-row .icons .popupSticker',
          cssStyles: {
            'position' : 'fixed',
            'right' : '20px',
          }
        },
        {
          domQuerySelector: '#PortfolioData .liquidation',
          cssStyles: {
            'opacity' : '1',
            'display' : 'flex',
            'justify-content' : 'end',
            'height' : '50px',          
            'align-items' : 'end',
            'margin-right' : '50px'
          }
        }
      ];
      const tpop = document.getElementById('PortfolioData').clientHeight + 500;
      const watermarkText:string = 'For internal use only'
      await this.excelService.ExportDomAsPDF(elementID || 'PortfolioData', `PortfolioData`, opaqueElements, {height: tpop},watermarkText);
      this.popupLoader = false;

      // const docDefinition = {
      //   content: [
      //     {
      //       table: {
      //        // headerRows: 1,
      //         body: this.filteredBackData
      //         // body: 
      //         // [
      //         //   // Explicitly define headers as the first row
      //         //   ['Header 1', 'Header 2', 'Header 3'],
      //         //   ...this.filteredBackData, // Include your table data variable
      //         // ],
      //       }
      //     }
      //   ]
      // };
  
      // pdfMake.createPdf(docDefinition).download('table-data.pdf');
    
    } catch (error) {
      console.log(error);
    }
  }

  async SavePDF(elementID?: string) {
    try {
      this.popupLoader = true;
      const opaqueElements: PDFElementStyles[] = [
        {
          domQuerySelector: '.header-row',
          cssStyles: {
            'height' : '80px',
            'padding-top':'30px'
          }
        },
        {
          domQuerySelector: '.header-row .logo',
          cssStyles: {
            'opacity' : '1'
          }
        },
        // {
        //   domQuerySelector: '#timelinePopupPDF .Client.pdfOpaque',
        //   cssStyles: {
        //     'opacity' : '1',
        //     'display' : 'flex',
        //     'justify-content': 'space-between',
        //     'padding':'18px 7px 18px 7px'
        //   }
        // },
        // {
        //   domQuerySelector: '#timelinePopupPDF .Status.pdfOpaque',
        //   cssStyles: {
        //     'opacity' : '1',
        //     'display' : 'flex',
        //     'justify-content': 'flex-end',
        //     'padding':'0px 7px 18px 7px'
        //   }
        // },
        {
          domQuerySelector: '#timelinePopupPDF .graph-div .graph-layouts .ylabel',
          cssStyles: {
            'top' : '300px',
          }
        },
        {
          domQuerySelector: '.header-row .icons .pdfOpaque',
          cssStyles: {
            'opacity' : '1',
            'display' : 'block',
            'position' : 'fixed',
            'right' : '0px',
            'top':'0px',
            'min-width' : '170px',
          }
        },
        {
          domQuerySelector: '.header-row .icons .popupSticker',
          cssStyles: {
            'position' : 'fixed',
            'right' : '20px',
          }
        },
        {
          domQuerySelector: '#timelinePopupPDF .liquidation',
          cssStyles: {
            'opacity' : '1',
            'display' : 'flex',
            'justify-content' : 'end',
            'height' : '50px',          
            'align-items' : 'end',
            'margin-right' : '50px'
          }
        }
      ];
      const tpop = document.getElementById('timelinePopupPDF').clientHeight + 500;
      const watermarkText:string = 'For internal use only'
      await this.excelService.ExportDomAsPDF(elementID || 'timelinePopupPDF', `Timeline_${this.selectedItem['External']}`, opaqueElements, {height: tpop},watermarkText);
      this.popupLoader = false;
    } catch (error) {
      console.log(error);
    }
  }
  checkSpot()
  {
    console.log(this.selectedSpotVar);
    if(this.selectedSpotVar!= 'Spot % Variation')
    {
      this.selectedSpot=true;
    }
    else{
      this.selectedSpot=false;
    }
  }
  checkMarketSpot()
  {
    console.log(this.selectedMarketSpotVar);
    if(this.selectedMarketSpotVar!= 'Market Spot % Variation')
    {
      this.selectedMSpot=true;
    }
    else{
      this.selectedMSpot=false;
    }
  }
  disableULType()
  {
    console.log(this.selectedUnderlying)
    if(this.selectedUnderlying!="")
    {
      this.checkULType=true;
    }
    else
    {
      this.checkULType=false;
    }
    console.log(this.checkULType)
  }
  async getDataForExport()
  {
    let param:any={
      TemplateCode:"USP_Export_SP_Portfolio_Snapshot_Excel",
      EntityID:"27",
      UserId: AppConfig.settings.oRes?.userID,//"SantanderDealer1",
      CustomerID:"",
      EventType:"",
      FromDate:"",
      ToDate:"",
      Measure:"",
      Sector:"",
      RowsPerPage:"",
      PageNo:"",
      WhereClause:""
      }
    // let mainData1 = await this.portfolioService.GetInteractivedata(param);
    //   console.log("SCENARIO MAIN DATA",mainData1)
    // if(mainData1)
    // {
    //    console.log("EXPORT DATA", mainData1)
    //   //this.FilterForAll();
    this.exportData = await this.portfolioService.GetInteractivedata(param);
    this.exportDataForFilter = this.exportData;
      console.log("EXPORT DATA",this.exportData)
  // }
  }

  // Added by MuditB || 30-Aug-23 || Start || Export Excel Using new Service
  exportAsXLSX_2(){
    try {
      this.excelDataFlag = true;
      this.FilterForAll();
      console.log("Filtered EXPORT DATA", this.exportData);
      this.excelDataFlag = false;
      var assetsExcelData =[];
  
      this.exportData.forEach((item) => {
        
        assetsExcelData.push({
          'External Number': item.External,
          'Desc.': item.Product_Name,
          'Counterparty (GLCS)': item.Client,
          'Notional':item.Notional_Amt, 
          'Currency':item.Currency,
          'Issue Date':item.Start_Date ,
          'Next Obs Date': item.NextObsDate,
          'Expiry Date': item.Expiry_date,
          'Maturity Date':item.Maturity_date,
          'WorstOf Component':item.Worst ,
          'WorstOf Strike':item.WorstPerformingStrikePrice,
          'WorstOf Closing ref Price':item.WorstPerformingPrice,
          'Performance (%)':item.WOPerf,
          'Product':item.PayOff,
          'GuaranteedCoupon':item.GuaranteedCoupon,
          'Has Digital?':item.HasDigital,
          'High Digital Level':item.DigitalLevel,
          'Digital Condition':item.DigitalCondition,
          'Digital Coupon':item.DigitalCoupon,
          'Digital Memory':item.DigitalMemory,
          'Digital Payment Date':item.DigitalPaymentDate,
          'Has Call?':item.Hascall,
          'High Call Level':item.HighCallLevel,
          'Call Condition':item.CallCondition,
          'Call Coupon':item.CallCoupon,
          'Call Payment Date':item.CallPaymentDate,
          'Upside':item.Upside,
          'Put':item.Put,
          'Strike protection':item.StrikeProtection,
          'To Protection':item.ToProtection,
          '% Cap at Risk': { t: 'n', v: item.CapAtRisk / 100 , z: '0.00%'},
          'Hist. Cashflows':item.Historical,
          'Indic. Valuation': { t: 'n', v: item.MTM / 100 , z: '0.00%'},      
          'Structured Note ISIN':item.StructuredNoteISIN,
          'SUCURSAL':item.Branch,
          'F/J':item.Internal_J,
          'TERRITORIAL':item.Territory,
          'ZONA':item.Zone,
          'TUTELA':item.TUTELA,
          'SUBTUTELA':item.SubTUTELA,
          'Fixings': item.Fixings,
          'Und1': item.Und1,
          'Strike1': item.Strike1,
          'refClosingPrice1': item.refClosePrice1,
          'Und2': item.Und2,
          'Strike2': item.Strike2,
          'refClosingPrice2': item.refClosePrice2,
          'Und3': item.Und3,
          'Strike3': item.Strike3,
          'refClosingPrice3': item.refClosePrice3,
          'Und4': item.Und4,
          'Strike4': item.Strike4,
          'refClosingPrice4': item.refClosePrice4,
        });
      // }
          
      });
      this.excelService.exportAsExcelFile(assetsExcelData, 'SP_Portfolio_Snapshot'+this.datepipe.transform(new Date(),'dd-MMM-yyyy HH:mm:ss'));
    } catch (error) {
      console.log(error);
    }
  }
  // Added by MuditB || 30-Aug-23 || End || Export Excel Using new Service
  async GetPortfolioViews()
  {
    this.viewList=[];
    let PortfolioViews: any= await this.portfolioService.GetPortFolioViews(AppConfig.settings.oRes?.userID,"PFL");
    console.log("VIEW LIST",PortfolioViews)
    PortfolioViews?.forEach(element => {
      this.viewList?.push(element.PV_Name);
    });
    this.viewList.sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }));
    console.log("LIST OF VIEWS ",this.viewList)

  }

  async GetPortfolio_View_Details(forDelete?:boolean, delViewName?:string)
  {
    this.loader=true;
    let ViewName
    delViewName? ViewName=delViewName:ViewName=this.viewName
    let PortfolioViews= await this.portfolioService.GetPortFolioViewDetails(AppConfig.settings.oRes?.userID,ViewName,"PFL");
    console.log("Portfolio Views",PortfolioViews);
    this.portolioDetails=PortfolioViews[0];
    console.log("POR TDET",this.portolioDetails);
    if(!forDelete){
      this.setFilter();
    }
  }

  filterViews(){
    this.backUpList=[];
    this.backUpList= this.viewList.slice();
    this.backUpList = this.backUpList?.filter(el => el.toString().toLowerCase().includes(this.viewName.toString().toLowerCase()));
  }
  showViewStatusPopupFunc(message){
    this.showViewStatusPopUp=true;
      this.ViewStatusMsg = message;
      setTimeout(() => {
        this.showViewStatusPopUp=false;
      }, 2500);
  }

  async SavePortfolio_View_Details()
  {
    
    let message:string=""
    // if(this.viewList.includes(this.viewName)){
      
    //   message = "View " + this.viewName + " already exists!";
    //   this.showViewStatusPopupFunc(message);
    // }
    // else{

      this.loader=true;
      // Validation for View name
      if(this.viewName=="" || this.viewName==undefined || this.viewName ==null){
        this.ViewFlag=true;
        message = "Please enter View name"
        this.showViewStatusPopupFunc(message);
        this.loader=false;
        // this.ViewFlag=false;
        return;
      }
      let strXml= "<Details><Record><ISIN_String/><Client>N3KY</Client><J_Internal>F000000258</J_Internal><Tutela/><Subtutela/><Group/><Type/><Branch/><Territory/><Zone/><Format>Note</Format><Currency>EUR</Currency><Payoff>Autocall</Payoff><ULString>BBVA,IBE</ULString><BasketYN>Y</BasketYN><ULType>Share</ULType><LiveYN>Y</LiveYN><DeadYN>N</DeadYN><Issue_From>4/18/2023 12:00:00 AM</Issue_From><Issue_To>4/30/2023 12:00:00 AM</Issue_To><Maturity_IN>2</Maturity_IN><Observ_IN>5</Observ_IN><Cancel_IN>1</Cancel_IN><CapAtRisk_min>10</CapAtRisk_min><CapAtRisk_max>90</CapAtRisk_max><CancelProb_min>30</CancelProb_min><CancelProb_max>95</CancelProb_max><KIDist_min>-30</KIDist_min><KIDist_max>70</KIDist_max><MTM_min>-10</MTM_min><MTM_max>95</MTM_max><Record_per_page>50</Record_per_page><Sort>Notional</Sort><Sort_direction>Descending</Sort_direction></Record></Details>";
      this.generateXML();
      let PortfolioViews= await this.portfolioService.SavePortFolioViewDetails(AppConfig.settings.oRes?.userID,this.viewName,this.viewXML,"PFL","","","");
      if(PortfolioViews['errorMessage'].includes("exists"))
        this.ViewFlag=true;
      else
        this.ViewFlag=false;
      this.showViewStatusPopupFunc(PortfolioViews['errorMessage']);
      console.log("SAVE Portfolio Views",PortfolioViews);
      this.loader=false;

      this.GetPortfolioViews();
    // }
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
    // if(this.viewList.some(item => item != this.viewName)){
    //   this.ViewFlag=true;
    //   message = "This View does not Exist"
    //   this.showViewStatusPopupFunc(message);
    //   this.loader=false; 
    //   return;
    // }
    // else
      await this.GetPortfolio_View_Details(true,this.viewName);
    let strXml= "<Details><Record><ISIN_String/><Client>N3KY</Client><J_Internal>F000000258</J_Internal><Tutela/><Subtutela/><Group/><Type/><Branch/><Territory/><Zone/><Format>Note</Format><Currency>EUR</Currency><Payoff>Autocall</Payoff><ULString>BBVA,IBE</ULString><BasketYN>Y</BasketYN><ULType>Share</ULType><LiveYN>Y</LiveYN><DeadYN>N</DeadYN><Issue_From>4/18/2023 12:00:00 AM</Issue_From><Issue_To>4/30/2023 12:00:00 AM</Issue_To><Maturity_IN>2</Maturity_IN><Observ_IN>5</Observ_IN><Cancel_IN>1</Cancel_IN><CapAtRisk_min>10</CapAtRisk_min><CapAtRisk_max>90</CapAtRisk_max><CancelProb_min>30</CancelProb_min><CancelProb_max>95</CancelProb_max><KIDist_min>-30</KIDist_min><KIDist_max>70</KIDist_max><MTM_min>-10</MTM_min><MTM_max>95</MTM_max><Record_per_page>50</Record_per_page><Sort>Notional</Sort><Sort_direction>Descending</Sort_direction></Record></Details>";
    this.generateXML();
    // Passing View ID performs  the update operation instead of save  
    let PortfolioViews= await this.portfolioService.SavePortFolioViewDetails(AppConfig.settings.oRes?.userID,this.viewName,this.viewXML,"PFL",this.portolioDetails['PV_ID'],"","");
    console.log("UPDATE Portfolio Views",PortfolioViews['errorMessage']);
    this.ViewFlag=false;
    this.showViewStatusPopupFunc(PortfolioViews['errorMessage']);
    this.loader=false;
    // this.viewName="";
    this.GetPortfolioViews();
  }

  async DeletePortfolio_View_Details(ViewName){
    this.loader=true;
    this.ViewFlag=true;
    // let strXml= "<Details><Record><ISIN_String/><Client>N3KY</Client><J_Internal>F000000258</J_Internal><Tutela/><Subtutela/><Group/><Type/><Branch/><Territory/><Zone/><Format>Note</Format><Currency>EUR</Currency><Payoff>Autocall</Payoff><ULString>BBVA,IBE</ULString><BasketYN>Y</BasketYN><ULType>Share</ULType><LiveYN>Y</LiveYN><DeadYN>N</DeadYN><Issue_From>4/18/2023 12:00:00 AM</Issue_From><Issue_To>4/30/2023 12:00:00 AM</Issue_To><Maturity_IN>2</Maturity_IN><Observ_IN>5</Observ_IN><Cancel_IN>1</Cancel_IN><CapAtRisk_min>10</CapAtRisk_min><CapAtRisk_max>90</CapAtRisk_max><CancelProb_min>30</CancelProb_min><CancelProb_max>95</CancelProb_max><KIDist_min>-30</KIDist_min><KIDist_max>70</KIDist_max><MTM_min>-10</MTM_min><MTM_max>95</MTM_max><Record_per_page>50</Record_per_page><Sort>Notional</Sort><Sort_direction>Descending</Sort_direction></Record></Details>";
    // this.generateXML();
    await this.GetPortfolio_View_Details(true,ViewName);
    let message= await this.portfolioService.DeletePortFolioViews(AppConfig.settings.oRes?.userID,ViewName,this.portolioDetails['PV_ID'],"");
    this.showViewStatusPopupFunc(message['ErrorMsg']);
    console.log("Delete Portfolio Views",message);
    this.loader=false;
    this.viewName="";
    this.GetPortfolioViews();
  }
  generateXML()
  {
    let filterXML=
      {
        "PV_ID": "",
        "ISIN_String": this.selectedExternal,
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
    //this.viewXML="<Details><Record><PV_ID></PV_ID><ISIN_String></ISIN_String><Client>bsa</Client><J_Internal></J_Internal><Tutela></Tutela><Subtutela></Subtutela><Group></Group><Type></Type><Branch></Branch><Territory></Territory><Zone></Zone><Format></Format><Currency></Currency><Payoff></Payoff><ULString></ULString><BasketYN>Y</BasketYN><ULType></ULType><LiveYN>Y</LiveYN><DeadYN>Y</DeadYN><Maturity_IN></Maturity_IN><Observ_IN></Observ_IN><Cancel_IN></Cancel_IN><CapAtRisk_min>100</CapAtRisk_min><CapAtRisk_max>100</CapAtRisk_max><CancelProb_min>0</CancelProb_min><CancelProb_max>0</CancelProb_max><KIDist_min>0</KIDist_min><KIDist_max>0</KIDist_max><MTM_min>-3.1</MTM_min><MTM_max>0</MTM_max><Record_per_page>undefined</Record_per_page><Sort>Issue Date</Sort><Sort_direction>Descending</Sort_direction></Record></Details>"

    this.viewXML='<Details><Record>';
    for (let index = 0; index < this.sampleXML.length; index++) {
      const element = this.sampleXML[index];
      this.viewXML=this.viewXML+'<'+element+'>'+filterXML[element]+'</'+element+'>';
    }
    this.viewXML=this.viewXML+'</Record></Details>';
    console.log(this.viewXML);

        // for (let index = 0; index < this.sampleXML.length; index++) {
    //   const element = this.sampleXML[index];
    //   console.log("ELEMENT",element);
    //   this.viewXML=this.viewXML+'<'+element+'>';
    //   for (let index1 = 0; index1 < filterXML.length; index1++) {
    //     const element1 = filterXML[index1];
    //     console.log("ELEMENT1111",element1);
    //     this.viewXML=this.viewXML+'<'+element1+'>'+element[element1]+'</'+element1+'>';
    //   }
    //   this.viewXML=this.viewXML+'</'+element+'>';
      
    // // console.log("XML",this.viewXML);
    //   //console.log("XMLLLLLLLL",this.viewXML);
    // }
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
    console.log(this.viewList);
    //this.selectShare();
    this.commonApi.ScrollTo('.shares-list', '.active-share', 'down');


  }

  clientFilterData(event){
    try{
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
    }
    catch(er){

    }
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

  SetSortCss(id,filterItem){
    if(filterItem)
        {
          id.style.setProperty('cursor', 'pointer');
          id.style.setProperty('transition', 'transform 0.5s');
          id.style.setProperty('-webkit-transform', 'scaleY(1)');
          id.style.setProperty('color', 'var(--headers) !important');
        }
        else{
          id.style.setProperty('cursor', 'pointer');
          id.style.setProperty('transition', 'transform 0.5s');
          id.style.setProperty('-webkit-transform', 'scaleY(-1)');
          id.style.setProperty('color', 'var(--headers) !important');
        }
  
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
onBackspaceKeyUp(){
  if (this.viewName === '') {
    // this.refresh();
    this.clearAllFilters()
  }
}

  selectView() {
    // Select the text in the input field when it gains focus
    const inputField = this.el.nativeElement.querySelector('input[type="text"]');
    this.renderer.selectRootElement(inputField).select();
  }

  restoreSortIconCSS(){
    let elementIDs:HTMLElement[] = [];
    elementIDs.push(document.getElementById('KO_Distance'));
    elementIDs.push(document.getElementById('KI_Distance'));
    elementIDs.push(document.getElementById('NextObsDate'));
    elementIDs.push(document.getElementById('Maturity_date'));
    elementIDs.push(document.getElementById('MTM'));
    elementIDs.push(document.getElementById('HistCFL'));
    elementIDs.push(document.getElementById('WOPerf'));
    console.log(elementIDs)
    elementIDs.forEach((item)=>this.SetSortCss(item,true));
  }

}
/**
 * Used as type of dataSource for a simple dynamic table
 * @author Kaustubh Sawant
 */
interface TableData {
  Headers: string[],
  RowData: object[]
}