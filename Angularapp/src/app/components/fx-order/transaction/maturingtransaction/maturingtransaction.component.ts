import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { ApifunctionService } from '../../apifunction.service';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { CommonfunctionService } from '../../commonfunction.service';
import * as jspdf from 'jspdf';

import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-maturingtransaction',
  templateUrl: './maturingtransaction.component.html',
  styleUrls: ['./maturingtransaction.component.css'],
})
export class MaturingtransactionComponent implements OnInit, OnDestroy {
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
  // workflowRecords = [{
  //   "TranDateandTime": "01/02/2019",
  //   "OrderID": "45846864564",
  //   "CurrencyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTC",
  //   "CreditCurrency": "USD",
  //   "BillingCurrency": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Pending",
  //   "Cancel_order": ""
  // },
  // {
  //   "TranDateandTime": "01/01/2020",
  //   "OrderID": "45846864564",
  //   "CurrencyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTT",
  //   "CreditCurrency": "USD",
  //   "BillingCurrency": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Executed",
  //   "Cancel_order": ""
  // },
  // {
  //   "TranDateandTime": "01/03/2020",
  //   "OrderID": "45846864564",
  //   "CurrencyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTC",
  //   "CreditCurrency": "USD",
  //   "BillingCurrency": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Cancelled",
  //   "Cancel_order": ""
  // }];
  filteredWorflowRecords = [];
  workflowRecords = [];
  assetURL: string;
  validationMsg = '';
  apifunction: ApifunctionService;
  blotterSubscription: Subscription;
  ccySubscription: Subscription;
  commonfunction: CommonfunctionService;
  TradeDate: string;
  fromDate = '';
  toDate = '';
  ccy = 'all';
  loading: boolean;
  ccyList: any;
  nextDate: string;
  filterLen = 0;
  workflowLen = 0;
  constructor(
    afs: ApifunctionService,
    cfs: CommonfunctionService,
    private datepipe: DatePipe
  ) {
    this.apifunction = afs;
    this.commonfunction = cfs;
  }
  ngOnDestroy() {
    this.blotterSubscription.unsubscribe();
    this.ccySubscription.unsubscribe();
  }
  ngOnInit() {
    this.assetURL = environment.assetURL;
    this.filteredWorflowRecords = this.workflowRecords;
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    const nextDay = new Date(this.TradeDate);

    nextDay.setDate(nextDay.getDate() + 1);
    // console.log(nextDay);
    this.nextDate = formatDate(nextDay, 'dd-MMM-yyyy', 'en-US', '+0530');
    // console.log(this.nextDate);
    this.apifunction.getCurrencyPairs();
    this.toDate = this.fromDate = this.nextDate;
    this.apifunction.getSandFBlotterDetails(this.fromDate, this.toDate, 'v');
    this.loading = true;
    this.blotterSubscription =
      this.apifunction.GetSandFBlotterDataObserver_value.subscribe(
        (res: any) => {
          // console.log(res);
          // res.map(d => {
          //   d['TranDateandTime'] = formatDate(d['TranDateandTime'], 'dd-MMM-yyyy HH:mm:ss a', 'en-US', '+0530');
          // });
          if (res.length !== 0) {
            this.workflowRecords = res.body;
            if (
              this.workflowRecords === [] ||
              this.workflowRecords === undefined
            ) {
              if (this.workflowRecords === undefined) {
                this.filteredWorflowRecords = this.workflowRecords = [];
                this.ChangeLen();
                this.validationMsg = 'No data found.';
                this.loading = false;
              }
              this.filteredWorflowRecords = this.workflowRecords = [];
              this.ChangeLen();
            } else {
              // this.workflowRecords.map(d => {
              //   d.TranDateandTime = formatDate(d.TranDateandTime, 'dd-MMM-yyyy HH:mm:ss a', 'en-US', '+0530');
              // });
              this.workflowRecords.map((d) => {
                // let dt = d['Value_Date'].split('/');
                // d['Value_Date'] = (dt[0].length === 1 ? '0' + dt[0] : dt[0]) + '/' + (dt[1].length === 1 ? '0' + dt[1] : dt[1]) + '/' + dt[2];
                // d['Value_Date'] = d['Value_Date'].split(' ')[0];
                try {
                  d.Value_Date = formatDate(
                    d.Value_Date,
                    'dd-MMM-yyyy',
                    'en-US',
                    '+0530'
                  );
                  // d.TranDateandTime = formatDate(d.TranDateandTime, 'dd-MMM-yyyy HH:mm:ss a', 'en-US', 'z');
                  d.TranDateandTime = this.setfiniqdateformat(
                    d.TranDateandTime
                  );
                } catch (ex) {
                  // console.log(ex);
                }
                // let dt1 = d['TranDateandTime'].split('/');
                // let dt3 = dt1[2].split(' ');
                // let dt2 = dt3[1].split(':');
                // d['TranDateandTime'] = (dt1[0].length === 1 ? '0' + dt1[0] : dt1[0]) + '/' + (dt1[1].length === 1 ? '0' + dt1[1] : dt1[1]) + '/' + dt3[0] + ' ' + (dt2[0].length === 1 ? '0' + dt2[0] : dt2[0]) + ':' + dt2[1] + ':' + dt2[2];
              });
              this.filteredWorflowRecords = this.workflowRecords;
              this.filterdata();
              this.ChangeLen();
              this.loading = false;
            }
          }
        }
      );
    this.ccySubscription = this.apifunction.GetCurrencyPairObserver.subscribe(
      (res) => {
        // console.log(res);
        if (res.length) {
          // this.ccyList = res;
          // console.log(this.ccyList);
          this.ccyList = res.filter((d) => {
            return d.GoodOrder === 'Y';
          });
        }
      }
    );
  }
  formDate(valuedate) {
    try {
      const FromArr = valuedate.split('-');
      const month = this.months.findIndex((x) => x === FromArr[1]) + 1;
      const fromD =
        FromArr[2] +
        '-' +
        ((month + '').length === 1 ? '0' + month : month) +
        '-' +
        FromArr[0];
      // console.log(fromD);

      return fromD;
    } catch (ex) {
      // console.log(ex);
    }
  }
  exportexcel() {
    try {
      if (this.filteredWorflowRecords.length === 0) {
        this.validationMsg = 'No data for export';
      } else {
        /* table id is passed over here */
        const element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'MaturingTransaction' + this.TradeDate + '.xlsx');
        this.validationMsg = '';
      }
    } catch (ex) {
      // console.log(ex);
    }
  }
  getDate(event: MatDatepickerInputEvent<Date>, fromToFlag) {
    // this.events.push(`${type}: ${event.value}`);

    const selecteddate = event.value;
    this.validationMsg = '';
    const date =
      selecteddate.getDate() +
      '-' +
      this.months[selecteddate.getMonth()] +
      '-' +
      selecteddate.getFullYear();
    // console.log(date);

    if (fromToFlag === 'From') {
      this.fromDate = date;
    } else {
      this.toDate = date;
    }
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.validationMsg = 'From date should be earlier than to date.';
      this.workflowRecords = this.filteredWorflowRecords = [];
      this.ChangeLen();
    } else {
      const fdate = this.formDate(this.fromDate);
      const tDate = this.formDate(this.toDate);
      this.workflowRecords = this.filteredWorflowRecords = [];
      this.ChangeLen();
      this.apifunction.getSandFBlotterDetails(fdate, tDate, 'v');
      this.loading = true;
    }

    // console.log(this.toDate);
    // this.apifunction.getWorkflowBlotterData('Trade', 2067, this.fromDate, this.toDate);
    // this.apifunction.getSandFBlotterDetails();
  }
  filterdata() {
    try {
      this.filteredWorflowRecords = this.workflowRecords.filter((element) => {
        if (this.ccy === 'all') {
          return element.CurrencyPair;
        } else if (this.ccy !== 'all') {
          return element.CurrencyPair === this.ccy;
        }
      });
      this.ChangeLen();
    } catch (ex) {
      // console.log(ex);
    }
  }
  callWorkflow() {
    this.ccy = 'all';
    this.workflowRecords = this.filteredWorflowRecords = [];
    this.ChangeLen();
    this.apifunction.getSandFBlotterDetails(this.fromDate, this.toDate, 'v');
    this.loading = true;
  }
  public captureScreen() {
    let data = document.getElementById('contentToConvert');
    html2canvas(data)
      .then((canvas) => {
        // Few necessary setting options
        let imgWidth = 208;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('MaturingTransaction.pdf'); // Generated PDF
      })
      .catch((err) => console.log(err));
  }
  ChangeLen() {
    this.filterLen = this.filteredWorflowRecords.length;
    this.workflowLen = this.workflowRecords.length;
  }
  setfiniqdateformat(strdate: string) {
    try {
      let finiqformatdate: string;
      const datearr = strdate.split('/');

      finiqformatdate =
        (datearr[1].length > 1 ? datearr[1] : '0' + datearr[1]) +
        '-' +
        this.months[Number(datearr[0]) - 1] +
        '-' +
        datearr[2];

      return finiqformatdate;
    } catch (ex) {
      // console.log(ex);
    }
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
}
