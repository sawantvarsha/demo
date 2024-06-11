import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-regularinvestmentscheme',
  templateUrl: './regularinvestmentscheme.component.html',
  styleUrls: ['./regularinvestmentscheme.component.scss']
})
export class RegularinvestmentschemeComponent implements OnInit, OnDestroy {

  RISPaymentScheduleDetailsSubscriber: Subscription;
  pageName = 'Regular Investment Scheme';
  isProd = environment.production;
  FundsBlotterArray = [];
  userID: string;
  CustomerID: string;
  blotter = [];
  IsLoading = false;
  FromDate = '';
  ToDate = '';
  Months = ['Jan', 'Feb', 'Mar', 'APR', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  ServiceBlotter = [];
  USDEqv = 0;
  today = '';
  fileName = '';
  constructor(public afs: WorkflowApiService, public cfs: CustomerApiService, private comfs: CommonApiService) { }

  ngOnInit(): void {
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    this.IsLoading = true;
    const today = new Date();
    const dd = today.getDate();
    const TMMM = this.Months[today.getMonth()];
    const yyyy = today.getFullYear();
    this.ToDate = (dd + '-' + TMMM + '-' + yyyy).toString();
    this.today = this.ToDate;
    const MMM = this.Months[today.getMonth()];
    this.FromDate = ('01-' + MMM + '-' + yyyy).toString();

    const username = sessionStorage.getItem('Username');
    const customerID = sessionStorage.getItem('CustomerID');
    this.fileName = username + 'RISPaymentScheduleDetails' + '.xlsx';

    this.cfs.fnGetRISPaymentScheduleDetails(customerID, username);

    this.RISPaymentScheduleDetailsSubscriber = this.cfs.RISPaymentScheduleDetailsObserver.subscribe(res => {
      if (res.length !== 0) {
        this.USDEqv = 0;
        this.ServiceBlotter = [];
  //console.log(res);
        res.forEach(element => {
          this.ServiceBlotter.push(element);
          if (element.RISPaymentSchedule[5].Value !== 'Due') {
            this.USDEqv = this.USDEqv + Number(element.RISPaymentSchedule[8].Value);
          }
        });
        this.IsLoading = false;
        this.Generate();
        // console.log(this.blotter);
      }
    });
  }
  ngOnDestroy(): void {
    this.RISPaymentScheduleDetailsSubscriber.unsubscribe();
    this.ServiceBlotter = [];
  }
  selectFromDate(date) {
    this.FromDate = moment(date).format('DD-MMM-YYYY');
  }
  selectToDate(date) {
    this.ToDate = moment(date).format('DD-MMM-YYYY');
  }
  Generate() {
    this.blotter = [];
    this.ServiceBlotter.forEach(element => {
      const d1 = new Date(this.comfs.checkAndFormatDate(element.RISPaymentSchedule[2].Value));
      const d2 = new Date(this.FromDate);
      const d3 = new Date(this.ToDate);
      if (d1 > d2 && d1 < d3) {
        this.blotter.push(element);
      }
    });
  }
  ExportToExcel() {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
