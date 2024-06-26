import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
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
    PhoenixsortBy(p): Array<T>;
  }
}
Array.prototype.PhoenixsortBy = function (p): Array<any> {
  try {
    // return this.slice(0).sort(function (a, b) {
    //     return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    // });
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
  selector: 'app-phoenix',
  templateUrl: './phoenix.component.html',
  styleUrls: ['./phoenix.component.scss'],
})
export class PhoenixComponent implements OnInit, OnDestroy {
  @ViewChild('focusable') namefield: ElementRef;
  ngOnDestroy(): void {
    //console.log("Destroyed successfully");
    this.timeLeft = 0;
    clearInterval(this.interval);
  }

  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;
  Tenor: number;
  settlementWeek: string;
  DaysCount: any;
  flag: boolean;
  shares: any;
  ShareName: string;
  commonfunction: EqcCommonfunctionsService;
  apifunction: EqcApifunctionService;
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
  // signalr: SignalRService;
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
  CouponBarrier: any;
  stepDown: any;
  CouponType: any;
  NonCall: any;
  FixedCoupon: any;
  loadflag = false;
  orderID: any = '';
  Token = '';
  timeLeft: number = 60;
  interval: any;
  PPDetails: any;
  chkKI = true;
  chkKO = true;
  ErrorMsg = '';
  monthcnt: any;
  OrderHistoryArray = [];
  orderflag: boolean;
  bookOrderFlag = false;
  accordflag: boolean;
  Issuer: any;
  ClientYield: any;
  OrderType: any;
  lblOrderDetail = '';
  lblOrderBlotter = '';
  ClientPrice: any;
  LimitShare: any;
  shareCodeList = '';
  ErrorMsg1: any;
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
  constructor(
    public elem: ElementRef,
    public commonfunctions: EqcCommonfunctionsService,
    public apifunctions: EqcApifunctionService,
    public translate: TranslateService
  ) {
    try {
      this.commonfunction = commonfunctions;
      this.apifunction = apifunctions;
      this.flag = false;
      this.shares = [];
      this.Tenor = 6;
      this.ddlNoteCcy = 'USD';
      this.UnderlyingCurrency = 'USD';
      this.NonCall = 1;
      this.FixedCoupon = 1;
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
    setTimeout(() => {
      try {
        this.accordflag = false;
        //this.reset();
        this.commonfunction.ClearPricesFromMultiToDealEntry();
        this.upfront = '0.50';
        this.CouponPer = '10.00';
        this.IBPrice = '99.50';

        this.Tenor = 6;
        this.TenorType = 'Month';
        this.settlementWeek = '1W';
        this.SolveForvalue = 'CONVERSION_STRIKE';
        this.DaysCount = 7;
        this.apifunction.loadShares().subscribe((Res) => {
          if (Res) {
            this.shares = JSON.parse(Res['responseData']);
            this.apifunction.SetToken(Res.token);
          }
        });
        this.KOType = 'European';
        this.KIType = 'American';
        this.CouponFreq = 'MONTHLY';
        this.KO = '105.00';
        this.KI = '65.00';
        this.Notional = '1,000,000.00';
        this.Strike = '0.00';
        this.CouponBarrier = '10.00';
        this.stepDown = '5.00';
        this.CouponType = 'No_Memory';

        this.ClientYield = '';
        this.OrderType = 'Limit';
        this.lblOrderDetail = '+ Order Details';
        this.lblOrderBlotter = '+ Order Blotter';
        this.allocatedNotional = '0.00';
        this.remainingNotional = '1,000,000.00';
        this.totalNotional = '1,000,000.00';

        this.sortedAllPrices = [];

        this.commonfunction.Currency.subscribe((cu) => (this.ddlNoteCcy = cu));
        //console.log(this.ddlNoteCcy);
        this.CCY.push('USD');
        this.ReceivedCCY = this.apifunction.loadCurrency();
        try {
          this.ReceivedCCY.forEach((element) => {
            //console.log(element.Ccy);
            const ccyData = element.Ccy;
            this.CCY.push(ccyData);
          });
        } catch (error) {}
        this.CCY.splice(0, 1);
        this.Exchange = () => {
          let ex = '';
          if (this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode']) {
            ex = this.SelectedUnderlyingBasket.UnderlyingOne['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode']) {
            ex +=
              ',' + this.SelectedUnderlyingBasket.UnderlyingTwo['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode']) {
            ex +=
              ',' +
              this.SelectedUnderlyingBasket.UnderlyingThree['ExchangeCode'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour['ExchangeCode']) {
            ex +=
              ',' +
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
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo['Code'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingThree['Code']) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree['Code'];
          }
          if (this.SelectedUnderlyingBasket.UnderlyingFour['Code']) {
            code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour['Code'];
          }
          return code;
        };

        this.commonfunctions.PHXSignalRPrices.subscribe((prices) => {
          this.AllPrices = [];
          try {
            if (prices) {
              this.sortedAllPrices = [];
              for (let i = 0; i < prices.length; i++) {
                if (Number(prices[i].PhoenixOUT) > 0) {
                  // console.log(this.lpArr, prices[i].EP_ER_QuoteRequestId);
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = prices[i].PhoenixOUT;
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
                    price: prices[i].PhoenixOUT,
                    solvefor: this.SolveForvalue,

                    clientyield: prices[i].ClientYield,
                    maxnotional: prices[i].MaxNotional,
                    minnotional: prices[i].MinNotional,
                  });
                }
              }

              this.sortedAllPrices = this.AllPrices.PhoenixsortBy('price');
              if (this.sortedAllPrices.length > 0) {
                if (this.sortedAllPrices[0].price > 0) {
                  this.loadflag = false;
                }
              }
            }
          } catch (ex) {}
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
      const target = this.commonfunctions.GetEventTarget(e);

      this.SolveForvalue = target.value;
      //console.log('change: ' + target.value);
      if (this.SolveForvalue === 'CONVERSION_STRIKE') {
        this.Strike = '0.00';
        this.IBPrice = '99.50';
        this.upfront = '0.50';
        this.CouponPer = '10.00';
        this.chkKI = true;
        this.chkKO = true;
      }
      if (this.SolveForvalue === 'COUPON') {
        this.CouponPer = '0.00';
        this.Strike = '98.50';
        this.IBPrice = '99.50';
        this.upfront = '0.50';
        this.chkKI = true;
        this.chkKO = true;
      }
      if (this.SolveForvalue === 'PRICE') {
        this.CouponPer = '10.00';
        this.Strike = '98.50';
        this.IBPrice = '0.00';
        this.upfront = '0.00';
        this.chkKI = true;
        this.chkKO = true;
      }
      if (this.SolveForvalue === 'KNOCKIN_BARRIER') {
        this.KI = '0.00';
        // this.chkKI = false;
        // this.chkKO = true;
      }

      if (this.SolveForvalue === 'AUTOCALL_BARRIER') {
        this.KO = '0.00';
        // this.chkKO = false;
        // this.chkKI = true;
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
      // this.ShareName = this.shareCode;
      //console.log(this.shareCode);
      this.showUnderlying(
        SearchUnderlyingPipe.prototype.transform(
          this.shares,
          this.shareCode,
          1
        )[0]
      );
      this.selectShareEvent.next(this.shareCode);
      // if(this.ShareBasket.length < 4){
      // this.ShareBasket.push({'Name': this.ShareName});
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
      this.commonfunction.selectedShareIndex = 0;
      if (this.ShareBasket.length === 0) {
        this.ddlNoteCcy = item.Ccy;
        this.ccyChange = item.Ccy;
      }
      // this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;

      this.strpair = item.Code + ' - ' + item.Ccy;
      // this.ShareSpotRate = this.apifunction.loadShareSpotRate(this.strpair);
      // this.SingleSH = (this.apifunction.HighLowForParticularShare(item.Code));
      // this.RiskRating = (this.apifunction.LoadRiskRating(item.Code));
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
      // this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);
      // this.commonfunction.setShareCode(item.Code);
      // this.commonfunction.setExchangeCode(this.Exchange);
      //console.log(this.ddlNoteCcy);
      this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);

      if (this.ShareBasket.length < 4) {
        if (this.ShareBasket.find((i) => i.Name == item.Code) === undefined) {
          this.ShareBasket.push({ Name: item.Code });
        }
      }
      //console.log(this.ShareBasket);
      this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);
      this.LimitShare = this.ShareBasket[this.ShareBasket.length - 1];

      this.shareCodeList = this.Code();
      this.priceFlag = true;
      this.LimitAmount = 0;
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
        this.SolveForvalue !== 'KNOCKIN_BARRIER' &&
        (this.KI === '0' ||
          this.KI === '0.00' ||
          this.KI === '' ||
          parseFloat(this.KI) < 50)
      ) {
        this.ErrorMsg =
          'KI (%) of Initial should be greater than or equal to 50';
        return false;
      }
      if (
        this.chkKI &&
        this.chkKO &&
        this.SolveForvalue !== 'AUTOCALL_BARRIER'
      ) {
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

      if (this.ErrorMsg == '') {
        this.timeLeft = 0;
        this.orderID = '';
        this.orderflag = false;
        this.AllPrices = [];
        this.sortedAllPrices = [];
        this.lpArr = [];
        this.RFQIDArray = [];
        // this.timerStarted = false;
        this.loadflag = true;
        // this.commonfunctions.IncrementPricingID();
        // //console.log('Pricing...');

        this.PHXPrice();
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  PHXPrice() {
    try {
      // this.Token = this.apifunction.AuthenticateUser();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'EQC/PHX/Quote';
      const that = this;
      //console.log(this.Notional);
      const parameters = {
        userName: 'Mobile1',
        InterBankPrice: this.IBPrice,
        UnderlyingCode1: this.Code(),
        TenorType: this.TenorType.substr(0, 1),
        Tenor: this.Tenor,
        Price: this.IBPrice,
        CashCurrency: this.ddlNoteCcy,
        Exchange1: this.Exchange(),
        IssuerDateOffset: this.DaysCount,
        Upfront: this.upfront,
        SolveFor: this.SolveForvalue,
        Notional: this.Notional.replace(/,/g, ''),
        KIType: this.chkKI ? this.KIType : 'NONE',
        KI: this.chkKI ? this.KI : 'null',
        KOType: this.chkKO ? this.KOType : 'NONE',
        KO: this.chkKO ? this.KO : 'null',
        CouponFrequency: this.CouponFreq,
        CouponPercentage: this.CouponPer,
        StepDown: this.stepDown,
        CouponBarrier: this.CouponBarrier,
        CouponType: this.CouponType,
        FixedCoupon: this.FixedCoupon,
        NonCall: this.NonCall,
        token: this.Token,
      };
      // if (this.SolveForvalue === 'PRICE') {
      //     parameters['StrikePercentage'] = this.Strike;
      // } else {
      //     parameters['StrikePercentage'] = '0';
      // }

      if (this.SolveForvalue == 'CONVERSION_STRIKE') {
        parameters['StrikePercentage'] = '0';
      } else {
        parameters['StrikePercentage'] = this.Strike;
      }

      parameters['guaranteedDuration'] = '1';
      parameters['guaranteedDurationType'] = 'MONTH';

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
            const temp = that.PPDetails.split(',');
            for (let j = 0; j < temp.length; j++) {
              that.lpArr.push({
                rfq: temp[j].split('-')[1],
                lp: temp[j].split('-')[0],
                price: '-',
                clientyield: '',
                maxnotional: '',
                minnotional: '',
                timer: '-',
                pricerflag: 'false',
              });
            }
            // console.log(that.lpArr);
            if (that.PPDetails !== '') {
              that.interval = setInterval(() => {
                if (that.timeLeft > 0) {
                  that.PHXPriceResponse(that.PPDetails);
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

  PHXPriceResponse(PPDetails) {
    try {
      // if(this.Token==="")
      // {
      // this.Token = this.apifunction.AuthenticateUser();
      //console.log(this.Token);
      // }

      const webMethod = this.interfaceUrl + 'EQC/PHX/QuoteResponse';
      const that = this;

      const parameters = {
        userName: 'Mobile1',
        PPDetails: PPDetails,
        token: this.Token,
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
          // that.Token=data['token'];
          // //console.log(this.Token);
          that.Prices = JSON.parse(data['responseData']);
          setTimeout(function () {
            // document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
          }, 100);

          if (that.timeLeft > 0) {
            that.commonfunction.setPHXReceivedPrices(that.Prices);
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

  bookingBranchChanged(e) {
    try {
      this.selectedBookingBranch = e.target.value;
    } catch (error) {
      console.log(error);
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
      }
      if (this.SolveForvalue === 'COUPON') {
        this.CouponPer = selectedprice;
      }

      if (this.SolveForvalue === 'CONVERSION_STRIKE' && this.chkKI) {
        if (parseFloat(this.KI) > parseFloat(this.sortedAllPrices[0].price)) {
          this.ErrorMsg = 'Strike % should be greater than KI %';
          return false;
        }
      }

      this.orderflag = false;
      this.timeLeft = 0;
      this.bookOrderFlag = true;
      this.accordflag = true;

      // //console.log(this.Token);
      // this.lblOrderDetail = '- Order Details';

      // this.rmList = this.apifunction.RMList('Mobile1');
      // this.eqcRef = this.apifunction.EQCRef('PHX', this.Tenor, this.TenorType, 'Mobile1');
      // this.bookingBranch = this.apifunction.BookingBranch('Mobile1');
      // this.rmName = this.rmList[0].Rel_Manager_Name;
      // this.selectedBookingBranch = this.bookingBranch[0].BookingCenterCode;

      // this.ErrorMsg1 = '';
      // this.LimitAmount = 0;
      // // this.Token = this.apifunction.AuthenticateUser();
      // setTimeout(function () {
      //     document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
      // }, 100);
      // this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
      // this.priceFlag = false;

      // return false;
      if (this.tblAllocation.length > 1) {
        this.tblAllocation = [];
        this.tblAllocation.push('');
      }
      this.apifunction.RMList('Mobile1').subscribe((data) => {
        data = JSON.parse(data['responseData']);
        this.apifunction.SetToken(data['token']);
        this.rmList = data;

        this.apifunction
          .EQCRef('PHX', this.Tenor, this.TenorType, 'Mobile1')
          .subscribe((data) => {
            data = JSON.parse(data['responseData']);
            this.eqcRef = data;

            this.apifunction.BookingBranch('Mobile1').subscribe((data) => {
              try {
                data = JSON.parse(data['responseData']);
                this.bookingBranch = data;

                this.rmName = this.rmList[0].Rel_Manager_Name;
                this.selectedBookingBranch =
                  this.bookingBranch[0].BookingCenterCode;

                // this.Token = this.apifunction.AuthenticateUser();
                //console.log(this.Token);
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
              } catch (error) {
                console.log(error);
              }
            });
          });
      });
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  CheckKOValue(e) {
    try {
      const target = this.commonfunctions.GetEventTarget(e);
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
      const target = this.commonfunctions.GetEventTarget(e);
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
      // if (this.indexValue + 1 === this.commonfunctions.FCNStocksBucket.length) {
      // this.commonfunctions.SetMSPKO(parseInt(this.KO, 10));
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
  ChangeKI(e) {
    try {
      console.log(e);
      //console.log(e.value);
      // if (this.indexValue + 1 === this.commonfunctions.FCNStocksBucket.length) {
      this.commonfunctions.SetMSPKI(parseInt(this.KI, 10));
      // }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ChangeCoupon(e) {
    try {
      console.log(e);
      this.reset();
      // if (this.indexValue + 1 === this.commonfunctions.FCNStocksBucket.length) {
      this.commonfunctions.SetMSPCoupon(parseInt(this.CouponPer, 10));
      // }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  Clear() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.upfront = '0.50';
      this.CouponPer = '10.00';
      this.IBPrice = '99.50';
      this.Tenor = 6;
      this.TenorType = 'Month';
      this.settlementWeek = '1W';
      this.SolveForvalue = 'CONVERSION_STRIKE';
      this.DaysCount = 7;
      //this.shares = this.apifunction.loadShares('ELN');
      this.KOType = 'European';
      this.KIType = 'American';
      this.CouponFreq = 'MONTHLY';

      this.chkKI = true;
      this.chkKO = true;

      this.KO = '105.00';
      this.KI = '65.00';
      this.Notional = '1,000,000.00';
      this.Strike = '0.00';
      this.CouponBarrier = '10.00';
      this.stepDown = '5.00';
      this.ShareName = '';
      this.ShareBasket = [];
      this.orderflag = false;
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.lpArr = [];
      this.loadflag = false;
      this.orderID = '';
      this.ErrorMsg = '';
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];
      this.SelectedUnderlyingBasket = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
      };
      this.accordflag = false;
      this.bookOrderFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
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
  setNotional(e) {
    try {
      this.reset();

      const target = this.commonfunctions.GetEventTarget(e);
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
      this.updateShareBasket();
      this.reset();
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  IBpricechange() {
    try {
      this.reset();
      if (this.SolveForvalue !== 'PRICE') {
        this.upfront = (100 - parseFloat(this.IBPrice)).toFixed(2);
      } else {
        this.upfront = '0.00';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  reset() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.commonfunction.setPHXReceivedPrices({});

      this.clearFlag = true;
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.lpArr = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.orderflag = false;
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
      //this.priceFlag = true;
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
        this.Strike = '0.00';
      }
      if (this.SolveForvalue === 'COUPON') {
        this.CouponPer = '0.00';
      }
      if (this.SolveForvalue === 'PRICE') {
        this.IBPrice = '0.00';
        this.upfront = '0.00';
      }
      if (this.SolveForvalue === 'KNOCK_IN') {
        this.KI = '0.00';
      }

      if (this.SolveForvalue === 'AUTOCALL') {
        this.KO = '0.00';
      }
      // this.SelectedUnderlyingarray = [];
      // this.SelectedUnderlyingBasketArray = [];
      // this.SelectedUnderlyingBasket = {
      //     UnderlyingOne: {},
      //     UnderlyingTwo: {},
      //     UnderlyingThree: {},
      //     UnderlyingFour: {}
      // };

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
        return false;
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
        if (parseInt(this.NonCall) >= parseInt(this.monthcnt)) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'BIMONTHLY') {
        if (parseInt(this.NonCall) >= parseInt(this.monthcnt) / 2) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'QUARTERLY') {
        if (parseInt(this.NonCall) >= parseInt(this.monthcnt) / 3) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'SEMIANNUALLY') {
        if (parseInt(this.NonCall) >= parseInt(this.monthcnt) / 6) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }

      if (this.CouponFreq === 'ANNUALLY') {
        if (parseInt(this.NonCall) >= parseInt(this.monthcnt) / 12) {
          this.ErrorMsg = 'Non call periods cannot be greater than tenor.';
        }
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  scrollWin() {
    try {
      // window.scrollTo(0, 1000);
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('PHOENIX', 'PHOENIX', 'PHXBlotter');
      setTimeout(function () {
        //this.blotterDiv3.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
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
    if (this.blotterFlag === true) {
      this.blotterFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
    } else {
      this.blotterFlag = true;
      //this.fnEQConnectOrderHistory("BEN/DCN", "BEN", "BENBlotter");
      this.fnEQConnectOrderHistory('PHOENIX', 'PHOENIX', 'PHXBlotter');
      this.lblOrderBlotter = '- Order Blotter';

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

      const parameters = {
        userName: 'Mobile1',
        Notional: this.Notional.replace(/,/g, ''),
        QuoteRequestID: this.rfq,
        Upfront: this.upfront,
        ClientPrice: this.ClientPrice, //'99.0201',
        ClientYield: this.ClientYield,
        token: this.Token,
        orderType: this.OrderType,
        comment: 'MangeshWakode',
        confirmReason: 'MDW test',
        bookingBranch: this.selectedBookingBranch,
        rmName: this.rmName,
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
            that.orderID = that.rfq + '1';
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
        error: function (error) {
          console.error(error);
        },
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
      //this.KI = '0.00';
      this.KI = '';
    }
  }
  chkChangeKO(e) {
    console.log(e);
    this.reset();
    if (!this.chkKO) {
      // this.KO = '0.00';
      this.KO = '';
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
  onBlurLimitAmt(e) {
    try {
      console.log(e);
      if (!this.isValidParameters()) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  btnAllocationClick() {
    //console.log('click');
    this.tblAllocation.push('');
    return false;
  }
  chkAllocation(e) {
    this.ErrorMsg1 = '';
    const target = this.commonfunctions.GetEventTarget(e);
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
      //console.log((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value, this.allocatedNotional, this.remainingNotional, this.Notional);
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
      //console.log(this.allocatedNotional);
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
    const target = this.commonfunction.GetEventTarget(e);
    if (target.value === '' || isNaN(target.value)) target.value = '0.00';

    //console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
    this.allocatedNotional =
      parseFloat(this.allocatedNotional) +
      parseFloat(target.value) -
      parseFloat(this.previousNotional);
    //console.log(this.allocatedNotional);
    this.remainingNotional =
      parseFloat(this.Notional.replace(/,/g, '')) -
      parseFloat(this.allocatedNotional);
    //console.log("B4 Fixing 2 Decimal" + target.value);
    target.value = parseFloat(target.value).toFixed(2);
  }

  previousNotionals(e) {
    this.ErrorMsg1 = '';
    const target = this.commonfunction.GetEventTarget(e);
    if (target.value === '') {
      this.previousNotional = 0.0;
    } else {
      this.previousNotional = target.value;
    }

    //console.log(this.previousNotional);
  }

  confirmValidation() {
    for (let k = 0; k < this.lpArr.length; k++) {
      if (this.lpArr[k].rfq === this.rfq) {
        if (this.lpArr[k].timer == 0) {
          this.accordflag = false;
          this.bookOrderFlag = false;
          return false;
        }
      }
    }
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
    const target = this.commonfunctions.GetEventTarget(e);
    //console.log(target.id, e, target.checked);
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

    this.allocatedNotional = '0.00';
    this.remainingNotional = 1000000;
  }
}
