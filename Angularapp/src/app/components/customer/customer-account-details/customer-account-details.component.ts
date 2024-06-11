import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonfunctionService } from '../../../components/fx-order/commonfunction.service';
import { DecimalPipe } from '@angular/common';
import { AppConfig } from '../../../services/config.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-customer-account-details',
  templateUrl: './customer-account-details.component.html',
  styleUrls: ['./customer-account-details.component.scss'],
})
export class CustomerAccountDetailsComponent implements OnInit, OnDestroy {
  // Declare all variables and constant
  isProd = environment.production;
  Mode: number = 0;
  CustomerID: any;
  entityUser: string;
  facDesc: string = '';
  Account_Type: string = '';
  ErrorMsg: string = '';
  // Added By MohanP
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  selectedCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  loginMode: any;
  isUserRM: boolean;

  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    this.selectedCustomerDetails = this.selectedRMCustomerDetails;

    console.log(this.selectedCustomerDetails);
  }
  @Input() get LoginMode() {
    return this.loginMode;
  }
  set LoginMode(Mode) {
    this.loginMode = Mode;
    this.isUserRM = this.loginMode === 'RM';
    console.log(this.loginMode);
  }
  // Added By MohanP
  // Declare all types of array
  CurrencyList = [];
  totalaccounts = [];
  CustomerAllAccountsDetail = [];
  unique = [];
  totalPortfolio = [];
  portfolioNames: string[];

  // Decalre all Subscriptions
  GetAllTradableCurrenciesSubscriber: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;
  GetBankNameSubscriber: Subscription;
  CustProfiledetailsSubscription: Subscription;

  // Declare all boolean flags
  accountInfoViewMode = true;

  FinancialPlanningOverlayflag: boolean = false;
  FixedDepositOverlayflag: boolean = false;
  CashDepositOverlayflag: boolean = false;
  SelectedPortfolioForFinancialPlanning: string = '';
  SelectedIndexPortfolioForFinancialPlanning: number;
  IsLoading: boolean;
  IsPortfolioCreated: boolean = false;
  LoadingFlagPortfolioCreated: boolean = true;
  BankBaseCCY: string;
  portfolio: any = [];
  accounts: any = [];
  IsBackButtonEnabled: boolean;
  HideShowBSBBankName: boolean = false;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.FinancialPlanningOverlayflag = false;
      this.FixedDepositOverlayflag = false;
      this.CashDepositOverlayflag = false;
    }
  }
  HideControls: boolean;
  DisplayYNAddAccount: boolean;
  DisplayYNTransferFunds: boolean;
  DisplayYNFixedDeposit: boolean;
  DisplayYNHoldingDetails: boolean;
  showCashHoldingDetails: boolean;
  selectedAccount: any;
  CardOrGridView: boolean = false;
  domainURL = environment.domainURL;
  cardViewAccounts = [];
  IsAccountAddedinQueue: boolean = false;

  constructor(
    public afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    private route: ActivatedRoute,
    private ds: WorkflowApiService,
    public router: Router,
    public loginApi: LoginApiService,
    public elements: ElementRef,
    public comm: CommonApiService,
    public custApi: CustomerApiService,
    public commonfunctionservice: CommonfunctionService,
    public decimalPipe: DecimalPipe,
    public homeapi: HomeApiService,
    public authorApi: AuthService
  ) {
    this.showCashHoldingDetails = false;
    this.selectedAccount = {};
    this.selectedCustomerDetails = this.selectedRMCustomerDetails;
  }

  ngOnInit(): void {
    // this.VisibleAddAccountbtn = AppConfig.settings.CSP_VisibleAddAccountAndPortfolioButton;
    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;
    this.IsLoading = true;
    if (sessionStorage.getItem('UserType') === 'RM') {
      this.entityUser = sessionStorage.getItem('RMUser');
      this.CustomerID = sessionStorage.getItem('RMCustID');
      this.selectedCustomerDetails = this.selectedRMCustomerDetails;

      this.Mode = 1;
    } else {
      this.entityUser = sessionStorage.getItem('Username');
      this.CustomerID = sessionStorage.getItem('CustomerID');
      this.selectedCustomerDetails = {
        cif: this.homeapi.CIF,
        custId: this.homeapi.CustomerId,
        custName: this.homeapi.CustomerName,
        userName: this.authorApi.UserName,
      };
      try {
        // 1: Customer individual account details Mode
        // 2: RM can view customers account Mode
        this.Mode = Number(this.route.snapshot.paramMap.get('Mode'));
      } catch {}
    }
    this.BankBaseCCY = AppConfig.settings.BankBaseCCy;
    this.HideShowBSBBankName = AppConfig.settings.CSP_showhideBankBSB;
    console.log(AppConfig.settings.CSP_showhideBankBSB);

    this.fnLoadButtonsVisiblity();
    this.fnCheckPortfolioCreated();

    this.ds
      .getAccountNumberFromPortfolioGeneric(
        this.CustomerID,
        this.homeapi.Portfolio || '',
        ''
      )
      .subscribe((res) => {
        if (res) {
          res.ExecGenericTableValuedFunctionResult.forEach((element) => {
            this.accounts = element.Param1;
          });
        }
      });
    this.afs
      .isCustProfileCreated(
        this.authorApi.UserName,
        '',
        this.homeapi.NoteMasterID || ''
      )
      .subscribe((custProfileDetailsObj) => {
        try {
          if (custProfileDetailsObj.length > 0) {
            custProfileDetailsObj.forEach((element) => {
              if (element !== null && element !== '') {
                this.HideControls =
                  element.PortfolioAccMapYN === 'Y' ? true : false;
              }
            });
          }
        } catch (Exception) {
          console.log(Exception);
        }
      });
  }

  fnLoadButtonsVisiblity() {
    this.afs
      .getCommonDataEFX('CSP_CustomerProfileButtons')
      .subscribe((res: any) => {
        if (res.Get_Configurable_Common_DataResult.length !== 0) {
          res.Get_Configurable_Common_DataResult.forEach((element) => {
            if (element) {
              if (element.DATA_VALUE === 'AddAccount') {
                this.DisplayYNAddAccount = element.Misc1.split(',').includes(
                  sessionStorage.getItem('UserType').toString().toUpperCase()
                );
              }
              if (element.DATA_VALUE === 'TransferFunds') {
                this.DisplayYNTransferFunds = element.Misc1.split(',').includes(
                  sessionStorage.getItem('UserType').toString().toUpperCase()
                );
              }
              if (element.DATA_VALUE === 'FixedDeposit') {
                this.DisplayYNFixedDeposit = element.Misc1.split(',').includes(
                  sessionStorage.getItem('UserType').toString().toUpperCase()
                );
              }
              if (element.DATA_VALUE === 'HoldingDetails') {
                this.DisplayYNHoldingDetails = element.Misc1.split(
                  ','
                ).includes(
                  sessionStorage.getItem('UserType').toString().toUpperCase()
                );
              }
            }
          });
        }
      });
  }

  fnLoadAfterPortfolioCheck() {
    this.loadAllObservers();
    this.afs.GetAllTradableCurrency();
    this.totalaccounts = [];

    switch (this.Mode) {
      case 1:
        this.afs.ResetgetCustAccountDetailsforMultiAccObserver();
        this.fnGetCustomerAccounts();
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  fnHideExtraColumns() {
    if (this.HideControls) {
    } else {
    }
  }
  //ketan
  // fnGetCustomerAccounts(){
  // this.IsLoading = true;
  //   this.afs.GettCustomerAccountDetails(this.entityUser).subscribe((res: any) => {
  //     if (res !== '') {
  //       if (res.length !== 0) {
  //         this.IsLoading = false;
  //         this.totalaccounts = [];
  //         this.CustomerAllAccountsDetail = res.message;
  //         // ruchira
  //         // try {
  //         //   res.message.forEach((element) => {
  //         //     this.LoadAccounts(element);
  //         //   });
  //         // } catch (ex) {

  //         // }
  //         // this.CustomerID = res[0].CustomerID;
  //         this.Account_Type = res.message[0].accounttype;
  //         const array = [];
  //         for (const acc of res.message) {
  //           array.push(acc.portfolio);
  //         }
  //         this.unique = array.filter(this.cfs.onlyUnique);
  //         if (this.CustomerID !== undefined) {
  //           // for (const port of this.unique) {
  //           // this.afs.LoadPortfolio(this.CustomerID, 0);
  //           this.fnGetPortfolio(this.CustomerID, 0);
  //           // }
  //         }
  //       } else {
  //         // this.IsLoading = false;
  //         // this.afs.LoadPortfolio(sessionStorage.getItem('CustomerID'), 0);
  //         this.fnGetPortfolio(sessionStorage.getItem('CustomerID'), 0);
  //       }
  //     } else {
  //       this.IsLoading = false;
  //       // this.afs.LoadPortfolio(sessionStorage.getItem('CustomerID'), 0);
  //       this.fnGetPortfolio(sessionStorage.getItem('CustomerID'), 0);
  //     }
  //     this.IsLoading = false;

  //   });
  // }

  //ruchira
  fnGetCustomerAccounts() {
    this.IsLoading = true;
    this.ds
      .getAccountNumberFromPortfolioGeneric(
        this.CustomerID,
        this.homeapi.Portfolio || '',
        ''
      )
      .subscribe((res: any) => {
        if (res.ExecGenericTableValuedFunctionResult.length !== 0) {
          this.totalaccounts = [];
          this.CustomerAllAccountsDetail =
            res.ExecGenericTableValuedFunctionResult;
          // ruchira
          try {
            res.ExecGenericTableValuedFunctionResult.forEach(
              (element, index) => {
                this.LoadAccounts(element, index);
              }
            );
            console.log(this.totalaccounts);
          } catch (ex) {}
        } else {
          this.IsLoading = false;
        }
      });
  }

  //ketan
  // fnCheckPortfolioCreated() {
  //   try {
  //     // this.afs.ResetLoadPortfolioSubObserver();
  //     this.afs.GetPortfolio(this.CustomerID, 0).subscribe((res) => {
  //       let isPortfolioExist: boolean= false;
  //       if (Object.keys(res).length > 0) {
  //         if (res.Get_Portfolio_Details_RESTResult !== undefined) {
  //           this.totalPortfolio = [];
  //           res.Get_Portfolio_Details_RESTResult.forEach((element) => {
  //             if (element.Char8 !== null && element.Char8 !== '') { // Check Investment objective is null or having value
  //               // Portfolio is created
  //               // this.LoadingFlagPortfolioCreated = false;
  //               this.IsPortfolioCreated = true;

  //             }
  //           });

  //         }
  //       }
  //       this.LoadingFlagPortfolioCreated = false;
  //       // console.log('LoadingFlagPortfolioCreated: ', this.LoadingFlagPortfolioCreated);
  //       if(this.IsPortfolioCreated){
  //         this.fnLoadAfterPortfolioCheck();
  //       }
  //     });

  //   } catch (ex) {
  //     this.LoadingFlagPortfolioCreated = false;
  //     // console.log('LoadingFlagPortfolioCreated: ', this.LoadingFlagPortfolioCreated);
  //     this.IsPortfolioCreated = false;
  //   }
  // }

  // Ruchira
  fnCheckPortfolioCreated() {
    try {
      // this.afs.ResetLoadPortfolioSubObserver();
      this.custApi.GetPortfolio(this.CustomerID, 0).subscribe((res) => {
        // this.ds.GetPortfoliosFromCusID(this.CustomerID, '').subscribe((res) => {
        if (res) {
          if (res.Get_Portfolio_Details_RESTResult.length > 0) {
            this.portfolio = res.Get_Portfolio_Details_RESTResult;
            this.portfolio.forEach((element) => {
              if (this.totalPortfolio.length < this.portfolio.length) {
                // this.portfolioNames.push(element.PortfolioName);
                let IsPortfolioFound: boolean = false;
                this.totalPortfolio.forEach((totalPortfolioObj) => {
                  if (totalPortfolioObj.fascDesc.value === element.FacDesc) {
                    IsPortfolioFound = true;
                  }
                });
                if (!IsPortfolioFound) {
                  this.totalPortfolio.push({
                    fascDesc: {
                      value: element.FacDesc,
                      visibility: true,
                    },
                    PortfolioName: {
                      value: element.PortfolioName,
                      visibility: true,
                    },
                  });
                }
              }
              this.totalaccounts.forEach((element1) => {
                if (element1.Portfolio.value === element.FacDesc) {
                  element1.PortfolioName.value = element.FacDesc;
                }
              });
            });
            if (this.portfolio[0].FacDesc !== '') {
              this.IsPortfolioCreated = true;
            } else {
              this.IsPortfolioCreated = false;
            }
          } else {
            this.IsPortfolioCreated = false;
          }
        }
        this.LoadingFlagPortfolioCreated = false;
        // console.log('LoadingFlagPortfolioCreated: ', this.LoadingFlagPortfolioCreated);
        if (this.IsPortfolioCreated) {
          this.fnLoadAfterPortfolioCheck();
        }
      });
    } catch (ex) {
      this.LoadingFlagPortfolioCreated = false;
      // console.log('LoadingFlagPortfolioCreated: ', this.LoadingFlagPortfolioCreated);
      this.IsPortfolioCreated = false;
    }
  }

  fnGetPortfolio(_CustomerID: string, _PortfolioID: number) {
    this.afs
      .GetPortfolio(this.CustomerID, this.homeapi.Portfolio)
      .subscribe((res) => {
        if (res.Get_Portfolio_Details_RESTResult !== undefined) {
          this.totalPortfolio = [];
          res.Get_Portfolio_Details_RESTResult.forEach((element) => {
            this.facDesc = element.FacDesc;
            if (
              this.totalPortfolio.length <
              res.Get_Portfolio_Details_RESTResult.length
            ) {
              // this.portfolioNames.push(element.PortfolioName);
              let IsPortfolioFound: boolean = false;
              this.totalPortfolio.forEach((totalPortfolioObj) => {
                if (totalPortfolioObj.fascDesc.value === element.FacDesc) {
                  IsPortfolioFound = true;
                }
              });
              if (!IsPortfolioFound) {
                this.totalPortfolio.push({
                  fascDesc: {
                    value: element.FacDesc,
                    visibility: true,
                  },
                  PortfolioName: {
                    value: element.PortfolioName,
                    visibility: true,
                  },
                });
              }
            }
            this.totalaccounts.forEach((element1) => {
              if (element1.Portfolio.value === element.FacDesc) {
                element1.PortfolioName.value = element.FacDesc;
              }
            });
          });
        }
      });
  }

  fnLoadCustomerAccountDetails() {
    this.afs
      .GetSSIDetailsofAccountDetails(this.CustomerID, this.entityUser)
      .subscribe((res) => {
        if (res !== '') {
          // if (res.length !== undefined) {

          this.totalaccounts = [];
          this.CustomerAllAccountsDetail = JSON.parse(res.GetSSIDetailsResult);
          // console.log(this.CustomerAllAccountsDetail);
          this.Account_Type = this.CustomerAllAccountsDetail[0].AccountType;
          // this.CustomerID = res[0].CustomerID;

          this.CustomerAllAccountsDetail.forEach((element, index) => {
            this.LoadAccounts(element, index);
          });
          const array = [];
          for (const acc of this.CustomerAllAccountsDetail) {
            array.push(acc.portfolio);
          }
          this.unique = array.filter(this.cfs.onlyUnique);
          if (this.CustomerID !== undefined) {
            // this.afs.LoadPortfolio(this.CustomerID, 0); // Rest API call: Fetch the portfolio details
            this.fnGetPortfolio(this.CustomerID, 0); // Rest API call: Fetch the portfolio details
          }

          // this.totalaccounts = [];
          // this.CustomerAllAccountsDetail = res.GetSSIDetailsResult;
          // try {
          //   res.forEach((element) => {
          //     this.LoadAccounts(element);
          //   });
          // } catch (ex) {

          // }
          // // this.CustomerID = res[0].CustomerID;
          // this.Account_Type = res[0].accounttype;
          // const array = [];
          // for (const acc of res) {
          //   array.push(acc.portfolio);
          // }
          // this.unique = array.filter(this.cfs.onlyUnique);
          // if (this.CustomerID !== undefined) {
          //   // for (const port of this.unique) {
          //   this.afs.LoadPortfolio(this.CustomerID, 0);
          //   // }
          // }
          // } else {
          //   // this.IsLoading = false;
          //   this.afs.LoadPortfolio(sessionStorage.getItem('CustomerID'), 0);
          // }
          this.IsLoading = false; // Commented by ketan S
        } else {
          this.IsLoading = false;
          // this.afs.LoadPortfolio(sessionStorage.getItem('CustomerID'), 0);
          this.fnGetPortfolio(sessionStorage.getItem('CustomerID'), 0);
        }
      });
  }

  loadAllObservers() {
    this.GetAllTradableCurrenciesSubscriber =
      this.afs.allTradablePairObserver.subscribe((res: any) => {
        if (res) {
          this.CurrencyList = [];
          const map = new Map();
          res.forEach((element) => {
            map.set('' + element.Asset1, element.Asset1);
            map.set('' + element.Asset2, element.Asset2);
          });
          this.CurrencyList = Array.from(map.keys()).sort();
        }
      });
  }

  ngOnDestroy(): void {
    try {
      this.homeapi.RediretToHomeBuySellPledge = '';
      this.ResetAll();
      this.afs.ResetgetCustAccountDetailsforMultiAccObserver();
      if (this.GetCustomerMultiAccountDetailsSubscriber)
        this.GetCustomerMultiAccountDetailsSubscriber.unsubscribe();
      if (this.GetAllTradableCurrenciesSubscriber)
        this.GetAllTradableCurrenciesSubscriber.unsubscribe();
      if (this.CustProfiledetailsSubscription)
        this.CustProfiledetailsSubscription.unsubscribe();
    } catch (e) {
      console.log(
        'Error occured while destroying Customer account details Component: ',
        e
      );
    }
  }

  ResetAll() {
    this.CurrencyList = [];
    this.totalaccounts = [];
    this.CustomerAllAccountsDetail = [];
    this.unique = [];
    this.totalPortfolio = [];
    this.portfolioNames = [];
    this.Account_Type = '';
  }
  //ketan
  // LoadAccounts(res) {
  //   if (res.accountnumber !== null) { // Check if account number
  //     let IsAccountIsPresent: boolean = false;
  //     if (this.totalaccounts.length > 0) {
  //       this.totalaccounts.forEach(totalaccountsObj => {
  //         if (Number(totalaccountsObj.Account_Number.value) === Number(res.accountnumber)) {
  //           IsAccountIsPresent = true;
  //         }
  //       });
  //     }
  //     if (!IsAccountIsPresent) { // Duplicate account check
  //       this.totalaccounts.push({
  //         BSB: { value: Number(res.misc6).toString(), visibility: false },
  //         // bankName: { value: res.Bank_Name, visibility: false },
  //         bankName: { value: res.misc3, visibility: false },
  //         Account_Balance: { value: this.decimalPipe.transform(res.AvailableBalance, '1.2-2'), visibility: false },
  //         // Account_Number: { value: res.accountnumber, visibility: false }, Ruchira
  //          AccountName: { value: res.Customer_Name, visibility: false },
  //         Portfolio: { value: res.portfolio, visibility: false },
  //         PortfolioName: { value: '', visibility: true },
  //         Currency: { value: res.Accountcurrency, visibility: false },
  //         ErrorMessage: '',
  //         createdSuccessfully: 'true',
  //         enableOrDisableCashTransfer: res.accounttype !== '' ? false : true
  //       });
  //     }
  //   }
  // }

  //Ruchira
  LoadAccounts(res, i) {
    let cashbalance = 0;
    if (res.Param1 !== null) {
      // Check if account number
      let IsAccountIsPresent: boolean = false;
      if (this.totalaccounts.length > 0) {
        this.totalaccounts.forEach((totalaccountsObj) => {
          if (
            Number(totalaccountsObj.Account_Number.value) === Number(res.Param1)
          ) {
            IsAccountIsPresent = true;
          }
        });
      }
      this.ds
        .getCashbalanceFromAccountNumber(res.Param4, res.Param1)
        .subscribe((balance) => {
          if (balance) {
            cashbalance = balance.ExecGenericScalarFunctionResult;

            if (!IsAccountIsPresent) {
              // Duplicate account check

              this.totalaccounts.push({
                BSB: { value: '', visibility: false }, //Asked by Harsh to add Hard Code
                bankName: { value: '', visibility: false }, //Asked by Harsh to add Hard Code
                // bankName: { value: res.misc3, visibility: false },
                Account_Balance: {
                  value: this.decimalPipe.transform(cashbalance, '1.2-2'),
                  visibility: false,
                },
                Account_Number: { value: res.Param1, visibility: false },
                AccountName: {
                  value: this.homeapi.CustomerName,
                  visibility: false,
                },
                Portfolio: { value: res.Param3, visibility: false },
                PortfolioName: { value: res.Param5, visibility: true },
                // PortfolioName: { value: res.Param3, visibility: true },
                Currency: { value: res.Param4, visibility: false },
                Payable: { value: '', visibility: false },
                Receivable: { value: '', visibility: false },

                ErrorMessage: '',
                createdSuccessfully: 'true',
                // enableOrDisableCashTransfer: res.accounttype !== '' ? false : true
                enableOrDisableCashTransfer: true,
                index: i,
              });
              console.log(this.totalaccounts);
              this.cardViewAccounts = [];
              this.totalaccounts.forEach((totalaccountsElement) => {
                if (this.cardViewAccounts.length > 0) {
                  var IsPortfolioFound: boolean = false;
                  this.cardViewAccounts.forEach((cardElement) => {
                    if (totalaccountsElement.Portfolio.value === cardElement.Portfolio.value) {
                      IsPortfolioFound = true;
                      cardElement.AccountList.push({
                        Account_Balance: {
                          value: totalaccountsElement.Account_Balance.value,
                          visibility: false,
                        },
                        Account_Number: {
                          value: totalaccountsElement.Account_Number.value,
                          visibility: false,
                        },
                        AccountName: {
                          value: totalaccountsElement.AccountName.value,
                          visibility: true,
                        },
                        Currency: {
                          value: totalaccountsElement.Currency.value,
                          visibility: false,
                        },
                        
                      });
                      cardElement.createdSuccessfully = 'true';
                      cardElement.showCashHoldings= false;
                      cardElement.AddAccount = false;
                    }
                  });
                  if (!IsPortfolioFound) {
                    this.cardViewAccounts.push({
                      Portfolio: {
                        value: totalaccountsElement.Portfolio.value,
                        visibility: false,
                      },
                      PortfolioName: {
                        value: totalaccountsElement.PortfolioName.value,
                        visibility: true,
                      },
                      AccountList: [
                        {
                          Account_Balance: {
                            value: totalaccountsElement.Account_Balance.value,
                            visibility: false,
                          },
                          Account_Number: {
                            value: totalaccountsElement.Account_Number.value,
                            visibility: false,
                          },
                          AccountName: {
                            value: this.homeapi.CustomerName,
                            visibility: false,
                          },
                          Currency: {
                            value: totalaccountsElement.Currency.value,
                            visibility: false,
                          },
                        },
                      ],
                      
                      createdSuccessfully: 'true',
                      showCashHoldings: false,
                      AddAccount: false,
                    });
                  }
                } else {
                  this.cardViewAccounts.push({
                    Portfolio: {
                      value: totalaccountsElement.Portfolio.value,
                      visibility: false,
                    },
                    PortfolioName: {
                      value: totalaccountsElement.PortfolioName.value,
                      visibility: true,
                    },
                    AccountList: [
                      {
                        Account_Balance: {
                          value: totalaccountsElement.Account_Balance.value,
                          visibility: false,
                        },
                        Account_Number: {
                          value: totalaccountsElement.Account_Number.value,
                          visibility: false,
                        },
                        AccountName: {
                          value: this.homeapi.CustomerName,
                          visibility: false,
                        },
                        Currency: {
                          value: totalaccountsElement.Currency.value,
                          visibility: false,
                        },
                        
                      },
                    ],
                    createdSuccessfully: 'true',
                        showCashHoldings: false,
                        AddAccount: false,
                  });
                }
                console.log(this.cardViewAccounts);
              });

              this.selectedAccount = this.totalaccounts[0];
            }
            this.IsLoading = false;
          }
        });
    }
  }

  getValueInput(event, index) {
    const target: any = this.cfs.GetEventTarget(event);
    this.totalaccounts[index].BSB.value = target.value;
    this.getBankName(index);
  }
  //ketan
  // TransferAmount(index) {
  //   this.CustomerAllAccountsDetail.forEach((customerAccounts, i) => {
  //     if (this.totalaccounts[index].Account_Number.value === customerAccounts.accountnumber) {
  //       this.cfs.setAccountInfoForRedirectTocashDesposit(this.CustomerAllAccountsDetail[i]);
  //     }
  //   });
  //   this.cfs.setRedirectFlag('Cash Deposit');
  // }

  TransferAmount(index) {
    this.CustomerAllAccountsDetail.forEach((customerAccounts, i) => {
      if (
        this.totalaccounts[index].Account_Number.value ===
        customerAccounts.Param1
      ) {
        this.cfs.setAccountInfoForRedirectTocashDesposit(
          this.CustomerAllAccountsDetail[i]
        );
        if (this.authorApi.UserType === 'RM') {
          sessionStorage.setItem('RMUser', this.entityUser);
        }
      }
    });

    this.cfs.setRedirectFlag('Cash Deposit');
  }
  getBankName(index) {
    this.totalaccounts[index].bankName.value = '';
    if (this.totalaccounts[index].BSB.value.length > 1) {
      this.afs.ClearObserversonValidateUserPage();
      this.afs.getBSBDetails(this.totalaccounts[index].BSB.value); // Rest API call: Get Bank name from BSB Code
    }
  }
  //ketan
  // addAccount() {
  //   try {
  //     this.totalaccounts.push({
  //       BSB: { value: '', visibility: true },
  //       bankName: { value: '', visibility: true },
  //       Account_Balance: { value: '', visibility: false },
  //       Account_Number: { value: '', visibility: true },
  //       AccountName: { value: '', visibility: true },
  //       Portfolio: { value: this.totalPortfolio[0].fascDesc.value, visibility: true },
  //       PortfolioName: { value: this.totalPortfolio[0].fascDesc.value, visibility: true },
  //       Currency: { value: 'USD', visibility: true },
  //       ErrorMessage: '',
  //       createdSuccessfully: '',
  //     });
  //   } catch (Ex) {
  //     console.log(Ex);
  //   }
  // }

  //Ruchira
  addAccount() {
    // this.fnGetAccountNumberToBeAdded();
    try {
      if (!this.IsAccountAddedinQueue) {
        this.IsAccountAddedinQueue = true;
        if (this.CardOrGridView) {
          this.cardViewAccounts.push({
            Portfolio: {
              value: this.totalPortfolio[0].fascDesc.value,
              visibility: false,
            },
            PortfolioName: {
              value: this.totalPortfolio[0].PortfolioName.value,
              visibility: true,
            },
            AccountList: [
              {
                Account_Balance: {
                  value: '',
                  visibility: false,
                },
                Account_Number: {
                  value: this.fnGetAccountNumberToBeAdded(),
                  visibility: false,
                },
                AccountName: {
                  value: this.homeapi.CustomerName,
                  visibility: false,
                },
                Currency: { value: 'USD', visibility: false },
                ErrorMessage: '',
                
              },
            ],
            createdSuccessfully: '',
                showCashHoldings: false,
                AddAccount: true,
          });
        } else {
          this.totalaccounts.push({
            BSB: { value: '', visibility: true },
            bankName: { value: '', visibility: true },
            Account_Balance: { value: '', visibility: false },
            Account_Number: {
              value: this.fnGetAccountNumberToBeAdded(),
              visibility: false,
            },
            AccountName: { value: '', visibility: true },
            Portfolio: {
              value: this.totalPortfolio[0].fascDesc.value,
              visibility: true,
            },
            PortfolioName: {
              value: this.totalPortfolio[0].PortfolioName.value,
              visibility: true,
            },
            Currency: { value: 'USD', visibility: true },
            ErrorMessage: '',
            createdSuccessfully: '',
            showCashHoldings: false,
          });
        }
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }
  removeAccount(index) {
    if (this.CardOrGridView) {
      this.cardViewAccounts.splice(index, 1);
    } else {
      this.totalaccounts.splice(index, 1);
    }
    this.IsAccountAddedinQueue = false;
  }

  fnGetAccountNumberToBeAdded() {
    let LastAddedAccNumber: any = '';
    this.CustomerAllAccountsDetail.forEach((res) => {
      console.log(res);
      if (LastAddedAccNumber === 0 || LastAddedAccNumber < Number(res.Param1)) {
        LastAddedAccNumber = res.Param1;
      }
    });

    LastAddedAccNumber = Number(LastAddedAccNumber) + 1; // Increase Acc no by 1

    return LastAddedAccNumber.toString().padStart(12, '0');
  }

  fnIsValidAccount(account) {
    let AccountFound: boolean = false;
    this.CustomerAllAccountsDetail.forEach((res) => {
      if (Number(res.Param1) === Number(account.Account_Number.value)) {
        AccountFound = true;
        return AccountFound;
      }
    });
    return AccountFound;
  }
  createAccount(account) {
    try {
      if(!this.CardOrGridView){
        if (account.Account_Number.value !== '' || account.AccountName.value !== '' || account.PortfolioName.value !== '' || account.Currency.value !== '') {
          if (!this.fnIsValidAccount(account) && this.fnValidations(account)) {
            this.afs.insertCustPortfolioDetails(
                this.CustomerID.toString(),
                account.Currency.value,
                account.Portfolio.value,
                account.Account_Number.value,
                this.Account_Type === '' || this.Account_Type === null
                  ? 'CA'
                  : this.Account_Type,
                account.BSB.value,
                account.bankName.value
              )
              .subscribe((res: any) => {
                if (res === 'Success') {
                  account.createdSuccessfully = 'true';
                  this.ErrorMsg = 'Account added successfully.';
                  this.fnGetCustomerAccounts();
                } else {
                  this.ErrorMsg = 'Failed: Error occured while adding Account.';
                }
                this.ErrorMsgVanish();
              });
          } else {
            this.ErrorMsg = 'Error: Same account already exist';
            this.ErrorMsgVanish();
          }
        } else {
          this.ErrorMsg = 'Please enter all the fields!';
          this.ErrorMsgVanish();
        }
      }else{
        if(account.AccountList[0].Account_Number.value !== '' || account.AccountList[0].AccountName.value !== '' || account.Portfolio.value !== '' || account.AccountList[0].Currency.value !== ''){
          this.afs.insertCustPortfolioDetails(this.CustomerID.toString(), account.AccountList[0].Currency.value, account.Portfolio.value, account.AccountList[0].Account_Number.value, this.Account_Type === '' || this.Account_Type === null ? 'CA' : this.Account_Type, '', '')
          .subscribe((res: any) => {
            if (res === 'Success') {
              account.createdSuccessfully = 'true';
              this.ErrorMsg = 'Account added successfully.';
              this.fnGetCustomerAccounts();
            } else {
              this.ErrorMsg = 'Failed: Error occured while adding Account.';
            }
            this.ErrorMsgVanish();
          });
        }
      }
     
    } catch (ex) {
      console.log('Unable to create account successfully: ', ex);
    }
  }
  ErrorMsgVanish() {
    const x = document.getElementById('snackbar');
    x.className = 'show';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setTimeout(() => {
      x.className = x.className.replace('show', '');
      this.ErrorMsg = '';
    }, 3000);
  }

  fnSelectedIndex(index) {
    this.SelectedIndexPortfolioForFinancialPlanning = index;
  }
  fnSelectedPortfolioForFinancialPlanning(data) {
    // console.log(data);
    this.FinancialPlanningOverlayflag = false;
    if (data.Goal !== '' && data.TargetGoal !== '') {
      this.totalPortfolio[
        this.SelectedIndexPortfolioForFinancialPlanning
      ].Goal.value = data.Goal;
      this.totalPortfolio[
        this.SelectedIndexPortfolioForFinancialPlanning
      ].Goal.visibility = true;
      this.totalPortfolio[
        this.SelectedIndexPortfolioForFinancialPlanning
      ].TargetGoal.value = data.TargetGoal;
      this.totalPortfolio[
        this.SelectedIndexPortfolioForFinancialPlanning
      ].TargetGoal.visibility = true;
    }
  }

  fnFixedDeposit() {
    this.FixedDepositOverlayflag = false;
  }
  fnCashDeposit() {
    this.CashDepositOverlayflag = false;
  }
  fnGotoPortfolioPage() {
    this.router.navigate(['/CustomerPortfolioDetails']);
  }
  showCashHoldings(account) {
    // this.showCashHoldingDetails = true;
    // account.showCashHoldings = !account.showCashHoldings;
    if (this.selectedAccount.index !== account.index) {
      this.totalaccounts.forEach((acc) => {
        acc.showCashHoldings = false;
      });
      this.selectedAccount = account;
      account.showCashHoldings = true;
    } else {
      account.showCashHoldings = !account.showCashHoldings;
    }

    this.comm.ScrollTo(
      'app-customer-account-details',
      '.cash-holdings-container',
      'up'
    );
    // this.selectedAccount.showCashHoldings = !account.showCashHoldings;

    this.afs
      .getCashHoldingsHistory(
        this.selectedCustomerDetails.custId,
        this.selectedCustomerDetails.custName,
        this.authorApi.EntityID,
        account.Account_Number.value
      )
      .subscribe((res) => {
        if (
          res.CashHoldingHistoryDetailsResult.FinIQResponseHeader.Status ===
          'Succeed'
        ) {
          this.selectedAccount.cashHoldings =
            res.CashHoldingHistoryDetailsResult.GetCashHoldingHistoryDetails;
          this.selectedAccount.cashHoldings.forEach((ch) => {
            ch.CEHDHC_LastUpdated_At =
              this.commonfunctionservice.getLocalDateFromEpochDate(
                ch.CEHDHC_LastUpdated_At
              );
          });
          console.log(this.selectedAccount.cashHoldings);
        }
      });
    console.log(account);
  }
  fnValidations(account) {
    if (
      account.Account_Number.value !== '' ||
      account.Account_Number.value !== null
    ) {
      return true;
    } else if (
      account.AccountName.value !== '' ||
      account.AccountName.value !== null
    ) {
      return true;
    } else if (
      account.Currency.value !== '' ||
      account.Currency.value !== null
    ) {
      return true;
    } else if (
      account.PortfolioName.value !== '' ||
      account.PortfolioName.value !== null
    ) {
      return true;
    }
    return false;
  }

  fnRedirectToHomePage() {
    if (this.homeapi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeapi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }
}
