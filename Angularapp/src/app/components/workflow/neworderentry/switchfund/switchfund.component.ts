import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApifunctionService } from 'src/app/components/fx-order/apifunction.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-switchfund',
  templateUrl: './switchfund.component.html',
  styleUrls: ['./switchfund.component.scss'],
})
export class SwitchfundComponent implements OnInit, OnDestroy {
  isProd = environment.production;
  Units: any;
  FrontExitLoad = 'Front-End Load';
  assetURL: string = '';
  userType: string;
  isUserRM: boolean;
  SelectedFunds = [];
  AllFundsList = [];
  selectedMFIndex = 0;
  CustomerName: string = '';
  CustomerID: string = '';
  CIF: string = '';
  currency: string = '';
  portfolioList = [];
  portfolio: string = '';
  portfolioName: string = '';
  portfolioDetails = [];
  enablePortfolio: boolean = true;
  Account_Number: number = 0;
  accountList = [];
  moredetails: string = 'More Details';
  remainingBalance: string = '';
  remainingUnits: number = 0;
  ShowHideProductInfo: boolean = false;
  noBalFlag: boolean = false;
  showSuggestions: boolean = false;
  SecFundName: string = '';
  SwitchUnits: string = '0.00';

  successMsg: string = '';
  OrderParamsXML: string = ''; //
  RMName: string = '';
  FundMode: string = 'Fully Funded';
  FundingModeData = [];
  FundVal: any;
  Drawdown: any = '0';
  LoanTenor: any = '12M';
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
  loadflag: boolean = false;
  RedemptionOrderID: string = '';
  SubscriptionOrderID: string = '';
  ParseFund: boolean = false;
  ErrorMsg: string = '';
  GetDetailsOfSelectedFundSubscription: Subscription;

  constructor(
    private Workflow_afs: WorkflowApiService,
    public Common_cfs: CommonApiService,
    public Home_afs: HomeApiService,
    private afs: ApifunctionService,
    public Auth_afs: AuthService,
    private Cust_afs: CustomerApiService
  ) {
    this.assetURL = environment.assetURL;
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    if (this.GetDetailsOfSelectedFundSubscription)
      this.GetDetailsOfSelectedFundSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.enablePortfolio = false;
    }
    try {
      this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
      if (!this.isUserRM) {
        this.CustomerID = this.Home_afs.CustomerId;
        this.CustomerName = this.Home_afs.CustomerName.split('|')[0];
      }
    } catch (Ex) {}

    this.Cust_afs.fngetCustAccountDetails(this.Auth_afs.UserName);
    try {
      this.Cust_afs.getCustAccountDetails.subscribe((res) => {
        if (res.length !== 0) {
          console.log(res);
          this.CustomerID = res.CustomerID;
          this.CustomerName = res.misc1;
        }
      });
    } catch (ex) {}
    try {
      this.afs.CustomerSearch(this.Auth_afs.UserName);
      this.afs.CustomerListObserver.subscribe((res) => {
        if (res.length > 0) {
          res.forEach((ele) => {
            if (ele.CustomerID === this.Home_afs.CustomerId) {
              this.RMName = ele.RelManager;
            }
          });
        }
      });
    } catch (ex) {}

    try {
      this.Workflow_afs.MFList.subscribe((mf) => {
        this.AllFundsList = mf.filter(
          (item) =>
            item.Name.toLowerCase().startsWith(this.SecFundName.toLowerCase())
          // ((item.Name.toLowerCase().startsWith(this.SecFundName.toLowerCase())) && (item.Ccy.toLowerCase() === this.SelectedFunds[0].Ccy.toLowerCase()))
        );
      });
    } catch (EX) {}

    this.Workflow_afs.portfolioSecHoldingObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.portfolioDetails = res;
      } else {
        // this.loadflag = false;
        this.noBalFlag = false;
      }
    });

    this.Common_cfs.selectedAssetObserver.subscribe((res) => {
      if (res.length !== 0) {
        // console.log('mF data from the product catalog', res);
        this.AllFundsList.forEach((element) => {
          if (res.includes(element.ISIN)) {
            console.log(element);
            this.SelectedFunds = [];
            element.AvailableUnits = '';
            this.SelectedFunds.push(element);

            this.fnGetMFDetails(this.SelectedFunds[0].Code, 0);
            this.currency = element.Ccy;
            if (this.userType === 'CLIENT') {
              this.Workflow_afs.GetPortfoliosFromCusID(
                this.CustomerID,
                this.currency
              ).subscribe((folio) => {
                if (folio) {
                  this.portfolioList = folio.DB_GetPortfoliosResult;
                  if (this.portfolioList.length > 0) {
                    this.successMsg = '';
                    this.portfolio = this.portfolioList[0].FacDesc;
                    this.portfolioName = this.portfolioList[0].PortfolioName;
                    this.fnGetAvailableUnits(this.SelectedFunds[0].Code, 0);
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
              if (elem.longName[0].includes(this.SelectedFunds[0].Name)) {
                this.remainingUnits = elem.CEHD_Available_Qty[0];
                this.noBalFlag = true;
              }
            });
            console.log(this.SelectedFunds);
          } else {
            console.log('Invalid Mutual fund selected');
          }
        });
      }
    });

    this.Cust_afs.getPledgedAgainstData('UTFundMode').subscribe((res) => {
      if (res) {
        this.FundingModeData = [];
        this.FundingModeData = res.Get_Configurable_Common_DataResult;
        this.FundingModeChange(this.FundMode);
        console.log('this.FundingModeData', this.FundingModeData);
      }
    });

    this.Common_cfs.selectedPortfolioObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.portfolio = res;
      }
    });

    this.Common_cfs.selectedPortfolioBalObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.remainingUnits = res;
      }
    });
    this.Cust_afs.getPledgedAgainstData('LombardLoanTenor').subscribe((res) => {
      if (res) {
        console.log(res);
        // this.TenorData = [];
        // this.TenorData = res.Get_Configurable_Common_DataResult;
        // this.FundingModeChange(this.FundMode);
      }
    });
  }

  FundingModeChange(Event) {
    this.FundMode = Event;
    this.FundingModeData.forEach((element) => {
      if (element.DATA_VALUE === this.FundMode) {
        this.FundVal = element.Misc1;
      }
    });
    if (this.FundVal === 'TL') {
      this.getAvailableDrawdown();
      // this.LoanAmt = this.Common_cfs.FormatNumberr(this.notional);
    } else if (this.FundVal === 'PL') {
      this.getAvailableDrawdown();
      // this.LoanAmt = '0.00';
    }
  }

  getAvailableDrawdown() {
    try {
      this.Workflow_afs.getMFDrawdown(
        this.CustomerID,
        this.fnGetUnits(),
        this.SelectedFunds[0].BidNAV,
        this.SelectedFunds[0].LTV,
        ''
      ).subscribe((res) => {
        if (res) {
          this.Drawdown = res.ExecGenericTableValuedFunctionResult[0].Param1;
          this.Drawdown = this.Common_cfs.FormatNumberr(this.Drawdown);
        }
      });
    } catch (error) {}
  }

  fnGetUnits() {
    return this.SwitchUnits.replace(/,/g, '');
  }

  fnGetMFDetails(Code, Index) {
    this.Workflow_afs.getMFDetailsFundSwitch(Code).subscribe((res: any) => {
      if (res) {
        res = res.ArrayOfDC_MFDetails.DC_MFDetails[0];
        if (res !== '' && Object.keys(this.SelectedFunds[Index]).length < 24) {
          try {
            for (var prop in res) {
              if (res.hasOwnProperty(prop)) {
                if (prop === 'SwitchingFee') {
                  this.SelectedFunds[Index][prop] = res[prop][0].replaceAll(
                    '%',
                    ''
                  );
                } else {
                  this.SelectedFunds[Index][prop] = res[prop][0];
                }
              }
            }
          } catch (ex) {}
        }
      }
    });
  }

  selectShare1(_e) {
    try {
      const fund = $('.HoverSuggestion').data('mf');
      this.selectShare(fund);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShare(e) {
    this.SwitchUnits = '0';
    for (let i = 0; i < this.AllFundsList.length; i++) {
      if (this.AllFundsList[i].Code === e.split(':')[1]) {
        this.AllFundsList[i].AvailableUnits = '';
        this.SecFundName = '';
        this.SelectedFunds[1] = this.AllFundsList[i];
        this.fnGetMFDetails(this.AllFundsList[i].Code, 1);
        this.fnGetAvailableUnits(this.SelectedFunds[1].Code, 1);
      } else {
        // this.showFundDetails = false;
      }
    }
  }

  filterFun(_e) {
    try {
      this.ParseFund = false;
      const that = this;
      this.Workflow_afs.MFList.subscribe((mf) => {
        that.AllFundsList = mf.filter(
          (item) =>
            item.Name.toLowerCase().startsWith(
              this.SecFundName.toLowerCase()
            ) &&
            item.Ccy.toLowerCase() === this.SelectedFunds[0].Ccy.toLowerCase()
        );
      });
      this.ParseFund = true;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectedCustomerValue1(e) {
    this.CustomerName = e.CustomerName;
    this.CustomerID = e.CustomerID;
    this.CIF = e.CIF;
    this.Workflow_afs.GetPortfoliosFromCusID(
      this.CustomerID,
      this.currency
    ).subscribe((folio) => {
      if (folio) {
        this.portfolioList = folio.DB_GetPortfoliosResult;
        if (this.portfolioList.length > 0) {
          this.portfolio = this.portfolioList[0].FacDesc;
        } else {
          // this.successMsg = 'Cash account unavailable for the Fund currency';
        }
        // this.getaccounts();
      }
    });
  }

  ChangeIndex(_e) {
    try {
      this.selectedMFIndex = 0;
    } catch (Error) {}
  }

  moredetailsCheck() {
    if (this.moredetails === 'More Details') {
      this.moredetails = 'Less Details';
    } else {
      this.moredetails = 'More Details';
    }
  }

  fnGetCashBalance() {
    return this.remainingBalance.replace(/,/g, '');
  }

  cashBalance() {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.remainingBalance = '';

      this.Workflow_afs.getCashbalanceFromAccountNumber(
        this.SelectedFunds[0].Ccy,
        this.Account_Number
      ).subscribe((res) => {
        if (res) {
          this.remainingBalance = res.ExecGenericScalarFunctionResult;
          this.remainingBalance = this.Common_cfs.FormatNumberr(
            this.remainingBalance
          );
        }
      });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  getaccounts() {
    this.Workflow_afs.getAccountNumberFromPortfolioGeneric(
      this.CustomerID,
      this.portfolio,
      this.currency
    ).subscribe((acc) => {
      if (acc) {
        this.accountList = [];
        this.accountList = acc.ExecGenericTableValuedFunctionResult;
        this.Account_Number = this.accountList[0].Param1;
        this.cashBalance();
      }
    });
  }

  fnGetDrawdown() {
    return this.Drawdown.replace(/,/g, '');
  }

  fnResetAll() {
    this.successMsg = '';
    this.SwitchUnits = '0.00';
  }

  fnUnitsChanged() {
    if (
      parseFloat(this.SwitchUnits) <
      parseFloat(this.SelectedFunds[0].AvailableUnits.replace(/,/g, ''))
    ) {
    } else {
    }
  }

  fnGetAvailableUnits(FundCode, index: number) {
    let ParamList = [
      {
        Param1: 'FINIQ_COMMON',
      },
      {
        Param1: '@FacilityCode',
        Param2: this.portfolio,
      },
      {
        Param1: '@FundCode',
        Param2: FundCode,
      },
    ];
    this.Workflow_afs.fngetMFGenericfn(
      'GetCurrentHoldings',
      ParamList
    ).subscribe((res) => {
      if (res.ExecGenericTableValuedFunctionResult.length > 0) {
        this.SelectedFunds[index].AvailableUnits =
          res.ExecGenericTableValuedFunctionResult[0].Param1;
      }
    });
  }

  fnTradebtnAction() {
    if (parseFloat(this.SwitchUnits) > 0.0) {
      this.ErrorMsg = '';
      this.fnPlaceOrder(
        this.SelectedFunds[0].Ccy,
        this.SelectedFunds[0].BidNAV,
        'From',
        'Redemption',
        this.SelectedFunds[0].LTV
      );
    } else {
      this.ErrorMsg = 'Units should be greater than zero.';
    }
  }

  fnPlaceOrder(
    Ccy: string,
    NAV: any,
    FromToFundStr: string,
    transactionType: string,
    LTV: string
  ) {
    let RedemptionProceeds =
      parseFloat(this.SwitchUnits.replace(/,/g, '')) * parseFloat(NAV);
    let switchUnits = 0.0;
    let ModeofSettlement = '';
    let RealizedAmountUnits = 0.0;
    let ClientContribution: any = '';
    let bankContribution: string = '0.00';
    let FreezeAmount: number = 0;
    let SwitchFrom: string = '';
    let SwitchTo: string = '';
    let CurrencyDenominated: string = '';
    let FundCode: string = '';
    let TransactionTypeRq: string = '';
    let ApplicationType: string = '';

    const today = new Date();
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

    if (FromToFundStr === 'To') {
      switchUnits = RedemptionProceeds / NAV;
      RealizedAmountUnits = RedemptionProceeds / NAV;
      ModeofSettlement = 'SRS';
    } else {
      switchUnits = parseFloat(this.SwitchUnits.replace(/,/g, ''));
      RealizedAmountUnits = parseFloat(this.SwitchUnits.replace(/,/g, ''));
      ModeofSettlement = '';
    }

    if (transactionType === 'Subscription') {
      SwitchFrom = this.SelectedFunds[1].Code;
      SwitchTo = this.SelectedFunds[1].Code;
      FundCode = this.SelectedFunds[1].Code;
      CurrencyDenominated = this.SelectedFunds[1].Ccy;
      ApplicationType = 'SB';
      TransactionTypeRq = 'SB';
    } else {
      FundCode = this.SelectedFunds[0].Code;
      SwitchFrom = this.SelectedFunds[0].Code;
      SwitchTo = this.SelectedFunds[1].Code;
      CurrencyDenominated = this.SelectedFunds[0].Ccy;
      ApplicationType = 'RD';
      TransactionTypeRq = 'RD';
      LTV = '0';
    }

    let orderbasis = transactionType === 'Subscription' ? 'Amount' : 'Units';

    this.OrderParamsXML = '';

    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';
    this.OrderParamsXML = this.OrderParamsXML + '<RecordType>D</RecordType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Product</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationReferenceNumber>PIB' +
        this.Workflow_afs.getNewApplicationIDForMF(this.CustomerID) +
        '</ApplicationReferenceNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationType>' + ApplicationType + '</ApplicationType>');
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
      this.OrderParamsXML +
      ('<CIFNumber>' + this.Home_afs.CIF + '</CIFNumber>');
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
    this.OrderParamsXML = this.OrderParamsXML + '<Segment>BB</Segment>';
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
      this.OrderParamsXML + ('<FundCode>' + FundCode + '</FundCode>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ProductRiskScoreRp>01</ProductRiskScoreRp>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<CurrencyDenominated>' +
        CurrencyDenominated +
        '</CurrencyDenominated>');
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
      ('<TransactionType>' + TransactionTypeRq + '</TransactionType>');
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
      ('<PurchaseAmount>' + RedemptionProceeds + '</PurchaseAmount>');
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
      this.OrderParamsXML + ('<SwitchFrom>' + SwitchFrom + '</SwitchFrom>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchTo>' + SwitchTo + '</SwitchTo>');
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
      ('<FreezeAmount>' + FreezeAmount + '</FreezeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<OrderBasis>' + orderbasis + '</OrderBasis>');
    this.OrderParamsXML = this.OrderParamsXML + ('<LTV>' + LTV + '</LTV>');
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
      this.OrderParamsXML +
      ('<SwitchingId>' +
        Math.floor(Math.random() * 100 + 1) +
        '</SwitchingId>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Client_Contribution>' + ClientContribution + '</Client_Contribution>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Bank_Contribution>' + bankContribution + '</Bank_Contribution>');

    //  Added by Alolika G on 2nd Feb 2022. Params shared by Prachi P. --START
    if (this.FundVal === 'TL' || this.FundVal === 'PL') {
      this.OrderParamsXML =
        this.OrderParamsXML + ('<LoanCurrency>' + Ccy + '</LoanCurrency>');
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

    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';
    this.loadflag = true;

    this.Cust_afs.saveNewOrderFundSwitch(
      this.OrderParamsXML,
      this.Auth_afs.UserName,
      'funds_trade_setup',
      'Insert',
      0
    ).subscribe((res) => {
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
              // if (this.subscribeFlag === true) {

              if (transactionType === 'Redemption') {
                this.RedemptionOrderID = res.SaveUCPResult[0].NoteMasterID;
                this.fnPlaceOrder(
                  this.SelectedFunds[1].Ccy,
                  this.SelectedFunds[0].BidNAV,
                  'From',
                  'Subscription',
                  this.SelectedFunds[1].LTV
                );
              } else {
                this.SubscriptionOrderID = res.SaveUCPResult[0].NoteMasterID;
                this.successMsg =
                  'Order booked successfully with Ref No. ' +
                  this.RedemptionOrderID +
                  '(Redemption),' +
                  this.SubscriptionOrderID +
                  '(Subscription).';
                // this.successMsg = 'Redemption order '+ this.RedemptionOrderID +' and subscription order ' + this.SubscriptionOrderID + ' placed successfully.';
              }

              // }
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
  updateCcy() {}
  updatePortfolio() {}
}
