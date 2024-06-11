import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation  
} from '@angular/core';

import {Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';

import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { PivotModel } from '../../Common-Components/models/pivot-model.service';

import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';
import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
// import { PipeTransform, Pipe } from "@angular/core";
import { ThemeserviceService } from './../../../../themeService/themeservice.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service'; //urmilaA | LGTCLI-361
@Component({
  selector: 'app-pivot',
  templateUrl: './pivot.component.html',
  styleUrls: ['./pivot.component.scss', '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
  // encapsulation: ViewEncapsulation.None,
})

export class PivotComponent implements OnInit, OnChanges, OnDestroy {
  @Input() Product_ID: any;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: any;
  // @Input() AppMode: string;
  @Input() ViewMode: string;
  @Input() InputData: any;
  @Input() Template_Name:any;  //Urmila A | 20-feb-23
  @Input() TemplateCode:any;  //Urmila A | 20-feb-23
  @Input() TemplateID:any; //Urmila A | 20-feb-23
  @Input() AllProdData:any; //Urmila A | 20-feb-23
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23
  @Input() AllowSolveForYN :any; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  @Input() ShowPriceProviderOnQEN:any;
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;
  
  
  IsIALoggedIn: boolean;
  KI: any;
  OrderPlaced: boolean = false;
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  OrderPlacedPopup : boolean=false;
  orderMsg: any;
  FirstFixingChangedYN: string='N';
  custPremDirection: any='';
  IBPremDirection: any='';
  GetPriceProviderDetailsSubscription: Subscription;
  AltNotional: any;
  IsAdvisoryLoggedIn: boolean=false;
  FXDOptionCutSubscriber: Subscription;
  FXDFirstFixingDateSubscriber: Subscription;
  PersonalDefaultValueSubscriber: Subscription;
  NoofSettChangeYN: any='N';
  OrderPlaceFlag: boolean=false;
  ScheduleXML: string='';
  ScheduleDescription: string;
  DealerRemark: any;
  FXD_RFQDealDetailsNavigateSubscriber:any;
  RFQDetailsFromNoteMasterSubscrber:any;
  NoteToUnblock: any;
  UnlockMsg: any;
  TenorFromFixingSubcriber: any;
  ccy1:boolean=false;
  ccy2:boolean=false;
  AllAPIsLoaded: boolean=false;//Urmila A | LGTGTWINT-1295 | 1-Feb-23 
  currentTheme: string;
  IBPremComment: string; //Urmila A | 16-feb-23 | LGTCLI-314
  IsNavigate: boolean=false; //Urmila A | 17-Feb-23
  scheduleBtnClick: boolean=false;
  TargetBF: any; //Urmila A | LGTGTWINT-1447 |21-feb-23 
  MaxClientvalue: any;
  MaxClientSub: Subscription;
  SampleArray: any[]=[];
 
  // Gaurav M || For moveable func of view schedule
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  //added by UrmilaA, LGTGTWINT-1947 | 3-May-23 |start
  finalPaySub:Subscription;
  fixingAdjSub:Subscription; 
  targetTypeSub:Subscription;
  TargetTypes:any[]=[]
  selectedTargetType:any='';
  LPname: any;
  //added by UrmilaA, LGTGTWINT-1947 | 3-May-23 | ends

  DCDRfqId:any='';
  SpreadRounding: any;
  PremDecimal: any;
  IBPremNotionalDecimal: any;
  TradeDate: any;   //Start :: F5SAAINT-2297 || RizwanS || 30 Jan 2024
  selectedCustomerSubscription: any;
  showPremAmt: any;
  @HostListener('document:keydown', ['$event'])
  //Added by Urmila A | 9-Jan-23 | start | for checking screen width , height

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('Width:',this.getScreenWidth, 'Height',this.getScreenHeight)
  }

  //Added by Urmila A | 9-Jan-23 | end
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
        this.FXBestPrice();
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
  pivotModel: PivotModel;
  CustomerName: string;

  // Urmila A | 16-Nov-2022 | Start
  FXCurrencyPairsubscription: any;
  TenorDayssubscription: any;
  FXDatesCalculationsubscription: any;
  FXPriceProvidersubscription: any;
  Bestpricesubscription: any;
  BookOrdersubscription: any;
  productInfoSubscriber: any;
  GetTenorSubscriber: any;
  getBidaskSubscriber: any;
  FXDProductDetailsSubscriber: any;
  FXDContractSummSubscriber: any;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: Subscription;
  FXDRouteToDealerSubscriber:Subscription;
  firstFixChngAndDatesReceived:boolean = false;
  FXDGetNoofSettSubscriber:Subscription;
 // Urmila A | 16-Nov-2022 | End

  Errormsg: string = '';
  LoadingPivotFlag: boolean = false;
  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
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
  XMLString: string = '';
  IsRMLoggedIn: boolean = false;
  IsRouteToDealerExecuted: boolean = false;
  selectedCustomerDetails: any=[]=[];
  CustomerID: string = '';
  // CustomerName: any = ""; Done obo Gaurav M || by Taran || 13-DEC-2023
  Remark: string;
  PriceproviderArr:any[]=[]
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
    tenor: true, //Urmila A | 18-feb-23
    priceprovider: false,
    bidask: false,
    datecalculation: false,
    firstfixingdate: false
  };
  firstTimeExecuted: boolean = false;
  d = new Date();

  maxClientProfitCcy1: any;
  maxClientProfitCcy2: any;

  // EntityData:any[] = []; //Urmila A | 8-feb-23 | LGTGTWINT-1359 //commented by UrmilaA, LGTGTWINT-1898 | 24-april-23
  UpfrontVal:any=0;
  Pair_Cross_YN:any;
  Left_USD_Pair:any;
  Right_USD_Pair:any;
  LeftUSDMidrate:any;
  RightUSDMidRate:any;
  SpotMidRate:any;
  QuoteMailSent: boolean=false;
  QuteMailClicked:boolean=false;
  FixingSettChngYN: any='N';
  ExceptionWarningMsg:any='';
  CustPAN:any='';
  routeToDealerClicked:boolean=false;
  routeToDealerClickedloader : boolean = false  //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
  confirmedRouteDealer:boolean=false;
  OrderClicked: any=false;
  IBPremToggle: boolean=false;
  closeQuoteMail: boolean=false; //urmila A | 13-feb-23

  //---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29
  SaveTradeEnabledFlag : boolean = false
  SaveTradeLoader : boolean = false
  disabledRoutetodealeronSaveTrade : boolean = false
  SavetradePopup : boolean = false
   //---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTCLI-29

  @Input() RFQDetailsFromBlotterYes_QueueStatus:any;
  ExecutedQueue:boolean=false;
  NewOrderfromRMLocked:boolean=false;
  NewOrderfromRMUnlocked:boolean=false;
  TradeIdea:boolean=false;
  ExpiredTradeIdea:boolean=false;
  RejectedOrder:boolean=false;
  FXDRefDetailsSubscriber:any;
  OriginalIBPremPer:any;
  RouteFromWorkflow:boolean=false;
  Parant_DCDRFQID:any=''; //Urmila , 30-mar-23
  DI_YN:any=''; //Urmila , 30-mar-23
  PriceRecAfterRepricefromBlotter:boolean=false;
  BlotterRFQ:any;
  RejectSubscriber:any;
  RejectRedirectedOrder:boolean=false;
  RejectedOrderMSG:any='';
  DealerLoggedIn:boolean=false;
  unlockNotemasterSubscriber:any;
  unlockNoteMasterYN:boolean=false;
  unlockFlag:boolean=false;
  LockedDealPopUp:any=false;
  RFQLockedBy:any;
  RFQLockedSecLeft:any;
  RFQLockedInterval:any;
  ClearLPs:boolean=false;
  DIfromTradeIdea:any='';
  NotionalToggle: boolean=false;
  CurrencyChanged:boolean=false; //Added by Urmila A | 7-Jan-23
  public getScreenWidth: any; //Added by Urmila A | 9-Jan-23
  public getScreenHeight: any; //Added by Urmila A | 9-Jan-23
  CcySearch: any = ''; //Added by Urmila A | 11-Jan-23
  RMRemarkVisibility:boolean=false; //Urmila A | LGTCLI-294
  ClientPremDir:any=''; //UrmilaA | 13-feb-23 | LGTCLI-304
  PriceRecvFromLPs:any=0; //UrmilaA | 16-feb-23 | LGTCLI-315
  ResetAllfieldsCalled: boolean=false; //Urmila A | LGTGTWINT-1332 | 4-mar-23
  NDFFlag: string='N';
  isMetal: string='N';
  RouteFromQuoteHistory:boolean=false; //urmila A, 30-mar-23
  noResponseRecv: boolean=false;  //LGTGTWINT-1774, 29-Mar-23, Urmila A
  prevFirstFixingDate:any=''; //urmila A, 5-april-23, LGTGTWINT-1846
  OrderRejectedMsg:any=''; //UrmilaA, 17-april-23, LGTCLI-411
  ITMValue: any=0; //added by UrmilaA, LGTGTWINT-1953 | 5-May-23
  NoofKOEvent:any=0  // Added  by UrmilaA, 5-May-23 | LGTGTWINT-1953

  //Button visibility checks  | added by Urmila A | LGTGTWINT-1455 | 21-Feb-23
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
  ShownSignalRPriceQuotes:any[]=[]; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  saveRes:any=[];// Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  SignalR_unsubscriber:boolean=false;// Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  MaxQuotePriceCame:boolean=false;// Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
  btnEnable:boolean=false;
 
  //LGTGTWINT-2110| UrmilaA |9-june-23| start
  MinMaxTimer:any=0;
  MinInterval:any;
  maxInterval:any;
  MinTimeput:any;
  MaxTimeout:any;
  //LGTGTWINT-2110| UrmilaA  ends

  //LGTGTWINT-1895 | UrmilaA | start
  FixingFreqArr:any[]=[]
  fixingSubscriber:Subscription;
  //LGTGTWINT-1895 | UrmilaA | ends

  //LGTGTWINT-2109| UrmilaA | 9-june-23|start
  PriceClick:boolean=false;
  priceLoader:boolean=false;
  //LGTGTWINT-2109| UrmilaA | ends

  NoOfObservations:any;  // LGTGTWINT-2283 | Chaitanya M  | 28 Aug 2023

  //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |start
  isQENMode:boolean=false;
  isSENMode:boolean=false;
  //added by UrmilaA | (Usertype checks replaced with Mode)|31-Aug-23 |ends

  // START - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForOptions = []; 
  SelectedSolveFor : any;  
  SolveFor : any; 
  SolveforStrike : boolean = false; 
  Pivot_value:any; // LGTGTWINT-2832 | Chaitanya M | 21 Nov 2023
  // END - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023

  // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  UseFinSPL:any;
  FinSPLFilePath:any;
  public FXDFinSPL: Subscription;
  // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 

  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024

  PreminPipsToggle :any; // Added By Anmol B || 19-Apr-2024 || EFGUPINT-
  ShowPriceProvider:boolean;
  showPPDropdown:boolean;
  
  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024

  constructor(public Home_api: HomeApiService, public FXD_cfs: FxdCommonfunctionsService, public FXD_afs: FxdApifunctionService, 
    public Author_api: AuthService, private datepipe: DatePipe,public sanitize :SanitizeHtmlPipePipe, public themeService: ThemeserviceService,
    public CustAPI: CustomerApiService, //Urmila A | LGTGTWINT-1455 | 21-feb-23
    public SignalR : FXDSignalRService //UrmilaA, LGTCLI-361 | 17-May-23
   
    ) {
    this.pivotModel = new PivotModel();
    //this.CustomerName = 'LGT-CUST001';
   
  }


  ngOnDestroy() {
    this.Errormsg='' //Urmila A | 22-Nov-23
    this.closeSignalR() //UrmilaA, 22-May-23,LGTGTWINT-1147
    //UrmilaA, 17-May-23, LGTCLI-361 | start
    if(this.SignalRsubscriber){  
      this.SignalRsubscriber.unsubscribe()
    }
    if(this.CancelSignalRconnectionSub){  //UrmilaA, 17-may-23, LGTCLI-361
      this.CancelSignalRconnectionSub.unsubscribe()
    }  
  
    //UrmilaA, 17-May-23, LGTCLI-361 | ends

    this.DestroyFn()
    this.fnUnsubscribeAllCalls()
    
    // if(this.unlockNotemasterSubscriber){
    //   this.unlockNotemasterSubscriber.unsubscribe();
    // }
   
  }

  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 17-May-23 | start
  resetSignalRPrice(){
    this.pivotModel.PricingServiceResponse=null;
    this.FXD_afs.RFSRes.next(this.pivotModel.PricingServiceResponse) 
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
    this.ClearLPs=true;
    this.OrderPlaced = false
    this.OrderPlacedPopup =false;
    this.OrderPlaceFlag=false;
    this.scheduleBtnClick=false;
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 | 
    // this.RouteFromWorkflow=false;
    this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
      navigate: false, 
      ProdcutCode: '',
      ReFNo:"",
      ProductID: '',
      redirectFrom: '' //Urmila A, LGTGTWINT-1758, 30-mar-23
    })
    if(this.FXD_RFQDealDetailsNavigateSubscriber){
      this.FXD_RFQDealDetailsNavigateSubscriber.unsubscribe();    
    }
    if(this.RFQDetailsFromNoteMasterSubscrber){
      this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
    }
    this.fnUnsubscribeAllCalls()
  }
  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 17-May-23 | ends
  
  fnUnsubscribeAllCalls(){
    if(this.unlockNotemasterSubscriber){
      this.unlockNotemasterSubscriber.unsubscribe();
    }
    if(this.RouteFromWorkflow){
      this.fncallUnlockDeal();
    }
    if(this.FXDProductDetailsSubscriber){
      this.FXDProductDetailsSubscriber.unsubscribe();     
      this.FXDProductDetailsSubscriber=null;
    }
    if(this.productInfoSubscriber){
      this.productInfoSubscriber.unsubscribe(); 
    }
    if(this.FXDEntitySubscriber){
      this.FXDEntitySubscriber.unsubscribe()
    }
    if (this.FXPriceProvidersubscription){
      this.FXPriceProvidersubscription.unsubscribe();
      this.FXPriceProvidersubscription=null;
    }
    if (this.FXCurrencyPairsubscription){
      this.FXCurrencyPairsubscription.unsubscribe();
      this.FXCurrencyPairsubscription=null;
    } 
    if(this.getBidaskSubscriber){
      this.getBidaskSubscriber.unsubscribe()
    }
    if (this.TenorDayssubscription){
      this.TenorDayssubscription.unsubscribe();
    } 
    if (this.FXDatesCalculationsubscription){
      this.FXDatesCalculationsubscription.unsubscribe();
      this.FXDatesCalculationsubscription=null;
    }
      
    if (this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
    if (this.BookOrdersubscription){
      this.BookOrdersubscription.unsubscribe()
    }   
    if (this.GetPriceProviderDetailsSubscription){
      this.GetPriceProviderDetailsSubscription.unsubscribe();
    }   
    if(this.GetTenorSubscriber){
      this.GetTenorSubscriber.unsubscribe()
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
      this.FXDGetNoofSettSubscriber.unsubscribe();
    }
    if(this.TenorFromFixingSubcriber){
      this.TenorFromFixingSubcriber.unsubscribe()
    }
    if(this.pivotModel.BookOrdersubscription){
      this.pivotModel.BookOrdersubscription.unsubscribe()
    }
    if(this.PersonalDefaultValueSubscriber){
      this.PersonalDefaultValueSubscriber.unsubscribe()
    }
    if(this.FXDRouteToDealerSubscriber) {
      this.FXDRouteToDealerSubscriber.unsubscribe()
    }
    if(this.RFQDetailsFromNoteMasterSubscrber) {
      this.RFQDetailsFromNoteMasterSubscrber.unsubscribe()
    }
    if(this.RejectSubscriber){
      this.RejectSubscriber.unsubscribe()
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

  ngOnInit(): void {

    this.fnSetEntity();   //UrmilaA, 3-May-23 | LGTGTWINT-1949
   

    // this.themeService.themeObs.subscribe((themeres) => {
    //   this.currentTheme = themeres;
    // });

    //added by UrmilaA | (Usertype checks replaced with Mode)|1-Sep-23 |start
     if(this.FXD_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }else if(this.FXD_cfs.fngetMode() == 'SEN'){
      this.isSENMode=true;
      this.ShowPriceProvider = true;
      this.showPPDropdown = true;
    }
    //added by UrmilaA | (Usertype checks replaced with Mode)|1-Sep-23 |ends


    this.getScreenWidth = window.innerWidth; //Added by Urmila A | 9-Jan-22
    this.getScreenHeight = window.innerHeight;  //Added by Urmila A | 9-Jan-22
  

     this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res=>{
      if(res === false){
            this.pivotModel.ViewScheduleflag = false
      }else{
          this.pivotModel.ViewScheduleflag = true
      }
    });
    // Urmila A | check View schedule pop-up visibility | end

    //Urmila A | Workflow Deal details | LGTGTWINT-561 | start
    this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes:any)=>{
          try{

              //modified by Urmila A, 30-Mar-23 | LGTGTWINT-1758 | start
              if(navigateRes.navigate === true && (navigateRes.ProdcutCode === 'PIVOT' || navigateRes.ProdcutCode === 'Pivot')){
                this.IsNavigate = true;
                console.log('navigate res:',navigateRes);
                this.fnResetpricingFlags(); //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
                 //Mode changes done by Urmila A, 6-april-23 | LGTGTWINT-1758 (mention in comment)
                this.Mode = navigateRes.redirectFrom === 'blotter' ?  this.FXD_cfs.fngetMode() : 'QEN'; //Urmila A | 15-Feb-23 | LGTCLI-286

                  this.RFQDetailsFromNoteMasterSubscrber = this.FXD_afs.FXDGetRFQDetailsFromNoteMasterIDAPI(navigateRes.ReFNo, this.FXD_afs.UserName,this.Mode) //API req modified by Urmila A | 21-Aug-23 | Core migration 
                  .subscribe((res:any)=>{
                          try{
                            if( res !== null){
                                console.log('RFQ from Note master: ',res,'RFQDetailsFromBlotterYes_QueueStatus',this.RFQDetailsFromBlotterYes_QueueStatus);
                                if(res.length === undefined){

                                    if(navigateRes.redirectFrom === 'blotter'){
                                          this.DI_YN = 'N';
                                          this.Parant_DCDRFQID = '';
                                          this.pivotModel.NoteMasterID = '';
                                          this.NoteToUnblock = navigateRes.ReFNo;
                                          switch(this.RFQDetailsFromBlotterYes_QueueStatus){
                                            case 'Executed Orders':
                                              this.ExecutedQueue=true;                              
                                              break;
                                            case 'Trade Idea':
                                              this.TradeIdea=true;
                                              this.DI_YN = 'Y';
                                              this.DIfromTradeIdea = 'Y';
                                              this.Parant_DCDRFQID = res.ParentRFQNumber;                                
                                              break;
                                            case 'Expired Trade Idea':
                                              this.ExpiredTradeIdea =true;                                  
                                              break;
                                            case 'New Order from RM':
                                              if(res.LockStatusMsg === '' ){
                                                  this.NewOrderfromRMUnlocked=true;
                                                  if(res.DI_YN === 'N'){
                                                      this.DI_YN = 'N';
                                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                                      this.pivotModel.NoteMasterID = navigateRes.ReFNo;                                                                                
                                                  }
                                                  this.fnRFQLockerForTimer();
                                              }else if(res.LockStatusMsg !== '' && !res.LockStatusMsg.includes(this.FXD_afs.UserName)){
                                                  this.NewOrderfromRMLocked =true;
                                                  if(this.DI_YN === 'Y'){
                                                      this.DI_YN = 'Y';
                                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                                      this.pivotModel.NoteMasterID = navigateRes.ReFNo;                                          
                                                  }                                    
                                                  this.LockedDealPopUp=true;
                                              }else if(res.LockStatusMsg !== '' && res.LockStatusMsg.includes(this.FXD_afs.UserName)){
                                                this.NewOrderfromRMUnlocked=true;
                                                this.DI_YN = res.DI_YN;
                                                this.Parant_DCDRFQID = res.ParentRFQNumber;
                                                this.pivotModel.NoteMasterID = navigateRes.ReFNo;                                   
                                                this.fnRFQLockerForTimer();
                                              }
                                              break;
                                            case 'Rejected Orders':
                                              this.RejectedOrder=true;                               
                                              break;
                                          }
        
                                          this.RMRemarkVisibility = this.FXD_cfs.fnRMremarkVisibility(
                                          this.RFQDetailsFromBlotterYes_QueueStatus) //Urmila A | 13-feb-23 | LGTCLI-294  
                                          this.RouteFromWorkflow = true;
                                         
                                    
                                    }else if(navigateRes.redirectFrom === 'quotehistory'){
                                        this.RouteFromQuoteHistory=true;  
                                    }
                                  this.fnAssignDataLoadValues();
                                  this.fnSetRFQDetailsFromNotemasterID(res);
                                  this.fnButtonVisibility();   //Urmila A | 28-feb-23 | LGTGTWINT-1455
                                  this.fnGetProductConfig(); //UrmilaA | 30-May-23 | LGTCLI-361 | case- Notification pop-up even after price received
                                  // this.fnGetProductDetails();
                                }
                            }else if(res == null){
                              this.NotificationFunction("Error","Error" , res )
                            }
                               
                          }catch(err) {
                             //throw err // Commented By Ketan S due to Interceptor stability issue
                            }
                    })
                 
              }else if(navigateRes.navigate === undefined || navigateRes.navigate === false){
                  // this.fnGetProductDetails();   
                  // this.fnDefaultValues();
              }
              //modified by Urmila A, 30-Mar-23 | LGTGTWINT-1758 | end
          }catch(err) {
            // throw err // Commented By Ketan S due to Interceptor stability issue
            }
    })
   
    //Urmila A | Workflow Deal details | LGTGTWINT-561 | end

    //Added by Urmila A, 16-may-23, LGTCLI-361 - start
    this.SignalRsubscriber = this.FXD_afs.FXDSignalRBroadcastMsgObs.subscribe((BroadCastMsg:any)=>{
    try{
          if(BroadCastMsg !== null && BroadCastMsg.length > 0){ // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
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

    if(!this.IsNavigate){
        // this.getEntityData() //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
        console.log('in Pivot details from parent:', this.Product_ID,this.Product_Code,
        this.Product_Name, this.Template_Name, this.TemplateCode)
        this.fnDefaultValues();
        this.fnButtonVisibility(); //Urmila A | 28-feb-23 | LGTGTWINT-1455
        this.pivotModel.Product_ID = this.Product_ID;
        this.pivotModel.Product_Code = this.Product_Code;
        this.pivotModel.Product_Name = this.Product_Name;
        this.pivotModel.TemplateCode = this.TemplateCode;
        this.pivotModel.TemplateID = this.TemplateID;
        if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
          this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
            this.fnGetProductConfig(); //Added by UrmilaA, 18-May-23, fnGetProductConfig | LGTCLI-361 
          this.AllDataLoaded.productDetail = true;
          this.fnGetProductConfig(); //Added by UrmilaA, 9-May-23, fnGetProductConfig | LGTCLI-361 
         
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
            this.AllAPIsLoaded=true;
          }    
          this.getTargetType() //UrmilaA, 17-May-23
          this.getFinalPaytype()   //added by UrmilaA, LGTGTWINT-1947 | 3-may-23
         
          this.fnGetPriceProviderLPs(this.pivotModel);  
          this.fnGetPriceProviderandCcypairs(this.pivotModel);
          this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
      }else{
          this.fnGetProductDetails(); 
      }     
    }

    // this.fnGetProductDetails();  
    // this.fnDefaultValues();
    this.Home_api.CustomerId = '1';
    this.Home_api.CustomerName = 'LGT-CUST001';
    this.CustomerID = '1';
    this.LoadingPivotFlag=false;
  }


   //UrmilaA, 3-May-23 | LGTGTWINT-1949
   fnSetEntity(){
    console.log('coming entity data:', this.EntityData)
    // sessionStorage.setItem('FXD_EntityID', this.EntityData[0].code)  //mapping modified by Urmila A | 29-Aug-23
    // this.FXD_afs.SetCredentials() 

    //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
    if(this.EntityData[0].code === '50'){
      this.Home_api.CustomerId =   '50';
      this.Home_api.CustomerName = 'CustomerPB';             
     }//end

}


  //added by Urmila A, 30-Mar-23 , start
  fnAssignDataLoadValues(){
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;
    this.AllDataLoaded.firstfixingdate = true;
    this.OrderPlacedPopup=false;
    this.AllDataLoaded.datecalculation = true; //Urmila A | 2-Feb-23 | LGTGTWINT-1295
    this.OrderPlacedPopup=false;
  }//end

   //Added by Urmila A, 16-May-23 | LGTCLI-361 | start
 fnGetProductConfig(){
  //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
  this.fxdProdCofigSubsriber = this.FXD_afs.FXDGetProductConfigsAPI(this.FXD_afs.UserName,
  this.Product_ID).subscribe((res:any)=>{
    try{
          if(res ){  
            console.log('product config res=> ', res)          
            res=res.Configs 
            if(res !== null || res.length > 0){ //conditions modified by Urmila A | 28-Aug-23
                res?.forEach(element => {
                      if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
                        this.MaxQuoteTimeout = element.Value
                        console.log('MaxQuoteTimeout=> ', element.Value)
                      }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
                        this.MinQuoteTimeout = element.Value
                        console.log('MinQuoteTimeout=> ', element.Value)
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
            }else if(res == null){ //conditions modified by Urmila A | 28-Aug-23
              this.MinQuoteTimeout = '30';
                this.MaxQuoteTimeout = '90';
                this.UseFinSPL = "NO"; // Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                this.FinSPLFilePath = ""; // Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                this.showtermsheetRM = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
                this.showtermsheetDealer = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
          } 
           
          }
    }catch(err) {console.log(err)}
  })
}
//Added by Urmila A, 16-May-23 | LGTCLI-361 | ends



  //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23 | start
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
               //fngetCommondata added by Urmila A | 29-Aug-23
                    this.CommomDataSubscriber = this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
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
                      res = res.cvpData;
                      res.forEach(element => {
                        if (chkRoute.toUpperCase() === element.DATA_VALUE.toUpperCase()) {                                                           
                              if(element.Misc1.split(',').includes(sessionStorage.getItem('FXDgroupID'))){
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

  // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 16-Dec-22
  fnSetRFQDetailsFromNotemasterID(data){
        
    this.Product_Code = this.pivotModel.Product_Code = data.Product_Code;
    this.Product_Name= data.Product_Name
    this.Product_ID = data.Product_Id;
    this.pivotModel.AltCcy = data.Alternate_Ccy;
    this.pivotModel.DepCcy = data.Deposit_Ccy;
  
    //this.SpotMidRate = (Number(data.Ask_Rate) + Number(data.Bid_Rate) / 2).toFixed(2) //Added by Urmila A | LGTCLI-246 | 11-Jan-23
    this.custPremDirection = data.CustPayReceiveDir;
    this.CcySearch = this.pivotModel.CurrencyPair = data.Deal_Pair;  //Added by Urmila A | 11-Jan-23
    this.fnPointShift(this.pivotModel,data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23
    this.pivotModel.NotionalPerFixing= this.FXD_cfs.numberWithCommas(data.NotionalPerFixing ? data.NotionalPerFixing : '');
    this.pivotModel.SelectedFixingSettFreq= data.Frequency;      

    //Added for Frequency not visible  after routing from blotter | Chaitanya M | 27 july 2023
    let frequency = data.Frequency
    this.FixingFreqArr.push(frequency);
    this.pivotModel.SelectedFixingSettFreq=this.FixingFreqArr[0];
    //End
    
    // LGTGTWINT-2213 | Added By Chaitanya M | 31 July 2023
    let _KOtype = data.TargetType
    this.TargetTypes.push(_KOtype);
    this.pivotModel.SelectedKOType = this.TargetTypes[0]; 
    
    // Start - LGTGTWINT-2267 | Chaitanya M | 03 Aug 2023 | ITM Target mapping missing on deal opened from blotter
    this.NoofKOEvent = data.Target;     
    this.pivotModel.TargetPips = data.TargetInPips;  //Urmila A | LGTGTWINT-1447 |21-feb-23    
    this.TargetBF =data.TargetInBF;  //Urmila A | LGTGTWINT-1447 |21-feb-23 
    //End  

    //End
        
    this.pivotModel.NoOfSett = data.NoOfSettlement;
    this.pivotModel.SelectedKIStyle = data.KIType === 'No' || data.KIType === '' ? 'No' : 'Yes';
    this.pivotModel.Leverage = data.Leverage;
 
    let entity = {
      Code: data.Entity_ID,Value: data.Entity_Name
    }
    this.EntityData.push(entity);
    let optioncut =data.OptionCut
    this.pivotModel.OptionCutOptions.push(optioncut);
    this.BlotterRFQ = data.ParentRFQNumber;

    //added by Urmila A, 4-april-23 | LGTGTWINT-1824 | to update dates only when routed from workflow
    if(this.RouteFromWorkflow){
      this.pivotModel.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.pivotModel.PremiumDate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.pivotModel.FixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date);
      this.pivotModel.MaturityDate = this.FXD_cfs.convertDate(data.Deposit_End_Date);
      this.prevFirstFixingDate =  this.pivotModel.FirstFixingDate = this.FXD_cfs.convertDate(data.FirstFixingDate); //added this.prevFirstFixingDate bu Urmila A, 5-april-23
    }else{
      this.pivotModel.TradeDate = this.FXD_cfs.convertDate(new Date())
    }
   
    this.pivotModel.OptionCut =data.OptionCut;
    this.pivotModel.TenorDays =data.Option_Days;
    this.pivotModel.Tenor = data.Input_Tenure;
    this.pivotModel.TenorOptions.push(data.Input_Tenure)
    this.pivotModel.Notional = this.FXD_cfs.numberWithCommas(data.OptionNotional ? data.OptionNotional : '');
    this.pivotModel.NotionalCCY = data.Deposit_Ccy;
    this.pivotModel.IBPremCCY=data.RFQ_Prem_Ccy;
    this.pivotModel.UpfrontPer = parseFloat(data.Spread_PA).toFixed(4); //upfront //Added by UrmilaA | LGTGTWINT-2061 | 5-June-23
   
    // this.pivotModel.UpperStrike = data.UpperStrike; // LGTGTWINT-2213 | Commented By Chaitanya M | 31 July 2023
    // this.pivotModel.LowerStrike = data.LowerStrike; // LGTGTWINT-2213 | Commented By Chaitanya M | 31 July 2023

    // LGTGTWINT-2213 | Commented By Chaitanya M | 31 July 2023
    // if(data.RFQ_Deal_Dir === "S"){

    //   this.pivotModel.AskRate = data.Ask_Rate;
    //   this.pivotModel.BidRate = data.Spot_Rate;
      
    // }else{
    //   this.pivotModel.AskRate = data.Spot_Rate;
    //   this.pivotModel.BidRate = data.Bid_Rate;
    // }    
    // this.pivotModel.Pivot = data.Strike_Rate;
    //End
    
    if(data.RFQ_Mkt_Prem_Amt1.includes(',')){ //Added by Urmila A | 9-Jan-23 | LGTGTWINT-890 |
      this.pivotModel.IBPremium = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1 ? data.RFQ_Mkt_Prem_Amt1.replaceAll(',',''): '').toFixed(2) );
    }else{
      this.pivotModel.IBPremium = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt1).toFixed(2));
    }
    // this.pivotModel.IBPremPer = data.RFQ_Mkt_Prem_Amt1;
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2));  //upfront in Alt ccy
    this.pivotModel.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2)); //upfront in USD
    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");
    this.ContractSummary = this.sanitize.transform(data.Contract_Summary.toString().replaceAll("\color:black","color:var(--btn-bg) !important"));
   
    if(data.Contract_Summary === ''){
      this.ContractSummary=''
    }
    this.RMRemark = data.RM_Remark;

    //Urmila A | Dealer remark visibility check | 24-feb-23 | LGTGTWINT-1504
    if(!this.TradeIdea){
      this.DealerRemark = data.Dealer_Remark; 
    }else if(this.TradeIdea){
      this.DealerRemark = '';
    }
    
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila a | 16-feb-23 | LGTCLI-314
    // this.pivotModel.SelectedLPForPrice = this.SampleArray[Number(data.RFQ_Price_Provider_ID)];
    this.OriginalIBPrem = Number(data.ParentRFQIBPremium.toString().replace(',','')).toFixed(2); //Added by Urmila A | 12-Jan-23 | LGTGTWINT-1018
    this.OriginalIBPremPer = data.Market_Premium_PC;
  
   
    if(data.FinalPayType === 'No Payment'){ data.FinalPayType = 'None' }
     //UrmilaA, 29-May-23 | LGTGTWINT-1947 - hotfix | start
     data.FinalPayType ? this.pivotModel.FinalPayType.push(this.FXD_cfs.TitleCase(data.FinalPayType)) : ''
     this.pivotModel.SelectedFinalPayType = data.FinalPayType ? this.FXD_cfs.TitleCase(data.FinalPayType) : '';
     data.AdjustedType ? this.pivotModel.FixingAdjustment.push(data.AdjustedType) : ''
     this.pivotModel.SelectedFixingAdjustment = data.AdjustedType ? data.AdjustedType : '';
     //UrmilaA, 29-May-23 | LGTGTWINT-1947 - hotfix | ends
    this.DealingRFQID = data.ParentRFQNumber;
    this.RFQLockedBy = data.LockStatusMsg;
    if(!this.ExecutedQueue){
      this.fnGetProductDetails()   //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      this.fnGetPriceProviderLPs(this.pivotModel)
      this.fnGetOptionCutFXD(this.pivotModel);    
      this.getTargetType() 
      this.getFinalPaytype()   //added by UrmilaA, LGTGTWINT-1947 -hotfix | 29-may-23 
      this.fnGetFixingFreq(); //UrmilaA | LGTGTWINT-1895 | 5-July-23
      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory){
        this.pivotModel.NoteMasterID=''
        this.FirstFixingChangedYN='N'
        this.pivotModel.FirstFixingDate='';
        this.fnGetDatesCalculationforVB()
      }
    }
    this.fnGetProductConfig(); 
 
}
// Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 16-Dec-22
 

//Added by Urmila A | RFQ Deal details Unlock deal | 20-Dec-22 
closeLockedDeal(){
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


ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.pivotModel.Product_ID = this.Product_ID;
    this.pivotModel.Product_Code = this.Product_Code;
    this.pivotModel.Product_Name = this.Product_Name;
    this.pivotModel.Mode = this.Mode;
    this.pivotModel.UserGroup = this.UserGroup;
    this.pivotModel.PricingMode = this.PricingMode;
    // this.pivotModel.AppMode = this.AppMode;
  }

  fnGetProductDetails(){
    try {
      this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
       //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
        this.FXDProductDetailsSubscriber = this.FXD_afs.fnGetProdDetailsFXD( this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
          if (res !== null) { //mappings modified by Chaitanya M | 29-Nov-23
            res = res[0];
            this.AllDataLoaded.productDetail=true;
            this.pivotModel.TemplateCode = res.Template_Code;
            this.pivotModel.Product_Name = this.Product_Name =res.Product_Name;
            this.pivotModel.TemplateID = res.Template_Id;
            this.pivotModel.Product_ID = this.Product_ID = res.Product_Id;
            this.pivotModel.Product_Code = this.Product_Code = res.product_code
            // this.fnGetProductInfo()
            // !this.RouteFromWorkflow
            if(!this.IsNavigate){  //Urmila A | 29-mar-23
              this.fnGetPriceProviderandCcypairs(this.pivotModel);
              this.fnGetPriceProviderLPs(this.pivotModel);
              // this.fnGetTenor(this.pivotModel);
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
        this.productInfoSubscriber = this.FXD_afs.fnGetAllProductinfo(this.FXD_afs.EntityID,this.Mode,this.FXD_afs.UserName,this.Product_Code)
        .subscribe(res=>{
          try{
                if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetAllProductInfoResult)){
                  this.AllDataLoaded.productinfo = true;
                    res.GetAllProductInfoResult.ProductDetails.forEach(element => {
                        if(element.Product_Name === 'Pivot'){        
                          this.Product_Name = element.Product_Name;
                          this.Product_ID = element.Product_Id;
                          this.Product_Code = element.Product_Code;
                          // this.fngetPersonalDefaultValues();
                          //if(!this.RouteFromWorkflow)
                          if(!this.IsNavigate){ //Urmila a, 30-mar-23
                            this.fnGetPriceProviderandCcypairs(this.pivotModel);
                          }                        
                          this.getEntityData();
                          
                        }
                        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
                          this.AllAPIsLoaded=true;                      
                        }
                     }); 
                }
          }catch(err){}
        })
  }



  fnDefaultValues() {
    if (this.IsRMLoggedIn) {
      this.Home_api.CustomerId = '1';
      this.Home_api.CustomerName = 'LGT-CUST001';
    } else {
      this.CustomerName = this.Home_api.CustomerName;
    }
    // this.CustomerName = this.IsRMLoggedIn ? 'Virat' : this.Home_api.CustomerName;

    this.pivotModel.NotionalPerFixing = this.FXD_cfs.numberWithCommas("100,000.00");
    // this.pivotModel.Notional = parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * Number(this.pivotModel.NoOfSett);
    this.pivotModel.ViewScheduleflag = false;
    this.pivotModel.UpfrontPer=''
    this.pivotModel.FirstFixingDate='';
    this.FirstFixingChangedYN = 'N'
    this.pivotModel.UpfrontAlt=''; //changed by Urmila A  | 11-Jan-23
    this.UpfrontVal=''; //changed by Urmila A  | 11-Jan-23
    this.AltNotional=0;
    this.NoofSettChangeYN = 'N';
    this.FixingSettChngYN = 'N';
    this.RMRemark = '';
    this.firstFixChngAndDatesReceived=false;
    this.pivotModel.CurrencyPair = 'EUR - USD';
    this.pivotModel.DepCcy = this.pivotModel.CurrencyPair.substr(0, 3);
    this.pivotModel.AltCcy = this.pivotModel.CurrencyPair.substr(6, 8);
    this.pivotModel.DepCcy = this.pivotModel.CurrencyPair.split('-')[0].trim();
    this.pivotModel.AltCcy = this.pivotModel.CurrencyPair.split('-')[1].trim();
    this.pivotModel.IBPremCCY = this.pivotModel.DepCcy;
    this.pivotModel.NotionalCCY = this.pivotModel.DepCcy;   
    // this.pivotModel.Tenor = '12M'
    // this.pivotModel.TenorDays = 365;
    this.pivotModel.SelectedFinalPayType = 'Exact';//Urmila A | 2-Feb-23 | LGTCLI-288
    this.pivotModel.SelectedFixingAdjustment = 'Notional';//Urmila A | 2-Feb-23 | LGTCLI-288
    this.pivotModel.TargetPips=0;
    this.TargetBF=0; //UrmilaA | LGTCLI-425 | 29-Mar-23
    this.pivotModel.Leverage = 2;
    this.pivotModel.NoOfSett= '52'; //modified default settleFreq & Noofsett by Urmila A | LGTCLI-325 | 24-feb-23
    this.pivotModel.SelectedKIStyle = 'No';
    this.pivotModel.Notional = this.FXD_cfs.numberWithCommas(parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * Number(this.pivotModel.NoOfSett));
    this.pivotModel.NoteMasterID = '0';
    this.Parant_DCDRFQID='';
    this.DI_YN='N';
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
    this.RFQLockedBy ='';
    this.DealerRemark='';
    this.ccy1=false;
    this.ccy2=false;
    // this.ClearLPs = false; //commented by UrmilaA, LGTCLI-361 | 22-May-23
    this.maxClientProfitCcy1='';
    this.maxClientProfitCcy2='';
    this.pivotModel.Pivot = '';
    this.pivotModel.LowerStrike = '';
    this.pivotModel.UpperStrike = '';
    this.pivotModel.LowerKI = '';
    this.pivotModel.UpperKI = '';
    this.DIfromTradeIdea='';
    this.NoofKOEvent=0; //added by UrmilaA, LGTGTWINT-1953 | 8-May-23 | start
    clearInterval(this.RFQLockedInterval);
    this.CurrencyChanged=false; //Added by Urmila A | 7-Jan-23
    this.PreminPipsToggle = "%"; // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
    this.BestPricelbl =  'Best Price' //HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
  
  }

  ResetAllFields() {
    this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 17-may-23
    this.ResetAllfieldsCalled=true; //Urmila A | LGTGTWINT-1332 | 4-mar-23
    this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23
    if(this.pivotModel.BestPrice && this.pivotModel.PricingServiceResponse !== null){ //Urmila A | 4-Mar-23 | LGTGTWINT-1209  
      this.closeSignalR()   //added by UrmilaA, 17-May-23 | LGTGTWINT-1147
      this.pivotModel.NoteMasterID='';  //re-positioned by UrmilaA | LGTGTWINT-1147 | 5-June-23
    }
    this.fnSetAfterPriceValues(); //Added by UrmilaA | 13-June-23 | LGTGTWINT-2079
    this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 | 
    this.pivotModel.ClearPricingFlag = true;
    this.pivotModel.ClientPremium = '0.00';
    // this.pivotModel.IBPremium = '0.00';
    this.pivotModel.PricingMode.toUpperCase() !== 'MANUAL' ? this.pivotModel.IBPremium = '0.00' : '';
    this.pivotModel.PricingServiceResponse = '';
    this.pivotModel.BestPrice = '';
    this.pivotModel.BestPriceabs = 0;
    this.pivotModel.BestPriceProvider = '';
    this.pivotModel.ExternalRfqId = '';
    this.pivotModel.OrderPlaceFlag = false;
    this.pivotModel.Orderplace = '';
    this.LoadingPivotFlag = false;
    // this.pivotModel.PricingLoading = false; //UrmilaA | LGTGTWINT-2109
    this.Errormsg = '';
    this.pivotModel.DealNo = '';
    this.pivotModel.ViewScheduleflag = false;
    this.orderMsg=''
  
    // this.pivotModel.UpfrontAlt=''; //commented by Urmila A | LGTGTWINT-972
    // this.UpfrontVal=''; //commented by Urmila A | LGTGTWINT-972
    this.pivotModel.DCDRfqId='';
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.routeToDealerClicked=false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted =false;
    this.OrderClicked=false;
    this.firstFixChngAndDatesReceived=false;
  }

  //Added by UrmilaA | 13-June-23 | LGTGTWINT-2079| start
  fnSetAfterPriceValues(){
    this.pivotModel.UpfrontPer = '';
    this.pivotModel.UpfrontAlt = ''; 
    this.UpfrontVal = ''; 
   // this.pivotModel.IBPremium='0.00' // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023     
  }
  //Added by UrmilaA | 13-June-23 |LGTGTWINT-2079| ends

  TargetValueChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }
  }

  TargetValueLimitor(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }
  }

  fnLowerKIChng(e){
    this.pivotModel.LowerKI = Number(e.target.value).toFixed(this.pivotModel.StrikePointShift); //UrmilaA | 27-feb-23 |LGTGTWINT-1526
  }
  fnUpperKIChng(e){
    this.pivotModel.UpperKI = Number(e.target.value).toFixed(this.pivotModel.StrikePointShift); //UrmilaA | 27-feb-23 |LGTGTWINT-1526
  }
  Validations() {
    // if (this.CustomerName === '' || this.CustomerName === undefined) {
    //   this.Errormsg = 'Please Select Customer';
    //   return false;
    // } else {
    //   this.Errormsg = '';
    // }
    // Upper Barrier for notional value is as same as FXD pack
    // if (Number(this.NotionalAmt.replace(/,/g, '')) > 1000 && Number(this.NotionalAmt.replace(/,/g, '')) < 10000000000) {
    if (this.pivotModel.Notional === '') {
      this.Errormsg = 'Notional is blank';
      return false;
    } 

    //Added by Urmila A | 3-Mar-23
    if(this.pivotModel.CurrencyPair === ''){
      this.Errormsg = 'Please select currency pair.'
      return false
    }else {
        this.Errormsg='';
    }

    // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | start
    // else {
    //   if (this.pivotModel.DisableCCYChangeControl === true) {
    //     try {
    //       if (Number(this.pivotModel.Notional.toString().replace(/,/g, '')) >= 1) {
    //         this.Errormsg = '';
    //       } else {
    //         this.Errormsg = 'Notional below ' + this.pivotModel.NotionalCCY + ' 1 not allowed';
    //         return false;
    //       }
    //     } catch (ex) {

    //     }
    //   } else if (Number(this.pivotModel.Notional.replace(/,/g, '')) >= 100000) {
    //     this.Errormsg = '';
    //   } else {
    //     this.Errormsg = 'Notional below ' + this.pivotModel.NotionalCCY + ' 100k not allowed';
    //     return false;
    //   }
    // }
    // commented by Urmila A | LGTGTWINT-1200 | 24-Jan-23 | end
    if (
      Number(this.pivotModel.LowerStrike) > 0 &&
      Number(this.pivotModel.UpperStrike) > 0 &&
      Number(this.pivotModel.Pivot) > 0
    ) {
      this.Errormsg = '';
    } else {
      this.Errormsg =
        'Upper strike or lower strike or pivot strike cannot be zero';
      return false;
    }
    //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | start
    // if ( //uncommented by Urmila A | 31-Jan-23
    //   Number(this.pivotModel.LowerStrike) < Number(this.pivotModel.BidRate) &&
    //   Number(this.pivotModel.LowerStrike) > 0
    // ) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Lower strike rate should be less than Spot';
    //   return false;
    // }

    // if (Number(this.pivotModel.UpperStrike) > Number(this.pivotModel.BidRate)) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Upper strike rate should be greater than Spot';
    //   return false;
    // }
    // if (Number(this.pivotModel.Pivot) > Number(this.pivotModel.LowerStrike)) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Pivot strike should be greater than lower strike';
    //   return false;
    // }
    // if (Number(this.pivotModel.Pivot) < Number(this.pivotModel.UpperStrike)) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Upper strike should be greater than pivot strike';
    //   return false;
    // }
    //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | end
    if (this.pivotModel.SelectedKOType === 'Big Figure') { 
      if (Number(this.pivotModel.TargetPips) > 0) {
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Target cannot be zero or blank';
        return false;
      }
    }
    if (this.pivotModel.SelectedKIStyle.toUpperCase() !== 'NO') {

      if (!isNaN(Number(this.pivotModel.LowerKI)) && !isNaN(Number(this.pivotModel.UpperKI))) {
        if( this.pivotModel.LowerKI === ''){
          this.Errormsg = 'Lower KI cannot be blank';
          return false;
        }
        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | start
        // else if(this.pivotModel.LowerKI !== ''){  //uncommented by Urmila A | 31-Jan-23
        //   if (parseFloat(this.pivotModel.LowerKI) >= parseFloat(this.pivotModel.LowerStrike)) {
        //     this.Errormsg = 'Lower KI rate should be less than Lower strike';
        //     return false;
        //   }  else {
        //     this.Errormsg = '';
        //   }
        // }
        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | end
        if(this.pivotModel.UpperKI === ''){
            this.Errormsg = 'Upper KI cannot be blank';
            return false;
        }
        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | start
        // else if(this.pivotModel.UpperKI !== ''){ //uncommented by Urmila A | 31-Jan-23
        //   if (parseFloat(this.pivotModel.UpperKI) <= parseFloat(this.pivotModel.UpperStrike)) {
        //     this.Errormsg = 'Upper KI rate should be greater than Upper strike';
        //     return false;
        //   } else {
        //     this.Errormsg = '';
        //   }
        // }
        //commented by Urmila A | 23-Jan-23 | code side validations needs to removed discussed with Rahul P -LGTGTWINT-1165 | end

        // if (parseFloat(this.pivotModel.LowerKI) >= parseFloat(this.pivotModel.LowerStrike)) {
        //   this.Errormsg = 'Lower KI rate should be less than Lower strike';
        //   return false;
        // } else if (parseFloat(this.pivotModel.UpperKI) <= parseFloat(this.pivotModel.UpperStrike)) {
        //   this.Errormsg = 'Upper KI rate should be greater than Upper strike';
        //   return false;
        // } else {
        //   this.Errormsg = '';
        // }
      }
       else {
        this.Errormsg = 'Enter valid Lower KI and Upper KI';
        return false;
      }

    }

    //  else {
    //   if (Number(this.NoofKOEvent) > 0) {
    //     this.Errormsg = '';
    //   } else {
    //     this.Errormsg = 'ITM event cannot be zero or blank';
    //     return false;
    //   }
    // }
    // if (Number(this.AskSpot) > 0 && Number(this.BidSpot) > 0) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Spot rate cannot be zero or blank';
    //   return false;
    // }
    // if (this.TradeDate !== '' && this.Premiumdate !== '' && this.FinalFixingDate !== '' && this.FinalSettDate !== '') {
    //   this.Errormsg = '';
    // } else {
    //   return false;
    // }

    
    return true;
  }

  TradeSelectedLP(_SelectedLPDetails) {
    //unncesorry code removed by UrmilaA | 1-June-23 | LGTGTWINT-2067
    // this.pivotModel.BestPriceProvider = SelectedLPDetails.provider;
    // this.pivotModel.ExternalRfqId = SelectedLPDetails.quoteId;
    // this.pivotModel.BestPrice = SelectedLPDetails.price;
    // if (this.pivotModel.OrderDirection.toUpperCase() === 'BUY') {
    //   this.pivotModel.ClientPremium = (Number(this.pivotModel.Notional.replace(/,/g, '')) * (Number(this.pivotModel.BestPriceabs) + Number(this.pivotModel.UpfrontPer))) /
    //     100;
    // } else {
    //   this.pivotModel.ClientPremium = (Number(this.pivotModel.Notional.replace(/,/g, '')) * (Number(this.pivotModel.BestPriceabs) - Number(this.pivotModel.UpfrontPer))) /
    //     100;
    // }
    // this.pivotModel.PricingServiceResponse.forEach(element => {
    //   if(element.provider === SelectedLPDetails.provider){
    //     this.pivotModel.BestPrice = element.premiumAmount;
    //   }
    // });
    this.BookDeal(this.pivotModel);
  }


  BookDeal(modelClassObj) {
    this.OrderClicked=true;
    console.log('inside order booking')
    this.pivotModel.OrderPlaceFlag = true;
    let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)

    modelClassObj.BookOrdersubscription = this.FXD_afs.BookOrderforVBNew(
      // this.FXD_afs.EntityID,
      // this.FXD_afs.UserName,
      // this.FXD_afs.GetToken(),
      // modelClassObj.Product_Code,
      // this.FXD_afs.EntityID,
      // this.FXD_afs.UserName,    
      // modelClassObj.DCDRfqId,
      // modelClassObj.ExternalRfqId,
      // modelClassObj.BestPriceProvider,
      // this.Product_Code,       
      // modelClassObj.BestPrice !== '' &&
      // Number(modelClassObj.BestPrice) > 0
      // ? modelClassObj?.BestPrice
      // : '0',ActiveRemark

      this.FXD_afs.EntityID,
      this.FXD_afs.UserName,
      modelClassObj.DCDRfqId, //HSBCFXEINT-18 | Chaitanya M | 05 Dec 2023
      modelClassObj.ExternalRfqId.toString(),
      modelClassObj.BestPriceProvider,
      modelClassObj.Product_Code,
      modelClassObj.BestPrice !== '' &&
      Number(modelClassObj.BestPrice) > 0
      ? modelClassObj?.BestPrice
      : '0',
      ActiveRemark  // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023
   
    ).subscribe((res) => {
      const d1 = new Date();
      try {
        if (modelClassObj.Product_Name === 'Pivot') {        
          if (res) {
            this.OrderPlaced=true;
            if(res !== null) 
            {      
              this.FXD_cfs.DealBooked.next(false)             
              this.pivotModel.Orderplace = res.External_TradeID;
              this.pivotModel.DealNo = res.DealNo;
                if (res.isProcessCompleted === true) {              
                  this.OrderPlacedPopup = true
                  this.pivotModel.OrderPlaceFlag = false;
                  this.OrderClicked=false;
                  this.orderMsg= res.Message;          
                  modelClassObj.ClearPricingFlag = true;
                } else if(res.isProcessCompleted === false){
                  this.OrderPlaced=true;
                  this.OrderPlacedPopup = true
                  modelClassObj.Orderplace = '';
                  this.orderMsg= res.Message;
                } 
                try {
                  modelClassObj.ViewScheduleflag = false;
                } catch (ex) {

                }
            }        
            else
            {
              this.OrderPlaced = false
              this.pivotModel.OrderPlaceFlag = false;
              // Urmila A | LGTGTWINT-1225 | 31-Jan-23 | start
               //commented notificationFunction by Urmila A, 17-April-23 & added Order reject message for showing it on pop-up, LGTCLI-411
              if(res.ResponseTradeBookParameters.isOrderRejected === true && res.ResponseTradeBookParameters.RejectionReason !== ''){
                // this.NotificationFunction("Error","Error", 'Order rejected due to some technical reasons')
                this.OrderRejectedMsg = 'Order rejected due to some technical reasons'
              }else if(res.ResponseTradeBookParameters.RejectionReason !== '' && res.ResponseTradeBookParameters.External_TradeID === null && res.ResponseTradeBookParameters.isOrderRejected === false){
                // this.NotificationFunction("Error","Error", 'Order may have got executed or may have failed. Contact support')
                this.OrderRejectedMsg = 'Order may have got executed or may have failed. Contact support'
              }else{
                // this.NotificationFunction("Error", "Error", res.A_ResponseHeader.FailedReason )
                this.OrderRejectedMsg = res.A_ResponseHeader.FailedReason 
              } // Urmila A | LGTGTWINT-1225 | 31-Jan-23 | end
            }      
          }       
        }
        modelClassObj.OrderPlaceFlag = false;
      } catch (ex) {
        console.log(ex);
      }
      // this.loadflag = false;
    });
  }

  //Added by Urmila A |  17-april-22 | LGTCLI-411 | start
  fnCloseOrderRejPopup(){
    this.OrderRejectedMsg=''
  }
  //Added by Urmila A |  17-april-22 | LGTCLI-411 | end

  fnDisableTradebtn(e) {
    this.pivotModel.OrderPlaceFlag = e;
  }

  fnDisablePrembtn(e) {
    this.pivotModel.disabledPrembtn = e;
    // this.ResetAllFields();
  }

  fnDisableLoader(e){
    console.log('Global Loader flag',e)
    this.OrderClicked = e
  }


  FXBestPrice() {
    //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | starts
    this.PriceRecvFromLPs=0;  //UrmilaA, 22-May-23, LGTCLI-361
    this.fnResetpricingFlags(); //UrmilaA, 30-May-23, LGTCLI-361
    this.ClearLPs = true;
   
    //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | ends

    this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23

    if(this.pivotModel.PricingServiceResponseArray !== null){   
      this.OrderPlaced = false; //UrmilaA | LGTGTWINT-1446 | 24-feb-23
      this.pivotModel.BestPrice=null //UrmilaA | LGTGTWINT-1941 | 2-May-23
    }
    
    // this.RouteFromWorkflow 
    if(this.IsNavigate === true){
      this.PriceRecAfterRepricefromBlotter= true;
      this.pivotModel.NoteMasterID = this.NoteToUnblock
    }else{
      this.pivotModel.NoteMasterID ='0'
    }

    if (this.pivotModel.PricingMode === 'AUTO') {
      if (this.Validations() && this.Errormsg === '') {
        this.priceLoader=true; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
        // if(!this.RouteFromWorkflow)
        if(!this.IsNavigate){ //Urmila A, 30-mar-23
          this.ResetAllFields();
        }
        this.FXD_cfs.GenerateUserID(this.pivotModel);
        this.pivotModel.disabledPrembtn = true;
      
        if (this.pivotModel.NotionalCCY === this.pivotModel.DepCcy) {
          this.pivotModel.AltNotional = Number(this.pivotModel.Notional.replace(/,/g, '')) * Number(this.pivotModel.Pivot);
        } else {
          this.pivotModel.AltNotional = Number(this.pivotModel.Notional.replace(/,/g, '')) / Number(this.pivotModel.Pivot);
        }
        this.pivotModel.ClearPricingFlag = false;
        // this.pivotModel.PricingLoading = true; //added by UrmilaA, 30-may-23 | LGTCLI-361
        let KIStyle:any;
        if(this.pivotModel.SelectedKIStyle === 'Yes'){
          if(this.pivotModel.Leverage === 1){
            KIStyle = 'E-101'
          }else{ KIStyle = 'E-102' }
         }else{ KIStyle = 'No' } //Changed by Urmila A | 3-Mar-23 , as told by Hrishikesh M, Rahul P

         this.fnIsMetalInCcy(); // HSBCFXEINT-25  | Chaitanya M | 06 Dec 2023
      
        this.XMLString =
         //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
        //Added by Urmila A for UAT according req parameter changes
        // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
          //targetBF changes added by UrmilaA | LGTCLI-425 | 29-may-23 
          //<CustID>"+this.Home_api.CustomerId+"</CustID><Customer_Name>"+this.Home_api.CustomerName+"</Customer_Name>
        "<ExcelSheets><Sheet1><Product_Name>"+this.Product_Name+"</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><TargetInPips>"+(this.pivotModel.SelectedKOType === 'Big Figure' ? this.pivotModel.TargetPips : 0) +"</TargetInPips><TargetBF>"+this.TargetBF+"</TargetBF><TargetGainunit>"+ 
        this.pivotModel.SelectedKOType+"</TargetGainunit><NoofKOITMEvents>"+(this.pivotModel.SelectedKOType === 'ITM' ? this.NoofKOEvent : 0 )+
        "</NoofKOITMEvents><OptionCut>"+this.pivotModel.OptionCut+"</OptionCut><NonDeliveryYN>N</NonDeliveryYN><Freq>"+this.pivotModel.SelectedFixingSettFreq+"</Freq><FirstFixingDate>"+this.datepipe.transform(this.pivotModel.FirstFixingDate, 'yyyy-MM-dd')+
        "</FirstFixingDate><Currency1>"+this.pivotModel.NotionalCCY+"</Currency1><CcyPair>"+this.pivotModel.CurrencyPair +
        "</CcyPair><PremiumCcy>"+this.pivotModel.IBPremCCY+"</PremiumCcy><CustPrem></CustPrem><TradeDate>"+this.pivotModel.TradeDate +
        "</TradeDate><PremiumDate>"+this.pivotModel.PremiumDate+"</PremiumDate><FixingDate>"+this.pivotModel.FixingDate +"</FixingDate><SettDate>"+this.pivotModel.MaturityDate +
        "</SettDate><TenorDays>"+this.pivotModel.TenorDays+"</TenorDays><Tenor>"+this.pivotModel.Tenor+"</Tenor><BuySell>"+this.pivotModel.OrderDirection +
        "</BuySell><Spotrate>"+ (this.pivotModel.OrderDirection.toUpperCase() === 'BUY'
        ? this.pivotModel.AskRate
        : this.pivotModel.BidRate) +"</Spotrate><LeverageFactor>"+this.pivotModel.Leverage+"</LeverageFactor><Ccy1PerFixing>"+Number(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) +
        "</Ccy1PerFixing><Strike>"+this.pivotModel.Pivot+"</Strike><PivotStrike>"+this.pivotModel.Pivot+"</PivotStrike><LowerStrike>"+this.pivotModel.LowerStrike
        +"</LowerStrike><UpperStrike>"+this.pivotModel.UpperStrike+"</UpperStrike><KIBarrierType></KIBarrierType><KI>"+this.pivotModel.LowerKI+
        "</KI><KIYesNo>"+this.pivotModel.SelectedKIStyle +"</KIYesNo><KIStyle>"+ KIStyle +"</KIStyle><FinalPayType>"+this.pivotModel.SelectedFinalPayType+"</FinalPayType><FixingAdjustment>"+this.pivotModel.SelectedFixingAdjustment+
        "</FixingAdjustment><UpperKI>"+this.pivotModel.UpperKI+"</UpperKI><CappedLoss>No</CappedLoss><CappedLossCcy>USD</CappedLossCcy><CappedLossAmount>0</CappedLossAmount><EntityID>"+this.FXD_afs.EntityID+
        "</EntityID><NoofSett>"+this.pivotModel.NoOfSett+"</NoofSett></Sheet1></ExcelSheets>"

        let fxd_Mode = this.FXD_cfs.fngetMode() //Urmila A | LGTGTWINT-1470 | 21-feb-23
       
        let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)

        //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
        this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBNew(
          this.FXD_afs.EntityID, //EntityId
          this.FXD_afs.UserName,
          // this.FXD_afs.GetToken(),
          // this.Product_Name, //ProductID
          this.Product_Name.toUpperCase(), //ProductType
          this.pivotModel.CurrencyPair, //CurrencyPair
          this.pivotModel.NotionalCCY, //DepositCurrency
          this.pivotModel.NotionalCCY === this.pivotModel.AltCcy ? this.pivotModel.DepCcy : this.pivotModel.AltCcy, //AlternateCurrency
          this.pivotModel.IBPremCCY, //PremCurrency
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy
            ? this.pivotModel.DepCcy
            : this.pivotModel.AltCcy, //SettlementCcy
          this.pivotModel.Notional.replace(/,/g, ''), //AmountInDepositCurrency
          'PREMIUM',
          // this.pivotModel.AltNotional.toString(), //AmountInAlternateCurrency
          this.pivotModel.OrderDirection, //BuySell
          // this.pivotModel.OptionType.toUpperCase(), //CallPut
          this.pivotModel.Pivot.toString(), //Strike
          this.pivotModel.SelectedKIStyle === 'Yes' ? this.pivotModel.LowerKI : 0, //LowerBarrier
          this.pivotModel.SelectedKIStyle === 'Yes' ? this.pivotModel.UpperKI : 0, //UpperBarrier
          '', //BarrierType
          'EUROPEAN', //KnockIn_Style
          'EUROPEAN', //KnockOut_Style
          this.pivotModel.OptionCut, //OptionCut
          this.pivotModel.Tenor + '', //Tenor
          this.pivotModel.PremiumDate, //ValueDate
          this.pivotModel.FixingDate, //FixingDate
          this.pivotModel.MaturityDate, //MaturityDate,
          this.FXD_afs.UserName,
          // this.FXD_afs.EntityID,
          true,      
          this.pivotModel.PriceProviderString, //PriceProviderDetails
          // 'Black Scholes',
          this.XMLString,
          this.TemplateCode, //TemplateCode
          // this.TemplateID.toString(), //TemplateID
          this.pivotModel.TemplateID,
          this.Product_ID, 
          // this.DealerRemark,
          // this.Parant_DCDRFQID,
          // this.DI_YN,
          this.pivotModel.NoteMasterID,
          // this.DIfromTradeIdea,
          // fxd_Mode, //Urmila A | LGTGTWINT-1470 | 21-feb-23
          this.pivotModel.TradeDate,
          this.NDFFlag,
          this.isMetal,
          this.ShowRFS, //UrmilaA, 16-May-23 | (SignalR, RFS | LGTCLI-361)
          '', //CallPut
          '0' ,//RMMarginPercentage / Upfront
           this.Mode,
          this.DI_YN,
          
          '',//KIType
          ActiveRemark,
          '',//CapLoss
          this.pivotModel.DCDRfqId,
          '',//GroupKey
          this.pivotModel.SelectedFixingSettFreq, //frequency //Urmila A | 14-Sep-23
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
            this.pivotModel.BestPrice = null;
            this.pivotModel.PricingServiceResponse =[];
            this.ResetAllfieldsCalled=false; //Urmila A | LGTGTWINT-1332 | 4-mar-23     
                if (this.Product_Name === 'Pivot'){
                  // below ALL code modified by UrmilaA, LGTCLI-361 |23-May-23 | start
                  if (res) {     
                    this.PriceClick=false; //urmilaA | LGTGTWINT-2109                  
                    if(res.errors == undefined && res.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL'){   //Error handling logic modified by Urmila A | 15-sep-23     
                      this.pivotModel.PricingServiceResponse =  res.oPriceResponseBody;
                        if(this.pivotModel.PricingServiceResponse[0].quoteId == 0){  //added by UrmilaA, case- Single record response with quoteId = 0;
                          this.noResponseRecv = true;
                          // this.pivotModel.PricingLoading = false;
                          this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                          this.NotificationFunction("Error","Error" , this.pivotModel.PricingServiceResponse[0].errorMessage)
                        }
  
                          if(this.pivotModel.PricingServiceResponse === null || this.pivotModel.PricingServiceResponse.length == 0){
                            // this.pivotModel.PricingLoading = false;   
                            this.pivotModel.disabledPrembtn = false;  
                            this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                          }else if(this.pivotModel.PricingServiceResponse.length > 0){                                      
                                  //added by UrmilaA | LGTCLI-361 , LGTGTWINT-2040| 29-May-23 | start
                                  this.pivotModel.NoteMasterID = this.pivotModel.PricingServiceResponse[0].NoteMasterID; 
                                  this.pivotModel.DCDRfqId = this.pivotModel.PricingServiceResponse[0].o_DCDRFQID;
                                  //added by UrmilaA | LGTCLI-361, LGTGTWINT-2040 | 29-May-23 | ends    
                                  this.pivotModel.PricingServiceResponseArray =
                                  this.pivotModel.PricingServiceResponse[0]?.bestPriceProvider.toString().split(':');
                                      if(this.ShowRFS){
                                        this.SignalRQuoteIDs='';
                                        this.SignalRQuoteIDs = this.FXD_cfs.fnGetLP_withPrice_Quote(this.pivotModel.PricingServiceResponse)
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
                                            this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23
                                            this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
                                            this.closeSignalR();
                                           //End
                                          }    
                                                                     
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
                                        this.pivotModel.BestPriceProvider = this.pivotModel.PricingServiceResponseArray[0];
                                        this.pivotModel.BestPrice = this.pivotModel.PricingServiceResponseArray[1];
                                        this.pivotModel.PricingServiceResponse.forEach(element => {
                                                if(this.pivotModel.BestPriceProvider === element.provider ){
                                                  this.AssignAfterPriceValues(element)
                                                }
                                        });                                  
                                        this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.pivotModel.PricingServiceResponse);       
                                      }                            
                                      if(this.isSaveTradevisible)  //added by UrmilaA | 16-June-23 |LGTGTWINT-2137
                                      {
                                        this.SaveTradeEnabledFlag = true
                                        this.disabledRoutetodealeronSaveTrade = false
                                        this.FXD_afs.SaveTradeBtnFlag.next(false)
                                      }
                      }
                    }
                      
                  // below ALL code modified by UrmilaA, LGTCLI-361 | 23-May-23 | ends          
                    else
                    {
                      this.pivotModel.PricingServiceResponse =  res?.oPriceResponseBody;
                      this.priceLoader=false;// UrmilaA | LGTGTWINT-2109 | 9-jun-23
                      this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.pivotModel.PricingServiceResponse); //urmila a, 30-mar-23                     
                      if(this.FXD_cfs.fnPricingNotification(res) == 'NoResReceived') {
                        this.noResponseRecv = true; 
                        this.DCDRfqId = this.PriceRecvFromLPs[0].o_DCDRFQID; 
                      }                  
                    }              
                  }else{
                    // this.pivotModel.PricingLoading = false;
                    this.priceLoader=false // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                    this.NotificationFunction("Error","Error" , 'No response received from remote system')  //Urmila A | 27-Jan-23 | LGTGTWINT-1045, LGTGTWINT-1224
                  }
                }
          }catch(ex) {}      
        });
      }
      else if(this.Errormsg !== "")
      {
        this.NotificationFunction("Error","Error" , this.Errormsg)
      }    
    } 
  }

     //added by UrmilaA, 16-May-23, LGTCLI-361 | start
     MapRFS(data:any){
      let BestPriceConsist :boolean=false;
      let nonBestCnt:any=0;
      let nonBestTimeout:any=0;
      let nonBestTimeoutOccurred:boolean=false;
      //this.pivotModel.PricingLoading=false   // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
      this.saveRes = this.pivotModel.PricingServiceResponse.map( (mapObj,index) => {
            var p = {...mapObj};
            if(index === 0){
              this.pivotModel.DCDRfqId  = p.o_DCDRFQID
            }

            if(parseInt(data[0]) === p.quoteId){
              this.PriceRecvFromLPs = this.PriceRecvFromLPs + 1; //added by UrmilaA, 22-may-23
              // this.pivotModel.PricingLoading=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
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
                this.pivotModel.BestPrice = p.premiumAmount; //added currently for testing purpose by UrmilaA, 20-April-23
                this.AssignAfterPriceValues(p)                                         
              }
              if(p.premiumAmount !== '' && p.premiumAmount !== '0') {
                this.pivotModel.BestPrice = p.premiumAmount;
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
                    //BestPriceConsist=false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                    nonBestTimeout = parseInt(this.MaxQuoteTimeout) - parseInt(this.MinQuoteTimeout)
                    console.log(' 2nd timeout start:',nonBestTimeout, Date())
                    this.MinMaxTimer = nonBestTimeout // modified by UrmilaA | LGTGTWINT-2110| 9-June-23 
                    this.MaxTimeout =  setTimeout(() => { // modified by UrmilaA | LGTGTWINT-2110| 9-June-23
                          nonBestTimeoutOccurred=true;
                          console.log('after 2nd timeout RFS res:', this.saveRes)
                          this.priceLoader=false;    // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                          //BestPriceConsist
                          if(nonBestTimeoutOccurred && !this.signalRMsgRecv){ //UrmilaA | 30-May-23 | case- Not single price received from signalR
                            // this.pivotModel.PricingLoading = false;
                            this.noResponseRecv = true; //UrmilaA, LGTGTWINT-2040 | 29-May-23
                            console.log('No response received from remote system')
                              this.NotificationFunction("Error","Error" , "No response received from remote system")
                          }
                    }, nonBestTimeout * 1000);

                // Start Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                    console.log('NonBestTimeout is ',nonBestTimeout );
    
                    let nonBestinterval: any = nonBestTimeout;                
                    
                    this.maxInterval =  setInterval(() => {
                      this.MinMaxTimer = nonBestinterval = nonBestinterval-1 // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
                      if(nonBestinterval >0){
                        if(this.signalRMsgRecv){
                          this.priceLoader=false;      // UrmilaA | LGTGTWINT-2109 | 9-jun-23    
                          this.btnEnable=true;  //UrmilaA, LGTCLI-361 | 22-Mar-23
                          // this.pivotModel.PricingLoading  = false; 
                          this.SignalR_unsubscriber = false; //UrmilaA |LGTCLI-361 | 24-May-23
                          this.closeSignalR();
                          this.signalRMsgRecv = false;
                          this.MaxQuotePriceCame  = true;  
                          this.FXD_afs.RFSRes.next(this.saveRes); //added by UrmilaA, LGTCLI-361 | 22-May-23                         
                          clearInterval(this.maxInterval)
                        }        
                      }else if(nonBestinterval == 0){ // modified by UrmilaA | LGTGTWINT-2110| 9-June-23  
                        clearInterval(this.maxInterval)
                        clearTimeout(this.MaxTimeout)
                      }
                              
                    },1000);
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
        
            console.log('DCDRfqId',this.pivotModel.DCDRfqId)    
             
    }
  
    AssignAfterPriceValues(element){  
      this.ClearLPs = false; //added by UrmilaA, LGTCLI-361 | 23-May-23
      this.pivotModel.BestPriceProvider = element.provider;
      this.pivotModel.BestPrice = element.premiumAmount;
      // this.pivotModel.PricingLoading = false; //UrmilaA | LGTGTWINT-2109
      // this.DCDRfqId = element.o_DCDRFQID;
      this.pivotModel.NoteMasterID = element.NoteMasterID; //Urmila A | 14-Sep-23;
      this.pivotModel.ExternalRfqId = element.quoteId;
      this.pivotModel.BestPriceabs = Math.abs(Number(this.pivotModel.BestPrice));
      this.pivotModel.IBPremPer = element.premium
      this.pivotModel.UpfrontPer = parseFloat(element.premium).toFixed(4) //Added by UrmilaA | LGTGTWINT-2061 | 2-June-23
      this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));
      this.pivotModel.IBPremium = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));
      // this.custPremDirection = element.premium > 0 ? 'Pay' : 'Receive';
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
      if(this.pivotModel.OrderDirection.toLowerCase() === 'buy'){
          this.pivotModel.AskRate = element.spot ? this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.pivotModel.StrikePointShift)) : this.pivotModel.AskRate; //changed by UrmilaA, LGTCLI-361 | 24-May-23
      }else{
          this.pivotModel.BidRate = element.spot ? this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.pivotModel.StrikePointShift)) : this.pivotModel.BidRate; //changed by UrmilaA, LGTCLI-361 | 24-May-23
      }
      //end
      console.log('IBPremium',this.pivotModel.IBPremium,'UpfrontVal', this.UpfrontVal)
      this.fnGetClientMaxProfit2('') //Added by UrmilaA | 5-June-23 | LGTCLI-421
      this.fnFindUpfrontUSD();
      this.fnGetContractSummary();
     
  }
  //added by UrmilaA, 16-May-23, LGTCLI-361 | end

   //Urmila A | LGTGTWINT-1147,LGTGTWINT-1322 | Pricing loader | 3-feb-23 |
   CancelPricing(){
    if(this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
     // this.pivotModel.PricingLoading=false;
    this.priceLoader=false;   // UrmilaA | LGTGTWINT-2109 | 9-jun-23
  }

  KIChange(e){
    this.pivotModel.SelectedKIStyle=e.target.value;
    if(e.target.value === 'No'){
        this.pivotModel.LowerKI='';
        this.pivotModel.UpperKI='';
    }
    this.fnGetContractSummary()
  }

  FXManualPricing() {
    if (this.Validations() && this.Errormsg === '') {
      this.ResetAllFields();
      this.FXD_cfs.GenerateUserID(this.pivotModel);
      this.pivotModel.disabledPrembtn = true;
      // this.pivotModel.PricingLoading = true; //UrmilaA | LGTGTWINT-2109
      if (this.pivotModel.NotionalCCY === this.pivotModel.DepCcy) {
        this.pivotModel.AltNotional =
          Number(this.pivotModel.Notional.replace(/,/g, '')) *
          Number(this.pivotModel.Strike);
      } else {
        this.pivotModel.AltNotional =
          Number(this.pivotModel.Notional.replace(/,/g, '')) /
          Number(this.pivotModel.Strike);
      }
      this.pivotModel.ClearPricingFlag = false;

      this.XMLString =
        '<ExcelSheets><Sheet1>' +
        '<Product_Name>' +
        this.Product_Name +
        '</Product_Name>' +
        '<Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>' +
        '<CustID>' + '1'+
        // this.Home_api.CustomerId +
        '</CustID>' +
        '<Customer_Name>' +
        // this.Home_api.CustomerName +
        'LGT-CUST001'
        '</Customer_Name>' +
        '<CAI_ID>7400</CAI_ID>' +
        '<TargetInPips>' +
        this.pivotModel.TargetPips +
        '</TargetInPips>' +
        '<TargetGainunit>' +
        this.pivotModel.SelectedKOType +
        '</TargetGainunit>' +
        '<NoofKOITMEvents>' +
        this.pivotModel.NoofKOITMEvents +
        '</NoofKOITMEvents>' +
        '<OptionCut>' +
        this.pivotModel.OptionCut +
        '</OptionCut>' +
        '<NonDeliveryYN>N</NonDeliveryYN>' +
        '<Freq>' +
        this.pivotModel.SelectedFixingSettFreq +
        '</Freq>' +
        '<FirstFixingDate>' +
        this.datepipe.transform(this.pivotModel.FirstFixingDate, 'yyyy-MM-dd') +
        '</FirstFixingDate>' +
        '<Currency1>' +
        this.pivotModel.DepCcy +
        '</Currency1>' +
        '<CcyPair>' +
        this.pivotModel.CurrencyPair +
        '</CcyPair>' +
        '<PremiumCcy>' +
        this.pivotModel.IBPremCCY +
        '</PremiumCcy>' +
        '<CustPrem>0</CustPrem>' +
        '<TradeDate>' +
        this.pivotModel.TradeDate +
        '</TradeDate>' +
        '<PremiumDate>' +
        this.pivotModel.PremiumDate +
        '</PremiumDate>' +
        '<FixingDate>' +
        this.pivotModel.FixingDate +
        '</FixingDate>' +
        '<SettDate>' +
        this.pivotModel.MaturityDate +
        '</SettDate>' +
        '<TenorDays>' +
        this.pivotModel.TenorDays +
        '</TenorDays>' +
        '<Tenor>' +
        this.pivotModel.Tenor +
        '</Tenor>' +
        '<BuySell>' +
        this.pivotModel.OrderDirection +
        '</BuySell>' +
        '<Spotrate>' +
        (this.pivotModel.OrderDirection.toUpperCase() === 'BUY'
          ? this.pivotModel.AskRate
          : this.pivotModel.BidRate) +
        '</Spotrate>' +
        '<LeverageFactor>' +
        this.pivotModel.Leverage +
        '</LeverageFactor>' +
        '<Ccy1PerFixing>' +
        Number(this.pivotModel.NotionalPerFixing.toString()) +
        '</Ccy1PerFixing>' +
        '<Strike>' +
        this.pivotModel.Strike +
        '</Strike>' +
        '<PivotStrike>' +
        Number(this.pivotModel.Pivot).toFixed(4) +
        '</PivotStrike>' +
        '<LowerStrike>' +
        this.pivotModel.LowerStrike +
        '</LowerStrike>' +
        '<UpperStrike>' +
        this.pivotModel.UpperStrike +
        '</UpperStrike>' +
        '<KIBarrierType>' +
        // this.pivotModel.SelectedKIStyle +
        '</KIBarrierType>' +
        '<KI>' +
        this.pivotModel.LowerKI +
        '</KI>' +
        '<KIStyle>' +
        this.pivotModel.SelectedKIStyle +
        '</KIStyle>' +
        '<FinalPayType>Full</FinalPayType>' +
        '<FixingAdjustment>None</FixingAdjustment>' +
        '<UpperKI>' +
        this.pivotModel.UpperKI +
        '</UpperKI>' +
        '<CappedLossCcy>' +
        this.pivotModel.AltCcy + //changed by mohan 5jan22
        '</CappedLossCcy>' +
        '<CappedLossYN>' +
        this.pivotModel.SelectedCappedLossYN +
        '</CappedLossYN>' +
        '<CappedLossAmount>' +
        this.pivotModel.CappedLossAmount +
        '</CappedLossAmount>' +
        '<EntityID>' +
        this.FXD_afs.EntityID +
        '</EntityID>' +
        '<NoofSett>' +
        this.pivotModel.NoOfSett +
        '</NoofSett>' +
        '</Sheet1></ExcelSheets>';
      this.FXD_afs.SetPricingProduct(this.Product_Name);

      this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBManual(
        this.FXD_afs.EntityID, //EntityId
        this.Product_ID.toString(), //ProductID
        this.Product_Name.toUpperCase(), //ProductType
        this.pivotModel.CurrencyPair, //CurrencyPair
        this.pivotModel.DepCcy, //DepositCurrency
        this.pivotModel.AltCcy, //AlternateCurrency
        this.pivotModel.IBPremCCY, //PremCurrency
        // this.pivotModel.IBPremCCY === this.pivotModel.DepCcy ? this.pivotModel.DepCcy : this.pivotModel.AltCcy, //SettlementCcy
        this.pivotModel.NotionalCCY, //SettlementCcy
        this.pivotModel.Notional.replace(/,/g, ''), //AmountInDepositCurrency
        this.pivotModel.AltNotional.toString(), //AmountInAlternateCurrency
        this.pivotModel.OrderDirection, //BuySell
        this.pivotModel.OptionType.toUpperCase(), //CallPut
        this.pivotModel.Strike, //Strike
        this.pivotModel.LowerStrike.toString(), //LowerBarrier
        this.pivotModel.UpperStrike.toString(), //UpperBarrier
        '', //BarrierType
        'EUROPEAN', //KnockIn_Style
        'EUROPEAN', //KnockOut_Style
        this.pivotModel.OptionCut, //OptionCut
        this.pivotModel.Tenor + '', //Tenor
        this.pivotModel.PremiumDate, //ValueDate
        this.pivotModel.FixingDate, //FixingDate
        this.pivotModel.MaturityDate, //MaturityDate
        this.pivotModel.PriceProviderString, //PriceProviderDetails
        'PREMIUM', //SolveFor
        this.TemplateCode, //TemplateCode
        this.TemplateID, //TemplateID
        this.pivotModel.Notional.replace(/,/g, ''), //NotionalPerFix
        '', //LeverageFactor
        '', //FixingSettFreq
        '', //GuaranteedPeriod
        '', //KORate
        0, //TargetInPips
        '', //TargetGainunit
        this.XMLString, //XMLString
        '',
        this.Home_api.CustomerId,
        this.pivotModel.Mode,
        'GWManual',
        this.pivotModel.ClientPremType,
        this.pivotModel.IBPremType,
        '',
        '',
        ''
      ).subscribe((res) => {
        this.pivotModel.BestPrice = null;
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          if (res) {
            console.log(res);
            if (res) {
              this.pivotModel.PricingServiceResponse = res.GetFXOPriceManualModeResult;
              // this.pivotModel.IBPremium = this.pivotModel.PricingServiceResponse.IBPrem;
              // this.pivotModel.ClientPremium = this.pivotModel.PricingServiceResponse.CustPrem;
              this.pivotModel.ClientPremium = parseFloat(this.pivotModel.PricingServiceResponse.CustPrem).toFixed(this.pivotModel.IBPremCCY === this.pivotModel.AltCcy ? this.pivotModel.Asset2_DecimalAmount : this.pivotModel.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              this.pivotModel.UpfrontPer = this.pivotModel.PricingServiceResponse.MarginPerc;
              this.pivotModel.ClientPremType = this.pivotModel.PricingServiceResponse.CustPayReceiveDirection;
              this.pivotModel.IBPremType = this.pivotModel.PricingServiceResponse.IBPayReceiveDirection;

              // this.pivotModel.PricingLoading = false; //UrmilaA | LGTGTWINT-2109
            } else {
              // this.pivotModel.PricingLoading = false; //UrmilaA | LGTGTWINT-2109
              this.Errormsg =
                this.pivotModel.PricingServiceResponse[0].errorMessage;
              this.Errormsg = 'No prices received';
              this.NotificationFunction("Error","Error" , this.Errormsg)
            }
          }
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
  }

  async fnCalculateFirstFixingDate() {
    this.pivotModel.FirstFixingDate='';
    var Tenor_Code_Temp = '';
    switch (this.pivotModel.SelectedFixingSettFreq.split('/')[0]) {
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
    console.log('final fixing date ', this.pivotModel.FixingDate)
    this.FXDGetNoofSettSubscriber = this.FXD_afs.fnGetFixingDateFromNoOfSett(
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.pivotModel.DepCcy + '-' + this.pivotModel.AltCcy,
      this.pivotModel.TradeDate,
      this.FXD_afs.EntityID,
      // Tenor_Code_Temp,
      this.pivotModel.SelectedFixingSettFreq.split('/')[0],
      this.pivotModel.SelectedFixingSettFreq.split('/')[0],
      this.Product_ID.toString(),
      this.Product_Code,
      this.Mode,
      this.pivotModel.OptionCut,
      this.FXD_afs.UserName,
      // this.pivotModel.TenorDays,
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.pivotModel.PremiumDate,
      // this.pivotModel.FirstFixingDate,
      this.pivotModel.FixingDate,
      this.pivotModel.MaturityDate,
      this.pivotModel.NotionalPerFixing
    ).subscribe((res) => {
      if (res) {
        console.log(res);
        this.AllDataLoaded.firstfixingdate = true;
         //urmila A, 5-april-23 , LGTGTWINT-1846
        this.prevFirstFixingDate = this.pivotModel.FirstFixingDate = this.datepipe.transform(res.firstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23
        this.firstFixChngAndDatesReceived =true;
        this.fnGetTenorfromFixings();
        this.fnGetContractSummary();
      }
    });
  }
  firstFixingDateChngfn(e){ //Urmila A |LGTCLI-278 | 6-Feb-23
      let date:any = new Date( e.target.value)
      if(date.toString().includes('Sat') || date.toString().includes('Sun')){
          this.NotificationFunction("Error","Error" , 'First fixing date should not fall on holiday') //modified on 2-Mar-23 | LGTGTWINT-1607
      }else if(e.target.value !== ''){  //urmila A, 5-april-23 , LGTGTWINT-1846
        this.prevFirstFixingDate = this.pivotModel.FirstFixingDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd'); //Urmila A | 8-Mar-23   
        this.FirstFixingChangedYN = 'Y';
        this.FixingSettChngYN = "N"; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
        this.NoofSettChangeYN = 'N'; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
        this.AllDataLoaded.firstfixingdate = true; //Urmila A | 3-Feb-23
        this.fnGetDatesCalculationforVB();
      } else if(e.target.value === ''){  //urmila A, 5-april-23, LGTGTWINT-1846
        this.pivotModel.FirstFixingDate = this.prevFirstFixingDate
        this.AllDataLoaded.firstfixingdate = true;
        this.FirstFixingChangedYN = 'N';
        this.FixingSettChngYN = "N"; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
        this.NoofSettChangeYN = 'N'; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      }    
  }
  fnGetTenorfromFixings() {
    this.pivotModel.Tenor=''
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.tenor = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
     this.TenorFromFixingSubcriber= this.FXD_afs.fnGetTenorfromFixings( //API req parameters modification | Core migration | Urmila A | 21-Aug-23
      this.pivotModel.SelectedFixingSettFreq,
      this.pivotModel.NoOfSett,    
      this.FXD_afs.UserName,  
    ).subscribe((res) => {
     
      if (res !== null) {
        this.pivotModel.Tenor = res.result;
        this.AllDataLoaded.tenor = true; //Urmila A | LGTGTWINT-1295 | 2-Feb-23          
        if(this.pivotModel.Tenor.includes('W')){
          this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 7
        }else if(this.pivotModel.Tenor.includes('M')){
              this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 30
        }else if(this.pivotModel.Tenor.includes('Y')){
          this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 365
        }
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
        this.TenorChanged();
      }
    });
  }

  async TenorChanged() {
    this.ResetAllFields();
    try {
      await this.fnGetDatesCalculationforVB();
    } catch (error) {
      console.log(error);
    }
  }

  async fnGetDatesCalculationforVB() {
    this.pivotModel.PremiumDate = '';
    this.pivotModel.FixingDate = '';
    this.pivotModel.MaturityDate = '';
    this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.datecalculation = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.FXDatesCalculationsubscription =  this.FXD_afs.GetDatesCalculationforVB(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Name,
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.pivotModel.SelectedFixingSettFreq?.split('/')[0], //LGTGTWINT-2019 | UrmilaA | 23-May-23
      this.pivotModel.SelectedFixingSettFreq?.split('/')[1], // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      this.pivotModel.Tenor,
      this.pivotModel.OptionCut,
     this.pivotModel.TradeDate,
    //  this.pivotModel.TenorDays,
     this.Mode, //Core migration: API req parameters modified by Urmila A | 22-Aug-23
     this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  'N' : this.FirstFixingChangedYN, //Urmila A | LGTGTWINT-1203 | 31-Jan-23
     this.FirstFixingChangedYN === 'Y' && this.FixingSettChngYN === 'Y' ?  '' : this.pivotModel.FirstFixingDate //Urmila A | LGTGTWINT-1203 | 31-Jan-23
     ).subscribe((res) => {
        //mappings modified by Urmila A | 4-Sep-23
        if (res !== null) {
        this.AllDataLoaded.datecalculation = true;   
        this.LoadingPivotFlag = false;
        this.pivotModel.PremiumDate = res[0].valueDate;
        this.pivotModel.FixingDate = res[0].fixingDate;
        this.pivotModel.MaturityDate = res[0].maturityDate;
        this.pivotModel.TenorDays = res[0].expiryDays;
        if(this.FixingSettChngYN === 'Y' &&  !this.firstFixChngAndDatesReceived){
          this.getfnCalculateFirstFixingDate();  
        }else if(this.FirstFixingChangedYN === 'N' && this.NoofSettChangeYN === 'N'){
          this.getfnCalculateFirstFixingDate();  
        }else if(this.CurrencyChanged){
          this.getfnCalculateFirstFixingDate();
        }else{  //Urmila A | 12-Jan-23 | start |LGTGTWINT-1003
          this.fnGetContractSummary();
        }//end | 12-Jan-23


        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  fnGetPriceProviderandCcypairs(modelClassObj) {
    try {
      this.AllDataLoaded.ccypairs=false; //LGTGTWINT-1369, Urmila A | 8-Feb-23
      this.GetPriceProviderDetailsSubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
        this.FXD_afs.EntityID,
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.Mode,
        '',
        '',
        '', //CcySearch - Added by Urmila A | 11-Jan-23 
        this.pivotModel.OptionCut
      ).subscribe((res) => {
        modelClassObj.CCYOptions=[]; //Added by Urmila A | LGTGTWINT-753 | 6-Jan-23     
        if (res !== null) {
       
          this.AllDataLoaded.ccypairs = true;
          res.forEach(async (element, index) => {
            modelClassObj.CCYOptions.push(element);
            if (modelClassObj.CCYOptions[index].asset_Pair === 'EUR - USD') {
              modelClassObj.CurrencyPair = modelClassObj.CCYOptions[index].asset_Pair;
              modelClassObj.DepCcy = modelClassObj.CurrencyPair.slice(0, 3);
              modelClassObj.AltCcy = modelClassObj.CurrencyPair.slice(6, 9);

              modelClassObj.NotionalCCY = modelClassObj.DepCcy;
              modelClassObj.IBPremCCY = modelClassObj.DepCcy;
              this.Pair_Cross_YN = element.Pair_Cross_YN;
              this.Left_USD_Pair = element.Left_USD_Pair;
              this.Right_USD_Pair = element.Right_USD_Pair;
              this.fnGetBidAskRates(modelClassObj);
              this.fnGetOptionCutFXD(this.pivotModel);
              this.pivotModel.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
              this.pivotModel.Asset2_DecimalAmount = element.Asset2_DecimalAmount;
            }
          });
          if (this.Pair_Cross_YN === 'Y') {
            this.FindLeftUSDMidRate(this.Left_USD_Pair);
            this.FindRightUSDMidRate(this.Right_USD_Pair);
          }
          this.FXD_cfs.sort_by_key(modelClassObj.CCYOptions, 'asset_Pair');
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetPriceProviderLPs(modelClassObj) {
    try {
      this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 
      this.AllDataLoaded.priceprovider = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 
      this.FXPriceProvidersubscription = this.FXD_afs.GetPriceProviderDetails(
        this.FXD_afs.EntityID,
        this.Product_ID,
        this.Mode,
        this.UserGroup,
        this.FXD_afs.UserName,
        this.PricingMode,
        //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
      ).subscribe((res) => {      
        if (res !== null) {
          modelClassObj.LPList = [];
          this.AllDataLoaded.priceprovider = true;
          this.pivotModel.PriceProviderString = '';
          this.SampleArray = this.PriceproviderArr= res
          //changes added by Urmila A, 4-may-23, to get Price provider string , made common function
          this.pivotModel.PriceProviderString = this.fngetPriceProviderStr( this.PriceproviderArr)
          
          //below code commented by UrmilaA, 17-april-23, start
          // res.GetFXDPriceProviderDetailsResult.PriceProviderDetails.forEach((element) => {
          //   modelClassObj.LPList.push(element);
          //   console.log('modelClassObj.LPList',modelClassObj.LPList)
          
          //   this.pivotModel.PriceProviderString === ''
          //     ? (this.pivotModel.PriceProviderString = '' + element.PP_Code)
          //     : (this.pivotModel.PriceProviderString =
          //       this.pivotModel.PriceProviderString + ':' + element.PP_Code);
          // });
          //below code commented by UrmilaA, 17-april-23, end

          console.log('this.pivotModel.PriceProviderString',this.pivotModel.PriceProviderString)
      
          if(this.IsNavigate){ //urmila a, 30-mar-23
            this.fnGetSelectedCCYDetails();
          }

         if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
         }
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | start
  fnGetSelectedCCYDetails(){
    this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs(  //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.pivotModel.Mode,
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.CcySearch,
      this.pivotModel.OptionCut
    ).subscribe((res)=>{
        try{
          if (res) {
            // res = res.Get_Ccy_PairsResult.Pair_Tradable_Details;
            this.AllDataLoaded.ccypairs = true;
            res.forEach(async (element) => {
              this.pivotModel.CCYOptions.push(element);
              this.Pair_Cross_YN = element.Pair_Cross_YN;
              this.Left_USD_Pair = element.Left_USD_Pair;
              this.Right_USD_Pair = element.Right_USD_Pair;      
              this.pivotModel.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
              this.pivotModel.Asset2_DecimalAmount = element.Asset2_DecimalAmount;   
                    
              //added by UrmilaA | LGTGTWINT-2119 |start
              if(element.LCY_Type.toUpperCase() === 'METAL'){
                this.isMetal = 'Y';
                this.pivotModel.DisableCCYChangeControl = true;   
                this.pivotModel.NotionalDecimalPointShift = 0;
              }
              if(element.RCY_Type === 'NDF'){
                this.NDFFlag = 'Y';
              }
              //added by UrmilaA | LGTGTWINT-2119 |ends
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

  fnChangeAppMode(modelClassObj) {
    try {
      if (modelClassObj.PricingMode.toUpperCase() === 'AUTO') {
        modelClassObj.LPList.unshift({
          PP_Code: 'Best Price',
          PP_CustomerId: '',
          PP_ExternalCode: '',
          PP_Id: '',
          PP_Name: 'Best Price',
          PP_Round_Strike_Diff: '',
          PP_TwoStepOrderExecutionYN: '',
          PP_Type: '',
        });
      } else {
        modelClassObj.LPList.shift();
      }
      modelClassObj.SelectedLPForPrice = modelClassObj.LPList[0].PP_Name;
      modelClassObj.ClearPricingFlag = false;
      this.ResetAllFields();
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetOptionCutFXD(modelClassObj) {
    try {
      modelClassObj.OptionCutOptions=[]
      this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
      this.AllDataLoaded.optioncut = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
      this.FXDOptionCutSubscriber = this.FXD_afs.fnGetOptionCutFXD(
        this.FXD_afs.EntityID,
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.Mode,
        modelClassObj.CurrencyPair,
        this.Home_api.CustomerId,
        this.FXD_afs.UserName
      ).subscribe((res) => {
        if (res.length > 0 && res !== null) { //modified by Urmila A | 29-Aug-23
          this.AllDataLoaded.optioncut = true;
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 |start

          res.forEach((element,i) => {
              if (element.OptionCut === 'BFIXTOK') {
                  res.splice(i,1)
                  res.unshift(element)
              } 
          });
          res.forEach(element => {
            modelClassObj.OptionCutOptions.push(element.OptionCut);
          });

          // LGTCLI-448 | FXD Enable PM Option Cut BFIXTOK | Chaitanya M | 04 Aug 2023
          if(!this.IsNavigate){
            this.pivotModel.OptionCut = res[0].OptionCut;
          } 
          //End
          
          // Added by Urmila A | LGTCLI-167 | 1-Dec-22 | end
          //!this.RouteFromWorkflow
          if(!this.IsNavigate && !this.CurrencyChanged){ //Urmila A |30-mar-23
            // this.fnGetDatesCalculationforVB();
            this.fnGetTenorfromFixings() //UrmilaA | 27-feb-23| LGTGTWINT-1538
          }
        
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
            this.AllAPIsLoaded=true;
          }
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetTenor(modelClassObj) {
    try {
      this.GetTenorSubscriber = this.FXD_afs.fnGetTenor(
        this.FXD_afs.EntityID,
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.Mode,
        'T',
        this.FXD_afs.UserName
      ).subscribe((res) => {
        if (res) {
          this.AllDataLoaded.tenor = true;
          res.forEach((element) => {
            if (element) {
              modelClassObj.TenorOptions.push(element.Member_ID);
            }
          });
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetBidAskRates(modelClassObj) :any{
    try {
      this.ResetAllFields();
      this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
      this.AllDataLoaded.bidask = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
      this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration     
        modelClassObj.Product_Code,
        modelClassObj.CurrencyPair,
        this.FXD_cfs.fngetMode(),
        this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
      ).subscribe((res) => {

        //mapping modified by Urmila A | 1-Sep-23
        if (res !== null) {
          this.AllDataLoaded.bidask = true;
          modelClassObj.BidRate = parseFloat(res.BidRate).toFixed(Number(res.PointShift));
        
          modelClassObj.AskRate = parseFloat(res.AskRate).toFixed(Number(res.PointShift));

          modelClassObj.NotionalPointShift = Number(res.DecimalRate);
          modelClassObj.StrikePointShift = Number(res.PointShift);  //Urmila A |27-feb-23 |LGTGTWINT-1526
          // this.SpotMidRate= parseFloat(res.MidRate);  // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
          this.SpotMidRate = ((Number(modelClassObj.BidRate) + Number(modelClassObj.AskRate)) / 2 ).toFixed(res.PointShift);  // HSBCFXEINT-17 | Chaitanya M  | 12 Dec 2023
          
          // this.calcClientProfitCcy1(); //Added by Urmila A | for updating Client max profit ccy1 after CCY change | 4-Jan-23 | LGTGTWINT-684
          // this.calcClientProfitCcy2(); //Added by Urmila A | for updating Client max profit ccy2 after CCY change | 4-Jan-23 | LGTGTWINT-684
         
          this.fnGetClientMaxProfit2('') //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
         
          this.GetStrikeRate(this.pivotModel);
          this.fnEnablePrembtn(this.pivotModel);
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  LowerStrikeChnge(e){
      this.pivotModel.LowerStrike = Number(e.target.value).toFixed(this.pivotModel.StrikePointShift)
  }

  UpperStrikeChnge(e){
    this.pivotModel.UpperStrike = Number(e.target.value).toFixed(this.pivotModel.StrikePointShift)
  }
   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23 | start
  fnPointShift(pivotModel,data){
      try{
        this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
          pivotModel.Product_Code,
          pivotModel.CurrencyPair,
          this.FXD_cfs.fngetMode(),
          this.FXD_afs.UserName,  //RizwanS || added userid || 30 Aug 2023
        ).subscribe((res) => {
          if (res) { //mappings modified by Chaitanya M | 29-Nov-23
            this.pivotModel.StrikePointShift = Number(res.PointShift); 
            this.pivotModel.Pivot = Number(data.Strike_Rate).toFixed(this.pivotModel.StrikePointShift);
            this.pivotModel.LowerStrike = Number(data.LowerStrike).toFixed(this.pivotModel.StrikePointShift);
            this.pivotModel.UpperStrike = Number(data.UpperStrike).toFixed(this.pivotModel.StrikePointShift);
         
            if(data.KIType !== '' && data.KIType !== 'No' ){
              this.pivotModel.LowerKI = Number(data.OptionLowerBarrier) > 0 ? Number(data.OptionLowerBarrier).toFixed(this.pivotModel.StrikePointShift) : '';
              this.pivotModel.UpperKI = Number(data.OptionUpperBarrier) > 0 ? Number(data.OptionUpperBarrier).toFixed(this.pivotModel.StrikePointShift) : '';
            }else {
              this.pivotModel.LowerKI =  this.pivotModel.UpperKI = '';
            }
           
            //below changes modified by Urmila A | Demo pack sync up | 24-Nov-23
            if(data.RFQ_Deal_Dir === "S"){
              this.pivotModel.AskRate = Number(data.Ask_Rate).toFixed(this.pivotModel.StrikePointShift);
              this.pivotModel.BidRate = Number(data.Spot_Rate).toFixed(this.pivotModel.StrikePointShift);           
            }else{
              this.pivotModel.AskRate = Number(data.Spot_Rate).toFixed(this.pivotModel.StrikePointShift);
              this.pivotModel.BidRate = Number(data.Bid_Rate).toFixed(this.pivotModel.StrikePointShift);
            }    
            this.SpotMidRate = ((Number(data.Ask_Rate) + Number(data.Bid_Rate)) / 2 ).toFixed(this.pivotModel.StrikePointShift) //Added by Urmila A | LGTGTWINT-1693 | 9-mar-23
            // this.maxClientProfitCcy1  = this.calcClientProfitCcy1();
            // this.maxClientProfitCcy2 = this.calcClientProfitCcy2();
            this.fnGetClientMaxProfit2('') //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
          }
        });
      } catch(err){
        console.log(err)
      }
  }
   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23 | end
   
  //modified by UrmilaA, 2-May-23 | LGTCLI-418 | start
  GetStrikeRate(modelClassObj) {
    try {
      if (modelClassObj.OrderDirection.toUpperCase() === 'BUY') {
        modelClassObj.Pivot = Number(modelClassObj.AskRate.replace(/,/g, '')).toFixed(modelClassObj.StrikePointShift);
      } else {
        modelClassObj.Pivot = Number(modelClassObj.BidRate.replace(/,/g, '')).toFixed(modelClassObj.StrikePointShift);
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }
   //modified by UrmilaA, 2-May-23 | LGTCLI-418 | ends

  fnEnablePrembtn(modelClassObj) {
    if (
      Number(modelClassObj.BidRate) > 0 &&
      Number(modelClassObj.AskRate) > 0 &&
      modelClassObj.CurrencyPair !== '' &&
      modelClassObj.DepCcy !== '' &&
      modelClassObj.AltCcy !== '' &&
      Number(modelClassObj.Strike > 0) &&
      modelClassObj.TenorDays !== '' &&
      Number(modelClassObj.Notional.replace(/,/g, '')) > 0 &&
      modelClassObj.TradeDate !== '' &&
      modelClassObj.PremiumDate !== '' &&
      modelClassObj.FixingDate !== '' &&
      modelClassObj.MaturityDate !== ''
    ) {
      modelClassObj.disabledPrembtn = false;
    } else {
      modelClassObj.disabledPrembtn = true;
    }
  }

  fnChangeInNoOfSett(e) {
    this.pivotModel.NoOfSett = e.target.value;
    // START - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
    this.NoofSettChangeYN = 'Y';
    this.FirstFixingChangedYN = 'N';
    this.FixingSettChngYN = "N";
    // END - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
    if(this.pivotModel.NoOfSett === '0' || this.pivotModel.NoOfSett === ''){ //Urmila A | 15-Feb-23 | LGTGTWINT-1212
      this.NotificationFunction("Error","Error", "Number of settlement should be grater than 0 ")
      // START - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      this.NoofSettChangeYN = 'N'; 
      this.FirstFixingChangedYN = 'N'; 
      this.FixingSettChngYN = "N";
      // END - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
    }else{
      this.NoofSettChangeYN = 'Y';
      // START - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      this.FirstFixingChangedYN = 'N';
      this.FixingSettChngYN = "N";
      //END - LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      this.fnGetTenorfromFixings();    
      // this.fnCalculateFirstFixingDate();
    }

   
  }
  fnChngFixingSettlFreq(e){
    this.pivotModel.SelectedFixingSettFreq=e.target.value
    this.FixingSettChngYN = 'Y';
    this.FirstFixingChangedYN = 'N';  // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
    this.NoofSettChangeYN = 'N'; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
    this.fnGetTenorfromFixings();    
  }
  ChangeinNotionalPerfixing() {
    this.pivotModel.Notional = this.FXD_cfs.format(
      Number(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) *
      Number(this.pivotModel.NoOfSett), this.pivotModel.NotionalDecimalPointShift
    );

    // Start - LGTGTWINT-2283 | Chaitanya M  | 28 Aug 2023
    if(this.NoofSettChangeYN !=='Y'){
      this.fnGetDatesCalculationforVB();
      this.fnGetContractSummary();
    } 
    //END - LGTGTWINT-2283 | Chaitanya M  | 28 Aug 2023  
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
  fnChangePricingMode() {
    // this.PricingMode = this.SelectedPricingMode.toUpperCase();
    // switch (this.PricingMode) {
    //   case 'AUTO':
    //     this.SelectedLPForPricing = 'Best';
    //     break;
    //   case 'MANUAL':
    //     this.SelectedLPForPricing = this.SampleArray[0].PP_Name;
    //     this.SampleArray.forEach((element, index) => {
    //       if (element.PP_Name === 'Best') {
    //         this.SampleArray.splice(index, 1);
    //       }
    //     });
    //     // this.ServiceResponse = [{ bestPriceProvider: this.SelectedLPForPricing }];
    //     // SelectedIBType
    //     break;
    // }
  }
  fnIsMetalInCcy() {
    try {
      this.Pair_Cross_YN = '';
      this.Left_USD_Pair = '';
      this.Right_USD_Pair = '';
      //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | start
      this.pivotModel.CCYOptions.forEach(element => {
        if (element.asset_Pair === this.pivotModel.CurrencyPair) {
          this.Pair_Cross_YN = element.pair_Cross_YN;
          this.Left_USD_Pair = element.left_USD_Pair;
          this.Right_USD_Pair = element.right_USD_Pair;
          this.pivotModel.DepCcy = this.pivotModel.CurrencyPair.split('-')[0].trim();
          this.pivotModel.AltCcy = this.pivotModel.CurrencyPair.split('-')[1].trim();

          if (element.lcY_Type.toUpperCase() === 'METAL') { // Check if the Dep ccy is metal or not
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.pivotModel.DisableCCYChangeControl = true;               
            this.pivotModel.IBPremCCY = this.pivotModel.AltCcy;
            this.pivotModel.NotionalCCY = this.pivotModel.DepCcy;
            this.pivotModel.NotionalDecimalPointShift = 0;

          } else if (element.rcY_Type.toUpperCase() === 'METAL') {// Check if the Alt ccy is metal or not
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.pivotModel.DisableCCYChangeControl = true;                 
            this.pivotModel.IBPremCCY = this.pivotModel.DepCcy;
            this.pivotModel.NotionalCCY = this.pivotModel.DepCcy;
            this.pivotModel.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);

          } else {
            this.isMetal = 'N'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.pivotModel.DisableCCYChangeControl = false;
            this.pivotModel.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
          }

          //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
          if (element.rcY_Type === 'NDF') {
            this.NDFFlag = 'Y';
          } else {
            this.NDFFlag = 'N';
          }
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
        this.pivotModel.CCYOptions.forEach(element => {
          if (element.asset_Pair === this.pivotModel.CurrencyPair) {
            if (this.pivotModel.NotionalCCY === element.asset1) { //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 
              this.pivotModel.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.pivotModel.NotionalCCY === element.asset2) {
              this.pivotModel.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.pivotModel.Notional = this.FXD_cfs.NotionalChangewithDecimalFixes(this.pivotModel.Notional, this.pivotModel.NotionalDecimalPointShift);
           //added by Urmila A | 28-Nov-23 | F5SAAINT-660
           this.pivotModel.NotionalPerFixing = this.FXD_cfs.NotionalChangewithDecimalFixes(
            this.pivotModel.NotionalPerFixing,
            this.pivotModel.NotionalDecimalPointShift
          );
            this.fnGetContractSummary()
          }
        });
      } catch (ex) {

      }
    } catch (Ex) {

    }
  }

  //Modified by Urmila A | 3-Mar-23
  public SelectedCCy(e) {
    console.log(e);
    this.pivotModel.CurrencyPair = e;
    this.CurrencyChanged=true;
     //Added by UrmilaA | 26-Dec-23 | start
     if(e !== '' && this.pivotModel.CurrencyPair.length == 9){
      this.setCCY(this.pivotModel);
      // this.GetStrikeRate(this.pivotModel);     //commented by UrmilaA, 2-May-23 | LGTCLI-418
      this.fnGetOptionCutFXD(this.pivotModel); //Added by Urmila A | for updating option cut after CCY change
      this.fnGetDatesCalculationforVB();
      // this.getfnCalculateFirstFixingDate()
    }  
    if(this.pivotModel.CurrencyPair == '' || this.pivotModel.CurrencyPair.length <= 8){
      this.pivotModel.DepCcy = this.pivotModel.AltCcy = '';
      this.pivotModel.IBPremCCY = this.pivotModel.NotionalCCY = ''
      this.fnGetBidAskRates(this.pivotModel);
    } 
    //Added by UrmilaA | 26-Dec-23 | ends
  }

 


  getfnCalculateFirstFixingDate(){
    this.pivotModel.FirstFixingDate='';
    // this.pivotModel.NoOfSett=''; //Urmila A | 25-Jan-23 | LGTGTWINT-1205
    var Tenor_Code_Temp = '';
     this.AllAPIsLoaded=false;  //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    this.AllDataLoaded.firstfixingdate = false; //Urmila A | LGTGTWINT-1295 | 2-Feb-23 |
    switch (this.pivotModel.SelectedFixingSettFreq.split('/')[0]) {
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
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.pivotModel.DepCcy + '-' + this.pivotModel.AltCcy,
      this.pivotModel.TradeDate,
      this.FXD_afs.EntityID,
      // Tenor_Code_Temp,
      this.pivotModel.SelectedFixingSettFreq.split('/')[0],
      this.pivotModel.SelectedFixingSettFreq.split('/')[1], // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
      this.Product_ID.toString(),
      this.Product_Code,
      this.Mode,
      this.pivotModel.OptionCut,
      this.FXD_afs.UserName,
      // this.pivotModel.TenorDays,
      this.pivotModel.DepCcy,
      this.pivotModel.AltCcy,
      this.pivotModel.PremiumDate,
      // this.pivotModel.FirstFixingDate,
      this.pivotModel.FixingDate,
      this.pivotModel.MaturityDate,
      this.pivotModel.NotionalPerFixing
    ).subscribe((res) => {
      if (res) {
        console.log(res);
        this.AllDataLoaded.firstfixingdate = true;
         //added this.prevFirstFixingDate by urmila A, 5-april-23, LGTGTWINT-1846
        this.prevFirstFixingDate =  this.pivotModel.FirstFixingDate = this.datepipe.transform(res.firstFixingDate, 'yyyy-MM-dd');  //Urmila A | 8-Mar-23
        this.firstFixChngAndDatesReceived =true;
        this.FixingSettChngYN = 'N' //Urmila A | LGTGTWINT-1203 | 31-Jan-23
        this.FirstFixingChangedYN = 'N'; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023
        this.NoofSettChangeYN = 'N'; // LGTGTWINT-2283 | Chaitanya M | 31 Aug 2023

        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | start
        // if(!this.CurrencyChanged){ // Commented code by Urnila A | 24-Jan-23 , as NoofSettl to be user input only, as told by Rahul P, LGTGTWINT-1167
        //   this.pivotModel.NoOfSett = res.GetNumberofFixingsResult.FixingData.NoofFixings
        // } 
        // Added by Urmila A, restricted change in NoOfSettl. on CCY pair change, as told by Rahul P on 7-Jan-23 | end    
        // this.fnGetTenorfromFixings();
        // this.pivotModel.Notional = this.FXD_cfs.numberWithCommas(parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * Number(this.pivotModel.NoOfSett)); // Commented code by Urnila A | 24-Jan-23 , as NoofSettl to be user input only, as told by Rahul P, LGTGTWINT-1167
     
	this.NoOfObservations = res.noofFixings // LGTGTWINT-2283 | Chaitanya M  | 28 Aug 2023
      }
      this.CurrencyChanged=false; //Added by Urmila A | 7-Jan-23
      this.fnGetContractSummary();
      if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 
        this.AllAPIsLoaded=true;
      }
    });

  }

  setCCY(modelClassObj) {
    this.ResetAllFields();
    modelClassObj.DepCcy = modelClassObj.CurrencyPair.slice(0, 3);
    modelClassObj.AltCcy = modelClassObj.CurrencyPair.slice(6, 9);
    modelClassObj.NotionalCCY = modelClassObj.DepCcy;
    modelClassObj.IBPremCCY = modelClassObj.DepCcy;

    modelClassObj.AskRate = '';
    modelClassObj.BidRate = '';

    //Added by UrmilaA, 26-April-23 | LGTCLI-418 | start
    if(this.pivotModel.SelectedKIStyle === 'Yes'){
        this.pivotModel.LowerKI='';
        this.pivotModel.UpperKI='';
    
    }
    //Added by UrmilaA, 26-April-23 | LGTCLI-418 | ends

    //added by Urmila A, LGTCLI-418 | 2-May-23 | start    
    this.pivotModel.LowerStrike='';
    this.pivotModel.UpperStrike='';
    //added by Urmila A, LGTCLI-418 | 2-May-23 | ends

    this.fnGetBidAskRates(modelClassObj);
    this.fnIsMetalInCcy();
    this.fnChangeNotionalCCY();
    // this.fnGetDatesCalculationforVB();
    // this.fnGetContractSummary()
   
  
    try {
      modelClassObj.CappedLossCcyOptions = [];
      modelClassObj.CappedLossCcyOptions.push(modelClassObj.DepCcy);
      modelClassObj.CappedLossCcyOptions.push(modelClassObj.AltCcy);
    } catch (ex) {
      console.log('Prem product found');
    }
  }
  fnCustomerSelection(e) {
    this.CustomerName = e.CustomerID;
  }
 // Urmila A | View schedule functonality | 7-Dec-22 | start
  fnShowOrHideShedule() {
    let XML = ''; //Urmila A | LGTGTWINT-1332 | 4-Mar-23 | start

    // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
    // let targetBF = 0;
    // targetBF = (this.pivotModel.TargetPips / 100);

    this.pivotModel.ViewScheduleflag = true;
    if(this.RouteFromWorkflow && !this.ResetAllfieldsCalled){
      this.pivotModel.NoteMasterID = this.NoteToUnblock;
    }else if(this.ResetAllfieldsCalled) { 
      this.pivotModel.NoteMasterID = ''
    }else if(this.RouteFromWorkflow  && !this.ResetAllfieldsCalled && !this.pivotModel.BestPrice){
      this.pivotModel.NoteMasterID = this.NoteToUnblock;
    }else if(this.RouteFromQuoteHistory){ //urmila A, 30-Mar-23,  LGTGTWINT-1758
      this.pivotModel.NoteMasterID = this.pivotModel.NoteMasterID 
    }//end

   


    this.FXD_cfs.schedulePopupOpenClose.next(true);
    let KIStyle:any;
    this.scheduleBtnClick=true; //Urmila A | LGTGTWINT-1244 | 30-Jan-23

    if(this.pivotModel.SelectedKIStyle === 'Yes'){
      if(this.pivotModel.Leverage === 1){
        KIStyle = 'E-101'
      }else{ KIStyle = 'E-102' }
     }else{ KIStyle = '' }
     let LeverageTXT = this.pivotModel.Leverage > 1 ? 'Booster' : '';

     if(this.pivotModel.SelectedKIStyle === 'No') {
      this.ScheduleDescription =  ' ' + this.pivotModel.CurrencyPair + ' ' + this.pivotModel.SelectedFixingSettFreq + ' ' +  LeverageTXT + ' ' + 'Pivot on' + ' ' +
      this.pivotModel.NotionalCCY + ' ' + 'at Lower Strike : ' + (this.pivotModel.LowerStrike !== '' ? this.pivotModel.LowerStrike : 0) + ',' + ' ' + 'Pivot : ' + (this.pivotModel.Pivot !== '' ? this.pivotModel.Pivot : 0) + ' ' + 'and Upper Strike : ' + ' ' + (this.pivotModel.UpperStrike !== '' ? this.pivotModel.UpperStrike : 0)
       + ', ' + 'Target Type : ' + 'Big Figure' + ' ' + ', ' + 'Target Value :' + ' '+ this.pivotModel.TargetPips + ' '+ 'pips';  // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550
     }else{
      this.ScheduleDescription =  ' ' + this.pivotModel.CurrencyPair + ' ' + this.pivotModel.SelectedFixingSettFreq + ' ' +  LeverageTXT + ' ' + 'Pivot on' + ' ' +
      this.pivotModel.NotionalCCY + ' ' + 'at Lower Strike : ' + (this.pivotModel.LowerStrike !== '' ? this.pivotModel.LowerStrike : 0) + ',' + ' ' + 'Pivot : ' + (this.pivotModel.Pivot !== '' ? this.pivotModel.Pivot : 0) + ' ' + 'and Upper Strike : ' + ' ' + (this.pivotModel.UpperStrike !== '' ? this.pivotModel.UpperStrike : 0)
       + ', ' + 'Target Type :' + 'Big Figure' + ' ' + ', ' + 'Target Value :' + ' '+ this.pivotModel.TargetPips + ' '+ 'pips with Knock-in at Lower KI Rate : ' + ' '+
       (this.pivotModel.LowerKI !== '' ? this.pivotModel.LowerKI : 0) + ' ' + 'and Upper KI Rate : ' + ' ' + (this.pivotModel.UpperKI !== '' ? this.pivotModel.UpperKI: 0);  // Modified by Urmila A, 6-Jan-23 | LGTGTWINT-550
     }

     if(!this.pivotModel.BestPrice){
       //customer ID, name changes added by UrmilaA, 17-April-23
       //EntityId changes by UrmilaA, LGTGTWINT-1908 | 25-April-23
      // Added KOType, Target changes by UrmilaA, 5-May-23 | LGTGTWINT-1953
      //<CustID>"+this.Home_api.CustomerId+ "</CustID><Customer_Name>"+this.Home_api.CustomerName+"</Customer_Name>
      XML = this.ScheduleXML =
          "<ExcelSheets><Sheet1><Product_Name>"+this.Product_Name+"</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><TargetInPips>"+(this.pivotModel.SelectedKOType === 'Big Figure' ? this.pivotModel.TargetPips : 0) +"</TargetInPips><TargetBF>"+this.TargetBF+"</TargetBF><TargetGainunit>"+ 
          this.pivotModel.SelectedKOType+"</TargetGainunit><NoofKOITMEvents>"+(this.pivotModel.SelectedKOType === 'ITM' ? this.NoofKOEvent : 0 )+
          "</NoofKOITMEvents><OptionCut>"+this.pivotModel.OptionCut+"</OptionCut><NonDeliveryYN>N</NonDeliveryYN><Freq>"+this.pivotModel.SelectedFixingSettFreq+"</Freq><FirstFixingDate>"+this.pivotModel.FirstFixingDate+
          "</FirstFixingDate><Currency1>"+this.pivotModel.NotionalCCY+"</Currency1><CcyPair>"+this.pivotModel.CurrencyPair +
          "</CcyPair><PremiumCcy>"+this.pivotModel.IBPremCCY+"</PremiumCcy><CustPrem></CustPrem><TradeDate>"+this.pivotModel.TradeDate +
          "</TradeDate><PremiumDate>"+this.pivotModel.PremiumDate+"</PremiumDate><FixingDate>"+this.pivotModel.FixingDate +"</FixingDate><SettDate>"+this.pivotModel.MaturityDate +
          "</SettDate><TenorDays>"+this.pivotModel.TenorDays+"</TenorDays><Tenor>"+this.pivotModel.Tenor+"</Tenor><BuySell>"+this.pivotModel.OrderDirection +
          "</BuySell><Spotrate>"+ (this.pivotModel.OrderDirection.toUpperCase() === 'BUY'
          ? this.pivotModel.AskRate
          : this.pivotModel.BidRate) +"</Spotrate><LeverageFactor>"+this.pivotModel.Leverage+"</LeverageFactor><Ccy1PerFixing>"+Number(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) +
          "</Ccy1PerFixing><Strike>"+this.pivotModel.Pivot+"</Strike><PivotStrike>"+this.pivotModel.Pivot+"</PivotStrike><LowerStrike>"+this.pivotModel.LowerStrike
          +"</LowerStrike><UpperStrike>"+this.pivotModel.UpperStrike+"</UpperStrike><KIBarrierType></KIBarrierType><KI>"+this.pivotModel.LowerKI+
          "</KI><KIYesNo>"+this.pivotModel.SelectedKIStyle +"</KIYesNo><KIStyle>"+ KIStyle +"</KIStyle><FinalPayType>"+this.pivotModel.SelectedFinalPayType+"</FinalPayType><FixingAdjustment>"+this.pivotModel.SelectedFixingAdjustment+
          "</FixingAdjustment><UpperKI>"+this.pivotModel.UpperKI+"</UpperKI><CappedLoss>No</CappedLoss><CappedLossCcy>USD</CappedLossCcy><CappedLossAmount>0</CappedLossAmount><EntityID>"+this.FXD_afs.EntityID+
          "</EntityID><NoofSett>"+this.pivotModel.NoOfSett+"</NoofSett></Sheet1></ExcelSheets>"
     }else{
          this.ScheduleXML = '';
     }

    //  console.log('this.pivotModel.NoteMasterID',this.pivotModel.NoteMasterID,
    //  this.pivotModel.Product_Code,this.pivotModel.TemplateCode,
    //  this.pivotModel.TemplateID,this.scheduleBtnClick )
    
    //RouteFromWorkflow, replaced with IsNavigate, 30-mar-23 , Urmila A
    if(this.IsNavigate && !this.pivotModel.BestPrice  && this.scheduleBtnClick &&  !this.ResetAllfieldsCalled){  //Urmila A | LGTGTWINT-1332 | 6-Feb-23
      this.ScheduleXML = '';
    }else if(this.IsNavigate && !this.pivotModel.BestPrice  && this.scheduleBtnClick || this.ResetAllfieldsCalled){
      this.ScheduleXML = XML;
    }else if(this.IsNavigate  && this.pivotModel.BestPrice){
      this.ScheduleXML = '';
    }else if(!this.IsNavigate && this.pivotModel.BestPrice){
      this.ScheduleXML = '';
    }else if(this.IsNavigate  && !this.pivotModel.BestPrice ){
      this.ScheduleXML = XML;
    }else if(this.IsNavigate && this.pivotModel.BestPrice || this.IsNavigate && this.pivotModel.BestPrice && this.scheduleBtnClick){
      this.ScheduleXML = '';
    }//end

     //added by Urmila A, LGTGTWINT-1824 , 4-april-23
     if(this.RouteFromQuoteHistory && !this.pivotModel.BestPrice){
      this.ScheduleXML = XML;
    }    

  }
  // Urmila A | View schedule functonality | 7-Dec-22 | end

   fnGetContractSummary() {
    if(this.FXDContractSummSubscriber) this.FXDContractSummSubscriber.unsubscribe();
    this.ContractSummary='';
    this.AltNotional = Number(this.pivotModel.Pivot) > 0 && this.pivotModel.Pivot !== '' ? this.pivotModel.NotionalCCY === this.pivotModel.DepCcy  ?  parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, ''), 10) / Number(this.pivotModel.Pivot)  : 
    parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, ''), 10) * Number(this.pivotModel.Pivot) : 0.00 
    try {
      let KIStyle:any;
      this.pivotModel.Leverage === 1 ? KIStyle = 'E-101' :  KIStyle = 'E-102'
    
        //new
        this.FXDContractSummSubscriber =  this.FXD_afs.fnGetContractSummary(
          Number(this.FXD_afs.EntityID), 
          this.FXD_afs.UserName,
          // this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
          // this.FXD_afs.EntityID,
          this.Product_Code.toUpperCase(),//template code
          this.Product_Code.toUpperCase(),
          (this.pivotModel.OrderDirection || ''), //added by Urmila A | 9-Nov-23
          this.pivotModel.CurrencyPair,
          this.pivotModel.OptionType,
          this.pivotModel.NotionalCCY,
          this.pivotModel.NotionalCCY === this.pivotModel.DepCcy ? this.pivotModel.AltCcy : this.pivotModel.DepCcy,
          // this.pivotModel.AltCcy,
          this.pivotModel.IBPremCCY,
          parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.pivotModel.Notional.replace(/,/g, '')) : 0,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
          parseInt(this.pivotModel.NotionalPerFixing.replace(/,/g, ''), 10) > 0 ? Number(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) : 0,  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
          this.pivotModel.Tenor,
          this.pivotModel.FirstFixingDate,
          this.pivotModel.MaturityDate,//settlement
          '',//longdate
          '', //shortdate
          Number(this.pivotModel.Pivot) > 0 ?  Number(this.pivotModel.Pivot) : 0 ,
          this.pivotModel.OptionCut,
          '',
          '',
          '',
          this.pivotModel.SelectedKIStyle === 'Yes' ? Number(this.pivotModel.UpperKI) : 0,
          this.pivotModel.SelectedKIStyle === 'Yes' ? Number(this.pivotModel.LowerKI) : 0,
          Number(this.pivotModel.Leverage),
          Number(this.pivotModel.NoOfSett) > 0 ? Number(this.pivotModel.NoOfSett) : 0,
          Number(this.NoOfObservations) > 0 ? Number(this.NoOfObservations) : 0,//No of fixing  // LGTGTWINT-2283 | Chaitanya M  | 28 Aug 2023         
          this.pivotModel.SelectedFixingSettFreq,
          this.pivotModel.SelectedFixingSettFreq,//settl freq
          Number(this.pivotModel.LowerStrike) > 0 ? Number(this.pivotModel.LowerStrike) :0,
          Number(this.pivotModel.UpperStrike) > 0 ? Number(this.pivotModel.UpperStrike) : 0,
          Number(this.pivotModel.Pivot) ? Number(this.pivotModel.Pivot) : 0,
          '',//spread type
          this.custPremDirection, // cust prem direction
          this.pivotModel.BestPrice ? this.IBPremDirection : '', // IB prem dir //Urmila A | 1-Feb-23 | LGTGTWINT-1209
          this.pivotModel.BestPrice ? parseInt(this.pivotModel.IBPremium)  ? parseFloat(this.pivotModel.IBPremium.replace(/,/g, '')) : 0 : 0,
          0.00,//RTC
          this.pivotModel.BestPrice ? Number(this.pivotModel.IBPremPer) ? Number(this.pivotModel.IBPremPer) : 0 : 0,//IB prem perc, LGTGTWINT-685, //Urmila A | 1-Feb-23 | LGTGTWINT-1209
          0.00,//RTC perc
          0.00, //Target
          0.00,//target notional
          this.pivotModel.SelectedKIStyle,//KI style rate

          // this.pivotModel.SelectedKIStyle === 'Yes' ? KIStyle : 'No',//KI style rate
          this.pivotModel.SelectedKIStyle === 'Yes' ? Number(this.pivotModel.LowerKI) : 0.00,
          this.pivotModel.SelectedKIStyle === 'Yes' ? Number(this.pivotModel.UpperKI) : 0.00,
          '',//Guarentee till
          0.00,//Guarentee periods
          '',//capped loss ccy
          '', //capped losstype
          '',//capped loss
          0.00,//capped loss amt
          // Added KOType changes by UrmilaA, 5-May-23 | LGTGTWINT-1953 | start
          this.pivotModel.SelectedKOType === 'Big Figure' ? Number(this.pivotModel.TargetPips) > 0 ? this.TargetBF.toString() : '0' : '0',
          this.pivotModel.SelectedKOType === 'Big Figure' ? 'Big Figure' : 'ITM',//target per unit
          this.pivotModel.SelectedKOType === 'Big Figure' ? Number(this.pivotModel.TargetPips) > 0 ? this.pivotModel.TargetPips : '0' : '0',
          this.pivotModel.SelectedKOType === 'ITM' ? this.NoofKOEvent  : '0.00',//KOITME event
          // Added KOType changes by UrmilaA, 5-May-23 | LGTGTWINT-1953 | ends
          '',//strikestype
          this.pivotModel.FirstFixingDate,
          this.pivotModel.SelectedFinalPayType,
          this.pivotModel.SelectedFixingAdjustment
      ).subscribe((res) => {
        if (res) {
          console.log(res);
          if(res.result == ''){
            this.ContractSummary = 'No response received'
          }else{
            this.ContractSummary = res.result.toString().replaceAll("\\n", "<br>");  
            this.ContractSummary = this.sanitize.transform(this.ContractSummary.toString().replaceAll("\color:black",
            "color:var(--btn-bg) !important"
            )) //Urmila A | 16-feb-23
      
          }

          res =  res.result.toString().replaceAll("\\n", "<br>");
        
        }
      });
    } catch (ex) { }
  }

  //not using these functions, as calculations to be done via api side | Urmila A | 16-mar-23
  calcClientProfitCcy1() {
    let a;
    let b;
    try {
      if(!this.pivotModel.TargetPips || !this.pivotModel.NotionalPerFixing || this.pivotModel.NotionalPerFixing === '' || !this.pivotModel.Pivot || this.pivotModel.Pivot === '' ){
        return;
      }
      if (this.pivotModel.NotionalCCY !== this.pivotModel.CurrencyPair.split('-')[0].trim()) {
         a = (parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) / parseFloat(this.pivotModel.Pivot));
         b = parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) / ((((this.pivotModel.TargetPips / 100) / 100)) + parseFloat(this.pivotModel.Pivot));
        this.maxClientProfitCcy1 = (a - b).toFixed(2);

      } else {
        a = (((parseFloat(this.pivotModel.TargetPips) / 100) / 100) + parseFloat(this.pivotModel.Pivot));
        b = (parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * parseFloat(this.pivotModel.Pivot));
        this.maxClientProfitCcy1 = (((parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * a ) - b) / parseFloat(this.pivotModel.BidRate)).toFixed(2);
      
      }
      this.maxClientProfitCcy1 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy1)
      return this.maxClientProfitCcy1;
    } catch(error) {

    }
  }

  //not using these functions, as calculations to be done via api side | Urmila A | 16-mar-23
  calcClientProfitCcy2() {
    try {
      if(!this.pivotModel.TargetPips || !this.pivotModel.NotionalPerFixing || this.pivotModel.NotionalPerFixing === '' || !this.pivotModel.Pivot || this.pivotModel.Pivot === '' ){
        return;
      }
      if (this.pivotModel.NotionalCCY === this.pivotModel.CurrencyPair.split('-')[0].trim()) {
        let c = (((this.pivotModel.TargetPips/ 100) / 100) + parseFloat(this.pivotModel.Pivot));
        let d = (parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * parseFloat(this.pivotModel.Pivot));
        this.maxClientProfitCcy2 = ((parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) * c) - d).toFixed(2);
      } else {
        let c = (parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) / parseFloat(this.pivotModel.Pivot));
        let d = parseFloat(this.pivotModel.NotionalPerFixing.replace(/,/g, '')) / ((((this.pivotModel.TargetPips / 100) / 100) + parseFloat(this.pivotModel.Pivot))) ;
        this.maxClientProfitCcy2 = ((c - d)* parseFloat(this.pivotModel.BidRate)).toFixed(2);
      }
      this.maxClientProfitCcy2 = this.FXD_cfs.numberWithCommas(this.maxClientProfitCcy2);
      return this.maxClientProfitCcy2;
    } catch(error) {

    }
  }

 //Added by Urmila A | 16-Mar-23 | LGTGTWINT-684 | start
 fnGetClientMaxProfit2(tofind){
  if (!this.pivotModel.TargetPips || this.pivotModel.TargetPips === '' || !this.pivotModel.NotionalPerFixing || this.pivotModel.NotionalPerFixing === '') {
    return;
  }

  try{
    let ToFind;
    let MaxClientProfit;
    let spotrate =  this.pivotModel.AskRate  //BidRate , modified by UrmilaA, LGTGTWINT-684, 18-April-23
   
    //Added by Urmila A | 17-Mar-23
    if(spotrate.includes(',')){
      spotrate = spotrate.replaceAll(',','')
    }
  
    if(tofind === 'ccy2'){
          ToFind = 'ccy2';
          MaxClientProfit = 'Get_MaxProfitCCy2';
    }else  if(this.pivotModel.NotionalCCY === this.pivotModel.CurrencyPair.split('-')[0].trim() ){
          ToFind = 'ccy2';
          MaxClientProfit = 'Get_MaxProfitCCy2';
          this.MaxClientvalue = this.maxClientProfitCcy1 = 0
    }else{
          ToFind = 'ccy1';
          MaxClientProfit = 'Get_MaxProfitCCy1';
          this.MaxClientvalue = this.maxClientProfitCcy2 = 0         
    }
   

    let param4 = this.pivotModel.NotionalCCY + ', ' + this.pivotModel.CurrencyPair.split('-')[0].trim() + ', ' + spotrate + ', ' + this.pivotModel.NotionalPerFixing.replaceAll(',','') +
    ', ' + this.pivotModel.Pivot + ', ' + Number(this.TargetBF).toFixed(this.pivotModel.StrikeRatePointShift) + ',' + this.MaxClientvalue + ',' + this.pivotModel.CurrencyPair + ', ' +
     (Number(parseFloat(this.pivotModel.TargetPips).toFixed(this.pivotModel.StrikeRatePointShift)))
    

    if(ToFind === 'ccy2' || tofind === 'ccy2'){
      this.maxClientProfitCcy2=0
      //changed method name as generic for UCP functions, by UrmilaA, 2-May-23 | LGTGTWINT-1947       
      this.MaxClientSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( MaxClientProfit , param4) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
            .subscribe((res:any)=>{
                try{
                    if(res !== null){
                      res = res.FunctionGenericOutput                    
                      this.MaxClientvalue = this.fnParseMAX_ClientProfit(res)

                      let param4 = this.pivotModel.NotionalCCY + ', ' + this.pivotModel.CurrencyPair.split('-')[0].trim() + ', ' + spotrate + ', ' + this.pivotModel.NotionalPerFixing.replaceAll(',','') +
                      ', ' + this.pivotModel.Pivot + ', ' + parseFloat(this.TargetBF) + ',' + this.MaxClientvalue + ',' + this.pivotModel.CurrencyPair + ', ' +
                       (Number(parseFloat(this.pivotModel.TargetPips)))

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
     //changed method name as generic for UCP functions, by UrmilaA, 2-May-23 | LGTGTWINT-1947
      this.MaxClientSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( MaxClientProfit , param4) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
      .subscribe((res:any)=>{
          try{
            //mappings modified by Urmila A | 1-sep-23 
            if(res !== null){
                    this.maxClientProfitCcy1 =0
                    res = res.FunctionGenericOutput
                    this.MaxClientvalue = this.fnParseMAX_ClientProfit(res)
                   
                    if(this.NotionalToggle || (this.IsNavigate && this.pivotModel.NotionalCCY !== this.pivotModel.CurrencyPair.split('-')[0].trim())){ //UrmilaA |LGTGTWINT-2132 |15-June-23
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
  let param4 = this.FXD_afs.EntityID +","+ this.pivotModel.SelectedKOType; // modified  by UrmilaA | 17 May 2023 | LGTGTWINT-1947
  this.finalPaySub = this.FXD_afs.FXDGet_FunctionValue_FXDC_API( 'FinIQ_Set_FinalPaytype', param4 ) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  .subscribe((res:any)=>{
    try{
          if(res !== null){
              res =res.FunctionGenericOutput
              this.pivotModel.FinalPayType=[]
              res = this.FXD_cfs.fnParseXML(res, 'finappaytype') // UrmilaA | LGTGTWINT-2123 | 13-June-23
              console.log('final pay type:', res)
              if(!this.IsNavigate){  //added by UrmilaA, LGTGTWINT-1947 -hotfix | 29-may-23 
                this.pivotModel.SelectedFinalPayType=res[0] //modified by UrmilaA | 17-may-23
              }
              this.pivotModel.FinalPayType.push(...res) //modified by UrmilaA | 17-may-23
              this.getFixingAdjustment();
             
          }
    }catch(err){
      console.log(err)
    }
  })
  
}

getFixingAdjustment(){
  let param4 = this.pivotModel.SelectedFinalPayType + ',' + this.FXD_afs.EntityID;
  this.fixingAdjSub =  this.FXD_afs.FXDGet_FunctionValue_FXDC_API( 'Get_FixingAdjustment', param4 ) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  .subscribe((res:any)=>{
    try{
      //mappings modified by Urmila A | 1-sep-23 
          if(res !== null){
             this.pivotModel.FixingAdjustment=[]
              res =res.FunctionGenericOutput
              res = this.FXD_cfs.fnParseXML(res, 'fixingAdj') // UrmilaA | LGTGTWINT-2123 | 13-June-23
              console.log('fixing adj:', res)
              this.pivotModel.FixingAdjustment.push(...res)
              if(!this.IsNavigate){  //added by UrmilaA, LGTGTWINT-1947 -hotfix | 29-may-23 
                this.pivotModel.SelectedFixingAdjustment=res[0]
              }
              this.fnGetContractSummary();    //added by UrmilaA | LGTGTWINT-2051 | 1-June-23  
             
          }
    }catch(err){
      console.log(err)
    }
  })
} 

fnChngfixingAdj(e){
  this.pivotModel.SelectedFixingAdjustment=e.target.value;
}

getTargetType(){
  this.targetTypeSub = this.FXD_afs.FXDGet_FunctionValue_FXDC_API( 'Get_KOTypeBasedonEntity', this.FXD_afs.EntityID) //API req parameters modified by Urmila A | 21-Aug-23 | core migration
  .subscribe((res:any)=>{
      try{    
        //mappings modified by Urmila A | 1-sep-23 
          if(res !== null){   
            this.TargetTypes=[]
            res =res.FunctionGenericOutput
            res = this.FXD_cfs.fnParseXML(res, 'KOtype')//urmilaA |LGTGTWINT-2123 | 14-June-23
            console.log('target type:', res)
            this.TargetTypes.push(...res)
            // LGTGTWINT-2267 | Chaitanya M | 14 Aug 2023
            if(!this.IsNavigate){ 
              this.pivotModel.SelectedKOType=res[0]       
            }             
            //End
            console.log('KO types:', this.TargetTypes)

          }
      }catch(err) {console.log(err)}
    })
}
//commented as code shifted to fxd-common service | UrmilaA | LGTGTWINT-2123 | 13-June-23
// fnParseXML(response, parse){
//   let value;
//   let FA=[]
//   let KO=[];
//   let parser = new DOMParser()
//   let xmlDoc = parser.parseFromString(response, "text/xml")
//   if(parse === 'fixingAdj' || parse === 'finappaytype'){   //modified by UrmilaA, 17-may-23
//     value =  xmlDoc.getElementsByTagName("FinalPayType")
//     let inputList = Array.prototype.slice.call(value);
//     inputList.forEach(element => {
//           // console.log('in for',element)
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
  this.pivotModel.SelectedKOType = e.target.value;
  this.getFinalPaytype() ; //UrmilaA, LGTGTWINT-1947  | 17-may-23
}

fnITMChng(e){
  this.NoofKOEvent=Number(e.target.value);

}
//added by UrmilaA, LGTGTWINT-1953 | 5-May-23 | ends

  getEntityData(){
    //removed EntityId from req params by UrmilaA | 24-april-23
   this.FXDEntitySubscriber =   this.FXD_afs.getEntityData(this.Product_Code)//Core migration : API req paarms modified by Urmila A | 23-Aug-23
   .subscribe((res:any)=>{
      console.log("entity data", res);
      try{
        if(res.GetEntityDataResult.CVPResponse.CVPData && this.FXD_cfs.fnCheckSessionValidity(res.GetEntityDataResult)){
          this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
          sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code) //LGTGTWINT-1898, UrmilaA, 24-april-23
          this.FXD_afs.SetCredentials() //LGTGTWINT-1898, UrmilaA, 24-april-23
          //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
          if(this.EntityData[0].Code === '50'){
            this.CustomerID = this.Home_api.CustomerId = '50';
            this.Home_api.CustomerName = 'CustomerPB';             
           }//end

        }
      }catch(err){}   
    })
  }

   //Modified by Urmila A | 24-April-23, for PB demo entity | LGTGTWINT-1898 
   chngEntity(e){
    if(e.target.value === '50'){
      this.CustomerID = this.Home_api.CustomerId = '50';
      this.Home_api.CustomerName = 'CustomerPB';   
    }

    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)
    this.FXD_afs.SetCredentials()
    this.getTargetType() //added by UrmilaA, 17-may-23
    this.getFinalPaytype()
    this.fnDefaultValues();
    this.fnButtonVisibility()
    this.fnGetPriceProviderLPs(this.pivotModel);  
    this.fnGetPriceProviderandCcypairs(this.pivotModel);
  }
  //Modified by UrmilaA, 24-April-23 | LGTGTWINT-1898 | ends

  // Added by Urmila A
  EmailQuote(){
    this.QuteMailClicked=true;
    this.QuoteMailSent = false;
    this.closeQuoteMail = false;
    this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName,this.pivotModel.NoteMasterID.toString(), this.Product_ID,this.pivotModel.DCDRfqId)
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
          }else{ //added by Urmila A | 18-sep-23
            this.QuoteMailSent = false;
            this.QuteMailClicked=false;
            this.NotificationFunction("Error","Error","No Response from service")
          }
      }catch(err) {}
    })
  }

  closeOrderPopup(){
    this.OrderPlaced = true;  //Modified by Urmila A | 12-Jan-23 |LGTGTWINT-1019
    this.OrderPlacedPopup = false
    this.pivotModel.OrderPlaceFlag=false;
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }
  closeEmailQuote(){
    this.QuoteMailSent=false;
    this.closeQuoteMail=true;  //urmila A | 13-feb-23
    this.OrderPlaced = true; //UrmilaA | LGTGTWINT-1446 | 24-feb-23
  }
  
// Urmila A | 11-Nov-22 |  Start
FindLeftUSDMidRate(LeftCCY){
  this.LeftUSDMidrate = '';
  this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB( //API req params modified by Urmila A | 21-Aug-23 | Core migration
    this.Product_Code,
    LeftCCY,
    this.FXD_cfs.fngetMode(),
    this.FXD_afs.UserName,  //RizwanS || added userid || 30 Aug 2023
  ).subscribe((res) => {
    //mapping modified by Urmila A | 1-Sep-23
    if (res !== null) {
      this.AllDataLoaded.bidask = true;
      this.LeftUSDMidrate = res?.MidRate;
      console.log('left USD Midrate:', this.LeftUSDMidrate);
      if(!this.IsNavigate) { //Added by Urmila A | 30-mar-23
        this.GetStrikeRate(this.pivotModel);
      }
      this.fnEnablePrembtn(this.pivotModel);
    }
  });
}
FindRightUSDMidRate(RightCCY){
  this.RightUSDMidRate = '';
  this.getBidaskSubscriber=  this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
    this.Product_Code,
    RightCCY,
    this.FXD_cfs.fngetMode(),
    this.FXD_afs.UserName,  //RizwanS || added userid || 30 Aug 2023
  ).subscribe((res) => {
    //mapping modified by Urmila A | 1-Sep-23
    if (res !== null) {
      this.AllDataLoaded.bidask = true;
      this.RightUSDMidRate = res?.MidRate;
      console.log('Right USD Midrate:', this.RightUSDMidRate);
       if(!this.IsNavigate) { //Added by Urmila A | 30-mar-23
        this.GetStrikeRate(this.pivotModel);
      }
      this.fnEnablePrembtn(this.pivotModel);
    }
  });
}
fnFindUpfrontUSD(){

  //currently commenting this part as discussed with Rahul P | 24-Feb-23 | start 
  // if(this.IBPremToggle || this.NotionalToggle){
  //   if(this.pivotModel.UpfrontAlt !== ''){ //added by Urmila A | 11-Jan-23 | | LGTCLI-244
  //     this.pivotModel.UpfrontAlt = Number(this.pivotModel.UpfrontAlt.replaceAll(',',''))
   
  //         if(this.pivotModel.NotionalPerFixing !== undefined || this.pivotModel.NotionalPerFixing !== '' || this.pivotModel.Notional !== undefined || this.pivotModel.Notional !== ''){
  //               if(this.pivotModel.IBPremCCY === this.pivotModel.DepCcy && this.pivotModel.NotionalCCY === this.pivotModel.AltCcy){
  //                     this.UpfrontVal = (parseInt(this.pivotModel.Notional.replace(/,/g, ''), 10) / parseFloat(this.pivotModel.Pivot)) * (parseFloat(this.pivotModel.UpfrontPer) / 100)
  //               }else if(this.pivotModel.IBPremCCY !== this.pivotModel.NotionalCCY){
  //                     this.UpfrontVal  = parseInt(this.pivotModel.Notional.replace(/,/g, ''), 10) * parseFloat(this.pivotModel.Pivot) * (parseFloat(this.pivotModel.UpfrontPer) / 100);              
  //               }else{
  //                 this.UpfrontVal = (parseInt(this.pivotModel.Notional.replace(/,/g, ''), 10) * parseFloat(this.pivotModel.UpfrontPer)) / 100;
  //               }
  //               this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(2))
  //               console.log('UpfrontVal: ',this.UpfrontVal)
  //         }
  //    }//end 
  // } 
  //currently commenting this part as discussed with Rahul P | 24-Feb-23 | end 

  //Urmila A | LGTGTWINT-1519 | 24-feb-23
  if(this.UpfrontVal.includes('-') || this.pivotModel.UpfrontAlt.includes('-')){
    this.UpfrontVal = this.UpfrontVal.replace('-','')
    this.pivotModel.UpfrontAlt = this.pivotModel.UpfrontAlt.replace('-','')
  }

  this.UpfrontVal =  this.UpfrontVal.replaceAll(',','') //Urmila A | 1-Feb-23 |LGTCLI-287
  //calculating Upfront (USD) conversion
  if (this.Pair_Cross_YN === 'N') {
    if (this.pivotModel.DepCcy === 'USD' || this.pivotModel.DepCcy.includes('USD')) {
        if (this.pivotModel.NotionalCCY === this.pivotModel.DepCcy && 
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal / 1;
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.AltCcy&&
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy
        ) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal / 1;
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.DepCcy &&
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy
        ) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal / this.SpotMidRate;
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.AltCcy &&
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy
        ) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal/ this.SpotMidRate;
        }
    } else {
        if (this.pivotModel.NotionalCCY === this.pivotModel.DepCcy && this.pivotModel.IBPremCCY === this.pivotModel.DepCcy) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.AltCcy &&
          this.pivotModel.IBPremCCY === this.pivotModel.DepCcy
        ) {
          this.pivotModel.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.DepCcy &&
          this.pivotModel.IBPremCCY === this.pivotModel.AltCcy
        ) {
          this.pivotModel.UpfrontAlt = parseFloat(this.UpfrontVal);
        } else if (
          this.pivotModel.NotionalCCY === this.pivotModel.AltCcy &&
          this.pivotModel.IBPremCCY === this.pivotModel.AltCcy
        ) {
          this.pivotModel.UpfrontAlt = parseFloat(this.UpfrontVal);
        }
    }
  }else if (this.Pair_Cross_YN === 'Y') {
    console.log(
      'left USD:',
      this.Left_USD_Pair,
      'Right USD:',
      this.Right_USD_Pair
    );
    if (this.pivotModel.NotionalCCY ===  this.pivotModel.DepCcy && this.pivotModel.IBPremCCY === this.pivotModel.DepCcy) {
      this.LeftUSDMidrate !== '' ? this.pivotModel.UpfrontAlt = parseFloat(this.UpfrontVal) * this.LeftUSDMidrate : '';
    } else if (  this.pivotModel.NotionalCCY === this.pivotModel.AltCcy && this.pivotModel.IBPremCCY === this.pivotModel.DepCcy ) {
      this.LeftUSDMidrate !== '' ? this.pivotModel.UpfrontAlt = parseFloat(this.UpfrontVal) * this.LeftUSDMidrate : '';
    } else if ( this.pivotModel.NotionalCCY === this.pivotModel.DepCcy && this.pivotModel.IBPremCCY === this.pivotModel.AltCcy) {
      this.RightUSDMidRate !== '' ? this.pivotModel.UpfrontAlt =
      parseFloat(this.UpfrontVal) * this.RightUSDMidRate : '';
    } else if (  this.pivotModel.NotionalCCY === this.pivotModel.AltCcy && this.pivotModel.IBPremCCY === this.pivotModel.AltCcy) {
      this.RightUSDMidRate !== '' ?  this.pivotModel.UpfrontAlt =
      parseFloat(this.UpfrontVal) / this.RightUSDMidRate : '';
    }
    // this.pivotModel.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.pivotModel.UpfrontAlt)
  }
  // this.pivotModel.UpfrontAlt = Number(this.pivotModel.UpfrontAlt)
  this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal)
  //Added by Urmila A | 11-Jan-23 | start | LGTCLI-246
  if(typeof this.pivotModel.UpfrontAlt === "string" && !this.pivotModel.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
    this.pivotModel.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.pivotModel.UpfrontAlt).toFixed(2));
  }else if(typeof this.pivotModel.UpfrontAlt === "number"){
      this.pivotModel.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.pivotModel.UpfrontAlt.toFixed(2));
  }
  //Added by Urmila A | 11-Jan-23 | end


 //Urmila A | 14-feb-23 | LGTCLI-304 | start
 if(this.ClientPremDir === 'P'){

  //Urmila A | LGTGTWINT-1519 | 24-feb-23
  if(this.UpfrontVal.includes('-') || this.pivotModel.UpfrontAlt.includes('-')){
    this.UpfrontVal = this.UpfrontVal.replace('-','')
    this.pivotModel.UpfrontAlt = this.pivotModel.UpfrontAlt.replace('-','')
  }

  this.UpfrontVal = this.UpfrontVal.substring(0,0) + '- ' + this.UpfrontVal.trim().substring(0, this.UpfrontVal.length);
  this.pivotModel.UpfrontAlt = this.pivotModel.UpfrontAlt.substring(0,0) + '- ' + this.pivotModel.UpfrontAlt.trim().substring(0, this.pivotModel.UpfrontAlt.length);
 }
 //Urmila A | 14-feb-23 | LGTCLI-304 | start
  console.log('Upfront USD:',this.pivotModel.UpfrontAlt)
  
 }

// Urmila A | 11-Nov-22 |  end


// modified by Urmila A | 3-May-23 | LGTGTWINT-1947
fnFinalPayTypeChnge(e){
  console.log('final pay',e.target.value)
  // if(e.target.value === 'Exact'){
  //   this.pivotModel.SelectedFixingAdjustment = 'Notional'
  // }else {
  //   this.pivotModel.SelectedFixingAdjustment = e.target.value
  // }
  this.pivotModel.SelectedFinalPayType=e.target.value 
  this.getFixingAdjustment(); //added by UrmilaA, LGTGTWINT-1947 | 17-may-23
  this.fnGetContractSummary();   
}

fnOptionCutChange(e){
  this.pivotModel.OptionCut = e.target.value;
  this.fnGetDatesCalculationforVB();
}
// ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
fnSaveTrade(){
  this.SaveTradeLoader = true
  this.disabledRoutetodealeronSaveTrade = true //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | disabled Route to dealer.
  this.FXD_afs.SetOrderbtnonSaveTrade(true) //Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P | for disabled order btn.
  this.fngetSavetradeRecommendation()
}
// ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

// Added by Urmila A | 22-Nov-22| Load Default values | start
fngetPersonalDefaultValues(){
  //API req params modifications : Core migration | 21-Aug-23 | Urmila A
    this.PersonalDefaultValueSubscriber = this.FXD_afs.getPersonalSettingFXD(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Product_Code)
    .subscribe((res:any)=>{
        try{
            if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetPersonalSettingsResult) ){
              // console.log('getPersonal Setting res=>',res)
              res = res.GetPersonalSettingsResult.DC_PersonSettingsData[0]
              this.pivotModel.DepCcy = res.TextSetting1;
              this.pivotModel.AltCcy = res.TextSetting2;
              this.pivotModel.Tenor = res.TextSetting3;
              this.pivotModel.NotionalPerFixing = this.FXD_cfs.numberWithCommas(res.TextSetting4);
              if(this.pivotModel.Tenor.includes('W')){
                this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 7
              }else if(this.pivotModel.Tenor.includes('M')){
                    this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 30
              }else if(this.pivotModel.Tenor.includes('Y')){
                this.pivotModel.TenorDays = parseInt(this.pivotModel.Tenor) * 365
              }
            }
        }catch(ex){ }
    })
}
//end


//Urmila A | common function to assign product values | 20-feb-23 | start
fnAssignProdDetails(prodCode){
  this.AllProdData.forEach(element => {
    if(element.product_code === prodCode){
            this.pivotModel.Product_ID = this.Product_ID = element.Product_Id;
            this.pivotModel.Product_Name = this.Product_Name = element.Product_Name;
            this.pivotModel.Product_Code = element.product_code;
            this.Template_Name = element.Template_Name;
            this.pivotModel.TemplateCode = this.TemplateCode = element.Template_Code;
            this.TemplateID = this.pivotModel.TemplateID = element.Template_Id;
            //if(!this.RouteFromWorkflow)
            if(!this.IsNavigate){ //Urmila a, 30-mar-23
              this.fnGetPriceProviderLPs(this.pivotModel);   
              this.fnGetPriceProviderandCcypairs(this.pivotModel);
              this.fnGetFixingFreq() //UrmilaA | LGTGTWINT-1895 | 13-june-23
            }
    }
  });
}
//end

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
  this.pivotModel.BestPrice=null;
  //added by urmilaA | LGTGTWINT-2109 | ends

   //Email Quote btn disable issue | 12-june-23|start
   this.QuteMailClicked=false;
   this.QuoteMailSent=false;
   this.closeQuoteMail=false;
   this.OrderPlaced=false;
   //Email Quote btn disable issue | 12-june-23|ends


}
//added by urmilaA | LGTCLI-361 | 30-May-23 | ends

// Added by Urmila A | 29-Nov-22| Reset Pricer | start
ResetPricer(){
  this.PriceClick=false; // LGTGTWINT-2109 | UrmilaA
  this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 17-may-23
  this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
  this.pivotModel.ClearPricingFlag=true; //UrmilaA |LGTCLI-361 | 17-may-23
  this.RMRemarkVisibility=false; //LGTGTWINT-1599, Urmila A | 3-Mar-23
  this.RouteFromWorkflow=false;
  this.pivotModel.FirstFixingDate=''; //Urmila A | 10-feb-23
  this.OrderPlaced=false;  //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
  this.scheduleBtnClick=false;  
  this.NewOrderfromRMUnlocked=false; //Urmila A, as reject button was enable after resetpricer
  this.IsNavigate=false; //Urmila A | 30-Mar-23
  this.DestroyFn(); //UrmilaA |LGTCLI-361
  this.ResetAllFields();
  this.fnDefaultValues();
  
  if(this.pivotModel.BestPrice || this.pivotModel.PricingServiceResponse !== null){ //added by UrmilaA, 16-May-23 | LGTCLI-361
    this.closeSignalR()   
  }

  //Added by Urmila A | LGTGTWINT-684 | 16-mar-23
  this.maxClientProfitCcy1='';
  this.maxClientProfitCcy2='';


  // Urmila A, 30-mar-23
  this.noResponseRecv=false; 
  this.RouteFromQuoteHistory=false;

  this.fnAssignProdDetails('Pivot'); //Urmila A | 20-feb-23 | LGTGTWINT-1444 
  this.fnButtonVisibility();   //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23
  this.getFinalPaytype()  //added by UrmilaA, LGTGTWINT-1947 - hotfix| 29-may-23

}
// Added by Urmila A | 29-Nov-22| Reset Pricer | end


//added by UrmilaA, 16-May-23 | LGTCLI-361 | start
closeSignalR(){
  if(this.pivotModel.BestPrice && this.ShowRFS && this.pivotModel.NoteMasterID !=='0'){ //this.SignalR_unsubscriber
    this.CancelSignalRconnectionSub = this.FXD_afs.FXDResetDictionaryFromRFQIDAPI(this.FXD_afs.EntityID,this.FXD_afs.UserName,this.Product_Code, 
      this.SignalRQuoteIDs, this.pivotModel.DCDRfqId, this.pivotModel.NoteMasterID)
    .subscribe((res:any)=>{
      try{
        if(res){
          res=res.UnsubcribeRFQIDResult.A_ResponseReceived     
          this.SignalR_unsubscriber = res;   //UrmilaA |LGTCLI-361 | 24-May-23
          if(res === true){            
            // this.pivotModel.PricingLoading=false;               
            console.log('btnEnable',this.btnEnable) 
            this.SignalRQuoteIDs='';
          }       
        }
    }catch(err){console.log(err)}
    })
  }
 } 
 //added by UrmilaA, 16-May-23 | LGTCLI-361 | ends

 // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | start
 fnRouteDealerClick(){
  if(this.DealerRemark === ''){
    this.Errormsg = 'Please enter remark'
    this.NotificationFunction("Error","Error" , this.Errormsg)
  }else if(this.DealerRemark !== ''){
    this.Errormsg = ''
    this.routeToDealerClicked = true;
    this.confirmedRouteDealer = false;
    this.SaveTradeEnabledFlag = false //Added  Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P. | disabled save trade idea on Route to dealer
  }
}
 closeRouteToDealer(){
  this.routeToDealerClicked = false;
  this.confirmedRouteDealer = false;
  this.IsRouteToDealerExecuted =true;
}

fnConfirmRouteToDealer(){
  this.confirmedRouteDealer = true;
  this.routeToDealerClicked = false;
  this.routeToDealerClickedloader = true
  this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(this.FXD_afs.EntityID, this.FXD_afs.UserName,
    this.Product_Code,this.pivotModel.DCDRfqId,this.pivotModel.NoteMasterID,this.CustPAN,this.DealerRemark,this.ExceptionWarningMsg)
    .subscribe((res:any)=>{
      try{
          res=res.result;
          if(res){
            if(res === true) // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            {
            if(res === true){
                  this.routeToDealerClicked = true;
                  this.IsRouteToDealerExecuted = true;
                  this.routeToDealerClickedloader = true
                  console.log('Route to dealer res:',res)
            }
          }
           // ---START--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
          else
          {
            this.routeToDealerClickedloader = true
            this.NotificationFunction("Error", "Error", "Route to dealer failed.")
           
          }
           // ---END--- Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
          }
      }catch(err) {}
    })
 }

 fnChngeRemark(e){
      this.DealerRemark = e.target.value
  }
// Added by Urmila A | Route to dealer functionality | 1-Dec-22 | end

  // Modified by UrmilaA | Reject route to dealer | code sync with 5star | start
   fnRejectRouteToDealer(){
    this.RejectRedirectedOrder=true;
    this.RejectSubscriber = this.FXD_afs.FXDRejectRouteToDealerAPI(this.FXD_afs.UserName,
       this.pivotModel.NoteMasterID,this.DealerRemark ).subscribe((res:any)=>{
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

  fnCloseRejectRouteToDealer(){
    this.RejectRedirectedOrder=false;
  }
  // Modified by UrmilaA | Reject route to dealer | code sync with 5star | ends

  
    // ---START--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
    fngetSavetradeRecommendation(){
      this.Mode = this.FXD_cfs.fngetMode(); //Urmila A | 15-Feb-23 | LGTGTWINT-1403
        //API req body params modified by Urmila A | 21-Aug-23 | Core migration
      this.FXD_afs.getSavetradeRecommendation(this.FXD_afs.UserName,this.pivotModel.NoteMasterID,this.pivotModel.DCDRfqId,
        this.Mode,this.DealerRemark) //Urmila A | 15-Feb-23 | LGTGTWINT-1403
       .subscribe((res:any)=>{
           try{

              res=res.result;
               if(res){ //Urmila a | 11-Mar-23
                 this.SavetradePopup = true
                 this.SaveTradeLoader = false
                 this.SaveTradeEnabledFlag = false
                //  console.log('getPersonal Setting res=>',res , res.SaveTradeRecommendationResult  )
               }
               else
               {
                 this.SaveTradeLoader = false 
                 this.NotificationFunction("Error", "Error", "Save Trade Idea Failed.")
                
               }
           }catch(ex){ }
       })
   }
   
   // ---END--- Added by Mayuri D. on 16-Dec-2022 | LGTCLI-29
   
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


//Added by Urmila A | 27-Dec-22 | LGTCLI-208 | start
fnNotionalCCYToggle(){
  this.NotionalToggle = true; 
  this.ccy2 = true;
  if (this.ccy2 === true && this.pivotModel.NotionalCCY !== this.pivotModel.AltCcy) {
    this.pivotModel.NotionalCCY = this.pivotModel.AltCcy;
    this.ccy1 = true;
  } else if (this.ccy1 === true) {
    this.pivotModel.NotionalCCY = this.pivotModel.DepCcy;
  }
  this.fnChangeNotionalCCY(); //added by Urmila A | 29-Nov-23

  if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ //added by Urmila A | 11-Jan-23 | LGTCLI-244
    this.fnFindUpfrontUSD();
  }
  this.fnGetContractSummary();
  //end
}

//Added by Urmila A |  27-Dec-22 | LGTCLI-208
fnIBPremCCYToggle(){
  this.IBPremToggle=true
  this.ccy2 = true;
  if (this.ccy2 === true && this.pivotModel.IBPremCCY !== this.pivotModel.AltCcy) {
    this.pivotModel.IBPremCCY = this.pivotModel.AltCcy;
    this.ccy1 = true;
  } else if (this.ccy1 === true) {
    this.pivotModel.IBPremCCY = this.pivotModel.DepCcy;
  }
 
  if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ //added by Urmila A | 11-Jan-23 | LGTCLI-244
    this.fnFindUpfrontUSD()
  }
  this.fnGetContractSummary();
  //end
}

//Added by Urmila A |  27-Dec-22 | LGTCLI-208 | END

//Urmila A | 4-Mar-23
PivotChng(e){
  this.pivotModel.Pivot = Number(e.target.value).toFixed(this.pivotModel.StrikePointShift)
}


//modified by UrmilaA | LGTCLI-425 | 29-Mar-23 | starts
targetChnge(e){
  this.pivotModel.TargetPips=e.target.value
  this.TargetBF = (Number(e.target.value) / 100 ).toFixed(2)
}
 //modified by UrmilaA | LGTCLI-425 | 12-june-23 | start
targetBFChng(e){
  this.TargetBF=Number(e.target.value).toFixed(2)  
  this.pivotModel.TargetPips = (Number(e.target.value) * 100)
}
//modified by UrmilaA | LGTCLI-425 | 12-jun-23 | ends

//added by Urmila A | 17-April-23
fngetPriceProviderStr(arr){
  this.pivotModel.LPList = [];
  this.pivotModel.PriceProviderString=''
  arr.forEach((element) => {
    this.pivotModel.LPList.push(element);
    this.pivotModel.PriceProviderString === ''
      ? (this.pivotModel.PriceProviderString = '' + element.PP_Code)
      : (this.pivotModel.PriceProviderString =
        this.pivotModel.PriceProviderString + ':' + element.PP_Code);     
  });
  return this.pivotModel.PriceProviderString;
}



//urmila A | 3-May-23 | LGTGTWINT-1897 | start
fnchngPriceProvider(e){
  if(e.target.value !== 'Bestprice'){
    this.BestPricelbl = "Price" // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
    this.pivotModel.PriceProviderString = e.target.value   
    this.PriceproviderArr.forEach(element => {
              if(element.PP_Code === e.target.value ){
                this.pivotModel.SelectedLPForPrice = element.PP_Name
                this.SampleArray=element
              }
    });
    console.log('this.SampleArray',this.SampleArray)
  }else{
    this.pivotModel.SelectedLPForPrice = this.BestPricelbl =  'Best Price' // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
    this.fngetPriceProviderStr(this.PriceproviderArr)
  }

}
//urmila A | 3-May-23 | LGTGTWINT-1897 | ends


  //UrmilaA | LGTGTWINT-1895 | 13-june-23 | start
  fnGetFixingFreq(){
    //API req parameters modified by Urmila A | 21-Aug-23 | core migration
    this.fixingSubscriber = this.FXD_afs.FXDGet_FunctionValue_FXDC_API('ucp_GetFixingSettFrequencyforPivot',this.FXD_afs.EntityID)
      .subscribe((res:any)=>{
        try{
            if(res !== null){
              this.FixingFreqArr=[]  
              res=res.FunctionGenericOutput
                res = this.FXD_cfs.fnParseXML(res, 'fixingfreq')
                console.log('fiixng freq:',res)
                const foundIdx = res.findIndex(el => el == 'Weekly/Weekly')
                res.splice(foundIdx, 1)
                res.unshift('Weekly/Weekly')
                this.FixingFreqArr=res
                if(!this.IsNavigate){
                  this.pivotModel.SelectedFixingSettFreq=res[0]
                }
            }
        }catch(err){
          console.log(err)
        }
      })
  }
  //UrmilaA | LGTGTWINT-1895 | 13-june-23 | ends

}



