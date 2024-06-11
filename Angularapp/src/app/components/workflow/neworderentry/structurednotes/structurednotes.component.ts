import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-structurednotes',
  templateUrl: './structurednotes.component.html',
  styleUrls: ['./structurednotes.component.scss']
})
export class StructurednotesComponent implements OnInit, OnDestroy {

  @Input() displaySearch: boolean;
  @Input() templateCode: any;
  userType: string;
  isUserRM: boolean;
  enablePortfolio: boolean;
  CustomerID: any;
  CustomerName: any;
  clientPrice: any;
  isEditable = true;
  issueDate: any;
  orderType: any;
  orderMode: any;
  tradeDate: any;
  maturityDate: any;
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

  constructor(public com: CommonApiService,
    public api: WorkflowApiService,
    public elem: ElementRef,
    public homeapi: HomeApiService,
    public authapi: AuthService,
    private cfs: CustomerApiService) {
    this.moredetails = 'More Details';
    this.notional = 0;
  }

  ngOnDestroy(): void {
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';
    this.selectedAssetOBS.unsubscribe(); // Added by Alolika G on 06-07-2022

  }

  ngOnInit(): void {
    this.orderType = 'Buy';
    this.orderMode = 'Firm';
    this.loginId = this.authapi.UserName;
    this.userType = this.authapi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }

    if (!this.isUserRM) {
      this.CustomerID = this.homeapi.CustomerId;
      this.CustomerName = this.homeapi.CustomerName;
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
          this.NotemasterID = res;
          this.getProductDetails(this.NotemasterID);

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

    try {
      this.com.selectedDirObserver.subscribe((res) => {
        if (res.length !== 0) {
          if (res.toUpperCase() === 'BUY') {
            this.orderType = 'Buy';
          } else if (res.toUpperCase() === 'SELL') {
            this.orderType = 'Sell';
          }


        }
      });
    } catch (error) {

    }
  }

  getProductDetails(id) {
    try {
      this.api.FillProductDetailsSP(id, this.templateCode).subscribe(res => {
        if (res) {
          this.productDetails = res.FillProductDetailsResult;
          this.productDetails.forEach(element => {
            this.productName = element.Product_Name;
            this.currency = element.SETTLECCY;
            this.ISIN = element.ISIN;
            this.rating = element.RiskRating;
            this.clientPrice = element.Client_Price;
            const date = new Date();
            this.tradeDate =
              date.getDate().toString() +
              '-' +
              this.Months[date.getMonth()].toString() +
              '-' +
              date.getFullYear().toString();
            // this.tradeDate = this.formatDate(element.Trade_Date)
          });

          console.log("FillProductDetailsResult", this.productDetails);
          this.getCustomerDetails();
        }
      })
    } catch (error) {

    }
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

  // calculateNotional() {
  //   // nav !== 0 ? (this.notional = this.Units * nav) : (this.notional = 0);
  //   this.notional = this.notional.toFixed(2);
  //   this.validation = '';
  //   this.notional = this.com.FormatNumberr(this.notional);
  //   this.successMsg = '';
  //   // this.UnitsBalance();
  // }

  unitCalculations(notional) {
    try {
      this.Units = notional / this.clientPrice;
      this.Units = this.Units.toFixed(2);
      this.validation = '';
      // this.Units = this.com.FormatNumberr(this.Units);
      this.successMsg = '';
      // this.Units = this.com.unformatNumber(this.Units);
      console.log("Units", this.Units);



      // this.cashBalance(this.data.Ccy, nominal);
    } catch (error) {
      // console.log("Error:", error);
    }
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
      }else if (this.Account_Number === '' ||this.Account_Number === undefined) {
        this.successMsg = 'No account with required fund currency.';
        this.loadflag = false;
      } else if (this.successMsg === '') {
        if(this.ISIN) {

          this.BuyFunds = true;
          this.BuyFlag = true;

          if(this.orderType === 'Buy') {

            if (!this.balanceFlag) {
              this.successMsg =
                'Insufficient cash balance in this account' +
                '(Account Number: ' +
                this.Account_Number +
                ')';
              this.loadflag = false;
            } else {
              this.api.SNSaveOrder(this.orderType, this.orderMode, this.clientPrice, this.CustomerID, this.CustomerName, this.notional, this.NotemasterID,
                this.tradeDate, this.loginId, this.Account_Number, this.currency, this.portfolio, this.SalesChargePCT,
                this.accountType, this.FreezeAmount, this.SalesCharge, this.SettlementAmount,
               this.Units, this.VATAmount, this.ClientContribution).subscribe(data => {
                  if(data) {
                    this.loadflag = false;
                    this.successMsg = 'Order placed successfully with Ref ID: ' + data.UDTForRMOrderSaveResult;
                  } else {
                    this.loadflag = false;
                    this.successMsg = 'Error while placing order';
                  }
                })
            }
          } else if(this.orderType === 'Sell') {
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
              this.api.SNSaveOrder(this.orderType, this.orderMode, this.clientPrice, this.CustomerID, this.CustomerName, this.notional, this.NotemasterID,
                this.tradeDate, this.loginId, this.Account_Number, this.currency, this.portfolio, this.SalesChargePCT,
                this.accountType, this.FreezeAmount, this.SalesCharge, this.SettlementAmount,
                this.Units, this.VATAmount, this.ClientContribution).subscribe(data => {
                  if(data) {
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

}
