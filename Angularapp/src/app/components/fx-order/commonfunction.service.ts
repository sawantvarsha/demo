import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { ApifunctionService } from './apifunction.service';

declare let require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class CommonfunctionService {
  public static streamingOne = 0;
  public static socketAlive = false;
  public static socketTimeout = 60000;
  public static time = 0;
  public static timer: any;
  public static ws: any;
  sampleString1: string;

  months = [
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
  SessionID: string;
  apifunctionservice: ApifunctionService;
  CloseSocket = new BehaviorSubject({});
  CloseSocketObserver = this.CloseSocket.asObservable();

  FXOPrices = new BehaviorSubject([]);
  FXOPricesObservar = this.FXOPrices.asObservable();

  quotevalidtill = new BehaviorSubject('');
  quotevalidObservar = this.quotevalidtill.asObservable();

  show = new BehaviorSubject('Dashboard');
  showobservar = this.show.asObservable();

  tabname = new BehaviorSubject(99);
  tabnameobservar = this.tabname.asObservable();

  lang = new BehaviorSubject('');
  langObserver = this.lang.asObservable();

  requestNumber = new BehaviorSubject(1);
  requestNumberobservar = this.requestNumber.asObservable();

  FavoriteCurrencies = new BehaviorSubject([]);
  FavoriteCurrenciesobservar = this.FavoriteCurrencies.asObservable();

  disable = new BehaviorSubject(false);
  disableobservar = this.disable.asObservable();

  DataforTrade = new BehaviorSubject({});
  DataforTradeObservar = this.DataforTrade.asObservable();

  settlementType = new BehaviorSubject('');
  settlementTypeObserver = this.settlementType.asObservable();

  tradingOnOff = new BehaviorSubject('on');
  tradingOnOffObserver = this.tradingOnOff.asObservable();

  tradingOnOffVar = 'on';
  spreadMultiplierVar = 'off';

  spreadMultiplier = new BehaviorSubject('off');
  spreadMultiplierObserver = this.spreadMultiplier.asObservable();

  showpopupspread = new BehaviorSubject(false);
  showpopupspreadObserver = this.showpopupspread.asObservable();

  spreadvalue = new BehaviorSubject('0.00');
  spreadvalueObserver = this.spreadvalue.asObservable();

  customerName = new BehaviorSubject([]);
  customerNameObs = this.customerName.asObservable();

  selectedTemplate = 'Template1';
  time = 0;
  // componentCount = [];

  newTradeFlagBS = new BehaviorSubject(false);
  newTradeFlagObs = this.newTradeFlagBS.asObservable();

  LPpopupflag = new BehaviorSubject({});
  LPpopupflagObs = this.LPpopupflag.asObservable();

  LPPopupBuyData = new BehaviorSubject([]);
  LPPopupBuyDataObs = this.LPPopupBuyData.asObservable();

  LPPopupSellData = new BehaviorSubject([]);
  LPPopupSellDataObs = this.LPPopupSellData.asObservable();

  selectedPriceforTrade = new BehaviorSubject('');
  selectedPriceforTradeObs = this.selectedPriceforTrade.asObservable();

  persistData = [];
  DashboardStartCount = 0;
  StrNotional: string;
  StrRate: string;
  configData = [];

  configDatad = new BehaviorSubject({});
  configDataObs = this.configDatad.asObservable();

  // wsNotification:any;

  TimerValueFromCommonData: number;
  EFX_NewTransactionAccountDetails: string;
  constructor(afs: ApifunctionService) {
    this.apifunctionservice = afs;
  }

  clearPersistdata() {
    this.persistData = [];
  }

  SubScrib(WebSocketIP, USERID) {
    // Inside SubScrib function unwanted code removed by AniruddhaJ || 31-Aug-2021
    console.log(WebSocketIP);
    const that = this;

    if (WebSocketIP === '' || WebSocketIP === undefined) {
      WebSocketIP = location.hostname;
    }

    $(document).ready(function () {
      try {
        let wsprotocol;
        if (location.protocol === 'http:') {
          wsprotocol = 'ws:';
        } else if (location.protocol === 'https:') {
          wsprotocol = 'wss:';
        } else {
          wsprotocol = 'ws:';
        }

        try {
          // console.log(CommonfunctionService.ws);
          if (
            CommonfunctionService.ws === null ||
            CommonfunctionService.ws === 'undefined' ||
            CommonfunctionService.ws === undefined
          ) {
            CommonfunctionService.ws = new WebSocket(
              '' +
                wsprotocol +
                '//' +
                WebSocketIP +
                '/FinIQService/WSCallback.svc'
            );
            CommonfunctionService.socketAlive = true;
          } else {
            // added change by ashutosh/shubham
            // alert("inside else ws not null...");
            if (CommonfunctionService.ws.readyState == WebSocket.OPEN) {
              // if open no need to subscribe agin.
              // alert("connection open subscribe again.");
            } else {
              // alert("connection closed re initialise WEB-SOCKET again.");
              CommonfunctionService.ws = new WebSocket(
                '' +
                  wsprotocol +
                  '//' +
                  WebSocketIP +
                  '/FinIQService/WSCallback.svc'
              );
              // console.log(CommonfunctionService.ws);
            }
            // ws.send('MASTERSUBSCRIBE|' + USERID);
          }
        } catch (error) {
          console.log(error.message);
        }

        CommonfunctionService.ws.onopen = function () {
          try {
            // alert("After Open");
            // console.log('Port is opened...');
            // alert(ws.readyState);
            if (CommonfunctionService.ws.readyState === WebSocket.OPEN) {
              // alert('value : ' + $("#<%=hdnUserID.ClientID%>").val());
              // $("#<%=hdnUserID.ClientID%>").val()
              //   ws.send('MASTERSUBSCRIBE|' + USERID);  mdw
              CommonfunctionService.ws.send('MASTERSUBSCRIBE|' + USERID);
              // ws.Subscribe('MASTERSUBSCRIBE|' + USERID);

              // alert(" After Subscription");
            } else {
              // alert('Connection is closed', 'success');
            }
          } catch (er) {
            console.log(er.message);
          }
        };

        CommonfunctionService.ws.onmessage = function (evt) {
          // alert('Received');
          try {
            const msg = evt.data;
            const strRes = JSON.parse(msg);
            if (
              CommonfunctionService.ws.readyState === WebSocket.OPEN &&
              strRes['MesssageType'].toUpperCase() === 'SUBSCRIBE'
            ) {
              // alert('SUBSCRIBED');
            } else if (
              CommonfunctionService.ws.readyState === WebSocket.OPEN &&
              strRes['MesssageType'].toUpperCase() === 'UNSUBSCRIBE'
            ) {
            } else if (
              CommonfunctionService.ws.readyState === WebSocket.OPEN &&
              strRes['MesssageType'].toUpperCase() ===
                'NOTIFICATIONFORROUTETODEALER'
            ) {
            } else {
              // ws.close();
              this.ServiceResponse = null;
              this.ServiceResponse = JSON.parse(strRes['MessageContent']);
              // console.log(this.ServiceResponse);
              // that.PriceSelectionFromResponse(this.ServiceResponse);

              that.FXOPrices.next(this.ServiceResponse);
              // let countComp=0;
              // that.arr.map(value=>{
              //   if(value['StreamCount'] === 8){
              //     return;
              //     countComp = countComp++;
              //   }
              // });
              // if(countComp === 6){
              //   ws.close();
              // }
              // if (that.PriceSell.length > 2 && that.PriceBuy.length > 2) {
              //   if (that.firstStream === true) {
              //     ws.close();
              //     that.firstStream = false;
              //     console.log('Closing the socket');
              //   }
              // }

              // that.BestPrice = this.ServiceResponse['NearForwardRate'];
              // that.SpotRate = this.ServiceResponse['NearSpotRate'];
              // that.SwapPoint = this.ServiceResponse['NearSwapPoint'];
              // that.ExternalQuoteID = this.ServiceResponse['ExternalQuoteID'];
              // that.FinIQPriceQuoteId = this.ServiceResponse['QuoteId'];
              // that.PriceProviderId = this.ServiceResponse['PriceProviderId'];
              // console.log(that.SpotRate, that.SwapPoint, that.ExternalQuoteID, that.FinIQPriceQuoteId, that.PriceProviderId);
              // that.CustomerRate = that.AddpipestoNumber(that.Spread, that.BestPrice);
              // that.CustomerRate = "" + (that.commonfunction.AddpipestoNumber(this.Spread, that.BestPrice));
              // console.log(that.BestPrice);
              // that.Calculations();
              // ws.close();
            }
          } catch (er) {
            console.log(er.message);
          }
        };

        CommonfunctionService.ws.onclose = function (_evt) {
          CommonfunctionService.ws.close();
          console.log('on close');
        };
      } catch (er) {
        console.log(er.message);
      }
    });
  }
  setTimeoutFunction() {
    CommonfunctionService.timer = setTimeout(() => {
      CommonfunctionService.ws.close();
      // console.log('closing Socket', CommonfunctionService.socketTimeout);
      CommonfunctionService.socketAlive = false;
      CommonfunctionService.streamingOne = 0;
      this.CloseSocket.next({ res: true });
      setTimeout(() => {
        this.CloseSocket.next({ res: false });
      }, 500);
    }, 180000);
  }
  cleartimoutfunction() {
    console.log(CommonfunctionService.timer);
    clearTimeout(CommonfunctionService.timer);
    this.setTimeoutFunction();
  }
  onlyClearTimeout() {
    if (CommonfunctionService.ws !== undefined) {
      CommonfunctionService.ws.close();
      clearTimeout(CommonfunctionService.timer);
      // console.log('closing Socket', CommonfunctionService.socketTimeout);
      CommonfunctionService.socketAlive = false;
      CommonfunctionService.streamingOne = 0;
    }
  }
  callSubscribe() {
    this.generateNewSessionID();
    CommonfunctionService.streamingOne = 1;
    let loginID = sessionStorage.getItem('Username');
    // alert(AppConfig.settings.CSP_FXPricingURL)
    this.SubScrib(AppConfig.settings.CSP_FXPricingURL, loginID);
    // this.SubScrib('52.163.118.116', SessionIDSell);
    // this.SubScrib('40.65.134.77', SessionIDSell);

    // this.SubScrib('52.163.118.116', SessionIDSell);
    // this.SubScrib('13.76.142.216', SessionIDSell);
    // this.SubScrib('52.163.97.193', SessionIDSell);
    // this.streamingOne = 1;
  }
  generateNewSessionID() {
    this.SessionID = this.GenerateSessionID();
  }
  getSessionID() {
    return this.SessionID;
  }
  GenerateSessionID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  SetStremingOne() {
    CommonfunctionService.streamingOne = 0;
  }

  setCustomerName(val) {
    console.log(val);
    this.customerName.next(val);
  }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  FormatNumber(e) {
    const target: any = this.GetEventTarget(e);
    // console.log(target.id, $('#' + target.id)[0].value);
    const notional = $('#' + target.id)[0].value;
    if ($('#' + target.id)[0].value.trim() === '') {
      $('#' + target.id)[0].value = '0.00';
      const evt = new Event('change');
      $('#' + target.id)[0].dispatchEvent(evt);
    } else {
      $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );
    }
    // console.log(notional);
    return notional;
  }

  FormatNumberWithoutEvent(notional) {
    this.StrNotional = parseFloat(notional).toFixed(2);

    // if (this.StrNotional.trim() === '') {
    // this.StrNotional = '0.00';
    // } else {
    this.StrNotional = this.StrNotional.toString().replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );
    // }
    return this.StrNotional;
  }
  FormatNumberWithoutEventForRate(rate, decimalPlaces) {
    this.StrRate = parseFloat(rate).toFixed(decimalPlaces);

    // if (this.StrNotional.trim() === '') {
    // this.StrNotional = '0.00';
    // } else {
    // this.StrRate = this.StrRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // }
    return this.StrRate;
  }
  FormatNumberWithoutEventForAmount(notional, _decimalPlaces) {
    try {
      notional = notional.replace(/,/g, '');
      this.StrNotional = notional
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return this.StrNotional;
    } catch (Ex) {
      return notional;
    }
    // this.StrNotional = parseFloat(notional).toFixed(decimalPlaces);
  }
  FormatNumberr(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v)
          .toFixed() //Modified by Uddesh .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  UnformatNumber(e) {
    const target: any = this.GetEventTarget(e);
    // console.log(target.id, $('#' + target.id)[0].value);
    $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(/,/g, '');
    if ($('#' + target.id)[0].value === '0.00') {
      $('#' + target.id)[0].value = '';
    }
  }

  UnformatNumberForCustomer(e) {
    const target: any = this.GetEventTarget(e);
    // console.log(target.id, $('#' + target.id)[0].value);
    target.value = target.value.replace(/,/g, '');
    if (target.value === '0.00') {
      target.value = '';
    }
  }

  contains(key) {
    const findNaN = key !== key;
    let indexOf: any;
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      indexOf = function (key) {
        let i = -1,
          index = -1;
        for (i = 0; i < this.legth; i++) {
          const item = this[i];
          if ((findNaN && item !== item) || item === key) {
            index = i;
            break;
          }
        }
        return index;
      };
    }
    return indexOf.call(this, key) > -1;
  }
  NotionalValidate(e) {
    // console.log(e.keyCode);.

    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;
    const value = target.value.toString();
    console.log(value);
    let codes = new Array();
    // Checking for number inputs, k, m, b, ., del or backspace
    codes = [
      8, 9, 13, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76, 77, 98,
      107, 108, 109, 127,
    ];
    // console.log(this.contains.call(codes, code), code);
    if (!this.contains.call(codes, code)) {
      return false;
    }
    if (code === 46) {
      const sampleString2 = target.value;
      if (sampleString2.includes('.')) {
        return false;
      } else {
        return true;
      }

      // if (this.count > 1) {
      //   return false;
      // } else {
      //   return true;
      // }
    }

    if (
      value.includes('k') ||
      value.includes('K') ||
      value.includes('l') ||
      value.includes('L') ||
      value.includes('m') ||
      value.includes('M') ||
      value.includes('b') ||
      value.includes('B')
    ) {
      return false;
    }

    return true;
  }
  NotionalChange(e) {
    const target: any = this.GetEventTarget(e);

    if (target.value === '') {
    } else {
      if (target.value.toString().match(/([kK]{1})/g) != null) {
        // console.log('K');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[kK]/g, '')) * 1000
        ).toFixed(2);
      } else if (target.value.toString().match(/([lL]{1})/g) != null) {
        // console.log('L');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[lL]/g, '')) * 100000
        ).toFixed(2);
      } else if (target.value.toString().match(/([mM]{1})/g) != null) {
        // console.log('M');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
        ).toFixed(2);
      } else if (target.value.toString().match(/([bB]{1})/g) != null) {
        // console.log('B');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
        ).toFixed(2);
      }
    }
    return this.FormatNumberwithFloat(target.value);

    // return target.value;
  }

  UnformatNumberFromFloat(floatnum) {
    try {
      floatnum = floatnum.replace(/,/g, '');
      if (floatnum === '0.00') {
        floatnum = '';
      }
      return floatnum;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  FormatNumberwithFloat(floatnum) {
    try {
      if (floatnum.trim() === '') {
        floatnum = '0.00';
      } else {
        floatnum = floatnum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return floatnum;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  FormatNotianal(inputNumber) {
    try {
      inputNumber = parseInt(inputNumber);
      if (inputNumber.trim() === '') {
        inputNumber = '0.00';
      } else {
        inputNumber = inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return inputNumber;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  RemovecommafromNumber(value: any) {
    // console.log(control);
    if (value) {
      value.replace(/,/g, '');
    }
    return value;
  }

  getTransactionData(
    InvestmentNotional,
    AlternateNotional,
    ccy1,
    ccy2,
    OptionType,
    FixingDate,
    ValueDate,
    tenorcode,
    rateDecimal,
    buysell,
    SpotDate,
    highlightinput,
    ccy1Decimal,
    ccy2Decimal,
    bidask,
    datainput,
    customerData,
    spotRate,
    swappoints,
    quoteID,
    externalQuoteID,
    ppID,
    priceQuoteRef,
    custrate,
    custrevenue,
    spread,
    index
  ) {
    const tardeDetails = {
      invnotional: InvestmentNotional,
      altNotional: AlternateNotional,
      invccy: ccy1,
      altccy: ccy2,
      OptionType,
      FixingDate,
      ValueDate,
      tenorcode,
      rateDecimal,
      buysell,
      SpotDate,
      highlightinput,
      ccy1Decimal,
      ccy2Decimal,
      bidask,
      datainput,
      customerData,
      spotRate,
      swappoints,
      quoteID,
      externalQuoteID,
      ppID,
      priceQuoteRef,
      custrate,
      custrevenue,
      spread,
      index,
    };

    this.DataforTrade.next(tardeDetails);
  }

  focusNumber(e) {
    const el = e.target || e.srcElement;
    // alert(el.id);
    (document.getElementById(el.id) as HTMLInputElement).select();
  }

  changeScreen(screenName: any) {
    this.show.next(screenName);
  }

  changeTab(tabname: any) {
    this.tabname.next(tabname);
  }

  formatNumber_ES(value, AmountDecimal) {
    // console.log(control);
    if (isNaN(parseFloat(value))) {
      // return '';
      value = '';
      // this.billingAmt = value;
    } else {
      value = this.formatKLMB_ES(value, AmountDecimal);
      // console.log(value);
      // this.billingAmt = value;
      // this.billingAmt = parseFloat(value).toLocaleString('es-ES');
    }
    return value;
  }

  formatKLMB_ES(value: string, precision = 2) {
    // value = value.replace(/\./g, '');
    if (value.match(/([kK]{1})/g) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(
        precision
      );
    } else if (value.match(/([lL]{1})/g) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(
        precision
      );
    } else if (value.match(/([mM]{1})/g) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(
        precision
      );
    } else if (value.match(/([bB]{1})/g) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(
        precision
      );
    }
    value = parseFloat(value)
      .toFixed(precision)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    const parts = value.split('.');
    console.log(parts);
    value = parts[0].replace(/,/g, '.') + ',' + parts[1];
    return value;
  }

  unformatNumber_ES(value) {
    if (value) {
      const parts = value.split(',');
      value = parts[0].replace(/\./g, '') + ',' + (parts[1] || '00');
      // value.replace(/\.,/g, '');
      // console.log(value);
      return value;
    }
  }

  unformatToStandard(value) {
    if (value) {
      const parts = value.split(',');
      value = parts[0].replace(/\./g, '') + '.' + parts[1];
      // value.replace(/\.,/g, '');
      // console.log(value);
      return parseFloat(value);
    }
  }
  disablePopUp(value: boolean) {
    this.disable.next(value);
  }
  // setCompoCount(index) {
  //   try {
  //     this.componentCount.map(d => {
  //       if (d['index'] === index) {
  //         let cnt = d['count'];
  //         d['count'] = cnt + 1;
  //       }
  //     });
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }
  // getCompoCount(index):number {
  //   try {
  //     this.componentCount.map(d => {
  //       if (d['index'] === index) {
  //         return Number(d['count']);
  //       }
  //     });
  //     return 0;
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }
  // makeZeroCompCount(){
  //   try {
  //     this.componentCount.map(d=>{
  //       d['count'] = 0;
  //     });
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }
  // destroyCompCount(){
  //   try {
  //     this.componentCount = [];
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }
  setSettlementType(value) {
    this.settlementType.next(value);
  }
  CheckAllFieldsPrecision(e, flag) {
    try {
      // if (e.value) {
      let fieldvalue;
      if (flag === 0) {
        fieldvalue = this.GetEventTarget(e).value;
      } else {
        fieldvalue = e;
      }
      const DotPos = fieldvalue.indexOf('.');
      // console.log(DotPos);
      if (DotPos < 0) {
        return fieldvalue + '.00';
      } else if (DotPos === 0) {
        fieldvalue = '0' + fieldvalue;
        const diff = fieldvalue.length - 2 - DotPos;
        if (diff === 1) {
          return fieldvalue + '0';
        }

        return fieldvalue;
      } else {
        const diff = fieldvalue.length - 1 - DotPos;
        if (diff === 1) {
          return fieldvalue + '0';
        }

        return fieldvalue;
      }
      // } else {
      //   let fieldvalue = e;
      //   const DotPos = fieldvalue.indexOf('.');
      //   // console.log(DotPos);
      //   if (DotPos < 0) {

      //     return fieldvalue + '.00';
      //   } else if (DotPos === 0) {
      //     fieldvalue = '0' + fieldvalue;
      //     const diff = (fieldvalue.length - 2) - DotPos;
      //     if (diff === 1) {
      //       return fieldvalue + '0';
      //     }

      //     return fieldvalue;
      //   } else {
      //     const diff = (fieldvalue.length - 1) - DotPos;
      //     if (diff === 1) {
      //       return fieldvalue + '0';
      //     }

      //     return fieldvalue;
      //   }
      // }
    } catch (Err) {
      // console.log(Err);
    }
  }
  NewTrade(flag) {
    this.newTradeFlagBS.next(flag);
  }

  // FormatNumberWithoutEventForAmount(notional, decimalPlaces) {
  //   this.StrNotional = parseFloat(notional).toFixed(decimalPlaces);
  //   this.StrNotional = this.StrNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   return this.StrNotional;
  // }

  // FormatNumberWithoutEventForRate(rate, decimalPlaces) {
  //   this.StrRate = parseFloat(rate).toFixed(decimalPlaces);
  //   return this.StrRate;
  // }
  // FormatNumberWithoutEvent(notional) {
  //   this.StrNotional = notional;

  //   // if (this.StrNotional.trim() === '') {
  //     // this.StrNotional = '0.00';
  //   // } else {
  //     this.StrNotional = this.StrNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   // }
  //   return this.StrNotional;
  // }

  // Mark to Market - subscribe notiofication

  getLPpopupflag(data) {
    this.LPpopupflag.next(data);
  }
  selectLPforTrade(priceData) {
    this.selectedPriceforTrade.next(priceData);
  }

  // Start Added by Ketan S on 8-Apr-2021

  FormatNumberwithoutevent(amount: any) {
    // //console.log(target.id, $('#' + target.id)[0].value);
    // const notional =amount;
    if (amount.trim() === '') {
      amount = '0.00';
    } else {
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    // //console.log(notional);
    return amount;
  }

  NotionalChangeSFK(e, CCYAmoutDecimal: any) {
    var target: any = this.GetEventTarget(e);
    // if(target===null)
    // target=e;

    if (target.value === '') {
    } else {
      if (CCYAmoutDecimal === undefined || CCYAmoutDecimal === '') {
        if (target.value.toString().match(/([kK]{1})/g) != null) {
          target.value = (
            parseFloat(target.value.replace(/[kK]/g, '')) * 1000
          ).toFixed(2);
        } else if (target.value.toString().match(/([lL]{1})/g) != null) {
          target.value = (
            parseFloat(target.value.replace(/[lL]/g, '')) * 100000
          ).toFixed(2);
        } else if (target.value.toString().match(/([mM]{1})/g) != null) {
          target.value = (
            parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
          ).toFixed(2);
        } else if (target.value.toString().match(/([bB]{1})/g) != null) {
          target.value = (
            parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(2);
        }
      } else {
        if (target.value.toString().match(/([kK]{1})/g) != null) {
          // //console.log('K');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[kK]/g, '')) * 1000
          ).toFixed(Number(CCYAmoutDecimal));
        } else if (target.value.toString().match(/([lL]{1})/g) != null) {
          // //console.log('L');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[lL]/g, '')) * 100000
          ).toFixed(Number(CCYAmoutDecimal));
        } else if (target.value.toString().match(/([mM]{1})/g) != null) {
          // //console.log('M');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
          ).toFixed(Number(CCYAmoutDecimal));
        } else if (target.value.toString().match(/([bB]{1})/g) != null) {
          // //console.log('B');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(Number(CCYAmoutDecimal));
        }
      }
    }
    return target.value;
  }
  FormatNumberSFK(e, CCYAmoutDecimal: any) {
    var target: any = this.GetEventTarget(e);
    // //console.log(target.id, $('#' + target.id)[0].value);
    // if(target===null)
    // target=e;
    if (target.value.trim() === '') {
      target.value = '0.00';
      const evt = new Event('change');
      target.dispatchEvent(evt);
      //console.log('Zero');
    } else {
      this.sampleString1 = target.value.replace(/,/g, '');
      //console.log('in else');
      if (this.sampleString1.includes('.')) {
        //console.log('Contain dot');
        if (this.sampleString1.indexOf('.') === 0) {
          target.value = '0' + this.sampleString1;
        }
        if (CCYAmoutDecimal === undefined || CCYAmoutDecimal === '') {
          target.value = this.toFixed(this.sampleString1, 2);
          // target.value = parseFloat(this.sampleString1).toFixed(2);
        } else {
          target.value = this.toFixed(
            this.sampleString1,
            Number(CCYAmoutDecimal)
          );
          // target.value = parseFloat(this.sampleString1).toFixed(2);
        }
      } else {
        if (CCYAmoutDecimal === undefined) {
          //console.log('Does not contain dot');
          target.value = this.sampleString1 + '.00';
        } else {
          //console.log('Does not contain dot');
          target.value = this.toFixed(
            this.sampleString1,
            Number(CCYAmoutDecimal)
          );
        }
      }
      target.value = target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    // //console.log(notional);
    //   return notional;
    return target.value;
  }
  InputNumbersOnlyWithoutDecforSpreadSFK(e) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;

    if (Number(target.value) > 100000 || Number(target.value) < 0) {
      return false;
    }
    if (code === 46) {
      // this.sampleString2 = target.value;
      if (target.value.includes('.')) {
        return false;
      } else {
        return true;
      }
    }
    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      //console.log('return false');
      return false;
    }

    //console.log('return true');
    return true;
  }
  validateSpreadRateSFK(e, _fixedDecimal: number) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    if (target.value.includes('.')) {
      console.log('Decimal detected');
      target.value = parseFloat(target.value).toFixed(2);
    }
  }
  toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }
  InputNunbersOnlyWithoutDecforSpread(e) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;

    if (Number(target.value) > 100000 || Number(target.value) < 0) {
      return false;
    }
    if (code === 46) {
      // this.sampleString2 = target.value;
      if (target.value.includes('.')) {
        return false;
      } else {
        return true;
      }
    }
    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      //console.log('return false');
      return false;
    }

    //console.log('return true');
    return true;
  }
  validateSpreadRate(e, _fixedDecimal: number) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    if (target.value.includes('.')) {
      console.log('Decimal detected');
      target.value = parseFloat(target.value).toFixed(2);
    }
  }

  // End Ketan S on 8-Apr-2021

  getLocalDateFromEpochDate(epochdate) {
    // const datetime = epochdate.replace(/(Date\(|(\/)|\))/g,'');
    return new Date(epochdate.match(/\d+/)[0] * 1);
  }

  SelectFullText(event) {
    const target: any = this.GetEventTarget(event);
    target.select();
  }
  formatNotionalDecimal(amount: string, defaultValue: number, decimal: number) {
    if (amount.toString().match(/([kK]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[kK]/g, '')) * 1000).toString();
    } else if (amount.toString().match(/([lL]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[lL]/g, '')) * 100000).toString();
    } else if (amount.toString().match(/([mM]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[mM]/g, '')) * 1000000).toString();
    } else if (amount.toString().match(/([bB]{1})/g) != null) {
      amount = (
        parseFloat(amount.replace(/[bB]/g, '')) * 1000000000
      ).toString();
    }
    amount = parseFloat(amount) ? amount : defaultValue.toString();
    amount = parseFloat(amount)
      .toFixed(decimal)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    return amount;
  }

  FormatNumberPrecision(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
}
