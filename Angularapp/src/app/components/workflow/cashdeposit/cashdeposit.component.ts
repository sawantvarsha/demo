import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-cashdeposit',
  templateUrl: './cashdeposit.component.html',
  styleUrls: ['./cashdeposit.component.scss']
})
export class CashdepositComponent implements OnInit, OnDestroy {

  @Input() pageMode: number;
  @Output() ClosePopUp: EventEmitter<any> = new EventEmitter();
  nominal: any;
  hide = false;
  Account_Number: any;
  CustomerName: any;
  portfolio: any;
  accounttype: any;
  stringXML: string;
  TransactionCode = 'Deposit';
  customerId: any;
  valueDate: any;
  transactionName: any;
  settlementDate: any;
  tradeDate: any;
  amount: any;
  maturityDate: any;
  currency: any;
  successMsg = '';
  username: string;
  CurrencyList = [];
  customerNamePortfolio = [];

  isProd = environment.production;
  loadflag = false;
  constructor(public cfs: CommonApiService, private afs: CustomerApiService, private ccf: CustomerCommonfunctionsService, public homeapi: HomeApiService, public authApi: AuthService) {
    this.amount = 0;
  }

  ngOnInit(): void {
    if (this.pageMode === undefined) {
      this.pageMode = 0;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if(this.authApi.UserType === 'RM'){
      this.username = sessionStorage.getItem("RMUser");
    } else{
      this.username = this.authApi.UserName;
    }
  
    this.afs.fngetCustAccountDetails(this.username);
    const today = new Date();
    // eslint-disable-next-line max-len
    this.tradeDate = ((today.getDate() < 10) ? ('0' + today.getDate()) : today.getDate()) + '-' + ((today.getMonth() + 1) < 10 ? ((months[today.getMonth()])) : (months[today.getMonth()])) + '-' + today.getFullYear();
    this.successMsg = '';

    // this.afs.allTradablePairObserver.subscribe((res: any) => {
    //   if (res) {
    //     this.CurrencyList = [];
    //     const map = new Map();
    //     // const obj = JSON.parse(res);
    //     res.forEach((element) => {
    //       map.set('' + element.Asset1, element.Asset1);
    //       map.set('' + element.Asset2, element.Asset2);
    //     });
    //     this.CurrencyList = Array.from(map.keys()).sort();
    //     console.log(this.CurrencyList);
    //     this.currency = 'AUD';
    //   }
    // });


    this.afs.CashDepositsObserver.subscribe(res => {
      if (res.length !== 0) {
        // console.log(res);
        if (![null, undefined].includes(res.SaveUCPResult[0].OrderNo)) {
          this.successMsg = 'Order placed successfully. Ref ID.:' + res.SaveUCPResult[0].NoteMasterID;
        } else {
          this.successMsg = res.SaveUCPResult[0].WarningMessage;
        }

        this.loadflag = false;
      }
    });

    this.ccf.redirecttoCashDepositObserver.subscribe((res) => {
      if (res !== '') {
        //this.Account_Number = res.accountnumber;
        //this.CustomerName = res.misc1;
        //this.portfolio = res.portfolio;
        //this.accounttype = res.accounttype;
        //this.customerId = res.CustomerID;
        //this.currency = res.Accountcurrency;
        this.Account_Number = res.Param1;
        this.CustomerName = res.Param5;
        // this.CustomerName = this.homeapi.CustomerId;
        // this.portfolio = res.Param5;
        this.portfolio = res.Param3;
        // this.accounttype = res.accounttype;
        this.accounttype = 'Saving';
        this.authApi.UserType === 'RM' ?  this.customerId  = sessionStorage.getItem('RMCustID') :  this.customerId = this.homeapi.CustomerId;
        // this.customerId = this.homeapi.CustomerId;
        this.currency = res.Param4;
        this.successMsg = '';
      }
    });
  }

  ngOnDestroy() {
    this.successMsg = '';
  }

  OrderSubmit() {
    this.loadflag = true;
    this.successMsg = '';
    if (this.amount === 0) {
      this.loadflag = false;
      this.successMsg = 'Please enter amount.';
    } else {

      this.stringXML = '<ExcelSheets><Cash_Adjustment><Transaction_Code>' + this.TransactionCode.toUpperCase() + '</Transaction_Code>';
      this.stringXML = this.stringXML + '<HEDGING_TYPE>Dynamic</HEDGING_TYPE>';
      this.stringXML = this.stringXML + '<Customer_ID>' + this.customerId + '</Customer_ID><Denomination_Ccy>';
      this.stringXML = this.stringXML + this.currency + '</Denomination_Ccy><denomination_Ccy>' + this.currency + '</denomination_Ccy>';
      this.stringXML = this.stringXML + '<Facility_Description>' + this.portfolio + '</Facility_Description>';
      this.stringXML = this.stringXML + '<RH_Payment_Type></RH_Payment_Type>';
      this.stringXML = this.stringXML + '<RH_Value_Date>' + this.tradeDate + '</RH_Value_Date>';
      this.stringXML = this.stringXML + '<RH_Settlement_Date>' + this.tradeDate + '</RH_Settlement_Date>';
      this.stringXML = this.stringXML + '<Account_Type>' + this.accounttype + '</Account_Type>';
      this.stringXML = this.stringXML + '<Account_No>' + this.Account_Number + '</Account_No>';
      this.stringXML = this.stringXML + '<RH_Rule_Level>Deal</RH_Rule_Level>';
      this.stringXML = this.stringXML + '<Transaction_Name>Cash Deposit</Transaction_Name>';
      this.stringXML = this.stringXML + '<RH_Asset>' + this.currency + '</RH_Asset>';
      this.stringXML = this.stringXML + '<RH_Formula>' + this.amount + '</RH_Formula>';
      this.stringXML = this.stringXML + '<Trade_Date>' + this.tradeDate + '</Trade_Date>';
      this.stringXML = this.stringXML + '<Maturity_Date>' + this.tradeDate + '</Maturity_Date>';
      this.stringXML = this.stringXML + '</Cash_Adjustment></ExcelSheets>';

      this.afs.saveCashDeposits(this.stringXML, this.authApi.UserName, 'Cash_Adjustment');

    }

  }

  selectDate(reqPram, date) {
    switch (reqPram) {
      case 'tradeDate':
        this.tradeDate = moment(date).format('DD-MMM-YYYY');
        break;
      case 'settlementDate':
        this.settlementDate = moment(date).format('DD-MMM-YYYY');
        break;
    }
  }

  fnClosePopUp() {
    this.ClosePopUp.emit(false);
  }
}
