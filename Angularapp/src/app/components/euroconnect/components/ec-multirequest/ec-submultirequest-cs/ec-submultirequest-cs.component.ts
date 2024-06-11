import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient } from '@angular/common/http';
import $ from 'jquery';

@Component({
  selector: 'app-ec-submultirequest-cs',
  templateUrl: './ec-submultirequest-cs.component.html',
  styleUrls: ['./ec-submultirequest-cs.component.scss']
})
export class EcSubmultirequestCsComponent implements OnInit {

  countrySel = new UntypedFormControl();
  languageSel = new UntypedFormControl();
  @Input() indexTrancheArr: any;
  @Input() floatingRefArr: any;
  @Input() shares: any;
  @Input() ReceivedCCY: any;
  @Input() ProductName: any;  
  @Input() ComponentIndex: number;
  @Input() data: any;
  @Input() DisplayProductName: any;
  @Input() data1: any;
  @Input() length1: any;
  @Input() i: any;
  @Input() mappedformatlist: any;
  @Input() selectedDate: any;
  @Input() showDefault : boolean; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
  // @Input() toggleData: any;
  @Output() errorMsgChanged: EventEmitter<string> = new EventEmitter();
  @Output() scheduleMsgChanged: EventEmitter<string> = new EventEmitter();
  @ViewChild('focusable', { static: false }) namefield: ElementRef; // fetch next focusable element || PriyaL || 28Apr2022 || Assigned by Pranav D

  timeoutMsg: string;
  selectedBIndex = 0;
  showSuggestions = false;
  // Currency: string;
  flag: boolean; 
  ShareName: string;
  // commonfunctions: CommonFunctionsService;
  // apifunctions: ApifunctionsService;
  shareCode: any;
  exchngCode: any;
  selectedShareIndex = 0;
  ShareBasket = [];
  settdate = '';
  stkdate = '';
  expdate = '';

  ddlNoteCcy: any;
  UnderlyingCurrency = 'EUR';
  CCY = [];
  SolveForvalue: any;
  ccyChange: any;
  IBPrice = '';
  Coupon: any;
  upfront: any;
  sortedAllPrices: any = [];
  togglesortedAllPrices: any = [];
  AllPrices = [];
  Prices = [];

  Strike: any;
  //interfaceUrl = environment.euroconnectURL;
  asseturl = environment.asseturl;
  SelectedUnderlyingarray = [];
  SelectedUnderlyingBasketArray = [];
  SelectedUnderlyingBasket: any = {
    UnderlyingOne: {},
    UnderlyingTwo: {},
    UnderlyingThree: {},
    UnderlyingFour: {},
    UnderlyingFive: {}
  };
  
  // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
  customBarrierArr: any = [];
  customBarrierPopup: boolean = false;
  multiPhoenixArr1: any = [];
  toggleDataArr: any = [];
  Code: any;
  RICCode: any;
  Exchange: any;
  Notional = '';
  CouponBarrier: any;
  loadflag = false;
  pageloadflag = true;//Added by SandipA for FIN1EURINT-301 || 09-May-2023
  orderID: any;
  showCptyId : boolean; // FIN1EURINT-401
  Token = '';
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg = '';
  clearFlag: boolean;
  format: any;
  templateMappingArr: any;
  // Product = 'Autocall';
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
  MemoryPeriods: any;
  rfqArr: any = [];
  Dates: any;
  NoteMasterID: any;
  orderStatus: any;
  saveFlag = false;
  successMsg: any;
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
  defaultTimeout: number;
  issuePrice: any = '';
  tempXML = '';
  tempXLJson = {}; // Bulk Pricer (AC) - Export to excel 
  indexTranche = '';
  Detach: any = '';
  Attach: any = '';
  AttachVal: any = '';
  DetachVal: any = '';
  attachDetachCalculationsRes: any;
  checkNotionalRes: any;
  floatingRef: any = '';

  // credit
  creditcouponType: any;
  creditcouponFreq: any;
  creditTenor: any;
  creditSpread: any;
  creditSolveFor: any;
  creditReofferPrice: any;
  creditIssuePrice: any;
  creditcouponBasis: any;
  toggleFlag: any = 'Ind';
  cloneFlag = false;
  ShareBasket1 = [];
  stkshift: any;
  paymentshift = 'T + 5';
  expshift: any;
  issueDate = '';
  addValue = '';
  fullViewFlag : boolean = false;

  //// Participation Variables

  upRebate: any;
  downLowerStrike: any;
  downLeverage: any;
  upBarrierType: any;
  upGearing: any;
  upUpperStrike: any;
  participationType: any;
  upCoupon: any;
  upStrike: any;
  upBarrierLevel: any;
  downStrike: any;
  downBarrierType: any;
  downBarrierLevel: any;
  capitalGuaranteed: any;
  guaranteedCoupon: any;
  guaranteedCouponFreq: any;
  onBehalfOf = '';
  maxBarrier: any;
  maxStrike: any;
  mindownLeverage: any;
  maxdownLeverage: any;
  viewOnly = false;
  portfolioId: any;
  allBooksData: any = [];
  upMinGearing: any;
  upMaxGearing: any;
  upMinStrike: any;
  upMaxStrike: any;
  upMinUpperStrike: any;
  upMaxUpperStrike: any;
  upMinBarrierLevel: any;
  upMaxBarrierLevel: any;
  upMinRebate: any;
  upMaxRebate: any;
  upMinCoupon: any;
  upMaxCoupon: any;
  downMinStrike: any;
  downMaxStrike: any;
  downMinLowerStrike: any;
  downMaxLowerStrike: any;
  downMinBarrierLevel: any;
  downMaxBarrierLevel: any;
  downLeverageYN: any;
  showAllLPPopup : boolean = false;//Added by SandipA for FIN1EURINT-121 || 03-May-2023
  LeverageYN: any = 'Yes'; // Put Spread Gearing Default value change
  LeverageFlag = false;

  // Subscription
  // Autocallable Phoenix
  phxPriceFlagSubscription: Subscription;
  phxSaveFlagSubscription: Subscription;
  phxLoadFlagSubscription: Subscription;
  phxPriceSubscription: Subscription;
  schedulePriceSubscription: Subscription;
  schedulePopupSubscription: Subscription;




  cloneFlagSubscription: Subscription;
  cloneDataSubscription: Subscription;
  toggleFlagSubscription: Subscription;
  excelFlagSubscription: Subscription; // Bulk Pricer (AC) - Export to excel 

  autoFreqArr: any = [];
  freqArr = ['1m', '2m', '3m', '4m', '6m', '12m'];
  TSFlag = false;
  TSLoadFlag=false;//Added by SandipA || 26-June-2023
  ViewTSFlag=false;//Added by SandipA || 26-June-2023
  KIDLoadFlag=false;//Added by SandipA || 26-June-2023
  ViewKIDFlag=false;//Added by SandipA || 26-June-2023
  TSTimeout = 180;
  TSInterval: any;

  TriggerValueArr: any;
  autoTriggerPopup = false;
  cpnTriggerPopup = false;
  fundRatePopup = false;
  reqSuccessMsg: string;
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  priceProvidersArr: any = [];
  timerinSec: any = -1;
  reqKIDSuccessMsg: string;
  quoteEmailSuccessMsg: string;
  KIDFlag = false;
  KIDTimeout = 60;
  KIDInterval: any;
  priceTimerInterval: any;
  templateName = '';
  prevBestLP : string = ''; // FIN1EURINT-563 : TS and KID request status due to best price LP change | 11-Aug-2023

  // accudecu fields
  accuSolveFor = 'Strike';
  noOfShares = 1000;
  estimatedNotional = '0.00';
  accuTenor = 6;
  accuTenorType = 'M';
  accuStrike = '';
  accuUpfront = '0.50';
  accuKOPerInit = '102.00';
  accuKOSttlType = '1 Settl. Cycle after KO';
  accuFreq = "Monthly";
  accuGuarantee = 1;
  accuChkLeverage = true;


  // ER Fields 
  basketType = 'Worst-Of';
  publicOrPrivate = 'Private Placement';
  listed = 'N';
  stockExchange = 'SIX Swiss Exchange'; // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
  //stockExchange = '';
  stockExchangeArr: any = [];
  quanto = 'No';
  priipsYN = 'Yes'; // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
  country = 'UK'; //Changes by Apurva K || 21-Dec-2023
  language = 'English'; // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
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
  upperPutStrike = ''; // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
  lowerPutStrike = '';
  putSpreadGearing = '100.00';
  upsideType = 'None';
  callStrike = '100.00';
  callGearing = '100.00';
  lowerCallStrike = '100.00';
  upperCallStrike = '';
  callSpreadGearing = '100.00';
  leverage = '100.00';
  ProtectionLevel = '';
  KIBarrier = true;
  countryArr = [];
  allSelected = false;
  // FIN1EURINT-478 || Fields should switch vertically (within same column) with 'Tab' in Bulk Pricer
  totalFields : number;
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

  defaultvaluesArr:any = [];
  ERCpnType = '';
  ERCoupon = '';
  periodicCouponFlag = 'Yes';
  SettlementMethod = 'Cash';

  autocallCouponYN: any;
  autoNonCallYN: any;
  autoStepDownYN: any;

  autoNonCallArr: any = [];
  // ProtectionFlag= false;

  LanguageArr1: any = [{ 'Key': 'Czech', 'Value': 'Czech' },
  { 'Key': 'Czechia', 'Value': 'Czechia' },
  { 'Key': 'Dutch', 'Value': 'Dutch' },
  { 'Key': 'English', 'Value': 'English' },
  { 'Key': 'Finnish', 'Value': 'Finnish' },
  { 'Key': 'French', 'Value': 'French' },
  { 'Key': 'Galician', 'Value': 'Galician' },
  { 'Key': 'German', 'Value': 'German' },
  { 'Key': 'Greece', 'Value': 'Greece' },
  { 'Key': 'Greek', 'Value': 'Greek' },
  { 'Key': 'Guernsey', 'Value': 'Guernsey' },
  { 'Key': 'Hungarian', 'Value': 'Hungarian' },
  { 'Key': 'Italian', 'Value': 'Italian' },
  { 'Key': 'Italy', 'Value': 'Italy' },
  { 'Key': 'Norwegian', 'Value': 'Norwegian' },
  { 'Key': 'Polish', 'Value': 'Polish' },
  { 'Key': 'Portuguese', 'Value': 'Portuguese' },
  { 'Key': 'Russian', 'Value': 'Russian' },
  { 'Key': 'Spanish', 'Value': 'Spanish' },
  { 'Key': 'Swedish', 'Value': 'Swedish' },
  ];
  LanguageArr = [];
  // Added by AdilP
  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsView : string = "VIEW"
  docsPopupLabels: Object[] = [];
  // FIN1EURINT-520 | Request for TS and KID links disable for LPs not supporting documentation
  docSupportStatus: any = {};

  dailyKOYN = "No";
  ERCouponTooltipValue: any;
  CouponTooltipValue: any;

  showSortedLpPopup: any;
  showToggleSortedLpPopup: any;

  defaultValueFlag = false; // declare new variable || PriyaL || 08Apr2022 || Assigned by Pranav D.
  // new config variable || Amogh k || 20Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';

  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';

  displayFundingSection : boolean; // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
  ngOnDestroy(): void {
    this.timeLeft = -1;
    this.timeoutMsg = '';
    clearInterval(this.interval);
    this.ShareBasket = [];
    this.SelectedUnderlyingBasket = [];
    this.SelectedUnderlyingBasket = {
      UnderlyingOne: {},
      UnderlyingTwo: {},
      UnderlyingThree: {},
      UnderlyingFour: {},
      UnderlyingFive: {}
    };

    this.SelectedUnderlyingBasketArray = [];
    this.AllPrices = [];
    this.sortedAllPrices = [];
    this.togglesortedAllPrices = [];
    this.orderStatus = '';
    this.commonfunctions.setsubmultiReceivedPrices({}, '');
    this.commonfunctions.setsubmultiRCReceivedPrices({}, '');
    this.commonfunctions.setsubmultiCreditReceivedPrices({}, '');
    this.commonfunctions.setsubmultiPTCReceivedPrices({}, '');

    this.errorMsgChanged.emit('');
    this.apifunctions.toggleData.next('');
    localStorage.clear();
    this.apifunctions.toggleVisiblityFlag.next([]);

    // UnSubscribe all objects
    // Autocallable Phoenix
    if (this.phxPriceFlagSubscription) {
      this.phxPriceFlagSubscription.unsubscribe();
    }
    if (this.phxSaveFlagSubscription) {
      this.phxSaveFlagSubscription.unsubscribe();
    }
    if (this.phxLoadFlagSubscription) {
      this.phxLoadFlagSubscription.unsubscribe();
    }
    if (this.phxPriceSubscription) {
      this.phxPriceSubscription.unsubscribe();
    }



    this.cloneFlagSubscription?.unsubscribe();
    this.cloneDataSubscription?.unsubscribe();
    this.toggleFlagSubscription?.unsubscribe();
    this.excelFlagSubscription?.unsubscribe(); // Bulk Pricer (AC) - Export to excel 

    this.apifunctions.priceFlag.next(false);



    this.apifunctions.saveFlag.next(false);



    if (this.schedulePriceSubscription) {
      this.schedulePriceSubscription.unsubscribe();
    }
    if (this.schedulePopupSubscription) {
      this.schedulePopupSubscription.unsubscribe();
    }
    this.apifunctions.schedulePriceFlag.next({});
    this.apifunctions.schedulePopupFlag.next(false);
  }

  constructor(public elem: ElementRef, 
    public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, 
    public datepipe: DatePipe,
    public http: HttpClient
    ) {
    try {
      this.flag = false;
      // this.shares = [];
      this.ddlNoteCcy = 'EUR';
      this.UnderlyingCurrency = 'EUR';
      this.format = 'Note';
      // this.errorMsgChanged.emit('');
      this.sortedAllPrices = [];
      this.togglesortedAllPrices = [];
      this.showSortedLpPopup = false;
      this.showToggleSortedLpPopup = false;
      this.pageloadflag=true;//Added by SandipA for FIN1EURINT-301 || 09-May-2023
      const that = this;
      $(document).on('click', function (event: { target: any; }) {
        if (!$(event.target).closest('#menucontainer').length) {
          that.closePopups()
        }
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  priipsChanged() {

    if (this.priipsYN === 'No') {

      this.language = '';
      this.country = '';

    }
    // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
    else if (this.priipsYN === 'Yes') {
      this.language = 'English';
      this.country = 'UK'; //Changes by Apurva K || 21-Dec-2023
    }
    // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
  }
  ngOnInit() {

    try {
     
      this.pageloadflag=true;
      // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
      this.displayFundingSection = false;
      this.showCptyId = false; // FIN1EURINT-401
      // FIN1EURINT-478 || Fields should switch vertically (within same column) with 'Tab' in Bulk Pricer
      this.totalFields = 45;
      //$('#loading').show();
      setTimeout(async () => {
      	// FIN1EURINT-520 | Request for TS and KID links disable for LPs not supporting documentation
        this.docSupportStatus = await this.apifunctions.GetDocumentSupportStatus('CustomStrategy');//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
        this.LanguageArr = [];
        
        for (let j = 0; j < this.LanguageArr1.length; j++) {
          if (this.LanguageArr1[j].Value !== '') {
            this.LanguageArr.push(this.LanguageArr1[j].Value);
          }

        }

        this.ShareBasket = [];
        this.SelectedUnderlyingBasket = [];
        this.SelectedUnderlyingBasketArray = [];
        this.SelectedUnderlyingBasket = {
          UnderlyingOne: {},
          UnderlyingTwo: {},
          UnderlyingThree: {},
          UnderlyingFour: {},
          UnderlyingFive: {}
        };

        // this.errorMsgChanged.emit('');
        this.AllPrices = [];
        this.sortedAllPrices = [];
        this.togglesortedAllPrices = [];

        this.orderStatus = '';
        const that = this;
        this.commonfunctions.ClearPricesFromMultiToDealEntry();
        this.ERReset();

        this.templateMappingArr = await this.fnGetProdTemplate();
        this.fnGetValidation();
        if (this.templateMappingArr && this.templateMappingArr.length > 0) {
          this.commonData = await this.apifunctions.GetCommonDataEuroConnect(this.templateMappingArr[0].template);
          if (this.commonData && this.commonData.length > 0) {
            this.filldropdownfromcommandata();
          }

          // this.defaultvaluesArr = this.apifunctions.GetEntityDefaultValues("", (this.commonfunctions.getLoggedInUserName())[0].UserId, 'DiscountCertificate');
          // this.defaultvaluesArr = this.apifunctions.GetEntityDefaultValues("", (this.commonfunctions.getLoggedInUserName())[0].UserId, 'CustomStrategy');
          this.defaultvaluesArr = await this.apifunctions.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'CustomStrategy');       // Vaibhav B | Added UserID from session | 21-Mar-23


          if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
            this.setdefaultvalues();
            this.defaultValueFlag = false; // set default flag || PriyaL || 08Apr2022 || Assigned by Pranav D.
          }
        }



        this.priceProvidersArr = this.apifunctions.priceProviders;

        // this.priceProvidersArr = this.apifunctions.GetPriceProviderDetails(this.ProductName);
        this.priceProvidersArr = await this.apifunctions.GetPriceProviderDetails('CustomStrategy');

        ///////////////// Phoenix Subscribers Start
        this.phxPriceSubscription = this.commonfunctions.submultiSignalRPrices.subscribe(res => {
          const prices = res.price;
          try {
            if (prices && prices.length > 0) {
              if (prices && that.ComponentIndex === res.Index) {
                let invalidDataLength = prices.filter((lp: { status: string; }) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
                this.sortedAllPrices = [];
                this.AllPrices = [];
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < prices.length; i++) {


                  if (this.AllPrices.findIndex(record => record.rfq === prices[i].rfqID) === -1) {
                    if (prices[i].value !== null && prices[i].value !== "") {
                      this.AllPrices.push({
                        rfq: prices[i].rfqID,
                        lp: prices[i].ppID,
                        Price: (prices[i].value === null ? '-' : prices[i].value),//(prices[i].value === null ? 'Rejected' : parseFloat(prices[i].value).toFixed(2)),
                        solveFor: prices[i].solveFor,
                        NoteMasterID: prices[i].noteMasterID,
                        id: prices[i].id,
                        status: prices[i].status,
                        bestYN: prices[i].bestYN,
                        KidSupported: ((this.docSupportStatus?.[prices[i].ppID])?.["KID"] === "Y"),
                        TSSupported: ((this.docSupportStatus?.[prices[i].ppID])?.["Indicative_Termsheet"] === "Y")
                        // FIN1EURINT-520 | Request for TS and KID links disable for LPs not supporting documentation
                      });
                    }
                  }
                }


                // this.sortedAllPrices = this.AllPrices;//.sortBy('Price');
                var idxBest = this.AllPrices.findIndex(item => item.bestYN === 'Y');
                if (idxBest > -1) {
                  //  this.sortedAllPrices = this.AllPrices.PHXsortBy('Price');
                  this.sortedAllPrices = this.AllPrices.filter(item => item.bestYN === 'Y');
                }
                this.AllPrices.forEach(element => {
                  if (element.lp !== this.sortedAllPrices[0].lp) {
                    this.sortedAllPrices.push(element);
                  }
                });
                //console.log(this.sortedAllPrices);
                //console.log(this.AllPrices);

                if (this.sortedAllPrices.length > 0) {
                  that.loadflag = false;
                  let price = '';
                  if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                    price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                  }
                  switch (this.sortedAllPrices[0].solveFor) {
                    case 'Strike':
                      if (this.ProductName == 'Accumulator' || this.ProductName == 'Decumulator') {
                        this.accuStrike = price;
                      } else {
                        this.Strike = price;
                      }
                      break;
                    case 'Upfront':
                      if (this.ProductName == 'Accumulator' || this.ProductName == 'Decumulator') {
                        this.accuUpfront = price;
                      }
                      break;
                    case 'IBPrice':
                      this.IBPrice = price;
                      break;
                    case 'Coupon':
                      if (that.ProductName === 'CreditTranche') {
                        this.creditSpread = price;
                      } else {
                        this.cpnCoupon = price;
                      }
                      break;
                    case 'KO':
                      this.autoTrigger = price;
                      break;
                    case 'RebateCoupon':
                      this.autocallCoupon = price;
                      break;
                    case 'CouponBarrier':
                      this.cpnTrigger = price;
                      break;
                    case 'KI':
                      this.barrierLevel = price;
                      break;
                    case 'FundingRate':
                      this.fundRate = price;
                      break;
                    case 'Reoffer':
                      this.creditReofferPrice = price;
                      break;
                    case 'ERCoupon':
                      this.ERCoupon = price;
                      break;
                    case 'PutStrike':
                      that.Strike = price;
                      break;
                  }
                  if (price !== '') {
                    if (this.sortedAllPrices[0].solveFor !== 'PutStrike') {
                      this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor
                        + this.ComponentIndex).classList.add('reply');
                    } else {
                      this.elem.nativeElement.querySelector('#txtPutStrike'
                        + this.ComponentIndex).classList.add('reply');
                    }
                  }
                  that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                  that.orderID = this.sortedAllPrices[0].id;
                  that.orderStatus = this.sortedAllPrices[0].status;

                  // FIN1EURINT-563 : TS and KID request status due to best price LP change | 11-Aug-2023
                  if(this.prevBestLP !== this.sortedAllPrices[0].lp){
                    this.TSFlag = false;
                    this.reqSuccessMsg = '';
                    this.KIDFlag = false;
                    this.reqKIDSuccessMsg = '';
                    this.quoteEmailSuccessMsg = '';
                  }
                  this.prevBestLP = this.sortedAllPrices[0].lp;
                  // FIN1EURINT-563 : TS and KID request status due to best price LP change | 11-Aug-2023
                }

                if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
                  that.timeLeft = 0;
                }
                if (this.sortedAllPrices.length > 0) {
                  if(invalidDataLength == 0){
                  this.timeLeft = -1;
                  this.timeoutMsg = '';
                  clearInterval(this.interval);
                  }
                  (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
                  this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
                }

              }
            }
          } catch (error) {

          }

        });

        this.phxSaveFlagSubscription = this.apifunctions.saveFlagCheck.subscribe(async flag => {
          if (flag) {

            await this.validationOnButton_ER();
            if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
              this.generateSaveXML_ER();
            }

          }
        });
	
        // Bulk Pricer (AC) - Export to excel 
        this.excelFlagSubscription = this.apifunctions.excelFlag.subscribe(flag => {
          if(flag){
            this.generateExcelJson();
          }
        });

        this.phxPriceFlagSubscription = this.apifunctions.priceFlagCheck.subscribe(async flag => {
          if (flag) {
            this.togglesortedAllPrices = [];
            //console.log(this.ProductName);

            await this.ERPrice();

          }
        });

        this.phxLoadFlagSubscription = this.apifunctions.LoadFlagCheck.subscribe(flag => {
          if (flag) {
            this.togglesortedAllPrices = [];
            this.ShareBasket = [];
            this.SelectedUnderlyingBasket = [];
            this.SelectedUnderlyingBasket = {
              UnderlyingOne: {},
              UnderlyingTwo: {},
              UnderlyingThree: {},
              UnderlyingFour: {},
              UnderlyingFive: {}
            };

            this.SelectedUnderlyingBasketArray = [];
            this.updateShareBasket();
            this.apifunctions.loadFlag.next(false);
          }
        });

        ///////////////// Phoenix Subscribers End


        ///////////// Default and CLone Data Start

        // Get Currency
        try {

          this.ReceivedCCY.forEach((element: { Ccy: any; }) => {
            const ccyData = element.Ccy;
            if (this.ProductName !== 'CreditTranche') {
              this.CCY.push(ccyData);
            } else {
              if (ccyData !== 'MXN') {
                this.CCY.push(ccyData);
              }
            }
          });
        } catch (error) {
          //console.log('Error', error);
        }
        

        this.Code = () => {
          let code = '';
          //console.log(this.SelectedUnderlyingBasket);
          if (this.SelectedUnderlyingBasket) {
            /*
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
            */
            if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.BloombergCode) {
              code = this.SelectedUnderlyingBasket.UnderlyingOne.BloombergCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.BloombergCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.BloombergCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.BloombergCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.BloombergCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.BloombergCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.BloombergCode;
            }
            if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.BloombergCode) {
              code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.BloombergCode;
            }
          }
          return code;
        };

        this.RICCode = () => {
          let code = '';
          if (this.SelectedUnderlyingBasket) {
            // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
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
	        // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
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

        
        // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
        if(this.showDefault){

          this.ddlNoteCcy = 'EUR';
          this.format = 'Note';
          const d = new Date();
          d.setDate(d.getDate() + 7);
          this.IBPrice = ''; // prev. default
          // this.IBPrice = '99.50';
          this.ddlNoteCcy = 'EUR';

          this.SolveForvalue = 'IBPrice'; // prev. default
          // this.SolveForvalue = 'Coupon';
          this.shares = this.apifunctions.shares;

          this.Notional = '1,000,000.00';
          this.Strike = '100.00';
          this.LeverageFlag = false;
          this.LeverageYN = 'Yes'; // Put Spread Gearing Default value change
          // FIN1EURINT-485 || Different price on the same structure via Bulk pricer and Quick pricer
          this.autoTrigger = '102.00';
          this.autoFreq = 'Monthly';
          this.autoStepDown = '';
          this.autoNonCall = 'M1';
          this.cpnType = 'Fixed Unconditional';
          this.cpnTrigger = '70.00';
          this.cpnFreq = '';
          this.cpnObservation = '';
          this.cpnCoupon = '5.00'; // prev. default

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

          this.cpnTypeChange();
        }
        

        this.Dates = await this.apifunctions.BBVAGetDates('', '0B', '');
        if (this.Dates) {
          this.todayDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        }

        if (this.data !== undefined && this.data.SolveFor !== undefined) { // load portfolio and toggle data

          this.ShareBasket = [];
          // cleared basket to resolve wrong currency selected issue on changing underlying || PriyaL || 01Apr2022 || assigned by PranavD
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];


          // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone, toggle and portfolio | 10-Aug-2023
	        if (this.data.ShareBBGRIC1 !== '' && this.data.ShareBBGRIC1 !== undefined) {
            await this.showUnderlying('', (typeof this.data.ShareBBGRIC1) === 'object' ? (this.data.ShareBBGRIC1) : (this.shares.filter((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC1))[0]);
          }
          if (this.data.ShareBBGRIC2 !== '' && this.data.ShareBBGRIC2 !== undefined) {
            await this.showUnderlying('', (typeof this.data.ShareBBGRIC2) === 'object' ? (this.data.ShareBBGRIC2) : (this.shares.filter((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC2))[0]);
          }
          if (this.data.ShareBBGRIC3 !== '' && this.data.ShareBBGRIC3 !== undefined) {
            await this.showUnderlying('', (typeof this.data.ShareBBGRIC3) === 'object' ? (this.data.ShareBBGRIC3) : (this.shares.filter((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC3))[0]);
          }
          if (this.data.ShareBBGRIC4 !== '' && this.data.ShareBBGRIC4 !== undefined) {
            await this.showUnderlying('', (typeof this.data.ShareBBGRIC4) === 'object' ? (this.data.ShareBBGRIC4) : (this.shares.filter((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC4))[0]);
          }
          if (this.data.ShareBBGRIC5 !== '' && this.data.ShareBBGRIC5 !== undefined) {
            await this.showUnderlying('', (typeof this.data.ShareBBGRIC5) === 'object' ? (this.data.ShareBBGRIC5) : (this.shares.filter((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC5))[0]);
          }
	        // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone, toggle and portfolio | 10-Aug-2023
	
	        // HSBCECCLI-10 : Commented unused code and function call to filter shares for code optimization and better performance | 10-Aug-2023
          // var idx = this.shares.findIndex((item: { BloombergCode: any; }) => item.BloombergCode === this.data.ShareBBGRIC1);

          // if (idx > -1) {
          //   this.exchngCode = this.shares[idx].ExchangeCode;
          //   this.shareCode = this.shares[idx].Code;
          // }



          this.stkshift = ['Forward', 'Fwd'].includes(this.data.ComputedStrikeFixingLag) ? 'Fwd' : '0B';

          this.paymentshift = ['5', '5B'].includes(this.data.ComputedSettlementPeriodSoftTenor)  ? 'T + 5' : ['10', '10B'].includes(this.data.ComputedSettlementPeriodSoftTenor) ? 'T + 10' : this.data.ComputedSettlementPeriodSoftTenor === '' ? 'Custom' : this.data.ComputedSettlementPeriodSoftTenor;

          this.expshift = this.data.ComputedPayoffSoftTenor;

          this.changeAutoFreqOnTenor();
          this.autocallfreqbasedonTenor();
          this.autocallfrombasedonFreqnTenor();
          // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for toggle row || 05-Sep-2023
          this.customBarrier();

          this.SolveForvalue = this.data.SolveFor;
          this.creditSolveFor = this.data.SolveFor;
          this.ddlNoteCcy = this.data.Ccy;
          this.termsheetType = this.data.termsheetType; // FIN1EURINT-456 || Termsheet Value update from toggle data
          this.altObservation = this.data.AltCouponObservation;
          this.altCoupon = this.data.AltCouponPer;

          this.cpnTrigger = this.data.CouponBarrier;
          this.creditcouponBasis = this.data.CouponBasis;
          this.cpnObservation = this.data.CouponObs;
          this.cpnCoupon = this.data.CouponPer;
          if (this.data.SolveFor !== 'Coupon') {
            this.creditSpread = this.data.CouponPer;
          } else {
            this.creditSpread = '';
          }
          this.cpnType = this.data.CouponType;


          this.autocallCoupon = this.data.ERCouponPer;
          this.autocallCouponType = this.data.ERCouponType;
          this.creditcouponFreq = this.data.Frequency;
          this.floatingRef = this.data.FloatingRef;


          this.format = this.data.FormatDetails;
          this.cpnFreq = this.data.Frequency;
          this.fundFreq = this.data.FundingFrequency;
          this.fundType = this.data.FundingType;
          this.IBPrice = this.data.IBPrice;
          this.fundRate = this.data.IndexRateSpread;
          this.barrierLevel = this.data.KIPer;
          this.barrierType = this.data.KIType;
          this.autoTrigger = this.data.KOPer;
          this.autoFreq = this.data.KOType;
          this.MemoryPeriods = this.data.MemoryPds;
          this.autoNonCall = this.data.NonCallPeriod;

          this.issuePrice = this.data.IssuePrice;
          this.guaranteedCouponFreq = this.data.InputFixedCouponFrequencyPeriod;
          this.guaranteedCoupon = this.data.GuaranteedCoupon;

          this.Notional = this.commonfunctions.formatNotional(this.data.Size);
          this.autoStepDown = this.data.StepDown;
          this.Strike = this.data.Strike;


          if (this.stkshift !== "Fwd") {

            this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
            if (this.Dates) {
              this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }

            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          } else {
            this.stkdate = this.data.StrikeDate;
          }

          if (this.paymentshift !== "Custom") {
            var parseShifter = this.parseShifter(this.paymentshift);
	          // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
            //this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, parseShifter, this.stkdate);
            //console.log(this.Dates);
            this.settdate = parseShifter.split('B')[0];
          } else {
            this.settdate = this.data.PaymentDate;
          }

          //console.log(this.settdate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          
	        // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.settdate  + 'B'), this.stkdate);
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.Dates.MaturityDate);
          this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          if (this.data.customTenor && this.expshift == 'Custom') {
            this.customTenor = this.data.customTenor
          };
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');



          // this.Dates = this.apifunctions.BBVAGetDates('', '0B', '');
          // if (this.Dates) {
          //   this.todayDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

          // }
          /*
            // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

            this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          
         /*
          this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
          if (this.Dates) {
            this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          //console.log(this.paymentshift);
          // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

          //console.log(this.Dates);
          if (this.Dates) {
            this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
          if (this.Dates) {
            this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

          */

          this.LeverageYN = this.data.LeverageYN;
          if (this.data.LeverageFlag !== undefined) {
            this.LeverageFlag = this.data.LeverageFlag;
          } else if (this.Strike !== '') {
            if (parseFloat(this.Strike) !== 100.00) {
              this.LeverageFlag = true;
            } else {
              this.LeverageFlag = false;
            }
          } else {
            this.LeverageFlag = true;
          }


          if (this.data.downLeverageYN !== undefined) {
            this.downLeverageYN = this.data.downLeverageYN;
          } else {
            if (this.downLeverage === '100.00') {
              this.downLeverageYN = 'No';
            } else {
              this.downLeverageYN = 'Yes';
            }
          }

          //AutocallablePhoenixER fields when load portfolio
          if (this.ProductName === 'AutocallablePhoenixER' || this.ProductName === 'YieldEnhancement' || this.ProductName === 'DiscountCertificate') {
            // changed by Adil || FIN1EURINT-425 || @04-07-2023
            if(this.data.P_name !== undefined){
              if (this.data.Language !== undefined && this.data.Country !== undefined && this.data.Language !== '' && this.data.Country !== '' && this.data.Language !== "undefined" && this.data.Country !== "undefined")  // FIN1EURINT-502 || For updating regulatory information || Added by AdilP
              {
                this.priipsYN = 'Yes';
                this.country = this.data.Country; 
                this.language = this.data.Language; 
              }
              else{
                this.priipsYN = 'No'
                this.country = ''; 
                this.language= '';
              }
            }else{
              if(this.data.priipsYN === 'No'){
                this.priipsYN = 'No'
                this.country = '';
                this.language= '';
              }else{
                this.priipsYN = 'Yes';
                this.country = this.data.country; 
                this.language = this.data.language; 
              }
            }
      
           // this.priipsYN = this.data.priipsYN; // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
            this.format = this.data.FormatDetails;
            this.format = this.data.Wrapper;
            this.SolveForvalue = this.data.SolveFor;
            this.IBPrice = this.data.IBPrice;
            this.issuePrice = this.data.IssuePrice;
            this.ddlNoteCcy = this.data.Ccy;
            this.Notional = this.commonfunctions.formatNotional(this.data.Size);
            // this.quanto = this.data1[0].quanto; // SSSSS -NA
            // this.publicOrPrivate = this.data1[0].publicOrPrivate; // SSSSS
            // this.listed = this.data1[0].listed; // SSSSS 
            // this.stockExchange = this.data1[0].stockExchange; // SSSSS
            // this.priipsYN = this.data.priipsYN; // SSSSS
            // Changed by Amogh K | 5May2022 | country,language keys changed
            
            // this.country = this.data.Country; // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values
            // this.language = this.data.Language; // FIN1EURINT-425 || RFQ Bulk Pricer : Priips Section Default Values

            // this.termsheetType = this.data1[0].termsheetType; // SSSSS
            this.stkshift = ['Forward', 'Fwd'].includes(this.data.ComputedStrikeFixingLag) ? 'Fwd' : '0B';
            // this.stkdate = this.data1[0].stkdate;
            this.paymentshift = ['5', '5B'].includes(this.data.ComputedSettlementPeriodSoftTenor)  ? 'T + 5' : ['10', '10B'].includes(this.data.ComputedSettlementPeriodSoftTenor) ? 'T + 10' : this.data.ComputedSettlementPeriodSoftTenor === '' ? 'Custom' : this.data.ComputedSettlementPeriodSoftTenor;
            // this.settdate = this.data1[0].settdate;
            this.expshift = this.data.ComputedPayoffSoftTenor;
            // this.customTenor = this.data1[0].customTenor;// SSSSS
            this.SettlementMethod = this.data.SettlementMethod;
            this.autocallCouponType = this.data.ERCouponType;
            this.autoFreq = this.data.ERFrequency;
            // this.putableFreq = this.data1[0].putableFreq; // SSSSS
            // this.callableFreq = this.data1[0].callableFreq; // SSSSS
            // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for toggle row || 05-Sep-2023
            this.customBarrierArr = this.data.customBarrier;
            this.autoNonCall = this.data.NonCallPeriod;
            this.autoTrigger = this.data.KOPer;
            this.autoStepDown = this.data.StepDown;
            //this.PutableBarrier = this.data1[0].PutableBarrier; // SSSSS
            this.ERCpnType = this.data.AutocallCouponType;
            this.ERCoupon = this.data.ERCouponPerc;
            this.periodicCouponFlag = this.data.PeriodicCouponYN;
            this.cpnType = this.data.CouponType;
            this.cpnObservation = this.data.CouponObs;
            if (this.data.CouponBarrier !== '' && this.data.CouponBarrier.indexOf('/') < 0) {
              this.data.CouponBarrier = parseFloat(this.data.CouponBarrier).toFixed(2);
            }
            this.cpnTrigger = this.data.CouponBarrier;
            this.cpnFreq = this.data.Frequency;
            // this.cpnCoupon = this.data1[0].cpnCoupon; // SSSSS
            this.cpnInFine = this.data.CouponinFine;
            this.cpnFltRef = this.data.YieldFloatingReference;
            // this.FixingDetermination = this.data.FixingDetermination; // SSSSS
            this.cpnFixing = this.data.FixingDetermination;
            this.cpnCoupon = this.data.CouponPer;
            this.cpnFloor = this.data.Floor_Perc;
            this.cpnCap = this.data.Cap_Perc;
            this.cpnMultiplier = this.data.Multiplier;
            this.rangeAccrualFreq = this.data.RangeAccrualFrequency;
            this.lowCpnBarrier = this.data.LowerCouponBarrier;
            this.upperCpnBarrier = this.data.UpperCouponBarrier;
            this.barrierType = this.data.KIType;
            this.Strike = this.data.Strike;
            this.upperPutStrike = this.data.UpperPutStrike;
            this.lowerPutStrike = this.data.LowerPutStrike;
            this.leverage = this.data.PutGearing;
            this.KIBarrier = this.data.KIBarrier; // doubt to be solve later by suvarna
            this.putSpreadGearing = this.data.PutSpreadGearing;
            this.barrierLevel = this.data.KIPer; // SSSSS 
            // this.ProtectionLevel = this.data1[0].ProtectionLevel; // SSSSS
            this.upsideType = this.data.FinalUpside;
            this.callStrike = this.data.CallStrike;
            this.lowerCallStrike = this.data.LowerCallStrike;
            this.upperCallStrike = this.data.UpperCallStrike;
            this.callGearing = this.data.CallGearing;
            this.callSpreadGearing = this.data.CallSpreadGearing;
      

            if (this.SelectedUnderlyingBasketArray.length > 0) {
              this.quanto = 'No';
	      // HSBCECCLI-10 : Code changes to filter shares for optimization and better performance | 10-Aug-2023
              // const shareCcy = this.shares[this.shares.findIndex((res: { BloombergCode: any; }) => res.BloombergCode = this.SelectedUnderlyingBasketArray[0].BloombergCode)].Ccy;
              const shareCcy = this.SelectedUnderlyingBasketArray[0].Ccy;
              for (let i = 1; i < this.SelectedUnderlyingBasketArray.length; i++) {
                if (shareCcy !== this.SelectedUnderlyingBasketArray[i]['Ccy']) {
                  this.quanto = 'Yes';
                }
              }
            }
            // this.setSolveFor(this.SolveFor) // Added by Amogh K on 16-12-2021
            this.setDefaultSolveForValues(this.SolveForvalue)  // changed by Suvarna P || 08Apr2022 || no need; issue: prices getting clear after toggle || assign b Pranav D
            //Modified field mapping || PriyaL || 02May2022 || issue raised by SakshiG
            this.dailyKOYN = this.data.DailyKOYN;
            this.LeverageYN = this.data.LeverageYN;
            //call function after setting default values || PriyaL || 08Apr2022 || Assigned by Pranav D.

            this.ERCpnTypeChange();
            this.cpnTypeChange();
            this.changeAutoFreqOnTenor();
	          
            // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for toggle row || 05-Sep-2023
            this.autocallfreqbasedonTenor();
            this.autocallfrombasedonFreqnTenor();

            this.setdefaultcpnFreq();
          }

          // Modified code sequence || PriyaL || 11Apr2022 || Assigned by Pranav D.
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // this.onBehalfOf = this.data.onBehalfOf;
          this.onBehalfOf = '';
          if (this.data.sortedAllPrices !== undefined) {
            this.togglesortedAllPrices = this.data.sortedAllPrices;
          }
          if (this.data.rfqID !== undefined) {
            this.rfqID = this.data.rfqID;
          }
          if (this.data.noteMasterID !== undefined) {
            this.noteMasterID = this.data.noteMasterID;
          }
          if (this.data.orderID !== undefined) {
            this.orderID = this.data.orderID;
          }
          if (this.data.timeoutMsg !== undefined) {
            this.timeoutMsg = this.data.timeoutMsg;
          }

          if (this.togglesortedAllPrices.length === 0) {
            if (this.SolveForvalue === 'Strike') {
              this.Strike = '';
            }
            if (this.SolveForvalue === 'Coupon') {
              this.cpnCoupon = '';
            }
            if (this.SolveForvalue === 'IBPrice') {
              this.IBPrice = '';

            }
            if (this.SolveForvalue === 'RebateCoupon') {
              this.autocallCoupon = '';
            }
            if (this.SolveForvalue === 'CouponBarrier') {
              this.cpnTrigger = '';
            }
            if (this.SolveForvalue === 'KI') {
              this.barrierLevel = '';
            }
            if (this.SolveForvalue === 'KO') {
              this.autoTrigger = '';
            }
            if (this.SolveForvalue === 'FundingRate') {
              this.fundRate = '';
            }
          }


          this.data = {};
          // this.apifunctions.toggleFlag.next(false);
        }
        else {


          this.stkshift = '0B';


          this.paymentshift = 'T + 5';
          this.expshift = '1Y';


          this.changeAutoFreqOnTenor();
          this.autocallfreqbasedonTenor();
          this.autocallfrombasedonFreqnTenor();
	        // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for default row || 05-Sep-2023
          this.customBarrier();



          this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
          if (this.Dates) {
            this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          // Modified shifter as per the issue date offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);


          // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);

          // if (this.Dates) {
          //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          //   this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          // }
          // Modified shifter as per the tenor offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
          // FIN1EURINT-263 : Not able to Price when Custom Tenor is selected for Autocallable
          // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);


	        // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
          if (this.paymentshift !== 'Custom') {
            var parseShifter = this.parseShifter(this.paymentshift);
            this.settdate = parseShifter.split('B')[0];
          } else {
            this.settdate = '5';
          }
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.settdate  + 'B'), this.stkdate);
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.Dates.MaturityDate);

          if (this.Dates) {
            this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

          this.IBPrice = '99.50';

          this.SolveForvalue = 'Coupon';
          this.Notional = '1,000,000.00';
          this.Strike = '100.00';
          this.LeverageFlag = false;
          this.LeverageYN = 'Yes'; // Put Spread Gearing Default value change
          // FIN1EURINT-485 || Different price on the same structure via Bulk pricer and Quick pricer
          this.autoTrigger = '102.00';
          this.autoFreq = '3m';
          this.autoStepDown = '0.00';
          this.autoNonCall = '';

          this.MemoryPeriods = '';

          this.cpnObservation = 'PerFreq';
          this.cpnCoupon = '';

          this.fundType = '';
          this.fundFreq = '';
          this.fundRate = '';

          this.altLevel = '';
          this.altObservation = 'PerAnnum';
          this.altCoupon = '';

          this.autocallCoupon = '0.00';

          // this.autocallCouponType = 'Flat';
          this.autocallCouponType = 'Constant Barrier';

          this.issuePrice = '100.00';
          this.sortedAllPrices = [];


          this.fundType = '';
          this.fundFreq = '';
          this.fundRate = '';
          this.upBarrierLevel = '';
          this.upBarrierType = 'None';
          this.downBarrierType = 'None';
          this.downBarrierLevel = '';
          this.issuePrice = '100.00';
          this.upUpperStrike = '110.00';
          this.upRebate = '';
          this.upCoupon = '';
          this.downLeverageYN = 'No';


          // AutocallablePhoenixER default fields to be added

          if (this.ProductName === 'AutocallablePhoenixER' || this.ProductName === 'YieldEnhancement' || this.ProductName === 'DiscountCertificate') {
            //this.IBPrice = '99.50'; // Modified default value on load || PriyaL || 08Apr2022 || Assigned by PranavD
             this.IBPrice = ''; // Modified by AdilP || FIN1EURINT-462 || 19-06-2023
            this.ddlNoteCcy = 'EUR';

            this.SolveForvalue = 'IBPrice'; // prev. default
            // this.SolveForvalue = 'Coupon';
            this.shares = this.apifunctions.shares;

            this.Notional = '1,000,000.00';
            this.Strike = '100.00';
            this.LeverageFlag = false;
            this.LeverageYN = 'Yes'; // Put Spread Gearing Default value change
            // FIN1EURINT-485 || Different price on the same structure via Bulk pricer and Quick pricer
            this.autoTrigger = '102.00';
            this.autoFreq = 'Monthly';
            this.autoStepDown = '';
            this.autoNonCall = 'M1';
            // this.cpnType = 'Conditional with Memory';
            this.cpnType = 'Fixed Unconditional';
            // this.cpnTrigger = '70.00';
            this.cpnTrigger = '';

            this.cpnFreq = 'Monthly';
            // this.cpnObservation = 'European (Last day of the Month)';
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
              this.setdefaultvalues();
              //call function after setting default values || PriyaL || 08Apr2022 || Assigned by Pranav D.
              this.setDefaultSolveForValues(this.SolveForvalue);
              this.ERCpnTypeChange();

              this.cpnTypeChange();

              this.changeAutoFreqOnTenor();
              this.autocallCouponTypeChange();

              this.setdefaultcpnFreq();
              this.defaultValueFlag = false;

            }

          }
        }
        this.loadflag = false;
        this.pageloadflag=false;

        ///////////// Default and CLone Data End

        // Clone functions start
        this.cloneDataSubscription = this.apifunctions.cloneData1Obs.subscribe(data => {
          if (data === 'Add') {
            this.addValue = data;
          }
        });
        if (this.addValue === 'Add' || this.data1 === 'Add') {

        } else {
          // FIN1EURINT-505 : Bulk Pricer - Underlying Section to populate properly on clone and toggle
          this.pageloadflag=true;
          // cleared basket to resolve wrong currency selected issue on clone action || PriyaL || 04Apr2022 || assigned by PranavD
          this.ShareBasket = [];
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];

          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.data1[0].ShareBasket.length; i++) {
            // FIN1EURINT-117 || Multi Pricer - RFQ ID generated even though message shown unable to generate
            // FIN1EURINT-565 : Use single pricer share search pipe for Multipricer share search
	          await this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares,  this.data1[0].ShareBasket[i].Code)[0]);
      	    // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on enter and click action
          }


          this.SolveForvalue = this.data1[0].SolveForvalue;
          this.creditSolveFor = this.data1[0].creditSolveFor;
          this.format = this.data1[0].format;
          this.IBPrice = this.commonfunctions.formatAmt(this.data1[0].IBPrice);
          this.stkshift = this.data1[0].stkshift;
          this.paymentshift = this.data1[0].paymentshift;
          this.expshift = this.data1[0].expshift;

          this.changeAutoFreqOnTenor();

          this.ddlNoteCcy = this.data1[0].ddlNoteCcy;
          this.Notional = this.commonfunctions.formatNotional(this.data1[0].Notional);
          this.expdate = this.data1[0].expdate;
          this.settdate = this.data1[0].settdate;
          this.Strike = this.data1[0].Strike;
          this.stkdate = this.data1[0].stkdate;
          this.barrierType = this.data1[0].barrierType;

          this.issueDate = this.data1[0].issueDate;

          this.barrierLevel = this.commonfunctions.formatAmt(this.data1[0].barrierLevel);
          this.autoFreq = this.data1[0].autoFreq;
          this.autoTrigger = this.data1[0].autoTrigger;

          this.autoStepDown = this.commonfunctions.formatAmt(this.data1[0].autoStepDown);
          this.autoNonCall = this.data1[0].autoNonCall;
          // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for clone row || 04-Sep-2023
          this.customBarrierArr = [];
          this.data1[0].customBarrier.forEach(element => {
            let clone = {}; 
            for (let key in element) {
              clone[key] = element[key];
            }
            this.customBarrierArr.push(clone);
          });
          //FIN1EURINT-608 : RFQ Bulk Pricer - Change in custom barrier values of the child row changes the custom barrier values of parent row (Clone Issue) | 11-Sep-2023
          // this.customBarrierArr = this.data1[0].customBarrier;
          this.autocallCouponType = this.data1[0].autocallCouponType;
          this.autocallCoupon = this.commonfunctions.formatAmt(this.data1[0].autocallCoupon);
          this.cpnTrigger = this.data1[0].cpnTrigger;
          this.cpnFreq = this.data1[0].cpnFreq;
          this.cpnCoupon = this.commonfunctions.formatAmt(this.data1[0].cpnCoupon);
          this.cpnObservation = this.data1[0].cpnObservation;
          this.cpnType = this.data1[0].cpnType;
          this.MemoryPeriods = this.data1[0].MemoryPeriods;
          this.altCoupon = this.commonfunctions.formatAmt(this.data1[0].altCoupon);
          this.altObservation = this.data1[0].altObservation;
          this.fundType = this.data1[0].fundType;
          this.fundFreq = this.data1[0].fundFreq;
          this.fundRate = this.data1[0].fundRate; //this.commonfunctions.formatAmt(this.data1[0].fundRate);



          this.issuePrice = this.data1[0].issuePrice;

          this.LeverageYN = this.data1[0].LeverageYN;
          this.downLeverageYN = this.data1[0].downLeverageYN;

          if (this.Strike !== '') {
            if (parseFloat(this.Strike) !== 100.00) {
              this.LeverageFlag = true;
            } else {
              this.LeverageFlag = false;
            }
          } else {
            this.LeverageFlag = true;
          }


          if (this.ProductName === 'AutocallablePhoenixER' || this.ProductName === 'YieldEnhancement' || this.ProductName === 'DiscountCertificate') {
            this.format = this.data1[0].format;
            this.SolveForvalue = this.data1[0].SolveForvalue;
            this.IBPrice = this.data1[0].IBPrice;
            this.issuePrice = this.data1[0].issuePrice;
            this.ddlNoteCcy = this.data1[0].ddlNoteCcy;
            this.Notional = this.data1[0].Notional;
            this.quanto = this.data1[0].quanto;
            this.publicOrPrivate = this.data1[0].publicOrPrivate;
            this.listed = this.data1[0].listed;
            this.stockExchange = this.data1[0].stockExchange;
            this.priipsYN = this.data1[0].priipsYN;
            this.country = this.data1[0].country;
            this.language = this.data1[0].language;
            this.termsheetType = this.data1[0].termsheetType;
            this.stkshift = this.data1[0].stkshift;
            this.stkdate = this.data1[0].stkdate;
            this.paymentshift = this.data1[0].paymentshift;
            this.settdate = this.data1[0].settdate;
            this.expshift = this.data1[0].expshift;
            this.customTenor = this.data1[0].customTenor;
            this.SettlementMethod = this.data1[0].SettlementMethod;
            this.autocallCouponType = this.data1[0].autocallCouponType;
            this.autoFreq = this.data1[0].autoFreq;
            this.putableFreq = this.data1[0].putableFreq;
            this.callableFreq = this.data1[0].callableFreq;
            this.autoNonCall = this.data1[0].autoNonCall;
            this.autoTrigger = this.data1[0].autoTrigger;
            this.PutableBarrier = this.data1[0].PutableBarrier;
            this.autoStepDown = this.data1[0].autoStepDown;
            this.ERCpnType = this.data1[0].ERCpnType;
            this.ERCoupon = this.data1[0].ERCoupon;
            this.periodicCouponFlag = this.data1[0].periodicCouponFlag;
            this.cpnType = this.data1[0].cpnType;
            this.cpnObservation = this.data1[0].cpnObservation;
            this.cpnTrigger = this.data1[0].cpnTrigger;
            this.cpnFreq = this.data1[0].cpnFreq;
            this.cpnCoupon = this.data1[0].cpnCoupon;
            this.cpnInFine = this.data1[0].cpnInFine;
            this.cpnFltRef = this.data1[0].cpnFltRef;
            this.cpnFixing = this.data1[0].cpnFixing;
            this.cpnCoupon = this.data1[0].cpnCoupon;
            this.cpnFloor = this.data1[0].cpnFloor;
            this.cpnCap = this.data1[0].cpnCap;
            this.cpnMultiplier = this.data1[0].cpnMultiplier;
            this.rangeAccrualFreq = this.data1[0].rangeAccrualFreq;
            this.lowCpnBarrier = this.data1[0].lowCpnBarrier;
            this.upperCpnBarrier = this.data1[0].upperCpnBarrier;
            this.barrierType = this.data1[0].barrierType;
            this.Strike = this.data1[0].Strike;
            this.upperPutStrike = this.data1[0].upperPutStrike;
            this.lowerPutStrike = this.data1[0].lowerPutStrike;
            this.leverage = this.data1[0].leverage;
            this.putSpreadGearing = this.data1[0].putSpreadGearing;
            this.barrierLevel = this.data1[0].barrierLevel;
            this.ProtectionLevel = this.data1[0].ProtectionLevel;
            this.upsideType = this.data1[0].upsideType;
            this.callStrike = this.data1[0].callStrike;
            this.lowerCallStrike = this.data1[0].lowerCallStrike;
            this.upperCallStrike = this.data1[0].upperCallStrike;
            this.callGearing = this.data1[0].callGearing;
            this.callSpreadGearing = this.data1[0].callSpreadGearing;
            this.LeverageYN = this.data1[0].LeverageYN;
            this.dailyKOYN = this.data1[0].dailyKOYN;
          }
          // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for clone row || 04-Sep-2023
          this.autocallfrombasedonFreqnTenor();
          
          this.setSolveFor(this.data1[0].SolveForvalue);
          this.apifunctions.cloneData1.next('Add');
          this.apifunctions.cloneFlag1.next(false);
          // FIN1EURINT-505 : Bulk Pricer - Underlying Section to populate properly on clone and toggle
          this.pageloadflag=false;
        }

        this.cloneFlagSubscription = this.apifunctions.cloneFlag1Obs.subscribe(flag => {        // Suvarna's code
          this.apifunctions.multiPhoenixArrObserver.subscribe(length => {
            this.length1 = length;
            if (flag) {
              this.multiPhoenixArr1 = [];

              if (this.length1 - 1 === this.ComponentIndex) {
                this.multiPhoenixArr1.push({
                  ShareBasket: this.ShareBasket,
                  expdate: this.expdate,
                  autocallCoupon: this.autocallCoupon,
                  MemoryPeriods: this.MemoryPeriods,
                  altCoupon: this.altCoupon,
                  altObservation: this.altObservation,
                  fundType: this.fundType,
                  fundFreq: this.fundFreq,
                  fundRate: this.fundRate,
                  Attach: this.Attach,
                  AttachVal: this.AttachVal,
                  Detach: this.Detach,
                  DetachVal: this.DetachVal,
                  creditcouponBasis: this.creditcouponBasis,
                  creditSpread: this.creditSpread,
                  creditcouponFreq: this.creditcouponFreq,
                  floatingRef: this.floatingRef,
                  creditReofferPrice: this.creditReofferPrice,
                  indexTranche: this.indexTranche,
                  creditTenor: this.creditTenor,
                  creditcouponType: this.creditcouponType,
                  creditIssuePrice: this.creditIssuePrice,
                  toggleFlag: this.toggleFlag,

                  // issuePrice: this.issuePrice, duplicate for AutocallablePhoenixER
                  LeverageYN: this.LeverageYN,
                  downLeverageYN: this.downLeverageYN,


                  // AutocallablePhoenixER fields to be added
                  format: this.format,
                  SolveForvalue: this.SolveForvalue,
                  IBPrice: this.IBPrice,
                  issuePrice: this.issuePrice,
                  ddlNoteCcy: this.ddlNoteCcy,
                  Notional: this.Notional,
                  quanto: this.quanto,
                  publicOrPrivate: this.publicOrPrivate,
                  listed: this.listed,
                  stockExchange: this.stockExchange,
                  priipsYN: this.priipsYN,
                  country: this.country,
                  language: this.language,
                  termsheetType: this.termsheetType,
                  stkshift: this.stkshift,
                  stkdate: this.stkdate,
                  paymentshift: this.paymentshift,
                  settdate: this.settdate,
                  expshift: this.expshift,
                  customTenor: this.customTenor,
                  SettlementMethod: this.SettlementMethod,
                  autocallCouponType: this.autocallCouponType,
                  autoFreq: this.autoFreq,
                  putableFreq: this.putableFreq,
                  callableFreq: this.callableFreq,
                  autoNonCall: this.autoNonCall,
                  autoTrigger: this.autoTrigger,
                  customBarrier: this.customBarrierArr, // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for clone row || 04-Sep-2023
                  PutableBarrier: this.PutableBarrier,
                  autoStepDown: this.autoStepDown,
                  ERCpnType: this.ERCpnType,
                  ERCoupon: this.ERCoupon,
                  periodicCouponFlag: this.periodicCouponFlag,
                  cpnType: this.cpnType,
                  cpnObservation: this.cpnObservation,
                  cpnTrigger: this.cpnTrigger,
                  cpnFreq: this.cpnFreq,
                  cpnCoupon: this.cpnCoupon,
                  cpnInFine: this.cpnInFine,
                  cpnFltRef: this.cpnFltRef,
                  cpnFixing: this.cpnFixing,
                  // cpnCoupon : this.cpnCoupon,
                  cpnFloor: this.cpnFloor,
                  cpnCap: this.cpnCap,
                  cpnMultiplier: this.cpnMultiplier,
                  rangeAccrualFreq: this.rangeAccrualFreq,
                  lowCpnBarrier: this.lowCpnBarrier,
                  upperCpnBarrier: this.upperCpnBarrier,
                  barrierType: this.barrierType,
                  Strike: this.Strike,
                  upperPutStrike: this.upperPutStrike,
                  lowerPutStrike: this.lowerPutStrike,
                  leverage: this.leverage,
                  putSpreadGearing: this.putSpreadGearing,
                  barrierLevel: this.barrierLevel,
                  ProtectionLevel: this.ProtectionLevel,
                  upsideType: this.upsideType,
                  callStrike: this.callStrike,
                  lowerCallStrike: this.lowerCallStrike,
                  upperCallStrike: this.upperCallStrike,
                  callGearing: this.callGearing,
                  callSpreadGearing: this.callSpreadGearing,
                  dailyKOYN: this.dailyKOYN
                });

                this.apifunctions.cloneData1.next(this.multiPhoenixArr1);
              }
            }
          });
        });


        // Clone functions End

        // toggle flag subscription
        this.toggleFlagSubscription = this.apifunctions.toggleFlagObs.subscribe(flag => {

          if (flag) {
            this.toggleDataArr = {};
            this.toggleDataArr = {
              ComponentIndex: this.ComponentIndex,
              CompnonentName: 'Horizontal',
              AltCouponObservation: this.altObservation,
              AltCouponPer: this.altCoupon,
              AttachPer: this.Attach,
              AttachValue: ((this.AttachVal === 'NaN' || this.AttachVal === '') ? '' : this.AttachVal),
              CouponBasis: this.creditcouponBasis,
              CouponSpread: this.creditSpread,
              DownsideCapitalProtectionPercent: this.capitalGuaranteed,
              DownsideParticipationCapPercent: this.downLowerStrike,
              DownsideParticipationPercent: this.downLeverage,
              ERCouponPer: this.autocallCoupon,
              ExpiryDate: this.expdate,
              FloatingRef: this.floatingRef,
              FundingFrequency: this.fundFreq,
              FundingType: this.fundType,
              GuaranteedCoupon: this.guaranteedCoupon,
              IndexCode: this.indexTranche,
              IndexRateSpread: this.fundRate,
              InitialInputKIBarrierPercent: this.downBarrierLevel,
              InitialInputKOBarrierPercent: this.upBarrierLevel,
              InputDownsideStrikePercent: this.downStrike,
              InputKIBarrierFrequency: this.downBarrierType,
              InputKOBarrierFrequency: this.upBarrierType,
              InputMinimumCouponPercentPA: this.upCoupon,
              InputRebatePercent: this.upRebate,
              InputStrikePercent: this.upStrike,
              IssueDate: this.issueDate,
              MemoryPds: this.MemoryPeriods,
              priipsYN: this.priipsYN,
              country: this.country,
              language: this.language,
              PaymentDate: this.settdate,
              ReofferPrice: this.creditReofferPrice,
	            // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
              ShareBBGRIC1: ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0]),
              ShareBBGRIC2: ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1]),
              ShareBBGRIC3: ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2]),
              ShareBBGRIC4: ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3]),
              ShareBBGRIC5: ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4]),
              ShareBBGRIC6: ((this.ShareBasket[5] === undefined) ? '' : this.ShareBasket[5]),
	            // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
              StrikeDate: this.stkdate,
              SubTemplate: this.ProductName,
              TenorPer: this.creditTenor,
              UpsideParticipationCapPercent: this.upUpperStrike,
              UpsideParticipationPercent: this.upGearing,
              // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
              // onBehalfOf: this.onBehalfOf,
              onBehalfOf: '',
              ProductType: this.participationType,
              LeverageYN: this.LeverageYN,
              LeverageFlag: this.LeverageFlag,
              rfqID: this.rfqID,
              noteMasterID: '', //this.noteMasterID, //commented to reset prices on layout toggle || FIN1EURINT-506 || KaustubhS || 28-Jun-2023
              orderID: this.orderID,
              sortedAllPrices: (this.sortedAllPrices.length > 0) ? this.sortedAllPrices : this.togglesortedAllPrices,
              timeoutMsg: this.timeoutMsg,
              downLeverageYN: this.downLeverageYN,
              Guarantee: this.accuGuarantee,
              SharesQuantity: this.noOfShares,
              TotalNotional: this.estimatedNotional,
              Upfront: this.accuUpfront,

              // ER Autocallable toggle fields to be added
              FormatDetails: this.format,
              Wrapper: this.format,
              SolveFor: this.SolveForvalue,
              IBPrice: this.IBPrice,
              IssuePrice: this.issuePrice,
              Ccy: this.ddlNoteCcy,
              Size: this.Notional,
              // this. = this.quanto.quanto; // SSSSS -NA
              // this. = this.publicOrPrivate; // SSSSS
              // this. = this.listed; // SSSSS 
              // this. = this.stockExchange; // SSSSS
              // this. = this.priipsYN; // SSSSS
              // this. = this.country; // SSSSS
              // this. = this.language; // SSSSS
              termsheetType : this.termsheetType, // FIN1EURINT-456 || Termsheet Value update from toggle data
              ComputedStrikeFixingLag: this.stkshift,
              // this. = this.stkdate;
              ComputedSettlementPeriodSoftTenor: this.paymentshift,
              // this. = this.settdate;
              ComputedPayoffSoftTenor: this.expshift,
              customTenor: this.customTenor,
              // this. = this.customTenor;// SSSSS
              // this. = this.SettlementMethod; // SSSSS
              ERCouponType: this.autocallCouponType,
              ERFrequency: this.autoFreq,
              // this. = this.putableFreq; // SSSSS
              // this. = this.callableFreq; // SSSSS
              NonCallPeriod: this.autoNonCall,
              customBarrier: this.customBarrierArr, // HSBCECCLI-56 : Bulk Pricer - Custom Autocall changes for toggle row || 05-Sep-2023
              KOPer: this.autoTrigger,
              // this. = this.PutableBarrier; // SSSSS
              StepDown: this.autoStepDown,
              AutocallCouponType: this.ERCpnType,
              ERCouponPerc: this.ERCoupon,
              PeriodicCouponYN: this.periodicCouponFlag,
              CouponType: this.cpnType,
              CouponObs: this.cpnObservation,
              CouponBarrier: this.cpnTrigger,
              Frequency: this.cpnFreq,
              // this. = this.cpnCoupon; // SSSSS
              CouponinFine: this.cpnInFine,
              YieldFloatingReference: this.cpnFltRef,
              // this. = this.FixingDetermination; // SSSSS
              FixingDetermination: this.cpnFixing,
              CouponPer: this.cpnCoupon,
              Floor_Perc: this.cpnFloor,
              Cap_Perc: this.cpnCap,
              Multiplier: this.cpnMultiplier,
              RangeAccrualFrequency: this.rangeAccrualFreq,
              LowerCouponBarrier: this.lowCpnBarrier,
              UpperCouponBarrier: this.upperCpnBarrier,
              KIType: this.barrierType,
              Strike: this.Strike,
              UpperPutStrike: this.upperPutStrike,
              LowerPutStrike: this.lowerPutStrike,
              PutGearing: this.leverage,
              KIBarrier: this.KIBarrier, // doubt to be solve later by suvarna
              PutSpreadGearing: this.putSpreadGearing,
              KIPer: this.barrierLevel, // SSSSS 
              // this. = this.ProtectionLevel; // SSSSS
              FinalUpside: this.upsideType,
              CallStrike: this.callStrike,
              LowerCallStrike: this.lowerCallStrike,
              UpperCallStrike: this.upperCallStrike,
              CallGearing: this.callGearing,
              CallSpreadGearing: this.callSpreadGearing,
              dailyKOYN: this.dailyKOYN,
              SettlementMethod: this.SettlementMethod

            };

            // this.apifunctions.toggleFlag.next(true);
            this.apifunctions.toggleData.next(this.toggleDataArr);
          }


        });

      });

      this.schedulePriceSubscription = this.apifunctions.schedulePriceFlagCheck.subscribe(res => {
        if (res !== undefined && res['Date'] !== undefined) {
          this.inputDate = res['Date'];
          this.inputTime = res['Time'];
          this.scheduleSend();
        }
      });

      this.schedulePopupSubscription = this.apifunctions.schedulePopupFlagObs.subscribe(async flag => {
        if (flag) {
          await this.validationOnButton_ER();

        }
      });

    } catch (error) {
      //console.log('Error:', error);
    }
  }


  setSolveFor(e: any) {
    try {
      this.ERReset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
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
    } catch (error) { }
  }

  setDefaultSolveForValues(solveFor: string) {
    try {
      // if (this.Strike === '' && solveFor !== 'Strike') {
      //   this.Strike = '100.00';
      //   this.LeverageFlag = false;
      //   this.LeverageYN = 'No';
      // }

      if (this.cpnCoupon === '' && solveFor !== 'Coupon' && this.format !== 'Option' && this.cpnType !== 'No Coupon') {
        this.cpnCoupon = '5.00';
      }

      if (this.IBPrice === '' && solveFor !== 'IBPrice' && solveFor !== 'Upfront') {
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '0.00';
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

      if (this.ERCoupon === '' && solveFor !== 'ERCoupon' && this.ERCpnType !== 'None') {
        this.ERCoupon = '5.00';
      }

      if (this.lowCpnBarrier === '' && solveFor !== 'LowerCouponBarrier') {
        this.lowCpnBarrier = '100.00';
      }

      if (this.upperCpnBarrier === '' && solveFor !== 'UpperCouponBarrier') {
        this.upperCpnBarrier = '100.00';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
  //   Exchangename: string, ISINname: string, Last1yearHighValue: string,
  //   Last1yearLowValue: string, Spot: string, RiskRating: any) {
  setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
    Exchangename: string, ISINname: string, Last1yearHighValue: string,
    Last1yearLowValue: string, Spot: string, RiskRating: any, RICCode: any) {
    try {
      this.SelectedUnderlyingarray.push({ LongName, Ccy, BloombergCode: Code, ExchangeCode, Exchangename });
      this.SelectedUnderlyingBasketArray.push({
        LongName, Ccy, BloombergCode: Code, ExchangeCode, Exchangename,
        ISINName: ISINname, Last1yearHighValue, Last1yearLowValue, Spot, Riskrating: RiskRating, Code: RICCode
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
      //console.log('Error:', error);
    }
  }

  ChangeIndex(_e: any) {
    try {
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async selectShare(e: any) {
    try {
      this.flag = false;
      if ($('.HoverSuggestion').data('share') !== undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      if (this.shareCode !== undefined && this.shareCode !== '') {
        // FIN1EURINT-565 : Use single pricer share search pipe for Multipricer share search
        await this.showUnderlying(e, SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  backKeyPress(_e: any) {
    try {
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

  async showUnderlying(_event: string, item: { BloombergCode: any; Ccy: any; LongName: any; ExchangeCode?: any; Code?: any; ExchangeName?: any; }) {
    try {
      // default flag check || PriyaL || 08Apr2022 || Assigned by Pranav D.
      if (!this.defaultValueFlag) {
        this.ERReset();
      }



      this.errorMsgChanged.emit('');
      this.enableToggle();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.ShareName = '';

      // HSBCECCLI-19 : Limit total number of underlyings to 4 in Bulk Pricer | 08-Aug-2023
      if (this.ShareBasket.length < 4) {
        if (this.ShareBasket.find(i => i.BloombergCode === item.BloombergCode) === undefined) {
          this.ShareBasket.push({ BloombergCode: item.BloombergCode, Ccy: item.Ccy, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, Code: item.Code });
          this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
            item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);

        } else {
          return false;
        }
      }
      if (this.ShareBasket.length < 1) {
        if (this.ShareBasket.find(i => i.BloombergCode === item.BloombergCode) === undefined) {
          this.ShareBasket.push({ BloombergCode: item.BloombergCode, Ccy: item.Ccy, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, Code: item.Code });
          this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode, item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);
        } else {
          return false;
        }
        this.shareCode = item.Code;
        this.exchngCode = item.ExchangeCode;
      }
      if (this.ShareBasket.length > 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.remove('underlyingError');
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('longText');
      }

      if (this.ShareBasket.length === 4) {
      }
      if (this.ShareBasket.length === 1) {
        //console.log(this.ddlNoteCcy, this.UnderlyingCurrency)
        this.ddlNoteCcy = item.Ccy;
        this.UnderlyingCurrency = item.Ccy;
      }
      this.ddlNoteCcy = item.Ccy;
      //console.log(this.ddlNoteCcy, this.UnderlyingCurrency)
      if (this.UnderlyingCurrency !== this.ddlNoteCcy) {
        this.quanto = "Yes";
      } else {
        this.quanto = "No";
      }

      await this.txtTenorDateChange('Payment');
      // Changes done by Pranav D 

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
      this.upsideTypeChange()

    } catch (error) {
      //console.log('Error:', error);
    }
  }


  async ERPrice() {
    try {
      
      await this.validationOnButton_ER();
      if (this.ErrorMsg === '') {
        this.ERReset();
        this.loadflag = true;
        this.pageloadflag=false;
        await this.ERPrice1();
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // renamed function to keep backup of old mappings || PriyaL || 06Apr2022 || Assigned by PranavD
  async generateXMLEROld() {
    try {

      //console.log(this.templateMappingArr);
      const d:any = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, ((this.expshift === 'Custom' ? this.customTenor : this.expshift) + '').toUpperCase(), this.stkdate);
      const fixdate = this.commonfunctions.formatDate(d.MaturityDate);

      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              // + "Autocallable" 
              + "AutocallablePhoenixER"
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
              + (this.paymentshift === 'Custom' ? (this.settdate) : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + this.apifunctions.userGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            //   break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.apifunctions.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LeverageYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.LeverageYN + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.userID
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
              + this.customTenor
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

  // Added new mappings || PriyaL || 07Apr2022 || Assigned by PranavD
  async generateXMLER() {
    try {

      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
        const setIssueDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        let xmlstr : string = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Product':
            xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ProductName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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

            case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(setIssueDate.MaturityDate, 'dd-MMM-yyyy')
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
              + (this.paymentshift === 'Custom' ? (this.settdate) : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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

	    // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
            case 'autoTrigger':
              let customBarrier = '';
              if (this.customBarrierArr.length > 0) {
                this.customBarrierArr.forEach((t) => {
                  if (t.OutTrigger != '-' && t.firstAutocall !== true) {
                    customBarrier += '/' + t.OutTrigger;
                  }
                });
              }
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.autoTrigger + customBarrier + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
              + this.apifunctions.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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

            case 'Underlying1': 
              // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].BloombergCode === undefined ? '' : this.ShareBasket[0].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].Exchange === undefined ? '' : this.ShareBasket[0].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying2': 
            // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.  
            xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].BloombergCode === undefined ? '' : this.ShareBasket[1].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IX2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].Exchange === undefined ? '' : this.ShareBasket[1].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying3': 
              // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2] === undefined || this.ShareBasket[2].BloombergCode === undefined ? '' : this.ShareBasket[2].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Underlying4': 
              // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3] === undefined || this.ShareBasket[3].BloombergCode === undefined ? '' : this.ShareBasket[3].BloombergCode)
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
            case 'Underlying5': 
              // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].BloombergCode === undefined ? '' : this.ShareBasket[4].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'IX5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].Exchange === undefined ? '' : this.ShareBasket[4].Exchange)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

              case 'LN1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[0] === undefined || this.ShareBasket[0].LongName === undefined ? '' : this.commonfunctions.formatXMLString(this.ShareBasket[0].LongName))//changed by Amogh K | 25 Aug 2022 | EUJARINT-511 added &amp for &
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[1] === undefined || this.ShareBasket[1].LongName === undefined ? '' : this.commonfunctions.formatXMLString(this.ShareBasket[1].LongName))//changed by Amogh K | 25 Aug 2022 | EUJARINT-511 added &amp for &
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[2] === undefined || this.ShareBasket[2].LongName === undefined ? '' : this.commonfunctions.formatXMLString(this.ShareBasket[2].LongName))//changed by Amogh K | 25 Aug 2022 | EUJARINT-511 added &amp for &
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[3] === undefined || this.ShareBasket[3].LongName === undefined ? '' : this.commonfunctions.formatXMLString(this.ShareBasket[3].LongName))//changed by Amogh K | 25 Aug 2022 | EUJARINT-511 added &amp for &
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LN5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.ShareBasket[4] === undefined || this.ShareBasket[4].LongName === undefined ? '' : this.commonfunctions.formatXMLString(this.ShareBasket[4].LongName))//changed by Amogh K | 25 Aug 2022 | EUJARINT-511 added &amp for &
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

  async ERPrice1() {
    try {
      
      //const userGroupID = this.apifunctions.userGroup;
      let xmlstr : string = await this.generateXMLER();
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'YieldEnhancement',
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.SolveForvalue,
        loginID: AppConfig.settings.oRes.userID,
        userGroupID: AppConfig.settings.oRes.groupID, // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        noteMasterID: "0", // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
        repricereqYN: "N" // FIN1EURINT-283 || Single pricer vs Multi price difference in Quote Request values.
      }];

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data.errorMessage !== '') {
          that.ErrorMsg = data.errorMessage.split('. ')[0];
          that.errorMsgChanged.emit(that.ErrorMsg);
          that.loadflag = false;
          that.timeLeft = 0;
          clearInterval(that.priceTimerInterval);
          return false;
        }
        that.rfqID = data.rfqid;
        that.noteMasterID = data.noteMasterID;
        if (!that.clearFlag) {
          that.Prices = [];
          that.timeLeft = Number(that.defaultTimeout);
          that.startCountDown(that.defaultTimeout, that.ComponentIndex);
          that.PPDetails = that.rfqID;
          if (that.PPDetails !== '') {
            that.rfqArr.push(that.PPDetails);
            let quoteResponseCheck = false;
            that.interval = setInterval(async () => {
              if (that.timeLeft > 0) {
                that.timeoutMsg = '';
                
                if (!quoteResponseCheck) {
                  quoteResponseCheck = await that.ERPriceResponse(that.PPDetails, that.ComponentIndex);
                }
                that.timeLeft = Number(that.timeLeft) - 5;
              } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                that.loadflag = false;
                // that.timeoutMsg = 'Timeout';
                clearInterval(that.interval);
                that.enableToggle();
                // tslint:disable-next-line: max-line-length
                // that.ErrorMsg = 'Price response is taking longer than expected hence price will not display on this screen. \nInstead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section and by email.';
                // that.errorMsgChanged.emit(that.ErrorMsg);
              }
            }, 5000);
          }
        }
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // tslint:disable-next-line: variable-name
  async ERPriceResponse(PPDetails: any, _ComponentIndex: number) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Quote/CheckIfResponseReceived';
      const parameters = {
        QuoteRequestID: PPDetails
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
   
          if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiReceivedPrices(this.Prices, _ComponentIndex);
          let invalidDataLength = data.filter((lp: { status: string; }) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
          if (invalidDataLength > 0) {
            this.loadflag = false;
            return false;
          }
          else {
            return true;
          }
        }
        else {
          return false;
        }
      });
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
      this.ERReset();
      if (this.ShareBasket.length < 2) {
        this.upsideType = 'None';
        this.upsideTypeChange();
      }
      if (this.upsideType !== '' && this.upsideType !== 'None') {
        this.SolveForvalue = 'IBPrice';
      }
      this.enableToggle();
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }

  }

  IBPricechange_new() {
    try {
      // this.reset();
      this.ERReset();
      this.enableToggle();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  PriceValidation(e: any, Pricestr: string) {

    try {
      this.ERReset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      target.classList.remove('error');

      switch (Pricestr) {
        case 'Strike':

          if (parseFloat(target.value) <= parseFloat(this.minStrike)) {
            this.ErrorMsg = 'Strike should be greater than ' + this.minStrike + '%.';
            target.classList.add('error');
          }
          // HSBCECCLI-23 : Add validation - Put Strike can not be less than KI | 08-Aug-2023
          if (parseFloat(this.Strike) < parseFloat(this.barrierLevel)) {
            this.ErrorMsg = 'Put Strike should be greater than KI Barrier Level';
            target.classList.add('error');
          }
          break;

        case 'CouponTrigger':
          if (target.value === '') {
            this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
            target.classList.add('error');
          } else if (target.value.indexOf('/') < 0) {
            if (parseFloat(target.value) <= parseFloat(this.minCoupon) || parseFloat(target.value) >= parseFloat(this.maxCoupon)) {
              this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
              target.classList.add('error');
            }
            target.value = parseFloat(target.value).toFixed(2);
          } else {
            const cpnArr = target.value.split('/');
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < cpnArr.length; i++) {
              if (parseFloat(cpnArr[i]) <= parseFloat(this.minCoupon) || parseFloat(cpnArr[i]) >= parseFloat(this.maxCoupon)) {
                this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
                target.classList.add('error');
              }
            }
          }
          break;

        case 'BarrierLevel':

          if (parseFloat(target.value) <= parseFloat(this.minBarrier)) {
            this.ErrorMsg = 'Barrier level should be greater than ' + this.minBarrier + '%.';
            target.classList.add('error');
          }
          break;

        case 'Stepdown':

          if (parseFloat(target.value) <= parseFloat(this.minStepdown)) {
            this.ErrorMsg = 'Stepdown should be greater than ' + this.minStepdown + '%.';
            target.classList.add('error');
          }
          break;

        case 'AutoTrigger':

          if (target.value === '') {
            this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            target.classList.add('error');
          } else if (this.autoStepDown === '') {
            if (target.value.indexOf('/') < 0) {
              if (parseFloat(target.value) <= parseFloat(this.minTrigger) || parseFloat(target.value) >= parseFloat(this.maxTrigger)) {
                this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                target.classList.add('error');
              }
              target.value = parseFloat(target.value).toFixed(2);
              break;
            }
          }

          break;

        // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
	        case 'customBarrier':

          if (target.value === '') {
            this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            target.classList.add('error');
          } else if (this.autoStepDown === '') {
            if (target.value.indexOf('/') < 0) {
              if (parseFloat(target.value) <= parseFloat(this.minTrigger) || parseFloat(target.value) >= parseFloat(this.maxTrigger)) {
                this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                target.classList.add('error');
              }
              target.value = parseFloat(target.value).toFixed(2);
              break;
            }
          }

          break;

      }
      // if (this.ErrorMsg !== '') {
      this.errorMsgChanged.emit(this.ErrorMsg);
      // }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // HSBCECCLI-21 : Add validation for AC Coupon ( % ) and Coupon p.a. - Zero coupons should not be allowed | 09-Aug-2023
  cpnValidation(e: any) {
    try {
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      target.classList.remove('error');
      if (parseFloat(target.value) === parseFloat('0')) {
        this.ErrorMsg = 'Please enter a non-zero Coupon';
        target.classList.add('error');
      }
      this.errorMsgChanged.emit(this.ErrorMsg);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // HSBCECCLI-21 : Add validation for AC Coupon ( % ) and Coupon p.a. - Zero coupons should not be allowed | 09-Aug-2023

  altCouponFlagChange() {
    try {
      this.ERReset();
      this.enableToggle();
      if (this.altcouponFlag === 'Yes') {
        this.altLevel = '0.00';
        this.altObservation = '';
        this.altCoupon = '0.00';
      } else {
        this.altLevel = '';
        this.altObservation = '';
        this.altCoupon = '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  cpnTypeChange() {
    try {
      this.ERReset();
      this.enableToggle();
      this.cpnObservation = '';
      //this.cpnTrigger = '';
      this.cpnFreq = '';
      // FIN1EURINT-186 || Multi Pricer - changing between horizontal and vertical layouts resets fields to default values
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

      if (this.SolveForvalue !== 'Coupon') {
        // FIN1EURINT-186 || Multi Pricer - changing between horizontal and vertical layouts resets fields to default values
        //this.cpnCoupon = '5.00';
      }

      if (this.SolveForvalue !== 'CouponBarrier' && (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory')) {
        this.cpnTrigger = this.cpnTrigger || '70.00';
      }

      if (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory') {
        // this.cpnObservation = 'European (Last day of the Month)';
        // this.cpnFreq = 'Monthly';
        this.setdefaultcpnFreq();
        this.cpnInFine = 'No';
      } else if (this.cpnType === 'Fixed Unconditional') {
        this.cpnTrigger ='';
        // this.cpnFreq = 'Monthly';
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
      this.ERReset();
      this.enableToggle();
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

            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultTimeout = this.validationArr[i].Default_Value;
              break;

            //  Added new entity config to show/hide TS button || Amogh K || 20Apr2022 || Assigned by PranavD
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

            //  Added new entity config to show/hide KID button || Amogh K || 21Apr2022 || Assigned by PranavD
            case 'EQ_Show_KID_Button':
              //console.log("TS button ", this.validationArr[i], this.commonfunctions.getLoggedInUserName()[1].EntityId)
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_KID_Button = this.validationArr[i].Config_Value;
                }
              } else {
                this.EQ_Show_KID_Button = this.validationArr[i].Default_Value;
              }

              break;
          }
        }
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async fnGetProdTemplate() {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/FetchAppTableSchema';
      const parameters = {
        productName: "AutocallablePhoenixER",
        subTemplateCode: "",
        requestXML: "",
        solveFor: "",
        loginID: "",
        buyerEntityID: "",
        userGroupID: ""
      };
      
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

        this.templateMappingArr = data;
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  checkValidNotional(e: any) {
    try {
      const NotionalData = this.commonfunctions.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
        this.Notional = NotionalData.Notional;
      } else {
        this.ErrorMsg = NotionalData.ErrorMsg;
        this.errorMsgChanged.emit(this.ErrorMsg);
      }
    } catch (error) {
      //console.log('Error:', error);
    }

  }

  async checkNotional(e: { target: { value: string; }; }) {
    try {
      this.enableToggle();

      if (this.ErrorMsg === '') {
        const target = this.commonfunctions.GetEventTarget(e);
        const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));

        const res : any= await this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
        if (res.length > 0 && (floatNotional < res[0].Minimum || floatNotional > res[0].Maximum)) {
          target.classList.add('error');
          // tslint:disable-next-line: max-line-length
          this.ErrorMsg = 'You must enter a number from ' + res[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + res[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          target.focus();
        } else {
          target.classList.remove('error');
          this.ErrorMsg = '';
          this.errorMsgChanged.emit('');

        }
      }
      this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      e.target.value = this.Notional;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async currencyChange() {
    try {
      this.ERReset();
      this.enableToggle();
      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined  && this.checkNotionalRes !== null && this.checkNotionalRes.length > 0) {
        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.add('error');
          // tslint:disable-next-line: max-line-length
          this.ErrorMsg = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).focus();
          this.errorMsgChanged.emit(this.ErrorMsg);

        } else {
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.remove('error');
        }
      }
      if (!(this.Notional + '').includes(',')) {
        this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }


      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      
      // if (this.Dates) {
      //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.commonfunctions.formatDate(this.Dates.MaturityDate));
      
      if (this.Dates) {
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        
      }

      if (this.SelectedUnderlyingBasketArray.length > 0) {

        for (let i = 0; i < this.SelectedUnderlyingBasketArray.length; i++) {
          //console.log(this.ddlNoteCcy, this.SelectedUnderlyingBasketArray[i]['Ccy']);
          if (this.ddlNoteCcy !== this.SelectedUnderlyingBasketArray[i]['Ccy']) {
            this.quanto = 'Yes';
          }
          else {
            this.quanto = 'No';
          }
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async txtTenorChange(e: any, type: any) {
    try {
      // unwanted if (this.ProductName === 'Participation') {
      // unwanted  this.ptcreset();
      // unwanted } else {
      this.ERReset();
      // unwanted}
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      let strDate = '';
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
      const str = target.value + '';
      if (str.substr(str.length - 1, 1).toUpperCase() === 'M') {
        // tslint:disable-next-line: radix
        if ((parseInt(str.substr(0, str.length - 1)) / 12) > 6) {
          this.ErrorMsg = 'Please enter valid date shifter.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }
      if (str.substr(str.length - 1, 1).toUpperCase() === 'Y') {
        // tslint:disable-next-line: radix
        if (parseInt(str.substr(0, str.length - 1)) > 6) {
          this.ErrorMsg = 'Please enter valid date shifter.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }


      if (type === 'Strike') {
        this.stkshift = target.value;

        // if (str.toUpperCase() === '0B') {
        // tslint:disable-next-line: max-line-length
        //   strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

        // }
        // else {
        this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), str.toUpperCase(), '');
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        // }

        this.stkdate = strDate;
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
        
        this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
        
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }
      if (type === 'Payment') {
        this.paymentshift = target.value;

        // if (str.toUpperCase() === '0B') {
        // tslint:disable-next-line: max-line-length
        //   //strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
        //   strDate = this.stkdate;
        // }
        // else {
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.stkdate);
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        // }
        this.settdate = strDate;

        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
        
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }
      if (type === 'Expiry') {
        this.expshift = target.value;
        // FIN1EURINT-263 : Not able to Price when Custom Tenor is selected for Autocallable
        if (this.expshift === 'Custom') {
          return true;
        }
        // FIN1EURINT-263 : Not able to Price when Custom Tenor is selected for Autocallable
        if (str.toUpperCase() === '0B') {
          // tslint:disable-next-line: max-line-length
          // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
          // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
          strDate = this.Dates.MaturityDate;
        } else {
          // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.Dates.MaturityDate);
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        }
        this.expdate = strDate;
      }

      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      const checkSetDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(checkSetDate.MaturityDate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      if (checkSetDate.MaturityDate === '' || (Date.parse(checkSetDate.MaturityDate) < Date.parse(this.stkdate))
        || (Date.parse(checkSetDate.MaturityDate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(checkSetDate.MaturityDate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //FIN1EURINT-263 : Not able to Price when Custom Tenor is selected for Autocallable
  async customTenorChange() {
    try {
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      const checkSetDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.customTenor, checkSetDate.MaturityDate);
      this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(checkSetDate.MaturityDate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      if (this.settdate === '' || (Date.parse(checkSetDate.MaturityDate) < Date.parse(this.stkdate))
        || (Date.parse(checkSetDate.MaturityDate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(checkSetDate.MaturityDate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async validationOnButton_ER() {
    try {
      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      this.TSFlag = false;
      clearInterval(this.TSInterval);
      this.reqSuccessMsg = '';

      this.KIDFlag = false;
      clearInterval(this.KIDInterval);
      this.reqKIDSuccessMsg = '';

      this.quoteEmailSuccessMsg = '';
      // Min max validation on price button - added by Priya L. on 15Mar2022 - assigned by Pranav D.
      this.MinMaxValidationonPriceBtn('Notional', 'txtnotional', this.Notional);

      if (this.SolveForvalue !== 'IBPrice' && this.SolveForvalue !== 'Upfront' && (this.IBPrice === '' || parseFloat(this.IBPrice) > 100)) {
        this.ErrorMsg = 'Please enter valid Reoffer price.';
        this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.add('error');
      }

      if (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap' && this.format !== 'Option') {
        const resMsg : any = await this.apifunctions.reofferValidation(this.issuePrice, this.IBPrice, 'EQ', this.format);
        if (resMsg !== '') {
          this.ErrorMsg = resMsg;
          this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.add('error');
        } else {
          this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.remove('error');
        }
      }

      // if (this.autoNonCall !== '' && this.ProductName === 'AutocallablePhoenix') {
      //   const resMsg = this.apifunctions.noncallValidation(this.autoNonCall, this.expshift,
      //     this.autoFreq.substr(0, this.autoFreq.length - 1));
      //   if (resMsg !== '') {
      //     this.ErrorMsg = resMsg;
      //     this.elem.nativeElement.querySelector('#txtautoNonCall' + this.ComponentIndex).classList.add('error');
      //   }
      // }

      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes !== null && this.checkNotionalRes.length > 0) {
        if ((this.Notional + '').includes(',')) {
          this.Notional = this.Notional.replace(/,/g, '');
        }
        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.add('error');
          // tslint:disable-next-line: max-line-length
          this.ErrorMsg = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).focus();
        } else {
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.remove('error');
        }
        if (!(this.Notional + '').includes(',')) {
          this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
      if (this.ShareBasket.length <= 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('underlyingError');
        this.ErrorMsg = 'Please enter underlying.';
      }
      if (this.SolveForvalue !== 'Strike') {
        if (parseFloat(this.Strike) <= parseFloat(this.minStrike)) {
          this.ErrorMsg = 'Strike should be greater than ' + this.minStrike + '%.';
          this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.add('error');
        }
      }

      // HSBCECCLI-23 : Add validation - Put Strike can not be less than KI | 08-Aug-2023
      if (this.SolveForvalue !== 'Strike') {
        if (parseFloat(this.Strike) < parseFloat(this.barrierLevel)) {
          this.ErrorMsg = 'Put Strike should be greater than KI Barrier Level';
          this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.add('error');
        }
      }

      if (this.cpnTrigger !== '' && (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory' || this.cpnType === 'Floating without Memory')) {
        if (this.cpnTrigger.indexOf('/') < 0) {
          if (parseFloat(this.cpnTrigger) <= parseFloat(this.minCoupon) || parseFloat(this.cpnTrigger) >= parseFloat(this.maxCoupon)) {
            this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
            this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.add('error');
          }
        } else {
          const cpnArr = this.cpnTrigger.split('/');
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < cpnArr.length; i++) {
            if (parseFloat(cpnArr[i]) <= parseFloat(this.minCoupon) || parseFloat(cpnArr[i]) >= parseFloat(this.maxCoupon)) {
              this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
              this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.add('error');
            }
          }
        }

      }
      // else {
      //   if (this.cpnType !== 'No Coupon' && this.cpnType !== 'Fixed Coupon'
      //     && this.SolveForvalue !== 'CouponBarrier' && this.format !== 'Option') {
      //     this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
      //     this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.add('error');
      //   }
      // }

      if (this.SolveForvalue !== 'KI') {
        if (parseFloat(this.barrierLevel) <= parseFloat(this.minBarrier)) {
          this.ErrorMsg = 'Barrier level should be greater than ' + this.minBarrier + '%.';
          this.elem.nativeElement.querySelector('#txtKI' + this.ComponentIndex).classList.add('error');
        }
      }
      if (parseFloat(this.autoStepDown) <= parseFloat(this.minStepdown)) {
        this.ErrorMsg = 'Stepdown should be greater than ' + this.minStepdown + '%.';
        this.elem.nativeElement.querySelector('#txtautoStepDown' + this.ComponentIndex).classList.add('error');
      }


      if (this.stkdate === '') {
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please enter valid strike date.';

      }
      
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      const checkSetDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      
      if (checkSetDate.MaturityDate === '') {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please enter valid payment date.';
      }

      if (checkSetDate.MaturityDate !== undefined) {
        if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(checkSetDate.MaturityDate))
          || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
          this.ErrorMsg = 'Please select valid strike date.';
          this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        }
      }

      if (checkSetDate.MaturityDate === '' || (Date.parse(checkSetDate.MaturityDate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
      }
      if ((Date.parse(this.expdate) < Date.parse(checkSetDate.MaturityDate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
      }
      if (this.ProductName === 'AutocallablePhoenixER') {
        if (this.SolveForvalue !== 'KO') {
          if (this.autoTrigger === '') {
            this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex).classList.add('error');
          } else if (this.autoStepDown === '') {
            if (this.autoTrigger.indexOf('/') < 0) {
              if (parseFloat(this.autoTrigger) <= parseFloat(this.minTrigger)
                || parseFloat(this.autoTrigger) >= parseFloat(this.maxTrigger)) {
                this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex).classList.add('error');
              }

            }
          }
        }
      }

      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        // this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      }

      // // Min max validation on price button - added by Priya L. on 15Mar2022 - assigned by Pranav D.
      // this.MinMaxValidationonPriceBtn('Notional', 'txtnotional', this.Notional);

      if (this.SolveForvalue !== 'ERCoupon' && this.ERCpnType !== 'None') {
        if (this.ERCoupon === '') {
          this.ErrorMsg = 'Please enter valid ER coupon.';
          this.elem.nativeElement.querySelector('#txtERCoupon' + this.ComponentIndex).classList.add('error');

        }
      }

      // HSBCECCLI-21 : Add validation for AC Coupon ( % ) and Coupon p.a. - Zero coupons should not be allowed | 09-Aug-2023
      if (!(this.SolveForvalue === 'Coupon' || (this.ERCpnType !== 'None' && this.periodicCouponFlag === 'No') || (this.cpnType === '' || this.cpnType === 'Floating Unconditional' || this.cpnType === 'Floating without Memory'))){
        if (parseFloat(this.cpnCoupon) === parseFloat('0')) {
          this.ErrorMsg = 'Please enter a non-zero Coupon';
          this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex).classList.add('error');
        }
      }
      if (!(this.SolveForvalue === 'ERCoupon' || (this.ERCpnType === 'None' && this.periodicCouponFlag ==='Yes') || this.enabledisablefields('ERCouponPa'))){
        if (parseFloat(this.ERCoupon) === parseFloat('0')) {
          this.ErrorMsg = 'Please enter a non-zero Coupon';
          this.elem.nativeElement.querySelector('#txtERCoupon' + this.ComponentIndex).classList.add('error');
        }
      }
      // HSBCECCLI-21 : Add validation for AC Coupon ( % ) and Coupon p.a. - Zero coupons should not be allowed | 09-Aug-2023
      
      // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
      if (this.autocallCouponType === 'Custom Barrier') {
        if (this.customBarrierArr.length > 0) {
          const idx = this.customBarrierArr.findIndex((el) => (parseFloat(el.OutTrigger) <= parseFloat(this.minTrigger) || parseFloat(el.OutTrigger) >= parseFloat(this.maxTrigger)));
          if (idx >= 0) {
            this.ErrorMsg = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
            this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex).classList.add('error');
          }
        }
      }

      if (this.ErrorMsg !== '') {
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.enableToggle();

        this.apifunctions.priceFlag.next(false);
        this.apifunctions.saveFlag.next(false);
        this.apifunctions.rcsaveFlag.next(false);
      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  // Bulk Pricer (AC) - Export to excel 
  generateExcelJson(){
      
    this.tempXLJson = {};
    this.tempXLJson = {
      'Best Quote from' : this.sortedAllPrices[0] ? this.sortedAllPrices[0].lp : '',
      'Best Price' : this.sortedAllPrices[0] ? this.sortedAllPrices[0].Price : '',
      'RFQ ID' : this.noteMasterID ? this.noteMasterID : '',
      'Underlying 1' : this.ShareBasket[0] ? this.ShareBasket[0].BloombergCode : '',
      'Underlying 2' : this.ShareBasket[1] ? this.ShareBasket[1].BloombergCode : '',
      'Underlying 3' : this.ShareBasket[2] ? this.ShareBasket[2].BloombergCode : '',
      'Underlying 4' : this.ShareBasket[3] ? this.ShareBasket[3].BloombergCode : '',
      'Underlying 5' : this.ShareBasket[4] ? this.ShareBasket[4].BloombergCode : '',
      'Currency' : this.ddlNoteCcy,
      'Notional' : this.Notional,
      'Format' : this.format,
      'Solve For' : this.SolveForvalue,
      'Reoffer (%) or Upfront (%)' : this.IBPrice,
      'Issue Price (%)' : this.issuePrice,
      'Strike Date' : this.stkshift,
      'Issue Date' : this.paymentshift === 'Custom' ? 'T + ' + this.settdate : this.paymentshift, //FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      'Tenor' : this.expshift === 'Custom' ? this.customTenor : this.expshift, //FIN1EURINT-528 : Bulk Pricer - Tenor custom input functionality like quick pricer
      'Barrier Type' : this.barrierType,
      'KI Barrier (%)' : this.barrierLevel,
      'Put Strike (%)' : this.Strike,
      'Settlement' : this.SettlementMethod,
      'Periodic Coupon' : this.periodicCouponFlag,
      'Coupon Type' : this.cpnType,
      'Coupon p.a. (%)' : this.cpnCoupon,
      'Coupon Frequency' : this.cpnFreq,
      'Coupon Barrier Type' : this.cpnObservation,
      'Coupon Barrier Level' : this.cpnTrigger,
      'Autocall Type' : this.autocallCouponType,
      'Barrier(%)' : this.autoTrigger,
      'Step Up/Down (%)' : this.autoStepDown,
      'Frequency' : this.autoFreq,
      'From' : this.autoNonCall,
      'Autocall Coupon Type' : this.ERCpnType,
      'AC Coupon p.a. (%)' : this.ERCoupon,
      'Priips' : this.priipsYN,
      'Country' : this.country,
      'Language': this.language
    };
    this.commonfunctions.generateExcelJson(this.tempXLJson);
  }
  generateSaveXML_ER() {
    try {
      // this.validationOnButton();
      if (this.ShareBasket.length <= 0) {
        this.commonfunctions.generateFlexiXml({}); // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
        return '';
      }
      this.tempXML = '';
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].BloombergCode + '#')) +
        ((this.ShareBasket[1] === undefined) ? '' : (this.ShareBasket[1].BloombergCode + '#')) +
        ((this.ShareBasket[2] === undefined) ? '' : (this.ShareBasket[2].BloombergCode + '#')) +
        ((this.ShareBasket[3] === undefined) ? '' : (this.ShareBasket[3].BloombergCode + '#')) +
        ((this.ShareBasket[4] === undefined) ? '' : (this.ShareBasket[4].BloombergCode + '#')) +
        ((this.ShareBasket[5] === undefined) ? '' : (this.ShareBasket[5].BloombergCode + '#')) + '#' + this.ddlNoteCcy;

      this.tempXML += '<Record>' +
        '<Share>' + shareCcy + '</Share>' +
        '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].BloombergCode) + '</ShareBBGRIC1>' +
        '<ShareBBGRIC2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].BloombergCode) + '</ShareBBGRIC2>' +
        '<ShareBBGRIC3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].BloombergCode) + '</ShareBBGRIC3>' +
        '<ShareBBGRIC4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].BloombergCode) + '</ShareBBGRIC4>' +
        '<ShareBBGRIC5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].BloombergCode) + '</ShareBBGRIC5>' +

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

        '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].BloombergCode) + '</Underlying1>' +
        '<Underlying2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].BloombergCode) + '</Underlying2>' +
        '<Underlying3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].BloombergCode) + '</Underlying3>' +
        '<Underlying4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].BloombergCode) + '</Underlying4>' +
        '<Underlying5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].BloombergCode) + '</Underlying5>' +

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
        '<Size>' + this.Notional + '</Size>' +
        '<PaymentDate>' + this.settdate + '</PaymentDate>' +
        '<StrikeDate>' + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy') + '</StrikeDate>' +
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
        '<IssueDate>' + this.settdate + '</IssueDate>' +
        '<AttachPer></AttachPer>' +
        '<DetachPer></DetachPer>' +
        '<CouponSpread></CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +
        '<ERFrequency>' + this.autoFreq + '</ERFrequency>' +
        '<SubTemplate>' + (this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER') + '</SubTemplate>' +
        '<ComputedStrikeFixingLag>' + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</ComputedStrikeFixingLag>' +
        '<ComputedSettlementPeriodSoftTenor>' + (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')) + '</ComputedSettlementPeriodSoftTenor>' +
        '<ComputedPayoffSoftTenor>' + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</ComputedPayoffSoftTenor>' +
        // '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.apifunctions.userGroupID + '</onBehalfOf>' +
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
        '<SettlementMethod>' + this.SettlementMethod + '</SettlementMethod>' +
        '<DailyKOYN>' + this.dailyKOYN + '</DailyKOYN>' +
        '</Record>';
      // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
      this.commonfunctions.generateFlexiXml({xml: this.tempXML, index: this.ComponentIndex});
      return this.tempXML;
    } catch (error) {
      //console.log('Error', error);
    }
  }

  deleteRow() {
    try {
      this.ShareBasket = [];
      this.SelectedUnderlyingBasket = [];
      this.SelectedUnderlyingBasket = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
        UnderlyingFive: {}
      };

      this.SelectedUnderlyingBasketArray = [];
      this.updateShareBasket();

      this.ERReset();

      this.apifunctions.priceFlag.next(false);
      this.apifunctions.rcPriceFlag.next(false);

      this.commonfunctions.deleteRow(this.ComponentIndex);
      (this.apifunctions.toggleVisiblityFlag.value).splice(this.ComponentIndex, 1);
      this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  changeFreq() {
    try {
      this.enableToggle();
      if (this.floatingRef.includes('3M')) {
        this.creditcouponFreq = 'Quarterly';
      } else if (this.floatingRef.includes('6M')) {
        this.creditcouponFreq = 'Semi-Annual';
      } else if (this.floatingRef.includes('12M')) {
        this.creditcouponFreq = 'Annual';
      } else {
        this.creditcouponFreq = 'Monthly';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  ERReset() {
    try {
      this.apifunctions.priceFlag.next(false);
      this.apifunctions.saveFlag.next(false);
      // this.apifunctions.rcPriceFlag.next(false);
      // this.apifunctions.rcsaveFlag.next(false);
      this.commonfunctions.setsubmultiReceivedPrices({}, '');
      // this.commonfunctions.setsubmultiRCReceivedPrices({}, '');

      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      if (this.ShareBasket !== undefined && this.ShareBasket.length > 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.remove('underlyingError');
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('longText');
      }


      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.togglesortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      // this.errorMsgChanged.emit('');
      this.rfqID = '';
      this.noteMasterID = '';
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

      if (this.SolveForvalue === 'Upfront'){
      this.accuUpfront = '';
      }
      if (this.SolveForvalue === 'Reoffer'){
        this.creditReofferPrice = '';
      }
      if (this.SolveForvalue === 'ERCoupon'){
      this.ERCoupon = '';
      }
      if (this.SolveForvalue === 'PutStrike'){
      this.Strike = '';
      }
      if (this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtUpfront' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtUpfront' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.remove('reply');
      }

      if (this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtKI' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtKI' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtFundingRate' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtFundingRate' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtSpread' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtSpread' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      }
      if (this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      }
      if (this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      }

      this.TSFlag = false;
      this.TSLoadFlag=false;
      this.ViewTSFlag=false;
      
      clearInterval(this.TSInterval);
      this.reqSuccessMsg = '';
      this.timerinSec = -1;

      this.KIDFlag = false;
      this.KIDLoadFlag=false;
      this.ViewKIDFlag=false;
      clearInterval(this.KIDInterval);
      this.reqKIDSuccessMsg = '';

      clearInterval(this.priceTimerInterval);

      this.quoteEmailSuccessMsg = '';

      this.enableToggle();
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async setIssueDate(paymentshift: string) {
    try {
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      // this.paymentshift = '10B';
      // this.paymentshift = paymentshift;
      // this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, paymentshift, '');
      // this.issueDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

      const setIssueDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      this.issueDate = setIssueDate.MaturityDate;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  upUpperStrikeChange() {
    try {
      this.enableToggle();
      if (this.upUpperStrike === '' || this.upUpperStrike === '0') {
        this.upCoupon = '0.00';
      } else {
        this.upCoupon = '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  onclickShareBasket(_item: any) {
    // open dotnet popup base
    //window.open("https://euroconnect.test-equity-connect.com/FinIQWebApp/Technical_Charts/Technical_Charts.aspx?Bloomberg=" + item.Code + "&FIGI=&ISIN=&LongName=" + item.LongName + "&RIC=" + item.RICCode + "&Master_Popup=POPUP", "_blank", "");
    return false;
  }



  calculateLeverage() {
    try {
      if (this.participationType === 'Booster') {
        if ((this.downLowerStrike !== '' && this.downLeverageYN === 'Yes')
          || (this.downLowerStrike === '' && this.downLeverageYN === 'Yes')) {
          this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
        } else {
          this.downLeverage = '100.00';
        }
      }
    } catch (error) {

    }
  }

  changeAutoFreq() {
    this.ERReset();
    this.enableToggle();
    if (this.cpnType !== 'No Coupon') {
      // if (this.autoFreq === '1m'){ // || this.autoFreq === '2m') {
      //     this.cpnFreq = '1m';
      // } else {
      if (this.cpnFreq === '') {
        this.cpnFreq = '3m';
      } else {
        // tslint:disable-next-line: radix
        const cpnFreqNum = parseInt(this.cpnFreq.toString().substring(0, this.cpnFreq.length - 1));
        // tslint:disable-next-line: radix
        const autoFreqNum = parseInt(this.autoFreq.toString().substring(0, this.autoFreq.length - 1));
        if (cpnFreqNum > autoFreqNum) {
          if (autoFreqNum < 3) {
            this.cpnFreq = '1m';
          } else {
            this.cpnFreq = '3m';
          }


        }
      }
      // }
    } else {
      this.cpnFreq = '';
    }
    if (this.format === 'Swap') {
      if (this.autoFreq === '1m' || this.autoFreq === '2m' || this.autoFreq === '4m') {
        this.fundFreq = '1m';
      } else {
        if (this.fundFreq === '') {
          this.fundFreq = '3m';
        } else {
          // tslint:disable-next-line: radix
          const fundFreqNum = parseInt(this.fundFreq.toString().substring(0, this.fundFreq.length - 1));
          // tslint:disable-next-line: radix
          const autoFreqNum = parseInt(this.autoFreq.toString().substring(0, this.autoFreq.length - 1));
          if (fundFreqNum > autoFreqNum) {
            this.fundFreq = '1m';
          }
        }



      }
    } else {
      this.fundFreq = '';
    }
  }


  strikeChange() {
    if (this.Strike !== '') {
      //added for FIN1EURINT-506 by KaustubhS || 04-Jul-2023 || START
      if (parseFloat(this.Strike) !== 100.00) {
        this.LeverageYN = 'Yes';
        this.LeverageFlag = true;
      } else {
        this.LeverageYN = 'No';
        this.LeverageFlag = false;
      }
      //added for FIN1EURINT-506 by KaustubhS || 04-Jul-2023 || END
      if (this.barrierType !== 'Ungeared Put' && this.LeverageYN === 'Yes') {
        if (parseFloat(this.Strike) > 0) {
          this.leverage = (((1 / this.Strike) * 100) * 100).toFixed(2);
        } else {
          this.leverage = '0.00';
        }

      } else {
        this.leverage = '100.00';
      }
    } else { //added for FIN1EURINT-506 by KaustubhS || 04-Jul-2023 || START
      this.LeverageYN = 'Yes';
      this.LeverageFlag = true;
    } //added for FIN1EURINT-506 by KaustubhS || 04-Jul-2023 || END
  }

  IssuePricechange() {
    try {

      this.ERReset();

      this.enableToggle();

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  enableToggle() {
    if (this.apifunctions.toggleVisiblityFlag.value.length > 0) {
      (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
      this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);

    }
  }

  txtupCouponChange() {

    if (this.upCoupon !== '0.00') {
      if (this.upCoupon === '') {
        this.upUpperStrike = '110.00';
      }
      this.upBarrierType = 'None';
      this.upBarrierLevel = '';
      this.upRebate = '';
    }
  }

  //Changes done by Pranav D 03-Dec-2021
  async txtTenorDateChange(type: any) {
    try {
      let strDate = '';
      this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
      // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
      const setIssueDate = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? (this.settdate  + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
      if (type === 'Payment') {
        strDate = this.commonfunctions.formatDate(setIssueDate.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        // }
        // if (this.paymentshift !== 'Custom') {
        //   this.settdate = strDate;
        // }
	// FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), strDate);
        
        this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }
      if (type === 'Expiry') {
        // FIN1EURINT-528 : Bulk Pricer - Issue Date custom input functionality like quick pricer
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), setIssueDate.MaturityDate);
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        this.expdate = strDate;
      }
      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(setIssueDate.MaturityDate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      if (setIssueDate.MaturityDate === '' || (Date.parse(setIssueDate.MaturityDate) < Date.parse(this.stkdate))
        || (Date.parse(setIssueDate.MaturityDate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(setIssueDate.MaturityDate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  changeAutoFreqOnTenor() {
    try {
      this.autoFreqArr = [];
      const str = this.expshift + '';
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

  getNoncall() {
    // tslint:disable-next-line: radix
    const val = parseInt(this.autoNonCall) + 1;
    return val === 1 ? val + 'st' : (val === 2 ? val + 'nd' : (val === 3 ? val + 'rd' : val + 'th'));
  }

  async RequestTermsheet() {
    try {
      this.TSFlag = false;
      this.TSLoadFlag=true;
      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.orderID, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'TS');
      // const errorMsg: any = await this.apifunctions.termsheetSender(this.orderID, '', 'AutocallablePhoenix', 'AutocallablePhoenix', 'TS');
      const res: any = await this.apifunctions.termsheetSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'CustomStrategy', this.language, this.country);
      // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
      //if (errorMsg === '') {
        this.reqSuccessMsg = 'TS Awaited.';
        this.TSLoadFlag=false;
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        this.TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res : any = await this.apifunctions.ViewTermsheet(that.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.TSFlag = true;
                TSTimeLeft = 0;
                clearInterval(that.TSInterval);
                that.reqSuccessMsg = 'TS Received.';

              } else {
                that.TSFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.TSFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.TSFlag === false) {
            // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
            // tslint:disable-next-line: max-line-length
            that.ErrorMsg = 'Termsheet response is taking longer than expected hence Termsheet will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
            that.errorMsgChanged.emit(that.ErrorMsg);
            this.TSLoadFlag=false;
            clearInterval(that.TSInterval);
          }
        }, 10000);
      } else {
        this.reqSuccessMsg = 'TS Request Failed.';
        this.TSLoadFlag=false;
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewTermsheet() {
    try {
      this.ErrorMsg = '';
      this.ViewTSFlag=true;
      //console.log(this.sortedAllPrices[0])
      //ViewDoc(RFQ,LP,docType) // need to add call from here
      // const res : any = await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
      // if (res?.length) {
      //   const downloadLink = document.createElement('a');
      //   res.forEach(function (item: any) {
      //     if (item.Status.toString().toUpperCase() === 'SUCCESS') {
      //       let fileName = item.Document_Output_Path;
      //       downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
      //       downloadLink.download = fileName;
      //       downloadLink.click();
      //     }
      //     else {
      //       this.ErrorMsg = item.Status.toString();
      //     this.errorMsgChanged.emit(this.ErrorMsg);
      //   }
      //   });

      // } else {
      //   this.ErrorMsg = 'Termsheet not available. Please try again later.';
      //   this.errorMsgChanged.emit(this.ErrorMsg);

      // }
      
      //Added by AdilP @16-06-2023 || FIN1EURINT-480
      this.ViewDoc(this.sortedAllPrices[0].rfq, this.sortedAllPrices[0].lp,'IndicativeTermsheet');
      this.ViewTSFlag=false;
      return false;

    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async GetTriggerValue(type: any) {

    let tenorinmonth = 0;


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


    if (type === 'autoTrigger') {
      this.TriggerValueArr = await this.apifunctions.GetTriggerValues(tenorinmonth, this.autoFreq,
        this.autoTrigger, this.autoStepDown, this.autoNonCall);
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = true;
      this.cpnTriggerPopup = false;
      this.fundRatePopup = false;
    }

    if (type === 'cpnTrigger') {

      this.TriggerValueArr = await this.apifunctions.GetTriggerValues(tenorinmonth, this.cpnFreq,
        this.cpnTrigger, '', '');
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.cpnTriggerPopup = true;
      this.fundRatePopup = false;
    }
    if (type === 'fundRate') {
      this.TriggerValueArr = await this.apifunctions.GetTriggerValues(tenorinmonth, this.fundFreq,
        this.fundRate, '', '');
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

  async scheduleSend() {
    try {
      if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
        this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      } else {
        this.ErrorMsg = '';
        this.errorMsgChanged.emit(this.ErrorMsg);
      }
      this.validationOnButton_ER();

      const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.inputTime));
      const today = new Date();
      if (sDate < today) {
        this.ErrorMsg = 'Please enter valid time';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if (this.ProductName !== 'CreditTranche') {
        if (Date.parse(this.stkdate) < Date.parse(this.inputDate)) {
          this.ErrorMsg = 'Strike date must be greater than schedule date.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      } else {
        if (Date.parse(this.issueDate) < Date.parse(this.inputDate)) {
          this.ErrorMsg = 'Strike date must be greater than schedule date.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }

      this.scheduleMsg = '';
      this.scheduleMsgChanged.emit(this.scheduleMsg);
      const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
      if (this.ErrorMsg === '') {
        // this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
        let xmlstr : any = '';
        
        xmlstr = await this.generateXMLER();

        const res = await this.apifunctions.SchedulePrice(this.ProductName, xmlstr,
          (this.inputDate + ' ' + this.inputTime), 'FLEXI_PRICER', this.apifunctions.portfolioGroupID,
          timeinsecs, 'BBVA', this.ProductName === 'CreditTranche' ? this.creditSolveFor : this.SolveForvalue, this.apifunctions.userGroup);
        if (res) {
          this.scheduleMsg = 'Request scheduled successfully.';
          this.scheduleMsgChanged.emit(this.scheduleMsg);
        }
      }
    } catch (error) {

    }
    return false;
  }

  startCountDown(sec: number, _index: number) {
    let counter = sec;

    // var interval1 = setInterval(() => {
    this.priceTimerInterval = setInterval(() => {
      ////console.log( counter);  
      // if (this.priceProvidersArr.length <= 0) {
      //     clearInterval(interval1);
      // }
      // if (this.priceProvidersArr.length > 0) {
      //     this.priceProvidersArr[index].timer = counter;
      this.timerinSec = counter;
      counter--;
      // }


      if (counter < 0) {

        clearInterval(this.priceTimerInterval);


      };
    }, 1000);

  }

  async RequestKID() {
    try {
      this.KIDFlag = false;
      this.KIDLoadFlag=true;
      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.orderID, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
      const res: any = await this.apifunctions.KIDSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'CustomStrategy', this.language, this.country);
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
        this.reqKIDSuccessMsg = 'KID Awaited.';
        this.KIDLoadFlag=false;
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        this.KIDInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const resp : any= await this.apifunctions.ViewTermsheet(that.sortedAllPrices[0].rfq, 'KID');
            if (resp?.length) {
              if (resp[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.KIDFlag = true;
                TSTimeLeft = 0;
                clearInterval(that.KIDInterval);
                that.reqKIDSuccessMsg = 'KID Received';

              } else {
                that.KIDFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.KIDFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.KIDFlag === false) {
            // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
            // tslint:disable-next-line: max-line-length
            that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
            that.errorMsgChanged.emit(that.ErrorMsg);
            this.KIDLoadFlag=false;
            clearInterval(that.KIDInterval);
          }
        }, 10000);
      } else {
        this.reqKIDSuccessMsg = 'KID Request Failed.';
        this.KIDLoadFlag=false;
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewKID() {
    try {
      this.ErrorMsg = '';
      this.ViewKIDFlag=true;
      // const res : any = await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'KID Termsheet');
      // if (res !== null && res !== undefined) {
      //   if (res.Status.toString().toUpperCase() === 'SUCCESS') {
      //     const bytes = new Uint8Array(res.DGI_Image);
      //     const blob = new Blob([bytes], { type: 'application/doc' });
      //     const link = document.createElement('a');
      //     link.href = window.URL.createObjectURL(blob);
      //     link.download = res.Document_Output_Path;
      //     link.click();
      //   } else {
      //     this.ErrorMsg = res.Status.toString();
      //     this.errorMsgChanged.emit(this.ErrorMsg);
      //   }

      // } else {
      //   this.ErrorMsg = 'KID not available. Please try again later.';
      //   this.errorMsgChanged.emit(this.ErrorMsg);

      // }
      // Added by AdilP @16-06-2023 || FIN1EURINT-480 
      this.ViewDoc(this.sortedAllPrices[0].rfq, this.sortedAllPrices[0].lp,'KID');
      this.ViewKIDFlag=false;
      return false;

    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }



  async emailQuote(rfq: any) {
    // this.quoteEmailFlg = false;
    this.quoteEmailSuccessMsg = '';
    this.saveFlag = false;
    var res : any = await this.apifunctions.quoteEmail(rfq);
    //console.log(res);
    if (res.Status === "Success") {
      // this.quoteEmailFlg = true;
      this.quoteEmailSuccessMsg = "Email sent successfully";
    }
    return false;
  }

  filldropdownfromcommandata() {
   
    this.pageloadflag=true;
    this.resetdropdownArr();
    for (let i = 0; i < this.commonData.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "AutocallableFrom":
          break;
        case "AutocallFrequency":
          this.AutocallFrequency = this.parseCommonDatatoJSONArr('AutocallFrequency');
          const i = this.AutocallFrequency.findIndex(obj => obj.Key === 'Daily');
          if (i > -1) {
            this.AutocallFrequency.splice(i, 1);
          }
          if (this.AutocallFrequency && this.AutocallFrequency.length > 0) {
            for (let j = 0; j < this.AutocallFrequency.length; j++) {
              this.AutocallFrequency[j]['Flag'] = false;
            }
          }
          break;
        case "BarrierOneTouchorNOtouch":
          break;
        case "BasketType":
          this.BasketType = this.parseCommonDatatoJSONArr('BasketType');
          break;
        case "CallableFrequency":
          this.CallableFrequency = this.parseCommonDatatoJSONArr('CallableFrequency');
          break;
        case "CallableFrom":
          this.CallableFrom = this.parseCommonDatatoJSONArr('CallableFrom');
          break;
        case "Channel":
          break;
        case "CountryofDistribution":
          this.CountryofDistribution = this.parseCommonDatatoJSONArr('CountryofDistribution');
          this.countryArr = [];
          for (let j = 0; j < this.CountryofDistribution.length; j++) {
            this.countryArr.push(this.CountryofDistribution[j].Value);
          }
          break;
        case "CouponBarrierType":
          this.CouponBarrierType = this.parseCommonDatatoJSONArr('CouponBarrierType');
          break;
        case "CouponFrequency":
          break;
        case "CouponType":
          this.CouponType = this.parseCommonDatatoJSONArr('CouponType');
          this.CouponType = this.CouponType.filter(option => option.Value !== 'Snowball')
          break;
        case "Currency":
          break;
        case "EarlyRedemptionType":
          this.EarlyRedemptionType = this.parseCommonDatatoJSONArr('EarlyRedemptionType');
          break;
        case "FinalUpside":
          this.FinalUpside = this.parseCommonDatatoJSONArr('FinalUpside');
          break;
        case "FixingDetermination":
          this.FixingDetermination = this.parseCommonDatatoJSONArr('FixingDetermination');
          break;
        case "Format":
          this.Format = this.parseCommonDatatoJSONArr('Format');
          break;
        case "IssueDateOffset":
          this.IssueDateOffset = this.parseCommonDatatoJSONArr('IssueDateOffset');
          break;
        case "KIDs":
          this.KIDs = this.parseCommonDatatoJSONArr('KIDs');
          break;
        case "ProtectionType":
          this.ProtectionType = this.parseCommonDatatoJSONArr('ProtectionType');
          break;
        case "PublicorPrivate":
          this.PublicorPrivate = this.parseCommonDatatoJSONArr('PublicorPrivate');
          break;
        case "PutableFrequency":
          this.PutableFrequency = this.parseCommonDatatoJSONArr('PutableFrequency');
          break;
        case "PutableFrom":
          this.PutableFrom = this.parseCommonDatatoJSONArr('PutableFrom');
          break;
        case "RangeAccrualFrequency":
          this.RangeAccrualFrequency = this.parseCommonDatatoJSONArr('RangeAccrualFrequency');
          break;
        case "SettlementMethod":
          this.SettlementMethodArr = this.parseCommonDatatoJSONArr('SettlementMethod');
          break;
        case "SolveFor":
          this.SolveFor = this.parseCommonDatatoJSONArr('SolveFor');
          break;
        case "StaticFundingType":
          this.StaticFundingType = this.parseCommonDatatoJSONArr('StaticFundingType');
          break;
        case "StockExchange":
          this.StockExchange = this.parseCommonDatatoJSONArr('StockExchange');
          break;
        case "SwapFloatingReference":
          this.SwapFloatingReference = this.parseCommonDatatoJSONArr('SwapFloatingReference');
          this.SwapFloatingReference = this.commonfunctions.alphaNumSorting(this.SwapFloatingReference);
          break;
        case "CouponTypeArr":
          this.CouponTypeArr = this.parseCommonDatatoJSONArr('CouponTypeArr');
          break;
        case "Tenor":
          this.Tenor = this.parseCommonDatatoJSONArr('Tenor');
          break;
        case "StrikeArr":
          this.StrikeArr = this.parseCommonDatatoJSONArr('StrikeArr');
          break;
        case "Termsheets":
          this.Termsheets = this.parseCommonDatatoJSONArr('Termsheets');
          break;
        case "UnderlyingStrikeType":
          this.UnderlyingStrikeType = this.parseCommonDatatoJSONArr('UnderlyingStrikeType');
          break;
        case "YieldFloatingReference":
          this.YieldFloatingReference = this.parseCommonDatatoJSONArr('YieldFloatingReference');
          break;
      }
    }

  }

  parseCommonDatatoJSONArr(Field_Name: any) {
    let commonDataJSONArr: any = [];
    const index = this.commonData.findIndex((obj: { Field_Name: any; }) => obj.Field_Name === Field_Name);
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
      commonDataJSONArr.sort((a: { Key: number; }, b: { Key: number; }) => (a.Key > b.Key) ? 1 : -1);
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

  publicprivateChange() {
    if (this.publicOrPrivate === 'Public Offer') {
      this.listed = 'Y';
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
 // function modified by AdilP || FIN1EURINT-502 || @28-06-2023
  autocallCouponTypeChange() {
    if (this.autocallCouponType === 'Constant Barrier' || this.autocallCouponType === 'Variable Barrier') {
      this.autoFreq = 'Monthly';
      this.callableFreq = '';
      this.putableFreq = '';

    } 
    // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
    else if (this.autocallCouponType === 'Custom Barrier') {
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

    // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
    if (this.autocallCouponType === 'Constant Barrier' || this.autocallCouponType === 'Custom Barrier') {
      this.autoTrigger = '102.00';
    }
    this.autocallfreqbasedonTenor();
    this.autocallfrombasedonFreqnTenor();
    // HSBCECCLI-56 : Bulk Pricer - Custom Autocall function call code changes || 04-Sep-2023
    this.customBarrier();
  }

  ERCpnTypeChange() {
    this.ERReset();
    this.enableToggle();
    if (this.ERCpnType === 'None') {
      this.periodicCouponFlag = 'Yes';
      this.ERCoupon = '';
      // FIN1EURINT-186 || Multi Pricer - changing between horizontal and vertical layouts resets fields to default values
      // this.cpnType = 'Fixed Unconditional';
      // this.cpnFreq = 'Monthly';
      // this.cpnCoupon = '5.00';

    } else {
      //this.periodicCouponFlag = 'No';
      if (this.SolveForvalue === 'Coupon') {
        this.SolveForvalue = 'IBPrice';
      }
      //<commented by AdilP || value should not reset when we change flat/snowball coupon type>
      // this.cpnType = '';
      // this.cpnObservation = '';
      // this.cpnTrigger = '';
      // this.cpnFreq = '';
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
    }
  }

  periodicCouponFlagChng() {
    if (this.periodicCouponFlag === 'No') {
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
      this.ERCpnType = 'Flat';
    } else {
      this.cpnType = 'Fixed Unconditional';
      this.cpnFreq = 'Monthly';
      this.cpnCoupon = '5.00';
      this.ERCpnType = 'None';
      this.ERCoupon = '';
    }


  }

  barrierTypeChange() {
    try {
      this.ERReset();
      this.enableToggle();
      if (this.barrierType === 'None' || this.barrierType === '') {
        // this.Strike = '';
        this.leverage = '';
        this.barrierLevel = '';
        this.putSpreadGearing = '';
      }
      // if (this.barrierType === 'Bermudan') {
      //   this.ProtectionFlag = true;
      // }

      // if (this.barrierType != 'Bermudan') {
      //   this.ProtectionFlag = false;
      // }

      if (this.barrierType !== 'None') {
        this.strikeChange();
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  upsideTypeChange() {
    try {
      //  default flag check || PriyaL || 08Apr2022 || Assigned by Pranav D.
      if (!this.defaultValueFlag) {
        this.ERReset();
      }

      this.enableToggle();
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

  IBPricechange() {
    try {
      this.ERReset();
      this.enableToggle();
    } catch (error) {
      //console.log('Error:', error);
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

    if (this.autoNonCallArr && this.autoNonCallArr.length > 0) {
      const index = this.autoNonCallArr.findIndex(res => res.Value === this.autoNonCall);
      if (index < 0) {
        this.autoNonCall = this.autoNonCallArr[0].Value;
      }
      // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
      else {
        this.autoNonCall = this.autoNonCallArr[index].Value;
      }
    }

  }

  positionDropdown() {
    $("div.cdk-overlay-pane").addClass("adjust-dropdown-multi");
  }

  autocallfreqbasedonTenor() {
    let tenorinmonth = 0;
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
    // HSBCECCLI-56 : Bulk Pricer - Custom Autocall function call code changes || 04-Sep-2023
    // this.autocallfrombasedonFreqnTenor();
  }

  parseShifter(shifter: string) {
    var parsedStr = "";
    switch (shifter) {
      case '5B':
        parsedStr = '5B'
        break;
      case '0B':
        parsedStr = '0B'
        break;
      case 'T + 5':
        parsedStr = '5B'
        break;
      case 'T + 10':
        parsedStr = '10B'
        break;
    }
    return parsedStr;
  }

  positionDropdownResult() {
    this.showAllLPPopup = true;//Added by SandipA for FIN1EURINT-121 || 03-May-2023
    //$("div.cdk-overlay-connected-position-bounding-box").addClass("adjust-dropdown-multi");
  }

  cpnFreqChange() {

    if (this.cpnType !== 'Fixed Unconditional') {
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
    }
    else {
      this.cpnObservation = '';
    }

  }

  async changeStkShiftToggle() {
    if (this.stkshift === '0B') {
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);

      }
    }
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
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 1).toFixed(2);
      }
      if (this.cpnFreq === 'Quarterly') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 4).toFixed(2);
      }
      if (this.cpnFreq === 'Semiannually') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 2).toFixed(2);
      }
      if (this.cpnFreq === 'Monthly') {
        this.CouponTooltipValue = (parseFloat(this.cpnCoupon) / 12).toFixed(2);
      }
      return this.CouponTooltipValue;
    }
  }

  setdefaultcpnFreq() {
    // if(this.cpnFreq === 'Yearly' && this.autoFreq !=='Yearly'){
    //   this.cpnFreq = 'Monthly';
    // }

    // if(this.cpnFreq === 'Semiannually' && this.autoFreq !=='Yearly' && this.autoFreq !== 'Semiannually'){
    //   this.cpnFreq = 'Monthly';
    // }

    // if(this.cpnFreq === 'Quarterly' && this.autoFreq !=='Yearly' && this.autoFreq !== 'Semiannually' && this.autoFreq !== 'Quarterly'){
    //   this.cpnFreq = 'Monthly';
    // }

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

  displaySortedLpPopup() {
    this.showSortedLpPopup = !this.showSortedLpPopup;
  }

  displayToggleSortedLpPopup() {
    this.showToggleSortedLpPopup = !this.showToggleSortedLpPopup;
  }

  closePopups() {
    this.showToggleSortedLpPopup = false;
    this.showSortedLpPopup = false;
  }

  // function to set enity based default values - added by Priya L. on 02Mar2022 - assigned by Pranav D.
  setdefaultvalues() {
    this.defaultValueFlag = true; // set default flag to handle reset functionality || PriyaL || 08Apr2022 || Assigned by Pranav D.
    //console.log('setdefaultvalues');
    for (let i = 0; i < this.defaultvaluesArr.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === 'AutocallFrequency') {
        //console.log(this.defaultvaluesArr[i]);
      }
      switch (this.defaultvaluesArr[i].Control_Name) {
        case 'Currency':
          this.ddlNoteCcy = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'Format':
          this.format = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'SolveFor':
          this.SolveForvalue = this.defaultvaluesArr[i].Default_Value;
          // //console.log(this.format,"defaultformatval");
          break;

        case 'Underlyings':
          // this.ShareName = this.defaultvaluesArr[i].Default_Value;
          if (this.defaultvaluesArr[i].Default_Value && this.defaultvaluesArr[i].Default_Value !== '') {
            this.defaultvaluesArr[i].Default_Value.split(',').forEach(async (element: any) => {
              var index = this.shares.findIndex((shareItem: { BloombergCode: any; }) => shareItem.BloombergCode == element)
              if (index >= 0) {
                // const bloombergCode = this.shares[index].BloombergCode;
                const shareCode = this.shares[index].Code;
                // const exchngCode = this.shares[index].ExchangeCode;
                // const lName = this.shares[index].LongName;
                // const Ccy = this.shares[index].Ccy;
                // this.ShareBasket.push({ BloombergCode:bloombergCode,Code: shareCode, LongName: lName, Weight: '', Exchange: exchngCode });
                // this.setSelectedUnderlyingarray(lName, Ccy, shareCode, exchngCode, '', '', '', '', '', '', '');
                // FIN1EURINT-565 : Use single pricer share search pipe for Multipricer share search
		await this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
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
          this.priipsYN = this.defaultvaluesArr[i].Default_Value === 'Y' ? 'Yes' : 'No';
          break;

        case 'Language':
          this.language = this.defaultvaluesArr[i].Default_Value;

          break;


        case 'Country':
          this.country = this.defaultvaluesArr[i].Default_Value;
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
          break;


        case 'SettlementMethod':
          this.SettlementMethod = this.defaultvaluesArr[i].Default_Value;
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
          break;

        case 'AutocallFrequency':
          this.autoFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'PutableFrequency':
          this.putableFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'CallableFrequency':
          this.callableFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'AutocallableFrom':
          this.autoNonCall = this.defaultvaluesArr[i].Default_Value;
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

          break;

        case 'ERCouponPa':
          this.ERCoupon = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "ER Coupon p.a. (%)"
          break;

        case 'AddPeriodicCpn':
          this.periodicCouponFlag = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'PeriodicCpnType':
          this.cpnType = this.defaultvaluesArr[i].Default_Value;
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



  // function to disable fields based on default values - added by Priya L. on 03Mar2022 - assigned by Pranav D.
  enabledisablefields(fieldName: any) {
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

  MinMaxValidation(e: any, Pricestr: string) {
    try {
      this.ERReset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      target.classList.remove('error');
      $(".validate-popup").each(function () {
        $(this).remove();
      });
      $(".error-input").each(function () {
        $(this).remove();
      });

      //console.log(this.defaultvaluesArr);
      if (Pricestr !== "") {
        var cntrlIdx = this.defaultvaluesArr.findIndex((item: { Control_Name: string; }) => item.Control_Name === Pricestr);
        if (cntrlIdx > -1) {
          var MaxVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MaxVal.replace(/,/g, ''));
          var MinVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MinVal.replace(/,/g, ''));
          var ctrlVal = parseFloat(target.value.replace(/,/g, ''))
          if (this.defaultvaluesArr[cntrlIdx].MinVal !== '' && ctrlVal < MinVal) {
            // this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
            this.ErrorMsg = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be greater than ' + MinVal //+ '%.';
            target.classList.add('error');
          }
          if (this.defaultvaluesArr[cntrlIdx].MaxVal !== "" && ctrlVal > MaxVal) {
            this.ErrorMsg = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be less than ' + MaxVal //+ '%.';
            target.classList.add('error');
          }
        }
      }

      this.errorMsgChanged.emit(this.ErrorMsg);
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Min max validation on price button - added by Priya L. on 15Mar2022 - assigned by Pranav D.
  MinMaxValidationonPriceBtn(Pricestr: any, ControlID: any, ControlValue: any) {
    try {


      this.ErrorMsg = '';

      if (Pricestr !== "") {
        var cntrlIdx = this.defaultvaluesArr.findIndex((item: { Control_Name: any; }) => item.Control_Name === Pricestr);
        if (cntrlIdx > -1) {
          var MaxVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MaxVal.replace(/,/g, ''));
          var MinVal = parseFloat(this.defaultvaluesArr[cntrlIdx].MinVal.replace(/,/g, ''));
          var ctrlVal = parseFloat(ControlValue.toString().replace(/,/g, ''))
          if (this.defaultvaluesArr[cntrlIdx].MinVal !== '' && ctrlVal < MinVal) {
            // this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
            this.ErrorMsg = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be greater than ' + MinVal //+ '%.';
            this.elem.nativeElement.querySelector('#' + ControlID + this.ComponentIndex).classList.add('error');
          }
          if (this.defaultvaluesArr[cntrlIdx].MaxVal !== "" && ctrlVal > MaxVal) {
            this.ErrorMsg = this.defaultvaluesArr[cntrlIdx].Control_Name + ' should be less than ' + MaxVal //+ '%.';
            this.elem.nativeElement.querySelector('#' + ControlID + this.ComponentIndex).classList.add('error');
          }

          this.errorMsgChanged.emit(this.ErrorMsg);
        }
      }
    } catch (error) {

    }
  }

  // set foucs to next element || PriyaL || 28Apr2022 || Assigned by Pranav D
  setFocus() {
    this.namefield.nativeElement.focus();
  }

// Added by AdilP @16-06-2023 || FIN1EURINT-480 
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

  async ViewDoc(RFQ,LP,docType) {
    try {
      //this.RefreshDocs = this.ViewDoc(RFQ,LP,docType);
      //this.errorMsg = '';
      this.docsData = [];
      this.docsView = "VIEW";
      let showFlag = false;
      const res: any = await this.apifunctions.ViewTermsheet(RFQ, docType);
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: LP},
      ];
      if (res?.length) {
        //<Sudarshan | base64 to Bytes>
        if(res[0].DGI_Image == null){
          //this.errorMsg = res[0].Status.toString();
        }else
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
             const downloadLink = document.createElement('a');
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
            const obj = {
              "File Name": item["Document_Output_Path"],
              "Type": item["DocumentType"],
              "Language": item["DocumentLanguage"],
              "Country": item["DocumentCountry"],
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
  
  
      }// Changed by Jyoti S || 25-May-2023  || END
      //this.TSLoadFlag= false;
      //this.KIDLoadFlag= false;
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }
  // Tooltip to display all fields in clear and full view
  replaceStr(str){
    let re = /,/gi;
    let newstr = str.replace(re, ", ");
    return newstr;
  }

  getSolveFor(str){
    if(str === 'IBPrice'){
      return 'Reoffer (%)';
    }
    else if(str === 'PutStrike'){
      return 'Put Strike (%)';
    } 
    else if(str === 'KI'){
      return 'KI Barrier (%)';
    } 
    else if(str === 'Coupon'){
      return 'Coupon (%)';
    } 
    else 
    {
      return '';
    }
  }

  getUnderlyings(){
    let str = (this.ShareBasket[0] === undefined || this.ShareBasket[0].BloombergCode === undefined ? '' : this.ShareBasket[0].BloombergCode);
    str = str + (this.ShareBasket[1] === undefined || this.ShareBasket[1].BloombergCode === undefined ? '' : ', ' + this.ShareBasket[1].BloombergCode);
    str = str + (this.ShareBasket[2] === undefined || this.ShareBasket[2].BloombergCode === undefined ? '' : ', ' + this.ShareBasket[2].BloombergCode);
    str = str + (this.ShareBasket[3] === undefined || this.ShareBasket[3].BloombergCode === undefined ? '' : ', ' + this.ShareBasket[3].BloombergCode);
    str = str + (this.ShareBasket[4] === undefined || this.ShareBasket[4].BloombergCode === undefined ? '' : ', ' + this.ShareBasket[4].BloombergCode);
    return str;
  }

  // HSBCECCLI-56 : Custom Autocall Changes in Bulk Pricer || 31-Aug-2023
  async customBarrier() {
    try {
      if (this.autocallCouponType === 'Custom Barrier') {
        let tenorinmonth = 0;
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
        this.customBarrierArr = await this.apifunctions.GetTriggerValues(tenorinmonth, this.autoFreq === 'Yearly' ? 'Annually' : this.autoFreq, this.autoTrigger, '', this.autoNonCall);
        this.customBarrierArr.forEach(element => {
          element.firstAutocall = false;
        });
        const idx = this.customBarrierArr.findIndex((el) => el.OutTrigger !== '-');
        if (idx >= 0) {
          this.customBarrierArr[idx].firstAutocall = true;
        }
      }
    } catch (error) {
    }
  }

}
