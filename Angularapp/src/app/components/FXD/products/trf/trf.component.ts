import {
  Component,
  OnInit,
  Input,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DatePipe } from '@angular/common';

import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';

import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service';

@Component({
  selector: 'app-trf',
  templateUrl: './trf.component.html',

  styleUrls: ['./trf.component.scss', '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})
export class TrfComponent implements OnInit, OnDestroy {
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
  @Input() isTRFbuyPresent:any; //Urmila A | 6-Mar-23
  @Input() isTRFsellPresent:any; //Urmila A | 6-Mar-23
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23
  @Input() AllowSolveForYN :any; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  @Input() ShowPriceProviderOnQEN:any;
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;
  
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  GetPriceProviderDetailsSubscription: any;
  prodId: any;
  IsIALoggedIn: boolean;
  OrderPlaced: boolean = false;
  OrderPlacedPopup: boolean = false; // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  orderMsg: string;
  screenHeight: number;
  screenWidth: number;
  QuoteMailSent: boolean = false;
  custPremDirection: any;
  IBPremDirection: any;
  FXDOptionCutSubscriber: any;
  FXDFirstFixingDateSubscriber: any;
  AltNotional: any;
  FXDGetNoofSettSubscriber: Subscription;
  IsAdvisoryLoggedIn: boolean = false;
  PersonalDefaultValueSubscriber: Subscription;
  FixingSettChngYN: any = 'N';
  FXDRouteToDealerSubscriber: Subscription;
  prodDetailSubscriber: any;
  selectedProduct: any;
  ScheduleXML: string = '';
  ScheduleDescription: string = '';
  RouteFromWorkflow: boolean = false;
  DealerRemark: any = '';
  OriginalIBPremPer: any;
  NoteToUnblock: any = '';
  UnlockMsg: any;
  IBPremToggle: boolean=false;
  CcySearch: any = ''; //Added by Urmila A | 11-Jan-23
  closeQuoteMail: boolean; //urmila A | 13-feb-23
  TargetBF: any; //Urmila A | 20-feb-23
  ResetAllfieldsCalled: boolean=false; //Urmila A | LGTGTWINT-1332 | 4-mar-23
  ResetPricerFlag: boolean=false;
  MaxClientSub: any;
  MaxClientvalue: any;
  prevFirstFixingDate:any=''; //urmila A, 5-april-23, LGTGTWINT-1846
  

  
      
  //RFS | Urmila A, 16-May-23, LGTCLI-361 | start
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
  SignalR_unsubscriber:boolean=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  MaxQuotePriceCame:boolean=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  btnEnable:boolean=false; //UrmilaA |LGTCLI-361 | 22-May-23

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
  LPname: any;
  //LGTGTWINT-2109| UrmilaA | ends
  SpreadRounding: any;
  IBPremNotionalDecimal: any;
  selectedCustomerSubscription: any;
  EntityDataFXTRF: any[]; //RizwanS || EFGUPINT-138 || 10 Apr 2024
  showPremAmt: any;
  //Urmila A, 16-May-23, LGTCLI-361 | ends

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
  // Urmila A | 16-Nov-2022 | Start
  private FXCurrencyPairsubscription: any;
  private TenorDayssubscription: any;
  private FXBidAsksubscription: any;
  private FXDatesCalculationsubscription: any;
  public FXPriceProvidersubscription: any;
  private Bestpricesubscription: any;
  private BookOrdersubscription: any;
  productInfoSubscriber: any;
  GetTenorSubscriber: any;
  getBidaskSubscriber: any;
  FXDProductDetailsSubscriber: any;
  FXDContractSummSubscriber: any;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: Subscription;

  // Urmila A | 16-Nov-2022 | End

  OrderBlotterVisibility: boolean;

  // First Column
  CurrencyPair: string;
  DepCcy: string;
  AltCcy: string;
  ProductType: string;
  OrderDirection: string;
  NotionalCcy: string;
  NotionalAmt: any;
  AltNotionalAmt: string;
  Tenor: string;
  TenorDays: any = '';
  BidSpot: any;
  AskSpot: any;
  Strike: any='';
  IBPrem: any;
  IBPremCcy: string;
  ClientPrem: any;
  Upfront: any;
  UpfrontCcy: number;
  UpfrontAlt: any;

  // Second Column
  TradeDate: string;
  Premiumdate: string;
  FinalFixingDate: string;
  FixingDate: string;
  FinalSettDate: string;
  FixingSettFreq: string;
  Leverage: number;
  KORate: string;
  GuaranteedPeriods: string;
  Targetpips: any='';
  Type: string;
  NoofKOEvent: any=0;
  XMLString: string;
  Delta: string;
  DeltaAmt: string;
  DeltaCcy: string;
  NotionalPerFixing: string='';

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
  PriceProviderString: string;
  PriceProviderForSolveForStrike: string = ''; // SolveFor changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForLPList = []; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  OrderPlaceFlag: boolean = false;
  LoadingTRFFlag: boolean;
  DealNo: string;
  NoteMasterID: string = '';
  ViewScheduleflag: boolean;
  SampleArray = [];

  // Booking Param
  DCDRfqId: string='';
  ExternalRfqId: string;
  BestPriceabs: number;
  // TemplateID: number;
  // TemplateCode: string;
  Errormsg: string;
  Orderplace: string = '';
  loadflag: boolean;
  ProductName: string;
  ProductID: number;

  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
  UserID: string;
  ScheduleVisibility: boolean;
  ClearPricingFlag: boolean;
  PricingModels = ['Black Scholes', 'Heston'];
  SeletcedPricingModel: string;
  TenorOptions = [];
  PointShift: number = 0;
  disabledPrembtn: boolean;
  FirstFixingDate: any=''; //Urmila A | 4-Sep-23
  NoOfSett: any;
  CustomerID: string = "";
  selectedCustomerDetails: any=[]=[];
  CustomerName: any = "";
  IBPremComment: string;
  ClientPremComment: string;
  SelectedPricingMode: string = 'Auto';
  SelectedLPForPricing: string = 'Best Price';
  PricingModes = ['Auto', 'Manual'];
  OptionCutOptions = [];
  OptionCut: string;
  SelectedIBType: string = 'IB Pays';
  SelectedClientType: string = 'Client Pays';
  DisableCCYChangeControl: boolean = false;
  NotionalDecimalPointShift: number = 2;
  KIRate: string = '';

  // KIStyleOptions = ['E-101', 'E-102', 'E-112', 'No'];
  KIStyleOptions = ['Yes', 'No'];
  SelectedKIStyle: string = 'No';
  CappedLossYNOptions = ['Yes', 'No'];
  SelectedCappedLossYN: string = 'No';
  CappedLossCcyOptions = ['EUR', 'USD'];
  SelectedCappedLossCcy: string = 'USD';
  // FinalPayTypeOptions = ['Exact', 'Full', 'None']; commented by UrmilaA, 3-may-23 | LGTGTWINT-1947
  FinalPayTypeOptions = []; //added by UrmilaA, 3-may-23 | LGTGTWINT-1947
  SelectedFinalPayType: string = '';  //added by UrmilaA, 3-may-23 | LGTGTWINT-1947
  SelectedFixingAdjustment: string = ''; //added by UrmilaA, 3-may-23 | LGTGTWINT-1947

  // SelectedFinalPayType: string = 'Exact';  //Urmila A | 2-Feb-23 | LGTCLI-288
  // FixingAdjustmentOptions = ['Notional', 'Strike', 'None'];
  // SelectedFixingAdjustment: string = 'Notional'; //Urmila A | 2-Feb-23 | LGTCLI-288

  CappedLossAmount: string = '0';
  ViewSchedule: boolean = false;

  StrikeRatePointShift: number = 0;
  PipsMultiplier: number = 0;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;
  IsRMLoggedIn: boolean = false;
  IsRouteToDealerExecuted: boolean = false;

  Remark: string;
  OriginalIBPrem: any = 0;
  DealingRFQID: string = '';
  RMRemark: string = '';
  ContractSummary: any = '';
  QueueStatus: string = '';

  AllDataLoaded = {
    productDetail: false,
    productinfo: true,
    ccypairs: false,
    optioncut: false,
    tenor: true, //modified by Urmila A | 18-feb-23
    priceprovider: false,
    bidask: false,
    datecalculation: false,
    firstfixingdate: false
  };
  firstTimeExecuted: boolean = false;
  maxClientProfitCcy1: any;
  maxClientProfitCcy2: any;

  //---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29
  SaveTradeEnabledFlag: boolean = false
  SaveTradeLoader: boolean = false
  disabledRoutetodealeronSaveTrade: boolean = false
  SavetradePopup: boolean = false
  //---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29

  // Added by Urmila A | start
  // EntityData: any[] = []; commented by UrmilaA, LGTGTWINT-1898 | 24-april-23
  UpfrontVal: any;
  CustPrem: any;
  Pair_Cross_YN: any;
  Left_USD_Pair: any;
  Right_USD_Pair: any;
  LeftUSDMidrate: any;
  RightUSDMidRate: any;
  SpotMidRate: any;
  FirstFixingChangedYN: any = 'N';
  QuteMailClicked: boolean = false;
  NoofSettChangeYN: any = 'N';
  ExceptionWarningMsg: any = '';
  CustPAN: any = '';
  routeToDealerClicked: boolean = false;
  routeToDealerClickedloader: boolean = false //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  confirmedRouteDealer: boolean = false;
  ProdChangedYN: boolean = false;
  OrderClicked: any = false;
  firstFixChngAndDatesReceived: boolean = false;
  ExecutedQueue: boolean = false;
  NewOrderfromRMLocked: boolean = false;
  NewOrderfromRMUnlocked: boolean = false;
  TradeIdea: boolean = false;
  ExpiredTradeIdea: boolean = false;
  RejectedOrder: boolean = false;
  Parant_DCDRFQID: any=''; //Urmila , 30-mar-23
  DI_YN: any=''; //Urmila , 30-mar-23
  FXD_RFQDealDetailsNavigateSubscriber: any;
  RFQDetailsFromNoteMasterSubscrber: any;
  BlotterRFQ: any;
  RejectSubscriber: any;
  RejectRedirectedOrder: boolean = false;
  RejectedOrderMSG: any = '';
  DealerLoggedIn: boolean = false;
  unlockNotemasterSubscriber: any;
  unlockNoteMasterYN: boolean = false;
  LockedDealPopUp: any = false;
  RFQLockedSecLeft: any = 0;
  RFQLockedInterval: any;
  RFQLockedBy: any;
  ccy1: boolean = false;
  ccy2: boolean = false;
  ClearLPs: boolean = false;
  DIfromTradeIdea: any = '';
  NotionalToggle: boolean=false;
  CurrencyChanged:boolean=false; //Added by Urmila A | 7-Jan-23
  @Input() RFQDetailsFromBlotterYes_QueueStatus: any;
  AllAPIsLoaded:boolean=false//Urmila A | LGTGTWINT-1295 | 2-Feb-23 
  RMRemarkVisibility:boolean=false; //Urmila A | LGTCLI-294
  ClientPremDir:any=''; //UrmilaA | 13-feb-23 | LGTCLI-304
  PriceRecvFromLPs:any=0; //UrmilaA | 16-feb-23 | LGTCLI-315
  IsNavigate: boolean=false; //Urmila A | 17-Feb-23
  scheduleBtnClick:boolean=false; //Urmila A| 3-Mar-23
  NDFFlag: string='N';
  isMetal: string='N';
  noResponseRecv: boolean=false;  //LGTGTWINT-1774, 29-Mar-23, Urmila A
  RouteFromQuoteHistory:boolean=false; //urmila A, 29-mar-23
  // Added by Urmila A | end
 

  //Button visibility checks  | added by Urmila A | LGTGTWINT-1455 | 27-Feb-23
  isSpreadVisible:boolean=false;
  isEmailQuoteVisible:boolean=false;
  isSchedulevisible:boolean=false;
  isResetvisible:boolean=false;
  isRoutetoDealerVisible:boolean=false;
  isSaveTradevisible:boolean=false;
  isOrderBtnVisible:boolean=false;
  isRejectVisible:boolean=false;

  CommomDataSubscriber:Subscription;
  //ends


  //added by UrmilaA, LGTGTWINT-1947 | 3-May-23 |start
  finalPaySub:Subscription;
  fixingAdjSub:Subscription; 
  targetTypeSub:Subscription;
  TargetTypes:any[]=[]
  selectedTargetType:any='';
  FixingAdjustment:any[]=[]
  //added by UrmilaA, LGTGTWINT-1947 | 3-May-23 | ends


  //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |start
  isQENMode:boolean=false;
  isSENMode:boolean=false;
  //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |ends

  // START - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForOptions = []; 
  SelectedSolveFor : any;  
  SolveFor : any; 
  SolveforStrike : boolean = false; 
  Strike_value : string;
  // END - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023


  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 


  PremDecimal: any;
   //Added by Urmila A | 9-Jan-23 | start | for checking screen width , height
   public getScreenWidth: any; //Added by Urmila A | 9-Jan-23
   public getScreenHeight: any; //Added by Urmila A | 9-Jan-23
   @HostListener('window:resize', ['$event'])
   onWindowResize() {
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;
     console.log('Width:',this.getScreenWidth, 'Height',this.getScreenHeight)
   }
 //Added by Urmila A | 9-Jan-23 | end
     
  //LGTGTWINT-1895 | UrmilaA | start
  FixingFreqArr:any[]=[]
  fixingSubscriber:Subscription;
  //LGTGTWINT-1895 | UrmilaA | ends

  // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  UseFinSPL:any = 'NO';
  FinSPLFilePath:any = "";
  public FXDFinSPL: Subscription;
  // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024

  ShowPriceProvider:boolean;
  showPPDropdown:boolean;

  constructor(
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    public datepipe: DatePipe,
    public ref: ChangeDetectorRef,
    public sanitize: SanitizeHtmlPipePipe,
    public CustAPI: CustomerApiService, //Urmila A | LGTGTWINT-1455 | 27-feb-23
    public SignalR : FXDSignalRService //UrmilaA, LGTCLI-361 | 16-May-23
  ) {
    this.ClearPricingFlag = false;
    this.SeletcedPricingModel = '';
    this.disabledPrembtn = false;
    let Daystring;
    const Day = this.d.getDate();
    Day < 10 ? (Daystring = '0' + Day) : (Daystring = '' + Day);
    // this.TradeDate =
    //   Daystring +
    //   '-' +
    //   this.months[this.d.getMonth()] +
    //   '-' +
    //   this.d.getFullYear();
    this.TradeDate = this.FXD_cfs.convertDate(new Date()) //Urmila A | 3-Mar-23
    this.CustomerID = '';
    this.NotionalPerFixing = '100,000.00';
  }

  PriceproviderArr: any[]=[];

  ngOnInit() {
    
    this.fnSetEntity()   //UrmilaA, 3-May-23 | LGTGTWINT-1949

    this.getScreenWidth = window.innerWidth; //Added by Urmila A | 9-Jan-22
    this.getScreenHeight = window.innerHeight;  //Added by Urmila A | 9-Jan-22

    //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |start
    if(this.FXD_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }else if(this.FXD_cfs.fngetMode() == 'SEN'){
      this.isSENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }
    //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |ends

    if(this.AllowSolveForYN === true){
      this.SolveForOptions = ['Spread', 'Strike']; 
    }else{
      this.SolveForOptions = ['Spread']; 
    }
   

    // Urmila A | check View schedule pop-up visibility | start | 8-Dec-22
    this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res => {
      if (res === false) {
        this.ViewScheduleflag = false
      } else {
        this.ViewScheduleflag = true
      }
    });
   

    //Urmila A | Workflow Deal details | LGTGTWINT-561 | start
    //modified by Urmila A, 29-mar-23 |  LGTGTWINT-1758, start
    this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes: any) => {
      try {
        if (navigateRes.navigate === true && navigateRes.ProdcutCode === 'TEKO' || navigateRes.ProdcutCode === 'TARFSELL') {
          this.IsNavigate = true;
          console.log('after redirect data: ', navigateRes);
          this.fnResetpricingFlags(); //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
          //Mode changes done by Urmila A, 6-april-23 | LGTGTWINT-1758 (mention in comment)
          this.Mode = navigateRes.redirectFrom === 'blotter' ?  this.FXD_cfs.fngetMode() : 'QEN'; //Urmila A | 15-Feb-23 | LGTCLI-286

          this.RFQDetailsFromNoteMasterSubscrber = this.FXD_afs.FXDGetRFQDetailsFromNoteMasterIDAPI(navigateRes.ReFNo, this.FXD_afs.UserName,this.Mode) //API req modified by Urmila A | 21-Aug-23 | Core migration 
            .subscribe((res: any) => {
              try {
                if (res !== null) {
                  console.log('RFQ from Note master: ', res, 'RFQDetailsFromBlotterYes_QueueStatus', this.RFQDetailsFromBlotterYes_QueueStatus);
                  if (res.length === undefined) {
                        if(navigateRes.redirectFrom === 'blotter'){
                              this.DI_YN = 'N';
                              this.Parant_DCDRFQID = '';
                              this.NoteMasterID = '';
                              this.DIfromTradeIdea = 'N'; //Urmila A | 19-Jan-23
                              this.NoteToUnblock = navigateRes.ReFNo;
                              switch (this.RFQDetailsFromBlotterYes_QueueStatus) {
                                case 'Executed Orders':
                                  this.ExecutedQueue = true;                    
                                  break;
                                case 'Trade Idea':
                                  this.TradeIdea = true;
                                  this.DI_YN = 'Y';
                                  this.DIfromTradeIdea = 'Y';
                                  this.Parant_DCDRFQID = res.ParentRFQNumber;                    
                                  break;
                                case 'Expired Trade Idea':
                                  this.ExpiredTradeIdea = true;                   
                                  break;
                                case 'New Order from RM':
                                  if (res.LockStatusMsg === '') {
                                    this.NewOrderfromRMUnlocked = true;
                                    if (res.DI_YN === 'N') {
                                      this.DI_YN = 'N';
                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                      this.NoteMasterID = navigateRes.ReFNo;
                                      this.fnRFQLockerForTimer();                       
                                    }
                                  } else if (res.LockStatusMsg !== '' && !res.LockStatusMsg.includes(this.FXD_afs.UserName)) {
                                    this.NewOrderfromRMLocked = true;
                                    if (this.DI_YN === 'Y') {
                                      this.DI_YN = 'Y';
                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                      this.NoteMasterID = navigateRes.ReFNo;                       
                                    }
                                    this.LockedDealPopUp = true;
                                  } else if (res.LockStatusMsg !== '' && res.LockStatusMsg.includes(this.FXD_afs.UserName)) {
                                    this.NewOrderfromRMUnlocked = true;
                                    this.DI_YN = res.DI_YN;
                                    this.Parant_DCDRFQID = res.ParentRFQNumber;
                                    this.NoteMasterID = navigateRes.ReFNo;                      
                                    this.fnRFQLockerForTimer();
                                  }
                                  break;
                                case 'Rejected Orders':
                                  this.RejectedOrder = true;                     
                                  break;
                          }
                          this.RMRemarkVisibility = this.FXD_cfs.fnRMremarkVisibility(
                          this.RFQDetailsFromBlotterYes_QueueStatus) //Urmila A | 13-feb-23 | LGTCLI-294
      
                          this.RouteFromWorkflow = true;
                        }else if(navigateRes.redirectFrom === 'quotehistory'){
                          this.RouteFromQuoteHistory=true;       

                        }
                   

                    this.fnAssignDataLoadValues()
                    this.fnSetRFQDetailsFromNotemasterID(res);
                    this.fnButtonVisibility(); //Urmila A | 27-feb-23 | LGTGTWINT-1455
                    // this.fnGetProductDetails();

                  }
                } else if (res == null) {
                  console.log('error',res)
                  // this.NotificationFunction("Error", "Error", res)
                }
               //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, end
              }catch(err) {
                // throw err // Commented By Ketan S due to Interceptor stability issue
              }
            })
        } else if (navigateRes.navigate === undefined || navigateRes.navigate === false) {
          // this.fnGetProductDetails();
          // this.SetDefaultValues();
        }
      } catch (err) { console.log(err) }
    })

    //Urmila A | Workflow Deal details | LGTGTWINT-561 | end

    //Added by Urmila A, 16-may-23, LGTCLI-361 - start
    this.SignalRsubscriber = this.FXD_afs.FXDSignalRBroadcastMsgObs.subscribe((BroadCastMsg:any)=>{
      try{
        if(BroadCastMsg !== null){
          console.log('recv broadcast msg:',BroadCastMsg )        
          this.signalRMsgRecv=true;
          this.BroadCastData=BroadCastMsg
          this.MapRFS(BroadCastMsg)
        }
      }catch(err){
        console.log('err:',err)
      }
    })
    //Added by Urmila A,  16-may-23, LGTCLI-361 - end

    //Urmila A | 20-feb-23 | LGTGTWINT-1444 | start 
    if(!this.IsNavigate){ 
      // this.getEntityData(); //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
      console.log('in TRF details from parent:', this.Product_ID,this.Product_Code,
      this.Product_Name, this.Template_Name, this.TemplateCode)
      this.SetDefaultValues();
      this.fnButtonVisibility()
      if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
        this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
          this.fnGetProductConfig(); //Added by UrmilaA, 16-May-23, fnGetProductConfig | LGTCLI-361 
         
          this.AllDataLoaded.productDetail = true;
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
            this.AllAPIsLoaded=true;
          }  
          this.getTargetType()   //added by UrmilaA, LGTGTWINT-1947 | 17-may-23
          this.getFinalPaytype()   //added by UrmilaA, LGTGTWINT-1947 | 3-may-23
          this.fnGetPriceProviderandCcypairs();  
          this.fnGetCCypair();
          this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
      }else{
          this.fnGetProductDetails(); 
      }            
    }  
    this.LoadingTRFFlag = false;
  }

  //added by Urmila A, 29-Mar-23 
  fnAssignDataLoadValues(){
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;
    this.AllDataLoaded.firstfixingdate = true;
    this.AllDataLoaded.datecalculation = true; //Urmila A | 2-Feb-23 | LGTGTWINT-1295
    this.OrderPlacedPopup = false;
  }

  //Added by Urmila A, 16-May-23 | LGTCLI-361 | start
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
                      
                    // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                    if(element.Setting_Name == 'UseFinSPLOutputExpressionForLPMapping'){
                      this.UseFinSPL = element.Value.toUpperCase();
                    }
  
                    if(element.Setting_Name == 'FinSPLOutputExpressionFilePath'){
                      this.FinSPLFilePath = element.Value.toUpperCase();
                    }
                    // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 

                    // START : Added By Anmol B || 15-Apr-2024 || JIRA ID : F5SAAINT-3655
                    if(element.Setting_Name == 'OPTDEN_ShowPremiumAmtOnBestPriceGrid'){
                      this.showPremAmt = element.Value.toUpperCase();
                    }
                    // END : Added By Anmol B || 15-Apr-2024 || JIRA ID : F5SAAINT-3655

                    // Start : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 

                    if(element.Setting_Name == 'OPTDEN_ShowIndicativeTermsheet'){
                      if(element.Value !== ""){
                        this.showtermsheetRM = element.Value.toUpperCase();
                      } else{
                        this.showtermsheetRM = "NO"
                      }
                    }

                    if(element.Setting_Name == 'OPTDEN_ShowIndicativeTermsheet_Dealer'){
                      if(element.Value !== ""){
                        this.showtermsheetDealer = element.Value.toUpperCase();
                      } else{
                        this.showtermsheetDealer = "NO"
                      }
                    }

                    // End : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024

                });
            }else if(res == null){  //conditions modified by Urmila A | 28-Aug-23
              this.MinQuoteTimeout = '30';
                this.MaxQuoteTimeout = '90';
                this.UseFinSPL = "NO"; // Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                this.FinSPLFilePath = ""; //  Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024
                this.showtermsheetRM = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
                this.showtermsheetDealer = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
            } 
           
          }
    }catch(err) {console.log(err)}
  })
}
//Added by Urmila A, 16-May-23 | LGTCLI-361 | ends


  //Added by Urmila A | LGTGTWINT-1455 | 27-feb-23 | start
  fnButtonVisibility(){
    let chkMode = this.FXD_cfs.fngetMode();
    this.isEmailQuoteVisible = this.isSchedulevisible = this.isResetvisible = true;

    this.fnbtncheck('TradeIdeaBtnAccess_LoginUserGroup', 
    this.RouteFromWorkflow ? this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')
    
    //Modified by Urmila A | 9-Mar-23 , currenly not using common data for Single pricer
    if(!this.RouteFromWorkflow){
      this.isSpreadVisible = true;
    }else{
      this.fnbtncheck('FXD_Spread_Btn_Visibility', this.RouteFromWorkflow === true ?
      this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')
    }

    if(chkMode === 'SEN'){
      this.isOrderBtnVisible = false; // Order Button disabled | Chaitanya M | 02-April-2024      
      
      // Start : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
      if(this.showtermsheetDealer.toUpperCase() === "YES") {
        this.ViewIndicativeTermsheet = true;
      } else{
        this.ViewIndicativeTermsheet = false;
      }
      // End : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024


    }else if(chkMode === 'QEN'){
      this.isRoutetoDealerVisible = true;

      // Start : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
      if(this.showtermsheetRM.toUpperCase() === "YES") {
        this.ViewIndicativeTermsheet = true;
      } else{
        this.ViewIndicativeTermsheet = false;
      }
      // End : EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024

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
              //fngetCommondata added by Urmila A | 29-Aug-23
                    this.CommomDataSubscriber = this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res ) {
                       //mappings modified by Chaitanya M | 29-Nov-23
                      res = res.cvpData;
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
                            if(element.value.includes(',')){
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
                    }              
                  });
                
                  break;
            case 'FXD_Spread_Btn_Visibility':
              //fngetCommondata added by Urmila A | 29-Aug-23
              this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                      //mappings modified by Chaitanya M | 29-Nov-23
                      res = res.cvpData;
                      res.forEach(element => {
                        if (chkRoute.toUpperCase() === element.DATA_VALUE.toUpperCase()) {                                                           
                              if(element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))){
                                this.isSpreadVisible = true;
                              }                                      
                        }
                      }); 
                      console.log('this.isSpreadVisible',this.isSpreadVisible)                     
                    }              
                  });
                  break;
      }    
  }
  //ends

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


  // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 16-Dec-22
  fnSetRFQDetailsFromNotemasterID(data) {
    this.selectedProduct = data.Product_Code;
    this.ProductName = this.Product_Name = data.Product_Name;
    this.OrderDirection = data.Product_Code === 'TARFSELL' ? this.OrderDirection = 'Sell' : this.OrderDirection = 'Buy';
    this.ProductType = data.Product_Code === 'TARFSELL' ?  'tarfsell' : 'tarfbuy' ;
    this.Product_Code = data.Product_Code;  //Urmila A | 23-Jan-23 | LGTGTWINT-1170
    this.AltCcy = data.Alternate_Ccy;
    this.DepCcy = data.Deposit_Ccy;
    // this.AskSpot = data.Ask_Rate;
    this.SelectedPricingMode = data.AutoManual_Type;
    // this.BidSpot = data.Bid_Rate;
    this.custPremDirection = data.CustPayReceiveDir;
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila a | 16-feb-23 | LGTCLI-314
    this.CcySearch = this.CurrencyPair = data.Deal_Pair;  //Added by Urmila A | 11-Jan-23
    this.fnPointShift(data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23
    this.NotionalPerFixing = this.FXD_cfs.numberWithCommas(data.NotionalPerFixing);
  
    //Freq changes added by Urmila
    let frequency = data.Frequency
    this.FixingFreqArr.push(frequency);
    this.FixingSettFreq=this.FixingFreqArr[0]; 

    this.NoOfSett = data.NoOfSettlement;
    this.SelectedKIStyle = data.KIType === 'No' || data.KIType === '' ? 'No' : 'Yes';
    this.Leverage = data.Leverage;
   
    this.GuaranteedPeriods = data.GuaranteedPeriods;
    let entity = {
      Code: data.Entity_ID, Value: data.Entity_Name
    }
    this.EntityData.push(entity);
    let optioncut = data.OptionCut
    this.OptionCutOptions.push(optioncut);
    this.BlotterRFQ = data.ParentRFQNumber;

    //added by Urmila A, LGTGTWINT-1824 , 4-april-23
    if(this.RouteFromWorkflow){
      this.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.Premiumdate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.FinalFixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date);
      this.FinalSettDate = this.FXD_cfs.convertDate(data.Deposit_End_Date);
      this.prevFirstFixingDate = this.FirstFixingDate = this.FXD_cfs.convertDate(data.FirstFixingDate); //added this.prevFirstFixingDate bu Urmila A, 5-april-23
    }else{
      this.TradeDate = this.FXD_cfs.convertDate(new Date())
    }
   
    this.OptionCut = data.OptionCut;
    this.TenorDays = data.Option_Days;
    this.Tenor = data.Input_Tenure;
    this.TenorOptions.push(data.Input_Tenure)
    this.NotionalAmt = this.FXD_cfs.numberWithCommas(data.OptionNotional !== '' ? Number(data.OptionNotional).toFixed(2) : ""); 
    this.NotionalCcy = data.Deposit_Ccy;
    this.IBPremCcy = data.RFQ_Prem_Ccy;
    this.Upfront = data.Spread_PA;

    if(data.RFQ_Mkt_Prem_Amt1.includes(',')){ //Added by Urmila A | 9-Jan-23 | LGTGTWINT-890
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1.replaceAll(',','')).toFixed(2));
    }else{
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1).toFixed(2));
    }
   
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2)); //upfront in Alt ccy
    this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2)); //upfront in USD
    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");
    // this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:black", "color:white"));
   
    // this.ContractSummary = this.FXD_cfs.fngetContractSumm(data.Contract_Summary); //added by UrmilaA | LGTGTWINT-2123 |14-June-23

    if(data.Contract_Summary.includes('color:green')){ //Urmila A | 16-feb-23 |LGTGTWINT-1429
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:green","color:var(--green) !important"))
    }else if(data.Contract_Summary.includes('color:red')){
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:red","color:var(--red) !important"))
    }else if(data.Contract_Summary === ''){
      this.ContractSummary=''
    }

    this.RMRemark = data.RM_Remark;
    
    //Urmila A | Dealer remark visibility check | 24-feb-23 | LGTGTWINT-1504
    if(!this.TradeIdea){
      this.DealerRemark = data.Dealer_Remark; 
    }else if(this.TradeIdea){
      this.DealerRemark = '';
    }
    // this.SelectedLPForPricing = this.SampleArray[Number(data.RFQ_Price_Provider_ID)];
    this.OriginalIBPrem = Number(data.ParentRFQIBPremium.toString().replace(',', '')).toFixed(2); //Added by Urmila A | 12-Jan-23 | LGTGTWINT-1018
    this.OriginalIBPremPer = data.Market_Premium_PC;
    this.KORate = data.OptionLowerBarrier;
    //target type changes added by Urmila A | 24-nov-23
    this.TargetTypes.push(data.TargetType);
    this.Type = this.TargetTypes[0];
    this.Targetpips = data.TargetInPips;  //Urmila A | LGTGTWINT-1447 |20-feb-23 
    this.TargetBF =data.TargetInBF;  //Urmila A | LGTGTWINT-1447 |20-feb-23 

    if(data.FinalPayType === 'No Payment'){ data.FinalPayType = 'None' }

     //FinalPayType  changes added by Urmila A | 24-nov-23
    this.FinalPayTypeOptions.push(this.FXD_cfs.TitleCase(data.FinalPayType));
    this.SelectedFinalPayType =  this.FinalPayTypeOptions[0];
    this.FixingAdjustment.push(data.AdjustedType)
    this.SelectedFixingAdjustment = this.FixingAdjustment[0];   
   
    this.ClientPrem = 0.00;
    this.RFQLockedBy = data.LockStatusMsg;
    // this.KIStyleOptions.push(data.KIType)
    if (!this.ExecutedQueue) {
      this.fnGetProductDetails(); //Re-positioned by Urmila A | 23-Jan-23
      this.fnGetPriceProviderandCcypairs();
      this.fnGetOptionCutFXD();
      this.getTargetType() 
      this.getFinalPaytype()   //added by UrmilaA, LGTGTWINT-1947 -hotfix | 29-may-23
      this.fnGetFixingFreq(); //UrmilaA | LGTGTWINT-1895 | 5-July-23
      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory){
          // this.fnGetBidAskRates()
          this.NoteMasterID='0'
          this.FirstFixingChangedYN='N'
          this.FirstFixingDate='';
        
          this.fnGetDatesCalculationforVB();  
      }
      
    }
    this.fnGetProductConfig(); 
  }

  // Added by Urmila A | RFQ Deal details
  fnRFQLockerForTimer() {
    this.RFQLockedSecLeft = 3000;
    this.RFQLockedInterval = setInterval(() => {
      if (this.RFQLockedSecLeft > 0) {
        this.RFQLockedSecLeft--;
      }
      if (this.RFQLockedSecLeft === 0) {
        clearInterval(this.RFQLockedInterval);
        this.fncallUnlockDeal();
      }
    }, 1000);
  }

  //Added by Urmila A | RFQ Deal details Unlock deal | 20-Dec-22 
  closeLockedDeal() {
    this.LockedDealPopUp = false;
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

  fnGetProductDetails() {
    try {
      // this.AllDataLoaded.productDetail = false;
      this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
       //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
      this.FXDProductDetailsSubscriber = this.FXD_afs.fnGetProdDetailsFXD(this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
        if (res) {  //mappings modified by Chaitanya M | 29-Nov-23
          this.AllDataLoaded.productDetail = true;
          // Start - mappings modified by Chaitanya M | 29-Nov-23
          res = res[0] 
          this.TemplateCode = res.Template_Code;
          this.Product_Name = res.Product_Name;
          this.TemplateID = res.Template_Id;
          this.Product_ID = res.Product_Id;
          this.Product_Code = res.product_code;
          // End - mappings modified by Chaitanya M | 29-Nov-23
          console.log('prod details', this.TemplateCode, this.Product_Name, this.TemplateID, this.Product_ID);
          // this.fnGetProductInfo();
          // !this.RouteFromWorkflow
          if(!this.IsNavigate){
              this.fnGetPriceProviderandCcypairs();
              this.fnGetCCypair()
              // this.fnGetTenor(); 
          }
        }
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
          this.AllAPIsLoaded=true;
        }
      });
    } catch (error) {
      console.log(error);
      // throw error; // Commented By Ketan S due to Interceptor stability issue
    }
  }

  fnGetProductInfo() {
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
    this.AllDataLoaded.productinfo=false;  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
    this.productInfoSubscriber = this.FXD_afs.fnGetAllProductinfo(
      this.FXD_afs.EntityID, this.Mode, this.FXD_afs.UserName, this.Product_Code)
      .subscribe(res => {
        try {
          if (res) {
            this.AllDataLoaded.productinfo = true;
            if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetAllProductInfoResult)) {
              res.GetAllProductInfoResult.ProductDetails.forEach(async (element) => {
                if (element.Product_Name === this.Product_Name && this.selectedProduct === 'tarfbuy') {
                 
                  this.Product_Name = element.Product_Name;
                  this.Product_Code = element.Product_Code;
                  this.Product_ID = element.Product_Id;
                  // this.fngetPersonalDefaultValues();  
                  //!this.RouteFromWorkflow, Urmila a , 29-mar-23
                  if (!this.IsNavigate) {
                    this.fnGetPriceProviderandCcypairs();
                  }
                  this.getEntityData();
                } else if (element.Product_Name === this.Product_Name && this.selectedProduct === 'tarfsell') {
                 
                  this.Product_Name = element.Product_Name;
                  this.Product_Code = element.Product_Code;
                  this.Product_ID = element.Product_Id;
                  // this.fngetPersonalDefaultValues(); 
                   //!this.RouteFromWorkflow, Urmila a , 29-mar-23
                  if (!this.IsNavigate) {
                    this.fnGetPriceProviderandCcypairs();
                  }
                  this.getEntityData();
                }
              });
              if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
                this.AllAPIsLoaded=true;
                
              }
            }

          }
        } catch (err) { }
      })

  }
 
  

   //added by UrmilaA, 16-May-23 | LGTCLI-361 | start
   closeSignalR(){
    if( this.ShowRFS && this.BestPrice && this.NoteMasterID !=='0'){  //!this.SignalR_unsubscriber &&
      this.CancelSignalRconnectionSub = this.FXD_afs.FXDResetDictionaryFromRFQIDAPI(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Product_Code, 
        this.SignalRQuoteIDs, this.DCDRfqId, this.NoteMasterID)
      .subscribe((res:any)=>{
        try{
          if(res){
            res=res.UnsubcribeRFQIDResult.A_ResponseReceived 
            this.SignalR_unsubscriber = res;   //UrmilaA |LGTCLI-361 | 24-May-23    
            if(res === true){           
              // this.loadflag=false;           
              console.log('btnEnable',this.btnEnable) 
              this.SignalRQuoteIDs='';
            }       
          }
      }catch(err){console.log(err)}
      })
  }
   } 
   //added by UrmilaA, 16-May-23 | LGTCLI-361 | ends

  ngOnDestroy() {
    this.Errormsg=''  //mappings modified by Chaitanya M | 29-Nov-23

    if(this.SignalRsubscriber){  //UrmilaA, 16-May-23, LGTCLI-361
      this.SignalRsubscriber.unsubscribe()
    }
    if(this.CancelSignalRconnectionSub){  //UrmilaA, 10-may-23, LGTCLI-361
      this.CancelSignalRconnectionSub.unsubscribe()
    }  
    this.DestroyFn() //added by UrmilaA, LGTCLI-361
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

  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 17-May-23 | start
  DestroyFn(){
    this.btnEnable=false; //UrmilaA |LGTCLI-361 | 22-May-23
    this.closeSignalR() //UrmilaA, 22-May-23,LGTGTWINT-1147
    this.OrderPlaced = false
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    this.scheduleBtnClick=false;
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 | 
    // this.RouteFromWorkflow = false;
    this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
      navigate: false,
      ProdcutCode: '',
      ReFNo: "",
      ProductID: '',
      redirectFrom: '' //Urmila A, 29-mar-23
    })
    if (this.FXD_RFQDealDetailsNavigateSubscriber) {
      this.FXD_RFQDealDetailsNavigateSubscriber.unsubscribe();
      if (this.RFQDetailsFromNoteMasterSubscrber) {
        this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
      }
    }
    this.fnUnsubscribeAllCalls();
  }
  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | ends

  fnUnsubscribeAllCalls() {
    if (this.unlockNotemasterSubscriber) {
      this.unlockNotemasterSubscriber.unsubscribe()
    }
    if (this.RouteFromWorkflow) {
      this.fncallUnlockDeal();
    }
    if (this.FXDProductDetailsSubscriber) {
      this.FXDProductDetailsSubscriber.unsubscribe();
    }
    if (this.productInfoSubscriber) {
      this.productInfoSubscriber.unsubscribe()    
    }
    if (this.FXPriceProvidersubscription) {
      this.FXPriceProvidersubscription.unsubscribe();  
    }
    if (this.FXDEntitySubscriber) {
      this.FXDEntitySubscriber.unsubscribe()
    }
    if (this.FXCurrencyPairsubscription) {
      this.FXCurrencyPairsubscription.unsubscribe();
    }
    if (this.FXBidAsksubscription) {
      this.FXBidAsksubscription.unsubscribe();
    }
    if (this.TenorDayssubscription) {
      this.TenorDayssubscription.unsubscribe();
    }

    if (this.FXDatesCalculationsubscription) {
      this.FXDatesCalculationsubscription.unsubscribe();
    }
    if (this.FXDOptionCutSubscriber) {
      this.FXDOptionCutSubscriber.unsubscribe()
    }
    if (this.Bestpricesubscription) {
      this.Bestpricesubscription.unsubscribe();
    }
    if (this.BookOrdersubscription) {
      this.BookOrdersubscription.unsubscribe();
    }
    if (this.BookOrdersubscription) {
      this.BookOrdersubscription.unsubscribe();
    }
    if (this.GetPriceProviderDetailsSubscription) {
      this.GetPriceProviderDetailsSubscription.unsubscribe();
    }

    if (this.GetTenorSubscriber) {
      this.GetTenorSubscriber.unsubscribe()
    }
    if (this.getBidaskSubscriber) {
      this.getBidaskSubscriber.unsubscribe()
    }

    if (this.FXDContractSummSubscriber) {
      this.FXDContractSummSubscriber.unsubscribe()
    }

    if (this.FXDSendQuoteMailSubscriber) {
      this.FXDSendQuoteMailSubscriber.unsubscribe()
    }

    if (this.PersonalDefaultValueSubscriber) {
      this.PersonalDefaultValueSubscriber.unsubscribe()
    }
    if (this.FXDRouteToDealerSubscriber) this.FXDRouteToDealerSubscriber.unsubscribe()
    if (this.prodDetailSubscriber) {
      this.prodDetailSubscriber.unsubscribe()
    }

    if (this.RejectSubscriber) {
      this.RejectSubscriber.unsubscribe()
    }
    if (this.RFQDetailsFromNoteMasterSubscrber) {
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
  fnGetPriceProviderandCcypairs() {
    console.log("pp details ", this.Product_Code);
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 
    this.AllDataLoaded.priceprovider = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 
    this.GetPriceProviderDetailsSubscription = this.FXD_afs.GetPriceProviderDetails(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Mode,
      this.UserGroup,
      this.FXD_afs.UserName,
      this.PricingMode,
     //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
    ).subscribe((res) => {
      this.PriceProviderString = '';
      if (res) {
        this.SampleArray = this.PriceproviderArr = res
        this.AllDataLoaded.priceprovider = true;
        //changes added by Urmila A, 17-April-23, to get Price provider string , made common function
        this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)  
        this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
      }    
      if(this.IsNavigate){ 
          this.fnGetSelectedCCYDetails();
      }

      if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
        this.AllAPIsLoaded=true;
      }

    });


  }

  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | start
  fnGetSelectedCCYDetails(){
    this.AllDataLoaded.ccypairs = false;   //LGTGTWINT-1369, Urmila A | 8-Feb-23 
    this.FXCurrencyPairsubscription = this.FXD_afs.fnGetFXDCurrencyPairs(  //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      this.DepCcy,
      this.AltCcy,
      this.CcySearch,
      this.OptionCut
    ).subscribe((res)=>{
      try{
        //mappings modified by Urmila A | 31-Aug-23 | as service side 
        if(res.length > 0 && res !== null){
          this.AllDataLoaded.ccypairs = true;       
          res.forEach(async (element, index) => {
            this.CurrencyPairList.push(element);
            if (this.CurrencyPairList[index].asset_Pair === 'EUR - USD') { 
              this.Pair_Cross_YN = element.pair_Cross_YN;
              this.Left_USD_Pair = element.left_USD_Pair;
              this.Right_USD_Pair = element.right_USD_Pair;  
              this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
              this.Asset2_DecimalAmount = element.asset2_DecimalAmount;                           
            }
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
  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | end

  fnGetCCypair() {
    this.AllAPIsLoaded=false; //Urmila A | 10-feb-23 | LGTGTWINT-1295
    this.AllDataLoaded.ccypairs = false; //Urmila A | 10-feb-23 | LGTGTWINT-1295
    this.FXCurrencyPairsubscription = this.FXD_afs.fnGetFXDCurrencyPairs(  //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode, 
      '',
      '',
      '', //CcySearch - Added by Urmila A | 11-Jan-23 
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
            try {
              this.CappedLossCcyOptions = [];
              this.CappedLossCcyOptions.push(this.DepCcy);
              this.CappedLossCcyOptions.push(this.AltCcy);

            } catch (ex) {
              console.log('Prem product found');
            }
          }
        });
        if (this.Pair_Cross_YN === 'Y') {
          this.FindLeftUSDMidRate(this.Left_USD_Pair);
          this.FindRightUSDMidRate(this.Right_USD_Pair);
        }
        this.FXD_cfs.sort_by_key(this.CurrencyPairList, 'asset_Pair');

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  fnGetOptionCutFXD() {
    this.OptionCutOptions = [];
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.optioncut = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.FXDOptionCutSubscriber = this.FXD_afs.fnGetOptionCutFXD(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      this.CurrencyPair,
      this.CustomerID,
      this.FXD_afs.UserName
    ).subscribe((res) => {
      if (res.length > 0 && res !== null) { //modified by Urmila A | 29-Aug-23
        this.AllDataLoaded.optioncut = true;
        res.forEach((element, i) => {
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 |start 
          if (element.OptionCut === 'BFIXTOK') {
            res.splice(i, 1)
            res.unshift(element)
          }
        });
        res.forEach(element => {
          this.OptionCutOptions.push(element.OptionCut);
        });
        this.OptionCut = res[0].OptionCut
        // Added by Urmila A | LGTCLI-167 | 1-Dec-22 | end
        //!this.RouteFromWorkflow, Urmila a , 29-mar-23
        if(!this.IsNavigate && !this.CurrencyChanged){
          // this.fnGetDatesCalculationforVB();
          this.functionGetTenorfromFixings()  //UrmilaA | 27-feb-23| LGTGTWINT-1538
        }
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }


  fnGetBidAskRates() {
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.bidask = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.FXBidAsksubscription = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      //mapping modified by Urmila A | 31-Aug-23
      if (res !== null) {
        this.AllDataLoaded.bidask = true;
        this.BidSpot = (parseFloat(res.BidRate).toFixed(Number(res.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        this.AskSpot = (parseFloat(res.AskRate).toFixed(Number(res.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        this.PointShift = res.PointShift; //Urmila A |27-feb-23 |LGTGTWINT-1526
        this.StrikeRatePointShift = Number(res.PointShift);
        this.PipsMultiplier = Number(res.PipsMultiplier);
        // this.SpotMidRate = parseFloat(res.MidRate); // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
        this.SpotMidRate = ((Number(this.AskSpot) + Number(this.BidSpot)) / 2 ).toFixed(res.PointShift);  // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
      
        this.GetStrikeRate();
        this.fnGetClientMaxProfit2('') //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
      }

      if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
        this.AllAPIsLoaded=true;
      }
    });
  }

  //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23 | start
  fnPointShift(data){
    this.FXBidAsksubscription = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {        //mapping changes done by ChaitanyaM  | 21-Nov-23
          
        this.PointShift = res.PointShift; //Urmila A |27-feb-23 |LGTGTWINT-1526
        // this.SpotMidRate =  ((Number(data.Ask_Rate) + Number(data.Bid_Rate)) / 2 ).toFixed(this.PointShift) //Added by Urmila A | LGTGTWINT-1693 | 9-mar-23
        this.Strike = Number(data.Strike_Rate).toFixed(this.PointShift);
        if (data.Product_Name === 'TARF Buy') {
          this.KIRate = Number(data.OptionLowerBarrier) > 0 ? Number(data.OptionLowerBarrier).toFixed(this.PointShift) : '';
          this.OrderDirection = 'Buy'
        } else {
          this.KIRate = Number(data.OptionUpperBarrier) > 0 ? Number(data.OptionUpperBarrier).toFixed(this.PointShift) : '';
          this.OrderDirection = 'Sell'
        }

         //added by Urmila A, LGTGTWINT-1824 , 4-april-23
         //changes done by Chaitanya M | LGT pack sync up | 24-nov-23
         if(data.RFQ_Deal_Dir === "S"){
          this.AskSpot = Number(data.Ask_Rate).toFixed(this.PointShift);
          this.BidSpot = Number(data.Spot_Rate).toFixed(this.PointShift);   
        }else{
          this.AskSpot = Number(data.Spot_Rate).toFixed(this.PointShift);   
          this.BidSpot = Number(data.Bid_Rate).toFixed(this.PointShift);
        }
        this.SpotMidRate =  ((Number(this.AskSpot) + Number(this.BidSpot)) / 2 ).toFixed(this.PointShift) //Added by Chaitanya M  | LGTGTWINT-1693 | 24-nov-23

        // this.maxClientProfitCcy1 = this.calcClientProfitCcy1();
        // this.maxClientProfitCcy2 = this.calcClientProfitCcy2();
        this.fnGetClientMaxProfit2('') //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
      }

     
    });
  }
  fnGetDatesCalculationforVB() {
   
    this.Premiumdate = '';
    this.FinalFixingDate = '';  // Urmila A | 6-Sep-22
    this.FinalSettDate = ''; // Urmila A | 6-Sep-22
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.datecalculation = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    // this.FXDatesCalculationsubscription = this.FXD_afs.GetDatesCalculationforVB(this.TemplateID, 'FXBarrier', this.Depoccy, this.Altccy, '' + this.Days, this.Tenor, this.OptionCut).subscribe(res => {
    this.FXDatesCalculationsubscription = this.FXD_afs.GetDatesCalculationforVB(
      this.FXD_afs.EntityID,
      this.Product_ID,
      // this.Product_Name,
      this.Product_Code,
      this.DepCcy,
      this.AltCcy,
      this.FixingSettFreq.split('/')[0],
      this.FixingSettFreq.split('/')[1],
      this.Tenor,
      this.OptionCut,
      this.TradeDate,
      this.Mode, //Core migration: API req parameters modified by Urmila A | 22-Aug-23
      this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  'N' : this.FirstFixingChangedYN , //Urmila A | LGTGTWINT-1203 | 31-Jan-23
      this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  '' : this.FirstFixingDate, //Urmila A | LGTGTWINT-1203 | 31-Jan-23
      ).subscribe((res) => {
       //mappings modified by Urmila A | 4-Sep-23
        if (res !== null) {
        this.AllDataLoaded.datecalculation = true;
  
        this.Premiumdate = res[0].valueDate;
        this.FinalFixingDate = res[0].fixingDate;
        this.FinalSettDate = res[0].maturityDate;
        this.TenorDays = res[0].expiryDays;
        if (this.FixingSettChngYN === 'Y' && !this.firstFixChngAndDatesReceived) {
          this.getfnCalculateFirstFixingDate();
        } else if (this.FirstFixingChangedYN === 'N' && this.NoofSettChangeYN === 'N') {
          this.getfnCalculateFirstFixingDate();
        }else if(this.CurrencyChanged){
          this.getfnCalculateFirstFixingDate();
        }else{ //Urmila A | 12-Jan-23 | start | LGTGTWINT-1003
          this.fnGetContractSummary();
        }//end | 12-Jan-23

       
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }

        // this.fnCalculateFirstFixingDate()
      }
    });
  }

  getfnCalculateFirstFixingDate() {
 
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.firstfixingdate = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
  
    this.FXDFirstFixingDateSubscriber = this.FXD_afs.fnGetFixingDateFromNoOfSett(
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
       
        this.FirstFixingDate = '';
        //added this.prevFirstFixingDate by urmila A, 5-april-23, LGTGTWINT-1846
        this.prevFirstFixingDate = this.FirstFixingDate =this.datepipe.transform(res.firstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23
        this.firstFixChngAndDatesReceived = true;
        this.FixingSettChngYN = 'N' //Urmila A | LGTGTWINT-1203 | 31-Jan-23
        
        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | start
        // if(!this.CurrencyChanged){ // Commented code by Urnila A | 24-Jan-23 , as NoofSettl to be user input only, as told by Rahul P, LGTGTWINT-1167
        //   this.NoOfSett = res.GetNumberofFixingsResult.FixingData.NoofFixings
        // } 
        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | end
        this.NotionalAmt = this.FXD_cfs.numberWithCommas(parseInt(this.NotionalPerFixing.replace(/,/g, '')) * Number(this.NoOfSett)); 
        
      }
      this.CurrencyChanged=false;  //Added by Urmila A | 7-Jan-23
      this.fnGetContractSummary();
      if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
        this.AllAPIsLoaded=true;
      }
    });
    
  }

  fnGetTenor() {
    this.AllDataLoaded.tenor=false //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.GetTenorSubscriber = this.FXD_afs.fnGetTenor(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      'T',
      this.FXD_afs.UserName
    ).subscribe((res) => {
      if (res) {  //mappings modified by Chaitanya M | 29-Nov-23
        this.AllDataLoaded.tenor = true;
        res = res[0];      //mappings modified by Chaitanya M | 29-Nov-23
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

  firstFixingDateChngfn(e) {  //Urmila A | LGTCLI-278 | 6-Feb-23
    let date:any = new Date( e.target.value)
    if(date.toString().includes('Sat') || date.toString().includes('Sun')){
        this.NotificationFunction("Error","Error" , 'First fixing date should not fall on holiday') //modified on 2-Mar-23 | LGTGTWINT-1607
    }else if(e.target.value !== ''){ //urmila A, 5-april-23 , LGTGTWINT-1846
      this.prevFirstFixingDate = this.FirstFixingDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd'); //Urmila A | 8-Mar-23
      this.FirstFixingChangedYN = "Y";
      this.AllDataLoaded.firstfixingdate = true; //Urmila A | 3-Feb-23
      this.fnGetDatesCalculationforVB();
    }else if(e.target.value === ''){  //urmila A, 5-april-23 , LGTGTWINT-1846
      this.FirstFixingDate = this.prevFirstFixingDate
      this.FirstFixingChangedYN = 'N';
    }
    
  }

  scroll(_idWorkFlowBlotter) {
    // this.vps.scrollToAnchor(idWorkFlowBlotter);
  }

  async SetDefaultValues() {
    this.CustomerID =  this.HomeAPI.CustomerId = '1';  
    this.HomeAPI.CustomerName = 'LGT-CUST001';
    this.Delta = null;
    this.DeltaAmt = null;
    this.DeltaCcy = '';
    this.CurrencyPair = 'EUR - USD';
    this.DepCcy = this.CurrencyPair.substr(0, 3);
    this.AltCcy = this.CurrencyPair.substr(6, 8);
    this.DepCcy = this.CurrencyPair.split('-')[0].trim();
    this.AltCcy = this.CurrencyPair.split('-')[1].trim();
    this.IBPremCcy = this.DepCcy;
    this.NotionalCcy = this.DepCcy;
    this.NotionalPerFixing = this.FXD_cfs.numberWithCommas("100000.00"); //Urmila A | 5-april-23, LGTGTWINT-1737

    //commented by Urmila A | 6-Mar-23
    // this.Tenor = '1Y';
    // this.TenorDays = 365;
    // if (this.Tenor.includes('W')) {
    //   this.TenorDays = parseInt(this.Tenor) * 7
    // } else if (this.Tenor.includes('M')) {
    //   this.TenorDays = parseInt(this.Tenor) * 30
    // } else if (this.Tenor.includes('Y')) {
    //   this.TenorDays = parseInt(this.Tenor) * 365
    // }
  

    //Urmila A | 6-Mar-23
    // this.ResetPricerFlag , removed by Urmila A | 17-Mar-23
    if(this.Product_Code === 'TEKO' ){
        this.ProductType = 'tarfbuy';
        this.Product_Name = 'TARF Buy';
        this.OrderDirection = 'BUY';
        this.selectedProduct = 'tarfbuy';
        // this.Product_Code = 'TEKO'; //Urmila A | 16-Jan-23 | LGTGTWINT-1052
    }else{

        this.ProductType = 'tarfsell';
        this.Product_Name = 'TARF Sell'
        this.selectedProduct = 'tarfsell';
        this.OrderDirection = 'SELL';
    }

    this.Leverage = 2;
    this.GuaranteedPeriods = '0';
    this.SelectedKIStyle = 'No';   
    this.SelectedFinalPayType = 'Exact'; //Urmila A | 2-Feb-23 | LGTCLI-288
    this.SelectedFixingAdjustment = 'Notional'; //Urmila A | 2-Feb-23 | LGTCLI-288
    // this.TemplateCode = 'TARFBUY';
    // this.NotionalAmt = '0.00';
    this.NotionalAmt = parseInt(this.NotionalPerFixing.replace(/,/g, '')) * Number(this.NoOfSett);

    // this.Tenor = '6M';
    // this.TenorDays = 183;
    this.IBPrem = '0.00';
    this.ClientPrem = '0.00';
    this.Upfront = null;
    this.UpfrontCcy = 0.0;

    //modified default settleFreq & Noofsett by Urmila A | LGTCLI-325 | 24-feb-23
    // this.FixingSettFreq = 'Weekly/Weekly';
    this.NoOfSett= 52;

    // this.NoofKOEvent = ''; commented by UrmilaA, LGTGTWINT-1953 | 5-may-23
    this.Type = 'Big Figure';
    this.Errormsg = '';
    this.loadflag = false;
    // this.NotionalAmt = '100,000.00';
    // this.PriceProviderString = '';
    this.OrderPlaceFlag = false;
    this.ViewScheduleflag = false;
    this.Targetpips = 0;
    this.TargetBF = 0; // Missing Default value for target in Big Figure | Chaitanya  M | 10 Oct 2023
    this.OrderBlotterVisibility = false;
    this.ScheduleVisibility = false;
    this.SeletcedPricingModel = 'Black Scholes';
    this.OptionCut = 'BFIXTOK';
    // this.FirstFixingDate='';
    this.FirstFixingChangedYN = 'N'
    this.UpfrontAlt = ''; //changed by Urmila A | 11-jan-23
    this.UpfrontVal = ''; //changed by Urmila A | 11-jan-23
    // this.FirstFixingDate='';
    this.custPremDirection = '';
    this.IBPremDirection = '';
    this.AltNotional = 0;
    this.KORate = '';
    this.KIRate = ''
    this.NoofSettChangeYN = 'N';
    this.FixingSettChngYN = 'N';
    this.ProdChangedYN = false;
    this.OrderClicked = false;
 
    this.RMRemark = '';
    this.firstFixChngAndDatesReceived = false;
    // this.RouteFromWorkflow = false;
    this.Parant_DCDRFQID = '';
    this.DI_YN = 'N';
    this.NoteMasterID = '0';
    this.ExecutedQueue = false;
    this.TradeIdea = false;
    this.ExpiredTradeIdea = false;
    this.NewOrderfromRMUnlocked = false;
    this.NewOrderfromRMLocked = false;
    this.RejectedOrder = false;
    this.BlotterRFQ = '';
    this.RejectRedirectedOrder = false;
    this.RejectedOrderMSG = '';
    this.unlockNoteMasterYN = false;
    this.RFQLockedBy = '';
    this.DealerRemark = '';
    clearInterval(this.RFQLockedInterval);
    this.ccy1 = false;
    this.ccy2 = false;
    this.ClearLPs = false;
    this.DIfromTradeIdea = '';
    this.CurrencyChanged=false; //Added by Urmila A | 7-Jan-23
    this.NoofKOEvent=0; //added by UrmilaA, LGTGTWINT-1953 | 8-May-23 | start
    this.BestPricelbl =  'Best Price' // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024
  }

  ResetAllFields() {
    this.ResetAllfieldsCalled=true; //Urmila A | LGTGTWINT-1332 | 4-mar-23
    this.PriceClick=false; //LGTGTWINT-2109 | UrmilaA
    this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.ClearLPs=true;
    if(this.BestPrice&& this.ServiceResponse !== null){ //Urmila A | 4-Mar-23 | LGTGTWINT-1209   
      this.closeSignalR()   //added by UrmilaA, 16-May-23 | LGTCLI-361
      this.NoteMasterID=''; 
    }
    this.fnSetAfterPriceValues(); //Added by UrmilaA | 13-June-23 | LGTGTWINT-2079
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 | 
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    // this.PricingMode.toUpperCase() !== 'MANUAL' ? this.IBPrem = '0.00' : '';  //commented by Urmila A | LGTGTWINT-972, 12-Jan-23
    this.Errormsg = '';
    this.loadflag = false;
    this.ViewScheduleflag = false;
    this.OrderBlotterVisibility = false;
    this.ScheduleVisibility = false;
    this.DealNo = '';
    this.ClearPricingFlag = true;
    this.orderMsg = ''
    this.Orderplace = '';
    // this.Upfront = null; //commented by Urmila A | LGTGTWINT-972
    // this.UpfrontAlt = ''; //commented by Urmila A | LGTGTWINT-972
    // this.UpfrontVal = ''; //commented by Urmila A | LGTGTWINT-972
    this.ref.detectChanges();
    this.DCDRfqId = ''
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted = false;
    this.firstFixChngAndDatesReceived = false;

  }

  BookDeal() {
    try {
     
      this.OrderPlaceFlag = true;
      this.OrderBlotterVisibility = false;
      this.ScheduleVisibility = false;
      let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)

      this.BookOrdersubscription = this.FXD_afs.BookOrderforVBNew(
        // this.FXD_afs.EntityID,
        // this.FXD_afs.UserName,
        // this.FXD_afs.GetToken(),
        // this.Product_Code,
        // this.FXD_afs.EntityID,
        // this.FXD_afs.UserName,
        // this.DCDRfqId,
        // this.ExternalRfqId.toString(),
        // this.BestPriceProvider,
        // this.Product_Code,
        // this.BestPrice,ActiveRemark

        this.FXD_afs.EntityID,
        this.FXD_afs.UserName,
        this.DCDRfqId,
        this.ExternalRfqId.toString(),
        this.BestPriceProvider,
        this.Product_Code,
        this.BestPrice,
        ActiveRemark   // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023

      ).subscribe((res) => { 
          if (res)  //mappings modified by Urmila A | 14-sep-23
          {         
            if (res !== null) {
              this.OrderPlaced = true
              this.OrderPlacedPopup = true
              this.OrderPlaceFlag = false;
              this.OrderClicked = false;
              this.ViewScheduleflag = false;
              this.Orderplace = res.External_TradeID;
              this.DealNo = res.DealNo;
              this.FXD_cfs.DealBooked.next(false)
              if (res.isProcessCompleted === true) {
                this.FXD_afs.FXD_RFQID.next(this.DCDRfqId);           
                this.orderMsg = res.Message;
                this.ClearPricingFlag = true;
              } else if (res.isProcessCompleted === false) {      
                this.orderMsg = res.Message;
              } else {
                this.Orderplace = '';
              }
            } else{
              this.OrderPlaced = true
              this.OrderPlaceFlag = false;
            }
          }

          else {
            this.OrderPlaced = true
            this.OrderPlaceFlag = false;
            // Urmila A | LGTGTWINT-1225 | 27-Jan-23 | start
            // if(res.ResponseTradeBookParameters.isOrderRejected === true && res.ResponseTradeBookParameters.RejectionReason !== ''){
            //     this.NotificationFunction("Error","Error", 'Order rejected due to some technical reasons')
            // }else if(res.ResponseTradeBookParameters.RejectionReason !== '' && res.ResponseTradeBookParameters.External_TradeID === null && res.ResponseTradeBookParameters.isOrderRejected === false){
            //       this.NotificationFunction("Error","Error", 'Order may have got executed or may have failed. Contact support')
            // }else{
            //   this.NotificationFunction("Error", "Error", res.A_ResponseHeader.FailedReason)
            // }// Urmila A | LGTGTWINT-1225 | 27-Jan-23 | end
            
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Modified by Urmila A | removed redundant getProductDetails API calls | 20-feb-23
  ProductChanged(e) {
  
  
    this.DestroyFn(); //UrmilaA, LGTCLI-361 | 17-May-23
    this.ResetAllFields()
    const target = this.FXD_cfs.GetEventTarget(e);
    this.selectedProduct = target.value
    this.ProductType = target.value;
    this.ProdChangedYN = true;
    this.AllDataLoaded = { // Urmila A |2-Feb-23 | LGTGTWINT-1295
      productDetail:true,
      productinfo: true,
      ccypairs: true,   //24-feb-23
      optioncut: true, //27-feb-23
      tenor: true, //Urmila a | 18-feb-23
      priceprovider: false,
      bidask: true,  //24-feb-23
      datecalculation: true, //27-feb-23
      firstfixingdate: true  //24-feb-23
    }

    this.FixingSettChngYN = 'N';
    this.NoofSettChangeYN = 'N';
    this.FirstFixingChangedYN='N';
    
    if (target.value === 'tarfbuy') {
      this.OrderDirection = 'BUY';
      this.Strike = this.AskSpot;
      document.getElementById('idAskSpot').style.color = '#808080';
      document.getElementById('idBidSpot').style.color = '#B6B6B6';     
    } else {
      this.OrderDirection = 'SELL';
      this.Strike = this.BidSpot;
      document.getElementById('idBidSpot').style.color = '#808080';
      document.getElementById('idAskSpot').style.color = '#B6B6B6';  
    }

    this.fnAssignDefaultvalues(); //Urmila A |LGTCLI-318| 24-feb-23
    this.fnSetAfterPriceValues(); //Added by UrmilaA | 7-June-23 | LGTGTWINT-2079
    this.fnAssignProdDetails(target.value)
    this.ProdChangedYN=false; //Urmila A | 24-feb-23

  }

  //Added by UrmilaA | 7-June-23 | LGTGTWINT-2079| start
  fnSetAfterPriceValues(){
    this.Upfront = (0).toFixed(4);
    this.UpfrontAlt = ''; 
    this.UpfrontVal = ''; 
    this.IBPrem='0.00'
   
  }
  //Added by UrmilaA | 7-June-23 |LGTGTWINT-2079| ends

  //Added by Urmila A | LGTCLI-318 | 24-feb-23
  fnAssignDefaultvalues(){
      this.KIRate='';
      //commented by UrmilaA , as update in jira LGTCLI-318 | 27-feb-23
      // this.SelectedKIStyle ='No';
      // this.FixingSettFreq = 'Weekly/Weekly';
  }

  //Urmila A | common function to assign product values | 20-feb-23 | start
  fnAssignProdDetails(prodCode){
      this.AllProdData.forEach(element => {
        if(element.Template_Code === prodCode.toUpperCase()){
                this.Product_ID = element.Product_Id;
                this.Product_Name = element.Product_Name;
                this.Product_Code = element.product_code;
                this.Template_Name = element.Template_Name;
                this.TemplateCode = element.Template_Code;
                this.TemplateID = element.Template_Id;
                // if(!this.RouteFromWorkflow), Urmila A , 29-mar-23
                if(!this.IsNavigate){ 
                  this.fnGetPriceProviderandCcypairs();
                  this.fnGetBidAskRates()
                  this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
                  this.fnGetContractSummary()
                  //commented by UrmilaA , as update in jira LGTCLI-318 | 27-feb-23
                  // if(this.ProdChangedYN){ //Added by Urmila A | LGTCLI-318 | 24-feb-23 
                  //   this.fnGetOptionCutFXD(); 
                  // }
                  if(!this.ProdChangedYN){
                    this.fnGetCCypair()
                  }
                  
                }
        }
      });
  }
  //end


  CurrencyPairChanged() {
    this.ResetAllFields();
    this.fnGetBidAskRates();

    // this.DepCcy = this.CurrencyPair.substr(0, 3);
    // this.AltCcy = this.CurrencyPair.substr(6, 8);
    this.DepCcy = this.CurrencyPair.split('-')[0].trim();
    this.AltCcy = this.CurrencyPair.split('-')[1].trim();
    this.IBPremCcy = this.DepCcy;
    this.NotionalCcy = this.DepCcy;

    //Added by UrmilaA, 26-April-23 | LGTCLI-418 | start
    if(this.SelectedKIStyle === 'Yes'){
        this.KIRate=''
    }
    //Added by UrmilaA, 26-April-23 | LGTCLI-418 | ends

    this.fnIsMetalInCcy();
    this.fnChangeNotionalCCY();
    this.fnGetContractSummary()
    // this.FXD_afs.GetDatesCalculationforVB(this.ProductID, this.ProductName, this.DepCcy, this.AltCcy, '' + this.TenorDays, this.Tenor, this.OptionCut);
    // this.fnGetDatesCalculationforVB();

    try {
      this.CappedLossCcyOptions = [];
      this.CappedLossCcyOptions.push(this.DepCcy);
      this.CappedLossCcyOptions.push(this.AltCcy);

    } catch (ex) {
      console.log('Prem product found');
    }
  }

  async TenorChanged() {
    this.ResetAllFields();
    try {
      this.fnGetDatesCalculationforVB();
    } catch (error) { }
    // this.FXD_afs.GetDatesCalculationforVB(this.ProductID, this.ProductName, this.DepCcy, this.AltCcy, '' + this.TenorDays, this.Tenor, this.OptionCut);

  }

  fnBestPricing() {
     //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | starts
     this.PriceRecvFromLPs=0;  //UrmilaA, 22-May-23, LGTCLI-361
     this.fnResetpricingFlags(); //UrmilaA, 30-May-23, LGTCLI-361
     this.ClearLPs = true;
    // this.SignalR_unsubscriber=false
     //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | ends
     this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23
    if (this.ServiceResponse !== null) {
    
      this.OrderPlaced = false; //UrmilaA | LGTGTWINT-1446 | 24-feb-23
      this.BestPrice=null ;//UrmilaA | LGTGTWINT-1941 | 2-May-23
    }
    let targetBF = 0;    
    targetBF = (this.Targetpips / 100);

    if(this.RouteFromWorkflow === true){   
      this.NoteMasterID = this.NoteToUnblock;   
    }else { 
      this.NoteMasterID = '0'
    }

    
    if (this.SelectedPricingMode === 'Auto') {
      let spotrate;
      this.ClearPricingFlag = false;
      this.Errormsg = '';
      try {
        let KIStyle: any;
        if (this.SelectedKIStyle === 'Yes') {
          if (this.Leverage === 1) {
            KIStyle = 'E-101'
          } else { KIStyle = 'E-102' }
        } else { KIStyle = 'No' } //Urmila A | 3-Mar-23
  
        this.ProductType === 'tarfbuy' ?  spotrate = this.AskSpot :   spotrate = this.BidSpot;

        this.fnIsMetalInCcy(); // HSBCFXEINT-25  | Chaitanya M | 06 Dec 2023
           
            //Added by Urmila A | According UAT req |start
            //customer ID, name changes added by UrmilaA, 17-April-23
            //EntityId changes by UrmilaA, LGTGTWINT-1908 | 24-April-23
            // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
            //<CustID>" + this.HomeAPI.CustomerId + "</CustID><Customer_Name>" + this.HomeAPI.CustomerName +"</Customer_Name>
            this.XMLString =
            "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><TargetInPips>" + (this.Type === 'Big Figure' ?  this.Targetpips : 0) + "</TargetInPips><TargetBF>" + (this.Type === 'Big Figure' ? targetBF : 0) +
            "</TargetBF><TargetGainunit>" + this.Type + "</TargetGainunit><NoofKOITMEvents>" + ( this.Type === 'ITM' ? this.NoofKOEvent : 0 ) +
            "</NoofKOITMEvents><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>N</NonDeliveryYN><FirstFixingDate>" + this.FirstFixingDate +
            "</FirstFixingDate><FixingSettFreq>" + this.FixingSettFreq + "</FixingSettFreq><Currency1>" + this.NotionalCcy + "</Currency1><CcyPair>" + this.CurrencyPair +
            "</CcyPair><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy><CustPrem>" + this.ClientPrem + "</CustPrem><TradeDate>" + this.TradeDate +
            "</TradeDate><PremiumDate>" + this.Premiumdate + "</PremiumDate><FixingDate>" + this.FinalFixingDate + "</FixingDate><SettDate>" + this.FinalSettDate +
            "</SettDate><BuySell>" + this.OrderDirection + "</BuySell><Spotrate>" + spotrate + "</Spotrate><LeverageFactor>" + this.Leverage +
            "</LeverageFactor><Ccy1PerFixing>" + this.NotionalPerFixing.replace(/,/g, '') + "</Ccy1PerFixing><Strike>" + this.Strike +
            "</Strike><TenorDays>" + this.TenorDays + "</TenorDays><Tenor>" + this.Tenor + "</Tenor><KIBarrierType>" + this.SelectedKIStyle +
            "</KIBarrierType><KIYesNo>" + this.SelectedKIStyle + "</KIYesNo><KI>" + this.KIRate + "</KI><KIStyle>" + KIStyle + "</KIStyle><UpperKI></UpperKI><FinalPayType>" + this.SelectedFinalPayType +
            "</FinalPayType><FixingAdjustment>" + this.SelectedFixingAdjustment + "</FixingAdjustment><CappedLoss>No</CappedLoss><CappedLossCcy>No</CappedLossCcy><CappedLossYN>No</CappedLossYN><CappedLossAmount>0</CappedLossAmount><Entity_ID>" + this.FXD_afs.EntityID +
            "</Entity_ID><CAI_ID>7400</CAI_ID><NoofSett>" + this.NoOfSett + "</NoofSett></Sheet1></ExcelSheets>"

        if (this.Errormsg === '' && this.Validations()) {
          this.priceLoader=true; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
          this.GenerateUserID();
          this.disabledPrembtn = true;
          this.FXD_afs.SetPricingProduct(this.Product_Name);
          let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)
        
          //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
          this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBNew( //Urmila A | 1-Feb-23 | changed subscriber
            this.FXD_afs.EntityID,
            this.FXD_afs.UserName,
            // this.FXD_afs.GetToken(),
            // this.Product_Code.toUpperCase(),
            this.Product_Code.toUpperCase(), //ProductType
            this.CurrencyPair,
            this.NotionalCcy,
            this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy,
            this.IBPremCcy,
            this.IBPremCcy,
            this.NotionalPerFixing.replace(/,/g, ''),
            // this.NotionalAmt.replace(/,/g, ''),
            'PREMIUM',
            this.OrderDirection.toUpperCase(),
            this.Strike.toString(),
            0, //'FXAQ' Changed by Mohan
            0, //'FXAQ' Changed by Mohan
            '',
            '',
            '',
            this.OptionCut,
            this.Tenor + '',
            this.Premiumdate,
            this.FinalFixingDate,
            this.FinalSettDate,
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
            this.NoteMasterID,
            // this.DIfromTradeIdea,
            // this.FXD_cfs.fngetMode() , //Urmila A | LGTGTWINT-1470 | 21-feb-23
            this.TradeDate,
            this.NDFFlag,
            this.isMetal, 
            this.ShowRFS, //UrmilaA, 16-May-23 | (SignalR, RFS | LGTCLI-361)
            '', //CallPut
            '0', //RMMarginPercentage / Upfront
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
           this.Targetpips//Target
  
            ).subscribe((res) => {
            this.ServiceResponse = [];
            this.ResetAllfieldsCalled=false; //Urmila A | LGTGTWINT-1332 | 4-mar-23
            if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
              // below ALL code modified by UrmilaA, LGTCLI-361 | 16-May-23 | start
             if (res) {
              this.PriceClick=false; //LGTGTWINT-2109 | UrmilaA            
              if(res.errors == undefined && res.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL'){   //Error handling logic modified by Urmila A | 15-sep-23
                this.ServiceResponse =  res= res.oPriceResponseBody;
                if(this.ServiceResponse[0].quoteId == 0){  //added by UrmilaA, case- Single record response with quoteId = 0;
                  this.noResponseRecv = true;
                  // this.loadflag = false;
                  this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                  this.NotificationFunction("Error","Error" , this.ServiceResponse[0].errorMessage)
                }
                // below ALL code modified by UrmilaA, LGTCLI-361 | 16-May-23 | start
                // if(res !== null){
                    
                  if (this.ServiceResponse === null || this.ServiceResponse.length == 0){
                      // this.loadflag = false;
                      this.disabledPrembtn = false;
                      this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                    }else if(this.ServiceResponse.length > 0){                      
                          //added by UrmilaA | LGTCLI-361, LGTGTWINT-2040 | 29-May-23 | start
                          this.NoteMasterID = this.ServiceResponse[0].NoteMasterID; 
                          this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                          //added by UrmilaA | LGTCLI-361,LGTGTWINT-2040 | 29-May-23 | ends 
                          if(this.ShowRFS){
                              this.SignalRQuoteIDs='';
                              this.SignalRQuoteIDs = this.FXD_cfs.fnGetLP_withPrice_Quote(this.ServiceResponse)
                              console.log('quote ids:', this.SignalRQuoteIDs)
                              this.SignalR.callHub(this.SignalRQuoteIDs)
                              this.MinMaxTimer = parseInt(this.MinQuoteTimeout) // added by UrmilaA | LGTGTWINT-2110| 9-June-23                      
                              console.log("time starts", Date());
                              this.MinTimeput = setTimeout(() => { //UrmilaA | LGTGTWINT-2110| 9-June-23  
                                console.log("Delayed for "+this.MinQuoteTimeout+" second.");
                                console.log("time ends", Date());
                                this.MinQuoteTimeOutOccurred = true;
                                this.SignalR_unsubscriber=false; //UrmilaA | LGTGTWINT-1147 | 9-June-23
                                // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                                if(!this.signalRMsgRecv && this.MinQuoteTimeOutOccurred && !this.SignalR_unsubscriber){                                                  
                                  this.MapRFS(this.BroadCastData)
                                }else if(this.signalRMsgRecv && this.MinQuoteTimeOutOccurred) {
                                  this.btnEnable=true; //UrmilaA, LGTCLI-361 | 22-Mar-23
                                  this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
                                  this.closeSignalR();
                                  this.OrderPlaceFlag=false
                                  console.log('btnEnable', this.btnEnable, 'OrderPlaceFlag', this.OrderPlaceFlag,
                                  'Orderplace',this.Orderplace, 'routeToDealerClicked', this.routeToDealerClicked, 
                                  'disabledRoutetodealeronSaveTrade' ,this.disabledRoutetodealeronSaveTrade,
                                  'confirmedRouteDealer', this.confirmedRouteDealer,
                                  'IsRouteToDealerExecuted && !routeToDealerClicked',this.IsRouteToDealerExecuted,this.routeToDealerClicked  )
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
                            this.OrderPlaceFlag=false//UrmilaA, LGTCLI-361 | 25-Mar-23
                            this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 24-Mar-23      
                            this.ResponseArray =
                            this.ServiceResponse[0].bestPriceProvider.split(':');
                            this.BestPriceProvider = this.ResponseArray[0];
                            this.ServiceResponse.forEach(element => {
                                if(this.BestPriceProvider === element.provider){                                        
                                      this.AssignAfterPriceValues(element)
                                }
                            });                        
                            this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse); 
                            console.log('in RFS , price recv from LPs',this.PriceRecvFromLPs )
                          }

                              //condition modified by Urmila A | 31-Aug-23
                              if (this.isSaveTradevisible) {
                                this.SaveTradeEnabledFlag = true
                                this.disabledRoutetodealeronSaveTrade = false
                                this.FXD_afs.SaveTradeBtnFlag.next(false)
                              }
                            
                      
                    }
                // }
                // below ALL code modified by UrmilaA, LGTCLI-361 | 16-May-23 | ends  
              }else{
                this.ServiceResponse = res?.oPriceResponseBody;  
                this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse); //urmila a,LGTGTWINT-1941, 16-May-23                                     
                if(this.FXD_cfs.fnPricingNotification(res) == 'NoResReceived') {
                  this.noResponseRecv = true; 
                  this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID; 
                } 
              }                               
             }
             else {          
               // this.loadflag = false;
               this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
               this.NotificationFunction("Error","Error" , 'No response received from remote system')  //Urmila A | 27-Jan-23 | LGTGTWINT-1045, LGTGTWINT-1224
             }
           }
          });
        }
        else {
          if (this.Errormsg !== "") {
            this.NotificationFunction("Error", "Error", this.Errormsg)
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      // this.FXManualPricing();
    }
  }


     //added by UrmilaA, 16-May-23, LGTCLI-361 | start
     MapRFS(data:any){
      let BestPriceConsist :boolean=false;
      let nonBestCnt:any=0;
      let nonBestTimeout:any=0;
      let nonBestTimeoutOccurred:boolean=false;
      //this.loadflag=false   // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
       this.saveRes = this.ServiceResponse.map( (mapObj, index) => {
            var p = {...mapObj};
            if(index === 0){
              this.DCDRfqId  = p.o_DCDRFQID
            }
            if(parseInt(data[0]) === p.quoteId){
              this.PriceRecvFromLPs = this.PriceRecvFromLPs + 1; //added by UrmilaA, 22-may-23
              // this.loadflag=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
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
        
                   
	       // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
            if(nonBestCnt === this.saveRes.length) {
              BestPriceConsist=false;
            }
	       //End

           //added by UrmilaA, LGTCLI-361 | 22-May-23
          if(this.signalRMsgRecv){        
            this.FXD_afs.RFSRes.next(this.saveRes);    
          }

            if(this.MinQuoteTimeOutOccurred){           
                //  BestPriceConsist=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                  nonBestTimeout = parseInt(this.MaxQuoteTimeout) - parseInt(this.MinQuoteTimeout)
                  console.log(' 2nd timeout start:',nonBestTimeout, Date())
                  this.MinMaxTimer = nonBestTimeout // modified by UrmilaA | LGTGTWINT-2110| 9-June-23 
                  this.MaxTimeout = setTimeout(() => { // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
                        nonBestTimeoutOccurred=true;
                        console.log('after 2nd timeout RFS res:', this.saveRes)
                        this.priceLoader=false;    // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        if(nonBestTimeoutOccurred && !this.signalRMsgRecv){ //UrmilaA | 30-May-23 | case- Not single price received from signalR
                          this.noResponseRecv = true; //UrmilaA, LGTGTWINT-2040 | 29-May-23
                          // this.loadflag = false;
                          // console.log('No response received from remote system')
                          this.NotificationFunction("Error","Error" , "No response received from remote system")
                        }
                  }, nonBestTimeout * 1000);
		
		              // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                  console.log('NonBestTimeout is ',nonBestTimeout );
        
                  let nonBestinterval: any = nonBestTimeout;         
                  
                 this.maxInterval = setInterval(() => {      // modified by UrmilaA | LGTGTWINT-2110| 9-June-23     
                  this.MinMaxTimer = nonBestinterval = nonBestinterval-1 // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
                    if(nonBestinterval >0){
                      if(this.signalRMsgRecv){
                        this.priceLoader=false;    // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23
                        // this.loadflag = false;  
                        this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
                        this.closeSignalR();
                        this.signalRMsgRecv = false;   
                        this.MaxQuotePriceCame =true;                   
                        this.FXD_afs.RFSRes.next(this.saveRes); //added by UrmilaA, LGTCLI-361 | 22-May-23
                        clearInterval(this.maxInterval)
                      }        
                    }else if(nonBestinterval == 0){ // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
                      clearInterval(this.maxInterval)
                      clearTimeout(this.MaxTimeout)
                    }
                            
                  },1000)
		  
		             //End
              
            }
           
         
            //Added by UrmilaA, 16-May-23 | LGTCLI-361 | to resolve timer issue
            this.ShownSignalRPriceQuotes.forEach(quoteEle => {
                   this.saveRes.forEach(resEle => {
                          if(quoteEle === resEle.quoteId){                                                 
                            resEle.alreadyMapped=true;                     
                          }
                    });
            });
        
           

            console.log('DCDRfqId',this.DCDRfqId)          
    }
  
    AssignAfterPriceValues(element){  
      this.ClearLPs = false; //added by UrmilaA, 23-May-23 | LGTCLI-361
      this.BestPriceProvider = element.provider;
      this.BestPrice = element.premiumAmount;
      // this.loadflag = false;
      // this.DCDRfqId = element.o_DCDRFQID;
      this.NoteMasterID = element.NoteMasterID; //Urmila A | 14-Sep-23;
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
        this.BidSpot = element.spot !== 0 ? this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift)) : this.BidSpot; //changed by UrmilaA, LGTCLI-361 | 24-May-23
      }
      //end

      this.fnGetClientMaxProfit2('') //Added by UrmilaA | 5-June-23 | LGTCLI-421
      this.fnFindUpfrontUSD();
      this.fnGetContractSummary();
     
      // this.fnCalculations();//commented by UrmilaA | LGTGTWINT-2051 | 31-May-23
  
    }
  //added by UrmilaA, 16-May-23, LGTCLI-361 | end

  //Urmila A | LGTGTWINT-1147 ,LGTGTWINT-1322| Pricing loader | 3-feb-23 |
  CancelPricing(){
    if(this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
     // this.loadflag=false;
     this.priceLoader=false;   // UrmilaA | LGTGTWINT-2109 | 9-jun-23
  }

  FXManualPricing() {
    let spotrate;
    this.ClearPricingFlag = false;
    this.Errormsg = '';
    try {
      if (this.ProductType === 'tarfbuy') {
        spotrate = this.AskSpot;
        // eslint-disable-next-line @typescript-eslint/quotes
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
          '<TargetInPips>' +
          this.Targetpips +
          '</TargetInPips>' +
          '<TargetBF>' +
          100 +
          '</TargetBF>' +
          '<TargetGainunit>' +
          this.Type +
          '</TargetGainunit>' +
          '<NoofKOITMEvents>' +
          this.NoofKOEvent +
          '</NoofKOITMEvents>' +
          '<OptionCut>' +
          this.OptionCut +
          '</OptionCut>' +
          '<NonDeliveryYN>N</NonDeliveryYN>' +
          '<FirstFixingDate>' +
          this.FirstFixingDate +
          '</FirstFixingDate>' +
          '<FixingSettFreq>' +
          this.FixingSettFreq +
          '</FixingSettFreq>' +
          '<Freq>' +
          this.FixingSettFreq +
          '</Freq>' +
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
          '<TradeDate>' +
          this.TradeDate +
          '</TradeDate>' +
          '<PremiumDate>' +
          this.Premiumdate +
          '</PremiumDate>' +
          '<BuySell>' +
          this.OrderDirection +
          '</BuySell>' +
          '<Spotrate>' +
          spotrate +
          '</Spotrate>' +
          '<FixingDate>' +
          this.FinalFixingDate +
          '</FixingDate>' +
          '<SettDate>' +
          this.FinalSettDate +
          '</SettDate>' +
          '<LeverageFactor>' +
          this.Leverage +
          '</LeverageFactor>' +
          '<Ccy1PerFixing>' +
          parseInt(this.NotionalAmt.replace(/,/g, ''), 10) +
          '</Ccy1PerFixing>' +
          '<Strike>' +
          this.Strike +
          '</Strike>' +
          '<TenorDays>' +
          this.TenorDays +
          '</TenorDays>' +
          '<Tenor>' +
          this.Tenor +
          '</Tenor>' +
          '<KIBarrierType>E-101</KIBarrierType>' +
          '<KI>' +
          '</KI>' +
          '<KIStyle>' + this.SelectedKIStyle + '</KIStyle>' +
          '<UpperKI>' +
          '</UpperKI>' +
          '<FinalPayType>Full</FinalPayType>' +
          '<FixingAdjustment>None</FixingAdjustment>' +
          '<CappedLoss>No</CappedLoss>' +
          '<CappedLossCcy>EUR</CappedLossCcy>' +
          '<CappedLossAmount>300</CappedLossAmount>' +
          '<EntityID>' +
          this.FXD_afs.EntityID +
          '</EntityID>' +
          '<NoofSett>' +
          this.NoOfSett +
          '</NoofSett>' +
          '<CAI_ID>7400</CAI_ID>' +
          '</Sheet1></ExcelSheets>';

        // this.XMLString = "<ExcelSheets><Sheet1><Product_Name>TARF Buy</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>32162</CustID><Customer_Name>1007 Customer|32162</Customer_Name><TargetInPips>500</TargetInPips><TargetGainunit>Big Figure</TargetGainunit><NoofKOITMEvents></NoofKOITMEvents><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><KIStyle>No</KIStyle><FixingSettFreq>Monthly/Monthly</FixingSettFreq><Currency1>EUR</Currency1><CcyPair>EUR - USD</CcyPair><PremiumCcy>EUR</PremiumCcy><CustPrem>0</CustPrem><TradeDate>11-Sep-2020</TradeDate><PremiumDate>15-Sep-2020</PremiumDate><FirstFixingDate>15-Oct-2020</FirstFixingDate><FixingDate>11-Nov-2020</FixingDate><SettDate>13-Nov-2020</SettDate><BuySell>Buy</BuySell><Spotrate>1.1866</Spotrate><LeverageFactor>1</LeverageFactor><Ccy1PerFixing>175000</Ccy1PerFixing><Strike>1.1866</Strike><TenorDays>61</TenorDays><Tenor>2M</Tenor><KIBarrierType>E-101</KIBarrierType><KI>400.00</KI><KIStyle></KIStyle><UpperKI></UpperKI><CappedLossCcy>EUR</CappedLossCcy><CappedLossYN>Yes</CappedLossYN><CappedLossAmount>300</CappedLossAmount><Entity_ID>4</Entity_ID><CAI_ID>7400</CAI_ID><PricingModel>Black Scholes</PricingModel></Sheet1></ExcelSheets>"
      } else {
        spotrate = this.BidSpot;
        this.XMLString =
          '<ExcelSheets><Sheet1>' +
          '<Product_Name>' +
          this.ProductName +
          '</Product_Name>' +
          '<Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>' +
          '<CustID>' +
          this.HomeAPI.CustomerId +
          '</CustID>' +
          '<Customer_Name>' +
          this.HomeAPI.CustomerName +
          '</Customer_Name>' +
          '<TargetInPips>' +
          this.Targetpips +
          '</TargetInPips>' +
          '<TargetBF>100</TargetBF>' +
          '<TargetGainunit>' +
          this.Type +
          '</TargetGainunit>' +
          '<NoofKOITMEvents>' +
          this.NoofKOEvent +
          '</NoofKOITMEvents>' +
          '<OptionCut>' +
          this.OptionCut +
          '</OptionCut>' +
          '<NonDeliveryYN>N</NonDeliveryYN>' +
          '<FirstFixingDate>' +
          this.FirstFixingDate +
          '</FirstFixingDate>' +
          '<KIStyle>' + this.SelectedKIStyle + '</KIStyle>' +
          '<FixingSettFreq>' +
          this.FixingSettFreq +
          '</FixingSettFreq>' +
          '<Freq>' +
          this.FixingSettFreq +
          '</Freq>' +
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
          '<TradeDate>' +
          this.TradeDate +
          '</TradeDate>' +
          '<PremiumDate>' +
          this.Premiumdate +
          '</PremiumDate>' +
          '<BuySell>' +
          this.OrderDirection +
          '</BuySell>' +
          '<Spotrate>' +
          spotrate +
          '</Spotrate>' +
          '<FixingDate>' +
          this.FinalFixingDate +
          '</FixingDate>' +
          '<SettDate>' +
          this.FinalSettDate +
          '</SettDate>' +
          '<LeverageFactor>' +
          this.Leverage +
          '</LeverageFactor>' +
          '<Ccy1PerFixing>' +
          parseInt(this.NotionalAmt.replace(/,/g, ''), 10) +
          '</Ccy1PerFixing>' +
          '<Strike>' +
          this.Strike +
          '</Strike>' +
          '<TenorDays>' +
          this.TenorDays +
          '</TenorDays>' +
          '<Tenor>' +
          this.Tenor +
          '</Tenor>' +
          '<KIBarrierType>E-101</KIBarrierType>' +
          '<KI>' +
          '</KI>' +
          '<KIStyle>' + this.SelectedKIStyle + '</KIStyle>' +
          '<UpperKI>' +
          '</UpperKI>' +
          '<CappedLossCcy>EUR</CappedLossCcy>' +
          '<CappedLossYN>No</CappedLossYN>' +
          '<CappedLossAmount>300</CappedLossAmount>' +
          '<Entity_ID>' +
          this.FXD_afs.EntityID +
          '</Entity_ID>' +
          '<NoofSett>' +
          this.NoOfSett +
          '</NoofSett>' +
          '<CAI_ID>7400</CAI_ID>' +
          '</Sheet1></ExcelSheets>';
      }
      if (this.Errormsg === '' && this.Validations()) {
        this.loadflag = true;
        this.GenerateUserID();
        this.disabledPrembtn = true;

        this.FXD_afs.SetPricingProduct(this.ProductName);
        // Upfront is 0 for this product said by mitalee k. on 8/11/2019
        this.GetPriceProviderDetailsSubscription =
          this.FXD_afs.GetFXBestPriceForVBManual(
            this.FXD_afs.EntityID,
            this.ProductID,
            this.Product_Code,
            this.CurrencyPair,
            this.NotionalCcy,
            this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy,
            this.IBPremCcy,
            this.NotionalCcy,
            this.NotionalAmt.replace(/,/g, ''),
            '' +
            Number(this.Strike) * Number(this.NotionalAmt.replace(/,/g, '')),
            this.OrderDirection,
            'CALL',
            this.Strike,
            '0',
            '0',
            '',
            'EUROPEAN',
            'EUROPEAN',
            this.OptionCut,
            this.Tenor + '',
            this.Premiumdate,
            this.FinalFixingDate,
            this.FinalSettDate,
            this.PriceProviderString,
            'PREMIUM',
            this.TemplateCode,
            this.TemplateID,
            this.NotionalAmt.replace(/,/g, ''),
            '' + this.Leverage,
            this.FixingSettFreq,
            this.GuaranteedPeriods,
            this.KORate,
            this.Targetpips.toString(),
            this.Type,
            this.XMLString,
            '',
            this.UserID,
            this.SeletcedPricingModel,
            'GWManual',
            this.ClientPremComment,
            this.IBPremComment,
            '',
            '',
            ''
          ).subscribe((res) => {
            if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
              if (res) {  //mappings modified by Chaitanya M | 29-Nov-23
                console.log(res);
                if (res) {
                  this.ServiceResponse = res.GetFXOPriceManualModeResult;
                  // this.IBPrem = this.ServiceResponse.IBPrem;
                  // this.ClientPrem = this.ServiceResponse.CustPrem;
                  this.ClientPrem = parseFloat(this.ServiceResponse.CustPrem).toFixed(this.IBPremCcy === this.AltCcy ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  this.Upfront = this.ServiceResponse.MarginPerc;
                  this.SelectedClientType = this.ServiceResponse.CustPayReceiveDirection;
                  this.SelectedIBType = this.ServiceResponse.IBPayReceiveDirection;

                  this.loadflag = false;
                } else {
                  this.loadflag = false;
                  this.Errormsg = this.ServiceResponse[0].errorMessage;
                  this.Errormsg = 'No prices received';
                  this.NotificationFunction("Error", "Error", this.Errormsg)
                  this.disabledPrembtn = false;
                }
              }
            }
          });
      }
      else {
        if (this.Errormsg !== "") {
          this.NotificationFunction("Error", "Error", this.Errormsg)
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  GenerateUserID() {
    this.UserID = 'GMUser_' + Math.floor(Math.random() * 1000 + 1).toString();
  }

  fnCalculations() {
    this.ClientPrem = 0.0;
    this.Upfront = this.BestPrice;
  }
  CallScheduleComp() {
    // this.ScheduleVisibility = true;
    // this.ScheduleComp.listen(this.NoteMasterID,'TRF');
  }
  Validations() {
   
    if (this.NotionalAmt === '') {
      this.Errormsg = 'Notional is blank';
      return false;
    } 

    //Added by Urmila A | 3-Mar-23
    if(this.CurrencyPair === ''){
      this.Errormsg = 'Please select currency pair.'
      return false
    }else {
      this.Errormsg='';
    }

    // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | start
    // else {
    //   if (this.DisableCCYChangeControl === true) {
    //     try {
    //       if (Number(this.NotionalAmt.toString().replace(/,/g, '')) >= 1) {
    //         this.Errormsg = '';
    //       } else {
    //         this.Errormsg = 'Notional below ' + this.NotionalCcy + ' 1 not allowed';
    //         return false;
    //       }
    //     } catch (ex) {

    //     }
    //   } else if (Number(this.NotionalAmt.toString().replace(/,/g, '')) >= 100000) {
    //     this.Errormsg = '';
    //   } else {
    //     this.Errormsg =
    //       'Notional below ' + this.NotionalCcy + ' 100k not allowed';
    //     return false;
    //   }
    // }
    // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | end
    
    // Start Added by Ketan S on 14-Apr-22 JIRA-ANAPPDEVIN-227
    if (this.SelectedKIStyle === 'Yes') {
      try {
        if (this.KIRate !== '') {
          //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | start
          //LGTCLI-273 FXD pricing errors || RijwanS
          // if(this.ProductType != "tarfbuy"){ //uncommented by Urmila A | 31-Jan-23 | as discussed with Rahul P
          //   if (parseFloat(this.KIRate) < parseFloat(this.Strike)) {
          //     this.Errormsg = 'KI Rate cannot be less than or equal to strike';
          //     return false;
          //   } else {
          //     this.Errormsg = '';
          //   } 

          // } else{

          //   if (parseFloat(this.KIRate) > parseFloat(this.Strike)) {
          //     this.Errormsg = 'KI Rate cannot be greater than or equal to strike';
          //     return false;
          //   } else {
          //     this.Errormsg = '';
          //   }
          // }
          // END
          //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | end
        } else {
          this.Errormsg = 'KI Rate cannot be blank';
          return false;
        }

      } catch (ex) {
        return false;
      }
    }
    // END Added by Ketan S on 14-Apr-22 JIRA-ANAPPDEVIN-227
    if (
      Number(this.Strike) > 0 &&
      this.Strike !== ''
      //  && Number(this.Strike) < 1000 commented by Urmila A | 12-Jan-23 | LGTGTWINT-832
    ) {
      this.Errormsg = '';
    } else {
      this.Errormsg = 'Strike cannot be zero or blank';
      return false;
    }
    // Urmila A | 24-Jan-23 | LGTGTWINT-1127 | start
    if(this.AskSpot.includes(',') || this.BidSpot.includes(',')){
        if (Number(this.AskSpot.replaceAll(',','')) > 0 && Number(this.BidSpot.replaceAll(',','')) > 0) {
          this.Errormsg = '';
        } else {
          this.Errormsg = 'Spot cannot be zero or blank';
          return false;
        }
    }else{
        if (Number(this.AskSpot) > 0 && Number(this.BidSpot) > 0) {
          this.Errormsg = '';
        } else {
          this.Errormsg = 'Spot cannot be zero or blank';
          return false;
        }
    }
    // Urmila A | 24-Jan-23 | LGTGTWINT-1127 | end
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
    if (this.Type === 'Big Figure') {
      if (this.Targetpips > 0) {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Target cannot be zero or blank';
        return false;
      }
    } else {
      if (Number(this.NoofKOEvent) >= 0 && this.NoofKOEvent !== '') {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'No of KO ITM Event cannot be zero or blank';
        return false;
      }
    }
    return true;
  }
  TypeChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.Type = target.value;
    if (this.Type === 'Big Figure') {
      this.NoofKOEvent = '';
    } else {
      this.Targetpips = 0;
    }
  }
  ViewWorkFlowBlotter() {
    this.OrderBlotterVisibility = true;
    // this.workflowblotter.ViewBlotter(this.TradeDate, '1-Jun-2018', '1', '10');
  }
  StrikeValidation(e) {
    const target = this.FXD_cfs.GetEventTarget(e);

    if (target.value === '') {
      if (this.OrderDirection === 'SELL') {
        this.Strike = this.BidSpot;
      } else {
        this.Strike = this.AskSpot;
      }
    } else {
      if (target.value === '.') {
        target.value = '0';
      }
      if (Number(this.AskSpot) >= 100 && Number(this.BidSpot) >= 100) {
        target.value = parseFloat(target.value).toFixed(2);
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
    }
  }
  TargetValueChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }

  }


  //modified by UrmilaA | LGTCLI-425 | 29-Mar-23 | start
  targetChnge(e){
    this.Targetpips=e.target.value
    this.TargetBF = (Number(e.target.value) / 100 ).toFixed(2) 
  }

  //modified by UrmilaA | LGTGTWINT-2111 | 9-June-23
    //modified by UrmilaA | LGTCLI-425 | 12-june-23 | ends
  targetBFChng(e){
    this.TargetBF=Number(e.target.value).toFixed(2)  
    this.Targetpips = (Number(e.target.value) * 100).toFixed(0) 
   
  }
  //modified by UrmilaA | LGTCLI-425 | 29-Mar-23 | ends

  KIChange(e) {
    this.SelectedKIStyle = e.target.value
    if (this.SelectedKIStyle === 'No') {
      this.KIRate = ''
    }
    this.fnGetContractSummary()
  }

  KIRateChng(e){
    this.KIRate = Number(e.target.value).toFixed(this.PointShift) //UrmilaA | 27-feb-23 | LGTGTWINT-1526
  }
  GetStrikeRate() {
    // if (this.OptionType === 'Call') {
    if (this.OrderDirection === 'BUY') {
      this.Strike = Number(this.AskSpot.replace(/,/g, '')).toFixed(this.PointShift);
    } else {
      this.Strike = Number(this.BidSpot.replace(/,/g, '')).toFixed(this.PointShift);
    }
  }

  TradeSelectedLP(SelectedLPDetails) {
    // this.loadflag = true;
    // this.DCDRfqId = SelectedLPDetails.o_DCDRFQID;
    console.log('trade selected LP:', SelectedLPDetails, this.ServiceResponse)

     //unncesorry code removed by UrmilaA | 1-June-23 | LGTGTWINT-2067
    // this.BestPriceProvider = SelectedLPDetails.provider;
    // this.ExternalRfqId = SelectedLPDetails.quoteId;


    // if (this.OrderDirection === 'Buy') {
    //   this.ClientPrem =
    //     (Number(this.NotionalAmt.replace(/,/g, '')) *
    //       (Number(this.BestPrice) + Number(this.Upfront))) /
    //     100;
    // } else {
    //   this.ClientPrem =
    //     (Number(this.NotionalAmt.replace(/,/g, '')) *
    //       (Number(this.BestPrice) - Number(this.Upfront))) /
    //     100;
    // }
    // this.ServiceResponse.forEach(element => {
    //   if (element.provider === SelectedLPDetails.provider) {
    //     this.BestPrice = element.premiumAmount;
    //   }
    // });
    this.BookDeal();
  }

  fnDisableTradebtn(e) {
    this.OrderPlaceFlag = e;
    this.ViewSchedule = false;
    this.ViewScheduleflag = false;
  }

  fnDisablePrembtn(e) {
    this.disabledPrembtn = e;
    // this.ResetAllFields();
  }

  fnDisableLoader(e) {
    console.log('Global Loader flag', e)
    this.OrderClicked = e
  }


  //Added by Urmila A | start  
  fnChangeInNoOfSett(e) {
    this.NoOfSett = e.target.value;
    if(this.NoOfSett === '0' || this.NoOfSett === ''){ //Urmila A | 15-Feb-23 | LGTGTWINT-1212
      this.NotificationFunction("Error","Error", "Number of settlement should be grater than 0 ")
    }else{
      this.NoofSettChangeYN = 'Y';
      this.functionGetTenorfromFixings();
    }

   
    // this.fnCalculateFirstFixingDate();

  }
  fnChngFixingSettlFreq(e) {
    this.FixingSettFreq=e.target.value;
    this.FixingSettChngYN = 'Y'
    this.functionGetTenorfromFixings();
  }
  //Added by Urmila A | end  
  async fnCalculateFirstFixingDate() {
    var Tenor_Code_Temp = '';
    switch (this.FixingSettFreq.split('/')[0]) {
      case 'Monthly':
        Tenor_Code_Temp = '1M';
        // this.NoOfSett = '12';
        break;
      case 'Weekly':
        Tenor_Code_Temp = '1W';
        // this.NoOfSett = '7';
        break;
      case 'BiWeekly':
        Tenor_Code_Temp = '2W';
        // this.NoOfSett = '14';
        break;
    }

    console.log(this.Premiumdate, this.FinalFixingDate);
    this.FXDFirstFixingDateSubscriber = await this.FXD_afs.fnGetFixingDateFromNoOfSett(
      this.DepCcy,
      this.AltCcy,
      this.DepCcy + '' + '-' + '' + this.AltCcy,
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
      // this.FirstFixingDate,
      this.FinalFixingDate,
      this.FinalSettDate,
      this.NotionalPerFixing

    ).subscribe((res) => {
      if (res) {
        console.log(res);
        this.AllDataLoaded.firstfixingdate = true;
        // this.NoOfSett = res.GetNumberofFixingsResult.FixingData.NoofFixings
       
        this.FirstFixingDate = '';
        this.FirstFixingDate = this.datepipe.transform(res.firstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23
        this.firstFixChngAndDatesReceived = true;        
        this.functionGetTenorfromFixings();
      }
    });
  }

  functionGetTenorfromFixings() {
    this.Tenor = '';
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.tenor = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.GetTenorSubscriber = this.FXD_afs.fnGetTenorfromFixings( //API req parameters modification | Core migration | Urmila A | 21-Aug-23
      this.FixingSettFreq,
      this.NoOfSett, 
      this.FXD_afs.UserName,    
    ).subscribe((res) => {
      if (res) {
        this.Tenor = res.result;
        this.AllDataLoaded.tenor = true; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 
        if (this.Tenor.includes('W')) {
          this.TenorDays = parseInt(this.Tenor) * 7
        } else if (this.Tenor.includes('M')) {
          this.TenorDays = parseInt(this.Tenor) * 30
        } else if (this.Tenor.includes('Y')) {
          this.TenorDays = parseInt(this.Tenor) * 365
        }
        // if (this.Tenor === '12M'){
        //   this.Tenor = '1Y';
        // }      
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
        this.TenorChanged();
      }
    });
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
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

  fnIsMetalInCcy() {
    try {
      this.Pair_Cross_YN = '';
      this.Left_USD_Pair = '';
      this.Right_USD_Pair = '';
       //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | start
      this.CurrencyPairList.forEach(element => {
        if (element.asset_Pair === this.CurrencyPair) {
          this.Pair_Cross_YN = element.pair_Cross_YN;
          this.Left_USD_Pair = element.left_USD_Pair;
          this.Right_USD_Pair = element.right_USD_Pair;
          this.DepCcy = this.CurrencyPair.split('-')[0].trim();
          this.AltCcy = this.CurrencyPair.split('-')[1].trim();
          if (element.lcY_Type.toUpperCase() === 'METAL') { // Check if the Dep ccy is metal or not
            this.DisableCCYChangeControl = true;
            this.IBPremCcy = this.AltCcy;
            this.NotionalCcy = this.DepCcy;
            this.NotionalDecimalPointShift = 0;
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 

          } else if (element.rcY_Type.toUpperCase() === 'METAL') {// Check if the Alt ccy is metal or not
            this.DisableCCYChangeControl = true;
            this.DepCcy = this.CurrencyPair.split('-')[0].trim();
            this.AltCcy = this.CurrencyPair.split('-')[1].trim();
            this.IBPremCcy = this.DepCcy;
            this.NotionalCcy = this.AltCcy;
            this.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
         
          } else {
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
          //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | ends
        }
      });
      if (this.Pair_Cross_YN === 'Y') {
        this.FindLeftUSDMidRate(this.Left_USD_Pair);
        this.FindRightUSDMidRate(this.Right_USD_Pair);
      }
    } catch (ex) {

    }
  }

  fnChangeNotionalCCY() {
    try {
      try {
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.CurrencyPair) {  //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23
            if (this.NotionalCcy === element.asset1) {
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCcy === element.asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.NotionalAmt = this.FXD_cfs.NotionalChangewithDecimalFixes(this.NotionalAmt, this.NotionalDecimalPointShift);
            this.fnGetContractSummary()
          }
        });
      } catch (ex) {

      }
    } catch (Ex) {

    }
  }

  fnSetIBPrem(InputValue: any) {
    if (this.AltCcy === this.IBPremCcy) {
      this.IBPrem = (parseFloat(InputValue.toString()).toFixed(this.Asset2_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      this.IBPrem = (parseFloat(InputValue.toString()).toFixed(this.Asset1_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  ChangeinNotionalPerfixing() {
    this.NotionalAmt = this.FXD_cfs.format(Number(this.NotionalPerFixing.replace(/,/g, '')) * 
        Number(this.NoOfSett), this.NotionalDecimalPointShift );
    this.fnGetContractSummary()
  }

  //Modified by Urmila A | 3-Mar-23
  public SelectedCCy(e) {
    console.log(e);
    this.CurrencyPair = e; 
    this.CurrencyChanged=true;
      //Added by UrmilaA | 26-Dec-23 | start
      if(this.CurrencyPair !== '' && this.CurrencyPair.length == 9){
        this.CurrencyPairChanged();
        // this.calcClientProfitCcy1(); //Added by Urmila A | for updating Client max profit ccy1 after CCY change | 4-Jan-23 | LGTGTWINT-684
        // this.calcClientProfitCcy2(); //Added by Urmila A | for updating Client max profit ccy2 after CCY change | 4-Jan-23 | LGTGTWINT-684
        
    
        this.fnGetOptionCutFXD(); //Added by Urmila A | for updating option cut after CCY change
        this.fnGetDatesCalculationforVB();
        // this.getfnCalculateFirstFixingDate();
    }
    if(this.CurrencyPair == '' || this.CurrencyPair.length <= 8){
      this.DepCcy = this.AltCcy = '';
      this.IBPremCcy = this.NotionalCcy = ''
      this.fnGetBidAskRates();
    } 
    //Added by UrmilaA | 26-Dec-23 | ends
   
    
  }
 

  /* Modified by Urmila A | 8-Dec-22 | start  */
  fnShowOrHideShedule() {
    let XML = ''; //Urmila A | LGTGTWINT-1332 | 4-Mar-23 | start
    let targetBF = (this.Targetpips / 100);   // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953

    if(this.RouteFromWorkflow && !this.ResetAllfieldsCalled){
      this.NoteMasterID =this.NoteToUnblock;
    }else if(this.ResetAllfieldsCalled) { 
      this.NoteMasterID = ''
    }else if(this.RouteFromWorkflow  && !this.ResetAllfieldsCalled && !this.BestPrice){
      this.NoteMasterID = this.NoteToUnblock;
    }else if(this.RouteFromQuoteHistory){ //urmila A, 29-Mar-23,  LGTGTWINT-1758
      this.NoteMasterID = this.NoteMasterID
    }//end

    this.ViewScheduleflag = true;
    this.scheduleBtnClick=true; //Urmila A | LGTGTWINT-1244 | 3-Mar-23
    this.FXD_cfs.schedulePopupOpenClose.next(true);
    let KIStyle: any;
    if (this.SelectedKIStyle === 'Yes') {
      if (this.Leverage === 1) {
        KIStyle = 'E-101'
      } else { KIStyle = 'E-102' }
    } else { KIStyle = '' }
    
    let spotrate;
      var CustID = '1'
      var Customer_Name = 'LGT-CUST001'

    let LeverageTXT = Number(this.Leverage) > 1 ? 'Booster' : '';
    if (this.SelectedKIStyle === 'No') {
      this.ScheduleDescription = ' ' + this.OrderDirection + ' ' + this.CurrencyPair + ' ' + this.FixingSettFreq + ' ' + LeverageTXT + ' ' + 'TRF on' + ' ' +
        this.NotionalCcy + ' ' + 'at Strike : ' + (this.Strike !== '' ? this.Strike : 0 ) + ',' + ' ' + 'Target Type : ' + ' ' + 'Big Figure' + ' ' + ',' + ' Target Value:  ' + this.Targetpips + ' ' + 'pips'; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550
    } else {
      this.ScheduleDescription = ' ' + this.OrderDirection + ' ' + this.CurrencyPair + ' ' + this.FixingSettFreq + ' ' + LeverageTXT + ' ' + 'TRF on' + ' ' +
        this.NotionalCcy + ' ' + 'at Strike : ' + (this.Strike !== '' ? this.Strike : 0 ) + ',' + ' ' + 'Target Type : ' + ' ' + 'Big Figure' + ' ' + ',' + ' Target Value:  ' + this.Targetpips + ' ' + 
        'pips with Knock-in at KI Rate: ' + ' ' + (this.KIRate !== '' ? this.KIRate : 0); // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550
    }

   
    if (this.ProductType === 'tarfbuy'){
          if(!this.BestPrice){
            spotrate = this.AskSpot;
             //customer ID, name changes added by UrmilaA, 17-April-23
             //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
             // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
             //<CustID>" + this.HomeAPI.CustomerId + "</CustID><Customer_Name>" + this.HomeAPI.CustomerName +   "</Customer_Name>
            XML = this.ScheduleXML =
                  "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><TargetInPips>" + (this.Type === 'Big Figure' ?  this.Targetpips : 0) + "</TargetInPips><TargetBF>" + (this.Type === 'Big Figure' ? targetBF : 0) +
                  "</TargetBF><TargetGainunit>" + this.Type + "</TargetGainunit><NoofKOITMEvents>" + ( this.Type === 'ITM' ? this.NoofKOEvent : 0 ) +
                  "</NoofKOITMEvents><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>N</NonDeliveryYN><FirstFixingDate>" + this.FirstFixingDate +
                  "</FirstFixingDate><FixingSettFreq>" + this.FixingSettFreq + "</FixingSettFreq><Currency1>" + this.NotionalCcy + "</Currency1><CcyPair>" + this.CurrencyPair +
                  "</CcyPair><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy><CustPrem>" + this.ClientPrem + "</CustPrem><TradeDate>" + this.TradeDate +
                  "</TradeDate><PremiumDate>" + this.Premiumdate + "</PremiumDate><FixingDate>" + this.FinalFixingDate + "</FixingDate><SettDate>" + this.FinalSettDate +
                  "</SettDate><BuySell>" + this.OrderDirection + "</BuySell><Spotrate>" + spotrate + "</Spotrate><LeverageFactor>" + this.Leverage +
                  "</LeverageFactor><Ccy1PerFixing>" + this.NotionalPerFixing.replace(/,/g, '') + "</Ccy1PerFixing><Strike>" + this.Strike +
                  "</Strike><TenorDays>" + this.TenorDays + "</TenorDays><Tenor>" + this.Tenor + "</Tenor><KIBarrierType>" + this.SelectedKIStyle +
                  "</KIBarrierType><KIYesNo>" + this.SelectedKIStyle + "</KIYesNo><KI>" + this.KIRate + "</KI><KIStyle>" + KIStyle + "</KIStyle><UpperKI></UpperKI><FinalPayType>" + this.SelectedFinalPayType +
                  "</FinalPayType><FixingAdjustment>" + this.SelectedFixingAdjustment + "</FixingAdjustment><CappedLoss>No</CappedLoss><CappedLossCcy>No</CappedLossCcy><CappedLossYN>No</CappedLossYN><CappedLossAmount>0</CappedLossAmount><Entity_ID>" + this.FXD_afs.EntityID +
                  "</Entity_ID><CAI_ID>7400</CAI_ID><NoofSett>" + this.NoOfSett + "</NoofSett></Sheet1></ExcelSheets>"
          }else if(this.BestPrice){
                  this.ScheduleXML = ''
          }

          // if(this.RouteFromWorkflow), Urmila A , 29-mar-23
          if(this.IsNavigate && !this.BestPrice  && this.scheduleBtnClick &&  !this.ResetAllfieldsCalled){  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
            this.ScheduleXML = '';
          }else if(this.IsNavigate && !this.BestPrice  && this.scheduleBtnClick || this.ResetAllfieldsCalled){
            this.ScheduleXML = XML;
          }else if(this.IsNavigate  && this.BestPrice){
            this.ScheduleXML = '';
          }else if(!this.IsNavigate && this.BestPrice){
            this.ScheduleXML = '';
          }else if(this.IsNavigate  && !this.BestPrice ){
            this.ScheduleXML = XML;
          }else if(this.IsNavigate && this.BestPrice || this.IsNavigate && this.BestPrice && this.scheduleBtnClick){
            this.ScheduleXML = '';
          }
           //added by Urmila A, LGTGTWINT-1824 , 4-april-23
          if(this.RouteFromQuoteHistory && !this.BestPrice){
            this.ScheduleXML = XML;
          }//end

    }else if(this.ProductType === 'tarfsell'){
        if(!this.BestPrice){
          spotrate = this.BidSpot;
           //customer ID, name changes added by UrmilaA, 17-April-23
           //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
           // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
          XML = this.ScheduleXML =
          "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><TargetInPips>" + (this.Type === 'Big Figure' ?  this.Targetpips : 0) + "</TargetInPips><TargetBF>" + (this.Type === 'Big Figure' ? targetBF : 0) +
          "</TargetBF><TargetGainunit>" + this.Type + "</TargetGainunit><NoofKOITMEvents>" + ( this.Type === 'Big Figure' ? this.NoofKOEvent : 0 ) +
          "</NoofKOITMEvents><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>N</NonDeliveryYN><FirstFixingDate>" + this.FirstFixingDate +
          "</FirstFixingDate><FixingSettFreq>" + this.FixingSettFreq + "</FixingSettFreq><Currency1>" + this.NotionalCcy + "</Currency1><CcyPair>" + this.CurrencyPair +
          "</CcyPair><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy><CustPrem>" + this.ClientPrem + "</CustPrem><TradeDate>" + this.TradeDate +
          "</TradeDate><PremiumDate>" + this.Premiumdate + "</PremiumDate><FixingDate>" + this.FinalFixingDate + "</FixingDate><SettDate>" + this.FinalSettDate +
          "</SettDate><BuySell>" + this.OrderDirection + "</BuySell><Spotrate>" + spotrate + "</Spotrate><LeverageFactor>" + this.Leverage +
          "</LeverageFactor><Ccy1PerFixing>" + this.NotionalPerFixing.replace(/,/g, '') + "</Ccy1PerFixing><Strike>" + this.Strike +
          "</Strike><TenorDays>" + this.TenorDays + "</TenorDays><Tenor>" + this.Tenor + "</Tenor><KIBarrierType>" + this.SelectedKIStyle +
          "</KIBarrierType><KIYesNo>" + this.SelectedKIStyle + "</KIYesNo><KI>" + this.KIRate + "</KI><KIStyle>" + KIStyle + "</KIStyle><UpperKI></UpperKI><FinalPayType>" + this.SelectedFinalPayType +
          "</FinalPayType><FixingAdjustment>" + this.SelectedFixingAdjustment + "</FixingAdjustment><CappedLoss>No</CappedLoss><CappedLossCcy>No</CappedLossCcy><CappedLossYN>No</CappedLossYN><CappedLossAmount>0</CappedLossAmount><Entity_ID>" + this.FXD_afs.EntityID +
          "</Entity_ID><CAI_ID>7400</CAI_ID><NoofSett>" + this.NoOfSett + "</NoofSett></Sheet1></ExcelSheets>"
        }else if(this.BestPrice){
          this.ScheduleXML = '';
        }

        // if(this.RouteFromWorkflow), Urmila A , 29-mar-23
        if(this.IsNavigate && !this.BestPrice  && this.scheduleBtnClick && !this.ResetAllfieldsCalled){  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
          this.ScheduleXML = '';
        }else if(this.IsNavigate && !this.BestPrice  && this.scheduleBtnClick || this.ResetAllfieldsCalled){
          this.ScheduleXML = XML;
        }else if(this.IsNavigate  && this.BestPrice){
          this.ScheduleXML = '';
        }else if(!this.IsNavigate && this.BestPrice){
          this.ScheduleXML = '';
        }else if(this.IsNavigate  && !this.BestPrice ){
          this.ScheduleXML = XML;
        }else if(this.IsNavigate && this.BestPrice || this.IsNavigate && this.BestPrice && this.scheduleBtnClick){
          this.ScheduleXML = '';
        }
        //added by Urmila A, LGTGTWINT-1824 , 4-april-23
        if(this.RouteFromQuoteHistory && !this.BestPrice){
          this.ScheduleXML = XML;
        }//end
    }


  }
  /*Modified by Urmila A | 8-Dec-22 | end  */
  fnCustomerSelection(e) {
    this.CustomerID = e.CustomerID;
  }

  /*Modified by Urmila A | 8-Dec-22 | START  */
  fnGetContractSummary() {
    if (this.FXDContractSummSubscriber) this.FXDContractSummSubscriber.unsubscribe();
    this.ContractSummary = '';
    
    //Urmila A | 28-feb-23
    if(this.NotionalAmt.toString().includes(',')){
      this.AltNotional = this.NotionalCcy === this.DepCcy ? parseInt(this.NotionalAmt.replace(/,/g, ''), 10) / Number(this.Strike) :
      parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * Number(this.Strike)
    }else{
      this.AltNotional = this.NotionalCcy === this.DepCcy ? Number(this.NotionalAmt) / Number(this.Strike) :
      parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * Number(this.Strike)
    }
   
    try {
      let KIStyle: any;
      this.Leverage === 1 ? KIStyle = 'E-101' : KIStyle = 'E-102'
      //new 
      this.FXDContractSummSubscriber = this.FXD_afs.fnGetContractSummary(
        Number(this.FXD_afs.EntityID),
        this.FXD_afs.UserName,
        // this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
        //  this.FXD_afs.EntityID,
        this.TemplateCode.toUpperCase(),
        this.Product_Code,
        (this.OrderDirection || ''),
        this.CurrencyPair,
        this.OptionCut,
        this.NotionalCcy,
        this.NotionalCcy === this.DepCcy ? this.AltCcy : this.DepCcy,
        //  this.AltCcy,
        this.IBPremCcy,
        parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.NotionalAmt.replace(/,/g, '')) : 0,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
        parseInt(this.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.NotionalPerFixing.replace(/,/g, '')) : 0,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
        this.Tenor,
        this.FinalFixingDate,
        this.FinalSettDate,//settlement
        '',//longdate
        '', //shortdate
        this.Strike.includes(',') ? this.Strike.replaceAll(',','') : Number(this.Strike),
        this.OptionCut,
        '',//barriertype
        '',//Exotic code
        '',// digitaltype
        0.00,//upperbarrier
        0.00,//lowerbarrier
        Number(this.Leverage) ? Number(this.Leverage) : 1,
        Number(this.NoOfSett) > 0 ? Number(this.NoOfSett) : 0,
        Number(this.NoOfSett) > 0 ? Number(this.NoOfSett) : 0,//No of fixing
        this.FixingSettFreq,
        this.FixingSettFreq, //settl freq
        0.00,//lower strike
        0.00,//upper strike
        0.00,//pivot strike
        '',//spread type
        this.custPremDirection,//cust prem dir
        this.BestPrice ? this.IBPremDirection : '', //IB prem dir //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        this.BestPrice ? parseInt(this.IBPrem)  ? parseFloat(this.IBPrem.replace(/,/g, '')) : 0 : 0,//Urmila A | 1-Feb-23 | LGTGTWINT-1209 
        0.00,//RTC
        this.BestPrice ? Number(this.Upfront) ? Number(this.Upfront) : 0 : 0,//IB prem perc, LGTGTWINT-685  //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        0.00,//RTC perc
        0.00,//Target
        0.00,//target notional
        this.SelectedKIStyle === 'Yes' ? KIStyle : 'No',//KI style rate
        this.SelectedKIStyle === 'Yes' ? this.ProductType === 'tarfbuy' ? Number(this.KIRate) : 0.00 : 0.00, //lower KI //Urmila A | 25-Jan-23 | LGTGTWINT-1194
        this.SelectedKIStyle === 'Yes' ? this.ProductType === 'tarfsell' ? Number(this.KIRate) : 0.00 : 0.00,//UpperKI //Urmila A | 25-Jan-23 | LGTGTWINT-1194
        '',//Guarentee till
        Number(this.GuaranteedPeriods) > 0 ? Number(this.GuaranteedPeriods) : 0,
        '',//capped loss ccy
        '', //capped losstype
        '',//capped loss
        0.00,//capped loss amt

        // Added KOType changes by UrmilaA, 5-May-23 | LGTGTWINT-1953 | start
        this.Type === 'Big Figure' ? Number(this.Targetpips) > 0 ? (this.Targetpips / 100).toString() : '0':'0',//target big fig
        this.Type === 'Big Figure' ? 'BigFigure' : 'ITM',//target per unit
        this.Type === 'Big Figure' ?  Number(this.Targetpips) > 0 ? this.Targetpips.toString() : '0':'0',//target in pips
        this.Type === 'ITM' ? this.NoofKOEvent : '0',//KOITME event 
        // Added KOType changes by UrmilaA, 5-May-23 | LGTGTWINT-1953 | ends

        '',//strikestype
        this.FirstFixingDate,
        this.SelectedFinalPayType,//final pay type
        this.SelectedFixingAdjustment,//fixing adjustment
      )
        .subscribe((res) => {
          if (res) {
            // console.log('contract summary',res);
            res = res.result.toString().replaceAll("\\n", "<br>"); 
            //this.ContractSummary = this.FXD_cfs.fngetContractSumm(res); //UrmilaA | LGTGTWINT-2123 | 14-June-23

              if(res.includes('color:green')){ //Urmila A | 16-feb-23 |LGTGTWINT-1429
                this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:green","color:var(--green) !important"))
              }else if(res.includes('color:red')){
                this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:red","color:var(--red) !important"))
              }
            }
        });
    } catch (ex) { }
  }
  /*Modified by Urmila A | 8-Dec-22 | end  */

   //not using these functions, as calculations to be done via api side | Urmila A | 16-mar-23
  // Added by Pranav D 3-Oct-2022 to get Max CLient Profit Ccy1
  calcClientProfitCcy1() {
    try {
      if (this.ProductType === 'tarfbuy') {

        if (!this.Targetpips || this.Targetpips === '' || !this.NotionalPerFixing || this.NotionalPerFixing === '') {
          return;
        }
      //   if (this.NotionalCcy !== this.CurrencyPair.split('-')[0].trim()) {
      //     let a = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / parseFloat(this.Strike));
      //     let b = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / ((((parseFloat(this.Targetpips) / 100) / 100)) + parseFloat(this.Strike));
      //     this.maxClientProfitCcy1 = (a - b).toFixed(2);

      //   } else {
      //     let a = (((parseFloat(this.Targetpips.toFixed(this.PointShift)) / 100) / 100) + parseFloat(this.Strike));
      //     let b = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * parseFloat(this.Strike));
      //     this.maxClientProfitCcy1 = (((parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * a) - b) / parseFloat(this.BidSpot)).toFixed(2);
      //   }
      //   // this.maxClientProfitCcy1 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy1)

      // } else {
      //   if (!this.Targetpips || this.Targetpips === '' || !this.NotionalPerFixing || this.NotionalPerFixing === '') {
      //     return;
      //   }
      //   if (this.NotionalCcy !== this.CurrencyPair.split('-')[0].trim()) {
      //     let a = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / (parseFloat(this.Strike) - ((parseFloat(this.Targetpips.toFixed(this.PointShift)) / 100) / 100));
      //     let b = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / parseFloat(this.Strike);
      //     this.maxClientProfitCcy1 = (a - b).toFixed(2);;
      //   } else {
      //     let a = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * (((parseFloat(this.Targetpips) / 100) / 100) + parseFloat(this.Strike));
      //     let b = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * parseFloat(this.Strike));
      //     this.maxClientProfitCcy1 = ((a - b) / parseFloat(this.BidSpot)).toFixed(2);
      //   }
      //   // this.maxClientProfitCcy1 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy1)


      //modified by Urmila A | 16-mar-23 |  discussed with Rahul P
      if(this.NotionalCcy === this.CurrencyPair.split('-')[0].trim() ){ //notionalccy !== ccy1         
            this.maxClientProfitCcy1 = this.maxClientProfitCcy2 / parseFloat(this.BidSpot)
      }else{
            let a = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / Number(this.Strike)
            let b = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / (Number(parseFloat(this.Targetpips).toFixed(this.PointShift)) / Math.pow(10, this.PointShift))  + parseFloat(this.Strike)
            this.maxClientProfitCcy1 = a-b
      }

      }
      this.maxClientProfitCcy1 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy1.toFixed(this.PointShift))
      return this.maxClientProfitCcy1;
    } catch (error) {
    }
  }

   //not using these functions, as calculations to be done via api side | Urmila A | 16-mar-23
  calcClientProfitCcy2() {
    try {
      if (!this.Targetpips || this.Targetpips === '' || !this.NotionalPerFixing || this.NotionalPerFixing === '') {
        return;
      }


      // if (this.NotionalCcy === this.CurrencyPair.split('-')[0].trim()) {
      //   let c = (((parseFloat(this.Targetpips) / 100) / 100) + parseFloat(this.Strike));
      //   let d = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * parseFloat(this.Strike));
      //   this.maxClientProfitCcy2 = ((parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * c) - d).toFixed(2);
      // } else {
      //   let c = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / parseFloat(this.Strike));
      //   let d = parseFloat(this.NotionalPerFixing.replace(/,/g, '')) / ((((parseFloat(this.Targetpips) / 100) / 100) + parseFloat(this.Strike)));
      //   this.maxClientProfitCcy2 = ((c - d) * parseFloat(this.BidSpot)).toFixed(2);
      // }

      //modified by Urmila A | 16-mar-23 |  discussed with Rahul P
      if(this.NotionalCcy === this.CurrencyPair.split('-')[0].trim() ){ //notionalccy !== ccy1
          let a = (parseFloat(this.NotionalPerFixing.replace(/,/g, '')) * Number(parseFloat(this.Targetpips).toFixed(this.PointShift))) /  Math.pow(10, this.PointShift)
          this.maxClientProfitCcy2 = a;
          this.calcClientProfitCcy1();
      }else{
          this.maxClientProfitCcy2 = this.maxClientProfitCcy1 * parseFloat(this.BidSpot)
      }

      this.maxClientProfitCcy2 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy2.toFixed(this.PointShift));
      return this.maxClientProfitCcy2;

    } catch (error) {

    }

  }


  //Added by Urmila A | 16-Mar-23 | LGTGTWINT-684 | start
  fnGetClientMaxProfit2(tofind){
    if (!this.Targetpips || this.Targetpips === '' || !this.NotionalPerFixing || this.NotionalPerFixing === '') {
      return;
    }

    try{
      let ToFind;
      let MaxClientProfit;
      let spotrate;
      this.OrderDirection.toLowerCase() === 'buy' ? spotrate = this.AskSpot : spotrate = this.BidSpot
    
      //Added by Urmila A | 17-Mar-23
      if(spotrate.includes(',')){
          spotrate = spotrate.replaceAll(',','')
      }

      if(tofind === 'ccy2'){
            ToFind = 'ccy2';
            MaxClientProfit = 'Get_MaxProfitCCy2';
      }else  if(this.NotionalCcy === this.CurrencyPair.split('-')[0].trim() ){
            ToFind = 'ccy2';
            MaxClientProfit = 'Get_MaxProfitCCy2';
            this.MaxClientvalue = this.maxClientProfitCcy1 =0
      }else{
            ToFind = 'ccy1';
            MaxClientProfit = 'Get_MaxProfitCCy1';
            this.MaxClientvalue = this.maxClientProfitCcy2 = 0         
      }
     
  
      let param4 = this.NotionalCcy + ', ' + this.CurrencyPair.split('-')[0].trim() + ', ' + spotrate + ', ' + this.NotionalPerFixing.replaceAll(',','') +
      ', ' + this.Strike + ', ' + Number(this.TargetBF).toFixed(this.PointShift) + ',' + this.MaxClientvalue + ',' + this.CurrencyPair + ', ' +
       (Number(parseFloat(this.Targetpips).toFixed(this.PointShift)))
      
  
      if(ToFind === 'ccy2' || tofind === 'ccy2'){
        this.maxClientProfitCcy2=0
          //changed method name as generic for UCP functions, by UrmilaA, 2-May-23 | LGTGTWINT-1947
        this.MaxClientSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( MaxClientProfit , param4) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
              .subscribe((res:any)=>{
                  try{
                        //mapping modified by Urmila A | 31-Aug-23
                        if(res !== null){
                        res = res.FunctionGenericOutput                    
                        this.MaxClientvalue = this.fnParseMAX_ClientProfit(res)
  
                        let param4 = this.NotionalCcy + ', ' + this.CurrencyPair.split('-')[0].trim() + ', ' + spotrate + ', ' + this.NotionalPerFixing.replaceAll(',','') +
                        ', ' + this.Strike + ', ' + parseFloat(this.TargetBF) + ',' + this.MaxClientvalue + ',' + this.CurrencyPair + ', ' +
                         (Number(parseFloat(this.Targetpips)))
                         
                        this.maxClientProfitCcy2 = this.FXD_cfs.numberWithCommas(this.MaxClientvalue)
                        console.log(' max client 2 :', 'maxClientProfitCcy2',this.maxClientProfitCcy2)
                      
                        MaxClientProfit = 'Get_MaxProfitCCy1';
                      
                        if(this.maxClientProfitCcy1 === '0' || this.maxClientProfitCcy1 === 0){
                          this.fnFindClientProfit1(MaxClientProfit,param4,ToFind )
                        }
                       
                      }
                  }catch(err){}
        })
      }else if(ToFind === 'ccy1'){
        this.fnFindClientProfit1(MaxClientProfit,param4,ToFind )
      }
    }catch(err){

    }
    
   
  }

  fnFindClientProfit1(MaxClientProfit,param4,ToFind){
    let spotrate :any;
    this.OrderDirection.toLowerCase() === 'buy' ? spotrate = this.AskSpot : this.BidSpot
     //changed method name as generic for UCP functions, by UrmilaA, 2-May-23 | LGTGTWINT-1947
     //API req parameters modified by Urmila A | 21-Aug-23 | core migration
        this.MaxClientSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( MaxClientProfit , param4)
        .subscribe((res:any)=>{
            try{
                if(res !== null){
                    //mapping modified by Urmila A | 31-Aug-23
                      this.maxClientProfitCcy1 =0
                      res = res.FunctionGenericOutput
                      this.MaxClientvalue = this.fnParseMAX_ClientProfit(res)
                     
                      if(this.NotionalToggle){
                            this.fnGetClientMaxProfit2('ccy2')
                      }
                      this.maxClientProfitCcy1 = this.FXD_cfs.numberWithCommas(this.MaxClientvalue)
                      console.log('max client 1 ' ,'maxClientProfitCcy1',ToFind,this.maxClientProfitCcy1 )
                }
            }catch(err){}
        });
  }

  fnParseMAX_ClientProfit(response){
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(response, "text/xml")
        let value =  xmlDoc.getElementsByTagName("Column1")[0].childNodes[0].nodeValue
        return Number(value).toFixed(2)
  }

//Added by Urmila A | 16-Mar-23 | LGTGTWINT-684 | end


// Added by Urmila A | 3-May-23 | LGTGTWINT-1947 | start
getFinalPaytype(){
  let param4 = this.FXD_afs.EntityID +","+ this.Type  ; //modified by  UrmilaA | 17 May 2023 | LGTGTWINT-1947
  this.finalPaySub = this.FXD_afs.FXDGet_FunctionValue_FXDC_API( 'FinIQ_Set_FinalPaytype', param4) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  .subscribe((res:any)=>{
    try{
          if(res !== null){
              res =res.FunctionGenericOutput
              this.FinalPayTypeOptions=[]
              res = this.FXD_cfs.fnParseXML(res, 'finappaytype') //urmilaA |LGTGTWINT-2123 | 14-June-23
              console.log('final pay type:', res)
              this.SelectedFinalPayType=res[0]
              this.FinalPayTypeOptions.push(...res)
              this.getFixingAdjustment();
             
          }
    }catch(err){
      console.log(err)
    }
  })
  
}

getFixingAdjustment(){
  let param4 = this.SelectedFinalPayType + ',' + this.FXD_afs.EntityID;
  this.fixingAdjSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( 'Get_FixingAdjustment', param4 ) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  .subscribe((res:any)=>{
    try{
          //mapping modified by Urmila A | 31-Aug-23
          if(res !== null){
              this.FixingAdjustment=[]
              res =res.FunctionGenericOutput
              res = this.FXD_cfs.fnParseXML(res, 'fixingAdj')//urmilaA |LGTGTWINT-2123 | 14-June-23
              console.log('fixing adj:', res)
              this.FixingAdjustment.push(...res)
              this.SelectedFixingAdjustment=res[0]          
          }
    }catch(err){
      console.log(err)
    }
  })
} 
fnChngfixingAdj(e){
  this.SelectedFixingAdjustment=e.target.value;
}
getTargetType(){
 //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  this.targetTypeSub = this.FXD_afs.FXDGet_FunctionValue_FXDC_API('Get_KOTypeBasedonEntity', this.FXD_afs.EntityID).subscribe((res:any)=>{
      try{    
            //mapping modified by Urmila A | 31-Aug-23
            if(res !== null){
            this.TargetTypes=[]         
            res = res.FunctionGenericOutput
            res = this.FXD_cfs.fnParseXML(res, 'KOtype')//urmilaA |LGTGTWINT-2123 | 14-June-23
            console.log('target type:', res)
            this.TargetTypes.push(...res)
            this.Type=res[0]
            console.log('KO types:', this.TargetTypes)

          }
      }catch(err) {console.log(err)}
    })
}

//commented as code shifted to fxd-common service | UrmilaA | LGTGTWINT-2123 | 13-June-23
// fnParseXML(response, parse){
//   let value;
//   let FA=[];
//   let KO=[];
//   let parser = new DOMParser()
//   let xmlDoc = parser.parseFromString(response, "text/xml")
//   if(parse === 'fixingAdj' || parse === 'finappaytype' ){  //modified by UrmilaA, 17-may-23
//     value =  xmlDoc.getElementsByTagName("FinalPayType")
//     let inputList = Array.prototype.slice.call(value);
//     console.log('inputList',inputList)
//     inputList.forEach(element => {
//           console.log('in for',element)
//           FA.push(element.childNodes[0].nodeValue)
//     });  
//     return FA
//   }else if(parse === 'KOtype'){
//     value =  xmlDoc.getElementsByTagName("KOType")
//     let inputList = Array.prototype.slice.call(value);
//     inputList.forEach(element => {
//           KO.push(element.childNodes[0].nodeValue)
//     });  
//     return KO
//   }
//   else{
//     value =  xmlDoc.getElementsByTagName("Element")[0].childNodes[0].nodeValue;
//     return value
//   }
// }
// Added by Urmila A | 3-May-23 | LGTGTWINT-1947 | ends


//added by UrmilaA, LGTGTWINT-1953 | 5-May-23 | start
fnChngKOType(e){
    this.NoofKOEvent=0
    this.Type = e.target.value;
    this.getFinalPaytype() ; //UrmilaA, LGTGTWINT-1947  | 17-may-23
}

fnITMChng(e){
  this.NoofKOEvent=Number(e.target.value);
  
}
//added by UrmilaA, LGTGTWINT-1953 | 5-May-23 | ends


  getEntityData() {
    //removed EntityId from req params by UrmilaA | 24-april-23
    this.FXDEntitySubscriber = this.FXD_afs.getEntityData( this.Product_Code) //Core migration : API req paarms modified by Urmila A | 23-Aug-23
    .subscribe((res: any) => {
      console.log("entity data", res);
      try{
        if (res.GetEntityDataResult.CVPResponse.CVPData && this.FXD_cfs.fnCheckSessionValidity(res.GetEntityDataResult)) {
          this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
          sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code) //LGTGTWINT-1898, UrmilaA, 24-april-23
          this.FXD_afs.SetCredentials() //LGTGTWINT-1898, UrmilaA, 24-april-23
          //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
          if(this.EntityData[0].Code === '50'){
            this.CustomerID = this.HomeAPI.CustomerId = '50';
            this.HomeAPI.CustomerName = 'CustomerPB';             
           }//end
        }
      }catch(err){}    
    })
  }

   //Modified by Urmila A | 24-April-23, for PB demo entity | LGTGTWINT-1898 
   chngEntity(e){
    if(e.target.value === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';   
    }
    
    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)
    this.FXD_afs.SetCredentials();
    this.SetDefaultValues();
    this.fnButtonVisibility();
    this.getTargetType()   //added by UrmilaA, LGTGTWINT-1947 | 17-may-23
    this.getFinalPaytype();
    this.fnGetPriceProviderandCcypairs();  
    this.fnGetCCypair();
  }

  // Urmila A | Quote Email functionality | start
  EmailQuote() {
    this.QuteMailClicked = true;
    this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName, this.NoteMasterID.toString(), this.Product_ID, this.DCDRfqId)
      .subscribe((res) => {
        try {
          if (res) {
            console.log('Quote mail:', res)
            res=res.SendQuoteEmailResult
              if(res.A_ResponseHeader.FailedReason == ''){
                  if(res.QuoteEmailSentYN === true){
                    this.FXD_cfs.fxdpopupOpenClose=true;
                    this.QuoteMailSent = true;
                    this.QuteMailClicked=false;
                  }else{
                    this.QuoteMailSent = false;
                  }
              }else{
                this.NotificationFunction("Error","Error",res.A_ResponseHeader.FailedReason)
                this.QuoteMailSent=false;
                this.QuteMailClicked=false;
              }  
          }else{ //added by Urmila A | 15-sep-23
            this.QuoteMailSent = false;
            this.QuteMailClicked=false;
            this.NotificationFunction("Error","Error","No Response from service")
          }
        } catch (err) { }
      });

  }
  closeOrderPopup() {
    // this.OrderClicked=false; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlaced = true; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }

  closeEmailQuote() {
    this.QuoteMailSent = false;
    this.closeQuoteMail=true; //UrmilaA | 13-feb-23
    this.OrderPlaced =true //Enable / disable check added by Urmila A | LGTGTWINT-1446 | 24-feb-24
  }
  // Urmila A | end


  // Urmila A | 11-Nov-22 |  Start
  FindLeftUSDMidRate(LeftCCY) {
    this.LeftUSDMidrate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      LeftCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      //mapping modified by Urmila A | 31-Aug-23
      if (res !== null) {
        this.AllDataLoaded.bidask = true;
        this.LeftUSDMidrate = res?.MidRate;
        console.log('left USD Midrate:', this.LeftUSDMidrate);
        if(!this.IsNavigate){ //Added by Urmila A | 11-Jan-23
          this.GetStrikeRate();
        }
      }
    });
  }
  FindRightUSDMidRate(RightCCY) {
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(      //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      RightCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
       //mapping modified by Urmila A | 31-Aug-23
      if (res !== null) {
        this.AllDataLoaded.bidask = true;
        this.RightUSDMidRate = res?.MidRate;
        console.log('Right USD Midrate:', this.RightUSDMidRate);    
        if(!this.IsNavigate){ //Added by Urmila A | 11-Jan-23
          this.GetStrikeRate();
        }
      }
    });
  }
  fnFindUpfrontUSD() {
    //currently commenting this part as discussed with Rahul P | 24-Feb-23 | start 
    // if(this.IBPremToggle || this.NotionalToggle){
    //   if(this.UpfrontAlt !== ''){ //added by Urmila A | 11-Jan-23 | | LGTCLI-244
    //     this.UpfrontAlt = Number(this.UpfrontAlt.replaceAll(',',''))
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
    //currently commenting this part as discussed with Rahul P | 24-Feb-23 | end

    //Urmila A | LGTGTWINT-1519 | 24-feb-23
    if(this.UpfrontVal.includes('-') || this.UpfrontAlt.includes('-')){
      this.UpfrontVal = this.UpfrontVal.replace('-','')
      this.UpfrontAlt = this.UpfrontAlt.replace('-','')
    }

    this.UpfrontVal = this.UpfrontVal.replaceAll(',', '') //Urmila A | 1-Feb-23 |LGTCLI-287
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
    } else if (this.Pair_Cross_YN === 'Y') {
      console.log(
        'left USD:',
        this.Left_USD_Pair,
        'Right USD:',
        this.Right_USD_Pair
      );
      if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.DepCcy) {
        this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      } else if (  this.NotionalCcy === this.AltCcy &&  this.IBPremCcy === this.DepCcy ) {
        this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      } else if ( this.NotionalCcy === this.DepCcy &&  this.IBPremCcy === this.AltCcy) {
        this.RightUSDMidRate !== '' ? this.UpfrontAlt =
          this.UpfrontVal * this.RightUSDMidRate : '';
      } else if (  this.NotionalCcy === this.AltCcy &&  this.IBPremCcy === this.AltCcy ) {
        this.RightUSDMidRate !== '' ? this.UpfrontAlt =
          this.UpfrontVal / this.RightUSDMidRate : '';
      }
    }
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal)
    //Added by Urmila A | 11-Jan-23 | start | LGTCLI-246
    if(typeof this.UpfrontAlt === "string"  && !this.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
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

    console.log('Upfront USD:', this.UpfrontAlt)
  }

  // Urmila A | 11-Nov-22 |  end

  fnFinalPayTypeChnge(e) {
    console.log('final pay', e.target.value)
    this.SelectedFinalPayType = e.target.value
    this.getFixingAdjustment(); //added by UrmilaA, LGTGTWINT-1947 | 17-may-23
    // below code commented by UrmilaA, | 3-May-23 | LGTGTWINT-1947
    // if (e.target.value === 'Exact') {
    //   this.SelectedFixingAdjustment = 'Notional'
    // }else {
    //   this.SelectedFixingAdjustment = e.target.value
    // }
    this.fnGetContractSummary();
  }

  fnOptionCutChange(e) {
    this.OptionCut = e.target.value;
    this.fnGetDatesCalculationforVB()
  }

  // ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
  fnSaveTrade() {
    this.SaveTradeLoader = true
    this.disabledRoutetodealeronSaveTrade = true //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | disabled Route to dealer.
    this.FXD_afs.SetOrderbtnonSaveTrade(true) //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | for disabled order btn.
    this.fngetSavetradeRecommendation()
  }
  // ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

  // Added by Urmila A | 22-Nov-22| Load Default values | start
  fngetPersonalDefaultValues() {
    //API req params modifications by Urmila A | 21-Aug-23 | core migration
    this.PersonalDefaultValueSubscriber = this.FXD_afs.getPersonalSettingFXD(this.FXD_afs.EntityID, this.FXD_afs.UserName, this.Product_Code)
      .subscribe((res: any) => {
        try {
          if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetPersonalSettingsResult)) {
            // console.log('getPersonal Setting res=>',res)
            res = res.GetPersonalSettingsResult.DC_PersonSettingsData[0]
            this.DepCcy = res.TextSetting1;
            this.AltCcy = res.TextSetting2;
            this.Tenor = res.TextSetting3;
            this.NotionalPerFixing = this.FXD_cfs.numberWithCommas(res.TextSetting4);
            if (this.Tenor.includes('W')) {
              this.TenorDays = parseInt(this.Tenor) * 7
            } else if (this.Tenor.includes('M')) {
              this.TenorDays = parseInt(this.Tenor) * 30
            } else if (this.Tenor.includes('Y')) {
              this.TenorDays = parseInt(this.Tenor) * 365
            }
          }
        } catch (ex) { }
      })
  }

  //added by urmilaA | LGTCLI-361 | 30-May-23 | start
  fnResetpricingFlags(){
    this.MinQuoteTimeOutOccurred =false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.MaxQuotePriceCame= false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.btnEnable=false;
    this.noResponseRecv=false; // Urmila A, 29-mar-23
    this.OrderPlaceFlag=false; //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
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

  ResetPricer() {
    this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 17-may-23
    this.PriceClick=false; // LGTGTWINT-2109 | UrmilaA
    this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361
    this.ResetPricerFlag=true;  //Urmila A | 6-Mar-23
    this.RMRemarkVisibility=false; //LGTGTWINT-1599, Urmila A | 3-Mar-23
    this.FirstFixingDate=''; //Urmila A | 10-feb-23
    this.RouteFromWorkflow = false;
    this.NewOrderfromRMUnlocked=false; //Urmila A, as reject button was enable after resetpricer
    this.IsNavigate=false; //Urmila A | 17-feb-23
    this.scheduleBtnClick=false //Urmila A | 28-Jan-23;
    // this.OrderPlaced=false;  //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
    this.DestroyFn() //UrmilaA, LGTCLI-361 | 17-May-23
    this.ResetAllFields()
    this.SetDefaultValues();
    this.fnButtonVisibility();   //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23

    if(this.BestPrice){
      this.closeSignalR()   //added by UrmilaA, 16-May-23 | LGTCLI-361
    }

    // this.fnAssignProdDetails('tarfbuy'); //Urmila A | 20-feb-23 | LGTGTWINT-1444 //commented by Urmila A | LGTGTWINT-1737 | 17-Mar-23

    this.ResetAllFields(); //HSBCFXEINT-41 | Chaitanya M | 23-Jan-2024
    
    //Added by Urmila A | 17-Mar-23 |LGTGTWINT-1737
    this.fnGetPriceProviderandCcypairs();
    this.fnGetCCypair()
    this.getFinalPaytype()  //added by UrmilaA, LGTGTWINT-1947 - hotfix| 29-may-23
    this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
    this.fnGetContractSummary()

    //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
    this.maxClientProfitCcy1='';
    this.maxClientProfitCcy2='';

    //Urmila A, 29-mar-23
    this.RouteFromQuoteHistory=false;
    this.noResponseRecv=false;

  }

  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | start
  fnRouteDealerClick() {
    if (this.DealerRemark === '') {
      this.Errormsg = 'Please enter remark'
      this.NotificationFunction("Error", "Error", this.Errormsg)
    } else if (this.DealerRemark !== '') {
      this.Errormsg = ''
      this.routeToDealerClicked = true;
      this.confirmedRouteDealer = false;
      this.SaveTradeEnabledFlag = false //Added  Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P. | disabled save trade idea on Route to dealer
    }
  }
  closeRouteToDealer() {
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted = true;
  }

  fnConfirmRouteToDealer() {
    this.confirmedRouteDealer = true;
    this.routeToDealerClicked = false;
    this.routeToDealerClickedloader = false
    this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(this.FXD_afs.EntityID, this.FXD_afs.UserName,
      this.Product_Code, this.DCDRfqId, this.NoteMasterID, this.CustPAN, this.DealerRemark, this.ExceptionWarningMsg)
      .subscribe((res: any) => {
        try {
          res=res.result;
          if (res) {
            if (res === true) // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            {
              if (res === true) {
                this.routeToDealerClicked = true;
                this.IsRouteToDealerExecuted = true;
                this.routeToDealerClickedloader = true
                console.log('Route to dealer res:', res)
              }
            }
            // ---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            else {
              this.routeToDealerClickedloader = true
              this.NotificationFunction("Error", "Error", "Route to dealer failed.")
            }
            // ---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572

          }
        } catch (err) { }
      })
  }
  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | end
  fnChngeRemark(e) {
    this.DealerRemark = e.target.value
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

  fnCloseRejectRouteToDealer() {
    this.RejectRedirectedOrder = false;
  }
  // Modified by UrmilaA | Reject route to dealer | code sync with 5star | end

  

  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
  fngetSavetradeRecommendation() {
    this.Mode = this.FXD_cfs.fngetMode(); //Urmila A | 15-Feb-23 | LGTGTWINT-1403
      //API req body params modified by Urmila A | 21-Aug-23 | Core migration
    this.FXD_afs.getSavetradeRecommendation(this.FXD_afs.UserName,this.NoteMasterID,this.DCDRfqId,
      this.Mode,this.DealerRemark)  //Urmila A | 15-Feb-23 | LGTGTWINT-1403
      .subscribe((res: any) => {
        try {
          res=res.result;
          if (res)  { //Urmila A | 23-Mar-23
            this.SavetradePopup = true
            this.SaveTradeLoader = false
            this.SaveTradeEnabledFlag = false
            // console.log('getPersonal Setting res=>', res, res.SaveTradeRecommendationResult,)
          }
          else {
            this.SaveTradeLoader = false
            this.NotificationFunction("Error", "Error", "Save Trade Idea Failed.")
          }
        } catch (ex) { }
      })
  }

  // ---END--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29

  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572
  NotificationFunction(type, header, reason) {
    this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
      NotificationType: type, //'Error',
      header: header, // 'Error',
      body: reason,
      DateandTime: ''
    });
  }
  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572



  //Added by Urmila A | 27-Dec-22 | LGTCLI-208 | start
  fnNotionalCCYToggle() {
    this.NotionalToggle=true;
    this.ccy2 = true;
    if (this.ccy2 === true && this.NotionalCcy !== this.AltCcy) {
      this.NotionalCcy = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.NotionalCcy = this.DepCcy;
    }

    //Logic added by Urmila A | for LGTCLI-251 | as per client requirement , 12-Jan-23  | start
    // this.IBPremCcy = this.NotionalCcy
        // this.IBPremCcy = this.DepCcy //Urmila A | LGTCLI-251 | 30-Jan-23
    //ends

    try {
      try {
          //mappings modified by Urmila A | 26-Dec-23
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.NotionalCcy === element.asset1) {
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCcy === element.asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.NotionalAmt = this.FXD_cfs.NotionalChangewithDecimalFixes(this.NotionalAmt, this.NotionalDecimalPointShift);
           
          }
        });
      } catch (ex) {

      }
    } catch (Ex) {

    }

    if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ //added by Urmila A | 11-Jan-23 | LGTCLI-244
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
    //end
  }

  //Added by Urmila A |  27-Dec-22 | LGTCLI-208
  fnIBPremCCYToggle() {
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


  // Urmila A | 4-Mar-23
  StrikeChnge(e){
    this.Strike = Number(e.target.value).toFixed(this.PointShift)
    this.fnGetClientMaxProfit2(''); //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
  }

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

//urmila A | 3-May-23 | LGTGTWINT-1897 | start
fnchngPriceProvider(e){
  if(e.target.value !== 'Bestprice'){
    this.BestPricelbl = "Price"; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024
    this.PriceProviderString = e.target.value   
    this.PriceproviderArr.forEach(element => {
              if(element.PP_Code === e.target.value ){
                this.SelectedLPForPricing = element.PP_Name
                this.SampleArray=element
              }
    });
    console.log('this.SampleArray',this.SampleArray)
  }else{
    this.SelectedLPForPricing = this.BestPricelbl =  'Best Price'; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024
    this.fngetPriceProviderStr(this.PriceproviderArr)
  }

}
//urmila A | 3-May-23 | LGTGTWINT-1897 | ends


 //UrmilaA | LGTGTWINT-1895 | 13-june-23 | start
 fnGetFixingFreq(){
  let param4 = this.FXD_afs.EntityID +","+this.Product_ID; 
  this.fixingSubscriber = this.FXD_afs.FXDGet_FunctionValue_FXDC_API('FixingSett_FrequencybasedonEntity',param4) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
    .subscribe((res:any)=>{
      try{
          //mapping modified by Urmila A | 31-Aug-23
          if(res !== null ){
            this.FixingFreqArr=[]  
            res=res.FunctionGenericOutput
              res = this.FXD_cfs.fnParseXML(res, 'fixingfreq')
              console.log('fiixng freq:',res)
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




