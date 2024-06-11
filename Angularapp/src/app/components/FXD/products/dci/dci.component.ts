import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';

@Component({
  selector: 'app-dci',
  templateUrl: './dci.component.html',
  styleUrls: ['./dci.component.scss', '../../fxddashboard/fxddashboard.component.scss'], // Added by UrmilaA |  6-Nov-23
})
export class DciComponent implements OnInit, OnDestroy {
  @Input() Product_ID: number;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  //@Input() AppMode: string; // Added by Chaitanya M | 18 July 2023
  @Input() ViewMode: string;
  @Input() InputData: any;
  @Input() EntityData:any; //UrmilaA, LGTGTWINT-1898 | 24-April-23

  @Input() Template_Name:any;  
  @Input() TemplateCode:any;  
  @Input() TemplateID:any; 
  @Input() AllProdData:any; 
  TenorOptions: any=[];
  d: Date;

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    // console.log(event);
    switch (event.key || event.code) {
      case 'F7':
        console.log(event);
        // this.ResetAllFields();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'F8':
        console.log(event);
        // this.FXBestPrice();
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
// Added by Chaitanya M | 18 July 2023
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
//End
  Tenor: any;
  TenorType: any;
  Notional: any;
  AltNotional: any;
  SpotRate: any;
  StrikePoints: any;
  StrikeRate: any;
  Spread: any;
  ValueDate: any='';
  FixingDate: any='';
  MaturityDate: any='';
  InvestmentCurr: any;
  AlternateCurr: any;
  CcyList = [];
  NoofDays: string;
  TradeDate = '';
  PremiumDate: any='';
  TenorDays: any;
  Loading = false;
  randomfun1: string;
  validationmsg: string;
  BestPrice: number;
  BestPriceProvider: string;
  ClientYield: string;
  PIInvestCCY: string;
  PIAltCCY: string;
  ActualOrStimulated: string;
  ccySubscription: Subscription;
  datesSubscription: Subscription;
  pricingSubscription: Subscription;
  spotrateSubscription: Subscription;
  DecimalRate: number;
  // Added by Chaitanya M | 18 July 2023
  PremiumPer: number;
  VolPer: number;
  IR1: number;
  IR2: number;
  //End
  solveForValue = 'Yield';
  DCDRfqId: string;
  ClientPrem: number;
  ExternalRfqId: string;
  user: string;
  successMsg: string;
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
  orderTime: any;
  goodPairYN = 'Y';

  OrderPlaceFlag: boolean = false;
  disabledPrembtn: boolean = false;
  ServiceResponse: any;
  loadflag: boolean = false;
  ClearPricingFlag: boolean = false;
  CustomerID: string;
  Orderplace: string;
  Errormsg: string;
  d1 = new Date();
  DealNo: string;
  SampleArray = [];
  PriceProviderString: string;
  FXPriceProvidersubscription: Subscription;
  ProductName: string;
  ProductID: string;

  XMLString: string;
  UserID: string;
  PricingModels = [
    'Black Scholes',
    'Vanna Volga',
    'Dupire Local Vol',
    'Heston',
  ];
  SeletcedPricingModel: string;
  ResponseArray = [];
  NoteMasterID: string;
  IBPremComment: any;
  ClientPremComment: string;
  SelectedPricingMode: string = 'Auto';
  SelectedLPForPricing: string = 'Best';
  PricingModes = ['Auto', 'Manual'];
  SelectedIBType: string = 'IBPays';
  SelectedClientType: string = 'ClientPays';
  CCYOptions = [];
  AltCCYOptions = [];
  NotionalDecimalPointShift: number = 2;
  StrikeDecimalPointShift: number = 4;
  Asset2StrikeDecimalPointShift: number = 4;

  //Adde by UrmilaA | 17-July-23 | start
  isQENMode:any;
  isSENMode:any;
  IsNavigate: boolean=false; 
  AllDataLoaded = { 
    productDetail:false,
    productinfo: true,
    ccypairs: false,
    optioncut: false,
    tenor: true, 
    priceprovider: false,
    bidask: false,
    datecalculation: false,  
  };
  NotionalToggle: boolean=false; 
  Remark: string;
  IsRMLoggedIn: boolean = false;
  IsRouteToDealerExecuted: boolean = false;
  OriginalIBPrem: any=0;
  DealingRFQID: string = '';
  RMRemark: string = '';
  ContractSummary: any = '';
  QueueStatus: string = '';
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
  DealerRemarkVisibility:boolean=false; 
  NDFFlag: string='N';
  isMetal: string='N';
  SaveTradeEnabledFlag : boolean = false
  selectedProduct: any;
  RFQNODisplayFromParent: boolean=false;
  screenHeight: number;
  screenWidth: number;
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
  OptionCut: string = ''; // Added by Chaitanya M | 18 July 2023
  CurrencyChanged:boolean=false; // Added by Chaitanya M | 18 July 2023
  CcySearch: any = ''; 
  CurrencyPairList: any[]=[];
  RouteFromQuoteHistory: boolean;
  noResponseRecv: boolean=false;
  PriceproviderArr: any[]=[];
  RouteFromWorkflow:boolean=false;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;
  CurrencyPair: string='';
  DepCcy: string;
  AltCcy: string;
  NotionalCCY: string;
  IBPremCCY: string;
  PointShift:any; 
  SpotBid: string = '';
  SpotAsk: string = '';
  PipsMultiplier: number = 0;
  OptionCutOptions = [];
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
  isSpreadVisible:boolean=false;
  isEmailQuoteVisible:boolean=false;
  isSchedulevisible:boolean=false;
  isResetvisible:boolean=false;
  isRoutetoDealerVisible:boolean=false;
  isSaveTradevisible:boolean=false;
  isOrderBtnVisible:boolean=false;
  isRejectVisible:boolean=false;
  CommomDataSubscriber:Subscription;
  AllAPIsLoaded:boolean=false


  //RFS | Urmila A, 18-May-23, LGTCLI-361 | start
  BroadCastData: any[]=[];
  @Input() ShowRFS:any; //UrmilaA, LGTCLI-361 | 22-May-23
  MaxQuoteTimeout:any;
  MinQuoteTimeout:any;
  MinQuoteTimeOutOccurred:boolean=false;
  SignalRsubscriber:Subscription;
  fxdProdCofigSubsriber: any; 
  FXDConfigSubscriber:Subscription; 
  FXDOptionCutSubscriber: any;
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
  LPname:any;
  saveTradeSubscriber:Subscription;

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

  private FXRatesubscription: Subscription;
  private TenorDayssubscription: Subscription;
  private FXBidAsksubscription: Subscription;
  private FXDatesCalculationsubscription: Subscription;
  private Bestpricesubscription: Subscription;
  private BookOrdersubscription: Subscription;
  prodDetailSubscriber:Subscription;
//Added by UrmilaA | 17-July-23 | ends

  constructor(
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public HomeAPI: HomeApiService,
    public CustAPI: CustomerApiService,
  ) {
    this.ProductName = '';
    this.ProductID = '';
    this.TemplateCode = 'PCI';
    this.CustomerID = '';
    this.InvestmentCurr = 'EUR';
    this.AlternateCurr = 'USD';
    this.SpotRate = 0.0;
    this.Notional = '1,000,000.00';
    this.StrikeRate = 0.0;
    this.StrikePoints = 100;
    this.Spread = '1.00';
    this.OptionCut = ''; // Added by Chaitanya M | 18 July 2023
    this.Tenor = 2;
    this.TenorType = 'M';
    // this.CcyList = this.CurrencyList;
    this.PIInvestCCY = '';
    this.PIAltCCY = '';
    this.ClientYield = '';
    this.PriceProviderString = '';
    this.SeletcedPricingModel = 'Black Scholes';
    this.NoteMasterID = '';
    // console.log(this.CcyList);
  }
  ngOnDestroy() {
    if (this.ccySubscription) this.ccySubscription.unsubscribe();
    if (this.spotrateSubscription) this.spotrateSubscription.unsubscribe();
    if (this.pricingSubscription) this.pricingSubscription.unsubscribe();
    if (this.datesSubscription) this.datesSubscription.unsubscribe();
    if (this.FXPriceProvidersubscription) this.FXPriceProvidersubscription.unsubscribe();
    
  }
  ngOnInit(): void {
    this.fnSetEntity() 
    //added by UrmilaA | LGTGTWINT-2137 (Usertype checks replaced with Mode)| 16-june-23 |start
    if(this.FXD_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
    }else if(this.FXD_cfs.fngetMode() == 'SEN'){
      this.isSENMode=true;
    }
    //added by UrmilaA | LGTGTWINT-2137 | 16-june-23 |ends


    //Urmila A | 20-feb-23 | LGTGTWINT-1444 |start 
    if(!this.IsNavigate){
      // this.getEntityData(); //commented by UrmilaA, 24-April-23 | LGTGTWINT-1898
      console.log('in AQDQ details from parent:', this.Product_ID,this.Product_Code,
      this.Product_Name, this.Template_Name, this.TemplateCode,'prod data',this.AllProdData)
      this.fnDefaultValues();
      this.fnButtonVisibility()
      if(this.FXD_cfs.fnCheckIncomingProdData(this.Product_ID,this.Product_Code,
        this.Product_Name, this.Template_Name, this.TemplateCode, this.TemplateID) === true){
        this.AllDataLoaded.productDetail = true;
        this.fnGetProductConfig(); //Added by UrmilaA, 18-May-23, fnGetProductConfig | LGTCLI-361 
        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){ 
          this.AllAPIsLoaded=true;         
        }      
        this.fnGetPriceProviderandCcypairs();  
        this.fnGetFXDCurrencyPairs();
        this.fnGetTenor() 
      }else{
        this.fnGetProductDetails(); 
      } 
      // this.fnButtonVisibility();
    }
    //Urmila A | 20-feb-23 | end
  
  }
// Added by Chaitanya M | 18 July 2023
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

  fnSetEntity(){
    console.log('coming entity data:', this.EntityData)
    sessionStorage.setItem('FXD_EntityID', this.EntityData[0].Code)
    this.FXD_afs.SetCredentials() 

    //chnges added by UrmilaA, 17-April-23 | for now hardcode customer values added as discussion with SandhyaR, RahulP | start
    if(this.EntityData[0].Code === '50'){
      this.CustomerID = this.HomeAPI.CustomerId = '50';
      this.HomeAPI.CustomerName = 'CustomerPB';             
    }//end

  }

  fnDefaultValues(){

    // this.IBPrem = '';
    // this.ClientPrem = '';
    // this.upfront = (0).toFixed(4);
    // this.UpfrontVal='0.00';
    // this.UpfrontAlt='0.00';
    this.Notional = '100,000.00';
    this.PriceProviderString = '';
    // this.OrderPlaceFlag = false;
    this.ServiceResponse = null;
    this.OptionCut = '';
    // this.custPremDirection='';
    // this.IBPremDirection='';
   
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
    // this.ccy1 = false;
    // this.ccy2 = false;
    // this.ClearLPs = false;
    // this.DIfromTradeIdea = '';
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
    this.TradeDate =
      Daystring +
      '-' +
      this.months[this.d.getMonth()] +
      '-' +
      this.d.getFullYear();
   
  
    this.Tenor = '6M';
    this.TenorDays = 183; 
    this.Errormsg = '';  
    this.SeletcedPricingModel = 'Black Scholes';
   
  }

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
     
  }

  ResetAllFields() {
 
    this.PriceClick=false;
   // this.fnResetpricingFlags() //Added by Urmila A LGTCLI-361 || 30 May 2023 - case: after redirect buttons not enabling
    this.ClearLPs=true; //added by UrmilaA, 10-May-23 | LGTCLI-361
    this.ResetAllfieldsCalled=true; //Urmila A | LGTGTWINT-1332 | 6-feb-23
    if(this.BestPrice){ //Urmila A | 1-Feb-23 | LGTGTWINT-1209
      
      //this.closeSignalR()   //added by UrmilaA, 10-May-23 | LGTCLI-361
      this.NoteMasterID=''; 
      
    }
    // this.fnSetAfterPriceValues(); //Added by UrmilaA | 13-June-23 | LGTGTWINT-2079
    // this.resetSignalRPrice() //added by UrmilaA, LGTCLI-361 
    this.BestPrice = null;
    this.BestPriceProvider = null;
    this.ExternalRfqId = null;
    // this.BestPriceabs = null;
    this.ServiceResponse = null;
    // this.IBPrem = '0.00'; //commented by Urmila A | LGTGTWINT-972
    // this.PricingMode.toUpperCase() !== 'MANUAL' ? (this.IBPrem = '0.00') : ''; //commented by Urmila A | LGTGTWINT-972 | 30-Jan-23
    // this.ClientPrem = '0.00';
   
    this.Orderplace = '';
    this.loadflag = false;
    //  this.ViewScheduleflag = false;
    this.Errormsg = '';
    this.DealNo = '';
    // this.ScheduleVisibility = false;
    //this.OrderBlotterVisibility = false;
    this.OrderPlaceFlag = false;
    this.ClearPricingFlag = true;
   
    this.orderMsg=''
    this.DealNo=''
    this.Orderplace='';
    this.DCDRfqId='';
    // this.routeToDealerClicked=false;
    // this.confirmedRouteDealer = false;
    this.IsRouteToDealerExecuted =false;
    // if (this.GetPriceProviderDetailsSubscription)
    //   this.GetPriceProviderDetailsSubscription.unsubscribe();
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
    this.FXD_cfs.DealBooked.next(false);
    this.firstFixChngAndDatesReceived =false;
    
  }

  fnGetProductDetails(){ //Modified by Urmila A | 12-April-23
    try {
      this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
       //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
      this.prodDetailSubscriber=this.FXD_afs.fnGetProdDetailsFXD(this.FXD_afs.UserName,this.Product_Code).subscribe((res) => {
        if (res.GetProdDetailsResult.DC_GetProdDetails.length > 0 && this.FXD_cfs.fnCheckSessionValidity(res.GetProdDetailsResult))  {
          this.AllDataLoaded.productDetail = true;
          res = res.GetProdDetailsResult.DC_GetProdDetails[0]
          this.TemplateCode = res.Template_Code;
          this.Product_Name = res.Product_Name;
          this.TemplateID = res.Template_Id;
          this.Product_ID = res.Product_Id;
          this.Product_Code = res.product_code;
          //this.fnGetProductInfo(); //commented by Urmila a | 17-feb-23
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
      throw error;
    }
  }

     //Urmila A | checks button visibility |12-April-23| starts 
     fnbtncheck(ReqConfig, chkRoute): any {
      switch (ReqConfig) {
              case 'TradeIdeaBtnAccess_LoginUserGroup' :
                      this.CommomDataSubscriber = this.CustAPI.getPledgedAgainstData(ReqConfig).subscribe((res) => {
                      if (res) {
                          try{
                              res = res.Get_Configurable_Common_DataResult;
                              res.forEach(element => {
                                if(chkRoute === 'Pricer'){
                                    if(element.Misc1.includes(',')){
                                      if (element.Misc1.split(',').includes(sessionStorage.getItem('FinIQGroupID'))) {
                                        this.isSaveTradevisible = true
                                      }
                                    }else{
                                        if(element.Misc1 === sessionStorage.getItem('FinIQGroupID')){
                                          this.isSaveTradevisible = true
                                        }
                                    }  
                                }else{
                                    if(element.Misc1.includes(',')){
                                      if (element.Misc1.split(',').includes(sessionStorage.getItem('FinIQGroupID'))) {
                                        this.isSaveTradevisible = true
                                      }
                                    }else{
                                          if(element.Misc1 === sessionStorage.getItem('FinIQGroupID')){
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
                    this.CustAPI.getPledgedAgainstData(ReqConfig).subscribe((res) => {
                      if (res) {
                        try{
                            res = res.Get_Configurable_Common_DataResult;
                            res.forEach(element => {                          
                                  if (chkRoute.toUpperCase() === element.DATA_VALUE.toUpperCase() ) {                                                           
                                      if(element.Misc1.split(',').includes(sessionStorage.getItem('FinIQGroupID'))){
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
 //Added by Urmila A, 18-May-23 | LGTCLI-361 | start
 fnGetProductConfig(){
  //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
  this.fxdProdCofigSubsriber = this.FXD_afs.FXDGetProductConfigsAPI(this.FXD_afs.UserName,
  this.Product_ID).subscribe((res:any)=>{
    try{
          if(res && this.FXD_cfs.fnCheckSessionValidity(res.GetProductConfigsResult)){
            console.log('product config res=> ', res)        
              if(res.GetProductConfigsResult.A_ResponseHeader.FailedReason == ''){ //added by UrmilaA | LGTGTWINT-2073 | 1-June-23
                res=res.GetProductConfigsResult.DC_Config.Configs
                res?.forEach(element => {
                      if(element.Setting_Name === 'BestPrice_MaxQuoteTimeOut'){
                       
                        this.MaxQuoteTimeout = element.Value
                        console.log('this.MaxQuoteTimeout',this.MaxQuoteTimeout)
                      }else if(element.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ'){
                        this.MinQuoteTimeout = element.Value
                        console.log('this.MinQuoteTimeout',this.MinQuoteTimeout)
                      } 
                      if(element.Setting_Name === 'OPTDEN_PrincipalBankNameinLPGrid') {
                          this.LPname=element.Value;
                      }   
                });
              }else if((res.GetProductConfigsResult.DC_Config == null) || (res.GetProductConfigsResult.A_ResponseHeader.FailedReason !== '')){ //modified by UrmilaA | LGTGTWINT-2073 | 5-June-23 
                  this.MinQuoteTimeout = '30';
                  this.MaxQuoteTimeout = '90';
              }         
          }
    }catch(err) {console.log(err)}
  })
}
//Added by Urmila A, 18-May-23 | LGTCLI-361 | ends
 

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
    this.UserID,
    this.PricingMode,
   //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
  ).subscribe( (res) => {
    if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetFXDPriceProviderDetailsResult)) {
      this.AllDataLoaded.priceprovider = true;
      this.PriceProviderString='';
      this.SampleArray = this.PriceproviderArr= res.GetFXDPriceProviderDetailsResult.PriceProviderDetails;
       //changes added by Urmila A, 4-may-23, to get Price provider string , made common function
      this.PriceProviderString = this.fngetPriceProviderStr(this.PriceproviderArr)
      this.FXD_cfs.sort_by_key(this.SampleArray, 'PP_Name');
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

  fnchngPriceProvider(e){
    if(e.target.value !== 'Bestprice'){
      this.PriceProviderString = e.target.value   
      this.PriceproviderArr.forEach(element => {
                if(element.PP_Code === e.target.value ){
                  this.SelectedLPForPricing = element.PP_Name //LGTGTWINT-1948 | UrmilaA, 3-may-23
                  this.SampleArray=element
                }
      });
      console.log('this.SampleArray',this.SampleArray)
    }else{
      this.SelectedLPForPricing = 'Best Price'
      this.fngetPriceProviderStr(this.PriceproviderArr)
    }
  
  }
  //Added by Urmila A | 12-April-23 | for demo entity (PB) | start
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
              if(res.Get_Ccy_PairsResult.Pair_Tradable_Details && this.FXD_cfs.fnCheckSessionValidity(res.Get_Ccy_PairsResult)){
                  res = res.Get_Ccy_PairsResult.Pair_Tradable_Details;
                  this.AllDataLoaded.ccypairs = true;
                  res.forEach(async (element) => {
                    this.CurrencyPairList.push(element);             
                      this.Pair_Cross_YN = element.Pair_Cross_YN;
                      this.Left_USD_Pair = element.Left_USD_Pair;
                      this.Right_USD_Pair = element.Right_USD_Pair;  
                      this.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
                      this.Asset2_DecimalAmount = element.Asset2_DecimalAmount;                 
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
  //Added by Urmila A | 12-April-23 | end

    // Urmila A | 11-Nov-22 |  Start
    FindLeftUSDMidRate(LeftCCY){
      this.LeftUSDMidrate = '';
      this.getBidaskSubscriber =this.FXD_afs.GetBidAskVB(//API req params modifications : Core migration | 21-Aug-23 | Urmila A      
        this.Product_Code,
        LeftCCY,
       this.FXD_cfs.fngetMode(),
       this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
      ).subscribe((res) => {
        if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_FinIQ_BidAsk_WrapperResult)) {
          this.AllDataLoaded.bidask = true;
          res = res.Get_FinIQ_BidAsk_WrapperResult;
          this.LeftUSDMidrate = res?.DC_BidAskRates.MidRate;
          console.log('left USD Midrate:', this.LeftUSDMidrate);
          if(!this.RouteFromWorkflow){ //Added by Urmila A | 11-Jan-23
            // this.GetStrikeRate();
          }
         
        }
      });
    }
    FindRightUSDMidRate(RightCCY){
      this.RightUSDMidRate = '';
      this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB( //API req params modifications : Core migration | 21-Aug-23 | Urmila A
        this.Product_Code,
        RightCCY,
        this.FXD_cfs.fngetMode(),
        this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
      ).subscribe((res) => {
        if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_FinIQ_BidAsk_WrapperResult)) {
          this.AllDataLoaded.bidask = true;
          res = res.Get_FinIQ_BidAsk_WrapperResult;   
          this.RightUSDMidRate = res?.DC_BidAskRates.MidRate;
          console.log('Right USD Midrate:', this.LeftUSDMidrate);
          if(!this.RouteFromWorkflow){ //Added by Urmila A | 11-Jan-23
            // this.GetStrikeRate();
          }
        }
      });
    }

    // GetStrikeRate() {
    //   //Added by Urmila A | 17-april-23
    //   if(this.OptionType === 'Call'){
    //       if(this.OrderDirection === 'Buy'){
    //           this.Strike = Number(this.fnCheckComma(this.SpotAsk)).toFixed(this.PointShift)
    //       }else{
    //           this.Strike = Number(this.fnCheckComma(this.SpotBid)).toFixed(this.PointShift)
    //       }
    //   }else{
    //       if(this.OrderDirection === 'Buy'){
    //         this.Strike = Number(this.fnCheckComma(this.SpotBid)).toFixed(this.PointShift)
    //       }else{
    //         this.Strike = Number(this.fnCheckComma(this.SpotAsk)).toFixed(this.PointShift)
    //       }
    //   }
      
    // }

      //Added by Urmila A | 12-April-23 | start
  fnGetFXDCurrencyPairs(){
    this.AllDataLoaded.ccypairs = false;
     this.FXCurrencyPairsubscription =  this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
      this.FXD_afs.EntityID,
      this.Product_ID,
      this.Product_Code,
      this.Mode,
      '', //selectedDepoCcy
      '',  //selectedAlternatCcy
      '', //CcySearch - Added by Urmila A | 11-Jan-23 
      this.OptionCut,
    ).subscribe((res) => {
      this.CurrencyPairList=[]; //Added by Urmila A | LGTGTWINT-753 | 6-Jan-23
      if (res.Get_Ccy_PairsResult.Pair_Tradable_Details && this.FXD_cfs.fnCheckSessionValidity(res.Get_Ccy_PairsResult)) {
        res = res.Get_Ccy_PairsResult.Pair_Tradable_Details;
        this.AllDataLoaded.ccypairs = true;
       
        res.forEach(async (element) => {
          this.CurrencyPairList.push(element.Asset1);
        
            // this.CurrencyPair = this.CurrencyPairList[index].Asset_Pair;
            // this.DepCcy = this.CurrencyPair.slice(0, 3);
            // this.AltCcy = this.CurrencyPair.slice(6, 9);
            // this.NotionalCCY = this.DepCcy;
            // this.IBPremCCY = this.DepCcy;
            // this.Pair_Cross_YN = element.Pair_Cross_YN;
            // this.Left_USD_Pair = element.Left_USD_Pair;
            // this.Right_USD_Pair = element.Right_USD_Pair;
            // this.fnGetBidAskRates();        
            // this.fnGetOptionCutFXD();
            // this.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
            // this.Asset2_DecimalAmount = element.Asset2_DecimalAmount;
        
        });
        
        this.DepCcy = this.AltCcy =  this.CurrencyPairList[0]
        this.CurrencyPairList=this.CurrencyPairList.filter((nane, index) => this.CurrencyPairList.indexOf(nane) === index);
        this.fnGetOptionCutFXD();
        // if (this.Pair_Cross_YN === 'Y') {
        //   this.FindLeftUSDMidRate(this.Left_USD_Pair);
        //   this.FindRightUSDMidRate(this.Right_USD_Pair);
        // }
        this.FXD_cfs.sort_by_key(this.CurrencyPairList, 'Asset_Pair');
      
      }
    });
  }
  //Added by Urmila A | 12-April-23 | start

  TenorChanged(e) {
    this.Tenor = e.target.value
    this.ResetAllFields();
    this.MaturityDate = '';
    this.FixingDate = '';
    this.fnGetDatesCalculationforVB();
  }

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
      if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_Entity_Member_Map_DataResult)) {
        this.AllDataLoaded.tenor = true;
        res.Get_Entity_Member_Map_DataResult.Entity_MemberData.forEach((element) => {
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
  
  //Urmila A |  12-April-23 | start
  fnGetBidAskRates() {
    this.AllAPIsLoaded=false;  
    this.AllDataLoaded.bidask = false;
    this.getBidaskSubscriber = this.FXD_afs.GetBidAskVB( //API req params modifications : Core migration | 21-Aug-23 | Urmila A
      this.Product_Code,
      this.CurrencyPair,
      this.FXD_cfs.fngetMode(),
      this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
    ).subscribe((res) => {
      if (res && this.FXD_cfs.fnCheckSessionValidity(res.Get_FinIQ_BidAsk_WrapperResult )) {
        this.AllDataLoaded.bidask = true;
        this.PointShift = Number(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.PointShift);
        this.SpotBid = parseFloat(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.BidRate)
        .toFixed(Number(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.PointShift))
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        this.SpotAsk = parseFloat(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.AskRate)
        .toFixed(Number(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.PointShift))
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
       
        this.PipsMultiplier = Number(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.PipsMultiplier);
        this.SpotMidRate= parseFloat(res.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.MidRate);
       
        // this.GetStrikeRate();
       

        if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
          this.AllAPIsLoaded=true;
        }
      }
    });
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
      if(res.Get_OptionCutResult.A_ResponseHeader.FailedReason === "")
      {
        if (res.Get_OptionCutResult.D_OptionCut && res.Get_OptionCutResult.D_OptionCut.length > 0 && this.FXD_cfs.fnCheckSessionValidity(res.Get_OptionCutResult)) {
          this.AllDataLoaded.optioncut = true;
          res = res.Get_OptionCutResult.D_OptionCut
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
          this.fnGetDatesCalculationforVB();

          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }
        }
      }     
      else
      {
        this.AllDataLoaded.optioncut = true;
        this.NotificationFunction("Error","Error" , res.Get_OptionCutResult.A_ResponseHeader.FailedReason)
      }
    });
  }

  chngInvCCY(e){
    this.DepCcy=e.target.value;
  }

  chngAltCCY(e){
    this.AltCcy=e.target.value
  }
    //modified by Urmila A, 12-April-23 | start
    fnGetDatesCalculationforVB() {
      this.FixingDate = '';  
      this.MaturityDate = ''; 
      this.AllAPIsLoaded=false;
      this.FXD_afs.GetDatesCalculationforVB(
        this.FXD_afs.EntityID,
        this.Product_ID,
        this.Product_Code,
        this.DepCcy,
        this.AltCcy,
        '', //Fixing_Frequency   
        '',
        this.Tenor,
        this.OptionCut,
        this.TradeDate,    
        this.Mode,'','' //Core migration: API req parameters modified by Urmila A | 22-Aug-23 
      ).subscribe((res) => {
        if (res.CalculateDatesResult.Dates && this.FXD_cfs.fnCheckSessionValidity(res.CalculateDatesResult)) {
          this.AllDataLoaded.datecalculation = true;    
          res = res.CalculateDatesResult.Dates;
          this.PremiumDate = res[0].ValueDate;
          this.FixingDate = res[0].FixingDate;
          this.MaturityDate = res[0].MaturityDate;
          this.TenorDays = res[0].ExpiryDays;     
          // this.fnGetContractSummary();
          if(this.FXD_cfs.fnCheckAllDataLoaded(this.AllDataLoaded) === true){  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 |
            this.AllAPIsLoaded=true;
          }
        }
      });
    }

    
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

  fnGetProductInfo(){
    this.AllAPIsLoaded=false; //Urmila A | LGTGTWINT-1295 | 10-Feb-23 
     this.AllDataLoaded.productinfo=false;  //Urmila A | LGTGTWINT-1295 | 10-Feb-23    
      this.productInfoSubscriber = this.FXD_afs.fnGetAllProductinfo(
        this.FXD_afs.EntityID,
        this.Mode,
        this.FXD_afs.UserName,
        this.Product_Code
      ).subscribe((res) => {      
        if (res && this.FXD_cfs.fnCheckSessionValidity(res.GetAllProductInfoResult)) {
          this.AllDataLoaded.productinfo = true;
          res.GetAllProductInfoResult.ProductDetails.forEach(async (element) => {
            if (element.Product_Name === 'DCI' && this.selectedProduct === 'DCI') {
           
              this.Product_Name = element.Product_Name;
              this.Product_ID = element.Product_ID;
              this.Product_Code = element.Product_Code
            
              console.log('this.Product_Code',this.Product_Code);
           
              // this.fngetPersonalDefaultValues();      
              // !this.RouteFromWorkflow
              if(!this.IsNavigate){ //urmila a, 29-mar-23
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

}
