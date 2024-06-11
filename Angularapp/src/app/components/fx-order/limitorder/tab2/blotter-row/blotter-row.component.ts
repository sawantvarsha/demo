import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ApifunctionService } from '../../../apifunction.service';
import { formatDate, formatCurrency } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';


@Component({
  selector: 'app-blotter-row',
  templateUrl: './blotter-row.component.html',
  styleUrls: ['./blotter-row.component.css']
})
export class BlotterRowComponent implements OnInit, OnDestroy {

  @Input() blotterData: any;
  @Input() Index: any;
  @Output() deleteOrder = new EventEmitter();
  @Input() precision: number;
  @Input() Asset1Decimal: number;
  @Input() Asset2Decimal: number;
  @Output() setOrderIdCancelAction = new EventEmitter();
  @Output() removeOrderIdCancelAction = new EventEmitter();

  @Input() ChangingCancelOrderCheckBox: Subject<boolean>;
  @Output() cancelPopup = new EventEmitter();
  @Input() CancelResObserver: Subject<number>;

  extraData: any;
  orderid: string;
  cancelReason: string;
  confirmCancelOrder: boolean;
  cancelled: boolean;
  orderStatus: string;
  orderactions: string;
  expireOrderButton: boolean;
  amendOrderButton: boolean;
  cancelOrderButton: boolean;
  noActions: boolean;
  ExpiryDateIST: string;

  expired: boolean;
  Amended: boolean;

  ToggleCancelCheckBox: boolean;
  IsValidToDelete: boolean;
  LoadingDots: boolean;
  assetURL: string;
  TransDate: string;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  componentId = (Math.floor(Math.random() * 100000));
  ssiDetails: any;
  billingAcc: any;
  creditAcc: any;

  accountSubscription: Subscription;
  ccySubscription: Subscription;
  blotterDataSubscription: Subscription;
  cancelOrderSubscription: Subscription;
  expireSubscription: Subscription;
  cancelRedSubscription: Subscription;
  checkboxSubscription: Subscription;
  constructor(private afs: ApifunctionService, private router: Router) {
    this.assetURL = environment.assetURL;
  }
  ngOnDestroy() {
    this.afs.CancelLimitOrderBookedOrder.next([]);
    if (this.accountSubscription !== undefined) {
      this.accountSubscription.unsubscribe();
    }
    if (this.ccySubscription !== undefined) {
      this.ccySubscription.unsubscribe();
    }
    if (this.blotterDataSubscription !== undefined) {
      this.blotterDataSubscription.unsubscribe();
    }
    if (this.cancelOrderSubscription !== undefined) {
      this.cancelOrderSubscription.unsubscribe();
    }
    if (this.expireSubscription !== undefined) {
      this.expireSubscription.unsubscribe();
    }
    if (this.cancelRedSubscription !== undefined) {
      this.cancelRedSubscription.unsubscribe();
    }
    if (this.checkboxSubscription !== undefined) {
      this.checkboxSubscription.unsubscribe();
    }

  }
  ngOnInit() {
    this.DefaultValues(); // Set Default values
    const that = this;
    //console.log(this.blotterData);

    // this.ExpiryDateIST = this.blotterData.

    this.accountSubscription = this.afs.GetAccountDetailsObserver.subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.ssiDetails = res;
        // console.log(this.ssiDetails);
        this.billingAcc = res[0].AccountNo;
        this.creditAcc = res[3].AccountNo;
      }

    });

    this.afs.getAccountDetails('32107', this.blotterData.Ccy_Pair.split('-')[0].trim(), this.blotterData.Ccy_Pair.split('-')[1].trim(), 'FXC');

    this.orderid = this.blotterData.Ref_x0020_No;
    if (this.blotterData.QM_Queue_Status === 'Terminal Queue') { // Check queue status
      this.IsValidToDelete = true; // disabled the check box
    }

    this.afs.getLimitOrderBlotterExtraData(this.orderid, this.Index, this.componentId); // Get Individual order details Service

    this.ccySubscription = this.afs.GetCurrencyPairObserver.subscribe(
      res => {
        // console.log(this.extraData);
        if (res.length) {
          const ccyData = res.filter(c => c.PairCode === this.blotterData.Ccy_Pair)[0];
          // console.log(ccyData);
          this.precision = ccyData.DecimalRate;
          this.Asset1Decimal = ccyData.AmountDecimal;
          this.Asset2Decimal = ccyData.SecondAmountDecimal;
          // console.log(this.precision, this.Asset1Decimal, this.Asset2Decimal);
        }
      }
    );

    this.blotterDataSubscription = this.afs.GetBlotterExtraDataObserver.subscribe((res: any) => {
      if (res) {
        if (res.index === this.Index && res.CallId === this.componentId) {
          this.extraData = res.response;
          // this.extraData.map(d => {
          // this.extraData.Amount2 = this.formatNumber(this.extraData.Amount2, this.Asset2Decimal);
          // this.extraData.Amount1 = this.formatNumber(this.extraData.Amount1, this.Asset1Decimal);
          // });
          this.afs.getCurrencyPairs();
        }
      }
    });

    this.cancelOrderSubscription = this.afs.CancelLimitOrderBookedOrderObserver.subscribe((res: any) => {
      if (res) {
        if (res.index === this.Index) {
          if (res.result === true) {
            that.cancelled = true;
            that.ToggleCancelCheckBox = false;
            that.IsValidToDelete = true;

          } else {
            that.cancelled = false;
          }
        }
        this.LoadingDots = false;
      }
    });

    this.expireSubscription = this.afs.ExpireLimitOrderSubjectObserver.subscribe((res: any) => {
      if (res) {
        if (res.index === this.Index) {
          if (res.result === true) {
            that.expired = true;
            that.IsValidToDelete = true;
          } else {
            this.LoadingDots = false;
            console.log('Expire limit order operation failed.');
          }
        }
        this.LoadingDots = false;
      }
    });

    this.ResetAllActions();
    this.orderid = this.blotterData.Ref_x0020_No;
    this.afs.getLimitOrderBlotterExtraData(this.orderid, this.Index, this.componentId);

    this.checkboxSubscription = this.ChangingCancelOrderCheckBox.subscribe(v => {
      if (v) {
        if (this.blotterData.QM_Queue_Status === 'Terminal Queue') {
          this.IsValidToDelete = true;
        } else {
          if (this.cancelled || this.expired) {
            this.ToggleCancelCheckBox = false;
          } else {
            this.ToggleCancelCheckBox = v;
          }
        }
      } else {
        this.ToggleCancelCheckBox = v;
      }
    });
    this.cancelRedSubscription = this.CancelResObserver.subscribe(_res => {
      this.cancelOrderButton = false;
    });
  }

  DefaultValues() {
    // console.log(this.precision, this.Asset1Decimal, this.Asset2Decimal);
    this.cancelReason = 'via api';
    this.confirmCancelOrder = false;
    this.cancelled = false;
    this.expireOrderButton = false;
    this.amendOrderButton = false;
    this.cancelOrderButton = false;
    this.noActions = false;
    this.expired = false;
    this.Amended = false;
    this.IsValidToDelete = false;
    this.ToggleCancelCheckBox = false;
    this.LoadingDots = false;
    this.TransDate = this.blotterData.Order_Date.split('T')[0];
    if ((this.blotterData.QM_Queue_Status === 'Initial Queue') && this.blotterData.Actions) {
      this.orderactions = this.blotterData.Actions;
      this.orderactions.includes('Amend') ? this.amendOrderButton = true : this.amendOrderButton = false;
      this.orderactions.includes('Cancel') ? this.cancelOrderButton = true : this.cancelOrderButton = false;
      this.orderactions.includes('Expire') ? this.expireOrderButton = true : this.expireOrderButton = false;
    } else {
      this.noActions = true;
      if (this.blotterData.OM_Status === 'CANCEL') {
        this.orderStatus = 'Cancelled';
      } else if (this.blotterData.OM_Status === 'Expired') {
        this.orderStatus = 'Expired';
      } else if (this.blotterData.OM_Status === 'CANCEL') {
        this.orderStatus = 'Cancelled';
      } else if (!this.expired && !this.cancelled) {
        this.orderStatus = this.blotterData.OM_Status;
      }
    }
  }

  ResetAllActions() {
    this.cancelled = false;
    this.expired = false;
    this.Amended = false;
  }

  formatDateTime(dateTime: string) {
    return dateTime ? formatDate(dateTime.split(' ')[0], 'dd-MMM-yyyy', 'en-US', '+0800') + ' ' + dateTime.split(' ')[1] + ' ' + dateTime.split(' ')[2] : '';
  }

  formatAmount(amount, Currrency) {
    const formattedAmount = formatCurrency(amount, 'en-US', Currrency);
    return formattedAmount.slice(3, formattedAmount.length);
  }

  formatDateTimeHours(value: string) {
    const datetime = value.split('T');
    const date = datetime[0];
    const time = datetime[1].split('+')[0];
    const Hours = parseInt(time.split(':')[0], 10);
    // console.log(datetime, date, time);
    // return date.split('-')[2] + '-' + this.months[parseInt(date.split('-')[1], 10) - 1] + '-' + date.split('-')[0] + ' ' + (Hours > 12 ? Hours - 12 : Hours) + ':' + time.split(':')[1] + ':' + time.split(':')[2] + ' ' + (Hours > 12 ? 'PM' : 'AM');
    return date.split('-')[2] + '-' + this.months[parseInt(date.split('-')[1], 10) - 1] + '-' + date.split('-')[0] + ' ' + (Hours > 12 ? Hours - 12 : Hours) + ':' + time.split(':')[1] + ' ' + (Hours > 12 ? 'PM' : 'AM');
    // return Time.split(' ')[0];
  }

  formatDate(value: string) {
    const date = value.split('-');
    return date[2] + '-' + this.months[(Number(date[1]) - 1)] + '-' + date[0];
  }

  CancelOrder() {
    // this.LoadingDots = true;
    this.cancelPopup.emit({ orderid: this.orderid, cancelReason: this.cancelReason, Index: this.Index });
    // this.afs.cancelLimitOrderBookedOrder(this.orderid, this.cancelReason, this.Index);
    // this.deleteO rder.emit(this.Index);

  }


  formatKLMB_ES(value: string, precision = 2) {
    // value = value.replace(/\./g, '');
    if ((value.match(/([kK]{1})/g)) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(precision);
    } else if ((value.match(/([lL]{1})/g)) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(precision);
    } else if ((value.match(/([mM]{1})/g)) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(precision);
    } else if ((value.match(/([bB]{1})/g)) != null) {
      value = value.replace(/\./g, '');
      value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(precision);
    }
    value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    const parts = value.split('.');
    value = parts[0].replace(/,/g, '\.') + ',' + parts[1];
    return value;
  }

  unformatToStandard(value) {
    if (value) {
      const parts = value.split(',');
      value = parts[0].replace(/\./g, '') + '.' + parts[1];
      // value.replace(/\.,/g, '');
      return parseFloat(value);
    }
  }

  IsValidNumber(val: any): boolean {
    return /^\d+(.\d*?)?$/.test(val);
  }

  unformatNumber_ES(value) {
    if (value) {
      const parts = value.split(',');
      value = parts[0].replace(/\./g, '') + ',' + (parts[1] || '00');
      // value.replace(/\.,/g, '');
      // console.log(value);
      return value;
    }
  }

  toggleEditable(event) {
    if (event.target.checked) {
      this.setOrderIdCancelAction.emit({ orderId: this.orderid, index: this.Index });
    } else {
      this.removeOrderIdCancelAction.emit({ orderId: this.orderid, index: this.Index });
    }
  }

  ExpireOrder() {
    this.LoadingDots = true;
    this.afs.expireLimitOrder(this.orderid, this.Index);
  }

  AmendOrder() {
    // this.gotoLimitOrderDealEntryPage();
    const amendOrderData = {
      AmendFlag: true,
      BillingAmt: this.blotterData.OrderAmount,
      CreditAmt: this.extraData.Amount2,
      Order_Rate: this.blotterData.Order_Rate,
      Direction: this.blotterData.Direction,
      OrderExpiryDate: this.blotterData.ExpiryAt,
      OrderExpiryType: this.extraData.ordervalidity_type,
      Orderid: this.blotterData.TI_DealNo,
      Ccy_Pair: this.blotterData.Ccy_Pair,
      ReferenceID: this.blotterData.Ref_x0020_No,
      TokenIDz: this.blotterData.Token_x0020_Id,
      Status: this.blotterData.Status
    };
    this.afs.AmendOrderQueue(amendOrderData);
  }

  public gotoLimitOrderDealEntryPage(url) {
    const myurl = `/${url}`;
    this.router.navigate([myurl, {}]);
    this.afs.ShowTabInLimitOrder('dealentry');
  }

  ReceivedCancelOrderFlag(_res) {
    // console.log(res);
  }

  // Normal Notional Validation
  formatKLMB(value: string, precision) {
    value = value.replace(/,/g, '');
    if ((value.match(/([kK]{1})/g)) != null) {
      value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(precision);
    } else if ((value.match(/([lL]{1})/g)) != null) {
      value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(precision);
    } else if ((value.match(/([mM]{1})/g)) != null) {
      value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(precision);
    } else if ((value.match(/([bB]{1})/g)) != null) {
      value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(precision);
    }
    if (precision > 0) {
      value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return value;
  }
  formatNumber(value, amt) {
    // console.log(control);
    if (isNaN(parseFloat(value))) {
      // return '';
      value = '';
      // this.billingAmt = value;
    } else {
      value = this.formatKLMB(value + '', amt);
      // console.log(value);
      // this.billingAmt = value;
      // this.billingAmt = parseFloat(value).toLocaleString('es-ES');
    }
    return value;
  }
  unformatNumber_EN(control: { value: string; }) {
    // console.log(control);
    if (control.value) {
      control.value.replace(/,/g, '');
    }
    // control.currentValue.replace(/,/g, '');
  }

}
