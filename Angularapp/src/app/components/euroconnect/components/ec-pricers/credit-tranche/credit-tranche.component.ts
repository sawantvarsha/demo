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
    stringsortBy(p: any): Array<T>;
  }
}
Array.prototype.stringsortBy = function (p): Array<any> {
  try {
    // tslint:disable-next-line: only-arrow-functions
    return this.slice(0).sort(function (a, b) {
      return (a[p].split('-')[1] > b[p].split('-')[1]) ? 1 : (a[p].split('-')[1] < b[p].split('-')[1]) ? -1 : 0;
    });
  } catch (error) {

  }

  return [];
};

@Component({
  selector: 'app-credit-tranche',
  templateUrl: './credit-tranche.component.html',
  styleUrls: ['./credit-tranche.component.scss']
})
export class CreditTrancheComponent implements OnInit {
  
  @Input() sendtocptyflag: any;

  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();
  @Output()
  selectedDate = moment();
  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment> | any;
  @ViewChild('focusable', { static: false }) namefield: ElementRef | any;
  private creditPriceSubscription: Subscription | any;
  timeoutMsg: string = '';

  ddlNoteCcy: any;
  CCY: any = [];
  ReceivedCCY: any = [];
  UnderlyingCurrency = 'EUR';
  Currency: string = '';
  issuePrice: any;
  SolveForvalue: any;
  cpnType: any;
  indexTranche: any = '';
  indexTrancheArr: any = [];
  floatingRef: any = '';
  floatingRefArr: any = [];
  reofferPrice: any;
  showSuggestions = false;
  Tenor: any;
  flag: boolean | any;
  expdate = '';
  IBPrice: any;
  Coupon: any;
  Spread: any;
  sortedAllPrices: any = [];
  AllPrices: any = [];
  Prices = [];

  interfaceUrl = environment.interfaceURL;
  asseturl = environment.asseturl;

  Notional: any;
  loadflag = false;
  orderID: any;
  Token = '';
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg: any = '';
  clearFlag: boolean | any;
  format: any;
  templateMappingArr: any;
  defaultTimeout: number = 0;
  validationArr: any;

  attachDetachCalculationsRes: any;
  Product = 'Credit Tranche';

  cpnFreq: any;
  fundType: any;
  fundFreq: any;
  fundRate: any;

  rfqID: any;
  Dates: any = [];
  cpnBasis: any;
  Detach: any;
  Attach: any;
  AttachVal: any;
  DetachVal: any;
  selectedIndexTranche: any;
  toggleFlag: any = 'Ind';
  replySolveFor: any;
  replySolveFor1: any;
  orderStatus: any;
  saveFlag = false;
  successMsg: any;
  NoteMasterID: any;
  trancheDetailsFlag: boolean | any;
  checkNotionalRes: any;
  issueDate: any = '';
  viewOnly = false;
  tempXML = '';

  portfolioId: any;
  scheduledReqId: any;

  allBooksData: any = [];
  onBehalfOf = '';
  paymentshift: any;
  minReoffer: any;
  portfolioGroupID: any = '';
  TriggerValueArr: any;
  fundRatePopup = false;
  priceoptionflag = false;
  saveoptionflag = false;
  showSchedulePopupFlag = false;
  showsaveSharePopupFlag = false;
  GetClientProdDetailsArr: any;
  priceBtnActive = 'Y';
  mappedformatlist: any;
  


  userName: string | any;
  selectedUserIndex = 0;
  showSuggestions_User = false;
  userflag: boolean | any;
  users: any;
  // userName: string;
  userCode: any;
  selectedBIndex_User = 0;
  userBasket: any = [];
  currentowner: any;
  saveportfolioId = '';
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  infoMsg = '';
  tenorArr: any = [];
  recoveryType = '';
  recoveryTypeArr: any = [];
  settlementType = '';
  settlementTypeArr: any = [];
  fundIndex: any;
  maturityDate = '';
  FirstLongCpn: any;           //Added by riddhip
  floatingRefAll: any = [];
  noteDatesArr: any = [];
  swapDatesArr: any = [];
  scheduleType = 'Regular';
  scheduleFreq = 'Monthly';
  scheduleFreqArr: any = [];
  scheduleTypeArr: any = [];
  swapMaxDate = '';
  WatchID: any;
  // BBVACPLI-357 CLN Videos parameters
  disclaimer = '';
  disclaimerArr: any = [];
  filterdisclaimerArr: any = [];
  languageArr: any = [];
  formatbasedlanguageArr: any = [];
  language = '';
  showdisclaimerPopupFlag = false;
  buttonList: any = '';
  showVideoPopupFlag = false;
  videoURL = '';
  downloadURL = '';
  CopyURLFlag = false;
  // BBVAEPCLI-81 Pranav D 23-Sep-2022 
  creditTrancheIndexCode: any = [];
  selectedIndexCode: any;
  ShowSchedulePricePopup: boolean = false;
  reqSuccessMsg: string = "";
  // BBVAEPCLI-271 Pranav D  2-Jan-2023
  creditToggleYN: any = 'N';
  cpnFirst: any = 'Short';

  // Add to watchlist variabled
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
  Exchange: any


  // Suvarna P || BBVAEPCLI-507 || Credit Tranche: Termsheet for Single Pricer
  // View TS flag and timer
  // Suvarna P || 28Jun23 || BBVAEPCLI-614 || TS request timeout to be increased to 2 mins || assigned by Nitij M
  // TSTimeout = 60;
  TSTimeout = 120;
  TSInterval: any;
  TSFlag = false;
  attachDetachDiffValidation: boolean = false; // Added by Pranav D BBVAEPCLI-613 28-Jun-2023 flag introduced to stop pricing if attach detach difference validation fired
  ccyBasedIndices: any[] = []; // BBVAEPCLI-610 Pranav D 16-Aug-2023 
  SaveandShareErrorMsg:any; // BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23 
  selectedFormat: any; // Added by Pranav D BBVAEPCLI-610 if format is same on changing OnBehalfOf then floating ref should not change

  commonData:any = [];
  shares: any;
  settdate = '';
  // changed by Suvarna P || 24May2022 ||  BBVACLI-271 || issue-date shifter changing on adding and removing share reported by Abeer J; unwanted variables || assigned by Pranav D
  stkdate = '';
  expshift: any;
  stkshift: any;
  stkshiftFwd : any = 'Fwd';
  stkshiftTdy : any = '0B';
  customTenor = '';
  customSetDate: number = 1;
  defaultvaluesArr:any = [];
  TenorDropdown: any=[];
  Format = []; //Apurva K
  IssueDateOffset = []; //Apurva K
  SolveForDropdown: any=[]; //Apurva K
  CouponDayBasis: any =[]; //Apurva K
  CpnFreqArr: any =[]; //Apurva K
  AutocallFrequency = [];
  autoNonCallArr: any = [];
  IndicativeOrFirm: any;
  firstCpnYN: any = 'N';
  docSupportStatus: any = {};
  defaultOrderTimeout: number;
  priceProvidersArr: any = [];
  priceProvidersArrCpy: any = [];
  CTPriceSubscription: Subscription;
  bestLPArray: any = [];
  shwRepriceBookOrder = false;
  sendtoCptyBookOrder = false;
  variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87

  constructor(public elem: ElementRef, public commonfunctions: CommonfunctionsService,
    public echome: EcHomeService, public eccommon: EcCommonService, public http: HttpClient,
    public apifunctions: ApifunctionsService, public datepipe: DatePipe, private route: ActivatedRoute) { 
    try {
      this.ddlNoteCcy = 'EUR';
      this.UnderlyingCurrency = 'EUR';
      this.issuePrice = 100;
      this.SolveForvalue = 'Coupon';
      this.format = 'Note';
      this.cpnType = 'Fixed';
      this.trancheDetailsFlag = false;
    } catch (error) {

    }
  }
  showdisclaimerPopup() {
    this.disclaimer = '';
    if (this.formatbasedlanguageArr && this.formatbasedlanguageArr.length > 0) {
      this.language = this.formatbasedlanguageArr[0].misc1;
    }
    if (this.filterdisclaimerArr && this.filterdisclaimerArr.length > 0) {
      this.disclaimer = this.filterdisclaimerArr[0].misc1;
    }
    this.showdisclaimerPopupFlag = true;
    return false;
  }

  hidedisclaimerPopup() {
    this.showdisclaimerPopupFlag = false;
    return false;
  }

  closeVideoPopup() {
    this.showVideoPopupFlag = false;
    return false;
  }
  ngOnInit() {
    try {
      $('#loading').show();
      setTimeout(async() => {

        this.IndicativeOrFirm = 'Ind';
        this.Notional = '1,000,000';
        this.format = 'Note';
        this.SolveForvalue = 'Coupon';
        this.paymentshift = 'T + 5';
        this.expshift = '1Y';

        if (this.echome.CCY === undefined || this.echome.CCY?.length <= 0) {
          this.ReceivedCCY = await this.echome.BBVALoadCCY();
        }
       
        this.shares = await this.echome.shares;
        this.ReceivedCCY = await this.echome.CCY;
        //console.log(this.ReceivedCCY,"ReceivedCCY console")
        try {
          this.ReceivedCCY.forEach((element) => {
            const ccyData = element.Ccy;
            this.CCY.push(ccyData);
          });
        } catch (error) {
        }

        // if (this.echome.floatingRefArrCLN === undefined || this.echome.floatingRefArrCLN?.length <= 0) {
        //   this.floatingRefAll = await this.echome.BBVALoadSharesAssets('IR','CF');
        // } 

        //Need to check again|| Apurva K
        if (this.echome.indexTrancheArr === undefined || this.echome.indexTrancheArr?.length <= 0) {
          this.indexTrancheArr = await this.echome.BBVALoadSharesAssets('CR','CR');

        }

       // this.indexTrancheArr = await this.echome.indexTrancheArr;
        console.log(this.indexTrancheArr,"indexTrancheArr");

        this.floatingRefAll = await this.echome.floatingRefArrCLN;
        console.log(this.floatingRefAll,"floatingRefAll");
        
        this.floatingRefArr = this.floatingRefAll.filter((d: { Ccy: any; }) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          this.fundIndex = '';
        }

        this.commonData = await this.echome.GetCommonDataEuroConnect("CreditTranche");
        //console.log(this.commonData,"common data console")
        if (this.commonData && this.commonData.length > 0) {
         
          await this.filldropdownfromcommandata();
        }
        //console.log(this.commonData,"common data")
        //console.log(this.Format,"commondata Apurva 2")
        //console.log(this.CCY,"CCY console")

        this.users =  await this.echome.GetMappedUsersAndGroups();
        const res:any = await this.echome.GetPriceProviderDetails(this.templateMappingArr?.length > 0 ? this.templateMappingArr[0].template : 'CreditTranche');
        console.log(res, "GetPriceProviderDetails")

        const that = this;
        this.CTPriceSubscription = await this.eccommon.CTSignalRPrices.subscribe(res => {
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
           // that.bookOrderFlag = false;
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


        if (this.echome.validationArr === undefined || this.echome.validationArr.length <= 0) {
          this.validationArr = this.echome.BBVAFetchValidation('EQ');

        }
       //Added by Apurva K
       this.Dates = await this.echome.BBVAGetDates('', '0B', '');
       if (this.Dates) {
         this.todayDate = this.eccommon.formatDate(this.Dates.MaturityDate);

       }

       //this.Dates = await this.echome.BBVAGetDates(this.Exchange(), '0B', '');
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
         // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
       }

       // Modified shifter as per the tenor offset || PriyaL || 27Apr2022 || Assgned by Pranav D.
       // this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
      
       // this.Dates =await this.apifunctions.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? '' : this.Tenor), this.settdate);
       this.Dates = await this.echome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate); // Changed by Jyoti S || 09-May-2023
       
       if (this.Dates) {
         this.expdate = this.eccommon.formatDate(this.Dates.MaturityDate);
         // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
       }
        this.formatChange();

        this.fnGetValidation();
        this.fnGetProdTemplate();

        this.creditPriceSubscription = this.commonfunctions.CreditSignalRPrices.subscribe(res => {
          const prices = res.price;
          if (prices) {
            this.sortedAllPrices = [];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < prices.length; i++) {
              if (this.AllPrices.findIndex((record: any) => record.rfq === prices[i].rfqID) === -1) {
                this.AllPrices.push({
                  rfq: prices[i].rfqID,
                  lp: prices[i].ppID,
                  Price: (prices[i].value === null ? 'Rejected' : parseFloat(prices[i].value).toFixed(2)),
                  Price2: (prices[i].value2 === null ? 'Rejected' : parseFloat(prices[i].value2).toFixed(2)),
                  Price3: (prices[i].value3 === null ? 'Rejected' : parseFloat(prices[i].value3).toFixed(2)),
                  Price4: (prices[i].value4 === null ? 'Rejected' : parseFloat(prices[i].value4).toFixed(2)),
                  solveFor: prices[i].solveFor,
                  NoteMasterID: prices[i].noteMasterID,
                  id: prices[i].id,
                  status: prices[i].status,
                  QueueStatus: (prices[i].value === null ? 'Rejected' : '')  // changes by Suvarna P || 13May2022 || BBVACLI-214 || assigned by Pranav D 

                });
              }
            }

            this.sortedAllPrices = this.AllPrices.sortBy('Price');

            // BBVACLI-357 Added by Pranav D 17-Aug-2022 
            this.buttonList = '';
            this.ddllangChange();
            const that = this;
            if (this.sortedAllPrices.length > 0) {
              that.loadflag = false;
              let price = '';
              let price2 = '';
              let price3 = '';
              let price4 = '';
              if (this.sortedAllPrices[0].Price !== 'Rejected') {
                price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
              }
              if (this.sortedAllPrices[0].Price2 !== 'Rejected') {
                price2 = parseFloat(this.sortedAllPrices[0].Price2).toFixed(2);
              }
              if (this.sortedAllPrices[0].Price3 !== 'Rejected') {
                price3 = parseFloat(this.sortedAllPrices[0].Price3).toFixed(2);
              }
              if (this.sortedAllPrices[0].Price4 !== 'Rejected') {
                price4 = parseFloat(this.sortedAllPrices[0].Price4).toFixed(2);
              }
              switch (this.sortedAllPrices[0].solveFor) {
                case 'Coupon':
                  this.Spread = price;
                  that.replySolveFor = 'Coupon';

                  break;
                case 'Reoffer':
                  this.reofferPrice = price;
                  that.replySolveFor = 'Reoffer';
                  break;

                case 'AttachDetach':
                  this.AttachVal = price;
                  this.Attach = price2;
                  this.DetachVal = price3;
                  this.Detach = price4;
                  that.replySolveFor = 'Attach';
                  that.replySolveFor1 = 'Detach';
                  break;

              }
              if (price !== '') {
                if (this.SolveForvalue !== 'AttachDetach') {
                  this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor).classList.add('reply');
                } else {
                  this.elem.nativeElement.querySelector('#txtAttachVal').classList.add('reply');
                  this.elem.nativeElement.querySelector('#txtAttach').classList.add('reply');
                  this.elem.nativeElement.querySelector('#txtDetachVal').classList.add('reply');
                  this.elem.nativeElement.querySelector('#txtDetach').classList.add('reply');
                }
              }
              that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
              that.orderID = this.sortedAllPrices[0].id;
              that.orderStatus = this.sortedAllPrices[0].status;

            }
            if (this.sortedAllPrices.length > 0) {

              this.timeLeft = -1;
              this.timeoutMsg = '';

              clearInterval(this.interval);
            }
            if (this.timeLeft === 0) {
              this.sortedAllPrices = [];
              // this.loadflag = false;
            } else {
              this.timeoutMsg = '';
            }
          }
        });

        this.route.params.subscribe
          ((params: any) => {
            if (params.RFQ_ID) {
              let preQuoteData1: any;
              preQuoteData1 = this.apifunctions.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');

              if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                this.ErrorMsg = 'No data found for this record.';
              } else {
                // viewOnly
                //Changed Condition | Anubhav Goyal | 1-June-2023 |BBVACLI-1115 While cloning from Scheduled Request, Previous Quotes, and Saved Requests widgets, again clone button has to be selected when the product screen opens.
                this.viewOnly = (params.viewOnly === "true") ? true : false;
                // changes by Suvarna P || 13May2022 || BBVACLI-214 || assigned by Pranav D
                if (params.QueueStatus) {
                  preQuoteData1['cloneData']['QueueStatus'] = [params.QueueStatus];
                }
                this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              }
            }
            if (params.PS_ID) {
              let preQuoteData1: any;
              this.scheduledReqId = params.PS_ID
              preQuoteData1 = this.apifunctions.getPreviousQuoteCloneData(params.PS_ID, 'PS_ID');
              //  
              if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                this.ErrorMsg = 'No data found for this record.';
              } else {
                // <Start> Vaibhav B | 20-01-2023 | BBVACLI-765 | View from Scheduled request widget Issue
                this.viewOnly = (params.viewOnly === "true") ? true : false;
                // if (params['viewOnly']  == "false")
                // {
                //     this.viewOnly = false;
                // }
                // else {
                //   this.viewOnly = true;
                // }
                // this.viewOnly = false;
                // <End> Vaibhav B | 20-01-2023 | BBVACLI-765 | View from Scheduled request widget Issue
                this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              }
            }
            if (params.BBVAID) {
              let preQuoteData1: any;
              preQuoteData1 = this.apifunctions.getPreviousQuoteCloneData(params.BBVAID, 'BBVAID');
              if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                this.ErrorMsg = 'No data found for this record.';
              } else {
                // viewOnly
                //Changed Condition | Anubhav Goyal | 1-June-2023 |BBVACLI-1115 While cloning from Scheduled Request, Previous Quotes, and Saved Requests widgets, again clone button has to be selected when the product screen opens.
                this.viewOnly = (params.viewOnly === "true") ? true : false;
                this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
              }
            }
            if (params.PORTFOLIO_ID) {
              this.portfolioId = params.PORTFOLIO_ID;
              const saveQuoteData: any = this.apifunctions.getRedirectionData(params.PORTFOLIO_ID);
              if (saveQuoteData.length === 0) {
                this.ErrorMsg = 'No data found for this record.';
              } else {
                // viewOnly
                //Changed Condition | Anubhav Goyal | 1-June-2023 |BBVACLI-1115 While cloning from Scheduled Request, Previous Quotes, and Saved Requests widgets, again clone button has to be selected when the product screen opens.
                this.viewOnly = (params.viewOnly === "true") ? true : false;
                this.setSaveQuoteData(saveQuoteData[0], this.viewOnly);
              }
            }
            if (params.Underlyings || params.Tenor) {
              this.indexTranche = params.Underlyings.split(",")[0];
              this.reset();
              // function added on routing from dashboard to display tenor based on redit Tranche index Pranav D BBVACLI-542 13-Oct-2022
              this.tenorbasedonIndex();
              this.chngIndexCode();
            }

          });

        this.route.queryParams.subscribe((res: any) => {
          if (res.Underlying) {

            this.indexTranche = res.Underlying;
            this.reset();
            this.tenorbasedonIndex();
            this.chngIndexCode();
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
  monthSelected(date: Moment) {
    //  
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
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.timeLeft = -1;
    this.timeoutMsg = '';
    clearInterval(this.interval);
    this.AllPrices = [];
    this.sortedAllPrices = [];
    this.commonfunctions.setCreditReceivedPrices({}, '');
    if (this.creditPriceSubscription !== undefined) {
      this.creditPriceSubscription.unsubscribe();
    }
    //Start Added by riddhiP || 28MARCH23 || BBVACLI-1008 || 11:29 am || reducing api call 
    this.users = [];
    this.scheduleFreqArr = []
    this.scheduleTypeArr = []
    this.languageArr = []
    this.disclaimerArr = []
    this.recoveryTypeArr = []
    this.settlementTypeArr = []
    this.creditTrancheIndexCode = []
    //end Added by riddhiP || 28MARCH23 || BBVACLI-1008 || 11:29 am || reducing api call  
  }

  scheduleTypeChange() {
    if (this.scheduleType === 'One-Off') {
      this.scheduleFreq = '';
    } else {
      this.scheduleFreq = 'Monthly';
    }

  }

  reset() {
    try {

      $(document).bind("ajaxStart", () => {
        // $("#loading").show();
      });

      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      // Suvarna P || BBVAEPCLI-507 || Credit Tranche: Termsheet for Single Pricer
      this.TSFlag = false;
      clearInterval(this.TSInterval);
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.rfqID = '';
      this.saveFlag = false;
      this.successMsg = '';
      this.reqSuccessMsg = '';

      const els = document.getElementsByClassName('error');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      if (this.SolveForvalue === 'Coupon') {
        this.Spread = '';
      }
      if (this.SolveForvalue === 'Reoffer') {
        this.reofferPrice = '';

      }
      if (document.getElementById('txtCoupon')) {
        document.getElementById('txtCoupon')!.classList.remove('reply');
      }
      if (document.getElementById('txtReoffer')) {
        document.getElementById('txtReoffer')!.classList.remove('reply');
      }


    } catch (error) {

    }
    return false;
  }

  
  fnGetProdTemplate() {
    try {
      // add by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || common service for all products || assigned by Pranav D
      this.templateMappingArr = this.apifunctions.fnGetProdTemplate(this.toggleFlag ? 'CreditTranche' : 'CreditTrancheInd');
      // const webMethod = this.interfaceUrl + 'PHXAutocallableTemplate';
      // const that = this;
      // const parameters = {
      //   Product: this.toggleFlag ? 'CreditTranche' : 'CreditTrancheInd'
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

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      if (this.validationArr) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.validationArr.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultTimeout = this.validationArr[i].Default_Value;
              break;

            //Added by Anubhav | 16-02-2023
            case 'EQ_Watchlist_MaxValidity_Days':
              this.maxValidityDays = this.validationArr[i].Default_Value;
              this.MaxSelectDate = moment().add({ days: this.maxValidityDays }).format('YYYY-MM-DD');
              break;
          }
        }
      }
    } catch (error) {

    }
  }

  setIssueDate(paymentshift: any) {
    try {
      this.paymentshift = paymentshift;
      this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, paymentshift, '');
      this.issueDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.maturityDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
      // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
    } catch (error) {

    }
  }

  getAttachDetachData() {
    try {
      if (this.AttachVal === '' || this.AttachVal === 'NaN') {
        this.AttachVal = '';
      }
      if (this.DetachVal === '' || this.DetachVal === 'NaN') {
        this.DetachVal = '';
      }
      if (this.AttachVal >= 0 && this.DetachVal >= 0) {
        this.apifunctions.attachDetachCalculationsSF.next('');
        this.apifunctions.attachDetachCalculations(this.AttachVal, this.DetachVal);
      } else {
        this.apifunctions.attachDetachCalculationsSF.next('');
        this.attachDetachCalculationsRes = [];

      }
    } catch (error) {

    }
  }

  formatChange() {
    try {
      this.reset();
      this.floatingRefArr = [];
      this.fundIndex = '';
      this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
      if (this.floatingRefArr && this.floatingRefArr.length > 0) {
        this.fundIndex = this.floatingRefArr[0].Code;
        if (this.cpnType !== 'Fixed') {
          this.floatingRef = this.floatingRefArr[0].Code;
          this.changeFreq();
        } else {
          this.floatingRef = '';
          this.floatingRefArr = [];
        }

      }
      if (this.format === 'Swap') {
        this.fundType = 'Floating Rate';
        this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          if (this.fundType === 'Floating Rate') {
            this.fundIndex = this.floatingRefArr[0].Code;
            this.changeFreq();
          } else {
            this.fundIndex = '';
            this.floatingRefArr = [];
          }
        }
        //this.fundFreq = '3m';

        if (this.format === 'Swap') {
          // this.fundFreq = '3m';
          this.fundFreq = '1m'; // Changed by Pranav D 16-Aug-2023 BBVAEPCLI-610 as 1m index added
        }
        // Start|| RadhaM || 31-08-23 ||BBVAEPCLI-610|| Fund frequency default value not being set for currency USD
        if (this.format === 'Swap' && (this.ddlNoteCcy==='USD'|| this.ddlNoteCcy==='GBP'|| this.ddlNoteCcy==='CHF')) {
          this.fundFreq = '3m';
        }
        // End|| RadhaM || 31-08-23||BBVAEPCLI-610|| Fund frequency default value not being set for currency USD
        // Comment by Pranav D 10-Feb-2022 to enable frequency for Flating Rate
        // if (this.format === 'Swap' && this.fundType === 'Floating Rate') {
        //   this.fundFreq = '3m';
        // } else {
        //   this.fundFreq = '3m';  
        // }

        this.issuePrice = '';
        if (this.SolveForvalue === 'Coupon') {
          this.reofferPrice = '0.00';
        } else {
          this.reofferPrice = '';
        }

        if (this.SolveForvalue === 'FundingRate') {
          this.fundRate = '';
        } else {
          this.fundRate = '1.00';

        }
      } else {
        this.issuePrice = '100.00';
        if (this.SolveForvalue === 'Coupon') {
          //this.reofferPrice = '98.50'; // Commented by Anubhav Goyal | 24-Jul-2023 | BBVAEPCLI-630 | Reoffer changes to 99.50% in the single pricer when you change the on behalf of
        } else {
          this.reofferPrice = '';
        }
        if (this.format === 'Swap') {
          this.ddlNoteCcy = 'EUR';

        }
        this.fundType = '';
        this.fundFreq = '';
        this.fundRate = '';
        this.fundIndex = '';

        if (this.format === 'Swap' && this.fundType === 'Fixed Rate') {
          this.fundIndex = '';
        }
      }
      this.selectedFormat = this.format; // Added by Pranav D BBVAEPCLI-610 if format is same on changing OnBehalfOf then floating ref should not change

    } catch (error) {

    }
    return false;
  }


  changeFreq() {
    try {
      this.reset();
      if (this.floatingRef !== '') {
        // if case for 1M added by Pranav D BBVAEPCLI-610 as 1M index added and needs to be shown in dropdown as per Fund Index
        if (this.floatingRef.includes('1M')) {
          this.cpnFreq = '1m';
        }
        else if (this.floatingRef.includes('3M')) {
          this.cpnFreq = '3m';
        } else if (this.floatingRef.includes('6M')) {
          this.cpnFreq = '6m';
        } else if (this.floatingRef.includes('12M')) {
          this.cpnFreq = '12m';
        } 
        // Suvarna P || 22Sep23 || BBVAEPCLI-610 || cpnFrq mistmatch in UI and XML
        else {
          if (this.floatingRef === 'SONIA' || this.floatingRef === 'SOFR' || this.floatingRef === 'SARON'){
            this.cpnFreq = '3m';
           }
        }
        // else part removed by Pranav D 16-Aug-2023 Pranav D as per BBVAEPCLI-610
        // else {
        //   this.cpnFreq = '1m';
        // }
      } else {
        if (this.cpnType === 'Floating') {
          this.cpnFreq = '';
        } else {
	// Suvarna P || 22Sep23 || BBVAEPCLI-610 || IR Index on ePricer for Credit Products || issue- cpnFreq always 1m in pricing xml
         if (this.floatingRef === 'SONIA' || this.floatingRef === 'SOFR' || this.floatingRef === 'SARON'){
          this.cpnFreq = '3m';
         }
         else{
          this.cpnFreq = '1m';
         }
        }

      }
    } catch (error) {

    }
  }


  ddllangChange() {
    this.filterdisclaimerArr = [];
    if (this.formatbasedlanguageArr.findIndex((obj: any) => obj.misc1 === this.language) > -1) {
      this.filterdisclaimerArr = this.disclaimerArr.filter((res: any) =>
      ((res.Misc2 + '').toUpperCase() === (this.formatbasedlanguageArr[this.formatbasedlanguageArr.findIndex((obj: any) => obj.misc1 === this.language)].Data_Value + '').toUpperCase()
        && (res.Misc3 + '').toUpperCase() === (this.format + '').toUpperCase()));
      this.disclaimer = this.filterdisclaimerArr[0].misc1;
      //  
      //  
    }

  }

  setPrevQuoteData1(cloneData: any, viewOnly: any) {
    try {
       
      this.buttonList = cloneData.Actions[0];

      this.indexTranche = cloneData.InputCreditIndexTranche[0];
      //  
      let indexCodeFlag = false;
      //  
      this.creditTrancheIndexCode.forEach((res: any) => {
        // changed by Suvarna P || BBVACLI-1072 || BBVAEPCLI-538 || Credit Tranche: Not able to play videos on UAT
        // if (this.indexTranche === res.Data_Value) {
        // 
        if (this.indexTranche.includes(res.Data_Value)) {
          this.selectedIndexCode = res.misc1;
          indexCodeFlag = true;

        }
      });

      if (!indexCodeFlag) {
        this.selectedIndexCode = '';
      }



      this.ddlNoteCcy = cloneData.InputSettlementCurrency[0];

      // button list added by Pranav D 17-Aug-2022 CLN videos BBVACLI-357
      // Added by riddhi p || 20feb23 || BBVACLI-917 || Credit Tranche: On viewing from Watchlist Tenor, Attach and Detach is going blank
      // this.buttonList = cloneData.Actions[0];

      this.format = cloneData.InputProductFormatType[0];
      this.formatChange();

      // Video desclaimer dropdown was empty while routing from Previous Quotes to Credit Tranche single pricer
      if (this.languageArr && this.languageArr.length > 0) {
        // this.language = this.languageArr[0].misc1;

        // this.formatbasedlanguageArr = this.languageArr.filter(res => res.Misc3 === this.format);
        // this.formatbasedlanguageArr = this.languageArr.filter((res: any) => res.Misc2 === 'CreditTranche');
        // changed by Suvarna P || BBVACLI-1072 || BBVAEPCLI-538 || Credit Tranche: Not able to play videos on UAT
        this.formatbasedlanguageArr = this.languageArr.filter((res: any) => (res.Misc3 === this.format) && (res.Misc2 === 'CreditTranche'));
        //if condition added to check array length before assigning values in case of 0 length array Pranav D 16-Aug-2023 BBVAEPCLI-610 dependant
        if (this.formatbasedlanguageArr.length > 0) {
          this.language = this.formatbasedlanguageArr[0].misc1;
        }
        
        this.ddllangChange();
      }


      // need to be removed when swap is enable --PriyaL 20-Nov-2021
      // if (this.format === 'Swap') {
      //   this.format = '';
      // }
      // code changes done by Pranav D 29-Mar-2022 to enable CHF and GBP currency as asked by BBVA on clone action BBVACLI-136
      // if (cloneData.InputProductFormatType[0] === 'Swap' && (cloneData.InputSettlementCurrency[0] === 'CHF' || cloneData.InputSettlementCurrency[0] === 'GBP')) {
      //   this.ddlNoteCcy = 'EUR';
      // }
      this.Notional = this.commonfunctions.formatNotional(cloneData.InputRFQNotionalAmount[0]);


      this.SolveForvalue = cloneData.InputRFQSolveFor[0];
      this.issuePrice = cloneData.InputInterBankPrice[0];
      this.reofferPrice = cloneData.InputReofferPrice[0];
      // tslint:disable-next-line: radix

      if (cloneData.InputCreditAttachmentInteger[0] !== undefined && cloneData.InputCreditAttachmentInteger[0] !== '') {
        this.AttachVal = parseInt(cloneData.InputCreditAttachmentInteger[0]);
      } else {
        this.AttachVal = '';
      }
      this.Attach = cloneData.InputCreditAttachmentPercent[0];
      // tslint:disable-next-line: radix

      if (cloneData.InputCreditDettachmentInteger[0] !== undefined && cloneData.InputCreditDettachmentInteger[0] !== '') {
        this.DetachVal = parseInt(cloneData.InputCreditDettachmentInteger[0]);
      } else {
        this.DetachVal = '';
      }
      this.Detach = cloneData.InputCreditDettachmentPercent[0];
      this.cpnType = cloneData.StaticCouponType[0];
      if (this.cpnType === 'Floating') {
        this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          //this.fundIndex = this.floatingRefArr[0].Code; no need
          // if (this.cpnType !== 'Fixed') {
          this.floatingRef = this.floatingRefArr[0].Code;
          // } else {
          //   this.floatingRef = '';
          // }


        }
      }

      // <Start> Added by Vaibhav B | 30-03-2023 | BBVACLI-1017 | as reported by Sakshi G.
      if (cloneData.FirstLongCoupon[0] == 'Long') {
        this.creditToggleYN = 'Y';
      }
      else if (cloneData.FirstLongCoupon[0] == 'Short') {
        this.creditToggleYN = 'N';
      }
      else {
        this.creditToggleYN = 'N';
      }
      // <End> Added by Vaibhav B | 30-03-2023 | BBVACLI-1017 | as reported by Sakshi G.

      this.cpnFreq = cloneData.InputFixedCouponFrequency[0];
      this.floatingRef = cloneData.InputFloatingIndex[0];
      this.cpnBasis = cloneData.InputCouponDayBasis[0];
      this.Spread = cloneData.InputCouponOrSpreadPercent[0];
      if (cloneData.SubTemplate[0] === 'CreditTranche' || cloneData.SubTemplate[0] === 'Credit Tranche') {
        this.toggleFlag = 'Firm';
      } else {
        this.toggleFlag = 'Ind';
      }
      this.fundType = cloneData.StaticFundingType[0];
      this.fundFreq = cloneData.StaticFundingFrequency[0];
      this.fundRate = cloneData.InputFundingRateSpread[0];

      this.orderID = cloneData.BBVAID[0];
      this.orderStatus = cloneData.Status[0];

      this.recoveryType = cloneData.InputRecoveryType[0];
      //this.settlementType = cloneData.SettlementType;
      this.fundIndex = cloneData.InputFundingIndex[0];

      this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor[0];
      this.setIssueDate(this.paymentshift);


      this.Tenor = cloneData.ComputedTenorValue[0];
      // 
      this.tenorbasedonIndex();
      //this.maturityDate = this.datepipe.transform(cloneData.InputMaturityDate[0], 'yyyy-MM-dd');

      if (viewOnly) {

        this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
        this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
          if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche') > -1) {
            this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].CPM_Format).toString().split(',');
            this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].ActiveYN;
            //  

          }
        }
        this.issueDate = this.datepipe.transform(cloneData.InputIssueDate[0].split('T')[0], 'yyyy-MM-dd');
        this.rfqID = cloneData.RFQID[0];
        // Suvarna P || BBVAEPCLI-507 || 20Jun23 || Credit Tranche: Termsheet for Single Pricer
        this.NoteMasterID = cloneData.Note_Master_Id[0];
        this.sortedAllPrices = [{
          // Price: (cloneData.SolveForValue[0] === '' && this.orderID !== '')
          //   ? 'Rejected' : cloneData.SolveForValue[0], solveFor: cloneData.InputRFQSolveFor[0]
          // Price: (cloneData.SolveForValue === undefined || cloneData.SolveForValue[0] === undefined || cloneData.SolveForValue[0] === '')
          //   ? 'Rejected' : cloneData.SolveForValue[0],
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
            this.reofferPrice = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
            this.replySolveFor = 'Reoffer';
            break;
          case 'AttachDetach':
            this.AttachVal = cloneData.SolveForValue[0]; // this.sortedAllPrices[0].Price;
            this.Attach = cloneData.SolveForValue2[0];
            this.DetachVal = cloneData.SolveForValue3[0];
            this.Detach = cloneData.SolveForValue4[0];
            // this.reofferPrice = cloneData.SolveForValue2[0]; // this.sortedAllPrices[0].Price;
            this.replySolveFor = 'Attach';
            this.replySolveFor1 = 'Detach';
            break;
        }
      }

    } catch (error) {

    }
  }


  tenorbasedonIndex() {
    this.maturityDate = '';
    if (this.indexTranche !== '') {
      const tenor = this.indexTrancheArr[this.indexTrancheArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].CITenors;
      const noteDatesArr = this.indexTrancheArr[this.indexTrancheArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].NoteMaturity;
      const swapDatesArr = this.indexTrancheArr[this.indexTrancheArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].SwapMaturity;
      const swapmaxDatesArr = this.indexTrancheArr[this.indexTrancheArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].SwapMaxMaturity;

      if (tenor !== '') {
        this.tenorArr = tenor.toString().substr(0, tenor.length - 1).split(',');

        if (this.tenorArr !== undefined && this.tenorArr.length > 0) {

          if (this.tenorArr.findIndex((obj: any) => obj === this.Tenor) < 0) {
            this.Tenor = this.tenorArr[0];


          }
          if (this.format === 'Note') {
            this.noteDatesArr = noteDatesArr.toString().split(',');
            if (noteDatesArr !== undefined && noteDatesArr.length > 0) {
              const index = this.tenorArr.findIndex((obj: any) => obj === this.Tenor);
              this.maturityDate = this.commonfunctions.formatDate(this.noteDatesArr[index]);

            }
          }

          if (this.format === 'Swap') {

            this.swapDatesArr = swapDatesArr.toString().split(',');
            const swapSplitMaxArr = swapmaxDatesArr.toString().split(",");
            if (swapDatesArr !== undefined && swapDatesArr.length > 0) {
              const index = this.tenorArr.findIndex((obj: any) => obj === this.Tenor);
              this.maturityDate = this.commonfunctions.formatDate(this.swapDatesArr[index]);
            }

            if (swapSplitMaxArr !== undefined && swapSplitMaxArr.length > 0) {
              const index = this.tenorArr.findIndex((obj: any) => obj === this.Tenor);
              this.swapMaxDate = this.commonfunctions.formatDate(swapSplitMaxArr[index]);
            }
          }

        }

      } else {
        this.tenorArr = [];
        this.Tenor = '';
      }
    }
  }


  setSaveQuoteData(cloneData: any, viewOnly: any) {
    try {
      this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
      this.indexTranche = cloneData.IndexCode;
      this.onBehalfOf = cloneData.onBehalfOf;
      this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
      if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche') > -1) {
          this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].CPM_Format).toString().split(',');
          this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].ActiveYN;
          //  
        }
      }
      this.ddlNoteCcy = cloneData.Ccy;
      this.format = cloneData.FormatDetails;
      //Added by Anubhav Goyal | 29-Mar-2023 | CLI - 1013 Credit Tranche: On viewing and cloning from saved request, Funding Index seen blank
      this.formatChange()
      // code changes done by Pranav D 29-Mar-2022 to enable CHF and GBP currency as asked by BBVA on clone action BBVACLI-136
      // if (cloneData.FormatDetails === 'Swap' && (cloneData.Ccy === 'CHF' || cloneData.Ccy === 'GBP')) {
      //   this.ddlNoteCcy = 'EUR';
      // }
      this.Notional = this.commonfunctions.formatNotional(cloneData.Size);
      this.Tenor = cloneData.TenorPer;
      this.SolveForvalue = cloneData.SolveFor;
      this.issuePrice = cloneData.IssuePrice;
      this.reofferPrice = cloneData.ReofferPrice;
      // tslint:disable-next-line: radix
      this.AttachVal = parseInt(cloneData.AttachValue);
      this.Attach = cloneData.AttachPer;
      // tslint:disable-next-line: radix
      this.DetachVal = parseInt(cloneData.DetachValue);
      this.Detach = cloneData.DetachPer;
      this.cpnType = cloneData.CouponType;
      // 17-Feb-2022 changes doen to show funding index and floating ref after clone from saved quotes
      if (this.cpnType === 'Floating') {
        this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          //this.fundIndex = this.floatingRefArr[0].Code; no need
          // if (this.cpnType !== 'Fixed') {
          this.floatingRef = this.floatingRefArr[0].Code;
          // } else {
          //   this.floatingRef = '';
          // }


        }
      }

      this.cpnFreq = cloneData.Frequency;
      this.floatingRef = cloneData.FloatingRef;
      this.cpnBasis = cloneData.CouponBasis;
      this.Spread = cloneData.CouponSpread;
      if (cloneData.SubTemplate === 'CreditTranche' || cloneData.SubTemplate === 'Credit Tranche') {
        this.toggleFlag = 'Firm';
      } else {
        this.toggleFlag = 'Ind';
      }
      //START :Added by Anubhav Goyal | 04-May-2023 | BBVACLI-1085 Credit Tranche: On view/clone from saved request blotter and widget, first coupon is set to 'Short'
      if (cloneData.FirstLongCoupon == 'Long') {
        this.creditToggleYN = 'Y';
      }
      else if (cloneData.FirstLongCoupon == 'Short') {
        this.creditToggleYN = 'N';
      }
      else {
        this.creditToggleYN = 'N';
      }
      //END :Added by Anubhav Goyal | 04-May-2023 | BBVACLI-1085 Credit Tranche: On view/clone from saved request blotter and widget, first coupon is set to 'Short'
      this.fundType = cloneData.FundingType;
      this.fundFreq = cloneData.FundingFrequency;
      this.fundRate = cloneData.IndexRateSpread;

      this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor;
      this.setIssueDate(this.paymentshift);
      this.tenorbasedonIndex();

      this.Tenor = cloneData.TenorPer;

      //Added by ApurvaK|| 18-Dec-2023|| FIN1EURINT-688
      if(cloneData.ComputedStrikeFixingLag == 'Forward'){
        this.stkdate = cloneData.StrikeShifterDate;
      }
      else{
        this.stkdate = '';
      }

      this.recoveryType = cloneData.RecoveryType;
      this.settlementType = cloneData.SettlementType;
      this.fundIndex = cloneData.FundIndex;
      // this.maturityDate = this.datepipe.transform(cloneData.MaturityDate, 'yyyy-MM-dd');

      if (viewOnly) {
        this.issueDate = this.datepipe.transform(cloneData.IssueDate, 'yyyy-MM-dd');
      } else {
        switch (this.SolveForvalue) {
          case 'Coupon':
            this.Spread = '';
            break;
          case 'Reoffer':
            this.reofferPrice = '';
            break;
          case 'AttachDetach':
            this.AttachVal = ''; // this.sortedAllPrices[0].Price;
            this.Attach = '';
            this.DetachVal = '';
            this.Detach = '';
            // this.reofferPrice = cloneData.SolveForValue2[0]; // this.sortedAllPrices[0].Price;
            break;
        }
      }
    } catch (error) {

    }
  }

  chngIndexCode() {
    try {
      this.Attach = '';
      this.AttachVal = '';
      this.Detach = '';
      this.DetachVal = '';


      if (this.indexTranche === '') {
        return false;
      }
      $('#loading').show();
      setTimeout(() => {
        // if (this.indexTranche !== '') {
        // tslint:disable-next-line: max-line-length
        //   var AttachResult = this.apifunctions.getAttachPercent('-999', this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)]['Code'], '');
        // }
        // if (this.indexTranche !== '') {
        // tslint:disable-next-line: max-line-length
        //   var DetachResult = this.apifunctions.getDetachPercent('-999', this.indexTrancheArr[this.indexTrancheArr.findIndex(record => record.LongName.split('-')[1] === this.indexTranche)]['Code'], '');
        // }
        let indexCodeFlag = false;
        // START : BBVAEPCLI-81 Pranav D 23-Sep-2022
        this.creditTrancheIndexCode.forEach((res: any) => {
          // if (this.indexTranche === res.Data_Value) {
          //   this.selectedIndexCode = res.misc1;
          //   indexCodeFlag = true;
          // }
          if (this.indexTranche.includes(res.Data_Value)) {
            this.selectedIndexCode = res.misc1;
            indexCodeFlag = true;

          }
        });

        if (!indexCodeFlag) {
          this.selectedIndexCode = '';
        }

        // END : BBVAEPCLI-81 Pranav D 23-Sep-2022
        this.calculateAttachPercent();
        this.calculateDetachPercent();
      });

      return;

    } catch (error) {

      return false
    }
  }
  // BBVAEPCLI-399 Pranav D 20-Mar-2023 instead of fetching index code changes as per new common data
  async calculateAttachPercent() {
    try {
      //debugger
      console.log(this.indexTranche,"this.indextranche")
      let AttachResult: any;
      if ((this.AttachVal === '' || this.AttachVal === 'NaN' || this.AttachVal === undefined) && this.SolveForvalue !== 'AttachDetach') {
        this.AttachVal = '';
        if (this.indexTranche !== '') {
          AttachResult = await this.apifunctions.getAttachPercent('-999',
            this.indexTrancheArr[this.indexTrancheArr.findIndex((record: any) => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
            console.log(AttachResult,"response from API")
        } else {
          this.AttachVal = '';
          this.ErrorMsg = 'Please select index.';
          return false;
        }
      }

      if (this.AttachVal !== '' && this.SolveForvalue !== 'AttachDetach') {
        if (this.indexTranche !== '') {
          // this.apifunctions.getAttachPercentSF.next('');
          AttachResult = this.apifunctions.getAttachPercent(this.AttachVal,
            this.indexTrancheArr[this.indexTrancheArr.findIndex((record: any) => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.AttachVal = '';
          this.ErrorMsg = 'Please select index.';
          return false;
        }
      }

      if (AttachResult) {
        if (AttachResult.errorMessage !== undefined) {
          if (AttachResult.errorMessage === '') {
            if (parseFloat(this.DetachVal) - parseFloat(AttachResult.Attach + '') < parseFloat(AttachResult.Width + '')) {
              this.ErrorMsg = 'Difference between Attach and Detach should be at least ' + parseFloat(AttachResult.Width + '');
              // BBVAEPCLI-613 Pranav D 28-Jun-2023 flag value assigned if ttach detach difference validation is fired
              this.attachDetachDiffValidation = true;
              if (document.getElementById('txtAttachVal')) {
                document.getElementById('txtAttachVal')!.classList.add('error');
              }
              return false;
            } else {
              this.ErrorMsg = '';
              if (document.getElementById('txtAttachVal')!.classList.contains('error')) {
                document.getElementById('txtAttachVal')!.classList.remove('error');
              }
              if (document.getElementById('txtDetachVal')!.classList.contains('error')) {
                this.calculateDetachPercent();
                // document.getElementById("DetachVal").classList.remove("error");

              }
              // BBVAEPCLI-613 Pranav D 28-Jun-2023 flag value assigned if ttach detach difference validation is not fired
              this.attachDetachDiffValidation = false;
            }
            this.Attach = parseFloat(AttachResult.PercentageValue + '').toFixed(4);
            this.AttachVal = AttachResult.Attach;
            this.getAttachDetachData();
            // if (document.getElementById("AttachVal").classList.contains("error")) {
            //   document.getElementById("AttachVal").classList.remove("error");
            // }
            // if (document.getElementById("DetachVal").classList.contains("error")) {
            //   this.calculateDetachPercent();
            // }
          } else {
            this.ErrorMsg = AttachResult.errorMessage;
            if (document.getElementById('txtAttachVal')) {
              document.getElementById('txtAttachVal')!!.classList.add('error');
            }
            this.Attach = '';
          }
        }
      }
      if (this.recoveryType === 'Market Recovery') {
        this.Attach = '';
        this.AttachVal = '';
      }

      return false;
    } catch (error) {

      return false;
    }
  }

  calculateDetachPercent() {
    try {
      let DetachResult: any;
      this.ErrorMsg = '';
      if (document.getElementById('txtDetachVal')!.classList.contains('error')) {
        document.getElementById('txtDetachVal')!.classList.remove('error');
      }
      if ((this.DetachVal === '' || this.DetachVal === 'NaN' || this.DetachVal === undefined) && this.SolveForvalue !== 'AttachDetach') {
        this.DetachVal = '';
        if (this.indexTranche !== '') {
          DetachResult = this.apifunctions.getDetachPercent('-999',
            this.indexTrancheArr[this.indexTrancheArr.findIndex((record: any) => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
        } else {
          this.DetachVal = '';
          this.ErrorMsg = 'Please select index.';
          return false;
        }
      }
      if (this.DetachVal !== '' && this.SolveForvalue !== 'AttachDetach') {
        if (this.indexTranche !== '') {
          // this.apifunctions.getDetachchPercentSF.next('');
          DetachResult = this.apifunctions.getDetachPercent(this.DetachVal,
            this.indexTrancheArr[this.indexTrancheArr.findIndex((record: any) => record.LongName.split('-')[1] === this.indexTranche)].Code, '');
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
              // BBVAEPCLI-613 Pranav D 28-Jun-2023 flag value assigned if ttach detach difference validation is fired
              this.attachDetachDiffValidation = true;
              if (document.getElementById('txtDetachVal')) {
                document.getElementById('txtDetachVal')!.classList.add('error');
              }
              // return false;
            } else {
              this.ErrorMsg = '';
              if (document.getElementById('txtDetachVal')!.classList.contains('error')) {
                document.getElementById('txtDetachVal')!.classList.remove('error');
              }
              if (document.getElementById('txtAttachVal')!.classList.contains('error')) {
                // document.getElementById("AttachVal").classList.remove("error");
                this.calculateAttachPercent();
              }
              // BBVAEPCLI-613 Pranav D 28-Jun-2023 flag value assigned if ttach detach difference validation is not fired
              this.attachDetachDiffValidation = false;
            }

            this.Detach = parseFloat(DetachResult.PercentageValue + '').toFixed(4);
            this.DetachVal = DetachResult.Detach;
            this.getAttachDetachData();
            // if (document.getElementById("DetachVal").classList.contains("error")) {
            //   document.getElementById("DetachVal").classList.remove("error");
            // }
            // if (document.getElementById("AttachVal").classList.contains("error")) {
            //   this.calculateAttachPercent();
            // }

          } else {
            this.ErrorMsg = DetachResult.errorMessage;
            if (document.getElementById('txtDetachVal')) {
              document.getElementById('txtDetachVal')!.classList.add('error');
            }
            this.Detach = '';
          }
        }
      }

      if (this.recoveryType === 'Market Recovery') {
        this.Detach = '';
        this.DetachVal = '';
      }
      return false;
    } catch (error) {

      return false;
    }
  }

  onBehalfOfChange() {
    this.mappedformatlist = [];
    this.priceBtnActive = 'N';
    this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
    if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
      if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche') > -1) {
        this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].CPM_Format).toString().split(',');
        this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Credit Tranche')].ActiveYN;
        //  
        if (this.mappedformatlist !== undefined && this.mappedformatlist.length > 0) {
          if (this.mappedformatlist.findIndex((obj: any) => obj === 'Note') > -1) {
            this.format = 'Note';
          } else {
            this.format = this.mappedformatlist[0];
          }
          // START : if else added by Pranav D 26-Sep-2023 BBVAEPCLI-610 if format is same when on behalf of changed then floating index should remain same
          //          also format change function call position changed
          if (this.selectedFormat === this.format) {
            // Do nothing
          } else {
          this.formatChange();
          }
          // END : if else added by Pranav D 26-Sep-2023 BBVAEPCLI-610 if format is same when on behalf of changed then floating index should remain same
          //          also format change function call position changed
        }
      }
    }
  }

  currencyChange() {
    try {
      this.reset();
      //  
      this.floatingRefArr = [];
      this.fundIndex = '';
      this.floatingRef = '';
      if (this.ddlNoteCcy === 'MXN') {
        this.Notional = '10,000,000';
      }
      this.checkNotionalRes = this.apifunctions.BBVACheckNotional('CreditTranche', this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes.length != 0 && this.checkNotionalRes.length > 0) {
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
      // tslint:disable-next-line: prefer-for-of
      // for (let i = 0; i < this.floatingRefArr.length; i++) {
      //   if (this.cpnType === 'Floating' && (this.floatingRefArr[i].LongName.split('-')[1]
      //     .split(' ')[0]).toUpperCase().includes(this.ddlNoteCcy.toUpperCase())) {
      //     if (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[1] === '3M'
      //       || this.floatingRefArr[i].LongName.split('-')[1].split(' ')[2] === '3M') {
      //       this.floatingRef = this.floatingRefArr[i].LongName.split('-')[1];
      //     }
      //   }
      // }

      this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
      if (this.floatingRefArr && this.floatingRefArr.length > 0) {
        if (this.format === 'Swap' && this.fundType !== 'Fixed Rate') {
          this.fundIndex = this.floatingRefArr[0].Code;
        } else {
          this.fundIndex = '';
        }
        // this.cpnType !== 'Fixed' changed to this.cpnType === 'Floating' by Pranav D as Floating index was
        // getting passed for Coupon type no coupon option 18-Aug-2022  BBVAEPCLI-56
        if (this.cpnType === 'Floating') {
          this.floatingRef = this.floatingRefArr[0].Code;
           
          // if (this.cpnType === 'UpFront') {
          //   this.floatingRef = '';
          // } else {
          //   this.floatingRef = this.floatingRefArr[0].Code;
          // }

        } else {
          this.floatingRef = '';
          //this.floatingRefArr = [];
        }

      }
      // this.changeFreq();
      this.setFundFreq(this.fundIndex)
      //Function call added by Taran || 13 Sept 2023 || BBVAEPCLI-610 || Freq not changing on currency change
      this.changeFreq();
    } catch (error) {

    }
    return false;

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


  setSolveFor(e: any) {
    try {
      this.reset();
      const target = this.commonfunctions.GetEventTarget(e);
      this.SolveForvalue = target.value;
      if (this.SolveForvalue === 'Coupon' && this.cpnType === 'UpFront') {
        this.cpnType = 'Fixed';
      }
      if (this.SolveForvalue === 'Coupon') {
        this.Spread = '';
        if (this.format === 'Note') {
          this.reofferPrice = '98.50';
        } else {
          this.reofferPrice = '0.00';
        }
      }
      if (this.SolveForvalue === 'Reoffer') {
        this.reofferPrice = '';
        this.Spread = '10.00';
      }
      if (this.SolveForvalue === 'AttachDetach') {
        if (this.format === 'Note') {
          this.reofferPrice = '98.50';
        } else {
          this.reofferPrice = '0.00';
        }
        this.Attach = '';
        this.Detach = '';
        this.AttachVal = '';
        this.DetachVal = '';
        this.Spread = '10.00';
      }
    } catch (error) {

    }
  }

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
        this.checkNotionalRes = this.apifunctions.BBVACheckNotional('CreditTranche', this.ddlNoteCcy);
        if (this.checkNotionalRes) {
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


  recoveryTypeChng() {
    try {
      this.Attach = '';
      this.AttachVal = '';
      this.Detach = '';
      this.DetachVal = '';

      $('#loading').show();
      setTimeout(() => {

        this.calculateAttachPercent();
        this.calculateDetachPercent();
      });
    } catch (error) {

    }
  }

  txtTenorChange(e: any, type: any) {
    try {
      this.reset();
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

      if (type === 'Payment') {
        this.paymentshift = target.value;
        this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), '');
        strDate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
        // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        this.issueDate = strDate;
      }
    } catch (error) {

    }
  }

  CheckMaturityDate() {

    if (this.format === 'Swap') { // condition added by Pranav D to prohibit pricing if format is not checked before price button click

      if (Date.parse(this.maturityDate) > Date.parse(this.swapMaxDate)) {
        this.ErrorMsg = "Maturity Date can't be longer than " + this.datepipe.transform(this.swapMaxDate, 'dd-MMM-yyyy');
        document.getElementById('maturityDate')!.classList.add('error');
      } else {
        this.ErrorMsg = "";
        document.getElementById('maturityDate')!.classList.remove('error');
      }
    }

  }

  onClickedOutside(type: any) {
    if (type === 'fundRate') {
      this.fundRatePopup = false;
    }
  }

  GetTriggerValue(type: any) {

    if (type === 'fundRate') {
      this.TriggerValueArr = this.apifunctions.GetTriggerValues(this.Tenor, this.fundFreq,
        this.fundRate, '', '', '', '', '', '');

      this.fundRatePopup = true;
    }
  }

  cpnTypeChange() {
    try {
      this.reset();
      if (this.cpnType === 'Fixed') {
        this.floatingRef = '';
        this.cpnFreq = '1m';
        this.cpnBasis = '30/360';

        // } else if (this.cpnType === 'Floating' || this.fundType === 'Floating Rate') {
      } else if (this.cpnType === 'Floating') {
        // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < this.floatingRefArr.length; i++) {
        //   // tslint:disable-next-line: max-line-length
        //   if (this.cpnType === 'Floating' && (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[0]).toUpperCase().includes(this.ddlNoteCcy.toUpperCase())) {
        //     if (this.floatingRefArr[i].LongName.split('-')[1].split(' ')[1] === '3M'
        //       || this.floatingRefArr[i].LongName.split('-')[1].split(' ')[2] === '3M') {
        //       this.floatingRef = this.floatingRefArr[i].LongName.split('-')[1];
        //     }
        //   }
        // }
       
      // Suvarna P || 22Sep23 || BBVAEPCLI-610 || IR Index on ePricer for Credit Products || issue- cpnFreq always 1m in pricing xml; seq changes
       
        this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);
        if (this.floatingRefArr && this.floatingRefArr.length > 0) {
          //this.fundIndex = this.floatingRefArr[0].Code; no need
          // if (this.cpnType !== 'Fixed') {
          this.floatingRef = this.floatingRefArr[0].Code;
          // } else {
          //   this.floatingRef = '';
          // }


        }
        
        if (this.floatingRef === 'SONIA' || this.floatingRef === 'SOFR' || this.floatingRef === 'SARON') {
          this.cpnFreq = '3m';
        } else {
          this.cpnFreq = '1m';
        }
        
        this.cpnBasis = '30/360';

      } else if (this.cpnType === 'UpFront') {
        this.cpnFreq = '';
        this.floatingRef = '';
        this.Spread = '';
        this.cpnBasis = '';
      }

      if (this.cpnType !== 'UpFront') {
        this.changeFreq();
      }

      if (this.SolveForvalue === 'Reoffer' && this.Spread === '' && this.cpnType !== 'UpFront') {
        this.Spread = '10.00';
      }

    } catch (error) {

    }
  }

  Price() {
    try {
      //Function calling sequence change | Anubhav Goyal | 21-Aug-2023 | BBVAEPCLI-621 
      this.validationCheckBeforePrice();
      this.validationOnButton(); 
      this.checkAttachDetachPercent();
      if (this.ErrorMsg === '') {
        // START : if else added by Pranav D 28-Jun-2023 BBVAEPCLI-613 if attach detach value difference validation is fired then pricing should be prohibited
        if (this.attachDetachDiffValidation) {
          this.reset();
        } else {
          this.reset();
          let RFQTimeFlag = true;
          //RFQTimeFlag = this.apifunctions.BBVAValidateRFQTime(this.indexTranche);
          if (RFQTimeFlag) {
            this.loadflag = true;
            this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
            if (isNaN(this.portfolioGroupID)) {
              this.ErrorMsg = "Price request failed. Please reload the application and try again.";
              return false;
            }
            this.CreditTranchePrice();
          } else {
            this.ErrorMsg = 'Price request not allowed after close time.';
          }
        }
        // END : if else added by Pranav D 28-Jun-2023 BBVAEPCLI-613 if attach detach value difference validation is fired then pricing should be prohibited
      }
      return false;
    } catch (error) {

      return false;
    }
  }

  validationOnButton() {
    try {

      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        return false;
      } else {
        this.ErrorMsg = '';
      }

      if (this.onBehalfOf === '') {
        this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
        return false;
      } else {
        this.ErrorMsg = '';

      }

      if (this.indexTranche === '') {
        this.ErrorMsg = 'Please select index.';
        return false;
      } else {
        this.ErrorMsg = '';

      }


      if (this.Tenor === '') {

        this.ErrorMsg = 'Please select tenor.';
        return false;
      } else {
        this.ErrorMsg = '';

      }

      if (this.format === '') {
        this.ErrorMsg = 'Please select format.';
        return false;
      } else {
        this.ErrorMsg = '';

      }

      if (this.SolveForvalue !== 'Reoffer' && this.format === 'Note') {
        this.ErrorMsg = this.apifunctions.reofferValidation(this.issuePrice, this.reofferPrice, 'EQ', 'Note');
        if (this.ErrorMsg !== '') {
          document.getElementById('txtReoffer')!.classList.add('error');
        } else {
          document.getElementById('txtReoffer')!.classList.remove('error');
        }

        // return false;
      }

      if (this.recoveryType !== 'Market Recovery') {
        this.calculateAttachPercent();
        if (this.ErrorMsg !== '') { return false; }
        this.calculateDetachPercent();
        if (this.AttachVal === '' && this.SolveForvalue !== 'AttachDetach' && this.recoveryType !== 'Market Recovery') {
          this.ErrorMsg = 'Please enter attach value.';
          document.getElementById('txtAttachVal')!.classList.add('error');
          // return false;
        }

        if (this.DetachVal === '' && this.SolveForvalue !== 'AttachDetach' && this.recoveryType !== 'Market Recovery') {
          this.ErrorMsg = 'Please enter detach value.';
          document.getElementById('txtDetachVal')!.classList.add('error');
          // return false;
        }
      }
      else {
        if (this.Attach === '' && this.recoveryType === 'Market Recovery') {
          this.ErrorMsg = 'Please enter attach percentage.';
          document.getElementById('txtAttach')!.classList.add('error');
        }
        if (this.Detach === '' && this.recoveryType === 'Market Recovery') {
          this.ErrorMsg = 'Please enter detach percentage.';
          document.getElementById('txtDetach')!.classList.add('error');
        }
      }
      //Added by Anubhav Goyal | 21-Aug-2023 | BBVAEPCLI-621 
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
      this.CheckMaturityDate();


      return true;
    } catch (error) {

      return false;
    }
  }

  CreditTranchePrice() {
    try {
      $(document).bind("ajaxStart", () => {
        $("#loading").hide();
      });
      const xmlstr = this.generateXML();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'PHXAutocallable';
      const that = this;
      const parameters = {
        Product: 'CreditTranche',
        subTemplateCode: this.toggleFlag === 'Firm' ? 'CreditTranche' : 'CreditTrancheInd',
        LP: 'BBVA',
        xmlstr,
        SolveFor: this.SolveForvalue,
        UserID: (this.commonfunctions.getLoggedInUserName()),
        userGroupID: this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,//this.onBehalfOf,
        buyerEntityID: (this.commonfunctions.getEntityOfUser()),
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

        success(data: any) {
          if (data.errorMessage !== '') {
            that.ErrorMsg = data.errorMessage.split('. ')[0];
            that.loadflag = false;
            return;
          }
          that.rfqID = data.rfqid;
          if (!that.clearFlag) {
            that.Prices = [];
            that.timeLeft = that.defaultTimeout;
            that.PPDetails = that.rfqID;
            if (that.PPDetails !== '') {
              that.interval = setInterval(() => {
                if (that.timeLeft > 0) {
                  $("#loading").hide();
                  that.CreditTranchePriceResponse(that.PPDetails);
                  that.timeLeft = that.timeLeft - 5;
                } else if ((that.timeLeft === 0)) {
                  that.loadflag = false;
                  that.timeoutMsg = 'Timeout';
                  clearInterval(that.interval);
                  // tslint:disable-next-line: max-line-length
                  that.ErrorMsg = 'Price response is taking longer than expected hence price will not display on this screen. \nInstead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section and by email.';

                }
              }, 5000);
            }
          }
        },
        error(error: any) {
          console.error(error);
        }
      });
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

        success(data: any) {
          that.Prices = data;
          that.commonfunctions.setCreditReceivedPrices(that.Prices, 1);
        },
        error(error: any) {
          console.error(error);
        }
      });
    } catch (error) {

    }
  }

  generateXML() {
    const object = {};
    let xmlstr = '<QuoteRequest>';
    // tslint:disable-next-line: forin
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
          + (this.floatingRef === '' ? '' : this.floatingRef)
          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'reofferPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.reofferPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IndexTranche': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.indexTranche + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'cpnFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Spread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.Spread + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.Tenor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'cpnBasis': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnBasis + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
          + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'IssueDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.issueDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
          + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + (this.commonfunctions.getLoggedInUserName()) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'recoveryType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.recoveryType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'settlementType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.settlementType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'fundIndex': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.fundIndex + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'maturityDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.maturityDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
        case 'FirstLongCpn': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          + this.cpnFirst + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          break;
          // case 'IndicativeOrFirm': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          // // BBVAEPCLI-414 tag manipulation as per normal price or add to watchlist Pranav D if add to watchlist hard coded Ind as asked by BBVA
          // + (!this.isAddToWatchlist ? ((this.IndicativeOrFirm) ? this.IndicativeOrFirm : '') : 'Ind') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          // break;

      }

    }

    xmlstr += '</QuoteRequest>';
    return xmlstr;
  }

  validationCheckBeforePrice() {
    try {
      const maturityDateArr:any = this.apifunctions.BBVALoadSharesCR('CR');

      const noteDatesArrfinal = maturityDateArr[maturityDateArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].NoteMaturity;
      const swapDatesArrfinal = maturityDateArr[maturityDateArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].SwapMaturity;
      const swapmaxDatesArrfinal = maturityDateArr[maturityDateArr.findIndex((obj: any) => obj.LongName.split('-')[1].trim() === this.indexTranche)].SwapMaxMaturity;


      const index = this.tenorArr.findIndex((obj: any) => obj === this.Tenor);
      const matdate = this.commonfunctions.formatDate(noteDatesArrfinal.split(',')[index]);
      const swapmatdate = this.commonfunctions.formatDate(swapDatesArrfinal.split(',')[index]);
      const swapmaxmatdate = this.commonfunctions.formatDate(swapmaxDatesArrfinal.split(',')[index]);

      //  
      //  
      //  

      if (this.format === 'Note') {
        //  
        //this.tenorbasedonIndex();

        if (Date.parse(this.maturityDate) !== Date.parse(matdate)) {
          this.ErrorMsg = 'Maturity date mismatch for selected tenor. Please reselect tenor.';
        } else {
          this.ErrorMsg = '';
        }
      } else if (this.format === 'Swap') {



        // if ((Date.parse(this.maturityDate) !== Date.parse(swapmatdate) && Date.parse(this.maturityDate) > Date.parse(swapmaxmatdate))
        //  || Date.parse(this.maturityDate) < Date.parse(swapmatdate)) {
        //   this.ErrorMsg = 'Maturity date or swap max maturity date mismatch for selected tenor.';
        // }

        if ((Date.parse(this.maturityDate) !== Date.parse(swapmatdate) && Date.parse(this.maturityDate) > Date.parse(swapmaxmatdate))
          || Date.parse(this.maturityDate) < Date.parse(swapmatdate)) {
          this.ErrorMsg = 'Selected maturity date is not in the range of Swap max maturity date and maturity date allowed. Please reselect tenor.';
        }

        if (Date.parse(this.maturityDate) < Date.parse(swapmatdate)) {
          this.ErrorMsg = 'Selected maturity date is less than maturity date allowed. Please reselect tenor.';
        }
      } else {

      }
    } catch (error) {

    }
  }

  checkAttachDetachPercent() {
    try {
      console.log(this.Attach, this.Detach,"Attach detach values")
      if (this.Attach === '' || this.Detach === '') {
        this.ErrorMsg = 'Attach or Detach percentage is blank';
      }
    } catch (error) {

    }
  }

  SchedulePricePopup() {
    this.ShowSchedulePricePopup = !this.ShowSchedulePricePopup;

  }

  priceOptions() {
    try {
      this.priceoptionflag = true;
    } catch (error) {

    }
    return false;
  }

  showSchedulePopup() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
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
    return false;
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

  // Save() {
  //   try {
    //this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
  //     this.validationOnButton();
  //     if (this.ErrorMsg === '') {
  //       this.reset();
  //       this.sortedAllPrices = [];
  //       this.AllPrices = [];
  //       const strXml = '<Details>' + this.generateSaveXML() + '</Details>';
  //       const res = this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, '', '', 'CreditTranche', (this.commonfunctions.getLoggedInUserName()));
  //       // Removed condition' && this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
  //       if (res) {
  //         if (res.errorMessage === '') {
  //           this.saveFlag = true;
  // this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
  //           this.saveportfolioId = res.PortFolioID;
  //           this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
  //         }
  //       }
  //     }
  //   } catch (error) {

  //   }
  //   return false;
  // }

  generateSaveXML() {
    try {
      this.tempXML = '';
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
        '<ShareBBGRIC6></ShareBBGRIC6>' +

        '<ShareLongName1></ShareLongName1>' +
        '<ShareLongName2></ShareLongName2>' +
        '<ShareLongName3></ShareLongName3>' +
        '<ShareLongName4></ShareLongName4>' +
        '<ShareLongName5></ShareLongName5>' +
        '<ShareLongName6></ShareLongName6>' +

        '<CouponBarrier></CouponBarrier>' +
        '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
        '<Strike></Strike>' +
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

        '<Underlying1></Underlying1>' +
        '<Underlying2></Underlying2>' +
        '<Underlying3></Underlying3>' +
        '<Underlying4></Underlying4>' +
        '<Underlying5></Underlying5>' +
        '<Underlying6></Underlying6>' +

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
        '<AttachValue>' + this.AttachVal + '</AttachValue>' +
        '<DetachValue>' + this.DetachVal + '</DetachValue>' +
        '<FloatingRef>' + this.floatingRef + '</FloatingRef>' +
        '<FloatingFreq></FloatingFreq>' +
        '<CouponBasis>' + this.cpnBasis + '</CouponBasis>' +
        '<ReofferPrice>' + this.reofferPrice + '</ReofferPrice>' +
        '<Mode></Mode>' +
        '<FormatDetails>' + this.format + '</FormatDetails>' +
        '<CouponObs></CouponObs>' +
        '<NonCallPeriod></NonCallPeriod>' +
        '<ExpiryDate></ExpiryDate>' +
        '<IssueDate>' + this.datepipe.transform(this.issueDate, 'dd-MMM-yyyy') + '</IssueDate>' +
        '<AttachPer>' + this.Attach + '</AttachPer>' +
        '<DetachPer>' + this.Detach + '</DetachPer>' +
        '<CouponSpread>' + this.Spread + '</CouponSpread>' +
        '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
        '<IndexCode>' + this.indexTranche + '</IndexCode>' +
        '<ERFrequency></ERFrequency>' +
        '<SubTemplate>' + (this.toggleFlag === 'Firm' ? 'CreditTranche' : 'CreditTrancheInd') + '</SubTemplate>' +
        '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
        '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
        '<RecoveryType>' + this.recoveryType + '</RecoveryType>' +
        '<SettlementType>' + this.settlementType + '</SettlementType>' +
        '<FundIndex>' + this.fundIndex + '</FundIndex>' +
        '<MaturityDate>' + this.maturityDate + '</MaturityDate>' +
        // Added by riddhip || 16feb23
        //Changed FirstLongCoupon to cpnFirst | Anubhav Goyal | 03-May-2023
        '<FirstLongCoupon>' + this.cpnFirst + '</FirstLongCoupon>' +
        '</Record>';

      this.commonfunctions.generateFlexiXml(this.tempXML);
      return this.tempXML;
    } catch (error) {

      return '';
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
        const xmlstr = this.generateXML();
        // BBVAEPCLI-414 Pranav D 21-Mar-2023 CreditTrancheInd hard coded as Ind or firm depends on sub template code as no parameters from API 
        // received for Indicative or Firm
        const res = this.apifunctions.SchedulePrice('CreditTranche', xmlstr,
          sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue,
          this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,
          'CreditTrancheInd', this.scheduleFreq, this.scheduleType, '');
        if (res) {
          if (res['IsScheduled']) {
            this.scheduleMsg = 'Request scheduled successfully. Req ID: ' + res['PS_ID'];
          }
        }
      }
    } catch (error) {

    }
    return false;
  }

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

  showUser(event: any, item: any) {
    try {
      this.userflag = false;
      this.selectedBIndex_User = 0;
      this.showSuggestions_User = false;
      this.userName = '';

      if (this.userBasket.find((i: any) => i.Code === item.Code) === undefined) {
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
    const res: any = this.apifunctions.InsertPortfolioSharing(this.currentowner, [],
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
    //this.Save();
     //  Added condition'this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
     if(this.userBasket.length > 0){
    if (this.saveportfolioId !== '') {
      // let groupEdit =[];
      let groupView: any = [];
      let userEdit: any = [];
      let userView: any = [];
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

      const res: any = this.apifunctions.InsertPortfolioSharing(this.currentowner, [], groupView, this.saveportfolioId, userEdit, userView, [], []);
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
    this.viewOnly = false;
    // BBVACLI-357 Pranav D to show action button in Credit Tranche
    this.buttonList = 'Clone,View,';
    this.reset();
    this.setDefaultDates();
  }

  setDefaultDates() {
    // this.setIssueDate('10B');
    this.setIssueDate(this.paymentshift);
    // maturityDate
    this.tenorbasedonIndex();
  }

  toggeleOnOff() {
    this.reset();
    this.fnGetProdTemplate();
  }


  FetchStruxlyVideo() {
    try {
      if (this.disclaimer === '') {
        this.ErrorMsg = "Please enter disclaimer";
        return false;
      }
      $('#loading').show();
      setTimeout(() => {
        this.hidedisclaimerPopup();
        let res: any = [];

        let todayDate = new Date().toLocaleDateString("en-US");
        let issueDate = "25-Dec-2021";

        res = this.apifunctions.FetchStruxlyVideo(
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",

          this.ddlNoteCcy,
          this.cpnType,
          this.Spread,
          this.disclaimer,
          this.indexTranche,
          "",
          "",
          "",
          "",
          "",
          this.Notional.replace(/,/g, ''),
          "",
          this.datepipe.transform(this.maturityDate, 'dd-MMM-yyyy'),
          "Credit Tranche",
          this.datepipe.transform(this.issueDate, 'dd-MMM-yyyy'),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.datepipe.transform(this.issueDate, 'dd-MMM-yyyy'),
          this.paymentshift,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.cpnFreq,
          "",
          this.rfqID,
          "",
          this.language,
          this.paymentshift,
          "",
          "",

          "",
          "",
          "",
          this.selectedIndexCode,
          "",
          "",
          this.Notional.replace(/,/g, ''),
          //START : BBVAEPCLI-74 Pranav D 19-Sep-2022 Attach Detach val was going wrong
          this.AttachVal,
          this.DetachVal,
          //END : BBVAEPCLI-74 Pranav D 19-Sep-2022 Attach Detach val was going wrong
          "",
          "",
          "",
          "",
          "",
          "",
          "Yes", "", "");

        if (res && res.status !== 'Error') {
          if (res.output.video.length > 0) {
            this.videoURL = "https://idoplayer.idomoo.com/19//index.html?u=" + res.output.video[0].links.url;
            this.downloadURL = res.output.video[0].links.landingPageUrl;

            this.showVideoPopupFlag = true;
          } else {
            this.ErrorMsg = "Error while processing struxly video api response.";
            return false;
          }
        } else {
          this.ErrorMsg = res.errors[0].error_message + ':' + res.errors[0].error_description;
          return false;
        }
        $('#loading').hide();
      });
    } catch (error) {

    }
    return false;
  }

  copyURL() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.downloadURL;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.CopyURLFlag = true;
    document.execCommand('copy');
    setTimeout(() => {
      this.CopyURLFlag = false;
    }, 1000);
    document.body.removeChild(selBox);
    return false;
  }

  // END : Added by Pranav D 17-Aug-2022 BBVACLI-357 CLN Videos 

  showTranchedetails() {
    this.trancheDetailsFlag = !this.trancheDetailsFlag;
  }
  onClickedOutsideTranchDetails() {
    this.trancheDetailsFlag = false;
  }


  fundTypeChange() {
    if (this.format === 'Swap' && this.fundType === 'Fixed Rate') {
      this.fundIndex = '';
    } else {
      this.floatingRefArr = this.floatingRefAll.filter((d: any) => d.Ccy === this.ddlNoteCcy);

      if (this.floatingRefArr && this.floatingRefArr.length > 0) {
        this.fundIndex = this.floatingRefArr[0].Code;

      }

      this.setFundFreq(this.fundIndex);
    }
  }

  changeToggle(cpnFirst: any) {
    try {
      if (this.creditToggleYN === 'Y') {

        this.creditToggleYN = "N";
        this.cpnFirst = 'Short';
      }
      else {
        this.creditToggleYN = 'Y'
        this.cpnFirst = 'Long';
      }

    } catch (error) {

    }
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
            const xmlstr = this.generateXML();

            // Added by riddhi p || 20feb23 || BBVACLI-917 || Credit Tranche: On viewing from Watchlist Tenor, Attach and Detach is going blank
            // BBVAEPCLI-414 Pranav D 21-Mar-2023 CreditTrancheInd hard coded as Ind or firm depends on sub template code as no parameters from API 
            // received for Indicative or Firm
            const res = this.apifunctions.AddToWatchlist('CreditTranche', xmlstr,
              sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue,
              this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,
              'CreditTrancheInd', 'DAILY', 'REGULAR', "", "Y", this.targetValue, this.direction, this.expiryDate, "N", "");
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
  // START : BBVAEPCLI-386 Pranav D 22-Feb-2023
  copyVideoURL() {
    try {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.downloadURL;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      this.CopyURLFlag = true;
      document.execCommand('copy');
      setTimeout(() => {
        this.CopyURLFlag = false;
      }, 1000);
      document.body.removeChild(selBox);
      return false;
    } catch (error) {

    }
  }
  // END : BBVAEPCLI-386 Pranav D 22-Feb-2023

  // Suvarna P || BBVAEPCLI-507 || Credit Tranche: Termsheet for Single Pricer

  async RequestTermsheet() {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.infoMsg = '';
      var Product = 'CreditTranche';
      var subTemplateCode = 'CreditTranche';

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
        this.interval.add(TSInterval);
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

  
  async filldropdownfromcommandata() {
    for (let i = 0; i < this.commonData?.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "InputRFQSolveFor":
          this.SolveForvalue =  await this.parseCommonDatatoJSONArr('InputRFQSolveFor');
          break;
          case "StaticSettlementType":
          this.settlementTypeArr = await this.parseCommonDatatoJSONArr('StaticSettlementType');
          //console.log(this.Tenor,"this.Tenor")
          break;
          case "InputRecoveryType":
            this.recoveryTypeArr = await this.parseCommonDatatoJSONArr('InputRecoveryType');
            //console.log(this.recoveryTypeArr,"this.recoveryTypeArr")
            break;
            case "ComputedTenorValue":
              this.Tenor = await this.parseCommonDatatoJSONArr('ComputedTenorValue');
              console.log(this.Tenor,"this.Tenor")
              break;
              case "InputProductFormatType":
                this.Format = await this.parseCommonDatatoJSONArr('InputProductFormatType');
                //console.log(this.Format,"Fornat arr")
              break;
              case "InputFixedCouponFrequency":
                this.CpnFreqArr = await this.parseCommonDatatoJSONArr('InputFixedCouponFrequency');
                //console.log(this.Format,"Fornat arr")
              break;
              case "SettlementType":
                this.settlementTypeArr = await this.parseCommonDatatoJSONArr('SettlementType');
                this.settlementType = this.settlementTypeArr[0];
                //console.log(this.Format,"Fornat arr")
              break;
              case "IssueDateOffset":
          this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffset');
        break;

      }
    }
    //console.log(this.Format,"Fornat arr")

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

    //console.log(commonDataJSONArr,"commonDataJSONArr")
    if (Field_Name !== 'Tenor') {
      commonDataJSONArr.sort((a, b) => (a.Key > b.Key) ? 1 : -1);
    }
    if (Field_Name === 'AutocallFrequency') {
      //console.log(commonDataJSONArr);
    }
    return commonDataJSONArr;
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
  CreditToggle(val) {
    this.creditToggleYN = val;
    if (val === 'Y') {
      this.IndicativeOrFirm = 'Firm';
    }
    else {
      this.IndicativeOrFirm = 'Ind';
    }
  }

  setFirstCpn(val) {
    try {
      this.firstCpnYN = val;
      if (val === 'Y') {
        this.cpnFirst = 'Short';
      } else {
        this.cpnFirst = 'Long';
      }
    } catch (error) {
    }
  }

}
