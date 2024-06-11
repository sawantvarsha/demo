import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { ApifunctionService } from '../../apifunction.service';
import { CommonfunctionService } from '../../commonfunction.service';
import { environment } from '../../../../../environments/environment';
// import * as pdfMake from 'pdfmake';
import * as jspdf from 'jspdf';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-spotforwardblotter',
  templateUrl: './spotforwardblotter.component.html',
  styleUrls: ['./spotforwardblotter.component.css']
})
export class SpotforwardblotterComponent implements OnInit, OnDestroy {
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // workflowRecords = [{
  //   "Transaction_Date": "01/02/2019",
  //   "Order_ID": "45846864564",
  //   "ccyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTC",
  //   "Credit_ccy": "USD",
  //   "Billing_ccy": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Pending",
  //   "Cancel_order": ""
  // },
  // {
  //   "Transaction_Date": "01/01/2020",
  //   "Order_ID": "45846864564",
  //   "ccyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTT",
  //   "Credit_ccy": "USD",
  //   "Billing_ccy": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Executed",
  //   "Cancel_order": ""
  // },
  // {
  //   "Transaction_Date": "01/03/2020",
  //   "Order_ID": "45846864564",
  //   "ccyPair": "EUR/USD",
  //   "Direction": "SELL",
  //   "ExpiryType": "GTC",
  //   "Credit_ccy": "USD",
  //   "Billing_ccy": "EUR",
  //   "Rate": "1,211",
  //   "Status": "Cancelled",
  //   "Cancel_order": ""
  // }];
  filteredWorflowRecords = [];
  workflowRecords = [];
  ccy = 'all';
  status = 'all';
  fromDate = '';
  toDate = '';
  TradeDate: string;
  apifunction: ApifunctionService;
  commonfunction: CommonfunctionService;
  validationMsg: string;
  assetURL: string;
  loading: boolean;
  ccyList: any;
  approveCancel = false;
  CancelDealDetails: any = [];
  CancelRequest = false;
  cancelStatus = false;
  blotterSubscription: Subscription;
  ccySubscription: Subscription;
  cancelRequestSubscription: Subscription;
  getAllDataSubscription: Subscription;
  cancelRejectSubscription: Subscription;
  approveCancelSubscription: Subscription;
  filterLen = 0;
  workflowLen = 0;
  loadingCancel = false;
  loadingCancelID = -1;
  cancelPopupMsg = '';
  product = 'all';
  constructor(afs: ApifunctionService, cfs: CommonfunctionService, private datepipe: DatePipe) {
    this.apifunction = afs;
    this.commonfunction = cfs;
  }
  ngOnDestroy() {
    this.blotterSubscription.unsubscribe();
    this.ccySubscription.unsubscribe();
    this.cancelRequestSubscription.unsubscribe();
    this.getAllDataSubscription.unsubscribe();
    this.cancelRejectSubscription.unsubscribe();
    this.approveCancelSubscription.unsubscribe();
  }

  ngOnInit() {

    this.assetURL = environment.assetURL;
    // this.CancelRequest = false;
    this.filteredWorflowRecords = this.workflowRecords;
    // console.log(new Date());
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    // console.log(this.TradeDate);
    this.toDate = this.fromDate = this.TradeDate;
    // this.fromDate = '01-Jun-2019';
    this.loading = true;
    // console.log(formatDate("/Date(1578940200000+0530)/", 'dd-MMM-yyyy', 'en-US', '+0530'));
    // this.apifunction.getWorkflowBlotterData('Trade', 2067, this.fromDate, this.toDate);

    // this.apifunction.GetCcyPairPointShiftDetails('', 'FXC');
    this.commonfunction.disableobservar.subscribe(value => {
      this.CancelRequest = value;
    });
    this.apifunction.getCurrencyPairs();


    // console.log(formatDate(this.fromDate, 'yyyy-MM-dd', 'en-US', '+0530'), formatDate(this.toDate, 'yyyy-MM-dd', 'en-US', '+0530'));
    this.apifunction.getSandFBlotterDetails(this.formDate(this.fromDate), this.formDate(this.toDate), 't');
    this.blotterSubscription = this.apifunction.GetSandFBlotterDataObserver.subscribe((res: any) => {
      // console.log(res);

      if (res.length !== 0) {
        this.workflowRecords = res.body;

        if (this.workflowRecords === [] || this.workflowRecords === undefined) {
          if (this.workflowRecords === undefined) {
            this.filteredWorflowRecords = this.workflowRecords = [];
            this.ChangeLen();
            this.validationMsg = 'No data found.';
            this.loading = false;
          }
          this.filteredWorflowRecords = this.workflowRecords = [];
          this.ChangeLen();
        } else {
          try {
            this.workflowRecords.map(d => {
              d.TranDateandTime = this.setfiniqdateformat(d.TranDateandTime);
              d.Value_Date = formatDate(d.Value_Date, 'dd-MMM-yyyy', 'en-US', '+0530');
            });
          } catch (ex) {
            // console.log(ex);
          }
          this.filteredWorflowRecords = this.workflowRecords;
          this.filterdata();
          this.ChangeLen();
          this.loading = false;
          this.validationMsg = '';
        }
      }
    });
    // this.apifunction.GetCcyPairPointShiftDetailsSFObserver.subscribe(res => {
    //   console.log(res);
    //   if (res) {
    //     this.ccyList = res['body'];
    //     console.log(this.ccyList);
    //   }
    // });

    this.ccySubscription = this.apifunction.GetCurrencyPairObserver.subscribe(res => {
      // console.log(res);
      if (res.length) {
        // this.ccyList = res;
        // console.log(this.ccyList);
        this.ccyList = res.filter(d => {
          return (d.GoodOrder === 'Y');
        });
      }
    });


    // this.apifunction.GetBlotterDataObserver.subscribe(res => {
    //   console.log(res);

    //   if (res !== []) {

    //     try {
    // //console.log(res['DUMMY']);
    //       let response = res['DUMMY'];
    //       if (response !== undefined) {
    //         this.filteredWorflowRecords = this.workflowRecords = res['DUMMY'];
    //          this.loading = false;
    //       } else {
    //         this.validationMsg = 'Empty Response from workflow service.';
    //   //console.log('Empty Response from workflow service.');
    //          this.loading = false;
    //       }

    //     } catch (ex) {
    //       this.validationMsg = 'Empty Response from workflow service.';
    // //console.log('Empty Response from workflow service.');
    // //console.log(ex);
    //        this.loading = false;
    //     }
    //   }
    // });


    this.getAllDataSubscription = this.apifunction.DealDataForCancelDetailsObserver.subscribe((dealdetails: any) => {
      if (dealdetails.length !== 0) {
        this.loadingCancelID = -1;
        this.loadingCancel = false;
        if (dealdetails.FinIQResponseHeader['Status'] === 'Succeed') {

          this.CancelDealDetails = dealdetails.DealDetails[0];
          // console.log(this.CancelDealDetails);
          this.apifunction.requestCancel(this.CancelDealDetails.FX_product_Code, this.CancelDealDetails.Deal_Pair, this.CancelDealDetails.Deal_Type.split(' ')[1], this.CancelDealDetails.Ccy1_Amt,
            this.CancelDealDetails.Ccy2_Amt, this.CancelDealDetails.Mkt_Fwd,
            this.CancelDealDetails.Deal_Rate, this.convertEOCHDate(this.CancelDealDetails.Fixing_Date),
            this.convertEOCHDate(this.CancelDealDetails.Value_Date), this.CancelDealDetails.FX_Opt_Soft_Tenor,
            this.CancelDealDetails.Profit_Pts, 0, this.CancelDealDetails.Mkt_Spot, this.CancelDealDetails.Mkt_Pts,
            this.CancelDealDetails.Counterparty, this.convertEOCHDate(this.CancelDealDetails.Spot_Date),
            this.CancelDealDetails.DFM_TotalRevenue, this.CancelDealDetails.Deal_No, this.CancelDealDetails.RFQ_ID);
        }

      }
    });

    this.cancelRequestSubscription = this.apifunction.GetCancelRequestDataObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader['Status'] === 'Succeed') {
          // console.log("success");
          this.CancelRequest = true;
          this.apifunction.getSandFBlotterDetails(this.formDate(this.fromDate), this.formDate(this.toDate), 't');
          (document.getElementById('overlay') as HTMLInputElement).style.display = 'block';
        }
      }
    });


    this.cancelRejectSubscription = this.apifunction.GetCancelRejectObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader['Status'] === 'Succeed') {
          // console.log("success");
          this.CancelRequest = false;
          this.cancelStatus = false;

          this.apifunction.getSandFBlotterDetails(this.formDate(this.fromDate), this.formDate(this.toDate), 't');
        }
      }
    });
    this.approveCancelSubscription = this.apifunction.GetApproveCancelObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader['Status'] === 'Succeed') {
          this.cancelPopupMsg = 'Trade is cancelled';
          setTimeout(() => {
            this.cancelPopupMsg = '';
            this.CancelRequest = false;
            (document.getElementById('overlay') as HTMLInputElement).style.display = 'none';
          }, 1000);
          // console.log("success");

          // this.cancelStatus = true;
          this.apifunction.getSandFBlotterDetails(this.formDate(this.fromDate), this.formDate(this.toDate), 't');
        }

      }
    });

  }

  filterdata() {
    try {
      // let statusfilter = '';
      // if (this.status === 'All') {
      //   statusfilter = 'All';
      // } else if (this.status === 'Verified') {
      //   statusfilter = 'Verified';
      // } else if (this.status === 'Pen. Ver.') {
      //   statusfilter = 'Pending Verify';
      // } else if (this.status === 'Pen. can. Ver.') {
      //   statusfilter = 'Pending Cancel Verify';
      // }else if (this.status === 'Cancelled Trades') {
      //   statusfilter = 'Cancelled Trades';
      // }
      if (this.ccy === 'all' && this.product === 'all') {
        this.filteredWorflowRecords = this.workflowRecords;
      } else {
        this.filteredWorflowRecords = this.workflowRecords.filter(element => {

          if (this.ccy === 'all' && this.product !== 'all') {
            return (element.CurrencyPair && element.Product === this.product);
          } else if (this.ccy !== 'all' && this.product === 'all') {
            return (element.CurrencyPair === this.ccy && element.Product);
          } else if (this.ccy === 'all' && this.product === 'all') {
            return (element.CurrencyPair && element.Product);
          } else if (this.ccy !== 'all' && this.product !== 'all') {
            return (element.CurrencyPair === this.ccy && element.Product === this.product);
          }

        });
      }
      this.ChangeLen();
    } catch (ex) {
      // console.log(ex);
    }
  }
  getDate(event: MatDatepickerInputEvent<Date>, fromToFlag) {
    // this.events.push(`${type}: ${event.value}`);


    const selecteddate = event.value;
    this.validationMsg = '';
    const date = selecteddate.getDate() + '-' + this.months[selecteddate.getMonth()] + '-' + selecteddate.getFullYear();
    // console.log(date);

    if (fromToFlag === 'From') {
      this.fromDate = date;
    } else {
      this.toDate = date;
    }
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.validationMsg = 'From date should be earlier than to date.';
      this.workflowRecords = this.filteredWorflowRecords = [];
    } else {
      const fdate = this.formDate(this.fromDate);
      const tDate = this.formDate(this.toDate);
      this.apifunction.getSandFBlotterDetails(fdate, tDate, 't');
      this.workflowRecords = this.filteredWorflowRecords = [];
      this.ChangeLen();
      this.loading = true;
    }

    // console.log(this.toDate);
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
        XLSX.writeFile(wb, 'TransactionHistory' + this.TradeDate + '.xlsx');
        this.validationMsg = '';
      }
    } catch (ex) {
      // console.log(ex);
    }
  }
  cancelOrder(dealno, index) {
    try {
      this.apifunction.GetDealDataForCancel(dealno);
      this.loadingCancel = true;
      this.loadingCancelID = index;
    } catch (ex) {
      // console.log(ex);
    }
  }
  callWorkflow() {
    this.ccy = 'all';
    this.status = 'all';
    this.workflowRecords = this.filteredWorflowRecords = [];
    this.apifunction.getSandFBlotterDetails(this.formDate(this.fromDate), this.formDate(this.toDate), 't');

  }

  convertEOCHDate(dateVal) {
    // var dateVal ="/Date(1578940200000+0530)/";
    const date = new Date(parseFloat(dateVal.substr(6)));
    return date.getDate() + '-' + this.months[date.getMonth()] + '-' + date.getFullYear();

  }

  approveRejectCancel() {
    if (this.approveCancel === false) {
      this.apifunction.rejectCancel(this.CancelDealDetails.FX_product_Code, this.CancelDealDetails.Deal_Pair, this.CancelDealDetails.Deal_Type.split(' ')[1], this.CancelDealDetails.Ccy1_Amt,
        this.CancelDealDetails.Ccy2_Amt, this.CancelDealDetails.Mkt_Fwd,
        this.CancelDealDetails.Deal_Rate, this.convertEOCHDate(this.CancelDealDetails.Fixing_Date),
        this.convertEOCHDate(this.CancelDealDetails.Value_Date), this.CancelDealDetails.FX_Opt_Soft_Tenor,
        this.CancelDealDetails.Profit_Pts, 0, this.CancelDealDetails.Mkt_Spot, this.CancelDealDetails.Mkt_Pts,
        this.CancelDealDetails.Counterparty, this.convertEOCHDate(this.CancelDealDetails.Spot_Date),
        this.CancelDealDetails.DFM_TotalRevenue, this.CancelDealDetails.Deal_No, this.CancelDealDetails.RFQ_ID);
      (document.getElementById('overlay') as HTMLInputElement).style.display = 'none';
      this.CancelRequest = false;
    }
    else if (this.approveCancel === true) {

      this.apifunction.ApproveCancel(this.CancelDealDetails.FX_product_Code, this.CancelDealDetails.Deal_Pair, this.CancelDealDetails.Deal_Type.split(' ')[1], this.CancelDealDetails.Ccy1_Amt,
        this.CancelDealDetails.Ccy2_Amt, this.CancelDealDetails.Mkt_Fwd,
        this.CancelDealDetails.Deal_Rate, this.convertEOCHDate(this.CancelDealDetails.Fixing_Date),
        this.convertEOCHDate(this.CancelDealDetails.Value_Date), this.CancelDealDetails.FX_Opt_Soft_Tenor,
        this.CancelDealDetails.Profit_Pts, 0, this.CancelDealDetails.Mkt_Spot, this.CancelDealDetails.Mkt_Pts,
        this.CancelDealDetails.Counterparty, this.convertEOCHDate(this.CancelDealDetails.Spot_Date),
        this.CancelDealDetails.DFM_TotalRevenue, this.CancelDealDetails.Deal_No, this.CancelDealDetails.RFQ_ID);

      this.cancelPopupMsg = 'Cancelling the trade.';
    }
    this.loadingCancelID = -1;
    this.loadingCancel = false;
  }

  public captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('TransactionDetails.pdf'); // Generated PDF
    }).catch(err => console.log(err));
    // let data = document.getElementById('contentToConvert1');
    // html2canvas(data).then(canvas => {

    //   let data = canvas.toDataURL();
    //   let docDefinition = {
    //     content: [{
    //       image: data,
    //       width: 500
    //     }]
    //   };
    //   // pdfMake.createPdf(docDefinition).download('TransactionHistory.pdf');
    //   this.loading = false;
    // }).catch(err => console.log(err));
  }
  formDate(valuedate) {
    try {
      const FromArr = valuedate.split('-');
      const month = this.months.findIndex(x => x === FromArr[1]) + 1;
      const fromD = FromArr[2] + '-' + (((month) + '').length === 1 ? ('0' + month) : month) + '-' + FromArr[0];
      // console.log(fromD);
      return fromD;

    } catch (ex) {
      // console.log(ex);
    }
  }
  ChangeLen() {
    this.filterLen = this.filteredWorflowRecords.length;
    this.workflowLen = this.workflowRecords.length;
  }
  setfiniqdateformat(strdate: string) {
    try {

      let finiqformatdate: string;
      const datearr = strdate.split('/');

      finiqformatdate = (datearr[1].length > 1 ? datearr[1] : '0' + datearr[1]) + '-' + this.months[(Number(datearr[0]) - 1)] + '-' + datearr[2];

      return finiqformatdate;
    } catch (ex) {
      // console.log(ex);
    }
  }
  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
}
