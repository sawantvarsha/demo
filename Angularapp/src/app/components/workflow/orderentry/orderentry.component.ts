import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-orderentry',
  templateUrl: './orderentry.component.html',
  styleUrls: ['./orderentry.component.scss'],
})
export class OrderentryComponent implements OnInit, OnDestroy {
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
  portfolioList = [];
  portfolioAccount = [];
  constructor(
    private elem: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
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
      // console.info('This is' + icons.heart + ' Glyphicons!');
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ngOnDestroy() {
    this.afs.multiportfolio.next([]);
    this.multiportfoliodata.unsubscribe();
    this.portfolioList = [];
    console.log('destroy');
  }

  ngOnInit(): void {
    const that = this;
    this.username = sessionStorage.getItem('Username');
    this.api.fngetCustAccountDetails(this.username);

    this.afs.fundDetails.subscribe((mf) => {
      //console.log(mf);
      that.mfList = mf.filter((item) =>
        item.Name.toLowerCase().startsWith(that.mutualFund.toLowerCase())
      );
      //   that.switchList = mf.filter(item => item.Name.toLowerCase().startsWith(that.switchFund.toLowerCase()));
      //console.log(that.mfList);
    });

    if (this.mfList) {
      this.data.Name = sessionStorage.getItem('MF_Name');
      this.data.Manager = sessionStorage.getItem('MF_Manager');
      this.data.Ccy = sessionStorage.getItem('MF_Ccy');
      this.data.Min_Inv_Amt = sessionStorage.getItem('MF_Min_Inv_Amt');
      this.data.Rating = sessionStorage.getItem('MF_Rating');
      this.data.BidNAV = sessionStorage.getItem('MF_NAV');
      this.data.Sector = sessionStorage.getItem('MF_Sector');
      this.data.AnnualFees = sessionStorage.getItem('MF_AnnualFees');
      this.data.Units = sessionStorage.getItem('MF_Units');
      this.data.TrailerFees = sessionStorage.getItem('MF_TrailerFees');
      if (parseInt(sessionStorage.getItem('MF_notional'), 10)) {
        this.notional = parseInt(sessionStorage.getItem('MF_notional'), 10);
      } else {
        this.notional = 0;
      }
      this.data.Code = sessionStorage.getItem('MF_Code');
      // this.validation = sessionStorage.getItem('MF_validation');
      // this.successMsg = sessionStorage.getItem('MF_successMsg');

      // console.log(this.data['MF_Name']);
      this.nowname = this.data.Name;
    }

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
        this.portfolio = res.portfolio;
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
        this.currency = 'AUD';
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
      if (data) {
        //   this.successMsg = data;
        this.loadflag = false;
        this.loadflag1 = false;
        this.loadflag2 = false;
        if (data === 'FAIL' || data === 'Undefined') {
          this.successMsg = 'Order placement failed';
        } else {
          if (this.subscribeFlag === true) {
            this.successMsg =
              'Order placed successfully. Order Ref No.:' + data;
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
        }
      }
    });
    this.afs.getmultiPortfolio(this.username);
    this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          if (Object.keys(res).length === 0 && res.constructor === Object) {
          } else if (res.status) {
            // res.forEach(element => {
            res = res.message;
            const result = [];
            const map = new Map();
            for (const item of res) {
              if (!map.has(item.portfolio)) {
                map.set(item.portfolio, true); // set any value to Map
                result.push({
                  portfolio: item.portfolio,
                });
              }
            }

            this.portfolioList = [];
            result.forEach((element) => {
              this.portfolioList.push(element.portfolio);
            });
            //console.log(result);
            // });
          }

          res.forEach((element) => {
            this.portfolioAccount.push([
              element.portfolio,
              element.accountnumber,
            ]);
          });
          this.PortfolioChange();
          //console.log(this.portfolioAccount);
        }
      }
    );
  }

  selectShare(e) {
    try {
      // console.log('fun: selectShare')
      const target: any = this.cfs.GetEventTarget(e);
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
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }

  onClickedOutside(e: Event) {
    try {
      this.showSuggestions = false;
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ChangeIndex(e) {
    try {
      this.selectedMFIndex = 0;
      this.selectedMFIndex1 = 0;
      this.selectedMFIndex2 = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }

  filterFun(e) {
    try {
      // console.log('newfun');
      const that = this;
      const key = 'item1';
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

  clearBtn(action) {
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

  selectShare1(e) {
    try {
      const target: any = this.cfs.GetEventTarget(e);
      const fund = $('.HoverSuggestion').data('mf');
      this.selectShare(fund);
      this.successMsg = '';
      this.Units = 0;
      this.notional = 0;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ApplicationTypeChange(Event) {
    this.ApplicationType = Event.target.value;
    if (this.ApplicationType === 'Subscription') {
      this.FrontExitLoad = 'Front-End Load';
    } else if (this.ApplicationType === 'Redemption') {
      this.FrontExitLoad = 'Exit Load';
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
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.portfolioAccount.length; i++) {
      if (this.portfolioAccount[i][0] === this.portfolio) {
        this.accountList.push(this.portfolioAccount[i][1]);
      }
    }
    this.Account_Number = this.accountList[0];
    console.log('acc', this.Account_Number);
  }
}
