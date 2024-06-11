import { Component, ElementRef, OnInit, ViewChild,Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EcHomeService } from '../../../services/ec-home.service';
import { DatePipe } from '@angular/common';
import { EcCommonService } from '../../../services/ec-common.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/services/config.service';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-default-yield',
  templateUrl: './default-yield.component.html',
  styleUrls: ['./default-yield.component.scss']
})
export class DefaultYieldComponent implements OnInit {
  templateMappingArray: any;
  pageActive: Boolean = true;
  @Input() viewOnlyFlag: any;
  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  CurrencyYN: any = 'Y';
  selectedCurrency: any;
  FormatYN: any = 'Y';
  selectedFormat: any;
  SolveForYN: any = 'Y';
  selectedSolveFor: any=[];
  UnderlyingYN: any = 'Y';
  notionalYN: any = 'Y';
  minNotional: any;
  maxNotional: any;
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
  maxMultiplier:any
  minMultiplier:any
  MultiplierYN: any = 'Y';
  maxFloor:any
  minFloor:any
  FloorYN: any = 'Y';
  maxCap:any
  minCap:any
  CapYN: any = 'Y';
  YieldSpreadPaYN :any = 'Y';
  minYieldSpreadPa :any 

  maxYieldSpreadPa:any 

  minUpperCouponBarrier:any
  maxUpperCouponBarrier:any
  UpperCouponBarrierYN:any='Y'

  minLowerCouponBarrier:any
  maxLowerCouponBarrier:any
  LowerCouponBarrierYN:any='Y'




  DefaultValueXmlRes: any;
  id: any;
  showPopup: boolean = false;
  userID: any;
  applicationID: string;
  settingsType: string;
  SucessMsg: any;
  SetDefaultValRes: any;
  showMessageFlag: boolean = false;
  showMessage: string;
  selectedCSV: any;
  activeYN: any;
  maxValue: string;
  minValue: string;
  allDefaultValues: any = [];

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
  LowerCouponBarrierUpdatedBy: any;
  LowerCouponBarrierUpdatedAt: any;
  UpperCouponBarrierUpdatedBy: any;
  UpperCouponBarrierUpdatedAt: any;
  FloatingRefIndexUpdatedBy: any;
  FloatingRefIndexUpdatedAt: any;
  YieldSpreadPaUpdatedBy: any;
  YieldSpreadPaUpdatedAt: any;
  MultiplierUpdatedBy: any;
  MultiplierUpdatedAt: any;
  FloorUpdatedBy: any;
  FloorUpdatedAt: any;
  CapUpdatedBy: any;
  CapUpdatedAt: any;
  KIDs = [];

  countrySel = new UntypedFormControl();
  languageSel = new UntypedFormControl();
  @ViewChild('focusable', { static: false }) namefield: ElementRef;
  reqSuccessMsg: string;

  selectedBIndex = 0;
  showSuggestions = false;

  flag: boolean;
  shares: any;
  ShareName: string;
  shareCode: any;
  selectedShareIndex = 0;
  ShareBasket: any = [];
  settdate = '';
  stkdate :any;
  expdate = '';

  ddlNoteCcy: any;
  UnderlyingCurrency = 'EUR';
  CCY = [];
  PopupCcyArr:any = [];
  ReceivedCCY: any;
  SolveForvalue: any;

  IBPrice: any;
  Coupon: any;

  Strike: any;
  asseturl = environment.asseturl;
  interfaceUrl = environment.interfaceURL;
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
  ErrorMsg = '';

  format: any;
  templateMappingArr: any;
  Product = 'YieldEnhancement';
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
  autocallCoupon: any;
  autocallCouponType: any;
  autocallCouponYN: any;
  autoStepDownYN: any;
  Dates: any = [];
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
  checkNotionalRes: any;
  stkshift: any;
  paymentshift: any;
  expshift: any;
  allBooksData: any = [];
  onBehalfOf = '';
  autoFreqArr: any = [];
  freqArr = ['1m', '2m', '3m', '4m', '6m', '12m'];

  TriggerValueArr: any;
  autoTriggerPopup = false;
  cpnTriggerPopup = false;
  fundRatePopup = false;


  GetClientProdDetailsArr: any;
  mappedformatlist: any;
  showSuggestions_User = false;

  todayDate: any;
  Issuer: any;
  ErrorMsgTop: any;


  txtnotional: any;
  txtIBPrice: any;
  txtStrike: any;
  txtShare: any;

  basketType = 'Worst-Of';
  publicOrPrivate = 'Public Offer';
  listed = 'Y';
  stockExchange = 'SIX Swiss Exchange';

  quanto = 'Yes';
  priipsYN = 'Y';
  country = [];
  language = [];

  termsheetType = 'Standard';
  customTenor = '';


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

  callableFreq = '';
  putableFreq = '';

  upperPutStrike = '100.00';
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

  countryArr = [];

  commonData = [];
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


  ERCpnType = '';
  ERCoupon = '';
  periodicCouponFlag = 'Yes';
  SettlementMethod = 'Cash';

  autoNonCallArr: any = [];

  LanguageArr1: any = [{ 'Key': 'Czech', 'Value': 'Czech' },
  //{ 'Key': 'Czechia', 'Value': 'Czechia' },
  { 'Key': 'Dutch', 'Value': 'Dutch' },
  { 'Key': 'English', 'Value': 'English' },
  { 'Key': 'Finnish', 'Value': 'Finnish' },
  { 'Key': 'French', 'Value': 'French' },
  { 'Key': 'Galician', 'Value': 'Galician' },
  { 'Key': 'German', 'Value': 'German' },
  //{ 'Key': 'Greece', 'Value': 'Greece' },
  { 'Key': 'Greek', 'Value': 'Greek' },
 // { 'Key': 'Guernsey', 'Value': 'Guernsey' },
  { 'Key': 'Hungarian', 'Value': 'Hungarian' },
  { 'Key': 'Italian', 'Value': 'Italian' },
  //{ 'Key': 'Italy', 'Value': 'Italy' },
  { 'Key': 'Norwegian', 'Value': 'Norwegian' },
  { 'Key': 'Polish', 'Value': 'Polish' },
  { 'Key': 'Portuguese', 'Value': 'Portuguese' },
  { 'Key': 'Russian', 'Value': 'Russian' },
  { 'Key': 'Spanish', 'Value': 'Spanish' },
  { 'Key': 'Swedish', 'Value': 'Swedish' },
  ];

  solveForArr: any =
    [
      { 'Key': ' Autocall Barrier (%)', 'Value': 'KO' },
      { 'Key': ' Call Gearing (%)', 'Value': 'CallGearing' },
      { 'Key': ' Call Spread Gearing (%)', 'Value': 'LowerCallGearing' },
      { 'Key': ' Call Strike (%)', 'Value': 'CallStrike' },
      { 'Key': ' Coupon (%)', 'Value': 'Coupon' },
      { 'Key': ' Coupon Barrier Level (%)', 'Value': 'CouponBarrier' },
      { 'Key': 'Autocall Coupon (%)', 'Value': 'ERCoupon' },
      { 'Key': ' Floor p.a. (%)', 'Value': 'Floor' },
      { 'Key': ' KI Barrier (%)', 'Value': 'KI' },
      { 'Key': 'Lower Call Strike (%)', 'Value': 'LowerCallStrike' },
      { 'Key': 'Lower Coupon Barrier (%)', 'Value': 'LowerCouponBarrier' },
      { 'Key': 'Lower Put Strike (%)', 'Value': 'LowerPutStrike' },
      { 'Key': ' Multiplier (%)', 'Value': 'Multiplier' },
      { 'Key': '  Protection Level (%)', 'Value': 'ProtectionLevel' },
      { 'Key': 'Put Strike (%)', 'Value': 'PutStrike' },
      { 'Key': ' Reoffer (%)', 'Value': 'IBPrice' },
      { 'Key': 'Spread (%)', 'Value': 'Spread' },
      { 'Key': ' Upfront Fee (%)', 'Value': 'Upfront' },
      { 'Key': ' Upper Call Strike (%)', 'Value': 'UpperCallStrike' },
      { 'Key': ' Upper Put Strike (%)', 'Value': 'UpperPutStrike' },
      { 'Key': 'Yield Spread p.a. (%)', 'Value': 'Coupon' }
    ];

    CpnBarrierTypeArr:any=[
      { 'Key': 'American Daily Close (Over the Month)', 'Value': 'American Daily Close (Over the Month)' },
      { 'Key': 'American Daily Close (Over the Quarter)', 'Value': 'American Daily Close (Over the Quarter)' },
      { 'Key': 'American Daily Close (Over the Semester)', 'Value': 'American Daily Close (Over the Semester)' },
      { 'Key': 'American Daily Close (Over the Year)', 'Value': 'American Daily Close (Over the Year)' },
      { 'Key': 'American Intraday (Over the Month)', 'Value': 'American Intraday (Over the Month)' },
      { 'Key': 'American Intraday (Over the Quarter)', 'Value': 'American Intraday (Over the Quarter)' },
      { 'Key': 'American Intraday (Over the Semester)', 'Value': 'American Intraday (Over the Semester)' },
      { 'Key': 'American Intraday (Over the Year)', 'Value': 'American Intraday (Over the Year)' },
      { 'Key': 'European', 'Value': 'European' },
      { 'Key': 'European (Last day of the Month)', 'Value': 'European (Last day of the Month)' },
      { 'Key': 'European (Last day of the Quarter)', 'Value': 'European (Last day of the Quarter)' },
      { 'Key': 'European (Last day of the Semester)', 'Value': 'European (Last day of the Semester)' },
      { 'Key': 'European (Last day of the Year)', 'Value': 'European (Last day of the Year)' }
    ];

    RangeAccFreqArr:any=[
      { 'Key': 'Daily', 'Value': 'Daily' },
      { 'Key': 'Weekly', 'Value': 'Weekly' },
      { 'Key': 'Monthly', 'Value': 'Monthly' }
    ];

    PeriodicCpnFreqArr:any=[
      { 'Key': 'Daily', 'Value': 'Daily' },
      { 'Key': 'Monthly', 'Value': 'Monthly' },
      { 'Key': 'Quarterly', 'Value': 'Quarterly' },
      { 'Key': 'Semiannually', 'Value': 'Semiannually' },
      { 'Key': 'Yearly', 'Value': 'Yearly' }
    ];

    LanguageArr = [];
    languageDropdown1: any = [];
    countryDropdown1: any=[];
  ProtectionFlag: boolean = false;  //Added by ApurvaK for frequency dropdown
  SolveForDropdown: any=[];
  FundTypeDropdown: any=[];
  autoCpnDropdown: any=[];
  periodicCpnDropdown: any=[];
  rangeFreqDropdown: any=[];
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
  putableFreqDropdown: any=[];
  callableFreqDropdown: any=[];
  barrierTypeDropdown: any=[];
  periodicCpnTypeDropdown: any=[];
  cpnBarrierTypeDropdown: any=[];
  rangeAccFreqDropdown: any=[];
  cpnFreqDropdown: any=[];
  CurrDropdown: any =[];
  FormatDropdown:any=[];
  autocallableFromDropdown: any=[];
  floatingFreIndexDropdown: any[];
  showMessageFlagXML: boolean = false;
  showMessageXML: string = '';
  showSolveForArr: any;
  cpnYieldSpreadPa:any;
  BasketData: any = [];
  tempShares: any = [];
  minMaxFlag: boolean = false;
  minMaxMsg: string ='';
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  isDealer = true; // Dealer flag - added by PriyaL on 08Dec2021 
  DealerValue
  loadflag = false;
  LeverageFlag = false;
  saveFlag = false;
  successMsg: any;
  minNotionalConfirm = false;
  viewOnly = false;
  portfolioIdArr: any = [];
  portfolioName = '';
  UserRolesArr:any = [];
  RMList:any = [];
  customerList:any = [];
  BookingCenter:any = [];
  autoNonCallYN: any;
  users: any;
  altLevel: any;
  altObservation: any;
  altCoupon: any;
  MemoryPeriods: any;
  altcouponFlag: any;
  LeverageYN: any = 'Yes';//Chnaged by Jyoti S || 29-Jun-2023
  
  constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, public datepipe: DatePipe, private route: ActivatedRoute) {
    try{
      this.applicationID = "YieldEnhancement";
      this.flag = false;
      this.shares = [];
      // this.ddlNoteCcy = 'EUR';
      this.UnderlyingCurrency = 'EUR';
      // this.format = 'Note';
      this.autoStepDownYN = 'N';
      this.autocallCouponYN = 'N';
      this.stkshift='0B';
      this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
      this.templateMappingArray =
   
      ['Currency','Format','SolveFor','Underlyings','PriveOrPublic','Quanto','Priips','Language','StrikeDate','IssueDate','Tenor','SettlementMethod','Notional','ReofferPrice','Upfront','IssuePrice','BasketType','Listed','StockExchange','Country','Termsheet','FundingType', 'FundingFrequency', 'FundingRateSpread','PeriodicCpnType','CouponBarrierType','RangeAccuralFreq','CouponBarrierLevel', 'LowerCouponBarrier','UpperCouponBarrier','CouponFrequency','CouponPaPerc','YieldSpreadPa','Floor','Cap','Multiplier','ProtectionType','PutStrike','ProtectionLevell','UpperPutStrike','PutGearring','LowerPutStrike','KIBarrier','PutSpreadGearing','FloatingRefIndex'];


    }
    catch (error) {
      ////console.log('Error', error);
    }
   }

   ngOnInit() {
    this.pageActive = true;
    this.minNotionalConfirm = false;
    try {
      this.pageloadflag=true;
      $('#loading').show();
      this.viewOnly = this.viewOnlyFlag ?? this.viewOnly; // Added by Jyoti S || 30-Jun-2023 || FIN1EURINT-511
      setTimeout(async() => {
        // this.RMList = this.apifunctions.Get_RMList();
        //this.docSupportStatus = await this.apifunctions.GetDocumentSupportStatus('YieldEnhancement');//Changed BY Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
        this.LanguageArr = [];
        for (let j = 0; j < this.LanguageArr1.length; j++) {
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
        // this.BookingCenter = this.apifunctions.GetBookingCenter();
        this.portfolioIdArr = [];

      //Last modified by Apurva K for infinite loading on initial load || 20-Apr-2023
      this.portfolioIdArr = await this.apifunctions.BBVAGetPortfolio('YieldEnhancement', 'Single Pricer');
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

        //console.log(this.RMList);
        //console.log(this.BookingCenter);

        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
        //   this.allBooksData = this.apifunctions.getAllBooksMappedToLogin();
        // }
        if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
        this.shares = await this.apifunctions.BBVALoadShares('EQ,IDX', "", "YieldEnhancement");
        }
        if (this.apifunctions.CCY === undefined || this.apifunctions.CCY.length <= 0) {
          this.ReceivedCCY = await this.apifunctions.BBVALoadCCY();
        }
        if (this.apifunctions.validationArr === undefined || this.apifunctions.validationArr.length <= 0) {
          this.validationArr = await this.apifunctions.BBVAFetchValidation('EQ');
        }
        if (this.apifunctions.payOffList === undefined || this.apifunctions.payOffList.length <= 0) {
          await this.apifunctions.getPayOffList();
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
        this.ReceivedCCY =  await this.apifunctions.CCY;
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
        // if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        //   this.commonData = this.apifunctions.GetCommonDataEuroConnect(this.templateMappingArr[0].template);
        this.commonData = await this.apifunctions.GetCommonDataEuroConnect("YieldEnhancement");
          if (this.commonData && this.commonData.length > 0) {
            this.filldropdownfromcommandata();
          }

          this.allDefaultValues = await this.apifunctions.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'YieldEnhancement');

        //}

        // //console.log('Price Providers',this.priceProvidersArr.lp.join(','))
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // this.allBooksData = this.apifunctions.allBooksData;
        // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D


        // if (this.allBooksData && this.allBooksData.length > 0) {
        //   this.onBehalfOf = this.allBooksData[0].BookCode;
        //   this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        //   if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement') > -1) {
        //       this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].CPM_Format).toString().split(',');
        //       this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].ActiveYN;
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
        await this.commonfunctions.ClearPricesFromMultiToDealEntry();

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
        this.cpnFreq = 'Monthly';
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


        if (this.allDefaultValues && this.allDefaultValues.length > 0) {
          this.ShareBasket = [];
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];
          this.fillDefaultValuesData();
        }



        const today = new Date();
        //<Added> by Apurva C || 26th-Nov-2021 || showing wrong values on launch product at initial load >
        this.cpnTypeChange();


        // this.autoFreqArr = ['1m', '2m', '3m', '4m', '6m']
        this.changeAutoFreqOnTenor();
        // tslint:disable-next-line: max-line-length
        // this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
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

        // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
        // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

        if (this.Dates) {
          this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }

        // Modified shifter as per the tenor offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
        // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
        // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? '' : this.Tenor), this.settdate);
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate); // Changed by Jyoti S || 09-May-2023
        if (this.Dates) {
          this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }
       

        
        this.pageloadflag=false;

      });
      // this.apifunctions.prevQuoteLaunchPopUpRMWObs.subscribe((res: any) => {
      //   this.prevQuoteLaunchPopUp = res[0];
      // });

      // Handled close launch product subscriber to clear the price || PriyaL || 05Apr2022 || Assigned by PranavD
     

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      if (this.validationArr) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.validationArr.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
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

           
          }
        }
      }
    } catch (error) {
      //console.log('Error:' + error);
    }
  }

async fnGetProdTemplate() {
  try {

    this.templateMappingArr = await this.apifunctions.fnGetProdTemplate('YieldEnhancement');
  
  } catch (error) {
    //console.log('Error:', error);
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
    console.log(e)
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
      this.showUnderlying(e, SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
    }
  } catch (Error) {
    //console.log('Error', Error);
  }
}

backKeyPress(e) {
  try {
    console.log(e)
    // this.flag = false;
    // this.shareCode = '';
    // this.selectedBIndex = 0;
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
    //this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
    this.flag = false;
    this.selectedBIndex = 0;
    this.showSuggestions = false;
    this.ShareName = '';
    // this.ccyChange = item.Ccy;
     //Changes done by Apurva K for FIN1EURINT-174|| 20-Apr-2023 || < 5 changed to <=3
    if (this.ShareBasket.length <= 3) {
      if (this.ShareBasket.find(i => i.Code === item.BloombergCode) === undefined) {
        //Code enehancements done by Apurva K/Sudarshan P|| 25-Apr-2023 || Added CCY
        this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, RICCode: item.Code,CCY: item.Ccy});
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
     this.ddlNoteCcy = item.Ccy;
     this.UnderlyingCurrency = item.Ccy;
   }
   else{
     this.ddlNoteCcy = this.ShareBasket[this.ShareBasket.length -1].CCY;
     this.UnderlyingCurrency = this.ShareBasket[this.ShareBasket.length -1].CCY;
   }

    // this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;


    //console.log(this.ddlNoteCcy, this.UnderlyingCurrency)
    if (this.UnderlyingCurrency !== this.ddlNoteCcy) {
      this.quanto = "Yes";
    } else {
      this.quanto = "No";
    }

    this.txtTenorDateChange('Payment');
    // this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
    // if (this.Dates) {
    //   this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
    // }

    // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
    // if (this.Dates) {
    //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
    // }

    // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
    // if (this.Dates) {
    //   this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
    // }

    this.upsideType = 'None';
    //this.upsideTypeChange()

  } catch (error) {
    //console.log('Error:', error);
  }
}
cpnTypeChange() {
  try {
    this.reset();
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

    // if (this.SolveForvalue !== 'Coupon') {
    //   this.cpnCoupon = '5.00';
    // }

    if (this.SolveForvalue !== 'CouponBarrier' && (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory')) {
      this.cpnTrigger = this.cpnTrigger || '70.00';
      this.cpnCoupon = this.cpnCoupon || '5.00'; //Added by Apurva K|| 09-Aug-2023|| HSBCECCLI-21
    }
    // Added for FIN1EURINT-489 by AdilP 
    if (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory') {
      this.cpnObservation = 'European (Last day of the Month)';
      this.cpnFreq = 'Monthly';
      this.cpnInFine = 'No';
    } else if (this.cpnType === 'Fixed Unconditional') {
      this.cpnTrigger = ''; //Changes done by Jyoti S || Resolved the issue where cpntrigger was not going null in case of Fixed Uncondiotional || 02-Aug-2023
      this.cpnFreq = 'Monthly';
      this.cpnCoupon = this.cpnCoupon || '5.00'; //Added by Apurva K|| 09-Aug-2023|| HSBCECCLI-21
    } else if (this.cpnType === 'Range Accrual') {
      this.cpnFreq = 'Monthly';
      this.rangeAccrualFreq = 'Daily';
      this.cpnInFine = 'No';
    } else if (this.cpnType === 'Floating Unconditional') {
      this.cpnFreq = 'Monthly';
      this.cpnFloor = '0.00';
      this.cpnCap = '';
      this.cpnMultiplier = '100.00';
      this.cpnFixing = 'In Advance';
      this.cpnFltRef = 'EUR001M Index';
    } else if (this.cpnType === 'Floating without Memory') {
      this.cpnFreq = 'Monthly';
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

 //SSSSSS
 private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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
     // this.upsideTypeChange();
    }
    if (this.upsideType !== '' && this.upsideType !== 'None') {
      this.SolveForvalue = 'IBPrice';
    }
  } catch (error) {
    //console.log('Error:', error);
  }

}

reset() {
  try {
    // $(".validate-popup").each(function() {
    //     $(this).remove();
    // });
    // $(".error-input").each(function() {
    //     $(this).remove();
    // });
    // $(document).bind('ajaxStart', () => {
    //   $('#loading').show();
    // });
    // this.loadflag = false;// Yash A.
    // this.priceBtnActive = 'Y';// Yash A.
    // this.timeLeft = -1;
    // this.timeoutMsg = '';
    // this.clearFlag = true;
    // clearInterval(this.interval);

    // this.TSFlag = false;
    // clearInterval(this.TSInterval);

    if (this.ShareBasket.length > 0) {
      document.getElementById('txtShare').classList.remove('underlyingError');
      document.getElementById('txtShare').classList.add('longText');
    }
    // this.PPDetails = '';
    // this.sortedAllPrices = [];
    // this.AllPrices = [];
    // this.orderID = '';
    this.loadflag = false;
    this.ErrorMsg = '';
    this.ErrorMsgTop = '';
    // this.rfqID = '';
    // this.noteMasterID = '';
    this.saveFlag = false;
    // this.quoteEmailFlg = false;
    this.successMsg = '';
    this.reqSuccessMsg = '';
    const els = document.getElementsByClassName('error');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < els.length; i++) {
      els[i].classList.remove('error');
    }
    document.getElementById('txtShare').classList.remove('underlyingError');
    document.getElementById('txtShare').classList.add('longText');
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
    this.commonfunctions.YEPricesObserver.next('');
    this.commonfunctions.YEPrices = [];
    this.commonfunctions.setYEReceivedPrices({}, '');
    // //console.log(this.priceProvidersArr);
    //this.bestLPArray = [];
    //this.priceProvidersArr = [];
    // this.priceProvidersArr.forEach(element => {
    //   // lp: res[i],
    //   // this.priceProvidersArr[index].timeStartFlag = true;
    //   // if(element.timeStartFlag == true){

    //   if (element.interval1) {
    //     // //console.log(element.interval1);
    //     element.interval1 = clearInterval(element.interval1);
    //     element.timeStartFlag = false;
    //   }


    //   // }
    //   element.rfq = '';
    //   element.price = '-';
    //  // element.timer = this.defaultTimeout; //this.startCountDown(this.defaultTimeout, i),
    //   element.id = '';
    //   element.status = '';
    //   element.NoteMasterID = '';
    //   element.TSFlag = false;
    //   element.Msg = '';
    //   element.KIDFlag = false;
    //   element.TSMsg = '';
    //   element.loadFlag = false;// Yash A.
    //   element.TSLoadFlag = false;  //Added by Apurva K|| 09-May-2023
    //   element.KIDLoadFlag = false; //Added by Apurva K|| 09-May-2023
    //   element.ViewKIDFlag = false;  //Added by Kaustubh S|| 18-May-2023
    //   element.TSDisableFlag = false;  //Added by Apurva K|| 22-May-2023
    //   element.KidDisableFlag = false; //Added by Apurva K|| 22-May-2023
    // }
    // );

  } catch (error) {
    //console.log('Error:', error);
  }
  return false;
}
async txtTenorChange(e, type: any) {
  try {
    //this.reset(); //Commented by Varsha G || FIN1EURINT-275 || 05-May-2023 
    //this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
    const target = await this.commonfunctions.GetEventTarget(e);
    const today = new Date();
    let strDate = '';
    const dayCount = 0;
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

      // if (str.toUpperCase() === '0B') {
      // tslint:disable-next-line: max-line-length
      //     strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

      // }
      // else {
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), str.toUpperCase(), '');
      strDate = await this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      // }

      this.stkdate = strDate;

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      this.settdate = await this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');


    }
    if (type === 'Payment') {
      this.paymentshift = target.value;
      // if (str.toUpperCase() === '0B') {
      // tslint:disable-next-line: max-line-length
      //     // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
      //     strDate = this.stkdate;
      // }
      // else {
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.stkdate);
      strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      // }
      this.settdate = strDate;
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
    }
    if (type === 'Expiry') {
      this.expshift = target.value;
      if (this.expshift === 'Custom') {
        return true;
      }// Changed by Jyoti S || 09-May-2023
      if (str.toUpperCase() === '0B') {
        // tslint:disable-next-line: max-line-length
        // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
        strDate = this.settdate;
      } else {
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.settdate);
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
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
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

async checkNotional(e) {
  try {
    if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
      const target = this.commonfunctions.GetEventTarget(e);
      const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));

      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'YieldEnhancement', this.ddlNoteCcy);
      if (floatNotional < this.checkNotionalRes[0].Minimum || floatNotional > this.checkNotionalRes[0].Maximum) {
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
   // this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
    this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'YieldEnhancement', this.ddlNoteCcy);
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

    this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
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
setFocus() {
  this.namefield.nativeElement.focus();
}

async txtTenorDateChange(type: any) {
  try {
    let strDate = '';
    //this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
    this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
    if (type === 'Payment') {
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '0B' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      // }
      //console.log('today', this.todayDate);
      if (this.paymentshift !== 'Custom') {
        this.settdate = strDate;
      }

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
    }
    if (type === 'Expiry') {

      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

      this.expdate = strDate;
    }
    if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
      || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
      this.ErrorMsgTop = 'Please select valid strike date.';
      document.getElementById('txtstkdate').classList.add('error');
      return false;
    }
    if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
      document.getElementById('txtsettdate').classList.add('error');
      this.ErrorMsgTop = 'Please select valid payment date.';
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
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
async changeStkShiftToggle() {
  //this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
  if (this.stkshift === '0B') {
    this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
    if (this.Dates) {
      this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
    }
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
      // if (month < 4) {
      //   this.autoFreq = '1m';
      // } else {
      //   this.autoFreq = '3m';
      // }
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

async GetTriggerValue(type: any) {

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
  if (type === 'autoTrigger') {
    await this.apifunctions.GetTriggerValues(tenorinmonth, this.autoFreq,
      this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
    //console.log(this.TriggerValueArr);
    this.autoTriggerPopup = true;
    this.cpnTriggerPopup = false;
    this.fundRatePopup = false;
  }

  if (type === 'cpnTrigger') {
    await this.apifunctions.GetTriggerValues(tenorinmonth, this.cpnFreq,
      this.cpnTrigger, '', '').then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
    //console.log(this.TriggerValueArr);
    this.autoTriggerPopup = false;
    this.cpnTriggerPopup = true;
    this.fundRatePopup = false;
  }
  if (type === 'fundRate') {
    await this.apifunctions.GetTriggerValues(tenorinmonth, this.fundFreq,
      this.fundRate, '', '').then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
    //console.log(this.TriggerValueArr);
    this.autoTriggerPopup = false;
    this.cpnTriggerPopup = false;
    this.fundRatePopup = true;
  }
}

onClickedOutside(type: any) {
  if (type === 'autoTrigger') {
    this.autoTriggerPopup = false;

  }

  if (type === 'cpnTrigger') {
    this.cpnTriggerPopup = false;

  }
  if (type === 'fundRate') {
    this.fundRatePopup = false;
  }
}

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

}

publicprivateChange() {
  if (this.publicOrPrivate === 'Public Offer') {
    this.listed = 'Y';
  }else{
    this.listed = 'N';//Added by Varsha G || FIN1EURINT-387 || 24-May-2023
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
        this.AutocallFrequency =  await this.parseCommonDatatoJSONArr('AutocallFrequency');
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
        this.CouponType =this.CouponType.filter(option => option.Value !== 'Snowball')
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
        console.log(this.Format,"this is Format")
        break;
      case "IssueDateOffsetRef"://Sudarshan | Asked by vipul | 31-Jan-2024
            this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffsetRef');
          
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
        this.SolveFor = await this.parseCommonDatatoJSONArr('SolveFor');
        break;
      case "StaticFundingType":
        this.StaticFundingType = await this.parseCommonDatatoJSONArr('StaticFundingType');
        break;
      case "StockExchange":
        this.StockExchange = await this.parseCommonDatatoJSONArr('StockExchange');
        break;
      case "SwapFloatingReference":
        this.SwapFloatingReference = await this.parseCommonDatatoJSONArr('SwapFloatingReference');
        this.SwapFloatingReference = this.commonfunctions.alphaNumSorting(this.SwapFloatingReference);
        break;
      case "CouponTypeArr":
        this.CouponTypeArr = await this.parseCommonDatatoJSONArr('CouponTypeArr');
        break;
      case "Tenor":
        this.Tenor = await this.parseCommonDatatoJSONArr('Tenor');
        break;
      case "StrikeArr":
        this.StrikeArr = await this.parseCommonDatatoJSONArr('StrikeArr');
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
      // case "NonBestPriceReason":
      //   this.NonBestPriceReasonArr = await this.parseCommonDatatoJSONArr('NonBestPriceReason');
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
ERCpnTypeChange() {
  if (this.ERCpnType === 'None') {
    this.periodicCouponFlag = 'Yes';
    this.ERCoupon = '';
    this.cpnType = 'Fixed Unconditional';
    this.cpnFreq = 'Monthly';
    this.cpnCoupon = '5.00';
  } else {
    this.periodicCouponFlag = 'No';
    if (this.SolveForvalue === 'Coupon') {
      this.SolveForvalue = 'IBPrice';
    }
    this.cpnType = '';
    this.cpnObservation = '';
    this.cpnTrigger = '';
    this.cpnFreq = '';
    this.cpnCoupon = '';
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
GenerateXML() {
  let xmlstr = '';
  for (const i in this.templateMappingArray) {
    switch (this.templateMappingArray[i]) {

      case 'Currency':
        if (this.CurrencyYN == 'Y') {
          xmlstr += '<Currency>' + this.ddlNoteCcy + '</Currency>';
        }
        break;

      case 'Format':
        if (this.FormatYN == 'Y') {
          xmlstr += '<Format>' + this.format + '</Format>';
        }
        break;

      case 'SolveFor':
        if (this.SolveForYN == 'Y') {
          xmlstr += '<SolveFor>' + this.SolveForvalue + '</SolveFor>';
        }
        break;

      case 'Underlyings':
        if (this.UnderlyingYN == 'Y') {
          this.tempShares =  this.Code().split(",");
          //console.log(this.Code(),"Code console");
          //console.log("abcde", this.tempShares);
          //console.log("Data XML",this.BasketData);
          let temp1 = [].concat(this.BasketData, this.tempShares);
          //console.log(temp1.filter(String),"Merged array");
          //console.log(this.BasketData);
          xmlstr += '<Underlyings>' +  temp1.filter(String) + '</Underlyings>';
          }
        break;

      case 'Notional':
        if (this.notionalYN == 'Y') {
          xmlstr += '<Notional>' + this.Notional + '</Notional>';
        }
        break;

      case 'ReofferPrice':
        if (this.reofferPriceYN == 'Y') {
          xmlstr += '<ReofferPrice>' + this.IBPrice + '</ReofferPrice>';
        }
        break;

      case 'Upfront':
        if (this.upfrontYN == 'Y') {
          xmlstr += '<Upfront>' + this.UpfrontIBPrice + '</Upfront>';
        }
        break;

      case 'IssuePrice':
        if (this.issuePriceYN == 'Y') {
          xmlstr += '<IssuePrice>' + this.issuePrice + '</IssuePrice>';
        }
        break;

      case 'BasketType':
        if (this.basketTypeYN == 'Y') {
          xmlstr += '<BasketType>' + this.basketType + '</BasketType>';
        }
        break;

      case 'PriveOrPublic':
        if (this.publicPrivateYN == 'Y') {
          xmlstr += '<PublicPrivate>' + this.publicOrPrivate + '</PublicPrivate>';
        }
        break;

      case 'Quanto':
        if (this.quantoYN == 'Y') {
          xmlstr += '<Quanto>' + this.quanto + '</Quanto>';
        }
        break;

      case 'Listed':
        if (this.listedYN == 'Y') {
          xmlstr += '<Listed>' + this.listed + '</Listed>';
        }
        break;

      case 'StockExchange':
        if (this.stockExchangeYN == 'Y') {
          xmlstr += '<StockExchange>' + this.stockExchange + '</StockExchange>';
        }
        break;

      case 'Priips':
        if (this.priipsPopupYN == 'Y') {
          xmlstr += '<Priips>' + this.priipsYN + '</Priips>';
        }
        break;

      case 'Language':
        if (this.languageYN == 'Y') {
          xmlstr += '<Language>' + this.language + '</Language>';
        }
        break;

      case 'Country':
        if (this.countryYN == 'Y') {
          xmlstr += '<Country>' + this.country + '</Country>';
        }
        break;

      case 'Termsheet':
        if (this.termsheetYN == 'Y') {
          xmlstr += '<Termsheet>' + this.termsheetType + '</Termsheet>';
        }
        break;

        case 'StrikeDate':
          if (this.ShifterDateYN == 'Y') {
            xmlstr += '<StrikeDate>' +this.stkdate+ '</StrikeDate>';
            xmlstr += '<StrikeShifterDateType>' + this.stkshift + '</StrikeShifterDateType>';
          }
          break;

      case 'IssueDate':
        if (this.issueDateOffsetYN == 'Y') {
          xmlstr += '<IssueDateOffset>' + this.paymentshift + '</IssueDateOffset>';
        }
        break;

      case 'Tenor':
        if (this.TenorYN == 'Y') {
          xmlstr += '<Tenor>' + this.expshift + '</Tenor>';
        }
        break;

      case 'SettlementMethod':
        if (this.settlementMethodYN == 'Y') {
          xmlstr += '<SettlementMethod>' + this.SettlementMethod + '</SettlementMethod>';
        }
        break;

      case 'FundingType':
        if (this.FundTypeYN == 'Y') {
          xmlstr += '<FundType>' + this.fundType + '</FundType>';
        }
        break;

      case 'FundingFrequency':
        if (this.FundFreqYN == 'Y') {
          xmlstr += '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>';
        }
        break;

      case 'FundingRateSpread':
        if (this.RateSpreadYN == 'Y') {
          xmlstr += '<FundRateSpread>' + this.fundRate + '</FundRateSpread>';
        }
        break;

      case 'AutocallType':
        if (this.AutocallTypeYN == 'Y') {
          xmlstr += '<AutocallType>' + this.autocallCouponType + '</AutocallType>';
        }
        break;

      case 'AutocallFrequency':
        if (this.autocallFrequencyYN == 'Y') {
          xmlstr += '<AutocallFrequency>' + this.autoFreq + '</AutocallFrequency>';
        }
        break;

      case 'PutableFrequency':
        if (this.putableFreqYN == 'Y') {
          xmlstr += '<PutableFrequency>' + this.putableFreq + '</PutableFrequency>';
        }
        break;

      case 'CallableFrequency':
        if (this.callableFreqYN == 'Y') {
          xmlstr += '<CallableFrequency>' + this.callableFreq + '</CallableFrequency>';
        }
        break;

      case 'AutocallableFrom':
        if (this.autocallableFromYN == 'Y') {

          if (this.autocallCouponType === 'Constant Barrier' || this.autocallCouponType === 'Variable Barrier') {

            xmlstr += '<AutocallableFrom>' + this.autoNonCall + '</AutocallableFrom>';

          }
          if (this.autocallCouponType === 'Putable by the Investor') {

            xmlstr += '<PutableFrom>' + this.autoNonCall + '</PutableFrom>';

          }
          if (this.autocallCouponType === 'Callable by the Issuer') {

            xmlstr += '<CallableFrom>' + this.autoNonCall + '</CallableFrom>';

          }
        }
        break;

      case 'AutocallBarrier':
        if (this.autocallBarrierYN == 'Y') {
          xmlstr += '<AutocallBarrier>' + this.autoTrigger + '</AutocallBarrier>';
        }
        break;

      case 'StepUpDown':
        if (this.stepdownYN == 'Y') {
          xmlstr += '<StepUpDown>' + this.autoStepDown + '</StepUpDown>';
        }
        break;

      case 'PutableBarrierLevel':
        if (this.putableBarrierLevelYN == 'Y') {
          xmlstr += '<PutableBarrierLevel>' + this.PutableBarrier + '</PutableBarrierLevel>';
        }
        break;

      case 'ProtectionType':
        if (this.protectionTypeYN == 'Y') {
          xmlstr += '<ProtectionType>' + this.barrierType + '</ProtectionType>';
        }
        break;

      case 'PutStrike':
        if (this.putStrikeYN == 'Y') {
          xmlstr += '<PutStrike>' + this.Strike + '</PutStrike>';
        }
        break;

      case 'ProtectionLevell':
        if (this.protectionLvlYN == 'Y') {

          xmlstr += '<ProtectionLvl>' + this.ProtectionLevel + '</ProtectionLvl>';
        }
        break;

      case 'UpperPutStrike':
        if (this.upperPutStrikeYN == 'Y') {

          xmlstr += '<UpperPutStrike>' + this.upperPutStrike + '</UpperPutStrike>';
        }
        break;

      case 'PutGearring':
        if (this.putGearingYN == 'Y') {
          xmlstr += '<PutGearring>' + this.leverage + '</PutGearring>';
        }
        break;

      case 'LowerPutStrike':
        if (this.lowerPutStrikeYN == 'Y') {
          xmlstr += '<LowerPutStrike>' + this.lowerPutStrike + '</LowerPutStrike>';
        }
        break;

      case 'KIBarrier':
        if (this.popupKIBarrierYN == 'Y') {
          xmlstr += '<KIBarrier>' + this.barrierLevel + '</KIBarrier>';
        }
        break;

      case 'PutSpreadGearing':
        if (this.putSpreadGearingYN == 'Y') {
          xmlstr += '<PutSpreadGearing>' + this.putSpreadGearing + '</PutSpreadGearing>';
        }
        break;

      case 'CallStrike':
        if (this.callStrikePercYN == 'Y') {
          xmlstr += '<CallStrike>' + this.callStrike + '</CallStrike>';
        }
        break;

      case 'LowerCallStrike':
        if (this.lowerCallStrikePercYN == 'Y') {
          xmlstr += '<LowerCallStrike>' + this.lowerCallStrike + '</LowerCallStrike>';
        }
        break;

      case 'CallGearring':
        if (this.callGearingYN == 'Y') {
          xmlstr += '<CallGearing>' + this.callGearing + '</CallGearing>';
        }
        break;

      case 'UpperCallStrike':
        if (this.upperCallStrikeYN == 'Y') {
          xmlstr += '<UpperCallStrike>' + this.upperCallStrike + '</UpperCallStrike>';
        }
        break;

      case 'CallSpreadGearing':
        if (this.callSpreadGearingYN == 'Y') {
          xmlstr += '<CallSpreadGearing>' + this.callSpreadGearing + '</CallSpreadGearing>';
        }
        break;

      case 'AutocallCouponType':
        if (this.autoCouponTypeYN == 'Y') {
          xmlstr += '<AutocallCouponType>' + this.ERCpnType + '</AutocallCouponType>';
        }
        break;

      case 'ERCouponPa':
        if (this.ERCouponPaYN == 'Y') {
          xmlstr += '<ERCouponPa>' + this.ERCoupon + '</ERCouponPa>';
        }
        break;

      case 'AddPeriodicCpn':
        if (this.periodicCouponYN == 'Y') {
          xmlstr += '<AddPeriodicCpn>' + this.periodicCouponFlag + '</AddPeriodicCpn>';
        }
        break;

      case 'PeriodicCpnType':
        if (this.periodicCpnTypeYN == 'Y') {
          xmlstr += '<PeriodicCpnType>' + this.cpnType + '</PeriodicCpnType>';
        }
        break;

      case 'CouponBarrierType':
        if (this.cpnBarrierTypeYN == 'Y') {
          xmlstr += '<CouponBarrierType>' + this.cpnObservation + '</CouponBarrierType>';
        }
        break;

      case 'RangeAccuralFreq':
        if (this.rangeAccFreqYN == 'Y') {
          xmlstr += '<RangeAccuralFreq>' + this.rangeAccrualFreq + '</RangeAccuralFreq>';
        }
        break;

      case 'CouponBarrierLevel':
        if (this.cpnBarrierLvlYN == 'Y') {
           {

            xmlstr += '<CpnBarrierLvl>' + this.cpnTrigger + '</CpnBarrierLvl>'

          }
        }
      
        break;

        case 'LowerCouponBarrier':
          if (this.LowerCouponBarrierYN == 'Y') {
            {

             xmlstr += '<LowerCouponBarrier>' + this.lowCpnBarrier + '</LowerCouponBarrier>'

           }
         }
          break;

          case 'UpperCouponBarrier':
            if (this.UpperCouponBarrierYN == 'Y') {
              {
 
               xmlstr += '<UpperCouponBarrier>' + this.upperCpnBarrier + '</UpperCouponBarrier>'
 
             }
           }
            break;

      case 'CouponFrequency':
        if (this.periodicCpnFreqYN == 'Y') {
          xmlstr += '<PeriodicCpnFreq>' + this.cpnFreq + '</PeriodicCpnFreq>';
        }
        break;

      case 'FloatingRefIndex':
        if (this.floatingRefIndexYN == 'Y') {
          xmlstr += '<FloatingRefIndex>' + this.cpnFltRef + '</FloatingRefIndex>';
        }
        break;

      case 'CouponPaPerc':
        if (this.couponPaPercYN == 'Y') {
         
            xmlstr += '<CouponPaPerc>' + this.cpnCoupon + '</CouponPaPerc>'

          }
        
        
        break;

        case'YieldSpreadPa':
        if (this.YieldSpreadPaYN == 'Y') {
          {

            xmlstr += '<YieldSpreadPa>' + this.cpnYieldSpreadPa + '</YieldSpreadPa>'

          }
        }
        break;


      case 'Floor':
        xmlstr += '<Floor>' + this.cpnFloor + '</Floor>';
        break;
        case 'Cap':
        xmlstr += '<Cap>' + this.cpnCap + '</Cap>';
        break;

      case 'Multiplier':
        xmlstr += '<Multiplier>' + this.cpnMultiplier + '</Multiplier>'
        break;

      case 'CouponInFine':
        if (this.cpnInFineYN == 'Y') {
          xmlstr += '<CouponInFine>' + this.cpnInFine + '</CouponInFine>';
        }
        break;
    }
  }
  //console.log("XML generated");
  //console.log(xmlstr);
  return xmlstr

}

fillDefaultValuesData() {
  ////console.log("hi Apurva");
    //console.log("currency", this.CCY);
  for (const i in this.allDefaultValues) {
    switch (this.allDefaultValues[i].Control_Name) {
      case 'Currency':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.ddlNoteCcy = '';
        }
        else{
          this.ddlNoteCcy = this.allDefaultValues[i].Default_Value;
        }
        ////console.log(this.ddlNoteCcy, "defaultcurrencyval");
        this.CurrencyYN = this.allDefaultValues[i].ActiveYN;
        this.CurrDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CurrencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CurrencyUpdatedAt = (new Date(Date.parse(this.CurrencyUpdatedAt + ' UTC'))).toLocaleString();
          this.CurrencyUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CurrencyUpdatedAt}`;
        }else{
          this.CurrencyUpdatedBy = '-';
          this.CurrencyUpdatedAt = '-';
        }// //console.log(this.CurrDropdown, "defauCurrDropdownltcurrencyval");

        break;

      case 'Format':
        // ////console.log(this.format,"defaultformatval");
        this.FormatYN = this.allDefaultValues[i].ActiveYN;
        this.FormatDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.format =  this.FormatDropdown[0];
        }
        else{
          this.format = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
        this.FormatUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.FormatUpdatedAt = (new Date(Date.parse(this.FormatUpdatedAt + ' UTC'))).toLocaleString();
        this.FormatUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.FormatUpdatedAt}`;
        }else{
          this.FormatUpdatedBy = '-';
          this.CurrencyUpdatedAt = '-';
        }
        // ////console.log(this.FormatDropdown,"selectedFormat Val");
        break;

      case 'SolveFor':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.SolveForvalue = '';
        }
        else{
          this.SolveForvalue = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.format,"defaultformatval");
        this.SolveForYN = this.allDefaultValues[i].ActiveYN;
        this.selectedSolveFor = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        const tempSolveforArr = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        ////console.log(tempSolveforArr, "tempArr");
        this.SolveForDropdown = [];
        for (var s = 0; s < tempSolveforArr.length; s++) {
          for (let solveforval of this.solveForArr) {
            if (tempSolveforArr[s] == (solveforval.Value)) {
              ////console.log(tempSolveforArr[s], "tempSolveforArr[s]");
              ////console.log(solveforval.Value, "i['value'] Val");
              this.SolveForDropdown.push(solveforval);
              // this.showSolveForArr.push(solveforval.Value);
            }
          }
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
        this.SolveForUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.SolveForUpdatedAt = (new Date(Date.parse(this.SolveForUpdatedAt + ' UTC'))).toLocaleString();
        this.SolveForUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.SolveForUpdatedAt}`;
        }
        // this.SolveForDropdown = this.bindSolveForVal(this.SolveForDropdown);
        ////console.log(this.SolveForDropdown, "selectedFormat Val");
        break;

      case 'Underlyings':
        this.UnderlyingYN = this.allDefaultValues[i].ActiveYN;
        this.BasketData = this.allDefaultValues[i].Default_Value.split(',');

        if(this.allDefaultValues[i].Updated_By != '' || this.allDefaultValues[i].Updated_At != ''){
          this.UnderlyingsUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.UnderlyingsUpdatedAt = (new Date(Date.parse(this.UnderlyingsUpdatedAt + ' UTC'))).toLocaleString();
          this.UnderlyingsUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.UnderlyingsUpdatedAt}`;
        }
        else{
          this.UnderlyingsUpdatedBy = '-';
          this.UnderlyingsUpdatedAt = '-';
        }
       
        break;

      case 'Notional':
        this.notionalYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.Notional = '';
        }
        else{
          this.Notional = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.NotionalUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.NotionalUpdatedAt = (new Date(Date.parse(this.NotionalUpdatedAt + ' UTC'))).toLocaleString();
          this.NotionalUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.NotionalUpdatedAt}`;
        }
        else{
          this.NotionalUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        

        
        break;

      case 'ReofferPrice':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.IBPrice = '';
        }
        else{
          this.IBPrice = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.ReofferPriceUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.ReofferPriceUpdatedAt = (new Date(Date.parse(this.ReofferPriceUpdatedAt + ' UTC'))).toLocaleString();
          this.ReofferPriceUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.ReofferPriceUpdatedAt}`;
        }else{
          this.ReofferPriceUpdatedBy='-';
        }
       
        // ////console.log(this.Notional,"defaultNotionalval");
        this.reofferPriceYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'Upfront':
        this.upfrontYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.UpfrontIBPrice = '';
        }
        else{
          this.UpfrontIBPrice = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.UpfrontUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.UpfrontUpdatedAt = (new Date(Date.parse(this.UpfrontUpdatedAt + ' UTC'))).toLocaleString();
          this.UpfrontUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.UpfrontUpdatedAt}`;
          
        }else{
          this.UpfrontUpdatedBy = '-';
        }
        
        // ////console.log(this.Notional,"defaultNotionalval");
       
        break;

      case 'IssuePrice':
        this.issuePriceYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.issuePrice = '';
        }
        else{
          this.issuePrice = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          
        this.IssuePriceUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.IssuePriceUpdatedAt = (new Date(Date.parse(this.IssuePriceUpdatedAt + ' UTC'))).toLocaleString();
        this.IssuePriceUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.IssuePriceUpdatedAt}`;
        }else{
          this.IssuePriceUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        ////console.log("ISSUEPRICE1",this.issuePriceYN,this.issuePrice)
        break;

      case 'BasketType':
        this.basketType = this.allDefaultValues[i].Default_Value;
        this.basketTypeYN = this.allDefaultValues[i].ActiveYN;
        this.basketTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');

        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.BasketTypeUpdatedAt = (new Date(Date.parse(this.BasketTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.BasketTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.BasketTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.BasketTypeUpdatedAt}`;
        }else{
          this.BasketTypeUpdatedBy = '-';
        }
        
        
        ////console.log("BASKETTYPE",this.basketTypeDropdown, this.basketTypeYN,this.basketType);
        break;

      case 'PublicPrivate':
       
        this.publicPrivateYN = this.allDefaultValues[i].ActiveYN;
        this.publicPrivateDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        this.publicOrPrivate = this.allDefaultValues[i].Default_Value;
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PublicPrivateUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PublicPrivateUpdatedAt = (new Date(Date.parse(this.PublicPrivateUpdatedAt + ' UTC'))).toLocaleString();
          this.PublicPrivateUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PublicPrivateUpdatedAt}`;
        }else{
          this.PublicPrivateUpdatedBy = '-';
        }
        ////console.log(this.publicPrivateDropdown, "publicPrivateDropdown");
        break;

      case 'Quanto':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.quanto = 'N';
        }
        else{
          this.quanto = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.QuantoUpdatedAt = this.allDefaultValues[i].Updated_At;

          this.QuantoUpdatedAt = (new Date(Date.parse(this.QuantoUpdatedAt + ' UTC'))).toLocaleString();
          this.QuantoUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.QuantoUpdatedAt}`;
        }else{
          this.QuantoUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.quantoYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'Listed':
        this.listed = this.allDefaultValues[i].Default_Value;
        // ////console.log(this.Notional,"defaultNotionalval");
        this.listedYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.ListedUpdatedAt = this.allDefaultValues[i].Updated_At;

        this.ListedUpdatedAt = (new Date(Date.parse(this.ListedUpdatedAt + ' UTC'))).toLocaleString();
        this.ListedUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.ListedUpdatedAt}`;
        }else{
          this.ListedUpdatedBy = '-';
        }
        break;

      case 'StockExchange':
        this.stockExchange = this.allDefaultValues[i].Default_Value;
        // ////console.log(this.Notional,"defaultNotionalval");
        this.stockExchangeYN = this.allDefaultValues[i].ActiveYN;
        this.stockExchangeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.StockExchangeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.StockExchangeUpdatedAt = (new Date(Date.parse(this.StockExchangeUpdatedAt + ' UTC'))).toLocaleString();
          this.StockExchangeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.StockExchangeUpdatedAt}`;
        }else{
          this.StockExchangeUpdatedBy = '-';
        }
        ////console.log(this.stockExchangeDropdown, "stockExchangeDropdown");
        break;

      case 'Priips':
        this.priipsPopupYN = this.allDefaultValues[i].Default_Value;
        // ////console.log(this.Notional,"defaultNotionalval");
        this.priipsPopupYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PriipsUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.PriipsUpdatedAt = (new Date(Date.parse(this.PriipsUpdatedAt + ' UTC'))).toLocaleString();
        this.PriipsUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PriipsUpdatedAt}`;
        }else{
          this.PriipsUpdatedBy = '-';
        }
        break;

      case 'Language':
      //Added by AdilP || to resolve default values display
        this.languageDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          let prevDefaultLang= this.allDefaultValues[i].Default_Value.split(',')
          this.language = [];
          prevDefaultLang.forEach((lang)=>{
            if(this.languageDropdown.includes(lang))
              this.language.push(lang)
          })
        this.languageYN = this.allDefaultValues[i].ActiveYN;
        this.languageDropdown1=[];
        for (let i = 0; i < this.languageDropdown.length; i++) {
          if (this.languageDropdown[i] != '') {
            this.languageDropdown1.push({ 'Key': this.languageDropdown[i], 'Value': this.languageDropdown[i] });
          }
          // //console.log(this.languageDropdown1,"languagekeyvalue");
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.LanguageUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.LanguageUpdatedAt = (new Date(Date.parse(this.LanguageUpdatedAt + ' UTC'))).toLocaleString();
          this.LanguageUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.LanguageUpdatedAt}`;
        }else{
          this.LanguageUpdatedBy = '-';
        }
        break;


      case 'Country':
      //Added by AdilP || to resolve default values display
        this.countryDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          let prevDefaultCountry= this.allDefaultValues[i].Default_Value.split(',')
          this.country = [];
          prevDefaultCountry.forEach((ctry)=>{
            if(this.countryDropdown.includes(ctry))
              this.country.push(ctry)

          })
        this.countryYN = this.allDefaultValues[i].ActiveYN;
        this.countryDropdown1=[];
        for (let i = 0; i < this.countryDropdown.length; i++) {
          if (this.countryDropdown[i] != '') {
            this.countryDropdown1.push({ 'Key': this.countryDropdown[i], 'Value': this.countryDropdown[i] });
          }
          ////console.log(this.countryDropdown1,"countryDropdownkeyvalue");
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CountryUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CountryUpdatedAt = (new Date(Date.parse(this.CountryUpdatedAt + ' UTC'))).toLocaleString();
          this.CountryUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CountryUpdatedAt}`;
        }
        this.CountryUpdatedBy = '-';
       
        break;

      case 'Termsheet':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.termsheetType = '';
        }
        else{
          this.termsheetType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.termsheetYN = this.allDefaultValues[i].ActiveYN;
        this.termsheetDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.TermsheetUpdatedAt = this.allDefaultValues[i].Updated_At;

        this.TermsheetUpdatedAt = (new Date(Date.parse(this.TermsheetUpdatedAt + ' UTC'))).toLocaleString();
        this.TermsheetUpdatedBy =  `${this.allDefaultValues[i].Updated_By} at ${this.TermsheetUpdatedAt}`;
        }else{
          this.TermsheetUpdatedBy = this.allDefaultValues[i].Updated_By;
        }
        ////console.log(this.termsheetDropdown, "termsheetDropdown");
        break;


      case 'StrikeShifterDate':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.stkdate = '';
        }
        else{
          this.stkdate = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.ShifterDateYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.StrikeShifterDateUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.StrikeShifterDateUpdatedAt = (new Date(Date.parse(this.StrikeShifterDateUpdatedAt + ' UTC'))).toLocaleString();
        this.StrikeShifterDateUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.StrikeShifterDateUpdatedAt}`;
        }else{
          this.StrikeShifterDateUpdatedBy = '-';
        }
        break;

        case 'StrikeShifterDateType':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.stkshift = '';
          }
          else{
            this.stkshift = this.allDefaultValues[i].Default_Value;
          }
          this.ShifterDateYN = this.allDefaultValues[i].ActiveYN;
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.StrikeShifterDateTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.StrikeShifterDateTypeUpdatedAt = (new Date(Date.parse(this.StrikeShifterDateTypeUpdatedAt + ' UTC'))).toLocaleString();
            this.StrikeShifterDateTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.StrikeShifterDateTypeUpdatedAt}`;
          }else{
            this.StrikeShifterDateTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          }
          break;

      case 'IssueDateOffset':
       ////console.log("im in")
       if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
        this.paymentshift = '';
      }
      else{
        this.paymentshift = this.allDefaultValues[i].Default_Value;
      }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.issueDateOffsetYN = this.allDefaultValues[i].ActiveYN;
        ////console.log( this.issueDateOffsetYN, "issueDateDropdownYN");
        this.issueDateDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.IssueDateOffsetUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.IssueDateOffsetUpdatedAt = (new Date(Date.parse(this.IssueDateOffsetUpdatedAt + ' UTC'))).toLocaleString();
        this.IssueDateOffsetUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.IssueDateOffsetUpdatedAt}`;
        }else{
          this.IssueDateOffsetUpdatedBy = '-';
        }
        ////console.log(this.issueDateDropdown, "issueDateDropdown");
        break;


      case 'Tenor':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.expshift = '';
        }
        else{
          this.expshift = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.TenorYN = this.allDefaultValues[i].ActiveYN;
        this.TenorDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.TenorUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.TenorUpdatedAt = (new Date(Date.parse(this.TenorUpdatedAt + ' UTC'))).toLocaleString();
          this.TenorUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.TenorUpdatedAt}`;
        }else{
          this.TenorUpdatedBy = '-';
        }
        ////console.log(this.TenorDropdown, "TenorDropdown");
        break;


      case 'SettlementMethod':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.SettlementMethod = '';
        }
        else{
          this.SettlementMethod = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.settlementMethodYN = this.allDefaultValues[i].ActiveYN;
        this.settlementMethodDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.SettlementMethodUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.SettlementMethodUpdatedAt = (new Date(Date.parse(this.SettlementMethodUpdatedAt + ' UTC'))).toLocaleString();
        this.SettlementMethodUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.SettlementMethodUpdatedAt}`;
        }else{
          this.SettlementMethodUpdatedBy = '-';
        }
        
        
        ////console.log(this.settlementMethodDropdown, "settlementMethodYNDropdown");
        break;


      case 'FundType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.fundType = '';
        }
        else{
          this.fundType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.FundTypeYN = this.allDefaultValues[i].ActiveYN;
        this.FundTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.FundTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.FundTypeUpdatedAt = (new Date(Date.parse(this.FundTypeUpdatedAt + ' UTC'))).toLocaleString();
        this.FundTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.FundTypeUpdatedAt}`;
        }else{
          this.FundTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
        }
        ////console.log(this.FundTypeDropdown, "FundTypeDropdown");
        break;

      case 'FundingFrequency':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.fundFreq = '';
        }
        else{
          this.fundFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.FundFreqYN = this.allDefaultValues[i].ActiveYN;
        this.fundFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.FundingFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.FundingFrequencyUpdatedAt = (new Date(Date.parse(this.FundingFrequencyUpdatedAt + ' UTC'))).toLocaleString();
          this.FundingFrequencyUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.FundingFrequencyUpdatedAt}`;
        }else{
          this.FundingFrequencyUpdatedBy = '-';
        }
        ////console.log('fundFreqDropdown',this.fundFreqDropdown, this.FundFreqYN,);
        break;

      case 'FundRateSpread':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.fundRate = '';
        }
        else{
          this.fundRate = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.FundingRateSpreadUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.FundingRateSpreadUpdatedAt =(new Date(Date.parse(this.FundingRateSpreadUpdatedAt + ' UTC'))).toLocaleString();
          this.FundingRateSpreadUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.FundingRateSpreadUpdatedAt}`;
        }else{
          this.FundingRateSpreadUpdatedBy = this.allDefaultValues[i].Updated_By;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.RateSpreadYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'AutocallType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.autocallCouponType = '';
        }
        else{
          this.autocallCouponType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.AutocallTypeYN = this.allDefaultValues[i].ActiveYN;
        this.autocallCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.AutocallTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.AutocallTypeUpdatedAt = (new Date(Date.parse(this.AutocallTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.AutocallTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AutocallTypeUpdatedAt}`;
        }else{
          this.AutocallTypeUpdatedBy = '-';
        }
        ////console.log(this.autocallCpnDropdown, "autocallCpnDropdown");
        break;

      case 'AutocallFrequency':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.autoFreq = '';
        }
        else{
          this.autoFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.autocallFrequencyYN = this.allDefaultValues[i].ActiveYN;
        this.autoFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.AutocallFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.AutocallFrequencyUpdatedAt = (new Date(Date.parse(this.AutocallFrequencyUpdatedAt + ' UTC'))).toLocaleString();
        this.AutocallFrequencyUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AutocallFrequencyUpdatedAt}`;
        }else{
          this.AutocallFrequencyUpdatedBy = '-';
        }
        ////console.log(this.autoFreqDropdown, "autoFreqDropdown");
        break;

      case 'PutableFrequency':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.putableFreq = '';
        }
        else{
          this.putableFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.putableFreqYN = this.allDefaultValues[i].ActiveYN;
        this.putableFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PutableFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PutableFrequencyUpdatedAt = (new Date(Date.parse(this.PutableFrequencyUpdatedAt + ' UTC'))).toLocaleString();
          this.PutableFrequencyUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PutableFrequencyUpdatedAt}`;
        }else{
          this.PutableFrequencyUpdatedBy = '-';
        }
        ////console.log(this.putableFreqDropdown, "putableFreqDropdown");
        break;

      case 'CallableFrequency':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.callableFreq = '';
        }
        else{
          this.callableFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.callableFreqYN = this.allDefaultValues[i].ActiveYN;
        this.callableFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CallableFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CallableFrequencyUpdatedAt = (new Date(Date.parse(this.CallableFrequencyUpdatedAt + ' UTC'))).toLocaleString();
          this.CallableFrequencyUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CallableFrequencyUpdatedAt}`;
        }else{
          this.CallableFrequencyUpdatedBy = '-';
        }
        
       
        ////console.log(this.callableFreqDropdown, "callableFreqDropdown");
        break;

        case 'AutocallableFrom':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.autoNonCall = '';
          }
          else{
            this.autoNonCall = this.allDefaultValues[i].Default_Value;
          }
          // ////console.log(this.Notional,"defaultNotionalval");
          this.autocallableFromYN = this.allDefaultValues[i].ActiveYN;
          this.autocallableFromDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.AutocallableFromUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.AutocallableFromUpdatedAt = (new Date(Date.parse(this.AutocallableFromUpdatedAt + ' UTC'))).toLocaleString();
          this.AutocallableFromUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AutocallableFromUpdatedAt}`;
          }else{
            this.AutocallableFromUpdatedBy = '-';
          }
          ////console.log(this.autocallableFromDropdown, "autocallableFromDropdown");
          break;
        
      case 'AutocallBarrier':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.autoTrigger = '';
        }
        else{
          this.autoTrigger = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.AutocallBarrierUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.AutocallBarrierUpdatedAt = (new Date(Date.parse(this.AutocallBarrierUpdatedAt + ' UTC'))).toLocaleString();
          this.AutocallBarrierUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AutocallBarrierUpdatedAt}`;
        }else{
          this.AutocallBarrierUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.autocallBarrierYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'StepUpDown':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.autoStepDown = '';
        }
        else{
          this.autoStepDown = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.StepUpDownUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.StepUpDownUpdatedAt =(new Date(Date.parse(this.StepUpDownUpdatedAt + ' UTC'))).toLocaleString();
        this.StepUpDownUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.StepUpDownUpdatedAt}`;
        }else{
          this.StepUpDownUpdatedBy = '-';
        }
        
        
        // ////console.log(this.Notional,"defaultNotionalval");
        this.stepdownYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'PutableBarrierLevel':
        this.putableBarrierLevelYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.PutableBarrier = '';
        }
        else{
          this.PutableBarrier = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PutableBarrierLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.PutableBarrierLevelUpdatedAt = (new Date(Date.parse(this.PutableBarrierLevelUpdatedAt + ' UTC'))).toLocaleString();
        this.PutableBarrierLevelUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PutableBarrierLevelUpdatedAt}`;
        }else{
          this.PutableBarrierLevelUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'ProtectionType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.barrierType = '';
        }
        else{
          this.barrierType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.protectionTypeYN = this.allDefaultValues[i].ActiveYN;
        this.barrierTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.ProtectionTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.ProtectionTypeUpdatedAt =(new Date(Date.parse(this.ProtectionTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.ProtectionTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.ProtectionTypeUpdatedAt}`;
        }else{
          this.ProtectionTypeUpdatedBy = '-';
        }
        ////console.log(this.barrierTypeDropdown, "barrierTypeDropdown");
        break;

      // This is for PutStrik conditions |start
      case 'PutStrike':
        this.putStrikeYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.Strike = '';
        }
        else{
          this.Strike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PutStrikeUpdatedAt =(new Date(Date.parse(this.PutStrikeUpdatedAt + ' UTC'))).toLocaleString();
          this.PutStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PutStrikeUpdatedAt}`;
        }else{
          this.PutStrikeUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'ProtectionLvl':
        this.protectionLvlYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.ProtectionLevel = '';
        }
        else{
          this.ProtectionLevel = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.ProtectionLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.ProtectionLevelUpdatedAt = (new Date(Date.parse(this.ProtectionLevelUpdatedAt + ' UTC'))).toLocaleString();
          this.ProtectionLevelUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.ProtectionLevelUpdatedAt}`;
        }else{
          this.ProtectionLevelUpdatedBy = '-';
        }
        ////console.log("PROTECTIONLEVEL", this.protectionLvlYN,this.ProtectionLevel);
        break;
      // This is for PutStrik conditions |end

      case 'UpperPutStrike':
        this.upperPutStrikeYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.upperPutStrike = '';
        }
        else{
          this.upperPutStrike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.UpperPutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.UpperPutStrikeUpdatedAt = (new Date(Date.parse(this.UpperPutStrikeUpdatedAt + ' UTC'))).toLocaleString();
        this.UpperPutStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.UpperPutStrikeUpdatedAt}`;
        // ////console.log(this.Notional,"defaultNotionalval");
        }else{
          this.UpperPutStrikeUpdatedBy = '-';
        }
        break;

      case 'PutGearring':
        this.putGearingYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.leverage = '';
        }
        else{
          this.leverage = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PutGearringUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.PutGearringUpdatedAt = (new Date(Date.parse(this.PutGearringUpdatedAt + ' UTC'))).toLocaleString();
        this.PutGearringUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PutGearringUpdatedAt}`;
        }else{
          this.PutGearringUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;


      case 'LowerPutStrike':
        this.lowerPutStrikeYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.lowerPutStrike = '';
        }
        else{
          this.lowerPutStrike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.LowerPutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.LowerPutStrikeUpdatedAt = (new Date(Date.parse(this.LowerPutStrikeUpdatedAt + ' UTC'))).toLocaleString();
        this.LowerPutStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.LowerPutStrikeUpdatedAt}`;
        }else{
          this.LowerPutStrikeUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;


      case 'KIBarrier':
        this.popupKIBarrierYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.barrierLevel = '';
        }
        else{
          this.barrierLevel = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.BarrierLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.BarrierLevelUpdatedAt =(new Date(Date.parse(this.BarrierLevelUpdatedAt + ' UTC'))).toLocaleString();
          this.BarrierLevelUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.BarrierLevelUpdatedAt}`;
        }else{
          this.BarrierLevelUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;


      case 'PutSpreadGearing':
        this.putSpreadGearingYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.putSpreadGearing = '';
        }
        else{
          this.putSpreadGearing = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PutSpreadGearingUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PutSpreadGearingUpdatedAt = (new Date(Date.parse(this.PutSpreadGearingUpdatedAt + ' UTC'))).toLocaleString();
          this.PutSpreadGearingUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PutSpreadGearingUpdatedAt}`;
        }else{
          this.PutSpreadGearingUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'CallStrike':
        this.callStrikePercYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.callStrike = '';
        }
        else{
          this.callStrike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CallStrikeUpdatedAt = (new Date(Date.parse(this.CallStrikeUpdatedAt + ' UTC'))).toLocaleString();
          this.CallStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CallStrikeUpdatedAt}`;
        }else{
          this.CallStrikeUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'LowerCallStrike':
        this.lowerCallStrikePercYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.lowerCallStrike = '';
        }
        else{
          this.lowerCallStrike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.LowerCallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.LowerCallStrikeUpdatedAt = (new Date(Date.parse(this.LowerCallStrikeUpdatedAt + ' UTC'))).toLocaleString();
          this.LowerCallStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.LowerCallStrikeUpdatedAt}`;
        }else{
          this.LowerCallStrikeUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        
        break;

      case 'CallGearing':
        this.callGearingYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.callGearing = '';
        }
        else{
          this.callGearing = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CallGearringUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CallGearringUpdatedAt = (new Date(Date.parse(this.CallGearringUpdatedAt + ' UTC'))).toLocaleString();
          this.CallGearringUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.LowerCallStrikeUpdatedAt}`;
        }else{
          this.CallGearringUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'UpperCallStrike':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.upperCallStrike = '';
        }
        else{
          this.upperCallStrike = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.UpperCallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
        this.UpperCallStrikeUpdatedAt = (new Date(Date.parse(this.UpperCallStrikeUpdatedAt + ' UTC'))).toLocaleString();
        this.UpperCallStrikeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.UpperCallStrikeUpdatedAt}`;
        }else{
          this.UpperCallStrikeUpdatedBy = '-';
        }
        
        
        // ////console.log(this.Notional,"defaultNotionalval");
        this.upperCallStrikeYN = this.allDefaultValues[i].ActiveYN;
        break;

      case 'CallSpreadGearing':
        this.callSpreadGearingYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.callSpreadGearing = '';
        }
        else{
          this.callSpreadGearing = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CallSpreadGearingUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CallSpreadGearingUpdatedAt = (new Date(Date.parse(this.CallSpreadGearingUpdatedAt + ' UTC'))).toLocaleString();
          this.CallSpreadGearingUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CallSpreadGearingUpdatedAt}`;
        }else{
          this.CallSpreadGearingUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        
        break;

      case 'AutocallCouponType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.ERCpnType = '';
        }
        else{
          this.ERCpnType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.autoCouponTypeYN = this.allDefaultValues[i].ActiveYN;
        this.autoCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.AutocallCouponTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.AutocallCouponTypeUpdatedAt = (new Date(Date.parse(this.AutocallCouponTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.AutocallCouponTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AutocallCouponTypeUpdatedAt}`;
        }else{
          this.AutocallCouponTypeUpdatedBy = '-';
        }
        break;

      case 'ERCouponPa':
        this.ERCouponPaYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.ERCoupon = '';
        }
        else{
          this.ERCoupon = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.ERCouponPaUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.ERCouponPaUpdatedAt = (new Date(Date.parse(this.ERCouponPaUpdatedAt + ' UTC'))).toLocaleString();
          this.ERCouponPaUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.ERCouponPaUpdatedAt}`;
        }else{
          this.ERCouponPaUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

      case 'AddPeriodicCpn':
        this.periodicCouponFlag = this.allDefaultValues[i].Default_Value;
        // ////console.log(this.Notional,"defaultNotionalval");
        this.periodicCouponYN = this.allDefaultValues[i].ActiveYN;
        this.periodicCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.AddPeriodicCpnUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.AddPeriodicCpnUpdatedAt = (new Date(Date.parse(this.AddPeriodicCpnUpdatedAt + ' UTC'))).toLocaleString();
          this.AddPeriodicCpnUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.AddPeriodicCpnUpdatedAt}`;
        }else{
          this.AddPeriodicCpnUpdatedBy = '-';
        }
        break;

      case 'PeriodicCpnType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnType = '';
        }
        else{
          this.cpnType = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.periodicCpnTypeYN = this.allDefaultValues[i].ActiveYN;
        this.periodicCpnTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PeriodicCpnTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PeriodicCpnTypeUpdatedAt = (new Date(Date.parse(this.PeriodicCpnTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.PeriodicCpnTypeUpdatedBy =`${this.allDefaultValues[i].Updated_By} at ${this.PeriodicCpnTypeUpdatedAt}`;
        }else{
          this.PeriodicCpnTypeUpdatedBy = '-';
        }
        ////console.log(this.periodicCpnTypeDropdown, "periodicCpnTypeDropdown");
        break;


      case 'CpnBarrierType':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnObservation = '';
        }
        else{
          this.cpnObservation = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.cpnBarrierTypeYN = this.allDefaultValues[i].ActiveYN;
        this.cpnBarrierTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CouponBarrierTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CouponBarrierTypeUpdatedAt = (new Date(Date.parse(this.CouponBarrierTypeUpdatedAt + ' UTC'))).toLocaleString();
          this.CouponBarrierTypeUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CouponBarrierTypeUpdatedAt}`;
        }else{
          this.CouponBarrierTypeUpdatedBy = '-';
        }
        ////console.log("Cpn Barrier CSV selected",this.cpnBarrierTypeDropdown,this.cpnBarrierTypeYN );
        break;

      case 'RangeAccuralFreq':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.rangeAccrualFreq = '';
        }
        else{
          this.rangeAccrualFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.rangeAccFreqYN = this.allDefaultValues[i].ActiveYN;
        this.rangeAccFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.RangeAccuralFreqUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.RangeAccuralFreqUpdatedAt = (new Date(Date.parse(this.RangeAccuralFreqUpdatedAt + ' UTC'))).toLocaleString();
          this.RangeAccuralFreqUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.RangeAccuralFreqUpdatedAt}`;
        }else{
          this.RangeAccuralFreqUpdatedBy = '-';
        }
        ////console.log("RA CSV selected 1",this.rangeAccFreqDropdown,this.rangeAccFreqYN,this.rangeAccrualFreq)
        break;

      case 'PeriodicCpnFreq':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnFreq = '';
        }
        else{
          this.cpnFreq = this.allDefaultValues[i].Default_Value;
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.periodicCpnFreqYN = this.allDefaultValues[i].ActiveYN;
        this.cpnFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.PeriodicCpnFreqUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.PeriodicCpnFreqUpdatedAt = (new Date(Date.parse(this.PeriodicCpnFreqUpdatedAt + ' UTC'))).toLocaleString();
          this.PeriodicCpnFreqUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PeriodicCpnFreqUpdatedAt}`;
        }else{
          this.PeriodicCpnFreqUpdatedBy = '-';
        }
        ////console.log( "cpnFreqDropdown",this.cpnFreqDropdown, this.cpnFreq);
        break;

        case 'FloatingRefIndex':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnFltRef = '';
          }
          else{
            this.cpnFltRef = this.allDefaultValues[i].Default_Value;
          }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.floatingRefIndexYN = this.allDefaultValues[i].ActiveYN;
        this.floatingFreIndexDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.FloatingRefIndexUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.FloatingRefIndexUpdatedAt =(new Date(Date.parse(this.FloatingRefIndexUpdatedAt + ' UTC'))).toLocaleString();
          this.FloatingRefIndexUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.PeriodicCpnFreqUpdatedAt}`;
        }else{
          this.FloatingRefIndexUpdatedBy = '-';
        }
        ////console.log( "cpnFreqDropdown",this.cpnFreqDropdown, this.cpnFreq);
        break;
        

      case 'CpnBarrierLvl':
        this.cpnBarrierLvlYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnTrigger = '';
        }
        else{
          this.cpnTrigger = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CouponBarrierLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CouponBarrierLevelUpdatedAt = (new Date(Date.parse(this.CouponBarrierLevelUpdatedAt + ' UTC'))).toLocaleString();
          this.CouponBarrierLevelUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CouponBarrierLevelUpdatedAt}`;
        }else{
          this.CouponBarrierLevelUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        break;

        case 'LowerCouponBarrier':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.lowCpnBarrier = '';
          }
          else{
            this.lowCpnBarrier = this.allDefaultValues[i].Default_Value;
          }
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.LowerCouponBarrierUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.LowerCouponBarrierUpdatedAt =(new Date(Date.parse(this.LowerCouponBarrierUpdatedAt + ' UTC'))).toLocaleString();
            this.LowerCouponBarrierUpdatedBy =  `${this.allDefaultValues[i].Updated_By} at ${this.LowerCouponBarrierUpdatedAt}`;
          }else{
            this.LowerCouponBarrierUpdatedBy = '-';
          }
          // ////console.log(this.Notional,"defaultNotionalval");
          this.LowerCouponBarrierYN = this.allDefaultValues[i].ActiveYN;
        break;

          case 'UpperCouponBarrier':
            this.UpperCouponBarrierYN = this.allDefaultValues[i].ActiveYN;
            if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
              this.upperCpnBarrier = '';
            }
            else{
              this.upperCpnBarrier = this.allDefaultValues[i].Default_Value;
            }
            if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
              this.UpperCouponBarrierUpdatedAt = (new Date(Date.parse(this.UpperCouponBarrierUpdatedAt + ' UTC'))).toLocaleString();
              this.UpperCouponBarrierUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.UpperCouponBarrierUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.UpperCouponBarrierUpdatedAt}`;
            }else{
              this.UpperCouponBarrierUpdatedBy = '-';
            }
            // ////console.log(this.Notional,"defaultNotionalval");
              // //console.log("UPPER", this.upperCpnBarrier, this.UpperCouponBarrierYN);

          break;

      case 'CouponPaPerc':
        this.couponPaPercYN = this.allDefaultValues[i].ActiveYN;
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnCoupon = '';
        }
        else{
          this.cpnCoupon = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CouponPaPercUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CouponPaPercUpdatedAt =(new Date(Date.parse(this.CouponPaPercUpdatedAt + ' UTC'))).toLocaleString();
          this.CouponPaPercUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CouponPaPercUpdatedAt}`;
        }else{
          this.CouponPaPercUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        ////console.log("CpnPaPerc1", this.cpnCoupon,this.couponPaPercYN)
        break;

        case 'YieldSpreadPa':
          this.YieldSpreadPaYN = this.allDefaultValues[i].ActiveYN;
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnYieldSpreadPa = '';
          }
          else{
            this.cpnYieldSpreadPa = this.allDefaultValues[i].Default_Value;
          }
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.YieldSpreadPaUpdatedAt = (new Date(Date.parse(this.YieldSpreadPaUpdatedAt + ' UTC'))).toLocaleString();
            this.YieldSpreadPaUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.YieldSpreadPaUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.YieldSpreadPaUpdatedAt}`;
          }else{
            this.YieldSpreadPaUpdatedBy = '-';
          }
          // ////console.log(this.Notional,"defaultNotionalval");
        // ////console.log(this.Notional,"defaultNotionalval");
        ////console.log("CpnPaPerc1", this.cpnCoupon,this.couponPaPercYN)
        break;

      case 'CouponInFine':
        if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
          this.cpnInFine = '';
        }
        else{
          this.cpnInFine = this.allDefaultValues[i].Default_Value;
        }
        if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
          this.CouponInFineUpdatedAt = (new Date(Date.parse(this.CouponInFineUpdatedAt + ' UTC'))).toLocaleString();
          this.CouponInFineUpdatedAt = this.allDefaultValues[i].Updated_At;
          this.CouponInFineUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CouponInFineUpdatedAt}`;
        }else{
          this.CouponInFineUpdatedBy = '-';
        }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.cpnInFineYN = this.allDefaultValues[i].ActiveYN;
        break;

        case 'Multiplier':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnMultiplier = '';
          }
          else{
            this.cpnMultiplier = this.allDefaultValues[i].Default_Value;
          }
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.MultiplierUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.MultiplierUpdatedAt = (new Date(Date.parse(this.MultiplierUpdatedAt + ' UTC'))).toLocaleString();
            this.MultiplierUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.MultiplierUpdatedAt}`;
          }else{
            this.FloorUpdatedBy = '-';
          }
        // ////console.log(this.Notional,"defaultNotionalval");
        this.MultiplierYN = this.allDefaultValues[i].ActiveYN;
     
        break;
        case 'Floor':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnFloor = '';
          }
          else{
            this.cpnFloor = this.allDefaultValues[i].Default_Value;
          }
          if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
            this.FloorUpdatedAt = this.allDefaultValues[i].Updated_At;
            this.FloorUpdatedAt =(new Date(Date.parse(this.FloorUpdatedAt + ' UTC'))).toLocaleString();
            this.FloorUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.FloorUpdatedAt}`;
          }else{
            this.FloorUpdatedBy = '-';
          }
          // ////console.log(this.Notional,"defaultNotionalval");
          this.FloorYN = this.allDefaultValues[i].ActiveYN;
         
       
          break;
          case 'Cap':
            if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
              this.cpnCap = '';
            }
            else{
              this.cpnCap = this.allDefaultValues[i].Default_Value;
            }
            if(this.allDefaultValues[i].Updated_At !='' || this.allDefaultValues[i].Updated_By  != ''){
              this.CapUpdatedAt = this.allDefaultValues[i].Updated_At;
              this.CapUpdatedAt = (new Date(Date.parse(this.CapUpdatedAt + ' UTC'))).toLocaleString();
              this.CapUpdatedBy = `${this.allDefaultValues[i].Updated_By} at ${this.CapUpdatedAt}`;
            }else{
              this.CapUpdatedBy = '-';
            }
            // ////console.log(this.Notional,"defaultNotionalval");
            this.CapYN = this.allDefaultValues[i].ActiveYN;
            break;
    }
  }
  this.pageloadflag=false; //changed by AdilP FIN1EURINT-506 || 05-07-2023 
}

async setEntityDefaultValues() {
  const xmlAutocallable = this.GenerateXML();
  this.userID = (this.commonfunctions.getLoggedInUserName())[0].UserId;
  this.settingsType = "USER";

  if (this.minMaxFlag === true) {
    this.showMessageXML = "Error in data saving check min max value";

    setTimeout(() => {
      this.showMessageFlagXML = false;
      this.showMessageXML = "";
    }, 5000);
  } else {
    const resFromApi:any = await this.apifunctions.SetEntityDefaultValues(this.applicationID, this.settingsType, xmlAutocallable);
    
      if (resFromApi?.Status.toLowerCase() === 'success') {
        this.showMessageFlagXML = true;
        this.showMessageXML = "Data Saved Successfully";
        setTimeout(() => {
          this.showMessageFlagXML = false;
        }, 3000);
      }
  }
}

openPopup(id: any) {
  this.id = id;
  this.showPopup = true;
  this.selectedCurrency = this.CurrDropdown;
  this.selectedFormat = this.FormatDropdown;
  // for(let data of this.SolveForDropdown){
  //   this.selectedSolveFor.push(this.SolveForDropdown[data].Key);
  //  }
 //  this.selectedSolveFor = this.SolveForDropdown;
  // this.selectedSolveFor = this.showSolveForArr;
  this.selectedBasketType = this.basketTypeDropdown;
  this.selectedOption = this.publicPrivateDropdown;
  this.selectedStockExchange = this.stockExchangeDropdown;
  this.selectedLanguage = this.languageDropdown;
  this.selectedCountry = this.countryDropdown;
  this.selectedTermsheet = this.termsheetDropdown;
  this.selectedIssueDateOffset = this.issueDateDropdown;
  this.selectedTenor = this.TenorDropdown;
  this.selectedSettlementMethod = this.settlementMethodDropdown;
  this.selectedFundType = this.FundTypeDropdown;
  this.selectedFundFreq = this.fundFreqDropdown;
  this.SelectedautocallType = this.autocallCpnDropdown;
  this.selectedAutocallFrequency = this.autoFreqDropdown;
  this.selectedPutableFreq = this.putableFreqDropdown;
  this.selectedCallableFreq = this.callableFreqDropdown;
  this.SelectedProtectionType = this.barrierTypeDropdown;
  this.selectedPeriodicCpnType = this.periodicCpnTypeDropdown;
  this.selectedCpnBarrierType = this.cpnBarrierTypeDropdown;
  this.selectedRangeAccFreq = this.rangeAccFreqDropdown;
  this.selectedPeriodicCpnFreq = this.cpnFreqDropdown;
  this.SelectedAutocallableFrom = this.autocallableFromDropdown ;
  //this.selectedCpnBarrierType=this.cpnBarrierTypeDropdown
 

}

closePopup() {
  this.showPopup = false;
  this.showMessageFlag = false; //Added by Apurva C/Apurva K for Min max validation in popup || 29-April-2022 || EULGTINT-181
  this.showMessage="" //Added by Apurva C/Apurva K for Min max validation in popup || 29-April-2022 || EULGTINT-181
 
}

async popUpSelectedValues(selectedValue: any) {

  switch (selectedValue) {

    case 'Currency':
      this.id = 'Currency';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.CurrencyYN,
        this.selectedCSV = this.selectedCurrency.toString()
      break;

    case 'Format':
      this.id = 'Format';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.FormatYN,
        this.selectedCSV = this.selectedFormat.toString()
      break;

    case 'SolveFor':
      this.id = 'SolveFor';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.SolveForYN,
        this.selectedCSV = this.selectedSolveFor.toString()
      break;

    case 'Underlyings':
      this.id = 'Underlyings';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.UnderlyingYN,
        this.selectedCSV = ''
      break;

    case 'Notional':
      this.id = 'Notional';
      this.minValue = this.minNotional,
        this.maxValue = this.maxNotional,
        this.activeYN = this.notionalYN,
        this.selectedCSV = ''
      break;

    case 'IssuePrice':
      this.id = 'IssuePrice';
      if(this.minIssuePrice===undefined ){
        this.minIssuePrice = ""
      }else{

      }
      if(this.maxIssuePrice===undefined ){
        this.maxIssuePrice = ""
      }
      this.minValue = this.minIssuePrice,
        this.maxValue = this.maxIssuePrice,
        this.activeYN = this.issuePriceYN,
        this.selectedCSV = ''
        ////console.log("ISSUEPRICE",this.activeYN,this.minValue,this.maxValue)
      break;

      case 'ReofferPrice':
        this.id = 'ReofferPrice';
        this.minValue = this.minReofferPrice,
          this.maxValue = this.maxReofferPrice,
          this.activeYN = this.reofferPriceYN,
          this.selectedCSV = ''
        break;

    case 'Upfront':
      this.id = 'Upfront';
      this.minValue = this.minReofferPrice,
        this.maxValue = this.maxReofferPrice,
        this.activeYN = this.reofferPriceYN,
        this.selectedCSV = ''
      break;

    case 'BasketType':
      this.id = 'BasketType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.basketTypeYN,
        this.selectedCSV = this.selectedBasketType.toString()
        //////console.log("BASKETTYPE",this.activeYN, this.selectedCSV);
      break;

    case 'PublicPrivate':
      this.id = 'PublicPrivate';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.publicPrivateYN,
        this.selectedCSV = this.selectedOption.toString()
      break;

    case 'Quanto':
      this.id = 'Quanto';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.quantoYN,
        this.selectedCSV = ''
      break;

    case 'Listed':
      this.id = 'Listed';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.listedYN,
        this.selectedCSV = ''
      break;

    case 'StockExchange':
      this.id = 'StockExchange';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.stockExchangeYN,
        this.selectedCSV = this.selectedStockExchange.toString()
      break;

    case 'Priips':
      this.id = 'Priips';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.priipsPopupYN,
        this.selectedCSV = ''
      break;

    case 'Language':
      this.id = 'Language';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.languageYN,
        this.selectedCSV = this.selectedLanguage.toString()
      break;

    case 'Country':
      this.id = 'Country';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.countryYN,
        this.selectedCSV = this.selectedCountry.toString()
      break;

    case 'Termsheet':
      this.id = 'Termsheet';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.termsheetYN,
        this.selectedCSV = this.selectedTermsheet.toString()
      break;

    case 'StrikeShifterDate':
      this.id = 'StrikeShifterDate';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.ShifterDateYN,
        this.selectedCSV = ''
      break;

    case 'IssueDateOffset':
      this.id = 'IssueDateOffset';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.issueDateOffsetYN,
        this.selectedCSV = this.selectedIssueDateOffset.toString()
        //////console.log("selected issue date offset",this.selectedCSV)
      break;

    case 'Tenor':
      this.id = 'Tenor';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.TenorYN,
        this.selectedCSV = this.selectedTenor.toString()
      break;

    case 'SettlementMethod':
      this.id = 'SettlementMethod';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.settlementMethodYN,
        this.selectedCSV = this.selectedSettlementMethod.toString()
      break;

    case 'FundType':
      this.id = 'FundType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.FundTypeYN,
        this.selectedCSV = this.selectedFundType.toString()
      break;

    case 'FundFreq':
      this.id = 'FundingFrequency';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.FundFreqYN,
        this.selectedCSV = this.selectedFundFreq.toString()
        //////console.log("FundFreq selected",this.activeYN,this.selectedCSV)
      break;

    case 'FundRateSpread':
      this.id = 'FundRateSpread';
      this.minValue = this.minRateSpread,
        this.maxValue = this.maxRateSpread,
        this.activeYN = this.RateSpreadYN,
        this.selectedCSV = ''
      break;

    case 'Type':
      this.id = 'Type';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.AutocallTypeYN,
        this.selectedCSV = this.SelectedautocallType.toString()
      break;

    case 'AutocallFrequency':
      this.id = 'AutocallFrequency';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.autocallFrequencyYN,
        this.selectedCSV = this.selectedAutocallFrequency.toString()
      break;

    case 'AutocallableFrom':
      this.id = 'AutocallableFrom';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.autocallableFromYN,
        this.selectedCSV = this.SelectedAutocallableFrom.toString()
      break;

    case 'AutocallBarrier':
      this.id = 'AutocallBarrier';
      this.minValue = this.minAutocallBarrier,
        this.maxValue = this.maxAutocallBarrier,
        this.activeYN = this.autocallBarrierYN,
        this.selectedCSV = ''
      break;

    case 'Stepdown':
      this.id = 'Stepdown';
      this.minValue = this.StepdownMin,
        this.maxValue = this.StepdownMax,
        this.activeYN = this.stepdownYN,
        this.selectedCSV = ''
      break;

    case 'PutableBarrierLevel':
      this.id = 'PutableBarrierLevel';
      this.minValue = this.minPutableBarrierLevel,
        this.maxValue = this.maxPutableBarrierLevel,
        this.activeYN = this.putableBarrierLevelYN,
        this.selectedCSV = ''
      break;

    case 'ProtectionType':
      this.id = 'ProtectionType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.protectionTypeYN,
        this.selectedCSV = this.SelectedProtectionType.toString()
      break;

    case 'PayoffFrequency':
      this.id = 'PayoffFrequency';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.payoffFrequencyYN,
        this.selectedCSV = this.SelectedPayoffFrequency.toString()
      break;

    case 'PutStrike':
      this.id = 'PutStrike';
      this.minValue = this.minPutStrike,
        this.maxValue = this.maxPutStrike,
        this.activeYN = this.putStrikeYN,
        this.selectedCSV = ''
      break;

    case 'ProtectionLvl':
      this.id = 'ProtectionLvl';
      this.minValue = this.minProtectionLvl,
        this.maxValue = this.maxProtectionLvl,
        this.activeYN = this.protectionLvlYN,
        this.selectedCSV = ''
      break;

    case 'UpperPutStrike':
      this.id = 'UpperPutStrike';
      this.minValue = this.minUpperPutStrike,
        this.maxValue = this.maxUpperPutStrike,
        this.activeYN = this.upperPutStrikeYN,
        this.selectedCSV = ''
        
      break;

    case 'PutGearing':
      this.id = 'PutGearring';
      this.minValue = this.minPutGearing,
        this.maxValue = this.maxPutGearing,
        this.activeYN = this.putGearingYN,
        this.selectedCSV = ''
      break;

    case 'LowerPutStrike':
      this.id = 'LowerPutStrike';
      this.minValue = this.minLowerPutStrike,
        this.maxValue = this.maxLowerPutStrike,
        this.activeYN = this.lowerPutStrikeYN,
        this.selectedCSV = ''
      break;

    case 'KIBarrier':
      this.id = 'KIBarrier';
      this.minValue = this.minPopupKIBarrier,
        this.maxValue = this.maxPopupKIBarrier,
        this.activeYN = this.popupKIBarrierYN,
        this.selectedCSV = ''
      break;

    case 'PutSpreadGearing':
      this.id = 'PutSpreadGearing';
      this.minValue = this.minPutSpreadGearing,
        this.maxValue = this.maxPutSpreadGearing,
        this.activeYN = this.putSpreadGearingYN,
        this.selectedCSV = ''
      break;

    case 'CallStrikePerc':
      this.id = 'CallStrikePerc';
      this.minValue = this.minCallStrikePerc,
        this.maxValue = this.maxCallStrikePerc,
        this.activeYN = this.callStrikePercYN,
        this.selectedCSV = ''
      break;

    case 'LowerCallStrikePerc':
      this.id = 'LowerCallStrikePerc';
      this.minValue = this.minLowerCallStrikePerc,
        this.maxValue = this.maxLowerCallStrikePerc,
        this.activeYN = this.lowerCallStrikePercYN,
        this.selectedCSV = ''
      break;

    case 'CallGearing':
      this.id = 'CallGearing';
      this.minValue = this.minCallGearing,
        this.maxValue = this.maxCallGearing,
        this.activeYN = this.callGearingYN,
        this.selectedCSV = ''
      break;

    case 'UpperCallStrike':
      this.id = 'UpperCallStrike';
      this.minValue = this.minUpperCallStrike,
        this.maxValue = this.maxUpperCallStrike,
        this.activeYN = this.upperCallStrikeYN,
        this.selectedCSV = ''
      break;

    case 'CallSpreadGearing':
      this.id = 'CallSpreadGearing';
      this.minValue = this.minCallSpreadGearing,
        this.maxValue = this.maxCallSpreadGearing,
        this.activeYN = this.callSpreadGearingYN,
        this.selectedCSV = ''
      break;

    case 'AutoCouponType':
      this.id = 'AutoCouponType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.autoCouponTypeYN,
        this.selectedCSV = this.selectedAutoCouponType
      break;

    case 'ERCouponPa':
      this.id = 'ERCouponPa';
      this.minValue = this.minERCouponPa,
        this.maxValue = this.maxERCouponPa,
        this.activeYN = this.ERCouponPaYN,
        this.selectedCSV = ''
      break;

    case 'AddPeriodicCoupon':
      this.id = 'AddPeriodicCoupon';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.periodicCouponYN,
        this.selectedCSV = this.selectedPeriodicCoupon.toString()
      break;

    case 'PeriodicCpnType':
      this.id = 'PeriodicCpnType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.periodicCpnTypeYN,
        this.selectedCSV = this.selectedPeriodicCpnType.toString()
      break;

    case 'CpnBarrierType':
      this.id = 'CpnBarrierType';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.cpnBarrierTypeYN,
        this.selectedCSV = this.selectedCpnBarrierType.toString()
        ////console.log("Cpn Barrier CSV selected",this.selectedCSV)
      break;

    case 'RangeAccuralFreq':
      this.id = 'RangeAccuralFreq';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.rangeAccFreqYN,
        this.selectedCSV = this.selectedRangeAccFreq.toString()
        ////console.log("RA CSV selected",this.selectedCSV,this.activeYN)
      break;

    case 'CpnBarrierLvl':
      this.id = 'CpnBarrierLvl';
      this.minValue = this.minCpnBarrierLvl,
        this.maxValue = this.maxCpnBarrierLvl,
        this.activeYN = this.cpnBarrierLvlYN,
        this.selectedCSV = ''
      break;

      case 'LowerCouponBarrier':
        this.id = 'LowerCouponBarrier';
        if(this.minLowerCouponBarrier===undefined){
          this.minLowerCouponBarrier=""
        }
        if(this.maxLowerCouponBarrier===undefined){
          this.maxLowerCouponBarrier=""
        }
        this.minValue = this.minLowerCouponBarrier,
          this.maxValue = this.maxLowerCouponBarrier,
          this.activeYN = this.LowerCouponBarrierYN,
          this.selectedCSV = ''
        break;
        case 'UpperCouponBarrier':
          this.id = 'UpperCouponBarrier';
          if(this.minUpperCouponBarrier===undefined){
            this.minUpperCouponBarrier=""
          }
          if(this.maxUpperCouponBarrier===undefined){
            this.maxUpperCouponBarrier=""
          }
          this.minValue = this.minUpperCouponBarrier,
            this.maxValue = this.maxUpperCouponBarrier,
            this.activeYN = this.UpperCouponBarrierYN,
            this.selectedCSV = ''
          break;

    case 'PeriodicCpnFreq':
      this.id = 'PeriodicCpnFreq';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.periodicCpnFreqYN,
        this.selectedCSV = this.selectedPeriodicCpnFreq.toString()
      break;

    case 'FloatingRefIndex':
      this.id = 'FloatingRefIndex';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.floatingRefIndexYN,
        this.selectedCSV = this.selectedFloatingRefIndex.toString()
      break;

    case 'CouponPaPerc':
      this.id = 'CouponPaPerc';
      this.minValue = this.minCouponPaPerc,
        this.maxValue = this.maxCouponPaPerc,
        this.activeYN = this.couponPaPercYN,
        this.selectedCSV = ''
        ////console.log("CpnPaPerc",this.activeYN)
      break;

      case 'YieldSpreadPa':
        this.id = 'YieldSpreadPa';
        if(this.minYieldSpreadPa===undefined){
          this.minYieldSpreadPa=""
        }
        if(this.maxYieldSpreadPa===undefined){
          this.maxYieldSpreadPa=""
        }
        this.minValue = this.minYieldSpreadPa,
          this.maxValue = this.maxYieldSpreadPa,
          this.activeYN = this.YieldSpreadPaYN,
          this.selectedCSV = ''
          ////console.log("CpnPaPerc",this.activeYN)
        break;

    case 'CpnInFine':
      this.id = 'CpnInFine';
      this.minValue = '',
        this.maxValue = '',
        this.activeYN = this.cpnInFineYN,
        this.selectedCSV = ''
      break;

    case 'Multiplier':
      this.id = 'Multiplier';
      if(this.minMultiplier===undefined){
        this.minMultiplier=""
      }
      if(this.maxMultiplier===undefined){
        this.maxMultiplier=""
      }
      this.minValue = this.minMultiplier,
        this.maxValue = this.maxMultiplier,
        this.activeYN = this.MultiplierYN,
        this.selectedCSV = ''
      break;
    case 'Floor':
      this.id = 'Floor';
      if(this.minFloor===undefined){
        this.minFloor=""
      }
      if(this.maxFloor===undefined){
        this.maxFloor=""
      }
      this.minValue = this.minFloor,
        this.maxValue = this.maxFloor,
        this.activeYN = this.FloorYN,
        this.selectedCSV = ''
      break;
      case 'Cap':
        this.id = 'Cap';
        if(this.minCap===undefined){
          this.minCap=""
        }
        if(this.maxCap===undefined){
          this.maxCap=""
        }
        this.minValue = this.minCap,
          this.maxValue = this.maxCap,
          this.activeYN = this.CapYN,
          this.selectedCSV = ''
        break;

  }

  if(parseFloat( this.minValue)>parseFloat(this.maxValue)){
    

    setTimeout(() => {
      this.showMessageFlag = false;
    this.showMessage = "Min value is greater than Max value" 

    }, 2000);
   
  }
else{
const resFromApi:any =await  this.apifunctions.UpdateEntity(this.applicationID, this.id, this.minValue, this.maxValue, this.activeYN, this.selectedCSV);
//console.log("resultfromapi", resFromApi)
if (resFromApi["Status"]?.toUpperCase() === "SUCCESS") {
  this.showMessageFlag = true;
  this.showMessage = "Data Saved Successfully";

 
  setTimeout(() => {
    this.showMessageFlag = false;
    this.showMessage = "";
this.closePopup();
this.ngOnInit();
   
  }, 1000);
} else {
  this.showMessage = "Error in data saving";
}
}

//  this.closePopup();
//  this.ngOnInit();
}

MinMaxValidationCheck(e, id) {
  const target = this.commonfunctions.GetEventTarget(e);
  switch (id) {
    case 'Notional':
      let formatedNotional = parseFloat(this.Notional).toFixed(2)
      this.Notional=this.commonfunctions.checkValidNotional(e).Notional
     
       
      //console.log("A",parseInt(this.minNotional),this.minNotional,this.maxNotional,formatedNotional,this.Notional,parseFloat(this.minNotional.replace(/,/g, '')),parseFloat(this.maxNotional.replace(/,/g, '')))
      if ((parseFloat(this.Notional.replace(/,/g, '')) >parseFloat(this.maxNotional.replace(/,/g, '')) || (parseFloat(this.Notional.replace(/,/g, '')) <parseFloat(this.minNotional.replace(/,/g, ''))))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Notional should be between:" +parseFloat(this.minNotional.replace(/,/g, '')) + "-" + parseFloat(this.maxNotional.replace(/,/g, ''))
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'Reoffer':
      let formatedReoffer = parseFloat(this.IBPrice).toFixed(2)


      if ((parseInt(formatedReoffer) > parseInt(this.maxReofferPrice)) || (parseInt(formatedReoffer) < parseInt(this.minReofferPrice))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Reoffer should be between:" + parseInt(this.minReofferPrice) + "-" + parseInt(this.maxReofferPrice)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'Upfront':
      let formatedUpfront = parseFloat(this.UpfrontIBPrice).toFixed(2)


      if ((parseInt(formatedUpfront) > parseInt(this.maxUpfront)) || (parseInt(formatedUpfront) < parseInt(this.minUpfront))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Upfront should be between:" + parseInt(this.minUpfront) + "-" + parseInt(this.maxUpfront)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'IssuePrice':
      let formatedIssuePrice = parseFloat(this.issuePrice).toFixed(2)


      if ((parseInt(formatedIssuePrice) > parseInt(this.maxIssuePrice)) || (parseInt(formatedIssuePrice) < parseInt(this.minIssuePrice))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Issue price should be between:" + parseInt(this.minIssuePrice) + "-" + parseInt(this.maxIssuePrice)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'FundRateSpread':
      let formatedFundRateSpread = parseFloat(this.fundRate).toFixed(2)


      if ((parseInt(formatedFundRateSpread) > parseInt(this.maxRateSpread)) || (parseInt(formatedFundRateSpread) < parseInt(this.minRateSpread))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Rate/Spread should be between:" + parseInt(this.minRateSpread) + "-" + parseInt(this.maxRateSpread)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'AutocallBarrier':
      let formatedAutocallBarrier = parseFloat(this.autoTrigger).toFixed(2)

      //console.log(formatedAutocallBarrier,this.autoTrigger,this.minAutocallBarrier,this.maxAutocallBarrier)
      if ((parseInt(this.autoTrigger) > parseInt(this.maxAutocallBarrier)) || (parseInt(this.autoTrigger) < parseInt(this.minAutocallBarrier))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Autocall Barrier should be between:" + parseInt(this.minAutocallBarrier) + "-" + parseInt(this.maxAutocallBarrier)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'PutStrike':
      let formatedPutStrike = parseFloat(this.Strike).toFixed(2)


      if ((parseInt(formatedPutStrike) > parseInt(this.maxPutStrike)) || (parseInt(formatedPutStrike) < parseInt(this.minPutStrike))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Put Strike should be between:" + parseInt(this.minPutStrike) + "-" + parseInt(this.maxPutStrike)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'ProtectionLevel':
      let formatedProtectionLevel = parseFloat(this.ProtectionLevel).toFixed(2)


      if ((parseInt(formatedProtectionLevel) > parseInt(this.maxProtectionLvl)) || (parseInt(formatedProtectionLevel) < parseInt(this.minProtectionLvl))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Protection Level should be between:" + parseInt(this.minProtectionLvl) + "-" + parseInt(this.maxProtectionLvl)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'UpperPutStrike':
      let formatedUpperPutStrike = parseFloat(this.upperPutStrike).toFixed(2)


      if ((parseInt(formatedUpperPutStrike) > parseInt(this.maxUpperPutStrike)) || (parseInt(formatedUpperPutStrike) < parseInt(this.minUpperPutStrike))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Upper Put Strike should be between:" + parseInt(this.minUpperPutStrike) + "-" + parseInt(this.maxUpperPutStrike)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'PutGearing':
      let formatedPutGearing = parseFloat(this.leverage).toFixed(2)


      if ((parseInt(formatedPutGearing) > parseInt(this.maxPutGearing)) || (parseInt(formatedPutGearing) < parseInt(this.minPutGearing))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Put Gearing should be between:" + parseInt(this.minPutGearing) + "-" + parseInt(this.maxPutGearing)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'LowerPutStrike':
      let formatedLowerPutStrike = parseFloat(this.lowerPutStrike).toFixed(2)


      if ((parseInt(formatedLowerPutStrike) > parseInt(this.maxLowerPutStrike)) || (parseInt(formatedLowerPutStrike) < parseInt(this.minLowerPutStrike))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Lower Put Strike should be between:" + parseInt(this.minLowerPutStrike) + "-" + parseInt(this.maxLowerPutStrike)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'KIBarrier':
      let formatedKIBarrier = parseFloat(this.barrierLevel).toFixed(2)


      if ((parseInt(formatedKIBarrier) > parseInt(this.maxPopupKIBarrier)) || (parseInt(formatedKIBarrier) < parseInt(this.minPopupKIBarrier))) {
        this.minMaxFlag = true
        this.minMaxMsg = "KI Barrier should be between:" + parseInt(this.minPopupKIBarrier) + "-" + parseInt(this.maxPopupKIBarrier)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'PutSpreadGearing':
      let formatedPutSpreadGearing = parseFloat(this.putSpreadGearing).toFixed(2)


      if ((parseInt(formatedPutSpreadGearing) > parseInt(this.maxPutSpreadGearing)) || (parseInt(formatedPutSpreadGearing) < parseInt(this.minPutSpreadGearing))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Put Spread Gearing should be between:" + parseInt(this.minPutSpreadGearing) + "-" + parseInt(this.maxPutSpreadGearing)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'CallStrike':
      let formatedCallStrike = parseFloat(this.callStrike).toFixed(2)


      if ((parseInt(formatedCallStrike) > parseInt(this.maxCallStrikePerc)) || (parseInt(formatedCallStrike) < parseInt(this.minCallStrikePerc))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Call Strike should be between:" + parseInt(this.minCallStrikePerc) + "-" + parseInt(this.maxCallStrikePerc)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'LowerCallStrike':
      let formatedLowerCallStrike = parseFloat(this.lowerCallStrike).toFixed(2)


      if ((parseInt(formatedLowerCallStrike) > parseInt(this.maxLowerCallStrikePerc)) || (parseInt(formatedLowerCallStrike) < parseInt(this.minLowerCallStrikePerc))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Lower Call Strike should be between:" + parseInt(this.minLowerCallStrikePerc) + "-" + parseInt(this.maxLowerCallStrikePerc)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'CallGearing':
      let formatedCallGearing = parseFloat(this.callGearing).toFixed(2)


      if ((parseInt(formatedCallGearing) > parseInt(this.maxCallGearing)) || (parseInt(formatedCallGearing) < parseInt(this.minCallGearing))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Call Gearing should be between:" + parseInt(this.minCallGearing) + "-" + parseInt(this.maxCallGearing)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'UpperCallStrike':
      let formatedUpperCallStrike = parseFloat(this.upperCallStrike).toFixed(2)


      if ((parseInt(formatedUpperCallStrike) > parseInt(this.maxUpperCallStrike)) || (parseInt(formatedUpperCallStrike) < parseInt(this.minUpperCallStrike))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Upper Call Strike should be between:" + parseInt(this.minUpperCallStrike) + "-" + parseInt(this.maxUpperCallStrike)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'CallSpreadGearing':
      let formatedCallSpreadGearing = parseFloat(this.callSpreadGearing).toFixed(2)


      if ((parseInt(formatedCallSpreadGearing) > parseInt(this.maxCallSpreadGearing)) || (parseInt(formatedCallSpreadGearing) < parseInt(this.minCallSpreadGearing))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Call Spread Gearing should be between:" + parseInt(this.minCallSpreadGearing) + "-" + parseInt(this.maxCallSpreadGearing)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'ERCoupon':
      let formatedERCoupon = parseFloat(this.ERCoupon).toFixed(2)


      if ((parseInt(formatedERCoupon) > parseInt(this.maxERCouponPa)) || (parseInt(formatedERCoupon) < parseInt(this.minERCouponPa))) {
        this.minMaxFlag = true
        this.minMaxMsg = "ER Coupon p.a. should be between:" + parseInt(this.minERCouponPa) + "-" + parseInt(this.maxERCouponPa)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'CouponBarrierLevel':
      if ((parseInt(this.cpnTrigger) > parseInt(this.maxCpnBarrierLvl)) || (parseInt(this.cpnTrigger) < parseInt(this.minCpnBarrierLvl))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Coupon Barrier Level should be between:" + parseInt(this.minCpnBarrierLvl) + "-" + parseInt(this.maxCpnBarrierLvl)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

    case 'CouponPA':
      let formatedCouponPA = parseFloat(this.cpnCoupon).toFixed(2)


      if ((parseInt(formatedCouponPA) > parseInt(this.maxCouponPaPerc)) || (parseInt(formatedCouponPA) < parseInt(this.minCouponPaPerc))) {
        this.minMaxFlag = true
        this.minMaxMsg = "Coupon p.a. should be between:" + parseInt(this.minCouponPaPerc) + "-" + parseInt(this.maxCouponPaPerc)
      } else {
        this.minMaxFlag = false
        this.minMaxMsg = ""
      }

      break;

      case 'Floor':
        let formatedFloor = parseFloat(this.cpnFloor).toFixed(2)


        if ((parseInt(formatedFloor) > parseInt(this.maxFloor)) || (parseInt(formatedFloor) < parseInt(this.minFloor))) {
          this.minMaxFlag = true
          this.minMaxMsg = "Floor should be between:" + parseInt(this.minFloor) + "-" + parseInt(this.maxFloor)
        } else {
          this.minMaxFlag = false
          this.minMaxMsg = ""
        }

        break;

        case 'Cap':
          let formatedCap = parseFloat(this.cpnCap).toFixed(2)
  
  
          if ((parseInt(formatedCap) > parseInt(this.maxCap)) || (parseInt(formatedCap) < parseInt(this.minCap))) {
            this.minMaxFlag = true
            this.minMaxMsg = "Cap should be between:" + parseInt(this.minCap) + "-" + parseInt(this.maxCap)
          } else {
            this.minMaxFlag = false
            this.minMaxMsg = ""
          }
  
          break;

          case 'Multiplier':
            let formatedMultiplier = parseFloat(this.cpnMultiplier).toFixed(2)
    
    
            if ((parseInt(formatedMultiplier) > parseInt(this.maxMultiplier)) || (parseInt(formatedMultiplier) < parseInt(this.minMultiplier))) {
              this.minMaxFlag = true
              this.minMaxMsg = "Multiplier should be between:" + parseInt(this.minMultiplier) + "-" + parseInt(this.maxMultiplier)
            } else {
              this.minMaxFlag = false
              this.minMaxMsg = ""
            }
    
            break;

            case 'YieldSpreadPa':
              let formatedYieldSpreadPa = parseFloat(this.cpnYieldSpreadPa).toFixed(2)
      
      
              if ((parseInt(formatedYieldSpreadPa) > parseInt(this.maxYieldSpreadPa)) || (parseInt(formatedYieldSpreadPa) < parseInt(this.minYieldSpreadPa))) {
                this.minMaxFlag = true
                this.minMaxMsg = "Yield Spread p.a should be between:" + parseInt(this.minYieldSpreadPa) + "-" + parseInt(this.maxYieldSpreadPa)
              } else {
                this.minMaxFlag = false
                this.minMaxMsg = ""
              }
      
              break;

              case 'LowerCouponBarrier':
                let formatedLowerCouponBarrier = parseFloat(this.lowCpnBarrier).toFixed(2)
        
        
                if ((parseInt(formatedLowerCouponBarrier) > parseInt(this.maxLowerCouponBarrier)) || (parseInt(formatedLowerCouponBarrier) < parseInt(this.minLowerCouponBarrier))) {
                  this.minMaxFlag = true
                  this.minMaxMsg = "Lower Trigger should be between:" + parseInt(this.minLowerCouponBarrier) + "-" + parseInt(this.maxLowerCouponBarrier)
                } else {
                  this.minMaxFlag = false
                  this.minMaxMsg = ""
                }
        
                break;

                case 'UpperCouponBarrier':
                  let formatedUpperCouponBarrier = parseFloat(this.upperCpnBarrier).toFixed(2)
          
          
                  if ((parseInt(formatedUpperCouponBarrier) > parseInt(this.maxUpperCouponBarrier)) || (parseInt(formatedUpperCouponBarrier) < parseInt(this.minUpperCouponBarrier))) {
                    this.minMaxFlag = true
                    this.minMaxMsg = "Upper Trigger should be between:" + parseInt(this.minUpperCouponBarrier) + "-" + parseInt(this.maxUpperCouponBarrier)
                  } else {
                    this.minMaxFlag = false
                    this.minMaxMsg = ""
                  }
          
                  break;


  }
  if (this.minMaxFlag === true) {
    //console.log("MIN MAX ERROR")


    this.showMessageFlagXML = true
    this.showMessageXML = this.minMaxMsg
    // target.classList.add('error');
    // target.focus();

  } else {
    //console.log("WORKING FINE")

    this.showMessageFlagXML = false
    this.showMessageXML = this.minMaxMsg
    // this.showMessageXML=""
    // document.getElementById('txtStrike').classList.remove('error');

  }

  

}
enabledisablefields(fieldName) {
  let enabledisableflag = false;
  for (let i = 0; i < this.allDefaultValues?.length; i++) {
    if (this.allDefaultValues[i].Control_Name === fieldName) {
      if (this.allDefaultValues[i].ActiveYN === 'Y') {
        enabledisableflag = false;
      } else {
        enabledisableflag = true;
      }
      return enabledisableflag;
    }
  }
  return enabledisableflag;
}
}
