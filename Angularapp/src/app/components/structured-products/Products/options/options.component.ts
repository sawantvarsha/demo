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

declare global {
  interface Array<T> {
    OptionssortBy(p): Array<T>;
  }
}
Array.prototype.OptionssortBy = function (p): Array<any> {
  try {
    if (this !== undefined) {
      if (this.length > 0) {
        return this.slice(0).sort(function (a, b) {
          return Number(a[p]) < Number(b[p])
            ? 1
            : Number(a[p]) > Number(b[p])
            ? -1
            : 0;
        });
      }
    }
  } catch (error) {
    //console.log("Error:", error);
  }
};

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit, OnDestroy {
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
  // signalr: SignalRService;
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
  interfaceUrl = environment.interfaceURL;
  PDDCode: any;
  KO: any;
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
  Premium: any;
  Notional: any;
  NoOfShares: any;
  Option: any;
  SettlementType: any;
  side: any;
  SettlementCcy: any;
  Token = '';
  timeLeft: number = 60;
  interval: any;
  PPDetails: any;
  orderID = '';
  ClientPrice: any;
  loadflag: boolean;
  ErrorMsg = '';
  OrderHistoryArray = [];
  orderflag: boolean;
  rdbNotional: string = 'false';
  bookOrderFlag = false;
  OrderType: any;
  LimitShare: any;
  Issuer: any;
  accordflag: boolean;
  lblOrderDetail = '';
  lblOrderBlotter = '';
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
  clearFlag: boolean;
  estNotional: any;
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
      this.SettlementCcy = 'USD';
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
    setTimeout(() => {
      try {
        this.accordflag = false;
        this.reset();
        this.commonfunction.ClearPricesFromMultiToDealEntry();
        this.Tenor = 6;
        this.upfront = '0.50';
        this.IBPrice = '99.50';
        this.settlementWeek = '1W';
        this.TenorType = 'Month';
        this.SolveForvalue = 'Premium';
        this.DaysCount = 7;
        this.apifunction.loadShares().subscribe((Res) => {
          if (Res) {
            this.shares = JSON.parse(Res['responseData']);
            this.apifunction.SetToken(Res.token);
          }
        });

        this.UnderlyingCurrency = 'USD';
        this.sortedAllPrices = [];
        this.Strike = '98.50';
        this.Premium = '0.00';
        this.Notional = '1,000,000.00';
        this.NoOfShares = '0';
        this.side = 'Sell';
        this.Option = 'put';
        this.SettlementType = 'Physical';
        this.OrderType = 'Limit';
        this.lblOrderDetail = '+ Order Details';
        this.lblOrderBlotter = '+ Order Blotter';
        this.allocatedNotional = '0.00';
        this.remainingNotional = '1,000,000.00';
        this.totalNotional = '1,000,000.00';
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
        // const that = this;

        // const today = new Date();
        // this.tradedate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        this.commonfunctions.EQOSignalRPrices.subscribe((prices) => {
          this.AllPrices = [];
          try {
            if (prices) {
              this.sortedAllPrices = [];
              for (let i = 0; i < prices.length; i++) {
                if (prices[i].EQOOUT > 0) {
                  // console.log(this.lpArr, prices[i].EP_ER_QuoteRequestId);
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = prices[i].EQOOUT;
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
                    price: prices[i].EQOOUT,
                    solvefor: this.SolveForvalue,

                    clientyield: prices[i].ClientYield,
                    maxnotional: prices[i].MaxNotional,
                    minnotional: prices[i].MinNotional,
                  });
                }
              }
              this.sortedAllPrices = this.AllPrices.OptionssortBy('price');
              if (this.sortedAllPrices.length > 0) {
                this.loadflag = false;
                if (this.SolveForvalue === 'Strike') {
                  this.Strike = this.sortedAllPrices[0].price;
                }
                if (this.SolveForvalue === 'Premium') {
                  this.Premium = this.sortedAllPrices[0].price;
                }
                //console.log(this.sortedAllPrices);
              }
            }
          } catch (ex) {
            // console.log('Error in the optionsss":', ex)
          }
        });
        $('#loading').hide();
      } catch (error) {
        //console.log("Error:", error);
      }
    });
  }
  Settlementweekschange() {
    try {
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
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.flag = false;
      this.ShareName = item.LongName;
      //console.log(this.ShareName);
      this.commonfunction.selectedShareIndex = 0;
      this.ddlNoteCcy = item.Ccy;
      this.ccyChange = item.Ccy;
      this.ExchangeCode = item.ExchangeCode;
      this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;
      this.strpair = item.Code + ' - ' + item.Ccy;
      // this.ShareSpotRate = this.apifunction.loadShareSpotRate(this.strpair);
      this.shareCode = item.Code;
      this.priceFlag = true;
      // this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);
      // this.commonfunction.setShareCode(item.Code);
      // this.commonfunction.setExchangeCode(this.Exchange);
      //console.log(this.ddlNoteCcy);
      //this.selectedDates = this.apifunction.SetDates(this.DaysCount, this.shareCode, this.Tenor + this.TenorType.substr(0, 1),'Mobile1');
      this.apifunction
        .EQOSetDates(
          this.DaysCount,
          this.shareCode,
          this.Tenor + this.TenorType.substr(0, 1),
          'Mobile1'
        )
        .subscribe((Res) => {
          if (Res) {
            this.selectedDates = JSON.parse(Res['responseData'])[0];
            this.settdate = this.selectedDates.ValueDate;
            this.matdate = this.selectedDates.MaturityDate;
            this.expdate = this.selectedDates.FixingDate;
            this.tradedate = this.selectedDates.TradeDate;
          }
        });
      //console.log(this.selectedDates);

      this.commonfunction.setUnderlyingCurrency(this.ddlNoteCcy);
      //  (<HTMLInputElement>document.getElementById('Error_Msg')).innerHTML = '';
      this.LimitShare = this.shareCode;
      this.LimitAmount = 0;
      this.namefield.nativeElement.focus();

      if (this.rdbNotional === 'true') {
        this.fnGetSpot('Mobile1');
      }
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
      if (this.SolveForvalue === 'Premium') {
        this.Strike = '98.50';
        this.Premium = '0.00';
        this.upfront = '0.20';
      } else {
        this.upfront = '0.20';
        this.Strike = '0.00';
      }
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

  EQOPrice(PPID, pricingID) {
    try {
      console.log(pricingID);
      // this.Token = this.apifunction.AuthenticateUser();
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'EQC/EQO/Quote';
      const that = this;

      const parameters = {
        userName: 'Mobile1',
        PPID: PPID,
        BarrierPercentage: '',
        InterBankPrice: this.IBPrice,
        UnderlyingCode1: this.shareCode,
        TenorType: this.TenorType.substr(0, 1),
        Tenor: this.Tenor,
        Price: this.IBPrice,
        CashCurrency: this.ddlNoteCcy,
        Exchange1: this.ExchangeCode,
        IssuerDateOffset: this.DaysCount,
        Upfront: this.upfront,
        SolveFor: this.SolveForvalue,
        LongDays: this.setDuration(this.settdate, this.matdate),
        PDD: '',
        // 'SettlementDate': (new Date(new Date(this.settdate).getFullYear(),
        //     new Date(this.settdate).getMonth() + 1,
        //     new Date(this.settdate).getDay()).getTime()).toString(),
        // 'ExpiryDate': (new Date(new Date(this.expdate).getFullYear(),
        //     new Date(this.expdate).getMonth() + 1,
        //     new Date(this.expdate).getDay()).getTime()).toString(),
        // 'MaturityDate': (new Date(new Date(this.matdate).getFullYear(),
        //     new Date(this.matdate).getMonth() + 1,
        //     new Date(this.matdate).getDay()).getTime()).toString(),
        SettlementDate: this.settdate,
        ExpiryDate: this.expdate,
        MaturityDate: this.matdate,
        Notional: parseFloat(this.Notional.replace(/,/g, '')).toFixed(2),
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
        Definition:
          'EQO' +
          this.settdate +
          this.expdate +
          this.matdate +
          this.Strike +
          '.00' +
          this.shareCode,
        SecuritySubType: this.Option,
        SettlementType: this.SettlementType,
        side: this.side,
        SettlementCcy: this.SettlementCcy,
        token: this.Token,
        NoOfShare: this.NoOfShares,
      };
      if (this.SolveForvalue === 'Premium') {
        parameters['StrikePercentage'] = this.Strike;
      } else {
        parameters['StrikePercentage'] = '0.00';
      }
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
                  that.EQOPriceResponse(that.PPDetails);
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

  EQOPriceResponse(PPDetails) {
    try {
      // if(this.Token==="")
      // {
      // this.Token = this.apifunction.AuthenticateUser();
      //console.log(this.Token);
      // }

      const webMethod = this.interfaceUrl + 'EQC/EQO/QuoteResponse';
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
            that.commonfunction.setEQOReceivedPrices(that.Prices);
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

  public SetTimerStatus(timerStatus: boolean) {
    try {
      console.log(timerStatus);
      // this.signalr.SetTimerStatus(timerStatus);
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
        this.rdbNotional === 'false' &&
        (this.Notional === '0' ||
          this.Notional === '0.00' ||
          this.Notional === '')
      ) {
        this.ErrorMsg = 'Please enter valid notional';
        return false;
      }

      if (this.ShareName === '') {
        this.ErrorMsg = 'Please select valid share';
        return false;
      }

      if (
        this.SolveForvalue !== 'Strike' &&
        (this.Strike === '0.00' || this.Strike === '' || this.Strike === '0')
      ) {
        this.ErrorMsg = 'Strike (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'Premium' &&
        (this.Premium === '0.00' || this.Premium === '' || this.Premium === '0')
      ) {
        this.ErrorMsg =
          'Premium (%) should be greater than 0 and less than 100';
        return false;
      }
      if (
        this.rdbNotional === 'true' &&
        (this.NoOfShares === '0' ||
          this.NoOfShares === '0.00' ||
          this.NoOfShares === '')
      ) {
        this.ErrorMsg = 'Please enter valid  no. of shares';
        return false;
      }
      if (this.ErrorMsg == '') {
        this.timeLeft = 0;
        this.orderID = '';
        this.orderflag = false;
        this.AllPrices = [];
        this.lpArr = [];
        this.sortedAllPrices = [];
        this.RFQIDArray = [];
        this.timerStarted = false;
        this.loadflag = true;
        this.EQOPrice('', '');
      }
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
  Clear() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.Tenor = 6;
      this.upfront = '1.00';
      this.IBPrice = '99.50';
      this.settlementWeek = '1W';
      this.TenorType = 'Month';
      this.SolveForvalue = 'Premium';
      this.DaysCount = 7;
      this.UnderlyingCurrency = 'USD';
      this.sortedAllPrices = [];
      this.Strike = '98.50';
      this.Premium = '0.00';
      this.Notional = '1000000.00';
      this.rdbNotional = 'false';
      this.NoOfShares = '0';
      this.side = 'Sell';
      this.Option = 'put';
      this.SettlementType = 'Physical';
      this.ShareName = '';
      this.loadflag = false;
      this.orderID = '';

      this.lpArr = [];
      this.AllPrices = [];
      this.settdate = '';
      this.matdate = '';
      this.expdate = '';
      this.tradedate = '';
      this.orderflag = false;
      this.ErrorMsg = '';
      this.shareCode = '';
      this.bookOrderFlag = false;
      this.accordflag = false;
      this.lblOrderBlotter = '+ Order Blotter';
      this.lblOrderDetail = '+ Order Details';
      this.OrderType = 'Limit';
      this.priceFlag = false;
      this.clearFlag = true;
      this.estNotional = '';
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }
  changeTenor(event) {
    try {
      this.reset();
      console.log(event);
      if (
        this.Tenor == 0 ||
        (this.Tenor > 60 && this.TenorType === 'Month') ||
        (this.Tenor > 5 && this.TenorType === 'Year')
      ) {
        this.ErrorMsg = 'Please enter valid tenor.';
      } else {
        this.apifunction
          .EQOSetDates(
            2,
            this.shareCode,
            this.Tenor + this.TenorType.substr(0, 1),
            'Mobile1'
          )
          .subscribe((Res) => {
            if (Res) {
              this.selectedDates = JSON.parse(Res['responseData'])[0];
              this.settdate = this.selectedDates.ValueDate;
              this.matdate = this.selectedDates.MaturityDate;
              this.expdate = this.selectedDates.FixingDate;
              this.tradedate = this.selectedDates.TradeDate;
            }
          });

        // this.selectedDates = this.apifunction.EQOSetDates(2, this.shareCode, this.Tenor + this.TenorType.substr(0, 1), 'Mobile1');
        // //console.log(this.selectedDates);
        // this.settdate = this.selectedDates.ValueDate;
        // this.matdate = this.selectedDates.MaturityDate;
        // this.expdate = this.selectedDates.FixingDate;
        // this.tradedate = this.selectedDates.TradeDate
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  reset() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.commonfunction.setEQOReceivedPrices({});

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
      if (this.rdbNotional === 'false') {
        this.remainingNotional = parseFloat(
          this.Notional.toString().replace(/,/g, '')
        ).toFixed(2);
        this.totalNotional = parseFloat(
          this.Notional.toString().replace(/,/g, '')
        ).toFixed(2);
      }
      if (this.rdbNotional === 'true') {
        this.remainingNotional = parseFloat(
          this.NoOfShares.toString().replace(/,/g, '')
        ).toFixed(2);
        this.totalNotional = parseFloat(
          this.NoOfShares.toString().replace(/,/g, '')
        ).toFixed(2);
      }
      // this.priceFlag = true;
      this.blotterFlag = false;
      if (this.SolveForvalue === 'Premium') {
        this.Premium = '0.00';
      } else {
        this.Strike = '0.00';
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  priceValidation(priceValue: any, pricestr: string) {
    try {
      //console.log(priceValue);
      if (
        priceValue === '' ||
        parseFloat(priceValue) <= 0 ||
        parseFloat(priceValue) >= 100
      ) {
        this.ErrorMsg =
          pricestr + ' should be greater than 0 and less than 100';
      }
      this.IBPrice = 100 - this.upfront;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  scrollWin() {
    try {
      // window.scrollTo(0, 1000);

      //this.openOrderBlotter();
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('OTCOPTION', 'Equity', 'EQOBlotter');
      setTimeout(function () {
        // document.getElementById("blotterDiv1").scrollIntoView({ behavior: 'smooth' });
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
  bookOrder(
    selectedrfq: any,
    lp1: any,
    minnotional1: any,
    maxnotional1: any,
    clientyield1: any,
    selectedprice: any
  ) {
    try {
      //console.log(this.totalNotional);
      console.log('Order Booking initiated...', lp1);
      this.Issuer = lp1;
      this.minNotional = minnotional1;
      this.maxNotional = maxnotional1;
      this.ClientYield = clientyield1;
      this.rfq = selectedrfq;

      if (this.SolveForvalue === 'Strike') {
        this.Strike = selectedprice;
      }
      if (this.SolveForvalue === 'Premium') {
        this.Premium = selectedprice;
      }

      //console.log('Order Booking initiated...');
      this.timeLeft = 0;
      this.bookOrderFlag = true;
      this.accordflag = true;
      // this.Token = this.apifunction.AuthenticateUser();

      // this.rmList = this.apifunction.RMList('Mobile1');
      // this.eqcRef = this.apifunction.EQCRef('ELN', this.Tenor, this.TenorType, 'Mobile1');
      // this.bookingBranch = this.apifunction.BookingBranch('Mobile1');
      // this.rmName = this.rmList[0].Rel_Manager_Name;
      // this.selectedBookingBranch = this.bookingBranch[0].BookingCenterCode;

      // //console.log(this.Token);
      // this.lblOrderDetail = '- Order Details';
      // this.ErrorMsg1 = '';
      // this.LimitAmount = 0;
      // setTimeout(function () {
      //     // document.getElementById("orderDiv").scrollIntoView();
      //     document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
      // }, 100);

      // if (this.rdbNotional === 'false') {
      //     this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
      // }
      // else {
      //     this.remainingNotional = parseFloat(this.NoOfShares.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
      // }
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
          .EQCRef('FCN', this.Tenor, this.TenorType, 'Mobile1')
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
                //  this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
                if (this.rdbNotional === 'false') {
                  this.remainingNotional =
                    parseFloat(this.Notional.replace(/,/g, '')) -
                    parseFloat(this.allocatedNotional);
                } else {
                  this.remainingNotional =
                    parseFloat(this.NoOfShares.replace(/,/g, '')) -
                    parseFloat(this.allocatedNotional);
                }
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
      this.IBPrice = 100 - parseFloat(this.upfront);
      this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);

      const webMethod = this.interfaceUrl + 'EQC/BookOrder';
      const d1 = new Date();
      const that = this;

      const parameters = {
        userName: 'Mobile1',
        Notional: this.Notional.replace(/,/g, ''),
        // 'Notional': this.rdbNotional==='true' ? this.NoOfShares.replace(/,/g, '') : this.Notional.replace(/,/g, ''),
        QuoteRequestID: this.rfq,
        Upfront: this.upfront,
        ClientPrice: this.ClientPrice, // 99.02,
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
  openOrderBlotter() {
    if (this.blotterFlag === true) {
      this.blotterFlag = false;
      this.lblOrderBlotter = '+ Order Blotter';
    } else {
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      //document.getElementById("blotterDiv").scrollIntoView();
    }
  }
  OnItemChanged(e) {
    console.log(e);
    this.reset();
    if (this.rdbNotional === 'false') {
      this.NoOfShares = '';
      this.Notional = '1,000,000.00';
      this.remainingNotional = '1,000,000.00';
      this.totalNotional = '1,000,000.00';
      this.estNotional = '';
    }
    if (this.rdbNotional === 'true') {
      this.Notional = '';
      this.NoOfShares = '1,000';
      this.remainingNotional = '1000';
      this.totalNotional = '1000';
      this.fnGetSpot('Mobile1');
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
      if (this.rdbNotional === 'false') {
        this.remainingNotional =
          parseFloat(this.Notional.replace(/,/g, '')) -
          parseFloat(this.allocatedNotional);
      } else {
        this.remainingNotional =
          parseFloat(this.NoOfShares.replace(/,/g, '')) -
          parseFloat(this.allocatedNotional);
      }
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
    if (this.rdbNotional === 'false') {
      this.remainingNotional =
        parseFloat(this.Notional.replace(/,/g, '')) -
        parseFloat(this.allocatedNotional);
    } else {
      this.remainingNotional =
        parseFloat(this.NoOfShares.replace(/,/g, '')) -
        parseFloat(this.allocatedNotional);
    }
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
    if (
      parseFloat(this.allocatedNotional) > parseFloat(this.maxNotional) &&
      this.rdbNotional === 'false'
    ) {
      this.ErrorMsg1 =
        'Can not place order. Notional size is greater than the maximum permitted.';
      return;
    }
    if (
      parseFloat(this.allocatedNotional) < parseFloat(this.minNotional) &&
      this.rdbNotional === 'false'
    ) {
      this.ErrorMsg1 =
        'Can not place order. Notional size is less than the minimum permitted.';
      return;
    }

    if (parseFloat(this.allocatedNotional) <= 0) {
      this.ErrorMsg1 = 'Please enter valid No. of Shares/Notional.';
      return;
    }

    if (
      parseFloat(this.allocatedNotional) !==
        parseFloat(this.Notional.replace(/,/g, '')) &&
      this.rdbNotional === 'false'
    ) {
      this.ErrorMsg1 = 'Sum of notionals is not equal to Order Quantity.';
      return;
    }

    if (
      parseFloat(this.allocatedNotional) !==
        parseFloat(this.NoOfShares.replace(/,/g, '')) &&
      this.rdbNotional === 'true'
    ) {
      this.ErrorMsg1 = 'Sum of shares is not equal to Order Quantity.';
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
        if (this.rdbNotional === 'false') {
          this.remainingNotional =
            parseFloat(this.Notional.replace(/,/g, '')) -
            parseFloat(this.allocatedNotional);
        } else {
          this.remainingNotional =
            parseFloat(this.NoOfShares.replace(/,/g, '')) -
            parseFloat(this.allocatedNotional);
        }
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
        if (this.rdbNotional === 'false') {
          this.remainingNotional =
            parseFloat(this.Notional.replace(/,/g, '')) -
            parseFloat(this.allocatedNotional);
        } else {
          this.remainingNotional =
            parseFloat(this.NoOfShares.replace(/,/g, '')) -
            parseFloat(this.allocatedNotional);
        }
        i++;
      });
    }
  }

  convertToFloat(num: any) {
    return parseFloat(num);
  }

  setNoOfShare(e) {
    try {
      this.reset();

      const target = this.commonfunctions.GetEventTarget(e);
      this.NoOfShares = target.value;
      if (this.NoOfShares == '0' || this.NoOfShares == '') {
        this.ErrorMsg = 'Please Enter valid notional';
      }
      this.remainingNotional = this.NoOfShares;
      this.totalNotional = this.NoOfShares;
      this.fnGetSpot('Mobile1');
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  fnGetSpot(userName: any) {
    try {
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
          that.estNotional = (
            parseFloat(JSON.parse(data['responseData'])[0]['Spot']) *
            that.NoOfShares
          ).toFixed(2);
        },
        error: function (error) {
          console.error(error);
        },
      });
    } catch (error) {
      //console.log("Error:", error);
    }
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
    this.remainingNotional = 1000000;
  }
}
