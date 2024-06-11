import { Component, ElementRef, EventEmitter, OnInit, ViewChild, Input,Output} from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCalendar } from '@angular/material/datepicker';

import { Moment } from 'moment';
import * as moment from 'moment';

import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';

import { Subscription } from 'rxjs/internal/Subscription';

import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';

import { environment } from 'src/environments/environment';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services/config.service';


declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    CLNsortBy(p: any): Array<T>;
  }
}
Array.prototype.CLNsortBy = function (p): Array<any> {
  try {
    // tslint:disable-next-line: only-arrow-functions
    return this.slice(0).sort(function (a, b) {
      return (parseFloat(a[p].substring(0, a[p].length - 1)) > parseFloat(b[p].substring(0, b[p].length - 1)))
        ? 1 : (parseFloat(a[p].substring(0, a[p].length - 1)) < parseFloat(b[p].substring(0, b[p].length - 1))) ? -1 : 0;
    });

  } catch (error) {
    throw (error)
  }
};
@Component({
  selector: 'app-credit-linked-note',
  templateUrl: './credit-linked-note.component.html',
  styleUrls: ['./credit-linked-note.component.scss']
})
export class CreditLinkedNoteComponent implements OnInit {

  //@ViewChild('focusable', { static: false })

  @Input() PrevQuoteShowOrderPopUp: any;
  @Input() dataItemAccordian: any;
  @Input() LPfromPrevQuote: any

  @Input() viewRFQID: any;
  @Input() Order_Notional: any;
  @Input() NMID: any;
  @Input() RepriceIssuer: any;
  @Input() TokenIdReprice: any;
  @Input() viewOnlyFlag: any;
  @Input() sendtocptyflag: any;
  @Input() selectedToken: any;

  shwRepriceBookOrder = false;
  sendtoCptyBookOrder = false;

  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();

  @Output()
  selectedDate = moment();

  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment>;

  @ViewChild('focusable', { static: false }) namefield: ElementRef;

  pageActive: Boolean = true;
  // Suvarna P || 19Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer

  // View TS flag and timer variables
  // Suvarna P || 28Jun23 || BBVAEPCLI-614 || TS request timeout to be increased to 2 mins || assigned by Nitij M
  // TSTimeout = 60;
  TSTimeout = 120;
  TSInterval: any;
  TSFlag = false;
  reqSuccessMsg: string = "";
  buttonList: any = '';
  commonData:any = [];
  templateName='';
  public shares: any = [];
  showOrderDetailsFlag: boolean = false;
  

  constructor(public elem: ElementRef, public commonfunctions: CommonfunctionsService,
    public echome: EcHomeService, public eccommon: EcCommonService, public http: HttpClient,
    public apifunctions: ApifunctionsService, public datepipe: DatePipe, private route: ActivatedRoute) {
      
      this.shares = [];
      this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
      this.ddlNoteCcy = 'EUR';
      this.format = 'Note';
      this.cpnType = 'Fixed';
      this.SolveForvalue = 'Coupon';
      this.ordertype = 'MOC';//Added by Apurva K || 27-Mar-2024 ||FIN1EURINT-708
      this.intervals = new Set<NodeJS.Timeout>();//Added by Varsha G || 23-Jun-2023
  }


  // CreditLinkedNote = "Credit Linked Note"
  // AutoCall = "AutoCall"
  // Onbehalfof = "On behalf of"
  // Currencylabel = "Currency"
  // Format = "Format"
  // Solvefor = "Solve for"
  // Size = "Size"
  // Pricepercent = "Price (%)"
  // IssuePrice = "Issue Price (%)"
  // Underlying = "Underlying"
  // Type = "Type"
  // NonCall = "Non-Call"
  // Stepdown = "Stepdown (%)"
  // StepdownFrequency = "Stepdown Frequency"
  // Trigger = "Trigger"
  // Floor = "Floor (%)"
  // Frequency = "Frequency"
  // Airbaglabel = "Airbag"
  // Couponlabel = "Coupon"
  // Dateslabel = "Dates"
  // StrikeShifterDate = "Strike Shifter/Date"
  // PaymentShifterDate = "Payment Shifter/Date"
  // Tenorlabel = "Tenor" 
  // KIBarrierType = "KI Barrier Type"
  // Level = "Level"
  // Barrier = "Barrier"
  // Observation = "Observation"
  // Strikelabel = "Strike (%)"
  // AltCoupon = "Alt. Coupon"
  // AlternativeCoupon = "Alternative Coupon"
  // Pricelabel = "Price"
  // Schedule = "Schedule"
  // Index = "Index"
  // Notionallabel = "Notional"
  // Reoffer = "Reoffer Price"
  // IssuePricelabel = "Issue Price (%)"
  // RecoveryTypelabel = "Recovery Type"
  // SettlementTypelabel = "Settlement Type"
  // Tranche = "Tranche"
  // Attachlabel = "Attach"
  // Detachlabel = "Detach"
  // IssueDatelabel = "Issue Date"
  // CouponTypelabel = "Coupon Type"
  // FloatingReflabel = "Floating Ref."
  // CouponSpreadLabel = "Coupon (%) / Spread (%)"
  // CouponFreq = "Coupon Freq."
  // CouponBasislabel = "Coupon Basis"
  // ReferenceEntitylabel = "Reference Entity"
  // CouponpaSpreada = "Coupon p.a. (%) / Spread p.a. (%)"
  // Redemption = "Redemption"
  customSetDate: number = 1;
  rfqID: any;
  portfolioId: any;
  viewOnly = false;
  scheduledReqId: any;
  ErrorMsg: any = '';
  infoMsg = '';
  allBooksData: any = [];
  onBehalfOf: any;
  ddlNoteCcy: any
  CCY = [];
  Format = []; //Apurva K
  IssueDateOffset = []; //Apurva K
  SolveForDropdown: any=[]; //Apurva K
  CouponDayBasis: any =[]; //Apurva K
  CpnFreqArr: any =[]; //Apurva K
  AutocallFrequency = [];
  autoNonCallArr: any = [];
  TenorDropdown: any=[];
  format: any;
  ReceivedCCY: any;
  Notional: any;
  checkNotionalRes: any;
  mappedformatlist: any;
  IBPrice: any;
  SolveForvalue: any;
  issuePrice: any;
  ShareName!: string;
  showSuggestions = false;
  flag!: boolean;
  selectedBIndex = 0;
  selectedShareIndex = 0;
  shareCode: any;
  ShareBasket: any = [];
  Dates: any = [];
  settdate = '';
  // changed by Suvarna P || 24May2022 ||  BBVACLI-271 || issue-date shifter changing on adding and removing share reported by Abeer J; unwanted variables || assigned by Pranav D
  stkdate = '';
  expdate = '';
  paymentshift: any;
  expshift: any;
  Exchange: any;
  SelectedUnderlyingarray: any = [];
  SelectedUnderlyingBasketArray: any = [];
  SelectedUnderlyingBasket: any = {
    UnderlyingOne: {},
    UnderlyingTwo: {},
    UnderlyingThree: {},
    UnderlyingFour: {},
    UnderlyingFive: {},
  };
  cpnType: any;
  cpnFreq: any;
  cpnBasis: any;
  Spread: any;
  fundIndex: any;
  floatingRef: any;
  floatingRefArr: any = [];
  noOfPeriods: any;
  asseturl = environment.asseturl;
  interfaceUrl = environment.interfaceURL;
  Tenor: any;
  recoveryType: any;
  recoveryTypeArr: any = [];
  settlementType: any = 'European';
  settlementTypeArr: any = [];
  priceBtnActive = 'Y';
  priceoptionflag = false;
  saveoptionflag = false;
  sortedAllPrices: any = [];
  timeoutMsg!: string;
  orderID: any;
  replySolveFor: any;
  replySolveFor1: any;
  loadflag = false;
  orderStatus: any;
  saveFlag = false;
  successMsg: any;
  GetClientProdDetailsArr: any;
  floatingRefAll: any = [];
  todayDate: any;
  Code: any;
  fundType: any;
  fundFreq: any;
  fundRate: any;
  maturityDate: any;
  tenorArr: any = [];
  issueDate: any = '';
  templateMappingArr: any;
  // reofferPrice: any;
  indexTranche: any;
  AttachPer: any;
  DetachPer: any;
  portfolioGroupID: any;
  clearFlag!: boolean;
  Prices: any = [];
  priceProvidersArr: any = [];
  priceProvidersArrCpy: any = [];
  interval: any;
  defaultTimeout!: number;
  timeLeft = 60;
  PPDetails: any;
  Product: any;
  ReferenceEntity: any;
  ReferenceEntity2: any;
  ReferenceEntity3: any;
  ReferenceEntity4: any;
  ReferenceEntity5: any;
  // FirstNPeriods: any;
  // FixedRate: any;
  IndicativeOrFirm: any;
  dateToday: any;
  dateToday20: any;
  validationArr: any;
  AllPrices: any = [];
  NoteMasterID: any;
  private creditLinkedNotePriceSubscription: Subscription = new Subscription;
  scheduleMsg: any;
  showSchedulePopupFlag = false;
  inputDate: any;
  inputTime: any;
  scheduleFreqArr: any = [];
  scheduleTypeArr: any = [];
  scheduleFreq = 'Monthly';
  scheduleType = 'Regular';
  Upfront: any;
  Fixedrate: any;
  saveportfolioId = '';
  tempXML = '';
  showsaveSharePopupFlag = false;
  currentowner: any;
  userName!: string;
  selectedUserIndex = 0;
  showSuggestions_User = false;
  userflag!: boolean;
  users: any;
  userCode: any;
  selectedBIndex_User = 0;
  userBasket: any = [];
  // BBVAEPCLI-271 Pranav D  2-Jan-2023
  creditToggleYN: any = 'Y';
  // BBVAEPCLI-271 Pranav D 4-Jan-2023
  firstCpnYN: any = 'N';
  cpnFirst: any = 'Short';
  toggleFlag: any = 'Ind';
  WatchID: any;
  // Add to watchlist variabled
  fundRatePopup: any = false
  ProductWatchlist: boolean = false;
  showAddToWatchlistPopupFlag: boolean = false;
  targetValue: any;
  direction: any;
  expiryDate: any;
  addWatchlistSolveFor: any;
  TimeValid: any = "";
  maxValidityDays: any
  // MaxSelectDate:any=moment().add({days:5}).format('DD-MM-YYYY');
  MaxSelectDate: any;
  MinSelectDate: any = moment().add({ days: 0 }).format('YYYY-MM-DD');
  // BBVAEPCLI-414 Pranav D 20-Mar-2023
  isAddToWatchlist: boolean = false;
  errorTemplateMessage = '';
  activeTab: any = 'Pricing';
defaultvaluesArr:any = [];
  updateMessagePopupFlag = false;
  stkshift: any;
  stkshiftFwd : any = 'Fwd';
  stkshiftTdy : any = '0B';
  customTenor = '';
  manualTriggerValueArr: any;
  autoFreq: any;
  autoNonCall: any;
  callableFreq = '';
  putableFreq = '';
  docSupportStatus: any = {};
  defaultOrderTimeout: number;
  CLNPriceSubscription: Subscription;
  bestLPArray: any = [];
  noteMasterID: any;
  defaultRFQTimeout: number;
  priceClickFlag = false;
  cappercent:any='';
  floorpercent: any = '';
  capfloorYN: any = 'N';
  fundingbasis: any = '30/360';
  AccCpnYN: any = 'N';
 SaveandShareErrorMsg:any; // BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
  // new config variable || PriyaL || 05Apr2022 || Assigned by PranavD
  EQ_Show_Launch_Button = 'NO';
  EQ_Show_Order_Button = 'NO';
  // new config variable || Amogh k || 19Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';

  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';
  private intervals: Set<NodeJS.Timeout>; 
  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsPopupLabels: Object[] = [];
  variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  quoteEmailFlg = false;
  bookOrderFlag = true;

  poolDetailsVisibleFlag = false;
  BlockedUserGroups:any;
  showBlockReason = false;
  BlockUserMessage: any;
  BookingCenter:any = [];
  successMsgBookOrder: string = "";
  errorMsgBookOrder: string = "";
  orderBookedFlag = false;
  totalNotional: any = "300,000.00";
  underlyingForLimit: '';
  selectedBookingBranch: any;
  successMessage: boolean;

  ErrorMsgTop: any; 
  OrderType: any;
  selectedRFQ: any;
  Issuer: any;
  ordersuccessMsg: any;
  
  txtnotional: any;
  txtIBPrice: any;
  txtClientPrice: any;
  txtStrike: any;
  txtTenor: any;
  txtUpfront: any;
  txtClietYield: any;
  txtOrderType: any;
  txtlimitLevel: any;
  minNotional: any;
  maxNotional: any;
  txtEQCRef: any;
  txtComment: any;
  txtOthersRsn: any;
  nonBestPriceRsnDD: any;
  txtShare: any;
  ordertype:any;
  Strike: any;
  txtddlNoteCcy: any;
  tblAllocation = [];
  allocatedNotional: any = 0;
  remainingNotional: any = 0;
  previousNotional: any = 0;
  allocatedNotionalArr: any = [0.00];
  allocatedRMArray: any = [''];
  allocatedClientArray: any = [''];
  allocatedCustomerArray: any = [''];
  NonBestPriceReasonArr = [];
  minNotionalConfirm = false;
  EQ_Show_Order_RM = 'NO';
  EQ_Show_Order_Customer = 'NO';
  EQ_Login_Client_Mapping = 'NO';
  loggedInUsername:any; //Changes for FIN1EURINT-714|| 17-Apr-2024||Apurva K
  orderLoadFlag: boolean = false// Added by YASH AGRAWAL
  customerList:any = [];
  warningMessage: boolean;
  ErrorMsg1: any;

 monthSelected(date: Moment) {
    //  
  }

  ngOnInit() {
    this.minNotionalConfirm = false;
    try {
      $('#loading').show();
      setTimeout(async() => {
        this.pageloadflag=true;
        this.pageActive = true;
        this.Product = 'CLN';
        this.sortedAllPrices = [];
        this.autoFreq = 'Monthly';
        this.autoNonCall = 'M1';
        this.expshift = '5Y';
        this.paymentshift = 'T + 5';
        this.stkshift = '0B';
        this.fundFreq = '';
        this.loggedInUsername = AppConfig.settings.oRes.userName; //Apurva K||17-Apr-2024
        this.warningMessage = false;
        this.Strike = '100.00';
        this.successMessage = false;

        this.shares = await this.echome.shares;

        // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
        //   this.allBooksData = this.apifunctions.getAllBooksMappedToLogin();
        // } else {
        //   this.allBooksData = this.apifunctions.allBooksData;
        //   $('#loading').hide();
        // }

        if (this.echome.CCY === undefined || this.echome.CCY?.length <= 0) {
          this.ReceivedCCY = await this.echome.BBVALoadCCY();
        }
        if (this.echome.floatingRefArrCLN === undefined || this.echome.floatingRefArrCLN?.length <= 0) {
          this.floatingRefAll = await this.echome.BBVALoadSharesAssets('IR','CF');
        } 

        if (this.echome.BookingCenter === undefined || this.echome.BookingCenter.length <= 0) {
          this.BookingCenter = await this.echome.GetBookingCenter();
        }
        else{
         this.BookingCenter = this.echome.BookingCenter;
        }
        //this.shares = await this.echome.shares;
        // if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
        //   //this.shares = this.apifunctions.BBVALoadShares('EQ');
        //   // START || Updated Request parameters added by Taran || 5th July 2023|| BBVAEPCLI-561 || Equity Single Name Lookup UI
        //   // this.shares = await this.echome.GetReferenceEntityLookupData("", "");

        //   // this.shares = await this.echome.sharesCLN;
          
        //   // console.log(this.shares,"shares EQC")
  
        //   // console.log(this.shares,"this.shares for CLN")


        // } else {
        //   this.shares = await this.echome.GetReferenceEntityLookupData("", "");
        //   console.log(this.shares,"this.shares for CLN outside if")
        //   // END || Updated Request parameters added by Taran || 5th July 2023||BBVAEPCLI-561 || Equity Single Name Lookup UI

        //   $('#loading').hide();
        // }

        this.ReceivedCCY = await this.echome.CCY;
        this.shares = await this.echome.sharesCLN;
        this.customerList = await this.echome.getCustomerList();
   
        //console.log(this.ReceivedCCY,"ReceivedCCY console")
        try {
          this.ReceivedCCY.forEach((element) => {
            const ccyData = element.Ccy;
            this.CCY.push(ccyData);
          });
        } catch (error) {
        }
        this.floatingRefAll = await this.echome.floatingRefArrCLN;
        //console.log(this.floatingRefAll,"floatingRefAll");
        
        this.floatingRefArr = this.floatingRefAll.filter((d: { Ccy: any; }) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          this.fundIndex = '';
        }

        this.commonData = await this.echome.GetCommonDataEuroConnect("CreditLinkedNote");
        if (this.commonData && this.commonData.length > 0) {
         
          await this.filldropdownfromcommandata();
        }
        //console.log(this.commonData,"common data")
        //console.log(this.Format,"commondata Apurva 2")
        //console.log(this.CCY,"CCY console")

        if (this.echome.validationArr === undefined || this.echome.validationArr.length <= 0) {
          this.validationArr = this.echome.BBVAFetchValidation('EQ');

        }
        

        if (this.allBooksData && this.allBooksData.length > 0) {
          this.onBehalfOf = this.allBooksData[0].BookCode;
        }else{
          this.onBehalfOf = 'BANCO BPI';
        }
        
        this.users =  await this.echome.GetMappedUsersAndGroups();

        const res:any = await this.echome.GetPriceProviderDetails(this.templateMappingArr?.length > 0 ? this.templateMappingArr[0].template : 'CreditLinkedNote');
        //console.log(res, "GetPriceProviderDetails")
       
        for (let i = 0; i < res.length; i++) {
          const currCPdocStatus = this.docSupportStatus?.[res[i]];
          // for (let i = 0; i < 1; i++) {
          this.priceProvidersArr.push({
            lp: res[i],
            rfq: '',
            price: '-',
            timer: this.defaultOrderTimeout, //this.startCountDown(this.defaultTimeout, i),
            id: '',
            status: '',
            NoteMasterID: '',
            TSFlag: false,
            Msg: '',
            KIDFlag: false,
            TSMsg: '',
            timeStartFlag: false,
            priceChkFlg: false,
            loadFlag: false,
            TSLoadFlag: false, //Added by Apurva K|| 02-May-2023
            KIDLoadFlag: false,  //Added by Apurva K|| 09-May-2023
            ViewKIDFlag: false,  //Added by Kaustubh S|| 18-May-2023
            ViewTSFlag: false,  //Added by Jyoti S|| 25-May-2023
            TSDisableFlag: false,  //Added by Apurva K|| 22-May-2023
            KidDisableFlag: false,  //Added by Apurva K|| 22-May-2023
            KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
            TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
          });
          this.priceProvidersArrCpy.push({
            lp: res[i],
            rfq: '',
            price: '-',
            timer: this.defaultOrderTimeout, //this.startCountDown(this.defaultTimeout, i),
            id: '',
            status: '',
            NoteMasterID: '',
            TSFlag: false,
            Msg: '',
            KIDFlag: false,
            TSMsg: '',
            timeStartFlag: false,
            priceChkFlg: false,
            loadFlag: false,
            TSLoadFlag: false, //Added by Apurva K|| 02-May-2023
            KIDLoadFlag: false,  //Added by Apurva K|| 09-May-2023
            ViewKIDFlag: false,  //Added by Kaustubh S|| 18-May-2023
            ViewTSFlag: false,  //Added by Jyoti S|| 25-May-2023
            TSDisableFlag: false,  //Added by Apurva K|| 22-May-2023
            KidDisableFlag: false,  //Added by Apurva K|| 22-May-2023
            KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
            TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
          });

         
        }

        //console.log(this.priceProvidersArr,"price provider array")
        const that = this;
        this.CLNPriceSubscription = await this.eccommon.CLNSignalRPrices.subscribe(res => {
          const prices = res.price;
          //console.log(prices,"this is prices response console")
          if (prices && prices.length > 0) {
            this.sortedAllPrices = [];
            this.AllPrices = [];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < prices.length; i++) {

              for (let k = 0; k < this.priceProvidersArr.length; k++) {
                if (prices[i].ppID === this.priceProvidersArr[k].lp) {
                  this.priceProvidersArr[k].price = ((prices[i].status + '').toUpperCase() === 'TIMEOUT' && (this.priceProvidersArr[k].price === '' || this.priceProvidersArr[k].price === '-')) ? 'Timeout' :
                    ((prices[i].value === null || prices[i].value === '') ? ((prices[i].status + '').toUpperCase() === 'REJECTED' ? 'Rejected' : ((prices[i].status + '').toUpperCase() === 'UNSUPPORTED' ? 'Unsupported'
                      : ((prices[i].status + '').toUpperCase() === 'EXPIRED' ? 'Expired' : '-'))) : ((prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'EXPIRED') ? 'Expired' :
                        (prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'CANCELLED') ? 'Cancelled' : prices[i].value));
                  if(this.priceProvidersArr[k].price !== '-'){
                    this.priceProvidersArr[k].loadFlag = false
                  }
                  this.priceProvidersArr[k].rfq = prices[i].rfqID;
                  this.priceProvidersArr[k].id = prices[i].id;
                  this.priceProvidersArr[k].status = prices[i].status;
                  this.priceProvidersArr[k].NoteMasterID = prices[i].noteMasterID;
                  this.priceProvidersArr[k].minLimit = prices[i].minLimit;
                  this.priceProvidersArr[k].maxLimit = prices[i].maxLimit;
                  this.priceProvidersArr[k].bestYN = prices[i].bestYN;
                  this.priceProvidersArr[k].remark = prices[i].remark;
                  // quote expired timeout chnages by suvarna P || 31Mar2022 || assigned by Pranav D || start
                  this.priceProvidersArr[k].EP_Quote_Response_At = prices[i].EP_Quote_Response_At;
                  this.priceProvidersArr[k].EP_ValidUntilTime = prices[i].EP_ValidUntilTime;
                 }
              }

              if (this.AllPrices.findIndex(record => record.rfq === prices[i].rfqID) === -1) {
                if (prices[i].value !== null && prices[i].value !== "") {
                  this.AllPrices.push({
                    rfq: prices[i].rfqID,
                    lp: prices[i].ppID,
                    Price: (prices[i].value === null ? '-' : prices[i].value),
                    solveFor: prices[i].solveFor,
                    NoteMasterID: prices[i].noteMasterID,
                    id: prices[i].id,
                    status: prices[i].status,
                    bestYN: prices[i].bestYN,
                    remark: prices[i].remark,
                    // quote expired timeout chnages by suvarna P || 31Mar2022 || assigned by Pranav D || start
                    EP_Quote_Response_At: prices[i].EP_Quote_Response_At,
                    EP_ValidUntilTime: prices[i].EP_ValidUntilTime
                  });
                }
              }
              // else{
              //     this.AllPrices[i].Price =prices[i].value;
              //     this.AllPrices[i].id= prices[i].id;
              //     this.AllPrices[i].status= prices[i].status;

              // }
            }

            
            // //console.log('AllPrices', this.AllPrices);
            // //console.log('priceProvidersArr', this.priceProvidersArr);
            // this.sortedAllPrices = this.AllPrices;//.sortBy('Price');
            var idxBest = this.AllPrices.findIndex(item => item.bestYN === 'Y');
            if (idxBest > -1) {
              // this.sortedAllPrices = this.AllPrices.ERsortBy('Price');
              this.sortedAllPrices = this.AllPrices.filter(item => item.bestYN === 'Y');
            }

            // set sortedAllPrices array on reprice action - added by PriyaL on  25-Feb-2022 - assigned by Pranav D.
            if (this.sendtocptyflag) {
              this.sortedAllPrices = this.AllPrices;
            }


            if (this.sortedAllPrices && this.sortedAllPrices[0]) {
              var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
              //console.log(idx);
              // if (idx > 0) {
              //  this.priceProvidersArr = array_move(this.priceProvidersArr, idx, 0)
              // }
              this.bestLPArray = this.priceProvidersArr[idx];
              this.bestLPArray.idx = idx
            }

            this.buttonList = '';

            if (this.sortedAllPrices.length > 0) {
              if (this.sortedAllPrices.length > 0 && this.sortedAllPrices[0].Price !== ''
                && this.sortedAllPrices[0].Price !== '-' && this.sortedAllPrices[0].Price !== 'Timeout'
                && this.sortedAllPrices[0].Price > 0 && this.sendtocptyflag) {
                this.shwRepriceBookOrder = true;
              }
              that.loadflag = false;
              let price = '';
              if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
              }
              switch (this.sortedAllPrices[0].solveFor) {
                // case 'Strike':
                //   that.Strike = price;
                //   that.replySolveFor = 'Strike';
                //   break;
                case 'IBPrice':
                  that.IBPrice = price;
                  that.replySolveFor = 'Price';
                  break;
                case 'Coupon':
                  that.Spread = price;
                  that.replySolveFor = 'Coupon';
                  break;
                // case 'KO':
                //   that.autoTrigger = price;
                //   that.replySolveFor = 'Autocall Trigger';
                //   break;
                // case 'RebateCoupon':
                //   that.autocallCoupon = price;
                //   that.replySolveFor = 'Autocall Coupon';
                //   break;
                // case 'CouponBarrier':
                //   that.cpnTrigger = price;
                //   that.replySolveFor = 'Coupon Trigger';
                //   break;
                // case 'KI':
                //   that.barrierLevel = price;
                //   that.replySolveFor = 'Barrier Level';
                //   break;
                case 'FundingRate':
                  that.fundRate = price;
                  that.replySolveFor = 'Rate/Spread';
                  break;
                // case 'ERCoupon':
                //   that.ERCoupon = price;
                //   that.replySolveFor = 'ER Coupon';
                //   break;
                // case 'PutStrike':
                //   that.Strike = price;
                //   that.replySolveFor = 'Put Strike';
                //   break;

              }
              if (price !== '') {
                if (this.sortedAllPrices[0].solveFor !== 'PutStrike') {
                  if (this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor)) {
                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor).classList.add('reply');
                  }
                } else {
                  this.elem.nativeElement.querySelector('#txtStrike').classList.add('reply');
                }

              }
              that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
              that.orderID = this.sortedAllPrices[0].id;
              that.orderStatus = this.sortedAllPrices[0].status;
            }

            if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
              that.timeLeft = 0;
            }

          }

          const today = new Date();
          if (Date.parse(this.stkdate) > Date.parse(moment().format("YYYY-MM-DD"))) {
            that.bookOrderFlag = false;
          }
          // stop timer if price is unsupported - added by Priya L on 17Dec2021
          this.priceProvidersArr.forEach(item => {
            var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
            if (item.price === 'Unsupported' || item.price === 'Expired' || item.price === 'Cancelled') {
              item.timer = '';
              clearInterval(item.interval1);
              item.timeStartFlag = false;
            }
          });


        });

        this.SolveForvalue = 'Coupon';
        this.setSolveFor(this.SolveForvalue);
        
        // this.noOfPeriods = '0';
        if (this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') {
          this.noOfPeriods = '1';
        } else {
          this.noOfPeriods = '';
        }
        this.cpnTypeChange(this.cpnType);
        if (this.SolveForvalue === 'Reoffer') {
          this.Spread = '5.00';
        }

        this.Exchange = () => {
          let exchange = '';
          if (this.SelectedUnderlyingBasket) {
            if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode) {
              exchange = this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode) {
              exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode) {
              exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode) {
              exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode) {
              exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode;
            }
          }


          return exchange;
        };

       // this.paymentshift = '10B';
        this.Dates = this.echome.BBVAGetDates('', this.paymentshift, '');
        this.setIssueDate(this.paymentshift);
        // if (this.Dates) {
        //   this.todayDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // }
        // this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

        this.cpnType = 'Fixed';

        this.IBPrice = '99.50';
        this.issuePrice = '100.00';
        if (this.cpnType === 'Fixed') {
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
        } else {
          this.cpnFreq = '6m';
          this.changeFloatingrefonFreq(this.cpnFreq);
        }

        this.cpnBasis = '30/360';


        // this.Notional = '2,500,000';
        this.Notional = '1,500,000';

        //Added by Apurva K
        this.Dates = await this.echome.BBVAGetDates('', '0B', '');
        if (this.Dates) {
          this.todayDate = this.eccommon.formatDate(this.Dates.MaturityDate);

        }

        this.Dates = await this.echome.BBVAGetDates(this.Exchange(), '0B', '');
        if (this.Dates) {
          this.stkdate = this.eccommon.formatDate(this.Dates.MaturityDate);
          // this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }

        // // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
        // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
        this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

        
        if (this.Dates) {
          this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);
        this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate); // Changed by Jyoti S || 09-May-2023
        
        if (this.Dates) {
          this.expdate = this.eccommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }


        this.AttachPer = '';
        this.DetachPer = '';
        // }
        this.fillRecoveryTypeArr();

        this.setIssueDate(this.paymentshift);

        this.Code = () => {
          let code = '';
          if (this.SelectedUnderlyingBasket.UnderlyingOne.Code) {
            code = this.SelectedUnderlyingBasket.UnderlyingOne.Code;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingTwo.Code) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.Code;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree.Code) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.Code;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour.Code) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.Code;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFive.Code) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.Code;
          }
          return code;
        };

        this.Exchange = () => {
          let exchange = '';
          if (this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode) {
            exchange = this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode) {
            exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode) {
            exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode) {
            exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode;
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode) {
            exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode;
          }

          return exchange;
        };

        this.IndicativeOrFirm = 'Ind';

        this.fundType = '';
        if (this.format === 'Swap') {
          this.fundFreq = '3m';
          this.fundType = '';
        }
        this.fundRate = '1.00';
        this.fnGetValidation();
        this.fnGetProdTemplate();

        this.route.queryParams.subscribe((res: any) => {
          if (res.Underlying) {

            var list: string = res.Underlying;

            // this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, res.Underlying)[0]);

            // for (var each of list) {
            // 
            if (this.shares.findIndex((res: { LongName: string; }) => res.LongName.trim() === list.trim()) > -1) {
              const share = this.shares[this.shares.findIndex((res: { LongName: string; }) => res.LongName.trim() === list.trim())];

              this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, share.Code)[0]);
            }
            // }
          }

          if (res.Tenor) {
            if (res.Tenor.includes('YEAR')) {
              this.Tenor = res.Tenor.slice(0, res.Tenor.indexOf('YEAR')) + 'Y';
            } else {
              this.Tenor = res.Tenor;
            }

          }

        });

      }
      this.pageloadflag=false;

      this.route.queryParams.subscribe((res: any) => {
        if (res.Underlying) {

          var list: string = res.Underlying;

          // this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, res.Underlying)[0]);

          // for (var each of list) {
          // 
          if (this.shares.findIndex((res: { LongName: string; }) => res.LongName.trim() === list.trim()) > -1) {
            const share = this.shares[this.shares.findIndex((res: { LongName: string; }) => res.LongName.trim() === list.trim())];

            this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, share.Code)[0]);
          }
          // }
        }

        if (res.Tenor) {
          if (res.Tenor.includes('YEAR')) {
            this.Tenor = res.Tenor.slice(0, res.Tenor.indexOf('YEAR')) + 'Y';
          } else {
            this.Tenor = res.Tenor;
          }

        }

      });
    });
     
    } catch (error) {

    }
  }

  ngOnDestroy() {
    this.pageActive = false;
    this.timeLeft = -1;
    this.timeoutMsg = '';
    clearInterval(this.interval);
    this.AllPrices = [];
    this.sortedAllPrices = [];
    //START: RadhaM | Reduce api calls | 28-Mar-2023 BBVACLI-1009
    this.scheduleFreqArr = [];
    this.scheduleTypeArr = [];
    this.users = [];
    this.tenorArr = [];
    //END: RadhaM | Reduce api calls | 28-Mar-2023 BBVACLI-1009
    this.commonfunctions.setCLNReceivedPrices({}, '');
    if (this.creditLinkedNotePriceSubscription !== undefined) {
      this.creditLinkedNotePriceSubscription.unsubscribe();
    }
    if (this.CLNPriceSubscription) {
      this.CLNPriceSubscription.unsubscribe();
    }
  }

  //START || Added by Varsha G || To clear multiple intervals || 23-Jun-2023
  public clearAllDocIntervals(): void {
    for (const id of this.intervals) {
      this.clearDocInterval(id);
    }
    this.intervals.clear();
  }

  public clearDocInterval(id: NodeJS.Timeout): void {
    clearInterval(id);
    this.intervals.delete(id);
  }
//END || Added by Varsha G || To clear multiple intervals || 23-Jun-2023

  reset() {
    try {
      this.loadflag = false;// Yash A.
      this.priceBtnActive = 'Y';// Yash A.
      // $(document).bind("ajaxStart", () => {
      //   // $("#loading").show();
      // });

      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      // Suvarna P || 19Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer
      this.TSFlag = false;
      this.clearAllDocIntervals();
      this.reqSuccessMsg = '';

      if (this.ShareBasket.length > 0) {
        console.log(this.ShareBasket,"console")
        document.getElementById('txtShare')!.classList.remove('underlyingError');
        document.getElementById('txtShare')!.classList.add('longText');
      }
      document.querySelectorAll("#txtIBPrice ~ .error-input").forEach(node => node.remove()); // Kaustubh S || HSBCECCLI-44 || 16-Aug-2023
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.ErrorMsg = '';
      this.rfqID = '';
      this.noteMasterID = '';
      this.saveFlag = false;
      //this.quoteEmailFlg = false;
      this.successMsg = '';
      this.errorTemplateMessage = '';
      this.reqSuccessMsg = '';

      const els = document.getElementsByClassName('error');

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      document.querySelectorAll('input#txtstkdate ~ .error-input').forEach(ele => {ele.remove()});//Changes done by Varsha G || FIN1EURINT-123 || 29-May-2023
      document.querySelectorAll('div#customOffset ~ .error-input').forEach(ele => {ele.remove()});
      document.getElementById('txtShare').classList.remove('underlyingError');
      document.getElementById('txtShare').classList.add('longText');
      document.querySelectorAll('input#txtERCoupon ~ .error-input').forEach(ele => {ele.remove()}); //Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
      document.querySelectorAll('input#txtCoupon ~ .error-input').forEach(ele => {ele.remove()});//Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
      document.getElementById('txtShare')!.classList.add('longText');


      // changed by Suvarna P || 20May2022 || BBVACLI-242 ||  setFUnctionality when on cloneed button click || assigned by Pranav D
      // if (this.SolveForvalue === 'Reoffer') {
      //   this.IBPrice = '';
      // }
      // added solveFOrValue condition by Suvarna P || 23May2022 || BBVACLI-266 || regression issue to set IBPrice and Upfront || assigned by Pranav D
      if (this.SolveForvalue === 'Reoffer' && this.format === 'Note') {
        this.IBPrice = '';
      }
      if (this.SolveForvalue === 'Reoffer' && this.format === 'Swap') {
        this.Upfront = '';
      }

      if (this.SolveForvalue === 'Coupon') {
        this.Spread = '';
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
      }
      if (this.SolveForvalue === 'FixedRate') {
        this.Fixedrate = '';
      }
      
      if (this.SolveForvalue === 'FundingRate') {
        this.fundRate = '';
      }

      if (document.getElementById('txtPrice')) {
        document.getElementById('txtPrice')!.classList.remove('reply');
      }

      if (document.getElementById('txtCoupon')) {
        document.getElementById('txtCoupon')!.classList.remove('reply');
      }

      if (document.getElementById('txtUpfront')) {
        document.getElementById('txtUpfront')!.classList.remove('reply');
      }

      if (document.getElementById('txtCoupon')) {
        document.getElementById('txtCoupon')!.classList.remove('reply');
      }

      if (document.getElementById('txtFixedrate')) {
        document.getElementById('txtFixedrate')!.classList.remove('reply');
      }
      this.eccommon.CLNPricesObserver.next('');
      this.eccommon.CLNPrices = [];
      this.eccommon.setCLNReceivedPrices({}, '');
      // //console.log(this.priceProvidersArr);
      this.bestLPArray = [];
      //this.priceProvidersArr = [];
      this.priceProvidersArr.forEach(element => {

        if (element.interval1) {
          // //console.log(element.interval1);
          element.interval1 = clearInterval(element.interval1);
          element.timeStartFlag = false;
        }


        // }
        element.rfq = '';
        element.price = '-';
        element.timer = this.defaultOrderTimeout; //this.startCountDown(this.defaultTimeout, i),
        element.id = '';
        element.status = '';
        element.NoteMasterID = '';
        element.TSFlag = false;
        element.Msg = '';
        element.KIDFlag = false;
        element.TSMsg = '';
        element.loadFlag = false;// Yash A.
        element.TSLoadFlag = false;  //Added by Apurva K|| 09-May-2023
        element.KIDLoadFlag = false; //Added by Apurva K|| 09-May-2023
        element.ViewKIDFlag = false;  //Added by Kaustubh S|| 18-May-2023
        element.ViewTSFlag = false;  //Added by Jyoti S|| 25-May-2023
        element.TSDisableFlag = false; //Added by Apurva K|| 22-May-2023
        element.KidDisableFlag = false; //Added by Apurva K|| 22-May-2023
      }
      );
      this.bookOrderFlag = true;
      //this.poolDetailsVisibleFlag = false;
      this.priceClickFlag = false;
      //this.bookOrderFlag = true;
    } catch (error) {

    }
    return false;
  }

  //Added by Anubhav Goyal | 16-02-2023
  // onBehalfOfChange() {
  //   try {
  //     this.mappedformatlist = [];
  //     this.priceBtnActive = 'N';
  //     this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
  //     if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
  //       if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Linked Note') > -1) {
  //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Linked Note')].CPM_Format).toString().split(',');
  //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Linked Note')].ActiveYN;
  //         //  
  //         if (this.mappedformatlist !== undefined && this.mappedformatlist.length > 0) {
  //           if (this.mappedformatlist.findIndex((obj: any) => obj === 'Note') > -1) {
  //             this.format = 'Note';
  //           } else {
  //             this.format = this.mappedformatlist[0];
  //           }
  //           this.formatChange(this.format);
  //         }

  //       }
  //     }
  //   } catch (error) {

  //   }
  // }

  checkValidNotional(e: any) {
    try {
      const NotionalData = this.commonfunctions.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
        this.Notional = NotionalData.Notional;
      } else {
        this.ErrorMsg = NotionalData.ErrorMsg;
      }
    } catch (error) {

    }
  }

  checkNotional(e: any) {
    try {
      if (this.ErrorMsg === '') {
        const target = this.commonfunctions.GetEventTarget(e);
        const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));
        this.checkNotionalRes = this.apifunctions.BBVACheckNotional('CreditLinkedNote', this.ddlNoteCcy);
        // added by Suvarna P. || 18May2022 || Notional Formatting issues || assigned by Pranav D.
        if (this.checkNotionalRes && this.checkNotionalRes[0] && this.checkNotionalRes[0].Minimum && this.checkNotionalRes[0].Maximum) {
          // Vaibhav B | 20-02-2023 | BBVAEPCLI-374 | Remove max notional limit for Credit products
          // floatNotional < this.checkNotionalRes[0].Minimum || floatNotional > this.checkNotionalRes[0].Maximum
          if (floatNotional < this.checkNotionalRes[0].Minimum) {
            target.classList.add('error');
            this.ErrorMsg = 'You must enter a number from '
              + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
            target.focus();
          } else {
            target.classList.remove('error');
          }
        }
      }
      this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      e.target.value = this.Notional;
    } catch (error) {

    }
  }

  formatChange(format: string) {
    try {
      if (format === 'Note') {
        this.floatingRef = '';
        this.fundFreq = '';
        this.Upfront = '';
        this.issuePrice = '100.00';
        //this.IBPrice = '99.50'; // Commented by Anubhav Goyal | 24-Jul-2023 | BBVAEPCLI-630 | Reoffer changes to 99.50% in the single pricer when you change the on behalf of
        this.fundType = '';
        if (this.cpnType === 'Fixed') {
          this.floatingRef = '';
        } else {
          this.changeFloatingrefonFreq(this.cpnFreq);
        }
      } else {
        this.Upfront = '0.00';
        this.issuePrice = '';
        this.IBPrice = '';
        this.fundType = 'Fixed Rate';
        if (this.fundType === 'Fixed Rate') {
          this.fundFreq = '1m';
        } else {
          this.fundFreq = '3m';
        }
        if (this.cpnType === 'Fixed') {
          this.floatingRef = '';
        } else {
          this.changeFloatingrefonFreq(this.cpnFreq);
        }
      }
    } catch (error) {

    }
    return false;
  }

 

  // START : Solvefor default values Pranav D BBVACLI-172
  setSolveFor(e: string) {
    //  
    try {
      this.reset();
      if (e === 'Reoffer') {
        // this.cpnType = 'Fixed';
        this.IBPrice = '';
        this.Upfront = '';
        if (this.format === 'Swap') {
          this.issuePrice = '';
        }
        else {
          this.issuePrice = this.issuePrice != '' ? this.issuePrice : '100.00';
        }
        if (this.cpnType === 'Fixed') {
          this.Spread = this.Spread != '' ? this.Spread : '5.00';
          this.Fixedrate = '';
        }
        if (this.cpnType === 'Floating') {
          this.Spread = this.Spread != '' ? this.Spread : '5.00';
          this.Fixedrate = '';
        }
        if (this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') {
          this.Spread = this.Spread != '' ? this.Spread : '5.00';
          this.Fixedrate = this.Fixedrate != '' ? this.Fixedrate : '5.00';
        }
        if (this.cpnType === 'UpFront') {
          this.Spread = '';
          this.Fixedrate = '';
        }
      }
      else if (e === 'Coupon') {
        this.Spread = '';
        this.Fixedrate = '';
        if (this.format === 'Swap') {
          this.Upfront = this.Upfront !== '' ? this.Upfront : '0.00';
          this.IBPrice = '';
          this.issuePrice = '';
        }
        else {
          this.IBPrice = this.IBPrice !== '' ? this.IBPrice : '99.50';
          this.Upfront = '';
          this.issuePrice = this.issuePrice != '' ? this.issuePrice : '100.00';
        }

        if (this.cpnType === 'Fixed') {
          //  this.fixedRate = '' ; 
        }
        if (this.cpnType === 'Floating') {

          // this.cpnSpread = ''; 
          // this.fixedRate = '' ; 
        }
        if (this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') {

          // this.cpnSpread = ''; 
          this.Fixedrate = this.Fixedrate != '' ? this.Fixedrate : '5.00';
        }
      }
      else if (e === 'FixedRate') {
        this.Fixedrate = '';
        this.Spread = this.Spread != '' ? this.Spread : '5.00';
        if (this.format === 'Swap') {
          this.Upfront = this.Upfront !== '' ? this.Upfront : '0.00';
          this.IBPrice = '';
          this.issuePrice = '';
        }
        else {
          this.IBPrice = this.IBPrice !== '' ? this.IBPrice : '99.50';
          this.Upfront = '';
          this.issuePrice = this.issuePrice != '' ? this.issuePrice : '100.00';
        }
      }

      //Start BBVAEPCLI-679 New Credit Fields: UI changes || RadhaM || 28thAugust23
      if(e==='Cap'){
        this.capfloorYN='Y'
        this.cappercent='';
        this.Spread = '5.00';
        this.IBPrice = '99.50';
        this.floorpercent='1.00';
      }
      if(e==='Floor'){
        this.capfloorYN='Y';
        this.floorpercent='';
        this.Spread = '5.00';
        this.IBPrice = '99.50';
        this.cappercent='4.00';
      }
      //End BBVAEPCLI-679 New Credit Fields: UI changes || RadhaM || 28thAugust23
    } catch (error) {

    }
  }
  // END : Solvefor default values Pranav D BBVACLI-172
  ChangeIndex(e: any) {
    try {
      console.log(e, "event")
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (error) {

    }
  }

  selectShare(e: any) {
    try {
      this.flag = false;

      if ($('.HoverSuggestion').data('share') !== undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      if (this.shareCode !== undefined && this.shareCode !== '') {
        // changed by Suvarna P || 30Aug2022 || BBVACLI-446 || CLN- Wrong reference entity select issue || assigned by Prananv D.
        // this.showUnderlying(e, SearchUnderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
        // Suvarna P || 28Jun23 || BBVAEPCLI-615 ||CLN: Search and enter does not populate the right selection
        this.showUnderlying(e, SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode, 1)[0]);

      }

      if (this.ShareBasket.length > 1) {
        this.fillRecoveryTypeArr();
        //this.fillSettlemetTypeArr();
      }
    } catch (error) {

    }
  }

  backKeyPress(e: any) {
    try {
      this.flag = false;
      this.shareCode = '';
      this.selectedBIndex = 0;
    } catch (error) {

    }
  }

  setFocus() {
    this.namefield.nativeElement.focus();
  }

  showUnderlying(event: any, item: { Code: string; LongName: string; }) {
    try {
      this.reset();
      this.infoMsg = '';
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.ShareName = '';
      console.log(this.ShareBasket,"shareasket data")
      if (this.ShareBasket.length < 5) {
        if (this.ShareBasket.find((i: { Code: string; }) => i.Code === item.Code) === undefined) {
          this.ShareBasket.push({ Code: item.Code, LongName: item.LongName });
          this.setSelectedUnderlyingarray(item.LongName, '', item.Code,
            '', '', '', '', '', '', '', '', '');
          if (this.ShareBasket.length > 1) {
            this.fillRecoveryTypeArr();
           // this.fillSettlemetTypeArr();
          }
        } else {
          return false;
        }

      }

      if (this.ShareBasket.length > 0) {
        document.getElementById('txtShare')!.classList.remove('underlyingError');
        document.getElementById('txtShare')!.classList.add('longText');
      }

      //START : BBVAEPCLI-325 Vaibhav B 17-jan-2023 on selection of underlying basket based on length recovery type and settlement type
      if (this.ShareBasket.length > 1) {
        this.fillRecoveryTypeArr();
        //this.fillSettlemetTypeArr();
      }
      //END : BBVAEPCLI-325 Vaibhav B 17-jan-2023 on selection of underlying basket based on length recovery type and settlement type


      /*
            this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
            if (this.Dates) {
              this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
      */
      // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
      // if (this.Dates) {
      //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }

      this.Dates = this.echome.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, '');
      if (this.Dates) {
        this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);
      }

      // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
      // if (this.Dates) {
      //   this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }
      // this.stkshift = this.apifunctions.GetNumberOfBusinessDays(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), this.stkdate, this.Exchange()) + 'B';
      // this.stkshift = this.apifunctions.GetNumberOfBusinessDays(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), this.settdate, this.Exchange()) + 'B';
      //this.paymentshift = this.apifunctions.GetNumberOfBusinessDays(this.stkdate, this.settdate, this.ddlNoteCcy) + 'B';
      // this.paymentshift = this.stkshift;
      // changed by Suvarna P || 24May2022 || BBVACLI-271 || issue-date shifter changing on adding and removing share reported by Abeer J || assigned by Pranav D
      this.paymentshift = this.apifunctions.GetNumberOfBusinessDays(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), this.settdate, this.ddlNoteCcy) + 'B'
    } catch (error) {

    }

  }

  setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
    Exchangename: string, ISINname: string, Last1yearHighValue: string,
    Last1yearLowValue: string, Spot: string, RiskRating: any, Manualflag: any, BlacklistedFlag: any) {
    try {
      this.SelectedUnderlyingarray.push({ LongName, Ccy, Code, ExchangeCode, Exchangename, Manualflag, BlacklistedFlag });
      this.SelectedUnderlyingBasketArray.push({
        LongName, Ccy, Code, ExchangeCode, Exchangename,
        ISINName: ISINname, Last1yearHighValue, Last1yearLowValue, Spot, Riskrating: RiskRating, Manualflag, BlacklistedFlag
      });
      this.updateShareBasket();
    } catch (error) {

    }
  }

  updateShareBasket() {
    try {
      if (this.SelectedUnderlyingBasketArray[0] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingOne = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingOne = this.SelectedUnderlyingBasketArray[0];
      }
      if (this.SelectedUnderlyingBasketArray[1] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingTwo = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingTwo = this.SelectedUnderlyingBasketArray[1];
      }
      if (this.SelectedUnderlyingBasketArray[2] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingThree = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingThree = this.SelectedUnderlyingBasketArray[2];
      }
      if (this.SelectedUnderlyingBasketArray[3] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingFour = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingFour = this.SelectedUnderlyingBasketArray[3];
      }
      if (this.SelectedUnderlyingBasketArray[4] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingFive = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingFive = this.SelectedUnderlyingBasketArray[4];
      }

    } catch (error) {

    }
  }


  // START : field value set and reset as per coupon type Pranav D BBVACLI-261
  cpnTypeChange(cpnType: any) {

    try {
      // this.reset();


      if (cpnType === 'Fixed') {
        if (this.SolveForvalue === 'Coupon') {
          this.Spread = '';
          this.noOfPeriods = '';
          this.floatingRef = '';
          this.Fixedrate = '';

          if (this.format === 'Swap') {
            this.Upfront !== '' ? this.Upfront : '0.00';
            this.issuePrice = '';
          } else {
            this.IBPrice !== '' ? this.IBPrice : '99.50';
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }

          this.cpnFreq = '3m'; //Comment by Anubhav Goyal | BBVAEPCLI-343 | 07-02-2023
          this.cpnBasis = '30/360';
        } else if (this.SolveForvalue === 'Reoffer') {

          if (this.Spread !== '') {

          } else {
            this.Spread = '5.00';
          }
          this.noOfPeriods = '';
          this.floatingRef = '';
          this.Fixedrate = '';
          this.IBPrice = '';
          // this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';

          if (this.format === 'Swap') {
            this.issuePrice = '';
          } else {
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }

          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';
        }
      }
      else if (cpnType === 'Floating') {
        // if (cpnType === 'Floating'){
        this.Fixedrate = '';
        // }
        if (this.SolveForvalue === 'Coupon') {

          this.Spread = '';
          this.noOfPeriods = '';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          // this.IBPrice = (this.format === 'Swap' ) ? this.upfront : this.IBPrice;
          if (this.format === 'Swap') {
            this.Upfront !== '' ? this.Upfront : '0.00';
            this.issuePrice = '';
          } else {
            this.IBPrice !== '' ? this.IBPrice : '99.50';
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';
        }
        else if (this.SolveForvalue === 'Reoffer') {
          this.noOfPeriods = '';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          this.IBPrice = '';

          if (this.format === 'Swap') {
            this.issuePrice = '';
          } else {
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }
          // this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';

          // this.Fixedrate = this.Fixedrate !== '' ? this.Fixedrate : '5.00' ; 
          //  
          this.Spread = this.Spread !== '' ? this.Spread : '5.00';
          if (cpnType === 'Fixed-Float' || cpnType === 'Float-Fixed') {
            this.noOfPeriods = this.noOfPeriods !== '' ? this.noOfPeriods : '1';
          }
        }
        /*
        else {
          this.cpnSpread = this.cpnSpread !== '' ? this.cpnSpread : '5.00';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          if(this.format === 'Swap') {
            this.upfront !== '' ? this.upfront : '0.00' ;
          } else {
            this.IBPrice !== '' ? this.IBPrice : '99.50' ;
          }
          this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';
        }
        */
      }
      else if (cpnType === 'Fixed-Float' || cpnType === 'Float-Fixed') {

        if (this.SolveForvalue === 'Coupon') {
          this.Spread = '';
          this.noOfPeriods = '';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          if (this.format === 'Swap') {
            this.Upfront !== '' ? this.Upfront : '0.00';
            this.issuePrice = '';
          } else {
            this.IBPrice !== '' ? this.IBPrice : '99.50';
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';
          if (cpnType === 'Fixed-Float' || cpnType === 'Float-Fixed') {
            this.noOfPeriods = this.noOfPeriods !== '' ? this.noOfPeriods : '1';
            this.Fixedrate = this.Fixedrate !== '' ? this.Fixedrate : '5.00';
          }
        } else if (this.SolveForvalue === 'Reoffer') {
          this.noOfPeriods = '';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          this.IBPrice = '';

          if (this.format === 'Swap') {
            this.issuePrice = '';
          } else {
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';

          this.Fixedrate = this.Fixedrate !== '' ? this.Fixedrate : '5.00';
          //  
          this.Spread = this.Spread !== '' ? this.Spread : '5.00';
          if (cpnType === 'Fixed-Float' || cpnType === 'Float-Fixed') {
            this.noOfPeriods = this.noOfPeriods !== '' ? this.noOfPeriods : '1';

          }

        } else if (this.SolveForvalue === 'FixedRate') {
          this.Spread = this.Spread !== '' ? this.Spread : '5.00';
          this.cpnFreq = '3m';
          this.changeFloatingrefonFreq(this.cpnFreq);
          if (this.format === 'Swap') {
            this.Upfront !== '' ? this.Upfront : '0.00';
            this.issuePrice = '';
          } else {
            this.IBPrice !== '' ? this.IBPrice : '99.50';
            this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
          }
          this.cpnFreq = '3m';
          this.cpnBasis = '30/360';

          if (cpnType === 'Fixed-Float' || cpnType === 'Float-Fixed') {
            this.noOfPeriods = this.noOfPeriods !== '' ? this.noOfPeriods : '1';
            this.Fixedrate = '';
          }
        }
      } else if (cpnType === 'UpFront') {
        this.Spread = '';
        this.cpnFreq = '';
        //this.changeFloatingrefonFreq(this.cpnFreq);
        this.IBPrice = '';
        // this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
        if (this.format === 'Swap') {
          this.issuePrice = '';
        } else {
          this.issuePrice = this.issuePrice !== '' ? this.issuePrice : '100.00';
        }
        this.noOfPeriods = '';
        this.Fixedrate = '';
        this.cpnBasis = '';
        this.floatingRef = '';
        this.cpnFreq = '';
        this.cpnBasis = '';
      }
    } catch (error) {

    }
  }
  // END : field value set and reset as per coupon type Pranav D BBVACLI-261

  // setFundFreq(cpnType) {
  //   try {
  //     if (cpnType === 'Fixed') {
  //       this.floatingRef = '';
  //     } else {
  //       this.floatingRef = this.floatingRefArr[0].Code;
  //     }
  //   } catch (error) {

  //   }
  // }

  async txtTenorDateChange(type: any) {
    try {
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      let strDate = '';
      this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
      this.priceBtnActive = 'Y'; //ApurvaK 
      //if (type === 'Payment') {
        this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (this.Dates && this.Dates.MaturityDate !== "") {
          strDate = this.eccommon.formatDate(this.Dates.MaturityDate);
        }

        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        // }
        //console.log('today', this.todayDate);
        //if (this.paymentshift !== 'Custom') {
        this.settdate = strDate;
        //}

        // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        // if (this.Dates) {
        //   this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // }
        
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      //}
      //if (type === 'Expiry') {
        this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (this.Dates) {
          strDate = this.eccommon.formatDate(this.Dates.MaturityDate);
        }
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.expdate = strDate;
      //}
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (document.getElementById('txtstkdate')) {
          document.getElementById('txtstkdate').classList.add('error');
        }
        return false;
      }
      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (document.getElementById('txtsettdate')) {
          document.getElementById('txtsettdate').classList.add('error');
        }
        this.ErrorMsg = 'Please select valid payment date.';
        $('<div class="error-input" style="left:150px"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }



  priceOptions() {
    try {
      this.priceoptionflag = !this.priceoptionflag;
    } catch (error) {

    }
    return false;
  }


  showSchedulePopup() {
    try {
      this.ErrorMsg = '';
      this.scheduleMsg = '';
      this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.showSchedulePopupFlag = !this.showSchedulePopupFlag;
        this.today();
        if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
          this.scheduleFreq = this.scheduleFreqArr[0].misc1;
        }


        if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
          this.scheduleType = this.scheduleTypeArr[0].misc1;
        }
        this.scheduleTypeChange();
      }
    } catch (error) {

    }
    return false;
  }

  saveOptions() {
    try {
      this.saveoptionflag = !this.saveoptionflag;
    } catch (error) {

    }
  }

  showsaveSharePopup() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.showsaveSharePopupFlag = !this.showsaveSharePopupFlag;
        // const res = this.apifunctions.GetMappedUsersAndGroups();
        // this.users = this.apifunctions.GetMappedUsersAndGroups();

        //  
        //  
        this.currentowner = (this.commonfunctions.getLoggedInUserName());
      }

    } catch (error) {

    }
    return false;
  }

  removeShare(rownumber: any) {
    try {
      this.ShareBasket.splice(rownumber, 1);
      this.SelectedUnderlyingarray.splice(rownumber, 1);
      this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
      this.updateShareBasket();
      this.reset();
      // this.stkshift = this.apifunctions.GetNumberOfBusinessDays(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), this.stkdate, this.Exchange()) + 'B';
      // this.paymentshift = this.apifunctions.GetNumberOfBusinessDays(this.stkdate, this.settdate, this.ddlNoteCcy) + 'B';
      // changed by Suvarna P || 24May2022 ||  BBVACLI-271 || issue-date shifter changing on adding and removing share reported by Abeer J || assigned by Pranav D
      this.paymentshift = this.apifunctions.GetNumberOfBusinessDays(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), this.settdate, this.ddlNoteCcy) + 'B'
      this.infoMsg = '';

      // START : BBVAEPCLI-325 Vaibhav B 17-jan-2023 recovery type dropdown value was changing after underlying removal thtas why if condition added to check 
      //  basket length and value as per underying additin condition
      if (this.ShareBasket.length === 1) {
        this.fillRecoveryTypeArr();
        //this.fillSettlemetTypeArr();
      }
      // END : BBVAEPCLI-325 Vaibhav B 17-jan-2023
    }


    catch (error) {

    }

  }

  fundTypeChange(fundType: string) {
    try {
      if (fundType === 'Fixed Rate') {
        this.fundFreq = '1m';
        this.fundingbasis='30/360' // BBVAEPCLI-679 New Credit Fields: UI changes || RadhaM || 28thAugust23
      } else {
        this.fundFreq = '3m';
        this.fundingbasis='Act/360' // BBVAEPCLI-679 New Credit Fields: UI changes || RadhaM || 28thAugust23
        // <!-- Added by RiddhiP || 9-OCT-23 || BBVAEPCLI-728 || Funding Index missing for Swap format for CLN and CLI -->
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          this.fundIndex = this.floatingRefArr[0].Code;
  
        }
        this.setFundFreq(this.fundIndex);
      }

    } catch (error) {

    }
  }
  setFundFreq(fundIndex: any) {
    //START : if condition for 1m added by Pranav D 16-Aug-2013 BBVAEPCLI-610 as per changed index with 1M as frequency code changes done
    if (fundIndex.includes('1m') || fundIndex.includes('1M')) {
      this.fundFreq = '1m';
    }
    //END : if condition for 1m added by Pranav D 16-Aug-2013 BBVAEPCLI-610 as per changed index with 1M as frequency code changes done
    else if (fundIndex.includes('3m') || fundIndex.includes('3M')) {
      this.fundFreq = '3m';
    } else if (fundIndex.includes('6m') || fundIndex.includes('6M')) {
      this.fundFreq = '6m';
    } //Added Condition to check fundIndex if sonia or sofr or saron, set freq as 3m | Anubhav Goyal | 13-Sep-2023 | BBVAEPCLI-610
   // Suvarna P || 22Sep23 || BBVAEPCLI-610 || IR Index on ePricer for Credit Products || issue- cpnFreq always 1m in pricing xml
   // else if (this.fundIndex == 'SONIA' || this.fundIndex == 'SOFR' || this.fundIndex == 'SARON') {
    else if (fundIndex == 'SONIA' || fundIndex == 'SOFR' || fundIndex == 'SARON') {
      this.fundFreq = '3m';
    } else {

    }
  }

  currencyChange() {
    try {
      this.reset();
      // 
      this.floatingRefArr = [];
      //this.fundIndex = '';
      this.floatingRef = '';
      if (this.ddlNoteCcy === 'MXN') {
        this.Notional = '10,000,000';
      }
      this.checkNotionalRes = this.apifunctions.BBVACheckNotional('CreditTranche', this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes !== '' && this.checkNotionalRes.length > 0) {
        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
          document.getElementById('txtnotional')!.classList.add('error');
          this.ErrorMsg = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          document.getElementById('txtnotional')!.focus();

        } else {
          document.getElementById('txtnotional')!.classList.remove('error');
        }
      }
      if (!(this.Notional + '').includes(',')) {
        this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      this.floatingRefArr = this.floatingRefAll.filter((d: { Ccy: any; }) => d.Ccy === this.ddlNoteCcy);
      if (this.floatingRefArr && this.floatingRefArr.length > 0) {
        if (this.cpnType !== 'Fixed') {
          // this.floatingRef = this.floatingRefArr[0].Code;
          this.changeFloatingrefonFreq(this.cpnFreq);
        } else {
          this.floatingRef = '';
          //this.floatingRefArr = [];
        }

      }

      //this.changeFreq();//Anubhav Goyal | BBVAEPCLI-343

      this.txtTenorChangeCcy(this.paymentshift, 'Payment')
      this.fetchMaturityDateBasedOnTenor();
      // this.setFundFreq(this.fundIndex)

    } catch (error) {

    }
    return false;

  }
  // async currencyChange() {
  //   try {
  //     this.reset();
  //     let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
  //     this.checkNotionalRes = await this.echome.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', this.ddlNoteCcy);
  //     if ((this.Notional + '').includes(',')) {
  //       this.Notional = this.Notional.replace(/,/g, '');
  //     }
  //     if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {
  //       if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
  //         || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
  //         document.getElementById('txtnotional').classList.add('error');
  //         this.ErrorMsg = 'You must enter a number from '
  //           + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //           + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
  //         document.getElementById('txtnotional').focus();
  //         $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#txtnotional")
  //         $('.validate-popup').delay(5000).fadeOut('slow');
  //       } else {
  //         document.getElementById('txtnotional').classList.remove('error');
  //       }
  //     }
  //     if (!(this.Notional + '').includes(',')) {
  //       this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //     }

  //     this.priceBtnActive = 'Y'; //ApurvaK 

  //     this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
  //     if (this.Dates) {
  //       this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);
  //     }

  //     this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
  //     if (this.Dates) {
  //       this.expdate = this.eccommon.formatDate(this.Dates.MaturityDate);
  //     }

  //     if (this.SelectedUnderlyingBasketArray.length > 0) {


  //       //this.quanto = 'No';
  //       // for (let i = 0; i < this.SelectedUnderlyingBasketArray.length; i++) {
  //       //   if (this.ddlNoteCcy !== this.SelectedUnderlyingBasketArray[i]['Ccy']) {
  //       //     this.quanto = 'Yes';
  //       //   }
  //       // }

  //     }


  //   } catch (error) {
  //     //console.log('Error', error);
  //   }
  //   return false;
  // }

  chngPriceChkBox(i) {
    this.priceProvidersArr[i].priceChkFlg = !this.priceProvidersArr[i].priceChkFlg
  }

  changeFreq() {
    try {
      this.reset();
      if (this.floatingRef !== '') {
        // new if condition for 1m added by Pranav D || BBVAEPCLI-610 || 16-Aug-2023 as per chaged requirement.
        if (this.floatingRef.includes('1M')) {
          this.cpnFreq = '1m';
        }
        else if (this.floatingRef.includes('3M')) {
          this.cpnFreq = '3m';
        } else if (this.floatingRef.includes('6M')) {
          this.cpnFreq = '6m';
        } else if (this.floatingRef.includes('12M')) {
          this.cpnFreq = '12m';
        } else {
          this.cpnFreq = '1m';
        }
      } else {
        if (this.cpnType === 'Floating') {
          this.cpnFreq = '';
        } else {
          this.cpnFreq = '1m';
        }

      }

    } catch (error) {

    }
  }

  // START : settlementtype function Pranav D BBVACLI-176
  fillSettlemetTypeArr() {

    try {
      if (this.recoveryType === 'Market Recovery') {
        this.settlementTypeArr = [];
        if (this.ShareBasket.length > 1) {
          this.settlementTypeArr.push({'Key':'European','Value':'European'});
        } else {
          this.settlementTypeArr.push({'Key':'European','Value':'European'},{'Key':'American','Value':'American'});
        }
        // 
        this.settlementType = this.settlementTypeArr[0].Key;
      } else {
        this.settlementTypeArr = [];
        this.settlementTypeArr.push({'Key':'American','Value':'American'});
        this.settlementType = 'American';
        // 
        this.settlementType = this.settlementTypeArr[0].Key;
      }

    } catch (error) {

    }
  }
  // END : settlementtype function Pranav D BBVACLI-176

  fillRecoveryTypeArr() {
    try {
      if (this.ShareBasket.length > 1) {
        this.recoveryTypeArr = [];
        this.recoveryTypeArr.push('Market Recovery');
        // 
        this.recoveryType = this.recoveryTypeArr[0];
      } else {
        this.recoveryTypeArr = [];
        this.recoveryTypeArr.push('Market Recovery', 'Zero Recovery');
        // 
        this.recoveryType = this.recoveryTypeArr[0];
      }
    } catch (error) {

    }
  }

  fetchMaturityDateBasedOnTenor() {
    try {
      // added by Suvarna P || 19Aug2022 ||  BBVAEPCLI-57- CLN- new specs for Notes and Swaps date || assigned by Pranav || start
      // this.maturityDate = this.apifunctions.GetCLNMaturityDate(this.format, this.Tenor, this.settdate);
      // this.maturityDate = this.commonfunctions.formatDate(this.maturityDate);
      var londonDate = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
      londonDate = londonDate.split(',')[0];
      // var date2 = date1.replace(/\//g, "-");
      var londonDateFormatted = londonDate.split('/')[2] + "-" + londonDate.split('/')[1] + "-" + londonDate.split('/')[0];
      //  
      this.maturityDate = this.apifunctions.GetCLNMaturityDate(this.format, this.Tenor, londonDateFormatted);
      this.maturityDate = this.commonfunctions.formatDate(this.maturityDate);
      // added by Suvarna P || 19Aug2022 ||  BBVAEPCLI-57- CLN- new specs for Notes and Swaps date || assigned by Pranav || end
    } catch (error) {

    }
  }
  /*
    txtTenorChange(e, type: any) {
      try {
  
        const target = this.commonfunctions.GetEventTarget(e);
        const today = new Date();
        let strDate = '';
        const dayCount = 0;
        if (target.value === undefined || target.value === '') {
          if (type === 'Payment') {
            target.value = '10B';
            this.paymentshift = '10B';
          }
        } else if (target.value.length === 1) {
          if (isNaN(target.value)) {
            target.value = '0' + target.value;
          } else {
            target.value = target.value + 'D';
          }
        } else if (target.value.length > 1 && target.value.length <= 3) {
          if (Number(target.value)) {
            target.value = target.value + 'D';
          }
        }
  
        const str = target.value + '';
        // Commented as no validation required on Tenor field Pranav D 6-May-2022
        // if (str.substr(str.length - 1, 1).toUpperCase() === 'M') {
        //   // tslint:disable-next-line: radix
        //   if ((parseInt(str.substr(0, str.length - 1)) / 12) > 6) {
        //     this.ErrorMsg = 'Please enter valid date shifter.';
        //     return false;
        //   }
        // }
        // if (str.substr(str.length - 1, 1).toUpperCase() === 'Y') {
        //   // tslint:disable-next-line: radix
        //   if (parseInt(str.substr(0, str.length - 1)) > 6) {
        //     this.ErrorMsg = 'Please enter valid date shifter.';
        //     return false;
        //   }
        // }
  
        if (type === 'Payment') {
          this.paymentshift = target.value;
          this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), '');
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          this.settdate = strDate;
        }
  
        // this.txtTenorChangeCcy(this.paymentshift, 'Payment')
  
      } catch (error) {
         
      }
    }
    */

  txtTenorChangeCcy(paymentshift: any, type: any) {
    try {

      //const target = this.commonfunctions.GetEventTarget(e);
      const today = new Date();
      let strDate = '';
      const dayCount = 0;
      if (paymentshift === undefined || paymentshift === '') {
        if (type === 'Payment') {
          paymentshift = '10B';
          this.paymentshift = '10B';
        }
      } else if (paymentshift.length === 1) {
        if (isNaN(paymentshift.value)) {
          paymentshift = '0' + paymentshift;
        } else {
          paymentshift = paymentshift + 'D';
        }
      } else if (paymentshift.length > 1 && paymentshift.length <= 3) {
        if (Number(paymentshift)) {
          paymentshift = paymentshift + 'D';
        }
      }

      const str = paymentshift + '';

      if (type === 'Payment') {
        this.paymentshift = paymentshift;
        this.Dates = this.echome.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), '');
        strDate = this.eccommon.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        this.settdate = strDate;
      }
    } catch (error) {

    }
  }

  setIssueDate(paymentshift: any) {
    try {
      this.paymentshift = paymentshift;
      this.Dates = this.echome.BBVAGetDates(this.ddlNoteCcy, paymentshift, '');
      this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);
      // this.maturityDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
    } catch (error) {

    }
  }

  async fnGetProdTemplate() {
    try {
      // add by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || common service for all products || assigned by Pranav D
      this.templateMappingArr = await this.echome.fnGetProdTemplate('CreditLinkedNote');
      // const webMethod = this.interfaceUrl + 'PHXAutocallableTemplate';
      // const that = this;
      // const parameters = {
      //   Product: 'CreditlinkedNote'
      // };

      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: this.apifunctions.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

      //   success(data: any) {
      //     if (data) {
      //       that.templateMappingArr = data;
      //     }
      //   },
      //   error(error: any) {
      //     console.error(error);
      //   }
      // });
    } catch (error) {

    }

  }

  async Price() {
    try {
      //  
      // this.cpnTypeChange(this.cpnType);
      await this.validationOnButton();
      // this.validationCheckBeforePrice();
      // this.checkAttachDetachPercent();
     // this.shareweightcalc();
      if (this.ErrorMsg === '') {
        this.reset();
        this.priceBtnActive = 'N' //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
        this.loadflag = true;
        //this.pageloadflag=false;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
        this.portfolioGroupID = await this.echome.fnportfolioGroupID();
        let RFQTimeFlag = true;
        // RFQTimeFlag = this.apifunctions.BBVAValidateRFQTime(this.indexTranche);
        if (!this.priceClickFlag) {
          this.CreditLinkedNotePrice('All', "0", 'N');
        }
      }
      return false;
    } catch (error) {

    }
  }

  async PriceLP(LP) {
    try {
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });

      this.validationOnButton();

      if (this.ErrorMsg === '' && this.ErrorMsg === '') {

        this.priceProvidersArr.forEach(item=>{
          if(item.lp == LP){
            this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = true
          }
          else{
            this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
          }
        })

        this.reset();
        this.loadflag = true;

        this.portfolioGroupID = await this.echome.fnportfolioGroupID();
        // //console.log(this.priceProvidersArr);

        if (!this.priceClickFlag) {

          if (this.sendtocptyflag) {

            this.priceProvidersArr = [];
            const res: any = await this.echome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].template : 'CreditLinkedNote');
            for (let i = 0; i < res.length; i++) {
              if (res[i] === res[i]) {
                this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '',  TSLoadFlag: false, KIDLoadFlag: false, ViewKIDFlag: false,ViewTSFlag: false, TSDisableFlag:false, KidDisableFlag:false});//Added by Apurva K|| 02-May-2023

              }
            }
            await this.CreditLinkedNotePrice(LP, this.viewRFQID, 'Y');
          }
          else {
            await this.CreditLinkedNotePrice(LP, "0", 'N');
          }


        }
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  // shareweightcalc() {
  //   if (this.upsideType === 'Call Custom Basket') {
  //     this.ErrorMsg = '';
  //     let sum = 0;
  //     for (let i = 0; i < this.ShareBasket.length; i++) {
  //       if (this.ShareBasket[i].Weight === '' || parseFloat(this.ShareBasket[i].Weight) === 0.00) {
  //         this.ErrorMsg = "Underlying weights cannot be blank or zero.";
  //       }

  //       sum = sum + parseFloat(this.ShareBasket[i].Weight);
  //     }
  //     //console.log(sum);

  //     if (sum > 100) {
  //       this.ErrorMsg = "Error: The sum of weights is not 100%";
  //     }
  //   }

  // }

  async generateXML() {
    try {

      //console.log(this.templateMappingArr,"Hello 123");
    if (this.templateMappingArr && this.templateMappingArr?.length > 0) {
    // 
    let xmlstr = '<QuoteRequest>';
    // tslint:disable-next-line: forin
    this.templateName = this.templateMappingArr[0].template;
    for (const i in this.templateMappingArr) {
      switch (this.templateMappingArr[i].email_Header) {

        case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'cpnType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'floatingRef': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.floatingRef) ? this.floatingRef : '')
          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'reofferPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.format === 'Note') ? this.IBPrice : this.Upfront) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IndexTranche': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.indexTranche) ? this.indexTranche : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'cpnFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Spread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.Spread) ? this.Spread : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
          case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy')
          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'maturityDate':
          xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy')
            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.expshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'cpnBasis': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnBasis + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IssueDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.settdate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'fundType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.format === 'Swap' ? this.fundType : '')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'fundFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.fundFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'fundRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.format === 'Swap') ? this.fundRate : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + (this.paymentshift === 'Custom' ? (this.customSetDate) : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + AppConfig.settings.oRes.homeEntityID
          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'recoveryType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.recoveryType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'settlementType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.settlementType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'fundIndex': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + '' + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // case 'maturityDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
        //   + this.maturityDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
        //   break;
        case 'AtachPer': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.AttachPer + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'DetachPer': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.DetachPer + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'ReferenceEntity': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.ShareBasket.length > 0 && this.ShareBasket[0]) ? (this.ShareBasket[0].LongName.includes("&") ? this.ShareBasket[0].LongName.replace("&", "&amp;") : this.ShareBasket[0].LongName) : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'ReferenceEntity2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.ShareBasket.length > 0 && this.ShareBasket[1]) ? (this.ShareBasket[1].LongName.includes("&") ? this.ShareBasket[1].LongName.replace("&", "&amp;") : this.ShareBasket[1].LongName) : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'ReferenceEntity3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.ShareBasket.length > 0 && this.ShareBasket[2]) ? (this.ShareBasket[2].LongName.includes("&") ? this.ShareBasket[2].LongName.replace("&", "&amp;") : this.ShareBasket[2].LongName) : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'ReferenceEntity4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.ShareBasket.length > 0 && this.ShareBasket[3]) ? (this.ShareBasket[3].LongName.includes("&") ? this.ShareBasket[3].LongName.replace("&", "&amp;") : this.ShareBasket[3].LongName) : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'ReferenceEntity5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.ShareBasket.length > 0 && this.ShareBasket[4]) ? (this.ShareBasket[4].LongName.includes("&") ? this.ShareBasket[4].LongName.replace("&", "&amp;") : this.ShareBasket[4].LongName) : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        // & checked while sending xml for pricing by replacing & with amp; Pranav D BBVACLI-237
        case 'FirstNPeriods': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.noOfPeriods) ? this.noOfPeriods : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'FixedRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.Fixedrate) ? this.Fixedrate : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IndicativeOrFirm': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          // BBVAEPCLI-414 tag manipulation as per normal price or add to watchlist Pranav D if add to watchlist hard coded Ind as asked by BBVA
          + (!this.isAddToWatchlist ? ((this.IndicativeOrFirm) ? this.IndicativeOrFirm : '') : 'Ind') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'FirstLongCpn': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnFirst + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
          case 'CapFloorYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.capfloorYN : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'InputCap': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.cappercent : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'InputFloor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.floorpercent : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
      }

    }

    xmlstr += '</QuoteRequest>';
    return xmlstr;
  }else {
    return '';
  }
 } catch (error) {
    //console.log('Error' + error);
  }
}


  async CreditLinkedNotePrice(LPVal, NMID, repriceFlg) {
    try {
      // $(document).bind("ajaxStart", () => {
      //   $("#loading").hide();
      // });
      var LP = '';
      // if (LPVal == 'All') {
      //   let isPriceFlgChk = this.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
      //   if (isPriceFlgChk == -1) {
      //     this.priceProvidersArr.forEach(item => {
      //       let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
      //       this.priceProvidersArr[idx].loadFlag = true
      //     });
      //     LP = '';
      //   } else {
      //     this.priceProvidersArr.forEach(item => {
      //       if (item.priceChkFlg) {
      //         let idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
      //         this.priceProvidersArr[idx].loadFlag = true;
      //         LP = LP + item.lp + ',';
      //       }
      //     });
      //     let lastCharater = LP.split('').pop();
      //     if (lastCharater == ',')
      //       LP = LP.substring(0, LP.length - 1);
      //   }
      // }
      // else {
      //     let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
      //     if (idx > -1) {
      //       this.priceProvidersArr[idx].loadFlag = true
      //     }
      //   LP = LPVal;
      // }

      var LP = '';
      if (LPVal == 'All') {
        let isPriceFlgChk = this.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
        if (isPriceFlgChk == -1) {
          this.priceProvidersArr.forEach(item => {
            let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
            this.priceProvidersArr[idx].loadFlag = true
          });
          LP = '';
        } else {
          this.priceProvidersArr.forEach(item => {
            if (item.priceChkFlg) {
              let idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
              this.priceProvidersArr[idx].loadFlag = true;
              LP = LP + item.lp + ',';
            }
          });
          let lastCharater = LP.split('').pop();
          if (lastCharater == ',')
            LP = LP.substring(0, LP.length - 1);
        }
      }
      else {
          let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
          if (idx > -1) {
            this.priceProvidersArr[idx].loadFlag = true
          }
        LP = LPVal;
      }
      this.priceClickFlag = true;
      const requestXML = await this.generateXML();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: 'CreditLinkedNote',//this.templateName,
        subTemplateCode: 'CreditLinkedNote',
        LP: LP,
        requestXML,
        solveFor: this.SolveForvalue,
        loginID: AppConfig.settings.oRes.userID,
        userGroupID: AppConfig.settings.oRes.groupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        noteMasterID: NMID,
        repricereqYN: repriceFlg
      }];

      // Start - Apurva K || 11-Oct-2023
      await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.loadflag = false;
        // debugger;
        if (LPVal == 'All') {
          let isPriceFlgChk = that.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
          if (isPriceFlgChk == -1) {
            that.priceProvidersArr.forEach(item => {
              let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
              //that.priceProvidersArr[idx].loadFlag = true
              that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);

            });
          } else {
            that.priceProvidersArr.forEach(item => {
              if (item.priceChkFlg) {
                let idx = that.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
                //that.priceProvidersArr[idx].loadFlag = true;
                that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
              }
            });
          }
        }
        else {
          let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
          if (idx > -1) {
            //that.priceProvidersArr[idx].loadFlag = true // Added by Jyoti S || 02-May-2023
            that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
          }
        }
      if (data.errorMessage !== '' || !that.pageActive) {
            that.ErrorMsg = data.errorMessage.split('. ')[0];
            //that.loadflag = false;
            that.timeLeft = 0;
            this.priceBtnActive = 'Y'

            this.priceProvidersArr.forEach(item=>{
              this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
            })

            for (let i = 0; i < that.priceProvidersArr.length; i++) {
              that.priceProvidersArr[i].timer = '';
              clearInterval(that.priceProvidersArr[i].interval1);
              // this.priceProvidersArr[index].price = 'Timeout';
              that.priceProvidersArr[i].timeStartFlag = false;
            }
            return false;
          }
          that.rfqID = data.rfqid;
          that.noteMasterID = data.noteMasterID;
          if (!that.clearFlag) {
            that.Prices = [];
            that.timeLeft = that.defaultRFQTimeout;
            that.PPDetails = that.rfqID;
            if (that.PPDetails !== '') {
              that.priceClickFlag = false;
              if (data.rfqPPid !== '') {
                const rfqPPID = data.rfqPPid.split(',');
                for (let k = 0; k < rfqPPID.length; k++) {
                  if (rfqPPID[k].toString().includes(':')) {
                    const splitRFQID = rfqPPID[k].split(':');
                    const index = that.priceProvidersArr.findIndex(res => res.lp === splitRFQID[0].toString().trim());
                    if (index > -1) {
                      that.priceProvidersArr[index].rfq = splitRFQID[1];
                    }
                  }

                }
              }
            let quoteResponseCheck = false;
            console.log(this.timeLeft,"timeleft")
            console.log(this.defaultRFQTimeout,"that.defaultRFQTimeout")
              that.interval = setInterval(async () => {

                if (that.timeLeft > 0) {
                  that.timeoutMsg = '';
                if (!quoteResponseCheck) {
                  quoteResponseCheck = await that.ERPriceResponse(that.PPDetails);
                }

                  that.timeLeft = that.timeLeft - 5;
                } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                  //that.loadflag = false;
                  // that.timeoutMsg = 'Timeout';
                  clearInterval(that.interval);

                }

              }, 5000);
            }
          }
      });
      //End - Apurva K || 11-Oct-2023

      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: this.apifunctions.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

      //   success(data: { errorMessage: string; rfqid: any; }) {
      //     if (data.errorMessage !== '') {
      //       that.ErrorMsg = data.errorMessage.split('. ')[0];
      //       that.loadflag = false;
      //       return;
      //     }
      //     that.rfqID = data.rfqid;
      //     if (!that.clearFlag) {
      //       that.Prices = [];
      //       that.timeLeft = that.defaultTimeout;
      //       that.PPDetails = that.rfqID;
      //       if (that.PPDetails !== '') {
      //         that.interval = setInterval(() => {
      //           if (that.timeLeft > 0) {
      //             $("#loading").hide();
      //             that.CreditTranchePriceResponse(that.PPDetails);
      //             that.timeLeft = that.timeLeft - 5;
      //           } else if ((that.timeLeft === 0)) {
      //             that.loadflag = false;
      //             that.timeoutMsg = 'Timeout';
      //             clearInterval(that.interval);
      //             // tslint:disable-next-line: max-line-length
      //             that.ErrorMsg = 'Price response is taking longer than expected hence price will not display on this screen. \nInstead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section and by email.';

      //           }
      //         }, 5000);
      //       }
      //     }
      //   },
      //   error(error: any) {
      //     console.error(error);
      //   }
      // });
    } catch (error) {

    }
  }

  CreditTranchePriceResponse(PPDetails: any) {
    try {

      $(document).bind("ajaxStart", () => {
        $("#loading").hide();
      });

      const webMethod = this.interfaceUrl + 'PHXAutocallablePriceResponse';
      const that = this;
      const parameters = {
        rfqID: PPDetails,
        SolveFor: this.SolveForvalue
      };
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: this.apifunctions.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

        success(data: never[]) {
          that.Prices = data;
          that.commonfunctions.setCLNReceivedPrices(that.Prices, 1);
        },
        error(error: any) {
          console.error(error);
        }
      });
    } catch (error) {

    }
  }

  validationOnButton() {
    try {
      this.ErrorMsg = ''
      if (this.ShareBasket.length <= 0) {
        this.ErrorMsg = 'Reference entity cannot be blank.'
        if (this.ErrorMsg !== '') {
          document.getElementById('txtShare')!.classList.add('error');
          return false;
        } else {
          document.getElementById('txtShare')!.classList.remove('error');
        }

      }
      if (this.Tenor != '' && this.cpnFreq != '' && (this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed')) {
        var TenorInMonth = parseFloat(this.Tenor.split('Y')[0]) * 12;

        var cpnInMonth = parseFloat(this.cpnFreq.split('m')[0]);
        var maxNoOfPeriods = TenorInMonth / cpnInMonth;
        // if (this.FirstNPeriods > maxNoOfPeriods) {
        if (this.noOfPeriods > maxNoOfPeriods) {
          this.ErrorMsg = 'Please enter valid First number of periods.'
          document.getElementById('txtnoOfPeriods')!.classList.add('error');
          return false;
        } else {
          document.getElementById('txtnoOfPeriods')!.classList.remove('error');
        }
      }
      // START : Notional validation Pranav D BBVACLI-174
      if (this.Notional !== 0 || this.Notional !== undefined) {
        // if (this.ddlNoteCcy === 'SEK') {
        //   if (parseFloat(this.Notional.replace(/,/g, '')) < 2500000)
        //     this.ErrorMsg = 'Minimum notional is 2,500,000';
        //   return false;
        // } else {
        //   if (parseFloat(this.Notional.replace(/,/g, '')) < 250000)
        //     this.ErrorMsg = 'Minimum notional is 250,000';
        // }
        //START : Condition changed by Pranav D as per BBVAEPCLI-621, condition will be verified as per DB values so above condition removed
        if (parseFloat(this.Notional.replace(/,/g, '')) < this.checkNotionalRes[0].Minimum || parseFloat(this.Notional.replace(/,/g, '')) > this.checkNotionalRes[0].Maximum) {
          this.ErrorMsg = 'Minimum and maximum allowed notional is ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return false;
        }
        //END : Condition changed by Pranav D as per BBVAEPCLI-621, condition will be verified as per DB values so above condition removed
        if (this.ErrorMsg !== '') {
          document.getElementById('txtnotional')!.classList.add('error');
        } else {
          document.getElementById('txtnotional')!.classList.remove('error');
        }
      }
      // END : Notional validation Pranav D BBVACLI-174
      // else {
      //   this.reset();
      // }


    } catch (error) {

    }
  }

  maturityDateDisable() {
    try {
      if (this.format === 'Swap') {
        const d1 = new Date(this.maturityDate);

        this.dateToday = this.datepipe.transform(d1, 'yyyy-MM-dd');
        this.dateToday20 = this.datepipe.transform(d1.setDate(d1.getDate() + 20), 'yyyy-MM-dd');

      } else {

      }

    } catch (error) {

    }
  }

  fnGetValidation() {
    try {
      this.validationArr = this.echome.validationArr;
      //console.log('validation arr', this.validationArr)
      if (this.validationArr) {
        for (let i = 0; i < this.validationArr?.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
            
            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultRFQTimeout = this.validationArr[i].Default_Value;
              console.log(this.defaultRFQTimeout,"defaultRFQTimeout");
              break;

            case 'EQ_OrderValidityTimer_Ang':
                this.defaultOrderTimeout = this.validationArr[i].Default_Value;
                break;
            case 'EQ_DefaultTSTimeOut_Ang':
              this.TSTimeout = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Show_Launch_Button':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_Launch_Button = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Show_Launch_Button = this.validationArr[i].Default_Value;
              }
              break;
            case 'EQ_Show_Order_Button':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_Order_Button = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Show_Order_Button = this.validationArr[i].Default_Value;
              }

              break;

            case 'EQ_Show_Termsheet_Button':
              //console.log("TS button ", this.validationArr[i], this.commonfunctions.getLoggedInUserName()[1].EntityId)
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_Termsheet_Button = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Show_Termsheet_Button = this.validationArr[i].Default_Value;
              }

              break;
              case 'EQ_Show_Order_RM':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_Order_RM = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_Order_RM = this.validationArr[i].Default_Value;
                }
                break;

              case 'EQ_Show_Order_Customer':
                if (this.validationArr[i].Config_Value !== '') {
                  if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                    this.EQ_Show_Order_Customer = this.validationArr[i].Config_Value;
                  }
                } else {
                  this.EQ_Show_Order_Customer = this.validationArr[i].Default_Value;
                }
  
                break;

            // case 'EQ_Show_KID_Button':
            //   if (this.validationArr[i].Config_Value !== '') {
            //     if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
            //       this.EQ_Show_KID_Button = this.validationArr[i].Config_Value;
            //     }
            //   } else {
            //     this.EQ_Show_KID_Button = this.validationArr[i].Default_Value;
            //   }
            //   break;
          }
        }
      }
    } catch (error) {
      //console.log('Error:' + error);
    }
  }


  dateChanged() {
    // this.calendar.activeDate = this.selectedDate;
    this.inputDate = this.selectedDate.format('DD-MMM-YYYY');
    if (this.selectedDate.format('HH:mm') === '00:00') {
      this.inputTime = '09:00';
    } else {
      this.inputTime = this.selectedDate.format('HH:mm');
    }
    this.dateSelected.emit(this.selectedDate);
  }
  prevDay() {
    const prevMoment = moment(this.selectedDate).add(-1, 'days');
    this.selectedDate = prevMoment;
    this.dateChanged();
  }
  today() {
    this.selectedDate = moment();
    this.dateChanged();
  }
  nextDay() {
    const nextMoment = moment(this.selectedDate).add(1, 'days');
    this.selectedDate = nextMoment;
    this.dateChanged();
  }

  scheduleTypeChange() {
    if (this.scheduleType === 'One-Off') {
      this.scheduleFreq = '';
    } else {
      this.scheduleFreq = 'Monthly';
    }

  }

  hideSchedulePopup() {
    try {
      this.showSchedulePopupFlag = false;
    } catch (error) {

    }
    return false;
  }

  scheduleSend() {
    try {
      this.scheduleMsg = '';
      this.ErrorMsg = '';
      if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
        this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
        $('#loading').hide();
        return false;
      } else {
        this.ErrorMsg = '';
      }
      // this.validationOnButton();
      const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.inputTime));
      const today = new Date();
      if (sDate < today) {
        this.ErrorMsg = 'Please enter valid time';
        return false;
      }
      // if (Date.parse(this.issueDate) < Date.parse(this.inputDate)) {
      //   this.ErrorMsg = "Strike date must be greater than schedule date.";
      //   return false;
      // }
      const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
      if (this.ErrorMsg === '') {
        this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
        if (isNaN(this.portfolioGroupID)) {
          this.ErrorMsg = "Price request failed. Please reload the application and try again.";
          return false;
        }
        // BBVAEPCLI-414 flag true when add to watchlist being performed
        this.isAddToWatchlist = true;
        const xmlstr = this.generateXML();
        const res = this.apifunctions.SchedulePrice('CreditLinkedNote', xmlstr,
          sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue,
          this.allBooksData[this.allBooksData.findIndex((x: { BookCode: any; }) => x.BookCode === this.onBehalfOf)].BookName,
          this.IndicativeOrFirm === 'Firm' ? 'CreditLinkedNote' : 'CreditLinkedNote', this.scheduleFreq, this.scheduleType, '');
        if (res) {
          if (res['IsScheduled']) {
            this.scheduleMsg = 'Request scheduled successfully. Req ID: ' + res['PS_ID'];
          }
        }
      }
      // BBVAEPCLI-414 flag false when add to watchlist added
      this.isAddToWatchlist = false;
    } catch (error) {

    }
    return false;
  }

  //  changes by Suvarna P || 20Apr2022 || BBVACLI-188 || CLN: Previous Quotes || start

  // Started-Added by Apurva K|| 11-Oct-2023 
  startCountDown(sec, index) {

    let starttime = new Date().getTime();
    let counter = sec;
    //console.log(this.priceProvidersArr);
    
    this.priceProvidersArr[index].timeStartFlag = true;
    this.priceProvidersArr[index].interval1 = setInterval(() => {
      ////console.log( counter);  
      //<Sudarshan| condition always false | dead code | 30-May-23>
      // if (this.priceProvidersArr.length <= 0) {
      //   console.log('hi1',counter);
      //   clearInterval(this.priceProvidersArr[index].interval1);
      //   this.priceProvidersArr[index].price = 'Timeout';
      // }
      //<Sudarshan| condition always false | 30-May-23>
      if (this.priceProvidersArr[index].price != '-' )  {//Changed by Varsha G || For starting timer after LP quote response received || 12-Apr-2023
        this.priceProvidersArr[index].timer = counter;
        counter--;
       // console.log('hi2',counter);
      }
      if (counter < 0) {
       // if (this.priceProvidersArr[index].price == '-' || this.priceProvidersArr[index].price == '') 
        // {
        //   this.priceProvidersArr[index].price = 'Timeout';
        // }
        clearInterval(this.priceProvidersArr[index].interval1);
        this.priceProvidersArr[index].timeStartFlag = false;
      }
      if (this.timeLeft <= 0 && this.priceProvidersArr[index].price == '-')
      {  
        this.loadflag = false;
        if (this.priceProvidersArr[index].price == '-') 
        {
          this.priceProvidersArr[index].price = 'Timeout';
        }        
        this.priceBtnActive = 'Y'
        this.priceProvidersArr[index].loadFlag = false;
        clearInterval(this.priceProvidersArr[index].interval1);
      }
      // Clear timer if system is on sleep mode - added by Priya L. on 25Mar2022 - assigned by Pranav D.
       let curtime = new Date().getTime();
       let timediff = (curtime - starttime) / 1000;   
      if (timediff !== counter) {
        if ((this.defaultRFQTimeout - timediff) < 0) {
          this.loadflag = false;
          clearInterval(this.interval);
          if (this.priceProvidersArr[index].price == '-') {
            this.priceProvidersArr[index].price = 'Timeout';
          }
          this.priceBtnActive = 'Y'
          this.priceProvidersArr[index].timer = 0 ;
          this.priceProvidersArr[index].loadFlag = false
         
          clearInterval(this.priceProvidersArr[index].interval1);
        }
      }
    }, 1000);

  }
  //End - Added by Apurva K|| 11-Oct-2023

  //Added FirstLongCoupon Parameter | 1-June-2023 | BBVACLI 1125 + BBVACLI 1124 | Anubhav Goyal
  // Suvarna P || 19Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer
  setPrevQuoteData1(cloneData: {
    ReferenceEntity: any[]; ReferenceEntity2: any[]; ReferenceEntity3: any[]; ReferenceEntity4: any[]; ReferenceEntity5: any[];
    InputSettlementCurrency: any[]; InputProductFormatType: any[]; InputRFQNotionalAmount: any[]; InputRFQSolveFor: any[]; InputInterBankPrice: any[];
    InputReofferPrice: any[]; StaticCouponType: any[]; InputFixedCouponFrequency: any[]; InputCouponOrSpreadPercent: any[]; InputCouponDayBasis: any[];
    FixedRate: any[]; InputFloatingIndex: any[]; FirstNPeriods: any[]; CLNType: string[]; StaticFundingType: any[]; StaticFundingFrequency: any[];
    InputFundingRateSpread: any[]; BBVAID: any[]; Status: any[]; InputRecoveryType: any[]; StaticSettlementType: any[]; ComputedSettlementPeriodSoftTenor: any[];
    ComputedTenorValue: any[]; InputMaturityDate: string[]; InputOnBehalfOfBook: any[]; InputIssueDate: string[]; RFQID: any[]; SolveForValue: any[];
    SolveForValue2: any[]; SolveForValue3: any[]; SolveForValue4: any[]; QueueStatus: any[]; FirstLongCoupon: any[]; Actions: any[]; Note_Master_Id: any[];
    InputCap:any[];AccruedCouponYN:any[];CapFloorYN:any[];InputFloor:any[];InputFundingBasis:any[];InputFundingIndex:any[]
  }, viewOnly: boolean,
  ) {
    try {
      this.buttonList = cloneData.Actions[0];

      //this.indexTranche = cloneData.InputCreditIndexTranche[0];
      // BBVAEPCLI-500 Pranav D 18-Apr-2023
      this.ShareBasket = [];
      // this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, share.Code)[0]);
      if (cloneData.ReferenceEntity[0] && cloneData.ReferenceEntity[0] !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.ReferenceEntity[0])[0]);
      if (cloneData.ReferenceEntity2[0] && cloneData.ReferenceEntity2[0] !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.ReferenceEntity2[0])[0]);
      if (cloneData.ReferenceEntity3[0] && cloneData.ReferenceEntity3[0] !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.ReferenceEntity3[0])[0]);
      if (cloneData.ReferenceEntity4[0] && cloneData.ReferenceEntity4[0] !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.ReferenceEntity4[0])[0]);
      if (cloneData.ReferenceEntity5[0] && cloneData.ReferenceEntity5[0] !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.ReferenceEntity5[0])[0]);

      this.ddlNoteCcy = cloneData.InputSettlementCurrency[0];


      this.format = cloneData.InputProductFormatType[0];
      // this.formatChange();

      this.Notional = this.commonfunctions.formatNotional(cloneData.InputRFQNotionalAmount[0]);


      this.SolveForvalue = cloneData.InputRFQSolveFor[0];
      this.issuePrice = cloneData.InputInterBankPrice[0];
      // this.reofferPrice = cloneData.InputReofferPrice[0];
      if (this.format === 'Note') {
        this.IBPrice = cloneData.InputReofferPrice[0];
      }
      else {
        this.Upfront = cloneData.InputReofferPrice[0];
      }
      this.cpnType = cloneData.StaticCouponType[0];
      //this.cpnTypeChange(this.cpnType);
      // if (this.cpnType === 'Floating') {
      //   this.floatingRefArr = this.floatingRefAll.filter(d => d.Ccy === this.ddlNoteCcy);
      //   if (this.floatingRefArr && this.floatingRefArr.length > 0) {

      //     this.floatingRef = this.floatingRefArr[0].Code;

      //   }
      // }

      this.cpnFreq = cloneData.InputFixedCouponFrequency[0];

      this.currencyChange();
      this.cpnTypeChange(this.cpnType);

      this.cpnFreq = cloneData.InputFixedCouponFrequency[0];
      this.Spread = cloneData.InputCouponOrSpreadPercent[0];
      this.cpnBasis = cloneData.InputCouponDayBasis[0];

      this.Fixedrate = cloneData.FixedRate[0];
      this.floatingRef = cloneData.InputFloatingIndex[0];
      this.noOfPeriods = cloneData.FirstNPeriods[0];

      //Start BBVAEPCLI-679 ||RadhaM || 13-Sep-23
      if(cloneData.StaticCouponType[0] != 'Fixed' || cloneData.StaticCouponType[0] != 'UpFront'){
        this.capfloorYN=cloneData.CapFloorYN[0];
      }
      this.cappercent=cloneData.InputCap[0];
      this.floorpercent=cloneData.InputFloor[0];
      if(cloneData.InputProductFormatType[0]==='Swap'){
        this.fundingbasis=cloneData.InputFundingBasis[0];
      }
      this.AccCpnYN=cloneData.AccruedCouponYN[0];
      //End BBVAEPCLI-679 ||RadhaM || 13-Sep-23

      // if (cloneData.SubTemplate[0] === 'CreditTranche' || cloneData.SubTemplate[0] === 'Credit Tranche') {

      // Added this.creditToggleYN | Anubhav Goyal | 1-June-2023 | BBVACLI-1125  CLN: On view/clone from previous quotes blotter, first coupon and ind/firm toggles change
      if (cloneData.CLNType[0] === 'Ind') {
        this.creditToggleYN = "Y";
        this.IndicativeOrFirm = 'Ind';
      } else {
        this.creditToggleYN = "N";
        this.IndicativeOrFirm = 'Firm';
      }

      //START: Added condition to fetch FirstLongCoupon | Anubhav Goyal | 1-June-2023 | BBVACLI-1125 + BBVACLI-1124 CLN: On view/clone from previous quotes blotter, first coupon and ind/firm toggles change
      this.cpnFirst = cloneData.FirstLongCoupon[0];
      if (this.cpnFirst == 'Long') {
        this.firstCpnYN = 'Y';
      } else if (this.cpnFirst == 'Short') {
        this.firstCpnYN = 'N'
      }
      //END: Added condition to fetch FirstLongCoupon | Anubhav Goyal | 1-June-2023 | BBVACLI-1125 + BBVACLI-1124 CLN: On view/clone from previous quotes blotter, first coupon and ind/firm toggles change

      this.fundType = cloneData.StaticFundingType[0];
      this.fundFreq = cloneData.StaticFundingFrequency[0];
      this.fundRate = cloneData.InputFundingRateSpread[0];


      this.orderID = cloneData.BBVAID[0];
      this.orderStatus = cloneData.Status[0];

      this.fillRecoveryTypeArr();
      this.recoveryType = cloneData.InputRecoveryType[0];

      //this.fundIndex = cloneData.InputFundingIndex[0];
      //this.fillSettlemetTypeArr();
      this.settlementType = cloneData.StaticSettlementType[0];


      this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor[0];
      this.setIssueDate(this.paymentshift);


      this.Tenor = cloneData.ComputedTenorValue[0];
      if (this.format === 'Note')
       // this.fetchMaturityDateBasedOnTenor();
     if (this.format === 'Swap') {
        this.maturityDate = this.datepipe.transform(cloneData.InputMaturityDate[0].split('T')[0], 'yyyy-MM-dd');

      }
      this.maturityDateDisable();

      if (viewOnly) {

        this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
        this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
          if (this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche') > -1) {
            this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche')].CPM_Format).toString().split(',');
            this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche')].ActiveYN;

          }
        }
        this.issueDate = this.datepipe.transform(cloneData.InputIssueDate[0].split('T')[0], 'yyyy-MM-dd');
        this.rfqID = cloneData.RFQID[0];
        // added by Suvarna P || 20Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer
        this.NoteMasterID = cloneData.Note_Master_Id[0];

        this.sortedAllPrices = [{

          Price: (cloneData.SolveForValue === undefined || cloneData.SolveForValue[0] === undefined || cloneData.SolveForValue[0] === '')
            ? 'Rejected' : cloneData.SolveForValue[0],
          solveFor: cloneData.InputRFQSolveFor[0],
          Price2: (cloneData.SolveForValue2 === undefined || cloneData.SolveForValue2[0] === undefined || cloneData.SolveForValue2[0] === '')
            ? 'Rejected' : cloneData.SolveForValue2[0],
          Price3: (cloneData.SolveForValue3 === undefined || cloneData.SolveForValue3[0] === undefined || cloneData.SolveForValue3[0] === '')
            ? 'Rejected' : cloneData.SolveForValue3[0],
          Price4: (cloneData.SolveForValue4 === undefined || cloneData.SolveForValue4[0] === undefined || cloneData.SolveForValue4[0] === '')
            ? 'Rejected' : cloneData.SolveForValue4[0],
          QueueStatus: cloneData.QueueStatus[0]  // changes by Suvarna P || 13May2022 || BBVACLI-214 || assigned by Pranav D
        }];
        switch (this.sortedAllPrices[0].solveFor) {
          case 'Coupon':
            this.Spread = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
            this.replySolveFor = 'Coupon';
            break;
          case 'Reoffer':
            // this.reofferPrice = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
            if (this.format === 'Note') {
              this.IBPrice = cloneData.SolveForValue[0];;
            } else {
              this.Upfront = cloneData.SolveForValue[0];;
            }
            this.replySolveFor = 'Reoffer';
            break;
          case 'FixedRate':
            this.Fixedrate = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
            this.replySolveFor = 'FixedRate';
            break;
        }
      }

    } catch (error) {

    }
  }
  //  changes by Suvarna P || 20Apr2022 || BBVACLI-188 || CLN: Previous Quotes || end

  //  changes by Suvarna P || 20Apr2022 || BBVACLI-187 ||	CLN: Saved Requests || start
  // Vaibhav B | 15-03-2023 | BBVAEPCLI-431 | CLN: first coupon, Ind/Firm
  setSaveQuoteData(cloneData: { UnderlyingCode1: string; UnderlyingCode2: string; UnderlyingCode3: string; UnderlyingCode4: string; UnderlyingCode5: string; onBehalfOf: any; Ccy: any; 
    FormatDetails: any; Size: any; TenorPer: any; SolveFor: any; IssuePrice: any; ReofferPrice: any; CouponType: any; Frequency: any; CouponSpread: any; CLNFixedRate: any; CouponBasis: any; 
    FloatingRef: any; CLNFirstPeriods: any; CLNIndicativeOrFirm: any; FirstLongCoupon: any, FundingType: any; FundingFrequency: any; IndexRateSpread: any; ComputedSettlementPeriodSoftTenor: any;
    MaturityDate: string | number | Date; RecoveryType: any; SettlementType: any; IssueDate: string | number | Date;
    AccruedCouponYN:any;CapFloorYN:any;CapPercent:any;FloorPercent:any;InputFundingBasis:any,FundIndex:any }, viewOnly: boolean,) {

    try {
      this.floatingRefArr = this.floatingRefAll.filter((d: { Ccy: any; }) => d.Ccy === this.ddlNoteCcy);
      //this.indexTranche = cloneData.IndexCode;
      if (cloneData.UnderlyingCode1 && cloneData.UnderlyingCode1 !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.UnderlyingCode1)[0]);
      if (cloneData.UnderlyingCode2 && cloneData.UnderlyingCode2 !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.UnderlyingCode2)[0]);
      if (cloneData.UnderlyingCode3 && cloneData.UnderlyingCode3 !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.UnderlyingCode3)[0]);
      if (cloneData.UnderlyingCode4 && cloneData.UnderlyingCode4 !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.UnderlyingCode4)[0]);
      if (cloneData.UnderlyingCode5 && cloneData.UnderlyingCode5 !== '')
        this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, cloneData.UnderlyingCode5)[0]);

      this.onBehalfOf = cloneData.onBehalfOf;
      this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
      if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        if (this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche') > -1) {
          this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche')].CPM_Format).toString().split(',');
          this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'Credit Tranche')].ActiveYN;
        }
      }
      this.ddlNoteCcy = cloneData.Ccy;
      this.format = cloneData.FormatDetails;

      this.Notional = this.commonfunctions.formatNotional(cloneData.Size);
      this.Tenor = cloneData.TenorPer;
      this.SolveForvalue = cloneData.SolveFor;
      this.issuePrice = cloneData.IssuePrice;
      // this.reofferPrice = cloneData.ReofferPrice;
      if (this.format === 'Note') {
        this.IBPrice = cloneData.ReofferPrice;
      }
      else {
        this.Upfront = cloneData.ReofferPrice;
      }

      this.cpnType = cloneData.CouponType;
      // this.cpnTypeChange(this.cpnType); commnted by Suvarna P || 20May2022 || BBVACLI-242 ||  BBVACLI-242 || reset functionality not needed here || assigned by Pranav D
      // if (this.cpnType === 'Floating') {
      //   this.floatingRefArr = this.floatingRefAll.filter(d => d.Ccy === this.ddlNoteCcy);
      //   if (this.floatingRefArr && this.floatingRefArr.length > 0) {

      //     this.floatingRef = this.floatingRefArr[0].Code;

      //   }
      // }

      this.cpnFreq = cloneData.Frequency;
      this.Spread = cloneData.CouponSpread;
      this.Fixedrate = cloneData.CLNFixedRate; // added by Suvarna P || 11May2022 || Clone from Saved Requests - First Number of Periods blank and Fixed Rate has a blank value and Ind/Firm incorrect || assigned by Pranav D
      this.cpnBasis = cloneData.CouponBasis;
      this.floatingRef = cloneData.FloatingRef;
      this.changeFloatingrefonFreq2(this.cpnFreq); // changed by Suvarna P|| 20May2022 || BBVACLI-242 ||  saved req- view for solveForValues || assigned by Pranav D
      this.noOfPeriods = cloneData.CLNFirstPeriods; // added by Suvarna P || 11May2022 || Clone from Saved Requests - First Number of Periods blank and Fixed Rate has a blank value and Ind/Firm incorrect || assigned by Pranav D


      this.IndicativeOrFirm = cloneData.CLNIndicativeOrFirm; // added by Suvarna P || 11May2022 || Clone from Saved Requests - First Number of Periods blank and Fixed Rate has a blank value and Ind/Firm incorrect || assigned by Pranav D
      // <Start> Vaibhav B | 15-03-2023 | BBVAEPCLI-431 | CLN: first coupon, Ind/Firm
      if (this.IndicativeOrFirm == 'Firm') {
        this.creditToggleYN = 'N';
      }
      else if (this.IndicativeOrFirm == 'Ind') {
        this.creditToggleYN = 'Y';
      }

      this.cpnFirst = cloneData.FirstLongCoupon;

      if (this.cpnFirst == 'Long') {
        this.firstCpnYN = 'Y';
      } else if (this.cpnFirst == 'Short') {
        this.firstCpnYN = 'N'
      }
      // <End> Vaibhav B | 15-03-2023 | BBVAEPCLI-431 | CLN: first coupon, Ind/Firm
      // if (cloneData.SubTemplate === 'CreditLinkedNote') {
      //   this.IndicativeOrFirm = 'Firm';
      // } else {
      //   this.IndicativeOrFirm = 'Ind';
      // }
      this.fundType = cloneData.FundingType;
      this.fundFreq = cloneData.FundingFrequency;
      this.fundRate = cloneData.IndexRateSpread;

      this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor;
      this.setIssueDate(this.paymentshift);

      this.Tenor = cloneData.TenorPer;
      // added by suvarna P || when format Swap . tenor- maturity date is not populating reported by Neha J || 11May2022 || assigned by Pranav D 
      if (this.format === 'Note')
       // this.fetchMaturityDateBasedOnTenor();
      if (this.format === 'Swap') {
        this.maturityDate = this.datepipe.transform(cloneData.MaturityDate, 'yyyy-MM-dd');
      }

      this.recoveryType = cloneData.RecoveryType;
      this.settlementType = cloneData.SettlementType;
      // this.fundIndex = cloneData.FundIndex;
      //<!-- Added by RiddhiP || 9-OCT-23 || BBVAEPCLI-728 || Funding Index missing for Swap format for CLN and CLI -->
      this.fundIndex = cloneData.FundIndex;
      //Start BBVAEPCLI-679 ||RadhaM || 13-Sep-23
      if(cloneData.FundingType != 'Fixed' || cloneData.FundingType != 'UpFront'){
        this.capfloorYN=cloneData.CapFloorYN;
      }
      this.cappercent=cloneData.CapPercent;
      this.floorpercent=cloneData.FloorPercent;
      if(cloneData.FormatDetails ==='Swap'){
        this.fundingbasis=cloneData.InputFundingBasis;
      }
      this.AccCpnYN=cloneData.AccruedCouponYN;
      //End BBVAEPCLI-679 ||RadhaM || 13-Sep-23
      if (this.viewOnly) {
        this.issueDate = this.datepipe.transform(cloneData.IssueDate, 'yyyy-MM-dd');
      } else {
        switch (this.SolveForvalue) {
          case 'Coupon':
            this.Spread = '';
            break;
          case 'Reoffer':
            // this.reofferPrice = '';
            if (this.format === 'Note') {
              this.IBPrice = '';
            } else {
              this.Upfront = '';
            }
            break;
          case 'FixedRate':
            this.Fixedrate = '';
            break;
        }
      }
    } catch (error) {

    }
  }
  //  changes by Suvarna P || 20Apr2022 || BBVACLI-187 ||	CLN: Saved Requests || end

  async Save() {
    try {
      this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
      this.reset(); //Added to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
      //  changes by Suvarna P || 20May2022 || BBVACLI-242 ||  saved Req- View issues for solveFor Values ||	CLN: Saved Requests ||assigned by Pranav D.
      this.ErrorMsg = '';
      this.infoMsg = '';
      this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.timeLeft = -1;
        this.timeoutMsg = '';
        this.clearFlag = true;
        clearInterval(this.interval);
        if (this.ShareBasket.length > 0) {
          document.getElementById('txtShare')!.classList.remove('underlyingError');
          document.getElementById('txtShare')!.classList.add('longText');
        }
        this.saveportfolioId = '';
        this.PPDetails = '';
        this.sortedAllPrices = [];
        this.AllPrices = [];
        this.orderID = '';
        this.loadflag = false;
        this.ErrorMsg = '';
        this.infoMsg = '';
        this.rfqID = '';
        this.saveFlag = false;
        this.successMsg = '';
        // this.reqSuccessMsg = '';
        const strXml = '<Details>' + this.generateSaveXML() + '</Details>';
        var res:any;
        await this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, '', '', 'CreditLinkedNote', (this.commonfunctions.getLoggedInUserName()).then((data:any)=>{res = data}));
        // Removed condition' && this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
        if (res) {
          if (res.errorMessage === '') {
            this.saveFlag = true;
            this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
            this.saveportfolioId = res.PortFolioID;
            this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';

          }
        }
      }
    } catch (error) {

    }
    return false;
  }

  generateSaveXML() {
    try {
      this.tempXML = '';
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      //Changed by Apurva K||14-Dec-2023|| HSBCECCLI-86
      const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].RICCode + '#')) +
        ((this.ShareBasket[1] === undefined) ? '' : (this.ShareBasket[1].RICCode + '#')) +
        ((this.ShareBasket[2] === undefined) ? '' : (this.ShareBasket[2].RICCode + '#')) +
        ((this.ShareBasket[3] === undefined) ? '' : (this.ShareBasket[3].RICCode + '#')) +
        ((this.ShareBasket[4] === undefined) ? '' : (this.ShareBasket[4].RICCode + '#')) +
        ((this.ShareBasket[5] === undefined) ? '' : (this.ShareBasket[5].RICCode + '#')) + '#' + this.ddlNoteCcy;

      this.tempXML += '<Record>' +
        '<Share>' + shareCcy + '</Share>' +

        '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</ShareBBGRIC1>' +
        '<ShareBBGRIC2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].LongName) + '</ShareBBGRIC2>' +
        '<ShareBBGRIC3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].LongName) + '</ShareBBGRIC3>' +
        '<ShareBBGRIC4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].LongName) + '</ShareBBGRIC4>' +
        '<ShareBBGRIC5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].LongName) + '</ShareBBGRIC5>' +
        '<ShareBBGRIC6>' + ((this.ShareBasket[5] === undefined) ? '' : this.ShareBasket[5].LongName) + '</ShareBBGRIC6>' +

        '<ShareLongName1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</ShareLongName1>' +
        '<ShareLongName2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].LongName) + '</ShareLongName2>' +
        '<ShareLongName3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].LongName) + '</ShareLongName3>' +
        '<ShareLongName4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].LongName) + '</ShareLongName4>' +
        '<ShareLongName5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].LongName) + '</ShareLongName5>' +

        '<CouponBarrier></CouponBarrier>' +
        '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
        '<Strike></Strike>' +
        // '<IBPrice>' + this.IBPrice + '</IBPrice>' +
        '<IBPrice></IBPrice>' +
        '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
        '<KOPer></KOPer>' +
        '<KOType></KOType>' +
        '<UpfrontAQ></UpfrontAQ>' +
        '<KIPer></KIPer>' +
        '<KIType></KIType>' +
        '<CouponPer>' + this.Spread + '</CouponPer>' +
        '<CouponType>' + this.cpnType + '</CouponType>' +
        '<TenorPer>' + this.Tenor + '</TenorPer>' +
        '<TenorType></TenorType>' +

        '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</Underlying1>' +
        '<Underlying2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].LongName) + '</Underlying2>' +
        '<Underlying3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].LongName) + '</Underlying3>' +
        '<Underlying4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].LongName) + '</Underlying4>' +
        '<Underlying5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].LongName) + '</Underlying5>' +
        '<Underlying6>' + ((this.ShareBasket[5] === undefined) ? '' : this.ShareBasket[5].LongName) + '</Underlying6>' +

        '<Gearing></Gearing>' +
        '<Upfront></Upfront>' +
        '<Guarantee></Guarantee>' +
        '<LowCoupon></LowCoupon>' +
        '<HighCoupon></HighCoupon>' +
        '<TradeDate_Type></TradeDate_Type>' +
        '<Frequency>' + this.cpnFreq + '</Frequency>' +
        '<SettlWeek></SettlWeek>' +
        '<NonCall></NonCall>' +
        '<Wrapper></Wrapper>' +
        '<Size>' + this.Notional + '</Size>' +
        '<PaymentDate></PaymentDate>' +
        '<StrikeDate></StrikeDate>' +
        '<StepDown></StepDown>' +
        '<ERCouponPer></ERCouponPer>' +
        '<ERCouponType></ERCouponType>' +
        '<MemoryPds></MemoryPds>' +
        '<AltCouponPer></AltCouponPer>' +
        '<AltCouponObservation></AltCouponObservation>' +
        '<FundingType>' + this.fundType + '</FundingType>' +
        '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>' +
        '<IndexRateSpread>' + this.fundRate + '</IndexRateSpread>' +
        '<FloatingRef>' + this.floatingRef + '</FloatingRef>' +
        '<FloatingFreq></FloatingFreq>' +
        '<CouponBasis>' + this.cpnBasis + '</CouponBasis>' +
        // '<ReofferPrice>' + this.issuePrice + '</ReofferPrice>' +
        '<ReofferPrice>' + ((this.format === 'Note') ? this.IBPrice : this.Upfront) + '</ReofferPrice>' +
        '<Mode></Mode>' +
        '<FormatDetails>' + this.format + '</FormatDetails>' +
        '<CouponObs></CouponObs>' +
        '<NonCallPeriod></NonCallPeriod>' +
        '<ExpiryDate></ExpiryDate>' +
        '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<CouponSpread>' + this.Spread + '</CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +
        '<ERFrequency></ERFrequency>' +
        '<SubTemplate>' + 'CreditLinkedNote' + '</SubTemplate>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
        '<RecoveryType>' + this.recoveryType + '</RecoveryType>' +
        '<SettlementType>' + this.settlementType + '</SettlementType>' +
        '<FundIndex>' + this.fundIndex + '</FundIndex>' +
        '<MaturityDate>' + this.datepipe.transform(this.maturityDate, 'dd-MMM-yyyy') + '</MaturityDate>' +
        '<CLNFixedRate>' + ((this.Fixedrate) ? this.Fixedrate : '') + '</CLNFixedRate>' +
        '<CLNFirstPeriods>' + ((this.noOfPeriods) ? this.noOfPeriods : '') + '</CLNFirstPeriods>' +
        '<CLNIndicativeOrFirm>' + this.IndicativeOrFirm + '</CLNIndicativeOrFirm>' +
        // Vaibhav B | 15-03-2023 | BBVAEPCLI-431 | CLN: first coupon, Ind/Firm
        '<FirstLongCoupon>' + this.cpnFirst + '</FirstLongCoupon>' +
        '<CapFloorYN>' + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.capfloorYN : '') + '</CapFloorYN>' +
        '<CapPercent>' + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.cappercent : '') + '</CapPercent>' +
        '<FloorPercent>' + ((this.cpnType === 'Floating' || this.cpnType === 'Fixed-Float' || this.cpnType === 'Float-Fixed') ? this.floorpercent : '') + '</FloorPercent>' +
        // '<Upfront>' + this.Upfront + '</Upfront>' +
        '</Record>';

      this.commonfunctions.generateFlexiXml(this.tempXML);
      return this.tempXML;
    } catch (error) {

    }

  }

  // BBVACLI-187 Pranav D 25-Apr-2022 required for save and share 
  ChangeIndex_User(e: any) {
    try {
      // this.selectedShareIndex = 0;
      this.selectedUserIndex = 0;
      this.userflag = true;
      this.userCode = '';
      this.selectedBIndex_User = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
    }
  }

  backKeyPress_User(e: any) {
    try {
      this.flag = false;
      // this.shareCode = '';
      this.userCode = '';
      // this.selectedBIndex = 0;
      this.selectedBIndex_User = 0;
    } catch (error) {

    }
  }

  selectUser(e: any) {
    try {
      this.userflag = false;
      // if ($('.HoverSuggestion').data('share') !== undefined) {
      if ($('.HoverSuggestion').data('user') !== undefined) {
        this.userCode = $('.HoverSuggestion').data('user');
      }
      if (this.userCode !== undefined && this.userCode !== '') {
        this.showUser(e, SearchUserGroupPipe.prototype.transform(this.users, this.userCode)[0]);
      }
    } catch (Error) {

    }
  }

  showUser(event: any, item: { Code: any; Name: any; Type: any; }) {
    try {
      this.userflag = false;
      this.selectedBIndex_User = 0;
      this.showSuggestions_User = false;
      this.userName = '';

      if (this.userBasket.find((i: { Code: any; }) => i.Code === item.Code) === undefined) {
        this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
      }
    } catch (error) {

    }
  }

  deleteUserfromList(index: any) {
    this.successMsg = '';
    let groupdelete = [];
    let userdelete = [];
    const name = this.userBasket[index]['Name'];
    const type = this.userBasket[index]['Type'];
    if (type === 'GROUP' || type === 'Group') {
      groupdelete[0] = this.userBasket[index].Code;

    }
    if (type === 'USER' || type === 'User') {
      userdelete[0] = this.userBasket[index].Code;
    }
    const res = this.apifunctions.InsertPortfolioSharing(this.currentowner, [],
      [], this.saveportfolioId, [], [], groupdelete, userdelete);
    if (res) {
      this.userBasket.splice(index, 1);

      this.successMsg = type + ' ' + name + ' access removed sucessfully.';
    }
  }

  changeAccessofUserGroup(e: Event, index: any) {
    const target = this.commonfunctions.GetEventTarget(e);
    let res: any;


    this.userBasket[index]['Access'] = target.value;

  }

  hidesaveSharePopup() {
    try {
      this.showsaveSharePopupFlag = false;
      this.saveportfolioId = '';
      this.userBasket = [];
      this.SaveandShareErrorMsg=''; //BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
    } catch (error) {

    }
    return false;
  }

  sharePortfolio() {
     //BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 08-09-23
     this.SaveandShareErrorMsg = ''; 
     if (this.userBasket.length === 0) {
         this.SaveandShareErrorMsg = 'Please enter user ID or client group'; 
         return false;
     }
    this.Save();
     //  Added condition'this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
     if(this.userBasket.length > 0){
    if (this.saveportfolioId !== '') {
      // let groupEdit =[];
      let groupView = [];
      let userEdit = [];
      let userView = [];
      for (let i = 0, j = 0, k = 0, m = 0; i < this.userBasket.length; i++) {
        if (this.userBasket[i]['Type'] === 'GROUP' || this.userBasket[i]['Type'] === 'Group') {
          groupView[j] = this.userBasket[i].Code;
          j++;
        }
        if (this.userBasket[i]['Type'] === 'USER' || this.userBasket[i]['Type'] === 'User') {
          if (this.userBasket[i]['Access'] === 'EDIT') {
            userEdit[k] = this.userBasket[i].Code;
            k++;
          }
          if (this.userBasket[i]['Access'] === 'VIEW') {
            userView[m] = this.userBasket[i].Code;
            m++;
          }
        }

      }

      const res = this.apifunctions.InsertPortfolioSharing(this.currentowner, [], groupView, this.saveportfolioId, userEdit, userView, [], []);
      if (res) {
        this.successMsg = 'Portfolio ID ' + this.saveportfolioId + ' saved and shared successfully.';
        this.saveportfolioId = '';
        this.userBasket = [];
        this.showsaveSharePopupFlag = false;
        }
      }
     }
       // Added ErrorMsg ||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
       else{
        this.SaveandShareErrorMsg = 'Please enter user ID or client group';
    }

  }

  cloneSinglePricer() {
    try {
      this.viewOnly = false;
      this.buttonList = 'Clone,View,';  // Suvarna P || 19Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer
      this.reset();
    } catch (error) {

    }

  }

  setDefaultDates() {
    try {
      this.paymentshift = '10B';
      this.Dates = this.echome.BBVAGetDates('', this.paymentshift, '');
      this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);

      //this.Tenor = '5Y';
     // this.fetchMaturityDateBasedOnTenor();
    } catch (error) {

    }
  }

  // changed by Suvarna P|| 20May2022 || BBVACLI-242 ||  saved req- view for solveForValues || assigned by Pranav D
  changeFloatingrefonFreq(cpnFreq: any) {
    try {
      this.reset();

      this.changeFloatingrefonFreq2(cpnFreq);
    } catch (error) {

    }
  }
  // added by Suvarna P|| 20May2022 || BBVACLI-242 ||  saved req- view for solveForValues || assigned by Pranav D || start
  changeFloatingrefonFreq2(cpnFreq: string) {
    if (this.cpnType !== 'Fixed') {
      this.floatingRefArr = this.floatingRefAll.filter((d: { Ccy: any; }) => d.Ccy === this.ddlNoteCcy);
      // new code written to set floating ref based n coupon frequency Pranav D BBVAEPCLI-610 related change 16-Aug-2023
      // Start || changed by Suvarna P || 17Aug23 || BBVAEPCLI-610 IR Index on ePricer for Credit Products || set floating ref based n coupon frequency || Floating index not getting set onChange of Currency(USD) reported by Nitij M
      this.floatingRef =''
      this.floatingRefArr.forEach((res: any) => {
        if (res.Code.toLowerCase().includes(cpnFreq)) {
          this.floatingRef = res.Code;
        }
      });
      if(this.floatingRef == ''){
        this.floatingRef = this.floatingRefArr[0].Code;
      }
    // End || changed by Suvarna P || 17Aug23 || BBVAEPCLI-610 IR Index on ePricer for Credit Products || set floating ref based n coupon frequency || Floating index not getting set onChange of Currency(USD) reported by Nitij M

      // START : Pranav D 16-Aug-2023 BBVAEPCLI-610 code commented by Pranav D floating ref set by above code 
      // if (this.floatingRef !== '') {
      // if (cpnFreq === '3m') {
      //   // below code commented by Pranav D 16-Aug-2023 BBVAEPCLI-610 as floating ref can change as per BBVA requirement causing wrong value population in dropdown 
      //   // this.floatingRef = this.floatingRefArr[0].Code;
      //   this.floatingRefArr.forEach((res: any) => {
      //     if (res.Code.includes(cpnFreq)) {
      //       this.floatingRef = res.Code;
      //     }
      //   });
      // } else if (cpnFreq === '6m') {
      //   // this.floatingRef = this.ddlNoteCcy + '6M';
      //   // below code commented by Pranav D 16-Aug-2023 BBVAEPCLI-610 as floating ref can change as per BBVA requirement causing wrong value population in dropdown 
      //   // this.floatingRef = this.floatingRefArr[1].Code;
      //   this.floatingRefArr.forEach((res: any) => {
      //     if (res.Code.includes(cpnFreq)) {
      //       this.floatingRef = res.Code;
      //     }
      //   });
      // }
      // } 
      // END : Pranav D 16-Aug-2023 BBVAEPCLI-610 code commented by Pranav D floating ref set by above code 
    } else {
      this.floatingRef = '';
    }
    // added by Suvarna P|| 20May2022 || BBVACLI-242 ||  saved req- view for solveForValues || assigned by Pranav D || end
  }

  CreditToggle(val) {
    this.creditToggleYN = val;
    if (val === 'Y') {
      this.IndicativeOrFirm = 'Ind';
    }
    else {
      this.IndicativeOrFirm = 'Firm';
    }
  }

  capfloorToggle(capfloorYN:any,SolveForvalue:any){
    if(capfloorYN==='N' && (SolveForvalue ==='Cap' || SolveForvalue ==='Floor')){
      this.SolveForvalue='Coupon';
      this.cappercent='';
      this.floorpercent='';
    }
    if(capfloorYN==='N' && (SolveForvalue !='Cap' && SolveForvalue !='Floor')){
      this.cappercent='';
      this.floorpercent='';
    }
     if(capfloorYN==='Y' && SolveForvalue ==='Floor') {
      this.cappercent='4.00';
      this.floorpercent='';
    }
     if(capfloorYN==='Y' && SolveForvalue ==='Cap') {
      this.cappercent='';
      this.floorpercent='1.00';
    }
    if(capfloorYN==='Y' && (SolveForvalue !='Cap' && SolveForvalue !='Floor')){
      this.cappercent='4.00';
      this.floorpercent='1.00';
    }

   
  }

  setFirstCpn(val) {
    try {
      this.firstCpnYN = val;
      if (val === 'Y') {
        this.cpnFirst = 'Long';
      } else {
        this.cpnFirst = 'Short';
      }
    } catch (error) {
    }
  }

  // changeToggle(cpnFirst:any) {
  //   try {
  //     if(this.creditToggleYN === 'Y')
  //   {

  //     this.creditToggleYN = "N";
  //     this.cpnFirst = 'Short';
  //   }
  //   else
  //   {
  //     this.creditToggleYN = 'Y'
  //     this.cpnFirst = 'Long';
  //   }
  //    
  //   } catch (error) {

  //   }
  // }

  toggeleOnOff() {
    this.reset();
    this.fnGetProdTemplate();
  }

  // START : Add to watchlist popup

  hideProductPopup() {
    this.ErrorMsg = ""
    this.ProductWatchlist = false;

  }

  showddToWatchlistPopup() {
    try {
      this.targetValue = '';
      this.expiryDate = this.datepipe.transform(moment().add({ days: 30 }).format('YYYY-MM-DD'), 'yyyy-MM-dd');
      this.ErrorMsg = '';
      this.TimeValid = formatDate(new Date(), 'HH:mm', 'en-US');
      // moment(new Date(), "HH:mm") ;
      this.ProductWatchlist = !this.ProductWatchlist;
      this.infoMsg = '';
      this.scheduleMsg = '';
      this.expiryDate = this.datepipe.transform(moment().add({ days: 30 }).format('YYYY-MM-DD'), 'yyyy-MM-dd');
      // this.addWatchlistSolveFor = this.SolveForvalue;
      let solveForData = document.getElementById('SolveForvalue')?.childNodes;
      solveForData?.forEach((res: any) => {

        if (res.value === this.SolveForvalue) {
          this.addWatchlistSolveFor = res.innerText;
        }
      });
      // START : Pranav D 6-Jul-2023 BBVAEPCLI-624 direction made conditional based on solvefor
      // this.direction = 'Up';
      if (this.SolveForvalue === 'IBPrice') {
        this.direction = 'Down';
      } else {
        this.direction = 'Up';
      }
      // END : Pranav D 6-Jul-2023 BBVAEPCLI-624 direction made conditional based on solvefor
      this.validationOnButton();
      if (this.ErrorMsg === '') {
        // this.ProductWatchlist = !this.ProductWatchlist;
        this.today();
      }
    } catch (error) {

    }
    return false;
  }

  hideAddToWatchlistPopup() {
    try {
      this.ProductWatchlist = false;
    } catch (error) {

    }
    return false;
  }

  AddToWatchlist() {
    try {
      if (this.targetValue != '') {
        if (this.expiryDate <= this.MaxSelectDate && this.expiryDate >= this.MinSelectDate) {
          this.scheduleMsg = '';
          this.ErrorMsg = '';
          this.infoMsg = '';
          this.validationOnButton();
          const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.TimeValid));
          const today = new Date();
          // if (sDate < today) {
          //     this.ErrorMsg = 'Please enter valid time';
          //     return false;
          // }
          document.getElementById('scheduleMsg')?.classList.remove('error');
          const timeinsecs = JSON.stringify(Math.abs(Math.round((today.getTime() - sDate.getTime()) / 1000)));
          if (this.ErrorMsg === '') {
            this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
            if (isNaN(this.portfolioGroupID)) {
              this.ErrorMsg = "Price request failed. Please reload the application and try again.";
              return false;
            }
            // BBVAEPCLI-414 flag true when add to watchlist added
            this.isAddToWatchlist = true;
            const xmlstr = this.generateXML();

            const res = this.apifunctions.AddToWatchlist('CreditLinkedNote', xmlstr,
              sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue,
              this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,
              'CreditLinkedNote', 'DAILY', 'REGULAR', this.Exchange(), "Y", this.targetValue, this.direction, this.expiryDate, "N", "");
            if (res) {
              if (res.PS_PW_ID.toLowerCase() !== 'max') {
                if (res['IsScheduled']) {
                  this.WatchID = res['PS_PW_ID'];
                  this.scheduleMsg = 'Product successfully added to watchlist.';
                }
              } else {
                this.ErrorMsg = 'Max product in watchlist limit reached.';
                document.getElementById('scheduleMsg')?.classList.remove('successMsg');

                document.getElementById('scheduleMsg')?.classList.add('error');
              }

            }
            // BBVAEPCLI-414 flag made false after performing operation
            this.isAddToWatchlist = false;
          }
        } else {
          this.ErrorMsg = 'Invalid Date.';
        }
      }
      else {
        this.ErrorMsg = 'Please enter Target Value.';
      }
    } catch (error) {

    }
    return false;
  }
  fundRatePopuptoggle() {
    this.fundRatePopup != this.fundRatePopup;
  }

  // END : Add to watchlist popup

  // Suvarna P || 19Jun23 || BBVAEPCLI-601 ||  Credit Linear Notes : Termsheet for Single Pricer

  async RequestTermsheet() {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.infoMsg = '';
      var Product = 'CreditLinkedNote';
      var subTemplateCode = 'CreditLinkedNote';

      const errorMsg = this.apifunctions.termsheetSender(this.orderID, this.onBehalfOf, Product, subTemplateCode);
      if (errorMsg === '') {
        this.reqSuccessMsg = 'Requested.';

        let TSTimeLeft = this.TSTimeout;

        const that = this;
        const TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res: any = await this.apifunctions.ViewTermsheet(that.NoteMasterID);
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                this.sortedAllPrices[0].TSFlag = true;
                TSTimeLeft = 0;
                clearInterval(TSInterval);
                that.reqSuccessMsg = 'TS Received.';
                that.sortedAllPrices[0].TSDisableFlag = false;

              } else {
                //that.TSFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              //that.TSFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].TSFlagTSFlag === false) {
            that.sortedAllPrices[0].TSDisableFlag = false;
            that.reqSuccessMsg = 'Termsheet response is taking longer than expected.Please try again later.';
            clearInterval(TSInterval);
          }
        }, 10000);
        this.intervals.add(TSInterval);
      } else {
        this.sortedAllPrices[0].TSDisableFlag = false;
        this.sortedAllPrices[0].TSLoadFlag = false;
        this.reqSuccessMsg = 'TS Request Failed.';
      }

      return false;
    } catch (error) {
      return false;

    }
  }

  async ViewTermsheet() {
    //Changed by Jyoti S || 31-May-2023 || START
    try {
      this.ErrorMsg = '';
      this.docsData = [];
      let showFlag = false;
      this.sortedAllPrices[0].ViewTSFlag = true;
      const res: any = await this.echome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
      this.sortedAllPrices[0].ViewTSFlag = false;
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.sortedAllPrices[0].lp},
      ];
      if (res?.length) {
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
        this.reqSuccessMsg = 'Termsheet not available. Please try again later.';

      }//Changed by Jyoti S || 31-May-2023 || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }
  // async RequestKIDonView() {
  //   try {
  //     //Changed by Jyoti S || 31-May-2023 || START
  //     this.sortedAllPrices[0].KIDFlag = false;
  //     this.ErrorMsg = '';
  //     this.sortedAllPrices[0].KIDDisableFlag = true;
  //     this.sortedAllPrices[0].KIDLoadFlag = true;
  //     const res: any = await this.echome.KIDSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'EQC_Europe', this.language, this.country);
      
  //     if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
  //       // this.reqSuccessMsg = 'Requested.';
  //       this.sortedAllPrices[0].KIDLoadFlag = false;
  //       this.reqSuccessMsg = 'KID Awaited.';
  //       let TSTimeLeft = this.TSTimeout;
  //       const that = this;
  //       const KIDInterval = setInterval(async() => {
  //         if (TSTimeLeft > 0) {
  //           const res: any = await this.echome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
  //           if (res?.length) {
  //             if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
  //               that.sortedAllPrices[0].KIDFlag = true;
  //               TSTimeLeft = 0;
  //               clearInterval(KIDInterval);
  //               // that.reqSuccessMsg = 'Received.';
  //               this.reqSuccessMsg = 'KID Received.';
  //               that.sortedAllPrices[0].KIDDisableFlag = false;
  //             } else {
  //               //that.sortedAllPrices[0].KIDFlag = false;
  //               TSTimeLeft = TSTimeLeft - 10;
  //             }

  //           } else {
  //             //that.sortedAllPrices[0].KIDFlag = false;
  //             TSTimeLeft = TSTimeLeft - 10;
  //           }
  //         } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].KIDFlag === false) {
  //           that.sortedAllPrices[0].KIDDisableFlag = false;
  //           that.reqSuccessMsg = 'Termsheet response is taking longer than expected.Please try again later.';
  //           clearInterval(KIDInterval);
  //         }
  //       }, 10000);
  //       this.intervals.add(KIDInterval);
  //     } else {
  //       // this.reqSuccessMsg = 'TS Request Failed.';
  //       this.sortedAllPrices[0].KIDDisableFlag = false;
  //       this.sortedAllPrices[0].KIDLoadFlag = false;
  //       this.reqSuccessMsg = 'KID Request Failed.';
  //     }
  //     //Changed by Jyoti S || 31-May-2023 || END
  //     return false;
  //   } catch (error) {
  //     return false;
  //     //console.log('Error:', error);
  //   }
  // }

  // async ViewKIDonView() {
  //   try {
  //     //Changed by Jyoti S || 31-May-2023 || START
  //     this.ErrorMsg = '';
  //     this.docsData = [];
  //     let showFlag = false;
  //     this.sortedAllPrices[0].ViewKIDFlag = true;
  //     const res: any = await this.echome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
  //     this.sortedAllPrices[0].ViewKIDFlag = false;
  //     const thisRef = this;
  //     this.docsPopupLabels = [
  //       {title: "Counterparty", value: this.sortedAllPrices[0].lp},
  //     ];
  //     if (res?.length) {
  //       //<Sudarshan | base64 to Bytes>
  //       const downloadLink = document.createElement('a');
  //       res.forEach(function (item : any) {
  //         if (item.Status.toString().toUpperCase() === 'SUCCESS') {
  //           const downloadLink = document.createElement('a');
  //         let fileName = item.Document_Output_Path;
  //         downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
  //         downloadLink.download = fileName;
  //          const obj = {
  //            "Type": item["DocumentType"],
  //            "Country": item["DocumentCountry"],
  //            "Language": item["DocumentLanguage"],
  //            "File Name": item["Document_Output_Path"],
  //            "View": () => { downloadLink.click();},
  //          }
  //          thisRef.docsData.push(obj);
  //          showFlag = true;          
  //        }

  //        else {
  //          this.ErrorMsg = item.Status.toString();
  //          showFlag = false;
  //        }
  //      });  
  //      this.showDocsPopup = showFlag;  

  //     } else {
  //       this.showDocsPopup = false;
  //       this.reqSuccessMsg = 'KID not available. Please try again later.';

  //     }//Changed by Jyoti S || 31-May-2023 || END
  //   } catch (error) {
  //     //console.log('Error', error);
  //   }
  //   return false;
  // }

  async filldropdownfromcommandata() {
    for (let i = 0; i < this.commonData?.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "InputProductFormatType":
          this.Format = await this.parseCommonDatatoJSONArr('InputProductFormatType');
          //console.log(this.Format,"Fornat arr")
        break;
        case "InputRFQSolveFor":
          this.SolveForvalue =  await this.parseCommonDatatoJSONArr('InputRFQSolveFor');
          break;
        case "IssueDateOffsetRef"://Sudarshan | Asked by vipul | 31-Jan-2024
             
                this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffsetRef');
          break;
        case "ComputedTenorValue":
          this.Tenor = await this.parseCommonDatatoJSONArr('ComputedTenorValue');
          //console.log(this.Tenor,"this.Tenor")
          break;
        case "AutocallFrequency":
          this.AutocallFrequency = await this.parseCommonDatatoJSONArr('AutocallFrequency');
          const i = this.AutocallFrequency.findIndex(obj => obj.Key === 'Daily');
          if (i > -1) {
            this.AutocallFrequency.splice(i, 1);
          }
          //console.log(this.AutocallFrequency);

          if (this.AutocallFrequency && this.AutocallFrequency.length > 0) {
            for (let j = 0; j < this.AutocallFrequency.length; j++) {
              this.AutocallFrequency[j]['Flag'] = false;
            }
          }
          break;
          case "StaticSettlementType":
          this.settlementTypeArr = await this.parseCommonDatatoJSONArr('StaticSettlementType');
          //console.log(this.Tenor,"this.Tenor")
          break;
          case "InputRecoveryType":
            this.recoveryTypeArr = await this.parseCommonDatatoJSONArr('InputRecoveryType');
            //console.log(this.Tenor,"this.Tenor")
            break;

            case "InputRFQSolveFor":
            this.SolveForDropdown = await this.parseCommonDatatoJSONArr('InputRFQSolveFor');
            //console.log(this.Tenor,"this.Tenor")
            break;
            case "InputCouponDayBasis":
              this.CouponDayBasis = await this.parseCommonDatatoJSONArr('InputCouponDayBasis');
              //console.log(this.Tenor,"this.Tenor")
              break;
              case "InputFixedCouponFrequency":
              this.CpnFreqArr = await this.parseCommonDatatoJSONArr('InputFixedCouponFrequency');
              //console.log(this.Tenor,"this.Tenor")
              break;
              
              case "NonBestPriceReason":
              this.NonBestPriceReasonArr = await this.parseCommonDatatoJSONArr('NonBestPriceReason');
              //console.log(this.floatingRefArr,"this.floatingRefArr")
              break;
              

      }
    }
    //console.log(this.Format,"Fornat arr")

  }

  parseCommonDatatoJSONArr(Field_Name: any) {
    let commonDataJSONArr: any = [];
    const index = this.commonData.findIndex(obj => obj.Field_Name === Field_Name);
    if (index >= 0) {
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
    }
    return commonDataJSONArr;
  }
  enabledisablefields(fieldName) {
    let enabledisableflag = false;
    for (let i = 0; i < this.defaultvaluesArr?.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === fieldName) {
        if (this.defaultvaluesArr[i].ActiveYN === 'Y') {
          enabledisableflag = false;
        } else {
          enabledisableflag = true;
        }
        return enabledisableflag;
      }
    }
    return enabledisableflag;
  }

  Setstkshiftvalue(e) {
    this.stkshift = e
  }

  async changeStkShiftToggle() {
    this.priceBtnActive = 'Y'; //ApurvaK 
    console.log("stkshift", this.stkshift)
    if (this.stkshift === '0B') {
      this.Dates = await this.echome.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.eccommon.formatDate(this.Dates.MaturityDate);
        console.log("stkshift", this.stkdate)
      }
    }
  }

  autocallfreqbasedonTenor() {
    this.resetManualTrigger(); // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
    let tenorinmonth = 0;
    let fromchar = '';
    let ddlValueCount = 0;
    for (let j = 0; j < this.AutocallFrequency.length; j++) {
      this.AutocallFrequency[j]['Flag'] = false;
    }
    // if (this.expshift !== 'Custom') {
    let tenorNum = this.expshift !== 'Custom' ? this.expshift.substr(0, this.expshift.length - 1) : this.customTenor.substr(0, this.customTenor.length - 1);
    let tenorType = this.expshift !== 'Custom' ? this.expshift.substr(this.expshift.length - 1) : this.customTenor.substr(this.customTenor.length - 1);
    if (tenorNum.includes('.')) {
      const arr = tenorNum.split('.');
      //console.log(arr, tenorType, tenorinmonth)
      if (arr.length === 2) {
        tenorinmonth = (parseInt(arr[0]) * 12) + (parseInt(arr[1]) + 1);
        //console.log(arr, tenorType, tenorinmonth)
      }
    } else {
      if (tenorType === 'Y') {
        tenorinmonth = (tenorNum * 12);
      } else {
        tenorinmonth = tenorNum;
      }
    }
    // } else {
    //   tenorinmonth = 12;
    // }

    let index = -1;
    let flagDaily = false;
    let flagMonthly = false;
    let flagQuarterly = false;
    let flagSemiannually = false;
    let flagYearly = false;

    if (tenorinmonth % 12 === 0) {
      flagDaily = true;
      flagMonthly = true;
      flagQuarterly = true;
      flagSemiannually = true;
      flagYearly = true;
    } else if (tenorinmonth % 6 === 0) {
      flagDaily = true;
      flagMonthly = true;
      flagQuarterly = true;
      // condition not required || commented by PriyaL || 08Apr2022 || Assigned by PranavD
      // if ((tenorinmonth / 6) !== 1) {
      flagSemiannually = true;
      // }

    } else if (tenorinmonth % 3 === 0) {
      flagDaily = true;
      flagMonthly = true;
      flagQuarterly = true;

    } else {
      flagDaily = true;
      flagMonthly = true;
    }

    if (flagDaily) {
      const index = this.AutocallFrequency.findIndex(res => res.Value === 'Daily');
      if (index > -1) {
        this.AutocallFrequency[index].Flag = true;
      }

    }
    if (flagMonthly) {
      const index = this.AutocallFrequency.findIndex(res => res.Value === 'Monthly');
      if (index > -1) {
        this.AutocallFrequency[index].Flag = true;
      }
    }
    if (flagQuarterly) {
      const index = this.AutocallFrequency.findIndex(res => res.Value === 'Quarterly');
      if (index > -1) {
        this.AutocallFrequency[index].Flag = true;
      }
    }
    if (flagSemiannually) {
      const index = this.AutocallFrequency.findIndex(res => res.Value === 'Semiannually');
      if (index > -1) {
        this.AutocallFrequency[index].Flag = true;
      }
    }
    if (flagYearly) {
      const index = this.AutocallFrequency.findIndex(res => res.Value === 'Yearly');
      if (index > -1) {
        this.AutocallFrequency[index].Flag = true;
      }
    }

    //console.log(this.AutocallFrequency);
    //console.log(this.autoFreq);
    if (this.AutocallFrequency.findIndex(res => res.Value === this.autoFreq) > -1) {
      if (!this.AutocallFrequency[this.AutocallFrequency.findIndex(res => res.Value === this.autoFreq)].Flag) {
        for (let j = 0; j < this.AutocallFrequency.length; j++) {
          if (this.AutocallFrequency[j]['Flag']) {
            this.autoFreq = this.AutocallFrequency[j].Value;
          }
        }
      }
    }

    this.autocallfrombasedonFreqnTenor();
  }

  resetManualTrigger() {
    this.manualTriggerValueArr = '';
  }
  autocallfrombasedonFreqnTenor() {
    this.autoNonCallArr = [];
    let tenorinmonth = 0;
    let fromchar = '';
    let ddlValueCount = 0;
    if (this.expshift !== 'Custom') {
      let tenorNum = this.expshift.substr(0, this.expshift.length - 1);

      let tenorType = this.expshift.substr(this.expshift.length - 1);

      if (tenorNum.includes('.')) {
        const arr = tenorNum.split('.');
        //console.log(arr, tenorType, tenorinmonth)
        if (arr.length === 2) {
          tenorinmonth = (parseInt(arr[0]) * 12) + (parseInt(arr[1]) + 1);
          //console.log(arr, tenorType, tenorinmonth)
        }

      } else {
        if (tenorType === 'Y') {
          tenorinmonth = (tenorNum * 12);
        } else {
          tenorinmonth = tenorNum;
        }
      }


    } else {
      tenorinmonth = 12;
    }

    if (this.autoFreq === 'Monthly' || this.callableFreq === 'Monthly' || this.putableFreq === 'Monthly') {
      fromchar = 'M';
      ddlValueCount = tenorinmonth;
    }
    if (this.autoFreq === 'Quarterly' || this.callableFreq === 'Quarterly' || this.putableFreq === 'Quarterly') {
      fromchar = 'Q';
      ddlValueCount = tenorinmonth / 3;
    }

    if (this.autoFreq === 'Semiannually' || this.callableFreq === 'Semiannually' || this.putableFreq === 'Semiannually') {
      fromchar = 'S';
      ddlValueCount = tenorinmonth / 6;
    }

    if (this.autoFreq === 'Yearly' || this.autoFreq === 'Daily' || this.callableFreq === 'Yearly' || this.putableFreq === 'Yearly' || this.callableFreq === 'Daily' || this.putableFreq === 'Daily') {
      fromchar = 'Y'
      ddlValueCount = tenorinmonth / 12;
    }

    for (let i = 0; i < ddlValueCount; i++) {
      this.autoNonCallArr.push({ Key: fromchar + (i + 1).toString(), Value: fromchar + (i + 1).toString() })
    }
//Changed by Jyoti S || FIN1EURINT-600 || 30-Aug-2023 || START
    if (this.autoNonCallArr && this.autoNonCallArr.length > 0) {
      const index = this.autoNonCallArr.findIndex(res => res.Value == this.autoNonCall);
      if (index < 0) {
        this.autoNonCall = this.autoNonCallArr[0].Value;   // Changed by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
      }else{
        this.autoNonCall = this.autoNonCallArr[index].Value;
      }
    }
//Changed by Jyoti S || FIN1EURINT-600 || 30-Aug-2023 || END
  }
  async txtTenorChange(e, type: any) {
    try {
      this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
      //this.reset();//Commented by Varsha G || FIN1EURINT-275 || 05-May-2023
      const target = await this.eccommon.GetEventTarget(e);
      const today = new Date();
      let strDate = '';
      const dayCount = 0;
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      if (target.value === undefined || target.value === '') {
        if (type === 'Strike') {
          target.value = '0D';
          this.stkshift = '0D';
        }
        if (type === 'Payment') {
          target.value = '7D';
          this.paymentshift = '7D';
        }
        if (type === 'Expiry') {
          target.value = '1Y';
          this.expshift = '1Y';
        }
      } else if (target.value.length === 1) {
        if (isNaN(target.value)) {
          target.value = '0' + target.value;
        } else {
          target.value = target.value + 'D';
        }
      } else if (target.value.length > 1 && target.value.length <= 3) {
        if (Number(target.value)) {
          target.value = target.value + 'D';
        }
      }
      //console.log(target.value);
      const str = target.value + '';
      if (str.substr(str.length - 1, 1).toUpperCase() === 'M') {
        // tslint:disable-next-line: radix
        if ((parseInt(str.substr(0, str.length - 1)) / 12) > 6) {
          this.ErrorMsg = 'Please enter valid date shifter.';
          return false;
        }
      }
      if (str.substr(str.length - 1, 1).toUpperCase() === 'Y') {
        // tslint:disable-next-line: radix
        if (parseInt(str.substr(0, str.length - 1)) > 6) {
          this.ErrorMsg = 'Please enter valid date shifter.';
          return false;
        }
      }

      if (type === 'Strike') {
        this.stkshift = target.value;

        this.Dates =  await this.echome.BBVAGetDates(this.Exchange(), str.toUpperCase(), '');
        strDate = this.eccommon.formatDate(this.Dates.MaturityDate);

        this.stkdate = strDate;

        this.Dates =  await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        this.settdate = this.eccommon.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        this.expdate = this.eccommon.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');


      }
      if (type === 'Payment') {
        this.paymentshift = target.value;

        this.Dates =  await  this.echome.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.stkdate);
        strDate = this.eccommon.formatDate(this.Dates.MaturityDate);

        this.settdate = strDate;
        this.Dates =  await  this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        this.expdate = this.eccommon.formatDate(this.Dates.MaturityDate);

      }
      if (type === 'Expiry') {
        this.expshift = target.value;
        if (this.expshift === 'Custom') {
          return true;
        } // Changed by Jyoti S || 09-May-2023
        // //console.log(target.value);
        if (str.toUpperCase() === '0B') {
          strDate = this.settdate;
        } else {
          this.Dates =  await this.echome.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.settdate);
          strDate = this.eccommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }
        this.expdate = strDate;
      }

      if (this.stkdate === '') {
        document.getElementById('txtstkdate').classList.add('error');
        this.ErrorMsg = 'Please enter valid strike date.';
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#txtstkdate")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.settdate === '') {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsg = 'Please enter valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      //console.log(this.stkdate, this.settdate);
      if (this.settdate !== undefined) {
        if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
          || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
          this.ErrorMsg = 'Please select valid strike date.';
          document.getElementById('txtstkdate').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#customSetDate")
          $('.validate-popup').delay(5000).fadeOut('slow');
        }
      }

      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#customSetDate")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
      }

      if (this.customSetDate === null) {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsg = 'Please enter valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsg + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  async ERPriceResponse(PPDetails) {
    try {
      const webMethod = this.interfaceUrl + 'eqd/Quote/CheckIfResponseReceived';
      const that = this;
      const parameters = {
        QuoteRequestID: PPDetails

      };
      return await this.http.post(webMethod, parameters).toPromise().then(async (data: any) => {
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
          that.Prices = data;
          await that.eccommon.setCLNReceivedPrices(that.Prices, 1);
          // Added by Yash Agrawal to keep price button disabled until first price is received
          this.Prices.forEach((item) =>{
            if(item.value != ""){
              this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
            }
          })
        let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
        if (invalidDataLength > 0) {
          //this.loadflag = false;
          return false;
        }
        else {
          return true;
          }
        }  
      );
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  intervalBookOrder: any;
  timeLeftBookOrder = 0;
  showOrderDetails(lp: any, rfq: any, item) {
    try {
      this.showOrderDetailsFlag = true;
      console.log(rfq,lp,item,"showOrderDetails APURVA console");
     // let UserGroup = AppConfig.settings.oRes.groupID;
      //if((this.BlockedUserGroups.indexOf(UserGroup)) != -1){
      // if(this.BlockedUserGroups.split(",").map(ele => ele.trim()).includes(UserGroup.trim())){
      //   console.log(this.showOrderDetailsFlag,"this.showOrderDetailsFlag in iF")//Changes done by Varsha G || FIN1EURINT-256 || 27-Apr-2023
      //   this.showBlockReason = true;
      //   this.successMessage = true;
      //   this.successMsgBookOrder = this.BlockUserMessage;

      // }
      //else{
        console.log(this.showOrderDetailsFlag,"this.showOrderDetailsFlag in else")
      if (item && item.EP_ValidUntilTime && item.EP_Quote_Response_At) {
        // item.EP_Quote_Response_At = "3/15/2022 2:26:56 PM"
        this.timeLeftBookOrder = (new Date(item.EP_ValidUntilTime).getTime() - new Date(item.EP_Quote_Response_At).getTime());

        this.timeLeftBookOrder = this.timeLeftBookOrder / 1000;

        if (this.timeLeftBookOrder > 0) {
          this.intervalBookOrder = setInterval(() => {

            if (this.timeLeftBookOrder > 0) {
              this.timeLeftBookOrder = this.timeLeftBookOrder - 1;
              // //console.log(this.timeLeft);
            } else if (this.timeLeftBookOrder === 0 || this.timeLeftBookOrder < 0) {

            }
          }, 1000);
        }
      }
     
      // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || end
      //this.ErrorMsgRFQpopup = ''; //Changes by Apurva K||07-May-2024||FIN1EURINT-720
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      this.successMsgBookOrder = "";
      this.errorMsgBookOrder = "";
      
      this.Issuer = lp;
      this.selectedRFQ = rfq;
      this.OrderType = this.ordertype; //Apurva K||FIN1EURINT-709||01-Apr-2024
      this.txtnotional = this.Notional;
      this.txtddlNoteCcy = this.ddlNoteCcy;
      this.txtClientPrice = '';
      this.txtStrike = this.Strike;
      this.txtTenor = this.expshift === 'Custom' ? this.customTenor : this.expshift;
      console.log(this.showOrderDetailsFlag,"this.showOrderDetailsFlag")
      if (this.SolveForvalue === 'IBPrice') {
        this.txtIBPrice = item.price;
      }
      if ((this.SolveForvalue === 'IBPrice' && this.format !== 'Swap') || (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap')) {
        this.txtIBPrice = (this.SolveForvalue === 'IBPrice' || this.SolveForvalue === 'Upfront') ? item.price : this.IBPrice;
        this.txtUpfront = (100 - parseFloat((this.SolveForvalue === 'IBPrice' || this.SolveForvalue === 'Upfront') ? item.price : this.IBPrice)).toFixed(2);
      }
      if (((this.SolveForvalue === 'IBPrice' || this.SolveForvalue === 'Upfront') && this.format === 'Swap') ||
        (this.SolveForvalue !== 'IBPrice' && this.SolveForvalue !== 'Upfront' && this.format === 'Swap')) {
        this.txtUpfront = (this.SolveForvalue === 'IBPrice' || this.SolveForvalue === 'Upfront') ? item.price : this.IBPrice;
        this.txtIBPrice = (100 - parseFloat((this.SolveForvalue === 'IBPrice' || this.SolveForvalue === 'Upfront') ? item.price : this.IBPrice)).toFixed(2);
      }
      this.txtClietYield = '';
      this.txtOrderType = this.ordertype; //Apurva K||FIN1EURINT-709||01-Apr-2024
      this.txtlimitLevel = '';
      this.txtEQCRef = '';
      this.txtComment = '';
      this.txtClientPrice = this.issuePrice;
      this.maxNotional = item.maxLimit && parseFloat(item.maxLimit) !== 0 && item.maxLimit !== '' ? parseFloat(item.maxLimit) : '0';//Changed by Varsha G || Changed from 5000000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
      this.minNotional = item.minLimit && parseFloat(item.minLimit) !== 0 && item.minLimit !== '' ? parseFloat(item.minLimit) : '0';//Changed by Varsha G || Changed from 250000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023

      // this.nonBestPriceRsnDD = 'Reason1';
      this.nonBestPriceRsnDD = 'Please Select';
      this.txtOthersRsn = '';
      // //console.log(this.BookingCenter[0].BookingCenterCode);
      if (this.BookingCenter && this.BookingCenter.length > 0) {
        // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav d.
        this.selectedBookingBranch = this.BookingCenter[0].BookingCenterCode;
      }
      this.txtShare = ''
      this.ShareBasket.forEach(item => {
        this.txtShare = this.txtShare + item.Code + ', '

      }
      )
      this.txtShare = this.txtShare.trim();
      var lastCharater = this.txtShare.split('').pop();

      if (lastCharater == ',')
        this.txtShare = this.txtShare.substring(0, this.txtShare.length - 1);

      this.tblAllocation = [];

      this.tblAllocation.push('');
      this.underlyingForLimit = "";
      this.remainingNotional = "0.00"
      // this.totalNotional = "300,000.00";
      this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
      this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
      // this.txtnotional.replace(/,/g, '')
      this.allocatedNotional = "0.00"
      this.allocatedNotionalArr = [0.00];
      this.allocatedRMArray = [''];
      this.allocatedClientArray = [''];
      this.allocatedCustomerArray = [''];

      this.orderBookedFlag = false;


      return false;
    
    } catch (error) {

    }
  }

  postBackMethod() {
    try {
      return false;
    } catch (error) {
      //console.log(error);
    }
  }
  formattedAmount(amt) {
    if (amt) {
      amt = amt.toString();
      return amt == '0' || amt == '' || amt == '0.00' ? 0.00 : parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else {
      return '';
    }
  }
  hideOrderDetails() {
    this.ErrorMsg = '';
    this.ErrorMsgTop = '';
    this.ordersuccessMsg = '';
    this.showOrderDetailsFlag = false;
    //this.ErrorMsgRFQpopup = ''; //Added by Apurva K||06-May-2024
    // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
    if (this.intervalBookOrder) {
      clearInterval(this.intervalBookOrder);
    }

    if (this.PrevQuoteShowOrderPopUp) {

      this.PrevQuoteShowOrderPopUp = false;
      this.apifunctions.prevQuoteOrderPopUp.next(false);

    }

   
    return false;
  }

  hideViewPopup() {
    this.ErrorMsg = '';
    this.ErrorMsgTop = '';
    this.ordersuccessMsg = '';
    this.showOrderDetailsFlag = false;
    this.minNotionalConfirm = false;

    if (this.viewRFQID && this.viewRFQID !== '') {
      this.viewOnly = false;
      this.apifunctions.showPricerScreeninViewModePopup.next(false);
    }
    return false;
  }
  async confirmOrder() {
    console.log("confirmOrder inside")
    this.orderLoadFlag = true// Added by YASH AGRAWAL
    // this.validateNotional();
    this.successMsgBookOrder = "";
    this.errorMsgBookOrder = "";
    this.warningMessage = false;
    //    var bookOrderDetails =  this.apifunctions.bookOrderUCP( 
    //        this.Issuer, this.selectedRFQ, this.totalNotional.replace(/,/g, ''));

    // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
    if (this.timeLeftBookOrder <= 0) {
      console.log("confirteimeleft issue inside")
      this.orderLoadFlag = false// Added by YASH AGRAWAL
      this.errorMsgBookOrder = "Cannot book order. Quote expired.";
      return false;
    }

    if (!this.isValidParameters()) {
      this.orderLoadFlag = false// Added by YASH AGRAWAL
      return false;
    }


    if (!this.confirmValidation1()) {
      this.orderLoadFlag = false// Added by YASH AGRAWAL
      return false;
    }

    //if (this.allocatedRMArray[0] === '' && (this.EQ_Login_Client_Mapping === 'NO' || this.EQ_Login_Client_Mapping === 'No')) {
      //Changes for FIN1EURINT-714|| 17-Apr-2024||Apurva K
    if (this.loggedInUsername === '' && (this.EQ_Login_Client_Mapping === 'NO' || this.EQ_Login_Client_Mapping === 'No')) {
      this.orderLoadFlag = false// Added by YASH AGRAWAL
      this.errorMsgBookOrder = "Please select valid RM name.";
      return false;
    }
    if (this.allocatedClientArray[0] === '' && (this.EQ_Login_Client_Mapping === 'YES' || this.EQ_Login_Client_Mapping === 'Yes')) {
      this.orderLoadFlag = false// Added by YASH AGRAWAL
      this.errorMsgBookOrder = "Please select valid client name.";
      return false;
    }

    let redirectYN = 'N';
    //Commented by Apurva K|| 14-May-2024||FIN1EURINT-723
    // var res : any = await this.apifunctions.RedirectOrderValidationChecks("", this.txtOrderType, this.txtlimitLevel.toString().replace(/,/g, ''), this.txtClietYield.toString(),
    //   parseFloat(this.txtUpfront) > 1 ? parseFloat(this.txtUpfront.toString()).toString() : (parseFloat(this.txtUpfront) * 100).toString(), this.SolveForvalue, this.Issuer, this.issuePrice, "", (this.templateMappingArr !== undefined && this.templateMappingArr.length > 0) ? this.templateMappingArr[0].template : 'EQC_Europe', this.txtnotional.replace(/,/g, ''), this.Code(), this.ddlNoteCcy, this.ddlNoteCcy, this.expshift);

    // if (res?.ValidationRemark !== 'Validation successful') {
    //   // this.errorMsgBookOrder = res;
    //   redirectYN = 'Y';
    //   // return false;
    // } else {
    //   redirectYN = 'N';
    // }

    let CustomerGridInfo = [];
    for (let i = 0; i < this.tblAllocation.length; i++) {
      let custID = '';
      let custName = '';

      if (this.allocatedCustomerArray && this.allocatedCustomerArray.length > 0) {
        custID = this.allocatedCustomerArray[i];
        const index = this.customerList?.findIndex(res => res.Customer_ID === this.allocatedCustomerArray[i]);
        if (index > -1) {
          custName = this.customerList[index].CustomerName;
        }

      }


      CustomerGridInfo.push({
        "Customer_ID": (this.EQ_Show_Order_Customer === 'Yes' || this.EQ_Show_Order_Customer === 'YES') ? custID : '',
        "Customer_Name": (this.EQ_Show_Order_Customer === 'Yes' || this.EQ_Show_Order_Customer === 'YES') ? custName : '',
        "Nominal_Amt": this.allocatedNotionalArr[i],
        "RM_ID": (this.EQ_Show_Order_RM === 'Yes' || this.EQ_Show_Order_RM === 'YES') ? this.allocatedRMArray[i] : '',
        //"RM_Name": (this.EQ_Show_Order_RM === 'Yes' || this.EQ_Show_Order_RM === 'YES') ? this.allocatedRMArray[i] : '',
        "RM_Name": (this.EQ_Show_Order_RM === 'Yes' || this.EQ_Show_Order_RM === 'YES') ? this.loggedInUsername : '', //Changes for FIN1EURINT-714|| 17-Apr-2024||Apurva K
        "Book_Name": (this.EQ_Login_Client_Mapping === 'Yes' || this.EQ_Login_Client_Mapping === 'YES') ? this.allocatedClientArray[i] : '',
      })
    }
    console.log(CustomerGridInfo,"CustomerGridInfo")
    //console.log(CustomerGridInfo);

    var bookOrderDetails: any = await this.echome.bookOrderUCP(
      //    this.Issuer, 
      "",//    advisoryReason,""
      this.selectedBookingBranch,
      this.txtClientPrice.toString().replace(/,/g, ''),
      this.txtClietYield.toString().replace(/,/g, ''),
      (this.nonBestPriceRsnDD === 'Others' || this.nonBestPriceRsnDD === 'Other') ? this.txtOthersRsn : this.nonBestPriceRsnDD, // confirmReason,  
      this.txtlimitLevel.toString().replace(/,/g, ''),
      "",
      "",
      "",
      "0", //margin=
      this.txtComment,
      this.txtOrderType,
      "", //PoolID=
      "", //PreTradeXml =
      this.selectedRFQ, // QuoteRequestId = //"1025750",
      "", // Allocated dropdwon changes based on config - added by PriyaL on 8Dec2021
      (this.EQ_Login_Client_Mapping === 'YES' || this.EQ_Login_Client_Mapping === 'Yes') ? this.loggedInUsername : this.loggedInUsername, //Changes for FIN1EURINT-714|| 17-Apr-2024||Apurva K
      redirectYN, //RedirectOrderID =
      this.allocatedNotional == 0 || this.allocatedNotional == '' ? 0.00 : this.allocatedNotional.toString().replace(/,/g, ''), // this.totalNotional.replace(/,/g, ''),  //orderQuantity: //"10000",
      "",
      CustomerGridInfo
    );


    //console.log(bookOrderDetails);
    this.orderLoadFlag = false// Added by YASH AGRAWAL
    if (bookOrderDetails && bookOrderDetails?.status !== undefined) {
      if (bookOrderDetails.status.toLowerCase() == "succeed") {

        //var str = bookOrderDetails.SavingMessage; //"Order(s) E000408I,E000409I Booked Successfully."
        var DealNo = bookOrderDetails.DealNo; // "E000408I,E000409I";
        var orderId = DealNo.split(',')[0];
        // //console.log( str.replace(/,/g, ' ').split(orderId)[0]);
        // //console.log( str.replace(/,/g, ' ').split(orderId)[1]);
        if (redirectYN === 'N') {

          this.successMsgBookOrder = bookOrderDetails.SavingMessage.replace(orderId + ',', '');

        } else {
          //Commented by Apurva K|| 14-May-2024||FIN1EURINT-723
          // Success message changes based on allocation - added by Pranav D. on 16Feb2022
          // if (this.tblAllocation.length > 1) {
          //   this.successMsgBookOrder = res?.ValidationRemark + '\nOrder(s) ' + bookOrderDetails.DealNo + ' redirected to dealer.';
          // } else {
          //   this.successMsgBookOrder = res?.ValidationRemark + '\nOrder(s) ' + DealNo.split(',')[0] + ' redirected to dealer.'
          // }
          this.quoteEmailFlg = false;
          this.warningMessage = true;
        }
        this.orderBookedFlag = true;
        this.successMessage = true;
        this.showOrderDetailsFlag = false;
        // this.apifunctions.refreshPreQuoteFlag.next(true);
        if (this.intervalBookOrder) {
          clearInterval(this.intervalBookOrder);
        }
      }
      else {
        this.errorMsgBookOrder = bookOrderDetails.message
        this.orderBookedFlag = false;

      }
    } else {
      this.errorMsgBookOrder = "Error occured while placing order.Please try again.";
      this.orderBookedFlag = false;

    }
    //console.log(this.successMsgBookOrder);
    //console.log(this.errorMsgBookOrder);
  }
  confirmValidation1() {

    if (!this.PrevQuoteShowOrderPopUp) {
      var index = this.priceProvidersArr.findIndex(item => item.rfq == this.selectedRFQ)
      //console.log(index);
      //console.log(this.priceProvidersArr[index]);
      if (this.priceProvidersArr[index].timer == 0) {
        //this.accordflag = false;
        // this.bookOrderFlag = false;
        this.showOrderDetailsFlag = false;
        return false;
      }
    }

    // if(this.allocatedNotional < parseFloat(this.priceProvidersArr[index].minLimit)){
    if (this.allocatedNotional < parseFloat(this.minNotional)) {
      console.log(this.allocatedNotional,"this.allocatedNotional",this.minNotional,"this.minNotional")
      this.errorMsgBookOrder = "Cannot place order. Allocated notional is less than the minimum permitted.";
      return false;
    }
    // if(this.allocatedNotional > parseFloat(this.priceProvidersArr[index].maxLimit)){
    if (this.allocatedNotional > parseFloat(this.maxNotional)) {
      // //console.log('greater than min price');
      this.errorMsgBookOrder = "Cannot place order. Allocated notional is greater than the maximum permitted.";
      return false;
    }
    if (parseFloat(this.allocatedNotional) !== parseFloat(this.totalNotional)) {
      // this.errorMsgBookOrder = "Sum of notionals is not equal to Order Quantity.";
      this.errorMsgBookOrder = "The Total of Quantities/ Notionals is not equal to the Order Quantity/ Notional."
      return false;
    }

    if (parseFloat(this.allocatedNotional) <= 0) {
      // this.errorMsgBookOrder = "Please enter valid Notional.";
      this.errorMsgBookOrder = "Please enter valid allocated notional.";
      return false;
    }

    let i = 0;
    var rtnFlg = true;
    const that = this;
    this.tblAllocation.forEach(function (element) {
      console.log(element)

      if (rtnFlg) {
        if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
          that.errorMsgBookOrder = "Please enter valid Notional.";
          //console.log('Please enter valid Notional123.');
          rtnFlg = false;
          // return false;
          // break;
        }
      }
      // if(!rtnFlg){}
      i++;
    });
    //console.log("AAAA:" + rtnFlg)
    if (!rtnFlg) {
      return false;
    }
    else {
      return true;
    }
  }

  isValidParameters() {
    try {


      if (this.sortedAllPrices.length > 0 &&
        this.sortedAllPrices[0].lp !== this.Issuer &&
        (this.nonBestPriceRsnDD === "" || this.nonBestPriceRsnDD === 'Please Select')) {
        this.errorMsgBookOrder = 'Please enter Non Best Price Reason';
        return false;
      }

      if (this.sortedAllPrices.length > 0 &&
        this.sortedAllPrices[0].lp !== this.Issuer &&
        (this.nonBestPriceRsnDD == "Others" || this.nonBestPriceRsnDD == "Other") && this.txtOthersRsn == "") {
        this.errorMsgBookOrder = 'Please enter Other Non Best Price Reason';
        return false;
      }



      if (this.txtOrderType === 'Limit' && (this.txtlimitLevel === '' || this.txtlimitLevel <= 0)) {
        ////console.log('Please enter Limit Price.');
        this.errorMsgBookOrder = 'Please enter Limit Price.';
        //this.orderflag = true;
        return false;
      }
      else if (this.txtOrderType === 'Limit' && this.underlyingForLimit === '') {
        ////console.log('Please enter Limit Price.');
        this.errorMsgBookOrder = 'Please select Underlying for Limit Level.';
        //this.orderflag = true;
        return false;
      }
      else {
        if (this.txtOrderType === 'Market') {
          this.txtlimitLevel = 0;
        }
        this.errorMsgBookOrder = '';
        // this.orderflag = false;
        return true;
      }
    }
    catch (error) {
      ////console.log("Error:", error);
    }

  }
  async chkAll(e) {
    this.ErrorMsg1 = '';

    const target = await this.commonfunctions.GetEventTarget(e);
    ////console.log(target.id, e, target.checked);
    let i = 0;
    if (target.checked) {
      this.allocatedNotional = '0';
      this.tblAllocation.forEach((element) => {
      
        (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = true;
        document.getElementById("Notional" + i).removeAttribute('disabled');
        document.getElementById("Select" + i).removeAttribute('disabled');
        this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
        this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional);
        i++;

      });
    }
    else {
      this.tblAllocation.forEach((element) => {
    
        (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = false;

        this.allocatedNotional = "0.00";
        this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional);
        this.tblAllocation = [];

        // this.tblAllocation.push('');
        this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
        this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
        this.allocatedNotional = "0.00"
        this.allocatedNotionalArr = [0.00];
        this.allocatedRMArray = [''];
        this.allocatedClientArray = [''];
        this.allocatedCustomerArray = [''];

        i++;
      });
    }
  }

  async chkAllocation(e, index: any) {

    this.ErrorMsg1 = '';
    const target = await this.commonfunctions.GetEventTarget(e);
    //console.log(target.id, e, target.checked);
    if (!(target.checked)) {
      this.allocatedNotional = parseFloat(this.allocatedNotional) - (parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.replace(/,/g, '')) || 0.00);
      this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional) || 0.00;
      this.tblAllocation.splice(index, 1);
      this.allocatedNotionalArr.splice(index, 1);
      this.allocatedRMArray.splice(index, 1);
      (<HTMLInputElement>document.getElementById("checkbox" + index)).checked = true;

    }
    let i = 0;
    let tempflag = true;
    this.tblAllocation.forEach((element) => {
      console.log(element);
      if (!(<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
        tempflag = false;
      }

      if (!tempflag) {
        (<HTMLInputElement>document.getElementById("checkboxAll")).checked = false;
      }
      else {
        (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
      }
      i++;
    });


  }

  async addNotional(e, rowindex) {
    this.ErrorMsg1 = '';
    await this.checkValidAllocateNotional(e, rowindex);


    e.target.value = parseFloat(e.target.value).toFixed(2);
    this.allocatedNotionalArr[rowindex] = e.target.value;
    if (this.errorMsgBookOrder !== "") {
      return false;
    }
    //console.log(this.allocatedNotionalArr);

    let sumarr = 0.00;
    for (let i = 0; i < this.allocatedNotionalArr.length; i++) {
      if ((<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
        sumarr += parseFloat(this.allocatedNotionalArr[i].toString().replace(/,/g, '')) || 0.00;
      }
    }
    //console.log(sumarr);
    ////console.log(this.allocatedNotional);
    this.allocatedNotional = sumarr.toFixed(2);
    //console.log(this.totalNotional);

    this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
    this.remainingNotional = this.remainingNotional.toFixed(2);
    ////console.log("B4 Fixing 2 Decimal" + target.value);

    //console.log(this.allocatedNotionalArr);

    //console.log("AddNotional:" + this.Notional, this.allocatedNotional, this.previousNotional, this.remainingNotional, this.totalNotional);

  }
  async checkValidAllocateNotional(e, rowindex) {
    try {
      const NotionalData = await this.commonfunctions.checkValidNotional(e);
      //console.log(NotionalData);
      if (NotionalData.ErrorMsg === '') {
        // this.Notional = NotionalData.Notional;
        if (NotionalData.Notional.includes(',')) {
          NotionalData.Notional = NotionalData.Notional.toString().replace(/,/g, '');
        }
        e.target.value = parseFloat(NotionalData.Notional).toFixed(0);
        this.allocatedNotionalArr[rowindex] = e.target.value; // copied formated value to allocated notional array - added by Pranav D on 16Feb2022
        this.errorMsgBookOrder = "";
      } else {
        this.allocatedNotionalArr[rowindex] = 0.00;
        e.target.value = 0.00;
        this.errorMsgBookOrder = NotionalData.ErrorMsg;
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }
  async setFormattedNotional(e,rowindex){
    try{
     await this.addNotional(e,rowindex);
     const formattedNotional = this.commonfunctions.checkValidNotional(e);
     if(formattedNotional.ErrorMsg === ''){
      e.target.value = formattedNotional.Notional;
      this.allocatedNotionalArr[rowindex] = e.target.value;
     }else{
      this.allocatedNotionalArr[rowindex] = 0.00;
      e.target.value = 0.00;
      this.errorMsgBookOrder = formattedNotional.ErrorMsg;
     }
    }catch (error){

    }

  }

  toggleSuccessMessage() {
    console.log("successMessage-",this.successMessage);
    console.log("warningMessage-",this.warningMessage);
    console.log("showBlockReason-",this.showBlockReason);
    this.successMessage = false;
    this.warningMessage = false;
    this.showBlockReason = false;
    if (this.PrevQuoteShowOrderPopUp) {
      this.PrevQuoteShowOrderPopUp = false;
      this.apifunctions.refreshPreQuoteFlag.next(true);
      this.apifunctions.prevQuoteOrderPopUp.next(false);
    }
  }  

}
