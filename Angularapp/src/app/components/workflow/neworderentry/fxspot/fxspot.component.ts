import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../../../services/customer-api.service';
// import { CommonApiService } from '../../../../services/common-api.service';
import { CommonApiService } from '../../../../services/common-api.service';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fxspot',
  templateUrl: './fxspot.component.html',
  styleUrls: ['./fxspot.component.scss'],
})
export class FXSpotComponent implements OnInit {
  currencyList = [];
  sellCurrency: String;
  buyCurrency: String;
  notional: String;
  tradeDate: String;
  spotDate: String;
  coverRate = '';
  spread = '';
  spotRate: String;

  successMsg = '';
  errorMsg = '';

  userName = '';
  isUserRM: boolean;
  userType: string;

  sellPortfolioName = '';
  sellAccountNumber = '';
  sellAccountType = '';
  buyPortfolioName = '';
  buyAccountNumber = '';
  buyAccountType = '';

  // RMPortfolioDetails = [];
  allPortfolioDetails = [];
  buyPortfolioDetails = [];
  sellPortfolioDetails = [];

  shwPortfolioDetailsFlg = false;
  BookingOrderloadflag: boolean;
  Message: string;
  SaveCustomerDetailsSubscriber: any;

  // PortfolioTypes = [];
  // AccountType = [];

  constructor(
    private api: CustomerApiService,
    public datepipe: DatePipe,
    public cfs: CommonApiService
  ) { }
  // constructor(private api: CustomerApiService) { }

  ngOnInit(): void {
    // this.entityUser = sessionStorage.getItem('Username');
    this.userName = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    // this.api.fngetCustAccountDetails(this.userName);
    var date11 = new Date();

    // this.tradeDate = this.datepipe.transform(date11, 'yyyy-MM-dd');
    this.tradeDate = this.datepipe.transform(date11, 'dd-MMM-yyyy');
    this.spotDate = this.datepipe.transform(date11, 'dd-MMM-yyyy');
    // this.tradeDate = "08-Jan-2021";
    // this.tradeDate = "2020-01-08";
    // const startDate = this.datePipe.transform(today, 'yyyy-MM-dd'); // '9-DEC-2011';
    this.notional = '1,000,000.00';
    this.spread = '20.00';
    this.coverRate = '1.30';
    this.calculateSpotRate();

    this.api.GetAllTradableCurrency();
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
        this.sellCurrency = 'AUD';
        // this.buyCurrency = 'EUR';
        this.buyCurrency = 'USD';
      }
    });

    this.api.GettCustomerAccountDetails(this.userName).subscribe((res) => {
      if (res.length !== 0) {
        this.allPortfolioDetails = res;
        this.setPortfolioAccDetails();
      }
    });

    // this.SaveCustomerDetailsSubscriber =
    this.api.SaveOrder.subscribe((res) => {
      if (res) {
        //console.log(res);
        if (res.SaveUCPResult) {
          let Message = res.SaveUCPResult[0].SavingMessage;
          //console.log(res.SaveUCPResult[0].WarningMessage, Message);
          if (Message !== null) {
            if (res.SaveUCPResult[0].RowNumber === 1 && Message.length > 0) {
              this.successMsg =
                'FX Spot with Ref id ' +
                res.SaveUCPResult[0].NoteMasterID +
                ' booked successfully.';
              this.errorMsg = '';
            } else {
              this.errorMsg =
                'Error while saving the order. Please try again or contact the system administrator.';
              this.successMsg = '';
            }
          } else {
            this.errorMsg = res.SaveUCPResult[0].WarningMessage;
          }
        }
        // this.BookingOrderloadflag = false;
      }
    });
  }
  setPortfolioAccDetails() {
    console.log('setPortfolioAccDetails');
    this.setBuyPortfolioAccDetails();
    this.setSellPortfolioAccDetails();
    console.log('after setPortfolioAccDetails');
    console.log(this.allPortfolioDetails);
    console.log(this.sellPortfolioDetails);
    console.log(this.buyPortfolioDetails);
  }
  setBuyPortfolioAccDetails() {
    console.log('setBuyPortfolioAccDetails');
    this.buyPortfolioDetails = this.allPortfolioDetails.filter(
      (e: any) => e.Accountcurrency === this.buyCurrency
    );
    if (this.buyPortfolioDetails.length > 0) {
      this.buyPortfolioName = this.buyPortfolioDetails[0].portfolio;
      this.buyAccountNumber = this.buyPortfolioDetails.filter(
        (e: any) => e.portfolio === this.buyPortfolioName
      )[0].accountnumber;
      this.buyAccountType = this.buyPortfolioDetails.filter(
        (e: any) =>
          e.portfolio === this.buyPortfolioName &&
          e.accountnumber === this.buyAccountNumber
      )[0].accounttype;
    }
  }
  setSellPortfolioAccDetails() {
    console.log('setSellPortfolioAccDetails:');
    console.log(this.allPortfolioDetails);
    this.sellPortfolioDetails = this.allPortfolioDetails.filter(
      (e: any) => e.Accountcurrency === this.sellCurrency
    );
    console.log(this.sellPortfolioDetails);
    if (this.sellPortfolioDetails.length > 0) {
      this.sellPortfolioName = this.sellPortfolioDetails[0].portfolio;
      this.sellAccountNumber = this.sellPortfolioDetails.filter(
        (e: any) => e.portfolio === this.sellPortfolioName
      )[0].accountnumber;
      this.sellAccountType = this.sellPortfolioDetails.filter(
        (e: any) =>
          e.portfolio === this.sellPortfolioName &&
          e.accountnumber === this.sellAccountNumber
      )[0].accounttype;
    }
  }

  fnSellPortfolioNameChange() {
    /*
    if (this.isUserRM) {
 //console.log(this.allPortfolioDetails);
 //console.log(this.sellPortfolioName);
 //console.log(this.allPortfolioDetails.filter((e: any) => e.portfolio === this.sellPortfolioName)[0]);
 //console.log(this.allPortfolioDetails.filter((e: any) => e.Portfolio_Name === this.sellPortfolioName)[0]);
        // this.sellAccountNumber = this.allPortfolioDetails.filter((e: any) => e.portfolio === this.sellPortfolioName)[0].accountnumber;
    }
    else {
      */
    if (this.sellPortfolioDetails.length > 0) {
      this.sellAccountNumber = this.sellPortfolioDetails.filter(
        (e: any) => e.portfolio === this.sellPortfolioName
      )[0].accountnumber;
      this.sellAccountType = this.sellPortfolioDetails.filter(
        (e: any) =>
          e.portfolio === this.sellPortfolioName &&
          e.accountnumber === this.sellAccountNumber
      )[0].accounttype;
    }
    // }
  }
  fnBuyPortfolioNameChange() {
    if (this.buyPortfolioDetails.length > 0) {
      // this.buyPortfolioName = this.buyPortfolioDetails[0].portfolio;
      this.buyAccountNumber = this.buyPortfolioDetails.filter(
        (e: any) => e.portfolio === this.buyPortfolioName
      )[0].accountnumber;
      this.buyAccountType = this.buyPortfolioDetails.filter(
        (e: any) =>
          e.portfolio === this.buyPortfolioName &&
          e.accountnumber === this.buyAccountNumber
      )[0].accounttype;
    }
  }
  saveDetails() {
    const jsonObj = {
      ExcelSheets: {
        FXSpot: {
          // Hedging_type: this.dealSave.interestRate,
          HEDGING_TYPE: 'Dynamic',
          Sell_Currency: this.sellCurrency,
          Amount: this.notional,
          Buy_Currency: this.buyCurrency,
          ClientName: sessionStorage.getItem('CustomerNamemisc1'),
          Spot_Date: this.spotDate,
          Forward_Date: this.tradeDate,
          Cover_Rate: this.coverRate,
          Spread: this.spread,
          Ccy1_Portfolio: this.sellPortfolioName,
          Ccy2_Portfolio: this.buyPortfolioName,
          // InterestPayFrequency: this.dealSave.intPaymentFreq,
          // Tenor: this.dealSave.tenor + ' ' + this.dealSave.tenorUnit,
          // InterestType: this.dealSave.interestType,
          // dDefaultRT: 'Fixed',
          // DepositAmt: this.cfs.UnformatNumberwithoutevent(this.dealSave.depositAmountDisplay),
          // Trade_Date: this.dealSave.tradeDate,
          // Maturity_Date: this.dealSave.maturityDate,
          // Customer: this.Customer,
          // Currency: this.dealSave.currency,
          // Portfolio: this.dealSave.PortfolioID,
          // FDType: this.dealSave.depositType
        },
      },
    };

    if (this.buyAccountNumber !== '' && this.sellAccountNumber !== '') {
      this.api.saveNewOrder(
        jsonObj,
        sessionStorage.getItem('FinIQUserID'),
        'FXSpot',
        'Insert',
        0
      );
    }
    // const NoteMasterId = 0;
    console.log(this.cfs.json2xml(jsonObj));
    //  return true;
    // this.api.saveNewOrder(jsonObj, this.userName, 'fxspot', 'Insert', NoteMasterId);

    // this.SaveCustomerDetailsSubscriber = this.api.SaveOrder.subscribe((res) => {
    //   if (res) {
    //     if (res.SaveUCPResult) {
    //       this.Message = res.SaveUCPResult[0].SavingMessage;
    //       if (this.Message !== null) {
    //         if (res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0) {
    //           this.Message = 'Fixed deposit with Ref id ' + res.SaveUCPResult[0].NoteMasterID + ' booked successfully.';
    //         } else {
    //           this.Message = 'Error while saving the order. Please try again or contact the system administrator.';
    //         }
    //       } else {
    //         try {
    //           this.Message = res.SaveUCPResult[0].WarningMessage;
    //           const x = document.getElementById('snackbar');
    //           x.className = 'show';
    //           setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    //           this.Message = '';
    //         } catch (Exception) {

    //         }
    //       }
    //     }
    //     this.BookingOrderloadflag = false;
    //   }
    // });
  }

  /*
  LoadAccounts(res) {
    // this.totalaccounts.push(res);
    // console.log('FIX', res);
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
      // this.dealSave.accountType = this.AccountType[0].Type;
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
      // this.dealSave.PortfolioID = this.PortfolioTypes[0].Type;
    }

  }
  */

  changeCoverRate() {
    console.log('changeCoverRate');
    this.calculateSpotRate();
  }

  changeSpread() {
    console.log('changeSpread');
    this.calculateSpotRate();
  }

  changeSpotRate() {
    console.log('changeSpotRate');
  }
  calculateSpotRate() {
    console.log('AAA:' + parseFloat(this.coverRate));
    if (
      parseFloat(this.coverRate).toFixed(2) !== 'NaN' &&
      parseFloat(this.spread).toFixed(2) !== 'NaN'
    ) {
      this.spotRate = (
        parseFloat(this.spread) / 10000 +
        parseFloat(this.coverRate)
      ).toFixed(6);
      // 9250588904
    }
  }
  setShwPortfolioDetailsFlg() {
    this.shwPortfolioDetailsFlg = !this.shwPortfolioDetailsFlg;
  }
  selectDate(date) {
    // console.log(this.GetEventTarget(e));
    // console.log(this.GetEventTarget(e).value);
    // this.tradeDate = moment(date).format('DD-MMM-YYYY');
    // this.GetEventTarget(e).value = moment(date).format('DD-MMM-YYYY');
    // console.log(this.GetEventTarget(e).value);
    // console.log( $('.HoverSuggestion').data('share') );
    return moment(date).format('DD-MMM-YYYY');
    // console.log('aaa::' + aaa);
    // console.log('spotDate::' + this.tradeDate);
    // return aaa;
    // console.log(this.tradeDate);
  }

  // selectDate1(date) {
  // var aaa = (moment(date).format('DD-MMM-YYYY'));
  // console.log('aaa::' + aaa);
  // this.spotDate = aaa;
  // console.log('spotDate::' + this.spotDate);
  // return aaa;
  // }

  // GetEventTarget(e): any {
  //   try {
  //     const target: any = e.target || e.srcElement || e.currentTarget || null;
  //     return target;
  //   } catch (error) {
  //     // console.log('Error:', error);
  //   }
  // }
  submitValidation() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.validateData()) {
      this.successMsg = '';
      this.saveDetails();
    }
  }

  validateData() {
    if (this.sellCurrency === this.buyCurrency) {
      this.errorMsg = 'Sell and Buy currency should be not be same.';
      return false;
    }
    return true;
  }
  getCustomerDetails(res) {
    console.log('in getCustomerDetails', res);
    /*
    console.log(res);
    // this.sellPortfolioDetails
    console.log(this.allPortfolioDetails);
    console.log(this.allPortfolioDetails[0]);

    this.RMPortfolioDetails = res;
    console.log(this.RMPortfolioDetails);
    if (this.RMPortfolioDetails.length > 0) {
      this.sellPortfolioName = this.RMPortfolioDetails[0].PortfolioName;
      this.fnSellPortfolioNameChange();
    }
*/
    // for(var i=0; i < this.allPortfolioDetails.length;i++){
    // //  console.log(item);
    //  console.log(this.allPortfolioDetails[i].Customer_Name);
    // }
    // console.log(this.buyPortfolioDetails);
    // console.log(this.sellPortfolioDetails);

    // AccountNo: "1000000000", PortfolioName: "32986-S-SMF-1", SICurrency: "AUD"

    /* if (res.length > 0) {
       this.portfolioList = [];
       this.selectedCustomerDetails = res;
       const map = new Map();
       for (const item of res) {
         if (!map.has(item.PortfolioName)) {
           map.set(item.PortfolioName, true); // set any value to Map
           this.portfolioList.push(item.PortfolioName);
         }
       }
       this.updateCustomerPortfolioDetails();
     }
   */
  }
  updateCustomerPortfolioDetails() {
    /*
      this.accountList = [];
      this.CurrencyList = [];
//console.log('Update ccy: ', this.currency);
      const temp: any = this.selectedCustomerDetails.filter(obj => {
        return obj.PortfolioName === this.portfolio;
      }
      );
      temp.forEach(element => {
        this.accountList.push(element.AccountNo);
        this.CurrencyList.push(element.SICurrency);
      });
      this.Account_Number = this.accountList[0];
      // this.currency = this.data.Ccy = this.CurrencyList[0];
      this.updateCcy();
      // this.ChangeSelectedportfolio();
      */
  }
  clear() {
    var date11 = new Date();
    // this.tradeDate = this.datepipe.transform(date11, 'yyyy-MM-dd');
    this.tradeDate = this.datepipe.transform(date11, 'dd-MMM-yyyy');
    this.spotDate = this.datepipe.transform(date11, 'dd-MMM-yyyy');
    // this.tradeDate = "08-Jan-2021";
    // this.tradeDate = "2020-01-08";
    // const startDate = this.datePipe.transform(today, 'yyyy-MM-dd'); // '9-DEC-2011';
    this.notional = '1,000,000.00';
    this.spread = '20.00';
    this.coverRate = '1.30';
    this.calculateSpotRate();
  }
}
