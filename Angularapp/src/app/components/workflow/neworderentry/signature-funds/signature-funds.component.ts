import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
// import { environment } from '../../../../../environments/environment';
// import * as moment from 'moment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-signature-funds',
  templateUrl: './signature-funds.component.html',
  styleUrls: ['./signature-funds.component.scss']
})
export class SignatureFundsComponent implements OnInit, OnDestroy {
  @Input() displaySearch: boolean;
  @Input() templateCode: any;
  userType: string;
  isUserRM: boolean;
  enablePortfolio: boolean;
  CustomerID: any;
  CustomerName: any;
  isEditable = true;
  orderType: any;
  tradeDate: any;
  moredetails: any;
  portfolio: any;
  currency: any;
  accountList: any[];
  Account_Number: any;
  NotemasterID: any;
  productDetails: any;
  ISIN: any;
  rating: any;
  productName: any;
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
  portfolioList: any;
  successMsg: string;
  portfolioName: any;
  remainingUnits: any;
  portfolioDetails: any;
  noBalFlag: boolean;
  loadflag: boolean;
  showSubmit: boolean;
  baseCCY: string;
  notional: any;
  loginId: any;
  Units: any;
  validation: string;
  SalesChargePCT: string;
  accountType: string;
  FreezeAmount: string;
  SalesCharge: string;
  SettlementAmount: any;
  VATAmount: string;
  ClientContribution: string;
  balanceFlag: boolean;
  remainingBalance: any;
  BuyFunds: boolean;
  BuyFlag: boolean;
  cashbalance: any[];
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

  selectedAssetOBS: Subscription;
  SelectedfundsList: any[] = [];
  InvestmentAmount: any;
  getFundsData: any[];
  constructor(public com: CommonApiService,
    public api: WorkflowApiService,
    public elem: ElementRef,
    public homeapi: HomeApiService,
    public authapi: AuthService,
    private cfs: CustomerApiService,
    private datepipe: DatePipe) {
    this.moredetails = 'More Details';
    this.notional = 0;
  }

  ngOnDestroy(): void {
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';
    this.selectedAssetOBS.unsubscribe();
    this.com.selectedAsset.next([]);
  }

  ngOnInit(): void {
    // this.addRow(); //
    this.tradeDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
    this.orderType = 'Subscription';
    this.loginId = this.authapi.UserName;
    this.userType = this.authapi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }

    if (!this.isUserRM) {
      this.CustomerID = this.homeapi.CustomerId;
      this.CustomerName = this.homeapi.CustomerName;
    } else {

    }

    this.cfs.getBankBaseCCYOBS.subscribe((ccy) => {
      if (ccy !== '') {
        this.baseCCY = ccy;
      }
    });

    try {
      this.selectedAssetOBS = this.com.selectedAssetObserver.subscribe((res) => {
        if (res.length !== 0) {
          // console.log('mF data from the product catalog', res);
          // this.NotemasterID = res;
          this.productName = res.Product_Name;
          this.currency = res.Currency;
          this.ISIN = res.ISIN;
          this.NotemasterID = res.Note_Master_ID;
          this.rating = res.Product_Risk_Profile
          this.getBundledFundDetails();
          this.api
            .GetPortfoliosFromCusID(this.CustomerID, this.currency)
            .subscribe((folio) => {
              if (folio) {
                this.portfolioList = folio.DB_GetPortfoliosResult;
                if (this.portfolioList.length > 0) {
                  this.successMsg = '';
                  this.portfolio = this.portfolioList[0].FacDesc;
                  this.portfolioName = this.portfolioList[0].PortfolioName;
                } else {
                  this.successMsg = 'Cash account unavailable for the Fund currency';
                }

                this.updatePortfolio();
              }
            });
          //

        }
      });
    } catch (error) {

    }

    try {
      this.com.selectedPortfolioObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.portfolio = res;
        }
      });
    } catch (error) {

    }

    try {
      this.com.selectedPortfolioBalObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.remainingUnits = res;
        }
      });
    } catch (error) {

    }

    try {
      this.api.portfolioSecHoldingObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.portfolioDetails = res;
        } else {
          this.loadflag = false;
          this.noBalFlag = false;
        }
      });
    } catch (error) {

    }

    // try {
    //   this.com.selectedDirObserver.subscribe((res) => {
    //     if (res.length !== 0) {
    //       if (res.toUpperCase() === 'BUY') {
    //         this.orderType = 'Buy';
    //       } else if (res.toUpperCase() === 'SELL') {
    //         this.orderType = 'Sell';
    //       }


    //     }
    //   });
    // } catch (error) {

    // }
  }

  getBundledFundDetails() {
    try {
      let paramList = []
      let SPName = "USP_BundleFundDetailsDetails"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@notemaster",
          "Param2": this.NotemasterID
        },
        {
          "Param1": "@EntityID",
          "Param2": this.authapi.EntityID
        },
        {
          "Param1": "@LoginUser",
          "Param2": this.loginId
        },
        {
          "Param1": "@ccy",
          "Param2": this.currency
        })

      this.homeapi.getMFExecGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.getFundsData = [];
          const Fundetails: any = {};
          let tempFundsData = res.ExecGenericStoredProcedureResult[0].GenericResponse;
          // tempFundsData.forEach((element,i) => {
          const allFunds: any[] = tempFundsData.filter(e => e.Key.includes('FundName'))
          const allFundCodes: any[] = tempFundsData.filter(e => e.Key.includes('FundCode'))
          const allContributions: any[] = tempFundsData.filter(e => e.Key.includes('Contribution'))
          Fundetails.ProductName = tempFundsData.filter(e => e.Key === ('ProductName'))[0].Value;
          Fundetails.Notemasterid = tempFundsData.filter(e => e.Key === ('Notemasterid'))[0].Value;
          Fundetails.ISIN = tempFundsData.filter(e => e.Key === ('ISIN'))[0].Value;
          Fundetails.PRR = tempFundsData.filter(e => e.Key === ('PRR'))[0].Value;
          Fundetails.LTV = tempFundsData.filter(e => e.Key === ('LTV'))[0].Value;
          Fundetails.Ccy = tempFundsData.filter(e => e.Key === ('Currency'))[0].Value;
          Fundetails.NoOfUnderlyings = tempFundsData.filter(e => e.Key === ('NoOfUnderlyings'))[0].Value;
          Fundetails.BundledFunds = [];

          allFunds.forEach((f, i) => {
            if (!!f.Value) {
              let fundObj: any = {};
              fundObj.FundName = allFunds[i].Value;
              fundObj.FundCode = allFundCodes[i].Value;
              fundObj.Contribution = allContributions[i].Value;
              fundObj.NAV = (tempFundsData.filter(e => e.Key === ('NAV'))[0].Value).split(',')[i];
              Fundetails.BundledFunds.push(fundObj);
            }
          })

          let FundDetailstemp = Fundetails.BundledFunds;

          FundDetailstemp.forEach((element, _i) => {
            this.SelectedfundsList.push({
              "FundName": element.FundName,
              "ContributionPer": element.Contribution,
              "Nav": element.NAV,
              "FundCurrency": Fundetails.Ccy,
              "FundCode": element.FundCode
            })
          });
          // console.log("this.getFundsData", Fundetails);
          // console.log("this.SelectedfundsList", this.SelectedfundsList);
        }
      })
    } catch (error) {

    }
  }

  // unitCalculations(notional) {
  //   try {
  //     this.Units = notional / this.clientPrice;
  //     this.Units = this.Units.toFixed(2);
  //     this.validation = '';
  //     // this.Units = this.com.FormatNumberr(this.Units);
  //     this.successMsg = '';
  //     // this.Units = this.com.unformatNumber(this.Units);
  //     console.log("Units", this.Units);



  //     // this.cashBalance(this.data.Ccy, nominal);
  //   } catch (error) {
  //     // console.log("Error:", error);
  //   }

  calculateInvestmentAmount() {
    for (var j = 0; j < this.SelectedfundsList.length; j++) {
      if (Number(this.SelectedfundsList[j].ContributionPer) !== 0) {
        this.SelectedfundsList[j].InvestedAmount = this.com.FormatNumberr(
          parseFloat(this.notional.toString()) *
          (parseFloat(this.SelectedfundsList[j].ContributionPer) / 100)
        );
      } else {
        this.SelectedfundsList[j].InvestedAmount = 0.0;
      }
    }
  }

  changeContribution(i) {
    if (Number(this.SelectedfundsList[i].ContributionPer) !== 0) {
      this.SelectedfundsList[i].InvestedAmount = this.com.FormatNumberr(
        parseFloat(this.notional.toString()) *
        (parseFloat(this.SelectedfundsList[i].ContributionPer) / 100)
      );
    } else {
      this.SelectedfundsList[i].InvestedAmount = 0.0;
    }
  }

  addRow() {
    if (this.SelectedfundsList.length < 10) {
      this.SelectedfundsList.push({
        FundName: '',
        ContributionPer: '',
        InvestedAmount: '',
        Nav: '',
        FundCurrency: '',
        showSuggestions: false,
      });
      this.calculateInvestmentAmount();
    }
  }

  removeRow(i) {
    this.SelectedfundsList.splice(i, 1);
  }


  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
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

  saveOrder() {
    try {
      this.loadflag = true
      this.successMsg = '';
      this.SalesChargePCT = '0.00';
      this.accountType = 'CA';
      this.FreezeAmount = '0.00';
      this.SalesCharge = '0.00';
      this.SettlementAmount = this.notional;
      this.VATAmount = '0.00';
      this.ClientContribution = '0.00';
      // this.Units = this.com.UnformatNumber(this.Units);

      if (parseFloat(this.notional) <= parseFloat(this.remainingBalance)) {
        this.balanceFlag = true;
      } else {
        this.balanceFlag = false;
      }

      if (this.notional <= 0) {
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (this.Account_Number === '' || this.Account_Number === undefined) {
        this.successMsg = 'No account with required fund currency.';
        this.loadflag = false;
      } else if (this.successMsg === '') {
        if (this.ISIN) {

          this.BuyFunds = true;
          this.BuyFlag = true;

          if (this.orderType === 'Subscription') {

            if (!this.balanceFlag) {
              this.successMsg =
                'Insufficient cash balance in this account' +
                '(Account Number: ' +
                this.Account_Number +
                ')';
              this.loadflag = false;
            } else {
              this.api.SNSaveOrder('Buy', '', '0.00', this.CustomerID, this.CustomerName, this.notional, this.NotemasterID,
                this.tradeDate, this.loginId, this.Account_Number, this.currency, this.portfolio, this.SalesChargePCT,
                this.accountType, this.FreezeAmount, this.SalesCharge, this.SettlementAmount,
                '0.00', this.VATAmount, this.ClientContribution).subscribe(data => {
                  if (data) {
                    this.loadflag = false;
                    this.successMsg = 'Order placed successfully with Ref ID: ' + data.UDTForRMOrderSaveResult;
                  } else {
                    this.loadflag = false;
                    this.successMsg = 'Error while placing order';
                  }
                })
            }
          } else if (this.orderType === 'Sell') {
            if (this.Units > this.remainingUnits) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: ' +
                this.com.FormatNumberr(parseFloat(this.remainingUnits));
              this.loadflag = false;
            } else if (!this.noBalFlag) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: 0.00';
              this.loadflag = false;
            } else {
              this.api.SNSaveOrder('Sell', '', '0.00', this.CustomerID, this.CustomerName, this.notional, this.NotemasterID,
                this.tradeDate, this.loginId, this.Account_Number, this.currency, this.portfolio, this.SalesChargePCT,
                this.accountType, this.FreezeAmount, this.SalesCharge, this.SettlementAmount,
                '0.00', this.VATAmount, this.ClientContribution).subscribe(data => {
                  if (data) {
                    this.loadflag = false;
                    this.successMsg = 'Order placed successfully with Ref ID: ' + data.UDTForRMOrderSaveResult;
                  } else {
                    this.loadflag = false;
                    this.successMsg = 'Error while placing order';
                  }
                })
            }
          }

        } else {
          this.successMsg = 'Product Code is unavailable.';
        }
      }

    } catch (error) {

    }
  }

  updatePortfolio() {
    // if (this.isUserRM) {
    //   this.updateCustomerPortfolioDetails();
    // } else {

    this.ChangeSelectedportfolio();
    // }
    this.UnitsBalance();
  }

  ChangeSelectedportfolio() {
    this.successMsg = '';
    this.accountList = [];

    this.getaccounts();
    if (this.Account_Number === '') {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
      this.showSubmit = false;
    }
  }

  UnitsBalance() {
    this.api.getCustPortfolioSecurityHoldings(
      this.CustomerID,
      this.portfolio,
      this.baseCCY
    );
  }

  getCustomerDetails() {
    try {
      if (this.userType === 'CLIENT') {
        this.api
          .GetPortfoliosFromCusID(this.CustomerID, this.currency)
          .subscribe((folio) => {
            if (folio) {
              this.portfolioList = folio.DB_GetPortfoliosResult;
              if (this.portfolioList.length > 0) {
                this.successMsg = '';
                this.portfolio = this.portfolioList[0].FacDesc;
                this.portfolioName = this.portfolioList[0].PortfolioName;
              } else {
                this.successMsg = 'Cash account unavailable for the Fund currency';
              }

              this.getaccounts();
            }
          });

        this.remainingUnits = 0;
        this.portfolioDetails.forEach((elem) => {
          if (elem.longName[0].includes(this.productName)) {
            this.remainingUnits = elem.CEHD_Available_Qty[0];
            this.noBalFlag = true;
          }
          // else{
          //   this.remainingUnits = 0;
          // }
        });
      }
    } catch (error) {

    }
  }


  getaccounts() {
    this.api
      .getAccountNumberFromPortfolioGeneric(
        this.CustomerID,
        this.portfolio,
        this.currency
      )
      .subscribe((acc) => {
        if (acc) {
          this.accountList = [];
          this.accountList = acc.ExecGenericTableValuedFunctionResult;
          this.Account_Number = this.accountList[0].Param1;
          this.cashBalance();
        }
      });
  }

  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.remainingBalance = '';
      // this.portfolioAccount.forEach((element, i) => {
      //   if (this.portfolio === this.portfolioAccount[i][0].toString() && this.Account_Number === this.portfolioAccount[i][1].toString() && currency === this.portfolioAccount[i][2].toString()) {
      //     if (parseFloat(nominal) <= this.portfolioAccount[i][3]) {
      //       this.balanceFlag = true;
      //       this.remainingBalance = this.portfolioAccount[i][3];
      //       return;
      //     } else {
      //       this.balanceFlag = false;
      //       this.remainingBalance = this.portfolioAccount[i][3];
      //     }
      //   }
      // });
      this.api
        .getCashbalanceFromAccountNumber(this.currency, this.Account_Number)
        .subscribe((res) => {
          if (res) {
            this.remainingBalance = res.ExecGenericScalarFunctionResult;
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  reset() {
    this.notional = '';
    this.successMsg = '';
  }

  selectedCustomerValue1(e) {
    // console.log(e);
    this.successMsg = '';
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;
    // this.CIF = e.CIF;
    this.api
      .GetPortfoliosFromCusID(this.CustomerID, this.currency)
      .subscribe((folio) => {
        if (folio) {
          this.portfolioList = folio.DB_GetPortfoliosResult;
          if (this.portfolioList.length > 0) {
            this.successMsg = '';
            this.portfolio = this.portfolioList[0].FacDesc;
          } else {
            this.successMsg = 'Cash account unavailable for the Fund currency';
          }
          this.getaccounts();


        }
      });

    // this.afs.getmultiPortfolio(this.CustomerName.split('|')[0]);
    this.homeapi
      .GetCustPortfolioCashHoldings(e.CustomerID, this.homeapi.Portfolio || '')
      .subscribe((res: any) => {
        if (res !== null) {
          // console.log(res);
          this.cashbalance = [];
          this.cashbalance = res;
          // for (let i = 0; i < res.length; i++) {
          //    this.cashccy[i] = res[i].Currency;
          //    this.cashbalance[i] = res[i].Cashbalance;
          //   if(currency === res[i].Currency) {
          //     if(nominal <= res[i].Cashbalance)
          //     this.balanceFlag = true;
          //     this.remainingBalance = res[i].Cashbalance;
          //   } else {
          //     this.balanceFlag = false;
          //   }
          // }
          this.noBalFlag = true;
          // this.getPortfolioFromFund()
          this.enablePortfolio = true;
        } else {
          this.loadflag = false;
          this.noBalFlag = false;
        }
      });
  }

}


