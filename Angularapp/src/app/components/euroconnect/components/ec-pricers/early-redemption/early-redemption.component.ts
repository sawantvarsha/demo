import {
  Component, OnInit, ElementRef, Input, OnDestroy, ViewChild, Output, EventEmitter,
  Renderer2, AfterViewInit,NgZone
} from '@angular/core';


import { DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';

import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { FindValueSubscriber } from 'rxjs/internal/operators/find';      // Removed by Vaibhav B | 03-03-2023 | imported but haven't used

import { environment } from 'src/environments/environment';

import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services/config.service';
// import {toggle} from '../../../../../../assets/Euroconnect/'

// import { table } from 'console';

declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    ERsortBy(p): Array<T>;
  }
}
Array.prototype.ERsortBy = function (p): Array<any> {
  try {
    // tslint:disable-next-line: only-arrow-functions
    if (this !== undefined) {
      if (this.length > 0) {
        if (this[0].solveFor !== 'Coupon' && this[0].solveFor !== 'RebateCoupon') {
          return this.slice(0).sort(function (a, b) {
            //       return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
            return (Number(a[p]) > Number(b[p])) ? 1 : (Number(a[p]) < Number(b[p])) ? -1 : 0;

          });

        }
        else {
          return this.slice(0).sort(function (a, b) {
            //        return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
            return (Number(a[p]) < Number(b[p])) ? 1 : (Number(a[p]) > Number(b[p])) ? -1 : 0;

          });
        }
      }
    }

  } catch (error) { }
};
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};


@Component({
  selector: 'app-early-redemption',
  templateUrl: './early-redemption.component.html',
  styleUrls: ['./early-redemption.component.scss']
})



export class EarlyRedemptionComponent implements OnInit, OnDestroy {

  // @ViewChild('countrySel', { static: false }) countrySel: MatSelect;
  pageActive: Boolean = true;
  countrySel = new UntypedFormControl();
  languageSel = new UntypedFormControl();
  //SSSSSS
  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  @Input() PrevQuoteShowOrderPopUp: any;
  @Input() ErrorMsgRFQpopup: any;// Added by Apurva
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

  @ViewChild('RFM') RFM: ElementRef; //Added by Apurva K|| 11-Mar-2024|| FIN1EURINT-704
  @ViewChild('focusable', { static: false }) namefield: ElementRef;
  timeoutMsg = '';
  reqSuccessMsg: string;
  selectedBIndex = 0;
  showSuggestions = false;
  // Currency: string;
  flag: boolean;
  public shares: any = [];
  ShareName: string;
  shareCode: any;
  exchngCode: any;
  selectedShareIndex = 0;
  ShareBasket: any = [];
  settdate = '';
  stkdate = '';
  expdate = '';
  orderLoadFlag: boolean = false// Added by YASH AGRAWAL
  ddlNoteCcy: any;
  txtddlNoteCcy: any;
  UnderlyingCurrency = 'EUR';
  CCY = [];
  ReceivedCCY:any = [];
  SolveForvalue: any;
  ccyChange: any;
  IBPrice: any;
  Coupon: any;
  sortedAllPrices: any = [];
  bestLPArray: any = [];
  AllPrices = [];
  Prices = [];
  Strike: any;
  interfaceUrl = environment.interfaceURL;
  asseturl = environment.asseturl;
  SelectedUnderlyingarray = [];
  SelectedUnderlyingBasketArray = [];
  SelectedUnderlyingBasket: any = {
    UnderlyingOne: {},
    UnderlyingTwo: {},
    UnderlyingThree: {},
    UnderlyingFour: {},
    UnderlyingFive: {},

  };
  Code: any;
  RICCode: any;
  Exchange: any;
  Notional: any;
  CouponBarrier: any;
  loadflag = false;
  variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  orderID: any;
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg = '';
  clearFlag: boolean;
  format: any;
  templateMappingArr: any;
  Product = 'AutocallablePhoenixER';
  autoTrigger: any;
  cpnTrigger: any;
  autoFreq: any;
  cpnFreq: any;
  autoStepDown: any;
  cpnType: any;
  autoNonCall: any;
  cpnObservation: any;
  cpnCoupon: any;
  fundType: any;
  fundFreq: any;
  fundRate: any;
  barrierLevel: any;
  barrierType: any;
  altLevel: any;
  altObservation: any;
  altCoupon: any;
  rfqID: any;  
  noteMasterID: any;
  altcouponFlag: any;
  autocallCoupon: any;
  autocallCouponType: any;
  autocallCouponYN: any;
  autoNonCallYN: any;
  autoStepDownYN: any;
  MemoryPeriods: any;
  Dates: any = [];
  NoteMasterID: any;
  orderStatus: any;
  saveFlag = false;
  quoteEmailFlg = false;
  successMsg: any;
  errorTemplateMessage = '';
  replySolveFor: any;
  validationArr: any;
  minTrigger: any;
  maxTrigger: any;
  minStepdown: any;
  maxCoupon: any;
  minCoupon: any;
  minBarrier: any;
  minStrike: any;
  minReoffer: any;
  issuePrice: any;
  defaultRFQTimeout: number;
  defaultOrderTimeout: number;
  showSaveNShare: string;
  BlockedUserGroups:any;
  showBlockReason = false;
  BlockUserMessage: any;
  tempXML = '';
  checkNotionalRes: any;
  viewOnly = false;

  stkshift: any;
  stkshiftFwd : any = 'Fwd'
  stkshiftTdy : any = '0B'
  paymentshift: any;
  expshift: any;

  portfolioId: any;
  allBooksData: any = [];
  onBehalfOf = '';
  buttonList: any = '';
  portfolioGroupID: any = '';
  LeverageYN: any = 'Yes';//Chnaged by Jyoti S || 29-Jun-2023
  LeverageFlag = false;
  // View TS flag and timer
  //TSTimeout = 180; 
  TSTimeout = 300;  //Changes by Apurva K || 18-May-2023
  TSInterval: any;
  KIDInterval: any;
  TSFlag = false;
  KIDFlag = false;
  autoFreqArr: any = [];
  freqArr = ['1m', '2m', '3m', '4m', '6m', '12m'];
  ERPriceSubscription: Subscription;
  TriggerValueArr: any;
  manualTriggerValueArr: any; // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023 
  autoTriggerPopup = false;
  manualTriggerPopup = false; // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
  cpnTriggerPopup = false;
  fundRatePopup = false;
  priceoptionflag = false;
  saveoptionflag = false;
  showSchedulePopupFlag = false;
  showsaveSharePopupFlag = false;
  updateMessagePopupFlag = false;
  GetClientProdDetailsArr: any;
  // priceBtnActive = 'N';
  priceBtnActive = 'Y'; // set default to 'Y'|| added by PriyaL || 22Apr2022
  mappedformatlist: any;

  // ssss
  userName: string;
  loggedInUsername:any; //Changes for FIN1EURINT-714|| 17-Apr-2024||Apurva K
  selectedUserIndex = 0;
  showSuggestions_User = false;
  userflag: boolean;
  users: any;
  // userName: string;
  userCode: any;
  selectedBIndex_User = 0;
  userBasket = [];
  currentowner: any;
  saveportfolioId = '';
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  priceProvidersArr: any = [];
  priceProvidersArrCpy: any = [];
  showOrderDetailsFlag = false;
  Issuer: any;
  selectedRFQ: any;
  selectedBookingBranch: any;
  OrderType: any;
  LimitAmount: any;
  eqcRef: any;
  ErrorMsg1: any;
  minNotional: any;
  maxNotional: any;
  tblAllocation = [];
  allocatedNotional: any = 0;
  remainingNotional: any = 0;
  previousNotional: any = 0;
  totalNotional: any = "300,000.00";
  poolActivateDate: any;
  poolExpiryDate: any;
  minPoolNotional: any;
  maxPoolNotional: any;
  minOrderSize: any;
  Denomination: any;
  poolDetailsVisibleFlag = false;
  ordersuccessMsg: any;
  poolErrorMsg: any;
  poolSuccessMsg: any;
  ErrorMsgTop: any;


  allocatedNotionalArr: any = [0.00];
  allocatedRMArray: any = [''];
  viewRFQ = '';
  templateName = '';


  txtnotional: any;
  txtIBPrice: any;
  txtClientPrice: any;
  txtStrike: any;
  txtTenor: any;
  txtUpfront: any;
  txtClietYield: any;
  txtOrderType: any;
  txtlimitLevel: any;
  underlyingForLimit: '';
  txtEQCRef: any;
  txtComment: any;
  txtOthersRsn: any;
  nonBestPriceRsnDD: any;



  txtShare: any;
  RMList:any = [];
  customerList:any = [];
  BookingCenter:any = [];
  successMsgBookOrder: string = "";
  errorMsgBookOrder: string = "";
  orderBookedFlag = false;
  successMessage: boolean;
  warningMessage: boolean;
  // selectedSharesData = [];
  priceClickFlag = false;


  basketType = 'Worst-Of';
  publicOrPrivate = 'Private Placement';
  listed = 'N';
  stockExchange = 'SIX Swiss Exchange';
  stockExchangeArr: any = [];
  quanto = 'No';
  priipsYN = 'Yes';
  country = 'UK'; //Changes by Apurva K || 21-Dec-2023
  language = 'English'; //Changes by Apurva K || 18-May-2023
  termsheetTypeYN = 'Y';
  termsheetType = 'Standard';
  customTenor = '';
  autocallableFrom = 'M1';
  startingAutocall = '100.00';
  PutableBarrier = '';
  cpnInFine = 'No';
  cpnFixing = 'In Advance';
  cpnFltRef = 'EUR001M Index';
  cpnFloor = '0.00';
  cpnCap = '';
  cpnMultiplier = '100.00';
  rangeAccrualFreq = 'Daily';
  lowCpnBarrier = '';
  upperCpnBarrier = '';
  upfrontFee = '';
  callableFreq = '';
  putableFreq = '';
  cpnSpread = '';
  upperPutStrike = '';
  lowerPutStrike = '';
  putSpreadGearing = '100.00';
  upsideType = 'None';
  callStrike = '';
  callGearing = '';
  lowerCallStrike = '';
  upperCallStrike = '';
  callSpreadGearing = '';
  leverage = '100.00';
  ProtectionLevel = '';
  KIBarrier = true;
  countryArr = [];
  allSelected = false;

  // dropdown arrays
  commonData:any = [];
  AutocallableFrom = [];
  AutocallFrequency = [];
  BarrierOneTouchorNOtouch = [];
  BasketType = [];
  CallableFrequency = [];
  CallableFrom = [];
  Channel = [];
  CountryofDistribution = [];
  CouponBarrierType = [];
  CouponFrequency = [];
  CouponType = [];
  Currency = [];
  EarlyRedemptionType = [];
  FinalUpside = [];
  FixingDetermination = [];
  Format = [];
  IssueDateOffset = [];
  KIDs = [];
  ProtectionType = [];
  PublicorPrivate = [];
  PutableFrequency = [];
  PutableFrom = [];
  RangeAccrualFrequency = [];
  SettlementMethodArr = [];
  SolveFor = [];
  StaticFundingType = [];
  StockExchange = [];
  SwapFloatingReference = [];
  CouponTypeArr = [];
  Tenor = [];
  StrikeArr = [];
  Termsheets = [];
  UnderlyingStrikeType = [];
  YieldFloatingReference = [];
  NonBestPriceReasonArr = [];

  defaultvaluesArr:any = [];
  ERCpnType = '';
  ERCoupon = '';
  periodicCouponFlag = 'Yes';
  SettlementMethod = 'Cash';
  portfolio = '';
  portfolioIdArr: any = [];
  portfolioName = '';
  UserRolesArr:any = [];
  selectedVariantName = '';
  autoNonCallArr: any = [];
  bookOrderFlag = true;
  ERCouponTooltipValue: any;
  CouponTooltipValue: any;

  //Start || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K
  MinimumAllowedIssueDateOffset:any;  
  //End || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K

  LanguageArr1: any = [{ 'Key': 'Czech', 'Value': 'Czech' },
  //{ 'Key': 'Czechia', 'Value': 'Czechia' },
  { 'Key': 'Dutch', 'Value': 'Dutch' },
  { 'Key': 'English', 'Value': 'English' },
  { 'Key': 'Finnish', 'Value': 'Finnish' },
  { 'Key': 'French', 'Value': 'French' },
  { 'Key': 'Galician', 'Value': 'Galician' },
  { 'Key': 'German', 'Value': 'German' },
 // { 'Key': 'Greece', 'Value': 'Greece' }, //Commented by Apurva K|| suggested by Kundan/Vipul|| 05-Jun-2023
  { 'Key': 'Greek', 'Value': 'Greek' },
 // { 'Key': 'Guernsey', 'Value': 'Guernsey' },
  { 'Key': 'Hungarian', 'Value': 'Hungarian' },
  { 'Key': 'Italian', 'Value': 'Italian' },
 // { 'Key': 'Italy', 'Value': 'Italy' },
  { 'Key': 'Norwegian', 'Value': 'Norwegian' },
  { 'Key': 'Polish', 'Value': 'Polish' },
  { 'Key': 'Portuguese', 'Value': 'Portuguese' },
  { 'Key': 'Russian', 'Value': 'Russian' },
  { 'Key': 'Spanish', 'Value': 'Spanish' },
  { 'Key': 'Swedish', 'Value': 'Swedish' },
  ];
  solveForArr: any =
    [
      { 'Key': ' Coupon (%)', 'Value': 'Coupon' },
      { 'Key': ' Coupon Barrier Level (%)', 'Value': 'CouponBarrier' },
      { 'Key': ' KI Barrier (%)', 'Value': 'KI' },
      { 'Key': 'Put Strike (%)', 'Value': 'PutStrike' },
      { 'Key': ' Reoffer (%)', 'Value': 'IBPrice' },
      { 'Key': 'Spread (%)', 'Value': 'Spread' },
      { 'Key': ' Upfront Fee (%)', 'Value': 'Upfront' }
    ];
  LanguageArr = [];
  ProtectionFlag: boolean = false;  //Added by ApurvaK for frequency dropdown
  //<!--Added by Apurva C||19-Oct-->
  activeTab: any = 'Pricing';

  //  add allocation table changes for dropdown - added by PriyaL on 08Dec2021
  EQ_Show_Order_RM = 'NO';
  EQ_Show_Order_Customer = 'NO';
  EQ_Login_Client_Mapping = 'NO';
  allocatedClientArray: any = [''];
  allocatedCustomerArray: any = [''];

  accessRight = 'All'; // save and share change- added by PriyaL on 07Dec2021
  isDealer = true; // Dealer flag - added by PriyaL on 08Dec2021 
  DealerValue

  dailyKOYN = 'No';
  minNotionalConfirm = false;

  // new config variable || PriyaL || 05Apr2022 || Assigned by PranavD
  EQ_Show_Launch_Button = 'NO';
  EQ_Show_Order_Button = 'NO';
  // new config variable || Amogh k || 19Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';

  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';

  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsPopupLabels: Object[] = [];
  docSupportStatus: any = {};

  private intervals: Set<NodeJS.Timeout>;

  customSetDate: number = 1;

  //For default value setup values
  SolveForDropdown: any=[];
  FundTypeDropdown: any =[];
  autoCpnDropdown: any=[];
  periodicCpnDropdown: any=[];
  rangeFreqDropdown: any = [];
  UpfrontIBPrice: string;
  basketTypeDropdown: any=[];
  publicPrivateDropdown: any=[];
  stockExchangeDropdown: any=[];
  languageDropdown: any=[];
  countryDropdown: any=[];
  termsheetDropdown: any=[];
  issueDateDropdown: any=[];
  TenorDropdown: any=[];
  settlementMethodDropdown: any=[];
  fundFreqDropdown: any=[];
  autocallCpnDropdown: any=[];
  autoFreqDropdown: any=[];
  putableFreqDropdown: any = [];
  callableFreqDropdown: any = [];
  barrierTypeDropdown: any=[];
  periodicCpnTypeDropdown: any=[];
  cpnBarrierTypeDropdown: any=[];
  rangeAccFreqDropdown: any=[];
  cpnFreqDropdown: any=[];
  CurrDropdown: any =[];
  FormatDropdown:any=[];
  autocallableFromDropdown: any=[];
  languageDropdown1: any = [];
  countryDropdown1: any=[];

  CurrencyYN: any = 'Y';
  selectedCurrency: any;
  FormatYN: any = 'Y';
  selectedFormat: any;
  SolveForYN: any = 'Y';
  selectedSolveFor: any;
  UnderlyingYN: any = 'Y';
  notionalYN: any = 'Y';
  reofferPriceYN: any = 'Y';
  maxReofferPrice: any;
  minReofferPrice: any;
  upfrontYN: any = 'Y';
  maxUpfront: any;
  minUpfront: any;
  issuePriceYN: any = 'Y';
  maxIssuePrice: any;
  minIssuePrice: any;
  selectedBasketType: any;
  basketTypeYN: any = 'Y';
  selectedOption: any;
  publicPrivateYN: any = 'Y';
  quantoYN: any = 'Y';
  listedYN: any = 'Y';
  selectedStockExchange: any;
  stockExchangeYN: any = 'Y';
  priipsPopupYN: any = 'Y';
  languageYN: any = 'Y';
  selectedLanguage: any;
  countryYN: any = 'Y';
  selectedCountry: any;
  termsheetYN: any = 'Y';
  selectedTermsheet: any;
  ShifterDateYN: any = 'Y';
  issueDateOffsetYN: any = 'Y';
  selectedIssueDateOffset: any;
  TenorYN: any = 'Y';
  selectedTenor: any;
  selectedSettlementMethod: any;
  settlementMethodYN: any = 'Y';
  selectedFundType: any;
  FundTypeYN: any = 'Y';
  FundFreqYN: any = 'Y';
  selectedFundFreq: any;
  RateSpreadYN: any = 'Y';
  maxRateSpread: any;
  minRateSpread: any;
  SelectedautocallType: any;
  AutocallTypeYN: any = 'Y';
  autocallFrequencyYN: any = 'Y';
  selectedAutocallFrequency: any;
  autocallableFromYN: any = 'Y';
  SelectedAutocallableFrom: any;
  autocallBarrierYN: any = 'Y';
  minAutocallBarrier: any;
  maxAutocallBarrier: any;
  stepdownYN: any = 'Y';
  StepdownMax: any;
  StepdownMin: any;
  putableBarrierLevelYN: any = 'Y';
  maxPutableBarrierLevel: any;
  minPutableBarrierLevel: any;
  protectionTypeYN: any = 'Y';
  SelectedProtectionType: any;
  payoffFrequencyYN: any = 'Y';
  SelectedPayoffFrequency: any;
  putStrikeYN: any = 'Y';
  maxPutStrike: any;
  minPutStrike: any;
  protectionLvlYN: any = 'Y';
  maxProtectionLvl: any;
  minProtectionLvl: any;
  upperPutStrikeYN: any = 'Y';
  maxUpperPutStrike: any;
  minUpperPutStrike: any;
  putGearingYN: any = 'Y';
  maxPutGearing: any;
  minPutGearing: any;
  lowerPutStrikeYN: any = 'Y';
  maxLowerPutStrike: any;
  minLowerPutStrike: any;
  popupKIBarrierYN: any = 'Y';
  maxPopupKIBarrier: any;
  minPopupKIBarrier: any;
  putSpreadGearingYN: any = 'Y';
  maxPutSpreadGearing; any;
  minPutSpreadGearing: any;
  callStrikePercYN: any = 'Y';
  maxCallStrikePerc: any;
  minCallStrikePerc: any;
  lowerCallStrikePercYN: any = 'Y';
  maxLowerCallStrikePerc: any;
  minLowerCallStrikePerc: any;
  callGearingYN: any = 'Y';
  maxCallGearing: any;
  minCallGearing: any;
  upperCallStrikeYN: any = 'Y';
  maxUpperCallStrike: any;
  minUpperCallStrike: any;
  callSpreadGearingYN: any = 'Y';
  maxCallSpreadGearing: any;
  minCallSpreadGearing: any;
  autoCouponTypeYN: any = 'Y';
  selectedAutoCouponType: any;
  ERCouponPaYN: any = 'Y';
  maxERCouponPa: any;
  minERCouponPa: any;
  periodicCouponYN: any = 'Y';
  selectedPeriodicCoupon: any;
  periodicCpnTypeYN: any = 'Y';
  selectedPeriodicCpnType: any;
  cpnBarrierTypeYN: any = 'Y';
  selectedCpnBarrierType: any;
  rangeAccFreqYN: any = 'Y';
  selectedRangeAccFreq: any;
  cpnBarrierLvlYN: any = 'Y';
  maxCpnBarrierLvl: any;
  minCpnBarrierLvl: any;
  periodicCpnFreqYN: any = 'Y';
  selectedPeriodicCpnFreq: any;
  FloatingRefIndex: any = 'Y';
  selectedFloatingRefIndex: any;
  couponPaPercYN: any = 'Y';
  maxCouponPaPerc: any;
  minCouponPaPerc: any;
  floatingRefIndexYN: any = 'Y';
  cpnInFineYN: any = 'Y';
  putableFreqYN: any = 'Y';
  selectedPutableFreq: any;
  callableFreqYN: any = 'Y';
  selectedCallableFreq: any;

  CurrencyUpdatedBy: any;
  CurrencyUpdatedAt: any;
  FormatUpdatedBy:any;
  FormatUpdatedAt:any;
  SolveForUpdatedBy:any;
  SolveForUpdatedAt:any;
  UnderlyingsUpdatedBy:  any;
  UnderlyingsUpdatedAt: any;
  NotionalUpdatedBy:  any;
  NotionalUpdatedAt: any;
  ReofferPriceUpdatedBy:  any;
  ReofferPriceUpdatedAt: any;
  UpfrontUpdatedBy: any;
  UpfrontUpdatedAt: any;
  IssuePriceUpdatedBy: any;
  IssuePriceUpdatedAt: any;
  BasketTypeUpdatedBy: any;
  BasketTypeUpdatedAt: any;
  PublicPrivateUpdatedBy: any;
  PublicPrivateUpdatedAt: any;
  QuantoUpdatedBy: any;
  QuantoUpdatedAt: any;
  ListedUpdatedBy: any;
  ListedUpdatedAt: any;
  StockExchangeUpdatedBy: any;
  StockExchangeUpdatedAt: any;
  PriipsUpdatedBy: any;
  PriipsUpdatedAt: any;
  LanguageUpdatedBy: any;
  LanguageUpdatedAt: any;
  CountryUpdatedBy: any;
  CountryUpdatedAt: any;
  TermsheetUpdatedBy: any;
  TermsheetUpdatedAt: any;
  StrikeShifterDateUpdatedBy: any;
  StrikeShifterDateUpdatedAt: any;
  StrikeShifterDateTypeUpdatedBy: any;
  StrikeShifterDateTypeUpdatedAt: any;
  IssueDateOffsetUpdatedBy: any;
  IssueDateOffsetUpdatedAt: any;
  TenorUpdatedBy: any;
  TenorUpdatedAt: any;
  SettlementMethodUpdatedBy: any;
  SettlementMethodUpdatedAt: any;
  FundTypeUpdatedBy: any;
  FundTypeUpdatedAt: any;
  FundingFrequencyUpdatedBy: any;
  FundingFrequencyUpdatedAt: any;
  FundingRateSpreadUpdatedBy: any;
  FundingRateSpreadUpdatedAt: any;
  AutocallTypeUpdatedBy: any;
  AutocallTypeUpdatedAt: any;
  AutocallFrequencyUpdatedBy: any;
  AutocallFrequencyUpdatedAt: any;
  PutableFrequencyUpdatedBy: any;
  PutableFrequencyUpdatedAt: any;
  CallableFrequencyUpdatedBy: any;
  CallableFrequencyUpdatedAt: any;
  AutocallableFromUpdatedBy: any;
  AutocallableFromUpdatedAt: any;
  AutocallBarrierUpdatedBy: any;
  AutocallBarrierUpdatedAt: any;
  StepUpDownUpdatedBy: any;
  StepUpDownUpdatedAt: any;
  PutableBarrierLevelUpdatedBy: any;
  PutableBarrierLevelUpdatedAt: any;
  ProtectionTypeUpdatedBy: any;
  ProtectionTypeUpdatedAt: any;
  PutStrikeUpdatedBy: any;
  PutStrikeUpdatedAt: any;
  ProtectionLevelUpdatedBy: any;
  ProtectionLevelUpdatedAt: any;
  UpperPutStrikeUpdatedBy: any;
  UpperPutStrikeUpdatedAt: any;
  PutGearringUpdatedBy: any;
  PutGearringUpdatedAt: any;
  LowerPutStrikeUpdatedBy: any;
  LowerPutStrikeUpdatedAt:any;
  BarrierLevelUpdatedBy: any;
  BarrierLevelUpdatedAt: any;
  PutSpreadGearingUpdatedBy: any;
  PutSpreadGearingUpdatedAt: any;
  CallStrikeUpdatedBy: any;
  CallStrikeUpdatedAt: any;
  LowerCallStrikeUpdatedBy: any;
  LowerCallStrikeUpdatedAt: any;
  CallGearringUpdatedBy: any;
  CallGearringUpdatedAt: any;
  UpperCallStrikeUpdatedBy: any;
  UpperCallStrikeUpdatedAt: any;
  CallSpreadGearingUpdatedBy: any;
  CallSpreadGearingUpdatedAt: any;
  AutocallCouponTypeUpdatedBy: any;
  AutocallCouponTypeUpdatedAt: any;
  ERCouponPaUpdatedBy: any;
  ERCouponPaUpdatedAt: any;
  AddPeriodicCpnUpdatedBy: any;
  AddPeriodicCpnUpdatedAt: any;
  PeriodicCpnTypeUpdatedBy: any;
  PeriodicCpnTypeUpdatedAt: any;
  CouponBarrierTypeUpdatedBy: any;
  CouponBarrierTypeUpdatedAt: any;
  RangeAccuralFreqUpdatedBy: any;
  RangeAccuralFreqUpdatedAt: any;
  PeriodicCpnFreqUpdatedBy: any;
  PeriodicCpnFreqUpdatedAt: any;
  CouponBarrierLevelUpdatedBy: any;
  CouponBarrierLevelUpdatedAt: any;
  CouponPaPercUpdatedBy: any;
  CouponPaPercUpdatedAt: any;
  CouponInFineUpdatedBy: any;
  CouponInFineUpdatedAt: any;
//<Added by Apurva K|| 10-Aug-2023||HSBCECCLI-32>
  matchBtnFlag: boolean = false; 
  EQ_EnablePriceMatch: string = "N";
  EQ_PriceMatch_LPName: string;
  matchLoadflag:boolean = false;
//</Added by Apurva K|| 10-Aug-2023||HSBCECCLI-32>
//Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
 BookOrderDisabledForCpty = true;
 OrderDisabledCpty: string;
 //Added by Apurva K|| 27-Mar-2024||FIN1EURINT-708
 ordertype:any;
 OrderTypeDropdown:any = [];
 OrderTypeYN: any = 'Y';
 OrderTypeArr:any = [];
 OrderTypeUpdatedAt:any;
 OrderTypeUpdatedBy:any;
  RfmRequestCount: any;

  constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, public datepipe: DatePipe, private route: ActivatedRoute,
    private renderer: Renderer2,public http: HttpClient,private ngZone: NgZone) {
    try {
      this.portfolioId = '';
      this.flag = false;
      this.shares = [];
      this.ddlNoteCcy = 'EUR';
      this.UnderlyingCurrency = 'EUR';
      this.format = 'Note';
      this.autoNonCallYN = 'N';
      this.autoStepDownYN = 'N';
      this.autocallCouponYN = 'N';
      this.successMessage = false;
      this.warningMessage = false;
      this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
      this.intervals = new Set<NodeJS.Timeout>();//Added by Varsha G || 23-Jun-2023
      this.ordertype = 'MOC';//Added by Apurva K || 27-Mar-2024 ||FIN1EURINT-708
      this.loggedInUsername = AppConfig.settings.oRes.userName; //Apurva K||17-Apr-2024
      this.RfmRequestCount = 0; // Added by Apurva K
    } catch (error) {
      //console.log('Error', error);
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

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');

    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          //console.log('Arrow buttons clicked');
        });
      });
    }
  }


  monthSelected(date: Moment) {
    console.log('month changed' , date);
  }

  priipsChanged(val) {
    this.reset();//Changed by Varsha G || To stop loader on change of priips ||Suggested by Yash A || 21-Apr-2023
    this.priipsYN = val;

    //Changed by Apurva K|| 18-May-2023|| To keep the language and country dropdown as it is with default values
    // if (this.priipsYN === 'No') {
    //   //console.log("priips change to no")
    //   this.language = '';
    //   this.country = '';
    // }

  }
  dateChanged() {
    this.scheduleMsg = '';
    this.ErrorMsgTop = '';
    // this.calendar.activeDate = this.selectedDate;
    this.inputDate = this.selectedDate.format('DD-MMM-YYYY');
    this.inputTime = this.selectedDate.format('HH:mm');
    //console.log(this.inputTime);

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

  positionDropdown() {
    //console.log("Clicked")
    $("div.cdk-overlay-pane").addClass("adjust-dropdown");
  }

  ngOnDestroy(): void {
    this.pageActive = false;
    this.timeLeft = -1;
    this.timeoutMsg = '';

    clearInterval(this.interval);
    
    this.TSFlag = false;
    //clearInterval(this.TSInterval);
    //clearInterval(this.KIDInterval);
    this.clearAllDocIntervals();
    this.AllPrices = [];
    this.sortedAllPrices = [];
    this.commonfunctions.setERReceivedPrices({}, '');
    if (this.ERPriceSubscription) {
      this.ERPriceSubscription.unsubscribe();
    }
  }

 ngOnInit() {
    this.pageActive = true;
    this.minNotionalConfirm = false;
    try {
      this.pageloadflag=true;
      $('#loading').show();
      this.viewOnly = this.viewOnlyFlag ?? this.viewOnly; // Added by Jyoti S || 30-Jun-2023 || FIN1EURINT-511
      setTimeout(async () => {
        // this.RMList = this.apifunctions.Get_RMList();
        this.docSupportStatus = await this.apifunctions.GetDocumentSupportStatus('EQC_Europe');//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
        this.LanguageArr = [];
        for (let j = 0; j < this.LanguageArr1?.length; j++) {
          if (this.LanguageArr1[j].Value !== '') {
            this.LanguageArr.push(this.LanguageArr1[j].Value);
          }

        }

        let UserGroup = AppConfig.settings.oRes.groupID;       
        this.UserRolesArr = await this.apifunctions.GetCommonDataReason("CSP_UserRoles");//Added by Varsha G || 01-June-2023
        const matchedGroup = this.UserRolesArr?.filter((obj)=>{
          return obj.Misc1 === UserGroup;
        })
        if(matchedGroup?.[0]?.Data_Value?.toUpperCase() === "DEALER"){
          this.isDealer = true;
        }else{
          this.isDealer = false;
        }

        //this.DealerValue = this.apifunctions.checkLoginBookName();//Temp comment AK
        this.DealerValue = this.isDealer
        
        // // this.BookingCenter = this.apifunctions.GetBookingCenter();
        this.portfolioIdArr = [];

        this.portfolioIdArr = await this.apifunctions.BBVAGetPortfolio('AutocallablePhoenixER', 'Single Pricer');
        if (this.portfolioIdArr?.length > 0) {
          this.portfolioIdArr.splice(0, 0, {
            AccessDetail: "ALL",
            Created_At: "",
            P_ID: "",
            P_Name: "",
            ProdType: "",
            ShareType: "ALL",
            created_by: "",
          });
          this.portfolioIdArr.map(r => {
            let item = r;
            item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
            return item;
          });
        }
        //console.log(this.portfolioIdArr);
        //console.log(this.RMList);
        //console.log(this.BookingCenter);


        // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
        //   this.allBooksData = this.apifunctions.getAllBooksMappedToLogin();
        // }
        // if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
          //Commented by Apurva K|| 07-Jul-2023|| As discussed with Nitish K for removing extra call to GetAllShareDetails
       // this.shares = await this.apifunctions.BBVALoadShares('EQ,IDX', "", "EQC_Europe");
        // }

        if (this.apifunctions.CCY === undefined || this.apifunctions.CCY?.length <= 0) {
          this.ReceivedCCY = await this.apifunctions.BBVALoadCCY();
        }
        
        if (this.apifunctions.validationArr === undefined || this.apifunctions.validationArr?.length <= 0) {
          this.validationArr = await this.apifunctions.BBVAFetchValidation('EQ');
        }
        if (this.apifunctions.payOffList === undefined || this.apifunctions.payOffList?.length <= 0) {
          this.apifunctions.getPayOffList();
        }
        if (this.apifunctions.rmList === undefined || this.apifunctions.rmList?.length <= 0) {
          this.RMList = await this.apifunctions.Get_RMList();
        }else{
          this.RMList = await this.apifunctions.rmList;
        }

        // Fetch booking center - added by Priya L. on 14Mar2022 - assigned by Pranav D.
        if (this.apifunctions.BookingCenter === undefined || this.apifunctions.BookingCenter.length <= 0) {
          this.BookingCenter = await this.apifunctions.GetBookingCenter();
        }
        else{
         this.BookingCenter = this.apifunctions.BookingCenter;
        }
        
        this.customerList = await this.apifunctions.getCustomerList();
        this.filteredOptions = await this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.shares = await this.apifunctions.shares;
        this.ReceivedCCY = await this.apifunctions.CCY;
        try {
          this.ReceivedCCY.forEach((element) => {
            const ccyData = element.Ccy;
            this.CCY.push(ccyData);
          });
        } catch (error) {
        }
        // this.ddlNoteCcy = 'EUR';

        this.changeAutocallCpn();
        this.changeAutoStepDown();
        this.changeAutoNonCall();
        this.reset();

        this.fnGetProdTemplate();

        //console.log(this.templateMappingArr);
        this.fnGetValidation();

        //console.log(this.templateMappingArr);
        //if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        //this.commonData = this.apifunctions.GetCommonDataEuroConnect(this.templateMappingArr[0].template);
        this.commonData = await this.apifunctions.GetCommonDataEuroConnect("EQC_Europe");

        //this.commonData =  await  this.apifunctions.commonData;
        if (this.commonData && this.commonData.length > 0) {
         
          this.filldropdownfromcommandata();
        }

        this.defaultvaluesArr = await this.apifunctions.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'EQC_Europe');
        // //console.log('Price Providers',this.priceProvidersArr.lp.join(','))
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // this.allBooksData = this.apifunctions.allBooksData;

        // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D


        // if (this.allBooksData && this.allBooksData.length > 0) {
        //   this.onBehalfOf = this.allBooksData[0].BookCode;
        //   this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        //   if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe') > -1) {
        //       this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe')].CPM_Format).toString().split(',');
        //       this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe')].ActiveYN;
        //       //console.log(this.mappedformatlist, this.priceBtnActive);
        //     } else {
        //       if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
        //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
        //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
        //         //console.log(this.mappedformatlist, this.priceBtnActive);
        //       }
        //     }
        //   }
        // }

        //console.log(this.mappedformatlist)
        this.commonfunctions.ClearPricesFromMultiToDealEntry();

        this.Code = () => {
          let code = '';
          if (this.SelectedUnderlyingBasket) {
            if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.Code) {
              code = this.SelectedUnderlyingBasket.UnderlyingOne.Code;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.Code) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.Code;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.Code) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.Code;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.Code) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.Code;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.Code) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.Code;
            }
          }
          return code;
        };

        this.RICCode = () => {
          let code = '';
          if (this.SelectedUnderlyingBasket) {
            if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.RICCode) {
              code = this.SelectedUnderlyingBasket.UnderlyingOne.RICCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.RICCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.RICCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.RICCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.RICCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.RICCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.RICCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.RICCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.RICCode;
            }
          }
          return code;
        };

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



        this.IBPrice = ''; // prev. default
        // this.IBPrice = '99.50';
        this.ddlNoteCcy = 'EUR';

        this.SolveForvalue = 'IBPrice'; // prev. default
        // this.SolveForvalue = 'Coupon';
        // this.shares = this.apifunctions.shares;

        this.Notional = '1,000,000.00';
        this.Strike = '100.00';
        this.LeverageFlag = false;
        this.LeverageYN = 'Yes';//Chnaged by Jyoti S || 29-Jun-2023

        this.autoTrigger = '100.00';
        this.autoFreq = 'Monthly';
        this.autoStepDown = '';
        this.autoNonCall = 'M1';
        this.cpnType = 'Fixed Unconditional'; // Added by ApurvaK
        this.cpnTrigger = '';
        this.cpnFreq = 'Monthly'; //Commented by Apurva K
        this.cpnObservation = '';
        this.cpnCoupon = '5.00'; // prev. default
        // this.cpnCoupon = '';

        this.fundType = '';
        this.fundFreq = '';
        this.fundRate = '';
        this.barrierLevel = '60.00';
        this.barrierType = 'European (Maturity)';
        this.altLevel = '';
        this.altObservation = '';
        this.altCoupon = '';
        this.altcouponFlag = 'No';
        this.autocallCoupon = '';
        this.autocallCouponType = 'Constant Barrier';
        this.MemoryPeriods = '';
        this.issuePrice = '100.00';

        this.autoNonCallYN = 'N';
        this.autoStepDownYN = 'N';
        this.autocallCouponYN = 'N';
        this.stkshift = '0B';
        this.paymentshift = 'T + 5';
        this.expshift = '1Y';

        this.ERCpnType = 'None';

        if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
          this.ShareBasket = [];
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];
          //console.log(this.defaultvaluesArr);
          this.setdefaultvalues();

        }
        this.setDefaultSolveForValues(this.SolveForvalue);
        this.ERCpnTypeChange();
        //<Added> by Apurva C || 26th-Nov-2021 || showing wrong values on launch product at initial load >
        this.cpnTypeChange();


        // this.autoFreqArr = ['1m', '2m', '3m', '4m', '6m']
        this.changeAutoFreqOnTenor();
        this.autocallCouponTypeChange();
        // this.autocallfreqbasedonTenor();
        // this.autocallfrombasedonFreqnTenor();
        this.setdefaultcpnFreq();
        // tslint:disable-next-line: max-line-length
        // this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
       //To be check 
        this.Dates = await this.apifunctions.BBVAGetDates('', '0B', '');
        if (this.Dates) {
          this.todayDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

        }

        this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
        if (this.Dates) {
          this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }

        // // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
        // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

        
        if (this.Dates) {
          this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }

        // Modified shifter as per the tenor offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
        // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
       
        // this.Dates =await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? '' : this.Tenor), this.settdate);
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate); // Changed by Jyoti S || 09-May-2023
        if (this.Dates) {
          this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }
        //To be check 
        this.sortedAllPrices = [];


        this.users =  await this.apifunctions.GetMappedUsersAndGroups();
        // //console.log('users', this.users);
        
        const res:any = await this.apifunctions.GetPriceProviderDetails(this.templateMappingArr?.length > 0 ? this.templateMappingArr[0].template : 'EQC_Europe');
       
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
            MatchSentMsg: '',//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32
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
            MatchSentMsg: '',//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32
          });

         
        }
        const that = this;
        this.ERPriceSubscription = await this.commonfunctions.ERSignalRPrices.subscribe(res => {
          const prices = res.price;
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
                    this.priceProvidersArr[k].loadFlag = false;
                    this.priceProvidersArr[k].MatchSentMsg = '';//Added Apurva K||18-Jan-2023 || HSBCECCLI-32
                  }
                  this.priceProvidersArr[k].rfq = prices[i].rfqID;
                  this.priceProvidersArr[k].id = prices[i].id;
                  this.priceProvidersArr[k].status = prices[i].status;
                  this.priceProvidersArr[k].NoteMasterID = prices[i].noteMasterID;
                  this.priceProvidersArr[k].minLimit = prices[i].minLimit;
                  this.priceProvidersArr[k].maxLimit = prices[i].maxLimit;
                  this.priceProvidersArr[k].bestYN = prices[i].bestYN;
                  this.priceProvidersArr[k].remark = prices[i].remark;
                  this.priceProvidersArr[k].isSpreadEntityYN = prices[i].isSpreadEntityYN ? prices[i].isSpreadEntityYN : 'N';//Added by Varsha G || FIN1EURINT-671 || 31-Oct-23
                  this.priceProvidersArr[k].modifiedValue = prices[i].modifiedValue ? prices[i].modifiedValue : '';//Added by Varsha G || FIN1EURINT-671 || 31-Oct-23
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
                case 'Strike':
                  that.Strike = price;
                  that.replySolveFor = 'Strike';
                  break;
                case 'IBPrice':
                  that.IBPrice = price;
                  that.replySolveFor = 'Price';
                  break;
                case 'Coupon':
                  that.cpnCoupon = price;
                  that.replySolveFor = 'Coupon';
                  break;
                case 'KO':
                  that.autoTrigger = price;
                  that.replySolveFor = 'Autocall Trigger';
                  break;
                case 'RebateCoupon':
                  that.autocallCoupon = price;
                  that.replySolveFor = 'Autocall Coupon';
                  break;
                case 'CouponBarrier':
                  that.cpnTrigger = price;
                  that.replySolveFor = 'Coupon Trigger';
                  break;
                case 'KI':
                  that.barrierLevel = price;
                  that.replySolveFor = 'Barrier Level';
                  break;
                case 'FundingRate':
                  that.fundRate = price;
                  that.replySolveFor = 'Rate/Spread';
                  break;
                case 'ERCoupon':
                  that.ERCoupon = price;
                  that.replySolveFor = 'ER Coupon';
                  break;
                case 'PutStrike':
                  that.Strike = price;
                  that.replySolveFor = 'Put Strike';
                  break;

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
        this.route.params.subscribe
          (async params => {
            if (params.RFQ_ID) {
              let preQuoteData1: any;
              preQuoteData1 = await this.apifunctions.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');
              console.log("preQuoteData1" ,preQuoteData1)
              if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                this.ErrorMsgTop = 'No data found for this record.';
              } else {
                // viewOnly
                this.viewOnly = params.viewOnly ? true : false;
                this.viewRFQ = params.RFQ_ID;
                this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              }
            }
            if (params.BBVAID) {
              let preQuoteData1: any;
              preQuoteData1 = await this.apifunctions.getPreviousQuoteCloneData(params.BBVAID, 'BBVAID');
              if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                this.ErrorMsgTop = 'No data found for this record.';
              } else {
                // viewOnly
                this.viewOnly = params.viewOnly ? true : false;
                this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              }
            }
            if (params.PORTFOLIO_ID) {
              this.portfolioId = params.PORTFOLIO_ID;
              const saveQuoteData:any = await this.apifunctions.getRedirectionData(params.PORTFOLIO_ID,'AutocallablePhoenixER');
              if (saveQuoteData.length === 0) {
                this.ErrorMsgTop = 'No data found for this record.';
              } else {
                // viewOnly
                this.viewOnly = params.viewOnly ? true : false;
                this.setSaveQuoteData(saveQuoteData[0], this.viewOnly);
              }
            }
            if (params.Tenor) {
              this.expshift = params.Tenor;
            }
            if (params.Underlyings) {
              // multiple shares issue when redirecting from home || by Suvarna P || 21Mar2022 || assign by Pranav D
              this.ShareBasket = [];
              this.SelectedUnderlyingarray = [];
              this.SelectedUnderlyingBasketArray = [];
              var list: string[] = params.Underlyings.split(",")
              for (var each of list) {
                this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, each)[0]); // Sudarshan | 16-Nov-23 | Removed e as it is not used in called function

              }

            }


          });

        //console.log(this.PrevQuoteShowOrderPopUp);
        if (this.PrevQuoteShowOrderPopUp) {

          this.showOrderDetailsFromPrevQuote();
          $('#loading').hide();
          return false;
        }
       


        if (this.viewRFQID && this.viewRFQID !== '') {

          if (this.viewRFQID) {
            let preQuoteData1: any;
            preQuoteData1 = await this.apifunctions.getPreviousQuoteCloneData(this.viewRFQID, 'RFQID');
            if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
              this.ErrorMsgTop = 'No data found for this record.';
            } else {
              // viewOnly
              this.viewOnly = true;
              if (parseInt(this.Order_Notional) < parseInt(preQuoteData1.cloneData?.MinNotional[0])) {
                this.minNotionalConfirm = true;
              }
              this.viewRFQ = this.viewRFQID;
              if (this.sendtocptyflag && this.Order_Notional && this.Order_Notional !== '') {
                preQuoteData1.cloneData.Notional[0] = this.commonfunctions.formatNotional(this.Order_Notional);
              }
              this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              this.RepriceIssuer = preQuoteData1.cloneData.PPCODE[0];
            }
          }
          $('#loading').hide();
          return false;
        }
        this.pageloadflag=false;

      });
      this.apifunctions.prevQuoteLaunchPopUpRMWObs.subscribe((res: any) => {
        this.prevQuoteLaunchPopUp = res[0];
      });

      // Handled close launch product subscriber to clear the price || PriyaL || 05Apr2022 || Assigned by PranavD
      this.apifunctions.closeLaunchProductObs.subscribe((res: any) => {
        if (res) {
          this.timeLeft = -1;
          this.timeoutMsg = '';
          this.clearFlag = true;
          clearInterval(this.interval);
          this.TSFlag = false;
          //clearInterval(this.TSInterval);
          //clearInterval(this.KIDInterval);
          this.clearAllDocIntervals();
          this.sortedAllPrices = [];
          this.AllPrices = [];

          this.bestLPArray = [];
          //this.priceProvidersArr = [];
          this.priceProvidersArr.forEach(element => {


            if (element.interval1) {

              element.interval1 = clearInterval(element.interval1);
              element.timeStartFlag = false;
            }



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
            element.loadFlag = false;// YASH A.
            element.MatchSentMsg = '';//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32

          }
          );
        }
      });

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      //console.log('validation arr', this.validationArr)
      if (this.validationArr) {
        for (let i = 0; i < this.validationArr?.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
            //Start || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K
            case 'MinimumAllowedIssueDateOffset':
              this.MinimumAllowedIssueDateOffset= this.validationArr[i].Default_Value;
            break;
            //End || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K

            case 'EQ_MaxTriggerPercentage':
              this.maxTrigger = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinTriggerPercentage':
              this.minTrigger = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinStepdownTriggerPercentage':
              this.minStepdown = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MaxCouponTriggerPercentage':
              this.maxCoupon = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinCouponTriggerPercentage':
              this.minCoupon = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinBarrierLevelPercentage':
              this.minBarrier = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinStrikePercentage':
              this.minStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinReOfferPricePercentage':
              this.minReoffer = this.validationArr[i].Default_Value;
              break;

            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultRFQTimeout = this.validationArr[i].Default_Value;
              break;

            case 'EQ_OrderValidityTimer_Ang':
                this.defaultOrderTimeout = this.validationArr[i].Default_Value;
                break;
            case 'EQ_DefaultTSTimeOut_Ang':
              this.TSTimeout = this.validationArr[i].Default_Value;
              break;
            case 'EQ_ShowSaveNShareOption':
              this.showSaveNShare = this.validationArr[i].Default_Value;
              break;
            case 'EQC_BlockLoginGroupsFromorder':
              this.BlockedUserGroups = this.validationArr[i].Default_Value;
              break;
            case 'EQC_BlockUserMessage':
              this.BlockUserMessage = this.validationArr[i].Default_Value;
              break;
            //  add allocation table changes for dropdown - added by PriyaL on 08Dec2021
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
            case 'EQ_Login_Client_Mapping':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Login_Client_Mapping = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Login_Client_Mapping = this.validationArr[i].Default_Value;
              }
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


            case 'EQ_Show_KID_Button':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_KID_Button = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Show_KID_Button = this.validationArr[i].Default_Value;
              }
              break;

            //Start - Added by Sudarshan P || 14-Aug-2023|| HSBCECCLI-32
            case 'EQ_EnablePriceMatch':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_EnablePriceMatch = this.validationArr[i].Config_Value.toUpperCase();
                }
              } else {
                this.EQ_EnablePriceMatch = this.validationArr[i].Default_Value.toUpperCase();
              }
              break;

            case 'EQ_PriceMatch_LPName':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_PriceMatch_LPName = this.validationArr[i].Config_Value.toUpperCase();
                }
              } else {
                this.EQ_PriceMatch_LPName = this.validationArr[i].Default_Value.toUpperCase();
              }

              break;
          //End - Added by Sudarshan P || 14-Aug-2023|| HSBCECCLI-32
         //Start-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
          case 'EQ_AllowOrderAfterPretradeDocCheck':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.OrderDisabledCpty = this.validationArr[i].Config_Value.toUpperCase();
                }
              } else {
                this.OrderDisabledCpty = this.validationArr[i].Default_Value.toUpperCase();
              }

              break;
          //End-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
          }
        }
      }
    } catch (error) {
      //console.log('Error:' + error);
    }
  }

  //Added by ApurvaK|| 17-Mar-2023
  async fnGetProdTemplate() {
    try {

      this.templateMappingArr = await this.apifunctions.fnGetProdTemplate('AutocallablePhoenixER');
    
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async setSolveFor(e) {
    try {
      this.reset();
      const target = await this.commonfunctions.GetEventTarget(e);
      this.SolveForvalue = target.value;
      if (this.SolveForvalue === 'Strike') {
        this.Strike = '';
        this.LeverageFlag = true;
        this.LeverageYN = 'Yes';
        this.setDefaultSolveForValues('Strike');
      }
      if (this.SolveForvalue === 'Coupon') {
        this.cpnCoupon = '';

        this.setDefaultSolveForValues('Coupon');
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
        this.setDefaultSolveForValues('IBPrice');
      }
      if (this.SolveForvalue === 'RebateCoupon') {
        this.autocallCoupon = '';
        this.autocallCouponYN = 'Y';
        this.setDefaultSolveForValues('RebateCoupon');
      }
      if (this.SolveForvalue === 'CouponBarrier') {
        this.cpnTrigger = '';
        this.setDefaultSolveForValues('CouponBarrier');
      }
      if (this.SolveForvalue === 'KI') {
        this.barrierLevel = '';
        this.setDefaultSolveForValues('KI');
      }
      if (this.SolveForvalue === 'KO') {
        this.autoTrigger = '';
        this.autoStepDown = '';
        this.setDefaultSolveForValues('KO');
      }
      if (this.SolveForvalue === 'FundingRate') {
        this.fundRate = '';
        this.setDefaultSolveForValues('FundingRate');
      }

      if (this.SolveForvalue === 'PutStrike') {
        this.Strike = '';
        this.setDefaultSolveForValues('PutStrike');
      }

      if (this.SolveForvalue === 'CallStrike') {
        this.callStrike = '';
        this.setDefaultSolveForValues('CallStrike');
      }

      if (this.SolveForvalue === 'CallGearing') {
        this.callGearing = '';
        this.setDefaultSolveForValues('CallGearing');
      }

      if (this.SolveForvalue === 'LowerCallStrike') {
        this.lowerCallStrike = '';
        this.setDefaultSolveForValues('LowerCallStrike');
      }

      if (this.SolveForvalue === 'UpperCallStrike') {
        this.upperCallStrike = '';
        this.setDefaultSolveForValues('UpperCallStrike');
      }

      if (this.SolveForvalue === 'LowerCallGearing') {
        this.callSpreadGearing = '';
        this.setDefaultSolveForValues('LowerCallGearing');
      }

      if (this.SolveForvalue === 'LowerPutStrike') {
        this.lowerPutStrike = '';
        this.setDefaultSolveForValues('LowerPutStrike');
      }

      if (this.SolveForvalue === 'UpperPutStrike') {
        this.upperPutStrike = '';
        this.setDefaultSolveForValues('UpperPutStrike');
      }

      if (this.SolveForvalue === 'Upfront') {
        this.IBPrice = '';
        this.setDefaultSolveForValues('Upfront');
      }

      if (this.SolveForvalue === 'ERCoupon') {
        this.ERCoupon = '';
        this.setDefaultSolveForValues('ERCoupon');
      }
      if (this.SolveForvalue === 'LowerCouponBarrier') {
        this.lowCpnBarrier = '';
        this.setDefaultSolveForValues('LowerCouponBarrier');
      }

      if (this.SolveForvalue === 'UpperCouponBarrier') {
        this.upperCpnBarrier = '';
        this.setDefaultSolveForValues('UpperCouponBarrier');
      }

      if (this.SolveForvalue === 'PutStrike') {
        this.Strike = '';
        this.setDefaultSolveForValues('PutStrike');
      }
      if (this.SolveForvalue === 'Spread') {
        this.fundRate = '';
        this.setDefaultSolveForValues('FundingRate');
      }
    } catch (error) { }
  }

  setDefaultSolveForValues(solveFor) {
    try {

      if (this.cpnCoupon === '' && solveFor !== 'Coupon' && this.format !== 'Option' && this.cpnType !== 'No Coupon') {
        this.cpnCoupon = '5.00';
      }

      if (this.IBPrice === '' && solveFor !== 'IBPrice' && solveFor !== 'Upfront') {
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '1.50';
        } else {
          this.IBPrice = '99.50';
        }
      }
      if (this.autocallCoupon === '' && solveFor !== 'RebateCoupon') {
        this.autocallCouponYN = 'N';
        if (this.autocallCouponYN === 'Y') {
          this.autocallCoupon = '10.00';
        } else {
          this.autocallCoupon = '';
        }
      }
      if (this.cpnTrigger === '' && solveFor !== 'CouponBarrier' && this.format !== 'Option'
        && this.cpnType !== 'Fixed Coupon' && this.cpnType !== 'No Coupon' && this.cpnType !== 'Fixed Unconditional') {
        this.cpnTrigger = '70.00';
      }
      if (this.barrierLevel === '' && solveFor !== 'KI' && this.barrierType !== 'None') {
        this.barrierLevel = '60.00';
      }
      if (this.autoTrigger === '' && solveFor !== 'KO') {
        this.autoTrigger = '100.00';
        this.autoStepDownYN = 'N';
        if (this.autoStepDownYN === 'Y') {
          this.autoStepDown = '0.00';
        } else {
          this.autoStepDown = '';
        }
      }

      if (this.fundRate === '' && solveFor !== 'FundingRate' && this.format === 'Swap') {
        this.fundRate = '1.00';
      }

      if (this.Strike === '' && solveFor !== 'PutStrike') {
        this.Strike = '100.00';
      }

      if (this.callStrike === '' && solveFor !== 'CallStrike' && (this.upsideType === 'Call' || this.upsideType === 'Twin Win'
        || this.upsideType === 'Call Equally Weighted' || this.upsideType === 'Call Worst of'
        || this.upsideType === 'Call Best of' || this.upsideType === 'Call Custom Basket')) {
        this.callStrike = '100.00';
      }

      if (this.callGearing === '' && solveFor !== 'CallGearing' && (this.upsideType === 'Call' || this.upsideType === 'Twin Win'
        || this.upsideType === 'Call Equally Weighted' || this.upsideType === 'Call Worst of'
        || this.upsideType === 'Call Best of' || this.upsideType === 'Call Custom Basket')) {
        this.callStrike = '100.00';
      }

      if (this.lowerCallStrike === '' && solveFor !== 'LowerCallStrike' && (this.upsideType === 'Call Spread' || this.upsideType === 'Capped Twin Win')) {
        this.lowerCallStrike = '100.00';
      }

      if (this.upperCallStrike === '' && solveFor !== 'UpperCallStrike' && (this.upsideType === 'Call Spread' || this.upsideType === 'Capped Twin Win')) {
        this.upperCallStrike = '100.00';
      }

      if (this.callSpreadGearing === '' && solveFor !== 'LowerCallGearing' && (this.upsideType === 'Call Spread' || this.upsideType === 'Capped Twin Win')) {
        this.callSpreadGearing = '100.00';
      }

      if (this.lowerPutStrike === '' && solveFor !== 'LowerPutStrike' && this.barrierType === 'Put Spread') {
        this.lowerPutStrike = '0.00';
      }

      if (this.upperPutStrike === '' && solveFor !== 'UpperPutStrike' && this.barrierType === 'Put Spread') {
        this.upperPutStrike = '100.00';
      }

      if (this.ERCoupon === '' && solveFor !== 'ERCoupon') {
        if (this.ERCpnType === 'None' && this.periodicCouponFlag === 'Yes') {
          this.ERCoupon = '';
        }
        else {
          this.ERCoupon = '5.00';
        }
      }
      if (this.lowCpnBarrier === '' && solveFor !== 'LowerCouponBarrier') {
        this.lowCpnBarrier = '100.00';
      }
      if (this.upperCpnBarrier === '' && solveFor !== 'UpperCouponBarrier') {
        this.upperCpnBarrier = '100.00';
      }
    } catch (error) {
      //console.log('Erorr', error);
    }
  }

  setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
    Exchangename: string, ISINname: string, Last1yearHighValue: string,
    Last1yearLowValue: string, Spot: string, RiskRating: any, RICCode: any) {
    try {
      this.SelectedUnderlyingarray.push({ LongName, Ccy, Code, ExchangeCode, Exchangename });
      this.SelectedUnderlyingBasketArray.push({
        LongName, Ccy, Code, ExchangeCode, Exchangename,
        ISINName: ISINname, Last1yearHighValue, Last1yearLowValue, Spot, Riskrating: RiskRating, RICCode: RICCode
      });
      this.updateShareBasket();
    } catch (error) { }
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

  ChangeIndex(e) {
    try {
      if (e.keyCode === 32 && this.ShareName == undefined) {
        e.preventDefault();
      }//Added by Varsha G || FIN1EURINT-581 || 09-Aug-2023 
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
    }
  }

  selectShare(e) {
    try {
      this.flag = false;
      if ($('.HoverSuggestion').data('share') !== undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      if (this.shareCode !== undefined && this.shareCode !== '') {
        this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);// Sudarshan | 16-Nov-23 | Removed e as it is not used in called function
      }
    } catch (Error) {
      //console.log('Error', Error);
    }
  }

  backKeyPress(e) {
    try {
      console.log(e)
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

      if (this.ShareName.length === 1) {
        this.showSuggestions = false;
        this.flag = false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  showUnderlying(event, item) {
    try {
      console.log(event)
      this.reset();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.ShareName = '';
      // this.ccyChange = item.Ccy;
      //Changes done by Apurva K for FIN1EURINT-174|| 20-Apr-2023 || < 5 changed to <=3
      if (this.ShareBasket.length <= 3) {
        if (this.ShareBasket.find(i => i.Code === item.BloombergCode) === undefined) {
          //Code enehancements done by Apurva K/Sudarshan P|| 25-Apr-2023 || Added CCY
          this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, RICCode: item.Code , CCY: item.Ccy });
          this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
            item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);
        } else {
          return false;
        }
      }
      if (this.ShareBasket.length > 0) {
        $("#txtShare").next(".error-input").remove();
        $("#txtShare").next(".validate-popup").remove();
        $('#txtShare').css("text-indent", "0px")
        document.getElementById('txtShare').classList.remove('underlyingError');
        document.getElementById('txtShare').classList.add('longText');
      }

      //Code enehancements done by Apurva K/Sudarshan P|| 25-Apr-2023 || Added CCY
      console.log(this.ShareBasket.length)
      if (this.ShareBasket.length === 1) {
        //console.log(this.ddlNoteCcy, this.UnderlyingCurrency)
        if (event == '') // Sudarshan | HSBCECCLI-77 | 16-Nov-23 | added if condition 
        this.ddlNoteCcy = item.Ccy;
        this.UnderlyingCurrency = item.Ccy;
      }
      else{        
        if (event == '') // Sudarshan | HSBCECCLI-77 | 16-Nov-23 | added if condition 
        this.ddlNoteCcy = this.ShareBasket[this.ShareBasket.length -1].CCY;
        this.UnderlyingCurrency = this.ShareBasket[this.ShareBasket.length -1].CCY;
      }

      
      

      //console.log(this.ddlNoteCcy, this.UnderlyingCurrency)
      if (this.UnderlyingCurrency !== this.ddlNoteCcy) {
        this.quanto = "Yes";
      } else {
        this.quanto = "No";
      }

      this.txtTenorDateChange('Payment');


      this.upsideType = 'None';
      this.upsideTypeChange()

    } catch (error) {
      //console.log('Error:', error);
    }
  }

 async Price() {
    try {
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      this.ErrorMsgTop = '';
      //this.ErrorMsgTop = '';
      await this.validationOnButton(); // added `await` keyword || FIN1EURINT-581 || Kaustubh S || 09-Aug-2023

      if (this.listed === 'Y') {
        if (this.stockExchange === '') {
          this.ErrorMsgTop = "Please select the stock exchange.";
          document.getElementById('ddlstockExchange').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlstockExchange")
          $('.validate-popup').delay(5000).fadeOut('slow');
          return false;
        }
      }

      this.shareweightcalc();
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        this.reset();
        this.priceBtnActive = 'N' //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
        this.loadflag = true;
        this.pageloadflag=false;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
        if (!this.priceClickFlag) {
          this.ERPrice('All', "0", 'N');
        }
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
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
     
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
     
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

        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
        // //console.log(this.priceProvidersArr);

        if (!this.priceClickFlag) {

          if (this.sendtocptyflag) {

            this.priceProvidersArr = [];
            const res: any = await this.apifunctions.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].template : 'EQC_Europe');
            for (let i = 0; i < res.length; i++) {
              if (res[i] === res[i]) {
                this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '',  TSLoadFlag: false, KIDLoadFlag: false, ViewKIDFlag: false,ViewTSFlag: false, TSDisableFlag:false, KidDisableFlag:false, MatchSentMsg:''});//Added by Apurva K|| 02-May-2023 || Modified on 18-Jan-2023 || HSBCECCLI-32

              }
            }
            await this.ERPrice(LP, this.viewRFQID, 'Y');
          }
          else {
            await this.ERPrice(LP, "0", 'N');
          }


        }
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  generateXMLOld() {
    try {

      //console.log(this.templateMappingArr);
      const d: any = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, ((this.expshift === 'Custom' ? this.customTenor : this.expshift) + '').toUpperCase(), this.stkdate);
      const fixdate = this.commonfunctions.formatDate(d.MaturityDate);


      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ShareCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Code() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoTrigger': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoTrigger + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnTrigger': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnTrigger + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoStepdown': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoStepDown + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoNonCall': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoNonCall
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnObservation': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnObservation + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'expdate':
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy')
                + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'fundType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.fundType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'fundFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.fundFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'fundRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.fundRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'barrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.barrierLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'barrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.barrierType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'altLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.altLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'altObservation': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.altObservation + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'altCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.altCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'strike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Strike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autocallCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.SolveForvalue !== 'RebateCoupon' ? (this.autocallCouponYN === 'Y' ? this.autocallCoupon : '') : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autocallCouponType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autocallCouponType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'MemoryPeriods': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.MemoryPeriods + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.paymentshift === 'Custom' ? (this.customSetDate + 'B') : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            //   break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LeverageYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.LeverageYN + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.homeEntityID
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'fixdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(fixdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'leverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.leverage
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'basketType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.basketType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'publicOrPrivate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.publicOrPrivate
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'listed': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.listed
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'stockExchange': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.stockExchange
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'customTenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'quanto': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.quanto
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upfrontFee': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upfrontFee
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'startingAutocall': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoTrigger
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callableFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callableFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'putableFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.putableFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'rangeAccrualFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.rangeAccrualFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowCpnBarrier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowCpnBarrier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upperCpnBarrier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperCpnBarrier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnInFine': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnInFine
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFltRef': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFltRef
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFixing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFixing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnSpread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnSpread
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFloor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFloor
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCapYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.cpnCap === '' ? 'No' : 'Yes')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCap': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnCap
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnMultiplier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnMultiplier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upperPutStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperPutStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowerPutStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowerPutStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'putSpreadGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.putSpreadGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upsideType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upsideType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowerCallStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowerCallStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upperCallStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperCallStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callSpreadGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callSpreadGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'priipsYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.priipsYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'language': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.language
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'termsheetType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.termsheetType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlying1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0].Code === undefined ? '' : this.ShareBasket[0].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlying2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1].Code === undefined ? '' : this.ShareBasket[1].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlying3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2].Code === undefined ? '' : this.ShareBasket[2].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlying4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3].Code === undefined ? '' : this.ShareBasket[3].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'position1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket.length === 1 ? '1' : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'position2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket.length === 2 ? '2' : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'position3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket.length === 3 ? '3' : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'position4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket.length === 4 ? '4' : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'weight1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0].Weight === undefined ? '' : this.ShareBasket[0].Weight)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'weight2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1].Weight === undefined ? '' : this.ShareBasket[1].Weight)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'weight3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2].Weight === undefined ? '' : this.ShareBasket[2].Weight)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'weight4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3].Weight === undefined ? '' : this.ShareBasket[3].Weight)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'exchange1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0].Exchange === undefined ? '' : this.ShareBasket[0].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'exchange2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1].Exchange === undefined ? '' : this.ShareBasket[1].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'exchange3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2].Exchange === undefined ? '' : this.ShareBasket[2].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'exchange4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3].Exchange === undefined ? '' : this.ShareBasket[3].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'shareName1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0].LongName === undefined ? '' : this.ShareBasket[0].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'shareName2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1].LongName === undefined ? '' : this.ShareBasket[1].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'shareName3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2].LongName === undefined ? '' : this.ShareBasket[2].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'shareName4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3].LongName === undefined ? '' : this.ShareBasket[3].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlyingCount': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket === undefined ? '0' : this.ShareBasket.length)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ERCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ERCoupon
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ERCouponType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ERCpnType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SettlementMethod': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SettlementMethod + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'periodicCouponFlag': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.periodicCouponFlag
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'DailyKO': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.dailyKOYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LeverageYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.LeverageYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
          }
        }
        // xmlstr += '<PriipsinScope>NO</PriipsinScope><Termsheets>EIS</Termsheets></QuoteRequest>';
        xmlstr += '</QuoteRequest>';
        //console.log(xmlstr);
        return xmlstr;
      } else {
        return '';
      }

    } catch (error) {
      //console.log('Error' + error);
    }
  }

  async generateXML() {
    try {
      //console.log(this.templateMappingArr);
      // const d: any = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, ((this.expshift === 'Custom' ? this.customTenor : this.expshift) + '').toUpperCase(), this.stkdate);
      // const fixdate = this.commonfunctions.formatDate(d.MaturityDate);
      //Added by AdilP Custom barrier|| HSBCECCLI-42 || 23-08-2023
      if (this.autocallCouponType == 'Custom Barrier' && !(this.manualTriggerValueArr.length > 0)) {
        await this.ManualTriggerEmptyCall();
      }
      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            // Start || Avinash G || 12-Apr-2024 || HSBCECCLI-120 || Order Type not getting saved in the App table via UI XML
          
            // case 'OrderTypeCustom': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + this.ordertype + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            // break;

            case 'OrderType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ordertype + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

            // End || Avinash G || 12-Apr-2024 || HSBCECCLI-120 || Order Type not getting saved in the App table via UI XML

            case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'expdate':
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy')
                + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlyings': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Code() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'strike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Strike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'upfrontFee': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upfrontFee
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'fundRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.fundRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Azure change    
            case 'SolveFor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            //Added by Varsha G || FIN1EURINT-677 || 27-Nov-23  
            case 'fundType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.fundType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
            case 'fundFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.fundFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnObservation': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnObservation + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'putSpreadGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.putSpreadGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'cpnTrigger': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnTrigger + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'barrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.barrierType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'barrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.barrierLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.paymentshift === 'Custom' ? (this.customSetDate) : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            //   break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autoTrigger':
              // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
              let manualtrigger = '';
              if (this.manualTriggerValueArr.length > 0) {
                this.manualTriggerValueArr.forEach((t) => {
                  if (t.OutTrigger != '-' && t.autocall != 'first')
                    manualtrigger += '/' + t.OutTrigger
                })
              }
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>' + this.autoTrigger + manualtrigger + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'startingAutocall': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoTrigger
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'autoStepdown': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoStepDown + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'autoNonCall': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autoNonCall
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'rangeAccrualFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.rangeAccrualFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowCpnBarrier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowCpnBarrier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;


            case 'upperCpnBarrier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperCpnBarrier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnInFine': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnInFine
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'autocallCouponType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.autocallCouponType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'leverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.leverage
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.userID
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'basketType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.basketType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'publicOrPrivate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.publicOrPrivate
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'listed': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.listed
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'stockExchange': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.stockExchange
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'customTenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift)
              // + (this.expshift === 'Custom' ? this.customTenor : '')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'quanto': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.quanto
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;


            case 'callableFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callableFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'putableFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.putableFreq
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;


            case 'cpnFltRef': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFltRef
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFixing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFixing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnSpread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnSpread
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFloor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnFloor
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCapYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.cpnCap === '' ? 'No' : 'Yes')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnCap': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnCap
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnMultiplier': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.cpnMultiplier
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upperPutStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperPutStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowerPutStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowerPutStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'upsideType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upsideType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'lowerCallStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.lowerCallStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upperCallStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upperCallStrike
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'callSpreadGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.callSpreadGearing
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'priipsYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.priipsYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'country': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.country
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'language': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.language
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'termsheetType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.termsheetType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlyingCount': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket === undefined ? '0' : this.ShareBasket.length)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ERCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ERCoupon
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ERCouponType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ERCpnType
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SettlementMethod': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SettlementMethod + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'periodicCouponFlag': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.periodicCouponFlag
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'DailyKO': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.dailyKOYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LeverageYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.LeverageYN
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'Underlying1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].Code === undefined ? '' : this.ShareBasket[0].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].Exchange === undefined ? '' : this.ShareBasket[0].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].Code === undefined ? '' : this.ShareBasket[1].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].Exchange === undefined ? '' : this.ShareBasket[1].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2] === undefined || this.ShareBasket[2].Code === undefined ? '' : this.ShareBasket[2].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3] === undefined || this.ShareBasket[3].Code === undefined ? '' : this.ShareBasket[3].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2] === undefined || this.ShareBasket[2].Exchange === undefined ? '' : this.ShareBasket[2].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3] === undefined || this.ShareBasket[3].Exchange === undefined ? '' : this.ShareBasket[3].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].Code === undefined ? '' : this.ShareBasket[4].Code)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'IX5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].Exchange === undefined ? '' : this.ShareBasket[4].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'LN1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].LongName === undefined ? '' : this.ShareBasket[0].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].LongName === undefined ? '' : this.ShareBasket[1].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2] === undefined || this.ShareBasket[2].LongName === undefined ? '' : this.ShareBasket[2].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3] === undefined || this.ShareBasket[3].LongName === undefined ? '' : this.ShareBasket[3].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].LongName === undefined ? '' : this.ShareBasket[4].LongName)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;


          }
        }
        // xmlstr += '<PriipsinScope>NO</PriipsinScope><Termsheets>EIS</Termsheets></QuoteRequest>';
        xmlstr += '</QuoteRequest>';
        //console.log(xmlstr);
        return xmlstr;
      } else {
        return '';
      }

    } catch (error) {
      //console.log('Error' + error);
    }
  }

 async ERPrice(LPVal, NMID, repriceFlg) {
    try {
      this.priceBtnActive =  'N' //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
      //var LP = '';
      // if (LPVal == 'All') {
      //   var isPriceFlgChk = this.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
      //   if (isPriceFlgChk == -1) {
      //     this.priceProvidersArr.forEach(item => {
      //       var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
      //       this.priceProvidersArr[idx].loadFlag = true            
      //       this.priceProvidersArr[idx].timer = this.startCountDown(this.defaultOrderTimeout, idx);
      //        // item.timer = this.startCountDown(this.defaultOrderTimeout, idx);
      //       // LP = 'Citi'; //'Barclays';
      //       LP = ''; //'Barclays';
      //     })
      //   } else {
      //     // //console.log(this.priceProvidersArr);
      //     this.priceProvidersArr.forEach(item => {
      //       if (item.priceChkFlg) {
      //         var idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
      //         this.priceProvidersArr[idx].loadFlag = true
      //         LP = LP + item.lp + ',';              
      //         this.priceProvidersArr[idx].timer = this.startCountDown(this.defaultOrderTimeout, idx);
      //         //item.timer = this.startCountDown(this.defaultOrderTimeout, idx);
      //       }
      //     });
      //     var lastCharater = LP.split('').pop();
      //     if (lastCharater == ',')
      //       LP = LP.substring(0, LP.length - 1);
      //     // }
      //   }
      //   //  LP = '';
      // }
      // else {
      //   var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
      //   if (idx > -1) {
      //     this.priceProvidersArr[idx].loadFlag = true // Added by Jyoti S || 02-May-2023
      //     this.priceProvidersArr[idx].timer = this.startCountDown(this.defaultOrderTimeout, idx);
      //   }


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
            this.priceProvidersArr[idx].loadFlag = true; //Apurva K||18-Jan-2023 || HSBCECCLI-32
            //Commented by Apurva K|| 09-Feb-2024 || FIN1EURINT-701
            //this.priceProvidersArr[idx].matchBtnFlag = true; //Apurva K||18-Jan-2023 || HSBCECCLI-32
          }
        LP = LPVal;
      }
      this.priceClickFlag = true;
      const requestXML = await this.generateXML();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,//'AutocallablePhoenix',
        subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'EQC_Europe',
        LP: LP, // this.apifunctions.priceProviders.join(','),
        requestXML,
        solveFor: this.SolveForvalue,
        loginID: AppConfig.settings.oRes.userID,
        userGroupID: AppConfig.settings.oRes.groupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        noteMasterID: NMID,
        repricereqYN: repriceFlg
      }];
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
            that.ErrorMsgTop = data.errorMessage.split('. ')[0];
            //that.loadflag = false;
            that.timeLeft = 0;
            this.priceBtnActive = 'Y'

            this.priceProvidersArr.forEach(item=>{
              this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false;
              this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].MatchSentMsg = ''; //Added by Apurva K|| 18-Jan-2023 || HSBCECCLI-32
               

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
      //     if (data.errorMessage !== '' || !that.pageActive) {
      //       that.ErrorMsgTop = data.errorMessage.split('. ')[0];
      //       that.loadflag = false;
      //       that.timeLeft = 0;

      //       for (let i = 0; i < that.priceProvidersArr.length; i++) {
      //         that.priceProvidersArr[i].timer = '';
      //         clearInterval(that.priceProvidersArr[i].interval1);
      //         // this.priceProvidersArr[index].price = 'Timeout';
      //         that.priceProvidersArr[i].timeStartFlag = false;
      //       }
      //       return false;
      //     }
      //     that.rfqID = data.rfqid;
      //     that.noteMasterID = data.noteMasterID;
      //     if (!that.clearFlag) {
      //       that.Prices = [];
      //       that.timeLeft = that.defaultTimeout;
      //       that.PPDetails = that.rfqID;
      //       if (that.PPDetails !== '') {
      //         that.priceClickFlag = false;
      //         if (data.rfqPPid !== '') {
      //           const rfqPPID = data.rfqPPid.split(',');
      //           for (let k = 0; k < rfqPPID.length; k++) {
      //             if (rfqPPID[k].toString().includes(':')) {
      //               const splitRFQID = rfqPPID[k].split(':');
      //               const index = that.priceProvidersArr.findIndex(res => res.lp === splitRFQID[0].toString().trim());
      //               if (index > -1) {
      //                 that.priceProvidersArr[index].rfq = splitRFQID[1];
      //               }
      //             }

      //           }
      //         }

      //         that.interval = setInterval(() => {

      //           if (that.timeLeft > 0) {
      //             that.timeoutMsg = '';
      //             that.ERPriceResponse(that.PPDetails);

      //             that.timeLeft = that.timeLeft - 5;
      //           } else if (that.timeLeft === 0 || that.timeLeft < 0) {
      //             that.loadflag = false;
      //             // that.timeoutMsg = 'Timeout';
      //             clearInterval(that.interval);

      //           }

      //         }, 5000);
      //       }
      //     }
      //   },
      //   error(error) {
      //     console.error(error);
      //     // Clear timer if api calling return error - added by Priya L. on 17Mar2022 - assigned by Pranav D.
      //     that.loadflag = false;
      //     that.timeLeft = 0;
      //     for (let i = 0; i < that.priceProvidersArr.length; i++) {
      //       that.priceProvidersArr[i].timer = '';
      //       clearInterval(that.priceProvidersArr[i].interval1);
      //       // this.priceProvidersArr[index].price = 'Timeout';
      //       that.priceProvidersArr[i].timeStartFlag = false;
      //     }
      //     return false;
      //   }
      // });
    } catch (error) {
      // debugger;
      //console.log('Error:', error);
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
          await that.commonfunctions.setERReceivedPrices(that.Prices, 1);
          //console.log(this.Prices,"this.Prices")
          // Added by Yash Agrawal to keep price button disabled until first price is received
          this.Prices.forEach((item) =>{
            if(item.value != ""){
              this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
              //Start - Added by Apurva K|| 09-Feb-2024 || FIN1EURINT-701
              if(this.EQ_EnablePriceMatch == "YES" || this.EQ_EnablePriceMatch == "Y"){
                if( item.ppID == this.EQ_PriceMatch_LPName && item.bestYN == 'N'){
                  this.matchBtnFlag = true;
                  //Added by Apurva K||FIN1EURINT-704||20-Mar-2024
                  if(item.remark != ''){
                    let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == this.EQ_PriceMatch_LPName);
                    this.priceProvidersArr[idx].MatchSentMsg = 'RFM Received';
                    
                  }
                  //Added by Apurva K|| 11-Mar-2024||FIN1EURINT-704
                  this.ngZone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.ngZone.run(() => {
                          
                         // this.RfmRequestCount = this.RfmRequestCount + 1
                          this.RFM.nativeElement.click();
                            
                        });
                    });
                });
                  //this.search.nativeElement.click(); 
                  // let element:HTMLElement = document.getElementById('auto_trigger_RFM') as HTMLElement; //Added by Apurva K
                  // element.click();//Added by Apurva K
                }
              }
            //End - Added by Apurva K|| 09-Feb-2024 || FIN1EURINT-701
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

  removeShare(rownumber: any) {
    try {
      this.ShareBasket.splice(rownumber, 1);
      this.SelectedUnderlyingarray.splice(rownumber, 1);
      this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
      this.quanto = 'No';

      if (this.SelectedUnderlyingBasketArray.length > 0) {
        this.UnderlyingCurrency = this.SelectedUnderlyingBasketArray[0]['Ccy'];
        this.ddlNoteCcy = this.SelectedUnderlyingBasketArray[this.SelectedUnderlyingBasketArray.length - 1]['Ccy']; 

        // //console.log( this.UnderlyingCurrency, this.ddlNoteCcy, this.SelectedUnderlyingBasket);
        for (let i = 0; i < this.SelectedUnderlyingBasketArray.length; i++) {
          if (this.ddlNoteCcy !== this.SelectedUnderlyingBasketArray[i]['Ccy']) {
            this.quanto = 'Yes';
          }
        }

      }
      this.updateShareBasket();
      this.reset();
      if (this.ShareBasket.length < 2) {
        this.upsideType = 'None';
        this.upsideTypeChange();
      }
      if (this.upsideType !== '' && this.upsideType !== 'None') {
        this.SolveForvalue = 'IBPrice';
      }
    } catch (error) {
      //console.log('Error:', error);
    }

  }

  IBPricechange() {
    try {
      this.reset();

    } catch (error) {
      //console.log('Error:', error);
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
      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      this.TSFlag = false;
      //clearInterval(this.TSInterval);
      //clearInterval(this.KIDInterval);
      this.clearAllDocIntervals();

      if (this.ShareBasket.length > 0) {
        document.getElementById('txtShare').classList.remove('underlyingError');
        document.getElementById('txtShare').classList.add('longText');
      }
      document.querySelectorAll("#txtIBPrice ~ .error-input").forEach(node => node.remove()); // Kaustubh S || HSBCECCLI-44 || 16-Aug-2023
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.rfqID = '';
      this.noteMasterID = '';
      this.saveFlag = false;
      this.quoteEmailFlg = false;
      this.successMsg = '';
      this.errorTemplateMessage = '';
      this.reqSuccessMsg = '';
      this.RfmRequestCount = 0; //Added by Apurva K
      // this.ERCoupon = ''; //Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
      // this.cpnCoupon = ''; //Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
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
      if (this.SolveForvalue === 'Strike') {
        this.Strike = '';
        this.LeverageFlag = true;
        // this.LeverageYN = 'Yes';
      }
      if (this.SolveForvalue === 'Coupon') {
        this.cpnCoupon = '';
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
      }
      //Added by Apurva K ||FIN1EURINT-185
      if (this.SolveForvalue === 'PutStrike') {
        this.Strike = '';
      }
      if (this.SolveForvalue === 'KI') {
        this.barrierLevel = '';
      }
      if (this.SolveForvalue === 'KO') {
        this.autoTrigger = '';
      }
      if (this.SolveForvalue === 'RebateCoupon') {
        this.autocallCoupon = '';
      }
      if (this.SolveForvalue === 'CouponBarrier') {
        this.cpnTrigger = '';
      }
      if (this.SolveForvalue === 'FundingRate') {
        this.fundRate = '';
      }

      if (document.getElementById('txtStrike')) {
        document.getElementById('txtStrike').classList.remove('reply');
      }
      if (document.getElementById('txtIBPrice')) {
        document.getElementById('txtIBPrice').classList.remove('reply');
      }
      if (document.getElementById('txtCoupon')) {
        document.getElementById('txtCoupon').classList.remove('reply');
      }
      if (document.getElementById('txtRebateCoupon')) {
        document.getElementById('txtRebateCoupon').classList.remove('reply');
      }
      if (document.getElementById('txtCouponBarrier')) {
        document.getElementById('txtCouponBarrier').classList.remove('reply');
      }
      if (document.getElementById('txtKI')) {
        document.getElementById('txtKI').classList.remove('reply');
      }

      if (document.getElementById('txtKO')) {
        document.getElementById('txtKO').classList.remove('reply');
      }
      if (document.getElementById('txtFundingRate')) {
        document.getElementById('txtFundingRate').classList.remove('reply');
      }
      this.commonfunctions.ERPricesObserver.next('');
      this.commonfunctions.ERPrices = [];
      this.commonfunctions.setERReceivedPrices({}, '');
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
        element.isSpreadEntityYN = 'N';//Changes done by Varsha G || FIN1EURINT-671 || 06-Nov-2023
        element.modifiedValue = '';//Changes done by Varsha G || FIN1EURINT-671 || 01-Nov-2023
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
        element.MatchSentMsg = ''//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32
      }
      );
      this.poolDetailsVisibleFlag = false;
      this.priceClickFlag = false;
      this.bookOrderFlag = true;
      this.matchBtnFlag = false; //Added by Apurva K|| 10-Aug-2023||HSBCECCLI-32
      this.BookOrderDisabledForCpty = true; //Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async PriceValidation(e, Pricestr: string) {
    try {
      this.reset();
      const target = await this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // target.classList.remove('error');
      // this.removeErrorPopup(e)
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      switch (Pricestr) {
        case 'Strike':

          if (parseFloat(target.value) <= parseFloat(this.minStrike)) {
            this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
            target.classList.add('error');
          }
          //Added by Apurva C || 18-Nov || Strike & Barrier level validation
          if (parseFloat(this.Strike) < parseFloat(this.barrierLevel)) {

            this.ErrorMsgTop = 'Put Strike should be greater than KI Barrier Level';
            target.classList.add('error');
          }

          break;

        case 'CouponTrigger':
          if (target.value === '') {
            this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
            target.classList.add('error');

          } else if (target.value.indexOf('/') < 0) {
            if (parseFloat(target.value) <= parseFloat(this.minCoupon) ||
              parseFloat(target.value) >= parseFloat(this.maxCoupon)) {
              this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
              target.classList.add('error');

            }
            target.value = parseFloat(target.value).toFixed(2);
          } else {
            const cpnArr = target.value.split('/');
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < cpnArr.length; i++) {
              if (parseFloat(cpnArr[i]) <= parseFloat(this.minCoupon) ||
                parseFloat(cpnArr[i]) >= parseFloat(this.maxCoupon)) {
                this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
                target.classList.add('error');
              }
            }
          }
          break;

        case 'BarrierLevel':
          if (parseFloat(target.value) <= parseFloat(this.minBarrier)) {
            this.ErrorMsgTop = 'Barrier level should be greater than ' + this.minBarrier + '%.';
            target.classList.add('error');
          }
          break;
        case 'Stepdown':
          if (parseFloat(target.value) <= parseFloat(this.minStepdown)) {
            this.ErrorMsgTop = 'Stepdown should be greater than ' + this.minStepdown + '%.';
            target.classList.add('error');
          }
          break;

        case 'AutoTrigger':
          this.resetManualTrigger(); //Added by Adil for Custom barrier
          if (target.value === '') {
            this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            target.classList.add('error');

          } else {
            if (target.value.indexOf('/') < 0) {
              if (parseFloat(target.value) <= parseFloat(this.minTrigger) ||
                parseFloat(target.value) >= parseFloat(this.maxTrigger)) {
                this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                target.classList.add('error');
              }
              target.value = parseFloat(target.value).toFixed(2);
            }
          }
          

          break;
        
      }
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
      $('.validate-popup').delay(5000).fadeOut('slow');
    } catch (error) {
      //console.log('Error:', error);
    }
  }
   // Start || Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
  async PriceValidationManual(e, Pricestr: string) {
    try {
      this.reset();
      const target = await this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // target.classList.remove('error');
      // this.removeErrorPopup(e)

      switch (Pricestr) {
        case 'manualTrigger':
          if (target.value === '') {
            this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            target.classList.add('error');

          } else if (this.autoStepDown === '') {
            if (target.value.indexOf('/') < 0) {
              if (parseFloat(target.value) <= parseFloat(this.minTrigger) ||
                parseFloat(target.value) >= parseFloat(this.maxTrigger)) {
                this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                target.classList.add('error');
                target.value = parseFloat(target.value).toFixed(2);
              } else {
                target.value = parseFloat(target.value).toFixed(2);
                $(".validate-popup").each(function () {
                  $(this).remove();
                });
                $(".error-input").each(function () {
                  $(this).remove();
                });
              }
            }
          }
          // End || Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
          break;
      }
      $('.validate-popup').delay(5000).fadeOut('slow');
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async MinMaxValidation(e, Pricestr: string) {
    try {
      this.reset();
      const target = await this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';

      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });

      //console.log(this.defaultvaluesArr);
      if (Pricestr !== "") {
        var cntrlIdx = this.defaultvaluesArr.findIndex(item => item.Control_Name === Pricestr);
        if (cntrlIdx > -1) {
          var MaxVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MaxVal.replace(/,/g, ''));
          var MinVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MinVal.replace(/,/g, ''));
          var ctrlVal = parseFloat(target.value.replace(/,/g, ''))
          if (this.defaultvaluesArr[cntrlIdx].MinVal !== '' && ctrlVal < MinVal) {
            // this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
            this.ErrorMsgTop = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be greater than ' + MinVal //+ '%.';
            target.classList.add('error');
          }
          if (this.defaultvaluesArr[cntrlIdx].MaxVal !== "" && ctrlVal > MaxVal) {
            this.ErrorMsgTop = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be less than ' + MaxVal //+ '%.';
            target.classList.add('error');
          }
        }
      }

      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
      $('.validate-popup').delay(5000).fadeOut('slow');
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  altCouponFlagChange() {
    try {
      this.reset();
      if (this.altcouponFlag === 'Yes') {
        this.altLevel = '0.00';
        this.altObservation = 'PerAnnum';
        this.altCoupon = '0.00';
      } else {
        this.altLevel = '';
        this.altObservation = '';
        this.altCoupon = '';
      }
    } catch (error) {
      //console.log(error);
    }
  }

  cpnTypeChange() {
    try {
      this.reset();
      this.cpnObservation = '';
      //this.cpnTrigger = '';
      this.cpnFreq = '';
      // this.cpnCoupon = '';
      this.cpnInFine = '';
      this.rangeAccrualFreq = '';
      this.lowCpnBarrier = '';
      this.upperCpnBarrier = '';
      this.cpnFloor = '';
      this.cpnCap = '';
      this.cpnMultiplier = '';
      this.cpnFixing = '';
      this.cpnFltRef = '';

      // if (this.SolveForvalue !== 'Coupon') {
      //   this.cpnCoupon = '5.00';
      // }

      if (this.SolveForvalue !== 'CouponBarrier' && (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory')) {
        this.cpnTrigger = this.cpnTrigger || '70.00';
        this.cpnCoupon = this.cpnCoupon ; //Added by Apurva K|| 09-Aug-2023|| HSBCECCLI-21
      }

      if (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory') {
        // this.cpnObservation = 'European (Last day of the Month)';
        // this.cpnFreq = 'Monthly';
        this.setdefaultcpnFreq();
        this.cpnInFine = 'No';
      } else if (this.cpnType === 'Fixed Unconditional') {
        // this.cpnFreq = 'Monthly';
        this.cpnTrigger = ''; //Changes done by Jyoti S || Resolved the issue where cpntrigger was not going null in case of Fixed Uncondiotional || 02-Aug-2023
        this.cpnCoupon = this.cpnCoupon; //Added by Apurva K|| 09-Aug-2023 || HSBCECCLI-21
        this.setdefaultcpnFreq();
      } else if (this.cpnType === 'Range Accrual') {
        // this.cpnFreq = 'Monthly';
        this.setdefaultcpnFreq();
        this.rangeAccrualFreq = 'Daily';
        this.cpnInFine = 'No';
      } else if (this.cpnType === 'Floating Unconditional') {
        // this.cpnFreq = 'Monthly';
        this.setdefaultcpnFreq();
        this.cpnFloor = '0.00';
        this.cpnCap = '';
        this.cpnMultiplier = '100.00';
        this.cpnFixing = 'In Advance';
        this.cpnFltRef = 'EUR001M Index';
      } else if (this.cpnType === 'Floating without Memory') {
        // this.cpnFreq = 'Monthly';
        this.setdefaultcpnFreq();
        this.cpnTrigger = '';
        this.cpnFloor = '0.00';
        this.cpnCap = '';
        this.cpnMultiplier = '100.00';
        this.cpnFixing = 'In Advance';
        this.cpnFltRef = 'EUR001M Index';
      }

    } catch (error) {
      //console.log('Error' + error);
    }
    return false;
  }

  formatChange() {
    try {
      this.reset();

      if (this.format !== 'Swap' && this.SolveForvalue === 'FundingRate') {
        this.SolveForvalue = 'IBPrice';
      }
      if (this.format === 'Option' && (this.SolveForvalue === 'CouponBarrier' || this.SolveForvalue === 'Coupon')) {
        this.SolveForvalue = 'IBPrice';
      }

      if (this.format === 'Swap') {
        this.SolveForvalue = 'Upfront';
        this.IBPrice = '';
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
        if (this.format === 'Swap') {
          this.issuePrice = '';
        } else {
          this.issuePrice = '100.00';
        }
      } else {
        if (this.format === 'Swap') {
          if (this.SolveForvalue !== 'Upfront') {
            this.IBPrice = '0.00';
          }
          this.issuePrice = '';
        } else {
          if (this.SolveForvalue !== 'IBPrice') {
            this.IBPrice = '99.50';
          }
          this.issuePrice = '100.00';
        }
      }

      if (this.format === 'Swap') {

        if (this.SolveForvalue === 'FundingRate') {
          this.fundRate = '';
          this.fundFreq = ''
          this.fundType = '';
        } else {
          this.fundRate = '1.00';
          this.fundType = 'Floating Rate';
          if (this.autoFreq === '1m' || this.autoFreq === '2m' || this.autoFreq === '4m') {
            this.fundFreq = '1m';
          } else {
            this.fundFreq = '3m';

          }
        }
      } else {

        this.fundType = '';
        this.fundFreq = '';
        this.fundRate = '';
      }
      if (this.format === 'BonoJ' || this.format === 'Warrant') {
        this.ddlNoteCcy = 'MXN';

      }
      if (this.format === 'Option') {
        this.cpnType = '';
        this.cpnFreq = '';
        this.cpnCoupon = '';
        this.cpnObservation = '';
        this.cpnTrigger = '';
        this.MemoryPeriods = '';
      } else {
        if (this.cpnType === '') {
          this.cpnType = 'Fixed Coupon';
        }
        if (this.cpnFreq === '') {
          this.cpnFreq = 'At Maturity';
        }
        if (this.cpnCoupon === '' && this.SolveForvalue !== 'Coupon') {
          this.cpnCoupon = '5.00';
        }
        if (this.cpnObservation === '') {
          this.cpnObservation = 'PerFreq';
        }
      }

    } catch (error) {
      //console.log('Error' + error);
    }
    return false;
  }

  barrierTypeChange() {
    try {
      this.reset();
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      if (this.barrierType === 'None' || this.barrierType === '') {
        // this.Strike = '';
        this.leverage = '';
        this.barrierLevel = '';
        this.putSpreadGearing = '';
      }

      // Added by ApurvaK start
      if (this.barrierType === 'Bermudan') {
        this.ProtectionFlag = true;
      }

      if (this.barrierType != 'Bermudan') {
        this.ProtectionFlag = false;
      }
      // Added by ApurvaK end


      if (this.barrierType !== 'None') {
        this.strikeChange();
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  upsideTypeChange() {
    try {
      this.reset();
      if (this.upsideType === 'None' || this.upsideType === '') {
        this.callStrike = '';
        this.callGearing = '';
        this.lowerCallStrike = '';
        this.upperCallStrike = '';
        this.callSpreadGearing = '';
      }

    } catch (error) {

    }
  }

  async txtTenorChange(e, type: any) {
    try {
      this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
      //this.reset();//Commented by Varsha G || FIN1EURINT-275 || 05-May-2023
      const target = await this.commonfunctions.GetEventTarget(e);
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
          this.ErrorMsgTop = 'Please enter valid date shifter.';
          return false;
        }
      }
      if (str.substr(str.length - 1, 1).toUpperCase() === 'Y') {
        // tslint:disable-next-line: radix
        if (parseInt(str.substr(0, str.length - 1)) > 6) {
          this.ErrorMsgTop = 'Please enter valid date shifter.';
          return false;
        }
      }

      if (type === 'Strike') {
        this.stkshift = target.value;

        this.Dates =  await this.apifunctions.BBVAGetDates(this.Exchange(), str.toUpperCase(), '');
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

        this.stkdate = strDate;

        this.Dates =  await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');


      }
      if (type === 'Payment') {
        this.paymentshift = target.value;

        this.Dates =  await  this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.stkdate);
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

        this.settdate = strDate;
        this.Dates =  await  this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

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
          this.Dates =  await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.settdate);
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }
        this.expdate = strDate;
      }

      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsgTop = 'Please select valid strike date.';
        document.getElementById('txtstkdate').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtstkdate")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }

      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid expiry date.';
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }
//modified by PoojaW
 async Save() {
    try {
      this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
      this.reset(); //Added to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
      if (this.portfolioName === '') {
        this.ErrorMsgTop = "Please enter valid template name.";
        this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
        return false;
      }
      this.validationOnButton();
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        this.timeLeft = -1;
        this.timeoutMsg = '';
        this.clearFlag = true;
        //clearInterval(this.interval); //Removed to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
        if (this.ShareBasket.length > 0) {
          $(".validate-popup").remove();
          document.getElementById('txtShare').classList.remove('underlyingError');
          document.getElementById('txtShare').classList.add('longText');
        }
        this.saveportfolioId = '';
        this.PPDetails = '';
        this.sortedAllPrices = [];
        this.AllPrices = [];
        this.orderID = '';
        this.loadflag = false;
        this.ErrorMsg = '';
        this.ErrorMsgTop = '';
        this.rfqID = '';
        this.noteMasterID = '';
        this.saveFlag = false;
        this.quoteEmailFlg = false;
        this.successMsg = '';
        this.errorTemplateMessage = '';
        this.reqSuccessMsg = '';
        const strXml = '<Details>' +await this.generateSaveXML() + '</Details>';
        var res:any;
        await this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, '', 'AutocallablePhoenixER', AppConfig.settings.oRes.userID).then((data:any)=>{res = data});
        if (res) {
          if (res.errorMessage === '') {

            this.saveFlag = true;
            this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
            this.saveportfolioId = res.PortFolioID;
            this.successMsg = 'Template : ' + this.portfolioName + ' saved successfully.';
            this.portfolioIdArr = [];
           await this.apifunctions.BBVAGetPortfolio('AutocallablePhoenixER', 'Single Pricer').then((data:any)=>{this.portfolioIdArr = data});
            this.portfolioIdArr.splice(0, 0, {
              AccessDetail: "ALL",
              Created_At: "",
              P_ID: "",
              P_Name: "",
              ProdType: "",
              ShareType: "ALL",
              created_by: "",
            });
            this.portfolioIdArr.map(r => {
              let item = r;
              item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
              return item;
            });
          } else {
            this.errorTemplateMessage = res.errorMessage;
            this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
          }
        }
      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async generateSaveXML() {
    try {
      this.validationOnButton();
      let notionalValue;
      if (this.ShareBasket.length <= 0) {
        // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
	this.commonfunctions.generateFlexiXml({});
        return '';
      }
      this.tempXML = '';
      if ((this.Notional + '').includes(',')) {
        notionalValue = this.Notional.replace(/,/g, '');//Changed by Varsha G || FIN1EURINT-286 || 05-May-2023
      }
      ///Added by Apurva K|| 02-Dec-2023|| HSBCECCLI-88
      let manualtrigger = '';
              if (this.manualTriggerValueArr.length > 0) {
                this.manualTriggerValueArr.forEach((t) => {
                  if (t.OutTrigger != '-' && t.autocall != 'first')
                    manualtrigger += '/' + t.OutTrigger
                })
              }
      //Changed by Apurva K||14-Dec-2023|| HSBCECCLI-86
      const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].RICCode + '#')) +
        ((this.ShareBasket[1] === undefined) ? '' : (this.ShareBasket[1].RICCode + '#')) +
        ((this.ShareBasket[2] === undefined) ? '' : (this.ShareBasket[2].RICCode + '#')) +
        ((this.ShareBasket[3] === undefined) ? '' : (this.ShareBasket[3].RICCode + '#')) +
        ((this.ShareBasket[4] === undefined) ? '' : (this.ShareBasket[4].RICCode + '#')) +
        ((this.ShareBasket[5] === undefined) ? '' : (this.ShareBasket[5].RICCode + '#')) + '#' + this.ddlNoteCcy;

        console.log(this.ShareBasket[0],"sharebasket console")
      this.tempXML += '<Record>' +
        '<Share>' + shareCcy + '</Share>' +
        '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].RICCode) + '</ShareBBGRIC1>' +
        ' <ShareBBGRIC2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].RICCode) + '</ShareBBGRIC2>' +
        '<ShareBBGRIC3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].RICCode) + '</ShareBBGRIC3>' +
        '<ShareBBGRIC4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].RICCode) + '</ShareBBGRIC4>' +
        '<ShareBBGRIC5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].RICCode) + '</ShareBBGRIC5>' +
        '<ShareBBGRIC6>' + ((this.ShareBasket[5] === undefined) ? '' : this.ShareBasket[5].RICCode) + '</ShareBBGRIC6>' +

        '<ShareLongName1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</ShareLongName1>' +
        '<ShareLongName2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].LongName) + '</ShareLongName2>' +
        '<ShareLongName3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].LongName) + '</ShareLongName3>' +
        '<ShareLongName4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].LongName) + '</ShareLongName4>' +
        '<ShareLongName5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].LongName) + '</ShareLongName5>' +

        '<CouponBarrier>' + this.cpnTrigger + '</CouponBarrier>' +
        '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
        '<Strike>' + this.Strike + '</Strike>' +
        '<IBPrice>' + this.IBPrice + '</IBPrice>' +
        '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
        '<KOPer>' + this.autoTrigger + '</KOPer>' +
        '<KOType>' + this.autoFreq + '</KOType>' +
        '<UpfrontAQ></UpfrontAQ>' +
        '<KIPer>' + this.barrierLevel + '</KIPer>' +
        '<KIType>' + this.barrierType + '</KIType>' +
        '<CouponPer>' + this.cpnCoupon + '</CouponPer>' +
        '<CouponType>' + this.cpnType + '</CouponType>' +
        '<TenorPer></TenorPer>' +
        '<TenorType></TenorType>' +

        '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].Code) + '</Underlying1>' +
        '<Underlying2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].Code) + '</Underlying2>' +
        '<Underlying3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].Code) + '</Underlying3>' +
        '<Underlying4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].Code) + '</Underlying4>' +
        '<Underlying5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].Code) + '</Underlying5>' +
        '<Gearing></Gearing>' +
        '<Upfront></Upfront>' +
        '<Guarantee></Guarantee>' +
        '<LowCoupon></LowCoupon>' +
        '<HighCoupon></HighCoupon>' +
        '<TradeDate_Type></TradeDate_Type>' +
        '<Frequency>' + this.cpnFreq + '</Frequency>' +
        '<SettlWeek></SettlWeek>' +
        '<NonCall></NonCall>' +
        '<Wrapper>' + this.format + '</Wrapper>' +
        '<Size>' + notionalValue + '</Size>' +
        '<PaymentDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</PaymentDate>' +
        //Commented by Apurva K|| 09-Jun-2023|| FIN1EURINT-455
        // '<StrikeDate>' + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy') + '</StrikeDate>' +
        '<StrikeDate></StrikeDate>' +
        '<StepDown>' + this.autoStepDown + '</StepDown>' +
        '<ERCouponPer>' + this.autocallCoupon + '</ERCouponPer>' +
        '<ERCouponType>' + this.autocallCouponType + '</ERCouponType>' +
        '<MemoryPds>' + this.MemoryPeriods + '</MemoryPds>' +
        '<AltCouponPer>' + this.altCoupon + '</AltCouponPer>' +
        '<AltCouponObservation>' + this.altObservation + '</AltCouponObservation>' +
        '<FundingType>' + this.fundType + '</FundingType>' +
        '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>' +
        '<IndexRateSpread>' + this.fundRate + '</IndexRateSpread>' +
        '<AttachValue></AttachValue>' +
        '<DetachValue></DetachValue>' +
        '<FloatingRef></FloatingRef>' +
        '<FloatingFreq></FloatingFreq>' +
        '<CouponBasis></CouponBasis>' +
        '<ReofferPrice></ReofferPrice>' +
        '<Mode></Mode>' +
        '<FormatDetails>' + this.format + '</FormatDetails>' +
        '<CouponObs>' + this.cpnObservation + '</CouponObs>' +
        '<NonCallPeriod>' + this.autoNonCall + '</NonCallPeriod>' +
        '<ExpiryDate>' + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy') + '</ExpiryDate>' +
        '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<AttachPer></AttachPer>' +
        '<DetachPer></DetachPer>' +
        '<CouponSpread></CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +
        '<ERFrequency>' + this.autoFreq + '</ERFrequency>' +
        '<SubTemplate>' + (this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER') + '</SubTemplate>' +
        '<ComputedStrikeFixingLag>' + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</ComputedStrikeFixingLag>' +
        '<ComputedSettlementPeriodSoftTenor>' + (this.paymentshift === 'Custom' ? (this.customSetDate + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')) + '</ComputedSettlementPeriodSoftTenor>' +
        '<ComputedPayoffSoftTenor>' + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</ComputedPayoffSoftTenor>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        '<LeverageYN>' + this.LeverageYN + '</LeverageYN>' +
        '<CouponinFine>' + this.cpnInFine + '</CouponinFine>' +
        '<RangeAccrualFrequency>' + this.rangeAccrualFreq + '</RangeAccrualFrequency>' +
        '<LowerCouponBarrier>' + this.lowCpnBarrier + '</LowerCouponBarrier>' +
        '<UpperCouponBarrier>' + this.upperCpnBarrier + '</UpperCouponBarrier>' +
        '<YieldFloatingReference>' + this.cpnFltRef + '</YieldFloatingReference>' +
        '<FixingDetermination>' + this.cpnFixing + '</FixingDetermination>' +
        '<Floor_Perc>' + this.cpnFloor + '</Floor_Perc>' +
        '<Cap_Perc>' + this.cpnCap + '</Cap_Perc>' +
        '<Multiplier>' + this.cpnMultiplier + '</Multiplier>' +
        '<PutGearing>' + this.leverage + '</PutGearing>' +
        '<KIBarrier>' + this.KIBarrier + '</KIBarrier>' +
        '<UpperPutStrike>' + this.upperPutStrike + '</UpperPutStrike>' +
        '<LowerPutStrike>' + this.lowerPutStrike + '</LowerPutStrike>' +
        '<PutSpreadGearing>' + this.putSpreadGearing + '</PutSpreadGearing>' +
        '<FinalUpside>' + this.upsideType + '</FinalUpside>' +
        '<LowerCallStrike>' + this.lowerCallStrike + '</LowerCallStrike>' +
        '<UpperCallStrike>' + this.upperCallStrike + '</UpperCallStrike>' +
        '<CallSpreadGearing>' + this.callSpreadGearing + '</CallSpreadGearing>' +
        '<CallStrike>' + this.callStrike + '</CallStrike>' +
        '<CallGearing>' + this.callGearing + '</CallGearing>' +
        '<AutocallCouponType>' + this.ERCpnType + '</AutocallCouponType>' +
        '<ERCouponPerc>' + this.ERCoupon + '</ERCouponPerc>' +
        '<PeriodicCouponYN>' + this.periodicCouponFlag + '</PeriodicCouponYN>' +
        '<Listing>' + this.listed + '</Listing>' +
        '<StockExchange>' + this.stockExchange + '</StockExchange>' +
        '<Language>' + this.language + '</Language>' +
        '<Country>' + this.country + '</Country>' +
        '<Quanto>' + this.quanto + '</Quanto>' +
        '<Priips>' + this.priipsYN + '</Priips>' + //Added by Apurva K|| 02-Dec-2023|| EULGTINT-203
        '<VariableAutocallBarrier>'+ this.autoTrigger + manualtrigger + '</VariableAutocallBarrier>'+ //Added by Apurva K|| 02-Dec-2023|| HSBCECCLI-88
        '<SettlementMethod>' + this.SettlementMethod + '</SettlementMethod>' +
        '<DailyKOYN>' + this.dailyKOYN + '</DailyKOYN>' +
        '</Record>';

      // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
      this.commonfunctions.generateFlexiXml({xml: this.tempXML, index: 0});
      return this.tempXML;
    } catch (error) {
      //console.log('Error', error);
    }
  }

  checkValidNotional(e) {
    try {
      $("#txtnotional").next(".error-input").remove();
      $("#txtnotional").next(".validate-popup").remove();
      const NotionalData = this.commonfunctions.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
        this.Notional = NotionalData.Notional;
        e.target.value = this.Notional;
      } else {
        this.ErrorMsgTop = NotionalData.ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }

  //Added by Varsha G || FIN1EURINT-115 || 19-Apr-2023
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
  async checkValidBookOrderNotional(e, fieldName) {
    try {
      var fieldsArr = { 'txtlimitLevel': 'Limit Level', 'txtnotional': 'Order Notional' }
      const NotionalData = await this.commonfunctions.checkValidNotional(e);
      fieldName === "txtnotional" ? this.txtnotional = NotionalData.Notional : null;
      //this.txtnotional = txtERCouponData.Notional;
      this.setTotalNotional(); //Changes done by Jyoti S to resolve Order & Total notional issue in place order popup of Previous quotes || 14-Apr-2023
      //console.log(txtERCouponData);
      if (NotionalData.ErrorMsg === '') {
        this[fieldName] = NotionalData.Notional;
        e.target.value = NotionalData.Notional;
        this.errorMsgBookOrder = "";
      } else {
        this[fieldName] = 0.00;
        e.target.value = 0.00;
        // this.errorMsgBookOrder = NotionalData.ErrorMsg;
        this.errorMsgBookOrder = "Please enter valid " + fieldsArr[fieldName];
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }

  async checkNotional(e) {
    try {
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        const target = await this.commonfunctions.GetEventTarget(e);
        const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));

        this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', this.ddlNoteCcy);
        if (this.checkNotionalRes[0] && (floatNotional < this.checkNotionalRes[0].Minimum || floatNotional > this.checkNotionalRes[0].Maximum)) {
          target.classList.add('error');
          this.ErrorMsgTop = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          target.focus();
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
          $('.validate-popup').delay(5000).fadeOut('slow');
        } else {
          target.classList.remove('error');
        }

      }
      this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      e.target.value = this.Notional;
    } catch (error) {
      //console.log('Error', error);
    }
  }

  async currencyChange() {
    try {
      this.reset();
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {
        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
          document.getElementById('txtnotional').classList.add('error');
          this.ErrorMsgTop = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          document.getElementById('txtnotional').focus();
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
          $('.validate-popup').delay(5000).fadeOut('slow');
        } else {
          document.getElementById('txtnotional').classList.remove('error');
        }
      }
      if (!(this.Notional + '').includes(',')) {
        this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      this.priceBtnActive = 'Y'; //ApurvaK 

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      if (this.Dates) {
        this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      }

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      if (this.Dates) {
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      }

      if (this.SelectedUnderlyingBasketArray.length > 0) {


        this.quanto = 'No';
        for (let i = 0; i < this.SelectedUnderlyingBasketArray.length; i++) {
          if (this.ddlNoteCcy !== this.SelectedUnderlyingBasketArray[i]['Ccy']) {
            this.quanto = 'Yes';
          }
        }

      }


    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async validationOnButton() {
    try {
      $('#txtShare').css("text-indent", "0px")
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });
      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsgTop = "Service unavailable. Please reload the application and try again.";
        return false;
      } else {
        this.ErrorMsgTop = '';
      }

      //Start - Added by Apurva K|| 08-Aug-2023|| HSBCECCLI-21 | Validation on Price btn click
      if (this.ERCoupon === '0.00') {
        this.ErrorMsgTop = 'Autocall coupon can not be zero.';
        document.getElementById('txtERCoupon').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.cpnCoupon === '0.00') {
        this.ErrorMsgTop = 'Periodic coupon can not be zero.';
        document.getElementById('txtCoupon').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtCoupon")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }
    //End - Added by Apurva K|| 08-Aug-2023|| HSBCECCLI-21 | Validation on Price btn click

      if (this.SolveForvalue !== 'IBPrice' && this.SolveForvalue !== 'Upfront' && (this.IBPrice === '' || parseFloat(this.IBPrice) > 100)) {
        this.ErrorMsgTop = 'Please enter valid Reoffer price.';
        document.getElementById('txtIBPrice').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtIBPrice")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap') {
        const resMsg: any = await this.apifunctions.reofferValidation(this.issuePrice, this.IBPrice, 'EQ', this.format);
        if (resMsg !== '') {
          this.ErrorMsgTop = resMsg;
          document.getElementById('txtIBPrice').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtIBPrice")
          $('.validate-popup').delay(5000).fadeOut('slow');
        }
      }

      if (this.ShareBasket.length <= 0) {
        document.getElementById('txtShare').className = 'underlyingError';
        this.ErrorMsgTop = 'Please enter underlying.';
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".underlyingError")
        $('.validate-popup').delay(5000).fadeOut('slow');
        $('#txtShare').css("text-indent", "30px");
        document.getElementById('txtShare').classList.add('txtalignLeft');//Added by SandipA for FIN1EURINT-672 @17-Nov-23
      }
      if (this.SolveForvalue !== 'Strike') {
        if (parseFloat(this.Strike) <= parseFloat(this.minStrike)) {
          this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');
        }
      }
      //Added by Apurva C || Validations between Strike & Barrier Level || 18-Nov
      if (this.SolveForvalue !== 'Strike') {
        if (parseFloat(this.Strike) < parseFloat(this.barrierLevel)) {
          this.ErrorMsgTop = 'Put Strike should be greater than KI Barrier Level';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');

        }
      }
       // Start || Added by Adil for Custom barrier for Validation|| HSBCECCLI-42 || 17-08-2023
       
      if (this.autoTrigger === '') {

        this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
        document.getElementById('txtKO').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtKO")
        $('.validate-popup').delay(5000).fadeOut('slow');

      } else if (parseFloat(this.autoTrigger) <= parseFloat(this.minTrigger) ||
        parseFloat(this.autoTrigger) >= parseFloat(this.maxTrigger)) {
        this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
        document.getElementById('txtKO').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtKO")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }
      if (this.manualTriggerValueArr.length > 0) {
        this.manualTriggerValueArr.forEach((t) => {
          if (t.OutTrigger != '-') {
            if (t.OutTrigger === '') {

              this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
              //document.getElementById('inputManualTgr'+t.NoOfPeriods).classList.add('error');
              document.getElementById('txtKO').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter('#inputManualTgr'+t.NoOfPeriods);
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtKO");
              $('.validate-popup').delay(5000).fadeOut('slow');
      
            } else if (parseFloat(t.OutTrigger) <= parseFloat(this.minTrigger) ||
              parseFloat(t.OutTrigger) >= parseFloat(this.maxTrigger)) {
              this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
              //document.getElementById('inputManualTgr'+t.NoOfPeriods).classList.add('error');
              document.getElementById('txtKO').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter('#inputManualTgr'+t.NoOfPeriods);
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtKO");
              $('.validate-popup').delay(5000).fadeOut('slow');
            }
          }

        })
      }

      if (this.cpnTrigger !== '' && (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory' || this.cpnType === 'Floating without Memory')) {
        if (this.cpnTrigger.indexOf('/') < 0) {
          if (parseFloat(this.cpnTrigger) <= parseFloat(this.minCoupon)
            || parseFloat(this.cpnTrigger) >= parseFloat(this.maxCoupon)) {
            this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
            document.getElementById('txtCouponBarrier').classList.add('error');
            $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtCouponBarrier")
            $('.validate-popup').delay(5000).fadeOut('slow');
          }
        } else {
          const cpnArr = this.cpnTrigger.split('/');
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < cpnArr.length; i++) {
            if (parseFloat(cpnArr[i]) <= parseFloat(this.minCoupon) || parseFloat(cpnArr[i]) >= parseFloat(this.maxCoupon)) {
              this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
              document.getElementById('txtCouponBarrier').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtCouponBarrier")
              $('.validate-popup').delay(5000).fadeOut('slow');
            }
          }
        }

      }

      if (parseFloat(this.barrierLevel) <= parseFloat(this.minBarrier)) {
        this.ErrorMsgTop = 'Barrier level should be greater than ' + this.minBarrier + '%.';
        document.getElementById('txtKI').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtKI")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (parseFloat(this.autoStepDown) <= parseFloat(this.minStepdown)) {
        this.ErrorMsgTop = 'Stepdown should be greater than ' + this.minStepdown + '%.';
        document.getElementById('txtautoStepDown').classList.add('error');
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtautoStepDown")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }


      if (this.stkdate === '') {
        document.getElementById('txtstkdate').classList.add('error');
        this.ErrorMsgTop = 'Please enter valid strike date.';
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtstkdate")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.settdate === '') {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsgTop = 'Please enter valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      //console.log(this.stkdate, this.settdate);
      if (this.settdate !== undefined) {
        if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
          || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
          this.ErrorMsgTop = 'Please select valid strike date.';
          document.getElementById('txtstkdate').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customSetDate")
          $('.validate-popup').delay(5000).fadeOut('slow');
        }
      }

      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customSetDate")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid expiry date.';
      }

      if (this.customSetDate === null) {
        document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsgTop = 'Please enter valid payment date.';
        $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.SolveForvalue !== 'ERCoupon' && this.ERCpnType !== 'None') {
        if (this.ERCoupon === '') {
          this.ErrorMsgTop = 'Please enter valid ER coupon.';
          document.getElementById('txtERCoupon').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
          $('.validate-popup').delay(5000).fadeOut('slow');
        }
      }


      var IssueDateOffsetValue;
      if(this.paymentshift==='Custom')
        {
          console.log(this.customSetDate);
          IssueDateOffsetValue=Number(this.customSetDate);
          if(IssueDateOffsetValue<Number(this.MinimumAllowedIssueDateOffset)){
            this.ErrorMsgTop="Issue Date Offset (" + this.customSetDate + ") is less than minimum required ("+ this.MinimumAllowedIssueDateOffset +")";
            document.getElementById('txtERCoupon').classList.add('error');
            $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
            $('.validate-popup').delay(5000).fadeOut('slow');
          }          
        }
        else
        {
          IssueDateOffsetValue=Number(this.paymentshift.split('+')[1].trim());
          if(IssueDateOffsetValue<Number(this.MinimumAllowedIssueDateOffset)){
            this.ErrorMsgTop="Issue Date Offset (" + this.paymentshift + ") is less than minimum required ("+ this.MinimumAllowedIssueDateOffset+")";
            document.getElementById('txtERCoupon').classList.add('error');
            $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
            $('.validate-popup').delay(5000).fadeOut('slow');            
          }          
        }

      $('.validate-popup').delay(5000).fadeOut('slow');

      // Min max validation on price button - added by Priya L. on 15Mar2022 - assigned by Pranav D.
      this.MinMaxValidationonPriceBtn('Notional', 'txtnotional', this.Notional);
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async setPrevQuoteData1(cloneData, viewOnly) {
    try {



      //this.buttonList = cloneData.Actions[0];
      this.ddlNoteCcy = cloneData.ddlNoteCcy[0]; // Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
      this.format = cloneData.Format[0];
      this.SolveForvalue = cloneData.SolveFor[0];// Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
      this.ShareBasket = [];
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];
      this.priipsYN = cloneData.priipsYN[0];
      this.language = cloneData.language[0].replace(/~/g, ',')
      this.country = cloneData.country[0].replace(/~/g, ',')

      if ((!cloneData.SettShifter[0] || cloneData.SettShifter[0] === '') && cloneData.settdate[0] !== '') {
        this.paymentshift = "Custom";
        //console.log(" payment shift update", this.paymentshift)
      }


      this.IBPrice = cloneData.IBPrice[0];// Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
      this.Notional = this.commonfunctions.formatNotional(cloneData.Notional[0]);
      this.issuePrice = cloneData.IssuePrice[0];
      // Modified field mapping || Priya L || 30Mar2022 || assigned by Pranav D
      this.stkshift = cloneData.StkShifter[0] === 'Today' ? '0B' : 'Fwd';
      this.changeStkShiftToggle();
      if ((!cloneData.SettShifter[0] || cloneData.SettShifter[0] !== '') && cloneData.settdate[0] !== '') {
        this.paymentshift = "Custom";
        this.customSetDate = cloneData.SettShifter[0];
        //console.log(" payment shift update", this.paymentshift, this.settdate)
      }
      else {
        this.paymentshift = cloneData.SettShifter[0] === '5' ? 'T + 5' : (cloneData.SettShifter[0] === '10' ? 'T + 10' : cloneData.SettShifter[0]);
        //console.log("paymentshift", this.paymentshift)
      }

      if (cloneData.customTenor[0] && cloneData.customTenor[0] !== '') {
        //console.log(this.Tenor);
        //console.log(cloneData.customTenor[0]);
        var TenorIdx = this.Tenor.findIndex(item => item.Key === cloneData.customTenor[0].toUpperCase())
        //console.log(TenorIdx);
        if (TenorIdx > -1) {
          this.expshift = cloneData.customTenor[0].toUpperCase();
        } else {
          this.expshift = 'Custom'
          this.customTenor = cloneData.customTenor[0].toUpperCase();
        }
      }

      this.SettlementMethod = cloneData.SettlementMethod[0];
      this.publicOrPrivate = cloneData.publicOrPrivate[0];

      this.stkdate = this.datepipe.transform(cloneData.stkdate[0].split('T')[0], 'yyyy-MM-dd');
      this.settdate = this.datepipe.transform(cloneData.settdate[0].split('T')[0], 'yyyy-MM-dd');
      cloneData.Underlyings[0].split(',').forEach(element => {
        //console.log(element);
        var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
        if (index >= 0) {

          const shareCode = this.shares[index].Code;
          this.showUnderlying('SetPreQuote', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);// Sudarshan | HSBCECCLI-77 | 16-Nov-23 | added event name to identify in called function
        }
      }); 
      //Changed by Jyoti S || FIN1EURINT-600 || 25-Aug-2023 || START
      this.autocallCouponType = cloneData.autocallCouponType[0];
      this.autoFreq = cloneData.autoFreq[0];
      this.autoNonCall = cloneData.autoNonCall[0];
     this.autoTrigger = cloneData.autoTrigger[0].split('/')[0]; //Changed by Jyoti S || 18-Jul-2023
      let triggervalues = [];
      this.manualTriggerValueArr = []
      await this.ManualTriggerEmptyCall();
      let index = 0
      let triggerIndex = parseInt(this.autoNonCall.slice(1));
      triggervalues = cloneData.autoTrigger[0].split('/')
      this.manualTriggerValueArr.forEach((data)=>{
        if(parseInt(data.NoOfPeriods) >= triggerIndex){
          data.OutTrigger = triggervalues[index]
          index++;
        }
      })
      //Changed by Jyoti S || FIN1EURINT-600 || 25-Aug-2023 || END
      // this.autocallCouponType == 'Custom Barrier' ? this.manualTriggerValueArr = cloneData.autoTrigger[0].split('/') : '';
      if ( cloneData.autoStepdown[0] && cloneData.autoStepdown[0] != '') {
        this.autoStepDown = cloneData.autoStepdown[0];
        this.autoStepDownYN = 'Y';
      } else {
        this.autoStepDownYN = 'N';
      } //Changed by Jyoti S || 18-Jul-2023
      this.cpnType = cloneData.cpnType[0];
      this.cpnObservation = cloneData.cpnObservation[0];
      this.cpnTrigger = cloneData.cpnTrigger[0];
      this.cpnCoupon = cloneData.cpnCoupon[0];
      this.cpnFreq = cloneData.cpnFreq[0];
      this.cpnInFine = cloneData.cpnInFine[0] === 'N' ? 'No' : (cloneData.cpnInFine[0] === 'Y' ? 'Yes' : cloneData.cpnInFine[0]); // Modified field mapping || Priya L || 01Apr2022 || assigned by Pranav D
      this.rangeAccrualFreq = cloneData.rangeAccrualFreq[0];
      this.lowCpnBarrier = cloneData.lowCpnBarrier[0];
      this.upperCpnBarrier = cloneData.upperCpnBarrier[0];
      this.cpnFltRef = cloneData.cpnFltRef[0];
      this.cpnFixing = cloneData.cpnFixing[0];
      this.cpnFloor = cloneData.cpnFloor[0];
      this.cpnCap = cloneData.cpnCap[0];
      this.cpnMultiplier = cloneData.cpnMultiplier[0];

      this.barrierType = cloneData.barrierType[0];
      this.Strike = cloneData.strike[0];
      this.leverage = cloneData.leverage[0];
      this.barrierLevel = cloneData.barrierLevel[0];
      this.upperPutStrike = cloneData.upperPutStrike[0];
      this.lowerPutStrike = cloneData.lowerPutStrike[0];
      this.putSpreadGearing = cloneData.putSpreadGearing[0];
      this.upsideType = cloneData.upsideType[0];
      this.lowerCallStrike = cloneData.lowerCallStrike[0];
      this.upperCallStrike = cloneData.upperCallStrike[0];
      this.callSpreadGearing = cloneData.callSpreadGearing[0];
      this.callStrike = cloneData.callStrike[0];
      this.callGearing = cloneData.callGearing[0];
      this.ERCpnType = cloneData.ERCouponType[0]; // Modified field mapping || Priya L || 01Apr2022 || assigned by Pranav D
      this.ERCoupon = cloneData.ERCoupon[0];
      this.periodicCouponFlag = cloneData.periodicCouponFlag[0] || cloneData.periodicCouponFlag[0] === '' ? 'Yes' : 'No';
      
      this.maxNotional = cloneData.MaxNotional[0]; //Added Apurva K||HSBCECCLI-126||22-May-2024
      this.minNotional = cloneData.MinNotional[0];//Apurva K||HSBCECCLI-126||22-May-2024
      this.autocallfrombasedonFreqnTenor();
      

      if (viewOnly) {

        this.orderStatus = cloneData.Status; //Added by Jyoti S || FIN1EURINT-576 || 08-Aug-2023
        this.rfqID = cloneData.RFQIDcsv[0].trim().substring(0, cloneData.RFQIDcsv[0].length - 2);
        this.noteMasterID = cloneData.Note_Master_Id[0];
        this.NoteMasterID = cloneData.Note_Master_Id[0];

        this.priceProvidersArr = [];

        for (let i = 0; i < cloneData.RFQIDcsv[0].trim().split(',').length - 1; i++) {
          this.priceProvidersArr.push(
            {
              lp: cloneData.Counterparty[0].trim().split(',')[i].trim(),
              rfq: cloneData.RFQIDcsv[0].trim().split(',')[i].trim(),
              price: (cloneData.BestValue[0].trim().split(',')[i].trim() === '0' || cloneData.BestValue[0].trim().split(',')[i].trim() === '')
                ? '-' : cloneData.BestValue[0].trim().split(',')[i].trim(),
              bestPriceFlag: cloneData.BESTPriceFlag[0] ? cloneData.BESTPriceFlag[0].trim().split(',')[i].trim() : '',
              //   BESTPriceFlag
              id: cloneData.BBVAIDcsv[0].trim().split(',')[i].trim(),
              timer: '-', // '0'
              TSFlag: cloneData.Termsheetcsv[0].trim().split(',')[i].trim() === 'Y' ? true : false,
              Msg: '',
              KIDFlag: cloneData.KIDcsv[0].trim().split(',')[i].trim() === 'Y' ? true : false,
              TSMsg: '',
              // Min Max Limit changes on View action - Added by PriyaL || 21Apr2022 || Assigned by PranavD
              minLimit: this.minNotional,
              maxLimit: this.maxNotional,
              MatchSentMsg: '',//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32

            }
          )
        }
        //console.log(this.priceProvidersArr);
        this.sortedAllPrices = {};
        this.sortedAllPrices = this.priceProvidersArr.filter(item => item.rfq === this.viewRFQ);

        if (this.sortedAllPrices && this.sortedAllPrices.length > 0) {
          this.sortedAllPrices[0] = Object.keys(this.sortedAllPrices[0]).reduce((object, key) => {
            if (key !== 'price') {
              object[key] = this.sortedAllPrices[0][key]
            } else {
              object['Price'] = this.sortedAllPrices[0][key]
            }
            return object
          }, {});
          this.orderID = this.sortedAllPrices[0].id;
        }


        switch (cloneData.SolveForvalue[0]) {
          case 'Strike':
            this.Strike = this.sortedAllPrices[0].Price; //  cloneData.SolveForValue[0];
            this.replySolveFor = 'Strike';
            break;
          case 'IBPrice':
            this.IBPrice = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Price';
            break;
          case 'Coupon':
            this.cpnCoupon = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Coupon';
            break;
          case 'KO':
            this.autoTrigger = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Autocall Trigger';
            break;
          case 'RebateCoupon':
            this.autocallCoupon = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Autocall Coupon';
            break;
          case 'CouponBarrier':
            this.cpnTrigger = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Coupon Trigger';
            break;
          case 'KI':
            this.barrierLevel = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Barrier Level';
            break;
          case 'FundingRate':
            this.fundRate = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Rate/Spread';
            break;
          case 'ERCoupon':
            this.ERCoupon = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'ER Coupon';
            break;
          case 'PutStrike':
            this.Strike = this.sortedAllPrices[0].Price;//cloneData.SolveForValue[0]; // 
            this.replySolveFor = 'Put Strike';
            break;
        }


        if (this.sortedAllPrices && this.sortedAllPrices[0]) {
          var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
          // array_move(this.priceProvidersArr, idx, 0)
          this.bestLPArray = this.priceProvidersArr[idx];
          this.bestLPArray.idx = idx

        }

      }
      this.pageloadflag = false;
          } catch (error) {
      //console.log('Error', error);
    }
  }

  async setSaveQuoteData(cloneData, viewOnly) {
    try {

      //console.log(cloneData);
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];
      this.SelectedUnderlyingBasket = [];

      this.ddlNoteCcy = cloneData.Ccy;
      this.format = cloneData.FormatDetails;
      this.SolveForvalue = cloneData.SolveFor;

      this.ShareBasket = [];
      if (cloneData.Share.indexOf('##') !== -1) {
        for (let i = 0; i < cloneData.Share.split('##')[0].split('#').length; i++) {
          this.shareCode = cloneData.Share.split('##')[0].split('#')[i];
          this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
        }
      }

      this.IBPrice = cloneData.IBPrice;
      this.Notional = this.commonfunctions.formatNotional(cloneData.Size);
      this.issuePrice = cloneData.IssuePrice;


      this.stkshift = cloneData.ComputedStrikeFixingLag === 'Today' ? '0B' : 'Fwd';
      this.changeStkShiftToggle();
      if (cloneData.ComputedSettlementPeriodSoftTenor === '10B') {
        this.paymentshift = "T + 10"
      }
      else if (cloneData.ComputedSettlementPeriodSoftTenor === '5B') {
        this.paymentshift = "T + 5"
      }
      else {
        this.paymentshift = 'Custom';
      }


      this.expshift = cloneData.ComputedPayoffSoftTenor;
      // this.changeAutoFreqOnTenor();

      // //console.log(this.stkshift[0]);
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
      if (this.Dates) {
        this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }

      // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, cloneData.ComputedSettlementPeriodSoftTenor, this.stkdate);
      if (this.Dates) {
        this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        if (cloneData.ComputedSettlementPeriodSoftTenor !== '10B' && cloneData.ComputedSettlementPeriodSoftTenor !== '5B') {
          this.paymentshift = 'Custom';
          // this.settdate = this.datepipe.transform(cloneData.IssueDate, 'yyyy-MM-dd');
          //this.settdate = cloneData.PaymentDate.split(' ')[0];
          this.customSetDate = cloneData.ComputedSettlementPeriodSoftTenor.split('B')[0];
        }

      }


      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      if (this.Dates) {
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }


      this.autocallCouponType = cloneData.ERCouponType;
      this.autoTrigger = cloneData.KOPer;
      this.autoFreq = cloneData.ERFrequency;
      if (cloneData.ERCouponPer && cloneData.ERCouponPer !== '') {
        this.autocallCoupon = cloneData.ERCouponPer;
        this.autocallCouponYN = 'Y';
      } else {
        this.autocallCouponYN = 'N';
      }
      if (cloneData.StepDown && cloneData.StepDown !== '') {
        this.autoStepDown = cloneData.StepDown;
        this.autoStepDownYN = 'Y';
      } else {
        this.autoStepDownYN = 'N';
      }
      if (cloneData.NonCallPeriod && cloneData.NonCallPeriod !== '') {
        this.autoNonCall = cloneData.NonCallPeriod;
        this.autoNonCallYN = 'Y';
      } else {
        this.autoNonCallYN = 'N';
      }
      // Coupon
      this.cpnType = cloneData.CouponType;
      this.cpnTrigger = cloneData.CouponBarrier;
      this.cpnFreq = cloneData.Frequency;
      this.cpnCoupon = cloneData.CouponPer;
      this.cpnObservation = cloneData.CouponObs;
      this.cpnInFine = cloneData.CouponinFine === 'N' ? 'No' : (cloneData.CouponinFine === 'Y' ? 'Yes' : cloneData.CouponinFine);

      this.rangeAccrualFreq = cloneData.RangeAccrualFrequency;
      this.lowCpnBarrier = cloneData.LowerCouponBarrier;
      this.upperCpnBarrier = cloneData.UpperCouponBarrier;
      this.cpnFltRef = cloneData.YieldFloatingReference;
      this.FixingDetermination = cloneData.FixingDetermination;
      this.cpnFloor = cloneData.Floor_Perc;
      this.cpnCap = cloneData.Cap_Perc;
      this.cpnMultiplier = cloneData.Multiplier;

      this.barrierType = cloneData.KIType;
      this.Strike = cloneData.Strike;
      this.leverage = cloneData.PutGearing;
      this.KIBarrier = cloneData.KIBarrier;
      this.upperPutStrike = cloneData.UpperPutStrike;
      this.lowerPutStrike = cloneData.LowerPutStrike;
      this.putSpreadGearing = cloneData.PutSpreadGearing;
      this.upsideType = cloneData.FinalUpside;
      this.lowerCallStrike = cloneData.LowerCallStrike;
      this.upperCallStrike = cloneData.UpperCallStrike;
      this.callSpreadGearing = cloneData.CallSpreadGearing;
      this.callStrike = cloneData.CallStrike;
      this.callGearing = cloneData.CallGearing;
      this.ERCpnType = cloneData.AutocallCouponType;
      this.ERCoupon = cloneData.ERCouponPerc;
      this.periodicCouponFlag = cloneData.PeriodicCouponYN;

      //Added by ApurvaK|| 18-Dec-2023|| FIN1EURINT-688
      if(cloneData.ComputedStrikeFixingLag == 'Forward'){
        this.stkdate = cloneData.StrikeShifterDate;
      }
      else{
        this.stkdate = '';
      }
      if (cloneData.Language !== undefined && cloneData.Country !== undefined)  // FIN1EURINT-502 || For updating regulatory information || Added by AdilP
      {
        this.priipsYN = "Yes"
        this.language = cloneData.Language
        this.country = cloneData.Country
      }



      this.autocallfrombasedonFreqnTenor();
      // this.ERCpnTypeChange();
      // this.periodicCouponFlagChng();
      //<Sudarshan | Commented As dates are recalculated above wrt today's date instead of taking old portfolio date>
      // this.stkdate = cloneData.StrikeDate.split(' ')[0];
      // this.settdate = cloneData.PaymentDate.split(' ')[0];
      // this.expdate = cloneData.ExpiryDate.split(' ')[0];

      if (viewOnly) {

        this.rfqID = '';
        this.noteMasterID = '';

        this.replySolveFor = cloneData.RFQID;
        this.sortedAllPrices = [];
      } else {
        switch (this.SolveForvalue) {
          case 'Strike':
            this.Strike = '';
            break;
          case 'IBPrice':
            this.IBPrice = '';
            break;
          case 'Coupon':
            this.cpnCoupon = '';
            break;
          case 'KO':
            this.autoTrigger = '';
            break;
          case 'RebateCoupon':
            this.autocallCoupon = '';
            break;
          case 'CouponBarrier':
            this.cpnTrigger = '';
            break;
          case 'KI':
            this.barrierLevel = '';
            break;
          case 'FundingRate':
            this.fundRate = '';
            break;

          case 'PutStrike':
            this.Strike = '';
            break;
          case 'CallStrike':
            this.callStrike = '';
            break;
          case 'CallGearing':
            this.callGearing = '';
            break;
          case 'LowerCallStrike':
            this.lowerCallStrike = '';
            break;
          case 'UpperCallStrike':
            this.upperCallStrike = '';
            break;

          case 'LowerCallGearing':
            this.callSpreadGearing = '';
            break;

          case 'LowerPutStrike':
            this.lowerPutStrike = '';
            break;

          case 'UpperPutStrike':
            this.upperPutStrike = '';
            break;

          case 'ERCoupon':
            this.ERCoupon = '';
            break;



        }
      }

      if (this.Strike !== '') {
        if (parseFloat(this.Strike) !== 100.00) {
          this.LeverageFlag = true;
        } else {
          this.LeverageFlag = false;
        }
      } else {
        this.LeverageFlag = true;
      }
      ////HSBCECCLI-88 || Kaustubh S || 17-Jan-2024 || START
      const CustomAutocallLevels : string = cloneData.CustomAutocallLevels?.toString()?.trim() || "";
      if(CustomAutocallLevels?.length) { //check if variant has any saved autocall trigger levels
        this.manualTriggerValueArr = undefined;
        await this.GetTriggerValue('autoTrigger', this.autocallCouponType); //get default period and trigger levels from api for selected tenor and autocall frequency
        this.manualTriggerPopup = false;
        let variantTriggerValues: string[] = CustomAutocallLevels.split("/");
        this.manualTriggerValueArr.forEach((item, index) => { //update the default trigger levels with saved trigger levels
          item.OutTrigger = variantTriggerValues[index] ?? item.OutTrigger;
        })
      }
      ////HSBCECCLI-88 || Kaustubh S || 17-Jan-2024 || END
    } catch (error) {
      //console.log('Error', error);
    }
  }

  changeAutocallCpn() {
    try {
      this.reset();
      if (this.autocallCouponYN === 'Y') {
        this.autocallCoupon = '0.00';
      } else {
        this.autocallCoupon = '';
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }
  changeAutoStepDown() {
    try {
      if (this.autoStepDownYN === 'Y') {
        this.autoStepDown = '0.00';
      } else {
        this.autoStepDown = '';
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }
  changeAutoNonCall() {
    try {
      this.reset();
      if (this.autoNonCallYN === 'Y') {
        this.autoNonCall = '0';
      } else {
        this.autoNonCall = '';
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }
  onclickShareBasket(item: any) {

    return false;
  }

  //Modified by Sudarshan P|| 20-Apr-2023
  async RequestTermsheet() {
    try {
      //Changed by Jyoti S || 31-May-2023 || START
      this.sortedAllPrices[0].TSFlag = false;
      this.ErrorMsgTop = '';
      this.ErrorMsgTop = '';
      this.sortedAllPrices[0].TSDisableFlag = true;
      this.sortedAllPrices[0].TSLoadFlag = true;
      //const errorMsg: any = this.apifunctions.termsheetSender(this.orderID, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', 'TS');
      const res: any = await this.apifunctions.termsheetSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'EQC_Europe', this.language, this.country);
      
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
      //if (errorMsg === '') {
        this.sortedAllPrices[0].TSLoadFlag = false;
        this.reqSuccessMsg = 'TS Awaited.';
        let TSTimeLeft = this.TSTimeout;
        const that = this;
        const TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {

            const res: any = await this.apifunctions.ViewTermsheet(that.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                this.sortedAllPrices[0].TSFlag = true;
                TSTimeLeft = 0;
                clearInterval(TSInterval);
                that.reqSuccessMsg = 'TS Received.';
                that.sortedAllPrices[0].TSDisableFlag = false;
              } else {
                // that.TSFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              // that.TSFlag = false;
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
//Changed by Jyoti S || 31-May-2023 || END
      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewTermsheet() {
    //Changed by Jyoti S || 31-May-2023 || START
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.docsData = [];
      let showFlag = false;
      this.sortedAllPrices[0].ViewTSFlag = true;
      const res: any = await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
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
           this.ErrorMsgTop = item.Status.toString();
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

  //Modified by Sudarshan P|| 20-Apr-2023
  async RequestKIDonView() {
    try {
      //Changed by Jyoti S || 31-May-2023 || START
      this.sortedAllPrices[0].KIDFlag = false;
      this.ErrorMsgTop = '';
      this.ErrorMsgTop = '';
      this.sortedAllPrices[0].KIDDisableFlag = true;
      this.sortedAllPrices[0].KIDLoadFlag = true;
      const res: any = await this.apifunctions.KIDSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'EQC_Europe', this.language, this.country);
      
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
        // this.reqSuccessMsg = 'Requested.';
        this.sortedAllPrices[0].KIDLoadFlag = false;
        this.reqSuccessMsg = 'KID Awaited.';
        let TSTimeLeft = this.TSTimeout;
        const that = this;
        const KIDInterval = setInterval(async() => {
          if (TSTimeLeft > 0) {
            const res: any = await this.apifunctions.ViewTermsheet(that.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.sortedAllPrices[0].KIDFlag = true;
                TSTimeLeft = 0;
                clearInterval(KIDInterval);
                // that.reqSuccessMsg = 'Received.';
                this.reqSuccessMsg = 'KID Received.';
                that.sortedAllPrices[0].KIDDisableFlag = false;
              } else {
                //that.sortedAllPrices[0].KIDFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              //that.sortedAllPrices[0].KIDFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].KIDFlag === false) {
            that.sortedAllPrices[0].KIDDisableFlag = false;
            that.reqSuccessMsg = 'Termsheet response is taking longer than expected.Please try again later.';
            clearInterval(KIDInterval);
          }
        }, 10000);
        this.intervals.add(KIDInterval);
      } else {
        // this.reqSuccessMsg = 'TS Request Failed.';
        this.sortedAllPrices[0].KIDDisableFlag = false;
        this.sortedAllPrices[0].KIDLoadFlag = false;
        this.reqSuccessMsg = 'KID Request Failed.';
      }
      //Changed by Jyoti S || 31-May-2023 || END
      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewKIDonView() {
    try {
      //Changed by Jyoti S || 31-May-2023 || START
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.docsData = [];
      let showFlag = false;
      this.sortedAllPrices[0].ViewKIDFlag = true;
      const res: any = await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
      this.sortedAllPrices[0].ViewKIDFlag = false;
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.sortedAllPrices[0].lp},
      ];
      if (res?.length) {
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
           this.ErrorMsgTop = item.Status.toString();
           showFlag = false;
         }
       });  
       this.showDocsPopup = showFlag;  

      } else {
        this.showDocsPopup = false;
        this.reqSuccessMsg = 'KID not available. Please try again later.';

      }//Changed by Jyoti S || 31-May-2023 || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }


  chkNotionalFormat(notional) {
    try {
      const regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}$/g);
      const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);

      notional = notional.toString();
      if (notional.match(regex) || notional.match(regex3)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  setFocus() {
    this.namefield.nativeElement.focus();
  }

  cloneSinglePricer() {
    this.viewOnly = false;
    this.viewRFQ = '';
    this.buttonList = 'Clone,View,';
    this.reset();
  }

  changeAutoFreq() {

    this.autoFreq = '';
    this.autoNonCall = '';
    if (this.autocallCouponType === 'Constant Barrier') {

    } else if (this.autocallCouponType === 'Variable Barrier') {

    } else if (this.autocallCouponType === 'Callable by the Issuer') {

    } else if (this.autocallCouponType === 'Putable by the Investor') {

    }
    this.cpnType = 'Snowball';
    this.cpnTypeChange();
  }

  strikeChange() {
    if (this.Strike !== '') {
      if (this.barrierType !== 'Ungeared Put' && this.LeverageYN === 'Yes') {
        if (parseFloat(this.Strike) > 0) {
          this.leverage = (((1 / this.Strike) * 100) * 100).toFixed(2);
        } else {
          this.leverage = '0.00';
        }

      } else {
        this.leverage = '100.00';
      }

    } else {
    }
  }

  async txtTenorDateChange(type: any) {
    try {
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      let strDate = '';
      this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
      this.priceBtnActive = 'Y'; //ApurvaK 
      //if (type === 'Payment') {
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (this.Dates && this.Dates.MaturityDate !== "") {
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
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
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        // Handled undefined response || Priya L || 01Apr2022 || assigned by Pranav D
        if (this.Dates) {
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        }
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.expdate = strDate;
      //}
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsgTop = 'Please select valid strike date.';
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
        this.ErrorMsgTop = 'Please select valid payment date.';
        $('<div class="error-input" style="left:150px"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
        $('.validate-popup').delay(5000).fadeOut('slow');
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid expiry date.';
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  changeAutoFreqOnTenor() {
    try {

      this.autoFreqArr = [];
      const str = (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '';
      // //console.log(str);
      if (str.toUpperCase() === 'M' || str.toUpperCase() === 'Y' || str.toUpperCase() === 'D') {
        this.autoFreqArr.push('1m');
        this.autoFreq = '1m';
      } else if (str.substr(str.length - 1, 1).toUpperCase() === 'M'
        || str.substr(str.length - 1, 1).toUpperCase() === 'Y'
        || str.substr(str.length - 1, 1).toUpperCase() === 'D') {
        const shiftChar = str.substr(str.length - 1, 1).toUpperCase();
        // tslint:disable-next-line: radix
        const shiftNum = parseInt(str.substr(0, str.length - 1));
        // //console.log(shiftChar, shiftNum);
        const month = (shiftChar === 'Y') ? (12 * shiftNum) :
          (shiftChar === 'D') ? (Math.round(shiftNum / 30)) : shiftNum;
        // //console.log(month);
        if (month === 0 || month === 1) {
          this.autoFreqArr.push('1m');
        } else {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.freqArr.length; i++) {
            // tslint:disable-next-line: radix
            const freq = parseInt(this.freqArr[i].substring(0, this.freqArr[i].length - 1));
            if (freq < month) {
              this.autoFreqArr.push(this.freqArr[i]);
            }
          }
        }
        const autoFreqNum = this.autoFreq.toString().substring(0, this.autoFreq.length - 1);
        if (month < autoFreqNum) {
          if (month === 2) {
            this.autoFreq = '1m';
          } else {
            this.autoFreq = '3m';

          }
        }
      } else {
        this.autoFreqArr = this.freqArr;
        this.autoFreq = '3m';
      }
    } catch (error) {

    }
  }

  getNoncall() {
    // tslint:disable-next-line: radix
    const val = parseInt(this.autoNonCall) + 1;
    return val === 1 ? val + 'st' : (val === 2 ? val + 'nd' : (val === 3 ? val + 'rd' : val + 'th'));
  }
// Modified function by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
  async GetTriggerValue(type: any, autocallCouponType: string) {

    let tenorinmonth = 0;
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
    // Modified by Adil for Yearly trigger getting wrong values|| HSBCECCLI-42 || 21-08-2023
    let autoFrequency;
    if(this.autoFreq == 'Yearly'){
      autoFrequency = 'Annually'
    }else
    autoFrequency = this.autoFreq

    if (type === 'autoTrigger') {
      
      if (autocallCouponType === 'Variable Barrier') {
        await this.apifunctions.GetTriggerValues(tenorinmonth, autoFrequency,
          this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data: any) => { this.TriggerValueArr = data });//Changed by Jyoti S || 14-Apr-2023
        this.autoTriggerPopup = true;
      } else {
        if (this.manualTriggerValueArr === undefined || this.manualTriggerValueArr === '') {
          await this.apifunctions.GetTriggerValues(tenorinmonth, autoFrequency,
            this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data: any) => { this.manualTriggerValueArr = data });//Changed by Jyoti S || 14-Apr-2023
          let firstValue= true;
          this.manualTriggerValueArr.forEach((t) => {
            if (t.OutTrigger != '-' && firstValue) {
              t.autocall = 'first';
              firstValue = false;
            }else{
              t.autocall = '';
            }
          })
        }
        this.manualTriggerPopup = true;
      }
      this.cpnTriggerPopup = false;
      this.fundRatePopup = false;
    }

    if (type === 'cpnTrigger') {
       await this.apifunctions.GetTriggerValues(tenorinmonth, this.cpnFreq,
        this.cpnTrigger, '', '').then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.manualTriggerPopup = false;
      this.cpnTriggerPopup = true;
      this.fundRatePopup = false;
    }
    if (type === 'fundRate') {
      await this.apifunctions.GetTriggerValues(tenorinmonth, this.fundFreq,
        this.fundRate, '', '').then((data=>{this.TriggerValueArr=data}));//Changed by Jyoti S || 14-Apr-2023
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.manualTriggerPopup = false;
      this.cpnTriggerPopup = false;
      this.fundRatePopup = true;
    }
  }
// Modified function by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
  onClickedOutside(type: any) {
    if (type === 'autoTrigger') {
      this.autoTriggerPopup = false;
      this.manualTriggerPopup = false;
    }

    if (type === 'cpnTrigger') {
      this.cpnTriggerPopup = false;

    }
    if (type === 'fundRate') {
      this.fundRatePopup = false;
    }
  }

  priceOptions() {
    try {
      this.priceoptionflag = !this.priceoptionflag;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  saveOptions() {
    try {
      this.saveoptionflag = !this.saveoptionflag;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  showSchedulePopup() {
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.scheduleMsg = '';
      this.validationOnButton();
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {

        this.showSchedulePopupFlag = !this.showSchedulePopupFlag;
        this.dateChanged();

      }

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  hideSchedulePopup() {
    try {
      this.showSchedulePopupFlag = false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  showsaveSharePopup() {
    try {
      this.validationOnButton();
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        this.showsaveSharePopupFlag = !this.showsaveSharePopupFlag;
        this.currentowner = AppConfig.settings.oRes.userName;//Changed by Varsha G || 18-Apr-2023 || Suggested by Apurva K.
      }

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  hidesaveSharePopup() {
    try {
      this.showsaveSharePopupFlag = false;
      this.saveportfolioId = '';
      this.userBasket = [];
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  //Added by Varsha G || FIN1EURINT-277 || 04-May-2023
  updateVariant(){
    try{
      if(this.portfolioName != this.selectedVariantName){
        this.updateMessagePopupFlag=true;
      }else{
        this.updatePortfolio();
      }
    }catch(error){

    }
  }

  onBehalfOfChange() {
    this.mappedformatlist = [];
    // this.priceBtnActive = 'N';
    this.priceBtnActive = 'Y'; // set to 'Y' on changing onbehalf || PriyaL || 22Apr2022 || Assigned by Pranav D
  }



  // save share user changes

  backKeyPress_User(e) {
    try {
      console.log(e)

      this.selectedUserIndex = 0;
      this.flag = true;
      this.userCode = '';
      this.selectedBIndex_User = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

      if (this.userName.length === 1) {
        this.showSuggestions = false;
        this.flag = false;
      }

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  ChangeIndex_User(e) {
    try {
      console.log(e)
      // this.selectedShareIndex = 0;
      this.selectedUserIndex = 0;
      this.userflag = true;
      this.userCode = '';
      this.selectedBIndex_User = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
    }
  }

  selectUser(e) {
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
      //console.log('Error', Error);
    }
  }

  showUser(event, item) {
    try {
      this.userflag = false;
      this.selectedBIndex_User = 0;
      this.showSuggestions_User = false;
      this.userName = '';
      //console.log(item);
      if (this.userBasket.find(i => i.Code === item.Code) === undefined) {
        this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
      }
    } catch (error) {
      //console.log('Error:', error);
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

  async changeAccessofUserGroup(e: Event, index: any) {
    const target = await this.commonfunctions.GetEventTarget(e);
    let res: any;
    //console.log(target.value);

    this.userBasket[index]['Access'] = target.value;

  }

  async sharePortfolio() {
    if(this.userBasket && this.userBasket.length > 0){
      if (this.portfolio === '') {
        this.Save();
      } else {
        await this.updatePortfolio();
      }
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
        //console.log(userView, userEdit, groupView);
        let PortfolioID = this.saveportfolioId.toString();
        const res = await this.apifunctions.InsertPortfolioSharing(this.currentowner, [], groupView, PortfolioID, userEdit, userView, [], []);
        if (res["Status"]?.toUpperCase() === "SUCCESS") {
          this.saveFlag = true;
          this.successMsg = 'Template ' + this.portfolioName + ' saved and shared successfully.';
          this.saveportfolioId = '';
          this.userBasket = [];
          this.showsaveSharePopupFlag = false;
        }

      }
    }else{
      this.successMsg = '';
      this.errorTemplateMessage = 'Please enter user ID or client group';
    }

  }


  async scheduleSend() {
    try {
      this.scheduleMsg = '';
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
        this.ErrorMsgTop = 'Please enter valid time in hh:mm (am/pm) format';
        $('#loading').hide();
        return false;
      } else {
        this.ErrorMsgTop = '';
      }
      this.validationOnButton();
      const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.inputTime));
      const today = new Date();
      if (sDate < today) {
        this.ErrorMsgTop = 'Please enter valid time';
        return false;
      }
      if (Date.parse(this.stkdate) < Date.parse(this.inputDate)) {
        this.ErrorMsgTop = 'Strike date must be greater than schedule date.';
        return false;
      }

      const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
        const xmlstr = this.generateXML();
        const res = this.apifunctions.SchedulePrice(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', xmlstr,
          sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue, '');
        if (res) {
          this.scheduleMsg = 'Request scheduled successfully.';
        }
      }
    } catch (error) {

    }
    return false;
  }


  startCountDownOld(sec, index) {
    let counter = sec;

    var interval1 = setInterval(() => {
      ////console.log( counter);  
      if (this.priceProvidersArr.length <= 0) {
        clearInterval(interval1);
      }
      if (this.priceProvidersArr.length > 0) {
        this.priceProvidersArr[index].timer = counter;
        counter--;
      }


      if (counter < 0) {

        clearInterval(interval1);


      };
    }, 1000);

  }

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
         //Start - Added by Apurva K/Kaustubh S for HSBCECCLI-32 ||11-Aug-2023
          if ((this.EQ_EnablePriceMatch == "YES" || this.EQ_EnablePriceMatch == "Y") && this.priceProvidersArr[index].lp == this.EQ_PriceMatch_LPName ) { 
          if ((this.priceProvidersArr[index]?.bestYN == 'N') && (this.priceProvidersArr[index].loadFlag == false)) {
            this.matchBtnFlag = true;
          }
        }
         //End - Added by Apurva K/Kaustubh S for HSBCECCLI-32 ||11-Aug-2023
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
          this.priceProvidersArr[index].loadFlag = false;
          this.priceProvidersArr[index].MatchSentMsg = ''; //Apurva K || 18-Jan-2023 || HSBCECCLI-32
          //Start - Added by Apurva K/Kaustubh S for HSBCECCLI-32 ||11-Aug-2023
          if ((this.EQ_EnablePriceMatch == "YES" || this.EQ_EnablePriceMatch == "Y") && this.priceProvidersArr[index].lp == this.EQ_PriceMatch_LPName ) { 
            if ((this.priceProvidersArr[index]?.bestYN == 'N') && (this.priceProvidersArr[index].loadFlag == false)) {
              this.matchBtnFlag = true;
            }
          }
           //End - Added by Apurva K/Kaustubh S for HSBCECCLI-32 ||11-Aug-2023
          clearInterval(this.priceProvidersArr[index].interval1);
        }
      }
    }, 1000);

  }


  async RequestKID(index: any) {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.priceProvidersArr[index].KIDLoadFlag= true;//Apurva K||09-May-2023

      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      //const errorMsg: any = await this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, '', 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      //Modified by Sudarshan P|| 20-Apr-2023
      const res: any = await this.apifunctions.KIDSender(this.priceProvidersArr[index].lp, this.priceProvidersArr[index].rfq, 'EQC_Europe', this.language, this.country);
      //Changes by Apurva K|| 18-May-2023 || for Awaited response in request TS
      if ((res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') && (this.priceProvidersArr[index].price !== "-")) {
         
        this.priceProvidersArr[index].Msg = 'KID Awaited';        

        // this.reqSuccessMsg = 'Requested.';
        this.priceProvidersArr[index].KidDisableFlag = true;  //Added by Apurva K|| 22-May-2023||FIN1EURINT-359
        this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        // Changes done by Apurva K || 17-May-2023 || View btn not visible on UI when clicked simultaneously with Request TS
        const KIDInterval = setInterval(async () => {
          //console.log("TSTimeLeft-KID",TSTimeLeft)
          if (TSTimeLeft > 0) {
            const res: any = await this.apifunctions.ViewTermsheet(that.priceProvidersArr[index].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.priceProvidersArr[index].KIDFlag = true;
                TSTimeLeft = 0;
                clearInterval(KIDInterval);
                // that.reqSuccessMsg = 'Received.';
                that.priceProvidersArr[index].Msg = 'KID Received';
                //Start-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
                if(that.priceProvidersArr[index].lp == this.OrderDisabledCpty){
                  if(!that.priceProvidersArr[index].TSNotSupported && !that.priceProvidersArr[index].KidNotSupported){
                    if(that.priceProvidersArr[index].TSFlag  && that.priceProvidersArr[index].KIDFlag){
                      this.BookOrderDisabledForCpty = false;
                    }
                  }
                  else if(!that.priceProvidersArr[index].KidNotSupported){
                    if(that.priceProvidersArr[index].KIDFlag){
                      this.BookOrderDisabledForCpty = false;
                    }
                  }
                  
                }
                //End-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
              } else {
                that.priceProvidersArr[index].KIDFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.priceProvidersArr[index].KIDFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.priceProvidersArr[index].KIDFlag === false) {
            // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
            // tslint:disable-next-line: max-line-length
            that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
            this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
            clearInterval(KIDInterval);
          }
        }, 10000);
        this.intervals.add(KIDInterval);
      } else {
        // this.reqSuccessMsg = 'TS Request Failed.';
        this.priceProvidersArr[index].Msg = 'KID Request Failed';
        this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewKID(index: any) {
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.docsData = [];
      let showFlag = false;
      this.priceProvidersArr[index].ViewKIDFlag = true;  //Added by Kaustubh S|| 18-May-2023

      const res: any = await this.apifunctions.ViewTermsheet(this.priceProvidersArr[index].rfq, 'Kid'); //Apurva K|| FIN1EURINT-385|| 23-May-2023
      this.priceProvidersArr[index].ViewKIDFlag = false;  //Added by Kaustubh S|| 18-May-2023
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.priceProvidersArr[index]["lp"]},
      ];
      if (res?.length) {
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
            this.ErrorMsgTop = item.Status.toString();
            showFlag = false;
          }
       });
       //</Sudarshan | base64 to Bytes>
       this.showDocsPopup = showFlag;      

      } else {
        this.showDocsPopup = false;
        this.ErrorMsgTop = 'KID not available. Please try again later.';

      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  //Modified by Sudarshan P|| 20-Apr-2023
 async RequestTS(index: any) {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.priceProvidersArr[index].TSLoadFlag= true;//Apurva K||26-Apr-2023||FIN1EURINT-246
      
      //const errorMsg: any = this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER',
       // this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', 'TS');
        const res: any = await this.apifunctions.termsheetSender(this.priceProvidersArr[index].lp, this.priceProvidersArr[index].rfq, 'EQC_Europe', this.language, this.country);
        //Changes by Apurva K|| 18-May-2023 || for Awaited response in request TS
      if ((res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') && (this.priceProvidersArr[index].price !== "-")) {
        this.priceProvidersArr[index].TSMsg = 'TS Awaited';

        // this.reqSuccessMsg = 'Requested.';
        this.priceProvidersArr[index].TSDisableFlag = true;  //Added by Apurva K|| 22-May-2023||FIN1EURINT-359
        this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        const TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res: any = await this.apifunctions.ViewTermsheet(that.priceProvidersArr[index].rfq, 'IndicativeTermsheet');
            console.log('Check TS Received :', res);
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.priceProvidersArr[index].TSFlag = true;
                TSTimeLeft = 0;

                clearInterval(TSInterval);
                // that.reqSuccessMsg = 'Received.';
                that.priceProvidersArr[index].TSMsg = 'TS Received';
                //Start-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707
                if(that.priceProvidersArr[index].lp == this.OrderDisabledCpty){
                  if(!that.priceProvidersArr[index].TSNotSupported && !that.priceProvidersArr[index].KidNotSupported){
                    if(that.priceProvidersArr[index].TSFlag  && that.priceProvidersArr[index].KIDFlag){
                      this.BookOrderDisabledForCpty = false;
                    }
                  }
                  else if(!that.priceProvidersArr[index].TSNotSupported){
                    if(that.priceProvidersArr[index].TSFlag){
                      this.BookOrderDisabledForCpty = false;
                    }
                  }
                  
                }
                //End-Added by Apurva K|| 27-Mar-2024||FIN1EURINT-707

              } else {

                that.TSFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.priceProvidersArr[index].TSFlag = false;
              TSTimeLeft = TSTimeLeft - 10;

            }
          } else if (TSTimeLeft === 0 && that.priceProvidersArr[index].TSFlag === false) {
            that.ErrorMsg = 'Termsheet response is taking longer than expected hence Termsheet will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';

            this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
            clearInterval(TSInterval);
          }
        }, 10000);
        this.intervals.add(TSInterval);
      } else {
        // this.reqSuccessMsg = 'TS Request Failed.';

        this.priceProvidersArr[index].TSMsg = 'TS Request Failed';
        this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewTS(index: any) {
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Changed by Jyoti S || 25-May-2023  || START
      this.docsData = [];
      let showFlag = false;
      this.priceProvidersArr[index].ViewTSFlag = true;
      const res: any = await this.apifunctions.ViewTermsheet(this.priceProvidersArr[index].rfq, 'IndicativeTermsheet');
      this.priceProvidersArr[index].ViewTSFlag = false;
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.priceProvidersArr[index]["lp"]},
      ];
      if (res?.length) {
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
            this.ErrorMsgTop = item.Status.toString();
            showFlag = false;
          }
        });
        //</Sudarshan | base64 to Bytes>       
        this.showDocsPopup = showFlag; 
      } else {
        this.showDocsPopup = false;
        this.ErrorMsgTop = 'Termsheet not available. Please try again later.';

      }// Changed by Jyoti S || 25-May-2023  || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
  intervalBookOrder: any;
  timeLeftBookOrder = 0;
  showOrderDetails(lp: any, rfq: any, item) {
    try {
      //console.log(this.ErrorMsgRFQpopup,"showOrderDetails APURVA console")
      let UserGroup = AppConfig.settings.oRes.groupID;
      //if((this.BlockedUserGroups.indexOf(UserGroup)) != -1){
      if(this.BlockedUserGroups.split(",").map(ele => ele.trim()).includes(UserGroup.trim())){//Changes done by Varsha G || FIN1EURINT-256 || 27-Apr-2023
        this.showBlockReason = true;
        this.successMessage = true;
        this.successMsgBookOrder = this.BlockUserMessage;
      }else{
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
      this.ErrorMsgRFQpopup = ''; //Changes by Apurva K||07-May-2024||FIN1EURINT-720
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      this.successMsgBookOrder = "";
      this.errorMsgBookOrder = "";
      this.showOrderDetailsFlag = true;
      this.Issuer = lp;
      this.selectedRFQ = rfq;
      this.OrderType = this.ordertype; //Apurva K||FIN1EURINT-709||01-Apr-2024
      this.txtnotional = this.Notional;
      this.txtddlNoteCcy = this.ddlNoteCcy;
      this.txtClientPrice = '';
      this.txtStrike = this.Strike;
      this.txtTenor = this.expshift === 'Custom' ? this.customTenor : this.expshift;
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
    }
    } catch (error) {

    }
  }

  // showOrderDetailsFromPrevQuote(lp: any, rfq: any, item) {
  async showOrderDetailsFromPrevQuote() {
    try {
      //console.log('in showOrderDetailsFromPrevQuote');
      //console.log(this.dataItemAccordian);
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      this.successMsgBookOrder = "";
      this.errorMsgBookOrder = "";
      this.showOrderDetailsFlag = true;
      // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || start
      if (this.dataItemAccordian.ER_QuoteRequestId) {
        let preQuoteData1: any;
        preQuoteData1 = await this.apifunctions.getPreviousQuoteCloneData(this.dataItemAccordian.ER_QuoteRequestId, 'RFQID');
        if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
          // this.ErrorMsgTop = 'No data found for this record.';
        } else {
          this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
          // this.dataItemAccordian.EP_Quote_Response_At = 
          preQuoteData1.cloneData.Quote_Response_At; //= 
          // }
          // }

          this.timeLeftBookOrder = 0; //"3/15/2022 2:18:56 PM"
          // if (this.dataItemAccordian && this.dataItemAccordian.EP_ValidUntilTime && this.dataItemAccordian.EP_Quote_Response_At) {
          if (this.dataItemAccordian && preQuoteData1.cloneData.Quote_Response_At && this.dataItemAccordian.EP_Quote_Response_At) {
            // item.EP_Quote_Response_At = "3/15/2022 2:26:56 PM"
            this.timeLeftBookOrder = (new Date(this.dataItemAccordian.EP_ValidUntilTime).getTime() - new Date(preQuoteData1.cloneData.Quote_Response_At).getTime());
            this.timeLeftBookOrder = this.timeLeftBookOrder / 1000;
            //console.log(this.timeLeftBookOrder);
            // this.timeLeft = 20;
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
        }
      }
      // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || end

      this.Issuer = this.dataItemAccordian.PP_CODE;
      this.selectedRFQ = this.dataItemAccordian.ER_QuoteRequestId;
      this.OrderType = 'Market';
      this.txtnotional = this.formattedAmount(this.dataItemAccordian.ER_CashOrderQuantity);
      this.txtddlNoteCcy = this.dataItemAccordian.ER_CashCurrency;
      this.txtIBPrice = this.dataItemAccordian.EP_OfferPrice;
      this.txtStrike = this.dataItemAccordian.EP_StrikePercentage;
      this.txtTenor = this.dataItemAccordian.ER_RFQTenor;
      this.txtUpfront = (100 - parseFloat(this.txtIBPrice)).toFixed(2);

      this.txtClietYield = '';
      this.txtOrderType = 'Market';
      this.txtlimitLevel = '';
      this.txtEQCRef = '';
      this.txtComment = '';
      this.txtClientPrice = 100; //this.issuePrice; // need to ask sheetal
      this.maxNotional = this.dataItemAccordian.EP_MaxNotional && this.dataItemAccordian.EP_MaxNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MaxNotional) : '0';//Changed by Varsha G || Changed from 5000000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
      this.minNotional = this.dataItemAccordian.EP_MinNotional && this.dataItemAccordian.EP_MinNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MinNotional) : '0';//Changed by Varsha G || Changed from 250000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
      if (this.BookingCenter && this.BookingCenter.length > 0) {
        // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav d.
        this.selectedBookingBranch = this.BookingCenter[0].BookingCenterCode;
      }

      this.txtShare = ''
      // this.selectedSharesData=[];
      this.ShareBasket = [];
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];

      if (this.dataItemAccordian.ER_UnderlyingCode !== undefined && this.dataItemAccordian.ER_UnderlyingCode !== '') {
        const sharecsvArr = this.dataItemAccordian.ER_UnderlyingCode.split(',');
        for (let k = 0; k < sharecsvArr.length; k++) {
          var index = this.shares.findIndex(shareItem => shareItem.Code == sharecsvArr[k]);
          if (index >= 0) {
            this.shareCode = this.shares[index].Code;
            this.exchngCode = this.shares[index].ExchangeCode;
            const lName = this.shares[index].LongName;
            const Ccy = this.shares[index].LongName;
            this.ShareBasket.push({ Code: this.dataItemAccordian.ER_UnderlyingCode, LongName: lName, Weight: '', Exchange: this.exchngCode, RICCode: this.shares[index].Code });
            this.setSelectedUnderlyingarray(lName, Ccy, this.dataItemAccordian.ER_UnderlyingCode, this.exchngCode, '', '', '', '', '', '', '');
          }
        }
      }

      this.ShareBasket.forEach(item => {
        this.txtShare = this.txtShare + item.Code + ', '

      }
      )

      this.txtShare = this.txtShare.trim();
      var lastCharater = this.txtShare.split('').pop();

      if (lastCharater == ',')
        this.txtShare = this.txtShare.substring(0, this.txtShare.length - 1);


      this.txtShare = this.dataItemAccordian.ER_UnderlyingCode


      this.tblAllocation = [];
      this.tblAllocation.push('');
      this.underlyingForLimit = "";
      this.remainingNotional = "0.00"
      this.totalNotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(2);
      this.remainingNotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(2);
      // this.txtnotional.replace(/,/g, '')
      this.allocatedNotional = "0.00";
      this.allocatedNotionalArr = [0.00];
      this.allocatedRMArray = [''];
      this.allocatedClientArray = [''];
      this.allocatedCustomerArray = [''];

      this.orderBookedFlag = false;

      return false;


    } catch (error) {

    }
  }

  btnAllocationClick() {
    ////console.log('click');
    this.tblAllocation.push('');
    (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
    this.allocatedRMArray.push('');
    return false;
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
// Added async call to resolve notional mismatch by AdilP @12-04-2023
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

  confirmValidation() {


    this.ordersuccessMsg = '';
    this.ErrorMsg = '';
    this.ErrorMsgTop = '';
    this.ErrorMsg1 = '';
    if (parseFloat(this.allocatedNotional) > parseFloat(this.maxNotional)) {
      this.ErrorMsg1 = "Cannot place order. Allocated notional is greater than the maximum permitted.";
      return false;
    }
    if (parseFloat(this.allocatedNotional) < parseFloat(this.minNotional)) {
      this.ErrorMsg1 = "Cannot place order. Allocated notional is less than the minimum permitted.";
      return false;
    }

    if (parseFloat(this.allocatedNotional) <= 0) {
      this.ErrorMsg1 = "Please enter valid allocated notional.";
      return false;
    }

    if (parseFloat(this.allocatedNotional) !== parseFloat(this.Notional.replace(/,/g, ''))) {
      // this.ErrorMsg1 = "Sum of notionals is not equal to Order Quantity.";
      this.ErrorMsg1 = "The Total of Quantities/ Notionals is not equal to the Order Quantity/ Notional."
      return false;
    }

    var i = 0;
    this.tblAllocation.forEach((element) => {
      console.log(element)
      ////console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
      if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0.00' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
        this.ErrorMsg1 = "Please enter valid Notional.";
      }
      i++;

    });

  }

  async checkValidAllocatedNotional(e) {
    try {
      this.ordersuccessMsg = '';
      this.ErrorMsg = '';
      this.ErrorMsg1 = '';
      this.ErrorMsgTop = '';
      const NotionalData = await this.commonfunctions.checkValidNotional(e);
      //console.log('1234', txtERCouponData);
      if (NotionalData.ErrorMsg === '') {

        e.target.value = NotionalData.Notional;
      } else {

        this.ErrorMsg1 = NotionalData.ErrorMsg;
      }

    } catch (error) {
      //console.log('Error', error);
    }
  }

  showPoolDetails() {
    this.poolDetailsVisibleFlag = true;
    this.setDefaultPoolVariable();
    return false;
  }

  setDefaultPoolVariable() {
    let today = new Date();
    this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
    if (this.Dates) {
      this.poolActivateDate = this.Dates.MaturityDate + ' ' + moment().format('hh:mm:ss A');

    }
    this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), '3B', '');
    if (this.Dates) {
      this.poolExpiryDate = this.Dates.MaturityDate + ' ' + moment().format('hh:mm:ss A');

    }
    this.minPoolNotional = '200,000.00';
    this.maxPoolNotional = '3,000,000.00';
    this.minOrderSize = '1,000,000.00';
    this.Denomination = '100,000.00';
  }

  hidePoolDetails() {
    this.poolDetailsVisibleFlag = false;
    return false;
  }

  hideOrderDetails() {
    this.ErrorMsg = '';
    this.ErrorMsgTop = '';
    this.ordersuccessMsg = '';
    this.showOrderDetailsFlag = false;
    this.ErrorMsgRFQpopup = ''; //Added by Apurva K||06-May-2024
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

  bookOrder() {
    try {
      this.ErrorMsg = '';
      this.ErrorMsg1 = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      //console.log(this.selectedRFQ, this.Notional.replace(/,/g, ''));
      const res = this.apifunctions.bookOrder(this.selectedBookingBranch, this.OrderType === 'Limit' ? this.LimitAmount : '', this.OrderType,
        this.selectedRFQ, 'PBRM1', this.Notional.replace(/,/g, ''));
      if (res) {
        //console.log(res, res['status'])
        if (res['status'] === 'Succeed') {
          const DealNo = res['DealNo'].split(',');
          this.ordersuccessMsg = "Order placed successfully. Order ID : " + DealNo[DealNo.length - 1];
        }
      }
    } catch (error) {

    }
    return false;
  }

  async createPool() {
    try {
      const res = await this.apifunctions.SaveProductToFolder('Fed List', this.NoteMasterID, '32264', 'Public');
      if (res) {
        this.poolSuccessMsg = "Pool created successfully";
      }
    } catch (error) {

    }

    return false;
  }

 async confirmOrder() {
    this.orderLoadFlag = true// Added by YASH AGRAWAL
    // this.validateNotional();
    this.successMsgBookOrder = "";
    this.errorMsgBookOrder = "";
    this.warningMessage = false;
    //    var bookOrderDetails =  this.apifunctions.bookOrderUCP( 
    //        this.Issuer, this.selectedRFQ, this.totalNotional.replace(/,/g, ''));

    // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
    if (this.timeLeftBookOrder <= 0) {
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

    //console.log(CustomerGridInfo);

    var bookOrderDetails: any = await this.apifunctions.bookOrderUCP(
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

  formattedAmount(amt) {
    if (amt) {
      amt = amt.toString();
      return amt == '0' || amt == '' || amt == '0.00' ? 0.00 : parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else {
      return '';
    }
  }
  postBackMethod() {
    try {
      return false;
    } catch (error) {
      //console.log(error);
    }
  }

  validateNotional() {
    //   //console.log(this.totalNotional);
    //    parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }


  //SSSSSS
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  setTotalNotional() {
    if (this.errorMsgBookOrder == '') {
      this.totalNotional = parseFloat(this.txtnotional.replace(/,/g, ''));
    }
    this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
    this.remainingNotional = this.remainingNotional.toFixed(2);
    //console.log(this.remainingNotional);
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



  async removeErrorPopup(e) {
    const target = await this.commonfunctions.GetEventTarget(e);

    $(target).next(".error-input").remove();
    $(target).next(".validate-popup").remove();
    var els = document.getElementsByClassName('error-input');
    for (let i = 0; i < els.length; i++) {
      els[i].classList.remove('error-input');
    }
    var els = document.getElementsByClassName('validate-popup');
    for (let i = 0; i < els.length; i++) {
      els[i].classList.remove('validate-popup');
    }
  }

  async emailQuote(rfq) {
    this.quoteEmailFlg = false;
    this.saveFlag = false;
    var res: any = await this.apifunctions.quoteEmail(rfq);
    if (res.Status === "Success") {
      this.quoteEmailFlg = true;
      this.successMessage = true;
      this.successMsgBookOrder = "Email sent successfully";
    }
    return false;
  } //Changes done by Jyoti S || 20-Apr-2023

  async emailQuoteLP(rfq) {
    this.quoteEmailFlg = false;
    this.saveFlag = false;
    var index = this.priceProvidersArr.findIndex(item => item.rfq == rfq)
    if (index !== -1) {
      var res: any = await this.apifunctions.quoteEmail(rfq);
      //console.log(res);
      if (res.Status=== "Success") {
        // this.quoteEmailFlg = true;
        this.priceProvidersArr[index].quoteEmailFlg = true;
        this.priceProvidersArr[index].Msg = "Email sent successfully";
        // this.successMsg = "Quote Mail Initiated"
      }
    }
    return false;
  }//Changes done by Jyoti S || 20-Apr-2023


  showhideKIBarrier() {
    if (this.barrierType !== 'None' && this.barrierType !== '' && this.barrierType !== 'Capital Protected'
      && this.barrierType !== 'Geared Put' && this.barrierType !== 'Ungeared Put' && this.barrierType !== 'Put Spread') {
      return true;
    } else {
      return false;
    }
  }

  autocallCouponTypeChange() {
    $("#txtKO").next(".error-input").remove(); // added by Amogh on 2-Dec-2021
    if (this.autocallCouponType === 'Constant Barrier' || this.autocallCouponType === 'Variable Barrier') {
      this.autoFreq = 'Monthly';
      this.callableFreq = '';
      this.putableFreq = '';
      this.resetManualTrigger(); // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
    } else if (this.autocallCouponType === 'Putable by the Investor') {
      this.autoFreq = '';
      this.callableFreq = '';
      this.putableFreq = 'Monthly';
    } else if (this.autocallCouponType === 'Callable by the Issuer') {
      this.autoFreq = '';
      this.callableFreq = 'Monthly';
      this.putableFreq = '';

    }
    if (this.autocallCouponType === 'Variable Barrier') {
      this.autoStepDown = '0.00';
      this.autoTrigger = '100.00';
    } else {
      this.autoStepDown = '';
      this.autoTrigger = '';
    }

    if (this.autocallCouponType === 'Putable by the Investor') {
      this.PutableBarrier = '100.00';
    } else {
      this.PutableBarrier = '';
    }

    if (this.autocallCouponType === 'Constant Barrier') {
      this.autoTrigger = '102.00';
    }
    // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
    if (this.autocallCouponType === 'Custom Barrier') {
      this.autoTrigger = '102.00';
    }

    this.autocallfreqbasedonTenor();
    this.autocallfrombasedonFreqnTenor();
    this.setdefaultcpnFreq(); //Added by Apurva K|| 26-Jul-2023|| FIN1EURINT-539

  }

  publicprivateChange() {
    if (this.publicOrPrivate === 'Public Offer') {
      this.listed = 'Y';
    }else{
      this.listed = 'N';//Added by Varsha G || FIN1EURINT-387 || 24-May-2023
    }
  }

  async CustomerTenorChange(type: any){
try {
  let strDate = '';
  if (type === 'Expiry') {
      this.Dates =  await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
    this.expdate = strDate;
  }
  
} catch (error) {
  
}
  }


  async filldropdownfromcommandata() {
   
    this.pageloadflag=true;
    this.resetdropdownArr();
    for (let i = 0; i < this.commonData.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "AutocallableFrom":
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
        case "BarrierOneTouchorNOtouch":
          break;
        case "BasketType":
          this.BasketType = await this.parseCommonDatatoJSONArr('BasketType');
          break;
        case "CallableFrequency":
          this.CallableFrequency = await this.parseCommonDatatoJSONArr('CallableFrequency');
          break;
        case "CallableFrom":
          this.CallableFrom = await this.parseCommonDatatoJSONArr('CallableFrom');
          break;
        case "Channel":
          break;
        case "CountryofDistribution":
          this.CountryofDistribution = await this.parseCommonDatatoJSONArr('CountryofDistribution');
          this.countryArr = [];
          for (let j = 0; j < this.CountryofDistribution.length; j++) {
            if (this.CountryofDistribution[j].Value !== '') {
              this.countryArr.push(this.CountryofDistribution[j].Value);
            }

          }

          break;
        case "CouponBarrierType":
          this.CouponBarrierType = await this.parseCommonDatatoJSONArr('CouponBarrierType');
          break;
        case "CouponFrequency":
          break;
        case "CouponType":
          this.CouponType = await this.parseCommonDatatoJSONArr('CouponType');
          this.CouponType = this.CouponType.filter(option => option.Value !== 'Snowball')
          break;
        case "Currency":
          break;
        case "EarlyRedemptionType":
          this.EarlyRedemptionType = await this.parseCommonDatatoJSONArr('EarlyRedemptionType');
          break;
        case "FinalUpside":
          this.FinalUpside = await this.parseCommonDatatoJSONArr('FinalUpside');
          break;
        case "FixingDetermination":
          this.FixingDetermination = await this.parseCommonDatatoJSONArr('FixingDetermination');
          break;
        case "Format":
          this.Format = await this.parseCommonDatatoJSONArr('Format');
          break;
        case "IssueDateOffset":
        case "IssueDateOffsetRef"://Sudarshan | Asked by vipul | 31-Jan-2024
          this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffset');
          if (!(this.IssueDateOffset?.length > 0)){
            this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffsetRef');
          }
          break;
        case "KIDs":
          this.KIDs = await this.parseCommonDatatoJSONArr('KIDs');
          break;
        case "ProtectionType":
          this.ProtectionType = await this.parseCommonDatatoJSONArr('ProtectionType');
          break;
        case "PublicorPrivate":
          this.PublicorPrivate = await this.parseCommonDatatoJSONArr('PublicorPrivate');
          break;
        case "PutableFrequency":
          this.PutableFrequency = await this.parseCommonDatatoJSONArr('PutableFrequency');
          break;
        case "PutableFrom":
          this.PutableFrom = await this.parseCommonDatatoJSONArr('PutableFrom');
          break;
        case "RangeAccrualFrequency":
          this.RangeAccrualFrequency = await this.parseCommonDatatoJSONArr('RangeAccrualFrequency');
          break;
        case "SettlementMethod":
          this.SettlementMethodArr = await this.parseCommonDatatoJSONArr('SettlementMethod');
          break;
        case "SolveFor":
          this.SolveFor =  await this.parseCommonDatatoJSONArr('SolveFor');
          break;
        case "OrderTypeCustom":
            this.OrderTypeArr =  await this.parseCommonDatatoJSONArr('OrderTypeCustom');
          break;
        case "StaticFundingType":
          this.StaticFundingType = await this.parseCommonDatatoJSONArr('StaticFundingType');
          break;
        case "StockExchange":
          this.StockExchange = await this.parseCommonDatatoJSONArr('StockExchange');
          break;
        case "SwapFloatingReference":
          this.SwapFloatingReference = await this.parseCommonDatatoJSONArr('SwapFloatingReference');
          this.SwapFloatingReference = await  this.commonfunctions.alphaNumSorting(this.SwapFloatingReference);
          break;
        case "CouponTypeArr":
          this.CouponTypeArr = await  this.parseCommonDatatoJSONArr('CouponTypeArr');
          break;
        case "Tenor":
          this.Tenor = await this.parseCommonDatatoJSONArr('Tenor');
          break;
        case "StrikeArr":
          this.StrikeArr = await   this.parseCommonDatatoJSONArr('StrikeArr');
          break;
        case "Termsheets":
          this.Termsheets = await this.parseCommonDatatoJSONArr('Termsheets');
          break;
        case "UnderlyingStrikeType":
          this.UnderlyingStrikeType = await this.parseCommonDatatoJSONArr('UnderlyingStrikeType');
          break;
        case "YieldFloatingReference":
          this.YieldFloatingReference = await this.parseCommonDatatoJSONArr('YieldFloatingReference');
          break;
        // commented below case as booking center is fetched from api -by Priya L. on 14Mar2022 - assigned by Pranav D.
        // case "BookingCenter":
        //   this.BookingCenter = this.parseCommonDatatoJSONArr('BookingCenter');
        case "NonBestPriceReason":
          this.NonBestPriceReasonArr = await this.parseCommonDatatoJSONArr('NonBestPriceReason');
      }
    }

  }

  resetdropdownArr() {
    this.AutocallableFrom = [];
    this.AutocallFrequency = [];
    this.BarrierOneTouchorNOtouch = [];
    this.BasketType = [];
    this.CallableFrequency = [];
    this.CallableFrom = [];
    this.Channel = [];
    this.CountryofDistribution = [];
    this.CouponBarrierType = [];
    this.CouponFrequency = [];
    this.CouponType = [];
    this.Currency = [];
    this.EarlyRedemptionType = [];
    this.FinalUpside = [];
    this.FixingDetermination = [];
    this.Format = [];
    this.IssueDateOffset = [];
    this.KIDs = [];
    this.ProtectionType = [];
    this.PublicorPrivate = [];
    this.PutableFrequency = [];
    this.PutableFrom = [];
    this.RangeAccrualFrequency = [];
    this.SettlementMethodArr = [];
    this.SolveFor = [];
    this.StaticFundingType = [];
    this.StockExchange = [];
    this.SwapFloatingReference = [];
    this.CouponTypeArr = [];
    this.Tenor = [];
    this.StrikeArr = [];
    this.Termsheets = [];
    this.UnderlyingStrikeType = [];
    this.YieldFloatingReference = [];
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


  setdefaultvalues() {
    //console.log('setdefaultvalues');
    for (let i = 0; i < this.defaultvaluesArr.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === 'AutocallFrequency') {
        //console.log(this.defaultvaluesArr[i]);
      }
      switch (this.defaultvaluesArr[i].Control_Name) {
        case 'Currency':
          this.ddlNoteCcy = this.defaultvaluesArr[i].Default_Value;
          this.CurrencyYN = this.defaultvaluesArr[i].ActiveYN;
          this.CurrDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.CurrencyUpdatedBy = this.defaultvaluesArr[i].Updated_By;

          // //console.log((new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString())
          this.CurrencyUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.CurrencyUpdatedAt = 
              (new Date(Date.parse(this.CurrencyUpdatedAt + ' UTC'))).toLocaleString();
          //console.log("This is setting up of currency", this.ddlNoteCcy)
          break;

        case 'Format':
          this.FormatYN = this.defaultvaluesArr[i].ActiveYN;
          this.FormatDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          if(this.defaultvaluesArr[i].Default_Value == 'undefined' || undefined){
            this.format =  this.FormatDropdown[0];
          }
          else{
            this.format = this.defaultvaluesArr[i].Default_Value;
          }
          this.FormatUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.FormatUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.FormatUpdatedAt = 
          (new Date(Date.parse(this.FormatUpdatedAt + ' UTC'))).toLocaleString();
          break;

          case 'OrderType':
            this.OrderTypeYN = this.defaultvaluesArr[i].ActiveYN;
            this.OrderTypeDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
            if(this.defaultvaluesArr[i].Default_Value == 'undefined' || undefined){
              this.ordertype =  this.OrderTypeDropdown[0];
            }
            else{
              this.ordertype = this.defaultvaluesArr[i].Default_Value;
            }
            this.OrderTypeUpdatedBy = this.defaultvaluesArr[i].Updated_By;
            this.OrderTypeUpdatedAt = this.defaultvaluesArr[i].Updated_At;
  
            this.OrderTypeUpdatedAt = 
            (new Date(Date.parse(this.OrderTypeUpdatedAt + ' UTC'))).toLocaleString();
            break;

        case 'SolveFor':
          this.SolveForYN = this.defaultvaluesArr[i].ActiveYN;
          this.selectedSolveFor = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          const tempSolveforArr = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          //console.log(tempSolveforArr, "tempArr");
          this.SolveForDropdown = [];
          for (var s = 0; s < tempSolveforArr.length; s++) {
            for (let solveforval of this.solveForArr) {
              if (tempSolveforArr[s] == (solveforval.Key)) {
                // //console.log(tempSolveforArr[s], "tempSolveforArr[s]");
                // //console.log(solveforval.Value, "i['value'] Val");
                this.SolveForDropdown.push(solveforval);
                // this.showSolveForArr.push(solveforval.Value);
              }
            }
          }
          if(this.defaultvaluesArr[i].Default_Value == "" || undefined){
            this.SolveForvalue =  this.SolveForDropdown[0];
          }
          else{
            this.SolveForvalue = this.defaultvaluesArr[i].Default_Value;
          }
          this.SolveForUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.SolveForUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.SolveForUpdatedAt = 
          (new Date(Date.parse(this.SolveForUpdatedAt + ' UTC'))).toLocaleString();
          // //console.log(this.format,"defaultformatval");
          break;

        case 'Underlyings':
          // this.ShareName = this.defaultvaluesArr[i].Default_Value;
          if (this.defaultvaluesArr[i].Default_Value && this.defaultvaluesArr[i].Default_Value !== '') {
            this.defaultvaluesArr[i].Default_Value.split(',').forEach(element => {
              var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
              if (index >= 0) {
                const shareCode = this.shares[index].Code;
                this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
              }
            });
          }

          break;

        case 'Notional':
          this.Notional = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Notional"
          break;

        case 'ReofferPrice':
          this.IBPrice = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Reoffer (%)"
          break;

        case 'Upfront':
          this.upfrontFee = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Upfront (%)"
          break;

        case 'IssuePrice':
          this.issuePrice = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Issue Price (%)"
          break;

        case 'BasketType':
          this.basketType = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'PublicPrivate':
          this.publicOrPrivate = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'Quanto':
          this.quanto = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'Listed':
          this.listed = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'StockExchange':
          this.stockExchange = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'Priips':
          //  Changes for FIN1EURINT-706|| Done by Apurva K|| 26-Mar-2024
          this.priipsYN = this.defaultvaluesArr[i].Default_Value === 'Y' || this.defaultvaluesArr[i].Default_Value.toUpperCase() === 'YES' ? 'Yes' : 'No';
          break;

        case 'Language':
          this.language = this.defaultvaluesArr[i].Default_Value;
          this.languageYN = this.defaultvaluesArr[i].ActiveYN;
          this.languageDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          //console.log(this.languageDropdown, "languageDropdown");
          this.languageDropdown1=[];
          for (let i = 0; i < this.languageDropdown.length; i++) {
            if (this.languageDropdown[i] != '') {
              this.languageDropdown1.push({ 'Key': this.languageDropdown[i], 'Value': this.languageDropdown[i] });
            }
            //console.log(this.languageDropdown1,"languagekeyvalue");
          }

          this.LanguageUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.LanguageUpdatedAt = this.defaultvaluesArr[i].Updated_At;
          
          this.LanguageUpdatedAt = 
          (new Date(Date.parse(this.LanguageUpdatedAt + ' UTC'))).toLocaleString();
          break;


        case 'Country':
          this.country = this.defaultvaluesArr[i].Default_Value;
          this.countryYN = this.defaultvaluesArr[i].ActiveYN;
          this.countryDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.countryDropdown1=[];
          for (let i = 0; i < this.countryDropdown.length; i++) {
            if (this.countryDropdown[i] != '') {
              this.countryDropdown1.push({ 'Key': this.countryDropdown[i], 'Value': this.countryDropdown[i] });
            }
            //console.log(this.countryDropdown1,"countryDropdownkeyvalue");
          }
          this.CountryUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.CountryUpdatedAt = this.defaultvaluesArr[i].Updated_At;

           
          this.CountryUpdatedAt = 
          (new Date(Date.parse(this.CountryUpdatedAt + ' UTC'))).toLocaleString();
          break;

        case 'Termsheet':
          this.termsheetType = this.defaultvaluesArr[i].Default_Value;
          break;


        case 'StrikeShifterDate':
          this.stkdate = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'IssueDateOffset':
          this.paymentshift = this.defaultvaluesArr[i].Default_Value;
          break;


        case 'Tenor':
          this.expshift = this.defaultvaluesArr[i].Default_Value;
          this.TenorYN = this.defaultvaluesArr[i].ActiveYN;
          this.TenorDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.TenorUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.TenorUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.TenorUpdatedAt = 
          (new Date(Date.parse(this.TenorUpdatedAt + ' UTC'))).toLocaleString();
          break;


        case 'SettlementMethod':
          this.SettlementMethod = this.defaultvaluesArr[i].Default_Value;
          this.settlementMethodYN = this.defaultvaluesArr[i].ActiveYN;
          this.settlementMethodDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');

          this.SettlementMethodUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.SettlementMethodUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.SettlementMethodUpdatedAt = 
          (new Date(Date.parse(this.SettlementMethodUpdatedAt + ' UTC'))).toLocaleString();
          break;


        case 'FundType':
          this.fundType = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'FundingFrequency':
          this.fundFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'FundingRateSpread':
          this.fundRate = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Rate/Spread (%)"
          break;

        case 'AutocallType':
          this.autocallCouponType = this.defaultvaluesArr[i].Default_Value;
          this.AutocallTypeYN = this.defaultvaluesArr[i].ActiveYN;
          this.autocallCpnDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');

          this.AutocallTypeUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.AutocallTypeUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.AutocallTypeUpdatedAt = 
          (new Date(Date.parse(this.AutocallTypeUpdatedAt + ' UTC'))).toLocaleString();
          break;

        case 'AutocallFrequency':
          this.autoFreq = this.defaultvaluesArr[i].Default_Value;
          this.autocallFrequencyYN = this.defaultvaluesArr[i].ActiveYN;
          this.autoFreqDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');

          this.AutocallFrequencyUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.AutocallFrequencyUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.AutocallFrequencyUpdatedAt = 
          (new Date(Date.parse(this.AutocallFrequencyUpdatedAt + ' UTC'))).toLocaleString();
          // //console.log(this.autoFreqDropdown, "autoFreqDropdown");
          break;

        case 'PutableFrequency':
          this.putableFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'CallableFrequency':
          this.callableFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'AutocallableFrom':
          this.autoNonCall = this.defaultvaluesArr[i].Default_Value;
          this.autocallableFromYN = this.defaultvaluesArr[i].ActiveYN;
            this.autocallableFromDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');

            this.AutocallableFromUpdatedBy = this.defaultvaluesArr[i].Updated_By;
            this.AutocallableFromUpdatedAt = this.defaultvaluesArr[i].Updated_At;

            this.AutocallableFromUpdatedAt = 
            (new Date(Date.parse(this.AutocallableFromUpdatedAt + ' UTC'))).toLocaleString();
          break;

        case 'AutocallBarrier':
          this.autoTrigger = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Autocall Barrier (%)"
          break;

        case 'StepUpDown':
          this.autoStepDown = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Step Up / Down (%)"
          break;

        case 'PutableBarrierLevel':
          this.PutableBarrier = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Putable Barrier Level (%)"
          break;

        case 'ProtectionType':
          this.barrierType = this.defaultvaluesArr[i].Default_Value;
          this.protectionTypeYN = this.defaultvaluesArr[i].ActiveYN;
          this.barrierTypeDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');

          this.ProtectionTypeUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.ProtectionTypeUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.ProtectionTypeUpdatedAt = 
          (new Date(Date.parse(this.ProtectionTypeUpdatedAt + ' UTC'))).toLocaleString();
          break;


        case 'PutStrike':
          this.Strike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Put Strike (%)"
          break;

        case 'ProtectionLevel':
          this.ProtectionLevel = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Protection Level (%)"
          break;

        case 'UpperPutStrike':
          this.upperPutStrike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Upper Put Strike (%)"
          break;

        case 'PutGearring':
          this.leverage = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Put Gearing (%)"
          break;

        case 'LowerPutStrike':
          this.lowerPutStrike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Lower Put Strike (%)"
          break;


        case 'BarrierLevel':
          this.barrierLevel = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "KI Barrier (%)"
          break;


        case 'PutSpreadGearing':
          this.putSpreadGearing = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Put Spread Gearing (%)"
          break;

        case 'CallStrike':
          this.callStrike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Call Strike (%)"
          break;

        case 'LowerCallStrike':
          this.lowerCallStrike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Lower Call Strike (%)"
          break;

        case 'CallGearring':
          this.callGearing = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Call Gearing (%)"
          break;

        case 'UpperCallStrike':
          this.upperCallStrike = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Upper Call Strike (%)"
          break;

        case 'CallSpreadGearing':
          this.callSpreadGearing = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Call Spread Gearing (%)"
          break;

        case 'AutocallCouponType':
          this.ERCpnType = this.defaultvaluesArr[i].Default_Value;
          this.autoCouponTypeYN = this.defaultvaluesArr[i].ActiveYN;
          this.autoCpnDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.AutocallCouponTypeUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.AutocallCouponTypeUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.AutocallCouponTypeUpdatedAt = 
          (new Date(Date.parse(this.AutocallCouponTypeUpdatedAt + ' UTC'))).toLocaleString();

          break;

        case 'ERCouponPa':
          this.ERCoupon = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "ER Coupon p.a. (%)"
          break;

        case 'AddPeriodicCpn':
          this.periodicCouponFlag = this.defaultvaluesArr[i].Default_Value;
          this.periodicCouponYN = this.defaultvaluesArr[i].ActiveYN;
          this.periodicCpnDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.AddPeriodicCpnUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.AddPeriodicCpnUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.AddPeriodicCpnUpdatedAt = 
          (new Date(Date.parse(this.AddPeriodicCpnUpdatedAt + ' UTC'))).toLocaleString();
          break;

        case 'PeriodicCpnType':
          this.cpnType = this.defaultvaluesArr[i].Default_Value;
          this.periodicCpnTypeYN = this.defaultvaluesArr[i].ActiveYN;
          this.periodicCpnTypeDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.PeriodicCpnTypeUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.PeriodicCpnTypeUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.PeriodicCpnTypeUpdatedAt = 
          (new Date(Date.parse(this.PeriodicCpnTypeUpdatedAt + ' UTC'))).toLocaleString();
          break;


        case 'CouponBarrierType':
          this.cpnObservation = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'RangeAccuralFreq':
          this.rangeAccrualFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'PeriodicCpnFreq':
          this.cpnFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'CouponBarrierLevel':
          this.cpnTrigger = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Coupon Barrier Level(%)"
          break;

        case 'CouponPaPerc':
          this.cpnCoupon = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Coupon p.a. (%) / Yield Spread p.a. (%)"
          break;

        case 'CouponInFine':
          this.cpnInFine = this.defaultvaluesArr[i].Default_Value;
          break;



      }
    }
    this.pageloadflag=false;
  }

  ERCpnTypeChange() {
    if (this.ERCpnType === 'None') {
      this.periodicCouponFlag = 'Yes';
      this.ERCoupon = '';
    } else {
      //this.periodicCouponFlag = 'No'; // Commented by sudarshan | 02-Jun-23 | Asked by nitish k to allow autocall coupon  & peroidic coupon
      
      //this.periodicCouponFlag = 'No'; // Commented by sudarshan | 02-Jun-23 | Asked by nitish k to allow autocall coupon  & peroidic coupon
      
      if (this.SolveForvalue === 'Coupon') {
        this.SolveForvalue = 'IBPrice';
      }
      //<Sudarshan/Nitish K | commented | value should not reset when we change flat/snowball coupon type>
      //this.cpnType = '';
     // this.cpnObservation = '';
     // this.cpnTrigger = '';
      //this.cpnFreq = '';
      //this.cpnCoupon = '';
      //</Sudarshan/Nitish K | commented | value should not reset when we change flat/snowball coupon type>
      this.cpnInFine = '';
      this.rangeAccrualFreq = '';
      this.lowCpnBarrier = '';
      this.upperCpnBarrier = '';
      this.cpnFloor = '';
      this.cpnCap = '';
      this.cpnMultiplier = '';
      this.cpnFixing = '';
      this.cpnFltRef = '';
    }
    // this.cpnType = 'Fixed Unconditional';
    // this.cpnFreq = 'Monthly';
    // this.cpnCoupon = '5.00'; 
  }

  shareweightcalc() {
    if (this.upsideType === 'Call Custom Basket') {
      this.ErrorMsgTop = '';
      let sum = 0;
      for (let i = 0; i < this.ShareBasket.length; i++) {
        if (this.ShareBasket[i].Weight === '' || parseFloat(this.ShareBasket[i].Weight) === 0.00) {
          this.ErrorMsgTop = "Underlying weights cannot be blank or zero.";
        }

        sum = sum + parseFloat(this.ShareBasket[i].Weight);
      }
      //console.log(sum);

      if (sum > 100) {
        this.ErrorMsgTop = "Error: The sum of weights is not 100%";
      }
    }

  }
  chngPriceChkBox(i) {
    //console.log(this.priceProvidersArr);
    //console.log(this.priceProvidersArr[i].priceChkFlg);
    this.priceProvidersArr[i].priceChkFlg = !this.priceProvidersArr[i].priceChkFlg
  }

  portfolioChange() {
    this.reset();
    this.successMsg = '';
    this.errorTemplateMessage = '';
    if (this.portfolio !== '') {
      $('#loading').show();
      setTimeout(async () => {

        const saveQuoteData: any = await this.apifunctions.getRedirectionData(this.portfolio,'AutocallablePhoenixER');
        if (saveQuoteData.length === 0) {
          this.ErrorMsgTop = 'No data found for this record.';
        } else {
          this.setSaveQuoteData(saveQuoteData[0], false);
        }
        this.accessRight = this.portfolioIdArr[this.portfolioIdArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].AccessDetail;
      });
    }
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

  async DeleteTemplate() {
    try {
      this.saveFlag = false;
      this.errorTemplateMessage = '';
      this.successMsg = ''

      if (this.portfolio !== '') {
        const res = await this.apifunctions.BBVADeletePortfolio(this.portfolio, 'AutocallablePhoenixER');
        if (res) {
          this.saveFlag = true;
          const index = this.portfolioIdArr.findIndex(obj => obj.P_ID === this.portfolio)
          this.successMsg = 'Template : ' + this.portfolioIdArr[index].P_Name + ' deleted successfully.';
          this.portfolio = '';
          this.portfolioName = '';

          this.portfolioIdArr = [];
          this.portfolioIdArr = await this.apifunctions.BBVAGetPortfolio('AutocallablePhoenixER', 'Single Pricer');
          this.portfolioIdArr.splice(0, 0, {
            AccessDetail: "ALL",
            Created_At: "",
            P_ID: "",
            P_Name: "",
            ProdType: "",
            ShareType: "ALL",
            created_by: "",
          });
          this.portfolioIdArr.map(r => {
            let item = r;
            item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
            return item;
          });
        }
      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }


  periodicCouponFlagChng() {
    if (this.periodicCouponFlag === 'No') {
      if (this.SolveForvalue === 'Coupon') {
        this.SolveForvalue = 'IBPrice';
      }
      this.cpnType = '';
      this.cpnObservation = '';
      //this.cpnTrigger = '';
      this.cpnFreq = '';
      //this.cpnCoupon = '';
      this.cpnInFine = '';
      this.rangeAccrualFreq = '';
      this.lowCpnBarrier = '';
      this.upperCpnBarrier = '';
      this.cpnFloor = '';
      this.cpnCap = '';
      this.cpnMultiplier = '';
      this.cpnFixing = '';
      this.cpnFltRef = '';
      this.ERCpnType = 'Flat';
      this.cpnCoupon = '';  //Added by Apurva K|| 09-Aug-2023|| HSBCECCLI-21
      this.cpnTrigger ='';
    } else {
      this.cpnType = 'Fixed Unconditional';
      this.cpnFreq = 'Monthly';
      //this.cpnCoupon = '5.00';
      // this.ERCpnType = 'None'; // Commented by sudarshan | 02-Jun-23 | Asked by nitish k to allow autocall coupon  & peroidic coupon
      //this.ERCoupon = '';
    }
  }
  //<!--Added by Apurva C||19-Oct-->
  SelectedTab(Tab: any) {
    this.activeTab = Tab;
    // this.commonfunctions.setState(false);
    // this.commonfunctions.setAccord(5, 'EQC_Europe')
  }
  selectRecord = {};
  prevQuoteLaunchPopUp = false;
  lauchProduct(priceRecord) {
    console.log("Price in early redemption", priceRecord, this.priceProvidersArr)
    // set close launch product subscriber to false || PriyaL || 05Apr2022 || Assigned by PranavD
    this.apifunctions.closeLaunchProduct.next(false);
    this.selectRecord = {};
    this.prevQuoteLaunchPopUp = true;
    this.selectRecord = priceRecord;
    this.selectRecord['RFQ_ID'] = priceRecord.rfq;
    this.selectRecord['Template_Code'] = 'EQC_Europe';
    this.selectRecord['RedirectedFrom'] = 'Pricers';
    this.selectRecord['Mode'] = 'Launch Product';

    return false;

  }
  async updatePortfolio() {
    try {

      this.reset();
      if (this.portfolioName === '') {
        this.ErrorMsgTop = "Please enter valid template name.";
        return false;
      }
      this.validationOnButton();
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
        this.timeLeft = -1;
        this.timeoutMsg = '';
        this.clearFlag = true;
        //clearInterval(this.interval);
        if (this.ShareBasket.length > 0) {
          $(".validate-popup").remove();
          document.getElementById('txtShare').classList.remove('underlyingError');
          document.getElementById('txtShare').classList.add('longText');
        }
        this.saveportfolioId = '';
        this.PPDetails = '';
        this.sortedAllPrices = [];
        this.AllPrices = [];
        this.orderID = '';
        this.loadflag = false;
        this.ErrorMsgTop = '';
        this.ErrorMsgTop = '';
        this.rfqID = '';
        this.noteMasterID = '';
        this.saveFlag = false;
        this.quoteEmailFlg = false;
        this.successMsg = '';
        this.errorTemplateMessage = '';
        this.reqSuccessMsg = '';
        const strXml = '<Details>' + await this.generateSaveXML() + '</Details>';
        var res :any;
         await this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, this.portfolio, 'AutocallablePhoenixER', AppConfig.settings.oRes.userID).then((data:any)=>{res=data});
        if (res) {
          if (res.errorMessage === '') {

            this.saveFlag = true;
            this.saveportfolioId = res.PortFolioID;
            this.successMsg = 'Template : ' + this.portfolioName + ' updated successfully.';
            this.portfolioIdArr = [];
             await this.apifunctions.BBVAGetPortfolio('AutocallablePhoenixER', 'Single Pricer').then((data:any)=>{this.portfolioIdArr = data});
            //this.portfolioIdArr.push({});
            this.portfolioIdArr.splice(0, 0, {
              AccessDetail: "ALL",
              Created_At: "",
              P_ID: "",
              P_Name: "",
              ProdType: "",
              ShareType: "ALL",
              created_by: "",
            });
            this.portfolioIdArr.map(r => {
              let item = r;
              item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
              return item;
            });
          } else {
            this.errorTemplateMessage = res.errorMessage;
          }
        }
      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }
  changeOrderType() {
    if (this.txtOrderType !== 'Limit') {
      this.txtlimitLevel = '';
      this.underlyingForLimit = '';
    }
    if (this.txtOrderType === 'Limit') {
      this.underlyingForLimit = this.ShareBasket[0].Code;
    }
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

  Change_KO(e) {
    this.dailyKOYN = e;
    console.log("dailyKOYN", this.dailyKOYN, e)
  }

  cpnFreqChange() {
    if (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory') {
      if (this.cpnFreq === 'Monthly') {
        this.cpnObservation = 'European (Last day of the Month)';
      }
      if (this.cpnFreq === 'Quarterly') {
        this.cpnObservation = 'European (Last day of the Quarter)';
      }
      if (this.cpnFreq === 'Semiannually') {
        this.cpnObservation = 'European (Last day of the Semester)';
      }
      if (this.cpnFreq === 'Yearly') {
        this.cpnObservation = 'European (Last day of the Year)';
      }
    } else {
      this.cpnObservation = '';
    }

  }
  async changeStkShiftToggle() {
    this.priceBtnActive = 'Y'; //ApurvaK 
    console.log("stkshift", this.stkshift)
    if (this.stkshift === '0B') {
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        console.log("stkshift", this.stkdate)
      }
    }
  }

  Setstkshiftvalue(e) {
    this.stkshift = e
  }


  changeDdl(event: any) {
    this.selectedVariantName = event.P_Name;
    this.portfolioName = event.P_Name;
    this.portfolio = event.P_ID;
    this.reset();
    this.portfolioChange();
    return false;
  }

  async sendordertocounterparty() {
    try {
      //console.log(this.ErrorMsgRFQpopup,"ErrorMsgRFQpopup");
      this.successMessage = false;
      this.warningMessage = false;
      this.successMsgBookOrder = '';

      // validation before booking order - added by PriyaL. on 25-Feb-2022 - assigned by Pranav

      if (parseFloat(this.Notional.replace(/,/g, '')) < parseFloat(this.bestLPArray.minLimit)) {
        this.successMsgBookOrder = "Cannot place order. Order notional is less than the minimum permitted.";
        this.warningMessage = true;
        this.successMessage = true;
        this.sendtoCptyBookOrder = false;
        return false;

      }
      if (parseFloat(this.Notional.replace(/,/g, '')) > parseFloat(this.bestLPArray.maxLimit)) {
        this.successMsgBookOrder = "Cannot place order. Order notional is greater than the maximum permitted.";
        this.warningMessage = true;
        this.successMessage = true;
        this.sendtoCptyBookOrder = false;
        return false;

      }


      if (parseFloat(this.Notional.replace(/,/g, '')) <= 0) {
        this.successMsgBookOrder = "Please enter valid notional.";
        this.successMessage = true;
        this.warningMessage = true;
        this.sendtoCptyBookOrder = false;
        return false;
      }


      // let res = this.apifunctions.SendOrderToCpty(this.sortedAllPrices[0].NoteMasterID, this.sortedAllPrices[0].rfq, 'N');
      let res = await this.apifunctions.SendOrderToCpty(this.sortedAllPrices[0].NoteMasterID, this.sortedAllPrices[0].rfq, this.TokenIdReprice, 'N');
      if (res['Status'] == "Succeed") {
        this.successMessage = true;
        this.successMsgBookOrder = res['ResponseMessage'];
        this.shwRepriceBookOrder = false;
        this.sendtoCptyBookOrder = true;
      } else {
        this.successMessage = true;
        this.successMsgBookOrder = res['ResponseMessage'];
        this.warningMessage = true;
        // this.errorMsgBookOrder = res.ResponseMessage;
        this.sendtoCptyBookOrder = false;
      }
      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      this.reset();
      //clearInterval(this.interval);
      return false;
    } catch (error) {

    }
  }

  setdefaultcpnFreq() {

    this.resetManualTrigger(); // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
    if (this.autoFreq === 'Yearly') {
      this.cpnFreq = 'Yearly';
    }
    if (this.autoFreq === 'Quarterly') {
      this.cpnFreq = 'Quarterly';
    }
    if (this.autoFreq === 'Semiannually') {
      this.cpnFreq = 'Semiannually';
    }
    if (this.autoFreq === 'Monthly') {
      this.cpnFreq = 'Monthly';
    }
    this.cpnFreqChange();

  }


  showERCouponTooltip() {
    if (this.ERCoupon !== '') {
      if (this.autoFreq === 'Yearly') {
        this.ERCouponTooltipValue = (parseFloat(this.ERCoupon) / 12).toFixed(2);
      }
      if (this.autoFreq === 'Quarterly') {
        this.ERCouponTooltipValue = (parseFloat(this.ERCoupon) / 4).toFixed(2);
      }
      if (this.autoFreq === 'Semiannually') {
        this.ERCouponTooltipValue = (parseFloat(this.ERCoupon) / 6).toFixed(2);
      }
      if (this.autoFreq === 'Monthly') {
        this.ERCouponTooltipValue = (parseFloat(this.ERCoupon) / 12).toFixed(2);
      }
    }
    return this.ERCouponTooltipValue;

  }

  showCouponTooltip() {
    if (this.cpnCoupon !== '') {
      if (this.cpnFreq === 'Yearly') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon)).toFixed(2);//Changes done by Jyoti S || 05-Jun-2023 || FIN1EURINT-424
      }
      if (this.cpnFreq === 'Quarterly') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 4).toFixed(2);
      }
      if (this.cpnFreq === 'Semiannually') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 2).toFixed(2);//Changes done by Jyoti S || 05-Jun-2023 || FIN1EURINT-424
      }
      if (this.cpnFreq === 'Monthly') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 12).toFixed(2);
      }
      return this.CouponTooltipValue;
    }
  }


  // function to disable fields based on default values - added by Priya L. on 02Feb2022 - assigned by Pranav D.
  enabledisablefields(fieldName) {
    let enabledisableflag = false;
    for (let i = 0; i < this.defaultvaluesArr?.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === fieldName) {
        if (this.defaultvaluesArr[i].ActiveYN === 'Y' || this.defaultvaluesArr[i].ActiveYN === '') {
          enabledisableflag = false;
        } else {
          enabledisableflag = true;
        }
        return enabledisableflag;
      }
    }
    return enabledisableflag;
  }

  // Min max validation on price button - added by Priya L. on 15Mar2022 - assigned by Pranav D.
  MinMaxValidationonPriceBtn(Pricestr: any, ControlID: any, ControlValue: any) {
    try {


      if (Pricestr !== "") {
        var cntrlIdx = this.defaultvaluesArr.findIndex(item => item.Control_Name === Pricestr);
        if (cntrlIdx > -1) {
          var MaxVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MaxVal.replace(/,/g, ''));
          var MinVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MinVal.replace(/,/g, ''));
          var ctrlVal = parseFloat(ControlValue.toString().replace(/,/g, ''))
          if (this.defaultvaluesArr[cntrlIdx].MinVal !== '' && ctrlVal < MinVal) {
            // this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
            this.ErrorMsgTop = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be greater than ' + MinVal //+ '%.';
            document.getElementById(ControlID).classList.add('error');
          }
          if (this.defaultvaluesArr[cntrlIdx].MaxVal !== "" && ctrlVal > MaxVal) {
            this.ErrorMsgTop = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be less than ' + MaxVal //+ '%.';
            document.getElementById(ControlID).classList.add('error');
          }

          if (this.ErrorMsgTop !== '') {
            document.getElementById('ControlID').classList.add('error');
            $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#" + ControlID)
            $('.validate-popup').delay(5000).fadeOut('slow');
          }
        }
      }
    } catch (error) {

    }
  }

//START || Added by SandipA for FIN1EURINT-122 || 27-Apr-2023
TenorValidationwithoutDays(e, inputTxtBox){
  try {
    let len = inputTxtBox.length;
    if(len === 0){
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      if (!this.commonfunctions.contains.call(codes, code)) {
        return false;
      }
      return true;
    }
    else{
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,  77, 87, 89, 109, 119, 121];
      if (!this.commonfunctions.contains.call(codes, code)) {
        return false;
      }
      else{
        let codes = new Array();
        codes = [77, 87, 89, 109, 119, 121];
        const code = inputTxtBox.charCodeAt(len - 1);
        if (this.commonfunctions.contains.call(codes, code)) {
          return false;
        }
        else{
          return true;
        }
      }
    }
  } catch (error) {
  }
}
//END || Added by SandipA for FIN1EURINT-122 || 27-Apr-2023

 //Start - Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
checkValidCouponPerc(e) {
  try {
    const txtERCouponData = this.commonfunctions.setDecimal(e);
    console.log('txtERCouponData', txtERCouponData);
    let ErrorMsg = '';
    if (txtERCouponData === '0.00') {
      
      if(e.target.id == 'txtERCoupon'){
        $("#txtERCoupon").next(".error-input").remove();
        $("#txtERCoupon").next(".validate-popup").remove();
        ErrorMsg='Autocall coupon can not be zero.'
        this.ErrorMsgTop = ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
      }
      else if(e.target.id == 'txtCoupon'){
        $("#txtCoupon").next(".error-input").remove();
        $("#txtCoupon").next(".validate-popup").remove();
        ErrorMsg='Periodic coupon can not be zero.'
        this.ErrorMsgTop = ErrorMsg;
        $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtCoupon")
      }
      $('.validate-popup').delay(5000).fadeOut('slow');
      //e.target.value = '';
    } else {
      if(e.target.id == 'txtERCoupon'){
        this.ERCoupon = txtERCouponData;
        e.target.value = this.ERCoupon;
        console.log('ERCoupon', this.ERCoupon);
      }
      else if(e.target.id == 'txtCoupon'){
        this.cpnCoupon = txtERCouponData;
        e.target.value = this.cpnCoupon;
        console.log('ERCoupon', this.cpnCoupon);
      }
    }
    return e.target.value;
  } catch (error) {
    //console.log('Error', error);
  }
}
  //End - Changes done by Apurva K||08-Aug-2023||HSBCECCLI-21
  // Added by Adil for Custom barrier|| HSBCECCLI-42 || 17-08-2023
  resetManualTrigger() {
    this.manualTriggerValueArr = '';
  }
  // Added by Adil for Custom barrier|| HSBCECCLI-42 || 23-08-2023
  async ManualTriggerEmptyCall() {
    let tenorinmonth = 0; {
      let tenorNum = this.expshift !== 'Custom' ? this.expshift.substr(0, this.expshift.length - 1) : this.customTenor.substr(0, this.customTenor.length - 1);
      let tenorType = this.expshift !== 'Custom' ? this.expshift.substr(this.expshift.length - 1) : this.customTenor.substr(this.customTenor.length - 1);
      if (tenorNum.includes('.')) {
        const arr = tenorNum.split('.');
        if (arr.length === 2) {
          tenorinmonth = (parseInt(arr[0]) * 12) + (parseInt(arr[1]) + 1);
        }

      } else {
        if (tenorType === 'Y') {
          tenorinmonth = (tenorNum * 12);
        } else {
          tenorinmonth = tenorNum;
        }
      }
      let autoFrequency;
      if (this.autoFreq == 'Yearly') {
        autoFrequency = 'Annually'
      } else
        autoFrequency = this.autoFreq
      await this.apifunctions.GetTriggerValues(tenorinmonth, autoFrequency,
        this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data: any) => { this.manualTriggerValueArr = data });//Changed by Jyoti S || 14-Apr-2023
      let firstValue = true;
      this.manualTriggerValueArr.forEach((t) => {
        if (t.OutTrigger != '-' && firstValue) {
          t.autocall = 'first';
          firstValue = false;
        } else {
          t.autocall = '';
        }
      })
    }
  }
  //Start-<Added by Apurva K|| 16-Aug-2023||HSBCECCLI-32>
  async Match(index: any){
    try {
      let rfmOldRFQId =''; //Added by Apurva K|| 19-Dec-2024||FIN1EURINT-704
      clearInterval(this.interval);// To clear prev polling
      ////Apurva K || 18-Jan-2023 || HSBCECCLI-32 || START
      let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == this.EQ_PriceMatch_LPName);
      rfmOldRFQId= this.priceProvidersArr[idx].rfq;
      this.priceProvidersArr[idx].MatchSentMsg = 'RFM Request Sent';//Added by Apurva K|| 16-Jan-2023
      if (idx > -1) {
        this.priceProvidersArr[idx].loadFlag = true
      }
      if (this.priceProvidersArr[idx].interval1) {
        this.priceProvidersArr[idx].interval1 = clearInterval(this.priceProvidersArr[idx].interval1);
        this.priceProvidersArr[idx].timeStartFlag = false;
      }
      this.priceProvidersArr[idx].rfq = '';
      this.priceProvidersArr[idx].price = '-';
      this.priceProvidersArr[idx].timer = this.defaultOrderTimeout;
      this.priceProvidersArr[idx].id = '';
      this.priceProvidersArr[idx].status = '';
      this.priceProvidersArr[idx].NoteMasterID = '';
      this.priceProvidersArr[idx].isSpreadEntityYN = 'N';
      this.priceProvidersArr[idx].modifiedValue = '';
      this.priceProvidersArr[idx].TSFlag = false;
      this.priceProvidersArr[idx].Msg = '';
      this.priceProvidersArr[idx].KIDFlag = false;
      this.priceProvidersArr[idx].TSMsg = '';
      //this.priceProvidersArr[idx].loadFlag = false;
      this.priceProvidersArr[idx].TSLoadFlag = false;
      this.priceProvidersArr[idx].KIDLoadFlag = false;
      this.priceProvidersArr[idx].ViewKIDFlag = false;
      this.priceProvidersArr[idx].ViewTSFlag = false;
      this.priceProvidersArr[idx].TSDisableFlag = false; 
      this.priceProvidersArr[idx].KidDisableFlag = false;
      //// Apurva K || 18-Jan-2023 || HSBCECCLI-32 || END
        let requestXML='';
        requestXML += '<MatchQuoteRequest>';
        requestXML += '<Bestprice>'+ this.bestLPArray.price +'</Bestprice>';
        requestXML += '<OldRFQId>'+ rfmOldRFQId +'</OldRFQId>';//Added by Apurva K|| 19-Dec-2024||FIN1EURINT-704
        requestXML += '</MatchQuoteRequest>';
  
        this.clearFlag = false;
        const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
        const that = this;
        const parameters = [{
          productCode: this.templateName,//'AutocallablePhoenix',
          subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'EQC_Europe',
          LP: this.EQ_PriceMatch_LPName, 
          requestXML,
          solveFor: "",
          loginID: AppConfig.settings.oRes.userID,
          userGroupID: AppConfig.settings.oRes.groupID,
          buyerEntityID: AppConfig.settings.oRes.homeEntityID,
          noteMasterID: this.noteMasterID,
          repricereqYN: 'MP'
        }];
        console.log("before that.PPDetails : ",that.PPDetails);
        await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
             
            that.PPDetails = that.PPDetails.split(",")?.filter((item) => item.trim() !== rfmOldRFQId).join(',') + "," + data.rfqid;//Added by Apurva K|| 19-Dec-2024||FIN1EURINT-704
            //console.log("after that.PPDetails : ",that.PPDetails);
            let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == this.EQ_PriceMatch_LPName);
            if (idx > -1) {
              that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
            }
          
        if (data.errorMessage !== '' || !that.pageActive) {
              that.ErrorMsgTop = data.errorMessage.split('. ')[0];
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
            //console.log("that.rfqID : ",that.rfqID);
           //console.log("data.rfqid : ",data.rfqid);
            
            that.rfqID = that.PPDetails;
            //that.noteMasterID = data.noteMasterID;
            if (!that.clearFlag) {
              that.Prices = [];
              that.timeLeft = that.defaultRFQTimeout;
              if (that.PPDetails !== '') {
                that.priceClickFlag = false;
                if (that.PPDetails !== '') {
                  const rfqPPID = that.PPDetails.split(',');
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
                console.log("after that.PPDetails : ",that.PPDetails);
              let quoteResponseCheck = false;
                that.interval = setInterval(async () => {
  
                  if (that.timeLeft > 0) {
                    that.timeoutMsg = '';                    
                    //Added by Apurva K|| 19-Dec-2024||FIN1EURINT-704
                  if (!quoteResponseCheck) {
                    quoteResponseCheck = await that.ERPriceResponse(that.PPDetails);
                  }
  
                    that.timeLeft = that.timeLeft - 5;
                  } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                    this.priceProvidersArr[idx].MatchSentMsg = '';//Added by Apurva K|| 16-Jan-2023 || HSBCECCLI-32
                    clearInterval(that.interval);//Added by Apurva K|| 19-Dec-2024||FIN1EURINT-704
  
                  }
  
                }, 5000);
              }
            }
        });
      } catch (error) {
      }
    }
//Start-<Added by Apurva K|| 16-Aug-2023||HSBCECCLI-32>
}
