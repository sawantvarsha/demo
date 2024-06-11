import {Component,OnInit,Input,HostListener,OnChanges,SimpleChanges,} from '@angular/core';
import { OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import moment from 'moment';
import { AppConfig } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service';

declare var require: any;
const $: any = require('jquery');
@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss', '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})

export class StrategyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() Product_ID: any;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;

  @Input() ViewMode: string;
  @Input() InputData: any;

  @Input() Template_Name: any;
  @Input() TemplateCode: any;
  @Input() TemplateID: any;
  @Input() AllProdData: any;

  @Input() isAQPresent: any;
  @Input() isDQPresent: any;
  @Input() StrategySubtype: any;  // Added changes by Mayuri D. on 21-Apr-2023 | LGTGTWINT-1907
  @Input() EntityData: any; //UrmilaA, LGTGTWINT-1898 | 25-April-23
  @Input() ShowPriceProviderOnQEN:any;
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;
  
  // IsIALoggedIn: boolean;
  CustPrem: any;
  // BookOrderRes: any = [] = [];
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  screenHeight: number;
  screenWidth: number;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: any;
  FXDOptionCutSubscriber: any;
  FXDFirstFixingDateSubscriber: any;
  FXDGetNoofSettSubscriber: Subscription;
  RFQNODisplayFromParent: boolean = false;
  SessionInvalid: boolean = false;
  FXDRouteToDealerSubscriber: any;
  ProdChangedYN: boolean = false;
  prodDetailSubscriber: Subscription;
  selectedProduct: any;
  OrderClicked: any = false;
  firstfixval: any;
  ScheduleXML: any = '';
  ScheduleDescription: any = '';
  GuaranteedPeriodTill: any = '';
  ScheduleCallWithGuarenteeperiod: boolean = false;
  DealerRemark: any;
  AfterRouteClearLps: boolean = false;
  NoteToUnblock: any;
  UnlockMsg: any;
  ClearLPs: boolean = false;
  IBPremToggle: boolean = false;
  ResetPricerFlag: boolean = false;
  scheduleBtnClick: boolean = false;
  cnt: any = 0;
  GperiodChange: boolean = false;
  ResetAllfieldsCalled: boolean = false;
  closeQuoteMail: boolean = false;
  RMRemarkVisibility: boolean = false;
  ClientPremDir: any = '';
  PriceRecvFromLPs: any = 0;
  IsNavigate: boolean = false;
  DealerRemarkVisibility: boolean = false;
  NDFFlag: string = 'N';
  isMetal: string = 'N';
  noResponseRecv: boolean = false;

  isSpreadVisible: boolean = false;
  isEmailQuoteVisible: boolean = false;
  isSchedulevisible: boolean = false;
  isResetvisible: boolean = false;
  isRoutetoDealerVisible: boolean = false;
  isSaveTradevisible: boolean = false;
  isOrderBtnVisible: boolean = false;
  isRejectVisible: boolean = false;

  CommomDataSubscriber: Subscription;
  PriceproviderArr: any[]=[];
  LPname: any;
  Clientperc: any;
  IBPremium: any;
  //---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29
  SaveTradeEnabledFlag: boolean = false
  // SaveTradeLoader: boolean = false
  disabledRoutetodealeronSaveTrade: boolean = false
  SavetradePopup: boolean = false
  NotionalToggle: boolean = false;
  LeverageFactor: string;
  IBPremNotionalDecimal: any;
  SpreadRounding: any;
  PremDecimal: any;
  selectedCustomerSubscription: any;
  PreminPipsToggle :any; // HSBCFXEINT-79 UAT- Pricing in pips & % (code sync-up)| ChaitanyaM | 06-March-2024
  EntityDataStrategy: any[]; //RizwanS || EFGUPINT-138 || 10 Apr 2024

  togglePremiumMetals : string;
  togglePremiumNonMetals : string;
  togglePremiumCcy : string;
  showPremAmt: any;
  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
  OPTDEN_UseTwoStepDILogic: string = "NO"; // RizwanS || EFGUPINT-335 || 23 APr 2024
  
  //---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29

  @HostListener('document:keydown', ['$event'])

  onKeyDownHandler(event: KeyboardEvent) {
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

  public getScreenWidth: any;
  public getScreenHeight: any;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('Width:', this.getScreenWidth, 'Height', this.getScreenHeight)
  }

  FXCurrencyPairsubscription: any;
  TenorDayssubscription: any;
  FXBidAsksubscription: any;
  FXDatesCalculationsubscription: any;
  FXPriceProvidersubscription: any;
  Bestpricesubscription: any;
  BookOrdersubscription: any;
  PersonalDefaultValueSubscriber: any;
  productInfoSubscriber: any;
  GetTenorSubscriber: any;
  getBidaskSubscriber: any;
  FXDProductDetailsSubscriber: any;
  FXDContractSummSubscriber: any;
  QuteMailClicked: boolean = false
  FXD_RFQDealDetailsNavigateSubscriber: any;
  RFQDetailsFromNoteMasterSubscrber: any;
  ScheduleSub: any;
  SchedulePOP_UP_Subscriber: any;

  CurrencyPair: string = '';
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
  IBPrem: any;
  IBPremCcy: string;
  ClientPrem: any;
  Upfront: any ;

  UpfrontAlt: any;

  TradeDate: string;
  Premiumdate: string;
  FinalFixingDate: string;
  FinalSettDate: string;
  FixingSettFreq: string;
  Leverage: any;
  KORate: string;
  KIRate: string = '';
  GuaranteedPeriods: string = '0';
  ViewSchedule: boolean;
  Delta: string;
  DeltaAmt: string;
  DeltaCcy: string;
  CurrencyPairList = [];
  DateArray = [];
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
  LoadingAQDQFlag: boolean;
  NoteMasterID: string;
  ViewScheduleflag: boolean = false;
  DealNo: string;
  SampleArray = [];

  DCDRfqId: string='';
  ExternalRfqId: string;
  BestPriceabs: number;

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
  StrikePoint: any;
  // OptionType: string; //LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
  ClearPricingFlag: boolean;
  selectedCustomerDetails: any=[]=[];
  CustomerID: string = "";
  CustomerName: any;
  OptionCut: string = '';


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
  PricingModes = ['Auto'];

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
  // IsRMLoggedIn: boolean = false;
  IsRouteToDealerExecuted: boolean = false;
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
    tenor: true,
    priceprovider: false,
    bidask: false,
    datecalculation: false,
    FixingDate: false,

  };
  firstTimeExecuted: boolean = false;
  // EntityData:any[] = [] //commented by UrmilaA, 25-april-23


  UpfrontVal: any;
  QuoteValidity: any;
  PPDetails: any[] = [];
  orderMsg: string;
  OrderPlaced: boolean = false;
  OrderPlacedPopup: boolean = false;
  Pair_Cross_YN: any;
  Left_USD_Pair: any;
  Right_USD_Pair: any;
  LeftUSDMidrate: any;
  RightUSDMidRate: any;
  SpotMidRate: any;


  FirstFixingDate: string = '';
  custPremDirection: any;
  IBPremDirection: any;
  QuoteMailSent: boolean = false
  AltNotional: any = 0;
  // IsAdvisoryLoggedIn: boolean = false;
  ExceptionWarningMsg: any = '';
  CustPAN: any = '';
  routeToDealerClicked: boolean = false;
  routeToDealerClickedloader: boolean = false // //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  confirmedRouteDealer: boolean = false;
  RouteFromWorkflow: boolean = false;
  firstFixChngAndDatesReceived: boolean = false;
  @Input() RFQDetailsFromBlotterYes_QueueStatus: any;
  ExecutedQueue: boolean = false;
  NewOrderfromRMLocked: boolean = false;
  NewOrderfromRMUnlocked: boolean = false;
  TradeIdea: boolean = false;
  ExpiredTradeIdea: boolean = false;
  RejectedOrder: boolean = false;

  OriginalIBPremPer: any;
  RFQLockedSecLeft: any = 0;
  RFQLockedInterval: any;
  SecInterval: any;
  // LockedDealPopUp: any = false;
  RFQLockedBy: any;
  Parant_DCDRFQID: any = '';
  DI_YN: any = '';
  PriceRecAfterRepricefromBlotter: boolean = false;
  BlotterRFQ: any;
  RejectSubscriber: any;
  RejectRedirectedOrder: boolean = false;
  RejectedOrderMSG: any = '';
  // DealerLoggedIn: boolean = false;
  unlockNotemasterSubscriber: any;
  unlockNoteMasterYN: boolean = false;
  ccy1: boolean = false;
  ccy2: boolean = false;
  DIfromTradeIdea: any = '';
  CurrencyChanged: boolean = false;
  CcySearch: any = '';
  AllAPIsLoaded: boolean = false
  PointShift: any;
  RouteFromQuoteHistory: boolean = false;
  prevFirstFixingDate: any = '';

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
  SignalR_unsubscriber:boolean=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  MaxQuotePriceCame:boolean=false;// Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
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

  //LGTGTWINT-2137 | 16-June-23 |start
  isQENMode:boolean=false;
  isSENMode:boolean=false;
  //LGTGTWINT-2137 | 16-June-23 |ends

  ShowPriceProvider:boolean;
  showPPDropdown:boolean;

  // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
  isSpreadStrategy :boolean=false;
  selectedOptionType = ["Call", "Put"];
  OptionType: any;
  // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
  

  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024

  constructor(
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    private datepipe: DatePipe,
    public sanitize: SanitizeHtmlPipePipe,
    public CustAPI: CustomerApiService,
    public SignalR: FXDSignalRService

  ) {
    this.SeletcedPricingModel = '';
    this.ClearPricingFlag = false;
    this.disabledPrembtn = false;
    this.OptionCut = '';
    this.NotionalPerFixing = '100,000.00';
    this.NoOfSett = '52';
    this.SelectedKIStyle = '';
    this.HomeAPI.CustomerId = '1';
    this.HomeAPI.CustomerName = 'LGT-CUST001';
    this.CustomerID = '1';
    this.SessionInvalid = false;
    this.OrderPlacedPopup = false;
    this.GuaranteedPeriods = '0';
  }
  ngOnChanges(): void {
    // throw new Error('Method not implemented.');
  }

  // selectedOptionType: any = "Call" // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
  SelectedStrategy: any = "STRANGLE"                  // Added changes by Mayuri D. on 21-Apr-2023 | LGTGTWINT-1907 
  showCallStrike = true
  showPutStrike = true
  showLeverageFactor = false
  showOptionType = false
  showStrike = false
  CallStrike: any = ''
  PutStrike: any = ''
  PremiumCcy: any
  FixingDate: any
  MaturityDate: any
  PriceProvider: any
  CustID = '50'
  Customer_Name = 'CustomerPB'

  ngOnInit() {
 
    this.fnSetEntity();  //UrmilaA, 3-May-23 | LGTGTWINT-1949

    //added by UrmilaA | LGTGTWINT-2137 (Usertype checks replaced with Mode)| 16-june-23 |start
     if(this.FXD_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }else if(this.FXD_cfs.fngetMode() == 'SEN'){
      this.isSENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }
    //added by UrmilaA | LGTGTWINT-2137 | 16-june-23 |ends

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    // console.log("Prpduct is " ,this.AllProdData , this.StrategySubtype)
    this.SelectedStrategy = "STRANGLE"  // Added changes by Mayuri D. on 21-Apr-2023 | LGTGTWINT-1907 

   
     // Urmila A | check View schedule pop-up visibility | start
    this.SchedulePOP_UP_Subscriber = this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res => {
      if (res === false) {
        this.ViewScheduleflag = false
      } else {
        this.ViewScheduleflag = true
      }
    });
    // Urmila A | check View schedule pop-up visibility | ends


    //Urmila A | Workflow RFQ Deal details | LGTGTWINT-561 | start
    this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes: any) => {
      try {

        //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, start
        if (navigateRes.navigate === true && navigateRes.ProdcutCode === 'STRANGLE' || navigateRes.ProdcutCode === 'STRADDLE' ||
         navigateRes.ProdcutCode === 'RSKREV' || navigateRes.ProdcutCode === 'OPSPRD') {

          console.log('after redirect data: ', navigateRes);
          this.IsNavigate = true;

          //Mode changes done by Urmila A, 6-april-23 | LGTGTWINT-1758 (mention in comment)
          this.Mode = navigateRes.redirectFrom === 'blotter' ? this.FXD_cfs.fngetMode() : 'QEN'; //Urmila A | 15-Feb-23 | LGTCLI-286

          this.RFQDetailsFromNoteMasterSubscrber = this.FXD_afs.FXDGetRFQDetailsFromNoteMasterIDAPI(navigateRes.ReFNo, this.FXD_afs.UserName,this.Mode) //API req modified by Urmila A | 21-Aug-23 | Core migration 
            .subscribe((res: any) => {
              try {
                if (res !== null) {
                  //res = res[0];
                  console.log('RFQ from Note master: ', res, 'RFQDetailsFromBlotterYes_QueueStatus', this.RFQDetailsFromBlotterYes_QueueStatus);
                  if (res.length === undefined) {
                    if (navigateRes.redirectFrom === 'blotter') {
                      this.DI_YN = 'N';
                      this.Parant_DCDRFQID = '';
                      this.NoteToUnblock = ''; //Urmila A | 19-Jan-23 
                      this.NoteMasterID = ''//Urmila A | 27-Jan-23
                      this.DIfromTradeIdea = 'N';
                      switch (this.RFQDetailsFromBlotterYes_QueueStatus) {
                        case 'Executed Orders':
                          this.ExecutedQueue = true;
                          this.NoteToUnblock = navigateRes.ReFNo;
                          break;
                        case 'Trade Idea':
                          this.TradeIdea = true;
                          this.DI_YN = 'Y';
                          this.DIfromTradeIdea = 'Y';
                          this.Parant_DCDRFQID = res.ParentRFQNumber;
                          this.NoteToUnblock = navigateRes.ReFNo;
                          break;
                        case 'Expired Trade Idea':
                          this.ExpiredTradeIdea = true;
                          this.NoteToUnblock = navigateRes.ReFNo;
                          break;
                        case 'New Order from RM':
                          if (res.LockStatusMsg !== '' && res.LockStatusMsg.includes(this.FXD_afs.UserName)) {
                            this.NewOrderfromRMUnlocked = true;
                            this.DI_YN = res.DI_YN;
                            this.Parant_DCDRFQID = res.ParentRFQNumber;
                            this.NoteMasterID = navigateRes.ReFNo;
                            this.NoteToUnblock = navigateRes.ReFNo;
                            this.fnRFQLockerForTimer();
                          } else if (res.LockStatusMsg !== '' && !res.LockStatusMsg.includes(this.FXD_afs.UserName)) {
                            this.NewOrderfromRMLocked = true;
                            if (res.DI_YN === 'Y') {
                              this.DI_YN = 'Y';
                              this.Parant_DCDRFQID = res.ParentRFQNumber;
                              this.NoteMasterID = navigateRes.ReFNo;
                              this.NoteToUnblock = navigateRes.ReFNo
                            }
                            this.FXD_cfs.LockedDealPopUp=true;
                            // this.LockedDealPopUp = true;
                            this.FXD_cfs.fxdpopupOpenClose=true;

                          } else if (res.LockStatusMsg === '') {
                            this.NewOrderfromRMUnlocked = true;
                            this.DI_YN = res.DI_YN;
                            this.Parant_DCDRFQID = res.ParentRFQNumber;
                            this.NoteMasterID = navigateRes.ReFNo;
                            this.NoteToUnblock = navigateRes.ReFNo
                            this.fnRFQLockerForTimer();
                          }
                          break;
                        case 'Rejected Orders':
                          this.RejectedOrder = true;
                          this.NoteToUnblock = navigateRes.ReFNo;
                          break;
                      }

                      this.RMRemarkVisibility = this.FXD_cfs.fnRMremarkVisibility(
                      this.RFQDetailsFromBlotterYes_QueueStatus) //Urmila A | 13-feb-23 | LGTCLI-294                               
                      this.RouteFromWorkflow = true;

                    } else if (navigateRes.redirectFrom === 'quotehistory') { //Urmila A, 29-Mar-23 | LGTGTWINT-1758
                      this.RouteFromQuoteHistory = true;
                      console.log('RFQ from Note master: ', res);
                    }
                  }

                  this.fnAssignDataLoadValues();
                  this.fnSetRFQDetailsFromNotemasterID(res);
                  this.fnButtonVisibility();  //Urmila A | 27-feb-23 | LGTGTWINT-1455

                } else if (res == null) {
                  //QEN    
                  this.NotificationFunction("Error", "Error", res)
                }


              } catch (err) { throw err; }
            })
        } else if (navigateRes.navigate === undefined || navigateRes.navigate === false) {
          // this.getEntityData(); 
          // this.fnGetProductDetails();   
          // this.SetDefaultValues();          
        }
        //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, end
      } catch (err) { console.log(err) }
    });


  

    //Urmila A | 20-feb-23 | LGTGTWINT-1444 |start 
    if (!this.IsNavigate) {
      // this.getEntityData(); //commented by UrmilaA, 25-april-23
      console.log('in AQDQ details from parent:', this.Product_ID, this.Product_Code,
        this.Product_Name, this.Template_Name, this.TemplateCode, 'prod data', this.AllProdData)
      this.SetDefaultValues();
      this.fnButtonVisibility()
      if (this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID, this.Product_Code,
        this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true) {
        this.AllDataLoaded.productDetail = true;
        this.fnGetProductConfig(); //Added by UrmilaA, 9-May-23, fnGetProductConfig | LGTCLI-361 
        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {
          this.AllAPIsLoaded = true;
        }
        this.fnGetPriceProviderandCcypairs();
        this.fnGetFXDCurrencyPairs();
        this.fnGetTenor(); //Urmila A | 12-sep-23 // Temporary Commented by Chaitanya M | 18 Sep 2023
      } else {
        this.fnGetProductDetails();
      }
      // this.fnButtonVisibility();
    }


    console.log(this.Product_Code)
    this.LoadingAQDQFlag = false;


  }
  
  //Added by Urmila A, 18-May-23 | LGTCLI-361 | start
  fnGetProductConfig(){
    //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
    this.fxdProdCofigSubsriber = this.FXD_afs.FXDGetProductConfigsAPI(
      this.FXD_afs.UserName,
      this.Product_ID
    ).subscribe((res:any)=>{
      try{
        if(res){
          console.log('product config res=> ', res)     
          res=res.Configs       
          if(res !== null || res.length > 0){  //conditions modified by Urmila A | 28-Aug-23 
            res?.forEach(element => {
              if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
                this.MaxQuoteTimeout = element.Value
              }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
                this.MinQuoteTimeout = element.Value
              }  

              if(element.Setting_Name === 'OPTDEN_PrincipalBankNameinLPGrid') {
                this.LPname=element.Value;
              } 
              
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
            this.showtermsheetRM = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
            this.showtermsheetDealer = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
          }         
        }
      }catch(err) {console.log(err)}
    })
  }
  //Added by Urmila A, 18-May-23 | LGTCLI-361 | ends

  //UrmilaA, 3-May-23 | LGTGTWINT-1949
  fnSetEntity(){
      console.log('coming entity data:', this.EntityData);

      //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
      if(this.EntityData[0].code === '50'){
        this.CustomerID = this.HomeAPI.CustomerId = '50';
        this.HomeAPI.CustomerName = 'CustomerPB';             
      }//end

  }

  fnGetTenor() {
    this.AllDataLoaded.tenor = false
    this.AllAPIsLoaded = false;
    this.GetTenorSubscriber = this.FXD_afs.fnGetTenor(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      'T',
      this.FXD_afs.UserName
    ).subscribe((res) => {
       //mapping modified by Urmila A | 12-sep-23 | as response modified
      if (res !== null) {
        this.AllDataLoaded.tenor = true;
        res.forEach((element) => {
            if (element) {
              this.TenorOptions.push(element.Member_ID);
            }
        });
        console.log("tenor options ", this.TenorOptions)
        // this.fnGetDatesCalculationforVB()
        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {
          this.AllAPIsLoaded = true;
        }
      }
    });
  }

  fnGetDatesCalculationforVB() {
    this.Premiumdate = '';
    this.AllAPIsLoaded = false;
    this.AllDataLoaded.datecalculation = false;
    this.FXDatesCalculationsubscription = this.FXD_afs.GetDatesCalculationforVB(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.DepCcy,
      this.AltCcy,
      "",
      "",
      this.Tenor,
      this.OptionCut,
      this.TradeDate,  
      this.Mode,
      '',
      ''  //Core migration: API req parameters modified by Urmila A | 22-Aug-23
    ).subscribe((res) => {
       //mappings modified by Urmila A | 1-Sep-23
       if (res !== null) {
        this.AllDataLoaded.datecalculation = true;
        this.AllDataLoaded.FixingDate = true
        this.Premiumdate = res[0].valueDate;
        this.FixingDate = this.datepipe.transform(res[0].fixingDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.MaturityDate = this.datepipe.transform(res[0].maturityDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.TenorDays = res[0].expiryDays;    
      
        this.fnGetContractSummary()

        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {
          this.AllAPIsLoaded = true;
        }
      }
    });
  }

  // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
  SelectOptionType(e) {
    this.OptionType = e.target.value 
    this.fnGetContractSummary();
  }
  // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023

  // End : Mayuri D.  | 12-Apr-2023

  //added by Urmila A, 29-Mar-23 , start
  fnAssignDataLoadValues() {
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;
    this.AllDataLoaded.FixingDate = true;
    this.AllDataLoaded.datecalculation = true;  //Urmila A | 2-Feb-23 | LGTGTWINT-1295
    this.OrderPlacedPopup = false;
  }//end

  //Added by Urmila A | LGTGTWINT-1455 | 21-feb-23 | start
  fnButtonVisibility() {
    let chkMode = this.FXD_cfs.fngetMode();
    this.isEmailQuoteVisible = this.isSchedulevisible = this.isResetvisible = true;

    this.fnbtncheck('TradeIdeaBtnAccess_LoginUserGroup',
      this.RouteFromWorkflow ? this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')

    //Modified by Urmila A | 9-Mar-23 , currenly not using common data for Single pricer
    if (!this.RouteFromWorkflow || this.RouteFromQuoteHistory) { //Urmila A, 29-mar-23 
      this.isSpreadVisible = true;
    } else {
      this.fnbtncheck('FXD_Spread_Btn_Visibility', this.RouteFromWorkflow === true ?
        this.RFQDetailsFromBlotterYes_QueueStatus.replace(/ /g, "") : 'Pricer')
    }


    if (chkMode === 'SEN') {
      this.isOrderBtnVisible = false; // Order Button disabled | Chaitanya M | 02-April-2024  
    } else if (chkMode === 'QEN') {
      this.isRoutetoDealerVisible = true;
    }
    if (chkMode === 'SEN' && this.NewOrderfromRMUnlocked === true) {
      this.isRejectVisible = true;
    } else {  //Added by Urmila A | 17-Mar-23
      this.isRejectVisible = false;
    }

    console.log('this.isEmailQuoteVisible', this.isEmailQuoteVisible,
      'this.isOrderBtnVisible', this.isOrderBtnVisible,
      'this.isRejectVisible', this.isRejectVisible,
      'this.isRoutetoDealerVisible', this.isRoutetoDealerVisible,
      'this.isResetvisible', this.isResetvisible,
      'this.isSchedulevisible', this.isSchedulevisible

    )
  }

  //Urmila A | checks button visibility | starts 
  fnbtncheck(ReqConfig, chkRoute): any {
    switch (ReqConfig) {
      case 'TradeIdeaBtnAccess_LoginUserGroup':
         //fngetCommondata added by Urmila A | 29-Aug-23
        this.CommomDataSubscriber = this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
          if (res) {
            try {
              // res = res.Get_Configurable_Common_DataResult;
              //mappings modified by Urmila A | 11-sep-23
              res = res.cvpData;
              res.forEach(element => {
                if (chkRoute === 'Pricer') {
                  if (element.value.includes(',')) {
                    if (element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))) {
                      this.isSaveTradevisible = true
                    }
                  } else {
                    if (element.value === sessionStorage.getItem('FXDgroupID')) {
                      this.isSaveTradevisible = true
                    }
                  }
                } else {
                  if (element.value.includes(',')) {
                    if (element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))) {
                      this.isSaveTradevisible = true
                    }
                  } else {
                    if (element.value === sessionStorage.getItem('FXDgroupID')) {
                      this.isSaveTradevisible = true
                    }
                  }
                }
              });
              console.log('this.isSaveTradevisible', this.isSaveTradevisible)
            } catch (err) { }
          }
        });

        break;
      case 'FXD_Spread_Btn_Visibility':
         //fngetCommondata added by Urmila A | 29-Aug-23
         this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
          if (res) {
            try {
              res = res.Get_Configurable_Common_DataResult;
              res.forEach(element => {
                if (chkRoute.toUpperCase() === element.DATA_VALUE.toUpperCase()) {
                  if (element.value.split(',').includes(sessionStorage.getItem('FXDgroupID'))) {
                    this.isSpreadVisible = true;
                  }
                }
              });
              console.log('this.isSpreadVisible', this.isSpreadVisible)
            } catch (err) { }
          }
        });
        break;
    }
  }
  //ends


  // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 15-Dec-22
  fnSetRFQDetailsFromNotemasterID(data) {
    this.TemplateCode = this.TemplateCode;
    this.TemplateID = this.TemplateID
    this.selectedProduct = this.SelectedStrategy = data.Product_Code; //  Chaitanya M | LGTGTWINT-2213 | 26 July 2023
    this.Product_Code = data.Product_Code;  //Urmila A | 23-Jan-23 | LGTGTWINT-1170
    this.Product_Name  = data.Product_Name;
    this.Product_ID = data.Product_Id; // Chaitanya M | 27 July 2023 | LGTGTWINT-2213
    this.AltCcy = data.Alternate_Ccy;
    this.DepCcy = data.Deposit_Ccy;
    this.custPremDirection = data.CustPayReceiveDir;
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila A | 17-feb-23 | LGTCLI-314
    this.ClientPremComment = this.FXD_cfs.fngetClientPremComment(data.CustPayReceiveDir); // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
    this.CcySearch = this.CurrencyPair = data.Deal_Pair; //Added by Urmila A | 11-Jan-23      
    this.ProductChanged(data.Product_Code,true);  // Chaitanya M | LGTGTWINT-2213 | 01 Aug 2023
    this.fnPointShift(data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23
    // this.AskSpot = data.Ask_Rate;
    // this.SelectedPricingMode = data.AutoManual_Type; //commented by Urmila A | 11-Jan-23
    // this.BidSpot = data.Bid_Rate;
    this.NotionalAmt = this.FXD_cfs.numberWithCommas(data.OptionNotional !== '' ? Number(data.OptionNotional).toFixed(2) : "");

    this.OrderDirection = data.RFQ_Deal_Dir === 'B' ? 'Buy' : 'Sell'; // Added for BUYSELL Direction not displaying | Chaitanya M | 26 July 2023

    // this.FixingSettFreq = data.Frequency;
    // this.NoOfSett = data.NoOfSettlement;
    // this.SelectedKIStyle = data.KIType === 'Yes' ? this.SelectedKIStyle = 'Yes' : 'NO'

    this.Leverage = data.Leverage; // HSBCFXEINT-39 | Leverage not displayed on Re-Direct | Chaitanya M | 06-Feb-2024

    // this.GuaranteedPeriods = data.GuaranteedPeriods;

    if(this.EntityData.length > 0){
      let entity = {
        Code: data.Entity_ID,Value: data.Entity_Name
      }
      if(!this.EntityData.filter(e => e.Code === data.Entity_ID)){
        this.EntityData.push(entity);
      }
    }
    let optioncut = data.OptionCut
    this.OptionCutOptions.push(optioncut);
    this.OptionCut = this.OptionCutOptions[0]
    this.BlotterRFQ = data.ParentRFQNumber;

    //added by Urmila A, 4-april-23 | LGTGTWINT-1824 | to update dates only when routed from workflow
    if (this.RouteFromWorkflow) {
      this.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.Premiumdate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.FinalFixingDate = this.FixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date); //  Chaitanya M | 26 July 2023
      this.FinalSettDate = this.MaturityDate = this.FXD_cfs.convertDate(data.Deposit_End_Date); //  Chaitanya M | 26 July 2023
      this.prevFirstFixingDate = this.FirstFixingDate = this.FXD_cfs.convertDate(data.FirstFixingDate);  //urmila A, 5-april-23 , LGTGTWINT-1846
    } else if (this.RouteFromQuoteHistory) {
      this.TradeDate = this.FXD_cfs.convertDate(new Date())
    }
    this.TenorDays = data.Option_Days;
    this.Tenor = data.Input_Tenure;
    this.TenorOptions.push(data.Input_Tenure)
    this.NotionalAmt = this.FXD_cfs.numberWithCommas(data.OptionNotional);
    this.NotionalCcy = data.Deposit_Ccy;
      //IBPremCcy modified by UrmilaA | 26-Dec-23 | duplicate variables removed
    this.IBPremCcy = data.RFQ_Prem_Ccy; // HSBCFXEINT-33 | Chaitanya M | 14 Dec 2023
    this.fnChangeNotionalCCY();

    this.Upfront = this.FXD_cfs.numberWithCommas(Number(data.Spread_PA).toFixed(4).replaceAll('-',''));   //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23 // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023

    // Start - HSBCFXEINT-33 | Chaitanya M | 14 Dec 2023
    if (data.Premium_PC.includes(',')) { //Added by Urmila A | LGTGTWINT-890 | 9-Jan-23
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.Premium_PC.replaceAll(',', '')).toFixed(4).replaceAll('-','')); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    } else {
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.Premium_PC).toFixed(4).replaceAll('-','')); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    }
    
    this.IBPremium = Number(data.ParentRFQIBPremium.replaceAll(',','')).toFixed(2).replaceAll('-',''); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2).replaceAll('-',''));  //upfront in Alt ccy // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2).replaceAll('-','')); //upfront in USD // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    this.ClientPrem = this.findClientPrem(Number(data.ParentRFQIBPremium.replaceAll(',','')), Number(data.Premium_PC),Number(data.Spread_Amt),false)
    // End - HSBCFXEINT-33 | Chaitanya M | 14 Dec 2023
    
    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");

    if (data.Contract_Summary.includes('color:green')) { //Urmila A | 16-feb-23 |LGTGTWINT-1429
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:green", "color:var(--green) !important"))
    } else if (data.Contract_Summary.includes('color:red')) {
      this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:red", "color:var(--red) !important"))
    } else if (data.Contract_Summary === '') {
      this.ContractSummary = ''
    }

    this.RMRemark = data.RM_Remark;

    //Urmila A | Dealer remark visibility check | 24-feb-23 | LGTGTWINT-1504
    if (!this.TradeIdea) {
      this.DealerRemark = data.Dealer_Remark;
    } else if (this.TradeIdea) {
      this.DealerRemark = '';
    }

    // this.SelectedLPForPricing = this.SampleArray[Number(data.RFQ_Price_Provider_ID)];
    this.OriginalIBPrem = Number(data.ParentRFQIBPremium.toString().replace(',', '')).toFixed(2); //Added by Urmila A | 12-Jan-23 | LGTGTWINT-1018
    this.OriginalIBPremPer = data.Market_Premium_PC;
    this.OrderDirection = 'Buy';
    this.RFQLockedBy = data.LockStatusMsg;
    this.OptionType = data.Option_Class; // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
    if (data.PayReceiveDirection === 'IB Pays') { //Check added by Urmila A | 17-Jan-23 | as were going blank in contract summary 
      this.IBPremDirection = 'Pay'
    } else if (data.PayReceiveDirection === '') {
      this.IBPremDirection = ''
    } else {
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
    if (!this.ExecutedQueue) {
      this.fnGetProductDetails();
      this.fnGetPriceProviderandCcypairs()
      this.fnGetOptionCutFXD();

      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if (this.RouteFromQuoteHistory) {
        this.NoteMasterID = ''     
        this.fnGetDatesCalculationforVB();
      }
    } if (this.ExecutedQueue) {
      this.fnGetProductDetails();
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
  // closeLockedDeal() {
  //   this.LockedDealPopUp = false;
  // }

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

  fnGetProductDetails() { //Modified by Urmila A | 17-feb-23 
    try {
      this.AllAPIsLoaded = false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
      //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
      this.prodDetailSubscriber = this.FXD_afs.fnGetProdDetailsFXD( this.FXD_afs.UserName, this.Product_Code).subscribe((res) => {
        if (res) {
          this.AllDataLoaded.productDetail = true;
          res = res[0]
          this.TemplateCode = res.Template_Code;
          this.Product_Name = res.Product_Name;
          this.TemplateID = res.Template_Id;
          this.Product_ID = res.Product_Id;
          this.Product_Code = res.product_code;
          // this.fnGetProductInfo(); //commented by Urmila a | 17-feb-23
          if (!this.IsNavigate) { //Urmila A | 17-feb-23
            this.fnGetPriceProviderandCcypairs();
            this.fnGetFXDCurrencyPairs();
            this.fnGetTenor(); //uncommented by UrmilaA | 27-Dec-23
          }
        }
        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
          this.AllAPIsLoaded = true;
        }
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  fnGetProductInfo() {
    this.AllAPIsLoaded = false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
    this.AllDataLoaded.productinfo = false;  //Urmila A | LGTGTWINT-1295 | 10-Feb-23    
    this.productInfoSubscriber = this.FXD_afs.fnGetAllProductinfo(
      this.FXD_afs.EntityID,
      this.Mode,
      this.FXD_afs.UserName,
      this.Product_Code
    ).subscribe((res) => {
      if (res) {
        this.AllDataLoaded.productinfo = true;
        res.GetAllProductInfoResult.ProductDetails.forEach(async (element) => {
          if (element.Product_Name === 'AQ' && this.selectedProduct === 'FXAQ') {

            this.Product_Name = element.Product_Name;
            this.Product_ID = element.Product_Id;
            this.Product_Code = element.Product_Code

            console.log('this.Product_Code', this.Product_Code);

            // this.fngetPersonalDefaultValues();      
            // !this.RouteFromWorkflow
            if (!this.IsNavigate) { //urmila a, 29-mar-23
              this.fnGetPriceProviderandCcypairs();
            }

          }

          else if (element.Product_Name === 'DQ' && this.selectedProduct === 'FXDQ') {
            this.Product_Name = element.Product_Name;
            this.Product_ID = element.Product_Id;
            this.Product_Code = element.Product_Code

            console.log('this.Product_Code', this.Product_Code);

            // this.fngetPersonalDefaultValues();
            if (!this.IsNavigate) {
              this.fnGetPriceProviderandCcypairs();
            }

          }
          if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
            this.AllAPIsLoaded = true;
          }
        });

      }
    });
  }


  fnDataCheck() {
    var allareloaded: boolean = true;
    Object.values(this.AllDataLoaded).forEach(res => {
      if (res === false) {
        allareloaded = false;
      }
    });
    if (allareloaded && this.firstTimeExecuted) {
      return false;
    } else {
      return true;
    }
  }


  //Modified by Urmila A | 24-feb-23 
  ngOnDestroy() {

    if (this.ScheduleSub) { //Urmila A |LGTGTWINT-1501 | 24-feb-23
      this.ScheduleSub.unsubscribe()
    }
    this.CurrencyPairList = []; //Urmila A | 24-feb-23
    this.DestroyFn();
    this.fnUnsubscribeAllCalls();

  }

  //Added by Urmila A | 24-feb-23
  DestroyFn() {
    this.OrderPlaced = false
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    this.SessionInvalid = false;
    this.TenorOptions = [];
    // this.CurrencyPairList = []; //Urmila A | 24-feb-23
    this.ScheduleCallWithGuarenteeperiod = false;
    this.ViewScheduleflag = false;
    this.scheduleBtnClick = false;

    this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
      navigate: false,
      ProdcutCode: '',
      ReFNo: "",
      ProductID: '',
      redirectFrom: ''
    })
    if (this.FXD_RFQDealDetailsNavigateSubscriber) {
      this.FXD_RFQDealDetailsNavigateSubscriber.unsubscribe();
      if (this.RFQDetailsFromNoteMasterSubscrber) {
        this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
      }
    }
    if (this.RFQDetailsFromNoteMasterSubscrber) {
      this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
    }
    this.fnUnsubscribeAllCalls();
  }


  fnUnsubscribeAllCalls() {


    this.FXD_afs.FXD_Schedule_GuratenteeTillDate_AQDQ.next({ Gperiod: '', GperiodTill: '' }); //Urmila A | LGTGTWINT-1332 | 6-feb-23
    if (this.unlockNotemasterSubscriber) {
      this.unlockNotemasterSubscriber.unsubscribe()
    }
    if (this.RouteFromWorkflow) {
      this.fncallUnlockDeal();
    }
    if (this.prodDetailSubscriber) {
      this.prodDetailSubscriber.unsubscribe();
    }
    if (this.FXDProductDetailsSubscriber) {
      this.FXDProductDetailsSubscriber.unsubscribe()
    }
    if (this.productInfoSubscriber) {
      this.productInfoSubscriber.unsubscribe();
    }
    if (this.FXPriceProvidersubscription) {
      this.FXPriceProvidersubscription.unsubscribe();
    }
    if (this.FXDEntitySubscriber) {
      this.FXDEntitySubscriber.unsubscribe()
    }
    if (this.FXDEntitySubscriber) {
      this.FXDEntitySubscriber.unsubscribe()
    }
    if (this.FXPriceProvidersubscription) {
      this.FXPriceProvidersubscription.unsubscribe();
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

    if (this.Bestpricesubscription) {
      this.Bestpricesubscription.unsubscribe();
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
    if (this.FXDOptionCutSubscriber) {
      this.FXDOptionCutSubscriber.unsubscribe()
    }
    if (this.FXDFirstFixingDateSubscriber) {
      this.FXDFirstFixingDateSubscriber.unsubscribe()
    }
    if (this.FXDGetNoofSettSubscriber) {
      this.FXDGetNoofSettSubscriber.unsubscribe()
    }
    if (this.PersonalDefaultValueSubscriber) {
      this.PersonalDefaultValueSubscriber.unsubscribe()
    }
    if (this.RejectSubscriber) {
      this.RejectSubscriber.unsubscribe()
    }
    if (this.FXDRouteToDealerSubscriber) this.FXDRouteToDealerSubscriber.unsubscribe();
    if (this.RFQDetailsFromNoteMasterSubscrber) {
      this.RFQDetailsFromNoteMasterSubscrber.unsubscribe()
    }
    if (this.CommomDataSubscriber) { //Urmila A | 22-feb-23
      this.CommomDataSubscriber.unsubscribe()
    }
  }

  // added by Urmila A | 13-Dec-22 | LGTGTWINT-340 |start
  fnChngeGuarenteePeriods(e) {
    this.ContractSummary = '' //Urmila A | 23-Jan-23| LGTGTWINT-1166
    this.GuaranteedPeriods = '' //Urmila A | LGTGTWINT-1209 | 2-Feb-23
    // this.GuaranteedPeriodTill = '';

    this.ScheduleCallWithGuarenteeperiod = false;
    this.ViewScheduleflag = true;

    this.GuaranteedPeriods = e.target.value;

    if (Number(this.GuaranteedPeriods) > 0) {
      this.AllAPIsLoaded = false; //Urmila A | 16-feb-23
      this.GperiodChange = true;
      // if(RouteFromWorkflow)
      if (this.IsNavigate && !this.BestPrice) {  //Urmila A | LGTGTWINT-1209 - scenario 6 | 2-feb-23
        this.NoteMasterID = '' //Urmila A | LGTGTWINT-1332 | 6-Feb-23
      } else if (this.IsNavigate && this.BestPrice) {
        this.NoteMasterID = this.NoteMasterID
      }//end
      this.fnShowOrHideShedule();
      this.ScheduleCallWithGuarenteeperiod = true;
      this.ViewScheduleflag = false;


      // this.ResetAllFields();
    } else if (Number(this.GuaranteedPeriods) === 0) {
      this.AllAPIsLoaded = true; //Urmila A | 16-feb-23
      this.ScheduleCallWithGuarenteeperiod = false;  //Urmila A | LGTGTWINT-1209 | 25-Jan-23
      this.GuaranteedPeriodTill = '';
      this.ViewScheduleflag = false;
      this.fnGetContractSummary()
    }
  }
  // added by Urmila A | 13-Dec-22 | LGTGTWINT-340 |end

  fnGetContractSummary() {
    try {
      Number(this.NotionalAmt.replace(/,/g, '')) > 0 ? this.AltNotional = this.NotionalCcy === this.DepCcy ? parseInt(this.NotionalAmt.replace(/,/g, ''), 10) / Number(this.Strike) :
        parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * Number(this.Strike) : ''

      this.ContractSummary = ''; // Added by Uddesh on 3rd May, 2023 | JIRA Id: LGTGTWINT-1952

      this.FXDContractSummSubscriber = this.FXD_afs.fnGetContractSummary(
        Number(this.FXD_afs.EntityID),
        this.FXD_afs.UserName,
        // this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
        this.TemplateCode.toUpperCase(),
        this.Product_Code,
        (this.OrderDirection || ''),
        this.CurrencyPair,
        this.Product_Code === 'OPSPRD' ? this.OptionType : '', // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023 ||| Commented by Uddesh on 3rd May, 2023 | as no such field available on pricer
        this.NotionalCcy,
        this.NotionalCcy === this.DepCcy ? this.AltCcy : this.DepCcy,
        this.IBPremCcy,
        Number(this.NotionalAmt.replace(/,/g, '')) > 0 ? Number(this.NotionalAmt.replace(/,/g, '')) : 0,
        Number(this.NotionalAmt.replace(/,/g, '')) > 0 ? Number(this.NotionalAmt.replace(/,/g, '')) : 0,
        this.TenorDays.toString(),  //Changed by Chaitanya M | 25 July 2023
        this.FixingDate,
        this.MaturityDate,//settlement
        this.Product_Code === 'OPSPRD' ? this.FixingDate : '',//longdate // LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023
        this.Product_Code === 'OPSPRD' ? this.FixingDate : '', //shortdate // LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023
        Number(this.Strike) > 0 ? Number(this.Strike) : 0,//this.Strike
        this.OptionCut,
        '',//barriertype
        '',//Exotic code
        '',// digitaltype
        '0',//upperbarrier
        '0',//lowerbarrier
        this.Product_Code === 'RSKREV' ? this.Leverage : '0', //Leverage Factor
        '0', //noofsettle
         '0',//No of fixing
        "", //fixing frequency
        "",//sett freq
        this.PutStrike > 0 ? this.PutStrike : '0',//lower strike (Put Strike)
        this.CallStrike > 0 ? this.CallStrike : '0',//upper strike (Call Strike)
        '0',//pivot strike
        this.Product_Code === 'OPSPRD' ? this.OptionType : '',//spread type // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
        this.custPremDirection,//cust prem dir
        this.BestPrice ? this.IBPremDirection : '', //IB prem dir
        this.BestPrice ? parseFloat(this.IBPremium) ? parseFloat(this.IBPremium.replace(/,/g, '')) : 0 : 0,  //LGTGTWINT-2210
        this.BestPrice ? parseFloat(this.ClientPrem) ? parseFloat(this.ClientPrem.replace(/,/g, '')) : 0 : 0,//RTC || Chaitanya M | 26 July
        this.BestPrice ? parseFloat(this.IBPrem) ? parseFloat(this.IBPrem.replace(/,/g, '')) : 0 : 0,//IB prem perc //LGTGTWINT-2210
        this.BestPrice ? parseFloat(this.Clientperc) ? parseFloat(this.Clientperc.replace(/,/g, '')) : 0 : 0,//RTC Perc || Chaitanya M | 26 July
        '0.00',//Target
        '0.00',//target notional
        'No',//KI style rate
        '0.00', //lower KI
        '0.00',//UpperKI 
        "", //Guarentee till 
        '0', //Guaranteed Periods
        '',//capped loss ccy
        '', //capped losstype
        '',//capped loss
        '0',//capped loss amt
        '',//target big fig
        '',//target per unit
        '0',//target in pips
        '0',//KOITME event
        '',//strikestype
        this.FixingDate,
        '',//final pay type
        '',//fixing adjustment
      ).subscribe((res) => {
        if (res) {
          if (res.result !== '') { //If Condition added by Uddesh on 28th April, 2023 | JIRA Id: LGTGTWINT-1935
            this.ContractSummary='' ; 
            res =  res.result.toString().replaceAll("\\n", "<br>");        
            if(res.includes('color:green')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:green","color:var(--green) !important"))
            }else if(res.includes('color:red')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:red","color:var(--red) !important"))
            }
          } else { //Else Condition added by Uddesh on 28th April, 2023 | JIRA Id: LGTGTWINT-1935
            this.NotificationFunction("Error", "Error", res.result)
          }
        }
      });
    } catch (exception) { //try-catch added by Uddesh on 28th April, 2023 | JIRA Id: LGTGTWINT-1800
      console.log("Exception caught at fnGetContractSummary()...", exception);
    }


  }

  fnGetOptionCutFXD() {
    this.OptionCutOptions = []
    this.AllAPIsLoaded = false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.optioncut = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
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
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 |start
          res.forEach((element, i) => {
            if (element.OptionCut === 'BFIXTOK') {
              res.splice(i, 1)
              res.unshift(element)
            }
          });
          res.forEach(element => {
            this.OptionCutOptions.push(element.OptionCut);
          });
          // LGTCLI-448 | FXD Enable PM Option Cut BFIXTOK | Chaitanya M | 04 Aug 2023
          if(!this.IsNavigate){
            this.OptionCut = res[0].OptionCut
          } 
          //End
         
          this.fnGetDatesCalculationforVB();
          if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded = true;
          }

      }
      else {
        this.AllDataLoaded.optioncut = true;
      //  this.NotificationFunction("Error", "Error", res.Get_OptionCutResult.A_ResponseHeader.FailedReason)
      }
    });
  }

  fnGetPriceProviderandCcypairs() {
    try {
      console.log("pp details ", this.Product_Code);
      this.AllAPIsLoaded = false;
      this.AllDataLoaded.priceprovider = false;
      this.SampleArray = []
      this.FXPriceProvidersubscription = this.FXD_afs.GetPriceProviderDetails(
        this.FXD_afs.EntityID,
        this.Product_ID,
        this.Mode,
        this.UserGroup,
        this.FXD_afs.UserName,
        this.PricingMode,
     //Core migration: API req parameters are modified | Urmila A | 12-sep-23
      ).subscribe((res) => {
        if (res ) {
          if (res !== null) { //Urmila A | 11-Sep-23
            this.AllDataLoaded.priceprovider = true;
            this.PriceProviderString = '';
            this.SampleArray = this.PriceproviderArr =res;
            this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)
            this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
          } else {
            this.NotificationFunction("Error", "Error", 'Error occured while fetching price provider details');
          }
        }

        if (this.IsNavigate) {
          this.fnGetSelectedCCYDetails();
        }

        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {
          this.AllAPIsLoaded = true;
        }
      });
    } catch (exception) {
      console.log("Exception caught at fnGetPriceProviderandCcypairs()...", exception);
    }
  }

  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | start
  fnGetSelectedCCYDetails() {
    this.FXCurrencyPairsubscription = this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      this.DepCcy,
      this.AltCcy,
      this.CcySearch,
      this.OptionCut
    ).subscribe((res) => {
      try {
         //mappings modified by Urmila A | 11-Sep-23
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
          if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 14-Feb-23 |
            this.AllAPIsLoaded = true;
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
  //Added by Urmila A | 11-Jan-23 | end

  fnGetFXDCurrencyPairs() {
    this.AllDataLoaded.ccypairs = false;
    this.FXCurrencyPairsubscription = this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      '',
      '',
      '', //CcySearch - Added by Urmila A | 11-Jan-23 
      this.OptionCut
    ).subscribe((res) => {
      this.CurrencyPairList = []; //Added by Urmila A | LGTGTWINT-753 | 6-Jan-23
      //mappings modified by Urmila A | 11-Sep-23
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
  fnOptionCutChange(e) {
    this.OptionCut = e.target.value;
    this.fnGetDatesCalculationforVB()
  }

  fnGetBidAskRates() {
    this.AllAPIsLoaded = false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.bidask = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration  
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res !== null) {
        //mappings modified by Urmila A | 12-sep-23
        this.AllDataLoaded.bidask = true;
        this.BidSpot = parseFloat(res.BidRate).toFixed(Number(res.PointShift)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

        this.AskSpot = parseFloat(res.AskRate).toFixed(Number(res.PointShift)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
       
        this.SpotMidRate =(parseFloat(res.BidRate) +  parseFloat(res.AskRate) / 2); //modified by Urmila A | 23-oct-23
        this.PointShift = Number(res.PointShift);
        this.GetStrikeRate();

        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded = true;
        }
      }
    });
  }

  //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23 | start
  fnPointShift(data) {
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(     //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
       //mappings modified by Urmila A | 12-sep-23
      if (res !== null) {
        this.PointShift = res.PointShift //Urmila A |27-feb-23 |LGTGTWINT-1526    
        this.SpotMidRate = ((Number(data.Ask_Rate) + Number(data.Bid_Rate)) / 2).toFixed(this.PointShift) //Added by Urmila A | LGTGTWINT-1693 | 9-mar-23

        // Start - Added by Chaitanya M | LGTGTWINT-2213 | 01 Aug 2023
        if(data.RFQ_Deal_Dir === "S"){
          this.AskSpot = Number(data.Ask_Rate).toFixed(this.PointShift);
          this.BidSpot = Number(data.Spot_Rate).toFixed(this.PointShift);          
        }else{
          this.AskSpot = Number(data.Spot_Rate).toFixed(this.PointShift);
          this.BidSpot = Number(data.Bid_Rate).toFixed(this.PointShift);
        }     
        
        this.SpotMidRate = ((Number(this.AskSpot) + Number(this.BidSpot)) / 2).toFixed(this.PointShift)
        this.Strike = Number(data.Strike_Rate).toFixed(this.PointShift); 
        this.CallStrike = Number(data.CallStrike).toFixed(4);
        this.PutStrike = Number(data.PutStrike).toFixed(4); 

        //End - Added by Chaitanya M | LGTGTWINT-2213 | 01 Aug 2023

      }
    });
  }
  //end



  CallScheduleComp() {
    this.ScheduleVisibility = true;
    // this.ScheduleComp.listen(this.NoteMasterID, 'AQDQ');
  }

  SetDefaultValues() {
    try { 
      this.OrderDirection = 'Buy';
      this.CustomerID = '1'
      this.CurrencyPair = 'EUR - USD';
      this.DepCcy = this.CurrencyPair.substr(0, 3);
      this.AltCcy = this.CurrencyPair.substr(6, 8);
      this.IBPremCcy = this.DepCcy;
      this.NotionalCcy = this.DepCcy; 
        //IBPremCcy modified by UrmilaA | 26-Dec-23 | duplicate variables removed
      this.NotionalAmt = this.FXD_cfs.numberWithCommas("100000.00");
      this.Leverage = 1;   
      this.SelectedKIStyle = 'NO';  
      this.IBPrem = '';
      this.IBPremium = '';
      this.ClientPrem = '';
      this.Clientperc = '';
      this.Upfront = (0).toFixed(4);
      this.UpfrontVal=(0).toFixed(2);
      this.UpfrontAlt=(0).toFixed(2);
     
      //modified default settleFreq & Noofsett by Urmila A | LGTCLI-325 | 24-feb-23
      this.FixingSettFreq = 'Weekly/Weekly';
      this.NoOfSett = 52;

      this.CallStrike = ""
      this.PutStrike = ""
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
      this.TradeDate = Daystring + '-' + this.months[this.d.getMonth()] + '-' + this.d.getFullYear();
      this.Tenor = '6M';
      this.TenorDays = 183;
      this.SeletcedPricingModel = 'Black Scholes';
      this.custPremDirection = '';
      this.IBPremDirection = '';
      this.AltNotional = 0;  
      this.OrderClicked = false;
      this.RMRemark = '';
      this.firstFixChngAndDatesReceived = false;
      this.ScheduleCallWithGuarenteeperiod = false;
      // this.RouteFromWorkflow = false;
      this.OrderPlacedPopup = false;
      this.Parant_DCDRFQID = '';
      this.DI_YN = 'N';
      this.NoteMasterID = '0';
      this.ExecutedQueue = false;
      this.TradeIdea = false;
      this.ExpiredTradeIdea = false;
      this.NewOrderfromRMUnlocked = false;
      this.NewOrderfromRMLocked = false;
      this.RejectedOrder = false;
      this.PriceRecAfterRepricefromBlotter = false;
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
      this.CurrencyChanged = false;
      this.PreminPipsToggle = "%"; // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
      this.BestPricelbl =  'Best Price'; // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Added by Urmila A | 28-Dec-22
  resetLPsOnSpreadClick() {
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    this.IBPrem = '0.00';
    this.ClientPrem = '0.00';
    this.Upfront = (0).toFixed(4);
    this.UpfrontVal='0.00';
    this.UpfrontAlt='0.00';
    this.Orderplace = '';
    this.loadflag = false;
    this.ViewScheduleflag = false;
    this.DealNo = '';
    this.ScheduleVisibility = false;
    this.OrderBlotterVisibility = false;
    this.OrderPlaceFlag = false;
    this.ClearPricingFlag = true;
    this.orderMsg = ''
    this.DealNo = ''
    this.Orderplace = ''
    this.DCDRfqId = '';
  }

  //Added by UrmilaA | 6-June-23 | LGTGTWINT-2079| start
  fnSetAfterPriceValues(){
    this.Upfront = (0).toFixed(4); // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
    this.UpfrontAlt = ''; 
    this.UpfrontVal = ''; 
    this.IBPrem=''
    this.IBPremium=''
    this.Clientperc=''
    this.ClientPrem='' 
  }

  ResetAllFields() {
    this.FXD_cfs.saveTradeDone=false;
    this.FXD_cfs.RouteToDealerExecuted=false;
    this.ResetAllfieldsCalled = true;
    //added by Urmila A | 12-Sep-23
    this.PriceClick=false;   
    this.ClearLPs=true; 

    if (this.BestPrice && this.ServiceResponse !== null) {
      this.closeSignalR()  
      this.NoteMasterID = '';
      this.fnSetAfterPriceValues(); 
    }

    //added by Urmila A | 12-Sep-23 | start
    this.fnResetpricingFlags() 
    this.resetSignalRPrice();
    this.ClearPricingFlag = true;
    //added by Urmila A | 12-Sep-23| ends
    
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    this.ClientPrem = '';
    this.Orderplace = '';
    this.loadflag = false;
    this.ViewScheduleflag = false;
    this.Errormsg = '';
    this.DealNo = '';
    this.ScheduleVisibility = false;
    this.OrderBlotterVisibility = false;
    this.OrderPlaceFlag = false;
    this.ClearPricingFlag = true;
    this.orderMsg = ''
    this.DealNo = ''
    this.Orderplace = '';
    this.DCDRfqId = '';
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted = false;
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.firstFixChngAndDatesReceived = false;

   //added by Urmila A | 12-Sep-23
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
  }

 //added by Urmila A | 12-Sep-23 | start
  resetSignalRPrice(){
    this.MinQuoteTimeOutOccurred =false; 
    this.MaxQuotePriceCame= false;
    this.btnEnable=false;
    this.noResponseRecv=false; 
    this.OrderPlaced=false;
    this.signalRMsgRecv=false;
    this.MinMaxTimer=0;
    clearInterval(this.MinInterval)
    clearInterval(this.maxInterval)
    clearTimeout(this.MaxTimeout)
    clearTimeout(this.MinTimeput)

    if(this.SignalRQuoteIDs !== ''){
      this.closeSignalR()
    } 

    this.BestPrice=null;   
    this.QuteMailClicked=false;
    this.QuoteMailSent=false;
    this.closeQuoteMail=false;
    this.OrderPlaced=false;  
  }
  //added by Urmila A | 12-Sep-23 | ends

  ProductChanged(e,navigation) {
    try {
      if(navigation === true){
        switch ((e).toLowerCase()) {
          case 'strangle':
            this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = false
            this.showOptionType = false
            this.showStrike = false
            this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;
  
          case 'straddle':
            this.showCallStrike = false
            this.showPutStrike = false
            this.showLeverageFactor = false
            this.showOptionType = false
            this.showStrike = true
            this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;
  
          case 'rskrev': this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = true
            this.showOptionType = false
            this.showStrike = false
            this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;
  
          case 'opsprd': 
            // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = false
            this.showOptionType = true
            this.showStrike = false
            this.isSpreadStrategy = true
	          // End -LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;
        }
      }else{
        console.log("Master Product changed", e.target.value, e)
        this.ResetAllFields()
        switch ((e.target.value).toLowerCase()) {
          case 'strangle':
            this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = false
            this.showOptionType = false
            this.showStrike = false
            this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;

          case 'straddle':
            this.showCallStrike = false
            this.showPutStrike = false
            this.showLeverageFactor = false
            this.showOptionType = false
            this.showStrike = true
            this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;

          case 'rskrev': this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = true
            this.showOptionType = false
            this.showStrike = false
              this.isSpreadStrategy = false // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;

          case 'opsprd': 
            // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023 
            this.showCallStrike = true
            this.showPutStrike = true
            this.showLeverageFactor = false
            this.showOptionType = true
            this.showStrike = false
            this.isSpreadStrategy = true
            // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
            break;
        }
        this.fnAssignProdDetails(e.target.value.toUpperCase());
      }
      // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
      this.CallStrike = '';
      this.PutStrike = '';
      // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023

    } catch (exception) {
      console.log("Exception caught at ProductChanged(..)...", exception);
    }
  }

  //Added by Urmila A | LGTCLI-318 | 24-feb-23
  fnAssignDefaultvalues() {
    this.KORate = '';
    this.GuaranteedPeriodTill = '';
    this.GuaranteedPeriods = '0';
    // this.FixingSettFreq = 'Weekly/Weekly'; commented by UrmilaA , as update in jira LGTCLI-318 | 27-feb-23
  }


  fnAssignProdDetails(prodCode) {
    this.AllProdData.forEach(element => {
      if (element.product_code === prodCode) {
        this.Product_ID = element.Product_Id;
        this.Product_Name = element.Product_Name;
        this.Product_Code = element.product_code;
        this.Template_Name = element.Template_Name;
        this.TemplateCode = element.Template_Code;
        this.TemplateID = element.Template_Id;
        if (!this.IsNavigate) {
          this.fnGetPriceProviderandCcypairs();
          this.fnGetBidAskRates();
          this.fnGetContractSummary()

          if (!this.ProdChangedYN) {
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
      // this.PremiumCcy = this.DepCcy   //IBPremCcy modified by UrmilaA | 26-Dec-23 | duplicate variables removed
      this.ccy1 = true;  //Added by Urmila  | LGTCLI-208
      this.ccy2 = false;  //Added by Urmila  | LGTCLI-208

      this.AskSpot = '';
      this.BidSpot = '';

      this.fnIsMetalInCcy();
      this.fnChangeNotionalCCY();

    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  fnIsMetalInCcy() {
    try {
      this.Pair_Cross_YN = '';
      this.Left_USD_Pair = '';
      this.Right_USD_Pair = '';
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
      });

      if (this.Pair_Cross_YN === 'Y') {
        this.FindLeftUSDMidRate(this.Left_USD_Pair);
        this.FindRightUSDMidRate(this.Right_USD_Pair);
      }

    } catch (ex) { }
  }

  async TenorChanged(e) {
    this.Tenor = e.target.value
    this.ResetAllFields();
    try {
      await this.fnGetDatesCalculationforVB();
      // await this.getfnCalculateFirstFixingDate();
    } catch (exception) {
      console.log("Exception caught at TenorChanged()...", exception);
    }
  }

  // Start : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024
  TenorDaysChanged(e){
    let Tenor = e.target.value.charAt(e.target.value.length - 1);
    let TenorType = this.FXD_cfs.fnGetTenorType(e.target.value);
    if (Tenor.toUpperCase().includes('M') || Tenor.toUpperCase().includes('Y') || Tenor.toUpperCase().includes('D') || Tenor.toUpperCase().includes('W')) {
      this.Tenor = e.target.value;
      this.MaturityDate = '';
      this.FixingDate = '';
      this.fnGetDatesCalculationforVB();
    } else {
      this.Tenor = e.target.value + "D";
      this.MaturityDate = '';
      this.FixingDate = '';
      this.fnGetDatesCalculationforVB();
    }
  }
  // End : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024

  Validations() {
    try {

      if (this.Product_Code.toLowerCase() == "strangle" || this.Product_Code.toLowerCase() == "rskrev") {
        if (this.CallStrike === undefined || this.CallStrike === null || this.CallStrike === "") {
          this.Errormsg = 'Call Strike can not be blank';
          return false;
        }

        if (this.PutStrike === undefined || this.PutStrike === null || this.PutStrike === "") {
          this.Errormsg = 'Put Strike can not be blank';
          return false;
        }
        if (Number(this.PutStrike) > Number(this.CallStrike)) {
          this.Errormsg = "Put strike should be less than call strike."
          return false;
        }
      }
      //Added for straddle and option spread  validations | Chaitanya M | 27 July 2023
      if(this.Product_Code.toLowerCase() == "stradle" || this.Product_Code.toLowerCase() == "opsprd"){
        if (Number(this.Strike) > 0) {
          this.Errormsg = '';
        } else {
          this.Errormsg = 'Invalid Strike';
          return false;
        }  
      }
      //End

      /*** [*] Following code commented by Uddesh on 3rd May, 2023 | JIRA ID: LGTGTWINT-1951 --- START ---*/
      // if (Number(this.Upfront) <= 0 || this.Upfront == '') {
      //   this.Errormsg = 'Upfront cannot be zero or blank';
      //   return false;
      // } /****************************************************** | JIRA ID: LGTGTWINT-1951 --- DONE ----*/

      if (this.NotionalAmt === '') {
        this.Errormsg = 'Notional cannot be zero or blank';
        return false;
      }

// Commented for straddle and option spread  validations | Chaitanya M | 27 July 2023
     // if (Number(this.Strike) > 0) {
       // this.Errormsg = '';
     // } else {
       // this.Errormsg = 'Invalid Strike';
       // return false;
     // }

    
      if (this.CurrencyPair === '') {
        this.Errormsg = 'Please select currency pair.'
        return false
      } else {
        this.Errormsg = '';
      }

      if ( this.Upfront == '' ) {
        this.Errormsg = 'Please Enter Upfront %';
        return false;
      } else {
        this.Errormsg = '';
      }

      if (
        this.TradeDate !== '' &&
        this.Premiumdate !== '' &&
        this.FixingDate !== '' &&
        this.MaturityDate !== ''
      ) {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Dates are not loaded';
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  fnBestPricing() {

    //Added by Urmila A | 12-Sep-23
    this.PriceRecvFromLPs=0;
    this.fnResetpricingFlags();
    this.ClearLPs = true; 
    this.ClearPricingFlag = true; 
    this.PriceClick=true; 

    if (this.ServiceResponse !== null) {
      this.ClearLPs = true;
      this.OrderPlaced = false;
      this.BestPrice = null;//UrmilaA | LGTGTWINT-1941 | 2-May-23
    }

    //Urmila A, 29-mar-23, for redirected deals
    if (this.IsNavigate) {
      this.PriceRecAfterRepricefromBlotter = true;
    }
    if (this.RouteFromWorkflow === true) {
      this.NoteMasterID = this.NoteToUnblock; //UrmilaA| 2-feb-23     
    } else { this.NoteMasterID = '0' }
    if (this.SelectedPricingMode === 'Auto') {
      if (this.Errormsg === '' && this.Validations()) {
        this.RFQNODisplayFromParent = false;
        this.priceLoader=true;
        if (!this.IsNavigate) {  //Urmila A, 29-mar-23, for redirected deals
          this.ResetAllFields();
         
        }
        this.disabledPrembtn = true;
        this.loadflag = true;
        const spotrate =this.OrderDirection === 'Buy' ? this.AskSpot : this.BidSpot;
        this.ClearPricingFlag = false;
        try {
        //IBPremCcy modified by UrmilaA | 26-Dec-23 | duplicate variables removed
          if (this.Product_Code === "RSKREV") {
            //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
            // <CustID>" + CustID + "</CustID><Customer_Name>" + Customer_Name + "</Customer_Name>" + "
            this.XMLString =
              "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
              + "</Notional><LeverageFactor>" + this.Leverage + "</LeverageFactor><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
              + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
              this.AltCcy + "</AltCcy>" +
              "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy" +
              "><PremiumDate>" + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
              + "</BuySell><FixingDate>" + this.FixingDate +
              "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
              "</SettDate><Tenor>" + this.Tenor +
              "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays><CallStrike>" + this.CallStrike + "</CallStrike>" +
              "<PutStrike>" + this.PutStrike + "</PutStrike><Entity_ID>" + this.FXD_afs.EntityID + "</Entity_ID>" +
              "<CAI_ID>7400</CAI_ID><PricingModel>Black Scholes</PricingModel></Sheet1></ExcelSheets>"
          }
          else if (this.Product_Code === "STRANGLE") {
            //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
            //<CustID>" + CustID + "</CustID><Customer_Name>" + Customer_Name + "</Customer_Name>" +"
            this.XMLString =
              "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>" +
              "Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
              + "</Notional><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
              + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
              this.AltCcy + "</AltCcy>" +
              "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy><PremiumDate>" 
              + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
              + "</BuySell><FixingDate>" + this.FixingDate +
              "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
              "</SettDate><Tenor>" + this.Tenor +
              "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays><CallStrike>" + this.CallStrike + "</CallStrike>" +
              "<PutStrike>" + this.PutStrike + "</PutStrike><Entity_ID>" + this.FXD_afs.EntityID +
               "</Entity_ID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>"
          }
          // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
          else if (this.Product_Code === "OPSPRD") {
            this.XMLString = 
            "<ExcelSheets><Sheet1>" +
            "<Product_Name>" + this.Product_Name + "</Product_Name>" +
            "<Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>" +
            "<Spotrate>" + spotrate + "</Spotrate>" +
            "<LongNotional>" + this.NotionalAmt.replace(/,/g, '') +"</LongNotional>" +
            "<CustID>" + this.CustID +"</CustID>" +
            "<Customer_Name>" + this.Customer_Name +"</Customer_Name>" +
            "<OptionCut>" + this.OptionCut +"</OptionCut>" +
            "<NonDeliveryYN>" + this.NDFFlag + "</NonDeliveryYN>" +
            "<CcyPair>" + this.CurrencyPair +"</CcyPair>" +
            "<AltCcy>" + this.AltCcy +"</AltCcy>" +
            "<InvCcy>" + this.DepCcy +"</InvCcy>" +
            "<PremiumCcy>" + this.IBPremCcy +"</PremiumCcy>" +
            "<TradeDate>" + this.TradeDate +"</TradeDate>" +
            "<PremiumDate>" + this.Premiumdate +"</PremiumDate>" +
            "<BuySell>" + this.OrderDirection +"</BuySell>" +
            "<FixingDate>" + this.FixingDate +"</FixingDate>" +        
            "<SettDate>" + this.MaturityDate +"</SettDate>" +
            "<Tenor>" + this.Tenor +"</Tenor>" +
            "<TenorDays>" + this.TenorDays +"</TenorDays>" +
            "<ShortStrike>" + this.PutStrike + "</ShortStrike>" +
            "<LongStrike>" + this.CallStrike + "</LongStrike>" +
            "<SpreaType>" + this.OptionType + "</SpreaType>" +
            "<Entity_ID>" + this.FXD_afs.EntityID +"</Entity_ID>" +
            "<CAI_ID>7400</CAI_ID>" +
            "</Sheet1>" + "</ExcelSheets>";
	          
          }
          // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
          else {
            //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
            //<CustID>" + CustID + "</CustID><Customer_Name>" + Customer_Name + "</Customer_Name>" + "
            this.XMLString =
              "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>" +
              "Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
              + "</Notional><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
              + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
              this.AltCcy + "</AltCcy>" +
              "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy" +
              "><PremiumDate>" + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
              + "</BuySell><FixingDate>" + this.FixingDate +
              "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
              "></SettDate><Strike>" + this.Strike + "</Strike><Tenor>" + this.Tenor +
              "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays>" +
              "<Entity_ID>" + this.FXD_afs.EntityID + "</Entity_ID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>"
          }

          this.fnIsMetalInCcy(); // HSBCFXEINT-25  | Chaitanya M | 06 Dec 2023

          let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark); // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023
          
          this.FXD_afs.SetPricingProduct(this.Product_Name);
          let fxd_Mode = this.FXD_cfs.fngetMode()
          this.Bestpricesubscription =
        
          //old-GetFXBestPriceForVBNewStratgey
          //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
          this.FXD_afs.GetFXBestPriceForVBNew(        
              this.FXD_afs.EntityID,
              this.FXD_afs.UserName,
              // this.FXD_afs.GetToken(), //commented by UrmilaA | 16-Aug-23
              // this.Product_Code.toUpperCase(),
              this.Product_Code.toUpperCase(), //ProductType
              this.CurrencyPair,
              this.NotionalCcy,
              this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy,
              this.IBPremCcy,
              this.IBPremCcy,
              this.NotionalAmt.replace(/,/g, ''),
              'PREMIUM',
              this.OrderDirection.toUpperCase(),              
              this.Strike.toString(),
              '0', 
              '0',
              '',
              '',
              '',
              this.OptionCut,
              // this.Upfront ? this.Upfront : '',
              this.Tenor + '',
              this.Premiumdate,
              this.FixingDate,
              this.MaturityDate,          
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
              this.NewOrderfromRMLocked || this.NewOrderfromRMUnlocked ? this.NoteMasterID : '0',
              // this.DIfromTradeIdea,
              // fxd_Mode,
              this.TradeDate,
              this.NDFFlag,
              this.isMetal,
              this.ShowRFS,
              this.Product_Code.toUpperCase() === "OPSPRD" ? this.OptionType : "", // LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023
              this.Upfront ? this.Upfront : '',
              this.Mode,
              this.DI_YN,
              '',//KIType
              ActiveRemark, // HSBCFXEINT-21 | Chaitanya M | 08 dec 2023
              '',//CapLoss
              this.DCDRfqId,
              '',//GroupKey
              '', //frequency
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
              try {
                this.BestPrice = null;
                this.ServiceResponse = [];
                this.ResetAllfieldsCalled=false; 
                if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
                  try{
                      if(res){
                        this.PriceClick=false; //urmilaA | LGTGTWINT-2109
                        
                        if(res.errors == undefined && res.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL'){                           
                          this.ServiceResponse = res.oPriceResponseBody;    
                              if(this.ServiceResponse[0].quoteId == 0){
                                this.noResponseRecv = true;
                                this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                this.NotificationFunction("Error","Error" , this.ServiceResponse[0].errorMessage)
                              }
        
                              if(this.ServiceResponse == null || this.ServiceResponse.length == 0){
                                this.disabledPrembtn = false;
                                this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                                //this.OrderPlaceFlag = false;
                              }else if(this.ServiceResponse.length > 0){
                                    this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                                    this.NoteMasterID = this.ServiceResponse[0].NoteMasterID;
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
                                          this.MinMaxTimer=0; //UrmilaA | LGTGTWINT-2110|20-June-23
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
                                      if(this.isSaveTradevisible)  //added by UrmilaA | 16-June-23 |LGTGTWINT-2137
                                      {
                                        this.SaveTradeEnabledFlag = true
                                        this.disabledRoutetodealeronSaveTrade = false
                                        this.FXD_afs.SaveTradeBtnFlag.next(false)
                                      }                                   
        
                                    }
                              }
                                          
                        } else {   
                          this.ServiceResponse = res?.oPriceResponseBody;   
                          this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                          this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse);                  
                          if(this.FXD_cfs.fnPricingNotification(res) == 'NoResReceived') {
                            this.noResponseRecv = true; 
                            this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                          }                      
                        }
                      }else{
                        this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        this.NotificationFunction("Error","Error" , 'No response received from remote system')  //Urmila A | 27-Jan-23 | LGTGTWINT-1045, LGTGTWINT-1224
                      }
                  }catch(err){}                          
                  }
              } catch (error) {

              }

            });
        } catch (error) {
          console.log(error);
          // throw error;
        }
      }
      else {
        console.log('error',this.Errormsg)
        this.NotificationFunction("Error","Error", this.Errormsg)
      }
    } 
  }

  MapRFS(data:any){
    let BestPriceConsist :boolean=false;
    let nonBestCnt:any=0;
    let nonBestTimeout:any=0;
    let nonBestTimeoutOccurred:boolean=false;
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

        console.log('NonBestTimeout is ',nonBestTimeout );
        // modified by UrmilaA | LGTGTWINT-2110| 9-June-23 |start
        let nonBestinterval: any =  nonBestTimeout;      
        this.maxInterval = setInterval(() => {       
          this.MinMaxTimer = nonBestinterval = nonBestinterval-1 // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
          if(nonBestinterval >0){
            if(this.signalRMsgRecv){  
              this.priceLoader=false;      // UrmilaA | LGTGTWINT-2109 | 9-jun-23    
              this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23
              this.MinMaxTimer=0; //UrmilaA | LGTGTWINT-2110|20-June-23
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
        // modified by UrmilaA | LGTGTWINT-2110| 9-June-23 |ends
                  
        },1000)
     
    }

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
          this.NoteMasterID = element.NoteMasterID; //Urmila A | 14-Sep-23;
          // this.fnSetIBPrem(element.premiumAmount);
          this.ExternalRfqId = element.quoteId;
          this.BestPriceabs = Math.abs(element.premiumAmount);
          // this.upfront = parseFloat(element.premium).toFixed(4) //Added by UrmilaA | LGTGTWINT-2061 | 2-June-23     
          // this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));
          
          // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
	  if(this.PreminPipsToggle === "%"){

            this.IBPremium =  this.getIBPremValue(element.premiumAmount)  
            this.IBPrem = parseFloat(element.premium).toFixed(this.PointShift).replaceAll('-','');  // HSBCFXEINT-33 | Chaitanya M | 12 Dec 2023
            this.ClientPrem = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal, false,)
          
          } else {
            this.IBPrem = this.FXD_cfs.ConvertIntoPIPs(this.NotionalAmt.replaceAll(',', ''), this.Strike.replaceAll(',',''), element.premiumAmount, this.PointShift, this.IBPremCcy, this.NotionalAmt,this.DepCcy);
            this.IBPremium = this.getIBPremValue(element.premiumAmount)  
            this.Clientperc = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal, true);
            
          }
	  // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
          
          
          this.IBPremDirection = element.premium > 0 ? 'Pay' : 'Receive';
          //added by UrmilaA | 30-May-23 | LGTCLI-361 | start
          if(this.ShowRFS){
              if(element.premium > 0){
              
                this.IBPremComment = 'IB Pays'
                this.ClientPremDir = 'R'
                this.ClientPremComment = 'Client Receives' // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
              }else{
             
                this.IBPremComment = 'IB Receives' 
                this.ClientPremDir = 'P' 
                this.ClientPremComment = 'Client Pays' // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
              }
          }else{
            this.ClientPremDir = element.client_Prem_Dir;  //UrmilaA | 13-feb-23 | LGTCLI-304
            this.IBPremComment = this.FXD_cfs.fngetIBcomment(element.client_Prem_Dir) //Urmila a | 16-feb-23 | LGTCLI-314
            this.ClientPremComment = this.FXD_cfs.fngetClientPremComment(element.client_Prem_Dir); // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
          }
          //added by UrmilaA | 30-May-23 | LGTCLI-361 | ends

          if(this.OrderDirection.toLowerCase() === 'buy'){
            this.AskSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
          }else{
            this.BidSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
          }

          this.fnFindUpfrontUSD();
          this.fnGetContractSummary();  
  }


  //added by UrmilaA, 10-May-23 | LGTGTWINT-1147 | start
  closeSignalR(){
  if((this.BestPrice && this.ShowRFS && this.NoteMasterID !=='0') || (this.Bestpricesubscription?.closed && this.SignalRQuoteIDs !== '')){
      this.CancelSignalRconnectionSub = this.FXD_afs.FXDResetDictionaryFromRFQIDAPI(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Product_Code, this.SignalRQuoteIDs,
        this.DCDRfqId, this.NoteMasterID)
      .subscribe((res:any)=>{
          try{
              if(res){
                res=res.UnsubcribeRFQIDResult.A_ResponseReceived
                this.SignalR_unsubscriber = res;   //UrmilaA |LGTCLI-361 | 24-May-23              
                if(res === true){                 
                  this.SignalRQuoteIDs='';
                }               
              
              }
          }catch(err){console.log(err)}
      })
  }
  
 }
 //added by UrmilaA, 10-May-23 | LGTGTWINT-1147 | ends
  //Urmila A | LGTGTWINT-1147 ,LGTGTWINT-1322| Pricing loader | 3-feb-23 |
  CancelPricing() {
    if (this.Bestpricesubscription) {
      this.Bestpricesubscription.unsubscribe();
    }
    this.priceLoader = false;
    this.fnResetpricingFlags(); //UrmilaA | LGTGTWINT-1147
  }

  //added by urmilaA | LGTCLI-361 | 30-May-23 | start
  fnResetpricingFlags(){
    this.MinQuoteTimeOutOccurred =false; 
    this.MaxQuotePriceCame= false; 
    this.btnEnable=false;
    this.noResponseRecv=false; 
    this.OrderPlaced=false; 
    this.signalRMsgRecv=false;
   
   
    this.MinMaxTimer=0;
    clearInterval(this.MinInterval)
    clearInterval(this.maxInterval)
    clearTimeout(this.MaxTimeout)
    clearTimeout(this.MinTimeput)
    if(this.SignalRQuoteIDs !== ''){
      this.closeSignalR()
    }  
    this.BestPrice=null;
    

    //Email Quote btn disable issue | 12-june-23|start
    this.QuteMailClicked=false;
    this.QuoteMailSent=false;
    this.closeQuoteMail=false;
    this.OrderPlaced=false;
    // this.saveTradeDone=false; //added by UrmilaA | 21-June-23 | LGTGTWINT-2144
    //Email Quote btn disable issue | 12-june-23|ends

  }
  //added by urmilaA | LGTCLI-361 | 30-May-23 | ends


  // Urmila A | 11-Nov-22 |  Start
  FindLeftUSDMidRate(LeftCCY) {
    this.LeftUSDMidrate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      LeftCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if(res !== null) {
        this.AllDataLoaded.bidask = true;
        // this.LeftUSDMidrate = res?.MidRate;               
       
        this.LeftUSDMidrate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                                + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 

        console.log('left USD Midrate:', this.LeftUSDMidrate);
        //if(!this.RouteFromWorkflow || !this.RouteFromQuoteHistory)
        if (!this.IsNavigate) { //modified by Urmila A | 29-mar-23
          this.GetStrikeRate();
        }

      }
    });
  }
  FindRightUSDMidRate(RightCCY) {
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration  
      this.Product_Code,
      RightCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) {
        this.AllDataLoaded.bidask = true;
        // this.RightUSDMidRate = res?.MidRate; 

        this.RightUSDMidRate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                                + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 
                                
        console.log('Right USD Midrate:', this.LeftUSDMidrate);
        //if(!this.RouteFromWorkflow || !this.RouteFromQuoteHistory)
        if (!this.IsNavigate) { //modified by Urmila A | 29-mar-23
          this.GetStrikeRate();
        }
      }
    });
  }


  fnFindUpfrontUSD() {
    if (this.IBPremToggle || this.NotionalToggle) {
      if (this.UpfrontAlt !== '') {
        if (this.NotionalAmt !== undefined || this.NotionalAmt !== '') {
          if (this.IBPremCcy === this.DepCcy && this.NotionalCcy === this.AltCcy) {
            this.UpfrontVal = (parseInt(this.NotionalAmt.replace(/,/g, ''), 10) / parseFloat(this.StrikePoint)) * (parseFloat(this.Upfront) / 100)
          } else if (this.IBPremCcy !== this.NotionalCcy) {
            this.UpfrontVal = parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * parseFloat(this.StrikePoint) * (parseFloat(this.Upfront) / 100);
          } else {
            this.UpfrontVal = (parseInt(this.NotionalAmt.replace(/,/g, ''), 10) * parseFloat(this.Upfront)) / 100;
          }
          this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(2))
          console.log('UpfrontVal: ', this.UpfrontVal)
        }
      }
    }else{
      if (this.NotionalAmt !== '' || this.NotionalAmt !== undefined || this.NotionalAmt !== '0.00') {
        var temp = this.NotionalAmt.replaceAll(',', '')
        // this.NotionalAmt = this.NotionalAmt.replaceAll(',','')
        if (this.IBPremCcy === this.DepCcy && this.NotionalCcy === this.AltCcy) {
          this.UpfrontVal = (Number(temp) / Number(this.StrikePoint)) * (Number(this.Upfront) / 100)
        } else if (this.IBPremCcy !== this.NotionalCcy) {
          this.UpfrontVal = (Number(temp) * Number(this.StrikePoint) * (Number(this.Upfront) / 100))
        } else {
          this.UpfrontVal = (Number(temp) * Number(this.Upfront)) / 100;
        }
        this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(2))
      }
    }

    //Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
    if(this.PreminPipsToggle === "Pips"){

      let _Pipsmultipler = this.FXD_cfs.multiplyByMultiplier(10, Number(this.PointShift));

      if(this.IBPremCcy !== this.NotionalCcy){
  
        this.UpfrontVal = ( this.Upfront.replaceAll(/,/g, '') * (Number(this.NotionalAmt.replaceAll(',','')))) / _Pipsmultipler ;  
  
      }else{
  
        if(this.NotionalCcy === this.DepCcy){
  
          this.UpfrontVal = ( this.Upfront.replaceAll(/,/g, '') * ( Number(this.NotionalAmt.replaceAll(',','')) * Number(this.Strike.replaceAll(',','')))) / _Pipsmultipler ;  
          
        }else{
  
          this.UpfrontVal = ( this.Upfront.replaceAll(/,/g, '') * ( Number(this.NotionalAmt.replaceAll(',','')) / Number(this.Strike.replaceAll(',','')))) / _Pipsmultipler ;  
        
        }
        
      }

      this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(this.UpfrontVal).toFixed(2));
    
    }
    //End :  HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

    //Commenting below part as , Negative sign to be remove for upfrontAlt, UpfrontUSD | UrmilaA | 4-Jan-24
    // if (this.UpfrontVal.includes('-') || this.UpfrontAlt.includes('-')) {
    //   this.UpfrontVal = this.UpfrontVal.replace('-', '')
    //   this.UpfrontAlt = this.UpfrontAlt.replace('-', '')
    // }
    this.UpfrontVal = this.UpfrontVal.replaceAll(',', '')

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
      
      console.log('left USD:',this.Left_USD_Pair,'Right USD:',this.Right_USD_Pair);

      // Start - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023
      if(this.Left_USD_Pair.includes(this.IBPremCcy)){
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.Left_USD_Pair) {            
            if(element.asset1 === "USD" ){
              this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal / this.LeftUSDMidrate : this.GetLeftUSDMidRate(this.Left_USD_Pair,this.UpfrontVal,true);
            }else if(element.asset2 === "USD" ){
              this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : this.GetLeftUSDMidRate(this.Left_USD_Pair,this.UpfrontVal,false);
            }
                
          }
        });
      }else if(this.Right_USD_Pair.includes(this.IBPremCcy)){
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.Right_USD_Pair) {            
            if(element.asset1 === "USD" ){
              this.RightUSDMidRate !== '' ?  this.UpfrontAlt =  this.UpfrontVal / this.RightUSDMidRate : this.GetRightUSDMidRate(this.Right_USD_Pair,this.UpfrontVal,true);
            }else if(element.asset2 === "USD" ){
              this.RightUSDMidRate !== '' ?  this.UpfrontAlt =  this.UpfrontVal * this.RightUSDMidRate : this.GetRightUSDMidRate(this.Right_USD_Pair,this.UpfrontVal,false);
            }               
          }
        });
      } 


      // if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.DepCcy) {
      //   this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      // } else if (this.NotionalCcy === this.AltCcy && this.IBPremCcy === this.DepCcy) {
      //   this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : '';
      // } else if (this.NotionalCcy === this.DepCcy && this.IBPremCcy === this.AltCcy) {
      //   this.RightUSDMidRate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.RightUSDMidRate : '';
      // } else if (this.NotionalCcy === this.AltCcy && this.IBPremCcy === this.AltCcy) {
      //   this.RightUSDMidRate !== '' ? this.UpfrontAlt = this.UpfrontVal / this.RightUSDMidRate : '';
      // }

      // End - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023

    }
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal)

    if (typeof this.UpfrontAlt === "string" &&  this.UpfrontAlt !== ''){ //modified by Urmila A | 4-Jan-24 | formatting not appending
      this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
    } else if (typeof this.UpfrontAlt === "number") {
      this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
    }
    //Added by Urmila A | 11-Jan-23 | end


    //Commenting below part as , Negative sign to be remove for upfrontAlt, UpfrontUSD | UrmilaA | 4-Jan-24
    //Urmila A | 14-feb-23 | LGTCLI-304 | start
    // if (this.ClientPremDir === 'P' && Number(this.UpfrontVal) !== 0 && Number(this.UpfrontAlt) !== 0) {
    //   //Urmila A | LGTGTWINT-1519 | 24-feb-23
    //   if (this.UpfrontVal.includes('-') || this.UpfrontAlt.includes('-')) {
    //     this.UpfrontVal = this.UpfrontVal.replace('-', '')
    //     this.UpfrontAlt = this.UpfrontAlt.replace('-', '')
    //   }
    //   // this.UpfrontVal = this.UpfrontVal.substring(0, 0) + '- ' + this.UpfrontVal.trim().substring(0, this.UpfrontVal.length);
    //   // this.UpfrontAlt = this.UpfrontAlt.substring(0, 0) + '- ' + this.UpfrontAlt.trim().substring(0, this.UpfrontAlt.length);
    // }

    console.log('Upfront USD:', this.UpfrontAlt)

  }

  // Start - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
  GetLeftUSDMidRate(LeftCCY,UpfrontVal,isUSD){
    this.LeftUSDMidrate = '';
    this.getBidaskSubscriber =this.FXD_afs.GetBidAskVB(
      this.Product_Code,
      LeftCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName,
    ).subscribe((res) => {
      if(res !== null) {
        this.AllDataLoaded.bidask = true;
        // this.LeftUSDMidrate = res?.MidRate;               
        
        this.LeftUSDMidrate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                                + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 
  
        this.UpfrontAlt = isUSD === true ? ( UpfrontVal / this.LeftUSDMidrate ): ( UpfrontVal * this.LeftUSDMidrate );

        if(typeof this.UpfrontAlt === "string" && !this.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
          this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
        }else if(typeof this.UpfrontAlt === "number"){
          this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
        }

      }
    });
  }
  // End - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023

  // Start - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023
  GetRightUSDMidRate(RightCCY,UpfrontVal, isUSD){
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(
      this.Product_Code,
      RightCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName,
    ).subscribe((res) => {
      if (res) {
      this.AllDataLoaded.bidask = true;
      // this.RightUSDMidRate = res?.MidRate; 
      this.RightUSDMidRate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                              + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 
                                  
        this.UpfrontAlt = isUSD ===true ? ( UpfrontVal / this.RightUSDMidRate ) : ( UpfrontVal * this.RightUSDMidRate );
        if(typeof this.UpfrontAlt === "string" && !this.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
          this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
        }else if(typeof this.UpfrontAlt === "number"){
            this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
        }

      }
    });
  }
  // End - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023

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
              '<CustID>' + ''
              // this.IsRMLoggedIn 
              ? '1'
              : this.HomeAPI.CustomerId +
                '</CustID>' +
                '<Customer_Name>' + ''
                // this.IsRMLoggedIn 
                ? 'CustomerPB'
                : this.HomeAPI.CustomerName +
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
            sessionStorage.getItem('CustomerNamevalue') +
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
            AppConfig.settings.CSP_EntityDetails.Entity_ID +
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
          try {
            if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
              if (res ) {
                console.log(res);
                if (
                  res.GetFXOPriceManualModeResult !== null &&
                  !res.GetFXOPriceManualModeResult
                ) {
                  this.ServiceResponse = res[0];
                  console.log('Manual price res:', res[0])
                  // this.fnSetIBPrem(this.ServiceResponse.IBPrem);
                  // this.IBPrem = this.ServiceResponse.IBPrem;
                  // this.ClientPrem = this.ServiceResponse.CustPrem;
                  // this.ClientPrem = parseFloat(this.ServiceResponse.CustPrem).toFixed(this.IBPremCcy === this.AltCcy ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
          } catch (err) { }

        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    else {
      if (this.Errormsg !== "") {
        this.NotificationFunction("Error", "Error", this.Errormsg)
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
    let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)
    console.log('this.BestPriceProvider:', this.BestPriceProvider)
    try {
      this.OrderBlotterVisibility = false;
      this.ScheduleVisibility = false;
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
        // this.BestPrice,
        // ActiveRemark

        this.FXD_afs.EntityID,
        this.FXD_afs.UserName,
        this.DCDRfqId,
        this.ExternalRfqId.toString(),
        this.BestPriceProvider,
        this.Product_Code,
        this.BestPrice,
        ActiveRemark // HSBCFXEINT-21 | Chaitanya M | 08 dec 2023

      ).subscribe((res) => {     
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
            if (res) {       
              this.OrderPlaced = true  
                if (res !== null) 
                {
                    this.FXD_cfs.loadFlag=false;          
                    this.ViewScheduleflag = false;
                    this.Orderplace = res.External_TradeID;
                    this.DealNo = res.DealNo;
                    this.FXD_cfs.DealBooked.next(false)
                    this.FXD_cfs.fxdpopupOpenClose=true;
                    // this.OrderPlaceFlag = false;            
                    if (res.isProcessCompleted === true) {
                      this.FXD_afs.FXD_RFQID.next(this.DCDRfqId);        
                      this.orderMsg = res.Message;
                      // this.OrderPlacedPopup = true;
                      // this.OrderPlaced = true
                      // this.orderMsg = res.ResponseTradeBookParameters.Message;
                      // this.Orderplace = res.ResponseTradeBookParameters.External_TradeID;
                      // this.DealNo = res.ResponseTradeBookParameters.DealNo;
                      this.ClearPricingFlag = true;   
                      console.log('book deal, ', this.OrderPlaceFlag)
                    } else if (res.isProcessCompleted === false) {
                      // this.OrderPlacedPopup = true;
                      // this.OrderPlaced = true
                      this.orderMsg = res.Message;
                    }
                    else {
                      this.Orderplace = '';
                    }
                  
                }
            }
  
          else {
            // this.OrderPlaced = true;
            if(res.ResponseTradeBookParameters === undefined || res.ResponseTradeBookParameters === null || res.ResponseTradeBookParameters === '' ){
              
              this.NotificationFunction("Error","Error", res.A_ResponseHeader.FailedReason)
              
            }else if(res.ResponseTradeBookParameters.isOrderRejected === true && res.ResponseTradeBookParameters.RejectionReason !== ''){
              
              this.NotificationFunction("Error","Error", res.ResponseTradeBookParameters.RejectionReason.split('.')[0])

            }else if(res.ResponseTradeBookParameters.RejectionReason !== '' && res.ResponseTradeBookParameters.External_TradeID === null && res.ResponseTradeBookParameters.isOrderRejected === false){
              
              this.NotificationFunction("Error","Error", 'Order may have got executed or may have failed. Contact support')

            }else{
              
              this.NotificationFunction("Error", "Error", 'Order rejected due to some technical reasons.')

            }

          }      
        }
       
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  TradeSelectedLP(SelectedLPDetails) {
  
    console.log('SelectedLPDetails', SelectedLPDetails)
    this.BestPriceProvider = SelectedLPDetails.provider;
    this.ExternalRfqId = SelectedLPDetails.quoteId;


    this.ServiceResponse.forEach(element => {
      if (element.provider === SelectedLPDetails.provider) {
        this.BestPrice = element.premiumAmount;
      }
    });

    this.BookDeal()
  }

  fnCalculations() {
    // this.IBPrem = ((this.BestPriceabs * Number(this.NotionalAmt.replace(/,/g, ''))) / 100);
    // this.IBPrem = Number(parseFloat(this.IBPrem.toString()).toFixed(4));
    // if (this.ClientPrem > 0) {
    //   this.UpfrontCcy = (this.IBPrem - this.ClientPrem);
    //   this.Upfront = ((this.UpfrontCcy / Number(this.NotionalAmt.replace(/,/g, ''))) * 100);
    // } else {
    // this.ClientPrem = 0.0;
    // this.UpfrontVal = this.BestPrice;
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
    if (this.OrderDirection === "Sell") {
      this.Strike = this.BidSpot
    }
    else {
      this.Strike = this.AskSpot
    }
  }

  // Added for metal pair issue | Chaitanya M | 27 Oct 2023
  fnCheckComma(num){
    if(num.includes(',')){
        return num.replaceAll(',','')
    }else{
        return num
    }
  }
  //End | Chaitanya M | 27 Oct 2023

  ChangeOrderDirection(e) {
    this.OrderDirection = e.target.value
    this.GetStrikeRate()
  }
  fnDisableTradebtn(e) {
    this.OrderPlaceFlag = e;
    this.ViewSchedule = false;
    this.ViewScheduleflag = false;
  }

  fnDisablePrembtn(e) {
    this.disabledPrembtn = e;
  }

  fnDisableLoader(e) {
    console.log('Global Loader flag', e, 'OrderPlaced', this.OrderPlaced)
    this.OrderClicked = e
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
  ChangeinNotionalPerfixing() {
    console.log('notional per fixing:', this.NotionalPerFixing)
    this.NotionalAmt = this.FXD_cfs.format(
      Number(this.NotionalPerFixing.replaceAll(/,/g, '')) * Number(this.NoOfSett),
      this.NotionalDecimalPointShift
    );

    this.fnGetContractSummary();
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
        this.CurrencyPairList.forEach((element) => { //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23
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
    //Added by UrmilaA | 26-Dec-23 | start
      if (this.CurrencyPair !== ''  && this.CurrencyPair.length == 9) {
        // this.setCCY();
        // this.fnGetFXDCurrencyPairs();
        this.CurrencyPairChanged();
        this.fnGetOptionCutFXD(); //Added by Urmila A | for updating option cut after CCY change       
        this.fnGetDatesCalculationforVB();
  
        this.PutStrike = ""; 
        this.CallStrike = "";
      }
      if(this.CurrencyPair == '' || this.CurrencyPair.length <= 8){
        this.DepCcy = this.AltCcy = '';
        this.IBPremCcy = this.NotionalCcy = ''
        this.fnGetBidAskRates();
      } 
    //Added by UrmilaA | 26-Dec-23 | ends

  }

  // Urmila A | View schedule functonality | 7-Dec-22 | start
  fnShowOrHideShedule() {
    //replacing RouteFromWorkflow  with IsNavigate everywhere, by Urmila A, 29-Mar-23, for redirected deals

    let XML = ''; //Urmila A | LGTGTWINT-1332 | 6-feb-23 | start
    if (this.RouteFromWorkflow && !this.GperiodChange && !this.ResetAllfieldsCalled) {
      this.NoteMasterID = this.NoteToUnblock;
    } else if (this.ResetAllfieldsCalled) {
      this.NoteMasterID = ''
    } else if (this.RouteFromWorkflow && !this.GperiodChange && !this.ResetAllfieldsCalled && !this.BestPrice) {
      this.NoteMasterID = this.NoteToUnblock;
    } else if (this.RouteFromQuoteHistory) { //urmila A, 29-Mar-23,  LGTGTWINT-1758
      this.NoteMasterID = this.NoteMasterID
    }//end
    this.ViewScheduleflag = true;
    this.scheduleBtnClick = true; //Urmila A | LGTGTWINT-1244 | 30-Jan-23
    this.ScheduleCallWithGuarenteeperiod = false
    this.FXD_cfs.schedulePopupOpenClose.next(true);
    let LeverageTXT = this.Leverage > 1 ? 'Booster' : ''

    // Start - | HSBCPBIN-535 | Chaitanya M | 11 Oct 2023
    if(this.Product_Code === "STRANGLE"){
      /// Customer Buying EUR/USD Strangle on EUR 200,000.00 at Call Strike: 0.0000 and Put Strike 0.0000

      console.log('Schedule XML: ', 
        this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair + ' ' 
                                  + ' Strangle on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                  + ' at Call Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                  + ' and Put Strike : ' + ( this.PutStrike !== '' ? this.PutStrike : 0 )
      );

      this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair 
                                + ' Strangle on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                + ' at Call Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                + ' and Put Strike : ' + (this.PutStrike !== '' ? this.PutStrike : 0) ; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550

    }else if(this.Product_Code === "STRADDLE"){
      ////  Customer Buying EUR/USD Straddle on EUR 200,000.00 at Strike: 1.0612

      console.log('Schedule XML: ', 
        this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair + ' ' 
                                  + ' Straddle on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                  + ' at Strike : ' + ( this.Strike !== '' ? this.Strike : 0 ) 
      );

      this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair 
                                + ' Straddle on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                + ' at Strike : ' + ( this.Strike !== '' ? this.Strike : 0 ) ; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550

    }else if(this.Product_Code === "RSKREV"){
      //// Customer Buying USD/JPY Risk Reversal on USD 1,200,000.00 at Call Strike: 0.00 and Put Strike 0.00  + this.OrderDirection + 'ing  '

      console.log('Schedule XML: ', 
        this.ScheduleDescription = ' Customer '  + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair + ' ' 
                                  + ' Risk Reversal on ' + this.NotionalCcy + ' ' + this.NotionalAmt + ' at Call Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                  + ' and Put Strike : ' + ( this.PutStrike !== '' ? this.PutStrike : 0 ) 
      );

      this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' ) + ' ' + this.CurrencyPair  
                                + ' Risk Reversal on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                + ' at Call Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                + ' and Put Strike : ' + (this.PutStrike !== '' ? this.PutStrike : 0) ; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550

    }else if(this.Product_Code === "OPSPRD"){
      /// Buy EUR - USD Call Spread on EUR at Long Strike : 0,Short Strike : 0

      console.log('Schedule XML: ', 
        this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' ) + ' ' + this.CurrencyPair + ' ' 
                                  + ' Spread on ' + this.NotionalCcy + ' ' + this.NotionalAmt + ' at Long Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                  + ' and Short Strike : ' + ( this.PutStrike !== '' ? this.PutStrike : 0 ) 
      );

      this.ScheduleDescription = ' Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' ) + ' ' + this.CurrencyPair  
                                + ' Spread on ' + this.NotionalCcy + ' ' + this.NotionalAmt 
                                + ' at Long Strike : ' + ( this.CallStrike !== '' ? this.CallStrike : 0 )
                                + ' and Short Strike : ' + (this.PutStrike !== '' ? this.PutStrike : 0) ; // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550

    }
    // END - | HSBCPBIN-535 | Chaitanya M | 11 Oct 2023


    this.GenerateXML()


  }
  // Urmila A | View schedule functonality | 7-Dec-22 | end

  getfnCalculateFirstFixingDate() {
    this.AllAPIsLoaded = false;  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
    this.AllDataLoaded.FixingDate = false; //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
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

    this.FXDFirstFixingDateSubscriber = this.FXD_afs.fnGetFixingDateFromNoOfSett(
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
        this.AllDataLoaded.FixingDate = true;
        //urmila A, 5-april-23 , LGTGTWINT-1846
        this.prevFirstFixingDate = this.FirstFixingDate = this.datepipe.transform(res.FirstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23

        this.firstFixChngAndDatesReceived = true;
      
     
        if (this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true) {  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded = true;
        }

      }
      this.CurrencyChanged = false; //Added by Urmila A | 7-Jan-23
    });

  }

  getEntityData() {

    this.FXDEntitySubscriber = this.FXD_afs.getEntityData( this.Product_Code) //Core migration : API req paarms modified by Urmila A | 23-Aug-23
      .subscribe((res: any) => {
        console.log("entity data", res);
        try {
          if (res ) {
            if (res.GetEntityDataResult.CVPResponse.CVPData) {
              this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
              sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code)
            }
          }
        } catch (err) { }

      });

  }

  //Added by Urmila A | 25-April-23, for PB demo entity
  chngEntity(e) {
    if (e.target.value === '50') {
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';
    }

    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)
    this.FXD_afs.SetCredentials() //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 
    this.SetDefaultValues();
    this.fnButtonVisibility()
    this.fnGetPriceProviderandCcypairs();
    this.fnGetFXDCurrencyPairs();
  }

  EmailQuote() {
    try {
      this.QuteMailClicked = true;
      this.QuoteMailSent = false;
      this.closeQuoteMail = false;
      this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName, this.NoteMasterID.toString(), this.Product_ID, this.DCDRfqId)
        .subscribe((res) => {
          if (res) {
            res=res.result
            if(res === true){     
                if (res === true) {
                  this.FXD_cfs.fxdpopupOpenClose=true;
                  this.QuoteMailSent = true;
                  this.QuteMailClicked = false;
                } else {
                  this.QuoteMailSent = false;
                  this.NotificationFunction("Error", "Error", "Email Quote Failed.")
                }
            }else{
              this.NotificationFunction("Error","Error","No Response from service")
              this.QuoteMailSent=false;
              this.QuteMailClicked=false;
            }       
          }
        });
    } catch (exception) { // Try-catch added by Uddesh on 28th April, 2023 | JIRA Id: LGTGTWINT-1800
      
    }
  }

  closeOrderPopup() {
    this.OrderClicked = false;
    this.OrderPlaced = true
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }

  closeEmailQuote() {
    this.QuoteMailSent = false;
    this.closeQuoteMail = true; //UrmilaA | 13-feb-23
  }
  // Added by Urmila A | 14-Nov-22 | End

  // ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
  fnSaveTrade() {
    this.FXD_cfs.loadFlag=true;
    // this.SaveTradeLoader = true
    this.disabledRoutetodealeronSaveTrade = true //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | disabled Route to dealer.
    this.FXD_afs.SetOrderbtnonSaveTrade(true) //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | for disabled order btn.
    this.fngetSavetradeRecommendation()
  }
  // ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

  // Added by Urmila A | 22-Nov-22| Load Default values | start
  fngetPersonalDefaultValues() {
    this.DepCcy = '';
    this.AltCcy = '';
    this.Tenor = '';
    this.NotionalPerFixing = '';
    //API req params modifications : Core migration | 21-Aug-23 | Urmila A
    this.PersonalDefaultValueSubscriber = this.FXD_afs.getPersonalSettingFXD(this.FXD_afs.EntityID, this.FXD_afs.UserName, this.Product_Code)
      .subscribe((res: any) => {
        try {
          if (res) {
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

  ResetPricer() {
    //added by Urmila A | 12-Sep-23|start
    this.PriceClick=false;
    this.fnResetpricingFlags() 
    this.ClearLPs = true;
    this.resetSignalRPrice() 
    //added by Urmila A | 12-Sep-23|ends

    this.RMRemarkVisibility = false; //LGTGTWINT-1599, Urmila A | 3-Mar-23
    this.ResetPricerFlag = true;  //Urmila A | LGTGTWINT-1209 | 27-Jan-23
    this.RouteFromWorkflow = false;
    this.NewOrderfromRMUnlocked = false; //Urmila A, as reject button was enable after resetpricer
    this.OrderPlaced = false;  //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
    this.scheduleBtnClick = false //Urmila A | 28-Jan-23;
    this.GuaranteedPeriodTill = '';  // Urmila A | 30-Jan-23
    this.GuaranteedPeriods = '0';  // Urmila A | 30-Jan-23
    this.GperiodChange = false; //Urmila A | LGTGTWINT-1332 | 6-Feb-23
    this.FirstFixingDate = ''; //Urmila A | 10-feb-23
    this.IsNavigate = false; //Urmila A | 17-feb-23
    this.noResponseRecv = false; // Urmila A, 29-mar-23
    this.RouteFromQuoteHistory = false; //Urmila A, 30-mar-23
   
    if(this.BestPrice){ //added by UrmilaA, 18-May-23 | LGTGTWINT-1147
      this.closeSignalR();  
    }

    this.fnUnsubscribeAllCalls();
    this.SetDefaultValues();
    this.fnButtonVisibility(); //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23
    // this.DestroyFn(); // HSBCFXEINT-41 | Chaitanya M | 23-Jan-2024
    // Added by Urmila A | 17-Mar-23 |LGTGTWINT-1737
    this.fnGetPriceProviderandCcypairs();
    this.fnGetFXDCurrencyPairs();
    this.fnGetContractSummary();

  }

  // Added by Urmila A | 22-Nov-22| Load Default values | end

  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | start
  fnRouteDealerClick() {
    if (this.DealerRemark === '') {
      this.Errormsg = 'Please enter remark'
      this.NotificationFunction("Error", "Error", this.Errormsg)

    } else if (this.DealerRemark !== '') {
      this.Errormsg = ''
      this.routeToDealerClicked = true;
      this.FXD_cfs.fxdpopupOpenClose=true;
      this.confirmedRouteDealer = false;
      this.SaveTradeEnabledFlag = false //Added  Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P. | disabled save trade idea on Route to dealer
    }

  }
  // closeRouteToDealer() {
  //   this.routeToDealerClicked = false;
  //   this.confirmedRouteDealer = false;
  //   this.IsRouteToDealerExecuted = true;
  // }

  fnConfirmRouteToDealer() {
    this.FXD_cfs.loadFlag=true
    // this.confirmedRouteDealer = true;
    // this.routeToDealerClicked = false;
    // this.routeToDealerClickedloader = false
    this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(this.FXD_afs.EntityID, this.FXD_afs.UserName,
      this.Product_Code, this.DCDRfqId, this.NoteMasterID, this.CustPAN, this.DealerRemark, this.ExceptionWarningMsg)
      .subscribe((res: any) => {
        try {
          res=res.result;
          if (res) {
            if (res === true) // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            {
              if (res=== true) {
                this.FXD_cfs.loadFlag=false               
                this.FXD_cfs.RouteToDealerExecuted=true;
                this.FXD_cfs.fxdpopupOpenClose=true;
                this.confirmedRouteDealer=true
                // this.IsRouteToDealerExecuted = true;
                // this.routeToDealerClicked = true;
                // this.routeToDealerClickedloader = true // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                console.log('Route to dealer res:', res)
              }
            }
            // ---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            else {
              // this.routeToDealerClickedloader = true
              this.NotificationFunction("Error", "Error", "Route to dealer failed.")
            }
            // ---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572

          }
        } catch (err) { }
      })
  }
  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | end

  // Added by Urmila A | 20-Dec-22 | start
  fnChngeRemark(e) {
    try {
      this.DealerRemark = e.target.value
    } catch (err) { }

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

  fnCloseRejectRouteToDealer() {
    this.RejectRedirectedOrder = false;
  }
 // Modified by UrmilaA | Reject route to dealer | code sync with 5star | end

 
  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
  fngetSavetradeRecommendation() {
  //API req body params modified by Urmila A | 21-Aug-23 | Core migration
    this.FXD_afs.getSavetradeRecommendation( this.FXD_afs.UserName,  this.NoteMasterID, this.DCDRfqId,
      this.FXD_cfs.fngetMode(), this.DealerRemark) //Urmila A | 15-Feb-23 | LGTGTWINT-1403
      .subscribe((res: any) => {
        try {
          res=res.result;
          if (res) { //Urmila A | 11-Mar-23
            this.FXD_cfs.saveTradeDone=true;
            this.MinMaxTimer=0;
            clearInterval(this.MinInterval)
            clearInterval(this.maxInterval)
            this.FXD_cfs.fxdpopupOpenClose=true;
            this.FXD_cfs.loadFlag=false;
            // this.SavetradePopup = true
            // this.SaveTradeLoader = false
            // this.SaveTradeEnabledFlag = false
            // console.log('getPersonal Setting res=>', res)
          }
          else {
            this.FXD_cfs.loadFlag=false;
            // this.SaveTradeLoader = false
            this.NotificationFunction("Error", "Error", "Save Trade Idea Failed.")
          }
        } catch (ex) { }
      })
  }
  // ---END--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29

  //Added by Urmila A | 27-Dec-22 | LGTCLI-208
  fnNotionalCCYToggle() {
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
    // this.IBPremCcy = this.DepCcy //Urmila A | LGTCLI-251 | 30-Jan-23
    //ends

    try {
      try {
        this.CurrencyPairList.forEach((element) => {
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.NotionalCcy === element.asset1) { //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCcy === element.Asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.NotionalAmt = this.FXD_cfs.NotionalChangewithDecimalFixes(
              this.NotionalAmt,
              this.NotionalDecimalPointShift
            );
          }
        });
      } catch (ex) { }
    } catch (Ex) { }

    if (this.UpfrontVal !== 0 && this.UpfrontVal !== '' && this.UpfrontVal) { //added by Urmila A | 11-Jan-23 | LGTCLI-244
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
    //end
  }

  //modified by UrmilaA | 26-Dec-23 | duplicate variables removed
  changePremiumCcyToggle(e) {
    if (e === this.AltCcy) {
      this.IBPremCcy = this.DepCcy
    }
    else {
      this.IBPremCcy = this.AltCcy
    }
  }

  fnIBPremCCYToggle() {
    this.IBPremToggle = true
    this.ccy2 = true;
    if (this.ccy2 === true && this.IBPremCcy !== this.AltCcy) {
      this.IBPremCcy = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.IBPremCcy = this.DepCcy;
    }
    if (this.UpfrontVal !== 0 && this.UpfrontVal !== '') {
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
    //end
  }

  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572
  NotificationFunction(type, header, reason) {
    this.FXD_cfs.fnSetNotificationFXD({
      NotificationType: type, //'Error',
      header: header, // 'Error',
      body: reason,
      DateandTime: ''
    });
  }
  // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTGTWINT-572


  fnChngKO(e) {
    this.KORate = Number(e.target.value).toFixed(this.PointShift);
  }

  ChangePutStrike(e) {
   
    const target = this.FXD_cfs.GetEventTarget(e);
    this.PutStrike = Number(target.value).toFixed(this.PointShift);
    this.fnGetContractSummary()
  }

  ChangeCallStrike(e) {
   
    const target = this.FXD_cfs.GetEventTarget(e);
    this.CallStrike = Number(target.value).toFixed(this.PointShift);
    this.fnGetContractSummary()
  }

//END

  ChangeUpfront(e) {
    this.Upfront = Number(e.target.value).toFixed(4)
    this.UpfrontVal = (this.Upfront * this.NotionalAmt)
    console.log("Upfront values is ", this.UpfrontVal)
  }

   //urmila A | 4-may-23 | LGTGTWINT-1897 | start
   fnchngPriceProvider(e){
    if(e.target.value !== 'Bestprice'){
      this.BestPricelbl = "Price"; //HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
      this.PriceProviderString = e.target.value   
      this.PriceproviderArr.forEach(element => {
                if(element.PP_Code === e.target.value ){
                  this.SelectedLPForPricing = element.PP_Name //LGTGTWINT-1948 | UrmilaA, 4-may-23
                  this.SampleArray=element
                }
      });
      console.log('this.SampleArray',this.SampleArray)
    }else{
      this.SelectedLPForPricing = this.BestPricelbl = 'Best Price' // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
      this.fngetPriceProviderStr(this.PriceproviderArr)
    }
  
  }
  //urmila A |  4-may-23 | | LGTGTWINT-1897 | ends

  
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

 
  UpfrontChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.Upfront = Number(target.value).toFixed(4); //Urmila A | 23-oct-23
    this.fnFindUpfrontUSD();

  }


  getIBPremValue(prem) {
    console.log('IB Prem value', this.IBPrem);
    if (prem !== '' && this.IBPremCcy.includes('JPY')) {
      this.IBPrem = prem.toFixed(2); // HSBCFXEINT-33 | Chaitanya M | 12 Dec 2023
    } else if (prem !== '' && !this.IBPremCcy.includes('JPY')) {
      this.IBPrem = parseFloat(prem).toFixed(2); // HSBCFXEINT-33 | Chaitanya M | 12 Dec 2023
    }

    return this.FXD_cfs.numberWithCommas(this.IBPrem)
  }

  //Added by Urmila A | 20-mar-23
  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  findClientPrem(IBPrem, perc, upfront, solveinPIPS) {
    upfront =  this.getUpfrontval(upfront)
    
    let ClientPrem
    let _Notionalamt = this.NotionalAmt.replaceAll(',', '');
    let _strikeRate = this.Strike.replaceAll(',','');

    if(solveinPIPS === true){

      if(perc < 0){      
        ClientPrem = Math.abs(IBPrem) + parseFloat(upfront);
        this.Clientperc = (Number(perc) + parseFloat(this.Upfront)).toFixed(4).replaceAll('-','');        
      }else{
        ClientPrem = Math.abs(IBPrem) - parseFloat(upfront);
        this.Clientperc = (Number(perc) - parseFloat(this.Upfront)).toFixed(4).replaceAll('-','');
      }

      this.Clientperc = this.FXD_cfs.ConvertIntoPIPs(_Notionalamt, _strikeRate, ClientPrem, this.PointShift, this.IBPrem, this.NotionalAmt,this.DepCcy);  

    } else {

      if(perc < 0){      
        this.ClientPrem = Math.abs(IBPrem) + parseFloat(upfront)           
      }else{
        this.ClientPrem = Math.abs(IBPrem) - parseFloat(upfront)
      }
    
      this.Clientperc = (Number(perc) - parseFloat(this.Upfront)).toFixed(4).replaceAll('-','');

    }
 
    
    return this.FXD_cfs.numberWithCommas(this.ClientPrem.toFixed(2).replaceAll('-',''))// HSBCFXEINT-33 | Chaitanya M | 12 Dec 2023
  }
  // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

  getUpfrontval(upfront) {
    if(upfront.toString().includes(',') && upfront !== undefined){
      return upfront.replaceAll(',','')
    }else if(!upfront.toString().includes(',')){
      return upfront
    }else if(this.UpfrontVal.includes(',') ){
        return this.UpfrontVal.replaceAll(',','')
    }else if(!this.UpfrontVal.includes(',')){
        return this.UpfrontVal
    }
  }

  ChangeStrike(e) {
    if (e.target.value === "") {
      this.GetStrikeRate()
    }
    else {
      this.Strike = e.target.value
    }
  }

  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  fnPremInPipToggle(){
    if(this.PreminPipsToggle === "%"){
      this.PreminPipsToggle = "Pips"
    }else{
      this.PreminPipsToggle = "%"
    }

    if (Number(this.Upfront) !== 0) {
      this.fnFindUpfrontUSD();
    }
    
  }
  // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

 
  GenerateXML() {
    const spotrate =
      this.OrderDirection === 'Buy' ? this.AskSpot : this.BidSpot;
    if (this.Product_Code === "RSKREV") {
       //IBPremCcy modified by UrmilaA | 26-Dec-23 | duplicate variables removed
      this.ScheduleXML =
        "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>" +
        "Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
        + "</Notional><CustID>" + this.CustID + "</CustID><Customer_Name>" + this.Customer_Name + "</Customer_Name>" +
        "<LeverageFactor>" + this.Leverage + "</LeverageFactor><OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
        + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
        this.AltCcy + "</AltCcy>" +
        "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy" +
        "><PremiumDate>" + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
        + "</BuySell><FixingDate>" + this.FixingDate +
        "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
        "</SettDate><Tenor>" + this.Tenor +
        "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays><CallStrike>" + this.CallStrike + "</CallStrike>" +
        "<PutStrike>" + this.PutStrike + "</PutStrike><Entity_ID>" + this.FXD_afs.EntityID + "</Entity_ID>" +
        "<CAI_ID>7400</CAI_ID><PricingModel>Black Scholes</PricingModel></Sheet1></" +
        "ExcelSheets>"
    }
    else if (this.Product_Code === "STRANGLE") {
      this.ScheduleXML =
        "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Code + "</Product_Name><Hedging_x0020_Type>" +
        "Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
        + "</Notional><CustID>" + this.CustID + "</CustID><Customer_Name>" + this.Customer_Name + "</Customer_Name>" +
        "<OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
        + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
        this.AltCcy + "</AltCcy>" +
        "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy" +
        "><PremiumDate>" + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
        + "</BuySell><FixingDate>" + this.FixingDate +
        "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
        "</SettDate><Tenor>" + this.Tenor +
        "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays><CallStrike>" + this.CallStrike + "</CallStrike>" +
        "<PutStrike>" + this.PutStrike + "</PutStrike><Entity_ID>" + this.FXD_afs.EntityID + "</Entity_ID><CAI_ID>7400</CAI_ID></Sheet1></" +
        "ExcelSheets>"
    }
    else {
      this.ScheduleXML =
        "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Code + "</Product_Name><Hedging_x0020_Type>" +
        "Dynamic</Hedging_x0020_Type><Spotrate>" + spotrate + "</Spotrate><Notional>" + this.NotionalAmt.replace(/,/g, '')
        + "</Notional><CustID>" + this.CustID + "</CustID><Customer_Name>" + this.Customer_Name + "</Customer_Name>" +
        "<OptionCut>" + this.OptionCut + "</OptionCut><NonDeliveryYN>"
        + this.NDFFlag + "</NonDeliveryYN><CcyPair>" + this.CurrencyPair + "</CcyPair><AltCcy>" +
        this.AltCcy + "</AltCcy>" +
        "<InvCcy>" + this.DepCcy + "</InvCcy><PremiumCcy>" + this.IBPremCcy + "</PremiumCcy" +
        "><PremiumDate>" + this.Premiumdate + "</PremiumDate><BuySell>" + this.OrderDirection
        + "</BuySell><FixingDate>" + this.FixingDate +
        "</FixingDate><TradeDate>" + this.TradeDate + "</TradeDate><SettDate>" + this.MaturityDate +
        "</SettDate><Strike>" + this.Strike + "</Strike><Tenor>" + this.Tenor +
        "</Tenor><TenorDays>" + this.TenorDays + "</TenorDays>" +
        "<Entity_ID>" + this.FXD_afs.EntityID + "</Entity_ID><CAI_ID>7400</CAI_ID></Sheet1></" +
        "ExcelSheets>"
    }
  }

  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ Start --------------------------------------

  fnGetFixingMaturityDate(TempDate,fixingOrMaturity) {
    this.FXD_afs.fnGetFixingMaturityDate(
      this.AltCcy, 
      this.DepCcy,
      this.TradeDate, 
      Number(this.FXD_afs.EntityID), 
      this.Tenor, 
      this.Product_ID, 
      fixingOrMaturity,      
      this.OptionCut, 
      TempDate, 
      '', 
      this.FXD_afs.UserName, 
      "Y"
    ).subscribe(res => {
      if (res) {
        this.Premiumdate = JSON.parse(res.valueDate).m_Date;

        fixingOrMaturity === "MATURITY" 
        ? this.MaturityDate = JSON.parse(res.fixingMaturityDate).m_Date
        : this.FixingDate = JSON.parse(res.fixingMaturityDate).m_Date;

        // Start : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        fixingOrMaturity === "MATURITY" 
        ? this.MaturityDate = this.datepipe.transform(this.MaturityDate, 'yyyy-MM-dd')
        : this.FixingDate = this.datepipe.transform(this.FixingDate, 'yyyy-MM-dd');

        this.calculateDays(this.FixingDate,this.Premiumdate);
        // End : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        
        this.fnGetContractSummary();
      }
    })
  }

  // Start : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
  calculateDays(fixindate, premiumdate){
    let date = new Date(premiumdate);
    let currentDate = new Date(fixindate);

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    this.TenorDays = days;
    this.Tenor = days + "D"
  }
  // End : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024

  FixingDatechange(e){
    let date:any = new Date( e.target.value);
    if(date.toString().includes('Sat') || date.toString().includes('Sun')){
      this.NotificationFunction("Error","Error" , 'Fixing date should not fall on holiday') 
    }else if(e.target.value !== ''){ 
      this.FixingDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd');  
      this.fnGetFixingMaturityDate(this.FixingDate,"MATURITY");    
    }
  }

  MaturityDatechange(e){
    let date:any = new Date( e.target.value);
    if(date.toString().includes('Sat') || date.toString().includes('Sun')){
      this.NotificationFunction("Error","Error" , 'Maturity date should not fall on holiday') 
    }else if(e.target.value !== ''){ 
      this.MaturityDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd'); 
      this.fnGetFixingMaturityDate(this.MaturityDate,"FIXING");    
    }
  }

  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ End --------------------------------------

}





