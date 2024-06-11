import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApifunctionService } from '../../apifunction.service';
import { environment } from '../../../../../environments/environment';
import { formatDate } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component implements OnInit, OnDestroy {

  SelectCheckBox: Subject<boolean> = new Subject();
  OrdersCatalog = [];
  SortedOrders = [];

  workflowRecords: any[] = [];
  allWorkflowRecords = [];
  initialLoadDone = false;

  valuedateday: string;
  valuedatemonth: string;
  valuedateyear: string;

  TransFromDate: string;
  TransToDate: string;
  ExpiryFromDate: string;
  ExpiryToDate: string;
  CustomFilter: string;
  Appearance: string;
  errorMsg: string;

  // Selected Orders for cancel action
  // checkedCancelOrders = new Set([]);
  checkedCancelOrders = [];
  ToggleCancelCheckBoxSelectAll: boolean;
  CancelOrderData = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  assetURL: string;


  orderStatuslist = ['All', 'Order placed',
    // 'Amended',
    'Cancelled', 'Expired'];
  orderStatus: string;

  orderTypelist = [
    // 'All',
    'Limit',
    //  'Stop-Loss', 'OCO', 'If Done', 'If Done-OCO'
  ];
  orderType: string;
  cancelReason: string;
  TransactionShow: boolean;
  LoadingData: boolean;
  componentId = (Math.floor(Math.random() * 100000));
  gotCancelResponse: Subject<[]> = new Subject();
  cancelPopupMsg = '';
  cancelrequestpopup = false;
  selectedOrdersCancelPopup = false;
  ccyList: any;
  ccySubscription: Subscription;
  CcyPair = 'All';
  cancelSubscription: Subscription;
  constructor(private afs: ApifunctionService, public datepipe: DatePipe) {
    this.assetURL = environment.assetURL;

  }
  ngOnDestroy() {
    this.ccySubscription.unsubscribe();
    if (this.cancelSubscription !== undefined) {
      this.cancelSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.DefaultValues();
    this.afs.AmendLimitOrder.next({});
    this.Appearance = '100';
    this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);

    this.afs.GetLimitOrderBlotterDataObserver.subscribe((res: any) => {
      if (res) {
        if (res.CallId === this.componentId) {
          this.initialLoadDone = true;
          if (res.response !== undefined) {
            this.allWorkflowRecords = res.response;
            // this.workflowRecords = res.response;
            // console.log(this.workflowRecords);
            this.afs.getCurrencyPairs();
            this.filterDataForExpiryDate();
          } else {
            this.workflowRecords = [];
          }
        } else {
          this.workflowRecords = [];
        }
      } else {
        this.workflowRecords = [];
      }
      this.LoadingData = false;
    });

    this.afs.GetCurrencyPairObserver.subscribe(
      res => {
        // console.log(res);
        if (res.length) {
          try {
            this.workflowRecords.forEach(d => {
              const ccyData = res.filter(c => c.PairCode === d.Ccy_Pair)[0];
            
              if (ccyData !== undefined) {
                d.Precision = ccyData.DecimalRate;
                d.Asset1Decimal = ccyData.AmountDecimal;
                d.Asset2Decimal = ccyData.SecondAmountDecimal;
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    );
    this.cancelSubscription = this.afs.CancelLimitOrderBookedOrderObserver.subscribe((res: any) => {
      if (res.length > 0) {
        // if (res.index === this.Index) {
        //   if (res.result === true) {
        //     that.cancelled = true;
        //     that.ToggleCancelCheckBox = false;
        //     that.IsValidToDelete = true;
        //   } else {
        //     that.cancelled = false;
        //   }
        // }
        // this.LoadingDots = false;
        try {
          this.cancelPopupMsg = 'The Order is cancelled.'
          // this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);
          // this.filterDataForOrderStatus();
          setTimeout(() => {
            this.cancelrequestpopup = false; this.HidePopup();
            this.cancelPopupMsg = '';
          }, 2000);
          if (this.workflowRecords.length > 0) {
            this.workflowRecords[res[0].index].OM_Status = "CANCEL";
            let dealno = this.workflowRecords[res[0].index].TI_DealNo;
            this.allWorkflowRecords.map(d => {
              if (dealno === d['TI_DealNo']) {
                d.OM_Status = "CANCEL";
              }
            });
            //console.log(this.allWorkflowRecords);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    });
    this.ccySubscription = this.afs.GetCurrencyPairObserver.subscribe(res => {
      // console.log(res);
      if (res.length) {
        // this.ccyList = res;
        // console.log(res);
        this.ccyList = res.filter(d => {
          return (d['GoodOrder'] === 'Y');
        });
      }
    });
  }

  DefaultValues() {
    this.OrdersCatalog = null;
    this.SortedOrders = null;
    this.TransFromDate = this.getFormattedDate(0, 0);
    this.TransToDate = this.getFormattedDate();
    this.ExpiryFromDate = this.getFormattedDate(0, 0);
    // this.ExpiryToDate = this.getFormattedDate();
    const ExpTotoday = new Date();
    ExpTotoday.setDate(ExpTotoday.getDate() + 2);
    this.ExpiryToDate = formatDate(ExpTotoday, 'dd-MMM-yyyy', 'en-US', '+0530');;
    this.CustomFilter = '';
    this.orderStatus = 'All';
    this.orderType = 'Limit';
    this.Appearance = '10';
    this.checkedCancelOrders = [];
    this.cancelReason = 'via api';
    this.LoadingData = true;
    this.ToggleCancelCheckBoxSelectAll = false;
    this.errorMsg = '';
    this.SelectCheckBox.next(false);
  }

  getFormattedDate(daysChange: number = 0, monthChange: number = 0, yearChange: number = 0) {
    const today = new Date();
    today.setDate(today.getDate() + daysChange);
    today.setMonth(today.getMonth() + monthChange);
    today.setFullYear(today.getFullYear() + yearChange);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    const month = this.months[today.getMonth()];
    const year = today.getFullYear();
    return day + '-' + month + '-' + year;
  }

  ApplyFilters() {
    this.ValidateFilterRequest();
    if (this.errorMsg === '') {
      this.BuildFilter();
      this.LoadingData = true;
      this.workflowRecords = [];
      this.initialLoadDone = false;
      this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);
    }
  }
  DeleteOrderchild(e) {
    this.workflowRecords.splice(e, 1);
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
    //console.log(parts);
    value = parts[0].replace(/,/g, '\.') + ',' + parts[1];
    return value;
  }

  unformatToStandard(value) {
    if (value) {
      const parts = value.split(',');
      value = parts[0].replace(/\./g, '') + '.' + parts[1];
      // value.replace(/\.,/g, '');
      //console.log(value);
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
      //console.log(value);
      return value;
    }
  }
  BuildFilter() {
    // this.CustomFilter = this.orderStatus !== 'All' ? '[Status] like' + "'" + this.orderStatus + "'" + this.orderType !== 'All' ? 'AND [Order_Type] like' + "'" + this.orderType + "'" : '' : this.orderType !== 'All' ? '[Order_Type] like' + "'" + this.orderType + "'" : '';
    if (this.errorMsg === '') {
      //console.log(this.ExpiryToDate, this.ExpiryFromDate);
      const ExpiryDateF = this.ExpiryFromDate.split('-');
      const ExpiryDateT = this.ExpiryToDate.split('-');
      if (this.orderStatus !== 'All') {
        if (this.orderType !== 'All') {
          this.CustomFilter = '[Status] like ' + '\'%' + this.orderStatus + '%\'' + 'AND [Order_Type] like' + '\'%' + this.orderType + '%\'' + 'AND [OrderExpiryDate] BETWEEN' + '\'' + ExpiryDateF[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateF[0] + 'T00:00:00+05:30' + '\' ' + 'AND' + ' \'' + ExpiryDateT[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateT[0] + 'T00:00:00+05:30' + '\'';
        } else {
          this.CustomFilter = '[Status] like ' + '\'%' + this.orderStatus + '%\'' + 'AND [OrderExpiryDate] BETWEEN ' + '\'' + ExpiryDateF[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateF[0] + 'T00:00:00+05:30' + '\' ' + 'AND' + ' \'' + ExpiryDateT[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateT[0] + 'T00:00:00+05:30' + '\'';
        }
      } else {
        if (this.orderType !== 'All') {
          this.CustomFilter = '[Order_Type] like ' + '\'%' + this.orderType + '%\'' + 'AND [OrderExpiryDate] BETWEEN ' + '\'' + ExpiryDateF[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateF[0] + 'T00:00:00+05:30' + '\' ' + 'AND' + ' \'' + ExpiryDateT[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateT[0] + 'T00:00:00+05:30' + '\'';
        } else {
          this.CustomFilter = '[Order_Type] like ' + '\'%%\'' + 'AND [OrderExpiryDate] BETWEEN ' + '\'' + ExpiryDateF[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateF[0] + 'T00:00:00+05:30' + '\' ' + 'AND' + ' \'' + ExpiryDateT[2] + (this.months.indexOf(ExpiryDateF[1] + 1)) + '-' + ExpiryDateT[0] + 'T00:00:00+05:30' + '\'';
        }
      }
    }
  }

  getCheckedOrderforCancelAction(reqparam) {
    this.checkedCancelOrders.push(reqparam);
  }

  removeCheckedOrderforCancelAction(reqparam) {
    const index = this.checkedCancelOrders.indexOf(reqparam);
    this.checkedCancelOrders.splice(index, 1);
    this.ToggleCancelCheckBoxSelectAll = false;
  }

  DeleteCheckedOrders() {
    this.checkedCancelOrders.forEach(obj => {
      this.afs.cancelLimitOrderBookedOrder(obj.orderId, this.cancelReason, obj.index);
    });
    this.checkedCancelOrders = [];
    this.workflowRecords = [];
    this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);

  }
  showPopupForSelectedCacelOrder() {
    (<HTMLInputElement>document.getElementById('overlay')).style.display = 'block';
    this.selectedOrdersCancelPopup = true;
    this.cancelrequestpopup = true;
    this.cancelPopupMsg = '';
  }

  TellBlotterRowToCheckBox() {
    this.workflowRecords.forEach(obj => {
      const ValidObject = { orderId: obj.Ref_x0020_No, index: this.workflowRecords.indexOf(obj) };
      let flag = false;
      this.checkedCancelOrders.forEach(objcancelorder => {
        try {
          if (objcancelorder.orderId === ValidObject.orderId) { // Check if Order already present is checkedCancelOrders array
            flag = true;
          }
        } catch (e) {
    //console.log(e);
        }
      });
      if (!flag && obj.QM_Queue_Status !== 'Terminal Queue') {
        this.checkedCancelOrders.push(ValidObject); // Check if Order Queue status is not equal to Terminal queue
      }
    });
    this.SelectCheckBox.next(true);
  }
  SelectAllToggled() {
    if (this.ToggleCancelCheckBoxSelectAll) {
      this.SelectCheckBox.next(true);
    } else {
      this.checkedCancelOrders = [];
      this.SelectCheckBox.next(false);
    }
  }
  // Compare Dates
  CompareDates(firstDate, secondDate) {
    return firstDate >= secondDate;
  }

  ValidateFilterRequest() {

    if (this.CompareDates(this.ExpiryToDate, this.ExpiryFromDate)) {
      if (this.CompareDates(this.TransToDate, this.TransFromDate)) {
        this.errorMsg = '';
      } else {
        this.errorMsg = 'Transaction From date cannot be greater than To date.';
      }
    } else {
      this.errorMsg = 'Expiry From date cannot be greater than To date.';
    }
  }
  GetCancelPopupConfirmation(reqparam) {
    try {
      //console.log(reqparam);
      this.CancelOrderData = reqparam;
      this.cancelrequestpopup = true;
      (<HTMLInputElement>document.getElementById('overlay')).style.display = 'block';
      this.cancelPopupMsg = '';
    } catch (ex) {
//console.log(ex);
    }
  }
  HidePopup() {
    this.cancelrequestpopup = false;
    (<HTMLInputElement>document.getElementById('overlay')).style.display = 'none';
  }
  approveCancel() {
    //console.log(this.CancelOrderData);
    if (this.selectedOrdersCancelPopup) {
      this.DeleteCheckedOrders();
      this.selectedOrdersCancelPopup = false;
      this.cancelPopupMsg = 'Cancelling the Trade';
    } else {
      this.afs.cancelLimitOrderBookedOrder(this.CancelOrderData['orderid'], this.CancelOrderData['cancelReason'], this.CancelOrderData['Index']);
      this.cancelPopupMsg = 'Cancelling the Trade';
    }
  }
  callLimitBlotter_TFD(dates) {
    try {
      this.TransFromDate = dates;
      this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);

    } catch (ex) {
      console.log(ex);
    }
  }
  callLimitBlotter_TTD(dates) {
    try {
      this.TransToDate = dates;
      this.afs.getLimitOrderWorkflowBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.TransFromDate, this.TransToDate, this.componentId, this.CustomFilter, this.Appearance);
    } catch (ex) {
      console.log(ex);
    }
  }
  callLimitBlotter_EFD(dates) {
    this.ExpiryFromDate = dates;
    let expFromDate;
    expFromDate = new Date(this.ExpiryFromDate);
    expFromDate.setDate(expFromDate.getDate() - 1);
    let expToDate;
    expToDate = new Date(this.ExpiryToDate);
    expToDate.setDate(expToDate.getDate() + 1);
    let exp;
    this.workflowRecords = this.allWorkflowRecords.filter(element => {
      exp = new Date(element['ExpiryAt']);
      return ((exp >= expFromDate && exp <= expToDate) || ((exp === expFromDate) || (exp === expToDate)))
    });
  }
  callLimitBlotter_ETD(dates) {
    this.ExpiryToDate = dates;
    let expFromDate;
    expFromDate = new Date(this.ExpiryFromDate);
    expFromDate.setDate(expFromDate.getDate() - 1);
    let expToDate;
    expToDate = new Date(this.ExpiryToDate);
    expToDate.setDate(expToDate.getDate() + 1);
    let exp;
    this.workflowRecords = this.allWorkflowRecords.filter(element => {
      exp = new Date(element['ExpiryAt']);
      return ((exp >= expFromDate && exp <= expToDate) || ((exp === expFromDate) || (exp === expToDate)))
    });
  }
  filterDataForOrderStatus() {
    try {
      let status = '';
      if (this.orderStatus === 'Cancelled') {
        status = 'CANCEL';
      } else {
        status = this.orderStatus;
      }
      this.workflowRecords = this.allWorkflowRecords.filter(element => {
        if (this.orderStatus === 'All' && this.CcyPair === 'All') {
          return (element.OM_Status);
        } else if (this.orderStatus !== 'All' && this.CcyPair === 'All') {
          if (this.orderStatus === 'Order placed') {
            return (element.OM_Status === 'AMEND' || element.OM_Status === 'OPEN');
          } else {
            return (element.OM_Status === status);
          }
        } else if (this.orderStatus === 'All' && this.CcyPair !== 'All') {
          return (element.Ccy_Pair === this.CcyPair);
        } else if (this.orderStatus !== 'All' && this.CcyPair !== 'All') {
          if (this.orderStatus === 'Order placed') {
            return ((element.OM_Status === 'AMEND' || element.OM_Status === 'OPEN') && element.Ccy_Pair === this.CcyPair);
          } else {
            return (element.OM_Status === status && element.Ccy_Pair === this.CcyPair);
          }
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }
  filterDataForExpiryDate() {
    try {
      let expFromDate;

      expFromDate = new Date(this.ExpiryFromDate.replace(/-/g, ' '));
      expFromDate.setDate(expFromDate.getDate() - 1);
      let expToDate;
      // (this.ExpiryToDate.replace(/-/g, ' '));
      expToDate = new Date(this.ExpiryToDate.replace(/-/g, ' '));
      expToDate.setDate(expToDate.getDate() + 1);
      let exp;
      //console.log(this.allWorkflowRecords.length);
      if (this.allWorkflowRecords.length !== undefined) {
        this.workflowRecords = this.allWorkflowRecords.filter(element => {
          exp = new Date(element['ExpiryAt']);
          return ((exp >= expFromDate && exp <= expToDate) || ((exp === expFromDate) || (exp === expToDate)))
        });
      } else {
        exp = new Date(this.allWorkflowRecords['ExpiryAt']);
        if ((exp >= expFromDate && exp <= expToDate) || ((exp === expFromDate) || (exp === expToDate))) {
          this.workflowRecords.push(this.allWorkflowRecords);
        }
      }
      //console.log(this.workflowRecords);
    } catch (ex) {
      console.log(ex);
    }
  }
  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
}
