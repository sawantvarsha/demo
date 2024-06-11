import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApifunctionService } from '../apifunction.service';
import { CommonfunctionService } from '../commonfunction.service';
import { DOCUMENT } from '@angular/common';
import { AppConfig } from 'src/app/services/config.service';

declare global {
  interface Array<T> {
    sortBy(p): Array<T>;
  }
}

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.scss'],
})
export class ForwardComponent implements OnInit, OnDestroy {
  ServiceResponse: any;
  Temp: any;
  Tenor: any;
  Errormsg: string;
  d = new Date();
  // eslint-disable-next-line max-len
  // CurrencyList = ['AED', 'AUD', 'CAD', 'CHF', 'CNH', 'EUR', 'GBP', 'HKD', 'INR', 'JPY', 'NOK', 'NZD', 'SEK', 'SGD', 'THB', 'USD', 'XAG', 'XAU', 'ZAR'];
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
  Spread: number;
  CustomerRate: any;
  BestPrice: string;
  RateDecimal: number = 4;
  temp2: any;
  SpotRate: any;
  SwapPoints: any;
  SpotDate: any;
  BuySellAmountFlag: boolean;
  SessionID: string;
  counterparty: string;

  Asset2_DecimalAmount: any = '';
  Asset1_DecimalAmount: any = '';
  S = [];
  LivePricesArray = [];
  sampleString1: string;
  sampleArray = [];
  tempNumber: number;
  CalRevenue: any;
  PriceQuoteRef: string;

  PriceProvider: string;
  PriceProviderA: string;
  FixingDate: string;

  SwapPoint: string;
  FinIQPriceQuoteId: string;
  ExternalQuoteID: string;
  PriceProviderId: string;
  TradeReferenceID: any;
  CPTradeReferenceID: any;
  BookingDateTime: any;
  IsStraightToExecution: boolean;
  PointShift: number;
  Ccy1AmountDecimal: number;
  RadioButtonSelected: string;
  loadflag: boolean;
  OrderBlotterArray = [];
  OrderBlotterVisibility: boolean;
  PriceProviderArray = [];
  ISOrderPlaced: boolean;
  AllSortedPrice = [];
  ws: any = null;
  counter: number;
  StopRFSFlag: boolean;
  LoadingForwardFlag: boolean;
  LoadingBlotter: boolean = false;
  PricingLoadingFlag: boolean;
  interval: any;
  TradeReferenceIDFlag: boolean;
  Pair_GoodorderYN: string;
  SpreadCustomerRateTriggered: boolean;
  SpreadUnconverted: any;
  SpreadAmount: any;

  CcyPairDataSet: any[];
  responseSaveArray: any = {};
  LoginID: any;
  customerList: any[];

  CustomerName: string = '';
  CustomerCIF: string = '';
  CustomerSegment: string = '';
  RMName: string = '';
  DealerID: string = '';
  CustomerID: string = '';

  constructor(
    @Inject(DOCUMENT) _document,
    private apifunctions: ApifunctionService,
    public commonfunctions: CommonfunctionService
  ) {}

  ngOnInit(): void {
    this.LoginID = sessionStorage.getItem('Username');
    this.LoadingForwardFlag = false;
    this.PricingLoadingFlag = false;
    this.ISOrderPlaced = false;

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

    this.apifunctions.ResetGetAllTradablePairsSF();
    this.apifunctions.GetAllTradablePairsSFObserver.subscribe((res) => {
      if (res) {
        this.CcyPairDataSet = res;
        this.SetBuySellCcyPair();
        this.LoadingForwardFlag = true;
      }
    });

    this.apifunctions.ResetFXDatesForSpotForwardSFObserver();
    this.apifunctions.GetFXDatesForSpotForwardSFObserver.subscribe((res) => {
      if (res) {
        this.ServiceResponse = res;
        this.Errormsg = '';
        if (this.ServiceResponse.Status === 'Succeed') {
          // console.log('dates Service response: Succeed');
          this.ServiceResponse = this.ServiceResponse.PairDates;
          this.ValueDate = this.ServiceResponse.PairDateInfo.FinIQValueDate;
          this.SpotDate = this.ServiceResponse.PairDateInfo.FinIQSpotDate;
          this.FixingDate = this.ServiceResponse.PairDateInfo.FinIQFixingDate;
        } else {
          // console.log('dates Service response: failed');
          this.Errormsg = this.Tenor + ' does not exist';
        }
        this.LoadingForwardFlag = true;
      }
    });

    this.apifunctions.ResetGetCcyPairPointShiftDetailsSFObserver();
    this.apifunctions.GetCcyPairPointShiftDetailsSFObserver.subscribe((res) => {
      if (res) {
        this.ServiceResponse = res['body'];
        this.PointShift = this.ServiceResponse[0].PointShift;
        this.RateDecimal = this.ServiceResponse[0].RateDecimal;
        this.Ccy1AmountDecimal = this.ServiceResponse[0].Ccy1AmountDecimal;
        this.Pair_GoodorderYN = this.ServiceResponse[0].Pair_GoodorderYN;
        // console.log(this.PointShift, this.Ccy1AmountDecimal);
      }
    });

    this.apifunctions.ResetOrderBlotterDataSFObserver();
    this.ServiceResponse = null;
    this.DefaultValues();
    this.OrderBlotterArray = [];
    this.apifunctions.OrderBlotterDataSFObserver.subscribe((res) => {
      if (res) {
        this.OrderBlotterArray = res.DUMMY;
        this.LoadingBlotter = false;
        if (this.OrderBlotterArray) {
          this.OrderBlotterVisibility = true;
        } else {
          this.OrderBlotterVisibility = false;
          this.Errormsg = 'No data found.';
        }
      }
    });

    this.apifunctions.ResetFXBookDealObserver();
    this.apifunctions.GetFXBookDealObserver.subscribe((res) => {
      if (res) {
        this.TradeReferenceIDFlag = false;
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.TradeReferenceID = res.TradeBookingResponse.TradeReferenceID;
          this.CPTradeReferenceID = res.TradeBookingResponse.CPTradeReferenceID;
          this.BookingDateTime = res.TradeBookingResponse.BookingDateTime;
          this.scrollWin();
        } else {
          const reponse = res.TradeBookingResponse;
          this.Errormsg = reponse.ResponseDetails.Description;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.apifunctions.ResetFXDatesForSpotForwardSFObserver();
    this.apifunctions.ResetGetCcyPairPointShiftDetailsSFObserver();
    // this.apifunctions.ResetOrderBlotterDataSFObserver();
    this.apifunctions.ResetFXBookDealObserver();
  }

  SetBuySellCcyPair() {
    // Buy ccy box
    this.ClearAll();
    this.CcyPairDataSet.forEach((element) => {
      if (this.CurrencyList.indexOf(element.Asset1) === -1) {
        this.CurrencyList.push(element.Asset1.toUpperCase());
      }
      if (element.Asset1 === 'EUR' || element.Asset1 === 'eur') {
        this.CurrencyListS.push(element.Asset2.toUpperCase());
      }
      if (element.PairCode === 'EUR - USD') {
        this.PointShift = element.PointShift;
        this.RateDecimal = element.DecimalRate;
        this.Ccy1AmountDecimal = element.DecimalRate;
        this.Pair_GoodorderYN = element.GoodOrderYN;
      }
    });
  }

  DefaultValues() {
    this.GenerateSessionID();
    this.apifunctions.GetAllTradablePairs();
    this.TradeReferenceIDFlag = false;
    this.BuySellAmountFlag = false;
    this.RadioButtonSelected = 'true';
    this.IsStraightToExecution = true;
    this.OrderBlotterVisibility = false;
    this.PriceProvider = 'BNP,Citi,JPM,OCBC,UBS';
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
    this.CustomerRate = '';
    this.CustomerSellCurrency = 'USD';
    this.CustomerBuyAmount = '1,000,000.00';
    this.CustomerSellAmount = '0.00';
    this.Spread = 0;
    this.Tenor = '1W';
    this.TradeReferenceID = null;
    this.SpreadCustomerRateTriggered = true;

    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXW'
    );
    this.ValueDate = '';
    // this.CustomerRate = '0.00';
    this.MarginType = 'fx';
    this.SpotRate = '';
    this.apifunctions.GetCcyPairPointShiftDetails(
      'PAIR',
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      'FXCAPI',
      sessionStorage.getItem('HomeEntityID'),
      'FXW'
    );
    this.SelectSpreadCustomerrate = 'Spread';
    this.SpreadAmount = '';
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
          this.RateDecimal = element.DecimalRate;
          this.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
          this.Ccy1AmountDecimal = element.DecimalRate;
          this.Pair_GoodorderYN = element.GoodOrderYN;
        }
      }
    });
    this.CustomerSellCurrency = this.CurrencyListS[0];
    console.log(this.PointShift, this.Ccy1AmountDecimal, this.Pair_GoodorderYN);
    this.Errormsg = '';
    this.ClearAll();
    this.ValueDate = '';
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      1,
      'FXC'
    );
  }
  fnCustomerSellCurrency(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.CustomerSellCurrency = target.value;
    if (this.CustomerSellCurrency === this.CustomerBuyCurrency) {
      this.Errormsg = 'Please select different Currency';
    } else {
      this.Errormsg = '';
      this.ClearAll();
      this.ValueDate = '';
      this.CcyPairDataSet.forEach((element) => {
        if (
          element.PairCode ===
          this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency
        ) {
          this.PointShift = element.PointShift;
          this.RateDecimal = element.DecimalRate;
          this.Asset2_DecimalAmount = element.Asset2_DecimalAmount;
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
    }
  }

  Tenor_Changed(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.Tenor = target.value;
    this.ClearAll();
    this.apifunctions.GetFXDatesForSpotForwardSFK(
      this.CustomerBuyCurrency + ' - ' + this.CustomerSellCurrency,
      this.Tenor,
      2,
      'FXW'
    );
    this.ValueDate = '';
  }
  CustomerRateTriggered(_e) {
    this.SpreadCustomerRateTriggered = false;
    // this.SpreadUnconverted = '';
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
  SpreadTriggered(_e) {
    this.SpreadCustomerRateTriggered = true;
    // this.CustomerRate = '';
  }

  SubScrib(WebSocketIP, USERID) {
    this.ws = null;
    const that = this;

    if (WebSocketIP === '' || WebSocketIP === undefined) {
      WebSocketIP = 'finiq523'; //$('#<%=hdn_WebsocketIP.ClientID%>').val();
    }

    try {
      let wsprotocol;
      if (location.protocol === 'http:') wsprotocol = 'ws:';
      else if (location.protocol === 'https:') wsprotocol = 'wss:';
      else wsprotocol = 'ws:';

      try {
        if (this.ws === null || this.ws === 'undefined') {
          this.ws = new WebSocket(
            '' +
              wsprotocol +
              '//' +
              WebSocketIP +
              '/FinIQService/WSCallback.svc'
          );
        } else {
          //added change by ashutosh/shubham
          //alert('inside else ws not null...');
          if (this.ws.readyState == WebSocket.OPEN) {
            //if open no need to subscribe agin.
            //alert('connection open subscribe again.');
          } else {
            //alert('connection closed re initialise WEB-SOCKET again.');
            this.ws = new WebSocket(
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
      }

      this.ws.onopen = function () {
        try {
          // alert('After Open');
          //console.log('Port is opened...');
          // alert(this.ws.readyState);
          if (that.ws.readyState === WebSocket.OPEN) {
            // alert('value : ' + $('#<%=hdnUserID.ClientID%>').val());
            //$('#<%=hdnUserID.ClientID%>').val()
            //   this.ws.send('MASTERSUBSCRIBE|' + USERID);  mdw
            that.ws.send('MASTERSUBSCRIBE|' + USERID);
            //this.ws.Subscribe('MASTERSUBSCRIBE|' + USERID);

            //alert(' After Subscription');
          } else {
            //alert('Connection is closed', 'success');
          }
        } catch (er) {
          console.log(er.message);
        }
      };

      this.ws.onmessage = function (evt) {
        // alert('Received');
        try {
          let msg = evt.data;
          let strRes = JSON.parse(msg);
          if (
            that.ws.readyState === WebSocket.OPEN &&
            strRes['MesssageType'].toUpperCase() === 'SUBSCRIBE'
          ) {
            // alert('SUBSCRIBED');
          } else if (
            that.ws.readyState === WebSocket.OPEN &&
            strRes['MesssageType'].toUpperCase() === 'UNSUBSCRIBE'
          ) {
          } else {
            if (that.StopRFSFlag) {
              that.ws.close();
              that.StopRFSFlag = false;
            } else {
              this.ServiceResponse = null;
              this.ServiceResponse = JSON.parse(strRes['MessageContent']);
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
                that.responseSaveArray[this.ServiceResponse.PriceProviderId] = {
                  NearForwardRate: this.ServiceResponse['NearForwardRate'],
                  NearSpotRate: this.ServiceResponse['NearSpotRate'],
                  NearSwapPoint: this.ServiceResponse['NearSwapPoint'],
                  ExternalQuoteID: this.ServiceResponse['ExternalQuoteID'],
                  PriceProviderId: this.ServiceResponse['PriceProviderId'],
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
      this.ws.onerror = function (_evt) {
        //  alert('Error with code : ' + evt.code + '', 'error');
      };
      this.ws.onclose = function (_evt) {
        try {
          console.log('socket is closing...');
          //that.ws.close();
          //
          if (document.getElementById('ctl00_hdnBOSDealEntry') != null) {
            // document.getElementById('ctl00_hdnBOSDealEntry').value == '';
          }
          //   SubScrib(WebSocketIP, USERID);
        } catch (er) {
          console.log(er.message);
        }
      };
      //   }
    } catch (er) {
      console.log(er.message);
    }
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

  QuoteForBestPrice() {
    this.GenerateSessionID();
    this.SubScrib(AppConfig.settings.CSP_FXPricingURL, this.SessionID);
    // this.SubScrib('40.65.134.77', );
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
          document.getElementById(
            'PriceProvider_' +
              this.SessionID +
              '_' +
              this.PriceProviderArray[0].PriceProviderId
          ).innerHTML = this.BestPrice;
          // this.ServiceResponse = this.PriceProviderArray[0];
          this.StartTimer();
        } else {
          this.loadflag = false;
          const reponse = res.PriceEnquiryResponse;
          this.Errormsg = reponse.ResponseDetails.Description;
        }
        //this.Errormsg = '';
        // this.BestPrice = this.ServiceResponse.NearSpotRate;
      }
    });

    this.responseSaveArray = {};
    this.PriceProviderArray = [];
    if (this.ValidatePricingRequest()) {
      if (!this.Errormsg) {
        //   this.ClearAll();
        this.Spread = Number(this.SpreadAmount) / Math.pow(10, this.PointShift);
        this.loadflag = true;
        this.StopRFSFlag = false;

        if (Number(this.CustomerBuyAmount.replace(/,/g, '')) === 0) {
          this.StopRFSFlag = false;
          this.ServiceResponse = '';
          this.ServiceResponse =
            this.apifunctions.GetQuoteRequestforFXRateForCurrencyPairSFK(
              this.LoginID,
              'FXW',
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
        } else {
          this.StopRFSFlag = false;
          this.ServiceResponse =
            this.apifunctions.GetQuoteRequestforFXRateForCurrencyPairSFK(
              this.LoginID,
              'FXW',
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
        }
        // this.responseSaveArray = {};
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
  SortByPrice(x, y) {
    return x.Price - y.Price;
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
    this.SpotRate = this.LivePricesArray[0].SpotRate;
    this.SwapPoints = this.LivePricesArray[0].SwapPoint;
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
    this.LivePricesArray.forEach((element) => {
      if (element.PriceProviderName === PriceProviderName) {
        return true;
      }
    });
    return false;
  }
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  SpotRateChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.SpotRate = target.value;
    this.ClearAll();
  }
  SwapPointsChanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    this.SwapPoints = target.value;
  }
  AddpipestoNumber(_pipes: number, _Rate: string) {
    if (this.Pair_GoodorderYN === 'Y') {
      this.CalRevenue =
        Number(this.CustomerBuyAmount.replace(/,/g, '')) * Number(this.Spread);
    } else {
      this.CalRevenue =
        Number(this.CustomerSellAmount.replace(/,/g, '')) * Number(this.Spread);
    }
    //this.Pair_GoodorderYN === 'Y' ? this.CalRevenue = (Number(this.CustomerBuyAmount.replace(/,/g, '')) * (Number(this.Spread))) : this.CalRevenue = (Number(this.CustomerSellAmount.replace(/,/g, '')) * (Number(this.Spread)));
  }
  SpreadRatechanged(e) {
    const target = this.commonfunctions.GetEventTarget(e);
    // this.Spread = (Number(target.value) / Math.pow(10, this.PointShift));
    this.SpreadAmount = Number(target.value);
    this.Spread = Number(this.SpreadAmount) / Math.pow(10, this.PointShift);
    // this.SpreadUnconverted.toFixed(2);
    if (this.BestPrice) {
      this.AddpipestoNumber(0, '');
    }
    if (this.SpreadUnconverted > 0) {
      this.Errormsg = '';
    }
  }
  formatRate(amount: string) {
    this.S = [];
    this.S = amount.split('.');
    this.S[1] = this.S[1].substring(0, 4);
    return this.S[0] + '.' + this.S[1];
  }
  formatNumber(amount: any) {
    this.sampleString1 = amount;
    this.S = [];
    this.S = this.sampleString1.split('.');
    this.S[1] = this.S[1].substring(0, 2);
    this.sampleString1 = this.S[0] + '.' + this.S[1];
    return this.sampleString1;
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
          'FXW',
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
          'FXW',
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
    // this.ServiceResponse = this.ServiceResponse['TradeBookingResponse'];
    this.StopTimer();
    //this.responseSaveArray = {};
    // this.PriceProviderArray = [];
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
    this.BestPrice = '';
    this.PriceQuoteRef = '';
    this.TradeReferenceID = '';
    this.CPTradeReferenceID = '';
    this.BookingDateTime = '';
    // this.CustomerRate = '';
    this.CalRevenue = '';
    this.SpotRate = '';
    this.SwapPoints = '';
    this.ExternalQuoteID = '';
    this.FinIQPriceQuoteId = '';
    this.PriceProviderId = '';
    this.loadflag = false;
    this.OrderBlotterVisibility = false;
    // this.TradeReferenceIDFlag = false;
    // this.RadioButtonSelected ? this.SpreadUnconverted = '' : this.CustomerRate = '';
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
    //  this.PriceProviderArray = [];
    // this.responseSaveArray = {};
    return false;
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
    amount.trim() === ''
      ? (amount = '0.00')
      : (amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    return amount;
  }
  delay(delay: number) {
    return new Promise((r, _err) => {
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
            // if (document.getElementById('seventhDot') != null) {
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
          // }
          this.counter--;
        } else {
          document.getElementById('firstDot') != null
            ? (document.getElementById('firstDot').style.display = 'none')
            : '';
          this.ResetTimer();
          this.ClearAll();
          this.StopRFS();
          //  this.counter = 60;
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
  ResetTimer() {
    try {
      clearInterval(this.interval);
      if (this.PricingLoadingFlag) {
        if (document.getElementById('firstDot') != null) {
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
      }
      this.PricingLoadingFlag = false;
      this.counter = 0;
      this.PriceProviderArray = [];
      return false;
    } catch (err) {
      console.log(err.message);
    }
    return false;
  }
  StopRFS() {
    this.StopRFSFlag = true;
    return false;
  }
  ValueChanged() {
    this.ResetTimer();
    this.StopRFS();
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
          .getElementById('orderDivForward')
          .scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      //console.log("Error:", error);
    }
  }
}
