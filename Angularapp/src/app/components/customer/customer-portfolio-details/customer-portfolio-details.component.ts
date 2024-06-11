import { Component, OnDestroy, OnInit, HostListener, ElementRef, AfterViewChecked } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/services/config.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-customer-portfolio-details',
  templateUrl: './customer-portfolio-details.component.html',
  styleUrls: ['./customer-portfolio-details.component.scss']
})
export class CustomerPortfolioDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {

  // @ViewChild(CustomerSubAccountComponent) CustomersubAccount:CustomerSubAccountComponent;

  LoggedInCustomerID: string;
  LoggedInCustomerUsername: string;
  addPortVisibility: boolean;
  callFlag: boolean = true;
  LoadingFlag: boolean = true;
  FinancialPlanningOverlayflag: boolean = false;
  addNewPortfolioflag: boolean = false;
  PortType = '';
  facDesc = '';
  index = 0;
  ErrorMessage = '';
  indexConst = '';
  FCode: any;
  CustomerID: any;
  RiskRating: any;
  RiskProfile: any;
  // Arrays
  unique = [];
  fascility = [];
  dd_InvestmentObjective = []; // ['Generating Income', 'Preserving Wealth', 'Market Speculation', 'Retirement Funding', 'Moderate Growth', 'Growth of Capital'];
  dd_PortfolioType = ['Cash Financing', 'LTV Financing', 'Share Margin Financing'];
  //  dd_PortfolioType = [];
  //dd_PortfolioType = ['LTV Financing']; // removed the remaining values asked by Harsh M on 19 Nov 2021
  dd_AutoPledge = ['Yes', 'No'];
  dd_RiskProfile = ['Balanced', 'LOW'];
  totalPortfolio = [];
  dd_CapitalCurrency = [];
  dd_LimitCurrency = [];
  totalaccounts = [];
  CurrencyList = [];
  AllTradablePairsDetails = [];
  portfolioNames: string[] = [];
  portfolioData: any[];
  data: any[] = [];


  type_port_details = 'PieChart';
  chartColors = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];
  options_port_details = {
    pieHole: 0,
    legend: {
      position: 'right', labeledValueText: 'both',
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    colors: this.chartColors,
    // width: '420',
    // height: '225',
    width: '500',
    height: '230',
    chartArea: {
      left: '20%',
      top: '20%',
      width: '100%',
      height: '100%',
      Margin: '0',
    },
    is3D: true,
    pieSliceTextStyle: {
      color: 'black',
    },
  };
  SelectedPortfolioForFinancialPlanning: string = '';
  SelectedIndexPortfolioForFinancialPlanning: number;

  dropdownValuesSubscription: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;
  GetAllTradableCurrenciesSubscriber: Subscription;
  LoadPortfolioSubscription: Subscription;
  AllocPortfolioSubsciption: Subscription;
  CustProfiledetailsSubscription: Subscription;
  InvestObjSubSubscriber: Subscription;

  isProd = environment.production;

  DisplayYNAddPortfolio: boolean;
  DisplayYNFinancialPlanning: boolean;
  DisplayYNEditPortfolio: boolean;
  DisplayYNClientOnboarding: boolean;


  constructor(private CustApi: CustomerApiService, public CustCfs: CustomerCommonfunctionsService, public elements: ElementRef, public homeapi: HomeApiService, public loginApi: LoginApiService, public authorApi: AuthService) {
    this.DisplayYNClientOnboarding = false;
  }

  // @HostListener('window:resize')
  // onWindowResize() {
  //   this.options_port_details.width = '320';
  //   this.options_port_details.height = '125';
  //   if (window.innerWidth <= 1477) {
  //     this.options_port_details.width = '420';
  //     this.options_port_details.height = '225';
  //   }
  // }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.addNewPortfolioflag = false;
      this.FinancialPlanningOverlayflag = false;
      this.fnremovePortfolioTile(this.totalPortfolio.length - 1);
    }
  }

  ngAfterViewChecked() {
    // console.log("out")
    Array.prototype.forEach.call(
      this.elements.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // console.log("hello")
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elements.nativeElement.getElementsByTagName('text'),
      (text: HTMLElement) => {
        if (['#222222', '#444444'].includes(text.getAttribute('fill'))) {
          // console.log("hello")
          text.setAttribute('fill', '#808080');
        }
      }
    );
  }

  ngOnInit() {
    this.fnDefaultValues();
    this.fnGetFacilitiesList();
    try {

      if (sessionStorage.getItem('UserType') === 'RM') {
        this.LoggedInCustomerID = sessionStorage.getItem('RMCustID');
        this.LoggedInCustomerUsername = sessionStorage.getItem('RMUser');

      } else {
        // this.LoggedInCustomerID = sessionStorage.getItem('CustomerID');
        this.LoggedInCustomerID = this.homeapi.CustomerId;
        // this.LoggedInCustomerUsername = sessionStorage.getItem('Username');
        this.LoggedInCustomerUsername = this.authorApi.UserName;
      };

    } catch (ex) {
      console.log('Error occurred while fetching Customer ID and Username');
    }

    // this.CustApi.GetCustProfileDetailsFromCustID(this.LoggedInCustomerID);

    this.addPortVisibility = AppConfig.settings.CSP_VisibleAddAccountAndPortfolioButton;
    // this.CustApi.isCustProfileCreated(this.LoggedInCustomerUsername, '', this.homeapi.NoteMasterID || '').subscribe((cust) => {
    //   // this.CustProfiledetailsSubscription = this.CustApi.GetCustProfileFromCustIDObserver.subscribe((cust: any) => {
    //   try {
    //     if (![0, undefined].includes(cust.length)) {
    //       // this.totalPortfolio = [];
    //       // this.CustomerID = cust[0].CustomerID;
    //       this.FCode = cust[0].misc10;
    //     }
    //   } catch (Exception) {
    //     console.log(Exception);
    //   }
    // });

    this.CustApi.loadDropdownValues('Risk_Profile', 'CommonData');
    this.dropdownValuesSubscription = this.CustApi.dropdownValues.subscribe(
      (d) => {
        if (d) {
          switch (d.filter) {
            case 'Risk_Profile':
              d.data.forEach((element) => {
                this.dd_RiskProfile.push(element.Code);
              });
              break;
          }
          this.fnCheckAllValuesLoaded();
        }
      }
    );

    this.CustApi.GetAllTradableCurrency();
    this.GetAllTradableCurrenciesSubscriber = this.CustApi.allTradablePairObserver.subscribe(
      (res: any) => {
        if (res) {
          this.CurrencyList = [];
          const map = new Map();
          // const obj = JSON.parse(res);
          this.AllTradablePairsDetails = res;
          this.AllTradablePairsDetails.forEach((element) => {
            map.set('' + element.Asset1, element.Asset1);
            map.set('' + element.Asset2, element.Asset2);
          });
          this.CurrencyList = Array.from(map.keys()).sort();
          this.dd_LimitCurrency = this.CurrencyList;
          this.dd_CapitalCurrency = this.CurrencyList;
          this.fnCheckAllValuesLoaded();
        }
      }
    );

    this.CustApi.GetCustInvestmentObj(this.LoggedInCustomerID);
    this.InvestObjSubSubscriber = this.CustApi.InvestObjSubObserver.subscribe((res: any) => {
      this.dd_InvestmentObjective = [];
      if (res.length > 0) {
        this.RiskProfile = res[0].benchmark_name || sessionStorage.getItem('RiskProfile').toUpperCase();
        res.forEach((element) => {
          this.dd_InvestmentObjective.push(element.benchmark_misc1);
        });
        this.fnCheckAllValuesLoaded();
      }
    });

    // try {
    //   if (sessionStorage.getItem('RiskProfile') === null || sessionStorage.getItem('RiskProfile') === '') {
    //     this.RiskProfile = '-';
    //   } else {
    //     this.RiskProfile = sessionStorage.getItem('RiskProfile');
    //   }
    // } catch (ex) {
    //   console.log('Error occured while fetching Risk Profile: ', ex);
    // }
    this.CustApi.ClearObserversonValidateUserPage();
    this.CustApi.GettCustomerAccountDetails(this.LoggedInCustomerUsername).subscribe((res) => {
      res = res.message;
      if (Object.keys(res).length > 0) {
        if (res.length !== undefined) {
          if (this.callFlag === true) {
            this.callFlag = false;
            const array = [];
            // Added by MohanP facilty code
            this.FCode = res[0].misc10;

            for (const acc of res) {
              array.push(acc.CustomerID);
            }
            this.RiskRating = res[res.length - 1].misc9;
            // this.CustomerID = res[res.length - 1].CustomerID;
            this.unique = array.filter(this.CustCfs.onlyUnique);
            if (this.LoggedInCustomerID !== undefined) {
              this.CustApi.GetCustInvestmentObj(this.LoggedInCustomerID);

            }
          }
          res.forEach((element) => {
            this.fnLoadAccounts(element);
          });
          const array = [];
          for (const acc of res) {
            array.push(acc.portfolio);
          }
          this.unique = array.filter(this.CustCfs.onlyUnique);
          this.fnCheckAllValuesLoaded();
        } else {

          this.LoadingFlag = false;
          this.ErrorMessage = 'No record found.';
        }
      }
    })
    // this.CustApi.fngetCustAccountDetailsforMultiAcc(this.LoggedInCustomerUsername);
    // this.GetCustomerMultiAccountDetailsSubscriber = this.CustApi.getCustAccountDetailsforMultiAcc.subscribe(
    //   (res) => {
    //     if (Object.keys(res).length > 0) {
    //       if (res.length !== undefined) {
    //         if (this.callFlag === true) {
    //           this.callFlag = false;
    //           const array = [];
    //           for (const acc of res) {
    //             array.push(acc.CustomerID);
    //           }
    //           this.RiskRating = res[res.length - 1].misc9;
    //           // this.CustomerID = res[res.length - 1].CustomerID;
    //           this.unique = array.filter(this.CustCfs.onlyUnique);
    //           if (this.LoggedInCustomerID !== undefined) {
    //             this.CustApi.GetCustInvestmentObj(this.LoggedInCustomerID);

    //           }
    //         }
    //         res.forEach((element) => {
    //           this.fnLoadAccounts(element);
    //         });
    //         const array = [];
    //         for (const acc of res) {
    //           array.push(acc.portfolio);
    //         }
    //         this.unique = array.filter(this.CustCfs.onlyUnique);
    //         this.fnCheckAllValuesLoaded();
    //       } else {

    //         this.LoadingFlag = false;
    //         this.ErrorMessage = 'No record found.';
    //       }
    //     }
    //   }
    // );
    this.CustApi.ResetLoadPortfolioSubObserver();
    this.fnLoadButtonsVisiblity();

    this.CustApi.LoadPortfolio(this.LoggedInCustomerID, this.homeapi.Portfolio);

    this.LoadPortfolioSubscription = this.CustApi.LoadPortfolioObserver.subscribe((res) => {
      if (Object.keys(res).length > 0) {
        if (res.Get_Portfolio_Details_RESTResult !== undefined) {
          this.totalPortfolio = [];
          res.Get_Portfolio_Details_RESTResult.forEach((element) => {
            if (element.Char8 !== null && element.Char8 !== '') { // Check Investment objective is null or having value
              this.facDesc = element.FacDesc;
              let capitalPosted =
                element.Capital_Posted === '' ? '0' : element.Capital_Posted;
              if (capitalPosted !== null) {
                if (!capitalPosted.search(',')) {
                  capitalPosted = this.CustCfs.FormatNumberr(capitalPosted);
                } else {
                  capitalPosted = this.CustCfs.FormatNumberr(
                    parseFloat(capitalPosted).toFixed(2)
                  );
                }
              }
              let limitPosted =
                element.FacLimit === '' ? '0' : element.FacLimit.toString();
              if (limitPosted !== null) {
                if (!limitPosted.search(',')) {
                  limitPosted = this.CustCfs.FormatNumberr(limitPosted);
                } else {
                  limitPosted = this.CustCfs.FormatNumberr(
                    parseFloat(limitPosted).toFixed(2)
                  );
                }
              }
              let fascCode;
              try {
                fascCode = element.FacDesc.split('-')[2];
                if (element.FacDesc.split('-')[2] === 'SMF') {
                  fascCode = 'Share Margin Financing';
                } else if (element.FacDesc.split('-')[2] === 'CUS') {
                  fascCode = 'Cash Financing';
                } else {
                  fascCode = 'LTV Financing';
                }
              } catch (ex) {

              }

              let autoPledge = '';
              if (element.AutoPledgeFlag === 'NO') {
                autoPledge = 'No';
              } else {
                autoPledge = 'Yes';
              }

              if (this.totalPortfolio.length < res.Get_Portfolio_Details_RESTResult.length) {
                this.portfolioNames.push(element.PortfolioName);
                try {
                  this.totalPortfolio.push({
                    PortfolioName: {
                      value: element.PortfolioName,
                      visibility: true,
                    },
                    CapitalCurrency: {
                      value: element.Capital_Ccy,
                      visibility: true,
                    },
                    LimitCurrency: {
                      value: element.Currency,
                      visibility: true,
                    },
                    LimitPosted: {
                      value: limitPosted,
                      visibility: true,
                    },
                    CapitalPosted: {
                      value: capitalPosted,
                      visibility: true,
                    },
                    PortfolioType: {
                      value: fascCode,
                      visibility: true,
                    },
                    AutoPledge: {
                      value: autoPledge,
                      visibility: true,
                    },
                    InvestmentObjective: {
                      value: element.Char8,
                      visibility: true,
                    },

                    fascDesc: {
                      value: element.FacDesc,
                      visibility: true,
                    },
                    SysCode: {
                      value: element.SysCode,
                      visibility: true,
                    },
                    LD_FM_ID: {
                      value: element.LD_FM_ID,
                      visibility: true,
                    },

                    removeVisibility: {
                      value: '',
                      visibility: false,
                    },
                    addVisibility: {
                      value: '',
                      visibility: true,
                    },
                    RiskProfile: {
                      value: (this.RiskProfile !== '' && this.RiskProfile !== undefined && this.RiskProfile !== null) ? this.RiskProfile.toUpperCase() : '',
                      visibility: true,
                    },
                    star: {
                      value: '',
                      visibility: true,
                    },
                    Mode: {
                      value: 'UPDATE',
                      visibility: true,
                    },
                    msg: {
                      value: 'default',
                      visibility: false,
                    },
                    Message: {
                      value: '',
                      visibility: false,
                    },
                    Goal: {
                      value: element.Goal === '' ? '-' : element.Goal,
                      visibility: true,
                    },
                    TargetGoal: {
                      value: element.TargetGoal === '' ? '0.00' : element.TargetGoal,
                      visibility: true,
                    },
                    CreateSubAccount: {
                      value: true,
                      visibility: true
                    },
                    SubAccountForm: [
                      {
                        controlName: 'Username',
                        selectedValue: '',
                        controlType: 'text',
                        isRequired: true
                      },
                      {
                        controlName: 'Email address',
                        selectedValue: '',
                        controlType: 'email',
                        isRequired: true
                      },
                      {
                        controlName: 'Password',
                        selectedValue: '',
                        controlType: 'password',
                        isRequired: true
                      },
                      {
                        controlName: 'Confirm Password',
                        selectedValue: '',
                        controlType: 'password',
                        isRequired: true
                      }
                    ]
                  });
                } catch (EX) {
                  console.log('Error occured while loading portfolio: ', EX);
                }
                const parameters = {
                  RiskProfile: (this.RiskProfile !== '' && this.RiskProfile !== undefined && this.RiskProfile !== null) ? this.RiskProfile.toUpperCase() : '',
                  InvestmentObj: element.Char8,
                  PortfolioName: element.PortfolioName,
                };
                this.portfolioData = [];
                this.CustApi.getPortfolioAllocation(parameters);
              }
            }

            this.fnCheckAllValuesLoaded();
          });
          if (window.innerWidth <= 1477) {
            this.options_port_details.width = '270';
            this.options_port_details.height = '150';
          }

        } else {
          this.LoadingFlag = false;
        }
      } else {
        this.LoadingFlag = false;
      }
    });

    this.data = [];

    this.AllocPortfolioSubsciption = this.CustApi.AllocPortfolioObserver.subscribe((res) => {
      this.fascility = [];
      this.totalPortfolio.forEach((element) => {
        this.fascility.push(element.fascDesc.value);
      });
      if (res.length) {
        try {
          this.totalPortfolio.map((pf) => {
            if (pf.PortfolioName.value === res[1]) {
              pf.ChartData = [];
              console.log(res[0])
              res[0].forEach((element) => {
                console.log(element)
                pf.ChartData.push({
                  title: element.Scheme_Name,
                  value: parseFloat(element.BA_Allocation),
                });
              })
              console.log(pf.ChartData)
            }
          });
          this.fnCheckAllValuesLoaded();
        } catch (ex) {
          // pf.ChartData = [];
          //     console.log(res[0])
          //     res[0].forEach((element) => {
          //       console.log(element)
          //       pf.ChartData.push({
          //         title: element.Scheme_Name,
          //         value: parseFloat(element.BA_Allocation),
          //       });
          //     })

        }
      } else {
        this.LoadingFlag = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.dd_CapitalCurrency = [];
    this.totalPortfolio = [];
    this.dd_LimitCurrency = [];
    this.totalaccounts = [];
    this.CurrencyList = [];
    this.AllTradablePairsDetails = [];
    if (this.dropdownValuesSubscription) this.dropdownValuesSubscription.unsubscribe();
    if (this.GetCustomerMultiAccountDetailsSubscriber) this.GetCustomerMultiAccountDetailsSubscriber.unsubscribe();
    if (this.GetAllTradableCurrenciesSubscriber) this.GetAllTradableCurrenciesSubscriber.unsubscribe();
    if (this.LoadPortfolioSubscription) this.LoadPortfolioSubscription.unsubscribe();
    if (this.AllocPortfolioSubsciption) this.AllocPortfolioSubsciption.unsubscribe();
    if (this.CustProfiledetailsSubscription) this.CustProfiledetailsSubscription.unsubscribe();
    if (this.InvestObjSubSubscriber) this.InvestObjSubSubscriber.unsubscribe();
    this.CustApi.ResetLoadPortfolioSubObserver();
    this.CustApi.ClearObserversonValidateUserPage();
  }

  fnLoadButtonsVisiblity() {
    this.CustApi.getCommonDataEFX('CSP_CustomerProfileButtons').subscribe((res: any) => {
      if (res.Get_Configurable_Common_DataResult.length !== 0) {
        res.Get_Configurable_Common_DataResult.forEach(element => {
          if (element) {
            if (element.DATA_VALUE === 'AddPortfolio') {
              this.DisplayYNAddPortfolio = element.Misc1.split(',').includes(sessionStorage.getItem('UserType').toString().toUpperCase());
            }
            if (element.DATA_VALUE === 'FinancialPlanning') {
              this.DisplayYNFinancialPlanning = element.Misc1.split(',').includes(sessionStorage.getItem('UserType').toString().toUpperCase());
            }
            if (element.DATA_VALUE === 'EditPortfolio') {
              this.DisplayYNEditPortfolio = element.Misc1.split(',').includes(sessionStorage.getItem('UserType').toString().toUpperCase());
            }
          }
        });
      }
    });
  }

  fnDefaultValues() {
    try {
      this.LoadingFlag = true;
      this.LoggedInCustomerID = '';
      this.LoggedInCustomerUsername = '';
      this.addPortVisibility = true; // Enable the Add New portfolio button
      this.addNewPortfolioflag = false;
      // this.CreateSubAccount = false;
      this.RiskProfile = sessionStorage.getItem('RiskProfile').toUpperCase();
    } catch (ex) {

    }

  }

  fnaddPortfolioTile() {

    this.CustApi.GetCustInvestmentObj(this.LoggedInCustomerID);
    this.totalPortfolio.push({
      PortfolioName: {
        value: 'New Portfolio',
        visibility: true,
      },
      CapitalCurrency: {
        value: 'USD',
        visibility: true,
      },
      LimitCurrency: {
        value: 'USD',
        visibility: true,
      },
      LimitPosted: {
        value: '100,000.00',
        visibility: true,
      },
      CapitalPosted: {
        value: '100,000.00',
        visibility: true,
      },
      PortfolioType: {
        value: this.dd_PortfolioType[0],
        visibility: true,
      },
      AutoPledge: {
        value: 'No',
        visibility: true,
      },
      InvestmentObjective: {
        value: this.dd_InvestmentObjective[0],
        visibility: true,
      },
      fascDesc: {
        value: '',
        visibility: true,
      },
      removeVisibility: {
        value: '',
        visibility: true,
      },
      addVisibility: {
        value: '',
        visibility: false,
      },
      RiskProfile: {
        value: (this.RiskProfile !== '' && this.RiskProfile !== undefined && this.RiskProfile !== null) ? this.RiskProfile.toUpperCase() : '',
        visibility: true,
      },
      star: {
        value: '*',
        visibility: true,
      },
      Mode: {
        value: 'INSERT',
        visibility: true,
      },
      msg: {
        value: 'default',
        visibility: false,
      },
      Message: {
        value: '',
        visibility: false,
      },
      Goal: {
        value: '',
        visibility: false,
      },
      TargetGoal: {
        value: '',
        visibility: false,
      },
      CreateSubAccount: {
        value: true,
        visibility: true,
        errorMsg: '',
        isError: false
      },
      SubAccountForm: [
        {
          controlName: 'Username',
          selectedValue: '',
          controlType: 'text',
          isRequired: true,
          isDisabled: false
        },
        {
          controlName: 'Email address',
          selectedValue: '',
          controlType: 'email',
          isRequired: true,
          isDisabled: false
        },
        {
          controlName: 'Password',
          selectedValue: '',
          controlType: 'password',
          isRequired: true,
          isDisabled: false
        },
        {
          controlName: 'Confirm Password',
          selectedValue: '',
          controlType: 'password',
          isRequired: true,
          isDisabled: false
        }
      ]
    });
    this.addPortVisibility = false;
    setTimeout(() => {
      // elmnt.scrollIntoView({ behavior: 'smooth' });
      // elmnt.scrollTop = elmnt.scrollHeight;
    }, 500);
    this.fnchangeFascDescWithoutEvent(this.dd_PortfolioType[0], (this.totalPortfolio.length - 1));
    this.CustApi.loadDropdownValues('Investment_Objective', 'CommonData');
    this.addNewPortfolioflag = true;
  }

  fnremovePortfolioTile(ind: number) {
    this.totalPortfolio[ind].msg.visibility = false;
    this.totalPortfolio[ind].msg.value = '';
    this.totalPortfolio[ind].Message.visibility = false;
    if (this.totalPortfolio[ind].Mode.value === 'INSERT') {
      this.totalPortfolio.pop();
      this.addPortVisibility = true;
      setTimeout(() => {
        // elmnt.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      this.totalPortfolio[ind].removeVisibility.visibility = false;
    }
    this.CustApi.LoadPortfolio(this.LoggedInCustomerID, 0);
    this.addNewPortfolioflag = false;

  }

  fneditPortfolioTile(index: number) {
    this.totalPortfolio[index].removeVisibility.visibility = true;
    this.fnSetFascTypeDefault(this.totalPortfolio[index].PortfolioType.value);
  }

  fnCheckValidPorfolio(ind: any) {
    let flagName;
    let i = 0;
    for (i = 0; i < this.portfolioNames.length; i++) {
      if (this.portfolioNames[i] === this.totalPortfolio[ind].PortfolioName.value && this.totalPortfolio[ind].removeVisibility.visibility === false) {
        flagName = true;
        break;
      } else {
        flagName = false;
      }
    }
    if (this.totalPortfolio[ind].PortfolioName.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Portfolio Name can not be blank';
      return false;
      // console.log(this.totalPortfolio[ind].msg.value);
    } else if (flagName === true) {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Duplicate Portfolio Name';
      return false;
    } else if (this.totalPortfolio[ind].CapitalPosted.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Capital Posted can not be blank';
      return false;
    } else if (this.totalPortfolio[ind].PortfolioType.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Portfolio Type can not be blank';
      return false;
    }
    if (this.totalPortfolio[ind].CreateSubAccount.value) {
      if (this.fnVerifyRequestBeforeSubmit(this.totalPortfolio[ind])) {
        return true;
      } else {
        this.totalPortfolio[ind].msg.visibility = true;
        this.totalPortfolio[ind].msg.value = this.ErrorMessage
        return false;
      }
    }
    return true;
  }


  fnsavePortfolioTile(account: any, ind: number) {

    if (this.fnCheckValidPorfolio(ind)) {
      // Valid Portfolio
      const capitalPosted = this.CustCfs.removeComma(this.totalPortfolio[ind].CapitalPosted.value);
      const FacLimit = this.CustCfs.removeComma(this.totalPortfolio[ind].LimitPosted.value);

      const parameters = {
        PortfolioName: this.totalPortfolio[ind].PortfolioName.value,
        InvestmentObj: this.totalPortfolio[ind].InvestmentObjective.value,
        AutoPledgeFlag: this.totalPortfolio[ind].AutoPledge.value.toUpperCase(),
        Currency: this.totalPortfolio[ind].CapitalCurrency.value,
        CustomerID: this.LoggedInCustomerID,
        LoginID: this.LoggedInCustomerUsername,
        facdesc: account.fascDesc.value,
        LD_Facility_code: this.PortType,
        LD_FM_ID: '0', // this.totalPortfolio[ind - 1].LD_FM_ID.value,
        SysCode: '', // this.totalPortfolio[ind - 1].SysCode.value,
        CapitalPosted: capitalPosted,
        Fac_Limit: FacLimit,
        Mode: this.totalPortfolio[ind].Mode.value,
        Goal: this.totalPortfolio[ind].Goal.value === '-' ? '' : this.totalPortfolio[ind].Goal.value,
        TargetGoal: this.totalPortfolio[ind].TargetGoal.value,
      };

      this.totalPortfolio[ind].msg.value = '';
      this.totalPortfolio[ind].msg.visibility = false;

      this.CustApi.savePortfolio(parameters).subscribe((res: any) => {
        // console.log(res);
        if (res) {
          if (res.Status) {
            this.totalPortfolio[ind].msg.visibility = false;
            this.totalPortfolio[ind].msg.value = '';
            // this.totalPortfolio[ind].Message.value = 'Portfolio saved!';
            // this.totalPortfolio[ind].Message.visibility = true;
            this.totalPortfolio[ind].addVisibility.visibility = true;
            this.totalPortfolio[ind].removeVisibility.visibility = false;
            const parameters = {
              RiskProfile: (this.RiskProfile !== '' && this.RiskProfile !== undefined && this.RiskProfile !== null) ? this.RiskProfile.toUpperCase() : '',
              InvestmentObj: this.totalPortfolio[ind].InvestmentObjective.value,
              PortfolioName: this.totalPortfolio[ind].PortfolioName.value,
            };
            this.portfolioData = [];
            this.CustApi.getPortfolioAllocation(parameters);


            // this.CustApi.LoadPortfolio(this.LoggedInCustomerID, 0);
          }else{
            this.totalPortfolio[ind].msg.visibility = true;
            this.totalPortfolio[ind].msg.value = 'Something went wrong';
          }
        }
      });

      if (account.CreateSubAccount.value) {
        this.fnCreateAccount(account);
      }


    } else {
      // Invalid Portfolio
    }
    // }
  }

  fnchangeFascDesc(event, ind: number) {
    let max = 0;
    let cnt_ltv = 1;
    let cnt_smf = 1;
    let cnt_cus = 1;
    let facility = this.fascility.sort((a, b) => {
      return b - a;
    });
    facility.forEach((ele) => {
      max = 0;
      if (ele.split('-')[2] === 'LTV') {
        cnt_ltv = parseInt(ele.split('-')[3]) + 1;
      } else if (ele.split('-')[2] === 'SMF') {
        cnt_smf = parseInt(ele.split('-')[3]) + 1;
      } else {
        cnt_cus = parseInt(ele.split('-')[3]) + 1;
      }
    });
    if (event.target.value === 'Share Margin Financing') {
      this.PortType = 'SMF';
      max = cnt_smf;
    } else if (event.target.value === 'Cash Financing') {
      this.PortType = 'CUS';
      max = cnt_cus;
    } else {
      this.PortType = 'LTV';
      max = cnt_ltv;
    }
    // console.log('fasc desc', this.totalPortfolio[ind].fascDesc.value === '');
    if (this.facDesc === '' || this.facDesc === undefined || this.facDesc === null) {
      this.totalPortfolio[ind].fascDesc.value = this.FCode + '-S-' + this.PortType + '-' + max.toString();
    } else {
      this.totalPortfolio[ind].fascDesc.value = this.facDesc.split('-')[0] + '-S-' + this.PortType + '-' + max.toString();
    }
  }

  fnchangeFascDescWithoutEvent(portfolioType, ind) {
    let max = 0;
    let cnt_ltv = 1;
    let cnt_smf = 1;
    let cnt_cus = 1;
    let facility = this.fascility.sort((a, b) => {
      return b - a;
    });
    facility.sort();
    facility.forEach((ele) => {
      max = 0;
      if (ele.split('-')[2] === 'LTV') {
        cnt_ltv = parseInt(ele.split('-')[3]) + 1;
      } else if (ele.split('-')[2] === 'SMF') {
        cnt_smf = parseInt(ele.split('-')[3]) + 1;
      } else {
        cnt_cus = parseInt(ele.split('-')[3]) + 1;
      }
    });
    if (portfolioType === 'Share Margin Financing') {
      this.PortType = 'SMF';
      max = cnt_smf;
    } else if (portfolioType === 'Cash Financing') {
      this.PortType = 'CUS';
      max = cnt_cus;
    } else {
      this.PortType = 'LTV';
      max = cnt_ltv;
    }
    // console.log('fasc desc', this.totalPortfolio[ind].fascDesc.value === '');
    if (this.facDesc === '' || this.facDesc === undefined || this.facDesc === null) {
      this.totalPortfolio[ind].fascDesc.value = this.FCode + '-S-' + this.PortType + '-' + max.toString();
    } else {
      this.totalPortfolio[ind].fascDesc.value = this.facDesc.split('-')[0] + '-S-' + this.PortType + '-' + max.toString();
    }
  }

  fnSelectPieChartSlice(_event) {
  }

  fnSelectedIndex(index) {
    this.SelectedIndexPortfolioForFinancialPlanning = index;
  }

  fnSelectedPortfolioForFinancialPlanning(data) {
    console.log(data);
    this.FinancialPlanningOverlayflag = false;
    if (data.Goal !== '' && data.TargetGoal !== '') {
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].Goal.value = data.Goal;
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].Goal.visibility = true;
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].TargetGoal.value = Number(data.TargetGoal).toLocaleString('en');
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].TargetGoal.visibility = true;

      this.fneditPortfolioTile(this.SelectedIndexPortfolioForFinancialPlanning);
      this.fnsavePortfolioTile('', this.SelectedIndexPortfolioForFinancialPlanning);
    }

  }

  fnLoadAccounts(res) {
    if (res.accountnumber !== null) {
      this.totalaccounts.push({
        BSB: { value: Number(res.misc6).toString(), visibility: false },
        // bankName: { value: res.Bank_Name, visibility: false },
        bankName: { value: res.misc3, visibility: false },
        Account_Balance: { value: '0.00', visibility: false },
        Account_Number: { value: res.accountnumber, visibility: false },
        AccountName: { value: res.Customer_Name, visibility: false },
        Portfolio: { value: res.portfolio, visibility: false },
        PortfolioName: { value: '', visibility: true },
        Currency: { value: res.Accountcurrency, visibility: false },
        ErrorMessage: '',
        createdSuccessfully: 'true',
      });
    }
  }

  fnGetLastIndexofTotalPortfolios() {
    return this.totalPortfolio[this.totalPortfolio.length - 1];
  }

  fnCheckAllValuesLoaded() {
    // try {
    //   if (this.dd_CapitalCurrency.length > 0 && this.totalPortfolio.length > 0 && this.dd_LimitCurrency.length > 0 && this.totalaccounts.length > 0 && this.CurrencyList.length > 0 && this.AllTradablePairsDetails.length > 0) {
    //     this.LoadingFlag = false;
    //   } else {
    //     // if(this.totalPortfolio !== []){
    //     this.LoadingFlag = true;
    //     // }
    //   }
    // } catch (ex) {
    //   console.log('Error occured while checking the data is loaded or not: ', ex);
    // }
  }

  fnToggleCustomerOnboarding(index) {
    this.totalPortfolio[index].CreateSubAccount.value === true ? this.totalPortfolio[index].CreateSubAccount.value = false : this.totalPortfolio[index].CreateSubAccount.value = true;
  }
  fnCloseCreateSubAccount(event) {
    this.totalPortfolio[event.split(',')[1]].CreateSubAccount.value = Boolean(JSON.parse(event.split(',')[0]));
  }
  fnGetFacilitiesList() {
    this.CustApi.fnFacilitiesList('', '').subscribe(res => {
      if (res) {
        console.log(res.GetFacilityMasterResult);
        if (res.GetFacilityMasterResult.length > 0) {
          this.dd_PortfolioType = [];
          res.GetFacilityMasterResult.forEach(element => {
            this.dd_PortfolioType.push(element.Facility_Name);
          });
        }
      }
    });
  }
  fnSetSubAccountCreatedOrNot(event) {
    var SplittedSubAccount = event.split(',');
    this.totalPortfolio.forEach((element, i) => {
      if (element) {
        if (i === Number(SplittedSubAccount[0])) {
          element.CreateSubAccount.value = JSON.parse(SplittedSubAccount[1]);
        }
      }
    });
  }

  fnCreateAccount(account): boolean {
    if (this.fnVerifyRequestBeforeSubmit(account)) {
      this.loginApi.RegisterUser(
        account.SubAccountForm[0].selectedValue,
        account.SubAccountForm[1].selectedValue,
        account.SubAccountForm[2].selectedValue,
        '40.65.134.77',
        'Stanhope',
        'WINDOWS',
        'OnlineBanking_SA',
        this.authorApi.EntityID
      )
        .subscribe((res) => {
          if (res.Status) {
            switch (res.Status) {
              case 1:
                account.SubAccountForm[0].isDisabled = true;
                account.SubAccountForm[1].isDisabled = true;
                account.SubAccountForm[2].isDisabled = true;
                account.SubAccountForm[3].isDisabled = true;

                this.loginApi.SendVerifyMail(account.SubAccountForm[0].selectedValue).subscribe((mail) => {
                  if (mail.InsertEmailNotificationStatusResult === 'Success') {
                    // this.NotificationMsg = res.ResponseMessage;
                  }

                });

                this.fnSetSubAccountToPortfolio(account);
                break;
              case 2:
                // this.NotificationMsg = 'Registration Unsuccessful! ' + res.ResponseMessage;
                break;
              default:
                break;
            }
          }
        });
      return true;
    } else {
      account.msg.visibility = true;
      account.msg.value = this.ErrorMessage;
      return false;
    }
  }

  fnSetSubAccountToPortfolio(account) {

    // this.CustApi.fnSetSubAccountToPortfolio(this.authorApi.UserName, account.SubAccountForm[0].selectedValue, this.homeapi.NoteMasterID, account.fascDesc.value).subscribe(res => {
    this.CustApi.fnSetSubAccountToPortfolio(this.LoggedInCustomerUsername, account.SubAccountForm[0].selectedValue, this.homeapi.NoteMasterID, account.fascDesc.value).subscribe(res => {
      if (res) {
        console.log(res);
        return true;
      }
    });
  }

  fnVerifyRequestBeforeSubmit(account) {
    if (account.SubAccountForm[0].selectedValue === '' ||
      account.SubAccountForm[2].selectedValue === '' ||
      account.SubAccountForm[3].selectedValue === '' ||
      account.SubAccountForm[1].selectedValue === '') {
      this.ErrorMessage = 'Please enter all the Registration fields!';
      return false;
    }
    if (account.SubAccountForm[2].selectedValue !== account.SubAccountForm[3].selectedValue) {
      this.ErrorMessage = 'Password don\'t match!';
      return false;
    }
    if (!this.fnValidateEmail(account.SubAccountForm[1].selectedValue)) {
      this.ErrorMessage = 'Please enter correct Email Id!';
      return false;
    }
    return true;
  }

  fnValidateEmail(email) {
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  }

  resetError(account) {
    account.msg.visibility = false;
    account.msg.value = '';
  }
  fnSetFascTypeDefault(portfolioType){
    if (portfolioType === 'Share Margin Financing') {
      this.PortType = 'SMF';
    } else if (portfolioType === 'Cash Financing') {
      this.PortType = 'CUS';
    } else {
      this.PortType = 'LTV';
    }
  }
}
