import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { Subscription } from 'rxjs';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-overdraft',
  templateUrl: './overdraft.component.html',
  styleUrls: ['./overdraft.component.scss']
})
export class OverdraftComponent implements OnInit {
  isProd = environment.production;

  ODCurrency: string;
  currencyList: any = [];
  ODAmount: string;
  baseLendingRate: string;
  intCalcFreq: string;
  isCollaterized: string;
  pledgedAgainst: string;
  accountType: string;
  moredetails: string;
  tenor: number;
  tenorUnit: string;
  tenorUnitList: any = [];
  ODLimit: string;
  startDate: string;
  drawdownDate: string;
  accountNumber: string;
  accountList: any = [];
  portfolioID: string;
  portfolioList: any = [];
  loadflag: boolean;
  successMsg: string;
  username: string;
  clientName: string;
  multiportfoliodata: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;
  portfolioCcyList = [];
  portfolioAccount = [];
  ODAccountDetails: any;
  CIF: string;
  AccountTypeList = [];
  stringXML: string;
  pledgedAgainstDataArray: any = [];
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  CurrencyList = [];
  showSubmit: boolean;
  constructor(public cfs: CommonApiService, private api: CustomerApiService, private afs: WorkflowApiService) {
    this.ODCurrency = 'AUD';
    this.ODAmount = '1,000,000.00';
    this.baseLendingRate = '2.15';
    this.intCalcFreq = 'Monthly';
    this.isCollaterized = 'N';
    this.pledgedAgainst = '';
    this.moredetails = 'More Details';
    this.tenorUnitList = ['Week', 'Month', 'Year'];
    this.tenor = 1;
    this.tenorUnit = 'Month';
    this.ODLimit = '25,000,000.00';
    this.startDate = moment().format('DD-MMM-YYYY');
    this.drawdownDate = moment(this.startDate, 'DD-MMM-YYYY').add(1, "month").format('DD-MMM-YYYY');
    this.successMsg = '';
    this.loadflag = false;
    this.stringXML = '';
    this.pledgedAgainst = '';
    this.username = sessionStorage.getItem('Username');
    this.clientName = sessionStorage.getItem('CustomerNamemisc1');
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;

    this.afs.getmultiPortfolio(this.username);
    this.api.fngetCustAccountDetails(this.username);
    this.getCurrencyPairs();
    this.api.getPledgedAgainstData('OD Pledged Against');

    this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(res => {
      if (res.length !== 0) {
        if (Object.keys(res).length === 0 && res.constructor === Object) {

        } else if(res.status === true){
    //console.log(res);
          // res.forEach(element => {
          const result = [];
          // for (const item of res) {
          //   if (!map.has(item.portfolio)) {
          //     map.set(item.portfolio, true); // set any value to Map
          //     if (item.portfolio) {
          //       result.push({
          //         portfolio: item.portfolio,
          //         ccy1: item.Accountcurrency,
          //         cif: item.CIF
          //       });
          //     }
          //   }
          // }
          this.portfolioCcyList = [];
          res = res.message ;
          for (const item of res) {
            // if (!map.has(item.portfolio)) {
            // map.set(item.portfolio, true); // set any value to Map
            if (item.portfolio) {
              result.push({
                portfolio: item.portfolio,
                ccy1: item.Accountcurrency,
                cif: item.CIF,
                accType: item.accounttype
              });
              this.portfolioCcyList.push(item.Accountcurrency);
            }
            // }
          }
          this.ODAccountDetails = result;
    //console.log('result: ', result)
          this.CIF = result[0].cif;
    //console.log('CIF: ', this.CIF)
          this.portfolioList = [];
          result.forEach(element => {
            this.portfolioList.push(element.portfolio);
          });
          // });
        }
        this.portfolioAccount = [];
        res.forEach(element => {
          if (element.portfolio) {
            this.portfolioAccount.push([element.portfolio, element.accountnumber, element.Accountcurrency]);
          }
        });
        // this.CustomerName = res[0].misc1;
        this.portfolioID = this.portfolioList[0];
        this.accountNumber = this.portfolioAccount[0][1];
        this.ODCurrency = this.portfolioAccount[0][2];
        this.PortfolioChange();
        this.ChangeSelectedportfolio();
      }
    });

    this.api.loanOrderObserver.subscribe(res => {
      if (res.length !== 0) {
  //console.log(res);
        this.loadflag = false;
        this.successMsg = 'Order placed successfully. Order Ref No.: ' + res.SaveUCPResult[0].NoteMasterID;
      }
    });

    this.api.getCustAccountDetails.subscribe(res => {
      if (res.length !== 0) {
  //console.log(res);
        // this.accountNumber = res.Account_No;
        this.accountType = res.accounttype;
        // this.portfolio = res.portfolio;
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
        this.ODCurrency = 'AUD';
        // this.currency = 'AUD';
      }
    });

    this.api.pledgedAgainstDataObserver.subscribe((res: any) => {
      if (res.Get_Configurable_Common_DataResult) {
        let data: any = res.Get_Configurable_Common_DataResult;
        data.forEach(element => {
          this.pledgedAgainstDataArray.push(element.DATA_VALUE);
        });
        this.pledgedAgainst = this.pledgedAgainstDataArray[0];
  //console.log(this.pledgedAgainstDataArray);
      }
    });
  }

  changeEndDate() {
    this.drawdownDate = moment(this.startDate, "DD-MMM-YYYY").add(this.tenor, <unitOfTime.DurationConstructor>this.tenorUnit.toLowerCase()).format("DD-MMM-YYYY");
  }

  updatePortfolio() {
    if(this.isUserRM) {
      this.updateCustomerPortfolioDetails();
    } else {
      this.ChangeSelectedportfolio();
    }
  }

  updateCustomerPortfolioDetails() {
    this.successMsg = '';
    this.accountList = [];
    this.CurrencyList = [];
    let temp: any = this.selectedCustomerDetails.filter(obj => {
      return obj.PortfolioName === this.portfolioID;
    }
    )
    temp.forEach(element => {
      this.accountList.push(element.AccountNo);
      this.CurrencyList.push(element.SICurrency);
    });
    this.accountNumber = this.accountList[0];
    // this.currency = this.data.Ccy = this.CurrencyList[0];
    this.updateCcy();
    this.ChangeSelectedportfolio();
  }

  updateCcy() {
    this.successMsg = '';

    let temp: any = this.selectedCustomerDetails.filter(obj => {
      return obj.AccountNo === this.accountNumber;
    }
    )
    this.ODCurrency = temp[0].SICurrency;
  }

  getCustomerDetails(res) {
    this.successMsg = '';
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

  PortfolioChange() {
    this.successMsg = '';
    this.showSubmit = true;

    try {
      this.accountList = [];
      this.portfolioList = [];
      this.accountList = [];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.portfolioAccount.length; i++) {
        if (this.portfolioAccount[i][2] === this.ODCurrency) {

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
        this.successMsg = 'Portfolio with selected Currency is not available. Please select different Currency.';
        this.showSubmit = false;
      }
    } catch (error) {
      // this.successMsg = 'An error has occured while loading user portfolio details.';
    }

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
    this.startDate = moment(date).format('DD-MMM-YYYY');
    this.drawdownDate = this.startDate;
  }

  ChangeSelectedportfolio() {
    try {
      this.portfolioCcyList = [];
      this.AccountTypeList = [];
      for (let i = 0; i < this.portfolioList.length; i++) {
        if (this.portfolioList[i] === this.portfolioID) {
          this.accountNumber = this.accountList[i];
        }
      }
      this.portfolioCcyList = this.ODAccountDetails.filter(e => e.portfolio === this.portfolioID).map(e => e.ccy1);
      this.AccountTypeList = this.ODAccountDetails.filter(e => e.portfolio === this.portfolioID).map(e => e.accType);
//console.log("Account type list", this.AccountTypeList)
      if (this.accountNumber === '') {
        this.successMsg = 'Portfolio with Currency is not available. Please select different Currency.';

      }
    } catch (error) {
      // this.successMsg = 'An error has occured while loading user portfolio details.'
    }

  }



  getCurrencyPairs() {
    this.api.GetAllTradableCurrency();
  }

  getTenorCode(unit: string) {
    switch (unit) {
      case "Month":
        return "M"

      case "Week":
        return "W"

      case "Year":
        return "Y"
    }
  }

  OrderSubmit() {
    try {
      this.loadflag = true;
      let templateCode = 'Overdrafts';
      let mode = 'Insert';
      let noteMasterId = 0;
      this.successMsg = '';

      this.stringXML = '<dtDataFromXML>';
      this.stringXML = this.stringXML + '<Account_Number>' + this.accountNumber + '</Account_Number>';
      this.stringXML = this.stringXML + '<HEDGING_TYPE>POOLING</HEDGING_TYPE>';
      this.stringXML = this.stringXML + '<Account_Type>' + this.accountType + '</Account_Type>';
      this.stringXML = this.stringXML + '<Portfolio_Name>' + this.portfolioID + '</Portfolio_Name>';
      this.stringXML = this.stringXML + '<ClientName>' + this.clientName + '</ClientName>';
      this.stringXML = this.stringXML + '<Currency>' + this.ODCurrency + '</Currency>';
      this.stringXML = this.stringXML + '<Notional_Amt>' + this.cfs.UnformatNumberwithoutevent(this.ODAmount) + '</Notional_Amt>';
      this.stringXML = this.stringXML + '<ODLimit>' + this.cfs.UnformatNumberwithoutevent(this.ODLimit) + '</ODLimit>';
      this.stringXML = this.stringXML + '<PaymentFreq>' + this.intCalcFreq + '</PaymentFreq>';
      this.stringXML = this.stringXML + '<Collaterized>' + this.isCollaterized + '</Collaterized>';
      this.stringXML = this.stringXML + '<PledgedAgainst>' + this.pledgedAgainst + '</PledgedAgainst>';
      this.stringXML = this.stringXML + '<FixedInterestRate>' + this.baseLendingRate + '</FixedInterestRate>';
      this.stringXML = this.stringXML + '<ODStartDate>' + this.startDate + '</ODStartDate>';
      this.stringXML = this.stringXML + '<FirstDrawdownDate>' + this.drawdownDate + '</FirstDrawdownDate>';
      this.stringXML = this.stringXML + '<ODTenor>' + this.tenor + this.getTenorCode(this.tenorUnit) + '</ODTenor>';
      this.stringXML = this.stringXML + '<CIF>' + this.CIF + '</CIF>';
      this.stringXML = this.stringXML + '</dtDataFromXML>';

//console.log('OD Entry', this.stringXML);
      this.api.saveLoanOrder(this.stringXML, this.username, templateCode, mode, noteMasterId);
    } catch (error) {
      this.successMsg = 'An error has occured while saving OD Deal. Please try again.'
    }

  }


}
