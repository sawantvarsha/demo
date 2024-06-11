import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

export interface status {
  orderid: string;
  msg: string;
  ISIN: string;
}

@Component({
  selector: 'app-place-orders',
  templateUrl: './place-orders.component.html',
  styleUrls: ['./place-orders.component.scss'],
})
export class PlaceOrdersComponent implements OnInit, OnDestroy {
  sub = new Subject();
  subf: boolean = false;
  sharelistSub = new Subject();
  sharelistSubf: boolean = false;
  selectedAssetSub = new Subject();
  selectedAssetSubf: boolean = false;

  @Input() OrderPlacementDetails: any[];
  @Input() Index: number;
  NMID: any;

  // @Input() get noteMasterId() {
  //   return this.NMID;
  // }
  // set noteMasterId(noteMasterId) {
  //   this.NMID = noteMasterId;
  // }

  ProposalRows: any;
  ProposalId: any;
  TokenID: any;
  ProposalName: any;
  showOrderPlacement = true;
  StoredProcedureName: any;
  ParamList: any;
  SecuritiesList: any;
  securityListObj: any;
  securityListArray: any = [];
  StoredProcedureName1: string;
  ParamList1: (
    | { Param1: string; Param2?: undefined }
    | { Param1: string; Param2: string }
  )[];
  customerID: string;
  PortfoliosDropdown: any = [];
  StoredProcedureName2: string;
  accountNoDropdown: any = [];
  portfolios: any;
  selectedPortfolio: any;
  accountResult: any;
  tradeDate: any;
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
  expiryDate: string;
  spread: any = 2;
  OrderType = 'Market';
  TimeInForce = 'DAY';
  NoteMasterID: string;
  RMName: string = '';
  NetAmt: any;
  OrderQty: any;
  Price: any;
  portfolioMapping: any = [];
  allAccountNo: any = [];
  AccountNoMapping: any = [];
  shareDetailsBS: any;
  details: any;
  sharelistBS: any;
  successMsg: string;
  loadflag: boolean;
  shareList: any;
  showShareDetails: boolean;
  SettlementType: any;
  optiontype: string;
  SettAmt: any;
  LimitPrice: number;
  side: string;
  accountList: any[];
  Account_Number: any;
  CustomerName: any;
  showPlaceOrderPopup: boolean = false;
  showOrderEntry: boolean;
  Product: string;
  mfList: any[];
  orderDetails: any;
  LoginID: any;
  isUserRM: any;
  QuantityType: any;
  username: any;
  checkSuitability: boolean = false;
  YTP: any;
  YTConv: any;
  YTC: any;
  MarketDirtyPrice: any;
  MarketCleanPrice: any;
  CustCleanPrice: any;
  CustDirtyPrice: any;
  selectedBond: any;
  portfolio: any;
  BankPNL: any;
  Proceeds: any;
  YTM: any;
  CleanPrice: any;
  DirtyPrice: any;
  ClientPrice: any;
  settlementType: any;
  settlementDate: any;
  AccInt: any;
  nominal: any;
  noBalFlag: any;
  remainingBalance: any;
  userType: string;
  CRR: string;
  bondMsg: string;
  selectedAssetBS: Subscription;
  FlagForBond: string = '';
  ProductNameParameter: any = '';
  ISIN: any;
  bondsList: any;
  msg: string;
  selectedBIndex: number;
  showSuggestions: boolean;
  portfolioList: any[];
  balanceFlag: boolean;
  CashBalance: any;
  commissionValue: any = '';
  commissionPercentage: any = '';
  commissionReason: any = '';
  FundMode: any = 'Fully Funded';
  NMID_Suitability: any;
  token: any;
  securityResult: any;
  placeorderFlag: boolean;
  baseCCY: string;
  securityIndex: any;
  rmwdata: any[];
  length: any;
  showFactsheet: any;
  templateID: any;
  RMWDataSubscription: any;
  ProductName: string;
  facilityCode: any;
  shareNMID: any;
  OID: any;
  bankcontribution: any;
  fundingtype: any;
  loanT: any;
  Exchange: any;
  search: string;
  LoanTenor: any;
  OrderID: any;
  orderflag: boolean;
  mutualFund = '';
  data: any;
  nowname: any;
  ApplicationType: any;
  FundVal: string;
  LoanAmt: any = 0;
  subscribeFunds: boolean;
  subscribeFlag: boolean;
  Units: any;
  Drawdown: any;
  remainingUnits: any;
  validation: string;
  OrderParamsXML: string = '';
  CIF: string;
  orderTime: string;
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
  hours1: any;
  min1: any;
  ampm: any;
  loadflag2: boolean;
  loadflag1: boolean;
  SaveCustomerDetailsSubscriber: Subscription;
  portfolioDetails: any[] = [];
  PRR: number;
  InterbankaskPrice: any;
  InterbankbidPrice: any;
  showBondDetails: boolean;
  bondDetails: Subscription;
  bondlist: Subscription;
  bondName: any;
  AccDays: any;
  AccVal: any;
  bondRemark: any;
  TargetInterbankPrice: any;
  settval: string;
  CurrentYield: any;
  bondCalculations: Subscription;
  bondsubscribe: Subscription;
  status: any;
  statusArray: any[] = [];
  Summaryflag: boolean;
  securityData: any;
  mflistSubscription: Subscription;
  orderInterval: any;
  eqSubscription: Subscription;
  getAccSubscription: Subscription;
  portSecHolSubcription: Subscription;
  getAccountDetSubscription: Subscription;
  selectedAssetObserverSub: Subscription;
  portfolioName: any;
  SecurityCode: any;
  bondNMID: any;
  getCashBalSubsription: any;

  constructor(
    private afs: CustomerApiService,
    private workflowApi: WorkflowApiService,
    public homeApi: HomeApiService,
    public authorApi: AuthService,
    public commonApi: CommonApiService
  ) {}

  ngOnDestroy() {
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();

    if (this.bondlist !== null || this.bondlist !== undefined) {
      this.bondlist.unsubscribe();
      this.bondlist = null;
    }
    if (this.bondDetails !== null || this.bondDetails !== undefined) {
      this.bondDetails.unsubscribe();
      this.bondDetails = null;
    }
    if (this.sharelistBS !== null || this.sharelistBS !== undefined) {
      this.sharelistBS.unsubscribe();
      this.sharelistBS = null;
    }
    if (this.shareDetailsBS !== null || this.shareDetailsBS !== undefined) {
      this.shareDetailsBS.unsubscribe();
      this.shareDetailsBS = null;
    }
    if (this.bondCalculations !== null || this.bondCalculations !== undefined) {
      this.bondCalculations.unsubscribe();
      this.bondCalculations = null;
    }
    if (this.bondsubscribe !== null || this.bondsubscribe !== undefined) {
      this.bondsubscribe.unsubscribe();
      this.bondsubscribe = null;
    }
    if (
      this.SaveCustomerDetailsSubscriber !== null ||
      this.SaveCustomerDetailsSubscriber !== undefined
    ) {
      this.SaveCustomerDetailsSubscriber.unsubscribe();
      this.SaveCustomerDetailsSubscriber = null;
    }
    if (
      this.mflistSubscription !== null ||
      this.mflistSubscription !== undefined
    ) {
      this.mflistSubscription.unsubscribe();
      this.mflistSubscription = null;
    }
    if (this.selectedAssetBS !== null || this.selectedAssetBS !== undefined) {
      this.selectedAssetBS.unsubscribe();
      this.selectedAssetBS = null;
    }
    if (this.eqSubscription !== null || this.eqSubscription !== undefined) {
      this.eqSubscription.unsubscribe();
      this.eqSubscription = null;
    }
    if (
      this.getAccSubscription !== null ||
      this.getAccSubscription !== undefined
    ) {
      this.getAccSubscription.unsubscribe();
      this.getAccSubscription = null;
    }
    if (
      this.portSecHolSubcription !== null ||
      this.portSecHolSubcription !== undefined
    ) {
      this.portSecHolSubcription.unsubscribe();
      this.portSecHolSubcription = null;
    }
    if (
      this.getAccountDetSubscription !== null ||
      this.getAccountDetSubscription !== undefined
    ) {
      this.getAccountDetSubscription.unsubscribe();
      this.getAccountDetSubscription = null;
    }
    if (
      this.getCashBalSubsription !== null ||
      this.getCashBalSubsription !== undefined
    ) {
      this.getCashBalSubsription.unsubscribe();
      this.getCashBalSubsription = null;
    }
  }

  ngOnInit(): void {
    this.baseCCY = sessionStorage.getItem('BankBaseCcy');

    this.statusArray = [];
    this.CustomerName = this.homeApi.CustomerName;
    this.FlagForBond = sessionStorage.getItem('BondPorfolioDetails');

    this.ProposalRows = this.OrderPlacementDetails;
    console.log(this.ProposalRows, 'Proposal Rows', this.Index);
    this.userType = sessionStorage.getItem('UserType');

    this.TokenID = this.ProposalRows[this.Index].Token_x0020_Id[0];
    this.ProposalName = this.ProposalRows[this.Index].Event[0];
    this.ProposalId = this.ProposalRows[this.Index].Ref_x0020_No[0];
    this.customerID = sessionStorage.getItem('CustomerID');
    this.LoginID = sessionStorage.getItem('Username');

    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.customerID = this.homeApi.CustomerId;
      this.CustomerName = this.homeApi.CustomerName;
    } else {
      this.RMName = this.LoginID;
    }

    if (!this.isUserRM) {
      this.workflowApi.getbondslist(this.LoginID, '', this.authorApi.EntityID);
    }
    this.username = sessionStorage.getItem('Username');
    this.CRR = sessionStorage.getItem('CRR');
    this.successMsg = '';
    this.bondMsg = '';
    this.details = [];
    this.afs.fngetCustAccountDetails(this.username);
    this.workflowApi.getConfigValue(
      this.authorApi.EntityID,
      'BidAskSpread_BPS_YesNo'
    );

    this.getAccountDetSubscription = this.afs.getCustAccountDetails.subscribe(
      (res) => {
        if (res.length !== 0) {
          this.RMName = res.RM;

          if (this.isUserRM) {
            this.RMName = this.LoginID;
          }

          console.log('RM NAme', this.RMName);
        } else {
          console.log('NO DATA');
        }
      }
    );

    // if (
    //   this.FlagForBond === 'FromDynamicForm' ||
    //   this.FlagForBond === 'FromBondDetails' || this.FlagForBond === 'FromRebalOrder'
    // ) {
    //   if (
    //     !['', null, undefined].includes(this.ISIN) &&
    //     !['', null, undefined].includes( this.ProductName)
    //   ) {
    //     if (!['', null, undefined].includes(this.ProductName)) {
    //       this.ProductNameParameter = this.ProductName;
    //     } else if (!['', null, undefined].includes(this.ProductName)) {
    //       this.ProductNameParameter = this.ProductName;
    //     }

    //   }
    // }

    // for getting all the securities in the generated portfolio.
    this.StoredProcedureName = 'USP_GetProposalDetails';
    this.ParamList = [
      {
        Param1: 'FINIQ_COMMON',
      },
      {
        Param1: '@proposalID',
        Param2: this.ProposalId,
      },
      {
        Param1: '@proposalName',
        Param2: this.ProposalName,
      },
      {
        Param1: '@tokenID',
        Param2: this.TokenID,
      },
    ];
    this.FillRows();

    (this.StoredProcedureName1 = 'USP_GetCustPortfolios'),
      (this.ParamList1 = [
        {
          Param1: 'FINIQ_COMMON',
        },
        {
          Param1: '@CustomerID',
          Param2: this.customerID,
        },
        {
          Param1: '@tokenID',
          Param2: '',
        },
        {
          Param1: '@ProposalID',
          Param2: this.ProposalId,
        },
      ]);
    this.fillPortfolios(this.StoredProcedureName1, this.ParamList1);
    this.StoredProcedureName2 = 'USP_CustAccountNO';
  } //End of ngOnInit

  FillRows() {
    this.afs
      .getPlaceOrderSecurities(this.StoredProcedureName, this.ParamList)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.securityResult = res.ExecGenericStoredProcedureResult;

          console.log(
            this.securityResult,
            'Length: ',
            Object.keys(this.securityResult).length
          );

          for (let i = 0; i < Object.keys(this.securityResult).length; i++) {
            this.securityListObj = {
              Action: this.securityResult[i].GenericResponse[0].Value,
              ISIN: this.securityResult[i].GenericResponse[14].Value,
              SecurityCode: this.securityResult[i].GenericResponse[7].Value,
              Security: this.securityResult[i].GenericResponse[5].Value,
              Currency: this.securityResult[i].GenericResponse[2].Value,
              Nominal: this.securityResult[i].GenericResponse[6].Value,
              Ordertype: '',
              LimitPrice: '',
              Portfolio: '',
              PortfolioDesc: '',
              AccountNo: '',
              AccountNo_dd: [],
              AssetType: this.securityResult[i].GenericResponse[1].Value,
              statusMsg: [],
            };
            console.log(this.securityListObj);
            this.securityListArray.push(this.securityListObj);
          }
          console.log('this.securityListArray', this.securityListArray);

          for (let i = 0; i < this.securityListArray.length; i++) {
            if (this.securityListArray[i].AssetType === 'Fixed Income') {
              this.NMID = this.securityResult[i].GenericResponse[12].Value;
              this.workflowApi.getbonddetails(
                this.NMID,
                this.authorApi.EntityID,
                this.LoginID
              );
              this.bondDetails = this.workflowApi.bondDetailsObserver.subscribe(
                (b: any) => {
                  if (b) {
                    try {
                      this.details = b;
                      console.log(this.details, 'DETAILS');
                    } catch (err) {}
                  }
                }
              );
            }
          }
        }
      });
  }

  fillPortfolios(StoredProcedureName1, ParamList1) {
    this.afs
      .getCustomerPortfolios(StoredProcedureName1, ParamList1)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.portfolios = res.ExecGenericStoredProcedureResult;

          this.portfolios.forEach((element) => {
            var portfolioMapObj = {
              Portfolio: element.GenericResponse[1].Value,
              PortDesc: element.GenericResponse[0].Value,
            };
            //console.log(portfolioMapObj);
            this.portfolioMapping.push(portfolioMapObj);
          });

          console.log('this.portfolioMapping', this.portfolioMapping);
          console.log(
            this.portfolios.length,
            'this.Portfolios',
            this.portfolios
          );

          for (let i = 0; i < this.portfolios.length; i++) {
            this.PortfoliosDropdown.push(
              this.portfolios[i].GenericResponse[1].Value
            );
          }
          this.PortfoliosDropdown = this.PortfoliosDropdown.filter(
            (value, index) => {
              return this.PortfoliosDropdown.indexOf(value) === index;
            }
          );
          console.log('this.PortfoliosDropdown', this.PortfoliosDropdown);
          this.fillAccountNo(this.StoredProcedureName2, this.ParamList1);
        }
      });
  }

  fillAccountNo(StoredProcedureName2, ParamList1) {
    this.afs
      .getCustomerPortfolios(StoredProcedureName2, ParamList1)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.accountResult = res.ExecGenericStoredProcedureResult;

          this.accountResult.forEach((ele) => {
            var AccnoMapObj = {
              AccountNum: ele.GenericResponse[0].Value,
              PortDesc: ele.GenericResponse[2].Value,
            };
            this.AccountNoMapping.push(AccnoMapObj);
          });
          console.log('this.AccountNoMapping', this.AccountNoMapping);

          for (let i = 0; i < this.accountResult.length; i++) {
            this.allAccountNo.push(
              this.accountResult[i].GenericResponse[0].Value
            );
          }
          this.allAccountNo = this.allAccountNo.filter((value, index) => {
            return this.allAccountNo.indexOf(value) === index;
          });
          console.log('this.allAccountNo', this.allAccountNo);
        }
      });
  }

  changedPortfolio(Pname, index) {
    console.log('Selected Portfolio: ', Pname);

    this.selectedPortfolio = this.portfolios.filter((it) => {
      return it.GenericResponse[1].Value === Pname;
    })[0]['GenericResponse'][0]['Value'];
    console.log('Selected Portfolio Description: ', this.selectedPortfolio);
    this.securityListArray[index].PortfolioDesc = this.selectedPortfolio;

    this.accountNoDropdown = [];
    for (let i = 0; i < this.AccountNoMapping.length; i++) {
      if (this.AccountNoMapping[i].PortDesc === this.selectedPortfolio) {
        this.accountNoDropdown.push(this.AccountNoMapping[i].AccountNum);
      }
    }
    console.log('this.accountNoDropdown', this.accountNoDropdown);
    console.log('this.securityListArray', this.securityListArray);

    this.securityListArray[index].AccountNo_dd = this.accountNoDropdown;
    this.securityListArray[index].AccountNo = this.accountNoDropdown[0];

    console.log(this.customerID, this.selectedPortfolio, this.baseCCY);

    this.workflowApi.getCustPortfolioSecurityHoldings(
      this.customerID,
      this.selectedPortfolio,
      this.baseCCY
    );
    this.portSecHolSubcription = this.workflowApi.portfolioSecHoldingObserver
      .pipe(take(1))
      .subscribe((res) => {
        if (res.length !== 0) {
          this.portfolioDetails = res;
          this.remainingUnits = 0;
          console.log(this.portfolioDetails);
          // this.portfolioDetails.forEach((elem) => {
          //   if (elem.longName[0].includes(this.portfolioDetails)) {
          //     //this.remainingUnits = elem.CEHD_Available_Qty[0];
          //     this.securityData = elem;
          //     console.log(this.securityData);
          //     this.noBalFlag = true;
          //   }
          // });
        } else {
          this.loadflag = false;
          this.noBalFlag = false;
        }
      });
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

  async PlaceOrder(index, AssetType) {
    this.securityIndex = index;
    this.ISIN = this.securityResult[index].GenericResponse[14].Value;
    this.NMID = this.securityResult[index].GenericResponse[12].Value;
    this.baseCCY =
      this.securityResult[this.securityIndex].GenericResponse[2].Value;
    // this.side = this.securityResult[index].GenericResponse[0].Value
    this.nominal = this.securityResult[index].GenericResponse[6].Value;
    this.ClientPrice =
      this.securityResult[this.securityIndex].GenericResponse[3].Value;
    this.Account_Number = this.securityListArray[this.securityIndex].AccountNo;
    this.portfolio = this.securityListArray[this.securityIndex].PortfolioDesc;
    this.SecurityCode = this.securityListArray[this.securityIndex].SecurityCode;

    if (AssetType === 'Equities') {
      this.side = this.securityListArray[this.securityIndex].Action;
      this.successMsg = '';
      this.optiontype = 'Market';
      this.Exchange = 'US';
      this.OrderQty = '500.00';
      this.LimitPrice = 1.5;
      this.TimeInForce = 'DAY';

      console.log(this.NMID);
      this.workflowApi.GetIndividualShareDetails(this.NMID);

      console.log(this.SecurityCode);
      this.commonApi.setAsset(this.SecurityCode);

      this.subf = false;
      this.selectedAssetSubf = false;
      this.details = [];

      this.getShareDetails();
    } else if (AssetType === 'Fixed Income') {
      this.bondNMID =
        this.securityResult[this.securityIndex].GenericResponse[12].Value;
      this.ISIN =
        this.securityResult[this.securityIndex].GenericResponse[14].Value;
      this.baseCCY =
        this.securityResult[this.securityIndex].GenericResponse[2].Value;
      this.side =
        this.securityResult[this.securityIndex].GenericResponse[0].Value;
      this.Price =
        this.securityResult[this.securityIndex].GenericResponse[3].Value;
      this.QuantityType = 0; /////// 0 - for Nominal and 1 - for Units.
      this.bondName = this.securityListArray[this.securityIndex].Security;
      this.selectbondOnClick(this.bondNMID);

      this.workflowApi.getbondslist(
        this.LoginID,
        this.bondName,
        this.authorApi.EntityID
      );
      this.workflowApi.getbonddetails(
        this.bondNMID,
        this.authorApi.EntityID,
        this.LoginID
      );

      // console.log("Index",index,"this.securityResult",this.securityResult);
      this.successMsg = '';
      try {
        this.orderDetails = [];
        this.orderDetails = {
          custID: this.customerID,
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
        } else if (
          this.side === 'Sell' &&
          this.nominal > this.remainingBalance
        ) {
          this.successMsg =
            'Notional amount should be less than balance notional. Balance is: ' +
            this.commonApi.FormatNumberr(parseFloat(this.remainingBalance));
          this.loadflag = false;
        } else if (this.ClientPrice > 0 && this.successMsg === '') {
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
              this.tradeDate,
              this.selectedBond.PriceType,
              // parseInt(this.selectedBond.FaceValue, 10) * 0.098 + '',
              this.ClientPrice,
              this.DirtyPrice,
              this.CleanPrice,
              this.YTM,
              this.Proceeds,
              this.BankPNL,
              this.portfolio,
              this.OrderType === 'market' ? '' : this.TimeInForce,
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
              this.tradeDate,
              this.selectedBond.PriceType,
              // parseInt(this.selectedBond.FaceValue, 10) * 0.098 + '',
              this.ClientPrice,
              this.DirtyPrice,
              this.CleanPrice,
              this.YTM,
              this.Proceeds,
              this.BankPNL,
              this.portfolio,
              this.OrderType === 'market' ? '' : this.TimeInForce,
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

          this.bondsubscribe = this.workflowApi.bondsubscribeObserver.subscribe(
            (OID: any) => {
              console.log('Inside Bond Subscription.', OID);
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
                  console.log(this.successMsg);

                  let status_2: status = {
                    orderid: this.OrderID,
                    msg: this.successMsg,
                    ISIN: this.details['ISIN'],
                  };
                  console.log(status_2, 'STATUS_', this.details);
                  // this.status.orderid = "";
                  // this.status.msg = this.successMsg;
                  // this.status.ISIN = this.ISIN;
                  this.statusArray.push(status_2);

                  console.log(
                    this.OrderID,
                    this.statusArray,
                    this.successMsg,
                    'FI'
                  );
                  let orderDetail = {
                    custID: this.customerID,
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
        } else {
          this.successMsg = 'Please calculate the client price.';
          this.loadflag = false;
        }
      } catch (error) {
        error;
      }
    } else if (AssetType === 'MF') {
      this.workflowApi.loadMutualFunds();
      //this.commonApi.setAsset(this.portfolio);
      //this.commonApi.setPortfoliobalance(this.remainingBalance);

      // console.log(this.NMID);
      this.mutualFund = this.securityListArray[this.securityIndex].Security;
      console.log(this.mutualFund);

      this.mflistSubscription = this.workflowApi.MFList.pipe(take(1)).subscribe(
        (mf) => {
          console.log(mf);
          this.mfList = mf.filter((item) =>
            item.Name.toLowerCase().startsWith(this.mutualFund.toLowerCase())
          );
          this.data = this.mfList[0];
          console.log(this.data);
          this.cashBalanceMF();
        }
      );

      this.workflowApi.getCustPortfolioSecurityHoldings(
        this.customerID,
        this.portfolio,
        this.baseCCY
      );
      this.workflowApi.portfolioSecHoldingObserver.subscribe((res) => {
        if (res.length !== 0) {
          this.portfolioDetails = res;
          this.remainingUnits = 0;
          console.log(this.portfolioDetails, 'this.details');
          this.portfolioDetails.forEach((elem) => {
            if (elem.longName[0].includes(this.data.Name)) {
              this.remainingUnits = elem.CEHD_Available_Qty[0];
              var mfISIN = elem;
              console.log(mfISIN);
              this.noBalFlag = true;
            }
          });
        } else {
          this.loadflag = false;
          this.noBalFlag = false;
        }

        // console.log("this.remainingUnits", this.remainingUnits);
      });

      this.side = this.securityListArray[this.securityIndex].Action;
      if (this.side.toUpperCase() === 'BUY') {
        this.ApplicationType = 'Subscription';
      } else if (this.side.toUpperCase() === 'SELL') {
        this.ApplicationType = 'Redemption';
      }
      // console.log(this.ApplicationType);
    }
  }

  getShareDetails() {
    console.log('In GetShareDetails.');

    this.shareDetailsBS = this.workflowApi.shareDetailsObserver
      .pipe(takeUntil(this.sub))
      .subscribe((res: any) => {
        if (res.length !== 0) {
          if (res.ProductDetails['NoteMasterID'] === this.NMID) {
            if (this.subf === true) {
              console.log('SUB Worked. TRY');
              this.sub.next('');
              this.sub.complete();
            } else {
              this.details = res.ProductDetails;
              console.log('this.details TRY', this.details);

              this.SettlementType =
                this.details.SettlementType.split('+')[1].trim();
              this.OrderQty = this.commonApi.formatNumber(this.details.LotSize);
              if (this.optiontype === 'Limit') {
                this.SettAmt =
                  parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
              } else {
                if (this.optiontype === 'Market') {
                  if (this.side === 'Buy') {
                    this.SettAmt =
                      this.details.AskPx *
                      parseFloat(this.OrderQty.replace(/,/g, ''));
                  } else {
                    this.SettAmt =
                      this.details.BidPx *
                      parseFloat(this.OrderQty.replace(/,/g, ''));
                  }
                }
              }

              this.selectedAssetObserverSub =
                this.commonApi.selectedAssetObserver
                  .pipe(takeUntil(this.selectedAssetSub))
                  .subscribe(async (res) => {
                    try {
                      console.log('AGAIN');
                      if (this.selectedAssetSubf === true) {
                        console.log('dhdhj');
                        this.selectedAssetSub.next('');
                        this.selectedAssetSub.complete();
                      } else {
                        console.log(
                          'selectedAssetObserverSub========================',
                          res
                        );
                        const code = res;
                        if (res.length !== 0) {
                          console.log('id', code, this.NMID);
                          this.selectShareOnClick(this.NMID);

                          this.selectedAssetSubf = true;
                          this.selectedAssetSub.next('');
                          this.selectedAssetSub.complete();
                        }
                      }
                    } catch (ex) {
                      console.log(
                        'Error occured in selectedAssetObserver: ',
                        ex
                      );
                    }
                  });
              this.subf = true;
              this.sub.next('');
              this.sub.complete();
            }
          }
          // if (this.subf === true ) {
          //   console.log("SUB Worked.")
          //   this.sub.next();
          //   this.sub.complete();
          // } else {
          //   this.details = res.ProductDetails;
          //   console.log("this.details", this.details);
          //   this.SettlementType = this.details.SettlementType.split('+')[1].trim();
          //   this.OrderQty = this.commonApi.formatNumber(this.details.LotSize);

          //   if (this.optiontype === 'Limit') {
          //     this.SettAmt =
          //       parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
          //   } else {
          //     if (this.optiontype === 'Market') {
          //       if (this.side === 'Buy') {
          //         this.SettAmt =
          //           this.details.AskPx *
          //           parseFloat(this.OrderQty.replace(/,/g, ''));
          //       } else {
          //         this.SettAmt =
          //           this.details.BidPx *
          //           parseFloat(this.OrderQty.replace(/,/g, ''));
          //       }
          //     }
          //   }
          //   // }

          //   this.selectedAssetObserverSub = this.commonApi.selectedAssetObserver.pipe(takeUntil(this.selectedAssetSub)).subscribe(async (res) => {
          //     try {
          //       console.log('selectedAssetObserverSub========================', res);
          //       const code = res;

          //       // this.shareList = await this.workflowApi.GetShareListAsync(code);
          //       // console.log(this.shareList);
          //       // if (this.shareList.length !== 0) {
          //       //   const NMArray = this.shareList.filter(
          //       //     (b) => b.Feedcode === code
          //       //   )[0];
          //       //   console.log(NMArray);
          //       //   this.NMID = NMArray.Note_Master_Id;
          //       //   this.OrderQty = NMArray.Note_Master_Id;
          //       if(res.length !== 0) {
          //         console.log('id', code, this.NMID);
          //         this.selectShareOnClick(this.NMID);
          //       }

          //       // } else {
          //       // }
          //     } catch (ex) {
          //       console.log('Error occured in selectedAssetObserver: ', ex);
          //     }
          // });

          // this.subf = true;
          // // this.shareDetailsBS.complete();
          // this.sub.next();
          // this.sub.complete();
          // }
        } else {
          console.log('getShareDetails Failed!!');
        }
      });
    console.log(this.shareDetailsBS);
  }

  selectShareOnClick(NoteMasterId) {
    try {
      this.reset();
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      console.log('notemaster id=============', NoteMasterId, this.baseCCY);

      this.updatePortfolioEQ();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  reset() {
    try {
      this.loadflag = false;
      this.successMsg = '';
      // this.side = 'Buy';
      this.optiontype = 'Market';
      this.Exchange = 'US';
      this.OrderQty = '500.00';
      this.LimitPrice = 1.5;
      this.TimeInForce = 'DAY';
      if (this.optiontype === 'Limit') {
        this.SettAmt =
          parseFloat(this.OrderQty.replace(/,/g, '')) * this.LimitPrice;
      } else {
        if (this.optiontype === 'Market') {
          if (this.side === 'Buy') {
            this.SettAmt =
              this.details.AskPx * parseFloat(this.OrderQty.replace(/,/g, ''));
          } else {
            this.SettAmt =
              this.details.BidPx * parseFloat(this.OrderQty.replace(/,/g, ''));
          }
        }
      }
      this.successMsg = '';
    } catch (error) {}
  }

  updatePortfolioEQ() {
    console.log(this.portfolio);
    console.log(
      'Portfolio',
      this.customerID,
      this.portfolio,
      this.securityListArray[this.securityIndex].Currency
    );
    this.cashBalanceEQ();
  }

  cashBalanceEQ() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.CashBalance = '';
      this.getCashBalSubsription = this.workflowApi
        .getCashbalanceFromAccountNumber(this.baseCCY, this.Account_Number)
        .pipe(take(1))
        .subscribe((res) => {
          if (res.length !== 0) {
            console.log(res, this.SettAmt);
            if (
              parseFloat(this.SettAmt) <=
              parseFloat(res.ExecGenericScalarFunctionResult)
            ) {
              this.balanceFlag = true;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
              console.log('this.balanceFlag1', this.balanceFlag);
              this.subscribeEQ();
              return;
            } else {
              this.balanceFlag = false;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
              console.log('this.balanceFlag2', this.balanceFlag);
            }
          } else {
            console.log('Unable to fetch Cash balance.');
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  async subscribeEQ() {
    try {
      console.log('Validations.');
      this.orderDetails = [];
      this.orderDetails = {
        custID: this.customerID,
        CRR: '',
        commissionValue: this.commissionValue,
        commissionPercentage: this.commissionPercentage,
        commissionReason: this.commissionReason,
        currency: this.baseCCY,
        custName: this.CustomerName,
        orderType: '',
        direction: this.side,
        fundingMode: this.FundMode,
        settlementAmount: this.SettAmt,
        productCode: this.details.Feedcode,
        productref: this.shareNMID,
      };
      if (this.details.Feedcode === '') {
        this.successMsg = 'Please select valid share';
        return;
      }
      if (this.OrderQty === '0' || this.OrderQty === '0.00') {
        this.successMsg = 'Please enter valid order quantity';
        return;
      }
      if (this.Account_Number === '') {
        this.successMsg = 'Please select account number.';
        return;
      }

      if (this.checkSuitability) {
        const isSuitabilityValid: boolean = await this.checkOrderSuitability(
          this.orderDetails
        );
        console.log(isSuitabilityValid);
        console.log('Subscribing...', this.orderDetails);
        this.workflowApi.SubscribeEquities(
          this.details.Feedcode,
          this.side,
          this.details.Currency,
          this.details.TradeDate,
          this.SettlementType,
          this.details.SettlementDate,
          this.optiontype,
          this.optiontype === 'Limit'
            ? this.LimitPrice
            : this.side === 'Buy'
            ? this.details.AskPx
            : this.details.BidPx,
          this.TimeInForce,
          this.details.TradeDate,
          this.OrderQty.replace(/,/g, ''),
          this.details.Exchange,
          this.portfolio,
          this.CustomerName,
          this.RMName,
          this.Account_Number,
          this.customerID,
          this.SettAmt.toFixed(2),
          this.bankcontribution,
          this.FundMode,
          this.LoanTenor
        );
      } else {
        //console.log("Subscribing...", "orderDetails:",this.orderDetails)
        console.log(this.details);
        console.log(
          this.SettlementType,
          this.optiontype,
          this.portfolio,
          this.CustomerName,
          this.RMName,
          this.SettAmt,
          this.bankcontribution,
          this.FundMode
        );
        this.workflowApi.SubscribeEquities(
          this.details.Feedcode,
          this.side,
          this.details.Currency,
          this.details.TradeDate,
          this.SettlementType,
          this.details.SettlementDate,
          this.optiontype,
          this.optiontype === 'Limit'
            ? this.LimitPrice
            : this.side === 'Buy'
            ? this.details.AskPx
            : this.details.BidPx,
          this.TimeInForce,
          this.details.TradeDate,
          this.OrderQty.replace(/,/g, ''),
          this.details.Exchange,
          this.portfolio,
          this.CustomerName,
          this.RMName,
          this.Account_Number,
          this.customerID,
          this.SettAmt.toFixed(2),
          this.bankcontribution,
          this.FundMode,
          this.LoanTenor
        );
      }

      this.workflowApi.eqsubscribeObserver.subscribe((res: any) => {
        console.log('Moment Of Truth');
        if (res.length === 0) {
          console.log('Try Order Placement Again.');
        } else {
          if (res.FinIQResponseHeader.Status === 'Failed') {
            this.loadflag = false;
            this.successMsg =
              res.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Description;
          } else {
            this.loadflag = false;
            this.OrderID = res.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
            this.successMsg =
              'Order placed successfully with Ref No. ' + this.OrderID;

            // this.scrollWin();
            let orderDetail = {
              custID: this.customerID,
              currency: this.details.Currency,
              custName: this.CustomerName,
              NoteMasterId: this.NMID_Suitability,
              portfolio: this.portfolio,
              orderID: this.OrderID,
              settlementAmount: this.SettAmt,
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
        }
      });
    } catch (error) {}
  }

  selectbondOnClick(bond) {
    console.log(bond);
    //const that = this;
    try {
      this.msg = '';
      this.CalculateDates();

      this.bondlist = this.workflowApi.bondlistObserver.subscribe((b) => {
        if (b) {
          if (b) {
            this.showSuggestions = true;
            this.bondsList = b
              .filter((item) =>
                item.Product_Name.toLowerCase().includes(
                  this.bondName.toLowerCase()
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
            console.log(this.bondsList);

            if (this.NMID !== undefined && this.NMID !== '') {
              // this.workflowApi.getbonddetails(
              //   that.NMID,
              //   this.authorApi.EntityID,
              //   this.LoginID
              // );
              this.bondDetails = this.workflowApi.bondDetailsObserver.subscribe(
                (b: any) => {
                  if (b) {
                    try {
                      this.details = b;
                      console.log(this.details, 'this.details');
                      this.selectedBond = b;
                      console.log(this.selectedBond);

                      if (this.isUserRM) {
                        if (
                          !['', null, undefined].includes(this.CustomerName)
                        ) {
                          this.customerID = this.CustomerName.split('|')[1];
                        }
                      } else {
                        this.customerID = this.customerID;
                      }
                      //End

                      this.updatePortfolio();

                      if (this.bondsList.length) {
                        this.InterbankaskPrice = b.InterbankAskPrice;
                        this.InterbankbidPrice = b.InterbankBidPrice;
                        this.showBondDetails = true;
                        this.YTM = null;
                        this.YTConv = null;
                        this.search = '';
                        this.PRR = parseInt(b.PRR, 10);
                        this.settlementType = b.SettlementType.split('+')[1];
                        this.QuantityType = b.PercentParQuoted === 'N' ? 1 : 0;
                        this.settlementDate = b.SettlementDate;

                        try {
                          this.NMID = '';
                          console.log('bonds', this.selectedBond);
                          if (!this.side) {
                            this.successMsg = 'Please select Customer B/S.';
                            this.loadflag = false;
                          } else if (!this.nominal) {
                            this.successMsg = 'Please enter Notional amount.';
                            this.loadflag = false;
                          } else if (this.nominal <= 0.0) {
                            this.successMsg =
                              'Notional amount should be greater than 0.';
                            this.loadflag = false;
                          } else if (!this.spread) {
                            this.successMsg = 'Please enter Spread.';
                            this.loadflag = false;
                          } else if (!this.CustomerName) {
                            this.successMsg = 'Please select Customer.';
                            this.loadflag = false;
                          }
                          if (
                            this.side &&
                            this.nominal > 0 &&
                            this.spread &&
                            this.CustomerName
                          ) {
                            this.successMsg = '';

                            // this.CalculateClientPrice();

                            // console.log(this.selectedBond.NoteMasterID, this.nominal, this.side, this.settlementDate, this.spread, this.OrderType);
                            this.workflowApi.getbondCalculations(
                              sessionStorage.getItem('Username'),
                              this.selectedBond.NMID,
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
                              //this.cashBalance();
                            } else {
                              this.sellBalance();

                              this.workflowApi.portfolioSecHoldingObserver.subscribe(
                                (res) => {
                                  if (res.length !== 0) {
                                    this.portfolioDetails = res;
                                    this.remainingUnits = 0;
                                    //console.log(this.portfolioDetails);
                                    this.portfolioDetails.forEach((elem) => {
                                      if (
                                        elem.longName[0].includes(
                                          this.securityListArray[
                                            this.securityIndex
                                          ].Security
                                        )
                                      ) {
                                        this.remainingUnits =
                                          elem.CEHD_Available_Qty[0];
                                        this.securityData = elem;
                                        // console.log(this.securityData);
                                        // console.log(this.remainingUnits);
                                        this.noBalFlag = true;
                                      }
                                    });
                                  } else {
                                    this.loadflag = false;
                                    this.noBalFlag = false;
                                  }
                                }
                              );
                            }
                          }
                        } catch (error) {
                          // console.log('Error:', error);
                        }
                      }
                    } catch (e) {}
                  } else {
                    console.log('Failed');
                  }
                }
              );
            }
          }
        }
      });
      this.NMID = bond;
      console.log(this.customerID, this.baseCCY);

      this.portfolio = this.securityListArray[this.securityIndex].PortfolioDesc;
      this.updatePortfolio();
    } catch (error) {
      console.log('Error:', error);
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
      d.setDate(d.getDate() + 14);
      if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
      } else if (d.getDay() === 6) {
        d.setDate(d.getDate() + 2);
      }
      this.expiryDate =
        (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
        '-' +
        this.months[d.getMonth()] +
        '-' +
        d.getFullYear() +
        ' ' +
        d.getHours() +
        ':' +
        d.getMinutes() +
        ':' +
        d.getSeconds();
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  updatePortfolio() {
    this.workflowApi
      .getAccountNumberFromPortfolioGeneric(
        this.customerID,
        this.portfolio,
        this.baseCCY
      )
      .subscribe((res) => {
        if (res) {
          console.log('In UPDATE');
          this.accountList = [];
          this.accountList = res.ExecGenericTableValuedFunctionResult;
          this.Account_Number =
            this.securityListArray[this.securityIndex].AccountNo;
          console.log('ACC NO: ', this.Account_Number);
          this.cashBalance();
        }
      });
  }

  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      console.log('IN CASHBAL');
      this.CashBalance = '';

      this.workflowApi
        .getCashbalanceFromAccountNumber(this.baseCCY, this.Account_Number)
        .subscribe((res) => {
          if (res) {
            console.log(res.ExecGenericScalarFunctionResult);
            if (
              parseFloat(this.nominal) <=
              parseFloat(res.ExecGenericScalarFunctionResult)
            ) {
              this.balanceFlag = true;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
              console.log(
                'this.balanceFlag',
                this.balanceFlag,
                'CASH BAL: ',
                this.CashBalance
              );
              return;
            } else {
              this.balanceFlag = false;
              this.CashBalance = res.ExecGenericScalarFunctionResult;
              console.log(
                'this.balanceFlag',
                this.balanceFlag,
                'CASH BAL: ',
                this.CashBalance
              );
            }
          } else {
            console.log('cashBalance Failed.');
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  async MForderSubscribe() {
    try {
      this.orderDetails = [];
      this.orderDetails = {
        custID: this.customerID,
        CRR: this.data.Rating,
        commissionValue: this.commissionValue,
        commissionPercentage: this.commissionPercentage,
        commissionReason: this.commissionReason,
        currency: this.data.Ccy,
        custName: this.CustomerName,
        orderType: '',
        direction: this.ApplicationType,
        fundingMode: this.FundMode,
        settlementAmount: this.nominal,
        productCode: this.data.Code,
        productref: this.NMID,
      };
      this.successMsg = '';
      // this.remainingBalance = this.fnGetCashBalance();

      //console.log(parseFloat(this.fnGetCashBalance()));

      if (this.data.BidNAV === 0) {
        console.log('BidNAV Check');
        this.successMsg = 'NAV is 0. Please select other fund.';
        this.loadflag = false;
      } else if (
        this.FundVal === 'PL' &&
        parseFloat(this.LoanAmt) >= parseFloat(this.nominal)
      ) {
        this.successMsg = 'Loan Amount should be less than notional.';
        this.loadflag = false;
      } else if (
        (this.FundVal === 'PL' || this.FundVal === 'TL') &&
        parseFloat(this.fnGetLoanAmt()) >= parseFloat(this.fnGetDrawdown())
      ) {
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
      } else if (this.nominal <= 0) {
        console.log('Notional Check');
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (this.nominal >= 1000000000) {
        console.log('Nominal1 Check');
        this.successMsg = 'Notional should be less than 1,000,000,000.';
        this.loadflag = false;
      } else if (
        this.Account_Number === '' ||
        this.Account_Number === undefined
      ) {
        console.log('AccountNO Check');
        this.successMsg = 'No account with required fund currency.';
        this.loadflag = false;
      } else if (this.successMsg === '') {
        console.log(this.data['Code']);
        if (this.data.Code) {
          this.subscribeFunds = true;
          this.subscribeFlag = true;
          console.log('In this.data.Code');

          if (this.ApplicationType === 'Subscription') {
            this.unitCalculations(this.nominal, this.data.BidNAV);
            console.log('Subscription.');
            if (this.nominal < this.data.Min_Inv_Amt) {
              this.successMsg =
                'Notional should be greater than minimum investment.';
              this.loadflag = false;
            } else if (!this.balanceFlag) {
              console.log('!balanceFlag');
              this.successMsg =
                'Insufficient cash balance in this account' +
                '(Account Number: ' +
                this.Account_Number +
                ')';
              this.loadflag = false;
            } else {
              console.log('PERFECT');
              if (this.checkSuitability && this.token !== '') {
                console.log('INSIDE checkSuitability ');
                const isSuitabilityValid: boolean =
                  await this.checkOrderSuitability(this.orderDetails);
                console.log(isSuitabilityValid);
                // if (isSuitabilityValid) {
                this.SavefundsOrder(
                  this.nominal,
                  'Subscription',
                  'SB',
                  '',
                  '00000',
                  this.nominal / this.data.BidNAV
                );
              } else {
                this.SavefundsOrder(
                  this.nominal,
                  'Subscription',
                  'SB',
                  '',
                  '00000',
                  this.nominal / this.data.BidNAV
                );
              }
            }
          } else if (this.ApplicationType === 'Redemption') {
            console.log('Entered In Redemption Case.');
            this.unitCalculations(this.nominal, this.data.BidNAV);
            if (this.fnGetUnits() > this.remainingUnits) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: ' +
                this.commonApi.FormatNumberr(parseFloat(this.remainingUnits));
              console.log('Remaining Units Check.');
              this.loadflag = false;
            } else if (!this.noBalFlag) {
              this.successMsg =
                'Sell units should be less than balance units. Balance units: 0.00';
              this.loadflag = false;
            } else {
              if (this.checkSuitability) {
                console.log('All Cases cleared.');
                const isSuitabilityValid: boolean =
                  await this.checkOrderSuitability(this.orderDetails);
                console.log(isSuitabilityValid);

                // if (isSuitabilityValid) {
                this.SavefundsOrder(
                  this.nominal,
                  'Redemption',
                  'RD',
                  'SRS',
                  this.fnGetUnits(),
                  this.fnGetUnits()
                );
              } else {
                this.SavefundsOrder(
                  this.nominal,
                  'Redemption',
                  'RD',
                  'SRS',
                  this.fnGetUnits(),
                  this.fnGetUnits()
                );
              }
            }
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

  unitCalculations(nominal, nav) {
    console.log(nominal, nav);
    try {
      nav !== 0 ? (this.Units = nominal / nav) : (this.Units = 0);
      this.Units = this.Units.toFixed(2);
      this.validation = '';
      this.NoteMasterID = '';
      this.Units = this.commonApi.FormatNumberr(this.Units);
      this.successMsg = '';
      if (this.FundVal === 'TL') {
        this.LoanAmt = this.commonApi.FormatNumberr(this.nominal);
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

  getAvailableDrawdown() {
    try {
      console.log(this.remainingUnits);
      this.workflowApi
        .getMFDrawdown(
          this.customerID,
          this.remainingUnits,
          this.data.BidNAV,
          this.data.LTV,
          ''
        )
        .subscribe((res) => {
          if (res) {
            this.Drawdown = res.ExecGenericTableValuedFunctionResult[0].Param1;
            this.Drawdown = this.commonApi.FormatNumberr(this.Drawdown);
            console.log(this.Drawdown);
          }
        });
    } catch (error) {}
  }

  cashBalanceMF() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.remainingBalance = '';
      console.log(this.data.Ccy);
      this.workflowApi
        .getCashbalanceFromAccountNumber(this.data.Ccy, this.Account_Number)
        .subscribe((res) => {
          if (res) {
            console.log(res);
            this.remainingBalance = res.ExecGenericScalarFunctionResult;
            this.remainingBalance = this.commonApi.FormatNumberr(
              this.remainingBalance
            );
            console.log(this.remainingBalance);
            console.log(this.nominal);
            console.log(
              this.commonApi.UnformatNumberwithoutevent(this.remainingBalance)
            );

            this.commonApi.setPortfoliobalance(this.remainingBalance);
            this.commonApi.selectedPortfolioBalObserver.subscribe((res) => {
              console.log(res);
              if (res.length !== 0) {
                this.remainingUnits = res;
                console.log(this.remainingUnits);
              } else {
                console.log('Balance not fetched.');
              }
            });
            if (
              parseFloat(this.nominal) <=
              this.commonApi.UnformatNumberwithoutevent(this.remainingBalance)
            ) {
              //parseFloat(this.fnGetCashBalance())
              this.balanceFlag = true;
              console.log(this.balanceFlag);
              this.MForderSubscribe();
            } else {
              this.balanceFlag = false;
              console.log('MF balance Flag set False');
            }
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  Calculate() {
    try {
      this.NMID = '';
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

        this.CalculateClientPrice();

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
        this.placeorderFlag = true;
        if (this.side === 'Buy') {
          //this.cashBalanceMF();
        } else {
          this.sellBalance();
        }
      }
    } catch (error) {
      // console.log('Error:', error);
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

  CalculateTotalProceeds() {
    try {
      this.Proceeds = this.SettAmt;
    } catch (error) {
      // console.log('Error:', error);
    }
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

  sellBalance() {
    this.workflowApi.getCustPortfolioSecurityHoldings(
      this.customerID,
      this.portfolio,
      this.baseCCY
    );
  }

  updateCustomerPortfolioDetails() {
    if (this.portfolioList.length !== 0) {
      this.successMsg = '';
      //this.portfolio = this.portfolioList[0];
      //this.Account_Number = this.accountList[0];
      this.workflowApi.getCustPortfolioSecurityHoldings(
        this.customerID,
        this.portfolio,
        this.baseCCY
      );
    } else {
      this.successMsg =
        'Portfolio with selected fund currency is not available. Please select different fund';
    }
  }

  async checkOrderSuitability(order) {
    console.log(order);
    try {
      const res = await this.workflowApi.checkSuitability(order);
      console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      this.NMID_Suitability = res.NMID;
      this.NoteMasterID = this.NMID_Suitability;

      this.token = res.SUITABILITY_TOKEN_COUNT;

      return true;
    } catch (error) {}
  }

  SavefundsOrder(
    notional,
    transectionType,
    applicationType,
    ModeofSettlement,
    switchUnits,
    RealizedAmountUnits
  ) {
    console.log(
      notional,
      transectionType,
      applicationType,
      ModeofSettlement,
      switchUnits,
      RealizedAmountUnits
    );
    const today = new Date();
    let CustomerID = '';
    let orderbasis = transectionType === 'Subscription' ? 'Amount' : 'Units';
    console.log(orderbasis);
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
      ? (CustomerID = this.customerID)
      : (CustomerID = this.username);
    this.isUserRM ? (CIF = this.CIF) : (CIF = this.homeApi.CIF);

    if (this.isUserRM) {
      this.customerID = this.CustomerName.split('|')[1];
      CustomerID = this.customerID;
    } else {
    }

    if (notional.includes(',')) {
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
    console.log(ClientContribution, bankContribution);

    // console.log("Customer ID insubscribed", this.CustomerID); // Added by Mayuri D | 07-Feb-2022
    CustomerID = this.customerID; // Added by Mayuri D | 07-Feb-2022
    // console.log("Customer ID insubscribed after aa", this.CustomerID , CustomerID);  // Added by Mayuri D | 07-Feb-2022

    this.OrderParamsXML = '';
    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';
    this.OrderParamsXML = this.OrderParamsXML + '<RecordType>D</RecordType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Product</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationReferenceNumber>PIB' +
        this.workflowApi.getNewApplicationIDForMF(CustomerID) +
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
    // this.OrderParamsXML =
    //   this.OrderParamsXML +
    //   ('<AvailableForDrawdown>' +
    //     this.fnGetDrawdown() +
    //     '</AvailableForDrawdown>');
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
        ('<LoanAmountActual >' + bankContribution + '</LoanAmountActual >');
      console.log(this.OrderParamsXML);
    }
    //  Added by Alolika G on 2nd Feb 2022. Params shared by Prachi P. --END

    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';
    this.afs.saveNewOrder(
      this.OrderParamsXML,
      this.username,
      'funds_trade_setup',
      'MutualFundSave',
      0
    );
    {
      this.OrderSubscribed();
    }
  }

  OrderSubscribed() {
    this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe((res) => {
      console.log(res);
      if (res) {
        if (res.SaveUCPResult) {
          console.log(res);
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

                let status_3: status = {
                  orderid: res.SaveUCPResult[0].NoteMasterID,
                  msg: this.successMsg,
                  ISIN: this.data.ISIN,
                };
                console.log(status_3, 'STATUS_');
                // this.status.orderid = "";
                // this.status.msg = this.successMsg;
                // this.status.ISIN = this.ISIN;
                this.statusArray.push(status_3);

                console.log(
                  this.OrderID,
                  this.statusArray,
                  this.successMsg,
                  'MF'
                );
                let orderDetail = {
                  custID: this.customerID,
                  currency: this.data.Ccy,
                  custName: this.CustomerName,
                  NoteMasterId: this.NMID_Suitability,
                  portfolio: this.portfolio,
                  orderID: res.SaveUCPResult[0].NoteMasterID,
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
  }

  BulkOrderPlacement() {
    this.statusArray = [];

    var index = this.securityListArray.length - 1;
    this.orderInterval = setInterval(() => {
      if (index >= 0) {
        this.callOrderEntry(
          this.securityListArray[index].Action,
          this.securityListArray[index].ISIN,
          index,
          this.securityListArray[index].AssetType
        );
        console.log(index, this.securityListArray[index]);
        index--;
      } else {
        clearInterval(this.orderInterval);
      }
    }, 1000);

    console.log(this.securityListArray);
  }

  callOrderEntry(item, dir, i, AssetType) {
    console.log(item, dir, i);
    if (item === 'SELL' && this.remainingBalance <= 0) {
      console.log("You don't have enough balance to sell");
    } else {
      switch (AssetType) {
        case 'Fixed Income':
          this.PlaceOrder(i, 'Fixed Income');
          break;
        case 'Equities':
          this.PlaceOrder(i, 'Equities');
          break;

        case 'MF':
          this.PlaceOrder(i, 'MF');
          break;
      }
    }
  }
}
