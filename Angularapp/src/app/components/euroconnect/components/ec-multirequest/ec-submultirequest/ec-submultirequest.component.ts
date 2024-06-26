import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Output, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { Guid } from 'guid-typescript';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient } from '@angular/common/http';


declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    sortBy(p): Array<T>;
  }
}
Array.prototype.sortBy = function (p): Array<any> {
  try {
    // tslint:disable-next-line: only-arrow-functions
    // tslint:disable-next-line: only-arrow-functions
    return this.slice(0).sort(function (a, b) {
      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
  } catch (error) { }
};

declare global {
  interface Array<T> {
    stringsortBy(p): Array<T>;
  }
}
Array.prototype.stringsortBy = function (p): Array<any> {
  try {
    // tslint:disable-next-line: only-arrow-functions
    return this.slice(0).sort(function (a, b) {
      return (a[p].split('-')[1] > b[p].split('-')[1]) ? 1 : (a[p].split('-')[1] < b[p].split('-')[1]) ? -1 : 0;
    });
  } catch (error) { }
};

@Component({
  selector: 'app-ec-submultirequest',
  templateUrl: './ec-submultirequest.component.html',
  styleUrls: ['./ec-submultirequest.component.scss']
})
export class EcSubmultirequestComponent implements OnInit, OnDestroy {
  

  pageActive: Boolean = true;
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
  // @Input() toggleData: any;

  @Output() errorMsgChanged: EventEmitter<string> = new EventEmitter();
  @Output() scheduleMsgChanged: EventEmitter<string> = new EventEmitter();
  @ViewChild('focusable', { static: false }) namefield: ElementRef; // fetch next focusable element || PriyaL || 28Apr2022 || Assigned by Pranav D

  timeoutMsg: string;
  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;
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
  Tenor = [];

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
    UnderlyingFive: {}
  };

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
  Token = '';
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg = '';
  clearFlag: boolean;
  format: any;
  // FIN1EURINT-104 : Participation pay off addition in 1Europe
  Format = [];
  IssueDateOffset = [];
  customTenor = '';
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
  defaultTimeout: number;
  issuePrice: any = '';
  tempXML = '';
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
  paymentshift: any;
  expshift: any;
  issueDate = '';
  addValue = '';

  //// Participation Variables
  // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
  country = 'United Kingdom of Great Britain and Northern Ireland'; 
  language = 'English'; 

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

  LeverageYN: any = 'No';
  LeverageFlag = false;

  // Subscription
  // Autocallable Phoenix
  phxPriceFlagSubscription: Subscription;
  phxSaveFlagSubscription: Subscription;
  phxLoadFlagSubscription: Subscription;
  phxPriceSubscription: Subscription;
  schedulePriceSubscription: Subscription;
  schedulePopupSubscription: Subscription;

  // RC
  rcPriceFlagSubscription: Subscription;
  rcSaveFlagSubscription: Subscription;
  rcLoadFlagSubscription: Subscription;
  rcPriceSubscription: Subscription;

  // Credit
  creditPriceFlagSubscription: Subscription;
  creditSaveFlagSubscription: Subscription;
  creditLoadFlagSubscription: Subscription;
  creditPriceSubscription: Subscription;
  creditAttachSubscription: Subscription;
  creditDetachSubscription: Subscription;

  // Participation
  ptcPriceFlagSubscription: Subscription;
  ptcSaveFlagSubscription: Subscription;
  ptcLoadFlagSubscription: Subscription;
  ptcPriceSubscription: Subscription;

  cloneFlagSubscription: Subscription;
  cloneDataSubscription: Subscription;
  toggleFlagSubscription: Subscription;

  autoFreqArr: any = [];
  freqArr = ['1m', '2m', '3m', '4m', '6m', '12m'];
  TSFlag = false;
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
  // FIN1EURINT-520 | Request for TS and KID links disable for LPs not supporting documentation
  docSupportStatus: any = {};

  // accudecu fields
  accuSolveFor = 'Strike';
  noOfShares: any = 1000; //Modified by Priya L | 1Apr2022
  estimatedNotional: any = '0.00';
  accuTenor = 6;
  accuTenorType = 'Month';  //replaced 'M' with 'Month'- change by Ashwini H. | 16 Dec 2022 
  accuStrike = '';
  accuUpfront = '0.50';
  accuKOPerInit = '102.00';
  accuKOSttlType = '1 Settl. Cycle after KO';
  accuFreq = "MONTHLY";
  accuGuarantee: any = 1;
  accuChkLeverage = true;
  showSortedLpPopup: boolean;
  showToggleSortedLpPopup: boolean;
  defaultvaluesArr: any;
  accuTenorMinMonth: any;
  accuTenorMaxMonth: any;
  accrualDays: any;

  // new config variable || Amogh k || 20Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';

  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';
  commonData: any = [];

  displayFundingSection : boolean; // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
  showCptyId: boolean;
  // FIN1EURINT-478 || Fields should switch vertically (within same column) with 'Tab' in Bulk Pricer
  totalFields: number;
  ngOnDestroy(): void {
    this.pageActive = false;
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





    // RC
    if (this.rcPriceFlagSubscription) {
      this.rcPriceFlagSubscription.unsubscribe();
    }
    if (this.rcSaveFlagSubscription) {
      this.rcSaveFlagSubscription.unsubscribe();
    }
    if (this.rcLoadFlagSubscription) {
      this.rcLoadFlagSubscription.unsubscribe();
    }
    if (this.rcPriceSubscription) {
      this.rcPriceSubscription.unsubscribe();
    }


    // Credit
    if (this.creditPriceFlagSubscription) {
      this.creditPriceFlagSubscription.unsubscribe();
    }
    if (this.creditSaveFlagSubscription) {
      this.creditSaveFlagSubscription.unsubscribe();
    }
    if (this.creditLoadFlagSubscription) {
      this.creditLoadFlagSubscription.unsubscribe();
    }
    if (this.creditPriceSubscription) {
      this.creditPriceSubscription.unsubscribe();
    }


    // this.creditAttachSubscription.unsubscribe();
    // this.creditDetachSubscription.unsubscribe();

    // Participation
    if (this.ptcPriceFlagSubscription) {
      this.ptcPriceFlagSubscription.unsubscribe();
    }
    if (this.ptcSaveFlagSubscription) {
      this.ptcSaveFlagSubscription.unsubscribe();
    }
    if (this.ptcLoadFlagSubscription) {
      this.ptcLoadFlagSubscription.unsubscribe();
    }
    if (this.ptcPriceSubscription) {
      this.ptcPriceSubscription.unsubscribe();
    }

    if (this.cloneFlagSubscription) {
      this.cloneFlagSubscription.unsubscribe();
    }
    if (this.cloneDataSubscription) {
      this.cloneDataSubscription.unsubscribe();
    }
    if (this.toggleFlagSubscription) {
      this.toggleFlagSubscription.unsubscribe();
    }

    this.apifunctions.priceFlag.next(false);
    this.apifunctions.rcPriceFlag.next(false);
    this.apifunctions.creditFlag.next(false);
    this.apifunctions.ptcPriceFlag.next(false);

    this.apifunctions.saveFlag.next(false);
    this.apifunctions.rcsaveFlag.next(false);
    this.apifunctions.creditSaveFlag.next(false);
    this.apifunctions.ptcsaveFlag.next(false);
    if (this.schedulePriceSubscription) {
      this.schedulePriceSubscription.unsubscribe();
    }
    if (this.schedulePopupSubscription) {
      this.schedulePopupSubscription.unsubscribe();
    }
    this.apifunctions.schedulePriceFlag.next({});
    this.apifunctions.schedulePopupFlag.next(false);
  }

  constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, public datepipe: DatePipe , public http: HttpClient) {
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
      $(document).on('click', function (event) {
        if (!$(event.target).closest('#menucontainer').length) {
          that.closePopups()
        }
      });

    } catch (error) {
      //console.log('Error:', error);
    }
  }


  ngOnInit() {
    console.log(" in sumulit")
    this.pageActive = true;
    try {
      this.pageloadflag=true;
      // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
      this.displayFundingSection = false;
      this.showCptyId = false; // FIN1EURINT-401
      $('#loading').show();
      // FIN1EURINT-478 || Fields should switch vertically (within same column) with 'Tab' in Bulk Pricer
      this.totalFields = 30;
      setTimeout(async () => {
      // FIN1EURINT-520 | Request for TS and KID links disable for LPs not supporting documentation
        this.docSupportStatus = await this.apifunctions.GetDocumentSupportStatus(this.ProductName);//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
        console.log('123456');
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
        this.reset();

        if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
          this.shares = await this.apifunctions.BBVALoadShares('EQ', "", this.ProductName);
        }
        this.templateMappingArr = await this.fnGetProdTemplate();
        this.fnGetValidation();
        this.fnPTCGetValidation();
        await this.getAttachDetachData();



        this.priceProvidersArr = this.apifunctions.priceProviders;

        // if(this.ProductName == '')
        // this.priceProvidersArr  = this.apifunctions.GetPriceProviderDetails('AutocallablePhoenix');
        this.priceProvidersArr = await this.apifunctions.GetPriceProviderDetails(this.ProductName);

        //console.log(this.ProductName)
        //console.log(this.priceProvidersArr);

        //////////////////////// Credit Tranche subscriber Start
        this.indexTrancheArr = this.apifunctions.indexTrancheArr;
        this.floatingRefArr = this.apifunctions.floatingRefArr;
        this.indexTrancheArr = this.indexTrancheArr.stringsortBy('LongName');

        // credit tranche price flag
        this.creditPriceFlagSubscription = this.apifunctions.creditpriceFlagCheck.subscribe(async flag => {
          if (flag) {
            await this.validationOnButtonCT();
            if (this.indexTranche !== '' && this.ErrorMsg === '') {
              await this.CreditPrice();
            }
          }
        });
        // credit tranche  price subsrciber
        this.creditPriceSubscription = this.commonfunctions.submultiCreditSignalRPrices.subscribe(res => {

          const prices = res.price;
          try {
            if (prices && prices.length > 0) {
              if (prices && that.ComponentIndex === res.Index) {

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
                if (this.sortedAllPrices.length > 0) {
                  that.loadflag = false;
                  let price = '';
                  if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                    price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                  }
                  switch (this.sortedAllPrices[0].solveFor) {
                    case 'Coupon':
                      this.creditSpread = price;
                      that.replySolveFor = 'Coupon';
                      break;
                    case 'Reoffer':
                      this.creditReofferPrice = price;
                      that.replySolveFor = 'Reoffer';
                      break;
                  }
                  if (price !== '') {
                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor
                      + this.ComponentIndex).classList.add('reply');
                  }
                  that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                  that.orderID = this.sortedAllPrices[0].id;
                  that.orderStatus = this.sortedAllPrices[0].status;

                }

                if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
                  that.timeLeft = 0;
                }

                // if (this.sortedAllPrices.length > 0) {
                //   this.timeLeft = -1;
                //   this.timeoutMsg = '';
                //   clearInterval(this.interval);
                //   (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
                //   this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
                // }
                // if (this.timeLeft === 0) {
                //   this.sortedAllPrices = [];
                //   // this.loadflag = false;
                // } else {
                //   this.timeoutMsg = '';
                // }
              }
            }
          } catch (error) {

          }

        });
        // credit tranche save
        this.creditSaveFlagSubscription = this.apifunctions.creditSaveFlagCheck.subscribe(async flag => {
          if (flag) {
            await this.validationOnButtonCT();
            if (this.indexTranche !== '') {
              this.generateCreditSaveXML();
            }
          }
        });
        // this.creditAttachSubscription = this.apifunctions.getAttachPercentSF.subscribe(res1 => {
        //   if (res1) {
        //     if (res1['index'] === that.ComponentIndex) {
        //       var res = res1['data'];
        //       if (res) {

        //         if (res['errorMessage'] !== undefined) {
        //           if (res['errorMessage'] == "") {
        //             if (parseFloat(this.DetachVal) - parseFloat(res['Attach']) < parseFloat(res['Width'])) {
        //               that.ErrorMsg = "Difference between Attach and Detach should be at least " + parseFloat(res['Width']);
        //               if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
        //                 that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add("error");
        //               }
        //               that.errorMsgChanged.emit(that.ErrorMsg);
        //               return false;
        //             }
        //             else {
        //               that.ErrorMsg = "";
        //               that.errorMsgChanged.emit(that.ErrorMsg);
        //               if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
        //                 that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.remove("error");
        //               }
        //             }
        //             that.Attach = parseFloat(res['PercentageValue']).toFixed(4);
        //             that.AttachVal = res['Attach'];
        //             if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
        //               that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.remove("error");
        //             }
        //             that.getAttachDetachData();
        //             if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex) !== null) {
        //               if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.contains("error")) {
        //                 this.calculateDetachPercent();
        //               }
        //             }
        //           }
        //           else {
        //             that.ErrorMsg = res['errorMessage'];
        //             if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
        //               that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add("error");
        //             }
        //             that.errorMsgChanged.emit(that.ErrorMsg);
        //             this.Attach = "";
        //           }
        //         }
        //       }
        //     }
        //   }
        // });
        // this.creditDetachSubscription = this.apifunctions.getDetachchPercentSF.subscribe(res1 => {
        //   if (res1) {
        //     if (res1['index'] === that.ComponentIndex) {
        //       var res = res1['data'];
        //       if (res) {
        //         if (res['errorMessage'] !== undefined) {
        //           if (res['errorMessage'] == "") {
        //             if (parseFloat(res['Detach']) - parseFloat(this.AttachVal) < parseFloat(res['Width'])) {
        //               that.ErrorMsg = "Difference between Attach and Detach should be at least " + parseFloat(res['Width']);
        //               if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
        //                 that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.add("error");
        //               }
        //               that.errorMsgChanged.emit(that.ErrorMsg);
        //               return false;
        //             }
        //             else {
        //               that.ErrorMsg = "";
        //               that.errorMsgChanged.emit(that.ErrorMsg);
        //               if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
        //                 that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.remove("error");
        //               }
        //             }
        //             that.Detach = parseFloat(res['PercentageValue']).toFixed(4);
        //             that.DetachVal = res['Detach'];
        //             if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
        //               that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.remove("error");
        //             }
        //             that.getAttachDetachData();
        //             if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex) !== null) {
        //               if (that.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.contains("error")) {
        //                 this.calculateAttachPercent();
        //               }
        //             }
        //           }
        //           else {
        //             that.ErrorMsg = res['errorMessage'];
        //             if (that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
        //               that.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.add("error");
        //             }
        //             that.errorMsgChanged.emit(that.ErrorMsg);
        //             this.Detach = "";
        //           }
        //         }
        //       }
        //     }
        //   }
        // });

        this.creditLoadFlagSubscription = this.apifunctions.CreditLoadFlagCheck.subscribe(flag => {
          if (flag) {
            this.togglesortedAllPrices = [];
            this.indexTranche = '';
            this.apifunctions.creditloadFlag.next(false);
          }
        });

        //////////////////////// Credit Tranche subscriber End

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
                  }
                  if (price !== '') {
                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor
                      + this.ComponentIndex).classList.add('reply');
                  }
                  that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                  that.orderID = this.sortedAllPrices[0].id;
                  that.orderStatus = this.sortedAllPrices[0].status;

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
                // if (this.timeLeft === 0) {
                //   this.sortedAllPrices = [];
                //   // this.loadflag = false;
                // } else {
                //   this.timeoutMsg = '';
                // }
              }
            }
          } catch (error) {

          }

        });

        this.phxSaveFlagSubscription = this.apifunctions.saveFlagCheck.subscribe(async flag => {
          if (flag) {
            if (this.ProductName == 'Accumulator' || this.ProductName == 'Decumulator') {
              this.validationOnButtonAccuDecu();
              if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
                this.generateSaveXMLAccuDecu();
              }
            }
            else {
              await this.validationOnButton();
              if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
                this.generateSaveXML();
              }
            }
          }
        });

        this.phxPriceFlagSubscription = this.apifunctions.priceFlagCheck.subscribe(async flag => {
          if (flag) {
            this.togglesortedAllPrices = [];
            //console.log(this.ProductName);

            if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
              this.validationOnButtonAccuDecu();
              if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
                await this.accuPrice();
              }
            }
            else {
              await this.validationOnButton();
              if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
                await this.Price();
              }
            }
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

        ///////////////// RC Subscribers Start

        this.rcPriceSubscription = this.commonfunctions.submultiRCSignalRPrices.subscribe(res => {
          const prices = res.price;
          try {
            if (prices && prices.length > 0) {
              if (prices && that.ComponentIndex === res.Index) {
                this.sortedAllPrices = [];
                this.AllPrices = [];
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < prices.length; i++) {

                  if (this.AllPrices.findIndex(record => record.rfq === prices[i].rfqID) === -1) {
                    if (prices[i].value !== null && prices[i].value !== "") {
                      this.AllPrices.push({
                        rfq: prices[i].rfqID,
                        lp: prices[i].ppID,
                        Price: (prices[i].value === null ? '-' : prices[i].value),// (prices[i].value === null ? 'Rejected' : parseFloat(prices[i].value).toFixed(2)),
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

                if (this.sortedAllPrices.length > 0) {
                  that.loadflag = false;
                  let price = '';
                  if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                    price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                  }
                  switch (this.sortedAllPrices[0].solveFor) {
                    case 'Strike':
                      this.Strike = price;
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
                  }
                  if (price !== '') {
                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor
                      + this.ComponentIndex).classList.add('reply');
                  }
                  that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                  that.orderID = this.sortedAllPrices[0].id;
                  that.orderStatus = this.sortedAllPrices[0].status;

                }
                if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
                  that.timeLeft = 0;
                }
                // if (this.sortedAllPrices.length > 0) {
                //   this.timeLeft = -1;
                //   this.timeoutMsg = '';
                //   clearInterval(this.interval);
                //   (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
                //   this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
                // }
                // if (this.timeLeft === 0) {
                //   this.sortedAllPrices = [];
                //   // this.loadflag = false;
                // } else {
                //   this.timeoutMsg = '';
                // }
              }
            }
          } catch (error) {

          }

        });

        this.rcPriceFlagSubscription = this.apifunctions.rcpriceFlagCheck.subscribe(async flag => {

          if (flag) {
            this.togglesortedAllPrices = [];
            await this.validationOnButton();
            if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
              await this.RCPrice();
            }
          }
        });

        this.rcSaveFlagSubscription = this.apifunctions.rcsaveFlagCheck.subscribe(async flag => {
          if (flag) {
            await this.validationOnButton();
            if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
              this.generateSaveRCXML();
            }
          } else {
          }
        });

        this.rcLoadFlagSubscription = this.apifunctions.RCLoadFlagCheck.subscribe(flag => {
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
            this.apifunctions.rcloadFlag.next(false);
          }
        });

        ///////////////////// RC Subscribers end /////////////////////

        ////////////////////// Participation Subscriber Start ///////////////////

        this.ptcPriceSubscription = this.commonfunctions.submultiPTCSignalRPrices.subscribe(res => {
          const prices = res.price;
          try {
            if (prices && prices.length > 0) {
              if (prices && that.ComponentIndex === res.Index) {
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
                if (this.sortedAllPrices.length > 0) {
                  that.loadflag = false;
                  let price = '';
                  if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                    price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                  }
                  switch (this.sortedAllPrices[0].solveFor) {
                    case 'IBPrice':
                      this.IBPrice = price;
                      break;

                  }
                  if (price !== '') {
                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor
                      + this.ComponentIndex).classList.add('reply');
                  }
                  that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                  that.orderID = this.sortedAllPrices[0].id;
                  that.orderStatus = this.sortedAllPrices[0].status;
                }
                if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
                  that.timeLeft = 0;
                }
                // if (this.sortedAllPrices.length > 0) {
                //   this.timeLeft = -1;
                //   this.timeoutMsg = '';
                //   clearInterval(this.interval);
                //   (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
                //   this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
                // }
                // if (this.timeLeft === 0) {
                //   this.sortedAllPrices = [];
                //   // this.loadflag = false;
                // } else {
                //   this.timeoutMsg = '';
                // }
              }
            }
          } catch (error) {

          }

        });

        this.ptcPriceFlagSubscription = this.apifunctions.ptcpriceFlagCheck.subscribe(async flag => {

          if (flag) {
            this.togglesortedAllPrices = [];
            await this.PTCValidation();
            if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
              await this.PTCPriceClick();
            }
          }
        });

        this.ptcSaveFlagSubscription = this.apifunctions.ptcsaveFlagCheck.subscribe(async flag => {
          if (flag) {
            await this.PTCValidation();
            if (this.ShareBasket.length > 0 && this.ErrorMsg === '') {
              this.generatePTCSaveXML();
            }
          } else {
          }
        });

        this.ptcLoadFlagSubscription = this.apifunctions.PTCLoadFlagCheck.subscribe(flag => {
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
            this.apifunctions.ptcloadFlag.next(false);
          }
        });

        ///////////////////// Participation Subscriber End /////////////////////


        ///////////// Default and CLone Data Start

        // Get Currency
        try {

          this.ReceivedCCY.forEach((element) => {
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

        this.ddlNoteCcy = 'EUR';

        const d = new Date();
        d.setDate(d.getDate() + 7);

        this.Code = () => {
          // FIN1EURINT-104 : Participation pay off addition in 1Europe
          let code = '';
          if (this.SelectedUnderlyingBasket) {
            // if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.Code) {
            //   code = this.SelectedUnderlyingBasket.UnderlyingOne.Code;
            // }
            // if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.Code) {
            //   code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.Code;
            // }
            // if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.Code) {
            //   code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.Code;
            // }
            // if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.Code) {
            //   code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.Code;
            // }
            // if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.Code) {
            //   code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.Code;
            // }
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
          // FIN1EURINT-104 : Participation pay off addition in 1Europe
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

        if (this.templateMappingArr && this.templateMappingArr.length > 0) {
          // FIN1EURINT-104 : Participation pay off addition in 1Europe
          if (this.ProductName === 'Participation') {
            this.commonData = await this.apifunctions.GetCommonDataEuroConnect(this.templateMappingArr[0].template);
            if (this.commonData && this.commonData.length > 0) {
              this.filldropdownfromcommandata();
            }
          }
          // FIN1EURINT-104 : Participation pay off addition in 1Europe
          this.defaultvaluesArr = this.apifunctions.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, this.templateMappingArr[0].template);
          if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {

            console.log(this.defaultvaluesArr);
            this.setdefaultvalues();
          }

        }

        if (this.data !== undefined && this.data.SolveFor !== undefined) { // load portfolio and toggle data

          this.ShareBasket = [];
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];

          // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
	  if (this.data.ShareBBGRIC1 !== undefined && this.data.ShareBBGRIC1 !== '') {
            await this.showUnderlying('', this.data.ShareBBGRIC1);
          }
          if (this.data.ShareBBGRIC2 !== undefined && this.data.ShareBBGRIC2 !== '') {
            await this.showUnderlying('', this.data.ShareBBGRIC2);
          }
          if (this.data.ShareBBGRIC3 !== undefined && this.data.ShareBBGRIC3 !== '') {
            await this.showUnderlying('', this.data.ShareBBGRIC3);
          }
          if (this.data.ShareBBGRIC4 !== undefined && this.data.ShareBBGRIC4 !== '') {
            await this.showUnderlying('', this.data.ShareBBGRIC4);
          }
          if (this.data.ShareBBGRIC5 !== undefined && this.data.ShareBBGRIC5 !== '') {
            await this.showUnderlying('', this.data.ShareBBGRIC5);
          }
	  // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023

          var idx = this.shares.findIndex(item => item.BloombergCode === this.data.ShareBBGRIC1);

          if (idx > -1) {
            this.exchngCode = this.shares[idx].ExchangeCode;
            this.shareCode = this.shares[idx].Code;
          }


          this.stkshift = this.data.ComputedStrikeFixingLag;
          this.paymentshift = this.data.ComputedSettlementPeriodSoftTenor;
          this.expshift = this.data.ComputedPayoffSoftTenor;
          this.changeAutoFreqOnTenor();

          this.SolveForvalue = this.data.SolveFor;
          this.creditSolveFor = this.data.SolveFor;
          this.ddlNoteCcy = this.data.Ccy;
          this.altObservation = this.data.AltCouponObservation;
          this.altCoupon = this.data.AltCouponPer;
          this.Attach = this.data.AttachPer;
          if (this.data.AttachValue !== '') {
            // tslint:disable-next-line: radix
            this.AttachVal = parseInt(this.data.AttachValue);
          } else {
            this.AttachVal = '';
          }
          this.cpnTrigger = (this.data.CouponBarrier === '0.00' || this.data.CouponBarrier === '0') ? '' : this.data.CouponBarrier;
          this.creditcouponBasis = this.data.CouponBasis;
          this.cpnObservation = this.data.CouponObs;
          this.cpnCoupon = this.data.CouponPer;
          if (this.data.SolveFor !== 'Coupon') {
            this.creditSpread = this.data.CouponPer;
          } else {
            this.creditSpread = '';
          }
          this.cpnType = this.data.CouponType;
          this.Detach = this.data.DetachPer;
          if (this.data.DetachValue !== '') {
            // tslint:disable-next-line: radix
            this.DetachVal = parseInt(this.data.DetachValue);
          } else {
            this.DetachVal = '';
          }

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
          if (this.data.SolveFor !== 'Reoffer') {
            this.creditReofferPrice = this.data.ReofferPrice;
          } else {
            this.creditReofferPrice = '';
          }

          this.indexTranche = this.data.IndexCode;
          this.creditTenor = this.data.TenorPer;
          this.creditcouponType = this.data.CouponType;
          this.creditIssuePrice = this.data.IssuePrice;
          this.toggleFlag = this.data.SubTemplate === 'CreditTranche' ? 'Firm' : 'Ind';

          // Participation
          this.capitalGuaranteed = this.data.DownsideCapitalProtectionPercent;
          this.downLowerStrike = this.data.DownsideParticipationCapPercent;
          this.downLeverage = this.data.DownsideParticipationPercent;
          this.downBarrierLevel = this.data.InitialInputKIBarrierPercent;
          this.upBarrierLevel = this.data.InitialInputKOBarrierPercent;
          this.downStrike = this.data.InputDownsideStrikePercent;
          this.downBarrierType = this.data.InputKIBarrierFrequency;
          this.upBarrierType = this.data.InputKOBarrierFrequency;
          this.upCoupon = this.data.InputMinimumCouponPercentPA;
          this.upRebate = this.data.InputRebatePercent;
          this.upStrike = this.data.InputStrikePercent;
          this.participationType = this.data.ProductType;
          this.upUpperStrike = this.data.UpsideParticipationCapPercent;
          this.upGearing = this.data.UpsideParticipationPercent;
          this.issuePrice = this.data.IssuePrice;
          if (this.ProductName === 'Participation') {
            this.format = this.data.Wrapper;
          }
          this.guaranteedCouponFreq = this.data.InputFixedCouponFrequencyPeriod;
          this.guaranteedCoupon = this.data.GuaranteedCoupon;

          this.Notional = this.data.Size ? this.commonfunctions.formatNotional(this.data.Size) : '';
          this.autoStepDown = this.data.StepDown;
          this.Strike = this.data.Strike;

          // this.stkshift = '0B';
          // this.expshift = '1Y';
          // if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
          //     // accudecu date fields to be added
          // }
          // else 
          if (this.ProductName === 'CreditTranche') {
            // this.paymentshift = '10B';
            await this.setIssueDate(this.paymentshift);
          } else {

            // commented to remove unnecssary api call || PriyaL || 02May2022
            // this.paymentshift = '5B';
            // tslint:disable-next-line: max-line-length
            // this.stkdate = this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

            // this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
            // if (this.Dates) {
            //   this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            //   // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
            // }

            // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
            // this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

            // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
            // this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            // // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
	// FIN1EURINT-104 : Participation pay off addition in 1Europe
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
            this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, parseShifter, this.stkdate);
            //console.log(this.Dates);
            this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          } else {
            this.settdate = this.data.PaymentDate;
          }

          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);

          this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          if (this.data.customTenor && this.expshift == 'Custom') {

            this.customTenor = this.data.customTenor
          };

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

          if (this.data.downLeverageYN !== undefined) {
            this.downLeverageYN = this.data.downLeverageYN;
          } else {
            if (this.downLeverage === '100.00') {
              this.downLeverageYN = 'No';
            } else {
              this.downLeverageYN = 'Yes';
            }
          }

          //accudecu fields when load portfolio 
          if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
            this.accuSolveFor = this.data.SolveFor; //'strike';
            this.noOfShares = this.data.SharesQuantity; //1000;
            // this.estimatedNotional = this.data.TotalNotional; //'0.00';
            // c
            // this.estimatedNotional = this.data.TotalNotional ? this.data.TotalNotional.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''; //'0.00';
            // this.accuTenor = this.data.TenorPer.split('-')[0]; //'6';
            // this.accuTenorType = this.data.TenorPer.split('-')[1]; //'M';

            // set tenor type modified || PriyaL || 30Apr2022 || issues reported by RishabhS
            if (this.data.TenorType) {
              // this.accuTenor = this.data.TenorPer.split('-')[0]; //'6';
              // this.accuTenorType = this.data.TenorPer.split('-')[1]; //'M';
              // set tenor type modified || PriyaL || 02May2022 || issues reported by AberJ
              this.accuTenor = this.data.TenorPer; //'6';
              this.accuTenorType = this.data.TenorType; //'M';
            } else {
              this.accuTenor = this.data.TenorPer.toString().substr(0, this.data.TenorPer.length - 1);
              this.accuTenorType = this.data.TenorPer.toString().substr(this.data.TenorPer.length - 1, 1) === 'M' ? 'Month' : 'Year';
            }
            this.accuStrike = this.data.Strike; //0.00;
            this.accuUpfront = this.data.Upfront; // 0.50;
            this.accuKOPerInit = this.data.KOPer; //102.00;
            this.accuKOSttlType = this.data.KOType; //'1 Settl. Cycle after KO';
            this.accuFreq = this.data.Frequency; //"Monthly";
            this.accuGuarantee = this.data.Guarantee; //1;
            this.accuChkLeverage = this.data.LeverageYN == 'Y' ? true : false;
            if (this.data.TenorType !== undefined) {
              this.accuTenorType = this.data.TenorType;
            }
            // Added by Suvarna P | 28Apr2022 | request TS button when toggle between Horizontal/Vertical layout || assigned by pranav D
            if (this.data.TSFlag) {
              this.TSFlag = this.data.TSFlag;
            }


            if (this.data.TotalNotional === undefined) {
              await this.calculateNotional(this.shareCode, this.Exchange, this.noOfShares);
            }
          }

          this.data = {};
          // this.apifunctions.toggleFlag.next(false);
        } else {

          // Commented below code as not required for LGT || PriyaL || 28Apr2022 - EULGTINT -163
          // if (this.ProductName === 'CreditTranche') {
          //   this.apifunctions.getAttachPercentSF.next('');
          //   this.apifunctions.getDetachchPercentSF.next('');
          //   this.creditcouponType = 'Fixed';
          //   this.floatingRef = '';
          //   this.creditSolveFor = 'Coupon';
          //   this.creditSpread = '';
          //   this.creditReofferPrice = '98.50';
          //   this.creditIssuePrice = '100.00';
          //   this.creditcouponBasis = '30/360';
          //   this.creditTenor = '5Y';
          //   this.creditcouponFreq = 'Monthly';
          //   this.Notional = '1,000,000.00';
          // }

          // this.stkshift = '0B';
          // if (this.ProductName === 'CreditTranche') {
          //   // this.paymentshift = '10B';
          //   this.setIssueDate('10B');
          // } else {
          //   this.paymentshift = '5B';
          // }
          // this.expshift = '1Y';

          // this.changeAutoFreqOnTenor();

          // // tslint:disable-next-line: max-line-length
          // // this.stkdate = this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);


          // if (this.ProductName !== 'Accumulator' || this.ProductName !== 'Decumulator') {
          //   this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
          //   if (this.Dates) {
          //     this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          //     // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          //   }

          //   this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
          //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          //   // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

          //   this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
          //   this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          //   // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

          // }
          // // this.IBPrice = '';// prev. default
          // this.IBPrice = '99.50';

          // // this.SolveForvalue = 'IBPrice'; // prev. default
          // this.SolveForvalue = 'Coupon';
          // this.Notional = '1,000,000.00';
          // this.Strike = '100.00';
          // this.LeverageFlag = false;
          // this.LeverageYN = 'No';

          // this.autoTrigger = '100.00';
          // this.autoFreq = '3m';
          // this.autoStepDown = '0.00';
          // this.autoNonCall = '';
          // if (this.ProductName === 'AutocallablePhoenix') {
          //   this.cpnType = 'Total Memory';
          //   this.cpnTrigger = '70.00';
          // } else {
          //   this.cpnType = 'Fixed Coupon';
          //   this.cpnTrigger = '';
          // }

          // this.MemoryPeriods = '';

          // if (this.ProductName !== 'ReverseConvertible') {
          //   this.cpnFreq = '3m';
          // } else {
          //   this.cpnFreq = 'At Maturity';
          // }
          // this.cpnObservation = 'PerFreq';
          // // this.cpnCoupon = '5.00'; // prev. default
          // this.cpnCoupon = '';

          // this.fundType = '';
          // this.fundFreq = '';
          // this.fundRate = '';

          // if (this.ProductName === 'ReverseConvertible') {
          //   this.barrierType = 'None';
          //   this.barrierLevel = '';
          // } else {
          //   this.barrierType = 'At Expiry';
          //   this.barrierLevel = '60.00';
          // }

          // this.altLevel = '';
          // this.altObservation = 'PerAnnum';
          // this.altCoupon = '';

          // this.autocallCoupon = '0.00';
          // this.autocallCouponType = 'Flat';
          // this.issuePrice = '100.00';
          // this.sortedAllPrices = [];

          // // Participation default values

          // this.participationType = 'Booster';
          // this.guaranteedCoupon = '';

          // if (this.ProductName === 'Participation') {
          //   this.SolveForvalue = 'IBPrice';
          //   this.IBPrice = '';
          // }

          // this.guaranteedCouponFreq = '';
          // this.Notional = '1,000,000.00';
          // this.upStrike = '100.00';
          // this.upGearing = '100.00';
          // this.downStrike = '100.00';
          // this.downLeverage = '100.00';
          // // this.downLowerStrike = '';
          // this.downLowerStrike = '';
          // this.capitalGuaranteed = '';


          // this.fundType = '';
          // this.fundFreq = '';
          // this.fundRate = '';
          // this.upBarrierLevel = '';
          // this.upBarrierType = 'None';
          // this.downBarrierType = 'None';
          // this.downBarrierLevel = '';
          // this.issuePrice = '100.00';
          // this.upUpperStrike = '110.00';
          // this.upRebate = '';
          // this.upCoupon = '';
          // this.downLeverageYN = 'No';

          // accudecu default fields to be added
          if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
            this.accuSolveFor = 'Strike';
            this.noOfShares = 10;
            this.estimatedNotional = '0.00';
            this.accuTenor = 6;
            this.accuTenorType = 'Month';   //replaced 'M' with 'Month'- change by Ashwini H. | 16 Dec 2022 
            this.accuStrike = '';
            this.accuUpfront = '0.50';
            if (this.ProductName === 'Decumulator') {
              this.accuKOPerInit = '98.00';
            } else {
              this.accuKOPerInit = '102.00';
            }
            this.accuKOSttlType = '1 Settl. Cycle after KO';
            this.accuFreq = "MONTHLY";
            this.accuGuarantee = 1;

            if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
              this.ShareBasket = [];
              this.SelectedUnderlyingBasket = [];
              this.SelectedUnderlyingBasketArray = [];
              //console.log(this.defaultvaluesArr);
              this.setdefaultvalues();
            }
            await this.calculateNotional(this.shareCode, this.Exchange(), this.noOfShares);


          }
          // FIN1EURINT-104 : Participation pay off addition in 1Europe
          else if (this.ProductName === 'Participation') { 
            this.participationType = 'Booster';
            this.guaranteedCoupon = '';
            this.IBPrice = '';
            this.ddlNoteCcy = 'EUR';
            this.SolveForvalue = 'IBPrice';
            this.shares = this.apifunctions.shares;
            this.guaranteedCouponFreq = '';
            this.Notional = '1,000,000.00';
            this.upStrike = '100.00';
            this.upGearing = '100.00';
            this.downStrike = '100.00';
            this.downLeverage = '100.00';
            this.capitalGuaranteed = '';
            this.fundType = '';
            this.fundFreq = '';
            this.fundRate = '';
            this.upBarrierLevel = '';
            this.upBarrierType = 'None';
            this.downBarrierType = 'None';
            this.downBarrierLevel = '';
            this.issuePrice = '100.00';
            this.upUpperStrike = '';
            this.upRebate = '';
            this.upCoupon = '0.00';
            this.downLowerStrike = '70.00';
            this.downLeverageYN = 'No';
            this.stkshift = '0B';
            this.paymentshift = 'T + 5';
            this.expshift = '1Y';
            this.format = 'Note';
            if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
              this.ShareBasket = [];
              this.SelectedUnderlyingBasket = [];
              this.SelectedUnderlyingBasketArray = [];
              this.setdefaultvalues();
            }
            this.Dates = await this.apifunctions.BBVAGetDates('', '0B', '');
            if (this.Dates) {
              this.todayDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
            this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
            if (this.Dates) {
              this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
            this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
            if (this.Dates) {
              this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
            this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
            if (this.Dates) {
              this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
          }
          // FIN1EURINT-104 : Participation pay off addition in 1Europe

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

          // cleared basket to resolve wrong currency selected issue on clone action || PriyaL || 04Apr2022 || assigned by PranavD
          this.ShareBasket = [];
          this.SelectedUnderlyingBasket = [];
          this.SelectedUnderlyingBasketArray = [];

          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.data1[0].ShareBasket.length; i++) {
	  	// FIN1EURINT-104 : Participation pay off addition in 1Europe
            // await this.showUnderlying('', this.data1[0].ShareBasket[i]);
	    // FIN1EURINT-565 : Use single pricer share search pipe for Multipricer share search
            await this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, this.data1[0].ShareBasket[i].Code)[0]);
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

          this.Attach = this.data1[0].Attach;
          // tslint:disable-next-line: radix
          this.AttachVal = (this.data1[0].AttachVal !== '') ? parseInt(this.data1[0].AttachVal) : '';
          this.Detach = this.data1[0].Detach;
          // tslint:disable-next-line: radix
          this.DetachVal = (this.data1[0].DetachVal !== '') ? parseInt(this.data1[0].DetachVal) : '';
          this.creditcouponBasis = this.data1[0].creditcouponBasis;
          this.creditSpread = this.data1[0].creditSpread;
          this.creditcouponFreq = this.data1[0].creditcouponFreq;
          this.floatingRef = this.data1[0].floatingRef;
          this.creditReofferPrice = this.data1[0].creditReofferPrice;
          this.indexTranche = this.data1[0].indexTranche;
          this.creditTenor = this.data1[0].creditTenor;
          this.creditcouponType = this.data1[0].creditcouponType;
          this.creditIssuePrice = this.data1[0].creditIssuePrice;

          // Participation
          this.participationType = this.data1[0].participationType;
          this.guaranteedCoupon = this.data1[0].guaranteedCoupon;
          this.guaranteedCouponFreq = this.data1[0].guaranteedCouponFreq;
          this.upStrike = this.data1[0].upStrike;
          this.upGearing = this.data1[0].upGearing;
          this.downStrike = this.data1[0].downStrike;
          this.downLeverage = this.data1[0].downLeverage;
          this.downLowerStrike = this.data1[0].downLowerStrike;
          this.capitalGuaranteed = this.data1[0].capitalGuaranteed;
          this.upBarrierLevel = this.data1[0].upBarrierLevel;
          this.upBarrierType = this.data1[0].upBarrierType;
          this.downBarrierType = this.data1[0].downBarrierType;
          this.downBarrierLevel = this.data1[0].downBarrierLevel;
          this.upUpperStrike = this.data1[0].upUpperStrike;
          this.upRebate = this.data1[0].upRebate;
          this.upCoupon = this.data1[0].upCoupon;
          this.toggleFlag = this.data1[0].toggleFlag;
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

          // accudecu fields to be added
          if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
            this.accuSolveFor = this.data1[0].accuSolveFor;
            this.noOfShares = this.data1[0].noOfShares;
            this.estimatedNotional = this.data1[0].estimatedNotional;
            this.accuTenor = this.data1[0].accuTenor;
            this.accuTenorType = this.data1[0].accuTenorType;
            this.accuStrike = this.data1[0].accuStrike;
            this.accuUpfront = this.data1[0].accuUpfront;
            this.accuKOPerInit = this.data1[0].accuKOPerInit;
            this.accuKOSttlType = this.data1[0].accuKOSttlType;
            this.accuFreq = this.data1[0].accuFreq;
            this.accuGuarantee = this.data1[0].accuGuarantee;
            this.accuChkLeverage = this.data1[0].accuChkLeverage;
          }
          else if(this.ProductName === 'Participation') {
            this.customTenor = this.data1[0].customTenor;
          }

          this.apifunctions.cloneData1.next('Add');
          this.apifunctions.cloneFlag1.next(false);
        }

        this.cloneFlagSubscription = this.apifunctions.cloneFlag1Obs.subscribe(flag => {        // Suvarna's code
          this.apifunctions.multiPhoenixArrObserver.subscribe(length => {
            this.length1 = length;
            if (flag) {
              this.multiPhoenixArr1 = [];

              if (this.length1 - 1 === this.ComponentIndex) {
                this.multiPhoenixArr1.push({
                  ShareBasket: this.ShareBasket,
                  format: this.format,
                  SolveForvalue: this.SolveForvalue,
                  creditSolveFor: this.creditSolveFor,
                  IBPrice: this.IBPrice,
                  ddlNoteCcy: this.ddlNoteCcy,
                  Notional: this.Notional,

                  stkshift: this.stkshift,
                  paymentshift: this.paymentshift,
                  expshift: this.expshift,
                  customTenor: this.customTenor,
                  expdate: this.expdate,
                  settdate: this.settdate,
                  Strike: this.Strike,
                  stkdate: this.stkdate,
                  barrierLevel: this.barrierLevel,
                  barrierType: this.barrierType,
                  autoTrigger: this.autoTrigger,
                  autoFreq: this.autoFreq,
                  autoStepDown: this.autoStepDown,
                  autoNonCall: this.autoNonCall,
                  autocallCoupon: this.autocallCoupon,
                  autocallCouponType: this.autocallCouponType,
                  cpnTrigger: this.cpnTrigger,
                  cpnFreq: this.cpnFreq,
                  cpnCoupon: this.cpnCoupon,
                  cpnObservation: this.cpnObservation,
                  cpnType: this.cpnType,
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
                  // participation
                  participationType: this.participationType,
                  guaranteedCoupon: this.guaranteedCoupon,
                  guaranteedCouponFreq: this.guaranteedCouponFreq,
                  upStrike: this.upStrike,
                  upGearing: this.upGearing,
                  downStrike: this.downStrike,
                  downLeverage: this.downLeverage,
                  downLowerStrike: this.downLowerStrike,
                  capitalGuaranteed: this.capitalGuaranteed,
                  upBarrierLevel: this.upBarrierLevel,
                  upBarrierType: this.upBarrierType,
                  downBarrierType: this.downBarrierType,
                  downBarrierLevel: this.downBarrierLevel,
                  upUpperStrike: this.upUpperStrike,
                  upRebate: this.upRebate,
                  upCoupon: this.upCoupon,
                  issueDate: this.issueDate,
                  issuePrice: this.issuePrice,
                  LeverageYN: this.LeverageYN,
                  downLeverageYN: this.downLeverageYN,
                  // accudecu fields to be added
                  accuSolveFor: this.accuSolveFor,
                  noOfShares: this.noOfShares,
                  estimatedNotional: this.estimatedNotional,
                  accuTenor: this.accuTenor,
                  accuTenorType: this.accuTenorType,
                  accuStrike: this.accuStrike,
                  accuUpfront: this.accuUpfront,
                  accuKOPerInit: this.accuKOPerInit,
                  accuKOSttlType: this.accuKOSttlType,
                  accuFreq: this.accuFreq,
                  accuGuarantee: this.accuGuarantee,
                  accuChkLeverage: this.accuChkLeverage
                });

                this.apifunctions.cloneData1.next(this.multiPhoenixArr1);
              }
            }
          });
        });


        // Clone functions End

        // toggle flag subscription
        this.toggleFlagSubscription = this.apifunctions.toggleFlagObs.subscribe(flag => {
          try {
            if (flag) {
              this.toggleDataArr = {};
              var leverageValYN = '';
              if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
                leverageValYN = this.accuChkLeverage ? 'Y' : 'N';
              }
              this.toggleDataArr = {
                ComponentIndex: this.ComponentIndex,
                CompnonentName: 'Horizontal',
                AltCouponObservation: this.altObservation,
                AltCouponPer: this.altCoupon,
                AttachPer: this.Attach,
                AttachValue: ((this.AttachVal === 'NaN' || this.AttachVal === '') ? '' : this.AttachVal),
                Ccy: this.ddlNoteCcy,
                ComputedPayoffSoftTenor: this.expshift,
                customTenor: this.customTenor,
                ComputedSettlementPeriodSoftTenor: this.paymentshift,
                ComputedStrikeFixingLag: this.stkshift,
                CouponBarrier: this.cpnTrigger,
                CouponBasis: this.creditcouponBasis,
                CouponObs: this.cpnObservation,
                CouponPer: this.cpnCoupon,
                CouponSpread: this.creditSpread,
                CouponType: (this.ProductName === 'CreditTranche' ? this.creditcouponType : this.cpnType),
                DetachPer: this.Detach,
                DetachValue: ((this.DetachVal === 'NaN' || this.DetachVal === '') ? '' : this.DetachVal),
                DownsideCapitalProtectionPercent: this.capitalGuaranteed,
                DownsideParticipationCapPercent: this.downLowerStrike,
                DownsideParticipationPercent: this.downLeverage,
                ERCouponPer: this.autocallCoupon,
                ERCouponType: this.autocallCouponType,
                ERFrequency: this.autoFreq,
                ExpiryDate: this.expdate,
                FloatingRef: this.floatingRef,
                FormatDetails: this.format,
                // Frequency: this.cpnFreq,
                Frequency: (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ? this.accuFreq : this.cpnFreq,
                FundingFrequency: this.fundFreq,
                FundingType: this.fundType,
                GuaranteedCoupon: this.guaranteedCoupon,
                IBPrice: this.IBPrice,
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
                IssuePrice: this.issuePrice,
                KIPer: this.barrierLevel,
                KIType: this.barrierType,
                // KOPer: this.autoTrigger,
                KOPer: (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ? this.accuKOPerInit : this.autoTrigger,
                // KOType: this.autoFreq,
                KOType: (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ? this.accuKOSttlType : this.autoFreq,
                MemoryPds: this.MemoryPeriods,
                NonCallPeriod: this.autoNonCall,
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
                Size: this.Notional,
                SolveFor: (this.ProductName === 'CreditTranche') ? this.creditSolveFor :
                  (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ? this.accuSolveFor :
                    this.SolveForvalue,
                StepDown: this.autoStepDown,
                // Strike: this.Strike,
                Strike: (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ?
                  this.accuStrike : this.Strike,
                StrikeDate: this.stkdate,
                SubTemplate: (this.ProductName === 'CreditTranche' ? (this.toggleFlag === 'Firm'
                  ? 'CreditTranche' : 'CreditTrancheInd') : this.ProductName),
                // TenorPer: this.creditTenor,
                //Modified tenortype to resolve tenor issue on switching toggle || PriyaL || 09May2022 || reported by Rishabh S.
                TenorPer: (this.ProductName === 'Accumulator' || this.ProductName == 'Decumulator') ?
                  this.accuTenor + this.accuTenorType.toString().substring(0,1) : this.creditTenor,  //removed '-' | change by Ashwini H. on 16 Dec 2022
                UpsideParticipationCapPercent: this.upUpperStrike,
                UpsideParticipationPercent: this.upGearing,
                Wrapper: this.format,
                onBehalfOf: this.onBehalfOf,
                ProductType: this.participationType,
                // LeverageYN: this.LeverageYN,
                // LeverageYN: (this.ProductName==='Accumulator' || this.ProductName === 'Decumulator') ? this.accuChkLeverage : this.LeverageYN,
                LeverageYN: (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') ? leverageValYN : this.LeverageYN,
                LeverageFlag: this.LeverageFlag,
                rfqID: this.rfqID,
                noteMasterID: '', // this.noteMasterID, //commented to reset prices on layout toggle || FIN1EURINT-506 || KaustubhS || 28-Jun-2023
                orderID: this.orderID,
                sortedAllPrices: (this.sortedAllPrices.length > 0) ? this.sortedAllPrices : this.togglesortedAllPrices,
                timeoutMsg: this.timeoutMsg,
                downLeverageYN: this.downLeverageYN,

                // accudecu fields to be added
                // accuSolveFor: this.accuSolveFor,
                // noOfShares: this.noOfShares,
                // estimatedNotional: this.estimatedNotional,

                //commented by Priya L. to resolve tenor issue on switching toggle - 09May2022
                // accuTenor: this.accuTenor,
                // accuTenorType: this.accuTenorType,

                // TenorPer : this.accuTenor + '-' + this.accuTenorType,
                // this.accuTenor = this.data.TenorPer.split('-')[0]; //'6';
                // this.accuTenorType = this.data.TenorPer.split('-')[1]; //'M';
                // accuStrike: this.accuStrike,
                // accuUpfront: this.accuUpfront,
                // accuKOPerInit: this.accuKOPerInit,
                // accuKOSttlType: this.accuKOSttlType,
                // accuFreq: this.accuFreq,
                // accuGuarantee: this.accuGuarantee,
                Guarantee: this.accuGuarantee,


                // SolveFor : this.accuSolveFor,
                SharesQuantity: this.noOfShares,
                TotalNotional: this.estimatedNotional,
                // Strike : this.accuStrike
                Upfront: this.accuUpfront,
                // Added by Suvarna P | 28Apr2022 | request TS button when toggle between Horizontal/Vertical layout || assigned by pranav D
                TSFlag: this.TSFlag
                // KOPer : this.accuKOPerInit
                // KOType :  this.accuKOSttlType
                // Frequency :  this.accuFreq
                // Guarantee : this.accuGuarantee,
                // LeverageYN : this.accuChkLeverage ? 'Y' : 'N'

                /*
                this.accuSolveFor = this.data.SolveFor; //'strike';
                this.noOfShares = this.data.SharesQuantity; //1000;
                this.estimatedNotional = this.data.TotalNotional; //'0.00';
  
                this.accuTenor = this.data.TenorPer.split('-')[0]; //'6';
                this.accuTenorType = this.data.TenorPer.split('-')[1]; //'M';
  
                this.accuStrike = this.data.Strike; //0.00;
                this.accuUpfront = this.data.Upfront; // 0.50;
                this.accuKOPerInit = this.data.KOPer; //102.00;
                this.accuKOSttlType = this.data.KOType; //'1 Settl. Cycle after KO';
                this.accuFreq = this.data.Frequency; //"Monthly";
                this.accuGuarantee = this.data.Guarantee; //1;
                this.accuChkLeverage = this.data.LeverageYN == 'Y' ? true : false;
                */
              };

              // this.apifunctions.toggleFlag.next(true);
              this.apifunctions.toggleData.next(this.toggleDataArr);
            }
          }
          catch (error) {
            //console.log(error)
          }

        });

      });

      this.schedulePriceSubscription = this.apifunctions.schedulePriceFlagCheck.subscribe(async res => {
        if (res !== undefined && res['Date'] !== undefined) {
          this.inputDate = res['Date'];
          this.inputTime = res['Time'];
          await this.scheduleSend();
        }
      });

      this.schedulePopupSubscription = this.apifunctions.schedulePopupFlagObs.subscribe(async flag => {
        if (flag) {
          if (this.ProductName === 'AutocallablePhoenix' || this.ProductName === 'ReverseConvertible') {
            await this.validationOnButton();
          }
          if (this.ProductName === 'CreditTranche') {
            await this.validationOnButtonCT();
          }
          if (this.ProductName === 'Participation') {
            await this.PTCValidation();
          }
          if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
            this.validationOnButtonAccuDecu();
          }
        }
      });

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setSolveFor(e) {
    try {
      if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();
      }
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
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setDefaultSolveForValues(solveFor) {
    try {
      if (this.Strike === '' && solveFor !== 'Strike') {
        this.Strike = '100.00';
        this.LeverageFlag = false;
        this.LeverageYN = 'No';
      }
      if (this.cpnCoupon === '' && solveFor !== 'Coupon' && this.format !== 'Option' && this.cpnType !== 'No Coupon') {
        this.cpnCoupon = '5.00';
      }
      if (this.IBPrice === '' && solveFor !== 'IBPrice') {
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '0.00';
        } else {
          this.IBPrice = '99.50';
        }
      }
      if (this.autocallCoupon === '' && solveFor !== 'RebateCoupon') {
        this.autocallCoupon = '10.00';
      }
      if (this.cpnTrigger === '' && solveFor !== 'CouponBarrier' && this.format !== 'Option'
        && this.cpnType !== 'Fixed Coupon' && this.cpnType !== 'No Coupon') {
        this.cpnTrigger = '70.00';
      }
      if (this.barrierLevel === '' && solveFor !== 'KI' && this.barrierType !== 'None') {
        this.barrierLevel = '60.00';
      }
      if (this.autoTrigger === '' && solveFor !== 'KO') {
        this.autoTrigger = '100.00';
        this.autoStepDown = '0.00';
      }
      if (this.fundRate === '' && solveFor !== 'FundingRate' && this.format === 'Swap') {
        this.fundRate = '1.00';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

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

  ChangeIndex(_e) {
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
  async selectShare(e) {
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
  backKeyPress(_e) {
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

  async showUnderlying(_event, item) {
    try {
      if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();

      }
      this.errorMsgChanged.emit('');
      this.enableToggle();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.ShareName = '';

      // share should get replace on selecting second share || PriyaL || 04May2022 || as asked by Milind Sir
      if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
        this.ShareBasket = [];
        this.SelectedUnderlyingarray = [];
        this.SelectedUnderlyingBasketArray = [];
      }

      // this.ccyChange = item.Ccy;
      if (this.ProductName !== 'Participation' && this.ProductName !== 'Accumulator' && this.ProductName !== 'Decumulator') {
        if (this.ShareBasket.length < 5) {
          if (this.ShareBasket.find(i => i.BloombergCode === item.BloombergCode) === undefined) {
            this.ShareBasket.push({
              BloombergCode: item.BloombergCode, Ccy: item.Ccy, LongName: item.LongName, Code: item.Code,
              ExchangeCode: item.ExchangeCode, ExchangeName: item.ExchangeName
            }); // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
            this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
              item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);

          } else {
            return false;
          }
        }
      } else {
        if (this.ShareBasket.length < 1) {
          if (this.ShareBasket.find(i => i.BloombergCode === item.BloombergCode) === undefined) {
            this.ShareBasket.push({
              BloombergCode: item.BloombergCode, Ccy: item.Ccy, LongName: item.LongName, Code: item.Code,
              ExchangeCode: item.ExchangeCode, ExchangeName: item.ExchangeName
            }); // HSBCECCLI-10 : Bulk Pricer - Underlying data discrepancy on clone and toggle | 07-Aug-2023
            this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode, item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);
          } else {
            return false;
          }
          this.shareCode = item.Code;
          this.exchngCode = item.ExchangeCode;
          this.ddlNoteCcy = item.Ccy;
          await this.calculateNotional(this.shareCode, this.exchngCode, this.noOfShares);
        }
      }
      if (this.ShareBasket.length > 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.remove('underlyingError');
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('longText');
      }

      if (this.ShareBasket.length === 5) {
      }

      // this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
      // if (this.Dates) {
      //   this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }

      // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
      // if (this.Dates) {
      //   this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }

      // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
      // if (this.Dates) {
      //   this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // }



    } catch (error) {
      //console.log('Error:', error);
    }
  }


  async Price() {
    try {
      // this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.reset();
        this.loadflag = true;
        this.pageloadflag=false;

        await this.PHXPrice();
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async RCPrice() {
    try {
      // this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.reset();
        this.loadflag = true;
        await this.RCPrice1();
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async accuPrice() {
    try {
      //console.log('accuPrice');
      // this.validationOnButton();
      if (this.ErrorMsg === '') {
        // this.reset();
        this.accuDecuReset();
        this.loadflag = true;
        await this.accuPrice1();
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async generateXML() {
    try {
      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.DisplayProductName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
              + this.autoNonCall + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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

            case 'expdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
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
            case 'altLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></'
              + this.templateMappingArr[i].template_Field_Name + '>';
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
              + this.autocallCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
              + this.paymentshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.stkshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.expshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
              + AppConfig.settings.oRes.userID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
          }
        }
        xmlstr += '</QuoteRequest>';
        return xmlstr;
      } else {
        return '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  generateXMLAccuDecu() {
    try {
      let GearingLeverage: string;
      if (this.accuChkLeverage) {
        GearingLeverage = '2';
      }
      else {
        GearingLeverage = '1';
      }

      let GuaranteedDurationType: string;
      this.accuFreq == 'MONTHLY' ? 'MONTH' : this.accuFreq == 'BIWEEKLY' ? 'WEEK' : ""
      if (this.accuFreq === 'MONTHLY') {
        // GuaranteedDuration = '' + this.Guarantee;
        GuaranteedDurationType = 'MONTH';
      } else if (this.accuFreq === 'BIWEEKLY') {
        // GuaranteedDuration = (this.Guarantee).toString();
        GuaranteedDurationType = 'WEEK';
      }

      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.DisplayProductName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Type': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.DisplayProductName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'ShareCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              // + this.Code() 
              + (this.ShareBasket[0].BloombergCode === undefined ? '' : this.ShareBasket[0].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'Exchange':
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.Exchange() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'CCY': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuSolveFor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Azure change    
            case 'SolveFor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuSolveFor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Strike':
              // this.accuStrike = '98.5';
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.accuStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Upfront': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuUpfront
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'GuaranteedDuration': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuGuarantee + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'GuaranteedDurationType':
              // xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              //   + this.accuFreq == 'Monthly' ? 'MONTH' : this.accuFreq == 'BIWEEKLY' ? 'WEEK':"" 
              //   + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + GuaranteedDurationType
                + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.accuTenor + this.accuTenorType.toString().substr(0, 1).toUpperCase())
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Frequency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'DailyNoOfShares': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.noOfShares
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.estimatedNotional
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'KO': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accuKOPerInit
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'GearingLeverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + GearingLeverage + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            // + this.apifunctions.userGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            // break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'PortfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.apifunctions.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'LoginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.userID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'underlying1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              // + (this.ShareBasket[0].Code === undefined ? '' : this.ShareBasket[0].Code)
              + (this.ShareBasket[0].BloombergCode === undefined ? '' : this.ShareBasket[0].BloombergCode)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'exchange1':
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + (this.ShareBasket[0].ExchangeCode === undefined ? '' : this.ShareBasket[0].ExchangeCode)
                + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // new field to pass Accrual days -added by Priya L. on 15Mar2022 - assigned by Pranav D.
            case 'AccrualDays': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.accrualDays
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
          }
        }
        xmlstr += '</QuoteRequest>';
        return xmlstr;
      } else {
        return '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  //Modified By Sharayu.S || 31-03-2023 || Start
  async PHXPrice() {
    
    try {
      const userGroupID = this.apifunctions.userGroup;
      let xmlstr: string = await this.generateXML();
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: this.ProductName,
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.SolveForvalue,
        userGroupID: userGroupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        loginID: AppConfig.settings.oRes.userID,
        noteMasterID: this.noteMasterID,
        repricereqYN: "",
      }];

   
      return await this.http.post(webMethod, parameters).toPromise().then((data:any) => {
        if (data.errorMessage !== '' || !that.pageActive) {
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
                  		quoteResponseCheck = await that.PHXPriceResponse(that.PPDetails, that.ComponentIndex);
                	  }
                	that.timeLeft = Number(that.timeLeft) - 5;
                        } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                          that.loadflag = false;
                          clearInterval(that.interval);
                          that.enableToggle();
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
  async PHXPriceResponse(PPDetails, _ComponentIndex) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/CheckIfResponseReceived';
      const parameters = {
        QuoteRequestID: PPDetails
      };


      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiReceivedPrices(this.Prices, _ComponentIndex);
          let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
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

  async RCPrice1() {
   
    try {

      const userGroupID = this.apifunctions.userGroup;
      let xmlstr: string = await this.generateXML();
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: this.ProductName,
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.SolveForvalue,
        userGroupID: userGroupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        loginID: AppConfig.settings.oRes.userID,
        noteMasterID: this.noteMasterID,
        repricereqYN: "",
      }];



      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data.errorMessage !== '' || !that.pageActive) {
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
                quoteResponseCheck = await that.RCPriceResponse(that.PPDetails, that.ComponentIndex);
                }
	                that.timeLeft = Number(that.timeLeft) - 5;
                    } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                      that.loadflag = false;
                      clearInterval(that.interval);
                      that.enableToggle();
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
 async RCPriceResponse(PPDetails, _ComponentIndex) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/CheckIfResponseReceived';
      const parameters = {
        QuoteRequestID: PPDetails
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiRCReceivedPrices(this.Prices, _ComponentIndex);
          let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
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

  async accuPrice1() {
  
    try {

      const userGroupID = this.apifunctions.userGroup;
      let xmlstr: string = await this.generateXMLAccuDecu();
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: this.ProductName,
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.accuSolveFor,
        userGroupID: userGroupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        loginID: AppConfig.settings.oRes.userID,
        noteMasterID: this.noteMasterID,
        repricereqYN: "",
      }];
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data.errorMessage !== '' || !that.pageActive) {
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
                quoteResponseCheck = await that.accuPriceResponse(that.PPDetails, that.ComponentIndex);
                }
	                that.timeLeft = Number(that.timeLeft) - 5;
                    } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                      that.loadflag = false;
                      clearInterval(that.interval);
                      that.enableToggle();
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
  async accuPriceResponse(PPDetails, _ComponentIndex) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/CheckIfResponseReceived';
      const parameters = {
        QuoteRequestID: PPDetails
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiReceivedPrices(this.Prices, _ComponentIndex);
          let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
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
 //Modified By Sharayu.S || 31-03-2023 || End

  /* Notional change -not required  by Suvarna
    setNotional(e) {
      try {
        this.reset();
        const target = this.commonfunctions.GetEventTarget(e);
        this.Notional = parseFloat(target.value.replace(/,/g, '')).toString();
        if (this.Notional === '0' || this.Notional === '0.00') {
          this.ErrorMsg = 'Please enter valid notional.';
          this.errorMsgChanged.emit(this.ErrorMsg);
        }

      }
      catch (error) {
        //console.log("Error:", error);
      }
    }
    */

  removeShare(rownumber: any) {
    try {
      this.ShareBasket.splice(rownumber, 1);
      this.SelectedUnderlyingarray.splice(rownumber, 1);
      this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
      // if (this.SelectedUnderlyingBasketArray.length > 0) {
      //   this.ddlNoteCcy = this.SelectedUnderlyingBasketArray[this.SelectedUnderlyingBasketArray.length - 1]['Ccy'];
      // }
      // else {
      //   this.ddlNoteCcy = 'EUR';
      // }


      this.estimatedNotional = '';
      this.updateShareBasket();
      this.reset();
      this.enableToggle();
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  IBPricechange() {
    try {
      if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();
      }
      this.enableToggle();

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  reset() {
    try {
      this.apifunctions.priceFlag.next(false);
      this.apifunctions.saveFlag.next(false);
      this.apifunctions.rcPriceFlag.next(false);
      this.apifunctions.rcsaveFlag.next(false);
      this.commonfunctions.setsubmultiReceivedPrices({}, '');
      this.commonfunctions.setsubmultiRCReceivedPrices({}, '');

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

      if (this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.remove('reply');
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
      // if (this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      // }

      this.TSFlag = false;
      clearInterval(this.TSInterval);
      this.reqSuccessMsg = '';
      this.timerinSec = -1;

      this.KIDFlag = false;
      clearInterval(this.KIDInterval);
      this.reqKIDSuccessMsg = '';

      clearInterval(this.priceTimerInterval);
      this.quoteEmailSuccessMsg = '';

      this.enableToggle(); // FIN1EURINT-461 : Transpose button gets disabled after pricing in participation.

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }



  PriceValidation(e, Pricestr: string) {

    try {
      this.reset();
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


      }
      // if (this.ErrorMsg !== '') {
      this.errorMsgChanged.emit(this.ErrorMsg);
      // }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  altCouponFlagChange() {
    try {
      this.reset();
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
      this.reset();
      this.enableToggle();
      if (this.cpnType === 'No Coupon' && (this.SolveForvalue === 'CouponBarrier' || this.SolveForvalue === 'Coupon')) {
        this.SolveForvalue = 'IBPrice';
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '';
          this.issuePrice = '';
        } else {
          this.IBPrice = '';
          this.issuePrice = '100.00';
        }
      }
      if (this.cpnType === 'Fixed Coupon' && this.SolveForvalue === 'CouponBarrier') {
        this.SolveForvalue = 'IBPrice';
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '';
          this.issuePrice = '';
        } else {
          this.IBPrice = '';
          this.issuePrice = '100.00';
        }
      }
      if (this.cpnType === 'No Coupon') {
        this.cpnFreq = '';
        this.cpnObservation = '';
        this.cpnCoupon = '';
        this.MemoryPeriods = '';
        this.cpnTrigger = '';
      } else {
        if (this.autoFreq === '1m') {
          this.cpnFreq = '1m';
        } else {
          if (this.cpnFreq === '') {
            this.cpnFreq = '3m';
          }
        }
        this.cpnObservation = 'PerFreq';
        if (this.SolveForvalue !== 'Coupon') {
          if (this.cpnCoupon === '') {
            this.cpnCoupon = '5.00';
          }
        }

        if (this.cpnType === 'Partial Memory') {
          this.MemoryPeriods = '1';
        } else {
          this.MemoryPeriods = '';
        }
        if (this.cpnType === 'Fixed Coupon') {
          this.cpnTrigger = '';
        } else {
          if (this.SolveForvalue !== 'CouponBarrier') {
            if (this.cpnTrigger === '') {
              this.cpnTrigger = '70.00';
            }
          } else {
            this.cpnTrigger = '';
          }
        }
      }
    } catch (error) {
      //console.log('Error' + error);
    }
    return false;
  }

  formatChange() {
    try {
      this.enableToggle();
      if (this.ProductName === 'CreditTranche') {
        this.creditreset();
        if (this.format === 'Swap') {
          this.fundType = 'Floating Rate';
          this.fundFreq = '3m';
          this.creditIssuePrice = '';
          if (this.creditSolveFor === 'Coupon') {
            this.creditReofferPrice = '98.50';

          } else {
            this.creditReofferPrice = '';

          }
          if (this.creditSolveFor === 'FundingRate') {
            this.fundRate = '';
          } else {
            this.fundRate = '1.00';
          }
        } else {
          this.creditIssuePrice = '100.00';
          if (this.creditSolveFor === 'Coupon') {
            this.creditReofferPrice = '98.50';
          } else {
            this.creditReofferPrice = '';
          }
          this.fundType = '';
          this.fundFreq = '';
          this.fundRate = '';
        }
      } else {
        if (this.ProductName === 'Participation') {
          this.ptcreset();
        } else {
          this.reset();
        }
        if (this.format !== 'Swap' && this.SolveForvalue === 'FundingRate') {
          this.SolveForvalue = 'IBPrice';
        }
        if (this.format === 'Option' && (this.SolveForvalue === 'CouponBarrier' || this.SolveForvalue === 'Coupon')) {
          this.SolveForvalue = 'IBPrice';
        }
        if (this.SolveForvalue === 'IBPrice') {
          this.IBPrice = '';
          if (this.format === 'Swap' || this.format === 'Option') {
            this.issuePrice = '';
          } else {
            this.issuePrice = '100.00';
          }
        } else {
          if (this.format === 'Swap' || this.format === 'Option') {
            this.IBPrice = '0.00';
            this.issuePrice = '';
          } else {
            this.IBPrice = '99.50';
            this.issuePrice = '100.00';
          }
        }

        if (this.format === 'Swap') {
          this.fundType = 'Floating Rate';
          if (this.ProductName === 'AutocallablePhoenix') {
            if (this.autoFreq === '1m' || this.autoFreq === '2m' || this.autoFreq === '4m') {
              this.fundFreq = '1m';
            } else {
              this.fundFreq = '3m';

            }
          } else {
            this.fundFreq = '3m';
          }
          if (this.SolveForvalue === 'FundingRate') {
            this.fundRate = '';
          } else {
            this.fundRate = '1.00';
          }
        } else {

          this.fundType = '';
          this.fundFreq = '';
          this.fundRate = '';
        }
        if (this.format === 'BonoJ' || this.format === 'Warrant') {
          this.ddlNoteCcy = 'MXN';

        }

        if (this.ProductName === 'ReverseConvertible') {
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

        }
      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  barrierTypeChange() {
    try {
      this.reset();
      this.enableToggle();
      if (this.SolveForvalue !== 'KI' && this.barrierType !== 'None' && this.barrierLevel === '') {
        this.barrierLevel = '60.00';
      }
      if (this.SolveForvalue === 'KI' || this.barrierType === 'None') {
        this.barrierLevel = '';
      }

      if (this.SolveForvalue === 'KI' && this.barrierType === 'None') {
        this.SolveForvalue = 'IBPrice';
        if (this.format === 'Swap' || this.format === 'Option') {
          this.IBPrice = '';
          this.issuePrice = '';
        } else {
          this.IBPrice = '';
          this.issuePrice = '100.00';
        }
      }

    } catch (error) {
      //console.log('Error', error);
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
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/fetchAppTableSchema';
      const that = this;
      const parameters = {
        "productName": this.ProductName,
        "subTemplateCode": "",
        "requestXML": "",
        "solveFor": "",
        "loginID": "",
        "buyerEntityID": "",
        "userGroupID": ""
        // Product: 'AutocallablePhoenix',
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        that.templateMappingArr = data;
        return data;
        //return this.Dates;
       });

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  checkValidNotional(e) {
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

  checkNotional(e) {
    try {
      this.enableToggle();

      if (this.ErrorMsg === '') {
        const target = this.commonfunctions.GetEventTarget(e);
        const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));

        const res = this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
        if (floatNotional < res[0].Minimum || floatNotional > res[0].Maximum) {
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
      if (this.ProductName === 'CreditTranche') {
        this.creditreset();
      } else if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();
      }
      this.enableToggle();
      this.checkNotionalRes = this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {
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
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.floatingRefArr.length; i++) {
        if (this.creditcouponType === 'Floating'
          && (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[0]).toUpperCase().includes(this.ddlNoteCcy.toUpperCase())) {
          if (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[1] === '3M'
            || this.floatingRefArr[i].LongName.split('-')[1].split(' ')[2] === '3M') {
            this.floatingRef = this.floatingRefArr[i].LongName.split('-')[1];
          }
        }
      }
      this.changeFreq();
      if (this.ProductName !== 'CreditTranche') {
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        if (this.Dates) {
          this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        }

        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        if (this.Dates) {
          this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }
  async txtTenorChange(e, type: any) {
    try {
      if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();
      }
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
        if (this.expshift === 'Custom') {
          return true;
        }
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

      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      if (this.settdate === '' || (Date.parse(this.settdate) < Date.parse(this.stkdate))
        || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async validationOnButtonCT() {
    try {



      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes  && this.checkNotionalRes.length > 0) {
        if ((this.Notional + '').includes(',')) {
          this.Notional = this.Notional.replace(/,/g, '');
        }
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
        if (!(this.Notional + '').includes(',')) {
          this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
      if (this.indexTranche === '') {
        this.elem.nativeElement.querySelector('#indexTranche' + this.ComponentIndex).classList.add('underlyingError');
        this.ErrorMsg = 'Please select index.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      } else {
        this.elem.nativeElement.querySelector('#indexTranche' + this.ComponentIndex).classList.remove('underlyingError');
        this.ErrorMsg = '';
      }
      if (this.creditSolveFor !== 'Reoffer' && this.format === 'Note') {
        this.ErrorMsg = await this.apifunctions.reofferValidation(this.issuePrice, this.creditReofferPrice, 'Credit', '');
        this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      }

      await this.calculateAttachPercent();
      if (this.ErrorMsg !== '') {
        this.enableToggle();
        this.apifunctions.creditFlag.next(false);
        this.apifunctions.creditSaveFlag.next(false);
        return false;
      }


      await this.calculateDetachPercent();

      if (this.AttachVal === '') {
        this.ErrorMsg = 'Please enter attach value.';
        this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add('error');
        // return false;
      }
      if (this.DetachVal === '') {
        this.ErrorMsg = 'Please enter detach value.';
        this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add('error');

        // return false;
      }

      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      }

      if (this.ErrorMsg !== '') {
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.enableToggle();

        this.apifunctions.creditFlag.next(false);
        this.apifunctions.creditSaveFlag.next(false);
      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async validationOnButton() {
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

      if (this.SolveForvalue !== 'IBPrice' && this.SolveForvalue !== 'Upfront' && (this.IBPrice === '' || parseFloat(this.IBPrice) > 100)) {
        this.ErrorMsg = 'Please enter valid Reoffer price.';
        this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.add('error');
      }

      if (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap' && this.format !== 'Option') {
        const resMsg = await this.apifunctions.reofferValidation(this.issuePrice, this.IBPrice, 'EQ', this.format);
        if (resMsg !== '') {
          this.ErrorMsg = resMsg;
          this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.add('error');
        } else {
          this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.remove('error');
        }
      }

      if (this.autoNonCall !== '' && this.ProductName === 'AutocallablePhoenix') {
        const resMsg = await this.apifunctions.noncallValidation(this.autoNonCall, this.expshift,
          this.autoFreq.substr(0, this.autoFreq.length - 1));
        if (resMsg !== '') {
          this.ErrorMsg = resMsg;
          this.elem.nativeElement.querySelector('#txtautoNonCall' + this.ComponentIndex).classList.add('error');
        }
      }

      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes  && this.checkNotionalRes.length > 0) {
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

      if (this.cpnTrigger !== '') {
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

      } else {
        if (this.cpnType !== 'No Coupon' && this.cpnType !== 'Fixed Coupon'
          && this.SolveForvalue !== 'CouponBarrier' && this.format !== 'Option') {
          this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
          this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.add('error');
        }
      }

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

      if (this.settdate === '') {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please enter valid payment date.';
      }

      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
      }

      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
      }
      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
      }
      if (this.ProductName === 'AutocallablePhoenix') {
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

  validationOnButtonAccuDecu() {
    try {
      // return false;
      //console.log('validationOnButtonAccuDecu');

      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      this.TSFlag = false;
      clearInterval(this.TSInterval);
      this.reqSuccessMsg = '';

      this.KIDFlag = false;
      clearInterval(this.KIDInterval);
      this.reqKIDSuccessMsg = '';

      this.quoteEmailSuccessMsg = '';
      /*
            if (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap' && this.format !== 'Option') {
              const resMsg = this.apifunctions.reofferValidation(this.issuePrice, this.IBPrice, 'EQ', this.format);
              if (resMsg !== '') {
                this.ErrorMsg = resMsg;
                this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.add('error');
              } else {
                this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.remove('error');
              }
            }
      
            if (this.autoNonCall !== '' && this.ProductName === 'AutocallablePhoenix') {
              const resMsg = this.apifunctions.noncallValidation(this.autoNonCall, this.expshift,
                this.autoFreq.substr(0, this.autoFreq.length - 1));
              if (resMsg !== '') {
                this.ErrorMsg = resMsg;
                this.elem.nativeElement.querySelector('#txtautoNonCall' + this.ComponentIndex).classList.add('error');
              }
            }
      */

      /*
            this.checkNotionalRes = this.apifunctions.BBVACheckNotional(this.ProductName, this.ddlNoteCcy);
            if (this.checkNotionalRes !== undefined && this.checkNotionalRes !== [] && this.checkNotionalRes.length > 0) {
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
      */

      if (this.ShareBasket.length <= 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('underlyingError');
        this.ErrorMsg = 'Please enter underlying.';
      }
      if (this.SolveForvalue !== 'Strike') {
        if (parseFloat(this.accuStrike) <= parseFloat(this.minStrike)) {
          this.ErrorMsg = 'Strike should be greater than ' + this.minStrike + '%.';
          this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.add('error');
        }
      }

      /*
      if (this.cpnTrigger !== '') {
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

      } else {
        if (this.cpnType !== 'No Coupon' && this.cpnType !== 'Fixed Coupon'
          && this.SolveForvalue !== 'CouponBarrier' && this.format !== 'Option') {
          this.ErrorMsg = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
          this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.add('error');
        }
      }

      */
      /*
 
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
       // if ((Date.parse(this.stkdate) > Date.parse(this.settdate))
       //   || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
       //   this.ErrorMsg = 'Please select valid strike date.';
       //   this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
       // }
 
       if (this.stkdate === '') {
         this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
         this.ErrorMsg = 'Please enter valid strike date.';
 
       }
 
       if (this.settdate === '') {
         this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
         this.ErrorMsg = 'Please enter valid payment date.';
       }
 
       if ((Date.parse(this.settdate) > Date.parse(this.expdate))) {
         this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
         this.ErrorMsg = 'Please select valid payment date.';
       }
       if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
         // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
         this.ErrorMsg = 'Please select valid expiry date.';
       }
 
       */
      /*
      if (this.ProductName === 'AutocallablePhoenix') {
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
       */
      if (this.accuGuarantee === '') { // Guarentee Periods validation changes || asigned by pranav || 07Mar2022
        this.ErrorMsg = 'Please select valid Guarantee periods.';
        // document.getElementById('ddlGuarantee').classList.add('error');
        // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
        // $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.accuFreq === 'BIWEEKLY') {
        if (((parseFloat(this.accuGuarantee) / 2) > (this.accuTenor / 3)) && this.accuTenorType === 'Month') {
          this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
        }
      } else {
        if ((parseFloat(this.accuGuarantee) > (this.accuTenor / 3)) && this.accuTenorType === 'Month') {
          this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
        }
      }


      if (this.accuFreq === 'BIWEEKLY') {
        if (((parseFloat(this.accuGuarantee) / 2) > ((this.accuTenor * 12) / 3)) && this.accuTenorType === 'Year') {
          this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
        }
      } else {
        if ((parseFloat(this.accuGuarantee) > ((this.accuTenor * 12) / 3)) && this.accuTenorType === 'Year') {
          this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
        }
      }

      if ((this.accuTenor == 0) || ((this.accuTenor > 60 || (this.accuTenor > this.accuTenorMaxMonth || this.accuTenor < this.accuTenorMinMonth)) && this.accuTenorType === 'Month') || ((this.accuTenor > 5 || (this.accuTenor * 12 > this.accuTenorMaxMonth || this.accuTenor * 12 < this.accuTenorMinMonth)) && this.accuTenorType === 'Year')) {

        // Changed by Amogh K | 29Apr2022 | tenor validation modified | assigned by Pranav D
        // this.ErrorMsg = 'Please enter valid tenor.';
        this.ErrorMsg = 'Please enter tenor between ' + this.accuTenorMinMonth + " to " + this.accuTenorMaxMonth + " months";

      }

      // if (this.noOfShares == 0 || this.noOfShares === '') {
      if (this.noOfShares == 0) {
        this.ErrorMsg = 'Enter valid number of shares.';

      }


      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        // this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      }

      if (this.ProductName === 'Accumulator') {
        // Pranav D JIRA EURLGTINT-5 7-Feb-2022 
        if (parseFloat(this.accuKOPerInit) < 102) {
          this.ErrorMsg = 'KO % should be greater than or equal to 102';
          this.errorMsgChanged.emit(this.ErrorMsg);
        }
      } else {
        // Pranav D JIRA EURLGTINT-5 7-Feb-2022 
        if (parseFloat(this.accuKOPerInit) > 98) {
          this.ErrorMsg = 'KO % should be less than or equal to 98';
          this.errorMsgChanged.emit(this.ErrorMsg);
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

  generateSaveXML() {
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
        '<PaymentDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</PaymentDate>' +
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
        '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<AttachPer></AttachPer>' +
        '<DetachPer></DetachPer>' +
        '<CouponSpread></CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +
        '<ERFrequency>' + this.autoFreq + '</ERFrequency>' +
        '<SubTemplate>' + this.ProductName + '</SubTemplate>' +
        '<ComputedStrikeFixingLag>' + this.stkshift + '</ComputedStrikeFixingLag>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        '<ComputedPayoffSoftTenor>' + this.expshift + '</ComputedPayoffSoftTenor>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.apifunctions.userGroupID + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        '<LeverageYN>' + this.LeverageYN + '</LeverageYN>' +
        '</Record>';
        // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
	this.commonfunctions.generateFlexiXml({xml: this.tempXML, index: this.ComponentIndex});
      return this.tempXML;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  generateSaveXMLAccuDecu() {
    try {
      var estimatedNotional = (this.estimatedNotional !== '' ? parseFloat(this.estimatedNotional.replace(/,/g, '')) : this.estimatedNotional)
      var leverageVal;

      if (this.accuChkLeverage) {
        leverageVal = 'Y'
      }
      else {
        leverageVal = 'N'
      }
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
        '<SolveFor>' + this.accuSolveFor + '</SolveFor>' +
        '<SharesQuantity>' + this.noOfShares + '</SharesQuantity>' +
        // '<TotalNotional>' + this.estimatedNotional + '</TotalNotional>' +
        '<TotalNotional>' + estimatedNotional + '</TotalNotional>' +
        '<TenorPer>' + this.accuTenor + '</TenorPer>' +
        '<TenorType>' + this.accuTenorType + '</TenorType>' +
        '<Strike>' + this.accuStrike + '</Strike>' +
        '<KOPer>' + this.accuKOPerInit + '</KOPer>' +
        '<KOType>' + this.accuKOSttlType + '</KOType>' +
        '<Frequency>' + this.accuFreq + '</Frequency>' +
        '<Guarantee>' + this.accuGuarantee + '</Guarantee>' +
        '<Upfront>' + this.accuUpfront + '</Upfront>' +
        '<LeverageYN>' + leverageVal + '</LeverageYN>' +


        '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +

        '<UpfrontAQ></UpfrontAQ>' +

        '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].BloombergCode) + '</Underlying1>' +
        '<Underlying2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].BloombergCode) + '</Underlying2>' +
        '<Underlying3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].BloombergCode) + '</Underlying3>' +
        '<Underlying4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].BloombergCode) + '</Underlying4>' +
        '<Underlying5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].BloombergCode) + '</Underlying5>' +
        '<Gearing></Gearing>' +
        // modified notional to estimated notional || PriyaL || 30Apr2022 || issue reported by AbeerJ
        '<Size>' + estimatedNotional + '</Size>' +

        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +

        '<SubTemplate>' + this.ProductName + '</SubTemplate>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.apifunctions.userGroupID + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        // '<LeverageYN>' + this.LeverageYN + '</LeverageYN>' +
        '</Record>';
        // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
	this.commonfunctions.generateFlexiXml({xml: this.tempXML, index: this.ComponentIndex});
      return this.tempXML;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  generateSaveRCXML() {
    try {
      // this.validationOnButton();
      if (this.ShareBasket.length <= 0) {
        this.commonfunctions.generateRCFlexiXml('');
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
        '<PaymentDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</PaymentDate>' +
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
        '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<AttachPer></AttachPer>' +
        '<DetachPer></DetachPer>' +
        '<CouponSpread></CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode></IndexCode>' +
        '<ERFrequency>' + this.autoFreq + '</ERFrequency>' +
        '<SubTemplate>' + this.ProductName + '</SubTemplate>' +
        '<ComputedStrikeFixingLag>' + this.stkshift + '</ComputedStrikeFixingLag>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        '<ComputedPayoffSoftTenor>' + this.expshift + '</ComputedPayoffSoftTenor>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.apifunctions.userGroupID + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        '<LeverageYN>' + this.LeverageYN + '</LeverageYN>' +
        '</Record>';
      this.commonfunctions.generateRCFlexiXml(this.tempXML);
      return this.tempXML;
    } catch (error) {
      //console.log('Error:', error);
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

      this.reset();

      this.apifunctions.priceFlag.next(false);
      this.apifunctions.rcPriceFlag.next(false);

      this.commonfunctions.deleteRow(this.ComponentIndex);
      (this.apifunctions.toggleVisiblityFlag.value).splice(this.ComponentIndex, 1);
      this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  deleteCreditRow() {
    try {
      this.apifunctions.creditFlag.next(false);
      this.commonfunctions.deleteCreditRow(this.ComponentIndex);

      this.enableToggle();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async getAttachDetachData() {
    try {
      if (this.AttachVal === '' || this.AttachVal === 'NaN') {
        this.AttachVal = '';
      }
      if (this.DetachVal === '' || this.DetachVal === 'NaN') {
        this.DetachVal = '';
      }
      if (this.AttachVal > 0 && this.DetachVal > 0) {
        this.apifunctions.attachDetachCalculationsSF.next('');
        await this.apifunctions.attachDetachCalculations(this.AttachVal, this.DetachVal);
      } else {
        this.apifunctions.attachDetachCalculationsSF.next('');
        this.attachDetachCalculationsRes = [];
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  creditcouponTypeChange() {
    try {
      this.creditreset();
      this.enableToggle();
      if (this.creditcouponType === 'Fixed') {
        this.floatingRef = '';
      } else {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.floatingRefArr.length; i++) {
          if (this.creditcouponType === 'Floating'
            && (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[0]).toUpperCase().includes(this.ddlNoteCcy.toUpperCase())) {
            if (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[1] === '3M'
              || this.floatingRefArr[i].LongName.split('-')[1].split(' ')[2] === '3M') {
              this.floatingRef = this.floatingRefArr[i].LongName.split('-')[1];
            }
          }
        }
      }
      this.changeFreq();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  changeFreq() {
    try {
      this.creditreset();
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

  setCreditSolveFor(e) {
    try {
      this.creditreset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      this.creditSolveFor = target.value;
      if (this.creditSolveFor === 'Coupon') {
        this.creditSpread = '';
        if (this.format === 'Note') {
          this.creditReofferPrice = '98.50';
        } else {
          this.creditReofferPrice = '0.00';
        }
      }
      if (this.creditSolveFor === 'Reoffer') {
        this.creditReofferPrice = '';
        this.creditSpread = '10.00';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setAccuDecuSolveFor(e) {
    try {
      // this.creditreset();
      this.accuDecuReset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      this.accuSolveFor = target.value;
      if (this.accuSolveFor === 'Strike') {
        this.accuStrike = '';
        this.accuUpfront = '0.50'
      }
      if (this.accuSolveFor === 'Upfront') {
        this.accuUpfront = '';
        if (this.ProductName === 'Decumulator') {
          this.accuStrike = '102.00';
        } else {
          this.accuStrike = '98.00';
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async CreditPrice() {
    try {
      if (this.ErrorMsg === '') {
        this.creditreset();
        let RFQTimeFlag :any = true;
        RFQTimeFlag = await this.apifunctions.BBVAValidateRFQTime(this.indexTranche);
        if (RFQTimeFlag) {
          this.loadflag = true;
          await this.CreditTranchePrice();
        } else {
          this.ErrorMsg = 'Price request not allowed after close time.';
          this.errorMsgChanged.emit(this.ErrorMsg);
        }

      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  generateCreditXML() {
    try {
      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {
          switch (this.templateMappingArr[i].email_Header) {
            case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditcouponType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditSolveFor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'floatingRef': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.floatingRef === '' ? 'N/A' : this.floatingRef) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'reofferPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditReofferPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IndexTranche': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.indexTranche + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditcouponFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Spread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditSpread + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditTenor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'cpnBasis': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditcouponBasis + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></'
              + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'AttachPer': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Attach + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'DetachPer': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.Detach + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'AttachPoint': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.AttachVal + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'DetachPoint': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.DetachVal + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'expdate':
              xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.creditIssuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IssueDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.issueDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + this.apifunctions.userGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            //   break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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

            case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.paymentshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.apifunctions.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.userID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
          }
        }
        xmlstr += '</QuoteRequest>';

        return xmlstr;
      } else {
        return '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

   //Modified By Sharayu.S || 31-03-2023 || Start
  async CreditTranchePrice() {
   
    try {
      const userGroupID = this.apifunctions.userGroup;
      let xmlstr: string = await this.generateCreditXML();
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: this.toggleFlag === 'Firm' ? 'CreditTranche' : 'CreditTrancheInd',
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.creditSolveFor,
        userGroupID: userGroupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        loginID: AppConfig.settings.oRes.userID,
        noteMasterID: this.noteMasterID,
        repricereqYN: "",
      }];
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data.errorMessage !== '' || !that.pageActive) {
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
            let quoteResponseCheck = false;
            that.interval = setInterval(async () => {
                    if (that.timeLeft > 0) {
                      that.timeoutMsg = '';
                if (!quoteResponseCheck) {
                quoteResponseCheck = await that.CreditTranchePriceResponse(that.PPDetails, that.ComponentIndex);
                }
	                that.timeLeft = Number(that.timeLeft) - 5;
                    } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                      that.loadflag = false;
                      clearInterval(that.interval);
                      that.enableToggle();
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
  async CreditTranchePriceResponse(PPDetails, _ComponentIndex) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/CheckIfResponseReceived';
      const parameters = {
        QuoteRequestID: PPDetails
      };

          


      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiCreditReceivedPrices(this.Prices, _ComponentIndex);
          let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
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
 //Modified By Sharayu.S || 31-03-2023 || End

  generateCreditSaveXML() {
    try {
      this.tempXML = '';
      this.commonfunctions.generateCreditFlexiXml(this.tempXML);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }

      this.tempXML += '<Record>' +
        '<Share></Share>' +
        '<ShareBBGRIC1></ShareBBGRIC1>' +
        '<ShareBBGRIC2></ShareBBGRIC2>' +
        '<ShareBBGRIC3></ShareBBGRIC3>' +
        '<ShareBBGRIC4></ShareBBGRIC4>' +
        '<ShareBBGRIC5></ShareBBGRIC5>' +
        '<ShareLongName1></ShareLongName1>' +
        '<ShareLongName2></ShareLongName2>' +
        '<ShareLongName3></ShareLongName3>' +
        '<ShareLongName4></ShareLongName4>' +
        '<ShareLongName5></ShareLongName5>' +
        '<CouponBarrier></CouponBarrier>' +
        '<SolveFor>' + this.creditSolveFor + '</SolveFor>' +
        '<Strike></Strike>' +
        '<IBPrice></IBPrice>' +
        '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
        '<KOPer></KOPer>' +
        '<KOType></KOType>' +
        '<UpfrontAQ></UpfrontAQ>' +
        '<KIPer></KIPer>' +
        '<KIType></KIType>' +
        '<CouponPer>' + this.creditSpread + '</CouponPer>' +
        '<CouponType>' + this.creditcouponType + '</CouponType>' +
        '<TenorPer>' + this.creditTenor + '</TenorPer>' +
        '<TenorType></TenorType>' +
        '<Underlying1></Underlying1>' +
        '<Underlying2></Underlying2>' +
        '<Underlying3></Underlying3>' +
        '<Underlying4></Underlying4>' +
        '<Underlying5></Underlying5>' +
        '<Gearing></Gearing>' +
        '<Upfront></Upfront>' +
        '<Guarantee></Guarantee>' +
        '<LowCoupon></LowCoupon>' +
        '<HighCoupon></HighCoupon>' +
        '<TradeDate_Type></TradeDate_Type>' +
        '<Frequency>' + this.creditcouponFreq + '</Frequency>' +
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
        '<AttachValue>' + this.AttachVal + '</AttachValue>' +
        '<DetachValue>' + this.DetachVal + '</DetachValue>' +
        '<FloatingRef>' + this.floatingRef + '</FloatingRef>' +
        '<FloatingFreq></FloatingFreq>' +
        '<CouponBasis>' + this.creditcouponBasis + '</CouponBasis>' +
        '<ReofferPrice>' + this.creditReofferPrice + '</ReofferPrice>' +
        '<Mode></Mode>' +
        '<FormatDetails>' + this.format + '</FormatDetails>' +
        '<CouponObs></CouponObs>' +
        '<NonCallPeriod></NonCallPeriod>' +
        '<ExpiryDate></ExpiryDate>' +
        '<IssueDate>' + this.datepipe.transform(this.issueDate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<AttachPer>' + this.Attach + '</AttachPer>' +
        '<DetachPer>' + this.Detach + '</DetachPer>' +
        '<CouponSpread>' + this.creditSpread + '</CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode>' + this.indexTranche + '</IndexCode>' +
        '<ERFrequency></ERFrequency>' +
        '<SubTemplate>' + (this.toggleFlag === 'Firm' ? 'CreditTranche' : 'CreditTrancheInd') + '</SubTemplate>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + this.apifunctions.userGroupID + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        '</Record>';
      this.commonfunctions.generateCreditFlexiXml(this.tempXML);
      return this.tempXML;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async calculateAttachPercent() {
    try {
      let AttachResult: any;
      if (this.AttachVal === '' || this.AttachVal === 'NaN' || this.AttachVal === undefined) {
        this.AttachVal = '';
        if (this.indexTranche !== '') {
          AttachResult = await this.apifunctions.getAttachPercent('-999',
            this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.AttachVal = '';
          this.ErrorMsg = 'Please select index.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }

      if (this.AttachVal !== '') {
        if (this.indexTranche !== '') {
          // this.apifunctions.getAttachPercentSF.next('');
          AttachResult = await this.apifunctions.getAttachPercent(this.AttachVal,
            this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.AttachVal = '';
          this.ErrorMsg = 'Please select index.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }

      if (AttachResult) {
        if (AttachResult.errorMessage !== undefined) {
          if (AttachResult.errorMessage === '') {
            if (parseFloat(this.DetachVal) - parseFloat(AttachResult.Attach) < parseFloat(AttachResult.Width)) {
              this.ErrorMsg = 'Difference between Attach and Detach should be at least ' + parseFloat(AttachResult.Width);
              this.errorMsgChanged.emit(this.ErrorMsg);
              if (this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
                this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add('error');
              }
              // return false;
            } else {
              this.ErrorMsg = '';
              this.errorMsgChanged.emit(this.ErrorMsg);
              if (this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.contains('error')) {
                this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.remove('error');
              }
            }
            this.Attach = parseFloat(AttachResult.PercentageValue).toFixed(4);
            this.AttachVal = AttachResult.Attach;
            await this.getAttachDetachData();
            // if (document.getElementById("AttachVal").classList.contains("error")) {
            //   document.getElementById("AttachVal").classList.remove("error");
            // }
            // if (document.getElementById("DetachVal").classList.contains("error")) {
            //   this.calculateDetachPercent();
            // }
          } else {
            this.ErrorMsg = AttachResult.errorMessage;
            this.errorMsgChanged.emit(this.ErrorMsg);
            if (this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex)) {
              this.elem.nativeElement.querySelector('#AttachVal' + this.ComponentIndex).classList.add('error');
            }
            this.Attach = '';
          }
        }
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async calculateDetachPercent() {
    try {
      let DetachResult: any;
      if (this.DetachVal === '' || this.DetachVal === 'NaN' || this.DetachVal === undefined) {
        this.DetachVal = '';
        if (this.indexTranche !== '') {
          DetachResult = await this.apifunctions.getDetachPercent('-999',
            this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.DetachVal = '';
          this.ErrorMsg = 'Please select index.';
          this.errorMsgChanged.emit(this.ErrorMsg);
          return false;
        }
      }
      if (this.DetachVal !== '') {
        if (this.indexTranche !== '') {
          // this.apifunctions.getDetachchPercentSF.next('');
          DetachResult = await this.apifunctions.getDetachPercent(this.DetachVal,
            this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.DetachVal = '';
          this.ErrorMsg = 'Please select index.';
          return false;
        }
      }
      if (DetachResult) {
        if (DetachResult.errorMessage !== undefined) {
          if (DetachResult.errorMessage === '') {
            if (parseFloat(DetachResult.Detach + '') - parseFloat(this.AttachVal) < parseFloat(DetachResult.Width + '')) {
              this.ErrorMsg = 'Difference between Attach and Detach should be at least ' + parseFloat(DetachResult.Width + '');
              this.errorMsgChanged.emit(this.ErrorMsg);
              if (this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
                this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.add('error');
              }
              // return false;
            } else {
              this.ErrorMsg = '';
              this.errorMsgChanged.emit(this.ErrorMsg);
              if (this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.contains('error')) {
                this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.remove('error');
              }
            }

            this.Detach = parseFloat(DetachResult.PercentageValue).toFixed(4);
            this.DetachVal = DetachResult.Detach;
            await this.getAttachDetachData();
            // if (document.getElementById("DetachVal").classList.contains("error")) {
            //   document.getElementById("DetachVal").classList.remove("error");
            // }
            // if (document.getElementById("AttachVal").classList.contains("error")) {
            //   this.calculateAttachPercent();
            // }

          } else {
            this.ErrorMsg = DetachResult.errorMessage;
            this.errorMsgChanged.emit(this.ErrorMsg);
            if (this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex)) {
              this.elem.nativeElement.querySelector('#DetachVal' + this.ComponentIndex).classList.add('error');
            }
            this.Detach = '';
          }
        }
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }



  async toggeleOnOff() {
    this.creditreset();
    this.enableToggle();
    await this.fnGetProdTemplate();
  }

  creditreset() {
    try {
      if (this.indexTranche === '') {
        this.elem.nativeElement.querySelector('#indexTranche' + this.ComponentIndex).classList.add('underlyingError');
        this.ErrorMsg = 'Please select index.';
        this.errorMsgChanged.emit(this.ErrorMsg);

      } else {
        this.elem.nativeElement.querySelector('#indexTranche' + this.ComponentIndex).classList.remove('underlyingError');
        this.ErrorMsg = '';

        this.errorMsgChanged.emit(this.ErrorMsg);
      }

      this.apifunctions.creditFlag.next(false);
      this.apifunctions.creditSaveFlag.next(false);
      this.commonfunctions.setsubmultiCreditReceivedPrices({}, '');

      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.togglesortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.rfqID = '';
      this.noteMasterID = '';
      this.saveFlag = false;
      this.successMsg = '';
      // this.setIssueDate('10B');
      const els = document.getElementsByClassName('error');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      if (this.SolveForvalue === 'Coupon') {
        this.creditSpread = '';
      }
      if (this.SolveForvalue === 'Reoffer') {
        this.creditReofferPrice = '';
      }
      if (this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex).classList.remove('reply');
      }
      if (this.elem.nativeElement.querySelector('#txtReoffer' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtReoffer' + this.ComponentIndex).classList.remove('reply');
      }
      this.timerinSec = -1;
      clearInterval(this.priceTimerInterval);

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  accuDecuReset() {
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
      if (this.accuSolveFor === 'Strike') {
        this.accuStrike = '';
        // this.LeverageFlag = true;
        // this.LeverageYN = 'Yes';
      }

      if (this.accuSolveFor === 'Upfront') {
        this.accuUpfront = '';
      }

      if (this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.remove('reply');
        // Added by Amogh K | 12 Apr 2022 | EULGTINT-124
        this.elem.nativeElement.querySelector('#txtStrike' + this.ComponentIndex).classList.remove('error');
      }
      if (this.elem.nativeElement.querySelector('#txtUpfront' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtUpfront' + this.ComponentIndex).classList.remove('reply');
      }

      // if (this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtCoupon' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtCouponBarrier' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtKI' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtKI' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtKO' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtFundingRate' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtFundingRate' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtSpread' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtSpread' + this.ComponentIndex).classList.remove('reply');
      // }
      // if (this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      // }
      // if (this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // }
      // if (this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex)) {
      //   this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      // }

      this.TSFlag = false;
      clearInterval(this.TSInterval);
      this.reqSuccessMsg = '';
      this.timerinSec = -1;

      this.KIDFlag = false;
      clearInterval(this.KIDInterval);
      this.reqKIDSuccessMsg = '';

      clearInterval(this.priceTimerInterval);

      this.quoteEmailSuccessMsg = '';
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  async setIssueDate(paymentshift) {
    try {
      // this.paymentshift = '10B';
      this.paymentshift = paymentshift;
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, paymentshift, '');
      this.issueDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async txtTenorChange_Credit(e, type: any) {
    try {
      this.creditreset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      const today = new Date();
      let strDate = '';
      if (target.value === undefined || target.value === '') {

        if (type === 'Payment') {
          target.value = '10B';
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

      if (type === 'Payment') {
        if (str.toUpperCase() === '0B') {
          strDate = today.getFullYear().toString() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-'
            + ('0' + today.getDate()).slice(-2);

        } else {
          this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), '');
          strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

        }
        this.issueDate = strDate;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Participation Start- added by Priya L on 14 Feb 2020

  onchangeProduct() {
    try {
      this.ptcreset();
      this.enableToggle();
      if (this.participationType === 'Guaranteed Capital') {
        this.capitalGuaranteed = '100.00';
        this.guaranteedCoupon = '0.00';
        this.guaranteedCouponFreq = 'At Maturity';
        this.downLeverage = '';
        this.downStrike = '';
        this.downLowerStrike = '';
        this.downLeverageYN = '';
        this.downBarrierType = '';
        this.downBarrierLevel = '';
      } else {
        this.capitalGuaranteed = '';
        this.guaranteedCoupon = '';
        this.guaranteedCouponFreq = '';
        this.downLeverage = '100.00';
        this.downStrike = '100.00';
        if (this.participationType === 'Booster') {
          this.downLowerStrike = '70.00';
          this.downLeverageYN = 'No';
        } else {
          this.downLowerStrike = '';
          this.downLeverageYN = '';
        }
      }
      if (this.participationType === 'Twin Win') {
        this.downBarrierType = 'At Expiry';
        this.downBarrierLevel = '100.00';
      }
      if (this.participationType === 'Booster') {
        this.downBarrierType = 'None';
        this.downBarrierLevel = '';

      }


    } catch (error) {
      //console.log('Error:', error);
    }
  }

  upbarrierTypeChange() {
    try {
      this.ptcreset();
      this.enableToggle();
      if (this.upBarrierType === 'None') {
        this.upBarrierLevel = '';
        this.upRebate = '';
      } else {
        this.upGearing = '100.00';
        if (this.upBarrierLevel === '') {
          this.upBarrierLevel = '110.00';
        }
        if (this.upRebate === '') {
          this.upRebate = '0.00';
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  downbarrierTypeChange() {
    try {
      this.ptcreset();
      this.enableToggle();
      if (this.downBarrierType === 'None') {
        this.downBarrierLevel = '';
      } else {
        if (this.downBarrierLevel === '') {
          this.downBarrierLevel = '100.00';
        }
      }
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

  ptcreset() {
    try {

      this.apifunctions.ptcPriceFlag.next(false);
      this.apifunctions.ptcsaveFlag.next(false);
      this.commonfunctions.setsubmultiPTCReceivedPrices({}, '');

      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      if (this.ShareBasket.length > 0) {
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
      this.rfqID = '';
      this.noteMasterID = '';
      this.saveFlag = false;
      this.successMsg = '';
      const els = document.getElementsByClassName('error');

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.remove('underlyingError');
      this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).classList.add('longText');

      if (this.SolveForvalue === 'IBPrice') {

        this.IBPrice = '';


      }
      if (this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex)) {
        this.elem.nativeElement.querySelector('#txtIBPrice' + this.ComponentIndex).classList.remove('reply');
      }

      clearInterval(this.priceTimerInterval);

    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  // Save XML for Participation
  generatePTCSaveXML() {
    try {
      // this.PTCValidation();
      if (this.ShareBasket.length <= 0) {
        this.commonfunctions.generatePTCFlexiXml('');
        return '';
      }
      this.tempXML = '';
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].BloombergCode + '#')) +
        '#' + this.ddlNoteCcy;

      this.tempXML += '<Record>' +
        '<Share>' + shareCcy + '</Share>' +
        ' <ProductType>' + this.participationType + '</ProductType>' +
        '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].BloombergCode) + '</ShareBBGRIC1>' +
        '<ShareLongName1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</ShareLongName1>' +
        '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
        '<IBPrice>' + this.IBPrice + '</IBPrice>' +
        '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
        '<InputStrikePercent>' + this.upStrike + '</InputStrikePercent>' +
        '<InitialInputKOBarrierPercent>' + this.upBarrierLevel + '</InitialInputKOBarrierPercent>' +
        '<InputKOBarrierFrequency>' + this.upBarrierType + '</InputKOBarrierFrequency>' +
        '<ComputedUpsidePayoffDescription></ComputedUpsidePayoffDescription>' +
        '<UpsideParticipationPercent>' + this.upGearing + '</UpsideParticipationPercent>' +
        '<UpsideParticipationCapPercent>' + this.upUpperStrike + '</UpsideParticipationCapPercent>' +
        '<InputDownsideStrikePercent>' + this.downStrike + '</InputDownsideStrikePercent>' +
        '<InitialInputKIBarrierPercent>' + this.downBarrierLevel + '</InitialInputKIBarrierPercent>' +
        '<InputKIBarrierFrequency>' + this.downBarrierType + '</InputKIBarrierFrequency>' +
        '<ComputedDownsidePayoffDescription></ComputedDownsidePayoffDescription>' +
        '<DownsideParticipationPercent>' + this.downLeverage + '</DownsideParticipationPercent>' +
        '<DownsideParticipationCapPercent>' + this.downLowerStrike + '</DownsideParticipationCapPercent>' +
        '<DownsideCapitalProtectionPercent>' + this.capitalGuaranteed + '</DownsideCapitalProtectionPercent>' +
        '<GuaranteedCoupon>' + this.guaranteedCoupon + '</GuaranteedCoupon>' +
        '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].BloombergCode) + '</Underlying1>' +
        '<Wrapper>' + this.format + '</Wrapper>' +
        '<Size>' + this.Notional + '</Size>' +
        '<PaymentDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</PaymentDate>' +
        '<StrikeDate>' + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy') + '</StrikeDate>' +
        '<FundingType>' + this.fundType + '</FundingType>' +
        '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>' +
        '<IndexRateSpread>' + this.fundRate + '</IndexRateSpread>' +
        '<ExpiryDate>' + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy') + '</ExpiryDate>' +
        '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<SubTemplate>Participation</SubTemplate>' +
        '<ComputedStrikeFixingLag>' + this.stkshift + '</ComputedStrikeFixingLag>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        '<ComputedPayoffSoftTenor>' + this.expshift + '</ComputedPayoffSoftTenor>' +
        // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
        // '<onBehalfOf>' + userGroupID + '</onBehalfOf>' +
        '<onBehalfOf></onBehalfOf>' +
        '<InputRebatePercent>' + this.upRebate + '</InputRebatePercent>' +
        '<InputMinimumCouponPercentPA>' + this.upCoupon + '</InputMinimumCouponPercentPA>' +
        '<InputFixedCouponFrequencyPeriod>' + this.guaranteedCouponFreq + '</InputFixedCouponFrequencyPeriod>' +
        '</Record>';

      this.commonfunctions.generatePTCFlexiXml(this.tempXML);
      return this.tempXML;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  fnPTCGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;

      if (this.validationArr) {

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.validationArr.length; i++) {

          switch (this.validationArr[i].Setting_Name) {
            case 'EQ_Upside_MinGearing':
              this.upMinGearing = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxGearing':
              this.upMaxGearing = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MinStrike':
              this.upMinStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxStrike':
              this.upMaxStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MinUpperStrike':
              this.upMinUpperStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxUpperStrike':
              this.upMaxUpperStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MinBarrierLevel':
              this.upMinBarrierLevel = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxBarrierLevel':
              this.upMaxBarrierLevel = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MinRebate':
              this.upMinRebate = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxRebate':
              this.upMaxRebate = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MinCoupon':
              this.upMinCoupon = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Upside_MaxCoupon':
              this.upMaxCoupon = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MinStrike':
              this.downMinStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MaxStrike':
              this.downMaxStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MinLowerStrike':
              this.downMinLowerStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MaxLowerStrike':
              this.downMaxLowerStrike = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MinBarrierLevel':
              this.downMinBarrierLevel = this.validationArr[i].Default_Value;
              break;

            case 'EQ_Downside_MaxBarrierLevel':
              this.downMaxBarrierLevel = this.validationArr[i].Default_Value;
              break;

            case 'EQ_MinReOfferPricePercentage':
              this.minReoffer = this.validationArr[i].Default_Value;
              break;

            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultTimeout = this.validationArr[i].Default_Value;
              break;
          }
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }

  }
  // Validations on control blur event
  PTCPriceValidation(e, Pricestr: string) {

    try {
      this.ptcreset();
      this.enableToggle();
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      target.classList.remove('error');

      switch (Pricestr) {
        case 'upStrike':

          if (parseFloat(target.value) < parseFloat(this.upMinStrike) || parseFloat(target.value) > parseFloat(this.upMaxStrike)) {
            this.ErrorMsg = 'Upside strike should be between ' + this.upMinStrike + ' and ' + this.upMaxStrike;
            target.classList.add('error');
          } else if (this.upUpperStrike !== '') {
            if (parseFloat(target.value) > parseFloat(this.upUpperStrike)) {
              this.ErrorMsg = 'Upper strike should be greater than upside strike';
              target.classList.add('error');
            }
          }
          break;

        case 'downStrike':

          if (parseFloat(target.value) < parseFloat(this.downMinStrike) || parseFloat(target.value) > parseFloat(this.downMaxStrike)) {
            this.ErrorMsg = 'Downside strike should be between ' + this.downMinStrike + ' and ' + this.downMaxStrike;
            target.classList.add('error');
          } else if (this.downLowerStrike !== '') {
            if (parseFloat(target.value) < parseFloat(this.downLowerStrike)) {
              this.ErrorMsg = 'Downside strike should be greater than lower strike';
              target.classList.add('error');
            }
          }
          break;

        case 'upUpperStrike':

          if (parseFloat(target.value) < parseFloat(this.upMinUpperStrike)
            || parseFloat(target.value) > parseFloat(this.upMaxUpperStrike)) {
            this.ErrorMsg = 'Upper strike should be between ' + this.upMinUpperStrike + ' and ' + this.upMaxUpperStrike;
            target.classList.add('error');
          } else if (parseFloat(target.value) < parseFloat(this.upStrike)) {
            this.ErrorMsg = 'Upper strike should be greater than upside strike';
            target.classList.add('error');
          } else if (this.downLowerStrike !== '') {
            if (target.value !== '') {
              if (parseFloat(target.value) < parseFloat(this.downLowerStrike)) {
                this.ErrorMsg = 'Upper strike should be greater than lower strike.';
                target.classList.add('error');
              } else if (parseFloat(target.value) < parseFloat(this.upStrike)) {
                this.ErrorMsg = 'Upper strike should be greater than upside strike';
                target.classList.add('error');
              }
            }
            // else {
            //   this.ErrorMsg = "Upper strike should be greater than lower strike.";
            //   target.classList.add('error');
            // }

          }
          break;

        case 'downLowerStrike':
          if (this.participationType === 'Booster') {
            if (parseFloat(target.value) < parseFloat(this.downMinLowerStrike)
              || parseFloat(target.value) > parseFloat(this.downMaxLowerStrike)) {
              this.ErrorMsg = 'Lower strike should be between ' + this.downMinLowerStrike + ' and ' + this.downMaxLowerStrike;
              target.classList.add('error');
            } else if (parseFloat(target.value) > parseFloat(this.downStrike)) {
              this.ErrorMsg = 'Downside strike should be greater than lower strike';
              target.classList.add('error');
            } else if (target.value !== '') {
              if (this.upUpperStrike !== '') {
                if (parseFloat(target.value) > parseFloat(this.upUpperStrike)) {
                  this.ErrorMsg = 'Upper strike should be greater than lower strike.';
                  target.classList.add('error');
                } else if (parseFloat(target.value) > parseFloat(this.downStrike)) {
                  this.ErrorMsg = 'Downside strike should be greater than lower strike';
                  target.classList.add('error');
                }
              }
              // else {
              //   this.ErrorMsg = "Upper strike should be greater than lower strike.";
              //   target.classList.add('error');

              // }

            }

          }

          break;

        case 'upBarrierLevel':
          if (this.upBarrierType !== 'None') {
            if (parseFloat(target.value) < parseFloat(this.upMinBarrierLevel)
              || parseFloat(target.value) > parseFloat(this.upMaxBarrierLevel)) {
              this.ErrorMsg = 'Upside barrier level should be between ' + this.upMinBarrierLevel + ' and ' + this.upMaxBarrierLevel;
              target.classList.add('error');
            }
          }

          break;

        case 'downBarrierLevel':
          if (this.downBarrierType !== 'None') {
            if (parseFloat(target.value) < parseFloat(this.downMinBarrierLevel)
              || parseFloat(target.value) > parseFloat(this.downMaxBarrierLevel)) {
              this.ErrorMsg = 'Downside barrier level should be between ' + this.downMinBarrierLevel + ' and ' + this.downMaxBarrierLevel;
              target.classList.add('error');
            }
          }

          break;

        case 'upGearing':

          if (parseFloat(target.value) < parseFloat(this.upMinGearing) || parseFloat(target.value) > parseFloat(this.upMaxGearing)) {
            this.ErrorMsg = 'Upside gearing should be between ' + this.upMinGearing + ' and ' + this.upMaxGearing;
            target.classList.add('error');
          }

          break;

        case 'upRebate':

          if (parseFloat(target.value) < parseFloat(this.upMinRebate) || parseFloat(target.value) > parseFloat(this.upMaxRebate)) {
            this.ErrorMsg = 'Upside rebate should be between ' + this.upMinRebate + ' and ' + this.upMaxRebate;
            target.classList.add('error');
          }
          break;

        case 'upCoupon':

          if (parseFloat(target.value) < parseFloat(this.upMinCoupon) || parseFloat(target.value) > parseFloat(this.upMaxCoupon)) {
            this.ErrorMsg = 'Upside coupon should be between ' + this.upMinCoupon + ' and ' + this.upMaxCoupon;
            target.classList.add('error');
          }
          break;

        case 'downLeverage':
          if (this.participationType === 'Booster' && target.value !== '') {
            if (parseFloat(target.value) < parseFloat(this.mindownLeverage)
              || parseFloat(target.value) > parseFloat(this.maxdownLeverage)) {
              this.ErrorMsg = 'Leverage should be between ' + this.mindownLeverage + ' and ' + this.maxdownLeverage;
              target.classList.add('error');
            }
          }
          break;

      }
      /// if (this.ErrorMsg !== '') {
      this.errorMsgChanged.emit(this.ErrorMsg);
      // }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Price Validation
  async PTCValidation() {
    try {
      const userGroupID = this.apifunctions.userGroupID;
      if (userGroupID === '') {
        this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      } else {
        this.ErrorMsg = '';
        this.errorMsgChanged.emit(this.ErrorMsg);
      }

      if (this.ShareBasket.length <= 0) {
        this.elem.nativeElement.querySelector('#txtShare' + this.ComponentIndex).className = 'underlyingError';
        this.ErrorMsg = 'Please enter underlying.';
      }


      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional('Participation', this.ddlNoteCcy);

      if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {

        if ((this.Notional + '').includes(',')) {

          this.Notional = this.Notional.replace(/,/g, '');
        }

        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {

          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.add('error');
          this.ErrorMsg = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and '
            + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).focus();
        } else {

          this.elem.nativeElement.querySelector('#txtnotional' + this.ComponentIndex).classList.remove('error');
        }
        if (!(this.Notional + '').includes(',')) {

          this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        }
      }

      if (parseFloat(this.upStrike) < parseFloat(this.upMinStrike) || parseFloat(this.upStrike) > parseFloat(this.upMaxStrike)) {
        this.ErrorMsg = 'Upside strike should be between ' + this.upMinStrike + ' and ' + this.upMaxStrike;
        this.elem.nativeElement.querySelector('#txtupStrike' + this.ComponentIndex).classList.add('error');
      } else {

        this.elem.nativeElement.querySelector('#txtupStrike' + this.ComponentIndex).classList.remove('error');
      }


      if (parseFloat(this.downStrike) < parseFloat(this.downMinStrike) || parseFloat(this.downStrike) > parseFloat(this.downMaxStrike)) {
        this.ErrorMsg = 'Downside strike should be between ' + this.downMinStrike + ' and ' + this.downMaxStrike;
        this.elem.nativeElement.querySelector('#txtdownStrike' + this.ComponentIndex).classList.add('error');
      } else {

        this.elem.nativeElement.querySelector('#txtdownStrike' + this.ComponentIndex).classList.remove('error');
      }

      if (this.upUpperStrike !== '') {
        if (parseFloat(this.upUpperStrike) < parseFloat(this.upMinUpperStrike)
          || parseFloat(this.upUpperStrike) > parseFloat(this.upMaxUpperStrike)) {
          this.ErrorMsg = 'Upside upper strike should be between ' + this.upMinUpperStrike + ' and ' + this.upMaxUpperStrike;
          this.elem.nativeElement.querySelector('#txtupUpperStrike' + this.ComponentIndex).classList.add('error');
        } else if (parseFloat(this.upUpperStrike) < parseFloat(this.upStrike)) {
          this.ErrorMsg = 'Upper strike should be greater than upside strike.';
          this.elem.nativeElement.querySelector('#txtupUpperStrike' + this.ComponentIndex).classList.add('error');
        } else {
          this.elem.nativeElement.querySelector('#txtupUpperStrike' + this.ComponentIndex).classList.remove('error');
        }

      }


      if (this.participationType === 'Booster') {
        if (this.downLowerStrike !== '') {
          if (parseFloat(this.downLowerStrike) < parseFloat(this.downMinLowerStrike)
            || parseFloat(this.downLowerStrike) > parseFloat(this.downMaxLowerStrike)) {
            this.ErrorMsg = 'Lower strike should be between ' + this.downMinLowerStrike + ' and ' + this.downMaxLowerStrike;
            this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.add('error');
          } else if (parseFloat(this.downStrike) < parseFloat(this.downLowerStrike)) {
            this.ErrorMsg = 'Downside strike should be greater than lower strike.';
            this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.add('error');
          } else if (this.upUpperStrike !== '') {
            if (parseFloat(this.upUpperStrike) < parseFloat(this.downLowerStrike)) {
              this.ErrorMsg = 'Upper strike should be greater than lower strike.';
              this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.add('error');
            }
          } else {
            this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.remove('error');
          }

        } else {
          if (parseFloat(this.downLeverage) < parseFloat(this.mindownLeverage)
            || parseFloat(this.downLeverage) > parseFloat(this.maxdownLeverage)) {
            this.ErrorMsg = 'Leverage should be between ' + this.mindownLeverage + ' and ' + this.maxdownLeverage;
            this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.add('error');
          } else {
            this.elem.nativeElement.querySelector('#txtdownLowerStrike' + this.ComponentIndex).classList.remove('error');
          }
        }
      }


      if (this.upBarrierType !== 'None') {
        if (parseFloat(this.upBarrierLevel) < parseFloat(this.upMinBarrierLevel)
          || parseFloat(this.upBarrierLevel) > parseFloat(this.upMaxBarrierLevel)) {
          this.ErrorMsg = 'Upside barrier level should be between ' + this.upMinBarrierLevel + ' and ' + this.upMaxBarrierLevel;
          if (this.elem.nativeElement.querySelector('#txtupBarrierLevel' + this.ComponentIndex)) {
            this.elem.nativeElement.querySelector('#txtupBarrierLevel' + this.ComponentIndex).classList.add('error');
          }
        } else {

          if (this.elem.nativeElement.querySelector('#txtupBarrierLevel' + this.ComponentIndex)) {
            this.elem.nativeElement.querySelector('#txtupBarrierLevel' + this.ComponentIndex).classList.remove('error');
          }
        }
      }



      if (this.downBarrierType !== 'None') {
        // tslint:disable-next-line: max-line-length
        if (parseFloat(this.downBarrierLevel) < parseFloat(this.downMinBarrierLevel)
          || parseFloat(this.downBarrierLevel) > parseFloat(this.downMaxBarrierLevel)) {
          this.ErrorMsg = 'Downside barrier level should be between ' + this.downMinBarrierLevel + ' and ' + this.downMaxBarrierLevel;
          if (this.elem.nativeElement.querySelector('#txtdownBarrierLevel' + this.ComponentIndex)) {
            document.getElementById('txtdownBarrierLevel').classList.add('error');
          }

        } else {

          if (this.elem.nativeElement.querySelector('#txtdownBarrierLevel' + this.ComponentIndex)) {
            this.elem.nativeElement.querySelector('#txtdownBarrierLevel' + this.ComponentIndex).classList.remove('error');
          }
        }
      }


      if (parseFloat(this.upGearing) < parseFloat(this.upMinGearing) || parseFloat(this.upGearing) > parseFloat(this.upMaxGearing)) {
        this.ErrorMsg = 'Upside gearing should be between ' + this.upMinGearing + ' and ' + this.upMaxGearing;
        this.elem.nativeElement.querySelector('#txtupGearing' + this.ComponentIndex).classList.add('error');
      } else {

        this.elem.nativeElement.querySelector('#txtupGearing' + this.ComponentIndex).classList.remove('error');
      }


      if (parseFloat(this.upRebate) < parseFloat(this.upMinRebate) || parseFloat(this.upRebate) > parseFloat(this.upMaxRebate)) {

        this.ErrorMsg = 'Upside rebate should be between ' + this.upMinRebate + ' and ' + this.upMaxRebate;
        if (this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex)) {
          this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex).classList.add('error');
        }
      } else {

        if (this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex)) {
          this.elem.nativeElement.querySelector('#txtRebateCoupon' + this.ComponentIndex).classList.remove('error');
        }

      }

      if (parseFloat(this.upCoupon) < parseFloat(this.upMinCoupon) || parseFloat(this.upCoupon) > parseFloat(this.upMaxCoupon)) {
        this.ErrorMsg = 'Upside coupon should be between ' + this.upMinCoupon + ' and ' + this.upMaxCoupon;
        this.elem.nativeElement.querySelector('#txtupCoupon' + this.ComponentIndex).classList.add('error');
      } else {

        this.elem.nativeElement.querySelector('#txtupCoupon' + this.ComponentIndex).classList.remove('error');
      }


      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');

      }

      if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
      }

      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
      }

      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        // this.errorMsgChanged.emit(this.ErrorMsg);
        // return false;
      }

      if (this.ErrorMsg !== '') {
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.enableToggle();

        this.apifunctions.ptcPriceFlag.next(false);
        this.apifunctions.ptcsaveFlag.next(false);
      }
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }
  // On Price button click
  async PTCPriceClick() {
    try {

      // this.PTCValidation();
      if (this.ErrorMsg === '') {
        this.reset();
        await this.PTCPrice();
        this.loadflag = true;
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  // Price XML generation
  async generatePTCXML(_userGroupID: any) {
    try {
      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
        let xmlstr = '<QuoteRequest>';
        this.templateName = this.templateMappingArr[0].template;
        // tslint:disable-next-line: forin
        for (const i in this.templateMappingArr) {

          switch (this.templateMappingArr[i].email_Header) {
            case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.DisplayProductName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'participationType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.participationType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
            case 'upBarrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upBarrierType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upBarrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upBarrierLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upGearing + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upUpperStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upUpperStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upRebate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upRebate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'downStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.downStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'downBarrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.downBarrierType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'expdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
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
            case 'downBarrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.downBarrierLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'downLowerStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.downLowerStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'downLeverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.downLeverage + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'capitalGuaranteed': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.capitalGuaranteed + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'guaranteedCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.guaranteedCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'SolveForValue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'upStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.upStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'guaranteedCouponFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.guaranteedCouponFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

            // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
            // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            //   + userGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            //   break;
            case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '></' + this.templateMappingArr[i].template_Field_Name + '>';
              break;


            case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.apifunctions.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + AppConfig.settings.oRes.userID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
		// FIN1EURINT-104 : Participation pay off addition in 1Europe
            case 'customTenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + (this.expshift === 'Custom' ? this.customTenor : this.expshift)
              + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;
            	// FIN1EURINT-104 : Participation pay off addition in 1Europe
            case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
              + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
              break;

          }

        }

        xmlstr += '</QuoteRequest>';

        return xmlstr;
      } else {
        return '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // Generating RFQID
   //Modified By Sharayu.S || 31-03-2023 || Start
  async PTCPrice() {
    
    try {
      const userGroupID = this.apifunctions.userGroup;

      let xmlstr: string = await this.generatePTCXML(userGroupID);
      this.clearFlag = false;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,
        subTemplateCode: 'Participation',
        LP: this.apifunctions.priceProviders.join(','),
        requestXML: xmlstr,
        solveFor: this.SolveForvalue,
        userGroupID: AppConfig.settings.oRes.groupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        loginID: AppConfig.settings.oRes.userID,
        noteMasterID: "0",
        repricereqYN: "N",
      }];

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data.errorMessage !== '' || !that.pageActive) {
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
            let quoteResponseCheck = false;
            that.interval = setInterval(async () => {
                    if (that.timeLeft > 0) {
                      that.timeoutMsg = '';
                if (!quoteResponseCheck) {
                quoteResponseCheck = await that.PTCPriceResponse(that.PPDetails);
                }
	                that.timeLeft = Number(that.timeLeft) - 5;
    
                    } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                      that.loadflag = false;
                      clearInterval(that.interval);
                      that.enableToggle();
                    }
                  }, 5000);
                }
              }
      });


    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // Price response
  async PTCPriceResponse(PPDetails) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Quote/CheckIfResponseReceived';

      const parameters = {
        QuoteRequestID: PPDetails
      };



      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        if (data['error'] === undefined) {
          this.Prices = data;
          this.commonfunctions.setsubmultiPTCReceivedPrices(this.Prices, this.ComponentIndex);
          let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
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
 //Modified By Sharayu.S || 31-03-2023 || End
  // Participation End - added by Priya L on 14 Feb 2020
  onclickShareBasket(_item: any) {
    // open dotnet popup base
    // window.open("https://euroconnect.test-equity-connect.com/FinIQWebApp/Technical_Charts/Technical_Charts.aspx?Bloomberg=" + item.Code + "&FIGI=&ISIN=&LongName=" + item.LongName + "&RIC=" + item.RICCode + "&Master_Popup=POPUP", "_blank", "");
    return false;
  }


  changeIndexTranche() {
    try {
      this.creditreset();
      this.enableToggle();
      this.Attach = '';
      this.AttachVal = '';
      this.Detach = '';
      this.DetachVal = '';
      if (this.indexTranche === '') {
        return false;
      }
      $('#loading').show();
      setTimeout(async () => {

        // if (this.indexTranche !== '') {
        // tslint:disable-next-line: max-line-length
        //   var AttachResult = this.apifunctions.getAttachPercent('-999', this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)]['Code'], this.ComponentIndex);

        // }
        // if (this.indexTranche !== '') {
        // tslint:disable-next-line: max-line-length
        //   var DetachResult = this.apifunctions.getDetachPercent('-999', this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)]['Code'], this.ComponentIndex);

        // }
        await this.calculateAttachPercent();
        await this.calculateDetachPercent();
      });
    } catch (error) {
      //console.log('Error:', error);
    }
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
    this.reset();
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
    if (this.apifunctions.toggleVisiblityFlag.value.length > 0) {
      (this.apifunctions.toggleVisiblityFlag.value)[this.ComponentIndex] = false;
      this.apifunctions.toggleVisiblityFlag.next(this.apifunctions.toggleVisiblityFlag.value);

    }
    if (this.Strike !== '') {
      if (parseFloat(this.Strike) !== 100.00) {
        this.LeverageYN = 'Yes';
        this.LeverageFlag = true;
      } else {
        this.LeverageYN = 'No';
        this.LeverageFlag = false;
      }
    } else {
      this.LeverageYN = 'Yes';
      this.LeverageFlag = true;
    }
  }
  IssuePricechange() {
    try {
      if (this.ProductName === 'Participation') {
        this.ptcreset();
      } else {
        this.reset();
      }
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

  changelowerStrikeYN() {
    try {
      this.ptcreset();
      if ((this.downLowerStrike !== '' && this.downLeverageYN === 'Yes')
        || (this.downLowerStrike === '' && this.downLeverageYN === 'Yes')) {
        this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
      } else {
        this.downLeverage = '100.00';
      }

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  changedownLeverageYN() {
    try {
      this.ptcreset();
      if ((this.downLowerStrike !== '' && this.downLeverageYN === 'Yes')
        || (this.downLowerStrike === '' && this.downLeverageYN === 'Yes')) {
        this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
      } else {
        this.downLeverage = '100.00';

      }
    } catch (error) {
      //console.log('Error:', error);
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
  async changeStkShiftToggle() {
    if (this.stkshift === '0B') {
      this.Dates = await this.apifunctions.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      }
    }
  }
  async txtTenorDateChange(type: any) {
    try {
      let strDate = '';
      this.stkdate = this.stkshift == "0B" ? this.todayDate : this.stkdate;
      if (type === 'Payment') {
        this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '0B' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        // }
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
      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      if (this.settdate === '' || (Date.parse(this.settdate) < Date.parse(this.stkdate))
        || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(this.settdate))) {
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
  getNoncall() {
    // tslint:disable-next-line: radix
    const val = parseInt(this.autoNonCall) + 1;
    return val === 1 ? val + 'st' : (val === 2 ? val + 'nd' : (val === 3 ? val + 'rd' : val + 'th'));
  }

  async RequestTermsheet() {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.orderID, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'TS');
      // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
      const res: any = await this.apifunctions.termsheetSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'Participation', this.language, this.country);
      if (res?.status.toLowerCase() === 'success') {
        this.reqSuccessMsg = 'TS Requested';

        let TSTimeLeft = this.TSTimeout;

        const that = this;
        this.TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
	    // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
            const resp: any = await this.apifunctions.ViewTermsheet(that.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
            if (resp?.length) {
              if (resp[0].Status.toString().toUpperCase() === 'SUCCESS') {
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
            clearInterval(that.TSInterval);
          }
        }, 10000);
      } else {
        this.reqSuccessMsg = 'TS Request Failed.';
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
      const res : any= await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
      if (res?.length) {
        const downloadLink = document.createElement('a');
        res.forEach(function (item: any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
            let fileName = item.Document_Output_Path;
            downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
            downloadLink.download = fileName;
            downloadLink.click();
          }
          else {
            this.ErrorMsg = item.Status.toString();
          this.errorMsgChanged.emit(this.ErrorMsg);
        }
        });

      } else {
        this.ErrorMsg = 'Termsheet not available. Please try again later.';
        this.errorMsgChanged.emit(this.ErrorMsg);

      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async GetTriggerValue(type: any) {

    if (type === 'autoTrigger') {
      this.TriggerValueArr = await this.apifunctions.GetTriggerValues(this.expshift, this.autoFreq,
        this.autoTrigger, this.autoStepDown, this.autoNonCall);
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = true;
      this.cpnTriggerPopup = false;
      this.fundRatePopup = false;
    }

    if (type === 'cpnTrigger') {
      this.TriggerValueArr = await this.apifunctions.GetTriggerValues(this.expshift, this.cpnFreq,
        this.cpnTrigger, '', '');
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.cpnTriggerPopup = true;
      this.fundRatePopup = false;
    }
    if (type === 'fundRate') {
      if (this.ProductName === 'CreditTranche') {
        this.TriggerValueArr = await this.apifunctions.GetTriggerValues(this.creditTenor, this.fundFreq,
          this.fundRate, '', '');
      } else {
        this.TriggerValueArr = await this.apifunctions.GetTriggerValues(this.expshift, this.fundFreq,
          this.fundRate, '', '');
      }

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
      if (this.ProductName === 'AutocallablePhoenix' || this.ProductName === 'ReverseConvertible') {
        await this.validationOnButton();
      }
      if (this.ProductName === 'CreditTranche') {
        await this.validationOnButtonCT();
      }
      if (this.ProductName === 'Participation') {
        await this.PTCValidation();
      }
      if (this.ProductName === 'Accumulator' || this.ProductName == 'Decumulator') {
        this.validationOnButtonAccuDecu();
      }

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
        let xmlstr = '';
        if (this.ProductName === 'AutocallablePhoenix' || this.ProductName === 'ReverseConvertible') {
          xmlstr = await this.generateXML();
        }
        if (this.ProductName === 'CreditTranche') {
          xmlstr = this.generateCreditXML();
        }
        if (this.ProductName === 'Participation') {
          xmlstr = await this.generatePTCXML(this.apifunctions.userGroupID);
        }
        if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
          xmlstr = this.generateXMLAccuDecu();
        }
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

  startCountDown(sec, index) {
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
return index;
  }

  async RequestKID() {
    try {
      this.KIDFlag = false;
      this.ErrorMsg = '';
      this.errorMsgChanged.emit('');
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.orderID, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
      const res: any = await this.apifunctions.KIDSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'Participation', this.language, this.country);
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
        this.reqKIDSuccessMsg = 'KID Awaited.';

        let TSTimeLeft = this.TSTimeout;

        const that = this;
        this.KIDInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            // FIN1EURINT-484 || Bulk Pricer: Request TS and KID API call
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
            clearInterval(that.KIDInterval);
          }
        }, 10000);
      } else {
        this.reqKIDSuccessMsg = 'KID Request Failed.';
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
      const res : any = await this.apifunctions.ViewTermsheet(this.sortedAllPrices[0].rfq, 'KID Termsheet');
      if (res !== null && res !== undefined) {
        if (res.Status.toString().toUpperCase() === 'SUCCESS') {
          const bytes = new Uint8Array(res.DGI_Image);
          const blob = new Blob([bytes], { type: 'application/doc' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = res.Document_Output_Path;
          link.click();
        } else {
          this.ErrorMsg = res.Status.toString();
          this.errorMsgChanged.emit(this.ErrorMsg);
        }

      } else {
        this.ErrorMsg = 'KID not available. Please try again later.';
        this.errorMsgChanged.emit(this.ErrorMsg);

      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  chkLeverageChange() {
    // if (this.accuChkLeverage) {
    //      this.totalShares = this.accrualDays * this.NoOfShare * 2;
    // } else {
    //      this.totalShares = this.accrualDays * this.NoOfShare;
    // }
  }

  async calculateNotional(sharecode: any, ExchangeCode: any, NoofShare: any) {
    try {
      // removal of ',' from no of shares to calculate notional 3-3-2022
      // converted NoofShare to string | changes on 16 Dec 2022 by Ashwini H.
      if ((NoofShare.toString()).includes(',')) {
        NoofShare = NoofShare.toString().replace(/,/g, '');
      }
      this.estimatedNotional = '';
      if (this.ErrorMsg === '') {

        // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
        // const shareInfo = this.apifunctions.GetSharesInfo(sharecode)
        const shareInfo = await this.apifunctions.GetShareRate(sharecode, this.ddlNoteCcy)
        // const accrualday = this.apifunctions.GetNoOfDays(ExchangeCode, this.accuTenor, this.TenorType.substr(0, 1), this.ddlNoteCcy, this.Frequency);
        const accrualdayResp = await this.apifunctions.GetNoOfDays(ExchangeCode, this.accuTenor, this.accuTenorType.substr(0, 1), this.ddlNoteCcy, this.accuFreq);
        const accrualday = accrualdayResp['NoOfDays'];
        this.accrualDays = accrualday;
        // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
        // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
        if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
          let res = 0;
          // res = shareInfo[0].Spot * accrualday * NoofShare;
          res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * accrualday * NoofShare;
          this.estimatedNotional = res.toFixed(2);// modified notional decimal point || PriyaL || 29Apr2022 || Assigned By Pranav
          this.estimatedNotional = this.estimatedNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      }
    } catch (error) {

    }
  }

  changeAccuTenor() {
    try {
      this.accuDecuReset();

      this.ErrorMsg = '';
      this.successMsg = '';


      // if ((this.accuTenor == 0) || (this.accuTenor > 60 && this.accuTenorType === 'M') || (this.accuTenor > 5 && this.accuTenorType === 'Y')) {
      //   this.ErrorMsg = 'Please enter valid tenor.';
      // }
      if ((this.accuTenor == 0) || ((this.accuTenor > 60 || (this.accuTenor > this.accuTenorMaxMonth || this.accuTenor < this.accuTenorMinMonth)) && this.accuTenorType === 'Month') || ((this.accuTenor > 5 || (this.accuTenor * 12 > this.accuTenorMaxMonth || this.accuTenor * 12 < this.accuTenorMinMonth)) && this.accuTenorType === 'Year')) {
        // Changed by Amogh K | 29Apr2022 | tenor validation modified | assigned by Pranav D
        // this.ErrorMsg = 'Please enter valid tenor.';
        this.ErrorMsg = 'Please enter tenor between ' + this.accuTenorMinMonth + " to " + this.accuTenorMaxMonth + " months";
      }
      this.errorMsgChanged.emit(this.ErrorMsg);
      // this.errorMsgChanged.emit(this.successMsg);


    }
    catch (error) {
      ////console.log("Error:", error);
    }
  }
  emailQuote(rfq) {
    // this.quoteEmailFlg = false;
    this.quoteEmailSuccessMsg = '';
    this.saveFlag = false;
    var res : any= this.apifunctions.quoteEmail(rfq);
    //console.log(res);
    if (res.InsertRFQGroupEmailNotifications_APIResult) {
      // this.quoteEmailFlg = true;
      this.quoteEmailSuccessMsg = "Quote Mail Initiated"
    }
    return false;
  }
  positionDropdownResult() {
    $("div.cdk-overlay-connected-position-bounding-box").addClass("adjust-dropdown-multi");
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
  // Added by Pranav D 7-Feb-2022 KO validation
  checkKO(accuKOPerInit: string) {
    try {
      // this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator'
      if (this.ProductName === 'Accumulator') {
        // Pranav D JIRA EURLGTINT-5 7-Feb-2022 
        if (parseFloat(accuKOPerInit) < 102) {
          this.ErrorMsg = 'KO % should be greater than or equal to 102';
          this.errorMsgChanged.emit(this.ErrorMsg);
        }
      } else {
        // Pranav D JIRA EURLGTINT-5 7-Feb-2022 
        if (parseFloat(accuKOPerInit) > 98) {
          this.ErrorMsg = 'KO % should be less than or equal to 98';
          this.errorMsgChanged.emit(this.ErrorMsg);
        }
      }
    } catch (error) {
      return false;
    }
  }

  // set default values - added by Priya L on 15Feb2022 - assigned by Pranav D.
  setdefaultvalues() {

    if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator' || this.ProductName === 'CreditTranche') {
      for (let i = 0; i < this.defaultvaluesArr.length; i++) {

        switch (this.defaultvaluesArr[i].Control_Name) {

          case 'Currency':
            this.ddlNoteCcy = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Format':
            this.format = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'SolveFor':
            if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
              this.accuSolveFor = this.defaultvaluesArr[i].Default_Value;
              // reset field values on page load based on solve for value - added by Priya L. on 24-Feb-2022 - assigned by Pranav D.
              if (this.accuSolveFor === 'Strike') {
                this.accuStrike = '';
              }
              if (this.accuSolveFor === 'Upfront') {
                this.accuUpfront = '';
              }
            } else if (this.ProductName === 'CreditTranche') {
              this.creditSolveFor = this.defaultvaluesArr[i].Default_Value;
            } else {
              this.SolveForvalue = this.defaultvaluesArr[i].Default_Value;
            }

            // //console.log(this.format,"defaultformatval");
            break;

          case 'Index':
            this.indexTranche = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Underlyings':
            // this.ShareName = this.defaultvaluesArr[i].Default_Value;
            if (this.defaultvaluesArr[i].Default_Value && this.defaultvaluesArr[i].Default_Value !== '') {
              this.defaultvaluesArr[i].Default_Value.split(',').forEach(async element => {
                if (this.shares !== undefined) {
                  var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
                  if (index >= 0) {
                    // this.ShareBasket.push({ Code: element });
                    // // this.SelectedUnderlyingBasket.UnderlyingOne['Code']=cloneData.FirstUnderlyingCode1[0];
                    // this.setSelectedUnderlyingarray('', '', element, '', '', '', '', '', '', '', '');
                    if (this.data1 === 'Add') {
                      // const bloombergCode = this.shares[index].BloombergCode;
                      const shareCode = this.shares[index].Code;
                      // const exchngCode = this.shares[index].ExchangeCode;
                      // const lName = this.shares[index].LongName;
                      // const Ccy = this.shares[index].Ccy;
                      // this.ShareBasket.push({ BloombergCode:bloombergCode,Code: shareCode, LongName: lName, Weight: '', Exchange: exchngCode });
                      // this.setSelectedUnderlyingarray(lName, Ccy, shareCode, exchngCode, '', '', '', '', '', '', '');
                      await this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
                    }

                  }
                }
              });
            }

            break;

          case 'Notional':
            if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
              this.estimatedNotional = this.defaultvaluesArr[i].Default_Value;
            } else {
              this.Notional = this.defaultvaluesArr[i].Default_Value;
            }
            this.defaultvaluesArr[i].label = "Notional"
            break;

          case 'ReofferPrice':
            this.IBPrice = this.defaultvaluesArr[i].Default_Value;
            this.defaultvaluesArr[i].label = "Reoffer (%)"
            break;

          case 'Upfront':
            if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
              this.accuUpfront = this.defaultvaluesArr[i].Default_Value;
            } else {
              this.upfront = this.defaultvaluesArr[i].Default_Value;
            }
            this.defaultvaluesArr[i].label = "Upfront (%)"
            break;

          case 'IssuePrice':
            this.issuePrice = this.defaultvaluesArr[i].Default_Value;
            this.defaultvaluesArr[i].label = "Issue Price (%)"
            break;

          case 'IssueDate':
            this.paymentshift = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Tenor':
            if (this.ProductName === 'Accumulator' || this.ProductName === 'Decumulator') {
              this.accuTenor = this.defaultvaluesArr[i].Default_Value;
              this.accuTenorMaxMonth = parseInt(this.defaultvaluesArr[i].MaxVal);
              this.accuTenorMinMonth = parseInt(this.defaultvaluesArr[i].MinVal);
            } else {
              this.creditTenor = this.defaultvaluesArr[i].Default_Value;
            }
            break;


          case 'TenorType':
            this.accuTenorType = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Attach':
            this.AttachVal = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Detach':
            this.DetachVal = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Frequency':
            this.accuFreq = this.defaultvaluesArr[i].Default_Value.toString().toUpperCase();
            break;


          case 'Shares':
            this.noOfShares = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'Strike':
            this.accuStrike = this.defaultvaluesArr[i].Default_Value;
            break;


          case 'AutoTrigger':
            this.accuKOPerInit = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'GearingLeverage':
            this.accuChkLeverage = (this.defaultvaluesArr[i].Default_Value === undefined || this.defaultvaluesArr[i].Default_Value === "undefined"
              || this.defaultvaluesArr[i].Default_Value === "" || this.defaultvaluesArr[i].Default_Value === "false") ? false : true;
            break;


          case 'GuaranteePeriods':
            this.accuGuarantee = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'CpnFreq':
            this.creditcouponFreq = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'CouponBasis':
            this.creditcouponBasis = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'CouponType':
            this.cpnType = this.defaultvaluesArr[i].Default_Value;

            break;


          case 'IndFirmToggle':
            this.toggleFlag = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'CouponSpread':
            this.creditSpread = this.defaultvaluesArr[i].Default_Value;
            break;


          case 'FloatingRef':
            this.floatingRef = this.defaultvaluesArr[i].Default_Value;
            break;

          case 'IssueDate1':
            this.issueDate = this.defaultvaluesArr[i].Default_Value;
            break;

        }
      }
    }

    this.pageloadflag=false;
  }

  // function to disable fields based on default values - added by Priya L. on 28Feb2022 - assigned by Pranav D.
  enabledisablefields(fieldName) {
    let enabledisableflag = false;
    if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
      for (let i = 0; i < this.defaultvaluesArr.length; i++) {
        if (this.defaultvaluesArr[i].Control_Name === fieldName) {
          if (this.defaultvaluesArr[i].ActiveYN === 'Y') {
            enabledisableflag = false;
          } else {
            enabledisableflag = true;
          }
          return enabledisableflag;
        }
      }
    }

    return enabledisableflag;
  }

  // Indicative Termsheet generation and Download - added by PriyaL on 07Mar2022 -assigned by PranavD - Start
  async GenerateDocument() {
    try {
      this.ErrorMsg = '';
      // modified request parameters || PriyaL || 30Apr2022 || issue reported by Sakshi G
      const res: any = await this.apifunctions.GenerateDocument(this.noteMasterID + '~' + this.rfqID);
      if (res !== null && res !== undefined) {
        if (res.GeneratedFileBytes[0] !== undefined) {
          const bytes = new Uint8Array(res.GeneratedFileBytes);
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "Accumulator_" + Guid.create();// res.Document_Output_Path;
          link.click();
        } else {
          this.ErrorMsg = res.Status.toString();
          this.errorMsgChanged.emit(this.ErrorMsg);
        }

      } else {
        this.ErrorMsg = 'Termsheet not available. Please try again later.';
        this.errorMsgChanged.emit(this.ErrorMsg);
      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  // set foucs to next element || PriyaL || 28Apr2022 || Assigned by Pranav D
  setFocus() {
    this.namefield.nativeElement.focus();
  }

  // FIN1EURINT-104 : Participation pay off addition in 1Europe
  filldropdownfromcommandata() {
    this.resetdropdownArr();
    for (let i = 0; i < this.commonData.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "StaticFormat":
          this.Format = this.parseCommonDatatoJSONArr('StaticFormat');
          break;
        case "IssueDateOffset":
          this.IssueDateOffset = this.parseCommonDatatoJSONArr('IssueDateOffset');
          break;
        case "Tenor":
          this.Tenor = this.parseCommonDatatoJSONArr('Tenor');
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
    this.Format = [];
    this.IssueDateOffset = [];
  }
  async customTenorChange() {
    try {
      this.Dates = await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.customTenor, this.settdate);
      this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.remove('error');
      this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.remove('error');
      // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.remove('error');
      if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsg = 'Please select valid strike date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        this.elem.nativeElement.querySelector('#txtstkdate' + this.ComponentIndex).classList.add('error');
        return false;
      }
      if (this.settdate === '' || (Date.parse(this.settdate) < Date.parse(this.stkdate))
        || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        this.elem.nativeElement.querySelector('#txtsettdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid payment date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
      if ((Date.parse(this.expdate) < Date.parse(this.stkdate))
        || (Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // this.elem.nativeElement.querySelector('#txtexpdate' + this.ComponentIndex).classList.add('error');
        this.ErrorMsg = 'Please select valid expiry date.';
        this.errorMsgChanged.emit(this.ErrorMsg);
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
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
}
