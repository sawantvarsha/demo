import { Component, OnInit } from '@angular/core';
import { ApifunctionService } from '../../apifunction.service';
import { environment } from 'src/environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
// import * as pdfMake from 'pdfmake';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css'],
})
export class OrderhistoryComponent implements OnInit {
  workflowRecords = [];
  orderType = 'Limit';
  status = '';
  fromDate = '';
  toDate = '';
  TradeDate: string;
  validationMsg: string;
  assetURL: string;
  loading: boolean;
  OrdersCatalog = [];
  SortedOrders = [];
  Appearance: string;

  initialLoadDone = false;

  valuedateday: string;
  valuedatemonth: string;
  valuedateyear: string;

  TransFromDate: string;
  TransToDate: string;
  ExpiryFromDate: string;
  ExpiryToDate: string;
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

  componentId = Math.floor(Math.random() * 100000);
  errorMsg: string;
  customFilter: string;
  validaionmsg = '';
  constructor(private afs: ApifunctionService) {
    this.TradeDate = '';
    this.validationMsg = '';
    this.assetURL = '';
    this.loading = false;
  }

  ngOnInit() {
    this.assetURL = environment.assetURL;
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    this.toDate = this.fromDate = this.TradeDate;
    this.fromDate = '01-Jun-2019';
    this.loading = true;
    this.afs.AmendLimitOrder.next({});

    this.Appearance = '100';

    this.DefaultValues();
    this.afs.getLimitOrderWorkflowBlotterData(
      'FX Cash Order Workflow',
      2082,
      'TRADE',
      '1',
      this.TransFromDate,
      this.TransToDate,
      this.componentId,
      "[OM_Status] LIKE '%OPEN%' or [OM_Status] LIKE '%AMEND%'",
      this.Appearance,
      1
    );
    this.afs.GetLimitOrderBlotterDataObserver.subscribe((res: any) => {
      if (res) {
        if (res.CallId === this.componentId) {
          this.initialLoadDone = true;
          console.log(res);
          if (res.response !== undefined) {
            if (res.response.length === undefined) {
              this.workflowRecords[0] = res.response;
            } else {
              this.workflowRecords = res.response;
            }
            this.validaionmsg = '';
          } else {
            this.validaionmsg = 'No data found.';
            this.workflowRecords = [];
          }
          // res.filter(r => ['OPEN', 'AMENDED'].includes((r.OM_Status + '').toUpperCase()));
          //console.log(this.workflowRecords);
          this.afs.getCurrencyPairs();
          this.loading = false;
        }
      } else {
        this.workflowRecords = [];
      }
    });

    this.afs.GetCurrencyPairObserver.subscribe((res) => {
      //console.log(res);
      if (res.length) {
        this.workflowRecords.forEach((d) => {
          const ccyData = res.filter((c) => c.PairCode === d.Ccy_Pair)[0];
          d.Precision = ccyData.DecimalRate;
          d.Asset1Decimal = ccyData.Asset1_DecimalAmount;
          d.Asset2Decimal = ccyData.Asset2_DecimalAmount;
        });
      }
    });
  }

  filterdata(control) {
    try {
      let filter = "[OM_Status] LIKE '%OPEN%'";
      // console.log(control);
      switch (control) {
        case 'OrderType':
          filter += " AND [Order_Type] LIKE '%" + this.orderType + "%'";
          break;
        case 'Status':
          filter += " AND [Status] LIKE '%" + this.status + "%'";
          break;
        default:
          break;
      }
      // console.log(filter);
      this.customFilter = filter;
      this.afs.getLimitOrderWorkflowBlotterData(
        'FX Cash Order Workflow',
        2082,
        'TRADE',
        '1',
        this.TransFromDate,
        this.TransToDate,
        this.componentId,
        filter,
        this.Appearance,
        1
      );
      this.loading = true;
      this.workflowRecords = [];
      this.validaionmsg = '';
    } catch (ex) {
      console.log(ex);
    }
  }

  changeDate(control: string, value: string) {
    switch (control) {
      case 'from':
        this.TransFromDate = value;
        this.ValidateFilterRequest();
        break;
      case 'to':
        this.TransToDate = value;
        this.ValidateFilterRequest();
        break;
    }
    this.filterdata('From');
  }

  getDate(event: MatDatepickerInputEvent<Date>, fromToFlag) {
    // this.events.push(`${type}: ${event.value}`);
    const selecteddate = event.value;

    const date =
      selecteddate.getMonth() +
      1 +
      '-' +
      selecteddate.getDate() +
      '-' +
      selecteddate.getFullYear();
    // console.log(date);

    if (fromToFlag === 'From') {
      this.fromDate = date;
    } else {
      this.toDate = date;
    }
    // console.log(this.toDate);
    // this.afs.getWorkflowBlotterData('Trade', 2067, this.fromDate, this.toDate);
  }
  exportexcel() {
    try {
      if (this.workflowRecords.length === 0) {
        this.validationMsg = 'No data for export';
      } else {
        /* table id is passed over here */
        let element = document.getElementById('excel-table');
        const table = element?.innerHTML.replace(/app-single-row/gi, 'tr');
        element.innerHTML = table;

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'LimitOrderActiveOrders' + this.TradeDate + '.xlsx');
        this.validationMsg = '';
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  DefaultValues() {
    this.OrdersCatalog = null;
    this.SortedOrders = null;
    this.TransFromDate = this.getFormattedDate(0, 0);
    this.TransToDate = this.getFormattedDate();
    this.ExpiryFromDate = this.getFormattedDate(0, 0);
    this.ExpiryToDate = this.getFormattedDate();
  }

  getFormattedDate(
    daysChange: number = 0,
    monthChange: number = 0,
    yearChange: number = 0
  ) {
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
    this.afs.getLimitOrderWorkflowBlotterData(
      'FX Cash Order Workflow',
      2082,
      'TRADE',
      '1',
      this.TransFromDate,
      this.TransToDate,
      this.componentId,
      this.customFilter,
      this.Appearance,
      1
    );
  }
  public captureScreen() {
    const data = document.getElementById('excel-table');
    html2canvas(data)
      .then((canvas) => {
        // Few necessary setting options
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('ActiveOrders.pdf'); // Generated PDF
      })
      .catch((err) => console.log(err));

    // const d = document.getElementById('excel-table');
    // html2canvas(d).then(canvas => {

    //   const data = canvas.toDataURL();
    //   const docDefinition = {
    //     content: [{
    //       image: data,
    //       width: 500
    //     }]
    //   };
    //   pdfMake.createPdf(docDefinition).download('ActiveOrders.pdf');
    // }).catch(err => console.log(err));
  }
  // Compare Dates
  CompareDates(firstDate, secondDate) {
    return new Date(firstDate) >= new Date(secondDate);
  }

  ValidateFilterRequest() {
    // if (this.CompareDates(this.ExpiryToDate, this.ExpiryFromDate)) {
    if (this.CompareDates(this.TransToDate, this.TransFromDate)) {
      this.errorMsg = '';
    } else {
      this.errorMsg = 'Transaction From date cannot be greater than To date.';
      console.log(this.errorMsg);
    }
    // } else {
    //   this.errorMsg = 'Expiry From date cannot be greater than To date.';
    //   console.log(this.errorMsg);
    // }
  }
}
