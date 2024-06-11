import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-barrier',
  templateUrl: './barrier.component.html',
  styleUrls: ['./barrier.component.scss' , '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})
export class BarrierComponent implements OnInit, OnDestroy {
  @Input() Product_ID: number;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  @Input() AppMode: string;

  //Urmila A | 13-Mar-23 | start
  @Input() Template_Name:any;  
  @Input() TemplateCode:any;  
  @Input() TemplateID:any; 
  @Input() AllProdData:any; 
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23
  @Input() ShowPriceProviderOnQEN:any; 
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;

  IsIALoggedIn: boolean;
  CustPrem: any;
  BookOrderRes: any=[]=[];
  screenHeight: number;
  screenWidth: number;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: any;
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  FXDOptionCutSubscriber: any;
  FXDFixingDateSubscriber: any;
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
  NoteToUnblock: any='';
  UnlockMsg: any;
  ClearLPs: boolean=false;
  IBPremToggle: boolean=false;
  ResetPricerFlag:boolean = false;
  scheduleBtnClick:boolean=false;
  cnt:any=0;
  GperiodChange: boolean=false;  
  ResetAllfieldsCalled: boolean=false;
  closeQuoteMail: boolean=false; 
  RMRemarkVisibility:boolean=false; 
  ClientPremDir:any=''; 
  PriceRecvFromLPs:any=0; 
  IsNavigate: boolean=false; 
  DealerRemarkVisibility:boolean=false; 
  NDFFlag: string='N';
  isMetal: string='N';
  SaveTradeEnabledFlag : boolean = false
  SaveTradeLoader : boolean = false
  disabledRoutetodealeronSaveTrade : boolean = false
  SavetradePopup : boolean = false
  NotionalToggle: boolean=false; 
  Remark: string;
  IsRMLoggedIn: boolean = false;
  IsRouteToDealerExecuted: boolean = false;
  OriginalIBPrem: any=0;
  DealingRFQID: string = '';
  RMRemark: string = '';
  ContractSummary: any = '';
  QueueStatus: string = '';
  AllDataLoaded = {
    barriers:false,
    productDetail:false,
    productinfo: true,
    ccypairs: false,
    optioncut: false,
    tenor: true, //modified by Urmila A | 18-feb-23
    priceprovider: false,
    bidask: false,
    datecalculation: false,
   
  };
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
  custPremDirection:any;
  IBPremDirection:any;
  QuoteMailSent:boolean=false
  AltNotional:any=0;
  IsAdvisoryLoggedIn:boolean=false;
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
  Parant_DCDRFQID:any;
  DI_YN:any;
  PriceRecAfterRepricefromBlotter:boolean=false;
  BlotterRFQ:any;
  RejectSubscriber:any;
  RejectRedirectedOrder:boolean=false;
  RejectedOrderMSG:any='';
  DealerLoggedIn:boolean=false;
  unlockNotemasterSubscriber:any;
  unlockNoteMasterYN:boolean=false;
  ccy1:boolean=false;
  ccy2:boolean=false;
  DIfromTradeIdea:any='';
  CurrencyChanged:boolean=false; //Added by Urmila A | 7-Jan-23
  CcySearch: any = ''; //Added by Urmila A | 11-Jan-23
  AllAPIsLoaded:boolean=false//Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
  PointShift:any; //27-feb-23
  UpfrontAlt:any;
  
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
  getScreenWidth: number;
  getScreenHeight: number;
  IBPremNotionalDecimal: any;
  SpreadRounding: any;
  PremDecimal: any;
  selectedCustomerSubscription: any;
  showPremAmt: any;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('Width:',this.getScreenWidth, 'Height',this.getScreenHeight)
  }
  NoteMasterID: string='';
  TenorDays: any;
  Notional: any;
  IBPrem: any;
  BarriersSubscrber: any;
  Barriers: any[]=[];
  knockInStyle: string;
  knockOutStyle: string;
  ViewScheduleflag: boolean;
  ScheduleVisibility: boolean;
  Clientperc: any='';
  selectedBarrierType: any='';
  customerName: string;
  PriceproviderArr: any[]=[];
  LPname: any;
  RouteFromQuoteHistory: any=false;
  noResponseRecv: boolean=false;
  //ends

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
  isProd = environment.production;

  private FXRatesubscription: Subscription;
  private TenorDayssubscription: Subscription;
  private FXBidAsksubscription: Subscription;
  private FXDatesCalculationsubscription: Subscription;
  private Bestpricesubscription: Subscription;
  private BookOrdersubscription: Subscription;
  private FXPriceProvidersubscription: Subscription;


  // Added by Urmila A | 13-Mar-22 | Start
  FXCurrencyPairsubscription: any;
  PersonalDefaultValueSubscriber:any;
  productInfoSubscriber: any;
  GetTenorSubscriber: any;
  getBidaskSubscriber: any;
  FXDProductDetailsSubscriber: any;
  FXDContractSummSubscriber: any;
  QuteMailClicked:boolean=false
  FXD_RFQDealDetailsNavigateSubscriber:any;
  RFQDetailsFromNoteMasterSubscrber:any;
  ScheduleSub:any; 
  SchedulePOP_UP_Subscriber:any;
  // Added by Urmila A | | 13-Mar-22 | End
  OrderDirection: any;
  Tenor: any;
  IBPremium: any;
  Strike: any;
  upfront: any;

  TradeDate: any;
  FixingDate: any;
  Premiumdate: any;
  MaturityDate: any;
  loadflag: boolean;
  OptionType: any;
  CurrencyPair: string = '';
  BidSpot: any;
  AskSpot: any;
  ClientPrem: any;
  UpfrontPer: any;
  BarrierType: any;
  ServiceResponse: any;
  CurrencyPairList:any[] = [];
  StrikePoint: any='';
  NotionalCCY: string;
  IBPremCCY: string;
  DepCcy: any;
  AltCcy: any;
  SelectedCurrencies = [];
  FXRateWithPair = [];
  AllDates = [];
  UpperBarrier: any='';
  LowerBarrier: any='';
  BestPrice: number;
  BestPriceabs: number;
  BestPriceProvider: string;
  BestPriceString: string;
  ResponseArray = [];
  DCDRfqId: string='';
  ExternalRfqId: string;
  OrderPlaceResponseArray = [];
  Orderplace: string;
  Errormsg: string;
  DateArray = [];
  d: any;
  LoadingBarrierFlag: boolean;

  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
  S = [];
  sampleString1: string;
  sampleArray = [];
  SampleArray = [];
  amount: string;
  tempNumber: number;
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
  XMLString: string;
  Delta: string;
  DeltaAmt: string;
  DeltaCcy: string;
  DealNo: string;
  ActualBarrier: string;
  OrderBlotterVisibility: boolean;
  PriceProviderString: string;
  UserID: string;
  LowerBarrierOnOff: boolean;
  UpperBarrierOnOff: boolean;
  OrderPlaceFlag: boolean;
  ClearPricingFlag: boolean = false;
  selectedCustomerDetails: any=[]=[];
  CustomerID: string = "";
  CustomerName: any;
  PricingModels = ['Black Scholes', 'Vanna Volga'];
  SeletcedPricingModel: string;
  disabledPrembtn: boolean;
  IBPremComment: any;
  ClientPremComment: string;
  SelectedPricingMode: string = 'Auto';
  SelectedLPForPricing: string = 'Best Price';
  PricingModes = ['Auto', 'Manual'];
  SelectedIBType: string = 'IB Pays';
  SelectedClientType: string = 'Client Pays';
  TenorOptions = [];
  OptionCutOptions = [];
  OptionCut: string;
  DisableCCYChangeControl: boolean = false;
  NotionalDecimalPointShift: number = 2;
  StrikeDecimalPointShift: number = 4;
  Asset2StrikeDecimalPointShift: number = 4;
  PipsMultiplier: number = 0;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;

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
  ExcoticCode:any=''; // RizwanS || 26 Jul 2023 
  RMMarginPercentage:any;  // RizwanS || 26 Jul 2023

  PreminPipsToggle :any; // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024

  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024

  ShowPriceProvider:boolean; // EFGUPINT-261 | Chaitanya M | 23-April-2024
  showPPDropdown:boolean;// EFGUPINT-261 | Chaitanya M | 23-April-2024
  
  OPTDEN_UseTwoStepDILogic : string = "NO"; // RizwanS || EFGUPINT-335 || 23 APr 2024

  constructor(
    public FXD_cfs: FxdCommonfunctionsService,
    private FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    public sanitize :SanitizeHtmlPipePipe,
    public CustAPI: CustomerApiService,
    public SignalR : FXDSignalRService,  //RFS | Urmila A, 18-May-23, LGTCLI-361
    private datepipe: DatePipe,
  ) {
    this.CustomerID = '';
    this.ServiceResponse = '';
    this.SeletcedPricingModel = '';
    this.disabledPrembtn = false;
    this.ClearPricingFlag = false;
    this.IBPremComment = '';
    this.ClientPremComment = '';
  }

  ngOnInit() {

    this.fnSetEntity(); //UrmilaA, 3-May-23 | LGTGTWINT-1949
     
    this.getScreenWidth = window.innerWidth; 
    this.getScreenHeight = window.innerHeight; 
    
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
    
    
    // Urmila A | check View schedule pop-up visibility | start | 8-Dec-22
    this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res => {
      if (res === false) {
        this.ViewScheduleflag = false
      } else {
        this.ViewScheduleflag = true
      }
    });
    // Urmila A | check View schedule pop-up visibility | end

   //Urmila A | Workflow RFQ Deal details | LGTGTWINT-561 | start
   this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes:any)=>{
    try{
      
        if(navigateRes.navigate === true && navigateRes.ProdcutCode === 'FXBARRIER'){
          console.log('after redirect data: ', navigateRes);
          this.BestPricelbl =  'Best Price' //Added by Lalit G || 31-05-24 || button label was not visible
          this.DI_YN = 'N'; //Added by Lalit G || 31-05-24
          this.IsNavigate = true;
          this.Mode = this.FXD_cfs.fngetMode(); //Urmila A | 15-Feb-23 | LGTCLI-286

            this.RFQDetailsFromNoteMasterSubscrber = this.FXD_afs.FXDGetRFQDetailsFromNoteMasterIDAPI(navigateRes.ReFNo, this.FXD_afs.UserName,this.Mode) //API req modified by Urmila A | 21-Aug-23 | Core migration 
            .subscribe((res:any)=>{
                  try{
                    if(res !== null){
                    console.log('RFQ from Note master: ',res,'RFQDetailsFromBlotterYes_QueueStatus',this.RFQDetailsFromBlotterYes_QueueStatus);                 
                        if(res.length === undefined){
                            // Redirect functionality changes added by Urmila A | code sync with 5Star | 9-Jan-24 | start
                            if(navigateRes.redirectFrom === 'blotter'){
                              this.DI_YN = 'N';
                              this.Parant_DCDRFQID = '';                      
                              this.NoteMasterID = ''//Urmila A | 27-Jan-23
                              this.DIfromTradeIdea = 'N';
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
                                  if(res.LockStatusMsg !== '' && res.LockStatusMsg.includes(this.FXD_afs.UserName)){
                                      this.NewOrderfromRMUnlocked=true;
                                      this.DI_YN = res.DI_YN;
                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                      this.NoteMasterID = navigateRes.ReFNo;
                                      this.fnRFQLockerForTimer();
                                  }else if(res.LockStatusMsg !== '' && !res.LockStatusMsg.includes(this.FXD_afs.UserName) ){
                                      this.NewOrderfromRMLocked =true;
                                      if(res.DI_YN === 'Y'){
                                        this.DI_YN = 'Y';
                                        this.Parant_DCDRFQID = res.ParentRFQNumber;
                                        this.NoteMasterID = navigateRes.ReFNo;
                                      }
                                      this.LockedDealPopUp=true;
                                    
                                  }else if(res.LockStatusMsg === ''){
                                      this.NewOrderfromRMUnlocked=true;
                                      this.DI_YN = res.DI_YN;
                                      this.Parant_DCDRFQID = res.ParentRFQNumber;
                                      this.NoteMasterID = navigateRes.ReFNo;
    
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
                            }else if(navigateRes.redirectFrom === 'quotehistory'){
                              this.RouteFromQuoteHistory=true;   
                            }
                          this.fnAssignDataLoadValues()  
                          this.OrderPlacedPopup=false;                          
                          this.fnSetRFQDetailsFromNotemasterID(res);  
                          this.fnButtonVisibility();   //Urmila A | 27-feb-23 | LGTGTWINT-1455                               
                        }
                        // Redirect functionality changes added by Urmila A | code sync with 5Star | 9-Jan-24 | ends

                      }else if(res == null){
                            // this.NotificationFunction("Error","Error" , res)
                      }
                                        
                  }catch(err){ throw err;  }
            }) 
        }else if(navigateRes.navigate === undefined || navigateRes.navigate === false ){
        }
    }catch(err) {  console.log(err) }
   });

  //Added by Urmila A, 18-May-23, LGTCLI-361 - start
  this.SignalRsubscriber = this.FXD_afs.FXDSignalRBroadcastMsgObs.subscribe((BroadCastMsg:any)=>{
    try{
        if(BroadCastMsg !== null && BroadCastMsg.length > 0){ // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
          console.log('recv broadcast msg:',BroadCastMsg )
          this.signalRMsgRecv=true;
          this.BroadCastData=BroadCastMsg       
          console.log('BKP BroadCastData res:',this.ServiceResponse)
          this.MapRFS(BroadCastMsg)
        }
    }catch(err){
      console.log('err:',err)
    }
  })
  //Added by Urmila A, 18-May-23, LGTCLI-361 - end

  this.fnGetProductConfig(); //Added by UrmilaA,fnGetProductConfig | LGTCLI-361 | //Added by UrmilaA, 11-Dec-23  
  this.getPremPercConfig();  //Added by UrmilaA | F5SAAINT-1174 | 9-Jan-24

   if(!this.IsNavigate){
    // this.getEntityData(); //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
      console.log('in barrier details from parent:', this.Product_ID,this.Product_Code,
      this.Product_Name, this.TemplateID,this.Template_Name, this.TemplateCode,'prod data',this.AllProdData)
      this.SetDefaultValues();
      this.fnButtonVisibility()
      if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
          this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
          this.AllDataLoaded.productDetail = true;
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
            this.AllAPIsLoaded=true;
          }
          this.gnGetBarriers();   
          this.fnGetPriceProviderandCcypairs();  
          this.fnGetFXDCurrencyPairs();
          this.fnGetTenor(); // Added by Chaitanya M | 18 Sep 2023
      }else{
          this.fnGetProductDetails(); 
      } 
      
   }
 
  }


   //Added by UrmilaA | HSBCFXEINT-51 | 9-Jan-24 | start
   getPremPercConfig(){
    this.FXD_afs.GetPremPercConfig(this.FXD_afs.EntityID).subscribe(res=>{
      try{
          if(res){
            console.log('prem perc config',res)        
            this.PremDecimal = res
          }
      }catch(error){}
    })
  }
  //Added by UrmilaA | HSBCFXEINT-51 | 9-Jan-24 | ends


  // Redirect functionality changes added by Urmila A | code sync with 5Star | 9-Jan-24 | start
  fnAssignDataLoadValues(){
    this.AllDataLoaded.barriers=true;
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;                        
    this.AllDataLoaded.datecalculation = true; //Urmila A | 2-Feb-23 | LGTGTWINT-1295
  }
  // Redirect functionality changes added by Urmila A | code sync with 5Star | 9-Jan-24 | ends


  //Added by Urmila A, 18-May-23 | LGTCLI-361 | start
 fnGetProductConfig(){
  //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
  this.fxdProdCofigSubsriber = this.FXD_afs.FXDGetProductConfigsAPI(this.FXD_afs.UserName,
  this.Product_ID).subscribe((res:any)=>{
    try{
          if(res ){
            res=res.Configs    
            console.log('product config res=> ', res)        
            if(res !== null || res.length > 0){   //conditions modified by Urmila A | 28-Aug-23 
               // res=res.GetProductConfigsResult.DC_Config.Configs
                res?.forEach(element => {
                      if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
		                   // Chanegs for MIn And MAx timepur | With discussion with Rahul | 14 Sep 2023
                        if(element.Value === "" || element.Value === undefined || element.Value === null){
                          this.MaxQuoteTimeout = "90"
                        }else{
                          this.MaxQuoteTimeout = element.Value
                        }                        
                        
                      }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
		                  	// Chanegs for MIn And MAx timepur | With discussion with Rahul | 14 Sep 2023
                        if(element.Value === "" || element.Value === undefined || element.Value === null){
                          this.MinQuoteTimeout = "30"
                        }else{
                          this.MinQuoteTimeout = element.Value
                        }                        
                        
                      }  

                      if(element.Setting_Name === 'OPTDEN_PrincipalBankNameinLPGrid') {
                        this.LPname=element.Value;
                      }    
                      //Added by UrmilaA | F5SAAINT-870 , HSBCFXEINT-51| 9-Jan-24 | code sync with 5star| start
                      if(element.Setting_Name == 'OPTDEN_SalesSpreadRoundingDecimals'){
                        this.SpreadRounding = element.Value;
                        this.upfront= this.FXD_cfs.numberWithCommas(Number(this.upfront).toFixed(this.SpreadRounding))
                      }
                      // Start : F5SAAINT-2582 | Added for setting the value if config is missing | Chaitanya M | 08-Feb-2024
                      else{
                        this.SpreadRounding = "4";
                        this.upfront= this.FXD_cfs.numberWithCommas(Number(this.upfront).toFixed(this.SpreadRounding))
                      }
                      // end : F5SAAINT-2582 | Added for setting the value if config is missing | Chaitanya M | 08-Feb-2024
                      //Added by UrmilaA | F5SAAINT-870  HSBCFXEINT-51 | 9-Jan-24 | code sync with 5star|  ends      

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
              }else if(res == null){//conditions modified by Urmila A | 28-Aug-23
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
    console.log('coming entity data:', this.EntityData)
    sessionStorage.setItem('FXD_EntityID', this.EntityData[0].code)
    // this.FXD_afs.SetCredentials() 

    //cust details added by Urmila A | 31-Aug-23
    this.CustomerID = sessionStorage.getItem('FXD_CustID')
    this.customerName = sessionStorage.getItem('FXD_CustName')
    
    console.log('this.CustomerID',this.CustomerID)
    //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
    if(this.EntityData[0].code === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';             
    }
    //end
  }

  // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 15-Dec-22
  fnSetRFQDetailsFromNotemasterID(data){
    this.TemplateCode = this.TemplateCode;
    this.TemplateID = this.TemplateID
    this.selectedProduct = data.Product_Code;
    this.Product_Code = data.Product_Code;  //Urmila A | 23-Jan-23 | LGTGTWINT-1170
    this.Product_Name= data.Product_Name
    this.Product_ID = data.Product_Id; 
    this.AltCcy = data.Alternate_Ccy;
    this.DepCcy = data.Deposit_Ccy;    
    this.OptionType=data.Option_Class;
    this.custPremDirection = data.CustPayReceiveDir;
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila A | 17-feb-23 | LGTCLI-314
    this.ClientPremComment = this.FXD_cfs.fngetClientPremComment(data.CustPayReceiveDir); // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
    this.CcySearch = this.CurrencyPair =  data.Deal_Pair; //Added by Urmila A | 11-Jan-23      
    this.fnPointShift(data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23

    //mappings mofified by UrmilaA | 9-Jan-24 | HSBCFXEINT-33 | start
    this.OrderDirection = data.RFQ_Deal_Dir === 'B' ? 'Buy' :  this.OrderDirection = 'Sell';  // UrmilaA | 9-Jan-24 | 
    data?.RFQ_Deal_Dir == 'S' ? this.OrderDirection = 'Sell' : this.OrderDirection =  'Buy';   
    this.Notional = this.FXD_cfs.numberWithCommas(data.OptionNotional !== '' ? Number(data.OptionNotional).toFixed(2) : "");

    let barrier = {code: data.BarrierType, value: data.BarrierType }
    this.Barriers.push(barrier)
    this.selectedBarrierType =  data.BarrierType;
    //mappings mofified by UrmilaA | 9-Jan-24 | HSBCFXEINT-33 | ends


    if(this.EntityData.length > 0){
      let entity = {
        Code: data.Entity_ID,Value: data.Entity_Name
      }
      if(!this.EntityData.filter(e => e.Code === data.Entity_ID)){
        this.EntityData.push(entity);
      }
    }

    let optioncut =data.OptionCut
    this.OptionCutOptions.push(optioncut);
    this.BlotterRFQ = data.ParentRFQNumber;
    if(this.RouteFromQuoteHistory){
      this.Parant_DCDRFQID = data.ParentRFQNumber; 
    }

    if(this.RouteFromWorkflow){
      this.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.Premiumdate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.FixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date);
      this.MaturityDate = this.FXD_cfs.convertDate(data.Deposit_End_Date);
    }else if(this.RouteFromQuoteHistory){
      this.TradeDate = this.FXD_cfs.convertDate(new Date())
    }

    this.UpperBarrier = data.OptionUpperBarrier !== '0' ? this.FXD_cfs.numberWithCommas(Number(data.OptionUpperBarrier).toFixed(4)) : ''; //formatter added by Urmila A |  F5SAAINT-576 | 9-jan-24
    this.LowerBarrier = data.OptionLowerBarrier !== '0' ? this.FXD_cfs.numberWithCommas(Number(data.OptionLowerBarrier).toFixed(4)) : ''; //formatter added by Urmila A |  F5SAAINT-576 | 9-jan-24
    //below added temperaly
 
    this.ActualBarrier = data.ExoticType; // HSBCFXEINT-15 | Chaitanya M | 06 Dec 2023
    this.OptionCut =data.OptionCut;
    this.TenorDays =data.Option_Days;
    this.Tenor = data.Input_Tenure;
    this.TenorOptions.push(data.Input_Tenure)
    
    this.NotionalCCY = data.Deposit_Ccy;
    this.IBPremCCY = data.RFQ_Prem_Ccy;


    // Start - HSBCFXEINT-33 | Chaitanya M | 14 Dec 2023
    //mappings mofified by UrmilaA | 9-Jan-24 | HSBCFXEINT-51 | start
    this.upfront = this.FXD_cfs.numberWithCommas(Number(data.Spread_PA).toFixed(this.SpreadRounding).replaceAll('-',''));  // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    if(data.RFQ_Mkt_Prem_Amt2.includes(',')){ //Added by Urmila A | LGTGTWINT-890 | 9-Jan-23
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt2.replaceAll(',','')).toFixed(this.PremDecimal).replaceAll('-','')); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    }else{
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt2).toFixed(this.PremDecimal).replaceAll('-','')); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    }

    this.IBPremium =  this.getIBPremValue(data.RFQ_Mkt_Prem_Amt1); 
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2).replaceAll('-',''));  //upfront in Alt ccy// HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2).replaceAll('-','')); //upfront in USD // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023
    this.Clientperc = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Cust_Prem_Pct1).toFixed(this.PremDecimal)) 
    this.ClientPrem = this.findClientPrem(Number(data.ParentRFQIBPremium.replaceAll(',','')), Number(data.Premium_PC),Number(data.Spread_Amt),false);
    //mappings mofified by UrmilaA | 9-Jan-24 | HSBCFXEINT-51 | ends

    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");
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
    this.OriginalIBPrem = Number(data.ParentRFQIBPremium.toString().replace(',','')).toFixed(2); //Added by Urmila A | 12-Jan-23 | LGTGTWINT-1018
    this.OriginalIBPremPer = data.Market_Premium_PC;     
    // this.OrderDirection = data.Product_Code === 'FXAQ' ? 'Buy' : 'Sell';  // HSBCFXEINT-15 | Chaitanya M | 06 Dec 2023
    this.RFQLockedBy = data.LockStatusMsg;
    
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
        
    if(!this.ExecutedQueue){     
      this.gnGetBarriers();   
      this.fnGetProductDetails();
      this.fnGetPriceProviderandCcypairs() 
      this.fnGetOptionCutFXD();         
    }if(this.ExecutedQueue){
      this.fnGetProductDetails();
    }   
  
    this.fnGetSelectedCCYDetails()  //Added by UrmilaA | 9-Jan-23 |  F5SAAINT-1174
      
 }


 //modified by Urmila A | 20-Mar-23
  SetDefaultValues(){
    this.Errormsg=''
    this.CurrencyPair = 'EUR - USD';
    // this.CustomerID = this.HomeAPI.CustomerName;
    this.Delta = null;
    this.DeltaAmt = null;
    this.DeltaCcy = '';
    this.LoadingBarrierFlag = false;
    this.d = new Date();
    let Daystring;
    const Day = this.d.getDate();
    if (Day < 10) {
      Daystring = '0' + Day;
    } else {
      Daystring = '' + Day;
    }
    this.TradeDate = Daystring + '-' + this.months[this.d.getMonth()] + '-' + this.d.getFullYear();
    this.LowerBarrier = '';
    this.UpperBarrier = '';
    this.OrderDirection = 'Sell';

    this.StrikePoint = 0;
    this.Tenor = '6M';
    this.TenorDays = 183; // Added by Chaitanya M | 18 Sep 2023
    this.OptionType = 'Call';
    this.upfront = (0).toFixed(4);
    this.UpfrontVal=(0).toFixed(2);
    this.UpfrontAlt=(0).toFixed(2);
    this.Notional = '100,000.00';
    this.OrderBlotterVisibility = false;
    this.PriceProviderString = '';
    this.OrderPlaceFlag = false;
    this.ServiceResponse = null;
    this.SeletcedPricingModel = 'Black Scholes';
    this.OptionCut = '';
    this.ClientPrem = '';
    this.IBPremium = '';
    this.custPremDirection='';
    this.IBPremDirection='';
    this.BestPrice=null;
   
    this.Parant_DCDRFQID = '';
    this.DI_YN = 'N';
    this.RMRemark = '';
    this.DealerRemark = '';
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
    clearInterval(this.RFQLockedInterval);
    this.ccy1 = false;
    this.ccy2 = false;
    this.ClearLPs = false;
    this.DIfromTradeIdea = '';
    this.CurrencyChanged=false; 
    this.BarrierType = this.selectedBarrierType = 'Knock-In' // Chaitanya M | 21 Sep 2023
    this.ActualBarrier = 'DAO';  // Chaitanya M | 21 Sep 2023
    this.ExcoticCode = 'DAOC'; // Chaitanya M | 21 Sep 2023
    this.knockInStyle = '' // Chaitanya M | 21 Sep 2023
    this.knockOutStyle = 'American'
    this.LowerBarrierOnOff = true;
    this.UpperBarrierOnOff = false; // Chaitanya M | 21 Sep 2023
    this.PreminPipsToggle = "%"; // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
    this.BestPricelbl =  'Best Price' // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
  }


  getEntityData(){
    //removed EntityId from req params by UrmilaA | 24-april-23
    this.FXDEntitySubscriber =   this.FXD_afs.getEntityData(this.Product_Code)//Core migration : API req paarms modified by Urmila A | 23-Aug-23
    .subscribe((res:any)=>{
      console.log("entity data", res);
      try{
        if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetEntityDataResult)){
          if(res.GetEntityDataResult.CVPResponse.CVPData){
            this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
            sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code)
            this.FXD_afs.SetCredentials() //LGTGTWINT-1898, UrmilaA, 24-april-23
            //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
            if(this.EntityData[0].code === '50'){
                  this.CustomerID = '50';
                  this.customerName = 'CustomerPB';
                  
            }//end
          }
        }
      }catch(err){}
    });
  }
  
  //modified by UrmilaA, 24-April-23 | LGTGTWINT-1898 | start
  chngEntity(e){
    if(e.target.value === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';   
    }
    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)
    this.FXD_afs.SetCredentials() //UrmilaA, 3-May-23 | LGTGTWINT-1949
    this.SetDefaultValues();
    this.fnButtonVisibility()
    this.fnGetPriceProviderandCcypairs();  
    this.fnGetFXDCurrencyPairs();
  }
  //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 | ends


  //Added by Urmila A | LGTGTWINT-1455 | 13-Mar-23 | start
  fnButtonVisibility(){
    let chkMode = this.FXD_cfs.fngetMode();
    this.isSchedulevisible = false; // Chaitanya M | 01-April-2024
    this.isEmailQuoteVisible = this.isResetvisible = true;

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
    }else{ 
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
                //this.CustAPI.getPledgedAgainstData(ReqConfig) , fngetCommondata added by Urmila A | 29-Aug-23
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
                        }catch(err){ }                                                              
                    }              
                  });
                
                  break;
            case 'FXD_Spread_Btn_Visibility':
              this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                      try{
                          res = res.cvpData; //mappings modified by Chaitanya M | 29-Nov-23
                          res.forEach(element => {                          
                                if (chkRoute.toUpperCase() === element.code.toUpperCase() ) {    //mappings modified by UrmilaA | 9-Jan-24                                                     
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
      this.FXD_afs.UserName, //Urmila A | 31-Aug-23
      this.PricingMode, //Core migration: API req parameters are modified | Urmila A | 22-Aug-23   
    ).subscribe( (res) => {
      if (res !== null && res.length > 0) {  ///Urmila A | 31-Aug-23
        this.AllDataLoaded.priceprovider = true;
        this.PriceProviderString='';
        this.SampleArray = this.PriceproviderArr = res
        //changes added by Urmila A, 4-may-23, to get Price provider string , made common function
        this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)
        this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
      }
      console.log('Lps:',this.SampleArray)   

      // commented by Urmila A | 9-Jan-24 | code sync with 5star
      // if(this.RouteFromWorkflow){
      //   this.fnGetSelectedCCYDetails();
      // }
      //end by Urmila A | 11-Jan-23
      
      if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
      this.AllAPIsLoaded=true;
      }
      
    });

  }

  //added by Urmila A | 23-mar-23
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

  //Added by Urmila A | 11-Jan-23 | LGTCLI-246 | start
  fnGetSelectedCCYDetails(){
    this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs(  //Core migration: API req params modified by Urmila A | 24-Aug-23
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
              if(res.length > 0 && res !== null){ //check updated by Urmila Ahire | 31-Aug-23
                  this.AllDataLoaded.ccypairs = true;
                  res.forEach(async (element) => {
                    this.CurrencyPairList.push(element);             
                      //mappings modified by Urmila A | 31-Aug-23 | as service side 
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


  //Added by Urmila A 
  fnGetProductDetails(){
    try {
      this.AllAPIsLoaded=false; 
       //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
      this.prodDetailSubscriber=this.FXD_afs.fnGetProdDetailsFXD(this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
        if (res !== null)  { //mappings modified by Chaitanya M | 29-Nov-23
          this.AllDataLoaded.productDetail = true;
          res = res[0]; //mappings modified by Chaitanya M | 29-Nov-23
          this.TemplateCode = res.Template_Code;
          this.Product_Name = res.Product_Name;
          this.TemplateID = res.Template_Id;
          this.Product_ID = res.Product_Id;
          this.Product_Code = res.product_code;
        
          if(!this.RouteFromWorkflow){ 
            this.fnGetPriceProviderandCcypairs();  
            this.fnGetFXDCurrencyPairs();
            this.fnGetTenor(); // Added by Chaitanya M | 18 Sep 2023
          }   
        }
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
          this.AllAPIsLoaded=true;
        }
      });
     
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Added by Urmila A | 20-Mar-23
  fnAssignProdDetails(prodCode){
    this.AllProdData.forEach(element => {
      if(element.product_code.toLowerCase() === prodCode.toLowerCase()){
              this.Product_ID = element.Product_Id;
              this.Product_Name = element.Product_Name;
              this.Product_Code = element.product_code;
              this.Template_Name = element.Template_Name;
              this.TemplateCode = element.Template_Code;
              this.TemplateID = element.Template_Id;
              if(!this.RouteFromWorkflow){
                this.fnGetPriceProviderandCcypairs();  
                this.fnGetBidAskRates() //Added by Urmila A | code sync with 5Star | 9-Jan-24
                this.fnGetContractSummary()             
                if(!this.ProdChangedYN){
                  this.fnGetFXDCurrencyPairs();
                }                
              }
      }
    });
 }

  fnGetFXDCurrencyPairs(){
    this.AllDataLoaded.ccypairs = false;
     this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
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
      if (res.length > 0 && res !== null) { //check updated by Urmila Ahire | 31-Aug-23
        this.CurrencyPairList = res
        this.AllDataLoaded.ccypairs = true;     
        res?.forEach( (element, index) => {
          if (this.CurrencyPairList[index].asset_Pair === 'EUR - USD') {
            this.CurrencyPair = this.CurrencyPairList[index].asset_Pair;
            console.log('ccy pair:',this.CurrencyPair)
            this.DepCcy = this.CurrencyPair.slice(0, 3);
            this.AltCcy = this.CurrencyPair.slice(6, 9);
            this.NotionalCCY = this.DepCcy;
            this.IBPremCCY = this.DepCcy;
            //mappings modified by Urmila A | 31-Aug-23 | as service side 
            this.Pair_Cross_YN = element.pair_Cross_YN;
            this.Left_USD_Pair = element.left_USD_Pair;
            this.Right_USD_Pair = element.right_USD_Pair;  
            this.fnGetBidAskRates();        
            this.fnGetOptionCutFXD();
            this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
            this.Asset2_DecimalAmount = element.asset2_DecimalAmount;  


            //Added by UrmilaA | HSBCFXEINT-51| 9-Jan-24 | code sync with 5star | start
            this.fnChangePremCCY() //UrmilaA | F5SAAINT-585 | 5-Dec-23
            this.fnSetNotionalDecimal();  //Added by UrmilaA | F5SAAINT-1174 | 11-Dec-23
            //Added by UrmilaA | HSBCFXEINT-51| 9-Jan-24 | code sync with 5star | ends

          }
        });
        if (this.Pair_Cross_YN === 'Y') {
          this.FindLeftUSDMidRate(this.Left_USD_Pair);
          this.FindRightUSDMidRate(this.Right_USD_Pair);
        }
        this.FXD_cfs.sort_by_key(this.CurrencyPairList, 'asset_Pair');
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
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
        //Mapping modified by Urmila A | 31-Aug-23
        this.AllDataLoaded.bidask = true;
        // this.LeftUSDMidrate = res?.MidRate;               
     
        this.LeftUSDMidrate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                              + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 

        console.log('left USD Midrate:', this.LeftUSDMidrate);
        if(!this.RouteFromWorkflow){ 
          this.GetStrikeRate();
        }
       
      }
    });
  }
  FindRightUSDMidRate(RightCCY){
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB( //API req params modified by Urmila A | 21-Aug-23 | Core migration
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
                                
        console.log('Right USD Midrate:', this.RightUSDMidRate);
        if(!this.RouteFromWorkflow){ //Added by Urmila A | 11-Jan-23
          this.GetStrikeRate();
        }
      }
    });
  }

  //Added by Urmila A | 14-mar-23 | start
  //HSBCFXEINT-11 | ChaitanyaM | 24-May-2024
  //------------------------STart----------------
  fnFindUpfrontUSD(){
    try{
      if(this.IBPremToggle || this.NotionalToggle){
        if(this.UpfrontAlt !== ''){ //added by Urmila A | 11-Jan-23 | | LGTCLI-244

          if( this.Notional !== undefined || this.Notional !== '')  {
            if(this.IBPremCCY === this.DepCcy && this.NotionalCCY === this.AltCcy){
              this.UpfrontVal = (parseInt(this.Notional.replaceAll(/,/g, ''), 10) / parseFloat(this.StrikePoint.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(',','')) / 100)) //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
            }else if(this.IBPremCCY !== this.NotionalCCY){
                this.UpfrontVal = parseInt(this.Notional.replaceAll(/,/g, ''),10) * parseFloat(this.StrikePoint.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(',','')) / 100); //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
            }else{
                this.UpfrontVal = (parseInt(this.Notional.replaceAll(/,/g, ''), 10) * parseFloat(this.upfront.replaceAll(',',''))) / 100; //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
            }
            // START | Gaurav M | 06-march 2024 | F5SAAINT-3188 | formatting for Upfront Value
            try {
              //mappings modified by Urmila A | 29-Nov-23
              this.CurrencyPairList.forEach((element) => {
                if (element.asset_Pair === this.CurrencyPair) {
                  if (this.IBPremCCY === element.asset1) {
                    this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
                  } else if (this.IBPremCCY === element.asset2) {
                    this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
                  }            
                  this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(this.NotionalDecimalPointShift))        
                }
              });
            } catch (ex) { }
          }
        }  
      }

      if(this.Notional !== '' || this.Notional !== undefined || this.Notional !== '0.00'){
        if(this.IBPremCCY === this.DepCcy && this.NotionalCCY === this.AltCcy){
          this.UpfrontVal =  (Number(this.Notional.replaceAll(',','')) / Number(this.StrikePoint.replaceAll(',','')) ) * (Number(this.upfront.replaceAll(',','')) / 100) //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }else if(this.IBPremCCY !== this.NotionalCCY){
          this.UpfrontVal = (Number(this.Notional.replaceAll(',','')) * Number(this.StrikePoint.replaceAll(',','')) * (Number(this.upfront.replaceAll(',','')) /100)) //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }else{
          this.UpfrontVal = (Number(this.Notional.replaceAll(',','')) * Number(this.upfront.replaceAll(',','')) ) / 100; //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }
        // START | Gaurav M | 06-march 2024 | F5SAAINT-3188 | formatting for Upfront Value
        try {
          //mappings modified by Urmila A | 29-Nov-23
          this.CurrencyPairList.forEach((element) => {
            if (element.asset_Pair === this.CurrencyPair) {
              if (this.IBPremCCY === element.asset1) {
                this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
              } else if (this.IBPremCCY === element.asset2) {
                this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
              }
              this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal.toFixed(this.NotionalDecimalPointShift))        
            }
          });
        } catch (ex) { }
      }
      //formattor changes addde by Urmila A | 9-Jan-24 | code sync with 5star | ends
  
      // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
      if(this.PreminPipsToggle === "Pips"){

        let _Pipsmultipler = this.FXD_cfs.multiplyByMultiplier(10, Number(this.PointShift));

        if(this.IBPremCCY !== this.NotionalCCY){
    
          this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * (Number(this.Notional.replaceAll(',','')))) / _Pipsmultipler ;  
    
        }else{
    
          if(this.NotionalCCY === this.DepCcy){
    
            this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * (Number(this.Notional.replaceAll(',','')) * Number(this.StrikePoint.replaceAll(',',''))) ) / _Pipsmultipler ;  
            
          }else{
    
            this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * (Number(this.Notional.replaceAll(',','')) / Number(this.StrikePoint.replaceAll(',',''))) ) / _Pipsmultipler ;  
          
          }
          
        }

        this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(this.UpfrontVal).toFixed(2));
      
      }
      // End: HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

      this.UpfrontVal =  this.UpfrontVal.replaceAll(',','') //Urmila A | 1-Feb-23 |LGTCLI-287
      //calculating Upfront (USD) conversion
  
      if (this.Pair_Cross_YN === 'N') {
        if (this.DepCcy === 'USD' || this.DepCcy.includes('USD')) {
          if (this.NotionalCCY === this.DepCcy && this.IBPremCCY === this.DepCcy) {
            this.UpfrontAlt = this.UpfrontVal / 1;
          } else if (
            this.NotionalCCY === this.AltCcy &&
            this.IBPremCCY === this.DepCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / 1;
          } else if (
            this.NotionalCCY === this.DepCcy &&
            this.IBPremCCY === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / this.SpotMidRate;
          } else if (
            this.NotionalCCY === this.AltCcy &&
            this.IBPremCCY === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal / this.SpotMidRate;
          }
        } else {
          if (this.NotionalCCY === this.DepCcy && this.IBPremCCY === this.DepCcy) {
            this.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
          } else if (
            this.NotionalCCY === this.AltCcy &&
            this.IBPremCCY === this.DepCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal * this.SpotMidRate;
          } else if (
            this.NotionalCCY === this.DepCcy &&
            this.IBPremCCY === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal;
          } else if (
            this.NotionalCCY === this.AltCcy &&
            this.IBPremCCY === this.AltCcy
          ) {
            this.UpfrontAlt = this.UpfrontVal;
          }
        }
      }else if (this.Pair_Cross_YN === 'Y') {
      console.log('left USD:',this.Left_USD_Pair,'Right USD:',this.Right_USD_Pair);
	  
      // Start - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
      if(this.Left_USD_Pair.includes(this.IBPremCCY)){
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.Left_USD_Pair) {            
            if(element.asset1 === "USD" ){
              this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal / this.LeftUSDMidrate : this.GetLeftUSDMidRate(this.Left_USD_Pair,this.UpfrontVal,true);
            }else if(element.asset2 === "USD" ){
              this.LeftUSDMidrate !== '' ? this.UpfrontAlt = this.UpfrontVal * this.LeftUSDMidrate : this.GetLeftUSDMidRate(this.Left_USD_Pair,this.UpfrontVal,false);
            }               
          }
        });
      }else if(this.Right_USD_Pair.includes(this.IBPremCCY)){
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
      
      // End - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
       
      }

      this.UpfrontVal = this.FXD_cfs.numberWithCommas(this.UpfrontVal)
      //Added by Urmila A | 11-Jan-23 | start | LGTCLI-246
      if(typeof this.UpfrontAlt === "string" &&  this.UpfrontAlt !== ''){ //modified by Urmila A | 4-Jan-24 | formatting not appending
      this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
      }else if(typeof this.UpfrontAlt === "number"){
          this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
      }
      //Added by Urmila A | 11-Jan-23 | end
  
      console.log('Upfront USD:',this.UpfrontAlt);

    } catch (error) { 
      console.log(error.message);
    }
  
  }
  //-------------------END----------------
  //HSBCFXEINT-11 | ChaitanyaM | 24-May-2024
    // Urmila A | 11-Nov-22 |  end

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
  // End - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023

  // Start - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
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
                                    
          this.UpfrontAlt = isUSD===true ? ( UpfrontVal / this.RightUSDMidRate ) : ( UpfrontVal * this.RightUSDMidRate );
          if(typeof this.UpfrontAlt === "string" && !this.UpfrontAlt.includes('')){ //modified by Urmila A | 14-feb-23
            this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(this.UpfrontAlt).toFixed(2));
          }else if(typeof this.UpfrontAlt === "number"){
              this.UpfrontAlt = this.FXD_cfs.numberWithCommas(this.UpfrontAlt.toFixed(2));
          }
  
        }
    });
  }
  // End - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023

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
      if(res.length > 0 && res !== null) //modified by Urmila A | 29-Aug-23  
      {     
          this.AllDataLoaded.optioncut = true;
          res.forEach((element,i) => {       
            if (element.OptionCut === 'TOK') {
              res.splice(i,1)
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

          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }   
      }     
      else
      {
        this.AllDataLoaded.optioncut = true;
      //  this.NotificationFunction("Error","Error" , res.Get_OptionCutResult.A_ResponseHeader.FailedReason)
      }
    });
  }


  //Urmila A | 14-mar-23 | start
  fnGetBidAskRates() {
    this.AllAPIsLoaded=false;  
    this.AllDataLoaded.bidask = false;
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
    this.Product_Code,
    this.CurrencyPair,
     this.FXD_cfs.fngetMode(),
     this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res) { 
        //Mapping modified by Urmila A | 31-Aug-23
        this.AllDataLoaded.bidask = true;
        this.PointShift = Number(res.PointShift);
        this.BidSpot = (parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        this.AskSpot = (parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
       
        this.PipsMultiplier = Number(res.PipsMultiplier);
        this.SpotMidRate = ((Number(this.AskSpot) + Number(this.BidSpot)) / 2 ).toFixed(this.PointShift); //modified by Urmila A | 23-oct-23
       
        this.GetStrikeRate();
        this.fnUpdatePointShifts(this.PointShift); //UrmilaA | 9-Jan-24 | F5SAAINT-528 | code sync with 5star
        // this.StrikeHighlighter();

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  //Urmila A | 14-Mar-23 
  fnGetDatesCalculationforVB() {
    this.FixingDate = '';  // Urmila A | 6-Sep-22
    this.MaturityDate = ''; // Urmila A | 6-Sep-22
    this.AllAPIsLoaded=false;
    this.FXD_afs.GetDatesCalculationforVB(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.DepCcy,
      this.AltCcy,
      '',
      '',
      this.Tenor,
      this.OptionCut,
      this.TradeDate,
      this.Mode, //Core migration: API req parameters modified by Urmila A | 22-Aug-23
      '',
      '' 
    ).subscribe((res) => {
        //mappings modified by Urmila A | 1-Sep-23
        if (res !== null) {
        this.AllDataLoaded.datecalculation = true;   
        this.Premiumdate = res[0].valueDate;
        this.FixingDate = this.datepipe.transform(res[0].fixingDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.MaturityDate = this.datepipe.transform(res[0].maturityDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.TenorDays = res[0].expiryDays;        
        if(!this.IsNavigate){
          this.fnGetContractSummary();
        } //RizwanS || RTD data binding issue || 03 Aug 2023     

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }


  //Added by Urmila A | 14-Mar-23 | start
  gnGetBarriers(){
    this.AllAPIsLoaded=false;
        this.BarriersSubscrber = this.FXD_afs.fngetCommondata('BarrierTypeAll')
        .subscribe((res:any)=>{
          try{
            //mappings modified by Urmila A | 1-sep-23
              if(res !== null 
                && res !== undefined){
                  console.log('barriers:', res)   
                  this.AllDataLoaded.barriers = true;
                  this.Barriers = res.cvpData

                   //added by UrmilaA | F5SAAINT-1182 | 9-Jan-24 | code sync with 5Star | start  
                   // Start : HSBCFXEINT-57 | mapping updated | Chaitanya M | 25-Jan-2024
                   if(!this.IsNavigate){
                    this.selectedBarrierType = this.Barriers[0].value 
                   }else{
                      this.Barriers.forEach(element => {
                        if(element.value == this.selectedBarrierType){
                          this.selectedBarrierType = element.value
                        }
                      });
                  }
                  this.fngetBarrierDetails();
		  // End : HSBCFXEINT-57 | mapping updated | Chaitanya M | 25-Jan-2024
                  //added by UrmilaA | F5SAAINT-1182 | 9-Jan-24 | code sync with 5Star | ends  


                  if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
                    this.AllAPIsLoaded=true;
                  } 
              }
          }catch(err){
            console.log('error:', err)
          }
        })
  }

  fnGetContractSummary() {

    this.fngetBarrierDetails(); // Chaitanya M || Barrier data binding issue || 21 Sep 2023

    if (this.CurrencyPair == null || this.CurrencyPair == undefined)
      return;
    
    //formattor changes addde by Urmila A | 9-Jan-24 | code sync with 5star | start
    console.log('all data loaded', this.AllDataLoaded, this.AllAPIsLoaded)     
    this.ContractSummary = ''
    Number(this.Notional.replaceAll(/,/g, '')) > 0 ?  this.NotionalCCY === this.DepCcy ?  parseInt(this.Notional.replaceAll(/,/g, ''), 10) / Number(this.StrikePoint.replaceAll(/,/g, '')) : 
    parseInt(this.Notional.replaceAll(/,/g, ''), 10) * Number(this.StrikePoint.replaceAll(/,/g, '')) : ''
      
    this.FXDContractSummSubscriber =  this.FXD_afs.fnGetContractSummary(
      Number(this.FXD_afs.EntityID), 
      this.FXD_afs.UserName,
      // this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
      this.TemplateCode.toUpperCase(),
      this.Product_Code, 
      (this.OrderDirection || ''), //HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
      this.CurrencyPair,
      this.OptionType,
      this.NotionalCCY,
      this.NotionalCCY === this.DepCcy ? this.AltCcy : this.DepCcy,
      this.IBPremCCY,
      Number(this.Notional.replaceAll(/,/g, '')) > 0 ? Number(this.Notional.replaceAll(/,/g, '')) : 0 ,  
      Number(this.Notional.replaceAll(/,/g, '')) > 0 ? Number(this.Notional.replaceAll(/,/g, '')) : 0 , //notionalperfixing
      this.TenorDays.toString(),  //Urmila A | 9-Mar-23 |LGTGTWINT-1691 //this.Tenor
      this.FixingDate,
      this.MaturityDate,//settlement
      '',//longdate
      '', //shortdate
      Number(this.StrikePoint.replaceAll(/,/g, '')) > 0 ?  Number(this.StrikePoint.replaceAll(/,/g, '')).toFixed(this.PointShift) : "0",
      this.OptionCut,
      this.selectedBarrierType,//barriertype || Chaitanya M | 26 July 2023 , HSBCFXEINT-57 | mapping updated | Chaitanya M | 25-Jan-2024
      (this.ExcoticCode || ''),//Exotic code //RizwanS || 26 Jul 2023
      '',// digitaltype
      this.UpperBarrier !== '' ? this.UpperBarrier.includes(',') ? this.UpperBarrier.replaceAll(/,/g, '') : this.UpperBarrier : '0',//upperbarrier 
      this.LowerBarrier !== '' ? this.LowerBarrier.includes(',') ? this.LowerBarrier.replaceAll(/,/g, '') : this.LowerBarrier :'0',//lowerbarrier
      '0', //leverage factor
      '0', //noofsettle
      '0',//No of fixing
      '', //fixingfreq
      '',//sett freq
      '0',//lower strike
      '0',//upper strike
      '0',//pivot strike
      '',//spread type
      this.custPremDirection,//cust prem dir
      this.BestPrice ? this.IBPremDirection : '', //IB prem dir //Urmila A | 1-Feb-23 | LGTGTWINT-1209
      this.BestPrice ? this.IBPremium  ? Number(this.IBPremium.replaceAll(/,/g, '')).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2), //Urmila A | 1-Feb-23 | LGTGTWINT-1209 
      this.ClientPrem ? Number(this.ClientPrem.replaceAll(',','')).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2), //RTC , modified by Urmila a | F5SAAINT-295 | 15-Nov-23
      this.BestPrice ? this.IBPrem ? this.IBPrem.includes(',') ? Number(this.IBPrem.replaceAll(/,/g, '')).toFixed(this.PremDecimal ? this.PremDecimal : 4) : Number(this.IBPrem).toFixed(this.PremDecimal ? this.PremDecimal : 4): (0).toFixed(this.PremDecimal ? this.PremDecimal : 4) : (0).toFixed(this.PremDecimal ? this.PremDecimal : 4),//IB prem perc , LGTGTWINT-685, //Urmila A | 1-Feb-23 | LGTGTWINT-1209
      this.Clientperc ? Number(this.Clientperc).toFixed(this.PremDecimal ? this.PremDecimal : 4) : (0).toFixed(this.PremDecimal ? this.PremDecimal : 4), //RTC perc , modified by Urmila a | F5SAAINT-295 | 15-Nov-23
      '0',//Target
      '0',//target notional
      (this.knockInStyle === undefined || this.knockInStyle == '') ?  'No' :this.knockInStyle ,//KI style 
      '0', //lower KI
      '0',//UpperKI 
      '',//Guarentee till , modified by Urmila A | 30-Jan-23
      '0', //Guaranteed Periods  | 30-Jan-23
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
        try{
          // Response mapping, errors handling done by Urmila A | 9-Jan-24 | starts
          if(res.errors == undefined){
            console.log(res);
            this.ContractSummary='' ; // Urmila A | 30-Jan-23
            res =  res.result.toString().replaceAll("\\n", "<br>"); // Urmila A | 28-Jan-23
          
              if(res.includes('color:green')){
                this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:green","color:var(--green) !important"))
              }else if(res.includes('color:red')){
                this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:red","color:var(--red) !important"))
              }  
              
              if(res == ""){ 
              this.ContractSummary = 'No response received'
              }
            console.log('contract summ: ', this.ContractSummary)  
          }else{
              let key = Object.keys(res.errors)
              let Error = res.errors[key[0]]
              this.NotificationFunction("Error", "Error", Error);
          }
          // Response mapping, errors handling done by Urmila A | 9-Jan-24 | ends
          
          
        }catch(err){
          console.log('Exception in Contract summary',err)
        }
                
      }else{
        this.ContractSummary = 'No response received'
      }

    });
    
  }

  //Modified by Urmila A | 14-Mar-23
  fnGetTenor() {
    this.AllAPIsLoaded=false;
    this.FXD_afs.fnGetTenor(
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      'T',
      this.FXD_afs.UserName
    ).subscribe((res) => {
    // Added by Chaitanya M | 18 Sep 2023
      if (res.length > 0 && res !== null) {
        this.AllDataLoaded.tenor = true;
        this.TenorOptions = [] //Added by Urmila A  | 9-Jan-24
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

  //modified by Urmila A | 20-Mar-23
  ngOnDestroy() {
    this.OrderPlaced = false
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    this.scheduleBtnClick=false;

    this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
      navigate: false,
      ProdcutCode: '',
      ReFNo: "",
      ProductID: ''
    })

    if (this.FXD_RFQDealDetailsNavigateSubscriber) {
      this.FXD_RFQDealDetailsNavigateSubscriber.unsubscribe();
      if (this.RFQDetailsFromNoteMasterSubscrber) {
        this.RFQDetailsFromNoteMasterSubscrber.unsubscribe();
      }
    }
    this.fnUnsubscribeAllCalls();
  
  }

  //added by Urmila A | 20-Mar-23
  fnUnsubscribeAllCalls(){
    if (this.FXRatesubscription) this.FXRatesubscription.unsubscribe();
    if (this.TenorDayssubscription) this.TenorDayssubscription.unsubscribe();
    if (this.FXBidAsksubscription) this.FXBidAsksubscription.unsubscribe();
    if (this.FXDatesCalculationsubscription)
      this.FXDatesCalculationsubscription.unsubscribe();
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    if (this.BookOrdersubscription) this.BookOrdersubscription.unsubscribe();
    if (this.FXPriceProvidersubscription)
      this.FXPriceProvidersubscription.unsubscribe();
  }

 

  TenorChanged(e) {
    this.Tenor = e.target.value
    this.ResetAllFields();
    this.FixingDate = '';
    this.MaturityDate = '';
    // this.FXD_afs.GetDatesCalculationforVB(28, 'FXBarrier', this.DepCcy, this.AltCcy, '' + this.TenorDays, this.Tenor, 'TOK');
    this.fnGetDatesCalculationforVB();
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
 
  setCCY() {
    this.ResetAllFields();
    this.fnGetBidAskRates();
    this.DepCcy = this.CurrencyPair.slice(0, 3);
    this.AltCcy = this.CurrencyPair.slice(6, 9);
    this.NotionalCCY = this.DepCcy;
    this.IBPremCCY = this.DepCcy;
    this.ccy1 = true;  //Added by Urmila  | LGTCLI-208
    this.ccy2 = false;  //Added by Urmila  | LGTCLI-208
    this.BidSpot = '';
    this.AskSpot = '';
   
    this.fnIsMetalInCcy(false); // LGTGTWINT-2464  | Chaitanya M | 06 Dec 2023
    this.fnChangeNotionalCCY();
    this.fnGetDatesCalculationforVB();
  }

  //modified by Urmila A | 23-Mar-23 | HSBCPBIN-409
  StrikePointChanged(e) {  
    const target = this.FXD_cfs.GetEventTarget(e);
    this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(target.value).toFixed(this.PointShift)); //UrmilaA | 9-Jan-24

  }

 
  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | start
  OrderDirectionChanged() {
    this.ResetAllFields();
    this.OrderDirection === 'Buy' ? (this.StrikePoint = this.FXD_cfs.numberWithCommas(this.AskSpot)) : (this.StrikePoint = this.FXD_cfs.numberWithCommas(this.BidSpot));
  }
  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | ends

  NotionalChanged(e) {
    this.ResetAllFields();
    const target = this.FXD_cfs.GetEventTarget(e);
    this.Notional = target.value.replace(/,/g, '');
  }

  OptionTypeChange(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.OptionType = target.value;
    if (this.OptionType === 'Call') {
      this.UpperBarrier = '';
    } else if (this.OptionType === 'Put') {
      this.LowerBarrier = '';
    }
  }

  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
  ChangeLowerBarrier(e) {  
    this.LowerBarrier = this.FXD_cfs.numberWithCommas(Number(e.target.value).toFixed(this.PointShift)); //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
  }

  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
  ChangeUpperBarrier(e) { 
      this.UpperBarrier = this.FXD_cfs.numberWithCommas(Number(e.target.value).toFixed(this.PointShift)) //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
  }

  // Start - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023
  CalculateUpfront(){
    if(this.upfront !== '' || this.upfront !== '0'){
      this.fnFindUpfrontUSD();
    }
  }
  // End - HSBCFXEINT-17 | Chaitanya M | 01 Dec 2023

  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
  UpfrontChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.upfront = this.FXD_cfs.numberWithCommas(Number(target.value).toFixed(this.SpreadRounding)); //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23 //UrmilaA | 5-Dec-23 | F5SAAINT-870
    this.fnFindUpfrontUSD();    
  }

  //Modified by Urmila A | 17-Mar-23 | start
  FXBestPrice() {
     this.PriceRecvFromLPs=0;  
     this.fnResetpricingFlags(); 
     this.ClearLPs = true; 
     this.ClearPricingFlag = true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23
     this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23

    if(this.ServiceResponse !== null){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      this.OrderPlaced = false;     
      this.BestPrice=null ;//UrmilaA | LGTGTWINT-1941 | 2-May-23
    }

    if(this.RouteFromWorkflow === true){
      this.PriceRecAfterRepricefromBlotter= true;
      this.NoteMasterID = this.NoteToUnblock; 
      this.ScheduleCallWithGuarenteeperiod=false 
     }else { this.NoteMasterID = '0' }


    if (this.SelectedPricingMode === 'Auto') {
      if (this.Validations() && this.Errormsg === '') {
        this.priceLoader=true; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
        this.RFQNODisplayFromParent = false;
        this.ResetAllFields();
        // this.GenerateUserID();

        this.fnIsMetalInCcy(true); // LGTGTWINT-2464  | Chaitanya M | 06 Dec 2023

        this.disabledPrembtn = true;
        this.loadflag = true;
        this.Errormsg = '';

        this.ClearPricingFlag = false;
        const SpotRate =
          (this.OrderDirection === 'Sell' && this.OptionType === 'Call') ||
            (this.OrderDirection === 'Buy' && this.OptionType === 'Put')
            ? this.BidSpot
            : this.AskSpot;

       
         // <CustID>" +this.HomeAPI.CustomerId + "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
        //EntityId changes by UrmilaA, LGTGTWINT-1908 | 24-April-23
        //formattor changes addde by Urmila A | 9-Jan-24 | code sync with 5star | start
        this.XMLString = "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><Spotrate>"+SpotRate+
        "</Spotrate><Notional>"+ this.Notional.replaceAll(/,/g, '')+"</Notional><NonDeliveryYN>"+this.NDFFlag+"</NonDeliveryYN><OptionCut>"+this.OptionCut +
        "</OptionCut><OptionType>"+this.OptionType+"</OptionType><CcyPair>"+this.CurrencyPair +
        "</CcyPair><AltCcy>"+this.AltCcy+"</AltCcy><InvCcy>"+this.NotionalCCY+"</InvCcy><PremiumCcy>"+this.IBPremCCY +
        "</PremiumCcy><PremiumDate>"+this.Premiumdate+"</PremiumDate><BuySell>"+this.OrderDirection+
        "</BuySell><FixingDate>"+this.FixingDate+"</FixingDate><TradeDate>"+this.TradeDate+"</TradeDate><SettDate>"+this.MaturityDate +
        "</SettDate><Tenor>"+this.Tenor+"</Tenor><TenorDays>"+this.TenorDays+"</TenorDays><Strike>"+this.StrikePoint.replaceAll(/,/g, '')+
        "</Strike><LowerBarrier>"+Number(this.LowerBarrier.replaceAll(',',''))+"</LowerBarrier><UpperBarrier>"+Number(this.UpperBarrier.replaceAll(',',''))+
        "</UpperBarrier><BarrierType>"+this.selectedBarrierType+"</BarrierType><Entity_ID>"+this.FXD_afs.EntityID +
        "</Entity_ID><TemplateID>"+this.TemplateID+"</TemplateID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>"


        let fxd_Mode = this.FXD_cfs.fngetMode() //Urmila A | LGTGTWINT-1470 | 21-feb-23
        this.FXD_afs.SetPricingProduct(this.Product_Name);

        let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark) // HSBCFXEINT-21 | Chaitanya M | 08 dec 2023
       
       //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
       //old-GetFXBestPrice 
       this.Bestpricesubscription =  this.FXD_afs.GetFXBestPriceForVBNew(
          this.FXD_afs.EntityID,
          this.FXD_afs.UserName,
          // this.FXD_afs.GetToken(),
          // this.Product_Code.toUpperCase(),
          this.Product_Code.toUpperCase(), //ProductType
          this.CurrencyPair,
          this.NotionalCCY,
          this.NotionalCCY === this.AltCcy ? this.DepCcy : this.AltCcy,
          this.IBPremCCY,
          this.IBPremCCY,
          this.Notional.replace(/,/g, ''),
          'PREMIUM',
          this.OrderDirection.toUpperCase(), 
          this.StrikePoint.includes(',') ? this.StrikePoint.replaceAll(/,/g, '') : this.StrikePoint ,
          this.LowerBarrier !== '' ? this.LowerBarrier.includes(',') ? this.LowerBarrier.replaceAll(/,/g, '') : this.LowerBarrier :'0',//lowerbarrier //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
          this.UpperBarrier !== '' ? this.UpperBarrier.includes(',') ? this.UpperBarrier.replaceAll(/,/g, '') : this.UpperBarrier : '0',//upperbarrier //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
          this.ActualBarrier,
          this.knockInStyle,
          this.knockOutStyle,
          this.OptionCut,
          this.Tenor + '',
          this.Premiumdate,
          this.FixingDate,
          this.MaturityDate,
          this.FXD_afs.UserName,
          true,
          this.PriceProviderString,
          this.XMLString,
          this.TemplateCode,
          this.TemplateID.toString(),
          this.Product_ID,
          this.NoteMasterID,
          this.TradeDate,
          this.NDFFlag,
          this.isMetal  ,  
          this.ShowRFS, //UrmilaA, 18-May-23 | (SignalR, RFS | LGTCLI-361)
          this.OptionType,
          this.upfront !== '' ? this.upfront.includes(',') ? this.upfront.replace(/,/g, '') : this.upfront : '0.0000',
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
          this.BestPrice = null;
          this.ServiceResponse = [];
          this.ResetAllfieldsCalled=false; //Urmila A | LGTGTWINT-1332 | 4-mar-23
          if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
            try {
              if (res) {
                this.PriceClick=false;               
                if(res.errors == undefined && res?.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL'){   //Error handling logic modified by Urmila A | 18-sep-23
                  this.ServiceResponse = res= res.oPriceResponseBody;  
                  if(this.ServiceResponse[0].quoteId == 0){
                        this.noResponseRecv = true;
                        this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        this.NotificationFunction("Error","Error" , this.ServiceResponse[0].errorMessage)
                      }
                      if(this.ServiceResponse == null || this.ServiceResponse.length == 0){
                        this.disabledPrembtn = false;
                        this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        this.OrderPlaceFlag = false;
                      }else if(this.ServiceResponse.length > 0){
                        this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID;
                        this.NoteMasterID = this.ServiceResponse[0].NoteMasterID; //Urmila A | 18-Sep-23
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
                              this.ResponseArray =
                              this.ServiceResponse[0]?.bestPriceProvider.split(':');                                    
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
                            
                }else{     
                  this.ServiceResponse = res?.oPriceResponseBody;               
                    this.priceLoader=false;      
                    this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse);     
                    if(this.FXD_cfs.fnPricingNotification(res) == 'NoResReceived') {
                      this.noResponseRecv = true; 
                      this.DCDRfqId = this.ServiceResponse[0].o_DCDRFQID; 
                    }     
                                       
                  }             
              }else{
                this.priceLoader=false; 
                this.NotificationFunction("Error","Error", 'No response received from remote system')
              }
            } catch (Ex) { }
          }
        });
      }else{
        this.priceLoader=false; 
        this.NotificationFunction("Error","Error", this.Errormsg)
        console.log('error:', this.Errormsg)
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
          this.PriceRecvFromLPs = this.PriceRecvFromLPs + 1; 
       
          this.priceLoader=false;   
          p.externalQuoteID = data[1];
          p.premiumAmount = data[2];
          p.premium = parseFloat(data[3]).toFixed(4);
          p.validTill = data[4];
          p.spot = data[6]; 
          p.IsBestPrice = data[5]; 
          p.validResponseReceived=true;
          this.ShownSignalRPriceQuotes.push(p.quoteId)
          if(data[5] === 'Y'){
            this.BestPrice = p.premiumAmount; 
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
   
      if(nonBestCnt === this.saveRes.length) {
        BestPriceConsist=false;
      }   
    
      if(this.signalRMsgRecv){
        this.FXD_afs.RFSRes.next(this.saveRes);    
      }
      if(this.MinQuoteTimeOutOccurred && !this.signalRMsgRecv){
            nonBestTimeout = parseInt(this.MaxQuoteTimeout) - parseInt(this.MinQuoteTimeout)
            console.log(' 2nd timeout start:',nonBestTimeout, Date())
            this.MinMaxTimer = nonBestTimeout 
            this.MaxTimeout = setTimeout(() => { 
                nonBestTimeoutOccurred=true;
                console.log('after 2nd timeout RFS res:', this.saveRes)            
                this.priceLoader=false;  
                if(nonBestTimeoutOccurred && !this.signalRMsgRecv){ 
                  this.noResponseRecv = true; 
                  this.NotificationFunction("Error","Error" , "No response received from remote system")
                }
          }, nonBestTimeout * 1000);

          console.log('NonBestTimeout is ',nonBestTimeout );
          let nonBestinterval: any =  nonBestTimeout;      
          this.maxInterval = setInterval(() => {       
            this.MinMaxTimer = nonBestinterval = nonBestinterval-1 
            if(nonBestinterval >0){
              if(this.signalRMsgRecv){  
                this.priceLoader=false;     
                this.btnEnable=true; 
                this.MinMaxTimer=0; 
                this.SignalR_unsubscriber = false; 
                this.closeSignalR();
                this.signalRMsgRecv = false;    
                this.MaxQuotePriceCame =true;
                this.FXD_afs.RFSRes.next(this.saveRes);   
                clearInterval(this.maxInterval)
              }        
            }else if(nonBestinterval == 0){ 
              clearInterval(this.maxInterval)
              clearTimeout(this.MaxTimeout)
            }        
                    
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
    this.NoteMasterID = element.NoteMasterID; //Urmila A | 18-Sep-23
    //this.fnSetIBPrem(element.premium);  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
    this.ExternalRfqId = element.quoteId;
    this.BestPriceabs = Math.abs(element.premiumAmount);

    // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
    if(this.PreminPipsToggle === "%"){

      this.IBPremium =  this.getIBPremValue(element.premiumAmount)  
      this.IBPrem = parseFloat(element.premium).toFixed(4).replaceAll('-','');  // HSBCFXEINT-33 | Chaitanya M | 12 Dec 2023
      this.ClientPrem = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal,false)

    } else {

      this.IBPrem = this.FXD_cfs.ConvertIntoPIPs(this.Notional.replaceAll(',', ''), this.StrikePoint.replaceAll(',',''), element.premiumAmount, this.PointShift, this.IBPremCCY, this.NotionalCCY,this.DepCcy);
      this.IBPremium = this.getIBPremValue(element.premiumAmount)  
      this.Clientperc = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal, true);

    }
    // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

    this.IBPremDirection = element.premium > 0 ? 'Pay' : 'Receive'; 

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
      this.ClientPremDir = element.client_Prem_Dir;  
      this.IBPremComment = this.FXD_cfs.fngetIBcomment(element.client_Prem_Dir) 
      this.ClientPremComment = this.FXD_cfs.fngetClientPremComment(element.client_Prem_Dir); // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
    }

    // Start : HSBCFXEINT-112 | Spot updated is not proper for Call/Put option and buy sell direction. | Chaitanya M | 21May2024
    if(this.OrderDirection.toLowerCase() === 'buy'){
      if(this.OptionType.toUpperCase() == "PUT"){
        this.BidSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
      }else{
        this.AskSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
      }
    }else{
      if(this.OptionType.toUpperCase() == "PUT"){
        this.AskSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
      }else{
        this.BidSpot = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
      }
    }
    // End : HSBCFXEINT-112 | Spot updated is not proper for Call/Put option and buy sell direction. | Chaitanya M | 21May2024

    this.fnFindUpfrontUSD();
    this.fnGetContractSummary();  
  }

  //Urmila A | 20-Mar-23
  CancelPricing(){
    if(this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
    // this.loadflag=false;
    this.priceLoader=false;  
  }


 //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
  getIBPremValue(prem){

    this.IBPremNotionalDecimal !== undefined ? this.IBPremium = Number(prem).toFixed(this.IBPremNotionalDecimal) : this.IBPremium = Number(prem); //UrmilaA | F5SAAINT-585 | 5-Dec-23 
    // console.log('IB Prem value', this.IBPremium);
    // if(prem !== '' && this.IBPremCCY.includes('JPY') ){
    //       this.IBPremium = prem.toFixed(0)
    // }else if(prem !== '' && !this.IBPremCCY.includes('JPY')){
    //       this.IBPremium = parseFloat(prem).toFixed(this.IBPremNotionalDecimal) //UrmilaA | F5SAAINT-585 | 5-Dec-23 
    // }

    return this.FXD_cfs.numberWithCommas(this.IBPremium)
  }
  
  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | HSBCFXEINT-51 | start
  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  findClientPrem( IBPrem, perc, upfront, solveinPIPS){
    
    upfront =  this.getUpfrontval(upfront)
    
    let ClientPrem
    let _Notionalamt = this.Notional.replaceAll(',', '');
    let _strikeRate = this.StrikePoint.replaceAll(',','');

    if(solveinPIPS === true){

      if(perc < 0){      
        ClientPrem = Math.abs(IBPrem) + parseFloat(upfront);
        this.Clientperc = (Number(perc) + parseFloat(this.upfront)).toFixed(4).replaceAll('-','');        
      }else{
        ClientPrem = Math.abs(IBPrem) - parseFloat(upfront);
        this.Clientperc = (Number(perc) - parseFloat(this.upfront)).toFixed(4).replaceAll('-','');
      }

      this.Clientperc = this.FXD_cfs.ConvertIntoPIPs(_Notionalamt, _strikeRate, ClientPrem, this.PointShift, this.IBPremCCY, this.NotionalCCY,this.DepCcy);  

    } else {

      if(perc < 0){      
        this.ClientPrem = Math.abs(IBPrem) + parseFloat(upfront)           
      }else{
        this.ClientPrem = Math.abs(IBPrem) - parseFloat(upfront)
      }
    
      this.Clientperc = (Number(perc) - parseFloat(this.upfront)).toFixed(4).replaceAll('-','');

    }

    ClientPrem = this.FXD_cfs.numberWithCommas(this.ClientPrem.toFixed(this.IBPremCCY === 'JPY' ? 0 : this.IBPremNotionalDecimal)) //UrmilaA | 5-Dec-23 | F5SAAINT-585
  
    return ClientPrem;
  }
  // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | HSBCFXEINT-51 | ends


  //Added by Urmila A | 20-mar-23
  getUpfrontval(upfront){
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


  FXManualPricing() {
    if (this.Validations() && this.Errormsg === '') {
      // this.ResetAllFields();
      this.GenerateUserID();
      this.disabledPrembtn = true;
      this.loadflag = true;
      if (this.NotionalCCY === this.DepCcy) {
        this.AltNotional =
          Number(this.Notional.replaceAll(/,/g, '')) * Number(this.StrikePoint.replaceAll(/,/g, ''));
      } else {
        this.AltNotional =
          Number(this.Notional.replaceAll(/,/g, '')) / Number(this.StrikePoint.replaceAll(/,/g, ''));
      }
      this.ClearPricingFlag = false;
      const SpotRate =
        (this.OrderDirection === 'Sell' && this.OptionType === 'Call') ||
          (this.OrderDirection === 'Buy' && this.OptionType === 'Put')
          ? this.BidSpot
          : this.AskSpot;
      // eslint-disable-next-line @typescript-eslint/quotes
      this.XMLString =
        '<ExcelSheets><Sheet1><Product_Name>' +
        this.Product_Name +
        '</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>' +
        this.HomeAPI.CustomerId +
        '</CustID><Customer_Name>' +
        this.HomeAPI.CustomerName +
        '</Customer_Name><Spotrate>' +
        SpotRate +
        '</Spotrate><Notional>' +
        Number(this.Notional.replaceAll(/,/g, '')) +
        '</Notional><OptionType>' +
        this.OptionType +
        '</OptionType><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>' +
        this.CurrencyPair +
        '</CcyPair><AltCcy>' +
        (this.NotionalCCY === this.DepCcy ? this.AltCcy : this.DepCcy) +
        '</AltCcy><InvCcy>' +
        this.NotionalCCY +
        '</InvCcy><PremiumCcy>' +
        this.IBPremCCY +
        '</PremiumCcy><CustPrem>0</CustPrem><Tenor>' +
        this.Tenor +
        '</Tenor><Premiumdate>' +
        this.Premiumdate +
        '</Premiumdate><BuySell>' +
        this.OrderDirection +
        '</BuySell><FixingDate>' +
        this.FixingDate +
        '</FixingDate><SpreadAmt>' +
        this.upfront +
        '</SpreadAmt><TradeDate>' +
        this.TradeDate +
        '</TradeDate><SettDate>' +
        this.MaturityDate +
        '</SettDate><Strike>' +
        this.StrikePoint +
        '</Strike><PricingModel>' +
        this.SeletcedPricingModel +
        '</PricingModel><EntityID>' +
        this.FXD_afs.EntityID +
        '</EntityID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>';
      this.FXD_afs.SetPricingProduct(this.Product_Name);
      // BNP:Citi:DB:HSBC:JPM:OCBC:UBS
      this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBManual(
        this.FXD_afs.EntityID,
        this.Product_ID,
        this.Product_Name,
        this.CurrencyPair,
        this.NotionalCCY,
        this.NotionalCCY === this.DepCcy ? this.AltCcy : this.DepCcy,
        this.IBPremCCY,
        this.NotionalCCY,
        this.Notional.replaceAll(/,/g, ''),
        this.AltNotional,
        this.OrderDirection,
        this.OptionType,
        this.StrikePoint,
        '0',
        '0',
        '',
        'EUROPEAN',
        'EUROPEAN',
        'TOK',
        this.Tenor + '',
        this.Premiumdate,
        this.FixingDate,
        this.MaturityDate,
        '', //this.PriceProviderString,
        'PREMIUM',
        this.TemplateCode,
        this.TemplateID,
        this.Notional.replaceAll(/,/g, ''),
        '',
        '',
        '',
        '',
        0,
        '',
        this.XMLString,
        this.upfront,
        this.UserID,
        this.SeletcedPricingModel,
        'GWManual',
        this.SelectedClientType,
        this.SelectedIBType,
        '',
        this.IBPremium, //'5000', //
        this.ClientPrem //'1000' //,
      ).subscribe((res) => {
        this.BestPrice = null;
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          if (res) {
            console.log(res);
            if (res) {
              this.ServiceResponse = res.GetFXOPriceManualModeResult;
              this.fnSetIBPrem(this.ServiceResponse.IBPrem);
              this.fnSetClientPrem(this.ServiceResponse.CustPrem);
              this.SelectedClientType = this.ServiceResponse.CustPayReceiveDirection;
              this.SelectedIBType = this.ServiceResponse.IBPayReceiveDirection;

              this.loadflag = false;
            } else {
              this.loadflag = false;
              this.Errormsg = this.ServiceResponse[0].errorMessage;
              this.Errormsg = 'No prices received';
              this.disabledPrembtn = false;
            }
          }
        }
      });
    }
  }

  //not in use, Urmila A | 20-mar-23
  fnCalcUpfrontAndIbPrem() {
    var UpfrontInCcy = 0;
    if (this.IBPremCCY === this.DepCcy && this.NotionalCCY === this.AltCcy) {
      UpfrontInCcy = (Number(this.Notional.toString().replaceAll(/,/g, '')) / parseFloat(this.StrikePoint.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    } else if (this.IBPremCCY !== this.NotionalCCY) {
      UpfrontInCcy = (Number(this.Notional.toString().replaceAll(/,/g, '')) * parseFloat(this.StrikePoint.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    } else {
      UpfrontInCcy = (Number(this.Notional.toString().replaceAll(/,/g, '')) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    }
    if (this.OrderDirection === 'Buy') {
      this.fnSetClientPrem((Math.abs(parseFloat(this.fnGetIBPrem()) + UpfrontInCcy)));
    } else {
      this.fnSetClientPrem((Math.abs(parseFloat(this.fnGetIBPrem()) - UpfrontInCcy)));
    }
  }

  fnSetClientPrem(Value: any) {
    this.ClientPrem = (parseFloat(Value)).toFixed(this.IBPremCCY === this.AltCcy ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  //not in use, Urmila A | 20-mar-23
  fnSetIbPremClientPremLabel() {
    if (this.OrderDirection === 'Buy') {
      this.IBPremComment = '(IB Receives)';
      this.ClientPremComment = '(Client Pays)';
    } else {
      this.IBPremComment = '(IB Pays)';
      this.ClientPremComment = '(Client Receives)';
    }
  }

  GenerateUserID() {
    this.UserID = 'GMUser_' + Math.floor(Math.random() * 1000 + 1).toString();
    // console.log(this.SessionID);
  }

  //modified by Urmila A | 20-mar-23
  Validations() {
    this.Errormsg=''
    if (this.Errormsg === '') {
     
      //commented by Urmila A | 20-mar-23
      // if (this.DisableCCYChangeControl === true) {
      //   try {
      //     if (Number(this.Notional.toString().replaceAll(/,/g, '')) >= 1) {
      //       this.Errormsg = '';
      //     } else {
      //       this.Errormsg = 'Notional below ' + this.NotionalCCY + ' 1 not allowed';
      //       return false;
      //     }
      //   } catch (ex) {

      //   }
      // } else if (Number(this.Notional.replaceAll(/,/g, '')) < 100000) {
      //   this.Errormsg =
      //     'Notional below ' + this.NotionalCCY + ' 100k not allowed';
      //   return false;
      // }

      //Added by Urmila A | 3-Mar-23
      if(this.CurrencyPair === ''){
        this.Errormsg = 'Please select currency pair.'
        return false
      }else {
        this.Errormsg='';
      }
     
      //Urmila A | 23-mar-23 | HSBCPBIN-409
      if (!(Number(this.StrikePoint.replaceAll(',','')) > 0)) {
        this.Errormsg = 'Strike cannot be zero or blank';
        return false;
      }

      //Urmila A | 20-Mar-23
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

      if ( this.upfront == '' ) {
        this.Errormsg = 'Please Enter Upfront %';
        return false;
      }else {
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

      //Urmila A | 20-Mar-23
      if(this.LowerBarrierOnOff){
          if(this.LowerBarrier !== '' || Number(this.LowerBarrier.replaceAll(/,/g, '')) > 0){
            this.Errormsg = '';
          }
          else if(Number(this.LowerBarrier.replaceAll(/,/g, '')) === 0 || this.LowerBarrier === ''){
            this.Errormsg = 'Lower barrier cannot be zero or blank';
            return false;
          }
      }

      //Urmila A | 20-Mar-23
      if(this.UpperBarrierOnOff){
          if(this.UpperBarrier !== '' || Number(this.UpperBarrier.replaceAll(/,/g, '')) > 0){
            this.Errormsg = '';
          }
          else if(Number(this.UpperBarrier.replaceAll(/,/g, '')) === 0 || this.UpperBarrier === ''){ 
            this.Errormsg = 'Upper barrier cannot be zero or blank';
            return false;
          }
      }


      //commented by Urmila A | 20-mar-23
      // if (!this.LowerBarrierOnOff) {
      //   if (
      //     Number(this.LowerBarrier) < Number(this.Strike) &&
      //     Number(this.LowerBarrier) > 0
      //   ) {
      //     this.Errormsg = '';
      //   } else {
      //     this.Errormsg =
      //       'Strike rate value should be greater than Lower barrier.';
      //     return false;
      //   }
      // }
      // if (!this.UpperBarrierOnOff) {
      //   if (
      //     Number(this.UpperBarrier) < Number(this.Strike) &&
      //     Number(this.UpperBarrier) > 0
      //   ) {
      //     this.Errormsg =
      //       'Upper barrier value should be greater than strike rate.';
      //     return false;
      //   } else {
      //     this.Errormsg = '';
      //   }
      // }
      this.Errormsg = '';
      return true;
    } else {
      return false;
    }
  }

  fnSetAfterPriceValues(){ //modified by Urmila A | 16-Nov-23 | F5SAAINT-319
    // this.upfront = '0.00'; RizwanS Start ||  EFGUPINT-134   || 17 Apr 2024
    this.UpfrontAlt = '0.00'; 
    this.UpfrontVal = '0.00'; 
    this.IBPrem='';
    this.IBPremium=''
    this.ClientPrem=''
    this.Clientperc=''
  }

  //modified by UrmilaA | 9-Jan-24 | code sync with 5star | start
  ResetAllFields() {
    this.FXD_cfs.saveTradeDone=false;
    this.FXD_cfs.RouteToDealerExecuted=false;
    this.FXD_cfs.orderBookingDone=false; //added by UrmilaA | 9-Jan-24
    this.ResetAllfieldsCalled=true; 
    this.PriceClick=false;
   
    this.ClearLPs=true; 
    this.ResetAllfieldsCalled=true;
    if(this.ServiceResponse !== null && this.ServiceResponse !== undefined && this.ServiceResponse !== ""){ //modified by Urmila A | 16-Nov-23 | F5SAAINT-319  || GauravM || F5SAAINT-1188
      this.closeSignalR()   
      this.NoteMasterID=''; 
      this.fnSetAfterPriceValues(); 
    }
    this.fnResetpricingFlags()
    this.resetSignalRPrice() 
    this.loadflag = false;
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    this.BestPriceabs = null;
    this.ServiceResponse = null;
    this.ClearPricingFlag = true;
    this.ViewScheduleflag = false;
    this.OrderBlotterVisibility = false;
    this.ScheduleVisibility = false;
 
    // this.OrderClicked=false;
    this.OrderPlaced=false;
    this.BestPriceString = '';
    this.ResponseArray = [];
   
    this.orderMsg = ''
    this.Orderplace = '';
    this.DealNo = '';
    this.DCDRfqId = ''
    // this.OrderPlaceFlag = false;
    this.IBPremComment = '';
    this.ClientPremComment = '';
  
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted = false;

    // Added by UrmilaA | F5SAAINT-544 | Reject Order block | 18-Dec-23 
    this.RejectRedirectedOrder=false;
    this.RejectedOrderMSG=''
  }
   //modified by UrmilaA | 9-Jan-24 | code sync with 5star | ends


  BarrierTypeChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.selectedBarrierType = e.target.value
    this.fngetBarrierDetails();
  
    this.LowerBarrier = '';
    this.UpperBarrier = '';
    console.log(this.ActualBarrier);
  }


  //Urmila A | 20-mar-23
  fngetBarrierDetails(){
    this.LowerBarrierOnOff = false;
    this.UpperBarrierOnOff = false;
    switch (this.selectedBarrierType) {
      case 'Knock-In':
        if (this.OptionType === 'Call') {
          this.ActualBarrier = 'DAI';
          this.LowerBarrierOnOff = true;
          this.ExcoticCode = 'DAIC'; //RizwanS || 26 Jul 2023
        } else {
          this.ActualBarrier = 'UAI';
          this.UpperBarrierOnOff = true;
          this.ExcoticCode = 'UAIP'; //RizwanS || 26 Jul 2023
        }      
        this.knockInStyle = 'American'
        this.knockOutStyle = ''
        break;
      case 'Knock-Out':
        if (this.OptionType === 'Call') {
          this.ActualBarrier = 'DAO';
          this.LowerBarrierOnOff = true;
          this.ExcoticCode = 'DAOC'; //RizwanS || 26 Jul 2023
        } else {
          this.ActualBarrier = 'UAO';
          this.UpperBarrierOnOff = true;   
          this.ExcoticCode = 'UAOP'; //RizwanS || 26 Jul 2023         
        }
        this.knockInStyle = ''
        this.knockOutStyle = 'American'
        break;
      case 'Reverse Knock-In':
        if (this.OptionType === 'Call') {
          this.ActualBarrier = 'UAI';
          this.UpperBarrierOnOff = true;
          this.ExcoticCode = 'UAIC'; //RizwanS || 26 Jul 2023
        } else {
          this.ActualBarrier = 'DAI';
          this.LowerBarrierOnOff = true;
          this.ExcoticCode = 'DAIP'; //RizwanS || 26 Jul 2023
        }
        this.knockInStyle = 'American'
        this.knockOutStyle = ''
        break;
      case 'Reverse Knock-Out':
        if (this.OptionType === 'Call') {
          this.ActualBarrier = 'UAO';
          this.UpperBarrierOnOff = true;
          this.ExcoticCode = 'UAOC'; //RizwanS || 26 Jul 2023
        } else {
          this.ActualBarrier = 'DAO';
          this.LowerBarrierOnOff = true;
          this.ExcoticCode = 'DAOP'; //RizwanS || 26 Jul 2023
        }
        this.knockInStyle = ''
        this.knockOutStyle = 'American'
        break;
      case 'RKI+KO':
        if (this.OptionType === 'Call') { //RizwanS || 26 Jul 2023
          this.ExcoticCode = 'RKIKOC'; 
        }else{
            this.ExcoticCode = 'RKIKOP'; 
        }
        this.ActualBarrier = 'RKIKO';
        this.knockInStyle = 'American'
        this.knockOutStyle = 'American'
        this.LowerBarrierOnOff = true;
        this.UpperBarrierOnOff = true;
        break;
      case 'RKI+KI':
        if (this.OptionType === 'Call') { //RizwanS || 26 Jul 2023
          this.ExcoticCode = 'RKIKIC'; 
        }else{
         this.ExcoticCode = 'RKIKIP'; 
        }
        this.ActualBarrier = 'RKIKI';
        this.knockInStyle = 'American' //changed by Urmila A, HSBCPBIN-425, 5-april-23
        this.knockOutStyle = ''
        this.LowerBarrierOnOff = true;
        this.UpperBarrierOnOff = true;
        break;
      case 'RKO+KI':
        if (this.OptionType === 'Call') { //RizwanS || 26 Jul 2023
          this.ExcoticCode = 'KIKOC'; 
        }else{
         this.ExcoticCode = 'KIKOP'; 
        }
        this.ActualBarrier = 'KIKO';
        this.knockInStyle = 'American'
        this.knockOutStyle = 'American'
        this.LowerBarrierOnOff = true;
        this.UpperBarrierOnOff = true;
        break;
      case 'RKO+KO':
        if (this.OptionType === 'Call') { //RizwanS || 26 Jul 2023
          this.ExcoticCode = 'RKOKOC'; 
        }else{
         this.ExcoticCode = 'RKOKOP'; 
        }
        this.ActualBarrier = 'RKOKO';
        this.knockInStyle = ''
        this.knockOutStyle = 'American'  //changed by Urmila A, HSBCPBIN-425, 5-april-23
        this.LowerBarrierOnOff = true;
        this.UpperBarrierOnOff = true;
        break;
      case 'E-RKI+KO':
        if(this.OptionType === 'Call'){
          this.ActualBarrier = 'RKIKO';
          this.ExcoticCode = 'RKIKOC'; //RizwanS || 26 Jul 2023
        }else{
          this.ActualBarrier = 'RKIKO';
          this.ExcoticCode = 'RKIKOP'; //RizwanS || 26 Jul 2023
        }
        this.knockInStyle = 'European'
        this.knockOutStyle = 'American'
        this.LowerBarrierOnOff = true;
        this.UpperBarrierOnOff = true;
        break;
      case 'European Reverse Knock-In':
        if (this.OptionType === 'Call') {
          this.ActualBarrier = 'UAI';
          this.UpperBarrierOnOff = true;
          this.ExcoticCode = 'UAIC'; //RizwanS || 26 Jul 2023
        } else {
          this.LowerBarrierOnOff = true;       
          this.ActualBarrier = 'DAI';
          this.ExcoticCode = 'DAIP'; //RizwanS || 26 Jul 2023
        }
        this.knockInStyle = 'European'
        this.knockOutStyle = ''
        break;
      case  'European Knock-In':
        if (this.OptionType === 'Call') {           
          this.ActualBarrier = 'DAI';
          this.LowerBarrierOnOff = true;        
          this.ExcoticCode = 'DAIC'; //RizwanS || 26 Jul 2023       
        } else {
          this.ActualBarrier = 'UAI';
          this.UpperBarrierOnOff = true;   
          this.ExcoticCode = 'UAIP'; //RizwanS || 26 Jul 2023  
        }    
        this.knockInStyle = ''
        this.knockOutStyle = 'European'
        break;
      default:
        this.ActualBarrier = 'DAI';
        break;
    }

    this.assignLowerUpper(); //Urmila A | 21-Mar-23
  }


  //Added by Urmila A | 21-Mar-23
  assignLowerUpper(){
        if(!this.UpperBarrierOnOff){
          this.UpperBarrier = ''
        }

        if(!this.LowerBarrierOnOff){
          this.LowerBarrier=''
        }
  }

   //Urmila A | 20-mar-23
  fnchngOptionType(e){
      this.OptionType = e.target.value
  }



  AddpipestoNumber(pipes: number, Rate: string) {
    // console.log(pipes, Rate);
    this.amount = Rate;
    this.S = this.amount.toString().split('.');
    this.S[1] = this.S[1].substring(0, 4);
    const length = this.S[1].length;
    // this.S = null;
    const temp = this.S[0] + '' + this.S[1];
    this.tempNumber = parseInt(temp, 10);
    const sum = Number(this.tempNumber) + Number(pipes);
    // this.S = tempstring.split('.');
    const result = sum / Math.pow(10, length);
    return result;
  }


  //modified by Urmila A | 20-Mar-23
  BookDeal() {
    this.FXD_cfs.loadFlag=true;
      // this.OrderClicked = true;
      // this.OrderPlaceFlag = true; 
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
      if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {         
        if (res){  //mappings modified by Urmila A | 14-sep-23
          this.FXD_cfs.loadFlag=false;            
          this.OrderPlaced = true   
          if(res !== null){
            this.FXD_cfs.loadFlag=false;                
            this.ViewScheduleflag = false;
            this.Orderplace = res.External_TradeID;
            this.DealNo = res.DealNo;
            this.FXD_cfs.DealBooked.next(false)
            this.FXD_cfs.fxdpopupOpenClose=true;
            this.FXD_cfs.orderBookingDone=true; //added by UrmilaA | 9-Jan-24
            if (res.isProcessCompleted === true) {
              this.FXD_afs.FXD_RFQID.next(this.DCDRfqId);
              this.orderMsg = res.Message;               
              this.ClearPricingFlag = true;
            } else if (res.isProcessCompleted === false) {
              this.orderMsg = res.Message;
            } else {
              this.Orderplace = '';
            }  
          }else{
            this.FXD_cfs.loadFlag=false; 
            this.FXD_cfs.fnThrowError(res) // added by UrmilaA | Error handling |  9-Jan-24
          }
        
        }
    
       
      }
    });
  }
  TradeSelectedLP(_SelectedLPDetails) {
    // this.BestPriceProvider = SelectedLPDetails.provider;
    // this.ExternalRfqId = SelectedLPDetails.quoteId;
    // this.BestPrice = SelectedLPDetails.price;
    this.BookDeal();
  }
  fnDisableTradebtn(e) {
    this.OrderPlaceFlag = e;
  }

  GetStrikeRate() {

    //Added by Urmila A | 23-Mar-23 | HSBCPBIN-409 
    //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | start
    if(this.OptionType === 'Call'){
      if(this.OrderDirection === 'Buy'){
          this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.AskSpot)).toFixed(this.PointShift))
      }else{
          this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.BidSpot)).toFixed(this.PointShift))
      }
    }else{
        if(this.OrderDirection === 'Buy'){
          this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.BidSpot)).toFixed(this.PointShift))
        }else{
          this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.AskSpot)).toFixed(this.PointShift))
        }
    }
    if(Number(this.upfront) !== 0){
      this.fnFindUpfrontUSD();
    }

    //Modified by UrmilaA | 9-Jan-24 | code sync with 5star | ends
    
  }

  //added by Urmila A | 23-mar-23
  fnCheckComma(num){
      if(num.includes(',')){
          return num.replaceAll(',','')
      }else{
          return num
      }
  }

  ViewWorkFlowBlotter() {
    this.OrderBlotterVisibility = true;
    // this.workflowblotter.ViewBlotter(this.TradeDate, '1-Jun-2018', '1', '10');
  }

  StrikeHighlighter() {
    // if ((this.OptionType === 'Call' && this.OrderDirection === 'Sell') || (this.OptionType === 'Put' && this.OrderDirection === 'Buy')) {
    //   // Bid Highlighted
    //   document.getElementById('idBidSpot').style.color = '#808080';
    //   document.getElementById('idAskSpot').style.color = '#B6B6B6';
    // } else {
    //   // Ask Highlighted
    //   document.getElementById('idAskSpot').style.color = '#808080';
    //   document.getElementById('idBidSpot').style.color = '#B6B6B6';
    // }
  }
  TargetValueLimitor(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }
  }
  fnDisablePrembtn(e) {
    this.disabledPrembtn = e;
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
        // this.ServiceResponse = [{ bestPriceProvider: this.SelectedLPForPricing }];
        // SelectedIBType
        break;
    }
    this.ResetAllFields();
  }

  fnIsMetalInCcy(bestpriceclicked) { // LGTGTWINT-2464  | Chaitanya M | 06 Dec 2023
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
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.IBPremCCY = this.AltCcy;
            this.NotionalCCY = this.DepCcy;

            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | start
            // this.NotionalDecimalPointShift = 0;
            // this.StrikeDecimalPointShift = element.asset1_DecimalRate;
            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | ends


          } else if (element.rcY_Type.toUpperCase() === 'METAL') {// Check if the Alt ccy is metal or not
            this.DisableCCYChangeControl = true;
            this.IBPremCCY = this.DepCcy;
            this.NotionalCCY = this.DepCcy;
          
            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | start
            // this.NotionalDecimalPointShift = 0;
            // this.StrikeDecimalPointShift = element.asset1_DecimalRate;
            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | ends

          } else {
            this.isMetal = 'N'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.DisableCCYChangeControl = false;
           

            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | start
            // this.NotionalDecimalPointShift = 0;
            // this.StrikeDecimalPointShift = element.asset1_DecimalRate;
            //commented by UrmilaA | as nowhere used in code | 9-Jan-24 | ends

          }

          //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
          if (element.rcY_Type === 'NDF') {
            this.NDFFlag = 'Y';
          } else {
            this.NDFFlag = 'N';
          }

          this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
          this.Asset2_DecimalAmount = element.asset2_DecimalAmount;
          this.fnSetNotionalDecimal();  //Added by UrmilaA | F5SAAINT-1174 | 9-Jan-24
          //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | ends
        }
      });

      // LGTGTWINT-2464  | Chaitanya M | 06 Dec 2023
      if(bestpriceclicked !== true){
      if (this.Pair_Cross_YN === 'Y') {
        this.FindLeftUSDMidRate(this.Left_USD_Pair);
        this.FindRightUSDMidRate(this.Right_USD_Pair);
        }
      }
      // LGTGTWINT-2464  | Chaitanya M | 06 Dec 2023

    } catch (ex) {

    }
  }

   //Added by UrmilaA | F5SAAINT-1174, F5SAAINT-888 | 9-jan-24 | code sync with 5star
   fnSetNotionalDecimal(){
    console.log('notionals',this.Notional)
    let pointshift = this.NotionalCCY == this.DepCcy ? this.Asset1_DecimalAmount : this.Asset2_DecimalAmount;
    this.Notional = this.FXD_cfs.numberWithCommas(Number(this.Notional.toString().replaceAll(',','')).toFixed(pointshift))

  }

  fnChangeNotionalCCY() {
    try {
      try {
        this.CurrencyPairList.forEach(element => {
           //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.NotionalCCY === element.asset1) {
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCCY === element.asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.Notional = this.FXD_cfs.NotionalChangewithDecimalFixes(this.Notional, this.NotionalDecimalPointShift);
          }
        });
      } catch (ex) {

      }
    } catch (Ex) {

    }
  }

  //Added by UrmilaA | 9-Jan-24 | F5SAAINT-585, F5SAAINT-1174 |  code sync with 5star | start
  fnChangePremCCY(){
    try {
      try {
        this.CurrencyPairList.forEach(element => {
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.IBPremCCY === element.asset1) {
              this.IBPremNotionalDecimal = element.asset1_DecimalAmount;
            } else if (this.IBPremCCY === element.asset2) {
              this.IBPremNotionalDecimal = element.asset2_DecimalAmount;
            }
          }
        });
     
        this.IBPremium = this.FXD_cfs.numberWithCommas(Number(this.IBPremium.toString().replaceAll(',','')).toFixed(this.IBPremNotionalDecimal))
        this.ClientPrem = this.FXD_cfs.numberWithCommas(Number(this.ClientPrem.toString().replaceAll(',','')).toFixed(this.IBPremNotionalDecimal))
     
      } catch (ex) {

      }
    } catch (Ex) {

    }
  }
   //Added by UrmilaA | 9-Jan-24 | F5SAAINT-585, F5SAAINT-1174 |  code sync with 5star | ends

  //Modified by UrmilaA | 9-Jan-24 | code sync with 5star
  fnSetIBPrem(InputValue: any) {
    this.IBPrem = this.FXD_cfs.numberWithCommas(InputValue.toFixed(this.PremDecimal)) 
  }

  //not in use, Urmila A | 20-mar-23
  fnGetIBPrem() {
    return this.IBPremium.replace(/,/g, '');
  }

  //modified by Urmila A | 21-mar-23
  public SelectedCCy(e){
    console.log(e);
    this.CurrencyPair = e;
    this.CurrencyChanged=true;

    //Added by UrmilaA | 26-Dec-23 | start
    if(this.CurrencyPair !== '' && this.CurrencyPair.length == 9){ 
      this.setCCY();
      this.fnGetOptionCutFXD();       
    }
    if(this.CurrencyPair == '' || this.CurrencyPair.length <= 8){
      this.DepCcy = this.AltCcy = '';
      this.IBPremCCY = this.NotionalCCY = ''
      this.fnGetBidAskRates();
    } 
    //Added by UrmilaA | 26-Dec-23 | ends 

    //HSBCFXEINT-11 | ChaitanyaM | 24-May-2024
    if (Number(this.upfront) !== 0) {
      this.fnFindUpfrontUSD();
    }
    //HSBCFXEINT-11 | ChaitanyaM | 24-May-2024
  }

  // fnCustomerSelection(e){
  //   this.CustomerID = e.CustomerID;
  // }

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
           this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(data.Strike_Rate).toFixed(this.PointShift));   
           
           // added by Urmila A | 24-Nov-23 | code sync up with 5Star | start
           this.fnUpdatePointShifts(this.PointShift);
           if(data.RFQ_Deal_Dir === "S"){
            this.AskSpot = Number(data.Ask_Rate.replaceAll(',','')).toFixed(this.PointShift);
            this.BidSpot = Number(data.Spot_Rate.replaceAll(',','')).toFixed(this.PointShift);        
          }else{
            this.AskSpot = Number(data.Spot_Rate.replaceAll(',','')).toFixed(this.PointShift);
            this.BidSpot = Number(data.Bid_Rate.replaceAll(',','')).toFixed(this.PointShift);
          }
          this.SpotMidRate = ((Number(this.AskSpot) + Number(this.BidSpot)) / 2 ).toFixed(this.PointShift); //Added by Urmila A | LGTGTWINT-1693 | 9-mar-23
       }
     });
   }
   //end

   //Added by Urmila A | 14-mar-23
  NotificationFunction(type , header, reason)
  {
    this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
      NotificationType: type , //'Error',
      header: header , // 'Error',
      body: reason,
      DateandTime: ''
    });
  }


  //Added by Urmila A | 27-Dec-22 | LGTCLI-208
  fnNotionalCCYToggle(){
    this.NotionalToggle = true; 
    this.ccy2 = true;
    if (this.ccy2 === true && this.NotionalCCY !== this.AltCcy) {
      this.NotionalCCY = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.NotionalCCY = this.DepCcy;
    }

    //Logic added by Urmila A | for LGTCLI-251 | as per client requirement , 12-Jan-23  | start
      //  this.IBPremCCY = this.NotionalCCY
      //  this.IBPremCCY = this.DepCcy //Urmila A | LGTCLI-251 | 30-Jan-23
    //ends
  
    try {
      try {
         //mappings modified by Urmila A | 26-Dec-23
        this.CurrencyPairList.forEach((element) => {
          if (element.asset_Pair === this.CurrencyPair) {
            if (this.NotionalCCY === element.asset1) {
              this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
            } else if (this.NotionalCCY === element.asset2) {
              this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
            }
            this.Notional = this.FXD_cfs.NotionalChangewithDecimalFixes(
              this.Notional,
              this.NotionalDecimalPointShift
            );

            
          }
        });
      } catch (ex) { }
    } catch (Ex) { }

    if(this.UpfrontVal !== 0 && this.UpfrontVal !== ''  ){ 
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
    //end
  }


  //Added by Urmila A |  15-mar-22  | start
  fnIBPremCCYToggle(){
    this.IBPremToggle=true
    this.ccy2 = true;

    if (this.ccy2 === true && this.IBPremCCY !== this.AltCcy) {
      this.IBPremCCY = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.IBPremCCY = this.DepCcy;
    }

    this.fnChangePremCCY() 
    if (Number(this.upfront) !== 0) {
      this.fnFindUpfrontUSD()
    }
    this.fnGetContractSummary();
  
  }

  //Added by Urmila A |   15-mar-22| END


  // Urmila A | Quote Email functionality |  code sync with 5star | 9-Jan-24 | start
  EmailQuote() {
    this.QuteMailClicked = true;
    this.QuoteMailSent = false;
    this.closeQuoteMail = false;
    this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName,this.NoteMasterID.toString(), this.Product_ID, this.DCDRfqId)
      .subscribe((res) => {
        try {
          if (res.errors == undefined) {
            res=res.result        
            if(res === true){
                if (res === true) {
                  this.FXD_cfs.fxdpopupOpenClose=true;
                  this.FXD_cfs.emailQuoteDone=true;  //UrmilaA | 11-Dec-23
                  this.QuoteMailSent = true;
                  this.QuteMailClicked = false;
                } else {
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
            this.FXD_cfs.fnThrowError(res) // added by UrmilaA | F5SAAINT-612 | 30-Nov-23
          }
        } catch (err) { }
      });

  }
  // Urmila A | Quote Email functionality |  code sync with 5star | 9-Jan-24 | ends


  closeOrderPopup() {
    // this.OrderClicked=false; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlaced = true; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlacedPopup = false;
    this.OrderPlaceFlag = false;
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }

  closeEmailQuote() {
    this.QuoteMailSent = false;
    this.closeQuoteMail=true; 
    this.OrderPlaced =true 
  }
  // Urmila A | end


  // Added by Urmila A | Route to dealer functionality | 20-Mar-23 | start
  fnRouteDealerClick() {
    if (this.DealerRemark === '') {
      this.Errormsg = 'Please enter remark'
      this.NotificationFunction("Error", "Error", this.Errormsg)
    } else if (this.DealerRemark !== '') {
      this.Errormsg = ''
      this.routeToDealerClicked = true;
      this.FXD_cfs.fxdpopupOpenClose=true;   
      this.confirmedRouteDealer = false;
      this.SaveTradeEnabledFlag = false 
    }
  }

  fnConfirmRouteToDealer(){
    this.FXD_cfs.loadFlag=true
    // this.confirmedRouteDealer = true;
    // this.routeToDealerClicked = false;   
    // this.routeToDealerClickedloader = false
    this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(this.FXD_afs.EntityID, 
      this.FXD_afs.UserName,
      this.Product_Code,
      this.DCDRfqId,
      this.NoteMasterID,
      this.CustPAN,
      this.DealerRemark,
      this.ExceptionWarningMsg
    ).subscribe((res:any)=>{
        try{
          res=res.result;
          if(res){
            if(res === true){ // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            
              if(res === true){
                this.FXD_cfs.loadFlag=false               
                this.FXD_cfs.RouteToDealerExecuted=true;
                this.FXD_cfs.fxdpopupOpenClose=true;
                this.confirmedRouteDealer=true
                // this.IsRouteToDealerExecuted = true;
                // this.routeToDealerClicked = true;
                // this.routeToDealerClickedloader = true // Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
                console.log('Route to dealer res:',res)
              }
            } else {
              // this.routeToDealerClickedloader = true
              this.NotificationFunction("Error","Error" , "Route to dealer failed.") //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
            }
                                        
          }
        }catch(err) {
          console.log(err.Message);
        }
      })
}

  // closeRouteToDealer() {
  //   this.routeToDealerClicked = false;
  //   this.confirmedRouteDealer = false;
  //   this.IsRouteToDealerExecuted = true;
  // }

  // Modified by UrmilaA | Reject route to dealer | code sync with 5star | start
  fnRejectRouteToDealer() {
    this.RejectRedirectedOrder = true;
    this.RejectSubscriber = this.FXD_afs.FXDRejectRouteToDealerAPI(this.FXD_afs.UserName,
      this.NoteMasterID,this.DealerRemark).subscribe((res: any) => {
        try{         
          if(res){
            if (res.errors == undefined) {
                if(res !== null){
                    console.log('Reject API response:',res);
                    this.RejectedOrderMSG='';                 
                    this.RejectedOrderMSG = res.result; //Urmila A | 18-Dec-23 | Reject route to dealer | F5SAAINT-1176
                    this.FXD_cfs.fxdpopupOpenClose=true;
                    clearInterval(this.RFQLockedInterval); // HSBCPBIN-534 | Chaitanya M | 20 Dec 2023  
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
          this.NotificationFunction("Error, ", "Error", "No response received");
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      }catch(err) {
        console.log(err)
      }
      })
  }
  // Modified by UrmilaA | Reject route to dealer | code sync with 5star | ends

  fnCloseRejectRouteToDealer() {
    this.RejectRedirectedOrder = false;
  }
  // Added by Urmila A | 20-Mar-23 | Reject route to dealer |end

  fnSaveTrade() {
    // this.SaveTradeLoader = true
    this.FXD_cfs.loadFlag=true;
    this.disabledRoutetodealeronSaveTrade = true 
    this.FXD_afs.SetOrderbtnonSaveTrade(true)
    this.fngetSavetradeRecommendation()
  }

  fnChngeRemark(e) {
    this.DealerRemark = e.target.value
  }

  fngetSavetradeRecommendation() {
    //API req body params modified by Urmila A | 21-Aug-23 | Core migration
    this.FXD_afs.getSavetradeRecommendation( this.FXD_afs.UserName, this.NoteMasterID, this.DCDRfqId,
      this.FXD_cfs.fngetMode(),this.DealerRemark) 
      .subscribe((res: any) => {
        try {
          res=res.result;
          if (res)  { //Urmila A | 23-Mar-23
            this.FXD_cfs.saveTradeDone=true;
            this.MinMaxTimer=0;
            clearInterval(this.MinInterval)
            clearInterval(this.maxInterval)
            this.FXD_cfs.fxdpopupOpenClose=true;
            this.FXD_cfs.loadFlag=false;
            // this.SavetradePopup = true
            // this.SaveTradeLoader = false
            // this.SaveTradeEnabledFlag = false
            console.log('SaveTradeRecommendationResult=>', res )
          }
          else {
            // this.SaveTradeLoader = false
            this.FXD_cfs.loadFlag=false;
            this.NotificationFunction("Error", "Error", "Save Trade Idea Failed.")
          }
        } catch (ex) { }
      })
  }

   //Urmila A | 21-mar-23
  fnDisableLoader(e) {
    console.log('Global Loader flag', e)
    this.OrderClicked = e
  }

  fnShowOrHideShedule() {
    let XML = ''; //Urmila A | LGTGTWINT-1332 | 4-Mar-23 | start
  
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
     

    // Start - | HSBCPBIN-535 | Chaitanya M | 11 Oct 2023
    /// Customer Buying EUR Call/USD Put on EUR 200,000.00 at Strike: 1.0608

    //formatting changes added by UrmilaA | 9-Jan-24 | code sync with 5star
    console.log('Schedule XML: ', this.ScheduleDescription = ' ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.CurrencyPair + ' ' 
    + ' Spread on ' + this.NotionalCCY + ' ' + this.Notional + ' at Strike : ' + ( this.StrikePoint !== '' ? this.StrikePoint.replaceAll(/,/g, '') : 0 ));

    this.ScheduleDescription = 'Customer ' + ( this.OrderDirection === 'Buy'  ? 'Buying' : 'Selling' )  + ' ' + this.NotionalCCY 
                              + ' ' + this.OptionType + ' / ' + (this.NotionalCCY === this.AltCcy ? this.DepCcy : this.AltCcy) + ' ' + (this.OptionType === 'Call' ? 'Put' : 'Call') + ' ' + this.BarrierType 
                              + ' on ' + this.NotionalCCY + ' ' + this.Notional 
                              + ' at Strike : ' + ( this.StrikePoint !== '' ? this.StrikePoint.replaceAll(/,/g, '') : 0 );

    // End - | HSBCPBIN-535 | Chaitanya M | 11 Oct 2023
                               

    let spotrate;     
    if(this.OrderDirection == 'Buy'){
      spotrate=this.AskSpot;
    }else{
      spotrate=this.BidSpot;
    }
    if(!this.BestPrice){
      //<CustID>" +this.HomeAPI.CustomerId +   "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
      //formattor changes addde by Urmila A | 9-Jan-24 | code sync with 5star | start
      XML = this.ScheduleXML =
      "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><Spotrate>"+spotrate+
        "</Spotrate><Notional>"+ this.Notional.replace(/,/g, '')+"</Notional><NonDeliveryYN>"+this.NDFFlag+"</NonDeliveryYN><OptionCut>"+this.OptionCut +
        "</OptionCut><OptionType>"+this.OptionType+"</OptionType><CcyPair>"+this.CurrencyPair +
        "</CcyPair><AltCcy>"+this.AltCcy+"</AltCcy><InvCcy>"+this.NotionalCCY+"</InvCcy><PremiumCcy>"+this.IBPremCCY +
        "</PremiumCcy><PremiumDate>"+this.Premiumdate+"</PremiumDate><BuySell>"+this.OrderDirection+
        "</BuySell><FixingDate>"+this.FixingDate+"</FixingDate><TradeDate>"+this.TradeDate+"</TradeDate><SettDate>"+this.MaturityDate +
        "</SettDate><Tenor>"+this.Tenor+"</Tenor><TenorDays>"+this.TenorDays+"</TenorDays><Strike>"+this.StrikePoint.replaceAll(/,/g, '')+
        "</Strike><LowerBarrier>"+Number(this.LowerBarrier.replaceAll(',',''))+"</LowerBarrier><UpperBarrier>"+Number(this.UpperBarrier.replaceAll(',',''))+
        "</UpperBarrier><BarrierType>"+this.selectedBarrierType+"</BarrierType><Entity_ID>"+this.FXD_afs.EntityID +
        "</Entity_ID><TemplateID>"+this.TemplateID+"</TemplateID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>";
    }else if(this.BestPrice){
      this.ScheduleXML = '';
    }
  
  
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

 //Urmila A | 20-mar-23
  ResetPricer(){
    this.PriceClick=false; 
    this.fnResetpricingFlags() 
    this.ClearLPs = true; 
    this.resetSignalRPrice() 
    this.ResetPricerFlag=true;  
    this.RMRemarkVisibility=false; 
    this.RouteFromWorkflow = false;
    this.IsNavigate=false; 
    this.scheduleBtnClick=false 
    this.NewOrderfromRMUnlocked=false;
    this.RouteFromQuoteHistory=false; 
    this.OrderPlaced=false; 

    
  if(this.BestPrice){ 
    this.closeSignalR()   
  }

    this.fnUnsubscribeAllCalls()
    this.ResetAllFields()
 
    this.SetDefaultValues();
    this.fnButtonVisibility();   

    this.fnGetPriceProviderandCcypairs();    
    this.fnGetFXDCurrencyPairs(); 
    this.fnGetContractSummary();
  }

  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 18-May-23 | start
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

  //added by UrmilaA, 10-May-23 | LGTGTWINT-1147 | start
  closeSignalR(){
    if(this.BestPrice && this.ShowRFS && this.NoteMasterID !=='0'){
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

  fnResetpricingFlags(){
    this.MinQuoteTimeOutOccurred =false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.MaxQuotePriceCame= false; // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
    this.btnEnable=false;
    this.noResponseRecv=false; // Urmila A, 29-mar-23
    this.OrderPlaced=false; //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
    this.signalRMsgRecv=false;
  
     //added by urmilaA | LGTGTWINT-2109 | start
     this.MinMaxTimer=0; //UrmilaA | LGTGTWINT-2110|20-June-23
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

 //urmila A | 4-may-23 | LGTGTWINT-1897 | start
 fnchngPriceProvider(e){
  if(e.target.value !== 'Bestprice'){
    this.BestPricelbl = "Price"; //HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
    this.PriceProviderString = e.target.value   
    this.PriceproviderArr.forEach(element => {
              if(element.PP_Code === e.target.value ){
                this.SelectedLPForPricing = element.PP_Name 
                this.SampleArray=element
              }
    });
    console.log('this.SampleArray',this.SampleArray)
  }else{
    this.SelectedLPForPricing = this.BestPricelbl = 'Best Price'; // HSBCFXEINT-80 UI Related Changes | Chaitanya M | 05-March-2024
    this.fngetPriceProviderStr(this.PriceproviderArr)
  }

}
//urmila A | 4-may--23 | LGTGTWINT-1897 | ends


fnUpdatePointShifts(pointshift){ //UrmilaA | 9-Jan-24 | F5SAAINT-528 | code sync with 5star
  this.LowerBarrier !== '' && this.LowerBarrier !== 0  ? this.LowerBarrier = this.FXD_cfs.numberWithCommas(Number(this.LowerBarrier.replaceAll(/,/g, '')).toFixed(pointshift))  : ''
  this.UpperBarrier !== '' && this.UpperBarrier !== 0  ? this.UpperBarrier = this.FXD_cfs.numberWithCommas(Number(this.UpperBarrier.replaceAll(/,/g, '')).toFixed(pointshift)) : ''
  this.StrikePoint !== '' && this.StrikePoint !== 0 ? this.StrikePoint = this.FXD_cfs.numberWithCommas(Number(this.StrikePoint.replaceAll(/,/g, '')).toFixed(pointshift)) : ''
}

  fnOptionCutChange(e){ //UrmilaA | F5SAAINT-906 | //UrmilaA | 9-Jan-24 | F5SAAINT-528 | code sync with 5star
    this.OptionCut=e.target.value;
    this.fnGetDatesCalculationforVB()
  }

  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  fnPremInPipToggle(){

    if(this.PreminPipsToggle === "%"){
      this.PreminPipsToggle = "Pips"
    }else{
      this.PreminPipsToggle = "%"
    }

    if (Number(this.upfront) !== 0) {
      this.fnFindUpfrontUSD();
    }
    
  }
  // ENd: HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024


  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ Start --------------------------------------

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

        this.calculateDays(this.FixingDate,this.TradeDate);
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
  // ENd : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024

  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ End --------------------------------------

  

}
