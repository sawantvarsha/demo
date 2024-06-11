import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { DatePipe } from '@angular/common';
import { SanitizeHtmlPipePipe } from '../../services/sanitize-html-pipe.pipe';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXDSignalRService } from '../../services/fxdsignal-r.service';



@Component({
  selector: 'app-vanilla',
  templateUrl: './vanilla.component.html',
  styleUrls: ['./vanilla.component.scss', '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})
export class VanillaComponent implements OnInit, OnDestroy {
  @Input() Product_ID: number;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  @Input() AppMode: string;
  @Input() ViewMode: string;
  @Input() InputData: any;
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23

  @Input() AllowSolveForYN :any; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023

  //Urmila A | 12-April-23 | start
  @Input() Template_Name:any;  
  @Input() TemplateCode:any;  
  @Input() TemplateID:any; 
  @Input() AllProdData:any; 
  @Input() ShowPriceProviderOnQEN:any;
  @Input() ShowPriceProviderSourceSelectorOnSEN :any;

  DepCcy: string;
  AltCcy: string;
  showCustName:boolean = false; // Gaurav M | 21-Dec-2023 | F5SAAINT-1491
  CurrencyPairList: any[]=[];
  RouteFromQuoteHistory: boolean;
  noResponseRecv: boolean=false;
  PriceproviderArr: any[]=[];
  IBPremNotionalDecimal: any;
  SpreadRounding: any; //F5SAAINT-870 | spread-rounding | UrmilaA | 5-Dec-23
  PremDecimal: any;
  // saveTradeDone: boolean;

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

  private FXRatesubscription: Subscription;
  private TenorDayssubscription: Subscription;
  private FXBidAsksubscription: Subscription;
  private FXDatesCalculationsubscription: Subscription;
  private Bestpricesubscription: Subscription;
  private BookOrdersubscription: Subscription;
  private FXPriceProvidersubscription: Subscription;

  // Added by Urmila A | 12-April-22 | Start
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
  // Added by Urmila A | 12-April-22  | End
  
  // WorkFlowBlotter: WorkflowblotterComponent;
  OrderDirection: any;
  Tenor: any;
  IBPremium: any;
  Strike: any = '';
  upfront: any;
  TradeDate: any;
  FixingDate: any;
  PremiumDate: any;
  MaturityDate: any;
  loadflag = false;
  OptionType: any;
  CurrencyPair: string;
  SpotBid: any;
  SpotAsk: any;
  ClientPrem: any;
  UpfrontPer: any;
  BarrierType: any;
  ServiceResponse: any;
  NotionalCCY: string;
  IBPremCCY: string;
  firstCCY: any;
  secondCCY: any;
  SelectedCurrencies = [];
  FXRateWithPair = [];
  AllDates = [];
  Days: number;
  BestPrice: number;
  BestPriceabs: number;
  BestPriceProvider: string;
  BestPriceString: string;
  ResponseArray = [];
  DCDRfqId: string='';
  ExternalRfqId: string;
  OrderPlaceResponseArray = [];
  Orderplace: string;
  DateArray = [];
  d: any;
  AllCcyPairs = [];
  SampleArray = [];
  PriceProviderString: string;   
  PriceProviderForSolveForStrike: string = ''; // SolveFor changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForLPList = []; // SolveFor changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  Errormsg: string;
  S = [];
  sampleString1: string;
  amount: string;
  tempNumber: number;
  BestPricesFromLPs = [];
  LoadingVanillaFlag: boolean;
  DealNo: string;
  // Simulation Mode Param
  IntRateDOMPer: number;
  IntRateForPer: number;
  DTwo: number;
  DOne: number;
  NDOne: number;
  NDTwo: number;
  NNDTwo: number;
  NNDOne: number;
  CallPremium: number;
  PutPremium: number;
  Delta: string;
  DeltaAmt: string;
  DeltaCcy: string;
  // Standard normalisation
  VolPer: number;
  mean: number;
  Sigma: number;
  Cummulative: number;
  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
  // Actual or Simulated Mode
  UserMode: boolean;
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  XMLString: string;
  UserID: string;
  OrderPlaceFlag: boolean;
  // LP's list with pricing details
  selectedCustomerDetails: any=[]=[];
  CustomerID: string = "";
  ClearPricingFlag: boolean = false;
  CustomerName: string = "";
  PricingModels = ['Black Scholes', 'Vanna Volga'];
  SeletcedPricingModel: string;
  OptionCutOptions = [];
  OptionCut: string;
  TenorOptions = [];
  disabledPrembtn: boolean;
  IBPremComment: string;
  ClientPremComment: string;
  SelectedPricingMode: string = 'Auto';
  SelectedLPForPricing: string = 'Best Price';
  PricingModes = ['Auto', 'Manual'];
  SelectedIBType: string = 'IB Pays';
  SelectedClientType: string = 'Client Pays';
  DisableCCYChangeControl: boolean = false;
  NotionalDecimalPointShift: number = 2;
  StrikeRatePointShift: number = 0;
  PipsMultiplier: number = 0;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;
  CardViewSpot: string = '';
  DisabledCustomerID: boolean = false;

  //added by Urmila A, 12-April-23 | for demo entity (PB) | start
  IsIALoggedIn: boolean;
  BookOrderRes: any=[]=[];
  screenHeight: number;
  screenWidth: number;
  FXDEntitySubscriber: any;
  FXDSendQuoteMailSubscriber: any;
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
  // OrderClicked: any=false;

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
  ResetPricerFlag:boolean = false;
  scheduleBtnClick:boolean=false;
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
  // SaveTradeLoader : boolean = false
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
    productDetail:false,
    productinfo: true,
    ccypairs: false,
    optioncut: false,
    tenor: true, //modified by Urmila A | 18-feb-23
    priceprovider: false,
    bidask: false,
    datecalculation: false,  
  };
  // EntityData:any[] = [] commented by UrmilaA, LGTGTWINT-1898 | 24-april-23
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
  NoofSettChangeYN: any='N';
  custPremDirection:any;
  IBPremDirection:any;
  QuoteMailSent:boolean=false
  AltNotional:any=0;
  IsAdvisoryLoggedIn:boolean=false;
  ExceptionWarningMsg:any='';
  CustPAN:any='';
  routeToDealerClicked:boolean=false;
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
  CurrencyChanged:boolean=false; 
  CcySearch: any = ''; 
  AllAPIsLoaded:boolean=false
  PointShift:any; 
  UpfrontAlt:any;
  //added by Urmila A, 12-April-23 | for demo entity (PB) | end
  //Button visibility checks  | added by Urmila A | 12-April-23 | for demo entity (PB)
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
  togglePremiumMetals : string;
  togglePremiumNonMetals : string;
  togglePremiumCcy : string;

  AllowNonBestBookRM: any;
  AllowNonBestBookDealer: any;
  AllowNonBestBook: any;
  
  showPremAmt : string;

  ViewIndicativeTermsheet:boolean=false; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetDealer: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 
  showtermsheetRM: string = "NO"; // EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024 

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('Width:',this.getScreenWidth, 'Height',this.getScreenHeight)
  }

  NoteMasterID: string;
  TenorDays: any;
  Notional: any;
  IBPrem: any;
  BarriersSubscrber: any;
  Barriers: any[]=[];
  knockInStyle: string;
  knockOutStyle: string;
  ViewScheduleflag: boolean;
  ScheduleVisibility: boolean;
  Clientperc: any;
  selectedBarrierType: any='';
  //ends

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

  LPname:any;

  // START - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  SolveForOptions = []; 
  SelectedSolveFor : any;  
  SolveFor : any; 
  SolveforStrike : boolean = false; 
  Strike_value :any;
  // END - SolveFor changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023 

  PreminPipsToggle :any; // HSBCFXEINT-79 UAT- Pricing in pips & % (Code Sync) | Chaitanya M | 06-March-2024
  
  // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
  UseFinSPL:any = 'NO';
  FinSPLFilePath:any = '';
  public FXDFinSPL: Subscription;
  // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 

  ShowPriceProvider:boolean;
  showPPDropdown:boolean;
  saveTradeSubscriber:Subscription;

  BestPricelbl :any; // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024

  constructor(
    private vps: ViewportScroller,
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    public Common_cfs: CommonApiService,
    private datepipe: DatePipe,
    public CustAPI: CustomerApiService,
    public sanitize :SanitizeHtmlPipePipe,
    public SignalR : FXDSignalRService,  //RFS | Urmila A, 18-May-23, LGTCLI-361
   
  ) {
    this.CustomerID = '';
    this.CustomerName = ''
    this.ServiceResponse = '';
    this.SeletcedPricingModel = '';
    this.OptionCut = '';
    this.disabledPrembtn = false;
    this.ClearPricingFlag = false;
    this.IBPremComment = '';
    this.ClientPremComment = '';
    this.UserGroup= sessionStorage.getItem('UserType');
    this.SelectedSolveFor = ''; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023 
  }

  ngOnInit() {
    this.fnSetEntity() //UrmilaA, 3-May-23 | LGTGTWINT-1949
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
    
    if(this.AllowSolveForYN === true){
      this.SolveForOptions = ['Premium', 'Strike']; 
    }else{
      this.SolveForOptions = ['Premium']; 
    }

    this.getScreenWidth = window.innerWidth; 
    this.getScreenHeight = window.innerHeight; 

    // Urmila A | check View schedule pop-up visibility | start | 8-Dec-22
    this.FXD_cfs.schedulePopupOpenCloseObserver.subscribe(res => {
      if (res === false) {
        this.ViewScheduleflag = false
      } else {
        this.ViewScheduleflag = true
      }
    });
    // Urmila A | check View schedule pop-up visibility | end
    


     //Urmila A | Workflow RFQ Deal details | 12-April-23 | for demo entity (PB) | start
     this.FXD_RFQDealDetailsNavigateSubscriber = this.FXD_afs.FXD_RFQDealDetails_navigateToPricersObs.subscribe((navigateRes:any)=>{
      try{
        
          //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, start   
          if(navigateRes.navigate === true &&  navigateRes.ProdcutCode === 'FXOPTION' ){
            console.log('after redirect data: ', navigateRes);
            this.IsNavigate = true;
            this.BestPricelbl =  'Best Price' //Added by Lalit G || 31-05-24 || button label was not visible
            this.DI_YN = 'N'; //Added by Lalit G || 31-05-24
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
                                        this.FXD_cfs.LockedDealPopUp=true;
                                        this.RFQLockedBy=res.LockStatusMsg       
                                        this.FXD_cfs.fxdpopupOpenClose=true;
                                      
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
                        this.NotificationFunction("Error","Error" , res )
                      }
                       
                         
                    }catch(err){ throw err;  }
              }) 
          }else if(navigateRes.navigate === undefined || navigateRes.navigate === false ){
            // this.getEntityData(); 
            // this.fnGetProductDetails();   
            // this.fnDefaultValues();          
          }
          //modified by Urmila A, 29-Mar-23 | LGTGTWINT-1758, end
      }catch(err) {  console.log(err) }
     });
    //Urmila A | Workflow RFQ Deal details | 12-April-23 | for demo entity (PB) | end

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

  
  //DecimalRate changes added by UrmilaA | HSBCFXEINT-26 | 3-Jan-23 |start
  this.fnGetProductConfig(); //Added by UrmilaA, 18-May-23, fnGetProductConfig | LGTCLI-361 
  this.getPremPercConfig();  
  //DecimalRate changes added by UrmilaA | HSBCFXEINT-26 |3-Jan-23 | ends



    //Urmila A | 20-feb-23 | LGTGTWINT-1444 |start 
    if(!this.IsNavigate){
      console.log('vanilla EntityData',this.EntityData)
      // this.getEntityData(); //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
      console.log('in AQDQ details from parent:', this.Product_ID,this.Product_Code,
      this.Product_Name, this.Template_Name, this.TemplateCode,this.TemplateID,'prod data',this.AllProdData)
      this.fnDefaultValues();
      this.fnButtonVisibility()
      if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
          this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
            console.log('')
          this.AllDataLoaded.productDetail = true;
          // this.fnGetProductConfig(); //Added by UrmilaA, 18-May-23, fnGetProductConfig | LGTCLI-361 
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
            this.AllAPIsLoaded=true;         
          }      
          this.fnGetPriceProviderandCcypairs();  
          this.fnGetFXDCurrencyPairs();
          this.fnGetTenor();
      }else{
          this.fnGetProductDetails(); 
      } 
      // this.fnButtonVisibility();
    }
    //Urmila A | 20-feb-23 | end


   
   
    this.LoadingVanillaFlag = true;
   
  }

  //Added by UrmilaA | HSBCFXEINT-51 | 5-Jan-24 | start
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
  //Added by UrmilaA | HSBCFXEINT-51 | 5-Jan-24 | ends

  //UrmilaA, 3-May-23 | LGTGTWINT-1949
  fnSetEntity(){
      console.log('coming entity data:', this.EntityData)
      // sessionStorage.setItem('FXD_EntityID', this.EntityData[0].code) //mapping modified by Urmila A | 29-Aug-23
      //  this.FXD_afs.SetCredentials() 

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
            res=res.Configs  // RizwanS || to fetch config values|| 30 Aug 2023     
            if(res !== null || res.length > 0){   //conditions modified by Urmila A | 28-Aug-23 
                res?.forEach(element => {
                    if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
                      // Chanegs for MIn And MAx timepur | With discussion with Rahul | 14 Sep 2023
                      if(element.Value === "" || element.Value === undefined || element.Value === null){
                        this.MaxQuoteTimeout = "30"
                      }else{
                        this.MaxQuoteTimeout = element.Value
                      } 
                      //EMD
                      console.log('this.MaxQuoteTimeout',this.MaxQuoteTimeout)
                    }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
                      // Chanegs for MIn And MAx timepur | With discussion with Rahul | 14 Sep 2023
                      if(element.Value === "" || element.Value === undefined || element.Value === null){
                        this.MinQuoteTimeout = "90"
                      }else{
                        this.MinQuoteTimeout = element.Value
                      } 
                      //End
                      console.log('this.MinQuoteTimeout',this.MinQuoteTimeout)
                    } 

                    if(element.Setting_Name === 'OPTDEN_PrincipalBankNameinLPGrid') {
                        this.LPname=element.Value;
                    }  

                    //Added by UrmilaA | F5SAAINT-870 | 5-Dec-23 | start
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

                    //Added by UrmilaA | F5SAAINT-870 | 5-Dec-23 | ends
                      
                    // Start : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                    if(element.Setting_Name == 'UseFinSPLOutputExpressionForLPMapping'){
                      this.UseFinSPL = element.Value.toUpperCase();
                    }

                    if(element.Setting_Name === 'FinSPLOutputExpressionFilePath'){
                      this.FinSPLFilePath = element.Value.toUpperCase();
                    }
                    // End : Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 

                    // START : Added By Chaitanya M || 15-Apr-2024 || JIRA ID : EFGUPINT-194
                    if(element.Setting_Name == 'OPTDEN_AllowToBookTradeWithNonBestPriceLPToRM'){
                      if(element.Value !== ""){
                        this.AllowNonBestBookRM = element.Value.toUpperCase();
                      } else{
                        this.AllowNonBestBookRM = "NO"
                      }
                      
                    }

                    if(element.Setting_Name == 'OPTDEN_AllowToBookTradeWithNonBestPriceLPToDealer'){
                      
                      if(element.Value !== ""){
                        this.AllowNonBestBookDealer = element.Value.toUpperCase();
                      } else{
                        this.AllowNonBestBookDealer = "NO"
                      }
                    }

                    // START : Added By Anmol B || 15-Apr-2024 || JIRA ID : F%SAAINT-3566
                    if(element.Setting_Name == 'OPTDEN_ShowPremiumAmtOnBestPriceGrid'){
                      this.showPremAmt = element.Value.toUpperCase();
                    }
                    // START : Added By Anmol B || 15-Apr-2024 || JIRA ID : F%SAAINT-3566

                    // START : Added By Anmol B || 15-Apr-2024 || JIRA ID : EFGUPINT-194
                    if(element.Setting_Name == 'OPTDEN_AllowToTogglePremiumMethod'){
                      this.togglePremiumNonMetals = element.Value.toUpperCase();
                    }

                    if(element.Setting_Name == 'OPTDEN_AllowToTogglePremiumMethodForMetal'){
                      this.togglePremiumMetals = element.Value.toUpperCase();
                    }

                    if(element.Setting_Name == 'OPTDEN_AllowTogglePremiumCurrency'){
                      this.togglePremiumCcy = element.Value.toUpperCase();
                    }

                    // END : Added By Anmol B || 15-Apr-2024 || JIRA ID : EFGUPINT-194

                      
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
                this.UseFinSPL = "NO"; // Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                this.FinSPLFilePath = ""; // Counterparty Handling via FinSPL -F5SAAINT-3095 | Chaitanya M | 28-March-2024 
                this.AllowNonBestBookRM = "NO"
                this.AllowNonBestBookDealer = "NO"
                this.showtermsheetRM = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
                this.showtermsheetDealer = "NO" //EFGUPINT-206 : Indicative Termsheet Changes | Chaitanya M | 15-April-2024
              }         
          }
    }catch(err) {console.log(err)}
  })
}
//Added by Urmila A, 18-May-23 | LGTCLI-361 | ends
  //added by Urmila A, 12-April-23 | for demo entity (PB) , start
  fnAssignDataLoadValues(){
    this.AllDataLoaded.productDetail = true;
    this.AllDataLoaded.productinfo = true;
    this.AllDataLoaded.ccypairs = true;
    this.AllDataLoaded.optioncut = true;
    this.AllDataLoaded.tenor = true;
    this.AllDataLoaded.priceprovider = true;
    this.AllDataLoaded.bidask = true;
    this.AllDataLoaded.datecalculation = true;  //Urmila A | 2-Feb-23 | LGTGTWINT-1295
    this.OrderPlacedPopup=false;
  }
  //end


  //Added by Urmila A |  12-April-23 | for demo entity (PB)  | start
  fnButtonVisibility(){
    let chkMode = this.FXD_cfs.fngetMode();
    // this.isEmailQuoteVisible = this.isSchedulevisible = this.isResetvisible = true; // HSBCPBIN-535 | Chaitanya M | 17 Oct 2023
    this.isEmailQuoteVisible = this.isResetvisible = true; // HSBCPBIN-535 | Chaitanya M | 17 Oct 2023

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
 //Urmila A | checks button visibility | 12-April-23 | for demo entity (PB) | ends 

   //Urmila A | checks button visibility |12-April-23| starts 
   fnbtncheck(ReqConfig, chkRoute): any {
    switch (ReqConfig) {
            case 'TradeIdeaBtnAccess_LoginUserGroup' :
                  //this.CustAPI.getPledgedAgainstData(ReqConfig) , fngetCommondata added by Urmila A | 29-Aug-23
                    this.CommomDataSubscriber = this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                        try{
                            // res = res.Get_Configurable_Common_DataResult;
                            res = res.cvpData;
                            res.forEach(element => {
                              if(chkRoute === 'Pricer'){
                                  if(element.value.includes(',')){
                                    if (element.value.split(',').includes(this.UserGroup)) {
                                      this.isSaveTradevisible = true
                                    }
                                  }else{
                                      if(element.value ===  this.UserGroup){
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
              //fngetCommondata added by Urmila A | 29-Aug-23
                  this.FXD_afs.fngetCommondata(ReqConfig).subscribe((res) => {
                    if (res) {
                      try{           
                          res = res.cvpData;
                          res.forEach(element => {                          
                                if (chkRoute.toUpperCase() === element.code.toUpperCase() ) {                                                           
                                    if(element.value.split(',').includes(this.UserGroup)){
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


 // Get RFQ from NoteMaster (Deal details functionality), done by Urmila A | 12-April-23 | for demo entity (PB)
  fnSetRFQDetailsFromNotemasterID(data){
    this.TemplateCode = this.TemplateCode;
    this.TemplateID = this.TemplateID
    this.selectedProduct = data.Product_Code;
    this.Product_Code = data.Product_Code;  //Urmila A | 23-Jan-23 | LGTGTWINT-1170
    this.Product_Name= data.Product_Name;
    this.Product_ID = data.Product_Id; // To set the Product ID of respected RFQ | Chaitanya M | 27 July 2023 | LGTGTWINT-
    this.AltCcy = data.Alternate_Ccy;
    this.DepCcy = data.Deposit_Ccy;    
    this.custPremDirection = data.CustPayReceiveDir;
    this.IBPremComment = this.FXD_cfs.fngetIBcomment(data.CustPayReceiveDir) //Urmila A | 17-feb-23 | LGTCLI-314
    this.ClientPremComment = this.FXD_cfs.fngetClientPremComment(data.CustPayReceiveDir); // HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
    this.CcySearch = this.CurrencyPair =  data.Deal_Pair; //Added by Urmila A | 11-Jan-23      
    this.fnPointShift(data);   //Added by Urmila A | LGTGTWINT-1526 | 27-feb-23
    //this.SpotAsk = data.Ask_Rate;
    // this.SelectedPricingMode = data.AutoManual_Type; //commented by Urmila A | 11-Jan-23
    //this.SpotBid = data.Bid_Rate;
    this.Notional= this.FXD_cfs.numberWithCommas(data.OptionNotional !== '' ? Number(data.OptionNotional).toFixed(2) : "");

    data?.RFQ_Deal_Dir == 'S' ? this.OrderDirection = 'Sell' : this.OrderDirection = 'Buy';  //UrmilaA | 3-Jan-24

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

    //added by Urmila A, 4-april-23 | LGTGTWINT-1824 | to update dates only when routed from workflow
    if(this.RouteFromWorkflow){
      this.TradeDate = this.FXD_cfs.convertDate(data.Option_Start_Date);
      this.PremiumDate = this.FXD_cfs.convertDate(data.Deposit_Start_Date);
      this.FixingDate = this.FXD_cfs.convertDate(data.Option_Expiry_Date);
      this.MaturityDate = this.FXD_cfs.convertDate(data.Deposit_End_Date);
    }else if(this.RouteFromQuoteHistory){
      this.TradeDate = this.FXD_cfs.convertDate(new Date())
    }

    this.OptionCut =data.OptionCut;
    this.TenorDays =data.Option_Days;
    this.Tenor = data.Input_Tenure;
    this.TenorOptions.push(data.Input_Tenure)
    this.NotionalCCY = data.Deposit_Ccy;
    this.IBPremCCY=data.RFQ_Prem_Ccy;
    this.fnChangeNotionalCCY();

    this.upfront = this.FXD_cfs.numberWithCommas(Number(data.Spread_PA).toFixed(this.SpreadRounding).replaceAll('-','')); // HSBCFXEINT-38 | Chaitanya M  | 15 Dec 2023 

 
    //mappings mofified by UrmilaA | 3-Jan-24 | HSBCFXEINT-33 | start
    if(data.RFQ_Mkt_Prem_Amt2.includes(',')){ //Added by Urmila A | LGTGTWINT-890 | 9-Jan-23
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt2.replaceAll(',','')).toFixed(4));
    }else{
      this.IBPrem = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Mkt_Prem_Amt2).toFixed(4));
    }
    this.Clientperc = this.FXD_cfs.numberWithCommas(Number(data.RFQ_Cust_Prem_Pct1).toFixed(4))  //UrmilaA | 4-Dec-23
    this.ClientPrem = this.FXD_cfs.numberWithCommas(parseFloat(data.RFQ_Cust_Prem_Amt1).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2)) //UrmilaA | 4-Dec-23 //UrmilaA | 5-Dec-23 | F5SAAINT-585
    
    this.IBPremium=  this.getIBPremValue(data.RFQ_Mkt_Prem_Amt1);
    this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(data.Spread_Amt).toFixed(2));  //upfront in Alt ccy
    this.UpfrontAlt = this.FXD_cfs.numberWithCommas(Number(data.Profit_USD_Amt).toFixed(2)); //upfront in USD
    //mappings mofified by UrmilaA | 3-Jan-24 | HSBCFXEINT-33 | ends

    data.Contract_Summary = data.Contract_Summary.toString().replaceAll("\\n", "<br>");

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
    // this.OrderDirection = data.Product_Code === 'FXAQ' ? 'Buy' : 'Sell'; 

    this.OptionType = data.Option_Class
    if(data.PayReceiveDirection === 'IB Pays'){ //Check added by Urmila A | 17-Jan-23 | as were going blank in contract summary 
      this.IBPremDirection = 'Pay'
    }else if(data.PayReceiveDirection === ''){
      this.IBPremDirection = ''
    }else{
      this.IBPremDirection = 'Receive'
    }

    if(!this.ExecutedQueue ){
      this.fnGetProductDetails();
      this.fnGetPriceProviderandCcypairs() 
      this.fnGetOptionCutFXD();  
      
      //added by Urmila A, LGTGTWINT-1824 , 4-april-23
      if(this.RouteFromQuoteHistory){
          this.NoteMasterID=''
          this.fnGetDatesCalculationforVB();  
      }
    }if(this.ExecutedQueue){
      this.fnGetProductDetails();
    }
    this.fnGetSelectedCCYDetails()
  }

// Added by Urmila A | RFQ Deal details | 12-April-23
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

//Added by Urmila A | RFQ Deal details Unlock deal | 12-April-23
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

fnGetProductDetails(){ //Modified by Urmila A | 12-April-23
  try {
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
     //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
    this.prodDetailSubscriber=this.FXD_afs.fnGetProdDetailsFXD(this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
      // if (res.GetProdDetailsResult.DC_GetProdDetails.length > 0 && this.FXD_cfs.fnCheckSessionValidity(res.GetProdDetailsResult))  {
        if (res) {
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
          this.fnGetTenor();
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


  //modified by Urmila A, 12-April-23, for PB demo entity
  fnDefaultValues() {
    this.CustomerID = '1'
    this.CustomerName = ''

    this.CurrencyPair = 'EUR - USD';
    this.DepCcy = this.CurrencyPair.substr(0, 3);
    this.AltCcy = this.CurrencyPair.substr(6, 8);
    this.IBPremCCY = this.DepCcy;
    this.NotionalCCY = this.DepCcy;

    this.IBPrem = '';
    this.ClientPrem = '';
    this.Clientperc = '';
    this.upfront = (0).toFixed(4);
    this.UpfrontVal='0.00';
    this.UpfrontAlt='0.00';
    this.Notional = '100,000.00';
    this.PriceProviderString = '';
    // this.OrderPlaceFlag = false;
    this.ServiceResponse = null;
    this.OptionCut = '';
    this.custPremDirection='';
    this.IBPremDirection='';
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

    // this.CCY.push('AUD - USD');
    this.BestPrice = null;
    this.d = new Date();
    let Daystring;
    const Day = this.d.getDate();
    if (Day < 10) {
      Daystring = '0' + Day;
    } else {
      Daystring = '' + Day;
    }

    this.TradeDate =Daystring + '-' + this.months[this.d.getMonth()] + '-' + this.d.getFullYear();
    this.OrderDirection = 'Sell';
    this.Tenor = '6M';
    this.Days = 183;
    this.OptionType = 'Put';
    this.Errormsg = '';
    this.Delta = null;
    this.DeltaAmt = null;
    this.DeltaCcy = '';
    this.SeletcedPricingModel = 'Black Scholes';
    this.OptionCut = 'BFIXTOK';
    this.PreminPipsToggle = "%"; // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
    this.BestPricelbl =  'Best Price' // HSBCFXEINT-80 UI Related Changes | ChaitanyaM | 06-March-2024
   
  }


  //added by Urmila A, 12-April-23, for PB demo entity
  getEntityData(){
    //removed EntityId from req params by UrmilaA | 24-april-23
    this.FXDEntitySubscriber =   this.FXD_afs.getEntityData(this.Product_Code) //Core migration : API req paarms modified by Urmila A | 23-Aug-23
    .subscribe((res:any)=>{
      console.log("entity data", res);
      try{
        // if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetEntityDataResult)){
          if (res) {
          if(res.GetEntityDataResult.CVPResponse.CVPData){
            this.EntityData = res.GetEntityDataResult.CVPResponse.CVPData
            sessionStorage.setItem('FXD_EntityID', this.EntityData[0].code)
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

  //Added by Urmila A | 12-April-23, for PB demo entity
  chngEntity(e){
    if(e.target.value === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';   
    }
    
    console.log('entity id:', e.target.value)
    sessionStorage.setItem('FXD_EntityID', e.target.value)
    this.FXD_afs.SetCredentials() //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 
    // commented by UrmilaA, 24-april-23 , as only FXD entityID modified & to not affect EQC / other module

    //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 | start
    this.fnDefaultValues();
    this.fnButtonVisibility()
    this.fnGetPriceProviderandCcypairs();  
    this.fnGetFXDCurrencyPairs();
    //added by UrmilaA, 24-April-23 | LGTGTWINT-1898 | ends
  }

  //function not in use
  //modified by Urmila A, 12-April-23, for PB demo entity
  fnSetDataValues(){
    console.log(this.InputData);
    this.CurrencyPair = this.InputData.Ccy_Pair[0];
    this.BestPrice = null;
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
    this.OrderDirection = this.InputData.BS_Direction[0];
   
    this.Tenor = '6M';
    this.Days = 183;
    this.OptionType = 'Put';
    this.upfront = this.InputData.NM_Upfront[0];
    this.BarrierType = 'ERKIKO';
    this.Notional = this.FXD_cfs.formatNumberKetan(this.InputData.Nominal_Amount[0], 2);
    this.TemplateCode = 'VFXO';
    // this.TemplateID = 40245; //Urmila A | 22-sep-23
    this.Errormsg = '';
    this.Delta = null;
    this.DeltaAmt = null;
    this.DeltaCcy = '';
    this.PriceProviderString = '';
    // this.OrderPlaceFlag = false;
    this.SeletcedPricingModel = 'Black Scholes';
    this.OptionCut = 'BFIXTOK';
    this.IBPrem = this.FXD_cfs.formatNumberKetan(this.InputData.TI_Value4[0], 2);
    this.SelectedIBType = this.InputData.TI_Value1[0];
    this.IBPremCCY = this.InputData.Premium_Ccy[0];
    this.SelectedClientType = this.InputData.TI_Value2[0];
    this.ClientPrem = this.FXD_cfs.formatNumberKetan(this.InputData.Customer_Price[0],2);
  }

  //modified  by urmila a , 12-April-23, start
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
      this.PricingMode
     //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
    ).subscribe( (res) => {
      // if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetFXDPriceProviderDetailsResult)) {
        if (res !== null && res.length > 0) { //Urmila A | 31-Aug-23
        this.AllDataLoaded.priceprovider = true;
        this.PriceProviderString='';
        // this.SampleArray = this.PriceproviderArr= res.GetFXDPriceProviderDetailsResult.PriceProviderDetails;
        this.SampleArray = this.PriceproviderArr= res;
         //changes added by Urmila A, 4-may-23, to get Price provider string , made common function
        this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)
        this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
      }
      console.log('Lps:',this.SampleArray)   
      if(this.RouteFromWorkflow){
        this.fnGetSelectedCCYDetails();
      }
       //end by Urmila A | 11-Jan-23
       if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
        this.AllAPIsLoaded=true;
       }
       
    });

   
  }

  //added by Urmila A | 12-April-23, start
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

  //Added by Urmila A | 12-April-23 | for demo entity (PB) | start
  fnGetSelectedCCYDetails(){
    this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
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
                  res.forEach(async (element) => {
                    this.CurrencyPairList.push(element);      
                    this.Pair_Cross_YN = element.pair_Cross_YN;
                    this.Left_USD_Pair = element.left_USD_Pair;
                    this.Right_USD_Pair = element.right_USD_Pair;  
                    this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
                    this.Asset2_DecimalAmount = element.asset2_DecimalAmount;                 
                  });


                  //added by UrmilaA | code sync with 5Star | 3-Jan-24 
                  this.fnSetNotionalDecimal();  
                  this.fnChangePremCCY()

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
  //Added by Urmila A | 12-April-23 | end


  //Added by Urmila A | 12-April-23 | start
  fnGetFXDCurrencyPairs(){
    this.AllDataLoaded.ccypairs = false;
     this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      '', //selectedDepoCcy
      '', //selectedAlternatCcy
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
            this.NotionalCCY = this.DepCcy;
            this.IBPremCCY = this.DepCcy;
            this.Pair_Cross_YN = element.pair_Cross_YN;
            this.Left_USD_Pair = element.left_USD_Pair;
            this.Right_USD_Pair = element.right_USD_Pair;  
            this.fnGetBidAskRates();        
            this.fnGetOptionCutFXD();
            this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
            this.Asset2_DecimalAmount = element.asset2_DecimalAmount;  

            //added by UrmilaA | 3-Jan-24 | code sync wiht 5star | start
            this.fnChangePremCCY() 
            this.fnSetNotionalDecimal();  
            //added by UrmilaA | 3-Jan-24 | code sync wiht 5star | ends
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
  //Added by Urmila A | 12-April-23 | start

  //Urmila A |  12-April-23 | start
  fnGetBidAskRates() {
    this.AllAPIsLoaded=false;  
    this.AllDataLoaded.bidask = false;
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(      //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code, 
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
        if(res !== null) {
        this.AllDataLoaded.bidask = true;
        this.PointShift = Number(res.PointShift);
        this.fnUpdatePointShifts(this.PointShift); //UrmilaA | HSBCFXEINT-26 | 3-Jan-24
        this.SpotBid = (parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        this.SpotAsk = (parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");     
        this.PipsMultiplier = Number(res.PipsMultiplier);
        this.SpotMidRate = ((Number(this.SpotAsk) + Number(this.SpotBid)) / 2 ).toFixed(this.PointShift); 
       
        this.GetStrikeRate();
        // this.StrikeHighlighter();

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }
  //UrmilaA, 17-april-23
  fnOptionCutChange(e){
    this.OptionCut = e.target.value;
    this.fnGetDatesCalculationforVB()
  }

  //modified by Urmila A, 12-April-23 | start
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
      this.Mode,
      '',
      '' //Core migration: API req parameters modified by Urmila A | 22-Aug-23
    ).subscribe((res) => {
       if (res) {
        this.AllDataLoaded.datecalculation = true;    
        this.PremiumDate = res[0].valueDate;
        this.FixingDate = this.datepipe.transform(res[0].fixingDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.MaturityDate = this.datepipe.transform(res[0].maturityDate, 'yyyy-MM-dd'); // HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
        this.TenorDays = res[0].expiryDays;    

        this.fnGetContractSummary();

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
  }

  //added by Urmila A, 12-April-23, start, for PB demo entity 
  fnGetContractSummary() {
    console.log('all data loaded', this.AllDataLoaded, this.AllAPIsLoaded)     
    this.ContractSummary = ''
    Number(this.Notional.replaceAll(/,/g, '')) > 0 ?  this.NotionalCCY === this.DepCcy ?  parseInt(this.Notional.replaceAll(/,/g, ''), 10) / Number(this.Strike.replaceAll(',','')) : 
    parseInt(this.Notional.replaceAll(/,/g, ''), 10) * Number(this.Strike.replaceAll(',','')) : ''
      
      this.FXDContractSummSubscriber =  this.FXD_afs.fnGetContractSummary(
        Number(this.FXD_afs.EntityID), 
        this.FXD_afs.UserName,
        // this.Product_Code, //commented by Urmila A | 22-Aug-23 | API Core migration: req params modified
        this.TemplateCode.toUpperCase(),
        this.Product_Code, 
        (this.OrderDirection || ''), //added by Chaitanya M | 05 Dec 23 
        this.CurrencyPair,
        this.OptionType,
        this.NotionalCCY,
        this.NotionalCCY === this.DepCcy ? this.AltCcy : this.DepCcy,
        this.IBPremCCY,
        Number(this.Notional.replace(/,/g, '')) > 0 ? Number(this.Notional.replace(/,/g, '')) : 0 ,  
        0,
        this.TenorDays.toString(),  //Urmila A | 9-Mar-23 |LGTGTWINT-1691
        this.FixingDate,
        this.MaturityDate,//settlement
        '',//longdate
        '', //shortdate
        Number(this.Strike.replaceAll(/,/g, '')) > 0 ? Number(this.Strike.replaceAll(/,/g, '')).toFixed(this.PointShift) : '0',//this.Strike //Urmila A | 23-Jan-23
        this.OptionCut,
        '',//barriertype
        '',//Exotic code
        '',// digitaltype
        '0',//upperbarrier
        '0',//lowerbarrier
        '0',
        '0',
        '0',//No of fixing
        '',
        '',//sett freq
        '0.00',//lower strike
        '0.00',//upper strike
        '0.00',//pivot strike
        '',//spread type
        this.custPremDirection,//cust prem dir
        this.BestPrice ? this.IBPremDirection : '', //IB prem dir //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        this.BestPrice ? this.IBPremium  ? Number(this.IBPremium.replaceAll(/,/g, '')).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2), //Urmila A | 1-Feb-23 | LGTGTWINT-1209 
        this.ClientPrem ? Number(this.ClientPrem.replaceAll(',','')).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2) : (0).toFixed(this.IBPremNotionalDecimal ? this.IBPremNotionalDecimal : 2), //RTC , modified by Urmila a | F5SAAINT-295 | 15-Nov-23
        this.BestPrice ? this.IBPrem ? this.IBPrem.includes(',') ? Number(this.IBPrem.replaceAll(/,/g, '')).toFixed(this.PremDecimal ? this.PremDecimal : 4) : Number(this.IBPrem).toFixed(this.PremDecimal ? this.PremDecimal : 4): (0).toFixed(this.PremDecimal ? this.PremDecimal : 4) : (0).toFixed(this.PremDecimal ? this.PremDecimal : 4),//IB prem perc , LGTGTWINT-685, //Urmila A | 1-Feb-23 | LGTGTWINT-1209
        this.Clientperc ? Number(this.Clientperc).toFixed(this.PremDecimal ? this.PremDecimal : 4) : (0).toFixed(this.PremDecimal ? this.PremDecimal : 4), //RTC perc , modified by Urmila a | F5SAAINT-295 | 15-Nov-23
        '0.00',//Target
        '0.00',//target notional
        'No',//KI style rate
        '0.00', //lower KI
        '0.00',//UpperKI 
        '',//Guarentee till , modified by Urmila A | 30-Jan-23
        '0', //Guaranteed Periods  | 30-Jan-23
        '',//capped loss ccy
        '', //capped losstype
        '',//capped loss
        '0.00',//capped loss amt
        '',//target big fig
        '',//target per unit
        '0.00',//target in pips
        '0.00',//KOITME event
        '',//strikestype
        '',
        '',//final pay type
        '',//fixing adjustment
        
      ).subscribe((res) => {
        // if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetContractSummaryResult)) {
          if (res) {
          try{
            console.log(res);
            this.ContractSummary='' ; // Urmila A | 30-Jan-23
            res =  res.result.toString().replaceAll("\\n", "<br>");  // Urmila A | 28-Jan-23
            // this.ContractSummary = res.GetContractSummaryResult.ContractSummary
            // .toString().replaceAll("\\n", "<br>"); //commented by Urmila A | 28-Jan-23
            if(res.includes('color:green')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:green","color:var(--green) !important"))
            }else if(res.includes('color:red')){
              this.ContractSummary = this.sanitize.transform(res.toString().replaceAll("\color:red","color:var(--red) !important"))
            }         
            console.log('contract summ: ', this.ContractSummary)   
           
          }catch(err){ console.log('Exception in Contract summary',err)}
                  
        }else{
          this.ContractSummary = 'No response received'
        }
      });
    
  }

//Added by Urmila A | 12-April-22 |start
fnNotionalCCYToggle(){
  this.NotionalToggle = true; 
  this.ccy2 = true;
  if (this.ccy2 === true && this.NotionalCCY !== this.AltCcy) {
    this.NotionalCCY = this.AltCcy;
    this.ccy1 = true;
  } else if (this.ccy1 === true) {
    this.NotionalCCY = this.DepCcy;
  }


 
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


  //modified by UrmilaA, 12-April-23 | start
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

          // LGTCLI-448 | FXD Enable PM Option Cut BFIXTOK | Chaitanya M | 14 Aug 2023
          if(!this.IsNavigate){
            this.OptionCut = res[0].OptionCut
          } 
         //End
	 
          this.fnGetDatesCalculationforVB();

          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }   

      }else{
        this.AllDataLoaded.optioncut = true;
        // this.NotificationFunction("Error","Error" , res)
      }
    });
  }

  //Modified by Urmila A | 12-April-23
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
        //mapping modified by Urmila A | 31-Aug-23 | as response modified
        if (res.length > 0 && res !== null) {
        this.AllDataLoaded.tenor = true;
        res.forEach((element) => { // Removed by RizwanS || to fetch tenor values|| 30 Aug 2023 
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

  //modified by UrmilaA, 12-April-23  
  ngOnDestroy() {
  
    this.CurrencyPairList = [];
    this.DestroyFn();   
    this.fnUnsubscribeAllCalls();

    // this.OptionCutOptions = [];
    // this.TenorOptions = [];
    // if (this.FXRatesubscription) this.FXRatesubscription.unsubscribe();
    // if (this.TenorDayssubscription) this.TenorDayssubscription.unsubscribe();
    // if (this.FXBidAsksubscription) this.FXBidAsksubscription.unsubscribe();
    // if (this.FXDatesCalculationsubscription) this.FXDatesCalculationsubscription.unsubscribe();
    // if (this.FXPriceProvidersubscription) this.FXPriceProvidersubscription.unsubscribe();
    // if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    // if (this.BookOrdersubscription) this.BookOrdersubscription.unsubscribe();
  }


   //Added by Urmila A | 12-April-23 
   DestroyFn(){
    this.btnEnable=false; //UrmilaA |LGTCLI-361 | 22-May-23
    this.closeSignalR() //UrmilaA, 22-May-23 | LGTGTWINT-1147
    this.OrderPlaced = false
    this.OrderPlacedPopup =false;
    // this.OrderPlaceFlag=false;
    this.SessionInvalid = false; 
    this.TenorOptions = [];
    // this.CurrencyPairList = []; //Urmila A | 24-feb-23
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
  if (this.FXPriceProvidersubscription){
    this.FXPriceProvidersubscription.unsubscribe();
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
  if(this.FXDFixingDateSubscriber){
    this.FXDFixingDateSubscriber.unsubscribe()
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

  if(this.saveTradeSubscriber) this.saveTradeSubscriber.unsubscribe()
}

  scroll(idWorkFlowBlotter) {
    this.vps.scrollToAnchor(idWorkFlowBlotter);
  }

  isMatch(element, _index, _array) {
    return (element + '').includes(this.CurrencyPair);
  }

  SmartSearch(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.CurrencyPair = target.value;
    // this.AllCcyPairs = this.AllCcyPairs.filter(this.isMatch);
  }

  TenorChanged(e) {
    this.Tenor = e.target.value
    this.ResetAllFields();
    this.MaturityDate = '';
    this.FixingDate = '';
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

  //modified by Urmila A, 12-April-23
  setCCY() {
    this.ResetAllFields();
    this.fnGetBidAskRates();
    // const target = this.FXD_cfs.GetEventTarget(e);
    // this.CurrencyPair = target.value;
    this.DepCcy = this.CurrencyPair.slice(0, 3);
    this.AltCcy = this.CurrencyPair.slice(6, 9);
    this.NotionalCCY = this.DepCcy;
    this.IBPremCCY = this.DepCcy;
    this.ccy1 = true;  
    this.ccy2 = false;  
    this.SpotAsk = '';
    this.SpotBid = '';

    this.fnIsMetalInCcy(false);
    this.fnChangeNotionalCCY(); 
    this.fnGetDatesCalculationforVB();
  }

  //Urmila A | 17-april-23
  fnchngOptionType(e){
    this.OptionType = e.target.value
    this.fnGetContractSummary()
  }

  //modified by UrmilaA,  4-Jan-24 | Added Number formatter changes, and called UpfrontUSD function  | start
  StrikePointChanged(e) {
   
    const target = this.FXD_cfs.GetEventTarget(e);
    this.Strike = this.FXD_cfs.numberWithCommas(Number(target.value).toFixed(this.PointShift)); 
    this.fnGetContractSummary()

    if(Number(this.upfront) !== 0){
      this.fnFindUpfrontUSD();
    }

  }
  
  //modified by UrmilaA,  4-Jan-24 | Added Number formatter changes, and called UpfrontUSD function  | ends


  StrikeValidation(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value) {
      if (target.value === '.') {
        target.value = '0';
      }
      if (Number(this.SpotAsk) >= 100 && Number(this.SpotBid) >= 100) {
        target.value = parseFloat(target.value).toFixed(2);
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
    }
  }
    // Added by Urmila A | 20-Dec-22 | start
    fnChngeRemark(e){
      try{
        this.DealerRemark = e.target.value
      }catch(err) {}
        
    }

  ConvertNumberToPipes(_StrikeRate: string, _SpotRate: string) {
    // console.log(StrikeRate, SpotRate);
  }

  // Start - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023  
  CalculateUpfront(){
    if(this.upfront !== '' || this.upfront !== '0'){
      this.fnFindUpfrontUSD();
    }
  }
  // End - LGTGTWINT-2449 | Chaitanya M | 01 Dec 2023  

  //modified by Urmila A, 14-April-23
  UpfrontChanged(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    this.upfront = this.FXD_cfs.numberWithCommas(Number(target.value).toFixed(this.SpreadRounding)); //UrmilaA | 10-Jan-24 | F5SAAINT-870 | code sync with 5Star
    this.fnFindUpfrontUSD();
  }
  
  OrderDirectionChanged() {
    this.ResetAllFields();
    // const target = this.FXD_cfs.GetEventTarget(e);
    // this.OrderDirection = target.value;
    if (this.OrderDirection === 'Buy') {
      this.Strike = this.SpotAsk;
      this.CardViewSpot = this.SpotAsk;
    } else {
      this.Strike = this.SpotBid;
      this.CardViewSpot = this.SpotBid;
    }
  }

  //Modified by Urmila A | 13-April-23 | start
  FXBestPrice() {
    
     //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | starts
     this.PriceRecvFromLPs=0;  //UrmilaA, 22-May-23, LGTCLI-361
     this.fnResetpricingFlags(); ////UrmilaA, 30-May-23, LGTCLI-361
     this.ClearLPs = true; 
     //code shifted by UrmilaA, 22-may-23 | LGTCLI-361 | ends
 
     this.ClearPricingFlag = true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23
     this.PriceClick=true; //added by UrmilaA LGTGTWINT-2109 | 12-Jun-23

    if(this.ServiceResponse !== null){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      this.OrderPlaced = false; 
      this.BestPrice=null ;//UrmilaA | LGTGTWINT-1941 | 2-May-23
    }

    if(this.RouteFromWorkflow === true){
      this.PriceRecAfterRepricefromBlotter= true;
      this.NoteMasterID = this.NoteToUnblock; 
      this.ScheduleCallWithGuarenteeperiod=false;
    }else { 
      this.NoteMasterID = '0';
    }


    if (this.SelectedPricingMode === 'Auto') {
      if (this.Validations() && this.Errormsg === '') {
        this.priceLoader=true; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
        this.RFQNODisplayFromParent = false;

        if(!this.IsNavigate){ //UrmilaA | 22-Sep-23
          this.ResetAllFields();
        }
       
        // this.GenerateUserID();
        this.disabledPrembtn = true;
        this.loadflag = true;

        this.ClearPricingFlag = false;
        const SpotRate =(this.OrderDirection === 'Sell' ) ? this.SpotAsk : this.SpotBid ;

        this.fnIsMetalInCcy(true); // HSBCFXEINT-25  | Chaitanya M | 06 Dec 2023

        //customer ID, name changes added by UrmilaA, 17-April-23
        //EntityId changes by UrmilaA, LGTGTWINT-1908 | 24-April-23
        // eslint-disable-next-line @typescript-eslint/quotes
        //<CustID>" +this.HomeAPI.CustomerId +   "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name> , removed by urmilaA, as told by rahulP | 4-may-23
      
        this.XMLString = "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><Spotrate>"+SpotRate+
        "</Spotrate><Notional>"+ this.Notional.replace(/,/g, '')+"</Notional><NonDeliveryYN>"+this.NDFFlag+"</NonDeliveryYN><OptionCut>"+this.OptionCut +
        "</OptionCut><OptionType>"+this.OptionType+"</OptionType><CcyPair>"+this.CurrencyPair +
        "</CcyPair><AltCcy>"+this.AltCcy+"</AltCcy><InvCcy>"+this.NotionalCCY+"</InvCcy><PremiumCcy>"+this.IBPremCCY +
        "</PremiumCcy><PremiumDate>"+this.PremiumDate+"</PremiumDate><BuySell>"+this.OrderDirection+
        "</BuySell><FixingDate>"+this.FixingDate+"</FixingDate><TradeDate>"+this.TradeDate+"</TradeDate><SettDate>"+this.MaturityDate +
        "</SettDate><Tenor>"+this.Tenor+"</Tenor><TenorDays>"+this.TenorDays+"</TenorDays><Strike>"+this.Strike.replaceAll(',','')+
        "</Strike><Entity_ID>"+this.FXD_afs.EntityID +
        "</Entity_ID><TemplateID>"+this.TemplateID+"</TemplateID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>";
        console.log('AllDataLoaded.productDetail',this.AllDataLoaded.productDetail)
        let fxd_Mode = this.FXD_cfs.fngetMode()
        this.FXD_afs.SetPricingProduct(this.Product_Name);     

        let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)

        //Core Migration : API req parameters modified by Urmila A | 25-Aug-23 
        this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBNew(
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
          'PREMIUM' ,
          this.OrderDirection.toUpperCase(),
          // this.OptionType,
          this.Strike.toString().replaceAll(',',''),
          '0', //lower barrier
          '0', //upper barrier
          '', //BarrierType
          '', //KnockIn_Style
          '', //KnockOut_Style
          this.OptionCut,
          this.Tenor, 
          this.PremiumDate,
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
          this.ShowRFS, //UrmilaA, 18-May-23 | (SignalR, RFS | LGTCLI-361)
          this.OptionType, //CallPut
          this.upfront.replaceAll(',',''),
          this.Mode,
          this.DI_YN,
          '',//KIType
          ActiveRemark,
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
          this.ResetAllfieldsCalled=false; 
          if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          try{
              if (res) {
                this.PriceClick=false; //urmilaA | LGTGTWINT-2109           
                if(res.errors == undefined && res.oPriceResponseBody[0].bestPriceProvider !== 'FAIL:FAIL'){   //Error handling logic modified by Urmila A | 15-sep-23     
                  this.ServiceResponse = res = res.oPriceResponseBody;        
                    if(this.ServiceResponse[0].quoteId == 0){
                      this.noResponseRecv = true;
                      this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                      this.NotificationFunction("Error","Error" , this.ServiceResponse[0].errorMessage)
                    }
                      if(this.ServiceResponse == null || this.ServiceResponse.length == 0){
                        this.disabledPrembtn = false;
                        this.priceLoader=false; // UrmilaA | LGTGTWINT-2109 | 9-jun-23
                        // this.OrderPlaceFlag = false;
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
                              this.ResponseArray = this.ServiceResponse[0].bestPriceProvider.split(':');                                    
                              this.BestPriceProvider = this.ResponseArray[0];          
                              this.PriceRecvFromLPs = this.FXD_cfs.fnGetLP_withPrice(this.ServiceResponse); ///Urmila A | 16-feb-23 | LGTCLI-315                          
                              this.ServiceResponse.forEach(element => {
                                if(this.BestPriceProvider === element.provider){                                     
                                      this.AssignAfterPriceValues(element)
                                }
                              });                             
                              
                              
                              console.log('in RFS , price recv from LPs',this.PriceRecvFromLPs )
                              if(this.isSaveTradevisible)  //added by UrmilaA | 16-June-23 |LGTGTWINT-2137
                              {
                                this.SaveTradeEnabledFlag = true
                                this.disabledRoutetodealeronSaveTrade = false
                                this.FXD_afs.SaveTradeBtnFlag.next(false)
                              }

                            }
                      }
                 
                 
                } else{   
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
        });
      }else{
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
    try{

      this.ClearLPs = false; //added by UrmilaA, 23-May-23 | LGTCLI-361      
      this.BestPriceProvider = element.provider;
      this.BestPrice = element.premiumAmount;
      this.NoteMasterID = element.NoteMasterID;
      // this.fnSetIBPrem(element.premiumAmount);
      this.ExternalRfqId = element.quoteId;
      this.BestPriceabs = Math.abs(element.premiumAmount);

      // this.upfront = parseFloat(element.premium).toFixed(4) //Added by UrmilaA | LGTGTWINT-2061 | 2-June-23     
      // this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(element.premiumAmount).toFixed(2));

      // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
      if(this.PreminPipsToggle === "%"){

        this.IBPremium = this.getIBPremValue(element.premiumAmount);
        this.IBPrem = parseFloat(element.premium).toFixed(4).replaceAll('-',''); 
        this.ClientPrem = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal, false);
      
      }else{

        this.IBPrem = this.FXD_cfs.ConvertIntoPIPs(this.Notional.replaceAll(',', ''), this.Strike.replaceAll(',',''), element.premiumAmount, this.PointShift, this.IBPremCCY, this.NotionalCCY,this.DepCcy);
        this.IBPremium = this.getIBPremValue(element.premiumAmount)  
        this.ClientPrem = this.findClientPrem(element.premiumAmount, element.premium,this.UpfrontVal, true); //Modified by LalitG@10May2024 || Initialised value to ClientPrem insted of Clientprec || HSBCFXEINT-95
        
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

      // Start : HSBCFXEINT-112 | Spot updated is not proper for Call/Put option and buy sell direction. | Chaitanya M | 21May2024
      if(this.OrderDirection.toLowerCase() === 'buy'){
        if(this.OptionType.toUpperCase() == "PUT"){
          this.SpotBid = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
        }else{
          this.SpotAsk = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
        }
      }else{
        if(this.OptionType.toUpperCase() == "PUT"){
          this.SpotAsk = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
        }else{
          this.SpotBid = this.FXD_cfs.numberWithCommas(Number(element.spot).toFixed(this.PointShift));
        }
      
      }
      // End : HSBCFXEINT-112 | Spot updated is not proper for Call/Put option and buy sell direction. | Chaitanya M | 21May2024

      this.fnFindUpfrontUSD();
      this.fnGetContractSummary();  

    } catch (error) {
      console.log(error.message);
    }
          
  }

  //Modified by Urmila A | 3-Jan-23 | code sync with 5Star
  getIBPremValue(prem){
    this.IBPremNotionalDecimal !== undefined ? this.IBPremium = Number(prem).toFixed(this.IBPremNotionalDecimal) : this.IBPremium = Number(prem); //UrmilaA | F5SAAINT-585 | 5-Dec-23 
    return this.FXD_cfs.numberWithCommas(this.IBPremium)
  }

  //Modified by Urmila A | 3-Jan-23 | code sync with 5Star
  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  findClientPrem( IBPrem, perc, upfront,solveinPIPS){

    upfront =  this.getUpfrontval(upfront)
    
    let ClientPrem
    let _Notionalamt = this.Notional.replaceAll(',', '');
    let _strikeRate = this.Strike.replaceAll(',','');

    if(solveinPIPS === true){

      if(perc < 0){      
        this.ClientPrem = Math.abs(IBPrem) + parseFloat(upfront);
        this.Clientperc = (Number(perc) + parseFloat(this.upfront)).toFixed(4).replaceAll('-','');        
      }else{
        this.ClientPrem = Math.abs(IBPrem) - parseFloat(upfront);
        this.Clientperc = (Number(perc) - parseFloat(this.upfront)).toFixed(4).replaceAll('-','');
      }

      this.Clientperc = this.FXD_cfs.ConvertIntoPIPs(_Notionalamt, _strikeRate, this.ClientPrem, this.PointShift, this.IBPremCCY, this.NotionalCCY,this.DepCcy);  

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
      if (this.NotionalCCY === this.firstCCY) {
        this.AltNotional =
          Number(this.Notional.toString().replace(/,/g, '')) * Number(this.Strike.replaceAll(',',''));
      } else {
        this.AltNotional =
          Number(this.Notional.toString().replace(/,/g, '')) / Number(this.Strike.replaceAll(',',''));
      }
      this.ClearPricingFlag = false;
      const SpotRate =
        (this.OrderDirection === 'Sell' && this.OptionType === 'Call') ||
          (this.OrderDirection === 'Buy' && this.OptionType === 'Put')
          ? this.SpotBid
          : this.SpotAsk;
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
        Number(this.Notional.toString().replace(/,/g, '')) +
        '</Notional><OptionType>' +
        this.OptionType +
        '</OptionType><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>' +
        this.CurrencyPair +
        '</CcyPair><AltCcy>' +
        (this.NotionalCCY === this.firstCCY ? this.secondCCY : this.firstCCY) +
        '</AltCcy><InvCcy>' +
        this.NotionalCCY +
        '</InvCcy><PremiumCcy>' +
        this.IBPremCCY +
        '</PremiumCcy><CustPrem>0</CustPrem><Tenor>' +
        this.Tenor +
        '</Tenor><PremiumDate>' +
        this.PremiumDate +
        '</PremiumDate><BuySell>' +
        this.OrderDirection +
        '</BuySell><FixingDate>' +
        this.FixingDate +
        '</FixingDate><SpreadAmt>' +
        this.upfront.replaceAll(',','') +
        '</SpreadAmt><TradeDate>' +
        this.TradeDate +
        '</TradeDate><SettDate>' +
        this.MaturityDate +
        '</SettDate><Strike>' +
        this.Strike.replaceAll(',','') +
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
        this.NotionalCCY === this.firstCCY ? this.secondCCY : this.firstCCY,
        this.IBPremCCY,
        this.NotionalCCY,
        this.Notional.toString().replace(/,/g, ''),
        this.AltNotional,
        this.OrderDirection,
        this.OptionType,
        this.Strike.replaceAll(',',''),
        '0',
        '0',
        '',
        'EUROPEAN',
        'EUROPEAN',
        'TOK',
        this.Tenor + '',
        this.PremiumDate,
        this.FixingDate,
        this.MaturityDate,
        '', //this.PriceProviderString,
        'Premium',
        this.TemplateCode,
        this.TemplateID,
        this.Notional.toString().replace(/,/g, ''),
        '',
        '',
        '',
        '',
        0,
        '',
        this.XMLString,
        this.upfront.replaceAll(',',''),
        this.UserID,
        this.SeletcedPricingModel,
        // this.SelectedPricingMode,
        'GWManual',
        this.SelectedClientType,
        this.SelectedIBType,
        '',
        this.IBPrem, //'5000', //
        this.ClientPrem //'1000' //,
      ).subscribe((res) => {
        this.BestPrice = null;
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          if (res) {
            console.log(res);
            if (res) {
              this.ServiceResponse = res[0];
              // this.fnSetIBPrem(this.ServiceResponse.IBPrem);
              // this.IBPrem = this.ServiceResponse.IBPrem;
              this.BestPriceProvider = this.ResponseArray[0];
              this.BestPrice = this.ServiceResponse.IBPremPerc;
              this.ClientPrem = parseFloat(this.ServiceResponse.CustPrem).toFixed(this.IBPremCCY === this.secondCCY ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              this.UpfrontPer = this.ServiceResponse.MarginPerc;
              this.SelectedClientType = this.ServiceResponse.CustPayReceiveDirection;
              this.SelectedIBType = this.ServiceResponse.IBPayReceiveDirection;
              this.DCDRfqId = this.ServiceResponse.DCDRFQID;
              this.ExternalRfqId = '';

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

  fnCalcUpfrontAndIbPrem() {
    var UpfrontInCcy = 0;

    if (this.IBPremCCY === this.firstCCY && this.NotionalCCY === this.secondCCY) {
      UpfrontInCcy = ((Number(this.Notional.toString().replace(/,/g, '')) / parseFloat(this.Strike.replaceAll(',',''))) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    } else if (this.IBPremCCY !== this.NotionalCCY) {
      UpfrontInCcy = (Number(this.Notional.toString().replace(/,/g, '')) * parseFloat(this.Strike.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    } else {
      UpfrontInCcy = (Number(this.Notional.toString().replace(/,/g, '')) * (parseFloat(this.upfront.replaceAll(',','')) / 100));
    }

    if (this.OrderDirection === 'Buy') {
      //data.clientPrem = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) + Number(data.upfront)))) / 100).toString();
      this.ClientPrem = (parseFloat(this.fnGetIBPrem()) + UpfrontInCcy).toFixed(this.IBPremCCY === this.secondCCY ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      //data.clientPrem = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) - Number(data.upfront)))) / 100).toString();
      this.ClientPrem = (parseFloat(this.fnGetIBPrem()) - UpfrontInCcy).toFixed(this.IBPremCCY === this.secondCCY ? this.Asset2_DecimalAmount : this.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  fnGetIBPrem() {
    return this.IBPrem.replace(/,/g, '');
  }

  GenerateUserID() {
    this.UserID = 'GMUser_' + Math.floor(Math.random() * 1000 + 1).toString();
  }

  Validations() {

    //commented by UrmilaA, 13-april-23
    // if(this.CustomerID === '' || this.CustomerID === undefined){
    //   this.Errormsg = 'Please Select Customer';
    //   return false;
    // }else{
    //   this.Errormsg = '';
    // }
    // if (this.DisableCCYChangeControl === true) {
    //   try {
    //     if (Number(this.Notional.toString().replace(/,/g, '')) >= 1) {
    //       this.Errormsg = '';
    //     } else {
    //       this.Errormsg = 'Notional below ' + this.NotionalCCY + ' 1 not allowed';
    //       return false;
    //     }
    //   } catch (ex) {

    //   }
    // } else if (Number(this.Notional.toString().replace(/,/g, '')) < 100000) {
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
    

    //added by UrmilaA, 13-april-23
    if (!(Number(this.Strike.replaceAll(/,/g, '')) > 0)) {  //formatter added by Urmila A |  8-Jan-24
      this.Errormsg = 'Strike cannot be zero or blank';
      return false;
    }

    //added by UrmilaA, 13-april-23
    if(this.SpotAsk.includes(',') || this.SpotBid.includes(',')){
      if (Number(this.SpotAsk.replaceAll(',','')) > 0 && Number(this.SpotBid.replaceAll(',','')) > 0) { //formatter added by Urmila A |  8-Jan-24
        this.Errormsg = '';
      } else {
        this.Errormsg = 'Spot cannot be zero or blank';
        return false;
      }
    }else{
        if (Number(this.SpotAsk) > 0 && Number(this.SpotBid) > 0) {
          this.Errormsg = '';
        } else {
          this.Errormsg = 'Spot cannot be zero or blank';
          return false;
        }
    }

    if ( this.upfront == '' ) {
      this.Errormsg = 'Please Enter Upfront %';
      return false;
    } else {
      this.Errormsg = '';
    }
    
   
    // if (Number(this.IBPrem.toString().replace(/,/g, '')) >= 1) {
    //   this.Errormsg = '';
    // } else {
    //   this.Errormsg = 'Please enter valid IB Prem';
    //   return false;
    // }
    if (
      this.TradeDate !== '' &&
      this.PremiumDate !== '' &&
      this.FixingDate !== '' &&
      this.MaturityDate !== ''
    ) {
      this.Errormsg = '';
    } else {
      this.Errormsg = 'Dates are not loaded';
      return false;
    }
    return true;
  }

  //modified by Urmila A | 14-April-23
  ResetAllFields() {
    this.FXD_cfs.saveTradeDone=false;
    this.FXD_cfs.RouteToDealerExecuted=false;
    this.ResetAllfieldsCalled=true; 
    this.PriceClick=false;
    // this.fnResetpricingFlags()  // HSBCFXEINT-9 | Chaitanya M | 24 Nov 2023
    this.ClearLPs=true; 
    this.ResetAllfieldsCalled=true;
    
    if(this.BestPrice && this.ServiceResponse !== null){ 
      this.closeSignalR()  
      this.NoteMasterID=''; 
      this.fnSetAfterPriceValues(); 
    }  
    
    this.fnResetpricingFlags(); // HSBCFXEINT-9 | Chaitanya M | 24 Nov 2023
    this.resetSignalRPrice()
    this.ClearPricingFlag = true;
    this.ViewScheduleflag = false;
    this.ExternalRfqId = null;
    this.ServiceResponse = null;
    this.BestPriceString = '';
    this.ResponseArray = [];
    this.BestPrice = null;
    this.BestPriceProvider = '';
    this.Orderplace = '';
    this.loadflag = false;
    this.Errormsg = '';
    this.DealNo = '';
    this.DCDRfqId = ''
    // this.OrderPlaceFlag = false;
    this.IBPremComment = '';
    this.ClientPremComment = '';
    this.ScheduleVisibility = false;
    // this.OrderClicked=false;
    this.OrderPlaced=false;
    // this.OrderPlaceFlag = false;
    this.BestPriceString = '';
    this.ResponseArray = [];
    this.orderMsg = ''
   
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    if (this.BookOrdersubscription) this.BookOrdersubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.routeToDealerClicked = false;
    this.confirmedRouteDealer = false;
    
  }

  //Added by UrmilaA | 6-June-23 | LGTGTWINT-2079| start
  fnSetAfterPriceValues(){
    this.upfront = (0).toFixed(4);
    this.UpfrontAlt = ''; 
    this.UpfrontVal = '0.00'; // Modified by LalitG@10May2024 || Added default value to resolve Nan issue || HSBCFXEINT-95
    this.IBPrem=''
    this.IBPremium=''
    this.Clientperc=''
    this.ClientPrem='' 
  }

  GeneratePipes(_StrikeRate: string, SpotRate: string) {
    this.Strike = Math.round(Number(this.Strike.replaceAll(',','')) * this.PipsMultiplier - Number(SpotRate) * this.PipsMultiplier);
  }

  //modified by Urmila A | 13-April-23
  BookDeal() {
    this.FXD_cfs.loadFlag=true;
    // this.OrderClicked = true;
    // this.OrderPlaceFlag = true;
    this.ScheduleVisibility = false;
    let ActiveRemark = this.FXD_cfs.fnGetRemark(sessionStorage.getItem('UserType'), this.RouteFromWorkflow, this.DealerRemark, this.RMRemark)

    this.BookOrdersubscription = this.FXD_afs.BookOrderforVBNew(
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
          if (res) {   
            //mappings modified by Urmila A | 14-sep-23
            this.FXD_cfs.loadFlag=false;            
            this.OrderPlaced = true   
              if (res !== null){                 
                  this.ViewScheduleflag = false;
                  this.Orderplace = res.External_TradeID;
                  this.DealNo = res.DealNo;
                  this.FXD_cfs.DealBooked.next(false)
                  this.FXD_cfs.fxdpopupOpenClose=true;
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
              
                // if(res.ResponseTradeBookParameters.isOrderRejected === true && res.ResponseTradeBookParameters.RejectionReason !== ''){
                //     this.NotificationFunction("Error","Error", 'Order rejected due to some technical reasons')
                // }else if(res.ResponseTradeBookParameters.RejectionReason !== '' && res.ResponseTradeBookParameters.External_TradeID === null && res.ResponseTradeBookParameters.isOrderRejected === false){
                //       this.NotificationFunction("Error","Error", 'Order may have got executed or may have failed. Contact support')
                // }else{
                //   this.NotificationFunction("Error", "Error", res.A_ResponseHeader.FailedReason)
                // }
              }
          }
       
  
      }
    });
  }

  TradeSelectedLP(_SelectedLPDetails) {
    this.BookDeal();
  }

  fnDisableTradebtn(_e) {
    // this.OrderPlaceFlag = e;
    this.ViewScheduleflag = false;
  }

  GetStrikeRate() {
    //Added by Urmila A | 10-Jan-24 | code sync with 5Star
    if(this.OptionType === 'Call'){
      if(this.OrderDirection === 'Buy'){
          this.Strike = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.SpotAsk)).toFixed(this.PointShift));  //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
      }else{
          this.Strike = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.SpotBid)).toFixed(this.PointShift));  //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
      }
    }else{
        if(this.OrderDirection === 'Buy'){
          this.Strike = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.SpotBid)).toFixed(this.PointShift)); //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }else{
          this.Strike = this.FXD_cfs.numberWithCommas(Number(this.fnCheckComma(this.SpotAsk)).toFixed(this.PointShift)); //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }
    }
    if(this.Notional !== '' || this.Notional === 0)  { 
      this.fnFindUpfrontUSD();
    }
    
  }

  //added by Urmila A | 23-mar-23
  fnCheckComma(num){
    if(num.includes(',')){
        return num.replaceAll(',','')
    }else{
        return num
    }
 }

  SimulationMode() {
    this.IntRateDOMPer = 0.02;
    this.IntRateForPer = 0.02;

    this.DTwo = 0;
    this.DOne = 0;
    this.NDOne = 0;
    this.NDTwo = 0;
    this.NNDTwo = 0;
    this.NNDOne = 0;
    this.CallPremium = 0;
    this.PutPremium = 0;
    this.VolPer = 0.15;

    this.DOne =
      Math.log(
        (this.OrderDirection === 'Sell' ? this.SpotBid : this.SpotAsk) /
        Number(this.Strike.replaceAll(',',''))
      ) +
      (this.IntRateDOMPer -
        this.IntRateForPer +
        this.VolPer * this.VolPer * 0.5 * (this.Days / 360)) /
      (this.VolPer * Math.sqrt(this.Days / 360));
    this.DTwo = this.DOne - this.VolPer * Math.sqrt(this.Days / 360);
    this.NDTwo = this.NORMDIST(this.DTwo);
    this.NDOne = this.NORMDIST(this.DOne);
    this.NNDTwo = this.NORMDIST(-1 * this.DTwo);
    this.NNDOne = this.NORMDIST(-1 * this.DOne);

    // Premium calculation
    if (this.OptionType === 'Call') {
      // //console.log((this.OrderDirection === 'Sell' ? this.SpotBid : this.SpotAsk) * Math.exp(-1 * this.IntRateForPer * (this.Days / 360)) * this.NDOne - Number(this.Strike) * Math.exp(-1 * this.IntRateDOMPer * (this.Days / 360)) * this.NDTwo);
      this.CallPremium =
        (this.OrderDirection === 'Sell' ? this.SpotBid : this.SpotAsk) *
        Math.exp(-1 * this.IntRateForPer * (this.Days / 360)) *
        this.NDOne -
        Number(this.Strike) *
        Math.exp(-1 * this.IntRateDOMPer * (this.Days / 360)) *
        this.NDTwo;
      return this.CallPremium;
    } else {
      // //console.log( Number(this.Strike) * Math.exp(-1 * this.IntRateDOMPer * (this.Days / 360)) * this.NNDTwo - (this.OrderDirection === 'Sell' ? this.SpotBid : this.SpotAsk) * Math.exp(-1 * this.IntRateForPer * (this.Days / 360)) * this.NNDOne);
      this.PutPremium =
        Number(this.Strike) *
        Math.exp(-1 * this.IntRateDOMPer * (this.Days / 360)) *
        this.NNDTwo -
        (this.OrderDirection === 'Sell' ? this.SpotBid : this.SpotAsk) *
        Math.exp(-1 * this.IntRateForPer * (this.Days / 360)) *
        this.NNDOne;
      return this.PutPremium;
    }
  }

  // Function written because service is not available for noraml distribution calculation
  NORMDIST(value: number) {
    // eslint-disable-next-line one-var
    let x, z, t, ans, returnvalue;
    this.mean = 0;
    this.Sigma = 1;
    this.Cummulative = 1;
    x = (value - this.mean) / this.Sigma;
    if (this.Cummulative === 1) {
      z = Math.abs(x) / Math.sqrt(2.0);
      t = 1.0 / (1.0 + z * 0.5);
      ans =
        (t *
          Math.exp(
            -z * z -
            1.26551223 +
            t *
            (1.00002368 +
              t *
              (0.37409196 +
                t *
                (0.09678418 +
                  t *
                  (-0.18628806 +
                    t *
                    (0.27886807 +
                      t *
                      (-1.13520398 +
                        t *
                        (1.48851587 +
                          t *
                          (-0.82215223 +
                            t * 0.17087277))))))))
          )) /
        2.0;
      if (x <= 0) {
        returnvalue = ans;
      } else {
        returnvalue = 1 - ans;
      }
    } else {
      returnvalue =
        Math.exp((-x * x) / 2.0) / Math.sqrt(2.0 * 3.14159265358979);
    }
    return returnvalue;
  }

  TargetValueLimitor(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }
  }

  StrikeChanged(e) {
    this.ResetAllFields();
    const target = this.FXD_cfs.GetEventTarget(e);
   
    this.Strike = Number(target.value).toFixed(this.StrikeRatePointShift);
    if (this.OrderDirection === 'Buy') {
      if (this.OptionType === 'Call') {
        this.GeneratePipes(this.Strike, this.SpotAsk);
      } else {
        this.GeneratePipes(this.Strike, this.SpotBid);
      }
    } else {
      if (this.OptionType === 'Call') {
        this.GeneratePipes(this.Strike, this.SpotBid);
      } else {
        this.GeneratePipes(this.Strike, this.SpotAsk);
      }
    }
  }

  fnDisablePrembtn(e) {
    this.disabledPrembtn = e;
    // this.ResetAllFields();
  }

  fnDisableLoader(e){
    console.log('Global Loader flag',e,'OrderPlaced',this.OrderPlaced )
    // this.OrderClicked = e
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
        // this.ServiceResponse = [{ bestPriceProvider: this.SelectedLPForPricing }];
        // SelectedIBType
        break;
    }
    this.ResetAllFields();
  }


  //modified by Urmila A, 3-Jan-24 | code sync with 5star | start
  fnIsMetalInCcy(isCalledFromBestPrice: boolean) { 
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
          
          if (element.lcY_Type.toUpperCase() === 'METAL') {// Check if the Alt ccy is metal or not
            this.DisableCCYChangeControl = true;
            this.isMetal = 'Y'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.IBPremCCY = this.AltCcy;
            this.NotionalCCY = this.DepCcy;
            // this.NotionalDecimalPointShift = 0;
          } else if(element.rcY_Type.toUpperCase() === 'METAL'){
             // Check if the Alt ccy is metal or not
             this.DisableCCYChangeControl = true;         
             this.IBPremCCY = this.DepCcy;
             this.NotionalCCY = this.DepCcy;
            //  this.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
           } else {
            this.isMetal = 'N'; //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
            this.DisableCCYChangeControl = false;
            // this.NotionalDecimalPointShift = Number(element.asset1_DecimalRate);
          }

          //Added by Urmila A | 8-Mar-23 | LGTGTWINT-1687 
          if (element.rcY_Type === 'NDF') {
            this.NDFFlag = 'Y';
          } else {
            this.NDFFlag = 'N';
          }

          this.Asset1_DecimalAmount = element.asset1_DecimalAmount;
          this.Asset2_DecimalAmount = element.asset2_DecimalAmount;
          this.fnSetNotionalDecimal(); 
        }
        //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | ends
      });

      if(!isCalledFromBestPrice){ // Added condition check by Lalit G || 22-May-24 || HSBCFXEINT-114
        if (this.Pair_Cross_YN === 'Y') {
          this.FindLeftUSDMidRate(this.Left_USD_Pair);
          this.FindRightUSDMidRate(this.Right_USD_Pair);
        }
      }

    } catch (ex) {

    }
  }
   //modified by Urmila A, 3-Jan-24 | code sync with 5star | ends


  fnChangeNotionalCCY() {
    try {
      this.CurrencyPairList.forEach(element => {
        //response mappings modified by Urmila A | HSBCFXEINT-3 | 6-Nov-23 | start
        if (element.asset_Pair === this.CurrencyPair) {
          if (this.NotionalCCY === element.asset1) {
            this.NotionalDecimalPointShift = element.asset1_DecimalAmount;
          } else if (this.NotionalCCY === element.asset2) {
            this.NotionalDecimalPointShift = element.asset2_DecimalAmount;
          }
          this.Notional = this.FXD_cfs.NotionalChangewithDecimalFixes(this.Notional, this.NotionalDecimalPointShift);
        }
      });
    } catch (Ex) {

    }
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
        //Mappings modified by UrmilaA | code sync with 5Star
        this.PointShift = res.PointShift //Urmila A |27-feb-23 |LGTGTWINT-1526    
        this.fnUpdatePointShifts(this.PointShift);  
        this.Strike = this.FXD_cfs.numberWithCommas(Number(data.Strike_Rate).toFixed(this.PointShift));       
        
        //addde by UrmilaA | as discussed with AishwaryaH | 11-Dec-23
        if(data.RFQ_Deal_Dir === "S"){
          this.SpotAsk = Number(data.Ask_Rate.replaceAll(',','')).toFixed(this.PointShift);
          this.SpotBid = Number(data.Spot_Rate.replaceAll(',','')).toFixed(this.PointShift);        
        }else{
          this.SpotAsk = Number(data.Spot_Rate.replaceAll(',','')).toFixed(this.PointShift);
          this.SpotBid = Number(data.Bid_Rate.replaceAll(',','')).toFixed(this.PointShift);
        }

        this.SpotMidRate = ((Number(this.SpotAsk) + Number(this.SpotBid)) / 2 ).toFixed(this.PointShift); 

      }
    });
  }
  //end

  fnSetIBPrem(InputValue: any) {
    if (this.secondCCY === this.IBPremCCY) {
      this.IBPrem = (parseFloat(InputValue.toString()).toFixed(this.Asset2_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      this.IBPrem = (parseFloat(InputValue.toString()).toFixed(this.Asset1_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  // fnSetClientPrem(InputValue: any) {
  //   if (this.secondCCY === this.IBPremCCY) {
  //     this.ClientPrem = Number(parseFloat(InputValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')).toFixed(this.Asset2_DecimalAmount));
  //   } else {
  //     this.IBPrem = Number(parseFloat(InputValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')).toFixed(this.Asset1_DecimalAmount));
  //   }
  // }

  fnSelectedBuySellBtn(IsBuyOrSellSelected: boolean) {
    IsBuyOrSellSelected ? this.OrderDirection = 'Sell' : this.OrderDirection = 'Buy';
    this.OrderDirectionChanged();
    this.ResetAllFields();
    this.GetStrikeRate();
  }

  fnSelectedCallPutBtn(IsBuyOrSellSelected: boolean) {
    IsBuyOrSellSelected ? this.OptionType = 'Put' : this.OptionType = 'Call';
    this.ResetAllFields();
    this.GetStrikeRate();
  }

  fnSelectedNotionalCcyBtn(IsNotionalCcySelected: boolean) {
    IsNotionalCcySelected ? this.NotionalCCY = this.secondCCY : this.NotionalCCY = this.firstCCY;
    console.log(this.NotionalCCY);
    this.fnChangeNotionalCCY();
    this.ResetAllFields();
  }

  fnSelectedIBPremCcyBtn(IsIBPremCcySelected: boolean) {
    IsIBPremCcySelected ? this.IBPremCCY = this.secondCCY : this.IBPremCCY = this.firstCCY;
    console.log(this.IBPremCCY);
    this.ResetAllFields();
  }
  
  public FilterCcy() {
    this.CurrencyPairList.filter(item => item.asset_Pair === this.CurrencyPair);
    console.log(this.CurrencyPairList);
  }

  //modified by Urmila A, 14-april-23
  public SelectedCCy(e) {
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

  fnGetNoOfSettFromFixingDate() {
    this.FXD_afs.fnGetNoOfSettFromFixingDate(this.firstCCY, this.secondCCY, this.CurrencyPair, this.TradeDate, this.FXD_afs.EntityID, this.Tenor, 'Monthly', 'Monthly', this.Product_ID, this.Product_Code, this.FixingDate, 'FXOSEN', this.OptionCut, this.FXD_afs.UserName).subscribe(res => {
      if (res) {
        console.log(res);
        res = res.CalculateDatesResult.Dates;
        // this.PremiumDate = res[0].ValueDate;
        this.FixingDate = res[0].FixingDate;
        this.MaturityDate = res[0].MaturityDate;
        this.Days = res[0].ExpiryDays;
      }
    })
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

        this.PremiumDate = JSON.parse(res.valueDate).m_Date;
        
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

  // Start : HSBCFXEINT-82: Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024
  calculateDays(fixindate, premiumdate){
    let date = new Date(premiumdate);
    let currentDate = new Date(fixindate);

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    this.TenorDays = days.toString();
    this.Tenor = days + "D".toString();
  }
  // ENd : HSBCFXEINT-82 : Calender icon shows todays date and not selected one | Chaitanya M | 20-April-2024

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


  fnCustomerSelection(e){
    this.CustomerID = e.CustomerID;
    console.log(this.CustomerID);
  }

  fnSetBidRate(BidRate){
    this.SpotBid = BidRate;
  }


  selectedCustomerValue1(e) {
    console.log(e);
    // this.CustomerName = e.CustomerName.split('|')[0];
    this.CustomerID = e.CustomerID;
    this.CustomerName = e.CustomerName;

  }

  fnOrderplacepopup(orderPlacementPopupClose){
    this.Orderplace = orderPlacementPopupClose;
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
      // if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_FinIQ_BidAsk_WrapperResult)) {
        if(res !== null) {
          this.AllDataLoaded.bidask = true;
          // this.LeftUSDMidrate = res?.MidRate;               
          
          this.LeftUSDMidrate = ((Number((parseFloat(res.BidRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
                                  + Number((parseFloat(res.AskRate).toFixed(Number(this.PointShift))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))) / 2 ).toFixed(this.PointShift); 

          console.log('left USD Midrate:', this.LeftUSDMidrate);
          if(!this.RouteFromWorkflow){ //Added by Urmila A | 11-Jan-23
            this.GetStrikeRate();
          }
        
      }
    });
  }

  FindRightUSDMidRate(RightCCY){
    this.RightUSDMidRate = '';
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB(     //API req params modified by Urmila A | 21-Aug-23 | Core migration
      this.Product_Code,
      RightCCY,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      // if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_FinIQ_BidAsk_WrapperResult)) {
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
  ////HSBCFXEINT-11 | ChaitanyaM | 24-May-2024
  //-------------------start------------------
  fnFindUpfrontUSD(){
    try{
      if(this.IBPremToggle || this.NotionalToggle){
        if(this.UpfrontAlt !== ''){ //added by Urmila A | 11-Jan-23 | | LGTCLI-244
          if( this.Notional !== undefined || this.Notional !== '')  {
            if(this.IBPremCCY === this.DepCcy && this.NotionalCCY === this.AltCcy){
              this.UpfrontVal = (parseInt(this.Notional.replaceAll(/,/g, ''), 10) / parseFloat(this.Strike.replaceAll(',',''))) * (parseFloat(this.upfront.replaceAll(/,/g, '')) / 100);  //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
            }else if(this.IBPremCCY !== this.NotionalCCY){
              this.UpfrontVal = parseInt(this.Notional.replaceAll(/,/g, ''),10) * parseFloat(this.Strike.replaceAll(',','')) * (parseFloat(this.upfront.replaceAll(/,/g, '')) / 100);  //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
            }else{
              this.UpfrontVal = (parseInt(this.Notional.replaceAll(/,/g, ''), 10) * parseFloat(this.upfront.replaceAll(/,/g, ''))) / 100;
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
          this.UpfrontVal =  (Number(this.Notional.replaceAll(',','')) / Number(this.Strike.replaceAll(',','')) ) * (Number(this.upfront.replaceAll(/,/g, '')) / 100)  //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }else if(this.IBPremCCY !== this.NotionalCCY){
            this.UpfrontVal = (Number(this.Notional.replaceAll(',','')) * Number(this.Strike.replaceAll(',','')) * (Number(this.upfront.replaceAll(/,/g, '')) /100)) //formatter added by Urmila A |  F5SAAINT-576 | 27-Nov-23
        }else{
            this.UpfrontVal = (Number(this.Notional.replaceAll(',','')) * Number(this.upfront.replaceAll(/,/g, '')) ) / 100;
        }

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
      

      // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
      if(this.PreminPipsToggle === "Pips"){

        let _Pipsmultipler = this.FXD_cfs.multiplyByMultiplier(10, Number(this.PointShift));

        if(this.IBPremCCY !== this.NotionalCCY){
    
          this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * (Number(this.Notional.replaceAll(',','')))) / _Pipsmultipler ;  
    
        }else{
    
          if(this.NotionalCCY === this.DepCcy){
    
            this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * ( Number(this.Notional.replaceAll(',','')) * Number(this.Strike.replaceAll(',','')))) / _Pipsmultipler ;  
            
          }else{
    
            this.UpfrontVal = ( this.upfront.replaceAll(/,/g, '') * ( Number(this.Notional.replaceAll(',','')) / Number(this.Strike.replaceAll(',','')))) / _Pipsmultipler ;  
          
          }
          
        }

        this.UpfrontVal = this.FXD_cfs.numberWithCommas(Number(this.UpfrontVal).toFixed(2));
      
      }
      // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

      this.UpfrontAlt = this.UpfrontAlt.replaceAll('-','');
      this.UpfrontVal =  this.UpfrontVal.replaceAll(',',''); //Urmila A | 1-Feb-23 |LGTCLI-287
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
      
      console.log('Upfront USD:',this.UpfrontAlt)
    
    } catch (error) { 
      console.log(error.message);
    }
  }
  //----------------------ENd-------------
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
  
  //Urmila A | 20-Mar-23
  CancelPricing(){
    if(this.Bestpricesubscription){
      this.Bestpricesubscription.unsubscribe();
    }
    this.priceLoader=false;
  }


  //Added by Urmila A | 14-mar-23
  NotificationFunction(type , header, reason){
    this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
      NotificationType: type , //'Error',
      header: header , // 'Error',
      body: reason,
      DateandTime: ''
    });
  }

 //Added by Urmila A, 14-April-23, start
  closeOrderPopup() {
    // this.OrderClicked=false; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlaced = true; //Modified by Urmila A | 12-Jan-23 | LGTGTWINT-1019
    this.OrderPlacedPopup = false;
    // this.OrderPlaceFlag = false;
    // this.ResetAllFields() //commented by Urmila A | 26-Dec-22 | LGTGTWINT-591
  }

  EmailQuote(){
    this.QuteMailClicked = true;
    this.QuoteMailSent = false;
    this.closeQuoteMail = false;
    this.FXDSendQuoteMailSubscriber = this.FXD_afs.fnSendQuoteEmail(this.FXD_afs.EntityID.toString(), this.FXD_afs.UserName,this.NoteMasterID.toString(), this.Product_ID,this.DCDRfqId)
    .subscribe((res)=>{
      try{       
            if (res) {
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


  closeEmailQuote() {
    this.QuoteMailSent = false;
    this.closeQuoteMail=true; 
    this.OrderPlaced =true 
  }

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

 //Added by Urmila A, 14-April-23, end

 ResetPricer(){
  this.PriceClick=false; // LGTGTWINT-2109 | UrmilaA
  this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
  this.ClearLPs = true; //UrmilaA |LGTCLI-361 | 18-May-23  
  this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361
  this.RMRemarkVisibility=false; //LGTGTWINT-1599, Urmila A | 3-Mar-23
  this.ResetPricerFlag=true;  //Urmila A | LGTGTWINT-1209 | 27-Jan-23
  this.RouteFromWorkflow = false;
  this.NewOrderfromRMUnlocked=false; //Urmila A, as reject button was enable after resetpricer
  this.OrderPlaced=false;  //Added by Urmila A | 12-Jan-23 | LGTGTWINT-987
  this.scheduleBtnClick=false //Urmila A | 28-Jan-23;
  this.IsNavigate=false; //Urmila A | 17-feb-23
  this.RouteFromQuoteHistory=false; //Urmila A, 30-mar-23

  if(this.BestPrice){ //added by UrmilaA, 18-May-23 | LGTGTWINT-1147
    this.closeSignalR()   
  }

  this.fnUnsubscribeAllCalls()
  this.ResetAllFields();
  this.fnSetAfterPriceValues(); // HSBCFXEINT-41 | Chaitanya M | 24-Jan-2024
  // this.fngetPersonalDefaultValues();
 
  this.fnDefaultValues()   
  this.fnButtonVisibility();   //Added by Urmila A | LGTGTWINT-1455 | 28-feb-23
 
   //Added by Urmila A | 17-Mar-23 |LGTGTWINT-1737
  this.fnGetPriceProviderandCcypairs();    
  this.fnGetFXDCurrencyPairs(); 
  this.fnGetContractSummary();

 }

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
  //added by UrmilaA, LGTCLI-361 | signalR subscribers seperated out | 18-May-23 | ends

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

  // Added by Urmila A | Route to dealer functionality | 1-Dec-22 | start
  fnRouteDealerClick() {
    if (this.DealerRemark === '') {
      this.Errormsg = 'Please enter remark'
      this.NotificationFunction("Error", "Error", this.Errormsg)
    } else if (this.DealerRemark !== '') {
      this.Errormsg = '';
      this.routeToDealerClicked = true;
      this.FXD_cfs.fxdpopupOpenClose=true;      
      this.confirmedRouteDealer = false;
      this.SaveTradeEnabledFlag = false //Added  Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P. | disabled save trade idea on Route to dealer//commented by UrmilaA | 16-June-23 |LGTGTWINT-2137
    }
  }
  
 
  fnConfirmRouteToDealer(){
    this.FXD_cfs.loadFlag=true
    this.FXDRouteToDealerSubscriber = this.FXD_afs.FXDSaveRouteToDealerAPI(
      this.FXD_afs.EntityID,
      this.FXD_afs.UserName,
      this.Product_Code,
      this.DCDRfqId,
      this.NoteMasterID,
      this.CustPAN,
      this.DealerRemark,
      this.ExceptionWarningMsg
    ).subscribe((res:any)=>{
       try{
          res= res.result;
          if (res) {
          if(res === true) {
            if(res === true){
              this.FXD_cfs.loadFlag=false               
              this.FXD_cfs.RouteToDealerExecuted=true;
              this.FXD_cfs.fxdpopupOpenClose=true;
              this.confirmedRouteDealer=true
              console.log('Route to dealer res:',res)
            }
          } else {             
            this.NotificationFunction("Error","Error" , "Route to dealer failed." ) //Added changes by Mayuri D. on 15-Dec-2022 | LGTGTWINT - 572
          }                            
        }
        }catch(err) {
          console.log(err.message);
        }
      })
}



  fnSaveTrade() {
    // this.SaveTradeLoader = true
    this.FXD_cfs.loadFlag=true;
    this.disabledRoutetodealeronSaveTrade = true 
    this.FXD_afs.SetOrderbtnonSaveTrade(true)
    this.fngetSavetradeRecommendation()
  }
 
  
 
  fngetSavetradeRecommendation(){
    // this.Mode = this.FXD_cfs.fngetMode(); //Urmila A | 15-Feb-23 | LGTGTWINT-1403 
       //API req body params modified by Urmila A | 21-Aug-23 | Core migration
     this.saveTradeSubscriber = this.FXD_afs.getSavetradeRecommendation(this.FXD_afs.UserName,this.NoteMasterID,this.DCDRfqId,
      this.FXD_cfs.fngetMode(),this.DealerRemark) 
     .subscribe((res:any)=>{
         try{
            //  if(res.SaveTradeRecommendationResult.A_ResponseHeader.Status === "Success" && this.FXD_cfs.fnCheckSessionValidity(res.SaveTradeRecommendationResult)){ //Urmila A | 11-Mar-23
            res=res.result;
            if (res) {  
            this.FXD_cfs.saveTradeDone=true;
              this.MinMaxTimer=0;
              clearInterval(this.MinInterval)
              clearInterval(this.maxInterval)
              this.FXD_cfs.fxdpopupOpenClose=true;
              this.FXD_cfs.loadFlag=false;
              // this.SavetradePopup = true
              //  this.SaveTradeLoader = false
               // this.SaveTradeEnabledFlag = false//commented by UrmilaA | 16-June-23 |LGTGTWINT-2137
              //  console.log('SaveTradeRecommendationResult  =>',res  )
             }
             else
             {
               //  this.SaveTradeLoader = false 
               this.FXD_cfs.loadFlag=false;
               this.NotificationFunction("Error","Error" , "Save Trade Idea Failed.")
             }
         }catch(ex){ }
     })
 }
 
 /* Modified by Urmila A | 8-Dec-22 | start  */
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

  
  let spotrate;
  if(this.OrderDirection == 'Buy'){
    spotrate=this.SpotAsk;
  }else{
    spotrate=this.SpotBid;
  }
  
  if(!this.BestPrice){
    //<CustID>" +this.HomeAPI.CustomerId +   "</CustID><Customer_Name>"+ this.HomeAPI.CustomerName +"</Customer_Name>
    XML = this.ScheduleXML =
    "<ExcelSheets><Sheet1><Product_Name>" + this.Product_Name + "</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><Spotrate>"+spotrate+
    "</Spotrate><Notional>"+ this.Notional.replace(/,/g, '')+"</Notional><NonDeliveryYN>"+this.NDFFlag+"</NonDeliveryYN><OptionCut>"+this.OptionCut +
    "</OptionCut><OptionType>"+this.OptionType+"</OptionType><CcyPair>"+this.CurrencyPair +
    "</CcyPair><AltCcy>"+this.AltCcy+"</AltCcy><InvCcy>"+this.NotionalCCY+"</InvCcy><PremiumCcy>"+this.IBPremCCY +
    "</PremiumCcy><PremiumDate>"+this.PremiumDate+"</PremiumDate><BuySell>"+this.OrderDirection+
    "</BuySell><FixingDate>"+this.FixingDate+"</FixingDate><TradeDate>"+this.TradeDate+"</TradeDate><SettDate>"+this.MaturityDate +
    "</SettDate><Tenor>"+this.Tenor+"</Tenor><TenorDays>"+this.TenorDays+"</TenorDays><Strike>"+this.Strike.replaceAll(',','')+
    "</Strike><Entity_ID>"+this.FXD_afs.EntityID +
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
/*Modified by Urmila A | 8-Dec-22 | end  */


  //Modified by UrmilaA | 3-Jan-24 | code sync with 5Star | start
  fnIBPremCCYToggle() {
    this.IBPremToggle = true
    this.ccy2 = true;
    if (this.ccy2 === true && this.IBPremCCY !== this.AltCcy) {
      this.IBPremCCY = this.AltCcy;
      this.ccy1 = true;
    } else if (this.ccy1 === true) {
      this.IBPremCCY = this.DepCcy;
    }

    this.fnChangePremCCY() 
    if (Number(this.upfront.replaceAll(',','')) !== 0) {
      this.fnFindUpfrontUSD()
    }
    
    this.fnGetContractSummary();
  
  }
  //Modified by UrmilaA | 3-Jan-24 | code sync with 5Star | ends


  // modified by Urmila A | 9-Jan-24  | Reject route to dealer | F5SAAINT-1176  |start
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
  // Added by Urmila A | 9-Jan-24 | Reject route to dealer |end


  //Added by UrmilaA | 3-Jan-24 | start | Code sync with 5Star
  fnChangePremCCY(){
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
  
    } catch (Ex) {
      console.log(Ex.message);
     }
  }
  //Added by UrmilaA |  3-Jan-24 | ends | Code sync with 5Star


  //Added by UrmilaA | 3-Jan-24 | start | Code sync with 5Star
  fnSetNotionalDecimal(){
    console.log('notionals',this.Notional)
    let pointshift = this.NotionalCCY == this.DepCcy ? this.Asset1_DecimalAmount : this.Asset2_DecimalAmount;
    this.Notional = this.FXD_cfs.numberWithCommas(Number(this.Notional.toString().replaceAll(',','')).toFixed(pointshift))
  }
  //Added by UrmilaA | 3-Jan-24 | ends | Code sync with 5Star

  fnUpdatePointShifts(pointshift){  //Added by UrmilaA | 3-Jan-24 | start | Code sync with 5Star
    this.Strike = this.FXD_cfs.numberWithCommas(Number(this.Strike.replaceAll(/,/g, '')).toFixed(pointshift));
  }

  // Added by UrmilaA | 10-Jan-24 | code sync with 5star | start
  fnChngNotional(e){  //Added by urmilaA | F5SAAINT-587 | 29-Nov-23
    this.Notional = Number(e.target.value).toFixed(this.NotionalDecimalPointShift)
   
    if(Number(this.upfront) !== 0 ){
      this.fnFindUpfrontUSD() //urmilaA | F5SAAINT-871 | 5-Dec-23
    }  
  }
  // Added by UrmilaA | 10-Jan-24 | code sync with 5star | ends


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
  // HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

}
