import { Component, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { HomeApiService } from 'src/app/services/home-api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { DatePipe } from '@angular/common';
declare var require: any;
declare var require: any;
const $: any = require('jquery');

// declare global {
//   interface Array<T> {
//     sortBy(p): Array<T>;
//   }
// }
// eslint-disable-next-line space-before-function-paren
// Array.prototype.sortBy = function (p): Array<any> {
//   try {
//     return this.slice(0).sort((a, b) => {
//       return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
//     });
//   }
//   catch (error) {
//     console.log(error);
//   }
// };
@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss'],
})
export class SharesComponent implements OnInit, OnDestroy {
  @Input() displaySearch: boolean;
  @Input() note_Master_Id: string = '';
  FundingModeData: any;
  FundMode: any = 'Fully Funded';
  FundVal: any;
  LoanAmt: any = 0;
  LoanTenor: any = '12M';
  TenorData: any;
  Drawdown: any = '0';
  LTV: any = '0';
  CashBalance: string;
  balanceFlag: boolean;
  bankContribution: string;
  RMName: any;
  businessDate: any;
  remarkflag: boolean = false;
  lotSizeFlag: boolean;
  dateFlag: boolean;
  @Input() get Customer() {
    return this.CustomerName;
  }
  set Customer(Customer) {
    this.CustomerName = Customer;
  }
  shareNMID: any;
  portfolioName: any;
  @Input() get noteMasterId() {
    return this.shareNMID;
  }
  set noteMasterId(noteMasterId) {
    this.shareNMID = noteMasterId;
  }
  actionName: any;
  @Input() get action() {
    return this.actionName;
  }
  set action(action) {
    this.actionName = action;
  }
  actionDetails: any;
  @Input() get actionData() {
    return this.actionDetails;
  }
  set actionData(actionData) {
    this.actionDetails = actionData;
  }
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
  btnname = 'Subscribe';
  NominalAmount: string;
  Remark = '';
  RM_Order = '';
  clorId: string;
  side: any;
  OID: string;
  optiontype: any;
  exchange: any;
  search: string;
  ISIN: any;
  details: any = {};
  ShareName: any;
  shareList: any[];
  showShareDetails: boolean;
  selectedBIndex = 0;
  showSuggestions = false;
  timeout = null;
  NoteMasterId = '';
  selectedShare: any = '';
  SettlementType: any = '';
  ccy: any;
  UnderlyingCode: any;
  tradeDate: any;
  OrderType: any;
  Price: any;
  expiryDate: any = '';
  Notional: any;
  TimeInForce: any;
  successMsg: any;
  cssClass: any;
  OrderID: any;
  settlementDate: any;
  SettAmt: any;
  OrderQty: any;
  LimitPrice: any;
  setType: string;
  ShareBlotterArray = [];
  orderflag: boolean;
  interfaceUrl = environment.interfaceURL;
  isProd = environment.production;
  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
  loadflag = false;
  monthNames = [
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
  selectedMFIndex: number;
  selectedMFIndex1: number;
  selectedMFIndex2: number;
  moredetails = 'More Details';
  portfolioList = [];
  portfolioAccount = [];
  Account_Name: string;
  Account_Number: string;
  currency: any;
  // ccy1 = [];
  accountList = [];
  portfolio: string;
  CustomerID: any;
  multiportfoliodata: Subscription;
  CustomerName: any;
  username: any;
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  CurrencyList = [];
  showSubmit: boolean;
  isEditable = false;
  //Changed By MohanP | 04Feb22
  PortfolioDdl: any;
  enablePortfolio = true;
  selectedAssetObserverSub: Subscription;
  selectedPortfolioBS: Subscription;
  selectedDirBS: Subscription;
  showSuitabilityPopup: boolean;
  sut_notemaster: string; // Added by Rohit T. | 04-Feb-2021
  checkSuitability: boolean = false; // Added by Alolika G. | 07-Feb-2021
  orderDetails: any;
  CRR: any;
  commissionValue: any = '';
  commissionPercentage: any = '';
  commissionReason: any = '';
  NMID_Suitability: any;
  token: any;
  backdated: boolean = false;
  sharelistBS: Subscription;
  shareDetailsBS: Subscription;
  constructor(
    private workflowApi: WorkflowApiService,
    public elem: ElementRef,
    public commonApi: CommonApiService,
    private cfs: CustomerApiService,
    public homeApi: HomeApiService,
    public activatedRoute: ActivatedRoute,
    public authapi: AuthService,
    public datepipe: DatePipe
  ) {
    this.showShareDetails = false;
    this.loadflag = false;
    this.shareList = [];
    this.search = '';
    this.successMsg = '';
    this.showSubmit = false;
    this.details = {
      AskPx: '',
      BidPx: '',
      Currency: '',
      DecimalAmount: '',
      DecimalRate: '',
      Exchange: '',
      Feedcode: '',
      LotSize: '',
      NoteMasterID: '',
      Product_Name: ' ',
      SettlementDate: '',
      SettlementType: '',
      TradeDate: '',
      closerate: '',
      dayhigh: '',
      daylow: '',
      ftweekhigh: '',
      ftweeklow: '',
      openrate: '',
      previousclose: '',
    };
  }
  ngOnDestroy() {
    this.loadflag = false;
    this.successMsg = '';
    if(![null, undefined].includes(this.selectedAssetObserverSub)){
      this.selectedAssetObserverSub.unsubscribe();
      this.selectedAssetObserverSub = null;
    }

    if(![null, undefined].includes(this.sharelistBS)) {
      this.sharelistBS.unsubscribe();
      this.sharelistBS = null;
    }

    if(![null, undefined].includes(this.shareDetailsBS)) {
      this.shareDetailsBS.unsubscribe();
      this.shareDetailsBS = null;
    }

    if(![undefined, null].includes(this.selectedPortfolioBS)) {
      this.selectedPortfolioBS.unsubscribe();
      this.selectedPortfolioBS = null;
    }

    if (![undefined, null].includes(this.selectedDirBS)) {
      this.selectedDirBS.unsubscribe();
      this.selectedDirBS = null;
    }
    this.workflowApi.eqsubscribe.next([]);
    this.workflowApi.shareCancel.next([]);
    this.workflowApi.shareAmend.next([]);
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';
    this.workflowApi.shareDetails.next([]);
    this.commonApi.selectedAsset.next([]);
    this.actionName = '';
    this.actionDetails = [];
  }

  ShowCustName: any = false; // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
  facilityCode: any; // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
  ngOnInit(): void {
    // this.username = sessionStorage.getItem('Username');
    this.username = this.authapi.UserName;
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }

    //<!-- Changes done by Alolika G | 15-02-2022 -->
    if (!this.CustomerName) {
      // this.PortfolioDdl = this.homeApi.Profiles.PortfolioDetails;

      this.CustomerName = this.homeApi.CustomerName;

      // this.CustomerName = this.homeApi.CustomerName + '|' + this.homeApi.CustomerId;
      //<!-- Changes done by Alolika G | 15-02-2022 -->
      // this.accountList = this.homeApi.Profiles.PortfolioDetails.map(
      //   (a) => a.AccountNumber
      // );
      this.CustomerID = this.homeApi.CustomerId;

      // this.portfolio = this.PortfolioDdl[0].Portfoio;
      // this.Account_Number = this.PortfolioDdl[0].AccountNumber;
      // this.currency = this.PortfolioDdl[0].AccountNumber.Currency;
      // this.portfolio = this.homeApi.Profiles.Portfolio;
      // this.Account_Number = this.homeApi.Profiles.AccountNumber;
      // this.currency = this.homeApi.Profiles.Currency;
    } else {
      this.CustomerID = this.CustomerName.split('|')[1];
    }
    //<!-- Addded by Alolika G for share selection. (order entry from rebalance) | 15-02-2022 -->
    this.activatedRoute.queryParams.subscribe((res) => {
      if (!this.displaySearch) {
        this.displaySearch = res.displaySearch;
      }
    });
    this.successMsg = '';
    // const that = this;    // Added by Anjali T asked by Mohan P 07-Feb-2022 -->

    this.optiontype = 'Market';
    this.exchange = 'US';
    this.OrderQty = '500.00';
    this.LimitPrice = '1.5';
    this.TimeInForce = 'DAY';
    if (!this.isUserRM) {
      this.workflowApi.GetShareList('');
    } // Added by Anjali T asked by Mohan P 07-Feb-2022 -->

    this.sharelistBS = this.workflowApi.sharelistObserver.subscribe(
      (res: any) => {
        this.successMsg = '';
        this.loadflag = false;
        if (res) {
          this.shareList = res;
        }
      }
    );

    // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
    this.shareDetailsBS = this.workflowApi.shareDetailsObserver.subscribe(
      (res: any) => {
        if (res.length !== 0) {
          this.details = res.ProductDetails;
          // console.log(res.ProductDetails, typeof (res));
          // console.log('this.details', this.details);
          if (this.shareList.length) {
            this.showShareDetails = true;
            this.search = '';
            this.shareList = [];
            this.shareList.length = 0;
            this.SettlementType =
              this.details.SettlementType.split('+')[1].trim();
              this.validateQuantity(this.OrderQty);
            // this.OrderQty = this.commonApi.formatNumber(this.details.LotSize); //Commented by Alolika G to display Quantity from API for amend/cancel.

            // console.log('settlement type', this.SettlementType);
            // that.setType = that.details.SettlementType;
            // that.SettlementType = that.setType.split('+')[1];

            if (this.optiontype === 'Limit') {
              this.SettAmt =
                parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
            } else {
              if (this.optiontype === 'Market') {
                if (this.side === 'Buy') {
                  this.SettAmt =
                    this.details.AskPx *
                    parseFloat(this.OrderQty.replace(/,/g, ''));
                } else {
                  this.SettAmt =
                    this.details.BidPx *
                    parseFloat(this.OrderQty.replace(/,/g, ''));
                }
              }
            }

            // this.updateCcy(); // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
            if (this.details.Currency !== '') {
              this.workflowApi
                .getAccountNumberFromPortfolioGeneric(
                  this.CustomerID,
                  this.facilityCode,
                  this.details.Currency
                )
                .subscribe((res) => {
                  if (res) {
                    // console.log("res in update portfolio",res)
                    this.accountList = [];
                    this.accountList = res.ExecGenericTableValuedFunctionResult;
                    this.Account_Number = this.accountList[0].Param1;
                    this.cashBalance();
                  }
                });
            }
          }
        }
      }
    );
    // End by Anjali T asked by Mohan P 07-Feb-2022 -->

    this.selectedAssetObserverSub =
      this.commonApi.selectedAssetObserver.subscribe(async (res) => {
        try {
          // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
          // console.log(
          //   'selectedAssetObserverSub========================',
          //   res,
          //   this.shareList
          // );
          const code = res;
          this.shareList = await this.workflowApi.GetShareListAsync(code);
          if (this.shareList.length !== 0) {
            const NMArray = this.shareList.filter(
              (b) => b.Feedcode === code
            )[0];
            this.NoteMasterId = NMArray.Note_Master_Id;
            // this.OrderQty = NMArray.Note_Master_Id;
            // console.log('id', NMArray, this.NoteMasterId);
            this.selectShareOnClick(this.NoteMasterId);
          } else {
          }
        } catch (ex) {
          console.log('Error occured in selectedAssetObserver: ', ex);
        }
      });

    // End by Anjali T asked by Mohan P 07-Feb-2022 -->

    this.selectedDirBS = this.commonApi.selectedDirObserver.subscribe((res) => {
      if (res.length !== 0) {
        if (res.toUpperCase() === 'BUY') {
          this.side = 'Buy';
        } else if (res.toUpperCase() === 'SELL') {
          this.side = 'Sell';
        }
        if (!['', null, undefined].includes(this.actionName)) {
          if (this.actionName === 'AMEND') {
            this.btnname = 'Amend';
            this.remarkflag = true;
          } else if (this.actionName === 'CANCEL') {
            this.btnname = 'Cancel';
            this.isEditable = true;
            this.remarkflag = true;
          } else {
            this.optiontype = 'Market';
          }
        }
        if (
          !['', null, undefined].includes(this.actionDetails) &&
          this.actionName.toUpperCase() !== 'SUBSCRIBE'
        ) {
          this.OID = this.actionDetails.RefNo;
          this.OrderQty = this.commonApi.FormatNumberr(
            this.actionDetails.Quantity
          );
          if (this.actionDetails.Order_Type.toUpperCase() === 'LIMIT') {
            this.optiontype = 'Limit';
          } else if (this.actionDetails.Order_Type.toUpperCase() === 'MARKET') {
            this.optiontype = 'Market';
          }
          this.RMName = this.actionDetails.RM;
          // this.Remark = this.actionDetails.Remarks;
          if (this.optiontype === 'Limit') {
            this.LimitPrice = this.commonApi.FormatNumberr(
              this.actionDetails.Limit_Price
            );
            this.SettAmt =
              parseFloat(this.OrderQty.replace(/,/g, '')) *
              this.actionDetails.Limit_Price;
          } else {
            if (this.optiontype === 'Market') {
              if (this.side === 'Buy') {
                this.SettAmt =
                  this.actionDetails.spotaskquote *
                  parseFloat(this.OrderQty.replace(/,/g, ''));
              } else {
                this.SettAmt =
                  this.actionDetails.spotbidquote *
                  parseFloat(this.OrderQty.replace(/,/g, ''));
              }
            }
          }
          // this.expiryDate = this.actionDetails.Order_Expiry_Date;
          this.expiryDate = this.datepipe.transform(this.actionDetails.Order_Expiry_Date, "dd-MMM-yyyy");
          this.settlementDate = this.datepipe.transform(this.actionDetails.Settlement_Date, "dd-MMM-yyyy");
          this.tradeDate = this.datepipe.transform(this.actionDetails.TradeDate, "dd-MMM-yyyy");
          // console.log("this.expiryDate", this.expiryDate)
          this.clorId = this.actionDetails.RefNo;
          // this.Remark = this.actionDetails.Remarks;
        } else {
        }
      }
    });
    this.selectedPortfolioBS =
      this.commonApi.selectedPortfolioObserver.subscribe((res) => {
        if (res.length !== 0) {
          const portfolio = res;
          this.portfolio = res.PortfolioName;
          this.facilityCode = res.FacilityCode;
          // console.log('amend portfolio', portfolio);
          this.updatePortfolio();
        }
      });

    //Added by Alolika G on 8th Feb 2022 --START
    this.workflowApi.eqsubscribeObserver.subscribe((res: any) => {
      if (res.length === 0) {
      } else {
        if (res.FinIQResponseHeader.Status === 'Failed') {
          this.loadflag = false;
          this.successMsg =
            res.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Description;
        } else {
          this.loadflag = false;
          this.OrderID = res.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
          this.successMsg =
            'Order placed successfully with Ref No. ' + this.OrderID;
          this.scrollWin();
          let orderDetail = {
            custID: this.CustomerID,
            currency: this.details.Currency,
            custName: this.CustomerName,
            NoteMasterId: this.NMID_Suitability,
            portfolio: this.portfolio,
            orderID: this.OrderID,
            settlementAmount: this.SettAmt,
            failrules: this.token,
          };
          if (this.checkSuitability && this.token !== '') {
            this.workflowApi.getSuitabilityToken(orderDetail).then((token) => {
              console.log(token, 'token', orderDetail, 'orderDetail');
            });
          }
        }
      }
    });
    //Added by Alolika G on 8th Feb 2022 --END

    this.workflowApi.shareCancelObserver.subscribe((res) => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.loadflag = false;
          this.successMsg =
            'Order cancelled successfully with Ref No. ' +
            res.Order_Cancel_Res_DTO.OrdCancelResDetails.ClOrderID;
        } else {
          this.loadflag = false;
          this.successMsg =
            res.Order_Cancel_Res_DTO.OrdCancelResDetails.OrdResponseDetails.Description;
          // this.successMsg = 'Order cancel failed!';
        }
      }
    });
    this.workflowApi.shareAmendObserver.subscribe((res) => {
      if (res.length !== 0) {
        if (res.FinIQResponseHeader.Status === 'Succeed') {
          this.loadflag = false;
          this.successMsg =
            'Order amended successfully with Ref No. ' +
            res.Order_Amend_Res_DTO.objResponseDetails.ClOrdID;
        } else {
          this.loadflag = false;
          this.successMsg =
            res.Order_Amend_Res_DTO.objResponseDetails.OrdResponseDetails.Description;
          // this.successMsg = 'Order amendment failed!';
        }
      }
    });

    // Added by AlolikaG on 4th Feb 2022 --START. // Funding type changes. Do not remove
    this.cfs.getPledgedAgainstData('UTFundMode').subscribe((res) => {
      if (res) {
        this.FundingModeData = [];
        this.FundingModeData = res.Get_Configurable_Common_DataResult;
        this.FundingModeChange(this.FundMode);
        // console.log('this.FundingModeData', this.FundingModeData);
      }
    });
    this.cfs.getPledgedAgainstData('LombardLoanTenor').subscribe((res) => {
      if (res) {
        this.TenorData = [];
        this.TenorData = res.Get_Configurable_Common_DataResult;
        // this.FundingModeChange(this.FundMode);
        // console.log('this.TenorData', this.TenorData);
      }
    });
    // Added by AlolikaG on 4th Feb 2022 --END.
    this.cfs.fngetCustAccountDetails(this.username);

    this.cfs.getCustAccountDetails.subscribe((res) => {
      if (res.length !== 0) {
        // this.CustomerID = res.CustomerID;
        // this.CustomerName = res.misc1;
        this.RMName = res.RM;

        //Changes on 07 Feb 2022 by Ashwini H for RM login
        if (this.isUserRM) {
          this.RMName = this.username;
        }

        console.log('RM Name', this.RMName);

        // this.portfolio = res.portfolio;
        // this.workflowApi.GetsuitabilityCheckData(
        //   this.CustomerName,
        //   this.CustomerID,
        //   this.username
        // );
      }
    });

    this.workflowApi.getBusinessDate().then((date) => {
      this.businessDate = date.businessDate;
      // console.log(date, 'date');
        this.tradeDate = date.businessDate;
        this.expiryDate = date.businessDate;
        this.GetDates();
    });
  }

  //Added by AlolikaG on 25th Feb 2022 --START. // Funding type changes. Do not remove
  FundingModeChange(Event) {
    // this.successMsg = '';
    this.FundMode = Event;
    this.FundingModeData.forEach((element) => {
      if (element.DATA_VALUE === this.FundMode) {
        this.FundVal = element.Misc1;
      }
    });
    if (this.FundVal === 'TL') {
      this.getAvailableDrawdown();
      this.LoanAmt = this.commonApi.FormatNumberr(this.SettAmt.toFixed(2));
    } else if (this.FundVal === 'PL') {
      // this.LoanAmt = this.cfs.FormatNumberr(this.notional);

      this.getAvailableDrawdown();
      this.LoanAmt = '0.00';
    }
    // console.log('this.data ', this.data);
  }

  getAvailableDrawdown() {
    try {
      this.workflowApi
        .getMFDrawdown(
          this.CustomerID,
          this.SettAmt.toFixed(2),
          this.details.BidPx,
          this.LTV,
          ''
        )
        .subscribe((res) => {
          if (res) {
            this.Drawdown = res.ExecGenericTableValuedFunctionResult[0].Param1;
            this.Drawdown = this.commonApi.FormatNumberr(this.Drawdown);
          }
        });
    } catch (error) {}
  }

  enterNotional(nominal) {
    if (this.FundVal === 'TL') {
      this.LoanAmt = this.commonApi.FormatNumberr(nominal);
      this.getAvailableDrawdown();
    } else if (this.FundVal === 'PL') {
      this.LoanAmt = 0;
      // this.LoanAmt = this.cfs.FormatNumberr(this.notional);
      this.getAvailableDrawdown();
    }
  }
  //Added by AlolikaG on 4th Feb 2022 --END.

  formatDate(date) {
    const d = new Date(date);
    return (
      (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
      '-' +
      this.months[d.getMonth()] +
      '-' +
      d.getFullYear()
    );
  }

  updatePortfolio() {
    // Added by Anjali T asked by Mohan P 07-Feb-2022 -->

    this.portfolioList.forEach((res) => {
      if (res.FacDesc === this.portfolio) {
        this.facilityCode = res.FacDesc;
      }
    });

    console.log(
      'Portfolio',
      this.CustomerID,
      this.portfolio,
      this.details.Currency
    );
    if (this.details.Currency !== '') {
      this.workflowApi
        .getAccountNumberFromPortfolioGeneric(
          this.CustomerID,
          this.portfolio, // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
          this.details.Currency
        )
        .subscribe((res) => {
          if (res) {
            // console.log("res in update portfolio",res)
            this.accountList = [];
            this.accountList = res.ExecGenericTableValuedFunctionResult;
            this.Account_Number = this.accountList[0].Param1;
            this.cashBalance();
          }
        });
    }
  }

  getPortfolioFromFund() {
    this.portfolioList = [];
    this.accountList = [];
    this.CurrencyList = [];
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.SICurrency === this.details.Currency;
    });

    if (temp.length) {
      temp.forEach((element) => {
        this.portfolioList.push(element.PortfolioName);
        this.accountList.push(element.AccountNo);
        this.CurrencyList.push(this.details.Currency);
      });

      // this.portfolio = temp[0].PortfolioName
    } else {
      this.successMsg =
        'Portfolio with selected share currency is not available. Please select different fund';
      this.showSubmit = false;
    }
  }

  // updateCustomerPortfolioDetails() {
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   console.log('Update ccy: ', this.currency);
  //   const temp: any = this.selectedCustomerDetails.filter((obj) => {
  //     return obj.PortfolioName === this.portfolio;
  //   });
  //   temp.forEach((element) => {
  //     this.accountList.push(element.AccountNo);
  //     this.CurrencyList.push(element.SICurrency);
  //   });
  //   this.Account_Number = this.accountList[0];
  //   // this.currency = this.details.Currency = this.CurrencyList[0];
  //   this.updateCcy();
  //   // this.ChangeSelectedportfolio();
  // }

  updateCustomerPortfolioDetails() {
    this.accountList = [];
    this.ccy = [];
    this.portfolioList = [];
    this.successMsg = '';
    this.showSubmit = true;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.PortfolioDdl.length; i++) {
      if (this.PortfolioDdl[i].Currency === this.details.Currency) {
        this.portfolioList.push(this.PortfolioDdl[i].Portfoio);
        this.accountList.push(this.PortfolioDdl[i].AccountNumber);
        // this.accountList.push(this.portfolioAccount[i][1]);
        // this.ccy.push(this.portfolioAccount[i][2]);
      }
    }

    let portfoliolist = this.portfolioList;
    this.portfolioList = portfoliolist.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
    );

    if (this.portfolioList.length !== 0) {
      this.successMsg = '';
      this.portfolio = this.portfolioList[0];
      this.Account_Number = this.accountList[0];
    } else {
      this.successMsg =
        'Portfolio with selected share currency is not available. Please select different share';
    }
  }

  updateCcy() {
    // console.log('Update ccy: ', this.currency);
    if (this.isUserRM) {
      const temp: any = this.selectedCustomerDetails.filter((obj) => {
        return obj.AccountNo === this.Account_Number;
      });
      if (temp.length) {
        this.currency = temp[0].SICurrency; // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
        this.details.Currency = temp[0].SICurrency;
      }
      if (this.details.Currency !== '') {
        this.workflowApi
          .getAccountNumberFromPortfolioGeneric(
            this.CustomerID,
            this.facilityCode,
            this.details.Currency
          )
          .subscribe((res) => {
            if (res) {
              // console.log("res in update portfolio",res)
              this.accountList = [];
              this.accountList = res.ExecGenericTableValuedFunctionResult;
              this.Account_Number = this.accountList[0].Param1;
              this.cashBalance();
            }
          });
      }
    } else {
    }

    // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
  }

  getCustomerDetails(res) {
    if (res.length > 0) {
      this.portfolioList = [];
      this.selectedCustomerDetails = res;
      const map = new Map();
      for (const item of res) {
        // if (!map.has(item.PortfolioName)) {
        map.set(item.PortfolioName, true); // set any value to Map
        if (item.SICurrency === this.details.Currency) {
          this.portfolioList.push(item.PortfolioName);
          this.accountList.push(item.AccountNo);
          this.CurrencyList.push(item.SICurrency);
        }
        // }
      }
      let portfoliolist = this.portfolioList;
      this.portfolioList = portfoliolist.filter(
        (thing, index, self) =>
          index ===
          self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
      );
      if (this.portfolioList.length !== 0) {
        this.successMsg = '';
        this.portfolio = this.portfolioList[0];
        this.Account_Number = this.accountList[0];
      }
      this.updateCustomerPortfolioDetails();
      this.updateCcy(); // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
    }
  }

  selectShareOnEnter(e) {
    try {
      this.commonApi.GetEventTarget(e);
      const ShareInfo = $('.HoverSuggestion').data('sharedata');
      this.selectShareOnClick(ShareInfo);
      // this.PortfolioChange();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShareOnClick(NoteMasterId) {
    try {
      // this.reset();
      // console.log(NoteMasterId);
      this.selectedBIndex = 0;
      this.showSuggestions = false;

      this.workflowApi.GetIndividualShareDetails(NoteMasterId); //  NoteMasterId

      // const selectedShare = this.shareList.filter(
      //   (b) => b.Note_Master_Id === NoteMasterId
      // )[0];

      // this.NoteMasterId = selectedShare.Note_Master_id;
      // this.PortfolioChange();
      const NMArray = this.shareList.filter(
        (b) => b.Note_Master_Id === NoteMasterId.toString()
      )[0];
      console.log('notemaster id=============', NMArray.Note_Master_Id);
      // this.NoteMasterId =
      // this.homeApi.BestPortfolio;

      this.portfolioList = [];
      // this.portfolioList = this.homeApi.BestPortfolio;

      //<!-- Addded by Alolika G for share selection. (order entry from rebalance) | 15-02-2022 -->
      this.currency = NMArray.Currency;
      this.workflowApi
        .GetPortfoliosFromCusID(this.CustomerID, this.currency)
        .subscribe((folio) => {
          if (folio) {
            this.portfolioList = folio.DB_GetPortfoliosResult;
            if (this.portfolioList.length > 0) {
              this.successMsg = '';
              this.portfolio = this.portfolioList[0].FacDesc;
              this.portfolioName = this.portfolioList[0].PortfolioName;
            } else {
              this.successMsg =
                'Cash account unavailable for the Fund currency';
            }

            this.updatePortfolio();
          }
        });

      //   }
      // });
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  delaySmartSearch(e) {
    try {
      if (this.timeout) {
        clearTimeout(this.timeout);
        console.log(e);
      }
      const that = this;
      this.timeout = setTimeout(() => {
        that.searchShare();
      }, 1500);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  searchShare() {
    try {
      // console.log(this.search);
      const that = this;

      if (this.search.trim().length >= 2) {
        // this.rainApi.GetShareList(this.search);

        this.workflowApi.sharelistObserver.subscribe((b) => {
          // console.log(b);
          that.shareList = b
            .filter((item) =>
              item.Product_Name.toLowerCase().includes(
                this.search.toLowerCase()
              )
            )
            .map(
              (item) =>
                (item = {
                  Currency: item.Currency,
                  Exchange: item.Exchange,
                  Feedcode: item.Feedcode,
                  Note_Master_Id: item.Note_Master_Id,
                  ProductName1: (item.Product_Name + '').trim().toLowerCase(),
                  Product_Name: (item.Product_Name + '').trim(),
                })
            );
          that.shareList = that.sort_by_key(that.shareList, 'Product_Name');
          // .sortBy('ProductName1');
          // console.log(that.shareList);
        });
      } else {
        this.shareList = [];
        this.shareList.length = 0;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  reset() {
    try {
      this.loadflag = false;
      this.successMsg = '';
      // this.side = 'Buy';
      // this.optiontype = 'Market';
      this.exchange = 'US';
      this.OrderQty = '500.00';
      this.LimitPrice = '1.5';
      this.TimeInForce = 'DAY';
      if (this.optiontype === 'Limit') {
        this.SettAmt =
          parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
      } else {
        if (this.optiontype === 'Market') {
          if (this.side === 'Buy') {
            this.SettAmt =
              this.details.AskPx * parseFloat(this.OrderQty.replace(/,/g, ''));
          } else {
            this.SettAmt =
              this.details.BidPx * parseFloat(this.OrderQty.replace(/,/g, ''));
          }
        }
      }
      this.successMsg = '';
    } catch (error) {}
  }

  validateQuantity(_e) {
    //Added by Alolika G. JIRA ANAPPDEVIN-448
    // const target = this.commonApi.GetEventTarget(e);
    // this.successMsg = '';
    let remainder;
    this.OrderQty = parseFloat(this.OrderQty.replace(/,/g, ''))
      .toFixed(2)
      .toString();
    remainder = this.OrderQty % this.details.LotSize;
    if (parseFloat(remainder) == 0.0) {
      this.lotSizeFlag = true;
    } else {
      this.lotSizeFlag = false;
    }
  }

  setAmount(e) {
    try {
      const target = this.commonApi.GetEventTarget(e);
      this.OrderQty = parseFloat(target.value.replace(/,/g, ''))
        .toFixed(2)
        .toString();
      if (this.optiontype === 'Limit') {
        this.SettAmt =
          parseFloat(target.value.replace(/,/g, '')) * this.LimitPrice;
      } else {
        if (this.optiontype === 'Market') {
          if (this.side === 'Buy') {
            this.SettAmt =
              this.details.AskPx * parseFloat(target.value.replace(/,/g, ''));
          } else {
            this.SettAmt =
              this.details.BidPx * parseFloat(target.value.replace(/,/g, ''));
          }
        }
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  async Subscribe() {
    try {
      //Added by Alolika G on 7th Feb 2022

      this.orderDetails = [];
      this.orderDetails = {
        custID: this.CustomerID,
        CRR: '',
        commissionValue: this.commissionValue,
        commissionPercentage: this.commissionPercentage,
        commissionReason: this.commissionReason,
        currency: this.details.Currency,
        custName: this.CustomerName,
        orderType: '',
        direction: this.side,
        fundingMode: this.FundMode,
        settlementAmount: this.SettAmt,
        productCode: this.details.Feedcode,
        productref: this.shareNMID,
      };
      if (this.details.Feedcode === '') {
        this.successMsg = 'Please select valid share';
        return;
      }
      if (this.OrderQty === '0' || this.OrderQty === '0.00') {
        this.successMsg = 'Please enter valid order quantity';
        return;
      }
      if (this.Account_Number === '') {
        this.successMsg = 'Please select account number.';
        return;
      }

      if (!this.lotSizeFlag) {
        this.successMsg = 'Order Quantity should be in multiples of Lot size.';
        return;
      }
      if(this.dateFlag) {
        this.successMsg = 'Please select valid date.';
        return
      }

      // Changes done by Alolika G on 28-02-2022 for Part/Full Loan -- START
      if (
        this.FundVal === 'PL' &&
        parseFloat(this.LoanAmt) >= parseFloat(this.SettAmt)
      ) {
        this.successMsg = 'Loan Amount should be less than settlement amount.';
        this.loadflag = false;
        return;
      }
      if (
        (this.FundVal === 'PL' || this.FundVal === 'TL') &&
        parseFloat(this.fnGetLoanAmt()) >= parseFloat(this.fnGetDrawdown())
      ) {
        //Added by Alolika G on 3rd Feb 2022. Assigned by by Prachi P
        // if(parseFloat(this.fnGetLoanAmt()) >= parseFloat(this.fnGetDrawdown())) {
        this.successMsg =
          'Loan amount cannot be greater than available for drawdown.';
        this.loadflag = false;
        return;
        // }
      }
      if (
        (this.FundVal === 'PL' || this.FundVal === 'TL') &&
        parseFloat(this.fnGetLoanAmt()) <= 0
      ) {
        this.successMsg = 'Please enter the Loan Amount.';
        this.loadflag = false;
        return;
      }
      this.loadflag = true;
      // let ClientContribution: any = '';
      this.bankContribution = '';
      if (this.FundVal === 'TL') {
        this.bankContribution = this.SettAmt.toFixed(2);
        // ClientContribution = '0.00';
      } else if (this.FundVal === 'PL') {
        this.bankContribution = this.fnGetLoanAmt();
        // ClientContribution = parseFloat(notional) - parseFloat(this.fnGetLoanAmt());
      } else {
        this.bankContribution = '0.00';
        // ClientContribution = notional;
        this.LoanTenor = '';
      }
      // console.log(this.bankContribution);
      // Changes done by Alolika G on 28-02-2022 for Part/Full Loan -- START

      if (this.btnname === 'Subscribe') {
        if (this.checkSuitability) {
          //Added by Alolika G on 8th Feb 2022
          const isSuitabilityValid: boolean = await this.checkOrderSuitability(
            this.orderDetails
          );
          console.log(isSuitabilityValid);
          this.workflowApi.SubscribeEquities(
            this.details.Feedcode,
            this.side,
            this.details.Currency,
            // this.details.TradeDate,
            this.tradeDate,
            // this.businessDate,
            this.SettlementType,
            this.settlementDate,
            // this.details.SettlementDate,
            this.optiontype,
            this.optiontype === 'Limit'
              ? this.LimitPrice
              : this.side === 'Buy'
              ? this.details.AskPx
              : this.details.BidPx,
            this.TimeInForce,
            // this.details.TradeDate,
            this.expiryDate,
            this.OrderQty.replace(/,/g, ''),
            this.details.Exchange,
            this.portfolio, // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
            //this.portfolio,
            this.CustomerName,
            this.RMName,
            this.Account_Number,
            this.CustomerID,
            this.SettAmt.toFixed(2),
            // Changes done by Alolika G on 28-02-2022
            this.bankContribution,
            this.FundMode,
            this.LoanTenor
          );
        } else {
          this.workflowApi.SubscribeEquities(
            this.details.Feedcode,
            this.side,
            this.details.Currency,
            // this.details.TradeDate,
            this.tradeDate,
            // this.businessDate,
            this.SettlementType,
            this.settlementDate,
            this.optiontype,
            this.optiontype === 'Limit'
              ? this.LimitPrice
              : this.side === 'Buy'
              ? this.details.AskPx
              : this.details.BidPx,
            this.TimeInForce,
            // this.details.TradeDate,
            this.expiryDate,
            this.OrderQty.replace(/,/g, ''),
            this.details.Exchange,
            this.facilityCode, // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
            //this.portfolio,
            this.CustomerName,
            this.RMName,
            this.Account_Number,
            this.CustomerID,
            this.SettAmt.toFixed(2),
            // Changes done by Alolika G on 28-02-2022
            this.bankContribution,
            this.FundMode,
            this.LoanTenor
          );
        }

        // this.workflowApi.eqsubscribeObserver.subscribe((res: any) => {
        //   if (res.length === 0) {
        //   } else {
        //     if (res.FinIQResponseHeader.Status === 'Failed') {
        //       this.loadflag = false;
        //       this.successMsg =
        //         res.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Description;
        //     } else {
        //       this.loadflag = false;
        //       this.OrderID = res.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
        //       this.successMsg =
        //         'Order placed successfully with Ref No. ' + this.OrderID;
        //       this.scrollWin();
        //     }
        //   }

        // });
      } else if (this.btnname === 'Amend') {
        // console.log('amend')
        this.workflowApi.AmendShareOrder(
          this.OID,
          this.OrderQty.replace(/,/g, ''),
          this.SettAmt,
          this.RMName,
          this.RMName,
          this.Remark,
          this.portfolio,
          this.username
        );
      } else if (this.btnname === 'Cancel') {
        // console.log('cancel')
        this.workflowApi.CancelShareOrder(
          this.expiryDate,
          this.clorId,
          this.Remark,
          'CANCEL',
          this.username
        );
      }
    } catch (error) {}
  }

  placeBackdatedOrder() {
    try {
      if(!this.backdated) {
        this.tradeDate = this.businessDate;
      }
    } catch (error) {
      
    }
  }

  selectDate(date) {
    try {
      this.tradeDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
      this.validateDate();
      this.GetDates();
    } catch (error) { }
  }

  validateDate() {
    this.dateFlag = false;
    const custStartDate = this.datepipe.transform(this.tradeDate, 'yyyy-MM-dd');
    const custEndDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    if (custEndDate < custStartDate) {
      // console.log('Validate*******************88');
      this.successMsg = 'Please enter valid date.';
      // this.tradeDate = this.businessDate;
      this.dateFlag = true;
    } else {
      this.dateFlag = false;
    }
  }

  GetDates() {
    try {
      if (this.TimeInForce.toUpperCase() === 'DAY') {
        this.GetNextTradedate();
      }
    } catch (error) {

    }
  }

  GetNextTradedate() {
    try {
      let response: any = [];
      this.workflowApi.GetHolidayCalender_Records(this.details.Exchange, "ALL", this.tradeDate, this.tradeDate).subscribe((res: any) => {
        if (res) {
          response = res;
          if (res.length > 0) {
            const d = new Date(this.tradeDate);
            d.setDate(d.getDate() + 1);
            this.tradeDate =
              (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
              '-' +
              this.months[d.getMonth()] +
              '-' +
              d.getFullYear();
          }
        }
        this.GetSettlementDate();
      })
    } catch (error) {

    }
  }

  GetSettlementDate() {
    try {
      this.workflowApi.GetMaturityDateUsingBusinessDays(this.tradeDate, this.SettlementType, this.details.Currency).subscribe(res => {
        if(res) {
          this.settlementDate = res.GetMaturityDateUsingBusinessDaysResult;
        }
      })
    } catch (error) {
      
    }
  }

  //   Subscribe() {
  //   const d1 = new Date();
  //   try {
  //     if (this.Account_Number === '') {
  //       this.successMsg = 'Please select account number.';
  //     } else if (this.ClientPrice > 0 && this.successMsg === '') {
  //       if(this.btnname === 'Subscribe'){
  //       this.workflowApi.getbondsubscribe(this.selectedBond.ISIN, this.selectedBond.Currency, this.side, this.nominal, this.settlementDate,
  //         '' + (this.spread), this.AccInt, this.SettAmt, this.tradeDate, this.settlementType, this.tradeDate, this.selectedBond.PriceType,
  //         (parseInt(this.selectedBond.FaceValue, 10) * 0.098) + '', this.DirtyPrice, this.CleanPrice,
  //         this.YTM, this.Proceeds, this.BankPNL, this.portfolio, this.OrderType === 'market' ? '' : this.TimeInForce, this.OrderType, this.selectedBond.NoteMasterID, this.CustDirtyPrice, this.CustCleanPrice,
  //         this.MarketCleanPrice, this.MarketDirtyPrice, this.YTC, this.YTP, this.YTConv, this.username, this.CustomerName, this.Account_Number);
  //       } else if(this.btnname === 'Amend'){
  //         this.workflowApi.AmendBondOrder(this.username,this.clorId, this.nominal,this.OrderType,'',this.TimeInForce,this.expiryDate,this.spread,'Y','N',100,this.Remark,this.CIF,this.portfolio,this.portfolioAccount[0][1]);
  //       } else if(this.btnname === 'Cancel Order'){
  //         this.workflowApi.CancelBondOrder(this.username, this.clorId, this.Remark);
  //       }

  //     } else {
  //       this.successMsg = 'Please calculate the client price.';
  //     }

  //   }
  //   catch (error) {
  //     console.log('Error:', error);
  //   }
  // }
  scrollWin() {
    try {
      window.scrollTo(0, 1000);
      this.orderflag = true;
      // this.fnShareBlotter();
    } catch (error) {}
  }
  sideChange() {
    // console.log('side:', this.side);
    if (this.optiontype === 'Limit') {
      this.SettAmt =
        parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
    } else {
      if (this.optiontype === 'Market') {
        if (this.side === 'Buy') {
          this.SettAmt =
            this.details.AskPx * parseFloat(this.OrderQty.replace(/,/g, ''));
        } else {
          this.SettAmt =
            this.details.BidPx * parseFloat(this.OrderQty.replace(/,/g, ''));
        }
      }
    }
  }
  changeAmount(e) {
    this.SettAmt =
      parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
    console.log(e);
  }

  ordertypechange() {
    if (this.optiontype === 'Limit') {
      this.SettAmt =
        parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
    } else {
      if (this.optiontype === 'Market') {
        if (this.side === 'Buy') {
          this.SettAmt =
            this.details.AskPx * parseFloat(this.OrderQty.replace(/,/g, ''));
        } else {
          this.SettAmt =
            this.details.BidPx * parseFloat(this.OrderQty.replace(/,/g, ''));
        }
      }
      // console.log('settlment amt:', this.SettAmt);
    }
  }
  selectShare1(e) {
    try {
      console.log(e);

      const fund = $('.HoverSuggestion').data('mf');
      this.selectShare(fund);
      this.successMsg = '';
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  selectShare(e) {
    console.log(e);
  }
  ChangeIndex(e) {
    try {
      this.selectedMFIndex = 0;
      this.selectedMFIndex1 = 0;
      this.selectedMFIndex2 = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      console.log(e);
    } catch (Error) {}
  }
  onClickedOutside(e: Event) {
    try {
      this.showSuggestions = false;
      console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
      // this.PortfolioChange();
    } else {
      this.moredetails = 'More Details';
      // this.PortfolioChange();
    }
  }

  selectedCustomerValue(e) {
    // console.log(e);
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;

    this.portfolioList = this.homeApi.BestPortfolio;
    if (this.portfolioList.length > 0) {
      this.successMsg = '';
      // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
      for (let i = 0; i < this.portfolioList.length; i++) {
        this.portfolio = this.portfolioList[i].FacilityCode;
        this.facilityCode = this.portfolioList[i].FacilityCode;
      }
    } else {
      this.successMsg = 'Cash account unavailable for the Share currency';
    }
    this.updatePortfolio();
  }
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  // Added by Rohit T. | 04-Feb-2021
  openSuitablityPopup() {
    // console.log(this.noteMasterId)
    // console.log(this.auth.UserName)
    // console.log(this.auth.EntityID)
    this.sut_notemaster = this.note_Master_Id;
    if (this.note_Master_Id !== '')
      this.showSuitabilityPopup = !this.showSuitabilityPopup;
    // this.afs.checkSuitability(this.noteMasterId, this.auth.UserName, this.auth.EntityID).subscribe((res) => {

    //   if (res.length !== 0) {
    //     console.log(res)
    //   }
    // });
  }
  closeSuitablityPopup() {
    this.note_Master_Id = '';
    this.showSuitabilityPopup = !this.showSuitabilityPopup;
  }
  //Added by Alolika G on 7th Feb 2022
  async checkOrderSuitability(order) {
    try {
      //Added by Alolika G on 25th Feb 2022 (same as bulk order)
      // order.PRR = 'R3';
      // let PRR = 'R5';
      switch (order.productref) {
        case '1688': //Netflix
          order.PRR = 'P3';
          break;
        case '5432': //"Starbucks Corporation"
          order.PRR = 'P3';
          break;
        case '2061': //Intel Corp
          order.PRR = 'P3';
          break;
        default:
          order.PRR = 'P3';
          break;
      }
      const res = await this.workflowApi.checkSuitability(order);
      // console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      this.NMID_Suitability = res.NMID;
      this.token = res.SUITABILITY_TOKEN_COUNT;
      this.note_Master_Id = this.NMID_Suitability;

      // res.SUITABILITY_TOKEN_COUNT.split('|').forEach((token) => {
      //   if (!!token) {
      //     order.suitabiltyTable.push(token.split(':')[3]);
      //   }
      // });
      // console.log(order.suitabiltyTable);

      // if (!order.isSuitabilityValid) {
      //   order.isLoading = false;
      //   order.message = 'Suitability Check Failed';
      //   order.isValid = false;
      //   order.isError = true;
      //   // order.isSuitabilityValid = false;
      //   return false;
      // }
      // order.isSuitabilityValid = true;
      return true;
    } catch (error) {}
  }

  //Added by Alolika G on 25th Feb 2022 --START
  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.CashBalance = '';
      this.workflowApi
        .getCashbalanceFromAccountNumber(
          this.details.Currency,
          this.Account_Number
        )
        .subscribe((res) => {
          if (res) {
            if (
              parseFloat(this.SettAmt) <=
              parseFloat(res.ExecGenericScalarFunctionResult)
            ) {
              this.balanceFlag = true;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
              return;
            } else {
              this.balanceFlag = false;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
            }
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  fnGetCashBalance() {
    return this.CashBalance.replace(/,/g, '');
  }
  fnGetLoanAmt() {
    return this.LoanAmt.replace(/,/g, '');
  }
  fnGetDrawdown() {
    return this.Drawdown.replace(/,/g, '');
  }
  //Added by Alolika G on 25th Feb 2022 --END
}
