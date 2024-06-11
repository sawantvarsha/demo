import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { ExcelService } from '../../../services/excel.service';
import { CollateralApiService } from '../../collateral/collateral-api/collateral-api.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApifunctionService } from '../../fx-order/apifunction.service';
import { formatDate } from '@angular/common';
import { CommonfunctionService } from '../../fx-order/commonfunction.service';
import { HomeApiService } from '../../../services/home-api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

//Changed by MohanP | 2FEB22
// import * as pdfMake from 'pdfmake';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-workflowblotter',
  templateUrl: './workflowblotter.component.html',
  styleUrls: ['./workflowblotter.component.scss'],
})
export class WorkflowblotterComponent implements OnInit, OnDestroy {
  pageName = 'Workflow';
  isProd = environment.production;
  FundsBlotterArray = [];
  userID: string;
  CustomerID: string;
  blotter = [];
  blotterCopy = [];
  blotterCopy1 = [];
  RMOrderBlotter = [];
  RMOrderBlotterCopy = [];
  RMOrderBlotterCopy1 = [];
  showInvestment = true;
  showFX = false;
  showCash = true;
  showMF = false;
  showEQ = false;
  showFD = false;
  showFI = false;
  RMBlotterFilter = [];
  blotterFilter = [];
  filterFlag1: boolean;
  activeAll: boolean = false;
  // RMOrderBlotterFilter = [];
  // blotterFilter  = [];
  ccyList: any;
  errorMsg = '';
  p: any;
  q: any;
  r: any;
  recordsPerPage = 10;
  recordsPerPageFX = 12;
  showQueueBar = false; // true;
  excelHeaders: string[][] = [
    [
      'Transaction Date',
      'Trade ID',
      'Product',
      'Direction',
      'Currency Pair',
      'Sell Ccy',
      'Sell Amt',
      'Buy Ccy',
      'Buy Amt',
      'Rate',
      'Value Date',
    ],
  ];

  CreditFacility = [];
  isUserRM: boolean;
  IsLoading = true;
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
  userType: any;
  // periodType: string;
  // eslint-disable-next-line new-parens
  startDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021';
  // eslint-disable-next-line new-parens
  endDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021';;
  periodType = 'Today';
  transactionType = 'All';
  totalCount: number;
  // Changed by Rohit T. | 03-Feb-2021
  filterTabs = [
    // {
    //   title: 'All',
    //   value: 0,
    // },
    {
      title: 'Cancelled',
      value: 0,
    },
    {
      title: 'Confirmed',
      value: 0,
    },
    {
      title: 'Created',
      value: 0,
    },
    {
      title: 'Filled',
      value: 0,
    },
    {
      title: 'Rejected',
      value: 0,
    },
    {
      title: 'Submitted',
      value: 0,
    },
    {
      title: 'Verified',
      value: 0,
    },
  ];
  // Changed by MohanP | 2 Feb'22

  blottersHeaders = {
    'Ref No': {
      filterFlg: false,
      key: 'RefNo',
    },
    'Transaction Status': {
      filterFlg: false,
      key: 'TransactionStatus',
    },
    'Transaction Type': {
      filterFlg: false,
      key: 'Transactiontype',
    },
    'Transaction TypeRM': {
      filterFlg: false,
      key: 'TransactionType',
    },
    Code: {
      filterFlg: false,
      key: 'Code',
    },
    Product: {
      filterFlg: false,
      key: 'Name',
    },
    Currency: {
      filterFlg: false,
      key: 'Currency',
    },
    'Transaction Amount': {
      filterFlg: false,
      key: 'TransactionAmount',
    },
    Units: {
      filterFlg: false,
      key: 'Units',
    },
    'Trade Date': {
      filterFlg: false,
      key: 'Trade_date',
    },
    'Settlement Date': {
      filterFlg: false,
      key: 'Settlement_Date',
    },
    'Created Date': {
      filterFlg: false,
      key: 'Created_At',
    },
    Customer: {
      filterFlg: false,
      key: 'Customer_Name',
    },
    Portfolio: {
      filterFlg: false,
      key: 'Portfolio',
    },
    'Execution Price': {
      filterFlg: false,
      key: 'Dealer_Price',
    }
  };

  FXblottersHeaders = {
    'Transaction Date': {
      filterFlg: false,
      key: 'TranDateandTime',
    },
    'Trade ID': {
      filterFlg: false,
      key: 'OrderID',
    },
    Product: {
      filterFlg: false,
      key: 'Product',
    },
    Direction: {
      filterFlg: false,
      key: 'Direction',
    },
    'Currency Pair': {
      filterFlg: false,
      key: 'CurrencyPair',
    },
    'Sell Ccy': {
      filterFlg: false,
      key: 'BillingCurrency',
    },
    'Sell Amt': {
      filterFlg: false,
      key: 'Ccy1_Amount',
    },
    'Buy Ccy': {
      filterFlg: false,
      key: 'CreditCurrency',
    },
    'Buy Amt': {
      filterFlg: false,
      key: 'Ccy2_Amount',
    },
    Rate: {
      filterFlg: false,
      key: 'Rate',
    },
    'Value Date': {
      filterFlg: false,
      key: 'Value_Date',
    },
    Status: {
      filterFlg: false,
      key: 'Status',
    },
  };
  filterStr: any = '';
  transaction = [];
  filteredWorflowRecords = [];
  transactionCopy = [];
  filterLen = 0;
  workflowLen = 0;
  ccy = 'all';
  product = 'all';
  status = 'all';
  ccySubscription: Subscription;
  fromDate: string = '';
  toDate: string = '';
  TradeDate: string;
  assetURL: string;
  pdfFlag: boolean;
  productType: any;
  productTypes: any;
  CustomerName: string;
  tabs: any[];
  tabcount: any;
  activeTab: any[];
  index: any;
  productFilter: any[];
  IsLoader: boolean;
  baseCCY: string;
  IsBackButtonEnabled: boolean;
  filteredTab: any;
  tempFilterBlotter: any;
  constructor(
    public afs: WorkflowApiService,
    public cfs: CustomerApiService,
    public api: CollateralApiService,
    public router: Router,
    private datepipe: DatePipe,
    public ap: ApifunctionService,
    public com: CommonfunctionService,
    public decimalPipe: DecimalPipe,
    public excelService: ExcelService,
    public homeapi: HomeApiService,
    public auth: AuthService,
    public location: Location,
  ) {
    //this.productType = 'All';
    //Changed By MohanP | 04Feb22
    this.filteredTab = 'All';
  }
  ngOnDestroy() {
    if (this.ccySubscription) this.ccySubscription.unsubscribe();
    this.homeapi.RediretToHomeBuySellPledge = '';
  }

  ngOnInit(): void {
    // this.afs.getWorkflowData(2129, 100, 1, 'AM Investment Workflow');
    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;

    this.baseCCY = sessionStorage.getItem('BankBaseCcy');
    this.filterFlag1 = true;
    this.IsLoading = true;
    this.assetURL = environment.assetURL;
    this.filteredWorflowRecords = this.transaction;
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    const username = sessionStorage.getItem('Username');
    this.CustomerName = username;
    let today = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    //console.log(this.TradeDate);
    this.toDate = this.fromDate = this.TradeDate;
    this.ap.getSandFBlotterDetails(
      '1990-01-01',
      this.formDate(today),
      this.isUserRM ? 't,r' : 't,u'
    );
    this.ap.getCurrencyPairs();
    this.ap.GetSandFBlotterDataObserver.subscribe((res) => {
      // if(res.length !== 0){
      //   this.transaction =res["body"];
      //   this.transactionCopy =res["body"];
      // }

      if (res.length !== 0) {
        this.transaction = this.transactionCopy = [];
        // let transactionArr: any[] = [];
        // transactionArr = res['body'];
        this.transaction = res['body'];
        // if (transactionArr !== undefined) {
        //   this.transaction = transactionArr.filter(function (e) {
        //     return e.Status === "New Trade";
        //   });
        // }
        // console.log("transaction", this.transaction);

        this.transactionCopy = this.transaction;

        if (this.transaction === [] || this.transaction === undefined) {
          if (this.transaction === undefined) {
            this.filteredWorflowRecords = this.transaction = [];
            this.ChangeLen();
            this.errorMsg = 'No data found.';
            // this.IsLoading = false;
          }
          this.filteredWorflowRecords = this.transaction = [];
          this.ChangeLen();
        } else {
          try {
            this.transaction.map((d) => {
              d.TranDateandTime = formatDate(
                d.TranDateandTime,
                'dd-MMM-yyyy',
                'en-US',
                '+0530'
              );
              d.Value_Date = formatDate(
                d.Value_Date,
                'dd-MMM-yyyy',
                'en-US',
                '+0530'
              );
            });
          } catch (ex) {
            //console.log(ex);
          }
          this.transaction.forEach((element) => {
            if (element.Direction === 'S') {
              element.Direction = 'Sell';
            } else if (element.Direction === 'B') {
              element.Direction = 'Buy';
            }
          });
          this.filteredWorflowRecords = this.transaction.slice();
          this.filterdata();
          this.ChangeLen();
          // this.IsLoading = false;
          this.errorMsg = '';
        }
      }
    });

    this.cfs.fngetCustAccountDetails(username);

    this.cfs.getCustAccountDetails.subscribe((res) => {
      if (res.length !== 0) {
        if (res.status === false) {
          this.errorMsg = 'Account details not available';
        } else {
          // console.log(res);
          if (!this.CustomerID) {
            this.CustomerID = res.CustomerID;
            // if (this.isUserRM) {
            //   this.cfs.getRMOrderDetails(username);
            // }
            if (!this.isUserRM) {
              this.afs
                .getAllOrderDetails(
                  this.CustomerID,
                  this.homeapi.Portfolio || ''
                )
                .subscribe((res) => {
                  if (res.length !== 0) {
                    // this.IsLoading = false;
                    this.blotter = [];
                    // this.blotterCopy = [];
                    res.forEach((element) => {
                      // element.OrderDetail[6].Value = this.decimalPipe.transform(element.OrderDetail[6].Value, '1.2-2');
                      // element.OrderDetail[7].Value = this.decimalPipe.transform(element.OrderDetail[7].Value, '1.0-0');
                      this.blotter.push(element.OrderDetail);
                    });
                    this.blotterCopy1 = this.blotter;
                    this.blotterCopy = this.blotter;
                    this.productTypes = new Set([
                      ...this.blotterCopy.map((b) => b[13].Value),
                    ]);
                    this.productTypes = new Set([
                      ...this.blotterCopy.map((b) => b[13].Value),
                    ]);
                    // console.log(this.productTypes);
                    // console.log(this.blotter, 'Client Blotter');
                    // this.onchngePeriod(this.periodType);
                    this.getFilterTabs(this.blotter);

                    this.changeProductType('All', this.tabs.length);
                    // this.onchngePeriod(this.periodType);
                  } else {
                    this.IsLoading = false;
                  }
                });
            }
            this.api.GetCollateralReportData(username, 32710, this.baseCCY);
          }
        }
      }
    });

    this.cfs.getPledgedAgainstData('CSP_Product_Types').subscribe((res) => {
      if (res.length !== 0) {
        this.tabs = [];
        let sortedTabs = [];
        this.tabs = res.Get_Configurable_Common_DataResult;
        this.tabs.push({
          ActiveYN: '',
          DATA_VALUE: 'FX',
          Entity_Id: '0',
          Misc1: 'FX',
          Misc2: '4',
        });
        sortedTabs = this.tabs.slice().sort((a, b) => a.Misc2 - b.Misc2);
        this.tabs = sortedTabs;
        // console.log(this.tabs);
        this.tabcount = res.Get_Configurable_Common_DataResult.length;
        // console.log(this.tabs);
        this.activeTab = [];
        for (let i = 0; i < this.tabcount; i++) {
          this.activeTab.push(false);
        }
        // this.activeTab[0] = true;
        this.activeAll = true;
        this.IsLoading = false;
        // this.changeProductType('ALL',0);
        if (this.isUserRM) {
          // this.IsLoading = true;
          this.cfs.getRMOrderDetails(username);
          this.cfs.GetRMOrderDetailsObserver.subscribe((res) => {
            if (res.length !== 0) {
              // this.IsLoading = false;
              this.RMOrderBlotter = [];
              res.forEach((element) => {
                this.RMOrderBlotter.push(element);
              });
              this.RMOrderBlotterCopy = this.RMOrderBlotter;
              this.RMOrderBlotterCopy1 = this.RMOrderBlotter;
              this.productTypes = new Set([
                ...this.RMOrderBlotterCopy.map((b) => b.Type),
              ]);
              if (this.tabs !== undefined) {
                if (this.IsLoader) {
                  this.changeProductType(this.productType, this.index);
                  this.IsLoader = false;
                } else {
                  this.changeProductType('All', this.tabs.length);
                }
                // this.onchngePeriod(this.periodType);
              }
              // console.log('RM Blotter: ', this.RMOrderBlotter);
            }
          });
        }
      }
    });

    // this.afs.orderDetailsObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     this.IsLoading = false;
    //     this.blotter = [];
    //     // this.blotterCopy = [];
    //     res.forEach(element => {
    //       this.blotter.push(element.OrderDetail);
    //     });
    //     this.blotterCopy1 = this.blotter;
    //     this.blotterCopy = this.blotter;
    //     console.log(this.blotter,'Client Blotter');
    //   } else {
    //     this.IsLoading = false;
    //   }
    // });

    this.api.collateralReportObserver.subscribe((res) => {
      if (res.length !== 0) {
        // console.log(res.CreditFacilityWithMarginDetails);
        res.CreditFacilityWithMarginDetails.forEach((element) => {
          this.CreditFacility.push(element);
        });
        // this.CreditFacility = res.
        // console.log(this.CreditFacility);
      }
    });

    this.ccySubscription = this.ap.GetCurrencyPairObserver.subscribe((res) => {
      //console.log(res);
      if (res.length) {
        // this.ccyList = res;
        // console.log(this.ccyList);
        this.ccyList = res.filter((d) => {
          return d['GoodOrder'] === 'Y';
        });
      }
    });
  }

  refreshPage() {
    this.IsLoader = true;
    if (!this.isUserRM) {
      this.afs
        .getAllOrderDetails(this.CustomerID, this.homeapi.Portfolio || '')
        .subscribe((res) => {
          if (res.length !== 0) {
            // this.IsLoading = false;
            this.blotter = [];
            // this.blotterCopy = [];
            res.forEach((element) => {
              // element.OrderDetail[6].Value = this.decimalPipe.transform(element.OrderDetail[6].Value, '1.2-2');
              // element.OrderDetail[7].Value = this.decimalPipe.transform(element.OrderDetail[7].Value, '1.0-0');
              this.blotter.push(element.OrderDetail);
            });
            this.blotterCopy1 = this.blotter;
            this.blotterCopy = this.blotter;
            this.productTypes = new Set([
              ...this.blotterCopy.map((b) => b[13].Value),
            ]);
            // console.log(this.productTypes);
            // console.log(this.blotter, 'Client Blotter');
            // this.onchngePeriod(this.periodType);

            this.changeProductType(this.productType, this.index);
            // this.onchngePeriod(this.periodType);
            this.IsLoader = false;
          } else {
            this.IsLoading = false;
          }
        });
    } else {
      this.cfs.getRMOrderDetails(this.CustomerName);
    }
  }

  formDate(valuedate) {
    try {
      let FromArr = valuedate.split('-');
      let month = this.months.findIndex((x) => x === FromArr[1]) + 1;
      let fromD =
        FromArr[2] +
        '-' +
        ((month + '').length === 1 ? '0' + month : month) +
        '-' +
        FromArr[0];
      //console.log(fromD);
      return fromD;
    } catch (ex) {
      //console.log(ex);
    }
  }

  getDateInProperFormat(d: string) {
    if (d == '') {
      // console.log(d);

      return '';
    } else {
      //  d = '12/3/2020 12:00:00 AM'
      let temp: any = d.split(' ')[0];
      temp = temp.split('/');
      // console.log(parseInt(temp[0]));
      // console.log((this.months[parseInt(temp[0])]));
      // console.log((this.months[parseInt(temp[0])]));
      return temp[1] + '-' + this.months[parseInt(temp[0])] + '-' + temp[2];
    }
  }
  onchngePeriod(periodType) {
    this.filteredTab = 'All';
    this.errorMsg = '';
    this.filterFlag1 = false;
    if (this.isUserRM) {
      this.RMOrderBlotter = [];
      this.RMBlotterFilter = [];
      this.RMOrderBlotter = this.filterRMBlotter(
        periodType,
        this.RMOrderBlotter,
        this.RMOrderBlotterCopy,
        this.RMOrderBlotterCopy1
      );
      this.RMBlotterFilter = this.RMOrderBlotter; //Changed by MohanP | 4Feb22
      this.getFilterTabs(this.RMOrderBlotter);
    } else {
      // this.blotter = [];
      this.blotterFilter = [];
      this.blotter = this.filterRMBlotter(
        periodType,
        this.blotter,
        this.blotterCopy,
        this.blotterCopy1
      );
      this.blotterFilter = this.blotter;
      this.getFilterTabs(this.blotter);
    }
    return this.blotter;
  }
  filterRMBlotter(periodType, blotter, _blotterCopy, _blotterCopy1) {
    // console.log(periodType);
    switch (periodType) {
      case 'All':
        blotter = this.productFilter;
        break;
      case 'Today':
        blotter = [];
        const date1 = new Date();
        const today = this.datepipe.transform(date1, 'yyyy-MM-dd');
        // console.log(blotterCopy);
        // console.log(blotterCopy[0]);
        if (this.isUserRM) {
          blotter = this.productFilter
            .filter(
              (item) =>
                item.Trade_date !== '' &&
                this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') ===
                  this.datepipe.transform(today, 'yyyy-MM-dd')
            )
            .filter((b) =>
              this.productType !== 'All' ? b.Type === this.productType : b.Type
            );
          // console.log(blotter);
        } else {
          this.productFilter
            .filter((blotterItem) => {
              blotterItem.filter(
                (item) =>
                  item.Key === 'Trade_date' &&
                  item.Value !== '' &&
                  this.datepipe.transform(item.Value, 'yyyy-MM-dd') ===
                    this.datepipe.transform(today, 'yyyy-MM-dd')
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            })
            .filter((b) => b[13].Value === this.productType);
        }
        // console.log(blotter);
        break;
      case 'This Week':
        blotter = [];
        // const date1 = new Date();
        const weekstart = new Date().getDate() - new Date().getDay() + 1;
        const weekend = weekstart + 6; // end day is the first day + 6
        const weekfirst = new Date(new Date().setDate(weekstart));
        const weeklast = new Date(new Date().setDate(weekend));
        const weekf = this.datepipe.transform(weekfirst, 'yyyy-MM-dd');
        const weekl = this.datepipe.transform(weeklast, 'yyyy-MM-dd');
        // console.log(weekf);
        // console.log(weekl);
        if (this.isUserRM) {
          blotter = this.productFilter
            .filter(
              (item) =>
                item.Trade_date !== '' &&
                this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') >=
                  weekf &&
                this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') <= weekl
            )
            .filter((b) =>
              this.productType !== 'All' ? b.Type === this.productType : b.Type
            );
        } else {
          this.productFilter
            .filter((blotterItem) => {
              blotterItem.filter(
                (item) =>
                  item.Key == 'Trade_date' &&
                  this.datepipe.transform(item.Value, 'yyyy-MM-dd') >= weekf &&
                  this.datepipe.transform(item.Value, 'yyyy-MM-dd') <= weekl
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            })
            .filter((b) => b[13].Value === this.productType);
        }
        break;
      case 'This Month':
        blotter = [];
        const Dayf = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const first = this.datepipe.transform(Dayf, 'yyyy-MM-dd');
        const Dayl = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        const last = this.datepipe.transform(Dayl, 'yyyy-MM-dd');

        if (this.isUserRM) {
          blotter = this.productFilter
            .filter(
              (item) =>
                item.Trade_date !== '' &&
                this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') >=
                  first &&
                this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') <= last
            )
            .filter((b) =>
              this.productType !== 'All' ? b.Type === this.productType : b.Type
            );
        } else {
          this.productFilter
            .filter((blotterItem) => {
              blotterItem.filter(
                (item) =>
                  item.Key == 'Trade_date' &&
                  this.datepipe.transform(item.Value, 'yyyy-MM-dd') >= first &&
                  this.datepipe.transform(item.Value, 'yyyy-MM-dd') <= last
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            })
            .filter((b) => b[13].Value === this.productType);
        }
        break;
      case 'Custom':
        // console.log('Custom');
        this.startDate = this.datepipe.transform(this.startDate, 'dd-MMM-yyyy');
        this.endDate = this.datepipe.transform(this.endDate, 'dd-MMM-yyyy');
        blotter = this.customfilter();

        this.getFilterTabs(blotter);
        break;
    }
    return blotter;
  }
  customfilter() {
    this.errorMsg = '';
    this.validateDate();
    let blotterCopy = [];
    let blotter = [];

    const custStartDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    const custEndDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');

    if (this.isUserRM) {
      this.RMOrderBlotter = [];
      // console.log(this.RMOrderBlotterCopy1);
      blotter = this.productFilter;
      this.productFilter
        .filter(
          (item) =>
            item.Trade_date !== '' &&
            this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') >=
              custStartDate &&
            this.datepipe.transform(item.Trade_date, 'yyyy-MM-dd') <=
              custEndDate
        )
        .filter((b) =>
          this.productType !== 'All' ? b.Type === this.productType : b.Type
        );
      // this.RMOrderBlotter = blotter;
      // console.log(this.RMOrderBlotter);
      return blotter;
    } else {
      // this.blotter = [];
      blotterCopy = this.productFilter;

      blotterCopy = this.productFilter.filter((order) => {
        const orderObj = order;
        const blotterObj = Object.assign(
          {},
          ...orderObj.map((b) => {
            const obj = {};
            obj[b['Key']] = b['Value'];
            return obj;
          })
        );
        if (
          blotterObj.Trade_date &&
          this.datepipe.transform(blotterObj.Trade_date, 'yyyy-MM-dd') >=
            custStartDate &&
          this.datepipe.transform(blotterObj.Trade_date, 'yyyy-MM-dd') <=
            custEndDate
        ) {
          return order;
        } else {
          return null;
        }
      });
      // this.productFilter
      //   .filter((blotterItem) => {
      //     blotterItem.filter(
      //       (item) =>
      //         item.Key === 'Trade_date' &&
      //         this.datepipe.transform(item.Value, 'yyyy-MM-dd') >=
      //           custStartDate &&
      //         this.datepipe.transform(item.Value, 'yyyy-MM-dd') <= custEndDate
      //     ).length > 0
      //       ? blotter.push(blotterItem)
      //       : ' ';
      //   })
      //   .filter((b) => b[13].Value === this.productType);
      // this.blotter = blotter;
      console.log(blotterCopy);
      this.getFilterTabs(blotterCopy);
      return blotterCopy;
    }
  }

  validateDate() {
    const custStartDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    const custEndDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    if (custEndDate < custStartDate) {
      // console.log('Validate*******************88');
      this.errorMsg = 'Please enter valid To and From date.';
    }
  }
  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
  toggleQueueBar() {
    // this.showQueueBar = !this.showQueueBar;
    this.showQueueBar = false;
  }
  shwFilter(header) {
    // this.blottersHeaders.
    if (this.showInvestment) {
      for (const [key] of Object.entries(this.blottersHeaders)) {
        // this.phoenixWFBlotterDataHeader.push(`${key}`);
        // console.log((`${key}`));
        // console.log((`${value}`));
        if (this.blottersHeaders[`${key}`].filterFlg) {
          this.blottersHeaders[`${key}`].filterFlg = false;
        }
      }
      this.blottersHeaders[header].filterFlg = true;
      this.filterStr = '';
      // if(this.blottersHeaders[header]['filterFlg']){
      //   // this.filterStr = '';
      // }
    } else {
      for (const [key] of Object.entries(this.FXblottersHeaders)) {
        // this.phoenixWFBlotterDataHeader.push(`${key}`);
        // console.log((`${key}`));
        // console.log((`${value}`));
        if (this.FXblottersHeaders[`${key}`].filterFlg) {
          this.FXblottersHeaders[`${key}`].filterFlg = false;
        }
      }
      this.FXblottersHeaders[header].filterFlg = true;
      this.filterStr = '';
      // if(this.blottersHeaders[header]['filterFlg']){
      //   // this.filterStr = '';
      // }
    }
  }
  hideFilter(header) {
    if (this.showInvestment) {
      this.blottersHeaders[header].filterFlg = false;
      // this.customfilter();
      if (this.isUserRM) {
        if (this.filterFlag1) {
          this.RMOrderBlotter = this.RMOrderBlotterCopy1;
        } else {
          this.RMOrderBlotter = this.RMBlotterFilter;
        }
      } else {
        if (this.filterFlag1) {
          this.blotter = this.blotterCopy1;
        } else {
          this.blotter = this.blotterFilter;
        }
      }
    } else {
      this.FXblottersHeaders[header].filterFlg = false;
      this.transaction = this.filteredWorflowRecords;
      // this.customfilter();
    }
  }

  shwHidFilter(header) {
    if (this.showInvestment) {
      this.blottersHeaders[header].filterFlg =
        !this.blottersHeaders[header].filterFlg;
    } else {
      this.FXblottersHeaders[header].filterFlg =
        !this.FXblottersHeaders[header].filterFlg;
    }
  }
  /*
  filterData(event, header) {

    // var blotterCopy = [];
    // var blotter = [];
    //  this.RMOrderBlotterFilter =  this.RMOrderBlotter ;
    // this.blotterFilter = this.blotter;

    if (this.isUserRM) {
      // this.RMOrderBlotter = [];
      // console.log(this.RMOrderBlotterCopy1);
      // blotterCopy = this.RMOrderBlotterCopy1;
      // blotterCopy = this.RMOrderBlotter;
      this.RMOrderBlotter.filter(item =>
         item[this.blottersHeaders[header]['key']].toUpperCase().indexOf(this.filterStr.toUpperCase()) >= 0
      );
      // this.RMOrderBlotter = blotter;
//console.log(this.RMOrderBlotter);
    }
    else {
      // this.blotter = [];
      // blotterCopy = this.blotterCopy1;
      // blotterCopy = this.blotter;
      this.blotter.filter(blotterItem => {
        blotterItem.filter(
          item => item.Key == this.blottersHeaders[header]['key'] &&
          item.Value.toUpperCase().indexOf(this.filterStr.toUpperCase()) >= 0
        ).length > 0 ;
      }
      );
      // this.blotter = blotter;
    }
  }
  */
  filterData(_event, header) {
    if (this.showInvestment) {
      if (this.filterStr === '') {
        // this.customfilter();
        if (this.isUserRM) {
          if (this.filterFlag1) {
            this.RMOrderBlotter = this.RMOrderBlotterCopy1;
          } else {
            this.RMOrderBlotter = this.RMBlotterFilter;
          }
        } else {
          if (this.filterFlag1) {
            this.blotter = this.blotterCopy1;
          } else {
            this.blotter = this.blotterFilter;
          }
        }
      } else {
        let blotterCopy = [];
        let blotter = [];

        if (this.isUserRM) {
          this.RMOrderBlotter = [];
          // console.log(this.RMOrderBlotterCopy1);
          if (this.filterFlag1) {
            blotterCopy = this.RMOrderBlotterCopy1;
          } else {
            blotterCopy = this.RMBlotterFilter;
          }

          // blotterCopy = this.RMOrderBlotter;
          if (
            this.blottersHeaders[header].key === 'Trade_date' ||
            this.blottersHeaders[header].key === 'Settlement_Date'
          ) {
            blotter = blotterCopy.filter(
              (item) =>
                formatDate(
                  item[this.blottersHeaders[header].key],
                  'dd-MMM-yyyy',
                  'en-US'
                )
                  .toUpperCase()
                  .indexOf(this.filterStr.toUpperCase()) >= 0
            );
          } else if (this.blottersHeaders[header].key === 'Units') {
            blotter = blotterCopy.filter(
              (item) =>
                item[this.blottersHeaders[header].key]
                  .toString()
                  .indexOf(this.filterStr) >= 0
            );
          } else {
            blotter = blotterCopy.filter(
              (item) =>
                item[this.blottersHeaders[header].key]
                  .toUpperCase()
                  .indexOf(this.filterStr.toUpperCase()) >= 0
            );
          }

          this.RMOrderBlotter = blotter;
          // console.log(this.RMOrderBlotter);
        } else {
          this.blotter = [];
          if (this.filterFlag1) {
            blotterCopy = this.blotterCopy1;
          } else {
            blotterCopy = this.blotterFilter;
          }

          // blotterCopy = this.blotter;
          if (
            this.blottersHeaders[header].key === 'Created_At' ||
            this.blottersHeaders[header].key === 'Trade_date' ||
            this.blottersHeaders[header].key === 'Settlement_Date'
          ) {
            blotterCopy.filter((blotterItem) => {
              blotterItem.filter(
                // eslint-disable-next-line eqeqeq
                (item) =>
                  item.Key === this.blottersHeaders[header].key &&
                  formatDate(item.Value, 'dd-MMM-yyyy', 'en-US')
                    .toUpperCase()
                    .indexOf(this.filterStr.toUpperCase()) >= 0
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            });
          } else if (this.blottersHeaders[header].key === 'Units') {
            blotterCopy.filter((blotterItem) => {
              blotterItem.filter(
                // eslint-disable-next-line eqeqeq
                (item) =>
                  item.Key === this.blottersHeaders[header].key &&
                  item.Value.indexOf(this.filterStr) >= 0
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            });
          } else {
            blotterCopy.filter((blotterItem) => {
              blotterItem.filter(
                // eslint-disable-next-line eqeqeq
                (item) =>
                  item.Key === this.blottersHeaders[header].key &&
                  item.Value.toUpperCase().indexOf(
                    this.filterStr.toUpperCase()
                  ) >= 0
              ).length > 0
                ? blotter.push(blotterItem)
                : '';
            });
          }

          this.blotter = blotter;
        }
      }
    } else {
      if (this.filterStr === '') {
        this.transaction = this.filteredWorflowRecords;
      } else {
        let FXblotterCopy = [];
        let FXblotter = [];

        this.transaction = [];
        FXblotterCopy = this.filteredWorflowRecords;
        if (
          this.FXblottersHeaders[header].key === 'Rate' ||
          this.FXblottersHeaders[header].key === 'OrderID'
        ) {
          // this.filterStr = parseFloat(this.filterStr);

          FXblotterCopy = FXblotterCopy.filter(
            (item) =>
              item[this.FXblottersHeaders[header].key]
                .toString()
                .indexOf(this.filterStr) >= 0
          );
        } else {
          FXblotterCopy = FXblotterCopy.filter(
            (item) =>
              item[this.FXblottersHeaders[header].key]
                .toUpperCase()
                .indexOf(this.filterStr.toUpperCase()) >= 0
          );
        }

        // blotterCopy = this.blotter;
        // FXblotterCopy.filter(fxblotterItem => {
        //   fxblotterItem.filter(
        //     item => item.Key == this.FXblottersHeaders[header].key &&
        //       item.Value.toUpperCase().indexOf(this.filterStr.toUpperCase()) >= 0

        //   ).length > 0 ?
        //     FXblotter.push(fxblotterItem) : '';
        // }
        // );
        FXblotter = FXblotterCopy;
        this.transaction = FXblotter;
      }
    }
    this.p = 1;
    this.q = 1;
    this.r = 1;

    // this.custofilter();
  }

  onchngePeriodFX() {
    switch (this.transactionType.toUpperCase()) {
      case 'TODAY':
        this.transaction = this.transactionCopy.filter(
          (res) => res.DealType.split(' ')[0].toUpperCase() === 'TOD'
        );
        break;
      case 'SPOT':
        this.transaction = this.transactionCopy.filter(
          (res) => res.DealType.split(' ')[0].toUpperCase() === 'SPOT'
        );
        break;

      case 'FORWARD':
        this.transaction = this.transactionCopy.filter(
          (res) => res.DealType.split(' ')[0].toUpperCase() === 'FORWARD'
        );
        break;
      default:
        this.transaction = this.transactionCopy;
        break;
    }
  }

  ChangeLen() {
    this.filterLen = this.filteredWorflowRecords.length;
    this.workflowLen = this.transaction.length;
  }

  setfiniqdateformat(strdate: string) {
    try {
      let finiqformatdate: string;
      let datearr = strdate.split('/');

      finiqformatdate =
        (datearr[1].length > 1 ? datearr[1] : '0' + datearr[1]) +
        '-' +
        this.months[Number(datearr[0]) - 1] +
        '-' +
        datearr[2];

      return finiqformatdate;
    } catch (ex) {
      //console.log(ex);
    }
  }

  filterdata() {
    try {
      if (this.ccy === 'all' && this.product === 'all') {
        this.filteredWorflowRecords = this.transactionCopy;
        this.transaction = [];
        this.transaction = this.filteredWorflowRecords;
      } else {
        this.filteredWorflowRecords = this.transactionCopy;
        this.filteredWorflowRecords = this.filteredWorflowRecords.filter(
          (element) => {
            if (this.ccy === 'all' && this.product !== 'all') {
              return element.CurrencyPair && element.Product === this.product;
            } else if (this.ccy !== 'all' && this.product === 'all') {
              return element.CurrencyPair === this.ccy && element.Product;
            } else if (this.ccy === 'all' && this.product === 'all') {
              return element.CurrencyPair && element.Product;
            } else if (this.ccy !== 'all' && this.product !== 'all') {
              return (
                element.CurrencyPair === this.ccy &&
                element.Product === this.product
              );
            }
          }
        );
        this.transaction = [];
        this.transaction = this.filteredWorflowRecords;
      }

      this.ChangeLen();
    } catch (ex) {
      //console.log(ex);
    }
  }

  public captureScreen() {
    // this.pdfFlag = true;
    try {
      if (this.filteredWorflowRecords.length === 0) {
        this.errorMsg = 'No data for export';
      } else {
        let exportJSON: any[] = [];
        this.filteredWorflowRecords.forEach((element) => {
          exportJSON.push([
            element.TranDateandTime,
            element.OrderID,
            element.Product,
            element.Direction,
            element.CurrencyPair,
            element.BillingCurrency,
            this.com.FormatNumberr(element.Ccy1_Amount),
            element.CreditCurrency,
            this.com.FormatNumberr(element.Ccy2_Amount),
            element.Rate,
            element.Value_Date,
          ]);
        });
        // this.excelService.exportAsExcelFile(exportJSON, 'TransactionHistory' + this.TradeDate, 'PDF');
        this.errorMsg = '';
        let head = [];
        head = [
          [
            'Transaction Date',
            'Trade ID',
            'Product',
            'Direction',
            'Currency Pair',
            'Sell Ccy',
            'Sell Amt',
            'Buy Ccy',
            'Buy Amt',
            'Rate',
            'Value Date',
          ],
        ];
        var doc = new jsPDF();
        doc.setFontSize(15);
        // doc.text(' ' + this.CustomerName + '|' + this.CustomerID, 11, 8);
        doc.text(
          this.CustomerName +
            '|' +
            this.CustomerID +
            '  ' +
            'Transaction History',
          11,
          8
        );
        doc.setFontSize(5);
        doc.setTextColor(100);

        (doc as any).autoTable({
          head: head,
          body: exportJSON,
          theme: 'plain',
          styles: {
            overflow: 'linebreak',
            fontSize: 8,
          },
          didDrawCell: (_data) => {
            // console.log(data.column.index)
          },
        });
        // doc.output('dataurlnewwindow')

        // below line for Download PDF document
        doc.save('FX_TransactionHistory_' + this.TradeDate + '.pdf');
      }
    } catch (ex) {
      //console.log(ex);
    }

    // this.pdfFlag = false;
    // }, 2);
  }
  exportexcel() {
    try {
      if (this.filteredWorflowRecords.length === 0) {
        this.errorMsg = 'No data for export';
      } else {
        /* table id is passed over here */
        // let element = document.getElementById('excel-table');

        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        // /* generate workbook and add the worksheet */
        // const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // XLSX.utils.sheet_add_aoa(ws, this.excelHeaders);
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // /* save to file */
        // XLSX.writeFile(wb, 'TransactionHistory' + this.TradeDate + '.xlsx');
        let exportJSON: any[] = [];
        this.filteredWorflowRecords.forEach((element) => {
          exportJSON.push({
            'Transaction Date': element.TranDateandTime,
            'Trade ID': element.OrderID,
            Product: element.Product,
            Direction: element.Direction,
            'Currency Pair': element.CurrencyPair,
            'Sell Ccy': element.BillingCurrency,
            'Sell Amt': this.com.FormatNumberr(element.Ccy1_Amount),
            'Buy Ccy': element.CreditCurrency,
            'Buy Amt': this.com.FormatNumberr(element.Ccy2_Amount),
            Rate: element.Rate,
            'Value Date': element.Value_Date,
          });
        });
        this.excelService.exportAsExcelFile(
          exportJSON,
          'FX_TransactionHistory_' + this.TradeDate
        );
        this.errorMsg = '';
      }
    } catch (ex) {
      //console.log(ex);
    }
  }

  callWorkflow() {
    this.ccy = 'all';
    this.status = 'all';
    this.transaction = this.filteredWorflowRecords = [];
    this.ap.getSandFBlotterDetails(
      '1990-01-01',
      this.formDate(this.toDate),
      this.isUserRM ? 't,r' : 't,u'
    );
  }

  changeProductType(productType, index) {
    // this.showInvestment = true;
    // this.periodType = "Today";
    // console.log("blotterCopy", this.blotterCopy);
    this.activeAll = false;
    this.index = index;
    for (let i = 0; i < this.tabcount; i++) {
      this.activeTab[i] = false;
    }
    this.activeTab[index] = true;
    this.filterFlag1 = false;
    this.productType = productType;
    if (this.isUserRM) {
      this.blotterCopy = this.RMOrderBlotterCopy1;
    } else {
      this.blotterCopy = this.blotterCopy1;
    }
    // this.blotter = this.productType === 'FX' ? this.transaction : this.blotterCopy.filter(b => (b[13].Value === this.productType));
    // this.periodType = 'All';
    // console.log(this.blotter);

    // this.onchngePeriod(this.periodType);
    let tempblotter = [];
    if (this.productType === 'FX') {
      this.showInvestment = false;
      this.blotter = this.transaction;
      // tempblotter = this.blotter;
    } else {
      this.productFilter = [];
      // this.showInvestment = true;
      switch (productType) {
        case 'All':
          this.activeAll = true;
          tempblotter = this.blotterCopy;

          break;
        case 'Cash':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (this.blotterCopy[i].Type === 'Cash') {
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (this.blotterCopy[i][13].Value === 'Cash') {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'FI':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              // console.log(element);
              if (this.blotterCopy[i].Type === 'FI') {
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              // console.log(element);
              if (this.blotterCopy[i][13].Value === 'FI') {
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'EQ':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i].Type === 'EQ' ||
                this.blotterCopy[i].Type === 'Cash_Equity'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i][13].Value === 'EQ' ||
                this.blotterCopy[i][13].Value === 'Cash_Equity'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'FD':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i].Type === 'FixedDeposit' ||
                this.blotterCopy[i].Type === 'FIC'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i][13].Value === 'FixedDeposit' ||
                this.blotterCopy[i][13].Value === 'FIC'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'MF':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i].Type === 'MF' ||
                this.blotterCopy[i].Type === 'Securities'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i][13].Value === 'MF' ||
                this.blotterCopy[i][13].Value === 'Securities'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'SP':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (this.blotterCopy[i].Type === 'DemoProducts') {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (this.blotterCopy[i][13].Value === 'DemoProducts') {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        case 'Others':
          if (this.isUserRM) {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i].Type !== 'MF' &&
                this.blotterCopy[i].Type !== 'Securities' &&
                this.blotterCopy[i].Type !== 'FixedDeposit' &&
                this.blotterCopy[i].Type !== 'FIC' &&
                this.blotterCopy[i].Type !== 'EQ' &&
                this.blotterCopy[i].Type !== 'Cash_Equity' &&
                this.blotterCopy[i].Type !== 'Cash' &&
                this.blotterCopy[i].Type !== 'FI' &&
                this.blotterCopy[i].Type !== 'DemoProducts'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          } else {
            this.blotterCopy.forEach((_element, i) => {
              if (
                this.blotterCopy[i][13].Value !== 'MF' &&
                this.blotterCopy[i][13].Value !== 'Securities' &&
                this.blotterCopy[i][13].Value !== 'FixedDeposit' &&
                this.blotterCopy[i][13].Value !== 'FIC' &&
                this.blotterCopy[i][13].Value !== 'EQ' &&
                this.blotterCopy[i][13].Value !== 'Cash_Equity' &&
                this.blotterCopy[i][13].Value !== 'Cash' &&
                this.blotterCopy[i][13].Value !== 'FI' &&
                this.blotterCopy[i][13].Value !== 'DemoProducts'
              ) {
                // console.log(element);
                tempblotter.push(this.blotterCopy[i]);
              }
            });
          }

          break;

        default:
          break;
      }
    }

    this.blotter = tempblotter;
    this.productFilter = tempblotter;
    // this.blotterCopy1 = tempblotter;
    // this.blotterCopy =  tempblotter;
    this.onchngePeriod(this.periodType);
    // this.blotterFilter = this.blotter;
    // this.RMBlotterFilter = this.blotter;
    // console.log("rmblotter", this.blotter);
    this.p = 1;
    this.q = 1;
    this.r = 1;
  }

  clickEvent(transactionNumber, type, status, row) {
    console.log(row);
    const rowData = Object.assign(
      {},
      ...row.map((item) => ({ [item['Key']]: item['Value'] }))
    );
    // let transactionNumber = TransactionNumber;
    let transactionType = '';
    let transactionEventCode = '';
    // transactionNumber =
    //   type === 'FI' && status === 'Confirmed'
    //     ? type === 'MF' && status === 'Submitted'
    //       ? rowData.NotemasterID
    //       : transactionNumber
    //     : transactionNumber;
    switch (type) {
      case 'MF':
        switch (status) {
          case 'Submitted':
            transactionNumber = rowData.NotemasterID;
            transactionType = 'PRODUCT';
            transactionEventCode = 'FUNDSCONFIRMATION';
            break;
          case 'Confirmed':
            transactionNumber = rowData.NotemasterID;
            transactionType = 'PRODUCT';
            transactionEventCode = 'FUNDSCONFIRMATION';
            break;

          default:
            break;
        }
        break;
      case 'FI':
        switch (status) {
          case 'Confirmed':
            transactionNumber = rowData.Note_Deal_Id;
            transactionType = 'DEAL';
            transactionEventCode = 'CONFIRMATION';
            break;

          default:
            break;
        }
        break;
      case 'EQ':
      case 'Cash_Equity':
        switch (status) {
          case 'Confirmed':
            transactionNumber = rowData.Note_Deal_Id;
            transactionType = 'DEAL';
            transactionEventCode = 'CONFIRMATION';
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }
    if (
      (type === 'FI' && status === 'Confirmed') ||
      (type === 'MF' && (status === 'Submitted' || status === 'Confirmed')) ||
      (['Cash_Equity', 'EQ'].includes(type) && status === 'Confirmed')
    ) {
      this.afs
        .generateDoc(
          this.auth.EntityID,
          this.auth.EntityCode,
          this.auth.EntityName,
          this.CustomerName,
          transactionNumber,
          transactionType,
          transactionEventCode
        )

        .subscribe((response) => {
          var fileURL: string = '';
          // Start Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
          if (response[0].GeneratedFilePath.includes('\\\\')) {
            var fileURL =
              AppConfig.settings.CSP_DocGen_Virtual_Path +
              '/' +
              response[0].GeneratedFilePath.split('\\\\')[1];
          }
          // END Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
          else {
            var fileURL =
              AppConfig.settings.CSP_DocGen_Virtual_Path +
              '/' +
              response[0].GeneratedFilePath.split('\\')[2];
          }

          window.open(fileURL);
        });
    }
  }

  fnRedirectToHomePage() {
    if (this.homeapi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeapi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }
  selectFilter(filter) {
    this.filteredTab = filter;
    // console.log(this.blotterCopy);

    // let blotterArr = [];
    // this.blotterCopy.forEach((order) => {
    //   const orderObj = order;
    //   const blotterObj = Object.assign(
    //     {},
    //     ...orderObj.map((b) => {
    //       const obj = {};
    //       obj[b['Key']] = b['Value'];
    //       return obj;
    //     })
    //   );
    //   blotterArr.push(blotterObj);
    // });
    // console.log(blotterArr);
    if (filter.toUpperCase() !== 'ALL') {
      let blotter = this.onchngePeriod(this.periodType);
      this.filteredTab = filter;
      if(!this.isUserRM) {
      this.blotter = blotter.filter((o) => {
          return o[1].Value.toUpperCase().includes(filter.toUpperCase());
      });
      }else {
        this.RMOrderBlotter = blotter.filter((o) => {
          return o.TransactionStatus.toUpperCase().includes(filter.toUpperCase());
        });
      }
    } else {
      let blotter = this.onchngePeriod(this.periodType);
      this.filteredTab = 'All';
      if(!this.isUserRM)  {
      this.blotter = blotter;
      } else {
        this.RMOrderBlotter = blotter;
      }
    }
    this.p = 1;
    this.q = 1;
    this.r = 1;
  }
  getFilterTabs(blotterTemp: any[]) {
    // this.filteredTab = this.filteredTab;
    // console.log(blotterTemp);

    if (!this.isUserRM) {
      this.totalCount = blotterTemp.length;
      let blotterArr = [];
      blotterTemp.forEach((order) => {
        const orderObj = order;
        const blotterObj = Object.assign(
          {},
          ...orderObj.map((b) => {
            const obj = {};
            obj[b['Key']] = b['Value'];
            return obj;
          })
        );
        blotterArr.push(blotterObj);
      });
      // console.log("blotterArr",blotterArr);

      this.filterTabs.forEach((f) => {
        f.value = blotterArr.filter(
          (t) => t.TransactionStatus.toUpperCase().includes(f.title.toUpperCase())
        ).length;
      });
      console.log(this.filterTabs);
    } else {
      this.totalCount = blotterTemp.length;

      this.filterTabs.forEach((f) => {
        f.value = blotterTemp.filter(
          (t) => t.TransactionStatus.toUpperCase().includes(f.title.toUpperCase())
        ).length;
      });
    }
    this.filterTabs.sort((a, b) => a.title.localeCompare(b.title));
    // console.log("this.filterTabs",this.filterTabs);
  }

  back() {
    this.location.back();
  }
}
