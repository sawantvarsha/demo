import { Component, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { DatePipe } from '@angular/common';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-sip',
  templateUrl: './sip.component.html',
  styleUrls: ['./sip.component.scss'],
})
export class SipComponent implements OnInit, OnDestroy {
  @Input() displaySearch: boolean;
  fundCCy: any;
  productName: any;
  ISIN: any;
  NotemasterID: any;
  rating: any;
  getFundsData: any[];
  // @Input() Ccy: any;
  @Input() get Ccy() {
    //Added by Alolika G on 09-02-2022
    return this.fundCCy;
  }
  set Ccy(Ccy) {
    this.fundCCy = Ccy;
  }
  isUserRM: boolean;
  CustomerID: any;
  CustomerName: any;
  userType: any;
  mutualFundList: any = [];
  mfList: any;
  showFundDetails: boolean;
  data: any;
  // mutualFund: any = [];
  loadflag: boolean = false;
  // showSuggestions: any = [];
  nominal: any;
  moredetails = 'More Details';
  Units = 0;
  notional: any;
  ApplicationType: any;
  currency: any;
  Installment: any;
  Commission: any = '0.00';
  VAT: any = '';
  VATAmount: any = '';
  CommissionAmount: any = '0.00';
  selectedMFIndex = 0;
  // fundtable = [{'index': '0'}];
  SelectedfundsList = [];
  InvestmentAmount: any;
  // InvestmentAmountSelectedFund: any =[];
  Frequency: any = 'Daily';
  FrequencyValues: any = [];
  SIPFeesValues: any = [];
  // NAV: any =[];
  // Contribution:any =[];
  Contribution1: any;
  NAV: any = [];
  Contribution: any = [];
  // Contribution1: any;
  SIPFees: any = 'Recurring';
  startDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021';
  lastDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021'
  successMsg: any;
  searchMF = [];
  // lblError: any;
  currencyList: any;
  mfdetails: any = [];
  // SelectedCurrency:any = [];
  OrderParamsXML: string = '';
  portfolioList: any;
  portfolio: any;
  Account_Number: any;
  accountList: any;
  showSubmit: boolean;
  remainingBalance: any;
  remainingUnits: any;
  portfolioAccount: any;
  cashbalance: any[];
  noBalFlag: boolean;
  enablePortfolio: boolean;
  portfolioDetails: any;
  validation: string;
  mutualFundListCopy: any = [];
  portfolioName: any;
  showSuggestions: any;
  local_ccy: any;
  csvCcy: any;
  Tenor: any;
  dummyDailyDate: any;
  dailyDate: any;
  CIF: any;
  RMName: any;
  RMID: any;
  balanceFlag: boolean;
  navFlag: boolean = true;
  subscribeFunds: boolean;
  subscribeFlag: boolean;
  loadflag1: boolean;
  loadflag2: boolean;
  orderflag: boolean;
  pageName: any;
  hours1: any;
  ampm: any;
  min1: any;
  orderTime: any;
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
  SaveCustomerDetailsSubscriber: Subscription;
  getVATSubscription: Subscription;
  username: any;
  clientGroup: any;
  defaultCommission: any = [];
  sipFlag: boolean = false;
  // errorFlag: boolean;
  IsBackButtonEnabled: boolean;
  selectSIPFundObserverBS: Subscription;
  selectedAssetOBS: Subscription;
  selectedFund: any;
  constructor(
    private homeApi: HomeApiService,
    private afs: WorkflowApiService,
    private elem: ElementRef,
    public cfs: CommonApiService,
    private datepipe: DatePipe,
    private custApi: CustomerApiService,
    private authapi: AuthService,
    public router: Router
  ) {
    this.portfolioAccount = [];
    this.notional = 0;
    this.Units = 0;
    this.showFundDetails = false;
    this.loadflag = false;
    this.subscribeFunds = false;
    // this.switchflag = false;
    // this.portfolioflag = false;
    // this.redeemflag = false;
    this.loadflag1 = false;
    this.loadflag2 = false;
    // this.redeemUnits = 0;
    this.subscribeFlag = false;
    this.orderflag = false;
    this.pageName = 'Order Entry';
    this.showSubmit = false;
    this.RMName = '';
  }
  ngOnDestroy(): void {
    if (this.getVATSubscription) this.getVATSubscription.unsubscribe();
    this.cfs.selectSIPFund.next([]);
    this.homeApi.RediretToHomeBuySellPledge = '';

    if (![undefined, null].includes(this.selectSIPFundObserverBS)) {
      this.selectSIPFundObserverBS.unsubscribe();
      this.selectSIPFundObserverBS = null;
    }
    // if (this.selectSIPFundObserverBS !== null) {
    //   this.selectSIPFundObserverBS.unsubscribe();
    // }
    this.selectedAssetOBS.unsubscribe(); // Added by Alolika G on 16-02-2022
    this.cfs.selectedAsset.next([]);
    this.custApi.SaveOrderObserver.next([]);
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled =
      this.homeApi.RediretToHomeBuySellPledge === '' ? false : true;
    // this.showSuggestions[0] = false;.
    this.addRow(); // By Default add one row Added by Ketan S on 19Jan22
    this.clientGroup = sessionStorage.getItem('FinIQGroupID');
    this.userType = this.authapi.UserType;
    // this.currency = this.custApi.bankBaseCCY;
    this.isUserRM = this.authapi.UserType.toUpperCase().includes('RM')
      ? true
      : false;
    if (!this.isUserRM) {
      try {
        this.CustomerID = this.homeApi.CustomerId;
        this.CustomerName = this.homeApi.CustomerName;
        this.CIF = this.homeApi.CIF;
        this.username = this.authapi.UserName;
      } catch (EX) {
        console.log(EX);
      }
    }
    if (!this.isUserRM) {
      this.custApi.fngetCustAccountDetails(this.username);
    }
    this.remainingUnits = 0;

    try {
      // Added by Alolika G on 16-02-2022
      this.selectedAssetOBS = this.cfs.selectedAssetObserver.subscribe(
        (res) => {
          if (res) {
            // this.sipFlag = true;
            this.productName = res.Product_Name;
            this.currency = res.Currency;
            this.ISIN = res.ISIN;
            this.NotemasterID = res.Note_Master_ID;
            this.rating = res.Product_Risk_Profile;
            this.getDefaultValues();
            this.getBundledFundDetails();
          }
        }
      );
    } catch (error) { }

    try {
      this.selectSIPFundObserverBS = this.cfs.selectSIPFundObserver.subscribe(
        (res) => {
          if (res.length > 0) {
            console.log('res', res);
            this.sipFlag = true;
            this.currency = res[0].Ccy;
            this.fundCCy = res[0].Ccy; //Added by Alolika G on 09-02-2022
            this.getMFListforSIP(res[0].ISIN, res[0].Ccy);
          } else {
            this.afs
              .getMFListForSIP(this.custApi.bankBaseCCY)
              .subscribe((res) => {
                if (res.length !== 0) {
                  this.mutualFundList = res.ExecGenericStoredProcedureResult;
                  console.log('this.mutualFundList', this.mutualFundList);
                  this.mutualFundListCopy =
                    res.ExecGenericStoredProcedureResult;
                  this.getDefaultValues();
                }
              });
          }
        }
      );
    } catch (error) { }

    this.custApi
      .getPledgedAgainstData('SIP_Frequency_Type')
      .subscribe((res) => {
        this.FrequencyValues = res.Get_Configurable_Common_DataResult;
        // this.SIPFees = this.FrequencyValues[0].DATA_VALUE;
        this.FrequencyValues.sort((a, b) => {
          //Added by Alolika G on 3rd Feb 2022.
          const freqA = a.Misc2;
          const freqB = b.Misc2;
          return freqA - freqB;
        });
      });

    this.custApi.getPledgedAgainstData('RIS_Fees').subscribe((res) => {
      this.SIPFeesValues = res.Get_Configurable_Common_DataResult;
      // this.SIPFees = this.SIPFeesValues[0].DATA_VALUE;
    });

    if (
      this.homeApi.CustomerId !== undefined ||
      this.homeApi.CustomerId !== null
    ) {
      this.getVATSubscription = this.afs
        .getVAT(this.homeApi.CustomerId)
        .subscribe((res) => {
          if (res.length !== 0) {
            this.VAT = res.ExecGenericScalarFunctionResult;
            // this.calculateCommissionAndVATAmount();

            // this.tempCcyArray = this.currencyList.slice();
          }
        });
    }

    this.custApi.getBankBaseCCYOBS.subscribe(() => {
      this.clearBtn();

      if (!this.fundCCy) {
        //Added by Alolika G on 09-02-2022
        //<!--Added by AlolikaG on 31st Jan 2022. Assigned by ParikshitK --START-->
        this.updateFundonCCy(this.custApi.bankBaseCCY);
      } else {
        // this.updateFundonCCy(this.Ccy);
      }
    });

    this.afs.loadCurrency().subscribe((res) => {
      if (res.length !== 0) {
        this.currencyList = res;
        // this.currency = this.custApi.bankBaseCCY;
        this.updateFundonCCy(this.Ccy);
        // this.getDefaultCommission();
      }
    });

    if (!this.isUserRM) {
      this.custApi.getCustAccountDetails.subscribe((res) => {
        if (res.length !== 0) {
          console.log(res);
          this.CustomerID = res.CustomerID;
          this.CustomerName = res.misc1;
          this.RMName = res.RM;
          this.RMID = res.RMID;
          this.portfolioAccount.push([
            res.portfolio,
            res.accountnumber,
            res.Accountcurrency,
            res.AvailableBalance,
          ]); // , element.misc1

          // this.afs.GetsuitabilityCheckData(this.CustomerName, this.CustomerID, this.username);
          // this.portfolio = res.portfolio;
        }
      });
    }

    this.afs.portfolioSecHoldingObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.portfolioDetails = res;
      } else {
        this.loadflag = false;
        this.noBalFlag = false;
      }
    });

    try {
      this.SaveCustomerDetailsSubscriber = this.custApi.SaveOrder.subscribe(
        (res) => {
          if (res) {
            if (res.SaveUCPResult) {
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
              if (res.SaveUCPResult[0].SavingMessage !== null) {
                if (
                  res.SaveUCPResult[0].RowNumber === 1 &&
                  res.SaveUCPResult[0].NoteMasterID !== 0
                ) {
                  this.loadflag = false;
                  this.loadflag1 = false;
                  this.loadflag2 = false;

                  if (this.subscribeFlag === true) {
                    this.successMsg =
                      'Order placed successfully. Order Ref No.:' +
                      res.SaveUCPResult[0].NoteMasterID;
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
                } else {
                  this.successMsg = 'Order placement failed.';
                  this.loadflag = false;
                }
              } else {
                this.successMsg = 'Order placement failed.';
                this.loadflag = false;
              }
            } else {
              // this.successMsg = 'Order placement failed.';
              this.loadflag = false;
            }
          }
        }
      );
    } catch (error) { }
  }

  getMFListforSIP(_isin, ccy) {
    this.afs.getMFListForSIP(ccy).subscribe((res) => {
      if (res.length !== 0) {
        this.mutualFundList = res.ExecGenericStoredProcedureResult;
        this.mutualFundListCopy = res.ExecGenericStoredProcedureResult;
        if (this.mutualFundList.length !== 0) {
          this.SelectedfundsList[0] = this.mutualFundList
            .map((t) => {
              return {
                ISIN: t.Param1,
                NMID: t.Param2,
                Nav: t.Param6,
                FundCurrency: t.Param3,
                FundCode: t.Param4,
                FundName: t.Param5,
                ContributionPer: '100.00',
              };
            })
            .filter((r) => r.ISIN === _isin)[0];
        } else {
          // this.SelectedfundsList = [];
          this.loadflag = false;
          this.successMsg = 'SIP order cannnot be placed for selected Fund.';
        }

        if (this.SelectedfundsList[0] === null || this.SelectedfundsList[0] === undefined) {
          this.loadflag = false;
          this.successMsg = 'SIP order cannnot be placed for selected Fund.';
        } else {

        }

        console.log(this.SelectedfundsList);
        this.data = this.SelectedfundsList;
        this.showSuggestions = false;
        // this.mutualFundList.forEach((element) => {
        //   if (isin.includes(element.Param1)) {
        //     this.showSuggestions = false;
        //     this.data = element;
        //     this.SelectedfundsList[0].Nav = this.data.Param6;
        //     this.SelectedfundsList[0].FundCurrency = this.data.Param3;
        //     this.SelectedfundsList[0].FundCode = this.data.Param4;
        //     this.SelectedfundsList[0].FundName = this.data.Param5;
        //     this.SelectedfundsList[0].ContributionPer = '100.00';
        //   }
        // });
        this.currency = ccy;
        this.getDefaultValues();
        console.log('this.SelectedfundsList', this.SelectedfundsList);
      }
    });
  }

  getBundledFundDetails() {
    // Added by Alolika G on 17-02-2022
    try {
      let paramList = [];
      let SPName = 'USP_BundleFundDetailsDetails';
      paramList.push(
        {
          Param1: 'FINIQ_COMMON',
        },
        {
          Param1: '@notemaster',
          Param2: this.NotemasterID,
        },
        {
          Param1: '@EntityID',
          Param2: this.authapi.EntityID,
        },
        {
          Param1: '@LoginUser',
          Param2: this.username,
        },
        {
          Param1: '@ccy',
          Param2: this.currency,
        }
      );

      this.homeApi
        .getMFExecGenericStoredProcedure(SPName, paramList)
        .subscribe((res) => {
          if (res) {
            this.sipFlag = true;
            this.getFundsData = [];
            const Fundetails: any = {};
            let tempFundsData =
              res.ExecGenericStoredProcedureResult[0].GenericResponse;
            // tempFundsData.forEach((element,i) => {
            const allFunds: any[] = tempFundsData.filter((e) =>
              e.Key.includes('FundName')
            );
            const allFundCodes: any[] = tempFundsData.filter((e) =>
              e.Key.includes('FundCode')
            );
            const allContributions: any[] = tempFundsData.filter((e) =>
              e.Key.includes('Contribution')
            );
            Fundetails.ProductName = tempFundsData.filter(
              (e) => e.Key === 'ProductName'
            )[0].Value;
            Fundetails.Notemasterid = tempFundsData.filter(
              (e) => e.Key === 'Notemasterid'
            )[0].Value;
            Fundetails.ISIN = tempFundsData.filter(
              (e) => e.Key === 'ISIN'
            )[0].Value;
            Fundetails.PRR = tempFundsData.filter(
              (e) => e.Key === 'PRR'
            )[0].Value;
            Fundetails.LTV = tempFundsData.filter(
              (e) => e.Key === 'LTV'
            )[0].Value;
            Fundetails.Ccy = tempFundsData.filter(
              (e) => e.Key === 'Currency'
            )[0].Value;
            Fundetails.NoOfUnderlyings = tempFundsData.filter(
              (e) => e.Key === 'NoOfUnderlyings'
            )[0].Value;
            Fundetails.BundledFunds = [];

            allFunds.forEach((f, i) => {
              if (!!f.Value) {
                let fundObj: any = {};
                fundObj.FundName = allFunds[i].Value;
                fundObj.FundCode = allFundCodes[i].Value;
                fundObj.Contribution = allContributions[i].Value;
                fundObj.NAV = tempFundsData
                  .filter((e) => e.Key === 'NAV')[0]
                  .Value.split(',')[i];
                Fundetails.BundledFunds.push(fundObj);
              }
            });

            let FundDetailstemp = Fundetails.BundledFunds;
            this.SelectedfundsList = [];
            FundDetailstemp.forEach((element, _i) => {
              this.SelectedfundsList.push({
                FundName: element.FundName.split('|')[0],
                ContributionPer: element.Contribution,
                Nav: element.NAV,
                FundCurrency: Fundetails.Ccy,
                FundCode: element.FundCode,
              });
            });
            // console.log("this.getFundsData", Fundetails);
            // console.log("this.SelectedfundsList", this.SelectedfundsList);
          }
        });
    } catch (error) { }
  }

  getDefaultValues() {
    this.afs.getDefaultValuesForSIP('RIS_Setup').subscribe((res) => {
      if (res) {
        let data = res.ExecGenericStoredProcedureResult;
        data.forEach((element) => {
          switch (element.Param1) {
            case 'Contribution_Perc':
              if (this.SelectedfundsList[0].ContributionPer === '') {
                this.SelectedfundsList[0].ContributionPer = element.Param2;
              }
              this.Contribution = element.Param2;
              break;
            case 'Frequency':
              this.Frequency = element.Param2;
              break;
            case 'Local_Ccy':
              this.local_ccy = element.Param2;
              this.getCommaSeperatedCcy();
              // this.updateFundonCCy(this.currency);
              //  this.getClientDetails();
              break;
            case 'NoofFixings':
              this.Installment = element.Param2;
              break;
            case 'RIS_Fees':
              this.SIPFees = element.Param2;
              break;
            case 'RISAmount':
              this.InvestmentAmount = element.Param2;
              // this.getDefaultCommission();
              break;
          }
        });

        this.SelectedfundsList[0].InvestedAmount = this.cfs.FormatNumberr(
          parseFloat(this.InvestmentAmount) *
          parseFloat(this.SelectedfundsList[0].ContributionPer)
        );
        this.changeFrequency();
      }
    });
  }

  async getDefaultCommission() {
    try {
      this.defaultCommission = await this.afs.GetSpreadMessage(
        this.currency,
        this.InvestmentAmount,
        '0',
        '0',
        this.clientGroup,
        this.CustomerName,
        'Default'
      );

      this.Commission = this.defaultCommission.DefaultSpread;
      this.CommissionAmount = this.defaultCommission.MaxSpreadAmt;

      // .subscribe(res => {
      //   if (res.Message === null) {
      //     this.defaultCommission = res;

      //     this.Commission = this.defaultCommission.DefaultSpread;
      //     this.CommissionAmount = this.defaultCommission.MaxSpreadAmt;

      //   } else {
      //     this.loadflag = false;
      //     this.successMsg = res.Message;
      //   }
      // })
    } catch (error) { }
  }

  calculateCommissionAndVATAmount() {
    if (parseFloat(this.InvestmentAmount) > 0) {
      this.successMsg = '';
      if (this.SIPFees === 'UPFRONT') {
        this.CommissionAmount = this.cfs.FormatNumberr(
          (parseFloat(this.InvestmentAmount) *
            this.Installment *
            parseFloat(this.Commission)) /
          100
        );
      } else {
        this.CommissionAmount = this.cfs.FormatNumberr(
          (parseFloat(this.InvestmentAmount) * parseFloat(this.Commission)) /
          100
        );
      }
      // Do not remove
      // this.afs.GetSpreadMessageSIP(this.currency, this.InvestmentAmount, this.Commission, "0",
      // this.clientGroup, this.CustomerName, "Validate").subscribe(res => {
      //     if (res.Message === null) {
      //       this.defaultCommission = res;
      //         this.Commission = this.defaultCommission.DefaultSpread;
      //         if (this.SIPFees === 'UPFRONT') {
      //           this.CommissionAmount = this.cfs.FormatNumberr((parseFloat(this.InvestmentAmount) * this.Installment * parseFloat(this.Commission)) / 100);
      //         } else {
      //           this.CommissionAmount = this.cfs.FormatNumberr((parseFloat(this.InvestmentAmount) * parseFloat(this.Commission)) / 100);
      //         }
      //         this.CommissionAmount = this.defaultCommission.MaxSpreadAmt;
      //       this.VATAmount = this.cfs.FormatNumberr((parseFloat(this.CommissionAmount) * parseFloat(this.VAT)) / 100);
      //     } else {
      //       this.successMsg = res.Message;
      //       this.subscribeFlag = false;
      //       this.loadflag = false;
      //     }
      //   })
      this.VATAmount = this.cfs.FormatNumberr(
        (parseFloat(this.CommissionAmount) * parseFloat(this.VAT)) / 100
      );
    } else {
      this.loadflag = false;
      this.successMsg = 'Please enter investment amount.';
    }
  }

  calculateInvestmentAmount() {
    for (var j = 0; j < this.SelectedfundsList.length; j++) {
      if (Number(this.SelectedfundsList[j].ContributionPer) !== 0) {
        this.SelectedfundsList[j].InvestedAmount = this.cfs.FormatNumberr(
          parseFloat(this.InvestmentAmount.toString()) *
          (parseFloat(this.SelectedfundsList[j].ContributionPer) / 100)
        );
      } else {
        this.SelectedfundsList[j].InvestedAmount = 0.0;
      }
    }
  }

  changeContribution(i) {
    if (Number(this.SelectedfundsList[i].ContributionPer) !== 0) {
      this.SelectedfundsList[i].InvestedAmount = this.cfs.FormatNumberr(
        parseFloat(this.InvestmentAmount.toString()) *
        (parseFloat(this.SelectedfundsList[i].ContributionPer) / 100)
      );
    } else {
      this.SelectedfundsList[i].InvestedAmount = 0.0;
    }
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  clearBtn() {
    try {
      this.InvestmentAmount = 0;
      this.Units = 0;
      this.successMsg = '';
      this.validation = '';
      this.SelectedfundsList.splice(0, this.SelectedfundsList.length);
      this.addRow();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  changeFrequency() {
    try {
      this.getDummyTenor();
    } catch (error) { }
  }

  getCommaSeperatedCcy() {
    try {
      if (this.local_ccy !== undefined) {
        this.afs
          .Get_CommaSeperatedCcy(this.local_ccy, this.currency)
          .subscribe((res) => {
            if (res) {
              this.csvCcy = res.ExecGenericScalarFunctionResult;
            }
          });
      }
    } catch (error) { }
  }

  getDummyTenor() {
    try {
      this.afs
        .Get_Dummy_Tenor_From_Fixings_SIP(this.Frequency, this.Installment)
        .subscribe((res) => {
          if (res) {
            this.Tenor = res.ExecGenericScalarFunctionResult;
            this.getDummyDailyDate();
            this.getDailyDate();
          }
        });
    } catch (error) { }
  }

  getDummyDailyDate() {
    try {
      if (this.csvCcy !== undefined) {
        this.afs
          .GetMaturityDateUsingBusinessDays(
            this.startDate,
            this.Tenor,
            this.csvCcy
          )
          .subscribe((res) => {
            if (res) {
              this.dummyDailyDate = res.GetMaturityDateUsingBusinessDaysResult;
              if (this.Frequency.toUpperCase() === 'DAILY') {
                this.lastDate = this.dummyDailyDate;
              }
            }
          });
      }
    } catch (error) { }
  }

  getDailyDate() {
    try {
      this.afs
        .GetMaturityDateForTenorSIP(this.startDate, this.Tenor, this.currency)
        .subscribe((res) => {
          if (res) {
            this.dailyDate = res.GetMaturityDateForTenorResult;
            if (this.Frequency.toUpperCase() !== 'DAILY') {
              this.lastDate = this.dailyDate;
            }
          }
        });
    } catch (error) { }
  }

  selectDate(date) {
    try {
      this.startDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
      this.changeFrequency();
    } catch (error) { }
  }

  ChangeIndex(_e) {
    try {
      this.selectedMFIndex = 0;

      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }

  filterFun(_e, i) {
    try {
      // console.log('newfun');
      const that = this;

      // that.mfList = this.mutualFundList.filter((item) =>
      //   item.Param5.toLowerCase().includes(this.SelectedfundsList[i].FundName.toLowerCase())
      // );

      that.mfList = this.mutualFundListCopy.filter((item) =>
        item.Param5.toLowerCase().includes(
          that.SelectedfundsList[i].FundName.toLowerCase()
        )
      );
      console.log(that.mfList);
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  selectShareOnEnter(_e, i) {
    try {
      const fund = $('.HoverSuggestion').data('mf');
      this.selectShareOnClick(fund, i);
      // this.successMsg = '';
      this.Units = 0;
      this.notional = 0;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShareOnClick(e, i) {
    this.successMsg = '';
    try {
      this.notional = 0;
      this.Units = 0;
      this.selectedMFIndex = 0;
      this.SelectedfundsList[i].FundName =
        e || this.SelectedfundsList[i].FundName;

      this.SelectedfundsList[i].showSuggestions = false;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let j = 0; j < this.mfList.length; j++) {
        if (this.mfList[j].Param5 === e) {
          this.showFundDetails = true;
          this.data = this.mfList[j];
          this.SelectedfundsList[i].Nav = this.data.Param6;
          this.SelectedfundsList[i].FundCurrency = this.data.Param3;
          this.SelectedfundsList[i].FundCode = this.data.Param4;
          break;
        } else {
          this.showFundDetails = false;
        }
      }
      console.log('this.SelectedfundsList', this.SelectedfundsList);
    } catch (Error) { }
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
    }
  }

  removeRow(i) {
    this.SelectedfundsList.splice(i, 1);
  }

  updateFundonCCy(ccy) {
    try {
      // this.clearBtn();
      this.afs.getMFListForSIP(ccy).subscribe((res) => {
        if (res.length !== 0) {
          this.mutualFundList = res.ExecGenericStoredProcedureResult;
          this.mutualFundListCopy = res.ExecGenericStoredProcedureResult;
          let mfListtemp = [];
          if (this.mutualFundList.length > 0) {
            this.mutualFundList.forEach((element) => {
              if (element.Param3 === ccy) {
                mfListtemp.push(element);
              }
            });
            this.mutualFundListCopy = [];
            this.mutualFundListCopy = mfListtemp;
            if (this.mutualFundListCopy.length === 0) {
              this.successMsg = 'Fund unavailable for selected currency.';
            } else {
              // this.successMsg = '';
            }
          }
          this.currency = ccy;
          this.getCommaSeperatedCcy();
          this.getClientDetails();
        }
      });
    } catch (error) { }
  }

  getClientDetails() {
    try {
      if (this.userType === 'CLIENT') {
        this.afs
          .GetPortfoliosFromCusID(this.CustomerID, this.currency)
          .subscribe((folio) => {
            if (folio) {
              this.portfolioList = folio.DB_GetPortfoliosResult;
              if (this.portfolioList.length > 0) {
                // this.successMsg = '';
                this.portfolio = this.portfolioList[0].FacDesc;
                this.portfolioName = this.portfolioList[0].PortfolioName;
              } else {
                this.successMsg =
                  'Cash account unavailable for the Fund currency';
              }
              if (this.portfolio.length > 0) {
                this.getaccounts();
              }
            }
          });
      }
      this.remainingUnits = 0;
      this.portfolioDetails.forEach((elem) => {
        if (elem.longName[0].includes(this.data.Name)) {
          this.remainingUnits = elem.CEHD_Available_Qty[0];
          this.noBalFlag = true;
        }
        // else{
        //   this.remainingUnits = 0;
        // }
      });
    } catch (error) { }
  }

  updatePortfolio() {
    // if (this.isUserRM) {
    //   this.updateCustomerPortfolioDetails();
    // } else {

    this.ChangeSelectedportfolio();
    // }
    this.UnitsBalance();
  }
  UnitsBalance() {
    this.afs.getCustPortfolioSecurityHoldings(
      this.CustomerID,
      this.portfolio,
      this.custApi.bankBaseCCY
    );
  }

  updateCustomerPortfolioDetails() {
    // this.accountList = [];
    // this.CurrencyList = [];
    // // console.log('Update ccy: ', this.currency);
    // const temp: any = this.selectedCustomerDetails.filter(obj => {
    //   return obj.PortfolioName === this.portfolio;
    // }
    // )
    // temp.forEach(element => {
    //   if (this.data.Ccy === element.SICurrency) {
    //     this.accountList.push(element.AccountNo);
    //     this.CurrencyList.push(element.SICurrency);
    //   }

    // });
    // this.Account_Number = this.accountList[0];
    if (this.portfolioList.length !== 0) {
      this.successMsg = '';
      this.portfolio = this.portfolioList[0];
      this.Account_Number = this.accountList[0];
      this.afs.getCustPortfolioSecurityHoldings(
        this.CustomerID,
        this.portfolio,
        this.custApi.bankBaseCCY
      );
    } else {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
    }
  }

  ChangeSelectedportfolio() {
    this.successMsg = '';
    this.accountList = [];
    // let tempPortfoliodetails: any[] = [];
    // tempPortfoliodetails = this.portfolioAccount.slice();
    // let tempPortfolioArr = tempPortfoliodetails;

    // const temp: any = tempPortfolioArr.filter((obj, i) => {
    //   return tempPortfolioArr[i][0] === this.portfolio;
    // });

    // temp.forEach((element, i) => {
    //   if (this.data.Ccy === temp[i][2])
    //     this.accountList.push(temp[i][1]);
    //   this.CurrencyList.push(temp[i][2]);
    // });
    // for (let i = 0; i < this.portfolioList.length; i++) {
    //   if (this.portfolioList[i] === this.portfolio) {
    //     this.Account_Number = this.accountList[i];
    //   }
    // }
    this.getaccounts();
    if (this.Account_Number === '') {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
      this.showSubmit = false;
    }
  }
  getaccounts() {
    this.afs
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
      this.afs
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
  selectedCustomerValue1(e) {
    // console.log(e);
    this.successMsg = '';
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;
    this.CIF = e.CIF;
    this.RMID = this.homeApi.RMID;
    this.afs
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
          if (this.portfolio.length > 0) {
            this.getaccounts();
          }
        }
      });

    // this.afs.getmultiPortfolio(this.CustomerName.split('|')[0]);
    this.homeApi
      .GetCustPortfolioCashHoldings(e.CustomerID, this.homeApi.Portfolio || '')
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

    this.getVATSubscription = this.afs
      .getVAT(this.CustomerID)
      .subscribe((res) => {
        if (res.length !== 0) {
          this.VAT = res.ExecGenericScalarFunctionResult;
          // this.calculateCommissionAndVATAmount();

          // this.tempCcyArray = this.currencyList.slice();
        }
      });
  }

  fnRedirectToHomePage() {
    this.router.navigate(['/rmw']);
  }

  clickSave() {
    try {
      // this.successMsg = '';
      if (
        parseFloat(this.InvestmentAmount) <= parseFloat(this.remainingBalance)
      ) {
        this.balanceFlag = true;
      } else {
        this.balanceFlag = false;
      }
      const isValidBasket = !this.SelectedfundsList.map((e, _i) =>
        parseFloat(e.Nav === '' ? '0' : e.Nav)
      ).includes(0);
      console.log('isValidBasket', isValidBasket);
      this.navFlag = isValidBasket;
      // this.SelectedfundsList.forEach(element => {
      //   if (element.Nav === null || element.Nav === undefined || element.Nav === "null" || element.Nav === 0  || element.Nav === "") {
      //     this.successMsg = 'NAV is 0 or null for' + element.FundName + '. Please select other fund';
      //     this.navFlag = false;

      //   }
      //   else {
      //     this.navFlag = true;
      //   }
      // });
      if (!this.navFlag) {
        this.loadflag = false;
        this.successMsg = 'NAV is 0. Please select other fund';
      } else if (this.InvestmentAmount <= 0) {
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (
        this.Account_Number === '' ||
        this.Account_Number === undefined
      ) {
        this.successMsg = 'No account with required fund currency.';
        this.loadflag = false;
      } else if (this.successMsg === '') {
        this.subscribeFunds = true;

        this.subscribeFlag = true;
        if (!this.balanceFlag) {
          this.successMsg =
            'Insufficient cash balance in this account' +
            '(Account Number: ' +
            this.Account_Number +
            ')';
          this.loadflag = false;
        } else {
          this.saveSIPOrder();
        }
      }
    } catch (error) { }
  }

  saveSIPOrder() {
    if (!this.isUserRM) {
      this.VAT = 0.0;
      this.VATAmount = 0.0;
      this.Commission = 0.0;
      this.CommissionAmount = 0.0;
    } else {
      if (this.VATAmount.includes(',')) {
        this.VATAmount = this.VATAmount.replace(/,/g, '');
      }
      if (this.CommissionAmount.includes(',')) {
        this.CommissionAmount = this.CommissionAmount.replcae(/,/g, '');
      }
      if (this.InvestmentAmount.includes(',')) {
        this.InvestmentAmount = this.InvestmentAmount.replcae(/,/g, '');
      }
    }
    this.OrderParamsXML = '';
    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';

    this.OrderParamsXML =
      this.OrderParamsXML + ('<CIF_Number>' + this.CIF + '</CIF_Number>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Dynamic</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Facility_Type>' + this.portfolio + '</Facility_Type>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<RMID>' + this.RMID + '</RMID>');

    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Settlement_Ccy>' + this.currency + '</Settlement_Ccy>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Account_Number>' + this.Account_Number + '</Account_Number>');

    let s = Math.floor(Math.random() * 100 + 1);
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Ris_Transaction_Reference_Number>SIP' +
        s +
        '</Ris_Transaction_Reference_Number>');
    // writeInfoLOg(FinIQUserID, "Ris_Transaction_Reference_Number: " & s, LogType.FnqDebug, Nothing, sSelfPath)

    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<RISAmount>' + this.InvestmentAmount + '</RISAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Frequency>' + this.Frequency + '</Frequency>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<NoofFixings>' + this.Installment + '</NoofFixings>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<Dummy_Tenor>' + this.Tenor + '</Dummy_Tenor>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<RIS_Subscription_Date>' + this.startDate + '</RIS_Subscription_Date>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Maturity_Date>' + this.lastDate + '</Maturity_Date>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<Fees_Mode>Exclusive</Fees_Mode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Sales_Charge>' + this.Commission + '</Sales_Charge>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<SalesChargeAmount>' + this.CommissionAmount + '</SalesChargeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<VATPerc>' + this.VAT + '</VATPerc>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<VATAmount>' + this.VATAmount + '</VATAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<RIS_Fees>' + this.SIPFees + '</RIS_Fees>');

    this.OrderParamsXML =
      this.OrderParamsXML +
      '<No_of_underlyings>' +
      this.SelectedfundsList.length +
      '</No_of_underlyings>';
    //  this.OrderParamsXML = this.OrderParamsXML + ("<OrderPlacementMode>" & ddlPlacementMode.SelectedItem.Text & "</OrderPlacementMode>")
    this.OrderParamsXML =
      this.OrderParamsXML + '<FundingMode>Fully Funded</FundingMode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ClientContribution>' +
        this.InvestmentAmount +
        '</ClientContribution>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FreezeAmount>' + this.InvestmentAmount + '</FreezeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TotalProceeds>' + this.InvestmentAmount + '</TotalProceeds>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ContactedNumber>' + this.homeApi.ContactNo + '</ContactedNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<UnregisteredYN>N</UnregisteredYN>';
    let d = new Date();
    this.OrderParamsXML =
      this.OrderParamsXML + ('<OrderTime>' + d + '</OrderTime>');
    //this.OrderParamsXML = this.OrderParamsXML + ("<ExtensionEmailPlace>" & txtPlaceNumberEmail.Text & "</ExtensionEmailPlace>")
    this.OrderParamsXML = this.OrderParamsXML + '<Remarks>test</Remarks>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SuitabilityTokenCount>0</SuitabilityTokenCount>';

    //   this.SelectedfundsList.forEach((element,i) => {
    //     console.log(element);
    //     this.OrderParamsXML =
    //   this.OrderParamsXML +
    //   ('<FundName'+ i +'>' + element.FundName + '</FundName'+ i +'>');
    // this.OrderParamsXML =
    //   this.OrderParamsXML +
    //   ('<FundCode'+ i + '>' + element.FundCode + '</FundCode' + i + '>');
    // this.OrderParamsXML =
    //   this.OrderParamsXML + '<Contribution_Perc'+ i + '>' + element.ContributionPer +'</Contribution_Perc'+ i + '>';
    // this.OrderParamsXML =
    //   this.OrderParamsXML +
    //   ('<Inv_Amount' + i + '>' + element.InvestedAmount + '</Inv_Amount'+ i + '>');
    // this.OrderParamsXML =
    //   this.OrderParamsXML + ('<NAV'+ i + '>' + element.Nav + '</NAV'+ i +'>');
    //   });

    for (let i = 0; i < this.SelectedfundsList.length; i++) {
      let count = i + 1;
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<FundName' +
          count +
          '>' +
          this.SelectedfundsList[i].FundName +
          '</FundName' +
          count +
          '>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<FundCode' +
          count +
          '>' +
          this.SelectedfundsList[i].FundCode +
          '</FundCode' +
          count +
          '>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        '<Contribution_Perc' +
        count +
        '>' +
        this.SelectedfundsList[i].ContributionPer +
        '</Contribution_Perc' +
        count +
        '>';
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<Inv_Amount' +
          count +
          '>' +
          this.SelectedfundsList[i].InvestedAmount +
          '</Inv_Amount' +
          count +
          '>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<NAV' +
          count +
          '>' +
          this.SelectedfundsList[i].Nav +
          '</NAV' +
          count +
          '>');
    }

    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';

    this.custApi.saveNewOrder(
      this.OrderParamsXML,
      this.authapi.UserName,
      'RIS_Setup',
      'INSERT',
      1
    );
  }
}
