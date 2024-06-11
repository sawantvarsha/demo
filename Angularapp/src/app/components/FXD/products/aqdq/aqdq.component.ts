import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import {Subscription} from 'rxjs';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service';


// declare var firstload:any; //added by Urmila A, 4-april-23, for reading signalR code via extrenal js file

// import { FXDConfigService } from '../../FXD_Model_Configs/fxd-config.service'; //commented by UrmilaA | 17-jan-23 | Currently not in use

// import datepickerFactory from 'jquery-datepicker';
// import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-en-GB';
// import { isEmptyObject } from 'jquery';

// declare const $: any;
declare var require: any;
const $: any = require('jquery');
declare var setProxy:any;
@Component({
  selector: 'app-aqdq',
  templateUrl: './aqdq.component.html',
  styleUrls: ['./aqdq.component.scss','../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})
export class AqdqComponent implements OnInit, OnDestroy, OnChanges {
  @Input() Product_ID: any;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  // @Input() AppMode: string;
  @Input() ViewMode: string;
  @Input() InputData: any;
  @Input() Template_Name:any;  //Urmila A | 20-feb-23
  @Input() TemplateCode:any;  //Urmila A | 20-feb-23
  @Input() TemplateID:any; //Urmila A | 20-feb-23
  @Input() AllProdData:any; //Urmila A | 20-feb-23
  @Input() isAQPresent:any; //Urmila A | 6-Mar-23
  @Input() isDQPresent:any; //Urmila A | 6-Mar-23
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23
  @Input() AllowSolveForYN :any; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  @Input() ShowPriceProviderOnQEN:any; // EFGUPINT-261 | Chaitanya M | 23-April-2024
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;// EFGUPINT-261 | Chaitanya M | 23-April-2024

  CustPrem: any;
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  screenHeight: number;
  screenWidth: number;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: any;
  FXDOptionCutSubscriber: any;
  FXDFirstFixingDateSubscriber: any;
  FXDGetNoofSettSubscriber: Subscription;
  RFQNODisplayFromParent: boolean=false;
  SessionInvalid: boolean=false;
  FixingSettChngYN: any='N';
  FXDRouteToDealerSubscriber: any;
  ProdChangedYN: boolean=false;
  prodDetailSubscriber:Subscription;
  selectedProduct: any;
  OrderClicked: any=false;
  firstfixval: any ;
  ScheduleXML:any = '';
  ScheduleDescription: any='';
  GuaranteedPeriodTill: any = '';
  ScheduleCallWithGuarenteeperiod: boolean=false;
  DealerRemark: any;
  AfterRouteClearLps: boolean=false;
  NoteToUnblock: any;
  UnlockMsg: any;
  ClearLPs: boolean=false;
  IBPremToggle: boolean=false;
  ResetPricerFlag:boolean = false;//Urmila A | LGTGTWINT-1209 | 27-Jan-23
  scheduleBtnClick:boolean=false; //Urmila A| 28-Jan-23
  cnt:any=0; //Urmila A| 30-Jan-23
  GperiodChange: boolean=false;  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
  ResetAllfieldsCalled: boolean=false;
  closeQuoteMail: boolean=false; //urmila A | 13-feb-23
  RMRemarkVisibility:boolean=false; //Urmila A | LGTCLI-294
  ClientPremDir:any=''; //UrmilaA | 13-feb-23 | LGTCLI-304
  PriceRecvFromLPs:any=0; //UrmilaA | 16-feb-23 | LGTCLI-315
  IsNavigate: boolean=false; //Urmila A | 17-Feb-23
  DealerRemarkVisibility:boolean=false; //Urmila A | 24-feb-23 | LGTGTWINT-1504
  NDFFlag: string='N';
  isMetal: string='N';
  noResponseRecv: boolean=false;  //LGTGTWINT-1774, 29-Mar-23, Urmila A
  PriceproviderArr: any[]=[];
  //Button visibility checks  | added by Urmila A | LGTGTWINT-1455 | 21-Feb-23
  isSpreadVisible:boolean=false;
  isEmailQuoteVisible:boolean=false;
  isSchedulevisible:boolean=false;
  isResetvisible:boolean=false;
  isRoutetoDealerVisible:boolean=false;
  isSaveTradevisible:boolean=false;
  isOrderBtnVisible:boolean=false;
  isRejectVisible:boolean=false;
  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  CommomDataSubscriber:Subscription;
  //ends

  //---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29
  SaveTradeEnabledFlag : boolean = false
  SaveTradeLoader : boolean = false
  disabledRoutetodealeronSaveTrade : boolean = false
  SavetradePopup : boolean = false
  NotionalToggle: boolean=false; 
  SpreadRounding: any;
  IBPremNotionalDecimal: any;
  //---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29

  PremDecimal: any;
  selectedCustomerSubscription: any;
  EntityDataFXAQDQ: any[]; //RizwanS || EFGUPINT-138 || 10 Apr 2024
  showPremAmt: any;


  @HostListener('document:keydown', ['$event'])

  onKeyDownHandler(event: KeyboardEvent) {
    // console.log(event);
    switch (event.key || event.code) {
      case 'F7':
        console.log(event);
        this.ResetAllFields();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'F8':
        console.log(event);
        this.Validations();
        this.fnBestPricing();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'F9':
        console.log(event);
        event.stopPropagation();
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('height:', this.screenHeight, 'width:', this.screenWidth);
  }
  
  //Added by Urmila A | 9-Jan-23 | start | for checking screen width , height | Code shiifted - LGTGTWINT-895
  public getScreenWidth: any; //Added by Urmila A | 9-Jan-23
  public getScreenHeight: any; //Added by Urmila A | 9-Jan-23
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('Width:',this.getScreenWidth, 'Height',this.getScreenHeight)
  }
  //Added by Urmila A | 9-Jan-23 | end

  // Added by Urmila A | 16-Nov-22 | Start
  FXCurrencyPairsubscription: any;
  TenorDayssubscription: any;
  FXBidAsksubscription: any;
  FXDatesCalculationsubscription: any;
  FXPriceProvidersubscription: any;
  Bestpricesubscription: any;
  BookOrdersubscription: any;
  PersonalDefaultValueSubscriber:any;
  productInfoSubscriber: any;
  GetTenorSubscriber: any;
  getBidaskSubscriber: any;
  FXDProductDetailsSubscriber: any;
  FXDContractSummSubscriber: any;
  QuteMailClicked:boolean=false
  FXD_RFQDealDetailsNavigateSubscriber:any;
  RFQDetailsFromNoteMasterSubscrber:any;
  ScheduleSub:any; //Urmila A| 17-Jan-23 
  SchedulePOP_UP_Subscriber:any; //Urmila A | LGTGTWINT-1163 | 25-Jan-23
 // Added by Urmila A | 16-Nov-22 | End

  // First Column
  CurrencyPair: string='';
  DepCcy: string;
  AltCcy: string;
  OrderDirection: string;
  NotionalCcy: string;
  NotionalAmt: any;
  AltNotionalAmt: string;
  Tenor: string;
  TenorDays: any;
  BidSpot: string = '';
  AskSpot: string = '';
  Strike: any='';
  IBPrem: any=0;
  IBPremCcy: string;
  ClientPrem: any;
  Upfront: any;
  UpfrontCcy: number;
  UpfrontAlt:any;

  // Second Column
  TradeDate: string;
  Premiumdate: string;
  FinalFixingDate: string;
  FinalSettDate: string;
  FixingSettFreq: string;
  Leverage: any;
  KORate: string='';
  KIRate: string = '';
  GuaranteedPeriods: string='0';
  ViewSchedule: boolean;
  Delta: string;
  DeltaAmt: string;
  DeltaCcy: string;
  // Extra param
  CurrencyPairList = [];
  DateArray = [];
  // eslint-disable-next-line new-parens
  d = new Date();
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
  ServiceResponse: any;
  ResponseArray = [];
  BestPriceProvider: string;
  BestPrice: number;
  OrderPlaceFlag: boolean;
  PriceProviderString: string = '';
  
  //Start - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  PriceProviderForSolveForStrike: string = ''; 
  SolveForchange :boolean = false; 
  SolveForLPList =[];
  // End - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  
  LoadingAQDQFlag: boolean;
  NoteMasterID: string;
  ViewScheduleflag: boolean = false;
  DealNo: string;
  SampleArray = [];

  // Booking Param
  DCDRfqId: string='';
  ExternalRfqId: string;
  BestPriceabs: number;
  // TemplateID: number;
  // TemplateCode: string;
  Errormsg: string;
  Orderplace: string;
  loadflag: boolean;
  XMLString: string;

  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
  OrderBlotterVisibility: boolean;
  ScheduleVisibility: boolean;
  UserID: string;
  StrikePoint: number;
  OptionType: string;
  ClearPricingFlag: boolean;
  selectedCustomerDetails: any=[]=[];
  CustomerID: string = "";
  CustomerName: any;
  OptionCut: string='';
 

  PricingModels = ['Black Scholes', 'Vanna Volga'];
  SeletcedPricingModel: string;
  disabledPrembtn: boolean;
  OptionCutOptions = [];
  NotionalPerFixing: any;
  NoOfSett: any;
  TenorOptions = [];
  IBPremComment: string; 
  ClientPremComment: string;
  SelectedPricingMode: string = 'Auto';
  SelectedLPForPricing: string = 'Best Price';
  // PricingModes = ['Auto', 'Manual'];
  PricingModes = ['Auto'];  //Added by Urmila A, for now only Auto pricing mode to enable, as discussed with Rahul P | 4-Nov-22

  SelectedIBType: string = 'IB Pays';
  SelectedClientType: string = 'Client Pays';
  GetPriceProviderDetailsSubscription: any;
  DisableCCYChangeControl: boolean = false;
  NotionalDecimalPointShift: number = 2;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;
  KIStyleOptions = ['E-101', 'E-102', 'E-112', 'NO'];
  SelectedKIStyle: string;
  
  Remark: string;

  IsRouteToDealerExecuted: boolean = false;
  OriginalIBPrem: any=0;
  DealingRFQID: string = '';
  RMRemark: string = '';
  ContractSummary: any = '';
  QueueStatus: string = '';
  AllDataLoaded = {
    productDetail:false,
    productinfo: true,
    ccypairs: false,
    optioncut: false,
    tenor: true, //modified by Urmila A | 18-feb-23
    priceprovider: false,
    bidask: false,
    datecalculation: false,
    firstfixingdate: false, 
    
  };
  firstTimeExecuted: boolean = false;
  // EntityData:any[] = [] //commented by UrmilaA, LGTGTWINT-1898 | 24-april-23

  //Added by Urmila A | start 
  UpfrontVal:any;
  QuoteValidity:any;
  PPDetails:any[]=[];
  orderMsg:string;
  OrderPlaced:boolean=false;
  OrderPlacedPopup :boolean=false; //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  Pair_Cross_YN:any;
  Left_USD_Pair:any;
  Right_USD_Pair:any;
  LeftUSDMidrate:any;
  RightUSDMidRate:any;
  SpotMidRate:any;
  FirstFixingChangedYN:any='N'; 
  NoofSettChangeYN: any='N';
  FirstFixingDate: string = '';
  custPremDirection:any;
  IBPremDirection:any;
  QuoteMailSent:boolean=false
  AltNotional:any=0;
  ExceptionWarningMsg:any='';
  CustPAN:any='';
  routeToDealerClicked:boolean=false;
  routeToDealerClickedloader : boolean = false // //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  confirmedRouteDealer:boolean=false;
  RouteFromWorkflow:boolean=false;
  firstFixChngAndDatesReceived:boolean=false;
  @Input() RFQDetailsFromBlotterYes_QueueStatus:any;
  ExecutedQueue:boolean=false;
  NewOrderfromRMLocked:boolean=false;
  NewOrderfromRMUnlocked:boolean=false;
  TradeIdea:boolean=false;
  ExpiredTradeIdea:boolean=false;
  RejectedOrder:boolean=false;
  OriginalIBPremPer:any;
  RFQLockedSecLeft:any=0;
  RFQLockedInterval:any;
  SecInterval:any;
  LockedDealPopUp:any=false;
  RFQLockedBy:any;
  Parant_DCDRFQID:any=''; //Urmila , 30-mar-23
  DI_YN:any=''; //Urmila , 30-mar-23
  PriceRecAfterRepricefromBlotter:boolean=false;
  BlotterRFQ:any;
  RejectSubscriber:any;
  RejectRedirectedOrder:boolean=false;
  RejectedOrderMSG:any='';
  unlockNotemasterSubscriber:any;
  unlockNoteMasterYN:boolean=false;
  ccy1:boolean=false;
  ccy2:boolean=false;
  DIfromTradeIdea:any='';
  CurrencyChanged:boolean=false; //Added by Urmila A | 7-Jan-23
  CcySearch: any = ''; //Added by Urmila A | 11-Jan-23
  AllAPIsLoaded:boolean=false//Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
  PointShift:any; //27-feb-23
  RouteFromQuoteHistory:boolean=false; //urmila A, 29-mar-23
  prevFirstFixingDate:any=''; //urmila A, 5-april-23
  OrderRejectedMsg:any=''; //UrmilaA, 17-april-23, LGTCLI-411
  //Added by Urmila A | end 


  //RFS | Urmila A, 18-May-23, LGTCLI-361 | start
  BroadCastData: any[]=[];
  @Input() ShowRFS:any; //UrmilaA, LGTCLI-361 | 22-May-23
  MaxQuoteTimeout:any;
  MinQuoteTimeout:any;
  MinQuoteTimeOutOccurred:boolean=false;
  SignalRsubscriber:Subscription;
  fxdProdCofigSubsriber: any; 
  FXDConfigSubscriber:Subscription; 
  SignalRQuoteIDs:any='';
  CancelSignalRconnectionSub:Subscription;
  signalRMsgRecv:boolean=false;
  ShownSignalRPriceQuotes:any[]=[]
  saveRes:any=[]
  SignalR_unsubscriber:boolean=false; 
  MaxQuotePriceCame:boolean=false;
  btnEnable:boolean=false;
  //LGTGTWINT-2110| UrmilaA |9-june-23| start
  MinMaxTimer:any=0;
  MinInterval:any;
  maxInterval:any;
  MinTimeput:any;
  MaxTimeout:any;
  //LGTGTWINT-2110| UrmilaA  ends

  //LGTGTWINT-2109| UrmilaA | 9-june-23|start
  PriceClick:boolean=false;
  priceLoader:boolean=false;
  //LGTGTWINT-2109| UrmilaA | ends

  //Urmila A, 18-May-23, LGTCLI-361 | ends

  //LGTGTWINT-1895 | UrmilaA | start
  FixingFreqArr:any[]=[]
  fixingSubscriber:Subscription;
  //LGTGTWINT-1895 | UrmilaA | ends

  //LGTGTWINT-2137 | 16-June-23 |start
  isQENMode:boolean=false;
  isSENMode:boolean=false;
  //LGTGTWINT-2137 | 16-June-23 |ends

  // START - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForOptions = [];  
  SelectedSolveFor : any;  
  SolveFor : any; 
  SolveforStrike : boolean = false; 
  Strike_value : any; 
  // END - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023

  // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  UseFinSPL:any;
  FinSPLFilePath:any;
  public FXDFinSPL: Subscription;
  // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024


  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 

  PreminPipsToggle :any; // HSBCFXEINT-79 UAT- Pricing in pips & % (Code Sync) | Chaitanya M | 06-March-2024
  togglePremiumMetals : string;
  togglePremiumNonMetals : string;
  togglePremiumCcy : string;
  KIFieldVisibility : boolean;

  ShowPriceProvider:boolean; // EFGUPINT-261 | Chaitanya M | 23-April-2024
  showPPDropdown:boolean;// EFGUPINT-261 | Chaitanya M | 23-April-2024
  
  OPTDEN_UseTwoStepDILogic: string = "NO"; // RizwanS || EFGUPINT-335 || 23 Apr 2024

  LPname:any;
  constructor(
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    private datepipe: DatePipe,
    public sanitize :SanitizeHtmlPipePipe,
    public CustAPI: CustomerApiService, //Urmila A | LGTGTWINT-1455 | 21-feb-23
    public SignalR : FXDSignalRService
    
  ) {
    this.SeletcedPricingModel = '';
    this.ClearPricingFlag = false;
    this.disabledPrembtn = false;
    this.OptionCut = '';
    this.NotionalPerFixing = '100,000.00';
    this.NoOfSett = '52'; //Urmila A | LGTCLI-325 | 24-feb-23
    this.SelectedKIStyle = '';
    this.HomeAPI.CustomerId = '1';
    this.HomeAPI.CustomerName = 'LGT-CUST001';
    this.CustomerID = '1';
    this.SessionInvalid = false;
    this.OrderPlacedPopup=false;
    this.GuaranteedPeriods = '0'; //Urmila A | 10-feb-23
    this.SelectedSolveFor = '';  // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  }
  ngOnChanges(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
   
    this.fnSetEntity()  //UrmilaA, 3-May-23 | LGTGTWINT-1949
   
    //added by UrmilaA | LGTGTWINT-2137 (Usertype checks replaced with Mode)| 16-june-23 |start
    if(this.FXD_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
      this.ShowPriceProvider = true;// EFGUPINT-261 | Chaitanya M | 23-April-2024
      this.showPPDropdown = true;// EFGUPINT-261 | Chaitanya M | 23-April-2024
    }else if(this.FXD_cfs.fngetMode() == 'SEN'){
      this.isSENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }
    //added by UrmilaA | LGTGTWINT-2137 | 16-june-23 |ends

    if(this.AllowSolveForYN === true){
      this.SolveForOptions = ['Spread', 'Strike']; 
    }else{
      this.SolveForOptions = ['Spread']; 
    }
         
    // firstload(); //added by Urmila A, 4-april-23, for reading signalR code via extrenal js file
    // console.log('read js file ',)
    this.getScreenWidth = window.innerWidth; //Added by Urmila A | 9-Jan-22
    this.getScreenHeight = window.innerHeight;  //Added by Urmila A | 9-Jan-22


    // Urmila A | check View schedule pop-up visibility | start | 8-Dec-22
    // //Urmila A | LGTGTWINT-1163 | 25-Jan-23 , added subscriber
    this.SchedulePOP_UP_Subscriber = this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res=>{
      if(res === false){
            this.ViewScheduleflag = false
      }
    });
    // Urmila A | check View schedule pop-up visibility | end

    //for AQDQ, guarentee period till date in contract summary , by urmila A | 13-Dec-22 
    this.ScheduleSub = this.FXD_afs.FXD_Schedule_GuratenteeTillDate_AQDQObs.subscribe((res:any)=>{  
      try{
        if(res){
          if(res.Gperiod !== '' && res.Gperiod !== undefined){              
              this.GuaranteedPeriodTill= ''; //Urmila A | 10-feb-23
              this.GuaranteedPeriods = res.Gperiod; 
              console.log('Guarentee till date: ', res.GperiodTill)
              this.GuaranteedPeriodTill = res.GperiodTill;   
              this.AllAPIsLoaded=true; //Urmila A | 16-feb-23
              if(Number(this.GuaranteedPeriods) > 0 && this.GuaranteedPeriodTill !== '' ){ //Added by Urmila A | 30-Jan-23 | LGTGTWINT-1244 && this.cnt === 0          
                this.fnGetContractSummary()   
              }else if(Number(this.GuaranteedPeriods) === 0 && this.GuaranteedPeriodTill === '0'  || this.GuaranteedPeriodTill === ''){ //Urmila A | LGTGTWINT-1332 | 6-feb-23
                this.GuaranteedPeriodTill='';
                this.fnGetContractSummary();        
              }//end        
           }
        }
        
      }catch(err){ } 
    });

  
    //Urmila A | Workflow RFQ Deal details | LGTGTWINT-561 | start
    this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes:any)=>{
      try{
        
          //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, start
          // (navigateRes.navigate === true && navigateRes.redirectFrom === 'blotter' ) && ( navigateRes.ProdcutCode === 'FXAQ' || navigateRes.ProdcutCode === 'FXDQ' )
          if(navigateRes.navigate === true &&  navigateRes.ProdcutCode === 'FXAQ' || navigateRes.ProdcutCode === 'FXDQ' ){
            console.log('after redirect data: ', navigateRes);
            this.IsNavigate = true;
            this.fnResetpricingFlags(); //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling

            //Mode changes done by Urmila A, 6-april-23 | LGTGTWINT-1758 (mention in comment)
            this.Mode = navigateRes.redirectFrom === 'blotter' ? this.FXD_cfs.fngetMode() : 'QEN'; //Urmila A | 15-Feb-23 | LGTCLI-286

              this.RFQDetailsFromNoteMasterSubscrber = this.FXD_afs.FXDGetRFQDetailsFromNoteMasterIDAPI(navigateRes.ReFNo, this.FXD_afs.UserName,this.Mode) //API req modified by Urmila A | 21-Aug-23 | Core migration 
              .subscribe((res:any)=>{
                    try{
                      if(res !== null){
                        console.log('RFQ from Note master: ',res,'RFQDetailsFromBlotterYes_QueueStatus',this.RFQDetailsFromBlotterYes_QueueStatus);                 
                           if(res.length === undefined){
                              if(navigateRes.redirectFrom === 'blotter'){                          
                                this.DI_YN = 'N';
                                this.Parant_DCDRFQID = '';
                                this.NoteToUnblock = ''; //Urmila A | 19-Jan-23 
                                this.NoteMasterID = ''//Urmila A | 27-Jan-23
                                this.DIfromTradeIdea = 'N';
                                switch(this.RFQDetailsFromBlotterYes_QueueStatus){
                                  case 'Executed Orders':
                                    this.ExecutedQueue=true;
                                    this.NoteToUnblock = navigateRes.ReFNo;
                                    break;
                                  case 'Trade Idea':
                                    this.TradeIdea=true;
                                    this.DI_YN = 'Y';
                                    this.DIfromTradeIdea = 'Y';
                                    this.Parant_DCDRFQID = res.ParentRFQNumber;
                                    this.NoteToUnblock = navigateRes.ReFNo;
                                    break;
                                  case 'Expired Trade Idea':
                                    this.ExpiredTradeIdea =true;
                                    this.NoteToUnblock = navigateRes.ReFNo;
                                    break;
                                  case 'New Order from RM':
                                    if(res.LockStatusMsg !== '' && res.LockStatusMsg.includes(this.FXD_afs.UserName)){
                                        this.NewOrderfromRMUnlocked=true;
                                        this.DI_YN = res.DI_YN;
                                        this.Parant_DCDRFQID = res.ParentRFQNumber;
                                        this.NoteMasterID = navigateRes.ReFNo;
                                        this.NoteToUnblock = navigateRes.ReFNo;
                                        this.fnRFQLockerForTimer();
                                    }else if(res.LockStatusMsg !== '' && !res.LockStatusMsg.includes(this.FXD_afs.UserName) ){
                                        this.NewOrderfromRMLocked =true;
                                        if(res.DI_YN === 'Y'){
                                          this.DI_YN = 'Y';
                                          this.Parant_DCDRFQID = res.ParentRFQNumber;
                                          this.NoteMasterID = navigateRes.ReFNo;
                                          this.NoteToUnblock = navigateRes.ReFNo
                                        }            
                                        this.FXD_cfs.LockedDealPopUp=true;
                                        this.RFQLockedBy=res.LockStatusMsg                      
                                        this.FXD_cfs.fxdpopupOpenClose=true;
                                    
                                    }else if(res.LockStatusMsg === ''){
                                        this.NewOrderfromRMUnlocked=true;
                                        this.DI_YN = res.DI_YN;
                                        this.Parant_DCDRFQID = res.ParentRFQNumber;
                                        this.NoteMasterID = navigateRes.ReFNo;
                                        this.NoteToUnblock = navigateRes.ReFNo
                                        this.fnRFQLockerForTimer();
                                    }
                                    break;
                                  case 'Rejected Orders':
                                    this.RejectedOrder=true;
                                    this.NoteToUnblock = navigateRes.ReFNo;
                                    break;
                                }
                                
                                this.RMRemarkVisibility = this.FXD_cfs.fnRMremarkVisibility(
                                this.RFQDetailsFromBlotterYes_QueueStatus) //Urmila A | 13-feb-23 | LGTCLI-294                               
                                this.RouteFromWorkflow = true;
                                                                                      
                              }else if(navigateRes.redirectFrom === 'quotehistory'){ //Urmila A, 29-Mar-23 | LGTGTWINT-1758
                                this.RouteFromQuoteHistory=true;                            
                                console.log('RFQ from Note master: ',res);                             
                              }
                           }
                           
                          this.fnAssignDataLoadValues();
                          this.fnSetRFQDetailsFromNotemasterID(res); 
                          this.fnButtonVisibility();  //Urmila A | 27-feb-23 | LGTGTWINT-1455
                         
                      }else if(res == null){
                        //QEN   
                        console.log('error', res) 
                        // this.NotificationFunction("Error","Error" , res )
                      }                 
                       
                         
                    }catch(err){ throw err;  }
              }) 
          }else if(navigateRes.navigate === undefined || navigateRes.navigate === false ){
            // this.getEntityData(); 
            // this.fnGetProductDetails();   
            // this.SetDefaultValues();          
          }
          //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, end
      }catch(err) {  console.log(err) }
    });


    //Added by Urmila A, 9-may-23, LGTCLI-361 - start
    this.SignalRsubscriber = this.FXD_afs.FXDSignalRBroadcastMsgObs.subscribe((BroadCastMsg:any)=>{
      try{
          if(BroadCastMsg !== null && BroadCastMsg.length > 0){
            console.log('recv broadcast msg:',BroadCastMsg )
            this.signalRMsgRecv=true;
            this.BroadCastData=BroadCastMsg
            this.MapRFS(BroadCastMsg)
          }
      }catch(err){
        console.log('err:',err)
      }
    })
    //Added by Urmila A, 9-may-23, LGTCLI-361 - end
  
  
    //Urmila A | 20-feb-23 | LGTGTWINT-1444 |start 
    if(!this.IsNavigate){
      // this.getEntityData();  //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
      console.log('in AQDQ details from parent:', this.Product_ID,this.Product_Code,
      this.Product_Name, this.Template_Name, this.TemplateCode,'prod data',this.AllProdData)
      this.SetDefaultValues();
      this.fnButtonVisibility()
      if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
          this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
            this.fnGetProductConfig(); //Added by UrmilaA, 9-May-23, fnGetProductConfig | LGTCLI-361 
          
          this.AllDataLoaded.productDetail = true;
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
            this.AllAPIsLoaded=true;
          }      
          this.fnGetPriceProviderandCcypairs();  
          this.fnGetFXDCurrencyPairs();
          // this.fnGetTenor();
          this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
      }else{
          this.fnGetProductDetails(); 
      } 
      // this.fnButtonVisibility();
    }
    //Urmila A | 20-feb-23 | end
  
    console.log(this.Product_Code)   
    this.LoadingAQDQFlag = false; 
  
    // this.fnGetProductDetails();   
    // this.SetDefaultValues();
    
  }


  //UrmilaA, 3-May-23 | LGTGTWINT-1949
  fnSetEntity(){
    console.log('coming entity data:', this.EntityData)
    // sessionStorage.setItem('FXD_EntityID', this.EntityData[0].code) //mapping modified by Urmila A | 29-Aug-23
    // this.FXD_afs.SetCredentials() 

   //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
   if(this.EntityData[0].code === '50'){
    this.CustomerID = this.HomeAPI.CustomerId = '50';
    this.HomeAPI.CustomerName = 'CustomerPB';             
    }//end

  }

 //Added by Urmila A, 18-May-23 | LGTCLI-361 | start
 fnGetProductConfig(){
  //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
  this.fxdProdCofigSubsriber = this.FXD_afs.FXDGetProductConfigsAPI(this.FXD_afs.UserName,
   this.Product_ID).subscribe((res:any)=>{
    try{
          if(res){
            console.log('product config res=> ', res)     
            res=res.Configs
              if(res !== null || res.length > 0){   //conditions modified by Urmila A | 28-Aug-23 
                res?.forEach(element => {
                      if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
                        this.MaxQuoteTimeout = element.Value
                      }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
                        this.MinQuoteTimeout = element.Value
                      }  
                      if(element.Setting_Name === 'OPTDEN_PrincipalBankNameinLPGrid') {
                        this.LPname=element.Value;
                      }          
                });
              }else if(res == null){  //conditions modified by Urmila A | 28-Aug-23
                  this.MinQuoteTimeout = '30';
                  this.MaxQuoteTimeout = '90';
              }         
          }
    }catch(err) {console.log(err)}
  })
}
//Added by Urmila A, 18-May-23 | LGTCLI-361 | ends 

  //added by Urmila A, 29-Mar-23 , start
  fnAssignDataLoadValues(){
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;
    this.AllDataLoaded.firstfixingdate = true;
    this.AllDataLoaded.datecalculation = true;  //Urmila A | 2-Feb-23 | LGTGTWINT-1295
    this.OrderPlacedPopup=false;
  }//end

  //Added by Urmila A | LGTGTWINT-1455 | 21-feb-23 | start
  fnButtonVisibility(){
        let chkMode = this.FXD_cfs.fngetMode();
        this.isEmailQuoteVisible = this.isSchedulevisible = this.isResetvisible = true;

        this.fnbtncheck('TradeIdeaBtnAccess_LoginUserGroup', 
        this.RouteFromWorkflow ? this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')

        //Modified by Urmila A | 9-Mar-23 , currenly not using common data for Single pricer
        if(!this.RouteFromWorkflow || this.RouteFromQuoteHistory){ //Urmila A, 29-mar-23 
           this.isSpreadVisible = true;
        }else{
          this.fnbtncheck('FXD_Spread_Btn_Visibility', this.RouteFromWorkflow === true ?
          this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')
        }
      
    
        if(chkMode === 'SEN'){
              this.isOrderBtnVisible = false; // Order Button disabled | Chaitanya M | 02-April-2024         
        }else if(chkMode === 'QEN'){
              this.isRoutetoDealerVisible = true;
        }
        if(chkMode === 'SEN' && this.NewOrderfromRMUnlocked === true){
              this.isRejectVisible = true;
        }else{  //Added by Urmila A | 17-Mar-23
          this.isRejectVisible = false;
        }
         
        console.log('this.isEmailQuoteVisible',this.isEmailQuoteVisible,
        'this.isOrderBtnVisible',this.isOrderBtnVisible,
        'this.isRejectVisible',this.isRejectVisible,
        'this.isRoutetoDealerVisible',this.isRoutetoDealerVisible,
        'this.isResetvisible',this.isResetvisible,
        'this.isSchedulevisible',this.isSchedulevisible     
        ) 
  }

  //Urmila A | checks button visibility | starts 
  fnbtncheck(ReqConfig, chkRoute): any {
    switch (ReqConfig) {
            case 'TradeIdeaBtnAccess_LoginUserGroup' :
                     // fngetCommondata added by Urmila A | 29-Aug-23
                    this.CommomDataSubscriber = this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                        try{
                            res = res.cvpData; //mappings modified by Chaitanya M | 29-Nov-23
                            res.forEach(element => {
                              if(chkRoute === 'Pricer'){
                                  if(element.value.includes(',')){
                                    if (element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))) {
                                      this.isSaveTradevisible = true
                                    }
                                  }else{
                                      if(element.value === sessionStorage.getItem('FXDgroupID')){
                                        this.isSaveTradevisible = true
                                      }
                                  }  
                              }else{
                                  if(element.Misc1.includes(',')){
                                    if (element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))) {
                                      this.isSaveTradevisible = true
                                    }
                                  }else{
                                        if(element.value === sessionStorage.getItem('FXDgroupID')){
                                          this.isSaveTradevisible = true
                                        }
                                  }  
                              }                         
                            }); 
                            console.log('this.isSaveTradevisible',this.isSaveTradevisible)    
                        }catch(err){ }                                                              
                    }              
                  });
                
                  break;
            case 'FXD_Spread_Btn_Visibility':
              //fngetCommondata added by Urmila A | 29-Aug-23
              this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                      try{
                          res = res.cvpData;
                          res.forEach(element => {                          
                                if (chkRoute.toUpperCase() === element.DATA_VALUE.toUpperCase() ) {                                                           
                                    if(element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))){
                                      this.isSpreadVisible = true;
                                    }                                      
                                }                          
                          }); 
                        console.log('this.isSpreadVisible',this.isSpreadVisible)   
                      } catch(err){}                 
                    }              
                  });
                  break;
      }    
  }
  //ends


  
  // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 15-Dec-22
  fnSetRFQDetailsFromNotemasterID(data){
    this.TemplateCode = this.TemplateCode;
    this.TemplateID = this.TemplateID
    this.selectedProduct = data.Product_Code;
    this.Product_Code = data.Product_Code;  //Urmila A | 23-Jan-23 | LGTGTWINT-1170
    this.Product_Name= data.Product_Name
    this.AltCcy = data.Alternate_Ccy;
    this.DepCcy = data.Deposit_Ccy;    
    this.custPremDirection = data.CustPayReceiveDir;
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila A | 17-feb-23 | LGTCLI-314
    this.CcySearch = this.CurrencyPair =  data.Deal_Pair; //Added by Urmila A | 11-Jan-23      
    this.fnPointShift(data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23
    // this.AskSpot = data.Ask_Rate;
    // this.SelectedPricingMode = data.AutoManual_Type; //commented by Urmila A | 11-Jan-23 
    // this.BidSpot = data.Bid_Rate;
    this.NotionalPerFixing=  this.FXD_cfs.numberWithCommas(data.NotionalPerFixing); // HSBCFXEINT-15 | Chaitanya M | 06 Dec 2023
    let frequency = data.Frequency
    this.FixingFreqArr.push(frequency);
    this.FixingSettFreq=this.FixingFreqArr[0];
    this.NoOfSett = data.NoOfSettlement;
    this.SelectedKIStyle  = data.KIType.toUpperCase() === 'NO' ? this.SelectedKIStyle = 'No' : 'Yes' // HSBCFXEINT-15 | Chaitanya M | 06 Dec 2023
    this.Leverage = data.Leverage;
    
    this.GuaranteedPeriods = data.GuaranteedPeriods;
   
    let entity = {
      Code: data.Entity_ID,Value: data.Entity_Name
    }
    this.EntityData.push(entity);
    let optioncut =data.OptionCut
    this.OptionCutOptions.push(optioncut);
    this.BlotterRFQ = data.ParentRFQNumber; 

    //added by Urmila A, 4-april-23 | LGTGTWINT-1824 | to update dates only when routed from workflow
    if(this.RouteFromWorkflow){
      this.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.Premiumdate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.FinalFixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date);
      this.FinalSettDate = this.FXD_cfs.convertDate(data.Deposit_End_Date);
      this.prevFirstFixingDate = this.FirstFixingDate = this.FXD_cfs.convertDate(data.FirstFixingDate);  //urmila A, 5-april-23 , LGTGTWINT-1846
    }else if(this.RouteFromQuoteHistory){
      this.TradeDate = this.FXD_cfs.convertDate(new Date())
    }

    this.OptionCut =data.OptionCut;
    this.TenorDays =data.Option_Days;
    this.Tenor = data.Input_Tenure;
    this.TenorOptions.push(data.Input_Tenure)
    this.NotionalAmt = this.FXD_cfs.numberWithCommas(data.OptionNotional);
    this.NotionalCcy = data.Deposit_Ccy;
    this.IBPremCcy=data.RFQ_Prem_Ccy;
    this.Upfront = this.FXD_cfs.numberWithCommas(Number(data.Spread_PA).toFixed(4));
    if(data.RFQ_Mkt_Prem_Amt1.includes(',')){ //Added by Urmila A | LGTGTWINT-890 | 9-Jan-23
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1.replaceAll(',','')).toFixed(2));
    }else{
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1).toFixed(2));
    }
   
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2));  //upfront in Alt ccy
    this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2)); //upfront in USD
    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");

    // this.ContractSummary = this.FXD_cfs.fngetContractSumm(data.Contract_Summary); //added by UrmilaA | LGTGTWINT-2123 |14-June-23
    if(data.Contract_Summary.includes('color:green')){ //Urmila A | 16-feb-23 |LGTGTWINT-1429
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:green","color:var(--green) !important"))
    }else if(data.Contract_Summary.includes('color:red')){
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:red","color:var(--red) !important"))
    }else if(data.Contract_Summary === ''){
      this.ContractSummary=''
    }
 
    if(this.GuaranteedPeriods !== '' ){ //Urmila A | 27-Jan-23 | LGTCLI-276 | start
          let GuarenteeP;
          if(this.ContractSummary.changingThisBreaksApplicationSecurity.includes('Guaranteed Period until')){
              GuarenteeP =  this.ContractSummary.changingThisBreaksApplicationSecurity.split('Guaranteed Period until')[1].trim();    //Urmila A | LGTGTWINT-1251| 30-Jan-23 
              if(GuarenteeP.length > 11){
                GuarenteeP =  GuarenteeP.slice(0,11)
              }
              this.GuaranteedPeriodTill  = GuarenteeP        
          }          
    }//end
    this.RMRemark = data.RM_Remark;

    //Urmila A | Dealer remark visibility check | 24-feb-23 | LGTGTWINT-1504
    if(!this.TradeIdea){
      this.DealerRemark = data.Dealer_Remark; 
    }else if(this.TradeIdea){
      this.DealerRemark = '';
    }
       
    // this.SelectedLPForPricing = this.SampleArray[Number(data.RFQ_Price_Provider_ID)];
    this.OriginalIBPrem = Number(data.ParentRFQIBPremium.toString().replace(',','')).toFixed(2); //Added by Urmila A | 12-Jan-23 | LGTGTWINT-1018
    this.OriginalIBPremPer = data.Market_Premium_PC;     
    this.OrderDirection = data.Product_Code === 'FXAQ' ? 'Buy' : 'Sell'; 
    this.OptionType = 'Call'
    this.ClientPrem = '0.00'; //as confirmed with Rahul P
    if(data.PayReceiveDirection === 'IB Pays'){ //Check added by Urmila A | 17-Jan-23 | as were going blank in contract summary 
      this.IBPremDirection = 'Pay'
    }else if(data.PayReceiveDirection === ''){
      this.IBPremDirection = ''
    }else{
      this.IBPremDirection = 'Receive'
    }

    // console.log('OrderPlaceFlag', this.OrderPlaceFlag,
    // 'Orderplace',this.Orderplace,
    // '!BestPrice',this.BestPrice,
    // 'QuteMailClicked:',this.QuteMailClicked,
    // '!QuoteMailSent',this.QuoteMailSent,
    // 'routeToDealerClicked',this.routeToDealerClicked,
    // 'disabledRoutetodealeronSaveTrade',this.disabledRoutetodealeronSaveTrade,
    // 'confirmedRouteDealer',this.confirmedRouteDealer,
    // 'IsRouteToDealerExecuted',this.IsRouteToDealerExecuted,
    // '!routeToDealerClicked',this.routeToDealerClicked
    // )
    if(!this.ExecutedQueue ){
      this.fnGetProductDetails();
      this.fnGetPriceProviderandCcypairs() 
      this.fnGetOptionCutFXD();  
      this.fnGetFixingFreq(); //UrmilaA | LGTGTWINT-1895 | 5-July-23
      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory){
          this.NoteMasterID=''
          this.FirstFixingChangedYN='N'
          this.FirstFixingDate='';
          this.fnGetDatesCalculationforVB();  
      }
    }if(this.ExecutedQueue){
      this.fnGetProductDetails();
    }
    this.fnGetProductConfig(); 

        
  }

  // Added by Urmila A | RFQ Deal details
  fnRFQLockerForTimer(){
      this.RFQLockedSecLeft = 3000;
      this.RFQLockedInterval = setInterval(() => { 
            if(this.RFQLockedSecLeft > 0){
              this.RFQLockedSecLeft--;             
            }
            if(this.RFQLockedSecLeft === 0){
              clearInterval(this.RFQLockedInterval);
              this.fncallUnlockDeal();
            }
      },1000);
  }

  //Added by Urmila A | RFQ Deal details Unlock deal | 20-Dec-22 
  closeLockedDeal(){
      this.FXD_cfs.LockedDealPopUp = false;   
  }

//Added by Urmila A | RFQ Deal details Unlock deal | 8-Jan-24 |start
fncallUnlockDeal(){
  this.UnlockMsg='';
  this.unlockNotemasterSubscriber = this.FXD_afs.FXDUnLockNoteMasterIDForDIAPI(this.NoteToUnblock,this.FXD_afs.UserName).subscribe((res:any)=>{
          try{          
                  if (res) {
                      if(res.errors == undefined && res !== null){
                        if(res.result === true){
                              this.unlockNoteMasterYN = true;
                              // this.UnlockMsg = res.UnLockNoteMasterIDForDIResult.UnlockRFQMsg                             
                        }                       
                      }else{
                          this.FXD_cfs.LockedDealPopUp = false;
                          // this.UnlockMsg = res.UnLockNoteMasterIDForDIResult.UnlockRFQMsg
                          this.FXD_cfs.fnThrowError(res) // added by UrmilaA | F5SAAINT-612 | 30-Nov-23
                      }
                }
          }catch(err) {
            console.log(err)
          }
    });
}
//Added by Urmila A | RFQ Deal details Unlock deal | 8-Jan-24 |ends

  fnGetProductDetails(){ //Modified by Urmila A | 17-feb-23 
    try {
      this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
       //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
      this.prodDetailSubscriber=this.FXD_afs.fnGetProdDetailsFXD(this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
        if (res !== null)  {
          this.AllDataLoaded.productDetail = true;
          res = res[0]
          this.TemplateCode = res.Template_Code;
          this.Product_Name = res.Product_Name;
          this.TemplateID = res.Template_Id;
          this.Product_ID = res.Product_Id;
          this.Product_Code = res.product_code;
          // this.fnGetProductInfo(); //commented by Urmila a | 17-feb-23
          if(!this.IsNavigate){ //Urmila A | 17-feb-23
            this.fnGetPriceProviderandCcypairs();  
            this.fnGetFXDCurrencyPairs();
            // this.fnGetTenor();
          }   
        }
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
          this.AllAPIsLoaded=true;
        }
      });
     
    } catch (error) {
      console.log(error);
      //throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  }

  fnGetProductInfo(){
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
     this.AllDataLoaded.productinfo=false;  //Urmila A | LGTGTWINT-1295 | 10-Feb-23    
      this.productInfoSubscriber = this.FXD_afs.fnGetAllProductinfo(
        this.FXD_afs.EntityID,
        this.Mode,
        this.FXD_afs.UserName,
        this.Product_Code
      ).subscribe((res) => {      
        if (res !== null ) {
          this.AllDataLoaded.productinfo = true;
          res.GetAllProductInfoResult.ProductDetails.forEach(async (element) => {
            if (element.Product_Name === 'AQ' && this.selectedProduct === 'FXAQ') {
           
              this.Product_Name = element.Product_Name;
              this.Product_ID = element.Product_Id;
              this.Product_Code = element.Product_Code
            
              console.log('this.Product_Code',this.Product_Code);
           
              // this.fngetPersonalDefaultValues();      
              // !this.RouteFromWorkflow
              if(!this.IsNavigate){ //urmila a, 29-mar-23
                this.fnGetPriceProviderandCcypairs();     
              }
                     
            }

            else if(element.Product_Name === 'DQ' && this.selectedProduct === 'FXDQ'){
              this.Product_Name = element.Product_Name;
              this.Product_ID = element.Product_Id;
              this.Product_Code=element.Product_Code
            
              console.log('this.Product_Code',this.Product_Code);
             
              // this.fngetPersonalDefaultValues();
              if(!this.IsNavigate){
                this.fnGetPriceProviderandCcypairs();                                
              }
             
            }
            if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
              this.AllAPIsLoaded=true;
            }
          });
          
        }
      });
  }

  
 

  //Modified by Urmila A | 24-feb-23 
  ngOnDestroy() {

    if(this.ScheduleSub){ //Urmila A |LGTGTWINT-1501 | 24-feb-23
      this.ScheduleSub.unsubscribe()
    }
    if(this.SignalRsubscriber){  //UrmilaA, 9-may-23, LGTCLI-361
      this.SignalRsubscriber.unsubscribe()
    }
    if(this.CancelSignalRconnectionSub){  //UrmilaA, 10-may-23, LGTCLI-361
      this.CancelSignalRconnectionSub.unsubscribe()
    }

    this.CurrencyPairList = []; //Urmila A | 24-feb-23
    this.DestroyFn();   
    this.fnUnsubscribeAllCalls();
   
  }

  
  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 17-May-23 | start
  resetSignalRPrice(){
    this.ServiceResponse=null;
    this.FXD_afs.RFSRes.next(this.ServiceResponse) 

    //added by urmilaA | LGTGTWINT-2110 |start
    clearInterval(this.MinInterval)
    clearInterval(this.maxInterval)
    clearTimeout(this.MaxTimeout)
    clearTimeout(this.MinTimeput)
    //added by urmilaA | LGTGTWINT-2110 |ends

  }
   //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 17-May-23 | ends


  //Added by Urmila A | 24-feb-23
  DestroyFn(){
    this.btnEnable=false; //UrmilaA |LGTCLI-361 | 22-May-23
    this.closeSignalR() //UrmilaA, 22-May-23 | LGTGTWINT-1147

      this.OrderPlaced = false
      this.OrderPlacedPopup =false;
      this.OrderPlaceFlag=false;
      this.SessionInvalid = false; 
      this.TenorOptions = [];
      // this.CurrencyPairList = []; //Urmila A | 24-feb-23

      this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361
      this.ScheduleCallWithGuarenteeperiod=false;
      this.ViewScheduleflag=false;
      this.scheduleBtnClick=false;

      this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
        navigate: false, 
        ProdcutCode: '',
        ReFNo:"",
        ProductID: '',
        redirectFrom: ''
      })
      if(this.FXD_RFQDealDetailsNavigateSubscriber){
        this.FXD_RFQDealDetailsNavigateSubscriber.unsubscribe();
        if(this.RFQDetailsFromNoteMasterSubscrber){
          this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
        }
      }
      if(this.RFQDetailsFromNoteMasterSubscrber){
        this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
      }
      this.fnUnsubscribeAllCalls();
  }


  fnUnsubscribeAllCalls(){

    //UrmilaA, 17-May-23, LGTCLI-361 | start
    this.ServiceResponse=null;
    this.FXD_afs.RFSRes.next(this.ServiceResponse) 
    //UrmilaA, 17-May-23, LGTCLI-361 | ends

    this.FXD_afs.FXD_Schedule_GuratenteeTillDate_AQDQ.next({Gperiod:'',GperiodTill:''}); //Urmila A | LGTGTWINT-1332 | 6-feb-23
    if(this.unlockNotemasterSubscriber ){
      this.unlockNotemasterSubscriber.unsubscribe()
    }
    if(this.RouteFromWorkflow){
      this.fncallUnlockDeal();
    }
    if(this.prodDetailSubscriber){
      this.prodDetailSubscriber.unsubscribe();
    }
    if(this.FXDProductDetailsSubscriber){   
      this.FXDProductDetailsSubscriber.unsubscribe()
    }
    if(this.productInfoSubscriber){  
      this.productInfoSubscriber.unsubscribe();     
    }
    if (this.FXPriceProvidersubscription){
      this.FXPriceProvidersubscription.unsubscribe();
    } 
    if(this.FXDEntitySubscriber){
      this.FXDEntitySubscriber.unsubscribe()
    }
    if(this.FXDEntitySubscriber){
      this.FXDEntitySubscriber.unsubscribe()
    }
    if (this.FXPriceProvidersubscription){
      this.FXPriceProvidersubscription.unsubscribe();
    }
    if (this.FXCurrencyPairsubscription){
      this.FXCurrencyPairsubscription.unsubscribe();
    }   
  
    if (this.FXBidAsksubscription){
      this.FXBidAsksubscription.unsubscribe();
    }
    if (this.TenorDayssubscription) {
      this.TenorDayssubscription.unsubscribe();
    }
  
    if (this.FXDatesCalculationsubscription){
      this.FXDatesCalculationsubscription.unsubscribe();
    }    
 
    if (this.Bestpricesubscription) {
      this.Bestpricesubscription.unsubscribe();
    }
    if (this.BookOrdersubscription) {
      this.BookOrdersubscription.unsubscribe();
    }
    if (this.GetPriceProviderDetailsSubscription){
      this.GetPriceProviderDetailsSubscription.unsubscribe();
    }   
    if(this.GetTenorSubscriber){
      this.GetTenorSubscriber.unsubscribe()
    }
    if(this.getBidaskSubscriber){
      this.getBidaskSubscriber.unsubscribe()
    }
    if(this.FXDContractSummSubscriber){
      this.FXDContractSummSubscriber.unsubscribe()
    }
    if(this.FXDSendQuoteMailSubscriber){
      this.FXDSendQuoteMailSubscriber.unsubscribe()
    }
    if(this.FXDOptionCutSubscriber){
      this.FXDOptionCutSubscriber.unsubscribe()
    }
    if(this.FXDFirstFixingDateSubscriber){
      this.FXDFirstFixingDateSubscriber.unsubscribe()
    }
    if(this.FXDGetNoofSettSubscriber){
      this.FXDGetNoofSettSubscriber.unsubscribe()
    }
    if(this.PersonalDefaultValueSubscriber){
      this.PersonalDefaultValueSubscriber.unsubscribe()
    }
    if(this.RejectSubscriber){
      this.RejectSubscriber.unsubscribe()
    }
    if(this.FXDRouteToDealerSubscriber) this.FXDRouteToDealerSubscriber.unsubscribe();
    if(this.RFQDetailsFromNoteMasterSubscrber) {
      this.RFQDetailsFromNoteMasterSubscrber.unsubscribe()
    }
    if(this.CommomDataSubscriber){ //Urmila A | 22-feb-23
      this.CommomDataSubscriber.unsubscribe()
    }

    if(this.fxdProdCofigSubsriber){  //UrmilaA, 9-May-23, LGTCLI-361
      this.fxdProdCofigSubsriber.unsubscribe()
    }

    if(this.fixingSubscriber){ //UrmilaA | LGTGTWINT-1895 | 14-June-23
      this.fixingSubscriber.unsubscribe()
    }
  }



  // added by Urmila A | 13-Dec-22 | LGTGTWINT-340 |start
  fnChngeGuarenteePeriods(e){
    this.ContractSummary = '' //Urmila A | 23-Jan-23| LGTGTWINT-1166
      this.GuaranteedPeriods = '' //Urmila A | LGTGTWINT-1209 | 2-Feb-23
      this.ScheduleCallWithGuarenteeperiod=false;
      this.ViewScheduleflag = true
      this.GuaranteedPeriods  = e.target.value;     
      if(Number(this.GuaranteedPeriods) > 0){
        this.AllAPIsLoaded=false; //Urmila A | 16-feb-23
        this.GperiodChange =true;
        // if(RouteFromWorkflow)
        if(this.IsNavigate && !this.BestPrice){  //Urmila A | LGTGTWINT-1209 - scenario 6 | 2-feb-23
          this.NoteMasterID = '' //Urmila A | LGTGTWINT-1332 | 6-Feb-23
        }else if(this.IsNavigate && this.BestPrice){
              this.NoteMasterID = this.NoteMasterID
        }//end
          this.fnShowOrHideShedule();
          this.ScheduleCallWithGuarenteeperiod = true;
          this.ViewScheduleflag = false;
      } else if(Number(this.GuaranteedPeriods) === 0){
          this.AllAPIsLoaded=true; //Urmila A | 16-feb-23
          this.ScheduleCallWithGuarenteeperiod = false;  //Urmila A | LGTGTWINT-1209 | 25-Jan-23
          this.GuaranteedPeriodTill = '';
          this.ViewScheduleflag = false;
          this.fnGetContractSummary()
      }
  }
  // added by Urmila A | 13-Dec-22 | LGTGTWINT-340 |end
  fnGetContractSummary() {  
    this.ContractSummary = ''
    Number(this.NotionalAmt.replace(/,/g, '')) > 0 ?  this.AltNotional = this.NotionalCcy === this.DepCcy ?  parseInt(this.NotionalAmt.replace(/,/g, ''), 10) / Number(this.Strike) : 
    parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * Number(this.Strike) : ''
      //new    
      this.FXDContractSummSubscriber =  this.FXD_afs.fnGetContractSummary(
        Number(this.FXD_afs.EntityID), 
        this.FXD_afs.UserName,
        //this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
        // this.FXD_afs.EntityID,
        this.TemplateCode.toUpperCase(),
        this.Product_Code, 
        (this.OrderDirection || ''), // HSBCFXEINT-15 | Chaitanya M | 06 Dec 2023
        this.CurrencyPair,
        this.OptionType,
        this.NotionalCcy,
        this.NotionalCcy === this.DepCcy ? this.AltCcy : this.DepCcy,
        this.IBPremCcy,
        parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.NotionalAmt.replace(/,/g, '')) : 0 ,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
        parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.NotionalPerFixing.replace(/,/g, '')) : 0,this.Tenor,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
        this.FinalFixingDate,
        this.FinalSettDate,//settlement
        '',//longdate
        '', //shortdate
        Number(this.Strike) > 0 ? Number(this.Strike) : 0,//this.Strike //Urmila A | 23-Jan-23
        this.OptionCut,
        '',//barriertype
        '',//Exotic code
        '',// digitaltype
        this.Product_Code === 'FXAQ' ? Number(this.KORate) > 0 ? Number(this.KORate).toFixed(this.PointShift) :  0.00 : 0,//upperbarrier
        this.Product_Code === 'FXDQ' ? Number(this.KORate) > 0 ? Number(this.KORate).toFixed(this.PointShift) :  0.00 : 0,//lowerbarrier
        this.Leverage,
        Number(this.NoOfSett) > 0 ? Number(this.NoOfSett) : 0,
        Number(this.NoOfSett) > 0 ? Number(this.NoOfSett) : 0,//No of fixing
        this.FixingSettFreq,
        this.FixingSettFreq,//sett freq
        0.00,//lower strike
        0.00,//upper strike
        0.00,//pivot strike
        '',//spread type
        this.custPremDirection,//cust prem dir
        this.BestPrice ? this.IBPremDirection : '', //IB prem dir //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        this.BestPrice ? parseFloat(this.IBPrem)  ? parseFloat(this.IBPrem.replace(/,/g, '')) : 0 : 0, //Urmila A | 1-Feb-23 | LGTGTWINT-1209 
        0.00,//RTC
        this.BestPrice ? Number(this.Upfront)  ? Number(this.Upfront) : 0 : 0,//IB prem perc , LGTGTWINT-685, //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        0.00,//RTC perc
        0.00,//Target
        0.00,//target notional
        'No',//KI style rate
        0.00, //lower KI
        0.00,//UpperKI 
        this.GuaranteedPeriodTill !== '' && this.GuaranteedPeriodTill !== '0' ? this.GuaranteedPeriodTill : '',//Guarentee till , modified by Urmila A | 30-Jan-23
        Number(this.GuaranteedPeriods) > 0 ? Number(this.GuaranteedPeriods) : 0, //Guaranteed Periods  | 30-Jan-23
        '',//capped loss ccy
        '', //capped losstype
        '',//capped loss
        0.00,//capped loss amt
        '',//target big fig
        '',//target per unit
        0.00,//target in pips
        0.00,//KOITME event
        '',//strikestype
        this.FirstFixingDate,
        '',//final pay type
        '',//fixing adjustment
        
      ).subscribe((res) => {
        if (res) {
          try{
            // this.cnt=2;
            console.log(res);
            this.ContractSummary='' ; // Urmila A | 30-Jan-23
            res =  res.result.toString().replaceAll("\\n", "<br>"); // Urmila A | 28-Jan-23
            // this.ContractSummary = res.GetContractSummaryResult.ContractSummary
            // .toString().replaceAll("\\n", "<br>"); //commented by Urmila A | 28-Jan-23
            //this.ContractSummary = this.FXD_cfs.fngetContractSumm(res); //UrmilaA | LGTGTWINT-2123 | 14-June-23
            if(res.includes('color:green')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:green","color:var(--green) !important"))
            }else if(res.includes('color:red')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:red","color:var(--red) !important"))
            }         
            console.log('contract summ: ', this.ContractSummary)         
          }catch(err){}
                  
        }
      });
    
  }

   fnGetOptionCutFXD() {
    this.OptionCutOptions=[]
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.optioncut = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.FXDOptionCutSubscriber =  this.FXD_afs.fnGetOptionCutFXD(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      this.CurrencyPair,
      this.CustomerID,
      this.FXD_afs.UserName
    ).subscribe((res) => {   
      if(res.length > 0 && res !== null)
      {
          this.AllDataLoaded.optioncut = true;
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 |start
          res.forEach((element,i) => {       
            if (element.OptionCut === 'BFIXTOK') {
              res.splice(i,1)
              res.unshift(element)
            }     
          });
          res.forEach(element => {
            this.OptionCutOptions.push(element.OptionCut);
          });
          this.OptionCut = res[0].OptionCut;
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 | end


          // if(!this.RouteFromWorkflow &&  !this.CurrencyChanged)
          if(!this.IsNavigate &&  !this.CurrencyChanged){ //UrmilaA | 27-feb-23| LGTGTWINT-1538
            this.fnGetTenorfromFixings();  
            // this.fnGetDatesCalculationforVB();
          }
         
         
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }
        
      }     
      else
      {
        this.AllDataLoaded.optioncut = true;
        // this.NotificationFunction("Error","Error" , res.Get_OptionCutResult.A_ResponseHeader.FailedReason)
      }
    });
  }

   fnGetPriceProviderandCcypairs() {
    console.log("pp details ", this.Product_Code);
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.priceprovider = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.SampleArray=[]
    this.FXPriceProvidersubscription =  this.FXD_afs.GetPriceProviderDetails(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Mode,
      this.UserGroup,
      this.FXD_afs.UserName,
      this.PricingMode, //Core migration: API req parameters are modified | Urmila A | 31-Aug-23 
    ).subscribe( (res) => {
      if (res) {
        this.AllDataLoaded.priceprovider = true;
        this.PriceProviderString='';
        this.SampleArray = this.PriceproviderArr = res
        //changes added by Urmila A, 17-April-23, to get Price provider string , made common function
        this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)
        
        //below code commented by UrmilaA, 17-april-23 | start
        // this.SampleArray.forEach((element) => {
        //     this.PriceProviderString === ''
        //       ? (this.PriceProviderString = '' + element.PP_Code)
        //       : (this.PriceProviderString =
        //         this.PriceProviderString + ':' + element.PP_Code);     
        // });
        //below code commented by UrmilaA, 17-april-23, end


        // console.log('price provider string:',this.PriceProviderString.trim())
        // this.SampleArray.splice(HSBCIndex, 1);

        // this.SampleArray.push({
        //   PP_Code: 'Best',
        //   PP_CustomerId: '',
        //   PP_ExternalCode: '',
        //   PP_Id: '',
        //   PP_Name: 'Best',
        //   PP_Round_Strike_Diff: '',
        //   PP_TwoStepOrderExecutionYN: '',
        //   PP_Type: '',
        // });
        this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
        // this.SampleArray.sort((a, b) => {
        //   return b.PP_Name - a.PP_Name;
        // });
      }
      console.log('Lps:',this.SampleArray)
     
      if(this.IsNavigate){ //urmila a, 29-mar-23
        this.fnGetSelectedCCYDetails();
      }
       //end by Urmila A | 11-Jan-23


       if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
        this.AllAPIsLoaded=true;
       }
      
    });
    
  }

  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | start
  fnGetSelectedCCYDetails(){
    //Core-Migration | API req parameters are modified by Urmila A | 23-Aug-23 
    this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      this.DepCcy, //selectedDepoCcy
      this.AltCcy, //selectedAltCcy
      this.CcySearch,
      this.OptionCut
    ).subscribe((res)=>{
        try{
          //mappings modified by Urmila A | 31-Aug-23 | as service side 
          if(res.length > 0 && res !== null){              
                  this.AllDataLoaded.ccypairs = true;
                  res.forEach(async (element) => {
                    this.CurrencyPairList.push(element);             
                    this.Pair_Cross_YN = element.pair_Cross_YN;
                    this.Left_USD_Pair = element.left_USD_Pair;
                    this.Right_USD_Pair = element.right_USD_Pair;  
                    this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
                    this.Asset2_DecimalAmount = element.asset2_DecimalAmount;         
                  });
                  if (this.Pair_Cross_YN === 'Y') {
                    this.FindLeftUSDMidRate(this.Left_USD_Pair);
                    this.FindRightUSDMidRate(this.Right_USD_Pair);
                  }
                  if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 14-Feb-23 |
                    this.AllAPIsLoaded=true;
                   }
              }
        }catch(err){
          console.log(err)
        }
    })
  }
  //Added by Urmila A | 11-Jan-23 | end

   fnGetFXDCurrencyPairs() {
    this.AllDataLoaded.ccypairs = false;
     this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      '', //selectedDepoCcy 
      '', //selectedAlternatCcy
      '' ,//CcySearch - Added by Urmila A | 11-Jan-23  
      this.OptionCut
    ).subscribe((res) => {
      this.CurrencyPairList=[]; //Added by Urmila A | LGTGTWINT-753 | 6-Jan-23
      //mappings modified by Urmila A | 31-Aug-23 | as service side 
      if (res !== null && res.length > 0) {
        this.AllDataLoaded.ccypairs = true;
        res.forEach(async (element, index) => {
          this.CurrencyPairList.push(element);
          if (this.CurrencyPairList[index].asset_Pair === 'EUR - USD') {
            this.CurrencyPair = this.CurrencyPairList[index].asset_Pair;
            this.DepCcy = this.CurrencyPair.slice(0, 3);
            this.AltCcy = this.CurrencyPair.slice(6, 9);
            this.NotionalCcy = this.DepCcy;
            this.IBPremCcy = this.DepCcy;
            this.Pair_Cross_YN = element.pair_Cross_YN;
            this.Left_USD_Pair = element.left_USD_Pair;
            this.Right_USD_Pair = element.right_USD_Pair;  
            this.fnGetBidAskRates();        
            this.fnGetOptionCutFXD();
            this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
            this.Asset2_DecimalAmount = element.asset2_DecimalAmount;  
          }
        });
        if (this.Pair_Cross_YN === 'Y') {
          this.FindLeftUSDMidRate(this.Left_USD_Pair);
          this.FindRightUSDMidRate(this.Right_USD_Pair);
        }
        this.FXD_cfs.sort_by_key(this.CurrencyPairList, 'asset_Pair');
      
      }
    });
  }
  // Added by Urmila A | 29-Nov-22 | start
  fnOptionCutChange(e){
    this.OptionCut = e.target.value;
    this.fnGetDatesCalculationforVB()
  }
  firstFixingDateChngfn(e){    //Urmila A |LGTCLI-278 | 6-Feb-23
    let date:any = new Date( e.target.value)
    if(date.toString().includes('Sat') || date.toString().includes('Sun')){
        this.NotificationFunction("Error","Error" , 'First fixing date should not fall on holiday') //modified on 2-Mar-23 | LGTGTWINT-1607
    }else if(e.target.value !== ''){ //urmila A, 5-april-23 , LGTGTWINT-1846
      this.prevFirstFixingDate = this.FirstFixingDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd'); //Urmila A | 8-Mar-23  
      this.FirstFixingChangedYN = 'Y';
      this.AllDataLoaded.firstfixingdate = true; //Urmila A | 3-Feb-23
      this.fnGetDatesCalculationforVB()    
    }else if(e.target.value === ''){  //urmila A, 5-april-23 , LGTGTWINT-1846
      this.FirstFixingDate = this.prevFirstFixingDate
      this.FirstFixingChangedYN = 'N';
    }
   
    // this.datepipe.transform(this.FirstFixingDate, 'yyyy-MM-dd')
    
  }
  

  // Added by Urmila A | 29-Nov-22 | end
  
  fnGetTenor() {
    this.AllDataLoaded.tenor=false //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.GetTenorSubscriber = this.FXD_afs.fnGetTenor(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      'T',
      this.FXD_afs.UserName
    ).subscribe((res) => {
      //mapping modified by Urmila A | 31-Aug-23 | as response modified
      if (res.length > 0 && res !== null) {
        this.AllDataLoaded.tenor = true;
        res.forEach((element) => {
          if (element) {
            this.TenorOptions.push(element.Member_ID);
          }
        });
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  fnGetBidAskRates() {
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.bidask = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
   this.getBidaskSubscriber =this.FXD_afs.GetBidAskVB(   //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {

        //mapping modified by Urmila A | 31-Aug-23 
        this.AllDataLoaded.bidask = true;
        this.BidSpot = parseFloat(res.BidRate).toFixed(Number(res.PointShift)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

        this.AskSpot = parseFloat(res.AskRate).toFixed(Number(res.PointShift)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

        // this.SpotMidRate= parseFloat(res.MidRate);  // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
        this.SpotMidRate = ((Number(this.AskSpot) + Number(this.BidSpot)) / 2 ).toFixed(res.PointShift);  // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
        
        this.PointShift = res.PointShift //Urmila A |27-feb-23 |LGTGTWINT-1526
        this.GetStrikeRate();

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23 | start
  fnPointShift(data){
   this.getBidaskSubscriber =this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration   
      this.Product_Code,
      this.CurrencyPair,
     this.FXD_cfs.fngetMode(),
     this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {     
          this.PointShift = res.PointShift //Urmila A |27-feb-23 |LGTGTWINT-1526    
          this.SpotMidRate = ((Number(data.Ask_Rate) + Number(data.Bid_Rate)) / 2 ).toFixed(this.PointShift) //Added by Urmila A | LGTGTWINT-1693 | 9-mar-23
          this.Strike = Number(data.Strike_Rate).toFixed(this.PointShift);
          if(data.Product_Code === 'FXAQ'){
            this.KORate =  Number(data.OptionUpperBarrier).toFixed(this.PointShift)
          }else{  
            this.KORate = Number(data.OptionLowerBarrier).toFixed(this.PointShift);
          } 

        //added by Urmila A, LGTGTWINT-1824 , 4-april-23
        if(this.RouteFromQuoteHistory){
          this.BidSpot = (parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          this.AskSpot = (parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }else if(this.RouteFromWorkflow){   //pointshift changes added by UrmilaA | LGTGTWINT-2061 | 1-June-23 | start          
              this.AskSpot = parseFloat(data.Ask_Rate).toFixed(this.PointShift);      
              this.BidSpot = parseFloat(data.Bid_Rate).toFixed(this.PointShift);
              //pointshift changes added by UrmilaA | 1-June-23 | ends
        }
        
      }
    });
  }
  //end

   fnGetDatesCalculationforVB() {
    this.FinalFixingDate = '' ;  // Urmila A | 6-Sep-22
    this.FinalSettDate = ''; // Urmila A | 6-Sep-22
    this.Premiumdate = '';
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.datecalculation = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.FXDatesCalculationsubscription =  this.FXD_afs.GetDatesCalculationforVB(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.DepCcy,
      this.AltCcy,
      this.FixingSettFreq.split('/')[0],
      this.FixingSettFreq.split('/')[1],
      this.Tenor,
      this.OptionCut,
      this.TradeDate,
      // this.TenorDays,
      this.Mode,
      this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  'N' : this.FirstFixingChangedYN , //Urmila A | LGTGTWINT-1203 | 31-Jan-23
      this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  '' : this.FirstFixingDate, //Urmila A | LGTGTWINT-1203 | 31-Jan-23
    
      ).subscribe((res) => {
     //mappings modified by Urmila A | 4-Sep-23
        if (res !== null) {
        this.AllDataLoaded.datecalculation = true;
        this.LoadingAQDQFlag = false;
        this.Premiumdate = res[0].valueDate;
        this.FinalFixingDate = res[0].fixingDate;
        this.FinalSettDate = res[0].maturityDate;
        this.TenorDays = res[0].expiryDays;
         
        if(this.FixingSettChngYN === 'Y' &&  !this.firstFixChngAndDatesReceived){
          this.getfnCalculateFirstFixingDate();  
        }else if(this.FirstFixingChangedYN === 'N' && this.NoofSettChangeYN === 'N'){
          this.getfnCalculateFirstFixingDate();  
        } else if(this.CurrencyChanged){
          this.getfnCalculateFirstFixingDate();
        }else{  //Urmila A | 12-Jan-23 | start |LGTGTWINT-1003
          this.fnGetContractSummary();
        }//end | 12-Jan-23
       
       

        //Added by Urmila A | LGTGTWINT-1209 | 1-Feb-23 | start
        if(this.FirstFixingChangedYN === 'Y'){
            if(Number(this.GuaranteedPeriods) > 0){
              this.ContractSummary = '';
              this.fnShowOrHideShedule();
              this.ScheduleCallWithGuarenteeperiod = true;
              this.ViewScheduleflag = false;
              this.ResetAllFields();
            }else if(Number(this.GuaranteedPeriods) === 0 || this.GuaranteedPeriods === ''){
                this.GuaranteedPeriodTill = '';
                this.fnGetContractSummary();  
            }
        }     
        //Added by Urmila A | LGTGTWINT-1209 | 11-Jan-23 | end
        
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  CallScheduleComp() {
    this.ScheduleVisibility = true;
    // this.ScheduleComp.listen(this.NoteMasterID, 'AQDQ');
  }

   async SetDefaultValues() {
    try {
      this.CustomerID =  '1' 
      this.Delta = null;
      this.DeltaAmt = null;
      this.DeltaCcy = '';

      this.GuaranteedPeriods = '0';
      this.CurrencyPair = 'EUR - USD';
      // this.PriceProviderString = '';
      this.DepCcy = this.CurrencyPair.substr(0, 3);
      this.AltCcy = this.CurrencyPair.substr(6, 8);
      this.IBPremCcy = this.DepCcy;
      this.NotionalCcy = this.DepCcy;
      this.NotionalPerFixing = this.FXD_cfs.numberWithCommas("100000.00"); //Urmila A | 2-Mar-23
      
      //Commented by Urmila A | 6-Mar-23
      // this.Tenor = '1Y';
      // this.TenorDays = 365;
      // if(this.Tenor.includes('W')){
      //   this.TenorDays = parseInt(this.Tenor) * 7
      // }else if(this.Tenor.includes('M')){
      //       this.TenorDays = parseInt(this.Tenor) * 30
      // }else if(this.Tenor.includes('Y')){
      //   this.TenorDays = parseInt(this.Tenor) * 365
      // }
     
      this.Leverage = 2;
      // this.GuaranteedPeriods = '0';
      this.SelectedKIStyle = 'NO';
     

      //Added by Urmila A | 6-Mar-23
      // || this.ResetPricerFlag, added by urmila A, 17-Mar-23 |LGTGTWINT-1737
      if(this.Product_Name === 'AQ' ){
             this.OrderDirection = 'Buy';
             this.selectedProduct = 'FXAQ';
             this.Product_Code = 'FXAQ' //Urmila A | 16-Jan-23 | LGTGTWINT-1052
      }else {
            this.OrderDirection = 'Sell';
            this.selectedProduct = 'FXDQ';
            this.Product_Code = 'FXDQ' //Urmila A | 16-Jan-23 | LGTGTWINT-1052
      }
    
     
    
      this.IBPrem = '0.00';
      this.ClientPrem = '0.00';
      this.Upfront = '';
      this.UpfrontCcy = 0.0;
    
      //modified default settleFreq & Noofsett by Urmila A | LGTCLI-325 | 24-feb-23
      // this.FixingSettFreq = 'Weekly/Weekly';
      this.NoOfSett= 52;
    
      this.NotionalAmt = this.FXD_cfs.numberWithCommas(parseInt(this.NotionalPerFixing.replace(/,/g, '')) * Number(this.NoOfSett));

   
      // this.NotionalAmt = '100,000.00';
      this.loadflag = false;
      this.OrderPlaceFlag = false;
      this.ViewScheduleflag = false;
      this.OrderBlotterVisibility = false;
      this.ScheduleVisibility = false;
      this.StrikePoint = 0;
      this.OptionType = 'Call';
      this.KORate = '';
      this.KIRate = '';
      this.d = new Date();
      let Daystring;
      const Day = this.d.getDate();
      if (Day < 10) {
        Daystring = '0' + Day;
      } else {
        Daystring = '' + Day;
      }
      this.TradeDate =
        Daystring +
        '-' +
        this.months[this.d.getMonth()] +
        '-' +
        this.d.getFullYear();
      this.SeletcedPricingModel = 'Black Scholes';
    
      // this.FirstFixingDate='';
      this.FirstFixingChangedYN = 'N'
      this.UpfrontAlt=''; //Changed by Urmila A | 11-Jan-23
      this.UpfrontVal=''; //Changed by Urmila A | 11-Jan-23
      this.custPremDirection='';
      this.IBPremDirection='';
      this.AltNotional = 0;
      this.NoofSettChangeYN = 'N';
      this.FixingSettChngYN = 'N';
      // this.ProdChangedYN=false;  
      this.OrderClicked=false;
      this.RMRemark = '';
      this.firstFixChngAndDatesReceived = false;
      this.ScheduleCallWithGuarenteeperiod=false;
      // this.RouteFromWorkflow = false;
      this.OrderPlacedPopup=false;
      this.Parant_DCDRFQID='';
      this.DI_YN='N';
      this.NoteMasterID='0';
      this.ExecutedQueue=false;
      this.TradeIdea=false;
      this.ExpiredTradeIdea =false;
      this.NewOrderfromRMUnlocked=false;
      this.NewOrderfromRMLocked =false;
      this.RejectedOrder=false;
      this.PriceRecAfterRepricefromBlotter=false;
      this.BlotterRFQ='';
      this.RejectRedirectedOrder=false;
      this.RejectedOrderMSG = '';
      this.unlockNoteMasterYN=false;
      this.RFQLockedBy ='';
      this.DealerRemark='';
      clearInterval(this.RFQLockedInterval);
      this.ccy1=false;
      this.ccy2=false;
      this.ClearLPs = false;
      this.DIfromTradeIdea='';
      this.CurrencyChanged=false; //Added by Urmila A | 7-Jan-23
      this.BestPricelbl =  'Best Price' //HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
   
    } catch (error) {
      console.log(error);
      // throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  

    try {

    } catch (error) {
      console.log(error);
      // throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  }

  // Added by Urmila A | 28-Dec-22
  resetLPsOnSpreadClick(){
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    this.IBPrem = '0.00';
    this.ClientPrem = '0.00';
    this.Upfront = '';
    this.Orderplace = '';
    this.loadflag = false;
    this.ViewScheduleflag = false;
    this.DealNo = '';
    this.ScheduleVisibility = false;
    this.OrderBlotterVisibility = false;
    this.OrderPlaceFlag = false;
    this.ClearPricingFlag = true; 
    this.orderMsg=''
    this.DealNo=''
    this.Orderplace=''
    this.UpfrontAlt=''; //Changed by Urmila A | 11-Jan-23
    this.UpfrontVal=''; //Changed by Urmila A | 11-Jan-23
    this.DCDRfqId='';
  }
  ResetAllFields() {
    this.FXD_cfs.saveTradeDone=false;
    this.FXD_cfs.RouteToDealerExecuted=false;
    this.PriceClick=false;
    this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.ClearLPs=true; //added by UrmilaA, 10-May-23 | LGTCLI-361
    this.ResetAllfieldsCalled=true; //Urmila A | LGTGTWINT-1332 | 6-feb-23
    if(this.BestPrice){ //Urmila A | 1-Feb-23 | LGTGTWINT-1209
      
      this.closeSignalR()   //added by UrmilaA, 10-May-23 | LGTCLI-361
      this.NoteMasterID=''; 
      this.fnSetAfterPriceValues(); //Added by UrmilaA | 13-June-23 | LGTGTWINT-2079
    }
 
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    // this.IBPrem = '0.00'; //commented by Urmila A | LGTGTWINT-972
    // this.PricingMode.toUpperCase() !== 'MANUAL' ? (this.IBPrem = '0.00') : ''; //commented by Urmila A | LGTGTWINT-972 | 30-Jan-23
    this.ClientPrem = '0.00';
   
    this.Orderplace = '';
    this.loadflag = false;
    this.ViewScheduleflag = false;
    this.Errormsg = '';
    this.DealNo = '';
    this.ScheduleVisibility = false;
    this.OrderBlotterVisibility = false;
    this.OrderPlaceFlag = false;
    this.ClearPricingFlag = true;
   
    this.orderMsg=''
    this.DealNo=''
    this.Orderplace='';
    // this.Upfront = ''; //commented by Urmila A | LGTGTWINT-972
    // this.UpfrontAlt=''; //commented by Urmila A | LGTGTWINT-972
    // this.UpfrontVal=''; //commented by Urmila A | LGTGTWINT-972
    this.DCDRfqId='';
    this.routeToDealerClicked=false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted =false;
    // if (this.GetPriceProviderDetailsSubscription)
    //   this.GetPriceProviderDetailsSubscription.unsubscribe();
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.firstFixChngAndDatesReceived =false;    
    
  }

  //added by UrmilaA, 10-May-23 | LGTCLI-361 | start
  closeSignalR(){
         if(this.BestPrice && this.ShowRFS && this.NoteMasterID !=='0'){
        this.CancelSignalRconnectionSub = this.FXD_afs.FXDResetDictionaryFromRFQIDAPI(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Product_Code, this.SignalRQuoteIDs,
          this.DCDRfqId, this.NoteMasterID)
        .subscribe((res:any)=>{
            try{
                if(res){
                  res=res.UnsubcribeRFQIDResult.A_ResponseReceived
                  this.SignalR_unsubscriber = res;   //UrmilaA |LGTCLI-361 | 24-May-23
                  // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                  if(res === true){                 
                    // this.loadflag=false; //added by UrmilaA, 22-May-23 | LGTCLI-361     // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                    window.console.log('btnEnable',this.btnEnable) 
                    this.SignalRQuoteIDs='';
                  }
                  //End
                
                }
            }catch(err){console.log(err)}
        })
    }
  }
  //added by UrmilaA, 10-May-23 | LGTCLI-361 | ends



  //Modified by Urmila A | removed redundant getProductDetails API calls | 20-feb-23
   ProductChanged(e) {   
    this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 17-may-23
  
    this.ResetAllFields()
    this.ProdChangedYN = true; //Sequence modified by Urmila A | 25-Jan-23 |  LGTGTWINT-1209
    this.DestroyFn(); //Urmila A | 24-feb-23

    this.selectedProduct = e.target.value;
    this.AllDataLoaded = { // Urmila A |1-Feb-23 | LGTGTWINT-1295
          productDetail:true,
          productinfo: true,
          ccypairs: true, //24-feb-23
          optioncut: true,  //27-feb-23
          tenor: true, //Urmila a | 18-feb-23
          priceprovider: false,
          bidask: true,  //24-feb-23
          datecalculation: true,
          firstfixingdate: true, //24-feb-23
    }
    this.FixingSettChngYN = 'N';
    this.NoofSettChangeYN = 'N';
    this.FirstFixingChangedYN='N';

    if(e.target.value === 'FXAQ'){
          this.OrderDirection = 'Buy';       
          this.Strike = this.AskSpot;
          document.getElementById('idAskSpot').style.color = '#808080';
          document.getElementById('idBidSpot').style.color = '#B6B6B6';
          // this.fnGetContractSummary(); //LGTGTWINT-1023 Contract summary issues || RijwanS
    }else{
          this.OrderDirection = 'Sell';
          this.Strike = this.BidSpot;
          document.getElementById('idBidSpot').style.color = '#808080';
          document.getElementById('idAskSpot').style.color = '#B6B6B6';
          // this.fnGetContractSummary(); //LGTGTWINT-1023 Contract summary issues || RijwanS
    }
   this.fnAssignDefaultvalues(); //Urmila A |LGTCLI-318| 24-feb-23
   this.fnSetAfterPriceValues(); //Added by UrmilaA | 7-June-23 | LGTGTWINT-2079
   this.fnAssignProdDetails(e.target.value);
   this.ProdChangedYN=false; //Urmila A | 24-feb-23
  }

   //Added by UrmilaA | 6-June-23 | LGTGTWINT-2079| start
   fnSetAfterPriceValues(){
    this.Upfront = '';
    this.UpfrontAlt = ''; 
    this.UpfrontVal = ''; 
    this.IBPrem='0.00'
   
  }
  //Added by UrmilaA | 6-June-23 |LGTGTWINT-2079| ends

  //Added by Urmila A | LGTCLI-318 | 24-feb-23
  fnAssignDefaultvalues(){
        this.KORate='';
        this.GuaranteedPeriodTill='';
        this.GuaranteedPeriods='0';
        // this.FixingSettFreq = 'Weekly/Weekly'; commented by UrmilaA , as update in jira LGTCLI-318 | 27-feb-23
  }

  //Urmila A | common function to assign product values | 20-feb-23 | start
  fnAssignProdDetails(prodCode){
    this.AllProdData.forEach(element => {
      if(element.product_code === prodCode){
              this.Product_ID = element.Product_Id;
              this.Product_Name = element.Product_Name;
              this.Product_Code = element.product_code;
              this.Template_Name = element.Template_Name;
              this.TemplateCode = element.Template_Code;
              this.TemplateID = element.Template_Id;
              if(!this.IsNavigate){ //Urmila a, 30-mar-23
                this.fnGetPriceProviderandCcypairs();  
                this.fnGetBidAskRates();
                this.fnGetContractSummary()
                this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
                  //commented by UrmilaA , as update in jira LGTCLI-318 | 27-feb-23
                  // if(this.ProdChangedYN){ //Added by Urmila A | LGTCLI-318 | 24-feb-23
                  //   this.fnGetOptionCutFXD(); 
                  // }
                  if(!this.ProdChangedYN){
                    this.fnGetFXDCurrencyPairs(); 
                  }                
              }
      }
    });
  }
  //end

  CurrencyPairChanged() {
    try {
      this.ResetAllFields();
      this.fnGetBidAskRates();
      this.DepCcy = this.CurrencyPair.slice(0, 3);
      this.AltCcy = this.CurrencyPair.slice(6, 9);
      this.IBPremCcy = this.DepCcy;
      this.NotionalCcy = this.DepCcy;
      this.ccy1 = true;  //Added by Urmila  | LGTCLI-208
      this.ccy2 = false;  //Added by Urmila  | LGTCLI-208
      this.KORate=''; //added by UrmilaA | 26-april-23 | LGTCLI-418
      this.fnIsMetalInCcy();
      this.fnGetContractSummary();
    } catch (error) {
      console.log(error);
      //throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  
  }

  fnIsMetalInCcy() {
    try {
      this.Pair_Cross_YN = '';
      this.Left_USD_Pair = '';
      this.Right_USD_Pair = '';
      //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | start
      this.CurrencyPairList.forEach((element) => {
        if (element.asset_Pair === this.CurrencyPair) {
              this.Pair_Cross_YN = element.pair_Cross_YN;
              this.Left_USD_Pair = element.left_USD_Pair;
              this.Right_USD_Pair = element.right_USD_Pair;
              this.DepCcy = this.CurrencyPair.split('-')[0].trim();
              this.AltCcy = this.CurrencyPair.split('-')[1].trim();

          if (element.lcY_Type.toUpperCase() === 'METAL') {
            // Check if the Dep ccy is metal or not
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.DisableCCYChangeControl = true;         
            this.IBPremCcy = this.AltCcy;
            this.NotionalCcy = this.DepCcy;
            this.NotionalDecimalPointShift = 0;

          } else if (element.rcY_Type.toUpperCase() === 'METAL') {
            // Check if the Alt ccy is metal or not
            this.DisableCCYChangeControl = true;         
            this.IBPremCcy = this.DepCcy;
            this.NotionalCcy = this.DepCcy;
            this.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
          } 
          else {
            this.isMetal = 'N'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.DisableCCYChangeControl = false;
            this.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
          }

          //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
          if (element.rcY_Type === 'NDF') {
            this.NDFFlag = 'Y';
          } else {
            this.NDFFlag = 'N';
          }

          this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
          this.Asset2_DecimalAmount = element.asset2_DecimalAmount;
        }
        //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | ends
      });

      if (this.Pair_Cross_YN === 'Y') {
        this.FindLeftUSDMidRate(this.Left_USD_Pair);
        this.FindRightUSDMidRate(this.Right_USD_Pair);
      }

    } catch (ex) { }
  }

  async TenorChanged() {
    this.ResetAllFields();
    try {
      await this.fnGetDatesCalculationforVB();
      // await this.getfnCalculateFirstFixingDate();
    } catch (error) {
      console.log(error);
    }
  }

  Validations() {
    try {
         
      if (this.Product_Code === 'FXAQ') {
        
        // Added by Urmila A | LGTGTWINT-489 |start | 14-Dec-22 | start
        if(Number(this.KORate) <= 0 || this.KORate === '' ){
          this.Errormsg = 'KO cannot be blank';
          return false;
        }

        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | start
        // else if(this.KORate !== '' ){ //Uncommented by Urmila For now | 31-Jan-23 | discussed by Rahul P
        //     if (Number(this.KORate) > Number(this.Strike)) {
        //       this.Errormsg = '';
        //     }else {
        //       this.Errormsg = 'KO Rate should be greater than Strike';
        //       return false;
        //     }
        //     if (this.SelectedKIStyle !== 'NO') {
        //       if (Number(this.KIRate) < Number(this.Strike)) {
        //         this.Errormsg = '';
        //       } else {
        //         this.Errormsg = 'KI Rate should be less than Strike';
        //         return false;
        //       }
        //     }
        // } else {
        //     if (Number(this.KORate) < Number(this.Strike)) {
        //       this.Errormsg = '';
        //     } else {
        //       this.Errormsg = 'KO Rate should be less than Strike';
        //       return false;
        //     }
        //     if (this.SelectedKIStyle !== 'NO') {
        //       if (Number(this.KIRate) > Number(this.Strike)) {
        //         this.Errormsg = '';
        //       } else {
        //         this.Errormsg = 'KI Rate should be greater than Strike';
        //         return false;
        //       }
        //     }
        // }
        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165  | end

      }
      else{ //Urmila A | LGTGTWINT-1262 | 31-Jan-23      
        if(Number(this.KORate) <= 0 || this.KORate === '' ){
          this.Errormsg = 'KO cannot be blank';
          return false;
        }
      
        // else if(this.KORate !== '' ){  //commented by urmila A | 8-feb-23 | LGTGTWINT-1165
        //     if (Number(this.KORate) > Number(this.Strike)) {             
        //       this.Errormsg = 'KO Rate should be less than Spot and Strike';
        //       return false;
        //     }else {
        //       this.Errormsg = '';
        //     }     
        // }
      }//end
      // Added by Urmila A | LGTGTWINT-489 |start | 14-Dec-22 | end
       
      //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165  | start 
      // if (Number(this.GuaranteedPeriods) >= 0) {      //Uncommented by Urmila For now | 31-Jan-23 | discussed by Rahul P
      //   if (Number(this.GuaranteedPeriods) >= Number(this.NoOfSett)) {
      //     // this.Errormsg = 'Guaranteed periods cannot be greater than No of settlements'; //Commented by Urmila A | LGTGTWINT-699 | 19-Jan-23
      //     this.Errormsg = 'Guaranteed periods should be less than number of settlements'; //Added by Urmila A | LGTGTWINT-699 | 19-Jan-23
      //     return false;
      //   } else {
      //     this.Errormsg = '';
      //   }    

      // } 
      //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165  | end

      if (this.NotionalAmt === '') {
        this.Errormsg = 'Notional cannot be zero or blank';
        return false;
      } 

      // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | start
      // else {
      //   if (this.DisableCCYChangeControl === true) {
      //     if (Number(this.NotionalAmt.replace(/,/g, '')) >= 1) {
      //       this.Errormsg = '';
      //     } else {
      //       this.Errormsg =
      //         'Notional below ' + this.NotionalCcy + ' 1 not allowed';
      //       return false;
      //     }
      //   } else if (Number(this.NotionalAmt.replace(/,/g, '')) >= 100000  ) {
      //     this.Errormsg = '';
      //   } else {
      //     this.Errormsg =
      //       'Notional below ' + this.NotionalCcy + ' 100k not allowed';
      //     return false;
      //   }
      // }
      // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | end

      // if (Number(this.NotionalAmt.replace(/,/g, '')) > 1000) {
      //   this.Errormsg = '';
      // } else {
      //   this.Errormsg = 'Notional below ' + this.NotionalCcy + ' 1K not allowed';
      //   return false;
      // }
      if (Number(this.Strike) > 0) {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Invalid Strike';
        return false;
      }

      //Added by Urmila A | 3-Mar-23
      if(this.CurrencyPair === ''){
        this.Errormsg = 'Please select currency pair.'
        return false
      }else {
        this.Errormsg='';
      }
      
     
      if (
        this.TradeDate !== '' &&
        this.Premiumdate !== '' &&
        this.FinalFixingDate !== '' &&
        this.FinalSettDate !== ''
      ) {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Dates are not loaded';
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      // throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  }



  fnBestPricing() {
    //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | starts
    this.PriceRecvFromLPs=0;  
    this.fnResetpricingFlags(); 
    this.ClearLPs = true; 
    //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | ends

    this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23
    if(this.ServiceResponse !== null){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      this.ClearLPs = true;
      this.OrderPlaced = false; //UrmilaA | LGTGTWINT-1446 | 24-feb-23   
    }
  
    //Urmila A, 29-mar-23, for redirected deals
    if(this.IsNavigate){
      this.PriceRecAfterRepricefromBlotter= true;
      this.ScheduleCallWithGuarenteeperiod=false //Urmila A | 2-Feb-23 | LGTGTWINT-1209
    }
    if(this.RouteFromWorkflow === true){   
      this.NoteMasterID = this.NoteToUnblock; //UrmilaA| 2-feb-23     
     }else { this.NoteMasterID = '0' }
    if (this.SelectedPricingMode === 'Auto') {
      if (this.Errormsg === '' && this.Validations()) {
        this.priceLoader=true; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
        this.RFQNODisplayFromParent = false;
      
        if(!this.IsNavigate){  //Urmila A, 29-mar-23, for redirected deals
            this.ResetAllFields();
            this.ScheduleCallWithGuarenteeperiod=false //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        }
      
        this.fnIsMetalInCcy(); // HSBCFXEINT-25  | Chaitanya M | 06 Dec 2023
        
        // this.GenerateUserID();
        this.disabledPrembtn = true;
        this.loadflag = true;
        const spotrate =
          this.Product_Code === 'FXAQ' ? this.AskSpot : this.BidSpot; // 'FXAQ' Changed By Mohan
        this.ClearPricingFlag = false;
       
        //customer ID, name changes added by UrmilaA, 17-April-23
        //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
        //<CustID>"+this.HomeAPI.CustomerId +  "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
        this.XMLString =
        "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><GuaranteedPeriods>"+ this.GuaranteedPeriods +
        "</GuaranteedPeriods><OptionCut>"+this.OptionCut+"</OptionCut><KO>"+this.KORate+"</KO><FirstFixingDate>"+this.FirstFixingDate+"</FirstFixingDate><NonDeliveryYN>N</NonDeliveryYN><FixingSettFreq>"+this.FixingSettFreq+
        "</FixingSettFreq><Currency1>"+this.NotionalCcy+
        "</Currency1><CcyPair>"+this.CurrencyPair+"</CcyPair><PremiumCcy>"+this.IBPremCcy+
        "</PremiumCcy><CustPrem>"+this.ClientPrem+"</CustPrem><BuySell>"+this.OrderDirection+
        "</BuySell><Spotrate>"+spotrate+"</Spotrate><LeverageFactor>"+this.Leverage+"</LeverageFactor><Ccy1PerFixing>"+ this.NotionalPerFixing.replace(/,/g, '') +
        "</Ccy1PerFixing><Notional>"+this.NotionalPerFixing.replace(/,/g, '')+"</Notional><NotionalType>Per Fixing</NotionalType><TradeDate>"+this.TradeDate+
        "</TradeDate><PremiumDate>"+this.Premiumdate+"</PremiumDate><FixingDate>"+this.FinalFixingDate +
        "</FixingDate><SettDate>"+this.FinalSettDate +
        "</SettDate><TenorDays>"+this.TenorDays+"</TenorDays><Tenor>"+this.Tenor+"</Tenor><Strike>"+Number(this.Strike)+
        "</Strike><KIBarrierType></KIBarrierType><KI></KI><KIStyle>No</KIStyle><EntityID>"+this.FXD_afs.EntityID +
        "</EntityID><CAI_ID>7400</CAI_ID><NoofSett>"+this.NoOfSett+"</NoofSett></Sheet1></ExcelSheets>"         

          this.FXD_afs.SetPricingProduct(this.Product_Name);
          let fxd_Mode = this.FXD_cfs.fngetMode() //Urmila A | LGTGTWINT-1470 | 21-feb-23
          let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)
        
          //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
          this.Bestpricesubscription =
            this.FXD_afs.GetFXBestPriceForVBNew(
              // this.FXD_afs.EntityID,
              this.FXD_afs.EntityID,
              this.FXD_afs.UserName,
              // this.FXD_afs.GetToken(),
              // this.Product_Code.toUpperCase(),
              this.Product_Code.toUpperCase(), //ProductType
              this.CurrencyPair,
              this.NotionalCcy, //DepositCurrency
              // this.NotionalCcy,
              this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy, //AltCcy
              this.IBPremCcy, //PremCurrency
              this.IBPremCcy, //SettlementCcy
              this.NotionalPerFixing.replace(/,/g, ''),
              // this.NotionalAmt.replace(/,/g, ''),
              'PREMIUM' , //SolveFor
              this.OrderDirection.toUpperCase(),
              this.Strike.toString(),
              this.Product_Code === 'FXDQ' ? this.KORate : '0', //'FXAQ' Changed by Mohan
              this.Product_Code === 'FXAQ' ? this.KORate : '0', //'FXAQ' Changed by Mohan
              'No', //BarrierType
              '', //KnockIn_Style
              '', //KnockOut_Style
              this.OptionCut,
              this.Tenor + '',
              this.Premiumdate,
              this.FinalFixingDate,
              this.FinalSettDate,
              // this.IsRMLoggedIn ? '33308' : this.HomeAPI.CustomerId, //Customer_ID
              this.FXD_afs.UserName,
              // this.FXD_afs.EntityID,
              true,
              this.PriceProviderString,
              // this.PricingModels[0],
              this.XMLString,
              this.TemplateCode,
              this.TemplateID,
              this.Product_ID,
              // this.DealerRemark,
              // this.Parant_DCDRFQID,
              // this.DI_YN,
              this.NewOrderfromRMLocked || this.NewOrderfromRMUnlocked ? this.NoteMasterID : '0', //Urmila A | 6-Feb-23
              // this.DIfromTradeIdea,
              // fxd_Mode, //Urmila A | LGTGTWINT-1470 | 21-feb-23
              this.TradeDate,
              this.NDFFlag,
              this.isMetal,
              this.ShowRFS, //UrmilaA, 9-May-23 | (SignalR, RFS | LGTCLI-361)
              this.OrderDirection.toUpperCase() === 'BUY'? 'CALL' : 'PUT', //CallPut
              '0', //RMMarginPercentage / Upfront,
              this.Mode,
              this.DI_YN,
              '',//KIType
              ActiveRemark,
              '',//CapLoss
              this.DCDRfqId,
              '',//GroupKey
              this.FixingSettFreq, //frequency
              '',//CapLossCcy
              '',//TargetType
              '',//PayAtStrike
              '',//AdjustmentYN
              'Black Scoles',
              '',//CapLossAmount
              '',//AdjustmentType
              '',//ResponseMethod
              this.DIfromTradeIdea,
              this.Parant_DCDRFQID,
              '',//StrikeAdjustment
              '',//CustomerPremAmount
              '',//GuaranteedLeverageYN
              '',//Bank_Prem_CashFlow_Direction,
              ''//Target
            ).subscribe((res) => {
              try{
                console.log('pricing called')
                this.ServiceResponse=[]
                this.ResetAllfieldsCalled=false; //Urmila A | LGTGTWINT-1332 | 6-Feb-23         
                if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
                  if (res ) {
                     this.PriceClick=false; //urmilaA | LGTGTWINT-2109
                  
                        if(res.errors == undefined && res.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL') //Error handling logic modified by Urmila A | 15-sep-23     
                        {       
                          this.ServiceResponse = res=res.oPriceResponseBody;                       
                          // below ALL code modified by UrmilaA, LGTCLI-361 | 18-May-23 | start                          
                                if(this.ServiceResponse[0].quoteId == 0){  //added by UrmilaA, case- Single record response with quoteId = 0;
                                  this.noResponseRecv = true;
                                  // this.loadflag = false;// UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                  this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                  this.NotificationFunction("Error","Error" , this.ServiceResponse[0].errorMessage);
                                }

                                if (this.ServiceResponse === null || this.ServiceResponse.length == 0) {//this.ServiceResponse[0].bestPriceProvider === null
                                  // this.loadflag = false;// UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                  this.disabledPrembtn = false;
                                  this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                  this.OrderPlaceFlag=false; //urmila A | LGTGTWINT-1295 | 13-feb-23                           
                                } else if(this.ServiceResponse.length > 0) {                                                                                                  
                                        //added by UrmilaA | LGTCLI-361 , LGTGTWINT-2040| 29-May-23 | start
                                        this.NoteMasterID = this.ServiceResponse[0].NoteMasterID; 
                                        this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                                        //added by UrmilaA | LGTCLI-361, LGTGTWINT-2040 | 29-May-23 | ends           
                                        if(this.ShowRFS){
                                            this.SignalRQuoteIDs='';
                                            this.SignalRQuoteIDs = this.FXD_cfs.fnGetLP_withPrice_Quote(this.ServiceResponse)
                                            console.log('quote ids:', this.SignalRQuoteIDs)
                                            console.log("time starts", Date()); // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                                            this.SignalR.callHub(this.SignalRQuoteIDs)
                                            this.MinMaxTimer = parseInt(this.MinQuoteTimeout) // added by UrmilaA | LGTGTWINT-2110| 9-June-23                      
                                            this.MinTimeput = setTimeout(() => {  //UrmilaA | LGTGTWINT-2110| 9-June-23  
                                              console.log("Delayed for "+this.MinQuoteTimeout+" second.");
                                              console.log("time ends", Date());
                                              this.MinQuoteTimeOutOccurred = true;
                                              this.SignalR_unsubscriber=false; //UrmilaA | LGTGTWINT-1147 | 9-June-23
                                              // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                                              if(!this.signalRMsgRecv && this.MinQuoteTimeOutOccurred && !this.SignalR_unsubscriber){                                                   
                                                this.MapRFS(this.BroadCastData)
                                              }else if(this.signalRMsgRecv && this.MinQuoteTimeOutOccurred) {                              
                                                this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23                                              
                                                console.log('signalRMsgRecv',this.btnEnable,this.signalRMsgRecv)
                                                this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
                                                this.closeSignalR();
                                              }  
                                            //End                      

                                            }, parseInt(this.MinQuoteTimeout) * 1000);
                                           
                                         
                                            // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  | start                        
                                            this.MinInterval = setInterval(() =>{
                                              if(this.MinMaxTimer > 0){
                                                this.MinMaxTimer = this.MinMaxTimer - 1;
                                                console.log('this.MinMaxTimer',this.MinMaxTimer)
                                              } else if(this.MinMaxTimer == 0) { 
                                                clearInterval(this.MinInterval)
                                                clearTimeout(this.MinTimeput)
                                              }  
                                            },1000);
                                            // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  | ends
                                            
                                        }else{   
                                          this.priceLoader=false;// UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                          this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 24-Mar-23       
                                          console.log("Respnse is : " , this.ServiceResponse[0]);            
                                          this.ResponseArray =
                                          this.ServiceResponse[0].bestPriceProvider.split(':');                                    
                                          this.BestPriceProvider = this.ResponseArray[0];                                    
                                            this.ServiceResponse.forEach(element => {
                                                  if(this.BestPriceProvider === element.provider){                                        
                                                        this.AssignAfterPriceValues(element)
                                                  }
                                            });
                                         
                                          
                                          this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse); ///Urmila A | 16-feb-23 | LGTCLI-315
                                          console.log('in RFS , price recv from LPs',this.PriceRecvFromLPs )
                                        }
                                          
                                        // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
                                        if(this.isSaveTradevisible)  //added by UrmilaA | 16-June-23 |LGTGTWINT-2137
                                        {
                                          this.SaveTradeEnabledFlag = true
                                          this.disabledRoutetodealeronSaveTrade = false
                                          this.FXD_afs.SaveTradeBtnFlag.next(false)
                                        }
                                        // ---END--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
                              
                                }
                        
                         
                          // below ALL code modified by UrmilaA, LGTCLI-361 | 18-May-23 | ends
                        } else{   
                            this.ServiceResponse = res?.oPriceResponseBody;   
                            this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                            this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse); //urmila a, 29-mar-23                     
                            if(this.FXD_cfs.fnPricingNotification(res) == 'NoResReceived') {
                              this.noResponseRecv = true; 
                              this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                            }     
                        }             
                  }
                  else{
                    // this.loadflag = false;
                    this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                    this.NotificationFunction("Error","Error" , 'No response received from remote system')  //Urmila A | 27-Jan-23 | LGTGTWINT-1045, LGTGTWINT-1224
                  }
                }
              }catch(error){
                console.log(error)
              }
            
            });    
      }
      else
      {
        if(this.Errormsg !== "")
        {
          this.NotificationFunction("Error","Error" , this.Errormsg)
        }
      }
    } else {
      this.FXManualPricing();
    }
  }

    //added by UrmilaA, 9-May-23, LGTCLI-361 | start
    MapRFS(data:any){
      // let ResponseArray:any=[];
      // console.log('in mapRFS',data,this.ServiceResponse, this.FXD_cfs.fnGetFXDPriceQuotes())  
      let BestPriceConsist :boolean=false;
      let nonBestCnt:any=0;
      let nonBestTimeout:any=0;
      let nonBestTimeoutOccurred:boolean=false;
      //this.loadflag=false   // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
      this.saveRes = this.ServiceResponse.map( (mapObj,index) => {
            var p = {...mapObj};
            if(index === 0){
              this.DCDRfqId  = p.o_DCDRFQID
            }

            if(parseInt(data[0]) === p.quoteId){
              this.PriceRecvFromLPs = this.PriceRecvFromLPs + 1; //added by UrmilaA, 22-may-23
              // this.loadflag=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023  // UrmilaA | LGTGTWINT-2109 | 9-jun-23
              this.priceLoader=false;   // UrmilaA | LGTGTWINT-2109 | 9-jun-23
              p.externalQuoteID = data[1];
              p.premiumAmount = data[2];
              p.premium = parseFloat(data[3]).toFixed(4);
              p.validTill = data[4];
              p.spot = data[6]; 
              p.IsBestPrice = data[5]; //as service side index changed
              p.validResponseReceived=true;
              this.ShownSignalRPriceQuotes.push(p.quoteId)
              if(data[5] === 'Y'){
                this.BestPrice = p.premiumAmount; //added currently for testing purpose by UrmilaA, 20-April-23
                this.AssignAfterPriceValues(p)                                         
              }
              if(p.premiumAmount !== '' && p.premiumAmount !== '0') {
                this.BestPrice = p.premiumAmount;
                BestPriceConsist = true
              }else{
                nonBestCnt = nonBestCnt +1 ;
              }
            }else{
              p = mapObj
            }
            return p;
      })
    
      // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
      if(nonBestCnt === this.saveRes.length) {
        BestPriceConsist=false;
      }   
      //End

      //added by UrmilaA, LGTCLI-361 | 22-May-23
      if(this.signalRMsgRecv){
        this.FXD_afs.RFSRes.next(this.saveRes);    
      }
      if(this.MinQuoteTimeOutOccurred){
          nonBestTimeout = parseInt(this.MaxQuoteTimeout) - parseInt(this.MinQuoteTimeout)
          console.log(' 2nd timeout start:',nonBestTimeout, Date())
          this.MinMaxTimer = nonBestTimeout // modified by UrmilaA | LGTGTWINT-2110| 9-June-23 
          this.MaxTimeout = setTimeout(() => { // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
              nonBestTimeoutOccurred=true;
              console.log('after 2nd timeout RFS res:', this.saveRes)
              // this.loadflag = false; 
              this.priceLoader=false;    // UrmilaA | LGTGTWINT-2109 | 9-jun-23
              if(nonBestTimeoutOccurred && !this.signalRMsgRecv){ //UrmilaA | 30-May-23 | case- Not single price received from signalR
                this.noResponseRecv = true; //UrmilaA, LGTGTWINT-2040 | 29-May-23
                this.NotificationFunction("Error","Error" , "No response received from remote system")
              }
        }, nonBestTimeout * 1000);

        

	     // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
        console.log('NonBestTimeout is ',nonBestTimeout );
        let nonBestinterval: any =  nonBestTimeout;      
        this.maxInterval = setInterval(() => {       
          this.MinMaxTimer = nonBestinterval = nonBestinterval-1 // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
          if(nonBestinterval >0){
            if(this.signalRMsgRecv){  
              this.priceLoader=false;      // UrmilaA | LGTGTWINT-2109 | 9-jun-23    
              this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23
              // this.loadflag = false;  // UrmilaA | LGTGTWINT-2109 | 9-jun-23    
              this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
              this.closeSignalR();
              this.signalRMsgRecv = false;    
              this.MaxQuotePriceCame =true;
              this.FXD_afs.RFSRes.next(this.saveRes);   //added by UrmilaA, LGTCLI-361 | 22-May-23
              clearInterval(this.maxInterval)
            }        
          }else if(nonBestinterval == 0){ // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
            clearInterval(this.maxInterval)
            clearTimeout(this.MaxTimeout)
          }
                  
        },1000)
	     //End
      }

      // this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.saveRes); ///Urmila A | 16-feb-23 | LGTCLI-315
      console.log('ResponseArray',this.saveRes,this.PriceRecvFromLPs)
    
      this.ShownSignalRPriceQuotes?.forEach(quoteEle => {
        this.saveRes?.forEach(resEle => {
            if(quoteEle === resEle.quoteId){
              resEle.alreadyMapped=true;  
            }         
          });
      });
     
    
    }
  
  
    AssignAfterPriceValues(element){  
      this.ClearLPs = false; //added by UrmilaA, 23-May-23 | LGTCLI-361
      this.BestPriceProvider = element.provider;
      this.BestPrice = element.premiumAmount;
      this.ScheduleCallWithGuarenteeperiod=false //Urmila A | 1-Feb-23 | LGTGTWINT-1209
      // this.loadflag = false;
      // this.DCDRfqId = element.o_DCDRFQID;
      this.NoteMasterID = element.NoteMasterID;
      this.fnSetIBPrem(element.premiumAmount);
      this.ExternalRfqId = element.quoteId;
      this.BestPriceabs = Math.abs(element.premiumAmount);

      this.Upfront = parseFloat(element.premium).toFixed(4) //Added by UrmilaA | LGTGTWINT-2061 | 2-June-23
  
      this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));
      this.CustPrem = element.premiumAmount;
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));
      this.IBPremDirection = element.premium > 0 ? 'Pay' : 'Receive';
    
      //added by UrmilaA | 30-May-23 | LGTCLI-361 | start
      if(this.ShowRFS){
            if(element.premium > 0){
              // this.ClientPremDir = 'CLIENT RECEIVES'
              this.IBPremComment = 'IB Pays'
              this.ClientPremDir = 'R' //UrmilaA | LGTGTWINT-2114 | 13-Junw-23
            }else{
              // this.ClientPremDir = 'CLIENT PAYS'
              this.IBPremComment = 'IB Receives' 
              this.ClientPremDir = 'P' //UrmilaA | LGTGTWINT-2114 | 13-Junw-23
            }
      }else{
        this.ClientPremDir = element.client_Prem_Dir;  //UrmilaA | 13-feb-23 | LGTCLI-304
        this.IBPremComment = this.FXD_cfs.fngetIBcomment(element.client_Prem_Dir) //Urmila a | 16-feb-23 | LGTCLI-314
      }
       //added by UrmilaA | 30-May-23 | LGTCLI-361 | ends
  
      //Urmila A | LGTGTWINT-1650 | start
      if(this.OrderDirection.toLowerCase() === 'buy'){
        this.AskSpot = element.spot !== 0 ? this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift)) : this.AskSpot; //changed by UrmilaA, LGTCLI-361 | 24-May-23
      }else{
        this.BidSpot = element.spot !== 0 ? this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift)) : this.BidSpot;//changed by UrmilaA, LGTCLI-361 | 24-May-23
      }
      //end
      this.fnFindUpfrontUSD();
      this.fnGetContractSummary();
     
      // this.fnCalculations(); //commented by UrmilaA | LGTGTWINT-2051 | 31-May-23
      
   }
    //added by UrmilaA, 9-May-23, LGTCLI-361 | end



  //Urmila A | LGTGTWINT-1147 ,LGTGTWINT-1322| Pricing loader | 3-feb-23 |
  CancelPricing(){
    if(this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
    // this.loadflag=false;// UrmilaA | LGTGTWINT-2109 | 9-jun-23
    this.priceLoader=false;   // UrmilaA | LGTGTWINT-2109 | 9-jun-23
  }
  // Urmila A | 11-Nov-22 |  Start
  FindLeftUSDMidRate(LeftCCY){
    this.LeftUSDMidrate = '';
    this.getBidaskSubscriber =this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      LeftCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {
      //mapping modified by Urmila A | 31-Aug-23 
        this.AllDataLoaded.bidask = true;
        this.LeftUSDMidrate = res?.MidRate;
        console.log('left USD Midrate:', this.LeftUSDMidrate);
        //if(!this.RouteFromWorkflow || !this.RouteFromQuoteHistory)
        if(!this.IsNavigate){ //modified by Urmila A | 29-mar-23
          this.GetStrikeRate();
        }
       
      }
    });
  }
  FindRightUSDMidRate(RightCCY){
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration   
      this.Product_Code,
      RightCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {
        //mapping modified by Urmila A | 31-Aug-23 
        this.AllDataLoaded.bidask = true;
        this.RightUSDMidRate = res?.MidRate;
        console.log('Right USD Midrate:', this.LeftUSDMidrate);
        //if(!this.RouteFromWorkflow || !this.RouteFromQuoteHistory)
        if(!this.IsNavigate){ //modified by Urmila A | 29-mar-23
          this.GetStrikeRate();
        }
      }
    });
  }
  fnFindUpfrontUSD(){

  //currently commenting this part as discussed with Rahul P | 24-Feb-23 | start 
  // if(this.IBPremToggle || this.NotionalToggle){
  //   if(this.UpfrontAlt !== ''){ //added by Urmila A | 11-Jan-23 | | LGTCLI-244
  //       if(this.NotionalPerFixing !== undefined || this.NotionalPerFixing !== '' || this.NotionalAmt !== undefined || this.NotionalAmt !== '')  {
  //           if(this.IBPremCcy === this.DepCcy && this.NotionalCcy === this.AltCcy){
  //             this.UpfrontVal = (parseInt(this.NotionalAmt.replace(/,/g, ''), 10) / parseFloat(this.Strike)) * (parseFloat(this.Upfront) / 100)
  //           }else if(this.IBPremCcy !== this.NotionalCcy){
  //               this.UpfrontVal = parseInt(this.NotionalAmt.replace(/,/g, ''),10) * parseFloat(this.Strike) * (parseFloat(this.Upfront) / 100);
  //           }else{
  //               this.UpfrontVal = (parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * parseFloat(this.Upfront)) / 100;
  //           }
  //           this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(2))
  //           console.log('UpfrontVal: ',this.UpfrontVal)
  //       }
  //   }//end
    
  // }
  //comments end

  //Urmila A | LGTGTWINT-1519 | 24-feb-23
  if(this.UpfrontVal.includes('-') || this.UpfrontAlt.includes('-')){
    this.UpfrontVal = this.UpfrontVal.replace('-','')
    this.UpfrontAlt = this.UpfrontAlt.replace('-','')
  }
  this.UpfrontVal =  this.UpfrontVal.replaceAll(',','') //Urmila A | 1-Feb-23 |LGTCLI-287
    //calculating Upfront (USD) conversion

    if (this.Pair_Cross_YN === 'N') {
      if (this.DepCcy === 'USD' || this.DepCcy.includes('USD')) {
          if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.DepCcy) {
            this.UpfrontAlt = this.UpfrontVal / 1;
          } else if (
            this.NotionalCcy === this.AltCcy &&
            this.IBPremCcy === this.DepCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / 1;
          } else if (
            this.NotionalCcy === this.DepCcy &&
            this.IBPremCcy === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / this.SpotMidRate;
          } else if (
            this.NotionalCcy === this.AltCcy &&
            this.IBPremCcy === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / this.SpotMidRate;
          }
      } else {
          if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.DepCcy) {
            this.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
          } else if (
            this.NotionalCcy === this.AltCcy &&
            this.IBPremCcy === this.DepCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
          } else if (
            this.NotionalCcy === this.DepCcy &&
            this.IBPremCcy === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal;
          } else if (
            this.NotionalCcy === this.AltCcy &&
            this.IBPremCcy === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal;
          }
      }
    }else if (this.Pair_Cross_YN === 'Y') {
      console.log(
        'left USD:',
        this.Left_USD_Pair,
        'Right USD:',
        this.Right_USD_Pair
      );
     
    
      if (this.NotionalCcy === this.DepCcy && this.IBPremCcy  === this.DepCcy) {
        this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      } else if ( this.NotionalCcy === this.AltCcy && this.IBPremCcy === this.DepCcy) {
        this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      } else if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.AltCcy) {
        this.RightUSDMidRate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.RightUSDMidRate : '';
      } else if (  this.NotionalCcy === this.AltCcy &&  this.IBPremCcy === this.AltCcy ) {
        this.RightUSDMidRate !== '' ?  this.UpfrontAlt =  this.UpfrontVal / this.RightUSDMidRate : '';
      }
     
    }
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal)
     //Added by Urmila A | 11-Jan-23 | start | LGTCLI-246
     if(typeof this.UpfrontAlt === "string" && !this.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
      this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
     }else if(typeof this.UpfrontAlt === "number"){
          this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
     }
     //Added by Urmila A | 11-Jan-23 | end

     //Urmila A | 14-feb-23 | LGTCLI-304 | start
     if(this.ClientPremDir === 'P'){
          //Urmila A | LGTGTWINT-1519 | 24-feb-23
          if(this.UpfrontVal.includes('-') || this.UpfrontAlt.includes('-')){
              this.UpfrontVal = this.UpfrontVal.replace('-','')
              this.UpfrontAlt = this.UpfrontAlt.replace('-','')
          }
          this.UpfrontVal = this.UpfrontVal.substring(0,0) + '- ' + this.UpfrontVal.trim().substring(0, this.UpfrontVal.length);
          this.UpfrontAlt = this.UpfrontAlt.substring(0,0) + '- ' + this.UpfrontAlt.trim().substring(0, this.UpfrontAlt.length);
     }
     //Urmila A | 14-feb-23 | LGTCLI-304 | end

  
     console.log('Upfront USD:',this.UpfrontAlt)

  }
  // Urmila A | 11-Nov-22 |  end

  FXManualPricing() {
    if (this.Errormsg === '' && this.Validations()) {
      // this.ResetAllFields();
      this.GenerateUserID();
      this.disabledPrembtn = true;
      this.loadflag = true;
      const spotrate =
        this.Product_Code === 'FXAQ' ? this.AskSpot : this.BidSpot; // 'FXAQ' Changed By Mohan
      this.ClearPricingFlag = false;
      try {
        // let depoccy = this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.DepCcy ? this.DepCcy:this.AltCcy;
        // eslint-disable-next-line @typescript-eslint/quotes
        if (this.Product_Name === 'DQ') {
          this.XMLString =
            '<ExcelSheets><Sheet1>' +
              '<Product_Name>' +
              this.Product_Name +
              '</Product_Name>' +
              '<Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>' +
              '<CustID>' +
               this.HomeAPI.CustomerId +
                '</CustID>' +
                '<Customer_Name>' +
             this.HomeAPI.CustomerName +
                '</Customer_Name>' +
                '<GuaranteedPeriods>' +
                this.GuaranteedPeriods +
                '</GuaranteedPeriods>' +
                '<Spotrate>' +
                spotrate +
                '</Spotrate>' +
                '<OptionCut>TOK</OptionCut>' +
                '<KO>' +
                this.KORate +
                '</KO>' +
                '<NonDeliveryYN>N</NonDeliveryYN>' +
                '<KIStyle>No</KIStyle>' +
                '<FixingSettFreq>' +
                this.FixingSettFreq +
                '</FixingSettFreq>' +
                '<Currency1>' +
                this.NotionalCcy +
                '</Currency1>' +
                '<CcyPair>' +
                this.CurrencyPair +
                '</CcyPair>' +
                '<PremiumCcy>' +
                this.IBPremCcy +
                '</PremiumCcy>' +
                '<CustPrem>' +
                this.ClientPrem +
                '</CustPrem>' +
                '<PremiumDate>' +
                this.Premiumdate +
                '</PremiumDate>' +
                '<BuySell>' +
                this.OrderDirection +
                '</BuySell>' +
                '<FixingDate>' +
                this.FinalFixingDate +
                '</FixingDate>' +
                '<LeverageFactor>' +
                this.Leverage +
                '</LeverageFactor>' +
                '<Ccy1PerFixing>' +
                parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) +
                '</Ccy1PerFixing>' +
                '<SpreadAmt>' +
                '</SpreadAmt>' +
                '<TradeDate>' +
                this.TradeDate +
                '</TradeDate>' +
                '<SettDate>' +
                this.FinalSettDate +
                '</SettDate>' +
                '<TenorDays>' +
                this.TenorDays +
                '</TenorDays>' +
                '<Tenor>' +
                this.Tenor +
                '</Tenor>' +
                '<Strike>' +
                Number(this.Strike) +
                '</Strike>' +
                '<EntityID>4</EntityID>' +
                '<Notional>' +
                parseInt(this.NotionalAmt.replace(/,/g, ''), 10) +
                '</Notional>' +
                '<NotionalType>Per Fixing</NotionalType>' +
                '<FirstFixingDate>' +
                this.FirstFixingDate +
                '</FirstFixingDate>' +
                '<NoofSett>' +
                this.NoOfSett +
                '</NoofSett>' +
                '</Sheet1>' +
                '</ExcelSheets>';
        } else {
          this.XMLString =
            '<ExcelSheets>' +
            '<Sheet1>' +
            '<Product_Name>' +
            this.Product_Name +
            '</Product_Name>' +
            '<Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>' +
            '<CustID>' +
            sessionStorage.getItem('CustomerID') +
            '</CustID>' +
            '<Customer_Name>' +
            sessionStorage.getItem('CustomerNamemisc1') +
            '</Customer_Name>' +
            '<GuaranteedPeriods>' +
            this.GuaranteedPeriods +
            '</GuaranteedPeriods>' +
            '<Spotrate>' +
            spotrate +
            '</Spotrate>' +
            '<OptionCut>TOK</OptionCut>' +
            '<KO>' +
            this.KORate +
            '</KO>' +
            '<NonDeliveryYN>N</NonDeliveryYN>' +
            '<KI>' +
            '</KI>' +
            '<KIStyle>No</KIStyle>' +
            '<FixingSettFreq>' +
            this.FixingSettFreq +
            '</FixingSettFreq>' +
            '<Currency1>' +
            this.NotionalCcy +
            '</Currency1>' +
            '<CcyPair>' +
            this.CurrencyPair +
            '</CcyPair>' +
            '<PremiumCcy>' +
            this.IBPremCcy +
            '</PremiumCcy>' +
            '<CustPrem>' +
            this.ClientPrem +
            '</CustPrem>' +
            '<PremiumDate>' +
            this.Premiumdate +
            '</PremiumDate>' +
            '<BuySell>' +
            this.OrderDirection +
            '</BuySell>' +
            '<FixingDate>' +
            this.FinalFixingDate +
            '</FixingDate>' +
            '<LeverageFactor>' +
            this.Leverage +
            '</LeverageFactor>' +
            '<Ccy1PerFixing>' +
            parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) +
            '</Ccy1PerFixing>' +
            '<SpreadAmt>' +
            '</SpreadAmt>' +
            '<TradeDate>' +
            this.TradeDate +
            '</TradeDate>' +
            '<SettDate>' +
            this.FinalSettDate +
            '</SettDate>' +
            '<TenorDays>' +
            this.TenorDays +
            '</TenorDays>' +
            '<Tenor>' +
            this.Tenor +
            '</Tenor2>' +
            '<Strike>' +
            Number(this.Strike) +
            '</Strike>' +
            '<KIBarrierType>' +
            '</KIBarrierType>' +
            '<PricingModel>' +
            this.SeletcedPricingModel +
            '</PricingModel>' +
            '<CAI_ID>7400</CAI_ID>' +
            '<EntityID>' +
            this.FXD_afs.EntityID + //EntityId changes by UrmilaA, LGTGTWINT-1908 | 24-April-23
            '</EntityID>' +
            '<Notional>' +
            this.NotionalAmt.replace(/,/g, '') +
            '</Notional>' +
            '<NotionalType>Per Fixing</NotionalType>' +
            '<FirstFixingDate>' +
            this.FirstFixingDate +
            '</FirstFixingDate>' +
            '<NoofSett>' +
            this.NoOfSett +
            '</NoofSett>' +
            '</Sheet1></ExcelSheets>';
        }
        this.FXD_afs.SetPricingProduct(this.Product_Name);
        // Upfront is 0 for this product said by mitalee k. on 8/11/2019
      
        this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBManual(
            this.FXD_afs.EntityID,
            this.Product_ID.toString(), //ProductID
            this.Product_Code.toUpperCase(), //ProductType
            this.CurrencyPair,
            this.NotionalCcy,
            this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy,
            this.IBPremCcy,
            this.NotionalCcy,
            this.NotionalAmt.replace(/,/g, ''),
            '' +
            Number(this.Strike) * Number(this.NotionalAmt.replace(/,/g, '')),
            this.OrderDirection,
            '',
            this.Strike,
            this.Product_Code === 'FXAQ' ? '0' : this.KORate, //'FXAQ' Changed by Mohan
            this.Product_Code === 'FXAQ' ? this.KORate : '0', //'FXAQ' Changed by Mohan
            '',
            '',
            '',
            this.OptionCut,
            this.Tenor + '',
            this.Premiumdate,
            this.FinalFixingDate,
            this.FinalSettDate,
            this.PriceProviderString,
            'Margin',
            this.TemplateCode,
            this.TemplateID,
            this.NotionalAmt.replace(/,/g, ''),
            '' + this.Leverage,
            this.FixingSettFreq,
            this.GuaranteedPeriods,
            this.KORate,
            0,
            '',
            this.XMLString,
            this.Upfront,
            this.UserID,
            this.SeletcedPricingModel,
            'GWManual',
            this.SelectedClientType,
            this.SelectedIBType,
            '',
            this.IBPrem,
            '0'
          ).subscribe((res) => {
            try{
                if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
                  if (res !== null) { //mappings modified by Chaitanya M | 29-Nov-23
                    console.log(res);
                    if (
                      res.GetFXOPriceManualModeResult !== null &&
                      !res.GetFXOPriceManualModeResult
                    ) {
                      this.ServiceResponse = res.GetFXOPriceManualModeResult;
                      console.log('Manual price res:',res.GetFXOPriceManualModeResult)
                      // this.fnSetIBPrem(this.ServiceResponse.IBPrem);
                      // this.IBPrem = this.ServiceResponse.IBPrem;
                      // this.ClientPrem = this.ServiceResponse.CustPrem;
    
                      // this.ClientPrem = parseFloat(this.ServiceResponse.CustPrem).toFixed(this.IBPremCcy === this.AltCcy ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      this.Upfront = this.ServiceResponse.MarginPerc;
                      this.SelectedClientType =
                        this.ServiceResponse.CustPayReceiveDirection;
                      this.SelectedIBType =
                        this.ServiceResponse.IBPayReceiveDirection;
    
                      this.loadflag = false;
                    } else {
                      this.loadflag = false;
                      this.Errormsg = this.ServiceResponse[0].errorMessage;
                      this.Errormsg = 'No prices received';
                      this.NotificationFunction("Error","Error" , this.Errormsg)
                      this.disabledPrembtn = false;
                    }
                  }
                }
            }catch(err){}
          
          });
      } catch (error) {
        console.log(error);
        // throw error; // Commented By Ketan S due to Interceptor stability issue
      }
    }
    else
    {
        if(this.Errormsg !== "")
        {
          this.NotificationFunction("Error","Error" , this.Errormsg)
        }
    }
  }

  GenerateUserID() {
    this.UserID = 'GMUser_' + Math.floor(Math.random() * 1000 + 1).toString();
    // console.log(this.SessionID);
  }

  BookDeal() {
    this.FXD_cfs.loadFlag=true;
    // this.OrderPlaceFlag = true;
    this.Errormsg = '';
    // var element = document.getElementById('btnTrade');
    let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)
    console.log('this.BestPriceProvider:',this.BestPriceProvider)
    try {
      this.OrderBlotterVisibility = false;
      this.ScheduleVisibility = false;
      this.BookOrdersubscription = this.FXD_afs.BookOrderforVBNew(
        // this.FXD_afs.EntityID, 
        // this.FXD_afs.UserName,
        //  this.FXD_afs.GetToken(), //commented by UrmilaA | 16-Aug-23 | Core migration - service Request params modified
        // this.Product_Code,
        // this.FXD_afs.EntityID,
        // this.FXD_afs.UserName,
        // this.DCDRfqId,
        // this.ExternalRfqId.toString(),
        // this.BestPriceProvider,
        // this.Product_Code,      
        // this.BestPrice,
        // ActiveRemark
        // this.HomeAPI.CustomerId,
        // this.FXD_afs.UserName
        this.FXD_afs.EntityID,
        this.FXD_afs.UserName,
        this.DCDRfqId,
        this.ExternalRfqId.toString(),
        this.BestPriceProvider,
        this.Product_Code,
        this.BestPrice,
        ActiveRemark   // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023
      ).subscribe((res) => {
     
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          if (res){
     
            this.OrderPlaced = true  
            this.FXD_cfs.loadFlag=false;    
              if(res !== null) //mappings modified by Urmila A | 14-sep-23
              {            
                  this.ViewScheduleflag = false;
                  this.Orderplace = res.External_TradeID;
                  this.DealNo = res.DealNo;
                  this.FXD_cfs.DealBooked.next(false)
                  this.FXD_cfs.fxdpopupOpenClose=true;                        
                  if (res.isProcessCompleted === true) {                      
                    this.FXD_afs.FXD_RFQID.next(this.DCDRfqId);  
                    this.orderMsg= res.Message;
                    this.ClearPricingFlag = true;                  
                    console.log('book deal, ',this.OrderPlaceFlag)
                  } else if(res.isProcessCompleted === false){               
                    this.orderMsg= res.Message;
                  } 
                  else {                  
                    this.Orderplace = '';
                  }
                
              }else {           
                //   // Urmila A | LGTGTWINT-1225 | 31-Jan-23 | start
                //   if(res.ResponseTradeBookParameters.isOrderRejected === true && res.ResponseTradeBookParameters.RejectionReason !== ''){
                //       this.NotificationFunction("Error","Error", 'Order rejected due to some technical reasons')
                //   }else if(res.ResponseTradeBookParameters.RejectionReason !== '' && res.ResponseTradeBookParameters.External_TradeID === null && res.ResponseTradeBookParameters.isOrderRejected === false){
                //         this.NotificationFunction("Error","Error", 'Order may have got executed or may have failed. Contact support')
                //   }else {
                //         this.NotificationFunction("Error","Error" , res.A_ResponseHeader.FailedReason )
                //   }// Urmila A | LGTGTWINT-1225 | 31-Jan-23 | end
                
                // }
          }
   
          }
        }
      });
    } catch (error) {
      console.log(error);
     
    }
  }

  
  TradeSelectedLP(SelectedLPDetails) {
    // this.DCDRfqId = SelectedLPDetails.o_DCDRFQID;
    // console.log('trade selected LP:', SelectedLPDetails)
    console.log('SelectedLPDetails',SelectedLPDetails)

     //unncesorry code removed by UrmilaA | 1-June-23 |LGTGTWINT-2067
    // this.BestPriceProvider = SelectedLPDetails.provider;
    // this.ExternalRfqId = SelectedLPDetails.quoteId;
    

    // this.ServiceResponse.forEach(element => {
    //       if(element.provider === SelectedLPDetails.provider){
    //         this.BestPrice = element.premiumAmount;
    //       }
    // });
    
    // if (this.OrderDirection === 'Buy') {
    //   this.ClientPrem = (Number(this.Notional.replace(/,/g, '')) * (Number(this.BestPrice) + Number(this.upfront))) / 100;
    // } else {
    //   this.ClientPrem = (Number(this.Notional.replace(/,/g, '')) * (Number(this.BestPrice) - Number(this.upfront))) / 100;
    // }
    this.BookDeal()
  }

  fnCalculations() {
    // this.IBPrem = ((this.BestPriceabs * Number(this.NotionalAmt.replace(/,/g, ''))) / 100);
    // this.IBPrem = Number(parseFloat(this.IBPrem.toString()).toFixed(4));
    // if (this.ClientPrem > 0) {
    //   this.UpfrontCcy = (this.IBPrem - this.ClientPrem);
    //   this.Upfront = ((this.UpfrontCcy / Number(this.NotionalAmt.replace(/,/g, ''))) * 100);
    // } else {
    this.ClientPrem = 0.0;
    this.Upfront = this.BestPrice;
    // }
  }
  ViewWorkFlowBlotter() {
    this.OrderBlotterVisibility = true;
    // this.workflowblotter.ViewBlotter(this.TradeDate, '1-Jun-2018', '1', '10');
  }
  StrikeValidation(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value === '') {
      if (this.Product_Code === 'FXAQ') {
        this.Strike = this.AskSpot;
        // this.Strike = e.target.value;
        document.getElementById('idAskSpot').style.color = '#808080';
        document.getElementById('idBidSpot').style.color = '#B6B6B6';
      } else {
        this.Strike = this.BidSpot;
        // this.Strike = e.target.value;
        document.getElementById('idBidSpot').style.color = '#808080';
        document.getElementById('idAskSpot').style.color = '#B6B6B6';
      }
    } else {
      if (target.value === '.') {
        target.value = '0';
      }
      if (Number(this.AskSpot) >= 100 && Number(this.BidSpot) >= 100) {
        target.value = parseFloat(target.value).toFixed(this.PointShift);
      } else {
        target.value = parseFloat(target.value).toFixed(this.PointShift);
      }
    }
  }
  GuarateePeriodsValueChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } 
    else {
      return true;
    }
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  GetStrikeRate() {
    if (this.OptionType === 'Call') {
      if (this.OrderDirection === 'Buy') {
        if (Number(this.AskSpot.replace(/,/g, '')) > 100 && Number(this.BidSpot.replace(/,/g, '')) > 100) {
          this.Strike = (
            Number(this.AskSpot.replace(/,/g, '')) +
            Number(this.StrikePoint) / 100
          ).toFixed(this.PointShift);
        } else {
          this.Strike = (
            Number(this.AskSpot.replace(/,/g, '')) +
            Number(this.StrikePoint) / 10000
          ).toFixed(this.PointShift);
        }
      } else {
        if (Number(this.AskSpot.replace(/,/g, '')) > 100 && Number(this.BidSpot.replace(/,/g, '')) > 100) {
          this.Strike = (
            Number(this.BidSpot.replace(/,/g, '')) +
            Number(this.StrikePoint) / 100
          ).toFixed(this.PointShift);
        } else {
          this.Strike = (
            Number(this.BidSpot.replace(/,/g, '')) +
            Number(this.StrikePoint) / 10000
          ).toFixed(this.PointShift);
        }
      }
    } else {
      if (this.OrderDirection === 'Sell') {
        if (Number(this.AskSpot.replace(/,/g, '')) > 100 && Number(this.BidSpot.replace(/,/g, '')) > 100) {
          this.Strike = (
            Number(this.AskSpot.replace(/,/g, '')) -
            Number(this.StrikePoint) / 100
          ).toFixed(this.PointShift);
        } else {
          this.Strike = (
            Number(this.AskSpot.replace(/,/g, '')) -
            Number(this.StrikePoint) / 10000
          ).toFixed(this.PointShift);
        }
      } else {
        if (Number(this.AskSpot.replace(/,/g, '')) > 100 && Number(this.BidSpot.replace(/,/g, '')) > 100) {
          this.Strike = (
            Number(this.BidSpot.replace(/,/g, '')) -
            Number(this.StrikePoint) / 100
          ).toFixed(this.PointShift);
        } else {
          this.Strike = (
            Number(this.BidSpot.replace(/,/g, '')) -
            Number(this.StrikePoint) / 10000
          ).toFixed(this.PointShift);
        }
      }
    }
  }

  fnDisableTradebtn(e) {
    this.OrderPlaceFlag = e;
    this.ViewSchedule = false;
    this.ViewScheduleflag = false;
  }

  fnDisablePrembtn(e) {
    this.disabledPrembtn = e;
  }

  fnDisableLoader(e){
          console.log('Global Loader flag',e,'OrderPlaced',this.OrderPlaced )
          this.OrderClicked = e
  }

 

  async fnCalculateFirstFixingDate() {
    var Tenor_Code_Temp:any = '';
    switch (this.FixingSettFreq.split('/')[0]) {
      case 'Monthly':
        Tenor_Code_Temp = '1M';
        break;
      case 'Weekly':
        Tenor_Code_Temp = '1W';
        break;
      case 'BiWeekly':
        Tenor_Code_Temp = '2W';
        break;
    }
   
    this.FXDFirstFixingDateSubscriber =  this.FXD_afs.fnGetFixingDateFromNoOfSett(
      this.DepCcy,
      this.AltCcy,
      this.DepCcy + '-' + this.AltCcy,
      this.TradeDate,
      this.FXD_afs.EntityID,
      // Tenor_Code_Temp,
      this.FixingSettFreq.split('/')[0],
      this.FixingSettFreq.split('/')[0],
      this.Product_ID.toString(),
      this.Product_Code,
      this.Mode,
      this.OptionCut,
      this.FXD_afs.UserName,
      // this.TenorDays,
      this.DepCcy,
      this.AltCcy,
      this.Premiumdate,
      // this.FirstFixingDate.toString(),
      this.FinalFixingDate,
      this.FinalSettDate,
      this.NotionalPerFixing
    ).subscribe((res) => {
      
      if (res) {
        console.log(res);
        this.AllDataLoaded.firstfixingdate = true;
        //urmila A, 5-april-23 , LGTGTWINT-1846
        this.prevFirstFixingDate = this.FirstFixingDate = res.firstFixingDate;
        this.firstFixChngAndDatesReceived =true;
       
        // this.fnGetTenorfromFixings();
        this.fnGetContractSummary()
      }
      
    });
  }
  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
  ChangeinNotionalPerfixing() {
    console.log('notional per fixing:',this.NotionalPerFixing)
    this.NotionalAmt = this.FXD_cfs.format(
      Number(this.NotionalPerFixing.replaceAll(/,/g, '')) * Number(this.NoOfSett),
      this.NotionalDecimalPointShift
    );
    // if(this.NotionalPerFixing.includes(',')){
      
    // }
    // if(this.NotionalPerFixing.includes('.')){
    //   this.NotionalAmt = this.FXD_cfs.format(
    //     Number(this.NotionalPerFixing.replaceAll(/./g, '')) * Number(this.NoOfSett),
    //     this.NotionalDecimalPointShift
    //   );
    // }
    
    this.fnGetContractSummary();
  }
  fnChangeInNoOfSett(e) {
    this.NoOfSett = e.target.value; 
    if(this.NoOfSett === '0' || this.NoOfSett === ''){ //Urmila A | 15-Feb-23 | LGTGTWINT-1212
      this.NotificationFunction("Error","Error", "Number of settlement should be grater than 0 ")
    }else{
      this.NoofSettChangeYN = 'Y';
      this.fnGetTenorfromFixings();  
    }
  
    // this.fnCalculateFirstFixingDate(); 
   
  }

  fnChngFixingSettlFreq(e){
      this.FixingSettFreq=e.target.value //added by UrmilaA | 31-July-23
      this.FixingSettChngYN = 'Y'
      this.fnGetTenorfromFixings();    
  }
 
  fnGetTenorfromFixings() {
    this.Tenor='';
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.tenor = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.GetTenorSubscriber = this.FXD_afs.fnGetTenorfromFixings( //API req parameters modification | Core migration | Urmila A | 21-Aug-23
      this.FixingSettFreq,
      this.NoOfSett, //this.NoOfSett
      this.FXD_afs.UserName,
    ).subscribe((res) => {
     //mapping modified by Urmila A | 31-Aug-23 | as response modified
      if (res !== null) {
        this.Tenor = res.result;
        this.AllDataLoaded.tenor = true; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 
        if(this.Tenor.includes('W')){
              this.TenorDays = parseInt(this.Tenor) * 7
        }else if(this.Tenor.includes('M')){
              this.TenorDays = parseInt(this.Tenor) * 30
        }else if(this.Tenor.includes('Y')){
          this.TenorDays = parseInt(this.Tenor) * 365
        }

       
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }

        this.TenorChanged();
      }
    });
  }
  fnChangePricingMode() {
    this.PricingMode = this.SelectedPricingMode.toUpperCase();
    switch (this.PricingMode) {
      case 'AUTO':
        this.SampleArray.unshift({
          PP_Code: 'Best',
          PP_CustomerId: '',
          PP_ExternalCode: '',
          PP_Id: '',
          PP_Name: 'Best',
          PP_Round_Strike_Diff: '',
          PP_TwoStepOrderExecutionYN: '',
          PP_Type: '',
        });
        this.SelectedLPForPricing = 'Best';
        break;
      case 'MANUAL':
        this.SampleArray.forEach((element, index) => {
          if (element.PP_Name === 'Best') {
            this.SampleArray.splice(index, 1);
          }
        });
        this.SelectedLPForPricing = this.SampleArray[0].PP_Name;
        this.ClearPricingFlag = false;
        break;

        
    }
    this.ResetAllFields();
    this.fnGetContractSummary();
  }

  fnChangeNotionalCCY() {
    try {
      try {
        this.CurrencyPairList.forEach((element) => {
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.NotionalCcy === element.asset1) {
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCcy === element.asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.NotionalAmt = this.FXD_cfs.NotionalChangewithDecimalFixes(
              this.NotionalAmt,
              this.NotionalDecimalPointShift
            );
            this.fnGetContractSummary();
          }
        });
      } catch (ex) { }
    } catch (Ex) { }
  }
  fnSetIBPrem(InputValue: any) {
    if (this.AltCcy === this.IBPremCcy) {
      // this.IBPrem = Number(parseFloat(InputValue.toString()).toFixed(this.Asset2_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.IBPrem = parseFloat(InputValue.toString())
        .toFixed(this.Asset2_DecimalAmount)     
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      // this.IBPrem = Number(parseFloat(InputValue.toString()).toFixed(this.Asset1_DecimalAmount));
      this.IBPrem = parseFloat(InputValue.toString())
        .toFixed(this.Asset1_DecimalAmount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
  public SelectedCCy(e) {
    console.log(e);
    console.log('AQ ccy :', e)
    this.CurrencyPair = e;
    this.CurrencyChanged = true; //Added by Urmila A | 7-Jan-23
      //Added by UrmilaA | 25-Dec-23 | start
      if(this.CurrencyPair !== ''  && this.CurrencyPair.length == 9){
        // this.setCCY();
        // this.fnGetFXDCurrencyPairs();
        this.CurrencyPairChanged();
        this.fnGetOptionCutFXD(); //Added by Urmila A | for updating option cut after CCY change       
        this.fnGetDatesCalculationforVB();                
      }
      if(this.CurrencyPair == '' || this.CurrencyPair.length <= 8){
        this.DepCcy = this.AltCcy = '';
        this.IBPremCcy = this.NotionalCcy = ''
        this.fnGetBidAskRates();
      }   
      //Added by UrmilaA | 25-Dec-23 | ends 
  
  }


  // Urmila A | View schedule functonality | 7-Dec-22 | start
  fnShowOrHideShedule() {   
    //replacing RouteFromWorkflow  with IsNavigate everywhere, by Urmila A, 29-Mar-23, for redirected deals

    let XML = ''; //Urmila A | LGTGTWINT-1332 | 6-feb-23 | start
    if(this.RouteFromWorkflow && !this.GperiodChange && !this.ResetAllfieldsCalled){
      this.NoteMasterID =this.NoteToUnblock;
    }else if(this.ResetAllfieldsCalled) { 
      this.NoteMasterID = ''
    }else if(this.RouteFromWorkflow && !this.GperiodChange && !this.ResetAllfieldsCalled && !this.BestPrice){
      this.NoteMasterID = this.NoteToUnblock;
    }else if(this.RouteFromQuoteHistory){ //urmila A, 29-Mar-23,  LGTGTWINT-1758
      this.NoteMasterID = this.NoteMasterID
    }//end
    this.ViewScheduleflag = true;
    this.scheduleBtnClick=true; //Urmila A | LGTGTWINT-1244 | 30-Jan-23
    this.ScheduleCallWithGuarenteeperiod=false
    this.FXD_cfs.schedulePopupOpenClose.next(true);
    var CustID = '1'
    var Customer_Name = 'LGT-CUST001'
    const spotrate = this.Product_Code === 'FXAQ' ? this.AskSpot : this.BidSpot; 
    let LeverageTXT = this.Leverage > 1 ? 'Booster' : ''
    console.log('Schedule XML: ', this.ScheduleDescription = ' ' + this.OrderDirection + ' ' + this.CurrencyPair + ' ' + this.FixingSettFreq + ' ' +  LeverageTXT + ' ' + 'Knock - Out Accumulative Forward With' + ' ' +
    this.NotionalCcy + ' '+ 'at Strike : ' + this.Strike + ',' + ' ' + 'KO Rate: ' + this.KORate)
    this.ScheduleDescription = ' ' + this.OrderDirection + ' ' + this.CurrencyPair + ' ' + this.FixingSettFreq + ' ' +  LeverageTXT + ' ' + 'Knock - Out Accumulative Forward With' + ' ' +
    this.NotionalCcy + ' '+ 'at Strike : ' + this.Strike + ',' + ' ' + 'KO Rate: ' + (this.KORate !== '' ? this.KORate : 0) ; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550
    if(this.Product_Name === 'DQ'){
      if(!this.BestPrice){ 

        //customer ID, name changes added by UrmilaA, 17-April-23
         //EntityId changes by UrmilaA, LGTGTWINT-1908 | 24-April-23
         //<CustID>"+this.HomeAPI.CustomerId + "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
        XML = this.ScheduleXML =
              "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><GuaranteedPeriods>"+ this.GuaranteedPeriods +
              "</GuaranteedPeriods><OptionCut>"+this.OptionCut+"</OptionCut><KO>"+this.KORate+"</KO><FirstFixingDate>"+this.FirstFixingDate+"</FirstFixingDate><NonDeliveryYN>N</NonDeliveryYN><FixingSettFreq>"+this.FixingSettFreq+
              "</FixingSettFreq><Currency1>"+this.NotionalCcy+
              "</Currency1><CcyPair>"+this.CurrencyPair+"</CcyPair><PremiumCcy>"+this.IBPremCcy+
              "</PremiumCcy><CustPrem>"+this.ClientPrem+"</CustPrem><BuySell>"+this.OrderDirection+
              "</BuySell><Spotrate>"+spotrate+"</Spotrate><LeverageFactor>"+this.Leverage+"</LeverageFactor><Ccy1PerFixing>"+ this.NotionalPerFixing.replace(/,/g, '') +
              "</Ccy1PerFixing><Notional>"+this.NotionalPerFixing.replace(/,/g, '')+"</Notional><NotionalType>Per Fixing</NotionalType><TradeDate>"+this.TradeDate+
              "</TradeDate><PremiumDate>"+this.Premiumdate+"</PremiumDate><FixingDate>"+this.FinalFixingDate +
              "</FixingDate><SettDate>"+this.FinalSettDate +
              "</SettDate><TenorDays>"+this.TenorDays+"</TenorDays><Tenor>"+this.Tenor+"</Tenor><Strike>"+Number(this.Strike)+
              "</Strike><KIBarrierType></KIBarrierType><KI></KI><KIStyle></KIStyle><EntityID>"+this.FXD_afs.EntityID +
              "</EntityID><CAI_ID>7400</CAI_ID><NoofSett>"+this.NoOfSett+"</NoofSett></Sheet1></ExcelSheets>"
      }else if(this.BestPrice){
        this.ScheduleXML = ''
      }

       //RouteFromWorkflow, replaced with IsNavigate, 30-mar-23 , Urmila A
      if(this.IsNavigate && !this.BestPrice && !this.GperiodChange && this.scheduleBtnClick && !this.ScheduleCallWithGuarenteeperiod && !this.ResetAllfieldsCalled){  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
        this.ScheduleXML = '';
      }else if(this.IsNavigate && !this.BestPrice && !this.GperiodChange && this.scheduleBtnClick || this.ResetAllfieldsCalled){
        this.ScheduleXML = XML;
      }else if(this.IsNavigate && this.GperiodChange && this.BestPrice){
        this.ScheduleXML = '';
      }else if(this.IsNavigate && this.GperiodChange && !this.BestPrice ){
        this.ScheduleXML = XML;
      }else if(this.IsNavigate && this.BestPrice || this.IsNavigate && this.BestPrice && this.scheduleBtnClick){
        this.ScheduleXML = '';
      }//end

      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory && !this.BestPrice){
        this.ScheduleXML = XML;
      }

    }else if(this.Product_Name === 'AQ'){
      if(!this.BestPrice){ 
         //customer ID, name changes added by UrmilaA, 17-April-23
          //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
      //    <CustID>"+this.HomeAPI.CustomerId +  "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
        XML =  this.ScheduleXML  =
            "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><GuaranteedPeriods>"+ this.GuaranteedPeriods +
            "</GuaranteedPeriods><OptionCut>"+this.OptionCut+"</OptionCut><KO>"+this.KORate+"</KO><FirstFixingDate>"+this.FirstFixingDate+"</FirstFixingDate><NonDeliveryYN>N</NonDeliveryYN><FixingSettFreq>"+this.FixingSettFreq+
            "</FixingSettFreq><Currency1>"+this.NotionalCcy+
            "</Currency1><CcyPair>"+this.CurrencyPair+"</CcyPair><PremiumCcy>"+this.IBPremCcy+
            "</PremiumCcy><CustPrem>"+this.ClientPrem+"</CustPrem><BuySell>"+this.OrderDirection+
            "</BuySell><Spotrate>"+spotrate+"</Spotrate><LeverageFactor>"+this.Leverage+"</LeverageFactor><Ccy1PerFixing>"+ this.NotionalPerFixing.replace(/,/g, '') +
            "</Ccy1PerFixing><Notional>"+this.NotionalPerFixing.replace(/,/g, '')+"</Notional><NotionalType>Per Fixing</NotionalType><TradeDate>"+this.TradeDate+
            "</TradeDate><PremiumDate>"+this.Premiumdate+"</PremiumDate><FixingDate>"+this.FinalFixingDate +
            "</FixingDate><SettDate>"+this.FinalSettDate +
            "</SettDate><TenorDays>"+this.TenorDays+"</TenorDays><Tenor>"+this.Tenor+"</Tenor><Strike>"+Number(this.Strike)+
            "</Strike><KIBarrierType></KIBarrierType><KI></KI><KIStyle></KIStyle><EntityID>"+this.FXD_afs.EntityID +
            "</EntityID><CAI_ID>7400</CAI_ID><NoofSett>"+this.NoOfSett+"</NoofSett></Sheet1></ExcelSheets>"
      }else if(this.BestPrice){
        this.ScheduleXML = '';
      }
      if(this.IsNavigate && !this.BestPrice && !this.GperiodChange && this.scheduleBtnClick && !this.ScheduleCallWithGuarenteeperiod && !this.ResetAllfieldsCalled){  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
        this.ScheduleXML = '';
      }else if(this.IsNavigate && !this.BestPrice && !this.GperiodChange && this.scheduleBtnClick || this.ResetAllfieldsCalled){
        this.ScheduleXML = XML;
      }else if(this.IsNavigate && this.GperiodChange && this.BestPrice){
        this.ScheduleXML = '';
      }else if(this.IsNavigate && this.GperiodChange && !this.BestPrice ){
        this.ScheduleXML = XML;
      }else if(this.IsNavigate && this.BestPrice || this.IsNavigate && this.BestPrice && this.scheduleBtnClick){
        this.ScheduleXML = '';
      }//end

      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory && !this.BestPrice){
        this.ScheduleXML = XML;
      }

    } 
   
  
  }
  // Urmila A | View schedule functonality | 7-Dec-22 | end

  fnCustomerSelection(e) {
    this.CustomerID = e.CustomerID;
  }
 

  // First fixing date fetched Pranav D 8-Sep-2022 
  getfnCalculateFirstFixingDate() {
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.firstfixingdate = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    var Tenor_Code_Temp = '';
    switch (this.FixingSettFreq.split('/')[0]) {
      case 'Monthly':
        Tenor_Code_Temp = '1M';
        break;
      case 'Weekly':
        Tenor_Code_Temp = '1W';
        break;
      case 'BiWeekly':
        Tenor_Code_Temp = '2W';
        break;
    }
    
    this.FXDFirstFixingDateSubscriber =  this.FXD_afs.fnGetFixingDateFromNoOfSett(
      this.DepCcy,
      this.AltCcy,
      this.DepCcy + '-' + this.AltCcy,
      this.TradeDate,
      this.FXD_afs.EntityID,
      // Tenor_Code_Temp,
      // this.Tenor,
      this.FixingSettFreq.split('/')[0],
      this.FixingSettFreq.split('/')[0],
      this.Product_ID.toString(),
      this.Product_Code,
      this.Mode,
      this.OptionCut,
      this.FXD_afs.UserName,
      // this.TenorDays,
      this.DepCcy,
      this.AltCcy,
      this.Premiumdate,
      // this.FirstFixingDate.toString(),
      this.FinalFixingDate,
      this.FinalSettDate,
      this.NotionalPerFixing
    ).subscribe((res) => {
      if (res) {
        console.log(res);
        this.AllDataLoaded.firstfixingdate = true;
        //urmila A, 5-april-23 , LGTGTWINT-1846
        this.prevFirstFixingDate = this.FirstFixingDate = this.datepipe.transform(res.firstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23
        
        this.firstFixChngAndDatesReceived =true;
        this.FixingSettChngYN = 'N' //Urmila A | LGTGTWINT-1203 | 31-Jan-23
       

        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | start        
        // if(!this.CurrencyChanged){ // Commented code by Urnila A | 24-Jan-23 , as NoofSettl to be user input only, as told by Rahul P, LGTGTWINT-1167
        //   this.NoOfSett = res.GetNumberofFixingsResult.FixingData.NoofFixings
        // } 
        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | end    
        // this.NotionalAmt = this.FXD_cfs.numberWithCommas(parseInt(this.NotionalPerFixing.replace(/,/g, '')) * Number(this.NoOfSett)); // Commented code by Urnila A | 24-Jan-23 , as NoofSettl to be user input only, as told by Rahul P, LGTGTWINT-1167
        

        //Added by Urmila A | LGTCLI-249 | 11-Jan-23 | start
        if(Number(this.GuaranteedPeriods) > 0){
            this.fnShowOrHideShedule();
            this.ScheduleCallWithGuarenteeperiod = true;
            this.ViewScheduleflag = false;
            this.ResetAllFields();
        }else if(Number(this.GuaranteedPeriods) === 0 || this.GuaranteedPeriods === '' || this.GuaranteedPeriods === undefined){
            this.GuaranteedPeriodTill = '';
            this.fnGetContractSummary();  //Urmila A | 12-Jan-23 | LGTGTWINT-1003
        }
        //Added by Urmila A | LGTCLI-249 | 11-Jan-23 | end

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
       
        

      }
      this.CurrencyChanged=false; //Added by Urmila A | 7-Jan-23
    });
  
  } 


   getEntityData(){
    //removed EntityId from req params by UrmilaA | 24-april-23
    this.FXDEntitySubscriber =   this.FXD_afs.getEntityData(this.Product_Code) //Core migration : API req paarms modified by Urmila A | 23-Aug-23
    .subscribe((res:any)=>{
      console.log("entity data", res);
      try{
        if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetEntityDataResult)){
          if(res.GetEntityDataResult.CVPResponse.CVPData){
            this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
            sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code)
            this.FXD_afs.SetCredentials() //LGTGTWINT-1898, UrmilaA, 24-april-23 
            //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
             if(this.EntityData[0].Code === '50'){
              this.CustomerID = this.HomeAPI.CustomerId = '50';
              this.HomeAPI.CustomerName = 'CustomerPB';             
             }//end

          }
        }
      }catch(err){}

    });
 
  }

  //Added by Urmila A | 24-April-23, for PB demo entity
  chngEntity(e){
    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)

    if(e.target.value === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';   
    }

    this.FXD_afs.SetCredentials() //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 
    // commented by UrmilaA, 24-april-23 , as only FXD entityID modified & to not affect EQC / other module
    // sessionStorage.setItem('EntityID', e.target.value)
    // sessionStorage.setItem('HomeEntityID', e.target.value)

    //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 | start
    this.SetDefaultValues();
    this.fnButtonVisibility()
    this.fnGetPriceProviderandCcypairs();  
    this.fnGetFXDCurrencyPairs();
    //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 | ends
  }

  // Added by Urmila A | 14-Nov-22 | Start
  EmailQuote(){
        this.QuteMailClicked=true;
        this.QuoteMailSent = false;
        this.closeQuoteMail = false;
        this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName, this.NoteMasterID.toString(), this.Product_ID,this.DCDRfqId)
        .subscribe((res)=>{
          try{
              if(res){
                console.log('Quote mail:', res)
                res=res.result
                if(res === true){
                      if(res === true){
                        this.FXD_cfs.fxdpopupOpenClose=true;
                        this.QuoteMailSent = true;
                        this.QuteMailClicked=false;
                      }else{
                        this.QuoteMailSent = false;
                      }
                }else{
                  this.NotificationFunction("Error","Error","Quote Email Failed.")
                  this.QuoteMailSent=false;
                  this.QuteMailClicked=false;
                }
              }else{ //added by Urmila A | 15-sep-23
                this.QuoteMailSent = false;
                this.QuteMailClicked=false;
                this.NotificationFunction("Error","Error","No Response from service")
              }
          }catch(err) {}
        });
       
  }
  
  
  closeOrderPopup(){
    this.OrderClicked=false;
    this.OrderPlaced = true
    this.OrderPlacedPopup=false;
    this.OrderPlaceFlag=false; 
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }
  closeEmailQuote(){
    this.QuoteMailSent=false;
    this.closeQuoteMail=true; //UrmilaA | 13-feb-23
  }
  // Added by Urmila A | 14-Nov-22 | End

// ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
  fnSaveTrade(){
    this.FXD_cfs.loadFlag=true;
    // this.SaveTradeLoader = true
    this.disabledRoutetodealeronSaveTrade = true //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | disabled Route to dealer.
    this.FXD_afs.SetOrderbtnonSaveTrade(true) //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | for disabled order btn.
    this.fngetSavetradeRecommendation()
  }
  // ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

  // Added by Urmila A | 22-Nov-22| Load Default values | start
  fngetPersonalDefaultValues(){
      this.DepCcy='';
      this.AltCcy='';
      this.Tenor='';
      this.NotionalPerFixing=''
      this.PersonalDefaultValueSubscriber = this.FXD_afs.getPersonalSettingFXD(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Mode)
      .subscribe((res:any)=>{
          try{
              if(res !== null){ //mappings modified by Chaitanya M | 29-Nov-23
                // console.log('getPersonal Setting res=>',res)
                res = res.GetPersonalSettingsResult.DC_PersonSettingsData[0]
                this.DepCcy = res.TextSetting1;
                this.AltCcy = res.TextSetting2;
                this.Tenor = res.TextSetting3;
                this.NotionalPerFixing = this.FXD_cfs.numberWithCommas(res.TextSetting4);
                if(this.Tenor.includes('W')){
                      this.TenorDays = parseInt(this.Tenor) * 7
                }else if(this.Tenor.includes('M')){
                      this.TenorDays = parseInt(this.Tenor) * 30
                }else if(this.Tenor.includes('Y')){
                  this.TenorDays = parseInt(this.Tenor) * 365
                }
              }
          }catch(ex){ }
      })
  }

  //added by urmilaA | LGTCLI-361 | 30-May-23 | start
  fnResetpricingFlags(){
    this.MinQuoteTimeOutOccurred =false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.MaxQuotePriceCame= false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.btnEnable=false;
    this.noResponseRecv=false; // Urmila A, 29-mar-23
    this.OrderPlaced=false; //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
    this.signalRMsgRecv=false;
    //added by urmilaA | LGTGTWINT-2109 | start
    clearInterval(this.MinInterval)
    clearInterval(this.maxInterval)
    clearTimeout(this.MaxTimeout)
    clearTimeout(this.MinTimeput)
    if(this.SignalRQuoteIDs !== ''){
      this.closeSignalR()
    }  
    this.BestPrice=null;
    //added by urmilaA | LGTGTWINT-2109 | ends

    //Email Quote btn disable issue | 12-june-23|start
    this.QuteMailClicked=false;
    this.QuoteMailSent=false;
    this.closeQuoteMail=false;
    this.OrderPlaced=false;
    //Email Quote btn disable issue | 12-june-23|ends

  }
  //added by urmilaA | LGTCLI-361 | 30-May-23 | ends

  ResetPricer(){
    this.PriceClick=false; // LGTGTWINT-2109 | UrmilaA
    this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 17-may-23
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361
    this.RMRemarkVisibility=false; //LGTGTWINT-1599, Urmila A | 3-Mar-23
    this.ResetPricerFlag=true;  //Urmila A | LGTGTWINT-1209 | 27-Jan-23
    this.RouteFromWorkflow = false;
    this.NewOrderfromRMUnlocked=false; //Urmila A, as reject button was enable after resetpricer
    this.OrderPlaced=false;  //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
    this.scheduleBtnClick=false //Urmila A | 28-Jan-23;
    this.GuaranteedPeriodTill='';  // Urmila A | 30-Jan-23
    this.GuaranteedPeriods='0';  // Urmila A | 30-Jan-23
    this.GperiodChange =false; //Urmila A | LGTGTWINT-1332 | 6-Feb-23
    this.FirstFixingDate=''; //Urmila A | 10-feb-23
    this.IsNavigate=false; //Urmila A | 17-feb-23
    this.noResponseRecv=false; // Urmila A, 29-mar-23
    this.RouteFromQuoteHistory=false; //Urmila A, 30-mar-23
    if(this.BestPrice){
      this.closeSignalR()   //added by UrmilaA, 10-May-23 | LGTCLI-361
    }
    this.ServiceResponse=null; //added by UrmilaA | 11-May-23 | LGTCLI-23

    this.fnUnsubscribeAllCalls()
    this.ResetAllFields()
    // this.fngetPersonalDefaultValues();
   
    this.SetDefaultValues()   
    // this.fnAssignProdDetails('FXAQ'); //Urmila A | 20-feb-23 | LGTGTWINT-1444  //commented by Urmila A | LGTGTWINT-1737 | 17-Mar-23
    this.fnButtonVisibility();   //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23
   
     //Added by Urmila A | 17-Mar-23 |LGTGTWINT-1737
    this.fnGetPriceProviderandCcypairs();    
    this.fnGetFXDCurrencyPairs(); 
    this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
    this.fnGetContractSummary();
   
  
  }

  // Added by Urmila A | 22-Nov-22| Load Default values | end

  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | start
  fnRouteDealerClick(){
        if(this.DealerRemark === ''){
            this.Errormsg = 'Please enter remark'
            this.NotificationFunction("Error","Error" , this.Errormsg)
              
        }else if(this.DealerRemark !== ''){
          this.Errormsg = ''
          this.routeToDealerClicked = true;
          this.FXD_cfs.fxdpopupOpenClose=true; 
          this.confirmedRouteDealer = false;
          this.SaveTradeEnabledFlag = false //Added  Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P. | disabled save trade idea on Route to dealer
        }
      
  }
  // closeRouteToDealer(){
  //     this.routeToDealerClicked = false;
  //     this.confirmedRouteDealer = false;
  //     this.IsRouteToDealerExecuted =true;
  // }

  fnConfirmRouteToDealer(){
        this.FXD_cfs.loadFlag=true
        // this.confirmedRouteDealer = true;
        // this.routeToDealerClicked = false;   
        // this.routeToDealerClickedloader = false
        this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(this.FXD_afs.EntityID, this.FXD_afs.UserName,
          this.Product_Code,this.DCDRfqId,this.NoteMasterID,this.CustPAN,this.DealerRemark,this.ExceptionWarningMsg)
          .subscribe((res:any)=>{
            try{
                
                if(res){
                  res= res.result;
                  if(res === true) // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                  {
                    if(res === true)
                    {
                      this.FXD_cfs.loadFlag=false               
                      this.FXD_cfs.RouteToDealerExecuted=true;
                      this.FXD_cfs.fxdpopupOpenClose=true;
                      this.confirmedRouteDealer=true
                      // this.IsRouteToDealerExecuted = true;
                      // this.routeToDealerClicked = true;
                      // this.routeToDealerClickedloader = true // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                      console.log('Route to dealer res:',res)
                    }
                  }
                  // ---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                  else
                  {
                      // this.routeToDealerClickedloader = true
                      this.NotificationFunction("Error","Error" , "Route to dealer failed.")
                  }
                  // ---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                                  
                }
            }catch(err) {}
          })
  }
  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | end
 
  // Added by Urmila A | 20-Dec-22 | start
  fnChngeRemark(e){
    try{
      this.DealerRemark = e.target.value
    }catch(err) {}
      
  }
 // Modified by UrmilaA | Reject route to dealer | code sync with 5star | start
  fnRejectRouteToDealer(){
    this.RejectRedirectedOrder=true;
    this.RejectSubscriber = this.FXD_afs.FXDRejectRouteToDealerAPI(this.FXD_afs.UserName,
      this.NoteMasterID,this.DealerRemark ).subscribe((res:any)=>{
        try{         
            if(res){
              if (res.errors == undefined) {
                  if(res !== null){
                      console.log('Reject API response:',res);
                      this.RejectedOrderMSG='';                 
                      this.RejectedOrderMSG = res.result; //Urmila A | 18-Dec-23 | Reject route to dealer | F5SAAINT-1176
                      this.FXD_cfs.fxdpopupOpenClose=true;
                   
                  }else{
                      this.RejectRedirectedOrder=false;                    
                  }           
              }else{            
                this.RejectRedirectedOrder=false;
                let key = Object.keys(res.errors)
                let Error = res.errors[key[0]]
                this.NotificationFunction("Error", "Error", Error);
              }
          }else{
            this.RejectRedirectedOrder=false;
            this.NotificationFunction("Error", "Error", "No response received");
          }
        }catch(err) {
          console.log(err)
        }
      })
  }

  fnCloseRejectRouteToDealer(){
    this.RejectRedirectedOrder=false;
  }
   // Modified by UrmilaA | Reject route to dealer | code sync with 5star | end

  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
  fngetSavetradeRecommendation(){
   //API req body params modified by Urmila A | 21-Aug-23 | Core migration
   this.FXD_afs.getSavetradeRecommendation(this.FXD_afs.UserName,this.NoteMasterID,this.DCDRfqId,
    this.Mode,this.DealerRemark) //Urmila A | 15-Feb-23 | LGTGTWINT-1403
    .subscribe((res:any)=>{
        try{
             
            res=res.result;
            if(res){ //Urmila A | 11-Mar-23
              this.FXD_cfs.saveTradeDone=true;
              this.MinMaxTimer=0;
              clearInterval(this.MinInterval)
              clearInterval(this.maxInterval)
              this.FXD_cfs.fxdpopupOpenClose=true;
              this.FXD_cfs.loadFlag=false;
              // this.SavetradePopup = true
              // this.SaveTradeLoader = false
              // this.SaveTradeEnabledFlag = false
              // console.log('getPersonal Setting res=>',res ,)
            }
            else
            {
              this.FXD_cfs.loadFlag=false;
              // this.SaveTradeLoader = false 
              this.NotificationFunction("Error","Error" , "Save Trade Idea Failed.")
            }
        }catch(ex){ }
    })
}


// ---END--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29

//Added by Urmila A | 27-Dec-22 | LGTCLI-208
fnNotionalCCYToggle(){
  this.NotionalToggle = true; 
  this.ccy2 = true;
  if (this.ccy2 === true && this.NotionalCcy !== this.AltCcy) {
    this.NotionalCcy = this.AltCcy;
    this.ccy1 = true;
  } else if (this.ccy1 === true) {
    this.NotionalCcy = this.DepCcy;
  }

  //Logic added by Urmila A | for LGTCLI-251 | as per client requirement , 12-Jan-23  | start
    //  this.IBPremCcy = this.NotionalCcy
    //  this.IBPremCcy = this.DepCcy //Urmila A | LGTCLI-251 | 30-Jan-23
  //ends
 
  try {
    try {
        //mappings modified by Urmila A | 26-Dec-23
      this.CurrencyPairList.forEach((element) => {
        if (element.asset_Pair === this.CurrencyPair) {
          if (this.NotionalCcy === element.asset1) {
            this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
          } else if (this.NotionalCcy === element.asset2) {
            this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
          }
          this.NotionalAmt = this.FXD_cfs.NotionalChangewithDecimalFixes(
            this.NotionalAmt,
            this.NotionalDecimalPointShift
          );

        //added by Urmila A | 26-Dec-23 | F5SAAINT-660
        this.NotionalPerFixing = this.FXD_cfs.NotionalChangewithDecimalFixes(
          this.NotionalPerFixing,
          this.NotionalDecimalPointShift
        );
          
        }
      });
    } catch (ex) { }
  } catch (Ex) { }

  if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ //added by Urmila A | 11-Jan-23 | LGTCLI-244
    this.fnFindUpfrontUSD()
  }
  this.fnGetContractSummary();
  //end
}

//Added by Urmila A |  27-Dec-22 | LGTCLI-208
fnIBPremCCYToggle(){
    this.IBPremToggle=true
    this.ccy2 = true;
    if (this.ccy2 === true && this.IBPremCcy !== this.AltCcy) {
      this.IBPremCcy = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.IBPremCcy = this.DepCcy;
    }
    if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ //added by Urmila A | 11-Jan-23 | LGTCLI-244
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
    //end
}

//Added by Urmila A |  27-Dec-22 | LGTCLI-208 | END


// ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572
NotificationFunction(type , header, reason)
{
  this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
    NotificationType: type , //'Error',
    header: header , // 'Error',
    body: reason,
    DateandTime: ''
  });
}
// ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572


// Urmila A |12-Jan-23| LGTGTWINT-988
  fnChngKO(e){
    this.KORate = Number(e.target.value).toFixed(this.PointShift); 
  }


  //Urmila A | 14-feb-23 | start
  fnStrikeChng(e){
      this.Strike = Number(e.target.value).toFixed(this.PointShift); 
      
  }
  //end

  //added by Urmila A | 17-April-23
  fngetPriceProviderStr(arr){
      this.PriceProviderString=''
      arr.forEach((element) => {
        this.PriceProviderString === ''
          ? (this.PriceProviderString = '' + element.PP_Code)
          : (this.PriceProviderString =
            this.PriceProviderString + ':' + element.PP_Code);     
      });
      return this.PriceProviderString;
  }

  //urmila A | 28-April-23 | LGTGTWINT-1897 | start
  fnchngPriceProvider(e){
    if(e.target.value !== 'Bestprice'){
      this.BestPricelbl = "Price" // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
      this.PriceProviderString = e.target.value   
      this.PriceproviderArr.forEach(element => {
                if(element.PP_Code === e.target.value ){
                  this.SelectedLPForPricing = element.PP_Name //LGTGTWINT-1948 | UrmilaA, 3-may-23
                  this.SampleArray=element
                }
      });
      console.log('this.SampleArray',this.SampleArray)
    }else{
      this.SelectedLPForPricing = this.BestPricelbl = 'Best Price' // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
      this.fngetPriceProviderStr(this.PriceproviderArr)
    }
  
  }
  //urmila A | 28-April-23 | LGTGTWINT-1897 | ends

  //UrmilaA | LGTGTWINT-1895 | 13-june-23 | start
fnGetFixingFreq(){
  //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  let param4 = this.FXD_afs.EntityID +","+this.Product_ID; //LGTGTWINT-1895 | Added by Chaitanya M | 25 July 2023
  this.fixingSubscriber = this.FXD_afs.FXDGet_FunctionValue_FXDC_API('FixingSett_FrequencybasedonEntity', param4)
    .subscribe((res:any)=>{
      try{
          if(res !== null){
            this.FixingFreqArr=[]  
            res=res.FunctionGenericOutput
              res = this.FXD_cfs.fnParseXML(res, 'fixingfreq')
              const foundIdx = res.findIndex(el => el == 'Weekly/Weekly')
              res.splice(foundIdx, 1)
              res.unshift('Weekly/Weekly')
              this.FixingFreqArr=res
              if(!this.IsNavigate){
                this.FixingSettFreq=res[0]
              }
          }
      }catch(err){
        console.log(err)
      }
    })
}
//UrmilaA | LGTGTWINT-1895 | 13-june-23 | ends


}





