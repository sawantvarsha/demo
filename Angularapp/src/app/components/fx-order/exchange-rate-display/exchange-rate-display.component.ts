import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonfunctionService } from '../commonfunction.service';
import { ApifunctionService } from '../apifunction.service';
import { formatDate } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { WebsocketService } from '../websocket.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-exchange-rate-display',
  templateUrl: './exchange-rate-display.component.html',
  styleUrls: ['./exchange-rate-display.component.css'],
})
export class ExchangeRateDisplayComponent implements OnInit, OnDestroy {
  MultiPair = [];
  assetURL: string;
  // RefreshAllCurrencyRates: Subject<Number> = new Subject();
  RefreshAllCurrencyRates: Subject<string> = new Subject();
  changeIndexAfterRemoval: Subject<Number> = new Subject();
  commonfunction: CommonfunctionService;
  apifunction: ApifunctionService;
  showCurrencySelection = false;
  TradeDate: string;
  // ccySelectionArray = [{ 'ccy': 'AUD/USD' }, { 'ccy': 'EUR/GBP' }, { 'ccy': 'EUR/USD' }, { 'ccy': 'GBP/JPY' }, { 'ccy': 'GBP/USD' }, { 'ccy': 'USD/JPY' }, { 'ccy': 'USD/AED' }, { 'ccy': 'EUR/AED' }, { 'ccy': 'USD/MYR' }];
  ccySelectionArray = [];
  count = 0;
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
  limitOrderCount = 0;
  private favServiceSunscription: Subscription;
  private limitBlotterSubscription: Subscription;
  forwardPopup = false;
  checkedCP: string;
  tradingOption: string;
  showPricingPopup = false;
  LPDataBuy = [];
  LPDataSell = [];
  showLPsfor = '';
  userType = sessionStorage.getItem('UserType');
  customerInfo = [];
  customerData = '';
  refreshbtnflag = false;
  ConfigValueSubscription: Subscription;
  commondatasubscription: Subscription;
  error = '';
  timer = '';
  public now: Date = new Date();
  isUserRM: boolean;
  msg: string;
  constructor(
    cfs: CommonfunctionService,
    private afs: ApifunctionService,
    public webSocketApi: WebsocketService,
    public authApi: AuthService,
    public homeApi: HomeApiService
  ) {
    this.commonfunction = cfs;
    this.apifunction = afs;
    this.isUserRM = sessionStorage
      .getItem('UserType')
      .toUpperCase()
      .includes('RM')
      ? true
      : false;
    this.apifunction.getFXQuoteValidity();
  }

  ngOnDestroy() {
    // this.commonApi.HideSidebar(false);
    this.webSocketApi.closeSocket();
    this.commonfunction.onlyClearTimeout();
    this.apifunction.GetFXDatesForSpotForwardSF.next('');
    // this.Compref.destroy();
    CommonfunctionService.time = 0;
    this.commonfunction.CloseSocket.next({ res: false });
    if (this.favServiceSunscription !== undefined) {
      this.favServiceSunscription.unsubscribe();
    }
    if (this.limitBlotterSubscription !== undefined) {
      this.limitBlotterSubscription.unsubscribe();
    }
    if (this.ConfigValueSubscription !== undefined) {
      this.ConfigValueSubscription.unsubscribe();
    }
    if (this.commondatasubscription !== undefined) {
      this.commondatasubscription.unsubscribe();
    }
    this.apifunction.FirstStreamData = [];
    this.apifunction.FirstStreamTileID = -1;
  }
  ngOnInit() {
    this.webSocketApi.startSocket();
    this.webSocketApi.socket$.subscribe(
      (msg) => {
        if (msg === 'MASTERSUBSCRIBE|' + this.authApi.UserName) {
          console.log(msg);
        } else {
          let rate: any = JSON.stringify(msg);
          rate = JSON.parse(rate).MessageContent;
          if (!rate.includes('Subscribed ')) {
            var rateJSON: any = JSON.parse(rate);
            this.commonfunction.FXOPrices.next(rateJSON);
            console.log(
              rateJSON.QuoteId,
              rateJSON.NearSpotRate,
              rateJSON.NearForwardRate,
              rateJSON.QuoteResponseAt,
              rateJSON.QuoteValidTill,
              new Date()
            );
          }
        }
      },
      (err) => {
        console.log(err);
        this.webSocketApi.startSocket();
      }
    );
    this.apifunction.getFavoritesFromTemplate(
      sessionStorage.getItem('Username')
    );
    this.apifunction.CustomerSearch('');
    this.afs.getDataFromDBFunctions(
      'FXC,' + sessionStorage.getItem('HomeEntityID'),
      'Func_PP_PPM_PC'
    );
    // if (this.userType === 'CLIENT') {
    //   this.afs.getCustAccountDetails();
    // }
    this.afs.getConfigValue('CSP_IsStraightToProcess');
    this.commonfunction.DashboardStartCount++;
    this.apifunction.FXOBestPrice.next([]);
    this.commonfunction.FXOPrices.next([]);
    this.apifunction.CcyPairs.next('');
    this.apifunction.GetFXDatesForSpotForwardSF.next('');
    this.checkedCP = 'PS';
    this.assetURL = environment.assetURL;
    this.tradingOption = this.commonfunction.tradingOnOffVar;
    this.commonfunction.tradingOnOffObserver.subscribe((value) => {
      this.tradingOption = value;
    });
    this.favServiceSunscription = this.afs.getfavoriteObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          const favoriteCcy = res;
          this.MultiPair = [];
          let i = 1;
          favoriteCcy.map((d) => {
            this.MultiPair.push({
              ccy: d.ProductName,
              index: i++,
              favorite: true,
              tileID: d.TileID,
              takePersistData: false,
            });
          });
          if (this.userType === 'CLIENT') {
            // this.commonfunction.callSubscribe(); //Temp comment
          }
        }
      }
    );
    this.commondatasubscription = this.afs
      .getCommonDataFXOrder(
        AppConfig.settings.CSP_FX_Order_CCY_Pairs_Common_Data
      )
      .subscribe((res: any) => {
        console.log(res);
        if (res.Get_Configurable_Common_DataResult.length !== 0) {
          const favoriteCcy: any[] = res.Get_Configurable_Common_DataResult;
          // this.MultiPair = [];
          this.ccySelectionArray = favoriteCcy.map((c) => {
            return { ccy: c.DATA_VALUE, visible: true };
          });

          // favoriteCcy.map(d => {
          //   this.MultiPair.push({ ccy: d.DATA_VALUE, index: i++, favorite: true, tileID: parseInt(d.Misc2, 10), takePersistData: false });
          // });
          // this.commonfunction.persistData = this.MultiPair;
        }
      });
    // }
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    this.apifunction.getLimitOrderWorkflowBlotterData(
      'FX Cash Order Workflow',
      2082,
      'TRADE',
      '1',
      this.TradeDate,
      this.TradeDate,
      99,
      "[OM_Status] LIKE '%OPEN%' or [OM_Status] LIKE '%AMEND%'",
      1000,
      1
    );
    this.limitBlotterSubscription =
      this.afs.GetLimitOrderBlotterDataObserver.subscribe((res: any) => {
        if (res) {
          if (res.CallId === 99) {
            // console.log('limit order ', res);

            if (res.response !== undefined) {
              if (res.response.length === undefined) {
                this.limitOrderCount = 1;
              } else {
                this.limitOrderCount = res.response.length;
              }
            } else {
              this.limitOrderCount = 0;
            }

            // if (limitorders !== undefined) {
            //   limitorders.map(d => {
            //     if (d['Status'] === 'Order Placed') {
            //       this.limitOrderCount++;
            //     }
            //   });
            // }
          } else {
            this.limitOrderCount = 0;
          }
        } else {
          this.limitOrderCount = 0;
        }
      });

    this.commonfunction.LPpopupflagObs.subscribe((res: any) => {
      console.log(res);
      if (res.flag === true) {
        const usertype = sessionStorage.getItem('UserType');
        if (usertype.toUpperCase() !== 'CLIENT') {
          this.showPricingPopup = true;
          if (res.direction === 'YOU BUY') {
            this.showLPsfor = 'Buy';
          } else {
            this.showLPsfor = 'Sell';
          }
          // console.log(this.showLPsfor);
        } else {
          this.showPricingPopup = false;
        }
      } else {
        this.showPricingPopup = false;
      }
    });

    this.commonfunction.LPPopupBuyDataObs.subscribe((res: any) => {
      if (res.length !== 0) {
        this.LPDataBuy = res;
        // console.log('data buy', this.LPDataBuy);
      } else {
        // console.log(`in the else of the buy`);
      }
    });

    this.commonfunction.LPPopupSellDataObs.subscribe((res: any) => {
      if (res.length !== 0) {
        this.LPDataSell = res;
        // console.log('data sell', this.LPDataSell);
      } else {
        console.log(`in the else of the buy`);
      }
    });
    this.afs.CustomerListObserver.subscribe((res) => {
      if (res.length > 0) {
        this.customerInfo = res;
      }
    });
    // this.afs.getConfigValue('CSP_EFX_Timer').subscribe(res => {
    //   console.log(res);
    //   if (res.body.getConfigValueResult.length !== 0) {
    //     this.commonfunction.TimerValueFromCommonData = Number(res.body.getConfigValueResult[0].Default_Value);
    //   }
    // });
    this.afs.getConfigValue('EFX_NewTransactionAccountDetails');
    this.ConfigValueSubscription = this.afs.configValueObserver.subscribe(
      (data) => {
        if (data.length > 0) {
          const res = data[0].body.getConfigValueResult;
          if (res[0].Setting_Name === 'EFX_NewTransactionAccountDetails') {
            this.commonfunction.EFX_NewTransactionAccountDetails =
              res[0].Default_Value.toString().toLowerCase();
          }
        }
      }
    );
  }

  addNewCard(currency, visible) {
    try {
      if (visible === true) {
        this.apifunction.FXOBestPrice.next([]);
        this.commonfunction.FXOPrices.next([]);
        this.apifunction.GetFXDatesForSpotForwardSF.next('');
        if (this.MultiPair.length === 0) {
          this.apifunction.deletedTileID = 0;
        }
        this.MultiPair.push({
          ccy: currency,
          index: this.MultiPair.length + 1,
          favorite: false,
          tileID: 11,
          takePersistData: false,
        });

        this.msg = '';
        this.showCurrencySelection = false;
      } else {
        this.msg = 'Pair already exists';
      }
      // this.RefreshAll();
    } catch (ex) {
      // console.log(ex);
    }
  }

  removeCcyParent(ccy: string) {
    this.ccySelectionArray.forEach((pair) => {
      if (pair.ccy === ccy) {
        pair.visible = true;
      }
    });
  }

  removeCardParent(index: number) {
    try {
      // this.MultiPair.map(d=>{
      //   if(d['index'] === index){

      //   }else{
      //     dummypair.push({'ccy':d['ccy'], 'index':i});
      //     i++;
      //   }
      // });
      // this.MultiPair = dummypair;

      // console.log(dummypair);
      // console.log(this.MultiPair);
      this.MultiPair.splice(index - 1, 1);
      // console.log(this.MultiPair);
      // console.log('Removed : ',removed);
      this.apifunction.deletedTileID = index;
      this.apifunction.countDelectedTileReq = 0;
      this.changeIndexAfterRemoval.next(index);
    } catch (ex) {
      // console.log(ex);
    }
  }

  RefreshAll() {
    try {
      this.afs.deletedTileID = 0; // Added by Nilam V on 30-Jun-2021
      this.count++;
      this.refreshbtnflag = true;
      if (this.webSocketApi.socket$.isStopped) {
        this.webSocketApi.startSocket();
      }
      // this.commonfunction.callSubscribe(); //temp comment
      if (this.customerData !== '') {
        this.RefreshAllCurrencyRates.next(this.customerData);
        this.refreshbtnflag = false;
        this.error = '';
      } else {
        this.error = 'Profile details not found.';
        this.RefreshAllCurrencyRates.next(this.count + '');
      }
    } catch (exception) {
      console.log(exception);
    }
  }
  ForwardTradeParent() {
    this.forwardPopup = true;
    (document.getElementById('overlay') as HTMLInputElement).style.display =
      'block';
  }
  setRadiobtn(value) {
    this.checkedCP = value;
  }
  HideForwardPopup() {
    this.forwardPopup = false;
    (document.getElementById('overlay') as HTMLInputElement).style.display =
      'none';
  }
  showHidePopup() {
    this.commonfunction.getLPpopupflag(false);
  }
  selectTrade(tradePrice) {
    console.log('trade button clicked');
    this.commonfunction.selectLPforTrade(tradePrice);
    this.commonfunction.getLPpopupflag(false);
  }

  getSelectedCustomer(customer) {
    console.log(customer);
    // this.customerData =  CustomerName,ID,CIFNo,Segment,RMName,DealerID
    this.error = '';
    try {
      if (customer !== undefined) {
        this.customerData = '';
        this.customerData += customer.CustomerName + ',';
        this.customerData += customer.CustomerID + ',';

        this.homeApi.CustomerId = customer.CustomerID;
        // for (let i = 0; i < this.customerInfo.length; i++) {
        //   if (this.customerInfo[i].CustomerName === customer.CustomerName) {
        //     // this.CustPAN = this.customerInfo[i].CustomerID;
        //     this.customerData += this.customerInfo[i].AH_CIF_No + ',';
        //     this.customerData += this.customerInfo[i].AH_Customer_Segment + ',';
        //     this.customerData += this.customerInfo[i].RelManager + ',';
        //     this.customerData += this.customerInfo[i].DealerID + ',';
        //     break;
        //   }
        // }
        if (this.refreshbtnflag) {
          this.RefreshAllCurrencyRates.next(this.customerData);
          this.refreshbtnflag = false;
        }
        this.RefreshAll();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  filterCCY() {
    this.ccySelectionArray.forEach((element) => {
      this.MultiPair.forEach((pair) => {
        if (pair.ccy === element.ccy) {
          element.visible = false;
        }
      });
    });
  }
}
