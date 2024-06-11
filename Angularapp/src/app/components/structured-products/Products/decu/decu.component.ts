import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
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
    DQsortBy(p): Array<T>;
  }
}
Array.prototype.DQsortBy = function (p): Array<any> {
  try {
    return this.slice(0).sort(function (a, b) {
      return Number(a[p]) < Number(b[p])
        ? 1
        : Number(a[p]) > Number(b[p])
        ? -1
        : 0;
    });
  } catch (error) {
    //console.log("Error:", error);
  }
};

@Component({
  selector: 'app-decu',
  templateUrl: './decu.component.html',
  styleUrls: ['./decu.component.scss'],
})
export class DecuComponent implements OnInit, OnDestroy {
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
  DaysCount: any;
  flag: boolean;
  shares: any;
  ShareName: string;
  commonfunction: EqcCommonfunctionsService;
  apifunction: EqcApifunctionService;
  shareCode: any;
  selectedShareIndex = 0;
  ShareDetails: any;
  CCY = [];
  ReceivedCCY: any;
  UnderlyingCurrency = 'USD';
  ddlNoteCcy: any;
  Exchange: any;
  strpair: any;
  ccyChange: any;
  ShareSpotRate: any;
  tddsData: any;
  settdate = '';
  matdate = '';
  expdate: string;
  SolveFor: any;
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
  SolveForvalue: any;
  ClientYield: any;
  Strike: any;
  settlementWeek: string;
  upfront: any;
  IBPrice: any;
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
  TenorType: any;
  interfaceUrl = environment.interfaceURL;
  Frequency: any;
  Guarantee: any;
  KO: any;
  NoOfShare: any;
  Notional: any;
  Token = '';
  timeLeft: number = 60;
  interval: any;
  PPDetails: any;
  orderID = '';
  ErrorMsg = '';
  loadflag: boolean;
  chkLeverage: boolean;
  OrderHistoryArray = [];
  orderflag: boolean;
  bookOrderFlag = false;
  accordflag: boolean;
  lblOrderDetail = '';
  lblOrderBlotter = '';
  OrderType: any;
  ClientPrice: any;
  Issuer: any;
  LimitShare: any;
  rmList: any;
  eqcRef: any;
  bookingBranch: any;
  ErrorMsg1: any;
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
  accuralDays: any;
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
      this.ddlNoteCcy = 'USD';
      this.UnderlyingCurrency = 'USD';
      this.loadflag = false;
      this.loadflag = false;
      this.accordflag = false;
      this.Issuer = '';
      this.minNotional = 0;
      this.maxNotional = 0;
      this.Notional = '0.00';
      this.remainingNotional = '1000';
      this.totalNotional = '1000';
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
        this.reset();
        this.commonfunction.ClearPricesFromMultiToDealEntry();
        this.Tenor = 6;
        this.upfront = '0.50';
        this.IBPrice = '99.50';
        this.KO = '98.00';
        this.settlementWeek = '1W';
        this.TenorType = 'MONTH';
        this.SolveForvalue = 'Strike';
        this.DaysCount = 7;
        this.apifunction.loadShares().subscribe((Res) => {
          if (Res) {
            this.shares = JSON.parse(Res['responseData']);
            this.apifunction.SetToken(Res.token);
          }
        });
        this.UnderlyingCurrency = 'USD';
        this.Frequency = 'Monthly';
        this.commonfunction.Currency.subscribe((cu) => (this.ddlNoteCcy = cu));
        //console.log(this.ddlNoteCcy);
        this.sortedAllPrices = [];
        this.NoOfShare = '1000';
        this.Strike = '0.00';
        this.Guarantee = '1';
        this.Notional = '0.00';
        this.chkLeverage = true;
        this.OrderType = 'Limit';
        this.lblOrderDetail = '+ Order Details';
        this.lblOrderBlotter = '+ Order Blotter';
        this.remainingNotional = '1000';
        this.totalNotional = '1000';

        // this.commonfunction.setUnderlyingCurrency('USD');
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

        this.commonfunctions.DQSignalRPrices.subscribe((prices) => {
          this.AllPrices = [];
          try {
            if (prices) {
              this.sortedAllPrices = [];
              for (let i = 0; i < prices.length; i++) {
                if (prices[i].AccDecOUT > 0) {
                  // console.log(this.lpArr, prices[i].EP_ER_QuoteRequestId);
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = prices[i].AccDecOUT;
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
                    price: prices[i].AccDecOUT,
                    clientyield: prices[i].ClientYield,
                    maxnotional: prices[i].MaxNotional,
                    minnotional: prices[i].MinNotional,
                    solveFor: this.SolveForvalue,
                  });
                }
              }
              this.sortedAllPrices = this.AllPrices.DQsortBy('price');
              console.log('sorted return best ', this.sortedAllPrices);
              if (this.sortedAllPrices.length > 0) {
                this.loadflag = false;
                if (this.SolveForvalue === 'Strike') {
                  this.Strike = this.sortedAllPrices[0].price;
                }
                if (this.SolveForvalue === 'UPFRONT') {
                  this.upfront = (this.sortedAllPrices[0].price / 100).toFixed(
                    4
                  );
                }

                //console.log(this.sortedAllPrices);
              }
            }
          } catch (ex) {
            // console.log('error in the dq pricing', ex)
          }
        });
        $('#loading').hide();
      } catch (error) {
        //console.log("Error:", error);
      }
    });
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

  CcyChange(e) {
    try {
      this.reset();
      this.commonfunction.setUnderlyingCurrency(e.target.value);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ChangeIndex(e) {
    try {
      console.log(e);
      // this.commonfunctions.selectedShareIndex = 0;
      this.selectedShareIndex = 0;
      this.flag = true;
      this.shareCode = '';
      this.selectedBIndex = 0;
      //console.log(this.elem.nativeElement.querySelectorAll('.SelectorBox'));
      // this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }
  selectShare(e) {
    try {
      console.log(e);
      this.flag = false;
      if ($('.HoverSuggestion').data('share') != undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      this.ShareName = this.shareCode;
      //console.log(this.shareCode);
      this.showUnderlying(
        SearchUnderlyingPipe.prototype.transform(
          this.shares,
          this.shareCode,
          1
        )[0]
      );
      this.selectShareEvent.next(this.shareCode);
    } catch (Error) {
      //console.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }
  showUnderlying(item) {
    try {
      this.reset();
      // this.commonfunction.clearLPSection(false);
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.flag = false;
      this.ShareName = item.LongName;
      //console.log(this.ShareName);
      // this.commonfunction.IsDisabled(false);
      // ((<HTMLInputElement>document.getElementById('txtShare')).value) = this.ShareName;
      this.shareCode = item.Code;
      this.priceFlag = true;
      this.commonfunction.selectedShareIndex = 0;
      this.ddlNoteCcy = item.Ccy;
      this.ccyChange = item.Ccy;
      this.ExchangeCode = item.ExchangeCode;
      this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;
      this.strpair = item.Code + ' - ' + item.Ccy;
      // this.ShareSpotRate = this.apifunction.loadShareSpotRate(this.strpair);
      //this.commonfunction.setSpotRate(this.ShareSpotRate);
      // //console.log(this.Exchange);
      // this.tddsData = this.apifunction.getTDSSData(item.Code);
      // this.commonfunction.setTddsData(this.tddsData);
      this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);
      // this.commonfunction.setsharename = item.LongName;
      this.commonfunction.setShareCode(item.Code);
      this.commonfunction.setExchangeCode(this.Exchange);
      //console.log(this.ddlNoteCcy);
      this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);
      // (<HTMLInputElement>document.getElementById('Error_Msg')).innerHTML = '';
      // if ((<HTMLInputElement>document.getElementById('Error_Msg')).innerHTML === 'Please enter share') {
      // (<HTMLInputElement>document.getElementById('Error_Msg')).innerHTML = '';
      // }
      this.LimitShare = this.shareCode;
      this.LimitAmount = 0;
      this.calculateNotional('Mobile1');
      this.namefield.nativeElement.focus();
    } catch (error) {
      //console.log("Error:", error);
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
  setSolveFor(e) {
    try {
      this.reset();
      const target = this.commonfunctions.GetEventTarget(e);
      this.SolveFor = target.value;
      //console.log('change: ' + target.value);
      if (this.SolveForvalue === 'UPFRONT') {
        this.upfront = '0.00';
        this.Strike = '98.00';
      } else {
        this.upfront = '0.50';
        this.Strike = '0.00';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  AccumPrice(PPID, pricingID) {
    try {
      console.log(pricingID);
      // this.Token = this.apifunction.AuthenticateUser();
      this.clearFlag = false;
      const that = this;
      const today = new Date();
      const monthNames = [
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
      const webMethod = this.interfaceUrl + 'EQC/AccumDecum/Quote';
      let GuaranteedDuration: string;
      let GuaranteedDurationType: string;
      if (this.Frequency === 'Monthly') {
        GuaranteedDuration = '' + this.Guarantee;
        GuaranteedDurationType = 'MONTH';
      } else if (this.Frequency === 'BiWeekly') {
        GuaranteedDuration = this.Guarantee.toString();
        GuaranteedDurationType = 'WEEK';
      }

      let LeverageRatio: string;
      if (this.chkLeverage) {
        LeverageRatio = '2';
      } else {
        LeverageRatio = '1';
      }

      const parameters = {
        userName: 'Mobile1',
        ER_PP_ID: PPID,
        type: 'DECUMULATOR',
        StrikePercentage: this.SolveForvalue === 'Strike' ? '0.0' : this.Strike,
        UnderlyingCode: this.shareCode,
        TenorType: this.TenorType,
        Tenor: this.Tenor,
        CashOrderQuantity: '10',
        CashCurrency: this.ddlNoteCcy,
        TransactionTime:
          today.getDate() +
          '-' +
          monthNames[today.getMonth()] +
          '-' +
          today.getFullYear() +
          ' ' +
          today.getHours() +
          ':' +
          today.getMinutes() +
          ':' +
          today.getSeconds(),
        ProductDefinition:
          'DECUMULATOR' +
          (this.SolveForvalue === 'Strike' ? '0.0' : '0.0') +
          this.shareCode,
        Exchange: this.ExchangeCode,
        Entity_ID: '5',
        Template_ID: '4',
        Frequency: this.Frequency,
        LeverageRatio: LeverageRatio,
        Upfront:
          this.SolveForvalue === 'Strike'
            ? (parseFloat(this.upfront) * 100).toString()
            : '0',
        SolveFor: this.SolveForvalue,
        KOSettlement: 'KO+1',
        KOPercentage: this.KO,
        EntityName: 'BOS PB',
        Remark2: '',
        GuaranteedDuration: GuaranteedDuration,
        GuaranteedDurationType: GuaranteedDurationType,
        token: this.Token,
        NoOfShare: this.NoOfShare,
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
                  that.AccPriceResponse(that.PPDetails);
                  that.timeLeft = that.timeLeft - 5;
                } else if (that.timeLeft === 0) {
                  that.loadflag = false;
                  clearInterval(that.interval);
                }
              }, 5000);
            }
          }
        },
        error: function () {
          //console.log(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  AccPriceResponse(PPDetails) {
    try {
      // if(this.Token==="")
      // {
      // this.Token = this.apifunction.AuthenticateUser();
      //console.log(this.Token);
      // }

      const webMethod = this.interfaceUrl + 'EQC/ACCDEC/QuoteResponse';
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
            that.commonfunction.setDQReceivedPrices(that.Prices);
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
      if (lp1.trim() != '') {
        this.Issuer = lp1;
        this.minNotional = minnotional1;
        this.maxNotional = maxnotional1;
        this.ClientYield = clientyield1;
        this.rfq = selectedrfq;
      } else {
        this.Issuer = this.sortedAllPrices[0].lp;
        this.minNotional = this.sortedAllPrices[0].minnotional;
        this.maxNotional = this.sortedAllPrices[0].maxnotional;
        this.ClientYield = this.sortedAllPrices[0].clientyield;
        this.rfq = this.sortedAllPrices[0].rfq;
      }

      console.log('Order Booking initiated...', this.Issuer);

      if (this.SolveForvalue === 'Strike') {
        this.Strike = selectedprice;
      }
      if (this.SolveForvalue === 'UPFRONT') {
        this.upfront = selectedprice / 100;
      }

      this.timeLeft = 0;
      // this.Token = this.apifunction.AuthenticateUser();
      ////console.log(this.Token);
      this.bookOrderFlag = true;
      this.accordflag = true;

      if (this.tblAllocation.length > 1) {
        this.tblAllocation = [];
        this.tblAllocation.push('');
      }
      this.apifunction.RMList('Mobile1').subscribe((data) => {
        data = JSON.parse(data['responseData']);
        this.apifunction.SetToken(data['token']);
        this.rmList = data;

        this.apifunction
          .EQCRef('DECU', this.Tenor, this.TenorType, 'Mobile1')
          .subscribe((data) => {
            data = JSON.parse(data['responseData']);
            this.eqcRef = data;

            this.apifunction.BookingBranch('Mobile1').subscribe((data) => {
              try {
                if (data) {
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
                    parseFloat(this.NoOfShare.replace(/,/g, '')) -
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
          });
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setDuration(settlement: string, maturity: string) {
    try {
      const start = new Date(maturity);
      const end = new Date(settlement);
      let days = 0;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      if (start.getTime() > end.getTime()) {
        const millisBetween = start.getTime() - end.getTime();
        days = millisBetween / millisecondsPerDay;
      }
      return Math.abs(Math.floor(days));
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  bookingBranchChanged(e) {
    try {
      this.selectedBookingBranch = e.target.value;
    } catch (error) {
      console.log(error);
    }
  }

  Price() {
    try {
      if (
        this.Tenor === 0 ||
        (this.Tenor > 60 && this.TenorType === 'Month') ||
        (this.Tenor > 5 && this.TenorType === 'Year')
      ) {
        this.ErrorMsg = 'Please enter valid tenor';
        return false;
      }
      if (
        this.NoOfShare === '0' ||
        this.NoOfShare === '0.00' ||
        this.NoOfShare === ''
      ) {
        this.ErrorMsg = 'Please enter valid daily no. of shares';
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

      if (this.ShareName === '') {
        this.ErrorMsg = 'Please select valid share';
        return false;
      }
      if (this.SolveForvalue !== 'Strike' && parseFloat(this.Strike) < 100) {
        this.ErrorMsg = 'Strike % should be greater than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'UPFRONT' &&
        (this.upfront === '0.00' || this.upfront === '' || this.upfront === '0')
      ) {
        this.ErrorMsg =
          'Upfront (%) should be greater than 0 and less than 100';
        return false;
      }

      if (this.KO === '' || this.KO === '0.00' || this.KO === '0') {
        this.ErrorMsg = 'Please enter valid KO % of Intial';
        return false;
      }
      if (parseFloat(this.KO) > 98) {
        this.ErrorMsg = 'KO % should be less than or equal to 98';
        return false;
      }

      if (
        parseFloat(this.Guarantee) > this.Tenor / 3 &&
        this.TenorType === 'MONTH'
      ) {
        this.ErrorMsg =
          'Guarantee period should be less than or equal to 1/3 of tenor.';
        return false;
      }

      if (this.Tenor == 1 && this.TenorType === 'YEAR') {
        if (parseFloat(this.Guarantee) / 4) {
          this.ErrorMsg =
            'Guarantee period should be less than or equal to 1/3 of tenor.';
          return false;
        }
      }

      if (this.ErrorMsg === '') {
        this.timeLeft = 0;
        this.orderID = '';
        this.orderflag = false;
        this.AllPrices = [];
        this.lpArr = [];
        this.sortedAllPrices = [];
        this.RFQIDArray = [];
        this.timerStarted = false;
        this.loadflag = true;
        this.AccumPrice('', '');
      }
      return false;
    } catch (error) {
      //console.log('Error:', error);
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
      this.KO = '98.00';
      this.settlementWeek = '1W';
      this.TenorType = 'MONTH';
      this.SolveForvalue = 'Strike';
      this.DaysCount = 7;
      //this.shares = this.apifunction.loadShares('ELN');
      this.UnderlyingCurrency = 'USD';
      this.Frequency = 'Monthly';
      this.sortedAllPrices = [];
      this.NoOfShare = '10';
      this.Strike = '0.00';
      this.Guarantee = '1';
      this.loadflag = false;
      this.Notional = '0.00';
      this.lpArr = [];
      this.AllPrices = [];
      this.ShareName = '';
      this.orderID = '';
      this.ErrorMsg = '';
      this.orderflag = false;
      this.shareCode = '';
      this.accordflag = false;
      this.bookOrderFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
      this.OrderType = 'Limit';
      this.priceFlag = false;
      this.clearFlag = true;
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  reset() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.commonfunction.setDQReceivedPrices({});

      this.clearFlag = true;
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.lpArr = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      this.orderflag = false;
      this.accordflag = false;
      this.bookOrderFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
      this.tblAllocation = [];
      this.tblAllocation.push('');
      this.allocatedNotional = '0';
      this.remainingNotional = this.NoOfShare; // parseFloat(this.Notional.toString()).toFixed(2);
      this.totalNotional = this.NoOfShare; //parseFloat(this.Notional.toString()).toFixed(2);
      this.priceFlag = true;
      this.blotterFlag = false;
      if (this.SolveForvalue === 'UPFRONT') {
        this.upfront = '0.00';
      } else {
        this.Strike = '0.00';
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
        (this.Tenor > 60 && this.TenorType === 'MONTH') ||
        (this.Tenor > 5 && this.TenorType === 'YEAR')
      ) {
        this.ErrorMsg = 'Please enter valid tenor.';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  priceValidation(priceValue: any, pricestr: string) {
    try {
      //console.log(priceValue);
      if (pricestr === 'Strike (%)' && parseFloat(priceValue) <= 100) {
        this.ErrorMsg = 'Strike % should be greater than 100';
        return false;
      }
      if (
        pricestr !== 'Strike (%)' &&
        (priceValue === '' ||
          parseFloat(priceValue) <= 0 ||
          parseFloat(priceValue) >= 100)
      ) {
        this.ErrorMsg =
          pricestr + ' should be greater than 0 and less than 100';
      }
      this.IBPrice = 100 - this.upfront;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  calculateNotional(userName: any) {
    try {
      // this.Token = this.apifunction.AuthenticateUser();

      const webMethod = this.interfaceUrl + 'EQC/AccrualDays';
      const that = this;

      const parameters = {
        UserName: userName,
        Exchange: this.ExchangeCode,
        Tenor: this.Tenor,
        TenorType: this.TenorType.substr(0, 1),
        token: this.Token,
      };

      //console.log(parameters);
      $.ajax({
        async: false,
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
          that.fnGetSpot(data['responseData'], 'Mobile1');
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  fnGetSpot(accuralDays: any, userName: any) {
    try {
      // this.Token = this.apifunction.AuthenticateUser();

      this.accuralDays = accuralDays;

      const webMethod = this.interfaceUrl + 'EQC/SpotInfo';
      const that = this;

      const parameters = {
        UserName: userName,
        share: this.shareCode,
        token: this.Token,
      };

      //console.log(parameters);
      $.ajax({
        async: false,
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
          //                    that.Notional = (accuralDays * parseFloat(JSON.parse(data["responseData"])[0]['Spot']) * that.NoOfShare).toFixed(2);
          that.Notional = Number(
            Number(accuralDays) *
              Number(JSON.parse(data.responseData)[0].Spot) *
              Number(that.NoOfShare)
          ).toFixed(2);
          //console.log(that.Notional);
          that.remainingNotional = that.NoOfShare; // that.Notional;
          that.totalNotional = that.NoOfShare; // that.Notional;
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  scrollWin() {
    try {
      // window.scrollTo(0, 1000);
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('ACCDAC', 'DECUMULATOR', 'ACCDACBlotter');
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

      ////console.log( today.getDate()+ '-' + monthNames[today.getMonth()] + '-' + today.getFullYear());

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
      this.fnEQConnectOrderHistory('ACCDAC', 'DECUMULATOR', 'ACCDACBlotter');
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
        // 'Notional': this.Notional,
        Notional: this.NoOfShare,
        QuoteRequestID: this.rfq,
        Upfront: this.upfront,
        ClientPrice: this.ClientPrice, //'99.0201',//  this.ClientPrice,
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
            // that.fnEQConnectOrderHistory("ACCDAC", "DECUMULATOR", "ACCDACBlotter");
            // that.lblOrderBlotter='- Order Blotter';
            // document.getElementById("blotterDiv").scrollIntoView();
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

  ChangeKO(e) {
    try {
      console.log(e);
      this.reset();

      if (this.KO === '' || this.KO === '0.00' || this.KO === '0') {
        this.ErrorMsg = 'Please enter valid KO % of Intial';
      }
      if (parseFloat(this.KO) > 98) {
        this.ErrorMsg = 'KO % should be less than or equal to 98';
      }
    } catch (error) {
      //console.log("Error:", error);
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
        parseFloat(this.NoOfShare) - parseFloat(this.allocatedNotional);
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
        parseFloat(this.NoOfShare) - parseFloat(this.allocatedNotional);
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
      parseFloat(this.NoOfShare) - parseFloat(this.allocatedNotional);
    //console.log("B4 Fixing 2 Decimal" + target.value);
    //target.value = parseFloat(target.value).toFixed(2);
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
    //console.log(this.allocatedNotional, this.maxNotional, this.minNotional);
    // if (parseFloat(this.allocatedNotional) > parseFloat(this.maxNotional)) {
    //     this.ErrorMsg1 = "Can not place order. Notional size is greater than the maximum permitted.";
    //     return;
    // }
    // if (parseFloat(this.allocatedNotional) < parseFloat(this.minNotional)) {
    //     this.ErrorMsg1 = "Can not place order. Notional size is less than the minimum permitted.";
    //     return;
    // }
    for (let k = 0; k < this.lpArr.length; k++) {
      if (this.lpArr[k].rfq === this.rfq) {
        if (this.lpArr[k].timer == 0) {
          this.accordflag = false;
          this.bookOrderFlag = false;
          return false;
        }
      }
    }

    if (parseFloat(this.allocatedNotional) <= 0) {
      this.ErrorMsg1 = 'Please enter valid Notional.';
      return;
    }

    if (parseFloat(this.allocatedNotional) !== parseFloat(this.NoOfShare)) {
      this.ErrorMsg1 = 'Sum of shares is not equal to Order Quantity.';
      return;
    }
    var i = 0;
    this.tblAllocation.forEach(() => {
      //console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
      if (
        (<HTMLInputElement>document.getElementById('Notional' + i)).value ===
          '0' &&
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
          parseFloat(this.NoOfShare) - parseFloat(this.allocatedNotional);
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
          parseFloat(this.NoOfShare) - parseFloat(this.allocatedNotional);
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
    this.ErrorMsg1 = '';
    this.remainingNotional = 1000;
  }
}
