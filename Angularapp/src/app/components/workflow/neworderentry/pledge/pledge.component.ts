import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DecimalPipe } from '@angular/common';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.scss'],
})
export class PledgeComponent implements OnInit, OnDestroy {
  // @Input() Mode: Subject<string>;
  isProd = environment.production;
  PageMode = 0; // 0: RM Mode, 1: Client Mode
  baseCCY: string;

  constructor(
    private api: WorkflowApiService,
    private afs: CustomerApiService,
    public com: CommonApiService,
    private elem: ElementRef,
    public homeApi: HomeApiService,
    public decimalPipe: DecimalPipe
  ) {}

  LoggedUsername = '';
  LoggedCustomerID = '';
  IsCustomerSelected = false;
  IsUnderlyingSelected = false;
  showdetails = false;
  showUnderlyings = false;
  OrderBookingInProgress = false;
  selectedBIndex: any = 0;
  SelectedPledge: any = {};
  txtshowdetails = 'Show Details';
  ErrorMsg = '';
  // TradeDate: string = '';
  // SettlementDate: string = '';
  CustomerDetails: any = '';
  Months = [
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
  PledgePageData = {
    CustomerDetails: {},
    Underlying: {
      Value: '',
      IsDisable: true,
    },
    SecurityCode: {
      Value: '',
      IsDisable: true,
    },
    PledgeCurrency: {
      Value: '',
      IsDisable: true,
    },
    TransactionName: {
      Value: '',
      IsDisable: true,
    },
    AvailableQuantity: {
      Value: '',
      IsDisable: true,
    },
    TradeDate: {
      Value: '',
      IsDisable: true,
    },
    SettlementDate: {
      Value: '',
      IsDisable: true,
    },
    SecurityPrice: {
      Value: '',
      IsDisable: true,
    },
    PledgeQuantity: {
      Value: '',
      IsDisable: true,
    },
    CustomerName: {
      Value: '',
      IsDisable: true,
    },
    CustomerAccCcy: {
      Value: '',
      IsDisable: true,
    },
    Portfolio: {
      Value: '',
      IsDisable: true,
    },
    AccountNumber: {
      Value: '',
      IsDisable: true,
    },
  };

  AccountList: any[] = [];
  CurrencyList: any[] = [];
  PortfolioList: any[] = [];
  PledgeData: any[] = [];

  GetCustomerAccountDetailsSubscription: Subscription;
  PortfolioSecHoldingSubscription: Subscription;
  SaveCustomerDetailsSubscriber: Subscription;
  custProfileFromCustIDSubscription: Subscription;

  ngOnInit(): void {
    // Get the Logged In User details
    this.LoggedUsername = sessionStorage.getItem('Username');
    this.LoggedCustomerID = sessionStorage.getItem('CustomerID');
    console.log(this.homeApi.RediretToHomeBuySellPledge);

    this.baseCCY = sessionStorage.getItem('BankBaseCcy');
    try {
      this.PageMode = Number(sessionStorage.getItem('PledgePageMode'));
      switch (this.PageMode) {
        case 0:
          this.SelectedPledge = JSON.parse(
            sessionStorage.getItem('PledgeRecord')
          );
          console.log(this.SelectedPledge);
          this.selectPledgeOnClick(this.SelectedPledge);
          this.PledgePageData.CustomerName.Value = this.homeApi.CustomerName;
          // this.afs.GetCustProfileDetailsFromCustID(sessionStorage.getItem('CustomerID'));
          this.api
            .GetPortfoliosFromCusID(
              this.homeApi.CustomerId,
              this.PledgePageData.PledgeCurrency.Value[0]
            )
            .subscribe((folio) => {
              if (folio) {
                this.PortfolioList = folio.DB_GetPortfoliosResult;
                this.PledgePageData.Portfolio.Value =
                  this.PortfolioList[0].FacDesc;
                // this.portfolioName = this.portfolioList[0].PortfolioName;
                this.getaccounts();
              }
            });
          // this.custProfileFromCustIDSubscription = this.afs.GetCustProfileFromCustIDObserver.subscribe((res: any) => {
          //   if (res.length) {
          //     if (res.length > 0) {
          //       this.PortfolioList = [];
          //       const map = new Map();
          //       for (const item of res) {
          //         if (!map.has(item.PortfolioName)) {
          //           map.set(item.PortfolioName, true); // set any value to Map
          //           if(item.SICurrency === this.PledgePageData.PledgeCurrency.Value[0]){
          //           this.PortfolioList.push(item.PortfolioName);
          //           }
          //         }
          //       }
          //       res.forEach((element) => {
          //         CustomerDetails.push(element);
          //       });
          //     }
          //     this.fnGetCustomerDetails(CustomerDetails);
          //     this.LoggedCustomerID = this.homeApi.CustomerId;
          //     this.PledgePageData.CustomerName.Value = this.homeApi.CustomerName;
          //     this.selectedCustomer({ CustomerID: this.LoggedCustomerID, CustomerName: sessionStorage.getItem('CustomerNamemisc1') });
          //   }
          // });
          break;
        case 1:
          this.SelectedPledge = JSON.parse(
            sessionStorage.getItem('PledgeRecord')
          );
          console.log(this.SelectedPledge);
          this.selectPledgeOnClick(this.SelectedPledge);
          this.PledgePageData.CustomerName.Value = this.homeApi.CustomerName;
          this.afs.GetCustProfileDetailsFromCustID(
            sessionStorage.getItem('CustomerID')
          );
          this.api
            .GetPortfoliosFromCusID(
              this.homeApi.CustomerId,
              this.PledgePageData.PledgeCurrency.Value[0]
            )
            .subscribe((folio) => {
              if (folio) {
                this.PortfolioList = folio.DB_GetPortfoliosResult;
                this.PledgePageData.Portfolio.Value =
                  this.PortfolioList[0].FacDesc;
                // this.portfolioName = this.portfolioList[0].PortfolioName;
                this.getaccounts();
              }
            });

          break;

        default:
          break;
      }
    } catch (ex) {
      console.log(ex);
    }

    this.fnSetTradeandSettlementDates();

    this.EnableDisableCustomerSelectedControls(true); // Disable Customer segment

    // Fetch the Underlyings
    // this.afs.fngetCustAccountDetails(this.LoggedUsername);
    // this.GetCustomerAccountDetailsSubscription = this.afs.getCustAccountDetails.subscribe(res => {
    //   if (res.length !== 0) {
    //     if (Object.keys(res).length === 0 && res.constructor === Object) {

    //     } else {
    //       let CheckDuplicatePortfolio: boolean = false;
    //       res.forEach(element => {
    //         CheckDuplicatePortfolio = false;
    //         if (element) {
    //           this.PortfolioList.forEach(portfoliolistele => {
    //             if (element.portfolio === portfoliolistele) {
    //               CheckDuplicatePortfolio = true;
    //             }
    //           });
    //           if (!CheckDuplicatePortfolio) {
    //             this.PortfolioList.push(element.portfolio);
    //           }
    //         }
    //       });
    //       if (this.PortfolioList.length > 0) {
    //         this.api.getCustPortfolioSecurityHoldings(this.LoggedCustomerID, this.PortfolioList[0]);
    //       }

    //     }
    //   }
    // });

    // this.PortfolioSecHoldingSubscription = this.api.portfolioSecHoldingObserver.subscribe((res: any) => {
    //   try {
    //     if (res.length !== 0) {
    //       this.PledgeData = []; // Reset the PledgeData
    //       this.PledgeData = this.fnConvertArrayTofirstIndex(res); // Filter array to proper form
    //       console.log(this.PledgeData);
    //       this.AccountList = [];
    //       this.CustomerDetails.forEach(element => {
    //         if (this.PledgePageData.Portfolio.Value === element.PortfolioName) {
    //           if (element.AccountNo !== '' && (this.PledgePageData.PledgeCurrency.Value[0] === element.SICurrency)) {
    //             this.AccountList = this.fnPushObjinArray(this.AccountList, element.AccountNo);
    //           }
    //         }
    //       });
    //       this.fnAccChange();
    //     } else {
    //       // this.tab3Error = 'Data not available.';
    //     }
    //   } catch (ex) {
    //     console.log(ex);
    //   }

    // });
    this.afs.ClearObserverofFD();
    this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe((res) => {
      try {
        if (res) {
          if (res.SaveUCPResult) {
            // this.Message = res.SaveUCPResult[0].SavingMessage;
            console.log(res.SaveUCPResult);
            if (res.SaveUCPResult[0].WarningMessage !== '') {
              this.ErrorMsg = res.SaveUCPResult[0].WarningMessage;
            } else {
              if (
                res.SaveUCPResult[0].SavingMessage ===
                'Record Imported Successfully'
              ) {
                this.ErrorMsg = 'Order Placed Successfully. ' + '\n';
              }
              this.ErrorMsg =
                this.ErrorMsg +
                'Order Ref ID.:' +
                res.SaveUCPResult[0].NoteMasterID;
            }
            this.OrderBookingInProgress = false;
            this.ErrorMsgVanish();
          }
        }
      } catch (ex) {}
    });
  }

  fnConvertArrayTofirstIndex(inputArray) {
    inputArray.forEach((element, _index) => {
      Object.keys(element).forEach((ele) => {
        if (ele) {
          element[ele] = element[ele][0];
        }
      });
    });
    return inputArray;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    // Unsubscribe the all Subscriptions
    if (this.GetCustomerAccountDetailsSubscription) {
      this.GetCustomerAccountDetailsSubscription.unsubscribe();
    }
    if (this.PortfolioSecHoldingSubscription) {
      this.PortfolioSecHoldingSubscription.unsubscribe();
    }
    if (this.SaveCustomerDetailsSubscriber) {
      this.SaveCustomerDetailsSubscriber.unsubscribe();
    }

    this.fnResetCustomerDetails();
    this.fnResetPledgeDetails();
    this.afs.ClearObserverofFD();
    this.ErrorMsg = '';
  }

  fntoggleShowDetails() {
    if (this.showdetails) {
      this.showdetails = false;
      this.txtshowdetails = 'Show Details';
    } else {
      this.showdetails = true;
      this.txtshowdetails = 'Less Details';
    }
  }

  selectDate(reqPram, date) {
    switch (reqPram) {
      case 'TradeDate':
        this.PledgePageData.TradeDate.Value =
          moment(date).format('DD-MMM-YYYY');
        break;
      case 'SettlementDate':
        this.PledgePageData.SettlementDate.Value =
          moment(date).format('DD-MMM-YYYY');
        break;
    }
  }

  fnGetCustomerDetails(res) {
    console.log(res);
    if (res === '') {
      this.fnResetPledgeDetails();
      this.PledgePageData.Underlying.IsDisable = true;
    } else if (res.length > 0) {
      this.PortfolioList = [];
      this.CustomerDetails = res;
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.PortfolioName)) {
          map.set(item.PortfolioName, true); // set any value to Map
          if (item.SICurrency === this.PledgePageData.PledgeCurrency.Value[0]) {
            this.PortfolioList.push(item.PortfolioName);
          }
        }
      }
      this.fnUpdateCustomerPortfolioDetails();
    }
  }
  selectedCustomer(e) {
    try {
      if (e) {
        console.log(e);
        this.LoggedCustomerID = e.CustomerID;
        this.PledgePageData.CustomerName.Value = e.CustomerName;
        this.api.getCustPortfolioSecurityHoldings(
          this.LoggedCustomerID,
          this.PledgePageData.Portfolio.Value,
          this.baseCCY
        );

        this.IsCustomerSelected = true;
        this.EnableDisableCustomerSelectedControls(false); // Enable Customer segment
      }
    } catch (ex) {}
  }
  fnUpdateCustomerPortfolioDetails() {
    this.AccountList = [];
    this.CurrencyList = [];

    this.CustomerDetails.forEach((element) => {
      if (element.AccountNo !== '' && element.SICurrency !== '') {
        if (
          this.PledgePageData.PledgeCurrency.Value[0] === element.SICurrency
        ) {
          this.AccountList = this.fnPushObjinArray(
            this.AccountList,
            element.AccountNo
          );
          this.CurrencyList = this.fnPushObjinArray(
            this.CurrencyList,
            element.SICurrency
          );
        }
      }
    });
    this.PledgePageData.AccountNumber.Value = this.AccountList[0];
    this.PledgePageData.CustomerAccCcy.Value = this.CurrencyList[0];
    this.PledgePageData.Portfolio.Value = this.PortfolioList[0];
    this.updateCcy();
  }
  fnPushObjinArray(inputArray = [], element: any) {
    let IsPresent = false;
    inputArray.forEach((ele) => {
      if (ele === element) {
        IsPresent = true;
      }
    });
    if (!IsPresent) {
      inputArray.push(element);
    }
    return inputArray;
  }
  updateCcy() {}

  selectPledgeOnClick(SelectedPledge) {
    console.log(SelectedPledge);
    this.SelectedPledge = SelectedPledge;
    this.showUnderlyings = false;
    this.IsUnderlyingSelected = true;
    this.selectedBIndex = 0;

    this.fnFillPledgeDetails(SelectedPledge);
    this.fnSetTradeandSettlementDates();
  }

  selectPledgeOnEnter(_e) {
    try {
      const PledgeInfo = $('.HoverSuggestion').data('pledgeunderlying');
      this.PledgeData.forEach((ele) => {
        if (ele.longName === PledgeInfo) {
          this.selectPledgeOnClick(ele);
        }
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  ChangeIndex(_e) {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {}
  }
  delaySmartSearch(_e) {
    try {
      // this.bondsList = [];
      // this.ResetAllFields();
      // if (this.search.length > 1) {
      //   this.searchBonds();
      // }
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  EnableDisableCustomerSelectedControls(ToggleFlag: boolean) {
    if (ToggleFlag) {
      // Enable
      this.PledgePageData.Underlying.IsDisable = false;
      this.PledgePageData.Portfolio.IsDisable = false;
      this.PledgePageData.AccountNumber.IsDisable = false;
    } else {
      // Disable
      this.PledgePageData.Underlying.IsDisable = true;
      this.PledgePageData.Portfolio.IsDisable = false;
      this.PledgePageData.AccountNumber.IsDisable = false;
    }
  }

  fnFillPledgeDetails(SelectedPledgeDetails: any) {
    this.PledgePageData.PledgeQuantity.IsDisable = false;
    this.PledgePageData.PledgeQuantity.Value = '0.00';
    Object.keys(this.PledgePageData).forEach((ele) => {
      switch (ele) {
        case 'Underlying':
          this.PledgePageData.Underlying.Value = SelectedPledgeDetails.longName;
          break;
        case 'SecurityCode':
          this.PledgePageData.SecurityCode.Value =
            SelectedPledgeDetails.CEHD_Stock_Code;
          break;
        case 'PledgeCurrency':
          this.PledgePageData.PledgeCurrency.Value =
            SelectedPledgeDetails.QuotedAgainst;
          break;
        case 'TransactionName':
          this.PledgePageData.TransactionName.Value = 'PLEDGEOUT-SHR';
          break;
        case 'AvailableQuantity':
          this.PledgePageData.AvailableQuantity.Value =
            this.decimalPipe.transform(
              SelectedPledgeDetails.CEHD_Available_Qty[0] === '0'
                ? '0'
                : SelectedPledgeDetails.CEHD_Available_Qty[0],
              '1.2-2'
            );
          break;
        case 'SecurityPrice':
          this.PledgePageData.SecurityPrice.Value = this.decimalPipe.transform(
            SelectedPledgeDetails.SpotBidQuote[0] === '0'
              ? '0'
              : SelectedPledgeDetails.SpotBidQuote[0],
            '1.2-2'
          );
          break;
        default:
          break;
      }
    });
  }

  fnResetPledgeDetails() {
    this.PledgePageData.Underlying.Value = '';
    // this.PledgePageData.Underlying.IsDisable = true;
    this.PledgePageData.SecurityCode.Value = '';
    this.PledgePageData.SecurityCode.IsDisable = true;
    this.PledgePageData.PledgeCurrency.Value = '';
    this.PledgePageData.PledgeCurrency.IsDisable = true;
    this.PledgePageData.AvailableQuantity.Value = '';
    this.PledgePageData.AvailableQuantity.IsDisable = true;
    this.PledgePageData.TradeDate.Value = '';
    this.PledgePageData.TradeDate.IsDisable = true;
    this.PledgePageData.SecurityPrice.Value = '';
    this.PledgePageData.SecurityPrice.IsDisable = true;
    this.PledgePageData.SettlementDate.Value = '';
    this.PledgePageData.SettlementDate.IsDisable = true;
    this.PledgePageData.PledgeQuantity.Value = '';
    this.PledgePageData.PledgeQuantity.IsDisable = true;
  }

  fnResetCustomerDetails() {
    this.PledgePageData.CustomerName.Value = '';
    this.PledgePageData.CustomerName.IsDisable = true;
    this.PledgePageData.CustomerAccCcy.Value = '';
    this.PledgePageData.CustomerAccCcy.IsDisable = true;
    this.PledgePageData.Portfolio.Value = '';
    this.PledgePageData.Portfolio.IsDisable = true;
    this.PledgePageData.AccountNumber.Value = '';
    this.PledgePageData.AccountNumber.IsDisable = true;

    this.AccountList = [];
    this.CurrencyList = [];
    this.PortfolioList = [];
  }

  fnChangePortfolio() {
    // this.fnResetPledgeDetails();
    // this.api.getCustPortfolioSecurityHoldings(this.LoggedCustomerID, this.PledgePageData.Portfolio.Value);
    this.AccountList = [];
    this.CustomerDetails.forEach((element) => {
      if (this.PledgePageData.Portfolio.Value === element.PortfolioName) {
        this.AccountList = this.fnPushObjinArray(
          this.AccountList,
          element.AccountNo
        );
      }
    });
    this.PledgePageData.AccountNumber.Value = this.AccountList[0];
  }

  fnSetTradeandSettlementDates() {
    // Assign the Dates
    const today = new Date();
    this.PledgePageData.TradeDate.Value =
      (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
      '-' +
      (today.getMonth() + 1 < 10
        ? this.Months[today.getMonth()]
        : this.Months[today.getMonth()]) +
      '-' +
      today.getFullYear();
    this.PledgePageData.SettlementDate.Value =
      (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
      '-' +
      (today.getMonth() + 1 < 10
        ? this.Months[today.getMonth()]
        : this.Months[today.getMonth()]) +
      '-' +
      today.getFullYear();
  }

  fnOrderPlacement() {
    this.OrderBookingInProgress = true;

    const today = new Date();
    const jsonObj = {
      dtDataFromXML: {
        SN1: this.SelectedPledge.longName[0],
        HEDGING_TYPE: 'BACK TO BACK',
        SN1_LN: this.SelectedPledge.CEHD_Stock_Code[0],
        Base_ccy: this.PledgePageData.PledgeCurrency.Value[0],
        Order_Quantity: this.PledgePageData.PledgeQuantity.Value,
        Client_Name: this.SelectedPledge.CustomerName[0],
        Transaction_Code: this.PledgePageData.TransactionName.Value,
        // Transaction_Code:  'PLEDGEOUT-SHR',
        Facility_Type: this.PledgePageData.Portfolio.Value,
        Share_Pledge_Start_Date:
          (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
          '-' +
          (today.getMonth() + 1 < 10
            ? this.Months[today.getMonth()]
            : this.Months[today.getMonth()]) +
          '-' +
          today.getFullYear(),
        // Share_Pledge_End_Date_From: ((today.getDate() < 10) ? ('0' + today.getDate()) : today.getDate()) + '-' + ((today.getMonth() + 1) < 10 ? ((this.Months[today.getMonth()])) : (this.Months[today.getMonth()])) + '-2099',
        Share_Pledge_End_Date_From: this.PledgePageData.SettlementDate.Value,
        Share_Pledge_Start_Date_To:
          (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
          '-' +
          (today.getMonth() + 1 < 10
            ? this.Months[today.getMonth()]
            : this.Months[today.getMonth()]) +
          '-' +
          today.getFullYear(),
        // Share_Pledge_End_Date_To: ((today.getDate() < 10) ? ('0' + today.getDate()) : today.getDate()) + '-' + ((today.getMonth() + 1) < 10 ? ((this.Months[today.getMonth()])) : (this.Months[today.getMonth()])) + '-2099',
        Share_Pledge_End_Date_To: this.PledgePageData.SettlementDate.Value,
        Broker_Name: 'NOMINEE ACCOUNT|100',
      },
    };

    this.afs.saveNewOrder(jsonObj, this.LoggedUsername, 'Pledge', 'Insert', 0);
  }
  ErrorMsgVanish() {
    try {
      // const x = document.getElementById('snackbar');
      // const x = document.getElementById('msgAlertid');
      // x.className = 'msgAlert';
      // document.body.scrollTop = 0;
      // document.documentElement.scrollTop = 0;
      // window.scrollTo(0, 0);
      // document.documentElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        // x.className = x.className.replace('show', '');
        // x.className = x.className.replace('msgAlert', '');
        this.ErrorMsg = '';
        // this.isError = false;
      }, 3000);
    } catch (ex) {
      // setTimeout(function () {
      //   this.ErrorMsg = '';
      // }, 3000);
    }
  }
  fnAccChange() {
    this.CustomerDetails.forEach((element) => {
      if (this.PledgePageData.AccountNumber.Value === element.AccountNo) {
        this.PledgePageData.CustomerAccCcy.Value = element.SICurrency;
      }
    });
  }
  fnClearbtn() {
    this.fnResetPledgeDetails();
    this.ErrorMsg = '';
  }

  getaccounts() {
    this.api
      .getAccountNumberFromPortfolioGeneric(
        this.homeApi.CustomerId,
        this.PledgePageData.Portfolio.Value,
        this.PledgePageData.PledgeCurrency.Value[0]
      )
      .subscribe((acc) => {
        if (acc) {
          this.AccountList = [];
          this.AccountList = acc.ExecGenericTableValuedFunctionResult;
          this.PledgePageData.AccountNumber.Value = this.AccountList[0].Param1;
        }
      });
  }
}
