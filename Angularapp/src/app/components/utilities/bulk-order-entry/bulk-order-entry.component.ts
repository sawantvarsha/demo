import { Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { EquitiesService } from 'src/app/services/equities.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { BulkOrderEntryModel } from './bulk-order.model';
import { createChart, CrosshairMode, PriceScaleMode } from 'lightweight-charts';
//Changed by MohanP | 2FEB22
@Component({
  selector: 'app-bulk-order-entry',
  templateUrl: './bulk-order-entry.component.html',
  styleUrls: ['./bulk-order-entry.component.scss'],
})
export class BulkOrderEntryComponent implements OnInit {
  shareName: any;
  sharesList: any;
  shareData: any;
  shareDataChart: any;
  selectedShare: any;
  ShareOrderType: string;
  orderDetail: BulkOrderEntryModel;
  orderDetailsArr: BulkOrderEntryModel[];
  bankBaseCcy: string;
  portfolioList: any[];
  activeShareIndex: number;
  focusedRow: number;
  EQOrderSaveSubscription: Subscription;
  showPopup: any;
  chart: any;
  lineSeries: any;
  areaSeries: any;
  chartHeight: any;
  chartWidth: any;
  chartHeader: any;
  chartUnderlying: any;
  chartData: any[];
  chartTabs: any;
  toolTip: any;
  isPlaceBulkOrder: boolean;
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
  today: any;
  showSuitabilityPopup: boolean;
  SuitabilityNMID: string;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.shareName = '';
        break;
      case 'F8':
        this.placeBulkOrder();
        break;
      case 'F9':
        this.reset();
        break;

      default:
        break;
    }
  }

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

  constructor(
    public custApi: CustomerApiService,
    public workflowApi: WorkflowApiService,
    public ref: ChangeDetectorRef,
    public commonApi: CommonApiService,
    public homeApi: HomeApiService,
    public authApi: AuthService,
    public equitiesApi: EquitiesService,
    // public safePipe: SafePipe,
    public location: Location
  ) {
    this.orderDetailsArr = [];
    this.orderDetail = new BulkOrderEntryModel();
    this.shareName = '';
    this.activeShareIndex = 0;
    this.showPopup = false;
    this.chartData = [];
    this.shareData = {};
  }

  ngOnInit(): void {
    this.custApi.getBankBaseCCYOBS.subscribe((_ccy) => {
      this.bankBaseCcy = _ccy;
      this.refresh();
    });
  }
  async searchEquities(event: KeyboardEvent) {
    try {
      console.log(event);
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
  async refresh() {
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
  //Changed By MohanP | 04Feb22
  async placeBulkOrder() {
    this.orderDetailsArr.forEach(async (order) => {
      if (!order.isOrderSuccess) {
        if (order.isValid) {
          order.isLoading = true;
          order.message = '';
          order.isError = false;
          const isSuitabilityValid: boolean = await this.checkOrderSuitability(
            order
          );
          console.log(order.shareName, isSuitabilityValid);
          if (isSuitabilityValid) {
            this.placeOrder(order);
          } else {
            order.isSuitabilityValid = false;
          }
        }
      }
    });
    this.isPlaceBulkOrder = false;
  }
  placeOrder(orderDetail: BulkOrderEntryModel) {
    try {
      if (orderDetail.orderSubmitType.toUpperCase() === 'SUBSCRIBE') {
        this.equitiesApi
          .SubscribeEquitiesBulkOrder(
            orderDetail.feedCode,
            orderDetail.direction,
            orderDetail.currency,
            orderDetail.tradeDate,
            orderDetail.settlementType,
            orderDetail.settlementDate,
            orderDetail.orderType,
            orderDetail.orderType === 'Limit'
              ? orderDetail.limitRate
              : orderDetail.orderRate,
            orderDetail.timeInForce,
            orderDetail.tradeDate,
            orderDetail.quantity,
            orderDetail.exchange,
            orderDetail.customerDetails.facilityCode,
            orderDetail.customerDetails.custName,
            orderDetail.rm,
            orderDetail.customerDetails.accountNo,
            orderDetail.customerDetails.custID,
            orderDetail.settlementAmount
          )
          .toPromise()
          .then((res: any) => {
            if (res.length === 0) {
              orderDetail.isOrderSuccess = false;
            } else {
              if (res.FinIQResponseHeader.Status === 'Failed') {
                let errormessage =
                  res.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails
                    .Description;
                orderDetail.isLoading = false;
                orderDetail.isError = true;
                orderDetail.errorMessage = errormessage;
                orderDetail.isSuitabilityValid = true;
                orderDetail.isOrderSuccess = false;
              } else {
                let successmessage =
                  res.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
                orderDetail.isLoading = false;
                orderDetail.orderID = successmessage;
                //Changed by MohanP | 2Feb22
                if (orderDetail.isSuitabilityValid) {
                  orderDetail.message =
                    'Order placed successfully with Ref No. ' + successmessage;
                } else {
                  orderDetail.isSuitabilityValidRef = false;
                  orderDetail.errorMessage = 'Suitability Checks Failed!';
                  orderDetail.message =
                    'Order placed successfully with Ref No. ' + successmessage;
                }
                // orderDetail.message =
                //   'Order placed successfully with Ref No. ' + successmessage;
                orderDetail.isOrderSuccess = true;
                //Changed by MohanP | 02Feb22
                if (orderDetail.suitabiltyTable.length > 0) {
                  this.equitiesApi
                    .getSuitabilityToken(orderDetail)
                    .then((token) => {
                      console.log(token);
                    });
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
            orderDetail.isLoading = false;
            orderDetail.isError = true;
            orderDetail.isSuitabilityValid = true;
            orderDetail.isOrderSuccess = false;
            orderDetail.errorMessage = 'Order placement failed';
          });
      }
      // else if (this.ShareOrderType === 'Amend Order') {
      //   // console.log('amend')
      //   this.workflowApi.AmendShareOrder(
      //     this.OID,
      //     this.OrderQty,
      //     this.NominalAmount,
      //     this.RM_Order,
      //     this.RM_Order,
      //     this.Remark,
      //     this.portfolio
      //   );
      // } else if (this.ShareOrderType === 'Cancel Order') {
      //   // console.log('cancel')
      //   this.workflowApi.CancelShareOrder(
      //     this.expiryDate,
      //     this.clorId,
      //     this.Remark,
      //     'CANCEL'
      //   );
      // }
    } catch (error) {}
  }
  async addShareToBulkOrder(share) {
    this.shareName = '';

    this.shareData = await this.getShareDate(share);
    // console.log("share",share, this.shareData);
    let orderDetail: BulkOrderEntryModel = new BulkOrderEntryModel();
    orderDetail.direction = 'Buy';

    orderDetail.feedCode = this.shareData.Feedcode;
    orderDetail.shareName = this.shareData.Product_Name;
    orderDetail.ISIN = this.shareData.Isin;
    orderDetail.LotSize = this.shareData.LotSize;
    orderDetail.exchange = this.shareData.Exchange;
    orderDetail.NoteMasterId = this.shareData.NoteMasterID;

    orderDetail.currency = this.shareData.Currency;
    orderDetail.tradeDate = this.shareData.TradeDate;
    orderDetail.settlementDate = this.shareData.SettlementDate;
    orderDetail.askRate = this.shareData.AskPx;
    orderDetail.bidRate = this.shareData.BidPx;
    orderDetail.orderRate =
      orderDetail.direction.toUpperCase() === 'BUY'
        ? this.shareData.AskPx
        : this.shareData.BidPx;
    orderDetail.settlementType = this.shareData.SettlementType;
    orderDetail.orderType = 'Market';
    orderDetail.timeInForce = 'DAY';
    orderDetail.quantity = this.commonApi.formatNumberWithKLM(
      this.shareData.LotSize
    );
    orderDetail.lotsize = this.shareData.LotSize;

    orderDetail.rm = this.authApi.UserName;

    orderDetail.customerDetails.custName = this.homeApi.CustomerName;
    orderDetail.customerDetails.custID = this.homeApi.CustomerId;

    orderDetail.settlementAmount = (
      (orderDetail.orderType === 'Limit'
        ? orderDetail.limitRate
        : orderDetail.direction === 'Buy'
        ? orderDetail.askRate
        : orderDetail.bidRate) * parseFloat(orderDetail.quantity)
    ).toFixed();
    orderDetail.orderSubmitType = 'Subscribe';

    orderDetail.portfolioList = this.homeApi.BestPortfolio.map((pf) => {
      return { portfolioName: pf.PortfolioName, facilityCode: pf.FacilityCode };
    });
    orderDetail.customerDetails.facilityCode =
      orderDetail.portfolioList[0].facilityCode;
    orderDetail.customerDetails.portfolio =
      orderDetail.portfolioList[0].portfolioName;

    this.updatePortfolio(orderDetail);

    this.orderDetailsArr.push(orderDetail);
    console.log(this.orderDetailsArr);
  }

  async getShareDate(underlying) {
    if (this.showPopup) {
      return await this.equitiesApi
        .GetShareInfo(underlying.NoteMasterId)
        .then((res: any) => res.ListInfoProduct.ProductDetails)
        .catch((err) => console.log(err));
    }
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
    console.log('CHART', underlying.feedCode);
    this.chartHeight =
      this.chartBlotterContainer.nativeElement.scrollHeight - 100;
    this.chartWidth =
      this.chartBlotterContainer.nativeElement.scrollWidth - 500;

    // console.log('Height', this.chartHeight, 'Width', this.chartWidth);
    this.chartHeader = underlying.shareName;
    this.chartUnderlying = underlying.feedCode;
    // this.chartHeader = underlying.shareName || underlying.LongName;
    // this.chartUnderlying = underlying.feedCode || underlying.CEHD_Stock_Code;
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
          .GetShareHistoricalData(underlying.feedCode)
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
          this.changeChartTabs(3);
          // console.log(this.chartData);
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
      console.log();
      const eqChartData = await this.equitiesApi
        .GetShareHistoricalData(
          underlying.feedCode || underlying.CEHD_Stock_Code
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

  updatePortfolio(orderDetail: BulkOrderEntryModel) {
    // orderDetail.customerDetails.portfolio = '52-S-CUS-1';
    // orderDetail.customerDetails.accountNo = '0538253670';

    this.workflowApi
      .getAccountNumberFromPortfolioGeneric(
        orderDetail.customerDetails.custID,
        orderDetail.customerDetails.facilityCode,
        orderDetail.currency
      )
      .subscribe((res) => {
        if (res) {
          orderDetail.accountNoList = [];
          orderDetail.accountNoList =
            res.ExecGenericTableValuedFunctionResult.map((acc) => {
              return {
                accountNo: acc.Param1,
                active: acc.Param2,
                facilityCode: acc.Param3,
                currency: acc.Param4,
                portfolioName: acc.Param5,
              };
            });
          if (orderDetail.accountNoList.length !== 0) {
            orderDetail.customerDetails.accountNo =
              orderDetail.accountNoList[0].accountNo;
            orderDetail.customerDetails.accountCurrency =
              orderDetail.accountNoList[0].currency;
            orderDetail.isError = false;
            orderDetail.isSuitabilityValid = true;
            orderDetail.errorMessage = '';
          } else {
            orderDetail.isError = true;
            orderDetail.isSuitabilityValid = true;
            orderDetail.errorMessage =
              'No ' +
              orderDetail.currency +
              ' account found in ' +
              orderDetail.customerDetails.portfolio;
          }
          this.ref.detectChanges();
        }
      });
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
  removeRow(_share, index) {
    this.orderDetailsArr.splice(index, 1);
    console.log(this.orderDetailsArr);
  }
  focusRow(i: number) {
    this.focusedRow = i;
  }
  closeChart() {
    this.showPopup = !this.showPopup;
  }
  async chartPopup(share) {
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      this.shareDataChart = await this.getShareDate(share);
      await this.createShareChart(share);
    }
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
  reset() {
    this.orderDetailsArr = [];
    this.shareName = '';
    this.isPlaceBulkOrder = false;
  }
  validateRows() {
    this.orderDetailsArr.forEach((order) => {
      this.validate(order);
    });
  }
  validate(order: BulkOrderEntryModel) {
    if (parseFloat(order.quantity) <= 0) {
      order.message = 'Quantity should be greater than 0';
      order.isError = true;
      order.isValid = false;
      // return;
    } else if (
      (parseInt(this.commonApi.unformatNumber(order.quantity)) /
        parseInt(order.lotsize)) %
        1 !=
      0
    ) {
      order.message =
        'Quantity should be multiple of Lot Size: ' + order.lotsize;
      order.isError = true;
      order.isValid = false;
      // return;
    } else {
      order.message = '';
      order.isError = false;
      order.isValid = true;
    }
  }
  onDirectionChange(order: BulkOrderEntryModel) {
    switch (order.direction.toUpperCase()) {
      case 'BUY':
        order.orderRate = parseFloat(order.askRate).toFixed(2);
        break;
      case 'SELL':
        order.orderRate = parseFloat(order.bidRate).toFixed(2);
        break;

      default:
        break;
    }
  }
  changeRow(_order: BulkOrderEntryModel, index, direction) {
    switch (direction) {
      case 'UP':
        if (index !== 0)
          document.getElementById('orderQty' + (index - 1)).focus();
        break;
      case 'DOWN':
        if (index !== this.orderDetailsArr.length - 1)
          document.getElementById('orderQty' + (index + 1)).focus();
        break;
      default:
        break;
    }
  }
  async checkOrderSuitability(order: BulkOrderEntryModel) {
    try {
      order.commission.amount = '100';
      order.commission.percentage = '5';
      order.suitabiltyTable = [];
      const res = await this.equitiesApi.checkSuitability(order);
      console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      order.SuitabilityNMID = res.NMID;
      order.suitabiltyToken = res.SUITABILITY_TOKEN_COUNT;
      res.SUITABILITY_TOKEN_COUNT.split('|').forEach((token) => {
        if (!!token) {
          order.suitabiltyTable.push(token.split(':')[3]);
        }
      });
      console.log(order.suitabiltyTable);
      // if (!order.isSuitabilityValid && order.suitabiltyTable.length > 0) {
      if (order.suitabiltyTable.length > 0) {
        order.isLoading = false;
        order.message = 'Suitability Check Failed';
        order.isValid = true;
        order.isError = true;
        order.isSuitabilityValid = false;
        return true;
      }
      return true;
    } catch (error) {}
  }
  acknowlegde(order: BulkOrderEntryModel) {
    order.isLoading = true;
    order.message = '';
    order.isError = false;
    order.isSuitabilityValid = true;
    this.placeOrder(order);
  }
  // Added by Rohit T. | 03-Feb-2021
  openSuitablityPopup(order: BulkOrderEntryModel) {
    this.SuitabilityNMID = order.SuitabilityNMID;
    if (this.SuitabilityNMID !== '')
      this.showSuitabilityPopup = !this.showSuitabilityPopup;
  }
  closeSuitablityPopup() {
    this.SuitabilityNMID = '';
    this.showSuitabilityPopup = !this.showSuitabilityPopup;
  }
}
