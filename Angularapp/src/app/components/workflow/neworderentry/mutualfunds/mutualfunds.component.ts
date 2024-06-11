import { Component, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { ApifunctionService } from '../../../fx-order/apifunction.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-mutualfunds',
  templateUrl: './mutualfunds.component.html',
  styleUrls: ['./mutualfunds.component.scss'],
})
export class MutualfundsComponent implements OnInit, OnDestroy {
  @Input() displaySearch: boolean;
  @Input() note_Master_Id: any = '';
  fundNMID: any;
  businessDate: any;
  @Input() get noteMasterId() {
    return this.fundNMID;
  }
  set noteMasterId(noteMasterId) {
    this.fundNMID = noteMasterId;
  }
  //<!-- Addded by Alolika G | 15-02-2022 -->
  @Input() get Customer() {
    return this.SelectedCustomerName;
  }
  set Customer(Customer) {
    this.SelectedCustomerName = Customer;
  }
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
  cashccy: any[];
  cashbalance: any[];
  balanceFlag: boolean;
  Account_Name: string;
  Account_Number: string;
  accountList = [];
  Address_Details: string;
  BSB: string;
  Contact_Number: string;
  CustomerType: string;
  CustomerName: string = '';
  DOB: string;
  IdentificationType: string;
  IdentificationNo: string;
  Nationality: string;
  Nature_of_Business: string;
  Postal_Details: string;
  portfolio: string;
  CustomerID: any;
  userID: string;
  // multiportfoliodata: Subscription;
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
  showSubmit: boolean = false;
  portfolioDetails: any[] = [];
  // customersOfRMArray: any = [];
  // selectedCustomer: string;
  // searchedCustomers: any = [];
  // selectedCustomerIndex = 0;
  selectedCustomerDetails: any = [];
  isUserRM: boolean;
  userType: string;
  popUpflag: boolean;
  OrderParamsXML: string = '';

  SIPOrderParamsXML: string = '';
  // suitabilityCheckData = {
  //   Parameter: '',
  //   CIF: '',
  //   EligibleYN: '',
  //   Reason: '',
  //   Ref: '',
  //   Override: false
  // };
  remainingBalance: any;
  finalSuitabilityData = [];
  suitabilityStatus = '';
  SaveCustomerDetailsSubscriber: Subscription;
  CustName: any;
  RMName: string;
  noBalFlag: boolean;
  lastDate = '';
  startDate = '';
  Frequency: any;
  FrequencyData = [];
  Installments: any;
  enablePortfolio = true;
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
  baseCCY: string;
  portfolioName: any;
  CIF: any;
  FundingModeData: any;
  FundMode: any = 'Fully Funded';
  FundVal: any;
  LoanAmt: any = 0;
  LoanTenor: any = '12M';
  TenorData: any;
  Drawdown: any = '0';
  showSuitabilityPopup: boolean; // Added by Rohit T. | 03-Feb-2021
  sut_notemaster: string; // Added by Rohit T. | 04-Feb-2021
  checkSuitability: boolean = false; // Added by Alolika G. | 07-Feb-2021
  orderDetails: any;
  CRR: any;
  commissionValue: any = '';
  commissionPercentage: any = '';
  commissionReason: any = '';
  NMID_Suitability: any;
  token: any;

  SelectedCustomerName: any; // Added by Mayuri D | 07-Feb-2022
  ShowCustName: any = false; // Added by Mayuri D | 07-Feb-2022
  SelectedCustomerID: any; // Added by Mayuri D | 07-Feb-2022
  selectedAssetOBS: Subscription;
  constructor(
    private elem: ElementRef,
    public homeApi: HomeApiService,
    public cfs: CommonApiService,
    private afs: WorkflowApiService,
    private api: CustomerApiService,
    private apfs: ApifunctionService,
    public auth: AuthService,
    private router: Router,
    public activatedRoute: ActivatedRoute
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
      this.showSubmit = false;
      this.RMName = '';
      this.NMID_Suitability = '';
      // console.info('This is' + icons.heart + ' Glyphicons!');
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ngOnDestroy() {
    // this.afs.multiportfolio.next([]);
    // this.multiportfoliodata.unsubscribe();
    // console.log('destroy');
    this.portfolioList = []; // Clear portfolio list
    this.portfolio = '';
    this.ShowCustName = false; // Added by Mayuri D. | 07-Feb-2022
    // this.selectedAssetOBS.unsubscribe();
    this.cfs.selectedAsset.next([]); // Added by Alolika G | 11-02-2022
    // this.cfs.selectedPortfolioBal.next([]);
    this.afs.portfolioSecHolding.next([]);
    this.cfs.selectedDir.next([]);
    if (![undefined, null].includes(this.selectedAssetOBS)) {
      this.selectedAssetOBS.unsubscribe();
      this.selectedAssetOBS = null;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res) => {
      if (!this.displaySearch) {
        this.displaySearch = res.displaySearch;
      }
    });
    this.ShowCustName = false;

    // console.log(this.notenote_Master_IdMasterId)
    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.CustomerID = this.homeApi.CustomerId;
      this.CustomerName = this.homeApi.CustomerName.split('|')[0];
      this.CRR = this.homeApi.CRR;
    }
    // Added by Mayuri D. | 07-Feb-2022 ...START...
    else {
      // Added by Mayuri D. | 07-Feb-2022 ... START....
      if (!this.SelectedCustomerName) {
        //<!-- Addded by Alolika G | 15-02-2022 -->
        this.SelectedCustomerName = sessionStorage.getItem(
          'SelectedCustomerName'
        );
        if (this.SelectedCustomerName) {
          //Added by Alolika G on 11th Feb 2022.
          this.CustomerName = this.SelectedCustomerName;
          this.CustomerID = this.SelectedCustomerName.split('|')[1];
          // console.log("customer  id" , this.CustomerID)
          // Added by Mayuri D. | 07-Feb-2022 ...END...
        }
      } else {
        this.CustomerName = this.SelectedCustomerName;
        this.CustomerID = this.SelectedCustomerName.split('|')[1];
      }
    }
    // Added by Mayuri D. | 07-Feb-2022 ...END...

    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.api.getBankBaseCCYOBS.subscribe((ccy) => {
      if (ccy !== '') {
        this.baseCCY = ccy;
      }
    });
    this.remainingUnits = 0;
    const that = this;
    this.username = sessionStorage.getItem('Username');
    const date = new Date();
    this.startDate =
      date.getDate().toString() +
      '-' +
      this.Months[date.getMonth()].toString() +
      '-' +
      date.getFullYear().toString();
    //this.CustomerID = sessionStorage.getItem('CustomerID');
    this.api.fngetCustAccountDetails(this.username);

    try {
      this.apfs.CustomerSearch(this.username);
      this.apfs.CustomerListObserver.subscribe((res) => {
        if (res.length > 0) {
          // console.log(res);
          // this.customerList = res;
          res.forEach((ele) => {
            if (
              ele.CustomerID ===
              parseInt(sessionStorage.getItem('CustomerID'), 10)
            ) {
              // this.CustomerCIF = ele.AH_CIF_No;
              // this.CustomerName = ele.CustomerName;
              // this.CustomerSegment = ele.AH_Customer_Segment;
              this.RMName = ele.RelManager;
              // this.DealerID = ele.DealerID;
              // this.CustomerID = ele.CustomerID;
            }
          });
        }
      });
    } catch (ex) {}

    this.afs.MFList.subscribe((mf) => {
      // console.log(mf);
      that.mfList = mf.filter((item) =>
        item.Name.toLowerCase().startsWith(that.mutualFund.toLowerCase())
      );
      //   that.switchList = mf.filter(item => item.Name.toLowerCase().startsWith(that.switchFund.toLowerCase()));
      // console.log(that.mfList);
    });

    if (history.state.FundName !== '') {
      // console.log(this.mfList);
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
        // console.log(res);

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
    // this.api.GetAllTradableCurrency();
    // this.api.allTradablePairObserver.subscribe((res: any) => {
    //   if (res) {
    //     this.CurrencyList = [];
    //     const map = new Map();
    //     // const obj = JSON.parse(res);
    //     res.forEach((element) => {
    //       map.set('' + element.Asset1, element.Asset1);
    //       map.set('' + element.Asset2, element.Asset2);
    //     });
    //     this.CurrencyList = Array.from(map.keys()).sort();
    //     // console.log(this.CurrencyList);
    //     // this.currency = 'AUD';
    //   }
    // });

    // this.afs.holdingsObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     if (res['GetHoldingsResult'].length !== 0) {
    //       this.ExistingHoldings = res['GetHoldingsResult'][0].Units;
    //       // console.log(this.ExistingHoldings);
    //       if (this.ExistingHoldings >= this.Units) {
    //         this.remainingUnits = this.ExistingHoldings - this.Units;
    // eslint-disable-next-line
    //         // this.afs.FundsOrderEntry(0, this.data.Code, 'Redeemption', 'RD', '', '', this.Units, 'SRS', this.remainingUnits, this.data.Ccy, this.RM, this.Book, this.CustomerType, this.CustomerName, this.DOB, this.IdentificationType, this.IdentificationNo, this.Nationality, this.Account_Number, this.portfolio, this.username);
    //         this.SavefundsOrder(0, 'Redeemption', 'RD', 'SRS', this.Units, this.remainingUnits);
    //       } else {
    //         this.loadflag = false;
    //         this.successMsg = 'Holding units less than redeem units.';
    //       }

    //     } else {
    //       if (this.subscribeFlag === true) {
    //         this.loadflag = false;
    //         this.successMsg = 'Holding units less than redeem units.';
    //       }
    //     }
    //   }
    // });

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
        // if (data === 'FAIL' || data === 'Undefined') {
        //   this.successMsg = 'Order placement failed';
        // } else {

        if (this.subscribeFlag === true) {
          this.successMsg = 'Order placed successfully. Order Ref No.:' + data;
          this.orderflag = true;

          // console.log(data, "data");
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
        this.successMsg = 'Order placement failed.';
        this.loadflag = false;
      }
    });
    // if (!this.isUserRM) {
    //   this.afs.getmultiPortfolio(this.username);
    // }

    // this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     if (res.status === false) {
    //       this.successMsg = 'Account details not available';
    //     } else {
    //       // console.log(res);
    //       // res.forEach(element => {
    //       // const result = [];
    //       // const map = new Map();
    //       // for (const item of res.message) {
    //       //   if (!map.has(item.portfolio)) {
    //       //     map.set(item.portfolio, true); // set any value to Map
    //       //     result.push({
    //       //       portfolio: item.portfolio,
    //       //       ccy: item.Accountcurrency
    //       //     });
    //       //   }
    //       // }

    //       // this.portfolioList = [];
    //       // result.forEach(element => {
    //       //   this.portfolioList.push(element.portfolio);
    //       // });
    //       // // console.log(this.portfolioList);
    //       // // });
    //     }
    //     this.portfolioAccount = [];
    //     res.message.forEach(element => {
    //       this.portfolioAccount.push([element.portfolio, element.accountnumber, element.Accountcurrency, element.AvailableBalance]); // , element.misc1
    //     });

    //     // this.portfolio = this.portfolioList[0];
    //     // this.Account_Number = this.portfolioAccount[0][1];
    //     // this.currency = this.portfolioAccount[0][2];
    //     // this.data.Ccy = this.currency;
    //     this.CustomerID = res.message[0].CustomerID;
    //     this.CustomerName = res.message[0].misc1;
    //     // this.PortfolioChange();
    //     // if (!this.isUserRM) this.PortfolioChange();
    //     // else {
    //     //   // this.getPortfolioFromFund();
    //     //   this.updateCustomerPortfolioDetails();

    //     // }
    //     // console.log(this.portfolioAccount);
    //   }
    // }
    // );

    //Changes done by Alolika G | 11-02-2022
    this.selectedAssetOBS = this.cfs.selectedAssetObserver.subscribe((res) => {
      if (res.length !== 0) {
        // console.log('mF data from the product catalog', res);
        this.mfList.forEach((element) => {
          if (res.includes(element.ISIN)) {
            this.data = [];
            this.data = element;
            this.currency = element.Ccy;
            if (this.userType === 'CLIENT') {
              this.afs
                .GetPortfoliosFromCusID(this.CustomerID, this.currency)
                .subscribe((folio) => {
                  if (folio) {
                    this.portfolioList = folio.DB_GetPortfoliosResult;
                    if (this.portfolioList.length > 0) {
                      this.successMsg = '';
                      this.portfolio = this.portfolioList[0].FacDesc;
                      this.portfolioName = this.portfolioList[0].PortfolioName;
                    } else {
                      this.successMsg =
                        'Cash account unavailable for the Fund currency';
                    }

                    this.getaccounts();
                  }
                });
            }
            this.remainingUnits = 0;
            this.portfolioDetails.forEach((elem) => {
              if (elem.CEHD_Stock_Code[0] === this.data.Code) {
                // this.remainingUnits = elem.CEHD_Available_Qty[0] + elem.CEHD_Pending_receive_Qty[0]
                // + elem?.CEHD_PledgedOut_Qty[0] - elem?.CEHD_Pending_pay_Qty[0];
                this.remainingUnits = elem.CEHD_Available_Qty[0];
                console.log('remaningUnits', this.remainingUnits);
                this.noBalFlag = true;
              }
              // else{
              //   this.remainingUnits = 0;
              // }
            });
            console.log('selected data', this.data);
          } else {
            console.log('Invalid Mutual fund selected');
          }
        });
      }
    });

    this.cfs.selectedPortfolioObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.portfolio = res;
      }
    });

    this.cfs.selectedPortfolioBalObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.remainingUnits = res;
      }
    });

    // Added by Mayuri D | 07-Feb-2022 ... START...
    this.cfs.SetFlagtoCustomerObserver.subscribe((res) => {
      if (res) {
        if (this.isUserRM) {
          this.ShowCustName = res;
          // console.log("res is ", res, this.ShowCustName)
          this.CustomerID = this.SelectedCustomerName.split('|')[1];
          // console.log("Customer id id", this.CustomerID)
          this.afs
            .GetPortfoliosFromCusID(this.CustomerID, this.data.Ccy)
            .subscribe((folio) => {
              if (folio) {
                this.portfolioList = folio.DB_GetPortfoliosResult;
                if (this.portfolioList.length > 0) {
                  this.successMsg = '';
                  this.portfolio = this.portfolioList[0].FacDesc;
                } else {
                  this.successMsg =
                    'Cash account unavailable for the Fund currency';
                }
                this.getaccounts();
              }
            });
        }
      }
    });

    // Added by Mayuri D | 07-Feb-2022 ...END...

    // this.afs.suitabilityCheck.subscribe(res => {
    //   if (res.length !== 0) {
    //     const arr = res.CustomerSuitabilityResponse.Eligibility[0]['a:Eligibility'];

    //     this.suitabilityStatus = res.CustomerSuitabilityResponse.Status[0];
    //     this.finalSuitabilityData = [];
    // eslint-disable-next-line
    //     for (let i = 0; i < arr.length; i++) {
    //       this.suitabilityCheckData.Parameter = arr[i]['a:Parameters'];
    //       this.suitabilityCheckData.CIF = arr[i]['a:CIFA'];
    //       this.suitabilityCheckData.EligibleYN = arr[i]['a:Eligible_YN'];
    //       this.suitabilityCheckData.Reason = arr[i]['a:Failed_Reason'];
    //       this.suitabilityCheckData.Ref = arr[i]['a:ColumnName'];
    //       // console.log(arr[i]['a:AC_Overrided_YN'][0].toUpperCase());
    //       if (arr[i]['a:AC_Overrided_YN'][0].toUpperCase() === 'Y') {
    //         this.suitabilityCheckData.Override = false;
    //       } else {
    //         this.suitabilityCheckData.Override = true;
    //       }

    //       this.finalSuitabilityData.push(this.suitabilityCheckData);
    //       this.suitabilityCheckData = {
    //         Parameter: '',
    //         CIF: '',
    //         EligibleYN: '',
    //         Reason: '',
    //         Ref: '',
    //         Override: false
    //       };
    //     }
    //     // console.log(this.finalSuitabilityData);
    //   }
    // });

    this.SaveCustomerDetailsSubscriber = this.api.SaveOrder.subscribe((res) => {
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

                //Added by Alolika G on 7th Feb 2022
                let orderDetail = {
                  custID: this.CustomerID,
                  currency: this.data.Ccy,
                  custName: this.CustomerName,
                  NoteMasterId: this.NMID_Suitability,
                  portfolio: this.portfolio,
                  orderID: res.SaveUCPResult[0].NoteMasterID,
                  settlementAmount: this.notional,
                  failrules: this.token,
                };
                if (this.checkSuitability && this.token !== '') {
                  this.afs.getSuitabilityToken(orderDetail).then((token) => {
                    console.log(token, 'token', orderDetail, 'orderDetail');
                  });
                }
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
    });
    this.cfs.selectedDirObserver.subscribe((res) => {
      if (res.length !== 0) {
        if (res.toUpperCase() === 'BUY') {
          this.ApplicationType = 'Subscription';
        } else if (res.toUpperCase() === 'SELL') {
          this.ApplicationType = 'Redemption';
        }
        this.updatePortfolio();
      }
    });

    this.afs.portfolioSecHoldingObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.portfolioDetails = res;
        this.remainingUnits = 0;
        this.portfolioDetails.forEach((elem) => {
          if (elem.CEHD_Stock_Code[0] === this.data.Code) {
            // this.remainingUnits = elem.CEHD_Available_Qty[0] + elem.CEHD_Pending_receive_Qty[0]
            // + elem?.CEHD_PledgedOut_Qty[0] - elem?.CEHD_Pending_pay_Qty[0];
            this.remainingUnits = elem.CEHD_Available_Qty[0];
            this.noBalFlag = true;
          }
        });
      } else {
        this.loadflag = false;
        this.noBalFlag = false;
      }
    });

    this.api.getPledgedAgainstData('SIP_Frequency_Type').subscribe((res) => {
      if (res) {
        this.FrequencyData = res.Get_Configurable_Common_DataResult;
      }
    });

    this.api.getPledgedAgainstData('UTFundMode').subscribe((res) => {
      if (res) {
        this.FundingModeData = [];
        this.FundingModeData = res.Get_Configurable_Common_DataResult;
        this.FundingModeChange(this.FundMode);
        // console.log('this.FundingModeData', this.FundingModeData);
      }
    });
    this.api.getPledgedAgainstData('LombardLoanTenor').subscribe((res) => {
      if (res) {
        this.TenorData = [];
        this.TenorData = res.Get_Configurable_Common_DataResult;
        // this.FundingModeChange(this.FundMode);
        // console.log('this.TenorData', this.TenorData);
      }
    });

    this.afs.getBusinessDate().then((date) => {
      // console.log(date, 'date');
      this.businessDate = date.businessDate;
    });
  }

  clickSIP(ISIN, ccy) {
    try {
      if (ISIN) {
        this.homeApi.RediretToHomeBuySellPledge = 'RMW';
        this.cfs.setSIPFund([{ ISIN: ISIN, Ccy: ccy }]);
        this.router.navigate(['/sip']);
      }
    } catch (error) {}
  }

  updatePortfolio() {
    // if (this.isUserRM) {
    //   this.updateCustomerPortfolioDetails();
    // } else {

    this.ChangeSelectedportfolio();
    // }
    this.UnitsBalance();
  }

  // getPortfolioFromFund() {
  //   this.portfolioList = [];
  //   this.accountList = [];
  //   this.CurrencyList = [];
  //   const temp: any = this.selectedCustomerDetails.filter(obj => {
  //     return obj.SICurrency === this.currency
  //   })

  //   if (temp.length) {
  //     temp.forEach(element => {
  //       this.portfolioList.push(element.PortfolioName)
  //       this.accountList.push(element.AccountNo)
  //       this.CurrencyList.push(this.currency)
  //     });

  //     let portfoliolist = this.portfolioList;
  //     this.portfolioList = portfoliolist.filter((thing, index, self) =>
  //       index === self.findIndex((t) => (
  //         JSON.stringify(t) === JSON.stringify(thing)
  //       ))
  //     );

  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];

  //     // this.portfolio = temp[0].PortfolioName

  //   } else {
  //     this.successMsg = 'Portfolio with selected fund currency is not available. Please select different fund';
  //     this.showSubmit = false;
  //   }
  // }

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
        this.baseCCY
      );
    } else {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
    }
  }

  updateCcy() {
    // console.log('Update ccy: ', this.currency);
    const temp: any = this.selectedCustomerDetails.filter((obj) => {
      return obj.AccountNo === this.Account_Number;
    });
    if (temp.length) {
      temp.forEach((element) => {
        if (this.data.Ccy === element.SICurrency) {
          this.currency = element.SICurrency;
        }
      });
      // this.currency = this.data.Ccy = temp[0].SICurrency;
    }
  }

  // getCustomerDetails(_res) {
  //if (res.length > 0) {
  // this.afs.getmultiPortfolio(this.CustomerName.split('|')[0]);
  //   this.portfolioList = [];
  //   this.selectedCustomerDetails = res;
  //   const map = new Map();
  //   for (const item of res) {
  //     // if (!map.has(item.PortfolioName)) {
  //     map.set(item.PortfolioName, true); // set any value to Map
  //     if (item.SICurrency === this.data.Ccy) {
  //       this.portfolioList.push(item.PortfolioName);
  //       this.accountList.push(item.AccountNo);
  //       this.CurrencyList.push(item.SICurrency);
  //     }
  //     // }
  //   }
  //   let portfoliolist = this.portfolioList;
  //   this.portfolioList = portfoliolist.filter((thing, index, self) =>
  //     index === self.findIndex((t) => (
  //       JSON.stringify(t) === JSON.stringify(thing)
  //     ))
  //   );
  //   if (this.portfolioList.length !== 0) {
  //     this.successMsg = '';
  //     this.portfolio = this.portfolioList[0];
  //     this.Account_Number = this.accountList[0];
  //   }
  //   // this.updateCustomerPortfolioDetails();
  // }
  // }

  selectShare(e) {
    this.showSubmit = true;
    this.successMsg = '';
    try {
      // console.log('fun: selectShare')
      const fund = $('.HoverSuggestion').data('mf');
      // console.log(fund);
      this.notional = 0;
      this.Units = 0;
      // this.successMsg = '';

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
      this.currency = this.data.Ccy;
      // console.log(this.nowname);
      // sessionStorage.setItem('MutualFund_Name', this.data.Name);
      // sessionStorage.setItem('MutualFund_Manager', this.data.Manager);
      // sessionStorage.setItem('MutualFund_Ccy', this.data.Ccy);
      // sessionStorage.setItem('MutualFund_Min_Inv_Amt', this.data.Min_Inv_Amt);
      // sessionStorage.setItem('MutualFund_Rating', this.data.Rating);
      // sessionStorage.setItem('MutualFund_NAV', this.data.BidNAV);
      // sessionStorage.setItem('MutualFund_Sector', this.data.Sector);
      // sessionStorage.setItem('MutualFund_AnnualFees', this.data.AnnualFees);
      // sessionStorage.setItem('MutualFund_Units', this.data.Units);
      // sessionStorage.setItem('MutualFund_TrailerFees', this.data.TrailerFees);
      // sessionStorage.setItem('MutualFund_Code', this.data.Code);
      // sessionStorage.setItem('MutualFund_Ccy', this.data.Ccy);
      // sessionStorage.setItem('MutualFund_notional', this.notional);

      // let CRR = sessionStorage.getItem('CRR');
      // if (this.cfs.isAlphaNumeric(CRR)) {
      //   CRR = CRR.substr(1, CRR.length);
      // }
      // // if (this.cfs.isAlphaNumeric(this.data.Rating)) {
      // //   PRR = this.data.Rating.substr(1, this.data.Rating.length);
      // // }
      // if (CRR < this.data.Rating) {
      //   this.msg = 'Customer Rating is less than product rating ! Please check.';
      // } else {
      //   this.msg = '';
      // }
      // sessionStorage.setItem('MFMessage', this.msg);
      // if (!this.isUserRM) this.PortfolioChange();
      // else {
      //   // this.getPortfolioFromFund();
      // }

      //<!-- Addded by Alolika G | 15-02-2022 -->
      this.afs
        .GetPortfoliosFromCusID(this.CustomerID, this.currency)
        .subscribe((folio) => {
          if (folio) {
            this.portfolioList = folio.DB_GetPortfoliosResult;
            if (this.portfolioList.length > 0) {
              this.successMsg = '';
              this.portfolio = this.portfolioList[0].FacDesc;
              this.portfolioName = this.portfolioList[0].PortfolioName;
            } else {
              this.successMsg =
                'Cash account unavailable for the Fund currency';
            }

            this.getaccounts();
          }
        });
      // this.updatePortfolio();
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
      this.afs.MFList.subscribe((mf) => {
        that.mfList = mf.filter((item) =>
          item.Name.toLowerCase().includes(that.mutualFund.toLowerCase())
        );
        // console.log(that.mfList);
      });
    } catch (error) {
      // console.log("Error:", error);
    }
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
        .getCashbalanceFromAccountNumber(this.data.Ccy, this.Account_Number)
        .subscribe((res) => {
          if (res) {
            this.remainingBalance = res.ExecGenericScalarFunctionResult;
            this.remainingBalance = this.cfs.FormatNumberr(
              this.remainingBalance
            );
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  // cashBalance(currency, nominal) {
  //   try {
  //     this.remainingBalance = '';
  //     this.cashbalance.forEach(element => {
  //       if (currency === element.Currency) {
  //         if (parseFloat(nominal) <= parseFloat(element.Cashbalance)) {
  //           this.balanceFlag = true;
  //           this.remainingBalance = element.Cashbalance;
  //           return;
  //         } else {
  //           this.balanceFlag = false;
  //           this.remainingBalance = element.Cashbalance;
  //         }
  //       }
  //     });

  //   } catch (ex) {
  //     console.log('Error occured while loading Cash balance card :', ex);
  //   }
  // }

  UnitsBalance() {
    this.afs.getCustPortfolioSecurityHoldings(
      this.CustomerID,
      this.portfolio,
      this.baseCCY
    );
  }

  async subscribed(notional: any) {
    try {
      //Added by Alolika G on 7th Feb 2022
      this.orderDetails = [];
      this.orderDetails = {
        custID: this.CustomerID,
        CRR: this.data.Rating,
        commissionValue: this.commissionValue,
        commissionPercentage: this.commissionPercentage,
        commissionReason: this.commissionReason,
        currency: this.data.Ccy,
        custName: this.CustomerName,
        orderType: '',
        direction: this.ApplicationType,
        fundingMode: this.FundMode,
        settlementAmount: this.notional,
        productCode: this.data.Code,
        productref: this.fundNMID,
      };
      this.successMsg = '';
      // this.remainingBalance = this.fnGetCashBalance();
      // this.cashBalance();
      if (parseFloat(this.notional) <= parseFloat(this.fnGetCashBalance())) {
        this.balanceFlag = true;
      } else {
        this.balanceFlag = false;
      }
      if (this.data.BidNAV === 0) {
        this.successMsg = 'NAV is 0. Please select other fund.';
        this.loadflag = false;
      } else if (
        this.FundVal === 'PL' &&
        parseFloat(this.LoanAmt) >= parseFloat(this.notional)
      ) {
        this.successMsg = 'Loan Amount should be less than notional.';
        this.loadflag = false;
      } else if (
        (this.FundVal === 'PL' || this.FundVal === 'TL') &&
        parseFloat(this.fnGetLoanAmt()) >= parseFloat(this.fnGetDrawdown())
      ) {
        //Added by Alolika G on 3rd Feb 2022. Assigned by by Prachi P
        // if(parseFloat(this.fnGetLoanAmt()) >= parseFloat(this.fnGetDrawdown())) {
        this.successMsg =
          'Loan amount cannot be greater than available for drawdown.';
        this.loadflag = false;
        // }
      } else if (
        (this.FundVal === 'PL' || this.FundVal === 'TL') &&
        parseFloat(this.fnGetLoanAmt()) <= 0
      ) {
        this.successMsg = 'Please enter the Loan Amount.';
        this.loadflag = false;
      }
      // else if (isNaN(this.notional) === true) {
      //   this.successMsg = 'Please enter the valid notional.';
      //   this.loadflag = false;
      // }
      else if (this.notional <= 0) {
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (this.notional >= 1000000000) {
        this.successMsg = 'Notional should be less than 1,000,000,000.';
        this.loadflag = false;
      } else if (
        this.Account_Number === '' ||
        this.Account_Number === undefined
      ) {
        this.successMsg = 'No account with required fund currency.';
        this.loadflag = false;
      } else if (this.successMsg === '') {
        // console.log(this.data['Code']);
        if (this.data.Code) {
          this.subscribeFunds = true;

          this.subscribeFlag = true;
          // console.log(this.data['Ccy']);

          if (this.ApplicationType === 'Subscription') {
            if (this.notional < this.data.Min_Inv_Amt) {
              this.successMsg =
                'Notional should be greater than minimum investment.';
              this.loadflag = false;
            } else if (!this.balanceFlag) {
              // if (!this.noBalFlag) {
              //   this.successMsg = 'Insufficient cash balance. Please transfer funds to Account No.: ' + this.Account_Number;
              //   this.loadflag = false;
              // } else {
              //   this.successMsg = 'Insufficient cash balance in this account' + '(Account Number: ' + this.Account_Number + ')';
              //   this.loadflag = false;
              // }
              this.successMsg =
                'Insufficient cash balance in this account' +
                '(Account Number: ' +
                this.Account_Number +
                ')';
              this.loadflag = false;
            } else {
              // this.afs.FundsOrderEntry(notional, this.data.Code, 'Subscription', 'SB', '', '', '00000', '', notional / this.data.BidNAV, this.data.Ccy, this.RM, this.Book, this.CustomerType, this.CustomerName, this.DOB, this.IdentificationType, this.IdentificationNo, this.Nationality, this.Account_Number, this.portfolio, this.username);
              if (this.checkSuitability && this.token !== '') {
                //Added by Alolika G on 7th Feb 2022
                const isSuitabilityValid: boolean =
                  await this.checkOrderSuitability(this.orderDetails);
                console.log(isSuitabilityValid);
                // if (isSuitabilityValid) {
                this.SavefundsOrder(
                  notional,
                  'Subscription',
                  'SB',
                  '',
                  '00000',
                  notional / this.data.BidNAV
                );
                // }
                // else {
                // this.successMsg = 'Suitability checks failed';
                // this.loadflag = false;
                // }
              } else {
                this.SavefundsOrder(
                  notional,
                  'Subscription',
                  'SB',
                  '',
                  '00000',
                  notional / this.data.BidNAV
                );
              }
            }
          } else if (this.ApplicationType === 'Redemption') {
            if (this.fnGetUnits() > this.remainingUnits) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: ' +
                this.cfs.FormatNumberr(parseFloat(this.remainingUnits));
              this.loadflag = false;
            } else if (!this.noBalFlag) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: 0.00';
              this.loadflag = false;
            } else {
              if (this.checkSuitability) {
                //Added by Alolika G on 7th Feb 2022
                const isSuitabilityValid: boolean =
                  await this.checkOrderSuitability(this.orderDetails);
                console.log(isSuitabilityValid);

                // if (isSuitabilityValid) {
                this.SavefundsOrder(
                  notional,
                  'Redeemption',
                  'RD',
                  'SRS',
                  this.fnGetUnits(),
                  this.fnGetUnits()
                );
                // }
                // else {
                //   this.successMsg = 'Suitability checks failed';
                //   this.loadflag = false;
                // }
              } else {
                this.SavefundsOrder(
                  notional,
                  'Redeemption',
                  'RD',
                  'SRS',
                  this.fnGetUnits(),
                  this.fnGetUnits()
                );
              }
            }
            // this.afs.GetHoldingsDetailsForRedeem(this.CustomerID, this.data.Code);
          } else if (this.ApplicationType === 'SIP') {
            this.saveSIPOrder();
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
      this.LoanAmt = 0;
      this.Drawdown = '0';
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  unitCalculations(nominal, nav) {
    try {
      nav !== 0 ? (this.Units = nominal / nav) : (this.Units = 0);
      this.Units = this.Units.toFixed(2);
      this.validation = '';
      this.note_Master_Id = '';
      this.Units = this.cfs.FormatNumberr(this.Units);
      this.successMsg = '';
      if (this.FundVal === 'TL') {
        this.LoanAmt = this.cfs.FormatNumberr(this.notional);
        this.getAvailableDrawdown();
      } else if (this.FundVal === 'PL') {
        this.LoanAmt = 0;
        // this.LoanAmt = this.cfs.FormatNumberr(this.notional);
        this.getAvailableDrawdown();
      }
      // this.cashBalance(this.data.Ccy, nominal);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  check() {
    let ClientContribution: any = '';
    let bankContribution: any = '';
    if (this.FundVal === 'TL') {
    } else if (this.FundVal === 'PL') {
      bankContribution = this.notional;
      ClientContribution =
        parseFloat(bankContribution) - parseFloat(this.fnGetLoanAmt());
    } else {
      bankContribution = '';
      ClientContribution = '';
    }
    console.log(
      'bankContribution: ',
      bankContribution,
      'ClientContribution:',
      ClientContribution
    );
  }
  fnGetUnits() {
    return this.Units.replace(/,/g, '');
  }
  fnGetCashBalance() {
    return this.remainingBalance.replace(/,/g, '');
  }
  fnGetLoanAmt() {
    return this.LoanAmt.replace(/,/g, '');
  }
  fnGetDrawdown() {
    return this.Drawdown.replace(/,/g, '');
  }

  selectShare1(_e) {
    try {
      const fund = $('.HoverSuggestion').data('mf');
      this.selectShare(fund);
      // this.successMsg = '';
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
    } else if (this.ApplicationType === 'SIP') {
      // this.afs.GetMaturityDateForTenor(this.startDate, '1M',  this.data['Ccy']).subscribe(res=>{
      //   if(res){
      //     // console.log(res);
      //     this.lastDate = res.GetMaturityDateForTenorResult;
      //   }
      // })
    }
    this.updatePortfolio();
  }

  //Added by AlolikaG on 1st Feb 2022.
  FundingModeChange(Event) {
    // this.successMsg = '';
    this.FundMode = Event;
    this.FundingModeData.forEach((element) => {
      if (element.DATA_VALUE === this.FundMode) {
        this.FundVal = element.Misc1;
      }
    });
    if (this.FundVal === 'TL') {
      this.getAvailableDrawdown();
      this.LoanAmt = this.cfs.FormatNumberr(this.notional);
    } else if (this.FundVal === 'PL') {
      // this.LoanAmt = this.cfs.FormatNumberr(this.notional);

      this.getAvailableDrawdown();
      this.LoanAmt = '0.00';
    }
    console.log('this.data ', this.data);
  }

  getAvailableDrawdown() {
    try {
      this.afs
        .getMFDrawdown(
          this.CustomerID,
          this.fnGetUnits(),
          this.data.BidNAV,
          this.data.LTV,
          ''
        )
        .subscribe((res) => {
          if (res) {
            this.Drawdown = res.ExecGenericTableValuedFunctionResult[0].Param1;
            this.Drawdown = this.cfs.FormatNumberr(this.Drawdown);
          }
        });
    } catch (error) {}
  }

  calculateNotional(nav) {
    nav !== 0 ? (this.notional = this.Units * nav) : (this.notional = 0);
    this.notional = this.notional.toFixed(2);
    this.validation = '';
    this.notional = this.cfs.FormatNumberr(this.notional);
    this.successMsg = '';
    // this.UnitsBalance();
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
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
    // console.log(e);
    this.successMsg = '';
    this.CustomerName = e.CustomerName;
    this.SelectedCustomerName = e.CustomerName; //Added by Mayuri D | 14-02-2022
    this.CustomerID = e.CustomerID;
    this.CIF = e.CIF;
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
          this.getaccounts();
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
  }
  SavefundsOrder(
    notional,
    transectionType,
    applicationType,
    ModeofSettlement,
    switchUnits,
    RealizedAmountUnits
  ) {
    const today = new Date();
    let CustomerID = '';
    let orderbasis = transectionType === 'Subscription' ? 'Amount' : 'Units';
    const OrderPlacementTime =
      (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
      '-' +
      (today.getMonth() + 1 < 10
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      '-' +
      today.getFullYear() +
      ' ' +
      (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
      ':' +
      (today.getMinutes() < 10
        ? '0' + today.getMinutes()
        : today.getMinutes()) +
      ':' +
      '00';
    let CIF = '';
    this.isUserRM
      ? (CustomerID = this.CustomerID)
      : (CustomerID = this.username);
    this.isUserRM ? (CIF = this.CIF) : (CIF = this.homeApi.CIF);

    // Added by Mayuri D | 07-Feb-2022 ...START...
    if (this.isUserRM) {
      this.CustomerID = this.SelectedCustomerName.split('|')[1];
      CustomerID = this.CustomerID;
    } else {
    }
    // Added by Mayuri D | 07-Feb-2022 ...END...

    if (notional.includes(',')) {
      //Added by AlolikaG on 4th Feb 2022. Assigned by Parikshit K.
      notional = notional.replace(/,/g, '');
    }

    let ClientContribution: any = '';
    let bankContribution: any = '';
    if (this.FundVal === 'TL') {
      bankContribution = notional;
      ClientContribution = '0.00';
    } else if (this.FundVal === 'PL') {
      bankContribution = this.fnGetLoanAmt();
      ClientContribution =
        parseFloat(notional) - parseFloat(this.fnGetLoanAmt());
    } else {
      bankContribution = '0.00';
      ClientContribution = notional;
    }
    console.log(ClientContribution);

    // console.log("Customer ID insubscribed", this.CustomerID); // Added by Mayuri D | 07-Feb-2022
    CustomerID = this.CustomerID; // Added by Mayuri D | 07-Feb-2022
    // console.log("Customer ID insubscribed after aa", this.CustomerID , CustomerID);  // Added by Mayuri D | 07-Feb-2022

    this.OrderParamsXML = '';
    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';
    this.OrderParamsXML = this.OrderParamsXML + '<RecordType>D</RecordType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Product</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationReferenceNumber>PIB' +
        this.afs.getNewApplicationIDForMF(CustomerID) +
        '</ApplicationReferenceNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationType>' + applicationType + '</ApplicationType>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<SourceofOrigin>PIB</SourceofOrigin>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonOfficerCodeTeam>AB82</SalespersonOfficerCodeTeam>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<UTSalespersonCode>1234</UTSalespersonCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DomicileBranchCode>AB33</DomicileBranchCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DomicileBankCode>30</DomicileBankCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<EffectingBranchCode>' + '' + '</EffectingBranchCode>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<EffectingBankCode>30</EffectingBankCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<Bank>UOB</Bank>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ReferrorEmployeeName>ABCD Name1</ReferrorEmployeeName>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ReferrorEmployeeID>AB7887997</ReferrorEmployeeID>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ExternalReferrorName>' + this.portfolio + '</ExternalReferrorName>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ExternalReferrorID>76879678</ExternalReferrorID>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExternalReferrorIDType>PP</ExternalReferrorIDType>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExternalReferrorIDCountry>SG</ExternalReferrorIDCountry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ReferrorFlag>Y</ReferrorFlag>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SubmittedDateTime>03-07-2015 05:14:06</SubmittedDateTime>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RcRpIndicator>E</RcRpIndicator>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<SalespersonEmployeeID>' + this.RMName + '</SalespersonEmployeeID>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonName1LastName>NAME 1345</SalespersonName1LastName>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonName2MidName>NAME 2322425</SalespersonName2MidName>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<CIFNumber>' + CIF + '</CIFNumber>');
    this.OrderParamsXML = this.OrderParamsXML + '<Salutation>MR</Salutation>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicantName1>' + this.CustomerName + '</ApplicantName1>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApplicantName2>NAME 31</ApplicantName2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDInformation>ID12</IDInformation>';
    this.OrderParamsXML = this.OrderParamsXML + '<IDTypeCode>PP</IDTypeCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDCountryCode>SG</IDCountryCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneWork>6532123232</PhoneWork>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneHome>6532123232</PhoneHome>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneMobile>9865321245</PhoneMobile>';
    this.OrderParamsXML = this.OrderParamsXML + '<Email>test@email.com</Email>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DateOfBirth>03-07-2015</DateOfBirth>';
    this.OrderParamsXML = this.OrderParamsXML + '<Age>27</Age>';
    this.OrderParamsXML = this.OrderParamsXML + '<Gender>male</Gender>';
    this.OrderParamsXML = this.OrderParamsXML + '<Race>abc</Race>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<MaritalStatus>M</MaritalStatus>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CountryofCitizenshipCode>SG</CountryofCitizenshipCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CountryofResidenshipCode>SG</CountryofResidenshipCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PermanentResidentFlg>SG</PermanentResidentFlg>';
    this.OrderParamsXML = this.OrderParamsXML + '<CDPNo>1234</CDPNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<CPFNo>3216</CPFNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<TaxStatus>P</TaxStatus>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<OtherIdentification>ID13</OtherIdentification>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<EmployerName>NAME E3</EmployerName>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<TypeofBusiness>B1</TypeofBusiness>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<JobDesignation>SSC</JobDesignation>';
    this.OrderParamsXML = this.OrderParamsXML + '<Position>ABC</Position>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<EmployeeFlag>Y</EmployeeFlag>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApplicantType>ABC</ApplicantType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CareOfName>NAME78789</CareOfName>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressSeqNum>1313131</AddressSeqNum>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressType>ABCD</AddressType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressFormat>ABCD1</AddressFormat>';
    this.OrderParamsXML = this.OrderParamsXML + '<Block>4</Block>';
    this.OrderParamsXML = this.OrderParamsXML + '<Street>6</Street>';
    this.OrderParamsXML = this.OrderParamsXML + '<Storey>8</Storey>';
    this.OrderParamsXML = this.OrderParamsXML + '<Unit>10</Unit>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<BuildingName>B3</BuildingName>';
    this.OrderParamsXML = this.OrderParamsXML + '<POBox>3648</POBox>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PostalCode>36486</PostalCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<City>SG</City>';
    this.OrderParamsXML = this.OrderParamsXML + '<Country>SG</Country>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine1>LINE1</AddressLine1>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine2>LINE2</AddressLine2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine3>LINE3</AddressLine3>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine4>LINE4</AddressLine4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Segment>PB</Segment>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CustomerRiskScoreRc>3</CustomerRiskScoreRc>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RiskReviewDate>12-05-2018</RiskReviewDate>';
    this.OrderParamsXML = this.OrderParamsXML + '<RiskSource>ABCD</RiskSource>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcId>ABCD</RcId>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcIdType>XY</RcIdType>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcIdCountry>SG</RcIdCountry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDExpiryDate>30-07-2019</IDExpiryDate>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CountryofBirthCode>SG</CountryofBirthCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN1>4646</TIN1>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country1Code>SG</Country1Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN2>46466</TIN2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country2Code>SG</Country2Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason1>4647</Reason1>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason2>4646</Reason2>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN3>4646</TIN3>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country3Code>SG</Country3Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason3>77546</Reason3>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN4>4646</TIN4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Country4>SG</Country4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason4>5353</Reason4>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<FundCode>' + this.data.Code + '</FundCode>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ProductRiskScoreRp>01</ProductRiskScoreRp>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<CurrencyDenominated>' + this.data.Ccy + '</CurrencyDenominated>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TradeDate>' +
        +(today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        today.getFullYear() +
        '</TradeDate>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TransactionType>' + applicationType + '</TransactionType>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<FINorWPNo>13411111</FINorWPNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<Discount>12</Discount>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExistingSubscriberofFund>01</ExistingSubscriberofFund>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<AccountNumber>' + this.Account_Number + '</AccountNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<SigningCondition>C1</SigningCondition>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ModeofPayment>SA</ModeofPayment>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PurchaseAmount>' + notional + '</PurchaseAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<DividendInstruction>AB</DividendInstruction>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RegularSavingsMode>CA</RegularSavingsMode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<NumberofMthsorQtrs>1</NumberofMthsorQtrs>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RegularInvestment>10</RegularInvestment>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DepositAmount>10000</DepositAmount>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchFrom>' + '' + '</SwitchFrom>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchTo>' + '' + '</SwitchTo>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchUnits>' + switchUnits + '</SwitchUnits>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ModeofSettlement>' + ModeofSettlement + '</ModeofSettlement>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<RealizedAmountUnits>' +
        RealizedAmountUnits +
        '</RealizedAmountUnits>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<AccountPaymentType>Cash</AccountPaymentType>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<UOBCreditCardNumber>54654789</UOBCreditCardNumber>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<UOBCreditCardExpiry>30-08-2026</UOBCreditCardExpiry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApprovalCode>ghjhg</ApprovalCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ChequeNumber>100000111</ChequeNumber>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<UOBDebitingACNo>1110001</UOBDebitingACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<TelegraphicTransfertoFundManagerACNo>546545</TelegraphicTransfertoFundManagerACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CPFApprovedBank>uob</CPFApprovedBank>';
    this.OrderParamsXML = this.OrderParamsXML + '<CPFACNo>10000003</CPFACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CPFInvestmentACNo>30000001</CPFInvestmentACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CompletedStandingInstructionFormPreviously>33</CompletedStandingInstructionFormPreviously>';
    this.OrderParamsXML = this.OrderParamsXML + '<SRSOperator>BA</SRSOperator>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SRSACNo>30101111131</SRSACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CreditingACNo>80000002</CreditingACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACNoForDividend>80003002</CreditingACNoForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACName1ForDividend>NAME1</CreditingACName1ForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACName2ForDividend>NAME2</CreditingACName2ForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACCurrencyForDividend>SGD</CreditingACCurrencyForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CampaignCode>13</CampaignCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SystemCampaignCode>cd</SystemCampaignCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<EarlyMaturityProceedsInstruction>Instruction 1</EarlyMaturityProceedsInstruction>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACNoMaturity>21345</CreditingACNoMaturity>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<AccountType>' + 'CA' + '</AccountType>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<tofundccy>' + '' + '</tofundccy>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<ToFundNav>' + '' + '</ToFundNav>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SalesCharge>' + '0.00' + '</SalesCharge>');
    this.OrderParamsXML = this.OrderParamsXML + ('<LTVNo>' + '' + '</LTVNo>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<LTVOverride>' + 'N' + '</LTVOverride>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Load_Fee>' + '0.00' + '</Load_Fee>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<ExitLoadFee>' + '0.00' + '</ExitLoadFee>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<EntryLoadFee>' + '0.00' + '</EntryLoadFee>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<SameFundHouseFlag>' + '' + '</SameFundHouseFlag>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<FundMode>' + this.FundMode + '</FundMode>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<OrderConfirmationRemark>' + '' + '</OrderConfirmationRemark>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Time>' + OrderPlacementTime + '</Time>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PlaceEmailExtensionNo>' + '' + '</PlaceEmailExtensionNo>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<OrderPlacementMode>' + 'In-Person' + '</OrderPlacementMode>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FreezeAmount>' + ClientContribution + '</FreezeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<OrderBasis>' + orderbasis + '</OrderBasis>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<LTV>' + this.data.LTV + '</LTV>');
    this.OrderParamsXML = this.OrderParamsXML + ('<VAT>' + '0.00' + '</VAT>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<VATAmount>' + '0.00' + '</VATAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ChargesApplicability>' + 'Inclusive' + '</ChargesApplicability>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PreapprovedFeeWaiver>' + true + '</PreapprovedFeeWaiver>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PresignedDisclaimer>' + true + '</PresignedDisclaimer>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SuitabilityRef>' + '' + '</SuitabilityRef>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<AvailableForDrawdown>' +
        this.fnGetDrawdown() +
        '</AvailableForDrawdown>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchingId>' + '' + '</SwitchingId>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Client_Contribution>' + ClientContribution + '</Client_Contribution>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Bank_Contribution>' + bankContribution + '</Bank_Contribution>');

    //  Added by Alolika G on 2nd Feb 2022. Params shared by Prachi P. --START
    if (this.FundVal === 'TL' || this.FundVal === 'PL') {
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<LoanCurrency>' + this.data.Ccy + '</LoanCurrency>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanTenor>' + this.LoanTenor + '</LoanTenor>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<LoanRequestSpecialRateYN>' + 'N' + '</LoanRequestSpecialRateYN>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<LoanIntRateBenchmark>' + 'LIBOR' + '</LoanIntRateBenchmark>');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<LoanInterestRate>' + '1.75' + '</LoanInterestRate>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanRolloverYN>' + 'N' + '</LoanRolloverYN>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanFeeYN>' + 'N' + '</LoanFeeYN>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanFeeMethod>' + 'PCT' + '</LoanFeeMethod>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanFeePerc>' + '0' + '</LoanFeePerc>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanFeeAmount>' + '0' + '</LoanFeeAmount>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanFeeVAT>' + '0' + '</LoanFeeVAT>');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<FXRateInd >' + '1' + '</FXRateInd >');
      this.OrderParamsXML =
        this.OrderParamsXML + ('<FXRateInd >' + '1' + '</FXRateInd >');
      this.OrderParamsXML =
        this.OrderParamsXML +
        ('<LoanAmountActual >' + bankContribution + '</LoanAmountActual >'); //Added by Alolika G on 3rd Feb 2022. Assigned by by Prachi P
    }
    //  Added by Alolika G on 2nd Feb 2022. Params shared by Prachi P. --END

    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';
    this.api.saveNewOrder(
      this.OrderParamsXML,
      this.username,
      'funds_trade_setup',
      'MutualFundSave',
      0
    );
  }

  saveSIPOrder() {
    this.OrderParamsXML = '';
    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';

    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<CIF_Number>' + this.homeApi.CIF + '</CIF_Number>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Dynamic</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Facility_Type>' + this.portfolio + '</Facility_Type>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<RMID>' + this.CustomerID + '</RMID>');

    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Settlement_Ccy>' + this.data.Ccy + '</Settlement_Ccy>');
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
      this.OrderParamsXML + ('<RISAmount>' + this.notional + '</RISAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Frequency>' + this.Frequency + '</Frequency>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<NoofFixings>' + this.Installments + '</NoofFixings>');
    this.OrderParamsXML = this.OrderParamsXML + '<Dummy_Tenor>1M</Dummy_Tenor>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<RIS_Subscription_Date>' + this.startDate + '</RIS_Subscription_Date>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Maturity_Date>' + this.lastDate + '</Maturity_Date>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<Fees_Mode>Exclusive</Fees_Mode>';
    // this.OrderParamsXML = this.OrderParamsXML + ("<Sales_Charge>" + CDbl(txtSalesCharge.Text) + "</Sales_Charge>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<SalesChargeAmount>" + CDbl(txtSalesChargeAmount.Text) + "</SalesChargeAmount>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<VATPerc>" + CDbl(txtVAT.Text) + "</VATPerc>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<VATAmount>" + CDbl(txtVATAmount.Text) + "</VATAmount>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<RIS_Fees>" + ddlFees.SelectedValue + "</RIS_Fees>")

    this.OrderParamsXML =
      this.OrderParamsXML + '<No_of_underlyings>1</No_of_underlyings>';
    //  this.OrderParamsXML = this.OrderParamsXML + ("<OrderPlacementMode>" & ddlPlacementMode.SelectedItem.Text & "</OrderPlacementMode>")
    this.OrderParamsXML =
      this.OrderParamsXML + '<FundingMode>Fully Funded</FundingMode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ClientContribution>' + this.notional + '</ClientContribution>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FreezeAmount>' + this.notional + '</FreezeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TotalProceeds>' + this.notional + '</TotalProceeds>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ContactedNumber>' + this.Contact_Number + '</ContactedNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<UnregisteredYN>N</UnregisteredYN>';
    let d = new Date();
    this.OrderParamsXML =
      this.OrderParamsXML + ('<OrderTime>' + d + '</OrderTime>');
    //this.OrderParamsXML = this.OrderParamsXML + ("<ExtensionEmailPlace>" & txtPlaceNumberEmail.Text & "</ExtensionEmailPlace>")
    this.OrderParamsXML = this.OrderParamsXML + '<Remarks>test</Remarks>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SuitabilityTokenCount>0</SuitabilityTokenCount>';

    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FundName1>' + this.data['Name'] + '</FundName1>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FundCode1>' + this.data['Code'] + '</FundCode1>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<Contribution_Perc1>100</Contribution_Perc1>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Inv_Amount1>' + this.notional + '</Inv_Amount1>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<NAV1>' + this.data['BidNAV'] + '</NAV1>');

    //need to confirm
    // this.OrderParamsXML = this.OrderParamsXML + ("<FundName1/>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<FundCode1/>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<Inv_Amount1/>")
    // this.OrderParamsXML = this.OrderParamsXML + ("<NAV1/>")

    // If ddlFundMode.SelectedValue <> "FF" Then
    //     this.OrderParamsXML = this.OrderParamsXML + ("<Bank_Contribution>" & CDbl(txtBankContribution.Text) & "</Bank_Contribution>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanCurrency>" & ddlLoanCcy.SelectedValue & "</LoanCurrency>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanTenor>" & ddlLoanTenor.SelectedValue & "</LoanTenor>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanRequestSpecialRateYN>" & If(chkSpecialRate.Checked, "Y", "N") & "</LoanRequestSpecialRateYN>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanIntRateBenchmark>" & hdnIntRateBenchmark.Value & "</LoanIntRateBenchmark>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanInterestRate>" & CDbl(txtIntRate.Text) & "</LoanInterestRate>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanRolloverYN>" & ddlLoanRollover.SelectedValue & "</LoanRolloverYN>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanFeeYN>" & If(chkLoanProcessingFee.Checked, "Y", "N") & "</LoanFeeYN>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanFeeMethod>" & ddlLoanProcessingMethod.SelectedValue & "</LoanFeeMethod>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanFeePerc>" & CDbl(txtLPPerc.Text) & "</LoanFeePerc>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanFeeAmount>" & CDbl(txtLPAmount.Text) & "</LoanFeeAmount>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<LoanFeeVAT>" & CDbl(txtLPVAT.Text) & "</LoanFeeVAT>")
    //     this.OrderParamsXML = this.OrderParamsXML + ("<FXRateInd >" & CDbl(txtLPVAT.Text) & "</FXRateInd >")
    // End If

    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';

    this.api.saveNewOrder(
      this.OrderParamsXML,
      this.username,
      'RIS_Setup',
      'INSERT',
      1
    );
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
  // Added by Rohit T. | 03-Feb-2021
  openSuitablityPopup() {
    // console.log(this.noteMasterId)
    // console.log(this.auth.UserName)
    // console.log(this.auth.EntityID)
    this.sut_notemaster = this.note_Master_Id;
    console.log(this.note_Master_Id);
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
      // order.CRR = 'R3';
      const res = await this.afs.checkSuitability(order);
      console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      this.NMID_Suitability = res.NMID;
      this.token = res.SUITABILITY_TOKEN_COUNT;
      this.note_Master_Id = this.NMID_Suitability;
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
    } catch (error) {}
  }
}
