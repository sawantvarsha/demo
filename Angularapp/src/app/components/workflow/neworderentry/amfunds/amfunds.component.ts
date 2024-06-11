import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-amfunds',
  templateUrl: './amfunds.component.html',
  styleUrls: ['./amfunds.component.scss'],
})
export class AmfundsComponent implements OnInit, OnDestroy {
  isProd = environment.production;
  ApplicationType = 'Subscription';
  searchMF = [];
  mfList = [];
  data: any = [];
  switchList = [];
  switchData = [];
  validation: any;
  mutualFund = '';
  mutualFundHouse = '';
  mutualFundType = '';
  showSuggestions = false;
  showSuggestions1: false;
  showSuggestions2: false;
  showFundDetails: boolean;
  selectedMFIndex = 0;
  selectedMFIndex1 = 0;
  selectedMFIndex2 = 0;
  successMsg = '';
  subscribeFunds: boolean;
  Units: any;
  flag: any;
  applicationTypeFlag = false;
  NewUnits: any;
  notional: any;
  loadflag: boolean;
  nowname: any;
  switchflag: boolean;
  loadflag1: boolean;
  loadflag2: boolean;
  redeemflag: boolean;
  portfolioflag: boolean;
  redeemUnits: any;
  remainingUnits: any;
  portfolioMF: any;
  switchname: any;
  redeemMF1: any;
  switchMF: any;
  switchFund = '';
  SwitchUnits: any;
  ExistingHoldings: any;
  validationMsgRedeem: any;
  validationMsgSwitch: any;
  successMsgRedeem: any;
  successMsgSwitch: any;
  subscribeFlag: any;
  orderflag: boolean;
  FundsBlotterArray = [];
  RM = '';
  Book = '';
  nominal: any;
  hours1: any;
  ampm: any;
  min1: any;
  selectedCustomerValue = '';
  Account_Name: string;
  Account_Number: string;
  accountList = [];
  Address_Details: string;
  BSB: string;
  Contact_Number: string;
  CustomerType: string;
  CustomerName: string;
  DOB: string;
  IdentificationType: string;
  IdentificationNo: string;
  Nationality: string;
  Nature_of_Business: string;
  Postal_Details: string;
  portfolio: string;
  CustomerID: any;
  userID: string;
  multiportfoliodata: Subscription;
  FrontExitLoad = 'Front-End Load';
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
  pageName: string;
  username: string;
  CurrencyList = [];
  currency: any;
  ccy = [];
  portfolioList = [];
  portfolioAccount = [];
  moredetails = 'More Details';
  msg = '';
  FromDate: any;
  ToDate: any;
  Frequency = 'Anually';
  stringXML = '';
  redeemingUnits: any;

  customersOfRMArray: any = [];
  selectedCustomer: string;
  searchedCustomers: any = [];
  selectedCustomerIndex = 0;
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  showSubmit: boolean;
  popUpflag: boolean;
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
  constructor(
    private elem: ElementRef,
    public cfs: CommonApiService,
    private afs: WorkflowApiService,
    private api: CustomerApiService
  ) {
    try {
      this.notional = 0;
      this.Units = 0;
      this.showFundDetails = false;
      this.loadflag = false;
      this.subscribeFunds = false;
      this.switchflag = false;
      this.portfolioflag = false;
      this.redeemflag = false;
      this.loadflag1 = false;
      this.loadflag2 = false;
      this.redeemUnits = 0;
      this.subscribeFlag = false;
      this.orderflag = false;
      this.pageName = 'Order Entry';
      this.popUpflag = false;
      // console.info('This is' + icons.heart + ' Glyphicons!');

      this.showSubmit = false;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ngOnDestroy() {
    this.afs.multiportfolio.next([]);
    this.multiportfoliodata.unsubscribe();
    console.log('destroy');
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;

    const that = this;
    this.username = sessionStorage.getItem('Username');
    if (this.userType.toUpperCase() === 'RM') {
      this.api.getCustomersOfRM(this.username);
    }
    this.api.fngetCustAccountDetails(this.username);

    const months = [
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
    const today = new Date();
    this.FromDate =
      (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
      '-' +
      (today.getMonth() + 1 < 10
        ? months[today.getMonth()]
        : months[today.getMonth()]) +
      '-' +
      today.getFullYear();
    this.ToDate = this.FromDate;
    this.afs.fundDetails.subscribe((mf) => {
      //console.log(mf);
      that.mfList = mf.filter((item) =>
        item.Name.toLowerCase().startsWith(that.mutualFund.toLowerCase())
      );
      //   that.switchList = mf.filter(item => item.Name.toLowerCase().startsWith(that.switchFund.toLowerCase()));
      //console.log(that.mfList);
    });

    if (history.state.FundName !== '') {
      //console.log(this.mfList);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.mfList.length; i++) {
        // console.log(this.mfList[i]['Name'],(this.mfList[i]['Name']+'').includes('AB FCP I - American Incom'));
        if ((this.mfList[i].Name + '').includes(history.state.FundName)) {
          this.showFundDetails = true;
          this.data = this.mfList[i];
          this.nowname = this.data.Name;
          // console.log(this.data);
          break;
        } else {
          this.showFundDetails = false;
        }
      }
    }
    this.username = sessionStorage.getItem('Username');

    this.api.getCustAccountDetails.subscribe((res) => {
      if (res !== undefined) {
        if (res.length !== 0) {
          //console.log(res);

          this.Account_Name = res.Account_Name;
          // this.Account_Number = res.accountnumber;
          this.Address_Details = res.Address_Details;
          this.BSB = res.BSB;
          this.Contact_Number = res.Contact_no;
          this.CustomerType = res.CustomerType;
          this.CustomerID = res.CustomerID;
          this.CustomerName = res.misc1;
          this.DOB = res.Date_of_birth;
          this.IdentificationType = res.Identification_type;
          this.IdentificationNo = res.Identificatoin_number;
          this.Nationality = res.Nationality;
          this.Nature_of_Business = res.NatureOfBusiness;
          this.Postal_Details = res.Postal_Address;
          this.afs.GetsuitabilityCheckData(
            this.CustomerName,
            this.CustomerID,
            this.username
          );
          // this.portfolio = res.portfolio;
        }
      }
    });
    this.api.GetAllTradableCurrency();
    this.api.allTradablePairObserver.subscribe((res: any) => {
      if (res) {
        this.CurrencyList = [];
        const map = new Map();
        // const obj = JSON.parse(res);
        res.forEach((element) => {
          map.set('' + element.Asset1, element.Asset1);
          map.set('' + element.Asset2, element.Asset2);
        });
        this.CurrencyList = Array.from(map.keys()).sort();
        //console.log(this.CurrencyList);
        // this.currency = 'AUD';
      }
    });

    this.afs.holdingsObserver.subscribe((res) => {
      if (res.length !== 0) {
        if (res['GetHoldingsResult'].length !== 0) {
          this.ExistingHoldings = res['GetHoldingsResult'][0].Units;
          //console.log(res);
          if (this.ExistingHoldings >= this.Units) {
            this.remainingUnits = this.ExistingHoldings - this.Units;
            // eslint-disable-next-line max-len
            this.afs.SubscribeFunds(
              0,
              this.data.Code,
              'Redeemption',
              'RD',
              '',
              '',
              '00000',
              'SRS',
              this.remainingUnits,
              this.data.Ccy,
              this.RM,
              this.Book,
              this.CustomerType,
              this.CustomerName,
              this.DOB,
              this.IdentificationType,
              this.IdentificationNo,
              this.Nationality,
              this.Account_Number,
              this.portfolio,
              this.username
            );
          } else {
            this.loadflag = false;
            this.successMsg = 'Holding units less than redeem units.';
          }
        } else {
          if (this.subscribeFlag === true) {
            this.loadflag = false;
            this.successMsg = 'Holding units less than redeem units.';
          }
        }
      }
    });

    this.api.CashDepositsObserver.subscribe((res) => {
      if (res.length !== 0) {
        //console.log(res);
        this.loadflag = false;

        this.successMsg =
          'Order placed successfully. Order Ref No.:' +
          res.SaveUCPResult[0].NoteMasterID;
      }
    });

    this.afs.fundSubscribeObserver.subscribe((data) => {
      const d1 = new Date();
      if (d1.getHours() >= 12) {
        if (d1.getHours() === 12) {
          this.hours1 = d1.getHours();
        } else {
          this.hours1 = d1.getHours() % 12;
        }
        this.ampm = 'PM';
      } else {
        this.hours1 = d1.getHours();
        this.ampm = 'AM';
      }
      if (d1.getMinutes() < 10) {
        this.min1 = '0' + d1.getMinutes();
      } else {
        this.min1 = d1.getMinutes();
      }
      if (data !== 'FAIL') {
        //   this.successMsg = data;
        this.loadflag = false;
        this.loadflag1 = false;
        this.loadflag2 = false;
        // if (data === false ) {
        //   this.successMsg = 'Order placement failed';
        // } else {

        if (this.subscribeFlag === true) {
          this.successMsg = 'Order placed successfully. Order Ref No.:' + data;
          this.orderflag = true;
        }
        this.orderTime =
          d1.getDate() +
          '-' +
          this.monthNames[d1.getMonth()] +
          '-' +
          d1.getFullYear() +
          ' ' +
          this.hours1 +
          ':' +
          this.min1 +
          ' ' +
          this.ampm;

        // }
      } else {
        this.successMsg = 'Order placement failed';
      }
    });
    this.afs.getmultiPortfolio(this.username);

    this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          if (res.status) {
            //console.log(res);
            // res.forEach(element => {
            const result = [];
            const map = new Map();
            res = res.message;
            for (const item of res) {
              if (!map.has(item.portfolio)) {
                map.set(item.portfolio, true); // set any value to Map
                result.push({
                  portfolio: item.portfolio,
                  ccy: item.Accountcurrency,
                });
              }
            }

            this.portfolioList = [];
            result.forEach((element) => {
              this.portfolioList.push(element.portfolio);
            });
            //console.log(this.portfolioList);
            this.portfolioAccount = [];
            res.forEach((element) => {
              this.portfolioAccount.push([
                element.portfolio,
                element.accountnumber,
                element.Accountcurrency,
              ]);
            });

            this.portfolio = this.portfolioList[0];
            this.Account_Number = this.portfolioAccount[0][1];
            this.currency = this.portfolioAccount[0][2];
            // this.PortfolioChange();
            //console.log(this.portfolioAccount);
          } else {
            // });
          }
        }
      }
    );

    this.afs.suitabilityCheck.subscribe((res) => {
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

    this.cfs.selectedAssetObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.mfList.forEach((element) => {
          if (res.toString().includes(element.Name)) {
            this.data = [];
            this.data = element;
          }
        });
      }
    });
  }

  updatePortfolio() {
    if (this.isUserRM) {
      this.updateCustomerPortfolioDetails();
    } else {
      this.ChangeSelectedportfolio();
    }
  }

  getPortfolioFromFund() {
    this.portfolioList = [];
    this.accountList = [];
    this.CurrencyList = [];
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.SICurrency === this.data.Ccy;
    });

    if (temp.length) {
      temp.forEach((element) => {
        this.portfolioList.push(element.PortfolioName);
        this.accountList.push(element.AccountNo);
        this.CurrencyList.push(this.data.Ccy);
      });

      // this.portfolio = temp[0].PortfolioName
    } else {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
      this.showSubmit = false;
    }
  }

  updateCustomerPortfolioDetails() {
    this.accountList = [];
    this.CurrencyList = [];
    console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.PortfolioName === this.portfolio;
    });
    temp.forEach((element) => {
      this.accountList.push(element.AccountNo);
      this.CurrencyList.push(element.SICurrency);
    });
    this.Account_Number = this.accountList[0];
    // this.currency = this.data.Ccy = this.CurrencyList[0];
    this.updateCcy();
    // this.ChangeSelectedportfolio();
  }

  updateCcy() {
    console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.AccountNo === this.Account_Number;
    });
    if (temp.length) {
      this.currency = this.data.Ccy = temp[0].SICurrency;
    }
  }

  getCustomerDetails(res) {
    console.log(res);
    if (res.length > 0) {
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
  }

  selectCustomer(e) {
    this.portfolioList = [];
    this.accountList = [];
    this.CurrencyList = [];
    try {
      // const customer = $('.HoverSuggestion').data('customer');
      const customer = e;
      let customerID = this.customersOfRMArray.filter((obj) => {
        return obj.CustomerName === customer;
      });
      this.CustomerName = customer;
      customerID = customerID[0].CustomerID;

      //console.log('Customer ID: ', customerID);
      this.notional = 0;
      this.Units = 0;
      this.successMsg = '';
      this.selectedCustomer = customer || this.selectedCustomer;
      this.searchedCustomers = this.customersOfRMArray.filter((customer) => {
        // return mf.Name === fund;
        return customer.CustomerName === customer;
      });
      this.api.GetCustProfileDetailsFromCustID(customerID);
      // console.log(this.searchMF);
      // this.selectedCustomer = '';
      this.showSuggestions =
        this.showSuggestions1 =
        this.showSuggestions2 =
          false;
      // this.api.fngetCustAccountDetails(this.username);

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      // for (let i = 0; i < this.mfList.length; i++) {
      //   if (this.mfList[i].Code === e.split(':')[1]) {
      //     this.showFundDetails = true;
      //     this.data = this.mfList[i];
      //     break;
      //   } else {
      //     this.showFundDetails = false;
      //   }
      // }

      // this.nowname = this.data.Name;
    } catch (Error) {
      // console.log(Error);
    }
  }

  selectShare(e) {
    try {
      // console.log('fun: selectShare')
      const fund = $('.HoverSuggestion').data('mf');
      // console.log(fund);
      this.notional = 0;
      this.Units = 0;
      this.successMsg = '';
      this.mutualFund = fund || this.mutualFund;
      this.mutualFundHouse = '';
      this.mutualFundType = '';
      this.searchMF = this.mfList.filter((mf) => {
        return mf.Name === fund;
      });
      // console.log(this.searchMF);
      this.mutualFund = '';
      this.showSuggestions =
        this.showSuggestions1 =
        this.showSuggestions2 =
          false;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.mfList.length; i++) {
        if (this.mfList[i].Code === e.split(':')[1]) {
          this.showFundDetails = true;
          this.data = this.mfList[i];
          break;
        } else {
          this.showFundDetails = false;
        }
      }

      this.nowname = this.data.Name;
      // console.log(this.nowname);
      sessionStorage.setItem('MF_Name', this.data.Name);
      sessionStorage.setItem('MF_Manager', this.data.Manager);
      sessionStorage.setItem('MF_Ccy', this.data.Ccy);
      sessionStorage.setItem('MF_Min_Inv_Amt', this.data.Min_Inv_Amt);
      sessionStorage.setItem('MF_Rating', this.data.Rating);
      sessionStorage.setItem('MF_NAV', this.data.BidNAV);
      sessionStorage.setItem('MF_Sector', this.data.Sector);
      sessionStorage.setItem('MF_AnnualFees', this.data.AnnualFees);
      sessionStorage.setItem('MF_Units', this.data.Units);
      sessionStorage.setItem('MF_TrailerFees', this.data.TrailerFees);
      sessionStorage.setItem('MF_Code', this.data.Code);
      sessionStorage.setItem('MF_Ccy', this.data.Ccy);
      sessionStorage.setItem('MF_notional', this.notional);
      sessionStorage.setItem('portfolio', this.portfolio);

      let CRR = sessionStorage.getItem('CRR');
      if (this.cfs.isAlphaNumeric(CRR)) {
        CRR = CRR.substr(1, CRR.length);
      }
      // if (this.cfs.isAlphaNumeric(this.data.Rating)) {
      //   PRR = this.data.Rating.substr(1, this.data.Rating.length);
      // }
      if (CRR < this.data.Rating) {
        this.msg =
          'Customer Rating is less than product rating ! Please check.';
      } else {
        this.msg = '';
      }
      sessionStorage.setItem('Message', this.msg);
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }

  onClickedOutside(_e: Event) {
    try {
      this.showSuggestions = false;
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ChangeIndex(_e) {
    try {
      this.selectedMFIndex = 0;
      this.selectedMFIndex1 = 0;
      this.selectedMFIndex2 = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }

  filterFun(_e) {
    try {
      // console.log('newfun');
      const that = this;
      this.afs.fundDetails.subscribe((mf) => {
        that.mfList = mf.filter((item) =>
          item.Name.toLowerCase().includes(that.mutualFund.toLowerCase())
        );
        // console.log(that.mfList);
      });
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  subscribed(notional: any) {
    try {
      if (this.data.BidNAV === 0) {
        this.successMsg = 'NAV is 0. Please select other fund';
        this.loadflag = false;
      } else if (isNaN(this.notional) === true) {
        this.successMsg = 'Please enter the valid notional.';
        this.loadflag = false;
      } else if (this.notional <= 0) {
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (this.notional < this.data.Min_Inv_Amt) {
        this.successMsg = 'Notional should be greater than minimum investment.';
        this.loadflag = false;
      } else if (this.notional >= 1000000000) {
        this.successMsg = 'Notional should be less than 1,000,000,000.';
        this.loadflag = false;
      } else if (this.Account_Number === '') {
        this.successMsg = 'Account not found for the selected currency fund.';
        this.loadflag = false;
      } else {
        // console.log(this.data['Code']);
        if (this.data.Code) {
          this.subscribeFunds = true;

          this.subscribeFlag = true;
          // console.log(this.data['Ccy']);

          if (this.ApplicationType === 'Subscription') {
            this.afs.SubscribeFunds(
              notional,
              this.data.Code,
              'Subscription',
              'SB',
              '',
              '',
              '00000',
              '',
              notional / this.data.BidNAV,
              this.data.Ccy,
              this.RM,
              this.Book,
              this.CustomerType,
              this.CustomerName,
              this.DOB,
              this.IdentificationType,
              this.IdentificationNo,
              this.Nationality,
              this.Account_Number,
              this.portfolio,
              this.username
            );
          } else if (this.ApplicationType === 'Redemption') {
            this.afs.GetHoldingsDetailsForRedeem(
              this.CustomerID,
              this.data.Code
            );
          } else {
            this.OrderSubmit();
          }
        } else {
          this.successMsg = 'Fund Code is unavailable.';
        }
      }
      //   this.successMsg = '';
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  clearBtn(_action) {
    try {
      this.notional = 0;
      this.Units = 0;
      this.successMsg = '';
      this.validation = '';
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  unitCalculations(nominal, nav) {
    try {
      nav !== 0 ? (this.Units = nominal / nav) : (this.Units = 0);
      this.Units = this.Units.toFixed(2);
      this.validation = '';
      this.Units = this.cfs.FormatNumberr(this.Units);
      this.successMsg = '';
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShare1(_e) {
    try {
      const fund = $('.HoverSuggestion').data('mf');
      this.selectShare(fund);
      this.successMsg = '';
      this.Units = 0;
      this.notional = 0;
      this.PortfolioChange();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectCustomer1(_e) {
    try {
      const customer = $('.HoverSuggestion').data('customer');
      this.selectCustomer(customer);
      this.successMsg = '';
      this.Units = 0;
      this.notional = 0;
      this.PortfolioChange();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ApplicationTypeChange(Event) {
    this.ApplicationType = Event.target.value;
    if (this.ApplicationType === 'Subscription') {
      this.FrontExitLoad = 'Front-End Load';
      this.applicationTypeFlag = false;
    } else if (this.ApplicationType === 'Redemption') {
      this.FrontExitLoad = 'Exit Load';
      this.applicationTypeFlag = false;
    } else {
      this.applicationTypeFlag = true;
    }
  }

  calculateNotional(nav) {
    nav !== 0 ? (this.notional = this.Units * nav) : (this.notional = 0);
    this.notional = this.notional.toFixed(2);
    this.validation = '';
    this.notional = this.cfs.FormatNumberr(this.notional);
    this.successMsg = '';
  }

  PortfolioChange() {
    this.accountList = [];
    this.ccy = [];
    this.portfolioList = [];
    this.accountList = [];
    this.successMsg = '';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.portfolioAccount.length; i++) {
      if (this.portfolioAccount[i][2] === this.data.Ccy) {
        this.portfolioList.push(this.portfolioAccount[i][0]);
        this.accountList.push(this.portfolioAccount[i][1]);
        // this.accountList.push(this.portfolioAccount[i][1]);
        // Pratik S
        this.ccy.push(this.portfolioAccount[i][2]);
      }
    }
    if (this.portfolioList.length !== 0) {
      this.successMsg = '';
      this.portfolio = this.portfolioList[0];
      this.Account_Number = this.accountList[0];

      // Pratik S
      this.currency = this.ccy[0];
    } else {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
    }
    console.log('acc', this.Account_Number);
  }

  ChangeSelectedportfolio() {
    for (let i = 0; i < this.portfolioList.length; i++) {
      if (this.portfolioList[i] === this.portfolio) {
        this.Account_Number = this.accountList[i];
        // if (this.isUserRM === true) {
        //   this.currency = this.CurrencyList[i];
        // }
      }
    }
    if (this.Account_Number === '') {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different bond';
    }
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  accountNoChange() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
  }

  selectDate(reqPram, date) {
    switch (reqPram) {
      case 'FromDate':
        this.FromDate = moment(date).format('DD-MMM-YYYY');
        break;
      case 'ToDate':
        this.ToDate = moment(date).format('DD-MMM-YYYY');
        break;
    }
  }

  OrderSubmit() {
    this.loadflag = true;
    let type;
    if (this.ApplicationType === 'Systematic Investment Plan') {
      type = 'Systematic Investment Plan';
    } else {
      type = 'Systematic Withdrawal Plan';
    }

    if (this.FromDate >= this.ToDate) {
      this.successMsg = 'From Date must me less than To date';
      this.loadflag = false;
    } else if (this.notional <= 0) {
      this.successMsg = 'Please enter the notional.';
      this.loadflag = false;
    } else if (this.notional >= 1000000000) {
      this.successMsg = 'Notional should be less than 1,000,000,000.';
      this.loadflag = false;
    } else if (this.portfolio === '') {
      this.successMsg = 'Please select Portfolio';
      this.loadflag = false;
    } else if (this.Account_Number === '') {
      this.successMsg = 'Please select account number';
      this.loadflag = false;
    } else {
      this.successMsg = '';
      this.stringXML = '<ExcelSheets><RIS_Setup>';
      this.stringXML =
        this.stringXML +
        '<Facility_type>' +
        this.portfolio +
        '</Facility_type>';
      this.stringXML = this.stringXML + '<HEDGING_TYPE>Dynamic</HEDGING_TYPE>';
      this.stringXML =
        this.stringXML +
        '<CustomerName>' +
        this.CustomerName +
        '</CustomerName>';
      this.stringXML =
        this.stringXML + '<AccountType>' + this.portfolio + '</AccountType>';
      this.stringXML =
        this.stringXML +
        '<accountNumber>' +
        this.Account_Number +
        '</accountNumber>';
      this.stringXML =
        this.stringXML + '<FundCode>' + this.data.Code + '</FundCode>';
      this.stringXML = this.stringXML + '<nav>' + this.data.BidNAV + '</nav>';
      this.stringXML =
        this.stringXML + '<applicationType>' + type + '</applicationType>';
      this.stringXML =
        this.stringXML + '<RISAmount>' + this.notional + '</RISAmount>';
      this.stringXML =
        this.stringXML +
        '<RISSubscriptionDate>' +
        this.FromDate +
        '</RISSubscriptionDate>';
      this.stringXML =
        this.stringXML + '<Maturity_Date>' + this.ToDate + '</Maturity_Date>';
      this.stringXML =
        this.stringXML +
        '<risTransactionReferenceNumber>RIS' +
        (Math.round(Math.random() * 90000000) + 10000000) +
        '</risTransactionReferenceNumber>';
      this.stringXML =
        this.stringXML + '<Frequency>' + this.Frequency + '</Frequency>';
      this.stringXML = this.stringXML + '<RM_ID>' + this.RM + '</RM_ID>';
      this.stringXML = this.stringXML + '<Book_ID>' + this.Book + '</Book_ID>';
      this.stringXML = this.stringXML + '</RIS_Setup></ExcelSheets>';

      this.api.saveCashDeposits(
        this.stringXML,
        sessionStorage.getItem('Username'),
        'RIS_Setup'
      );
    }
  }

  showdetailsPopUp(notional) {
    if (this.popUpflag === true) {
      this.popUpflag = false;
    } else if (this.finalSuitabilityData.length !== 0 && notional !== 0) {
      if (this.suitabilityStatus === 'Not Eligible') {
        this.popUpflag = true;
      } else {
        this.popUpflag = false;
        this.subscribed(notional);
      }
    } else {
      this.popUpflag = false;
    }
  }
  selectedCustomerValue1(e) {
    console.log(e);
    this.CustomerName = e.CustomerName;
  }
}
