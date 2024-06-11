import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { ApifunctionService } from '../../../apifunction.service';
import { CommonfunctionService } from '../../../commonfunction.service';

@Component({
  selector: 'app-single-row',
  templateUrl: './single-row.component.html',
  styleUrls: ['./single-row.component.css']
})
export class SingleRowComponent implements OnInit {

  @Input() record: any;
  @Input() Index: any;
  @Input() precision: number;
  @Input() Asset1Decimal: number;
  @Input() Asset2Decimal: number;
  orderid: string;
  extraData: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  componentId = (Math.floor(Math.random() * 100000));

  constructor(private afs: ApifunctionService, public commonfunction:CommonfunctionService) { }

  ngOnInit() {
    this.orderid = this.record.Ref_x0020_No;
    this.afs.getLimitOrderBlotterExtraData(this.orderid, this.Index, this.componentId);
    const that = this;
    this.afs.GetBlotterExtraDataObserver.subscribe((res: any) => {
      if (res) {
        if (res.index === that.Index && res.CallId === this.componentId) {
          that.extraData = res.response;
          // console.log(that.extraData, res.index);
          this.afs.getCurrencyPairs();
        }
      }
    });
    this.afs.GetCurrencyPairObserver.subscribe(
      res => {
        // console.log(this.extraData);
        if (res.length) {
          const ccyData = res.filter(c => c.PairCode === this.record.Ccy_Pair)[0];
          // console.log(ccyData);
          this.precision = ccyData.DecimalRate;
         
          this.Asset1Decimal = ccyData.AmountDecimal;
          this.Asset2Decimal = ccyData.SecondAmountDecimal;
          // console.log(this.precision, this.Asset1Decimal, this.Asset2Decimal);
        }
      }
    );
  }

  formatDateTime(dateTime: string) {
    // console.log(dateTime);
    return dateTime ? formatDate(dateTime.split('T')[0], 'dd-MMM-yyyy', 'en-US', '+0800') + ' ' + dateTime.split('T')[1].split('+')[0] : '';
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
    value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return value;
  }
  formatNumber(value, amt) {
    // console.log(control);
    if (isNaN(parseFloat(value))) {
      // return '';
      value = '';
      // this.billingAmt = value;
    } else {
      value = this.formatKLMB(value, amt);
      // console.log(value);
      // this.billingAmt = value;
      // this.billingAmt = parseFloat(value).toLocaleString('es-ES');
    }
    return value;
  }
  formatDate(value: string) {
    return value ? formatDate(value.split('T')[0], 'dd-MMM-yyyy', 'en-US', '+0800') : '';
  }

}
