import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ElementRef,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import { CommonfunctionService } from '../commonfunction.service';
import { ApifunctionService } from '../apifunction.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { environment } from '../../../../environments/environment';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../services/config.service';
import { HomeApiService } from '../../../services/home-api.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.css'],
})
export class SingleCardComponent implements OnInit, OnDestroy {
  isPricingTradingOn: number;
  timeLeft: number;
  spreadType: string = 'Pips';
  isTimerVisible: boolean;

  @Input()
  set Arrayvalue(Arrayvalue: any) {
    this.selectedCcy = Arrayvalue.ccy;
    this.investCcy = this.selectedCcy.split('/')[0];
    this.altCcy = this.selectedCcy.split('/')[1];
    this.index = Arrayvalue.index;
    this.favorite = Arrayvalue.favorite;
    this.tileID = Arrayvalue.tileID;
    this.persistedData = Arrayvalue;
    this.count = 0;
    // this.commonfunction.componentCount.push({ 'index': this.index, 'count': 0 });
  }
  loginID = '';
  LoggedInCustomerID: string;
  persistedData: any = [];
  Compref: ComponentRef<any>;
  @Output() removeCardChild = new EventEmitter<number>();
  @Output() removeCcyChild = new EventEmitter<string>();
  @Output() ForwardTrade = new EventEmitter<number>();
  tileID: string;
  index: number;
  selectedCcy: string;
  investCcy: string;
  altCcy: string;
  optionType = 'Spot';
  Loadingbuy = false;
  Loadingsell = false;
  Stopstreamingforbooktrade = false;
  commonfunction: CommonfunctionService;
  apifunctionservice: ApifunctionService;
  streamingOne = 0;
  ValueDate: any;
  FixingDate: any;
  SpotDate: any;
  validtionmsg = '';
  priceQuoteRefSell: any;
  priceQuoteRefBuy: any;
  resQuoteSell: any[];
  resQuoteBuy: any[];
  Bid = '';
  Ask = '';
  BidSmall = '';
  BidLarge = '';
  BidSmall1 = '';
  AskSmall = '';
  AskLarge = '';
  AskSmall1 = '';
  BidLP = '';
  AskLP = '';
  ExternalQuoteIDSell = '';
  ExternalQuoteIDBuy = '';
  BuyQuoteIds = [];
  SellQuoteIds = [];
  PriceSell = [];
  PriceBuy = [];
  spotRateSell: any;
  spotRateBuy: any;
  swapPointsSell: any;
  swapPointsBuy: any;
  QuoteIDSell: any;
  QuoteIDBuy: any;
  PPSell: any;
  PPBuy: any;
  altNotional: string;
  invNotional: string;
  leftFlip = 'YOU SELL';
  rightFlip = 'YOU BUY';
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
  rateDecimal: number;
  ccy1AmountDecimal: number;
  ccy2AmountDecimal: number;
  tenorCode = 'SPOT';
  submit = false;
  assetURL: string;
  showTenorBox = false;
  tenor = [
    { t: '1W' },
    { t: '2W' },
    { t: '3W' },
    { t: '1M' },
    { t: '3M' },
    { t: '6M' },
    { t: '1Y' },
  ];
  valuedateday: string;
  valuedatemonth: string;
  valuedateyear: string;
  spotprice: any;
  spread = 0;
  customerRate: any;
  forwardPointsBuy: any;
  forwardPointsSell: any;
  bankrateBuy: any;
  bankrateSell: any;
  againpricebuy = 0;
  againpricesell = 0;
  SessionIDSell: string;
  settlementList = [{ s: 'SPOT' }, { s: 'TOD' }, { s: 'TOM' }];
  showSettlementBox = false;
  settlement = 'SPOT';
  highlightinput = 'invest';
  entrymode = 1;
  isOrderfromLPPopup = false;
  // @Input() Refresh: Subject<Number>;
  @Input() Refresh: Subject<string>;
  @Input() updateIndex: Subject<Number>;
  count = 0;
  favorite: boolean;
  datevalidation = false;
  previousIndex = 0;
  tradingOption: string;
  private dateServiceSubscription: Subscription;
  private RFQServiceSubscription: Subscription;
  private FXOpricesSubscripion: Subscription;
  private ccySubscription: Subscription;
  private closeSocketSubscription: Subscription;
  private refreshSubsciption: Subscription;
  private deleteCcysubscription: Subscription;
  private updateIndexSubscription: Subscription;
  private tradingOnoffSubscription: Subscription;
  private customerDataSubscription: Subscription;
  customerListSubscription: Subscription;
  LPListSubscription: Subscription;
  tokenIDSubscription: Subscription;
  minDate: Date;
  removeCardFlag = false;
  uniqueKey = '';
  customerInfo = [];
  showPricingPopup = false;
  defualtCustData = [];
  waiteResponse = 0;
  priceProvider = '';
  userType = sessionStorage.getItem('UserType');

  DealerID: string;
  CustomerID: string;
  RMName: string;
  CustomerCIF: string;
  CustomerSegment: string;
  CustomerName: string;
  pointshift: number;
  spreadDetails: Subscription;
  custrateSell: any = 0;
  custRevenueSell: number;
  custrateBuy: any = 0;
  custRevenueBuy: number;
  spreadServiceConfig: boolean;
  FromDate: any;
  timerId: any;
  productID: any; //added by ruchira M
  TimeUP = false;
  error = '';
  sec: any;

  constructor(
    public elem: ElementRef,
    private afs: ApifunctionService,
    cfs: CommonfunctionService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public router: Router,
    public homeapi: HomeApiService,
    public authApi: AuthService
  ) {
    this.apifunctionservice = afs;
    this.commonfunction = cfs;
    this.isPricingTradingOn = 1;
    this.sec = '';
    this.timeLeft =
      Number(this.afs.quotevalidity) ||
      Number(AppConfig.settings.CSP_EFX_Timer);
    // this.timeLeft = Number(AppConfig.settings.CSP_EFX_Timer);
    this.custrateSell = '';
    this.custrateBuy = '';
    this.isTimerVisible = AppConfig.settings.CSP_FXTimerVisible;
  }
  ngOnDestroy() {
    this.count = 0;
    if (!this.removeCardFlag) {
      // console.log(this.altNotional, this.invNotional);
      this.commonfunction.persistData.push({
        index: this.index,
        ccy: this.selectedCcy,
        favorite: this.favorite,
        tileID: this.tileID,
        altNotional: this.altNotional,
        invNotional: this.invNotional,
        optionType: this.optionType,
        tenorCode: this.tenorCode,
        settlement: this.settlement,
        leftFlip: this.leftFlip,
        rightFlip: this.rightFlip,
        spread: this.spread,
        valuedateday: this.valuedateday,
        valuedatemonth: this.valuedatemonth,
        valuedateyear: this.valuedateyear,
        bid: this.Bid,
        ExternalQuoteIDSell: this.ExternalQuoteIDSell,
        spotprice: this.spotprice,
        forwardPointsSell: this.forwardPointsSell,
        BidLP: this.BidLP,
        spotRateSell: this.spotRateSell,
        swapPointsSell: this.swapPointsSell,
        customerRate: this.customerRate,
        QuoteIDSell: this.QuoteIDSell,
        PPSell: this.PPSell,
        BidLarge: this.BidLarge,
        BidSmall: this.BidSmall,
        BidSmall1: this.BidSmall1,
        AskLarge: this.AskLarge,
        AskSmall: this.AskSmall,
        AskSmall1: this.AskSmall1,
        Ask: this.Ask,
        AskLP: this.AskLP,
        spotRateBuy: this.spotRateBuy,
        swapPointsBuy: this.swapPointsBuy,
        ExternalQuoteIDBuy: this.ExternalQuoteIDBuy,
        forwardPointsBuy: this.forwardPointsBuy,
        QuoteIDBuy: this.QuoteIDBuy,
        PPBuy: this.PPBuy,
        FixingDate: this.FixingDate,
        ValueDate: this.ValueDate,
        SpotDate: this.SpotDate,
        rateDecimal: this.rateDecimal,
        ccy1AmountDecimal: this.ccy1AmountDecimal,
        ccy2AmountDecimal: this.ccy2AmountDecimal,
        takePersistData: true,
      });
    }
    // this.Compref.destroy();
    // this.commonfunction.makeZeroCompCount();
    this.clear();
    this.waiteResponse = 0;
    if (this.dateServiceSubscription !== undefined) {
      this.dateServiceSubscription.unsubscribe();
    }
    if (this.RFQServiceSubscription !== undefined) {
      this.apifunctionservice.FXOBestPrice.next([]);
      this.RFQServiceSubscription.unsubscribe();
    }
    if (this.FXOpricesSubscripion !== undefined) {
      this.FXOpricesSubscripion.unsubscribe();
    }
    if (this.ccySubscription !== undefined) {
      this.ccySubscription.unsubscribe();
    }
    if (this.closeSocketSubscription !== undefined) {
      this.closeSocketSubscription.unsubscribe();
    }
    if (this.refreshSubsciption !== undefined) {
      this.refreshSubsciption.unsubscribe();
    }
    if (this.deleteCcysubscription !== undefined) {
      this.deleteCcysubscription.unsubscribe();
    }
    if (this.updateIndexSubscription !== undefined) {
      this.updateIndexSubscription.unsubscribe();
    }
    if (this.tradingOnoffSubscription !== undefined) {
      this.tradingOnoffSubscription.unsubscribe();
    }
    if (this.customerDataSubscription !== undefined) {
      this.customerDataSubscription.unsubscribe();
    }
    if (this.LPListSubscription !== undefined) {
      this.LPListSubscription.unsubscribe();
    }
    if (this.customerListSubscription !== undefined) {
      this.customerListSubscription.unsubscribe();
    }
    if (this.tokenIDSubscription !== undefined) {
      this.tokenIDSubscription.unsubscribe();
    }
    if (this.spreadDetails !== undefined) {
      this.spreadDetails.unsubscribe();
    }
    window.clearInterval(this.timerId); // Added By AniruddhaJ || 31-Aug-2021
  }
  ngOnInit() {
    // let startDate = new Date(2000, 0, 2);
    // console.log('Comp ref ', this.Compref);
    //added by Ruchira M
    if (this.optionType.toLowerCase() === 'spot') {
      this.productID = 3;
    }
    this.afs.getCustAccountDetails();
    // this.CustomerName = this.homeapi.CustomerName;
    // this.CustomerID = this.homeapi.CustomerId;
    // this.CustomerCIF = this.homeapi.CustomerId;
    // this.CustomerSegment = "SG";
    // this.RMName = "";
    // this.DealerID = "";
    if (this.userType !== 'RM') {
      this.loginID = sessionStorage.getItem('CustomerNamemisc1');
      this.LoggedInCustomerID = sessionStorage.getItem('CustomerID');
      this.CustomerCIF = this.homeapi.CIF;
      this.CustomerName = this.homeapi.CustomerDisplayName;
      this.CustomerSegment = 'BB';
      this.RMName = '';
      this.CustomerID = this.homeapi.CustomerId;
      this.DealerID = this.homeapi.CustomerId;
    }
    this.route.params.subscribe((params) => {
      this.isPricingTradingOn = Number(params.mode);
      // console.log(this.isPricingTradingOn);
    });
    this.spreadServiceConfig =
      AppConfig.settings.CSP_EFXSpread.toUpperCase() === 'NO' ? false : true; // false- use old spread service, true- use new spread service
    // console.log('this.spreadServiceConfig -' + this.spreadServiceConfig);

    const tod = new Date();
    this.minDate = new Date();
    if (this.minDate.getDay() > 0 && this.minDate.getDay() < 4) {
      this.minDate.setDate(tod.getDate() + 3);
    } else if (this.minDate.getDay() === 4) {
      this.minDate.setDate(tod.getDate() + 5);
    } else if (this.minDate.getDay() === 5) {
      this.minDate.setDate(tod.getDate() + 5);
    }

    this.assetURL = environment.assetURL;
    this.tradingOption = this.commonfunction.tradingOnOffVar;
    if (this.persistedData.takePersistData) {
      this.favorite = this.persistedData.favorite;
      this.tileID = this.persistedData.tileID;
      this.altNotional = this.persistedData.altNotional.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );
      this.invNotional = this.persistedData.invNotional.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );
      this.optionType = this.persistedData.optionType;
      this.tenorCode = this.persistedData.tenorCode;
      this.settlement = this.persistedData.settlement;
      this.leftFlip = this.persistedData.leftFlip;
      this.rightFlip = this.persistedData.rightFlip;
      this.spread = this.persistedData.spread;
      this.valuedateday = this.persistedData.valuedateday;
      this.valuedatemonth = this.persistedData.valuedatemonth;
      this.valuedateyear = this.persistedData.valuedateyear;

      this.rateDecimal = this.persistedData.rateDecimal;
      // console.log('Rate Decimal ', this.rateDecimal);
      this.ccy1AmountDecimal = this.persistedData.ccy1AmountDecimal;
      this.ccy2AmountDecimal = this.persistedData.ccy2AmountDecimal;
      if (this.tradingOption !== 'off') {
        this.Bid = this.persistedData.bid;
        this.ExternalQuoteIDSell = this.persistedData.ExternalQuoteIDSell;
        this.spotprice = this.persistedData.spotprice;
        this.forwardPointsSell = this.persistedData.forwardPointsSell;
        this.BidLP = this.persistedData.BidLP;
        this.spotRateSell = this.persistedData.spotRateSell;
        this.swapPointsSell = this.persistedData.swapPointsSell;
        this.customerRate = this.persistedData.customerRate;
        this.QuoteIDSell = this.persistedData.QuoteIDSell;
        this.PPSell = this.persistedData.PPSell;
        this.BidLarge = this.persistedData.BidLarge;
        this.BidSmall = this.persistedData.BidSmall;
        this.BidSmall1 = this.persistedData.BidSmall1;
        this.AskLarge = this.persistedData.AskLarge;
        this.AskSmall = this.persistedData.AskSmall;
        this.AskSmall1 = this.persistedData.AskSmall1;
        this.Ask = this.persistedData.Ask;
        this.AskLP = this.persistedData.AskLP;
        this.spotRateBuy = this.persistedData.spotRateBuy;
        this.swapPointsBuy = this.persistedData.swapPointsBuy;
        this.ExternalQuoteIDBuy = this.persistedData.ExternalQuoteIDBuy;
        this.forwardPointsBuy = this.persistedData.forwardPointsBuy;
        this.QuoteIDBuy = this.persistedData.QuoteIDBuy;
        this.PPBuy = this.persistedData.PPBuy;
        this.FixingDate = this.persistedData.FixingDate;
        this.ValueDate = this.persistedData.ValueDate;
        this.SpotDate = this.persistedData.SpotDate;
      }
      //     break;
      //   }
      // }
      // })
      // console.log(this.altNotional, this.invNotional);
    } else {
      this.invNotional = '10,000';
      this.altNotional = '0';
      this.spread = 0;
      this.tenorCode = 'SPOT';
      this.count = 0;
      this.entrymode = 1;
      this.valuedateday = '';
      this.valuedatemonth = '';
      this.valuedateyear = '';
      this.previousIndex = 0;

      if (
        this.tradingOption === 'on' &&
        this.userType.toLocaleUpperCase() === 'CLIENT'
      ) {
        this.loaderStart();
      }
      this.apifunctionservice.getcurrencypairsdetails(
        'PAIR',
        this.investCcy + ' - ' + this.altCcy,
        this.index,
        'FXCAPI'
      );
      // console.log(this.selectedCcy, this.index);
      this.apifunctionservice.GetFXDatesForSpotForward(
        this.investCcy + ' - ' + this.altCcy,
        'SPOT',
        this.productID,
        this.index
      );

      //  this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional.replace(',', ''), 'USD');
    }
    this.afs.getSpread_NewService(
      this.investCcy + ' - ' + this.altCcy,
      this.CustomerSegment,
      this.CustomerID,
      '2',
      this.index,
      this.invNotional.replace(',', ''),
      this.investCcy
    );
    //  this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional.replace(',', ''), 'USD');
    this.tradingOnoffSubscription =
      this.commonfunction.tradingOnOffObserver.subscribe((value) => {
        this.tradingOption = value;
      });
    this.dateServiceSubscription =
      this.apifunctionservice.GetFXDatesForSpotForwardSFObserver.subscribe(
        (res: any) => {
          if (res) {
            // console.log(res);
            if (res.ID === this.index) {
              if (res.body.Status === 'Succeed') {
                //  console.log(res);

                // console.log(' Dates : ', res);
                this.ValueDate = res.body.PairDates.PairDateInfo.FinIQValueDate;
                this.SpotDate = res.body.PairDates.PairDateInfo.FinIQSpotDate;
                this.FixingDate =
                  res.body.PairDates.PairDateInfo.FinIQFixingDate;

                // console.log(this.ValueDate, this.SpotDate, this.FixingDate);
                if (this.optionType === 'Forward') {
                  const vdate = new Date(this.ValueDate);
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
                this.clear();
                // let cnt= this.commonfunction.getCompoCount(this.index);

                // this.commonfunction.componentCount.map(d => {
                //   if (d['index'] === this.index) {
                //     this.count = Number(d['count']);
                //   }
                // });

                // if (this.waiteResponse > 1) {
                if (this.count === 0) {
                  if (
                    this.tradingOption === 'on' &&
                    this.userType.toLocaleUpperCase() === 'CLIENT'
                  ) {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                  // this.commonfunction.setCompoCount(this.index);
                  this.count++;
                } else {
                  if (
                    this.tradingOption === 'on' &&
                    this.userType.toLocaleUpperCase() === 'CLIENT'
                  ) {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                }
                // } else {
                //   this.waiteResponse++;
                // }
              } else {
                // this.validtionmsg = 'Dates service is unavailable.'

                this.Bid = '';
                this.BidSmall = 'n.a.';
                this.BidSmall1 = '';
                this.BidLarge = '';
                this.Loadingbuy = false;
                this.Loadingsell = false;
                this.Ask = '';
                this.AskSmall = 'n.a.';
                this.AskSmall1 = '';
                this.AskLarge = '';
                this.validtionmsg = res.body.ResponseDetails.Description;
                this.datevalidation = true;
              }
            }
          }
        }
      );

    this.ccySubscription = this.apifunctionservice.CcyPairsObserver.subscribe(
      (res: any) => {
        // console.log(res);
        if (res) {
          if (this.index === res.index) {
            if (res.success) {
              this.rateDecimal = res.body[0].RateDecimal;
              // console.log('Rate Decimal ', this.rateDecimal);
              this.pointshift = res.body[0].PointShift;
              this.ccy1AmountDecimal = res.body[0].Ccy1AmountDecimal;
              this.ccy2AmountDecimal = res.body[0].Ccy2AmountDecimal;
              this.invNotional = parseFloat(this.invNotional.replace(/,/g, ''))
                .toFixed(this.ccy1AmountDecimal)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              this.altNotional = parseFloat(
                this.altNotional.replace(/,/g, '')
              ).toFixed(this.ccy2AmountDecimal);
            }
          }
        }
      }
    );
    this.RFQServiceSubscription =
      this.apifunctionservice.FXOBestPriceObservar.subscribe((res: any) => {
        if (res.length !== 0) {
          try {
            // console.log(res);
            let currentIndex;
            if (this.previousIndex !== 0) {
              currentIndex = this.previousIndex;
            } else {
              currentIndex = this.index;
            }
            try {
              if (res.body.FinIQResponseHeader.Status === 'Succeed') {
                if (res.ID === currentIndex) {
                  if (res.UniqueKey === this.uniqueKey) {
                    if (
                      (!this.TimeUP && this.timerId === undefined) ||
                      this.timeLeft !==
                        (Number(this.afs.quotevalidity) ||
                          Number(AppConfig.settings.CSP_EFX_Timer))
                    ) {
                      this.timeLeft =
                        Number(this.afs.quotevalidity) ||
                        Number(AppConfig.settings.CSP_EFX_Timer);
                      this.setTimer();
                    } else {
                    }
                    // console.log('Index is : ', currentIndex, ',', res);
                    if (res.Side === 'Sell') {
                      this.priceQuoteRefSell =
                        res.body.PriceEnquiryResponse.PriceQuoteRef;
                      this.resQuoteSell =
                        res.body.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;

                      if (this.entrymode === 2) {
                        // changed entrymode to 2 -streaming mode -done by Nilam v on 26-Jun-2021
                        if (this.Ask !== '') {
                          this.previousIndex = 0;
                        }

                        this.Bid = this.resQuoteSell[0].NearForwardRate + '';
                        this.spotRateSell =
                          this.resQuoteSell[0].NearSpotRate + '';
                        this.swapPointsSell =
                          this.resQuoteSell[0].NearSwapPoint;
                        this.QuoteIDSell = this.resQuoteSell[0].QuoteId;
                        this.ExternalQuoteIDSell =
                          this.resQuoteSell[0].ExternalQuoteID;
                        this.PPSell = this.resQuoteSell[0].PriceProviderId;

                        //Added by Ruchira M asked by Deep Dave 389
                        // if(this.optionType.toUpperCase() === 'SPOT'){
                        // } else{
                        //   this.Bid = this.resQuoteSell[0].NearForwardRate +  this.swapPointsSell + '';
                        // }

                        // Spreaded Rate - Added by Nilam V on 22-Jun-2021
                        if (this.rateDecimal === undefined) {
                          this.rateDecimal = this.Bid.split('.')[1].length;
                        }

                        if (this.spreadType === 'Pips') {
                          this.custrateSell = (
                            Number(this.Bid) - Number(this.spread)
                          ).toFixed(this.rateDecimal);
                          if (this.spread !== 0) {
                            this.custRevenueSell =
                              parseFloat(this.invNotional.replace(/,/g, '')) *
                              this.spread;
                          } else {
                            this.custRevenueSell = 0;
                          }
                        } else if (this.spreadType === 'Percentage') {
                          let spreadPercentage =
                            (Number(this.Bid) * Number(this.spread)) / 100;
                          this.custrateSell = (
                            Number(this.Bid) - Number(spreadPercentage)
                          ).toFixed(this.rateDecimal);
                          if (this.spread !== 0) {
                            this.custRevenueSell =
                              parseFloat(this.invNotional.replace(/,/g, '')) *
                              spreadPercentage;
                          } else {
                            this.custRevenueSell = 0;
                          }
                        }

                        // End

                        // let arrayBid = this.Bid.split('.');
                        try {
                          let arrayBid = [];
                          if (this.custrateSell !== undefined) {
                            arrayBid = this.custrateSell.split('.'); // Changed by Nilam V on 22-Jun-2021
                          }
                          const bidwithratedec =
                            arrayBid[0] +
                            '.' +
                            arrayBid[1].substr(0, this.rateDecimal);
                          let bidwithoutdot;
                          if (this.rateDecimal < arrayBid[1].length) {
                            bidwithoutdot =
                              arrayBid[0] +
                              arrayBid[1].substr(0, this.rateDecimal);
                          } else {
                            let remain = this.rateDecimal - arrayBid[1].length;
                            bidwithoutdot = arrayBid[0] + arrayBid[1];
                            while (remain) {
                              bidwithoutdot = bidwithoutdot + '0';
                              remain--;
                            }
                          }
                          let indexofdot = bidwithratedec.indexOf('.');
                          // console.log(indexofdot);

                          this.BidSmall = bidwithoutdot.substr(0, 3);
                          this.BidLarge = bidwithoutdot.substr(3, 2);
                          if (this.BidLarge.length === 1) {
                            this.BidLarge = this.BidLarge + '0';
                          } else if (this.BidLarge.length === 0) {
                            this.BidLarge = '00';
                          }
                          this.BidSmall1 = bidwithoutdot.substr(
                            5,
                            bidwithoutdot.length - 5
                          );
                          if (indexofdot < 3) {
                            this.BidSmall =
                              this.BidSmall.substr(0, indexofdot) +
                              '.' +
                              this.BidSmall.substr(indexofdot);
                          } else if (indexofdot >= 3 && indexofdot < 5) {
                            indexofdot = indexofdot - 3;
                            this.BidLarge =
                              this.BidLarge.substr(0, indexofdot) +
                              '.' +
                              this.BidLarge.substr(indexofdot);
                          } else {
                            indexofdot = indexofdot - 5;
                            this.BidSmall1 =
                              this.BidSmall1.substr(0, indexofdot) +
                              '.' +
                              this.BidSmall1.substr(indexofdot);
                          }
                          const point = this.BidLarge.indexOf('.');
                          if (point === 0) {
                            this.BidLarge = this.BidLarge.replace('.', ' ');
                            this.BidSmall = this.BidSmall + ' .';
                          }
                        } catch (ex) {
                          console.log(ex);
                        }

                        this.calculateNotional();
                        this.ref.detectChanges();

                        this.Loadingsell = false;

                        // Changed by Nilam V on 26-Jun-2021 - Streaming mode
                        if (this.PriceSell.length <= 0) {
                          let usedElemID: number;
                          const that = this;
                          this.resQuoteSell.map((d) => {
                            this.afs.FirstStreamData.map(function (
                              CurrentStream,
                              i
                            ) {
                              if (
                                Number(d.QuoteId) ===
                                Number(CurrentStream.QuoteId)
                              ) {
                                that.PriceSelectionFromResponse(CurrentStream);
                                usedElemID = i;
                              }
                            });
                          });
                          if (usedElemID !== undefined) {
                            this.afs.FirstStreamData.splice(usedElemID, 1);
                          }
                        }
                        // End
                      }
                      //  else { //Added by Nilam V on 21-Jun-2021
                      //   if (this.PriceSell.length <= 0) {
                      //     let usedElemID: number;
                      //     const that = this;
                      //     this.resQuoteSell.map(d => {
                      //       this.afs.FirstStreamData.map(function (CurrentStream, i) {
                      //         if (Number(d['QuoteId']) === Number(CurrentStream['QuoteId'])) {
                      //           that.PriceSelectionFromResponse(CurrentStream);
                      //           usedElemID = i;
                      //         }
                      //       });
                      //     });
                      //     if (usedElemID !== undefined)
                      //       this.afs.FirstStreamData.splice(usedElemID, 1);
                      //   }
                      // } //End

                      const LPDataArrSell = this.resQuoteSell.map((lp) => {
                        return {
                          ExternalQuoteID: lp.ExternalQuoteID,
                          LP: lp.PriceProviderCode,
                          PP: lp.PriceProviderId,
                          QuoteID: lp.QuoteID,
                          price: lp.NearForwardRate,
                          spot: lp.NearSpotRate,
                          swapPoints: lp.NearSwapPoint,
                        };
                      });
                      this.commonfunction.LPPopupSellData.next(LPDataArrSell);

                      // this.bankrate = res['body']['PriceEnquiryResponse']['NearLeg']['BankRate'];
                      // console.log('Response ', this.index, 'Sell', new Date());
                    } else if (res.Side === 'Buy') {
                      // console.log('Response ', currentIndex, 'Buy', new Date());
                      this.priceQuoteRefBuy =
                        res.body.PriceEnquiryResponse.PriceQuoteRef;
                      this.resQuoteBuy =
                        res.body.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
                      if (this.entrymode === 2) {
                        // Changed entry mode to 2 - Streaming mode - done by Nilam V on 26-Jun-2021
                        this.Ask = this.resQuoteBuy[0].NearForwardRate + '';

                        this.spotRateBuy =
                          this.resQuoteBuy[0].NearSpotRate + '';
                        this.swapPointsBuy = this.resQuoteBuy[0].NearSwapPoint;
                        this.QuoteIDBuy = this.resQuoteBuy[0].QuoteId;
                        this.ExternalQuoteIDBuy =
                          this.resQuoteBuy[0].ExternalQuoteID;
                        this.PPBuy = this.resQuoteBuy[0].PriceProviderId;

                        //Added by Ruchira M asked by Deep Dave 389
                        //  if(this.optionType.toUpperCase() === 'SPOT'){
                        //   this.Ask = this.resQuoteBuy[0].NearForwardRate + '';
                        // } else{
                        //   this.Ask = this.resQuoteBuy[0].NearForwardRate +  this.swapPointsBuy + '';
                        // }

                        if (this.Bid !== '') {
                          this.previousIndex = 0;
                        }
                        // Spreaded Rate - Added by Nilam V on 22-Jun-2021
                        if (this.rateDecimal === undefined) {
                          this.rateDecimal = this.Ask.split('.')[1].length;
                        }

                        if (this.spreadType === 'Pips') {
                          this.custrateBuy = (
                            Number(this.Ask) + Number(this.spread)
                          ).toFixed(this.rateDecimal);
                          if (this.spread !== 0) {
                            this.custRevenueBuy =
                              parseFloat(this.invNotional.replace(/,/g, '')) *
                              this.spread;
                          } else {
                            this.custRevenueBuy = 0;
                          }
                        } else if (this.spreadType === 'Percentage') {
                          let spreadPercentage =
                            (Number(this.Ask) * Number(this.spread)) / 100;
                          this.custrateBuy = (
                            Number(this.Ask) + Number(spreadPercentage)
                          ).toFixed(this.rateDecimal);
                          if (this.spread !== 0) {
                            this.custRevenueBuy =
                              parseFloat(this.invNotional.replace(/,/g, '')) *
                              spreadPercentage;
                          } else {
                            this.custRevenueBuy = 0;
                          }
                        }

                        // End

                        // let arrayAsk = this.Ask.split('.');
                        try {
                          let arrayAsk = [];
                          if (this.custrateBuy) {
                            arrayAsk = this.custrateBuy.split('.'); // Changed by Nilam V on 22-Jun-201
                          }

                          const askwithratedec =
                            arrayAsk[0] +
                            '.' +
                            arrayAsk[1].substr(0, this.rateDecimal);
                          let askwithoutdot;
                          if (this.rateDecimal < arrayAsk[1].length) {
                            askwithoutdot =
                              arrayAsk[0] +
                              arrayAsk[1].substr(0, this.rateDecimal);
                          } else {
                            let remain = this.rateDecimal - arrayAsk[1].length;
                            askwithoutdot = arrayAsk[0] + arrayAsk[1];
                            while (remain) {
                              askwithoutdot = askwithoutdot + '0';
                              remain--;
                            }
                          }
                          let indexofdot = askwithratedec.indexOf('.');

                          this.AskSmall = askwithoutdot.substr(0, 3);
                          this.AskLarge = askwithoutdot.substr(3, 2);
                          if (this.AskLarge.length === 1) {
                            this.AskLarge = this.AskLarge + '0';
                          } else if (this.AskLarge.length === 0) {
                            this.AskLarge = '00';
                          }
                          this.AskSmall1 = askwithoutdot.substr(
                            5,
                            askwithoutdot.length - 5
                          );
                          this.ref.detectChanges();
                          if (indexofdot < 3) {
                            this.AskSmall =
                              this.AskSmall.substring(0, indexofdot) +
                              '.' +
                              this.AskSmall.substring(indexofdot);
                          } else if (indexofdot >= 3 && indexofdot < 5) {
                            indexofdot = indexofdot - 3;
                            this.AskLarge =
                              this.AskLarge.substring(0, indexofdot) +
                              '.' +
                              this.AskLarge.substring(indexofdot);
                          } else {
                            indexofdot = indexofdot - 5;
                            this.AskSmall1 =
                              this.AskSmall1.substring(0, indexofdot) +
                              '.' +
                              this.AskSmall1.substring(indexofdot);
                          }
                          const point = this.AskLarge.indexOf('.');
                          if (point === 0) {
                            this.AskLarge = this.AskLarge.replace('.', ' ');
                            this.AskSmall = this.AskSmall + ' .';
                          }
                        } catch (Ex) {
                          console.log(Ex);
                        }
                        this.calculateNotional();
                        this.ref.detectChanges();
                        this.Loadingbuy = false;

                        // Added by Nilam V on 26-Jun-2021 - Streaming mode
                        if (this.PriceBuy.length <= 0) {
                          const that = this;
                          let usedElemID: number;
                          this.resQuoteBuy.map((d) => {
                            this.afs.FirstStreamData.map(function (
                              CurrentStream,
                              i
                            ) {
                              if (
                                Number(d.QuoteId) ===
                                Number(CurrentStream.QuoteId)
                              ) {
                                that.PriceSelectionFromResponse(CurrentStream);
                                usedElemID = i;
                              }
                            });
                          });
                          if (usedElemID !== undefined) {
                            this.afs.FirstStreamData.splice(usedElemID, 1);
                          }
                        }
                      }
                      const LPDataArrBuy = this.resQuoteBuy.map((lp) => {
                        return {
                          ExternalQuoteID: lp.ExternalQuoteID,
                          LP: lp.PriceProviderCode,
                          PP: lp.PriceProviderId,
                          QuoteID: lp.QuoteID,
                          price: lp.NearForwardRate,
                          spot: lp.NearSpotRate,
                          swapPoints: lp.NearSwapPoint,
                        };
                      });
                      this.commonfunction.LPPopupBuyData.next(LPDataArrBuy);
                    }
                  }
                }
              } else if (res.body.FinIQResponseHeader.Status === 'Failed') {
                // (res['body']['FinIQResponseHeader']['Status'] === 'Failed')
                if (res.ID === currentIndex) {
                  if (res.UniqueKey === this.uniqueKey) {
                    // console.log('Index is : ', currentIndex, ',', res);
                    if (res.Side === 'Sell') {
                      if (this.resQuoteSell !== undefined) {
                        if (this.againpricesell < 2) {
                          const msg =
                            res.body.PriceEnquiryResponse.ResponseDetails
                              .Description;

                          if (msg.includes('No prices')) {
                            this.apifunctionservice.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                              this.optionType === 'Spot' ? 'FXC' : 'FXW',
                              this.altCcy + ' - ' + this.investCcy,
                              'Buy',
                              parseFloat(this.altNotional.replace(/,/g, '')),
                              parseFloat(this.invNotional.replace(/,/g, '')),
                              0.5,
                              this.tenorCode,
                              false,
                              'fx',
                              this.ValueDate,
                              this.FixingDate,
                              this.SessionIDSell,
                              currentIndex,
                              1,
                              'Sell',
                              this.uniqueKey,
                              this.CustomerCIF,
                              this.CustomerName,
                              this.CustomerSegment,
                              this.RMName,
                              this.CustomerID,
                              this.DealerID,
                              '',
                              '',
                              this.priceProvider
                            );
                            this.againpricesell++;
                          } else {
                            this.Bid = '';
                            this.BidSmall = 'n.a.';
                            this.BidSmall1 = '';
                            this.BidLarge = '';
                            this.ExternalQuoteIDSell = '';
                            this.Loadingsell = false;

                            this.validtionmsg =
                              'No prices received, please try again';
                            this.datevalidation = true;
                          }
                        } else {
                          let msg =
                            res.body.PriceEnquiryResponse.ResponseDetails
                              .Description;
                          if (msg.includes('No prices')) {
                            msg = 'No prices received, please try again';
                          }
                          this.validtionmsg =
                            'No prices received, please try again';
                          this.datevalidation = true;
                          this.Bid = '';
                          this.BidSmall = 'n.a.';
                          this.BidSmall1 = '';
                          this.BidLarge = '';
                          this.ExternalQuoteIDSell = '';
                          this.Loadingsell = false;
                          this.againpricesell = 0;
                        }
                      }
                    } else if (res.Side === 'Buy') {
                      if (this.resQuoteBuy !== undefined) {
                        if (this.againpricebuy < 2) {
                          const msg =
                            res.body.PriceEnquiryResponse.ResponseDetails
                              .Description;
                          if (msg.includes('No prices')) {
                            this.apifunctionservice.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
                              this.optionType === 'Spot' ? 'FXC' : 'FXW',
                              this.investCcy + ' - ' + this.altCcy,
                              'Buy',
                              parseFloat(this.invNotional.replace(/,/g, '')),
                              parseFloat(this.altNotional.replace(/,/g, '')),
                              0.5,
                              this.tenorCode,
                              false,
                              'fx',
                              this.ValueDate,
                              this.FixingDate,
                              this.SessionIDSell,
                              currentIndex,
                              1,
                              'Buy',
                              this.uniqueKey,
                              this.CustomerCIF,
                              this.CustomerName,
                              this.CustomerSegment,
                              this.RMName,
                              this.CustomerID,
                              this.DealerID,
                              '',
                              '',
                              this.priceProvider
                            );
                            this.againpricebuy++;
                          } else {
                            this.Loadingbuy = false;
                            this.Ask = '';
                            this.AskSmall = 'n.a.';
                            this.AskSmall1 = '';
                            this.AskLarge = '';
                            this.ExternalQuoteIDBuy = '';
                            this.againpricebuy = 0;
                            this.validtionmsg =
                              'No prices received, please try again';
                            this.datevalidation = true;
                          }
                        } else {
                          let msg =
                            res.body.PriceEnquiryResponse.ResponseDetails
                              .Description;
                          if (msg.includes('No prices')) {
                            msg = 'No prices received, please try again';
                          }
                          this.validtionmsg =
                            'No prices received, please try again';
                          this.datevalidation = true;
                          this.Loadingbuy = false;
                          this.Ask = '';
                          this.AskSmall = 'n.a.';
                          this.AskSmall1 = '';
                          this.AskLarge = '';
                          this.ExternalQuoteIDBuy = '';
                          this.againpricebuy = 0;
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.log(error);
            }

            // console.log(this.resQuoteBuy);
            // console.log(this.resQuoteSell);
          } catch (ex) {
            console.log(ex);
          }
        }
      });

    this.FXOpricesSubscripion = this.commonfunction.FXOPricesObservar.subscribe(
      (response) => {
        if (response.length !== 0) {
          if (!this.Stopstreamingforbooktrade) {
            // console.log('calling PriceSelectionFromResponse', response);
            this.PriceSelectionFromResponse(response);
          }
          // Added by Nilam V on 21-Jun-2021
          if (
            this.afs.FirstStreamTileID >= 0 &&
            this.afs.FirstStreamTileID === this.index
          ) {
            if (this.afs.FirstStreamData.length <= 2) {
              this.afs.FirstStreamData.push(response);
              if (this.afs.FirstStreamData.length === 2) {
                this.afs.FirstStreamTileID = -1;
              }
            }
          }
          // End
          // else {
          // console.log(!this.Stopstreamingforbooktrade);
          // }
        }
      }
    );

    this.closeSocketSubscription =
      this.commonfunction.CloseSocketObserver.subscribe((res: any) => {
        if (res.res) {
          if (this.Bid === '') {
            this.BidSmall = 'n.a.';
            this.BidSmall1 = '';
            this.BidLarge = '';
            this.Loadingbuy = false;
          }
          if (this.Ask === '') {
            this.AskSmall = 'n.a.';
            this.AskLarge = '';
            this.AskSmall1 = '';
            this.Loadingsell = false;
          }
        }
      });
    this.refreshSubsciption = this.Refresh.subscribe((value) => {
      if (this.userType === 'RM') {
        const data = value.split(','); // =CustomerName,ID,CIFNo,Segment,RMName,DealerID
        this.CustomerName = data[0];
        this.CustomerID = data[1];
        this.CustomerCIF = data[2];
        this.CustomerSegment = data[3];
        this.RMName = this.authApi.UserName;
        this.DealerID = data[1];
        this.afs.getSpread_NewService(
          this.investCcy + ' - ' + this.altCcy,
          this.CustomerSegment,
          this.CustomerID,
          '2',
          this.index,
          this.invNotional.replace(',', ''),
          this.investCcy
        );
        // Added by Nilam V on 30-Jun-2021
        // if (this.spreadServiceConfig) {
        //   this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional, this.investCcy);
        // } else { // End
        //   this.afs.getSpread(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.index); // Added by Nilam V on 22-Jun-2021
        // }
      } else {
        this.loginID = sessionStorage.getItem('CustomerNamemisc1');
        this.LoggedInCustomerID = sessionStorage.getItem('CustomerID');
        this.CustomerCIF = this.homeapi.CIF;
        this.CustomerName = this.homeapi.CustomerDisplayName;
        this.CustomerSegment = 'BB';
        this.RMName = '';
        this.CustomerID = this.homeapi.CustomerId;
        this.DealerID = this.homeapi.CustomerId;
        this.afs.getSpread_NewService(
          this.investCcy + ' - ' + this.altCcy,
          this.CustomerSegment,
          this.CustomerID,
          '2',
          this.index,
          this.invNotional.replace(',', ''),
          this.investCcy
        );
      }

      this.clear();

      this.commonfunction.onlyClearTimeout();
      CommonfunctionService.time = 0;
      if (this.highlightinput === 'invest') {
        this.altNotional = '0.00';
      } else {
        this.invNotional = '0.00';
      }
      this.ref.detectChanges();

      this.count = 0;
      // this.commonfunction.makeZeroCompCount();
      if (this.optionType === 'Spot') {
        if (this.tradingOption === 'on') {
          this.loaderStart();
          this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
        }
      } else {
        if (this.valuedateday === '') {
          this.validtionmsg = 'Please select date.';
          this.datevalidation = true;
          setTimeout(() => {
            this.validtionmsg = '';
            this.datevalidation = false;
          }, 7000);
        } else {
          if (this.tradingOption === 'on') {
            this.loaderStart();
            this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
          }
        }
      }
    });
    this.deleteCcysubscription =
      this.apifunctionservice.deletedccyObserver.subscribe((res: any) => {
        if (res) {
          if (res.index === this.index) {
            if (res.body.web_deleteTemplate_demoResult) {
              this.favorite = false;
            }
          }
        }
      });
    this.updateIndexSubscription = this.updateIndex.subscribe((value) => {
      if (value > 0) {
        if (value < this.index) {
          if (this.Bid === '') {
            this.afs.countDelectedTileReq++;
          }
          if (this.Ask === '') {
            this.afs.countDelectedTileReq++;
          }
          // this.apifunctionservice.deletedTileID = this.index;
          this.previousIndex = this.index;
          this.index = this.index - 1;
        }
      }
    });

    this.LPListSubscription =
      this.commonfunction.selectedPriceforTradeObs.subscribe((res: any) => {
        if (res) {
          console.log(res);
          if (res !== '') {
            this.isOrderfromLPPopup = true;
            this.submitOrder();
          }
        }
      });
    this.customerListSubscription =
      this.apifunctionservice.CustomerListObserver.subscribe((res) => {
        if (res.length > 0) {
          this.customerInfo = res;
          // console.log(this.commonfunction.configData['Customer_Name']);
          if (this.commonfunction.configData !== undefined) {
            // this.defualtCustData = this.customerInfo.filter(p => p['AH_CIF_No'] !== "");

            // this.customerInfo.filter(p => p['CustomerName'] === this.commonfunction.configData['Customer_Name']);
            // console.log(this.defualtCustData);
            // if (this.userType === 'RM') {

            //   // this.defualtCustData.push(this.customerInfo[0]);
            //   this.customerInfo.map(p => {
            //     if (p['CustomerID'] === this.LoggedInCustomerID) {
            //       this.defualtCustData.push(p);
            //     }
            //   });
            // } else
            if (this.userType.toLocaleUpperCase() === 'CLIENT') {
              // User Type- CLIENT
              this.customerInfo.map((p) => {
                // if (p['CustomerName'] === this.loginID) {
                if (Number(p.CustomerID) === Number(this.LoggedInCustomerID)) {
                  this.defualtCustData.push(p);
                }
              });
              this.CustomerCIF = this.defualtCustData[0].AH_CIF_No;
              this.CustomerName = this.defualtCustData[0].CustomerName;
              this.CustomerSegment =
                this.defualtCustData[0].AH_Customer_Segment;
              this.RMName = this.defualtCustData[0].RelManager;
              this.CustomerID = this.defualtCustData[0].CustomerID;
              this.DealerID = this.defualtCustData[0].DealerID;
              //this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional.replace(',', ''), 'USD');
              // Added by Nilam V on 30-Jun-2021
              // if (this.spreadServiceConfig) {
              //   this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional, this.investCcy);
              // } else { // End
              //   this.afs.getSpread(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.index); // Added by Nilam V on 22-Jun-2021
              // }
              if (this.waiteResponse > 1) {
                if (this.count === 0) {
                  if (this.tradingOption === 'on') {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                  // this.commonfunction.setCompoCount(this.index);
                  this.count++;
                } else {
                  if (this.tradingOption === 'on') {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                }
              } else {
                this.waiteResponse++;
              }
            }
          }
        }
      });
    this.tokenIDSubscription =
      this.apifunctionservice.TokenIDObserver.subscribe((res) => {
        if (res) {
          try {
            if (res.dbfunction === 'Func_PP_PPM_PC') {
              const PPArr = res.result.DocumentElement.DUMMY;
              this.priceProvider = '';
              PPArr.map((record) => {
                this.priceProvider += record.PP_CODE[0] + ',';
              });
              this.priceProvider = this.priceProvider.slice(0, -1);
              // console.log(this.priceProvider);
              if (this.waiteResponse > 1) {
                if (this.count === 0) {
                  if (
                    this.tradingOption === 'on' &&
                    this.userType.toLocaleUpperCase() === 'CLIENT'
                  ) {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                  // this.commonfunction.setCompoCount(this.index);
                  this.count++;
                } else {
                  if (
                    this.tradingOption === 'on' &&
                    this.userType.toLocaleUpperCase() === 'CLIENT'
                  ) {
                    this.Streaming(2); // this.Streaming(1); Changed to streaming mode by Nilam V on 26-Jun-2021
                  }
                }
              } else {
                this.waiteResponse++;
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      });
    // this.apifunctionservice.CustAccountDetailsobs.subscribe(res => {
    //   if (res) {
    //     try {
    //       if (this.userType === 'CLIENT') {
    //         this.defualtCustData = res;
    //         this.CustomerCIF = res['CIF'];
    //         this.CustomerID = res['CustomerID'];
    //         this.CustomerSegment = res['Customer_Segment'];
    //         this.RMName = '';
    //         this.DealerID = '';
    //         if (this.waiteResponse > 1) {
    //           if (this.count === 0) {
    //             if (this.tradingOption === 'on') {
    //               this.Streaming(1);
    //             }
    //             // this.commonfunction.setCompoCount(this.index);
    //             this.count++;
    //           } else {
    //             if (this.tradingOption === 'on') {
    //               this.Streaming(1);
    //             }
    //           }
    //         } else {
    //           this.waiteResponse++;
    //         }
    //       }
    //     } catch (ex) {
    //       console.log(ex);
    //     }
    //   }
    // });

    // Added by Nilam V on 22-June-2021
    this.spreadDetails = this.afs.GetSpreadDetailsObserver.subscribe(
      (resp: any) => {
        if (resp.length > 0) {
          console.log(resp);
          // if (this.TransactionShow) {
          try {
            // console.log(this.buysell);
            if (resp[1] === this.index) {
              const res = resp[0].GetBankSpreadResult;
              // let spread: any = [{
              //   Bid: Number(0).toFixed(this.rateDecimal),
              //   Ask: Number(0).toFixed(this.rateDecimal)
              // }];
              if (res.length !== 0) {
                // if (this.buysell === "YOU SELL") {
                res.forEach((s) => {
                  this.spreadType = s.Spread_Type;
                  if (s.ccy === this.investCcy) {
                    // if (parseFloat(this.invNotional.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.invNotional.replace(/,/g, '')) >= s.Notional_min) {

                    if (s.Spread_Type === 'Pips') {
                      this.spread = parseFloat(
                        (s.Spread / Math.pow(10, this.pointshift)).toFixed(
                          this.rateDecimal
                        )
                      );
                    } else if (s.Spread_Type === 'Percentage') {
                      this.spread = parseFloat(s.Spread);
                    }

                    // spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                    // this.Streaming(2);  // Commented by RuchiraM
                    return;
                    // }
                  } else if (s.ccy === this.altCcy) {
                    // if (parseFloat(this.altNotional.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.altNotional.replace(/,/g, '')) >= s.Notional_min) {
                    if (s.Spread_Type === 'Pips') {
                      this.spread = parseFloat(
                        (s.Spread / Math.pow(10, this.pointshift)).toFixed(
                          this.rateDecimal
                        )
                      );
                    } else if (s.Spread_Type === 'Percentage') {
                      this.spread = parseFloat(s.Spread);
                    }
                    // spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                    // this.Streaming(2); // Commented by RuchiraM
                    return;
                    // }
                  } else {
                    const spreadccyrate = this.afs.GetPairMidRate_sync(
                      this.investCcy + ' - ' + s.ccy,
                      this.tenorCode,
                      'FXC',
                      this.loginID
                    );
                    const spreadCcyNotional =
                      parseFloat(this.invNotional.replace(/,/g, '')) /
                      parseFloat(spreadccyrate[0].body.MidRate);
                    console.log(
                      'Spread ccy is ',
                      s.ccy,
                      ' and inc ccy is ' + this.invNotional
                    );
                    console.log(
                      'Mid rate of',
                      this.investCcy + ' - ' + s.ccy,
                      ' is ' + spreadccyrate[0].body.MidRate
                    );
                    console.log('Spread ccy notional :' + spreadCcyNotional);
                    // this.Streaming(2);
                    // if (spreadCcyNotional <= s.Notional_max && spreadCcyNotional >= s.Notional_min) {
                    if (s.Spread_Type === 'Pips') {
                      this.spread = parseFloat(
                        (s.Spread / Math.pow(10, this.pointshift)).toFixed(
                          this.rateDecimal
                        )
                      );
                    } else if (s.Spread_Type === 'Percentage') {
                      this.spread = parseFloat(s.Spread);
                    }
                    // spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                    return;
                    // }
                  }
                });
                console.log('Spread', this.spread);
                // }
                // else if (this.buysell === "YOU BUY") {
                //   res.forEach(s => {
                //     if (s.ccy === this.altCCY1) {
                //       if (parseFloat(this.altAmt1.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.altAmt1.replace(/,/g, '')) >= s.Notional_min) {
                //         spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         return;
                //       }
                //     } else if (s.ccy === this.invCCY1) {
                //       if (parseFloat(this.invAmt1.replace(/,/g, '')) <= s.Notional_max && parseFloat(this.invAmt1.replace(/,/g, '')) >= s.Notional_min) {
                //         spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         return;
                //       }
                //     } else {
                //       let spreadccyrate = this.afs.GetPairMidRate_sync(this.invCCY1 + ' - ' + s.ccy, this.Type, 'FXC');
                //       let spreadCcyNotional = parseFloat(this.invAmt1.replace(/,/g, '')) / parseFloat(spreadccyrate[0]['body']['MidRate']);
                //       console.log('Spread ccy is ', s.ccy, ' and inc ccy is ' + this.invAmt1);
                //       console.log('Mid rate of', this.invCCY1 + ' - ' + s.ccy, ' is ' + spreadccyrate[0]['body']['MidRate']);
                //       console.log('Spread ccy notional :' + spreadCcyNotional);
                //       if (spreadCcyNotional <= s.Notional_max && spreadCcyNotional >= s.Notional_min) {
                //         spread[0]["Bid"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         spread[0]["Ask"] = (s.Spread / Math.pow(10, this.pointshift)).toFixed(this.rateDecimal);
                //         return;
                //       }
                //     }
                //   });
                // }
              } else {
                this.spread = 0;
              }
              // this.loaderTimer = false;
              // this.calculateIndicativeRevenue();
              // this.calculateNotional1();
            }
          } catch (ex) {
            console.log(ex);
          }
          // }
        }
        // else {
        //   this.spread = 0;
        // }
      }
    );
  }

  removeCard(selectedCcy) {
    try {
      this.removeCardFlag = true;
      this.removeCardChild.emit(this.index);
      this.removeCcyChild.emit(selectedCcy);
      // this.Compref.destroy();
    } catch (ex) {
      // console.log(ex);
    }
  }
  Streaming(entrymode) {
    try {
      this.clear();
      this.entrymode = entrymode;
      this.Stopstreamingforbooktrade = false;
      // let SessionIDSell;
      //  this.SubScrib('13.76.152.77', SessionIDSell);

      this.uniqueKey = '_' + Math.random().toString(36).substr(2, 9);

      if (entrymode === 2) {
        // console.log(CommonfunctionService.streamingOne);
        if (CommonfunctionService.streamingOne === 0) {
          // SessionIDSell = this.GenerateSessionID();
          // console.log('Calling subscribe', this.streamingOne);
          // this.commonfunction.callSubscribe();
        } else {
          // this.commonfunction.cleartimoutfunction();
          // CommonfunctionService.socketTimeout = 60000;
          // if (this.count !== 0) {
          this.commonfunction.cleartimoutfunction();
          // }
          // this.count++;
        }
        this.SessionIDSell =
          this.authApi.UserName || sessionStorage.getItem('Username'); // Added by Nilam V on 21-Jun-2021
      } else {
        this.commonfunction.generateNewSessionID();
        // this.commonfunction.LPPopupSellData.next(this.PriceSell);
        this.SessionIDSell = this.commonfunction.getSessionID(); // Added by Nilam V on 21-Jun-2021
      }

      // this.SessionIDSell = this.commonfunction.getSessionID(); Commented on 21-Jun-2021 by Nilam V

      setTimeout(() => {
        // console.log(this.optionType === 'Spot' ? 'FXC' : 'FXW', this.altCcy + " - " + this.investCcy, "Buy", parseFloat(this.altNotional.replace(/,/g, '')), parseFloat(this.invNotional.replace(/,/g, '')), 0.5, this.tenorCode, false, 'fx', this.ValueDate, this.FixingDate, this.SessionIDSell, this.index, entrymode, 'Sell');
        this.apifunctionservice.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
          this.optionType === 'Spot' ? 'FXC' : 'FXW',
          this.altCcy + ' - ' + this.investCcy,
          'Buy',
          parseFloat(this.altNotional.replace(/,/g, '')),
          parseFloat(this.invNotional.replace(/,/g, '')),
          0.5,
          this.tenorCode,
          false,
          'fx',
          this.ValueDate,
          this.FixingDate,
          this.SessionIDSell,
          this.index,
          entrymode,
          'Sell',
          this.uniqueKey,
          this.CustomerCIF,
          this.CustomerName,
          this.CustomerSegment,
          this.RMName,
          this.CustomerID,
          this.DealerID,
          '',
          '',
          this.priceProvider
        );
      }, 0);

      // if (entrymode !== 2) {z
      //   CommonfunctionService.time = CommonfunctionService.time + 1000;
      // }

      // console.log('Request ', this.index, 'SELL', new Date());
      // if (this.ccy === this.investccy) {
      //   ccy1 = this.Notional.replace(/,/g, '');
      //   ccy2 = "0";
      // } else {
      //   ccy1 = "0";
      //   ccy2 = this.Notional.replace(/,/g, '');

      // }
      setTimeout(() => {
        // console.log(this.optionType === 'Spot' ? 'FXC' : 'FXW', this.investCcy + " - " + this.altCcy, "Buy", parseFloat(this.invNotional.replace(/,/g, '')), parseFloat(this.altNotional.replace(/,/g, '')), 0.5, this.tenorCode, false, 'fx', this.ValueDate, this.FixingDate, this.SessionIDSell, this.index, entrymode, 'Buy');
        this.apifunctionservice.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
          this.optionType === 'Spot' ? 'FXC' : 'FXW',
          this.investCcy + ' - ' + this.altCcy,
          'Buy',
          parseFloat(this.invNotional.replace(/,/g, '')),
          parseFloat(this.altNotional.replace(/,/g, '')),
          0.5,
          this.tenorCode,
          false,
          'fx',
          this.ValueDate,
          this.FixingDate,
          this.SessionIDSell,
          this.index,
          entrymode,
          'Buy',
          this.uniqueKey,
          this.CustomerCIF,
          this.CustomerName,
          this.CustomerSegment,
          this.RMName,
          this.CustomerID,
          this.DealerID,
          '',
          '',
          this.priceProvider
        );
      }, 1000);
      // if (entrymode !== 2) {
      //   CommonfunctionService.time = CommonfunctionService.time + 1000;
      // }
      // this.apifunctionservice.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(this.optionType === 'Spot' ? 'FXC' : 'FXW', this.investCcy + " - " + this.altCcy, "Buy", parseFloat(this.invNotional.replace(/,/g, '')), parseFloat(this.altNotional.replace(/,/g, '')), 0.5, this.tenorCode, false, 'fx', this.ValueDate, this.FixingDate, this.SessionIDSell, this.index, entrymode, 'Buy');
      // console.log("FXC", this.investccy + " - " + this.altccy, "Buy", "0", this.Notional.replace(/,/g, ''), this.Spread, this.Type, false, 'fx', this.ValueDate, this.FixingDate, SessionIDSell, this.index);
      // console.log('Request ', this.index, 'BUY', new Date());
    } catch (exception) {
      // console.log(exception);
    }
  }

  PriceSelectionFromResponse(CurrentStream) {
    try {
      if (this.resQuoteSell !== undefined) {
        this.resQuoteSell.map((d) => {
          // if (this.SellQuoteIds.indexOf(d['QuoteId']) === -1) { this.SellQuoteIds.push(d['QuoteId']); }
          console.log(
            'Local',
            this.investCcy + this.altCcy,
            Number(d.QuoteId),
            'Streaming',
            Number(CurrentStream.QuoteId)
          );
          if (Number(d.QuoteId) === Number(CurrentStream.QuoteId)) {
            if (
              this.PriceSell.filter(
                (p) => Number(p.QuoteID) === Number(d.QuoteId)
              ).length
            ) {
              this.PriceSell.map((p) => {
                if (Number(p.QuoteID) === Number(d.QuoteId)) {
                  p.price = CurrentStream.NearForwardRate;
                  p.ExternalQuoteID = CurrentStream.ExternalQuoteID;
                  p.LP = d.PriceProviderCode;
                  p.spot = CurrentStream.NearSpotRate;
                  p.swapPoints = CurrentStream.NearSwapPoint;
                  p.ExternalQuoteID = CurrentStream.ExternalQuoteID;
                  p.PP = CurrentStream.PriceProviderId;
                  p.ForwardPoints = CurrentStream.NearForwardRate;
                }
              });
            } else {
              if (
                this.PriceSell.filter(
                  (p) => Number(p.QuoteID) === Number(d.QuoteId)
                ).length === 0
              ) {
                // this.PriceSell.push({ 'price': CurrentStream['NearForwardRate'], 'QuoteID': d['QuoteId'], 'LP': d['PriceProviderCode'], 'spot': CurrentStream['NearSpotRate'], 'swapPoints': CurrentStream['NearSwapPoint'], 'ExternalQuoteID': CurrentStream['ExternalQuoteID'], 'PP': CurrentStream['PriceProviderId'] });
                this.PriceSell.push({
                  price: CurrentStream.NearForwardRate,
                  QuoteID: d.QuoteId,
                  LP: d.PriceProviderCode,
                  spot: CurrentStream.NearSpotRate,
                  swapPoints: CurrentStream.NearSwapPoint,
                  ExternalQuoteID: CurrentStream.ExternalQuoteID,
                  PP: CurrentStream.PriceProviderId,
                  ForwardPoints: CurrentStream.NearForwardRate,
                  QuoteResponseAt: d.QuoteResponseAt,
                  QuoteValidTill: CurrentStream.QuoteValidTill,
                });
              }
            }
            // console.log(this.PriceSell);
            // this.commonfunction.arr.map(value=>{
            //   let boolv = value['index'] === this.index;
            //   if(value['index'] === this.index){
            //     value['StreamCount'] = value['StreamCount']++;
            //   }
            // });
            // console.log(Number(this.commonfunction.arr[this.index].Index) === Number(this.index));
            // if (Number(this.commonfunction.arr[this.index].Index) === Number(this.index)) {
            //   this.commonfunction.arr[this.index].StreamCount = this.commonfunction.arr[this.index].StreamCount++;
            // }
            if (this.PriceSell.length > 0) {
              console.log(this.PriceSell);
              // this.PriceSell = this.PriceSell.sortBy('price');
              this.Bid = parseFloat(this.PriceSell[0].price).toFixed(
                this.rateDecimal
              );
              this.ExternalQuoteIDSell = this.PriceSell[0].ExternalQuoteID;
              this.spotprice = this.PriceSell[0].interbankrate;

              // this.forwardPoints = this.PriceSell[0]['ForwardPoints'];
              this.forwardPointsSell = this.PriceSell[0].swapPoints;
              // console.log('sell', this.Bid, this.ExternalQuoteIDSell);
              this.BidLP = this.PriceSell[0].LP;
              this.spotRateSell = Number(this.PriceSell[0].spot).toFixed(5);
              this.swapPointsSell = Number(
                this.PriceSell[0].swapPoints
              ).toFixed(5);
              console.log('price selll are', this.PriceSell);

              this.commonfunction.LPPopupSellData.next(this.PriceSell);
              this.customerRate = (
                Number(this.Bid) -
                this.spread / 100
              ).toFixed(2);
              this.QuoteIDSell = this.PriceSell[0].QuoteID;
              this.PPSell = this.PriceSell[0].PP;
              // Spreaded Rate - Added by Nilam V on 22-Jun-2021
              if (this.rateDecimal === undefined) {
                this.rateDecimal = this.Bid.split('.')[1].length;
              }
              this.custrateSell = (
                Number(this.Bid) - Number(this.spread)
              ).toFixed(this.rateDecimal);
              if (this.spread !== 0) {
                this.custRevenueSell =
                  parseFloat(this.invNotional.replace(/,/g, '')) * this.spread;
              } else {
                this.custRevenueSell = 0;
              }
              // End
              const arrayBid = this.custrateSell.split('.');
              const bidwithratedec =
                arrayBid[0] + '.' + arrayBid[1].substr(0, this.rateDecimal);
              const bidwithoutdot =
                arrayBid[0] + arrayBid[1].substr(0, this.rateDecimal);

              let indexofdot = bidwithratedec.indexOf('.');
              // console.log(indexofdot);

              this.BidSmall = bidwithoutdot.substr(0, 3);
              this.BidLarge = bidwithoutdot.substr(3, 2);
              if (this.BidLarge.length === 1) {
                this.BidLarge = this.BidLarge + '0';
              } else if (this.BidLarge.length === 0) {
                this.BidLarge = '00';
              }
              this.BidSmall1 = bidwithoutdot.substr(
                5,
                bidwithoutdot.length - 5
              );

              if (indexofdot < 3) {
                this.BidSmall =
                  this.BidSmall.substr(0, indexofdot) +
                  '.' +
                  this.BidSmall.substr(indexofdot);
              } else if (indexofdot >= 3 && indexofdot < 5) {
                indexofdot = indexofdot - 3;
                this.BidLarge =
                  this.BidLarge.substr(0, indexofdot) +
                  '.' +
                  this.BidLarge.substr(indexofdot);
              } else {
                indexofdot = indexofdot - 5;
                this.BidSmall1 =
                  this.BidSmall1.substr(0, indexofdot) +
                  '.' +
                  this.BidSmall1.substr(indexofdot);
              }
              const point = this.BidLarge.indexOf('.');
              if (point === 0) {
                this.BidLarge = this.BidLarge.replace('.', ' ');
                this.BidSmall = this.BidSmall + ' .';
              }

              this.ref.detectChanges();
              this.Loadingsell = false;
            }
          }
        });

        // console.log(this.PriceSell, this.resQuoteSell, this.SellQuoteIds);
      }

      if (this.resQuoteBuy !== undefined) {
        this.resQuoteBuy.map((d) => {
          // if (this.BuyQuoteIds.indexOf(d['QuoteId']) === -1) { this.BuyQuoteIds.push(d['QuoteId']); }
          console.log(
            'Local',
            this.investCcy + this.altCcy,
            Number(d.QuoteId),
            'Streaming',
            Number(CurrentStream.QuoteId)
          );
          if (Number(d.QuoteId) === Number(CurrentStream.QuoteId)) {
            if (
              this.PriceBuy.filter(
                (p) => Number(p.QuoteID) === Number(d.QuoteId)
              ).length
            ) {
              this.PriceBuy.map((p) => {
                if (Number(p.QuoteID) === Number(d.QuoteId)) {
                  p.price = CurrentStream.NearForwardRate;
                  p.ExternalQuoteID = CurrentStream.ExternalQuoteID;
                  p.LP = d.PriceProviderCode;
                  p.spot = CurrentStream.NearSpotRate;
                  p.swapPoints = CurrentStream.NearSwapPoint;
                  p.ExternalQuoteID = CurrentStream.ExternalQuoteID;
                  p.PP = CurrentStream.PriceProviderId;
                }
              });
            } else {
              if (
                this.PriceBuy.filter(
                  (p) => Number(p.QuoteID) === Number(d.QuoteId)
                ).length === 0
              ) {
                this.PriceBuy.push({
                  price: CurrentStream.NearForwardRate,
                  QuoteID: d.QuoteId,
                  LP: d.PriceProviderCode,
                  spot: CurrentStream.NearSpotRate,
                  swapPoints: CurrentStream.NearSwapPoint,
                  ExternalQuoteID: CurrentStream.ExternalQuoteID,
                  PP: CurrentStream.PriceProviderId,
                });
              }
            }
            // console.log(Number(this.commonfunction.arr[this.index].Index) === Number(this.index));
            // if (Number(this.commonfunction.arr[this.index].Index) === Number(this.index)) {
            //   this.commonfunction.arr[this.index].StreamCount = this.commonfunction.arr[this.index].StreamCount++;
            // }
            if (this.PriceBuy.length > 0) {
              // this.PriceBuy = this.PriceBuy.sortBy('price');

              this.Ask = parseFloat(this.PriceBuy[0].price).toFixed(
                this.rateDecimal
              );
              this.AskLP = this.PriceBuy[0].LP;
              this.spotRateBuy = Number(this.PriceBuy[0].spot).toFixed(5);
              // document.getElementsByClassName('tool')[this.index].classList.add('show');
              this.swapPointsBuy = Number(this.PriceBuy[0].swapPoints).toFixed(
                5
              );
              this.ExternalQuoteIDBuy = this.PriceBuy[0].ExternalQuoteID;
              this.forwardPointsBuy = this.PriceBuy[0].swapPoints;
              // console.log('buy', this.Ask, this.ExternalQuoteIDBuy);
              this.QuoteIDBuy = this.PriceBuy[0].QuoteID;
              this.PPBuy = this.PriceBuy[0].PP;
              console.log('price buyyy are', this.PriceBuy);
              this.commonfunction.LPPopupBuyData.next(this.PriceBuy);

              // Spreaded Rate - Added by Nilam V on 22-Jun-2021
              if (this.rateDecimal === undefined) {
                this.rateDecimal = this.Ask.split('.')[1].length;
              }
              this.custrateBuy = (
                Number(this.Ask) + Number(this.spread)
              ).toFixed(this.rateDecimal);
              if (this.spread !== 0) {
                this.custRevenueBuy =
                  parseFloat(this.invNotional.replace(/,/g, '')) * this.spread;
              } else {
                this.custRevenueBuy = 0;
              }
              // End

              const arrayAsk = this.custrateBuy.split('.');
              const askwithratedec =
                arrayAsk[0] + '.' + arrayAsk[1].substr(0, this.rateDecimal);
              const askwithoutdot =
                arrayAsk[0] + arrayAsk[1].substr(0, this.rateDecimal);

              let indexofdot = askwithratedec.indexOf('.');

              this.AskSmall = askwithoutdot.substr(0, 3);
              this.AskLarge = askwithoutdot.substr(3, 2);
              if (this.AskLarge.length === 1) {
                this.AskLarge = this.AskLarge + '0';
              } else if (this.AskLarge.length === 0) {
                this.AskLarge = '00';
              }
              this.AskSmall1 = askwithoutdot.substr(
                5,
                askwithoutdot.length - 5
              );

              if (indexofdot < 3) {
                this.AskSmall =
                  this.AskSmall.substring(0, indexofdot) +
                  '.' +
                  this.AskSmall.substring(indexofdot);
              } else if (indexofdot >= 3 && indexofdot < 5) {
                indexofdot = indexofdot - 3;
                this.AskLarge =
                  this.AskLarge.substring(0, indexofdot) +
                  '.' +
                  this.AskLarge.substring(indexofdot);
              } else {
                indexofdot = indexofdot - 5;
                this.AskSmall1 =
                  this.AskSmall1.substring(0, indexofdot) +
                  '.' +
                  this.AskSmall1.substring(indexofdot);
              }
              const point = this.AskLarge.indexOf('.');
              if (point === 0) {
                this.AskLarge = this.AskLarge.replace('.', ' ');
                this.AskSmall = this.AskSmall + ' .';
              }
              this.ref.detectChanges();
              this.Loadingbuy = false;
            }
          }
        });

        // console.log(this.PriceBuy, this.resQuoteBuy, this.BuyQuoteIds);
      }

      this.calculateNotional();

      this.ref.detectChanges();
    } catch (ex) {
      console.log(ex);
    }
  }
  startTimer() {}
  flipSellBuy() {
    try {
      if (this.leftFlip.indexOf('SELL') > 0) {
        this.leftFlip = 'YOU BUY';
        this.rightFlip = 'YOU SELL';
        // this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.altNotional.replace(',', ''), this.altCcy);
      } else {
        this.leftFlip = 'YOU SELL';
        this.rightFlip = 'YOU BUY';
        // this.afs.getSpread_NewService(this.investCcy + ' - ' + this.altCcy, this.CustomerSegment, this.CustomerID, '2', this.index, this.invNotional.replace(',', ''), this.investCcy);
      }
      const temp = this.Loadingbuy;
      this.Loadingbuy = this.Loadingsell;
      this.Loadingsell = temp;

      if (this.leftFlip.indexOf('SELL') > 0) {
        this.afs.getSpread_NewService(
          this.investCcy + ' - ' + this.altCcy,
          this.CustomerSegment,
          this.CustomerID,
          '2',
          this.index,
          this.altNotional.replace(',', ''),
          this.investCcy
        );
      } else {
        this.afs.getSpread_NewService(
          this.investCcy + ' - ' + this.altCcy,
          this.CustomerSegment,
          this.CustomerID,
          '2',
          this.index,
          this.invNotional.replace(',', ''),
          this.altCcy
        );
      }
      if (this.optionType === 'Spot') {
        if (this.tradingOption === 'on') {
          this.loaderStart();
          this.Streaming(2);
        }
      } else {
        if (this.valuedateday !== '') {
          if (this.tradingOption === 'on') {
            this.loaderStart();
            this.Streaming(2);
          }
        }
      }
      // this.calculateNotional();
    } catch (ex) {
      // console.log(ex);
    }
  }
  calculateNotional() {
    try {
      // Buy-Sell
      if (this.leftFlip.indexOf('SELL') > 0) {
        if (this.Bid !== '') {
          let altn;
          if (this.highlightinput === 'invest') {
            // altn = parseFloat(this.invNotional.replace(/,/g, '')) * parseFloat(this.Bid);
            altn =
              parseFloat(this.invNotional.replace(/,/g, '')) *
              parseFloat(this.custrateSell);
            this.altNotional = (
              altn.toFixed(this.ccy2AmountDecimal) + ''
            ).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            // altn = parseFloat(this.altNotional.replace(/,/g, '')) / parseFloat(this.Bid);
            altn =
              parseFloat(this.altNotional.replace(/,/g, '')) /
              parseFloat(this.custrateSell);
            this.invNotional = (
              altn.toFixed(this.ccy1AmountDecimal) + ''
            ).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        }
      }
      // Sell-Buy
      else {
        if (this.Ask !== '') {
          let altn;
          if (this.highlightinput === 'alter') {
            // altn = parseFloat(this.altNotional.replace(/,/g, '')) / parseFloat(this.Ask);
            altn =
              parseFloat(this.altNotional.replace(/,/g, '')) /
              parseFloat(this.custrateBuy);
            this.invNotional = (
              altn.toFixed(this.ccy1AmountDecimal) + ''
            ).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            // altn = parseFloat(this.invNotional.replace(/,/g, '')) * parseFloat(this.Ask);
            altn =
              parseFloat(this.invNotional.replace(/,/g, '')) *
              parseFloat(this.custrateBuy);
            this.altNotional = (
              altn.toFixed(this.ccy2AmountDecimal) + ''
            ).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  getDate(event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    const selecteddate = event.value;
    // console.log(selecteddate);
    this.datevalidation = false;
    this.validtionmsg = '';

    if (selecteddate.getDay() === 0 || selecteddate.getDay() === 6) {
      this.validtionmsg = 'Settlement Date is on holiday.';
      this.datevalidation = true;
      setTimeout(() => {
        this.datevalidation = false;
        this.validtionmsg = '';
      }, 2000);
    } else {
      this.datevalidation = false;
      const date = new Date();
      // console.log(date);
      const datediff = selecteddate.getTime() - date.getTime();
      // console.log(datediff);

      const dateindays = datediff / (1000 * 3600 * 24);

      // console.log(dateindays);
      let tcode = parseInt(dateindays + '') + '';
      tcode = tcode + 'D';

      this.tenorCode = tcode;

      const sdate =
        selecteddate.getDate() +
        '-' +
        this.months[selecteddate.getMonth()] +
        '-' +
        selecteddate.getFullYear();
      // console.log(date);
      this.ValueDate = sdate;
      this.FixingDate = sdate;

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

      this.clear();
      if (this.tradingOption === 'on') {
        this.loaderStart();
        this.Streaming(2);
      }
      this.showTenorBox = false;
    }
  }
  clear() {
    try {
      this.datevalidation = false;
      this.validtionmsg = '';
      this.Stopstreamingforbooktrade = true;
      this.Bid = '';
      this.BidSmall = '';
      this.BidLarge = '';
      this.BidSmall1 = '';
      this.Ask = '';
      this.AskSmall = '';
      this.AskSmall1 = '';
      this.AskLarge = '';
      this.AskLP = '';
      this.BidLP = '';
      this.ExternalQuoteIDBuy = '';
      this.ExternalQuoteIDSell = '';
      this.resQuoteBuy = [];
      this.resQuoteSell = [];
      this.PriceSell = [];
      this.PriceBuy = [];
      // this.Loadingbuy = false;
      // this.Loadingsell = false;
    } catch (exception) {
      // console.log(exception);
    }
  }
  // placeOrder() {
  //   try {
  //     let Spread = 0.5;
  //     let custRevenueSell;
  //     if (this.altCcy === 'JPY' || this.investCcy === 'JPY') {
  //       Spread = Spread / 100;
  //       custRevenueSell = parseFloat(this.invNotional.replace(/,/g, '')) * Spread;
  //     } else {
  //       Spread = Spread / 10000;
  //       custRevenueSell = parseFloat(this.invNotional.replace(/,/g, '')) * Spread;
  //     }

  //     this.apifunctionservice.BookOrderforSF(this.priceQuoteRefSell, 'FXC', this.altCcy + ' - ' + this.investCcy, 'Sell', this.invNotional,
  //       this.altNotional, this.Bid, this.BidRate, this.FixingDate, this.ValueDate, 'SPOT', RMspread.toString(), 0 + '',
  //       this.spotRateSell, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, custRevenueSell.toString(), 'FX', '6000123', this.dataInput, this.index);
  //   } catch (exception) {
  //     console.log(exception);
  //   }
  // }

  ChangeTenor(tenor) {
    try {
      this.datevalidation = false;
      this.validtionmsg = '';
      this.tenorCode = tenor;
      this.apifunctionservice.GetFXDatesForSpotForward(
        this.investCcy + ' - ' + this.altCcy,
        this.tenorCode,
        this.productID,
        this.index
      );
      this.showTenorBox = !this.showTenorBox;
      this.showSettlementBox = false;
      this.datevalidation = false;
      this.loaderStart();
    } catch (exception) {
      // console.log(exception);
    }
  }
  addpointtonotional(_amount) {
    try {
      //  alert('dfsdgdf');
      // console.log(index);
    } catch (exception) {
      // console.log(exception);
    }
  }

  submitOrder() {
    this.commonfunction.NewTrade(true);
    this.Stopstreamingforbooktrade = true;
    this.commonfunction.changeScreen('newtransaction');
    this.apifunctionservice.FXOBestPriceTransaction.next([]);
    this.apifunctionservice.FXOBestPrice.next([]);
    this.apifunctionservice.GetSpreadDetails.next([]);
    this.submit = true;

    // console.log(this.leftFlip);

    // this.apifunctionservice.getAccountDetails('32107', this.investCcy, this.altCcy, this.optionType === 'Spot' ? 'FXC' : 'FXW');
    // console.log(this.invNotional, this.altNotional, this.investCcy, this.altCcy, this.optionType, this.bankrateSell, this.FixingDate, this.ValueDate, this.tenorCode,this.spotRateSell, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, parseInt(this.invNotional) * this.spread, this.customerRate, this.priceQuoteRefSell, this.rateDecimal, this.forwardPointsSell, this.leftFlip, this.Bid);

    // if(this.leftFlip === 'YOU SELL'){
    //   this.commonfunction.getTransactionData(this.invNotional, this.altNotional,this.investCcy,this.altCcy,this.optionType,this.bankrateSell,this.FixingDate, this.ValueDate, this.tenorCode,
    //     this.spotRateSell, this.swapPointsSell, this.QuoteIDSell, this.ExternalQuoteIDSell, this.PPSell, this.SpotDate, parseInt(this.invNotional) * this.spread, this.customerRate,this.priceQuoteRefSell, this.rateDecimal ,this.forwardPointsSell, this.leftFlip, this.Bid);

    // } else  if(this.leftFlip === 'YOU BUY'){
    //   this.commonfunction.getTransactionData(this.invNotional, this.altNotional,this.investCcy,this.altCcy,this.optionType,this.bankrateBuy,this.FixingDate, this.ValueDate, this.tenorCode,
    //     this.spotRateBuy, this.swapPointsBuy, this.QuoteIDBuy, this.ExternalQuoteIDBuy, this.PPBuy, this.SpotDate, parseInt(this.invNotional) * this.spread, this.customerRate,this.priceQuoteRefBuy, this.rateDecimal ,this.forwardPointsBuy, this.leftFlip,this.Ask);

    // }
    console.log(
      this.invNotional,
      this.altNotional,
      this.investCcy,
      this.altCcy,
      this.optionType,
      this.FixingDate,
      this.ValueDate,
      this.tenorCode,
      this.rateDecimal,
      this.leftFlip,
      this.SpotDate,
      this.highlightinput,
      this.ccy1AmountDecimal,
      this.ccy2AmountDecimal
    );
    let spotrate,
      swappoints,
      quoteID,
      externalQuoteID,
      ppID,
      priceQuoteRef,
      custrate,
      custrevenue;

    if (this.leftFlip === 'YOU SELL') {
      spotrate = this.spotRateSell;
      swappoints = this.swapPointsSell;
      quoteID = this.QuoteIDSell;
      externalQuoteID = this.ExternalQuoteIDSell;
      ppID = this.PPSell;
      priceQuoteRef = this.priceQuoteRefSell;
      custrate = this.custrateSell;
      custrevenue = this.custRevenueSell;
    } else {
      spotrate = this.spotRateBuy;
      swappoints = this.swapPointsBuy;
      quoteID = this.QuoteIDBuy;
      externalQuoteID = this.ExternalQuoteIDBuy;
      ppID = this.PPBuy;
      priceQuoteRef = this.priceQuoteRefBuy;
      custrate = this.custrateBuy;
      custrevenue = this.custRevenueBuy;
    }
    if (this.isOrderfromLPPopup === false) {
      this.commonfunction.getTransactionData(
        this.invNotional.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        this.altNotional.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        this.investCcy,
        this.altCcy,
        this.optionType,
        this.FixingDate,
        this.ValueDate,
        this.tenorCode,
        this.rateDecimal,
        this.leftFlip,
        this.SpotDate,
        this.highlightinput,
        this.ccy1AmountDecimal,
        this.ccy2AmountDecimal,
        this.leftFlip === 'YOU SELL' ? this.Bid : this.Ask,
        this.highlightinput === 'invest' ? 'AMOUNT1' : 'AMOUNT2',
        this.CustomerCIF +
          ',' +
          this.CustomerSegment +
          ',' +
          this.RMName +
          ',' +
          this.CustomerID +
          ',' +
          this.DealerID +
          ',' +
          this.CustomerName,
        spotrate,
        swappoints,
        quoteID,
        externalQuoteID,
        ppID,
        priceQuoteRef,
        custrate,
        custrevenue,
        this.spread,
        this.index
      );
    } else {
      // console.log('order placed from the LP popup');
      this.commonfunction.getTransactionData(
        this.invNotional.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        this.altNotional.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        this.investCcy,
        this.altCcy,
        this.optionType,
        this.FixingDate,
        this.ValueDate,
        this.tenorCode,
        this.rateDecimal,
        this.leftFlip,
        this.SpotDate,
        this.highlightinput,
        this.ccy1AmountDecimal,
        this.ccy2AmountDecimal,
        this.leftFlip === 'YOU SELL' ? this.Bid : this.Ask,
        this.highlightinput === 'invest' ? 'AMOUNT1' : 'AMOUNT2',
        this.CustomerCIF +
          ',' +
          this.CustomerSegment +
          ',' +
          this.RMName +
          ',' +
          this.CustomerID +
          ',' +
          this.DealerID +
          ',' +
          this.CustomerName,
        spotrate,
        swappoints,
        quoteID,
        externalQuoteID,
        ppID,
        priceQuoteRef,
        custrate,
        custrevenue,
        this.spread,
        this.index
      );
    }

    if (this.optionType === 'Forward') {
      this.ForwardTrade.emit(this.index);
    } else {
      this.commonfunction.setSettlementType('PS');
    }
    this.commonfunction.selectedPriceforTrade.next('');
    this.router.navigate(['/', 'transaction']);
  }

  changeSettlement(value) {
    try {
      this.datevalidation = false;
      this.validtionmsg = '';
      this.showSettlementBox = !this.showSettlementBox;
      this.settlement = value;
      switch (value) {
        case 'TOD':
          this.tenorCode = 'TOD';
          break;
        case 'TOM':
          this.tenorCode = 'TOM';
          break;
        case 'SPOT':
          this.tenorCode = 'SPOT';
          break;
      }

      this.showTenorBox = false;

      // this.clear();
      // this.loaderStart();
      // this.Streaming();
      this.switchToSPOT();
    } catch (ex) {
      // console.log(ex);
    }
  }
  showhideTenorandsettlement() {
    try {
      if (this.optionType === 'Forward') {
        this.showTenorBox = !this.showTenorBox;
        this.showSettlementBox = false;
      } else {
        this.showSettlementBox = !this.showSettlementBox;
        this.showTenorBox = false;
      }
    } catch (ex) {
      // console.log(ex);
    }
  }
  changeNotionalfunction(value) {
    try {
      if (value === 'invest') {
        if (parseFloat(this.invNotional.replace(/,/g, '')) !== 0.0) {
          this.altNotional = '0';
          this.altNotional = parseFloat(
            this.altNotional.replace(/,/g, '')
          ).toFixed(this.ccy2AmountDecimal);
          this.invNotional = parseFloat(
            this.invNotional.replace(/,/g, '')
          ).toFixed(this.ccy1AmountDecimal);
          this.clear();

          this.highlightinput = value;
          if (this.optionType === 'Spot') {
            if (this.tradingOption === 'on') {
              this.loaderStart();
              this.Streaming(2);
            }
          } else {
            if (this.valuedateday !== '') {
              if (this.tradingOption === 'on') {
                this.loaderStart();
                this.Streaming(2);
              }
            }
          }
        }
      } else {
        if (parseFloat(this.altNotional.replace(/,/g, '')) !== 0.0) {
          this.invNotional = '0';
          this.invNotional = parseFloat(
            this.invNotional.replace(/,/g, '')
          ).toFixed(this.ccy1AmountDecimal);
          this.altNotional = parseFloat(
            this.altNotional.replace(/,/g, '')
          ).toFixed(this.ccy2AmountDecimal);
          this.clear();

          this.highlightinput = value;
          if (this.optionType === 'Spot') {
            if (this.tradingOption === 'on') {
              this.loaderStart();
              this.Streaming(2);
            }
          } else {
            if (this.valuedateday !== '') {
              if (this.tradingOption === 'on') {
                this.loaderStart();
                this.Streaming(2);
              }
            }
          }
        }
      }
    } catch (ex) {
      // console.log(ex);
    }
  }
  loaderStart() {
    try {
      this.Loadingbuy = true;
      this.Loadingsell = true;
    } catch (ex) {
      // console.log(ex);
    }
  }
  switchToSPOT() {
    try {
      // this.tenorCode = 'SPOT';
      this.datevalidation = false;
      this.validtionmsg = '';
      this.apifunctionservice.GetFXDatesForSpotForward(
        this.investCcy + ' - ' + this.altCcy,
        this.tenorCode,
        this.productID,
        this.index
      );
      this.loaderStart();
    } catch (ex) {
      // console.log(ex);
    }
  }

  calltonextpage() {
    if (this.leftFlip === 'YOU SELL') {
      if (this.Bid === '' || parseFloat(this.Bid) === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.Ask === '' || parseFloat(this.Ask) === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
  addtoFavorite() {
    try {
      const favccy = this.investCcy + '/' + this.altCcy;
      // console.log(templatename, favccy);
      this.apifunctionservice.addNewCcyInTemplate(
        sessionStorage.getItem('Username'),
        favccy,
        this.index
      );
      this.favorite = true;
    } catch (ex) {
      // console.log(ex);
    }
  }
  deleteFromFavorites() {
    try {
      this.apifunctionservice.deleteCcyFromTemplate(
        sessionStorage.getItem('Username'),
        this.tileID,
        this.index
      );
    } catch (ex) {
      // console.log(ex);
    }
  }
  // tradeClick(){
  //   this.Stopstreamingforbooktrade=true;
  //   this.commonfunction.changeScreen('newtransaction');
  //   this.apifunctionservice.FXOBestPriceTransaction.next([]);
  //   this.apifunctionservice.FXOBestPrice.next([]);
  //   this.apifunctionservice.GetSpreadDetails.next('');
  //   this.submitOrder();
  //   if(this.optionType ==='Forward'){
  //     this.ForwardTrade.emit(this.index);
  //   }
  // }
  showHidePopup(direction: string) {
    const body = {
      direction,
      flag: true,
    };
    this.commonfunction.getLPpopupflag(body);
    // if (this.entrymode !== 1) {
    //   this.commonfunction.getLPpopupflag(body);
    // }
  }
  callCalender() {
    try {
      const calenderInstance = document.getElementsByClassName(
        'cdk-overlay-container'
      );
      calenderInstance[0].classList.add('fx-order-calender');
    } catch (ex) {
      console.log('Error in Call calender fun in Single card: ', ex);
    }
  }
  changeRouteToTransaction() {
    if (this.timeLeft > 0) {
      this.commonfunction.NewTrade(true);
      this.Stopstreamingforbooktrade = true;
      this.commonfunction.changeScreen('newtransaction');
      this.apifunctionservice.FXOBestPriceTransaction.next([]);
      this.apifunctionservice.FXOBestPrice.next([]);
      this.apifunctionservice.GetSpreadDetails.next([]);
      this.submitOrder();
      this.router.navigate(['transaction/0/']);
    } else {
      this.sec = '-';
      this.AskSmall = '-';
      this.BidSmall = '-';
      this.AskLarge = '';
      this.BidLarge = '';
    }
  }
  changeRouteToTrnasaction_Forward() {
    this.commonfunction.NewTrade(true);
    this.Stopstreamingforbooktrade = true;
    this.commonfunction.changeScreen('newtransaction');
    this.apifunctionservice.FXOBestPriceTransaction.next([]);
    this.apifunctionservice.FXOBestPrice.next([]);
    this.apifunctionservice.GetSpreadDetails.next([]);
    this.submitOrder();
  }

  selectFromDate(date) {
    this.FromDate = moment(date).format('DD-MMM-YYYY');
    // this.isActive = 'Custom';
  }

  epochtoFormatted(utc) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utc);
    const dt = d.toString().split(' ');
    const mt = dt[2] + '-' + dt[1] + '-' + dt[3];
    console.log(mt);
    return mt;
  }

  setTimer() {
    // let timeLeft = this.commonfunction.TimerValueFromCommonData;
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
    }
    this.TimeUP = false;
    this.timerId = setInterval(() => {
      this.TimeUP = false;
      const timerclass = document.getElementById(
        'timer' + this.investCcy + this.altCcy
      ) as HTMLElement;
      // console.log(timerclass);
      if (this.timeLeft === 0) {
        clearTimeout(this.timerId);
        this.sec = '-';
        this.AskSmall = '-';
        this.BidSmall = '-';
        this.AskLarge = '';
        this.BidLarge = '';
        this.TimeUP = true;
        this.error = 'Timeout Please Reprice again.';
        return;

        // if (this.OrderSubmission) {
        //   this.CallRates();
        // }
      } else {
        this.sec = moment.utc(this.timeLeft * 1000).format('mm:ss');
        // this.sec = this.timeLeft;
        if (this.timeLeft <= 5) {
          timerclass.style.color = 'red';
        } else if (this.timeLeft <= 10 && this.timeLeft > 5) {
          timerclass.style.color = 'orange';
        } else {
          timerclass.style.color = 'green';
        }
        this.timeLeft--;
      }
    }, 1000);
  }

  timediff(quoteRequestAt, quoteExpiresAt) {
    // let timestamp=1626036240000;
    const date1 = new Date(0);
    date1.setUTCSeconds(quoteRequestAt.split('(')[1].split('+')[0]);
    const d = new Date();
    console.log(
      d.getFullYear() +
        '-' +
        d.getMonth() +
        '-' +
        d.getDay() +
        ' ' +
        quoteExpiresAt.split(' ')[0] +
        ':00'
    );
    const date = new Date(
      d.getFullYear() +
        '-' +
        (d.getMonth() + 1) +
        '-' +
        d.getDate() +
        ' ' +
        quoteExpiresAt.split(' ')[0] +
        ':00 PM'
    );
    console.log(date.getTime() + '-' + date1.getTime()); // 4/17/2020
    const days = Math.floor(date.getTime() - date1.getTime());
    console.log(days);
  }
}
