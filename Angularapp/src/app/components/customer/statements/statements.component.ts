import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CustomerApiService } from '../../../services/customer-api.service';
// import { Session } from 'inspector';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DownloadService } from 'src/app/services/download.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss'],
})
export class StatementsComponent implements OnInit, OnDestroy {
  interfaceUrl = environment.interfaceURL;
  isSSl = environment.isSSL;
  sslURL = environment.sslURL;
  isDownloading: boolean;
  custSearch: string;
  CustUserType: string;
  constructor(
    public afs: CustomerApiService,
    public route: ActivatedRoute,
    public authApi: AuthService,
    public cfs: CustomerCommonfunctionsService,
    public homeApi: HomeApiService,
    public downloadService: DownloadService,
    public location: Location
  ) {}
  pageMode = 1;
  FromDate = '';
  ToDate = '';
  Months = [
    'Jan',
    'Feb',
    'Mar',
    'APR',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  CustomerID = '';
  LoginID = '';
  CusotmerName: any = '';
  SendAs = 'Download';
  Format = 'PDF';
  isActive = '1Month';
  result: any;
  PDFLink: any;
  PnLPDFLink: any;
  PortfolioPDFLink: any;
  PortfolioPDFModetxt = '';
  PortfolioPDFMode = ['Compact', 'Full'];
  SideBar = [];
  userType: string;
  sidebarData: Subscription;
  SubmenuArray = [];
  EmailMsg: any;
  EmailFlag: boolean;
  EntityID: any;
  selectedCustomerDetails: any = [];
  RMCustomerName: any;
  RMCustomerID: any;
  PdfURL: any;
  PnLPdfURL: any;
  successMsg: any;
  loadflag: boolean;
  subpages = [
    {
      name: 'Portfolio Statement',
      displayYN: 'false',
    },
    {
      name: 'Account Statement',
      displayYN: 'false',
    },
    {
      name: 'PNL Statement',
      displayYN: 'false',
    },
    {
      name: 'Credit Summary Report',
      displayYN: 'false',
    },
  ];
  statementType = '';
  changeflag = false;

  // GetCustomerMultiAccountDetailsSubscriber: Subscription;

  ngOnDestroy(): void {
    try {
      this.afs.ResetgetCustAccountDetailsforMultiAccObserver();
      // this.GetCustomerMultiAccountDetailsSubscriber.unsubscribe();
      sessionStorage.setItem('UserType', 'RM');
    } catch (e) {
      console.log(
        'Error occured while destroying Customer account details Component: ',
        e
      );
    }
  }

  ngOnInit(): void {
    this.statementType = 'PORTFOLIO';
    this.EntityID = this.authApi.EntityID;
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    this.SelectFilter('C');
    this.isActive = '1Month';
    this.SelectFilter('1M');
    this.CustomerID = this.homeApi.CustomerId;

    this.CusotmerName = this.homeApi.CustomerName;
    this.PortfolioPDFModetxt = 'Compact';
    this.RMCustomerID = '';
    this.RMCustomerName = '';
    this.successMsg = '';
    this.loadflag = true;
    this.route.params.subscribe((params) => {
      // console.log(params);
      if (params.userType) {
        // this.changeStatementTab(params.userType);
      }
    });

    // this.userType = this.authApi.UserType;
    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.userType = 'RM';
      this.LoginID = sessionStorage.getItem('Username');
      // this.custSearch = sessionStorage.getItem('custStatementFlag');
      // if(this.custSearch === 'true') {
      //   this.RMCustomerID = sessionStorage.getItem('CustomerID');
      //   this.RMCustomerName = sessionStorage.getItem('CustName');
      // }
    } else if (this.userType === 'CLIENT') {
      this.userType = 'Client';
      this.LoginID =
        this.authApi.UserName || sessionStorage.getItem('Username');
    } else if (this.userType === 'SelectedUser') {
      this.userType = 'SelectedUser';
      this.LoginID = sessionStorage.getItem('RMUser');
      this.CustomerID = sessionStorage.getItem('CustomerID');
      this.CustUserType =
        sessionStorage.getItem('RMUser') +
        '|' +
        sessionStorage.getItem('CustomerID');
      // this.RMCustomerName = sessionStorage.getItem('CustName');
    }

    this.afs.GetSidebar(this.userType).subscribe((res) => {
      if (res.length !== 0) {
        this.SideBar = res;
        this.SideBar.forEach((ele) => {
          if (ele.Submenu === '-') {
          }
          if (ele.Submenu !== '-') {
            this.SubmenuArray.push({
              menu: ele.Menu,
              submenu: ele.Submenu,
              router: ele.RouterLink,
            });
          }
        });

        this.SubmenuArray.forEach((ele) => {
          if (ele.menu === 'Statements') {
            this.subpages.forEach((page) => {
              if (ele.submenu.toUpperCase() === page.name.toUpperCase()) {
                page.displayYN = 'true';
              }
            });
          }
        });
        // console.log('sub menu in new order', this.subpages);
      }
    });
  }

  changeTab() {
    this.successMsg = '';
  }

  selectFromDate(date) {
    this.FromDate = moment(date).format('DD-MMM-YYYY');
    this.isActive = 'Custom';
  }

  selectToDate(date) {
    this.ToDate = moment(date).format('DD-MMM-YYYY');
    this.isActive = 'Custom';
  }

  SelectFilter(timeSpan) {
    const today = new Date();
    const dd = today.getDate();
    const TMMM = this.Months[today.getMonth()];
    const yyyy = today.getFullYear();
    this.ToDate = (dd + '-' + TMMM + '-' + yyyy).toString();
    switch (timeSpan) {
      case '1M':
        // today.setMonth(today.getMonth() - 1);
        this.FromDate = moment(today)
          .subtract(1, 'months')
          .format('DD-MMM-YYYY');
        this.isActive = '1Month';
        break;
      case '3M':
        // today.setMonth(today.getMonth() - 3);
        this.FromDate = moment(today)
          .subtract(3, 'months')
          .format('DD-MMM-YYYY');
        this.isActive = '3Month';
        break;
      case '6M':
        // today.setMonth(today.getMonth() - 6);
        this.FromDate = moment(today)
          .subtract(6, 'months')
          .format('DD-MMM-YYYY');
        this.isActive = '6Month';
        break;
      case 'C':
        today.setMonth(today.getMonth());
        const MMM = this.Months[today.getMonth()];
        this.FromDate = (dd + '-' + MMM + '-' + yyyy).toString();
        this.isActive = 'Custom';
        break;
    }
    // const MMM = this.Months[today.getMonth()];
    // this.FromDate = (dd + '-' + MMM + '-' + yyyy).toString();
  }

  SelectFormat(format) {
    this.Format = format;
  }

  SendAsFormat(format) {
    this.SendAs = format;
  }

  SelectMode(format) {
    this.PortfolioPDFModetxt = format;
  }

  getCustomerDetails(res) {
    if (res.length > 0) {
      // this.portfolioList = [];
      this.selectedCustomerDetails = [];
      this.selectedCustomerDetails = res;
      // for (const item of res) {
      //   if (!map.has(item.PortfolioName)) {
      //     map.set(item.PortfolioName, true); // set any value to Map
      //     this.portfolioList.push(item.PortfolioName);
      //   }
      // }
      // this.updateCustomerPortfolioDetails();
    }
  }

  selectedCustomerValue1(e) {
    this.loadflag = true;
    console.log(e);
    this.RMCustomerID = e.CustomerID;
    this.RMCustomerName = e.CustomerName.split('|')[0];
  }

  GenerateStatement() {
    // console.log(this.afs.GenerateStatementReport(this.CustomerID, this.FromDate, this.ToDate, this.LoginID));
    this.isDownloading = true;
    try {
      if (this.userType === 'Client' || this.userType === 'SelectedUser') {
        this.loadflag = true;
        this.PdfURL =
          this.interfaceUrl +
          'GenerateStatementReport/' +
          this.CustomerID +
          '/' +
          this.FromDate +
          '/' +
          this.ToDate +
          '/' +
          this.EntityID +
          '/' +
          this.LoginID +
          '/' +
          this.Format;
        // this.PdfURL = this.http.get<any>(
        //   this.interfaceUrl +
        //     'GenerateStatementReport/' +
        //     this.CustomerID +
        //     '/' +
        //     this.FromDate +
        //     '/' +
        //     this.ToDate +
        //     '/' +
        //     this.EntityID +
        //     '/' +
        //     this.LoginID +
        //     '/' +
        //     this.Format,
        //   { headers: this.headerOptions }
        // );
        // this.afs.fngetCustAccountDetailsforMultiAcc(this.LoginID);
      } else if (this.userType === 'RM') {
        if (this.RMCustomerName === '') {
          this.successMsg = 'Please select Customer.';
          this.loadflag = false;
        } else {
          this.loadflag = true;
          this.PdfURL =
            this.interfaceUrl +
            'GenerateStatementReport/' +
            this.RMCustomerID +
            '/' +
            this.FromDate +
            '/' +
            this.ToDate +
            '/' +
            this.EntityID +
            '/' +
            this.RMCustomerName +
            '/' +
            this.Format;
          // this.afs.fngetCustAccountDetailsforMultiAcc(this.RMCustomerName);
        }
      }

      this.downloadFileFromURL(this.PdfURL);
    } catch (error) {
      // console.error(error);
    }
  }

  GeneratePnLStatement() {
    this.isDownloading = true;
    try {
      if (this.userType === 'Client' || this.userType === 'SelectedUser') {
        this.loadflag = true;
        this.PnLPdfURL =
          this.interfaceUrl +
          'CustomerPnL/' +
          this.CustomerID +
          '/' +
          this.LoginID +
          '/' +
          this.Format;
        // this.PnLPdfURL = this.http.get<any>(
        //   this.interfaceUrl +
        //     'CustomerPnL/' +
        //     this.CustomerID +
        //     '/' +
        //     this.LoginID +
        //     '/' +
        //     this.Format,
        //   { headers: this.headerOptions }
        // );
      } else if (this.userType === 'RM') {
        if (this.RMCustomerName === '') {
          this.successMsg = 'Please select Customer.';
          this.loadflag = false;
        } else {
          this.loadflag = true;
          this.PnLPdfURL =
            this.interfaceUrl +
            'CustomerPnL/' +
            this.RMCustomerID +
            '/' +
            this.RMCustomerName +
            '/' +
            this.Format;
          // this.PnLPdfURL = this.http.get<any>(
          //   this.interfaceUrl +
          //     'CustomerPnL/' +
          //     this.RMCustomerID +
          //     '/' +
          //     this.RMCustomerName +
          //     '/' +
          //     this.Format,
          //   { headers: this.headerOptions }
          // );
        }
      }
      this.downloadFileFromURL(this.PnLPdfURL);
    } catch (error) {
      // console.error(error);
    }
  }
  GeneratePortfolioStatement() {
    this.isDownloading = true;
    try {
      if (this.userType === 'Client' || this.userType === 'SelectedUser') {
        this.loadflag = true;
        this.PnLPdfURL =
          this.interfaceUrl +
          'CustomerPortfolio/' +
          this.EntityID +
          '/' +
          this.CustomerID +
          '/' +
          this.CusotmerName +
          '/' +
          this.PortfolioPDFModetxt +
          '/' +
          this.Format +
          '/' +
          this.LoginID;
        // this.PnLPdfURL = this.http.get<any>(
        //   this.interfaceUrl +
        //     'CustomerPortfolio/' +
        //     this.EntityID +
        //     '/' +
        //     this.CustomerID +
        //     '/' +
        //     this.CusotmerName +
        //     '/' +
        //     this.PortfolioPDFModetxt +
        //     '/' +
        //     this.Format +
        //     '/' +
        //     this.LoginID,
        //   { headers: this.headerOptions }
        // );
      } else if (this.userType === 'RM') {
        if (this.RMCustomerName === '') {
          this.successMsg = 'Please select Customer.';
          this.loadflag = false;
        } else {
          this.loadflag = true;
          this.PnLPdfURL =
            this.interfaceUrl +
            'CustomerPortfolio/' +
            this.EntityID +
            '/' +
            this.RMCustomerID +
            '/' +
            this.RMCustomerName +
            '/' +
            this.PortfolioPDFModetxt +
            '/' +
            this.Format +
            '/' +
            this.LoginID;
          // this.PnLPdfURL = this.http.get<any>(
          //   this.interfaceUrl +
          //     'CustomerPortfolio/' +
          //     this.EntityID +
          //     '/' +
          //     this.RMCustomerID +
          //     '/' +
          //     this.RMCustomerName +
          //     '/' +
          //     this.PortfolioPDFModetxt +
          //     '/' +
          //     this.Format +
          //     '/' +
          //     this.LoginID,
          //   { headers: this.headerOptions }
          // );
        }
      }

      this.downloadFileFromURL(this.PnLPdfURL);
    } catch (error) {
      // console.error(error);
    }
  }

  GenerateCollateralStatement() {
    this.isDownloading = true;
    if (this.userType === 'Client' || this.userType === 'SelectedUser') {
      this.loadflag = true;
      // this.PdfURL = this.http.get<any>(
      //   this.interfaceUrl +
      //     'GenerateCollateralCreditSummaryReportData/' +
      //     this.EntityID +
      //     '/' +
      //     this.LoginID +
      //     '/' +
      //     this.CustomerID +
      //     '/',
      //   { headers: this.headerOptions }
      // );
      this.PdfURL =
        this.interfaceUrl +
        'GenerateCollateralCreditSummaryReportData/' +
        this.EntityID +
        '/' +
        this.LoginID +
        '/' +
        this.CustomerID +
        '/';
    } else if (this.userType === 'RM') {
      if (this.RMCustomerName === '') {
        this.successMsg = 'Please select Customer.';
        this.loadflag = false;
      } else {
        this.loadflag = true;
        this.PdfURL =
          this.interfaceUrl +
          'GenerateCollateralCreditSummaryReportData/' +
          this.EntityID +
          '/' +
          this.RMCustomerName +
          '/' +
          this.RMCustomerID +
          '/';
        // this.PdfURL = this.http.get<any>(
        //   this.interfaceUrl +
        //     'GenerateCollateralCreditSummaryReportData/' +
        //     this.EntityID +
        //     '/' +
        //     this.RMCustomerName +
        //     '/' +
        //     this.RMCustomerID +
        //     '/',
        //   { headers: this.headerOptions }
        // );
      }
    }
    this.downloadFileFromURL(this.PdfURL);
  }

  SendEmail() {
    setTimeout(() => {
      this.EmailFlag = false;
      this.EmailMsg = '';
    }, 3000);
    this.EmailFlag = true;
    this.EmailMsg = 'Email sent succesfully!';
  }

  downloadFileFromURL(url) {
    if (url) {
      this.downloadService
        .downloadPDF(url)
        .subscribe((resp: HttpResponse<Blob>) => {
          console.log(resp.headers.get('content-disposition'));
          this.isDownloading = false;
          const fileName = resp.headers.get('content-disposition')
            ? resp.headers
                .get('content-disposition')
                .split(';')[1]
                .trim()
                .replace(/filename=/g, '')
            : 'File' + new Date().toLocaleString();
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(resp.body);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
    } else {
      this.loadflag = true;
      this.successMsg = 'Error while downloading.';
    }
  }
  back() {
    this.location.back();
  }
}
