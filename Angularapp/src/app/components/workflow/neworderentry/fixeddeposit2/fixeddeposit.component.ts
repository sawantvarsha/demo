import { Component, OnInit, OnDestroy } from '@angular/core';
import { DealSave, Principle } from './model';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerCommonfunctionsService } from 'src/app/services/customer-commonfunctions.service';

@Component({
  selector: 'app-fixeddeposit',
  templateUrl: './fixeddeposit.component.html',
  styleUrls: ['./fixeddeposit.component.scss']
})
export class FixeddepositComponent implements OnInit, OnDestroy {

  isProd = environment.production;
  // SubScriber
  SaveCustomerDetailsSubscriber: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;

  entityUser = '';
  currencyList = ['AED', 'AUD', 'CAD', 'CHF', 'CNH', 'EUR', 'GBP', 'HKD', 'INR', 'JPY', 'NOK', 'NZD', 'SEK', 'SGD', 'THB', 'USD', 'XAG', 'XAU', 'ZAR'];

  //  currencyList = ['AED', 'AUD', 'CAD', 'CHF', 'CNH', 'EUR', 'GBP', 'HKD', 'INR', 'JPY', 'NOK', 'NZD', 'SEK', 'SGD', 'THB', 'USD', 'XAG', 'XAU', 'ZAR'];
  // rollOver = ['No Rollover', 'Rollover P', 'Rollover P+I'];
  intPaymentList = ['Annually', 'Daily', 'Monthly', 'Quarterly', 'Semiannually', 'Weekly'];
  // transactionCodeList = ['Deposit', 'Withdrawal'];
  tenorUnitList = ['Week', 'Month', 'Year'];
  interestTypeList = ['Compound Interest', 'Simple Interest'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  maturityInstructionList = ['Renew P&I', 'Renew P', 'Redeem P&I'];
  d = new Date();
  tradeDate = this.d.getDate() + '-' + this.months[this.d.getMonth()] + '-' + this.d.getFullYear();
  matDate: any;
  dayBasis: any;
  daysDiff = 0;
  successMsg = '';
  validationMsg = '';
  orderId: any;
  depositsOrders = [];
  orderflag = false;

  IntFreqdisable = false;

  dealSave = new DealSave();
  principle = new Principle();
  ErrorMsg: string;
  apiResponse: string;
  recordsFlag = false;
  LoadMultipleAccounts = true;
  totalaccounts = [];
  RePayaccounts = [];
  AccountType = [];
  PortfolioTypes = [];
  Message = '';
  BookingOrderloadflag = false;
  moredetails = 'More Details';
  Customer = '';
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  showSubmit: boolean;
  constructor(public afs: WorkflowApiService, public cfs: CommonApiService, private cafs: CustomerApiService, private ccfs: CustomerCommonfunctionsService) {
  }

  ngOnInit() {
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;

    this.entityUser = sessionStorage.getItem('Username');
    this.Customer = sessionStorage.getItem('CustomerNamemisc1');
    this.dealSave.depositAmountDisplay = this.cfs.FormatNumberr(String(1000000));
    this.dealSave.depositAmountDisplay = '1,000,000.00';
    this.initializeMmodel();
    this.selectedCurrency();
    this.cafs.fngetCustAccountDetailsforMultiAcc(this.entityUser);
    this.GetCustomerMultiAccountDetailsSubscriber = this.cafs.getCustAccountDetailsforMultiAcc.subscribe((res: any) => {
      if (res.length !== 0 && this.LoadMultipleAccounts) {
        this.LoadMultipleAccounts = false;
        this.PortfolioTypes = [];
        this.AccountType = [];
        res.forEach((element) => {
          this.LoadAccounts(element);
        });
        this.AccountType = this.AccountType.map(e => e.Type)
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter((e) => this.AccountType[e]).map(e => this.AccountType[e]);
        this.PortfolioTypes = this.PortfolioTypes.map(e => e.Type)
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter((e) => this.PortfolioTypes[e]).map(e => this.PortfolioTypes[e]);
        this.dealSave.PortfolioID = res[0].portfolio;
        this.dealSave.sourceAcNo = res[0].accountnumber;
        // this.SetRepayAcountNumber();
        this.FilterAccountNumbers();
      }
    });
    this.AccountType = this.AccountType.map(e => e.Type)
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => this.AccountType[e]).map(e => this.AccountType[e]);
    this.PortfolioTypes = this.PortfolioTypes.map(e => e.Type)
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => this.PortfolioTypes[e]).map(e => this.PortfolioTypes[e]);
    this.clearMessages();
    // this.getMaturityInfo();
  }
  ngOnDestroy() {
    try {
      this.SaveCustomerDetailsSubscriber.unsubscribe();
      this.GetCustomerMultiAccountDetailsSubscriber.unsubscribe();
      this.clearMessages();
      this.PortfolioTypes = [];
      this.AccountType = [];
    } catch (Exception) {
      // console.log('Error occured while Unsubscribe the Subscriber: ' + Exception);
    }
  }

  initializeMmodel() {
    this.dealSave.depositType = 'Short term';
    this.dealSave.maturityInstructions = 'Renew P&I';
    console.log(this.cfs.FormatNumberr(String(1000000)));
    // this.dealSave.depositAmountDisplay = this.afs.FormatNumberwithoutevent(String(1000000));
    this.dealSave.currency = 'USD';
    this.dealSave.depositAmount = 1000000.00;
    this.dealSave.intPaymentFreq = 'Annually';
    this.dealSave.tenor = 1;
    this.dealSave.tenorUnit = 'Year';
    this.dealSave.tradeDate = this.tradeDate;
    this.dealSave.maturityDate = '';
    this.dealSave.interestType = 'Compound Interest';
    // this.dealSave.interestRate = 2.42;
    this.dealSave.cif = '110157';
    this.dealSave.maturityAmount = 0;
    this.dealSave.sourceAcNo = '0313168150001234';
    this.dealSave.rePaymentAcNo = '0113017980200045';
    this.dealSave.product = 'FAIO';
    this.principle.depositAmount = this.dealSave.depositAmount;
    this.principle.tenor = 1;
    this.principle.tenorUnit = 'Year';
    this.principle.interestType = 'Compound Interest';
    this.principle.interestPaymentFreq = 'Annually';
    // this.principle.interestRate = 2.42;
    this.principle.dayBasis = 360;
  }

  selectedIntPayment(event) {
    this.dealSave.intPaymentFreq = event.target.value;
    this.principle.interestPaymentFreq = event.target.value;

    this.getMaturityInfo();
  }

  selectedTenorUnit(event) {
    this.dealSave.tenorUnit = event.target.value;
    this.principle.tenorUnit = event.target.value;
    this.getMaturityInfo();
  }

  tenorChanged(event) {
    this.principle.tenor = event.target.value;
    this.dealSave.tenor = event.target.value;
    this.getMaturityInfo();
  }

  selectedMaturityInstruction(event) {
    this.dealSave.maturityInstructions = event.target.value;
  }

  selectedInterestType() {
    console.log('Selcted interest type : ', this.dealSave.interestType);
    if (this.dealSave.interestType === 'Simple Interest') {
      this.IntFreqdisable = true;
    }
    else {
      this.IntFreqdisable = false;
    }

    this.principle.interestType = this.dealSave.interestType;

    this.calculateredeemptionAmount();
  }

  selectedCurrency() {
    // this.afs.getDayBasis({ "currency" : this.dealSave.currency}).then(response => {

    //     console.log("Maturity Amount : ", response);
    //     if(response !== undefined) {
    //         if (response.status = "success") {
    //             this.dealSave.dayBasis = response.data.GetDayBasisFromCurrencyResult;
    //             this.principle.dayBasis = response.data.GetDayBasisFromCurrencyResult;
    //       //console.log("Day Basis received : ", this.dealSave.dayBasis);
    //             this.getMaturityInfo();
    //         }
    //         else {
    //       //console.log("No DayBasis received", response.errorMsg);
    //             this.clearMessages();
    //             this.ErrorMsg = "Day Basis not received from server";//response.errorMsg;
    //         }
    //     } else {
    //   //console.log("No Maturity Info received from server");
    //         this.clearMessages();
    //         this.ErrorMsg = "Day Basis not received from server";
    //     }
    // })

    this.getMaturityInfo();
  }

  getInterestRate() {

    const interestRate = { currency: this.dealSave.currency, tenor: this.dealSave.expiryDays };
    this.afs.getInterestRate(interestRate).then((response: any) => {
      if (response !== undefined) {
        try {
          if (response.status === 'success') {
            // this.dealSave.interestRate = response.data[0].DIR_IR;
            // this.principle.interestRate = response.data[0].DIR_IR;

            this.dealSave.interestRate = response.data.GetBoardRateResult.toFixed(2);
            this.principle.interestRate = response.data.GetBoardRateResult.toFixed(2);

            this.calculateredeemptionAmount();
          }
          else {
            // console.log('No Maturity Info received from server', response.errorMsg);
            this.clearMessages();
            this.ErrorMsg = 'Interest rate not received from server';
          }
        } catch (Exception) {

        }

      } else {
        // console.log('Undefined response');
        // console.log('No Maturity Info received from server');
        this.clearMessages();
        this.ErrorMsg = 'Interest rate not received from server';
      }
    }).catch(err => console.log(err));
  }


  getMaturityInfo() {
    console.log('Deposits Target Value : ', this.dealSave.depositAmountDisplay);
    // this.principle.depositAmount = Number((this.dealSave.depositAmountDisplay).toString().replace(/,/g, ''));
    this.principle.depositAmount = Number((this.dealSave.depositAmountDisplay).toString().replace(/,/g, ''));

    this.dealSave.depositAmount = this.principle.depositAmount;

    const tenorObj = { currency: this.dealSave.currency, tenor: this.dealSave.tenor, tenorUnit: this.dealSave.tenorUnit };

    this.afs.getMaturityDays(tenorObj).then(response => {
      // console.log('Maturity Amount : ', response);
      if (response !== undefined) {
        if (response.status === 'success') {

          this.dealSave.maturityDate = (response.data.Get_FinIQ_CalculateDatesWrapperResult)[0].MaturityDate;
          this.dealSave.depositDays = (response.data.Get_FinIQ_CalculateDatesWrapperResult)[0].DepositDays;
          this.principle.depositDays = (response.data.Get_FinIQ_CalculateDatesWrapperResult)[0].DepositDays;
          this.dealSave.expiryDays = (response.data.Get_FinIQ_CalculateDatesWrapperResult)[0].ExpiryDays;
          this.principle.expiryDays = (response.data.Get_FinIQ_CalculateDatesWrapperResult)[0].ExpiryDays;
          this.getInterestRate();
        }
        else {
          // console.log('No Maturity Info received from server', response.errorMsg);
          this.clearMessages();
          this.ErrorMsg = 'Maturity date and deposit days not received from server';
        }
      } else {
        // console.log('No Maturity Info received from server');
        this.clearMessages();
        this.ErrorMsg = 'Maturity date and deposit days not received from server';
      }
    }).catch(err => console.log(err));
  }

  calculateredeemptionAmount() {
    console.log('Principle: ', this.principle);
    this.afs.calculatePrincipleAmount(this.principle).then(response => {
      // console.log('Maturity Amount : ', response);
      if (response !== undefined) {
        if (response.status === 'success') {
          // this.dealSave.tradeDate = this.tradeDate;
          // this.dealSave.maturityDate = response.data.maturityDate;
          // this.dealSave.maturityAmount = Number(Math.round(response.data.maturityAmount).toFixed(2));

          this.dealSave.maturityAmount = Number(parseFloat(response.data.maturityAmount).toFixed(2));

          this.dealSave.interestAmount = response.data.interestAmount;
          this.dealSave.maturityAmountDisplay = this.cfs.FormatNumberr(String(this.dealSave.maturityAmount));
        }
        else {
          // console.log('No Maturity Info received from server', response.errorMsg);
          this.clearMessages();
          this.ErrorMsg = 'Maturity amount not received from server 1';
        }
      } else {
        // console.log('No Maturity Info received from server');
        this.clearMessages();
        this.ErrorMsg = 'Maturity amount not received from server';
      }
    }).catch(err => console.log(err));
  }

  confirm() {
    console.log(this.dealSave);

    const validator = this.validation();
    console.log('Deposits Tenor ', this.dealSave.tenor);
    this.dealSave.depositAmount = Number((this.dealSave.depositAmountDisplay).toString().replace(/,/g, ''));
    // if (this.dealSave.depositAmount !== 0 && this.dealSave.depositAmount > 0) {
    if (validator) {
      this.afs.saveDealEntry(this.dealSave).then(response => {
        if (response !== undefined) {
          // console.log('response confirm: ', response);

          if (response.insert_FAIO_Deal_EntryResult !== '0') {
            // if (response.status === 'success') {
            this.orderflag = true;
            this.orderId = response.insert_FAIO_Deal_EntryResult;
            this.clearMessages();
            this.successMsg = 'Order saved successfully with Ref No. ' + this.orderId;
            // if (this.orderflag) {
            //   this.viewOrders();
            // }
          }
          else {
            this.clearMessages();
            //  this.ErrorMsg = response.errorMsg;
            this.ErrorMsg = 'Order not saved. ';
          }
        }
        else {
          this.clearMessages();
          // this.ErrorMsg = response.errorMsg;   commented later
          this.ErrorMsg = 'Order not saved. ';
        }
      }).catch(err => console.log(err));
    }
    // this.viewOrders();
  }

  saveDetails() {
    const validator = this.validation();
    if (validator) {
      this.BookingOrderloadflag = true;
      try {
        const jsonObj = {
          ExcelSheets: {
            Cash_Adjustment: {
              int_rate_fixed: this.dealSave.interestRate,
              HEDGING_TYPE: 'Dynamic',
              InterestPayFrequency: this.dealSave.intPaymentFreq,
              Tenor: this.dealSave.tenor + ' ' + this.dealSave.tenorUnit,
              InterestType: this.dealSave.interestType,
              dDefaultRT: 'Fixed',
              DepositAmt: this.cfs.UnformatNumberwithoutevent(this.dealSave.depositAmountDisplay),
              Trade_Date: this.dealSave.tradeDate,
              Maturity_Date: this.dealSave.maturityDate,
              Customer: this.Customer,
              Currency: this.dealSave.currency,
              Portfolio: this.dealSave.PortfolioID,
              FDType: this.dealSave.depositType
            }
          }
        };

        this.cafs.saveNewOrder(jsonObj, this.entityUser, 'fixed_deposit', 'Insert', 0);

        this.SaveCustomerDetailsSubscriber = this.cafs.SaveOrder.subscribe((res) => {
          if (res) {
            if (res.SaveUCPResult) {
              this.Message = res.SaveUCPResult[0].SavingMessage;
              if (this.Message !== null) {
                if (res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0) {
                  this.Message = 'Fixed deposit with Ref id ' + res.SaveUCPResult[0].NoteMasterID + ' booked successfully.';
                } else {
                  this.Message = 'Error while saving the order. Please try again or contact the system administrator.';
                }
              } else {
                try {
                  this.Message = res.SaveUCPResult[0].WarningMessage;
                  const x = document.getElementById('snackbar');
                  x.className = 'show';
                  setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
                  this.Message = '';
                } catch (Exception) {

                }
              }
            }
            this.BookingOrderloadflag = false;
          }
        });

      } catch (ex) {
        // console.log(ex);
        // this.Message = 'Error occurred while processing the request. Please contact the system administrator.';
      }
    }

  }

  clear() {
    this.clearMessages();
    this.dealSave.depositAmount = 0;
    this.dealSave.depositAmountDisplay = 0;
    this.dealSave.maturityAmount = 0;
    this.dealSave.interestAmount = 0;
    this.dealSave.maturityAmountDisplay = 0;
    this.orderflag = false;
  }

  // updateCustomerPortfolioDetails() {
  //   this.RePayaccounts = [];
  //   this.currencyList = [];
  //   let temp: any = this.selectedCustomerDetails.filter(obj => {
  //     return obj.PortfolioName === this.dealSave.PortfolioID;
  //   }
  //   )
  //   temp.forEach(element => {
  //     this.RePayaccounts.push(element.AccountNo);
  //     this.currencyList.push(element.SICurrency);
  //   });
  //   this.dealSave.sourceAcNo = this.RePayaccounts[0];
  //   // this.currency = this.data.Ccy = this.CurrencyList[0];
  //   this.updateCcy();
  //   // this.ChangeSelectedportfolio();
  // }

  updatePortfolio() {
    if (this.isUserRM) {
      this.updateCustomerPortfolioDetails();
    } else {
      this.ChangeSelectedportfolio();
    }
  }

  getPortfolioFromFund() {
    this.PortfolioTypes = [];
    this.RePayaccounts = [];
    this.currencyList = [];
    let temp: any = this.selectedCustomerDetails.filter(obj => {
      return obj.SICurrency === this.dealSave.currency
    })

    if (temp.length) {
      temp.forEach(element => {
        this.PortfolioTypes.push(element.PortfolioName)
        this.RePayaccounts.push(element.AccountNo)
        this.currencyList.push(this.dealSave.currency)
      });


      // this.portfolio = temp[0].PortfolioName

    } else {
      // this.successMsg = 'Portfolio with selected currency is not available. Please select different fund';
      this.showSubmit = false;
    }
  }

  ChangeSelectedportfolio() {
    for (let i = 0; i < this.PortfolioTypes.length; i++) {
      if (this.PortfolioTypes[i] === this.dealSave.PortfolioID) {
        this.dealSave.sourceAcNo = this.RePayaccounts[i];
      }
    }
    if (this.dealSave.sourceAcNo === '') {
      // this.successMsg = 'Portfolio with selected bond currency is not available. Please select different bond';
      this.showSubmit = false;
    }
  }


  updateCustomerPortfolioDetails() {
    this.RePayaccounts = [];
    this.currencyList = [];
    console.log('Update ccy: ', this.dealSave.currency);
    let temp: any = this.selectedCustomerDetails.filter(obj => {
      return obj.PortfolioName === this.dealSave.PortfolioID;
    }
    )
    temp.forEach(element => {
      this.RePayaccounts.push(element.AccountNo);
      this.currencyList.push(element.SICurrency);
    });
    this.dealSave.sourceAcNo = this.RePayaccounts[0];
    // this.currency = this.data.Ccy = this.CurrencyList[0];
    this.updateCcy();
    // this.ChangeSelectedportfolio();
  }

  updateCcy() {
    console.log('Update ccy: ', this.dealSave.currency);
    let temp: any = this.selectedCustomerDetails.filter(obj => {
      return obj.AccountNo === this.dealSave.sourceAcNo;
    }
    )
    if (temp.length) {
      this.dealSave.currency = temp[0].SICurrency;
    }

  }



  getCustomerDetails(res) {
    this.PortfolioTypes = [];
    if (res.length > 0) {
      this.selectedCustomerDetails = res;
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.PortfolioName)) {
          map.set(item.PortfolioName, true); // set any value to Map
          this.PortfolioTypes.push(item.PortfolioName);
        }
      }
      this.dealSave.PortfolioID = this.PortfolioTypes[0];
      this.updateCustomerPortfolioDetails();
    }

  }

  clearMessages() {
    this.successMsg = '';
    this.Message = '';
    this.ErrorMsg = '';
    this.apiResponse = '';
    this.cafs.ClearObserverofFD();
  }

  validation() {
    this.clearMessages();
    if (
      Number(
        this.cfs.UnformatNumberwithoutevent(this.dealSave.depositAmountDisplay)
      ) < 1
    ) {
      this.Message = 'Deposit Amount should be grater than 0.';
      return false;
    } else if (this.dealSave.sourceAcNo === '') {
      this.Message = 'Account with bond currency not present.';
      return false;
    } else {
      if (
        this.dealSave.tenor === null ||
        this.dealSave.tenor === undefined ||
        this.dealSave.tenor.toString() === ''
      ) {
        this.Message = 'Enter the Tenor';
        return false;
      } else {
        if (this.dealSave.tenor < 1) {
          this.Message = 'Tenor should be greater than 0 and non-negative';
          return false;
        } else {
          return true;
        }
      }
    }
  }

  LoadAccounts(res) {
    this.totalaccounts.push(res);
    console.log('FIX', res);
    if (this.AccountType.length > 0) {
      this.AccountType.push({ Type: res.accounttype });
      // let flag = false;
      // this.AccountType.forEach(ele => {
      //   if (ele.Type !== res.accounttype) {
      //     flag = true;
      //     return;
      //   }
      // });
      // if (flag) {
      // this.AccountType.push({ Type: res.accounttype });
      // }
    } else {
      this.AccountType.push({ Type: res.accounttype });
      this.dealSave.accountType = this.AccountType[0].Type;
    }
    if (this.PortfolioTypes.length > 0) {
      // let Pflag = false;
      this.PortfolioTypes.push({ Type: res.portfolio });

      // this.PortfolioTypes.forEach(ele => {
      //   if (ele.Type !== res.portfolio) {
      //     Pflag = true;
      //     return;
      //   }
      // });
      // if (Pflag) {
      //   this.PortfolioTypes.push({ Type: res.portfolio });
      // }
    } else {
      this.PortfolioTypes.push({ Type: res.portfolio });
      this.dealSave.PortfolioID = this.PortfolioTypes[0].Type;
    }

  }

  FilterAccountNumbers() {
    this.RePayaccounts = [];
    const SourceCcy = '';
    this.totalaccounts.forEach(ele => {
      if (this.dealSave.PortfolioID === ele.portfolio && this.dealSave.accountType === ele.accounttype) {
        this.RePayaccounts.push(ele);
      }
    });
    this.dealSave.sourceAcNo = this.RePayaccounts[0].accountnumber;
    this.dealSave.currency = this.RePayaccounts[0].Accountcurrency;
  }
  filterCcy() {
    this.totalaccounts.forEach((ele) => {
      if (this.dealSave.sourceAcNo === ele.accountnumber) {
        this.dealSave.currency = ele.Accountcurrency;
      }
    });
  }

  SetRepayAcountNumber() {
    this.RePayaccounts = [];
    let SourceCcy = '';
    this.totalaccounts.forEach(ele => {
      if (ele.accountnumber === this.dealSave.sourceAcNo) {
        SourceCcy = ele.Accountcurrency;
        this.dealSave.currency = SourceCcy;
      }
    });
    this.totalaccounts.forEach(ele => {
      // Set Repayment account list on selection of Source account
      if (ele.Accountcurrency === SourceCcy) {
        this.RePayaccounts.push(ele);
      }
      // Set Selected Source Account portfolio ID
      if (ele.accountnumber === this.dealSave.sourceAcNo) {
        this.dealSave.PortfolioID = ele.portfolio;
      }
    });
    this.dealSave.rePaymentAcNo = this.RePayaccounts[0].accountnumber;

  }
  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

}
