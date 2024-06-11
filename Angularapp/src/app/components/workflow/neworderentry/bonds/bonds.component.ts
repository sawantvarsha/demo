import { Component, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { environment } from '../../../../../environments/environment';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss'],
})
export class BondsComponent implements OnInit, OnDestroy {
  // YTM: string;
  // YTConv
  // SettAmt
  // AccInt
  // ClientPrice

  productCatCheck = false;
  selectedCustomerName = '';

  ProductNameParameter = '';
  FlagForBond = '';

  @Input() displaySearch: boolean;
  @Input() note_Master_Id: any = '';
  bondNMID: any;
  businessDate: any;
  @Input() get noteMasterId() {
    return this.bondNMID;
  }
  set noteMasterId(noteMasterId) {
    this.bondNMID = noteMasterId;
  }

  @Input() get Customer() {
    return this.selectedCustomerName;
  }
  set Customer(Customer) {
    this.selectedCustomerName = Customer;
  }

  isProd = environment.production;
  months = [
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
  nominal: any;
  spread: any;
  ClientPrice: any;
  AccInt: any;
  AccVal: any;
  SettAmt: any;
  settval: any;
  AccDays: any;
  BankPNL: any;
  Proceeds: any;
  successMsg: any;
  OrderID: any;
  placeorderFlag: boolean;
  reqParam: any;
  OrderBlotterVisibility: boolean;
  OrderType: string;
  TimeInForce: string;
  bondsList: any[];
  search: string;
  showSuggestions: boolean;
  CurrentYield: any;
  CleanPrice: any;
  DirtyPrice: any;
  YTM: any;
  YTC: any;
  YTP: any;
  YTConv: any;
  CustDirtyPrice: any;
  CustCleanPrice: any;
  ISIN: any;
  MarketCleanPrice: any;
  MarketDirtyPrice: any;
  NoteMasterId: any;
  details: any;
  selectedBond: any;
  showBondDetails: boolean;
  selectedBIndex: any = 0;
  settlementDate: any;
  loadflag: boolean;
  noBalFlag: boolean;
  side: any;
  tradeDate: string;
  orderTime: string;
  min1: any;
  ampm: string;
  hours1: number;
  settlementType: any;
  expiryDate: any;
  moredetails = 'More Details';
  portfolioList = [];
  portfolioAccount = [];
  Account_Name: string;
  Account_Number: string;
  currency: any;
  ccy = [];
  accountList = [];
  remainingUnits: any;
  portfolio: string;
  CustomerID: any;
  // multiportfoliodata: Subscription;
  bondsubscribe: Subscription;
  bondDetails: Subscription;
  bondCalculations: Subscription;
  bondlist: Subscription;
  CustomerName: any;
  username: string;
  clorId: any;
  PRR: any;
  CRR: any;
  msg = '';
  CashBalance: any;
  portfolioDetails: any[] = [];
  remainingBalance: any = '0';
  remainingBalFlag: boolean;
  isEditable = true;
  InterbankaskPrice: any = '';
  InterbankbidPrice: any = '';
  TargetInterbankPrice: any = '';
  btnname = 'Subscribe';
  Remark = '';
  CIF = '';
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  CurrencyList = [];
  showSubmit: boolean;
  popUpflag: boolean;
  CustName: any;
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
  LoginID = '';
  bondMsg: any;
  bondRemark: any;
  configData: Subscription;
  configValue: any;
  cashccy: any[];
  cashbalance: any[];
  balanceFlag: boolean;
  baseCCY: string;
  QuantityType: any;
  enablePortfolio = true;
  RMName: any;
  FundingModeData: any;
  FundMode: any = 'Fully Funded';
  FundVal: any;
  LoanAmt: any = 0;
  LoanTenor: any = '12M';
  TenorData: any;
  Drawdown: any = '0';
  showSuitabilityPopup: boolean;
  sut_notemaster: string;
  checkSuitability: boolean = false; // Added by Alolika G. | 07-Feb-2021
  NMID_Suitability: any;
  orderDetails: any;
  commissionValue: any = '';
  commissionPercentage: any = '';
  commissionReason: any = '';
  token: any;
  SetFlagtoCustomerBS: Subscription;
  selectedDirBS: Subscription;
  bondInfoBS: Subscription;
  bondsAmendBS: Subscription;
  bondsCancelBS: Subscription;
  selectedPortfolioBS: Subscription;
  selectedPortfolioBalBS: Subscription;
  portfolioSecHoldingBS: Subscription;
  selectedAssetBS: Subscription;
  constructor(
    private workflowApi: WorkflowApiService,
    public com: CommonApiService,
    private elem: ElementRef,
    private cfs: CustomerApiService,
    public authorApi: AuthService,
    public homeApi: HomeApiService,
    public activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,

  ) {
    this.ResetAllFields();
    this.side = 'Buy';
    this.nominal = '0';
    this.successMsg = '';
    this.AccInt = '';
    this.AccVal = '';
    this.SettAmt = '';
    this.settval = '';
    this.bondMsg = '';
    this.showSuggestions = false;
    this.showSubmit = false;
    this.NMID_Suitability = '';
  }
  ngOnDestroy() {
    this.details = [];
    // this.workflowApi.multiportfolio.next([]);
    // this.multiportfoliodata.unsubscribe();
    if (this.bondsubscribe) {
      this.bondsubscribe.unsubscribe();
      this.bondsubscribe = null;
    }

    if (this.bondDetails) {
      this.bondDetails.unsubscribe();
      this.bondDetails = null;
    }

    if (this.bondCalculations) {
      this.bondCalculations.remove;
      this.workflowApi.bondCalculations.next([]);
      this.bondCalculations = null;
    }
    if (this.bondlist) {
      this.bondlist.unsubscribe();
      this.bondlist = null;
    }

    if (this.bondInfoBS) {
      this.bondInfoBS.unsubscribe();
      this.bondInfoBS = null;
    }
    if (this.portfolioSecHoldingBS) {
      this.portfolioSecHoldingBS.unsubscribe();
      this.portfolioSecHoldingBS = null;
    }
    if (this.selectedPortfolioBalBS) {
      this.selectedPortfolioBalBS.unsubscribe();
      this.selectedPortfolioBalBS = null;
    }
    if (this.selectedPortfolioBS) {
      this.selectedPortfolioBS.unsubscribe();
      this.selectedPortfolioBS = null;
    }
    if (this.bondsCancelBS) {
      this.bondsCancelBS.unsubscribe();
      this.bondsCancelBS = null;
    }
    if (this.bondsAmendBS) {
      this.bondsAmendBS.unsubscribe();
      this.bondsAmendBS = null;
    }
    if (this.selectedAssetBS) {
      this.selectedAssetBS.unsubscribe();
      this.selectedAssetBS = null;
    }
    this.selectedDirBS.unsubscribe();
    this.com.selectedDir.next([]);
    // console.log('destroy');
    this.workflowApi.bondsubscribe.next([]);
    this.successMsg = '';
    this.bondMsg = '';
    this.selectedCustomerDetails = [];
    this.com.sendDatatoBondsOrderEntry([], '');
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';

    //Changes on 08 Feb 2022 by Ashwini H.
    this.ClientPrice = null;
    this.productCatCheck = false;
    // sessionStorage.removeItem('selectedCustomerName');
    // sessionStorage.removeItem('BondPorfolioDetails'); //Commented by Alolika G | 10-03-2022 --To be confirmed with Ashwini H
    this.CustomerName = '';
    this.CustomerID = '';
    this.ResetAllFields();
    this.ResetCalculatebtn();
  }

  ngOnInit(): void {
    this.ResetAllFields(); //Changes on 08 Feb 2022 by Ashwini H.
    this.ResetCalculatebtn(); //Changes on 08 Feb 2022 by Ashwini H.
    this.productCatCheck = false; //Changes on 08 Feb 2022 by Ashwini H.

    this.FlagForBond = sessionStorage.getItem('BondPorfolioDetails'); //Changes on 08 Feb 2022 by Ashwini H.

    this.activatedRoute.queryParams.subscribe((res) => {
      if (!this.displaySearch) {
        this.displaySearch = res.displaySearch;
      }
    });

    //to clear selected  by Ashwini H.
    if (this.FlagForBond === 'FromBondDetails') {
      sessionStorage.removeItem('selectedCustomerName');
    }
    if (this.FlagForBond === 'FromDynamicForm') {
      sessionStorage.removeItem('selectedCustomerName');
    }
    // if (this.FlagForBond === 'FromRebalOrder') {
    //   sessionStorage.removeItem('selectedCustomerName');
    // }

    this.LoginID = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.enablePortfolio = false;

      //Changes by Ashwini H. on 07 Feb 2022
      console.log('Name', sessionStorage.getItem('selectedCustomerName'));
      if (!this.selectedCustomerName) {
        this.selectedCustomerName = sessionStorage.getItem(
          'selectedCustomerName'
        );
        if (this.selectedCustomerName) {
          this.CustomerName = this.selectedCustomerName;
        }
      } else {
        this.CustomerName = this.selectedCustomerName;
      }

      if (!['', null, undefined].includes(this.selectedCustomerName)) {
        this.enablePortfolio = true;
        this.cfs.fngetCustAccountDetails(
          this.selectedCustomerName.split('|')[0]
        );
      }
    }

    // this.activatedRoute.queryParams.subscribe((res) => {
    //   console.log('NMID', res);
    // });

    //this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.cfs.getBankBaseCCYOBS.subscribe((ccy) => {
      if (ccy !== '') {
        this.baseCCY = ccy;
      }
    });
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.CustomerID = this.homeApi.CustomerId;
      this.CustomerName = this.homeApi.CustomerName;
    } else {
      // this.RMName = this.userType;
      this.RMName = this.LoginID; //Changes on 08 Feb 2022 by Ashwini H.
    }
    if (!this.isUserRM) {
      this.workflowApi.getbondslist(this.LoginID, '', this.authorApi.EntityID);
    }
    this.username = sessionStorage.getItem('Username');
    this.CRR = sessionStorage.getItem('CRR');
    this.successMsg = '';
    this.bondMsg = '';
    this.details = [];
    this.cfs.fngetCustAccountDetails(this.username);
    this.workflowApi.getConfigValue(
      this.authorApi.EntityID,
      'BidAskSpread_BPS_YesNo'
    );

    // this.workflowApi.getbondslist('');
    // this.workflowApi.bondlistObserver.subscribe((res: any) => {
    //   if (res) {
    //     console.log(res);
    //   }
    // });
    // this.workflowApi.getbonddetails(74378);
    // this.workflowApi.bondDetailsObserver.subscribe((res: any) => {
    //   console.log(res);
    // });
    this.selectedAssetBS = this.com.selectedAssetObserver.subscribe(
      async (res) => {
        //Changes on 15 Feb 2022 by Ashwini H.
        this.FlagForBond = sessionStorage.getItem('BondPorfolioDetails');
        if (
          this.FlagForBond === 'FromDynamicForm' ||
          this.FlagForBond === 'FromBondDetails' ||
          this.FlagForBond === 'FromRebalOrder'
        ) {
          if (
            !['', null, undefined].includes(res.ISIN) &&
            !['', null, undefined].includes(res.Product_Name || res.ProductName)
          ) {
            if (!['', null, undefined].includes(res.Product_Name)) {
              this.ProductNameParameter = res.Product_Name;
            } else if (!['', null, undefined].includes(res.ProductName)) {
              this.ProductNameParameter = res.ProductName;
            }

            this.ISIN = res.ISIN;
          }
        }
        if (this.FlagForBond === 'FromPortfolioDetails') {
          if (
            !['', null, undefined].includes(res.ISIN[0]) &&
            !['', null, undefined].includes(res.longName[0])
          ) {
            let ProductNameFromService = res.longName[0];
            ProductNameFromService = ProductNameFromService.substring(
              0,
              ProductNameFromService.length - 6
            );
            this.ProductNameParameter = ProductNameFromService;

            this.ISIN = res.ISIN[0];
          }
        }

        if (this.FlagForBond === 'FromCardOrder') {
          if (!['', null, undefined].includes(res[0].Misc1)) {
            this.ProductNameParameter = res[0].Misc2;
          }

          this.ISIN = res[0].Misc1;
          console.log(
            'bond productCatCheck',
            this.ProductNameParameter,
            this.ISIN
          );
        }

        this.bondsList = await this.workflowApi.getbondslistasync(
          this.LoginID,
          this.ProductNameParameter,
          this.authorApi.EntityID
        );

        const selectedBond = this.bondsList.filter(
          (b) => b.ISIN === this.ISIN
        )[0];
        this.NoteMasterId = selectedBond.Note_Master_id;

        //Changes on 07 Feb 2022 by Ashwini H. for NoteMasterCheck
        if (this.NoteMasterId != '' || this.NoteMasterId != undefined) {
          this.selectbondOnClick(this.NoteMasterId);
          // this.workflowApi.bondDetails.next(res.BondInfoResponse);
        }
      }
    );
    try {
      this.configData = this.workflowApi.configValueObserver.subscribe(
        (res) => {
          if (res.length !== 0) {
            this.configValue =
              res.Get_Config_ValueResult[0].Config_Value.toUpperCase();
          }
        }
      );
    } catch (error) { }

    try {
      // console.log(history.state.NoteMasterId);
      this.reqParam = history.state.NoteMasterId;
      const that = this;
      this.OrderBlotterVisibility = false;
      this.spread = '2.00';
      this.placeorderFlag = false;
      this.OrderType = 'Market';
      this.TimeInForce = 'DAY';

      this.bondsList = [];
      this.search = '';
      this.showSuggestions = false;
      // this.CustomerID = this.homeApi.CustomerId;
      // this.CustomerName = this.homeApi.CustomerName;

      this.bondCalculations =
        this.workflowApi.bondCalculationsObserver.subscribe((c: any) => {
          if (c.length !== 0) {
            this.AccDays = c.DaysAccrued;
            this.AccInt = c.AccruedInterest;
            this.AccVal = this.FormatNumberFromValue(c.AccruedInterest);
            this.BankPNL = c.BankPnL;
            this.CurrentYield = c.CurrentYield;
            this.CleanPrice = c.MarketCleanPrice;
            this.DirtyPrice = c.CustDirtyPrice;
            this.YTM = c.YTM;
            this.YTC = c.YTC;
            this.YTP = c.YTP;
            this.YTConv = c.YTConv;
            this.SettAmt = c.CustCost;
            this.settval = this.FormatNumberFromValue(c.CustCost);
            this.Proceeds = c.CustCost;
            this.CustDirtyPrice = c.CustDirtyPrice;
            this.CustCleanPrice = c.CustCleanPrice;
            this.MarketCleanPrice = c.MarketCleanPrice;
            this.MarketDirtyPrice = c.MarketDirtyPrice;
            this.bondMsg = c.ResponseDetails.Description;
            this.ClientPrice = c.CustPrice;
            this.bondRemark = c.ResponseDetails.Remark;
            this.TargetInterbankPrice = c.LimitMarketPrice;
            if (this.bondRemark === 'failed' || this.bondRemark === null) {
              this.successMsg = this.bondMsg;
              this.loadflag = false;
            }

            // this.CalculateSettAmt();
            this.CalculateTotalProceeds();
          }
        });
      this.bondlist = this.workflowApi.bondlistObserver.subscribe((b) => {
        if (b) {
          if (b) {
            this.showSuggestions = true;
            this.bondsList = b
              .filter((item) =>
                item.Product_Name.toLowerCase().includes(
                  this.search.toLowerCase()
                )
              )
              .map(
                (item) =>
                (item = {
                  ISIN: item.ISIN,
                  Note_Master_id: item.Note_Master_id,
                  ProductName1: (item.Product_Name + '').trim().toLowerCase(),
                  Product_Name: (item.Product_Name + '').trim(),
                })
              );
            // .sortBy('ProductName1');
            if (this.reqParam !== undefined && this.reqParam !== '') {
              this.workflowApi.getbonddetails(
                that.reqParam,
                this.authorApi.EntityID,
                this.LoginID
              );

              this.NoteMasterId = this.reqParam;
              this.reqParam = '';
            }
          }
        }
      });

      //Changes on 07 Feb 2022 by Ashwini H. for Product Catalogue
      this.SetFlagtoCustomerBS = this.com.SetFlagtoCustomerObserver.subscribe(
        (res) => {
          if (res) {
            console.log('check', this.productCatCheck);
            this.productCatCheck = res;

            console.log('check', this.productCatCheck);
          }
        }
      );

      this.selectedDirBS = this.com.selectedDirObserver.subscribe((res) => {
        if (res.length !== 0) {
          if (res.toUpperCase() === 'BUY') {
            this.side = 'Buy';
          } else if (res.toUpperCase() === 'SELL') {
            this.side = 'Sell';
          }
        }
      });
      this.workflowApi.Resetgetbonddetails();
      this.bondDetails = this.workflowApi.bondDetailsObserver.subscribe(
        (b: any) => {
          if (b) {
            try {
              this.msg = '';
              // b.Note_Master_id = this.NoteMasterId;
              // console.log(b);
              this.details = b;
              this.selectedBond = b;

              //Changes by Ashwini H. for RM and Client login on 07 Feb 2022
              if (this.isUserRM) {
                if (
                  !['', null, undefined].includes(this.selectedCustomerName)
                ) {
                  this.CustomerID = this.selectedCustomerName.split('|')[1];
                }
              } else {
                this.CustomerID = this.CustomerID;
              }
              //End

              this.workflowApi
                .GetPortfoliosFromCusID(
                  this.CustomerID,
                  this.selectedBond.Currency
                )
                .subscribe((res) => {
                  if (res) {
                    this.portfolioList = [];
                    this.portfolioList = res.DB_GetPortfoliosResult;
                    if (this.portfolioList.length > 0) {
                      this.successMsg = '';
                      if (
                        this.portfolio === '' ||
                        this.portfolio === undefined
                      ) {
                        this.portfolio = this.portfolioList[0].FacDesc;
                      }
                    } else {
                      this.successMsg =
                        'Cash account unavailable for the Bond currency';
                    }

                    this.updatePortfolio();
                  }
                });
              if (this.bondsList.length) {
                this.InterbankaskPrice = b.InterbankAskPrice;
                this.InterbankbidPrice = b.InterbankBidPrice;
                this.showBondDetails = true;
                this.YTM = null;
                this.YTConv = null;
                this.search = '';
                // this.bondsList = [];
                // this.bondsList.length = 0;

                // this.PortfolioChange();

                this.PRR = parseInt(b.PRR, 10);
                // if (this.com.isAlphaNumeric(this.CRR)) {
                //   this.CRR = this.CRR.substr(1, this.CRR.length);
                // }
                // if (parseFloat(this.CRR) < this.PRR) {
                //   this.msg = 'Customer Rating is less than product rating ! Please check.';

                // } else {
                //   this.msg = '';
                // }
                this.settlementType = b.SettlementType.split('+')[1];
                this.QuantityType = b.PercentParQuoted === 'N' ? 1 : 0;
                this.settlementDate = b.SettlementDate;
                // console.log(this.settlementDate);
                // if (!this.isUserRM) { this.PortfolioChange(); }
                // else {
                //   // this.getPortfolioFromBond();
                // }
              }
            } catch (e) { }
          }
        }
      );

      this.cfs.getCustAccountDetails.subscribe((res) => {
        if (res.length !== 0) {
          // this.CustomerID = res.CustomerID;
          // this.CustomerName = res.misc1;
          this.RMName = res.RM;

          //Changes on 07 Feb 2022 by Ashwini H for RM login
          if (this.isUserRM) {
            this.RMName = this.LoginID;
          }

          console.log('RM NAme', this.RMName);

          // this.portfolio = res.portfolio;
          // this.workflowApi.GetsuitabilityCheckData(
          //   this.CustomerName,
          //   this.CustomerID,
          //   this.username
          // );
        }
      });

      // if (!this.isUserRM) {
      //   this.workflowApi.getmultiPortfolio(this.username);
      // }

      // this.multiportfoliodata = this.workflowApi.multiportfolioObserver.subscribe(
      //   (res) => {
      //     if (res.length !== 0) {
      //       // if (Object.keys(res).length === 0 && res.constructor === Object) {
      //       // }
      //       if (res.status === false) {
      //         this.successMsg = 'Account details not available';
      //       } else if (res.status) {
      //         // console.log(res);
      //         // res.forEach(element => {
      //           // res = res.message ;
      //         const result = [];
      //         const map = new Map();
      //         for (const item of res.message) {
      //           if (!map.has(item.portfolio)) {
      //             map.set(item.portfolio, true); // set any value to Map
      //             result.push({
      //               portfolio: item.portfolio,
      //               ccy: item.Accountcurrency,
      //             });
      //           }
      //         }

      //         this.portfolioList = [];
      //         result.forEach((element) => {
      //           this.portfolioList.push(element.portfolio);
      //         });
      //         // console.log(this.portfolioList);
      //         // });
      //         this.portfolioAccount = [];
      //         res.message.forEach((element) => {
      //           this.portfolioAccount.push([
      //             element.portfolio,
      //             element.accountnumber,
      //             element.Accountcurrency,
      //             element.AvailableBalance
      //           ]);
      //         });
      //         this.CustomerID = res.message[0].CustomerID;
      //         this.CustomerName = res.message[0].misc1;
      //         this.RMName = res.message[0].RM;
      //         // this.CustomerName = res[0].misc1;
      //         // this.CustomerID = res[0].CustomerID;
      //         this.portfolio = this.portfolioList[0];
      //         this.Account_Number = this.portfolioAccount[0][1];
      //         this.currency = this.portfolioAccount[0][2];
      //         // console.log(this.portfolioAccount);
      //         this.workflowApi.GetsuitabilityCheckData(
      //           this.CustomerName,
      //           this.CustomerID,
      //           this.username
      //         );
      //         if (!this.isUserRM) { this.PortfolioChange(); }
      //         else {
      //           // this.getPortfolioFromBond();
      //           this.updateCustomerPortfolioDetails();

      //         }
      //       }

      //     }
      //   }
      // );

      this.bondsubscribe = this.workflowApi.bondsubscribeObserver.subscribe(
        (OID: any) => {
          this.successMsg = '';

          if (OID.length !== 0) {
            if (OID.ClOrdID === '') {
              this.successMsg = '';
              this.successMsg =
                'Order Execution : ' +
                OID.OrdStatus +
                ' ' +
                OID.OrdResponseDetails.Description;
            } else {
              this.OrderID = OID.ClOrdID;
              this.successMsg =
                'Order placed succesfully with Ref Id.' + this.OrderID;
              let orderDetail = {
                custID: this.CustomerID,
                currency: this.selectedBond.Currency,
                custName: this.CustomerName,
                NoteMasterId: this.NMID_Suitability,
                portfolio: this.portfolio,
                orderID: this.OrderID,
                settlementAmount: this.nominal,
                failrules: this.token,
              };
              if (this.checkSuitability && this.token !== '') {
                this.workflowApi
                  .getSuitabilityToken(orderDetail)
                  .then((token) => {
                    console.log(token, 'token', orderDetail, 'orderDetail');
                  });
              }
            }
            this.loadflag = false;
          }
        },
        (error) => console.log('Error :: ' + error)
      );
    } catch (error) {
      // console.log('Error:', error);
    }

    // this.workflowApi.suitabilityCheck.subscribe((res) => {
    //   try {
    //     if (res.length !== 0) {
    //       const arr = res.CustomerSuitabilityResponse.Eligibility[0]['a:Eligibility'];

    //       this.suitabilityStatus = res.CustomerSuitabilityResponse.Status[0];
    //       this.finalSuitabilityData = [];
    // eslint-disable-next-line
    //       for (let i = 0; i < arr.length; i++) {
    //         this.suitabilityCheckData.Parameter = arr[i]['a:Parameters'];
    //         this.suitabilityCheckData.CIF = arr[i]['a:CIFA'];
    //         this.suitabilityCheckData.EligibleYN = arr[i]['a:Eligible_YN'];
    //         this.suitabilityCheckData.Reason = arr[i]['a:Failed_Reason'];
    //         this.suitabilityCheckData.Ref = arr[i]['a:ColumnName'];
    //         // console.log(arr[i]['a:AC_Overrided_YN'][0].toUpperCase());
    //         if (arr[i]['a:AC_Overrided_YN'][0].toUpperCase() === 'Y') {
    //           this.suitabilityCheckData.Override = false;
    //         } else {
    //           this.suitabilityCheckData.Override = true;
    //         }

    //         this.finalSuitabilityData.push(this.suitabilityCheckData);
    //         this.suitabilityCheckData = {
    //           Parameter: '',
    //           CIF: '',
    //           EligibleYN: '',
    //           Reason: '',
    //           Ref: '',
    //           Override: false,
    //         };
    //       }
    //       // console.log(this.finalSuitabilityData);
    //     }
    //   } catch (ex) {
    //     console.log('Bonds.ts (Error occured in Suitability check: ', ex);
    //   }

    // });

    this.bondInfoBS = this.com.bondInfoObserver.subscribe((res) => {
      if (res.length !== 0 && res !== undefined) {
        if (res.action !== '' && res.data !== []) {
          this.successMsg = '';
          // this.isEditable = false;
          this.isEditable = true; // Changed by Ketan S on 28-Mar-2022 asked by Gaurav Jain Issue 4 in sheet NextGenApp gateway markets
          this.details.ProductName = res.data.Product_Name;
          this.details.Issuer = res.data.Issuer;
          this.details.Currency = res.data.Currency;
          this.details.ISIN = res.data.ISIN;
          this.side = res.data.BS_Direction;
          this.OrderType = res.data.Order_Type.split(' ')[0];
          this.nominal = res.data.Nominal_Amount;
          this.ClientPrice = 'res';
          this.SettAmt = 'res';
          this.settval = 'res';
          this.AccInt = 'res';
          this.AccVal = 'res';
          this.YTM = 'res';
          this.YTConv = 'res';
          this.selectedBond.Currency = res.data.Currency;
          this.settlementDate = this.formatDate(res.data.Settlement_Date);
          this.TimeInForce = res.data.TSOX_Time_in_Force;
          this.expiryDate = this.formatDate(res.data.Order_Expiry_Date);
          this.tradeDate = this.expiryDate;
          this.InterbankbidPrice = res.data.NORM_Market_Price;
          this.InterbankaskPrice = res.data.NORM_Market_Price;
          this.selectedBond.InterbankAskPrice = res.data.NORM_Market_Price;
          this.selectedBond.InterbankBidPrice = res.data.NORM_Market_Price;
          this.selectedBond.NoteMasterID = res.data.TI_Linked_Trade_ID;
          this.CustomerName = res.data.Customer_Name;
          this.btnname = res.action;
          this.clorId = res.data.Qm_DealNo;

          this.CIF = res.data.CIF_Order;
          // this.portfolio = res.
          // this.workflowApi.getmultiPortfolio(this.username);
          // this.PortfolioChange();
          console.log('this.selectedBond', res);

          // this.details.
        }
      } else {
        this.isEditable = true;
      }
    });

    this.bondsAmendBS = this.workflowApi.bondsAmendObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.loadflag = false;
        this.successMsg =
          res.Ord_Amend_Res_DTO.objResponseDetails.OrdResponseDetails.Remark;
      }
    });

    this.bondsCancelBS = this.workflowApi.bondsCancelObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          this.loadflag = false;
          this.successMsg =
            res.Ord_Cancel_Res_DTO.OrdCancelResDetails.OrdResponseDetails.Remark;
        }
      }
    );

    this.selectedPortfolioBS = this.com.selectedPortfolioObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          this.portfolio = res;
        }
      }
    );

    this.selectedPortfolioBalBS =
      this.com.selectedPortfolioBalObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.remainingBalance = res;
        }
      });

    this.portfolioSecHoldingBS =
      this.workflowApi.portfolioSecHoldingObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.noBalFlag = true;
          this.portfolioDetails = res;
          this.portfolioDetails.forEach((e) => {
            e.CEHD_Pending_receive_Qty[0] = parseFloat(
              e.CEHD_Pending_receive_Qty[0]
            );
            e.CEHD_Pending_pay_Qty[0] = parseFloat(e.CEHD_Pending_pay_Qty[0]);
            e.CEHD_Available_Qty[0] = parseFloat(e.CEHD_Available_Qty[0]);
            e.CEHD_BUY_Settled_Avg_Price[0] = this.com.FormatNumberr(
              parseFloat(e.CEHD_BUY_Settled_Avg_Price[0])
            );
            e.CEHD_PledgedOut_Qty[0] = parseFloat(e.CEHD_PledgedOut_Qty[0]);
          });
          // console.log('Portfolio details', this.portfolioDetails);
          this.remainingBalance = '0';
          this.portfolioDetails.forEach((elem) => {
            if (elem.ISIN[0].includes(this.ISIN)) {
              this.remainingBalance =
                elem.CEHD_Available_Qty[0] +
                elem.CEHD_Pending_receive_Qty[0] +
                elem.CEHD_PledgedOut_Qty[0] -
                elem.CEHD_Pending_pay_Qty[0];
              if (
                parseFloat(this.nominal) > parseFloat(this.remainingBalance)
              ) {
                this.remainingBalFlag = false;
                return;
              } else {
                this.remainingBalFlag = true;
              }
            }
          });
          // this.ref.detectChanges();
        } else {
          this.noBalFlag = false;
        }
        this.workflowApi.getBusinessDate().then((date) => {
          // console.log(date, 'date');
          this.businessDate = date.businessDate;
        });
      });
    // }

    //Added by AlolikaG on 4th Feb 2022 --START. // Funding type changes. Do not remove
    // this.cfs.getPledgedAgainstData('UTFundMode').subscribe((res) => {
    //   if (res) {
    //     this.FundingModeData = [];
    //     this.FundingModeData = res.Get_Configurable_Common_DataResult;
    //     this.FundingModeChange(this.FundMode);
    //     console.log('this.FundingModeData', this.FundingModeData);
    //   }
    // });
    // this.cfs.getPledgedAgainstData('LombardLoanTenor').subscribe((res) => {
    //   if (res) {
    //     this.TenorData = [];
    //     this.TenorData = res.Get_Configurable_Common_DataResult;
    //     // this.FundingModeChange(this.FundMode);
    //     console.log('this.TenorData', this.TenorData);
    //   }
    // });
    //Added by AlolikaG on 4th Feb 2022 --END.
  }

  //Added by AlolikaG on 4th Feb 2022 --START. // Funding type changes. Do not remove
  // FundingModeChange(Event) {
  //   // this.successMsg = '';
  //   this.FundMode = Event;
  //   this.FundingModeData.forEach((element) => {
  //     if (element.DATA_VALUE === this.FundMode) {
  //       this.FundVal = element.Misc1;
  //     }
  //   });
  //   if (this.FundVal === 'TL') {
  //     this.getAvailableDrawdown();
  //     this.LoanAmt = this.com.FormatNumberr(this.nominal);
  //   } else if (this.FundVal === 'PL') {
  //     // this.LoanAmt = this.cfs.FormatNumberr(this.notional);

  //     this.getAvailableDrawdown();
  //     this.LoanAmt = '0.00';
  //   }
  //   // console.log('this.data ', this.data);
  // }

  // getAvailableDrawdown() {
  //   try {
  //     this.workflowApi
  //       .getMFDrawdown(
  //         this.CustomerID,
  //         this.nominal,
  //         this.selectedBond.InterbankBidPrice,
  //         this.selectedBond.LTV,
  //         ''
  //       )
  //       .subscribe((res) => {
  //         if (res) {
  //           this.Drawdown = res.ExecGenericTableValuedFunctionResult[0].Param1;
  //           this.Drawdown = this.com.FormatNumberr(this.Drawdown);
  //         }
  //       });
  //   } catch (error) { }
  // }

  // enterNotional(nominal) {
  //   if (this.FundVal === 'TL') {
  //     this.LoanAmt = this.com.FormatNumberr(nominal);
  //     this.getAvailableDrawdown();
  //   } else if (this.FundVal === 'PL') {
  //     this.LoanAmt = 0;
  //     // this.LoanAmt = this.cfs.FormatNumberr(this.notional);
  //     this.getAvailableDrawdown();
  //   }
  // }
  //Added by AlolikaG on 4th Feb 2022 --END.

  delaySmartSearch(_e) {
    try {
      this.bondsList = [];
      this.ResetAllFields();
      if (this.search.length > 1) {
        this.searchBonds();
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  updatePortfolio() {
    // if (this.isUserRM) {
    //   this.updateCustomerPortfolioDetails();
    // } else {
    //   // this.ChangeSelectedportfolio();
    // }
    this.workflowApi
      .getAccountNumberFromPortfolioGeneric(
        this.CustomerID,
        this.portfolio,
        this.selectedBond.Currency
      )
      .subscribe((res) => {
        if (res) {
          this.accountList = [];
          this.accountList = res.ExecGenericTableValuedFunctionResult;
          this.Account_Number = this.accountList[0].Param1;
          this.cashBalance();
        }
      });
  }

  // getPortfolioFromBond() {
  //   this.portfolioList = [];
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   const temp: any = this.selectedCustomerDetails.filter((obj) => {
  //     return obj.SICurrency === this.details.Currency;
  //   });

  //   if (temp.length) {
  //     temp.forEach((element) => {
  //       this.portfolioList.push(element.PortfolioName);
  //       this.accountList.push(element.AccountNo);
  //       this.CurrencyList.push(this.details.Currency);
  //     });
  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];

  //     // this.portfolio = temp[0].PortfolioName
  //   } else {
  //     this.successMsg =
  //       'Portfolio with selected bond currency is not available. Please select different bond';
  //     this.showSubmit = false;
  //   }
  // }

  // updateCustomerPortfolioDetails() {
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   console.log('Update ccy: ', this.currency);
  //   const temp: any = this.selectedCustomerDetails.filter((obj) => {
  //     return obj.PortfolioName === this.portfolio;
  //   });
  //   temp.forEach((element) => {
  //     this.accountList.push(element.AccountNo);
  //     this.CurrencyList.push(element.SICurrency);
  //   });
  //   this.Account_Number = this.accountList[0];
  //   // this.currency = this.data.Ccy = this.CurrencyList[0];
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
  //     if (this.details.Currency === element.SICurrency) {
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
  //       'Portfolio with selected bond currency is not available. Please select different bond';
  //   }
  // }

  updateCcy() {
    // console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.AccountNo === this.Account_Number;
    });
    if (temp.length) {
      temp.forEach((element) => {
        if (this.details.Currency === element.SICurrency) {
          this.currency = element.SICurrency;
        }
      });
      // this.currency = this.details.Currency = temp[0].SICurrency;
    }
  }

  // getCustomerDetails(res) {
  //   if (res.length > 0) {
  //     this.portfolioList = [];
  //     this.selectedCustomerDetails = res;
  //     const map = new Map();
  //     for (const item of res) {
  //       // if (!map.has(item.PortfolioName)) {
  //       map.set(item.PortfolioName, true); // set any value to Map
  //       if (item.SICurrency === this.selectedBond.Currency) {

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

  selectedCustomerValue1(e) {
    // console.log(e);
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;

    this.enablePortfolio = true;
    this.cfs.fngetCustAccountDetails(e.CustomerName.split('|')[0]);
    this.workflowApi
      .GetPortfoliosFromCusID(this.CustomerID, this.selectedBond.Currency)
      .subscribe((res) => {
        if (res) {
          this.portfolioList = [];
          this.portfolioList = res.DB_GetPortfoliosResult;
          if (this.portfolioList.length > 0) {
            this.successMsg = '';
            this.portfolio = this.portfolioList[0].FacDesc;
          } else {
            this.successMsg = 'Cash account unavailable for the Bond currency';
          }
          this.updatePortfolio();
        }
      });
    // this.workflowApi.getmultiPortfolio(this.CustomerName.split('|')[0]);
  }

  searchBonds() {
    try {
      if (this.search.trim()) {
        this.workflowApi.getbondslist(
          this.LoginID,
          this.search,
          this.authorApi.EntityID
        );
      } else {
        this.bondsList = [];
        this.bondsList.length = 0;
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  ChangeIndex(_e) {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) { }
  }

  selectbondOnClick(bond) {
    try {
      this.msg = '';
      this.subscribed();
      this.selectedBIndex = 0;
      this.showSuggestions = false;

      this.workflowApi.getbonddetails(
        bond,
        this.authorApi.EntityID,
        this.LoginID
      );
      this.NoteMasterId = bond;

      this.workflowApi
        .GetPortfoliosFromCusID(this.CustomerID, this.selectedBond.Currency)
        .subscribe((res) => {
          if (res) {
            this.portfolioList = [];
            this.portfolioList = res.DB_GetPortfoliosResult;
            if (this.portfolioList.length > 0) {
              this.successMsg = '';
              this.portfolio = this.portfolioList[0].FacDesc;
            } else {
              this.successMsg =
                'Cash account unavailable for the Bond currency';
            }

            this.updatePortfolio();
          }
        });
      // if (!this.isUserRM) this.PortfolioChange();
      // else {
      //     this.getPortfolioFromBond();
      // }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  selectbondOnEnter(_e) {
    try {
      const BONDInfo = $('.HoverSuggestion').data('bonddata');
      this.selectbondOnClick(BONDInfo);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  subscribed() {
    try {
      this.selectedBond = this.details;
      this.InputChanged();
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  onClickedOutside(_e: Event) {
    try {
      this.showSuggestions = false;
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  InputChanged() {
    try {
      if (this.selectedBond) {
        this.settlementDate = this.selectedBond.SettlementDate;
        this.CalculateDates();
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  load() {
    try {
      this.loadflag = true;
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  changeTimeinForce(value) {
    try {
      if (value === 'GTF') {

        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const fifth = first + 4;

        const friday = new Date(today.setDate(fifth));
        console.log('friday', friday);
        this.expiryDate = this.datepipe.transform(friday, "dd-MMM-yyyy");
        console.log("this.expirydate", this.expiryDate);


      } else if (value === 'DAY') {
        this.expiryDate = this.tradeDate;
      } else if (value === 'GTD') {
        
      }
    } catch (error) {

    }
  }

  Calculate() {
    try {
      this.note_Master_Id = '';
      console.log('bonds', this.selectedBond);
      if (!this.side) {
        this.successMsg = 'Please select Customer B/S.';
        this.loadflag = false;
      } else if (!this.nominal) {
        this.successMsg = 'Please enter Notional amount.';
        this.loadflag = false;
      } else if (this.nominal <= 0.0) {
        this.successMsg = 'Notional amount should be greater than 0.';
        this.loadflag = false;
      } else if (!this.spread) {
        this.successMsg = 'Please enter Spread.';
        this.loadflag = false;
      } else if (!this.CustomerName) {
        this.successMsg = 'Please select Customer.';
        this.loadflag = false;
      }
      if (this.side && this.nominal > 0 && this.spread && this.CustomerName) {
        this.successMsg = '';

        // this.CalculateClientPrice();

        // console.log(this.selectedBond.NoteMasterID, this.nominal, this.side, this.settlementDate, this.spread, this.OrderType);
        this.workflowApi.getbondCalculations(
          sessionStorage.getItem('Username'),
          this.selectedBond.NoteMasterID,
          this.nominal,
          this.side,
          this.settlementDate,
          this.spread,
          this.OrderType,
          this.authorApi.EntityID,
          this.ClientPrice,
          this.selectedBond.ISIN
        );
        this.loadflag = false;
        this.placeorderFlag = true;
        if (this.side === 'Buy') {
          // this.cashBalance();
        } else {
          this.sellBalance();
        }
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  selectDate(date) {
    try {
      this.expiryDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }

  CalculateClientPrice() {
    try {
      if (this.nominal) {
        this.ClientPrice = parseFloat(
          this.side === 'Buy'
            ? (
              parseFloat(this.selectedBond.InterbankAskPrice) +
              parseFloat(this.spread) / 100
            ).toFixed(4)
            : (
              parseFloat(this.selectedBond.InterbankBidPrice) -
              parseFloat(this.spread) / 100
            ).toFixed(4)
        );
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateAccDays() {
    try {
      this.AccDays = this.GetDateDiff(
        this.settlementDate,
        this.selectedBond.LastCouponDate
      );
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateAccInt() {
    try {
      let CouponFrequency = 2;
      switch ((this.selectedBond.CouponFrequency + '').toLocaleLowerCase()) {
        case 'semiannual':
          CouponFrequency = 2;
          break;
        case 'annual':
          CouponFrequency = 1;
          break;
        default:
          CouponFrequency = 2;
          break;
      }

      const DaysInCouponPeriod = this.GetDateDiff(
        this.selectedBond.LastCouponDate,
        this.selectedBond.NextCouponDate
      );

      this.AccInt = parseFloat(
        (
          (parseFloat(this.selectedBond.Coupon) / CouponFrequency) *
          (this.AccDays / DaysInCouponPeriod)
        ).toFixed(4)
      );
      this.AccVal = this.FormatNumberFromValue(
        parseFloat(
          (
            (parseFloat(this.selectedBond.Coupon) / CouponFrequency) *
            (this.AccDays / DaysInCouponPeriod)
          ).toFixed(4)
        )
      );
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateClientDirtyPrice() {
    try {
      this.DirtyPrice = (this.ClientPrice + this.AccInt) / 100;
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateSettAmt() {
    try {
      this.SettAmt = parseFloat(
        ((this.DirtyPrice * this.nominal) / 100).toFixed(4)
      );
      this.settval = this.FormatNumberFromValue(this.SettAmt);
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateBankPNL() {
    try {
      this.BankPNL = parseFloat(
        ((this.spread / 100 / 100) * this.nominal).toFixed(4)
      );
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateTotalProceeds() {
    try {
      this.Proceeds = this.SettAmt;
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  CalculateDates() {
    try {
      const d = new Date();
      this.tradeDate =
        (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
        '-' +
        this.months[d.getMonth()] +
        '-' +
        d.getFullYear();
      // d.setDate(d.getDate() + 14);
      if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
      } else if (d.getDay() === 6) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        d.setDate(d.getDate() + 2);
      }

      if(this.TimeInForce === 'DAY') {
        this.expiryDate = this.tradeDate;
      }
      //Expiry date changes done for ANAPPDEVIN-154. As per discussion with Mohan P and Khushboo R | 28-06-2022
      // this.expiryDate =
      //   (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
      //   '-' +
      //   this.months[d.getMonth()] +
      //   '-' +
      //   d.getFullYear() +
      //   ' ' +
      //   d.getHours() +
      //   ':' +
      //   d.getMinutes() +
      //   ':' +
      //   d.getSeconds();
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetSettlementDate() {
    try {
      const d = new Date(this.tradeDate);
      d.setDate(d.getDate() + parseInt(this.settlementType, 10));
      if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
      } else if (d.getDay() === 6) {
        d.setDate(d.getDate() + 2);
      }

      this.settlementDate =
        (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
        '-' +
        this.months[d.getMonth()] +
        '-' +
        d.getFullYear();
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  formatDate(date) {
    const d = new Date(date);
    return (
      (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
      '-' +
      this.months[d.getMonth()] +
      '-' +
      d.getFullYear()
    );
  }

  // cashBalance(currency, nominal) {
  //   try {
  //     this.CashBalance = '';
  //     this.homeApi.GetCustPortfolioCashHoldings(this.CustomerID).subscribe((res: any) => {
  //       if (res.length !== 0) {
  //         this.noBalFlag = true;
  //         for (let i = 0; i < res.length; i++) {
  //           // this.cashccy[i] = res[i].Currency;
  //           // this.cashbalance[i] = res[i].Cashbalance;
  //           if (currency === res[i].Currency) {
  //             if (parseFloat(nominal) <= parseFloat(res[i].Cashbalance)) {
  //               this.balanceFlag = true;
  //               this.CashBalance = res[i].Cashbalance;
  //               return;
  //             }
  //             else {
  //               this.balanceFlag = false;
  //               this.CashBalance = res[i].Cashbalance;
  //             }
  //           } else {
  //             this.balanceFlag = false;
  //             this.CashBalance = res[i].Cashbalance;
  //           }
  //         }

  //       } else {
  //         // this.successMsg = 'Insufficient funds. Please transfer funds to account:' + this.Account_Number;
  //         this.loadflag = false;
  //         this.noBalFlag = false;
  //       }
  //     });
  //   } catch (ex) {
  //     console.log('Error occured while loading Cash balance card :', ex);
  //   }
  // }

  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.CashBalance = '';
      // this.portfolioAccount.forEach((element, i) => {
      //   if (this.portfolio === this.portfolioAccount[i][0].toString() && this.Account_Number === this.portfolioAccount[i][1].toString() && currency === this.portfolioAccount[i][2].toString()) {
      //     if (parseFloat(nominal) <= this.portfolioAccount[i][3]) {
      //       this.balanceFlag = true;
      //       this.CashBalance = this.portfolioAccount[i][3];
      //       return;
      //     } else {
      //       this.balanceFlag = false;
      //       this.CashBalance = this.portfolioAccount[i][3];
      //     }
      //   }
      // });
      this.workflowApi
        .getCashbalanceFromAccountNumber(
          this.selectedBond.Currency,
          this.Account_Number
        )
        .subscribe((res) => {
          if (res) {
            if (
              parseFloat(this.nominal) <=
              parseFloat(res.ExecGenericScalarFunctionResult)
            ) {
              this.balanceFlag = true;
              this.CashBalance = this.com.FormatNumberr(res.ExecGenericScalarFunctionResult);
              return;
            } else {
              this.balanceFlag = false;
              this.CashBalance = this.com.FormatNumberr(res.ExecGenericScalarFunctionResult);
            }

          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  sellBalance() {
    this.workflowApi.getCustPortfolioSecurityHoldings(
      this.CustomerID,
      this.portfolio,
      this.baseCCY
    );
  }

  async Subscribe() {
    this.successMsg = '';
    try {
      // this.cashBalance();
      //Added by Alolika G on 7th Feb 2022
      this.orderDetails = [];
      this.orderDetails = {
        custID: this.CustomerID,
        CRR: this.selectedBond.PRR,
        commissionValue: this.commissionValue,
        commissionPercentage: this.commissionPercentage,
        commissionReason: this.commissionReason,
        currency: this.selectedBond.Currency,
        custName: this.CustomerName,
        orderType: this.OrderType,
        direction: this.side,
        fundingMode: this.FundMode,
        settlementAmount: this.nominal,
        productCode: this.ISIN,
        productref: this.bondNMID,
      };
      if (this.Account_Number === '') {
        this.successMsg = 'Please select account number.';
        this.loadflag = false;
      } else if (!this.side) {
        this.successMsg = 'Please select Customer B/S.';
        this.loadflag = false;
      } else if (!this.nominal) {
        this.successMsg = 'Please enter Notional amount.';
        this.loadflag = false;
      } else if (this.nominal <= 0.0) {
        this.successMsg = 'Notional amount should be greater than 0.';
        this.loadflag = false;
      } else if (!this.spread) {
        this.successMsg = 'Please enter Spread.';
        this.loadflag = false;
      } else if ([null, undefined].includes(this.RMName)) {
        this.successMsg = `No RM mapped for ${this.username}.`;
        this.loadflag = false;
      } else if (this.side === 'Buy' && !this.balanceFlag) {
        // if (!this.noBalFlag) {
        //   this.successMsg = 'Insufficient funds. Please transfer funds to Account No.: ' + this.Account_Number;
        //   this.loadflag = false;
        // } else {
        //   this.successMsg = 'Notional amount should be less than Cash Balance. Cash Balance is : ' + this.com.FormatNumberr(parseFloat(this.CashBalance));
        //   this.loadflag = false;
        // }
        this.successMsg =
          'Insufficient cash balance in this account' +
          '(Account Number: ' +
          this.Account_Number +
          ')';
        this.loadflag = false;
      } else if (this.side === 'Sell' && !this.noBalFlag) {
        this.successMsg =
          'Notional amount should be less than balance notional. Balance is:  0.00';
        this.loadflag = false;
      } else if (this.side === 'Sell' && this.nominal > this.remainingBalance) {
        this.successMsg =
          'Notional amount should be less than balance notional. Balance is: ' +
          this.com.FormatNumberr(parseFloat(this.remainingBalance));
        this.loadflag = false;
      } else if (this.ClientPrice > 0 && this.successMsg === '') {
        if (this.btnname === 'Subscribe') {
          if (this.checkSuitability) {
            //Added by Alolika G on 7th Feb 2022
            const isSuitabilityValid: boolean =
              await this.checkOrderSuitability(this.orderDetails);
            console.log(isSuitabilityValid);
            this.workflowApi.getbondsubscribe(
              this.selectedBond.ISIN,
              this.selectedBond.Currency,
              this.side,
              this.nominal,
              this.settlementDate,
              '' + this.spread,
              this.AccInt,
              this.SettAmt,
              this.tradeDate,
              // this.businessDate,
              this.settlementType,
              this.expiryDate,
              this.selectedBond.PriceType,
              // parseInt(this.selectedBond.FaceValue, 10) * 0.098 + '',
              this.ClientPrice,
              this.DirtyPrice,
              this.CleanPrice,
              this.YTM,
              this.Proceeds,
              this.BankPNL,
              this.portfolio,
              this.OrderType.toLowerCase() === 'market' ? '' : this.TimeInForce,
              this.OrderType,
              this.selectedBond.NoteMasterID,
              this.CustDirtyPrice,
              this.CustCleanPrice,
              this.MarketCleanPrice,
              this.MarketDirtyPrice,
              this.YTC,
              this.YTP,
              this.YTConv,
              this.username,
              this.CustomerName,
              this.Account_Number,
              this.authorApi.EntityID,
              this.QuantityType,
              this.isUserRM ? this.LoginID : this.RMName
            );
          } else {
            this.workflowApi.getbondsubscribe(
              this.selectedBond.ISIN,
              this.selectedBond.Currency,
              this.side,
              this.nominal,
              this.settlementDate,
              '' + this.spread,
              this.AccInt,
              this.SettAmt,
              this.tradeDate,
              // this.businessDate,
              this.settlementType,
              this.expiryDate,
              this.selectedBond.PriceType,
              // parseInt(this.selectedBond.FaceValue, 10) * 0.098 + '',
              this.ClientPrice,
              this.DirtyPrice,
              this.CleanPrice,
              this.YTM,
              this.Proceeds,
              this.BankPNL,
              this.portfolio,
              this.OrderType.toLowerCase() === 'market' ? '' : this.TimeInForce,
              this.OrderType,
              this.selectedBond.NoteMasterID,
              this.CustDirtyPrice,
              this.CustCleanPrice,
              this.MarketCleanPrice,
              this.MarketDirtyPrice,
              this.YTC,
              this.YTP,
              this.YTConv,
              this.username,
              this.CustomerName,
              this.Account_Number,
              this.authorApi.EntityID,
              this.QuantityType,
              this.isUserRM ? this.LoginID : this.RMName
            );
          }
        } else if (this.btnname === 'Amend') {
          this.workflowApi.AmendBondOrder(
            this.username,
            this.clorId,
            this.nominal,
            this.OrderType,
            '',
            this.TimeInForce,
            this.expiryDate,
            this.spread,
            'Y',
            'N',
            100,
            this.Remark,
            this.CIF,
            this.portfolio,
            this.portfolioAccount[0][1]
          );
        } else if (this.btnname === 'Cancel Order') {
          this.workflowApi.CancelBondOrder(
            this.username,
            this.clorId,
            this.Remark
          );
        }
      } else {
        this.successMsg = 'Please calculate the client price.';
        this.loadflag = false;
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetDateDiff(date1: Date, date2: Date) {
    try {
      const Date1 = new Date(date1);
      const Date2 = new Date(date2);

      const timediff = Math.abs(Date2.getTime() - Date1.getTime());

      return Math.ceil(timediff / (1000 * 3600 * 24));
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  ChangeDateFormat(date: string) {
    try {
      if (date.includes('/')) {
        const dateSplit = date.split('/');
        return parseInt(dateSplit[1], 10) < 10
          ? '0' + dateSplit[1]
          : dateSplit[1] +
          '-' +
          (parseInt(dateSplit[0], 10) < 10
            ? this.months[parseInt(dateSplit[0], 10) - 1]
            : dateSplit[0]) +
          '-' +
          dateSplit[2];
      }
      if (date.includes('-')) {
        const dateSplit = date.split('-');
        return (
          dateSplit[0] + '-' + dateSplit[1] + '-' + dateSplit[2].substr(2, 2)
        );
      }
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  ResetAllFields() {
    try {
      // this.nominal = null;
      // this.spread = null;
      this.ClientPrice = '';
      this.AccInt = '';
      this.SettAmt = '';
      this.settval = '';
      this.AccDays = '';
      this.BankPNL = '';
      this.Proceeds = '';
      this.successMsg = '';
      this.OrderID = '';
      this.placeorderFlag = false;
      this.successMsg = '';
      this.YTM = '';
      this.YTConv = '';
      if (this.OrderType.toLowerCase() === 'market') {
        this.TimeInForce = 'DAY';
        this.expiryDate = this.tradeDate;
      }
      //Changes on 08 Feb 2022 by Ashwini H
      this.AccVal = null;
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  ResetCalculatebtn() {
    try {
      this.AccInt = null;
      this.AccVal = null;
      this.SettAmt = null;
      this.settval = null;
      this.AccDays = null;
      this.BankPNL = null;
      this.Proceeds = null;
      this.successMsg = null;
      this.placeorderFlag = false;
      this.note_Master_Id = '';
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  FormatNumberFromValue(value) {
    try {
      if (value) {
        value = parseFloat(value).toFixed(2);

        return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
      } else {
        return '';
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  showdetailsPopUp() {
    if (this.popUpflag === true) {
      this.popUpflag = false;
    } else if (this.finalSuitabilityData.length !== 0) {
      if (this.suitabilityStatus === 'Not Eligible') {
        this.popUpflag = true;
      } else {
        this.popUpflag = false;
        this.subscribed();
      }
    } else {
      this.popUpflag = false;
    }
  }

  // Added by Rohit T. | 03-Feb-2021
  openSuitablityPopup() {
    this.sut_notemaster = this.note_Master_Id;
    console.log(this.note_Master_Id);
    // console.log(this.auth.EntityID)
    if (this.note_Master_Id !== '')
      this.showSuitabilityPopup = !this.showSuitabilityPopup;
    // this.afs.checkSuitability(this.noteMasterId, this.auth.UserName, this.auth.EntityID).subscribe((res) => {
    //   if (res.length !== 0) {
    //     console.log(res)
    //   }
    // });
  }
  closeSuitablityPopup() {
    this.note_Master_Id = '';
    this.showSuitabilityPopup = !this.showSuitabilityPopup;
  }

  //Added by Alolika G on 7th Feb 2022
  async checkOrderSuitability(order) {
    try {
      const res = await this.workflowApi.checkSuitability(order);
      console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      this.NMID_Suitability = res.NMID;
      this.note_Master_Id = this.NMID_Suitability;

      this.token = res.SUITABILITY_TOKEN_COUNT;

      // res.SUITABILITY_TOKEN_COUNT.split('|').forEach((token) => {
      //   if (!!token) {
      //     order.suitabiltyTable.push(token.split(':')[3]);
      //   }
      // });
      // console.log(order.suitabiltyTable);

      // if (!order.isSuitabilityValid) {
      //   order.isLoading = false;
      //   order.message = 'Suitability Check Failed';
      //   order.isValid = false;
      //   order.isError = true;
      //   // order.isSuitabilityValid = false;
      //   return false;
      // }
      // order.isSuitabilityValid = true;
      return true;
    } catch (error) { }
  }

  fnGetCashBalance() {
    return this.CashBalance.replace(/,/g, '');
  }
}
