import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { environment } from 'src/environments/environment';
import { SearchUnderlyingPipe } from '../../Common-Components/pipes/search-underlying.pipe';
import { ELN } from '../../Models/eln.model';
// import { ELN } from '../../Models/eln.model';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    ELNsortBy(p): Array<T>;
  }
}
Array.prototype.ELNsortBy = function (p): Array<any> {
  try {
    return this.slice(0).sort(function (a, b) {
      return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
    });
  } catch (error) {
    //console.log("Error:", error);
  }
};

@Component({
  selector: 'app-eln',
  templateUrl: './eln.component.html',
  styleUrls: ['./eln.component.scss'],
})
export class ELNComponent implements OnInit {
  @ViewChild('focusable') namefield: ElementRef;
  @Input() ViewMode: string;
  @Input() singleRowMode: boolean;

  checkSuitability: boolean = false;
  successOrderMessage: string = '';
  elnModel: ELN;

  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;
  Tenor: number;
  DaysCount: any;
  flag: boolean;
  shares: any;
  ShareName: string;
  shareCode: any;
  selectedShareIndex = 0;
  ShareDetails: any;
  CCY = [];
  ReceivedCCY: any[];
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
  Notional: any;
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
  OrderType: any;
  LimitShare: any;
  Issuer: any;
  accord: any;
  accordflag: boolean;
  bookOrderFlag = false;
  lblOrderBlotter = '';
  lblOrderDetail = '';
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
  counter: number;
  StopRFSFlag: boolean;
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
      this.elnModel = new ELN();
      this.flag = false;
      this.shares = [];
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
        // this.EQC_cfs.ClearPricesFromMultiToDealEntry();
        this.Tenor = 6;
        this.upfront = '0.50';
        // this.shareCode = 'AAPL.OQ';

        //this.IBPrice = '99.50';
        this.settlementWeek = '1W';
        this.TenorType = 'Month';
        this.SolveForvalue = 'StrikePercentage';
        this.DaysCount = 7;
        if (!this.EQC_afs.sharesArr.length) {
        this.EQC_afs.loadShares().subscribe((Res) => {
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

        this.sortedAllPrices = [];
        this.UnderlyingCurrency = 'USD';
        this.Strike = '0.00';
        this.Notional = '1,000,000.00';

        this.allocatedNotional = '0.00';

        this.ClientYield = '5.00';
        this.OrderType = 'Limit';

        this.lblOrderDetail = '+ Order Details';
        this.lblOrderBlotter = '+ Order Blotter';
        this.remainingNotional = '1,000,000.00';
        this.totalNotional = '1,000,000.00';

        this.EQC_afs.SetDates(
          this.DaysCount,
          'AAPL.OQ',
          this.Tenor + this.TenorType.substr(0, 1),
          this.authApi.UserName
        ).subscribe((Res) => {
          this.selectedDates = JSON.parse(Res['responseData'])[0];
          this.EQC_afs.SetToken(Res.token);
        });

        // this.EQC_cfs.Currency.subscribe(cu => this.ddlNoteCcy = cu);

        const ccyRes = await this.EQC_afs.loadCurrency();
        this.ReceivedCCY = JSON.parse(ccyRes.responseData);
        this.CCY = this.ReceivedCCY.map((res) => res.Ccy);
        // try {
        //   this.ReceivedCCY.forEach((element) => {
        //     //console.log(element.Ccy);
        //     const ccyData = element.Ccy;
        //     this.CCY.push(ccyData);
        //   });
        // } catch (error) {}

        // this.CCY.splice(0, 1);

        this.EQC_cfs.SignalRPrices.subscribe((prices) => {
          this.AllPrices = [];
          try {
            if (prices) {
              // console.log(prices)
              this.sortedAllPrices = [];
              for (let i = 0; i < prices.length; i++) {
                if (prices[i].ELNOUT > 0) {
                  // console.log(this.lpArr, prices[i].EP_ER_QuoteRequestId);
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = prices[i].ELNOUT;
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
                    price: prices[i].ELNOUT,
                    clientyield: prices[i].ClientYield,
                    maxnotional: prices[i].MaxNotional,
                    minnotional: prices[i].MinNotional,
                  });
                } else if (typeof prices[i].ELNOUT === typeof '') {
                  for (let k = 0; k < this.lpArr.length; k++) {
                    if (prices[i].EP_ER_QuoteRequestId === this.lpArr[k].rfq) {
                      this.lpArr[k].price = 0;
                      this.lpArr[k].status = prices[i].ELNOUT;
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
                    status: prices[i].ELNOUT,
                    clientyield: '',
                    maxnotional: '',
                    minnotional: '',
                  });
                }
              }
              // console.log('All Prices', this.AllPrices);

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
            // console.log('Error in catch pricessssssss"":',ex);
          }
        });
        // this.fnGetLPList();
        $('#loading').hide();
      } catch (error) {
        //console.log("Error", error);
      }
    });
  }

  ngOnDestroy(): void {
    //console.log("Destroyed successfully");
    this.timeLeft = 0;
    clearInterval(this.interval);
  }

  fnGetLPList() {
    try {
      this.EQC_afs.GetLPList('ELN').subscribe((Res) => {
        if (Res) {
          this.EQC_afs.SetToken(Res['token']);
          this.lpArr = [];
          let LPArray = JSON.parse(Res['responseData']);
          LPArray = LPArray.ELNsortBy('Link_Provider_Name');

          LPArray.forEach((element) => {
            this.lpArr.push({
              rfq: '',
              lp: element.Link_Provider_Name,
              displayName:
                element.Link_Provider_Name.toUpperCase() === 'SOCGEN'
                  ? 'BBVA'
                  : element.Link_Provider_Name,
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
      this.EQC_afs.SetDates(
        this.DaysCount,
        this.shareCode,
        this.Tenor + this.TenorType.substr(0, 1),
        this.authApi.UserName
      ).subscribe((Res) => {
        if (Res) {
          this.selectedDates = JSON.parse(Res['responseData'])[0];
          this.EQC_afs.SetToken(Res.token);
        }
      });
      this.settdate = this.selectedDates.ValueDate;
      this.matdate = this.selectedDates.MaturityDate;
      this.expdate = this.selectedDates.FixingDate;
      this.tradedate = this.selectedDates.TradeDate;
      this.calculateIBPrice();
      // if (this.ddlNoteCcy === 'JPY') {
      //     this.IBPrice = ((10000 * 365) / ((this.setDuration(this.selectedDates.ValueDate, this.selectedDates.MaturityDate) * this.ClientYield) + (100 * 365)) - this.upfront).toFixed(2);

      // }
      // else {
      //     this.IBPrice = ((10000 * 360) / ((this.setDuration(this.selectedDates.ValueDate, this.selectedDates.MaturityDate) * this.ClientYield) + (100 * 360)) - this.upfront).toFixed(2);
      // }
    } catch (error) {}
  }

  changeTenor(event) {
    try {
      console.log(event);
      this.reset();
      this.calculateIBPrice();
      if (
        this.Tenor == 0 ||
        (this.Tenor > 60 && this.TenorType === 'Month') ||
        (this.Tenor > 5 && this.TenorType === 'Year')
      ) {
        this.ErrorMsg = 'Please enter valid tenor.';
      } else {
        // this.selectedDates = this.EQC_afs.SetDates(this.DaysCount, this.shareCode, this.Tenor + this.TenorType.substr(0, 1), 'Mobile1');

        this.EQC_afs.SetDates(
          this.DaysCount,
          this.shareCode,
          this.Tenor + this.TenorType.substr(0, 1),
          this.authApi.UserName
        ).subscribe((Res) => {
          this.selectedDates = JSON.parse(Res['responseData'])[0];
          this.EQC_afs.SetToken(Res.token);
        });
        this.settdate = this.selectedDates.ValueDate;
        this.matdate = this.selectedDates.MaturityDate;
        this.expdate = this.selectedDates.FixingDate;
        this.tradedate = this.selectedDates.TradeDate;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  CcyChange(e) {
    try {
      console.log(e);
      this.reset();
      this.calculateIBPrice();
      // this.EQC_afs.setUnderlyingCurrency(e.target.value);
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
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
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
    } catch (Error) {
      //console.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }
  showUnderlying(item) {
    try {
      this.reset();
      this.calculateIBPrice();
      this.selectShareEvent.next(item.Code);
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.flag = false;
      this.ShareName = item.LongName;
      // this.EQC_cfs.selectedShareIndex = 0;
      this.ddlNoteCcy = item.Ccy;
      this.ccyChange = item.Ccy;
      this.ExchangeCode = item.ExchangeCode;
      this.Exchange = item.ExchangeCode + ' - ' + item.ExchangeName;
      this.strpair = item.Code + ' - ' + item.Ccy;
      this.shareCode = item.Code;
      this.priceFlag = true;
      // this.selectedDates = this.EQC_afs.SetDates(this.DaysCount, this.shareCode, this.Tenor + this.TenorType.substr(0, 1), 'Mobile1');
      this.EQC_afs.SetDates(
        this.DaysCount,
        this.shareCode,
        this.Tenor + this.TenorType.substr(0, 1),
        'Mobile1'
      ).subscribe((Res) => {
        this.selectedDates = JSON.parse(Res['responseData'])[0];
        this.EQC_afs.SetToken(Res.token);
      });
      this.settdate = this.selectedDates.ValueDate;
      this.matdate = this.selectedDates.MaturityDate;
      this.expdate = this.selectedDates.FixingDate;
      this.tradedate = this.selectedDates.TradeDate;
      // this.EQC_cfs.setUnderlyingCurrency(this.ddlNoteCcy);
      this.calculateIBPrice();
      this.LimitShare = this.shareCode;
      this.LimitAmount = 0;
      this.namefield.nativeElement.focus();
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  backKeyPress(e) {
    // try {
    console.log(e);
    //   this.flag = false;
    //   this.shareCode = '';
    //   this.selectedBIndex = 0;
    // }
    // catch (error) {
    //   //console.log("Error:", error);
    // }
  }
  setSolveFor(e) {
    try {
      this.reset();
      this.calculateIBPrice();
      const target = this.EQC_cfs.GetEventTarget(e);
      this.SolveFor = target.value;
      //console.log('change: ' + target.value);
      if (this.SolveForvalue === 'PricePercentage') {
        this.ClientYield = '0.00';
        this.Strike = '98.50';
        // this.upfront = '0.00';
        this.IBPrice = '0.00';
      } else {
        this.ClientYield = '5.00';
        this.Strike = '0.00';
        this.upfront = '0.50';
        this.calculateIBPrice();
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ElnPrice(PPID) {
    try {
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'EQC/ELN/Quote';
      const that = this;
      //console.log(this.DaysCount);
      const parameters = {
        userName: this.authApi.UserName,
        EntityId: sessionStorage.getItem('EntityID'),
        PPID: PPID,
        BarrierPercentage: '',
        InterBankPrice: this.IBPrice,
        UnderlyingCode: this.shareCode,
        TenorType: this.TenorType,
        Tenor: this.Tenor,
        Price: this.IBPrice,
        CashCurrency: this.ddlNoteCcy,
        Exchange: this.ExchangeCode,
        IssuerDateOffset: this.DaysCount,
        Upfront: this.upfront, // * 100,
        SolveFor: this.SolveForvalue,
        LongDays: this.setDuration(this.settdate, this.matdate),
        PDD: '',
        SettlementDate: new Date(
          new Date(this.settdate).getFullYear(),
          new Date(this.settdate).getMonth() + 1,
          new Date(this.settdate).getDay()
        )
          .getTime()
          .toString(),
        ExpiryDate: new Date(
          new Date(this.expdate).getFullYear(),
          new Date(this.expdate).getMonth() + 1,
          new Date(this.expdate).getDay()
        )
          .getTime()
          .toString(),
        MaturityDate: new Date(
          new Date(this.matdate).getFullYear(),
          new Date(this.matdate).getMonth() + 1,
          new Date(this.matdate).getDay()
        )
          .getTime()
          .toString(),
        Notional: this.Notional.replace(/,/g, ''),
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
          'Simple' +
          this.settdate +
          this.expdate +
          this.matdate +
          this.Strike +
          '.00' +
          this.shareCode,
        token: this.EQC_afs.GetToken(),
      };
      if (this.SolveForvalue === 'PricePercentage') {
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
            that.EQC_afs.SetToken(data['token']);
            that.lpArr = [];
            const temp = that.PPDetails.split(',');
            for (let j = 0; j < temp.length; j++) {
              that.lpArr.push({
                rfq: temp[j].split('-')[1],
                lp: temp[j].split('-')[0],
                displayName:
                  temp[j].split('-')[0].toUpperCase() === 'SOCGEN'
                    ? 'BBVA'
                    : temp[j].split('-')[0].toUpperCase() === 'RBC'
                    ? 'BBVA IB'
                    : temp[j].split('-')[0],
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
                  that.ElnPriceResponse(that.PPDetails);
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

  ElnPriceResponse(PPDetails) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/ELN/QuoteResponse';
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
          console.log(that.Prices[0]);
          that.EQC_afs.SetToken(data['token']);
          setTimeout(function () {
            // document.getElementById("orderDiv").scrollIntoView({ behavior: 'smooth' });
          }, 100);
          if (that.timeLeft > 0) {
            that.EQC_cfs.setReceivedPrices(that.Prices);
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

  bookOrder(
    selectedrfq: any,
    lp1: any,
    minnotional1: any,
    maxnotional1: any,
    clientyield1: any,
    selectedPrice: any
  ) {
    try {
      console.log('Order Booking initiated...', lp1);
      this.Issuer = lp1;
      this.minNotional = minnotional1;
      this.maxNotional = maxnotional1;
      this.ClientYield = clientyield1;
      this.rfq = selectedrfq;
      if (this.authApi.UserType === 'RM') {
        this.checkSuitability = true;
        this.disableSuitabilityCheck = true;
        //         this.homeApi.Portfolio,
        // this.homeApi.AccountNumber,
        // this.homeApi.AccountNumber,
      }

      if (this.SolveForvalue === 'StrikePercentage') {
        this.Strike = selectedPrice;
      }
      if (this.SolveForvalue === 'PricePercentage') {
        this.IBPrice = selectedPrice;
        this.ClientPrice = parseFloat(this.IBPrice) + parseFloat(this.upfront);
      }

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
          //   'ELN',
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
      //console.log("Error:", error);
    }
  }
  setNotional(e) {
    try {
      this.reset();
      this.calculateIBPrice();
      const target = this.EQC_cfs.GetEventTarget(e);
      this.Notional = parseFloat(target.value.replace(/,/g, '')).toFixed(2);
      if (this.Notional == '0' || this.Notional == '0.00') {
        this.ErrorMsg = 'Please Enter valid notional';
      }
      this.remainingNotional = this.Notional;
      this.totalNotional = this.Notional;

      //console.log("setNotional:" + this.Notional);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setDuration(settlement: string, maturity: string) {
    try {
      const start = new Date(
        parseInt(maturity.split('-')[2]),
        this.monthNames.indexOf(maturity.split('-')[1]),
        parseInt(maturity.split('-')[0])
      );
      const end = new Date(
        parseInt(settlement.split('-')[2]),
        this.monthNames.indexOf(settlement.split('-')[1]),
        parseInt(settlement.split('-')[0])
      );

      let days = 0;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      if (start.getTime() > end.getTime()) {
        const millisBetween = start.getTime() - end.getTime();
        //console.log(millisBetween);
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
      //console.log(this.SolveForvalue, this.Strike);
      if (
        this.SolveForvalue !== 'StrikePercentage' &&
        (this.Strike === '0.00' || this.Strike === '' || this.Strike === '0')
      ) {
        //console.log(this.SolveForvalue, this.Strike);
        this.ErrorMsg = 'Strike (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'PricePercentage' &&
        (this.IBPrice === '0.00' || this.IBPrice === '' || this.IBPrice === '0')
      ) {
        this.ErrorMsg =
          'IBPrice (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.upfront === '0' ||
        this.upfront === '0.00' ||
        this.upfront === ''
      ) {
        this.ErrorMsg =
          'Upfront (%) should be greater than 0 and less than 100';
        return false;
      }

      if (
        this.SolveForvalue !== 'PricePercentage' &&
        (this.ClientYield === '0' ||
          this.ClientYield === '0.00' ||
          this.ClientYield === '')
      ) {
        this.ErrorMsg =
          'Client Yield (%) should be greater than 0 and less than 100';
        return false;
      }

      if (this.ErrorMsg === '') {
        this.timeLeft = 0;
        this.orderID = '';
        this.orderflag = false;
        this.loadflag = true;
        this.AllPrices = [];
        this.lpArr = [];
        this.sortedAllPrices = [];
        this.RFQIDArray = [];
        this.timerStarted = false;

        this.ElnPrice('');
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
    return false;
  }

  Clear() {
    try {
      this.timeLeft = 0;
      clearInterval(this.interval);
      this.sortedAllPrices = [];
      this.lpArr = [];
      this.Tenor = 6;
      this.upfront = '0.50';
      this.IBPrice = '0.00';
      this.settlementWeek = '1W';
      this.TenorType = 'Month';
      this.SolveForvalue = 'StrikePercentage';
      this.DaysCount = 7;
      // this.sortedAllPrices = [];
      this.ddlNoteCcy = 'USD';
      this.Strike = '0.00';
      this.Notional = '1,000,000.00';
      // this.SetDates();
      this.AllPrices = [];
      this.ClientYield = '10.00';
      this.ShareName = '';
      this.loadflag = false;
      this.orderID = '';
      this.settdate = '';
      this.matdate = '';
      this.expdate = '';
      this.tradedate = '';
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
      this.EQC_cfs.setReceivedPrices({});

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
      this.priceFlag = true;
      this.blotterFlag = false;
      // this.ValueChanged();
      if (this.SolveForvalue === 'PricePercentage') {
        this.IBPrice = '0.00';
      } else {
        this.Strike = '0.00';
      }
      return false;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  calculateIBPrice() {
    try {
      if (
        this.SolveForvalue === 'StrikePercentage' &&
        this.settdate !== '' &&
        this.matdate !== ''
      ) {
        this.EQC_afs.IBPriceCalculation(
          'Mobile1',
          this.ClientYield,
          this.ddlNoteCcy,
          this.upfront,
          this.settdate,
          this.matdate
        ).subscribe((Res) => {
          if (Res) {
            this.IBPrice = JSON.parse(Res['responseData']).toFixed(2);
            this.EQC_afs.SetToken(Res.token);
          }
        });
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  priceValidation(priceValue: any, pricestr: string) {
    try {
      if (
        priceValue === '' ||
        parseFloat(priceValue) <= 0 ||
        parseFloat(priceValue) >= 100
      ) {
        this.ErrorMsg =
          pricestr + ' should be greater than 0 and less than 100';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  scrollWin() {
    try {
      this.blotterFlag = true;
      this.lblOrderBlotter = '- Order Blotter';
      this.fnEQConnectOrderHistory('ELN', 'ELNBlotter');
      setTimeout(function () {
        // document.getElementById('blotterDiv1').scrollIntoView({ behavior: 'smooth' })
      }, 100);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  fnEQConnectOrderHistory(pCode, apiName) {
    try {
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
      // this.orderflag = true;
      this.blotterFlag = true;
      this.fnEQConnectOrderHistory('ELN', 'ELNBlotter');
      this.lblOrderBlotter = '- Order Blotter';
      setTimeout(function () {
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
      if (!this.isValidParameters()) {
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
        ClientPrice: this.ClientPrice,
        ClientYield: this.ClientYield,
        token: this.EQC_afs.GetToken(),
        orderType: this.OrderType,
        comment: 'MangeshWakode',
        confirmReason: 'MDW test',
        bookingBranch: this.selectedBookingBranch,
        rmName: this.rmName,
        CustPortfolio: this.homeApi.Portfolio,
        CustSettleAcount: this.homeApi.AccountNumber,
        CustomerID: this.homeApi.AccountNumber,
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
    } catch (error) {}
  }

  isValidParameters() {
    try {
      if (
        this.OrderType === 'Limit' &&
        (this.LimitAmount === '' || this.LimitAmount <= 0)
      ) {
        this.ErrorMsg1 = 'Please enter Limit Price.';
        return false;
      } else {
        if (this.OrderType === 'Market') {
          this.LimitAmount = 0;
        }
        this.ErrorMsg1 = '';
        return true;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  onBlurLimitAmt() {
    try {
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
    this.tblAllocation.forEach((element) => {
      console.log(element);
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
    for (let k = 0; k < this.lpArr.length; k++) {
      if (this.lpArr[k].rfq === this.rfq) {
        if (this.lpArr[k].timer == 0) {
          this.accordflag = false;
          this.bookOrderFlag = false;
          return false;
        }
      }
    }
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
      this.tblAllocation.forEach((element) => {
        console.log(element);
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
      this.tblAllocation.forEach((element) => {
        console.log(element);
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
    this.ErrorMsg1 = '';
  }

  fnUnderlyingchanged(e) {
    if (e) {
      this.fnGetNotionalChanged();
    }
  }

  fnGetNotionalChanged() {
    this.EQC_afs.calculateNotional(this.elnModel).subscribe((Res) => {
      if (Res) {
        this.elnModel.AccrualDays = Number(JSON.parse(Res.responseData));
        this.EQC_afs.SetToken(Res.token);
      }
    });
  }
  toggleSuitability() {
    console.log(this.checkSuitability);
  }
}
