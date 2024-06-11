import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { Moment } from 'moment';

import { Subscription } from 'rxjs';
// import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
// import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services/config.service';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { SearchUnderlyingPipe } from '../../../pipes/search-underlying.pipe';

declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
      tenorSortBy(p: any): Array<T>;
  }
}
Array.prototype.tenorSortBy = function (p): Array<any> {
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
  selector: 'app-steepener',
  templateUrl: './steepener.component.html',
  styleUrls: ['./steepener.component.scss']
})
export class SteepenerComponent implements OnInit, OnDestroy{
    activeTab: any = 'Pricing';

  @Output()
    dateSelected: EventEmitter<Moment> = new EventEmitter();
    @Output()
    selectedDate = moment();
    @Input() sendtocptyflag: any;

    @ViewChild('calendar', { static: true })
    calendar: MatCalendar<Moment> | undefined;
    @ViewChild('focusable', { static: false })
    namefield!: ElementRef;


    // Product = 'Steepener';

    onBehalfOf: any = '';
    ddlNoteCcy: any = 'USD';
    format: any = '';
    SolveForvalue: any = "IBPrice";  //   RiddhiP || BBVAEPCLI-548 ||  Rates- Steepener Blotters UI
    // Notional: any = parseFloat('1000000').toFixed(2); // Suvarna P || 26Jun23 || not required for notional fields.
    Notional: any = '1,000,000';
    IBPrice: any = parseFloat('99').toFixed(2);
    issuePrice: any = "100.00";
    FixedCouponYN: any = "Yes";
    initialFixedCpn: any = 'Y';
    initialFixedRate: any = parseFloat('2').toFixed(2);
    endOfFixedRatePrd: any = '6M';

    fixing: any = 'In Advance'
    // default value not required here || Suvarna P || 06Jun23 
    maturity: any = ''
    frequency: any = ''
    cpnBasis: any = 'Act/Act'

    fundType: any;
    fundFreq: any;
    fundRate: any;

    Leverage: any = parseFloat('80').toFixed(2);
    leverageYN = "Y"
    //spread: any = parseFloat('0').toFixed(2);
    spread: any = '';
    cap: any = parseFloat('5').toFixed(2); //RiddhiP || 29JUNE23
    floor: any = parseFloat('0.00').toFixed(2);//RiddhiP || 29JUNE23


    // Added by RiddhiP || 2JUNE23 || Dropdown value to long/short changes asked by Nitij M 
    cpnType: any;
    firstCpnYN: any = 'N';
    cpnFirst: any = 'Short';

    timeoutMsg: string = "";
    reqSuccessMsg: string = "";
    selectedBIndex = 0;
    showSuggestions = false;
    // Currency: string = "";
    flag: boolean = false;
    shares: any;
    ShareName: string = "";
    shareCode: any;
    selectedShareIndex = 0;
    ShareBasket: any = [];
    settdate: any = '';
    stkdate: any = '';
    expdate: any = "";

    // ddlNoteCcy: any;
    UnderlyingCurrency = 'EUR';
    CCY: any = [];
    STUderlyingRefRateArr: any = [];
    copySTUnderlyingRefRateArr: any = [];// Added by Anubhav Goyal | 15-Jun-2023 | To filter Underlying Ref Rate Arr
    ReceivedCCY: any;
    // SolveForvalue: any;
    ccyChange: any;
    // IBPrice: any;
    Coupon: any;
    sortedAllPrices: any = [];
    AllPrices: any = [];
    Prices: any = [];

    product_code: any = 'RatesSteepener';
    Product: any = 'Rates - Steepener';
    MemoryPeriods: any;
    interfaceUrl = environment.interfaceURL;
    asseturl = environment.asseturl;
    SelectedUnderlyingarray: any = [];
    SelectedUnderlyingBasketArray: any = [];
    SelectedUnderlyingBasket: any = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
        UnderlyingFive: {},
    };
    Code: any;
    Exchange: any;
    CouponBarrier: any;
    loadflag = false;
    orderID: any;
    timeLeft = 60;
    interval: any;
    PPDetails: any;
    ErrorMsg: any = [];
    clearFlag: boolean = false;
    templateMappingArr: any;


    rfqID: any;
    NoteMasterID: any;
    orderStatus: any;
    saveFlag = false;
    successMsg: any;

    replySolveFor: any;
    replySolveFor1: any;
    validationArr: any;
    defaultTimeout: number = 0;
    tempXML = '';
    checkNotionalRes: any;
    viewOnly = false;
    portfolioId: any;
    scheduledReqId: any;
    allBooksData: any = [];
    buttonList: any = '';
    portfolioGroupID: any = '';
    WatchID: any;
    // Suvarna P || 28Jun23 || BBVAEPCLI-614 || TS request timeout to be increased to 2 mins || assigned by Nitij M
   // TSTimeout = 60;
    TSTimeout = 120;
    TSInterval: any;
    TSFlag = false;

    SteepenerPriceSubscription: Subscription = new Subscription;

    TriggerValueArr: any;
    fundRatePopup = false;
    priceoptionflag = false;
    saveoptionflag = false;
    showSchedulePopupFlag = false;
    showsaveSharePopupFlag = false;
    GetClientProdDetailsArr: any;
    priceBtnActive = 'Y';
    mappedformatlist: any;


    userName: string = "";
    selectedUserIndex = 0;
    showSuggestions_User = false;
    userflag: boolean = false;
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
    scheduleType = 'Regular';
    scheduleFreq = 'Monthly';
    scheduleFreqArr: any = [];
    scheduleTypeArr: any = [];
    ProductWatchlist: boolean = false;
    showAddToWatchlistPopupFlag: boolean = false;
    targetValue: any;
    direction: any;
    expiryDate: any;
    addWatchlistSolveFor: any;
    TimeValid: any = "";
    MaxSelectDate: any
    MinSelectDate: any = moment().add({ days: 0 }).format('YYYY-MM-DD');
    underlyingRef: any = 'CMS Curves'
    //START : Steepener common data Pranav D 8-Jun-2023 
    EndFixedRatePeriod: any[] = [];
    FundingTypeArr: any[] = []
    FormatArr: any[] = [];
    FixingTypeArr: any[] = [];
    CouponBasisArr: any[] = [];
    FundingFrequencyArr: any[] = [];
    FrequencyArr: any[] = [];
    MaturityArr: any[] = [];
    //END : Steepener common data Pranav D 8-Jun-2023 
    FilteredUnderlyingRefArr: any[] = [];
    underlyingRef2: any;
    copyEndFixedRatePeriod: any[] = [];
    initialFixedRateYN: any = 'Y';
    steepenerRefCombination: any[] = [];
    copyFrequencyArr:any = [];

  issueDateShifter = []
  fixingDateShifter = []
  maturityDateShifter = []
  mappedformatlistLocation = []
  feeAmtCcyArr = []
//   scheduleFreqArr = []
//   scheduleTypeArr = []
  languageArr = []
  disclaimerArr = []
  recoveryTypeArr = []
  tenorArr = []
  ParticipationBasketType = []
  settlementTypeArr = []
  creditTrancheIndexCode = []
  pageloadflag = true;
  bestLPArray: any = [];
  priceProvidersArr: any = [];
  priceProvidersArrCpy: any = [];
  docSupportStatus: any = {};
  defaultOrderTimeout: number;
  shwRepriceBookOrder = false;
  sendtoCptyBookOrder = false;
  bookOrderFlag = true;
  EQ_Show_Termsheet_Button: string = 'NO';
  EQ_Show_KID_Button: string = 'NO';
  priceClickFlag = false;
  defaultRFQTimeout: number;
  pageActive: Boolean = true;


// Steepener common data and api response added by SandipA @25-Oct-23
steepnerEndFixedRatePeriod = [];
steepnerFundingType = [];
steepnerFormat = [];
steepnerFixingType = [];
steepnerCouponBasis = [];
steepnerFundFrequency = [];
steepnerMaturityArr = [];
steepnerFrequencyArr = [];
// steepenerRefCombination = [];

    // New variables for leverage ;Rates Floor ;Initial Fixed Rate ;Rates Cap || Added by Taran || 29th June 2023
    LeverageLimit:any=[];
    RatesFloorLimit:any=[];
    RatesInitialFixedRateLimit:any=[];
    RatesCapLimit:any=[];
    copyMaturityArr: any = [];
    // END || New variables for leverage ;Rates Floor ;Initial Fixed Rate ;Rates Cap || Added by Taran || 29th June 2023
    flagFixedRate: any = true; // Added by Anubhav Goyal | 03-Jul-2023
    // issueDate: string = '10B'; // Added by Pranav D 5-Jul-2023 as asked by BBVA forever disabled filed.
    issueDate: string = '';
    issueDateArr: any = [];
    capToggleYN: any = 'N'; //Added by Anubhav Goyal | 18-Jul-2023 | BBVAEPCLI-645 Remove need for Cap in steepener | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
    SaveandShareErrorMsg:any; //BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
    monthSelected(date: Moment) {

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

    ngOnDestroy(): void {
        this.pageActive = false;
        this.timeLeft = -1;
        this.timeoutMsg = '';
        clearInterval(this.interval);
        this.TSFlag = false;
        this.AllPrices = [];
        this.sortedAllPrices = [];
        this.commonfunctions.setSteepenerReceivedPrices({}, '');
        if(this.SteepenerPriceSubscription){
            this.SteepenerPriceSubscription.unsubscribe();
        }
        
    }
  
  
  constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService, public datepipe: DatePipe, private route: ActivatedRoute,private renderer: Renderer2,public http: HttpClient) {
      try {
          this.flag = false;
          this.shares = [];
          this.ddlNoteCcy = 'EUR';
          this.UnderlyingCurrency = 'EUR';
          this.format = 'Note';
      } catch (error) {

      }
  }

  ngOnInit() : void {
    try {
        this.pageActive = true;
        this.pageloadflag = true;
        // $('#loading').show();
        setTimeout(async () => {
            // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
            //     this.allBooksData = this.apifunctions.getAllBooksMappedToLogin();
            // }
            // if (this.apifunctions.shares === undefined || this.apifunctions.shares.length <= 0) {
            //     this.shares = this.apifunctions.BBVALoadShares('EQ');
            // }
            
            if (this.apifunctions.CCY === undefined || this.apifunctions.CCY.length <= 0) {
                
                this.ReceivedCCY = await this.apifunctions.BBVALoadCCY();
            }

            // this.STUderlyingRefRateArr = await this.apifunctions.BBVALoadSharesAssets('IR', 'ST');
            // console.log("sandip-ccy",this.STUderlyingRefRateArr);

            let STUderlyingRefRateResArr = await this.apifunctions.BBVALoadSharesAssets('IR', 'ST');
            this.STUderlyingRefRateArr = this.filterRefIndexInAscendingOrder(STUderlyingRefRateResArr);

            // added by Suvarna P || 05May23 || feching Underlying Ref rate List
            // if (this.apifunctions.STUderlyingRefRateArr === undefined || this.apifunctions.STUderlyingRefRateArr.length <= 0) {
            //         this.apifunctions.BBVALoadSharesCR('ST');
            //     this.apifunctions.STUderlyingRefRateArr = this.apifunctions.BBVALoadSharesAssets('IR', 'ST');
            // }
            //this.STUderlyingRefRateArr = this.customeFilter(this.STUderlyingRefRateArr);
            // this.STUderlyingRefRateArr = this.customeFilter(this.apifunctions.STUderlyingRefRateArr);
            // Suvarna P || 06Jun23 || checked empty list before assigning

            //this.filterSTRefArr();
            if (this.STUderlyingRefRateArr.length > 0) {
                this.currencyChange();
            }


            // if (this.apifunctions.validationArr === undefined || this.apifunctions.validationArr.length <= 0) {
            //     this.validationArr = this.apifunctions.BBVAFetchValidation('EQ');
            // }
            // Common Data  for Steepner leverage conditions || Added by Taran || 29th June 2023
            // this.LeverageLimit = this.apifunctions.GetCommonData('SteepnerLeverage').Data_Value.split(', ');
             
            this.RatesFloorLimit = await this.apifunctions.GetCommonData('RatesFloor');
            this.RatesFloorLimit = this.RatesFloorLimit[0].Data_Value.split(', ');
             
            // this.RatesInitialFixedRateLimit = this.apifunctions.GetCommonData('RatesInitialFixedRate')[0].Data_Value.split(', ');
             
            this.RatesCapLimit = await this.apifunctions.GetCommonData('RatesCap');
            this.RatesCapLimit = this.RatesCapLimit[0].Data_Value.split(', ');
            // END || Common Data  for Steepner leverage conditions || Added by Taran || 29th June 2023
            // this.STUderlyingRefRateArr = await this.apifunctions.BBVALoadSharesAssets('IR', 'ST');


            if (this.scheduleFreqArr === undefined || this.scheduleFreqArr.length <= 0) {
                this.scheduleFreqArr = await this.apifunctions.GetCommonData('PricerScheduleFrequency');
                if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
                    this.scheduleFreq = this.scheduleFreqArr[0].misc1;
                }
            } else {
                this.scheduleFreqArr = this.scheduleFreqArr;
                if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
                    this.scheduleFreq = this.scheduleFreqArr[0].misc1;
                }
            }
            // START : Pranav D 20-Jun-2023 common data fetched for Steepener_RefIndex_combinations
            if (this.steepenerRefCombination === undefined || this.steepenerRefCombination.length <= 0) {
                this.STUderlyingRefRateArr = await this.apifunctions.GetCommonData('Steepener_RefIndex_combinations');
                console.log("Ref 2",this.STUderlyingRefRateArr);
                
                if (this.STUderlyingRefRateArr && this.STUderlyingRefRateArr.length > 0) {
                    this.STUderlyingRefRateArr.forEach((res: any) => {
                        if (res.Data_Value.includes(this.ddlNoteCcy.trim())) {
                            this.copySTUnderlyingRefRateArr.push(res);
                        }
                        this.underlyingRef = this.copySTUnderlyingRefRateArr[0].Data_Value;
                        // changed by Suvarna P || clone view from repre and sbed blotter issue
                        // this.filterRefArr();
                        this.populateRef2IndexArr();
                    })
                }
            } else {
                this.STUderlyingRefRateArr = this.steepenerRefCombination;
                if (this.STUderlyingRefRateArr && this.STUderlyingRefRateArr.length > 0) {
                    this.underlyingRef = this.STUderlyingRefRateArr[0].Code;
                }
            }
            // END : Pranav D 20-Jun-2023 common data fetched for Steepener_RefIndex_combinations

            if (this.scheduleTypeArr === undefined || this.scheduleTypeArr.length <= 0) {
                this.scheduleTypeArr = this.apifunctions.GetCommonData('PricerScheduleType');
                if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
                    this.scheduleType = this.scheduleTypeArr[0].misc1;
                }
            } else {
                this.scheduleTypeArr = this.scheduleTypeArr;
                if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
                    this.scheduleType = this.scheduleTypeArr[0].misc1;
                }
            }

            //START : Common data specific to steepener Pranav D 8-Jun-2023
            if (this.steepnerEndFixedRatePeriod === undefined || this.steepnerEndFixedRatePeriod.length <= 0) {
                // this.EndFixedRatePeriod = this.apifunctions.GetCommonData('EndFixedRatePeriod_Steepener');
                this.EndFixedRatePeriod = this.EndFixedRatePeriod.tenorSortBy('Data_Value');
                if (this.EndFixedRatePeriod && this.EndFixedRatePeriod.length > 0) {
                    // this.endOfFixedRatePrd = this.EndFixedRatePeriod[0].misc1;
                    this.endOfFixedRatePrd ='1Y';
                }
            } else {
                this.EndFixedRatePeriod = this.steepnerEndFixedRatePeriod;
                this.EndFixedRatePeriod = this.EndFixedRatePeriod.tenorSortBy('Data_Value');
                if (this.EndFixedRatePeriod && this.EndFixedRatePeriod.length > 0) {
                    // this.endOfFixedRatePrd = this.EndFixedRatePeriod[0].misc1;
                    this.endOfFixedRatePrd ='1Y';
                }
            }

            if (this.steepnerFundingType === undefined || this.steepnerFundingType.length <= 0) {
                this.FundingTypeArr = await this.apifunctions.GetCommonData('FundingType_Steepener');
                if (this.FundingTypeArr && this.FundingTypeArr.length > 0) {
                    this.fundType = this.FundingTypeArr[0].misc1;
                }
            } else {
                this.FundingTypeArr = this.steepnerFundingType;
                if (this.FundingTypeArr && this.FundingTypeArr.length > 0) {
                    this.fundType = this.FundingTypeArr[0].misc1;
                }
            }

            if (this.steepnerFormat === undefined || this.steepnerFormat.length <= 0) {
                // this.FormatArr = this.apifunctions.GetCommonData('Format_Steepener');
                if (this.FormatArr && this.FormatArr.length > 0) {
                    this.format = this.FormatArr[0].misc1;
                }
            } else {
                this.FormatArr = this.steepnerFormat;
                if (this.FormatArr && this.FormatArr.length > 0) {
                    this.format = this.FormatArr[0].misc1;
                }
            }
    let issueDateArrRes = await this.apifunctions.GetCommonData('Offset_CapsFloors');
    this.issueDateArr = this.filterArrInAscendingOrder(issueDateArrRes);
    this.issueDate = '10B';

            if (this.steepnerFixingType === undefined || this.steepnerFixingType.length <= 0) {
                this.FixingTypeArr = await this.apifunctions.GetCommonData('FixingType_Steepener');
                console.log("Fixing",this.FixingTypeArr);
                
                if (this.FixingTypeArr && this.FixingTypeArr.length > 0) {
                    // this.fixing = this.FixingTypeArr[0].misc1;
                    this.fixing = 'In Advance';
                }
            } else {
                this.FixingTypeArr = this.steepnerFixingType;
                if (this.FixingTypeArr && this.FixingTypeArr.length > 0) {
                    // this.fixing = this.FixingTypeArr[0].misc1;
                    this.fixing = 'In Advance';
                }
            }

            if (this.steepnerCouponBasis === undefined || this.steepnerCouponBasis.length <= 0) {
                this.CouponBasisArr = await this.apifunctions.GetCommonData('CouponBasis_Steepener');
                if (this.CouponBasisArr && this.CouponBasisArr.length > 0) {
                    this.CouponBasisArr.forEach((data: any) => {
                        if (data.Data_Value_UpperCase == '30/360') {   //RiddhiP || 29JUNE23
                            this.cpnBasis = data.misc1;
                        }
                    })
                    //this.cpnBasis = this.CouponBasisArr[0].misc1;
                }
            } else {
                this.CouponBasisArr = this.steepnerCouponBasis;
                if (this.CouponBasisArr && this.CouponBasisArr.length > 0) {
                    this.CouponBasisArr.forEach((data: any) => {
                        if (data.Data_Value_UpperCase == '30/360') { //RiddhiP || 29JUNE23
                            this.cpnBasis = data.misc1;
                        }
                    })
                    //this.cpnBasis = this.CouponBasisArr[0].misc1;
                }
            }

            if (this.steepnerFundFrequency === undefined || this.steepnerFundFrequency.length <= 0) {
                this.FundingFrequencyArr = await this.apifunctions.GetCommonData('FundingFrequency_Steepener');
                this.FundingFrequencyArr = this.FundingFrequencyArr.tenorSortBy('Data_Value');
                if (this.FundingFrequencyArr && this.FundingFrequencyArr.length > 0) {
                    this.fundFreq = this.FundingFrequencyArr[0].misc1;
                }
            } else {
                this.FundingFrequencyArr = this.steepnerCouponBasis;
                this.FundingFrequencyArr = this.FundingFrequencyArr.tenorSortBy('Data_Value');
                if (this.FundingFrequencyArr && this.FundingFrequencyArr.length > 0) {
                    this.fundFreq = this.FundingFrequencyArr[0].misc1;
                }
            }


            if (this.steepnerFrequencyArr === undefined || this.steepnerFrequencyArr.length <= 0) {
                

                let frequencyArrRes = await this.apifunctions.GetCommonData('Frequency_Steepener');
                this.FrequencyArr = this.filterArrInAscendingOrder(frequencyArrRes);
                
                this.FrequencyArr = this.FrequencyArr.tenorSortBy('Data_Value');
                if (this.FrequencyArr && this.FrequencyArr.length > 0) {
                    // this.frequency = this.FrequencyArr[0].misc1;
                    this.frequency ='6m';   //RiddhiP || 29JUNE23
                }
            } else {
                this.FrequencyArr = this.steepnerFrequencyArr;
                this.FrequencyArr = this.FrequencyArr.tenorSortBy('Data_Value');
                if (this.FrequencyArr && this.FrequencyArr.length > 0) {
                    // this.frequency = this.FrequencyArr[0].misc1;
                    this.frequency ='6m';  //RiddhiP || 29JUNE23
                }
            }
            if (this.steepnerMaturityArr === undefined || this.steepnerMaturityArr.length <= 0) {
                
                

                let maturityArrRes = await this.apifunctions.GetCommonData('Maturity_Steepener');
                this.MaturityArr = this.filterArrInAscendingOrder(maturityArrRes);
        
                
                this.MaturityArr = this.MaturityArr.tenorSortBy('Data_Value');
                this.copyMaturityArr = this.MaturityArr;
                if (this.MaturityArr && this.MaturityArr.length > 0) {
                    // this.maturity = this.MaturityArr[0].misc1;
                    this.maturity ='3Y'; //RiddhiP || 29JUNE23
                    //this.changeddlFixedRatePeriod(this.maturity);
                    this.changeDatesFrequencyArr(this.maturity);
                   
                    this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
                    this.endOfFixedRatePrd = '1Y'      //RiddhiP || 29JUNE23
                     
                }
            } else {
                this.MaturityArr = this.steepnerMaturityArr;
                this.MaturityArr = this.MaturityArr.tenorSortBy('Data_Value');
                this.copyMaturityArr = this.MaturityArr;
                if (this.MaturityArr && this.MaturityArr.length > 0) {
                    //this.maturity = this.MaturityArr[0].misc1;
                    this.maturity ='3Y';   //RiddhiP || 29JUNE23
                    //this.changeddlFixedRatePeriod(this.maturity);
                    this.changeDatesFrequencyArr(this.maturity);
                   
                    this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
                    this.endOfFixedRatePrd = '1Y'  //RiddhiP || 29JUNE23
                }
            }
            //  

            //END : Common data specific to steepener Pranav D 8-Jun-2023

            //Start: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
            if (this.capToggleYN == 'N') {
                this.cap = ''
            } else {
                this.cap = parseFloat('5').toFixed(2);
            }
            //END: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
            this.scheduleTypeChange();
            this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            this.reset();
            this.portfolioId = '';
            this.scheduledReqId = '';
            await this.fnGetProdTemplate();
            this.fnGetValidation();
            this.allBooksData = this.apifunctions.allBooksData;

            this.allBooksData = [
                {
                  BookCode : 'FinIQ Consulting Pvt Ltd',
                  BookName : 'FinIQ Consulting Pvt Ltd'
                },
                {
                  BookCode : 'RBC',
                  BookName : 'RBC'
                }
              ];
            //   this.mappedformatlist = ['Note', 'Swap'];

            if (this.allBooksData && this.allBooksData.length > 0) {
                this.onBehalfOf = this.allBooksData[0].BookCode;
                this.GetClientProdDetailsArr = await this.apifunctions.GetClientProdDetails(this.onBehalfOf);
                if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr?.length > 0) {
                    if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Rates - Steepener') > -1) {
                        this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Rates - Steepener')].CPM_Format).toString().split(',');
                        this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'Rates - Steepener')].ActiveYN;
                        //  
                    }
                }
            }
            this.mappedformatlist = ['Note', 'Swap'];
            this.commonfunctions.ClearPricesFromMultiToDealEntry();

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



            // this.format = 'Note';
            if (this.mappedformatlist !== undefined && this.mappedformatlist.length > 0) {
                if (this.mappedformatlist.findIndex((obj: any) => obj === 'Note') > -1) {
                    this.format = 'Note';
                } else {
                    this.format = this.mappedformatlist[0];
                }

            }

            this.sortedAllPrices = [];
            
            this.ReceivedCCY = this.apifunctions.CCY;
            try {
                this.ReceivedCCY.forEach((element: any) => {
                    if (element.Ccy !== 'JPY' && element.Ccy !== 'DCD' && (element.Ccy === 'EUR' || element.Ccy === 'USD')) {
                        const ccyData = element.Ccy;
                        this.CCY.push(ccyData);
                    }
                });
            } catch (error) {

            }
            this.ddlNoteCcy = 'EUR';

           
                this.users = await this.apifunctions.GetMappedUsersAndGroups();

                const res: any = await this.apifunctions.GetPriceProviderDetails(this.product_code);
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
            TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
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
            TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
            KidDisableFlag: false,  //Added by Apurva K|| 22-May-2023
            KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
            TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
          });
        };
           

            this.formatChange();
            // added by Suvarna P || new changes reported by Nitij M || 05May2023
            this.setDefaultSolveForValues();
            const that = this;

            this.SteepenerPriceSubscription = this.commonfunctions.SteepenerSignalRPrices.subscribe(res => {
                const prices = res.price;
                if (prices && prices.length > 0) {
                  this.sortedAllPrices = [];
                  this.AllPrices = [];
                  for (let i = 0; i < prices.length; i++) {
                    for (let k = 0; k < this.priceProvidersArr.length; k++) {
                      if (prices[i].ppID === this.priceProvidersArr[k].lp) {
                        this.priceProvidersArr[k].price = ((prices[i].status + '').toUpperCase() === 'TIMEOUT' && (this.priceProvidersArr[k].price === '' || this.priceProvidersArr[k].price === '-')) ? 'Timeout' :
                          ((prices[i].value === null || prices[i].value === '') ? ((prices[i].status + '').toUpperCase() === 'REJECTED' ? 'Rejected' : ((prices[i].status + '').toUpperCase() === 'UNSUPPORTED' ? 'Unsupported'
                            : ((prices[i].status + '').toUpperCase() === 'EXPIRED' ? 'Expired' : '-'))) : ((prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'EXPIRED') ? 'Expired' :
                              (prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'CANCELLED') ? 'Cancelled' : prices[i].value));
                        if (this.priceProvidersArr[k].price !== '-') {
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
                          EP_Quote_Response_At: prices[i].EP_Quote_Response_At,
                          EP_ValidUntilTime: prices[i].EP_ValidUntilTime
                        });
                      }
                    }
                  }
      
                  var idxBest = this.AllPrices.findIndex(item => item.bestYN === 'Y');
                  if (idxBest > -1) {
                    this.sortedAllPrices = this.AllPrices.filter(item => item.bestYN === 'Y');
                  }
      
                  if (this.sendtocptyflag) {
                    this.sortedAllPrices = this.AllPrices;
                  }
      
      
                  if (this.sortedAllPrices && this.sortedAllPrices[0]) {
                    var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
      
                    this.bestLPArray = this.priceProvidersArr[idx];
                    this.bestLPArray.idx = idx
                  }
      
                  this.buttonList = '';
      
                  if (this.sortedAllPrices.length > 0) {
                    if (this.sortedAllPrices.length > 0 && this.sortedAllPrices[0].Price !== '' && this.sortedAllPrices[0].Price !== '-' && this.sortedAllPrices[0].Price !== 'Timeout' && this.sortedAllPrices[0].Price > 0 && this.sendtocptyflag) {
                      this.shwRepriceBookOrder = true;
                    }
                    that.loadflag = false;
                    let price = '';
                    if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                      price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                    }
                    switch (this.sortedAllPrices[0].solveFor) {
                      case 'IBPrice':
                          that.IBPrice = price;
                          that.replySolveFor = 'Price';
                          break;
                      case 'Leverage':
                          that.Leverage = price;
                          that.replySolveFor = 'Leverage';
                          // Commented | 25-Jul-2023 | Added by Anubhav Goyal | 24-Jul-2023 | BBVAEPCLI-647 - To display WARNING: Strike is out of bounds - Contact your Sales Representative on specific conditions
                          // if (that.Leverage == '' || (parseFloat(that.Leverage) > 1000 || parseFloat(that.Leverage) < 50)) {
                          //     this.ErrorMsg = 'Result is out of bounds - Contact your Sales Representative';
                          // } else {
                          //     this.ErrorMsg = '';
                          // }
                          break;
                      case 'InitialFixedRate':
                          that.initialFixedRate = price;
                          that.replySolveFor = 'Initial Fixed Rate';
                          // // Commented | 25-Jul-2023 | Added by Anubhav Goyal | 24-Jul-2023 | BBVAEPCLI-647 - To display WARNING: Strike is out of bounds - Contact your Sales Representative on specific conditions
                          // if (this.initialFixedRateYN == 'Y' && (that.initialFixedRate === '' || parseFloat(that.initialFixedRate) < parseInt(this.RatesInitialFixedRateLimit[0]) || parseFloat(that.initialFixedRate) > parseInt(this.RatesInitialFixedRateLimit[1]))) {
                          //     this.ErrorMsg = 'Result is out of bounds - Contact your Sales Representative';
                          // }
                          // else {
                          //     this.ErrorMsg = '';
                          // }
                          break;
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
                ((params: any) => {
                    if (params.RFQ_ID) {
                        let preQuoteData1: any;
                        preQuoteData1 = this.apifunctions.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');
                        if (this.commonfunctions.isEmptyObject(preQuoteData1)) {
                            this.ErrorMsg = 'No data found for this record.';
                        } else {
                            // viewOnly
                            //this.viewOnly = params.viewOnly ? true : false;
                            this.viewOnly = (params.viewOnly === "true") ? true : false;  // Added by Anubhav Goyal | 24-Jul-2023 | BBVACLI-1182 | receiving true/false as string.
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

                            //this.viewOnly = params['viewOnly'] ? true : false;
                            this.viewOnly = (params.viewOnly === "true") ? true : false;  // Added by Anubhav Goyal | 24-Jul-2023 | BBVACLI-1182 | receiving true/false as string.
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
                            //this.viewOnly = params.viewOnly ? true : false;
                            this.viewOnly = (params.viewOnly === "true") ? true : false;  // Added by Anubhav Goyal | 24-Jul-2023 | BBVACLI-1182 | receiving true/false as string.
                            this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                        }
                    }
                    if (params.PORTFOLIO_ID) {
                        this.portfolioId = params.PORTFOLIO_ID;
                        const saveQuoteData: any = this.apifunctions.getRedirectionData(params.PORTFOLIO_ID,'');
                        if (saveQuoteData.length === 0) {
                            this.ErrorMsg = 'No data found for this record.';
                        } else {
                            // viewOnly
                            //this.viewOnly = params.viewOnly ? true : false;
                            this.viewOnly = (params.viewOnly === "true") ? true : false;  // Added by Anubhav Goyal | 24-Jul-2023 | BBVACLI-1182 | receiving true/false as string.
                            this.setSaveQuoteData(saveQuoteData[0], this.viewOnly);
                        }
                    }
                    if (params.Tenor) {
                        // this.expshift = params.Tenor;
                    }
                    if (params.Underlyings) {
                        var list: string[] = params.Underlyings.split(",")
                        for (var each of list) {
                            // this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, each)[0]);

                        }

                    }

                });

            this.route.queryParams.subscribe((res: any) => {
                if (res.Underlying) {

                    var list: string[] = res.Underlying;

                    // for (var each of list) {
                    // this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, res.Underlying)[0]);
                    // }
                }

                if (res.Tenor) {
                    if (res.Tenor.includes('YEAR')) {
                        // this.expshift = res.Tenor.slice(0, res.Tenor.indexOf('YEAR')) + 'Y';
                    } else {
                        // this.expshift = res.Tenor;
                    }

                }

            });
            this.pageloadflag = false;

            $('#loading').hide();

        });
    } catch (error) {

    }

}

fnGetValidation() {
    try {
        // return true;
        this.validationArr = this.apifunctions.validationArr;
        if (this.validationArr) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.validationArr.length; i++) {

                switch (this.validationArr[i].Setting_Name) {
                     //Start Added by Radha || 29-06-23 ||Validations
                    // case 'MinLeverageSteepener':
                    //     this.MinLeverageSteepener = this.validationArr[i].Default_Value;
                    //     break;
                    // case 'MaxLeverageSteepener':
                    //     this.MaxLeverageSteepener = this.validationArr[i].Default_Value;
                    //     break;


                    // case 'EQ_DefaultRFQTimeOut_Ang':
                    //     this.defaultTimeout = this.validationArr[i].Default_Value;
                    //     break;

                    case 'SteepenerResponseTimeout':
                        this.defaultTimeout=this.validationArr[i].Default_Value;
 
                        break;
                     //End Added by Radha || 29-06-23 ||Validations
                     case 'EQ_Show_Termsheet_Button':
              if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_Termsheet_Button = this.validationArr[i].Config_Value;
                }
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

            case 'EQ_OrderValidityTimer_Ang':
              this.defaultOrderTimeout = this.validationArr[i].Default_Value;
              break;

            case 'EQ_DefaultRFQTimeOut_Ang':
              this.defaultRFQTimeout = this.validationArr[i].Default_Value;
              break;

                }
            }

        }
    } catch (error) {

    }
}
    async fnGetProdTemplate() {
    try {
        this.templateMappingArr = await this.apifunctions.fnGetProdTemplate(this.product_code);

    } catch (error) {

    }

}
// added by Suvarna P || new changes reported by Nitij M || 05May2023
setSolveFor(e: any) {
    try {
        this.infoMsg = '';
        // const target = this.commonfunctions.GetEventTarget(e);
        // this.SolveForvalue = target.value;
        this.setDefaultSolveForValues();
        // if (this.SolveForvalue === 'InitialFixedRate') {
        //     if (this.FixedCouponYN === 'N') {
        //         this.initialFixedRate = '';
        //     } else {
        //         this.initialFixedRate = parseFloat('2').toFixed(2);
        //     }
        // }
        // if (this.SolveForvalue === 'Reoffer') {
        //     this.IBPrice = ''
        //     this.setDefaultSolveForValues();
        // }
        // if (this.SolveForvalue === 'Levearage') {
        //     this.IBPrice = ''
        //     this.setDefaultSolveForValues();
        // }
  // Reset function shifted to Bottom Pranav D 22-Jun-2023
        this.reset();
    } catch (error) {

    }
}

initialFixedCpnChange() {
    try {
        if (this.FixedCouponYN === 'No' && this.SolveForvalue === 'InitialFixedRate') {
            this.initialFixedRate = '';
        } else {
            this.initialFixedRate = parseFloat('2').toFixed(2);
        }
    } catch (error) {

    }
}

// added by Suvarna P || new changes reported by Nitij M || 05May2023
setDefaultSolveForValues() {
    // this.underlyingRef = this.STUderlyingRefRateArr[0].Code;
    if (this.SolveForvalue === 'InitialFixedRate') {
        this.initialFixedRate = ""
        // START || RadhaM || 29-06-23||setting default values for solvefor for price % and upfront
        if (this.format === 'Swap' || this.format === 'Option') {
            this.IBPrice = '0.00';
        } else {
            this.IBPrice = '99.50';
        }
        //this.IBPrice = parseFloat("99.50").toFixed(2);
         // END || RadhaM || 29-06-23||setting default values for solvefor for price % and upfront
        this.Leverage = parseFloat("100.00").toFixed(2); //RiddhiP || 29JUNE23
        // this.initialFixedRateYN = 'Y' | Anubhav Goyal | 19-Jun-2023
        this.initialFixedRateYN = 'Y';
        this.firstCpnYN = 'N';
        this.cpnFirst = 'Short';
        this.changeDatesFrequencyArr(this.maturity);
        this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
        //this.changeddlFixedRatePeriod(this.maturity);
        this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1;
    }
    if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = ''
        this.FixedCouponYN = "Y"
        this.initialFixedRate = parseFloat("2").toFixed(2);
        this.Leverage = parseFloat("100.00").toFixed(2); //RiddhiP || 29JUNE23
    }
    if (this.SolveForvalue === 'Leverage') {
         // START || RadhaM || 29-06-23||setting default values for solvefor for price % and upfront
        if (this.format === 'Swap' || this.format === 'Option') {
            this.IBPrice = '0.00';
        } else {
            this.IBPrice = '99.50';
        }
        //this.IBPrice = parseFloat("99.50").toFixed(2);
         // END || RadhaM || 29-06-23||setting default values for solvefor for price % and upfront
        this.FixedCouponYN = "Y"
        this.initialFixedRate = parseFloat("2").toFixed(2);
        this.Leverage = ""
    }

    /*
    try {
        if (this.Strike === '' && solveFor !== 'Strike' && solveFor !== 'Strike + CouponBarrier') {
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
        if (this.cpnTrigger === '' && solveFor !== 'CouponBarrier' && solveFor !== 'KI + CouponBarrier' && solveFor !== 'Strike + CouponBarrier'
            && this.format !== 'Option' && this.cpnType !== 'Fixed Coupon' && this.cpnType !== 'No Coupon') {
            this.cpnTrigger = '70.00';
        }
        if (this.barrierLevel === '' && solveFor !== 'KI' && solveFor !== 'KI + CouponBarrier' && this.barrierType !== 'None') {
            this.barrierLevel = '60.00';
        }
        if (this.fundRate === '' && solveFor !== 'FundingRate' && this.format === 'Swap') {
            this.fundRate = '1.00';
        }
    } catch (error) {
         
    }
    */
}
setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
    Exchangename: string, ISINname: string, Last1yearHighValue: string,
    Last1yearLowValue: string, Spot: string, RiskRating: any, Manualflag: any, BlacklistedFlag: any) {
    try {
        this.SelectedUnderlyingarray.push({ LongName, Ccy, Code, ExchangeCode, Exchangename, Manualflag, BlacklistedFlag });
        this.SelectedUnderlyingBasketArray.push({
            LongName, Ccy, Code, ExchangeCode, Exchangename, ISINName: ISINname,
            Last1yearHighValue, Last1yearLowValue,
            Spot, Riskrating: RiskRating, Manualflag, BlacklistedFlag
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

ChangeIndex(e: any) {
    try {
        this.selectedShareIndex = 0;
        this.flag = true;
        this.shareCode = '';
        this.selectedBIndex = 0;
        this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
    }
}
selectShare(e: any) {
    try {
        this.flag = false;
        if ($('.HoverSuggestion').data('share') !== undefined) {
            this.shareCode = $('.HoverSuggestion').data('share');
        }

        if (this.shareCode !== undefined && this.shareCode !== '') {
            // this.showUnderlying(e, SearchUnderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
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

showUnderlying(event: any, item: any) {
    try {
        //  
        this.reset();
        this.infoMsg = '';
        this.flag = false;
        this.selectedBIndex = 0;
        this.showSuggestions = false;
        this.ShareName = '';

        if (this.format == 'Warrant') {
            if (this.ShareBasket.length < 1) {
                if (this.ShareBasket.find((i: any) => i.Code === item.BloombergCode) === undefined) {
                    this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Manualflag: item.Manualflag, BlacklistedFlag: item.BlacklistedFlag });
                    this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
                        item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Manualflag, item.BlacklistedFlag);
                } else {
                    return false;
                }
            }
        }
        else {
            if (this.ShareBasket.length < 5) {
                if (this.ShareBasket.find((i: any) => i.Code === item.BloombergCode) === undefined) {
                    this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Manualflag: item.Manualflag, BlacklistedFlag: item.BlacklistedFlag });
                    this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
                        item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Manualflag, item.BlacklistedFlag);

                } else {
                    return false;
                }
            }

        }


        if (this.ShareBasket.length > 0) {
            document.getElementById('txtShare')!.classList.remove('underlyingError');
            document.getElementById('txtShare')!.classList.add('longText');
        }

        return false;


    } catch (error) {

        return false;
    }

}


async Price() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      await this.validationOnButton();
      if (this.ErrorMsg === '') {
        this.reset();
        this.priceBtnActive = 'N';
        this.loadflag = true;
        this.pageloadflag = false;
        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
        if (isNaN(this.portfolioGroupID)) {
          this.ErrorMsg = "Price request failed. Please reload the application and try again.";
          return false;
        }
        if (!this.priceClickFlag) {
          await this.SteepenerPrice('All', "0", 'N');
        }
      }
      return false;
    } catch (error) {

    }
    return false;
  }

  async PriceLP(LP) {
    try {
      this.validationOnButton();

      if (this.ErrorMsg === '') {

        this.priceProvidersArr.forEach(item => {
          if (item.lp == LP) {
            this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = true
          }
          else {
            this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
          }
        })
        this.reset();
        this.loadflag = true;
        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();

        if (!this.priceClickFlag) {

          if (this.sendtocptyflag) {
            this.priceProvidersArr = [];
            const res: any = await this.apifunctions.GetPriceProviderDetails(this.product_code);
            for (let i = 0; i < res.length; i++) {
              if (res[i] === res[i]) {
                this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '', TSLoadFlag: false, KIDLoadFlag: false, ViewKIDFlag: false, ViewTSFlag: false, TSDisableFlag: false, KidDisableFlag: false });//Added by Apurva K|| 02-May-2023 

              }
            }
            // this.CapsNFloorPrice(LP, this.viewRFQID, 'Y'); to be removed
          }
          else {
            this.SteepenerPrice(LP, "0", 'N');
          }
        }
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }


generateXML() {
    try {
        
        const object = {};
        let xmlstr = '<QuoteRequest>';

        let formattedcpnTrigger = '';


        for (const i in this.templateMappingArr) {

            switch (this.templateMappingArr[i].email_Header) {
                case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'SolveFor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'UnderlyingReferenceRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.underlyingRef + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;

                case 'CouponBasis': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.cpnBasis + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;


                case 'Fixing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.fixing + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Maturity': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.maturity + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Frequency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.frequency + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                    //Added condition  if  this.initialFixedRateYN=='Y'  and flagFixedRate is true send coupon | Anubhav Goyal | 31-Jul-2023 | BBVACLI-1203
                case 'FirstCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    +((this.initialFixedRateYN=='Y'  && this.flagFixedRate)? this.cpnFirst:'') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                     //Added by Anubhav Goyal | 08-Sep-2023 | BBVAEPCLI-701
                case 'EndFixedRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + ((this.initialFixedRateYN=='Y')?this.endOfFixedRatePrd:'' )+ '</' + this.templateMappingArr[i].template_Field_Name + '>';

                    break;
                case 'Leverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.Leverage + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Spread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.spread + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Cap': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.cap + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Floor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.floor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'FundingType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.fundType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'FundingFrequency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.fundFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'FundingRateSpread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.fundRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'FixedRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.initialFixedRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                case 'On behalf of': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;

                case 'UnderlyingReferenceRate2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.underlyingRef2 + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;

                case 'loginuser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + AppConfig.settings.oRes.userName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;

                case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
                    // added by Anubhav G || 27Jun23 || initial Fixed RateMapping
                case 'InitialFixedRateYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                    + this.initialFixedRateYN + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                    break;
            }

        }
        xmlstr += '</QuoteRequest>';
        return xmlstr;
    } catch (error) {

        return '';
    }
}

async SteepenerPrice(LPVal, NMID, repriceFlg) {
    try {
      var LP = '';
      this.priceBtnActive = 'N';
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
      const requestXML = this.generateXML();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.product_code,
        subTemplateCode: this.product_code,
        LP: LP,
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
        if (LPVal == 'All') {
          let isPriceFlgChk = that.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
          if (isPriceFlgChk == -1) {
            that.priceProvidersArr.forEach(item => {
              let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
              that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);

            });
          } else {
            that.priceProvidersArr.forEach(item => {
              if (item.priceChkFlg) {
                let idx = that.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
                that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
              }
            });
          }
        }
        else {
          let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
          if (idx > -1) {
            that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
          }
        }
        if (data.errorMessage !== '' || !that.pageActive) {
          that.ErrorMsg = data.errorMessage.split('. ')[0];
          that.loadflag = false;
          that.timeLeft = 0;
          this.priceBtnActive = 'Y'
          this.priceProvidersArr.forEach(item => {
            this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
          })

          for (let i = 0; i < that.priceProvidersArr.length; i++) {
            that.priceProvidersArr[i].timer = '';
            clearInterval(that.priceProvidersArr[i].interval1);
            that.priceProvidersArr[i].timeStartFlag = false;
          }
          return false;
        }

        that.rfqID = data.rfqid;
        that.NoteMasterID = data.noteMasterID;
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
                  quoteResponseCheck = await that.SteepenerPriceResponse(that.PPDetails);
                }

                that.timeLeft = that.timeLeft - 5;
              } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                that.loadflag = false;
                clearInterval(that.interval);
              }
            }, 5000);
          }
        }
      });
    } catch (error) {

    }
  }

    async SteepenerPriceResponse(PPDetails: any) {
    try {

        // $(document).bind("ajaxStart", () => {
        //     $("#loading").hide();
        // });

        const webMethod = this.interfaceUrl + 'eqd/Quote/CheckIfResponseReceived';
        const that = this;
        const parameters = {
            QuoteRequestID: PPDetails,
            // SolveFor: this.SolveForvalue,
        };
        // $.ajax({
        //     async: true,
        //     crossDomain: true,
        //     type: 'POST',
        //     url: webMethod,
        //     data: JSON.stringify(parameters),
        //     contentType: 'application/json; charset=utf-8',
        //     dataType: 'json',
        //     headers: this.apifunctions.getHeaders(),

        //     success(data: any) {
        //         that.Prices = data;
        //         that.commonfunctions.setSteepenerReceivedPrices(that.Prices, 1);
        //     },
        //     error(error: any) {
        //         console.error(error);
        //     }
        // });

        return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
            that.Prices = data;
            that.commonfunctions.setSteepenerReceivedPrices(that.Prices, 1);
            this.Prices.forEach((item) => {
              if (item.value != "") {
                this.priceBtnActive = 'Y';
              }
            });
            let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
            if (invalidDataLength > 0) {
              this.loadflag = false;
              return false;
            }
            else {
              return true;
            }
          });
          
    } catch (error) {

    }
}

removeShare(rownumber: any) {
    try {
        this.ShareBasket.splice(rownumber, 1);
        this.SelectedUnderlyingarray.splice(rownumber, 1);
        this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
        this.updateShareBasket();
        this.reset();
        this.infoMsg = '';
    } catch (error) {

    }

}

IBPricechange() {
    try {
        this.reset();
        this.infoMsg = '';

    } catch (error) {

    }
}

reset() {
    try {


        this.loadflag = false;
        this.priceBtnActive = 'Y';
        this.timeLeft = -1;
        this.timeoutMsg = '';
        this.clearFlag = true;
        clearInterval(this.interval);

        if (this.ShareBasket.length > 0) {
            document.getElementById('txtShare')!.classList.remove('underlyingError');
            document.getElementById('txtShare')!.classList.add('longText');
        }
        this.PPDetails = '';
        this.sortedAllPrices = [];
        this.AllPrices = [];
        this.orderID = '';
        this.loadflag = false;
        this.ErrorMsg = '';
        this.rfqID = '';
        this.NoteMasterID = '';
        this.saveFlag = false;
        this.successMsg = '';
        this.reqSuccessMsg = '';
        const els = document.getElementsByClassName('error');
        // tslint:disable-next-line: prefer-for-of
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < els.length; i++) {
            els[i].classList.remove('error');
        }
        // document.getElementById('txtShare')!.classList.remove('underlyingError');
        // document.getElementById('txtShare')!.classList.add('longText');

        //Added by Anubhav Goyal | 28-Jun-2023 | On reset value should be blank.
        if (this.SolveForvalue === 'IBPrice') {
            this.IBPrice = '';
        }
        if (this.SolveForvalue === 'Leverage') {
            this.Leverage = '';
        }
        if (this.SolveForvalue === 'InitialFixedRate') {
            this.initialFixedRate = '';
        }

        //Added by Anubhav Goyal | 14-Jun-2023
        if (document.getElementById('txtIBPrice')) {
            document.getElementById('txtIBPrice')!.classList.remove('reply');
        }
        if (document.getElementById('txtLeverage')) {
            document.getElementById('txtLeverage')!.classList.remove('reply');
        }
        //Added by Anubhav Goyal | 28-Jun-2023
        if (document.getElementById('txtInitialFixedRate')) {
            document.getElementById('txtInitialFixedRate')!.classList.remove('reply');
        }

        this.commonfunctions.SteepenerPricesObserver.next('');
      this.commonfunctions.SteepenerPrices = [];
      this.commonfunctions.setSteepenerReceivedPrices({}, '');
      this.bestLPArray = [];
      this.priceProvidersArr.forEach(element => {
        if (element.interval1) {
          element.interval1 = clearInterval(element.interval1);
          element.timeStartFlag = false;
        }
        element.rfq = '';
        element.price = '-';
        element.timer = this.defaultOrderTimeout;
        element.id = '';
        element.status = '';
        element.NoteMasterID = '';
        element.TSFlag = false;
        element.Msg = '';
        element.KIDFlag = false;
        element.TSMsg = '';
        element.loadFlag = false;
        element.TSLoadFlag = false;
        element.KIDLoadFlag = false;
        element.ViewKIDFlag = false;
        element.ViewTSFlag = false;
        element.TSDisableFlag = false;
        element.KidDisableFlag = false;
      }
      );
      this.priceClickFlag = false;
      this.bookOrderFlag = true;

    } catch (error) {

    }
    return false;
}

PriceValidation(e: any, Pricestr: string) {
    try {
        this.reset();
        this.infoMsg = '';
        const target = this.commonfunctions.GetEventTarget(e);
        this.ErrorMsg = '';
        target.classList.remove('error');

        switch (Pricestr) {
            //START || Validation condtion and logics || Added by Taran || 29th June 2023
            case 'Leverage':
                if (target.value === '' || (target.value>1000 || target.value<50)) {
                    
                    this.ErrorMsg = 'Leverage should be between ' + '50' + '% and ' + '1000' + '%.';
                    target.classList.add('error');
                }  
                break;
           
            case 'CapFloorLimit':
                 //BBVAEPCLI- 645 | Anubhav Goyal | 19-Jul-2023 |  | Removed target.value === '' condition as it was incorrect.
               if (parseFloat(this.floor) < parseFloat(this.RatesFloorLimit[0]) || parseFloat(this.floor) > parseFloat(this.RatesFloorLimit[1])) {
                    this.ErrorMsg = 'Floor (%) should be between ' + this.RatesFloorLimit[0] + '% and ' + this.RatesFloorLimit[1] + '%.';
                    target.classList.add('error');
                } //BBVAEPCLI- 645 | Anubhav Goyal | 19-Jul-2023 | Added cap condition | Removed target.value === '' condition as it was incorrect. 
                else if ((this.cap == '' && this.capToggleYN == 'Y' )|| parseFloat(this.cap) < parseFloat(this.RatesCapLimit[0]) || parseFloat(this.cap) > parseFloat(this.RatesCapLimit[1])) {
                    this.ErrorMsg = 'Cap (%) should be between ' + this.RatesCapLimit[0] + '% and ' + this.RatesCapLimit[1] + '%.';
                    target.classList.add('error');
                } else if (parseFloat(this.cap) <= 20 && (parseFloat(this.cap) < (parseFloat(this.floor) + 2))) {
                     
                    this.ErrorMsg = 'Cap must be between '+ (parseFloat(this.floor)+2) + '% ' + 'and ' +  this.RatesCapLimit[1] + '%';

                }
                break;
            case 'InitialFixedRate':
                if (target.value === '' || target.value<parseInt(this.RatesInitialFixedRateLimit[0]) || target.value>parseInt(this.RatesInitialFixedRateLimit[1])) {
                    
                    this.ErrorMsg = 'Initial fixed rate should be between ' + this.RatesInitialFixedRateLimit[0] + '% and ' + this.RatesInitialFixedRateLimit[1] + '%.';
                    target.classList.add('error');
                } 
                break;
                //END || Validation condtion and logics || Added by Taran || 29th June 2023

        }
    } catch (error) {

    }
}

cpnTypeChange() {
    return true;
}

formatChange() {
    try {
        this.reset();
        this.infoMsg = '';

        if (this.format === 'Swap') {
            this.fundType = this.FundingTypeArr[0].misc1;
            this.fundFreq = this.FundingFrequencyArr[0].misc1;
            this.fundRate = parseFloat('1').toFixed(2);
        } else {
            this.fundType = '';
            this.fundFreq = '';
            this.fundRate = '';
        }
        // <!-- RiddhiP || 13june23 ||  BBVAEPCLI-548 || Rates: Steepner Blotter UI -->

        if (this.SolveForvalue === 'IBPrice') {
            this.IBPrice = '';
            if (this.format === 'Swap') {
                this.issuePrice = '';
            } else {
                this.issuePrice = '100.00';
            }
        } else {
            if (this.format === 'Swap') {
                this.IBPrice = '0.00';
                this.issuePrice = '';
            } else {
                //this.IBPrice = '99.50'; // Commented by Anubhav Goyal | 24-Jul-2023 | BBVAEPCLI-630 | Reoffer changes to 99.50% in the single pricer when you change the on behalf of
                this.issuePrice = '100.00';
            }
        }

    } catch (error) {

    }
    return false;
}

Save() {
    try {
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
            this.reqSuccessMsg = '';
            const strXml = '<Details>' + this.generateSaveXML() + '</Details>';
            const res = this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, '', '', this.product_code, (this.commonfunctions.getLoggedInUserName()));
            // if (res) {
            //     if (res.errorMessage === '') {
            //         this.saveFlag = true;
            //         this.saveportfolioId = res.PortFolioID;
            //         this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';

            //     }
            // }
        }
    } catch (error) {

    }
    return false;
}

// START : Pranav D 19-Jun-2023 changes done required for performing save request action 
generateSaveXML() {
    try {
        this.ErrorMsg = '';
        this.infoMsg = '';
        let underlying1 = '';
        let underlying2 = '';
        this.validationOnButton();

        //  

        this.tempXML = '';
        if ((this.Notional + '').includes(',')) {
            this.Notional = this.Notional.replace(/,/g, '');
        }
        const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].Code + '#')) +
            ((this.ShareBasket[1] === undefined) ? '' : (this.ShareBasket[1].Code + '#')) +
            ((this.ShareBasket[2] === undefined) ? '' : (this.ShareBasket[2].Code + '#')) +
            ((this.ShareBasket[3] === undefined) ? '' : (this.ShareBasket[3].Code + '#')) +
            ((this.ShareBasket[4] === undefined) ? '' : (this.ShareBasket[4].Code + '#')) +
            ((this.ShareBasket[5] === undefined) ? '' : (this.ShareBasket[5].Code + '#')) + '#' + this.ddlNoteCcy;
        this.tempXML += '<Record>' +
            '<Share>' + shareCcy + '</Share>' +

            '<ShareBBGRIC1>' + '' + '</ShareBBGRIC1>' +
            '<ShareBBGRIC2>' + '' + '</ShareBBGRIC2>' +
            '<ShareBBGRIC3>' + '' + '</ShareBBGRIC3>' +
            '<ShareBBGRIC4>' + '' + '</ShareBBGRIC4>' +
            '<ShareBBGRIC5>' + '' + '</ShareBBGRIC5>' +
            '<ShareBBGRIC6>' + '' + '</ShareBBGRIC6>' + '<ShareLongName1>' + this.underlyingRef + '</ShareLongName1>' +
            '<ShareLongName2>' + this.underlyingRef2 + '</ShareLongName2>' +
            '<ShareLongName3>' + '' + '</ShareLongName3>' +
            '<ShareLongName4>' + '' + '</ShareLongName4>' +
            '<ShareLongName5>' + '' + '</ShareLongName5>' +
            '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
            '<IBPrice>' + this.IBPrice + '</IBPrice>' +
            '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
            '<TenorPer>' + '' + '</TenorPer>' +
            '<TenorType>' + '' + '</TenorType>' + '<Underlying1>' + this.underlyingRef + '</Underlying1>' +
            '<Underlying2>' + this.underlyingRef2 + '</Underlying2>' +
            '<Underlying3>' + '' + '</Underlying3>' +
            '<Underlying4>' + '' + '</Underlying4>' +
            '<Underlying5>' + '' + '</Underlying5>' +
            '<Upfront>' + this.IBPrice + '</Upfront>' +
            '<Wrapper>' + this.format + '</Wrapper>' +
            '<Size>' + this.Notional + '</Size>' +
            '<FundingType>' + this.fundType + '</FundingType>' +
            '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>' +
            '<IndexRateSpread>' + this.fundRate + '</IndexRateSpread>' +
            '<CouponBasis>' + this.cpnBasis + '</CouponBasis>' +
            '<ReofferPrice>' + this.issuePrice  +'</ReofferPrice>' + // added by Suvarn P || for Saved Req issue
            '<FormatDetails>' + this.format + '</FormatDetails>' +'<IssuePrice>' + this.issuePrice + '</IssuePrice>' +'<SubTemplate>' + this.Product + '</SubTemplate>' +'<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
            '<FirstLongCoupon>' + ((this.initialFixedRateYN=='Y'  && this.flagFixedRate)? this.cpnFirst:'')  + '</FirstLongCoupon>' + //Added condition  if  this.initialFixedRateYN=='Y'  and flagFixedRate is true send coupon | Anubhav Goyal | 31-Jul-2023 | BBVACLI-1203
            '<CapPercent>'+ this.cap + '</CapPercent>' +
            '<FloorPercent>'+ this.floor + '</FloorPercent>' +
            '<InitialFixedRate>'+ this.initialFixedRate + '</InitialFixedRate>' +
            '<InitialFixedRateYN>'+ this.initialFixedRateYN + '</InitialFixedRateYN>' +
            '<CapPercent>'+ this.cap + '</CapPercent>' +
            '<Fixing>' + this.fixing + '</Fixing>' +
            '<Frequency>' + this.frequency + '</Frequency>' +
            '<Leverage>' + this.Leverage + '</Leverage>' +
            '<InputMaturity>' + this.maturity + '</InputMaturity>' +
             //Added by Anubhav Goyal | 08-Sep-2023 | BBVAEPCLI-701
            '<EndFixedRatePeriod>' + ((this.initialFixedRateYN=='Y')?this.endOfFixedRatePrd:'') + '</EndFixedRatePeriod>' +
            '</Record>';
        this.commonfunctions.generateFlexiXml(this.tempXML);
        return this.tempXML;
    } catch (error) {

        return '';
    }
}
// END : Pranav D 19-Jun-2023 changes done required for performing save request action 
checkNotional(e: any) {
    try {
        // Code removed as on clicking in Notional box notional got unformatted but on tabout no comma added to notional box Pranav D 20-Jun-2023
        this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e.target.value = this.Notional;
    } catch (error) {

    }
}

    async currencyChange() {
    try {
        this.reset();
        this.infoMsg = '';
        if (this.ddlNoteCcy === 'MXN') {
            this.Notional = '10,000,000';
        }
        this.checkNotionalRes = this.apifunctions.BBVACheckNotional(this.Product, this.ddlNoteCcy);
        if ((this.Notional + '').includes(',')) {
            this.Notional = this.Notional.replace(/,/g, '');
        }
        if (this.checkNotionalRes !== undefined && this.checkNotionalRes.length > 0 && this.checkNotionalRes.length > 0) {
            if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
                || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
                document.getElementById('txtnotional')!.classList.add('error');
                // tslint:disable-next-line: max-line-length
                this.ErrorMsg = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
                document.getElementById('txtnotional')!.focus();
            } else {
                document.getElementById('txtnotional')!.classList.remove('error');
            }
        }
        if (!(this.Notional + '').includes(',')) {
            this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        //changed by Suvarna P || 27Jun23 || optimised for blotter issue || added functions for this
        //START : changes done as per common data instead of API data for underlying Pranav D 20-Jun-2023
        // this.copySTUnderlyingRefRateArr = [];
        // this.STUderlyingRefRateArr.forEach((res: any) => {
        //     if (res.Data_Value.includes(this.ddlNoteCcy.trim())) {
        //         this.copySTUnderlyingRefRateArr.push(res);
        //     }
        // });
        // this.underlyingRef = this.copySTUnderlyingRefRateArr[0].Data_Value;
        // this.filterRefArr();
        await this.populateRef1IndexArr();
        await this.populateRef2IndexArr();

        //  
        //  
        //END : changes done as per common data instead of API data for underlying Pranav D 20-Jun-2023
    } catch (error) {

    }
    return false;
}
        //changed by Suvarna P || 27Jun23 || optimised for blotter issue || added functions 
populateRef1IndexArr(){
    this.copySTUnderlyingRefRateArr = [];
    this.STUderlyingRefRateArr.forEach((res: any) => {
        if (res.Data_Value.includes(this.ddlNoteCcy.trim())) {
            this.copySTUnderlyingRefRateArr.push(res);
        }
    });
    this.underlyingRef = this.copySTUnderlyingRefRateArr[0].Data_Value;
}
populateRef2IndexArr(){
    this.filterRefArr();
}

    async validationOnButton() {
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

        if (this.SolveForvalue !== 'IBPrice' && this.format !== 'Swap' && this.format !== 'Option') {
            const resMsg = await this.apifunctions.reofferValidation(this.issuePrice, this.IBPrice, 'EQ', this.format);
            if (resMsg !== '') {
                this.ErrorMsg = resMsg;
                document.getElementById('txtIBPrice')!.classList.add('error');
            }
        }

        if (this.Leverage == '' || (parseFloat(this.Leverage) > 1000 || parseFloat(this.Leverage) < 50)) {
            if (this.SolveForvalue !== 'Leverage') {
                this.ErrorMsg = 'Leverage should be between ' + '50' + '% and ' + '1000' + '%.';
                document.getElementById('txtLeverage')!.classList.add('error');
                return false;
            } else {
                this.ErrorMsg = '';
            }

        }


        //BBVAEPCLI- 645| Removed this.cap == ''|  No need to check cap == '' | Invalid check | if cap = '' error message shown was for Floor | Removed by Anubhav Goyal | 18-Jul-2023 
        if (this.floor === '' || parseFloat(this.floor) < parseFloat(this.RatesFloorLimit[0]) || parseFloat(this.floor) > parseFloat(this.RatesFloorLimit[1])) {
            this.ErrorMsg = 'Floor (%) should be between ' + this.RatesFloorLimit[0] + '% and ' + this.RatesFloorLimit[1] + '%.';
            document.getElementById('txtFloor')!.classList.add('error');
            return false;
        } else if (parseFloat(this.cap) < parseFloat(this.RatesCapLimit[0]) || parseFloat(this.cap) > parseFloat(this.RatesCapLimit[1])) {
            this.ErrorMsg = 'Cap (%) should be between ' + this.RatesCapLimit[0] + '% and ' + this.RatesCapLimit[1] + '%.';
            document.getElementById('txtCap')!.classList.add('error');
            return false;
        } else if (parseFloat(this.cap) <= 20 && (parseFloat(this.cap) < (parseFloat(this.floor) + 2))) {
            this.ErrorMsg = 'Cap must be between ' + (parseFloat(this.floor) + 2) + '% ' + 'and ' + this.RatesCapLimit[1] + '%';
            document.getElementById('txtCap')!.classList.add('error');
            document.getElementById('txtFloor')!.classList.add('error');
            return false;

        }

        if (this.initialFixedRateYN =='Y' && (this.initialFixedRate === '' || parseFloat(this.initialFixedRate) < parseInt(this.RatesInitialFixedRateLimit[0]) || parseFloat(this.initialFixedRate) > parseInt(this.RatesInitialFixedRateLimit[1]))) {
            if (this.SolveForvalue !== 'InitialFixedRate') {
                this.ErrorMsg = 'Initial fixed rate should be between ' + this.RatesInitialFixedRateLimit[0] + '% and ' + this.RatesInitialFixedRateLimit[1] + '%.';
                document.getElementById('txtInitialFixedRate')!.classList.add('error');
                return false;
            }
            else {
                this.ErrorMsg = '';

            }
        }

    } catch (error) {

    }
    return false;
}

setPrevQuoteData1(cloneData: any, viewOnly: any) {
    try {
        this.buttonList = cloneData.Actions[0];
        this.ddlNoteCcy = cloneData.InputSettlementCurrency[0];
  // added by Suvarna || 27Jun23 || steepener blooter issue
        this.currencyChange();
        this.format = cloneData.InputProductFormatType[0];
        this.SolveForvalue = cloneData.InputRFQSolveFor[0];
        this.orderID = cloneData.BBVAID[0];
        this.orderStatus = cloneData.Status[0];

        this.populateRef1IndexArr();
        this.underlyingRef = cloneData.UnderlyingReferenceRate[0];
        this.populateRef2IndexArr();
        this.underlyingRef2 = cloneData.UnderlyingReferenceRate2[0];
        
        this.ddlNoteCcy = cloneData.InputSettlementCurrency[0];
        this.format = cloneData.InputProductFormatType[0];
        this.fixing = cloneData.InputFixing[0];
        this.maturity = cloneData.InputMaturity[0];
        this.frequency = cloneData.MaturityFrequency[0];
        this.changeDatesFrequencyArr(this.maturity);
        this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
        //this.changeddlFixedRatePeriod(this.maturity);
        this.cpnBasis = cloneData.InputCouponDayBasis[0];
        this.Notional = cloneData.ComputedRFQNotionalText[0];
        this.IBPrice = cloneData.InputInterBankPrice[0];
        this.issuePrice = cloneData.InputIssuePricePercent[0];
        this.Leverage = cloneData.InputLeverage[0];
        if (cloneData.InputInitialFixedCoupon[0] === 'Long') {
            this.firstCpnYN = 'Y';
        } else {
            this.firstCpnYN = 'N';
        }
        this.initialFixedRate = cloneData.InputInitialFixedRate[0];
        this.endOfFixedRatePrd = cloneData.InputEndFixedRatePeriod[0];
        this.Leverage = cloneData.InputLeverage[0];
        this.cap = cloneData.InputCap[0];
        //Start: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
           
        if(this.cap == ''){
            this.capToggleYN = 'N'
        }else{
            this.capToggleYN = 'Y'
        }
        //END: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
        this.floor = cloneData.InputFloor[0];

        //Added by Anubhav Goyal | 23-Jun-2023 
        this.fundType = cloneData.StaticFundingType[0];
        this.fundFreq = cloneData.StaticFundingFrequency[0];
        this.fundRate = cloneData.InputFundingRateSpread[0];
        this.initialFixedRateYN = cloneData.InitialFixedRateYN[0];
        this.Notional = this.commonfunctions.formatNotional(cloneData.ComputedRFQNotionalText[0]); //RadhaM ||30-06-23|| When deal is opened from saved request the notional doesnt have commas

        if (viewOnly) {
            this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
            this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
            if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
                if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product) > -1) {
                    this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].CPM_Format).toString().split(',');
                    this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].ActiveYN;
                }
            }

            this.rfqID = cloneData.RFQID[0];
            this.NoteMasterID = cloneData.Note_Master_Id[0];
            this.sortedAllPrices = [{

                Price: (cloneData.SolveForValue === undefined || cloneData.SolveForValue[0] === undefined || cloneData.SolveForValue[0] === '' || cloneData.SolveForValue[0] === '0')
                    ? 'Rejected' : cloneData.SolveForValue[0],
                solveFor: cloneData.InputRFQSolveFor[0],
                Price1: (cloneData.SolveForValue2 === undefined || cloneData.SolveForValue2[0] === undefined || cloneData.SolveForValue2[0] === '' || cloneData.SolveForValue2[0] === '0')
                    ? 'Rejected' : cloneData.SolveForValue2[0],
                QueueStatus: cloneData.QueueStatus[0]
            }];

            switch (cloneData.InputRFQSolveFor[0]) {
// changes by Suvarna P || 20Jun23 || Rates solve for Changes
                case 'IBPrice':
                    this.IBPrice = cloneData.SolveForValue[0];
                    this.replySolveFor = 'Price';
                    break;
                case 'Leverage':
                    this.Leverage = cloneData.SolveForValue[0];
                    this.replySolveFor = 'Leverage';
                    break;
                case 'InitialFixedRate':
                    this.initialFixedRate = cloneData.SolveForValue[0];
                    this.replySolveFor = 'Initial Fixed Rate';
                    break;


            }
        }

    } catch (error) {

    }
}
// START : Changes done by Pranav D 22-Jun-2023 to display data from Saved Quotes to single Pricer
setSaveQuoteData(cloneData: any, viewOnly: any) {
    try {
        this.onBehalfOf = cloneData.onBehalfOf;
        this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
            if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product) > -1) {
                this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].CPM_Format).toString().split(',');
                this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].ActiveYN;
            }
        }
      

        this.onBehalfOf = cloneData.onBehalfOf;
        this.ddlNoteCcy = cloneData.Ccy;
  // Suvarna P || 27Jun23 || steepenet blotters issue
        this.populateRef1IndexArr();
        this.underlyingRef = cloneData.UnderlyingCode1;
        this.populateRef2IndexArr();
        this.underlyingRef2 = cloneData.UnderlyingCode2;
        // this.currencyChange();

        this.format = cloneData.FormatDetails;
        this.SolveForvalue = cloneData.SolveFor;
       
        //this.Notional = cloneData.Size;
        this.Notional = this.commonfunctions.formatNotional(cloneData.Size); //RadhaM ||30-06-23 || When deal is opened from saved request the notional doesnt have commas
        this.IBPrice = cloneData.IBPrice;
        this.issuePrice = cloneData.IssuePrice;
        this.fundType = cloneData.FundingType;
        this.fundFreq = cloneData.FundingFrequency;
        // this.fundRate = cloneData.;  tag missing for now 
        // Changed position to setFirstCpn after changeEndOfFixedRatePeriod | Anubhav Goyal | 31-Jul-2023 | BBVACLI-1206
        //this.firstCpnYN = cloneData.FirstLongCoupon === 'Long' ? 'Y' : 'N';
        // this.Leverage = cloneData.; tag missing for now
        this.cap = cloneData.CapPercent;
        //Start: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
           
        if(this.cap == ''){
            this.capToggleYN = 'N'
        }else{
            this.capToggleYN = 'Y'
        }
        //END: BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
         
        this.floor = cloneData.FloorPercent;
        this.initialFixedRateYN = cloneData.InitialFixedRateYN;
        this.initialFixedRate = cloneData.InitialFixedRate;
        this.cpnBasis = cloneData.CouponBasis;
        this.fixing = cloneData.Fixing;
        this.frequency = cloneData.Frequency;
        this.Leverage = cloneData.Leverage;
        this.maturity = cloneData.InputMaturity;
        this.changeDatesFrequencyArr(this.maturity);
        this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
        // Changed position to setFirstCpn after changeEndOfFixedRatePeriod | Anubhav Goyal | 31-Jul-2023 | BBVACLI-1206
        this.firstCpnYN = cloneData.FirstLongCoupon === 'Long' ? 'Y' : 'N';
        this.setFirstCpn();// To set cpnFirst value | 31-Jul-2023 | Anubhav Goyal | BBVACLI-1206
        this.endOfFixedRatePrd = cloneData.EndFixedRatePeriod;
         this.fundRate = cloneData.IndexRateSpread;

        if (viewOnly) {

            this.rfqID = cloneData.RFQID;
        } else {
// changes by Suvarna P || 20Jun23 || Rates solve for Changes
            switch (this.SolveForvalue) {
                case 'IBPrice':
                    this.IBPrice = '';
                    
                    break;
                case 'Leverage':
                    this.Leverage = '';
                    
                    break;
                case 'InitialFixedRate':
                    this.initialFixedRate = '';
                    break;
            }
        }

    } catch (error) {

    }
}
// END : Changes done by Pranav D 22-Jun-2023 to display data from Saved Quotes to single Pricer
// unnecessary code removed by Pranav D 23-Jun-2023





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

setFocus() {
    this.namefield.nativeElement.focus();
}


cloneSinglePricer() {
    this.viewOnly = false;
    this.buttonList = 'Clone,View,';
    this.reset();
    this.setDefaultDates();
    this.infoMsg = '';
}

setDefaultDates() {
    return true;


}
// GetTriggerValue(type: any) {
//     return;

//     if (type === 'cpnTrigger') {
//         // this.TriggerValueArr = this.apifunctions.GetTriggerValues(this.expshift, this.cpnFreq,
//         //     this.cpnTrigger, '', '', '', '', '', '');
//         // //  
//         // this.autoTriggerPopup = false;
//         // this.cpnTriggerPopup = true;
//         // this.fundRatePopup = false;
//     }
//     if (type === 'fundRate') {
//         // this.TriggerValueArr = this.apifunctions.GetTriggerValues(this.expshift, this.fundFreq,
//         //     this.fundRate, '', '', '', '', '', '');
//         // //  
//         // this.autoTriggerPopup = false;
//         // this.cpnTriggerPopup = false;
//         // this.fundRatePopup = true;
//     }
// }
onClickedOutside(type: any) {
    if (type === 'cpnTrigger') {
        // this.cpnTriggerPopup = false;

    }
    if (type === 'fundRate') {
        this.fundRatePopup = false;
    }
}


priceOptions() {
    try {
        this.priceoptionflag = !this.priceoptionflag;
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
// showSchedulePopup() {
//     try {
//         this.ErrorMsg = '';
//         this.infoMsg = '';
//         this.scheduleMsg = '';
//         this.validationOnButton();
//         if (this.ErrorMsg === '') {
//             this.showSchedulePopupFlag = !this.showSchedulePopupFlag;
//             this.today();
//             if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
//                 this.scheduleFreq = this.scheduleFreqArr[0].misc1;
//             }


//             if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
//                 this.scheduleType = this.scheduleTypeArr[0].misc1;
//             }
//             this.scheduleTypeChange();
//         }
//     } catch (error) {

//     }
//     return false;
// }
hideSchedulePopup() {
    try {
        this.showSchedulePopupFlag = false;
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
            this.currentowner = (this.commonfunctions.getLoggedInUserName());
        }
    } catch (error) {

    }
    return false;
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
    async onBehalfOfChange() {
    this.mappedformatlist = [];
    this.priceBtnActive = 'N';
    this.GetClientProdDetailsArr = await this.apifunctions.GetClientProdDetails(this.onBehalfOf);
    if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr?.length > 0) {
        if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product) > -1) {
            this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].CPM_Format).toString().split(',');
            this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].ActiveYN;
            //  

            if (this.mappedformatlist !== undefined && this.mappedformatlist.length > 0) {
                if (this.mappedformatlist.findIndex((obj: any) => obj === 'Note') > -1) {
                    this.format = 'Note';
                } else {
                    this.format = this.mappedformatlist[0];
                }
                this.formatChange();
            }
        }
    }
    else{
        this.mappedformatlist = ['Note', 'Swap'];
    }
}

// save share user changes

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

selectUser(e: any) {
    try {
        this.userflag = false;
        // if ($('.HoverSuggestion').data('share') !== undefined) {
        if ($('.HoverSuggestion').data('user') !== undefined) {
            this.userCode = $('.HoverSuggestion').data('user');
        }
        // if (this.userCode !== undefined && this.userCode !== '') {
        //     this.showUser(e, SearchUserGroupPipe.prototype.transform(this.users, this.userCode)[0]);
        // }
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

scheduleSend() {
    try {
        this.scheduleMsg = '';
        this.infoMsg = '';
        this.ErrorMsg = '';
        if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
            this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
            $('#loading').hide();
            return false;
        } else {
            this.ErrorMsg = '';
        }
        this.validationOnButton();
        const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.inputTime));
        const today = new Date();

        if (sDate < today) {
            this.ErrorMsg = 'Please enter valid time';
            return false;
        }
        const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
        if (this.ErrorMsg === '') {
            this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
            if (isNaN(this.portfolioGroupID)) {
                this.ErrorMsg = "Price request failed. Please reload the application and try again.";
                return false;
            }
            const xmlstr = this.generateXML();
            // const res = this.apifunctions.SchedulePrice(this.Product, xmlstr,
            //     sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue,
            //     this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,
            //     this.Product, this.scheduleFreq, this.scheduleType, this.Exchange());
            // if (res) {
            //     if (res['IsScheduled']) {
            //         this.scheduleMsg = 'Request scheduled successfully. Req ID: ' + res['PS_ID'];
            //     }
            // }
        }
    } catch (error) {

    }
    return false;
}

scheduleTypeChange() {
    if (this.scheduleType === 'One-Off') {
        this.scheduleFreq = '';
    } else {
        this.scheduleFreq = 'Monthly';
    }

}
LeveragetoggleYN() {

    if (this.leverageYN === 'Y') {
        this.leverageYN = 'N'
    }
    else {
        this.leverageYN = 'Y'
    }
}


moveUpSelection1(e: any, selectedIndex: any) {
    try {
        if (selectedIndex !== undefined) {
            if (selectedIndex > 0) {
                selectedIndex--;
            }
            if ($('.SelectorBox').length > 0) {
                this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
                return selectedIndex;
            } else {
                return 0;
            }

        }
    } catch (error) {

    }
}

moveDownSelection1(e: any, selectedIndex: any) {
    try {
        if ($('.SelectorBox').length > 0) {
            if (selectedIndex < $('.SelectorBox')[0].childElementCount - 1) {
                selectedIndex++;
            }
            if ($('.SelectorBox')[0].childElementCount > selectedIndex) {
                this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
                return selectedIndex;
            }
        } else {
            return 0;
        }
    } catch (error) {

    }
}
ScrollTo(container: any, element: any, direction: any) {
    try {
        const $container = $(container);
        const $scrollTo = $(element);
        switch (direction) {
            case 'up':
                $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 10);
                break;
            case 'down':
                $container.animate({
                    scrollTop: $scrollTo.offset().top - $container.offset().top
                        + $container.scrollTop() - 100, scrollLeft: 0
                }, 10);
                break;
            default:
                break;
        }
    } catch (error) {

    }
}



hideProductPopup() {
    this.ErrorMsg = ""
    this.ProductWatchlist = false;

}

setFirstCpn() {
    try {
        if (this.firstCpnYN === 'Y') {
            this.cpnFirst = 'Long';
        } else {
            this.cpnFirst = 'Short';
        }
    } catch (error) {
    }
}
// Reset function remved as not required for toggle change Pranav D 
toggeleOnOff() {
    
}



customeFilter(inputArr: any) {
    let min = inputArr[0];
    for (let i = 0; i < inputArr.length - 1; i++) {
        for (let j = i + 1; j < inputArr.length; j++) {
            if (parseInt(inputArr[i].Code.slice(-3, -1)) > parseInt(inputArr[j].Code.slice(-3, -1))) {
                min = inputArr[j];
                inputArr[j] = inputArr[i];
                inputArr[i] = min;
            }
        }
    }
    // inputArr.filter((ele: any) => {
    //     ele.Code.includes(this.ddlNoteCcy.trim());
    // });

    return inputArr;
}


//Start : Anubhav Goyal | 15-Jun-2023 | BBVAEPCLI-594 Rates: Additional enhancements
InitialFixedRateToggle() {

    if (this.initialFixedRateYN == 'N') {
        if(this.SolveForvalue == "InitialFixedRate"){
            this.SolveForvalue = "IBPrice";
        }
        this.initialFixedRate = '';
        this.firstCpnYN = '';
        this.cpnFirst = '';
        this.endOfFixedRatePrd = ''
    } else if (this.initialFixedRateYN == 'Y') {
        this.initialFixedRate = parseFloat('2').toFixed(2);
        this.firstCpnYN = 'N';
        this.cpnFirst = 'Short';
        //this.changeddlFixedRatePeriod(this.maturity);
        this.changeDatesFrequencyArr(this.maturity);
        this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
        this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1;


}


}

//START : Added by Anubhav Goyal | 26-Jun-2023 | EPCLI - 594
changeDatesFrequencyArr(maturity: any) {
    
    try {
        var maturityInMonths = 12 * maturity.slice(0, -1);
        this.copyFrequencyArr = [];
        this.FrequencyArr.forEach((ele: any) => {

            if (parseFloat(ele.Data_Value.slice(0, -1)) <= (maturityInMonths)) {
                this.copyFrequencyArr.push(ele);
            }

        })
  // Added Equal sign | Anubhav Goyal | 03-Jul-2023
        if (parseFloat(this.frequency.slice(0, -1)) == 12 && parseFloat(maturity.slice(0, -1)) >= 1) {
            this.changeEndOfFixedRatePeriod(this.maturity, this.frequency);
        } else {
            this.changeEndOfFixedRatePeriod(this.maturity,'1m');
        }
        // Added by Anubhav Goyal | 24-Aug-2023 | BBVACLI- 1248 When frequency is 12m and maturity is changed to 0.5Y then change frequency to 1m.
        if(parseFloat(this.frequency.slice(0, -1)) == 12 && parseFloat(maturity.slice(0, -1)) == 0.5){
            this.frequency = '1m';
        }
       

    } catch (error) {

    }
}


changeEndOfFixedRatePeriod(maturity: any, frequency: any) {
    try {

        var freq = frequency.slice(0, -1) / 12;
        this.copyEndFixedRatePeriod = [];
        this.MaturityArr.forEach((ele: any) => {
//Added by Anubhav Goyal | 20-Jun-2023
            if (parseFloat(ele.Data_Value.slice(0, -1)) < parseFloat(maturity.slice(0, -1)) && (parseFloat(ele.Data_Value.slice(0, -1)) >= freq)) {
                this.copyEndFixedRatePeriod.push(ele);
            }

        })
        // Added by Anubhav Goyal | 03-Jul-2023 | Toggle change if Initial Fixed Rate Dropdown is blank

        if (this.initialFixedRateYN == 'Y') {

            if (this.copyEndFixedRatePeriod.length <= 0) {

                this.initialFixedRateYN = 'N';
                this.SolveForvalue = 'IBPrice'; // Added by Anubhav Goyal | 31-Jul-2023 | Toggle change if Initial Fixed Rate Dropdown is blank change Solvefor to Price | BBVACLI-1205
                this.IBPrice = ''; // Added by Anubhav Goyal | 31-Jul-2023 | IBPrice to be blank | BBVACLI-1205
                this.initialFixedRate = '';
                this.firstCpnYN = '';
                this.cpnFirst = '';
                this.endOfFixedRatePrd = ''

            } else {

                //Added by Anubhav Goyal | 05-Jul-2023
                if(this.initialFixedRate == ''){
                    this.initialFixedRate = parseFloat('2').toFixed(2);
                }
                
                this.firstCpnYN = 'N';
                this.cpnFirst = 'Short';
            }
        }

        // Added by Anubhav Goyal | 03-Jul-2023 | If maturity ends with .5 and freq is 12 Only show First Coupon
        if (this.maturity.includes('.5') && this.frequency.slice(0,-1) == '12') {
            this.flagFixedRate = true;
        } else {
            this.flagFixedRate = false;
        }
        //Added by Anubhav Goyal | 03-Jul-2023 | If flag is true, i.e selected end of fixed rate is present in dropdown. 
        var flag = false;
        this.copyEndFixedRatePeriod.forEach((ele: any) => {
            if (ele.misc1 == this.endOfFixedRatePrd) {
                this.endOfFixedRatePrd = ele.misc1;
                flag = true
            }
        })
        //Added by Anubhav Goyal | 24-Aug-2023 | BBVACLI- 1248 Check copyEndFixedRatePeriod length
        // if (flag == false) {
        //     this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1;
        // }
        if (flag == false && this.copyEndFixedRatePeriod.length>0) {
            this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1;
        }

        //Added by Anubhav Goyal | 05-Jul-2023
        if(this.SolveForvalue == 'InitialFixedRate'){
            this.initialFixedRate = '';
        }
        // if(this.endOfFixedRatePrd){

        // }else{
        //     this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1 // added by Suvarna P || 27Jun23 || blotter view,Clone issue
        // }

        //START: Added by Anubhav Goyal | 04-Sep-2023 | BBVAEPCLI-694 - End of fixed rate period should be multiple of 1Y

        if (this.frequency.slice(0, -1) === '12') {
            var fixedRateArr = this.copyEndFixedRatePeriod;
            this.copyEndFixedRatePeriod = []
            for (let i = 0; i < fixedRateArr.length; i++) {
                if (fixedRateArr[i].Data_Value.includes('.5')) {
                    continue;
                }else{
                    this.copyEndFixedRatePeriod.push(fixedRateArr[i]);
                }
            }

            if(maturity.slice(0, -1).includes('.5')){
                this.endOfFixedRatePrd = this.copyEndFixedRatePeriod[0].misc1;
            }
        }

        //END: Added by Anubhav Goyal | 04-09-2023 | BBVAEPCLI-694 - End of fixed rate period should be multiple of 1Y
    } catch (error) {

    }
}


 //END : Added by Anubhav Goyal | 26-Jun-2023 | EPCLI - 594


// START : Pranav D 20-Jun-2023 underlyingref2 changes as per changed data, first data was coming from API now from Common data
filterRefArr() {
    try {
        this.FilteredUnderlyingRefArr = [];
       
        
        this.copySTUnderlyingRefRateArr.forEach((res: any) => {
            if (res.Data_Value === this.underlyingRef) {
                // commented AND ADDED BY sUVARNA || 27jUN23 || NOT REQUIRED JUST SPLIT IS OK
                //  
                // if (res.misc1.includes(',')) {
                //     let sampleArr = res.misc1.split(',');
                //     sampleArr.forEach((res: any) => {
                //         this.FilteredUnderlyingRefArr.push(res);
                //     });
                // } else {
                //     this.FilteredUnderlyingRefArr.push(res.misc1);
                // }

                this.FilteredUnderlyingRefArr = res.Misc1.split(',');
                
                  // added by Suvarna P || 07Jul23 || trim element of array
                  this.FilteredUnderlyingRefArr  = this.FilteredUnderlyingRefArr.map(element => {
                    return element.trim();
                  });


            }
        });
        //  
        this.underlyingRef2 = this.FilteredUnderlyingRefArr[0];
    } catch (error) {

    }
}
    // END : Pranav D 20-Jun-2023 underlyingref2 changes as per changed data, first data was coming from API now from Common data

//Start: Added function to change cap value on toggle | BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.
ToggleCap() {
    try {

        if (this.capToggleYN == 'N') {
            this.cap = '';

        } else if (this.capToggleYN == 'Y') {
            this.cap = parseFloat('5').toFixed(2);

        }

    } catch (error) {

    }
}
//END: Added function to change cap value on toggle | BBVAEPCLI-645 Remove need for Cap in steepener | Anubhav Goyal | 18-Jul-2023 | Yes/No toggle to be added and then CAP will be mandatory when Yes is selected.

filterRefIndexInAscendingOrder(inputArr: any) {
    let min = inputArr[0];
    for (let i = 0; i < inputArr.length - 1; i++) {
      for (let j = i + 1; j < inputArr.length; j++) {
        if (parseFloat(inputArr[i].LongName.slice(-3).slice(0, -1)) > parseFloat(inputArr[j].LongName.slice(-3).slice(0, -1))) {
          min = inputArr[j];
          inputArr[j] = inputArr[i];
          inputArr[i] = min;
        }
      }
    }
    return inputArr;
  }
  filterArrInAscendingOrder(inputArr: any) {
    try {
      let min = inputArr[0];
      for (let i = 0; i < inputArr.length - 1; i++) {
        for (let j = i + 1; j < inputArr.length; j++) {
          if (parseFloat(inputArr[i].Data_Value.slice(0, -1)) > parseFloat(inputArr[j].Data_Value.slice(0, -1))) {
            min = inputArr[j];
            inputArr[j] = inputArr[i];
            inputArr[i] = min;
          }
        }
      }
      return inputArr;
    } catch (error) {

    }
  }

  

  startCountDown(sec, index) {
    let starttime = new Date().getTime();
    let counter = sec;
    this.priceProvidersArr[index].timeStartFlag = true;
    this.priceProvidersArr[index].interval1 = setInterval(() => {
      if (this.priceProvidersArr[index].price != '-') {
        this.priceProvidersArr[index].timer = counter;
        counter--;
      }
      if (counter < 0) {
        clearInterval(this.priceProvidersArr[index].interval1);
        this.priceProvidersArr[index].timeStartFlag = false;
      }
      if (this.timeLeft <= 0 && this.priceProvidersArr[index].price == '-') {
        this.loadflag = false;
        if (this.priceProvidersArr[index].price == '-') {
          this.priceProvidersArr[index].price = 'Timeout';
        }
        this.priceBtnActive = 'Y'
        this.priceProvidersArr[index].loadFlag = false
        clearInterval(this.priceProvidersArr[index].interval1);
      }
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
          this.priceProvidersArr[index].timer = 0;
          this.priceProvidersArr[index].loadFlag = false
          clearInterval(this.priceProvidersArr[index].interval1);
        }
      }
    }, 1000);
  }

  chngPriceChkBox(i) {
    this.priceProvidersArr[i].priceChkFlg = !this.priceProvidersArr[i].priceChkFlg
  }


}
