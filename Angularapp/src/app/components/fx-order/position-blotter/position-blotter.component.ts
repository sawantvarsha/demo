import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../commonfunction.service';
import { ApifunctionService } from '../apifunction.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-position-blotter',
  templateUrl: './position-blotter.component.html',
  styleUrls: ['./position-blotter.component.css']
})
export class PositionBlotterComponent implements OnInit {

  commonfunction: CommonfunctionService
  apifunction: ApifunctionService;
  ccySubscription: Subscription;
  ccyList: any;
  constructor(cfs: CommonfunctionService, afs: ApifunctionService) {
    this.commonfunction = cfs;
    this.apifunction = afs;
  }
  validationMsg = '';
  workflowRecords = [];
  filteredWorflowRecords = [];
  loading = false;
  assetURL: string;
  ccy = 'all';
  TradeDate: string;
  fromDate: string = '';
  toDate: string = '';
  workflowLen = 0;
  filterLen = 0;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // workflowRecords = [{
  //   "ccyPair": "AUD - USD",
  //   "netPosition": "-5337",
  //   "USDEqv": "-3837.77",
  //   "marketRate": "0.719",
  //   "netBought": "5001856.35",
  //   "wavgBuyRate": "0.68",
  //   "netSold": "5007194",
  //   "wavgSellRate": "0.68",
  //   "buyMTM": "217340.08",
  //   "sellMTM": "-21701085",
  //   "totalPNL": "329.23"
  // },
  // {
  //   "ccyPair": "EUR - USD",
  //   "netPosition": "-2000000",
  //   "USDEqv": "-2278000",
  //   "marketRate": "1.139",
  //   "netBought": "0.00",
  //   "wavgBuyRate": "0.00",
  //   "netSold": "2000000",
  //   "wavgSellRate": "1.10",
  //   "buyMTM": "0",
  //   "sellMTM": "-69010",
  //   "totalPNL": "69010"
  // },
  // {
  //   "ccyPair": "GBP - USD",
  //   "netPosition": "-998438",
  //   "USDEqv": "1280497.56",
  //   "marketRate": "1.2825",
  //   "netBought": "998456.35",
  //   "wavgBuyRate": "1.21",
  //   "netSold": "0",
  //   "wavgSellRate": "0",
  //   "buyMTM": "75054.08",
  //   "sellMTM": "0",
  //   "totalPNL": "75054.08"
  // }];

  ngOnInit() {
    this.assetURL = environment.assetURL;
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    this.fromDate = this.TradeDate;
    this.toDate = this.TradeDate;
    this.apifunction.GetPositionBlotter(this.fromDate.replace(/-/g, '/'), this.toDate.replace(/-/g, '/'));
    this.loading = true;
    this.apifunction.PositionBlotterObserver.subscribe(res => {
      if (res.length !== 0) {
        //console.log(res);
        res.map(d=>{
          d['Spot_Date'] = d['Spot_Date'].split(' ')[0];
          // if(parseFloat(d['NetSold']) !== 0){
          //   d['NetSold'] = Math.abs(parseFloat(d['NetSold']));
          // }
          // if(parseFloat(d['Sell_MTM_PNL']) !== 0){
          //   d['Sell_MTM_PNL'] = Math.abs(parseFloat(d['Sell_MTM_PNL']));
          // }
          // if(parseFloat(d['NetPosition']) !== 0){
          //   d['NetPosition'] = Math.abs(parseFloat(d['NetPosition']));
          // }
          // if(parseFloat(d['USDEqvPosition']) !== 0){
          //   d['USDEqvPosition'] = Math.abs(parseFloat(d['USDEqvPosition']));
          // }
        });
        this.filteredWorflowRecords = this.workflowRecords = res;
        this.filterdata();
        this.ChangeLen();

        this.loading = false;

      }
    });
    this.apifunction.getCurrencyPairs();

    this.ccySubscription = this.apifunction.GetCurrencyPairObserver.subscribe(res => {
      // console.log(res);
      if (res.length) {
        this.ccyList = res.filter(d=>{
          return (d['PairCode'].includes('USD') && d['GoodOrder'] === 'Y');
        });
        // console.log(this.ccyList);
      }

    });
  }
  filterdata() {
    try {

      this.filteredWorflowRecords = this.workflowRecords.filter(element => {

        if (this.ccy === 'all') {
          return (element.Pair);
        } else if (this.ccy !== 'all') {
          return (element.Pair === this.ccy);
        }
      });
      this.ChangeLen();
    } catch (ex) {
//console.log(ex);
    }
  }
  ChangeLen() {
    this.filterLen = this.filteredWorflowRecords.length;
    this.workflowLen = this.workflowRecords.length;
  }
  getDate(event: MatDatepickerInputEvent<Date>, fromToFlag) {
    // this.events.push(`${type}: ${event.value}`);


    const selecteddate = event.value;
    this.validationMsg = '';
    const date = selecteddate.getDate() + '-' + this.months[selecteddate.getMonth()] + '-' + selecteddate.getFullYear();
    //console.log(date);

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
      this.workflowRecords = this.filteredWorflowRecords = [];
      this.ChangeLen();
      this.apifunction.GetPositionBlotter(this.fromDate.replace(/-/g, '/'), this.toDate.replace(/-/g, '/'));
      this.loading = true;
    }

    //console.log(this.toDate);
    // this.apifunction.getWorkflowBlotterData('Trade', 2067, this.fromDate, this.toDate);
    // this.apifunction.getSandFBlotterDetails();
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
        XLSX.writeFile(wb, 'PositionBlotter' + this.TradeDate + '.xlsx');
        this.validationMsg = '';
      }
    } catch (ex) {
//console.log(ex);
    }
  }
  public captureScreen() {
    const data = document.getElementById('contentToConvert1');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('PosiionBlotter' + this.TradeDate + '.pdf'); // Generated PDF
    }).catch(err => console.log(err));
    // const data = document.getElementById('contentToConvert1');
    // html2canvas(data).then(canvas => {

    //   const data = canvas.toDataURL();
    //   const docDefinition = {
    //     content: [{
    //       image: data,
    //       width: 500
    //     }]
    //   };
    //   pdfMake.createPdf(docDefinition).download('PosiionBlotter' + this.TradeDate + '.pdf');
    //   this.loading = false;
    // }).catch(err => console.log(err));
  }
  callWorkflow() {
    this.ccy = 'all';
    this.workflowRecords = this.filteredWorflowRecords = [];
    this.ChangeLen();
    this.apifunction.GetPositionBlotter(this.fromDate.replace(/-/g, '/'), this.toDate.replace(/-/g, '/'));
    this.loading = true;
  }

  setfiniqdateformat(strdate: string) {
    try {

      let finiqformatdate: string;
      const datearr = strdate.split('/');
      if (datearr.length > 1) {
        finiqformatdate = (datearr[1].length > 1 ? datearr[1] : '0' + datearr[1]) + '-' + this.months[(Number(datearr[0]) - 1)] + '-' + datearr[2];
      } else {
        return strdate;
      }
      return finiqformatdate;
    } catch (ex) {
//console.log(ex);
    }
  }
  convertparseFloat(value) {
    return parseFloat(value);
  }
  absValue(value){
    return Math.abs(value);
  }
}
