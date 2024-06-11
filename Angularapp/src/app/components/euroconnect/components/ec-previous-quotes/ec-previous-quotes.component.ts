import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { ExcelService } from '../../services/excel.service';

import localePy from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import * as moment from 'moment';
import { Guid } from 'guid-typescript';
import { EcHomeService } from '../../services/ec-home.service';
import { EcCommonService } from '../../services/ec-common.service';
import { filter } from 'rxjs/internal/operators/filter';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { join } from 'path';





registerLocaleData(localePy, 'es');

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-ec-previous-quotes',
  templateUrl: './ec-previous-quotes.component.html',
  styleUrls: ['./ec-previous-quotes.component.scss']
})

export class EcPreviousQuotesComponent implements OnInit {

  @ViewChild('myMatAccordion', { static: true }) myMatAccordion: MatAccordion;
  @ViewChild('paginator', { static: true }) paginator: PageEvent;



  @Input() selectedToken: any;


  @Input() prevQuoteLaunchPopUp: any;
  @Input() RFQ_ID: any;
  @Input() Template_Code: any;
  // @Input() RedirectedFrom : any;
  @Input() redirectFrom: any;
  @Input() Mode: any;
  @Input() OrderNotional: any;
  @Input() buttonID: any;
  @Input() buttonName: any;
  @Input() tokenID: any;
  @Input() srcComponent: any;
  @Input() FilledQty: any;

  @Input() accord: any;
  @Input() activeTab: any;

  // @Input()  prevQuoteLaunchPopUp
  LP_Name: any = ""
  // showPopUpFlg = true;
  WorkflowDetails = new BehaviorSubject({});
  WorkflowDetailsObserver = this.WorkflowDetails.asObservable();
  d = new Date();
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  ErrorMsg = '';
  successMsg = '';
  frmDate = '';
  toDate = '';
  frmDate22 = '';
  toDate22 = '';
  INS_TradeList = [];
  // accord: any;
  product: any;
  Product_Code:any;
  flag: boolean;
  interfaceUrl = environment.interfaceURL;
  asseturl = environment.asseturl;
  Token: any;
  OrderHistoryArray = [];
  ShareBlotterArray = [];
  BondsOrderhistoryArray = [];
  FundsBlotterArray = [];
  SFOrderBlotterArray = [];
  TSInterval: any;
  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsPopupLabels: Object[] = [];
  filterSortByVal = 'Asc';
  filterStr = '';
  GetWFBlotterPHXSFSub : Subscription // Added by Jyoti S || 20-Jun-2023
  phoenixWFBlotterData_ALLRFQ = [];
  phoenixWFBlotterData_ALLRFQExpand = [];

  phoenixWFBlotterData_ALLRFQ_Orig = [];
  phoenixWFBlotterData_ALLRFQExpand_Orig = [];

  // phoenixWFBlotterData_ALLRFQNew = [];
  // phoenixWFBlotterData_ALLRFQExpandNew = [];

  chkDateRange = true;
  noOfRecords = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  pageEvent1: PageEvent;
  pageNo : number = 0;
  pageFirstRecord : number = (this.pageNo * this.pageSize) + 1;
  pageLastRecord : number = this.pageSize;
  datepipe: any;
  colSpan1 = 0;
  toggleLaunch: boolean;
  KIDLoadFlag : boolean = false;
  TSLoadFlag : boolean = false;
  ViewTSFlag : boolean = false;
  ViewKIDFlag : boolean = false;
  TSDisFlag : boolean = false;

  requestType = 'P'; //'Requested';
  // productLaunchData: any;
  shares = [];
  selectedSharesData = [];
  selectedRFQData: any;
  tCode: any;
  stkdate = '';
  settdate = '';
  expdate = '';
  expshift = '';
  issueDate = '';

  indexTrancheArr:any = [];

  //autocall
  //autocall
  autocallCouponType = ''
  autoTrigger = '';
  autoFreq = '';
  autocallCoupon = '';
  autoStepDown = '';
  autoNonCall = '';

  //autocall RC
  //Coupon
  cpnType = '';
  cpnTrigger = '';
  cpnFreq = '';
  cpnCoupon = '';
  cpnObservation = '';

  //autocall RC
  // barrier
  barrierType = '';
  barrierLevel = '';
  Strike = '';
  IBPrice = '';

  //
  fundType = '';
  fundFreq = '';
  fundRate = '';

  //participatin
  //upside
  upStrike = '';
  upGearing = '';
  upUpperStrike = '';
  upCoupon = '';
  upBarrierType = '';
  upBarrierLevel = '';
  upRebate = '';


  //participatin
  //downside
  downStrike = '';
  downLowerStrike = '';
  downLeverage = '';
  downBarrierType = '';
  downBarrierLevel = '';

  //participatin
  //Guaranteed Coupon
  capitalGuaranteed = '';
  guaranteedCoupon = '';
  guaranteedCouponFreq = '';


  AttachVal = '';
  DetachVal = '';
  // cpnType  = '';
  // cpnFreq = '';
  floatingRef = '';
  cpnBasis = '';
  Spread = '';
  reofferPrice = '';

  successMsgProdLaunch = "";
  errorMsgProdLaunch = "";
  prodLaunchFlag = false;

  // startDate = new Date(); //"2021-03-17"
  // //console.log(this.datepipe.transform(new Date(), 'yyyy-mm-dd'));
  startDate = '';
  closeDate = '';
  minNotional = "";
  maxNotional = "";
  minOrderSize = ""
  denomination = ""
  summary = "";
  remark = "";
  successMessage: boolean;
  errorMessage: boolean;
  viewOnly = false;
  popupSuccessMsg = '';

  allBooksData = [];
  // shares: any = [];
  ReceivedCCY: any = [];
  // indexTrancheArr: any = [];
  floatingRefArr: any = [];
  validationArr: any = [];
  editFlag: boolean = false;
  prodName = '';
  cpnMinCoupon = '';
  showAccordion: any = [];
  launchProductMode = '';
  orderNotional: any;
  filledNotional: any;

  showviewOrderPopupFlag = false;
  viewOrderData:any = [];
  // buttonID = '';
  // buttonName = '';
  // tokenID = '';
  noRecordlbl = '';

  // UCP products variables

  ERStrikeDate = '';
  ERSettDate = '';
  ERIssueDate = '';
  ERType = '';
  ERFreq = '';
  ERAutocallableFrom = '';
  ERTrigger = '';
  ERStepDown = '';
  YECouponType = '';
  YECouponBarrierType = '';
  YECouponBarrierLevel = '';
  YECoupon = '';
  YEMinCoupon = '';
  YECouponFreq = '';
  YECouponInFine = '';
  YERangeAccrualFreq = '';
  YELowerTrigger = '';
  YEUpperTrigger = '';
  YECouponFloatingFreq = '';
  YECouponFixing = '';
  YEFloor = '';
  YECap = '';
  YEMultiplier = '';
  protectionType = '';
  putStrike = '';
  putGearing = '';
  KIBarrier = '';
  upperPutStrike = '';
  lowerPutStrike = '';
  putSpreadGearing = '';
  finalUpside = '';
  lowerCallStrike = '';
  upperCallStrike = '';
  callSpreadGearing = '';
  callStrike = '';
  callGearing = '';
  TSTimeout = 300;
  // AQ and DQ Variable
  AQDQStrikeDate = '';
  AQDQTenor = '';
  // AQDQType = ''; // Azure change
  AQDQTrigger = '';
  AQDQFreq = '';
  AQDQGuarantee = '';
  AQDQStrike = '';
  AQDQUpfront = '';
  AQDQLeverage = '';
  showAllRFQFlag = false;
  showAllRFQArr: any = [];
  fillFlag = false;
  DailySharesAQDQ: any;
  EstimatedNotionalAQDQ: any;
  // minPoolSize: any;
  // maxPoolSize: any;

  //apurva
  // state: boolean = true;
  // templateName: any;
  // redirectFrom: any;//added by apurva
  searchByRFQID = '';
  searchField = 'RFQID'
  filterField : any //Added by Jyoti S || 18-Jul-2023
  noRecordlblFlag = false //Added by Jyoti S || 18-Jul-2023
  //Added By ApurvaK for "SolveFor" bindings
  minERTrigger = '';
  minKIBarrier = '';
  minPutStrike = '';
  minYEFloor = '';
  minAQDQUpfront = '';
  minFundRate = '';
  MinautoTrigger = '';   //Autocall start

  minStrike = '';
  minBarrierLevel = '';
  MinMaxSolveFor: string = '';
  minAQDQStrike = '';

  // Added by ApurvaK for Add attachment
  file: File = null;
  // fileName: any = "dummy.txt";
  fileNameArr = [];
  // byteData: any;
  // EntityID: any;
  // DocumentName: any;
  // DocumentFileType: any;
  wrongEntry: boolean = false;

  // Added by Pranav D for reooffer and issue price
  issuePriceLaunchPopup: any;
  reofferPriceLaunchPopup: any;
  ERCouponType: any;
  ERPeriodicCpnFlg: any;
  ERCouponpa: any;

  viewRFQID = '';
  viewOnlyFlag = false;
  showPricerScreeninViewMode = false;

  showCustDetails = false;
  showRMDetails = false;
  showOnBehalfOf = false;
  // fetchBookOrderForConfig = false;
  isDealer : any ; //Changed by Jyoti S || 26-July-2023
  DealerValue
  EQ_Show_SolveRange_Launch_Product = 'NO';
  // Launch Prod new fields
  // OrderTypeLaunchProd: any;
  // LimitLevelLaunchProd: any;
  nonBestPricereason: any;
  NonBestPriceReasonArr = [];
  commonData:any = [];
  selectedBookingBranch: any;
  BookingCenter :any = [];
  bestIssuerFlag = false;
  // OrderTypeLaunchProd: any = [''];
  // LimitLevelLaunchProd: any = [0.00];
  otherReason: any;

  pageloadflag= true // Added by AdilP || 04-05-2023  

  // new config variable || PriyaL || 05Apr2022 || Assigned by PranavD
  EQ_Show_Launch_Button = 'NO';
  EQ_Show_Order_Button = 'NO';

  // new config variable || Amogh k || 19Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';
  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';
  language : any
  country : any
  pageTitle: any;
  docSupportStatus: any = {};
  defaultRFQTimeout: any;
  Repriceinterval: NodeJS.Timer;
  KIDInterval: NodeJS.Timer;
  filterModeArr :any = []; // Added by Jyoti  S || 20-Jul-2023
  defaultvaluesArr:any = [];// Added by Jyoti  S || 20-Jul-2023
  private static instance: EcPreviousQuotesComponent;//Added by Jyoti S || 22-Jun-2023
  private intervals: Set<NodeJS.Timeout>;//Added by Jyoti S || 22-Jun-2023
  EQ_Dealer_OwnerDefault: any;
  EQ_NonDealer_OwnerDefault: any;
  UserRolesArr:any = [];
 //Added by Jyoti S || FIN1EURINT-600 || 25-Aug-2023 || START
 TriggerPopup: boolean = false;
 TriggerValueArr: string[];
 RfqCloneData : any = [];
  rePriceData : any = [];
 //Added by Jyoti S || FIN1EURINT-600 || 25-Aug-2023 || END
  // tslint:disable-next-line: no-shadowed-variable

  displayAutocallTriggerPopup:boolean=false;  //Avinash G
  displayAutoCallTriggerArr:any=[]; //Avinash G
  
  checkTriggerDivOpen:boolean=false;
  ErrorMsgRFQpopup: string ='';//Apurva K||FIN1EURINT-720
  showExtQuotePopup:boolean=false; //added by Apurva K|| 10-May-2024||
  priceProvidersArr:any = [];
  issuer:any;
  quote:any
  quoteTime = new Date();
  nMasterId: any;
  templateMappingArr: any;
  quoteInsertErrMsg: any;
  quoteInsertSuccMsg: any;
  insertBtnActive = 'N';

  constructor(public afs: EcHomeService, public cfs: EcCommonService,  
    public excelService: ExcelService, datepipe: DatePipe, private route: ActivatedRoute, private api: CustomerService,private http: HttpClient ) {
   
    this.datepipe = datepipe;
    this.toggleLaunch = false;
    this.successMessage = false;
    this.intervals = new Set<NodeJS.Timeout>()//Added by Jyoti S || 22-Jun-2023
  }
  // bombay: any;
  solveForArray = {
    'Price(%)': 'EP_OfferPrice', //Changed by Jyoti S || 27-Jul-2023 || FIN1EURINT-546
    'Upfront(%)': 'ER_Upfront',
    'Strike(%)': 'EP_StrikePercentage',
    'Coupon(%)': 'CouponPercentage',   // Changed by AdilP @11-07-2023 
    'Barrier Level': 'EP_KI_Level',
    'Coupon Trigger': 'EP_CouponBarrier',
    'AutoCall Coupon': 'EP_RebateCoupon',
    'AutoCall Trigger': 'EP_KO_Level',
    '': ''
  }

  solveForArrayfornewproducts = {
    'Price(%)': 'EP_OfferPrice',
    'Strike(%)': 'EP_StrikePercentage',
    'Coupon(%)': 'EP_CouponPercentage',
    'Barrier Level': 'EP_KI_Level',
    'Coupon Trigger': 'ER_CouponBarrier',
    'AutoCall Coupon': 'ER_RebateCoupon',
    'AutoCall Trigger': 'EP_KO_Level',
    '': ''
  }
  orderStatusColor = {
    'Active': '#4fbb94',
    'Expired': '#ea6c64',
    'Order Placed': '#467fb3',
    'Pool Created': '#467fb3',
    'No Response': '#ea6c64',
    'Rejected': '#ea6c64',
    'Unsupported': '#ea6c64',
    // 'No Response': 'var(--label)',
    'Pending Reprice': '#dd832e'
  }


  async ngOnInit() {


    //apurva
    // this.cfs.setState(!this.state);

    // this.state = this.cfs.getState();

    // this.accord = this.cfs.getAccord()[0];
    // this.templateName = this.cfs.getAccord()[1];
    // //console.log("accord", this.accord, "template", this.templateName, this.cfs.getAccord())
    // this.setDates();
    // this.openAcc(this.accord)
    // this.matExpansionOnClick(this.templateName)
    // this.postBackMethod();

    // setTimeout(() => {

    //   this.onChange(this.frmDate, this.toDate);

    // }, 5);
    
      // Vaibhav B | 02-03-2023 | To load Previous Quotes Grid on page load
      this.accord = 5; //Changed by Apurva K|| 05-Mar-2024 ||FIN1EURINT-703
      this.openAcc(5); //Changed by Apurva K|| 05-Mar-2024 ||FIN1EURINT-703

    try {
      $('#loading').show();
      setTimeout(async () => {
        this.pageloadflag = true; // Added by AdilP || 04-05-2023
        //default api call
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // if (this.afs.allBooksData === undefined || this.afs.allBooksData.length <= 0) {
        //   this.allBooksData = this.afs.getAllBooksMappedToLogin();
        // }


        // if (this.afs.shares === undefined || this.afs.shares.length <= 0) {
        //   //console.log("b4444");
        //   this.afs.BBVALoadShares('EQ', "", "EQC_Europe").then(async(data:any)=>{
        //     this.shares = data.Get_All_Share_Details_JsonResult;
        //     this.afs.shares = this.shares;
        //   });
        // }
        //Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID || START
        this.clearAllDocIntervals();//Added by Jyoti S || 22-Jun-2023
        if (this.afs.payOffList === undefined || this.afs.payOffList?.length <= 0) {
          this.afs.getPayOffList();
        }
        this.Template_Code = this.afs.payOffList[this.afs.payOffList.findIndex(item => item.accord === parseInt(this.accord))].prevQuoteProductName 
        this.docSupportStatus = await this.afs.GetDocumentSupportStatus(this.Template_Code.toUpperCase() == "AUTOCALLABLEPHOENIX" ? "EQC_Europe" : this.Template_Code);
        //Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID  || END
      //modified by PoojaW
        if (this.afs.CCY === undefined || this.afs.CCY?.length <= 0) {
          this.afs.BBVALoadCCY().then((data:any)=>{
            this.ReceivedCCY = data;
          });
        }
         //modified by PoojaW
        if (this.afs.indexTrancheArr === undefined || this.afs.indexTrancheArr?.length <= 0) {
           this.afs.BBVALoadSharesCR('EQ', "", "EQC_Europe").then((data:any)=>{
            this.indexTrancheArr =data;
          });
        }
         //modified by PoojaW
        if (this.afs.floatingRefArr === undefined || this.afs.floatingRefArr?.length <= 0) {
          this.afs.BBVALoadSharesIR('EQ', "", "EQC_Europe").then((data)=>{
            this.floatingRefArr =data;
          });
        }
        //modified by PoojaW
        if (this.afs.validationArr === undefined || this.afs.validationArr?.length <= 0) {
          this.afs.BBVAFetchValidation('EQ').then((data:any)=>{
            this.validationArr = data;
            this.afs.validationArr = this.validationArr;
          });
        }
        else {
          this.validationArr = this.afs.validationArr;
        }

        
        if (this.validationArr && this.validationArr?.length > 0) {
          for (let i = 0; i < this.validationArr.length; i++) {
            switch (this.validationArr[i].Setting_Name) {

              case 'EQ_Show_Order_Customer':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.showCustDetails = this.validationArr[i].Config_Value === 'Yes' || this.validationArr[i].Config_Value === 'YES' ? true : false;
                  }
                } else {
                  this.showCustDetails = this.validationArr[i].Default_Value === 'Yes' || this.validationArr[i].Default_Value === 'YES' ? true : false;
                }
                break;
              case 'EQ_Show_Order_RM':
                //console.log(this.validationArr[i]);
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.showRMDetails = this.validationArr[i].Config_Value === 'Yes' || this.validationArr[i].Config_Value === 'YES' ? true : false;
                  }
                } else {
                  this.showRMDetails = this.validationArr[i].Default_Value === 'Yes' || this.validationArr[i].Default_Value === 'YES' ? true : false;
                }
                break;
              case 'EQ_Login_Client_Mapping':
                //console.log(this.validationArr[i]);
                // if (this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID) {
                //   // this.isDealer = this.validationArr[i].Default_Value === 'Yes' || this.validationArr[i].Default_Value === 'YES' ? true : false;
                //   // this.fetchOnBehalfOf = this.validationArr[i].Config_Value === 'Yes' || this.validationArr[i].Config_Value === 'YES' ? false : true;
                //   // this.isDealer = this.validationArr[i].Config_Value === 'Yes' || this.validationArr[i].Config_Value === 'YES' ? false : true;
                //   this.showOnBehalfOf = configVal === 'Yes' || configVal === 'YES' ? true : false;
                //   // if(!this.fetchOnBehalfOf){
                //   //   this.isDealer = true;
                //   // }
                // }
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.showOnBehalfOf = this.validationArr[i].Config_Value === 'Yes' || this.validationArr[i].Config_Value === 'YES' ? true : false;
                  }
                } else {
                  this.showOnBehalfOf = this.validationArr[i].Default_Value === 'Yes' || this.validationArr[i].Default_Value === 'YES' ? true : false;
                }
                break;
              case "EQ_Show_SolveRange_Launch_Product":
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_SolveRange_Launch_Product = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_SolveRange_Launch_Product = this.validationArr[i].Default_Value;
                }
                break;

              //  Added new entity config to show/hide Launch button || PriyaL || 05Apr2022 || Assigned by PranavD
              case 'EQ_Show_Launch_Button':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_Launch_Button = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_Launch_Button = this.validationArr[i].Default_Value;
                }
                break;
              //  Added new entity config to show/hide Order button || PriyaL || 05Apr2022 || Assigned by PranavD
              case 'EQ_Show_Order_Button':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_Order_Button = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_Order_Button = this.validationArr[i].Default_Value;
                }

                break;

              //  Added new entity config to show/hide TS button || Amogh K || 19Apr2022 || Assigned by PranavD
              case 'EQ_Show_Termsheet_Button':
                //console.log("TS button ", this.validationArr[i], this.cfs.getLoggedInUserName()[1].EntityId)
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_Termsheet_Button = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_Termsheet_Button = this.validationArr[i].Default_Value;
                }
                break;

              //  Added new entity config to show/hide KID button || Amogh K || 21Apr2022 || Assigned by PranavD
              case 'EQ_Show_KID_Button':
                //console.log("TS button ", this.validationArr[i], this.cfs.getLoggedInUserName()[1].EntityId)
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_KID_Button = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_KID_Button = this.validationArr[i].Default_Value;
                }

                break;
                case 'EQ_DefaultRFQTimeOut_Ang':
                  if (this.validationArr[i].Config_Value !== '') {
                    if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                      this.defaultRFQTimeout = this.validationArr[i].Config_Value;
                    }
                  } else {
                    this.defaultRFQTimeout = this.validationArr[i].Default_Value;
                  } //Added by Jyoti S || 22-Jun-2023
                  break;

                  case 'EQ_Dealer_OwnerDefault':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Dealer_OwnerDefault = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Dealer_OwnerDefault = this.validationArr[i].Default_Value;
                }
                break;

                case 'EQ_NonDealer_OwnerDefault':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_NonDealer_OwnerDefault = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_NonDealer_OwnerDefault = this.validationArr[i].Default_Value;
                }
                break;

               
            }
          }
        }
        this.fnGetProdTemplate();
        // if (this.showOnBehalfOf) {
        //   this.DealerValue = await this.afs.checkLoginBookName();
        //   this.isDealer = this.DealerValue
        //   console.log("Jyoti",this.isDealer)
        //   // if (this.showOnBehalfOf) {
        //     // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        //   // if (this.afs.allBooksData === undefined || this.afs.allBooksData.length <= 0) {
        //   //   this.afs.getAllBooksMappedToLogin();
        //   // }
        //   // }
        // }
        // Added by Jyoti S || 26-Jul-2023 || Start
        let UserGroup = AppConfig.settings.oRes.groupID;       
        this.UserRolesArr = await this.afs.GetCommonDataReason("CSP_UserRoles");//Added by Varsha G || 01-June-2023
        const matchedGroup = this.UserRolesArr?.filter((obj)=>{
          return obj.Misc1 === UserGroup;
        })
        if(matchedGroup?.[0]?.Data_Value?.toUpperCase() === "DEALER"){
          this.isDealer = true;
        }else{
          this.isDealer = false;
        }
        this.DealerValue = this.isDealer
          // Added by Jyoti S || 26-Jul-2023 || End

        //Satrt - Added by Apurva K|| 13-May-2024 ||
        const res:any = await this.afs.GetPriceProviderDetails('EQC_Europe');

        for (let i = 0; i < res.length; i++) {
          this.priceProvidersArr.push({
            lp: res[i],
          })}
        //End - Added by Apurva K|| 13-May-2024 ||

        this.filterModeArr = await this.afs.GetCommonDataEntityWise(this.isDealer ? "EQ_Dealer_OwnerOption" : "EQ_NonDealer_OwnerOption",this.isDealer ? "Dealer" : "RM")
        if(this.afs.validationArr && this.EQ_Dealer_OwnerDefault && this.EQ_NonDealer_OwnerDefault)
        {
          this.isDealer ? this.filterField = this.EQ_Dealer_OwnerDefault : this.filterField = this.EQ_NonDealer_OwnerDefault
        }
        else{
          this.filterField = this.isDealer ? 'All' : 'Self';
        }
        /*
                if (this.afs.showCustomerConfig === undefined || this.afs.showCustomerConfig.length <= 0) {
                  this.afs.GetEntityConfig("EQC_Allow_BasketELN_YN");
                }
                //console.log(this.afs.showCustomerConfig);
                // //console.log(this.afs.showCustomerConfig[0].Config_Value);
                if (this.afs.showCustomerConfig.length > 0 && (this.afs.showCustomerConfig[0].Config_Value === 'Yes' || this.afs.showCustomerConfig[0].Config_Value === 'YES')) {
                  this.showCustDetails = true;
                }
        */
        //console.log(this.afs.payOffList);
        if (this.afs.payOffList === undefined || this.afs.payOffList.length <= 0) {
          // this.validationArr = this.apifunctions.BBVAFetchValidation('EQ');
          // this.apifunctions.GetDealEntryUSAM();
          await this.afs.getPayOffList();
        }

        this.flag = false;
        // this.accord = 1;  //apurva commented
        //  this.setDates();  //apurva commented
        // this.openAcc(1);  //apurva commented
        // this.accord = this.cfs.getAccord()[0];
        this.setDates();
        //console.log(this.afs.payOffList);
        //console.log(this.accord)

        if (this.accord && parseInt(this.accord) > 0 && this.activeTab === 'PQ') {
          // this.accord = parseInt(this.accord);
          this.openAcc(parseInt(this.accord))
          var idx = this.afs.payOffList.findIndex(item => item.accord === parseInt(this.accord))
          //console.log(idx);
          //this.matExpansionOnClick(this.afs.payOffList[idx].prevQuoteProductName) // Temp comment by Jyoti S || 04-Jul-2023
          this.Template_Code = this.afs.payOffList[this.afs.payOffList.findIndex(item => item.accord === parseInt(this.accord))].prevQuoteProductName
          this.postBackMethod();
        }
        else {
          if (!this.prevQuoteLaunchPopUp) {
            if (this.afs.payOffList.filter(item => item.display === true).length > 0) {
              //console.log(this.afs.payOffList.filter(item => item.display === true))
              // this.accord = this.afs.payOffList[this.afs.payOffList.findIndex(item=> item.display === true)].accord
              this.accord = this.afs.payOffList.filter(item => item.display === true)[0].accord
              this.openAcc(this.accord)
              // this.matExpansionOnClick(this.afs.payOffList[this.afs.payOffList.findIndex(item=> item.display === true)].name)
              // this.matExpansionOnClick(this.afs.payOffList.filter(item => item.display === true)[0].name)
              //this.matExpansionOnClick(this.afs.payOffList.filter(item => item.display === true)[0].prevQuoteProductName) // Temp comment by Jyoti S || 04-Jul-2023
              this.postBackMethod();
            }
          }
        }

        // this.accord = this.afs.getPayOffList[0].accord;
        // this.templateName = this.cfs.getAccord()[1];
        // //console.log("accord", this.accord, "template", this.templateName, this.cfs.getAccord())

        this.afs.refreshPreQuoteFlag.next(false);
        // this.afs.refreshPreQuoteFlag1.next([false, ""]);

        this.afs.refreshPreQuoteFlagObs.subscribe((res: any) => {
          //console.log(res);
          // if (res && res.length > 0 && res[0] === true && res[1] !=="") {
          if (res && res === true) {
            //   this.afs.refreshPreQuoteFlag1.next([false,""]);
            //   setTimeout(() => {
            //   this.getRepriceData(res[1], "");
            // }, 3000);
            //   return true;
            //  //console.log(res[1]);
            console.log(this.dataItemAccordian,"hello 123");
            if (this.dataItemAccordian && this.dataItemAccordian.ClubbingRFQId) {
              this.getRepriceData(this.dataItemAccordian.ClubbingRFQId, "");
            }

            // var rePriceData = this.afs.BBVWorkflowBlotterReprice("EQC_Europe",this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", res[1]);
            // //console.log(rePriceData);
            // if (rePriceData && rePriceData.length > 0) {
            //   // var idx = this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === rePriceData[0].ClubbingRFQId);
            //   if(this.dataItemAccordian.ClubbingRFQId == rePriceData[0].ClubbingRFQId){
            //     var idx = this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === this.dataItemAccordian.ClubbingRFQId);
            //     //console.log(idx);
            //     //console.log(this.phoenixWFBlotterData_ALLRFQExpand);
            //     // this.phoenixWFBlotterData_ALLRFQExpand.splice(idx, 0, rePriceData);
            //     this.phoenixWFBlotterData_ALLRFQExpand[idx] = rePriceData;
            //     //console.log(this.phoenixWFBlotterData_ALLRFQExpand);
            //   }
            // }
            return;
          }
        });

        this.afs.prevQuoteOrderPopUpObs.subscribe((res: boolean) => {
          this.PrevQuoteShowOrderPopUp = res;
        });

        //Added by Apurva K||03-May-2024
        this.afs.prevQuoteOrderPopUpObs.subscribe((res: boolean) => {
          this.PrevQuoteShowOrderPopUp = res;
        });

        this.afs.showPricerScreeninViewModePopupObs.subscribe((res: boolean) => {
          this.showPricerScreeninViewMode = res;
        });
        //this.matExpansionOnClick('AutocallablePhoenix');  apurva commented
        // this.afs.GetWFBlotterPHXSF.next('');
            
           await this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords })

            if (this.searchByRFQID !== '') {
              this.getDataFilter();
            }

        if (this.prevQuoteLaunchPopUp) {

          //console.log(this.prevQuoteLaunchPopUp);
          // this.redirectFrom = params.RedirectedFrom; //added by apurvaC
          if (this.RFQ_ID && this.Template_Code) {
            if (this.redirectFrom === 'RMW' || this.redirectFrom === 'ManualHedge' || this.redirectFrom === 'NewPool' || this.redirectFrom === 'ManualAllocations') {
              this.viewOnly = true;
              this.fillFlag = false;
            }
            else if (this.redirectFrom === 'WFBlotter' && this.Mode === 'Launch Product') {
              this.viewOnly = true;
              this.fillFlag = false;
            } else {
              this.viewOnly = false;
            }

            if (this.redirectFrom === 'ManualHedge' || this.redirectFrom == 'ManualAllocations') {
              this.orderNotional = (parseFloat(this.OrderNotional).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            if (this.redirectFrom === 'NewPool') {
              this.buttonID = this.buttonID;
              this.buttonName = this.buttonName;
              this.tokenID = this.tokenID;
            }

            if (this.redirectFrom === 'Amend' || this.redirectFrom == 'Reopen') {
              this.buttonID = this.buttonID;
              this.buttonName = this.buttonName;
              this.tokenID = this.tokenID;
            }

            this.toggleLaunch = true;
            switch (this.Template_Code) {
              case "Autocall Phoenix": this.accord = 1;
                break;
              case "Reverse Convertible":
              case "ReverseConvertible": this.accord = 2;
                break;
              case "Credit Tranche": this.accord = 3;
                break;
              case "Participation": this.accord = 4;
                break;
              case "Early Redemption":
              case "Autocallable":
              case "EQC_Europe": this.accord = 5;
                break;
              case "YieldEnhancement":
              case "Yield Enhancement":
                this.accord = 6;
                break;
              case "Discount Certificates":
              case "DiscountCertificates": this.accord = 7;
                break;
              case "Accumulator":
              case "Accu":
              case "ACC": this.accord = 8;
                break;
              case "Decumulator":
              case "Decu":
              case "DAC": this.accord = 9;
                break;
              case "CustomPayoffs": this.accord = 10;
                break;
            }

            this.confirmAllocationFlg = false;

            if (this.selectedToken && this.selectedToken.Status && this.selectedToken.Status === 'Pool Executed') {
              this.confirmAllocationFlg = true;
            }

            //console.log('SSSS 22');
            this.openLaunchProductBasedonRFQ(this.RFQ_ID, this.Mode);
          }
        }
        //this.pageloadflag = false; // Added by AdilP || 04-05-2023
      });
    //   this.route.params.subscribe
    //   (async params => {
    //   this.pageTitle = params.pageTitle;

    // });//Added by Jyoti S || 05-May-2023
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023


    } catch (error) {
      //console.log(error);
    }
  }

  ngAfterViewChecked() {
    $(".table-data:odd").css("background-color", "rgb(236, 236, 236)");
    $(".table-data:even").css("background-color", "#f7f7f7");
  }

  setDates() {
    try {
      const d = new Date();
      this.frmDate = d.getFullYear().toString() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      this.toDate = d.getFullYear().toString() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    } catch (error) {
      //console.log(error);
    }
  }

  getRFQCount(data,caseValue){
    //var len = data.filter(item =>item.EP_Trade_Order_Status != 'No Response').length;
    var result =  []
    data.forEach(item => {
      let count = result.filter(x => (x.PP_CODE == item.PP_CODE)).length
      if(count == 0) {
        result.push(item)
      }
    }) 
    var len = result.filter(item =>item.EP_Trade_Order_Status != 'No Response').length;
    // Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-25 || START
    var Rejectedarr : any = [];
    var Pricearr : any = [];
    var str = '';
    result.forEach((data,i)=>{
      switch(caseValue){
        // case 'active': 
        // if(data.EP_OfferPrice != ''){
        //   Pricearr.push(data);
        // }
        // break;
        case 'rejected': 
        if(data.EP_Trade_Order_Status.toLowerCase() == 'rejected'){
          Rejectedarr.push(data);
        }
        break;

        // case 'expired': 
        // if(data.EP_OfferPrice != ''){
        //   Pricearr.push(data);
        // }
        // break;
        case 'price':
          //Changes for FIN1EURINT-712|| Apurva K|| 02-Apr-2024
          if((data[this.solveForArray[data.ER_SolveFor]] != '' && data[this.solveForArray[data.ER_SolveFor]] != '0' && data[this.solveForArray[data.ER_SolveFor]] != 0 && data[this.solveForArray[data.ER_SolveFor]] != '0.00' && data[this.solveForArray[data.ER_SolveFor]] != 0.00) && (data.EP_Trade_Order_Status == 'Expired' || data.EP_Trade_Order_Status == 'Active'|| data.EP_Trade_Order_Status == 'Order Placed')){
            Pricearr.push(data);
          }
        break;
        default:
        break; 

      }
    }) 

    // var str1 = Pricearr.length <= 1 ? Pricearr.length + " Price and " : Pricearr.length + " Prices and ";
    // var str2 = Rejectedarr.length <= 1 ? Rejectedarr.length + " Reject from " : Rejectedarr.length + " Rejects from ";
    // var str3 = result.length + " RFQ(s)"
    // return  Pricearr.length + " Prices and " + Rejectedarr.length + " Rejects from " + result.length + " RFQ(s)";
    if(caseValue == 'price'){
      str = Pricearr.length <= 1 ? Pricearr.length + " Price " : Pricearr.length + " Prices ";
    }
    else if(caseValue == 'rejected'){
      str = Rejectedarr.length <= 1 ? Rejectedarr.length + " Reject " : Rejectedarr.length + " Rejects ";
    }
    else if(caseValue == 'all'){
      str = result.length <= 1 ? result.length + " RFQ " : result.length + " RFQs ";
    }
    return str;
    // Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-25 || END
  }//Added by Jyoti S || 03-Jul-2023


  async getRFQData(template_Code, frmDate, toDate, noteMasterID,pageNo,pageSize,RFQID =''){
    this.noRecordlbl = ''
    this.noRecordlblFlag = false;
    this.Template_Code = this.afs.payOffList[this.afs.payOffList.findIndex(item => item.accord === parseInt(this.accord))].prevQuoteProductName
    this.phoenixWFBlotterData_ALLRFQ = [];
    this.phoenixWFBlotterData_ALLRFQExpand = [];
    this.searchField === 'RFQID' ? noteMasterID = this.searchByRFQID : RFQID = this.searchByRFQID
    const res : any = await this.afs.BBVWorkflowBlotter(this.Template_Code, frmDate, toDate, noteMasterID,pageNo,pageSize,RFQID,this.filterField);
      if (res && res.length > 0) {
        var distinctClubbing = res.map(item => item.ClubbingRFQId).filter((value, index, self) => self.indexOf(value) === index);
        var bestPriceRecords = res.filter(item => item.EP_BestPrice_YN === 'Y')
        for (var i = 0; i < distinctClubbing.length; i++) {
          var idx1 = bestPriceRecords.findIndex(item => item.ClubbingRFQId == distinctClubbing[i]);
          if (idx1 == -1) {
            var idx3 = res.findIndex(item => item.ClubbingRFQId == distinctClubbing[i]);
            if (idx3 !== -1) {
              res[idx3].EP_BestPrice_YN = "YN"
            }
          }
        }

        var bestPriceRecords = res.filter(item => item.EP_BestPrice_YN === 'Y' || item.EP_BestPrice_YN === 'YN');
        this.phoenixWFBlotterData_ALLRFQ.map(v => Object.assign(v, { isExpand: false }));
        var AllRecordsFiltered = [];
        for (let i = 0; i < bestPriceRecords.length; i++) {
          AllRecordsFiltered.push(res.filter(obj => obj.ClubbingRFQId === bestPriceRecords[i].ClubbingRFQId));
        }

        this.phoenixWFBlotterData_ALLRFQ = bestPriceRecords;
        this.phoenixWFBlotterData_ALLRFQ.forEach(ele => {ele.ER_TradeDate = new Date(Date.parse(ele.ER_TradeDate  + ' UTC'));}) //Added by Jyoti S || 14-Jun-2023 // Modified by Varsha G || HSBCECCLI-99 || 28-Feb-2024
        //this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
        this.phoenixWFBlotterData_ALLRFQExpand = AllRecordsFiltered;
        console.log(this.phoenixWFBlotterData_ALLRFQExpand,"this.phoenixWFBlotterData_ALLRFQExpand APURVA")

        this.phoenixWFBlotterData_ALLRFQ.map(v => Object.assign(v, { isExpand: false }));

        if (this.searchByRFQID !== '') {
          this.phoenixWFBlotterData_ALLRFQ = [];

          for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand.length; i++) {
            const filterarr = this.phoenixWFBlotterData_ALLRFQExpand[i].filter(rfq =>
              rfq.EP_BestPrice_YN === 'Y' || rfq.EP_BestPrice_YN === 'YN');
            if (filter && filterarr.length > 0) {
              for (let j = 0; j < filterarr.length; j++) {
                this.phoenixWFBlotterData_ALLRFQ.push(filterarr[j]);
              }
            }
          }
        }

        this.noOfRecords = parseInt(this.phoenixWFBlotterData_ALLRFQ[0]?.Count);
        this.pageLastRecord = (this.pageNo * this.pageSize + this.pageSize)<= this.noOfRecords ? (this.pageNo * this.pageSize + this.pageSize):this.noOfRecords;
        //this.pageLastRecord = this.noOfRecords <= this.pageSize ? this.noOfRecords :  (this.pageNo * this.pageSize + this.pageSize);
        this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
      }
      else{
        //if (res.length < 0) {
         this.noRecordlbl = "No records found"
         this.noRecordlblFlag = true;
         this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
         this.noOfRecords = 0;
         this.pageLastRecord = this.pageSize;
        //}
      }
        
      this.phoenixWFBlotterData_ALLRFQ_Orig = [];
        this.phoenixWFBlotterData_ALLRFQ.forEach(item => {
          this.phoenixWFBlotterData_ALLRFQ_Orig.push(item);
        });
        this.phoenixWFBlotterData_ALLRFQExpand_Orig = [];
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          this.phoenixWFBlotterData_ALLRFQExpand_Orig.push(item);
        });
      return false;
  }
  openAcc(prod: any) {
    try {
      this.searchByRFQID = '';
      this.requestType = 'P';
      if (prod === 1) {
        this.accord = 1;
        return false;
      } else if (prod === 2) {
        this.accord = 2;
        return false;
      } else if (prod === 3) {
        this.accord = 3;
        return false;
      } else if (prod === 4) {
        this.accord = 4;
        return false;
      } else if (prod === 4) {
        this.accord = 4;
        return false;
      } else if (prod === 5) {
        this.accord = 5;
        return false;
      } else if (prod === 6) {
        this.accord = 6;
        return false;
      } else if (prod === 7) {
        this.accord = 7;
        return false;
      } else if (prod === 8) {
        this.accord = 8;
        return false;
      } else if (prod === 9) {
        this.accord = 9;
        return false;
      } else if (prod === 10) {
        this.accord = 10;
        return false;
      }
      return false;
    } catch (error) {
      //console.log(error);
    }
  }

  async matExpansionOnClick(queryToSearch) {
    try {
      this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
      this.Product_Code=queryToSearch; //added by PoojaW
      const prvQuoteWrkflwId = 1;
      const queueid = 0;

      this.filterStr = '';
      this.successMsg = '';
      this.ErrorMsg = '';
      this.noRecordlbl = "";
      this.setPaginatorValues();

      const frmDate1 = new Date(this.frmDate + ' 00:00:00').toLocaleString('es-AR', { timeZone: 'Europe/Madrid' });
      // //console.log("frmDate:" + frmDate1);
      const toDate1 = new Date(this.toDate + ' 23:59:59').toLocaleString('es-AR', { timeZone: 'Europe/Madrid' });
      // //console.log("toDate:" + toDate1);

      const formatedFrmDate1 = frmDate1.split(' ')[0].split('/')[1] +
        '/' +
        frmDate1.split(' ')[0].split('/')[0] +
        '/' +
        frmDate1.split(' ')[0].split('/')[2];


      const formatedToDate1 = toDate1.split(' ')[0].split('/')[1] +
        '/' +
        toDate1.split(' ')[0].split('/')[0] +
        '/' +
        toDate1.split(' ')[0].split('/')[2];

      const frmDate2 = this.datepipe.transform(formatedFrmDate1, 'dd-MMM-yyyy') +
        ' ' +
        new Date(this.frmDate + ' 00:00:00').toLocaleString('es-AR', { timeZone: 'Europe/Madrid' }).split(' ')[1];

      //  //console.log(frmDate2);
      //  //console.log(this.cfs.getSpainDate(this.frmDate,"00:00:00"));
      this.frmDate22 = this.cfs.getSpainDate(this.frmDate, '00:00:00');

      const toDate2 = this.datepipe.transform(formatedToDate1, 'dd-MMM-yyyy') +
        ' ' +
        new Date(this.toDate + ' 23:59:59').toLocaleString('es-AR', { timeZone: 'Europe/Madrid' }).split(' ')[1];

      // //console.log(toDate2);
      // //console.log(this.cfs.getSpainDate(this.toDate,"23:59:59"));
      this.toDate22 = this.cfs.getSpainDate(this.toDate, '23:59:59');

      // this.phoenixWFBlotterData_ALLRFQNew = [];
      // this.phoenixWFBlotterData_ALLRFQExpandNew = [];

      this.phoenixWFBlotterData_ALLRFQ = [];
      this.phoenixWFBlotterData_ALLRFQExpand = [];
      this.phoenixWFBlotterData_ALLRFQ_Orig = [];
      this.phoenixWFBlotterData_ALLRFQExpand_Orig = [];
      // this.afs.BBVWorkflowBlotter(queryToSearch, prvQuoteWrkflwId, queueid, this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", this.requestType, this.pageSize, "");
   //const res = await this.afs.BBVWorkflowBlotter(queryToSearch, this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", "",this.pageNo.toString(),this.pageSize.toString());
    await this.getRFQData(this.Product_Code,this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", "",this.pageNo.toString(),this.pageSize.toString())
    this.Template_Code = queryToSearch
    this.docSupportStatus = await this.afs.GetDocumentSupportStatus(queryToSearch);
      return false;
    } catch (error) {
      //console.log(error);
    }
  }

  setPaginatorValues() {
    try {
      this.pageNo = 0; 
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.pageFirstRecord = (this.pageNo * this.pageSize);
      this.pageLastRecord = this.pageSize;
    } catch (error) {
      //console.log(error);
    }
  }
  replaceChar(str) {
    try {
      return (str.toString().replace(/_x0020_/g, ' '));
    } catch (error) {
      //console.log(error);
    }
  }

  hideAllFilters(FilterFlagArray) {
    try {
      for (let i = 0; i < FilterFlagArray.length; i++) {
        if (FilterFlagArray[i]) {
          FilterFlagArray[i] = false;
        }
      }
      return FilterFlagArray;
    } catch (error) {
      //console.log(error);
    }
  }

  async dateChange() {
    this.clearAllDocIntervals();
    await this.onChange(this.frmDate, this.toDate);
    //this.noOfRecords = this.phoenixWFBlotterData_ALLRFQ.length;
    //this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords }) // Commented by Jyoti S || 06-Jul-2023
  }
  async onChange(frmDate, toDate) {
    try {
      this.ErrorMsg = '';
      this.successMsg = '';
      this.clearAllDocIntervals();
      this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282

      const d1 = Date.parse(toDate);
      const d2 = Date.parse(frmDate);
      if (d1 < d2) {
        this.ErrorMsg = 'Please enter valid date.';
      } else {
        this.ErrorMsg = '';
      }
      // let product = '';

      // var idx = this.afs.payOffList.findIndex(element => element.accord === this.accord);
      // if (idx > -1) {
      //   product = this.afs.payOffList[idx].prevQuoteProductName
      // }
      //await this.matExpansionOnClick(product);
      this.setPaginatorValues();
      await this.getPageInfo({'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords });
      return false;
    } catch (error) {
      //console.log(error);
    }
  }
  chngChkBox() {
    try {
    } catch (error) {
      //console.log(error);
    }
  }

  postBackMethod() {
    try {
      return false;
    } catch (error) {
      //console.log(error);
    }
  }
  // getPageInfo(pageInfo) {
  //   //Changed by Jyoti S || 31-Mar-2023
  //   try {
      
  //     this.noOfRecords = pageInfo.length;
  //     let x = pageInfo.pageNo * pageInfo.pageSize ;
  //     if ( x >= this.noOfRecords ||  pageInfo.reload) {
  //       this.pageNo = 0;
  //     }
  //     else if(x < 0){
  //       this.pageNo = Math.floor(this.noOfRecords/pageInfo.pageSize);
       
  //     }
  //     else {
  //       this.pageNo = pageInfo.pageNo;
  //     }

  //     this.pageSize = pageInfo.pageSize;
  //     this.pageFirstRecord = (this.pageNo * this.pageSize) + 1 > this.noOfRecords ? ((this.pageNo - 1) * this.pageSize) + 1 : (this.pageNo * this.pageSize) + 1;//Changes done by Jyoti S || 24-Apr-2023
  //     this.pageLastRecord = ((this.pageNo + 1) * this.pageSize) >= this.noOfRecords
  //       ? this.noOfRecords : ((this.pageNo + 1) * this.pageSize);

  //     this.phoenixWFBlotterData_ALLRFQ.forEach((item) => {
  //       item.isExpand = false;
  //     });

  //   } catch (error) {
  //     //console.log(error);
  //   }
  // } //old one 


  async getPageInfo(pageInfo) {
    //Changed by Jyoti S || 31-Mar-2023
    try {
      this.pageloadflag = true;
      this.noOfRecords = pageInfo.length;
	    this.pageNo = pageInfo.pageNo;
      this.pageSize = parseInt(pageInfo.pageSize);
      let x = pageInfo.pageNo * pageInfo.pageSize ;
      if ( x >= this.noOfRecords || pageInfo.reload) {
       this.pageFirstRecord = 0;
       this.pageNo=0;
      }
      else if(x < 0){
        this.pageNo= Math.floor(this.noOfRecords / this.pageSize);
        // this.pageFirstRecord = this.pageNo * this.pageSize + 1 > this.noOfRecords ? ((this.pageNo -1 ) * this.pageSize) : ((this.pageNo) * this.pageSize)
        this.pageFirstRecord = this.pageNo * this.pageSize + 1 > this.noOfRecords ? ((this.pageNo -1 ) * this.pageSize) : ((this.pageNo) * this.pageSize)
      }
      else {
        this.pageFirstRecord = x;
      }

      await this.getRFQData(this.Product_Code, this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", "",this.pageNo.toString(),this.pageSize.toString())
      this.phoenixWFBlotterData_ALLRFQ.forEach((item) => {
        item.isExpand = false;
      });

    } catch (error) {
      //console.log(error);
    }
  }

  closeDocsModal(val: boolean) {
    try {
      this.showDocsPopup = val;
    } catch (error) {
      console.log(error);
    }
  }

  showDocsModal() {
    try {
      this.showDocsPopup = true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }


  exportToExcel() {
    try {
      const prvQuoteWrkflwId = 1;
      const queueid = 0;
      if (this.accord === 1) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_Autocall');

      }
      if (this.accord === 2) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_ReverseCovertible');

      }
      if (this.accord === 3) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_CreditTranche');

      }
      if (this.accord === 4) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_Participation');
      }
      // < Apurva C | 13-Sep-2021 | Export to excel for ER../>
      if (this.accord === 5) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_EarlyRedemption');

      }

      // Added by Amogh K | 5May2022 | Added excel export for Yield Enhancement
      if (this.accord === 6) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_YieldEnhancement');

      }
      // < Apurva C | 13-Sep-2021 | Export to excel for Discount certificate../>
      if (this.accord === 7) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_DiscountCertificates');

      }
      if (this.accord === 8) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_Accumulator');

      }
      if (this.accord === 9) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_Decumulator');

      }
      if (this.accord === 10) {
        const exportToExcelData = this.phoenixWFBlotterData_ALLRFQ;
        this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'PreviousQuotes_CustomPayoffs');

      }
      return false;
    } catch (error) {
      //console.log(error);
    }
  }

  //<DrishtyR | 16-Aug-2021 | Changes for Export to Excel>
  // getExcelData(excelData) {
  //   try {
  //     const exlDataCopy = [];
  //     // tslint:disable-next-line: prefer-for-of
  //     for (let i = 0; i < excelData.length; i++) {
  //       this.editDateColumn(excelData[i], 'Created_x0020_At');
  //       this.editDateColumn(excelData[i], 'Updated_x0020_At');

  //       const record = this.removeActionColumn(excelData[i], 'Actions');
  //       exlDataCopy.push(record);
  //       // exlData[i]= this.removeActionColumn(this.phoenixWFBlotterData[i],'Actions');

  //     }
  //     return exlDataCopy;
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // }

  getExcelData(excelRFQData) { 
  //Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250 || START
    try {
      const exlDataCopy = [];
      var obj;
      var excelQuoteData;
      excelQuoteData = {};
      if (this.accord === 1) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            // console.log(filterItem , excelRFQData);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Need to check
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');
            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            obj["Autocall Freq"] = filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["EP_KO_Level"];
            obj["Stepdown"] = filterItem["ER_StepDown"] !== "" ? parseFloat(filterItem["ER_StepDown"]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Non-Call"] = parseFloat(filterItem["ER_NoncallDuration"]);
            obj["ER Coupon"] = filterItem["ER_KO_Type"] + " " + filterItem["EP_RebateCoupon"] + "%";
            obj["Coupon"] = filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            obj["Memory Pd"] = filterItem["ER_CouponMemory"];
            obj["Coupon Trigger"] = filterItem["EP_CouponBarrier"] + "% Obs: " + filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          })
        });
      }
      if (this.accord === 2) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " at " + filterItem["ER_KI_Type"];
            obj["ER Coupon"] = filterItem["ER_KO_Type"] + " " + filterItem["EP_RebateCoupon"] + "%";
            obj["Fixed Coupon"] = filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            obj["Memory PD"] = filterItem["ER_CouponMemory"];
            obj["Coupon Trigger"] = filterItem["EP_CouponBarrier"] + "% Obs: " + filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          });
        });
      }
      if (this.accord === 4) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["PaymentDate_PPN"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%) (Upside)"] = parseFloat(filterItem["UpsideStrike"]);
            obj["Gearing"] = parseFloat(filterItem["Gearing"]);
            obj["Upper Strike"] = parseFloat(filterItem["UpperStrike"]);
            obj["Min. Coupon"] = parseFloat(filterItem["MinCoupon"]);
            obj["Barrier Type"] = filterItem["UpsideBarrierType"];
            obj["Barrier Level"] = parseFloat(filterItem["UpsideBarrierLevel"]);
            obj["Strike (%) (Downside)"] = parseFloat(filterItem["DownsideStrike"]);
            obj["Lower Strike"] = parseFloat(filterItem["LowerStrike"]);
            obj["Barrier Type"] = filterItem["DownsideBarrierType"];
            obj["Barrier"] = parseFloat(filterItem["DownsideBarrierLevel"]);
            obj["Capital Gtd"] = parseFloat(filterItem["CapitalGtd"]);
            obj["Coupon"] = filterItem["Coupon"];
            obj["Coupon Freq"] = filterItem["CpnFreq"];
            exlDataCopy.push(obj);
          })
        });
      }
      if (this.accord === 5) {
        //ER
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            console.log(filterItem,"Accord 5 console APURVA");
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');

            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            // obj["Autocall Freq"] =filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["EP_KO_Level"];
            obj["Autocall Coupon"] = filterItem["ER_RebateCoupon"];
            obj["Step up/down"] = filterItem["ER_StepDown"] !== "" ? parseFloat(filterItem["ER_StepDown"]) : "-";
            obj["Non-Call"] = parseFloat(filterItem["ER_NoncallDuration"]);
            obj["Gearing"] = filterItem["Gearing"];

            // obj["ER Coupon"] = filterItem["EP_CouponPercentage"] + " " + filterItem["ER_CouponType"];
            obj["ER Coupon"] = filterItem["PeriodicCouponTypeDescription"];
            // obj["Coupon"] =filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            // obj["Memory Pd"] =filterItem["ER_CouponMemory"];
            // obj["Coupon Trigger"] =filterItem["EP_CouponBarrier"]+ "% Obs: " + filterItem["ER_Coupon_Frequency"];
            obj['Obs'] = filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          })
          console.log(this.phoenixWFBlotterData_ALLRFQExpand,"this.phoenixWFBlotterData_ALLRFQExpand APURVA")
        });
      }

      // Added by Amogh K | 5May2022 | Added excel generation for Yield Enhancement
      if (this.accord === 6) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          //YE
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');

            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            // obj["Autocall Freq"] =filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["CouponTriggerDescription"];
            obj["Stepdown"] = filterItem["ER_StepDown"] !== "" ? parseFloat(filterItem["ER_StepDown"]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Non-Call"] = filterItem["ER_NoncallDuration"] !== "" ? parseFloat(filterItem["ER_NoncallDuration"]): "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Gearing"] = filterItem["Gearing"];
            // obj["ER Coupon"] = "";
            // obj["Coupon"] =filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            // obj["Memory Pd"] =filterItem["ER_CouponMemory"];
            // obj["Coupon Trigger"] =filterItem["EP_CouponBarrier"]+ "% Obs: " + filterItem["ER_Coupon_Frequency"];
            obj['Obs'] = filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          })
        });
      }
      if (this.accord === 7) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
           if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');
            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            obj["Autocall Freq"] = filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["EP_KO_Level"];
            obj["Stepdown"] = parseFloat(filterItem["ER_StepDown"]);
            obj["Non-Call"] = parseFloat(filterItem["ER_NoncallDuration"]);
            obj["ER Coupon"] = filterItem["ER_KO_Type"] + " " + filterItem["EP_RebateCoupon"] + "%";
            obj["Coupon"] = filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            obj["Memory Pd"] = filterItem["ER_CouponMemory"];
            obj["Coupon Trigger"] = filterItem["EP_CouponBarrier"] + "% Obs: " + filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          })
        });
      }
      // Accumulator export to excel
      if (this.accord === 8) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Upfront (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]];
            }
            else {
              obj["Upfront (%)"] = parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]);
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            //obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];

            // Changed upfront mapping while exporting data to excel || PriyaL || 05May2022 || Issue reported by SakshiG.
            // obj["Upfront (%)"] = filterItem["Upfront"] && filterItem["Upfront"] !== '' ? parseFloat(filterItem["Upfront"]) : filterItem["Upfront"];

            obj["Upfront (%)"] = filterItem["ER_Upfront"] && filterItem["ER_Upfront"] !== '' ? parseFloat(filterItem["ER_Upfront"]).toFixed(2) : filterItem["ER_Upfront"];
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');
            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            //obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = filterItem["EP_StrikePercentage"] && filterItem["EP_StrikePercentage"] !== '' ? parseFloat(filterItem["EP_StrikePercentage"]) : filterItem["EP_StrikePercentage"];
            //obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            obj["Autocall Freq"] = filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["EP_KO_Level"];
            obj["Guaranteed Period"] = filterItem["ER_GuaranteedDuration"] && filterItem["ER_GuaranteedDuration"] !== '' ? parseFloat(filterItem["ER_GuaranteedDuration"]) : filterItem["ER_GuaranteedDuration"];
            //obj["Non-Call"] = parseFloat(filterItem["ER_NoncallDuration"]);
            //obj["ER Coupon"] = filterItem["ER_KO_Type"] + " " + filterItem["EP_RebateCoupon"] + "%";
            //obj["Coupon"] = filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            //obj["Memory Pd"] = filterItem["ER_CouponMemory"];
            //obj["Coupon Trigger"] = filterItem["EP_CouponBarrier"] + "% Obs: " + filterItem["ER_Coupon_Frequency"];
            obj["Leverage"] = filterItem["LeverageRatio"]
            exlDataCopy.push(obj);
          })
        });
      }
      // Deccumulator export to excel
      if (this.accord === 9) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Upfront (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]];
            }
            else {
              obj["Upfront (%)"] = parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]);
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            //obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // Changed upfront mapping while exporting data to excel || PriyaL || 05May2022 || Issue reported by SakshiG.
            // obj["Upfront (%)"] = filterItem["Upfront"] && filterItem["Upfront"] !== '' ? parseFloat(filterItem["Upfront"]) : filterItem["Upfront"];

            obj["Upfront (%)"] = filterItem["ER_Upfront"] && filterItem["ER_Upfront"] !== '' ? parseFloat(filterItem["ER_Upfront"]).toFixed(2) : filterItem["ER_Upfront"];
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');
            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            //obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = filterItem["EP_StrikePercentage"] && filterItem["EP_StrikePercentage"] !== '' ? parseFloat(filterItem["EP_StrikePercentage"]) : filterItem["EP_StrikePercentage"];
            //obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            obj["Autocall Freq"] = filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["EP_KO_Level"];
            obj["Guaranteed Period"] = filterItem["ER_GuaranteedDuration"] && filterItem["ER_GuaranteedDuration"] !== '' ? parseFloat(filterItem["ER_GuaranteedDuration"]) : filterItem["ER_GuaranteedDuration"];
            //obj["Non-Call"] = parseFloat(filterItem["ER_NoncallDuration"]);
            //obj["ER Coupon"] = filterItem["ER_KO_Type"] + " " + filterItem["EP_RebateCoupon"] + "%";
            //obj["Coupon"] = filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            //obj["Memory Pd"] = filterItem["ER_CouponMemory"];
            //obj["Coupon Trigger"] = filterItem["EP_CouponBarrier"] + "% Obs: " + filterItem["ER_Coupon_Frequency"];
            obj["Leverage"] = filterItem["LeverageRatio"]
            exlDataCopy.push(obj);
          })
        });
      }  //Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250 || END
      if (this.accord === 10) {
        this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
          //YE
          item.forEach(filterItem => {
            //console.log(filterItem);
            obj = {};
            obj["RFQ ID"] = parseInt(filterItem["ClubbingRFQId"]);
            obj["Quote ID"] = parseInt(filterItem["ER_QuoteRequestId"]);
            obj["Counterparty"] = filterItem["PP_CODE"];
            if (filterItem[this.solveForArray[filterItem.ER_SolveFor]] == "") {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? filterItem[this.solveForArray[filterItem.ER_SolveFor]] : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            else {
              obj["Price (%)"] = filterItem[this.solveForArray[filterItem.ER_SolveFor]] !== "" ? parseFloat(filterItem[this.solveForArray[filterItem.ER_SolveFor]]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            }
            obj["Product"] = filterItem["ProductName"] + " " + filterItem["ER_UnderlyingCode"];
            obj["Format"] = filterItem["ER_Type"];
            obj["Solve For"] = filterItem["ER_SolveFor"];
            // obj["Price (%)"] = parseFloat(filterItem["EP_Price"]);//Commented by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            // obj["Strike Date"] =this.datepipe.transform(new Date(filterItem["ER_TradeDate"]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'dd-MMM-yyyy');

            // obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]);
            obj["Strike Date"] = new Date(filterItem["ER_TradeDate"]).toDateString() === 'Invalid Date' ? "" : new Date(filterItem["ER_TradeDate"]);
            obj["Payment Date"] = new Date(filterItem["ER_SettlmentDate"]);
            obj["Tenor"] = filterItem["ER_RFQTenor"];
            obj["Strike (%)"] = parseFloat(filterItem["EP_StrikePercentage"]);
            obj["Barrier"] = filterItem["EP_KI_Level"] + " " + filterItem["ER_KI_Type"];
            // obj["Autocall Freq"] =filterItem["ER_Frequency"];
            obj["Trigger"] = filterItem["CouponTriggerDescription"];
            obj["Stepdown"] = filterItem["ER_StepDown"] !== "" ? parseFloat(filterItem["ER_StepDown"]) : "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Non-Call"] = filterItem["ER_NoncallDuration"] !== "" ? parseFloat(filterItem["ER_NoncallDuration"]): "-";//Changed by Jyoti S || 06-Jun-2023 || FIN1EURINT-250
            obj["Gearing"] = filterItem["Gearing"];
            // obj["ER Coupon"] = "";
            // obj["Coupon"] =filterItem["EP_CouponPercentage"] + "% " + filterItem["ER_CouponType"];
            // obj["Memory Pd"] =filterItem["ER_CouponMemory"];
            // obj["Coupon Trigger"] =filterItem["EP_CouponBarrier"]+ "% Obs: " + filterItem["ER_Coupon_Frequency"];
            obj['Obs'] = filterItem["ER_Coupon_Frequency"];
            exlDataCopy.push(obj);
          })
        });
      }
      return exlDataCopy;
    } catch (error) {
      //console.log(error);
    }
  }
  //</DrishtyR | 16-Aug-2021 | Changes for Export to Excel>

  editDateColumn = (exlData, keyVal) => {
    try {
      for (const [key, value] of Object.entries(exlData)) {
        if (`${key}` === keyVal) {
          //console.log(`${key}`);
          exlData[`${key}`] = this.datepipe.transform(new Date(exlData[`${key}`]).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
            , 'dd-MMM-yyyy HH:mm:ss');
          break;
        }
      }
    } catch (error) {
      //console.log(error);
    }
  }
  removeActionColumn = (exlData1, keyVal) => {
    try {
      const { [keyVal]: omit, ...res } = exlData1;
      return res;
    } catch (error) {
      //console.log(error);
    }
  }

  async requestTS(RFQID,index:any,pindex:any) {
    try {

      this.ErrorMsg = '';
      this.successMsg = '';
      let productCode = '';
      let subTemplateCode = '';
      let preQuoteData1: any;
      preQuoteData1 = await this.afs.getPreviousQuoteCloneData(RFQID, 'RFQID');
      if (this.cfs.isEmptyObject(preQuoteData1)) {
        this.successMsg = '';
        this.ErrorMsg = 'No data found for this record.';
        return false;
      } else {
         //Changes done by Jyoti S || 24-May-2023 || START
        const that = this;
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSLoadFlag = true
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSDisFlag = true
        productCode = preQuoteData1.TemplateCode;
        subTemplateCode = preQuoteData1.SubTemplateCode;
        this.language = preQuoteData1.cloneData.language[0]?.replaceAll('~',',');
        this.country = preQuoteData1.cloneData.country[0]?.replaceAll('~',',');
        const res : any = await this.afs.termsheetSender(preQuoteData1.cloneData.PPCODE[0],preQuoteData1.cloneData.RFQID[0],productCode,this.language,this.country);
        if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
          const that = this;
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSLoadFlag = false
          this.ErrorMsg = '';
          this.successMsg = 'Termsheet awaited for ' + RFQID + '.';
          let TSTimeLeft = this.TSTimeout;
        const TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res :any=  await this.afs.ViewTermsheet(RFQID, 'IndicativeTermsheet');
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                TSTimeLeft = 0;
                clearInterval(TSInterval);
                that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSLoadFlag = false
                that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSDisFlag = false
                that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].MandateRequestYN = 'Y'
                this.ErrorMsg = '';
                this.successMsg = 'Termsheet received for ' + RFQID + '.';
              }else {
              TSTimeLeft = TSTimeLeft - 10;
            }
          }
          else {
            TSTimeLeft = TSTimeLeft - 10;
          }
          } else if (TSTimeLeft === 0 && that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSDisFlag == true) {
            this.successMsg = '';
            this.ErrorMsg = 'Termsheet response is taking longer than expected for ' + RFQID + '.';
            clearInterval(TSInterval);
            that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSLoadFlag = false
            that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSDisFlag = false
          }
        }, 10000);
        this.intervals.add(TSInterval);//Changed by Jyoti S || 23-Jun-2023
        //Changes done by Jyoti S || 24-May-2023 || END
        } else {
          this.successMsg = '';
          this.ErrorMsg = 'Request Failed for ' + RFQID + '.';
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSLoadFlag = false
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].TSDisFlag = false
        }
        return false;
      }
    } catch (error) {
      //console.log(error);
    }
    return false;
  }

  async ViewTermsheet(RFQID,index:any,pindex:any) {
    try {
      let noteMasterID = '';
      this.ErrorMsg = '';
      this.successMsg = '';
      let preQuoteData1: any;
      this.docsData = [];
      let showFlag = false;
      const that = this;
      that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewTSFlag = true;
      preQuoteData1 = await this.afs.getPreviousQuoteCloneData(RFQID, 'RFQID');
      if (this.cfs.isEmptyObject(preQuoteData1)) {
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewTSFlag = false;
        this.ErrorMsg = 'No data found for this record.';
      } else {
        noteMasterID = preQuoteData1.cloneData.Note_Master_Id[0];
      
      const res : any = await this.afs.ViewTermsheet(RFQID, 'IndicativeTermsheet');
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: preQuoteData1.cloneData.PPCODE[0]},
      ];
      if (res?.length) {
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewTSFlag = false;
        //<Sudarshan | base64 to Bytes>
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
             const downloadLink = document.createElement('a');
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
            const obj = {
              "Type": item["DocumentType"],
              "Country": item["DocumentCountry"],
              "Language": item["DocumentLanguage"],
              "File Name": item["Document_Output_Path"],
              "View": () => { downloadLink.click();},
            }
            thisRef.docsData.push(obj);
            showFlag = true;          
          }
          else {
            this.ErrorMsg = item.Status.toString();
            showFlag = false;
          }
        });
        //</Sudarshan | base64 to Bytes>       
        this.showDocsPopup = showFlag; 
      } else {
        this.showDocsPopup = false;
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewTSFlag = false;
        this.ErrorMsg = 'Termsheet not available. Please try again later.';
      }
    }
      return false;
    } catch (error) {
      //console.log(error);
    }
  }
  requestTypeChange() {
    try {
      //console.log(this.accord);
      if (this.accord === 1) {
        this.matExpansionOnClick('AutocallablePhoenix');
      } else if (this.accord === 2) {
        // this.matExpansionOnClick('ReverseConvertible,BarrierReverseConvertible')
        this.matExpansionOnClick('ReverseConvertible')
      } else if (this.accord === 3) {
        this.matExpansionOnClick('CreditTranche');
      } else if (this.accord === 4) {
        this.matExpansionOnClick('Participation');
      }
      // < Apurva C | 13-Sep-2021 | For tab switch between Requested and Scheduled./>
      else if (this.accord === 5) {
        this.matExpansionOnClick('EQC_Europe');
      } else if (this.accord === 6) {
        this.matExpansionOnClick('YieldEnhancement');
      }
      else if (this.accord === 7) {
        this.matExpansionOnClick('DiscountCertificates');
      }
      else if (this.accord === 8) {
        this.matExpansionOnClick('Accumulator');
      } else if (this.accord === 9) {
        this.matExpansionOnClick('Decumulator');
      }
      else if (this.accord === 10) {
        this.matExpansionOnClick('CustomPayoffs');
      }
      return false;
    }
    catch (error) {
      //console.log(error);
    }
  }

  async requestKID(RFQID,index:any,pindex:any) {
    try {
      this.successMsg =''
      this.ErrorMsg = '';
      let productCode = '';
      let subTemplateCode = '';
      let preQuoteData1: any;
      preQuoteData1 = await this.afs.getPreviousQuoteCloneData(RFQID, 'RFQID');
      if (this.cfs.isEmptyObject(preQuoteData1)) {
        this.ErrorMsg = 'No data found for this record.';
      } else {
        //Changes done by Jyoti S || 24-May-2023 || START
        const that = this;
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDLoadFlag = true
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDDisFlag = true
        productCode = preQuoteData1.TemplateCode;
        subTemplateCode = preQuoteData1.SubTemplateCode;
        this.language = preQuoteData1.cloneData.language[0].replaceAll('~',',');
        this.country = preQuoteData1.cloneData.country[0].replaceAll('~',',');
        const res : any = await this.afs.KIDSender(preQuoteData1.cloneData.PPCODE[0],preQuoteData1.cloneData.RFQID[0],productCode,this.language,this.country);;
        if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDLoadFlag = false
              this.ErrorMsg = '';
              this.successMsg = 'KID Awaited for ' + RFQID + '.';
           let TSTimeLeft = this.TSTimeout;
            const KIDInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res : any = await this.afs.ViewTermsheet(RFQID, 'Kid');
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                TSTimeLeft = 0;
                clearInterval(KIDInterval);
               this.ErrorMsg = '';
               this.successMsg = 'KID Received ' + RFQID + '.';
               that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDDisFlag = false;
               that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].EP_ConfirmClickTiming = 'Y';

              } else {
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDDisFlag == true ) {
            that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDDisFlag = false
            this.successMsg = '';
            this.ErrorMsg = 'KID response is taking longer than expected for ' + RFQID + '.';
            clearInterval(KIDInterval);
          }
        }, 10000);
        this.intervals.add(KIDInterval);
        } else {
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDLoadFlag = false
          that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].KIDDisFlag = false
          this.successMsg = '';
          this.ErrorMsg = 'Request Failed for ' + RFQID + '.';
        }//Changes done by Jyoti S || 24-May-2023 || END

        return false;
      }
    } catch (error) {
      //console.log(error);
    }
  }

  async ViewKID(RFQID,index:any,pindex:any) {
    
    try {
      let noteMasterID = '';
      this.ErrorMsg = '';
      this.successMsg = '';
      let preQuoteData1: any;
      this.docsData = [];
      let showFlag = false;
      const that = this;
      that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewKIDFlag = true
      preQuoteData1 = await this.afs.getPreviousQuoteCloneData(RFQID, 'RFQID');
      if (this.cfs.isEmptyObject(preQuoteData1)) {
        this.ErrorMsg = 'No data found for this record.';
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewKIDFlag = false;
      } else {
      noteMasterID = preQuoteData1.cloneData.Note_Master_Id[0];
      const res : any= await this.afs.ViewTermsheet(RFQID, 'Kid');
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: preQuoteData1.cloneData.PPCODE[0]},
      ];
      if (res?.length) {
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewKIDFlag = false;
        //<Sudarshan | base64 to Bytes>
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
            const downloadLink = document.createElement('a');
            let fileName = item.Document_Output_Path;
            downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
            downloadLink.download = fileName;
           const obj = {
            "Type": item["DocumentType"],
            "Country": item["DocumentCountry"],
            "Language": item["DocumentLanguage"],
            "File Name": item["Document_Output_Path"],
            "View": () => { downloadLink.click();},      
          }
          thisRef.docsData.push(obj);
          showFlag = true;
        }
           else {
            this.ErrorMsg = item.Status.toString();
            showFlag = false;
          }
        });
        //</Sudarshan | base64 to Bytes>      
        this.showDocsPopup = showFlag; 
      } 
       //Changes done by Jyoti S || FIN1EURINT-319 || 16-May-2023

       else {
        this.showDocsPopup = false;
        that.phoenixWFBlotterData_ALLRFQExpand[index][pindex].ViewKIDFlag = false;
        this.ErrorMsg = 'KID not available. Please try again later.';
      }
    }
      return false;
    } catch (error) {
      //console.log(error);
    }
  }

  removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {

        delete arr[i];

      }
    }
    //console.log(arr);
    // return arr;
  }

  // Modified logic of launch product by Priya L. - 16-April-2021

  interval: any;
  timeLeft: any;
  openLaunchProductBasedonRFQ(RFQID: any, Mode: any) {
    // added loader icon on launching product || PriyaL || 04-Apr-2022 || Assigned by Pranav D.
    $('#loading').show();
    setTimeout(async () => {
      //console.log(RFQID, this.accord);
      //console.log(this.redirectFrom);
      //console.log(Mode);
      // this.redirectFrom = this.redirectFrom === 'PrevQuotes' ? '' : this.redirectFrom;
      this.redirectFrom = (!this.redirectFrom || this.redirectFrom === '') ? 'PrevQuotes' : this.redirectFrom;
      this.prodLaunchDoneFlag = false;
      this.openForSubDoneFlag = false;
      this.launchProductMode = Mode;
      this.successMsgProdLaunch = "";
      this.errorMsgProdLaunch = "";
      this.popupSuccessMsg = ''
      this.fileNameArr = [];
      this.prodName = '';
      this.timeLeft = 0;


      this.nonBestPricereason = '';
      this.otherReason = '';
      this.selectedBookingBranch = '';
      this.selectedSharesData = [];

      if (RFQID) {
        let preQuoteData1 = {};
        this.selectedRFQData = [];
        this.ErrorMsg = '';

        preQuoteData1 = await this.afs.getPreviousQuoteCloneData(RFQID, 'RFQID');
        console.log(preQuoteData1,"this is popup data");
        if (this.cfs.isEmptyObject(preQuoteData1)) {
          this.ErrorMsg = 'No data found for this record.';
          return false;
        } else {
          // Launch Product popup nonbestprice and bokking center
          this.commonData = await this.afs.GetCommonDataEuroConnect(preQuoteData1['TemplateCode']);
          if (this.commonData && this.commonData.length > 0) {

            this.NonBestPriceReasonArr = this.parseCommonDatatoJSONArr('NonBestPriceReason');

            // this.OrderTypeLaunchProd[0] = 'Limit'

            // commented below case as booking center is fetched from api -by Priya L. on 14Mar2022 - assigned by Pranav D.
            // this.BookingCenter = this.parseCommonDatatoJSONArr('BookingCenter');

            // if (this.BookingCenter && this.BookingCenter.length > 0) {
            //   // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav D.
            //   this.selectedBookingBranch = this.BookingCenter[0].Value;
            // }
          }

          // Fetch booking center - added by Priya L. on 14Mar2022 - assigned by Pranav D.
          if (this.afs.BookingCenter === undefined || this.afs.BookingCenter.length <= 0) {
            this.BookingCenter = await this.afs.GetBookingCenter();
          }
          this.BookingCenter = this.afs.BookingCenter;

          if (this.BookingCenter && this.BookingCenter.length > 0) {
            // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav D.
            this.selectedBookingBranch = this.BookingCenter[0].BookingCenterCode;
          }

          this.selectedRFQData = preQuoteData1['cloneData'];
          console.log(this.selectedRFQData,"Apurva RFQ data");

          // return false;
          // this.selectedRFQData['Quote_Response_At'] = "3/3/2022 1:46:57 PM"
          // this.selectedRFQData['ValidUntilTime'] = "3/3/2022 1:51:57 PM"
          //console.log(this.selectedRFQData.Quote_Response_At[0]);
          //console.log(this.selectedRFQData.ValidUntilTime[0]);

          //console.log(new Date(this.selectedRFQData.Quote_Response_At));
          //console.log(new Date(this.selectedRFQData.ValidUntilTime));
          //console.log(new Date(this.selectedRFQData.ValidUntilTime).getTime() - new Date(this.selectedRFQData.Quote_Response_At).getTime());

          //console.log(this.datepipe.transform(this.selectedRFQData.Quote_Response_At, 'yyyy-MM-dd'));

          //console.log(this.datepipe.transform(this.selectedRFQData.ValidUntilTime, 'yyyy-MM-dd'));

          if (this.launchProductMode === 'Launch Product' && (this.redirectFrom == 'PrevQuotes' || this.redirectFrom == 'Pricers')) {

            this.timeLeft = (new Date(this.selectedRFQData.ValidUntilTime).getTime() - new Date(this.selectedRFQData.Quote_Response_At).getTime());
            // this.timeLeft = (new Date(this.selectedRFQData.Quote_Response_At).getTime()  - new Date(this.selectedRFQData.ValidUntilTime).getTime());
            //console.log(this.timeLeft);
            this.timeLeft = this.timeLeft / 1000;
            //console.log(this.timeLeft);
            // this.timeLeft = 20;
            if (this.timeLeft > 0) {
              this.interval = setInterval(() => {

                if (this.timeLeft > 0) {
                  this.timeLeft = this.timeLeft - 1;
                  // //console.log(this.timeLeft);
                } else if (this.timeLeft === 0 || this.timeLeft < 0) {

                }
              }, 1000);
            }
          }


          this.tCode = preQuoteData1['TemplateCode'];

          if (this.accord === 3) {
            this.getSelectedIndexData(this.selectedRFQData);
          } else if (this.accord === 5 || this.accord === 6 || this.accord === 7) {
            this.getSelectedShareDataER(this.selectedRFQData);
            //console.log(this.selectedSharesData);
          } else if (this.accord === 8 || this.accord === 9) {
            //this.getSelectedShareDataAQDQ(this.selectedRFQData.SN1_Custom[0]);
            this.getSelectedShareDataAQDQ(this.selectedRFQData);
          }
          else {
            this.getSelectedShareData(this.selectedRFQData);
            //console.log(this.selectedSharesData);
          }
        }


        if (this.accord === 1) {
          this.issuePriceLaunchPopup = this.selectedRFQData?.InputIssuePricePercent[0];
          this.reofferPriceLaunchPopup = this.selectedRFQData?.InputInterBankPrice[0];
        } else if (this.accord === 2) {
          this.issuePriceLaunchPopup = this.selectedRFQData?.InputIssuePricePercent[0];
          this.reofferPriceLaunchPopup = this.selectedRFQData?.InputInterBankPrice[0];
        } else if (this.accord === 3) {
          this.issuePriceLaunchPopup = this.selectedRFQData?.InputInterBankPrice[0];
          this.reofferPriceLaunchPopup = this.selectedRFQData?.InputReofferPrice[0];
        } else if (this.accord === 5) {
          this.issuePriceLaunchPopup = this.selectedRFQData?.IssuePrice[0];
          this.reofferPriceLaunchPopup = this.selectedRFQData?.IBPrice[0]; // Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
          this.ERCouponType = this.selectedRFQData?.ERCouponType[0];
          this.ERPeriodicCpnFlg = this.selectedRFQData?.periodicCouponFlag[0];// Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
          this.ERCouponpa = this.selectedRFQData?.ERCoupon[0];
        } else if (this.accord === 6) {
          this.issuePriceLaunchPopup = this.selectedRFQData?.IssuePrice[0];
          this.reofferPriceLaunchPopup = this.selectedRFQData?.IBPrice[0];// Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
        }
        // else if (this.accord === 7) {
        //   this.issuePriceLaunchPopup = this.selectedRFQData.IssuePrice[0];
        //   this.reofferPriceLaunchPopup = this.selectedRFQData.Reoffer[0];
        // } else if (this.accord === 8) {
        //   this.issuePriceLaunchPopup = this.selectedRFQData.IssuePrice[0];
        //   this.reofferPriceLaunchPopup = this.selectedRFQData.Reoffer[0];
        // } else if (this.accord === 9) {
        //   this.issuePriceLaunchPopup = this.selectedRFQData.IssuePrice[0];
        //   this.reofferPriceLaunchPopup = this.selectedRFQData.Reoffer[0];
        // }


        if (this.accord === 5 || this.accord === 6 || this.accord === 7) { // ucp products - added by Priya L. on 22-Sep-2021

          // var dateArr = this.selectedRFQData.ComputedStrikeDateText[0].split("/");
          // //console.log(dateArr);
          // // //console.log(dateArr[2] + "/" + dateArr[1]+ "/" + dateArr[0]);
          // this.stkdate = this.datepipe.transform(dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0], 'dd-MMM-yyyy');
          // var dateArr = this.selectedRFQData.ComputedSettlementDateText[0].split("/")

          // this.settdate = this.datepipe.transform(dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0], 'dd-MMM-yyyy');
          // this.expshift = this.selectedRFQData.ComputedPayoffSoftTenor;

          //console.log(this.selectedRFQData);
          // Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
          this.ERStrikeDate = this.datepipe.transform(this.selectedRFQData.stkdate[0].split('T')[0], 'dd-MMM-yyyy');
          this.ERSettDate = this.datepipe.transform(this.selectedRFQData.settdate[0].split('T')[0], 'dd-MMM-yyyy');

          this.expshift = this.selectedRFQData.ExpShifter[0];
          if (this.accord === 5) {
            this.ERType = this.selectedRFQData.autocallCouponType[0];
            this.ERFreq = this.selectedRFQData.autoFreq[0];
            // this.ERAutocallableFrom = this.selectedRFQData.NonCall[0];
            this.ERAutocallableFrom = this.selectedRFQData.autoNonCall[0];
            this.ERTrigger = this.selectedRFQData.autoTrigger[0];
            this.minERTrigger = this.selectedRFQData.startingAutocall?.[0]; //Added by ApurvaK solvefor|11th Nov 2021
            this.ERStepDown = this.selectedRFQData.autoStepdown[0];
          }

          if (this.accord === 5 || this.accord === 6) {
            this.YECouponType = this.selectedRFQData.cpnType[0];
            this.YECouponBarrierType = this.selectedRFQData.cpnObservation[0];
            this.YECouponBarrierLevel = this.selectedRFQData.cpnTrigger[0];
            this.YECoupon = this.selectedRFQData.cpnCoupon[0];
            this.YECouponFreq = this.selectedRFQData.cpnFreq[0];
            this.YECouponInFine = this.selectedRFQData.cpnInFine[0];
            this.YERangeAccrualFreq = this.selectedRFQData.rangeAccrualFreq[0];
            this.YELowerTrigger = this.selectedRFQData.lowCpnBarrier[0];
            this.YEUpperTrigger = this.selectedRFQData.upperCpnBarrier[0];
            this.YECouponFloatingFreq = this.selectedRFQData.cpnFltRef[0];
            this.YECouponFixing = this.selectedRFQData.cpnFixing[0];
            this.YEFloor = this.selectedRFQData.cpnFloor[0];
            this.minYEFloor = this.selectedRFQData.cpnFloor[0]; //Added by ApurvaK for solvefor|11th Nov 2021
            this.YECap = this.selectedRFQData.cpnCap[0];
            this.YEMultiplier = this.selectedRFQData.cpnMultiplier[0];
            this.YEMinCoupon = this.selectedRFQData.cpnCoupon[0];

          }

          this.protectionType = this.selectedRFQData.barrierType[0];
          this.putStrike = this.selectedRFQData.strike[0];
          this.minPutStrike = this.selectedRFQData.strike[0];  //Added by ApurvaK for solvefor|11th Nov 2021
          this.putGearing = this.selectedRFQData.leverage[0];
          this.KIBarrier = this.selectedRFQData.barrierLevel[0];
          this.minKIBarrier = this.selectedRFQData.barrierLevel[0]; //Added by ApurvaK for solvefor
          this.upperPutStrike = this.selectedRFQData.upperPutStrike[0];
          this.lowerPutStrike = this.selectedRFQData.lowerPutStrike[0];
          this.putSpreadGearing = this.selectedRFQData.putSpreadGearing[0];

          if (this.accord === 5 || this.accord === 6) {
            this.finalUpside = this.selectedRFQData.upsideType[0];
            this.lowerCallStrike = this.selectedRFQData.lowerCallStrike[0];
            this.upperCallStrike = this.selectedRFQData.upperCallStrike[0];
            this.callSpreadGearing = this.selectedRFQData.callSpreadGearing[0];
            this.callStrike = this.selectedRFQData.callStrike[0];
            this.callGearing = this.selectedRFQData.callGearing[0];
          }
        } else if (this.accord === 8 || this.accord === 9) {
          // this.AQDQStrikeDate = this.datepipe.transform(this.selectedRFQData.TradeDate[0].split('T')[0], 'dd-MMM-yyyy'); // Azure change
          // this.AQDQTenor = this.selectedRFQData.ActualTenor[0]; // Azure change
          this.AQDQTenor = this.selectedRFQData.Tenor[0]; // Azure change
          // this.AQDQType = this.selectedRFQData.ActualTenor[0]; // Azure change
          this.AQDQTrigger = this.selectedRFQData.KO[0];
          // this.AQDQFreq = this.selectedRFQData.ELN_Frequency[0];// Azure change
          this.AQDQFreq = this.selectedRFQData.Frequency[0];// Azure change
          // this.AQDQGuarantee = this.selectedRFQData.GuaranteedPeriod[0];
          // this.AQDQGuarantee = this.selectedRFQData.ActualGuranteedPeriods[0]; // Azure change
          this.AQDQGuarantee = this.selectedRFQData.GuaranteedDuration[0]; // Azure change
          this.AQDQStrike = this.selectedRFQData.Strike[0];
          this.minAQDQStrike = this.selectedRFQData.Strike[0]; //Added by ApurvaK for solvefor|26th Nov 2021
          // this.AQDQUpfront = this.selectedRFQData.Upfront_Perc[0]; // Azure change
          this.AQDQUpfront = this.selectedRFQData.Upfront[0];
          // this.minAQDQUpfront = this.selectedRFQData.Upfront_Perc[0]; //Added by ApurvaK for solvefor|11th Nov 2021 // Azure change
          this.minAQDQUpfront = this.selectedRFQData.Upfront[0]; //Added by ApurvaK for solvefor|11th Nov 2021
          this.AQDQLeverage = this.selectedRFQData.LeveragedYN[0] === 'True' ? 'Yes' : 'No';
          // this.DailySharesAQDQ = this.selectedRFQData.NoOfShares[0]; // Azure change
          this.DailySharesAQDQ = this.selectedRFQData.DailyNoOfShares[0]; // Azure change
          // this.EstimatedNotionalAQDQ = this.selectedRFQData.
        } else {
          var paymentshift = this.selectedRFQData.ComputedSettlementPeriodSoftTenor;
          if (this.accord == 3) {
            this.issueDate = this.datepipe.transform(this.selectedRFQData.InputIssueDate[0].split('T')[0], 'dd-MMM-yyyy');

            this.expshift = this.selectedRFQData.ComputedSettlementPeriodSoftTenor
          }
          else {
            var dateArr = this.selectedRFQData.ComputedStrikeDateText[0].split("/");
            //console.log(dateArr);
            // //console.log(dateArr[2] + "/" + dateArr[1]+ "/" + dateArr[0]);
            this.stkdate = this.datepipe.transform(dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0], 'dd-MMM-yyyy');
            var dateArr = this.selectedRFQData.ComputedSettlementDateText[0].split("/")

            this.settdate = this.datepipe.transform(dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0], 'dd-MMM-yyyy');
            this.expshift = this.selectedRFQData.ComputedPayoffSoftTenor;

          }

          // ComputedTenorText

          if (this.accord == 1) {
            this.autocallCouponType = this.selectedRFQData.StaticERCouponType ? this.checkBlank(this.selectedRFQData.StaticERCouponType[0]) : '';
            this.autoTrigger = this.selectedRFQData.InputKOBarrierString ? this.checkBlank(this.selectedRFQData.InputKOBarrierString[0]) : '';
            this.MinautoTrigger = this.selectedRFQData.InputKOBarrierString ? this.checkBlank(this.selectedRFQData.InputKOBarrierString[0]) : ''; //Added by ApurvaK for solvefor| 18 Nov 2021
            this.autoFreq = this.selectedRFQData.StaticKOFrequency ? this.checkBlank(this.selectedRFQData.StaticKOFrequency[0]) : '';
            this.autocallCoupon = this.selectedRFQData.InputERCouponAmountPercent ? this.checkBlank(this.selectedRFQData.InputERCouponAmountPercent[0]) : '';
            this.autoStepDown = this.selectedRFQData.InputKOStepdown ? this.checkBlank(this.selectedRFQData.InputKOStepdown[0]) : '';

            this.autoNonCall = this.selectedRFQData.StaticNonCallPeriod ? this.checkBlank(this.selectedRFQData.StaticNonCallPeriod[0]) : '';

          }
          if (this.accord == 1 || this.accord == 2) {
            this.cpnType = this.selectedRFQData.StaticCouponType ? this.checkBlank(this.selectedRFQData.StaticCouponType[0]) : '';
            this.cpnTrigger = this.selectedRFQData.InputCouponStrike ? this.checkBlank(this.selectedRFQData.InputCouponStrike[0]) : '-';
            this.cpnFreq = this.selectedRFQData.InputFixedCouponFrequencyPeriod ? this.checkBlank(this.selectedRFQData.InputFixedCouponFrequencyPeriod[0]) : '';
            this.cpnCoupon = this.selectedRFQData.InputFixedCouponPercentPA ? this.checkBlank(this.selectedRFQData.InputFixedCouponPercentPA[0]) : '';
            this.cpnMinCoupon = this.selectedRFQData.InputFixedCouponPercentPA ? this.checkBlank(this.selectedRFQData.InputFixedCouponPercentPA[0]) : '';
            this.cpnObservation = this.selectedRFQData.InputCouponObservation ? this.checkBlank(this.selectedRFQData.InputCouponObservation[0]) : '';


            this.barrierType = this.selectedRFQData.StaticKIBarrierType ? this.checkBlank(this.selectedRFQData.StaticKIBarrierType[0]) : '';
            this.barrierLevel = this.selectedRFQData.InitialInputKIBarrierPercent ? this.checkBlank(this.selectedRFQData.InitialInputKIBarrierPercent[0]) : '';
            this.minBarrierLevel = this.selectedRFQData.InitialInputKIBarrierPercent ? this.checkBlank(this.selectedRFQData.InitialInputKIBarrierPercent[0]) : ''; //Added by ApurvaK for solvefor| 25 Nov 2021
            this.Strike = this.selectedRFQData.InputStrikePercent ? this.checkBlank(this.selectedRFQData.InputStrikePercent[0]) : '';
            this.minStrike = this.selectedRFQData.InputStrikePercent ? this.checkBlank(this.selectedRFQData.InputStrikePercent[0]) : ''; //Added by ApurvaK for solvefor| 25 Nov 2021
          }
          //participatin
          //upside
          // upStrike
          // upGearing
          // upUpperStrike
          // upCoupon
          // upBarrierType
          // upBarrierLevel
          // upRebate
          if (this.accord == 4) {
            this.upStrike = this.selectedRFQData.InputStrikePercent ? this.checkBlank(this.selectedRFQData.InputStrikePercent[0]) : '';
            this.upBarrierType = this.selectedRFQData.InputKOBarrierFrequency ? this.checkBlank(this.selectedRFQData.InputKOBarrierFrequency[0]) : '';
            this.upGearing = this.selectedRFQData.UpsideParticipationPercent ? this.checkBlank(this.selectedRFQData.UpsideParticipationPercent[0]) : '';
            this.upBarrierLevel = this.selectedRFQData.InitialInputKOBarrierPercent ? this.checkBlank(this.selectedRFQData.InitialInputKOBarrierPercent[0]) : '';
            this.upUpperStrike = this.selectedRFQData.UpsideParticipationCapPercent ? this.checkBlank(this.selectedRFQData.UpsideParticipationCapPercent[0]) : '';
            this.upRebate = this.selectedRFQData.InputRebatePercent ? this.checkBlank(this.selectedRFQData.InputRebatePercent[0]) : '';
            this.upCoupon = this.selectedRFQData.InputMinimumCouponPercentPA ? this.checkBlank(this.selectedRFQData.InputMinimumCouponPercentPA[0]) : '';


            //participatin
            //downside
            // downStrike
            // downLowerStrike
            // downLeverage
            // downBarrierType
            // downBarrierLevel
            this.downStrike = this.selectedRFQData.InputDownsideStrikePercent[0] ? this.checkBlank(this.selectedRFQData.InputDownsideStrikePercent[0]) : '';
            this.downBarrierType = this.selectedRFQData.InputKIBarrierFrequency[0] ? this.checkBlank(this.selectedRFQData.InputKIBarrierFrequency[0]) : '';
            this.downLeverage = this.selectedRFQData.DownsideParticipationPercent[0] ? this.checkBlank(this.selectedRFQData.DownsideParticipationPercent[0]) : '';
            this.downBarrierLevel = this.selectedRFQData.InitialInputKIBarrierPercent[0] ? this.checkBlank(this.selectedRFQData.InitialInputKIBarrierPercent[0]) : '';
            this.downLowerStrike = this.selectedRFQData.DownsideParticipationCapPercent[0] ? this.checkBlank(this.selectedRFQData.DownsideParticipationCapPercent[0]) : '';


            //participatin
            //Guaranteed Coupon
            // capitalGuaranteed
            // guaranteedCoupon
            // guaranteedCouponFreq
            this.capitalGuaranteed = this.selectedRFQData.DownsideCapitalProtectionPercent[0] ? this.checkBlank(this.selectedRFQData.DownsideCapitalProtectionPercent[0]) : '';
            this.guaranteedCoupon = this.selectedRFQData.InputFixedCouponPercentPA[0] ? this.checkBlank(this.selectedRFQData.InputFixedCouponPercentPA[0]) : '';
            this.guaranteedCouponFreq = this.selectedRFQData.InputFixedCouponFrequencyPeriod[0] ? this.checkBlank(this.selectedRFQData.InputFixedCouponFrequencyPeriod[0]) : '';

          }

          // AttachVal
          // DetachVal = '';
          // cpnType  = '';
          // cpnFreq = '';
          // floatingRef = '';
          // cpnBasis = '';
          if (this.accord == 3) {
            this.AttachVal = this.selectedRFQData.InputCreditAttachmentInteger ? parseInt(this.selectedRFQData.InputCreditAttachmentInteger[0]).toString() : '';
            this.DetachVal = this.selectedRFQData.InputCreditDettachmentInteger ? parseInt(this.selectedRFQData.InputCreditDettachmentInteger[0]).toString() : '';

            this.cpnType = this.selectedRFQData.StaticCouponType ? this.checkBlank(this.selectedRFQData.StaticCouponType[0]) : '';
            this.cpnFreq = this.selectedRFQData.InputFixedCouponFrequency ? this.checkBlank(this.selectedRFQData.InputFixedCouponFrequency[0]) : '';
            this.floatingRef = this.selectedRFQData.InputFloatingIndex ? this.checkBlank(this.selectedRFQData.InputFloatingIndex[0]) : '';
            this.cpnBasis = this.selectedRFQData.InputCouponDayBasis ? this.checkBlank(this.selectedRFQData.InputCouponDayBasis[0]) : '';
            this.Spread = this.selectedRFQData.InputCouponOrSpreadPercent ? this.checkBlank(this.selectedRFQData.InputCouponOrSpreadPercent[0]) : '';

            // this.indexTranche = cloneData.InputCreditIndexTranche[0];

          }
          this.fundType = this.selectedRFQData.StaticFundingType ? this.checkBlank(this.selectedRFQData.StaticFundingType[0]) : '';
          this.fundFreq = this.selectedRFQData.StaticFundingFrequency ? this.checkBlank(this.selectedRFQData.StaticFundingFrequency[0]) : '';
          // this.MemoryPeriods = cloneData.InputMemoryPeriods[0];
          this.fundRate = this.selectedRFQData.InputFundingRateSpread ? this.checkBlank(this.selectedRFQData.InputFundingRateSpread[0]) : '';

          //Added by ApurvaK for solvefor|11th Nov 2021
          this.minFundRate = this.selectedRFQData.InputFundingRateSpread ? this.checkBlank(this.selectedRFQData.InputFundingRateSpread[0]) : '';
        }

        //console.log(this.selectedRFQData);
        // //console.log(this.cloneData);
        // //console.log(this.shares);
        // //console.log(this.selectedSharesData);
        this.toggleLaunch = true;
        //Changed by Amogh K | 15-Dec-2022 | solve for values not populating on product details pop up
        if (this.launchProductMode !== 'Launch Product' || (this.launchProductMode == 'Launch Product' && this.redirectFrom === 'RMW') ||
          (this.launchProductMode == 'Launch Product' && this.redirectFrom === 'WFBlotter')) {
          this.setMinMaxValues();
        }

        this.setSolveForValuesRFQID(RFQID);
        // this.setSolveForValues()

        if (this.NonBestPriceReasonArr && this.NonBestPriceReasonArr.length > 0 && !this.bestIssuerFlag) {
          this.nonBestPricereason = 'Please Select';
        }
        else {
          this.nonBestPricereason = '';
        }

        //console.log(this.viewOnly);
        //console.log(this.redirectFrom); // RMW manual hedge new pool

        this.setStartCloseDate();


        if (this.selectedRFQData.MinNotional[0] !== undefined && this.selectedRFQData.MinNotional[0] !== '' && parseFloat(this.selectedRFQData.MinNotional[0]) !== 0) {
          this.minNotional = parseFloat(this.selectedRFQData.MinNotional[0]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          if (this.accord === 8 || this.accord === 9) {
            //by Suvarna || minMAx notional size decimal issue AQ/DQ || assigned by Pranav D
            if (this.minNotional.includes(',')) {
              this.minNotional = this.minNotional.toString().replace(/,/g, '');
            }
            this.minNotional = parseFloat(this.minNotional).toFixed(0);
            this.minNotional = this.minNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          }
        } else {
          if (this.accord === 8 || this.accord === 9) {
            // this.minNotional = "10.00";
            this.minNotional = "10";
          }
          else {
            this.minNotional = "300,000.00";
          }
        }

        if (this.selectedRFQData.MaxNotional[0] !== undefined && this.selectedRFQData.MaxNotional[0] !== '' && parseFloat(this.selectedRFQData.MaxNotional[0]) !== 0) {
          this.maxNotional = parseFloat(this.selectedRFQData.MaxNotional[0]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          //by Suvarna || minMAx notional size decimal issue AQ/DQ || assigned by Pranav D
          if (this.accord === 8 || this.accord === 9) {
            if (this.maxNotional.includes(',')) {
              this.maxNotional = this.maxNotional.toString().replace(/,/g, '');
            }
            this.maxNotional = parseFloat(this.maxNotional).toFixed(0);
            this.maxNotional = this.maxNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        } else {
          if (this.accord === 8 || this.accord === 9) {
            // this.maxNotional = "1,000.00";
            this.maxNotional = "1,000";
          }
          else {
            this.maxNotional = "5,000,000.00";
          }
        }
        if (this.selectedRFQData.MinOrderSize[0] !== undefined && this.selectedRFQData.MinOrderSize[0] !== '' && parseFloat(this.selectedRFQData.MinOrderSize[0]) !== 0) {
          this.minOrderSize = parseFloat(this.selectedRFQData.MinOrderSize[0]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          this.minOrderSize = "100,000.00";
        }

        if (this.selectedRFQData.Denomination && this.selectedRFQData.Denomination[0] !== undefined && this.selectedRFQData.Denomination[0] !== '' && parseFloat(this.selectedRFQData.Denomination[0]) !== 0) {
          this.denomination = parseFloat(this.selectedRFQData.Denomination[0]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          this.denomination = "10,000.00";
        }

        // Checked NonBestPriceReason for undefined || Priya L || 30Mar2022 || assigned by Pranav D

        if (this.selectedRFQData.NonBestPriceReason && this.selectedRFQData.NonBestPriceReason[0] !== undefined && this.selectedRFQData.NonBestPriceReason[0] !== '') {
          //console.log(this.NonBestPriceReasonArr);
          var idx = this.NonBestPriceReasonArr.findIndex(item => item.Value === this.selectedRFQData.NonBestPriceReason[0])
          if (idx > -1) {
            this.nonBestPricereason = this.selectedRFQData.NonBestPriceReason[0];
          }
          else {
            this.nonBestPricereason = 'Other';
            this.otherReason = this.selectedRFQData.NonBestPriceReason[0];
          }
        }
        if (this.selectedRFQData.BookingBranch && this.selectedRFQData.BookingBranch[0] !== undefined && this.selectedRFQData.BookingBranch[0] !== '') {
          this.selectedBookingBranch = this.selectedRFQData.BookingBranch[0];
        }

        //  else {
        //   this.denomination = "10,000.00";
        // }

        if (this.selectedRFQData.Summary && this.selectedRFQData.Summary[0] !== undefined && this.selectedRFQData.Summary[0] !== '') {
          this.summary = this.selectedRFQData.Summary[0];
        } else {
          this.summary = "";
        }

        if (this.selectedRFQData.Remarks && this.selectedRFQData.Remarks[0] !== undefined && this.selectedRFQData.Remarks[0] !== '') {
          this.remark = this.selectedRFQData.Remarks[0];
        }
        //console.log(this.selectedRFQData.Remarks);

        // this.orderNotional = this.selectedRFQData.InputRFQNotionalAmount[0];
        //Added by ApurvaK for Autocall Barrier (%) and Autocall Trigger Solvefor | 25 Nov 2021
        if (this.selectedRFQData.ProductName[0] && this.selectedRFQData.ProductName[0] !== '') {
          this.prodName = this.selectedRFQData.ProductName[0];
        }

        //console.log(this.KIBarrier);


        if (this.launchProductMode !== 'Launch Product' || (this.launchProductMode == 'Launch Product' && this.redirectFrom === 'RMW') ||
          (this.launchProductMode == 'Launch Product' && this.redirectFrom === 'WFBlotter')) {
          this.setMinMaxValues();
        }

        // if(this.launchProductMode === 'Manual Hedge' || this.launchProductMode === 'ManualAllocations'){
        this.showviewOrderPopupFlag = false;
        this.viewOrderData = [];
        // if (this.launchProductMode === 'Manual Hedge' && (this.FilledQty && this.FilledQty !== '')) {
        // this.FilledQty = "1,000,000";
        // //console.log(this.launchProductMode);
        // //console.log(this.redirectFrom);
        if ((this.FilledQty && this.FilledQty !== '')) {
          // this.showviewOrderPopupFlag = false;
          // this.viewOrderData = [];
          // this.filledNotional = this.FilledQty;
          this.filledNotional = parseFloat(this.FilledQty.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          // this.filledNotional = this.orderNotional;
          // if() //launchProductMode === 'Manual Hedge' && redirectFrom === 'ManualAllocations'

          if ((this.launchProductMode == 'Manual Hedge' && this.redirectFrom === 'ManualHedge') ||
            (this.launchProductMode == 'Manual Hedge' && this.redirectFrom === 'ManualAllocations')) {
            this.getViewOrderData(this.selectedRFQData.NewNoteMasterID[0], 'N');
          }
          else {
            this.getViewOrderData(this.selectedRFQData.NewNoteMasterID[0], 'Y');
          }

        }
        // }
        await this.viewAttachment(this.selectedRFQData.NewNoteMasterID[0]);
        return false;
      }
      // Hide loader icon after launching product || PriyaL || 04-Apr-2022 || Assigned by Pranav D.
      $('#loading').hide();
    });
    return false;
  }

  async viewAttachment(NoteMasterID: any) {
    // this.showAttahmentflag = true;
    //console.log("this is view attachment func call", NoteMasterID);
    // this.downloadAttachment(NoteMasterID);
    this.fileNameArr = await this.afs.viewAttachment(NoteMasterID);
    // this.attachmentName = this.ViewAttachmentRes.DocumentName;
    //console.log(this.fileNameArr);
  }

  // "DocumentID": "",
  //                   "DocumentName": DocumentName,
  //                   "DocumentByteFile": byteData,
  //                   "DocumentFileType": DocumentFileType,
  //                   "NoteMasterID": "",
  //                   "CreatedAt": "",
  //                   "CreatedBy": "",
  //                   "EntityID": ""

  downloadAttachment(idx) {
    // //console.log(res);
    if (this.fileNameArr !== null && this.fileNameArr !== undefined && this.fileNameArr.length > 0) {
      // //console.log(this.ViewAttachmentRes);
      const bytes = new Uint8Array(this.fileNameArr[idx].DocumentByteFile);
      const blob = new Blob([bytes], { type: 'application/doc' }); //DocumentFileType
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.fileNameArr[idx].DocumentName;
      link.click();
    }
    else {
      this.errorMsgProdLaunch = 'Attachment not available. Please try again later.';

    }
  }

  removeAttachment(idx) {
    if (this.fileNameArr !== null && this.fileNameArr !== undefined && this.fileNameArr.length > 0) {
      this.fileNameArr.splice(idx, 1);
    }
  }

  isLaunchProduct() {
    if (this.launchProductMode === 'Launch Product' && !this.viewOnly) {
      return true;
    }
    else {
      return false;
    }
  }
  setStartCloseDate() {
    /*
      if (this.viewOnly) {
        //console.log()
        // if (this.selectedRFQData.StartDate[0] !== '1900-01-01' && this.selectedRFQData.CloseDate[0] !== '1900-01-01') {
        if (this.selectedRFQData.StartDate && this.selectedRFQData.StartDate[0] !== '' && this.selectedRFQData.CloseDate && this.selectedRFQData.CloseDate[0] !== '') {
          this.startDate = this.datepipe.transform(this.selectedRFQData.StartDate[0], 'yyyy-MM-ddTHH:mm');
          this.closeDate = this.datepipe.transform(this.selectedRFQData.CloseDate[0], 'yyyy-MM-ddTHH:mm');
        } else {
          this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
          
          var today = new Date();
          today.setDate(today.getDate() + 1);
          this.closeDate = this.datepipe.transform(today, 'yyyy-MM-ddTHH:mm');
          // this.closeDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
        }
  
      } else {
        this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
        // this.closeDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
        var today = new Date();
        today.setDate(today.getDate() + 1);
        this.closeDate = this.datepipe.transform(today, 'yyyy-MM-ddTHH:mm');
      }
  */
    //console.log(this.redirectFrom);
    // if (this.redirectFrom == 'PrevQuotes' || this.redirectFrom == 'Pricers' ) {
    if (this.launchProductMode === 'Launch Product' && (this.redirectFrom == 'PrevQuotes' || this.redirectFrom == 'Pricers')) {
      this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      // this.closeDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      var today = new Date();
      today.setDate(today.getDate() + 1);
      this.closeDate = this.datepipe.transform(today, 'yyyy-MM-ddTHH:mm');
    }
    else {
      if (this.selectedRFQData.StartDate && this.selectedRFQData.StartDate[0] !== '' && this.selectedRFQData.CloseDate && this.selectedRFQData.CloseDate[0] !== '') {
        this.startDate = this.datepipe.transform(this.selectedRFQData.StartDate[0], 'yyyy-MM-ddTHH:mm');
        this.closeDate = this.datepipe.transform(this.selectedRFQData.CloseDate[0], 'yyyy-MM-ddTHH:mm');
      } else {
        this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');

        var today = new Date();
        today.setDate(today.getDate() + 1);
        this.closeDate = this.datepipe.transform(today, 'yyyy-MM-ddTHH:mm');
        //console.log(this.startDate,"startDate APURVA");
        // this.closeDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      }
    }
  }

  setMinMaxValues() {
    //Added by ApurvaK for SolveFor| 25th Nov 2021| Start
    if (this.selectedRFQData.MinMaxCoupon[0] && this.selectedRFQData.MinMaxCoupon[0] !== '') {
      //Solvefor Coupon
      if (this.selectedRFQData.SolveFor == 'Coupon' || this.selectedRFQData.InputRFQSolveFor == 'Coupon' || this.selectedRFQData.SolveForCode == 'Coupon') {
        let MinMaxCpn = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //console.log(MinMaxCpn)
        if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
          this.YEMinCoupon = MinMaxCpn[0].trim();
          this.YECoupon = MinMaxCpn[1].trim();
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.YECoupon = MinMaxCpn;
          }
        }
        else {
          this.cpnMinCoupon = MinMaxCpn[0].trim();
          this.cpnCoupon = MinMaxCpn[1].trim();
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.cpnCoupon = MinMaxCpn;
          }

        }
      }

      //Solvefor Autocall Barrier (%) and Autocall Trigger 
      if (this.selectedRFQData.SolveFor == 'KO' || this.selectedRFQData.InputRFQSolveFor == 'KO' || this.selectedRFQData.SolveForCode == 'KO') {
        let MinMaxERTrigger = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //console.log(MinMaxERTrigger);
        //Autocall
        if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenix') {
          this.MinautoTrigger = MinMaxERTrigger[0].trim();
          this.autoTrigger = MinMaxERTrigger[1].trim();
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.autoTrigger = MinMaxERTrigger;
          }
        }
        //Autocallable
        else if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
          this.minERTrigger = MinMaxERTrigger[0].trim();
          this.ERTrigger = MinMaxERTrigger[1].trim();

        }
      }
      //Strike Solvefor 
      if (this.selectedRFQData.SolveFor == 'Strike' || this.selectedRFQData.InputRFQSolveFor == 'Strike') {
        let MinMaxStrike = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //Accumulator
        if (this.selectedRFQData.SubTemplate == 'Accumulator' || this.selectedRFQData.SubTemplate == 'Decumulator') {
          //console.log(MinMaxStrike);
          this.minAQDQStrike = MinMaxStrike[0].trim();
          this.AQDQStrike = MinMaxStrike[1] ? MinMaxStrike[1].trim() : '';
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.AQDQStrike = MinMaxStrike;
          }
        }
        //Autocall
        else {
          //console.log(MinMaxStrike);
          this.minStrike = MinMaxStrike[0].trim();
          this.Strike = MinMaxStrike[1] ? MinMaxStrike[1].trim() : '';
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.Strike = MinMaxStrike;
          }
        }
      }
      //Upfront (%) Solvefor
      if (this.selectedRFQData.SolveFor == 'Upfront') {
        let MinMaxUpfront = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //Accumulator
        if (this.selectedRFQData.SubTemplate == 'Accumulator') {
          //console.log(MinMaxUpfront);
          this.minAQDQUpfront = MinMaxUpfront[0].trim();
          this.AQDQUpfront = MinMaxUpfront[1] ? MinMaxUpfront[1].trim() : '';

          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.AQDQUpfront = MinMaxUpfront;
          }
        }
        //Decumulator
        if (this.selectedRFQData.SubTemplate == 'Decumulator') {
          //console.log(MinMaxUpfront);
          this.minAQDQUpfront = MinMaxUpfront[0].trim();
          this.AQDQUpfront = MinMaxUpfront[1] ? MinMaxUpfront[1].trim() : '';

          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.AQDQUpfront = MinMaxUpfront;
          }
        }
      }

      //Barrier Level(%) Solvefor 
      if (this.selectedRFQData.SolveFor == 'KI' || this.selectedRFQData.InputRFQSolveFor == 'KI' || this.selectedRFQData.SolveForCode == 'KI') {
        //Autocallable
        if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
          let MinMaxKIBarrier = this.selectedRFQData.MinMaxCoupon[0].split('to');
          this.minKIBarrier = MinMaxKIBarrier[0].trim();
          this.KIBarrier = MinMaxKIBarrier[1] ? MinMaxKIBarrier[1].trim() : '';
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.KIBarrier = MinMaxKIBarrier;
          }
        }
        //Autocall
        else if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenix') {
          let MinMaxbarrierLevel = this.selectedRFQData.MinMaxCoupon[0].split('to');
          //console.log(MinMaxbarrierLevel);
          this.minBarrierLevel = MinMaxbarrierLevel[0].trim();
          this.barrierLevel = MinMaxbarrierLevel[1] ? MinMaxbarrierLevel[1].trim() : '';
          // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
          if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
            this.barrierLevel = MinMaxbarrierLevel;
          }
        }
      }
      //Put Strike (%) Solvefor - Autocallable
      if (this.selectedRFQData.SolveFor == 'PutStrike' || this.selectedRFQData.SolveForCode == 'PutStrike') {
        let MinMaxPutStrike = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //console.log(MinMaxPutStrike);
        this.minPutStrike = MinMaxPutStrike[0].trim();
        this.putStrike = MinMaxPutStrike[1] ? MinMaxPutStrike[1].trim() : '';
        // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
        if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
          this.putStrike = MinMaxPutStrike;
        }
      }
      //Added by ApurvaK for Floor & Cap (%) Solvefor | 11 Nov 2021
      if (this.selectedRFQData.SolveFor == 'Floor' && this.selectedRFQData.MinMaxCoupon[0] && this.selectedRFQData.MinMaxCoupon[0] !== '') {
        let MinMaxYEFloor = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //console.log(MinMaxYEFloor);
        this.minYEFloor = MinMaxYEFloor[0].trim();
        this.YEFloor = MinMaxYEFloor[1] ? MinMaxYEFloor[1].trim() : '';
        // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
        if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
          this.YEFloor = MinMaxYEFloor;
        }
      }


      //Added by ApurvaK for Spread (%) Solvefor | 11 Nov 2021
      if (this.selectedRFQData.SolveFor == 'Spread' && this.selectedRFQData.MinMaxCoupon[0] && this.selectedRFQData.MinMaxCoupon[0] !== '') {
        let MinMaxFundRate = this.selectedRFQData.MinMaxCoupon[0].split('to');
        //console.log(MinMaxFundRate);
        this.minFundRate = MinMaxFundRate[0].trim();
        this.fundRate = MinMaxFundRate[1] ? MinMaxFundRate[1].trim() : '';
        // Handled solvefor field when mode is Manual Hedge - by Priya L. on 15Mar2022 - assigned by Pranav D.
        if (this.launchProductMode === 'Manual Hedge' && (this.EQ_Show_SolveRange_Launch_Product === 'Yes' || this.EQ_Show_SolveRange_Launch_Product === 'YES')) {
          this.fundRate = MinMaxFundRate;
        }
      }

    }


  }

  closeLaunchProduct() {

    this.toggleLaunch = false;
    this.viewOnly = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    // if(prodLaunchFlag,fillFlag,openForSubDoneFlag,prodLaunchFlag) this.redirectFrom === 'Amend' ? 'Amend' : this.redirectFrom === 'Reopen'
    var refreshWFBlotter = false;
    if ((this.prodLaunchFlag && (this.redirectFrom === 'Amend' || this.redirectFrom === 'Reopen')) || this.fillFlag || this.openForSubDoneFlag) {
      refreshWFBlotter = true;
    }
    // this.afs.prevQuoteLaunchPopUpRMW.next(false);
    this.afs.prevQuoteLaunchPopUpRMW.next([false, refreshWFBlotter]);
    if (this.prodLaunchFlag && !this.viewOnly && this.launchProductMode === 'Launch Product') {
      if (this.selectedRFQData && this.selectedRFQData.Note_Master_Id) {
        this.getRepriceData(this.selectedRFQData.Note_Master_Id[0], '');
      }
    }
    // this.afs.prevQuoteLaunchPopUpWFBlotter.next(false);

    // set close launch product subscriber to true || PriyaL || 05Apr2022 || Assigned by PranavD
    if (this.prodLaunchDoneFlag) {
      this.afs.closeLaunchProduct.next(true);
    }


  }


  getSelectedShareData(WFBdata) { // passing clone data arr - added by Priya L. - 19-April-2021
    this.shares = this.afs.shares;
    this.selectedSharesData = [];
    //  //console.log(WFBdata); 
    if (WFBdata.InputUnderlyingCSV && WFBdata.InputUnderlyingCSV[0] !== '') {
      WFBdata.InputUnderlyingCSV[0].split(',').forEach(element => {
        //console.log(element);
        var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
        if (index >= 0) {
          this.selectedSharesData.push(this.shares[index]);
        } else {
          this.selectedSharesData.push({
            BloombergCode: element,
            Ccy: "",
            Code: element,
            ExchangeCode: "",
            ExchangeName: "",
            LongName: element
          })
        }
      });
    }
    if (this.launchProductMode === 'Manual Hedge' || this.launchProductMode === 'ManualAllocations') {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        this.selectedSharesData[k]['DoneAt'] = '0.00';
      }
    }
  }

  getSelectedIndexData(WFBdata) { // passing clone data arr - added by Priya L. - 19-April-2021
    this.indexTrancheArr = this.afs.indexTrancheArr;

    this.selectedSharesData = [];

    var index = this.indexTrancheArr.findIndex(indexItem => (indexItem.LongName.split('-')[1]).trim() == WFBdata.InputCreditIndexTranche[0]);
    if (index >= 0) {
      this.selectedSharesData.push(this.indexTrancheArr[index]);
    }
  }

  getSelectedShareDataER(WFBdata) { // UCP Products - added by Priya L. - 22-Sep-2021
    this.shares = this.afs.shares;
    this.selectedSharesData = [];
    //  //console.log(WFBdata);
    /*
     WFBdata.Underlyings[0].split(',').forEach(element => {
       //console.log(element);
 
      
       Code - InputRICCode  ,
       Underlyings = ,
       Code Underlying1
       longName LN1    SLN1
       ExchangeCode IX1
 
       var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
       if (index >= 0) {
         this.selectedSharesData.push(this.shares[index]);
       } else {
         this.selectedSharesData.push({
           BloombergCode: element,
           Ccy: "",
           Code: element,
           ExchangeCode: "",
           ExchangeName: "",
           LongName: element
         })
       }
     });
     */
    var cnt = 1;
    WFBdata.Underlyings[0].split(',').forEach(element => {
      //console.log(WFBdata['Underlying' + cnt][0]);
      //console.log(WFBdata['IX' + cnt][0]);
      //console.log(WFBdata['LN' + cnt][0]);
      this.selectedSharesData.push({
        BloombergCode: element,
        Ccy: "",
        Code: WFBdata['Underlying' + cnt][0],
        ExchangeCode: WFBdata['IX' + cnt][0],
        ExchangeName: "",
        LongName: WFBdata['LN' + cnt][0],
        // Added by suvarna  P ||  09Apr2022 ||  Limit_Price1... Limit_Price5 channges for setting values start
        limitLevel: WFBdata['Limit_Price' + cnt][0],
        orderType: WFBdata['Limit_Price' + cnt][0] == '' || parseFloat(WFBdata['Limit_Price' + cnt][0]) == 0.00 ? 'Market' : 'Limit'
        // Added by suvarna  P ||  09Apr2022 ||  Limit_Price1... Limit_Price5 channges for setting values end
      })
      cnt++;
    });


    // if (this.launchProductMode === 'Manual Hedge' || this.launchProductMode === 'ManualAllocations') {
    if (WFBdata.DoneAtUpdateString[0] == "") {
      this.selectedSharesData.forEach(element => {
        element.DoneAt = '';
      });
    }
    else {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.DoneAtUpdateString[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['DoneAt'] = WFBdata.DoneAtUpdateString[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['DoneAt'] = '';//'0.00';
        }
      }
    }
    /* commented by Suvarna P || 09Apr2022 || using Limit_Price1... Limit_Price5 for setting values
        if (WFBdata.LimitLevel[0] == "") {
          this.selectedSharesData.forEach(element => {
            element.limitLevel = '';
          });
        }
        else {
          for (let k = 0; k < this.selectedSharesData.length; k++) {
            if (WFBdata.LimitLevel[0].split(',')[k].trim() !== '') {
              // this.selectedSharesData[k]['limitLevel'] = WFBdata.LimitLevel[0].split(',')[k];
              var limitLevel = parseFloat(WFBdata.LimitLevel[0].split(',')[k].replace(/,/g, '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.selectedSharesData[k]['limitLevel'] = limitLevel;
              this.selectedSharesData[k]['orderType'] = 'Limit';
            }
            else {
              this.selectedSharesData[k]['limitLevel'] = '';//'0.00';
              this.selectedSharesData[k]['orderType'] = 'Market';
            }
          }
        }
    
        if (WFBdata.OrderType[0] == "") {
          this.selectedSharesData.forEach(element => {
            element.orderType = 'Market';
          });
        }
    */

    // else {
    //   for (let k = 0; k < this.selectedSharesData.length; k++) {
    //     if (WFBdata.OrderType[0].split(',')[k] !== '') {
    //       this.selectedSharesData[k]['orderType'] = WFBdata.OrderType[0].split(',')[k].trim();
    //     }
    //     else {
    //       this.selectedSharesData[k]['orderType'] = 'Market';//'0.00';
    //     }
    //   }
    // }
    /* 
    if (WFBdata.DoneAtUpdateString[0].split(',').length === this.selectedSharesData.length) {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.DoneAtUpdateString[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['DoneAt'] = WFBdata.DoneAtUpdateString[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['DoneAt'] = '';//'0.00';
        }
        if (WFBdata.LimitLevel[0] !== '' && WFBdata.LimitLevel[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['limitLevel'] = WFBdata.LimitLevel[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['limitLevel'] = '';//'0.00';
        }
        if (WFBdata.OrderType[0] !== '' && WFBdata.OrderType[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['orderType'] = WFBdata.OrderType[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['orderType'] = 'Market';//'0.00';
        }
      }
    }
    */
    // }
  }

  getSelectedShareDataAQDQ(WFBdata) { // UCP Products - added by Priya L. - 22-Sep-2021
    this.shares = this.afs.shares;
    this.selectedSharesData = [];
    //  //console.log(WFBdata);
    //console.log(this.shares);
    // WFBdata.SN1_Custom[0].split(',').forEach(element => {
    //   //console.log(element);
    //   var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element || shareItem.Code == element)
    //   //console.log(index);
    //   if (index >= 0) {
    //     this.selectedSharesData.push(this.shares[index]);
    //   } else {
    //     this.selectedSharesData.push({
    //       BloombergCode: element,
    //       Ccy: "",
    //       Code: element,
    //       ExchangeCode: "",
    //       ExchangeName: "",
    //       LongName: element
    //     })
    //   }
    // });

    // fetch share details from clone api -added by Priya L. on 14Mar2022 - assigned by Pranav D.
    var cnt = 1;
    // WFBdata.SN1_Custom[0].split(',').forEach(element => {
    WFBdata.ShareCode[0].split(',').forEach(element => { // Azure Change
      if (WFBdata['SLN' + cnt] && WFBdata['SLN' + cnt][0] !== undefined && WFBdata['SLN' + cnt][0] !== '' && WFBdata['Exchange' + cnt] && WFBdata['Exchange' + cnt][0] !== undefined && WFBdata['Exchange' + cnt][0] !== '') {
        this.selectedSharesData.push({
          BloombergCode: element,
          Ccy: "",
          Code: WFBdata['Underlying' + cnt][0],
          ExchangeCode: WFBdata['Exchange' + cnt][0],
          ExchangeName: "",
          LongName: WFBdata['SLN' + cnt][0],//WFBdata['LN' + cnt][0]
        })
        cnt++;
      } else {
        if (element !== undefined && element !== '') {
          var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element || shareItem.Code == element)
          //console.log(index);
          if (index >= 0) {
            this.selectedSharesData.push(this.shares[index]);
          } else {
            this.selectedSharesData.push({
              BloombergCode: element,
              Ccy: "",
              Code: element,
              ExchangeCode: WFBdata['Exchange' + cnt][0],
              ExchangeName: "",
              LongName: element
            })
          }
        } else {
          this.selectedSharesData.push({
            BloombergCode: element,
            Ccy: "",
            Code: element,
            ExchangeCode: WFBdata['Exchange' + cnt][0],
            ExchangeName: "",
            LongName: element
          })
        }

      }

    });

    //console.log(this.selectedSharesData);

    // if (this.launchProductMode === 'Manual Hedge' || this.launchProductMode === 'ManualAllocations') {
    if (WFBdata.DoneAtUpdateString[0] == "") {
      this.selectedSharesData.forEach(element => {
        element.DoneAt = '';
      });
    }
    else {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.DoneAtUpdateString[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['DoneAt'] = WFBdata.DoneAtUpdateString[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['DoneAt'] = '';//'0.00';
        }
      }
    }
    if (WFBdata.Limit_Price[0] == "") {
      this.selectedSharesData.forEach(element => {
        element.limitLevel = '';
      });
    }
    else {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.Limit_Price[0].split(',')[k] !== '') {
          // this.selectedSharesData[k]['limitLevel'] = WFBdata.LimitLevel[0].split(',')[k];
          var limitLevel = parseFloat(WFBdata.LimitLevel[0].split(',')[k].replace(/,/g, '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.selectedSharesData[k]['limitLevel'] = limitLevel;
        }
        else {
          this.selectedSharesData[k]['limitLevel'] = '';//'0.00';
        }
      }
    }
    if (WFBdata.Order_Type[0] == "") {
      this.selectedSharesData.forEach(element => {
        element.orderType = 'Market';
      });
    }
    else {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.Order_Type[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['orderType'] = WFBdata.Order_Type[0].split(',')[k].trim();
        }
        else {
          this.selectedSharesData[k]['orderType'] = 'Market';//'0.00';
        }
      }
    }
    /* 
    if (WFBdata.DoneAtUpdateString[0].split(',').length === this.selectedSharesData.length) {
      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (WFBdata.DoneAtUpdateString[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['DoneAt'] = WFBdata.DoneAtUpdateString[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['DoneAt'] = '';//'0.00';
        }
        if (WFBdata.LimitLevel[0] !== '' && WFBdata.LimitLevel[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['limitLevel'] = WFBdata.LimitLevel[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['limitLevel'] = '';//'0.00';
        }
        if (WFBdata.OrderType[0] !== '' && WFBdata.OrderType[0].split(',')[k] !== '') {
          this.selectedSharesData[k]['orderType'] = WFBdata.OrderType[0].split(',')[k];
        }
        else {
          this.selectedSharesData[k]['orderType'] = 'Market';//'0.00';
        }
      }
    }
    */
    // }
  }
  toggleAccordian_old(event: { target: any; }) {
    const element = event.target;
    //console.log(element);
    const panel = element.nextElementSibling;
    const arrow = element.querySelector('.arrow');
    if (arrow && arrow.classList) {
      arrow.classList.toggle('active');
    }
    if (panel) {
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }
  }
  toggleAccordian(elementId) {

    var element = document.getElementById(elementId);
    let panel: HTMLElement = element.nextElementSibling as HTMLElement;

    const arrow = element.querySelector('.arrow');
    // //console.log(arrow);
    if (arrow && arrow.classList) {
      arrow.classList.toggle('active');
    }
    // //console.log(panel);
    if (panel) {
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }
  }
  prodLaunchDoneFlag = false;
  async launchProduct(amendFlag) {
    //console.log(this.dataItemAccordian);
    //console.log(this.timeLeft);
    if (!amendFlag && this.timeLeft <= 0) {
      this.errorMsgProdLaunch = "Cannot launch Product. Quote expired.";
      return false;
    }

    this.prodLaunchFlag = false;
    this.prodLaunchDoneFlag = false;
    if (this.startDate > this.closeDate) {
      ////console.log("ERROR IN DATE VALIDATION")
      this.wrongEntry = true;
      this.errorMsgProdLaunch = "Start Date should be less than Close Date.";
      return false;
    }
    else if (parseFloat(this.minNotional.replace(/,/g, '')) > parseFloat(this.maxNotional.replace(/,/g, ''))) {
      this.wrongEntry = true;

      if (this.accord === 8 || this.accord === 9) {
        this.errorMsgProdLaunch = "Min Pool Size is greater than Max Pool Size.";
      }
      else {
        this.errorMsgProdLaunch = "Min Notional is greater than Max Notional.";
      }
      // this.errorMsgProdLaunch = ((this.accord === 8 || this.accord === 9) ? "Min Pool Size" :"Min Notional" )+ " is greater than Max Notional.";
      return false;
    }
    else if (parseFloat(this.minOrderSize.replace(/,/g, '')) > parseFloat(this.maxNotional.replace(/,/g, '')) && this.accord !== 8 && this.accord !== 9) {
      this.wrongEntry = true;
      this.errorMsgProdLaunch = "Min Order Size is greater than Max Notional.";
      return false;
    }
    else if (parseFloat(this.denomination.replace(/,/g, '')) > parseFloat(this.minOrderSize.replace(/,/g, '')) && this.accord !== 8 && this.accord !== 9) {
      this.wrongEntry = true;
      this.errorMsgProdLaunch = "Denomination is greater than Min Order Size.";
      return false;
    }
    else if (this.minOrderSize == '0.00' || this.maxNotional == '0.00' || this.denomination == '0.00') {
      this.wrongEntry = true;
      if (this.minOrderSize == '0.00' && this.accord !== 8 && this.accord !== 9) {
        this.errorMsgProdLaunch = "Min Order Size cannot be 0.";
        return false;
      }
      if (this.maxNotional == '0.00') {
        // this.errorMsgProdLaunch = "Max Notional cannot be 0.";
        this.errorMsgProdLaunch = ((this.accord === 8 || this.accord === 9) ? "Max Pool Size" : "Max Notional") + " cannot be 0.";
        return false;
      }
      if (this.denomination == '0.00' && this.accord !== 8 && this.accord !== 9) {
        this.errorMsgProdLaunch = "Denomination cannot be 0.";
        return false;
      }
    }
    else if (!this.validLimitLevel()) {
      return false;
    }
    else {
      this.wrongEntry = false;
      this.errorMsgProdLaunch = "";

      //console.log(this.minOrderSize);
      //console.log(this.selectedRFQData);
      this.prodLaunchDoneFlag = false;
      // this.saveAttachment();

      this.prodLaunchFlag = false;


      this.setMinMaxSolveForLaunchProd();
      //added by Pranav D
      var doneAtStr = '';
      var limitLevelStr = '';
      var orderTypeStr = 'Market';

      // if(this.selectedSharesData.length == 1){
      //   doneAtStr = this.selectedSharesData[0].DoneAt ;
      //   limitLevelStr = this.selectedSharesData[0].limitLevel;
      //   orderTypeStr = this.selectedSharesData[0].orderType;
      // }

      if (this.selectedSharesData.length >= 1) {
        this.selectedSharesData.forEach(item => {
          // doneAtStr = doneAtStr + item.DoneAt ? item.DoneAt : '' + ', '
          doneAtStr = doneAtStr + item.DoneAt + ', ';
          limitLevelStr = limitLevelStr + item.limitLevel + ', ';
          // orderTypeStr = orderTypeStr + item.orderType + ', ';

          // set order type limit if any one share in basket has limit ordertype - added by Priya L. on 16Mar2022 - assigned by Pranav D.
          if (item.orderType === 'Limit') {
            orderTypeStr = 'Limit';
          }
        }
        );


        if (doneAtStr.trim().split('').pop() == ',') {
          doneAtStr = doneAtStr.substring(0, doneAtStr.length - 2);
        }
        /* commneted by Suvarna P || 06Apr2022 || limitLevel only one value to be send || assign by Pranav
          if (limitLevelStr.trim().split('').pop() == ',') {
            //console.log(limitLevelStr.length);
            //console.log(limitLevelStr);
            //console.log(limitLevelStr.substring(0, limitLevelStr.length - 2));
            limitLevelStr = limitLevelStr.substring(0, limitLevelStr.length - 2);
          }
          */
        /* commnted by suvarna no need, LimitPrice1,LimitPrice2....LimitPrice5 to be used
                // added by Suvarna P || 06Apr2022 || limitLevel only one value to be send || assign by Pranav || start
                var idx = this.selectedSharesData.findIndex(item=> item.orderType === 'Limit' );
                if(idx === -1){
                  limitLevelStr = ''
                }
                else{
                  limitLevelStr = this.selectedSharesData[idx].limitLevel;
                }
               // added by Suvarna P || 06Apr2022 || limitLevel only one value to be send || assign by Pranav || end
        */
        // if (orderTypeStr.trim().split('').pop() == ',') {
        //   orderTypeStr = orderTypeStr.substring(0, orderTypeStr.length - 2);
        // }

      }




      // limitLevelStr = this.LimitLevelLaunchProd.join(", ");
      // orderTypeStr = this.OrderTypeLaunchProd.join(", ");

      /*  
        if (amendFlag) {
          var bookOrderDetails = this.afs.EditPoolDetails(
            "",
            "Singapore",
            "0",
            "0",
            "",
            "0",
            "0",
            "0",
            "0",
            "0",
            "",
            "Market",
            "",
            "",
            // this.productLaunchData.RFQ_x0020_ID, // QuoteRequestId = //"1025750",
            this.selectedRFQData.RFQID[0],
            "", // RMEmailIdforOrderConfirm = 
            "RM1",
            "",
            // "10000", 
            this.accord == 1 || this.accord == 3 ? this.selectedRFQData.InputRFQNotionalAmount[0] :
              (this.accord === 8 || this.accord === 9) ? (this.selectedRFQData.NoOfShares[0] == '' ? 0 : this.selectedRFQData.NoOfShares[0]) :
                (this.accord === 5 || this.accord === 6 || this.accord === 7) ? this.selectedRFQData.Notional[0] :
                  this.selectedRFQData.InputRequestedSize[0],
            "",
            "Y", // "PoolYN":
            this.maxNotional, // "1000000", // "MaxNotional":
            this.minNotional, // "300000", //  "MinNotional":
            this.minOrderSize, // "100", // "MinOrderSize":
            this.closeDate, // "19-Mar-2021", // "CloseDate":
            this.startDate, // "18-Mar-2021", // "StartDate":
            this.denomination,// "100" // "Denomination":
            this.summary,
            this.prodName === '' ? (this.accord === 8 || this.accord === 9)
              ? this.selectedRFQData.Product_Name[0] : this.selectedRFQData.ComputedProductName[0] : this.prodName,
            this.MinMaxSolveFor,  //Added the MinMaxSolveFor var for all solveFor values - ApurvaK  | 11 Nov 2021
            // this.cpnMinCoupon + ' to ' + this.cpnCoupon
            this.remark,
            // this.dataItemAccordian.ClubbingRFQId
            amendFlag ? 'Y' : 'N',
            amendFlag ? this.selectedRFQData.NewNoteMasterID[0] : ''
          );
        }
        else {
  */
      var bookOrderDetails:any = await this.afs.bookOrderUCP_LaunchProd(
        "",
        this.selectedBookingBranch, //"Singapore",BookingBranch
        "0",
        "0",
        "",
        this.selectedSharesData && this.selectedSharesData[0] && this.selectedSharesData[0].limitLevel ? this.selectedSharesData[0].limitLevel : "", //LimitPrice1
        this.selectedSharesData && this.selectedSharesData[1] && this.selectedSharesData[1].limitLevel ? this.selectedSharesData[1].limitLevel : "", //LimitPrice2
        this.selectedSharesData && this.selectedSharesData[2] && this.selectedSharesData[2].limitLevel ? this.selectedSharesData[2].limitLevel : "", //LimitPrice3
        this.selectedSharesData && this.selectedSharesData[3] && this.selectedSharesData[3].limitLevel ? this.selectedSharesData[3].limitLevel : "", //LimitPrice4
        this.selectedSharesData && this.selectedSharesData[4] && this.selectedSharesData[4].limitLevel ? this.selectedSharesData[4].limitLevel : "", //LimitPrice5
        "0",
        "",
        orderTypeStr, //"Market", OrderType
        "",
        "",
        // this.productLaunchData.RFQ_x0020_ID, // QuoteRequestId = //"1025750",
        this.selectedRFQData.RFQID[0],
        "", // RMEmailIdforOrderConfirm = 
        "RM1",
        "",
        // "10000", 
        /* this.accord == 1 || this.accord == 3 ? this.selectedRFQData.InputRFQNotionalAmount[0] :
          (this.accord === 8 || this.accord === 9) ? (this.selectedRFQData.NoOfShares[0] == '' ? 0 : this.selectedRFQData.NoOfShares[0]) :
            (this.accord === 5 || this.accord === 6 || this.accord === 7) ? this.selectedRFQData.Notional[0] :
              this.selectedRFQData.InputRequestedSize[0],
            Azure change  */
        this.accord == 1 || this.accord == 3 ? this.selectedRFQData.InputRFQNotionalAmount[0] :
          (this.accord === 8 || this.accord === 9) ? (this.selectedRFQData.DailyNoOfShares[0] == '' ? 0 : this.selectedRFQData.DailyNoOfShares[0]) :
            (this.accord === 5 || this.accord === 6 || this.accord === 7) ? this.selectedRFQData.Notional[0] :
              this.selectedRFQData.InputRequestedSize[0], // Azure change
        "",
        "Y", // "PoolYN":
        this.maxNotional, // "1000000", // "MaxNotional":
        this.minNotional, // "300000", //  "MinNotional":
        this.minOrderSize, // "100", // "MinOrderSize":
        this.closeDate, // "19-Mar-2021", // "CloseDate":
        this.startDate, // "18-Mar-2021", // "StartDate":
        this.denomination,// "100" // "Denomination":
        this.summary,
        this.prodName === '' ? (this.accord === 8 || this.accord === 9)
          ? this.selectedRFQData.Product_Name[0] : this.selectedRFQData.ProductName[0] : this.prodName,// Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
        this.MinMaxSolveFor,  //Added the MinMaxSolveFor var for all solveFor values - ApurvaK  | 11 Nov 2021
        // this.cpnMinCoupon + ' to ' + this.cpnCoupon
        this.remark,
        // this.dataItemAccordian.ClubbingRFQId
        this.MinMaxSolveFor,
        this.remark, //'' TrancheRemarks will be same as remark,
        doneAtStr, //.DoneAtString                                                                                                                                                ,
        "", //limitLevelStr, //this.LimitLevel, // changed by Suvarna P || 06Apr2022 || sending seperately in  LimitPrice1... LimitPrice5 
        this.nonBestPricereason == 'Other' || this.nonBestPricereason == 'Others' ? this.otherReason : this.nonBestPricereason, // this.NonBestPriceReason
        amendFlag ? 'Y' : 'N',
        amendFlag ? this.selectedRFQData.NewNoteMasterID[0] : ''
      );
      // }

      //console.log(bookOrderDetails, bookOrderDetails.length);
      if (bookOrderDetails && bookOrderDetails.status !== undefined) {
        if (bookOrderDetails.status == "Succeed") {
          if (this.redirectFrom === 'Reopen') {
            // this.afs.prevQuoteLaunchPopUpRMW.next(false);
            this.prodLaunchFlag = true;
            this.prodLaunchDoneFlag = true;
            this.closeLaunchProduct();
            return false;
          }

          // if (this.redirectFrom !== 'Amend') {
          if (!amendFlag) {
            this.popupSuccessMsg = 'Product Launched Successfully. ID: ' + bookOrderDetails.NoteMasterID;
          }
          else {
            this.popupSuccessMsg = bookOrderDetails.SavingMessage;
          }
          this.successMessage = true
          this.prodLaunchFlag = true;
          this.prodLaunchDoneFlag = true;
          // if (this.redirectFrom !== 'Amend') {
          //console.log(this.fileNameArr);
          //console.log(amendFlag);
          if (!amendFlag && this.fileNameArr?.length > 0) {
            this.saveAttachment(bookOrderDetails.NoteMasterID);
          }
          if (this.interval) {
            clearInterval(this.interval);
          }
        }
        else {
          this.errorMsgProdLaunch = bookOrderDetails.message
          this.prodLaunchFlag = false;
          this.prodLaunchDoneFlag = false;
        }
      } else {
        this.errorMsgProdLaunch = "Error occured while placing order.Please try again.";
        this.prodLaunchFlag = false;
        this.prodLaunchDoneFlag = false;

      }
    }
  }

  validLimitLevel() {
    for (let i = 0; i < this.selectedSharesData.length; i++) {
      if (this.selectedSharesData[i]['orderType'] === 'Limit' && (parseFloat(this.selectedSharesData[i]['limitLevel']) === 0.00 || this.selectedSharesData[i]['limitLevel'] === '')) {
        this.errorMsgProdLaunch = "Please enter Limit Level for Underlyings.";
        // break;
        return false;
      }
    }
    //console.log(this.nonBestPricereason);
    if (!this.bestIssuerFlag && (this.nonBestPricereason === 'Please Select' || this.nonBestPricereason == '')) {
      this.errorMsgProdLaunch = "Please select Non Best Price Reason.";
      return false;
    }
    if (!this.bestIssuerFlag && this.nonBestPricereason == 'Other' && this.otherReason == '') {
      this.errorMsgProdLaunch = "Please enter Other Reason.";
      return false;
    }
    return true;
  }
  setMinMaxSolveForLaunchProd() {
    //Added by ApurvaK for solvefor start | 11 Nov 2021
    // if(this.selectedRFQData.SolveFor[0] === 'Coupon'){
    var solveForVal = this.selectedRFQData.InputRFQSolveFor ? this.selectedRFQData.InputRFQSolveFor[0] : this.selectedRFQData.SolveFor ? this.selectedRFQData.SolveFor[0] : "";
    if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
      var solveForVal = this.selectedRFQData.SolveForCode ? this.selectedRFQData.SolveForCode[0] : "";
    }
    //console.log(this.selectedRFQData);
    if (solveForVal === 'Coupon' || solveForVal === 'Coupon (%)') {
      if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
        this.MinMaxSolveFor = this.YEMinCoupon + ' to ' + this.YECoupon;
        //console.log("This is of solve for Coupon - Autocallable");
        //console.log(this.MinMaxSolveFor);
      }
      else {
        this.MinMaxSolveFor = this.cpnMinCoupon + ' to ' + this.cpnCoupon;
        //console.log("This is of solve for Coupon - Autocall, Reverse Covertible");
        //console.log(this.MinMaxSolveFor);
      }
    }
    else if (solveForVal === 'KO' || solveForVal === 'Autocall Barrier (%)') {
      if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenix') {
        this.MinMaxSolveFor = this.MinautoTrigger + ' to ' + this.autoTrigger;
        //console.log("KO autocall");
      }
      else if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
        this.MinMaxSolveFor = this.minERTrigger + ' to ' + this.ERTrigger;
        //console.log("KO autocallable")
      }
    }
    else if (solveForVal === 'KI' || solveForVal === 'KI Barrier (%)') {
      //Autocall
      if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenix') {
        this.MinMaxSolveFor = this.minBarrierLevel + ' to ' + this.barrierLevel;
        //console.log("Autocall - KI");
      }
      //Autocallable
      else if (this.selectedRFQData.SubTemplate == 'AutocallablePhoenixER' || this.selectedRFQData.SubTemplate == 'YieldEnhancement') {
        this.MinMaxSolveFor = this.minKIBarrier + ' to ' + this.KIBarrier;
        //console.log("Autocallable - KI");
      }
      // this.MinMaxSolveFor = this.minKIBarrier + ' to ' + this.KIBarrier;
      // //console.log("KI");
    }
    else if (solveForVal === 'Strike') {
      //Accumulator
      if (this.selectedRFQData.SubTemplate == 'Accumulator' || this.selectedRFQData.SubTemplate == 'Decumulator') {
        this.MinMaxSolveFor = this.minAQDQStrike + ' to ' + this.AQDQStrike;
        //console.log("Accumulator - strike");
      }
      else {
        this.MinMaxSolveFor = this.minStrike + ' to ' + this.Strike;
        //console.log("Autocall - strike");
      }
    }
    else if (solveForVal === 'PutStrike') {
      this.MinMaxSolveFor = this.minPutStrike + ' to ' + this.putStrike;
      //console.log("Putstrike");
    }
    else if (solveForVal === 'Floor') {
      this.MinMaxSolveFor = this.minYEFloor + ' to ' + this.YEFloor;
      //console.log("floor");
    }
    else if (solveForVal === 'Upfront') {
      this.MinMaxSolveFor = this.minAQDQUpfront + ' to ' + this.AQDQUpfront;
      //console.log("upfront");
    }
    else if (solveForVal === 'Spread') {
      this.MinMaxSolveFor = this.minFundRate + ' to ' + this.fundRate;
      //console.log("spread");
    }
    else {
      this.MinMaxSolveFor = this.cpnMinCoupon + ' to ' + this.cpnCoupon;
      //console.log("this is default coupon case");
    }
    //Added by ApurvaK for solvefor end | 11 Nov 2021
  }

  checkValidAllocateNotional(e, fieldName) {
    try {
      //console.log(fieldName);
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      const NotionalData = this.cfs.checkValidNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.Notional = NotionalData.Notional;
        // this.allocatedNotionalArr[rowindex] =  NotionalData.Notional;
        this[fieldName] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        // this['minOrderSize'] =  NotionalData.Notional;
        if ((this.accord === 8 || this.accord === 9) && (fieldName === 'minNotional' || fieldName === 'maxNotional')) {
          if (NotionalData.Notional.includes(',')) {
            NotionalData.Notional = NotionalData.Notional.toString().replace(/,/g, '');
          }
          NotionalData.Notional = parseFloat(NotionalData.Notional).toFixed(0);
          NotionalData.Notional = NotionalData.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        }
        // else {
        //   e.target.value = NotionalData.Notional;
        // }
        this[fieldName] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        this.errorMsgProdLaunch = '';
      } else {
        if ((this.accord === 8 || this.accord === 9) && (fieldName === 'minNotional' || fieldName === 'maxNotional')) {
          this[fieldName] = '0';
          e.target.value = 0;
        }
        else {
          this[fieldName] = '0.00';
          e.target.value = 0.00;
        }
        this.errorMsgProdLaunch = NotionalData.ErrorMsg;
      }
      //console.log(this.minOrderSize);

    } catch (error) {
      //console.log('Error', error);
    }
  }
  checkValidFilledNotional_old(e, i) {
    try {
      // //console.log(fieldName);
      // viewOrderData
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      const NotionalData = this.cfs.checkValidNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.viewOrderData[i].filledNotional = NotionalData.Notional;
        this.viewOrderData[i].Done_Notional[0] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
        // this.errorMsgProdLaunch = '';
        if (!this.matchAllocatedTotalFillNotional()) {
          const errorMsg = 'Total of allocated Filled Notional should be equal to Filled Notional.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
      } else {
        // this.viewOrderData[i].filledNotional = '0.00';
        this.viewOrderData[i].Done_Notional[0] = '0.00';
        e.target.value = 0.00;
        // this.errorMsgProdLaunch = NotionalData.ErrorMsg;
        const errorMsg = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }

  disableConfirm() {
    if ($(".validate-popup").length > 0 || $(".error-input").length > 0) {

      return true;
    }
    else {
      false;
    }
  }
  allocationErrorMsg = "";
  confirmAllocationFlg = false;

  confirmAllocation() {
    try {
      this.allocationErrorMsg = "";
      this.confirmAllocationFlg = false;
      // //console.log( $(".validate-popup"));
      // //console.log( $(".error-input"));
      // //console.log( $(".validate-popup").length);
      // //console.log( $(".error-input").length);


      if (!this.matchAllocatedTotalFillNotional()) {
        this.confirmAllocationFlg = false;
        var errorMsg = "";
        if (this.accord === 8 || this.accord === 9) {
          errorMsg = 'Total of allocated No. of Shares should be equal to Filled Qty.';
        }
        else {
          errorMsg = 'Total of allocated Filled Notional should be equal to Filled Notional.';
        }

        // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        // $('.validate-popup').delay(5000).fadeOut('slow');
        this.allocationErrorMsg = errorMsg;
        //console.log(this.allocationErrorMsg);
        return false;
      }
      else {
        //this.hideViewOrderPopup();
        this.confirmAllocationFlg = true;
        this.hideViewOrderPopup();
        return false;
      }
      /*
      // //console.log(fieldName);
      // viewOrderData
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      const NotionalData = this.cfs.checkValidNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.viewOrderData[i].filledNotional = NotionalData.Notional;
        this.viewOrderData[i].Done_Notional[0] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
        // this.errorMsgProdLaunch = '';
        if(!this.matchAllocatedTotalFillNotional()){
          const errorMsg = 'Total of allocated Filled Notional should be equal to Filled Notional.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
      } else {
        // this.viewOrderData[i].filledNotional = '0.00';
        this.viewOrderData[i].Done_Notional[0] = '0.00';
        e.target.value = 0.00;
        // this.errorMsgProdLaunch = NotionalData.ErrorMsg;
        const errorMsg = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      */

    } catch (error) {
      //console.log('Error', error);
    }
  }

  setDoneNotional(i) {
    this.calcEstNotional(i);
  }

  async calcEstNotional(i) {
    // this.ordererrorMsg = '';
    //console.log(this.selectedRFQData);


    /*
    if (this.accord === 8 || this.accord === 9) {
      let share = [];
      // if (this.api.shares === undefined || this.api.shares.length <= 0) {
        share = this.afs.BBVALoadShares('EQ',"", this.accord === 8 ? 'Accumulator' : 'Decumulator');
      // }
      // share = this.api.shares;


      const sharecode = share[share.findIndex(i => i.BloombergCode === data.Asset)].Code; SN1_Custom
      const eCode = share[share.findIndex(i => i.BloombergCode === data.Asset)].ExchangeCode; ExchangeCode Exchange1 Currency_Custom
      const shareInfo = this.afs.GetSharesInfo(sharecode)
      const accrualday = this.afs.GetNoOfDays(eCode, data.Soft_Tenor.substring(0, data.Soft_Tenor.length - 1), data.Soft_Tenor.substring(data.Soft_Tenor.length - 1),
        this.orderData.Currency, this.orderData.Note_KO_Frequency_Type);  ELN_Frequency


      if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
        let res = 0;
        // res = shareInfo[0].Spot * accrualday * (this.Notional.replace(/,/g, ''));
        res = shareInfo[0].Spot * accrualday * (this.viewOrderData[i].No._x0020_of_x0020_Shares[0].replace(/,/g, ''));
        // this.estNotional = res.toFixed(0);
        // this.estNotional = this.estNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.viewOrderData[i].Done_Notional[0] = res.toFixed(0);
        this.viewOrderData[i].Done_Notional[0] = this.viewOrderData[i].Done_Notional[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      }
    }
    */
    if (this.accord === 8 || this.accord === 9) {
      let share = [];
      // if (this.api.shares === undefined || this.api.shares.length <= 0) {
      // share = this.afs.BBVALoadShares('EQ', "", this.accord === 8 ? 'Accumulator' : 'Decumulator');
      await this.afs.BBVALoadShares('EQ', "", "EQC_Europe").then(async (data:any)=>{
        share = data.Get_All_Share_Details_JsonResult;
        this.afs.shares = share;
        const sharecode = share[share.findIndex(i => i.BloombergCode === this.selectedRFQData.SN1_Custom[0])].Code;
      const Ccy = share[share.findIndex(i => i.BloombergCode === this.selectedRFQData.SN1_Custom[0])].Ccy;
      // const shareInfo = this.afs.GetSharesInfo(sharecode);
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // const shareInfo = this.apifunctions.GetSharesInfo(sharecode)
      const shareInfo = await this.afs.GetShareRate(sharecode, Ccy);
      var Tenor = this.selectedRFQData.ActualTenor[0].substr(0, this.selectedRFQData.ActualTenor[0].length - 1);
      // var TenorType = this.selectedRFQData.ActualTenor[0].substr(cloneData.ActualTenor[0].length - 1, 1) === 'M' ? 'Month' : 'Year';
      var TenorType = this.selectedRFQData.ActualTenor[0].substr(this.selectedRFQData.ActualTenor[0].length - 1, 1);

      // const accrualday = this.apifunctions.GetNoOfDays(ExchangeCode, this.Tenor, this.TenorType.substr(0, 1), this.ddlNoteCcy, this.Frequency);
      const accrualdayResp = await this.afs.GetNoOfDays(this.selectedRFQData.Exchange1[0], Tenor, TenorType, this.selectedRFQData.Currency_Custom[0], this.selectedRFQData.ELN_Frequency[0]);
      const accrualday = accrualdayResp['NoOfDays'];
      // this.accrualDays = accrualday;
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
      if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
        let res = 0;
        // //console.log(shareInfo);
        // //console.log(accrualday);
        // //console.log(this.viewOrderData);
        // //console.log(shareInfo[0].Spot);
        // //console.log(this.viewOrderData);
        // //console.log(this.viewOrderData[i]);
        // //console.log(this.viewOrderData[i]['No._x0020_of_x0020_Shares']);
        // res = parseFloat(shareInfo[0].Spot.replace(/,/g, '')) * parseFloat(accrualday.replace(/,/g, '')) * parseFloat(this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0].replace(/,/g, ''));
        res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * parseFloat(accrualday.replace(/,/g, '')) * parseFloat(this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0].replace(/,/g, ''));
        this.viewOrderData[i].Done_Notional[0] = res.toFixed(2);
        this.viewOrderData[i].Done_Notional[0] = this.viewOrderData[i].Done_Notional[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      }
      });
      
    }
  }
  checkValidNoOfSharesNotional(e, i) {
    try {
      // //console.log(fieldName);
      // viewOrderData
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      this.allocationErrorMsg = "";
      // const NotionalData = this.cfs.checkValidNotional(e);
      const NotionalData = this.cfs.checkValidFilledNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.viewOrderData[i].filledNotional = NotionalData.Notional;

        if (NotionalData.Notional.includes(',')) {
          NotionalData.Notional = NotionalData.Notional.toString().replace(/,/g, '');
        }
        NotionalData.Notional = parseFloat(NotionalData.Notional).toFixed(0);
        NotionalData.Notional = NotionalData.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


        this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
        // this.errorMsgProdLaunch = '';

        // this.setDoneNotional(i); commented by suvarna P  reported by Sakshi G | done notional to be hide

        var noOfShares = parseFloat(this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0].toString().replace(/,/g, ''));
        var doneNotional = parseFloat(this.viewOrderData[i].Done_Notional[0].toString().replace(/,/g, ''));
        var orderNotional = parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0].toString().replace(/,/g, ''));
        var denomination = parseFloat(this.denomination.toString().replace(/,/g, ''));
        var minOrderSize = parseFloat(this.minOrderSize.toString().replace(/,/g, ''));
        /*if ( doneNotional !== 0.00 && doneNotional % denomination !== 0.00) {
          const errorMsg = 'Notional should be multiple of denomination.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
        */

        /*
         // if ( (this.accord === 8 || this.accord === 9) && doneNotional !== 0.00 && doneNotional < minOrderSize) {
         if ( (this.accord === 8 || this.accord === 9) && noOfShares !== 0.00 && noOfShares < minOrderSize) {
           const errorMsg = 'Filled Notional is less than the minimum permitted.';
           $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
           $('.validate-popup').delay(5000).fadeOut('slow');
           return false;
         }
         */
        // //console.log(doneNotional);
        // //console.log(orderNotional);
        /*
        if ((this.accord === 8 || this.accord === 9) && doneNotional !== 0.00 && doneNotional > orderNotional) {
          const errorMsg = 'Filled Notional cannot be greater than Min Order Notional.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
        */


        // if(!this.matchAllocatedTotalFillNotional()){
        //   const errorMsg = 'Total of allocated Filled Notional should be equal to Filled Notional.';
        //   $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        //   $('.validate-popup').delay(5000).fadeOut('slow');
        //   return false;
        // }
      } else {
        // this.viewOrderData[i].filledNotional = '0.00';
        // this.viewOrderData[i].Done_Notional[0] = '0.00';
        // this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0] = '0.00';
        this.viewOrderData[i]['No._x0020_of_x0020_Shares'][0] = '0';
        e.target.value = 0.00;
        // this.errorMsgProdLaunch = NotionalData.ErrorMsg;
        const errorMsg = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#noOfShares" + i)
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  checkValidFilledNotional(e, i) {
    try {
      // //console.log(fieldName);
      // viewOrderData
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      this.allocationErrorMsg = "";
      // const NotionalData = this.cfs.checkValidNotional(e);
      const NotionalData = this.cfs.checkValidFilledNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.viewOrderData[i].filledNotional = NotionalData.Notional;
        this.viewOrderData[i].Done_Notional[0] = NotionalData.Notional;
        target.value = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
        // this.errorMsgProdLaunch = '';

        var doneNotional = parseFloat(this.viewOrderData[i].Done_Notional[0].toString().replace(/,/g, ''));
        var orderNotional = parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0].toString().replace(/,/g, ''));
        var denomination = parseFloat(this.denomination.toString().replace(/,/g, ''));
        var minOrderSize = parseFloat(this.minOrderSize.toString().replace(/,/g, ''));
        console.log(orderNotional,"Order notional console Apurva")
        if (this.accord !== 8 && this.accord !== 9 && doneNotional !== 0.00 && doneNotional % denomination !== 0.00) {
          const errorMsg = 'Notional should be multiple of denomination.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }


        if (this.accord !== 8 && this.accord !== 9 && doneNotional !== 0.00 && doneNotional < minOrderSize) {
          const errorMsg = 'Filled Notional is less than the minimum permitted.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
        //console.log(doneNotional)
        //console.log(orderNotional)
        if (this.accord !== 8 && this.accord !== 9 && doneNotional !== 0.00 && doneNotional > orderNotional) {
          const errorMsg = 'Filled Notional cannot be greater than Min Order Notional.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }


        // if(!this.matchAllocatedTotalFillNotional()){
        //   const errorMsg = 'Total of allocated Filled Notional should be equal to Filled Notional.';
        //   $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        //   $('.validate-popup').delay(5000).fadeOut('slow');
        //   return false;
        // }
      } else {
        // this.viewOrderData[i].filledNotional = '0.00';
        this.viewOrderData[i].Done_Notional[0] = '0.00';
        e.target.value = 0.00;
        // this.errorMsgProdLaunch = NotionalData.ErrorMsg;
        const errorMsg = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional" + i)
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }

  checkValidLimitLevel(e, i) {
    try {
      const target: any = this.GetEventTarget(e);
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      this.allocationErrorMsg = "";
      // const NotionalData = this.cfs.checkValidNotional(e);
      const NotionalData = this.cfs.checkValidFilledNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        this.selectedSharesData[i].limitLevel = NotionalData.Notional;
        target.value = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
      } else {
        this.selectedSharesData[i].limitLevel = '0.00';
        e.target.value = 0.00;
        const errorMsg = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#txtLimitLevelLaunchProd" + i)
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  checkBlank(str) {

    if (str == "") {

      return "-";
    } else {

      return str;
    }

    return str;
  }


  // bestpriceflag was blank so handled using RFQID - added by Priya L. on 06 July 2021

  setSolveForValuesRFQID(RFQID: any) {

    if (this.accord === 1) {
      this.setSolveForValueAutocall(RFQID)
    }
    if (this.accord === 2) {
      this.setSolveForValueRC(RFQID)
    }
    if (this.accord === 3) {
      this.setSolveForValueCT(RFQID)
    }
    if (this.accord === 4) {
      this.setSolveForValuePTC(RFQID)
    }
    if (this.accord === 5 || this.accord === 6 || this.accord === 7) { //Added by Amogh K on 3-Dec-2021
      this.setSolveForValueER(RFQID)
    }
    if (this.accord === 8) {
      this.setSolveForValueAQDQ(RFQID)
    }
    if (this.accord === 9) {
      this.setSolveForValueAQDQ(RFQID)
    }
  }

  setSolveForValueAutocall(RFQID) {

    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    if (bestPriceIndx == -1) {

    }
    else {
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    switch (this.selectedRFQData.InputRFQSolveFor[0]) {
      case 'Strike':
        this.Strike = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minStrike = bestSolveForValue;
        // this.replySolveFor = 'Strike';
        break;
      case 'IBPrice':
        // this.IBPrice = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Price';
        break;
      case 'Coupon':
        // this.cpnCoupon = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.cpnCoupon = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.cpnMinCoupon = bestSolveForValue;
        // this.replySolveFor = 'Coupon';
        break;
      case 'KO':
        // this.autoTrigger = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.autoTrigger = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.MinautoTrigger = bestSolveForValue;
        // this.replySolveFor = 'Autocall Trigger';
        break;
      case 'RebateCoupon':
        // this.autocallCoupon = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.autocallCoupon = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Autocall Coupon';
        break;
      case 'CouponBarrier':
        // this.cpnTrigger = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.cpnTrigger = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Coupon Trigger';
        break;
      case 'KI':
        // this.barrierLevel = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.barrierLevel = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.minBarrierLevel = bestSolveForValue;
        // this.replySolveFor = 'Barrier Level';
        break;
      case 'FundingRate':
        // this.fundRate = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.fundRate = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Rate/Spread';
        break;
    }

  }

  setSolveForValueRC(RFQID) {

    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    if (bestPriceIndx == -1) {

    }
    else {
      // if(bestPriceIndx > -1){
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    switch (this.selectedRFQData.InputRFQSolveFor[0]) {
      case 'Strike':
        // this.Strike = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.Strike = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minStrike = bestSolveForValue;
        // this.replySolveFor = 'Strike';
        break;
      case 'IBPrice':
        // this.IBPrice = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.IBPrice = bestSolveForValue; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Price';
        break;
      case 'Coupon':
        // this.cpnCoupon = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.cpnCoupon = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.cpnMinCoupon = bestSolveForValue;
        // this.replySolveFor = 'Coupon';
        break;
      case 'CouponBarrier':
        // this.cpnTrigger = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.cpnTrigger = bestSolveForValue; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Coupon Trigger';
        break;
      case 'KI':
        // this.barrierLevel = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.barrierLevel = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minBarrierLevel = bestSolveForValue;
        // this.replySolveFor = 'Barrier Level';
        break;
      case 'FundingRate':
        // this.fundRate = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.fundRate = bestSolveForValue; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Rate/Spread';
        break;
    }
  }

  setSolveForValueCT(RFQID) {

    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    // //console.log(bestPriceIndx);
    // //console.log(this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx]);
    if (bestPriceIndx == -1) {

    }
    else {
      // if(bestPriceIndx > -1){
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    switch (this.selectedRFQData.InputRFQSolveFor[0]) {
      case 'Coupon':
        // this.Spread = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.Spread = bestSolveForValue; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Coupon';
        break;
      case 'Reoffer':
        // this.reofferPrice = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
        this.reofferPrice = bestSolveForValue; // this.sortedAllPrices[0].Price;
        // this.replySolveFor = 'Reoffer';
        break;
    }
  }

  setSolveForValuePTC(RFQID) {

    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    // //console.log(bestPriceIndx);
    // //console.log(this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx]);
    if (bestPriceIndx == -1) {

    }
    else {
      // if(bestPriceIndx > -1){
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    switch (this.selectedRFQData.InputRFQSolveFor[0]) {
      case 'IBPrice':
        // this.IBPrice = cloneData.SolveForValue[0];
        this.IBPrice = bestSolveForValue;
        // this.replySolveFor = 'Price';
        break;
    }
  }


  setSolveForValueAQDQ(RFQID) {
    //console.log('AQDQ called', this.selectedRFQData);
    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    if (bestPriceIndx == -1) {

    }
    else {
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }

    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
      if (bestPriceIndx > -1) {
        const bestRFQID = (this.selectedRFQData.RFQIDcsv[0].split(","))[bestPriceIndx];

        if (bestRFQID.toString().trim() !== RFQID.toString().trim()) {
          this.bestIssuerFlag = false;
        } else {
          this.bestIssuerFlag = true;
        }
        //console.log('besttttt', bestRFQID, RFQID, this.bestIssuerFlag)
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    switch (this.selectedRFQData.SolveFor[0]) {
      case 'Strike':
        this.AQDQStrike = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minAQDQStrike = bestSolveForValue;
        // this.replySolveFor = 'Strike';
        break;
      case 'Upfront':
        this.AQDQUpfront = this.selectedRFQData.SolveForvalue[0]; //changed by Amogh K | 29Nov2022 | launch product fields not populated on UI
        this.minAQDQUpfront = this.selectedRFQData.SolveForvalue[0]; //changed by Amogh K | 29Nov2022 | launch product fields not populated on UI
        // this.replySolveFor = 'Price';
        break;

    }

  }
  setSolveForValueER(RFQID) {

    let BESTPriceFlagArr = '';
    let bestPriceIndx = -1;
    BESTPriceFlagArr = this.selectedRFQData.BESTPriceFlag[0]; // ["Y, N, N, N, N, "];
    if (BESTPriceFlagArr !== '') {
      bestPriceIndx = BESTPriceFlagArr.split(",").findIndex(item => item.trim() == "Y");
      if (bestPriceIndx > -1) {
        const bestRFQID = (this.selectedRFQData.RFQIDcsv[0].split(","))[bestPriceIndx];

        if (bestRFQID.toString().trim() !== RFQID.toString().trim()) {
          this.bestIssuerFlag = false;
        } else {
          this.bestIssuerFlag = true;
        }
        ////console.log('besttttt', bestRFQID, RFQID, this.bestIssuerFlag)
      }
    }
    let BESTRFQIDFlagArr = '';
    BESTRFQIDFlagArr = this.selectedRFQData.RFQIDcsv[0]; // ["Y, N, N, N, N, "];
    if (BESTRFQIDFlagArr !== '') {
      bestPriceIndx = BESTRFQIDFlagArr.split(",").findIndex(item => item.trim() == RFQID);
    }
    if (bestPriceIndx == -1) {

    }
    else {
      var bestSolveForValue = this.selectedRFQData.BestValue[0].split(",")[bestPriceIndx].trim();
      if (bestSolveForValue != '') {
        bestSolveForValue = parseFloat(bestSolveForValue.replace(/,/g, '')).toFixed(2);
      }
    }
    // BestValue: ["8.99, 7.98, 6.01, 5, 0, "]
    // solvForVal = 
    // Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
    //switch (this.selectedRFQData.SolveForvalue[0]) {
    // Modified field mapping || Suvarna P || 13Apr2022 || assigned by Pranav D
    switch (this.selectedRFQData.SolveFor[0]) { //changed by Amogh K | 29Nov2022 | launch product fields not populated on UI
      case 'Strike':
        this.Strike = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minStrike = bestSolveForValue;
        // this.replySolveFor = 'Strike';
        break;
      case 'PutStrike':
        this.putStrike = bestSolveForValue; // this.sortedAllPrices[0].Price;
        this.minPutStrike = bestSolveForValue;
        // this.replySolveFor = 'Strike';
        break;
      case 'IBPrice':
        this.reofferPriceLaunchPopup = bestSolveForValue; // this.sortedAllPrices[0].Price;
        //this.replySolveFor = 'Price';
        break;
      case 'Coupon':
        // this.cpnCoupon = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.cpnCoupon = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.cpnMinCoupon = bestSolveForValue;
        //Added by Amogh K for Autcalalble
        this.YECoupon = bestSolveForValue;
        this.YEMinCoupon = bestSolveForValue;

        //console.log("Coupon value=", this.cpnCoupon, this.cpnMinCoupon, 'best=', bestSolveForValue);
        // this.replySolveFor = 'Coupon';
        break;
      case 'KO':
        // this.autoTrigger = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.autoTrigger = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.MinautoTrigger = bestSolveForValue;
        // this.replySolveFor = 'Autocall Trigger';
        break;
      case 'RebateCoupon':
        // this.autocallCoupon = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.autocallCoupon = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Autocall Coupon';
        break;
      case 'CouponBarrier':
        // this.cpnTrigger = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.cpnTrigger = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Coupon Trigger';
        break;
      case 'KI':
        // this.barrierLevel = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.KIBarrier = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        this.minKIBarrier = bestSolveForValue;
        // this.replySolveFor = 'Barrier Level';
        break;
      case 'FundingRate':
        // this.fundRate = this.selectedRFQData.SolveForValue[0]; // this.sortedAllPrices[0].Price;;
        this.fundRate = bestSolveForValue; // this.sortedAllPrices[0].Price;;
        // this.replySolveFor = 'Rate/Spread';
        break;

    }

  }


  toggleSuccessMessage() {
    this.successMessage = false;
    this.errorMessage = false;
  }

  changeEditFlag(pName: any, eFlag: any) {
    this.editFlag = eFlag;
    this.prodName = pName;
  }

  openAccordion(num) {
    console.log(" mat accordin")
    this.phoenixWFBlotterData_ALLRFQ[num].isExpand = !(this.phoenixWFBlotterData_ALLRFQ[num].isExpand);
    for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand[num].length; i++) {
      this.phoenixWFBlotterData_ALLRFQExpand[num][i]['showOptionsFlag'] = false;
      this.phoenixWFBlotterData_ALLRFQExpand[num][i]['showAllRFQFlag'] = false;
    }
  }

  PrevQuoteShowOrderPopUp = false;
  dataItemAccordian: any;
  getOrderStatusColor(status) {
    // //console.log(status);
    return this.orderStatusColor[status]
  }

  async fnPlaceOrder(dataItemAccordian) {
    // console.log(" fnPlaceOrder")
    if (dataItemAccordian.ER_Exchange && dataItemAccordian.ER_Exchange !== '') {
      const Dates:any = await this.afs.BBVAGetDates(dataItemAccordian.ER_Exchange.split(',')[0], '0B', '');
      if (Dates) {
        this.stkdate = this.cfs.formatDate(Dates.MaturityDate);
        const today = new Date();
        if (Date.parse(this.stkdate) > Date.parse(moment().format("YYYY-MM-DD"))) {

          this.ErrorMsg = "Strike date cannot be greater than trade date."
          return false;

        }
      }

    }

    //Added by Apurva K||30-Apr-2024|| Validation on Place Order button|| FIN1EURINT-720
    if (dataItemAccordian.EP_Trade_Order_Status.toLowerCase() != 'rejected' ||dataItemAccordian.EP_Trade_Order_Status.toLowerCase() != 'no response'|| dataItemAccordian.EP_Trade_Order_Status.toLowerCase() != 'order placed'){
      if(dataItemAccordian.EP_ValidUntilTime !== '') {
        let today = Date.now();
        console.log(today,"today");
        var valid_until_time = new Date(Date.parse(dataItemAccordian.EP_ValidUntilTime  + ' UTC')).getTime();
        //console.log(valid_until_time,"valid_until_time");
        //console.log(valid_until_time < today ? true:false,"valid_until comapre result");
        if(valid_until_time < today){
          //console.log(valid_until_time,"Inside quote expired");
           //Added by Apurva K|| 03-May-2024
          this.ErrorMsgRFQpopup = "Quote expired. Please reprice to place order."
          if (this.ErrorMsgRFQpopup != '') {
            this.afs.RFQBlotterPopupPopUp.next(this.ErrorMsgRFQpopup);
          }
          
        }
      }
      else if(dataItemAccordian.EP_ValidUntilTime == ''){
        //console.log(valid_until_time,"Inside valid until time is null");
        var valid_until_time = new Date(Date.parse(dataItemAccordian.EP_Quote_Response_At  + ' UTC')).getTime();
        let today=Date.now();
        if((valid_until_time - today) < 600000){
          this.ErrorMsgRFQpopup = "Quote expired. Please reprice to place order."
          if (this.ErrorMsgRFQpopup != '') {
            this.afs.RFQBlotterPopupPopUp.next(this.ErrorMsgRFQpopup);
          }
        }
      }
    } 
    //Added by Apurva K||30-Apr-2024|| Validation on Place Order button ||FIN1EURINT-720
    

    this.dataItemAccordian = '';
    // console.log(dataItemAccordian);
    this.PrevQuoteShowOrderPopUp = true;
    //console.log(this.PrevQuoteShowOrderPopUp && this.accord == 5);
    this.dataItemAccordian = dataItemAccordian;
    console.log( " dataItemAccordian" ,  this.dataItemAccordian , this.PrevQuoteShowOrderPopUp , this.accord);
    return false;
  }

  redirectOptions(pindex: any, index: any) {
    try {
      for(let i: any = 0; i < this.phoenixWFBlotterData_ALLRFQExpand.length; i++){
        for(let j: any = 0; j < this.phoenixWFBlotterData_ALLRFQExpand[i].length; j++){
          this.phoenixWFBlotterData_ALLRFQExpand[i][j]['showOptionsFlag'] = false;
        }
      }
      this.phoenixWFBlotterData_ALLRFQExpand[pindex][index]['showOptionsFlag'] = true;

      // //console.log('123456', this.phoenixWFBlotterData_ALLRFQExpand[index]);


    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  hideOptions(pindex: any, index: any) {
    this.phoenixWFBlotterData_ALLRFQExpand[pindex][index]['showOptionsFlag'] = false;
  }
  showViewOrderPopup(noteMasterID: any) {
    console.log(noteMasterID)
    $(".validate-popup").each(function () {
      $(this).remove();
    });
    $(".error-input").each(function () {
      $(this).remove();
    });

    if (this.filledNotional === undefined || this.filledNotional === '') {
      var errorMsg = '';
      if (this.accord === 8 || this.accord === 9) {
        errorMsg = 'Please enter valid Filled Notional.';
      }
      else {
        errorMsg = 'Please enter valid Filled Qty.';
      }

      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional")
      $('.validate-popup').delay(5000).fadeOut('slow');
      return false;
    }
    this.showviewOrderPopupFlag = true;
    // this.viewOrderData = this.afs.getOrderInfo(this.tCode, 1, 1500, noteMasterID);
    // //console.log(this.viewOrderData);
    // if (this.viewOrderData && this.viewOrderData.length > 0) {
    //    for (let i = this.viewOrderData.length - 1; i >= 0; i--) {
    //     //console.log(parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0]), parseFloat(this.filledNotional), parseFloat(this.orderNotional.replace(/,/g, '')));
    //     this.viewOrderData[i]['filledNotional'] = (parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0]) * parseFloat(this.filledNotional.replace(/,/g, ''))) / parseFloat(this.orderNotional.replace(/,/g, ''));
    //   }
    // }
    //console.log(this.viewOrderData);
  }
  async getViewOrderData(noteMasterID, viewOnlyYN) {
    this.viewOrderData = await this.afs.getOrderInfo(this.tCode, 1, 1500, noteMasterID, this.filledNotional.replace(/,/g, ''), viewOnlyYN);
    console.log(this.viewOrderData,"Order data console APURVA");
    if(this.viewOrderData){
      if (this.accord === 8 || this.accord === 9) {
        // this.viewOrderData.forEach(item => item['No._x0020_of_x0020_Shares'][0] = parseFloat(item['No._x0020_of_x0020_Shares'][0].replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
      else {
        this.viewOrderData.forEach(item => item.Done_Notional[0] = parseFloat(item.Done_Notional[0].replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
    }
   
    /*
    if (this.viewOrderData && this.viewOrderData.length > 0) {
       for (let i = this.viewOrderData.length - 1; i >= 0; i--) {
        //console.log(parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0]), parseFloat(this.filledNotional), parseFloat(this.orderNotional.replace(/,/g, '')));
        // this.viewOrderData[i]['filledNotional'] = (parseFloat(this.viewOrderData[i].Nominal_x0020_Amount[0]) * parseFloat(this.filledNotional.replace(/,/g, ''))) / parseFloat(this.orderNotional.replace(/,/g, ''));
      }
    }
    //console.log(this.viewOrderData);
    */
  }

  hideViewOrderPopup() {
    this.showviewOrderPopupFlag = false;
  }

  fillOrder() {
    try {
      if (!this.confirmAllocationFlg) {
        this.errorMsgProdLaunch = "Please confirm Allocated Notional.";
        return false;
      }
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });

      this.errorMsgProdLaunch = '';
      if (this.filledNotional === undefined || this.filledNotional === '') {
        var errorMsg = "";
        if (this.accord === 8 || this.accord === 9) {
          errorMsg = 'Please enter valid Filled Qty.';
        } else {
          errorMsg = 'Please enter valid Filled Notional.';
        }
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }

      if (parseFloat(this.filledNotional.replace(/,/g, '')) > parseFloat(this.orderNotional.replace(/,/g, ''))) {
        var errorMsg = "";
        if (this.accord === 8 || this.accord === 9) {
          errorMsg = 'Filled Qty should be less than Order Qty.';
        } else {
          errorMsg = 'Filled Notional should be less than Order Notional.';
        }
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      //console.log('b4 matchAllocatedTotalFillNotional');

      if (!this.matchAllocatedTotalFillNotional()) {
        var errorMsg = "";
        if (this.accord === 8 || this.accord === 9) {
          errorMsg = 'Filled Qty should be equal to total of allocated No. of Shares.';
        } else {
          errorMsg = 'Filled Notional should be equal to total of allocated Filled Notional.';
        }

        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + errorMsg + '</span></div>').insertAfter("#filledNotional")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }

      let doneatcsv = '';
      let CustomerDealUpdateDetailsArr = [];
      for (let i = 0; i < this.selectedSharesData.length; i++) {
        if (this.selectedSharesData[i]['DoneAt'] === '' || parseFloat(this.selectedSharesData[i]['DoneAt']) === 0) {
          this.errorMsgProdLaunch = "Please enter valid Spot Rate for Underlyings.";
          break;
        }
        if (this.selectedSharesData[i]['DoneAt'] !== '') {
          doneatcsv = doneatcsv + this.selectedSharesData[i]['DoneAt'] + ','
        }
      }

      //console.log(doneatcsv);
      //console.log(this.viewOrderData);
      //console.log(this.viewOrderData.length);
      //console.log(this.accord);

      if (this.accord === 8 || this.accord === 9) {
        for (let k = 0; k < this.viewOrderData.length; k++) {
          //  CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].Nominal_x0020_Amount[0], "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0] })
          // CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].Nominal_x0020_Amount[0], "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0],
          //                                     "Filled_Notional": this.viewOrderData[k].filledNotional.replace(/,/g, '') });
          //  CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].filledNotional.replace(/,/g, ''), 
          //                                      "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]});
          //console.log(k);
          //console.log(this.viewOrderData[k]);
          // if (this.accord === 8 || this.accord === 9) {
          CustomerDealUpdateDetailsArr.push({
            "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
            "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0],
            "No._x0020_of_x0020_Shares": this.viewOrderData[k]["No._x0020_of_x0020_Shares"][0]
          });

          //console.log(CustomerDealUpdateDetailsArr);
          // }
          // else {
          //   CustomerDealUpdateDetailsArr.push({
          //     "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
          //     "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]
          //     // "No._x0020_of_x0020_Shares": this.viewOrderData[k].No._x0020_of_x0020_Shares[0]
          //   });
          // }
        }
      }
      else {
        for (let k = 0; k < this.viewOrderData.length; k++) {
          //  CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].Nominal_x0020_Amount[0], "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0] })
          // CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].Nominal_x0020_Amount[0], "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0],
          //                                     "Filled_Notional": this.viewOrderData[k].filledNotional.replace(/,/g, '') });
          //  CustomerDealUpdateDetailsArr.push({ "Done_Notional": this.viewOrderData[k].filledNotional.replace(/,/g, ''), 
          //                                      "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]});
          //console.log(k);
          //console.log(this.viewOrderData[k]);
          // if (this.accord === 8 || this.accord === 9) {
          //   CustomerDealUpdateDetailsArr.push({
          //     "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
          //     "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0],
          //     "No._x0020_of_x0020_Shares": this.viewOrderData[k].No._x0020_of_x0020_Shares[0]
          //   });
          // }
          // else {
          CustomerDealUpdateDetailsArr.push({
            "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
            "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]
            // "No._x0020_of_x0020_Shares": this.viewOrderData[k].No._x0020_of_x0020_Shares[0]
          });
        }
        // }
      }

      //console.log(CustomerDealUpdateDetailsArr);
      //console.log('errorMsgProdLaunch11');

      if (this.errorMsgProdLaunch === '') {
        let resp:any = false;
        //console.log('errorMsgProdLaunch22');
        resp = this.afs.Update_Underlying_CustomerDetails(doneatcsv.toString().substr(0, doneatcsv.length - 1), this.filledNotional, this.selectedRFQData.NewNoteMasterID[0], '', 'AutocallablePhoenix', '', CustomerDealUpdateDetailsArr, '', '');
        //console.log(resp);
        if (resp) {
          this.popupSuccessMsg = "Pool executed successfully."
          this.successMessage = true;
          this.errorMessage = false;
          this.fillFlag = true;
        } else {
          this.errorMsgProdLaunch = "Pool execution failed."
          this.successMessage = false;
          this.errorMessage = true;
        }
      }
    } catch (error) {

    }
    return false;
  }

  matchAllocatedTotalFillNotional() {
    // this.viewOrderData[i].filledNotional = NotionalData.Notional;
    // return true;
    //console.log('matchAllocatedTotalFillNotional');
    var AllocatedNotional = 0.0;

    this.viewOrderData.forEach(item => {
      // AllocatedNotional = AllocatedNotional + parseFloat(item.filledNotional.toString().replace(/,/g, '')) || 0.00
      if (this.accord === 8 || this.accord === 9) {
        AllocatedNotional = AllocatedNotional + parseFloat(item['No._x0020_of_x0020_Shares'][0].toString().replace(/,/g, '')) || 0.00
      }
      else {
        AllocatedNotional = AllocatedNotional + parseFloat(item.Done_Notional[0].toString().replace(/,/g, '')) || 0.00
      }
      console.log(this.viewOrderData,"this is another console")
    })
    //console.log('AllocatedNotional')
    //console.log(AllocatedNotional)
    //console.log(parseFloat(this.filledNotional.replace(/,/g, '')))
    if (AllocatedNotional === parseFloat(this.filledNotional.replace(/,/g, ''))) {
      return true;
    }
    else {
      return false;
    }
  }

  openForSubDoneFlag = false;
  async openPoolForSubscription() {
    try {
      if (await this.saveRemark()) {
        const resp = await this.api.fnWorkflowButtonActions('', this.buttonID, this.buttonName, this.tokenID);
        if (resp && resp['Message']) {
          // this.popupSuccessMsg = resp['Message'];
          this.popupSuccessMsg = "Product sent to Open for Subscription Queue."
          // this.popupSuccessMsg = 
          this.successMessage = true;
          this.errorMessage = false;
          this.openForSubDoneFlag = true;
        }
        else {
          this.errorMsgProdLaunch = "Error occured.";
          this.successMessage = false;
          this.errorMessage = true;
          this.openForSubDoneFlag = true;
        }
      }
      else {
        this.errorMsgProdLaunch = "Error occured.";
        this.successMessage = false;
        this.errorMessage = true;
        this.openForSubDoneFlag = true;
      }

    } catch (error) {

    }
    return false;
  }

  async saveRemark() {
    /*
    var bookOrderDetails = this.afs.EditPoolDetails(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      // this.productLaunchData.RFQ_x0020_ID, // QuoteRequestId = //"1025750",
      this.selectedRFQData.RFQID[0],
      null, // RMEmailIdforOrderConfirm = 
      null,
      null,
      // "10000", 
      null, //this.accord == 1 || this.accord == 3 ? this.selectedRFQData.InputRFQNotionalAmount[0] :
      //(this.accord === 8 || this.accord === 9) ? (this.selectedRFQData.NoOfShares[0] == '' ? 0 : this.selectedRFQData.NoOfShares[0]) :
      // (this.accord === 5 || this.accord === 6 || this.accord === 7) ? this.selectedRFQData.Notional[0] :
      //   this.selectedRFQData.InputRequestedSize[0],
      null, //"",
      "Y", // "PoolYN":
      null,//this.maxNotional, // "1000000", // "MaxNotional":
      null,//this.minNotional, // "300000", //  "MinNotional":
      null,//this.minOrderSize, // "100", // "MinOrderSize":
      null,//this.closeDate, // "19-Mar-2021", // "CloseDate":
      null,//this.startDate, // "18-Mar-2021", // "StartDate":
      null,//this.denomination,// "100" // "Denomination":
      null,//this.summary,
      null,//this.prodName === '' ? (this.accord === 8 || this.accord === 9)
      // ? this.selectedRFQData.Product_Name[0] : this.selectedRFQData.ComputedProductName[0] : this.prodName,
      null,//this.MinMaxSolveFor,  //Added the MinMaxSolveFor var for all solveFor values - ApurvaK  | 11 Nov 2021
      // this.cpnMinCoupon + ' to ' + this.cpnCoupon
      this.remark,
      // this.dataItemAccordian.ClubbingRFQId
      'Y', //amendFlag ? 'Y' : 'N',
      this.selectedRFQData.NewNoteMasterID[0] //amendFlag ? this.selectedRFQData.NewNoteMasterID[0] : ''
    );
    */
    var bookOrderDetails:any = await this.afs.bookOrderUCP_LaunchProd(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      // this.productLaunchData.RFQ_x0020_ID, // QuoteRequestId = //"1025750",
      this.selectedRFQData.RFQID[0],
      null, // RMEmailIdforOrderConfirm = 
      null,
      null,
      // "10000", 
      null, //this.accord == 1 || this.accord == 3 ? this.selectedRFQData.InputRFQNotionalAmount[0] :
      //(this.accord === 8 || this.accord === 9) ? (this.selectedRFQData.NoOfShares[0] == '' ? 0 : this.selectedRFQData.NoOfShares[0]) :
      // (this.accord === 5 || this.accord === 6 || this.accord === 7) ? this.selectedRFQData.Notional[0] :
      //   this.selectedRFQData.InputRequestedSize[0],
      null, //"",
      "Y", // "PoolYN":
      null,//this.maxNotional, // "1000000", // "MaxNotional":
      null,//this.minNotional, // "300000", //  "MinNotional":
      null,//this.minOrderSize, // "100", // "MinOrderSize":
      this.closeDate, // "19-Mar-2021", // "CloseDate":
      this.startDate, // "18-Mar-2021", // "StartDate":
      null,//this.denomination,// "100" // "Denomination":
      null,//this.summary,
      null,//this.prodName === '' ? (this.accord === 8 || this.accord === 9)
      // ? this.selectedRFQData.Product_Name[0] : this.selectedRFQData.ComputedProductName[0] : this.prodName,
      null,//this.MinMaxSolveFor,  //Added the MinMaxSolveFor var for all solveFor values - ApurvaK  | 11 Nov 2021
      // this.cpnMinCoupon + ' to ' + this.cpnCoupon
      this.remark,
      // this.dataItemAccordian.ClubbingRFQId
      null, //this.MinMaxSolveFor
      this.remark, //'' TrancheRemarks will be same as remark,
      null, //DoneAtString 
      null, // limitLevelStr
      null, // this.NonBestPriceReason
      'Y', //amendFlag ? 'Y' : 'N',
      this.selectedRFQData.NewNoteMasterID[0] //amendFlag ? this.selectedRFQData.NewNoteMasterID[0] : ''
    );

    //console.log(bookOrderDetails, bookOrderDetails.length);
    if (bookOrderDetails && bookOrderDetails.status !== undefined) {
      if (bookOrderDetails.status == "Succeed") {
        // if (this.redirectFrom === 'Reopen') {
        //   this.prodLaunchFlag = true;
        //   this.prodLaunchDoneFlag = true;
        //   this.closeLaunchProduct();
        return true;
      }

      else {
        // this.errorMsgProdLaunch = bookOrderDetails.message
        // this.prodLaunchFlag = false;
        // this.prodLaunchDoneFlag = false;
        return false;
      }
    } else {
      return false;
    }
  }
//Changes done by Jyoti S || 14-Dec-2023 || FIN1EURINT-692 || START
//Changed by Jyoti S || HSBCECCLI-87 || 19-Dec-2023 || START
 Reprice(quoteReqId, noteMasterID: any, LP: any, index: any) {
    try {
//console.log(arr,"object")
      this.phoenixWFBlotterData_ALLRFQExpand[index][this.phoenixWFBlotterData_ALLRFQExpand[index].findIndex(obj => obj.PP_CODE === LP)].EP_Trade_Order_Status = 'Pending Reprice';//Added to display pending reprice status immediately after repriced button is clicked.
      this.ErrorMsg = "";
      this.successMsg = "";
      $('#loading').show();
      setTimeout(async () => {
        // const webMethod = this.interfaceUrl + 'PHXAutocallable';
        const webMethod=  AppConfig.settings.apiBaseUrl + 'eqd/Quote/QuoteRequest'
        const that = this;
        const parameters = [{
          productCode:this.Template_Code,
          subTemplateCode:"",
          LP,
          requestXML: "",
          solveFor:"",
          loginID:AppConfig.settings.oRes.userName,
          userGroupID:AppConfig.settings.oRes.groupID,
          buyerEntityID:AppConfig.settings.oRes.homeEntityID,//Changed by Jyoti S || 11-Aug-2023 || HSBCECCLI-38
          noteMasterID,
          repricereqYN: "Y"
        }];
        // Changed by Jyoti S || 20-Jun-2023 || FIN1EURINT-377 || START
        await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
          if (data && data.rfqid !== '') {

            that.ErrorMsg = "";
            that.phoenixWFBlotterData_ALLRFQExpand[index][that.phoenixWFBlotterData_ALLRFQExpand[index].findIndex(obj => obj.PP_CODE === LP)].EP_Trade_Order_Status = 'Pending Reprice';
              that.timeLeft = this.defaultRFQTimeout
              let quoteResponseCheck = false;
              const Repriceinterval = setInterval(async () => {

                if (that.timeLeft > 0) {
                if (!quoteResponseCheck) {
                  quoteResponseCheck = await that.getRepriceData(noteMasterID, LP);
                  that.timeLeft = that.timeLeft - 5;
                }else{
                  clearInterval(Repriceinterval);
                  that.successMsg = "";
                  that.ErrorMsg = "";
                }//Added by Jyoti S || 21-Jun-2023
                } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                  clearInterval(Repriceinterval);
                  this.successMsg = "";
                  this.ErrorMsg = "";
                  if(this.rePriceData.length > 0)
                  {
                    //Added to handle the code logic after the timeout & add the the last generated RFQ with no response status in the phoenixWFBlotterData_ALLRFQExpand || START
                    var idx = this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === noteMasterID);
                  // Append specific LP data in phoenixWFBlotterData_ALLRFQExpand logic -->
                  if (idx > -1) {
                    //Changed by Jyoti S || 22-Jun-2023 || START
                    var newRepriceArr = this.rePriceData.filter(item => (item.PP_CODE == LP && item.ClubbingRFQId == noteMasterID))
                    var firstIndex = this.phoenixWFBlotterData_ALLRFQExpand[idx].findIndex(item => item.PP_CODE == LP)
                                        // Best LP logic -->
                    var repriceBestIdx = newRepriceArr.findIndex(item => item.EP_BestPrice_YN.toLowerCase() === 'y');
                    if(repriceBestIdx != -1)
                    {
                      this.phoenixWFBlotterData_ALLRFQExpand[idx].forEach(item => item.EP_BestPrice_YN = 'N')
                    }
                      this.phoenixWFBlotterData_ALLRFQExpand[idx] = this.phoenixWFBlotterData_ALLRFQExpand[idx].filter(item => item.PP_CODE != LP)
                      newRepriceArr.forEach((item) => {
                      this.phoenixWFBlotterData_ALLRFQExpand[idx].splice(firstIndex,0,item);
                      firstIndex++ })
                      //Changed by Jyoti S || 22-Jun-2023 || END
                      this.phoenixWFBlotterData_ALLRFQ[idx] = this.rePriceData.filter(e=>((e.EP_BestPrice_YN.toLowerCase() == 'y' || e.EP_BestPrice_YN.toLowerCase() == 'yn') && e.ClubbingRFQId === noteMasterID)).length > 0 ? this.rePriceData.filter(e=>((e.EP_BestPrice_YN.toLowerCase() == 'y' || e.EP_BestPrice_YN.toLowerCase() == 'yn') && e.ClubbingRFQId === noteMasterID))[0] : this.rePriceData[0]
                }
                  this.phoenixWFBlotterData_ALLRFQ_Orig = [];
                  this.phoenixWFBlotterData_ALLRFQ.forEach(item => {
                    this.phoenixWFBlotterData_ALLRFQ_Orig.push(item);
                  });

                  this.phoenixWFBlotterData_ALLRFQExpand_Orig = [];
                  this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
                    this.phoenixWFBlotterData_ALLRFQExpand_Orig.push(item);
                  });
                }
                  this.phoenixWFBlotterData_ALLRFQ[this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === noteMasterID)].isExpand = true;
                }
              }, 5000);
                            this.intervals.add(Repriceinterval);
              //Added to handle the code logic after the timeout & add the the last generated RFQ with no response status in the phoenixWFBlotterData_ALLRFQExpand || END
            } else {
              that.successMsg = "";
              that.phoenixWFBlotterData_ALLRFQExpand[index][that.phoenixWFBlotterData_ALLRFQExpand[index].findIndex(obj => obj.PP_CODE === LP)].EP_Trade_Order_Status = 'No Response';
              this.phoenixWFBlotterData_ALLRFQ[this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === noteMasterID)].isExpand = true;
              //Added incase if RFQ is not generated and no response received from API.
            }
        });
        //Changed by Jyoti S || HSBCECCLI-87 || 19-Dec-2023 || END
        // Changed by Jyoti S || 20-Jun-2023 || FIN1EURINT-377 || END
        $('#loading').hide();
      },1000);
//Changes done by Jyoti S || 14-Dec-2023 || FIN1EURINT-692 ||  END
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }
  public clearAllDocIntervals(): void {
    for (const id of this.intervals) {
      this.clearDocInterval(id);
    }
    this.intervals.clear();
  }//Added by Jyoti S || 23-Jun-2023

  StrikeValue(dataItem: Object = {}, caseNum: Number = 0) : String {
    try{
      let returnValue = '';

      switch (caseNum) {
        case 1:
          if(dataItem['ProtectionType'] !== 'Put Spread' && dataItem['ER_SolveFor'] !=='Strike(%)' && dataItem['ER_SolveFor'] !== 'Put Strike(%)'){
            if(!Number(dataItem['ER_StrikePercentage']) || dataItem['ER_StrikePercentage'] == '') returnValue = '-'
            returnValue = dataItem['ER_StrikePercentage'].toString();
          }else{
            returnValue = dataItem['LowerStrike'] + ' - ' + dataItem['UpperStrike']
          }
          break;
          
        case 2:
          if(dataItem['ER_SolveFor'] === 'Strike(%)' || dataItem['ER_SolveFor'] === 'Put Strike(%)') {
            if(!Number(dataItem['EP_StrikePercentage']) || dataItem['ER_StrikePercentage'] == '') returnValue = '-';
            returnValue = dataItem['EP_StrikePercentage'].toString() + '%'; 
          }
          break;
      //Changes done by Jyoti S || 28-Jul-2023
        default:
          return returnValue;
      }

      return returnValue;
    }catch(error){

    }
  }

  PercentageValue(dataItem: Object = {}, caseNum: Number = 0) : any {
    try{
      let returnValue = '';
      switch (caseNum) {
        case 1:
          if(dataItem['ER_SolveFor'] === 'Coupon(%)'){
            if(!Number(dataItem['CouponPercentage']) || dataItem['CouponPercentage'] == '') 
            {returnValue = '-';}
            else {
              dataItem['CouponPercentage'] = parseFloat(dataItem['CouponPercentage']).toFixed(2)
              returnValue =  dataItem['CouponPercentage'].toString() + '%'; 
            }
          }
          break;

          case 2:
            if(dataItem['ER_SolveFor'] === 'Coupon Trigger'){
              if(!Number(dataItem['EP_CouponBarrier']) || dataItem['EP_CouponBarrier'] == '') 
              {returnValue = '-';}
              else {
                dataItem['EP_CouponBarrier'] = parseFloat(dataItem['EP_CouponBarrier']).toFixed(2)
                returnValue = dataItem['EP_CouponBarrier'].toString() + '%'; 
              }
            }
            break;

        default:
          return returnValue;
      }

      return returnValue;
    }catch(error){

    }
  } //Added by Jyoti S || 03-Aug-2023

  setTextColor(dataItem: Object = {}) : String{
    try{
      //Changes done by Jyoti S || 03-Aug-2023 || START
      // dataItem['EP_CouponPercentage'] = '0'
      var color = ''
      if(dataItem['CouponPercentage'] == '' && dataItem['ER_SolveFor'] === 'Coupon(%)' )
      { color = '#f2a832'}
      else if(dataItem['EP_CouponBarrier'] == '' && dataItem['ER_SolveFor'] === 'Coupon Trigger'){
        color = '#f2a832';
      }
      else
      {color = '#00cc2b'}
      //Changes done by Jyoti S || FIN1EURINT-535 || 28-Jul-2023
      //Changes done by Jyoti S || 03-Aug-2023 || END
      return color;
    }catch(error){

    }
  }

  public clearDocInterval(id: NodeJS.Timeout): void {
    clearInterval(id);
    this.intervals.delete(id);
  }//Added by Jyoti S || 23-Jun-2023

  // getRepriceData(RFQID, nm_id, pp_name){
    //Changes done by Jyoti S || 14-Dec-2023 || FIN1EURINT-692 ||  START
    //Changed by Jyoti S || HSBCECCLI-87 || 19-Dec-2023 || START
  async getRepriceData(nm_id, pp_name) {
    try{
      let product = '';
    switch (this.accord) {
      case 1:
        product = 'EQC_Europe'; //AutocallablePhoenix - changed by Apurva K for Demo as discussed with Arshin S|| 19-Oct-2023
        break;
      case 2:
        product = 'ReverseConvertible';
        break;
      case 3:
        product = 'CreditTranche';
        break;
      case 4:
        product = 'Participation';
        break;
      case 5:
        product = 'EQC_Europe';
        break;
      case 6:
        product = 'YieldEnhancement';
        break;
      case 7:
        product = 'DiscountCertificates';
        break;
      case 8:
        product = 'Accumulator';
        break;
      case 9:
        product = 'Decumulator';
    }
  await this.afs.BBVWorkflowBlotterReprice(product, this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy') + " 00:00:00", this.datepipe.transform(this.toDate, 'dd-MMM-yyyy') + " 23:59:59", nm_id,this.pageNo.toString(),this.pageSize.toString()).then((data:any)=>{this.rePriceData=data});
  if (this.rePriceData && this.rePriceData.length > 0) {
         // Changed by Jyoti S || 20-Jun-2023 || FIN1EURINT-377 || START
    var data = this.rePriceData.findIndex(item => (item.PP_CODE == pp_name && item.ClubbingRFQId == nm_id));
    if(this.rePriceData[data].EP_Trade_Order_Status != "No Response" ){
//Changes done by Jyoti S || 14-Dec-2023 || FIN1EURINT-692 ||  END
      this.successMsg = "";
      this.ErrorMsg = "";
      var idx = this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === nm_id);
      // Append specific LP data in phoenixWFBlotterData_ALLRFQExpand logic -->
      if (idx > -1) {
//Changed by Jyoti S || 22-Jun-2023 || START
        var newRepriceArr = this.rePriceData.filter(item => (item.PP_CODE == pp_name && item.ClubbingRFQId == nm_id))
        var firstIndex = this.phoenixWFBlotterData_ALLRFQExpand[idx].findIndex(item => item.PP_CODE == pp_name)
        // Best LP logic -->
        var repriceBestIdx = newRepriceArr.findIndex(item => item.EP_BestPrice_YN.toLowerCase() === 'y');
        if(repriceBestIdx != -1)
        {
          this.phoenixWFBlotterData_ALLRFQExpand[idx].forEach(item => item.EP_BestPrice_YN = 'N')
        }
          this.phoenixWFBlotterData_ALLRFQExpand[idx] = this.phoenixWFBlotterData_ALLRFQExpand[idx].filter(item => item.PP_CODE != pp_name)
          newRepriceArr.forEach((item) => {
          this.phoenixWFBlotterData_ALLRFQExpand[idx].splice(firstIndex,0,item);
          firstIndex++ })
        this.phoenixWFBlotterData_ALLRFQ[idx] = this.rePriceData.filter(e=>((e.EP_BestPrice_YN.toLowerCase() == 'y' || e.EP_BestPrice_YN.toLowerCase() == 'yn') && e.ClubbingRFQId === nm_id)).length > 0 ? this.rePriceData.filter(e=>((e.EP_BestPrice_YN.toLowerCase() == 'y' || e.EP_BestPrice_YN.toLowerCase() == 'yn') && e.ClubbingRFQId === nm_id))[0] : this.rePriceData[0]//Added incase if no RFQ returns best price so by default the 0th index element will be added in phoenixWFBlotterData_ALLRFQ to display in accordion.
        this.phoenixWFBlotterData_ALLRFQ[this.phoenixWFBlotterData_ALLRFQ.findIndex(item => item.ClubbingRFQId === nm_id)].isExpand = true;

     }
           this.phoenixWFBlotterData_ALLRFQ_Orig = [];
      this.phoenixWFBlotterData_ALLRFQ.forEach(item => {
        this.phoenixWFBlotterData_ALLRFQ_Orig.push(item);
      });

      this.phoenixWFBlotterData_ALLRFQExpand_Orig = [];
      this.phoenixWFBlotterData_ALLRFQExpand.forEach(item => {
        this.phoenixWFBlotterData_ALLRFQExpand_Orig.push(item);
      });
            return true;
    }
    else{
      return false;
    }
  }else{
    return false;
  }
  //Changed by Jyoti S || HSBCECCLI-87 || 19-Dec-2023 || START
     // Changed by Jyoti S || 20-Jun-2023 || FIN1EURINT-377 || END
    }
    catch(error){
      
    }
  }

  getCount(index: any, character: any, ClubbingRFQId: any) {
    // //console.log(this.phoenixWFBlotterData_ALLRFQExpand[index]);
    return this.phoenixWFBlotterData_ALLRFQExpand[index].filter(obj => obj.PP_CODE === character && obj.ClubbingRFQId === ClubbingRFQId).length;
  }


  showAllRFQ(pindex: any, ppcode: any) {
    // EP_ExternalQuoteId ER_QuoteRequestId
    // for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand.length; i++) {
    for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand[pindex].length; i++) {

      if (this.phoenixWFBlotterData_ALLRFQExpand[pindex][i]) {
        if (this.phoenixWFBlotterData_ALLRFQExpand[pindex][i].PP_CODE === ppcode && this.phoenixWFBlotterData_ALLRFQExpand[pindex][i].ER_Active_YN === 'N') {
          this.phoenixWFBlotterData_ALLRFQExpand[pindex][i]['showAllRFQFlag'] = !this.phoenixWFBlotterData_ALLRFQExpand[pindex][i]['showAllRFQFlag'];
        }
      }
    }
    //console.log(this.phoenixWFBlotterData_ALLRFQExpand[pindex]);
  }
  /*
    getDataByRFQID_old() {
      if (this.searchByRFQID !== '') {
        this.phoenixWFBlotterData_ALLRFQ = [];
        this.phoenixWFBlotterData_ALLRFQExpand = [];
      
        let expandfilterArr = [];
        for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpandNew.length; i++) {
          const filterarr = this.phoenixWFBlotterData_ALLRFQExpandNew[i].filter(rfq => rfq.ClubbingRFQId.toString().includes(this.searchByRFQID) &&
            (rfq.EP_BestPrice_YN === 'Y' || rfq.EP_BestPrice_YN === 'YN'));
  
          if (filter && filterarr.length > 0) {
            for (let j = 0; j < filterarr.length; j++) {
              this.phoenixWFBlotterData_ALLRFQ.push(filterarr[j]);
              expandfilterArr.push(this.phoenixWFBlotterData_ALLRFQExpandNew[i]);
              //console.log(expandfilterArr);
            }
  
          }
  
        }
        
        this.phoenixWFBlotterData_ALLRFQExpand =expandfilterArr;
      } else {
        this.onChange(this.frmDate, this.toDate)
      }
      this.noOfRecords = this.phoenixWFBlotterData_ALLRFQ.length;
  
    }
    */

  getDataFilter() {
    this.ErrorMsg = '';
    this.successMsg = '';
    this.clearAllDocIntervals();//Added by Jyoti S || 23-Jun-2023
    //console.log('getDataFilter');
    if (this.searchField === 'RFQID') {
      this.getDataByRFQID1();
    }
    else if (this.searchField === 'QID') {
      this.getDataByQuoteReqID();
    }
    this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282

    
    return false;
  }

  getDataByRFQID1() {
    this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
    if (this.searchByRFQID !== '') {
      // this.phoenixWFBlotterData_ALLRFQ = [];
      // this.phoenixWFBlotterData_ALLRFQExpand = [];
      //this.setPaginatorValues();
      this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords })
      let expandfilterArr = [];
      for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand_Orig.length; i++) {
        const filterarr = this.phoenixWFBlotterData_ALLRFQExpand_Orig[i].filter(rfq => rfq.ClubbingRFQId.toString().includes(this.searchByRFQID) &&
          (rfq.EP_BestPrice_YN === 'Y' || rfq.EP_BestPrice_YN === 'YN'));

        if (filter && filterarr.length > 0) {
          this.phoenixWFBlotterData_ALLRFQ.push(filterarr[0]);
          expandfilterArr.push(this.phoenixWFBlotterData_ALLRFQExpand_Orig[i]);
        }
      }

      this.phoenixWFBlotterData_ALLRFQExpand = expandfilterArr;
    } else {
      // this.onChange(this.frmDate, this.toDate)
      this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords })
      //this.phoenixWFBlotterData_ALLRFQExpand = this.phoenixWFBlotterData_ALLRFQExpand_Orig;
      //this.phoenixWFBlotterData_ALLRFQ = this.phoenixWFBlotterData_ALLRFQ_Orig;
      //console.log(this.phoenixWFBlotterData_ALLRFQExpand);
      //console.log(this.phoenixWFBlotterData_ALLRFQ);
    }
    //Added by Amogh K | 9-mar-2022
    //this.noOfRecords = this.phoenixWFBlotterData_ALLRFQ.length;
    
  }

  getDataByQuoteReqID() {
    // //console.log('getDataByQuoteReqID');
    this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282

    if (this.searchByRFQID !== '') {
      // this.phoenixWFBlotterData_ALLRFQ = [];
      // this.phoenixWFBlotterData_ALLRFQExpand = [];
      this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords })
      let expandfilterArr = [];
      // //console.log(this.phoenixWFBlotterData_ALLRFQExpand_Orig[0]);
      for (let i = 0; i < this.phoenixWFBlotterData_ALLRFQExpand_Orig.length; i++) {
        var quoteReqIdx = this.phoenixWFBlotterData_ALLRFQExpand_Orig[i].findIndex(rfq => rfq.ER_QuoteRequestId.toString().includes(this.searchByRFQID));

        if (quoteReqIdx > -1) {
          // //console.log(this.phoenixWFBlotterData_ALLRFQExpand_Orig[i][quoteReqIdx]);

          var searchByRFQID1 = this.phoenixWFBlotterData_ALLRFQExpand_Orig[i][quoteReqIdx].ClubbingRFQId;
          // const filterarr = this.phoenixWFBlotterData_ALLRFQExpand_Orig[i].filter(rfq => rfq.ER_QuoteRequestId.toString().includes(this.searchByRFQID) &&
          const filterarr = this.phoenixWFBlotterData_ALLRFQExpand_Orig[i].filter(rfq => rfq.ClubbingRFQId.toString().includes(searchByRFQID1) &&

            (rfq.EP_BestPrice_YN === 'Y' || rfq.EP_BestPrice_YN === 'YN'));

          // //console.log(filterarr);
          if (filter && filterarr.length > 0) {
            // //console.log(filterarr);
            this.phoenixWFBlotterData_ALLRFQ.push(filterarr[0]);
            expandfilterArr.push(this.phoenixWFBlotterData_ALLRFQExpand_Orig[i]);
            // for (let j = 0; j < filterarr.length; j++) {
            //   this.phoenixWFBlotterData_ALLRFQ.push(filterarr[j]);
            //   expandfilterArr.push(this.phoenixWFBlotterData_ALLRFQExpand_Orig[i]);
            //   //console.log(expandfilterArr);
            // }

          }
        }
      }

      this.phoenixWFBlotterData_ALLRFQExpand = expandfilterArr;
    } else {
      // this.onChange(this.frmDate, this.toDate)
      this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords })
      //this.phoenixWFBlotterData_ALLRFQExpand = this.phoenixWFBlotterData_ALLRFQExpand_Orig;
      //this.phoenixWFBlotterData_ALLRFQ = this.phoenixWFBlotterData_ALLRFQ_Orig;
      // //console.log(this.phoenixWFBlotterData_ALLRFQExpand);
      // //console.log(this.phoenixWFBlotterData_ALLRFQ);
    }
    //Added by Amogh K | 9-mar-2022
    //this.noOfRecords = this.phoenixWFBlotterData_ALLRFQ.length;
    // this.setPaginatorValues();
    // this.getPageInfo({ 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'reload': true, 'length': this.noOfRecords }) // commented by Jyoti S || 06-Jul-2023
  }
  // Added by ApurvaK for AddAttachment| 11 Nov 2021 start


  /*
    onSelectFile_old(event) {
      // //console.log(this.cpnCoupon);
      // //console.log(this.selectedRFQData.SolveForValue);
      //console.log("Eventtt:: ", event);
      if (event.target.files && event.target.files[0]) {
        var files = event.target.files;
        var file = event.target.files[0];
        this.fileName = event.target.files[0].name;
        this.DocumentName = event.target.files[0].name;
        this.DocumentFileType = event.target.files[0].type;
        // //console.log(this.DocumentName);
  
        this.getByteArray(file).then((byteArray) => {
          let jsonObject: any;
          this.byteData = byteArray;
          //console.log(this.byteData);
          // this.imgArr=byteArray;
        })
      }
    }
    */

  onSelectFile(event) {
    // //console.log(this.cpnCoupon);
    // //console.log(this.selectedRFQData.SolveForValue);
    //console.log("Eventtt:: ", event);
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      var file = event.target.files[0];
      var fileName = event.target.files[0].name;
      var DocumentName = event.target.files[0].name;
      var DocumentFileType = event.target.files[0].type;
      // //console.log(this.DocumentName);

      this.getByteArray(file).then((byteArray) => {
        let jsonObject: any;
        var byteData = byteArray;
        //console.log(byteData);
        // this.imgArr=byteArray;
        this.fileNameArr.push({
          // "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
          // "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]
          "DocumentID": "",
          "DocumentName": DocumentName,
          "DocumentByteFile": byteData,
          "DocumentFileType": DocumentFileType,
          "NoteMasterID": "",
          "CreatedAt": "",
          "CreatedBy": "",
          "EntityID": "" //this.cfs.getLoggedInUserName()[1].EntityId //req.body['EntityID']

        });
        // "", this.DocumentName, this.byteData, this.DocumentFileType, NoteMasterID, "", ""
        // this.saveAttachment(317723);
        // return false;
      })
      return false;
    }

  }


  getByteArray(file) {
    return new Promise(function (resolve, reject) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (event) {
        console.log(event)
        let array: any;
        // array = event.target.result;
        array = fileReader.result;
        const fileByteArray = [];
        let bytesData: any;
        for (let i = 0; i < new Uint8Array(array).length; i++) {
          fileByteArray.push(new Uint8Array(array)[i]);

        }
        //  return fileByteArray;
        resolve(fileByteArray);  // successful
      }
      fileReader.onerror = reject; // call reject if error
    })
  }

  async saveAttachment(NoteMasterID) {
    // this.EntityID = this.cfs.getLoggedInUserName()[1].EntityId;+
    // //console.log(this.DocumentName);
    // //console.log(this.byteData);
    // if (this.byteData == undefined || this.DocumentName == undefined || this.DocumentName == "") {
    //   return false;
    // }
    // else {
    // this.afs.addAttachment("", this.DocumentName, this.byteData, this.DocumentFileType, NoteMasterID, "", "");
    if (this.fileNameArr.length > 0) {
      this.fileNameArr.forEach(item => item.NoteMasterID = NoteMasterID);
      await this.afs.addAttachment(this.fileNameArr);
    }
    // }
  }

  // Added by ApurvaK for AddAttachment| 11 Nov 2021 end

  fnViewActionOnPrice(rfq, LP_NAME = "") {
    this.LP_Name = LP_NAME
    this.showPricerScreeninViewMode = true;
    this.viewRFQID = rfq;
    this.viewOnlyFlag = true;
    return false;
  }

  filledNotionalValidation() {
    try {
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      if (parseFloat(this.filledNotional.replace(/,/g, '')) > parseFloat(this.orderNotional.replace(/,/g, ''))) {
        if (this.accord === 8 || this.accord === 9) {
          this.errorMsgProdLaunch = 'Filled Qty should be less than or equal to Order Qty.'
        }
        else {
          this.errorMsgProdLaunch = 'Filled Notional should be less than or equal to Order Notional.'
        }

        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.errorMsgProdLaunch + '</span></div>').insertAfter("#filledNotional")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      else {
        this.getViewOrderData(this.selectedRFQData.NewNoteMasterID[0], 'N');
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  // disabledBookOrder(ER_TradeDate,LP) {
  //   var TradeDate = new Date(Date.parse(ER_TradeDate  + ' UTC'))
  //   var currentDate = new Date().toLocaleString();
  //   var disbldBookOrderFlg = false;
  //   if (TradeDate > currentDate) {
  //     disbldBookOrderFlg = true;
  //   }
  //   return disbldBookOrderFlg;
  // }

  parseCommonDatatoJSONArr(Field_Name: any) {
    let commonDataJSONArr: any = [];
    const index = this.commonData.findIndex(obj => obj.Field_Name === Field_Name);
    const displayTxt = (this.commonData[index].Display_Text).split(',');
    const saveTxt = (this.commonData[index].Save_text).split(',');
    if (displayTxt && displayTxt.length > 0) {
      for (let i = 0; i < displayTxt.length; i++) {
        if (displayTxt[i] !== '') {
          commonDataJSONArr.push({ 'Key': displayTxt[i], 'Value': saveTxt[i] === '' ? displayTxt[i] : saveTxt[i] });
        }

      }
    }

    if (Field_Name !== 'Tenor') {
      commonDataJSONArr.sort((a, b) => (a.Key > b.Key) ? 1 : -1);
    }

    return commonDataJSONArr;
  }

  checkOrderType(i) {

    if (this.selectedSharesData[i].orderType === 'Limit') {
      // this.selectedSharesData[i].limitLevel === '0.00'
      this.selectedSharesData[i].limitLevel = '0.00' //chnged by Suvarna P || 06Apr2022 || limit levelchnages while launching product || incorrect string format issue || assign by Pranav D
    }
    else {
      this.selectedSharesData[i].limitLevel = ''
    }

    // change order type for rest of row if current row's order type is Limit - added by Priya L. on 16Mar2022 - assigned by Pranav D.
    if (this.selectedSharesData[i].orderType === 'Limit') {

      for (let k = 0; k < this.selectedSharesData.length; k++) {
        if (k !== i) {
          this.selectedSharesData[k].orderType = 'Market';
          // added by Suvarna P || 06Apr2022 || limit levelchnages while launching product || incorrect string format issue || assign by Pranav D
          this.selectedSharesData[k].limitLevel = '';
        }
      }
    }
  }
  shwAttachmentPopUp = false;
  showAttachmentPopup() {
    this.shwAttachmentPopUp = true;
  }
  hideAttachmentPopup() {
    this.shwAttachmentPopUp = false;
  }

  //START || Added by Varsha G || HSBCECCLI-82 || 20-Nov-2023
  copyText(obj){
    try {
      let textToCopy = `RFQ:${obj.ER_QuoteRequestId};External:${obj.EP_ExternalQuoteId}`;
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = textToCopy;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    } catch (error) {
      
    }
  }
  //END || Added by Varsha G || HSBCECCLI-82 || 20-Nov-2023

  // Indicative Termsheet generation and Download - added by PriyaL on 07Mar2022 -assigned by PranavD - Start
  GenerateDocument(noteMasterID: any) {
    try {
      this.ErrorMsg = '';
      // added by Suvarna P || 28Apr2022 || Termsheet download msg || assigned by Pranav D.
      this.successMsg = '';
      const res: any = this.afs.GenerateDocument(noteMasterID);
      if (res !== null && res !== undefined) {
        if (res.GeneratedFileBytes[0] !== undefined) {
          const bytes = new Uint8Array(res.GeneratedFileBytes);
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          if (this.accord === 8) {
            link.download = "Accumulator_" + Guid.create();// res.Document_Output_Path;
          }
          if (this.accord === 9) {
            link.download = "Decumulator_" + Guid.create();// res.Document_Output_Path;
          }

          link.click();
          // added by Suvarna P || 28Apr2022 || Termsheet download msg || assigned by Pranav D.
          this.successMsg = 'Termsheet downloaded successfully.';
        } else {
          this.ErrorMsg = res.Status.toString();
        }

      } else {
        this.ErrorMsg = 'Termsheet not available. Please try again later.';
      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }
  
  //Added by AdilP || FIN1EURINT-430 || 07-06-2023 
  changePercentage( str: string ){

    if(str.length > 1){
      let finalPercentageString = str.replaceAll('%','')
      let gearPercetage = parseFloat(finalPercentageString).toFixed(2);
      return gearPercetage + '%';

    }
    return 'N/A';
  }
  public ngOnDestroy(): void {
    if(this.GetWFBlotterPHXSFSub){
    this.GetWFBlotterPHXSFSub.unsubscribe();
  }//Added by Jyoti S || 20-Jun-2023
}
//Added by Jyoti S || 24-Aug-2023 || START || FIN1EURINT-600
onClickedOutside(i) {
  this.phoenixWFBlotterData_ALLRFQ[i].TriggerPopup = false;
}

  async GetTriggerTable(i,QRID,noncall){
  // this.RfqCloneData = this.afs.getPreviousQuoteCloneData(QRID,'RFQID')
  let preQuoteData1: any;
  preQuoteData1 = await this.afs.getPreviousQuoteCloneData(QRID,'RFQID')
  // this.TriggerPopup = true;
  this.TriggerValueArr = [];
  let TriggerValues = preQuoteData1.cloneData.autoTrigger[0].split('/')
  let triggerLength = Number(noncall) + TriggerValues.length;
  let index = 0;
  for(let i = 1; i <= triggerLength; i++){
    if(i > Number(noncall)){
      this.TriggerValueArr.push(TriggerValues[index]);
      index++;
    }
    else{
      this.TriggerValueArr.push('')
    }
  }
  this.phoenixWFBlotterData_ALLRFQ[i].TriggerPopup = true;
}
//Added by Jyoti S || 24-Aug-2023 || END || FIN1EURINT-600


//Start || Avinash G || 12-Apr-2024 || HSBCECCLI-118 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K
displayAutoCallTrigger(ERTrigger){
  //debugger;  
  this.displayAutocallTriggerPopup=false;
  //console.log("Display Trigger Click")
  //console.log(ERTrigger);
  if(ERTrigger!='' || !ERTrigger!=null || ERTrigger!=undefined){
    var autoTriggArr=ERTrigger.split('/');
    this.displayAutoCallTriggerArr=[];
    for(let i=0;i<autoTriggArr.length;i++){
      let temp={
        "NoOfPeriods":i+1,
        "OutTrigger":autoTriggArr[i]
      }
      this.displayAutoCallTriggerArr.push(temp);
    }
    this.displayAutocallTriggerPopup=true;
    //console.log(autoTriggArr);
  }  
}

closeAllOpenDivs(){
  debugger;
  this.checkTriggerDivOpen=!this.checkTriggerDivOpen;
if(this.checkTriggerDivOpen==false && this.displayAutocallTriggerPopup==true)
  {
    this.displayAutocallTriggerPopup=false;
  }  
}

//End || Avinash G || 12-Apr-2024 || HSBCECCLI-118 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K


//Start - Added by Apurva K|| 13-May-2024|| FIN1EURINT-721
async fnGetProdTemplate() {
  try {

    this.templateMappingArr = await this.afs.fnGetProdTemplate('AutocallablePhoenixER');
  
  } catch (error) {
    //console.log('Error:', error);
  }
}

addExternalQuote(item){
  this.insertBtnActive = 'Y';
  console.log(item,"item in popup function")
  this.nMasterId = item.ClubbingRFQId;
  console.log(this.nMasterId,"this.nMasterId in popup function")
  this.showExtQuotePopup = true;
  this.quoteTime = this.datepipe.transform(this.quoteTime, 'yyyy-MM-dd HH:mm:ss')
}

hideExternalQuotePopup() {
  this.showExtQuotePopup = false;
  this.quote = '';
  this.issuer = '';
  this.quoteInsertErrMsg = '';
  this.quoteInsertSuccMsg = '';
  this.insertBtnActive = 'Y';
}

async insertQuote(){
  console.log(this.nMasterId,this.quote,this.issuer,this.Template_Code,"template code");
  this.quoteInsertErrMsg = '';

  await this.validationOnButton();

  if(this.quoteInsertErrMsg == ''){
  this.insertBtnActive = 'N';
  let requestXML='';
  requestXML += '<InsertQuoteRequest>';
  requestXML += '<NoteMasterId>'+ this.nMasterId +'</NoteMasterId>';
  requestXML += '<Issuer>'+ this.issuer +'</Issuer>';
  requestXML += '<Quote>'+ this.quote +'</Quote>';
  requestXML += '</InsertQuoteRequest>';

  //product code- EQC_Europe, subtemplatecode= Autocallable phoenix 

  const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
  const that = this;
  const parameters = [{
    productCode: this.Template_Code,//'AutocallablePhoenix',
    subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'EQC_Europe',
    LP: this.issuer, 
    requestXML,
    solveFor: "",
    loginID: AppConfig.settings.oRes.userID,
    userGroupID: AppConfig.settings.oRes.groupID,
    buyerEntityID: AppConfig.settings.oRes.homeEntityID,
    noteMasterID: this.nMasterId  ,
    repricereqYN: 'IQ'
  }];
  console.log("parameters : ",parameters);
  await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
    if(data.errorMessage != ''){
      this.quoteInsertErrMsg = data.errorMessage;
      console.log(this.quoteInsertErrMsg,"response of insert quote")
    }
    else{
      this.quoteInsertSuccMsg = 'Quote Inserted Successfully!';
      console.log(this.quoteInsertSuccMsg,"response of insert quote")
    }
    this.insertBtnActive = 'Y';
  })
  }
}

async validationOnButton() {
  try {
    if (this.issuer == '' || this.issuer == undefined) {
      this.quoteInsertErrMsg = 'Please select issuer.';
    }
    if (this.quote == '' || this.quote == undefined) {
      this.quoteInsertErrMsg = 'Please enter valid quote.';
    }
} catch (error) {
  //console.log('Error', error);
}
return false;
}

reset(){
  this.quoteInsertErrMsg = '';
  this.quoteInsertSuccMsg = '';
}

copyProductName(item,dataitem) {
  dataitem.isExpand = false;
  console.log(dataitem.isExpand,"expand console")
  this.successMsg = 'Product name copied successfully!';
  setTimeout( () => {
    this.successMsg = '';
  }, 2000);

  document.addEventListener('copy', (e: ClipboardEvent) => {
    e.clipboardData.setData('text/plain', (item));
    e.preventDefault();
    document.removeEventListener('copy', null);
  });
  document.execCommand('copy');
}
//End - Added by Apurva K|| 13-May-2024|| FIN1EURINT-721

}

