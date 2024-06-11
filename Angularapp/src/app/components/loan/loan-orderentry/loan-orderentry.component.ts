import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

@Component({
  selector: 'app-loan-orderentry',
  templateUrl: './loan-orderentry.component.html',
  styleUrls: ['./loan-orderentry.component.scss'],
})
export class LoanOrderentryComponent implements OnInit {
  isProd = environment.production;
  currencyList = [];

  loanCurrency: string;
  loanAmount: string;
  baseLendingRate: string;
  paymentTenor: string;
  loanLimit: string;
  agreementDate: string;
  utilizationDate: string;
  firstDrawdownDate: string;
  portfolioID: string;
  accountType: string;
  accountNumber: string;
  moredetails: string;
  loadflag: boolean;
  successMsg: string;
  clientName: string | null;
  CIF: string;
  parentRIF: string;
  stringXML = '';
  username: string | null;
  portfolioList = [];
  AccountTypeList = [];
  totalaccounts = [];
  RePayaccounts = [];
  portfolioCcyList = [];
  portfolioAccount = [];
  portfolioCurrency: string;
  multiportfoliodata: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;
  LoadMultipleAccounts = true;
  loanAccountDetails: any;
  accountList = [];
  ccy = [];
  details: any = {};
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string | null;
  CurrencyList = [];
  showSubmit: boolean;
  constructor(
    public ref: ChangeDetectorRef,
    public cfs: CommonApiService,
    private api: CustomerApiService,
    private afs: WorkflowApiService
  ) {
    this.loanCurrency = 'AUD';
    this.loanAmount = '1,000,000.00';
    this.baseLendingRate = '2.1500';
    this.paymentTenor = 'Monthly';
    this.loanLimit = '25,000,000.00';
    this.agreementDate = moment().format('DD-MMM-YYYY');
    this.utilizationDate = this.agreementDate;
    this.firstDrawdownDate = this.agreementDate;

    this.username = sessionStorage.getItem('Username');
    this.userType = null;
    this.moredetails = 'More Details';
    this.successMsg = '';
    this.loadflag = false;
    this.clientName = sessionStorage.getItem('CustomerNamemisc1');

    this.details = {
      Currency: '',
    };

    this.loanAccountDetails = [];
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType?.toUpperCase().includes('RM') ? true : false;
    this.afs.getmultiPortfolio(this.username);
    this.api.fngetCustAccountDetails(this.username);
    this.getCurrencyPairs();

    this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          if (Object.keys(res).length === 0 && res.constructor === Object) {
          } else {
            if (res.message === 'No record(s) found') {
              console.log('Loans No record(s) found');
            } else {
              res = res.message;
              const result = [];
              this.portfolioCcyList = [];
              for (const item of res) {
                if (item.portfolio) {
                  result.push({
                    portfolio: item.portfolio,
                    ccy1: item.Accountcurrency,
                    cif: item.CIF,
                    accType: item.accounttype,
                  });
                  this.portfolioCcyList.push(item.Accountcurrency);
                }
                // }
              }
              this.loanAccountDetails = result;
              this.CIF = result[0].cif;
              this.portfolioList = [];
              result.forEach((element) => {
                this.portfolioList.push(element.portfolio);
              });
              this.portfolioAccount = [];
              res.forEach((element) => {
                if (element.portfolio) {
                  this.portfolioAccount.push([
                    element.portfolio,
                    element.accountnumber,
                    element.Accountcurrency,
                  ]);
                }
              });
              // this.CustomerName = res[0].misc1;
              this.portfolioID = this.portfolioList[0];
              this.accountNumber = this.portfolioAccount[0][1];
              this.loanCurrency = this.portfolioAccount[0][2];
              this.ref.detectChanges();
              this.PortfolioChange();
              this.ChangeSelectedportfolio();
            }
          }
        }
      }
    );

    this.api.loanOrderObserver.subscribe((res) => {
      if (res === undefined) {
      } else {
        if (res.length !== 0) {
          // console.log(res);
          this.loadflag = false;
          this.successMsg =
            'Order placed successfully. Order Ref No.: ' +
            res.SaveUCPResult[0].NoteMasterID;
        }
      }
    });

    this.api.getCustAccountDetails.subscribe((res) => {
      if (res === undefined) {
      } else {
        if (res.length !== 0) {
          // console.log(res);
          this.accountType = res.accounttype;
        }
      }
    });

    this.api.allTradablePairObserver.subscribe((res: any) => {
      if (res) {
        this.currencyList = [];
        const map = new Map();
        // const obj = JSON.parse(res);
        res.forEach((element) => {
          map.set('' + element.Asset1, element.Asset1);
          map.set('' + element.Asset2, element.Asset2);
        });
        this.currencyList = Array.from(map.keys()).sort();
        // console.log(this.currencyList);
        this.loanCurrency = 'AUD';
      }
    });
  }

  updateCustomerPortfolioDetails() {
    this.accountList = [];
    this.CurrencyList = [];
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.PortfolioName === this.portfolioID;
    });
    temp.forEach((element) => {
      this.accountList.push(element.AccountNo);
      this.CurrencyList.push(element.SICurrency);
    });
    this.loanAccountDetails = this.accountList[0];
    // this.currency = this.data.Ccy = this.CurrencyList[0];
    this.updateCcy();
    this.ChangeSelectedportfolio();
  }

  updateCcy() {
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.AccountNo === this.accountNumber;
    });
    this.loanCurrency = temp[0].SICurrency;
  }

  getCustomerDetails(res) {
    this.portfolioList = [];
    if (res.length > 0) {
      this.selectedCustomerDetails = res;
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.PortfolioName)) {
          map.set(item.PortfolioName, true); // set any value to Map
          this.portfolioList.push(item.PortfolioName);
        }
      }
      this.portfolioID = this.portfolioList[0];
      this.updateCustomerPortfolioDetails();
    }
  }

  filterCcy() {
    this.totalaccounts.forEach((ele) => {
      if (this.accountNumber === ele.accountnumber) {
        this.loanCurrency = ele.Accountcurrency;
      }
    });
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  clearBtn(_e) {
    this.successMsg = '';
  }

  selectDate(date) {
    this.agreementDate = moment(date).format('DD-MMM-YYYY');
    this.utilizationDate = this.agreementDate;
    this.firstDrawdownDate = this.agreementDate;
  }

  PortfolioChange() {
    this.accountList = [];
    this.ccy = [];
    this.portfolioList = [];
    this.accountList = [];
    this.successMsg = '';
    this.showSubmit = true;
    // this.loanCurrency = 'AUD';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.portfolioAccount.length; i++) {
      if (this.portfolioAccount[i][2] === this.loanCurrency) {
        this.portfolioList.push(this.portfolioAccount[i][0]);
        this.accountList.push(this.portfolioAccount[i][1]);

        // this.accountList.push(this.portfolioAccount[i][1]);
        // this.ccy.push(this.portfolioAccount[i][2]);
      }
    }
    if (this.portfolioList.length !== 0) {
      this.successMsg = '';
      this.portfolioID = this.portfolioList[0];
      this.accountNumber = this.accountList[0];
    } else {
      this.successMsg =
        'Portfolio with selected Currency is not available. Please select different Currency.';
      this.showSubmit = false;
    }
  }

  ChangeSelectedportfolio() {
    this.portfolioCcyList = [];
    this.AccountTypeList = [];
    for (let i = 0; i < this.portfolioList.length; i++) {
      if (this.portfolioList[i] === this.portfolioID) {
        this.accountNumber = this.accountList[i];
      }
    }
    this.portfolioCcyList = this.loanAccountDetails
      .filter((e) => e.portfolio === this.portfolioID)
      .map((e) => e.ccy1);
    this.AccountTypeList = this.loanAccountDetails
      .filter((e) => e.portfolio === this.portfolioID)
      .map((e) => e.accType);

    if (this.accountNumber === '') {
      this.successMsg =
        'Portfolio with selected Currency is not available. Please select Currency.';
      this.showSubmit = false;
    }
  }

  getCurrencyPairs() {
    this.api.GetAllTradableCurrency();
  }

  OrderSubmit() {
    this.loadflag = true;
    const templateCode = 'Term_Loan_R';
    const mode = 'Insert';
    const noteMasterId = 0;
    this.successMsg = '';
    this.stringXML = '<dtDataFromXML>';
    this.stringXML =
      this.stringXML +
      '<Account_Number>' +
      this.accountNumber +
      '</Account_Number>';
    this.stringXML = this.stringXML + '<HEDGING_TYPE>POOLING</HEDGING_TYPE>';
    this.stringXML =
      this.stringXML + '<Account_Type>' + this.accountType + '</Account_Type>';
    this.stringXML =
      this.stringXML +
      '<Portfolio_Name>' +
      this.portfolioID +
      '</Portfolio_Name>';
    this.stringXML =
      this.stringXML + '<ClientName>' + this.clientName + '</ClientName>';
    this.stringXML =
      this.stringXML + '<Currency>' + this.loanCurrency + '</Currency>';
    this.stringXML =
      this.stringXML +
      '<Notional_Amt>' +
      this.cfs.UnformatNumberwithoutevent(this.loanAmount) +
      '</Notional_Amt>';
    this.stringXML =
      this.stringXML +
      '<FixedInterestRate>' +
      this.baseLendingRate +
      '</FixedInterestRate>';
    this.stringXML =
      this.stringXML +
      '<LoanAgreementDate>' +
      this.agreementDate +
      '</LoanAgreementDate>';
    this.stringXML =
      this.stringXML + '<LoanTenor>' + this.paymentTenor + '</LoanTenor>';
    this.stringXML =
      this.stringXML +
      '<FirstUtilizationDate>' +
      this.utilizationDate +
      '</FirstUtilizationDate>';
    this.stringXML =
      this.stringXML +
      '<FirstDrawdownDate>' +
      this.firstDrawdownDate +
      '</FirstDrawdownDate>';
    this.stringXML = this.stringXML + '<CIF>' + this.CIF + '</CIF>';
    // this.stringXML = this.stringXML + '<ParentRef>' + this.parentRIF + '</ParentRef>';
    this.stringXML = this.stringXML + '</dtDataFromXML>';

    console.log('Loan Entry', this.stringXML);
    // this.api.saveCashDeposits(this.stringXML, sessionStorage.getItem('Username'), 'RIS_Setup');
    this.api.saveLoanOrder(
      this.stringXML,
      this.username,
      templateCode,
      mode,
      noteMasterId
    );
  }
}
