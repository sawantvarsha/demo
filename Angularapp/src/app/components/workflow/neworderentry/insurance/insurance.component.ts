import { Component, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { HomeApiService } from 'src/app/services/home-api.service';
declare var require: any;
declare var require: any;
const $: any = require('jquery');
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
})
export class InsuranceComponent implements OnInit, OnDestroy {
  @Input() displaySearch: boolean;
  isProd = environment.production;
  successMsg: any;
  moredetails: any;
  loadflag: boolean;
  // multiportfoliodata: Subscription;
  username: string;
  portfolioList = [];
  portfolioAccount = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  Account_Name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  Account_Number: string;
  CustomerName: any;
  CustomerID: any;
  portfolio: string;
  accountList: any[];
  ccy: any[];
  currency: any;

  // Insurance
  ApplicationID: any;
  res: any;
  Currency: string;
  InsurancePremium: any;
  InsurancePremiumForCalc: any;
  SumAssured: any;
  ProductRisk: string;
  ProductCode: string;
  ProductName: string;
  ProductCodeArray: any[];
  Method: string;
  Remark: string;
  ProductDetails: any[];
  SearchProd: string;
  selectedProdIndex = 0;
  show: boolean;
  showWorkflow: boolean;
  INSTradeList: any;
  hours1: any;
  ampm: any;
  min1: any;
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
  orderTime: any;
  commenceDate: any;
  rainApi: any;
  policyTerm: any;
  paymentTerm: any;
  // CommencementDate: any;
  paymentFreq: any;

  selectedBIndex = 0;
  search: any;
  showSuggestions = false;
  shareList: any[];
  selectedShare: any;
  todaydate: any;
  SumAssuredForCalc: any;
  msg: string;

  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  CurrencyList = [];
  showSubmit: boolean;
  popUpflag: boolean;
  enablePortfolio = true;
  suitabilityCheckData = {
    Parameter: '',
    CIF: '',
    EligibleYN: '',
    Reason: '',
    Ref: '',
    Override: false,
  };

  finalSuitabilityData = [];
  suitabilityStatus = '';
  RMName: any;
  remainingBalance: string;
  balanceFlag: boolean;
  constructor(
    public com: CommonApiService,
    private api: WorkflowApiService,
    public elem: ElementRef,
    public homeapi: HomeApiService
  ) {
    this.moredetails = 'More Details';
    this.Method = 'Cash';
    this.Currency = 'AUD';
    this.paymentFreq = 'Annually';
    this.policyTerm = '1Y';
    this.paymentTerm = '1Y';
    this.ProductRisk = '';
    this.shareList = [];
    this.search = '';
    this.ApplicationID = '';
    this.SumAssured = '1,000,000.00';
    this.InsurancePremium = '1,000';
    this.todaydate = new Date();
    this.showSubmit = false;
  }
  ngOnDestroy() {
    // this.api.multiportfolio.next([]);
    // this.multiportfoliodata.unsubscribe();
    this.successMsg = '';
    this.selectedCustomerDetails = [];
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';
    // console.log('destroy');
  }
  ngOnInit(): void {
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }
    this.commenceDate = this.getDateInStdFormat(this.todaydate);
    this.api.getInsuranceList();
    this.api.insurancelistObserver.subscribe((res: any) => {
      if (res) {
        this.shareList = res.getProductDetailsResult;
        //console.log('insurance list', this.shareList);
      }
    });

    this.username = sessionStorage.getItem('Username');
    if (!this.isUserRM) {
      this.CustomerID = this.homeapi.CustomerId;
      this.CustomerName = this.homeapi.CustomerName;
    }

    // this.api.getmultiPortfolio(this.username);
    // if (!this.isUserRM) {
    //   this.api.getmultiPortfolio(this.username);
    // }
    // this.multiportfoliodata = this.api.multiportfolioObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     // if (Object.keys(res).length === 0 && res.constructor === Object) {

    //     // }
    //     if (res.status === false) {
    //       this.successMsg = 'Account details not available';
    //     }else {
    //       //console.log(res);
    //       // res.forEach(element => {
    //       const result = [];
    //       const map = new Map();
    //       for (const item of res.message) {
    //         if (!map.has(item.portfolio)) {
    //           map.set(item.portfolio, true); // set any value to Map
    //           result.push({
    //             portfolio: item.portfolio,
    //             ccy1: item.Accountcurrency
    //           });
    //         }
    //       }

    //       this.portfolioList = [];
    //       result.forEach(element => {
    //         this.portfolioList.push(element.portfolio);
    //       });
    //       //console.log(this.portfolioList);
    //       // });
    //     }
    //     this.portfolioAccount = [];
    //     res.message.forEach(element => {
    //       this.portfolioAccount.push([element.portfolio, element.accountnumber, element.Accountcurrency, element.AvailableBalance]);
    //     });
    //     this.CustomerName = res.message[0].misc1;
    //     this.CustomerID = res.message[0].CustomerID;
    //     this.portfolio = this.portfolioList[0];
    //     this.RMName = res.message[0].RM;
    //     this.Account_Number = this.portfolioAccount[0][1];
    //     this.currency = this.portfolioAccount[0][2];
    //     if (!this.isUserRM) this.PortfolioChange();
    //     else {
    //       // this.getPortfolioFromFund();
    //       this.updateCustomerPortfolioDetails();

    //     }
    //     //console.log(this.portfolioAccount);
    //     this.api.GetsuitabilityCheckData(this.CustomerName, this.CustomerID, this.username);
    //   }
    // });

    this.api.insAppIDObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        // console.log(res);
        this.ApplicationID = res.getINSApplicationIDResult[0].APPID;
      } else {
        //console.log('NO iNS applicationID');
      }
    });

    this.api.resInsuranceObserver.subscribe((res: any) => {
      // this.loadflag = true;
      this.successMsg = '';
      if (res.Status) {
        this.loadflag = false;
        this.successMsg = '';
        if (res.Status[0] === 'SUCCESS') {
          // console.log(res);
          this.successMsg =
            'Order placed succesfully with Ref ID:' + res.NoteMasterID[0];
        } else {
          this.successMsg = 'Order Rejected: ' + res.Status[0];
        }
      }
    });
    this.com.selectedAssetObserver.subscribe((res) => {
      if (res.length !== 0) {
        // this.shareList.filter(b => b.Product_Code.includes(res))[0];
        this.selectShare(res);
      }
    });

    this.api.suitabilityCheck.subscribe((res) => {
      if (res.length !== 0) {
        const arr =
          res.CustomerSuitabilityResponse.Eligibility[0]['a:Eligibility'];

        this.suitabilityStatus = res.CustomerSuitabilityResponse.Status[0];
        this.finalSuitabilityData = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          this.suitabilityCheckData.Parameter = arr[i]['a:Parameters'];
          this.suitabilityCheckData.CIF = arr[i]['a:CIFA'];
          this.suitabilityCheckData.EligibleYN = arr[i]['a:Eligible_YN'];
          this.suitabilityCheckData.Reason = arr[i]['a:Failed_Reason'];
          this.suitabilityCheckData.Ref = arr[i]['a:ColumnName'];
          //console.log(arr[i]['a:AC_Overrided_YN'][0].toUpperCase());
          if (arr[i]['a:AC_Overrided_YN'][0].toUpperCase() === 'Y') {
            this.suitabilityCheckData.Override = false;
          } else {
            this.suitabilityCheckData.Override = true;
          }

          this.finalSuitabilityData.push(this.suitabilityCheckData);
          this.suitabilityCheckData = {
            Parameter: '',
            CIF: '',
            EligibleYN: '',
            Reason: '',
            Ref: '',
            Override: false,
          };
        }
        //console.log(this.finalSuitabilityData);
      }
    });
  }

  getDateInStdFormat(d: any) {
    d = d.toString().split(' ');
    d = d[2] + '-' + d[1] + '-' + d[3];
    // console.log(d);
    return d;
  }

  updatePortfolio() {
    // if (this.isUserRM) {
    //   this.updateCustomerPortfolioDetails();
    // } else {
    //   this.ChangeSelectedportfolio();
    // }
    this.api
      .getAccountNumberFromPortfolioGeneric(
        this.CustomerID,
        this.portfolio,
        this.Currency
      )
      .subscribe((res) => {
        if (res) {
          this.accountList = [];
          this.accountList = res.ExecGenericTableValuedFunctionResult;
          this.Account_Number = this.accountList[0].Param1;
          this.showSubmit = true;
          this.cashBalance();
        }
      });
  }

  // getPortfolioFromFund() {
  //   this.portfolioList = [];
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   const temp: any = this.selectedCustomerDetails.filter(obj => {
  //     return obj.SICurrency === this.Currency;
  //   });

  //   if (temp.length) {
  //     temp.forEach(element => {
  //       this.portfolioList.push(element.PortfolioName);
  //       this.accountList.push(element.AccountNo);
  //       this.CurrencyList.push(this.Currency);
  //     });

  //     let portfoliolist = this.portfolioList;
  //     this.portfolioList = portfoliolist.filter((thing, index, self) =>
  //       index === self.findIndex((t) => (
  //         JSON.stringify(t) === JSON.stringify(thing)
  //       ))
  //     );

  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];
  //     // this.portfolio = temp[0].PortfolioName

  //   } else {
  //     this.successMsg = 'Portfolio with selected fund currency is not available. Please select different fund';
  //     this.showSubmit = false;
  //   }
  // }

  // updateCustomerPortfolioDetails() {
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   console.log('Update ccy: ', this.currency);
  //   const temp: any = this.selectedCustomerDetails.filter(obj => {
  //     return obj.PortfolioName === this.portfolio;
  //   }
  //   );
  //   temp.forEach(element => {
  //     this.accountList.push(element.AccountNo);
  //     this.CurrencyList.push(element.SICurrency);
  //   });
  //   this.Account_Number = this.accountList[0];
  //   // this.currency = this.Currency = this.CurrencyList[0];
  //   this.updateCcy();
  //   // this.ChangeSelectedportfolio();
  // }

  // updateCustomerPortfolioDetails() {
  //   // for (let i = 0; i < this.CurrencyList.length; i++) {
  //   //   if (this.CurrencyList[i] === this.selectedBond.Currency) {
  //   //     this.portfolio = this.portfolioList[i];
  //   //     this.Account_Number = this.accountList[i];
  //   //     // this.accountList.push(this.portfolioAccount[i][1]);
  //   //     // this.ccy.push(this.portfolioAccount[i][2]);
  //   //   }
  //   // }
  //   this.accountList = [];
  //   const temp: any = this.selectedCustomerDetails.filter((obj) => {
  //     return obj.PortfolioName === this.portfolio;
  //   });
  //   temp.forEach((element) => {
  //     if (this.selectedShare.Currency === element.SICurrency) {
  //       this.accountList.push(element.AccountNo);
  //       this.CurrencyList.push(element.SICurrency);
  //     }
  //   });
  //   this.Account_Number = this.accountList[0];
  //   if (this.portfolioList.length !== 0) {
  //     this.successMsg = '';
  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];
  //   } else {
  //     this.successMsg =
  //       'Portfolio with selected insurance currency is not available. Please select different insurance';
  //   }
  // }

  // updateCcy() {
  //   // console.log('Update ccy: ', this.currency);
  //   const temp: any = this.selectedCustomerDetails.filter(obj => {
  //     return obj.AccountNo === this.Account_Number;
  //   }
  //   );
  //   if (temp.length) {
  //     temp.forEach(element => {
  //       if (this.selectedShare.Currency === element.SICurrency) {
  //         this.currency = element.SICurrency;
  //       }
  //     });
  //     // this.currency = this.Currency = temp[0].SICurrency;
  //   }

  // }

  // getCustomerDetails(res) {
  //   if (res.length > 0) {
  //     this.portfolioList = [];
  //     this.selectedCustomerDetails = res;
  //     const map = new Map();
  //     for (const item of res) {
  //       // if (!map.has(item.PortfolioName)) {
  //       map.set(item.PortfolioName, true); // set any value to Map
  //       if (item.SICurrency === this.selectedShare.Currency) {

  //         this.portfolioList.push(item.PortfolioName);
  //         this.accountList.push(item.AccountNo);
  //         this.CurrencyList.push(item.SICurrency);
  //       }
  //       // }
  //     }
  //     let portfoliolist = this.portfolioList;
  //     this.portfolioList = portfoliolist.filter((thing, index, self) =>
  //       index === self.findIndex((t) => (
  //         JSON.stringify(t) === JSON.stringify(thing)
  //       ))
  //     );
  //     if (this.portfolioList.length !== 0) {
  //       this.successMsg = '';
  //       this.portfolio = this.portfolioList[0];
  //       this.Account_Number = this.accountList[0];
  //     }
  //     this.updateCustomerPortfolioDetails();
  //   }

  // }

  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.remainingBalance = '';
      this.api
        .getCashbalanceFromAccountNumber(this.Currency, this.Account_Number)
        .subscribe((res) => {
          if (res) {
            if (
              parseFloat(this.InsurancePremium) <=
              res.ExecGenericScalarFunctionResult
            ) {
              this.balanceFlag = true;
              this.remainingBalance = res.ExecGenericScalarFunctionResult;
              return;
            } else {
              this.balanceFlag = false;
              this.remainingBalance = res.ExecGenericScalarFunctionResult;
            }
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  addPolicy() {
    try {
      this.cashBalance();
      this.successMsg = '';
      if (this.ProductName === '') {
        this.successMsg = 'Please enter Product Name';
      } else if (
        this.ApplicationID === '' ||
        typeof this.ApplicationID === undefined
      ) {
        this.successMsg = 'Please enter Application No.';
      } else if (parseFloat(this.SumAssured) <= 0) {
        this.successMsg = 'Please enter Sum Asssured.';
      } else if (this.Account_Number === '') {
        this.successMsg = 'Please select account number.';
        // }
        // else if (parseFloat(this.com.UnformatNumberwithoutevent(this.SumAssured)) >= parseFloat(this.com.UnformatNumberwithoutevent(this.InsurancePremium))) {
        //   this.successMsg = 'Please select valid premium';
      } else {
        this.successMsg = '';
        this.loadflag = true;
        if (this.SumAssured.includes(',')) {
          this.SumAssuredForCalc = this.com.UnformatNumberwithoutevent(
            this.SumAssured
          );
        } else {
          this.SumAssuredForCalc = this.SumAssured;
        }
        let sum = this.SumAssuredForCalc + '';
        let lensum = (this.SumAssuredForCalc + '').length;
        while (lensum < 30) {
          sum = '0' + sum;
          lensum++;
        }
        if (this.InsurancePremium.includes(',')) {
          this.InsurancePremiumForCalc = this.com.UnformatNumberwithoutevent(
            this.InsurancePremium
          );
        } else {
          this.InsurancePremiumForCalc = this.InsurancePremium;
        }
        let premium = this.InsurancePremiumForCalc + '';
        let lenpremium = (this.InsurancePremiumForCalc + '').length;
        while (lenpremium < 30) {
          premium = '0' + premium;
          lenpremium++;
        }
        // console.log( premium.length , premium);
        // premium was 30times 0 before; '000000000000000000000000000000'
        // console.log(this.ApplicationID, this.Currency, premium.length, sum.length, this.ProductRisk, this.ProductCode, this.ProductName, this.Method, this.policyTerm, this.paymentTerm, this.commenceDate, this.paymentFreq, this.portfolio, this.CustomerName, this.Account_Number);
        if (!this.balanceFlag) {
          this.successMsg =
            'Insufficient cash balance in this account' +
            '(Account Number: ' +
            this.Account_Number +
            ')';
          this.loadflag = false;
        } else {
          this.api.ImportInsuranceProduct(
            this.ApplicationID,
            this.Currency,
            premium,
            sum,
            this.ProductRisk,
            this.ProductCode,
            this.ProductName,
            this.Method,
            this.policyTerm,
            this.paymentTerm,
            this.commenceDate,
            this.paymentFreq,
            this.username,
            this.portfolio,
            this.CustomerName,
            this.Account_Number
          );
        }
      }
    } catch (ex) {
      //console.log('error occured in addPolicy block:', ex);
    }
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  // PortfolioChange() {
  //   this.accountList = [];
  //   this.ccy = [];
  //   this.portfolioList = [];
  //   this.accountList = [];
  //   this.successMsg = '';
  //   this.showSubmit = true;
  // eslint-disable-next-line
  //   for (let i = 0; i < this.portfolioAccount.length; i++) {
  //     if (this.portfolioAccount[i][2] === this.Currency) {

  //       this.portfolioList.push(this.portfolioAccount[i][0]);
  //       this.accountList.push(this.portfolioAccount[i][1]);
  //       // this.accountList.push(this.portfolioAccount[i][1]);
  //       // this.ccy.push(this.portfolioAccount[i][2]);
  //     }
  //   }
  //   let portfoliolist = this.portfolioList;
  //   this.portfolioList = portfoliolist.filter((thing, index, self) =>
  //     index === self.findIndex((t) => (
  //       JSON.stringify(t) === JSON.stringify(thing)
  //     ))
  //   );
  //   if (this.portfolioList.length !== 0) {
  //     this.successMsg = '';
  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];

  //   } else {
  //     this.successMsg = 'Portfolio with selected Insurance currency is not available. Please select different Insurance';

  //   }
  //   // console.log('acc', this.Account_Number);
  //   this.updatePortfolio();
  // }

  // ChangeSelectedportfolio() {
  //   this.successMsg = '';
  //   this.accountList = [];
  //   let tempPortfoliodetails: any[] = [];
  //   tempPortfoliodetails = this.portfolioAccount.slice();
  //   let tempPortfolioArr = tempPortfoliodetails;

  //   const temp: any = tempPortfolioArr.filter((obj, i) => {
  //     return tempPortfolioArr[i][0] === this.portfolio;
  //   });

  //   temp.forEach((element, i) => {
  //     if (this.selectedShare.Currency === temp[i][2]) {
  //       this.accountList.push(temp[i][1]);
  //       this.CurrencyList.push(temp[i][2]);
  //     }
  //   });

  //   for (let i = 0; i < this.portfolioList.length; i++) {
  //     if (this.portfolioList[i] === this.portfolio) {
  //       this.Account_Number = this.accountList[i];
  //     }
  //   }
  //   if (this.Account_Number === '') {
  //     this.successMsg = 'Portfolio with selected insurance currency is not available. Please select different insurance';

  //   }
  // }
  changeSumAssured() {}
  ChnageCCY() {}
  ChnagePaymentMethod() {}
  omit_special_char(event) {
    try {
      let k;
      k = event.charCode; //         k = event.keyCode;  (Both can be used)
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k === 8 ||
        k === 32 ||
        (k >= 48 && k <= 57)
      );
    } catch (Exception) {
      // console.log("Error : " + Exception);
    }
  }
  selectDate(reqPram, date) {
    switch (reqPram) {
      case 'commenceDate':
        this.commenceDate = moment(date).format('DD-MMM-YYYY');
        break;
    }
  }

  selectShareOnEnter(_e) {
    try {
      const ShareInfo = $('.HoverSuggestion').data('sharedata');
      this.selectShareOnClick(ShareInfo);
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  searchShare() {
    try {
      // console.log(this.search);
      const that = this;
      if (this.search.trim().length >= 0) {
        this.api.insurancelistObserver.subscribe((b: any) => {
          // console.log(b);
          that.shareList = b.getProductDetailsResult
            .filter(
              (item) =>
                item.Product_Description.toLowerCase().startsWith(
                  this.search.toLowerCase()
                ) ||
                item.Product_Code.toLowerCase().startsWith(
                  this.search.toLowerCase()
                )
            )
            .map(
              (item) =>
                (item = {
                  Product_Description: item.Product_Description,
                  Product_Code: item.Product_Code,
                  Currency: item.Currency,
                  ProductRisk: item.Rating,
                  // ProductName1: (item.Product_Name + '').trim().toLowerCase(),
                  // Product_Name: (item.Product_Name + '').trim()
                })
            );
          // console.log(that.shareList);
        });
      } else {
        //console.log('less string');
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  ChangeIndex(_index) {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  selectShareOnClick(Product_Code) {
    try {
      this.reset();
      this.api.getINSApplicationID();
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      // console.log(Product_Code);
      this.selectedShare = this.shareList.filter((b) =>
        b.Product_Code.includes(Product_Code)
      )[0];
      // console.log('console selected', this.selectedShare);
      this.ProductCode = this.selectedShare.Product_Code;
      this.ProductName = this.selectedShare.Product_Description;
      this.Currency = this.selectedShare.Currency;
      this.ProductRisk = this.selectedShare.Rating;
      // this.PortfolioChange();
      let CRR = sessionStorage.getItem('CRR');
      if (this.com.isAlphaNumeric(CRR)) {
        CRR = CRR.substr(1, CRR.length);
      }
      // if (this.cfs.isAlphaNumeric(this.data.Rating)) {
      //   PRR = this.data.Rating.substr(1, this.data.Rating.length);
      // }
      if (CRR < this.ProductRisk) {
        this.msg =
          'Customer Rating is less that product rating ! Please check.';
      } else {
        this.msg = '';
      }
      sessionStorage.setItem('MFMessage', this.msg);
      this.search = '';
    } catch (error) {}
  }

  selectShare(Product_Code) {
    try {
      this.reset();
      this.api.getINSApplicationID();
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      // console.log(Product_Code);
      if (this.shareList === []) {
        this.api.getInsuranceList();
      }
      this.selectedShare = this.shareList.filter((b) =>
        Product_Code.includes(b.Product_Description)
      )[0];
      // console.log('console selected', this.selectedShare);
      this.ProductCode = this.selectedShare.Product_Code;
      this.ProductName = this.selectedShare.Product_Description;
      this.Currency = this.selectedShare.Currency;
      this.ProductRisk = this.selectedShare.Rating;
      // this.PortfolioChange();
      let CRR = sessionStorage.getItem('CRR');
      if (this.com.isAlphaNumeric(CRR)) {
        CRR = CRR.substr(1, CRR.length);
      }
      // if (this.cfs.isAlphaNumeric(this.data.Rating)) {
      //   PRR = this.data.Rating.substr(1, this.data.Rating.length);
      // }
      if (CRR < this.ProductRisk) {
        this.msg =
          'Customer Rating is less that product rating ! Please check.';
      } else {
        this.msg = '';
      }
      sessionStorage.setItem('MFMessage', this.msg);
      this.search = '';
      this.api
        .GetPortfoliosFromCusID(this.CustomerID, this.Currency)
        .subscribe((res) => {
          if (res) {
            this.portfolioList = [];
            this.portfolioList = res.DB_GetPortfoliosResult;
            if (this.portfolioList.length > 0) {
              this.successMsg = '';
              this.portfolio = this.portfolioList[0].FacDesc;
              // this.portfolioName = this.portfolioList[0].PortfolioName;
            } else {
              this.successMsg =
                'Cash account unavailable for the Insurance currency';
            }
            // this.portfolio = this.portfolioList[0].FacDesc;
            this.updatePortfolio();
          }
        });
    } catch (error) {}
  }
  reset() {
    this.loadflag = false;
    this.ProductName = '';
    this.ProductCode = '';
    // this.SumAssured = '';
    this.ApplicationID = '';
    this.successMsg = '';
  }
  showdetailsPopUp() {
    if (this.popUpflag === true) {
      this.popUpflag = false;
    } else if (this.finalSuitabilityData.length !== 0) {
      if (this.suitabilityStatus === 'Not Eligible') {
        this.popUpflag = true;
      } else {
        this.popUpflag = false;
        this.addPolicy();
      }
    } else {
      this.popUpflag = false;
    }
  }
  selectedCustomerValue1(e) {
    // console.log(e);
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;

    this.enablePortfolio = true;
    this.api
      .GetPortfoliosFromCusID(this.CustomerID, this.Currency)
      .subscribe((res) => {
        if (res) {
          this.portfolioList = [];
          this.portfolioList = res.DB_GetPortfoliosResult;
          if (this.portfolioList.length > 0) {
            this.successMsg = '';
            this.portfolio = this.portfolioList[0].FacDesc;

            // this.portfolioName = this.portfolioList[0].PortfolioName;
          } else {
            this.successMsg =
              'Cash account unavailable for the Insurance currency';
          }
          this.updatePortfolio();
        }
      });
    // this.api.getmultiPortfolio(this.CustomerName.split('|')[0]);
  }
  getCustomerDetails(_event) {}
}
