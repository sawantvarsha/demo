import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { createChart, CrosshairMode, PriceScaleMode } from 'lightweight-charts';
import { EquitiesService } from 'src/app/services/equities.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { SignalrApiService } from 'src/app/services/signalR/signalr-api.service';
import { EQCCardDashboardComponent } from '../../structured-products/card-dashboard/card-dashboard.component';
// declare global {
//   interface Array<T> {
//     sortBy(arr, p): Array<T>;
//   }
// }

// Array.prototype.sortBy = (arr, p) => {
//   return arr.sort((a, b) => {
//     return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
//   });
// };

@Component({
  selector: 'app-eq-dashboard',
  templateUrl: './eq-dashboard.component.html',
  styleUrls: ['./eq-dashboard.component.scss'],
})
export class EqDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  watchlistNames: any;
  selectedWatchlist: any;
  watchlistData: any;
  portfolioList: any[];
  selectedPortfolio: any;
  clientHoldingsData: any;
  activeTab: any;
  clientOrdersData: any[];
  shareName: any;
  sharesList: any;
  selectedPortfolioTotalPnL: any;
  selectedPortfolioTotalAUM: any;
  isAddShareToWatchlist: boolean;
  newWatchlistData: any[];
  EditWatchlist: boolean;
  newWatchlistName: string;
  newWatchlist: any[];
  selectedPortfolioDetails: any;
  portfolioListddl: any;
  baseCcy: any;

  // chart
  isChart: boolean;
  expanded = false;
  chart: any;
  lineSeries: any;
  areaSeries: any;
  chartHeight: any;
  chartWidth: any;
  chartHeader: any;
  chartUnderlying: any;
  chartData: any[];
  toolTip: any;
  @ViewChild('chartBlotterContainer', { static: true })
  chartBlotterContainer: ElementRef;
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;
  @ViewChild('chartElement', { static: false }) chartElement: ElementRef;
  @ViewChild('priceChartContainer', { static: false })
  priceChartContainer: ElementRef;
  @ViewChild('priceChartElement', { static: false })
  priceChartElement: ElementRef;
  @ViewChild('sharesContainer', { static: false }) sharesContainer: ElementRef;
  @ViewChild('priceChartTooltip', { static: false })
  priceChartTooltip: ElementRef;
  chartTabs: any;
  today: any;
  shareData: any;
  product: string;
  showOrderEntry: boolean;
  portfolioSubscription: Subscription;
  domainURL = environment.domainURL;
  baseCCY: string;
  selectedCustomer: any;
  customerNames: any;
  loadflag: boolean;
  RMCustomerID: any;
  RMCustomerName: any;
  selectedCustomerDetails: any[];
  isUserRM: any;
  isSSL: any = environment.isSSL;
  sslURL: string = environment.sslURL;
  asseturl = environment.asseturl;
  activeShareIndex: any;
  selectedShare: any;
  bankBaseCcy: string;
  shareNMID: any;
  recordsPerPage: number;
  currentPage: number;
  showCancel: boolean;
  showAmend: boolean;
  action: any;
  actionData: any;

  @HostListener('window:resize')
  onResize() {
    // console.log(this.chartElement.nativeElement.clientHeight, this.chartElement.nativeElement.clientWidth);

    if (this.chart) {
      this.chart.applyOptions({
        width: this.chartElement.nativeElement.clientWidth,
        height: this.chartElement.nativeElement.clientHeight,
      });
      this.chart.timeScale().fitContent();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isAddShareToWatchlist = false;
      this.isChart = false;
      this.showOrderEntry = false;
    }
  }

  constructor(
    public custApi: CustomerApiService,
    public homeApi: HomeApiService,
    public workflowApi: WorkflowApiService,
    public authorApi: AuthService,
    public commonApi: CommonApiService,
    public router: Router,
    public equitiesApi: EquitiesService,
    public ref: ChangeDetectorRef,
    public safePipe: SafePipe,
    public location: Location,
    public signalRApi: SignalrApiService
  ) {
    this.selectedWatchlist = '';
    this.watchlistNames = [];
    this.watchlistData = [];
    this.newWatchlistData = [];
    this.shareName = '';
    this.newWatchlistName = '';
    this.newWatchlist = [];
    this.isChart = false;
    this.today = new Date();
    this.shareData = {};
    this.chartData = [];
    this.isUserRM = sessionStorage
      .getItem('UserType')
      .toUpperCase()
      .includes('RM')
      ? true
      : false;
    this.recordsPerPage = 10;
    this.currentPage = 1;
  }
  ngOnDestroy() {
    this.commonApi.HideSidebar(false);
    if (this.portfolioSubscription) {
      this.portfolioSubscription.unsubscribe();
    }
    this.reset();
  }
  ngAfterViewInit() {
    // $(document).ready(function () {
    //   $('p').click(function () {
    //     $(this).hide();
    //   });
    // });
    this.signalRApi.PriceFeedObs.subscribe((res) => {
      if (res !== 'No Price') {
        try {
          console.log(EQCCardDashboardComponent.name, JSON.parse(res));
          const priceRes = JSON.parse(res);
          if (priceRes.FeedType)
            this.watchlistData.forEach((wld) => {
              wld.prevspotbidquote = wld.spotbidquote;
              wld.prevspotaskquote = wld.spotaskquote;
              // console.log(wld);
              if (
                wld.FeedCode?.split('.')[0] === priceRes.FeedCode ||
                wld.FeedCode === priceRes.FeedCode
              ) {
                const feedInfo = Object.assign(
                  {},
                  ...priceRes.FeedInfo.map((item) => ({
                    [item['FieldName']]: item['FeedValue'],
                  }))
                );
                // this.EQWLFeed.FeedInfo.map((e) => {
                //   let obj = {};
                //   obj[e['FieldName']] = e['FeedValue'];
                //   return obj;
                // });
                // SpotBidQuote: BID;
                // SpotAskQuote: ASK;
                // lastrate: LAST_PRICE;
                // perdiff: RT_PX_CHG_PCT_1D;
                // dayhigh: HIGH;
                // daylow: LOW;
                // fiftytwoweekhigh: PRICE_52_WEEK_HIGH_RT;
                // fiftytwoweeklow: PRICE_52_WEEK_LOW_RT;
                // previousclose: PREV_SES_LAST_PRICE;
                // openrate: OPEN;
                // turnover: TURNOVER_TODAY_REALTIME;
                // volume: VOLUME;
                // netchange: PRICE_CHANGE_ON_DAY_RT;
                // wld.prevspotbidquote = wld.spotbidquote;
                // wld.prevspotaskquote = wld.spotaskquote;
                wld.spotbidquote =
                  feedInfo.SpotBidQuote === undefined
                    ? wld.spotbidquote
                    : feedInfo.SpotBidQuote;
                wld.spotaskquote =
                  feedInfo.SpotAskQuote === undefined
                    ? wld.spotaskquote
                    : feedInfo.SpotAskQuote;
                wld.DayChange = feedInfo.netchange;
                wld.LTP = feedInfo.previousclose;
                wld.perdiff = feedInfo.perdiff;
                console.log(wld.FeedCode, feedInfo);
              }
            });
        } catch (e) {}
      }
    });
  }
  async ngOnInit() {
    try {
      this.commonApi.HideSidebar(true);
      this.custApi.getBankBaseCCYOBS.subscribe((_ccy) => {
        this.bankBaseCcy = _ccy;

        this.refresh();
      });
      this.refresh();
    } catch (error) {}
  }
  async getWatchlistNames() {
    try {
      return await this.custApi
        .GetWatchListNames(
          this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
          this.homeApi.CustomerId
        )
        .then(
          (wln) => {
            console.log(wln.EQGetWatchListAPIResponse.items);
            if (wln.FinIQResponseHeader.Status === 'Succeed') {
              const wlNames: any[] = wln.EQGetWatchListAPIResponse.items;
              return wlNames.sort((a, b) => {
                return a.WatchlistName > b.WatchlistName
                  ? 1
                  : a.WatchlistName < b.WatchlistName
                  ? -1
                  : 0;
              });
            } else if (wln.FinIQResponseHeader.Status === 'Failed') {
              return [];
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  }
  changePortfolio() {
    // const pfList = this.portfolioList;
    this.selectedPortfolioDetails = this.portfolioList.filter(
      (pf) => pf.PortfolioName === this.selectedPortfolio
    )[0];
    // console.log(this.selectedPortfolioDetails);
    this.selectedPortfolioTotalAUM = parseFloat(
      this.selectedPortfolioDetails.TotalAUM
    );
    this.selectedPortfolioTotalPnL = parseFloat(
      this.selectedPortfolioDetails.TotalPnL
    );

    this.getHoldings(this.selectedPortfolioDetails);
    this.getOrders(this.selectedPortfolioDetails);
  }

  async changeSelectedWatchlist() {
    this.watchlistData = await this.custApi
      .GetWatchListData(
        this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
        this.homeApi.CustomerId,
        this.selectedWatchlist
      )
      .then(
        (wld) => {
          if (wld.FinIQResponseHeader.Status === 'Succeed') {
            const wlData = wld.EQGetWatchListDataAPIResponse.items;
            return wlData.sort((a, b) => {
              return a.WatchlistName > b.WatchlistName
                ? 1
                : a.WatchlistName < b.WatchlistName
                ? -1
                : 0;
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.watchlistData.forEach((wld) => {
      wld.prevspotbidquote = parseFloat(wld.spotbidquote);
      wld.prevspotaskquote = parseFloat(wld.spotaskquote);
    });
    console.log('this.watchlistData1', this.watchlistData);
  }

  // createNewWatchList() {
  //   this.custApi.AddSharetoWatchList(this.homeApi.CustomerName, 'WL', 'NewWl', 'nmid', this.homeApi.CustomerId).subscribe(res => {
  //     console.log(res);
  //   }, err => {
  //     console.log(err);
  //   });
  // }
  getHoldings(portfolio) {
    this.custApi
      .GetClientHoldingsData(
        this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
        portfolio.FacilityCode,
        this.homeApi.CustomerId
      )
      .subscribe((holdingsData) => {
        // console.log(holdingsData);
        if (holdingsData.FinIQResponseHeader.Status === 'Succeed') {
          this.clientHoldingsData =
            holdingsData.ListEQWAVPositionAPIResponse.items;
          this.clientHoldingsData.forEach((hold) => {
            const flaglink: any =
              'http://' +
              this.domainURL +
              '/assets/flags/' +
              this.custApi.bankBaseCCY +
              '.png';
            // hold.flaglink = 'http://' + this.domainURL + '/assets/flags/' + hold.QuotedAgainst + '.png';

            if (this.isSSL) {
              hold.flaglink = this.safePipe.transform(
                flaglink.replace(/http:/g, window.location.protocol),
                'resourceUrl'
              );
            }
          });
          console.log('HOldings Data', this.clientHoldingsData);
        } else {
          this.clientHoldingsData = [];
        }
      });
  }
  getOrders(portfolio) {
    this.custApi
      .GetClientOrdersData(
        portfolio.FacilityCode,
        'Pending',
        this.homeApi.CustomerId,
        this.currentPage,
        '999'
      )
      .subscribe((ordersData) => {
        // console.log(ordersData);
        if (ordersData.FinIQResponseHeader.Status === 'Succeed') {
          this.clientOrdersData = ordersData.ListEQWorkflowAPIResponse.items;
          this.clientOrdersData.forEach((ord) => {
            const flaglink: any =
              'http://' +
              this.domainURL +
              '/assets/flags/' +
              this.custApi.bankBaseCCY +
              '.png';
              ord.flaglink = 'http://' + this.domainURL + '/assets/flags/' + ord.Settlement_Ccy + '.png';

            if (this.isSSL) {
              ord.flaglink = this.safePipe.transform(
                flaglink.replace(/http:/g, window.location.protocol),
                'resourceUrl'
              );
            }
          });
          // console.log('Orders Data', this.clientOrdersData);

          const result = [
            ...// spread the values iterator to an array
            this.clientOrdersData
              .reduce((r, o) => {
                const key = `${o.Security_ID}---${o.TradeDate}---${o.Order_Type}`; // generate a key with name and age
                if (!r.has(key)) r.set(key, []); // add a new entry for key if it's not in the Map

                r.get(key).push(o); // push the current object to the keys's entry

                return r;
              }, new Map())
              .values(), // get the Maps values iterator
          ];
          let ClusteredArr = [];
          result.forEach((r) => {
            const obj = r.reduce(
              (result, currentValue) => {
                result.Security_ID = currentValue.Security_ID;
                result.TradeDate = currentValue.TradeDate;
                result.Product_Name = currentValue.Product_Name;
                result.Dealer_Price = currentValue.Dealer_Price;
                result.Currency = currentValue.Currency;
                result.BuySell = currentValue.BuySell;
                // If an array already present for key, push it to the array. Else create an array and push the object
                result.TotalQty =
                  result.TotalQty + parseFloat(currentValue.Quantity);
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
              },
              { TotalQty: 0 }
            );
            ClusteredArr.push(obj);
          });

          // console.log(result, ClusteredArr);
        } else {
          this.clientOrdersData = [];
        }
      });
    // this.custApi.GetClientOrdersData(portfolio.FacilityCode, 'Executed', this.homeApi.CustomerId).subscribe(ordersData => {
    //   console.log(ordersData);
    //   if (ordersData.FinIQResponseHeader.Status === 'Succeed') {
    //     this.clientOrdersData = ordersData.ListEQWorkflowAPIResponse.items;
    //   }
    // });
  }
  changeTab(tab) {
    this.activeTab = tab.toUpperCase();
    switch (this.activeTab) {
      case 'HOLDINGS':
        this.getHoldings(this.selectedPortfolioDetails);
        break;
      case 'ORDERS':
        this.getOrders(this.selectedPortfolioDetails);
        break;

      default:
        break;
    }
  }
  async searchEquities(event: KeyboardEvent) {
    // try {
    //   this.sharesList = await this.workflowApi
    //     .SearchEquities(this.shareName)
    //     .then((res) => {
    //       // console.log(res.ListProduct.items);
    //       return res.ListProduct.items === null ? [] : res.ListProduct.items;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // } catch (error) {}

    try {
      // console.log(event);
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
        this.sharesList = await this.workflowApi
          .SearchEquities(this.shareName)
          .then((res) => {
            // console.log(res.ListProduct.items);
            return res.ListProduct.items === null ? [] : res.ListProduct.items;
          })
          .catch((err) => {
            console.log(err);
          });
        this.activeShareIndex = 0;
        // this.sharesList.forEach((s, i) => {
        //   if (i === this.activeShareIndex) {
        //     s.active = true;
        //   } else {
        //     s.active = false;
        //   }
        // });
        // this.selectedShare = this.sharesList.filter((s) => s.active)[0];
        this.selectShare();
      }
    } catch (error) {}
  }
  async addShareToWatchlist(share) {
    try {
      if (this.isAddShareToWatchlist) {
        this.shareName = '';
        // this.newWatchlistData.push(share);
        const isWlAdded = await this.custApi
          .AddSharetoWatchList(
            this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
            this.newWatchlistName,
            this.newWatchlistName,
            share.Note_Master_Id,
            this.homeApi.CustomerId
          )
          .then(
            (res) => {
              // console.log(res);
              return res.EQAddtoWatchListAPIResponse.Added;
            },
            (err) => {
              console.log(err);
            }
          )
          .catch((err) => {
            console.log(err);
          });
        if (isWlAdded.toUpperCase() === 'TRUE') {
          this.watchlistNames = await this.getWatchlistNames();
          this.selectedWatchlist = this.newWatchlistName;
          this.changeSelectedWatchlist();
          this.isAddShareToWatchlist = false;
        }
        // console.log(share);
      } else {
        this.shareName = '';
        this.custApi
          .AddSharetoWatchList(
            this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
            this.selectedWatchlist,
            this.selectedWatchlist,
            share.Note_Master_Id,
            this.homeApi.CustomerId
          )
          .then(
            (_res) => {
              // console.log(res);
              this.changeSelectedWatchlist();
            },
            (err) => {
              console.log(err);
            }
          )
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {}
  }
  async deleteShareFromWatchList(nmid) {
    try {
      const isShareDeleted = await this.custApi
        .DeleteShareFromWatchList(
          this.selectedWatchlist,
          parseInt(nmid, 10),
          this.homeApi.CustomerId
        )
        .then(
          (res) => {
            // console.log(res);
            return res.EQDeletefromWatchListAPIResponse.Deleted;
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((err) => {
          console.log(err);
        });
      if (isShareDeleted.toUpperCase() === 'TRUE') {
        this.refresh();
      }
    } catch (error) {}
  }

  orderShare(share, dir) {
    this.product = 'SHARES';
    this.showOrderEntry = true;
    this.commonApi.setAsset(share.FeedCode || share.Feedcode);
    this.commonApi.setDirection(dir);
    this.shareNMID = share.Note_Master_Id;
    this.action = 'SUBSCRIBE'
    this.actionData = [];
  }
  orderShareFromHoldings(share, dir, ) {
    this.product = 'SHARES';
    this.showOrderEntry = true;
    this.commonApi.setAsset(share.CEHD_Stock_Code || share.CEHD_Stock_Code);
    this.commonApi.setDirection(dir);
    this.shareNMID = share.Note_Master_Id;
    this.action = 'SUBSCRIBE'
    this.actionData = [];
  }

  orderShareFromOrders(share, action) {
    this.product = 'SHARES';
    this.showOrderEntry = true;
    this.commonApi.setAsset(share.Security_ID || share.Security_ID);
    this.commonApi.setDirection(share.BuySell);
    this.commonApi.setPortfolio(this.selectedPortfolioDetails);
    this.shareNMID = '';
    this.action = action;
    this.actionData = share;
  }
  async deleteWatchList() {
    this.refresh();
  }
  toggleAddShareToWatchlist() {
    this.isAddShareToWatchlist = !this.isAddShareToWatchlist;
    this.newWatchlistName = '';
  }
  toggleEditWatchlist() {
    this.EditWatchlist = !this.EditWatchlist;
  }
  async showChart(share) {
    this.isChart = true;
    if (this.isChart) {
      this.shareData = await this.getShareDate(share);
      await this.createShareChart(share);
    }
  }
  closeChart() {
    this.isChart = false;
  }
  async getShareDate(underlying) {
    if (underlying.Note_Master_Id === '') {
      const noteMasterID = await this.workflowApi
        .SearchEquities(underlying.CEHD_Stock_Code)
        .then((res) => {
          return res.ListProduct.items === null
            ? []
            : res.ListProduct.items[0].Note_Master_Id;
        })
        .catch((err) => {
          console.log(err);
        });

      return await this.equitiesApi
        .GetShareInfo(noteMasterID)
        .then((res: any) => res.ListInfoProduct.ProductDetails)
        .catch((err) => console.log(err));
    } else {
      return await this.equitiesApi
        .GetShareInfo(underlying.Note_Master_Id)
        .then((res: any) => res.ListInfoProduct.ProductDetails)
        .catch((err) => console.log(err));
    }
  }
  async createShareChart(underlying) {
    this.chartHeight =
      this.chartBlotterContainer.nativeElement.scrollHeight - 160;
    this.chartWidth =
      this.chartBlotterContainer.nativeElement.scrollWidth - 40;

    // console.log('Height', this.chartHeight, 'Width', this.chartWidth);
    this.chartHeader = underlying.Product_Name || underlying.LongName;
    this.chartUnderlying = underlying.FeedCode || underlying.CEHD_Stock_Code;
    if (!this.chart) {
      this.chart = createChart(this.chartElement.nativeElement, {
        height: this.chartHeight,
        width: this.chartWidth,
        rightPriceScale: {
          visible: true,
          alignLabels: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          borderColor: '#808080',
        },
        timeScale: {
          borderColor: '#808080',
        },
        layout: {
          backgroundColor: '#ffffff00',
          textColor: '#808080',
          fontSize: 11,
          fontFamily: '"Segoe UI", sans-serif',
          //  backgroundColor: '#fff;', textColor: '#ffffff', fontSize: 15
        },
        grid: {
          vertLines: {
            visible: true,
            color: 'rgba(112, 112, 112, 0.2)',
          },
          horzLines: {
            visible: true,
            color: 'rgba(112, 112, 112, 0.2)',
          },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
        },
      });

      this.areaSeries = this.chart.addAreaSeries({
        topColor: 'rgb(0, 121, 193,0.5)',
        bottomColor: 'transparent',
        // bottomColor: 'rgb(0, 121, 193,0.3)',
        lineColor: 'rgb(0, 121, 193)',
        lineWidth: 2,
      });
      if (underlying === '') {
        this.areaSeries.setData(this.chartData);
      } else {
        // $('#loading').show();
        // setTimeout(()=>{
        const eqChartData = await this.equitiesApi
          .GetShareHistoricalData(
            underlying.FeedCode || underlying.CEHD_Stock_Code
          )
          .then(
            (res: any) =>
              res.GetPriceHistory_DataResponse.GetPriceHistory_DataResult[0][
                'a:HistoryPrice'
              ]
          )
          .catch((err) => console.log(err));
        if (eqChartData) {
          const data: any = [];
          const months = [
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

          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < eqChartData.length; i++) {
            let dateArray = [];
            dateArray = eqChartData[i]['a:TradeDate'][0].split('-');
            let monthNo = months.indexOf(dateArray[1]) + 1 + '';
            if (monthNo.length === 1) {
              monthNo = '0' + monthNo;
            }
            data.push({
              time: { day: dateArray[0], month: monthNo, year: dateArray[2] },
              value: parseFloat(eqChartData[i]['a:ClosePrice'][0]),
            });
          }
          const cd = data;
          // console.log(cd);
          // console.log(this.chartData);
          this.chartData = cd;
          //Changed By MohanP | 04Feb22
          this.changeChartTabs(3);
          // console.log("this.chartData", this.chartData);
        } else {
          this.chartData = [];
          // this.areaSeries.setData(this.chartData);
        }

        // });
      }
      // this.areaSeries.setData(this.chartData);
      this.chart.timeScale().fitContent();
      // this.isChart = false;

      this.toolTip = document.createElement('div');
      this.toolTip.className = 'floating-tooltip';
      this.chartElement.nativeElement.appendChild(this.toolTip);
      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;
      this.chart.subscribeCrosshairMove((param) => {
        // // console.log(param);
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > this.chartElement.nativeElement.clientWidth ||
          param.point.y < 0 ||
          param.point.y > this.chartElement.nativeElement.clientHeight
        ) {
          this.toolTip.style.display = 'none';
        } else {
          const dateStr = this.businessDayToString(param.time);
          this.toolTip.style.display = 'block';
          const price = param.seriesPrices.get(this.areaSeries);
          this.toolTip.innerHTML =
            '<div style="color: var(--active)">' +
            this.chartHeader +
            '</div>' +
            '<div style="font-size: 24px; margin: 4px 0px; color: var(--text)">' +
            Math.round(100 * price) / 100 +
            '</div><div style="color: var(--text)">' +
            dateStr +
            '</div>';
          const coordinate = this.areaSeries.priceToCoordinate(price);
          let shiftedCoordinate = param.point.x - 50;
          if (coordinate === null) {
            return;
          }
          shiftedCoordinate = Math.max(
            0,
            Math.min(
              this.chartElement.nativeElement.clientWidth - toolTipWidth,
              shiftedCoordinate
            )
          );
          const coordinateY =
            coordinate - toolTipHeight - toolTipMargin > 0
              ? coordinate - toolTipHeight - toolTipMargin
              : Math.max(
                  0,
                  Math.min(
                    this.chartElement.nativeElement.clientHeight -
                      toolTipHeight -
                      toolTipMargin,
                    coordinate + toolTipMargin
                  )
                );
          this.toolTip.style.left = shiftedCoordinate + 'px';
          this.toolTip.style.top = coordinateY + 'px';
        }
      });
    } else {
      const eqChartData = await this.equitiesApi
        .GetShareHistoricalData(
          underlying.FeedCode || underlying.CEHD_Stock_Code
        )
        .then(
          (res: any) =>
            res.GetPriceHistory_DataResponse.GetPriceHistory_DataResult[0][
              'a:HistoryPrice'
            ]
        )
        .catch((err) => console.log(err));

      if (eqChartData) {
        const data: any = [];
        const months = [
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

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < eqChartData.length; i++) {
          let dateArray = [];
          dateArray = eqChartData[i]['a:TradeDate'][0].split('-');
          let monthNo = months.indexOf(dateArray[1]) + 1 + '';
          if (monthNo.length === 1) {
            monthNo = '0' + monthNo;
          }
          data.push({
            time: { day: dateArray[0], month: monthNo, year: dateArray[2] },
            value: parseFloat(eqChartData[i]['a:ClosePrice'][0]),
          });
        }
        const cd = data;
        // console.log(cd);
        this.chartData = cd;
        this.changeChartTabs(3);
        // console.log(this.chartData);
      } else {
        this.chartData = [];
        this.areaSeries.setData(this.chartData);
      }
      this.chart.applyOptions({
        width: this.chartWidth,
        height: this.chartHeight,
      });
    }
  }
  businessDayToString(businessDay) {
    return businessDay.year + '-' + businessDay.month + '-' + businessDay.day;
  }
  changeChartTabs(tabno) {
    let cd;
    switch (tabno) {
      case 1:
        this.chartTabs = tabno;
        cd = this.chartData.slice(
          this.chartData.length - 7,
          this.chartData.length
        );
        if (cd[0].value > cd[cd.length - 1].value) {
          // Red
          this.areaSeries.applyOptions({
            topColor: 'rgb(234, 147, 147,0.8)',
            bottomColor: 'transparent',
            lineColor: 'rgb(221, 51, 35)',
            lineWidth: 2,
          });
        } else {
          // Green
          this.areaSeries.applyOptions({
            topColor: 'rgb(210, 245, 225,0.5)',
            bottomColor: 'transparent',
            lineColor: 'rgb(6, 209, 90)',
            lineWidth: 2,
          });
        }
        this.areaSeries.setData(cd);
        break;
      case 2:
        this.chartTabs = tabno;
        cd = this.chartData.slice(
          this.chartData.length - 30,
          this.chartData.length
        );
        if (cd[0].value > cd[cd.length - 1].value) {
          // Red
          this.areaSeries.applyOptions({
            topColor: 'rgb(234, 147, 147,0.8)',
            bottomColor: 'transparent',
            lineColor: 'rgb(221, 51, 35)',
            lineWidth: 2,
          });
        } else {
          // Green
          this.areaSeries.applyOptions({
            topColor: 'rgb(210, 245, 225,0.5)',
            bottomColor: 'transparent',
            lineColor: 'rgb(6, 209, 90)',
            lineWidth: 2,
          });
        }
        this.areaSeries.setData(cd);
        break;
      case 3:
        this.chartTabs = tabno;
        cd = this.chartData;
        if (cd[0].value > cd[cd.length - 1].value) {
          // Red
          this.areaSeries.applyOptions({
            topColor: 'rgb(234, 147, 147,0.8)',
            bottomColor: 'transparent',
            lineColor: 'rgb(221, 51, 35)',
            lineWidth: 2,
          });
        } else {
          // Green
          this.areaSeries.applyOptions({
            topColor: 'rgb(210, 245, 225,0.5)',
            bottomColor: 'transparent',
            lineColor: 'rgb(6, 209, 90)',
            lineWidth: 2,
          });
        }
        this.areaSeries.setData(cd);
        break;

      default:
        break;
    }
    this.chart.timeScale().fitContent();
    this.chart.applyOptions({
      priceScale: {
        autoScale: true,
        mode: PriceScaleMode.Normal,
        // invertScale: true,
        // alignLabels: false,
        // borderVisible: false,
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
      },
    });
  }
  async refresh() {
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    let portfolio;
    if (this.homeApi.Portfolio === 0) {
      portfolio = null;
    } else {
      portfolio = this.homeApi.Portfolio;
    }
    this.portfolioSubscription = this.homeApi
      .GetAUMandPNL(
        this.homeApi.CIF,
        this.isUserRM ? this.RMCustomerName : this.authorApi.UserName,
        'ASSET',
        this.bankBaseCcy,
        portfolio
      )
      .subscribe((result) => {
        if (result.FinIQResponseHeader.Status === 'Succeed') {
          if (result.length !== 0) {
            // console.log(result);
            this.portfolioList =
              result.ResponseBody.ClientWiseHoldings.ClientwisePortfolioDetails;
            this.portfolioListddl =
              result.ResponseBody.ClientWiseHoldings.ClientwisePortfolioDetails;
            let resAUM = result.ResponseBody.ClientWiseHoldings;
            this.homeApi.BestPortfolio = resAUM.ClientwisePortfolioDetails;
            this.homeApi.AUM = resAUM.TotalAUM;
            this.homeApi.PNL = resAUM.TotalPnL;
            this.baseCcy = result.ResponseBody.ClientWiseHoldings.BaseCurrency;
            this.selectedPortfolioDetails = this.portfolioList[0];
            this.selectedPortfolio = this.portfolioList[0].PortfolioName;
            this.selectedPortfolioTotalAUM = parseFloat(
              this.portfolioList[0].TotalAUM
            );
            this.selectedPortfolioTotalPnL = parseFloat(
              this.portfolioList[0].TotalPnL
            );
            this.changeTab('holdings');
          }
        } else if (result.FinIQResponseHeader.Status === 'Fail') {
          this.portfolioList = [];
          this.portfolioListddl = [];
          this.baseCcy = '';
          this.selectedPortfolioDetails = '';
          this.selectedPortfolio = '';
          this.selectedPortfolioTotalAUM = '';
          this.selectedPortfolioTotalPnL = '';
        }
      });
    this.watchlistNames = await this.getWatchlistNames();
    // this.watchlistNames = await this.getWatchlistNames();
    this.selectedWatchlist =
      this.watchlistNames.length > 0
        ? this.watchlistNames.filter(
            (wl) => wl.WatchlistName === this.selectedWatchlist
          ).length > 0
          ? this.selectedWatchlist
          : this.watchlistNames[0].WatchlistName
        : '';
    this.changeSelectedWatchlist();
    this.workflowApi.shareList = await this.workflowApi
      .SearchEquities(this.shareName)
      .then((res) => {
        // console.log(res.ListProduct.items);
        return res.ListProduct.items === null ? [] : res.ListProduct.items;
      })
      .catch((err) => {
        console.log(err);
      });
    this.ref.detectChanges();
  }
  selectedCustomerValue1(e) {
    this.loadflag = true;
    // console.log(e);
    this.RMCustomerID = e.CustomerID;
    this.RMCustomerName = e.CustomerName.split('|')[0];
    this.homeApi.CustomerId = e.CustomerID;
    this.homeApi.CustomerName = e.CustomerName;
    // this.homeApi.CustomerName = e.CustomerName.split('|')[0];
    this.homeApi.CIF = e.CIF;
    this.refresh();
  }

  getCustomerDetails(res) {
    this.reset();
    if (res.length > 0) {
      this.selectedCustomerDetails = [];
      this.selectedCustomerDetails = res;
    } else {
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.watchlistData,
      event.previousIndex,
      event.currentIndex
    );
    console.log('this.watchlistData', this.watchlistData);
    const wlData: any[] = this.watchlistData.map((wl, i) => {
      return {
        Customer: this.homeApi.CustomerId.toString(),
        Login: this.authorApi.UserName,
        Watchlist: this.selectedWatchlist,
        ID: (i + 1).toString(),
        Note_Master_Id: wl.Note_Master_Id,
        Underlying: wl.FeedCode,
        Type: 'EQ',
      };
    });
    wlData.unshift({
      Customer: this.homeApi.CustomerId.toString(),
      Login: this.authorApi.UserName,
      Watchlist: this.selectedWatchlist,
      ID: '',
      Note_Master_Id: '',
      Underlying: '',
      Type: 'EQ',
    });
    const wlSaveOrder = {
      items: wlData,
    };

    this.custApi.SaveOrderWatchlist(JSON.stringify(wlSaveOrder)).then((res) => {
      console.log(res);
    });
  }
  reset() {
    this.watchlistNames = [];
    this.watchlistData = [];
    this.selectedWatchlist = '';
    this.newWatchlistData = [];
    this.shareName = '';
    this.newWatchlistName = '';
    this.newWatchlist = [];
    this.isChart = false;
    this.shareData = {};
    this.baseCcy = '';
    this.selectedPortfolioTotalAUM = '';
    this.selectedPortfolioTotalPnL = '';
    this.portfolioList = [];
    this.portfolioListddl = [];
    this.baseCcy = '';
    this.selectedPortfolioDetails = '';
    this.selectedPortfolio = '';
    // this.homeApi.CustomerName = '';
    // this.authorApi.UserName = '';
  }
  back() {
    this.location.back();
  }
  changeSearchIndex(dir) {
    switch (dir) {
      case 'DOWN':
        this.activeShareIndex =
          this.sharesList.length - 1 === this.activeShareIndex
            ? 0
            : this.activeShareIndex + 1;

        break;
      case 'UP':
        this.activeShareIndex =
          this.activeShareIndex > 0
            ? this.activeShareIndex - 1
            : this.sharesList.length - 1;

        break;

      default:
        break;
    }
    this.selectShare();
    this.commonApi.ScrollTo('.shares-list', '.active-share', 'down');

    console.log(this.sharesList);
  }
  selectShare() {
    this.sharesList.forEach((s, i) => {
      s.active = false;
      if (i === this.activeShareIndex) {
        s.active = true;
      }
    });
    this.selectedShare = this.sharesList.filter((s) => s.active)[0];
  }
  onPageChangeOrders(pageNo) {
    this.currentPage = pageNo;
    // this.getOrders(this.selectedPortfolio);
  }
  clickActions(value) {
    try {
      this.showAmend = false;
      this.showCancel = false;
      switch (value) {
        case "amend":
          this.showAmend = true;
          break;
        case "cancel":
          this.showCancel = true;
          break;
        default:
          break;
      }
    } catch (error) {
    }
  }
}
