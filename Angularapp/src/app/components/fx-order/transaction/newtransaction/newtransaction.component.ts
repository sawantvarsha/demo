import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonfunctionService } from '../../commonfunction.service';
import { environment } from '../../../../../environments/environment';
import { ApifunctionService } from '../../apifunction.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject, Subscription } from 'rxjs';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-newtransaction',
  templateUrl: './newtransaction.component.html',
  styleUrls: ['./newtransaction.component.scss'],
})
export class NewtransactionComponent implements OnInit, OnDestroy {
  index: any;
  totalPortfolio: any;
  portfolio1: any;
  portfolio2: any;
  isMessage: boolean;
  isUserRM: any;
  validate_uniqueID: string;
  constructor(
    cfs: CommonfunctionService,
    private afs: ApifunctionService,
    // public translate: TranslateService,
    private elem: ElementRef,
    private ref: ChangeDetectorRef,
    private api: CustomerApiService,
    private router: Router,
    private homeApi: HomeApiService,
    private workflowApi: WorkflowApiService,
    public activatedRoute: ActivatedRoute
  ) {
    this.commonfunction = cfs;
    this.apifunction = afs;
    this.isMessage = false;
    this.isUserRM = sessionStorage.getItem('UserType').toUpperCase() === 'RM';
  }
  static ws: any;
  setDefaultCustomer: Subject<string> = new Subject();
  clickccy = false;
  TransactionShow = true;
  ConfirmationWindow = false;
  OrderType = '';
  userType = sessionStorage.getItem('UserType');
  BillingAccount: any;
  CreditAccount: any;
  SettlementAccount: string;
  settleAccount: string;
  ccy = 'EUR';
  showSettBox = false;
  transationTime: string;
  spot = '1,0974';
  commonfunction: CommonfunctionService;
  apifunction: ApifunctionService;
  invccy: string;
  altccy: string;
  invamt: any;
  altamt: any;
  optiontype: string;
  spotrate: string;
  custrate: any;
  Reason: string;
  assetURL: string;
  FixingDate: any;
  ValueDate: any;
  Type: any;
  RMspread: any;
  spotRateSell: any;
  swapPointsSell: any;
  QuoteIDSell: any;
  ExternalQuoteIDSell: any;
  PPSell: any;
  SpotDate: any;
  custRevenueSell: any;
  interbankrate: any;
  priceQuoteRefSell: any;
  transactionId: any;
  transactionDateTime: any;
  rateDecimal: any;
  sec: any;
  TimeUP = false;
  buysell: any;
  loader = false;
  Load = false;
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
  valuedateday: string;
  valuedatemonth: string;
  valuedateyear: string;
  clickcalendar = false;
  forwardflag = false;
  forwardPoint: any;
  bidask: any;
  sellamount: any;
  direction1: any;
  direction2: any;
  SessionID: any;
  show: any;
  error = '';
  ccy1decimal: any;
  ccy2decimal: any;
  highlightFlag: any;
  TransactionLimitInUSD: number;
  invNotionalINUSD: number;
  TotalDailyLimitConsumed: number;
  DailyLimitAmt: number;
  amt1flag = false;
  amt2flag = false;
  reqNo: number;
  validationMsg = '';
  OrderSubmission = false;
  lang = 'en';
  streamCount = 0;
  rate: any;
  againprice = 0;
  investmentCurrency: any;
  alternateCurrency: any;
  private pricing: Subscription;
  private dates: Subscription;
  private tabs: Subscription;
  private account: Subscription;
  private limitCheck: Subscription;
  private spreadDetails: Subscription;
  private orderPlacement: Subscription;
  private language: Subscription;
  private customerListData: Subscription;
  private settlementsubscribe: Subscription;
  private ConfigValueSubscription: Subscription;
  private eventNameSubscription: Subscription;
  private validateTradeSubscription: Subscription;
  private pairmidrateSubscription: Subscription;
  settlementType: string;
  showCustomerList = false;
  customerInfo = [];
  flag: boolean;
  customerList = [{ customer: '000' }];
  CustPAN: any;
  CustomerCIF: any;
  CustomerSegment: any;
  CustomerPortfolio: any;
  DealerID: any;
  RMName: any;
  Customer: any;
  flag1 = false;
  selectedCustomerIndex = 0;
  folio1: any = '';
  folio2: any = '';
  indicativeRevenue: number;
  midRate: number;
  midRatePair: string;
  customerID: string;
  dataInput: string;
  loaderTimer = false;
  NotionalInMinTransactionLimitCCY: number;
  MinTransactionLimit: number;
  invCCY1;
  altCCY1;
  invAmt1;
  altAmt1;
  creditAccountList = [];
  billingAccountList = [];
  SettlementAccountList = [];
  spreadfrompopup: string;
  spreadInclude: string;
  uniqueKey = '';
  timerId: any;
  eventName = '';
  loginID = '';
  portfolioList: any[];
  selectedCustomerDetails: any[];
  accountList = [];
  CurrencyList = [];
  currency: any;
  portfolio: string;
  Account_Number: string;
  stpFlag = false;
  TokenID: number;
  priceProvider = '';
  EFX_NewTransactionAccountDetails: string;
  STHAccountDetails = [];
  STHAccDetaiilsSubscription: Subscription;
  TokenIDSubscription: Subscription;
  custProfileSubscription: Subscription;

  ngOnDestroy() {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
    }
    this.error = '';
    this.validationMsg = '';
    this.invCCY1 = '';
    this.altCCY1 = '';
    this.invAmt1 = 0;
    this.altAmt1 = 0;
    this.apifunction.GetDailyTransactionLimitDetails.next([]);
    this.apifunction.validateTradeBlock.next([]);
    this.apifunction.GetAccountDetails.next('');
    this.apifunction.GetFXBookDeal.next('');
    if (this.pricing !== undefined) {
      this.pricing.unsubscribe();
    }
    if (this.dates !== undefined) {
      this.dates.unsubscribe();
    }
    if (this.tabs !== undefined) {
      this.tabs.unsubscribe();
    }
    if (this.account !== undefined) {
      this.account.unsubscribe();
    }
    if (this.limitCheck !== undefined) {
      this.limitCheck.unsubscribe();
    }
    if (this.spreadDetails !== undefined) {
      this.spreadDetails.unsubscribe();
    }
    if (this.orderPlacement !== undefined) {
      this.orderPlacement.unsubscribe();
    }
    if (this.language !== undefined) {
      this.language.unsubscribe();
    }
    if (this.customerListData !== undefined) {
      this.customerListData.unsubscribe();
    }
    if (this.settlementsubscribe !== undefined) {
      this.settlementsubscribe.unsubscribe();
    }
    if (this.validateTradeSubscription !== undefined) {
      this.validateTradeSubscription.unsubscribe();
    }
    if (this.eventNameSubscription !== undefined) {
      this.eventNameSubscription.unsubscribe();
    }
    if (this.pairmidrateSubscription !== undefined) {
      this.pairmidrateSubscription.unsubscribe();
    }
    if (this.STHAccDetaiilsSubscription !== undefined) {
      this.STHAccDetaiilsSubscription.unsubscribe();
    }
    if (this.TokenIDSubscription !== undefined) {
      this.TokenIDSubscription.unsubscribe();
    }
    if (this.custProfileSubscription !== undefined) {
      this.custProfileSubscription.unsubscribe();
    }
    if (this.ConfigValueSubscription !== undefined) {
      this.ConfigValueSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.loginID = sessionStorage.getItem('Username');
    this.Customer = sessionStorage.getItem('CustomerNamemisc1');

    this.CustPAN = '';
    this.CustomerCIF = '';
    this.CustomerSegment = '';
    this.CustomerPortfolio = '';
    this.DealerID = '';
    this.RMName = '';
    this.customerID =
      this.userType.toLocaleUpperCase() === 'CLIENT'
        ? sessionStorage.getItem('CustomerID')
        : this.homeApi.CustomerId;
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.CustPAN = '';
      this.CustomerCIF = res.cif;
      this.CustomerSegment = 'BB';
      this.CustomerPortfolio = '';
      this.DealerID = res.username;
      this.loginID = res.username;
      this.RMName = sessionStorage.getItem('Username');
      this.customerID = res.id;
      this.api.GetCustProfileDetailsFromCustID(this.customerID);
    });
    this.assetURL = environment.assetURL;
    this.sec = 10;

    if (this.sec === undefined) {
      console.log('Please check for EFX_Timer data type in Common Data');
      this.sec = 0;
    }

    this.EFX_NewTransactionAccountDetails =
      this.commonfunction.EFX_NewTransactionAccountDetails;
    if (this.EFX_NewTransactionAccountDetails === undefined) {
      this.EFX_NewTransactionAccountDetails = 'YES';
      console.log('Please check for config - EFX_NewTransactionAccountDetails');
    } else if (
      this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'NO'
    ) {
      this.afs.getSTHAccountDetails();
      this.TransactionShow = false;
      this.OrderSubmission = true;
    }
    this.againprice = 0;
    const date = new Date();
    this.validationMsg = '';
    this.settlementsubscribe = this.commonfunction.settlementType.subscribe(
      (v) => {
        this.settlementType = v;
      }
    );
    this.commonfunction.spreadvalueObserver.subscribe((value) => {
      this.spreadfrompopup = value;
    });

    this.commonfunction.spreadMultiplierObserver.subscribe((value) => {
      this.spreadInclude = value;
    });
    if (this.isUserRM) {
      this.api.GetCustProfileDetailsFromCustID(this.customerID);
    }

    this.dates = this.commonfunction.DataforTradeObservar.subscribe(
      (trade: any) => {
        // console.log('Trade info : ', trade);
        if (trade) {
          this.validationMsg = '';
          this.error = '';
          this.rateDecimal = trade.rateDecimal;
          this.ccy1decimal = trade.ccy1Decimal;
          this.ccy2decimal = trade.ccy2Decimal;
          this.invccy = trade.invccy;
          this.investmentCurrency = trade.invccy;
          this.altccy = trade.altccy;
          this.alternateCurrency = trade.altccy;
          this.invamt = trade.invnotional;
          this.sellamount = trade.altNotional;
          this.FixingDate = trade.FixingDate;
          this.SpotDate = trade.SpotDate;
          this.rate = trade.bidask;
          this.bidask = parseFloat(trade.bidask).toFixed(this.rateDecimal); // Added on 19-Jun-2021 for EFX_NewTransactionAccountDetails config changes
          this.spotrate = parseFloat(trade.spotRate).toFixed(this.rateDecimal); // Added on 19-Jun-2021 for EFX_NewTransactionAccountDetails config changes
          this.ValueDate = trade.ValueDate;
          this.altamt = trade.altNotional;
          this.buysell = trade.buysell;
          this.dataInput = trade.datainput;
          this.swapPointsSell = trade.swappoints;
          this.QuoteIDSell = trade.quoteID;
          this.ExternalQuoteIDSell = trade.externalQuoteID;
          this.PPSell = trade.ppID;
          this.priceQuoteRefSell = trade.priceQuoteRef;
          this.custrate = trade.custrate;
          this.custRevenueSell = trade.custrevenue;
          this.index = trade.index;
          this.RMspread = parseFloat(trade.spread).toFixed(this.rateDecimal);
          if (
            this.userType.toLocaleUpperCase() === 'CLIENT' ||
            this.userType.toLocaleUpperCase() === 'RM'
          ) {
            const custData = trade.customerData.split(','); // this.CustomerCIF+','+this.CustomerSegment+','+ this.RMName+','+this.CustomerID+','+this.DealerID+','+this.customerName
            this.CustomerCIF = custData[0];
            this.CustomerSegment = custData[1];
            this.RMName = custData[2];
            this.customerID = custData[3];
            this.DealerID = custData[4];
            this.Customer = custData[5];
            setTimeout(() => {
              this.setDefaultCustomer.next(this.Customer);
            }, 1000);
          }
          if (this.buysell === 'YOU SELL') {
            this.direction1 = 'Sell';
            this.direction2 = 'Buy';
          } else if (this.buysell === 'YOU BUY') {
            this.direction1 = 'Buy';
            this.direction2 = 'Sell';
          }
          // Commented by Nilam V on 22-Jun-2021 after adding Spreaded rate on Dashboard
          // calling spread service only if EFX_NewTransactionAccountDetails config is NO
          if (
            this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'NO'
          ) {
            //   if (this.buysell === 'YOU SELL') {
            //     this.apifunction.getSpread(
            //       this.invccy+' - '+this.altccy,
            //       this.CustomerSegment,
            //     );
            //   } else if (this.buysell === 'YOU BUY') {
            //     this.apifunction.getSpread(
            //       this.altccy+' - '+this.invccy,
            //       this.CustomerSegment,
            //     );
            //   }
            this.setTimer();
          }

          // End

          this.optiontype = trade.OptionType;
          if (this.optiontype === 'Forward') {
            this.forwardflag = true;
            if (this.lang === 'en') {
              this.OrderType = 'Forward';
            } else {
              this.OrderType = 'Προς τα εμπρός';
            }
          }

          this.Type = trade.tenorcode;
          if (this.lang === 'en') {
            if (this.Type === 'TOD') {
              this.OrderType = 'Direct (T+0)';
            } else if (this.Type === 'TOM') {
              this.OrderType = 'High Priority (T+1)';
            } else if (this.Type === 'SPOT') {
              this.OrderType = 'Normal Priority (T+2)';
            } else {
              this.OrderType = 'Forward';
            }
          } else {
            if (this.Type === 'TOD') {
              this.OrderType = 'απευθείας Προτεραιότητα (T+0)';
            } else if (this.Type === 'TOM') {
              this.OrderType = 'Υψηλός Προτεραιότητα (T+1)';
            } else if (this.Type === 'SPOT') {
              this.OrderType = 'Κανονικός Προτεραιότητα (T+2)';
            } else {
              this.OrderType = 'Προς τα εμπρός';
            }
          }

          this.highlightFlag = trade.highlightinput;
          this.invCCY1 = this.invccy;
          this.altCCY1 = this.altccy;
          this.invAmt1 = this.invamt;
          this.altAmt1 = this.altamt;
          if (this.buysell === 'YOU BUY') {
            let temp = this.invCCY1;
            this.invCCY1 = this.altCCY1;
            this.altCCY1 = temp;
            temp = this.invAmt1;
            this.invAmt1 = this.altAmt1;
            this.altAmt1 = temp;
          }
          this.ref.detectChanges();
          // console.log('Inv : ', this.invAmt1, ' Alt ; ', this.altAmt1);

          // console.log(this.highlightFlag, this.invamt, this.sellamount, this.invccy, this.altccy);
          // console.log('1 Inv : ', this.invAmt1, ' Alt ; ', this.altAmt1);
          if (this.highlightFlag === 'alter') {
            // console.log(this.buysell);
            if (this.buysell === 'YOU SELL') {
              let temp;
              temp = this.invamt;
              this.invamt = this.sellamount;
              this.sellamount = temp;
              let tempccy;
              tempccy = this.invccy;
              this.invccy = this.altccy;
              this.altccy = tempccy;
            }
          } else if (this.highlightFlag === 'invest') {
            if (this.buysell === 'YOU BUY') {
              let temp;
              temp = this.invamt;
              this.invamt = this.sellamount;
              this.sellamount = temp;
              let tempccy;
              tempccy = this.invccy;
              this.invccy = this.altccy;
              this.altccy = tempccy;
            }
          }
          if (this.buysell === 'YOU SELL') {
            if (this.altccy !== 'USD') {
            }
          } else {
            if (this.invccy !== 'USD') {
            }
          }
          //Changes by MohanP | 11Feb22
          this.workflowApi
            .GetPortfoliosFromCusID(this.customerID, '')
            .subscribe((res) => {
              if (res) {
                if (res.DB_GetPortfoliosResult.length > 0) {
                  // this.portfolio1 = res.DB_GetPortfoliosResult.sort((a, b) => {
                  //   return a.PortfolioName - b.PortfolioName;
                  // });
                  this.portfolio1 = res.DB_GetPortfoliosResult.sort((a, b) =>
                    a.PortfolioName > b.PortfolioName ? 1 : -1
                  );
                  // this.portfolio1 = res.DB_GetPortfoliosResult;
                  this.folio1 = this.portfolio1[0].FacDesc;
                  console.log(this.portfolio1);
                }
              }
            });
        }
        // console.log('2Inv : ', this.invAmt1, ' Alt ; ', this.altAmt1);
      }
    );

    this.customerListData = this.apifunction.CustomerListObserver.subscribe(
      (data) => {
        if (data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            this.customerList[i] = { customer: data[i].CustomerName };
            this.customerInfo[i] = data[i];
          }
          // this.Customer = this.customerList[0]["customer"];
          // this.customerID = this.customerList[0]["CustomerID"];
          // this.CustomerSegment = this.customerList[0]["AH_Customer_Segment"];
          // this.setCustomer(this.Customer, 0);

          // this.setCustomer("CORPORATE SPECIAL CUSTOMER", 0);
          // console.log(data);
        }
      }
    );
    this.tabs = this.commonfunction.tabnameobservar.subscribe((show) => {
      this.show = show;
      if (this.show === 'TransactionShow') {
        this.TransactionShow = true;
        this.ConfirmationWindow = false;
        this.OrderSubmission = false;
        this.apifunction.GetDailyTransactionLimitDetails.next([]);
      }
    });

    this.transationTime = date.getDate().toString();

    this.limitCheck =
      this.apifunction.GetDailyTransactionLimitDetailsObserver.subscribe(
        (limitarray: any) => {
          if (limitarray.length !== 0) {
            // console.log(limitarray[0]['TransactionLimit'], limitarray[0]['NotionalInTransactionLimitCCY']);
            // this.TransactionLimitInUSD = limitarray[0]['TransactionLimit'];
            // this.invNotionalINUSD = limitarray[0]['NotionalInTransactionLimitCCY'];
            try {
              this.flag1 = false;
              if (limitarray.length === undefined) {
                this.validationMsg = '';
                this.SessionID = this.GenerateSessionID();

                this.streamCount = 0;
                this.callQuoteService();
              } else {
                this.DailyLimitAmt =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0].DailyLimitAmt;
                this.TotalDailyLimitConsumed =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0].TotalDailyLimitConsumed;
                this.MinTransactionLimit =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0].MinTransactionLimit;
                this.NotionalInMinTransactionLimitCCY =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0].NotionalInMinTransactionLimitCCY;
                const NotionalCCy =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0]
                    .MinTransactionLimitCCY;
                const DailyCCY =
                  limitarray.Get_Daily_And_Transaction_LimitResult[0]
                    .DailyLimitCCY;
                // if (this.invNotionalINUSD > this.TransactionLimitInUSD) {
                //   // max per transaction
                //   this.validationMsg = 'Your Transaction limit is ' + this.TransactionLimitInUSD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '. Please enter notional less than ' + this.TransactionLimitInUSD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                //   this.Load = false;
                //   if (this.highlightFlag === 'invest') {
                //     this.amt1flag = true;
                //     this.amt2flag = false;
                //   } else {
                //     this.amt1flag = false;
                //     this.amt2flag = true;
                //   }

                // }
                this.validationMsg = '';
                if (
                  this.NotionalInMinTransactionLimitCCY <
                  this.MinTransactionLimit
                ) {
                  this.validationMsg =
                    'Your Min Transaction limit is ' +
                    this.MinTransactionLimit.toString().replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    ) +
                    ' ' +
                    NotionalCCy +
                    '. Please enter notional more than ' +
                    this.MinTransactionLimit.toString().replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    ) +
                    ' ' +
                    NotionalCCy +
                    '.';
                  this.Load = false;
                } else if (this.TotalDailyLimitConsumed > this.DailyLimitAmt) {
                  // Max daily limit consumed check
                  // per transaction-each transaction-min-not included

                  this.validationMsg =
                    'Daily Transaction limit is ' +
                    this.DailyLimitAmt.toString().replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    ) +
                    ' ' +
                    DailyCCY +
                    ' and exceeded by ' +
                    (this.TotalDailyLimitConsumed - this.DailyLimitAmt)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                    ' ' +
                    DailyCCY +
                    '.';
                  this.Load = false;
                } else {
                  this.validationMsg = '';
                  this.SessionID = this.GenerateSessionID();

                  this.streamCount = 0;
                  // console.log(this.buysell, this.investmentCurrency, this.alternateCurrency);
                  // if (this.buysell === 'YOU SELL') {
                  //   console.log(this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.alternateCurrency + " - " + this.investmentCurrency, 'Buy', this.invamt.replace(/,/g, ''), this.sellamount.replace(/,/g, ''), this.RMspread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, this.SessionID, 999, 1, this.direction1);
                  //   this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.alternateCurrency + " - " + this.investmentCurrency, 'Buy', this.invamt.replace(/,/g, ''), this.sellamount.replace(/,/g, ''), this.RMspread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, this.SessionID, 999, 1, this.direction1);
                  // } else {
                  //   this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.investmentCurrency + " - " + this.alternateCurrency, 'Buy', this.invamt.replace(/,/g, ''), this.sellamount.replace(/,/g, ''), this.RMspread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, this.SessionID, 999, 1, this.direction1);
                  // }
                  this.callQuoteService();
                }
              }
            } catch (ex) {
              // console.log(ex);
            }
          }
        }
      );

    this.spreadDetails = this.apifunction.GetSpreadDetailsObserver.subscribe(
      (spread: any) => {
        if (spread.length > 0) {
          // if (this.TransactionShow) {
          try {
            // console.log(this.buysell);
            if (this.buysell === 'YOU SELL') {
              // console.log(spread[0]["Bid"], Number(this.bidask), this.RMspread)
              this.RMspread = spread[0].Bid;
              if (this.spreadInclude === 'on') {
                if (parseFloat(this.spreadfrompopup) > 0) {
                  this.RMspread = (
                    parseFloat(this.spreadfrompopup) * this.RMspread
                  ).toFixed(4);
                }
              }
              this.custrate = (
                Number(this.bidask) - Number(this.RMspread)
              ).toFixed(this.rateDecimal);
              this.custRevenueSell =
                parseFloat(this.invamt.replace(/,/g, '')) * this.RMspread;
            } else if (this.buysell === 'YOU BUY') {
              this.RMspread = spread[0].Ask;
              if (this.spreadInclude === 'on') {
                if (parseFloat(this.spreadfrompopup) > 0) {
                  this.RMspread = (
                    parseFloat(this.spreadfrompopup) * this.RMspread
                  ).toFixed(4);
                }
              }

              this.custrate = (
                Number(this.bidask) + Number(this.RMspread)
              ).toFixed(this.rateDecimal);

              this.custRevenueSell =
                parseFloat(this.altAmt1.replace(/,/g, '')) * this.RMspread;
            }

            // console.log(this.invAmt1, this.altAmt1);
            // this.custRevenueSell = parseFloat(this.invamt.replace(/,/g, '')) * this.RMspread;
            //  this.TransactionShow = false;
            //     this.Load = false;

            //     this.OrderSubmission = true;
            this.loaderTimer = false;
            this.calculateIndicativeRevenue();
            this.calculateNotional1();
          } catch (ex) {
            // console.log(ex);
          }
          // }
        }
        //  else {
        //   this.RMspread = 0;
        // }
      }
    );

    this.orderPlacement = this.apifunction.GetFXBookDealObserver.subscribe(
      (deal: any) => {
        // console.log(deal);
        if (this.TransactionShow === false) {
          if (deal !== '') {
            if (deal.FinIQResponseHeader.Status === 'Succeed') {
              if (deal.TradeBookingResponse.TradeReferenceID !== null) {
                this.apifunction.updateDailyLimit(
                  this.customerID,
                  this.invCCY1,
                  this.invAmt1.replace(/,/g, '')
                );
                this.transactionId = deal.TradeBookingResponse.TradeReferenceID;
                this.transactionDateTime =
                  deal.TradeBookingResponse.BookingDateTime;
                this.loader = false;
                this.Load = false;
                this.ConfirmationWindow = true;
                this.OrderSubmission = false;
                this.TransactionShow = false;
                this.apifunction.GetDailyTransactionLimitDetails.next([]);
                this.apifunction.getDataFromDBFunctions(
                  this.transactionId,
                  'Get_TokenID_From_Deal_Id'
                );

                // this.show === 1;
              }
            } else if (deal.FinIQResponseHeader.Status === 'Failed') {
              // this.error = deal.TradeBookingResponse.ResponseDetails.Description;
              this.error = 'Failed to book a deal.';
              this.loader = false;
              this.Load = false;
            }
          }
        }
      }
    );

    this.pricing = this.apifunction.FXOBestPriceTransactionObservar.subscribe(
      (res: any) => {
        if (res.length !== 0) {
          //
          if (res.body.FinIQResponseHeader.Status === 'Succeed') {
            if (res.ID === 999) {
              // console.log(res);

              this.priceQuoteRefSell =
                res.body.PriceEnquiryResponse.PriceQuoteRef;
              const QuoteDetails =
                res.body.PriceEnquiryResponse.ExternalPriceResponse
                  .PriceProviderResponse;

              // console.log(QuoteDetails[0]['NearForwardRate']);
              this.bidask = QuoteDetails[0].NearForwardRate.toFixed(
                this.rateDecimal
              );
              this.spotrate = QuoteDetails[0].NearSpotRate.toFixed(
                this.rateDecimal
              );
              this.forwardPoint = QuoteDetails[0].NearSwapPoint.toFixed(
                this.rateDecimal
              );
              this.swapPointsSell = QuoteDetails[0].NearSwapPoint;
              this.QuoteIDSell = QuoteDetails[0].QuoteId;
              this.ExternalQuoteIDSell = QuoteDetails[0].ExternalQuoteID;
              this.PPSell = QuoteDetails[0].PriceProviderId;

              // this.TransactionShow = false;
              // this.Load = false;

              // this.OrderSubmission = true;
              if (this.buysell === 'YOU SELL') {
                this.apifunction.getSpread(
                  this.invccy + ' - ' + this.altccy,
                  this.CustomerSegment,
                  999
                );
              } else if (this.buysell === 'YOU BUY') {
                this.apifunction.getSpread(
                  this.altccy + ' + ' + this.invccy,
                  this.CustomerSegment,
                  999
                );
              }
            }
          } else if (res.body.FinIQResponseHeader.Status === 'Failed') {
            if (res.ID === 999) {
              if (this.againprice < 2) {
                const msg =
                  res.body.PriceEnquiryResponse.ResponseDetails.Description;
                if (msg.indexOf('Product Tenor') > 0) {
                  this.validationMsg = msg;
                } else {
                  let ccy1Amount, ccy2Amount;
                  if (this.buysell === 'YOU SELL') {
                    if (this.dataInput === 'AMOUNT1') {
                      ccy1Amount = 0;
                      ccy2Amount = parseFloat(this.invAmt1.replace(/,/g, ''));
                    } else {
                      ccy1Amount = parseFloat(this.altAmt1.replace(/,/g, ''));
                      ccy2Amount = 0;
                    }
                    // console.log(this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.altCCY1 + " - " + this.invCCY1, 'Buy', ccy1Amount, ccy2Amount, this.RMspread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, this.SessionID, 999, 1, this.direction1);
                    this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                      this.optiontype === 'Spot' ? 'FXC' : 'FXW',
                      this.altCCY1 + ' - ' + this.invCCY1,
                      'Buy',
                      ccy1Amount,
                      ccy2Amount,
                      this.RMspread,
                      this.Type,
                      false,
                      'fx',
                      this.ValueDate,
                      this.FixingDate,
                      this.SessionID,
                      999,
                      1,
                      this.direction1,
                      this.uniqueKey,
                      this.CustomerCIF,
                      this.Customer,
                      this.CustomerSegment,
                      this.RMName,
                      this.customerID,
                      this.DealerID,
                      this.BillingAccount,
                      this.CreditAccount,
                      this.priceProvider
                    );
                  } else {
                    if (this.dataInput === 'AMOUNT1') {
                      ccy1Amount = parseFloat(this.altAmt1.replace(/,/g, ''));
                      ccy2Amount = 0;
                    } else {
                      ccy1Amount = 0;
                      ccy2Amount = parseFloat(this.invAmt1.replace(/,/g, ''));
                    }

                    // console.log(this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.altCCY1 + " - " + this.invCCY1, 'Buy', ccy1Amount, ccy2Amount, this.RMspread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, this.SessionID, 999, 1, this.direction1);
                    this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                      this.optiontype === 'Spot' ? 'FXC' : 'FXW',
                      this.altCCY1 + ' - ' + this.invCCY1,
                      'Buy',
                      ccy1Amount,
                      ccy2Amount,
                      this.RMspread,
                      this.Type,
                      false,
                      'fx',
                      this.ValueDate,
                      this.FixingDate,
                      this.SessionID,
                      999,
                      1,
                      this.direction1,
                      this.uniqueKey,
                      this.CustomerCIF,
                      this.Customer,
                      this.CustomerSegment,
                      this.RMName,
                      this.customerID,
                      this.DealerID,
                      this.BillingAccount,
                      this.CreditAccount,
                      this.priceProvider
                    );
                  }

                  this.againprice++;
                }
              }
            }
          }
        }
      }
    );

    this.language = this.commonfunction.langObserver.subscribe((value) => {
      if (value !== '') {
        localStorage.setItem('locale', value);
        // this.translate.use(value);
        this.lang = value;
        if (this.lang === 'en') {
          if (this.Type === 'TOD') {
            this.OrderType = 'Direct (T+0)';
          } else if (this.Type === 'TOM') {
            this.OrderType = 'High Priority (T+1)';
          } else if (this.Type === 'SPOT') {
            this.OrderType = 'Normal Priority (T+2)';
          } else {
            this.OrderType = 'Forward';
          }
        } else {
          if (this.Type === 'TOD') {
            this.OrderType = 'απευθείας Προτεραιότητα (T+0)';
          } else if (this.Type === 'TOM') {
            this.OrderType = 'Υψηλός Προτεραιότητα (T+1)';
          } else if (this.Type === 'SPOT') {
            this.OrderType = 'Κανονικός Προτεραιότητα (T+2)';
          } else {
            this.OrderType = 'Προς τα εμπρός';
          }
        }
      }
    });
    this.pairmidrateSubscription =
      this.apifunction.PairMidRateObserver.subscribe((res) => {
        if (res.length > 0) {
          this.midRate = res[0].body.MidRate;
          // this.calculateIndicativeRevenue();
        }
      });

    this.validateTradeSubscription =
      this.apifunction.validateTradeBlockObserver.subscribe((res: any) => {
        if (res) {
          try {
            this.validationMsg = '';
            if (res.length !== 0) {
              const passfailres: any = res.body.checkTransactionLimitResult;
              if (this.timerId !== undefined) {
                clearTimeout(this.timerId);
              }
              if (passfailres.length > 0) {
                // Max transaction limit check
                let resdata_max = passfailres[0].TransactionLimit;

                // Daily transaction limit check
                let resdata_daily = passfailres[0].DailyLimit;

                if (resdata_max === 'Pass' && resdata_daily === 'Pass') {
                  this.placeOrder();
                  this.apifunction.validateTradeBlock.next([]);
                } else {
                  if (resdata_max === 'Fail') {
                    this.validationMsg =
                      'You are exceeding maximum transaction limit.';
                  } else if (resdata_daily === 'Fail') {
                    this.validationMsg =
                      'You are exceeding daily transaction limit.';
                  }

                  this.loader = false;
                  this.apifunction.validateTradeBlock.next([]);
                  this.sec = 0;
                }
              } else {
                this.placeOrder();
                this.apifunction.validateTradeBlock.next([]);
              }
            }
          } catch (ex) {
            // console.log(ex);
          }
        }
      });

    this.eventNameSubscription = this.apifunction.eventNameObserver.subscribe(
      (res: any) => {
        if (res) {
          try {
            const body = res.body.getEventNameResult;
            if (body.length > 0) {
              this.eventName = body.Timegroup;
              // console.log('Event Name : ' + this.eventName);
              if (this.eventName === '') {
                this.eventName = 'All Time';
              }
            } else {
              this.eventName = 'All Time';
            }
          } catch (ex) {
            // console.log(ex);
          }
        }
      }
    );
    this.ConfigValueSubscription = this.afs.configValueObserver.subscribe(
      (data) => {
        if (data.length > 0) {
          const res = data[0].body.getConfigValueResult;
          if (res[0].Setting_Name === 'CSP_IsStraightToProcess') {
            this.stpFlag =
              res[0].Default_Value.toString().toLowerCase() === 'yes'
                ? true
                : false;
            console.log('STP : ', this.stpFlag);
          }
        }
      }
    );
    // this.afs.FXEmailObserver.subscribe(data => {
    //   if (data) {
    //     console.log('Email sent- ' + data);
    //   }
    // });
    // this.afs.TokenIDObserver.subscribe(res => {
    //   if (res !== '') {
    //     console.log(res['DocumentElement']['DUMMY'][0]['Column1'][0]);
    //     this.TokenID = res['DocumentElement']['DUMMY'][0]['Column1'][0];
    //     this.apifunction.sendFXDealPlacementEmail(this.transactionId, this.TokenID);
    //   }
    // });
    this.TokenIDSubscription = this.afs.TokenIDObserver.subscribe((res) => {
      if (res) {
        try {
          if (res.dbfunction === 'Func_PP_PPM_PC') {
            const PPArr = res.result.DocumentElement.DUMMY;
            PPArr.map((record) => {
              this.priceProvider += record.PP_CODE[0] + ',';
            });
            this.priceProvider = this.priceProvider.slice(0, -1);
          } else if (res.dbfunction === 'Get_TokenID_From_Deal_Id') {
            console.log(res.result.DocumentElement.DUMMY[0].Column1[0]);
            this.TokenID = res.result.DocumentElement.DUMMY[0].Column1[0];
            this.apifunction.sendFXDealPlacementEmail(
              this.transactionId,
              this.TokenID
            );
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    });
    this.STHAccDetaiilsSubscription = this.afs.STHAccountDetailsobs.subscribe(
      (res) => {
        if (res.length > 0) {
          console.log(res);
          this.STHAccountDetails = JSON.parse(res[0].GetAccountDetailsResult);
          this.CreditAccount = this.STHAccountDetails[0].AccountNo;
        }
      }
    );
  }
  calculateIndicativeRevenue() {
    try {
      if (this.buysell === 'YOU SELL') {
        if (this.altccy !== 'USD') {
          if (this.midRatePair.indexOf('USD') === 0) {
            this.indicativeRevenue = this.custRevenueSell / this.midRate;
          } else if (this.midRatePair.indexOf('USD') === 6) {
            this.indicativeRevenue = this.midRate * this.custRevenueSell;
          }
        } else {
          this.indicativeRevenue = this.custRevenueSell;
        }
      } else {
        if (this.invccy !== 'USD') {
          if (this.midRatePair.indexOf('USD') === 0) {
            this.indicativeRevenue = this.custRevenueSell / this.midRate;
          } else if (this.midRatePair.indexOf('USD') === 6) {
            this.indicativeRevenue = this.midRate * this.custRevenueSell;
          }
        } else {
          this.indicativeRevenue = this.custRevenueSell;
        }
      }

      // console.log('Indicative Revenue is : ' + this.indicativeRevenue);
    } catch (ex) {}
  }
  GenerateSessionID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  blockTradeValidate() {
    try {
      if (this.custrate === 0) {
        this.error = 'Customer rate is 0. Cannot execute trade.';
        this.TimeUP = true;
      } else {
        this.validate_uniqueID = '_' + Math.random().toString(36).substr(2, 9);
        this.apifunction.CheckTransactionLimit(
          parseFloat(this.invAmt1.replace(/,/g, '')),
          this.invCCY1,
          this.customerID,
          this.validate_uniqueID
        );
      }

      // console.log('Limit check', this.invAmt1.replace(/,/g, ''), this.invCCY1, this.customerID);
    } catch (ex) {
      // console.log(ex);
    }
  }

  placeOrder() {
    this.error = '';
    this.Load = false;
    if (this.Customer === '') {
      this.isMessage = true;
      this.error = 'Please select customer';
    } else if (
      this.CreditAccount === '' &&
      this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'YES'
    ) {
      this.isMessage = true;
      this.error = 'From Account not available';
    } else if (
      this.BillingAccount === '' &&
      this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'YES'
    ) {
      this.isMessage = true;
      this.error = 'To Account not available';
      // console.log(this.loader, this.Load);
    } else if (this.folio1 === '') {
      this.isMessage = true;
      this.error = 'Portfolio not available';

      // console.log(this.loader, this.Load);
    } else {
      this.isMessage = true;
      this.loader = true;
      this.error = '';
      // console.log(this.priceQuoteRefSell, this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.invccy + ' - ' + this.altccy, 'Buy', this.commonfunction.UnformatNumberFromFloat(this.invamt),
      //   this.commonfunction.UnformatNumberFromFloat(this.altamt), this.bidask, this.custrate, this.FixingDate, this.ValueDate, this.Type, this.RMspread, 0 + '',
      //   this.spotrate, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, this.custRevenueSell.toString(), 'FX', '6000123', 'AMOUNT2');

      let date = this.ValueDate.replace('-', '');
      date = date.replace('-', '');
      // console.log(this.priceQuoteRefSell, this.optiontype === 'Spot' ? 'FXC' : 'FXW', this.altccy + ' - ' + this.invccy, 'Buy', this.commonfunction.UnformatNumberFromFloat(this.invamt),
      //   this.commonfunction.UnformatNumberFromFloat(this.altamt), this.bidask, this.custrate, this.FixingDate, this.ValueDate, this.optiontype === 'Spot' ? this.Type : date, this.RMspread, 0 + '',
      //   this.spotrate, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, this.custRevenueSell.toString(), 'FX', '6000123', this.dataInput, this.Type, this.Customer, this.CustomerCIF, this.RMName, this.CustomerSegment, this.CustPAN, this.CreditAccount, this.BillingAccount, this.indicativeRevenue);
      let ccy1amt, ccy2amt;

      if (this.buysell === 'YOU SELL') {
        // console.log(this.altccy + ' - ' + this.invccy);
        if (this.dataInput === 'AMOUNT1') {
          ccy1amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.altAmt1)
          );
          ccy2amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.invAmt1)
          );
        } else {
          ccy1amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.altAmt1)
          );
          ccy2amt = parseFloat(
            this.commonfunction.UnformatNumberFromFloat(this.invAmt1)
          );
        }
        this.afs.BookOrderforSF(
          this.priceQuoteRefSell,
          this.optiontype === 'Spot' ? 'FXC' : 'FXW',
          this.altCCY1 + ' - ' + this.invCCY1,
          'Buy',
          ccy1amt,
          ccy2amt,
          this.bidask,
          this.custrate,
          this.FixingDate,
          this.ValueDate,
          this.optiontype === 'Spot' ? this.Type : date,
          this.RMspread,
          0 + '',
          this.spotrate,
          this.swapPointsSell,
          this.QuoteIDSell,
          this.ExternalQuoteIDSell,
          this.PPSell,
          this.SpotDate,
          this.custRevenueSell.toString(),
          'FX',
          '6000123',
          this.dataInput,
          this.Type,
          this.Customer,
          this.CustomerCIF,
          this.RMName,
          this.CustomerSegment,
          this.customerID,
          this.CreditAccount,
          this.BillingAccount,
          this.indicativeRevenue,
          this.stpFlag,
          this.DealerID,
          this.folio1
        );
      } else if (this.buysell === 'YOU BUY') {
        if (this.dataInput === 'AMOUNT1') {
          ccy1amt = parseFloat(this.altAmt1.replace(/,/g, ''));
          ccy2amt = parseFloat(this.invAmt1.replace(/,/g, ''));
        } else {
          ccy1amt = parseFloat(this.altAmt1.replace(/,/g, ''));
          ccy2amt = parseFloat(this.invAmt1.replace(/,/g, ''));
        }

        this.afs.BookOrderforSF(
          this.priceQuoteRefSell,
          this.optiontype === 'Spot' ? 'FXC' : 'FXW',
          this.altCCY1 + ' - ' + this.invCCY1,
          'Buy',
          ccy1amt,
          ccy2amt,
          this.bidask,
          this.custrate,
          this.FixingDate,
          this.ValueDate,
          this.optiontype === 'Spot' ? this.Type : date,
          this.RMspread,
          0 + '',
          this.spotrate,
          this.swapPointsSell,
          this.QuoteIDSell,
          this.ExternalQuoteIDSell,
          this.PPSell,
          this.SpotDate,
          this.custRevenueSell.toString(),
          'FX',
          '6000123',
          this.dataInput,
          this.Type,
          this.Customer,
          this.CustomerCIF,
          this.RMName,
          this.CustomerSegment,
          this.customerID,
          this.CreditAccount,
          this.BillingAccount,
          this.indicativeRevenue,
          this.stpFlag,
          this.DealerID,
          this.folio1
        );
      }
    }
  }

  updateCustomerPortfolioDetails() {
    this.accountList = [];
    this.CurrencyList = [];
    console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.PortfolioName === this.portfolio;
    });
    temp.forEach((element) => {
      this.accountList.push(element.AccountNo);
      this.CurrencyList.push(element.SICurrency);
    });
    this.Account_Number = this.accountList[0];
    // this.currency = this.data.Ccy = this.CurrencyList[0];
    this.updateCcy();
    // this.ChangeSelectedportfolio();
  }

  updateCcy() {
    console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.AccountNo === this.Account_Number;
    });
    if (temp.length) {
      this.currency = temp[0].SICurrency;
    }
  }

  getCustomerDetails(res) {
    this.error = '';
    if (res.length > 0) {
      this.portfolioList = [];
      this.selectedCustomerDetails = res;
      this.billingAccountList = [];
      this.creditAccountList = [];
      const map = new Map();
      for (const item of res) {
        // console.log(item);
        if (item.SICurrency === this.invCCY1) {
          this.billingAccountList.push(item.AccountNo);
        }
        if (item.SICurrency === this.altCCY1) {
          this.creditAccountList.push(item.AccountNo);
        }
        if (!map.has(item.PortfolioName)) {
          map.set(item.PortfolioName, true); // set any value to Map
          this.portfolioList.push(item.PortfolioName);
        }
      }
      this.BillingAccount =
        this.billingAccountList.length > 0 ? this.billingAccountList[0] : '';
      // console.log(this.creditAccountList);
      this.CreditAccount =
        this.creditAccountList.length > 0 ? this.creditAccountList[0] : '';
      this.validationMsg = '';
      if (
        this.billingAccountList.length === 0 ||
        this.creditAccountList.length === 0
      ) {
        this.isMessage = true;
        this.validationMsg = 'Account not available for selected currency';
        // console.log(this.validationMsg);
      }
      // this.customerID = this.Customer.CustomerID;
      this.updateCustomerPortfolioDetails();
    }
  }

  getSelectedCustomer(customer) {
    if (customer !== undefined) {
      this.Customer = customer.CustomerName;
      this.customerID = customer.CustomerID;

      for (let i = 0; i < this.customerInfo.length; i++) {
        if (this.customerInfo[i].CustomerName === customer.CustomerName) {
          this.CustPAN = this.customerInfo[i].CustomerID;
          this.CustomerCIF = this.customerInfo[i].AH_CIF_No;
          this.CustomerSegment = this.customerInfo[i].AH_Customer_Segment;
          this.RMName = this.customerInfo[i].RelManager;
          this.customerID = this.customerInfo[i].CustomerID;
          this.DealerID = this.customerInfo[i].DealerID;
          break;
        }
      }
      // if (this.CustomerCIF === "") {
      //   this.validationMsg = "Customer CIF No. is not available for selected customer."
      //   this.Load = false;
      // }
      this.apifunction.getEventName(this.CustomerSegment);
    }
  }

  getDate(event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    const selecteddate = event.value;
    const date =
      selecteddate.getDate() +
      '-' +
      this.months[selecteddate.getMonth() + 1] +
      '-' +
      selecteddate.getFullYear();
    // console.log(date);
    this.ValueDate = date;
    this.FixingDate = date;

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
  }

  calculateNotional1() {
    if (this.buysell === 'YOU SELL') {
      if (this.highlightFlag === 'invest') {
        this.altAmt1 = (
          parseFloat(this.invAmt1.replace(/,/g, '')) * parseFloat(this.custrate)
        )
          .toFixed(this.ccy2decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        this.invAmt1 = (
          parseFloat(this.altAmt1.replace(/,/g, '')) / parseFloat(this.custrate)
        )
          .toFixed(this.ccy2decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else {
      if (this.highlightFlag === 'invest') {
        this.invAmt1 = (
          parseFloat(this.altAmt1.replace(/,/g, '')) * parseFloat(this.custrate)
        )
          .toFixed(this.ccy1decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        this.altAmt1 = (
          parseFloat(this.invAmt1.replace(/,/g, '')) / parseFloat(this.custrate)
        )
          .toFixed(this.ccy1decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }

    this.TransactionShow = false;
    this.Load = false;

    this.OrderSubmission = true;
    this.setTimer();
  }
  calculateNotional() {
    // console.log((parseFloat(this.invamt.replace(/,/g, ''))), parseFloat(this.custrate));
    if (this.buysell === 'YOU SELL') {
      if (this.highlightFlag === 'invest') {
        // console.log();
        this.altamt = (
          parseFloat(this.invamt.replace(/,/g, '')) * parseFloat(this.custrate)
        )
          .toFixed(this.ccy2decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      if (this.highlightFlag === 'alter') {
        this.altamt = (
          parseFloat(this.invamt.replace(/,/g, '')) / parseFloat(this.custrate)
        )
          .toFixed(this.ccy2decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else if (this.buysell === 'YOU BUY') {
      if (this.highlightFlag === 'invest') {
        this.invamt = this.sellamount;
        this.altamt = (
          parseFloat(this.sellamount.replace(/,/g, '')) *
          parseFloat(this.custrate)
        )
          .toFixed(this.ccy1decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let temp;
        temp = this.invamt;
        this.invamt = this.altamt;
        this.altamt = temp;
      } else if (this.highlightFlag === 'alter') {
        this.invamt = this.sellamount;
        this.altamt = (
          parseFloat(this.sellamount.replace(/,/g, '')) /
          parseFloat(this.custrate)
        )
          .toFixed(this.ccy1decimal)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let temp;
        temp = this.invamt;
        this.invamt = this.altamt;
        this.altamt = temp;
      }
    }
    // console.log(this.invamt, this.altamt);
    // this.altamt = (this.altamt.toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.TransactionShow = false;
    this.Load = false;

    this.OrderSubmission = true;
    this.setTimer();
    // console.log(this.TransactionShow, this.OrderSubmission);
    // this.startCountdown(10);
  }

  CallRates() {
    // console.log(this.invccy, this.invamt);
    this.Load = false;
    if (
      (this.BillingAccount === '' || this.BillingAccount === undefined) &&
      this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'YES'
    ) {
      this.validationMsg = 'From Account not available.';
    } else if (
      (this.CreditAccount === '' || this.CreditAccount === undefined) &&
      this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'YES'
    ) {
      this.validationMsg = 'To Account not available.';
    } else if (this.Customer === '') {
      this.validationMsg = 'Please select Customer.';
    } else {
      this.Load = true;
      this.validationMsg = '';
    }
    if (this.validationMsg === '') {
      if (this.flag1 === false) {
        this.flag1 = true;
        this.loaderTimer = true;
        this.Load = true;
        // Changed by Nilam V on 23-Jun-2021
        this.TransactionShow = false;
        this.OrderSubmission = true;
        this.setTimer();
        // this.apifunction.getDailyTransactionLimit(
        //   this.invccy,
        //   this.invamt.replace(/,/g, ''),
        //   this.customerID
        // );
      }
    }
  }
  // Remaining
  callQuoteService() {
    let ccy1Amount, ccy2Amount;
    this.SessionID = this.GenerateSessionID();
    this.uniqueKey = '_' + Math.random().toString(36).substr(2, 9);
    if (this.buysell === 'YOU SELL') {
      if (this.dataInput === 'AMOUNT1') {
        ccy1Amount = 0;
        ccy2Amount = parseFloat(this.invAmt1.replace(/,/g, ''));
      } else {
        ccy1Amount = parseFloat(this.altAmt1.replace(/,/g, ''));
        ccy2Amount = 0;
      }
      this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
        this.optiontype === 'Spot' ? 'FXC' : 'FXW',
        this.altCCY1 + ' - ' + this.invCCY1,
        'Buy',
        ccy1Amount,
        ccy2Amount,
        this.RMspread,
        this.Type,
        false,
        'fx',
        this.ValueDate,
        this.FixingDate,
        this.SessionID,
        999,
        1,
        this.direction1,
        this.uniqueKey,
        this.CustomerCIF,
        this.Customer,
        this.CustomerSegment,
        this.RMName,
        this.customerID,
        this.DealerID,
        this.BillingAccount,
        this.CreditAccount,
        this.priceProvider
      );
    } else {
      if (this.dataInput === 'AMOUNT1') {
        ccy1Amount = parseFloat(this.altAmt1.replace(/,/g, ''));
        ccy2Amount = 0;
      } else {
        ccy1Amount = 0;
        ccy2Amount = parseFloat(this.invAmt1.replace(/,/g, ''));
      }
      this.apifunction.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
        this.optiontype === 'Spot' ? 'FXC' : 'FXW',
        this.altCCY1 + ' - ' + this.invCCY1,
        'Buy',
        ccy1Amount,
        ccy2Amount,
        this.RMspread,
        this.Type,
        false,
        'fx',
        this.ValueDate,
        this.FixingDate,
        this.SessionID,
        999,
        1,
        this.direction1,
        this.uniqueKey,
        this.CustomerCIF,
        this.Customer,
        this.CustomerSegment,
        this.RMName,
        this.customerID,
        this.DealerID,
        this.BillingAccount,
        this.CreditAccount,
        this.priceProvider
      );
    }
  }

  ChangeNotional() {
    let altn;
    if (this.highlightFlag === 'invest') {
      altn = parseFloat(this.invamt.replace(/,/g, '')) * parseFloat(this.rate);
      this.invamt.toFixed(this.ccy1decimal);
      this.sellamount = (altn.toFixed(this.ccy2decimal) + '').replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );
    } else {
      altn =
        parseFloat(this.sellamount.replace(/,/g, '')) / parseFloat(this.rate);
      this.invamt = (altn.toFixed(this.ccy1decimal) + '').replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );
      this.sellamount.toFixed(this.ccy2decimal);
    }
    this.altAmt1 = this.sellamount;
  }
  public captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data)
      .then((canvas) => {
        // Few necessary setting options
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('TransactionDetails.pdf'); // Generated PDF
      })
      .catch((err) => console.log(err));
  }

  setTimer() {
    let timeLeft = 10;
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
    }
    this.timerId = setInterval(() => {
      this.TimeUP = false;
      const timerclass = document.getElementsByClassName(
        'timer'
      )[0] as HTMLElement;
      console.log(timerclass);
      if (timeLeft === -1) {
        clearTimeout(this.timerId);
        this.flag1 = false;
        this.TimeUP = true;
        this.isMessage = true;
        this.error = 'Timeout Please Reprice again.';
        // if (this.OrderSubmission) {
        //   this.CallRates();
        // }
      } else {
        this.sec = timeLeft;
        timeLeft--;
        if (timeLeft <= 5) {
          timerclass.style.color = 'red';
        } else if (timeLeft <= 10 && timeLeft > 5) {
          timerclass.style.color = 'orange';
        } else {
          timerclass.style.color = 'green';
        }
      }
    }, 1000);
  }

  ChangeIndex() {
    try {
      this.selectedCustomerIndex = 0;
      this.flag = true;

      this.elem.nativeElement.querySelectorAll(
        '.customer-suggesstion-container'
      ).scrollTop = 0;
    } catch (error) {
      // console.log("ChangeIndex Error", error);
    }
  }

  backKeyPress() {
    try {
      this.flag = false;
    } catch (error) {
      // console.log("Error:", error);
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
      // console.log("Error:", error);
      // console.log("Scroll not working Contact Saurabh");
    }
  }

  moveUpSelection(selectedIndex) {
    try {
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      this.ScrollTo(
        '.customer-suggesstion-container',
        '.customer-list-hover',
        'down'
      );
      this.selectedCustomerIndex = selectedIndex;
    } catch (error) {
      // console.log("Error:", error);
      // console.log("Move up not working Contact Saurabh");
    }
  }

  moveDownSelection(selectedIndex) {
    try {
      if (
        selectedIndex <
        $('.customer-suggesstion-container')[0].childElementCount - 1
      ) {
        selectedIndex++;
      }
      if (
        $('.customer-suggesstion-container')[0].childElementCount >
        selectedIndex
      ) {
        this.ScrollTo(
          '.customer-suggesstion-container',
          '.customer-list-hover',
          'up'
        );
        this.selectedCustomerIndex = selectedIndex;
      }
    } catch (error) {
      // console.log("Error:", error);
      // console.log("Move down not working Contact Saurabh");
    }
  }

  selectCustomer() {
    try {
      if (this.flag) {
        this.flag = false;
        this.validationMsg = '';
        this.Customer = $('.customer-list-hover').data('customer');
        this.selectedCustomerIndex = 0;
        // let pan = this.Customer.split('|')[1];
        for (let i = 0; i < this.customerInfo.length; i++) {
          if (this.customerInfo[i].CustomerName === this.Customer) {
            this.CustPAN = this.customerInfo[i].CustomerID;
            this.CustomerCIF = this.customerInfo[i].AH_CIF_No;
            this.CustomerSegment = this.customerInfo[i].AH_Customer_Segment;
            this.RMName = this.customerInfo[i].RelManager;
            this.customerID = this.customerInfo[i].CustomerID;
            this.DealerID = this.customerInfo[i].DealerID;
            break;
          }
        }
        this.BillingAccount = '';
        this.CreditAccount = '';
        this.apifunction.getAccountDetails(
          this.customerID,
          this.invccy,
          this.altccy,
          this.optiontype,
          this.userType
        );
      }
    } catch (error) {
      // console.log("Error:", error);
      // console.log("Move up not working Contact Saurabh");
    }
  }

  setCustomer(item) {
    try {
      this.flag = false;
      // this.Customer = 'TITAN CEMENT';
      this.Customer = item;
      this.selectedCustomerIndex = 0;
      for (let i = 0; i < this.customerInfo.length; i++) {
        if (this.customerInfo[i].CustomerName === this.Customer) {
          this.CustPAN = this.customerInfo[i].CustomerID;
          this.CustomerCIF = this.customerInfo[i].AH_CIF_No;
          this.CustomerSegment = this.customerInfo[i].AH_Customer_Segment;
          this.RMName = this.customerInfo[i].RelManager;
          this.customerID = this.customerInfo[i].CustomerID;
          this.DealerID = this.customerInfo[i].DealerID;
          break;
        }
      }
      // if (this.CustomerCIF === "") {
      //   this.validationMsg = "Customer CIF No. is not available for selected customer."
      //   this.Load = false;
      // }
      this.BillingAccount = '';
      this.CreditAccount = '';
      this.apifunction.getAccountDetails(
        this.customerID,
        this.invccy,
        this.altccy,
        this.optiontype,
        this.userType
      );
      this.apifunction.getEventName(this.CustomerSegment);
    } catch (error) {
      // console.log("Error:", error);
      // console.log("Set Customer not working Contact Saurabh");
    }
  }
  back() {
    try {
      if (this.EFX_NewTransactionAccountDetails.toLocaleUpperCase() === 'NO') {
        this.router.navigateByUrl('dashboardFx/1');
      } else {
        this.TransactionShow = true;
        this.OrderSubmission = false;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
}
