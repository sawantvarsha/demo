import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { EcHomeService } from '../../../services/ec-home.service';
import { DatePipe } from '@angular/common';
import { EcCommonService } from '../../../services/ec-common.service';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
//import { SearchUnderlyingPipe } from '../../../pipes/search-underlying.pipe';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services/config.service';
import { CustomDropdownMultiSelectComponent } from '../../../components/ec-pricers/CommonComponents/custom-dropdown-multi-select/custom-dropdown-multi-select.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-default-autocallable',
  templateUrl: './default-autocallable.component.html',
  styleUrls: ['./default-autocallable.component.scss']
})
export class DefaultAutocallableComponent implements OnInit {

  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  pageActive: Boolean = true;
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
 
  templateMappingArray: any;
  allocatedNotionalArr: any = [0.00];

  CurrencyYN: any = 'Y';
  selectedCurrency: any;
  FormatYN: any = 'Y';
  selectedFormat: any;
  SolveForYN: any = 'Y';
  selectedSolveFor: any;
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



  DefaultValueXmlRes: any;
  id: any;
  showPopup: boolean = false;
  userID: any;
  applicationID: string;
  settingsType: string;
  SucessMsg: any;
  SetDefaultValRes: any;
  showMessageFlag: boolean = false;
  showMessage:string  = '';
  selectedCSV: any;
  activeYN: any;
  maxValue: string;
  minValue: string;
  allDefaultValues: any = [];

  


  countrySel = new UntypedFormControl();
  languageSel = new UntypedFormControl();
  @ViewChild('focusable', { static: false }) namefield: ElementRef;

  selectedBIndex = 0;
  showSuggestions = false;

  flag: boolean;
  public shares: any = [];
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
  Product = 'Autocallable';
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
  stkshift: any = '0B';
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

  basketType = '';
  publicOrPrivate = '';
  listed = 'Y';
  stockExchange = '';

  quanto = 'Y';
  priipsYN = 'Yes';
  country = "";
  language = "";

  termsheetType = '';
  customTenor = '';


  PutableBarrier = '';
  cpnInFine = 'Yes';
  cpnFixing = '';
  cpnFltRef = ' ';
  cpnFloor = '';
  cpnCap = '';
  cpnMultiplier = '';
  rangeAccrualFreq = '';
  lowCpnBarrier = '';
  upperCpnBarrier = '';

  callableFreq = '';
  putableFreq = '';

  upperPutStrike = '';
  lowerPutStrike = '';
  putSpreadGearing = '';
  upsideType = '';
  callStrike = '';
  callGearing = '';
  lowerCallStrike = '';
  upperCallStrike = '';
  callSpreadGearing = '';
  leverage = '';
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
  SettlementMethod = '';

  autoNonCallArr: any = [];

  LanguageArr1: any = [{ 'Key': 'Czech', 'Value': 'Czech' },
 // { 'Key': 'Czechia', 'Value': 'Czechia' },
  { 'Key': 'Dutch', 'Value': 'Dutch' },
  { 'Key': 'English', 'Value': 'English' },
  { 'Key': 'Finnish', 'Value': 'Finnish' },
  { 'Key': 'French', 'Value': 'French' },
  { 'Key': 'Galician', 'Value': 'Galician' },
  { 'Key': 'German', 'Value': 'German' },
  //{ 'Key': 'Greece', 'Value': 'Greece' },
  { 'Key': 'Greek', 'Value': 'Greek' },
  //{ 'Key': 'Guernsey', 'Value': 'Guernsey' },
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

  //Added by Apurva K|| 07-Jul-2023
  AutoCouponTypeArr:any = [
    { 'Key': 'None', 'Value': 'None' },
    { 'Key': 'Flat', 'Value': 'Flat' },
    { 'Key': 'Snowball', 'Value': 'Snowball' }
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
  ]

  PeriodicCpnFreqArr:any=[
    { 'Key': 'Daily', 'Value': 'Daily' },
    { 'Key': 'Monthly', 'Value': 'Monthly' },
    { 'Key': 'Quarterly', 'Value': 'Quarterly' },
    { 'Key': 'Semiannually', 'Value': 'Semiannually' },
    { 'Key': 'Yearly', 'Value': 'Yearly' }
  ];

  // selectedPeriodicCouponArr=[
  //   {'Key': 'Yes', 'Value': 'Yes' },
  //   {'Key': 'No', 'Value': 'No' }
  // ]
  LanguageArr = [];
  ProtectionFlag: boolean = false;  //Added by ApurvaK for frequency dropdown
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
  showMessageFlagXML: boolean = false;
  showMessageXML: string = '';
  showSolveForArr: any;
  languageDropdown1: any = [];
  countryDropdown1: any=[];
  BasketData: any = [];
  tempShares: any = [];
  ErrorMsg1: string;
  errorMsgBookOrder: string;
  minMaxFlag: boolean = false;
  minMaxMsg: string = '';
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  RMList:any = [];
  customerList:any = [];
  BookingCenter:any = [];
  minNotionalConfirm = false;
  portfolio = '';
  portfolioIdArr: any = [];
  portfolioName = '';
  UserRolesArr:any = [];
  isDealer = true; // Dealer flag - added by PriyaL on 08Dec2021 
  DealerValue
  autoNonCallYN: any;
  users: any;
 //Added by Apurva K|| 27-Mar-2024||FIN1EURINT-708
 ordertype:any;
 OrderTypeDropdown:any = [];
 OrderTypeYN: any = 'Y';
 OrderTypeArr:any = [];
 OrderTypeUpdatedAt:any;
 OrderTypeUpdatedBy:any;
  customSetDate: number = 1;

  constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, public datepipe: DatePipe, private route: ActivatedRoute,
    private renderer: Renderer2) {
      try {

        this.applicationID = "EQC_Europe";
        this.flag = false;
        this.shares = [];
        // this.ddlNoteCcy = 'EUR';
        this.UnderlyingCurrency = 'EUR';
        this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
        // this.format = 'Note';
        this.templateMappingArray =
          ['Currency', 'Format', 'SolveFor', 'Underlying', 'Notional', 'ReofferPrice', 'Upfront', 'IssuePrice', 'BasketType', 'PublicPrivate',
            'Quanto', 'Listed', 'StockExchange', 'Priips', 'Language', 'Country', 'Termsheet', 'StrikeShifterDate', 'IssueDateOffset', 'Tenor', 'SettlementMethod',
            'FundType', 'FundingFrequency', 'FundingRateSpread', 'AutocallType', 'AutocallFrequency', 'PutableFrequency', 'CallableFrequency',
            'AutocallableFrom', 'AutocallBarrier', 'StepUpDown', 'PutableBarrierLevel', 'ProtectionType', 'PutStrike', 'PutGearring',
            'BarrierLevel', 'CallStrike', 'CallGearring', 'CallSpreadGearing', 'AutocallCouponType', 'ERCouponPa', 'AddPeriodicCpn', 'PutSpreadGearing',
            'PeriodicCpnType', 'CouponBarrierType', 'CouponBarrierLevel', 'ProtectionLevel', 'UpperPutStrike', 'LowerPutStrike', 'RangeAccuralFreq',
            'PeriodicCpnFreq', 'FloatingRefIndex', 'CouponPaPerc', 'FloorCap', 'Multiplier', 'CouponInFine', 'LowerCallStrike', 'UpperCallStrike'];
  
  
  
      } catch (error) {
        //console.log('Error', error);
      }
     }

     ngOnDestroy(): void {
      this.pageActive = false;
    }

    ngOnInit() {
      this.pageActive = true;
      this.minNotionalConfirm = false;
      try {
        this.pageloadflag=true;
        $('#loading').show();
       // this.viewOnly = this.viewOnlyFlag ?? this.viewOnly; // Added by Jyoti S || 30-Jun-2023 || FIN1EURINT-511
        setTimeout(async () => {
          // this.RMList = this.apifunctions.Get_RMList();
          //this.docSupportStatus = await this.apifunctions.GetDocumentSupportStatus('EQC_Europe');//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
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
          if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
            //Commented by Apurva K|| 07-Jul-2023|| As discussed with Nitish K for removing extra call to GetAllShareDetails
         this.shares = await this.apifunctions.BBVALoadShares('EQ,IDX', "", "EQC_Europe");
          }
  
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
  
          this.allDefaultValues = await this.apifunctions.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'EQC_Europe');
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
          // this.LeverageFlag = false;
          // this.LeverageYN = 'Yes';//Chnaged by Jyoti S || 29-Jun-2023
  
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
          // this.altLevel = '';
          // this.altObservation = '';
          // this.altCoupon = '';
          // this.altcouponFlag = 'No';
          this.autocallCoupon = '';
          this.autocallCouponType = 'Constant Barrier';
         // this.MemoryPeriods = '';
          this.issuePrice = '100.00';
  
          //this.autoNonCallYN = 'N';
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
            //console.log(this.defaultvaluesArr);
            this.fillDefaultValuesData();
  
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
  
  
          this.users =  await this.apifunctions.GetMappedUsersAndGroups();
          // //console.log('users', this.users);
          
          const res:any = await this.apifunctions.GetPriceProviderDetails(this.templateMappingArr?.length > 0 ? this.templateMappingArr[0].template : 'EQC_Europe');
         
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

  async fnGetProdTemplate() {
    try {

      this.templateMappingArr = await this.apifunctions.fnGetProdTemplate('AutocallablePhoenixER');
    
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
        this.ddlNoteCcy = item.Ccy;
        this.UnderlyingCurrency = item.Ccy;
      }
      else{        
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
      //this.upsideTypeChange()

    } catch (error) {
      //console.log('Error:', error);
    }
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

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      //console.log('validation arr', this.validationArr)
      if (this.validationArr) {
        for (let i = 0; i < this.validationArr?.length; i++) {
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
          //End - Added by Sudarshan P || 14-Aug-2023|| HSBCECCLI-32
          }
        }
      }
    } catch (error) {
      //console.log('Error:' + error);
    }
  }

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
      if (this.ShareBasket.length > 0) {
        document.getElementById('txtShare').classList.remove('underlyingError');
        document.getElementById('txtShare').classList.add('longText');
      }

      this.ErrorMsg = '';

      const els = document.getElementsByClassName('error');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      document.getElementById('txtShare').classList.remove('underlyingError');
      document.getElementById('txtShare').classList.add('longText');
      if (this.SolveForvalue === 'Strike') {
        this.Strike = '';
      }
      if (this.SolveForvalue === 'Coupon') {
        this.cpnCoupon = '';
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
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

      document.querySelectorAll('div#customOffset ~ .error-input').forEach(ele => {ele.remove()});

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async txtTenorChange(e, type: any) {
    try {
      //this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
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
  async setFormattedNotional(e,rowindex){
    try{
     //await this.addNotional(e,rowindex);
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
      //this.txtnotional = NotionalData.Notional;
      //this.setTotalNotional(); //Changes done by Jyoti S to resolve Order & Total notional issue in place order popup of Previous quotes || 14-Apr-2023
      //console.log(NotionalData);
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
      let CustomIssueDate: string = this.customSetDate ? (this.customSetDate  + 'B') : '';
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

     // this.priceBtnActive = 'Y'; //ApurvaK 
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

  async txtTenorDateChange(type: any) {
    try {
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      let strDate = '';
      this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
      //this.priceBtnActive = 'Y'; //ApurvaK 
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
        this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data:any)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
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
        this.fundRate, '', '').then((data=>{this.TriggerValueArr=data}));//Changed by Jyoti S || 14-Apr-2023
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
  setFocus() {
    this.namefield.nativeElement.focus();
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
    //this.autocallfreqbasedonTenor();
    this.autocallfrombasedonFreqnTenor();

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
        case "IssueDateOffsetRef"://Sudarshan | Asked by vipul | 31-Jan-2024
            this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffsetRef');
          break;
        // case "KIDs":
        //   this.KIDs = await this.parseCommonDatatoJSONArr('KIDs');
        //   break;
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
        case "OrderType":
            this.OrderTypeArr =  await this.parseCommonDatatoJSONArr('OrderType');
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
        // case "NonBestPriceReason":
        //   this.NonBestPriceReasonArr = await this.parseCommonDatatoJSONArr('NonBestPriceReason');
      }
    }

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
    if (Field_Name === 'AutocallFrequency') {
      //console.log(commonDataJSONArr);
    }
    return commonDataJSONArr;
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
   // this.CouponType = [];
    this.Currency = [];
    // this.CurrDropdown = [];
    this.EarlyRedemptionType = [];
    this.FinalUpside = [];
    this.FixingDetermination = [];
    this.Format = [];
    this.IssueDateOffset = [];

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
  async changeStkShiftToggle() {
    //this.priceBtnActive = 'Y'; //ApurvaK 
    console.log("stkshift", this.stkshift)
    if (this.stkshift === '0B') {
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        console.log("stkshift", this.stkdate)
      }
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
  autocallfrombasedonFreqnTenor() {
    this.autoNonCallArr = [];
    let tenorinmonth = 0;
    let fromchar = '';
    let ddlValueCount = 0;
    if (this.expshift !== 'Custom') {
      let tenorNum = this.expshift?.substr(0, this.expshift.length - 1);

      let tenorType = this.expshift?.substr(this.expshift.length - 1);

      if (tenorNum?.includes('.')) {
        const arr = tenorNum?.split('.');
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

  setdefaultcpnFreq() {


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
    //this.cpnFreqChange();

  }
  
  GenerateXML() {
    let xmlstr = '';
    for (const i in this.templateMappingArray) {
      switch (this.templateMappingArray[i]) {

        case 'Currency':
          if (this.CurrencyYN == 'Y' || this.CurrencyYN == '' && this.ddlNoteCcy != undefined) {
            xmlstr += '<Currency>' + this.ddlNoteCcy + '</Currency>';
         }
          break;

        case 'Format':
          if (this.FormatYN == 'Y'|| this.FormatYN == '') {
            xmlstr += '<Format>' + this.format + '</Format>';
          }
          break;

        case 'SolveFor':
          if (this.SolveForYN == 'Y'|| this.SolveForYN == '') {
            xmlstr += '<SolveFor>' + this.SolveForvalue + '</SolveFor>';
          }
          break;

        case 'Underlying':
           if (this.UnderlyingYN == 'Y'|| this.UnderlyingYN == '') {
            this.tempShares =  this.Code().split(",");
            //console.log(this.Code(),"Code console");
            //console.log("abcde", this.tempShares);
            //console.log("Data XML",this.BasketData);
            //let temp1 = [].concat(this.BasketData, this.tempShares);  //commented by AdilP @11-07-2023
            //console.log(temp1.filter(String),"Merged array");
            //console.log(this.BasketData);
            xmlstr += '<Underlyings>' +  this.tempShares.filter(String) + '</Underlyings>';
            }
          break;

        case 'Notional':
          if (this.notionalYN == 'Y'|| this.notionalYN == '') {
            xmlstr += '<Notional>' + this.Notional + '</Notional>';
          }
          break;

        case 'ReofferPrice':
          if (this.reofferPriceYN == 'Y'|| this.reofferPriceYN == '') {
            xmlstr += '<ReofferPrice>' + this.IBPrice + '</ReofferPrice>';
          }
          break;

        case 'Upfront':
          if (this.upfrontYN == 'Y'|| this.upfrontYN == '') {
            xmlstr += '<Upfront>' + this.UpfrontIBPrice + '</Upfront>';
          }
          break;

        case 'IssuePrice':
          if (this.issuePriceYN == 'Y'|| this.issuePriceYN == '') {
            xmlstr += '<IssuePrice>' + this.issuePrice + '</IssuePrice>';
          }
          break;

        case 'BasketType':
          if (this.basketTypeYN == 'Y'|| this.basketTypeYN == '') {
            xmlstr += '<BasketType>' + this.basketType + '</BasketType>';
          }
          break;

        case 'PublicPrivate':
          if (this.publicPrivateYN == 'Y'|| this.publicPrivateYN == '') {
            xmlstr += '<PublicPrivate>' + this.publicOrPrivate + '</PublicPrivate>';
          }
          break;

        case 'Quanto':
          if (this.quantoYN == 'Y'|| this.quantoYN == '') {
            xmlstr += '<Gearring>' + this.quanto + '</Gearring>';
          }
          break;

        case 'Listed':
          if (this.listedYN == 'Y'|| this.listedYN == '') {
            xmlstr += '<Listed>' + this.listed + '</Listed>';
          }
          break;

        case 'StockExchange':
          if (this.stockExchangeYN == 'Y'|| this.stockExchangeYN == '') {
            xmlstr += '<StockExchange>' + this.stockExchange + '</StockExchange>';
          }
          break;

        case 'Priips':
          if (this.priipsPopupYN == 'Y'|| this.priipsPopupYN == '') {
            xmlstr += '<Priips>' + this.priipsYN + '</Priips>';
          }
          break;

        case 'Language':
          if (this.languageYN == 'Y'|| this.languageYN == '') {
            xmlstr += '<Language>' + this.language + '</Language>';
          }
          break;

        case 'Country':
          if (this.countryYN == 'Y'|| this.countryYN == '') {
            xmlstr += '<Country>' + this.country + '</Country>';
          }
          break;

        case 'Termsheet':
          if (this.termsheetYN == 'Y'|| this.termsheetYN == '') {
            xmlstr += '<Termsheet>' + this.termsheetType + '</Termsheet>';
          }
          break;

          // case 'StrikeShifterDate':
          //   if (this.ShifterDateYN == 'Y'|| this.ShifterDateYN == '') {
          //     xmlstr += '<StrikeShifterDate>' + this.stkdate + '</StrikeShifterDate>'
          //     xmlstr += '<StrikeShifterDateType>' + this.stkshift + '</StrikeShifterDateType>';
          //   }
          //   break;

        case 'IssueDateOffset':
          if (this.issueDateOffsetYN == 'Y'|| this.issueDateOffsetYN == '') {
            // xmlstr += '<IssueDateOffset>' + this.paymentshift + '</IssueDateOffset>';
            xmlstr += '<IssueDateOffset>' + 
             (this.paymentshift === 'Custom' ? this.customSetDate : this.paymentshift.toString() ) +
            '</IssueDateOffset>';
          }
          break;

        case 'Tenor':
          if (this.TenorYN == 'Y'|| this.TenorYN == '') {
            xmlstr += '<Tenor>' + this.expshift + '</Tenor>';
          }
          break;

        case 'SettlementMethod':
          if (this.settlementMethodYN == 'Y'|| this.settlementMethodYN == '') {
            xmlstr += '<SettlementMethod>' + this.SettlementMethod + '</SettlementMethod>';
          }
          break;

        case 'FundType':
          if (this.FundTypeYN == 'Y'|| this.FundTypeYN == '' ) {
            xmlstr += '<FundType>' + this.fundType + '</FundType>';
          }
          break;

        case 'FundingFrequency':
          if ((this.FundFreqYN == 'Y'|| this.FundFreqYN == '')&& (this.fundFreq !== undefined)) {
            xmlstr += '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>';
          }
          break;

        case 'FundingRateSpread':
          if (this.RateSpreadYN == 'Y'|| this.RateSpreadYN == '') {
            xmlstr += '<FundingRateSpread>' + this.fundRate + '</FundingRateSpread>';
          }
          break;

        case 'AutocallType':
          if (this.AutocallTypeYN == 'Y'|| this.AutocallTypeYN == '') {
            xmlstr += '<AutocallType>' + this.autocallCouponType + '</AutocallType>';
          }
          break;

        case 'AutocallFrequency':
          if (this.autocallFrequencyYN == 'Y'|| this.autocallFrequencyYN == '') {
            xmlstr += '<AutocallFrequency>' + this.autoFreq + '</AutocallFrequency>';
          }
          break;

        // case 'PutableFrequency':
        //   if (this.putableFreqYN == 'Y') {
        //     xmlstr += '<PutableFrequency>' + this.putableFreq + '</PutableFrequency>';
        //   }
        //   break;

        // case 'CallableFrequency':
        //   if (this.callableFreqYN == 'Y') {
        //     xmlstr += '<CallableFrequency>' + this.callableFreq + '</CallableFrequency>';
        //   }
        //   break;

        case 'AutocallableFrom':
          if (this.autocallableFromYN == 'Y'|| this.autocallableFromYN == '') {

           

              xmlstr += '<AutocallableFrom>' + this.autoNonCall + '</AutocallableFrom>';

            
            if (this.autocallCouponType === 'Putable by the Investor') {

              xmlstr += '<PutableFrom>' + this.autoNonCall + '</PutableFrom>';

            }
            if (this.autocallCouponType === 'Callable by the Issuer') {

              xmlstr += '<CallableFrom>' + this.autoNonCall + '</CallableFrom>';

            }
          }
          break;

        case 'AutocallBarrier':
          if (this.autocallBarrierYN == 'Y'|| this.autocallBarrierYN == '') {
            xmlstr += '<AutocallBarrier>' + this.autoTrigger + '</AutocallBarrier>';
          }
          break;

        case 'StepUpDown':
          if (this.stepdownYN == 'Y'|| this.stepdownYN == '') {
            xmlstr += '<StepUpDown>' + this.autoStepDown + '</StepUpDown>';
          }
          break;

        // case 'PutableBarrierLevel':
        //   if (this.putableBarrierLevelYN == 'Y') {
        //     xmlstr += '<PutableBarrierLevel>' + this.PutableBarrier + '</PutableBarrierLevel>';
        //   }
        //   break;

        case 'ProtectionType':
          if (this.protectionTypeYN == 'Y'|| this.protectionTypeYN == '') {
            xmlstr += '<ProtectionType>' + this.barrierType + '</ProtectionType>';
          }
          break;

        case 'PutStrike':
          if ((this.putStrikeYN == 'Y'|| this.putStrikeYN == '') && (this.Strike != undefined)) {
            xmlstr += '<PutStrike>' + this.Strike + '</PutStrike>';
          }
          break;

        // case 'ProtectionLevel':
        //   if (this.protectionLvlYN == 'Y') {

        //     xmlstr += '<ProtectionLevel>' + this.Strike + '</ProtectionLevel>';
        //   }
        //   break;

        // case 'UpperPutStrike':
        //   if (this.upperPutStrikeYN == 'Y') {

        //     xmlstr += '<UpperPutStrike>' + this.upperPutStrike + '</UpperPutStrike>';
        //   }
        //   break;

        // case 'PutGearring':
        //   if (this.putGearingYN == 'Y') {
        //     xmlstr += '<PutGearring>' + this.leverage + '</PutGearring>';
        //   }
        //   break;

        // case 'LowerPutStrike':
        //   if (this.lowerPutStrikeYN == 'Y') {
        //     xmlstr += '<LowerPutStrike>' + this.lowerPutStrike + '</LowerPutStrike>';
        //   }
        //   break;

        case 'BarrierLevel':
          if (this.popupKIBarrierYN == 'Y'|| this.popupKIBarrierYN == '') {
            xmlstr += '<BarrierLevel>' + this.barrierLevel + '</BarrierLevel>';
          }
          break;

        // case 'PutSpreadGearing':
        //   if (this.putSpreadGearingYN == 'Y') {
        //     xmlstr += '<PutSpreadGearing>' + this.putSpreadGearing + '</PutSpreadGearing>';
        //   }
        //   break;

        // case 'CallStrike':
        //   if (this.callStrikePercYN == 'Y') {
        //     xmlstr += '<CallStrike>' + this.callStrike + '</CallStrike>';
        //   }
        //   break;

        // case 'LowerCallStrike':
        //   if (this.lowerCallStrikePercYN == 'Y') {
        //     xmlstr += '<LowerCallStrike>' + this.lowerCallStrike + '</LowerCallStrike>';
        //   }
        //   break;

        // case 'CallGearring':
        //   if (this.callGearingYN == 'Y') {
        //     xmlstr += '<CallGearing>' + this.callGearing + '</CallGearing>';
        //   }
        //   break;

        // case 'UpperCallStrike':
        //   if (this.upperCallStrikeYN == 'Y') {
        //     xmlstr += '<UpperCallStrike>' + this.upperCallStrike + '</UpperCallStrike>';
        //   }
        //   break;

        // case 'CallSpreadGearing':
        //   if (this.callSpreadGearingYN == 'Y') {
        //     xmlstr += '<CallSpreadGearing>' + this.callSpreadGearing + '</CallSpreadGearing>';
        //   }
        //   break;

        case 'AutocallCouponType':
          if (this.autoCouponTypeYN == 'Y'|| this.autoCouponTypeYN == '') {
            xmlstr += '<AutocallCouponType>' + this.ERCpnType + '</AutocallCouponType>';
          }
          break;

        case 'ERCouponPa':
          if (this.ERCouponPaYN == 'Y'|| this.ERCouponPaYN == '') {
            xmlstr += '<ERCouponPa>' + this.ERCoupon + '</ERCouponPa>';
          }
          break;

        case 'AddPeriodicCpn':
          if (this.periodicCouponYN == 'Y'|| this.periodicCouponYN == '') {
            xmlstr += '<AddPeriodicCpn>' + this.periodicCouponFlag + '</AddPeriodicCpn>';
          }
          break;

        case 'PeriodicCpnType':
          if ((this.periodicCpnTypeYN == 'Y'|| this.periodicCpnTypeYN == '') && (this.cpnType !== undefined)) {
            xmlstr += '<PeriodicCpnType>' + this.cpnType + '</PeriodicCpnType>';
          }
          break;

        case 'CouponBarrierType':
          if ((this.cpnBarrierTypeYN == 'Y'|| this.cpnBarrierTypeYN == '') && (this.cpnObservation !== undefined)) {
            xmlstr += '<CouponBarrierType>' + this.cpnObservation + '</CouponBarrierType>';
          }
          break;

        // case 'RangeAccuralFreq':
        //   if (this.rangeAccFreqYN == 'Y') {
        //     xmlstr += '<RangeAccuralFreq>' + this.rangeAccrualFreq + '</RangeAccuralFreq>';
        //   }
        //   break;

        case 'CouponBarrierLevel':
          if (this.cpnBarrierLvlYN == 'Y'|| this.cpnBarrierLvlYN == '') {
              xmlstr += '<CouponBarrierLevel>' + this.cpnTrigger + '</CouponBarrierLevel>';
          }
          break;

        case 'PeriodicCpnFreq':
          if (this.periodicCpnFreqYN == 'Y'|| this.periodicCpnFreqYN == '') {
            xmlstr += '<PeriodicCpnFreq>' + this.cpnFreq + '</PeriodicCpnFreq>';
          }
          break;

        // case 'FloatingRefIndex':
        //   if (this.floatingRefIndexYN == 'Y') {
        //     xmlstr += '<FloatingRefIndex>' + this.cpnFltRef + '</FloatingRefIndex>';
        //   }
        //   break;

        case 'CouponPaPerc':
          if (this.couponPaPercYN == 'Y'|| this.couponPaPercYN == '') {
            if (this.cpnType !== '' && this.cpnType !== 'None' && this.cpnType !== 'Floating Unconditional' && this.cpnType !== 'Floating without Memory') {

              xmlstr += '<CouponPaPerc>' + this.cpnCoupon + '</CouponPaPerc>'

            }
          }
          if (this.couponPaPercYN == 'Y'|| this.couponPaPercYN == '') {
            if (this.cpnType === 'Floating Unconditional' || this.cpnType === 'Floating without Memory') {

              xmlstr += '<CouponPaPerc>' + this.cpnCoupon + '</CouponPaPerc>'

            }
          }
          break;

        // case 'FloorCap':
        //   xmlstr += '<FloorCap>' + this.cpnFloor + '' + this.cpnCap + '</FloorCap>';
        //   break;

        // case 'Multiplier':
        //   xmlstr += '<Multiplier>' + this.cpnMultiplier + '</Multiplier>'
        //   break;

        case 'CouponInFine':
          if (this.cpnInFineYN == 'Y'|| this.cpnInFineYN == '') {
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
    for (const i in this.allDefaultValues) {
      switch (this.allDefaultValues[i].Control_Name) {
        case 'Currency':
          this.ddlNoteCcy = this.allDefaultValues[i].Default_Value;
          //console.log(this.ddlNoteCcy, "defaultcurrencyval");
          this.CurrencyYN = this.allDefaultValues[i].ActiveYN == '' ? 'Y' : this.allDefaultValues[i].ActiveYN;
          this.CurrDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.CurrencyUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.CurrencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;

        case 'Format':
          // //console.log(this.format,"defaultformatval");
          this.FormatYN = this.allDefaultValues[i].ActiveYN;
          this.FormatDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.format =  this.FormatDropdown[0];
          }
          else{
            this.format = this.allDefaultValues[i].Default_Value;
            this.FormatUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.FormatUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          // //console.log(this.FormatDropdown,"selectedFormat Val");
          break;

        case 'SolveFor':
          
          // //console.log(this.format,"defaultformatval");
          this.SolveForYN = this.allDefaultValues[i].ActiveYN;
          this.selectedSolveFor = '';
          this.selectedSolveFor = this.allDefaultValues[i].Selectedvaluecsv.split(',').toString();
          if(this.selectedSolveFor.startsWith(',')){
            this.selectedSolveFor = this.selectedSolveFor.substring(1);
          }
          const tempSolveforArr = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          //console.log(tempSolveforArr, "tempArr");
          this.SolveForDropdown = [];
          for (var s = 0; s < tempSolveforArr.length; s++) {
            for (let solveforval of this.solveForArr) {
              if (tempSolveforArr[s] == (solveforval.Key)) {
                //console.log(tempSolveforArr[s], "tempSolveforArr[s]");
                //console.log(solveforval.Value, "i['value'] Val");
                this.SolveForDropdown.push(solveforval);
                // this.showSolveForArr.push(solveforval.Value);
              }
            }
          }
          if(this.allDefaultValues[i].Default_Value == "" || undefined){
            this.SolveForvalue =  this.SolveForDropdown[0];
          }
          else{
            this.SolveForvalue = this.allDefaultValues[i].Default_Value;
          }
          this.SolveForUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.SolveForUpdatedAt = this.allDefaultValues[i].Updated_At;
          // this.SolveForDropdown = this.bindSolveForVal(this.SolveForDropdown);
          //console.log(this.SolveForDropdown, "selectedFormat Val");
          break;

          case 'OrderType':
            this.OrderTypeYN = this.allDefaultValues[i].ActiveYN;
            this.OrderTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
            if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
              this.ordertype =  this.OrderTypeDropdown[0];
            }
            else{
              this.ordertype = this.allDefaultValues[i].Default_Value;
            }
            this.OrderTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.OrderTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
  
            this.OrderTypeUpdatedAt = 
            (new Date(Date.parse(this.OrderTypeUpdatedAt + ' UTC'))).toLocaleString();
            break;

        case 'Underlyings':
          this.UnderlyingYN = this.allDefaultValues[i].ActiveYN;
          this.BasketData = this.allDefaultValues[i].Default_Value.split(',');
	  //Added by AdilP to poulate basket shares @11-07-2023
          if(this.BasketData && this.BasketData.length > 0 && this.BasketData[0] !== ''){
            this.BasketData.forEach((e)=>{
              var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == e)
              if (index >= 0) {
                const shareCode = this.shares[index].Code;
                this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
              }
            })
          }
          
          this.UnderlyingsUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.UnderlyingsUpdatedAt = this.allDefaultValues[i].Updated_At;
          // this.SolveForDropdown = this.bindSolveForVal(this.SolveForDropdown);
          // //console.log(this.FormatDropdown,"selectedFormat Val");
          break;

        case 'Notional':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.Notional = '';
          }
          else{
            this.Notional = this.allDefaultValues[i].Default_Value;
            this.NotionalUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.NotionalUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          // //console.log(this.Notional,"defaultNotionalval");
          this.notionalYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'ReofferPrice':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.IBPrice = '';
          }
          else{
            this.IBPrice = this.allDefaultValues[i].Default_Value;
            this.ReofferPriceUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.ReofferPriceUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.reofferPriceYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'Upfront':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.UpfrontIBPrice = '';
          }
          else{
            this.UpfrontIBPrice = this.allDefaultValues[i].Default_Value;
            this.UpfrontUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.UpfrontUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.upfrontYN = this.allDefaultValues[i].ActiveYN == '' ? 'Y' : this.allDefaultValues[i].ActiveYN;
          break;

        case 'IssuePrice':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.issuePrice = '';
          }
          else{
            this.issuePrice = this.allDefaultValues[i].Default_Value;
            this.IssuePriceUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.IssuePriceUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          // //console.log(this.Notional,"defaultNotionalval");
          this.issuePriceYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'BasketType':
          this.basketType = this.allDefaultValues[i].Default_Value;
          this.basketTypeYN = this.allDefaultValues[i].ActiveYN;
          this.basketTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.BasketTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.BasketTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.basketTypeDropdown, "basketTypeDropdown");
          break;

        case 'PublicPrivate':
          this.publicOrPrivate = this.allDefaultValues[i].Default_Value;
          this.publicPrivateYN = this.allDefaultValues[i].ActiveYN;
          this.publicPrivateDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.PublicPrivateUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.PublicPrivateUpdatedAt = this.allDefaultValues[i].Updated_At;
          
          //console.log(this.publicPrivateDropdown, "publicPrivateDropdown");
          break;

        case 'Quanto':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.quanto = "Y";
          }
          else{
            this.quanto = this.allDefaultValues[i].Default_Value;
            this.QuantoUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.QuantoUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.quantoYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'Listed':
          this.listed = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.listedYN = this.allDefaultValues[i].ActiveYN;
          this.ListedUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.ListedUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;

        case 'StockExchange':
          this.stockExchange = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.stockExchangeYN = this.allDefaultValues[i].ActiveYN;
          this.stockExchangeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.StockExchangeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.StockExchangeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.stockExchangeDropdown, "stockExchangeDropdown");
          break;

        case 'Priips':
          this.priipsYN = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.priipsPopupYN = this.allDefaultValues[i].ActiveYN;
          this.PriipsUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.PriipsUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;

        case 'Language':
	//Added by AdilP || to resolve default values display
          this.languageDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.language= this.allDefaultValues[i].Default_Value;
          if(this.language.startsWith(',')){
            this.language = this.language.substring(1);
          }
         // console.log(prevDefaultLang,"prevDefaultLan: APURVA")
          // this.language = [];
          // prevDefaultLang.forEach((lang)=>{
          //   if(this.languageDropdown.includes(lang))
          //     this.language.push(lang)
          // })
          
          
          //this.language = this.allDefaultValues[i].Default_Value.split(',');
          //console.log(this.language,"language: After");
          
          this.languageYN = this.allDefaultValues[i].ActiveYN;
          this.languageDropdown1=[];
          for (let i = 0; i < this.languageDropdown.length; i++) {
            if (this.languageDropdown[i] != '') {
              this.languageDropdown1.push({ 'Key': this.languageDropdown[i], 'Value': this.languageDropdown[i] });
            }
            //console.log(this.languageDropdown1,"languagekeyvalue");
          }
          this.LanguageUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.LanguageUpdatedAt = this.allDefaultValues[i].Updated_At;
          
          break;


        case 'Country':
	//Added by AdilP || to resolve default values display
          this.countryDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.country = this.allDefaultValues[i].Default_Value;
          if(this.country.startsWith(',')){
            this.country = this.country.substring(1);
          }
          // this.country = [];
          // prevDefaultCountry.forEach((ctry)=>{
          //   if(this.countryDropdown.includes(ctry))
          //     this.country.push(ctry)

          // })
          
          //this.country = this.allDefaultValues[i].Default_Value.split(',');
          //console.log(this.Notional,"defaultNotionalval");

          this.countryYN = this.allDefaultValues[i].ActiveYN;
          //console.log(this.countryDropdown, "CountryDropdown");
          this.countryDropdown1=[];
          for (let i = 0; i < this.countryDropdown.length; i++) {
            if (this.countryDropdown[i] != '') {
              this.countryDropdown1.push({ 'Key': this.countryDropdown[i], 'Value': this.countryDropdown[i] });
            }
            //console.log(this.countryDropdown1,"countryDropdownkeyvalue");
          }
          this.CountryUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.CountryUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;

        case 'Termsheet':
          this.termsheetType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.termsheetYN = this.allDefaultValues[i].ActiveYN;
          this.termsheetDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          //console.log(this.termsheetDropdown, "termsheetDropdown");
          break;


        case 'StrikeShifterDate':

          this.stkdate = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.ShifterDateYN = this.allDefaultValues[i].ActiveYN;
          this.StrikeShifterDateUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.StrikeShifterDateUpdatedAt = this.allDefaultValues[i].Updated_At; //Added by Jyoti S || 11-Jul-2023
          break;
          case 'StrikeShifterDateType':
            this.stkshift=this.allDefaultValues[i].Default_Value;
            this.ShifterDateYN = this.allDefaultValues[i].ActiveYN;
            break;
        case 'IssueDateOffset':
          this.paymentshift = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.issueDateOffsetYN = this.allDefaultValues[i].ActiveYN;
          this.issueDateDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.IssueDateOffsetUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.IssueDateOffsetUpdatedAt = this.allDefaultValues[i].Updated_At;
          console.log(this.issueDateDropdown, "issueDateDropdown");
          break;


        case 'Tenor':
          this.expshift = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.TenorYN = this.allDefaultValues[i].ActiveYN;
          this.TenorDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.TenorUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.TenorUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.TenorDropdown, "TenorDropdown");
          break;


        case 'SettlementMethod':
          this.SettlementMethod = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.settlementMethodYN = this.allDefaultValues[i].ActiveYN;
          this.settlementMethodDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          //console.log(this.settlementMethodDropdown, "settlementMethodYNDropdown");
          this.TenorUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.TenorUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;


        case 'FundType':
          this.fundType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.FundTypeYN = this.allDefaultValues[i].ActiveYN;
          this.FundTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.FundTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.FundTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.FundTypeDropdown, "FundTypeDropdown");
          break;

        case 'FundingFrequency':
          this.fundFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.FundFreqYN = this.allDefaultValues[i].ActiveYN;
          this.fundFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.FundingFrequencyUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.FundingFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.fundFreqDropdown, "fundFreqDropdown");
          break;

        case 'FundingRateSpread':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.fundRate = '';
          }
          else{
            this.fundRate = this.allDefaultValues[i].Default_Value;
            this.FundingRateSpreadUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.FundingRateSpreadUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
        
          // //console.log(this.Notional,"defaultNotionalval");
          this.RateSpreadYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'AutocallType':
          this.autocallCouponType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.AutocallTypeYN = this.allDefaultValues[i].ActiveYN;
          this.autocallCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          //console.log(this.autocallCpnDropdown, "autocallCpnDropdown");
          break;

        case 'AutocallFrequency':
          this.autoFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.autocallFrequencyYN = this.allDefaultValues[i].ActiveYN;
          this.autoFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.AutocallFrequencyUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.AutocallFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.autoFreqDropdown, "autoFreqDropdown");
          break;

        case 'PutableFrequency':
          this.putableFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.putableFreqYN = this.allDefaultValues[i].ActiveYN;
          this.putableFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.PutableFrequencyUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.PutableFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.putableFreqDropdown, "putableFreqDropdown");
          break;

        case 'CallableFrequency':
          this.callableFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.callableFreqYN = this.allDefaultValues[i].ActiveYN;
          this.callableFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.CallableFrequencyUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.CallableFrequencyUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.callableFreqDropdown, "callableFreqDropdown",this.callableFreq);
          break;

          case 'AutocallableFrom':
            this.autoNonCall = this.allDefaultValues[i].Default_Value;
            // //console.log(this.Notional,"defaultNotionalval");
            this.autocallableFromYN = this.allDefaultValues[i].ActiveYN;
            this.autocallableFromDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
            this.AutocallableFromUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.AutocallableFromUpdatedAt = this.allDefaultValues[i].Updated_At;
            //console.log(this.autocallableFromDropdown, "autocallableFromDropdown");
            break;
          
        case 'AutocallBarrier':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.autoTrigger = '';
          }
          else{
            this.autoTrigger = this.allDefaultValues[i].Default_Value;
            this.AutocallBarrierUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.AutocallBarrierUpdatedAt = this.allDefaultValues[i].Updated_At;

          }
          // //console.log(this.Notional,"defaultNotionalval");
          this.autocallBarrierYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'StepUpDown':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.autoStepDown = '';
          }
          else{
            this.autoStepDown = this.allDefaultValues[i].Default_Value;
            this.StepUpDownUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.StepUpDownUpdatedAt = this.allDefaultValues[i].Updated_At;

          }
          // //console.log(this.Notional,"defaultNotionalval");
          this.stepdownYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'PutableBarrierLevel':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.PutableBarrier = '';
          }
          else{
            this.PutableBarrier = this.allDefaultValues[i].Default_Value;
            this.PutableBarrierLevelUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.PutableBarrierLevelUpdatedBy = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.putableBarrierLevelYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'ProtectionType':
          this.barrierType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.protectionTypeYN = this.allDefaultValues[i].ActiveYN;
          this.barrierTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.ProtectionTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.ProtectionTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.barrierTypeDropdown, "barrierTypeDropdown");
          break;

        // This is for PutStrik conditions |start
        case 'PutStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.Strike = '';
          }
          else{
            this.Strike = this.allDefaultValues[i].Default_Value;
            this.PutStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.PutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          this.Strike = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.putStrikeYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'ProtectionLevel':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.ProtectionLevel = '';
          }
          else{
            this.ProtectionLevel = this.allDefaultValues[i].Default_Value;
            this.ProtectionLevelUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.ProtectionLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.protectionLvlYN = this.allDefaultValues[i].ActiveYN;
          break;
        // This is for PutStrik conditions |end

        case 'UpperPutStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.upperPutStrike = '';
          }
          else{
            this.upperPutStrike = this.allDefaultValues[i].Default_Value;
            this.UpperPutStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.UpperPutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.protectionLvlYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'PutGearring':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.leverage = '';
          }
          else{
            this.leverage = this.allDefaultValues[i].Default_Value;
            this.PutGearringUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.PutGearringUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.putGearingYN = this.allDefaultValues[i].ActiveYN;
          break;


        case 'LowerPutStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.lowerPutStrike = '';
          }
          else{
            this.lowerPutStrike = this.allDefaultValues[i].Default_Value;
            this.LowerPutStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.LowerPutStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.lowerPutStrikeYN = this.allDefaultValues[i].ActiveYN;
          break;


        case 'BarrierLevel':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.barrierLevel = '';
          }
          else{
            this.barrierLevel = this.allDefaultValues[i].Default_Value;
            this.BarrierLevelUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.BarrierLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.popupKIBarrierYN = this.allDefaultValues[i].ActiveYN;
          break;


        case 'PutSpreadGearing':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.putSpreadGearing = '';
          }
          else{
            this.putSpreadGearing = this.allDefaultValues[i].Default_Value;
            this.PutSpreadGearingUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.PutSpreadGearingUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.putSpreadGearingYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'CallStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.callStrike = '';
          }
          else{
            this.callStrike = this.allDefaultValues[i].Default_Value;
            this.CallStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.callStrikePercYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'LowerCallStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.lowerCallStrike = '';
          }
          else{
            this.lowerCallStrike = this.allDefaultValues[i].Default_Value;
            this.LowerCallStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.LowerCallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.lowerCallStrikePercYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'CallGearring':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.callGearing = '';
          }
          else{
            this.callGearing = this.allDefaultValues[i].Default_Value;
            this.CallGearringUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CallGearringUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.callGearingYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'UpperCallStrike':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.upperCallStrike = '';
          }
          else{
            this.upperCallStrike = this.allDefaultValues[i].Default_Value;
            this.UpperCallStrikeUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.UpperCallStrikeUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
    
          // //console.log(this.Notional,"defaultNotionalval");
          this.upperCallStrikeYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'CallSpreadGearing':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.callSpreadGearing = '';
          }
          else{
            this.callSpreadGearing = this.allDefaultValues[i].Default_Value;
            this.CallSpreadGearingUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CallSpreadGearingUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
        
          // //console.log(this.Notional,"defaultNotionalval");
          this.callSpreadGearingYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'AutocallCouponType':
          this.ERCpnType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.autoCouponTypeYN = this.allDefaultValues[i].ActiveYN;
          this.autoCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.AutocallCouponTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.AutocallCouponTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          break;

        case 'ERCouponPa':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.ERCoupon = '';
          }
          else{
            this.ERCoupon = this.allDefaultValues[i].Default_Value;
            this.ERCouponPaUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.ERCouponPaUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.ERCouponPaYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'AddPeriodicCpn':
          this.periodicCouponFlag = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.periodicCouponYN = this.allDefaultValues[i].ActiveYN;
          this.periodicCpnDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(','); 
          this.AddPeriodicCpnUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.AddPeriodicCpnUpdatedAt = this.allDefaultValues[i].Updated_At;

          break;

        case 'PeriodicCpnType':
          this.cpnType = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.periodicCpnTypeYN = this.allDefaultValues[i].ActiveYN;
          this.periodicCpnTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.PeriodicCpnTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.PeriodicCpnTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.periodicCpnTypeDropdown, "periodicCpnTypeDropdown");
          break;

        
        case 'CouponBarrierType':
          this.cpnObservation = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.cpnBarrierTypeYN = this.allDefaultValues[i].ActiveYN;
          this.cpnBarrierTypeDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.CouponBarrierTypeUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.CouponBarrierTypeUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.cpnBarrierTypeDropdown, "cpnBarrierTypeDropdown");
          break;

        case 'RangeAccuralFreq':
          this.rangeAccrualFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.rangeAccFreqYN = this.allDefaultValues[i].ActiveYN;
          this.rangeAccFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.RangeAccuralFreqUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.RangeAccuralFreqUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.rangeAccFreqDropdown, "rangeAccFreqDropdown");
          break;

        case 'PeriodicCpnFreq':
          this.cpnFreq = this.allDefaultValues[i].Default_Value;
          // //console.log(this.Notional,"defaultNotionalval");
          this.periodicCpnFreqYN = this.allDefaultValues[i].ActiveYN;
          this.cpnFreqDropdown = this.allDefaultValues[i].Selectedvaluecsv.split(',');
          this.PeriodicCpnFreqUpdatedBy = this.allDefaultValues[i].Updated_By;
          this.PeriodicCpnFreqUpdatedAt = this.allDefaultValues[i].Updated_At;
          //console.log(this.cpnFreqDropdown, "cpnFreqDropdown");
          break;

        case 'CouponBarrierLevel':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnTrigger = '';
          }
          else{
            this.cpnTrigger = this.allDefaultValues[i].Default_Value;
            this.CouponBarrierLevelUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CouponBarrierLevelUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
        
          // //console.log(this.Notional,"defaultNotionalval");
          this.cpnBarrierLvlYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'CouponPaPerc':
          if(this.allDefaultValues[i].Default_Value == 'undefined' || undefined){
            this.cpnCoupon = '';
          }
          else{
            this.cpnCoupon = this.allDefaultValues[i].Default_Value;
            this.CouponPaPercUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CouponPaPercUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
         
          // //console.log(this.Notional,"defaultNotionalval");
          this.couponPaPercYN = this.allDefaultValues[i].ActiveYN;
          break;

        case 'CouponInFine':
          if(this.allDefaultValues[i].Default_Value == '' || undefined|| 'undefined'){
            this.cpnInFine = 'Y';
          }
          else{
            this.cpnInFine = this.allDefaultValues[i].Default_Value;
            this.CouponInFineUpdatedBy = this.allDefaultValues[i].Updated_By;
            this.CouponInFineUpdatedAt = this.allDefaultValues[i].Updated_At;
          }
          
          // //console.log(this.Notional,"defaultNotionalval");
          this.cpnInFineYN = this.allDefaultValues[i].ActiveYN;
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
  MinMaxValidationCheck(e, id) {
    const target = this.commonfunctions.GetEventTarget(e);
    switch (id) {
      case 'Notional':
        let formatedNotional = parseFloat(this.Notional).toFixed(2)


        if ((parseInt(formatedNotional) > parseInt(this.maxNotional)) || (parseInt(formatedNotional) < parseInt(this.minNotional))) {
          this.minMaxFlag = true
          this.minMaxMsg = "Notional should be between:" + parseInt(this.minNotional) + "-" + parseInt(this.maxNotional)
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
  ERCpnTypeChange() {
    if (this.ERCpnType === 'None') {
      this.periodicCouponFlag = 'Yes';
      this.ERCoupon = '';
    } else {
      this.periodicCouponFlag = 'No';
      if (this.SolveForvalue === 'Coupon') {
        this.SolveForvalue = 'IBPrice';
      }
    }
  }

  openPopup(id: any) {
    this.id = id;
    this.showPopup = true;
    this.selectedCurrency = this.CurrDropdown;
    this.selectedFormat = this.FormatDropdown;
   
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
    //  for(let data of this.SolveForDropdown){
    //   this.selectedSolveFor.push(this.SolveForDropdown[data].Key);
    //  }
    //  for(let data of this.languageDropdown1){
    //   this.selectedLanguage.push(this.languageDropdown1[data].Key);
    //  }
    // this.selectedSolveFor = this.showSolveForArr;

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
          this.activeYN = this.CurrencyYN=='' ? 'Y' : this.CurrencyYN,
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

      case 'ReofferPrice':
        this.id = 'ReofferPrice';
        this.minValue = this.minReofferPrice,
          this.maxValue = this.maxReofferPrice,
          this.activeYN = this.reofferPriceYN,
          this.selectedCSV = ''
        break;

      case 'Upfront':
        this.id = 'Upfront';
        this.minValue = this.minUpfront,
          this.maxValue = this.maxUpfront,
          this.activeYN = this.upfrontYN,
          this.selectedCSV = ''
        break;

        case 'IssuePrice':
          this.id = 'IssuePrice';
          this.minValue = this.minIssuePrice,
            this.maxValue = this.maxIssuePrice,
            this.activeYN = this.issuePriceYN,
            this.selectedCSV = ''
          break;

      case 'BasketType':
        this.id = 'BasketType';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.basketTypeYN,
          this.selectedCSV = this.selectedBasketType.toString()
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

      case 'FundingFrequency':
        this.id = 'FundingFrequency';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.FundFreqYN,
          this.selectedCSV = this.selectedFundFreq.toString()
        break;

      case 'FundingRateSpread':
        this.id = 'FundingRateSpread';
        this.minValue = this.minRateSpread,
          this.maxValue = this.maxRateSpread,
          this.activeYN = this.RateSpreadYN,
          this.selectedCSV = ''
        break;

      case 'AutocallType':
        this.id = 'AutocallType';
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

        case 'PutableFrequency':
          this.id = 'PutableFrequency';
          this.minValue = '',
            this.maxValue = '',
            this.activeYN = this.putableFreqYN,
            this.selectedCSV = this.selectedPutableFreq.toString()
          break;

          case 'CallableFrequency':
            this.id = 'CallableFrequency';
            this.minValue = '',
              this.maxValue = '',
              this.activeYN = this.callableFreqYN,
              this.selectedCSV = this.selectedCallableFreq.toString()
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

      case 'StepUpDown':
        this.id = 'StepUpDown';
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

      case 'ProtectionLevel':
        this.id = 'ProtectionLevel';
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

      case 'PutGearring':
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

      case 'BarrierLevel':
        this.id = 'BarrierLevel';
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

      case 'CallStrike':
        this.id = 'CallStrike';
        this.minValue = this.minCallStrikePerc,
          this.maxValue = this.maxCallStrikePerc,
          this.activeYN = this.callStrikePercYN,
          this.selectedCSV = ''
        break;

      case 'LowerCallStrike':
        this.id = 'LowerCallStrike';
        this.minValue = this.minLowerCallStrikePerc,
          this.maxValue = this.maxLowerCallStrikePerc,
          this.activeYN = this.lowerCallStrikePercYN,
          this.selectedCSV = ''
        break;

      case 'CallGearring':
        this.id = 'CallGearring';
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

      case 'AutocallCouponType':
        this.id = 'AutocallCouponType';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.autoCouponTypeYN,
          this.selectedCSV = this.selectedAutoCouponType.toString()
        break;

      case 'ERCouponPa':
        this.id = 'ERCouponPa';
        this.minValue = this.minERCouponPa,
          this.maxValue = this.maxERCouponPa,
          this.activeYN = this.ERCouponPaYN,
          this.selectedCSV = ''
        break;

      case 'AddPeriodicCpn':
        this.id = 'AddPeriodicCpn';
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

      case 'CouponBarrierType':
        this.id = 'CouponBarrierType';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.cpnBarrierTypeYN,
          this.selectedCSV = this.selectedCpnBarrierType.toString()
        break;

      case 'RangeAccuralFreq':
        this.id = 'RangeAccuralFreq';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.rangeAccFreqYN,
          this.selectedCSV = this.selectedRangeAccFreq.toString()
        break;

      case 'CouponBarrierLevel':
        this.id = 'CouponBarrierLevel';
        this.minValue = this.minCpnBarrierLvl,
          this.maxValue = this.maxCpnBarrierLvl,
          this.activeYN = this.cpnBarrierLvlYN,
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
        break;

      case 'CpnInFCouponInFineine':
        this.id = 'CouponInFine';
        this.minValue = '',
          this.maxValue = '',
          this.activeYN = this.cpnInFineYN,
          this.selectedCSV = ''
        break;
    }
    //Added by Apurva C/Apurva K for Min max validation in popup || 29-April-2022 || EULGTINT-181
    if(parseFloat( this.minValue)>parseFloat(this.maxValue)){
      

      setTimeout(() => {
        this.showMessageFlag = false;
      this.showMessage = "Min value is greater than Max value" 
  
      }, 2000);
     
    }
else{
  const resFromApi:any = await this.apifunctions.UpdateEntity(this.applicationID, this.id, this.minValue, this.maxValue, this.activeYN, this.selectedCSV);
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

