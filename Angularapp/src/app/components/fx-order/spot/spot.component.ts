import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApifunctionService } from '../apifunction.service';
import { CommonfunctionService } from '../commonfunction.service';
import { AppConfig } from 'src/app/services/config.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    sortBy(p): Array<T>;
  }
}

@Component({
  selector: 'app-spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.scss'],
})
export class SpotComponent implements OnInit, OnDestroy {
  ServiceResponse: any;
  Temp: any;
  Tenor: any;
  Errormsg: string;
  d = new Date();
  RadioButtonSelected: string;
  CurrencyList = [];
  CurrencyListS = [];
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
  CustomerBuyCurrency: string;
  CustomerSellCurrency: string;
  SelectSpreadCustomerrate: string;
  CustomerBuyAmount: string;
  CustomerSellAmount: string;
  MarginType: string;
  TradeDate: string;
  ValueDate: string;
  SpotDate: string;
  FixingDate: string;
  Spread: number;
  CustomerRate: any;
  BestPrice: string = '';
  temp2: any;
  CalRevenue: any;
  SessionID: string;
  ISOrderPlaced: boolean;
  S = [];
  sampleString1: string;
  sampleArray = [];
  tempNumber: number;
  PriceProvider: string;
  PriceProviderA: string;
  // Extra param
  PriceQuoteRef: string;
  SpotRate: string;
  SwapPoint: string;
  FinIQPriceQuoteId: string;
  ExternalQuoteID: string;
  PriceProviderId: string;
  TradeReferenceID: any;
  Pair_GoodorderYN: string;
  CPTradeReferenceID: any;
  BookingDateTime: any;
  SpreadRadio: any;
  CustomerRateRadio: any;
  IsStraightToExecution: boolean = true;
  PointShift: number;
  Ccy1AmountDecimal: number;
  loadflag: boolean;
  BuySellAmountFlag: boolean;
  OldCCyB: string;
  OldCCyS: string;
  OrderBlotterColumnNames = [];
  OrderBlotterArray = [];
  counter: number;
  StopRFSFlag: boolean;
  interval: any;
  elem: any;
  width: number;
  id: any;
  SpreadAmount: any;
  BookingDate: any;
  Asset1_DecimalAmount: any = '';
  Asset2_DecimalAmount: any = '';
  responseSaveArray: any = {};
  OrderBlotterVisibility: boolean;
  stringifiedData: any;
  PriceProviderArray = [];
  LivePricesArray = [];
  sampleobject: any;
  LoadingSpotFlag: boolean;
  LoadingBlotter: boolean = false;
  PricingLoadingFlag: boolean;
  TradeReferenceIDFlag: boolean;
  SpreadCustomerRateTriggered: boolean;
  SpreadUnconverted: any;
  RateDecimal: number;
  counterparty: string;

  LiveSpotrate: any;
  LiveSwapPoints: any;

  CcyPairDataSet: any[];
  LoginID: any;
  customerList: any[];

  CustomerName: string = '';
  CustomerCIF: string = '';
  CustomerSegment: string = '';
  RMName: string = '';
  DealerID: string = '';
  CustomerID: string = '';

  constructor(
    private apifunctions: ApifunctionService,
    public commonfunctions: CommonfunctionService
  ) {}

  ngOnInit(): void {
    this.LoginID = sessionStorage.getItem('Username');
    this.apifunctions.CustomerSearch('');
    this.apifunctions.CustomerListObserver.subscribe((res) => {
      if (res.length > 0) {
        this.customerList = res;
        this.customerList.forEach((ele) => {
          if ((ele.CustomerID = this.LoginID)) {
            this.CustomerCIF = ele.AH_CIF_No;
            this.CustomerName = ele.CustomerName;
            this.CustomerSegment = ele.AH_Customer_Segment;
            this.RMName = ele.RelManager;
            this.DealerID = ele.DealerID;
            this.CustomerID = ele.CustomerID;
          }
        });
      }
    });
    this.LoadingSpotFlag = false;
    this.PricingLoadingFlag = false;

    this.apifunctions.ResetGetAllTradablePairsSF();
    this.apifunctions.GetAllTradablePairsSFObserver.subscribe((res) => {
      if (res) {
        this.CcyPairDataSet = res;
        this.SetBuySellCcyPair();
        this.LoadingSpotFlag = true;
      }
    });

    this.apifunctions.ResetFXDatesForSpotForwardSFObserver();
    this.apifunctions.GetFXDatesForSpotForwardSFObserver.subscribe((res) => {
      if (res) {
        this.LoadingSpotFlag = true;
        this.ServiceResponse = res;
        this.Errormsg = '';
        if (this.ServiceResponse.Status === 'Succeed') {
          this.ServiceResponse = this.ServiceResponse.PairDates;
          this.ValueDate = this.ServiceResponse.PairDateInfo.FinIQValueDate;
          this.SpotDate = this.ServiceResponse.PairDateInfo.FinIQSpotDate;
          this.FixingDate = this.ServiceResponse.PairDateInfo.FinIQFixingDate;
        } else {
          this.Errormsg = this.Tenor + ' does not exist';
        }
      }
    });

    this.apifunctions.ResetGetCcyPairPointShiftDetailsSFObserver();
    this.apifunctions.GetCcyPairPointShiftDetailsSFObserver.subscribe((res) => {
      if (res) {
        // console.log(res);
        this.LoadingSpotFlag = true;
        // this.ngProgress.done();
        this.ServiceResponse = res['body'];
        this.PointShift = this.ServiceResponse[0].PointShift;
        this.RateDecimal = this.ServiceResponse[0].RateDecimal;
        this.Ccy1AmountDecimal = this.ServiceResponse[0].Ccy1AmountDecimal;
        this.Pair_GoodorderYN = this.ServiceResponse[0].Pair_GoodorderYN;
      }
    });

    this.apifunctions.ResetOrderBlotterDataSFObserver();
    this.apifunctions.OrderBlotterDataSFObserver.subscribe((res) => {
      if (res) {
        this.OrderBlotterArray = res.DUMMY;
        this.LoadingBlotter = false;
        if (this.OrderBlotterArray) {
          this.Errormsg = '';
          this.OrderBlotterVisibility = true;
        } else {
          this.OrderBlotterVisibility = false;
          this.Errormsg = 'No data found.';
        }
      }
    });
    this.apifunctions.GetQueuesforOrderBlotterSFObserver.subscribe((res) => {
      if (res) {
        this.OrderBlotterColumnNames = res.getWorkflowBlotterMetaDataResult;
        console.log(this.OrderBlotterColumnNames);
        // if (this.OrderBlotterArray) {
        //   this.OrderBlotterVisibility = true;
        // }
      }
    });

    // this.apifunctions.ResetGetBestPriceStreamForSF();
    // this.apifunctions.GetBestPriceStreamForSFObserver.subscribe(res => {
    //   if (res) {
    //     if (res.FinIQResponseHeader.Status === 'Succeed') {
    //       //    this.StartTimer();
    //       this.PriceQuoteRef = res.PriceEnquiryResponse.PriceQuoteRef;
    //       this.PriceProviderArray = res.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
    //       this.Errormsg = '';
    //       this.BestPrice = res.NearSpotRate;
    //     } else {
    //       this.loadflag = false;
    //       const reponse = res.PriceEnquiryResponse;
    //       this.Errormsg = reponse.ResponseDetails.Description;
    //     }
    //   }
    // });

    this.apifunctions.ResetFXBookDealObserver();
    this.apifunctions.GetFXBookDealObserver.subscribe((res) => {
      if (res) {
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.TradeReferenceID = res.TradeBookingResponse.TradeReferenceID;
          this.CPTradeReferenceID = res.TradeBookingResponse.CPTradeReferenceID;
          this.BookingDateTime = res.TradeBookingResponse.BookingDateTime;
          this.scrollWin();
        } else {
          const reponse = res.TradeBookingResponse;
          this.Errormsg = reponse.ResponseDetails.Description;
        }
        this.TradeReferenceIDFlag = false;
      }
    });
    this.DefaultValues();
    // (document.getElementById('secondDot')).classList.add('blink-one');

    // this.apifunction.GetQueuesForOrderBlotterSF('3', 'BOSSGAppUser10');
    // this.apifunctions.GetQueuesForOrderBlotterSFK('2067', 'Nilamv');
  }

  ngOnDestroy(): void {
    this.apifunctions.ResetFXDatesForSpotForwardSFObserver();
    this.apifunctions.ResetGetCcyPairPointShiftDetailsSFObserver();
    this.apifunctions.ResetFXBookDealObserver();
    this.StopRFS();
  }

  SetBuySellCcyPair() {
    this.CurrencyListS = [];
    this.CcyPairDataSet.forEach((element) => {
      if (this.CurrencyList.indexOf(element.Asset1) === -1) {
        this.CurrencyList.push(element.Asset1.toUpperCase());
      }
      if (element.Asset1 === 'EUR' || element.Asset1 === 'eur') {
        this.CurrencyListS.push(element.Asset2);
      }
      if (element.PairCode === 'EUR - USD') {
        // this.PointShift = element.DecimalRate;
        this.PointShift = element.PointShift;
        this.RateDecimal = element.DecimalRate;
        this.Ccy1AmountDecimal = element.DecimalRate;
        this.Pair_GoodorderYN = element.GoodOrderYN;
      }
    });
    console.log(this.PointShift, this.Ccy1AmountDecimal, this.Pair_GoodorderYN);
  }

  fnCustomerBuyCurrency(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerBuyCurrency = target.value;
    this.CurrencyListS = [];
    this.CcyPairDataSet.forEach((element) => {
      if (element.Asset1 === this.CustomerBuyCurrency) {
        this.CurrencyListS.push(element.Asset2);
        if (
          element.PairCode ===
          this.CustomerBuyCurrency + ' - ' + this.CurrencyListS[0]
        ) {
          this.PointShift = element.PointShift;
          // this.PointShift = element.DecimalRate;
          this.RateDecimal = element.DecimalRate;
          this.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
          this.Ccy1AmountDecimal = element.DecimalRate;
          this.Pair_GoodorderYN = element.GoodOrderYN;
        }
      }
    });
    this.CustomerSellCurrency = this.CurrencyListS[0];
    console.log(this.PointShift, this.Ccy1AmountDecimal, this.Pair_GoodorderYN);
    // if (this.CustomerBuyCurrency === this.CustomerSellCurrency) {
    //   this.Errormsg = 'Please select different Currency';
    // } else {
    this.Errormsg = '';
    this.ClearAll();
    this.ValueDate = '';
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXC'
    );
    // }
    //this.CustomerBuyAmount= this.commonfunctions.NotionalChange(this.CustomerBuyAmount,this.Asset1_DecimalAmount);
  }
  fnCustomerSellCurrency(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerSellCurrency = target.value;
    // if (this.CustomerSellCurrency === this.CustomerBuyCurrency) {
    //   this.Errormsg = 'Please select different Currency';
    // } else {
    //   this.Errormsg = '';
    this.ClearAll();
    this.ValueDate = '';
    this.CcyPairDataSet.forEach((element) => {
      if (
        element.PairCode ===
        this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency
      ) {
        this.PointShift = element.PointShift;
        // this.PointShift = element.DecimalRate;
        this.Asset2_DecimalAmount = element.Asset2_DecimalAmount;
        this.RateDecimal = element.DecimalRate;
        this.Ccy1AmountDecimal = element.DecimalRate;
        this.Pair_GoodorderYN = element.GoodOrderYN;
      }
    });
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXC'
    );
    // }
    // this.CustomerSellAmount= this.commonfunctions.NotionalChange(this.CustomerSellAmount,this.Asset2_DecimalAmount);
  }

  Tenor_Changed(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.Tenor = target.value;
    this.ClearAll();
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXC'
    );
    this.ValueDate = '';
  }

  CustomerRateTriggered() {
    this.SpreadCustomerRateTriggered = false;
    // this.SpreadUnconverted = '';
    // console.log(this.SpreadCustomerRateTriggered);
  }
  SpreadTriggered() {
    this.SpreadCustomerRateTriggered = true;
    // this.CustomerRate = '';
    // console.log(this.SpreadCustomerRateTriggered);
  }

  SubScrib(WebSocketIP, USERID) {
    const that = this;

    var ws = null;
    var rfqid;
    rfqid = Math.random();
    //alert($('#<%=hdn_WebsocketIP.ClientID%>').val());
    //alert(WebSocketIP);
    if (WebSocketIP === '' || WebSocketIP === undefined) {
      WebSocketIP = 'finiq523'; //$('#<%=hdn_WebsocketIP.ClientID%>').val();
    }
    var myPageName = 'FXDealEntryForDealer.aspx'; //path_Name.substring(path_Name.lastIndexOf('/') + 1);

    //alert(myModeName[1]);

    //alert(1);
    if (1 === 1) {
      //console.log('entered in fun');
      if (rfqid === '') {
      } else {
        $(document).ready(function () {
          try {
            //AshwiniS 'ICXRFS' mode checked
            // alert(myPageName);
            //console.log('Starting pricing process...');
            if (
              myPageName === 'FXDealEntryForDealer.aspx' ||
              myPageName === 'Trade_Workflow_Blotter.aspx'
            ) {
              var wsprotocol;
              if (location.protocol === 'http:') wsprotocol = 'ws:';
              else if (location.protocol === 'https:') wsprotocol = 'wss:';
              else wsprotocol = 'ws:';

              try {
                console.log('WebSocketIP', WebSocketIP);
                console.log('wsprotocol', wsprotocol);
                if (ws === null || ws === 'undefined') {
                  ws = new WebSocket(
                    '' +
                      wsprotocol +
                      '//' +
                      WebSocketIP +
                      '/FinIQService/WSCallback.svc'
                  );
                } else {
                  //added change by ashutosh/shubham
                  //alert('inside else ws not null...');
                  if (ws.readyState == WebSocket.OPEN) {
                    //if open no need to subscribe agin.
                    //alert('connection open subscribe again.');
                  } else {
                    //alert('connection closed re initialise WEB-SOCKET again.');
                    ws = new WebSocket(
                      '' +
                        wsprotocol +
                        '//' +
                        WebSocketIP +
                        '/FinIQService/WSCallback.svc'
                    );
                  }
                  //ws.send('MASTERSUBSCRIBE|' + USERID);
                }
              } catch (error) {
                //alert(error);
                console.log('Error occured while creating connection');
              }

              ws.onopen = function () {
                console.log('Socket Connection Opened');
                try {
                  // alert('After Open');
                  //console.log('Port is opened...');
                  // alert(ws.readyState);
                  if (ws.readyState === WebSocket.OPEN) {
                    // alert('value : ' + $('#<%=hdnUserID.ClientID%>').val());
                    //$('#<%=hdnUserID.ClientID%>').val()
                    //   ws.send('MASTERSUBSCRIBE|' + USERID);  mdw
                    ws.send('MASTERSUBSCRIBE|' + USERID);
                    //ws.Subscribe('MASTERSUBSCRIBE|' + USERID);

                    //alert(' After Subscription');
                  } else {
                    //alert('Connection is closed', 'success');
                  }
                } catch (er) {
                  console.log(er.message);
                }
              };

              ws.onmessage = function (evt) {
                console.log(evt.data);
                // alert('Received');
                try {
                  var msg = evt.data;
                  var strRes = JSON.parse(msg);
                  if (
                    ws.readyState === WebSocket.OPEN &&
                    strRes['MesssageType'].toUpperCase() === 'SUBSCRIBE'
                  ) {
                    // alert('SUBSCRIBED');
                  } else if (
                    ws.readyState === WebSocket.OPEN &&
                    strRes['MesssageType'].toUpperCase() === 'UNSUBSCRIBE'
                  ) {
                  } else {
                    if (that.StopRFSFlag) {
                      ws.close();
                      that.StopRFSFlag = false;
                    } else {
                      this.ServiceResponse = null;

                      this.ServiceResponse = JSON.parse(
                        strRes['MessageContent']
                      );
                      that.FinIQPriceQuoteId = this.ServiceResponse['QuoteId'];
                      that.ShowBestPriceProvider(
                        that.FinIQPriceQuoteId,
                        this.ServiceResponse['NearForwardRate'],
                        this.ServiceResponse['NearSpotRate'],
                        this.ServiceResponse['NearSwapPoint'],
                        this.ServiceResponse['ExternalQuoteID'],
                        this.ServiceResponse['PriceProviderId']
                      );

                      if (
                        document.getElementById(
                          'PriceProvider_' +
                            that.SessionID +
                            '_' +
                            this.ServiceResponse.PriceProviderId
                        ) != null &&
                        document.getElementById(
                          'PriceProvider_' +
                            that.SessionID +
                            '_' +
                            this.ServiceResponse.PriceProviderId
                        ) != undefined
                      ) {
                        document.getElementById(
                          'PriceProvider_' +
                            that.SessionID +
                            '_' +
                            this.ServiceResponse.PriceProviderId
                        ).innerHTML = this.ServiceResponse['NearForwardRate']; // that.PriceProviderId = this.ServiceResponse['PriceProviderId'];
                        that.responseSaveArray[
                          this.ServiceResponse.PriceProviderId
                        ] = {
                          NearForwardRate:
                            this.ServiceResponse['NearForwardRate'],
                          NearSpotRate: this.ServiceResponse['NearSpotRate'],
                          NearSwapPoint: this.ServiceResponse['NearSwapPoint'],
                          ExternalQuoteID:
                            this.ServiceResponse['ExternalQuoteID'],
                          PriceProviderId:
                            this.ServiceResponse['PriceProviderId'],
                          QuoteId: this.ServiceResponse['QuoteId'],
                        };
                      }
                      console.log(this.ServiceResponse);
                    }
                  }
                } catch (er) {
                  console.log(er.message);
                }
              };
              ws.onerror = function () {
                console.log('Error occured');

                //  alert('Error with code : ' + evt.code + '', 'error');
              };
              ws.onclose = function () {
                console.log('Socket Closed');
                try {
                  ws.close();
                } catch (er) {
                  console.log(er.message);
                }
              };
            }
          } catch (er) {
            console.log(er.message);
          }
        });
      }
    }
  }
  ShowBestPriceProvider(
    FiniQpricequoteID: string,
    FiniQBestPrice: string,
    SpotRate: string,
    SwapPoint: string,
    ExternalQuoteID: string,
    PriceProviderId: string
  ) {
    this.PriceProviderArray.forEach((element) => {
      if (Number(element.QuoteId) === Number(FiniQpricequoteID)) {
        this.PriceProviderA = element.PriceProviderCode;
        this.BestPrice = Number(FiniQBestPrice)
          .toFixed(this.RateDecimal)
          .toString();
        if (this.LivePricesArray) {
          if (this.ISContains(this.PriceProviderA)) {
            for (let j = 0; j < this.LivePricesArray.length; j++) {
              if (
                this.LivePricesArray[j].PriceProviderName ===
                this.PriceProviderA
              ) {
                this.AddpipestoNumber(this.Spread, this.BestPrice);
                this.LivePricesArray[j] = {
                  // eslint-disable-next-line quote-props
                  PriceProviderName: this.LivePricesArray[j].PriceProviderName,
                  Price: this.BestPrice,
                  SpotRate,
                  SwapPoint,
                  ExternalQuoteID,
                  CustomerRate: this.CustomerRate,
                  PriceProviderId,
                  FiniQpricequoteID,
                };
                this.sort_by_key(this.LivePricesArray, 'Price');
                this.FeedLivedata();
                break;
              }
            }
          } else {
            this.AddpipestoNumber(this.Spread, this.BestPrice);
            // eslint-disable-next-line quote-props
            this.LivePricesArray.push({
              PriceProviderName: this.PriceProviderA,
              Price: this.BestPrice,
              SpotRate,
              SwapPoint,
              ExternalQuoteID,
              CustomerRate: this.CustomerRate,
              PriceProviderId,
              FiniQpricequoteID,
            });
            this.sort_by_key(this.LivePricesArray, 'Price');
            this.FeedLivedata();
          }
        } else {
          this.AddpipestoNumber(this.Spread, this.BestPrice);
          // eslint-disable-next-line quote-props
          this.LivePricesArray.push({
            PriceProviderName: this.PriceProviderA,
            Price: this.BestPrice,
            SpotRate,
            SwapPoint,
            ExternalQuoteID,
            CustomerRate: this.CustomerRate,
            PriceProviderId,
            FiniQpricequoteID,
          });
          this.sort_by_key(this.LivePricesArray, 'Price');
          this.FeedLivedata();
        }
      }
    });
    this.scrollFun();
  }

  FeedLivedata() {
    this.BestPrice = Number(this.LivePricesArray[0].Price)
      .toFixed(this.RateDecimal)
      .toString();
    this.PriceProviderA = this.LivePricesArray[0].PriceProviderName;
    this.LiveSpotrate = this.LivePricesArray[0].SpotRate;
    this.LiveSwapPoints = this.LivePricesArray[0].SwapPoint;
    this.PriceProviderId = this.LivePricesArray[0].PriceProviderId;

    if (this.RadioButtonSelected === 'true') {
      // if(Spread entered) else(Customer rate entered)
      // this.CustomerRate = this.LivePricesArray[0].CustomerRate;
      this.CustomerRate = Number(
        Number(Number(this.BestPrice).toFixed(this.PointShift)) +
          Number(this.Spread)
      ).toFixed(this.PointShift);
      this.LivePricesArray[0].CustomerRate = this.CustomerRate;
    } else {
      this.SpreadUnconverted = Number(
        (
          (Number(this.CustomerRate) -
            Number(Number(this.BestPrice).toFixed(this.PointShift))) *
          Math.pow(10, this.PointShift)
        ).toFixed(this.PointShift)
      );
      this.Spread =
        Number(this.CustomerRate) -
        Number(Number(this.BestPrice).toFixed(this.PointShift));
      this.AddpipestoNumber(this.Spread, this.BestPrice);
    }
    this.Calculations();
  }
  ISContains(PriceProviderName: string) {
    for (const iterator of this.LivePricesArray) {
      if (iterator.PriceProviderName === PriceProviderName) {
        return true;
      }
    }
    return false;
  }
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  BuyAmountChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerBuyAmount = target.value.replace(/,/g, '');

    if (Number(this.CustomerBuyAmount) === 0) {
      this.CustomerBuyAmount = Number(0).toFixed(
        Number(this.Asset1_DecimalAmount)
      );
    } else {
      this.BuySellAmountFlag = false;
      this.CustomerSellAmount = Number(0).toFixed(
        Number(this.Asset2_DecimalAmount)
      );
    }
  }
  SellAmountChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerSellAmount = target.value.replace(/,/g, '');

    if (Number(this.CustomerSellAmount) === 0) {
      this.CustomerSellAmount = Number(0).toFixed(
        Number(this.Asset2_DecimalAmount)
      );
    } else {
      this.BuySellAmountFlag = true;
      this.CustomerBuyAmount = Number(0).toFixed(
        Number(this.Asset1_DecimalAmount)
      );
    }
  }
  MarginTypeChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.MarginType = target.value;
    this.ClearAll();
  }
  QuoteForBestPrice() {
    // this.GenerateSessionID();
    this.GenerateSessionID();
    // this.SubScrib('40.65.134.77', this.SessionID);
    // this.SubScrib(AppConfig.settings.CSP_FXPricingURL, this.SessionID);
    this.SubScrib(AppConfig.settings.CSP_FXPricingURL, this.LoginID);
    // this.SubScrib('52.163.118.116', this.SessionID);
    this.apifunctions.ResetGetBestPriceStreamForSF();
    this.apifunctions.GetBestPriceStreamForSFObserver.subscribe((res) => {
      if (res) {
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.PriceQuoteRef = res.PriceEnquiryResponse.PriceQuoteRef;
          this.PriceProviderArray =
            res.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
          this.Errormsg = '';
          this.BestPrice = Number(this.PriceProviderArray[0].NearSpotRate)
            .toFixed(this.RateDecimal)
            .toString();
          try {
            document.getElementById(
              'PriceProvider_' +
                this.SessionID +
                '_' +
                this.PriceProviderArray[0].PriceProviderId
            ).innerHTML = Number(this.PriceProviderArray[0].NearSpotRate)
              .toFixed(this.RateDecimal)
              .toString();
          } catch (ex) {}

          this.StartTimer();
        } else {
          this.loadflag = false;
          const reponse = res.PriceEnquiryResponse;
          this.Errormsg = reponse.ResponseDetails.Description;
        }
        // this.Errormsg = '';
        // this.BestPrice = this.ServiceResponse.NearSpotRate;
      }
    });
    this.responseSaveArray = {};
    this.PriceProviderArray = [];
    if (this.ValidatePricingRequest()) {
      if (!this.Errormsg) {
        this.ClearAll();
        this.loadflag = true;
        this.Spread = Number(this.SpreadAmount) / Math.pow(10, this.PointShift);
        this.StopRFSFlag = false;
        if (Number(this.CustomerBuyAmount.replace(/,/g, '')) === 0) {
          try {
            this.apifunctions.GetQuoteRequestforFXRateForCurrencyPairSFK(
              this.LoginID,
              'FXC',
              this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
              'sell',
              '0',
              this.CustomerSellAmount.replace(/,/g, ''),
              this.Spread,
              this.Tenor,
              this.IsStraightToExecution,
              this.MarginType,
              this.ValueDate,
              this.FixingDate,
              this.SessionID,
              this.PriceProvider,
              this.CustomerRate,
              this.SpotDate,
              this.CustomerCIF,
              this.CustomerName,
              this.CustomerSegment,
              this.RMName,
              this.DealerID
            );
          } catch (error) {
            // console.log(error);
            this.loadflag = false;
          }
        } else {
          try {
            this.apifunctions.GetQuoteRequestforFXRateForCurrencyPairSFK(
              this.LoginID,
              'FXC',
              this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
              'buy',
              this.CustomerBuyAmount.replace(/,/g, ''),
              '0',
              this.Spread,
              this.Tenor,
              this.IsStraightToExecution,
              this.MarginType,
              this.ValueDate,
              this.FixingDate,
              this.SessionID,
              this.PriceProvider,
              this.CustomerRate,
              this.SpotDate,
              this.CustomerCIF,
              this.CustomerName,
              this.CustomerSegment,
              this.RMName,
              this.DealerID
            );
          } catch (error) {
            // console.log(error);
          }
        }
      }
    }

    return false;
  }
  ValidatePricingRequest() {
    const BuyAmount = Number(this.CustomerBuyAmount.replace(/,/g, ''));
    const SellAmount = Number(this.CustomerSellAmount.replace(/,/g, ''));
    if (BuyAmount > 0 && SellAmount > 0) {
    } else {
      if (BuyAmount <= 1 && SellAmount <= 1) {
        this.Errormsg = 'Amount below 1 not allowed';
        return false;
      }
    }
    if (this.CustomerBuyCurrency === this.CustomerSellCurrency) {
      this.Errormsg = 'Please select different Currency';
      return false;
    }
    this.Errormsg = '';
    return true;
  }
  Calculations() {
    if (this.Pair_GoodorderYN === 'Y') {
      if (this.BuySellAmountFlag) {
        // console.log(this.CustomerSellAmount, parseInt(this.LivePricesArray[0].Price));
        // this.CustomerBuyAmount = (this.CustomerSellAmount / parseFloat(this.BestPrice));
        this.CustomerBuyAmount = (
          Number(this.CustomerSellAmount.replace(/,/g, '')) /
          parseFloat(this.LivePricesArray[0].CustomerRate)
        ).toFixed(2);
        this.CustomerBuyAmount = this.commonfunctions.FormatNumberwithoutevent(
          this.CustomerBuyAmount
        );
        // this.BuySellAmountFlag = true;
      } else {
        // console.log(this.CustomerBuyAmount, parseInt(this.LivePricesArray[0].Price));
        this.CustomerSellAmount = (
          Number(this.CustomerBuyAmount.replace(/,/g, '')) *
          parseFloat(this.LivePricesArray[0].CustomerRate)
        ).toFixed(2);
        this.CustomerSellAmount = this.commonfunctions.FormatNumberwithoutevent(
          this.CustomerSellAmount
        );
        // this.BuySellAmountFlag = false;
      }
    } else {
      if (this.BuySellAmountFlag) {
        // console.log(this.CustomerSellAmount, parseInt(this.LivePricesArray[0].Price));
        // this.CustomerBuyAmount = (this.CustomerSellAmount / parseFloat(this.BestPrice));
        this.CustomerBuyAmount = (
          Number(this.CustomerSellAmount.replace(/,/g, '')) *
          parseFloat(this.LivePricesArray[0].CustomerRate)
        ).toFixed(2);
        this.CustomerBuyAmount = this.commonfunctions.FormatNumberwithoutevent(
          this.CustomerBuyAmount
        );
        // this.BuySellAmountFlag = true;
      } else {
        // console.log(this.CustomerBuyAmount, parseInt(this.LivePricesArray[0].Price));
        this.CustomerSellAmount = (
          Number(this.CustomerBuyAmount.replace(/,/g, '')) /
          parseFloat(this.LivePricesArray[0].CustomerRate)
        ).toFixed(2);
        this.CustomerSellAmount = this.commonfunctions.FormatNumberwithoutevent(
          this.CustomerSellAmount
        );
        // this.BuySellAmountFlag = false;
      }
    }
  }
  SpreadRatechanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.SpreadAmount = Number(target.value);
    this.Spread = Number(this.SpreadAmount) / Math.pow(10, this.PointShift);
    if (this.BestPrice) {
      this.AddpipestoNumber(0, '');
    }
    if (this.SpreadUnconverted > 0) {
      this.Errormsg = '';
    }
    // this.CustomerRate = '';
  }
  CustomerRateChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerRate = target.value;
    if (this.BestPrice) {
      this.AddpipestoNumber(0, '');
    }
    // this.SpreadUnconverted = '';
    // this.Spread = 0;
  }
  AddpipestoNumber(_pipes: number, _Rate: string) {
    // var modifiedPipes = (Number(pipes) / Math.pow(10, this.PointShift));

    // Rate = '' + (Number(Rate) + modifiedPipes).toFixed(this.PointShift);
    if (this.Pair_GoodorderYN === 'Y') {
      this.CalRevenue =
        Number(this.CustomerBuyAmount.replace(/,/g, '')) * Number(this.Spread);
    } else {
      this.CalRevenue =
        Number(this.CustomerSellAmount.replace(/,/g, '')) * Number(this.Spread);
    }
  }
  calculateCustRateForNonBestPrice(rate: string) {
    let custRate: any = '';
    if (this.Pair_GoodorderYN === 'Y') {
      custRate = Number(rate) + Number(this.Spread);
    } else {
      custRate = Number(rate) - Number(this.Spread);
    }
    return custRate;
  }
  PriceProviderChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.PriceProvider = target.value;
    this.BestPrice = null;
  }
  BookDeal(PriceProviderId: string, PriceProviderCode: string) {
    this.StopRFS();
    if (
      Number(this.CustomerSellAmount.replace(/,/g, '')) < 1 &&
      Number(this.CustomerBuyAmount.replace(/,/g, '')) < 1
    ) {
      this.Errormsg = 'Notional Amount should be greater then 0.';
    } else if (
      Number(this.SpreadUnconverted) >= 0 ||
      this.SpreadUnconverted === ''
    ) {
      this.Errormsg = '';
      this.TradeReferenceIDFlag = true;
      if (PriceProviderId === undefined) {
        this.apifunctions.BookOrderforSFK(
          this.LoginID,
          this.PriceQuoteRef,
          'FXC',
          this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
          'buy',
          this.CustomerBuyAmount.replace(/,/g, ''),
          this.CustomerSellAmount.replace(/,/g, ''),
          this.LivePricesArray[0].Price,
          this.LivePricesArray[0].CustomerRate,
          this.FixingDate,
          this.ValueDate,
          this.Tenor,
          this.Spread + '',
          '0',
          this.LivePricesArray[0].SpotRate,
          this.LivePricesArray[0].SwapPoint,
          this.Tenor,
          this.LivePricesArray[0].FiniQpricequoteID,
          this.LivePricesArray[0].ExternalQuoteID,
          this.LivePricesArray[0].PriceProviderId,
          this.SpotDate,
          this.CalRevenue,
          this.MarginType,
          this.IsStraightToExecution
        );
        this.counterparty = this.LivePricesArray[0].PriceProviderName;
      } else {
        console.log(this.responseSaveArray[PriceProviderId]);
        this.apifunctions.BookOrderforSFK(
          this.LoginID,
          this.PriceQuoteRef,
          'FXC',
          this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
          'buy',
          this.CustomerBuyAmount.replace(/,/g, ''),
          this.CustomerSellAmount.replace(/,/g, ''),
          this.responseSaveArray[PriceProviderId].NearForwardRate,
          this.calculateCustRateForNonBestPrice(
            this.responseSaveArray[PriceProviderId].NearForwardRate
          ),
          this.FixingDate,
          this.ValueDate,
          this.Tenor,
          this.Spread + '',
          '0',
          this.responseSaveArray[PriceProviderId].NearSpotRate,
          this.responseSaveArray[PriceProviderId].NearSwapPoint,
          this.Tenor,
          this.responseSaveArray[PriceProviderId].QuoteId,
          this.responseSaveArray[PriceProviderId].ExternalQuoteID,
          this.responseSaveArray[PriceProviderId].PriceProviderId,
          this.SpotDate,
          this.CalRevenue,
          this.MarginType,
          this.IsStraightToExecution
        );
        this.counterparty = PriceProviderCode;
      }
    } else {
      this.Errormsg = 'Spread is negative. Cannot proceed.';
    }
    this.StopTimer();

    // this.responseSaveArray = {};
    //  this.PriceProviderArray = [];
    return false;
  }
  ClearAll() {
    if (this.BestPrice) {
      // this.RadioButtonSelected === 'true' ? this.CustomerRate = '' : this.SpreadUnconverted = '';
      this.CustomerRate = '';
      this.Spread = 0;
      this.SpreadAmount = '';
      this.SpreadUnconverted = '';
      this.Errormsg = '';
    }
    if (this.Errormsg.includes('No prices')) {
      this.Errormsg = '';
    }
    this.BestPrice = '';
    this.PriceQuoteRef = '';
    this.TradeReferenceID = '';
    this.CPTradeReferenceID = '';
    // this.TradeReferenceIDFlag = false;
    this.BookingDateTime = '';
    // this.CustomerRate = '';
    this.CalRevenue = '';
    this.SpotRate = '';
    this.SwapPoint = '';
    this.ExternalQuoteID = '';
    this.FinIQPriceQuoteId = '';
    this.PriceProviderId = '';
    this.loadflag = false;

    this.OrderBlotterVisibility = false;
    // this.Errormsg = '';
    if (this.BuySellAmountFlag) {
      this.CustomerBuyAmount = Number(0).toFixed(
        Number(this.Asset1_DecimalAmount)
      );
    } else {
      this.CustomerSellAmount = Number(0).toFixed(
        Number(this.Asset2_DecimalAmount)
      );
    }
    this.LivePricesArray = [];

    this.apifunctions.ResetOrderBlotterDataSFObserver();
    this.LiveSpotrate = '';
    this.LiveSwapPoints = '';
    // this.Spread = null;
    return false;
  }
  ClearEnteredValues() {
    this.Spread = null;
    this.BestPrice = '';
  }
  DefaultValues() {
    this.GenerateSessionID();
    this.apifunctions.GetAllTradablePairs();
    this.TradeReferenceIDFlag = false;
    this.ISOrderPlaced = false;
    this.ServiceResponse = null;
    this.OrderBlotterVisibility = false;
    this.BuySellAmountFlag = false;
    this.IsStraightToExecution = true;
    // //console.log(this.apifunctions.AuthenticateUser());
    this.RadioButtonSelected = 'true';
    this.CustomerRate = '';
    let Daystring;
    const Day = this.d.getDate();
    if (Day < 10) {
      Daystring = '0' + Day;
    } else {
      Daystring = '' + Day;
    }
    this.TradeDate =
      Daystring +
      '-' +
      this.months[this.d.getMonth()] +
      '-' +
      this.d.getFullYear();
    this.CustomerBuyCurrency = 'EUR';
    this.OldCCyB = this.CustomerBuyCurrency;
    this.CustomerSellCurrency = 'USD';
    this.OldCCyS = this.CustomerSellCurrency;
    // this.CustomerSellAmount = '0';
    this.Spread = 0;
    this.SpreadAmount = 0;
    this.SpreadUnconverted = '';
    this.PriceProvider = 'BNP,Citi,JPM,OCBC,UBS';
    this.CustomerBuyAmount = '1,000,000.00';
    this.CustomerSellAmount = Number(0).toFixed(
      Number(this.Asset2_DecimalAmount)
    );
    this.Tenor = 'Spot';
    this.TradeReferenceID = null;
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXC'
    );
    // this.CustomerRate = '';
    this.MarginType = 'fx';
    this.SpreadCustomerRateTriggered = true;

    this.apifunctions.GetCcyPairPointShiftDetails(
      'PAIR',
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      'FXCAPI',
      sessionStorage.getItem('HomeEntityID'),
      'FXC'
    );
    // this.apifunctions.getcurrencypairsdetails('PAIR', this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency, '', 'FXCAPI');

    this.SelectSpreadCustomerrate = 'Spread';
    this.LivePricesArray = [];
    this.LiveSpotrate = '';
    this.LiveSwapPoints = '';
  }
  GenerateSessionID() {
    this.SessionID = '_' + Math.random().toString(36).substr(2, 9);
  }
  scrollWin() {
    // window.scrollTo(0, 5500);
    const Day = this.d.getDate();
    if (Day < 10) {
    } else {
    }
    this.LoadingBlotter = true;

    // this.apifunctions.OrderBlotterforSFK('0', '01-Jun-2019', today, 'ORDER', this.LoginID, '10');
  }
  FormatDateAsFNQSTD(Datestr: string) {
    const months = [
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
    let dateArray = [];
    dateArray = Datestr.split('T');
    dateArray = dateArray[0].split('-');
    return (
      dateArray[2] + '-' + months[Number(dateArray[1])] + '-' + dateArray[0]
    );
  }
  FormatNumberwithoutevent(amount: string) {
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
  IsValidReponse(str: any) {
    if (str === undefined) {
      return false;
    }
    return Object.keys(str).length === 0;
  }
  delay(delay: number) {
    return new Promise((r) => {
      setTimeout(r, delay);
    }).catch((err) => console.log(err));
  }
  doTimer() {
    try {
      this.counter = 70;
      this.interval = setInterval(() => {
        if (this.counter > 1) {
          try {
            // (document.getElementById('myBar')).style.width = this.counter + '%';
            if (this.counter <= 70 && this.counter >= 60) {
              try {
                document
                  .getElementById('seventhDot')
                  .classList.add('blink-one');
              } catch (error) {
                console.log(error);
              }
            }
            if (this.counter === 60) {
              document.getElementById('seventhDot').style.display = 'none';
              document.getElementById('sixthDot').classList.add('blink-one');
            }
            if (this.counter === 50) {
              document.getElementById('sixthDot').style.display = 'none';
              document.getElementById('fifthDot').classList.add('blink-one');
            }
            if (this.counter === 40) {
              document.getElementById('fifthDot').style.display = 'none';
              document.getElementById('fourthDot').classList.add('blink-one');
            }
            if (this.counter === 30) {
              document.getElementById('fourthDot').style.display = 'none';
              document.getElementById('thirdDot').classList.add('blink-one');
            }
            if (this.counter === 20) {
              document.getElementById('thirdDot').style.display = 'none';
              document.getElementById('secondDot').classList.add('blink-one');
            }
            if (this.counter === 10) {
              document.getElementById('secondDot').style.display = 'none';
              document.getElementById('firstDot').classList.add('blink-one');
            }
          } catch (e) {
            console.log(e);
          }
          this.counter--;
        } else {
          document.getElementById('firstDot') != null
            ? (document.getElementById('firstDot').style.display = 'none')
            : '';
          this.ResetTimer();
          this.ClearAll();
          this.StopRFS();
          //    this.counter = 70;
        }
      }, 1000);
    } catch (ex) {
      console.log('error occured in doTimer: ', ex);
    }
  }
  StartTimer() {
    clearInterval(this.interval);
    this.counter = 70;
    this.PricingLoadingFlag = true;
    this.doTimer();
  }
  StopTimer() {
    this.ResetTimer();
    this.ClearAll();
    this.StopRFS();
    this.PricingLoadingFlag = false;
    this.counter = 70;
    this.PriceProviderArray = [];
    clearInterval(this.interval);
    return false;
  }
  ValueChanged() {
    this.ResetTimer();
    this.StopRFS();
  }
  ResetTimer() {
    try {
      clearInterval(this.interval);
      if (this.PricingLoadingFlag) {
        document.getElementById('seventhDot').classList.remove('blink-one');
        document.getElementById('seventhDot').style.display = 'block';
        document.getElementById('sixthDot').classList.remove('blink-one');
        document.getElementById('sixthDot').style.display = 'block';
        document.getElementById('fifthDot').classList.remove('blink-one');
        document.getElementById('fifthDot').style.display = 'block';
        document.getElementById('fourthDot').classList.remove('blink-one');
        document.getElementById('fourthDot').style.display = 'block';
        document.getElementById('thirdDot').classList.remove('blink-one');
        document.getElementById('thirdDot').style.display = 'block';
        document.getElementById('secondDot').classList.remove('blink-one');
        document.getElementById('secondDot').style.display = 'block';
        document.getElementById('firstDot').classList.remove('blink-one');
        document.getElementById('firstDot').style.display = 'block';
      }
      this.PricingLoadingFlag = false;
      this.counter = 0;
      // this.responseSaveArray = {};
      this.PriceProviderArray = [];
      return false;
    } catch (ex) {
      console.log(ex.message);
    }
    return false;
  }
  StopRFS() {
    this.StopRFSFlag = true;
    return false;
  }
  GoForPrice() {
    if (
      this.CurrencyList.length > 0 &&
      this.CurrencyListS.length > 0 &&
      this.ValueDate !== '' &&
      (this.CustomerBuyAmount !== '' || this.CustomerSellAmount !== '')
    ) {
      return false;
    } else {
      return true;
    }
  }
  scrollFun() {
    try {
      setTimeout(function () {
        document
          .getElementById('orderDivSpot')
          .scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
}
