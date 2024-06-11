import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EqcApifunctionService } from './eqc-apifunction.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class EqcCommonfunctionsService {
  flagForDealentryAndMultipricer = false;
  pricingIDflexi = 0;
  // Selected underlying
  private selectedShare = new BehaviorSubject(0);
  shareIndex = this.selectedShare.asObservable();

  private selectedAccount = new BehaviorSubject(0);
  Account = this.selectedAccount.asObservable();

  private toggleproduct = new BehaviorSubject<any>(0);
  toggleProduct = this.toggleproduct.asObservable();

  // total amount
  private totalAmount = new BehaviorSubject<any>(0);
  amt = this.totalAmount.asObservable();

  // Underlying currency
  private underlyingCurrency = new BehaviorSubject<any>(0);
  Currency = this.underlyingCurrency.asObservable();

  private Product = new BehaviorSubject<any>(0);
  SelectedProduct = this.Product.asObservable();

  private ProductMultiPricer = new BehaviorSubject<any>(0);
  SelectedProductMultiPricer = this.ProductMultiPricer.asObservable();

  private Module = new BehaviorSubject<any>(0);
  SelectedModule = this.Module.asObservable();

  private Tenor = new BehaviorSubject<any>(0);
  EnteredTenor = this.Tenor.asObservable();

  private SettlementWeek = new BehaviorSubject<any>(0);
  selectedSettlementWeek = this.SettlementWeek.asObservable();

  // accounts and notionals
  private selectedAccountsNotionals = new BehaviorSubject<any>({});
  accountNotionals = this.selectedAccountsNotionals.asObservable();
  private Spread = new BehaviorSubject<any>(0);
  EnteredSpread = this.Spread.asObservable();

  private Upfront = new BehaviorSubject<any>(0);
  EnteredUpfront = this.Upfront.asObservable();

  private KOIntial = new BehaviorSubject<any>(0);
  EnteredKOIntial = this.KOIntial.asObservable();

  private NonCall = new BehaviorSubject<any>(0);
  EnteredNonCall = this.NonCall.asObservable();

  private Fixed = new BehaviorSubject<any>(0);
  EnteredFixed = this.NonCall.asObservable();

  private settledate = new BehaviorSubject<any>('');
  settdate = this.settledate.asObservable();
  settlementDateValue: string;

  private maturitydate = new BehaviorSubject<any>('');
  matdate = this.maturitydate.asObservable();
  maturityDateValue: string;

  private expirydate = new BehaviorSubject<any>('');
  expdate = this.expirydate.asObservable();
  expiryDateValue: string;

  private setremark = new BehaviorSubject<any>('');
  remark = this.setremark.asObservable();

  private setstrike = new BehaviorSubject<any>(0);
  strike = this.setstrike.asObservable();

  private setStrikeMSP = new BehaviorSubject<any>(0);
  strikePriceMSP = this.setStrikeMSP.asObservable();

  private setIBPrice = new BehaviorSubject<any>(0);
  IBPrice = this.setIBPrice.asObservable();

  private setCouponPrice = new BehaviorSubject<any>(0);
  couponPrice = this.setCouponPrice.asObservable();

  private durationDays = new BehaviorSubject<any>(0);
  duration = this.durationDays.asObservable();

  private MarketPrice = new BehaviorSubject<any>(0);
  EnteredMarketPrice = this.MarketPrice.asObservable();

  private KOType = new BehaviorSubject<any>(0);
  EnteredKOType = this.KOType.asObservable();

  private KIType = new BehaviorSubject<any>(0);
  EnteredKIType = this.KIType.asObservable();

  private KIInitial = new BehaviorSubject<any>(0);
  EnteredKIInitial = this.KIInitial.asObservable();

  private QuantoFlag = new BehaviorSubject<any>('');
  EnteredQuantoFlag = this.QuantoFlag.asObservable();

  private SolveFor = new BehaviorSubject<any>('');
  getSolveFor = this.SolveFor.asObservable();

  private CouponFreq = new BehaviorSubject<any>('');
  SelectedCouponFrequency = this.CouponFreq.asObservable();

  private Frequency = new BehaviorSubject<any>('');
  SelectedFrequency = this.Frequency.asObservable();

  private LeverageRatio = new BehaviorSubject<any>('');
  SelectedLeverageRatio = this.LeverageRatio.asObservable();

  private DailyNoOfShares = new BehaviorSubject<any>('');
  SelectedDailyNoOfShares = this.DailyNoOfShares.asObservable();
  // private LimitMarket = new BehaviorSubject<any>('');
  // getLimitMarket = this.LimitMarket.asObservable();

  // private Exchange = new BehaviorSubject<any>('');
  // private ExchangeValue = [];

  private ClientYield = new BehaviorSubject<any>(0);
  EnteredClientYield = this.ClientYield.asObservable();

  private OrderType = new BehaviorSubject<any>(0);
  getOrderType = this.OrderType.asObservable();

  private checkPrice = new BehaviorSubject<any>(0);
  priceCancel = this.checkPrice.asObservable();

  ELNStocksBucket = [];
  FCNStocksBucket = [];
  DRAStocksBucket = [];
  AccumStocksBucket = [];
  DecumStocksBucket = [];

  private ShareCode = new BehaviorSubject<any>('');
  selectedShareCode = this.ShareCode.asObservable();

  // private ShareCodeAcc = new BehaviorSubject<any>('');
  // selectedShareCodeAcc = this.ShareCodeAcc.asObservable();

  SelectedUnderlyingBasket: any = {
    UnderlyingOne: {},
    UnderlyingTwo: {},
    UnderlyingThree: {},
    UnderlyingFour: {},
  };
  SelectedUnderlyingBasketArray = [];

  private ShareCount = new BehaviorSubject<any>(0);
  SelectedShareCount = this.ShareCount.asObservable();

  private Exchange = new BehaviorSubject<any>('');
  SelectedExchange = this.Exchange.asObservable();

  private NoOfDays = new BehaviorSubject<any>('');
  CalculatedNoOfDays = this.NoOfDays.asObservable();

  private Guarantee = new BehaviorSubject<any>('');
  SelectedGuarantee = this.Guarantee.asObservable();

  private PricesObserver = new BehaviorSubject<any>('');
  SignalRPrices = this.PricesObserver.asObservable();
  Prices = [];

  private ClearPrices = new BehaviorSubject<any>('');
  clearPrices = this.ClearPrices.asObservable();

  private BookDealErrorMessageSource = new BehaviorSubject<any>('');
  BookDealErrorMessage = this.BookDealErrorMessageSource.asObservable();

  private TimepassShare = new BehaviorSubject<any>('');
  SelectedTimepassShare = this.TimepassShare.asObservable();

  selectedShareIndex = 0;
  selectedAccountNumber = 0;

  private SelectedUnderlyingarraybeahv = new BehaviorSubject<any>('');
  SelectedUnderlyingarrayObs = this.SelectedUnderlyingarraybeahv.asObservable();

  private LPPricesObserver = new BehaviorSubject<any>('');
  LPSignalRPrices = this.LPPricesObserver.asObservable();
  LPPrices = [];

  SelectedUnderlyingarray = [];
  dateFor: string;

  private FCNPricesObserver = new BehaviorSubject<any>('');
  FCNSignalRPrices = this.FCNPricesObserver.asObservable();
  FCNPrices = [];

  private DRAPricesObserver = new BehaviorSubject<any>('');
  DRASignalRPrices = this.DRAPricesObserver.asObservable();
  DRAPrices = [];

  private AQPricesObserver = new BehaviorSubject<any>('');
  AQSignalRPrices = this.AQPricesObserver.asObservable();
  AQPrices = [];

  private DQPricesObserver = new BehaviorSubject<any>('');
  DQSignalRPrices = this.DQPricesObserver.asObservable();
  DQPrices = [];

  private BENPricesObserver = new BehaviorSubject<any>('');
  BENSignalRPrices = this.BENPricesObserver.asObservable();
  BENPrices = [];

  private EQOPricesObserver = new BehaviorSubject<any>('');
  EQOSignalRPrices = this.EQOPricesObserver.asObservable();
  EQOPrices = [];

  private PHXPricesObserver = new BehaviorSubject<any>('');
  PHXSignalRPrices = this.PHXPricesObserver.asObservable();
  PHXPrices = [];

  // private selectedCCY = new BehaviorSubject<any>(0);

  // CCY = this.selectedCCY.asObservable();

  nativeElement: any;
  Shares = [];
  CurrencyList = [];
  // SelectedUnderlyingarray: any[];

  year: number;
  month: number;
  today: number;

  month_names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  day_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendar: HTMLDivElement;
  calendarBackdrop: HTMLDivElement;
  count = 0;
  entityArray = {
    '1': 'BNPP',
    '2': 'Citi',
    '3': 'Commerz',
    '4': 'CS',
    '5': 'GS',
    '6': 'HSBC',
    '7': 'JPM',
    '8': 'Raiffeisen',
    '9': 'Leonteq',
    '10': 'RBC',
    '11': 'SocGen',
    '12': 'UBS',
    '13': 'Vontobel',
    '14': 'OCBC',
  };

  AddNewParam = [
    {
      Param: '+1% Strike',
    },
    {
      Param: '-1% Strike',
    },
    {
      Param: '+1 Tenor',
    },
    {
      Param: '-1 Tenor',
    },
    {
      Param: '+1% ClientYield',
    },
    {
      Param: '-1% ClientYield',
    },
    {
      Param: '+1% KO',
    },
    {
      Param: '-1% KO',
    },
  ];
  FCNAddNewParam = [
    {
      Param: '+1% Strike',
    },
    {
      Param: '-1% Strike',
    },
    {
      Param: '+1 Tenor',
    },
    {
      Param: '-1 Tenor',
    },
    {
      Param: '+1% IB Price',
    },
    {
      Param: '-1% IB Price',
    },
    {
      Param: '+1% Coupon',
    },
    {
      Param: '-1% Coupon',
    },
    {
      Param: '+1% KO',
    },
    {
      Param: '-1% KO',
    },
    {
      Param: '+1% KI',
    },
    {
      Param: '-1% KI',
    },
  ];

  ACCUAddNewParam = [
    {
      Param: '+1% Strike',
    },
    {
      Param: '-1% Strike',
    },
    {
      Param: '+1% Upfront',
    },
    {
      Param: '-1% Upfront',
    },
    {
      Param: '+3 Tenor',
    },
    {
      Param: '-3 Tenor',
    },
    {
      Param: 'Change to Normal',
    },
    {
      Param: 'Change to Leverage',
    },
    {
      Param: '+1 Mth Guarantee period',
    },
    {
      Param: '-1 Mth Guarantee period',
    },
  ];

  private tenor1 = new BehaviorSubject<any>('');
  tenorNumber = this.tenor1.asObservable();

  private limitMarket = new BehaviorSubject<any>('');
  limitMarketValue = this.limitMarket.asObservable();

  clearAccounts = [];

  login = new BehaviorSubject<any>('');
  loginStatus = this.login.asObservable();

  MSPStrike: number;
  MSPTenor: number;
  MSPTenorType: string;
  MSPClientYield: number;
  MSPKO: number;
  MSPIBPrice: number;
  MSPCoupon: number;
  MSPKI: number;
  MSPUpfront: number;
  MSPChangeTonormalorLeverage: number;
  MSPGuanteePeriod = 0;

  constructor(
    private EQC_afs: EqcApifunctionService,
    private Auth_Api: AuthService
  ) {
    try {
      this.setSelectedProduct('ELN');
      this.setUnderlyingCurrency('USD');
      this.setSolveFor('StrikePercentage');
      this.setUpfront('0.5');
      this.setTenor('M');
      this.setSettlementWeek('1W');
      this.setSpread(0.5);
      this.setTenorNumber('1');
      this.setClientYield('');
      this.setIBprice('');
      this.setKOType('Continuous');
      this.setKIType('American');
      this.setCouponFrequency('semiannually');
      this.setLeverageRatio('1');
    } catch (Ex) {}
  }

  fnSetNotional(modelClass: any) {
    console.log(this.Auth_Api.UserName);
    this.EQC_afs.fnGetSpot(modelClass.AccrualDays).subscribe((res) => {
      if (res) {
        modelClass.Notional = Number(
          Number(modelClass.AccrualDays) *
            Number(JSON.parse(res.responseData)[0].Spot) *
            Number(modelClass.NoOfShare)
        ).toFixed(2);
        modelClass.remainingNotional = modelClass.NoOfShare;
        modelClass.totalNotional = modelClass.NoOfShare;
      }
    });
  }

  fnStrikeValidation(e) {
    const target = this.GetEventTarget(e);
    if (target.value) {
      target.value = parseFloat(target.value).toFixed(2);
    }
  }

  setReceivedPrices(prices: any) {
    try {
      this.Prices[this.Prices.length] = prices;
      this.PricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  CheckAllFieldsPrecision(e) {
    try {
      // if (e.value) {
      let fieldvalue = this.GetEventTarget(e).value;
      const DotPos = fieldvalue.indexOf('.');
      // //console.log(DotPos);
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
    } catch (Err) {
      //console.log(Err);
    }
  }

  LPsetReceivedPrices(prices: any) {
    try {
      // //console.log(prices);
      this.LPPrices[this.Prices.length] = prices;
      // this.PricesObserver.next(this.Prices);
      this.LPPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setNativeElement(NativeElement) {
    try {
      this.nativeElement = NativeElement;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  ToFloat(value) {
    try {
      return parseFloat(value);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  IsValid(value) {
    try {
      return !this.isNullOrUndefined(value);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  IncrementPricingID() {
    try {
      this.pricingIDflexi += 1;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  getPricingID() {
    try {
      return this.pricingIDflexi;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setStocksBucket(Array: any, productName: any) {
    try {
      console.log(Array);
      switch (productName) {
        case 'ELN':
          // this.ELNStocksBucket.next(Array);
          this.ELNStocksBucket.push({ Ccy: 'USD' });
          break;
        case 'FCN':
          this.FCNStocksBucket.push({ Ccy: 'USD' });
          break;
        case 'DRA':
          this.DRAStocksBucket.push({ Ccy: 'USD' });
          break;
        case 'ACCU':
          this.AccumStocksBucket.push({ Ccy: 'USD' });
          break;
        case 'DECU':
          this.DecumStocksBucket.push({ Ccy: 'USD' });
          break;
        case 'BEN':
          break;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  deleteStockBucketItem(index: any, productName: any) {
    try {
      // alert(productName + ' ' + index);
      switch (productName) {
        case 'ELN':
          this.ELNStocksBucket.splice(index, 1);
          break;
        case 'FCN':
          this.FCNStocksBucket.splice(index, 1);
          break;
        case 'DRA':
          this.DRAStocksBucket.splice(index, 1);
          break;
        case 'ACCU':
          this.AccumStocksBucket.splice(index, 1);
          break;
        case 'DECU':
          this.DecumStocksBucket.splice(index, 1);
          break;
        case 'BEN':
          break;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setTimepass(share: any) {
    try {
      this.TimepassShare.next(share);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setUnderlyingList(shares: any) {
    try {
      this.Shares = shares;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setStrikeMSPfunc(Strike: number) {
    try {
      Strike = Strike + 1;
      //console.log(Strike);
      this.setStrikeMSP.next(Strike);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setCurrencyList(Currencylist: any) {
    try {
      this.CurrencyList = Currencylist;
      //console.log(Currencylist);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  contains(key) {
    try {
      const findNaN = key !== key;
      let indexOf: any;
      if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
      } else {
        // tslint:disable-next-line:no-shadowed-variable
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
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  NotionalValidate(e) {
    try {
      // //console.log(e.keyCode);
      const target: any = this.GetEventTarget(e);
      console.log(target);
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace
      codes = [
        8, 9, 13, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76, 77,
        98, 107, 108, 109, 127,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  NotionalValidateELI(e) {
    try {
      // //console.log(e.keyCode);
      const target: any = this.GetEventTarget(e);
      console.log(target);
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace
      codes = [
        8, 9, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76, 77, 98,
        107, 108, 109, 127,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  NotionalChange(e) {
    try {
      const target: any = this.GetEventTarget(e);

      if (target.value === '') {
      } else {
        if (target.value.toString().match(/([kK]{1})/g) != null) {
          // //console.log('K');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[kK]/g, '')) * 1000
          ).toFixed(2);
        } else if (target.value.toString().match(/([lL]{1})/g) != null) {
          // //console.log('L');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[lL]/g, '')) * 100000
          ).toFixed(2);
        } else if (target.value.toString().match(/([mM]{1})/g) != null) {
          // //console.log('M');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
          ).toFixed(2);
        } else if (target.value.toString().match(/([bB]{1})/g) != null) {
          // //console.log('B');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(2);
        }
      }

      return target.value;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  FormatNumber1(e) {
    console.log('FormatNumber1');
    console.log(e.target.value);
    e.target.value = Math.round(Number(e.target.value));
    console.log(e.target.value);
    return e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    console.log(e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    console.log(e.target.value);
    return e.target.value;
  }
  FormatNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      const notional = $('#' + target.id)[0].value;
      console.log(notional);
      if (
        $('#' + target.id)[0].value.trim() === '' ||
        isNaN($('#' + target.id)[0].value)
      ) {
        $('#' + target.id)[0].value = '0.00';
        const evt = new Event('change');
        $('#' + target.id)[0].dispatchEvent(evt);
      } else {
        $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ','
        );
      }
      //console.log(notional);
      return parseFloat($('#' + target.id)[0].value).toFixed(2);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  UnformatNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(
        /,/g,
        ''
      );
      if ($('#' + target.id)[0].value === '0.00') {
        $('#' + target.id)[0].value = '';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setDecimal(e) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value == '' || target.value == 'NaN') {
        target.value = 0.0;
      }
      target.value = parseFloat(target.value).toFixed(2);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  InputNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      console.log(target);
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      // this.count = 0;
      codes = [
        8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      //console.log(target);
      return true;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  TenorValidation(e) {
    try {
      const target: any = this.GetEventTarget(e);
      console.log(target);
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      // this.count = 0;
      codes = [
        8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      //console.log(target);
      return true;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  moveUpSelection1(e, selectedIndex) {
    try {
      const target: any = this.GetEventTarget(e);
      console.log(target);
      if (selectedIndex !== undefined) {
        if (selectedIndex > 0) {
          selectedIndex--;
        }
        // this.selectedShare.next(selectedIndex);
        if ($('.SelectorBox').length > 0) {
          this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
          return selectedIndex;
        } else {
          return 0;
        }
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  moveDownSelection1(e, selectedIndex) {
    try {
      const target: any = this.GetEventTarget(e);
      console.log(target);
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
      //console.log("Error:", error);
    }
  }

  ScrollTo(container, element, direction) {
    try {
      const $container = $(container);
      const $scrollTo = $(element);
      switch (direction) {
        case 'up':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop(),
              scrollLeft: 0,
            },
            10
          );
          break;
        case 'down':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop() -
                100,
              scrollLeft: 0,
            },
            10
          );
          break;
        default:
          break;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  createCalendar(nativeElement, d, m, y, dateFor) {
    try {
      this.nativeElement = nativeElement;
      this.dateFor = dateFor;
      // //console.log(dateFor);
      // if (document.getElementsByClassName('calendar').length > 0) {
      if (this.nativeElement.querySelectorAll('.calendar').length > 0) {
        $('.calendar').remove();
      }
      const that = this;
      let date: Date;
      // //console.log(d, m, y);
      if (!this.isNullOrUndefined(d && m && y)) {
        date = new Date(y, m, d);
      } else {
        date = new Date();
      }
      const todaymonth = date.getMonth();
      this.month = todaymonth;
      const todayyear = date.getFullYear();
      this.year = todayyear;
      const first_date =
        this.month_names[todaymonth] + ' ' + 1 + ' ' + todayyear;
      const day_no = this.day_names.indexOf(
        new Date(first_date).toDateString().substring(0, 3)
      );
      const days = new Date(todayyear, todaymonth + 1, 0).getDate();
      const monthSelector = document.createElement('select');
      for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        if (i === todaymonth) {
          option.setAttribute('selected', 'true');
        }
        option.innerHTML = this.month_names[i];
        monthSelector.appendChild(option);
      }
      monthSelector.addEventListener('change', function (e) {
        const target = <HTMLSelectElement>that.GetEventTarget(e);
        that.month = target.selectedIndex;
        that.createCalendar(
          nativeElement,
          date.getDate(),
          target.selectedIndex,
          todayyear,
          dateFor
        );
      });
      const yearSelector = document.createElement('select');
      yearSelector.style.cssFloat = 'right';
      for (let i = 1950; i < 2050; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        if (i === todayyear) {
          option.setAttribute('selected', 'true');
        }
        yearSelector.appendChild(option);
      }
      yearSelector.addEventListener('change', function (e) {
        const target = <HTMLSelectElement>that.GetEventTarget(e);
        that.year = parseInt(target.value, 10);
        that.createCalendar(
          nativeElement,
          date.getDate(),
          todaymonth,
          target.value,
          dateFor
        );
      });
      const calendarTable = this.getCalendar(day_no, days);
      // const calendar = document.getElementsByClassName('calendar-backdrop')[0];
      const calendar =
        this.nativeElement.querySelectorAll('.calendar-backdrop')[0];
      const calendarDiv = document.createElement('div');
      // if (document.getElementsByClassName('calendar-table').length > 0) {
      if (this.nativeElement.querySelectorAll('.calendar-table').length > 0) {
        $('.calendar-table').remove();
      }
      calendar.appendChild(calendarDiv);
      calendarDiv.classList.add('calendar');
      calendarDiv.appendChild(monthSelector);
      calendarDiv.appendChild(yearSelector);
      calendarDiv.appendChild(calendarTable);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  getCalendar(day_no, days) {
    try {
      const that = this;
      const table = document.createElement('table');
      table.classList.add('calendar-table');
      let tr = document.createElement('tr');
      let c = 0;

      for (c; c <= 6; c++) {
        const td = document.createElement('td');
        td.innerHTML = 'SMTWTFS'[c];
        tr.appendChild(td);
      }
      table.appendChild(tr);

      tr = document.createElement('tr');
      for (c = 0; c <= 6; c++) {
        if (c === parseInt(day_no, 10)) {
          break;
        }
        const td = document.createElement('td');
        td.innerHTML = '';
        tr.appendChild(td);
      }
      table.appendChild(tr);

      let count = 1;
      for (c; c <= 6; c++) {
        const td = document.createElement('td');
        td.innerHTML = count.toString();
        count++;

        td.addEventListener('click', function (e) {
          that.selectDate(e);
        });

        tr.appendChild(td);
      }
      table.appendChild(tr);

      for (let r = 3; r <= 7; r++) {
        tr = document.createElement('tr');
        for (let i = 0; i <= 6; i++) {
          if (count > days) {
            table.appendChild(tr);
            return table;
          }
          const td = document.createElement('td');
          td.innerHTML = count.toString();
          count++;

          td.addEventListener('click', function (e) {
            that.selectDate(e);
          });

          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  selectDate(e) {
    try {
      const target = <HTMLTableDataCellElement>this.GetEventTarget(e);
      // if (document.getElementsByClassName('selectedDate').length > 0) {
      if (this.nativeElement.querySelectorAll('.selectedDate').length > 0) {
        // document.getElementsByClassName('selectedDate')[0].classList.remove('selectedDate');
        this.nativeElement
          .querySelectorAll('.selectedDate')[0]
          .classList.remove('selectedDate');
      }
      target.classList.add('selectedDate');
      this.today = parseInt(target.innerHTML, 10);
      // if (document.getElementsByClassName('calendar').length > 0) {
      if (this.nativeElement.querySelectorAll('.calendar').length > 0) {
        $('.finalDate').remove();
      }
      // //console.log(this.today + '-' + this.month + '-' + this.year);
      const calendar = this.nativeElement.querySelectorAll('.calendar')[0]; // document.getElementsByClassName('calendar')[0];
      const dateDiv = <HTMLDivElement>document.createElement('div');
      dateDiv.style.textAlign = 'center';
      dateDiv.classList.add('finalDate');
      dateDiv.innerHTML =
        'Select: ' +
        this.today +
        '-' +
        this.month_names[this.month].substring(0, 3) +
        '-' +
        this.year;
      calendar.appendChild(dateDiv);
      const that = this;
      dateDiv.addEventListener('click', function (event) {
        console.log(event);
        const calendarContainer =
          that.nativeElement.querySelectorAll('.calendar-backdrop')[0]; // document.getElementsByClassName('calendar-backdrop')[0];
        const dateControl = <HTMLInputElement>(
          that.nativeElement.querySelectorAll(
            '[data-dateType=' + that.dateFor + ']'
          )[0]
        );
        // dateControl.value = that.today + '-' + that.month_names[that.month].substring(0, 3) + '-' + that.year;
        dateControl.value =
          that.year +
          '-' +
          ((that.month + 1).toString().length === 1
            ? '0' + (that.month + 1).toString()
            : (that.month + 1).toString()) +
          '-' +
          that.today;
        // //console.log($(dateControl).val());
        dateControl.focus();
        const evt = new Event('change');
        dateControl.dispatchEvent(evt);
        calendarContainer.classList.toggle('show-calendar');
        // //console.log($(<HTMLInputElement>(that.nativeElement.querySelectorAll('[data-dateType=' + that.dateFor + ']'))[0]));
        // $(<HTMLInputElement>(that.nativeElement.querySelectorAll('[data-dateType=' + that.dateFor + ']'))[0])[0].trigger('change');
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setBookDealError(message: string) {
    try {
      this.BookDealErrorMessageSource.next(message);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  amtsum(amtarray: any) {
    try {
      let sum = 0;
      for (let i = 0; i < amtarray.length; i++) {
        sum += amtarray[i];
      }
      this.totalAmount.next(sum);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setUnderlyingCurrency(currency: any) {
    try {
      this.underlyingCurrency.next(currency);
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
      this.durationDays.next(Math.abs(Math.floor(days)));
      return Math.abs(Math.floor(days));
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSelectedProduct(prod: any) {
    try {
      this.Product.next(prod);
      // this.SelectedUnderlyingarray.splice(0, this.SelectedUnderlyingarray.length);
      this.SelectedUnderlyingarray.splice(
        0,
        this.SelectedUnderlyingarray.length
      );
      this.SelectedUnderlyingBasket = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
      };
      if (prod !== 'ELN') {
        this.setKOType('American');
      }
      // this.MSPTenor = 3;
      // this.MSPTenorType = 'M';
      // this.MSPStrike = 98.5;
      // this.MSPIBPrice = 95;
      // this.MSPUpfront = 0.00;
      // this.MSPKO = 105;
      // this.MSPKI = 95;
      // this.MSPCoupon = 10;
      // this.MSPGuanteePeriod = 1;
      // this.MSPChangeTonormalorLeverage = 1;
      // this.ELNStocksBucket.splice(1, this.ELNStocksBucket.length);
      // this.FCNStocksBucket.splice(1, this.FCNStocksBucket.length);
      // this.DRAStocksBucket.splice(1, this.DRAStocksBucket.length);
      // this.AccumStocksBucket.splice(1, this.AccumStocksBucket.length);
      // this.DecumStocksBucket.splice(1, this.DecumStocksBucket.length);
      this.setSolveFor('StrikePercentage');
      // if (prod === 'ELN' || prod === 'Accum' || prod === 'Decum') {
      //   //   //console.log('   ' + this.product);
      // } else {
      //   //   //console.log('   ' + this.product);
      //   this.setSolveFor('CONVERSION_STRIKE');
      // }
      // this.apifunction.loadShares(prod);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSeletcedProductMultToDeal(prod: any) {
    try {
      this.Product.next(prod);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSelectedProductMultiPricer(prod: any) {
    try {
      this.ProductMultiPricer.next(prod);
      this.SelectedUnderlyingarray.splice(
        0,
        this.SelectedUnderlyingarray.length
      );
      this.SelectedUnderlyingBasket = {
        UnderlyingOne: {},
        UnderlyingTwo: {},
        UnderlyingThree: {},
        UnderlyingFour: {},
      };
      this.MSPTenor = 3;
      this.MSPTenorType = 'M';
      this.MSPStrike = 98.5;
      this.MSPIBPrice = 95;
      this.MSPUpfront = 0.0;
      this.MSPKO = 105;
      this.MSPKI = 95;
      this.MSPCoupon = 10;
      this.MSPGuanteePeriod = 0;
      this.MSPChangeTonormalorLeverage = 1;
      this.ELNStocksBucket.splice(1, this.ELNStocksBucket.length);
      this.FCNStocksBucket.splice(1, this.FCNStocksBucket.length);
      this.DRAStocksBucket.splice(1, this.DRAStocksBucket.length);
      this.AccumStocksBucket.splice(1, this.AccumStocksBucket.length);
      this.DecumStocksBucket.splice(1, this.DecumStocksBucket.length);
      this.setSolveFor('StrikePercentage');
      // if (prod === 'ELN' || prod === 'Accum' || prod === 'Decum') {
      //   //   //console.log('   ' + this.product);
      // } else {
      //   //   //console.log('   ' + this.product);
      //   this.setSolveFor('CONVERSION_STRIKE');
      // }
      // this.apifunction.loadShares(prod);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  SetSelectedModule(modName: any) {
    try {
      this.Module.next(modName);
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
        ISINName: ISINname,
        Last1yearHighValue: Last1yearHighValue,
        Last1yearLowValue: Last1yearLowValue,
        Spot: Spot,
        Riskrating: RiskRating,
      });
      this.setSelectedSharesArray(this.SelectedUnderlyingarray);
      this.SelectedUnderlyingBasketArray.push({
        Code: Code,
        Exchange: ExchangeCode,
        CCY: Ccy,
        Spot: Spot,
        ISINName: ISINname,
      });
      this.updateShareBasket();
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  EmptyUnderlyingArray() {
    try {
      this.SelectedUnderlyingBasketArray = [];
      this.SelectedUnderlyingarray = [];
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setTenor(TenorVar: any) {
    try {
      // //console.log('settenor' + TenorVar);
      this.Tenor.next(TenorVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSettlementWeek(week: any) {
    try {
      this.SettlementWeek.next(week);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setselectedAccoutNotional(accountArray: any) {
    try {
      this.selectedAccountsNotionals.next(accountArray);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSpread(spreadVar: any) {
    try {
      this.Spread.next(spreadVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setUpfront(UpfrontVar: any) {
    try {
      this.Upfront.next(UpfrontVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setKOIntial(KOIntialVar: any) {
    try {
      this.KOIntial.next(KOIntialVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setNonCall(NonCallVar: any) {
    try {
      this.NonCall.next(NonCallVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setFixed(FixedVar: any) {
    try {
      this.Fixed.next(FixedVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setAllDate(settleVar: any, maturityVar: any, expiryVar: any) {
    try {
      // //console.log('setting dates');
      this.settledate.next(settleVar);
      this.maturitydate.next(maturityVar);
      this.expirydate.next(expiryVar);
      this.settlementDateValue = settleVar;
      this.maturityDateValue = maturityVar;
      this.expiryDateValue = expiryVar;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setRemark(remarkVar: any) {
    try {
      this.setremark.next(remarkVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSelectedSharesArray(array: any) {
    try {
      //console.log(this.SelectedUnderlyingBasketArray);
      this.SelectedUnderlyingarraybeahv.next(array);
      this.SelectedUnderlyingarray = array;
      this.SelectedUnderlyingBasket.UnderlyingOne['Exchange'] =
        array[0]['ExchangeCode'];
      //console.log(array);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setStrike(strikeVar: any) {
    try {
      this.setstrike.next(strikeVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setcouponPrice(couponPriceVar: any) {
    try {
      this.setCouponPrice.next(couponPriceVar);
      //console.log('Coupon : ' + couponPriceVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setIBprice(IBpriceVar: any) {
    try {
      this.setIBPrice.next(IBpriceVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setMarketPrice(MarketVar: any) {
    try {
      this.MarketPrice.next(MarketVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setKOType(KOTypeVar: any) {
    try {
      this.KOType.next(KOTypeVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setShareCount(Quanto: any) {
    try {
      this.ShareCount.next(Quanto);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setQuntoFlag(Quanto: any) {
    try {
      this.QuantoFlag.next(Quanto);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setDailyNoOfShares(ShareCount: any) {
    try {
      this.DailyNoOfShares.next(ShareCount);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setSolveFor(solve: any) {
    try {
      this.SolveFor.next(solve);
    } catch (error) {
      //console.log("Error:", error);
    }
    //  //console.log('SolveFor:' + solve);
  }

  // setReceivedPrices(prices: any) {
  //   try {
  //     // //console.log(prices);
  //     this.Prices[this.Prices.length] = prices;
  //     // this.PricesObserver.next(this.Prices);
  //     this.PricesObserver.next(prices);
  //   }
  //   catch (error) {
  //     //console.log("Error:", error);
  //   }
  // }

  // getExchange(exchnge: any) {
  //   this.Exchange.next(exchnge);
  //   //console.log('getexchange' + exchnge);
  // }

  setShareCode(sharecode: any) {
    try {
      this.ShareCode.next(sharecode);
    } catch (error) {
      //console.log("Error:", error);
    }
    //  //console.log('sharecode' + sharecode);
  }
  // setShareCodeAcc(sc: any) {
  //   this.ShareCodeAcc.next(sc);
  //   //  //console.log('sharecode' + sharecode);
  // }
  setClientYield(CY: any) {
    try {
      this.ClientYield.next(CY);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  // setMarketLimit(limit: any)  {
  //   this.LimitMarket.next(limit);
  //   //console.log(limit);
  // }
  clearAll() {
    try {
      this.Spread.next('');
      this.settledate.next('');
      this.maturitydate.next('');
      this.expirydate.next('');
      this.durationDays.next('');
      this.Upfront.next('0.5');
      this.KOIntial.next('');
      this.setIBPrice.next('');
      this.setstrike.next('');
      this.NonCall.next('');
      this.MarketPrice.next('');
      this.selectedAccountsNotionals.next([]);
      this.totalAmount.next(0);
      this.tenor1.next('1');
      // this.PricesObserver.next('');
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  ClearPricesFromMultiToDealEntry() {
    try {
      this.PricesObserver.next('');
      this.Prices = [];
      this.FCNPricesObserver.next('');
      this.FCNPrices = [];
      this.DRAPricesObserver.next('');
      this.DRAPrices = [];
      this.AQPricesObserver.next('');
      this.AQPrices = [];
      this.DQPricesObserver.next('');
      this.DQPrices = [];
      this.BENPricesObserver.next('');
      this.BENPrices = [];
      this.EQOPricesObserver.next('');
      this.EQOPrices = [];
      this.PHXPricesObserver.next('');
      this.PHXPrices = [];
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setTenorNumber(tenorvar: any) {
    try {
      //  //console.log('tenor number' + tenorvar);
      this.tenor1.next(tenorvar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setCouponFrequency(freq: any) {
    try {
      // //console.log('freq' + freq);
      this.CouponFreq.next(freq);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setKI(ki: any) {
    try {
      //  //console.log('KI' + ki);
      this.KIInitial.next(ki);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setKIType(KI: any) {
    try {
      // //console.log('KIType' + KI);
      this.KIType.next(KI);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setOrderType(order: any) {
    try {
      // //console.log('Order' + order);
      this.OrderType.next(order);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  priceCancelCheck(priceStatus: any) {
    try {
      this.checkPrice.next(priceStatus);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setExchangeCode(ExchangeCode: any) {
    try {
      this.Exchange.next(ExchangeCode);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setNoOfDays_Accum(Days: any) {
    try {
      this.NoOfDays.next(Days);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setFrequency(frq: any) {
    try {
      this.Frequency.next(frq);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setLeverageRatio(LR: any) {
    try {
      this.LeverageRatio.next(LR);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setGuarantee(Guarantee: any) {
    try {
      this.Guarantee.next(Guarantee);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setLimitMarket(limitMarketVar: any) {
    try {
      this.limitMarket.next(limitMarketVar);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  clearPricesEvent(status: any) {
    try {
      this.ClearPrices.next(status);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  // CheckAllFieldsPrecision(e) {
  //   try {
  //     // if (e.value) {
  //     let fieldvalue = this.GetEventTarget(e).value;
  //     const DotPos = fieldvalue.indexOf('.');
  //     // //console.log(DotPos);
  //     if (DotPos < 0) {

  //       return fieldvalue + '.00';
  //     } else if (DotPos === 0) {
  //       fieldvalue = '0' + fieldvalue;
  //       const diff = (fieldvalue.length - 2) - DotPos;
  //       if (diff === 1) {
  //         return fieldvalue + '0';
  //       }

  //       return fieldvalue;
  //     } else {
  //       const diff = (fieldvalue.length - 1) - DotPos;
  //       if (diff === 1) {
  //         return fieldvalue + '0';
  //       }

  //       return fieldvalue;
  //     }
  //     // } else {
  //     //   let fieldvalue = e;
  //     //   const DotPos = fieldvalue.indexOf('.');
  //     //   // //console.log(DotPos);
  //     //   if (DotPos < 0) {

  //     //     return fieldvalue + '.00';
  //     //   } else if (DotPos === 0) {
  //     //     fieldvalue = '0' + fieldvalue;
  //     //     const diff = (fieldvalue.length - 2) - DotPos;
  //     //     if (diff === 1) {
  //     //       return fieldvalue + '0';
  //     //     }

  //     //     return fieldvalue;
  //     //   } else {
  //     //     const diff = (fieldvalue.length - 1) - DotPos;
  //     //     if (diff === 1) {
  //     //       return fieldvalue + '0';
  //     //     }

  //     //     return fieldvalue;
  //     //   }
  //     // }

  //   } catch (Err) {
  //     //console.log(Err);
  //   }
  // }
  SetMSPStrike(MSPStrike: number) {
    try {
      this.MSPStrike = MSPStrike;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPTenor(MSPTenor: string) {
    try {
      if (MSPTenor.includes('M')) {
        const i = MSPTenor.indexOf('M');
        this.MSPTenor = parseInt(MSPTenor.substr(0, i), 10);
        this.MSPTenorType = MSPTenor.substr(i, 1);
      } else if (MSPTenor.includes('Y')) {
        const i = MSPTenor.indexOf('Y');
        this.MSPTenor = parseInt(MSPTenor.substr(0, i), 10);
        this.MSPTenorType = MSPTenor.substr(i, 1);
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPClientYield(MSPClientYield: number) {
    try {
      this.MSPClientYield = MSPClientYield;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPKO(MSPKO: number) {
    try {
      this.MSPKO = MSPKO;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPIBPrice(MSPIBPrice: number) {
    try {
      this.MSPIBPrice = MSPIBPrice;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPCoupon(MSPCoupon: number) {
    try {
      this.MSPCoupon = MSPCoupon;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPKI(MSPKI: number) {
    try {
      this.MSPKI = MSPKI;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPUpfront(MSPUpfront: number) {
    try {
      this.MSPUpfront = MSPUpfront;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPChangeTonormalorLeverage(MSPChangeTonormalorLeverage: number) {
    try {
      this.MSPChangeTonormalorLeverage = MSPChangeTonormalorLeverage;
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  SetMSPGuanteePeriod(MSPGuanteePeriod: number) {
    try {
      this.MSPGuanteePeriod = MSPGuanteePeriod;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setFCNReceivedPrices(prices: any) {
    try {
      this.FCNPrices[this.FCNPrices.length] = prices;
      this.FCNPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setDRAReceivedPrices(prices: any) {
    try {
      this.DRAPrices[this.DRAPrices.length] = prices;
      this.DRAPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setAQReceivedPrices(prices: any) {
    try {
      this.AQPrices[this.AQPrices.length] = prices;
      this.AQPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setDQReceivedPrices(prices: any) {
    try {
      this.DQPrices[this.DQPrices.length] = prices;
      this.DQPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setBENReceivedPrices(prices: any) {
    try {
      this.BENPrices[this.BENPrices.length] = prices;
      this.BENPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  setEQOReceivedPrices(prices: any) {
    try {
      this.EQOPrices[this.EQOPrices.length] = prices;
      this.EQOPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  setPHXReceivedPrices(prices: any) {
    try {
      this.PHXPrices[this.PHXPrices.length] = prices;
      this.PHXPricesObserver.next(prices);
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  navCounter: any = 5;

  setSidebarCounter(index: any) {
    this.navCounter = index;
  }

  getSidebarCounter() {
    return this.navCounter;
  }

  isNullOrUndefined(value: any) {
    return value === null || value === undefined;
  }
}
