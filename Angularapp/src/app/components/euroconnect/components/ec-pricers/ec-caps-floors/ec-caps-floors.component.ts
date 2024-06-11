import { Component, DebugElement, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { DatePipe } from '@angular/common';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ec-caps-floors',
  templateUrl: './ec-caps-floors.component.html',
  styleUrls: ['./ec-caps-floors.component.scss']
})
export class EcCapsFloorsComponent implements OnInit {

  viewOnly = false;
  activeTab: any = 'Pricing';
  @Output() dateSelected: EventEmitter<Moment> = new EventEmitter();
  @Output() selectedDate = moment();
  @Input() sendtocptyflag: any;

  @ViewChild('calendar', { static: true }) calendar: MatCalendar<Moment> | undefined;
  @ViewChild('focusable', { static: false }) namefield!: ElementRef;

  onBehalfOf = '';
  ddlNoteCcy = 'USD';
  format = '';
  SolveForvalue = "IBPrice";
  Notional: any = '1,000,000';
  IBPrice = "99.50";
  issuePrice = "100.00";
  cpnBasis = 'Act/Act'
  cpnBasisArr: any = [];
  maturityfrequency: any;
  fundType: any;
  fundFreq: any;
  fundRate: any;
  timeoutMsg: string = "";
  reqSuccessMsg: string = "";
  selectedBIndex = 0;
  showSuggestions = false;
  flag: boolean = false;
  shares: any;
  ShareName: string = "";
  shareCode: any;
  selectedShareIndex = 0;
  ShareBasket: any = [];
  settdate: any = '';
  stkdate: any = '';
  expdate: any = "";
  UnderlyingCurrency = 'EUR';
  CCY: any = [];
  ReceivedCCY: any;
  CFUderlyingRefRateArr: any = [];
  ccyChange: any;
  Coupon: any;
  sortedAllPrices: any = [];
  AllPrices: any = [];
  Prices: any = [];
  product_code = 'RatesCapsFloors';
  Product = 'Rates - CapsFloors';
  cpnType: any;
  cpnCoupon: any;
  MemoryPeriods: any;
  cpnBarrier: any;
  productTypeArr: any = [];
  productType: any = "Non Callable";
  underlyingRefRate: any;
  firstCallableDate: any;
  firstCallableDateArr: any = [];
  callableFreq: any = "6m";
  callableFreqArr: any = [];
  callableCap: any;
  callableFloor: any;
  maturity: any = '3Y';
  maturityArr: any = [];
  cpyMaturityArr: any = [];
  frequency = '1M'
  frequencyArr: any = [];
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
  copyCFUderlyingRefRateArr: any = [];
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
  portfolioId: any;
  scheduledReqId: any;
  allBooksData: any = [];
  buttonList: any = '';
  portfolioGroupID: any = '';
  WatchID: any;
  TSTimeout = 120;
  TSInterval: any;
  TSFlag = false;
  CapsNFloorPriceSubscription: Subscription = new Subscription;
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
  copycallableFreqArr: any = [];
  copyfirstCallableDateArr: any = [];
  LeverageLimit: any = [];
  RatesFloorLimit: any = [];
  RatesInitialFixedRateLimit: any = [];
  RatesCapLimit: any = [];
  copyFrequencyArr: any = [];
  issueDate: string = '';
  issueDateArr: any = [];
  SaveandShareErrorMsg: any;
  interfaceUrl = environment.interfaceURL;
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


  constructor(public elem: ElementRef, public commonfunctions: EcCommonService, public apifunctions: EcHomeService, public datepipe: DatePipe, public http: HttpClient) {
    try {

    }
    catch (error) {

    }
  }

  ngOnDestroy(): void {
    this.pageActive = false;
    this.timeLeft = -1;
    this.timeoutMsg = '';

    clearInterval(this.interval);
    this.TSFlag = false;
    this.AllPrices = [];
    this.sortedAllPrices = [];
    this.commonfunctions.setCapsNFloorsReceivedPrices({}, '');
    if (this.CapsNFloorPriceSubscription) {
      this.CapsNFloorPriceSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    try {
      this.pageActive = true;
      this.pageloadflag = true;
      // $('#loading').show();
      setTimeout(async () => {
        // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
        //   this.allBooksData = await this.apifunctions.getAllBooksMappedToLogin();
        // }

        if (this.apifunctions.CCY === undefined || this.apifunctions.CCY.length <= 0) {
          this.ReceivedCCY = await this.apifunctions.BBVALoadCCY();
        }


        this.RatesFloorLimit = await this.apifunctions.GetCommonData('RatesFloor');
        this.RatesFloorLimit = this.RatesFloorLimit[0].Data_Value.split(', ');
        this.RatesCapLimit = await this.apifunctions.GetCommonData('RatesCap');
        this.RatesCapLimit = this.RatesCapLimit[0].Data_Value.split(', ');

        let CFUderlyingRefRateResArr = await this.apifunctions.BBVALoadSharesAssets('IR', 'CF');
        this.CFUderlyingRefRateArr = this.filterRefIndexInAscendingOrder(CFUderlyingRefRateResArr);

        if (this.CFUderlyingRefRateArr.length > 0) {
          this.copyCFUderlyingRefRateArr = [];
          if (this.ddlNoteCcy == 'EUR') {
            this.copyCFUderlyingRefRateArr = [];
            this.CFUderlyingRefRateArr.forEach((ele: any) => {
              if (ele.Code !== 'SOFR') {
                this.copyCFUderlyingRefRateArr.push(ele);
              }
            })

          } else if (this.ddlNoteCcy == 'USD') {
            this.copyCFUderlyingRefRateArr = this.CFUderlyingRefRateArr;
          }
          this.underlyingRefRate = 'EURIBOR6M';
        }

        if (this.apifunctions.validationArr === undefined || this.apifunctions.validationArr.length <= 0) {
          this.validationArr = await this.apifunctions.BBVAFetchValidation('EQ');
        }

        this.productTypeArr = await this.apifunctions.GetCommonData('Product_Type_CapsFloors');
        this.productType = 'Non Callable';
        let maturityArrRes = await this.apifunctions.GetCommonData('Maturity_Dates_CapsFloors');
        this.maturityArr = this.filterArrInAscendingOrder(maturityArrRes);

        this.maturity = this.maturityArr.length > 0 ? this.maturityArr[0].Data_Value : '';
        this.maturity = '3Y';


        let frequencyArrRes = await this.apifunctions.GetCommonData('Frequency_Dates_CapsFloors');
        this.frequencyArr = this.filterArrInAscendingOrder(frequencyArrRes);
        this.copyFrequencyArr = this.frequencyArr;
        this.frequency = '6m';

        this.cpnBasisArr = await this.apifunctions.GetCommonData('CouponBasis_CapsFloors');
        this.cpnBasis = '30/360';

        let issueDateArrRes = await this.apifunctions.GetCommonData('Offset_CapsFloors');
        this.issueDateArr = this.filterArrInAscendingOrder(issueDateArrRes);
        this.issueDate = '10B';

        let firstCallableDateArrRes = await this.apifunctions.GetCommonData('FirstCallableDate_CapsFloors');
        this.firstCallableDateArr = this.filterArrInAscendingOrder(firstCallableDateArrRes);
        if (this.productType === 'Non Callable') {
          this.firstCallableDate = '';
        } else {
          this.firstCallableDate = this.firstCallableDateArr.length > 0 ? this.firstCallableDateArr[0].Data_Value : '';
        }

        this.callableFreqArr = await this.apifunctions.GetCommonData('Frequency_Callability_CapsFloors');
        if (this.productType === 'Non Callable') {
          this.callableFreq = '';
        } else {
          this.callableFreq = this.callableFreqArr.length > 0 ? this.callableFreqArr[0].Data_Value : '';
        }
        this.onChangeRefIndex();

        this.scheduleFreqArr = await this.apifunctions.GetCommonData('PricerScheduleFrequency');
        if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
          this.scheduleFreq = this.scheduleFreqArr[0].misc1;
        }


        this.scheduleTypeArr = await this.apifunctions.GetCommonData('PricerScheduleType');
        if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
          this.scheduleType = this.scheduleTypeArr[0].misc1;
        }

        this.scheduleTypeChange();
        this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');   // RiddhiP || 13june23 ||  BBVAEPCLI-579 || Rates: Caps & Floors Blotter UI

        this.reset();
        this.portfolioId = '';
        this.scheduledReqId = '';
        await this.fnGetProdTemplate();
        this.fnGetValidation();
        this.allBooksData = this.apifunctions.allBooksData;
        this.allBooksData = [
          {
            BookCode: 'FinIQ Consulting Pvt Ltd',
            BookName: 'FinIQ Consulting Pvt Ltd'
          },
          {
            BookCode: 'RBC',
            BookName: 'RBC'
          }
        ];
        if (this.allBooksData && this.allBooksData.length > 0) {
          this.onBehalfOf = this.allBooksData[0].BookCode;
          this.GetClientProdDetailsArr = await this.apifunctions.GetClientProdDetails(this.onBehalfOf);
          if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr?.length > 0) {
            if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product) > -1) {
              this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].CPM_Format).toString().split(',');
              this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].ActiveYN;
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
            if (element.Ccy !== 'JPY' && element.Ccy !== 'DCD' && (element.Ccy == 'EUR' || element.Ccy == 'USD')) {
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

        await this.formatChange();
        this.setDefaultSolveForValues();
        const that = this;


        this.CapsNFloorPriceSubscription = this.commonfunctions.CapsNFloorSignalRPrices.subscribe(res => {
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
                case 'Cap':
                  that.callableCap = price;
                  that.replySolveFor = 'Cap';
                  break;
                case 'Floor':
                  that.callableFloor = price;
                  that.replySolveFor = 'Floor';
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
        this.pageloadflag = false;
        // $('#loading').hide();

      });
    } catch (error) {

    }
  }


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

  onChangeRefIndex() {
    try {
      this.populateDatesFequency();
      this.populateMaturity();
      this.populateFirstCallableDate();
      this.populateCallableFrequency();
      if (this.frequency.toUpperCase() === '12M' && this.maturity.toString().toUpperCase().includes('.5Y')) {
        this.maturity = '2Y';
      }
    }
    catch (error) {

    }
  }

  populateDatesFequency() {
    var frequency = '';
    if (this.underlyingRefRate.toUpperCase() == "SOFR") {
      this.copyFrequencyArr = this.frequencyArr;
      return;
    }
    this.CFUderlyingRefRateArr.forEach((ele: any) => {
      if (ele.Code == this.underlyingRefRate) {
        frequency = (ele.LongName.slice(-3)).toLowerCase().trim();
        this.copyFrequencyArr = this.frequencyArr.filter((freq: { Data_Value: string; }) => freq.Data_Value.toUpperCase() === frequency.toUpperCase());
        this.frequency = frequency;
      }
    });
  }

  populateMaturity() {
    this.cpyMaturityArr = [];
    var freqInMonth = parseFloat(this.frequency.slice(0, -1))
    if (this.underlyingRefRate.toUpperCase() == "SOFR") {
      this.cpyMaturityArr = this.maturityArr.filter((maturityEle: any) =>
        freqInMonth <= (12 * maturityEle.Data_Value.slice(0, -1))

      )
    } else {
      this.cpyMaturityArr = this.maturityArr.filter((maturityEle: any) =>
        freqInMonth < (12 * maturityEle.Data_Value.slice(0, -1))
      )
    }
    var idx = this.cpyMaturityArr.findIndex((item: { Data_Value: string; }) => item.Data_Value.toUpperCase() === this.maturity.toUpperCase())
    if (idx === -1) {
      this.maturity = this.cpyMaturityArr[0].Data_Value;
    }
  }

  populateFirstCallableDate() {
    try {
      this.copyfirstCallableDateArr = [];
      var freqInMonth = parseFloat(this.frequency.slice(0, -1));
      var maturityInMonths = 12 * this.maturity.slice(0, -1);
      for (let i = 0; i < this.firstCallableDateArr.length; i++) {
        var FirstCallableDateEleMonth = 12 * parseFloat(this.firstCallableDateArr[i].Data_Value.slice(0, -1))
        if (FirstCallableDateEleMonth < maturityInMonths && FirstCallableDateEleMonth >= freqInMonth) {
          this.copyfirstCallableDateArr.push(this.firstCallableDateArr[i]);
        }
      }
      if (this.productType == 'Callable') {
        if (this.copyfirstCallableDateArr.length <= 0) {
          this.productType = 'Non Callable';
        } else if (this.copyfirstCallableDateArr.length > 0) {
          this.productType = 'Callable';
        }
        this.firstCallableDate = this.copyfirstCallableDateArr[0].Data_Value;
      } else {
        this.copyfirstCallableDateArr = [];
        this.firstCallableDate = '';
        this.callableFreq = ''
      }
    } catch (error) {

    }

  }

  populateCallableFrequency() {
    try {
      this.copycallableFreqArr = [];
      this.callableFreqArr.forEach((ele: any) => {
        if (parseFloat(ele.Data_Value.slice(0, -1)) >= parseFloat(this.frequency.slice(0, -1))) {
          this.copycallableFreqArr.push(ele);
        }
      });
      if (this.productType === 'Non Callable') {
        this.callableFreq = '';
      }
      else {
        this.callableFreq = this.frequency;
      }
    } catch (error) {

    }
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
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = '';
      }
      if (this.SolveForvalue === 'Cap') {
        this.callableCap = '';
      }
      if (this.SolveForvalue === 'Floor') {
        this.callableFloor = '';
      }
      if (document.getElementById('txtIBPrice')) {
        document.getElementById('txtIBPrice')!.classList.remove('reply');
      }
      if (document.getElementById('txtCap')) {
        document.getElementById('txtCap')!.classList.remove('reply');
      }
      if (document.getElementById('txtFloor')) {
        document.getElementById('txtFloor')!.classList.remove('reply');
      }

      this.commonfunctions.CapsNFloorPricesObserver.next('');
      this.commonfunctions.CapsNFloorPrices = [];
      this.commonfunctions.setCapsNFloorsReceivedPrices({}, '');
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

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      if (this.validationArr) {
        for (let i = 0; i < this.validationArr.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
            case 'Caps&FloorsResponseTimeout':
              this.defaultTimeout = this.validationArr[i].Default_Value;
              break;

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

  async formatChange() {
    try {
      this.reset();
      this.infoMsg = '';
      if (this.format === 'Swap') {
        if (this.SolveForvalue === 'IBPrice') {
          this.fundRate = '';
          this.fundFreq = '1m'
          this.fundType = 'Fixed Rate';
          this.IBPrice = '';
          this.issuePrice = '100.00';
          this.fundRate = '1.00';
        } else {
          this.fundRate = '1.00';
          this.fundType = 'Floating Rate';
          this.fundFreq = '3m';
          this.IBPrice = '99.50';
          this.issuePrice = '100.00';
        }
      } else {
        this.fundType = '';
        this.fundFreq = '';
        this.fundRate = '';
      }
      if (this.format === 'Bono J' || this.format === 'Warrant') {
        this.ddlNoteCcy = 'MXN';
        this.Notional = '10,000,000';
      }
      if (this.format === 'Swap') {
        this.ddlNoteCcy = 'EUR';
        await this.currencyChange();
      }
      if (this.format === 'Warrant') {
        this.ShareBasket = [];
        this.SelectedUnderlyingarray = [];
        this.SelectedUnderlyingBasketArray = [];
        this.SelectedUnderlyingBasket = {
          UnderlyingOne: {},
          UnderlyingTwo: {},
          UnderlyingThree: {},
          UnderlyingFour: {},
          UnderlyingFive: {},
        };
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
          this.IBPrice = '0.00';
          this.issuePrice = '';
        } else {
          this.issuePrice = '100.00';
        }
      }

    } catch (error) {

    }
    return false;
  }

  async currencyChange() {
    try {
      this.reset();
      this.infoMsg = '';
      this.copyCFUderlyingRefRateArr = [];
      if (this.ddlNoteCcy == 'EUR') {
        this.copyCFUderlyingRefRateArr = [];
        this.CFUderlyingRefRateArr.forEach((ele: any) => {
          if (ele.Code !== 'SOFR') {
            this.copyCFUderlyingRefRateArr.push(ele);
          }
        })
        this.productTypeArr = [];
        this.productTypeArr = await this.apifunctions.GetCommonData('Product_Type_CapsFloors');

      } else if (this.ddlNoteCcy == 'USD') {
        this.CFUderlyingRefRateArr.forEach((ele: any) => {
          if (ele.Code == 'SOFR') {
            this.copyCFUderlyingRefRateArr.push(ele);
          }
          this.frequency = '3m';
        })
        this.productTypeArr = [];
        const result = await this.apifunctions.GetCommonData('Product_Type_CapsFloors');
        result.forEach((ele: any) => {
          if (ele.Data_Value.toUpperCase() === 'NON CALLABLE') {
            this.productTypeArr.push(ele);

          }
        })
      }
      let flag = 0;
      this.productTypeArr.forEach((ele: any) => {
        if (ele.Data_Value.toUpperCase() === 'NON CALLABLE') {
          this.productType = ele.Data_Value;
          flag = 1;
        }
      })
      if (flag == 0) {
        this.productType = this.productTypeArr[0].Data_Value; // 'Non Callable';
      }
      this.firstCallableDate = '';
      this.callableFreq = '';
      this.underlyingRefRate = this.copyCFUderlyingRefRateArr[0].Code
      this.onChangeRefIndex();

      if (this.copyCFUderlyingRefRateArr.length > 0) {
        this.underlyingRefRate = this.copyCFUderlyingRefRateArr[0].Code;
      }
      if (this.ddlNoteCcy === 'MXN') {
        this.Notional = '10,000,000';
      }
      this.checkNotionalRes = await this.apifunctions.BBVACheckNotional(this.product_code, this.ddlNoteCcy);
      if ((this.Notional + '').includes(',')) {
        this.Notional = this.Notional.replace(/,/g, '');
      }
      if (this.checkNotionalRes !== undefined && this.checkNotionalRes.length > 0 && this.checkNotionalRes.length > 0) {
        if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
          || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
          document.getElementById('txtnotional')!.classList.add('error');
          this.ErrorMsg = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
          document.getElementById('txtnotional')!.focus();
        } else {
          document.getElementById('txtnotional')!.classList.remove('error');
        }
      }
      if (!(this.Notional + '').includes(',')) {
        this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

    } catch (error) {

    }
    return false;
  }

  setDefaultSolveForValues() {
    if (this.SolveForvalue === 'IBPrice') {
      this.IBPrice = ''
      this.callableCap = "4.00";
      this.callableFloor = "1.00";
    }
    if (this.SolveForvalue === 'Cap') {
      if (this.format === 'Swap' || this.format === 'Option') {
        this.IBPrice = '0.00';
      } else {
        this.IBPrice = '99.50';
      }
      this.callableCap = '';
      this.callableFloor = "1.00";
    }
    if (this.SolveForvalue === 'Floor') {
      if (this.format === 'Swap' || this.format === 'Option') {
        this.IBPrice = '0.00';
      } else {
        this.IBPrice = '99.50';
      }
      this.callableCap = "4.00";
      this.callableFloor = '';
    }

  }

  allowOptionFlg(optionVal: any) {
    if (this.frequency.toUpperCase() === '12M' && optionVal.toString().toUpperCase().includes('.5Y')) {
      return false;
    }
    else {
      return true;
    }
  }

  changecallablefrequency() {
    try {
      if (this.productType === 'Non Callable') {
        this.copycallableFreqArr = [];
        this.callableFreq = '';
        this.firstCallableDate = '';
      }
      else {
        this.populateCallableFrequency();
        this.populateFirstCallableDate();
      }
    } catch (error) {

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
          await this.CapsNFloorPrice('All', "0", 'N');
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
            this.CapsNFloorPrice(LP, "0", 'N');
          }
        }
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
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

      if (parseFloat(this.callableFloor) < parseFloat(this.RatesFloorLimit[0]) || parseFloat(this.callableFloor) > parseFloat(this.RatesFloorLimit[1])) {
        this.ErrorMsg = 'Floor (%) should be between ' + this.RatesFloorLimit[0] + '% and ' + this.RatesFloorLimit[1] + '%.';
        document.getElementById('txtFloor')!.classList.add('error');
        return false;
      } else if (this.callableCap.value === '' || parseFloat(this.callableCap) < parseFloat(this.RatesCapLimit[0]) || parseFloat(this.callableCap) > parseFloat(this.RatesCapLimit[1])) {
        this.ErrorMsg = 'Cap (%) should be between ' + this.RatesCapLimit[0] + '% and ' + this.RatesCapLimit[1] + '%.';
        document.getElementById('txtCap')!.classList.add('error');
        return false;
      } else if (parseFloat(this.callableCap) <= 20 && (parseFloat(this.callableCap) < (parseFloat(this.callableFloor) + 2))) {
        this.ErrorMsg = 'Cap must be between ' + (parseFloat(this.callableFloor) + 2) + '% ' + 'and ' + this.RatesCapLimit[1] + '%';
        document.getElementById('txtCap')!.classList.add('error');
        return false;
      }
    } catch (error) {

    }
  }

  async CapsNFloorPrice(LPVal, NMID, repriceFlg) {
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
                  quoteResponseCheck = await that.CapsNFloorPriceResponse(that.PPDetails);
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

  async CapsNFloorPriceResponse(PPDetails: any) {
    try {
      const webMethod = this.interfaceUrl + 'eqd/Quote/CheckIfResponseReceived';
      const that = this;
      const parameters = {
        QuoteRequestID: PPDetails
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        that.Prices = data;
        that.commonfunctions.setCapsNFloorsReceivedPrices(that.Prices, 1);
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

  generateXML() {
    try {
      const object = {};
      let xmlstr = '<QuoteRequest>';
      let formattedcpnTrigger = '';
      for (const i in this.templateMappingArr) {

        switch (this.templateMappingArr[i].email_Header) {
          case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Product_BBVA': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.productType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
          case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'ShareCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Code() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'UnderlyingReferenceRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.underlyingRefRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

          case 'Cap': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.callableCap + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // RiddhiP || 15JUNE23
          case 'Floor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.callableFloor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;


          case 'Expiry/Maturity/Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.maturity + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

          case 'CouponBasis': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.cpnBasis + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

          //
          case 'FirstCallableDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.firstCallableDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          //
          case 'ERFrequency(1m,2m,3m,4m,6m,12m)': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.callableFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // RiddhiP || 15JUNE23 
          // case 'UnderlyingReferenceRate2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          // + this.underlyingRefRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          // break;

          //    RiddhiP || 20june23
          case 'Frequency(1m,2m,3m,4m,6m,12m)': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.frequency + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Frequency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.frequency + '</' + this.templateMappingArr[i].template_Field_Name + '>';
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
          case 'MemoryPeriods': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.MemoryPeriods + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;


          case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // 
          case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

          case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + AppConfig.settings.oRes.userName + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;

          // case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          //     + this.issueDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
          //     break;

        }

      }
      xmlstr += '</QuoteRequest>';
      return xmlstr;
    } catch (error) {

      return '';
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
        this.checkNotionalRes = this.apifunctions.BBVACheckNotional(this.product_code, this.ddlNoteCcy);
        if (this.checkNotionalRes) {
          if (floatNotional < parseFloat(this.checkNotionalRes[0].Minimum)
            || floatNotional > parseFloat(this.checkNotionalRes[0].Maximum)) {
            target.classList.add('error');
            // tslint:disable-next-line: max-line-length
            this.ErrorMsg = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
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

  setSolveFor(e: any) {
    try {
      this.reset();
      this.infoMsg = '';
      if (this.SolveForvalue === 'IBPrice') {
        this.IBPrice = ''
        this.setDefaultSolveForValues();
      }
      if (this.SolveForvalue === 'Cap') {
        this.callableCap = '';
        this.setDefaultSolveForValues();
      }
      if (this.SolveForvalue === 'Floor') {
        this.callableFloor = '';
        this.setDefaultSolveForValues();
      }
    } catch (error) {

    }
  }

  async onBehalfOfChange() {
    this.mappedformatlist = [];
    this.priceBtnActive = 'N';
    this.GetClientProdDetailsArr = await this.apifunctions.GetClientProdDetails(this.onBehalfOf);
    if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr?.length > 0) {
      if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product) > -1) {
        this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].CPM_Format).toString().split(',');
        this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === this.Product)].ActiveYN;
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

  IBPricechange() {
    try {
      this.reset();
      this.infoMsg = '';
    } catch (error) {

    }
  }

  PriceValidation(e: any, Pricestr: string) {
    try {
      this.reset();
      this.infoMsg = '';
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = '';
      target.classList.remove('error');

      switch (Pricestr) {
        case 'CapFloorLimit':
          if (target.value === '' || parseFloat(this.callableFloor) < parseFloat(this.RatesFloorLimit[0]) || parseFloat(this.callableFloor) > parseFloat(this.RatesFloorLimit[1])) {
            this.ErrorMsg = 'Floor (%) should be between ' + this.RatesFloorLimit[0] + '% and ' + this.RatesFloorLimit[1] + '%.';
            target.classList.add('error');
          } else if (target.value === '' || parseFloat(this.callableCap) < parseFloat(this.RatesCapLimit[0]) || parseFloat(this.callableCap) > parseFloat(this.RatesCapLimit[1])) {
            this.ErrorMsg = 'Cap (%) should be between ' + this.RatesCapLimit[0] + '% and ' + this.RatesCapLimit[1] + '%.';
            target.classList.add('error');
          } else if (parseFloat(this.callableCap) <= 20 && (parseFloat(this.callableCap) < (parseFloat(this.callableFloor) + 2))) {
            this.ErrorMsg = 'Cap must be between ' + (parseFloat(this.callableFloor) + 2) + '% ' + 'and ' + this.RatesCapLimit[1] + '%';
          }
          break;
      }
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
