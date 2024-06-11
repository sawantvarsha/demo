import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as xml2js from 'xml2js';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class ApifunctionService {
  currencyCache = [];
  quotevalidity: any;
  ngxXml2jsonServices: NgxXml2jsonService;

  CcyPairPointShift = [];
  interfaceUrl = environment.interfaceURL;
  deletedTileID = 0;
  countDelectedTileReq = 0;
  GetFXDatesForSpotForwardSF = new BehaviorSubject('');
  GetFXDatesForSpotForwardSFObserver =
    this.GetFXDatesForSpotForwardSF.asObservable();

  GetCcyPairPointShiftDetailsSF = new BehaviorSubject('');
  GetCcyPairPointShiftDetailsSFObserver =
    this.GetCcyPairPointShiftDetailsSF.asObservable();

  FXOBestPrice = new BehaviorSubject([]);
  FXOBestPriceObservar = this.FXOBestPrice.asObservable();

  CcyPairs = new BehaviorSubject('');
  CcyPairsObserver = this.CcyPairs.asObservable();

  GetFXBookDeal = new BehaviorSubject<any>('');
  GetFXBookDealObserver = this.GetFXBookDeal.asObservable();

  GetBlotterData = new BehaviorSubject([]);
  GetBlotterDataObserver = this.GetBlotterData.asObservable();

  GetAccountDetails = new BehaviorSubject('');
  GetAccountDetailsObserver = this.GetAccountDetails.asObservable();

  GetSpreadDetails = new BehaviorSubject([]);
  GetSpreadDetailsObserver = this.GetSpreadDetails.asObservable();

  GetBlotterExtraData = new BehaviorSubject({});
  GetBlotterExtraDataObserver = this.GetBlotterExtraData.asObservable();

  GetLimitOrderBlotterData = new BehaviorSubject({});
  GetLimitOrderBlotterDataObserver =
    this.GetLimitOrderBlotterData.asObservable();

  GetSandFBlotterData = new BehaviorSubject([]);
  GetSandFBlotterDataObserver = this.GetSandFBlotterData.asObservable();

  GetSandFBlotterData_value = new BehaviorSubject([]);
  GetSandFBlotterDataObserver_value =
    this.GetSandFBlotterData_value.asObservable();

  CancelLimitOrderBookedOrder = new BehaviorSubject({});
  CancelLimitOrderBookedOrderObserver =
    this.CancelLimitOrderBookedOrder.asObservable();

  BookLimitOrderData = new BehaviorSubject([]);
  BookLimitOrderDataObserver = this.BookLimitOrderData.asObservable();

  GetFxSpotBidAskRate = new BehaviorSubject(0.0);
  GetFxSpotBidAskRateObserver = this.GetFxSpotBidAskRate.asObservable();

  GetCurrencyPairData = new BehaviorSubject([]);
  GetCurrencyPairObserver = this.GetCurrencyPairData.asObservable();

  loadingComplete = new BehaviorSubject(false);
  loadingCompleteObserver = this.loadingComplete.asObservable();

  // Added by Ketan S on 9-Jan-2020
  ExpireLimitOrderSubject = new BehaviorSubject({});
  ExpireLimitOrderSubjectObserver = this.ExpireLimitOrderSubject.asObservable();

  GetDailyTransactionLimitDetails = new BehaviorSubject([]);
  GetDailyTransactionLimitDetailsObserver =
    this.GetDailyTransactionLimitDetails.asObservable();

  DealDataForCancelDetails = new BehaviorSubject([]);
  DealDataForCancelDetailsObserver =
    this.DealDataForCancelDetails.asObservable();

  GetCancelRequestData = new BehaviorSubject([]);
  GetCancelRequestDataObserver = this.GetCancelRequestData.asObservable();

  GetCancelReject = new BehaviorSubject([]);
  GetCancelRejectObserver = this.GetCancelReject.asObservable();

  GetApproveCancel = new BehaviorSubject([]);
  GetApproveCancelObserver = this.GetApproveCancel.asObservable();

  getfavorite = new BehaviorSubject([]);
  getfavoriteObserver = this.getfavorite.asObservable();

  gettemplate = new BehaviorSubject([]);
  gettemplateObserver = this.gettemplate.asObservable();

  checkccyIsInsertedOrNot = new BehaviorSubject('');
  checkccyIsInsertedOrNotObserver = this.checkccyIsInsertedOrNot.asObservable();

  AmendOrder = new BehaviorSubject({});
  AmendOrderObserver = this.AmendOrder.asObservable();

  AmendLimitOrder = new BehaviorSubject({});
  AmendLimitOrderObserver = this.AmendLimitOrder.asObservable();

  TabIdLimitOrder = new BehaviorSubject('');
  TabIdLimitOrderObserver = this.TabIdLimitOrder.asObservable();

  deletedccy = new BehaviorSubject([]);
  deletedccyObserver = this.deletedccy.asObservable();

  FXOBestPriceTransaction = new BehaviorSubject([]);
  FXOBestPriceTransactionObservar = this.FXOBestPriceTransaction.asObservable();

  CustomerList = new BehaviorSubject([]);
  CustomerListObserver = this.CustomerList.asObservable();
  sampleobject: any;

  PairMidRate = new BehaviorSubject([]);
  PairMidRateObserver = this.PairMidRate.asObservable();

  PositionBlotter = new BehaviorSubject([]);
  PositionBlotterObserver = this.PositionBlotter.asObservable();

  insights = new BehaviorSubject([]);
  insightsObserver = this.insights.asObservable();

  piechart = new BehaviorSubject([]);
  piechartObserver = this.piechart.asObservable();

  configValue = new BehaviorSubject([]);
  configValueObserver = this.configValue.asObservable();

  configChangeRes = new BehaviorSubject([]);
  configChangeResObserver = this.configChangeRes.asObservable();

  spreadData = new BehaviorSubject([]);
  spreadDataObserver = this.spreadData.asObservable();

  spreadGroup = new BehaviorSubject([]);
  spreadGroupObserver = this.spreadGroup.asObservable();

  transactionLimits = new BehaviorSubject([]);
  transactionLimitsObserver = this.transactionLimits.asObservable();

  IUDTransactionLimit = new BehaviorSubject([]);
  IUDTransactionLimitObserver = this.IUDTransactionLimit.asObservable();

  validateTradeBlock = new BehaviorSubject([]);
  validateTradeBlockObserver = this.validateTradeBlock.asObservable();

  updatelimit = new BehaviorSubject('');
  updatelimitObserver = this.updatelimit.asObservable();

  eventName = new BehaviorSubject('');
  eventNameObserver = this.eventName.asObservable();

  loginID = '';
  public fxCashFlowData = new BehaviorSubject([]);
  fxCashFlowDataObs = this.fxCashFlowData.asObservable();

  public CollateralFlowData = new BehaviorSubject([]);
  CollateralFlowDataObs = this.CollateralFlowData.asObservable();

  public pairwiseMTMData = new BehaviorSubject([]);
  pairwiseMTMDataObs = this.pairwiseMTMData.asObservable();

  public DoneTradeSummaryData = new BehaviorSubject([]);
  DoneTradeSummaryDataObs = this.DoneTradeSummaryData.asObservable();

  public customersearch = new BehaviorSubject([]);
  customersearchObs = this.customersearch.asObservable();

  EntityID: number;

  public performMTMres = new BehaviorSubject([]);
  performMTMresObs = this.performMTMres.asObservable();

  public entityData = new BehaviorSubject([]);
  entityDataObs = this.entityData.asObservable();

  public CurrencyList = new BehaviorSubject([]);
  CurrencyListObs = this.CurrencyList.asObservable();

  userEntityName = new BehaviorSubject('');
  userEntityNameObserver = this.userEntityName.asObservable();

  SandFblotterDetailsforsingleCustomer = new BehaviorSubject([]);
  SandFblotterDetailsforsingleCustomerObserver =
    this.SandFblotterDetailsforsingleCustomer.asObservable();

  getCustCcyData = new BehaviorSubject('');
  getCustCcyDataObserver = this.getCustCcyData.asObservable();

  IUD_custCcyData = new BehaviorSubject([]);
  IUD_custCcyDataObserver = this.IUD_custCcyData.asObservable();

  // Added by Ketan S for Spot on 8-Apr-2021

  // New param for HTTP request added by Ketan S. on 23-02-2020
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  FXOrderBlotterForSFK: any;

  GetAllTradablePairsSF = new BehaviorSubject([]);
  GetAllTradablePairsSFObserver = this.GetAllTradablePairsSF.asObservable();

  GetBestPriceStreamForSF = new BehaviorSubject<any>([]);
  GetBestPriceStreamForSFObserver = this.GetBestPriceStreamForSF.asObservable();

  OrderBlotterDataSF = new BehaviorSubject<any>([]);
  OrderBlotterDataSFObserver = this.OrderBlotterDataSF.asObservable();

  GetQueuesforOrderBlotterSF = new BehaviorSubject<any>([]);
  GetQueuesforOrderBlotterSFObserver =
    this.GetQueuesforOrderBlotterSF.asObservable();

  // End by Ketan S for Spot

  // Added by Nilam V on 13-May-2021
  // private GetEmailNotificationBS = new BehaviorSubject<any>('');
  // GetEmailNotificationObs = this.GetEmailNotificationBS.asObservable();
  // End

  // Start Added by mayuri D.
  GethighLowSub = new BehaviorSubject([]);
  GethighLowSubObserver = this.GethighLowSub.asObservable();

  GetShareHistorySub = new BehaviorSubject([]);
  GetShareHistorySubObserver = this.GetShareHistorySub.asObservable();

  GetOptionRatesSub = new BehaviorSubject([]);
  GetOptionRatesSubObserver = this.GetOptionRatesSub.asObservable();

  GetCorrelationMatrixSub = new BehaviorSubject([]);
  GetCorrelationMatrixObserver = this.GetCorrelationMatrixSub.asObservable();

  GetEquityVolatilitySub = new BehaviorSubject([]);
  GetEquityVolatilityObserver = this.GetEquityVolatilitySub.asObservable();

  //  END
  private FXEmail = new BehaviorSubject<any>('');
  FXEmailObserver = this.FXEmail.asObservable();

  private TokenID = new BehaviorSubject<any>('');
  TokenIDObserver = this.TokenID.asObservable();

  public CustAccountDetails = new BehaviorSubject<any>([]);
  CustAccountDetailsobs = this.CustAccountDetails.asObservable();

  getSettleLimit = new BehaviorSubject([]);
  getSettleLimitObserver = this.getSettleLimit.asObservable();
  checkCredit = new BehaviorSubject([]);
  checkCreditObserver = this.checkCredit.asObservable();
  updateAccountBalanceRes = new BehaviorSubject([]);
  updateAccountBalanceResObserver = this.updateAccountBalanceRes.asObservable();
  // Added by Nilam V on 21-Jun-2021
  FirstStreamTileID = -1;
  FirstStreamData = [];
  // End

  STHAccountDetails = new BehaviorSubject<any>([]);
  STHAccountDetailsobs = this.STHAccountDetails.asObservable();
  userID: any;

  constructor(
    private ngxXml2jsonService: NgxXml2jsonService,
    public http: HttpClient,
    public authApi: AuthService,
    public homeApi: HomeApiService
  ) {
    this.ngxXml2jsonServices = ngxXml2jsonService;

    // this.loginID = sessionStorage.getItem('Username'); // before
    this.loginID = this.authApi.UserName; // after

    // this.userID = this.homeApi.CustomerName;
    // this.cfs.GetCustProfiledetailsObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     // console.log(res);
    //     this.loginID = res[res.length - 1].User;
    //     //  this.loginID = (this.loginID.substr(0, 1).toUpperCase() + this.loginID.substr(1, this.loginID.length).toLowerCase()).trim();
    //   }
    // });
  }

  GetCcyPairPointShiftDetails(
    CCYOption,
    Currency,
    Mode,
    EntityID,
    ProductCode
  ) {
    this.showLoader(true);

    const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
    const that = this;
    const parameters = {
      CCYOption,
      Currency,
      ProductCode,
      index: '1',
      Mode,
      EntityID,
    };
    $.ajax({
      async: true,
      // crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // console.log(data);
        that.showLoader(false);
        that.GetCcyPairPointShiftDetailsSF.next(data);
      },
    });
    // return this.CcyPairs;
  }
  // GetCcyPairPointShiftDetails(CurrencyPair: string, ProductCode: string) {
  //   this.showLoader(true);
  //   const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
  //   // let result: any;
  //   const parameters = {
  //     Currency: CurrencyPair,
  //     ProductCode
  //   };
  //   const that = this;
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success(data) {
  //       // console.log(data);
  //       // that.CcyPairPointShift = data;
  //       that.showLoader(false);
  //       that.GetCcyPairPointShiftDetailsSF.next(data);
  //       // return that.CcyPairPointShift;
  //     },
  //     error(error) {
  //       // console.log('error');
  //       // console.log(error);
  //     }
  //   });
  //   // return this.CcyPairPointShift;
  // }
  GetCcyPairPointShiftDetails1(
    CurrencyPair: string,
    ProductCode: string,
    Mode: string
  ) {
    this.showLoader(true);
    const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
    // let result: any;
    const parameters = {
      Currency: CurrencyPair,
      ProductCode,
      Mode,
    };
    const that = this;
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
      success(data) {
        // console.log(data);
        that.CcyPairPointShift = data;
        // that.showLoader(false);
        return that.CcyPairPointShift;
      },
    });
    return this.CcyPairPointShift;
  }
  // FXSpotForwardDatesCalculations
  GetFXDatesForSpotForward(
    CurrencyPair: string,
    TenorCode: string,
    ProductID: number,
    CardIndex: number
  ) {
    this.showLoader(true);
    // console.log('call', CardIndex);
    const webMethod = this.interfaceUrl + 'FXSpotForwardDatesCalculations';
    // let result: any;
    const parameters = {
      CurrencyPair,
      TenorCode,
      ProductID,
      CardIndex,
    };
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXDatesForSpotForward = data;
        that.GetFXDatesForSpotForwardSF.next(data);
        that.showLoader(false);

        // console.log(data);
        // return that.FXDatesForSpotForward;
      },
    });
    // return this.FXDatesForSpotForward;
  }

  GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1AmountNearLeg,
    CCY2AmountNearLeg,
    RMSpread: number,
    TenorCode: string,
    IsStraightToExecution: boolean,
    MarginType: string,
    ValueDate: string,
    FixingDate: string,
    SessionID: string,
    CardIndex: number,
    EntryMode: number,
    dir,
    uniqueKey,
    CustCIF,
    CustName,
    Segment,
    RMName,
    CustID,
    DealerID,
    debitAccNo,
    creditAccNo,
    priceProvider
  ) {
    // GetQuoteRequestforFXRateForCurrencyPair()
    this.showLoader(true);
    // {
    const webMethod =
      this.interfaceUrl + 'QuoteRequestforFXRateForCurrencyPairSF';
    // let result: any;
    const parameters = {
      // 'ProductCode': "FXC",
      // 'CurrencyPair': "USD - JPY",
      // 'Direction': "Buy",
      // 'CCY1AmountNearLeg': "100000",
      // 'CCY2AmountNearLeg': "0",
      // 'RMSpread': 0,
      // 'TenorCode': "SPOT"

      ProductCode,
      CurrencyPair,
      Direction,
      CCY1AmountNearLeg,
      CCY2AmountNearLeg,
      RMSpread,
      TenorCode,
      IsStraightToExecution,
      MarginType,
      FixingDate,
      ValueDate,
      SessionID,
      CardIndex,
      EntryMode,
      dir,
      uniqueKey,
      loginID: this.loginID,
      CustCIF,
      CustName,
      Segment,
      RMName,
      CustID,
      DealerID,
      debitAccNo,
      creditAccNo,
      priceProvider,
    };
    // console.log(parameters);
    const that = this;
    // Added by Nilam V on 21-Jun-2021
    if (EntryMode === 2) {
      that.FirstStreamTileID = CardIndex;
    } // End
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
      success(data) {
        // that.FXOBestPrice = data;
        // console.log('Apidata : ', data);
        // return that.FXOBestPrice;
        try {
          // console.log(data.body.FinIQResponseHeader.Status);
          that.showLoader(false);
          if (CardIndex === 999 || CardIndex === 1300) {
            that.FXOBestPriceTransaction.next(data);
          } else {
            if (that.deletedTileID !== 0) {
              // if (data['ID'] === that.deletedTileID) {
              //   that.countDelectedTileReq++;
              //   if (that.countDelectedTileReq === 2) {
              //     that.deletedTileID = 0;
              //     that.countDelectedTileReq = 0;
              //   }

              // } else {
              //   that.FXOBestPrice.next(data);
              // }
              // data.cardUniqueKey = uniqueKey;
              if (that.countDelectedTileReq !== 0) {
                if (data.ID === that.deletedTileID) {
                  that.FXOBestPrice.next(data);
                } else {
                  that.FXOBestPrice.next(data);
                  that.countDelectedTileReq--;
                }
              } else {
                that.deletedTileID = 0;
              }
            } else {
              that.FXOBestPrice.next(data);
            }
          }
        } catch (ex) {
          // console.log('Issue in pricing ');
          // console.log('Issue', data);
        }
      },
    });
    // return this.FXOBestPrice;
  }
  GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier_limitorder(
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1AmountNearLeg,
    CCY2AmountNearLeg,
    RMSpread: number,
    TenorCode: string,
    IsStraightToExecution: boolean,
    MarginType: string,
    ValueDate: string,
    FixingDate: string,
    SessionID: string,
    CardIndex: number,
    EntryMode: number,
    dir,
    uniqueKey,
    CustCIF,
    CustName,
    Segment,
    RMName,
    CustID,
    DealerID,
    PriceProvider,
    DebitAccount,
    CreditAccount,
    PortfolioName: string,
    overrideExceptionRule = false,
    LoginID,
    EntityID
  ) {
    // GetQuoteRequestforFXRateForCurrencyPair()
    this.showLoader(true);
    // {
    const webMethod =
      this.interfaceUrl + 'QuoteRequestforFXRateForCurrencyPairSF';
    // let result: any;
    const parameters = {
      // 'ProductCode': "FXC",
      // 'CurrencyPair': "USD - JPY",
      // 'Direction': "Buy",
      // 'CCY1AmountNearLeg': "100000",
      // 'CCY2AmountNearLeg': "0",
      // 'RMSpread': 0,
      // 'TenorCode': "SPOT"
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1AmountNearLeg,
      CCY2AmountNearLeg,
      RMSpread,
      TenorCode,
      IsStraightToExecution,
      MarginType,
      FixingDate,
      ValueDate,
      SessionID,
      CardIndex,
      EntryMode,
      dir,
      uniqueKey,
      CustCIF,
      CustName,
      Segment,
      RMName,
      CustID,
      DealerID,
      PriceProvider,
      DebitAccount,
      CreditAccount,
      PortfolioName,
      overrideExceptionRule,
      LoginID,
      EntityID,
    };
    //console.log(parameters);
    const that = this;
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
      success(data) {
        // that.FXOBestPrice = data;
        //console.log('Apidata : ', data);
        // return that.FXOBestPrice;
        try {
          //console.log(data.body.FinIQResponseHeader.Status);
          that.showLoader(false);
          if (
            CardIndex === 999 ||
            CardIndex === 1200 ||
            CardIndex === 1300 ||
            CardIndex === 1100
          ) {
            that.FXOBestPriceTransaction.next(data);
          } else {
            if (that.deletedTileID !== 0) {
              if (data['ID'] === that.deletedTileID) {
                that.countDelectedTileReq++;
                if (that.countDelectedTileReq === 2) {
                  that.deletedTileID = 0;
                  that.countDelectedTileReq = 0;
                }
              } else {
                that.FXOBestPrice.next(data);
              }
            } else {
              that.FXOBestPrice.next(data);
            }
          }
        } catch (ex) {
          console.log('Issue in pricing ');
          console.log('Issue', data);
        }
      },
      error(error) {
        console.log('error');
        console.log(error);
      },
    });
    // return this.FXOBestPrice;
  }

  getcurrencypairsdetails(ccyoption, ccy, index, mode) {
    this.showLoader(true);

    const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
    const that = this;
    const parameters = {
      CCYOption: ccyoption,
      Currency: ccy,
      ProductCode: 'FXC',
      index,
      Mode: mode,
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
      success(data) {
        // console.log(data);
        that.showLoader(false);

        that.CcyPairs.next(data);
      },
    });
    // return this.CcyPairs;
  }

  BookOrderforSF(
    PriceQuoteRef: string,
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: string,
    SpotRate: string,
    SwapPoint: string,
    FinIQPriceQuoteId: string,
    ExternalQuoteID: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    MarginType: string,
    ClientID: string,
    dataInput: string,
    tenor: string,
    Customer,
    CustomerCIF,
    RMName,
    CustomerSegment,
    CustPAN,
    CreditAccount,
    BillingAccount,
    IndicativeRevenue,
    stpFlag,
    DealerID,
    portfolio
  ) {
    this.showLoader(true);

    const webMethod = this.interfaceUrl + 'BookTradeforFXSF';

    const parameters = {
      PriceQuoteRef,
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      FinIQPriceQuoteId,
      ExternalQuoteID,
      PriceProviderId,
      SpotDate,
      Revenue,
      MarginType,
      ClientID,
      Data_Input: dataInput,
      tenor,
      Customer,
      CustomerCIF,
      CustomerSegment,
      CustPAN,
      RMName,
      CreditAccount,
      BillingAccount,
      IndicativeRevenue,
      loginID: this.loginID,
      stpFlag,
      DealerID,
      portfolio,
    };
    // console.log(parameters);
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXBookingStatusSF = data;
        // console.log(data);
        that.showLoader(false);

        that.GetFXBookDeal.next(data);
        // console.log(data);
      },
    });
  }
  BookOrderforSF_LimitOrder(
    PriceQuoteRef: string,
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: string,
    SpotRate: string,
    SwapPoint: string,
    FinIQPriceQuoteId: string,
    ExternalQuoteID: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    MarginType: string,
    ClientID: string,
    dataInput: string,
    tenor: string,
    Customer,
    CustomerCIF,
    RMName,
    CustomerSegment,
    CustPAN,
    CreditAccount,
    BillingAccount,
    IndicativeRevenue,
    cardindex = 10,
    PortfolioName = '',
    templateCode = 0,
    templateSerialNo = 0,
    uniqueKey = '0',
    autoRoll = 'N',
    STP = true,
    InvoiceNo = '',
    LoginID,
    EntityID
  ) {
    this.showLoader(true);
    const webMethod = this.interfaceUrl + 'BookTradeforFXSF';
    //const TradeDate = (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).getTime()).toString();
    // let result: any;
    //console.log('client', ClientID);
    const parameters = {
      PriceQuoteRef,
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      FinIQPriceQuoteId,
      ExternalQuoteID,
      PriceProviderId,
      SpotDate,
      Revenue,
      MarginType,
      ClientID,
      Data_Input: dataInput,
      tenor,
      Customer,
      CustomerCIF,
      CustomerSegment,
      CustPAN,
      RMName,
      CreditAccount,
      BillingAccount,
      IndicativeRevenue,
      cardindex,
      PortfolioName,
      templateCode,
      templateSerialNo,
      uniqueKey,
      autoRoll,
      STP,
      LoginID,
      EntityID,
      InvoiceNo,
    };
    //console.log(parameters);
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXBookingStatusSF = data;
        //console.log(data);
        that.showLoader(false);
        that.GetFXBookDeal.next([data, uniqueKey]);
        // console.log(data);
      },
      error(error) {
        console.log('error');
        console.log(error);
        that.GetFXBookDeal.next([
          { FinIQResponseHeader: { Status: 'Failed' } },
        ]);
      },
    });
  }
  getAccountDetails(
    CustID,
    DebitCCY,
    CreditCCY,
    ProductCode,
    UserType = 'Customer'
  ) {
    this.showLoader(true);

    const webMethod = this.interfaceUrl + 'GetSSIDetails';
    const that = this;
    let customerID: string;
    if (UserType === 'Customer') {
      customerID = sessionStorage.getItem('CustomerID');
    } else {
      customerID = CustID;
    }
    const parameters = {
      CustId: customerID,
      Debitccy: DebitCCY,
      creditccy: CreditCCY,
      productCode: ProductCode,
    };
    // console.log(parameters);
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
      success(data) {
        // that.CcyPairs = data;
        that.showLoader(false);

        that.GetAccountDetails.next(data);
      },
    });
    // return this.CcyPairs;
  }

  getWorkflowBlotterData(WorflowType, WorflowID, FromDate, ToDate) {
    this.showLoader(true);

    const webMethod = this.interfaceUrl + 'Blotter';
    const that = this;
    const parameters = {
      WorflowType,
      WorflowID,
      FromDate,
      ToDate,
      loginID: this.loginID,
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
      success: (data) => {
        // console.log(data);
        xml2js.parseString(
          data.body.getDataFromUSPCustomFilterResult,
          (_err, result) => {
            // console.log(result);
            that.showLoader(false);

            that.GetBlotterData.next(result.NewDataSet);
          }
        );
      },
    });
    // return this.CcyPairs;
  }

  getSpread(ccypair, segment, index) {
    // const webMethod = this.interfaceUrl + 'Spreads_piraeus';
    const webMethod = this.interfaceUrl + 'getSpreadSetup';
    const that = this;
    const parameters = {
      ccypair,
      segment,
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
      success(data) {
        // that.CcyPairs = data;
        // console.log(data);
        that.showLoader(false);

        that.GetSpreadDetails.next([data, index]);
      },
    });
    // return this.CcyPairs;
  }

  getSpread_NewService(
    ccypair,
    segment,
    customerID,
    pairGrpID,
    index,
    notional,
    ccy
  ) {
    // const webMethod = this.interfaceUrl + 'Spreads_piraeus';
    const webMethod = this.interfaceUrl + 'getBankSpreadSetup_NewService';
    const that = this;
    const parameters = {
      ccypair,
      segment,
      customerID,
      pairGrpID,
      SpreadType: 'Pips',
      notional,
      ccy,
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
      success(data) {
        // that.CcyPairs = data;
        // console.log(data);
        that.showLoader(false);

        that.GetSpreadDetails.next([data, index]);
      },
    });
    // return this.CcyPairs;
  }

  getLimitOrderWorkflowBlotterData(
    WorflowType,
    WorkFlowTypeId,
    WorkflowSuperType,
    ProductID,
    FromDate,
    ToDate,
    CallId,
    customFilter,
    rows,
    PageNo?
  ) {
    this.showLoader(true);
    const webMethod = this.interfaceUrl + 'LimitOrderWorkflowBlotter';
    const that = this;
    const parameters = {
      WorflowType,
      WorkFlowTypeId,
      ProductID,
      FromDate,
      ToDate,
      WorkflowSuperType,
      Login: this.loginID,
      Filter: customFilter,
      Rows: rows,
      PageNo: PageNo || 1,
    };
    // console.log(parameters);
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
      success: (data) => {
        // that.CcyPairs = data;
        const result = data.getDataFromUSPCustomFilterResult;
        xml2js.parseString(result.replace(/↵/g, ''), (_err, _res) => {
          // console.log("limit /*/*/",result);
          const parser = new DOMParser();
          const xml = parser.parseFromString(result, 'text/xml');
          that.sampleobject = that.ngxXml2jsonService.xmlToJson(xml);
          console.log('limit /*/*/', that.sampleobject);
          that.sampleobject = that.sampleobject.NewDataSet;
          // console.log(that.sampleobject['DUMMY']);
          that.showLoader(false);
          that.GetLimitOrderBlotterData.next({
            CallId,
            response: that.sampleobject.DUMMY,
          });
          // that.OrderBlotterDataSF.next(that.sampleobject['Dummy']);
        });
        // that.GetLimitOrderBlotterData.next(data);
      },
      error: (error) => {
        console.log('error with limit order', error);
      },
    });
    // return this.CcyPairs;
  }
  getSandFBlotterDetails(FromDate, ToDate, flag) {
    // console.log(FromDate, ToDate);
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'getSandFblotterDetails';

    // console.log(parameters);
    const result: any = {};
    const parameters = {
      FromDate: FromDate.toString(),
      ToDate: ToDate.toString(),
      flag,
      // loginID: this.homeApi.CustomerName.split('|')[0]
      loginID: sessionStorage.getItem('Username'),
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
      success(data) {
        // console.log(data);
        that.showLoader(false);
        if (data.flag === 't,r' || data.flag === 't,u') {
          that.GetSandFBlotterData.next(data);
        } else if (data.flag === 'v') {
          that.GetSandFBlotterData_value.next(data);
        }
      },
    });
    return result;
  }

  getLimitOrderBlotterExtraData(orderid: string, index: string, CallId) {
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'GetFxOrderDetailEntry';
    const parameters = {
      order_id: orderid,
    };
    // console.log(parameters);
    let result: any;
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
      success: (data) => {
        // console.log(data);
        result = {
          index,
          CallId,
          response: data.Get_FxOrderDetailEntryResult.filter(
            (d) => d.Block_Type === 'MAIN'
          )[0],
        };
        that.showLoader(false);

        that.GetBlotterExtraData.next(result);
      },
    });
    return result;
  }

  cancelLimitOrderBookedOrder(
    OrderID: string,
    cancelreason: string,
    index: number
  ) {
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'CancelLimitOrder';
    const parameters = {
      OrderID,
      cancelreason,
      loginId: this.loginID,
      // loginId: 'Dealer1'
    };

    let result: any;
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
      success: (data) => {
        that.showLoader(false);

        result = that.CancelLimitOrderBookedOrder.next({
          result: data.CancelLimitOrderResult,
          index,
        });
      },
    });
    return result;
  }

  // bookLimitOrder(
  //   expiryType: string,
  //   ccyPair: string,
  //   marketRate: string,
  //   targetRate: string,
  //   direction: string,
  //   billingAcc: string,
  //   creditAcc: string,
  //   howToExecute: string,
  //   billingAmt: string,
  //   creditAmt: string,
  //   expiryDateTime: string,
  //   valueDate: string,
  //   remark: string,
  //   timezone: string
  // ) {
  //   const that = this;
  //   const webMethod = this.interfaceUrl + 'BookLimitOrder';
  //   const parameters = {
  //     expiryType,
  //     timezone,
  //     ccyPair,
  //     marketRate,
  //     targetRate,
  //     direction,
  //     billingAcc,
  //     creditAcc,
  //     howToExecute,
  //     billingAmt,
  //     valueDate,
  //     expiryDateTime,
  //     creditAmt,
  //     remark,
  //   };
  //   // console.log(parameters);
  //   let result: any;
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     success: (data) => {
  //       result = data;
  //       that.BookLimitOrderData.next(result);
  //     },
  //   });
  //   return result;
  // }
  bookLimitOrder(
    expiryType: string,
    ccyPair: string,
    marketRate: string,
    targetRate: string,
    direction: string,
    billingAcc: string,
    creditAcc: string,
    howToExecute: string,
    billingAmt: string,
    creditAmt: string,
    expiryDateTime: string,
    valueDate: string,
    remark: string,
    timezone: string,
    custID,
    RMID,
    RMName,
    CustCIF,
    CustSeg,
    Remittance_temp_id = 0,
    Remittance_serial_no = 0,
    LoginID,
    EntityID
  ) {
    const that = this;
    const webMethod = this.interfaceUrl + 'BookLimitOrder';
    const parameters = {
      expiryType,
      timezone,
      ccyPair,
      marketRate,
      targetRate,
      direction,
      billingAcc,
      creditAcc,
      howToExecute,
      billingAmt,
      valueDate,
      expiryDateTime,
      creditAmt,
      remark,
      custID,
      RMID,
      RMName,
      CustCIF,
      CustSeg,
      Remittance_temp_id,
      Remittance_serial_no,
      LoginID,
      EntityID,
    };
    console.log('limit body parameters', parameters);
    let result: any;
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
      success: (data) => {
        result = data;
        that.BookLimitOrderData.next(result);
      },
      error: (error) => {
        console.log(error);
      },
    });
    return result;
  }

  Get_FxSpotBidAskRate(Code) {
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'Get_FxSpotBidAskRate';
    const parameters = {
      Code,
    };
    // console.log(parameters);

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
      success: (data) => {
        that.showLoader(false);

        that.GetFxSpotBidAskRate.next(data);
      },
      error: (error) => {
        that.showLoader(false);
        that.GetFxSpotBidAskRate.next(error);
        // console.log(error);
      },
    });
  }

  getCurrencyPairs() {
    this.showLoader(true);

    try {
      // console.log(this.currencyCache);
      if (!this.currencyCache.length) {
        const webMethod = this.interfaceUrl + 'GetCurrencyPairs';
        const that = this;
        $.ajax({
          async: true,
          crossDomain: true,
          type: 'GET',
          url: webMethod,
          data: '',
          contentType: 'application/json; charser=utf-8',
          dataType: 'json',
          headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
          },
          success: (data) => {
            // console.log('GetCcyPairs' + data);
            if (data) {
              const AssetPair = data.map((a) => {
                const obj = {
                  PairCode: a.PairCode,
                  DecimalRate: a.DecimalRate,
                  PointShift: a.PointShift,
                  GoodOrder: a.GoodOrderYN,
                  AmountDecimal: a.Asset1_DecimalAmount,
                  SecondAmountDecimal: a.Asset2_DecimalAmount,
                };
                return obj;
              });
              this.showLoader(false);
              that.currencyCache = AssetPair;
              that.GetCurrencyPairData.next(AssetPair);
            }
          },
          error: (_error) => {
            // console.log(error);
          },
        });
      } else {
        this.GetCurrencyPairData.next(this.currencyCache);
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  expireLimitOrder(OrderID: string, index: number) {
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'ExpireLimitOrder';
    const parameters = {
      OrderID,
      loginId: this.loginID,
      // loginId: 'Dealer1'
    };

    const result: any = {};
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
      success(data) {
        that.showLoader(false);

        that.ExpireLimitOrderSubject.next({
          result: data.OrderExpiryResult,
          index,
        });
      },
    });
    return result;
  }

  amendOrder(
    ExpiryType,
    ExpiryTime,
    OrderID,
    CCYPair,
    OrderAmt1,
    OrderAmt2,
    OrderRate,
    Timezone
  ) {
    this.showLoader(true);

    const that = this;
    const webMethod = this.interfaceUrl + 'AmendOrder';
    const parameters = {
      ExpiryType,
      ExpiryTime,
      OrderID,
      CCYPair,
      OrderAmt1,
      OrderAmt2,
      OrderRate,
      Timezone,
    };

    const result: any = {};
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
      success(data) {
        that.showLoader(false);

        that.AmendOrder.next({ result: data, OrderID });
      },
    });
    return result;
  }

  showLoader(loaded) {
    this.loadingComplete.next(loaded);
  }

  AmendOrderQueue(req) {
    this.AmendLimitOrder.next(req);
  }
  ShowTabInLimitOrder(tabid) {
    this.TabIdLimitOrder.next(tabid);
  }

  getDailyTransactionLimit(ccy, notional, custID) {
    const webMethod = this.interfaceUrl + 'DailyTransactionLimitCheck';
    const that = this;
    const parameters = {
      ccy,
      notional,
      custID,
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
      success(data) {
        // that.CcyPairs = data;
        // console.log(data);
        that.GetDailyTransactionLimitDetails.next(data);
      },
    });
    // return this.CcyPairs;
  }

  GetDealDataForCancel(dealNo) {
    const webMethod = this.interfaceUrl + 'GetDealDataForCancel';
    const that = this;
    const parameters = {
      dealNo,
      loginID: this.loginID,
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
      success(data) {
        // that.CcyPairs = data;
        // console.log(data);
        that.DealDataForCancelDetails.next(data);
      },
    });
    // return this.CcyPairs;
  }

  requestCancel(
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: number,
    SpotRate: string,
    SwapPoint: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    dealNo: string,
    priceQuoteRef: string
  ) {
    const webMethod = this.interfaceUrl + 'RequestCancel';
    const TradeDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
      .getTime()
      .toString();
    // let result: any;

    const parameters = {
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      PriceProviderId,
      SpotDate,
      Revenue,
      dealNo,
      priceQuoteRef,
      TradeDate,
      loginID: this.loginID,
    };
    // console.log(parameters);
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXBookingStatusSF = data;
        // console.log(data);
        that.GetCancelRequestData.next(data);
        // console.log(data);
      },
    });
  }

  rejectCancel(
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: number,
    SpotRate: string,
    SwapPoint: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    dealNo: string,
    priceQuoteRef: string
  ) {
    const webMethod = this.interfaceUrl + 'RejectCancel';
    const TradeDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
      .getTime()
      .toString();
    // let result: any;

    const parameters = {
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      PriceProviderId,
      SpotDate,
      Revenue,
      dealNo,
      priceQuoteRef,
      TradeDate,
      loginID: this.loginID,
    };
    // console.log(parameters);
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXBookingStatusSF = data;
        // console.log(data);
        that.GetCancelReject.next(data);
        // console.log(data);
      },
    });
  }

  ApproveCancel(
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: number,
    SpotRate: string,
    SwapPoint: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    dealNo: string,
    priceQuoteRef: string
  ) {
    const webMethod = this.interfaceUrl + 'ApproveCancel';
    const TradeDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
      .getTime()
      .toString();
    // let result: any;

    const parameters = {
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      PriceProviderId,
      SpotDate,
      Revenue,
      dealNo,
      priceQuoteRef,
      TradeDate,
      loginID: this.loginID,
    };
    // console.log(parameters);
    const that = this;
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
      success(data) {
        // console.log(data);
        // that.FXBookingStatusSF = data;
        // console.log(data);
        that.GetApproveCancel.next(data);
        // console.log(data);
      },
    });
  }

  getFavoritesFromTemplate(templateName) {
    const that = this;
    const webMethod = this.interfaceUrl + 'getfavoriteFromTemplates';
    const parameters = {
      templateName,
    };

    const result: any = [];
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
      success(data) {
        that.getfavorite.next(data.web_getProductsByTemplateResult);
      },
    });
    return result;
  }
  getTemplatesFromUser() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getTemplates';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.gettemplate.next(data.web_getProductsByTemplateCODEResult);
      },
    });
    return result;
  }

  addNewCcyInTemplate(templateName, productName, index) {
    const that = this;
    const webMethod = this.interfaceUrl + 'addNewCcyFromTemplate';
    const parameters = {
      templateName,
      productName,
      index,
    };

    let result: any;
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
      success(data) {
        that.checkccyIsInsertedOrNot.next(data);
      },
    });
    return result;
  }
  deleteCcyFromTemplate(templateName, tileID, index) {
    const that = this;
    const webMethod = this.interfaceUrl + 'deletefavoriteFromTemplates';
    const parameters = {
      templateName,
      tileID,
      index,
    };

    let result: any;
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
      success(data) {
        that.deletedccy.next(data);
      },
    });
    return result;
  }

  CustomerSearch(searchString) {
    const that = this;
    const webMethod = this.interfaceUrl + 'PerformSmartCustomerSearch_Piraeus';

    let result: any;
    const parameters = {
      loginID: this.loginID,
      search: searchString,
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
      success(data) {
        // console.log(data);
        that.CustomerList.next(data);
      },
      error(err) {
        console.log('error in customer search result', err);
      },
    });
    return result;
  }
  GetPairMidRate(ccy, tenor, product, loginID) {
    const that = this;
    const webMethod = this.interfaceUrl + 'IndicativeRevenue';
    const parameters = {
      CurrencyPair: ccy,
      TenorCode: tenor,
      ProductCode: product,
      loginID: loginID,
    };

    let result: any;
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
      success(data) {
        that.PairMidRate.next([{ body: data }]);
      },
    });
    return result;
  }

  GetPositionBlotter(fromDate, toDate) {
    const that = this;
    const webMethod = this.interfaceUrl + 'PositionBlotter';
    const parameters = {
      fromDate,
      toDate,
    };

    let result: any;
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
      success(data) {
        that.PositionBlotter.next(data);
      },
    });
    return result;
  }

  RevenueInsights(ccyPair, period, product, index) {
    const that = this;
    const webMethod = this.interfaceUrl + 'tradingInsights';
    const parameters = {
      ccyPair,
      period,
      product,
      index,
    };

    let result: any;
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
      success(data) {
        that.insights.next([data]);
      },
    });
    return result;
  }
  getFXCashPiechrat(ccyPair, period) {
    const that = this;
    const webMethod = this.interfaceUrl + 'getFXCashPieChart';
    const parameters = {
      ccyPair,
      period,
    };

    let result: any;
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
      success(data) {
        that.piechart.next([data]);
      },
    });
    return result;
  }
  getConfigValue(ConfigName) {
    const that = this;
    const webMethod = this.interfaceUrl + 'getConfigValue';
    const parameters = {
      ConfigName,
    };

    let result: any;
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
      success(data) {
        that.configValue.next([data]);
      },
    });
    return result;
  }
  setConfigValue(ConfigName, Value) {
    const that = this;
    const webMethod = this.interfaceUrl + 'setConfigValue';
    const parameters = {
      ConfigName,
      Value,
    };

    let result: any;
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
      success(data) {
        that.configChangeRes.next([data]);
      },
    });
    return result;
  }

  getSpreadData() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getSpreadData';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'GET',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // console.log(data);
        that.spreadData.next(data);
      },
    });
    return result;
  }

  getSpreadGroup() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getSpreadGroup';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'GET',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // console.log(data);
        that.spreadGroup.next(data);
      },
    });
    return result;
  }

  // Added for transaction limit data fetch || Tina.K || 03-Feb-2021
  getTransactionLimits() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getTransactionLimits';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'GET',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // console.log(data);
        that.transactionLimits.next(data);
      },
    });
    return result;
  }

  // Added for insert and update in transaction limit page || Tina.K || 03-Feb-2021
  InsertUpdateDeleteTransactionLimit(obj) {
    const that = this;
    const webMethod = this.interfaceUrl + 'InsertUpdateDeleteTransactionLimit';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify({ oReq: obj }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.IUDTransactionLimit.next([data]);
      },
    });
    return result;
  }

  CheckTransactionLimit(notionalAmt, notionalCcy, customer, validate_uniqueID) {
    const that = this;
    const webMethod = this.interfaceUrl + 'checkTransactionLimit';
    const parameters = {
      NotionalAmt: notionalAmt,
      NotionalCCY: notionalCcy,
      Customer: customer,
    };
    let result: any;
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
        // console.log(data);
        that.validateTradeBlock.next([data, validate_uniqueID]);
      },
      error: function (error) {
        console.log(error);
      },
    });
    return result;
  }

  updateDailyLimit(customer, notionalCcy, notionalAmt) {
    const that = this;
    const webMethod = this.interfaceUrl + 'updateDailyLimit';
    const parameters = {
      Customer: customer + '',
      NotionalCCY: notionalCcy,
      NotionalAmt: notionalAmt,
    };
    let result: any;
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
      success(data) {
        // console.log(data);
        that.updatelimit.next(data);
      },
    });
    return result;
  }

  getEventName(customer: string) {
    const that = this;
    const webMethod = this.interfaceUrl + 'getEventName';
    const parameters = {
      Customer: customer,
    };
    let result: any;
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
      success(data) {
        // console.log(data);
        that.eventName.next(data);
      },
    });
    return result;
  }

  // FX Margin Blotter Page APIS start here:::==========================
  // custPAN: string, EntityID: string, TypeAsset: string, fromdate: string, todate: string, Source: string, pair: string
  getFXCashFlowData(
    Cust_PAN: string,
    EntityId: string,
    TypeAsset: string,
    MatFromDate: string,
    MatToDate: string,
    Source: string,
    Pair: string
  ) {
    const webMethod = this.interfaceUrl + 'GetFXCashFlowData';
    const body = {
      FXCashFlowReqDTO: {
        Cust_PAN, // : "32819",
        EntityId, // : "4",
        TypeAsset, // : "FX",
        MatFromDate, // : "01-Mar-2021",
        MatToDate, // : "01-Mar-2031",
        Source, // : "",
        Pair, // : ""
      },
    };

    return this.http.post<any>(webMethod, body);

    // this.http
    //   .post<any>(this.interfaceUrl + 'GetFXCashFlowData', body)
    //   .subscribe(
    //     (res: any) => {
    //       // console.log(res)
    //       this.fxCashFlowData.next(res);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  GetPairWiseMTMData(
    Cust_PAN: string,
    EntityId: string,
    TypeAsset: string,
    MatFromdate: string,
    MatTodate: string,
    Source: string,
    Pair: string
  ) {
    const webMethod = this.interfaceUrl + 'GetPairWiseMTMData';

    const body = {
      PairWiseMTMReqDTO: {
        Cust_PAN, // : "32819",
        EntityId, // : "4",
        TypeAsset, // : "FX",
        MatFromdate, // : "01-Mar-2021",
        MatTodate, // : "01-Mar-2031",
        Source, // : "",
        Pair, // : ""
      },
    };
    return this.http.post<any>(webMethod, body);
    // this.http
    //   .post<any>(this.interfaceUrl + 'GetPairWiseMTMData', body)
    //   .subscribe(
    //     (res: any) => {
    //       // console.log(res)
    //       this.pairwiseMTMData.next(res);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  GetCollateralFlowData(
    Customer_PAN: string,
    CustomerName: string,
    Entity: string,
    FromDate: string,
    ToDate: string,
    Source: string,
    Pair: string,
    Branch: any
  ) {
    const webMethod = this.interfaceUrl + 'GetCollateralFlowData';

    const body = {
      CollateraldetailsReqDTO: {
        Customer_PAN, // : "32819",
        CustomerName, // : "",
        Entity, // : "4",
        FromDate, // : "01-Mar-2021",
        ToDate, // : "01-Mar-2031",
        Source, // : "",
        Pair, // : ""
        Branch,
        RMId: '',
      },
    };
    return this.http.post<any>(webMethod, body);

    // this.http
    //   .post<any>(this.interfaceUrl + 'GetCollateralFlowData', body)
    //   .subscribe(
    //     (res: any) => {
    //       // console.log(res)
    //       this.CollateralFlowData.next(res);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  GetDoneTradeSummaryData(
    fromDate,
    toDate,
    clientCounterPartyRef,
    LoginId,
    RowsPerPage,
    PageNo
  ) {
    // const webMethod = this.interfaceUrl + 'GetDoneTradeSummary';
    const body = {
      objFilter: [
        {
          dateFilterType: 'TRADE_DATE',
          fromDate,
          toDate,
          ActiveYN: '',
          dealFacing: 'Customer',
          clientCounterPartyRef,
          productType: 'FX',
          productRef: '',
          includeProductQuotedAtFilterYN: 'N',
        },
      ],
      LoginId,
      RowsPerPage,
      PageNo,
      blotterCode: '',
    };
    // return this.http.post<any>(webMethod, body);

    this.http
      .post<any>(this.interfaceUrl + 'GetDoneTradeSummary', body)
      .subscribe(
        (res: any) => {
          try {
            xml2js.parseString(res.body, (_err, result) => {
              if (result.GetOrderDataResponse) {
                this.DoneTradeSummaryData.next(
                  result.GetOrderDataResponse.GetOrderDataResult[0]
                );
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  GetCustomerSearchData(SearchText, Mode) {
    const body = {
      SearchText,
      Mode,
    };
    // console.log(body);
    this.http.post<any>(this.interfaceUrl + 'CustomerSearch', body).subscribe(
      (res: any) => {
        // console.log(res)
        this.customersearch.next(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  PerformMTM(CustomerId, EntityId) {
    const webMethod = this.interfaceUrl + 'performMTM';

    const body = {
      request: {
        EntityId,
        CustomerId,
        CustomerName: '',
        FromDate: '',
        ToDate: '',
        MarketType: '',
        LoginID: '',
        TradedId: '',
      },
    };
    return this.http.post<any>(webMethod, body);

    // this.http.post<any>(this.interfaceUrl + 'performMTM', body).subscribe(
    //   (res: any) => {
    //     // console.log(res)
    //     this.performMTMres.next(res);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  GetEntityData(UserID) {
    const body = {
      UserID,
    };
    this.http.post<any>(this.interfaceUrl + 'GetEntityData', body).subscribe(
      (res: any) => {
        // console.log(res)
        this.entityData.next(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  GetUserEntityName() {
    this.http.get<any>(this.interfaceUrl + 'GetUserEntityName').subscribe(
      (res: any) => {
        this.userEntityName.next(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  GetCurrencyList() {
    this.http
      .get<any>(this.interfaceUrl + 'GetCurrencyList')
      .subscribe((res) => {
        try {
          this.CurrencyList.next(res);
        } catch (ex) {
          console.log(ex);
        }
      });
  }
  getSandFblotterDetailsforsingleCustomer(FromDate, ToDate, LoginId, Flag) {
    const body = {
      FromDate,
      LoginId: LoginId.toString(),
      ToDate,
      Flag,
    };
    // console.log(body);
    this.http
      .post<any>(
        this.interfaceUrl + 'getSandFblotterDetailsforsingleCustomer',
        body
      )
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.SandFblotterDetailsforsingleCustomer.next(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  // FX Margin Blotter Page APIS End here:::==========================

  getEntityID() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getEntityData';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // console.log(data);
        const cvdata = data.GetEntityDataResult['CVPData'];
        if (cvdata.length > 0) {
          that.EntityID = cvdata[0].Code;
        }
      },
      error(error) {
        console.log(error);
      },
    });
    return result;
  }

  // getCommonDataEFX() {
  //   const body = 'EFX_CCY_SG';
  //   return this.http.get<any>(this.interfaceUrl + 'GetCommonDataEFX');
  // }

  getCustCcyPairData() {
    const that = this;
    const webMethod = this.interfaceUrl + 'getCustCcyPairData';

    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'GET',
      url: webMethod,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.getCustCcyData.next(data);
      },
      error(error) {
        console.log(error);
      },
    });
    return result;
  }

  updateCustomerCurrencyData(obj) {
    const that = this;
    const webMethod = this.interfaceUrl + 'updateCustomerCurrencyData';
    let opType = '';
    obj.map((rec) => {
      opType += rec.IUD_flag;
    });
    console.log(opType);
    let result: any;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify({ oReq: obj }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.IUD_custCcyData.next([{ data: data, Operation: opType }]);
      },
      error(error) {
        console.log(error);
      },
    });
    return result;
  }

  getCommonDataFXOrder(dataType) {
    const body = { DataType: dataType };
    return this.http.post<any>(this.interfaceUrl + 'GetCommonDataEFX', body);
  }

  // Start Added by Ketan S for Spot on 8-Apr-2021
  ResetFXDatesForSpotForwardSFObserver() {
    this.GetFXDatesForSpotForwardSF.next(null);
  }

  ResetGetCcyPairPointShiftDetailsSFObserver() {
    this.GetCcyPairPointShiftDetailsSF.next(null);
  }

  ResetFXBookDealObserver() {
    this.GetFXBookDeal.next(null);
  }

  ResetGetAllTradablePairsSF() {
    this.GetAllTradablePairsSF.next(null);
  }

  ResetOrderBlotterDataSFObserver() {
    this.OrderBlotterDataSF.next(null);
  }

  ResetGetBestPriceStreamForSF() {
    this.GetBestPriceStreamForSF.next(null);
  }

  GetQueuesForOrderBlotterSFK(workflowId: string, loginid: string) {
    const webMethod = this.interfaceUrl + 'GetOrderBlotterColumnsSF';
    const parameters = { workflowId, loginid };
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.GetQueuesforOrderBlotterSF.next(res);
        }
      }
    });
  }

  GetQuoteRequestforFXRateForCurrencyPairSFK(
    LoginID: any,
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1AmountNearLeg: string,
    CCY2AmountNearLeg: string,
    RMSpread: number,
    TenorCode: string,
    IsStraightToExecution: boolean,
    MarginType: string,
    ValueDate: string,
    FixingDate: string,
    SessionID: string,
    PriceProvider: string,
    CustomerRate: string,
    SpotDate: string,
    _CustomerCIF,
    _CustomerName,
    _CustomerSegment,
    _RMName,
    _DealerID
  ) {
    const webMethod =
      this.interfaceUrl + 'QuoteRequestforFXRateForCurrencyPairSFK';
    // let result: any;
    const parameters = {
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1AmountNearLeg,
      CCY2AmountNearLeg,
      RMSpread,
      TenorCode,
      IsStraightToExecution,
      MarginType,
      FixingDate,
      ValueDate,
      SessionID,
      PriceProvider,
      CustomerRate,
      SpotDate,
      LoginID,
    };
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.GetBestPriceStreamForSF.next(res);
        }
      }
    });
  }
  BookOrderforSFK(
    LoginID: any,
    PriceQuoteRef: string,
    ProductCode: string,
    CurrencyPair: string,
    Direction: string,
    CCY1Amount: string,
    CCY2Amount: string,
    BankRate: string,
    CustomerRate: string,
    FixingDate: string,
    ValueDate: string,
    TenorCode: string,
    RMSpread: string,
    BankSpread: string,
    SpotRate: string,
    SwapPoint: string,
    Tenor: string,
    FinIQPriceQuoteId: string,
    ExternalQuoteID: string,
    PriceProviderId: string,
    SpotDate: string,
    Revenue: string,
    MarginType: string,
    IsStraightToExecution: boolean
    //  Customer: string,
    // CustomerCIF: string,
    // CustomerSegment: string,
    // CustPAN: string,
    // RMName: string
  ) {
    const webMethod = this.interfaceUrl + 'BookTradeforFXSFK';
    const parameters = {
      LoginID,
      PriceQuoteRef,
      ProductCode,
      CurrencyPair,
      Direction,
      CCY1Amount,
      CCY2Amount,
      BankRate,
      CustomerRate,
      FixingDate,
      ValueDate,
      TenorCode,
      RMSpread,
      BankSpread,
      SpotRate,
      SwapPoint,
      Tenor,
      FinIQPriceQuoteId,
      ExternalQuoteID,
      PriceProviderId,
      SpotDate,
      Revenue,
      MarginType,
      IsStraightToExecution,
      // Customer,
      // CustomerCIF,
      // CustomerSegment,
      // CustPAN,
      // RMName,
    };
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.GetFXBookDeal.next(res);
        }
      }
    });
  }
  GetAllTradablePairs() {
    const result = this.http.get<any>(
      this.interfaceUrl + 'FXGetAllTradablePairsSFK',
      { headers: this.headerOptions }
    );
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.GetAllTradablePairsSF.next(res);
        }
      }
    });
  }
  OrderBlotterforSFK(
    ProductId: string,
    FromDate: string,
    ToDate: string,
    WorkFlowType: string,
    LoginID: string,
    RowsPerPage: string
  ) {
    const webMethod = this.interfaceUrl + 'GetOrderBlotterSFK';

    const parameters = {
      ProductId,
      FromDate,
      ToDate,
      WorkFlowType,
      LoginID,
      RowsPerPage,
    };
    const that = this;
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((resp) => {
      if (resp) {
        if (!resp.Error) {
          that.FXOrderBlotterForSFK = resp.getDataFromUSPCustomFilterResult;

          xml2js.parseString(resp, function (_err, _res) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(
              that.FXOrderBlotterForSFK,
              'text/xml'
            );
            that.sampleobject = that.ngxXml2jsonService.xmlToJson(xml);
            that.sampleobject = JSON.stringify(that.sampleobject);
            that.sampleobject = JSON.parse(that.sampleobject.toString());
            that.OrderBlotterDataSF.next(that.sampleobject.NewDataSet);
          });
        }
      }
    });
  }
  GetFXDatesForSpotForwardSFK(
    CurrencyPair: string,
    TenorCode: string,
    ProductID: number,
    ProductCode: string
  ) {
    const webMethod = this.interfaceUrl + 'FXDatesCalculationsSFK';
    const parameters = { CurrencyPair, TenorCode, ProductID, ProductCode };
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.GetFXDatesForSpotForwardSF.next(res);
        }
      }
    });
  }

  // End Added by Ketan S for Spot on 8-Apr-2021

  // Added by Nilam V on 13-May-2021
  // GetEmailNotification(NotemasterID) {
  //   try {
  //     const webMethod = this.interfaceUrl + 'Get_EmailNotification';
  //     const that = this;
  //     const params = {
  //       NotemasterID,
  //     };
  //     $.ajax({
  //       async: false,
  //       crossDomain: true,
  //       type: 'POST',
  //       data: JSON.stringify(params),
  //       url: webMethod,
  //       contentType: 'application/json; charset=utf-8',
  //       dataType: 'json',
  //       headers: {
  //         'Cache-Control': 'no-cache',
  //         'Access-Control-Allow-Origin': '*',
  //       },
  //       success(data) {
  //         that.GetEmailNotificationBS.next(data);
  //       },
  //
  //     });
  //   } catch (error) {
  //     // console.log('Error:', error);
  //   }
  // }
  // End

  // Added by Nilam V on 28-May-2021
  sendFXDealPlacementEmail(DealID, TokenID) {
    try {
      const webMethod = this.interfaceUrl + 'sendFXDealPlacementEmail';
      const that = this;
      const params = {
        DealID,
        loginID: this.loginID,
        TokenID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.FXEmail.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  // End

  // Added by Nilam V on 1-Jun-2021
  getTokenID(DealID) {
    try {
      const webMethod = this.interfaceUrl + 'getTokenID';
      const that = this;
      const params = {
        DealID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          // that.TokenID.next(data);
          xml2js.parseString(data.Get_Function_ValueResult, (_err, result) => {
            if (result) {
              that.TokenID.next(result);
            }
          });
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  // End

  getDataFromDBFunctions(DealID, dbfunction) {
    try {
      const webMethod = this.interfaceUrl + 'getTokenID';
      const that = this;
      const params = {
        DealID,
        dbfunction,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          // that.TokenID.next(data);
          xml2js.parseString(data.Get_Function_ValueResult, (_err, result) => {
            if (result) {
              that.TokenID.next({ result, dbfunction });
            }
          });
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  getCustAccountDetails(): any {
    try {
      const webMethod = this.interfaceUrl + 'getCustomerAccDetails';
      const parameters = {
        LoginID: this.loginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log("res from getCustAccountDetailsObserver for issue",res);
            this.CustAccountDetails.next(res[res.length - 1]);
          } else {
            // console.log("res from getCustAccountDetailsObserver for error",res.error);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  // Added by Nilam V on 22-Jun-2021
  GetPairMidRate_sync(ccy, tenor, product, _loginID) {
    const webMethod = this.interfaceUrl + 'IndicativeRevenue_sync';
    const parameters = {
      CurrencyPair: ccy,
      TenorCode: tenor,
      ProductCode: product,
      LoginID: this.loginID, //* Do not take in Gateway
    };

    let result: any;
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
      success(data) {
        result = [{ body: data }];
      },
      error(error) {
        console.log(error);
      },
    });
    return result;
  }

  // Added by Nilam V on 23-Jun-2021
  getSTHAccountDetails() {
    try {
      const webMethod = this.interfaceUrl + 'getAccountDetails';
      const that = this;
      const params = {
        ccy: 'USD',
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.STHAccountDetails.next([data]);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  // End

  async getFXQuoteValidity() {
    const webMethod = this.interfaceUrl + 'getfxquotetimer';
    this.quotevalidity = await this.http
      .get(webMethod + '/' + this.authApi.EntityID)
      .toPromise()
      .then((res: any) => {
        return res.quotevalidity;
      })
      .catch((err) => console.log(err));
  }
  getSettlementLimit(
    dealDirection,
    BuyCcy,
    buyNotional,
    counterPartyId = 4,
    dealPair,
    valueDate,
    transactionID,
    updateYN,
    LoginID,
    EntityID
  ) {
    const webMethod = this.interfaceUrl + 'settlementlimit';
    // let result: any;
    const parameters = {
      dealDirection,
      BuyCcy,
      buyNotional,
      counterPartyId,
      dealPair,
      valueDate,
      transactionID,
      updateYN,
      LoginID,
      EntityID,
    };
    const that = this;
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
        that.getSettleLimit.next([{ data, transactionID }]);
        // console.log(data);
      },
      error: function (error) {
        console.log('error');
        console.log(error);
      },
    });
  }
  getCreditChecked(custID, notional, ccy) {
    try {
      const webMethod = this.interfaceUrl + 'GetCreditChecked';
      const that = this;
      const parameters = {
        custID,
        notional,
        ccy,
      };
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charser=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: (data) => {
          that.checkCredit.next([data]);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  updateAccountBalance(
    CustomerID,
    DebitAccountNo,
    CreditAccountNo,
    DebitNotionalAmt,
    CreditNotionalAmt,
    DebitCcy,
    CreditCcy,
    Tenor
  ) {
    const webMethod = this.interfaceUrl + 'updateAccountBalance';
    var data = {
      CustomerID,
      DebitAccountNo,
      CreditAccountNo,
      DebitNotionalAmt,
      CreditNotionalAmt,
      DebitCcy,
      CreditCcy,
      Tenor,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data: any) {
        that.updateAccountBalanceRes.next([data]);
      },
      error(error: any) {
        console.log('error');
        console.log(error);
      },
    });
  }

  getCcyPairsDetails(ccyoption, ccy, index, mode) {
    const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
    // const that = this;
    const parameters = {
      CCYOption: ccyoption,
      Currency: ccy,
      ProductCode: 'FXC',
      index,
      Mode: mode,
    };
    return this.http.post<any>(webMethod, parameters);
  }

  GetHighLowOverview(sharecode) {
    try {
      const webMethod = this.interfaceUrl + 'GetHighLow';
      const that = this;
      const parameters = {
        "ShareCode" : sharecode
      };
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charser=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: (data) => {
          that.GethighLowSub.next(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  GetSharePriceHistory() {
    try {
      const webMethod = this.interfaceUrl + 'GetShareHistory';
      const that = this;
      const parameters = {};
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charser=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success: (data) => {
          that.GetShareHistorySub.next(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  GetPaymentHistoryData(notemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'DB_PayHistByProd_Data';
      const parameters = {
        NmId: notemasterID,
      };
      return this.http.post(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
  GetMTMHistoryData(notemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'GetMTMHistoryData';
      const parameters = {
        NMID: notemasterID,
        userID: this.authApi.UserName,
      };
      return this.http.post(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
}
