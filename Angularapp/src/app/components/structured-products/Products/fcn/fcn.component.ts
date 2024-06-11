import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { environment } from 'src/environments/environment';
import { SearchUnderlyingPipe } from '../../Common-Components/pipes/search-underlying.pipe';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');
// const signalR = require('@aspnet/signalr');

declare global {
  interface Array<T> {
    FCNSortBy(p): Array<T>;
  }
}
Array.prototype.FCNSortBy = function (p): Array<any> {
  try {
    console.log('sorting callig... ');
    if (this !== undefined) {
      if (this.length > 0) {
        if (this[0].solvefor !== 'COUPON') {
          return this.slice(0).sort(function (a, b) {
            return Number(a[p]) > Number(b[p])
              ? 1
              : Number(a[p]) < Number(b[p])
              ? -1
              : 0;
          });
        } else {
          return this.slice(0).sort(function (a, b) {
            return Number(a[p]) < Number(b[p])
              ? 1
              : Number(a[p]) > Number(b[p])
              ? -1
              : 0;
          });
        }
      }
    }
  } catch (error) {
    //console.log("Error:", error);
  }
};

@Component({
  selector: 'app-fcn',
  templateUrl: './fcn.component.html',
  styleUrls: ['./fcn.component.scss'],
})
export class FCNComponent implements OnInit, OnDestroy {
  @ViewChild('focusable') namefield: ElementRef;
  ngOnDestroy(): void {
    //console.log("Destroyed successfully");
    this.timeLeft = 0;
    clearInterval(this.interval);
  }
  checkSuitability: boolean = false;
  successOrderMessage: string = '';

  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;
  Tenor: number;
  settlementWeek: string;
  DaysCount: any;
  flag: boolean;
  shares: any;
  ShareName: string;
  shareCode: any;
  selectedShareIndex = 0;
  ShareBasket = [];
  settdate = '';
  matdate = '';
  expdate: string;
  selectedDates: any;
  tradedate = '';
  getallDate: any;
  monthNames = [
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
  ddlNoteCcy: any;
  UnderlyingCurrency = 'USD';
  CCY = [];
  ReceivedCCY: any;
  SolveForvalue: any;
  Exchange: any;
  strpair: any;
  ccyChange: any;
  ShareSpotRate: any;
  tddsData: any;
  IBPrice: any;
  Coupon: any;
  upfront: any;
  RFQIDArray = [];
  timerStarted = false;
  remainingTimeLabel = '';
  remainingTime = 180;
  run: any;
  sortedAllPrices: any = [];
  AllPrices = [];
  Prices = [];
  pricingID = 0;
  ExchangeCode: any;
  Strike: any;
  interfaceUrl = environment.interfaceURL;
  SelectedUnderlyingarray = [];
  SelectedUnderlyingBasketArray = [];
  SelectedUnderlyingBasket: any = {
    UnderlyingOne: {},
    UnderlyingTwo: {},
    UnderlyingThree: {},
    UnderlyingFour: {},
  };
  Code: any;
  KO: any;
  KOType: any;
  KI: any;
  KIType: any;
  CouponPer: any;
  CouponFreq: any;
  SingleSH: any;
  RiskRating: any;
  TenorType: any;
  Notional: any;
  loadflag: boolean;
  Token = '';
  timeLeft: number = 60;
  interval: any;
  PPDetails: any;
  orderID = '';
  chkKI = true;
  chkKO = true;
  ErrorMsg = '';
  NonCall: any;
  monthcnt: any;
  OrderHistoryArray = [];
  orderflag: boolean;
  OrderType: any;
  LimitShare: any;
  Issuer: any;
  accord: any;
  accordflag: boolean;
  bookOrderFlag = false;
  lblOrderBlotter = '';
  lblOrderDetail = '';
  ClientPrice: any;
  ErrorMsg1: any;
  ClientYield: any;
  shareCodeList = '';
  rmList: any;
  eqcRef: any;
  bookingBranch: any;
  minNotional: any;
  maxNotional: any;
  tblAllocation = [];

  allocatedNotional: any = 0;
  remainingNotional: any = 0;
  previousNotional: any = 0;
  totalNotional: any = 0;

  LimitAmount: any;
  priceFlag = false;
  blotterFlag = false;
  clearFlag: boolean;
  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;

  rmName: any;
  selectedBookingBranch: any;
  langFlag: boolean;
  rfq: any;
  lpArr = [];
  selectShareEvent: Subject<any> = new Subject();
  removeShareEvent: Subject<any> = new Subject();
  disableSuitabilityCheck: boolean = false;
  emailPopup: boolean = false;

  constructor(
    public EQC_cfs: EqcCommonfunctionsService,
    public EQC_afs: EqcApifunctionService,
    public elem: ElementRef,
    public translate: TranslateService,
    public homeApi: HomeApiService,
    public authApi: AuthService
  ) {
    try {
      this.flag = false;
      this.shares = [];
      this.Tenor = 6;
      this.ddlNoteCcy = 'USD';
      this.UnderlyingCurrency = 'USD';
      this.loadflag = false;
      this.Issuer = '';
      this.accordflag = false;
      this.minNotional = 0;
      this.maxNotional = 0;
      this.remainingNotional = '1,000,000.00';
      this.totalNotional = '1,000,000.00';
      this.tblAllocation.push('');
      this.langFlag = false;
      translate.addLangs(['en', 'ja']);
      translate.setDefaultLang('en');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|ja/) ? browserLang : 'en');
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ngOnInit() {
    $('#loading').show();
    setTimeout(async () => {
      try {
        this.accordflag = false;
        // this.reset();
        this.EQC_cfs.ClearPricesFromMultiToDealEntry();
        this.upfront = '0.50';
        this.CouponPer = '10.00';
        this.IBPrice = '99.50';
        this.Tenor = 6;
        this.TenorType = 'Month';
        this.settlementWeek = '1W';
        this.SolveForvalue = 'CONVERSION_STRIKE';
        this.DaysCount = 7;
        if (!this.EQC_afs.sharesArr.length) {
        this.EQC_afs.loadShares().subscribe((Res) => {
            // if (Res) {
            //   this.shares = JSON.parse(Res['responseData']);
            //   this.EQC_afs.SetToken(Res.token);
            // }
          if (Res) {
              if (!(Res.message.toUpperCase() === 'ERROR')) {
                sessionStorage.setItem('sharesJson', Res['responseData']);
                this.EQC_afs.sharesArr = JSON.parse(Res['responseData']);
                this.shares = this.EQC_afs.sharesArr;
            this.EQC_afs.SetToken(Res.token);
          }
            }
        });
        } else {
          this.shares = this.EQC_afs.sharesArr;
          // this.EQC_afs.SetToken(Res.token);
        }
        this.KOType = 'American';
        this.KIType = 'American';
        this.CouponFreq = 'MONTHLY';
        this.KO = '105.00';
        this.KI = '65.00';
        this.Notional = '1,000,000.00';
        this.allocatedNotional = '0.00';
        this.NonCall = 1;

        this.Strike = '0.00';
        this.sortedAllPrices = [];

        this.ClientYield = '';
        this.OrderType = 'Limit';

        this.lblOrderDetail = '+ Order Details';
        this.lblOrderBlotter = '+ Order Blotter';
        this.remainingNotional = '1,000,000.00';
        this.totalNotional = '1,000,000.00';
        // this.EQC_cfs.Currency.subscribe((cu) => (this.ddlNoteCcy = cu));
        const ccyRes = await this.EQC_afs.loadCurrency();
        this.ReceivedCCY = JSON.parse(ccyRes.responseData);
        this.CCY = this.ReceivedCCY.map((res) => res.Ccy);
        //console.log(this.ddlNoteCcy);
        // this.CCY.push('USD');
        // this.ReceivedCCY = this.EQC_afs.loadCurrency();
        // try {
        //   this.ReceivedCCY.forEach((element) => {
        //     //console.log(element.Ccy);
        //     const ccyData = element.Ccy;
        //     this.CCY.push(ccyData);
        //   });
        // } catch (error) {}
        // this.CCY.splice(0, 1);
        this.Exchange = () => {
          let ex = '';
          if (this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode']) {
            ex = this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode']) {
            ex +=
              ', ' +
              this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode']) {
            ex +=
              ', ' +
              this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour['ExchangeCode']) {
            ex +=
              ', ' +
              this.SelectedUnderlyingBasket.UnderlyingFour['ExchangeCode'];
          }
          return ex;
        };
        this.Code = () => {
          let code = '';
          if (this.SelectedUnderlyingBasket.UnderlyingOne['Code']) {
            code = this.SelectedUnderlyingBasket.UnderlyingOne['Code'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingTwo['Code']) {
            code += ', ' + this.SelectedUnderlyingBasket.UnderlyingTwo['Code'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree['Code']) {
            code +=
              ', ' + this.SelectedUnderlyingBasket.UnderlyingThree['Code'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour['Code']) {
            code += ', ' + this.SelectedUnderlyingBasket.UnderlyingFour['Code'];
          }
          return code;
        };
        //  const that = this;

        //  const today = new Date();
        //  this.tradedate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        this.EQC_cfs.FCNSignalRPrices.subscribe((prices) => {
          this.AllPrices = [];
          try {
            if (prices) {
              this.sortedAllPrices = [];
              for (let i = 0; i < prices.length; i++) {
                if (prices[i].DRAOUT > 0) {
                  // console.log(this.lpArr, prices[i].EP_ER_QuoteRequestId);
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = prices[i].DRAOUT;
                      this.lpArr[k].clientyield = prices[i].ClientYield;
                      this.lpArr[k].maxnotional = prices[i].MaxNotional;
                      this.lpArr[k].minnotional = prices[i].MinNotional;
                      if (this.lpArr[k].pricerflag === 'false') {
                        this.lpArr[k].timer = this.startCountDown(180, k);
                        this.lpArr[k].pricerflag = 'true';
                      }
                    }
                  }
                  this.AllPrices.push({
                    rfq: prices[i].EP_ER_QuoteRequestId,
                    lp: prices[i].PP_CODE,
                    price: prices[i].DRAOUT,
                    clientyield: prices[i].ClientYield,
                    solvefor: this.SolveForvalue,
                    maxnotional: prices[i].MaxNotional,
                    minnotional: prices[i].MinNotional,
                  });
                } else if (typeof prices[i].DRAOUT === typeof '') {
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = 0;
                      this.lpArr[k].status = prices[i].DRAOUT;
                      this.lpArr[k].clientyield = '';
                      this.lpArr[k].maxnotional = '';
                      this.lpArr[k].minnotional = '';
                      // if (this.lpArr[k].pricerflag === 'false') {
                      //   this.lpArr[k].timer = this.startCountDown(180, k);
                      //   this.lpArr[k].pricerflag = 'true';
                      // }
                }
              }
                  this.AllPrices.push({
                    rfq: prices[i].EP_ER_QuoteRequestId,
                    lp: prices[i].PP_CODE,
                    price: 0,
                    status: prices[i].DRAOUT,
                    clientyield: '',
                    maxnotional: '',
                    minnotional: '',
                  });
                }
              }
              console.log('All Prices', this.AllPrices);
              this.sortedAllPrices = this.AllPrices.ELNsortBy('price');
              //   console.log('Sorted Prices', this.sortedAllPrices)
              if (this.sortedAllPrices.length > 0) {
                if (this.sortedAllPrices[0].price > 0) {
                  this.loadflag = false;
                } else if (this.sortedAllPrices[0].status) {
                  this.loadflag = false;
                }
              }
            }
          } catch (ex) {
            // console.log('Error in FCN Pricing', ex);
          }
        });
        $('#loading').hide();
      } catch (error) {
        //console.log("Error:", error);
      }
    });
  }
  setSolveFor(e) {
    try {
      this.reset();
      const target = this.EQC_cfs.GetEventTarget(e);

      this.SolveForvalue = target.value;
      //console.log('change: ' + target.value);
      if (this.SolveForvalue === 'CONVERSION_STRIKE') {
        this.Strike = ' 0.00';
        this.IBPrice = '99.50';
        this.upfront = '0.50';
        this.CouponPer = '10.00';
      }
      if (this.SolveForvalue === 'COUPON') {
        this.CouponPer = '0.00';
        this.Strike = '98.50';
        this.IBPrice = '99.50';
        this.upfront = '0.50';
      }
      if (this.SolveForvalue === 'PRICE') {
        this.CouponPer = '10.00';
        this.Strike = '98.50';
        this.IBPrice = '0.00';
        this.upfront = '0.00';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSelectedUnderlyingarray(
    LongName: string,
    Ccy: string,
    Code: string,
    ExchangeCode: string,
    Exchangename: string,
    ISINname: string,
    Last1yearHighValue: string,
    Last1yearLowValue: string,
    Spot: string,
    RiskRating: any
  ) {
    try {
      this.SelectedUnderlyingarray.push({
        LongName: LongName,
        Ccy: Ccy,
        Code: Code,
        ExchangeCode: ExchangeCode,
        Exchangename: Exchangename,
      });
      this.SelectedUnderlyingBasketArray.push({
        LongName: LongName,
        Ccy: Ccy,
        Code: Code,
        ExchangeCode: ExchangeCode,
        Exchangename: Exchangename,
        ISINName: ISINname,
        Last1yearHighValue: Last1yearHighValue,
        Last1yearLowValue: Last1yearLowValue,
        Spot: Spot,
        Riskrating: RiskRating,
      });
      //console.log(this.SelectedUnderlyingBasketArray);
      this.updateShareBasket();
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  updateShareBasket() {
    try {
      if (this.SelectedUnderlyingBasketArray[0] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingOne = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingOne =
          this.SelectedUnderlyingBasketArray[0];
      }
      if (this.SelectedUnderlyingBasketArray[1] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingTwo = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingTwo =
          this.SelectedUnderlyingBasketArray[1];
      }
      if (this.SelectedUnderlyingBasketArray[2] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingThree = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingThree =
          this.SelectedUnderlyingBasketArray[2];
      }
      if (this.SelectedUnderlyingBasketArray[3] === undefined) {
        this.SelectedUnderlyingBasket.UnderlyingFour = {};
      } else {
        this.SelectedUnderlyingBasket.UnderlyingFour =
          this.SelectedUnderlyingBasketArray[3];
      }
      //console.log(this.SelectedUnderlyingBasket);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  bookingBranchChanged(e) {
    try {
      this.selectedBookingBranch = e.target.value;
    } catch (error) {
      console.log(error);
    }
  }
  Settlementweekschange(event) {
    try {
      console.log(event);
      this.reset();
      this.Currency = 'USD';
      if (this.settlementWeek === '1W') {
        this.DaysCount = 7;
      } else if (this.settlementWeek === '2W') {
        this.DaysCount = 14;
      } else if (this.settlementWeek === '3W') {
        this.DaysCount = 21;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  ChangeIndex(e) {
    try {
      console.log(e);
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      //console.log(this.elem.nativeElement.querySelectorAll('.SelectorBox'));
      // this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {}
  }
  selectShare(e) {
    try {
      console.log(e);
      this.flag = false;
      if ($('.HoverSuggestion').data('share') != undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      this.ShareName = this.shareCode;
      this.showUnderlying(
        SearchUnderlyingPipe.prototype.transform(
          this.shares,
          this.shareCode,
          1
        )[0]
      );

      // if (this.ShareBasket.length < 4) {
      // this.ShareBasket.push({ 'Name': this.ShareName });
      // }
    } catch (Error) {
      //console.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }
  backKeyPress(e) {
    try {
      console.log(e);
      this.flag = false;
      this.shareCode = '';
      this.selectedBIndex = 0;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  showUnderlying(item) {
    try {
      this.reset();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      //this.ShareName = item.LongName;
      this.ShareName = '';
      //console.log(this.ShareName);
      this.EQC_cfs.selectedShareIndex = 0;
      if (this.ShareBasket.length === 0) {
        this.ddlNoteCcy = item.Ccy;
        this.ccyChange = item.Ccy;
      }

      // this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;

      this.strpair = item.Code + ' - ' + item.Ccy;
      //this.ShareSpotRate = this.EQC_afs.loadShareSpotRate(this.strpair);
      // this.SingleSH = (this.EQC_afs.HighLowForParticularShare(item.Code));
      // this.RiskRating = (this.EQC_afs.LoadRiskRating(item.Code));
      // this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.Code, item.ExchangeCode, item.ExchangeName, this.SingleSH[0].ISIN, this.SingleSH[0].Last1YearHigh_Value, this.SingleSH[0].Last1YearLow_Value, this.ShareSpotRate.GetShareRateResult, this.RiskRating[0].UnderlyingRiskRating);
      this.setSelectedUnderlyingarray(
        item.LongName,
        item.Ccy,
        item.Code,
        item.ExchangeCode,
        item.ExchangeName,
        '',
        '',
        '',
        '',
        ''
      );
      this.EQC_cfs.setUnderlyingCurrency(this.ddlNoteCcy);
      this.EQC_cfs.setShareCode(item.Code);
      this.EQC_cfs.setExchangeCode(this.Exchange);
      //console.log(this.ddlNoteCcy);
      this.EQC_cfs.setUnderlyingCurrency(this.ddlNoteCcy);

      if (this.ShareBasket.length < 4) {
        if (this.ShareBasket.find((i) => i.Name == item.Code) === undefined) {
          this.ShareBasket.push({ Name: item.Code });
        }
        this.selectShareEvent.next(this.shareCode);
      }
      //console.log(this.ShareBasket);
      this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);
      this.LimitShare = this.shareCode;
      this.shareCodeList = this.Code();
      this.LimitAmount = 0;
      this.priceFlag = true;
      //console.log(this.shareCodeList);
      if (this.ShareBasket.length == 3) {
        this.namefield.nativeElement.focus();
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  Price() {
    try {
      if (
        this.Tenor == 0 ||
        (this.Tenor > 60 && this.TenorType === 'Month') ||
        (this.Tenor > 5 && this.TenorType === 'Year')
      ) {
        this.ErrorMsg = 'Please enter valid tenor';
        return false;
      }
      if (
        this.Notional === '0' ||
        this.Notional === '0.00' ||
        this.Notional === ''
      ) {
        this.ErrorMsg = 'Please enter valid notional';
        return false;
      }

      if (
        this.SolveForvalue !== 'COUPON' &&
        (this.CouponPer === '0.00' ||
          this.CouponPer === '' ||
          this.CouponPer === '0')
      ) {
        this.ErrorMsg = 'Coupon (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'CONVERSION_STRIKE' &&
        (this.Strike === '0.00' || this.Strike === '' || this.Strike === '0')
      ) {
        this.ErrorMsg = 'Strike (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'PRICE' &&
        (this.IBPrice === '0.00' || this.IBPrice === '' || this.IBPrice === '0')
      ) {
        this.ErrorMsg =
          'IB Price (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'PRICE' &&
        (this.upfront === '0' || this.upfront === '0.00' || this.upfront === '')
      ) {
        this.ErrorMsg =
          'Upfront (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.chkKI &&
        (this.KI === '0' ||
          this.KI === '0.00' ||
          this.KI === '' ||
          parseFloat(this.KI) < 50)
      ) {
        this.ErrorMsg =
          'KI (%) of Initial should be greater than or equal to 50';
        return false;
      }
      if (this.chkKI && this.chkKO) {
        if (parseFloat(this.KI) > parseFloat(this.KO)) {
          this.ErrorMsg = 'KI % of Initial is greater than KO % of Initial';
          return false;
        }
      }

      if (this.SolveForvalue !== 'CONVERSION_STRIKE' && this.chkKI) {
        if (parseFloat(this.KI) > parseFloat(this.Strike)) {
          this.ErrorMsg = 'Strike % should be greater than KI %';
          return false;
        }
      }

      if (this.SolveForvalue !== 'CONVERSION_STRIKE' && this.chkKO) {
        if (parseFloat(this.KO) < parseFloat(this.Strike)) {
          this.ErrorMsg = 'Strike % should be less than KO %';
          return false;
        }
      }

      if (this.ErrorMsg == '') {
        this.timeLeft = 0;
        this.orderID = '';
        this.AllPrices = [];
        this.sortedAllPrices = [];
        this.lpArr = [];
        this.fnResetLPs();
        this.RFQIDArray = [];
        // this.timerStarted = false;
        this.loadflag = true;
        // this.EQC_cfs.IncrementPricingID();
        // //console.log('Pricing...');

        this.FCNPrice('', '');
        // this.pricingID = this.EQC_cfs.getPricingID();
        // this.EQC_cfs.flagForDealentryAndMultipricer = true;
        // Object.keys(this.EQC_cfs.entityArray).forEach(async (element) => {
        //     this.FCNPrice(element, this.pricingID);
        // });
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  FCNPrice(PP, pricingID) {
    try {
      console.log(pricingID);
      // this.Token = this.EQC_afs.AuthenticateUser();
      this.clearFlag = false;
      //console.log(this.Token, this.NonCall);
      const webMethod = this.interfaceUrl + 'EQC/FCN/Quote';
      const that = this;

      const parameters = {
        // userName: 'Mobile1',
        userName: this.authApi.UserName,
        EntityId: sessionStorage.getItem('EntityID'),
        PPID: PP,
        type: 'FCN',
        InterBankPrice: this.IBPrice,
        UnderlyingCode1:
          this.SelectedUnderlyingBasket.UnderlyingOne['Code'] === undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingOne['Code'],
        UnderlyingCode2:
          this.SelectedUnderlyingBasket.UnderlyingTwo['Code'] === undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingTwo['Code'],
        UnderlyingCode3:
          this.SelectedUnderlyingBasket.UnderlyingThree['Code'] === undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingThree['Code'],
        UnderlyingCode4:
          this.SelectedUnderlyingBasket.UnderlyingFour['Code'] === undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingFour['Code'],
        // 'TenorType': this.Tenor.substr(1, 1),
        TenorType: this.TenorType,
        Tenor: this.Tenor,
        Price: this.IBPrice,
        CashCurrency: this.ddlNoteCcy,
        Exchange1:
          this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode'] ===
          undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode'],
        Exchange2:
          this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode'] ===
          undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode'],
        Exchange3:
          this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode'] ===
          undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode'],
        Exchange4:
          this.SelectedUnderlyingBasket.UnderlyingFour['ExchangeCode'] ===
          undefined
            ? ''
            : this.SelectedUnderlyingBasket.UnderlyingFour['ExchangeCode'],
        BarrierPercentage: this.KO,
        IssuerDateOffset: this.DaysCount,
        Upfront: this.upfront, // * 100,
        SolveFor: this.SolveForvalue,
        PDD: '',
        TradeDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDay()
        )
          .getTime()
          .toString(),
        TransactionTime: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDay()
        )
          .getTime()
          .toString(),
        Notional: this.Notional.replace(/,/g, ''),
        Definition: 'FCN' + (this.Strike || '0') + this.Code(),
        KIType: this.chkKI ? this.KIType : 'NONE',
        KI: this.chkKI ? this.KI : 'null',
        KOType: this.chkKO ? this.KOType : 'NONE',
        KO: this.chkKO ? this.KO : 'null',
        CouponFrequency: this.CouponFreq,
        CouponPercentage: this.CouponPer,
        token: this.EQC_afs.GetToken(),
        nonCall: this.NonCall,
      };
      if (this.SolveForvalue === 'PRICE' || this.SolveForvalue === 'COUPON') {
        parameters['StrikePercentage'] = this.Strike;
      } else {
        parameters['StrikePercentage'] = '0';
      }

      parameters['guaranteedDuration'] = '';
      parameters['guaranteedDurationType'] = '';

      //console.log(parameters);
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: function (data) {
          if (!that.clearFlag) {
            that.Prices = [];
            that.timeLeft = 60;
            //console.log(data['responseData'], data['token']);
            that.Token = data['token'];
            that.PPDetails = data['responseData'];
            that.EQC_afs.SetToken(data['token']);
            that.fnResetLPs();
            const temp = that.PPDetails.split(',');
            for (let j = 0; j < temp.length; j++) {
              that.lpArr.push({
                rfq: temp[j].split('-')[1],
                lp: temp[j].split('-')[0],
                displayName:
                  temp[j].split('-')[0].toUpperCase() === 'SOCGEN'
                    ? 'BBVA'
                    : temp[j].split('-')[0],
                price: '-',
                clientyield: '',
                maxnotional: '',
                minnotional: '',
                timer: '-',
                pricerflag: 'false',
              });
            }
            if (that.PPDetails !== '') {
              that.interval = setInterval(() => {
                if (that.timeLeft > 0) {
                  that.FCNPriceResponse(that.PPDetails);
                  that.timeLeft = that.timeLeft - 5;
                } else if (that.timeLeft === 0) {
                  that.loadflag = false;
                  clearInterval(that.interval);
                }
              }, 5000);
            }
          }
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  FCNPriceResponse(PPDetails) {
    try {
      // if(this.Token==="")
      // {
      // this.Token = this.EQC_afs.AuthenticateUser();
      //console.log(this.Token);
      // }

      const webMethod = this.interfaceUrl + 'EQC/FCN/QuoteResponse';
      const that = this;

      const parameters = {
        userName: this.authApi.UserName,
        EntityId: this.authApi.EntityID,
        // EntityId: 155,
        PPDetails: PPDetails,
        token: this.EQC_afs.GetToken(),
      };
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: function (data) {
          that.Prices = JSON.parse(data['responseData']);
          that.EQC_afs.SetToken(data['token']);
          setTimeout(function () {
            // document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
          }, 100);
          if (that.timeLeft > 0) {
            that.EQC_cfs.setFCNReceivedPrices(that.Prices);
          }

          //console.log(that.Prices);
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  bookOrder(
    selectedrfq: any,
    lp1: any,
    minnotional1: any,
    maxnotional1: any,
    clientyield1: any,
    selectedprice: any
  ) {
    try {
      console.log('Order Booking initiated...', lp1);
      this.Issuer = lp1;
      this.minNotional = minnotional1;
      this.maxNotional = maxnotional1;
      this.ClientYield = clientyield1;
      this.rfq = selectedrfq;

      if (this.SolveForvalue === 'CONVERSION_STRIKE') {
        this.Strike = selectedprice;
      }
      if (this.SolveForvalue === 'PRICE') {
        this.IBPrice = selectedprice;
        this.upfront = (100 - parseFloat(this.IBPrice)).toFixed(4);
        this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);
      }
      if (this.SolveForvalue === 'COUPON') {
        this.Coupon = selectedprice;
        this.CouponPer = parseFloat(selectedprice).toFixed(4);
      }

      if (this.SolveForvalue === 'CONVERSION_STRIKE' && this.chkKI) {
        if (parseFloat(this.KI) > parseFloat(this.sortedAllPrices[0].price)) {
          this.ErrorMsg = 'Strike % should be greater than KI %';
          return false;
        }
      }

      //console.log('Order Booking initiated...');
      this.timeLeft = 0;
      this.bookOrderFlag = true;
      this.accordflag = true;
      if (this.tblAllocation.length > 1) {
        this.tblAllocation = [];
        this.tblAllocation.push('');
      }
      this.EQC_afs.RMList('Mobile1').subscribe((data) => {
        try {
          this.EQC_afs.SetToken(data.token);
          data = JSON.parse(data['responseData']);
          this.rmList = data;
          // this.EQC_afs.EQCRef(
          //   'FCN',
          //   this.Tenor,
          //   this.TenorType,
          //   'Mobile1'
          // ).subscribe((data) => {
          // data = JSON.parse(data['responseData']);
          // this.eqcRef = data;
          this.EQC_afs.BookingBranch('Mobile1').subscribe((data) => {
            try {
              if (data) {
                this.EQC_afs.SetToken(data.token);
                data = JSON.parse(data['responseData']);
                this.bookingBranch = data;
                this.rmName = this.rmList[0].Rel_Manager_Name;
                this.selectedBookingBranch =
                  this.bookingBranch[0].BookingCenterCode;

                this.lblOrderDetail = '- Order Details';
                this.ErrorMsg1 = '';
                this.LimitAmount = 0;
                this.remainingNotional =
                  parseFloat(this.Notional.replace(/,/g, '')) -
                  parseFloat(this.allocatedNotional);
                this.orderflag = false;
                this.priceFlag = false;
                setTimeout(function () {
                  // document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
                }, 100);

                return false;
              }
            } catch (error) {
              console.log(error);
            }
          });
          // });
        } catch (EX) {}
      });
    } catch (error) {
      console.log('Error:', error);
    } finally {
      this.loadflag = false;
    }
    return false;
  }

  CheckKOValue(e) {
    try {
      const target = this.EQC_cfs.GetEventTarget(e);
      // alert(target.value);
      const KO = target.value;
      if (KO <= 100) {
        // this.errorMsg = 'Barrier should be greater then 100';
      } else {
        // this.errorMsg = '';
      }
    } catch (Err) {
      //console.log(Err);
    }
  }
  CheckKIValue(e) {
    try {
      const target = this.EQC_cfs.GetEventTarget(e);
      // alert(target.value);
      const KI = target.value;
      if (KI >= 100) {
        //this.errorMsg = 'Barrier should be less then or equal to 100';
      } else {
        // this.errorMsg = '';
      }
    } catch (Err) {
      //console.log(Err);
    }
  }

  ChangeKO(e) {
    try {
      console.log(e);
      // if (this.indexValue + 1 === this.EQC_cfs.FCNStocksBucket.length) {
      // this.EQC_cfs.SetMSPKO(parseInt(this.KO, 10));
      // }
      this.reset();
      // if (parseFloat(this.KO) < 70 || parseFloat(this.KO) > 130) {
      //     this.ErrorMsg = 'Please enter valid KO % of Intial';
      // }
      if (this.chkKI && this.chkKO) {
        if (parseFloat(this.KI) > parseFloat(this.KO)) {
          this.ErrorMsg = 'KI % of Initial is greater than KO % of Initial';
        }
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ChangeCoupon(e) {
    try {
      console.log(e);
      this.reset();
      // if (this.indexValue + 1 === this.EQC_cfs.FCNStocksBucket.length) {
      this.EQC_cfs.SetMSPCoupon(parseInt(this.CouponPer, 10));
      // }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setNotional(e) {
    try {
      this.reset();
      const target = this.EQC_cfs.GetEventTarget(e);
      this.Notional = parseFloat(target.value.replace(/,/g, '')).toFixed(2);
      if (this.Notional == '0' || this.Notional == '0.00') {
        this.ErrorMsg = 'Please Enter valid notional';
      }
      this.remainingNotional = this.Notional;
      this.totalNotional = this.Notional;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  Clear() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.Tenor = 6;
      this.upfront = '0.50';
      this.IBPrice = '99.50';
      this.settlementWeek = '1W';
      this.TenorType = 'Month';
      this.SolveForvalue = 'CONVERSION_STRIKE';
      this.DaysCount = 7;
      this.KOType = 'American';
      this.KIType = 'American';
      this.CouponFreq = 'MONTHLY';
      this.sortedAllPrices = [];
      this.ddlNoteCcy = 'USD';
      this.Strike = '0.00';
      this.Notional = '1,000,000.00';
      this.AllPrices = [];
      this.chkKI = true;
      this.chkKO = true;
      this.KO = '105.00';
      this.KI = '65.00';
      this.NonCall = 1;
      this.orderflag = false;
      this.ShareName = '';
      this.ShareBasket = [];
      this.loadflag = false;
      this.sortedAllPrices = [];
      this.lpArr = [];
      this.fnResetLPs();
      this.orderID = '';
      this.ErrorMsg = '';

      this.orderflag = false;
      this.accordflag = false;
      this.bookOrderFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];
      this.SelectedUnderlyingBasket = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
      };

      this.CouponPer = '10.00';
      this.OrderType = 'Limit';
      this.priceFlag = false;
      this.clearFlag = true;
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  removeShare(rownumber: any) {
    try {
      this.ShareBasket.splice(rownumber, 1);
      this.SelectedUnderlyingarray.splice(rownumber, 1);
      this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
      if (this.SelectedUnderlyingBasketArray.length > 0) {
        // this.ddlNoteCcy = this.SelectedUnderlyingBasketArray[this.SelectedUnderlyingBasketArray.length - 1]['Ccy'];
        this.ddlNoteCcy = this.SelectedUnderlyingBasketArray[0]['Ccy'];
      } else {
        this.ddlNoteCcy = 'USD';
      }
      // this.selectShareEvent.next(this.shareCode
      this.removeShareEvent.next(rownumber);
      this.updateShareBasket();
      this.reset();
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  fnGetLPList() {
    try {
      this.EQC_afs.GetLPList('FCN').subscribe((Res) => {
        if (Res) {
          this.EQC_afs.SetToken(Res['token']);
          this.lpArr = [];
          let LPArray = JSON.parse(Res['responseData']);
          LPArray = LPArray.FCNSortBy('Link_Provider_Name');
          LPArray.forEach((element) => {
            this.lpArr.push({
              rfq: '',
              lp: element.Link_Provider_Name,
              price: '-',
              clientyield: '',
              maxnotional: '',
              minnotional: '',
              timer: '-',
              pricerflag: 'false',
            });
          });
        }
      });
    } catch (Ex) {
      console.log('Error occured while fetching LP list: ', Ex);
    }
  }

  IBpricechange() {
    try {
      this.reset();
      if (this.SolveForvalue !== 'PRICE') {
        this.upfront = (100 - parseFloat(this.IBPrice)).toFixed(2);
      } else {
        this.IBPrice = 0.0;
        this.upfront = 0.0;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  reset() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.EQC_cfs.setFCNReceivedPrices({});
      this.clearFlag = true;
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.lpArr = [];
      this.fnResetLPs();
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.accordflag = false;
      this.bookOrderFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
      this.tblAllocation = [];
      this.tblAllocation.push('');
      this.allocatedNotional = '0.00';
      this.remainingNotional = parseFloat(
        this.Notional.toString().replace(/,/g, '')
      ).toFixed(2);
      this.totalNotional = parseFloat(
        this.Notional.toString().replace(/,/g, '')
      ).toFixed(2);
      // this.priceFlag = true;
      this.blotterFlag = false;
      if (this.ShareBasket.length == 0) {
        this.priceFlag = false;
      } else {
        this.priceFlag = true;
      }
      // this.SelectedUnderlyingarray = [];
      // this.SelectedUnderlyingBasketArray = [];
      // this.SelectedUnderlyingBasket = {
      //     UnderlyingOne: {},
      //     UnderlyingTwo: {},
      //     UnderlyingThree: {},
      //     UnderlyingFour: {}
      // };
      if (this.SolveForvalue === 'CONVERSION_STRIKE') {
        this.Strike = ' 0.00';
      }
      if (this.SolveForvalue === 'COUPON') {
        this.CouponPer = '0.00';
      }
      if (this.SolveForvalue === 'PRICE') {
        this.IBPrice = '0.00';
        this.upfront = '0.00';
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  changeTenor() {
    try {
      this.reset();
      if (
        this.Tenor == 0 ||
        (this.Tenor > 60 && this.TenorType === 'Month') ||
        (this.Tenor > 5 && this.TenorType === 'Year')
      ) {
        this.ErrorMsg = 'Please enter valid tenor.';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  changeStrike() {
    try {
      this.reset();
      if (
        this.chkKI &&
        (this.KI == '0' ||
          this.KI == '0.00' ||
          this.KI === '' ||
          parseFloat(this.KI) < 50)
      ) {
        this.ErrorMsg =
          'KI (%) of Initial should be greater than or equal to 50';
        return;
      }

      if (this.SolveForvalue !== 'CONVERSION_STRIKE' && this.chkKI) {
        if (parseFloat(this.KI) > parseFloat(this.Strike)) {
          this.ErrorMsg = 'Strike % should be greater than KI %';
        }
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  priceValidation(priceValue: any, pricestr: string) {
    try {
      this.reset();
      //console.log(priceValue, pricestr, this.SolveForvalue);
      if (
        priceValue === '' ||
        parseFloat(priceValue) <= 0 ||
        parseFloat(priceValue) >= 100
      ) {
        this.ErrorMsg =
          pricestr + ' should be greater than 0 and less than 100';
        if (pricestr === 'IB Price (%)' && this.SolveForvalue !== 'PRICE') {
          //console.log(priceValue, pricestr);
          this.upfront = '100.00';
        }

        if (pricestr === 'Upfront (%)' && this.SolveForvalue !== 'PRICE') {
          //console.log(priceValue, pricestr);
          this.IBPrice = '100.00';
        }
        return false;
      }
      if (this.SolveForvalue !== 'PRICE') {
        this.IBPrice = 100 - this.upfront;
        this.IBPrice = parseFloat(this.IBPrice).toFixed(2);
      } else {
        this.IBPrice = '0.00';
        this.upfront = '0.00';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  nonCallValidation() {
    try {
      this.reset();
      if (this.TenorType == 'Year') {
        this.monthcnt = 12 * this.Tenor;
      } else {
        this.monthcnt = this.Tenor;
      }

      if (this.CouponFreq === 'MONTHLY') {
        if (this.NonCall > this.monthcnt) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'BIMONTHLY') {
        if (this.NonCall > this.monthcnt / 2) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'QUARTERLY') {
        if (this.NonCall > this.monthcnt / 3) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'SEMIANNUALLY') {
        if (this.NonCall > this.monthcnt / 6) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'ANNUALLy') {
        if (this.NonCall > this.monthcnt / 12) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  scrollWin() {
    try {
      //  window.scrollTo(0, 1000);
      //this.orderflag = true;
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('FCN', 'FCN', 'DRAFCNBlotter');

      setTimeout(function () {
        // document.getElementById('blotterDiv1').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  // Order Blotter for structured product-- Priya L.
  fnEQConnectOrderHistory(SchemeName, pCode, apiName) {
    try {
      console.log(SchemeName);
      const today = new Date();
      const monthNames = [
        '',
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

      ////console.log( today.getDate()+ '-' + monthNames[today.getMonth()]  + '-' + today.getFullYear());

      this.OrderHistoryArray = [];
      const webMethod = this.interfaceUrl + apiName;
      const that = this;
      const parameters = {
        userName: 'Mobile1',
        FromTradeDate:
          today.getDate() +
          '-' +
          monthNames[today.getMonth() + 1] +
          '-' +
          today.getFullYear(), //req.body['FromTradeDate'],
        ToTradeDate:
          today.getDate() +
          '-' +
          monthNames[today.getMonth() + 1] +
          '-' +
          today.getFullYear(), //req.body['ToTradeDate'],
        FilterMode: 'SELF',
        ProductCode: pCode,
        token: '',
        // "ProductCode": pCode,
        // "SchemeName": SchemeName,
        // "tradeDate": today.getDate() + '-' + monthNames[today.getMonth() + 1] + '-' + today.getFullYear(),
        // "token": ''
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(parameters),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: function (data) {
          //console.log(JSON.parse(data["responseData"]));
          that.OrderHistoryArray = JSON.parse(data['responseData']);
          that.EQC_afs.SetToken(data['token']);
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  openProd() {
    if (this.accordflag === true) {
      this.accordflag = false;
      this.lblOrderDetail = '+ Order Details';
    } else {
      this.accordflag = true;
      this.lblOrderDetail = '- Order Details';
    }
  }
  openOrderBlotter() {
    // if (this.orderflag === true) {
    //     this.orderflag = false;
    //     this.lblOrderBlotter = '+ Order Blotter';

    // } else {
    //     this.orderflag = true;
    //     this.lblOrderBlotter = '- Order Blotter';
    //     this.fnEQConnectOrderHistory("FCN", "FCN", "DRAFCNBlotter");
    //     setTimeout(function() {
    //         //this.blotterDiv3.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    //        // document.getElementById('blotterDiv3').scrollIntoView()
    //         document.getElementById("blotterDiv1").scrollIntoView();
    //     }, 100);

    // }
    if (this.blotterFlag === true) {
      this.blotterFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
    } else {
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('FCN', 'FCN', 'DRAFCNBlotter');
      setTimeout(function () {
        //this.blotterDiv3.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
        // document.getElementById('blotterDiv3').scrollIntoView()
        // document.getElementById("blotterDiv1").scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  confirmOrder() {
    try {
      this.orderID = '';

      for (let k = 0; k < this.lpArr.length; k++) {
        if (this.lpArr[k].rfq === this.rfq) {
          if (this.lpArr[k].timer == 0) {
            this.accordflag = false;
            this.bookOrderFlag = false;
            return;
          }
        }
      }

      //console.log("In ELN Confirm Order");
      if (!this.isValidParameters()) {
        //console.log('returning False');
        return false;
      }
      this.confirmValidation();
      if (this.ErrorMsg1 !== '') {
        return false;
      }
      this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);

      const webMethod = this.interfaceUrl + 'EQC/BookOrder';
      const d1 = new Date();
      const that = this;
      if (this.authApi.UserType === 'RM') {
        this.checkSuitability = true;
        this.disableSuitabilityCheck = true;
        //         this.homeApi.Portfolio,
        // this.homeApi.AccountNumber,
        // this.homeApi.AccountNumber,
      }
      const parameters = {
        userName: 'Mobile1',
        Notional: this.Notional.replace(/,/g, ''),
        QuoteRequestID: this.rfq,
        Upfront: this.upfront,
        ClientPrice: this.ClientPrice,
        ClientYield: this.ClientYield,
        token: this.EQC_afs.GetToken(),
        orderType: this.OrderType.toUpperCase(),
        comment: 'MangeshWakode',
        confirmReason: 'MDW test',
        bookingBranch: this.selectedBookingBranch,
        rmName: this.rmName,
        CustPortfolio: this.homeApi.Portfolio,
        CustSettleAcount: this.homeApi.AccountNumber,
        CustomerID: this.homeApi.CustomerId,
      };

      //console.log(parameters);
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: function (data) {
          //console.log(data);
          if (data.message.split('~')[0].toUpperCase().trim() === 'SUCCESS') {
            that.successOrderMessage = that.checkSuitability
              ? 'Suitability request initiated'
              : '';
            console.log(data, that.successOrderMessage);

            that.orderID = data.UCPProductDetailsResponse._NoteMasterID;
            if (d1.getHours() >= 12) {
              if (d1.getHours() === 12) {
                that.hours1 = d1.getHours();
              } else {
                that.hours1 = d1.getHours() % 12;
              }
              that.ampm = 'PM';
            } else {
              that.hours1 = d1.getHours();
              that.ampm = 'AM';
            }
            if (d1.getMinutes() < 10) {
              that.min1 = '0' + d1.getMinutes();
            } else {
              that.min1 = d1.getMinutes();
            }
            that.orderTime =
              d1.getDate() +
              '-' +
              that.monthNames[d1.getMonth()] +
              '-' +
              d1.getFullYear() +
              ' ' +
              that.hours1 +
              ':' +
              that.min1 +
              ' ' +
              that.ampm;

            that.orderflag = true;
            that.accordflag = false;
            that.lpArr = [];
            that.bookOrderFlag = false;
            that.sortedAllPrices = [];
            that.AllPrices = [];
            this.timeLeft = 0;
            clearInterval(this.interval);
            that.priceFlag = true;
            // that.blotterFlag = true;
            // that.fnEQConnectOrderHistory("FCN", "FCN", "DRAFCNBlotter");
            // that.lblOrderBlotter = '- Order Blotter';
            // setTimeout(function() {
            // document.getElementById("blotterDiv").scrollIntoView();
            // },100);
            that.scrollWin();
          } else {
            that.orderID = 'NA';
            if (d1.getHours() >= 12) {
              if (d1.getHours() === 12) {
                that.hours1 = d1.getHours();
              } else {
                that.hours1 = d1.getHours() % 12;
              }
              that.ampm = 'PM';
            } else {
              that.hours1 = d1.getHours();
              that.ampm = 'AM';
            }
            if (d1.getMinutes() < 10) {
              that.min1 = '0' + d1.getMinutes();
            } else {
              that.min1 = d1.getMinutes();
            }
            that.orderTime =
              d1.getDate() +
              '-' +
              that.monthNames[d1.getMonth()] +
              '-' +
              d1.getFullYear() +
              ' ' +
              that.hours1 +
              ':' +
              that.min1 +
              ' ' +
              that.ampm;
          }
        },
        error: function () {},
      });
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  chkChangeKI(e) {
    console.log(e);
    this.reset();
    if (!this.chkKI) {
      // this.KI = '0.00';
      this.KI = '';
    } else {
      this.KI = '65.00';
    }
  }
  chkChangeKO(e) {
    console.log(e);
    this.reset();
    if (!this.chkKO) {
      // this.KO = '0.00';
      this.KO = '';
    } else {
      this.KO = '105.00';
    }
  }
  isValidParameters() {
    try {
      //console.log("in isValidParameters");
      //console.log("this.OrderType:" + this.OrderType);
      //console.log("this.LimitAmount:" + this.LimitAmount);
      if (
        this.OrderType === 'Limit' &&
        (this.LimitAmount === '' || this.LimitAmount <= 0)
      ) {
        //console.log('Please enter Limit Price.');
        this.ErrorMsg1 = 'Please enter Limit Price.';
        //this.orderflag = true;
        return false;
      } else {
        if (this.OrderType === 'Market') {
          this.LimitAmount = 0;
        }
        this.ErrorMsg1 = '';
        // this.orderflag = false;
        return true;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  // onBlurLimitAmt(e) {
  //     try {
  //         if (!this.isValidParameters()) {
  //             return false;
  //         }
  //         else {
  //             return true;
  //         }
  //     }
  //     catch (error) {
  //         console.log("Error:", error);
  //     }
  // }

  btnAllocationClick() {
    this.tblAllocation.push('');
    return false;
  }
  chkAllocation(e) {
    this.ErrorMsg1 = '';
    const target = this.EQC_cfs.GetEventTarget(e);
    //console.log(target.id, e, target.checked);
    if (!target.checked) {
      document
        .getElementById(
          'Notional' + target.id.substr(target.id.toString().length - 1, 1)
        )
        .setAttribute('disabled', 'true');
      document
        .getElementById(
          'Select' + target.id.substr(target.id.toString().length - 1, 1)
        )
        .setAttribute('disabled', 'true');
      this.allocatedNotional =
        parseFloat(this.allocatedNotional) -
        parseFloat(
          (<HTMLInputElement>(
            document.getElementById(
              'Notional' + target.id.substr(target.id.toString().length - 1, 1)
            )
          )).value.replace(/,/g, '')
        );
      this.remainingNotional =
        parseFloat(this.Notional.replace(/,/g, '')) -
        parseFloat(this.allocatedNotional);
    } else {
      document
        .getElementById(
          'Notional' + target.id.substr(target.id.toString().length - 1, 1)
        )
        .removeAttribute('disabled');
      document
        .getElementById(
          'Select' + target.id.substr(target.id.toString().length - 1, 1)
        )
        .removeAttribute('disabled');
      this.allocatedNotional =
        parseFloat(this.allocatedNotional) +
        parseFloat(
          (<HTMLInputElement>(
            document.getElementById(
              'Notional' + target.id.substr(target.id.toString().length - 1, 1)
            )
          )).value.replace(/,/g, '')
        );
      this.remainingNotional =
        parseFloat(this.Notional.replace(/,/g, '')) -
        parseFloat(this.allocatedNotional);
    }

    var i = 0;
    var tempflag = true;
    this.tblAllocation.forEach(() => {
      //console.log(element);
      if (
        !(<HTMLInputElement>document.getElementById('checkbox' + i)).checked
      ) {
        tempflag = false;
      }

      if (!tempflag) {
        (<HTMLInputElement>document.getElementById('checkboxAll')).checked =
          false;
      } else {
        (<HTMLInputElement>document.getElementById('checkboxAll')).checked =
          true;
      }
      i++;
    });
  }

  addNotional(e) {
    this.ErrorMsg1 = '';
    const target = this.EQC_cfs.GetEventTarget(e);
    if (target.value === '' || isNaN(target.value)) target.value = '0.00';
    this.allocatedNotional =
      parseFloat(this.allocatedNotional) +
      parseFloat(target.value) -
      parseFloat(this.previousNotional);
    this.remainingNotional =
      parseFloat(this.Notional.replace(/,/g, '')) -
      parseFloat(this.allocatedNotional);
    target.value = parseFloat(target.value).toFixed(2);
  }

  previousNotionals(e) {
    this.ErrorMsg1 = '';
    const target = this.EQC_cfs.GetEventTarget(e);
    if (target.value === '') {
      this.previousNotional = 0.0;
    } else {
      this.previousNotional = target.value;
    }
  }

  confirmValidation() {
    //console.log(this.allocatedNotional, this.maxNotional, this.minNotional);
    if (parseFloat(this.allocatedNotional) > parseFloat(this.maxNotional)) {
      this.ErrorMsg1 =
        'Can not place order. Notional size is greater than the maximum permitted.';
      return;
    }
    if (parseFloat(this.allocatedNotional) < parseFloat(this.minNotional)) {
      this.ErrorMsg1 =
        'Can not place order. Notional size is less than the minimum permitted.';
      return;
    }

    if (parseFloat(this.allocatedNotional) <= 0) {
      this.ErrorMsg1 = 'Please enter valid Notional.';
      return;
    }

    if (
      parseFloat(this.allocatedNotional) !==
      parseFloat(this.Notional.replace(/,/g, ''))
    ) {
      this.ErrorMsg1 = 'Sum of notionals is not equal to Order Quantity.';
      return;
    }
    var i = 0;
    this.tblAllocation.forEach(() => {
      //console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
      if (
        (<HTMLInputElement>document.getElementById('Notional' + i)).value ===
          '0.00' &&
        (<HTMLInputElement>document.getElementById('checkbox' + i)).checked
      ) {
        this.ErrorMsg1 = 'Please enter valid Notional.';
      }
      i++;
    });
  }
  chkAll(e) {
    this.ErrorMsg1 = '';
    const target = this.EQC_cfs.GetEventTarget(e);
    var i = 0;
    if (target.checked) {
      this.allocatedNotional = '0';
      this.tblAllocation.forEach(() => {
        //console.log(element);
        (<HTMLInputElement>document.getElementById('checkbox' + i)).checked =
          true;
        document.getElementById('Notional' + i).removeAttribute('disabled');
        document.getElementById('Select' + i).removeAttribute('disabled');
        this.allocatedNotional =
          parseFloat(this.allocatedNotional) +
          parseFloat(
            (<HTMLInputElement>(
              document.getElementById('Notional' + i)
            )).value.replace(/,/g, '')
          );
        this.remainingNotional =
          parseFloat(this.Notional.replace(/,/g, '')) -
          parseFloat(this.allocatedNotional);
        i++;
      });
    } else {
      this.tblAllocation.forEach(() => {
        //console.log(element);
        (<HTMLInputElement>document.getElementById('checkbox' + i)).checked =
          false;
        document
          .getElementById('Notional' + i)
          .setAttribute('disabled', 'true');
        document.getElementById('Select' + i).setAttribute('disabled', 'true');
        this.allocatedNotional =
          parseFloat(this.allocatedNotional) -
          parseFloat(
            (<HTMLInputElement>(
              document.getElementById('Notional' + i)
            )).value.replace(/,/g, '')
          );
        this.remainingNotional =
          parseFloat(this.Notional.replace(/,/g, '')) -
          parseFloat(this.allocatedNotional);
        i++;
      });
    }
  }

  convertToFloat(num: any) {
    return parseFloat(num);
  }

  toggleChange() {
    console.log(this.langFlag);
    if (this.langFlag) {
      this.translate.use('ja');
    } else {
      this.translate.use('en');
    }
  }
  startCountDown(sec, index) {
    let counter = sec;

    var interval1 = setInterval(() => {
      //console.log( counter);
      if (this.lpArr.length <= 0) {
        clearInterval(interval1);
      }
      if (this.lpArr.length > 0) {
        this.lpArr[index].timer = counter;
        counter--;
      }

      if (counter < 0) {
        clearInterval(interval1);
        if (this.lpArr[index].lp === this.Issuer && this.orderflag == false) {
          this.accordflag = false;
          this.bookOrderFlag === false;
          return;
        }
      }
    }, 1000);
  }
  cancel() {
    this.accordflag = false;
    this.bookOrderFlag = false;
    this.ErrorMsg1 = '';
    this.allocatedNotional = '0.00';

    this.remainingNotional = 1000000;
  }

  fnResetLPs() {
    this.lpArr.forEach((v) => {
      if (v) {
        (v.rfq = ''),
          (v.price = '-'),
          (v.clientyield = ''),
          (v.maxnotional = ''),
          (v.minnotional = ''),
          (v.timer = '-'),
          (v.pricerflag = 'false');
      }
    });
  }
  toggleSuitability() {
    console.log(this.checkSuitability);
  }
}
