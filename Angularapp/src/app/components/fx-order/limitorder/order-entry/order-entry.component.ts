import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';
import { ApifunctionService } from '../../apifunction.service';
import { environment } from '../../../../../environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { CommonfunctionService } from '../../commonfunction.service';
import { Subscription } from 'rxjs';
import { CustomerApiService } from 'src/app/services/customer-api.service';
// import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

Array.prototype.sortBy = function (p): Array<any> {
  return this.slice(0).sort(function (a, b) {
    return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
  });
};

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
  styleUrls: ['./order-entry.component.css'],
})
export class OrderEntryComponent implements OnInit, OnChanges {
  //Input variables added by Uddesh on Feb 22, 2022
  @Input() ParentMsg: any;
  @Input() ParentPair: any;
  @Input() ParentDirection: any;
  @Input() ParentRate: any;

  commonfunction: CommonfunctionService;
  temp: any;
  ccyPairs: any;
  ssiDetails: any;
  fromDate: string;
  toDate: string;
  ExpiryToDate = ''; // This also works '10-Jan-2020 05:00 PM';
  ExpiryToTime: any;
  selectedCCY: string;
  precision = 2;
  AmountDecimal1 = 2;
  AmountDecimal2 = 2;
  rate: any = '0.00';
  direction = 'Buy';
  orderExpType = 'GTD';
  orderBookedMessage: string;
  billingAmt: any;
  creditAmt: any;
  errormsg: any;
  targetRate: any;
  billingAcc = '';
  assetURL: string;
  goodOrder: boolean;
  creditAcc = '';
  prices: any;
  notionalCcy: string;
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
  sampleString2: any;
  length: number;
  TransactionShow: boolean;
  AmendScreen = false;
  AmendObj: any;
  hours = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '00',
  ];
  mins = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
  ];
  addGMT: 19800;
  selectedHour = '';
  selectedMin = '';
  dateDisabled = false;
  timeDisabled = false;
  customerList = [{ customer: '000' }];
  CustPAN: any;
  CustomerCIF: any;
  CustomerSegment: any;
  CustomerPortfolio: any;
  RMName: any;
  RMID: any;
  Customer: any;
  showCustomerList = false;
  customerInfo = [];
  // customerID: string;
  // customerNameCode: string;
  selectedCustomerIndex = 0;
  flag: boolean;
  private customerListData: Subscription;
  private account: Subscription;
  tradingOption: string;
  tradingmsg: string;
  subscription_fxspotbidask: Subscription;
  subscription_currencypair: Subscription;
  subscription_getaccountdetails: Subscription;
  subscription_bookorder: Subscription;
  subscription_amendorder: Subscription;
  subscription_amendobeservar: Subscription;
  validateTradeSubscription: Subscription;
  // singleCcylist = [{ 'ccy': 'AED' }, { 'ccy': 'AUD' }, { 'ccy': 'CAD' }, { 'ccy': 'EUR' }, { 'ccy': 'GBP' }, { 'ccy': 'HKD' }, { 'ccy': 'IDR' }, { 'ccy': 'INR' }, { 'ccy': 'JPY' }, { 'ccy': 'MYR' }, { 'ccy': 'SGD' }, { 'ccy': 'USD' }];
  asset1list = [];
  asset2list = [];
  // sellCcy = 'USD';
  sellCcy = '';
  buyCcy = '';
  datainputvalue = 'Buy';
  validate_uniqueID: string;
  orderType = 'Limit';
  pricingLoader_market = false;
  SessionID: string;
  uniqueKey: string;
  // optiontype = 'Spot';
  RMspread: any;
  ValueDate_mkt: any;
  FixingDate_mkt: any;
  SpotDate_mkt: any;
  valuedateday: string;
  valuedatemonth: string;
  valuedateyear: string;
  DealerID: any;
  priceProvider: string = 'STH';

  priceQuoteRefSell: string;
  PPSell: string;
  QuoteIDSell: string;
  swapPointsSell: string;
  spotrate: string;
  ExternalQuoteIDSell: string;
  againprice = 0;
  goPrice_mfk = 0;
  eventName = '';
  datesSubscription: Subscription;
  pricingSubscription: Subscription;
  eventNameSubscription: Subscription;
  spreadSubscription: Subscription;
  creditcheckSubscription: Subscription;
  settlementLimitObserver: Subscription;
  orderPlacement: Subscription;
  ccypairsSubscription: Subscription;
  tradingOnOffSubsciption: Subscription;
  custrate: any;
  custRevenueSell: any;
  indicativeRevenue: any;
  midRatePair: string;
  midRate: any;
  tradeLoader = false;
  productType = 'FXSpot';
  tenor = 'SPOT';
  tenorList = [
    { t: '1W' },
    { t: '2W' },
    { t: '3W' },
    { t: '1M' },
    { t: '3M' },
    { t: '6M' },
    { t: '1Y' },
  ];
  selectCcyCount = 0;
  ccypairflagincreasedone = false;
  pointShift: any;
  bankRate: any;
  timerId: any;
  sec = 10;
  minDate: any;
  templateSerialNo: number;
  windowObj: any;
  settlementList = [{ s: 'SPOT' }, { s: 'TOD' }, { s: 'TOM' }];
  showTenorBox = false;
  showSettlementBox = false;
  autoRoll = false;
  accinfo: any;
  commonDataSubscription: Subscription;
  purposeCodeList = [];
  purposeCode = '';
  purposeTemplateCode = 'TestingTemp';
  billingAccountList = [];
  creditAccountList = [];
  porfolioSubscription: Subscription;
  accountBalanceSubscription: Subscription;
  PortfolioList = [];
  accountBalanceData = [];
  cashBalanceInsellCcy = '0';
  cashBalance = [];
  stpFlag = true;
  overrideExceptionRule = false;
  exceptionFlag = false;
  routeDI_subscription: Subscription;
  cancelrequestpopup = false;
  cashBalanceCheckFlag = true;
  routetodealerpopup = false;
  customerID: any;
  constructor(
    private afs: ApifunctionService,
    public cdRef: ChangeDetectorRef,
    private elem: ElementRef,
    private ref: ChangeDetectorRef,
    public authApi: AuthService,
    private homeApi: HomeApiService,
    private wfs: WorkflowApiService,
    private cusApi: CustomerApiService
  ) {
    this.assetURL = environment.assetURL;
    // this.commonfunction = cfs;
    this.errormsg = '';
    this.orderBookedMessage = '';
    this.AmendScreen = false;

  }
  ngOnDestroy() {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
    }
    if (this.windowObj !== undefined) {
      this.windowObj.close();
    }
    this.orderBookedMessage = '';
    this.errormsg = '';
    this.afs.BookLimitOrderData.next([]);
    // this.afs.docData.next([]);
    this.afs.GetFxSpotBidAskRate.next(0.0);
    // this.afs.getAccountBalanceData.next([]);
    // this.afs.getPortfolioData.next([]);
    this.afs.FXOBestPriceTransaction.next([]);
    this.afs.GetFXDatesForSpotForwardSF.next('');
    this.afs.GetFXBookDeal.next([]);
    this.afs.GetSpreadDetails.next([]);
    if (this.account) {
      this.account.unsubscribe();
    }
    if (this.customerListData) {
      this.customerListData.unsubscribe();
    }
    this.afs.CcyPairs.next('');
    // this.afs.getSettleLimit.next([]);
    // this.afs.checkCredit.next([]);
    // this.afs.getAccountBalanceData.next([]);
    // this.afs.getPortfolioData.next([]);
    this.afs.AmendLimitOrder.next({});
    if (this.subscription_amendobeservar !== undefined) {
      this.subscription_amendobeservar.unsubscribe();
    }
    if (this.subscription_amendorder !== undefined) {
      this.subscription_amendorder.unsubscribe();
    }
    if (this.subscription_bookorder !== undefined) {
      this.subscription_bookorder.unsubscribe();
    }
    if (this.subscription_currencypair !== undefined) {
      this.subscription_currencypair.unsubscribe();
    }
    if (this.subscription_fxspotbidask !== undefined) {
      this.subscription_fxspotbidask.unsubscribe();
    }
    if (this.subscription_getaccountdetails !== undefined) {
      this.subscription_getaccountdetails.unsubscribe();
    }
    if (this.validateTradeSubscription !== undefined) {
      this.validateTradeSubscription.unsubscribe();
    }
    if (this.datesSubscription !== undefined) {
      this.datesSubscription.unsubscribe();
    }
    if (this.pricingSubscription !== undefined) {
      this.pricingSubscription.unsubscribe();
    }
    if (this.eventNameSubscription !== undefined) {
      this.eventNameSubscription.unsubscribe();
    }
    if (this.spreadSubscription !== undefined) {
      this.spreadSubscription.unsubscribe();
    }
    if (this.creditcheckSubscription !== undefined) {
      this.creditcheckSubscription.unsubscribe();
    }
    if (this.settlementLimitObserver !== undefined) {
      this.settlementLimitObserver.unsubscribe();
    }
    if (this.orderPlacement !== undefined) {
      this.orderPlacement.unsubscribe();
    }
    if (this.ccypairsSubscription !== undefined) {
      this.ccypairsSubscription.unsubscribe();
    }
    if (this.tradingOnOffSubsciption !== undefined) {
      this.tradingOnOffSubsciption.unsubscribe();
    }
    if (this.porfolioSubscription !== undefined) {
      this.porfolioSubscription.unsubscribe();
    }
    if (this.accountBalanceSubscription !== undefined) {
      this.accountBalanceSubscription.unsubscribe();
    }
    // this.afs.ruoteToDealerres.next([]);
    if (this.routeDI_subscription !== undefined) {
      this.routeDI_subscription.unsubscribe();
    }

    //Added by Uddesh on 22 Feb, 2022
    this.ParentMsg = '';
  }

  //Added by Uddesh on Feb 22, 2022
  ngOnChanges() {
    if (this.ParentPair) {
      console.log('Input from Parent checking Uddesh');
      console.log(
        'msg',
        this.ParentMsg,
        'selectedCcyPair',
        this.ParentPair,
        'BLODirection',
        this.ParentDirection,
        'BLOrate',
        this.ParentRate
      );
      this.buyCcy = this.ParentPair.substring(0, 3);
      this.sellCcy = this.ParentPair.substring(6, 9);
      this.rate = this.ParentRate;
      this.orderType = 'Limit';
      this.selectAccount(this.buyCcy, 'Buy');
      this.selectAccount(this.sellCcy, 'Sell');
    }
  }

  ngOnInit() {
    let tod = new Date();
    this.minDate = new Date();
    if (this.minDate.getDay() > 0 && this.minDate.getDay() < 4) {
      this.minDate.setDate(tod.getDate() + 3);
    } else if (this.minDate.getDay() === 4) {
      this.minDate.setDate(tod.getDate() + 5);
    } else if (this.minDate.getDay() === 5) {
      this.minDate.setDate(tod.getDate() + 5);
    }
    if (this.authApi.UserType === 'CLIENT') {
      this.Customer = this.homeApi.CustomerName;
      this.customerID = this.homeApi.CustomerId;
    }
    this.clearMsg();
    this.billingAmt = '10,000.00';
    this.selectedHour = '17';
    this.selectedMin = '00';
    this.onOrderExpTypeChanged('GTT');
    this.tradingOption = 'on';

    if (this.ParentMsg != 'From FX-LIMIT-ORDER') {
      this.afs.getcurrencypairsdetails('ASSET1', '', 'ASSET1', 'FXCOEN');
    }

    // this.tradingOnOffSubsciption = this.commonfunction.tradingOnOffObserver.subscribe(
    //   value => {
    //     try {
    //       this.tradingOption = value;
    //       this.tradingmsg = '';
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   });
    this.ccypairsSubscription = this.afs.CcyPairsObserver.subscribe((res) => {
      if (res) {
        try {
          if (!this.AmendScreen) {
            if (res['index'] === 'ASSET1') {
              this.asset1list = res['body'];
              this.buyCcy = this.asset1list[0].Asset1;
              //  if ((this.billingAcc === '' || this.billingAcc === undefined) && (this.creditAcc === '' || this.creditAcc === undefined))
              //  this.selectAccount(this.buyCcy, 'Buy');
              // this.afs.getcurrencypairsdetails('ASSET2', this.buyCcy, 'ASSET2', 'FXCOEN');
            } else if (res['index'] === 'ASSET2') {
              this.asset2list = res['body'];
              if (this.sellCcy === '') {
                this.sellCcy = this.asset2list[0].Asset2;
              }

              // this.SelectCCY();
              // if ((this.billingAcc === '' || this.billingAcc === undefined) && (this.creditAcc === '' || this.creditAcc === undefined))
              this.selectAccount(this.sellCcy, 'Sell');
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    });
    this.subscription_fxspotbidask =
      this.afs.GetFxSpotBidAskRateObserver.subscribe((res: any) => {
        // console.log(res);
        try {
          this.clearMsg();
          if (res.Get_FxSpotBidAskRateResult !== undefined) {
            if (res.Get_FxSpotBidAskRateResult) {
              this.pricingLoader_market = false;
              if (res.Get_FxSpotBidAskRateResult[0].code === this.selectedCCY) {
                this.prices = res.Get_FxSpotBidAskRateResult[0];
                if (this.goodOrder && this.direction === 'Buy') {
                  this.rate = this.prices.pairaskrate.toFixed(this.precision);
                } else if (this.goodOrder && this.direction === 'Sell') {
                  this.rate = this.prices.pairbidrate.toFixed(this.precision);
                } else if (!this.goodOrder && this.direction === 'Buy') {
                  this.rate = this.prices.pairbidrate.toFixed(this.precision);
                } else {
                  this.rate = this.prices.pairaskrate.toFixed(this.precision);
                }
                // console.log(this.selectedCCY);
                // this.rate = this.formatKLMB_ES(this.rate, this.precision);
                this.rate = this.formatKLMB(this.rate, this.precision);
              }
            } else {
              // this.rate = this.formatKLMB_ES('0', this.precision);
              this.rate = this.formatKLMB('0', this.precision);
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      });
    this.subscription_currencypair = this.afs.GetCurrencyPairObserver.subscribe(
      (res) => {
        //console.log('ccy res', res);
        try {
          if (res.length && !this.AmendScreen) {
            this.ccyPairs = res;
            // this.selectedCCY = this.ccyPairs[0].PairCode;
            // this.selectedCCY = 'EUR - USD';
            // this.afs.Get_FxSpotBidAskRate(this.selectedCCY);
            if (!this.ccypairflagincreasedone) {
              this.selectCcyCount++;
              this.ccypairflagincreasedone = true;
              if (this.selectCcyCount === 2) {
                this.SelectCCY();
              }
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    );

    this.afs.getCurrencyPairs();

    // this.subscription_getaccountdetails = this.afs.GetAccountDetailsObserver.subscribe((res: any) => {
    //   // console.log(res);
    //   if (res) {
    //     try {
    //       this.ssiDetails = res;
    //       // console.log(this.ssiDetails);
    //       this.billingAcc = res[0].AccountNo;
    //       this.creditAcc = res[3].AccountNo;
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   }

    // });
    // this.afs.getAccountDetails('50', 'EUR', 'JPY', 'FXC');

    this.subscription_bookorder = this.afs.BookLimitOrderDataObserver.subscribe(
      (res: any) => {
        if (res) {
          try {
            // console.log(res);
            if (res.BookingSuccessful) {
              this.afs.updateDailyLimit(
                this.Customer,
                this.buyCcy,
                this.billingAmt.replace(/,/g, '')
              );
              this.orderBookedMessage =
                'Order submitted successfully with Order ID: ' + res.OrderId;
            } else {
              this.orderBookedMessage = '';
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    );
    this.subscription_amendorder = this.afs.AmendLimitOrderObserver.subscribe(
      (res: any) => {
        try {
          if (res.AmendFlag) {
            this.AmendScreen = true;
            this.AmendObj = res;
            this.orderType = 'Limit';
            this.selectedCCY = res.Ccy_Pair;
            this.direction = res.Direction;
            let arr = this.selectedCCY.split(' - ');
            if (this.direction === 'Buy') {
              this.buyCcy = arr[0];
              this.sellCcy = arr[1];
            } else if (this.direction === 'Sell') {
              this.sellCcy = arr[0];
              this.buyCcy = arr[1];
              // this.buyCcy = arr[0];
              // this.sellCcy = arr[1];
            }
            this.asset1list = [{ Asset1: this.buyCcy }];
            this.asset2list = [{ Asset2: this.sellCcy }];
            console.log(
              this.asset1list,
              this.asset2list,
              this.buyCcy,
              this.sellCcy
            );
            // this.SelectCCY(this.selectedCCY);

            //Start - selectCCY data
            let ccy = this.selectedCCY;
            let selectedCurrency = this.ccyPairs.filter(
              (c) => c.PairCode === ccy
            )[0];
            this.goodOrder = selectedCurrency.GoodOrder === 'Y';
            this.precision = selectedCurrency.DecimalRate || 2;
            this.afs.Get_FxSpotBidAskRate(ccy);
            if (this.direction === 'Buy') {
              this.AmountDecimal1 = selectedCurrency.AmountDecimal;
              this.AmountDecimal2 = selectedCurrency.SecondAmountDecimal;
            } else {
              this.AmountDecimal1 = selectedCurrency.SecondAmountDecimal;
              this.AmountDecimal2 = selectedCurrency.AmountDecimal;
            }
            //End - selectCCY data

            if (this.direction === 'Buy') {
              this.billingAmt = this.formatKLMB_new(res.BillingAmt, 'B');
              this.creditAmt = this.formatKLMB_new(res.CreditAmt, 'S');
            } else if (this.direction === 'Sell') {
              this.creditAmt = this.formatKLMB_new(res.BillingAmt, 'S');
              this.billingAmt = this.formatKLMB_new(res.CreditAmt, 'B');
              // this.billingAmt = this.formatKLMB_new(res.BillingAmt, 'B');
              // this.creditAmt = this.formatKLMB_new(res.CreditAmt, 'S');
            }
            this.rate = '';
            if (!this.ref['destroyed']) {
              this.ref.detectChanges();
            }
            this.targetRate = this.formatKLMB(res.Order_Rate, this.precision);

            this.orderExpType = res.OrderExpiryType;
            this.onOrderExpTypeChanged(this.orderExpType);

            this.ExpiryToDate = this.formatDateTimeHours(
              res.OrderExpiryDate
            ).split(' ')[0];
            this.selectedHour = this.formatDateTimeHours(res.OrderExpiryDate)
              .split(' ')[1]
              .split(':')[0];
            this.selectedMin = this.formatDateTimeHours(res.OrderExpiryDate)
              .split(' ')[1]
              .split(':')[1];
            // this.AmendObj.ExpiryTime = '\/Date(' + (this.getEPOCHDate(this.ExpiryToDate)) + ')\/';
            //console.log(res);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    );
    this.subscription_amendobeservar = this.afs.AmendOrderObserver.subscribe(
      (res: any) => {
        try {
          if (res.result && this.AmendScreen) {
            this.orderBookedMessage =
              'Order Amended sucessfully for Order ID: ' + res.OrderID;
            // this.AmendScreen = false;
            //console.log(res);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    );
    if (!this.ExpiryToDate && !this.AmendScreen) {
      const date = new Date();
      this.ExpiryToDate =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '-' +
        this.months[date.getMonth()] +
        '-' +
        date.getFullYear();
    }
    // this.customerListData = this.afs.CustomerListObservar.subscribe(data => {
    //   try {
    //     if (data.length !== 0) {

    //       for (let i = 0; i < data.length; i++) {
    //         this.customerList[i] = { "customer": data[i]['CustomerName'] };
    //         this.customerInfo[i] = data[i];

    //       }
    //       this.customerList = this.customerList.sortBy('customer');
    //       this.goPrice_mfk++;
    //       // this.Customer = this.customerList[0]['customer'];
    //       // this.customerID = this.customerList[0]['CustomerID'];
    //       // this.CustomerSegment = this.customerList[0]['AH_Customer_Segment']
    //       // if (this.commonfunction.configData.length > 0) {
    //       if (this.Customer === undefined) {
    //         this.setCustomer(this.commonfunction.configData['Customer_Name'], 0);
    //       } else {
    //         this.setCustomer(this.Customer, 0);
    //       }
    //       this.callQuoteService();
    //       // } else {
    //       //   this.setCustomer('CORPORATE SPECIAL CUSTOMER', 0);
    //       // }
    //       //console.log(this.customerList);
    //     }
    //   } catch (ex) { console.log(ex) }
    // });
    // this.account = this.afs.GetAccountDetailsObserver.subscribe(accinfo => {
    //   // if (accinfo !== '') {
    //   //   this.billingAcc = accinfo[0]['AccountNo'];
    //   //   this.creditAcc = accinfo[3]['AccountNo'];
    //   // }
    //   try {
    //     if (accinfo !== '') {
    //       this.accinfo = accinfo;
    //       this.setAccountDetailsofCust();
    //       if (this.orderType === 'Market') {

    //         this.goPrice_mfk++;
    //         this.callQuoteService();
    //       }
    //     }
    //   } catch (ex) { console.log(ex) }
    // });

    this.validateTradeSubscription =
      this.afs.validateTradeBlockObserver.subscribe((res) => {
        if (res) {
          try {
            if (res.length > 0) {
              this.errormsg = '';
              if (res[1] === this.validate_uniqueID) {
                let passfailres = res[0]['body']['checkTransactionLimitResult'];

                if (passfailres.length > 0) {
                  //Max transaction limit check
                  let resdata_max = passfailres[0]['TransactionLimit'];

                  //Daily transaction limit check
                  let resdata_daily = passfailres[0]['DailyLimit'];

                  if (resdata_max === 'Pass' && resdata_daily === 'Pass') {
                    if (this.orderType === 'Limit') {
                      this.bookOrder_Limit();
                    } else {
                      this.bookOrder_Market();
                    }
                    // this.afs.validateTradeBlock.next([]);
                  } else {
                    if (this.timerId !== undefined) {
                      clearTimeout(this.timerId);
                    }
                    this.tradeLoader = false;
                    if (resdata_max === 'Fail') {
                      this.errormsg =
                        'You are exceeding maximum transaction limit.';
                    } else if (resdata_daily === 'Fail') {
                      this.errormsg =
                        'You are exceeding daily transaction limit.';
                    }

                    // this.loader = false;
                    // this.afs.validateTradeBlock.next([]);
                  }
                } else {
                  if (this.orderType === 'Limit') {
                    this.bookOrder_Limit();
                  } else {
                    this.bookOrder_Market();
                  }
                  // this.afs.validateTradeBlock.next([]);
                }
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      });

    // this.commonfunction.configDataObs.subscribe(value => {
    //   if (value) {
    //     try {
    //       this.priceProvider = value['Counterparty'];
    //       if (this.priceProvider !== undefined) {
    //         if (!this.AmendScreen) {
    //           this.buyCcy = value['BuyCcy'];
    //           this.afs.getcurrencypairsdetails('ASSET2', this.buyCcy, 'ASSET2', 'FXCOEN');
    //           this.sellCcy = value['SellCcy'];
    //         }
    //         this.Customer = value['Customer_Name'];
    //         // console.log(this.priceProvider, this.buyCcy, this.sellCcy);
    //       }
    //     } catch (ex) { console.log(ex) }
    //   }
    // });

    this.datesSubscription =
      this.afs.GetFXDatesForSpotForwardSFObserver.subscribe((res) => {
        if (res) {
          // console.log(res);
          try {
            if (res['ID'] === 1300) {
              if (res['body']['Status'] === 'Succeed') {
                //  console.log(res);

                //console.log(' Dates : ', res);
                this.ValueDate_mkt =
                  res['body']['PairDates']['PairDateInfo'].FinIQValueDate;
                this.SpotDate_mkt =
                  res['body']['PairDates']['PairDateInfo'].FinIQSpotDate;
                this.FixingDate_mkt =
                  res['body']['PairDates']['PairDateInfo'].FinIQFixingDate;
                this.goPrice_mfk++;
                if (this.productType === 'Forward') {
                  let vdate = new Date(this.ValueDate_mkt);
                  this.valuedateday = vdate.getDate().toString();
                  this.valuedatemonth = vdate.getMonth() + 1 + '';
                  this.valuedateyear = vdate.getFullYear().toString();

                  if (this.valuedateday.length === 1) {
                    this.valuedateday = '0' + this.valuedateday;
                  }
                  if (this.valuedatemonth.length === 1) {
                    this.valuedatemonth = '0' + this.valuedatemonth;
                  }
                  if (this.valuedateyear.indexOf('-') >= 0) {
                    this.valuedateyear = this.valuedateyear.substr(1);
                  }
                }
                this.callQuoteService();
              } else {
                this.errormsg = res['body']['ResponseDetails']['Description'];
                this.pricingLoader_market = false;
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      });

    this.pricingSubscription =
      this.afs.FXOBestPriceTransactionObservar.subscribe((res) => {
        if (res.length !== 0) {
          try {
            this.exceptionFlag = false;
            if (res['body']['FinIQResponseHeader']['Status'] === 'Succeed') {
              if (res['ID'] === 1300) {
                if (res['UniqueKey'] === this.uniqueKey) {
                  if (!this.overrideExceptionRule) {
                    this.errormsg = '';
                  } else {
                    this.overrideExceptionRule = false;
                  }
                  console.log(res);

                  this.priceQuoteRefSell =
                    res['body']['PriceEnquiryResponse']['PriceQuoteRef'];
                  let QuoteDetails =
                    res['body']['PriceEnquiryResponse'][
                      'ExternalPriceResponse'
                    ]['PriceProviderResponse'];

                  // this.rate = (QuoteDetails[0]['NearForwardRate']).toFixed(this.precision);
                  this.bankRate = QuoteDetails[0]['NearForwardRate'].toFixed(
                    this.precision
                  );
                  this.spotrate = QuoteDetails[0]['NearSpotRate'].toFixed(4);
                  // this.forwardPoint = (QuoteDetails[0]['NearSwapPoint']).toFixed(4);
                  this.swapPointsSell = QuoteDetails[0]['NearSwapPoint'];
                  this.QuoteIDSell = QuoteDetails[0]['QuoteId'];
                  this.ExternalQuoteIDSell = QuoteDetails[0]['ExternalQuoteID'];
                  this.PPSell = QuoteDetails[0]['PriceProviderId'];
                  // this.amountCalculation('Target');
                  // if (this.direction === 'Buy') {
                  //   this.altnotional = (parseFloat(this.notional.replace(/,/g, '')) * parseFloat(this.fxRate)).toFixed(2);
                  // } else {
                  //   this.altnotional = (parseFloat(this.notional.replace(/,/g, '')) / parseFloat(this.fxRate)).toFixed(2);
                  // }
                  if (this.direction === 'Buy') {
                    this.afs.getSpread(
                      this.buyCcy + '-' + this.sellCcy,
                      this.CustomerSegment,
                      0
                    );
                  } else {
                    this.afs.getSpread(
                      this.sellCcy + '-' + this.buyCcy,
                      this.CustomerSegment,
                      0
                    );
                  }
                  if (this.direction === 'Sell') {
                    if (this.sellCcy !== 'USD') {
                      let res_stdrev1 = this.afs.GetCcyPairPointShiftDetails1(
                        this.sellCcy + ' - ' + 'USD',
                        'FXC',
                        'FXCAPI'
                      );
                      if (res_stdrev1['body'][0]['AssetOrder'] === 'Standard') {
                        this.midRatePair = this.sellCcy + ' - ' + 'USD';
                      } else if (
                        res_stdrev1['body'][0]['AssetOrder'] === 'Reverse'
                      ) {
                        this.midRatePair = 'USD' + ' - ' + this.sellCcy;
                      }

                      this.afs.GetPairMidRate(
                        this.midRatePair,
                        this.tenor,
                        'FXC',
                        this.authApi.UserName
                      );
                    }
                  } else {
                    if (this.buyCcy !== 'USD') {
                      let res_stdrev1 = this.afs.GetCcyPairPointShiftDetails1(
                        this.buyCcy + ' - ' + 'USD',
                        'FXC',
                        'FXCAPI'
                      );
                      if (res_stdrev1['body'][0]['AssetOrder'] === 'Standard') {
                        this.midRatePair = this.buyCcy + ' - ' + 'USD';
                      } else if (
                        res_stdrev1['body'][0]['AssetOrder'] === 'Reverse'
                      ) {
                        this.midRatePair = 'USD' + ' - ' + this.buyCcy;
                      }

                      this.afs.GetPairMidRate(
                        this.midRatePair,
                        this.tenor,
                        'FXC',
                        this.authApi.UserName
                      );
                    }
                  }
                }
              }
              this.pricingLoader_market = false;
            } else if (
              res['body']['FinIQResponseHeader']['Status'] === 'Failed'
            ) {
              if (res['ID'] === 1300) {
                if (res['UniqueKey'] === this.uniqueKey) {
                  if (this.againprice < 2) {
                    let msg =
                      res['body']['PriceEnquiryResponse']['ResponseDetails'][
                        'Description'
                      ];
                    if (!msg.includes('No prices')) {
                      console.log(msg);
                      this.errormsg = 'No prices received, please try again';
                      this.againprice = 0;
                      this.pricingLoader_market = false;
                    } else {
                      // this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder('FXC',
                      //   this.buyCcy + " - " + this.sellCcy,
                      //   'Buy',
                      //   0,
                      //   this.creditAmt.replace(/,/g, ''),
                      //   0,
                      //   'TOD',
                      //   false,
                      //   'fx',
                      //   this.ValueDate_mkt,
                      //   this.FixingDate_mkt,
                      //   this.SessionID,
                      //   1300, //index like 999
                      //   1,
                      //   'Sell',
                      //   this.SessionID, //unique key
                      //   this.CustomerCIF,
                      //   this.Customer,
                      //   this.CustomerSegment,
                      //   this.RMName,
                      //   this.CustPAN,
                      //   this.DealerID,
                      //   this.priceProvider,
                      //   this.billingAcc,
                      //   this.creditAcc,
                      //   "");
                      let ccy1Amount, ccy2Amount;
                      if (
                        this.datainputvalue === 'Buy' ||
                        this.datainputvalue === undefined ||
                        this.datainputvalue === 'Target'
                      ) {
                        // if (this.dataInput === 'AMOUNT1') {
                        ccy1Amount = parseFloat(
                          this.billingAmt.replace(/,/g, '')
                        ); //invAmt
                        ccy2Amount = 0;
                      } else {
                        ccy1Amount = 0;
                        ccy2Amount = parseFloat(
                          this.creditAmt.replace(/,/g, '')
                        ); //altAmt
                      }
                      // if (this.direction === 'Sell') {

                      //   this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
                      //     this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName, this.CustPAN, this.DealerID,
                      //      this.priceProvider, this.billingAcc, this.creditAcc);

                      // } else {

                      //   this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
                      //     this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName, this.CustPAN, this.DealerID, this.priceProvider, this.billingAcc, this.creditAcc);
                      // }
                      if (this.direction === 'Sell') {
                        // this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
                        //   this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName,
                        //   this.CustPAN, this.DealerID, this.priceProvider, this.billingAcc, this.creditAcc, "", this.overrideExceptionRule, this.authApi.UserName, this.authApi.EntityID);
                        this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                          this.productType === 'FXSpot' ? 'FXC' : 'FXW',
                          this.buyCcy + ' - ' + this.sellCcy,
                          'Buy',
                          ccy1Amount,
                          ccy2Amount,
                          0.5,
                          this.tenor,
                          false,
                          'fx',
                          this.ValueDate_mkt,
                          this.FixingDate_mkt,
                          this.SessionID,
                          1300,
                          1,
                          this.direction,
                          this.uniqueKey,
                          this.homeApi.CIF,
                          this.Customer,
                          'BB',
                          this.homeApi.RMName,
                          this.homeApi.CustomerId,
                          this.homeApi.CustomerId,
                          this.billingAcc,
                          this.creditAcc,
                          this.priceProvider
                        );
                      } else {
                        //   this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
                        //     this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName,
                        //     this.CustPAN, this.DealerID, this.priceProvider, this.billingAcc, this.creditAcc, "", this.overrideExceptionRule, this.authApi.UserName, this.authApi.EntityID);
                        this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                          this.productType === 'FXSpot' ? 'FXC' : 'FXW',
                          this.buyCcy + ' - ' + this.sellCcy,
                          'Buy',
                          ccy1Amount,
                          ccy2Amount,
                          0.5,
                          this.tenor,
                          false,
                          'fx',
                          this.ValueDate_mkt,
                          this.FixingDate_mkt,
                          this.SessionID,
                          1300,
                          1,
                          this.direction,
                          this.uniqueKey,
                          this.homeApi.CIF,
                          this.Customer,
                          'BB',
                          this.homeApi.RMName,
                          this.homeApi.CustomerId,
                          this.homeApi.CustomerId,
                          this.billingAcc,
                          this.creditAcc,
                          this.priceProvider
                        );
                      }
                      this.againprice++;
                    }
                  } else {
                    let msg =
                      res['body']['PriceEnquiryResponse']['ResponseDetails'][
                        'Description'
                      ];
                    console.log(msg);
                    this.errormsg = 'No prices received, please try again';
                    this.againprice = 0;
                    this.pricingLoader_market = false;
                  }
                }
              }
            } else if (
              res['body']['FinIQResponseHeader']['Status'] === 'EXCEPTION'
            ) {
              let ruleData =
                res['body']['PriceEnquiryResponse']['ExcpetionRule'];
              if (ruleData['ExceptionType'] === 'EXCEPTION') {
                let dealerIntervention =
                  ruleData['IsDealerInterventionAllowed'];
                if (dealerIntervention) {
                  this.priceQuoteRefSell =
                    res['body']['PriceEnquiryResponse']['PriceQuoteRef'];
                  this.errormsg = ruleData['ReturnMessageReason'];
                  this.routetodealerpopup = true;
                  (<HTMLInputElement>(
                    document.getElementById('overlay')
                  )).style.display = 'block';
                  // this.routeToDealer();
                  this.pricingLoader_market = false;
                  this.exceptionFlag = true;
                } else {
                  //Error Exception- block the trade
                  this.exceptionFlag = true;
                  this.clearData();
                  this.errormsg =
                    'Business Exception: ' +
                    res['body']['PriceEnquiryResponse']['ResponseDetails'][
                      'Code'
                    ] +
                    ', ' +
                    ruleData['ReturnMessageReason'];
                  this.pricingLoader_market = false;
                }
              }
            } else if (
              res['body']['FinIQResponseHeader']['Status'] === 'WARNING'
            ) {
              let ruleData =
                res['body']['PriceEnquiryResponse']['ExcpetionRule'];
              let dealerIntervention = ruleData['IsDealerInterventionAllowed'];
              if (dealerIntervention) {
                this.priceQuoteRefSell =
                  res['body']['PriceEnquiryResponse']['PriceQuoteRef'];
                this.errormsg = ruleData['ReturnMessageReason'];
                this.routetodealerpopup = true;
                (<HTMLInputElement>(
                  document.getElementById('overlay')
                )).style.display = 'block';
                this.pricingLoader_market = false;
                // this.routeToDealer();
                this.exceptionFlag = true;
              } else {
                this.stpFlag = false;
                this.overrideExceptionRule = true;
                this.callQuoteService();
                // this.errormsg = "Exception occured: This will go for Branch Verification."
                this.errormsg =
                  'Exception occured: ' + ruleData['ReturnMessageReason'];
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      });

    this.eventNameSubscription = this.afs.eventNameObserver.subscribe((res) => {
      if (res) {
        try {
          let body = res['body']['getEventNameResult'];
          if (body !== undefined) {
            if (body.length > 0) {
              this.eventName = body[0]['Timegroup'];
              //console.log('Event Name : ' + this.eventName);
              if (this.eventName === '') {
                this.eventName = 'All Time';
              }
            } else {
              this.eventName = 'All Time';
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    });

    // this.spreadSubscription = this.afs.GetSpreadDetailsObserver.subscribe((resp: any) => {
    //   if (resp.length > 0) {

    //     try {
    //       if (resp[0]) {
    //         const res = resp[1].GetBankSpreadTableResult;
    //         let spread: any = [{
    //           Bid: Number(0).toFixed(this.precision),
    //           Ask: Number(0).toFixed(this.precision)
    //         }];
    //         if (res.length !== 0) {

    //           if (this.direction === "Sell") {
    //             res.forEach(s => {
    //               if (s.ccy === this.buyCcy) {
    //                 if (parseFloat(this.billingAmt.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.billingAmt.replace(/,/g, '')) >= s.Notional_min) {
    //                   spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   return;
    //                 }
    //               } else if (s.ccy === this.sellCcy) {
    //                 if (parseFloat(this.creditAmt.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.creditAmt.replace(/,/g, '')) >= s.Notional_min) {
    //                   spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   return;
    //                 }
    //               } else {

    //                 let spreadccyrate = this.afs.GetPairMidRate_sync(this.buyCcy + ' - ' + s.ccy, this.tenor, 'FXC', this.authApi.UserName);
    //                 let spreadCcyNotional = parseFloat(this.billingAmt.replace(/,/g, '')) / parseFloat(spreadccyrate[0]['body']['MidRate']);
    //                 console.log('Spread ccy is ', s.ccy, ' and inc ccy is ' + this.billingAmt);
    //                 console.log('Mid rate of', this.buyCcy + ' - ' + s.ccy, ' is ' + spreadccyrate[0]['body']['MidRate']);
    //                 console.log('Spread ccy notional :' + spreadCcyNotional);
    //                 if (spreadCcyNotional <= s.Notional_max && spreadCcyNotional >= s.Notional_min) {
    //                   spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   return;
    //                 }
    //               }
    //             });
    //           } else if (this.direction === "Buy") {
    //             res.forEach(s => {
    //               if (s.ccy === this.sellCcy) {
    //                 if (parseFloat(this.creditAmt.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.creditAmt.replace(/,/g, '')) >= s.Notional_min) {
    //                   spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   return;
    //                 }
    //               } else {
    //                 if (parseFloat(this.billingAmt.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.billingAmt.replace(/,/g, '')) >= s.Notional_min) {
    //                   spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointShift)).toFixed(this.precision);
    //                   return;
    //                 }
    //               }
    //             });
    //           }

    //         } else {
    //           this.RMspread = 0;
    //           this.custrate = Number(this.bankRate).toFixed(this.precision);
    //           this.rate = this.custrate;
    //         }
    //         if (spread.length !== 0) {
    //           this.RMspread = spread[0]["Bid"];
    //           if (this.direction === 'Buy') {
    //             this.custrate = (Number(this.bankRate) + Number(this.RMspread)).toFixed(this.precision);

    //             // this.custRevenueSell = parseFloat(this.billingAmt.replace(/,/g, '')) * this.RMspread;
    //           } else {
    //             this.custrate = (Number(this.bankRate) - Number(this.RMspread)).toFixed(this.precision);
    //             // this.custRevenueSell = parseFloat(this.billingAmt.replace(/,/g, '')) * this.RMspread;
    //           }
    //           if (parseFloat(this.RMspread) > 0) {
    //             this.custRevenueSell = parseFloat(this.billingAmt.replace(/,/g, '')) * this.RMspread;
    //           } else {
    //             this.custRevenueSell = parseFloat(this.billingAmt.replace(/,/g, ''));
    //           }
    //           this.rate = this.custrate;

    //         }

    //       } else {
    //         console.log('Spread service failed');
    //         this.RMspread = 0;
    //         this.custrate = Number(this.bankRate).toFixed(this.precision);
    //         this.rate = this.custrate;
    //         this.custRevenueSell = parseFloat(this.billingAmt.replace(/,/g, ''));
    //       }
    //       this.setTimer();
    //       // this.loaderTimer = false;
    //       if (this.midRate !== undefined) {
    //         this.calculateIndicativeRevenue();
    //       }
    //       this.calculateNotional1();
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   } else {
    //     this.RMspread = 0;
    //   }
    // });
    this.afs.PairMidRateObserver.subscribe((res) => {
      try {
        if (res.length > 0) {
          this.midRate = res[0]['body']['MidRate'];
          if (this.indicativeRevenue === undefined) {
            this.calculateIndicativeRevenue();
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    });
    this.settlementLimitObserver = this.afs.getSettleLimitObserver.subscribe(
      (res) => {
        try {
          if (res.length > 0) {
            if (res[0]) {
              if (res[0]['data'][0]['status'] === 'Y') {
                if (res[0]['transactionID'] === '') {
                  if (this.direction === 'Sell') {
                    this.afs.getCreditChecked(
                      this.CustPAN,
                      parseInt(this.billingAmt.replace(/,/g, '')),
                      this.buyCcy
                    );
                  } else {
                    this.afs.getCreditChecked(
                      this.CustPAN,
                      parseInt(this.creditAmt.replace(/,/g, '')),
                      this.sellCcy
                    );
                  }
                }
                // this.apifunction.CheckTransactionLimit(parseFloat(this.invAmt1.replace(/,/g, '')), this.invCCY1, this.Customer);
              } else {
                this.errormsg = 'Settlement limit exceeded for counterparty.';
                this.tradeLoader = false;
              }
              // if (this.timerId !== undefined) {
              //   clearTimeout(this.timerId);
              // }
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    );
    this.creditcheckSubscription = this.afs.checkCreditObserver.subscribe(
      (res) => {
        if (res.length > 0) {
          try {
            if (res[0]) {
              this.validate_uniqueID = this.GenerateSessionID();
              if (res[0]['body'].toString().toLowerCase() === 'n') {
                if (this.direction === 'Sell') {
                  this.afs.CheckTransactionLimit(
                    parseFloat(this.billingAmt.replace(/,/g, '')),
                    this.buyCcy,
                    this.Customer,
                    this.validate_uniqueID
                  );
                } else {
                  this.afs.CheckTransactionLimit(
                    parseFloat(this.creditAmt.replace(/,/g, '')),
                    this.sellCcy,
                    this.Customer,
                    this.validate_uniqueID
                  );
                }
              } else {
                //For Y- It is shortfall
                if (res[0]['body'].toString().includes('xml')) {
                  console.log('Customer credit check failed');
                  if (this.direction === 'Sell') {
                    this.afs.CheckTransactionLimit(
                      parseFloat(this.billingAmt.replace(/,/g, '')),
                      this.buyCcy,
                      this.Customer,
                      this.validate_uniqueID
                    );
                  } else {
                    this.afs.CheckTransactionLimit(
                      parseFloat(this.creditAmt.replace(/,/g, '')),
                      this.sellCcy,
                      this.Customer,
                      this.validate_uniqueID
                    );
                  }
                } else {
                  this.errormsg = 'Customer credit check failed';
                  this.tradeLoader = false;
                }
                if (this.timerId !== undefined) {
                  clearTimeout(this.timerId);
                }
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    );
    this.orderPlacement = this.afs.GetFXBookDealObserver.subscribe((deal) => {
      // console.log(deal);
      // if (this.TransactionShow === false) {
      try {
        if (deal.length > 0) {
          if (deal[1] === this.uniqueKey) {
            this.stpFlag = true;
            if (deal[0]['FinIQResponseHeader'].Status === 'Succeed') {
              if (
                deal[0]['TradeBookingResponse']['TradeReferenceID'] !== null
              ) {
                // console.log('update limits - ', this.invCCY1, this.invAmt1.replace(/,/g, ''));
                if (this.direction === 'Buy') {
                  this.afs.updateDailyLimit(
                    this.Customer,
                    this.buyCcy,
                    this.billingAmt.replace(/,/g, '')
                  );
                } else {
                  this.afs.updateDailyLimit(
                    this.Customer,
                    this.sellCcy,
                    this.creditAmt.replace(/,/g, '')
                  );
                }
                this.afs.updateAccountBalance(
                  this.CustPAN + '',
                  this.creditAcc,
                  this.billingAcc,
                  this.creditAmt.replace(/,/g, ''),
                  this.billingAmt.replace(/,/g, ''),
                  this.sellCcy,
                  this.buyCcy,
                  this.tenor
                );
                let transactionId =
                  deal[0]['TradeBookingResponse']['TradeReferenceID'];
                // let direction = this.buysell === 'YOU SELL' ? 'Sell' : 'Buy';
                this.afs.getSettlementLimit(
                  this.direction,
                  this.buyCcy,
                  parseFloat(this.billingAmt.replace(/,/g, '')),
                  4,
                  this.buyCcy + ' - ' + this.sellCcy,
                  this.ValueDate_mkt,
                  transactionId,
                  'Y',
                  this.authApi.UserName,
                  this.authApi.EntityID
                );

                if (!this.stpFlag) {
                  this.errormsg +=
                    ' Deal ID ' + transactionId + ' executed successfully.';
                } else {
                  this.errormsg =
                    'Deal ID ' + transactionId + ' executed successfully.';
                }

                // this.transactionDateTime = deal['TradeBookingResponse']['BookingDateTime'];
                this.tradeLoader = false;

                this.afs.GetDailyTransactionLimitDetails.next([]);
                // this.show === 1;
              }
            } else if (deal[0]['FinIQResponseHeader'].Status === 'Failed') {
              try {
                console.log(
                  deal[0]['TradeBookingResponse']['ResponseDetails'][
                    'Description'
                  ]
                );
              } catch (inex) {}
              this.errormsg = 'Failed to book a deal. Please try again later.';
              this.tradeLoader = false;
            }
          }
        }
        // }
      } catch (ex) {
        console.log(ex);
      }
    });
    this.commonDataSubscription = this.cusApi
      .getCommonDataEFX('UDF_Purpose')
      .subscribe((res) => {
        console.log(res);
        try {
          if (res.Get_Configurable_Common_DataResult.length !== 0) {
            this.purposeCodeList = res.Get_Configurable_Common_DataResult;
          }
        } catch (ex) {
          console.log(ex);
        }
      });
    // this.porfolioSubscription = this.afs.getPortfolioDataObserver.subscribe(res => {
    //   if (res.length > 0) {
    //     try {
    //       if (res[0]) {
    //         this.PortfolioList = res[0]['PortfolioSearchResponse']['items'];
    //         let list = [];
    //         this.PortfolioList.map(d => {
    //           list.push({ 'Portfolio': d['Portfolio'] });
    //         });
    //         this.PortfolioList = list;
    //         this.PortfolioList = this.PortfolioList.sortBy('Portfolio');
    //         this.PortfolioList = this.removeDuplicate(this.PortfolioList);
    //         if (this.PortfolioList === null) {
    //           // this.validationMsg = "There is no portfolio for selected customer."
    //           this.accountBalanceData = [];

    //         } else {
    //           this.PortfolioList.map(record => {
    //             this.afs.getAccountBalance(this.CustPAN, record.Portfolio);
    //           });

    //         }
    //       }
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   }
    // });
    // this.accountBalanceSubscription = this.afs.getAccountBalanceDataObserver.subscribe(res => {
    //   if (res.length > 0) {
    //     try {
    //       if (res[0]) {

    //         let Data = res[0]['ListCTPDashboardCashResponse']['items'];

    //         if (Data !== null) {
    //           Data.map(record => {
    //             this.accountBalanceData.push(record);
    //           });
    //           this.getCashBalanceInSellCcy();
    //         }
    //         // console.log(this.accountBalanceData);
    //       }
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   }
    // });

    // this.routeDI_subscription = this.afs.ruoteToDealerresObs.subscribe(res => {
    //   if (res.length > 0) {
    //     try {
    //       if (res[0]) {
    //         if (res[0][0]['FinIQResponseHeader']['Status'] === 'Succeed') {
    //           this.errormsg = 'RFQID:' + this.priceQuoteRefSell + ' Routed to dealer Successfully';
    //           this.pricingLoader_market = false;
    //         } else {
    //           this.errormsg = 'Failed to route to Dealer.';
    //           console.log(res[0][0]['PriceEnquiryResponse']['ResponseDetails']['Code'], res[0][0]['PriceEnquiryResponse']['ResponseDetails']['Description']);
    //           this.pricingLoader_market = false;
    //         }
    //       }
    //     } catch (ex) { console.log(ex); }
    //   }
    // });
  }
  blockTradeValidate() {
    try {
      // window.open("https://www.google.com", "_blank");
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      if (this.orderType === 'Limit') {
        this.validate_uniqueID = this.GenerateSessionID();
        this.afs.CheckTransactionLimit(
          parseFloat(this.billingAmt.replace(/,/g, '')),
          this.buyCcy,
          this.Customer,
          this.validate_uniqueID
        );
      } else {
        if (!this.exceptionFlag) {
          if (
            this.productType === 'FXSpot'
              ? this.checkCashBalanceAvailability()
              : true
          ) {
            this.afs.getSettlementLimit(
              this.direction,
              this.buyCcy,
              parseFloat(this.billingAmt.replace(/,/g, '')),
              4,
              this.buyCcy + ' - ' + this.sellCcy,
              this.ValueDate_mkt,
              '',
              'N',
              this.authApi.UserName,
              this.authApi.EntityID
            );
            this.tradeLoader = true;
          }
        }
      }
      //console.log('Limit check', this.invAmt1.replace(/,/g, ''), this.invCCY1, this.customerID);
    } catch (ex) {
      console.log(ex);
    }
  }
  bookOrder_Limit() {
    try {
      if (this.tradingOption === 'on') {
        // this.creditAmt = this.unformatNumber_EN(this.billingAmt) * this.unformatNumber_EN(this.targetRate);
        this.clearMsg();
        const rate = this.unformatNumber_EN(this.rate).toString();
        const targetRate = this.unformatNumber_EN(this.targetRate).toString();
        const billingAmt = this.unformatNumber_EN(this.billingAmt).toString();
        const creditAmt = this.unformatNumber_EN(this.creditAmt).toString();
        let timezone = 'Singapore Standard Time';
        let expiryDate = '';
        let ValidTime = true;
        let time = '';
        const valueDate = '/Date(' + this.getValueDate() + ')/';
        const today = new Date();
        // let hours;
        // let minutes;
        // let meridian;
        let todayValidTime: Date;
        let currentExpiryDate: Date;
        const hour = parseInt(this.selectedHour, 10);
        const min = parseInt(this.selectedMin, 10);
        let m, i;
        switch (this.orderExpType) {
          case 'EOD':
            // const expDay = new Date(this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], '23:59'));
            // if ((new Date()).getHours() < 0 && (new Date()).getDate() <= expDay.getDate()) {
            expiryDate =
              '/Date(' +
              this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], '23:59') +
              ')/';
            // } else {
            //   validEODTime = false;
            //   this.orderBookedMessage = 'EOD deals cannot be booked after 11:59 PM';
            // }
            break;
          case 'GTC':
            expiryDate = '';
            timezone = '';
            break;
          case 'GTD':
            for (i = 0; i < this.months.length; i++) {
              if (this.ExpiryToDate.split('-')[1] === this.months[i]) {
                m = i;
                break;
              }
            }
            time = hour + ':' + min;
            todayValidTime = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              today.getHours(),
              today.getMinutes()
            );
            // currentExpiryDate = new Date(this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], time));
            // console.log(todayValidTime, 'Expiry' + currentExpiryDate, todayValidTime.getTime() < currentExpiryDate.getTime());
            currentExpiryDate = new Date(
              parseInt(this.ExpiryToDate.split('-')[2]),
              m,
              parseInt(this.ExpiryToDate.split('-')[0]),
              hour,
              min
            );
            if (todayValidTime < currentExpiryDate) {
              expiryDate =
                '/Date(' +
                this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], time) +
                ')/';
            } else {
              ValidTime = false;
              this.errormsg =
                'For GTD Order Expiry Date and Time should be greater than current Date and Time.';
            }
            break;
          case 'GTT':
            if (this.ExpiryToDate.includes(' ')) {
              time = this.ExpiryToDate.split(' ')[0];
              if (time.split(' ')[1].split(' ')[1] === 'PM') {
                time = parseInt(time.split(':')[0], 10) + 12 + '';
                time = time + time.split(':')[1];
              }
            } else {
              // hours = (hour > 12 ?
              //   ((hour - 12) < 10 ?
              //     '0' + (hour - 12) :
              //     (hour - 12)) :
              //   (hour < 10 ?
              //     '0' + hour :
              //     hour)).toString();
              // minutes = (min < 10 ?
              //   '0' + min :
              //   min).toString();
              // meridian = hour >= 12 ? 'PM' : 'AM';
              time = hour + ':' + min;
            }

            for (i = 0; i < this.months.length; i++) {
              if (this.ExpiryToDate.split('-')[1] === this.months[i]) {
                m = i;
                break;
              }
            }
            todayValidTime = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              today.getHours(),
              today.getMinutes()
            );
            // currentExpiryDate = new Date(this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], time));
            // console.log(todayValidTime, currentExpiryDate, todayValidTime < currentExpiryDate);
            currentExpiryDate = new Date(
              parseInt(this.ExpiryToDate.split('-')[2]),
              m,
              parseInt(this.ExpiryToDate.split('-')[0]),
              hour,
              min
            );
            // console.log(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());

            // console.log(parseInt(this.ExpiryToDate.split('-')[2]),m, parseInt(this.ExpiryToDate.split('-')[0]), hour, min);
            if (todayValidTime < currentExpiryDate) {
              //console.log(this.ExpiryToDate, time);
              expiryDate =
                '/Date(' +
                this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], time) +
                ')/';
              //console.log(expiryDate);
            } else {
              ValidTime = false;
              this.errormsg =
                'For GTT Order Expiry Time should be greater than current Time.';
            }
            break;
          case 'GTF':
            expiryDate =
              '/Date(' +
              this.getEPOCHDate(this.ExpiryToDate.split(' ')[0], '23:59') +
              ')/';
        }

        // if(this.datainputvalue ==='Buy'){
        //   this.direction = 'Buy';
        // }else{
        //   this.direction = 'Sell';
        // }
        if (
          this.validateDate() &&
          this.validateRate() &&
          this.checkEmptyNotional(billingAmt) &&
          ValidTime
        ) {
          //console.log(this.orderExpType, this.selectedCCY, rate, targetRate, this.direction, this.billingAcc, this.creditAcc, 'blank', billingAmt, creditAmt, expiryDate, valueDate, 'via api', timezone);
          let ccy1 = billingAmt;
          let ccy2 = creditAmt;
          if (this.direction === 'Sell') {
            let temp = ccy1;
            ccy1 = ccy2;
            ccy2 = temp;
          }
          // this.afs.bookLimitOrder(this.orderExpType, this.selectedCCY, rate, targetRate, this.direction, this.billingAcc, this.creditAcc, 'blank', billingAmt, creditAmt, expiryDate, valueDate, 'via api', timezone);
          this.afs.bookLimitOrder(
            this.orderExpType,
            this.selectedCCY,
            rate,
            targetRate,
            this.direction,
            this.billingAcc,
            this.creditAcc,
            'blank',
            ccy1,
            ccy2,
            expiryDate,
            valueDate,
            'via api',
            timezone,
            // this.CustPAN,
            this.homeApi.CustomerId,
            // this.RMID,
            this.homeApi.RMID,
            // this.RMName,
            this.homeApi.RMName,
            // this.CustomerCIF,
            this.homeApi.CIF,
            // this.CustomerSegment,
            'Gold',
            40416,
            this.templateSerialNo,
            this.authApi.UserName,
            this.authApi.EntityID
          );
        } else {
        }
      } else {
        this.tradingmsg =
          'Trading is off so you will not able to price or book order.';
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  getValueDate() {
    try {
      const value = this.ExpiryToDate;
      //console.log(parseInt(value.split('-')[2], 10), this.months.indexOf(value.split('-')[1]), parseInt(value.split('-')[0], 10));
      const date = new Date(
        parseInt(value.split('-')[2], 10),
        this.months.indexOf(value.split('-')[1]),
        parseInt(value.split('-')[0], 10),
        17,
        0,
        0,
        0
      );
      date.setDate(date.getDate() + 2);
      return this.getEPOCHDate(
        date.getDate() +
          '-' +
          this.months[date.getMonth()] +
          '-' +
          date.getFullYear()
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  getEPOCHDate(dateValue: string, timeValue?: string) {
    try {
      let date: Date;
      //console.log(dateValue, timeValue);
      if (timeValue) {
        date = new Date(
          // parseInt(dateValue.split('-')[2], 10), this.months.indexOf(dateValue.split('-')[1]), parseInt(dateValue.split('-')[0], 10),
          // timeValue ? parseInt(timeValue.split(':')[0], 10) < 12 ? parseInt(timeValue.split(':')[0], 10) + 12 : parseInt(timeValue.split(':')[0], 10) || 0 : 0, timeValue ? parseInt(timeValue.split(':')[1], 10) || 0 : 0);
          parseInt(dateValue.split('-')[2], 10),
          this.months.indexOf(dateValue.split('-')[1]),
          parseInt(dateValue.split('-')[0], 10),
          parseInt(timeValue.split(':')[0], 10),
          parseInt(timeValue.split(':')[1], 10)
        );
      } else {
        date = new Date(
          parseInt(dateValue.split('-')[2], 10),
          this.months.indexOf(dateValue.split('-')[1]),
          parseInt(dateValue.split('-')[0], 10)
        );
      }
      //console.log((date).getTime(), (((date).getTime()).toString()), ((date).getTime()) / 1000, (((((date).getTime()) / 1000) + 19800 + 19800) * 1000));
      // return (date).getTime();
      const etime = (date.getTime() / 1000 + 19800) * 1000;
      //console.log(etime);
      return etime;
    } catch (ex) {
      console.log(ex);
    }
  }

  getDate(event: MatDatepickerInputEvent<Date>, fromToFlag) {
    try {
      // this.events.push(`${type}: ${event.value}`);
      const selecteddate = event.value;

      const date =
        selecteddate.getMonth() +
        1 +
        '-' +
        selecteddate.getDate() +
        '-' +
        selecteddate.getFullYear();
      // console.log(date);

      if (fromToFlag === 'From') {
        this.fromDate = date;
      } else {
        this.toDate = date;
      }
      // console.log(this.toDate);
      this.afs.getWorkflowBlotterData(
        'Trade',
        2067,
        this.fromDate,
        this.toDate
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  SelectCCY() {
    try {
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      if (this.sellCcy !== undefined && this.sellCcy !== '') {
        let ccy = this.buyCcy + ' - ' + this.sellCcy;
        // this.selectedCCY = ccy;
        if (this.ccyPairs !== undefined) {
          const selectedCurrency = this.ccyPairs.filter(
            (c) => c.PairCode === ccy
          )[0];
          this.goodOrder = selectedCurrency.GoodOrder === 'Y';
          // console.log(this.ccyPairs, ccy, selectedCurrency, this.goodOrder);
          // this.precision = selectedCurrency.DecimalRate || 2;

          this.precision = selectedCurrency.DecimalRate || 2;
          this.pointShift =
            selectedCurrency.PointShift || selectedCurrency.DecimalRate;
          if (this.goodOrder) {
            if (this.orderType === 'Market') {
              this.goPrice_mfk++;
              this.CallRates();
              this.sec = 0;
            } else {
              this.targetRate = Number(0).toFixed(this.precision);
              if (
                this.datainputvalue === 'Buy' ||
                this.datainputvalue === 'Target'
              ) {
                this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
              } else if (this.datainputvalue === 'Sell') {
                this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
              }
              this.afs.Get_FxSpotBidAskRate(ccy);
            }
            // this.notionalCcy = selectedCurrency.PairCode.split('-')[0];
            this.AmountDecimal1 = selectedCurrency.AmountDecimal;
            this.AmountDecimal2 = selectedCurrency.SecondAmountDecimal;
            this.direction = 'Buy';
            this.selectedCCY = this.buyCcy + ' - ' + this.sellCcy;
          } else {
            const currency =
              selectedCurrency.PairCode.replace(/\s/g, '').split('-')[1] +
              ' - ' +
              selectedCurrency.PairCode.replace(/\s/g, '').split('-')[0];
            if (this.orderType === 'Market') {
              this.goPrice_mfk++;
              this.CallRates();
              this.sec = 0;
            } else {
              this.targetRate = Number(0).toFixed(this.precision);
              if (
                this.datainputvalue === 'Buy' ||
                this.datainputvalue === 'Target'
              ) {
                this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
              } else if (this.datainputvalue === 'Sell') {
                this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
              }
              this.afs.Get_FxSpotBidAskRate(currency);
            }
            // this.notionalCcy = selectedCurrency.PairCode.split('-')[1];
            this.AmountDecimal1 = selectedCurrency.AmountDecimal;
            this.AmountDecimal2 = selectedCurrency.SecondAmountDecimal;
            this.direction = 'Sell';
            this.selectedCCY = this.sellCcy + ' - ' + this.buyCcy;
          }
          if (this.orderType === 'Limit') {
            this.amountCalculation('Target');
          }
          // this.targetRate = this.formatKLMB_ES(this.targetRate || '0', this.precision);
          // this.billingAmt = this.formatKLMB_ES(this.billingAmt || '0', this.AmountDecimal);
          this.targetRate = this.formatKLMB(
            this.targetRate || '0',
            this.precision
          );
          this.billingAmt = this.formatKLMB(
            this.billingAmt || '0',
            this.AmountDecimal1
          );
          this.creditAmt = this.formatKLMB(
            this.creditAmt || '0',
            this.AmountDecimal2
          );
          this.cashBalanceInsellCcy = this.formatKLMB(
            this.cashBalanceInsellCcy || '0',
            this.AmountDecimal2
          );
          // this.afs.getAccountDetails('32107', this.selectedCCY.split('-')[0].trim(), this.selectedCCY.split('-')[1].trim(), 'FXC');
        }

        // this.selectAccount(this.direction === 'Buy'? this.buyCcy : this.sellCcy, this.direction);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  onDirectionChanged(dir) {
    try {
      this.direction = dir;
      if (this.goodOrder && this.direction === 'Buy') {
        this.rate = this.prices.pairaskrate.toFixed(this.precision);
      } else if (this.goodOrder && this.direction === 'Sell') {
        this.rate = this.prices.pairbidrate.toFixed(this.precision);
      } else if (!this.goodOrder && this.direction === 'Buy') {
        this.rate = this.prices.pairbidrate.toFixed(this.precision);
      } else {
        this.rate = this.prices.pairaskrate.toFixed(this.precision);
      }
      this.rate = this.formatKLMB(this.rate, this.precision);
    } catch (ex) {
      console.log(ex);
    }
  }

  onOrderExpTypeChanged(orderExp) {
    try {
      this.orderBookedMessage = '';
      this.orderExpType = orderExp;
      this.selectedHour = '17';
      this.selectedMin = '00';
      switch (orderExp) {
        case 'GTT':
          this.dateDisabled = true;
          this.timeDisabled = false;
          this.ExpiryToDate = this.getToday();
          break;
        case 'GTD':
          this.dateDisabled = false;
          this.timeDisabled = false;
          break;
        case 'EOD':
          this.selectedHour = '17';
          this.selectedMin = '00';
          this.dateDisabled = true;
          this.timeDisabled = true;
          this.ExpiryToDate = this.getToday();
          break;
        case 'GTF':
          this.selectedHour = '23';
          this.selectedMin = '59';
          this.dateDisabled = true;
          this.timeDisabled = true;
          this.ExpiryToDate = this.getToday();
          // this.getFridayDate();
          break;
        default:
          break;
      }
    } catch (ex) {
      console.log(ex);
    }
    // console.log(orderExp);
  }

  onTargetChange() {
    try {
      // this.targetRate = this.unformatToStandard(this.targetRate);
      // if (this.targetRate.includes(',')) {
      //   this.targetRate = this.unformatNumber_ES(this.targetRate);
      // }
      // this.targetRate = this.formatKLMB_ES(this.targetRate, this.precision);
      this.targetRate = this.formatKLMB(this.targetRate, this.precision);
    } catch (ex) {
      console.log(ex);
    }
  }

  formatNumber_ES(value) {
    try {
      // console.log(control);
      if (isNaN(parseFloat(value))) {
        // return '';
        value = '';
        // this.billingAmt = value;
      } else {
        value = this.formatKLMB_ES(value, this.AmountDecimal1);
        //console.log(value);
        // this.billingAmt = value;
        // this.billingAmt = parseFloat(value).toLocaleString('es-ES');
      }
      return value;
    } catch (ex) {
      console.log(ex);
    }
  }

  unformatNumber(value) {
    try {
      // console.log(control);
      if (value) {
        this.billingAmt = this.unformatNumber_ES(value);
      }
      // control.currentValue.replace(/,/g, '');
    } catch (ex) {
      console.log(ex);
    }
  }

  unformatToStandard(value) {
    try {
      if (value) {
        const parts = value.split(',');
        value = parts[0].replace(/\./g, '') + '.' + parts[1];
        // value.replace(/\.,/g, '');
        //console.log(value);
        return parseFloat(value);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  IsValidNumber(val: any): boolean {
    return /^\d+(.\d*?)?$/.test(val);
  }

  unformatNumber_ES(value) {
    try {
      if (value) {
        const parts = value.split(',');
        value = parts[0].replace(/\./g, '') + ',' + (parts[1] || '00');
        // value.replace(/\.,/g, '');
        //console.log(value);
        return value;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  accepttargetRate(value: string) {
    try {
      if (value.match(/([,]{1})/g) != null) {
        value = value.replace(/\./g, '');
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  // FOR INverted Logic of dot n commas
  formatKLMB_ES(value: string, precision = 2) {
    try {
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
      //console.log(parts);
      value = parts[0].replace(/,/g, '.') + ',' + parts[1];
      return value;
    } catch (ex) {
      console.log(ex);
    }
  }
  validateRate() {
    try {
      // if (!this.errormsg) {
      //console.log(this.direction, this.unformatNumber_EN(this.targetRate), this.unformatNumber_EN(this.rate));
      if (!this.unformatNumber_EN(this.rate)) {
        this.errormsg = 'Rate is required.';
        return false;
      } else if (
        !this.targetRate ||
        parseFloat(this.targetRate.replace(/,/g, '')) === 0
      ) {
        this.errormsg = 'Target Rate should be non-zero.';
      } else if (
        (this.direction === 'Buy' &&
          this.unformatNumber_EN(this.targetRate) >
            this.unformatNumber_EN(this.rate)) ||
        (this.direction === 'Sell' &&
          this.unformatNumber_EN(this.targetRate) <
            this.unformatNumber_EN(this.rate))
      ) {
        if (this.direction === 'Buy') {
          this.errormsg = 'Target rate cannot be greater than market rate.';
        } else {
          this.errormsg = 'Target rate cannot be less than market rate.';
        }
        return false;
      } else {
        this.clearMsg();
        return true;
      }
      // }
    } catch (ex) {
      console.log(ex);
    }
  }
  validateDate() {
    try {
      if (!this.errormsg) {
        const date = new Date();
        const expiry =
          this.ExpiryToDate.split('/')[1] +
          '/' +
          this.ExpiryToDate.split('/')[0] +
          '/' +
          this.ExpiryToDate.split('/')[3];
        const expiryDate = new Date(expiry);
        expiryDate.setHours(17, 0, 0, 0);
        if (date.getTime() >= expiryDate.getTime()) {
          this.errormsg = 'Expiry date should be greter than current date.';
          return false;
        } else {
          this.clearMsg();
          return true;
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  // validateInputNumber(value) {
  //   //console.log(value);
  //   const val = value.replace(/,/g, '');
  //   if (!val.match(/^\d+$/)) {
  //     return false;
  //   }
  //   return true;
  // }
  NotionalValidate(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      const value = target.value.toString();
      //console.log(value);
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace
      codes = [
        8, 9, 13, 44, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76,
        77, 98, 107, 108, 109, 127,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      if (code === 46) {
        this.sampleString2 = target.value;
        if (this.sampleString2.includes('.')) {
          return false;
        } else {
          return true;
        }
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
    } catch (ex) {
      console.log(ex);
    }
  }
  checkEmptyNotional(val) {
    try {
      if (!this.errormsg) {
        //console.log(val, parseFloat(val));
        if ([null, 0, NaN, undefined].includes(parseFloat(val))) {
          this.clearMsg();
          this.errormsg = 'Invalid Notional';
          return false;
        } else {
          this.clearMsg();
          return true;
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (ex) {
      console.log(ex);
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
        indexOf = (key) => {
          let i = -1;
          let index = -1;
          for (i = 0; i < this.length; i++) {
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
    } catch (ex) {
      console.log(ex);
    }
  }

  amendOrder() {
    try {
      if (this.AmendScreen) {
        const ExpiryType = this.orderExpType;
        const ExpiryTime =
          '/Date(' +
          this.getEPOCHDate(
            this.ExpiryToDate,
            this.selectedHour + ':' + this.selectedMin + ':' + '00'
          ) +
          ')/';
        let OrderAmt1, OrderAmt2;
        if (this.direction === 'Buy') {
          OrderAmt1 = this.unformatNumber_EN(this.billingAmt);
          OrderAmt2 =
            this.unformatNumber_EN(this.billingAmt) *
              this.unformatNumber_EN(this.targetRate) +
            '';
        } else {
          OrderAmt2 = this.unformatNumber_EN(this.billingAmt);
          OrderAmt1 =
            this.unformatNumber_EN(this.billingAmt) *
              this.unformatNumber_EN(this.targetRate) +
            '';
        }
        const OrderID = this.AmendObj.Orderid;
        const OrderRate = this.unformatNumber_EN(this.targetRate);
        const CCYPair = this.selectedCCY;
        if (
          this.validateDate() &&
          this.validateRate() &&
          this.unformatNumber_EN(OrderAmt1)
        ) {
          this.afs.amendOrder(
            ExpiryType,
            ExpiryTime,
            OrderID,
            CCYPair,
            OrderAmt1,
            OrderAmt2,
            OrderRate,
            'Singapore Standard Time'
          );
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  formatDateTimeHours(value: string) {
    try {
      const datetime = value.split('T');
      const date = datetime[0];
      const time = datetime[1].split('+')[0];
      // const Hours = parseInt(time.split(':')[0], 10);
      // console.log(datetime, date, time);
      return (
        date.split('-')[2] +
        '-' +
        this.months[parseInt(date.split('-')[1], 10) - 1] +
        '-' +
        date.split('-')[0] +
        ' ' +
        time.split(':')[0] +
        ':' +
        time.split(':')[1] +
        ':' +
        time.split(':')[2]
      );
      // return date.split('-')[2] + '-' + this.months[parseInt(date.split('-')[1], 10) - 1] + '-' + date.split('-')[0] + ' ' + (Hours > 12 ? Hours - 12 : Hours) + ':' + time.split(':')[1] + ':' + time.split(':')[2] + ' ' + (Hours > 12 ? 'PM' : 'AM');
      // return Time.split(' ')[0];
    } catch (ex) {
      console.log(ex);
    }
  }
  formatKLMB(value: string, precision = 2) {
    try {
      value = '0' + value.replace(/,/g, '');
      if (value.match(/([kK]{1})/g) != null) {
        value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(
          precision
        );
      } else if (value.match(/([lL]{1})/g) != null) {
        value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(
          precision
        );
      } else if (value.match(/([mM]{1})/g) != null) {
        value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(
          precision
        );
      } else if (value.match(/([bB]{1})/g) != null) {
        value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(
          precision
        );
      }
      value = parseFloat(value)
        .toFixed(precision)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return value;
    } catch (ex) {
      console.log(ex);
    }
  }

  formatKLMB_new(value: string, type) {
    try {
      let precision;
      if (type === 'B') {
        precision = this.AmountDecimal1;
      } else if (type === 'S') {
        precision = this.AmountDecimal2;
      }
      value = '0' + value.replace(/,/g, '');
      if (value.match(/([kK]{1})/g) != null) {
        value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(
          precision
        );
      } else if (value.match(/([lL]{1})/g) != null) {
        value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(
          precision
        );
      } else if (value.match(/([mM]{1})/g) != null) {
        value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(
          precision
        );
      } else if (value.match(/([bB]{1})/g) != null) {
        value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(
          precision
        );
      }
      if (precision === 0) {
        value = parseFloat(value)
          .toFixed(precision)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        value = parseFloat(value)
          .toFixed(precision)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
      return value;
    } catch (ex) {
      console.log(ex);
    }
  }
  formatNumber(value) {
    try {
      // console.log(control);
      if (isNaN(parseFloat(value))) {
        // return '';
        value = '';
        // this.billingAmt = value;
      } else {
        value = this.formatKLMB(value, this.AmountDecimal1);
        // console.log(value);
        // this.billingAmt = value;
        // this.billingAmt = parseFloat(value).toLocaleString('es-ES');
      }
      return value;
    } catch (ex) {
      console.log(ex);
    }
  }
  unformatNumber_EN(control) {
    try {
      // console.log(control);
      if (control) {
        control = control.replace(/,/g, '');
        return control;
      } else {
        return 0;
      }
      // control.currentValue.replace(/,/g, '');
    } catch (ex) {
      console.log(ex);
    }
  }
  clearMsg() {
    this.errormsg = '';
    this.orderBookedMessage = '';
  }

  routeTab(tab: string) {
    this.afs.ShowTabInLimitOrder(tab);
  }

  selectHour(hour) {
    this.orderBookedMessage = '';
    this.selectedHour = hour;
  }
  selectMin(min) {
    this.orderBookedMessage = '';
    this.selectedMin = min;
  }

  changeExpiryDate(expiryDate: string) {
    try {
      this.orderBookedMessage = '';
      this.ExpiryToDate = expiryDate;
      //console.log(this.ExpiryToDate);
      const date = new Date();
      const today =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '-' +
        this.months[date.getMonth()] +
        '-' +
        date.getFullYear();

      if (new Date(expiryDate) < new Date(today)) {
        this.errormsg =
          'Expiry Date should be greater than or equal to current Date.';
      } else {
        // nothing
        this.errormsg = '';
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  getToday() {
    try {
      const todayArr = new Date().toDateString().split(' ');
      return todayArr[2] + '-' + todayArr[1] + '-' + todayArr[3];
    } catch (ex) {
      console.log(ex);
    }
  }

  getFridayDate() {
    try {
      let TODdate = new Date();
      let count = 5 - TODdate.getDay();
      TODdate.setDate(TODdate.getDate() + count);
      //console.log(TODdate);

      this.ExpiryToDate =
        (TODdate.getDate() < 10 ? '0' + TODdate.getDate() : TODdate.getDate()) +
        '-' +
        this.months[TODdate.getMonth()] +
        '-' +
        TODdate.getFullYear();
    } catch (ex) {
      console.log(ex);
    }
  }

  //Customer ddl functions

  // selectCustomer(e) {
  //   try {
  //     if (this.flag) {
  //       this.PortfolioList = [];
  //       this.cashBalance = [];
  //       this.accountBalanceData = [];
  //       this.flag = false;
  //       this.Customer = $('.customer-list-hover').data('customer');
  //       this.selectedCustomerIndex = 0;
  //       // let pan = this.Customer.split('|')[1];
  //       for (let i = 0; i < this.customerInfo.length; i++) {
  //         if (this.customerInfo[i]['CustomerName'] === this.Customer) {
  //           this.CustPAN = this.customerInfo[i]['CustomerID'];
  //           this.CustomerCIF = this.customerInfo[i]['AH_CIF_No'];
  //           this.CustomerSegment = this.customerInfo[i]['AH_Customer_Segment'];
  //           this.RMName = this.customerInfo[i]['RelManager'];
  //           this.RMID = this.customerInfo[i]['RM_Id'] || 0;
  //           this.DealerID = this.customerInfo[i]['DealerID'];
  //           // this.customerID = this.customerInfo[i]['CustomerID'];
  //           // this.customerNameCode = this.customerInfo[i]['CustomerName'];
  //           break;
  //         }
  //       }
  //       this.billingAcc = '';
  //       this.creditAcc = '';
  //       this.afs.getEventName(this.CustomerSegment);
  //       this.afs.getAccountDetails(this.CustPAN, this.buyCcy, this.sellCcy, 'limit');
  //       this.afs.getPortfolio(this.CustPAN);
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //     console.log('Move up not working Contact team');
  //   }
  // }

  setCustomer(item) {
    try {
      this.flag = false;
      this.PortfolioList = [];
      this.cashBalance = [];
      this.accountBalanceData = [];
      this.Customer = item;
      this.selectedCustomerIndex = 0;
      console.log("limit Customer info ", this.customerInfo)
      for (let i = 0; i < this.customerInfo.length; i++) {
        if (this.customerInfo[i]['CustomerName'] === this.Customer) {
          this.CustPAN = this.customerInfo[i]['CustomerID'];
          this.CustomerCIF = this.customerInfo[i]['AH_CIF_No'];
          this.CustomerSegment = this.customerInfo[i]['AH_Customer_Segment'];
          this.RMName = this.customerInfo[i]['RelManager'];
          this.RMID = this.customerInfo[i]['RM_Id'] || 0;
          this.DealerID = this.customerInfo[i]['DealerID'];
          // this.customerID = this.customerInfo[i]['CustomerID'];
          // this.customerNameCode = this.customerInfo[i]['CustomerName'];
          break;
        }
      }
      this.billingAcc = '';
      this.creditAcc = '';
      this.afs.getAccountDetails(
        this.CustPAN,
        this.buyCcy,
        this.sellCcy,
        'limit'
      );
      this.afs.getEventName(this.CustomerSegment);
      // this.afs.getPortfolio(this.CustPAN);
    } catch (error) {
      console.log('Error:', error);
      console.log('Set Customer not working please Contact FinIQ');
    }
  }

  ChangeIndex() {
    try {
      this.selectedCustomerIndex = 0;
      this.flag = true;

      this.elem.nativeElement.querySelectorAll(
        '.customer-suggesstion-container'
      ).scrollTop = 0;
    } catch (error) {
      console.log('ChangeIndex Error', error);
    }
  }

  backKeyPress() {
    try {
      this.flag = false;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // amountCalculation(datainput) {
  //   try {
  //     if (this.targetRate > 0) {
  //       if (datainput === 'Buy') {
  //         this.creditAmt = (this.unformatNumber_EN(this.billingAmt) * this.unformatNumber_EN(this.targetRate)).toFixed(this.AmountDecimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //         this.datainputvalue = 'Buy';
  //       } else if (datainput === 'Sell') {
  //         this.billingAmt = (this.unformatNumber_EN(this.creditAmt) / this.unformatNumber_EN(this.targetRate)).toFixed(this.AmountDecimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //         this.datainputvalue = 'sell';
  //       } else {
  //         if (this.datainputvalue === 'Buy') {
  //           this.creditAmt = (this.unformatNumber_EN(this.billingAmt) * this.unformatNumber_EN(this.targetRate)).toFixed(this.AmountDecimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //         } else if (this.datainputvalue === 'Sell') {
  //           this.billingAmt = (this.unformatNumber_EN(this.creditAmt) / this.unformatNumber_EN(this.targetRate)).toFixed(this.AmountDecimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //         }
  //       }
  //     } else {
  //       this.datainputvalue = datainput;
  //     }
  //     // this.direction= this.datainputvalue;
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }
  amountCalculation(datainput) {
    try {
      if (parseFloat(this.targetRate) > 0 && this.orderType !== 'Market') {
        let amtRate = this.orderType === 'Market' ? this.rate : this.targetRate;
        if (datainput === 'Buy') {
          if (this.direction === 'Buy') {
            this.creditAmt = (
              this.unformatNumber_EN(this.billingAmt) *
              this.unformatNumber_EN(amtRate)
            )
              .toFixed(this.AmountDecimal2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            if (!this.AmendScreen) {
              this.creditAmt = (
                this.unformatNumber_EN(this.billingAmt) /
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
              this.creditAmt = (
                this.unformatNumber_EN(this.billingAmt) *
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
          this.datainputvalue = 'Buy';
        } else if (datainput === 'Sell') {
          if (this.direction === 'Buy') {
            this.billingAmt = (
              this.unformatNumber_EN(this.creditAmt) /
              this.unformatNumber_EN(amtRate)
            )
              .toFixed(this.AmountDecimal1)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            if (!this.AmendScreen) {
              this.billingAmt = (
                this.unformatNumber_EN(this.creditAmt) *
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal1)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
              this.billingAmt = (
                this.unformatNumber_EN(this.creditAmt) /
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal1)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
          this.datainputvalue = 'Sell';
        } else {
          if (this.direction === 'Buy') {
            if (this.datainputvalue === 'Buy') {
              this.creditAmt = (
                this.unformatNumber_EN(this.billingAmt) *
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else if (this.datainputvalue === 'Sell') {
              this.billingAmt = (
                this.unformatNumber_EN(this.creditAmt) /
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal1)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
              this.creditAmt = (
                this.unformatNumber_EN(this.billingAmt) *
                this.unformatNumber_EN(amtRate)
              )
                .toFixed(this.AmountDecimal2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          } else {
            if (!this.AmendScreen) {
              if (this.datainputvalue === 'Buy') {
                this.creditAmt = (
                  this.unformatNumber_EN(this.billingAmt) /
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              } else if (this.datainputvalue === 'Sell') {
                this.billingAmt = (
                  this.unformatNumber_EN(this.creditAmt) *
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal1)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              } else {
                this.creditAmt = (
                  this.unformatNumber_EN(this.billingAmt) /
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            } else {
              if (this.datainputvalue === 'Buy') {
                this.creditAmt = (
                  this.unformatNumber_EN(this.billingAmt) *
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              } else if (this.datainputvalue === 'Sell') {
                this.billingAmt = (
                  this.unformatNumber_EN(this.creditAmt) /
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal1)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              } else {
                this.creditAmt = (
                  this.unformatNumber_EN(this.billingAmt) *
                  this.unformatNumber_EN(amtRate)
                )
                  .toFixed(this.AmountDecimal2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }
        }
      } else {
        this.datainputvalue = datainput;
        if (datainput === 'Buy') {
          this.creditAmt = Number(0)
            .toFixed(this.AmountDecimal2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else if (datainput === 'Sell') {
          this.billingAmt = Number(0)
            .toFixed(this.AmountDecimal2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
      // this.direction= this.datainputvalue;
    } catch (ex) {
      console.log(ex);
    }
  }
  getAsset2() {
    try {
      // this.sellCcy = undefined;
      this.sellCcy = '';
      this.clearData();
      this.afs.getcurrencypairsdetails(
        'ASSET2',
        this.buyCcy,
        'ASSET2',
        'FXCOEN'
      );
    } catch (ex) {
      console.log(ex);
    }
  }
  GenerateSessionID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  //Market order functions start

  CallRates() {
    try {
      //console.log(this.invccy, this.invamt);
      // if (this.billingAcc === '' || this.billingAcc === undefined) {
      //   this.errormsg = 'From Account not available.';
      // } else if (this.creditAcc === '' || this.creditAcc === undefined) {
      //   this.errormsg = 'To Account not available.';
      // } else

      this.clearData();
      // if (this.timerId !== undefined) {
      //   clearTimeout(this.timerId);
      // }
      // this.sec = 0;
      // this.rate = Number(0).toFixed(this.precision);
      // if (this.datainputvalue === 'Buy') {
      //   this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
      // } else if (this.datainputvalue === 'Sell') {
      //   this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
      // }

      if (this.Customer === '') {
        this.errormsg = 'Please select Customer.';
      } else {
        this.errormsg = '';
      }
      if (this.errormsg === '') {
        // if (this.flag1 === false) {
        //   this.flag1 = true;
        //   this.loaderTimer = true;
        this.pricingLoader_market = true;
        // this.apifunction.getDailyTransactionLimit(this.invccy, this.invamt.replace(/,/g, ''), this.CustPAN);
        //  this.validationMsg = '';
        // this.SessionID = this.GenerateSessionID();
        this.afs.GetFXDatesForSpotForward(
          this.buyCcy + ' - ' + this.sellCcy,
          this.tenor,
          1,
          1300
        );
        // this.callQuoteService();
        // }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  callQuoteService() {
    try {
      if (this.goPrice_mfk >= 1) {
        let ccy1Amount, ccy2Amount;
        this.SessionID = this.GenerateSessionID();
        this.uniqueKey = '_' + Math.random().toString(36).substr(2, 9);
        if (
          this.datainputvalue === 'Buy' ||
          this.datainputvalue === undefined ||
          this.datainputvalue === 'Target'
        ) {
          // if (this.dataInput === 'AMOUNT1') {
          ccy1Amount = parseFloat(this.billingAmt.replace(/,/g, '')); //invAmt
          ccy2Amount = 0;
        } else {
          ccy1Amount = 0;
          ccy2Amount = parseFloat(this.creditAmt.replace(/,/g, '')); //altAmt
        }
        if (this.direction === 'Sell') {
          // this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
          //   this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName,
          //   this.CustPAN, this.DealerID, this.priceProvider, this.billingAcc, this.creditAcc, "", this.overrideExceptionRule, this.authApi.UserName, this.authApi.EntityID);
          this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
            this.productType === 'FXSpot' ? 'FXC' : 'FXW',
            this.buyCcy + ' - ' + this.sellCcy,
            'Buy',
            ccy1Amount,
            ccy2Amount,
            0.5,
            this.tenor,
            false,
            'fx',
            this.ValueDate_mkt,
            this.FixingDate_mkt,
            this.SessionID,
            1300,
            1,
            this.direction,
            this.uniqueKey,
            this.homeApi.CIF,
            this.Customer,
            'BB',
            this.homeApi.RMName,
            this.homeApi.CustomerId,
            this.homeApi.CustomerId,
            this.billingAcc,
            this.creditAcc,
            this.priceProvider
          );
        } else {
          //   this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder(this.productType === 'FXSpot' ? 'FXC' : 'FXW', this.buyCcy + " - " + this.sellCcy, 'Buy', ccy1Amount, ccy2Amount, this.RMspread,
          //     this.tenor, false, 'fx', this.ValueDate_mkt, this.FixingDate_mkt, this.SessionID, 1300, 1, this.direction, this.uniqueKey, this.CustomerCIF, this.Customer, this.CustomerSegment, this.RMName,
          //     this.CustPAN, this.DealerID, this.priceProvider, this.billingAcc, this.creditAcc, "", this.overrideExceptionRule, this.authApi.UserName, this.authApi.EntityID);
          this.afs.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
            this.productType === 'FXSpot' ? 'FXC' : 'FXW',
            this.buyCcy + ' - ' + this.sellCcy,
            'Buy',
            ccy1Amount,
            ccy2Amount,
            0.5,
            this.tenor,
            false,
            'fx',
            this.ValueDate_mkt,
            this.FixingDate_mkt,
            this.SessionID,
            1300,
            1,
            this.direction,
            this.uniqueKey,
            this.homeApi.CIF,
            this.Customer,
            'BB',
            this.homeApi.RMName,
            this.homeApi.CustomerId,
            this.homeApi.CustomerId,
            this.billingAcc,
            this.creditAcc,
            this.priceProvider
          );
        }
        // this.OrderSubmission=true;
        // this.TransactionShow=false;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  calculateIndicativeRevenue() {
    try {
      if (this.direction === 'Sell') {
        if (this.sellCcy !== 'USD') {
          if (this.midRatePair.indexOf('USD') === 0) {
            this.indicativeRevenue = this.custRevenueSell / this.midRate;
          } else if (this.midRatePair.indexOf('USD') === 6) {
            this.indicativeRevenue = this.midRate * this.custRevenueSell;
          }
        } else {
          this.indicativeRevenue = this.custRevenueSell;
        }
      } else {
        if (this.buyCcy !== 'USD') {
          if (this.midRatePair.indexOf('USD') === 0) {
            this.indicativeRevenue = this.custRevenueSell / this.midRate;
          } else if (this.midRatePair.indexOf('USD') === 6) {
            this.indicativeRevenue = this.midRate * this.custRevenueSell;
          }
        } else {
          this.indicativeRevenue = this.custRevenueSell;
        }
      }

      //console.log('Indicative Revenue is : ' + this.indicativeRevenue);
    } catch (ex) {}
  }

  calculateNotional1() {
    try {
      if (this.datainputvalue === 'Target') {
        if (parseFloat(this.billingAmt.replace(/,/g, '')) > 0) {
          this.datainputvalue = 'Buy';
        } else if (parseFloat(this.creditAmt.replace(/,/g, '')) > 0) {
          this.datainputvalue = 'Sell';
        }
      }
      if (this.direction === 'Sell') {
        // if (this.datainputvalue === 'Buy') { //if (this.highlightFlag === 'invest') {
        //   this.creditAmt = (parseFloat(this.billingAmt.replace(/,/g, '')) * parseFloat(this.custrate)).toFixed(this.AmountDecimal2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // } else {
        //   this.billingAmt = (parseFloat(this.creditAmt.replace(/,/g, '')) / parseFloat(this.custrate)).toFixed(this.AmountDecimal1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // }
        if (this.datainputvalue === 'Buy') {
          //if (this.highlightFlag === 'invest') {
          this.creditAmt = (
            parseFloat(this.billingAmt.replace(/,/g, '')) /
            parseFloat(this.custrate)
          )
            .toFixed(this.AmountDecimal2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          this.billingAmt = (
            parseFloat(this.creditAmt.replace(/,/g, '')) *
            parseFloat(this.custrate)
          )
            .toFixed(this.AmountDecimal1)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      } else {
        if (this.datainputvalue === 'Buy') {
          //if (this.highlightFlag === 'invest') {
          this.creditAmt = (
            parseFloat(this.billingAmt.replace(/,/g, '')) *
            parseFloat(this.custrate)
          )
            .toFixed(this.AmountDecimal2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          this.billingAmt = (
            parseFloat(this.creditAmt.replace(/,/g, '')) /
            parseFloat(this.custrate)
          )
            .toFixed(this.AmountDecimal1)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  bookOrder_Market() {
    try {
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.sec = 0;
      this.errormsg = '';
      this.orderBookedMessage = '';
      this.overrideExceptionRule = false;
      // if (!this.loader) {
      if (this.Customer === '') {
        this.errormsg = 'Please select customer';
        this.tradeLoader = false;
      } else if (this.creditAcc === '') {
        this.errormsg = 'From Account not available';
        this.tradeLoader = false;
      } else if (this.billingAcc === '') {
        this.errormsg = 'To Account not available';
        this.tradeLoader = false;
      } else if (parseFloat(this.rate) === 0) {
        this.errormsg = 'Rate is not available';
        this.tradeLoader = false;
      } else {
        this.tradeLoader = true;
        this.errormsg = '';
        // console.log(this.priceQuoteRefSell, this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.invccy + ' - ' + this.altccy, 'Buy', this.commonfunction.UnformatNumberFromFloat(this.invamt),
        //   this.commonfunction.UnformatNumberFromFloat(this.altamt), this.bidask, this.custrate, this.FixingDate, this.ValueDate, this.Type, this.RMspread, 0 + '',
        //   this.spotrate, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, this.custRevenueSell.toString(), 'FX', '6000123', 'AMOUNT2');

        let date = this.ValueDate_mkt.replace('-', '');
        date = date.replace('-', '');
        // console.log(this.priceQuoteRefSell, this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.altccy + ' - ' + this.invccy, 'Buy', this.commonfunction.UnformatNumberFromFloat(this.invamt),
        //   this.commonfunction.UnformatNumberFromFloat(this.altamt), this.bidask, this.custrate, this.FixingDate, this.ValueDate, this.optiontype === 'Spot' ? this.Type : date, this.RMspread, 0 + '',
        //   this.spotrate, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, this.custRevenueSell.toString(), 'FX', '6000123', this.dataInput, this.Type, this.Customer, this.CustomerCIF, this.RMName, this.CustomerSegment, this.CustPAN, this.creditAcc, this.billingAcc, this.indicativeRevenue);
        let ccy1amt, ccy2amt;
        let dataInput = this.datainputvalue === 'Buy' ? 'AMOUNT1' : 'AMOUNT2';
        // this.checkForRuleExceptions();
        if (this.direction === 'Sell') {
          ccy1amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.billingAmt)
          );
          ccy2amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.creditAmt)
          );

          this.afs.BookOrderforSF_LimitOrder(
            this.priceQuoteRefSell,
            this.productType === 'FXSpot' ? 'FXC' : 'FXW',
            this.buyCcy + ' - ' + this.sellCcy,
            'Buy',
            ccy1amt,
            ccy2amt,
            this.bankRate,
            this.custrate,
            this.FixingDate_mkt,
            this.ValueDate_mkt,
            this.productType === 'FXSpot' ? this.tenor : date,
            this.RMspread,
            0 + '',
            this.spotrate,
            this.swapPointsSell,
            this.QuoteIDSell,
            this.ExternalQuoteIDSell,
            this.PPSell,
            this.SpotDate_mkt,
            this.custRevenueSell.toString(),
            'FX',
            '6000123',
            dataInput,
            this.tenor,
            this.Customer,
            this.CustomerCIF,
            this.RMName,
            this.CustomerSegment,
            this.CustPAN,
            this.creditAcc,
            this.billingAcc,
            this.indicativeRevenue,
            undefined,
            undefined,
            40416,
            this.templateSerialNo,
            this.uniqueKey,
            this.autoRoll ? 'Y' : 'N',
            this.stpFlag,
            '',
            this.authApi.UserName,
            this.authApi.EntityID
          );
        } else if (this.direction === 'Buy') {
          ccy1amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.billingAmt)
          );
          ccy2amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.creditAmt)
          );
          this.afs.BookOrderforSF_LimitOrder(
            this.priceQuoteRefSell,
            this.productType === 'FXSpot' ? 'FXC' : 'FXW',
            this.buyCcy + ' - ' + this.sellCcy,
            'Buy',
            ccy1amt,
            ccy2amt,
            this.bankRate,
            this.custrate,
            this.FixingDate_mkt,
            this.ValueDate_mkt,
            this.productType === 'FXSpot' ? this.tenor : date,
            this.RMspread,
            0 + '',
            this.spotrate,
            this.swapPointsSell,
            this.QuoteIDSell,
            this.ExternalQuoteIDSell,
            this.PPSell,
            this.SpotDate_mkt,
            this.custRevenueSell.toString(),
            'FX',
            '6000123',
            dataInput,
            this.tenor,
            this.Customer,
            this.CustomerCIF,
            this.RMName,
            this.CustomerSegment,
            this.CustPAN,
            this.creditAcc,
            this.billingAcc,
            this.indicativeRevenue,
            undefined,
            undefined,
            40416,
            this.templateSerialNo,
            this.uniqueKey,
            this.autoRoll ? 'Y' : 'N',
            this.stpFlag,
            '',
            this.authApi.UserName,
            this.authApi.EntityID
          );
        }
      }
    } catch (ex) {
      console.log(ex);
    }
    // }
  }
  notionalChangefunction(datainput) {
    try {
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.errormsg = '';
      this.orderBookedMessage = '';
      if (this.orderType === 'Market') {
        this.sec = 0;
        this.datainputvalue = datainput;
        this.rate = Number(0).toFixed(this.precision);
        if (this.datainputvalue === 'Buy') {
          this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
        } else if (this.datainputvalue === 'Sell') {
          this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
        }
        this.pricingLoader_market = true;
        this.callQuoteService();
      } else {
        this.amountCalculation(datainput);
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  changeOrderType() {
    try {
      this.errormsg = '';
      this.orderBookedMessage = '';
      this.tradeLoader = false;
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.errormsg = '';
      // this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
      // this.rate = Number(0).toFixed(this.precision);
      this.SelectCCY();
    } catch (ex) {
      console.log(ex);
    }
  }

  setTimer() {
    try {
      var timeLeft = 10;
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.timerId = setInterval(() => {
        // this.TimeUP = false;
        if (timeLeft === -1) {
          clearTimeout(this.timerId);
          // this.flag1 = false;
          // this.TimeUP = true;
          // if (this.OrderSubmission) {
          this.callPricingForTimer();
          // }
        } else {
          this.sec = timeLeft;
          timeLeft--;
        }
      }, 1000);
    } catch (ex) {
      console.log(ex);
    }
  }
  callPricingForTimer() {
    try {
      // if (this.timerId !== undefined) {
      //   clearTimeout(this.timerId);
      // }
      // this.sec = 0;
      // this.rate = Number(0).toFixed(this.precision);
      // if (this.datainputvalue === 'Buy') {
      //   this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
      // } else if (this.datainputvalue === 'Sell') {
      //   this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
      // }
      this.clearData();
      this.pricingLoader_market = true;
      this.callQuoteService();
    } catch (ex) {
      console.log(ex);
    }
  }
  clearData() {
    try {
      if (!this.overrideExceptionRule) {
        this.errormsg = '';
      }
      this.orderBookedMessage = '';
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.sec = 0;
      this.rate = Number(0).toFixed(this.precision);
      if (this.datainputvalue === 'Buy') {
        this.creditAmt = Number(0).toFixed(this.AmountDecimal2);
      } else if (this.datainputvalue === 'Sell') {
        this.billingAmt = Number(0).toFixed(this.AmountDecimal1);
      }
      this.indicativeRevenue = undefined;
      this.midRate = undefined;
    } catch (ex) {
      console.log(ex);
    }
  }

  getDate_mkt(event: MatDatepickerInputEvent<Date>) {
    try {
      // this.events.push(`${type}: ${event.value}`);
      let selecteddate = event.value;
      // console.log(selecteddate);
      // this.datevalidation = false;
      this.errormsg = '';

      if (selecteddate.getDay() === 0 || selecteddate.getDay() === 6) {
        this.errormsg = 'Settlement Date is on holiday.';
        // this.datevalidation = true;
        // setTimeout(() => {
        //   this.datevalidation = false;
        //   this.validtionmsg = '';
        // }, 2000);
      } else {
        // this.datevalidation = false;
        let date = new Date();
        // console.log(date);
        let datediff = selecteddate.getTime() - date.getTime();
        // console.log(datediff);

        let dateindays = datediff / (1000 * 3600 * 24);

        // console.log(dateindays);
        let tcode = parseInt(dateindays + '') + '';
        tcode = tcode + 'D';

        this.tenor = tcode;

        let sdate =
          selecteddate.getDate() +
          '-' +
          this.months[selecteddate.getMonth()] +
          '-' +
          selecteddate.getFullYear();
        // console.log(date);
        this.ValueDate_mkt = sdate;
        this.FixingDate_mkt = sdate;

        this.valuedateday = selecteddate.getDate().toString();
        this.valuedatemonth = (selecteddate.getMonth() + 1).toString();
        this.valuedateyear = selecteddate.getFullYear().toString();

        if (this.valuedateday.length === 1) {
          this.valuedateday = '0' + this.valuedateday;
        }
        if (this.valuedatemonth.length === 1) {
          this.valuedatemonth = '0' + this.valuedatemonth;
        }
        if (this.valuedateyear.indexOf('-') >= 0) {
          this.valuedateyear = this.valuedateyear.substr(1);
        }

        // this.clear();
        // if (this.tradingOption === 'on') {
        //   this.loaderStart();
        //   this.Streaming(2);
        // }
        // this.showTenorBox = false;
      }
      this.callPricingForTimer();
    } catch (ex) {
      console.log(ex);
    }
  }
  callpopup() {
    try {
      let link =
        'http://52.163.118.116/FinIQAngularWeb?LoginFlag=N&PanelYesNo=N&TemplateCode=' +
        this.purposeTemplateCode;
      console.log(link);
      // let popup = window.open(link, 'popup', 'width=450,height=650,,left=50,top=50');
      // let popup = window.open('http://52.163.118.116/FinIQAngularWeb?LoginFlag=N&PanelYesNo=N&TemplateCode=TestingTemp', 'popup', 'width=450,height=650,,left=50,top=50');
      // this.windowObj = window.open('http://52.163.118.116/FinIQAngularWeb?LoginFlag=N&PanelYesNo=N&TemplateCode=TestingTemp', 'popup', 'width=900,height=900,');
      window.addEventListener(
        'message',
        (event) => {
          console.log(event.data);

          this.templateSerialNo = event.data['noteMaster'];
        },
        false
      );
    } catch (ex) {
      console.log(ex);
    }
  }
  ChangeTenor(ten, flag) {
    try {
      if (flag === 'Forward') {
        this.showTenorBox = !this.showTenorBox;
        this.showSettlementBox = false;
      } else {
        this.showSettlementBox = !this.showSettlementBox;
        this.showTenorBox = false;
      }
      this.tenor = ten;
      this.CallRates();
    } catch (ex) {
      console.log(ex);
    }
  }
  showhideTenorandsettlement() {
    try {
      if (this.productType === 'Forward') {
        this.showTenorBox = !this.showTenorBox;
        this.showSettlementBox = false;
      } else {
        this.showSettlementBox = !this.showSettlementBox;
        this.showTenorBox = false;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  productTypeChange() {
    try {
      this.tenor = '';
      this.valuedateday = '';
      this.valuedatemonth = '';
      this.valuedateyear = '';
      this.pricingLoader_market = false;
      this.uniqueKey = '_' + Math.random().toString(36).substr(2, 9);
    } catch (ex) {
      console.log(ex);
    }
  }
  // setAccountDetailsofCust() {
  //   try {
  //     this.billingAcc = '';
  //     this.creditAcc = '';
  //     this.billingAccountList = [];
  //     this.creditAccountList = [];

  //     if (this.selectedCCY !== undefined && this.selectedCCY !== '') {
  //       for (let i = 0; i < this.accinfo.length; i++) {
  //         // if (this.accinfo[i]['SICurrency'] === this.selectedCCY.split('-')[0].trim()) {
  //         //   this.billingAcc = this.accinfo[i]['AccountNo'];
  //         // }
  //         // if (this.accinfo[i]['SICurrency'] === this.selectedCCY.split('-')[1].trim()) {
  //         //   this.creditAcc = this.accinfo[i]['AccountNo'];
  //         // }
  //         if (this.accinfo[i]['SICurrency'] === this.buyCcy && this.accinfo[i]['TransactionType'] === 'Debit') {
  //           // this.billingAcc = this.accinfo[i]['AccountNo'];
  //           this.billingAccountList.push({ 'value': this.accinfo[i]['AccountNo'] });
  //         }
  //         if (this.accinfo[i]['SICurrency'] === this.sellCcy && this.accinfo[i]['TransactionType'] === 'Credit') {
  //           // this.creditAcc = this.accinfo[i]['AccountNo'];
  //           this.creditAccountList.push({ 'value': this.accinfo[i]['AccountNo'] });
  //         }
  //       }
  //       // if (this.billingAcc === undefined || this.billingAcc === '') {
  //       //   this.billingAcc = '36564438832';
  //       // }
  //       // if (this.creditAcc === undefined || this.creditAcc === '') {
  //       //   this.creditAcc = '36564438903';
  //       // }
  //       if (this.billingAccountList.length > 0) {
  //         this.billingAcc = this.billingAccountList[0].value;
  //       } else {
  //         this.billingAcc = '36564438832';

  //         this.billingAccountList.push({ 'value': this.billingAcc });
  //       }

  //       if (this.creditAccountList.length > 0) {
  //         this.creditAcc = this.creditAccountList[0].value;
  //       } else {
  //         this.creditAcc = '36564438902';

  //         this.creditAccountList.push({ 'value': this.creditAcc });

  //       }
  //       this.getCashBalanceInSellCcy();
  //     }
  //   } catch (ex) { console.log(ex); }
  // }
  changePurpose() {
    try {
      this.purposeCodeList.map((elem) => {
        if (elem.DATA_VALUE === this.purposeCode) {
          this.purposeTemplateCode = elem.Misc2;
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }
  removeDuplicate(list) {
    try {
      let jsonObject = list.map(JSON.stringify);

      // console.log(jsonObject);

      let uniqueSet = new Set(jsonObject);
      let uniqueArray = Array.from(uniqueSet);
      // console.log(uniqueArray.map(i => JSON.parse(i.toString())));
      return uniqueArray.map((i) => JSON.parse(i.toString()));
    } catch (ex) {
      console.log(ex);
    }
  }

  checkCashBalanceAvailability() {
    try {
      if (this.cashBalanceCheckFlag) {
        if (this.cashBalance.length > 0 && this.cashBalance[0] !== undefined) {
          // if (this.sellCcy === 'USD') {
          //   cashBalanceInsellCcy = parseFloat(this.cashBalance[0].Market_Value_LCYE);

          // } else if (this.sellCcy === this.cashBalance[0].CEHDC_Currency) {
          //   cashBalanceInsellCcy = parseFloat(this.cashBalance[0].Market_Value_LCYE) * parseFloat(this.rate);

          // } else {
          //   let ratemid;
          //   const midPair = this.ccyPairs.filter(c => c.PairCode === ('USD - ' + this.sellCcy))[0];
          //   if (midPair.GoodOrder === 'Y') {
          //     ratemid = this.afs.GetPairMidRate_sync('USD - ' + this.sellCcy, 'TOD', 'FXC');
          //     cashBalanceInsellCcy = parseFloat(this.cashBalance[0].Market_Value_LCYE) * parseFloat(this.rate);
          //   } else {
          //     ratemid = this.afs.GetPairMidRate_sync(this.sellCcy + ' - USD', 'TOD', 'FXC');
          //     cashBalanceInsellCcy = parseFloat(this.cashBalance[0].Market_Value_LCYE) / parseFloat(this.rate[0]['body']['MidRate']);
          //   }

          // }

          if (
            parseFloat(this.creditAmt.replace(/,/g, '')) <=
            parseFloat(this.cashBalanceInsellCcy.replace(/,/g, ''))
          ) {
            return true;
          } else {
            // if (this.timerId !== undefined) {
            //   clearTimeout(this.timerId);
            // }
            // this.sec = 0;
            this.tradeLoader = false;
            // this.errormsg = "You don't have sufficient cash balance for this transaction.";
            this.showPopup();

            return false;
          }
        } else {
          this.tradeLoader = false;
          // if (this.timerId !== undefined) {
          //   clearTimeout(this.timerId);
          // }
          // this.sec = 0;
          // this.errormsg = "You don't have sufficient cash balance for this transaction.";
          this.showPopup();

          return false; // Allow trades if the account is not present in cash balance
        }
      } else {
        this.cashBalanceCheckFlag = true;
        return true;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  getCashBalanceInSellCcy() {
    try {
      this.cashBalance = [];

      console.log(this.accountBalanceData);
      this.cashBalance.push(
        this.accountBalanceData.filter(
          (d) => d.CEHDC_Account_No === this.creditAcc
        )[0]
      );
      console.log(this.cashBalance);
      if (this.cashBalance.length > 0 && this.cashBalance[0] !== undefined) {
        this.cashBalanceInsellCcy = (
          parseFloat(this.cashBalance[0].CEHDC_Available_Amt) +
          parseFloat(this.cashBalance[0].CEHDC_Pending_receive_Amt) -
          parseFloat(this.cashBalance[0].CEHDC_Pending_pay_Amt)
        )
          .toFixed(this.AmountDecimal2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        this.cashBalanceInsellCcy = Number(0).toFixed(this.AmountDecimal2);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  routeToDealer_No() {
    this.errormsg = '';
    this.HidePopup();
    this.routetodealerpopup = false;
  }
  HidePopup() {
    try {
      this.cancelrequestpopup = false;
      (<HTMLInputElement>document.getElementById('overlay')).style.display =
        'none';
    } catch (ex) {
      console.log(ex);
    }
  }
  showPopup() {
    try {
      this.cancelrequestpopup = true;
      (<HTMLInputElement>document.getElementById('overlay')).style.display =
        'block';
    } catch (ex) {
      console.log(ex);
    }
  }
  confirmRequest_yes() {
    try {
      this.cashBalanceCheckFlag = false;
      this.cancelrequestpopup = false;
      this.HidePopup();
    } catch (ex) {
      console.log(ex);
    }
  }
  confirmRequest_no() {
    try {
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
      }
      this.sec = 0;
      this.HidePopup();
    } catch (ex) {
      console.log(ex);
    }
  }

  selectAccount(ccy, direction) {
    this.errormsg = '';
    let currency = ccy;
    if (currency !== '') {
      if (direction === 'Buy') {
        this.wfs
          .getAccountNumberFromPortfolioGeneric(this.customerID, '', currency)
          .subscribe((acc) => {
            if (acc) {
              console.log(acc);
              this.billingAccountList = [];
              this.billingAccountList =
                acc.ExecGenericTableValuedFunctionResult;
              this.billingAcc = this.billingAccountList[0].Param1;

              // this.cashBalance();
            }
          });

        this.afs.getcurrencypairsdetails(
          'ASSET2',
          currency,
          'ASSET2',
          'FXCOEN'
        );
      } else if (direction === 'Sell') {
        this.wfs
          .getAccountNumberFromPortfolioGeneric(this.customerID, '', currency)
          .subscribe((acc) => {
            if (acc) {
              console.log(acc);
              this.creditAccountList = [];
              this.creditAccountList = acc.ExecGenericTableValuedFunctionResult;
              this.creditAcc = this.creditAccountList[0].Param1;

              this.getcashBalance(currency);
            }
          });
      }

      if (this.creditAcc === '') {
        this.errormsg = 'No Credit account.';
      } else if (this.billingAcc === '') {
        this.errormsg = 'No Billing account.';
      }
    }
  }
  getcashBalance(currency) {
    this.wfs
      .getCashbalanceFromAccountNumber(currency, this.billingAcc)
      .subscribe((res) => {
        if (res) {
          this.cashBalanceInsellCcy = res.ExecGenericScalarFunctionResult;
          this.SelectCCY();
        }
      });
  }
}
